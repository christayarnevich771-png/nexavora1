"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Filter,
  Sparkles,
  Lock,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import {
  getStoredActivities,
  logActivityEvent,
  type ActivityEvent,
  type ActivityType,
} from "@/lib/activity-store";
import { Button } from "@/components/ui/button";

function getRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recent";
  }
}

export function RecentActivityFeed({ maxItems = 6 }: { maxItems?: number }) {
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [filter, setFilter] = React.useState<"all" | ActivityType>("all");
  const [isSimulating, setIsSimulating] = React.useState(false);

  const refreshActivities = React.useCallback(() => {
    setActivities(getStoredActivities());
  }, []);

  React.useEffect(() => {
    refreshActivities();

    const handleUpdate = () => refreshActivities();
    window.addEventListener("nexavora-activity-updated", handleUpdate);
    window.addEventListener("nexavora-kyc-updated", handleUpdate);

    return () => {
      window.removeEventListener("nexavora-activity-updated", handleUpdate);
      window.removeEventListener("nexavora-kyc-updated", handleUpdate);
    };
  }, [refreshActivities]);

  const filtered = activities.filter((act) => {
    if (filter === "all") return true;
    return act.type === filter;
  });

  const displayedActivities = filtered.slice(0, maxItems);

  function simulateNewEvent(type: "order" | "message") {
    setIsSimulating(true);
    if (type === "order") {
      logActivityEvent({
        type: "order_status",
        title: "Order Status: Work Milestone Submitted",
        description: "Seller has uploaded milestone preview assets for review. Escrow remains protected.",
        timestamp: new Date().toISOString(),
        badgeText: "Milestone",
        badgeVariant: "brand",
        linkHref: "/orders",
        linkText: "Review Milestone",
        actor: "Freelancer Dispatch",
      });
    } else {
      logActivityEvent({
        type: "message",
        title: "New Client Inquiry Received",
        description: "“Hi, can you deliver the brand guide with custom Figma tokens included?”",
        timestamp: new Date().toISOString(),
        badgeText: "New Inquiry",
        badgeVariant: "outline",
        linkHref: "/orders",
        linkText: "Reply",
        actor: "Elena Rostova",
      });
    }
    setTimeout(() => {
      refreshActivities();
      setIsSimulating(false);
    }, 150);
  }

  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case "order_status":
        return <ShoppingBag className="h-4 w-4 text-brand" />;
      case "kyc_milestone":
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-sky-400" />;
      case "payout_escrow":
        return <Lock className="h-4 w-4 text-amber-400" />;
      case "security_alert":
        return <ShieldCheck className="h-4 w-4 text-indigo-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeClass = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "destructive":
        return "bg-destructive/15 text-destructive border border-destructive/25";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "brand":
        return "bg-brand/15 text-brand border border-brand/30";
      default:
        return "bg-secondary text-muted-foreground border border-border";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Feed Header */}
      <div className="p-5 border-b border-border bg-card/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            <h2 className="font-display text-lg text-foreground">Recent Activity</h2>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live stream" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time feed of order status shifts, buyer messages, and regulatory KYC updates.
          </p>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "All" },
            { id: "order_status", label: "Orders" },
            { id: "message", label: "Messages" },
            { id: "kyc_milestone", label: "KYC Milestones" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === tab.id
                  ? "bg-brand text-brand-foreground font-semibold"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List Items */}
      <div className="divide-y divide-border">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-secondary/25 transition-colors group"
            >
              {/* Event Category Icon Avatar */}
              <div className="h-9 w-9 shrink-0 rounded-lg bg-secondary/80 border border-border flex items-center justify-center mt-0.5">
                {getTypeIcon(act.type)}
              </div>

              {/* Event Content Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                      {act.title}
                    </h3>
                    {act.badgeText && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold tracking-wider uppercase ${getBadgeClass(
                          act.badgeVariant
                        )}`}
                      >
                        {act.badgeText}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                    {getRelativeTime(act.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {act.description}
                </p>

                {/* Footer Meta & Link */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  {act.actor && (
                    <span className="text-muted-foreground font-mono text-[10px]">
                      By: <strong className="text-foreground">{act.actor}</strong>
                    </span>
                  )}
                  {act.linkHref && (
                    <Link
                      href={act.linkHref}
                      className="inline-flex items-center gap-1 font-medium text-brand hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      {act.linkText || "View Details"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No activity events recorded under this filter.
          </div>
        )}
      </div>

      {/* Feed Bottom Action Bar */}
      <div className="p-3 bg-card/60 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-[10px]">
          Showing {displayedActivities.length} of {filtered.length} events
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateNewEvent("order")}
            disabled={isSimulating}
            className="text-[11px] text-muted-foreground hover:text-brand transition-colors flex items-center gap-1"
            title="Simulate a real-time order update event"
          >
            <PlusCircle className="h-3 w-3" /> Test Order Event
          </button>
          <span>•</span>
          <button
            onClick={() => simulateNewEvent("message")}
            disabled={isSimulating}
            className="text-[11px] text-muted-foreground hover:text-brand transition-colors flex items-center gap-1"
            title="Simulate an incoming message notification"
          >
            <MessageSquare className="h-3 w-3" /> Test Message
          </button>
        </div>
      </div>
    </div>
  );
}
