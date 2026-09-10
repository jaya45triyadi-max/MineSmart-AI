// MINE SMART AI - Fuel Management Types Definition

import { BaseEntity } from "./index";

export type FuelLocationType = 
  | "Main Fuel Tank" 
  | "Fuel Station" 
  | "Mobile Fuel Tank" 
  | "Storage Tank" 
  | "Other";

export type FuelLedgerTransactionType = 
  | "Opening" 
  | "Receiving" 
  | "Dispensing" 
  | "Transfer In" 
  | "Transfer Out" 
  | "Adjustment" 
  | "Correction" 
  | "Closing";

export type FuelReceivingStatus = 
  | "Draft" 
  | "Submitted" 
  | "Verified" 
  | "Approved" 
  | "Posted";

export type FuelDispensingStatus = 
  | "Requested" 
  | "Authorized" 
  | "Dispensed" 
  | "Recorded" 
  | "Validated";

export type AnomalySeverity = "Normal" | "Low" | "Medium" | "High" | "Critical";

export type FuelLossClassification = 
  | "Data Error" 
  | "Meter Error" 
  | "Calibration" 
  | "Stock Count Error" 
  | "Transfer Issue" 
  | "Operational Loss" 
  | "Unknown Variance";

export type InvestigationStatus = 
  | "Detected" 
  | "Under Investigation" 
  | "Verified" 
  | "Resolved" 
  | "Closed";

export interface FuelProduct extends BaseEntity {
  companyId: string;
  siteId: string;
  name: string;
  code: string;
  type: string;
  unit: string; // e.g. Liter
  density?: number; // e.g., 0.84 kg/L (optional if not configured)
  status: "Active" | "Inactive";
}

export interface FuelTank extends BaseEntity {
  siteId?: string;
  code: string;
  name: string;
  locationType: FuelLocationType;
  fuelProductId?: string;
  capacity: number; // liters
  currentStock: number;
  minThreshold: number; // Low stock alert
  maxThreshold: number;
  status: "Active" | "Maintenance" | "Inactive";
}

export interface FuelStation extends BaseEntity {
  siteId?: string;
  code: string;
  name: string;
  location: string;
  type?: string;
  capacity?: number;
  currentStock?: number;
  status: "Active" | "Maintenance" | "Inactive" | "Closed";
  tankIds?: string[];
  tanks?: string[];
  meters?: string[];
}

export interface FuelMeter extends BaseEntity {
  stationId: string;
  tankId: string;
  serialNumber: string;
  startReading: number;
  currentReading: number;
  lastCalibrationDate: string;
  calibrationStatus: "Pass" | "Warning" | "Fail";
}

export interface MeterCalibration extends BaseEntity {
  meterId: string;
  meterSerial: string;
  calibrationDate: string;
  beforeReading: number;
  testVolume: number;
  afterReading: number;
  variance: number;
  result: "Pass" | "Warning" | "Fail";
  calibratedBy: string;
  nextCalibrationDate: string;
}

export interface FuelSupplier extends BaseEntity {
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
}

export interface FuelStockLedger extends BaseEntity {
  fuelProductId: string;
  locationId: string;
  locationName: string;
  quantity: number;
  unit: string;
  timestamp: string;
  referenceType: FuelLedgerTransactionType;
  referenceId: string;
  userId: string;
  userName: string;
  status: string;
}

export interface FuelQualityCheck {
  isAvailable: boolean;
  density?: number;
  waterContent?: number;
  temperature?: number;
  visualQuality?: string;
  specification?: string;
}

export interface FuelReceiving extends BaseEntity {
  supplierId: string;
  supplierName: string;
  deliveryNumber: string;
  fuelProduct: string;
  fuelProductId: string;
  quantity: number;
  unit: string;
  deliveryDate: string;
  receivingLocation: string;
  vehicleNumber: string;
  driverName: string;
  documentReference: string;
  meterReading: number;
  qualityCheck: FuelQualityCheck;
  receivedBy: string;
  status: FuelReceivingStatus;
}

export interface FuelDispensing extends BaseEntity {
  date: string;
  time: string;
  fuelStationId: string;
  fuelStationName: string;
  tankId: string;
  nozzleId?: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentType?: string;
  operatorId: string;
  operatorName: string;
  fuelProductId: string;
  quantity: number;
  unit: string;
  engineHour?: number;
  odometer?: number;
  hourMeter?: number;
  tripId?: string;
  shiftId: string;
  location: string;
  meterStart: number;
  meterEnd: number;
  authorizedBy: string;
  status: FuelDispensingStatus;
}

export interface FuelTransfer extends BaseEntity {
  sourceLocation: string;
  destinationLocation: string;
  quantity: number;
  unit: string;
  date: string;
  vehicleNumber: string;
  driverName: string;
  authorizedBy: string;
  status: "Draft" | "Completed" | "Cancelled";
}

export interface FuelAdjustment extends BaseEntity {
  adjustmentId: string;
  locationId: string;
  locationName: string;
  quantity: number;
  reason: "Meter Correction" | "Stock Count Correction" | "Calibration" | "Data Correction" | "Other";
  beforeValue: number;
  afterValue: number;
  approvedBy: string;
  timestamp: string;
}

export interface FuelReconciliation extends BaseEntity {
  period: string;
  date: string;
  locationName: string;
  openingStock: number;
  receiving: number;
  dispensing: number;
  transfers: number;
  adjustments: number;
  expectedClosingStock: number;
  physicalClosingStock: number;
  variance: number;
  variancePercent: number;
  status: "Balanced" | "Variance Detected" | "Requires Investigation";
}

