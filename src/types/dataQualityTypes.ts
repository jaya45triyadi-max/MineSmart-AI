// MINE SMART AI - Data Quality Center Types
// 6 Core AI Dimensions: Data Kosong | Data Duplikat | Data Tidak Wajar | Data Salah Input | Data Outlier | Data Conflict

export type DataQualityDimension =
  | "MISSING_DATA"      // Data Kosong (Null / Missing values)
  | "DUPLICATE_DATA"    // Data Duplikat (Duplicate submissions / ID collisions)
  | "UNREASONABLE_DATA" // Data Tidak Wajar (Infeasible physical / operational limits)
  | "TYPO_INPUT_DATA"   // Data Salah Input (Typo / Decimal misplaced / Formatting errors)
  | "OUTLIER_DATA"      // Data Outlier (Statistical anomaly > 3 sigma / outside baseline)
  | "CONFLICT_DATA";    // Data Conflict (Cross-source mismatch e.g., FMS vs Weighbridge vs GPS)

export type DataQualitySeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type QualityIssueStatus = "OPEN" | "IN_REVIEW" | "AUTO_FIXED" | "RESOLVED" | "IGNORED";

export type MiningDataDomain =
  | "FLEET_FUEL"
  | "PRODUCTION_HAULING"
  | "WEIGHBRIDGE"
  | "LABORATORY_ASSAY"
  | "IOT_TELEMETRY"
  | "SURVEY_GEOLOGY"
  | "HR_ATTENDANCE"
  | "FINANCE_BILLING";

export interface DataQualityIssue {
  id: string;
  dimension: DataQualityDimension;
  severity: DataQualitySeverity;
  domain: MiningDataDomain;
  entityId: string; // e.g. "HD-08", "WB-TICKET-8891", "EX-03"
  entityType: "FLEET" | "HAULER" | "EXCAVATOR" | "WEIGHBRIDGE_TICKET" | "LAB_ASSAY" | "TELEMETRY" | "DISPATCH_CYCLE" | "OPERATOR_LOG";
  fieldAffected: string; // e.g. "fuelBurnRatePerHour", "netWeightMT", "speedKmh"
  currentValue: any; // e.g. 4200 or "4.200 L/jam"
  expectedBaseline: string; // e.g. "65.0 - 82.0 L/jam (Baseline Komatsu HD785-7)"
  varianceRatio?: string; // e.g. "+5,020% di luar batas normal"
  detectedTimestamp: string;
  sourceSystem: string; // e.g. "IoT Telemetry CAN-Bus", "Manual Dispatch Sheet", "Bridge Scale Sensor"
  conflictingSource?: {
    sourceName: string;
    conflictingValue: any;
    discrepancyDelta: string;
  };
  title: string;
  description: string;
  aiRootCauseHypothesis: string;
  aiSuggestedFix: {
    recommendedValue: any;
    confidenceScore: number; // 0 - 100%
    actionType: "APPLY_DECIMAL_SHIFT" | "MERGE_DUPLICATES" | "RECONCILE_CROSS_SOURCE" | "INTERPOLATE_MISSING" | "CLAMP_TO_PHYSICAL_BOUNDS" | "FLAG_FOR_RE_SURVEY";
    actionLabel: string;
    explanation: string;
  };
  status: QualityIssueStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  auditTrail: {
    timestamp: string;
    user: string;
    action: string;
    note: string;
  }[];
}

export interface DomainHealthScore {
  domain: MiningDataDomain;
  domainLabel: string;
  score: number; // 0 - 100%
  recordsScannedToday: number;
  totalAnomalies: number;
  criticalIssues: number;
  status: "EXCELLENT" | "GOOD" | "WARNING" | "CRITICAL";
}

export interface DataQualitySummary {
  overallHealthScore: number; // 0 - 100%
  totalRecordsScanned: number;
  activeIssuesCount: number;
  resolvedTodayCount: number;
  autoFixAccuracyRate: number; // e.g. 98.4%
  dimensionCounts: Record<DataQualityDimension, number>;
  severityCounts: Record<DataQualitySeverity, number>;
  domainScores: DomainHealthScore[];
}

export interface DataQualityRule {
  id: string;
  name: string;
  dimension: DataQualityDimension;
  domain: MiningDataDomain;
  targetField: string;
  ruleType: "RANGE_BOUNDS" | "REGEX_FORMAT" | "DUPLICATE_KEY" | "Z_SCORE_OUTLIER" | "NOT_NULL" | "CROSS_SOURCE_CONSISTENCY";
  minBound?: number;
  maxBound?: number;
  unit?: string;
  toleratedVariancePct?: number;
  enabled: boolean;
  autoFixEnabled: boolean;
  description: string;
}

export interface CrossSourceComparison {
  id: string;
  recordIdentifier: string;
  field: string;
  sourceA: { name: string; value: any; timestamp: string; reliabilityScore: number };
  sourceB: { name: string; value: any; timestamp: string; reliabilityScore: number };
  deltaPercentage: number;
  aiVerdict: string;
  recommendedValue: any;
}
