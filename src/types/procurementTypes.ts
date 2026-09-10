// MINE SMART AI - Procurement & Purchasing Management Types

import { BaseEntity } from "./index";

export type PRPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT" | "CRITICAL";

export type PRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "PARTIALLY_PROCESSED"
  | "FULLY_PROCESSED";

export type RFQStatus =
  | "DRAFT"
  | "OPEN"
  | "SENT"
  | "RESPONSES_RECEIVED"
  | "CLOSED"
  | "EVALUATION"
  | "AWARDED"
  | "CANCELLED";

export type VendorStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "INACTIVE";

export type VendorCategory =
  | "Equipment"
  | "Spare Parts"
  | "Fuel"
  | "Tyres"
  | "Lubricants"
  | "Mining Supplies"
  | "Safety Equipment"
  | "PPE"
  | "IT"
  | "Construction"
  | "Transportation"
  | "Services"
  | "Consulting"
  | "Contractor"
  | "Heavy Equipment Parts"
  | "Excavator Parts"
  | "Truck Parts"
  | "Hydraulic Components"
  | "Electrical Components"
  | "Mining Consumables"
  | "Plant Spare Parts"
  | "Workshop Supplies"
  | "Survey Equipment"
  | "Laboratory Supplies"
  | "Environmental Equipment"
  | "Reclamation Supplies"
  | "Other";

export type VendorHSEStatus = "COMPLIANT" | "NON_COMPLIANT" | "PENDING" | "EXPIRED";

export interface VendorDocument {
  id: string;
  documentType:
    | "Company Document"
    | "Tax Document"
    | "Business License"
    | "Bank Document"
    | "Certification"
    | "HSE Document"
    | "Insurance"
    | "Contract"
    | "Other";
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  attachment?: string;
  verificationStatus: "VERIFIED" | "PENDING" | "EXPIRED" | "REJECTED";
}

export type QuotationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type POStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "SENT"
  | "ACKNOWLEDGED"
  | "PARTIALLY_RECEIVED"
  | "FULLY_RECEIVED"
  | "CLOSED"
  | "CANCELLED";

export type DeliveryStatus =
  | "EXPECTED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "PARTIALLY_RECEIVED"
  | "FULLY_RECEIVED"
  | "REJECTED"
  | "CANCELLED";

export type InspectionResult = "PASSED" | "FAILED" | "PARTIAL" | "PENDING";

export type InvoiceStatus =
  | "RECEIVED"
  | "UNDER_REVIEW"
  | "MATCHED"
  | "MISMATCH"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

export type MatchingStatus = "MATCHED" | "PARTIAL_MATCH" | "MISMATCH";

export interface PurchaseRequestItem {
  itemId: string;
  prId: string;
  itemCode: string;
  itemName: string;
  description: string;
  category: VendorCategory | string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  requiredDate: string;
  warehouseId?: string;
  projectId?: string;
  costCenterId?: string;
  equipmentId?: string;
  workOrderId?: string;
  specification?: string;
  notes?: string;
}

export interface PurchaseRequest extends BaseEntity {
  prId: string;
  prNumber: string;
  companyId: string;
  siteId: string;
  departmentId: string;
  departmentName?: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  requiredDate: string;
  priority: PRPriority;
  purpose: string;
  category: string;
  budgetId?: string;
  budgetCode?: string;
  status: PRStatus;
  approvalStatus: string;
  estimatedValue: number;
  currency: string;
  notes?: string;
  attachments?: string[];
  items: PurchaseRequestItem[];
  currentApprover?: string;
  approvalChain?: Array<{ step: number; role: string; name?: string; status: "PENDING" | "APPROVED" | "REJECTED"; timestamp?: string; comment?: string }>;
}

export interface RFQItem {
  rfqItemId: string;
  rfqId: string;
  prItemId: string;
  itemCode: string;
  itemName: string;
  specification: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  deliveryLocation: string;
}

