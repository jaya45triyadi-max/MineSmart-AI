// MINE SMART AI - Geology & Geological Intelligence Center Types
// Comprehensive schema covering:
// 1. Database: Borehole, Collar, Survey, Lithology, Seam, Sample, Assay, Coal Quality
// 2. Coal Quality: GAR, GCV, TM, IM, Ash, Sulfur, VM, FC, HGI, AFT, Petrography
// 3. AI Geology: Seam Correlation, Quality Prediction, Anomaly Detection, Geological Interpretation, Data Validation, Resource Estimation Assistance

import { BaseEntity } from "./index";

export type BoreholeStatus =
  | "PLANNED"
  | "DRILLING"
  | "COMPLETED"
  | "ABANDONED"
  | "SUSPENDED"
  | "VALIDATED";

export type DrillingType =
  | "DIAMOND_CORE"
  | "REVERSE_CIRCULATION"
  | "OPEN_HOLE"
  | "AUGER"
  | "SONIC";

export type ValidationStatus = "VALID" | "WARNING" | "INVALID" | "PENDING";

export type SampleType =
  | "COAL"
  | "PARTING"
  | "ROOF"
  | "FLOOR"
  | "CHANNEL"
  | "CORE"
  | "COMPOSITE"
  | "OTHER";

export type CustodyStatus =
  | "COLLECTED"
  | "PREPARED"
  | "DISPATCHED"
  | "RECEIVED"
  | "ANALYZED"
  | "VALIDATED"
  | "ARCHIVED";

export type DatabaseVersionStatus =
  | "DRAFT"
  | "REVIEW"
  | "VALIDATED"
  | "APPROVED"
  | "ARCHIVED";

export type CoalRank =
  | "LIGNITE"
  | "SUB_BITUMINOUS_C"
  | "SUB_BITUMINOUS_B"
  | "SUB_BITUMINOUS_A"
  | "BITUMINOUS_HIGH_VOLATILE"
  | "BITUMINOUS_MEDIUM_VOLATILE"
  | "ANTHRACITE";

// ==========================================
// 1. DATABASE ENTITIES
// ==========================================

// 1.1 Borehole
export interface Borehole extends BaseEntity {
  boreholeCode: string;
  pitId: string;
  pitName: string;
  projectId: string;
  status: BoreholeStatus;
  drillingType: DrillingType;
  plannedDepth: number;
  actualDepth: number;
  startDate: string;
  completionDate?: string;
  contractor: string;
  drillingRig: string;
  drillerName?: string;
  coreDiameterMm?: number;
  overallRecoveryPercent?: number;
  waterTableDepthM?: number;
  remarks?: string;
  validationStatus: ValidationStatus;
  seamCount?: number;
  sampleCount?: number;
}

// 1.2 Collar
export interface Collar extends BaseEntity {
  boreholeId: string;
  boreholeCode: string;
  latitude: number;
  longitude: number;
  easting: number;
  northing: number;
  elevation: number;
  demLiDARElevation?: number;
  elevationDelta?: number; // elevation - demLiDARElevation
  azimuth: number; // 0 - 360 deg
  dip: number; // -90 to +90 deg (typically -90 for vertical)
  totalDepth: number;
  coordinateSystem: {
    epsg: string; // e.g. "EPSG:32750" (UTM Zone 50S)
    datum: string; // "WGS84"
    zone: string; // "Zone 50S"
    hemisphere: "NORTH" | "SOUTH";
  };
  surveyMethod: "RTK_GPS" | "TOTAL_STATION" | "HANDHELD_GPS" | "DRONE_LIDAR";
  surveyDate: string;
  accuracyMeters: number;
  surveyorName?: string;
  validationStatus: ValidationStatus;
  validationMessages?: string[];
}

// 1.3 Downhole Survey (Deviation)
export interface DownholeSurveyRecord extends BaseEntity {
  boreholeId: string;
  boreholeCode: string;
  measuredDepthM: number;
  inclinationDipDeg: number; // -90 for vertical, deviations e.g. -88.5
  azimuthDeg: number; // 0-360
  trueVerticalDepthM: number;
  deltaEastingM: number;
  deltaNorthingM: number;
  doglegSeverityDegPer30M: number;
  surveyTool: "GYRO_SURVEY" | "MAGNETIC_MULTI_SHOT" | "ACOUSTIC_TELEVIEWER";
  surveyor: string;
  validationStatus: ValidationStatus;
}

