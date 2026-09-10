import { BaseEntity } from "./index";

export type ProductionType = "COAL" | "OB" | "ROM" | "WASTE" | "REHANDLE" | "CRUSHING";

export type MaterialCategory = 
  | "Coal High Grade"
  | "Coal Medium Grade"
  | "Coal Low Grade"
  | "Overburden Soft"
  | "Overburden Hard"
  | "Interburden"
  | "Waste Rock"
  | "Rehandle Coal"
  | "Crushed Coal (-50mm)"
  | "Crushed Coal (-38mm)"
  | "ROM Feed Coal";

export type ProductionStatus = 
  | "DRAFT"
  | "SUBMITTED"
  | "VALIDATED"
  | "APPROVED"
  | "REJECTED"
  | "CORRECTED"
  | "ARCHIVED";

export type TargetPeriod = "HOURLY" | "SHIFT" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "ANNUAL";

export type TargetStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED" | "ARCHIVED";

export type ProductionUnit = "Ton" | "BCM" | "LCM" | "m3" | "Trips" | "Hour";

export type FactorType = "DENSITY" | "SWELL_FACTOR" | "LOAD_FACTOR" | "MATERIAL_FACTOR";

export type ShiftIdentifier = "SHIFT_1_DAY" | "SHIFT_2_NIGHT" | "SHIFT_3_CUSTOM";

export type RehandleReason = 
  | "Stockpile Management"
  | "Quality Blending"
  | "Access"
  | "Operational Requirement"
  | "Reclaim"
  | "Other";

export type LossCategory = 
  | "Equipment Downtime"
  | "Queue"
  | "Hauling Delay"
  | "Loading Delay"
  | "Dump Delay"
  | "Road Condition"
  | "Weather"
  | "Operator"
  | "Maintenance"
  | "Fuel"
  | "Other";

export type ProductionSourceType = 
  | "Dispatch"
  | "Weighbridge"
  | "Fleet"
  | "Survey"
  | "Manual"
  | "Import"
  | "Stockpile"
  | "Other";

export type DataQualityStatus = "VALID" | "WARNING" | "REQUIRES_REVIEW" | "INVALID";

export interface ProductionRecord extends BaseEntity {
  productionId: string;
  companyId: string;
  siteId: string;
  siteName?: string;
  date: string;
  shift: ShiftIdentifier;
  shiftId?: string;
  productionType: ProductionType;
  materialType: MaterialCategory | string;
  pit: string;
  pitId?: string;
  blockId?: string;
  bench: string;
  benchId?: string;
  seam?: string;
  sourceLocation: string;
  destination: string;
  equipmentId?: string;
  excavatorCode: string;
  excavatorId?: string;
  truckId?: string;
  dispatchId?: string;
  quantity: number;
  unit: ProductionUnit;
  tonnage: number;
  volume: number; // in BCM or m3
  density?: number;
  coalMT?: number;
  obBCM?: number;
  stripRatio?: number;
  haulerCount?: number;
  tripsCount?: number;
  avgPayloadTon?: number;
  productionMethod?: string;
  status: ProductionStatus;
  recordedBy: string;
  operatorName?: string;
  validatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  sourceType?: ProductionSourceType;
  sourceId?: string;
  sourceTimestamp?: string;
  dataQualityStatus?: DataQualityStatus;
  dataQualityNotes?: string;
}

