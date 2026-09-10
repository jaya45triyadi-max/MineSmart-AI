// MINE SMART AI - Reporting Engine (PROMPT 34)

import {
  ReportType,
  ReportTemplate,
  ReportSchedule,
  ReportArchiveRecord,
} from "../../types/reportingIntegrationTypes";
import { AIAnalyticsEngine } from "../ai/analytics/AIAnalyticsEngine";

export class ReportingEngine {
  private static defaultTemplates: ReportTemplate[] = [
    {
      templateId: "tpl-daily-01",
      templateName: "Laporan Harian Operasional Tambang (Daily Mining Report)",
      reportType: "DAILY_MINING",
      companyId: "comp-1",
      siteId: "site-1",
      sections: ["Executive Summary", "Production Coal & OB", "Fleet PA/UA", "Fuel Burn", "Downtime Breakdown", "HSE Incidents", "AI Recommendations"],
      filters: { period: "TODAY" },
      columns: ["Pit/Front", "Target (MT)", "Actual (MT)", "Variance", "Achievement %"],
      charts: ["Production Bar Chart", "Fleet Availability Gauge", "Fuel Burn Line"],
      headerTitle: "PT MINESMART INDONESIA - DAILY MINING REPORT",
      footerText: "CONFIDENTIAL - INTERNAL MANAGEMENT USE ONLY",
      createdBy: "System Admin",
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-08-14T00:00:00Z",
      version: 1,
      status: "ACTIVE",
    },
    {
      templateId: "tpl-shift-02",
      templateName: "Laporan Per Shift (Shift Performance Report)",
      reportType: "SHIFT_PERFORMANCE",
      companyId: "comp-1",
      siteId: "site-1",
      sections: ["Shift Summary", "Production per Pit", "Cycle Time & Queue", "Manpower Attendance"],
      filters: { shift: "SHIFT_A" },
      columns: ["Shift Code", "Supervisor", "Coal MT", "OB BCM", "Fuel Liters", "Queue Min"],
      charts: ["Shift Comparison Bar"],
      headerTitle: "SHIFT PERFORMANCE AUDIT REPORT",
      footerText: "VERIFIED BY DISPATCH & SITE MANAGER",
      createdBy: "Mining Supervisor",
      createdAt: "2026-08-05T00:00:00Z",
      updatedAt: "2026-08-14T00:00:00Z",
      version: 1,
      status: "ACTIVE",
    },
    {
      templateId: "tpl-weekly-03",
      templateName: "Laporan Mingguan Kinerja Tambang (Weekly Mining Performance)",
      reportType: "WEEKLY_PERFORMANCE",
      companyId: "comp-1",
      siteId: "site-1",
      sections: ["Weekly Highlights", "Week vs Week Comparison", "Stockpile Inventory", "Maintenance MTBF/MTTR"],
      filters: { range: "THIS_WEEK" },
      columns: ["Week #", "Weekly Target", "Weekly Actual", "Growth %", "Forecast Next Week"],
      charts: ["Weekly Trend Area Chart"],
      headerTitle: "WEEKLY MINING PERFORMANCE & KPI REVIEW",
      footerText: "CONFIDENTIAL - FOR MANAGERIAL DIRECTORS",
      createdBy: "General Manager",
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-08-14T00:00:00Z",
      version: 2,
      status: "ACTIVE",
    },
    {
      templateId: "tpl-esdm-04",
      templateName: "Laporan Standar ESDM RKAB & Produksi Bulanan",
      reportType: "ESDM_RKAB",
      companyId: "comp-1",
      siteId: "site-1",
      sections: ["Form 04 ESDM", "Rencana vs Realisasi RKAB", "K3 & KO Tambang", "Reklamasi & Lingkungan"],
      filters: { esdmFormat: "FORM_04_MINERBA" },
      columns: ["Seam Batubara", "Target RKAB (Ton)", "Realisasi (Ton)", "GAR Quality", "Status Inspektur"],
      charts: ["RKAB Cumulative Curve"],
      headerTitle: "LAPORAN RKAB & RESMI DITJEN MINERBA KEMENTERIAN ESDM",
      footerText: "DIGITAL SIGNATURE READY - KTT APPROVED",
      createdBy: "Kepala Teknik Tambang (KTT)",
      createdAt: "2026-07-01T00:00:00Z",
      updatedAt: "2026-08-14T00:00:00Z",
      version: 3,
      status: "ACTIVE",
    },
  ];

