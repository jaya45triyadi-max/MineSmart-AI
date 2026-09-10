// MINE SMART AI - Comprehensive Maintenance & AI Predictive Maintenance Types

import { BaseEntity } from "./index";

// 1. Maintenance Types
export type MaintenanceType = "Preventive" | "Predictive" | "Corrective" | "Breakdown";

export type MaintenanceScheduleTrigger = "ENGINE_HOUR_SMU" | "CALENDAR_DAYS" | "AI_PREDICTIVE_WARNING" | "OPERATOR_INSPECTION" | "BREAKDOWN_EMERGENCY";

export interface MaintenanceTypeDefinition {
  id: string;
  type: MaintenanceType;
  name: string;
  code: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
  triggerType: MaintenanceScheduleTrigger;
  targetSLAHours: number;
  costImpactLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  pmIntervalSMU?: number; // e.g. 250, 500, 1000, 2000
}

// 2. Work Order 6-Stage Lifecycle Pipeline
export type WorkOrderStage = 
  | "Request"      // Stage 1: Permintaan perbaikan / defect reporting
  | "Approval"     // Stage 2: Persetujuan Supervisor / Planner
  | "Assignment"   // Stage 3: Penugasan Lead Mechanic & Workshop Bay
  | "Repair"       // Stage 4: Eksekusi servis, checklist, penggantian spare part
  | "Testing"      // Stage 5: QC Commissioning, test run, safety validation
  | "Closing";     // Stage 6: Final sign-off, cost recap, unit release

export type WorkOrderPriority = "Low" | "Medium" | "High" | "Emergency";

export interface WorkOrderChecklistTask {
  id: string;
  taskDescription: string;
  category: "Inspection" | "Disassembly" | "Replacement" | "Cleaning" | "Calibration" | "Testing";
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
}

export interface WorkOrderPartUsage {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unit: string;
  unitPriceIDR: number;
  totalCostIDR: number;
  issuedFromWarehouse: string;
  issuedAt: string;
}

export interface WorkOrderTestingQC {
  testedBy: string;
  testDate: string;
  testRunHoursSMU: number;
  engineRpmTest: string;
  hydraulicPressurePsi: number;
  operatingTempCelsius: number;
  safetyCheckPassed: boolean;
  leakageCheckPassed: boolean;
  brakesAndSteeringPassed: boolean;
  overallStatus: "PASSED" | "CONDITIONAL_PASS" | "FAILED";
  qcNotes: string;
}

export interface WorkOrder extends BaseEntity {
  woNumber: string; // e.g. "WO-2026-0815-001"
  title: string;
  equipmentId: string;
  equipmentCode: string; // e.g. "EX-101", "HT-204"
  equipmentType: string; // Excavator, Dump Truck, Dozer, etc.
  maintenanceType: MaintenanceType;
  priority: WorkOrderPriority;
  stage: WorkOrderStage;
  stageIndex: number; // 1 to 6

  // Details
  description: string;
  defectDetails?: string;
  failureCategory?: string; // Engine, Hydraulic, Transmission, Electrical, Undercarriage, Structure
  location: string; // Pit 1, Workshop Bay 2, Haul Road KM 4
  currentSMU: number;

  // Stage 1: Request
  requestedBy: string;
  requestDate: string;
  originSource: "OPERATOR_LOG" | "FMS_DISPATCH" | "PM_AUTO_SCHEDULE" | "AI_PREDICTIVE_RADAR" | "BREAKDOWN_CALL";

  // Stage 2: Approval
  approvedBy?: string;
  approvalDate?: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "REQUIRES_REVIEW";
  approvalNotes?: string;
  estimatedBudgetIDR?: number;

  // Stage 3: Assignment
  assignedLeadMechanic?: string;
  mechanicTeam: string[];
  assignedWorkshopBay?: string;
  scheduledStartDate?: string;
  estimatedDurationHours: number;