export interface ConversionFactor extends BaseEntity {
  factorId: string;
  companyId: string;
  siteId: string;
  materialType: string;
  factorType: FactorType;
  value: number;
  unit: string;
  effectiveDate: string;
  expiryDate?: string;
  approvedBy: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProductionTarget extends BaseEntity {
  targetId: string;
  companyId: string;
  siteId: string;
  periodType: TargetPeriod;
  startDate: string;
  endDate: string;
  pitId?: string;
  pitName?: string;
  blockId?: string;
  benchId?: string;
  materialType?: string;
  equipmentId?: string;
  shift?: ShiftIdentifier;
  coalTargetTon: number;
  obTargetBCM: number;
  targetStripRatio: number;
  status: TargetStatus;
  submittedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  revisionVersion?: number;
  notes?: string;
}

export interface ProductionForecast extends BaseEntity {
  forecastId: string;
  companyId: string;
  siteId: string;
  horizon: "END_OF_SHIFT" | "END_OF_DAY" | "END_OF_WEEK" | "END_OF_MONTH";
  targetTon: number;
  currentActualTon: number;
  forecastTon: number;
  projectedAchievementPercent: number;
  potentialGapTon: number;
  requiredProductionRateTonPerHour: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  confidenceFactors: string[];
  scenarioName?: string;
  assumptions: string[];
  generatedAt: string;
}

export interface ProductionLossRecord extends BaseEntity {
  lossId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  category: LossCategory;
  estimatedLossTon: number;
  estimatedLossBCM: number;
  durationMinutes: number;
  affectedEquipment: string;
  calculationMethod: string;
  isConfirmed: boolean; // Stays false/estimated as per guardrails
  notes?: string;
}

export interface RehandleRecord extends BaseEntity {
  rehandleId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  source: string;
  destination: string;
  material: string;
  quantity: number;
  unit: ProductionUnit;
  volumeBCM: number;
  tonnage: number;
  equipmentCode: string;
  dispatchId?: string;
  reason: RehandleReason;
  recordedBy: string;
}

export interface ROMRecord extends BaseEntity {
  romId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  type: "ROM_IN" | "ROM_OUT" | "STOCKPILE_ADJUSTMENT";
  sourceLocation: string;
  destination: string;
  coalSeam: string;
  tonnage: number;
  stockpileName: string;
  crusherId?: string;
  calorificValueKcal?: number;
  ashPercent?: number;
  moisturePercent?: number;
  sulfurPercent?: number;
  qualityStatus: "INTEGRATION_READY" | "ASSAYED" | "VERIFIED_LAB_ASSAY";
}

export interface WasteRecord extends BaseEntity {
  wasteId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  volumeBCM: number;
  tonnage: number;
  destinationDisposal: string;
  trips: number;
  equipmentCode: string;
  isDeleted?: boolean;
}

export type ProductionWasteRecord = WasteRecord;

export interface ProductionAlertItem extends BaseEntity {
  alertId: string;
  companyId: string;
  siteId: string;
  timestamp: string;
  severity: "CRITICAL" | "HIGH" | "WARNING" | "INFO";
  title: string;
  message: string;
  category: "TARGET_GAP" | "FORECAST_SHORTFALL" | "PRODUCTION_DROP" | "QUEUE_SPIKE" | "DATA_MISSING" | "QUALITY_CHANGE";
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface ProductionReconciliationItem extends BaseEntity {
  reconciliationId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  pit: string;
  dispatchQuantityTon: number;
  weighbridgeQuantityTon: number;
  surveyVolumeBCM: number;
  reportedProductionTon: number;
  differenceTon: number;
  variancePercent: number;
  reconciliationStatus: "MATCHED" | "ACCEPTABLE_VARIANCE" | "DISCREPANCY_REQUIRES_REVIEW";
  notes?: string;
}

export interface ProductionDataQualityItem {
  recordId: string;
  field: string;
  issue: string;
  status: DataQualityStatus;
  detectedAt: string;
}

export interface CoalQualityData {
  seam: string;
  calorificValueKcal: number;
  ashPercent: number;
  sulfurPercent: number;
  moisturePercent: number;
  integrationStatus: "VERIFIED_LAB_ASSAY" | "COAL_QUALITY_INTEGRATION_READY";
}

export interface ProductionScenarioInput {
  fleetScenario: "CURRENT_FLEET" | "OPTIMIZED_FLEET" | "REDUCED_FLEET" | "ADDITIONAL_TRUCK" | "ADDITIONAL_EXCAVATOR" | "LOWER_CYCLE_TIME" | "HIGHER_UTILIZATION";
  activeExcavators: number;
  activeTrucks: number;
  targetUtilPercent: number;
  avgCycleTimeMin: number;
}

export interface CrushingRecord extends BaseEntity {
  crushingId: string;
  companyId: string;
  siteId: string;
  date: string;
  shift: ShiftIdentifier;
  crusherId: string;
  crusherName: string;
  feedMaterial: string;
  feedTonnage: number;
  crushedOutputTonnage: number;
  undersizeTonnage?: number;
  oversizeTonnage?: number;
  operatingHours: number;
  throughputRateTonPerHour: number;
  productSize: string;
  stockpileDestination: string;
  operatorName: string;
  recordedBy: string;
}

export type ProductionPeriodType = "HOURLY" | "SHIFT" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type ProductionStreamFilter = "ALL" | "COAL" | "OB" | "ROM" | "WASTE" | "REHANDLE" | "CRUSHING";
