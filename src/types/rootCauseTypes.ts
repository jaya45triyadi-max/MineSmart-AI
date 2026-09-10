// MINE SMART AI - AI Root Cause Analysis (RCA) & Diagnostic Traversal Types
// Core USP: Automated Multi-Dimensional Mining Pipeline Diagnostic Engine

export type RcaPipelineStepKey =
  | "production"
  | "fleet"
  | "downtime"
  | "hauling"
  | "fuel"
  | "weather"
  | "maintenance";

export type RcaAnomalyCategory =
  | "PRODUCTION_DROP"
  | "FUEL_RATIO_SPIKE"
  | "CYCLE_TIME_SURGE"
  | "RKAB_DEFICIT"
  | "AVAILABILITY_LOSS"
  | "COST_OVERRUN";

export type RcaSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface PipelineDiagnosticNode {
  stepKey: RcaPipelineStepKey;
  stepName: string;
  categoryLabel: string;
  status: "NORMAL" | "ANOMALY_DETECTED" | "CRITICAL_BOTTLENECK" | "INVESTIGATING";
  confidencePct: number;
  metricObserved: string;
  deviationText: string;
  impactScore: number; // 0 - 100
  keyFindings: string[];
  contributingEntities?: string[];
  latencyMs: number;
}

export interface ContributionFactor {
  entityCode: string; // e.g. "EX-03 (Komatsu PC2000)"
  entityType: "EXCAVATOR" | "HAUL_TRUCK" | "DOZER" | "HAUL_ROAD" | "CRUSHER" | "WEATHER" | "CREW";
  contributionPct: number; // e.g. 41.2%
  lostVolumeTonsOrBcm: number;
  downtimeHours?: number;
  failureMode: string;
  subSystem?: string; // e.g. "Main Hydraulic Pump 1"
}

export interface PrescriptiveRecommendation {
  id: string;
  tier: "IMMEDIATE_DISPATCH" | "MAINTENANCE_OVERHAUL" | "SHIFT_OPTIMIZATION" | "STRATEGIC";
  title: string;
  actionText: string;
  targetEntity: string;
  estimatedRecoveryPct: number; // e.g. +9.4% recovery
  estimatedTimeframe: string; // e.g. "Immediate (15 mins)" or "Shift 2"
  actionOwner: string; // e.g. "Pit Dispatcher / Maintenance Supervisor"
  isApplied?: boolean;
}

export interface RootCauseCase {
  id: string;
  title: string;
  code: string;
  anomalyCategory: RcaAnomalyCategory;
  severity: RcaSeverity;
  timestamp: string;
  pitLocation: string;
  primaryMetric: {
    label: string; // e.g. "OB & Coal Production Output"
    target: string; // e.g. "12,500 BCM/Shift"
    actual: string; // e.g. "10,625 BCM/Shift"
    dropPct: number; // e.g. -15.0%
    impactLossVal: string; // e.g. "-1,875 BCM (-Rp 142.5 Jt)"
  };
  
  // Pipeline Diagnostic Steps (Production -> Fleet -> Downtime -> Hauling -> Fuel -> Weather -> Maintenance)
  pipelineTraversal: PipelineDiagnosticNode[];
  
  // Core AI RCA Findings
  rootCauseSummary: {
    headline: string; // "Downtime excavator lini utama meningkat +21.4% akibat failure hidrolik"
    primaryFactor: string; // "EX-03 & EX-05 Hydraulic Slew & Boom Cylinder Malfunction"
    confidencePct: number; // 96.8%
    causalChainSummary: string; // "Weather (Rain 14mm) -> Wet Haul Road -> Excavator Over-idling -> Hydraulic Thermal Spike -> Line Breakdown"
  };
  
  // Contribution Breakdown (Pareto)
  contributions: ContributionFactor[];
  
  // Actionable Prescriptive Recommendations
  recommendations: PrescriptiveRecommendation[];

  // Counterfactual & What-If Simulation
  whatIfSimulation: {
    scenarioDescription: string;
    projectedGainPct: number;
    projectedGainVolume: string;
    roiImpact: string;
  };
}

export interface RcaDashboardSummary {
  totalAnomaliesDiagnosedToday: number;
  avgDiagnosticDurationSec: number;
  totalProductionRecoveredBcm: number;
  criticalBottlenecksResolved: number;
  accuracyRatePct: number;
}
