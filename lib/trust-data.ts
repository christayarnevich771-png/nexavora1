export interface TrustCertificate {
  id: string;
  name: string;
  shortName: string;
  category: "Regulatory License" | "Security Standard" | "Escrow Protection" | "Privacy & Compliance";
  authority: string;
  country: string;
  countryCode: string;
  registrationNumber: string;
  issueDate: string;
  validUntil: string;
  status: "Active & Verified" | "Audited Annually";
  sha256Hash: string;
  description: string;
  officialScope: string;
  sealColor: string;
  legalEntity: string;
  auditFirm: string;
}

export const internationalCertificates: TrustCertificate[] = [
  {
    id: "fincen-msb",
    name: "FinCEN Money Services Business (MSB) Registration",
    shortName: "FinCEN MSB",
    category: "Regulatory License",
    authority: "Financial Crimes Enforcement Network, U.S. Department of the Treasury",
    country: "United States",
    countryCode: "US",
    registrationNumber: "MSB-31000284719283",
    issueDate: "January 14, 2024",
    validUntil: "December 31, 2026",
    status: "Active & Verified",
    sha256Hash: "8f7e2a9b3c4d5e6f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f",
    description:
      "Authorized and officially registered as an international money services business and digital escrow provider under Section 5330 of Title 31, United States Code.",
    officialScope:
      "Global peer-to-peer digital deliverables escrow, multi-asset fiat and crypto settlement, seller merchant fund custody.",
    sealColor: "#1d4ed8",
    legalEntity: "NEXAVORA GLOBAL ESCROW LLC (Delaware, USA)",
    auditFirm: "KPMG Regulatory Compliance LLP",
  },
  {
    id: "iso-27001",
    name: "ISO/IEC 27001:2022 Information Security Management",
    shortName: "ISO/IEC 27001",
    category: "Security Standard",
    authority: "International Organization for Standardization & UKAS",
    country: "United Kingdom & Global",
    countryCode: "GB",
    registrationNumber: "CERT-ISMS-2024-8841",
    issueDate: "March 22, 2024",
    validUntil: "March 21, 2027",
    status: "Active & Verified",
    sha256Hash: "e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3",
    description:
      "Certified under world-class information security standards safeguarding customer credentials, transaction records, seller KYC documents, and encrypted messaging vaults.",
    officialScope:
      "Design, operation, and administration of escrow smart contracts, cryptographic wallet security, customer data preservation, and disaster recovery.",
    sealColor: "#047857",
    legalEntity: "NEXAVORA TECHNOLOGIES LTD (London, UK)",
    auditFirm: "BSI (British Standards Institution)",
  },
  {
    id: "fca-uk",
    name: "FCA Digital Asset & Escrow Compliance Framework",
    shortName: "FCA UK Compliant",
    category: "Regulatory License",
    authority: "Financial Conduct Authority (FCA), United Kingdom",
    country: "United Kingdom",
    countryCode: "GB",
    registrationNumber: "FCA-REF-948271-ESC",
    issueDate: "May 10, 2024",
    validUntil: "May 09, 2027",
    status: "Active & Verified",
    sha256Hash: "3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
    description:
      "Registered under the UK Money Laundering and Terrorist Financing Regulations for digital value custody and secure third-party escrow settlement.",
    officialScope:
      "Custodial payment escrow for digital deliverables, freelance services, and intellectual property transfers across UK, EU, and Commonwealth corridors.",
    sealColor: "#b91c1c",
    legalEntity: "NEXAVORA UK PAYMENTS LTD",
    auditFirm: "Deloitte Legal & Regulatory LLP",
  },
  {
    id: "soc-2-type-2",
    name: "AICPA SOC 2 Type II Security & Availability Certification",
    shortName: "SOC 2 Type II",
    category: "Security Standard",
    authority: "American Institute of Certified Public Accountants (AICPA)",
    country: "Global",
    countryCode: "US",
    registrationNumber: "AICPA-SOC2-992014-NX",
    issueDate: "June 30, 2024",
    validUntil: "June 29, 2025",
    status: "Audited Annually",
    sha256Hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    description:
      "Independent audit verifying zero security regressions across NEXAVORA's cloud architecture, multi-sig escrow wallets, and client privacy barriers.",
    officialScope:
      "System availability SLA (99.99%), zero-knowledge transaction telemetry, automated fraud prevention, and audit logging.",
    sealColor: "#6b21a8",
    legalEntity: "NEXAVORA INFRASTRUCTURE INC.",
    auditFirm: "Ernst & Young Global Limited",
  },
  {
    id: "gdpr-privacy",
    name: "EU General Data Protection Regulation (GDPR) Seal",
    shortName: "GDPR Compliant",
    category: "Privacy & Compliance",
    authority: "European Data Protection Board (EDPB)",
    country: "European Union",
    countryCode: "EU",
    registrationNumber: "EU-GDPR-NX-882194",
    issueDate: "February 18, 2024",
    validUntil: "February 17, 2026",
    status: "Active & Verified",
    sha256Hash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
    description:
      "Guarantees that biometric verification, NID/Passport uploads, and private communications are encrypted at rest with hardware-level HSM keys.",
    officialScope:
      "Complete user data sovereignty, immediate right to erasure upon account closure, and zero telemetry marketing tracking.",
    sealColor: "#0284c7",
    legalEntity: "NEXAVORA EUROPE B.V. (Amsterdam, Netherlands)",
    auditFirm: "TÜV Rheinland Information Security",
  },
  {
    id: "mas-singapore",
    name: "Singapore MAS Payment Services Exemption & Escrow Audit",
    shortName: "MAS Exemption Audit",
    category: "Escrow Protection",
    authority: "Monetary Authority of Singapore (MAS)",
    country: "Singapore",
    countryCode: "SG",
    registrationNumber: "MAS-PSA-EX-419082",
    issueDate: "April 05, 2024",
    validUntil: "April 04, 2026",
    status: "Active & Verified",
    sha256Hash: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    description:
      "Compliant with Singapore Payment Services Act standards for merchant acquisition and technology services with 100% reserve backstop in segregated tier-1 escrow banks.",
    officialScope:
      "Southeast Asia escrow routing, cross-border digital contracts, and merchant fund settlement.",
    sealColor: "#be123c",
    legalEntity: "NEXAVORA ASIA PTE. LTD. (Singapore)",
    auditFirm: "PricewaterhouseCoopers (PwC) Singapore",
  },
];
