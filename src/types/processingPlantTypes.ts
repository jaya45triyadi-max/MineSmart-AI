import { BaseEntity } from "./index";

export type PlantStatus = "ONLINE" | "OFFLINE" | "MAINTENANCE" | "STANDBY" | "PARTIAL_OPERATION";

export type CrusherType =
  | "Primary Crusher"
  | "Secondary Crusher"
  | "Tertiary Crusher"
  | "Sizer"
  | "Roll Crusher"
  | "Jaw Crusher"
  | "Cone Crusher"
  | "Impact Crusher";

export type CrusherStatus = "RUNNING" | "STOPPED" | "IDLE" | "MAINTENANCE" | "BREAKDOWN" | "STANDBY";

export type ROMFeedSource = "Pit" | "ROM Stockpile" | "Direct Hauling" | "Rehandle" | "Other Source";

export type ProcessingDowntimeCategory =
  | "Planned Downtime"
  | "Unplanned Downtime"
  | "Breakdown"
  | "Maintenance"
  | "Power Failure"
  | "Material Blockage"
  | "Equipment Failure"
  | "Operational Delay"
  | "Feed Shortage"
  | "Other";

export type ProductType =
  | "Raw Coal"
  | "Crushed Coal"
  | "Washed Coal"
  | "Clean Coal"
  | "Sized Coal"
  | "Product Coal"
  | "Reject"
  | "Waste"
  | "Other Product";

export type QualityParameter =
  | "CV"
  | "Total Moisture"
  | "Inherent Moisture"
  | "Ash"
  | "Sulfur"
  | "Volatile Matter"
  | "HGI"
  | "Size Distribution";

export type QualityStatus = "PASS" | "WARNING" | "OUT_OF_SPEC" | "PENDING" | "NOT_AVAILABLE";

export interface ProcessingPlant extends BaseEntity {
  plantId: string;
  plantName: string;
  plantCode: string;
  plantType: string;
  capacity: number;
  capacityUnit: string;
  location: string;
  operatingStatus: PlantStatus;
  description: string;
  commissionDate: string;
  designCapacity: number;
  currentThroughput: number;
  availability: number;
  utilization: number;
  operatingHours: number;
  currentFeed: number;
  currentOutput: number;
}

export interface ROMFeed extends BaseEntity {
  feedId: string;
  plantId: string;
  sourceLocation: ROMFeedSource | string;
  stockpileId: string;
  stockpileName: string;
  materialType: string;
  quantity: number;
  unit: string;
  feedRate: number;
  quality: string;
  shift: string;
  date: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  equipmentId: string;
  equipmentCode: string;
  status: string;
}

export interface Crusher extends BaseEntity {
  crusherId: string;
  plantId: string;
  crusherCode: string;
  crusherName: string;
  crusherType: CrusherType;
  manufacturer: string;
  model: string;
  designCapacity: number;
  capacityUnit: string;
  installationDate: string;
  status: CrusherStatus;
  statusCategory?: string;
  engineHour: number;
  operatingHour: number;
  location: string;
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  currentThroughput: number;
  availability: number;
  utilization: number;
  efficiency: number;
}

export interface ProcessingDowntime extends BaseEntity {
  downtimeId: string;
  plantId: string;
  equipmentId: string;
  equipmentName: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  category: ProcessingDowntimeCategory;
  reason: string;
  subReason: string;
  planned: boolean;
  impact: string;
  shift: string;
  operatorId: string;
  maintenanceId: string;
  workOrderId: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
}

export interface ProcessingOutput extends BaseEntity {
  outputId: string;
  plantId: string;
  date: string;
  shift: string;
  productType: ProductType;
  quantity: number;
  unit: string;
  source: string;
  destination: string;
  quality: string;
  stockpileId: string;
  status: string;
}

export interface ProcessingQualitySample extends BaseEntity {
  sampleId: string;
  plantId: string;
  stockpileId: string;
  stockpileName: string;
  productId: string;
  productName: string;
  sampleDate: string;
  sampleTime: string;
  shift: string;
  sampleType: string;
  laboratory: string;
  parameter: QualityParameter;
  value: number;
  unit: string;
  minSpec: number;
  maxSpec: number;
  target: number;
  status: QualityStatus;
  source: string;
}

export interface ProcessingTarget extends BaseEntity {
  targetId: string;
  plantId: string;
  period: "Daily" | "Shift" | "Weekly" | "Monthly";
  targetType: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  variance: number;
  achievementPercent: number;
  status: "ON TARGET" | "WARNING" | "BELOW TARGET";
}

