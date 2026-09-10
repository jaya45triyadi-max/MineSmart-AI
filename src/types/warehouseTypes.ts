// MINE SMART AI - Warehouse & Inventory Management Types

export type WarehouseType =
  | "MAIN"
  | "SPARE_PARTS"
  | "FUEL"
  | "PPE"
  | "WORKSHOP"
  | "CONSUMABLE"
  | "TEMPORARY"
  | "OTHER";

export type LocationStatus =
  | "AVAILABLE"
  | "FULL"
  | "BLOCKED"
  | "MAINTENANCE"
  | "INACTIVE";

export type ItemCriticality = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ItemCategory =
  | "Spare Parts"
  | "Consumables"
  | "Lubricants"
  | "Tyres"
  | "PPE"
  | "Electrical"
  | "Hydraulic"
  | "Mechanical"
  | "Workshop Tools"
  | "Mining Supplies"
  | "Office Supplies"
  | "IT Equipment"
  | "Environmental Supplies"
  | "Reclamation Supplies"
  | "Laboratory Supplies"
  | "Fuel & Oils"
  | "Other";

export type StockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "OVERSTOCK"
  | "QUARANTINE"
  | "DAMAGED"
  | "BLOCKED";

export type MovementType =
  | "GOODS_RECEIPT"
  | "GOODS_ISSUE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "RETURN"
  | "REJECT"
  | "DAMAGE"
  | "QUARANTINE"
  | "RELEASE";

export type IssueStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "PICKING"
  | "ISSUED"
  | "PARTIAL"
  | "REJECTED"
  | "CANCELLED";

export type TransferStatus =
  | "DRAFT"
  | "REQUESTED"
  | "APPROVED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "CANCELLED";

export type OpnameType =
  | "FULL"
  | "CYCLE_COUNT"
  | "CATEGORY"
  | "LOCATION"
  | "CRITICAL_SPARE"
  | "RANDOM";

export type OpnameStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CANCELLED";

