import type { KYCSubmission } from "@/lib/kyc-store";

export function exportKYCToCSV(submissions: KYCSubmission[]) {
  if (!submissions || submissions.length === 0) {
    alert("No KYC submissions available to export.");
    return;
  }

  const headers = [
    "Submission ID",
    "User ID",
    "Full Legal Name",
    "Email",
    "Date of Birth",
    "Country",
    "Country Code",
    "Document Type",
    "Document Number",
    "Document Expiry",
    "Status",
    "Biometric Face Match",
    "Submitted At",
    "Reviewed At",
    "Reviewed By Officer",
    "Reviewer Official Role",
    "Rejection Reason",
    "Admin Notes",
  ];

  const escapeCSV = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = submissions.map((sub) => [
    escapeCSV(sub.id),
    escapeCSV(sub.userId),
    escapeCSV(sub.fullName),
    escapeCSV(sub.email),
    escapeCSV(sub.dateOfBirth),
    escapeCSV(sub.country),
    escapeCSV(sub.countryCode),
    escapeCSV(sub.documentType),
    escapeCSV(sub.documentNumber),
    escapeCSV(sub.documentExpiry),
    escapeCSV(sub.status.toUpperCase()),
    escapeCSV(sub.liveFaceDetected ? "VERIFIED" : "UNVERIFIED"),
    escapeCSV(sub.submittedAt),
    escapeCSV(sub.reviewedAt || "N/A"),
    escapeCSV(sub.reviewedBy || "Compliance Officer Desk"),
    escapeCSV(sub.reviewerRole || "Regulatory Auditor"),
    escapeCSV(sub.rejectionReason || ""),
    escapeCSV(sub.adminNotes || ""),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `NEXAVORA_KYC_Audit_Export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportKYCToPDFReport(submissions: KYCSubmission[]) {
  if (!submissions || submissions.length === 0) {
    alert("No KYC submissions available to generate report.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to open the PDF report print preview.");
    return;
  }

  const currentDate = new Date().toUTCString();
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  const tableRows = submissions
    .map(
      (sub, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 8px 10px; font-family: monospace; color: #64748b;">${idx + 1}</td>
      <td style="padding: 8px 10px;">
        <strong style="color: #0f172a; display: block; font-size: 12px;">${sub.fullName}</strong>
        <span style="color: #64748b; font-size: 10px;">${sub.email}</span>
      </td>
      <td style="padding: 8px 10px; text-transform: uppercase; font-family: monospace;">
        <strong>${sub.documentType}</strong><br/>
        <span style="color: #64748b; font-size: 10px;">${sub.documentNumber}</span>
      </td>
      <td style="padding: 8px 10px; color: #334155;">${sub.country} (${sub.countryCode})</td>
      <td style="padding: 8px 10px;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase; 
          background-color: ${
            sub.status === "approved"
              ? "#dcfce7; color: #166534;"
              : sub.status === "pending"
              ? "#fef9c3; color: #854d0e;"
              : "#fee2e2; color: #991b1b;"
          }">
          ${sub.status}
        </span>
      </td>
      <td style="padding: 8px 10px; color: #15803d; font-weight: bold;">
        ${sub.liveFaceDetected ? "✓ Face Verified" : "—"}
      </td>
      <td style="padding: 8px 10px; font-family: monospace; color: #64748b; font-size: 10px;">
        ${new Date(sub.submittedAt).toLocaleDateString()}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>NEXAVORA Compliance KYC Report - ${currentDate}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 32px;
          background: #ffffff;
        }
        @media print {
          body { padding: 12px; }
          .no-print { display: none; }
        }
        .header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .subtitle {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        .meta-pill {
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-family: monospace;
          color: #334155;
          text-align: right;
        }
        .summary-cards {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .card {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
        }
        .card-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .card-val {
          font-size: 20px;
          font-weight: 700;
          font-family: monospace;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 10px;
          border-bottom: 2px solid #cbd5e1;
        }
        .footer {
          margin-top: 32px;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          font-size: 10px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
        .action-bar {
          background: #0f172a;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .print-btn {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="action-bar no-print">
        <span>Ready to save or export as PDF. Click "Print / Save PDF" below.</span>
        <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
      </div>

      <div class="header">
        <div>
          <h1 class="title">NEXAVORA COMPLIANCE AUDIT LEDGER</h1>
          <p class="subtitle">Official Regulatory KYC Identity Verification History & Audit Records</p>
        </div>
        <div class="meta-pill">
          <div><strong>Generated:</strong> ${currentDate}</div>
          <div><strong>Standard:</strong> FinCEN MSB & ISO 27001</div>
        </div>
      </div>

      <div class="summary-cards">
        <div class="card">
          <div class="card-label">Total Submissions</div>
          <div class="card-val" style="color: #0f172a;">${submissions.length}</div>
        </div>
        <div class="card">
          <div class="card-label">Approved & Active</div>
          <div class="card-val" style="color: #16a34a;">${approvedCount}</div>
        </div>
        <div class="card">
          <div class="card-label">Pending Review</div>
          <div class="card-val" style="color: #ca8a04;">${pendingCount}</div>
        </div>
        <div class="card">
          <div class="card-label">Rejected / Denied</div>
          <div class="card-val" style="color: #dc2626;">${rejectedCount}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Applicant / Email</th>
            <th>Document</th>
            <th>Jurisdiction</th>
            <th>Status</th>
            <th>Biometrics</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        <span>Confidential compliance record. Protected under international data protection laws.</span>
        <span>Electronic Audit Verification Stamp • NEXAVORA Global Trust & Safety</span>
      </div>

      <script>
        // Auto trigger print dialog after document is fully loaded
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