// 1.4 Lithology
export interface LithologyCatalogItem extends BaseEntity {
  code: string;
  name: string;
  category: "COAL" | "SEDIMENTARY" | "WEATHERED" | "HARD_ROCK" | "OTHER";
  colorHex: string;
  patternStyle: string; // CSS pattern style descriptor
  description?: string;
}

export interface LithologyRecord extends BaseEntity {
  boreholeId: string;
  boreholeCode: string;
  fromDepth: number;
  toDepth: number;
  thickness: number; // toDepth - fromDepth
  lithologyCode: string;
  lithologyName: string;
  description: string;
  weatheringGrade: "UNWEATHERED" | "SLIGHTLY" | "MODERATELY" | "HIGHLY" | "COMPLETE";
  color: string;
  grainSize: string;
  hardness: "VERY_SOFT" | "SOFT" | "MEDIUM_HARD" | "HARD" | "VERY_HARD";
  coreRecoveryPercent?: number;
  rqdPercent?: number; // Rock Quality Designation
  remarks?: string;
  validationStatus: ValidationStatus;
}

// 1.5 Seam Master & Intersections
export interface SeamMaster extends BaseEntity {
  seamCode: string;
  seamName: string;
  targetPitId: string;
  averageThicknessMeters: number;
  dipAngleDeg: number;
  dipDirectionDeg: number;
  coalRank: CoalRank;
  qualityGrade: "PREMIUM_EXPORT" | "HIGH_CV" | "MEDIUM_CV" | "LOW_CV";
  colorBadge: string;
  parentSeamCode?: string;
  isSplit?: boolean;
}

export interface SeamIntersection extends BaseEntity {
  boreholeId: string;
  boreholeCode: string;
  seamId: string;
  seamCode: string;
  seamName: string;
  fromDepth: number;
  toDepth: number;
  apparentThickness: number;
  trueThickness: number;
  elevation: number;
  roofElevation: number;
  floorElevation: number;
  partingThicknessM?: number;
  coalRecoveryPercent?: number;
  qualityStatus: "TESTED" | "PENDING_LAB" | "NO_SAMPLE";
  validationStatus: ValidationStatus;
  correlationConfidenceScore?: number; // 0 - 100%
}

// 1.6 Sample Record
export interface SampleRecord extends BaseEntity {
  sampleCode: string;
  boreholeId: string;
  boreholeCode: string;
  seamId?: string;
  seamCode?: string;
  fromDepth: number;
  toDepth: number;
  sampleThicknessM?: number;
  sampleType: SampleType;
  sampleDate: string;
  weightKg: number;
  laboratory: string;
  custodyStatus: CustodyStatus;
  chainOfCustodyLogs: {
    timestamp: string;
    status: CustodyStatus;
    handlerName: string;
    location: string;
    notes?: string;
  }[];
  validationStatus: ValidationStatus;
}

// 1.7 Assay Record
export interface AssayRecord extends BaseEntity {
  sampleId: string;
  sampleCode: string;
  boreholeCode: string;
  laboratory: string;
  testType: string; // "Proximate Analysis", "Ultimate Analysis", "Total Sulfur", "Calorific Value", "AFT", "HGI"
  analysisDate: string;
  parameterName: string; // e.g. "Total Moisture", "Ash Content", "Gross Calorific Value"
  parameterCode?: "TM" | "IM" | "ASH" | "TS" | "VM" | "FC" | "GCV" | "GAR" | "HGI" | "AFT";
  resultValue: number;
  unit: string; // "%", "kcal/kg", "MJ/kg", "degC"
  methodStandard: "ASTM" | "ISO" | "GB" | "BS" | "AS";
  detectionLimit: number;
  qualityFlag: "PASS" | "OUTLIER" | "RETEST_REQUIRED";
  certificateRef: string;
  validationStatus: ValidationStatus;
}

// ==========================================
// 2. COAL QUALITY COMPREHENSIVE PROFILE
// ==========================================
export interface CoalQualityProfile extends BaseEntity {
  sampleId: string;
  sampleCode: string;
  boreholeCode: string;
  seamCode: string;
  fromDepthM?: number;
  toDepthM?: number;
  thicknessM?: number;