  // Stage 4: Repair
  actualStartDate?: string;
  actualEndDate?: string;
  actualDurationHours?: number;
  downtimeHours: number;
  tasksChecklist: WorkOrderChecklistTask[];
  sparePartsUsed: WorkOrderPartUsage[];
  repairNotes?: string;

  // Financials
  laborCostIDR: number;
  partsCostIDR: number;
  otherCostIDR: number;
  totalCostIDR: number;

  // Stage 5: Testing
  testingQC?: WorkOrderTestingQC;

  // Stage 6: Closing
  closedBy?: string;
  closedAt?: string;
  closingNotes?: string;
  releasedToOperations: boolean;
  postMaintenanceSMU?: number;
  feedbackScore?: number; // 1-5 rating
}

// 3. Spare Part Management
export type SparePartCategory =
  | "Filters"
  | "Hydraulics"
  | "Engine & Transmission"
  | "Brakes & Steering"
  | "Electrical & Sensors"
  | "Lubricants & Fluids"
  | "Undercarriage & Tracks"
  | "Wear Parts & GET"
  | "Tyres & Rims"
  | "Cooling & Hoses";

export interface SparePartSupplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  leadTimeDays: number;
  city: string;
  isPreferredVendor: boolean;
  ratingScore: number; // 1-5
}

export interface SparePart extends BaseEntity {
  partNumber: string; // e.g. "FLT-CAT-1R0716"
  partName: string;
  category: SparePartCategory;
  description: string;
  stock: number; // Current physical stock
  minimumStock: number; // Reorder threshold (safety stock)
  maxStock: number;
  reorderQuantity: number;
  unit: "PCS" | "SET" | "DRUM" | "LITER" | "METER" | "PAIR";
  unitPriceIDR: number;
  totalValuationIDR: number;
  
  // Supplier Info
  supplier: SparePartSupplier;
  
  // Storage & Compatibility
  storageWarehouse: string; // "Central Warehouse Sangatta", "In-Pit Bay 1"
  binLocation: string; // "Rack A-04-02"
  compatibleEquipment: string[]; // ["EX-101 (CAT 6020B)", "EX-102 (Komatsu PC2000)", "HT-201..HT-208 (Scania P410)"]
  brandOem: string; // "Caterpillar OEM", "Komatsu Genuine", "Donaldson", "Parker"
  
  // Status Flags
  isLowStock: boolean;
  isCriticalStockout: boolean;
  lastRestockedDate: string;
  monthlyAverageUsage: number;
}

// 4. AI Predictive Maintenance Engine (Analysis & Early Warning)
export interface AIPredictiveFactorAnalysis {
  // 1. Engine Hour Analysis
  engineHourAnalysis: {
    currentSMU: number;
    dailyAccumulationRateHours: number;
    hoursSinceLastPM: number;
    overdueSMU: number;
    fatigueLimitSMU: number;
    lifeConsumedPercent: number;
    status: "NORMAL" | "APPROACHING_SERVICE" | "OVERDUE_RISK" | "CRITICAL_FATIGUE";
    summary: string;
  };

  // 2. Breakdown History Analysis
  breakdownHistoryAnalysis: {
    breakdownCountLast90Days: number;
    mtbfHours: number; // Mean Time Between Failures
    mttrHours: number; // Mean Time To Repair
    recurrentFailureSubsystems: string[];
    chronicFailureDetected: boolean;
    status: "STABLE" | "MODERATE_RISK" | "HIGH_FREQUENCY_BREAKDOWN";
    summary: string;
  };

  // 3. Maintenance History Analysis
  maintenanceHistoryAnalysis: {
    pmComplianceRatePercent: number; // On-time PM percentage
    lastPMType: string; // e.g. "PM 500"
    lastPMDate: string;
    oilAnalysisSOSWearMetals: {
      ironFePpm: number;
      copperCuPpm: number;
      siliconSiPpm: number;
      waterPercent: number;
      viscosityCst: number;
      status: "NORMAL" | "CAUTION" | "ABNORMAL_WEAR";
    };
    unresolvedDefectCount: number;
    status: "EXCELLENT" | "ATTENTION" | "DEGRADED_HISTORY";
    summary: string;
  };

