"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Lock,
  FileText,
  CheckCircle2,
  Building,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { internationalCertificates, type TrustCertificate } from "@/lib/trust-data";
import { CertificateViewDialog } from "./certificate-view-dialog";

export function TrustLicensesSection() {
  const [selectedCert, setSelectedCert] = React.useState<TrustCertificate | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleOpenCert(cert: TrustCertificate) {
    setSelectedCert(cert);
    setDialogOpen(true);
  }

  return (
    <section className="border-b border-border bg-card/40 py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              <ShieldCheck className="h-4 w-4" />
              <span>International Regulatory & Escrow Compliance</span>
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">
              Official Trusted Licenses & Security Certifications
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              NEXAVORA operates under accredited international escrow regulations, FinCEN MSB registration,
              and ISO/IEC 27001 data protection standards. Every dollar and token held in escrow is legally segregated and protected.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/certificates">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                View All Audits
              </Link>
            </Button>
            <Button variant="brand" size="sm" asChild>
              <Link href="/kyc">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Seller KYC Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {internationalCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-brand/60 hover:shadow-lg"
            >
              <div>
                {/* Top unboxed metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-4 border-b border-border/60">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Globe2 className="h-3.5 w-3.5 text-brand" />
                    {cert.country}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {cert.status}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand">
                    {cert.category}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-brand transition-colors">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {cert.authority}
                  </p>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {cert.description}
                </p>

                {/* Registration code box */}
                <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs border border-border">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] uppercase">Official License ID</span>
                    <span className="text-[10px] uppercase font-mono">{cert.validUntil}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs font-bold text-foreground">
                    {cert.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">
                  Audited by {cert.auditFirm.split(" ")[0]}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-brand hover:text-brand hover:bg-brand/10"
                  onClick={() => handleOpenCert(cert)}
                >
                  Inspect Certificate →
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-base font-semibold">100% Segregated Escrow Guarantee</h4>
              <p className="text-xs text-muted-foreground">
                All client funds are held in segregated, multi-signature custody accounts in accordance with FinCEN & FCA client asset rules.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-muted-foreground">
            <span>Cold-Storage Escrow</span>
            <span>·</span>
            <span>Zero Platform Commingling</span>
            <span>·</span>
            <span>Independent Proof of Reserves</span>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <CertificateViewDialog
        certificate={selectedCert}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}