  // 1. Calorific Values
  garKcalKg: number; // GAR (Gross As Received) kcal/kg
  gcvAdbKcalKg: number; // GCV / CV adb kcal/kg
  calorificValueAdbKcal?: number; // Alias for backward compatibility
  cvDafKcalKg?: number; // CV daf kcal/kg
  cvArKcalKg?: number; // CV ar kcal/kg
  cvDbKcalKg?: number; // CV db kcal/kg
  netCalorificValueNarKcalKg?: number; // NAR kcal/kg

  // 2. Moisture Parameters
  totalMoistureAr: number; // TM % ar (Total Moisture)
  inherentMoistureAdb: number; // IM % adb (Inherent Moisture / Moisture in air-dry sample)
  surfaceMoistureAr?: number; // Surface Moisture % ar

  // 3. Proximate Analysis Parameters
  ashContentAdb: number; // Ash % adb (Ash Content)
  ashContentAr?: number; // Ash % ar
  ashContentDb?: number; // Ash % db
  volatileMatterAdb: number; // VM % adb (Volatile Matter)
  volatileMatterDaf?: number; // VM % daf
  fixedCarbonAdb: number; // FC % adb (Fixed Carbon by difference)
  fixedCarbonDaf?: number; // FC % daf

  // 4. Sulfur
  totalSulfurAdb: number; // Total Sulfur % adb
  totalSulfurAr?: number; // Total Sulfur % ar
  pyriticSulfurAdb?: number;
  sulfateSulfurAdb?: number;
  organicSulfurAdb?: number;

  // 5. Ultimate Analysis (Dry Ash Free Basis / ADB)
  carbonDafPercent?: number; // C %
  hydrogenDafPercent?: number; // H %
  nitrogenDafPercent?: number; // N %
  oxygenDafPercent?: number; // O % (by difference)

  // 6. Physical & Thermal Properties
  hardgroveGrindabilityIndex?: number; // HGI
  relativeDensity?: number; // RD / in-situ density
  crucibleSwellingNumberCSN?: number;
  ashFusionTemperatureAFT?: {
    deformationTempC: number; // IT / DT
    sphericalTempC: number; // ST
    hemisphericalTempC: number; // HT
    fluidTempC: number; // FT
    atmosphere: "REDUCING" | "OXIDIZING";
  };

  // 7. Quality Metadata & Classification
  coalRank?: CoalRank;
  complianceGrade?: "PREMIUM_EXPORT" | "HIGH_CV" | "MEDIUM_CV" | "LOW_CV" | "STANDARD_EXPORT" | "DOMESTIC_PLN" | "LOW_GRADE_OFF_SPEC";
  proximateClosureSum?: number; // IM + Ash + VM + FC (must equal ~100%)
  validationStatus: ValidationStatus;
  isOutlier?: boolean;
  outlierReason?: string;
}

// 1.8 Core Photo Asset
export interface CorePhotoRecord extends BaseEntity {
  boreholeId: string;
  boreholeCode: string;
  fromDepth: number;
  toDepth: number;
  boxNumber: number;
  capturedAt: string;
  capturedBy: string;
  imageUrl: string;
  caption: string;
}

// 1.9 Geological Database Version Master
export interface GeologicalDatabaseVersion extends BaseEntity {
  versionNumber: string; // e.g. "v1.0-APPROVED", "v2.0-DRAFT"
  title: string;
  description: string;
  totalBoreholesCount: number;
  totalSamplesCount: number;
  status: DatabaseVersionStatus;
  approvedBy?: string;
  approvedAt?: string;
}

// 1.10 QC Issue Warning Item
export interface GeologicalQCIssue {
  id: string;
  entityType: "BOREHOLE" | "COLLAR" | "SURVEY" | "LITHOLOGY" | "SEAM" | "SAMPLE" | "ASSAY" | "QUALITY";
  entityCode: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  ruleName: string; // e.g. "DEPTH_OVERLAP", "OUTLIER_CV", "MISSING_COORDINATES", "PROXIMATE_SUM_MISMATCH"
  description: string;
  suggestedAction: string;
  isResolved: boolean;
}

// 1.11 Cross Section Line Profile
export interface GeologicalCrossSectionProfile {
  sectionId: string;
  name: string;
  pitId: string;
  boreholeCodesInOrder: string[];
  totalDistanceMeters: number;
  verticalScaleRatio: number;
}

// ==========================================
// 3. AI GEOLOGY INTELLIGENCE TYPES
// ==========================================

