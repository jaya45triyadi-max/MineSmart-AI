// MINE SMART AI - AI Analytics, Prediction & Root Cause Engine Types (PROMPT 33)

export type DataQualityStatus = "GOOD" | "INSUFFICIENT_DATA" | "DEGRADED" | "INVALID_UNITS";

export interface DataQualityCheckResult {
  isSufficient: boolean;
  status: DataQualityStatus;
  missingFields: string[];
  outliersCount: number;
  dataPointsCount: number;
  message: string;
  freshnessMinutes: number;
  unitConsistency: string;
}

export type ForecastHorizon =
  | "NEXT_SHIFT"
  | "TOMORROW"
  | "NEXT_7_DAYS"
  | "NEXT_14_DAYS"
  | "END_OF_MONTH"
  | "NEXT_MONTH"
  | "QUARTER"
  | "CUSTOM";

export interface DataLineageInfo {
  sourceModules: string[];
  sourceRecordsCount: number;
  dataPeriod: string;
  calculationMethod: string;
  modelVersion: string;
  generatedAt: string;
}

export interface ProductionDriverItem {
  driverName: string;
  impact: string;
  contributionPct: number;
  direction: "POSITIVE" | "NEGATIVE";
}

export interface ProductionForecastResult {
  horizon: ForecastHorizon;
  actualCoalMT: number;
  targetCoalMT: number;
  planCoalMT: number;
  forecastCoalMT: number;
  lowerBoundMT: number;
  upperBoundMT: number;
  expectedVarianceMT: number;
  confidencePct: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  mainDrivers: ProductionDriverItem[];
  rcaAvailable: boolean;
  dataLineage: DataLineageInfo;
  dataQuality: DataQualityCheckResult;
}

export interface FuelAnomalyItem {
  id: string;
  equipmentId: string;
  unitCode: string;
  anomalyType:
    | "SUDDEN_FUEL_INCREASE"
    | "UNUSUAL_FUEL_PER_HOUR"
    | "UNUSUAL_FUEL_PER_TON"
    | "UNUSUAL_FUEL_PER_KM"
    | "LOCATION_ANOMALY"
    | "OPERATOR_ANOMALY";
  detectedAt: string;
  baselineLitersPerHour: number;
  observedLitersPerHour: number;
  deviationPct: number;
  description: string;
  label: "Fuel consumption anomaly detected";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  investigationStatus: "DETECTED" | "UNDER_INVESTIGATION" | "RESOLVED" | "DISMISSED";
}

export interface FuelForecastResult {
  horizon: ForecastHorizon;
  actualLiters: number;
  expectedLiters: number;
  forecastFuelPerTon: number;
  forecastCostIDR: number;
  abnormalRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  anomaliesDetected: FuelAnomalyItem[];
  dataLineage: DataLineageInfo;
}

export interface CostContributorItem {
  category: string;
  amountUSD: number;
  contributionPct: number;
  changePct: number;
}

export interface CostForecastResult {
  horizon: ForecastHorizon;
  actualCostUSD: number;
  budgetCostUSD: number;
  forecastCostUSD: number;
  actualCostPerTonUSD: number;
  forecastCostPerTonUSD: number;
  budgetCostPerTonUSD: number;
  overrunRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedVarianceUSD: number;
  mainContributors: CostContributorItem[];
  dataLineage: DataLineageInfo;
}

export interface QualityForecastResult {
  horizon: ForecastHorizon;
  expectedGAR: number;
  expectedAshPct: number;
  expectedSulfurPct: number;
  expectedTMPct: number;
  specificationRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidencePct: number;
  isSufficientData: boolean;
  dataQualityMessage: string;
  dataLineage: DataLineageInfo;
}

export interface ExcavatorMatchRecommendation {
  excavatorCode: string;
  currentTrucks: number;
  recommendedTrucks: number;
  expectedQueueMin: number;
  expectedCycleTimeMin: number;
  expectedProductivityMT: number;
  fuelSavedLiters: number;
  efficiencyGainPct: number;
  reason: string;
}

