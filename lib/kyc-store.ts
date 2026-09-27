export type DocumentType = "nid" | "passport" | "driving_license";
export type KYCStatus = "unverified" | "pending" | "approved" | "rejected";

export interface KYCSubmission {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  countryCode: string;
  documentType: DocumentType;
  documentNumber: string;
  documentExpiry: string;
  frontImage: string;
  backImage?: string;
  selfieImage: string;
  liveFaceDetected?: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewerRole?: string | null;
  rejectionReason?: string | null;
  adminNotes?: string | null;
}

export interface KYCAuditLogEntry {
  id: string;
  submissionId: string;
  applicantName: string;
  applicantEmail: string;
  action: "approved" | "rejected" | "reset_to_pending" | "submitted";
  performedBy: string;
  officerRole: string;
  timestamp: string;
  reasonOrNotes?: string;
  documentType: DocumentType;
  documentNumber: string;
  ipAddress?: string;
}

export const KYC_AUDIT_LOGS_KEY = "nexavora_kyc_audit_logs_v1";

const INITIAL_AUDIT_LOGS: KYCAuditLogEntry[] = [
  {
    id: "audit-log-101",
    submissionId: "kyc-sub-101",
    applicantName: "Marlowe Julian Sterling",
    applicantEmail: "marlowe.studio@london-design.co.uk",
    action: "approved",
    performedBy: "Chief Compliance Officer (FinCEN Desk)",
    officerRole: "Senior Regulatory Auditor",
    timestamp: "2026-09-18T14:15:00Z",
    reasonOrNotes: "Verified via UK HMPO Biometric registry. Zero sanctions match.",
    documentType: "passport",
    documentNumber: "GB948210492",
    ipAddress: "192.0.2.44",
  },
  {
    id: "audit-log-102",
    submissionId: "kyc-sub-104",
    applicantName: "Alejandro Silva Morales",
    applicantEmail: "a.silva@inversiones-bogota.co",
    action: "rejected",
    performedBy: "Officer Sarah Jenkins",
    officerRole: "Tier-2 AML Specialist",
    timestamp: "2026-09-22T16:45:00Z",
    reasonOrNotes: "Passport bio page image is cut off at the bottom and MRZ zone is illegible.",
    documentType: "passport",
    documentNumber: "COL-66381029",
    ipAddress: "198.51.100.12",
  },
  {
    id: "audit-log-103",
    submissionId: "kyc-sub-102",
    applicantName: "David Matthew Renn",
    applicantEmail: "renn.david@renntechnologies.io",
    action: "submitted",
    performedBy: "System Gateway",
    officerRole: "Automated Intake",
    timestamp: "2026-09-24T09:12:00Z",
    reasonOrNotes: "California Driver's License and Live Face scan ingested into audit queue.",
    documentType: "driving_license",
    documentNumber: "DL-CA-99382104",
    ipAddress: "203.0.113.195",
  },
];

