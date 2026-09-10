// MINE SMART AI - Multi-Format Report Exporter (PDF, Excel, Word)
// Client-side instant document generation for Mining Operations

import { GeneratedAIReport, ExportFormat } from "../types/aiReportTypes";

export const ReportExporter = {
  /**
   * Export to PDF via clean printable layout and browser print dialog
   */
  exportToPdf: (report: GeneratedAIReport) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.metadata.documentNumber} - ${report.metadata.title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            font-size: 11pt;
            background: #fff;
            padding: 0;
            margin: 0;
          }
          .header-box {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-area h1 {
            margin: 0;
            font-size: 18pt;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .logo-area p {
            margin: 2px 0 0 0;
            font-size: 9pt;
            color: #64748b;
          }
          .meta-box {
            text-align: right;
            font-size: 8.5pt;
            color: #475569;
          }
          .meta-box strong {
            color: #0f172a;
          }
          .report-title-badge {
            background: #f8fafc;
            border-left: 4px solid #f59e0b;
            padding: 10px 14px;
            margin-bottom: 18px;
            border-radius: 4px;
          }
          .report-title-badge h2 {
            margin: 0;
            font-size: 14pt;
            color: #0f172a;
          }
          .report-title-badge p {
            margin: 2px 0 0 0;
            font-size: 9.5pt;
            color: #64748b;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .kpi-card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 10px;
            background: #f8fafc;
          }
          .kpi-label {
            font-size: 8pt;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
          }
          .kpi-val {
            font-size: 13pt;
            font-weight: 700;
            color: #0f172a;
            margin: 2px 0;
          }
          .kpi-sub {
            font-size: 7.5pt;
            color: #475569;
          }
          .section-title {
            font-size: 11pt;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 4px;
            margin: 18px 0 10px 0;
            text-transform: uppercase;
          }
          .summary-box {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
            font-size: 9.5pt;
          }
          .summary-box ul {
            margin: 6px 0;
            padding-left: 18px;
          }
          .summary-box li {
            margin-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            font-size: 9pt;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            text-align: left;
          }
          th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 600;
          }
          tr:nth-child(even) td {
            background-color: #f8fafc;
          }
          .total-row td {
            font-weight: 700;
            background-color: #e2e8f0;
          }
          .signature-box {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #cbd5e1;
            page-break-inside: avoid;
          }
          .sig-col {
            width: 45%;
            text-align: center;
            font-size: 8.5pt;
          }
          .sig-line {
            margin-top: 45px;
            border-top: 1px solid #0f172a;
            padding-top: 4px;
            font-weight: 700;
          }
          .footer-note {
            margin-top: 25px;
            text-align: center;
            font-size: 7.5pt;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="logo-area">
            <h1>MINE SMART AI</h1>
            <p>PT KALIMANTAN PRIMA COAL MINING & METALS • SITE SANGATTA</p>
          </div>
          <div class="meta-box">
            <div>Doc No: <strong>${report.metadata.documentNumber}</strong></div>
            <div>Period: <strong>${report.metadata.periodLabel}</strong></div>
            <div>Date Generated: <strong>${report.metadata.generatedAt}</strong></div>
            <div>Classification: <strong>OFFICIAL OPERATIONAL REPORT</strong></div>
          </div>
        </div>

        <div class="report-title-badge">
          <h2>${report.metadata.title}</h2>
          <p>${report.metadata.subtitle} • Location: ${report.metadata.siteName}</p>
        </div>

        <div class="kpi-grid">
          ${report.kpis
            .map(
              (kpi) => `
            <div class="kpi-card">
              <div class="kpi-label">${kpi.label}</div>
              <div class="kpi-val">${kpi.actual} <span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">${kpi.unit}</span></div>
              <div class="kpi-sub">Target: ${kpi.target} ${kpi.unit} (${kpi.variancePct > 0 ? "+" : ""}${kpi.variancePct.toFixed(1)}%)</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section-title">I. AI Executive Synthesis & Operational Summary</div>
        <div class="summary-box">
          <strong>Key Highlights:</strong>
          <ul>
            ${report.aiExecutiveSummary.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
          ${
            report.aiExecutiveSummary.criticalAnomalies.length > 0
              ? `
            <strong style="color: #b91c1c;">Flagged Anomalies:</strong>
            <ul>
              ${report.aiExecutiveSummary.criticalAnomalies.map((a) => `<li style="color: #b91c1c;">${a}</li>`).join("")}
            </ul>
          `
              : ""
          }
          <strong>Prescriptive Actions:</strong>
          <ul>
            ${report.aiExecutiveSummary.actionItems.map((ai) => `<li>${ai}</li>`).join("")}
          </ul>
        </div>

        <div class="section-title">II. Detailed Operational Metrics Breakdown</div>
        ${report.tables
          .map(
            (table) => `
          <div style="font-size: 9.5pt; font-weight: 600; margin: 10px 0 4px 0; color: #334155;">${table.title}</div>
          <table>
            <thead>
              <tr>
                ${table.columns.map((c) => `<th style="text-align: ${c.align || "left"}">${c.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${table.rows
                .map(
                  (row) => `
                <tr>
                  ${table.columns.map((c) => `<td style="text-align: ${c.align || "left"}">${row[c.key] !== undefined ? row[c.key] : "-"}</td>`).join("")}
                </tr>
              `
                )
                .join("")}
              ${
                table.totals
                  ? `
                <tr class="total-row">
                  ${table.columns.map((c) => `<td style="text-align: ${c.align || "left"}">${table.totals![c.key] !== undefined ? table.totals![c.key] : ""}</td>`).join("")}
                </tr>
              `
                  : ""
              }
            </tbody>
          </table>
        `
          )
          .join("")}

        <div class="signature-box">
          <div class="sig-col">
            <div>Prepared & Verified by:</div>
            <div class="sig-line">
              ${report.complianceSignoff.mineSuperintendentSignature}<br />
              <span style="font-weight: normal; color: #64748b;">Mine Superintendent / Operations Lead</span>
            </div>
          </div>
          <div class="sig-col">
            <div>Approved by Kepala Teknik Tambang (KTT):</div>
            <div class="sig-line">
              ${report.complianceSignoff.kttSignature}<br />
              <span style="font-weight: normal; color: #64748b;">Kepala Teknik Tambang (KTT) • SK KTT No. 482/ESDM</span>
            </div>
          </div>
        </div>

        <div class="footer-note">
          Digital Verification QR Hash: ${report.complianceSignoff.qrHash} • Generated by MINE SMART AI Enterprise System
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },

  /**
   * Export to Microsoft Excel (.xls / CSV format)
   */
  exportToExcel: (report: GeneratedAIReport) => {
    let csvContent = `data:text/csv;charset=utf-8,`;

    // Title and Meta
    csvContent += `MINE SMART AI - ${report.metadata.title}\r\n`;
    csvContent += `Document No: ${report.metadata.documentNumber},Period: ${report.metadata.periodLabel},Date: ${report.metadata.generatedAt}\r\n`;
    csvContent += `Site: ${report.metadata.siteName},KTT: ${report.metadata.kttName}\r\n\r\n`;

    // KPIs
    csvContent += `--- KEY PERFORMANCE INDICATORS ---\r\n`;
    csvContent += `Metric,Actual,Target,Unit,Variance (%)\r\n`;
    report.kpis.forEach((k) => {
      csvContent += `"${k.label}",${k.actual},${k.target},"${k.unit}",${k.variancePct}%\r\n`;
    });
    csvContent += `\r\n`;

    // AI Summary
    csvContent += `--- AI EXECUTIVE SUMMARY ---\r\n`;
    report.aiExecutiveSummary.highlights.forEach((h) => {
      csvContent += `"Highlight: ${h.replace(/"/g, '""')}"\r\n`;
    });
    report.aiExecutiveSummary.actionItems.forEach((a) => {
      csvContent += `"Action: ${a.replace(/"/g, '""')}"\r\n`;
    });
    csvContent += `\r\n`;

    // Tables
    report.tables.forEach((tbl) => {
      csvContent += `--- ${tbl.title.toUpperCase()} ---\r\n`;
      const colHeaders = tbl.columns.map((c) => `"${c.label}"`).join(",");
      csvContent += `${colHeaders}\r\n`;

      tbl.rows.forEach((row) => {
        const rowVals = tbl.columns
          .map((c) => {
            const val = row[c.key];
            return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
          })
          .join(",");
        csvContent += `${rowVals}\r\n`;
      });

      if (tbl.totals) {
        const totalVals = tbl.columns
          .map((c) => {
            const val = tbl.totals![c.key];
            return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
          })
          .join(",");
        csvContent += `TOTAL,${totalVals}\r\n`;
      }
      csvContent += `\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.metadata.documentNumber}_${report.metadata.type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export to Microsoft Word (.doc format with full formatting & tables)
   */
  exportToWord: (report: GeneratedAIReport) => {
    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${report.metadata.title}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.4; }
          h1 { font-size: 18pt; color: #0f172a; margin-bottom: 0; }
          h2 { font-size: 14pt; color: #0f172a; margin-top: 15pt; }
          h3 { font-size: 12pt; color: #334155; margin-top: 10pt; }
          .meta-table { width: 100%; border: none; margin-bottom: 15pt; font-size: 10pt; }
          .meta-table td { border: none; padding: 2pt 4pt; }
          .table-content { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 14pt; font-size: 10pt; }
          .table-content th { background-color: #0f172a; color: #ffffff; padding: 5pt; border: 1pt solid #cbd5e1; }
          .table-content td { padding: 4pt 6pt; border: 1pt solid #cbd5e1; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
          .kpi-table td { border: 1pt solid #cbd5e1; padding: 6pt; background-color: #f8fafc; font-size: 9.5pt; }
          .summary-box { background-color: #f1f5f9; border-left: 4pt solid #f59e0b; padding: 8pt 12pt; margin-bottom: 14pt; }
          .sig-table { width: 100%; border: none; margin-top: 30pt; }
          .sig-table td { border: none; text-align: center; font-size: 10pt; }
        </style>
      </head>
      <body>
        <h1>${report.metadata.companyName}</h1>
        <p style="color: #64748b; font-size: 10pt; margin-top: 2pt;">MINE SMART AI • SITE OPERATIONAL REPORTING SYSTEM</p>
        <hr style="border: 1.5pt solid #0f172a;" />

        <h2>${report.metadata.title}</h2>
        <p style="color: #475569; font-size: 11pt;"><em>${report.metadata.subtitle}</em></p>

        <table class="meta-table">
          <tr>
            <td><strong>Nomor Dokumen:</strong> ${report.metadata.documentNumber}</td>
            <td><strong>Periode Operasi:</strong> ${report.metadata.periodLabel}</td>
          </tr>
          <tr>
            <td><strong>Lokasi Tambang:</strong> ${report.metadata.siteName}</td>
            <td><strong>Tanggal Dibuat:</strong> ${report.metadata.generatedAt}</td>
          </tr>
          <tr>
            <td><strong>Kepala Teknik Tambang:</strong> ${report.metadata.kttName}</td>
            <td><strong>Status Dokumen:</strong> RESMI TERVERIFIKASI</td>
          </tr>
        </table>

        <h3>I. KEY PERFORMANCE INDICATORS (KPI)</h3>
        <table class="kpi-table">
          <tr>
            ${report.kpis
              .slice(0, 4)
              .map(
                (k) => `
              <td>
                <strong>${k.label}</strong><br />
                <span style="font-size: 14pt; font-weight: bold; color: #0f172a;">${k.actual} ${k.unit}</span><br />
                Target: ${k.target} ${k.unit} (${k.variancePct > 0 ? "+" : ""}${k.variancePct.toFixed(1)}%)
              </td>
            `
              )
              .join("")}
          </tr>
        </table>

        <h3>II. AI EXECUTIVE SUMMARY & FORENSIC SYNTHESIS</h3>
        <div class="summary-box">
          <p><strong>Ringkasan Eksekutif & Temuan AI:</strong></p>
          <ul>
            ${report.aiExecutiveSummary.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
          <p><strong>Tindakan Mitigasi Preskriptif:</strong></p>
          <ul>
            ${report.aiExecutiveSummary.actionItems.map((a) => `<li>${a}</li>`).join("")}
          </ul>
        </div>

        <h3>III. RINCIAN DATA OPERASIONAL LENGKAP</h3>
        ${report.tables
          .map(
            (tbl) => `
          <p style="font-weight: bold; margin-bottom: 2pt;">${tbl.title}</p>
          <table class="table-content">
            <thead>
              <tr>
                ${tbl.columns.map((c) => `<th style="text-align: ${c.align || "left"}">${c.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${tbl.rows
                .map(
                  (r) => `
                <tr>
                  ${tbl.columns.map((c) => `<td style="text-align: ${c.align || "left"}">${r[c.key] !== undefined ? r[c.key] : "-"}</td>`).join("")}
                </tr>
              `
                )
                .join("")}
              ${
                tbl.totals
                  ? `
                <tr style="font-weight: bold; background-color: #e2e8f0;">
                  ${tbl.columns.map((c) => `<td style="text-align: ${c.align || "left"}">${tbl.totals![c.key] !== undefined ? tbl.totals![c.key] : ""}</td>`).join("")}
                </tr>
              `
                  : ""
              }
            </tbody>
          </table>
        `
          )
          .join("")}

        <table class="sig-table">
          <tr>
            <td style="width: 50%;">
              Dibuat oleh:<br /><br /><br /><br />
              <strong>${report.complianceSignoff.mineSuperintendentSignature}</strong><br />
              Mine Superintendent
            </td>
            <td style="width: 50%;">
              Disetujui oleh:<br /><br /><br /><br />
              <strong>${report.complianceSignoff.kttSignature}</strong><br />
              Kepala Teknik Tambang (KTT)
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", wordHtml], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.metadata.documentNumber}_${report.metadata.type}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