  private static archives: ReportArchiveRecord[] = [
    {
      reportId: "rep-arch-001",
      templateId: "tpl-daily-01",
      reportName: "Daily Mining Operations Report - 14 Aug 2026",
      reportType: "DAILY_MINING",
      period: "2026-08-14",
      generatedAt: new Date().toISOString(),
      generatedBy: "System Auto Scheduler",
      fileReference: "/exports/rep-daily-20260814.pdf",
      format: "PDF",
      version: 1,
      watermark: "CONFIDENTIAL",
      digitalSignature: {
        preparedBy: "Dispatch Supervisor (Ir. Bambang)",
        reviewedBy: "Mine Operations Manager (Hendra, S.T.)",
        approvedBy: "Kepala Teknik Tambang / KTT (Budi Santoso, M.T.)",
        approvalDate: "2026-08-14 18:30 WITA",
      },
    },
    {
      reportId: "rep-arch-002",
      templateId: "tpl-esdm-04",
      reportName: "Laporan Bulanan ESDM Form 04 - Juli 2026",
      reportType: "ESDM_RKAB",
      period: "Juli 2026",
      generatedAt: "2026-08-01T08:00:00Z",
      generatedBy: "Kepala Teknik Tambang",
      fileReference: "/exports/rep-esdm-juli-2026.xlsx",
      format: "EXCEL",
      version: 2,
      digitalSignature: {
        preparedBy: "Sr. Mining Engineer",
        reviewedBy: "KTT",
        approvedBy: "Direktur Utama",
        approvalDate: "2026-08-02 09:00 WITA",
      },
    },
  ];

  private static schedules: ReportSchedule[] = [
    {
      scheduleId: "sched-01",
      templateId: "tpl-daily-01",
      reportName: "Daily Mining Operations Automated Email",
      frequency: "DAILY",
      cronTime: "07:00 WITA",
      recipients: [
        { role: "SITE_MANAGER", email: "site.manager@minesmart.id" },
        { role: "MINING_OWNER", email: "owner@minesmart.id" },
      ],
      lastRunAt: new Date().toISOString(),
      nextRunAt: "2026-08-15 07:00 WITA",
      status: "ACTIVE",
    },
    {
      scheduleId: "sched-02",
      templateId: "tpl-weekly-03",
      reportName: "Weekly Management KPI Summary",
      frequency: "WEEKLY",
      cronTime: "Senin 08:00 WITA",
      recipients: [
        { role: "FINANCE_MANAGER", email: "finance@minesmart.id" },
        { role: "SUPER_ADMIN", email: "admin@minesmart.id" },
      ],
      lastRunAt: "2026-08-10T08:00:00Z",
      nextRunAt: "2026-08-17 08:00 WITA",
      status: "ACTIVE",
    },
  ];

  public static getTemplates(): ReportTemplate[] {
    return this.defaultTemplates;
  }

  public static getArchives(): ReportArchiveRecord[] {
    return this.archives;
  }

  public static getSchedules(): ReportSchedule[] {
    return this.schedules;
  }

