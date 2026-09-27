import { NextRequest } from "next/server";
import crypto from "node:crypto";

// Whole-number floats (1.0) -> integers (1), recursively. Matches Didit's server canonicalisation.
function shortenFloats(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shortenFloats);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, shortenFloats(x)])
    );
  }
  if (typeof v === "number" && !Number.isInteger(v) && v % 1 === 0) return Math.trunc(v);
  return v;
}

// Recursive lexicographic key sort (array order preserved).
function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    return Object.keys(v as object)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortKeys((v as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  return v;
}

const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const sig = req.headers.get("x-signature-v2") ?? "";
    const ts = Number(req.headers.get("x-timestamp"));
    const secret = process.env.DIDIT_WEBHOOK_SECRET;

    // 1. Freshness check (300s window) if timestamp is provided
    if (ts && Math.abs(Date.now() / 1000 - ts) > 300) {
      return new Response("stale timestamp", { status: 401 });
    }

    const parsed = JSON.parse(raw);

    // 2. Signature verification if secret is configured
    if (secret && sig) {
      const canonical = JSON.stringify(sortKeys(shortenFloats(parsed)));
      const expected = crypto
        .createHmac("sha256", secret)
        .update(canonical, "utf8")
        .digest("hex");

      if (
        sig.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
      ) {
        return new Response("bad sig", { status: 401 });
      }
    }

    // 3. Idempotency deduplication
    if (parsed.event_id && processedEvents.has(parsed.event_id)) {
      return new Response("ok (already processed)");
    }
    if (parsed.event_id) {
      processedEvents.add(parsed.event_id);
      // Keep memory bound
      if (processedEvents.size > 2000) {
        const first = processedEvents.values().next().value;
        if (first) processedEvents.delete(first);
      }
    }

    console.log(
      `[Didit Webhook Event] status=${parsed.status}, vendor_data=${parsed.vendor_data}, session_id=${parsed.session_id}`
    );

    // Return 200 OK fast
    return new Response("ok", { status: 200 });
  } catch (err: any) {
    console.error("[Didit Webhook Error]", err);
    return new Response("webhook processing error", { status: 500 });
  }
}
