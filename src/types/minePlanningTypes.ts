// MINE SMART AI - Mine Planning & Strategic Optimization Types
// Covering: Geological Model, Pit Planning, Scheduling, and AI Scenario Analysis

import { BaseEntity } from "./index";

export type PlanStatus =
  | "Draft"
  | "Review"
  | "Approved"
  | "Active"
  | "Archived"
  | "Cancelled";

export type PlanType = "LOM" | "LTP" | "MTP" | "STP" | "WEEKLY" | "DAILY";

export type PitDesignStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "SUPERSEDED";

// ==========================================
// 1. GEOLOGICAL MODEL TYPES
// ==========================================
export interface GeologicalSeam extends BaseEntity {
  seamId: string;
  name: string;
  code: string;
  strike: string;
  dipAngleDeg: number;
  dipDirection: string;
  averageThicknessM: number;
  trueThicknessM: number;
  apparentThicknessM: number;
  partingThicknessM: number;
  roofElevationRL: number;
  floorElevationRL: number;
  interburdenThicknessM: number;
  inSituDensity: number;
  coalRecoveryPercent: number;
  geologicalLossPercent: number;
  quality: {
    garKcal: number;
    narKcal: number;
    totalMoisturePercent: number;
    inherentMoisturePercent: number;
    ashContentPercent: number;
    volatileMatterPercent: number;
    fixedCarbonPercent: number;
    totalSulfurPercent: number;
    hgi: number;
    aftFluidDegC: number;
  };
  totalReserveMt: number;
  confidenceCategory: "MEASURED" | "INDICATED" | "INFERRED";
}

export interface GeologicalBlockModel {
  blockId: string;
  coordX: number;
  coordY: number;
  coordZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  materialType: "OVERBURDEN_SANDSTONE" | "INTERBURDEN_SHALE" | "COAL" | "FLOOR_CLAY" | "TOP_SOIL";
  seamCode?: string;
  densityTonnePerM3: number;
  tonnageMt: number;
  volumeM3: number;
  garKcal?: number;
  ashPercent?: number;
  sulfurPercent?: number;
  confidence: "MEASURED" | "INDICATED" | "INFERRED";
  benchCode: string;
}

export interface BoreholeInterval {
  fromDepthM: number;
  toDepthM: number;
  thicknessM: number;
  lithologyCode: string;
  lithologyName: string;
  colorHex: string;
  seamCode?: string;
  coreRecoveryPercent: number;
  description: string;
  garKcal?: number;
}

export interface GeologicalBorehole extends BaseEntity {
  boreholeId: string;
  code: string;
  collarEasting: number;
  collarNorthing: number;
  collarElevationRL: number;
  totalDepthM: number;
  drilledDate: string;
  drillingMethod: "HQ_WIRELINE_CORE" | "OPEN_HOLE_TOUCH_CORE" | "GEOTECH_CORE";
  overallCoreRecoveryPercent: number;
  seamsIntercepted: string[];
  intervals: BoreholeInterval[];
  status: "COMPLETED" | "VALIDATED" | "LOGGED";
}

export interface LithologyUnit {
  code: string;
  name: string;
  category: "OVERBURDEN" | "INTERBURDEN" | "COAL" | "BASEMENT" | "SURFICIAL";
  density: number;
  ucsMpa: number;
  diggabilityIndex: "EASY_FREE_DIG" | "MEDIUM_RIPPING" | "HARD_BLASTING_REQUIRED";
  colorHex: string;
  description: string;
}

// ==========================================
// 2. PIT PLANNING TYPES
// ==========================================
export interface PitDesign extends BaseEntity {
  pitId: string;
  name: string;
  code: string;
  version: string;
  elevationMin: number;
  elevationMax: number;
  depthMeters: number;
  areaHectares: number;
  totalVolumeM3: number;
  coalVolumeM3: number;
  wasteVolumeM3: number;
  stripRatio: number;
  designStatus: PitDesignStatus;
  overallSlopeAngleDeg?: number;
  batterAngleDeg?: number;
  bermWidthMeters?: number;
  benchHeightMeters?: number;
  rampWidthMeters?: number;
  rampGradePercent?: number;
  factorOfSafetyFK?: number;
  geometry: {
    boundaryCoordinates: { lat: number; lng: number }[];
    centerCoordinate: { lat: number; lng: number };
  };
}

export interface Bench extends BaseEntity {
  benchId: string;
  pitId: string;
  benchCode: string;
  elevation: number;
  crestElevation: number;
  toeElevation: number;
  heightMeters: number;
  widthMeters: number;
  flitchHeightMeters?: number;
  slopeAngleDeg: number;
  bermWidthMeters: number;
  catchBermCapacityM3?: number;
  materialType: "OVERBURDEN" | "INTERBURDEN" | "COAL_SEAM" | "HARD_ROCK";
  status: "PLANNED" | "ACTIVE_EXCAVATION" | "COMPLETED" | "SAFETY_RESTRICTED";
  geometry?: { lat: number; lng: number }[];
  coalReserveMt?: number;
  wasteVolumeMbc?: number;
}

