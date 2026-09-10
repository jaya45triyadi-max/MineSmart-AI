// MINE SMART AI - Weighbridge Management Types

import { BaseEntity } from "./index";

export type WeighbridgeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "CALIBRATION_DUE"
  | "OUT_OF_SERVICE";

export interface Weighbridge extends BaseEntity {
  weighbridgeId: string;
  companyId: string;
  siteId: string;
  code: string;
  name: string;
  location: string;
  status: WeighbridgeStatus;
  capacity: number; // in Tons
  scaleType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  calibrationStatus: "VALID" | "DUE" | "EXPIRED" | "FAILED";
  lastCalibrationDate: string;
  nextCalibrationDate: string;
}

export type VehicleType =
  | "DUMP_TRUCK"
  | "TRUCK"
  | "TRAILER"
  | "LIGHT_VEHICLE"
  | "SERVICE_VEHICLE"
  | "OTHER";

export interface WeighbridgeVehicle {
  vehicleId: string;
  unitNumber: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  fleetNumber: string;
  operatorId: string;
  operatorName: string;
  capacity: number; // Tons
  tareWeightStandard: number; // kg
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "BLOCKED";
  lastWeighIn?: string;
  lastWeighOut?: string;
  totalWeightToday: number; // Tons
  transactionCountToday: number;
}

export type WeightSource = "MANUAL" | "DIGITAL_SCALE" | "API" | "IMPORT";

export type WeighInStatus = "PENDING" | "WEIGHED" | "VALIDATED" | "REJECTED" | "CANCELLED";

export interface WeighInTransaction extends BaseEntity {
  weighInId: string;
  weighbridgeId: string;
  weighbridgeName: string;
  vehicleId: string;
  unitNumber: string;
  operatorId: string;
  operatorName: string;
  transactionNumber: string;
  timestamp: string;
  scaleWeight: number; // kg
  direction: "WEIGH_IN" | "WEIGH_OUT";
  materialType: string;
  sourceType: string;
  sourceId: string;
  sourceName: string;
  destinationType: string;
  destinationId: string;
  destinationName: string;
  stockpileId?: string;
  productionId?: string;
  salesOrderId?: string;
  allocationId?: string;
  shipmentId?: string;
  grossWeight: number; // kg
  grossUnit: "kg" | "ton" | "lb";
  grossTimestamp: string;
  grossSource: WeightSource;
  status: WeighInStatus;
  notes?: string;
}

export interface WeighOutTransaction extends BaseEntity {
  weighOutId: string;
  weighInId: string;
  weighbridgeId: string;
  vehicleId: string;
  timestamp: string;
  tareWeight: number; // kg
  tareUnit: "kg" | "ton" | "lb";
  tareSource: WeightSource;
  status: "COMPLETED" | "REJECTED" | "CANCELLED";
}

export type TicketStatus =
  | "DRAFT"
  | "OPEN"
  | "COMPLETED"
  | "VALIDATED"
  | "RECONCILED"
  | "VOID"
  | "REJECTED"
  | "CANCELLED";

export interface WeighbridgeTicket extends BaseEntity {
  ticketId: string;
  ticketNumber: string; // e.g. WB-20260813-000001
  weighInId: string;
  weighOutId?: string;
  vehicleId: string;
  unitNumber: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  weighbridgeId: string;
  weighbridgeName: string;
  materialType: string;
  source: string;
  destination: string;
  grossWeight: number; // kg
  tareWeight: number; // kg
  netWeight: number; // kg
  unit: "kg" | "ton" | "lb";
  originalValue: number;
  originalUnit: "kg" | "ton" | "lb";
  normalizedValue: number; // ton
  normalizedUnit: "ton";
  operatorId: string;
  operatorName: string;
  weighInTime: string;
  weighOutTime?: string;
  shift: "Shift 1" | "Shift 2" | "Shift 3";
  status: TicketStatus;
  qrCode: string;
  barcode: string;
  isOverload: boolean;
  overloadSeverity?: "WARNING" | "CRITICAL";
  qualitySampleId?: string;
  qualityStatus?: "APPROVED" | "PENDING" | "NON_COMPLIANT";
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
}

export type ReconciliationStatus =
  | "MATCHED"
  | "MINOR_VARIANCE"
  | "MAJOR_VARIANCE"
  | "UNRESOLVED"
  | "RESOLVED";

export interface WeighbridgeReconciliation extends BaseEntity {
  reconciliationId: string;
  companyId: string;
  siteId: string;
  date: string;
  sourceType: "DISPATCH" | "PRODUCTION" | "STOCKPILE" | "SALES" | "SHIPMENT" | "FINANCE";
  sourceId: string;
  referenceNumber: string;
  weighbridgeQuantity: number; // Tons
  systemQuantity: number; // Tons
  variance: number; // Tons
  variancePercent: number; // %
  status: ReconciliationStatus;
  reason?: string;
  possibleCause?: string;
  reviewedBy?: string;
  resolvedBy?: string;
  resolution?: string;
}

export interface WeighbridgeCalibration {
  calibrationId: string;
  weighbridgeId: string;
  weighbridgeCode: string;
  calibrationDate: string;
  certificateNumber: string;
  performedBy: string;
  result: "PASSED" | "PASSED_WITH_NOTE" | "FAILED";
  nextCalibrationDate: string;
  documentId?: string;
  status: "VALID" | "DUE" | "EXPIRED" | "FAILED";
  notes?: string;
}

export interface ScaleDeviceReading {
  deviceId: string;
  weighbridgeId: string;
  rawWeight: number; // kg
  normalizedWeight: number; // Ton
  unit: "kg" | "ton";
  stableReading: boolean;
  readingTimestamp: string;
  connectionStatus: "ONLINE" | "OFFLINE" | "SIMULATED";
  scaleType: string;
}

export interface WeighbridgeAlert {
  id: string;
  type:
    | "OVERLOAD"
    | "CALIBRATION_DUE"
    | "CALIBRATION_EXPIRED"
    | "DUPLICATE_TICKET"
    | "MISSING_WEIGH_OUT"
    | "MAJOR_VARIANCE"
    | "WEIGHBRIDGE_DOWN"
    | "SUSPICIOUS_TRANSACTION";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  vehicleNumber?: string;
  ticketNumber?: string;
  timestamp: string;
  isResolved: boolean;
}

export interface WeighbridgeAIInsight {
  id: string;
  title: string;
  finding: string;
  evidence: string;
  variance: string;
  possibleCause: string;
  impact: string;
  recommendation: string;
  confidence: "Low" | "Medium" | "High";
  timestamp: string;
}
