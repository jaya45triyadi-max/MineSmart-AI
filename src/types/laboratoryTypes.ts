// MINE SMART AI - Laboratory & Coal Quality Management Types

import { BaseEntity } from "./index";

export type LabSampleType =
  | "ROM"
  | "STOCKPILE"
  | "PRODUCT"
  | "BLENDING"
  | "PRODUCTION"
  | "PROCESSING"
  | "SHIPMENT"
  | "EXPLORATION"
  | "BOREHOLE"
  | "CHECK_SAMPLE"
  | "RETEST"
  | "OTHER";

export type SampleType = LabSampleType;

export type SampleStatus =
  | "DRAFT"
  | "COLLECTED"
  | "RECEIVED"
  | "IN_TESTING"
  | "COMPLETED"
  | "REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type SamplePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type QualityBasis = "ARB" | "ADB" | "DB" | "DAF" | "DMMF";

export type TestType =
  | "PROXIMATE"
  | "ULTIMATE"
  | "CALORIFIC_VALUE"
  | "TOTAL_MOISTURE"
  | "INHERENT_MOISTURE"
  | "ASH_CONTENT"
  | "VOLATILE_MATTER"
  | "FIXED_CARBON"
  | "TOTAL_SULFUR"
  | "HGI"
  | "ASH_FUSION"
  | "SIZE_ANALYSIS"
  | "TRACE_ELEMENTS";

export type TestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "RETEST_REQUIRED"
  | "CANCELLED";

export type ParameterStatus =
  | "PASS"
  | "WARNING"
  | "OUT_OF_SPEC"
  | "PENDING"
  | "RETEST"
  | "INVALID";

export type LabAnomalySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AnomalySeverity = LabAnomalySeverity;

export type AnomalyStatus =
  | "Detected"
  | "Reviewed"
  | "Acknowledged"
  | "Investigating"
  | "Action Taken"
  | "Resolved"
  | "Closed";

export type CalibrationStatus =
  | "ACTIVE"
  | "CALIBRATION_DUE"
  | "OUT_OF_SERVICE"
  | "MAINTENANCE";

export interface ChainOfCustody {
  collectedBy: string;
  collectedDate: string;
  receivedBy?: string;
  receivedDate?: string;
  laboratory: string;
  sampleCondition: string;
  sealNumber: string;
  storageLocation: string;
  transferHistory: {
    from: string;
    to: string;
    transferredBy: string;
    transferredAt: string;
    notes?: string;
  }[];
}

export interface LabSample extends BaseEntity {
  sampleId: string;
  sampleCode: string; // e.g., SMP-2026-0813-001
  sampleType: SampleType;
  sourceType: "PIT" | "STOCKPILE" | "PROCESSING" | "BARGE" | "BOREHOLE" | "OTHER";
  sourceId: string;
  sourceName: string; // e.g. Pit Alpha - Seam A2 / Stockpile SP-01
  stockpileId?: string;
  productionId?: string;
  plantId?: string;
  seamId?: string;
  location: {
    area: string;
    pit?: string;
    block?: string;
    seam?: string;
    latitude?: number;
    longitude?: number;
    elevation?: number;
  };
  samplingDate: string;
  samplingTime: string;
  shift: "SHIFT_1" | "SHIFT_2" | "SHIFT_3";
  collectorId: string;
  collectorName: string;
  sampleWeightKg: number;
  status: SampleStatus;
  priority: SamplePriority;
  remarks?: string;
  chainOfCustody: ChainOfCustody;
  qrCode: string;
  barcode: string;
}

export interface LabTest extends BaseEntity {
  testId: string;
  sampleId: string;
  sampleCode: string;
  testType: TestType;
  testName: string;
  method: string; // ASTM D3173 / ISO 11722 / GB/T 212
  laboratory: string;
  analystId: string;
  analystName: string;
  instrumentId: string;
  instrumentName: string;
  startTime: string;
  completionTime?: string;
  status: TestStatus;
  resultValue?: number;
  unit?: string;
  basis?: QualityBasis;
  remarks?: string;
}

export interface QualityResult extends BaseEntity {
  resultId: string;
  sampleId: string;
  sampleCode: string;
  testId: string;
  parameter: string; // e.g., GCV, GAR, Total Moisture, Inherent Moisture, Ash Content, Volatile Matter, Fixed Carbon, Total Sulfur, HGI
  parameterName: string;
  value: number;
  unit: string; // kcal/kg, %, index
  basis: QualityBasis;
  method: string;
  target?: number;
  minSpec?: number;
  maxSpec?: number;
  status: ParameterStatus;
  confidence: number; // 0 - 100%
  analystId: string;
  analystName: string;
  reviewerId?: string;
  reviewerName?: string;
  approvedBy?: string;
  approvedAt?: string;
  isApproved: boolean;
  remarks?: string;
}