export interface Ramp extends BaseEntity {
  rampId: string;
  name: string;
  pitId: string;
  lengthMeters: number;
  widthMeters: number;
  gradePercent: number;
  elevationStart: number;
  elevationEnd: number;
  direction: "INCLINE_NORTH" | "INCLINE_SOUTH" | "INCLINE_EAST" | "INCLINE_WEST";
  turningRadiusMeters: number;
  safetyBermHeightMeters: number;
  lanes?: "DUAL_LANE" | "SINGLE_LANE";
  status: "DESIGNED" | "UNDER_CONSTRUCTION" | "OPERATIONAL" | "CLOSED";
  geometry?: { lat: number; lng: number }[];
}

export interface Pushback extends BaseEntity {
  pushbackId: string;
  name: string;
  code?: string;
  pitId: string;
  sequenceOrder: number;
  coalReserveMt: number;
  wasteVolumeMbc: number;
  totalMovementMbc: number;
  stripRatio: number;
  startPeriod: string;
  endPeriod: string;
  targetBenchRange?: string;
  status: "PLANNED" | "CURRENT_MINING" | "COMPLETED";
  geometry?: { lat: number; lng: number }[];
}

export interface MiningSequence extends BaseEntity {
  sequenceId: string;
  pitId: string;
  pushbackId: string;
  benchCode: string;
  blockId: string;
  materialType?: "OVERBURDEN" | "COAL_SEAM" | "INTERBURDEN";
  volumeMbcOrMt?: number;
  period: string;
  priorityOrder: number;
  assignedFleet?: string;
  haulDestination?: string;
  predecessorSequenceIds: string[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
}

export interface PlanningConstraint extends BaseEntity {
  constraintId: string;
  type:
    | "Geological"
    | "Geotechnical"
    | "Equipment"
    | "Hauling"
    | "Road"
    | "Stockpile"
    | "ROM"
    | "HSE"
    | "Weather"
    | "Environmental"
    | "Permit"
    | "Budget";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  affectedArea: string;
  startDate: string;
  endDate: string;
  status: "Open" | "Monitoring" | "Resolved" | "Closed";
}

// ==========================================
// 3. SCHEDULING TYPES
// ==========================================
export interface MinePlan extends BaseEntity {
  planId: string;
  planVersion: string;
  planType: PlanType;
  title: string;
  companyId: string;
  siteId: string;
  pitId: string;
  pitName: string;
  periodLabel: string;
  coalTargetMt: number;
  wasteTargetMbc: number;
  totalMovementMbc: number;
  targetStripRatio: number;
  status: PlanStatus;
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
}

export interface LOMYearBreakdown {
  year: number;
  coalTargetMt: number;
  wasteTargetMbc: number;
  stripRatio: number;
  remainingReserveMt: number;
  averageHaulKm?: number;
  unitMiningCostUSD?: number;
  revenueEstMUSD: number;
  capexEstMUSD?: number;
}

export interface LOMPlan extends BaseEntity {
  lomId: string;
  title: string;
  initialReserveMt: number;
  plannedYears: number;
  overallStripRatio: number;
  yearlyData: LOMYearBreakdown[];
  scenarioName: "Base Case" | "High Production" | "Low Production" | "High Price" | "Low Price";
}

export interface LTPPlan extends BaseEntity {
  ltpId: string;
  title: string;
  horizonYears: number;
  yearlyBreakdown: {
    yearLabel: string;
    coalMt: number;
    wasteMbc: number;
    stripRatio: number;
    fleetRequiredUnits: number;
    estimatedCostIdrM: number;
    rkabTargetStatus?: "COMPLIANT" | "OPTIMIZED";
  }[];
}

export interface MTPPlan extends BaseEntity {
  mtpId: string;
  title: string;
  year: number;
  monthlyBreakdown: {
    monthName: string;
    coalTargetMt: number;
    wasteTargetMbc: number;
    stripRatio: number;
    averageGar?: number;
    fleetCapacityUnits: number;
    stockpileCapacityKt: number;
    romCapacityKt: number;
  }[];
}

export interface STPPlan extends BaseEntity {
  stpId: string;
  title: string;
  periodLabel: string;
  weeklyBreakdown: {
    weekNumber: number;
    dateRangeLabel: string;
    coalTargetMt: number;
    wasteTargetMbc: number;
    equipmentAssigned: number;
    benchFocus?: string;
  }[];
}

export interface WeeklyPlanDayAllocation {
  dayName: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  dateStr: string;
  coalTargetMt: number;
  wasteTargetMbc: number;
  equipmentAssigned: string;
  haulRoute?: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
}

export interface WeeklyPlan extends BaseEntity {
  weekId: string;
  weekNumber: number;
  dateRange: string;
  pitId: string;
  pushbackId: string;
  benchCode: string;
  coalTargetMt: number;
  wasteTargetMbc: number;
  movementTargetMbc: number;
  equipmentTargetUnits: number;
  dailyAllocations: WeeklyPlanDayAllocation[];
  status: PlanStatus;
}

export interface DailyPlan extends BaseEntity {
  dailyId: string;
  date: string;
  shift: "SHIFT_1_DAY" | "SHIFT_2_NIGHT" | "SHIFT_3_SWING";
  pitId: string;
  pitName: string;
  pushbackId: string;
  benchCode: string;
  activityType: "OB_REMOVAL" | "COAL_GETTING" | "RAMP_MAINTENANCE" | "BLASTING" | "RECLAMATION";
  coalTargetMt: number;
  wasteTargetMbc: number;
  assignedEquipment: string[];
  haulingRoute: string;
  haulDistanceKm?: number;
  actualCoalMt?: number;
  actualWasteMbc?: number;
  status: "SCHEDULED" | "EXECUTING" | "COMPLETED" | "DELAYED";
}

// ==========================================
// 4. AI MINE PLANNING & SCENARIO TYPES
// ==========================================
export interface MiningScenarioMetric {
  coalProductionMt: number;
  obRemovalMbc: number;
  cleanCoalMt: number;
  averageGarKcal: number;
  strippingCostPerBcmUSD: number;
  coalMiningCostPerTonUSD: number;
  haulingCostPerTonUSD: number;
  totalOpexUSD: number;
  revenueEstUSD: number;
  profitMarginPerTonUSD: number;
  npvUSDMillion: number;
  actualStripRatio: number;
  economicBreakEvenSR: number;
  averageHaulDistanceKm: number;
  cycleTimeMinutes: number;
  fuelBurnRatioLPerBcm: number;
  totalFuelLitersPerDay: number;
  fleetExcavatorCount: number;
  fleetDumpTruckCount: number;
  equipmentUtilizationPercent: number;
  carbonEmissionTonPerMonth: number;
}

export interface MiningScenario extends BaseEntity {
  scenarioId: string;
  scenarioCode: "SCENARIO_A" | "SCENARIO_B" | "SCENARIO_C" | "BASELINE";
  name: string;
  subtitle: string;
  description: string;
  strategyFocus: "HIGH_VOLUME_AGGRESSIVE" | "BALANCED_OPTIMIZATION" | "LOW_COST_HIGH_MARGIN" | "BASELINE_BUDGET";
  metrics: MiningScenarioMetric;
  pros: string[];
  cons: string[];
  riskRating: "LOW" | "MODERATE" | "HIGH";
  aiScore: number;
  isRecommendedByAI: boolean;
  status: "DRAFT" | "EVALUATED" | "RECOMMENDED" | "APPROVED_FOR_EXECUTION" | "ARCHIVED";

