// MINE SMART AI - Equipment & Fleet Management Enterprise Types

import { BaseEntity } from "./index";

export type EquipmentCategory =
  | "Excavator"
  | "Dump Truck"
  | "Dozer"
  | "Grader"
  | "Water Truck"
  | "Light Vehicle"
  | "Service Truck"
  | "Fuel Truck"
  | "Drill Rig"
  | "Wheel Loader"
  | "Compactor"
  | "Crane"
  | "Other";

export type UnitOperationalStatus =
  | "Operating"
  | "Idle"
  | "Standby"
  | "Down"
  | "Maintenance"
  | "Breakdown"
  | "Waiting"
  | "Refueling"
  | "Inspection"
  | "Mobilizing"
  | "Demobilizing"
  | "Inactive";

export type OwnershipType = "OWNED" | "LEASED" | "SUBCONTRACTOR" | "RENTAL";

export type HealthScoreStatus = "Healthy" | "Attention" | "Critical";

// Master Equipment Entity
export interface Equipment extends BaseEntity {
  equipmentId: string;
  unitCode: string;
  equipmentType: EquipmentCategory;
  brand: string;
  model: string;
  serialNumber: string;
  assetNumber: string;
  year: number;
  ownershipType: OwnershipType;
  capacity: string;
  fuelType: string;
  status: UnitOperationalStatus;
  location: string;
  operatorId?: string;
  operatorName?: string;
  engineHour: number;
  odometerKm?: number;
  purchaseDate?: string;
  commissionDate?: string;
  warrantyEndDate?: string;
  department: string;
  costCenter: string;
  description?: string;

  // Performance Metrics
  physicalAvailabilityPA: number; // %
  mechanicalAvailabilityMA: number; // %
  useOfAvailabilityUA: number; // %
  fuelLevelPercent: number;
  healthScore: HealthScoreStatus;
  healthScoreValue: number; // 0-100

  // Coordinates for GIS
  latitude?: number;
  longitude?: number;
  easting?: number;
  northing?: number;
  elevation?: number;
  lastGpsUpdate?: string;
  isGpsOffline?: boolean;

  // Type Specs
  excavatorSpec?: ExcavatorSpec;
  dumpTruckSpec?: DumpTruckSpec;
  dozerSpec?: DozerSpec;
  graderSpec?: GraderSpec;
  waterTruckSpec?: WaterTruckSpec;
  lightVehicleSpec?: LightVehicleSpec;
}

export interface ExcavatorSpec {
  bucketCapacityM3: number;
  operatingWeightTon: number;
  ratedPowerHp: number;
  diggingDepthM: number;
  reachM: number;
  bcmPerHour: number;
  tonPerHour: number;
  cycleTimeSec: number;
  bucketFillFactorPercent: number;
}

export interface DumpTruckSpec {
  payloadCapacityTon: number;
  bodyCapacityM3: number;
  truckModel: string;
  ratedPowerHp: number;
  payloadTonActual: number;
  cycleTimeMin: number;
  travelTimeMin: number;
  queueTimeMin: number;
  loadingTimeMin: number;
  dumpingTimeMin: number;
  tripsCountToday: number;
  tonPerHour: number;
}

export interface DozerSpec {
  bladeType: string;
  bladeCapacityM3: number;
  operatingWeightTon: number;
  ratedPowerHp: number;
  operatingHoursToday: number;
  idleHoursToday: number;
  productivityBcmHr: number;
}

export interface GraderSpec {
  bladeWidthFt: number;
  operatingWeightTon: number;
  ratedPowerHp: number;
  operatingHoursToday: number;
  roadMaintenanceHoursToday: number;
}

export interface WaterTruckSpec {
  tankCapacityLiters: number;
  pumpCapacityLpm: number;
  sprayWidthM: number;
  tripsToday: number;
  waterVolumeM3Today: number;
  roadCoverageKmToday: number;
}

export interface LightVehicleSpec {
  vehicleType: string;
  plateNumber: string;
  fuelType: string;
  odometerKm: number;
  driverName: string;
  distanceTodayKm: number;
}

// Status History
export interface EquipmentStatusHistory {
  id: string;
  equipmentId: string;
  unitCode: string;
  previousStatus: UnitOperationalStatus;
  newStatus: UnitOperationalStatus;
  reason: string;
  startTime: string;
  endTime?: string;
  durationHours?: number;
  reportedBy: string;
  location: string;
  createdAt: string;
}

// Location Tracking & Geofence
export interface EquipmentLocation {
  equipmentId: string;
  unitCode: string;
  latitude: number;
  longitude: number;
  easting: number;
  northing: number;
  elevation: number;
  locationSource: "GPS" | "GNSS" | "Dispatch" | "Manual" | "Imported";
  timestamp: string;
  accuracyMeters: number;
}

export interface LocationHistoryPoint {
  id: string;
  equipmentId: string;
  unitCode: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  distanceKm: number;
  pathCoordinates: [number, number][]; // [lat, lng]
}