export interface ProcessingAlert extends BaseEntity {
  alertId: string;
  plantId: string;
  plantName: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  status: "Detected" | "Acknowledged" | "Assigned" | "Investigating" | "Action Taken" | "Resolved" | "Closed";
  assignedTo: string;
  timestamp: string;
}

export interface PlantMaterialBalance extends BaseEntity {
  balanceId: string;
  plantId: string;
  date: string;
  shift: string;
  romFeedQty: number;
  processedQty: number;
  productQty: number;
  rejectQty: number;
  wasteQty: number;
  differenceQty: number;
  variancePercent: number;
  status: "BALANCED" | "REVIEW_REQUIRED" | "ALERT";
}

export interface PlantBottleneck extends Partial<BaseEntity> {
  plantId: string;
  equipmentOrSection: string;
  capacityTph: number;
  currentLoadTph: number;
  bottleneckProbability: number;
  evidence: string;
  impact: string;
  recommendation: string;
  confidence: string;
}

export interface PlantEfficiency extends Partial<BaseEntity> {
  plantId: string;
  score: number;
  availabilityScore: number;
  utilizationScore: number;
  throughputScore: number;
  qualityScore: number;
  yieldScore: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface SizeFractionItem {
  meshSizeMM: number;
  fractionLabel: string;
  passingPercent: number;
  retainedPercent: number;
  specMinPercent: number;
  specMaxPercent: number;
  status: "NORMAL" | "HIGH" | "LOW";
}

export interface ProductSizeDistribution {
  id: string;
  plantId: string;
  sampleTime: string;
  samplePoint: "CRUSHER_DISCHARGE" | "SCREEN_UNDERSIZE" | "PRODUCT_CONVEYOR" | "STOCKPILE_DISCHARGE";
  nominalTopSizeMM: number; // e.g. 50 mm
  actualTopSizeMM: number; // e.g. 48.5 mm
  closedSideSettingCSS: number; // e.g. 45 mm
  lumpPercent50to100mm: number; // e.g. 12%
  nutPercent25to50mm: number; // e.g. 42%
  finesPercent0to25mm: number; // e.g. 46%
  ultraFinesBelow2mmPercent: number; // e.g. 8.2%
  oversizeRecirculationRateTph: number; // e.g. 85 t/h
  screeningEfficiencyPercent: number; // e.g. 91.5%
  sizeComplianceStatus: "COMPLIANT" | "BORDERLINE" | "OUT_OF_SPEC";
  sieveFractions: SizeFractionItem[];
  operatorNotes: string;
}

export interface PipelineCircuitTelemetry {
  // Stage 1: ROM
  romPadStockTons: number;
  romPadCapacityTons: number;
  romHopperLevelPercent: number;
  activeHaulerTipping: string[];
  romLiveFeedRateTph: number;
  romMoisturePercent: number;
  romAshPercent: number;
  apronFeederSpeedHz: number;
  grizzlyScreenBypassTph: number;

  // Stage 2: Crusher
  primaryCrusherStatus: CrusherStatus;
  primaryCrusherThroughputTph: number;
  primaryCrusherMotorKw: number;
  primaryCrusherCssMM: number;
  secondaryCrusherStatus: CrusherStatus;
  secondaryCrusherThroughputTph: number;
  secondaryCrusherMotorKw: number;
  vibratingScreenEfficiency: number;
  screenOversizeRecircTph: number;
  circuitLiveThroughputTph: number;

  // Stage 3: Stockpile
  stackerConveyorSpeedMps: number;
  stockpileTotalTons: number;
  stockpileCapacityTons: number;
  stockpileCapacityPercent: number;
  stockpileGradeCV: number;
  stockpileMoisturePercent: number;
  reclaimerRateTph: number;

  // Stage 4: Shipment
  shipmentType: "BARGE_LOADING" | "TRAIN_LOADOUT" | "OVERLAND_CONVEYOR";
  shipmentLiveRateTph: number;
  todayLoadedTonnage: number;
  targetDailyTonnage: number;
  bargeName: string;
  bargeCapacityTons: number;
  bargeLoadedPercent: number;
  demurrageRisk: "NONE" | "LOW" | "HIGH";
}

export interface PlantReport extends BaseEntity {
  reportId: string;
  reportCode: string;
  title: string;
  type: string;
  period: string;
  generatedAt: string;
  format: "PDF" | "EXCEL" | "CSV";
  status: string;
}
