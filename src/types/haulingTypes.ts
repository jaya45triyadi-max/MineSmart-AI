// MINE SMART AI - Hauling Management & AI Hauling Intelligence Center Types

import { BaseEntity } from "./index";

export type HaulingStatusType =
  | "Assigned"
  | "Queue"
  | "Loading"
  | "Loaded Hauling"
  | "Arrived"
  | "Dumping"
  | "Empty Return"
  | "Completed"
  | "Delayed"
  | "Exception"
  | "Cancelled";

export type RouteType =
  | "Coal Hauling"
  | "OB Hauling"
  | "ROM Hauling"
  | "Waste Hauling"
  | "Rehandle"
  | "Other";

export type RoadSurfaceType =
  | "Gravel"
  | "Compacted Soil"
  | "Asphalt"
  | "Crushed Stone"
  | "Hardpack";

export type RoadConditionStatus =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"
  | "Critical"
  | "Closed"
  | "Under Maintenance";

// Main Hauling Trip Entity
export interface HaulingTrip extends BaseEntity {
  haulingId: string;
  companyId: string;
  siteId: string;
  dispatchId: string;
  truckId: string;
  truckUnitCode: string;
  operatorId: string;
  operatorName: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  routeId: string;
  routeName: string;
  materialType: string;
  tripStatus: HaulingStatusType;
  startTime: string;
  loadingCompleteTime: string;
  haulingStartTime: string;
  destinationArrivalTime: string;
  dumpingCompleteTime: string;
  returnStartTime: string;
  returnArrivalTime: string;
  distance: number;
  loadedDistance: number;
  emptyDistance: number;
  loadedTravelTime: number; // in minutes
  emptyTravelTime: number; // in minutes
  queueTime: number; // in minutes
  loadingTime: number; // in minutes
  dumpingTime: number; // in minutes
  cycleTime: number; // in minutes
  payload: number; // Ton
  fuelConsumed: number; // Liters
  fuelEfficiency: number; // Fuel/Ton or L/km
  roadCondition: RoadConditionStatus;
  gpsSource: string;
  sourceTimestamp: string;
  dataQualityStatus: "VALID" | "WARNING" | "REQUIRES_REVIEW" | "INVALID";
  deviationDistanceKm?: number;
  deviationStatus?: "Normal" | "Warning" | "Significant Deviation";
}

// Hauling Route Entity
export interface HaulingRoute extends BaseEntity {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  routeType: RouteType;
  distanceKm: number;
  loadedDistanceKm: number;
  emptyDistanceKm: number;
  roadName: string;
  status: "ACTIVE" | "INACTIVE" | "DIVERTED" | "CLOSED";
  effectiveDate: string;
  currentVersion: number;
  targetCycleTimeMin: number;
  speedLimitKmh: number;
  gradientPercent: number;
}

// Route Versioning Entity
export interface HaulingRouteVersion extends BaseEntity {
  versionId: string;
  routeId: string;
  routeName: string;
  versionNumber: number;
  distanceKm: number;
  loadedDistanceKm: number;
  emptyDistanceKm: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  reasonForChange: string;
  createdBy: string;
  approvedBy?: string;
  status: "ACTIVE" | "ARCHIVED" | "PENDING_APPROVAL";
}

// Route Segment Entity for GIS
export interface HaulingRouteSegment extends BaseEntity {
  segmentId: string;
  routeId: string;
  segmentName: string;
  startCoordinates: [number, number];
  endCoordinates: [number, number];
  lengthKm: number;
  gradientPercent: number;
  surfaceType: RoadSurfaceType;
  condition: RoadConditionStatus;
  avgSpeedKmh: number;
}

// Queue Monitoring
export interface HaulingQueueItem extends BaseEntity {
  queueId: string;
  haulingId?: string;
  truckUnitCode: string;
  location: string;
  routeId?: string;
  excavatorUnitCode?: string;
  queueStartTime: string;
  queueEndTime?: string;
  queueDurationMin: number;
  queueStatus: "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "RESOLVED";
  alertSeverity?: "INFO" | "WARNING" | "CRITICAL";
}

// Truck Productivity Performance Metrics
export interface TruckProductivityMetrics {
  truckUnitCode: string;
  tripsCount: number;
  totalPayloadTon: number;
  tonPerHour: number;
  tripsPerHour: number;
  avgCycleTimeMin: number;
  utilizationPercent: number;
  queueTimeMin: number;
  travelTimeMin: number;
  fuelConsumedLiters: number;
  fuelPerTon: number;
  distancePerTripKm: number;
}