  // 4. Fuel & Combustion Analysis
  fuelAnalysis: {
    averageBurnRateLph: number; // Liters per hour
    baselineBurnRateLph: number;
    deviancePercent: number; // e.g. +18.4% abnormal spike
    fuelDilutionRiskPercent: number;
    injectorImbalanceDetected: boolean;
    excessiveIdleFuelLitersToday: number;
    status: "OPTIMAL" | "SLIGHT_DEVIATION" | "HIGH_FUEL_ANOMALY";
    summary: string;
  };

  // 5. Operating Pattern & Telematics Stress
  operatingPatternAnalysis: {
    averageEngineLoadFactorPercent: number; // %
    harshThrottleEventsPerShift: number;
    highRpmStallEvents: number;
    highHydraulicReliefPressureHours: number;
    transmissionOverheatMinutes: number;
    overloadPayloadTripRatio: number; // % of trips overloaded
    status: "SMOOTH_OPERATION" | "MODERATE_STRESS" | "SEVERE_ABUSIVE_OPERATION";
    summary: string;
  };
}

export interface AIEarlyWarningAlert extends BaseEntity {
  warningCode: string; // e.g. "WARN-AI-EX101-01"
  equipmentId: string;
  equipmentCode: string;
  equipmentType: string;
  healthScore: number; // 0 to 100
  overallRiskLevel: "Low" | "Medium" | "High" | "Critical";
  
  // Early Warning Deliverables
  predictedFailureComponent: string; // e.g. "Hydraulic Main Pump #2 Cavitation & Seal Failure"
  predictedDaysToFailure: number; // e.g. 3.5 days
  confidenceScorePercent: number; // e.g. 96.4%
  potentialDowntimeHoursIfFailed: number; // e.g. 36 hours
  potentialCostImpactIDR: number; // e.g. Rp 185.000.000
  
  symptomsObserved: string[];
  aiSynthesizedDiagnosis: string;
  prescriptiveAction: string;
  
  // 5 Analyzed Pillars Detail
  analyzedFactors: AIPredictiveFactorAnalysis;
  
  // Suggested Actions & Spare Parts
  recommendedMaintenanceType: MaintenanceType;
  suggestedSpareParts: Array<{
    partNumber: string;
    partName: string;
    requiredQty: number;
    availableStock: number;
    unitPriceIDR: number;
  }>;
  
  status: "ACTIVE_WARNING" | "IN_REVIEW" | "WORK_ORDER_CREATED" | "DISMISSED" | "RESOLVED";
  associatedWorkOrderId?: string;
  detectedAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// KPI Overview Metrics
export interface AIPredictiveTelemetry {
  id: string;
  equipmentCode: string;
  model: string;
  currentEngineHours: number;
  engineWearIndex: number;
  nextPMDueHours: number;
  fuelDeltaFromBenchmark: string;
  idlePercentage: number;
  operatingPatternNote: string;
}

export interface MaintenanceKPIs {
  meanTimeBetweenFailuresMTBF: number; // hours
  meanTimeToRepairMTTR: number; // hours
  preventiveComplianceRatePercent: number; // %
  fleetPhysicalAvailabilityPA: number; // %
  fleetMechanicalAvailabilityMA: number; // %
  activeWorkOrdersCount: number;
  workOrdersByStage: {
    request: number;
    approval: number;
    assignment: number;
    repair: number;
    testing: number;
    closing: number;
  };
  totalMonthlyMaintenanceCostIDR: number;
  sparePartsInventoryValueIDR: number;
  lowStockPartsAlertCount: number;
  activeAIEarlyWarningsCount: number;
  criticalRiskEquipmentCount: number;
}
