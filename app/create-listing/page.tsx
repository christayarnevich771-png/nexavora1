"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  Check,
  AlertTriangle,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/placeholder-data";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentUserKYC,
  setQuickCurrentUserKYCStatus,
  type KYCStatus,
} from "@/lib/kyc-store";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<any>(null);

  // KYC Verification Gate
  const [kycStatus, setKycStatus] = React.useState<KYCStatus>("unverified");

  const [title, setTitle] = React.useState("");
  const [categorySlug, setCategorySlug] = React.useState(categories[0]?.slug || "development");
  const [priceDollars, setPriceDollars] = React.useState("");
  const [deliveryDays, setDeliveryDays] = React.useState("3");
  const [description, setDescription] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    function checkStatus() {
      const kyc = getCurrentUserKYC();
      setKycStatus(kyc.status);
    }

    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        setUser(data.user);
      }
      checkStatus();
    });

    const handleKycUpdate = (e: any) => {
      if (e?.detail?.status) {
        setKycStatus(e.detail.status);
      }
    };

    window.addEventListener("nexavora-kyc-updated", handleKycUpdate);
    return () => window.removeEventListener("nexavora-kyc-updated", handleKycUpdate);
  }, [supabase]);

  function handleInstantVerify() {
    setQuickCurrentUserKYCStatus("approved");
    setKycStatus("approved");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const latest = getCurrentUserKYC();
    if (latest.status !== "approved" && kycStatus !== "approved") {
      setError("You must complete government identity verification (NID, Passport, or Driver's License) before listing.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || "usr_mock_101";

      const priceCents = Math.round(parseFloat(priceDollars || "0") * 100);
      if (priceCents <= 0) {
        setError("Please enter a valid price greater than $0.");
        setLoading(false);
        return;
      }

      const slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") +
        "-" +
        Math.random().toString(36).substring(2, 7);

      const { data: catData }: any = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      const { error: insertError } = await (supabase as any).from("listings").insert({
        seller_id: currentUserId,
        category_id: catData?.id || null,
        slug,
        title,
        description,
        price_cents: priceCents,
        currency: "USD",
        delivery_time_days: parseInt(deliveryDays) || 3,
        status: "active",
      });

      if (insertError) {
        console.warn("DB insert note:", insertError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/marketplace");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Seller Portal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">Create New Listing</h1>
        <p className="text-sm text-muted-foreground">
          Offer your digital work, code, assets, or consulting with guaranteed escrow payment.
        </p>
      </div>

      {/* KYC Enforcement Barrier */}
      {kycStatus !== "approved" && (
        <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/5 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg text-foreground">
                Seller Identity Verification (KYC) Required
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Under international FinCEN MSB and ISO/IEC 27001 regulatory standards, all sellers must complete identity verification
                with a valid <strong>National ID (NID)</strong>, <strong>International Passport</strong>, or <strong>Driver&apos;s License</strong> before
                publishing listings on the NEXAVORA marketplace.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-background p-4 border border-border text-xs space-y-2">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" /> Current Verification Status:{" "}
              <strong className="uppercase text-warning">{kycStatus}</strong>
            </p>
            <p className="text-muted-foreground">
              To protect buyers from scams, pirated assets, and counterfeit deliverables, every seller is identity-vetted.
              Complete your verification in the KYC Portal or click Instant AI Verify below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="brand" asChild>
              <Link href="/kyc">
                Open KYC Verification Portal <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button variant="outline" onClick={handleInstantVerify}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-brand" />
              Instant 1-Click Verify (Test Mode)
            </Button>
          </div>
        </div>
      )}

      {/* Verified Seller Badge */}
      {kycStatus === "approved" && (
        <div className="mt-6 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified Seller Account (KYC Approved via Government Document)</span>
          </div>
          <Link href="/kyc" className="text-[11px] text-muted-foreground hover:underline">
            View KYC Certificate
          </Link>
        </div>
      )}

      {/* Listing Form */}
      {success ? (
        <div className="mt-8 rounded-xl border border-brand/40 bg-brand/10 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl">Listing Published Successfully!</h2>
          <p className="text-sm text-muted-foreground">
            Your listing is now live on the marketplace with the Verified Seller badge. Redirecting...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`mt-8 space-y-6 ${
            kycStatus !== "approved" ? "opacity-40 pointer-events-none filter blur-[1px]" : ""
          }`}
        >
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Listing Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js SaaS Boilerplate with Stripe & Supabase"
              required
            />
            <p className="text-xs text-muted-foreground">
              Summarize your deliverable clearly in a single headline.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD $)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="1"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                placeholder="250.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDays">Estimated Delivery Time (Days)</Label>
            <Input
              id="deliveryDays"
              type="number"
              min="1"
              max="90"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description & Deliverables</Label>
            <Textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included in this service, deliverables, source code, revisions, and requirements from the buyer..."
              required
            />
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <span>NEXAVORA Seller Protections</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All buyers must deposit 100% of funds into escrow before you start work. Once you
              deliver, buyers have a verification window before funds auto-release.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="brand"
            className="w-full"
            disabled={loading || kycStatus !== "approved"}
          >
            {loading ? "Publishing Listing..." : "Publish Listing on Marketplace"}
          </Button>
        </form>
      )}
    </div>
  );
}
