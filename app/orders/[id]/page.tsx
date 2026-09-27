"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OrderStatusBadge } from "../page";
import { formatPrice } from "@/lib/utils";
import { logActivityEvent } from "@/lib/activity-store";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params?.id || "ord-101");

  const [status, setStatus] = React.useState<
    "pending_payment" | "in_progress" | "delivered" | "completed" | "disputed"
  >(orderId.includes("103") ? "pending_payment" : orderId.includes("102") ? "completed" : "in_progress");

  const [txid, setTxid] = React.useState("");
  const [deliveryNote, setDeliveryNote] = React.useState("");
  const [disputeReason, setDisputeReason] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [showDisputeModal, setShowDisputeModal] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const depositAddress = "0xc55b66fef8b19730d2208084c47fce226c3587aa";

  function copyAddress() {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!txid.trim()) return;
    setStatus("in_progress");
    logActivityEvent({
      type: "order_status",
      title: `Deposit Submitted for Order #${orderId.toUpperCase()}`,
      description: `Blockchain transaction hash submitted: ${txid.slice(0, 16)}... Escrow custody active.`,
      timestamp: new Date().toISOString(),
      badgeText: "Deposit Pending",
      badgeVariant: "brand",
      linkHref: `/orders/${orderId}`,
      linkText: "View Order",
      actor: "You (Buyer)",
    });
    setMessage("Payment submitted for verification. Escrow will lock upon 1 blockchain confirmation.");
  }

  function handleDeliverWork(e: React.FormEvent) {
    e.preventDefault();
    setStatus("delivered");
    logActivityEvent({
      type: "order_status",
      title: `Deliverables Uploaded for Order #${orderId.toUpperCase()}`,
      description: deliveryNote ? `Delivery note: “${deliveryNote}”` : "Seller submitted project assets for approval.",
      timestamp: new Date().toISOString(),
      badgeText: "Delivered",
      badgeVariant: "brand",
      linkHref: `/orders/${orderId}`,
      linkText: "Review Files",
      actor: "Seller",
    });
    setMessage("Work marked as delivered. Buyer has 72 hours to verify deliverables.");
  }

  function handleReleaseFunds() {
    setStatus("completed");
    logActivityEvent({
      type: "order_status",
      title: `Order #${orderId.toUpperCase()} Approved & Completed`,
      description: "Buyer approved work quality. Escrow released payment directly to seller balance.",
      timestamp: new Date().toISOString(),
      badgeText: "Completed",
      badgeVariant: "success",
      linkHref: `/orders/${orderId}`,
      linkText: "View Receipt",
      actor: "Escrow Smart Release",
    });
    setMessage("Funds released to seller! Order successfully completed.");
  }

  function handleOpenDispute(e: React.FormEvent) {
    e.preventDefault();
    setStatus("disputed");
    setShowDisputeModal(false);
    logActivityEvent({
      type: "order_status",
      title: `Dispute Case Opened: Order #${orderId.toUpperCase()}`,
      description: disputeReason ? `Grounds: “${disputeReason}”` : "Arbitration requested. Escrow funds placed in legal lock.",
      timestamp: new Date().toISOString(),
      badgeText: "Disputed",
      badgeVariant: "destructive",
      linkHref: `/orders/${orderId}`,
      linkText: "Arbitration Case",
      actor: "Buyer Dispute Desk",
    });
    setMessage("Dispute ticket opened. NEXAVORA arbitrator is reviewing communication logs.");
  }

  return (
    <div className="container max-w-4xl py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/orders">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </Button>

      {message && (
        <div className="mb-6 rounded-lg border border-brand/40 bg-brand/10 p-4 text-sm text-foreground flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-xs text-muted-foreground hover:text-foreground">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl">Order #{orderId.toUpperCase()}</h1>
            <OrderStatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete brand identity package: logo, palette, type system
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Escrow Amount</p>
          <p className="font-mono text-2xl font-bold text-brand">$420.00 USD</p>
        </div>
      </div>

      {/* Escrow Progress Timeline */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg mb-6">Escrow Lifecycle</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <TimelineStep
            step="1"
            title="Order Created"
            desc="Buyer agreed terms"
            completed={true}
          />
          <TimelineStep
            step="2"
            title="Deposit in Escrow"
            desc="Funds locked safely"
            completed={status !== "pending_payment"}
            active={status === "pending_payment"}
          />
          <TimelineStep
            step="3"
            title="Work & Delivery"
            desc="Seller delivers files"
            completed={status === "delivered" || status === "completed"}
            active={status === "in_progress"}
          />
          <TimelineStep
            step="4"
            title="Released"
            desc="Buyer approves release"
            completed={status === "completed"}
            active={status === "delivered"}
          />
        </div>
      </div>

      {/* Action Sections based on state */}
      <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {status === "pending_payment" && (
            <div className="rounded-xl border border-warning/40 bg-warning/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-warning font-semibold">
                <AlertTriangle className="h-5 w-5" />
                <span>Action Required: Send Escrow Deposit</span>
              </div>
              <p className="text-xs text-muted-foreground">
                To start this order, send <strong>$420.00 USDT (BEP20)</strong> to the smart escrow address below:
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5">
                <code className="flex-1 font-mono text-xs break-all">{depositAddress}</code>
                <Button size="sm" variant="ghost" onClick={copyAddress}>
                  {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <form onSubmit={handleConfirmDeposit} className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Paste Blockchain Transaction Hash / TXID:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="0x7f23... transaction hash"
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="brand">
                    Verify Deposit
                  </Button>
                </div>
              </form>
            </div>
          )}

          {status === "in_progress" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-brand font-semibold">
                <Lock className="h-5 w-5" />
                <span>Funds Locked in Escrow ($420.00)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Work is actively in progress. The seller has been notified to produce and deliver the files.
              </p>
              <form onSubmit={handleDeliverWork} className="space-y-3 pt-4 border-t border-border">
                <label className="text-xs font-semibold text-foreground block">
                  Seller Delivery Action (Deliver Work)
                </label>
                <Textarea
                  placeholder="Paste deliverable download links (Google Drive, GitHub, Figma, Dropbox) and delivery notes..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  required
                />
                <Button type="submit" variant="brand" className="w-full">
                  Submit Deliverable to Buyer
                </Button>
              </form>
            </div>
          )}

          {status === "delivered" && (
            <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                <span>Work Delivered — Ready for Your Review</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The seller has delivered the project files. Please inspect the deliverables. Once satisfied, click Release Funds to pay the seller.
              </p>
              <div className="rounded-lg bg-card border border-border p-3 text-xs text-muted-foreground">
                <strong>Delivery Note:</strong> &ldquo;Completed full brand asset pack with Figma file, vector SVG/PDF logos, and typography guideline.&rdquo;
              </div>
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Button variant="brand" className="flex-1" onClick={handleReleaseFunds}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve & Release Payment
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDisputeModal(true)}
                >
                  Open Dispute
                </Button>
              </div>
            </div>
          )}

          {status === "completed" && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-foreground">Order Completed</h3>
              <p className="text-sm text-muted-foreground">
                Payment has been released to the seller. Both parties have verified completion.
              </p>
            </div>
          )}

          {status === "disputed" && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <AlertTriangle className="h-5 w-5" />
                <span>Dispute Under Arbitration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Escrow funds remain frozen. A NEXAVORA moderator is reviewing the requirements, communication history, and deliverables to issue a final verdict.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-display text-base">Trade Summary</h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Seller</span>
                <span className="font-medium text-foreground">Marlowe Studio</span>
              </div>
              <div className="flex justify-between">
                <span>Buyer</span>
                <span className="font-medium text-foreground">You</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="font-medium text-foreground">BNB Smart Chain (BEP20)</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Status</span>
                <span className="font-medium text-brand">{status.replace("_", " ").toUpperCase()}</span>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/messages?recipient=Marlowe%20Studio">
                  <MessageSquare className="h-4 w-4 mr-2" /> Message Seller
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  step,
  title,
  desc,
  completed,
  active,
}: {
  step: string;
  title: string;
  desc: string;
  completed?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3.5 transition-colors ${
        completed
          ? "border-brand/40 bg-brand/5"
          : active
          ? "border-brand bg-card"
          : "border-border bg-card/40 opacity-60"
      }`}
    >
      <div className="flex items-center gap-2 font-mono text-xs">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
            completed ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {completed ? "✓" : step}
        </span>
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{desc}</p>
    </div>
  );
}
