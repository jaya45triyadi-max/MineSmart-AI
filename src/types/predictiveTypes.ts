// MINE SMART AI - Predictive Maintenance & AI Equipment Health Center Types

import { BaseEntity } from "./index";

export type EquipmentHealthCategory = "Excellent" | "Good" | "Watch" | "Poor" | "Critical";
export type EquipmentRiskCategory = "Very Low" | "Low" | "Medium" | "High" | "Critical";
export type CriticalityLevel = "Low" | "Medium" | "High" | "Critical";
export type PredictionWindow = "Next 24 Hours" | "Next 3 Days" | "Next 7 Days" | "Next 14 Days" | "Next 30 Days" | "Next 90 Days";
export type PredictivePriority = "Monitor" | "Inspect" | "Schedule Maintenance" | "Urgent Maintenance" | "Critical Action";
export type ComponentCategory =
  | "Engine"
  | "Hydraulic System"
  | "Transmission"
  | "Electrical System"
  | "Cooling System"
  | "Fuel System"
  | "Brake System"
  | "Tyres / Tracks"
  | "Undercarriage"
  | "Other";

export type SensorDataQuality = "Valid" | "Warning" | "Invalid" | "Missing";
export type SensorAnomalyType =
  | "Sudden Increase"
  | "Sudden Decrease"
  | "Outlier"
  | "Trend Change"
  | "Repeated Spike"
  | "Sensor Drift"
  | "Missing Data";

export type RecommendationStatus = "Generated" | "Reviewed" | "Approved" | "Converted to Work Order" | "Rejected";
export type ModelStatus = "Ready" | "Limited Data" | "Insufficient Data" | "Processing" | "Unavailable";
export type ModelLifecycleStatus = "Draft" | "Testing" | "Validated" | "Production" | "Retired";
export type DataSufficiencyLevel = "Excellent" | "Good" | "Limited" | "Insufficient";

// Equipment Health Factor Breakdown
export interface HealthFactorContribution {
  factor: string; // e.g. "Maintenance History", "Breakdown Frequency", "Downtime", "MTBF", "MTTR", "Component Life", "Fuel Efficiency", "Oil & Telematics"
  statusName: "Good" | "Warning" | "Critical" | "N/A";
  weightPercent: number;
  scoreContribution: number;
  valueDisplay: string;
  notes?: string;
}

// 1. Equipment Health Score
export interface EquipmentHealthScore extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  category: string;
  brandModel: string;
  healthScore: number; // 0 - 100
  statusCategory: EquipmentHealthCategory;
  riskLevel: EquipmentRiskCategory;
  failureProbabilityPercent: number;
  predictedDowntimeHours: number;
  engineHours: number;
  nextMaintenanceInSMU: number;
  confidencePercent: number;
  lastUpdated: string;
  dataSources: string[];
  dataSufficiency: DataSufficiencyLevel;
  modelStatus: ModelStatus;
  factorContributions: HealthFactorContribution[];
  isTelematicsConnected: boolean;
}

// 2. Failure Prediction
export interface FailurePrediction extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  category: string;
  component: ComponentCategory;
  potentialFailureType: string;
  predictionWindow: PredictionWindow;
  probabilityPercent: number;
  probabilityCategory: "Low" | "Medium" | "High" | "Critical";
  riskLevel: EquipmentRiskCategory;
  confidencePercent: number;
  evidence: string;
  dataSources: string[];
  recommendedAction: string;
  predictionTimestamp: string;
  modelId: string;
  modelVersion: string;
}

// 3. Downtime Prediction
export interface DowntimePrediction extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  category: string;
  potentialDowntimeHours: number;
  predictionWindow: PredictionWindow;
  downtimeRisk: "Low" | "Medium" | "High" | "Critical";
  confidencePercent: number;
  possibleCause: string;
  potentialProductionImpactMT: number;
  potentialProductionImpactBCM: number;
  potentialCostImpactIDR: number;
  evidence: string;
  timestamp: string;
}

// 4. Equipment Risk Score
export interface EquipmentRiskScore extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  category: string;
  riskScore: number; // 0 - 100
  riskCategory: EquipmentRiskCategory;
  criticality: CriticalityLevel;
  failureProbabilityPercent: number;
  downtimeRisk: "Low" | "Medium" | "High" | "Critical";
  mtbfHours: number;
  mttrHours: number;
  overduePMCount: number;
  maintenanceBacklogDays: number;
  fleetAvailabilityImpact: string;
  priority: PredictivePriority;
  lastEvaluatedAt: string;
}

// 5. Predictive Recommendation
export interface PotentialPart {
  partNumber: string;
  partName: string;
  estimatedQty: number;
  estimatedCostIDR: number;
}