export interface RFQ extends BaseEntity {
  rfqId: string;
  rfqNumber: string;
  companyId: string;
  siteId: string;
  prId: string;
  prNumber: string;
  issueDate: string;
  closingDate: string;
  currency: string;
  deliveryLocation: string;
  paymentTerms: string;
  deliveryTerms: string;
  status: RFQStatus;
  notes?: string;
  attachments?: string[];
  items: RFQItem[];
  invitedVendorIds: string[];
  invitedVendors?: Array<{ vendorId: string; vendorName: string; invitationStatus: "INVITED" | "VIEWED" | "RESPONDED" | "DECLINED" | "EXPIRED"; responseDate?: string }>;
}

export interface VendorContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export interface Vendor extends BaseEntity {
  vendorId: string;
  vendorCode: string;
  legalName: string;
  tradeName: string;
  vendorType: string;
  category: VendorCategory;
  address: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  taxInformation?: string;
  bankInformationReference?: string;
  contactPersons: VendorContactPerson[];
  status: VendorStatus;
  rating: number; // 1-5
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  hseComplianceStatus: VendorHSEStatus;
  documents: VendorDocument[];
  performanceMetrics?: {
    onTimeDeliveryRate: number; // percentage e.g. 94.2
    qualityAcceptanceRate: number; // percentage e.g. 98.5
    averageLeadTimeDays: number;
    priceCompetitivenessScore: number;
  };
  tags?: string[];
}

export interface QuotationItem {
  quotationItemId: string;
  quotationId: string;
  rfqItemId: string;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  subtotal: number;
  total: number;
  leadTimeDays: number;
  brand?: string;
  model?: string;
  warranty?: string;
  notes?: string;
}

export interface Quotation extends BaseEntity {
  quotationId: string;
  quotationNumber: string;
  rfqId: string;
  rfqNumber: string;
  vendorId: string;
  vendorName: string;
  quotationDate: string;
  validUntil: string;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  leadTimeDays: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  subtotal: number;
  grandTotal: number;
  status: QuotationStatus;
  attachments?: string[];
  items: QuotationItem[];
  validationWarnings?: string[];
  technicalScore?: number;
  priceScore?: number;
  totalScore?: number;
}

export interface QuotationComparison {
  comparisonId: string;
  rfqId: string;
  rfqNumber: string;
  prNumber: string;
  comparisonDate: string;
  evaluatorName: string;
  quotations: Quotation[];
  criterionWeights: {
    price: number;
    quality: number;
    leadTime: number;
    paymentTerms: number;
    hse: number;
  };
  selectedVendorId?: string;
  selectedQuotationId?: string;
  selectionJustification?: string;
  status: "DRAFT" | "EVALUATED" | "APPROVED";
}

export interface POItem {
  poItemId: string;
  poId: string;
  prItemId?: string;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  subtotal: number;
  expectedDeliveryDate: string;
  warehouseId?: string;
  costCenterId?: string;
  equipmentId?: string;
}

export interface PORevision {
  revisionNumber: number;
  changedBy: string;
  changeDate: string;
  changeReason: string;
  previousGrandTotal: number;
  newGrandTotal: number;
}

export interface PurchaseOrder extends BaseEntity {
  poId: string;
  poNumber: string;
  companyId: string;
  siteId: string;
  vendorId: string;
  vendorName: string;
  prId?: string;
  prNumber?: string;
  rfqId?: string;
  quotationId?: string;
  poDate: string;
  deliveryDate: string;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  shippingAddress: string;
  billingAddress: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  grandTotal: number;
  status: POStatus;
  approvalStatus: string;
  createdBy: string;
  approvedBy?: string;
  notes?: string;
  items: POItem[];
  currentRevision: number;
  revisionHistory: PORevision[];
  receivedQtySummary?: {
    ordered: number;
    received: number;
    percentage: number;
  };
}

export interface ReceivingItem {
  receivingItemId: string;
  receiptId: string;
  poItemId: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  deliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  remainingQty: number;
  unit: string;
  unitPrice: number;
  warehouseId: string;
  notes?: string;
}

