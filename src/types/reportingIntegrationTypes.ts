// MINE SMART AI - Reporting, BI & Integration Hub Types (PROMPT 34)

export type ReportType =
  | "DAILY_MINING"
  | "SHIFT_PERFORMANCE"
  | "WEEKLY_PERFORMANCE"
  | "MONTHLY_MANAGEMENT"
  | "PRODUCTION"
  | "FLEET"
  | "HSE"
  | "MAINTENANCE"
  | "MANAGEMENT_EXECUTIVE"
  | "AI_GENERATED"
  | "ESDM_RKAB";

export type ReportStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "SCHEDULED";

export interface ReportTemplate {
  templateId: string;
  templateName: string;
  reportType: ReportType;
  companyId: string;
  siteId: string;
  sections: string[];
  filters: Record<string, any>;
  columns: string[];
  charts: string[];
  logoUrl?: string;
  headerTitle: string;
  footerText: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: ReportStatus;
}

export interface ReportSchedule {
  scheduleId: string;
  templateId: string;
  reportName: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
  cronTime: string; // e.g. "07:00 WITA"
  recipients: {
    userId?: string;
    role?: string;
    department?: string;
    email?: string;
  }[];
  lastRunAt?: string;
  nextRunAt: string;
  status: "ACTIVE" | "PAUSED";
}

export interface ReportArchiveRecord {
  reportId: string;
  templateId: string;
  reportName: string;
  reportType: ReportType;
  period: string;
  generatedAt: string;
  generatedBy: string;
  fileReference: string;
  format: "PDF" | "EXCEL" | "CSV";
  version: number;
  watermark?: string;
  digitalSignature?: {
    preparedBy: string;
    reviewedBy: string;
    approvedBy: string;
    approvalDate: string;
  };
}

// BI Engine Types
export type WidgetType =
  | "KPI_CARD"
  | "LINE_CHART"
  | "BAR_CHART text"
  | "AREA_CHART"
  | "PIE_CHART"
  | "TABLE"
  | "RANKING"
  | "GAUGE"
  | "HEATMAP"
  | "AI_INSIGHT"
  | "DATA_BADGE";

export interface KPIDefinition {
  kpiId: string;
  kpiName: string;
  category: "PRODUCTION font" | "FLEET" | "FUEL" | "FINANCE" | "HSE" | "QUALITY";
  formula: string; // e.g. "Achievement % = (Actual / Target) * 100"
  actualValue: number;
  targetValue: number;
  unit: string;
  achievementPct: number;
  threshold: {
    good: number;
    warning: number;
    critical: number;
  };
  status: "GOOD" | "WARNING" | "CRITICAL";
}

export interface BIDashboardWidget {
  widgetId: string;
  widgetTitle: string;
  widgetType: WidgetType;
  dataSource: string; // e.g. "Production Logs", "FMS GPS Telemetry", "ERP Ledger"
  kpiId?: string;
  chartType?: "LINE" | "BAR" | "AREA" | "PIE" | "DONUT" | "GAUGE";
  w: number; // Grid width (1-12)
  h: number; // Grid height
}

export interface BIDashboardView {
  dashboardId: string;
  dashboardName: string;
  category: "EXECUTIVE" | "PRODUCTION" | "FLEET" | "HSE" | "MAINTENANCE" | "FINANCE" | "GEOLOGY" | "STOCKPILE" | "AI";
  companyId: string;
  siteId: string;
  widgets: BIDashboardWidget[];
  sharingScope: "PRIVATE" | "DEPARTMENT" | "ROLE" | "COMPANY";
  createdBy: string;
  createdAt: string;
  isDefault?: boolean;
}

// Integration Hub & Connectors Types
export type IntegrationType =
  | "REST_API"
  | "WEBHOOK"
  | "GPS"
  | "IOT"
  | "FMS"
  | "ERP"
  | "DRONE"
  | "LABORATORY"
  | "WEIGHBRIDGE"
  | "ATTENDANCE"
  | "NOTIFICATION";

export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR" | "SYNCING" | "PAUSED";

export interface IntegrationConnector {
  integrationId: string;
  providerName: string; // e.g. "Hexagon FMS", "Caterpillar MineStar", "SAP S/4HANA", "DJI Terra Drone", "Mettler Toledo Weighbridge", "IoT Edge Telemetry"
  type: IntegrationType;
  companyId: string;
  siteId: string;
  status: IntegrationStatus;
  lastSyncAt: string;
  syncFrequency: string; // e.g. "Real-time 5s", "Every 15 min", "Daily midnight"
  healthScore: number; // 0-100
  latencyMs: number;
  errorRatePct: number;
  dataFreshnessMinutes: number;
  credentialsReference: string;
  config: Record<string, any>;
}

export interface APIKeyRecord {
  keyId: string;
  keyName: string;
  apiKeyHash: string;
  rawKeyPrefix: string; // e.g. "ms_live_9f82..."
  scopes: string[]; // ["production.read", "fleet.read", "weighbridge.write", etc.]
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  status: "ACTIVE" | "REVOKED";
}

export interface WebhookSubscription {
  webhookId: string;
  name: string;
  targetUrl: string;
  events: string[]; // ["production.created", "equipment.breakdown", "hse.incident.created"]
  secretKey: string;
  retryPolicy: "EXPONENTIAL_BACKOFF_3X" | "LINEAR_5X";
  status: "ACTIVE" | "PAUSED" | "FAILED";
  lastTriggeredAt?: string;
  deliverySuccessPct: number;
}

export interface WebhookDeliveryLog {
  logId: string;
  webhookId: string;
  event: string;
  payloadSummary: string;
  httpStatus: number;
  durationMs: number;
  timestamp: string;
  status: "SUCCESS" | "FAILED" | "RETRYING";
  errorMessage?: string;
}

export interface UniversalFieldMapping {
  mappingId: string;
  sourceSystem: string;
  targetModule: string;
  fieldPairs: {
    externalField: string;
    mineSmartField: string;
    transformation?: string; // "STRING_TO_UPPER", "KG_TO_TON", "UTC_TO_LOCAL"
  }[];
}

export interface UniversalImportRecord {
  importId: string;
  fileName: string;
  fileType: "CSV" | "EXCEL" | "JSON" | "GEOJSON" | "DXF" | "SHP";
  targetModule: string;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  importedAt: string;
  importedBy: string;
  status: "VALIDATED" | "IMPORTED" | "FAILED" | "PENDING_MAPPING";
}

export interface UniversalExportJob {
  exportId: string;
  exportType: "REPORT_PDF" | "REPORT_EXCEL" | "DATA_CSV" | "GEOJSON_GIS";
  requestedBy: string;
  requestedAt: string;
  fileSizeMb: number;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
  downloadUrl: string;
  expiresAt: string;
}

export interface IntegrationAuditLogRecord {
  auditId: string;
  action: string; // "API_KEY_CREATED", "WEBHOOK_TRIGGERED", "SYNC_COMPLETED", "DATA_IMPORTED", "REPORT_EXPORTED"
  performedBy: string;
  integrationId?: string;
  details: string;
  timestamp: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
}
