"use client";

import * as React from "react";
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Download,
  Copy,
  Check,
  Building2,
  Calendar,
  Lock,
  FileCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrustCertificate } from "@/lib/trust-data";

interface CertificateViewDialogProps {
  certificate: TrustCertificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateViewDialog({
  certificate,
  open,
  onOpenChange,
}: CertificateViewDialogProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open || !certificate) return null;

  function copyHash() {
    if (!certificate) return;
    navigator.clipboard.writeText(certificate.sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Background click to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Outer Frame */}
        <div className="relative rounded-lg border-2 border-brand/40 bg-background/95 p-6 sm:p-8 shadow-inner mt-2">
          {/* Corner Decorative Brackets */}
          <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-brand/60" />
          <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-brand/60" />
          <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-brand/60" />
          <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-brand/60" />

          {/* Certificate Header */}
          <div className="text-center border-b border-border/80 pb-5">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand ring-4 ring-brand/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand font-semibold">
              Official Regulatory Certificate of Registration
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl text-foreground font-semibold">
              {certificate.name}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
              Issued by {certificate.authority} ({certificate.country})
            </p>
          </div>

          {/* Certificate Body Details */}
          <div className="my-5 space-y-4 text-xs sm:text-sm">
            <div className="rounded-lg bg-secondary/50 p-4 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Official Entity & Licensee
              </p>
              <p className="mt-1 font-display text-base font-semibold text-foreground">
                {certificate.legalEntity}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Registration / License No:{" "}
                <span className="font-mono font-bold text-foreground">
                  {certificate.registrationNumber}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Scope of Authorization & Protection
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {certificate.officialScope}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="rounded-md border border-border p-2.5 bg-background">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Date of Certification
                </span>
                <span className="font-mono font-medium text-foreground">
                  {certificate.issueDate}
                </span>
              </div>
              <div className="rounded-md border border-border p-2.5 bg-background">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Valid Through / Next Audit
                </span>
                <span className="font-mono font-medium text-foreground">
                  {certificate.validUntil}
                </span>
              </div>
              <div className="rounded-md border border-border p-2.5 bg-background">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Jurisdiction
                </span>
                <span className="font-mono font-medium text-foreground">
                  {certificate.country} ({certificate.countryCode})
                </span>
              </div>
              <div className="rounded-md border border-border p-2.5 bg-background">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Independent Audit Firm
                </span>
                <span className="font-mono font-medium text-foreground">
                  {certificate.auditFirm}
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Proof */}
            <div className="mt-4 rounded-lg border border-brand/20 bg-brand/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-brand font-semibold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> SHA-256 Verifiable Checksum
                </span>
                <button
                  type="button"
                  onClick={copyHash}
                  className="flex items-center gap-1 text-[11px] text-brand hover:underline font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Hash
                    </>
                  )}
                </button>
              </div>
              <code className="mt-1 block font-mono text-[10px] text-muted-foreground break-all">
                {certificate.sha256Hash}
              </code>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="mt-6 pt-5 border-t border-border flex items-end justify-between">
            <div className="space-y-1">
              <div className="font-serif italic text-sm text-foreground/80">
                Eleanor Vance, LL.M.
              </div>
              <div className="h-px w-32 bg-border" />
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Chief Compliance Officer
              </p>
            </div>

            {/* Holographic Seal Stamp */}
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-brand bg-brand/10 text-brand">
                <div className="text-center">
                  <span className="block text-[7px] font-bold tracking-widest uppercase">
                    VERIFIED
                  </span>
                  <span className="block text-[9px] font-mono font-bold">2026</span>
                  <span className="block text-[6px] uppercase text-muted-foreground">
                    NEXAVORA
                  </span>
                </div>
              </div>
              <span className="text-[8px] text-emerald-400 font-mono mt-1 font-bold">
                ● ACTIVE SEAL
              </span>
            </div>

            <div className="space-y-1 text-right">
              <div className="font-serif italic text-sm text-foreground/80">
                Dr. Arthur Pendelton
              </div>
              <div className="h-px w-32 bg-border ml-auto" />
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Global Regulatory Auditor
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-brand" />
            Publicly verifiable via official state registrar.
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Download className="h-3.5 w-3.5 mr-1" />
              Print / Save
            </Button>
            <Button size="sm" variant="brand" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