// 1. Warehouse Master
export interface Warehouse {
  id: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  companyId: string;
  siteId: string;
  siteName: string;
  warehouseType: WarehouseType;
  address: string;
  managerId: string;
  managerName: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  capacitySqM: number;
  utilizedPct: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Storage Location
export interface StorageLocation {
  id: string;
  locationId: string;
  warehouseId: string;
  warehouseName: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  locationCode: string; // e.g. "WH1-Z-A-R02-S03-B01"
  capacityQty: number;
  currentOccupancyQty: number;
  status: LocationStatus;
}

// 3. Inventory Item
export interface InventoryItem {
  id: string;
  itemId: string;
  itemCode: string;
  sku: string;
  itemName: string;
  description: string;
  categoryId: string;
  categoryName: ItemCategory;
  subcategoryId?: string;
  itemType: string; // e.g. "SPARE_PART", "CONSUMABLE", "ASSET"
  unit: string; // e.g. "PCS", "LITER", "DRUM", "SET"
  brand: string;
  model: string;
  partNumber: string;
  oemNumber?: string;
  manufacturer: string;
  serialTracking: boolean;
  batchTracking: boolean;
  barcode: string;
  qrCode: string;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTimeDays: number;
  criticality: ItemCriticality;
  status: "ACTIVE" | "DISCONTINUED" | "OBSOLETE";
  unitCostIDR: number;
  compatibleEquipment: string[]; // e.g. ["Komatsu PC1250-8", "CAT 777D", "Scania P410"]
  defaultWarehouseId?: string;
  defaultLocationCode?: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Stock Balance
export interface StockBalance {
  id: string;
  stockId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  categoryName: ItemCategory;
  unit: string;
  partNumber: string;
  warehouseId: string;
  warehouseName: string;
  locationId: string;
  locationCode: string;
  onHand: number;
  reserved: number;
  available: number; // Formula: onHand - reserved
  inTransit: number;
  damaged: number;
  quarantine: number;
  unitCostIDR: number;
  stockValueIDR: number; // Formula: onHand * unitCostIDR
  status: StockStatus;
  lastMovementAt: string;
  batchNumber?: string;
  expiryDate?: string;
  serialNumbers?: string[];
  criticality: ItemCriticality;
}

// 5. Stock Movement Ledger
export interface StockMovement {
  id: string;
  movementId: string;
  movementNumber: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  locationCode?: string;
  quantity: number;
  unit: string;
  movementType: MovementType;
  referenceType: "PO" | "WORK_ORDER" | "TRANSFER" | "OPNAME" | "ADJUSTMENT" | "MANUAL" | "RETURN";
  referenceId: string;
  userId: string;
  userName: string;
  timestamp: string;
  reason: string;
  unitCostIDR: number;
  totalValueIDR: number;
  balanceAfter: number;
}

// 6. Goods Issue Request
export interface GoodsIssueItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  requestedQty: number;
  issuedQty: number;
  unit: string;
  unitCostIDR: number;
  totalCostIDR: number;
  locationCode?: string;
}

export interface GoodsIssueRequest {
  id: string;
  issueRequestId: string;
  issueNumber: string;
  requesterId: string;
  requesterName: string;
  departmentId: string;
  departmentName: string;
  siteId: string;
  warehouseId: string;
  warehouseName: string;
  purpose: string;
  equipmentId?: string;
  equipmentCode?: string;
  workOrderId?: string;
  priority: "EMERGENCY" | "HIGH" | "NORMAL";
  status: IssueStatus;
  items: GoodsIssueItem[];
  approvedBy?: string;
  approvedAt?: string;
  issuedBy?: string;
  issuedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 7. Stock Transfer
export interface StockTransferItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  requestedQty: number;
  transferredQty: number;
  receivedQty: number;
  unit: string;
  unitCostIDR: number;
}

export interface StockTransfer {
  id: string;
  transferId: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  requestedBy: string;
  approvedBy?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  status: TransferStatus;
  items: StockTransferItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 8. Stock Opname Session & Items
export interface StockOpnameItem {
  id: string;
  opnameItemId: string;
  opnameId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  locationCode: string;
  systemQty: number;
  physicalQty: number;
  variance: number; // physicalQty - systemQty
  variancePct: number;
  unit: string;
  unitCostIDR: number;
  varianceValueIDR: number;
  counterName: string;
  notes?: string;
  status: "PENDING" | "MATCHED" | "VARIANCE_APPROVED" | "REJECTED";
}

export interface StockOpnameSession {
  id: string;
  opnameId: string;
  opnameNumber: string;
  warehouseId: string;
  warehouseName: string;
  siteId: string;
  countDate: string;
  countType: OpnameType;
  createdBy: string;
  assignedTeam: string[];
  status: OpnameStatus;
  totalItemsCounted: number;
  itemsWithVarianceCount: number;
  totalSystemValueIDR: number;
  totalPhysicalValueIDR: number;
  totalVarianceValueIDR: number;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 9. Reorder Recommendation
export interface ReorderRecommendation {
  id: string;
  recommendationId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  categoryName: ItemCategory;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  openPOQuantity: number;
  reorderPoint: number;
  minimumStock: number;
  maximumStock: number;
  recommendedQty: number;
  leadTimeDays: number;
  criticality: ItemCriticality;
  estimatedUnitCostIDR: number;
  totalEstimatedCostIDR: number;
  supplierId?: string;
  supplierName?: string;
  urgencyStatus: "CRITICAL" | "HIGH" | "MEDIUM";
  generatedAt: string;
}

// 10. KPI Summary
export interface WarehouseKPISummary {
  totalItems: number;
  activeItems: number;
  totalStockValueIDR: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  pendingReceivingPO: number;
  pendingGoodsIssue: number;
  pendingTransfer: number;
  pendingStockOpname: number;
  reorderRequiredCount: number;
  criticalSpareCount: number;
  deadStockValueIDR: number;
  stockAccuracyPct: number;
  inventoryTurnoverRatio: number;
  warehouseUtilizationPct: number;
}

// 11. AI Insights
export interface WarehouseAIInsight {
  id: string;
  title: string;
  finding: string;
  evidence: string;
  trend: string;
  cause: string;
  risk: string;
  recommendation: string;
  expectedImpact: string;
  confidencePct: number;
  category: "STOCKOUT_PREDICTION" | "REORDER_OPTIMIZATION" | "DEAD_STOCK" | "ABNORMAL_CONSUMPTION" | "CRITICAL_SPARE";
  createdAt: string;
}