export interface QualitySpecification extends BaseEntity {
  specificationId: string;
  specCode: string; // e.g., SPEC-GAR5800-PREMIUM
  specName: string;
  productId: string;
  productName: string; // e.g. Premium GAR 5800 Coal
  clientName?: string; // Contract Client
  contractRef?: string;
  parameters: {
    parameter: string;
    basis: QualityBasis;
    unit: string;
    target: number;
    minValue: number;
    maxValue: number;
    warningMin: number;
    warningMax: number;
    penaltyRule?: string;
    rejectThreshold?: string;
  }[];
  effectiveDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

export interface QualityAnomaly extends BaseEntity {
  anomalyId: string;
  anomalyCode: string;
  sampleId: string;
  sampleCode: string;
  sourceType: string;
  sourceId: string;
  sourceName: string;
  parameter: string;
  observedValue: number;
  expectedValue: number;
  deviation: number;
  deviationPercent: number;
  unit: string;
  basis: QualityBasis;
  severity: AnomalySeverity;
  detectionMethod: "AI_STATISTICAL" | "SPEC_OUT_OF_BOUND" | "MULTIVARIATE" | "MANUAL_FLAG";
  status: AnomalyStatus;
  detectedAt: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  rootCauseCategory?: "SEAM_CONTAMINATION" | "HIGH_MOISTURE_RAIN" | "CRUSHER_BLENDING_ERR" | "LAB_INSTRUMENT_DRIFT" | "SAMPLING_BIAS";
}

export interface LabInstrument extends BaseEntity {
  instrumentId: string;
  code: string; // e.g. LAB-CAL-001
  name: string; // e.g. Bomb Calorimeter IKA C6000
  manufacturer: string;
  model: string;
  serialNumber: string;
  calibrationStatus: CalibrationStatus;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationTechnician?: string;
  supportedTests: TestType[];
  accuracyTolerance: string;
  notes?: string;
}

export interface LabCalibrationRecord extends BaseEntity {
  calibrationId: string;
  instrumentId: string;
  instrumentName: string;
  calibrationDate: string;
  calibratedBy: string;
  standardUsed: string;
  passStatus: boolean;
  driftValue: number;
  unit: string;
  certificateRef: string;
  nextDueDate: string;
}

export interface CertificateOfAnalysis extends BaseEntity {
  certificateId: string;
  certificateNumber: string; // e.g. COA/BNU/2026/08/014
  sampleId: string;
  sampleCode: string;
  clientName: string;
  bargeName?: string;
  stockpileName?: string;
  vesselName?: string;
  destination?: string;
  productName: string;
  tonnageMT: number;
  samplingDate: string;
  analysisDate: string;
  issueDate: string;
  laboratoryName: string;
  laboratoryAddress: string;
  accreditationNo: string; // ISO 17025 KAN Accreditation
  specification?: string;
  results: QualityResult[];
  analystName: string;
  analystSignatureUrl?: string;
  reviewerName: string;
  approverName: string;
  isApproved: boolean;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "ISSUED" | "REJECTED";
  qrVerificationUrl: string;
}

export interface QualityTrendPoint {
  date: string;
  sampleCount: number;
  avgGCV: number;
  avgGAR: number;
  avgTM: number;
  avgIM: number;
  avgAsh: number;
  avgTS: number;
  avgVM: number;
  avgFC: number;
  avgHGI: number;
}

export interface AIQualityInsight {
  id: string;
  title: string;
  category: "ANOMALY_DETECTION" | "BLENDING_OPTIMIZATION" | "MOISTURE_PREDICTION" | "CALIBRATION_DRIFT" | "QUALITY_FORECAST";
  confidence: number;
  summary: string;
  evidence: {
    samplesAnalyzed: number;
    dateRange: string;
    keyParameters: string[];
    dataSources: string[];
  };
  rootCause: string;
  businessImpact: string;
  recommendation: string;
  suggestedAction: string;
  timestamp: string;
}

export interface LaboratoryReport extends BaseEntity {
  reportId: string;
  reportCode: string;
  title: string;
  reportType: "DAILY_QUALITY" | "WEEKLY_LAB_SUMMARY" | "MONTHLY_COAL_ASSAY" | "STOCKPILE_QUALITY_RECON" | "INSTRUMENT_CALIBRATION_LOG";
  period: string;
  generatedAt: string;
  generatedBy: string;
  format: "PDF" | "EXCEL" | "CSV";
  status: "READY" | "PROCESSING" | "FAILED";
  downloadUrl?: string;
}

export interface QualityPredictionInput {
  pitId: string;
  seamId: string;
  blockNumber: string;
  depthMeters: number;
  rainfallIndexMm: number;
  washPlantYieldPercent: number;
  blendingTargetMT: number;
}

export interface QualityPredictionResult {
  predictedGAR: number;
  predictedGCV_ADB: number;
  predictedTM: number;
  predictedIM: number;
  predictedAsh: number;
  predictedTS: number;
  predictedVM: number;
  predictedFC: number;
  predictedHGI: number;
  confidenceScore: number;
  rejectionRisk: "LOW" | "MODERATE" | "HIGH";
  suggestedAction: string;
}

