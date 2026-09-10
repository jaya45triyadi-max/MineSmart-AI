// MINE SMART AI - BI Engine (PROMPT 34)

import {
  BIDashboardView,
  KPIDefinition,
} from "../../types/reportingIntegrationTypes";

export class BIEngine {
  private static defaultDashboards: BIDashboardView[] = [
    {
      dashboardId: "bi-dash-exec-01",
      dashboardName: "Executive Mining Intelligence Dashboard",
      category: "EXECUTIVE",
      companyId: "comp-1",
      siteId: "site-1",
      sharingScope: "COMPANY",
      createdBy: "Managing Director",
      createdAt: "2026-08-01T00:00:00Z",
      isDefault: true,
      widgets: [
        { widgetId: "w-1", widgetTitle: "Total Coal Production", widgetType: "KPI_CARD", dataSource: "Production Logs", kpiId: "kpi-coal-prod", w: 3, h: 2 },
        { widgetId: "w-2", widgetTitle: "Fleet Physical Availability", widgetType: "KPI_CARD", dataSource: "FMS Telematics", kpiId: "kpi-fleet-pa", w: 3, h: 2 },
        { widgetId: "w-3", widgetTitle: "OPEX Cost Per Ton ($/MT)", widgetType: "KPI_CARD", dataSource: "Finance ERP", kpiId: "kpi-cost-ton", w: 3, h: 2 },
        { widgetId: "w-4", widgetTitle: "HSE LTI Frequency Rate", widgetType: "KPI_CARD", dataSource: "HSE Incident Log", kpiId: "kpi-hse-lti", w: 3, h: 2 },
        { widgetId: "w-5", widgetTitle: "Daily Production Trajectory vs Plan", widgetType: "AREA_CHART", chartType: "AREA", dataSource: "Production Logs", w: 8, h: 4 },
        { widgetId: "w-6", widgetTitle: "Multi-Site Performance Benchmarking", widgetType: "BAR_CHART text", chartType: "BAR", dataSource: "All Sites Aggregator", w: 4, h: 4 },
        { widgetId: "w-7", widgetTitle: "AI Synthesized Prescriptive Insight", widgetType: "AI_INSIGHT", dataSource: "MineSmart AI Engine", w: 12, h: 2 },
      ],
    },
    {
      dashboardId: "bi-dash-fleet-02",
      dashboardName: "Fleet & Equipment Telematics BI",
      category: "FLEET",
      companyId: "comp-1",
      siteId: "site-1",
      sharingScope: "DEPARTMENT",
      createdBy: "Fleet Operations Manager",
      createdAt: "2026-08-05T00:00:00Z",
      widgets: [
        { widgetId: "wf-1", widgetTitle: "Physical Availability (PA)", widgetType: "GAUGE", chartType: "GAUGE", dataSource: "GPS & Telematics", kpiId: "kpi-fleet-pa", w: 4, h: 3 },
        { widgetId: "wf-2", widgetTitle: "Use of Availability (UA)", widgetType: "GAUGE", chartType: "GAUGE", dataSource: "GPS & Telematics", kpiId: "kpi-fleet-ua", w: 4, h: 3 },
        { widgetId: "wf-3", widgetTitle: "Fuel Consumption Rate (L/Hour)", widgetType: "LINE_CHART", chartType: "LINE", dataSource: "Fuel Telematics", w: 4, h: 3 },
        { widgetId: "wf-4", widgetTitle: "Excavator Loading Productivity (MT/Hour)", widgetType: "RANKING", dataSource: "Dispatch Logs", w: 6, h: 4 },
        { widgetId: "wf-5", widgetTitle: "Top Breakdown Equipment", widgetType: "TABLE", dataSource: "Maintenance Logs", w: 6, h: 4 },
      ],
    },
  ];