export function getStoredAuditLogs(): KYCAuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(KYC_AUDIT_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(KYC_AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAuditAction(entry: Omit<KYCAuditLogEntry, "id">): KYCAuditLogEntry {
  const current = getStoredAuditLogs();
  const newLog: KYCAuditLogEntry = {
    ...entry,
    id: `audit-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [newLog, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KYC_AUDIT_LOGS_KEY, JSON.stringify(updated));
  }
  return newLog;
}

const INITIAL_SUBMISSIONS: KYCSubmission[] = [
  {
    id: "kyc-sub-101",
    userId: "usr_marlowe",
    fullName: "Marlowe Julian Sterling",
    email: "marlowe.studio@london-design.co.uk",
    dateOfBirth: "1989-06-14",
    country: "United Kingdom",
    countryCode: "GB",
    documentType: "passport",
    documentNumber: "GB948210492",
    documentExpiry: "2031-08-20",
    frontImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    selfieImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    liveFaceDetected: true,
    status: "approved",
    submittedAt: "2026-09-18T10:30:00Z",
    reviewedAt: "2026-09-18T14:15:00Z",
    adminNotes: "Passport biometric chip verified against UK HMPO database. Approved for high-volume seller tier.",
  },
  {
    id: "kyc-sub-102",
    userId: "usr_renn_dev",
    fullName: "David Matthew Renn",
    email: "renn.david@renntechnologies.io",
    dateOfBirth: "1992-11-03",
    country: "United States",
    countryCode: "US",
    documentType: "driving_license",
    documentNumber: "DL-CA-99382104",
    documentExpiry: "2028-11-03",
    frontImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    backImage:
      "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80",
    selfieImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    liveFaceDetected: true,
    status: "approved",
    submittedAt: "2026-09-20T08:45:00Z",
    reviewedAt: "2026-09-20T11:20:00Z",
    adminNotes: "California DMV driver's license barcode scanned. Verified.",
  },
  {
    id: "kyc-sub-103",
    userId: "usr_tariq_bd",
    fullName: "Tariqul Islam Chowdhury",
    email: "tariq.chowdhury.dev@gmail.com",
    dateOfBirth: "1996-03-22",
    country: "Bangladesh",
    countryCode: "BD",
    documentType: "nid",
    documentNumber: "NID-1996269182900014",
    documentExpiry: "2036-03-21",
    frontImage:
      "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=600&q=80",
    backImage:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    selfieImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    liveFaceDetected: true,
    status: "pending",
    submittedAt: "2026-09-26T18:10:00Z",
    reviewedAt: null,
    adminNotes: "Smart NID Card front & back uploaded. Awaiting admin security review.",
  },
  {
    id: "kyc-sub-104",
    userId: "usr_sophie_fr",
    fullName: "Sophie Laurent",
    email: "sophie.laurent@paris3d.art",
    dateOfBirth: "1994-09-12",
    country: "France",
    countryCode: "FR",
    documentType: "passport",
    documentNumber: "FR220914800",
    documentExpiry: "2029-05-15",
    frontImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    selfieImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    liveFaceDetected: true,
    status: "pending",
    submittedAt: "2026-09-26T19:40:00Z",
    reviewedAt: null,
    adminNotes: "French biometric passport bio page submitted. High resolution.",
  },
];

const STORAGE_KEY = "nexavora_kyc_submissions_v4";
const ACTIVE_USER_SUBMISSION_KEY = "nexavora_active_user_kyc_sub_v4";
const CURRENT_USER_KYC_KEY = "nexavora_current_user_kyc_status_v4";
export const KYC_CHANGE_EVENT = "nexavora-kyc-updated";

export function getStoredSubmissions(): KYCSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveSubmissions(list: KYCSubmission[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    //
  }
}

export function getCurrentUserKYC(): {
  status: KYCStatus;
  submission: KYCSubmission | null;
} {
  if (typeof window === "undefined") {
    return { status: "unverified", submission: null };
  }

  try {
    const activeSubRaw = localStorage.getItem(ACTIVE_USER_SUBMISSION_KEY);
    if (activeSubRaw) {
      const activeSub: KYCSubmission = JSON.parse(activeSubRaw);
      // Ensure we fetch latest status from store in case admin updated it
      const all = getStoredSubmissions();
      const inStore = all.find((s) => s.id === activeSub.id);
      if (inStore) {
        return { status: inStore.status, submission: inStore };
      }
      return { status: activeSub.status, submission: activeSub };
    }

    const directStatus = localStorage.getItem(CURRENT_USER_KYC_KEY) as KYCStatus | null;
    if (directStatus) {
      return { status: directStatus, submission: null };
    }

    return { status: "unverified", submission: null };
  } catch {
    return { status: "unverified", submission: null };
  }
}

export function submitCurrentUserKYC(data: {
  userId?: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  countryCode: string;
  documentType: DocumentType;
  documentNumber: string;
  documentExpiry: string;
  frontImage: string;
  backImage?: string;
  selfieImage: string;
  liveFaceDetected?: boolean;
  autoApprove?: boolean;
}): KYCSubmission {
  const all = getStoredSubmissions();
  const status: "pending" | "approved" = data.autoApprove ? "approved" : "pending";
  const newId = `kyc-sub-${Date.now()}`;

  const newSub: KYCSubmission = {
    id: newId,
    userId: data.userId || "usr_active_applicant",
    fullName: data.fullName,
    email: data.email,
    dateOfBirth: data.dateOfBirth,
    country: data.country,
    countryCode: data.countryCode,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    documentExpiry: data.documentExpiry,
    frontImage: data.frontImage,
    backImage: data.backImage,
    selfieImage: data.selfieImage,
    liveFaceDetected: data.liveFaceDetected ?? true,
    status,
    submittedAt: new Date().toISOString(),
    reviewedAt: data.autoApprove ? new Date().toISOString() : null,
    adminNotes: data.autoApprove
      ? "Auto-verified via Instant AI Optical & Biometric Face Match."
      : "Uploaded by applicant. Live selfie and government document in queue for compliance audit.",
  };

  // Prepend to submissions so it appears at the very top of Admin Panel
  const updated = [newSub, ...all.filter((s) => s.id !== newId)];
  saveSubmissions(updated);

  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_USER_SUBMISSION_KEY, JSON.stringify(newSub));
    localStorage.setItem(CURRENT_USER_KYC_KEY, status);
    window.dispatchEvent(
      new CustomEvent(KYC_CHANGE_EVENT, { detail: { status, submission: newSub } })
    );
  }

  return newSub;
}

export function updateSubmissionStatus(
  id: string,
  newStatus: "approved" | "rejected" | "pending",
  reason?: string,
  reviewerName: string = "Chief Compliance Officer (FinCEN Desk)",
  reviewerRole: string = "Senior Regulatory Auditor"
): KYCSubmission | null {
  const all = getStoredSubmissions();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const item = { ...all[idx] };
  item.status = newStatus;
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = reviewerName;
  item.reviewerRole = reviewerRole;
  if (reason) item.rejectionReason = reason;

  all[idx] = item;
  saveSubmissions(all);

  // Automatically record in the compliance Audit Log
  logAuditAction({
    submissionId: item.id,
    applicantName: item.fullName,
    applicantEmail: item.email,
    action: newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "reset_to_pending",
    performedBy: reviewerName,
    officerRole: reviewerRole,
    timestamp: item.reviewedAt,
    reasonOrNotes: reason || (newStatus === "approved" ? "Document authenticity verified & seller approved." : "Status reset."),
    documentType: item.documentType,
    documentNumber: item.documentNumber,
    ipAddress: "127.0.0.1 (Internal Console)",
  });

  if (typeof window !== "undefined") {
    const activeSubRaw = localStorage.getItem(ACTIVE_USER_SUBMISSION_KEY);
    if (activeSubRaw) {
      try {
        const activeSub: KYCSubmission = JSON.parse(activeSubRaw);
        if (activeSub.id === id) {
          activeSub.status = newStatus;
          if (reason) activeSub.rejectionReason = reason;
          localStorage.setItem(ACTIVE_USER_SUBMISSION_KEY, JSON.stringify(activeSub));
          localStorage.setItem(CURRENT_USER_KYC_KEY, newStatus);
        }
      } catch {
        //
      }
    }

    window.dispatchEvent(
      new CustomEvent(KYC_CHANGE_EVENT, { detail: { status: newStatus, submission: item } })
    );
  }

  return item;
}

export function resetActiveUserKYC() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_USER_SUBMISSION_KEY);
  localStorage.setItem(CURRENT_USER_KYC_KEY, "unverified");
  window.dispatchEvent(
    new CustomEvent(KYC_CHANGE_EVENT, { detail: { status: "unverified", submission: null } })
  );
}

export function setQuickCurrentUserKYCStatus(status: KYCStatus) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KYC_KEY, status);

  const activeSubRaw = localStorage.getItem(ACTIVE_USER_SUBMISSION_KEY);
  if (activeSubRaw) {
    try {
      const activeSub: KYCSubmission = JSON.parse(activeSubRaw);
      activeSub.status = status === "unverified" ? "pending" : status;
      localStorage.setItem(ACTIVE_USER_SUBMISSION_KEY, JSON.stringify(activeSub));

      const all = getStoredSubmissions();
      const idx = all.findIndex((s) => s.id === activeSub.id);
      if (idx !== -1) {
        all[idx].status = activeSub.status;
        saveSubmissions(all);
      }
    } catch {
      //
    }
  }

  window.dispatchEvent(new CustomEvent(KYC_CHANGE_EVENT, { detail: { status } }));
}