export interface PredictiveRecommendation extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  category: string;
  problem: string;
  evidence: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
  recommendationType:
    | "Monitor"
    | "Inspect"
    | "Lubricate"
    | "Replace Component"
    | "Schedule Preventive Maintenance"
    | "Perform Diagnostic"
    | "Reduce Operating Load"
    | "Check Fuel System"
    | "Check Cooling System"
    | "Check Hydraulic System"
    | "Check Electrical System"
    | "Escalate to Maintenance";
  suggestedTiming: string;
  requiredInspection: string;
  potentialParts: PotentialPart[];
  expectedImpact: string;
  priority: PredictivePriority;
  status: RecommendationStatus;
  convertedWorkOrderId?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// 6. Component Health & RUL
export interface ComponentHealth extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  componentName: string;
  category: ComponentCategory;
  healthScore: number; // 0 - 100
  operatingHours: number;
  expectedLifeHours: number;
  remainingUsefulLifeHours: number | null; // null if unavailable
  failureRisk: "Low" | "Medium" | "High" | "Critical";
  lastMaintenanceDate: string;
  nextInspectionDue: string;
  isRulAvailable: boolean;
  rulConfidencePercent: number;
  dataSources: string[];
}

// 7. Sensor & Telematics Anomaly
export interface PredictiveSensorAnomaly extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  sensorName: string; // e.g. "Engine Oil Temp", "Hydraulic Pressure", "Coolant Temp", "Transmission Vibration"
  anomalyType: SensorAnomalyType;
  measuredValue: number;
  unit: string; // "°C", "PSI", "mm/s", "RPM", "%"
  baselineValue: number;
  qualityStatus: SensorDataQuality;
  detectedAt: string;
  isSensorConnected: boolean;
  description: string;
}

// 8. Spare Part Prediction & Demand Forecast
export interface SparePartDemandForecast extends BaseEntity {
  partNumber: string;
  partName: string;
  category: string;
  currentStockQty: number;
  reservedStockQty: number;
  leadTimeDays: number;
  predictedDemand30Days: number;
  potentialStockoutDate?: string;
  suggestedReorderQty: number;
  confidencePercent: number;
  reason: string;
  unitCostIDR: number;
}

// 9. Maintenance Workload Forecast
export interface WorkloadForecastItem {
  periodLabel: "Next 7 Days" | "Next 14 Days" | "Next 30 Days" | "Next 90 Days";
  upcomingPMCount: number;
  predictedFailureCount: number;
  expectedWorkOrdersCount: number;
  expectedTechnicianHours: number;
  potentialDowntimeHoursTotal: number;
  estimatedPartsCostIDR: number;
}

// 10. Prediction History & Verification Outcome
export interface PredictionHistoryItem extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  predictionDate: string;
  predictionType: "Failure Prediction" | "Downtime Prediction" | "Anomaly Alert";
  predictedOutcome: string;
  actualOutcome?: string;
  outcomeDate?: string;
  verificationResult: "Correct Prediction" | "False Positive" | "False Negative" | "Missed Event" | "Pending Verification";
  confidencePercent: number;
  modelVersion: string;
  notes?: string;
}

// 11. Predictive Model & Versioning
export interface PredictiveModelItem extends BaseEntity {
  modelId: string;
  modelName: string;
  version: string;
  lifecycleStatus: ModelLifecycleStatus;
  createdAt: string;
  trainedAt: string;
  deployedAt?: string;
  inputFeatures: string[];
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  isGroundTruthEvaluated: boolean;
  totalPredictionsMade: number;
  description: string;
}

// 12. Predictive Alert
export interface PredictiveAlertItem extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  alertType:
    | "High Failure Risk"
    | "Critical Health Score"
    | "Rapid Health Degradation"
    | "High Downtime Risk"
    | "Repeated Failure"
    | "Component Near End-of-Life"
    | "Low Prediction Confidence"
    | "Insufficient Data";
  title: string;
  message: string;
  detectedAt: string;
  status: "Detected" | "Reviewed" | "Acknowledged" | "Assigned" | "Action Taken" | "Resolved" | "Closed";
  assignedTo?: string;
}

// 13. What-If Simulation
export interface WhatIfSimulationRequest {
  equipmentId: string;
  unitCode: string;
  simulatedDowntimeHours: number;
  scenarioDescription: string;
}

export interface WhatIfSimulationResult {
  equipmentUnitCode: string;
  simulatedDowntimeHours: number;
  potentialCoalLossMT: number;
  potentialOBLossBCM: number;
  potentialTruckImbalanceCount: number;
  potentialCostImpactIDR: number;
  confidencePercent: number;
  assumptions: string[];
}
