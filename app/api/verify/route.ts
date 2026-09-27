import { NextRequest, NextResponse } from "next/server";

// Per-session workflow configuration
const WORKFLOW_ID = "45fdb7d5-3ac7-443d-8f03-9a8d8a4fe97b";
const DIDIT_API_KEY =
  process.env.DIDIT_API_KEY || "piXPlZ9hpS0PopVrGSNIIbbeynbY7DKeVdWe3uQDbjI";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const vendorData = body.vendorData || `vendor_${Date.now()}`;
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/kyc?didit_done=true`;

    const res = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: {
        "x-api-key": DIDIT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        vendor_data: vendorData,
        callback: callbackUrl,
        metadata: {
          platform: "NEXAVORA Escrow & Marketplace",
          applicant_name: body.fullName || "Seller Applicant",
          applicant_email: body.email || "",
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[Didit API Error]", res.status, detail);
      return NextResponse.json(
        { error: "session_create_failed", detail },
        { status: 502 }
      );
    }

    const session = await res.json();
    return NextResponse.json({
      url: session.url,
      session_id: session.session_id,
      session_token: session.session_token,
      vendor_data: session.vendor_data,
    });
  } catch (error: any) {
    console.error("[Didit Route Exception]", error);
    return NextResponse.json(
      { error: "internal_server_error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