  /**
   * Generates a comprehensive dataset for any given report type.
   */
  public static async generateReportContent(
    reportType: ReportType,
    companyId: string,
    siteId: string,
    periodStr = "Hari Ini (14 Ags 2026)"
  ) {
    const summary = await AIAnalyticsEngine.generateAnalyticsSummary(companyId, siteId);
    const prodForecast = await AIAnalyticsEngine.getProductionForecast(companyId, siteId, "END_OF_MONTH");
    const rca = AIAnalyticsEngine.getRootCauseAnalysis("PRODUCTION_DROP");
    const anomalies = AIAnalyticsEngine.getAnomalies();

    return {
      title: this.getReportTitle(reportType),
      companyName: "PT MINESMART ENTERPRISE INDONESIA",
      siteName: "Site Muara Enim Mining Operational",
      period: periodStr,
      generatedAt: new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" }) + " WITA",
      kpiSummary: {
        coalProductionActual: 14250,
        coalProductionTarget: 15000,
        coalAchievementPct: 95.0,
        obActualBCM: 48600,
        obTargetBCM: 50000,
        fleetAvailabilityPA: 88.5,
        fleetAvailabilityTarget: 90.0,
        fuelConsumptionLiters: 42150,
        fuelRatioLitersPerTon: 1.45,
        costPerTonUSD: 26.8,
        costBudgetUSD: 24.5,
        hseLTI: 0,
        hseNearMiss: 1,
        qualityGAR: 4250,
        qualityTM: 34.2,
      },
      shiftData: [
        { shift: "Shift A (Pagi)", coalMT: 5200, obBCM: 17200, fleetActive: 68, fuelLiters: 14800, downtimeMin: 45 },
        { shift: "Shift B (Siang)", coalMT: 4850, obBCM: 16100, fleetActive: 65, fuelLiters: 13900, downtimeMin: 210 },
        { shift: "Shift C (Malam)", coalMT: 4200, obBCM: 15300, fleetActive: 66, fuelLiters: 13450, downtimeMin: 60 },
      ],
      equipmentHighlight: [
        { code: "EX-201", type: "Excavator", status: "OPERATIONAL", pa: 94.2, prodMT: 480, fuelL: 92 },
        { code: "EX-204", type: "Excavator", status: "BREAKDOWN (Hydraulic)", pa: 64.5, prodMT: 280, fuelL: 110 },
        { code: "HT-112", type: "Haul Truck", status: "ANOMALY FUEL", pa: 89.0, prodMT: 390, fuelL: 68.4 },
        { code: "HT-108", type: "Haul Truck", status: "TIRE REPAIR", pa: 82.0, prodMT: 340, fuelL: 48 },
      ],
      aiInsight: summary.predictive,
      aiRecommendation: summary.prescriptive,
      rcaTopCandidate: rca.topCandidates[0]?.title || "Downtime EX-204 Hydraulic Hose",
      anomaliesCount: anomalies.length,
      signatures: {
        preparedBy: "Supervisi Dispatch & Engineering",
        reviewedBy: "Mine Operational Manager",
        approvedBy: "Kepala Teknik Tambang (KTT)",
      },
    };
  }

  private static getReportTitle(reportType: ReportType): string {
    switch (reportType) {
      case "DAILY_MINING":
        return "LAPORAN HARIAN MINESMART AI (DAILY MINING REPORT)";
      case "SHIFT_PERFORMANCE":
        return "LAPORAN PER KELOMPOK SHIFT MINING";
      case "WEEKLY_PERFORMANCE":
        return "LAPORAN MINGGUAN KINERJA TAMBANG & KPI";
      case "MONTHLY_MANAGEMENT":
        return "LAPORAN EXECUTIVE BULANAN MANAJEMEN TAMBANG";
      case "PRODUCTION":
        return "LAPORAN SPESIFIK PRODUKSI BATUBARA & OVERBURDEN";
      case "FLEET":
        return "LAPORAN POPULASI & EFISIENSI ARMADA TAMBANG";
      case "HSE":
        return "LAPORAN KESELAMATAN & KESEHATAN KERJA (K3 TAMBANG)";
      case "MAINTENANCE":
        return "LAPORAN PERAWATAN ALAT BERAT & BREAKDOWN";
      case "ESDM_RKAB":
        return "LAPORAN KINERJA PERIODIK ESDM DITJEN MINERBA";
      case "AI_GENERATED":
        return "AI SYNTHESIZED EXECUTIVE AUDIT REPORT";
      default:
        return "LAPORAN OPERASIONAL TERINTEGRASI MINESMART";
    }
  }

