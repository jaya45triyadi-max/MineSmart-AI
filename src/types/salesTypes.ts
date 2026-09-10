// MINE SMART AI - Sales & Shipment Management Types

import { BaseEntity } from "./index";

export type CustomerType =
  | "TRADER"
  | "POWER_PLANT"
  | "INDUSTRIAL"
  | "END_USER"
  | "OTHER";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "PROSPECT";

export interface Customer extends BaseEntity {
  customerId: string;
  companyId: string;
  customerCode: string;
  customerName: string;
  customerType: CustomerType;
  country: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  taxId: string;
  paymentTerms: string; // e.g., "LC 30 Days", "CAD", "T/T 14 Days"
  creditLimit: number;
  currency: string; // USD, IDR
  status: CustomerStatus;
}

export type ContractType = "LONG_TERM" | "SPOT" | "FRAMEWORK" | "TENDER";

export type ContractStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELLED";

export type PricingBasis = "FIXED" | "INDEX_LINKED" | "FORMULA_BASED" | "NEGOTIATED";

export interface SalesContract extends BaseEntity {
  contractId: string;
  companyId: string;
  customerId: string;
  customerName: string;
  contractNumber: string; // e.g. CTR-2026-PLN-088
  contractType: ContractType;
  productId: string;
  productName: string;
  coalSpecificationId: string;
  specName: string;
  contractQuantity: number; // MT
  quantityUnit: string; // MT
  price: number; // e.g. 85.50
  priceUnit: string; // USD/MT or IDR/MT
  currency: string;
  pricingBasis: PricingBasis;
  incoterm: "FOB" | "CIF" | "CFR" | "FOT" | "EXW";
  loadingPort: string;
  destination: string;
  startDate: string;
  endDate: string;
  paymentTerms: string;
  qualityTerms: string;
  penaltyTerms: string;
  status: ContractStatus;
  allocatedQuantity: number;
  scheduledQuantity: number;
  shippedQuantity: number;
  deliveredQuantity: number;
  remainingQuantity: number;
  fulfillmentPercent: number;
  createdBy: string;
  approvedBy?: string;
}

export type SalesProductType =
  | "THERMAL_COAL"
  | "COKING_COAL"
  | "RAW_COAL"
  | "WASHED_COAL"
  | "OTHER";

export interface CoalProduct extends BaseEntity {
  productId: string;
  companyId: string;
  productCode: string;
  productName: string;
  coalType: SalesProductType;
  qualitySpecificationId: string;
  defaultUnit: string;
  targetGAR: number;
  targetTM: number;
  targetAsh: number;
  targetTS: number;
  status: "ACTIVE" | "INACTIVE";
}

export type SalesOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "CONFIRMED"
  | "ALLOCATED"
  | "PARTIALLY_SHIPPED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface SalesOrder extends BaseEntity {
  salesOrderId: string;
  companyId: string;
  orderNumber: string; // e.g. SO-2026-0813-01
  customerId: string;
  customerName: string;
  contractId: string;
  contractNumber: string;
  productId: string;
  productName: string;
  quantity: number; // MT
  unit: string;
  price: number;
  currency: string;
  qualitySpecificationId: string;
  requestedShipmentDate: string;
  destinationId: string;
  destinationName: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: SalesOrderStatus;
  createdBy: string;
  approvedBy?: string;
}

export type AllocationStatus =
  | "PLANNED"
  | "RESERVED"
  | "CONFIRMED"
  | "RELEASED"
  | "CONSUMED"
  | "CANCELLED";

export interface SalesAllocation extends BaseEntity {
  allocationId: string;
  allocationCode: string; // e.g. ALC-2026-001
  salesOrderId: string;
  salesOrderNumber: string;
  contractId: string;
  stockpileId: string;
  stockpileName: string;
  productId: string;
  productName: string;
  allocatedQuantity: number; // MT
  qualitySnapshot: {
    gar: number;
    tm: number;
    ash: number;
    ts: number;
    basis: string;
  };
  plannedShipmentDate: string;
  status: AllocationStatus;
  createdBy: string;
  approvedBy?: string;
}

export type ShipmentStatus =
  | "PLANNED"
  | "SCHEDULED"
  | "READY_TO_LOAD"
  | "LOADING"
  | "LOADED"
  | "DEPARTED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "DELIVERED"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";

export type QualityComplianceStatus =
  | "COMPLIANT"
  | "WARNING"
  | "NON_COMPLIANT"
  | "PENDING_TEST";

export interface Shipment extends BaseEntity {
  shipmentId: string;
  shipmentNumber: string; // e.g. SHP-2026-0813-01
  companyId: string;
  customerId: string;
  customerName: string;
  contractId: string;
  contractNumber: string;
  salesOrderId: string;
  allocationId: string;
  productId: string;
  productName: string;
  quantity: number; // MT
  unit: string;
  loadingPort: string;
  destinationId: string;
  destinationName: string;
  vesselId: string;
  vesselName: string;
  vesselType: VesselType;
  shipmentDate: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  status: ShipmentStatus;
  qualityStatus: QualityComplianceStatus;
  deliveryStatus: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "DISPUTED";
  isQualityHold: boolean;
  holdReason?: string;
}

export type VesselType = "BULK_CARRIER" | "BARGE" | "TUG_BARGE" | "OTHER";

export interface Vessel extends BaseEntity {
  vesselId: string;
  vesselName: string;
  imoNumber: string;
  vesselType: VesselType;
  flag: string;
  owner: string;
  operator: string;
  capacity: number; // DWT or MT
  draft: number; // meters
  status: "AVAILABLE" | "ASSIGNED" | "LOADING" | "IN_TRANSIT" | "MAINTENANCE";
}