export interface FleetOptimizationResult {
  excavatorRecommendations: ExcavatorMatchRecommendation[];
  currentDispatchVsOptimized: {
    currentProductionMT: number;
    optimizedProductionMT: number;
    currentCycleTimeMin: number;
    optimizedCycleTimeMin: number;
    currentQueueMin: number;
    optimizedQueueMin: number;
    fuelSavingsLiters: number;
  };
  dataLineage: DataLineageInfo;
}

export interface WhatIfFleetSimulationParams {
  addedTrucks: number;
  addedExcavators: number;
  availabilityPct: number;
  haulingDistanceKm: number;
  fuelPriceIDR: number;
  coalPriceUSD: number;
  targetMT: number;
}

export interface WhatIfFleetSimulationResult {
  simulatedProductionMT: number;
  varianceProductionMT: number;
  simulatedQueueMin: number;
  simulatedFuelLiters: number;
  simulatedCostPerTonUSD: number;
  simulatedRevenueUSD: number;
  simulatedProfitUSD: number;
  varianceProfitUSD: number;
  label: "Simulation Result";
  confidencePct: number;
  assumptions: string[];
}

export interface RootCauseNode {
  id: string;
  label: string;
  category: "PRODUCTION" | "FLEET" | "DISPATCH" | "HAULING" | "MAINTENANCE" | "OPERATIONS" | "FUEL";
  valueChange: string;
  contributionPct: number | null;
  isStatisticallyEstablished: boolean;
  evidence: string[];
  children?: RootCauseNode[];
}

export interface CorrelationNote {
  metricA: string;
  metricB: string;
  coefficient: number;
  label: string; // "berkorelasi dengan"
}

export interface RootCauseAnalysisResult {
  problem: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rootNode: RootCauseNode;
  topCandidates: Array<{
    title: string;
    contributionPct: number | null;
    evidence: string[];
    isStatisticallyEstablished: boolean;
  }>;
  correlationNotes: CorrelationNote[];
  dataLineage: DataLineageInfo;
}

export interface AnomalyItem {
  id: string;
  anomalyType: "POINT" | "TREND" | "SEASONAL" | "CONTEXTUAL" | "MULTIVARIATE";
  affectedModule: string;
  affectedAsset: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  anomalyScore: number;
  detectedAt: string;
  baselineValue: number;
  observedValue: number;
  expectedValue: number;
  deviationPct: number;
  description: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
}

export interface RiskMatrixItem {
  id: string;
  category:
    | "PRODUCTION"
    | "EQUIPMENT"
    | "MAINTENANCE"
    | "FUEL"
    | "COST"
    | "QUALITY"
    | "HSE"
    | "ENVIRONMENT"
    | "INVENTORY"
    | "SCHEDULE";
  title: string;
  probability: "LOW" | "MEDIUM" | "HIGH";
  impact: "LOW" | "MEDIUM" | "HIGH";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskFactors: string[];
  recommendedAction: string;
}

export interface AIModelMetadata {
  modelId: string;
  modelName: string;
  modelType: "PRODUCTION" | "FUEL" | "MAINTENANCE" | "COST" | "QUALITY" | "OPTIMIZATION" | "RISK";
  version: string;
  status: "DRAFT" | "TESTING" | "ACTIVE" | "RETIRED";
  trainingPeriod: string;
  features: string[];
  metrics: {
    mae?: number;
    rmse?: number;
    mape?: number;
    precision?: number;
    recall?: number;
    f1?: number;
    auc?: number;
  };
  accuracyPct: number;
  isDrifted: boolean;
  lastEvaluated: string;
  createdAt: string;
}

export interface AIAnalyticsRecommendation {
  id: string;
  problem: string;
  evidence: string[];
  prediction: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  expectedImpact: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  urgency: "IMMEDIATE" | "WITHIN_SHIFT" | "THIS_WEEK";
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export interface AIAnalyticsSummary {
  descriptive: string;
  diagnostic: string;
  predictive: string;
  prescriptive: string;
}