export interface EquipmentGeofenceEvent {
  id: string;
  equipmentId: string;
  unitCode: string;
  geofenceName: "Pit A" | "Workshop" | "Fuel Station" | "Stockpile" | "ROM" | "Disposal" | "Restricted Area" | "Parking";
  eventType: "ENTER" | "EXIT" | "STAY_TOO_LONG";
  timestamp: string;
  durationMinutes?: number;
}

// Engine Hour Management
export interface EquipmentEngineHourReading {
  id: string;
  equipmentId: string;
  unitCode: string;
  previousHour: number;
  currentHour: number;
  operatingHour: number;
  idleHour: number;
  source: "Telemetry" | "Manual Shift Log" | "Inspection";
  readingDate: string;
  recordedBy: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

// Downtime Management
export type DowntimeCategory =
  | "Breakdown"
  | "Maintenance"
  | "Waiting Parts"
  | "Operator Issue"
  | "Weather"
  | "Road Condition"
  | "Fuel"
  | "Electrical"
  | "Hydraulic"
  | "Engine"
  | "Tyre"
  | "Other";

export interface EquipmentDowntimeRecord {
  id: string;
  equipmentId: string;
  unitCode: string;
  category: DowntimeCategory;
  componentAffected: string;
  description: string;
  startTime: string;
  endTime?: string;
  downHours: number;
  status: "Open" | "In Repair" | "Waiting Parts" | "Resolved";
  reportedBy: string;
  mechanicInCharge?: string;
}

// Operator Management
export interface Operator {
  id: string;
  operatorId: string;
  employeeId: string;
  name: string;
  department: string;
  licenseType: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "ACTIVE" | "ON_LEAVE" | "EXPIRED_LICENSE" | "INACTIVE";
  assignedUnitCode?: string;
  shift: "Shift A" | "Shift B" | "Shift C";
  totalHoursWorked: number;
  safetyIncidentsCount: number;
}

export interface OperatorAssignment {
  id: string;
  equipmentId: string;
  unitCode: string;
  operatorId: string;
  operatorName: string;
  startTime: string;
  endTime?: string;
  shift: "Shift A" | "Shift B" | "Shift C";
  assignmentType: "PRIMARY" | "RELIEF" | "TEMPORARY";
}

// Dispatch & Matching
export interface FleetShiftPerformance {
  shiftName: "Shift A" | "Shift B" | "Shift C";
  shiftDate: string;
  totalUnits: number;
  operatingUnits: number;
  idleUnits: number;
  downUnits: number;
  productionTon: number;
  utilizationPercent: number;
  fuelConsumedLiters: number;
  downtimeHours: number;
}

export interface FleetDispatchAssignment {
  id: string;
  dispatchId: string;
  excavatorUnitCode: string;
  trucksAssigned: string[]; // Unit codes
  loadingPoint: string;
  dumpPoint: string;
  haulingRouteName: string;
  distanceKm: number;
  targetTripCount: number;
  actualTripCount: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
}

export interface HaulingCycleData {
  id: string;
  truckUnitCode: string;
  excavatorUnitCode: string;
  loadingTimeMin: number;
  travelLoadedMin: number;
  queueAtDumpMin: number;
  dumpingTimeMin: number;
  travelEmptyMin: number;
  queueAtExcavatorMin: number;
  totalCycleTimeMin: number;
  isCompleteData: boolean;
  timestamp: string;
}

export interface ExcavatorTruckMatchRecommendation {
  id: string;
  excavatorUnitCode: string;
  currentTrucksCount: number;
  recommendedTrucksCount: number;
  problem: string;
  evidence: string;
  recommendation: string;
  expectedImpact: string;
}

// Alerts
export interface EquipmentAlert {
  id: string;
  equipmentId: string;
  unitCode: string;
  alertType:
    | "Engine Hour Anomaly"
    | "Service Due"
    | "License Operator Expired"
    | "Equipment Down"
    | "Long Idle"
    | "Low Utilization"
    | "High Fuel"
    | "GPS Offline"
    | "Unusual Location"
    | "Overdue Inspection";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  timestamp: string;
  isResolved: boolean;
}

// Documents
export interface EquipmentDocument {
  id: string;
  equipmentId: string;
  unitCode: string;
  documentType: "STNK" | "BPKB / Asset Document" | "Warranty" | "Manual" | "Inspection Certificate" | "Calibration" | "Maintenance Document" | "Other";
  title: string;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  fileSizeMb: number;
  fileUrl?: string;
}

// AI Fleet Insights
export interface AIFleetInsight {
  id: string;
  topic: string;
  problem: string;
  evidence: string;
  rootCause: string;
  recommendation: string;
  expectedImpact: string;
  confidencePercent: number;
  dataSources: string[];
}

export interface AIFleetResponse {
  question: string;
  isBlockedByGuardrail: boolean;
  blockReason?: string;
  problem?: string;
  evidence?: string;
  rootCause?: string;
  recommendation?: string;
  expectedImpact?: string;
  confidencePercent?: number;
  dataSources?: string[];
}