  private static kpiList: KPIDefinition[] = [
    {
      kpiId: "kpi-coal-prod",
      kpiName: "Total Coal Production",
      category: "PRODUCTION font",
      formula: "Achievement % = (Actual / Target) * 100",
      actualValue: 14250,
      targetValue: 15000,
      unit: "MT",
      achievementPct: 95.0,
      threshold: { good: 95, warning: 90, critical: 85 },
      status: "GOOD",
    },
    {
      kpiId: "kpi-fleet-pa",
      kpiName: "Fleet Physical Availability (PA)",
      category: "FLEET",
      formula: "PA % = (Operating Hours + Standby Hours) / Total Available Hours * 100",
      actualValue: 88.5,
      targetValue: 90.0,
      unit: "%",
      achievementPct: 98.3,
      threshold: { good: 90, warning: 85, critical: 80 },
      status: "WARNING",
    },
    {
      kpiId: "kpi-fleet-ua",
      kpiName: "Use of Availability (UA)",
      category: "FLEET",
      formula: "UA % = Operating Hours / (Operating Hours + Standby Hours) * 100",
      actualValue: 81.2,
      targetValue: 85.0,
      unit: "%",
      achievementPct: 95.5,
      threshold: { good: 85, warning: 80, critical: 75 },
      status: "WARNING",
    },
    {
      kpiId: "kpi-cost-ton",
      kpiName: "Mining Cost Per Ton",
      category: "FINANCE",
      formula: "Cost/Ton = Total OPEX Expenses / Total Coal Produced",
      actualValue: 26.8,
      targetValue: 24.5,
      unit: "USD/MT",
      achievementPct: 109.4,
      threshold: { good: 100, warning: 105, critical: 110 },
      status: "CRITICAL",
    },
    {
      kpiId: "kpi-hse-lti",
      kpiName: "Lost Time Injury (LTI) Frequency",
      category: "HSE",
      formula: "LTIFR = (Total LTI Cases * 1,000,000) / Man-Hours Worked",
      actualValue: 0.0,
      targetValue: 0.0,
      unit: "Cases",
      achievementPct: 100.0,
      threshold: { good: 0, warning: 1, critical: 2 },
      status: "GOOD",
    },
    {
      kpiId: "kpi-fuel-ratio",
      kpiName: "Fuel Burn Ratio",
      category: "FUEL",
      formula: "Fuel Ratio = Total Liters Burned / Total MT Coal",
      actualValue: 1.45,
      targetValue: 1.38,
      unit: "L/MT",
      achievementPct: 105.0,
      threshold: { good: 1.38, warning: 1.42, critical: 1.5 },
      status: "WARNING",
    },
  ];

  public static getDashboards(): BIDashboardView[] {
    return this.defaultDashboards;
  }

  public static getKPIs(): KPIDefinition[] {
    return this.kpiList;
  }

  /**
   * Multi-site benchmarking metric aggregation.
   */
  public static getMultiSiteBenchmarking() {
    return [
      { siteName: "Site Muara Enim (Current)", coalMT: 14250, paPct: 88.5, costTonUSD: 26.8, rank: "2nd / 4 Sites" },
      { siteName: "Site Lahat South", coalMT: 18400, paPct: 92.4, costTonUSD: 23.5, rank: "1st (Best Performing)" },
      { siteName: "Site Kutai Barat", coalMT: 12100, paPct: 84.1, costTonUSD: 28.2, rank: "3rd" },
      { siteName: "Site Samarinda North", coalMT: 9500, paPct: 81.0, costTonUSD: 31.0, rank: "4th (Lowest)" },
    ];
  }

  /**
   * Formula engine evaluation.
   */
  public static evaluateFormula(actual: number, target: number): { achievementPct: number; status: "GOOD" | "WARNING" | "CRITICAL" } {
    if (!target || target === 0) return { achievementPct: 100, status: "GOOD" };
    const pct = Number(((actual / target) * 100).toFixed(1));
    let status: "GOOD" | "WARNING" | "CRITICAL" = "GOOD";
    if (pct < 85) status = "CRITICAL";
    else if (pct < 95) status = "WARNING";
    return { achievementPct: pct, status };
  }
}