export interface GoodsReceipt extends BaseEntity {
  receiptId: string;
  receiptNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  warehouseId: string;
  warehouseName: string;
  siteId: string;
  receivedDate: string;
  receivedBy: string;
  deliveryReference: string; // Surated Jalan No / Delivery Note No
  driverName?: string;
  vehiclePlateNo?: string;
  status: DeliveryStatus;
  notes?: string;
  attachments?: string[];
  items: ReceivingItem[];
  inspectionRequired: boolean;
  inspectionStatus?: InspectionResult;
}

export interface QualityInspection {
  inspectionId: string;
  receiptId: string;
  receiptNumber: string;
  poNumber: string;
  inspectionDate: string;
  inspectorName: string;
  itemCode: string;
  itemName: string;
  specification: string;
  result: InspectionResult;
  acceptedQty: number;
  rejectedQty: number;
  rejectionReason?: string;
  attachments?: string[];
}

export interface InvoiceItem {
  invoiceItemId: string;
  invoiceId: string;
  poItemId?: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Invoice extends BaseEntity {
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  poId: string;
  poNumber: string;
  receiptId?: string;
  receiptNumber?: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  grandTotal: number;
  status: InvoiceStatus;
  matchingStatus: MatchingStatus;
  matchingDiscrepancies?: string[];
  duplicateRisk?: boolean;
  attachments?: string[];
}

export interface PriceHistoryRecord {
  id: string;
  itemCode: string;
  itemName: string;
  category: VendorCategory | string;
  vendorId: string;
  vendorName: string;
  poNumber: string;
  poDate: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  currency: string;
  priceVariancePct?: number; // variance vs historical average
  notes?: string;
}

export interface DeliveryPerformanceRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  poNumber: string;
  receiptNumber: string;
  expectedDate: string;
  actualDate: string;
  leadTimeDaysPromised: number;
  leadTimeDaysActual: number;
  varianceDays: number; // positive = delay, negative = early
  onTimeStatus: "ON_TIME" | "EARLY" | "DELAYED" | "CRITICAL_DELAY";
  defectCount: number;
  totalReceivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  deliveryRating: number; // 1-5
  notes?: string;
}

export interface ProcurementContract extends BaseEntity {
  contractId: string;
  contractNumber: string;
  contractType?: "LTA_CONTRACT" | "BLANKET_PO" | "CONSIGNMENT" | "SERVICE_AGREEMENT";
  vendorId: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  value: number;
  utilizedValue?: number;
  currency: string;
  scope: string;
  category: VendorCategory | string;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "TERMINATED";
  paymentTerms?: string;
  slaTerms?: string;
  attachments?: string[];
}

export interface CatalogItem {
  itemCode: string;
  itemName: string;
  category: VendorCategory | string;
  specification: string;
  unit: string;
  preferredVendorId: string;
  preferredVendorName: string;
  lastPurchasePrice: number;
  avgPurchasePrice: number;
  leadTimeDays: number;
  stockAvailable?: number;
  minStockLevel?: number;
}

export interface ProcurementKPISummary {
  totalPR: number;
  pendingPR: number;
  approvedPR: number;
  rejectedPR: number;
  openRFQ: number;
  pendingQuotation: number;
  pendingComparison: number;
  pendingApproval: number;
  openPO: number;
  poValueIDR: number;
  pendingDelivery: number;
  partialDelivery: number;
  overdueDelivery: number;
  pendingInvoice: number;
  invoiceValueIDR: number;
  vendorCount: number;
  savingsTotalIDR: number;
  onTimeDeliveryRatePct: number;
  avgCycleTimeDays: number;
  threeWayMatchRatePct: number;
}

export interface ProcurementAIInsight {
  id: string;
  type: "DELIVERY_RISK" | "PRICE_VARIANCE" | "VENDOR_PERFORMANCE" | "DEMAND_FORECAST" | "BUDGET_EXCEEDED" | "DUPLICATE_INVOICE";
  title: string;
  finding: string;
  evidence: string;
  trend: string;
  possibleCause: string;
  risk: string;
  recommendation: string;
  expectedImpact: string;
  confidence: "High" | "Medium" | "Low";
  date: string;
  entityRef?: string;
}
