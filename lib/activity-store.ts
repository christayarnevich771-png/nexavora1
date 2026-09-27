import { getStoredSubmissions, type KYCSubmission } from "@/lib/kyc-store";

export type ActivityType =
  | "order_status"
  | "kyc_milestone"
  | "message"
  | "payout_escrow"
  | "security_alert";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  badgeText?: string;
  badgeVariant?: "brand" | "outline" | "success" | "warning" | "destructive";
  linkHref?: string;
  linkText?: string;
  actor?: string;
}

export const ACTIVITIES_STORAGE_KEY = "nexavora_recent_activities_v1";

const DEFAULT_BASE_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-ord-1",
    type: "order_status",
    title: "Order #NX-8F32A910 Updated to In Progress",
    description: "Seller Marlowe Studio started working on 'Complete brand identity package'. Funds secured in escrow.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    badgeText: "In Progress",
    badgeVariant: "brand",
    linkHref: "/orders",
    linkText: "View Order",
    actor: "Marlowe Studio",
  },
  {
    id: "act-msg-1",
    type: "message",
    title: "New Message from Castellan UI",
    description: "“Here is the updated design token guide for your component library order.”",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    badgeText: "Direct Message",
    badgeVariant: "outline",
    linkHref: "/orders",
    linkText: "Open Chat",
    actor: "Castellan UI",
  },
  {
    id: "act-escrow-1",
    type: "payout_escrow",
    title: "Escrow Deposit Confirmed ($420.00)",
    description: "USDT (BEP20) blockchain hash 0x7a3...9d8 verified by Nexavora automated escrow custody engine.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    badgeText: "Escrow Locked",
    badgeVariant: "success",
    linkHref: "/orders",
    linkText: "Escrow Ledger",
    actor: "Smart Custody Engine",
  },
  {
    id: "act-ord-2",
    type: "order_status",
    title: "Order #NX-7C11D450 Completed & Released",
    description: "Delivery was approved by buyer. $99.00 was released from escrow to the seller's balance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    badgeText: "Completed",
    badgeVariant: "success",
    linkHref: "/orders",
    linkText: "Receipt",
    actor: "Escrow Release",
  },
  {
    id: "act-sec-1",
    type: "security_alert",
    title: "FinCEN Multi-Factor Session Established",
    description: "Secure login authenticated from licensed jurisdiction IP with 256-bit AES encryption.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    badgeText: "Security",
    badgeVariant: "outline",
    linkHref: "/certificates",
    linkText: "Audit License",
    actor: "Security Guardian",
  },
];

export function getStoredActivities(): ActivityEvent[] {
  let customActivities: ActivityEvent[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (raw) {
        customActivities = JSON.parse(raw);
      }
    } catch {
      // ignore parse errors
    }
  }

  // Also dynamically create KYC milestone events from kyc-store so it's always real-time
  const kycSubmissions = getStoredSubmissions();
  const kycMilestones: ActivityEvent[] = [];

  for (const sub of kycSubmissions) {
    if (sub.status === "approved") {
      kycMilestones.push({
        id: `act-kyc-appr-${sub.id}`,
        type: "kyc_milestone",
        title: `KYC Milestone: Seller Verified (${sub.fullName})`,
        description: `Government ID (${sub.documentType.toUpperCase()}) & Live Biometrics approved by ${
          sub.reviewedBy || "Compliance Officer Desk"
        }. Full seller marketplace privileges active.`,
        timestamp: sub.reviewedAt || sub.submittedAt,
        badgeText: "KYC Approved",
        badgeVariant: "success",
        linkHref: "/kyc",
        linkText: "View Certificate",
        actor: sub.reviewedBy || "Chief Compliance Officer",
      });
    } else if (sub.status === "rejected") {
      kycMilestones.push({
        id: `act-kyc-rej-${sub.id}`,
        type: "kyc_milestone",
        title: `KYC Review Update: Action Required (${sub.fullName})`,
        description: `Application was rejected by compliance auditor. Reason: ${
          sub.rejectionReason || "Blurry document or mismatch."
        }`,
        timestamp: sub.reviewedAt || sub.submittedAt,
        badgeText: "Action Needed",
        badgeVariant: "destructive",
        linkHref: "/kyc",
        linkText: "Re-submit KYC",
        actor: sub.reviewedBy || "AML Compliance Desk",
      });
    } else {
      kycMilestones.push({
        id: `act-kyc-pend-${sub.id}`,
        type: "kyc_milestone",
        title: `KYC Milestone: Application Under Audit (${sub.fullName})`,
        description: `Identity documents submitted. Biometrics queued for regulatory auditor inspection.`,
        timestamp: sub.submittedAt,
        badgeText: "Pending Review",
        badgeVariant: "warning",
        linkHref: "/kyc",
        linkText: "Check Status",
        actor: "Nexavora Intake",
      });
    }
  }

  // Combine default base activities, stored custom activities, and live KYC milestones
  const allEvents = [...customActivities, ...kycMilestones, ...DEFAULT_BASE_ACTIVITIES];

  // Sort descending by timestamp (newest first)
  allEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return allEvents;
}

export function logActivityEvent(event: Omit<ActivityEvent, "id">): ActivityEvent {
  const newEvent: ActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      const current: ActivityEvent[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify([newEvent, ...current].slice(0, 50))
      );
      window.dispatchEvent(new CustomEvent("nexavora-activity-updated"));
    } catch {
      // ignore storage failure
    }
  }

  return newEvent;
}