export interface DestinationPort extends BaseEntity {
  destinationId: string;
  destinationName: string;
  country: string;
  portName: string;
  portCode: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  loadingCapability: string;
  unloadingCapability: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface DeliveryRecord extends BaseEntity {
  deliveryId: string;
  deliveryCode: string; // e.g. DEL-2026-0813-01
  shipmentId: string;
  shipmentNumber: string;
  customerId: string;
  customerName: string;
  loadedQuantity: number;
  shippedQuantity: number;
  deliveredQuantity: number;
  receivedQuantity: number;
  shipmentVariance: number;
  deliveryVariance: number;
  deliveryDate: string;
  destinationName: string;
  receivedBy: string;
  proofOfDelivery: {
    documentName: string;
    receiptNo: string;
    timestamp: string;
    signatureUrl?: string;
    notes?: string;
  };
  status: "PENDING" | "IN_TRANSIT" | "ARRIVED" | "RECEIVED" | "PARTIAL" | "COMPLETED" | "DISPUTED";
  remarks?: string;
}

export interface SalesRevenue extends BaseEntity {
  revenueId: string;
  revenueCode: string; // e.g. REV-2026-0813-01
  companyId: string;
  customerId: string;
  customerName: string;
  contractId: string;
  contractNumber: string;
  salesOrderId: string;
  shipmentId: string;
  shipmentNumber: string;
  deliveryId?: string;
  quantity: number; // MT
  basePrice: number;
  currency: string; // USD or IDR
  pricingBasis: PricingBasis;
  gcvAdjustment: number;
  ashPenalty: number;
  sulfurPenalty: number;
  moisturePenalty: number;
  totalAdjustment: number;
  finalPrice: number;
  grossRevenue: number;
  netRevenue: number;
  invoiceReference?: string;
  status: "UNBILLED" | "INVOICED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "DISPUTED";
  revenueDate: string;
}

export interface SalesForecastPoint {
  period: string; // e.g., "Aug 2026", "Q3 2026"
  contractedQty: number;
  expectedShipmentQty: number;
  expectedDeliveryQty: number;
  expectedRevenue: number;
  remainingContractQty: number;
  forecastType: "ACTUAL" | "FORECAST" | "ESTIMATED";
}

export interface AISalesInsight {
  id: string;
  title: string;
  category: "CONTRACT_RISK" | "SHIPMENT_OPTIMIZATION" | "REVENUE_FORECAST" | "STOCK_MATCHING" | "QUALITY_COMPLIANCE";
  confidence: number;
  finding: string;
  evidence: {
    contractNumber?: string;
    customerName?: string;
    dataSources: string[];
    samplesAnalyzed?: number;
    keyMetrics: string[];
  };
  businessImpact: string;
  recommendation: string;
  expectedImpact: string;
  timestamp: string;
}

export interface CommercialDocument extends BaseEntity {
  documentId: string;
  documentCode: string;
  title: string;
  documentType: "SALES_CONTRACT" | "SALES_ORDER" | "COMMERCIAL_INVOICE" | "SHIPMENT_DOC" | "COA" | "PROOF_OF_DELIVERY";
  referenceType: "CONTRACT" | "ORDER" | "SHIPMENT" | "DELIVERY";
  referenceId: string;
  fileFormat: "PDF" | "DOCX" | "EXCEL";
  version: number;
  uploadedBy: string;
  approvedBy?: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
}

export interface SalesReportItem extends BaseEntity {
  reportId: string;
  reportCode: string;
  title: string;
  reportType: "DAILY_SALES" | "WEEKLY_SALES" | "MONTHLY_SALES" | "CONTRACT_PERFORMANCE" | "SHIPMENT_SUMMARY" | "REVENUE_RECON";
  period: string;
  generatedAt: string;
  generatedBy: string;
  format: "PDF" | "EXCEL" | "CSV";
  status: "READY" | "PROCESSING" | "FAILED";
}

export type PipelineStageKey = "contract" | "production" | "stock" | "shipment" | "revenue";

export interface PipelineStageMetric {
  stageKey: PipelineStageKey;
  stageName: string;
  stageSubtitle: string;
  volumeMT: number;
  valueUSD: number;
  conversionPercent: number;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  leadTimeDays: number;
  keyDrivers: { label: string; value: string; trend?: "UP" | "DOWN" | "NEUTRAL" }[];
  activeItemsCount: number;
}

export interface QuantityMassBalanceRecord {
  id: string;
  shipmentNumber: string;
  contractNumber: string;
  customerName: string;
  vesselName: string;
  destinationName: string;
  productName: string;
  targetGAR: number;
  contractQuantityMT: number;
  allocatedStockMT: number;
  conveyorBeltScaleMT: number;
  draftSurveyLoadedMT: number;
  destinationDraftSurveyMT: number;
  varianceMT: number;
  variancePercent: number;
  reconciliationStatus: "MATCHED" | "WITHIN_TOLERANCE" | "DISPUTE_EXCEEDED";
  surveyorName: string;
  date: string;
}

export interface CoalPriceIndex {
  indexCode: "ICI_3" | "ICI_4" | "NEWCASTLE" | "HBA" | "GCV_5800";
  indexName: string;
  currentPriceUSD: number;
  changeWeeklyUSD: number;
  changePercent: number;
  calorificBasis: string;
  updateDate: string;
}