export interface FuelConsumptionRecord extends BaseEntity {
  sourceType: "Dispensing" | "Telematics" | "Fuel Sensor" | "Manual Entry" | "Imported Data";
  sourceId: string;
  sourceTimestamp: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentType: string;
  shiftId: string;
  date: string;
  fuelLiters: number;
  operatingHours?: number;
  productionTon?: number;
  productionBCM?: number;
  distanceKm?: number;
  tripsCount?: number;
  fuelPerHour?: number;
  fuelPerTon?: number;
  fuelPerKm?: number;
  fuelPerBcm?: number;
  fuelPerTrip?: number;
}

export interface FuelAnomaly extends BaseEntity {
  equipmentId: string;
  equipmentCode: string;
  equipmentType: string;
  type: 
    | "Sudden Consumption Increase" 
    | "High Fuel/Hour" 
    | "High Fuel/Ton" 
    | "High Fuel/km" 
    | "Fuel Spike" 
    | "Consumption Drop" 
    | "Unexpected Dispensing" 
    | "Repeated Anomaly";
  detectionMethod: "Threshold" | "Historical Comparison" | "Moving Average" | "Percent Deviation" | "Equipment Comparison";
  confidence: number; // e.g. 0.92
  dataSources: string[];
  severity: AnomalySeverity;
  timestamp: string;
  baselineValue: number;
  actualValue: number;
  deviationPercent: number;
  description: string;
  status: "Active" | "Investigating" | "Resolved" | "False Positive";
}

export interface FuelLossAlert extends BaseEntity {
  locationId: string;
  locationName: string;
  period: string;
  expectedStock: number;
  physicalStock: number;
  variance: number;
  variancePercent: number;
  classification: FuelLossClassification;
  status: InvestigationStatus;
  possibleCauses: string[];
  detectedAt: string;
}

export interface FuelInvestigation extends BaseEntity {
  alertId: string;
  locationName: string;
  assignedTo: string;
  finding: string;
  evidence: string[];
  action: string;
  resolution: string;
  closedBy?: string;
  closedAt?: string;
  status: InvestigationStatus;
}

export interface FuelForecast extends BaseEntity {
  period: "End of Day" | "End of Week" | "End of Month";
  projectedConsumption: number;
  requiredStock: number;
  currentStock: number;
  potentialShortage: number;
  expectedClosingStock: number;
  confidence: number;
  reorderQuantity: number;
  reorderDate: string;
  expectedStockoutDate: string;
  recommendation: string;
}

export interface FuelStockAlertItem extends BaseEntity {
  tankId: string;
  tankName: string;
  alertType: "Low Stock" | "Critical Stock" | "High Consumption" | "Stock Variance" | "Receiving Delay" | "Unexpected Dispensing";
  message: string;
  thresholdValue: number;
  currentValue: number;
  timestamp: string;
  severity: AnomalySeverity;
}

export interface FuelIdleRecord extends BaseEntity {
  equipmentId: string;
  equipmentCode: string;
  equipmentType: string;
  operatorName: string;
  shift: string;
  date: string;
  totalEngineHours: number;
  workingHours: number;
  idleHours: number;
  idlePercentage: number; // e.g. 38.5%
  totalFuelBurnedLiters: number;
  idleFuelWastedLiters: number;
  estimatedWastedCostIDR: number; // e.g. Rp 3,250,000
  idleLocation: string;
  rootCause: string;
  severity: AnomalySeverity;
  recommendation: string;
  status: "Flagged" | "Coaching Sent" | "Resolved";
}

export interface FuelEfficiencyRanking extends BaseEntity {
  equipmentId: string;
  equipmentCode: string;
  equipmentType: string;
  equipmentCategory: "Dump Truck" | "Excavator" | "Bulldozer" | "Wheel Loader" | "Motor Grader";
  model: string;
  assignedOperator: string;
  fuelPerHour: number;
  targetFuelPerHour: number;
  fuelPerTon?: number;
  targetFuelPerTon?: number;
  fuelPerKm?: number;
  targetFuelPerKm?: number;
  efficiencyScore: number; // 0 - 100
  efficiencyStatus: "Optimal" | "Normal" | "Inefficient" | "Severe Inefficiency";
  primaryInefficiencyReason?: string;
  rootCauses: string[];
  suggestedAction: string;
}

export interface FuelSiphoningAlert extends BaseEntity {
  alertId: string;
  targetType: "Equipment Tank" | "Station Storage Tank" | "Mobile Fuel Truck";
  targetCode: string;
  targetName: string;
  timestamp: string;
  location: string;
  fuelDropLiters: number;
  initialLevelLiters: number;
  finalLevelLiters: number;
  durationMinutes: number;
  engineStatus: "ENGINE_OFF" | "ENGINE_IDLE" | "PARKED_ZONE";
  telemetrySource: "CANBus Fuel Sensor" | "ATG Radar Probe" | "Flowmeter Pulse Counter";
  confidenceScore: number; // 0.0 - 1.0
  severity: "High" | "Critical";
  cctvSnapshotRef?: string;
  status: "Detected" | "Security Dispatched" | "Under Investigation" | "Confirmed Theft" | "Sensor Glitch" | "Resolved";
  operatorOnShift?: string;
  investigationNotes?: string;
}
