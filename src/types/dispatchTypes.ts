// MINE SMART AI - Dispatch Management & AI Dispatch Optimization Types

import { BaseEntity } from "./index";

export type DispatchStatusType =
  | "Assigned"
  | "Queued"
  | "Loading"
  | "Hauling Loaded"
  | "Dumping"
  | "Returning"
  | "Completed"
  | "Cancelled"
  | "Delayed"
  | "Exception";

export type DumpingType =
  | "ROM"
  | "Stockpile"
  | "Disposal"
  | "Crusher"
  | "Bunker"
  | "Other";

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// Main Dispatch Entity
export interface DispatchRecord extends BaseEntity {
  dispatchId: string;
  companyId: string;
  siteId: string;
  shiftId: string;
  date: string;
  truckId: string;
  truckUnitCode: string;
  excavatorId: string;
  excavatorUnitCode: string;
  operatorId: string;
  operatorName: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  materialType: "Coal" | "Overburden" | "Interburden" | "Topsoil" | "Waste";
  dispatchStatus: DispatchStatusType;
  assignmentStatus: "ACTIVE" | "COMPLETED" | "HOLD" | "CANCELLED";
  priority: PriorityLevel;
  targetProductionTon: number;
  actualProductionTon: number;
  tripCount: number;

  // Cycle breakdown in minutes
  queueTimeMin: number;
  loadingTimeMin: number;
  haulingTimeMin: number;
  dumpingTimeMin: number;
  returnTimeMin: number;
  totalCycleTimeMin: number;

  lastUpdateTimestamp: string;
  createdBy: string;
  updatedBy: string;
}

// Queue Management
export interface DispatchQueueItem extends BaseEntity {
  queueId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  excavatorId: string;
  excavatorUnitCode: string;
  queuePosition: number;
  queueStartTime: string;
  queueEndTime?: string;
  queueDurationMin: number;
  location: string;
  materialType: string;
  status: "QUEUED" | "LOADING" | "CANCELLED" | "COMPLETED";
}

// Loading Management
export interface DispatchLoadingRecord extends BaseEntity {
  loadingId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  excavatorId: string;
  excavatorUnitCode: string;
  startTime: string;
  endTime?: string;
  durationMin: number;
  payloadTon: number;
  materialType: string;
  loadingPoint: string;
  operatorName: string;
  status: "IN_PROGRESS" | "COMPLETED" | "DELAYED";
}

// Hauling Management
export interface DispatchHaulingRecord extends BaseEntity {
  haulingId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  origin: string;
  destination: string;
  startTime: string;
  endTime?: string;
  distanceKm: number;
  loadedDistanceKm: number;
  emptyDistanceKm: number;
  routeName: string;
  avgSpeedKmh: number;
  status: "HAULING" | "COMPLETED" | "DELAYED" | "BREAKDOWN";
}

// Dumping Management
export interface DispatchDumpingRecord extends BaseEntity {
  dumpingId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  destination: string;
  materialType: string;
  startTime: string;
  endTime?: string;
  durationMin: number;
  payloadTon: number;
  dumpPoint: string;
  dumpType: DumpingType;
  operatorName: string;
  status: "DUMPING" | "COMPLETED" | "DELAYED";
}

// Return Management
export interface DispatchReturnRecord extends BaseEntity {
  returnId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  startTime: string;
  endTime?: string;
  durationMin: number;
  distanceKm: number;
  destinationExcavator: string;
  status: "RETURNING" | "COMPLETED" | "DELAYED";
}

// Cycle Time Analytics & Detail
export interface DispatchCycleDetail {
  id: string;
  dispatchId: string;
  truckUnitCode: string;
  excavatorUnitCode: string;
  material: string;
  origin: string;
  destination: string;
  queueMin: number;
  loadingMin: number;
  haulingMin: number;
  dumpingMin: number;
  returnMin: number;
  totalCycleMin: number;
  payloadTon: number;
  timestamp: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

// Excavator-Truck Matching
export interface ExcavatorTruckMatchScore {
  excavatorUnitCode: string;
  truckUnitCode: string;
  excavatorCapacityM3: number;
  truckPayloadTon: number;
  capacityMatchPercent: number;
  distanceScore: number;
  cycleTimeMin: number;
  queueMin: number;
  compatibilityScorePercent: number;
  recommendedRatio: string; // e.g. "1 EX : 4 DT"
  reason: string;
  expectedImpact: string;
}

// AI Dispatch Optimization & Scenario
export interface DispatchScenarioInput {
  scenarioName: string;
  targetProductionTon: number;
  shiftDurationHours: number;
  availableExcavators: string[];
  availableTrucks: string[];
  maxTrucksPerExcavator: number;
  minTrucksPerExcavator: number;
  routeCapacityTrucksHr: number;
  dumpCapacityTonHr: number;
}

export interface DispatchScenarioResult {
  scenarioId: string;
  scenarioName: string;
  createdAt: string;
  recommendedTruckAllocation: { excavatorCode: string; trucks: string[]; targetTon: number }[];
  expectedProductionTon: number;
  expectedCycleTimeMin: number;
  expectedQueueReductionPercent: number;
  expectedUtilizationPercent: number;
  potentialBottlenecks: string[];
  aiSummary: string;
  confidencePercent: number;
  status: "DRAFT" | "SIMULATED" | "APPLIED" | "ARCHIVED";
}

// Dispatch Optimization Audit Record
export interface DispatchOptimizationAudit extends BaseEntity {
  optimizationId: string;
  scenarioId: string;
  scenarioName: string;
  inputDataSnapshot: any;
  recommendationSummary: string;
  affectedUnitsCount: number;
  appliedChanges: { unitCode: string; oldExcavator: string; newExcavator: string; oldRoute: string; newRoute: string }[];
  appliedBy: string;
  appliedAt: string;
  resultStatus: "SUCCESS" | "FAILED" | "ROLLBACK";
}

// Dispatch Alert Entity
export interface DispatchAlertRecord {
  alertId: string;
  dispatchId?: string;
  unitCode: string;
  alertType:
    | "Long Queue"
    | "Long Cycle"
    | "Truck Idle"
    | "Excavator Idle"
    | "Truck Shortage"
    | "Truck Excess"
    | "Dump Congestion"
    | "Road Congestion"
    | "Production Below Target"
    | "Unexpected Route"
    | "GPS Offline"
    | "Assignment Conflict";
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  location: string;
  timestamp: string;
  isResolved: boolean;
}

// AI Daily Dispatch Report Structure
export interface AIDailyDispatchReport {
  reportDate: string;
  shift: string;
  executiveSummary: string;
  fleetStatusSummary: {
    totalActiveDispatch: number;
    operatingTrucks: number;
    queuedTrucks: number;
    haulingTrucks: number;
    idleTrucks: number;
  };
  productionMetrics: {
    targetProductionTon: number;
    actualProductionTon: number;
    varianceTon: number;
    achievementPercent: number;
  };
  cycleTimeMetrics: {
    avgCycleTimeMin: number;
    avgQueueTimeMin: number;
    avgLoadingTimeMin: number;
    avgHaulingTimeMin: number;
    avgDumpingTimeMin: number;
  };
  bottleneckAnalysis: {
    location: string;
    issue: string;
    impactMin: number;
    cause: string;
  }[];
  aiRecommendations: string[];
  dataLimitations: string;
  generatedAt: string;
}