  // Backward compatibility fields for legacy services
  basePlanId?: string;
  targetMultiplier?: number;
  fuelPriceImpactPercent?: number;
  fleetAvailabilityPercent?: number;
  results?: {
    coalMt: number;
    wasteMbc: number;
    stripRatio: number;
    totalCostIdrBillion: number;
    npvEstIdrBillion: number;
  };
}

export interface AIScenarioRecommendation {
  recommendedScenarioCode: string;
  recommendedScenarioName: string;
  confidenceScorePercent: number;
  executiveSummary: string;
  financialAdvantage: string;
  operationalAdvantage: string;
  tradeOffSummary: string;
  actionableRoadmap: string[];
  sensitivityAnalysis: {
    fuelPricePlus20PercentImpact: string;
    coalPriceDrop15PercentImpact: string;
    rainySeasonDisruptionImpact: string;
  };
}

export interface PlanMilestone extends BaseEntity {
  milestoneId: string;
  title: string;
  targetDate: string;
  category: "PIT_EXCAVATION" | "RAMP_COMPLETION" | "PUSHBACK_STAGE" | "COAL_TARGET" | "RECLAMATION";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
}

export interface PlanChangeLog extends BaseEntity {
  logId: string;
  planId: string;
  userId: string;
  userName: string;
  role: string;
  timestamp: string;
  action: string;
  oldValue: string;
  newValue: string;
  reason: string;
  approvalStatus: string;
}

export interface PlanVsActualPerformance {
  periodLabel: string;
  coalPlanMt: number;
  coalActualMt: number;
  wastePlanMbc: number;
  wasteActualMbc: number;
  movementPlanMbc: number;
  movementActualMbc: number;
  srPlan: number;
  srActual: number;
  status: "Above Plan" | "On Plan" | "Below Plan" | "Critical";
  variancePercent: number;
}