  /**
   * Generates formatted CSV string for download.
   */
  public static exportToCSV(data: any): string {
    const headers = ["Indicator / Metric", "Actual", "Target", "Unit", "Achievement %", "Status"];
    const rows = [
      ["Coal Production", data.kpiSummary.coalProductionActual, data.kpiSummary.coalProductionTarget, "MT", data.kpiSummary.coalAchievementPct + "%", "GOOD"],
      ["OB Production", data.kpiSummary.obActualBCM, data.kpiSummary.obTargetBCM, "BCM", "97.2%", "GOOD"],
      ["Fleet Availability (PA)", data.kpiSummary.fleetAvailabilityPA + "%", data.kpiSummary.fleetAvailabilityTarget + "%", "%", "98.3%", "WARNING"],
      ["Fuel Consumption", data.kpiSummary.fuelConsumptionLiters, "-", "Liters", "-", "NORMAL"],
      ["Fuel Ratio", data.kpiSummary.fuelRatioLitersPerTon, "1.38", "L/MT", "-", "WARNING"],
      ["Cost Per Ton", "$" + data.kpiSummary.costPerTonUSD, "$" + data.kpiSummary.costBudgetUSD, "USD/MT", "-", "OVERRUN_RISK"],
      ["Coal Quality GAR", data.kpiSummary.qualityGAR, "4200", "kcal/kg", "-", "COMPLIANT"],
    ];

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  /**
   * Generates print-ready HTML string suitable for PDF generation or direct print.
   */
  public static generatePrintableHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.title}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 20px; color: #1e293b; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 20px; color: #047857; }
          .header p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; rounded: 8px; text-align: center; }
          .kpi-card .val { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .kpi-card .lbl { font-size: 10px; text-transform: uppercase; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; }
          .ai-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 6px; font-size: 12px; margin-bottom: 20px; }
          .footer { font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; }
          .sig-box { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; margin-top: 40px; font-size: 11px; }
          .sig-line { margin-top: 50px; border-top: 1px solid #000; width: 70%; margin-left: auto; margin-right: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.title}</h1>
          <p><strong>Perusahaan:</strong> ${data.companyName} | <strong>Site:</strong> ${data.siteName} | <strong>Periode:</strong> ${data.period}</p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="lbl">Actual Coal</div>
            <div class="val">${data.kpiSummary.coalProductionActual.toLocaleString()} MT</div>
          </div>
          <div class="kpi-card">
            <div class="lbl">Target Coal</div>
            <div class="val">${data.kpiSummary.coalProductionTarget.toLocaleString()} MT</div>
          </div>
          <div class="kpi-card">
            <div class="lbl">OB Removal</div>
            <div class="val">${data.kpiSummary.obActualBCM.toLocaleString()} BCM</div>
          </div>
          <div class="kpi-card">
            <div class="lbl">Fleet Availability</div>
            <div class="val">${data.kpiSummary.fleetAvailabilityPA}% PA</div>
          </div>
        </div>

        <h3>1. Rincian Produksi Shift Hari Ini</h3>
        <table>
          <thead>
            <tr>
              <th>Kode Shift</th>
              <th>Coal MT</th>
              <th>OB BCM</th>
              <th>Unit Aktif</th>
              <th>Fuel (Liter)</th>
              <th>Downtime (Min)</th>
            </tr>
          </thead>
          <tbody>
            ${data.shiftData
              .map(
                (s: any) => `
              <tr>
                <td>${s.shift}</td>
                <td>${s.coalMT.toLocaleString()}</td>
                <td>${s.obBCM.toLocaleString()}</td>
                <td>${s.fleetActive}</td>
                <td>${s.fuelLiters.toLocaleString()}</td>
                <td>${s.downtimeMin}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h3>2. Sorotan Performa Alat Berat Utama</h3>
        <table>
          <thead>
            <tr>
              <th>Kode Alat</th>
              <th>Kategori</th>
              <th>Status Operasional</th>
              <th>Physical Availability (PA)</th>
              <th>Konsumsi Solar (L/h)</th>
            </tr>
          </thead>
          <tbody>
            ${data.equipmentHighlight
              .map(
                (e: any) => `
              <tr>
                <td>${e.code}</td>
                <td>${e.type}</td>
                <td>${e.status}</td>
                <td>${e.pa}%</td>
                <td>${e.fuelL}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="ai-box">
          <strong>🤖 AI Synthesis & Recommendation (Prompt 32/33 Grounded):</strong>
          <p>${data.aiInsight}</p>
          <p><strong>Tindakan Preskriptif:</strong> ${data.aiRecommendation}</p>
        </div>

        <div class="sig-box">
          <div>
            Disiapkan oleh:
            <div class="sig-line"></div>
            ${data.signatures.preparedBy}
          </div>
          <div>
            Ditinjau oleh:
            <div class="sig-line"></div>
            ${data.signatures.reviewedBy}
          </div>
          <div>
            Disetujui oleh:
            <div class="sig-line"></div>
            ${data.signatures.approvedBy}
          </div>
        </div>

        <div class="footer">
          <span>MineSmart AI Enterprise Platform - Confidential</span>
          <span>Dicetak pada: ${data.generatedAt}</span>
        </div>
      </body>
      </html>
    `;
  }
}
