import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustLicensesSection } from "@/components/trust/trust-licenses-section";

export const metadata: Metadata = {
  title: "Official Regulatory Certificates & Licenses",
  description:
    "Explore NEXAVORA's official international regulatory licenses, FinCEN MSB registration, ISO/IEC 27001 certificate, and FCA escrow compliance.",
};

export default function CertificatesPage() {
  return (
    <div className="py-8">
      <div className="container mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Home
          </Link>
        </Button>
      </div>

      <TrustLicensesSection />

      <div className="container py-12 max-w-4xl space-y-6">
        <h3 className="font-display text-2xl">Compliance & Trust Framework</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          NEXAVORA is structured to provide institutional-grade protection for buyers and sellers across digital asset corridors.
          Every transaction is governed by programmable smart escrow and verified seller identity checks.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h4 className="font-semibold text-sm">Regulatory Custody Segregation</h4>
            <p className="text-xs text-muted-foreground">
              Buyer deposits are never pooled with platform operational funds. Escrow vaults require multi-signature approval or buyer receipt confirmation.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h4 className="font-semibold text-sm">Mandatory Seller KYC</h4>
            <p className="text-xs text-muted-foreground">
              Sellers must submit valid government-issued National ID (NID), Passport, or Driver&apos;s License verified against global identity databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
