// MINE SMART AI - RKAB & Compliance Data Models
// Sesuai Regulasi Ditjen Minerba ESDM & SMKP Kepmen 1827/2018 / MinerbaOne Integration

export type RKABPeriod = "2026" | "2025" | "2024" | "2027 (Draft)";
export type QuarterPeriod = "Q1" | "Q2" | "Q3" | "Q4";
export type RKABComplianceStatus = "COMPLIANT" | "WARNING" | "NON_COMPLIANT" | "PENDING_REVIEW";

export interface ProductionTargetItem {
  id: string;
  month: string; // Jan, Feb, ...
  quarter: QuarterPeriod;
  coalTargetMT: number; // Ton batubara target
  coalActualMT: number; // Ton batubara realisasi
  obTargetBCM: number; // BCM overburden target
  obActualBCM: number; // BCM overburden realisasi
  targetSR: number; // Planned Stripping Ratio
  actualSR: number; // Actual Stripping Ratio
  dmoTargetMT: number; // Target DMO (25%)
  dmoActualMT: number; // Realisasi DMO diserap PLN/Industri
  exportActualMT: number; // Realisasi Ekspor
  notes?: string;
}

export interface WorkPlanMatrixItem {
  id: string;
  matrixCode: string; // e.g. "Matriks 1A", "Matriks 2B"
  activityName: string; // e.g. "Eksplorasi Lanjutan & Pemboran Geoteknik"
  category: "EKSPLORASI" | "PENAMBANGAN" | "PENGOLAHAN" | "INFRASTRUKTUR" | "LINGKUNGAN" | "K3";
  targetVolume: number;
  unit: string; // "Meter", "Ha", "KM", "Unit", "Ton"
  realizedVolume: number;
  progressPercent: number;
  timelineQuarter: QuarterPeriod[];
  responsiblePerson: string;
  status: "ON_TRACK" | "BEHIND_SCHEDULE" | "COMPLETED" | "NOT_STARTED";
  budgetAllocatedIDR: number;
  budgetSpentIDR: number;
}

export interface InvestmentBudgetItem {
  id: string;
  category: "CAPEX_HEAVY_EQUIPMENT" | "CAPEX_INFRASTRUCTURE" | "OPEX_MINING" | "OPEX_SAFETY_HSE" | "OPEX_RECLAMATION" | "ROYALTY_PNBP";
  title: string;
  description: string;
  planAmountUSD: number;
  actualAmountUSD: number;
  planAmountIDR: number;
  actualAmountIDR: number;
  allocationPercent: number;
  isMandatoryESDM: boolean;
  notes: string;
}

export interface ReclamationComplianceItem {
  id: string;
  year: string;
  pitArea: string; // Pit 1 South, Pit 2 North, Disposal East
  openedAreaHa: number; // Luas bukaan baru
  cumulativeOpenedHa: number; // Kumulatif bukaan
  reclamationTargetHa: number; // Target reklamasi
  reclamationActualHa: number; // Realisasi penataan lahan
  revegetationTargetHa: number; // Target revegetasi
  revegetationActualHa: number; // Realisasi tanam pohon
  treesPlantedCount: number; // Jumlah pohon endemik ditanam
  nurseryStockCount: number; // Bibit siap tanam di nursery
  jamrekGuaranteeAmountIDR: number; // Nominal Jaminan Reklamasi (Bank Garansi)
  jamrekStatus: "DEPOSITED" | "PENDING_RENEWAL" | "RELEASED";
  acidWaterPondPH: number; // Kualitas air settling pond (standar 6-9)
  tssPPM: number; // TSS baku mutu (< 300 mg/L)
}

export interface ManpowerComplianceItem {
  id: string;
  category: "LOKAL_RING_1" | "LOKAL_PROVINSI" | "NASIONAL" | "TKA";
  headcount: number;
  targetRatioPercent: number;
  actualRatioPercent: number;
  trainingHoursDelivered: number;
}

export interface MandatoryCertificationPersonnel {
  id: string;
  name: string;
  role: string;
  certificateType: "KTT" | "POP" | "POM" | "POU" | "JURU_UKUR" | "JURU_LEDAK_KIM" | "AHLI_K3_MINERBA";
  certificateNumber: string;
  issuingBody: string; // Ditjen Minerba ESDM / LSP ESDM
  validUntil: string;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED";
}

export interface MiningSafetyKOAuditMetric {
  id: string;
  metricName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  status: "SAFE" | "ATTENTION" | "CRITICAL";
  benchmarkESDM: string;
}

export interface MinerbaOneBridgePayload {
  companyProfile: {
    companyName: string;
    nib: string;
    iupNumber: string;
    kttName: string;
    kttApprovalNo: string;
    location: string;
    concessionAreaHa: number;
    commodity: string;
  };
  rkabApprovalSK: string;
  year: string;
  productionSummary: {
    targetCoalMT: number;
    realizedCoalMT: number;
    achievementPercent: number;
    targetOBBCM: number;
    realizedOBBCM: number;
    dmoRealizedMT: number;
    dmoPercent: number;
  };
  reclamationSummary: {
    reclamationHa: number;
    revegetationHa: number;
    jamrekDepositedIDR: number;
  };
  safetySummary: {
    fatalityCount: number;
    ltiCount: number;
    smkpAuditScore: number;
  };
  manpowerSummary: {
    totalEmployees: number;
    localWorkerPercent: number;
    certifiedKTTPOPCount: number;
  };
  preValidationErrors: Array<{
    code: string;
    severity: "ERROR" | "WARNING" | "INFO";
    message: string;
    remedy: string;
  }>;
}
