import { BaseEntity } from "./index";

export type StockpileType =
  | "ROM"
  | "PRODUCT"
  | "BLENDING"
  | "TEMPORARY"
  | "REJECT"
  | "OTHER";

export type StockpileStatus =
  | "ACTIVE"
  | "FULL"
  | "NEAR_FULL"
  | "EMPTY"
  | "BLOCKED"
  | "MAINTENANCE"
  | "INACTIVE";

export type CoalType =
  | "Thermal Coal"
  | "Coking Coal"
  | "Raw Coal"
  | "Clean Coal"
  | "Crushed Coal"
  | "Washed Coal"
  | "Product Coal"
  | "Other";

export type StockpileQualityStatus = "ON SPEC" | "WARNING" | "OUT OF SPEC" | "UNKNOWN";

export type MovementType =
  | "IN"
  | "OUT"
  | "REHANDLE_IN"
  | "REHANDLE_OUT"
  | "ADJUSTMENT"
  | "TRANSFER"
  | "BLENDING_IN"
  | "BLENDING_OUT";

export interface StockpileLocation {
  area: string;
  block: string;
  pit?: string;
  romArea?: string;
  processingArea?: string;
  port?: string;
  temporaryArea?: string;
  latitude: number;
  longitude: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface StockpileQuality {
  cvGAR: number; // kcal/kg
  totalMoisture: number; // %
  inherentMoisture: number; // %
  ash: number; // %
  sulfur: number; // %
  volatileMatter: number; // %
  hgi: number;
  sizeMm?: string;
  temperatureCelsius?: number; // Hotspot thermal sensor (°C)
  costPerTonIDR?: number; // Cost basis in IDR for economic blend solver
  status: StockpileQualityStatus;
  lastSampleDate?: string;
}

export interface Stockpile extends BaseEntity {
  stockpileId: string;
  stockpileCode: string;
  stockpileName: string;
  stockpileType: StockpileType;
  materialType: string;
  coalType: CoalType;
  location: StockpileLocation;
  capacity: number;
  capacityUnit: string;
  currentQuantity: number;
  quantityUnit: string;
  reservedQuantity?: number;
  availableQuantity?: number;
  blockedQuantity?: number;
  status: StockpileStatus;
  qualityStatus: StockpileQualityStatus;
  quality: StockpileQuality;
  operationalStatus: string;
  ageDays: number;
  temperatureCelsius?: number;
  densityTbm3?: number; // Density in Ton/m3 for volume calculation
  volumeM3?: number;
}

export interface BlendingOptimizerTarget {
  targetGAR: number;
  minGAR: number;
  maxGAR: number;
  maxAsh: number;
  maxSulfur: number;
  maxMoisture: number;
  targetTonnage: number;
  vesselType?: string;
  strategy: "PROFIT_MAXIMIZATION" | "BALANCED_SPEC" | "AGING_DEPLETION" | "LOWEST_REHANDLING";
}

export interface BlendingAiRecipeComponent {
  stockpileId: string;
  stockpileCode: string;
  stockpileName: string;
  coalType: string;
  tonnage: number;
  percentage: number;
  cvGAR: number;
  ash: number;
  sulfur: number;
  totalMoisture: number;
  unitCostIDR: number;
  locationArea: string;
}

export interface BlendingAiRecipe {
  recipeId: string;
  recipeName: string;
  strategy: "PROFIT_MAXIMIZATION" | "BALANCED_SPEC" | "AGING_DEPLETION" | "LOWEST_REHANDLING";
  matchScorePercent: number;
  components: BlendingAiRecipeComponent[];
  blendedQuality: {
    cvGAR: number;
    ash: number;
    sulfur: number;
    totalMoisture: number;
    volatileMatter: number;
    hgi: number;
  };
  specCompliance: {
    cvOk: boolean;
    ashOk: boolean;
    sulfurOk: boolean;
    moistureOk: boolean;
    isAllCompliant: boolean;
    cvDelta: number;
    ashDelta: number;
    sulfurDelta: number;
  };
  financials: {
    costPerTonIDR: number;
    totalCostIDR: number;
    estimatedSavingsIDR: number;
    highGradeSavedTon: number;
  };
  riskAssessment: {
    spontaneousRiskScore: "LOW" | "MODERATE" | "HIGH";
    rehandlingComplexity: "SIMPLE" | "MEDIUM" | "COMPLEX";
    aiRecommendationRationale: string;
  };
}

export interface StockMovement extends BaseEntity {
  movementId: string;
  stockpileId: string;
  stockpileName?: string;
  movementType: MovementType;
  sourceStockpileId?: string;
  sourceStockpileName?: string;
  destinationStockpileId?: string;
  destinationStockpileName?: string;
  materialType: string;
  coalType: CoalType;
  quantity: number;
  unit: string;
  qualitySnapshot?: Partial<StockpileQuality>;
  date: string;
  timestamp: string;
  shift: string;
  equipmentId?: string;
  truckId?: string;
  operatorId?: string;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  createdBy?: string;
}

export interface BlendingPlan extends BaseEntity {
  blendingPlanId: string;
  blendingPlanCode: string;
  targetProduct: string;
  targetQuantity: number;
  targetQuality: {
    cvGAR: number;
    ash: number;
    totalMoisture: number;
    sulfur: number;
  };
  sourceStockpiles: {
    stockpileId: string;
    stockpileName: string;
    coalType: string;
    quantity: number;
    percentage: number;
    cvGAR: number;
    ash: number;
    totalMoisture: number;
    sulfur: number;
  }[];
  expectedQuality: {
    cvGAR: number;
    ash: number;
    totalMoisture: number;
    sulfur: number;
  };
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "EXECUTED" | "CANCELLED";
  plannedDate: string;
  approvedBy?: string;
}

export interface RehandlingRecord extends BaseEntity {
  rehandlingId: string;
  sourceStockpileId: string;
  sourceStockpileName: string;
  destinationStockpileId: string;
  destinationStockpileName: string;
  quantity: number;
  unit: string;
  reason: string;
  equipmentId: string;
  truckId: string;
  distanceKm: number;
  cycleTimeMinutes: number;
  fuelConsumptionLiters: number;
  costIDR: number;
  shift: string;
  date: string;
  operatorId: string;
  status: "COMPLETED" | "IN_PROGRESS" | "CANCELLED";
}

export interface StockReconciliation extends BaseEntity {
  reconciliationId: string;
  stockpileId: string;
  stockpileName: string;
  openingStock: number;
  totalIncoming: number;
  totalOutgoing: number;
  calculatedClosing: number;
  surveyQuantity: number;
  variance: number;
  variancePercent: number;
  density: number; // Ton/m3
  volumeM3: number;
  surveyDate: string;
  surveyRefId?: string;
  status: "MATCHED" | "MINOR_VARIANCE" | "MAJOR_VARIANCE" | "REVIEW_REQUIRED";
  approvedBy?: string;
  notes?: string;
}

export interface StockAdjustment extends BaseEntity {
  adjustmentId: string;
  stockpileId: string;
  stockpileName: string;
  quantity: number; // positive or negative
  unit: string;
  reason:
    | "Survey Adjustment"
    | "Measurement Correction"
    | "Data Correction"
    | "Loss"
    | "Gain"
    | "Other";
  reference: string;
  evidence?: string;
  approvedBy?: string;
  approvalStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
}

export interface StockForecast extends BaseEntity {
  forecastId: string;
  period: "1 Day" | "7 Days" | "30 Days" | "Monthly";
  stockpileId: string;
  stockpileName: string;
  currentStock: number;
  expectedIncoming: number;
  expectedOutgoing: number;
  expectedClosingStock: number;
  capacityUtilization: number;
  potentialShortage: number;
  potentialOverflow: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export interface StockpileAlert extends BaseEntity {
  alertId: string;
  stockpileId: string;
  stockpileName: string;
  type:
    | "Stockpile Near Full"
    | "Stockpile Full"
    | "Stockpile Empty"
    | "Negative Stock Attempt"
    | "High Stock Variance"
    | "Quality Out of Spec"
    | "Aging Stock"
    | "Excessive Rehandling"
    | "Unexpected Movement"
    | "Blending Failure"
    | "Capacity Risk";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  status: "Detected" | "Acknowledged" | "Investigating" | "Resolved";
  timestamp: string;
}

export interface StockpileReport extends BaseEntity {
  reportId: string;
  reportCode: string;
  title: string;
  type: string;
  period: string;
  generatedAt: string;
  format: "PDF" | "EXCEL" | "CSV";
  status: string;
}