// 3.1 AI Seam Correlation
export interface AIGeologySeamCorrelation {
  correlationId: string;
  boreholePair: [string, string];
  sourceSeamCode: string;
  targetSeamCode: string;
  correlationConfidence: number; // 0 - 100%
  structuralDipCalculatedDeg: number;
  throwDistanceMeters: number;
  isSplitDetected: boolean;
  splitDetails?: string;
  isPinchoutDetected: boolean;
  pinchoutDetails?: string;
  aiExplanation: string;
  suggestedAction: "CONFIRMED_CONTINUITY" | "SPLIT_MAPPING_REQUIRED" | "FAULT_DISPLACEMENT_DETECTED" | "PINCHOUT_ZONE";
}

// 3.2 AI Quality Prediction
export interface AIGeologyQualityPrediction {
  blockId: string;
  targetEasting: number;
  targetNorthing: number;
  targetElevationRL: number;
  seamCode: string;
  predictedGAR: number;
  predictedGCVAdb: number;
  predictedAsh: number;
  predictedSulfur: number;
  predictedTM: number;
  confidenceScorePercent: number;
  krigingVariance: number;
  nearestSampleDistanceMeters: number;
  contributingBoreholes: string[];
  spatialTrendDescription: string;
}

// 3.3 AI Anomaly Detection
export interface AIGeologyAnomaly {
  anomalyId: string;
  type:
    | "STRUCTURAL_FAULT_THROW"
    | "ABNORMAL_THICKNESS_PINCH"
    | "WASHOUT_PALEOCHANNEL"
    | "PYRITIC_SULFUR_SPIKE"
    | "METAMORPHIC_BURNT_COAL"
    | "COLLAR_ELEVATION_MISMATCH"
    | "ASSAY_PROXIMATE_IMBALANCE";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  boreholeCode: string;
  seamCode?: string;
  depthInterval?: string;
  detectedDeviation: string;
  statisticalZScore: number;
  rootCauseAnalysis: string;
  mitigationRecommendation: string;
  status: "OPEN" | "REVIEWED" | "RESOLVED";
}

// 3.4 AI Geological Interpretation
export interface AIGeologyInterpretation {
  siteName: string;
  depositionalEnvironment: {
    primaryModel: string; // e.g. "Lower Delta Plain with Interdistributary Peat Mire"
    faciesAssociations: string[];
    paleocurrentDirection: string;
    paleochannelRisk: string;
  };
  structuralFramework: {
    regionalStructure: string; // e.g. "Sangatta Asymmetric Anticline (NNE-SSW Axis)"
    averageStrike: string; // "N 025° E"
    averageDip: string; // "12° - 16° ESE"
    majorFaultSystems: string[];
    foldingIntensity: "MILD" | "MODERATE" | "COMPLEX";
  };
  geologicalSynthesisText: string;
  drillingRecommendations: string[];
}

// 3.5 AI Data Validation (Automated QA/QC)
export interface AIGeologyDataValidation {
  totalRecordsChecked: number;
  passedValidationCount: number;
  warningCount: number;
  criticalErrorCount: number;
  overallIntegrityScorePercent: number;
  checksRun: {
    checkName: string;
    category: "COLLAR_DEM" | "DEPTH_CONTINUITY" | "PROXIMATE_CLOSURE" | "ASSAY_RANGE" | "CORE_RECOVERY" | "SEAM_ORDER";
    passed: boolean;
    issuesFound: number;
    description: string;
  }[];
  autoFixableCount: number;
}

// 3.6 AI Resource Estimation Assistance (JORC / KCMI 2017)
export interface AIGeologyResourceEstimation {
  seamCode: string;
  seamName: string;
  polygonAreaM2: number;
  averageTrueThicknessM: number;
  averageRelativeDensity: number;
  geologicalLossPercent: number; // e.g. 5% - 10%
  inSituMoisturePercent: number;
  inSituTonnageMt: number;
  classificationBreakdown: {
    measuredMt: number; // Radius <= 250m
    indicatedMt: number; // Radius 250m - 500m
    inferredMt: number; // Radius 500m - 1000m
    totalResourceMt: number;
  };
  averageQuality: {
    garKcalKg: number;
    gcvAdbKcalKg: number;
    tmArPercent: number;
    ashAdbPercent: number;
    tsAdbPercent: number;
    vmAdbPercent: number;
    fcAdbPercent: number;
  };
  competentPersonStatement: string;
  complianceStandard: "JORC_2012" | "KCMI_2017";
}
