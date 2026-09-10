// MINE SMART AI - AI Report Generator Types
// 1-Click Instant Multi-Report Synthesis & Multi-Format Export (PDF, Excel, Word)

export type AIReportType =
  | "DAILY_MINING"
  | "DAILY_PRODUCTION"
  | "WEEKLY_REPORT"
  | "MONTHLY_REPORT"
  | "HSE_REPORT"
  | "MAINTENANCE_REPORT"
  | "FLEET_REPORT"
  | "MANAGEMENT_REPORT";

export type ExportFormat = "PDF" | "EXCEL" | "WORD";

export interface AIReportMetadata {
  id: string;
  type: AIReportType;
  title: string;
  subtitle: string;
  periodLabel: string;
  generatedAt: string;
  generatedBy: string;
  siteName: string;
  companyName: string;
  kttName: string;
  approvalStatus: "APPROVED" | "PENDING_APPROVAL" | "DRAFT";
  version: string;
  documentNumber: string;
}

export interface KPIItem {
  label: string;
  actual: string | number;
  target: string | number;
  unit: string;
  variancePct: number;
  status: "OPTIMAL" | "WARNING" | "CRITICAL";
  insight?: string;
}

export interface TableRowData {
  [key: string]: string | number;
}

export interface TableSection {
  title: string;
  description?: string;
  columns: { key: string; label: string; align?: "left" | "center" | "right" }[];
  rows: TableRowData[];
  totals?: TableRowData;
}

export interface ChartDataPoint {
  label: string;
  actual: number;
  target?: number;
  secondaryVal?: number;
}

export interface GeneratedAIReport {
  metadata: AIReportMetadata;
  aiExecutiveSummary: {
    highlights: string[];
    criticalAnomalies: string[];
    actionItems: string[];
    geminiInsight: string;
    confidenceScore: number;
  };
  kpis: KPIItem[];
  tables: TableSection[];
  chartsSummary?: {
    title: string;
    data: ChartDataPoint[];
  };
  complianceSignoff: {
    kttSignature: string;
    mineSuperintendentSignature: string;
    safetyOfficerSignature?: string;
    date: string;
    qrHash: string;
  };
}

export interface ReportCategoryConfig {
  type: AIReportType;
  title: string;
  shortDesc: string;
  category: "DAILY" | "PERIODIC" | "SAFETY_MAINTENANCE" | "OPERATIONAL" | "EXECUTIVE";
  iconName: string;
  badge: string;
  defaultTimeframe: string;
  primaryMetric: string;
}