// Road Condition Entity
export interface RoadConditionItem extends BaseEntity {
  roadId: string;
  roadName: string;
  segment: string;
  location: string;
  lengthKm: number;
  surfaceType: RoadSurfaceType;
  condition: RoadConditionStatus;
  lastInspection: string;
  inspectionBy: string;
  status: "OPEN" | "RESTRICTED" | "CLOSED" | "MAINTENANCE";
  parameters?: {
    surfaceCondition?: string;
    ruttingDepthCm?: number;
    potholesCount?: number;
    dustLevel?: "LOW" | "MODERATE" | "HIGH";
    mudSeverity?: "NONE" | "LIGHT" | "HEAVY";
    drainageStatus?: "GOOD" | "CLOGGED" | "FLOODED";
    slopePercent?: number;
    roadWidthMeters?: number;
    visibilityKm?: number;
    trafficDensity?: "LOW" | "MEDIUM" | "HIGH";
    waterCondition?: string;
  };
}

// Road Inspection Record
export interface RoadInspectionRecord extends BaseEntity {
  inspectionId: string;
  roadId: string;
  roadName: string;
  date: string;
  inspector: string;
  condition: RoadConditionStatus;
  findings: string;
  photoReferences: string[];
  recommendation: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "SUBMITTED" | "APPROVED" | "WORK_ORDER_CREATED";
}

// Fuel Efficiency Record
export interface HaulingFuelRecord extends BaseEntity {
  fuelId: string;
  truckUnitCode: string;
  haulingId?: string;
  routeId?: string;
  timestamp: string;
  fuelConsumedLiters: number;
  tripDistanceKm: number;
  payloadTon: number;
  fuelPerKm: number;
  fuelPerTon: number;
  loadedFuelPerKm: number;
  emptyFuelPerKm: number;
  sourceType:
    | "Fuel Transaction"
    | "Fuel Sensor"
    | "Fleet Telematics"
    | "Manual Entry"
    | "Imported Data";
  sourceId: string;
  sourceTimestamp: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

// Bottleneck Analysis Item
export interface HaulingBottleneckItem {
  bottleneckId: string;
  location: string;
  bottleneckType:
    | "Queue"
    | "Loading"
    | "Road"
    | "Traffic"
    | "Hauling"
    | "Dumping"
    | "Return"
    | "Truck"
    | "Excavator"
    | "Weather"
    | "Maintenance";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  impactDelayMin: number;
  affectedTrucksCount: number;
  description: string;
  suggestedAction: string;
}

// Scenario Simulator Model
export interface HaulingScenario {
  scenarioId: string;
  scenarioName: string;
  routeSelection: string[];
  truckCountAdjustment: number;
  roadConditionFactor: number;
  reducedQueueMin: number;
  expectedProductionTon: number;
  expectedCycleTimeMin: number;
  expectedDistanceKm: number;
  expectedFuelLiters: number;
  expectedFuelPerTon: number;
  riskAssessment: string;
  status: "DRAFT" | "SIMULATED" | "APPLIED";
}

// Hauling Alert Entity
export interface HaulingAlertItem {
  alertId: string;
  haulingId?: string;
  truckUnitCode: string;
  alertType:
    | "Long Cycle Time"
    | "Long Travel Time"
    | "Long Queue"
    | "Route Delay"
    | "Road Critical"
    | "Fuel Anomaly"
    | "Low Truck Productivity"
    | "High Fuel/Ton"
    | "GPS Offline"
    | "Route Deviation"
    | "Unexpected Stop";
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  location: string;
  timestamp: string;
  isResolved: boolean;
}

// Data Quality Validation Check
export interface HaulingDataQualityCheck {
  id: string;
  tripId: string;
  truckUnitCode: string;
  checkName: string;
  issueType:
    | "Missing Route"
    | "Missing Distance"
    | "Invalid Timestamp"
    | "Negative Duration"
    | "Missing Truck"
    | "Missing Dispatch"
    | "Duplicate Trip"
    | "Invalid Payload"
    | "Missing Fuel"
    | "Stale GPS"
    | "Invalid Coordinate";
  status: "VALID" | "WARNING" | "REQUIRES_REVIEW" | "INVALID";
  details: string;
}

// AI Daily Hauling Report Structure
export interface AIDailyHaulingReport {
  reportDate: string;
  shift: string;
  executiveSummary: string;
  tripsTotal: number;
  productionTon: number;
  avgDistanceKm: number;
  avgTravelTimeMin: number;
  avgCycleTimeMin: number;
  avgQueueTimeMin: number;
  truckProductivityTonHr: number;
  roadConditionSummary: string;
  fuelEfficiencyLPerTon: number;
  majorDelays: string[];
  bottlenecks: string[];
  aiInsight: string;
  recommendations: string[];
  dataQualityStatus: string;
  generatedAt: string;
}
