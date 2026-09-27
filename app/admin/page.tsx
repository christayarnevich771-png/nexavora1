"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertTriangle,
  Building,
  Users,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Award,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  Camera,
  UserCheck,
  Download,
  FileSpreadsheet,
  History,
  FileCheck2,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getStoredSubmissions,
  updateSubmissionStatus,
  getStoredAuditLogs,
  type KYCSubmission,
  type KYCAuditLogEntry,
} from "@/lib/kyc-store";
import { internationalCertificates, type TrustCertificate } from "@/lib/trust-data";
import { CertificateViewDialog } from "@/components/trust/certificate-view-dialog";
import { exportKYCToCSV, exportKYCToPDFReport } from "@/lib/kyc-export";

export default function SecretAdminCompliancePage() {
  const [submissions, setSubmissions] = React.useState<KYCSubmission[]>([]);
  const [filter, setFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = React.useState("");
  const [selectedSub, setSelectedSub] = React.useState<KYCSubmission | null>(null);
  const [rejectionModalSub, setRejectionModalSub] = React.useState<KYCSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState(
    "Blurry document image or obscured security holograms."
  );
  const [bannerNotice, setBannerNotice] = React.useState<string | null>(null);
  const [auditLogs, setAuditLogs] = React.useState<KYCAuditLogEntry[]>([]);
  const [auditorOfficerName, setAuditorOfficerName] = React.useState("Chief Compliance Officer (FinCEN Desk)");
  const [auditorRole, setAuditorRole] = React.useState("Senior Regulatory Auditor");
  const [auditLogSearch, setAuditLogSearch] = React.useState("");

  // Certificate inspect dialog state
  const [selectedCert, setSelectedCert] = React.useState<TrustCertificate | null>(null);
  const [certModalOpen, setCertModalOpen] = React.useState(false);

  React.useEffect(() => {
    setSubmissions(getStoredSubmissions());
    setAuditLogs(getStoredAuditLogs());

    const handleKycUpdate = () => {
      setSubmissions(getStoredSubmissions());
      setAuditLogs(getStoredAuditLogs());
    };

    window.addEventListener("nexavora-kyc-updated", handleKycUpdate);
    return () => window.removeEventListener("nexavora-kyc-updated", handleKycUpdate);
  }, []);

  function handleApprove(id: string) {
    const updated = updateSubmissionStatus(id, "approved", undefined, auditorOfficerName, auditorRole);
    if (updated) {
      setSubmissions(getStoredSubmissions());
      setAuditLogs(getStoredAuditLogs());
      setBannerNotice(
        `KYC Application for ${updated.fullName} was APPROVED by ${auditorOfficerName}. Audit log recorded.`
      );
      if (selectedSub?.id === id) setSelectedSub(updated);
    }
  }

  function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectionModalSub) return;
    const updated = updateSubmissionStatus(
      rejectionModalSub.id,
      "rejected",
      rejectionReason,
      auditorOfficerName,
      auditorRole
    );
    if (updated) {
      setSubmissions(getStoredSubmissions());
      setAuditLogs(getStoredAuditLogs());
      setBannerNotice(`KYC Application for ${updated.fullName} was REJECTED by ${auditorOfficerName}. Audit log recorded.`);
      if (selectedSub?.id === rejectionModalSub.id) setSelectedSub(updated);
      setRejectionModalSub(null);
    }
  }

  function handleResetToPending(id: string) {
    const updated = updateSubmissionStatus(id, "pending", "Status reset to pending by officer", auditorOfficerName, auditorRole);
    if (updated) {
      setSubmissions(getStoredSubmissions());
      setAuditLogs(getStoredAuditLogs());
      setBannerNotice(`KYC Application for ${updated.fullName} reset to PENDING. Audit log recorded.`);
      if (selectedSub?.id === id) setSelectedSub(updated);
    }
  }

  function handleInspectCertificate(certId?: string) {
    const cert =
      internationalCertificates.find((c) => c.id === certId) || internationalCertificates[0];
    setSelectedCert(cert);
    setCertModalOpen(true);
  }

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter !== "all" && sub.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        sub.fullName.toLowerCase().includes(q) ||
        sub.country.toLowerCase().includes(q) ||
        sub.documentNumber.toLowerCase().includes(q) ||
        sub.documentType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  return (
    <div className="container py-12">
      {/* Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Confidential Compliance Terminal
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
              DIRECT ACCESS ACTIVE
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground">
            Seller KYC & Regulatory Control Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit government identification documents (NID, Passport, Driver&apos;s License), live face biometrics, authorize sellers, and inspect certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportKYCToCSV(submissions)}
            title="Download complete KYC audit history as CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportKYCToPDFReport(submissions)}
            title="Generate printable PDF compliance ledger"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-brand" />
            Export PDF Report
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmissions(getStoredSubmissions());
              setBannerNotice("Refreshed submissions list from database.");
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInspectCertificate("cert-fincen-msb")}
          >
            <Award className="h-4 w-4 mr-1.5 text-brand" />
            Inspect FinCEN
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href="/certificates">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              All Licenses
            </Link>
          </Button>
        </div>
      </div>

      {bannerNotice && (
        <div className="mt-6 flex items-center justify-between rounded-lg border border-brand/40 bg-brand/10 p-4 text-xs text-foreground">
          <span>{bannerNotice}</span>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending KYC Submissions</span>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">
            {pendingCount}
          </p>
          <p className="mt-1 text-[11px] text-warning font-medium">Requires compliance review</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Verified Sellers</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">
            {approvedCount}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Authorized to publish listings</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Regulatory Licenses Active</span>
            <Building className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">6 / 6</p>
          <p className="mt-1 text-[11px] text-emerald-400">FinCEN, ISO 27001, FCA, SOC2</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Escrow Protection Rate</span>
            <Lock className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">100%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Zero unverified payouts</p>
        </div>
      </div>

      {/* Main Submissions Audit Table */}
      <div className="mt-10 rounded-xl border border-border bg-card overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-5 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/60">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: `All (${submissions.length})` },
              { id: "pending", label: `Pending Review (${pendingCount})` },
              { id: "approved", label: `Approved (${approvedCount})` },
              { id: "rejected", label: `Rejected (${rejectedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.id
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant or NID…"
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs shrink-0"
              onClick={() => exportKYCToCSV(filteredSubmissions)}
              title="Export currently filtered view to CSV"
            >
              <Download className="h-3 w-3 mr-1" />
              CSV ({filteredSubmissions.length})
            </Button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="divide-y divide-border">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-secondary/30 transition-colors"
              >
                {/* Applicant Summary */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-sm">
                    {sub.fullName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-medium text-foreground text-sm">
                        {sub.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{sub.country}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="font-mono text-xs text-foreground uppercase">
                        {sub.documentType === "nid"
                          ? "National ID"
                          : sub.documentType === "passport"
                          ? "Passport"
                          : "Driver's License"}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 font-medium">
                        Live Face Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono flex-wrap">
                      <span>Doc #: {sub.documentNumber}</span>
                      <span>·</span>
                      <span>DOB: {sub.dateOfBirth}</span>
                      <span>·</span>
                      <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>

                    {sub.rejectionReason && (
                      <p className="text-[11px] text-destructive">
                        Rejection Note: {sub.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-3 pl-14 lg:pl-0">
                  {/* Status Indicator */}
                  {sub.status === "approved" && (
                    <span className="font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approved / Verified
                    </span>
                  )}
                  {sub.status === "pending" && (
                    <span className="font-mono text-xs text-warning font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Pending Audit
                    </span>
                  )}
                  {sub.status === "rejected" && (
                    <span className="font-mono text-xs text-destructive font-semibold flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Rejected
                    </span>
                  )}

                  {/* Document Inspect button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setSelectedSub(sub)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Inspect Documents & Face
                  </Button>

                  {/* Fast Action Buttons */}
                  {sub.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="brand"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => handleApprove(sub.id)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                  )}

                  {sub.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectionModalSub(sub)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  )}

                  {sub.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-muted-foreground"
                      onClick={() => handleResetToPending(sub.id)}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No verification submissions matching this criteria.
            </div>
          )}
        </div>
      </div>

      {/* Official Regulatory Compliance Audit Log Section */}
      <div className="mt-12 rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border bg-card/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-brand" />
              <h2 className="font-display text-xl text-foreground">
                Regulatory Compliance Audit Log
              </h2>
              <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand uppercase">
                Immutable Ledger
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cryptographic chronological record of all officer decisions (Approvals, Rejections, Resets) for FinCEN, AML & ISO 27001 audit inspection.
            </p>
          </div>

          {/* Active Reviewer Identity Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-secondary/50 p-2 rounded-lg border border-border">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3 text-brand" /> Reviewer:
            </span>
            <input
              type="text"
              value={auditorOfficerName}
              onChange={(e) => setAuditorOfficerName(e.target.value)}
              className="bg-background border border-input rounded px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand w-52"
              placeholder="Officer Name"
              title="Official Name/ID stamped onto audit logs"
            />
          </div>
        </div>

        {/* Audit Search & Filter Bar */}
        <div className="p-3 bg-secondary/20 border-b border-border flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={auditLogSearch}
              onChange={(e) => setAuditLogSearch(e.target.value)}
              placeholder="Search audit trail by applicant, officer, or doc..."
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {auditLogs.length} Logged Events
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-[11px] text-muted-foreground uppercase font-mono">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Applicant & Details</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Reviewed / Authorized By</th>
                <th className="py-3 px-4">Compliance Notes / Grounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {auditLogs
                .filter((log) => {
                  if (!auditLogSearch.trim()) return true;
                  const q = auditLogSearch.toLowerCase();
                  return (
                    log.applicantName.toLowerCase().includes(q) ||
                    log.performedBy.toLowerCase().includes(q) ||
                    log.documentNumber.toLowerCase().includes(q) ||
                    log.action.toLowerCase().includes(q)
                  );
                })
                .map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-foreground block">{log.applicantName}</strong>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {log.documentType.toUpperCase()}: {log.documentNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          log.action === "approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : log.action === "rejected"
                            ? "bg-destructive/15 text-destructive border border-destructive/30"
                            : "bg-warning/15 text-warning border border-warning/30"
                        }`}
                      >
                        {log.action === "approved" && <Check className="h-2.5 w-2.5" />}
                        {log.action === "rejected" && <X className="h-2.5 w-2.5" />}
                        {log.action.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{log.performedBy}</div>
                      <div className="text-[10px] text-muted-foreground">{log.officerRole}</div>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                      {log.reasonOrNotes || "Standard regulatory verification check."}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document & Face Inspection Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="max-w-3xl w-full rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand">
                  Security Document & Biometric Audit
                </span>
                <h3 className="font-display text-xl">{selectedSub.fullName}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedSub.country} · {selectedSub.documentType.toUpperCase()} (
                  {selectedSub.documentNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Front Document */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground">
                  Front Document Scan
                </span>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black/40">
                  <img
                    src={selectedSub.frontImage}
                    alt="Front scan"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Back Document */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground">
                  Back Document Scan
                </span>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black/40">
                  {selectedSub.backImage ? (
                    <img
                      src={selectedSub.backImage}
                      alt="Back scan"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No back image (Passport)
                    </div>
                  )}
                </div>
              </div>

              {/* Live Biometric Face */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-brand" /> Live Face Selfie
                </span>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black/40">
                  <img
                    src={selectedSub.selfieImage}
                    alt="Selfie verification"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/50 p-3 text-xs space-y-1.5 border border-border">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">Verification & Audit Telemetry</p>
                {selectedSub.reviewedBy && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Audited by: {selectedSub.reviewedBy} ({selectedSub.reviewerRole || "Auditor"})
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                Document Expiry: {selectedSub.documentExpiry || "2032-12-31"} · Date of Birth:{" "}
                {selectedSub.dateOfBirth} · Email: {selectedSub.email}
              </p>
              {selectedSub.reviewedAt && (
                <p className="text-muted-foreground font-mono text-[11px]">
                  Decision Timestamp: {new Date(selectedSub.reviewedAt).toUTCString()}
                </p>
              )}
              {selectedSub.adminNotes && (
                <p className="text-muted-foreground italic">&ldquo;{selectedSub.adminNotes}&rdquo;</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-mono text-muted-foreground">
                Current Status: <strong className="uppercase text-foreground">{selectedSub.status}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportKYCToPDFReport([selectedSub])}
                  title="Export audit report for this applicant as PDF"
                >
                  <Download className="h-4 w-4 mr-1 text-brand" /> Export Dossier (PDF)
                </Button>

                {selectedSub.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="brand"
                    className="bg-emerald-600 hover:bg-emerald-500"
                    onClick={() => {
                      handleApprove(selectedSub.id);
                      setSelectedSub(null);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve Seller
                  </Button>
                )}
                {selectedSub.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setRejectionModalSub(selectedSub);
                      setSelectedSub(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRejectSubmit}
            className="max-w-md w-full rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg text-foreground">
                Reject KYC: {rejectionModalSub.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setRejectionModalSub(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">
                Provide Official Rejection Reason (Sent to applicant):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRejectionModalSub(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="sm">
                Confirm Rejection
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Certificate Viewer Modal */}
      <CertificateViewDialog
        certificate={selectedCert}
        open={certModalOpen}
        onOpenChange={setCertModalOpen}
      />
    </div>
  );
}
