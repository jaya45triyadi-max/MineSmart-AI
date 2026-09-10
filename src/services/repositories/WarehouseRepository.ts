// MINE SMART AI - Warehouse & Inventory Repository

import { BaseRepository } from "./BaseRepository";
import {
  Warehouse,
  StorageLocation,
  InventoryItem,
  StockBalance,
  StockMovement,
  GoodsIssueRequest,
  StockTransfer,
  StockOpnameSession,
  StockOpnameItem,
  ReorderRecommendation,
  WarehouseKPISummary,
  WarehouseAIInsight,
} from "../../types/warehouseTypes";
import { auditRepository } from "./AuditRepository";

// Initial Warehouses
const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-001",
    warehouseId: "wh-001",
    warehouseCode: "WH-MAIN-SITE-A",
    warehouseName: "Central Logistics & Spare Parts Warehouse",
    companyId: "comp-001",
    siteId: "site-001",
    siteName: "Site A - Pit North Balikpapan",
    warehouseType: "MAIN",
    address: "Area Logistics Block 4, Pit North Site A",
    managerId: "USR-WH-01",
    managerName: "Hendra Gunawan",
    status: "ACTIVE",
    capacitySqM: 3500,
    utilizedPct: 78.5,
    createdAt: "2025-01-15 08:00:00",
    updatedAt: "2026-08-01 10:00:00",
  },
  {
    id: "wh-002",
    warehouseId: "wh-002",
    warehouseCode: "WH-WKSHP-SITE-A",
    warehouseName: "Workshop & Heavy Equipment Spare Parts Depot",
    companyId: "comp-001",
    siteId: "site-001",
    siteName: "Site A - Pit North Balikpapan",
    warehouseType: "SPARE_PARTS",
    address: "Workshop Heavy Duty Area 2, Site A",
    managerId: "USR-WH-02",
    managerName: "Budi Santoso",
    status: "ACTIVE",
    capacitySqM: 1800,
    utilizedPct: 84.2,
    createdAt: "2025-02-01 08:00:00",
    updatedAt: "2026-08-02 11:30:00",
  },
  {
    id: "wh-003",
    warehouseId: "wh-003",
    warehouseCode: "WH-LUB-SITE-A",
    warehouseName: "Fuel, Oil & Chemical Storage Depot",
    companyId: "comp-001",
    siteId: "site-001",
    siteName: "Site A - Pit North Balikpapan",
    warehouseType: "FUEL",
    address: "Fuel Farm Zone B, Site A",
    managerId: "USR-WH-03",
    managerName: "Agus Pratama",
    status: "ACTIVE",
    capacitySqM: 2500,
    utilizedPct: 65.0,
    createdAt: "2025-02-10 08:00:00",
    updatedAt: "2026-08-05 09:00:00",
  },
  {
    id: "wh-004",
    warehouseId: "wh-004",
    warehouseCode: "WH-PPE-SITE-A",
    warehouseName: "HSE Safety Gear & Consumables Store",
    companyId: "comp-001",
    siteId: "site-001",
    siteName: "Site A - Pit North Balikpapan",
    warehouseType: "PPE",
    address: "HSE Building Ground Floor, Site A",
    managerId: "USR-WH-04",
    managerName: "Dewi Lestari",
    status: "ACTIVE",
    capacitySqM: 600,
    utilizedPct: 52.0,
    createdAt: "2025-03-01 08:00:00",
    updatedAt: "2026-08-08 14:00:00",
  },
];

// Initial Locations
const INITIAL_LOCATIONS: StorageLocation[] = [
  { id: "loc-1", locationId: "loc-1", warehouseId: "wh-001", warehouseName: "Central Logistics Warehouse", zone: "Zone A - Heavy Components", rack: "R-01", shelf: "S-02", bin: "B-01", locationCode: "WH1-ZA-R01-S02-B01", capacityQty: 100, currentOccupancyQty: 45, status: "AVAILABLE" },
  { id: "loc-2", locationId: "loc-2", warehouseId: "wh-001", warehouseName: "Central Logistics Warehouse", zone: "Zone A - Heavy Components", rack: "R-01", shelf: "S-02", bin: "B-02", locationCode: "WH1-ZA-R01-S02-B02", capacityQty: 100, currentOccupancyQty: 30, status: "AVAILABLE" },
  { id: "loc-3", locationId: "loc-3", warehouseId: "wh-002", warehouseName: "Workshop Spare Parts Depot", zone: "Zone B - Hydraulics", rack: "R-04", shelf: "S-01", bin: "B-05", locationCode: "WH2-ZB-R04-S01-B05", capacityQty: 50, currentOccupancyQty: 12, status: "AVAILABLE" },
  { id: "loc-4", locationId: "loc-4", warehouseId: "wh-003", warehouseName: "Fuel & Oil Storage Depot", zone: "Zone L - Lubricants Tank", rack: "R-00", shelf: "S-00", bin: "TANK-01", locationCode: "WH3-ZL-TANK01", capacityQty: 200, currentOccupancyQty: 160, status: "FULL" },
  { id: "loc-5", locationId: "loc-5", warehouseId: "wh-004", warehouseName: "HSE Safety Gear Store", zone: "Zone S - PPE Gear", rack: "R-02", shelf: "S-03", bin: "B-12", locationCode: "WH4-ZS-R02-S03-B12", capacityQty: 500, currentOccupancyQty: 250, status: "AVAILABLE" },
];

// Initial Items Master
const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: "itm-001",
    itemId: "itm-001",
    itemCode: "ITM-HYD-1025",
    sku: "SKU-HIT-FLT-001",
    itemName: "Hydraulic Return Filter Element PC1250",
    description: "High efficiency hydraulic filter element for Komatsu/Hitachi 120t Excavator main pump return line.",
    categoryId: "cat-1",
    categoryName: "Spare Parts",
    subcategoryId: "sub-hyd",
    itemType: "SPARE_PART",
    unit: "PCS",
    brand: "Komatsu Genuine",
    model: "PC1250-8 / EX1200",
    partNumber: "208-60-71120",
    oemNumber: "OEM-KM-2086071120",
    manufacturer: "Komatsu Ltd",
    serialTracking: false,
    batchTracking: true,
    barcode: "880192837401",
    qrCode: "QR-ITM-HYD-1025",
    minimumStock: 8,
    maximumStock: 40,
    reorderPoint: 12,
    reorderQuantity: 20,
    leadTimeDays: 14,
    criticality: "CRITICAL",
    status: "ACTIVE",
    unitCostIDR: 4250000,
    compatibleEquipment: ["Komatsu PC1250-8", "Hitachi EX1200-6"],
    defaultWarehouseId: "wh-002",
    defaultLocationCode: "WH2-ZB-R04-S01-B05",
    createdAt: "2025-01-10 09:00:00",
    updatedAt: "2026-08-01 10:00:00",
  },
  {
    id: "itm-002",
    itemId: "itm-002",
    itemCode: "ITM-TYR-2749",
    sku: "SKU-BCT-TYR-2749",
    itemName: "Haul Truck Tyre 27.00R49 E4",
    description: "Tubeless radial tyre for 90-ton Caterpillar 777 Off-Highway Haul Trucks.",
    categoryId: "cat-4",
    categoryName: "Tyres",
    subcategoryId: "sub-tyr",
    itemType: "SPARE_PART",
    unit: "PCS",
    brand: "Bridgestone V-Steel",
    model: "VRPS 27.00R49",
    partNumber: "TYR-BS-2700R49-E4",
    oemNumber: "CAT-521-9988",
    manufacturer: "Bridgestone Corporation",
    serialTracking: true,
    batchTracking: true,
    barcode: "880192837402",
    qrCode: "QR-ITM-TYR-2749",
    minimumStock: 6,
    maximumStock: 24,
    reorderPoint: 10,
    reorderQuantity: 12,
    leadTimeDays: 21,
    criticality: "CRITICAL",
    status: "ACTIVE",
    unitCostIDR: 185000000,
    compatibleEquipment: ["CAT 777D", "CAT 777E", "Komatsu HD785-7"],
    defaultWarehouseId: "wh-001",
    defaultLocationCode: "WH1-ZA-R01-S02-B01",
    createdAt: "2025-01-12 10:00:00",
    updatedAt: "2026-08-05 11:00:00",
  },
  {
    id: "itm-003",
    itemId: "itm-003",
    itemCode: "ITM-LUB-15W40",
    sku: "SKU-SHL-OIL-15W40",
    itemName: "Heavy Duty Engine Oil Shell Rimula R4 X 15W-40 (Drum 209L)",
    description: "Premium multigrade heavy duty diesel engine oil for mining equipment fleet.",
    categoryId: "cat-3",
    categoryName: "Lubricants",
    subcategoryId: "sub-lub",
    itemType: "CONSUMABLE",
    unit: "DRUM",
    brand: "Shell Rimula",
    model: "R4 X 15W-40",
    partNumber: "SHL-RIM-R4X-209L",
    manufacturer: "PT Shell Indonesia",
    serialTracking: false,
    batchTracking: true,
    barcode: "880192837403",
    qrCode: "QR-ITM-LUB-15W40",
    minimumStock: 15,
    maximumStock: 80,
    reorderPoint: 25,
    reorderQuantity: 30,
    leadTimeDays: 7,
    criticality: "HIGH",
    status: "ACTIVE",
    unitCostIDR: 11200000,
    compatibleEquipment: ["Komatsu PC1250-8", "CAT 777D", "Scania P410", "Volvo FMX440"],
    defaultWarehouseId: "wh-003",
    defaultLocationCode: "WH3-ZL-TANK01",
    createdAt: "2025-01-15 11:00:00",
    updatedAt: "2026-08-08 09:30:00",
  },
  {
    id: "itm-004",
    itemId: "itm-004",
    itemCode: "ITM-GET-BCK01",
    sku: "SKU-GET-TOOTH-PC1250",
    itemName: "Excavator Bucket Tooth Rock Chisel PC1250",
    description: "Heavy duty forged alloy excavator bucket teeth for abrasive coal & overburden excavation.",
    categoryId: "cat-1",
    categoryName: "Spare Parts",
    subcategoryId: "sub-get",
    itemType: "SPARE_PART",
    unit: "PCS",
    brand: "Hensley GET",
    model: "XS115 / PC1250",
    partNumber: "XS115RC-RC1250",
    manufacturer: "Hensley Industries",
    serialTracking: false,
    batchTracking: false,
    barcode: "880192837404",
    qrCode: "QR-ITM-GET-BCK01",
    minimumStock: 20,
    maximumStock: 100,
    reorderPoint: 35,
    reorderQuantity: 50,
    leadTimeDays: 10,
    criticality: "HIGH",
    status: "ACTIVE",
    unitCostIDR: 2850000,
    compatibleEquipment: ["Komatsu PC1250-8", "Hitachi EX1200-6"],
    defaultWarehouseId: "wh-002",
    defaultLocationCode: "WH2-ZB-R04-S01-B05",
    createdAt: "2025-01-20 08:00:00",
    updatedAt: "2026-08-10 16:00:00",
  },
  {
    id: "itm-005",
    itemId: "itm-005",
    itemCode: "ITM-PPE-RES02",
    sku: "SKU-3M-RESP-6200",
    itemName: "3M Half Facepiece Respirator 6200 + P100 Dust Filter Cartridge",
    description: "Coal dust safety respiratory mask for pit operators & crusher plant staff.",
    categoryId: "cat-5",
    categoryName: "PPE",
    subcategoryId: "sub-ppe",
    itemType: "CONSUMABLE",
    unit: "SET",
    brand: "3M Safety",
    model: "6200 Medium + 2091 P100",
    partNumber: "3M-6200-P100",
    manufacturer: "3M Indonesia",
    serialTracking: false,
    batchTracking: false,
    barcode: "880192837405",
    qrCode: "QR-ITM-PPE-RES02",
    minimumStock: 50,
    maximumStock: 300,
    reorderPoint: 80,
    reorderQuantity: 100,
    leadTimeDays: 5,
    criticality: "MEDIUM",
    status: "ACTIVE",
    unitCostIDR: 385000,
    compatibleEquipment: [],
    defaultWarehouseId: "wh-004",
    defaultLocationCode: "WH4-ZS-R02-S03-B12",
    createdAt: "2025-02-01 10:00:00",
    updatedAt: "2026-08-12 13:00:00",
  },
  {
    id: "itm-006",
    itemId: "itm-006",
    itemCode: "ITM-ENG-INJ01",
    sku: "SKU-CAT-INJ-777",
    itemName: "Fuel Injector Unit CAT 3508B / 3512B Engine",
    description: "Precision diesel fuel injector for Caterpillar 3500 series haul truck engine.",
    categoryId: "cat-1",
    categoryName: "Spare Parts",
    subcategoryId: "sub-eng",
    itemType: "SPARE_PART",
    unit: "PCS",
    brand: "Caterpillar OEM",
    model: "CAT 3508B",
    partNumber: "254-4339",
    manufacturer: "Caterpillar Inc",
    serialTracking: true,
    batchTracking: false,
    barcode: "880192837406",
    qrCode: "QR-ITM-ENG-INJ01",
    minimumStock: 6,
    maximumStock: 24,
    reorderPoint: 8,
    reorderQuantity: 12,
    leadTimeDays: 20,
    criticality: "CRITICAL",
    status: "ACTIVE",
    unitCostIDR: 14500000,
    compatibleEquipment: ["CAT 777D", "CAT 777E"],
    defaultWarehouseId: "wh-002",
    defaultLocationCode: "WH2-ZB-R04-S01-B05",
    createdAt: "2025-02-15 09:00:00",
    updatedAt: "2026-08-11 10:00:00",
  },
];

// Initial Stock Balances
const INITIAL_STOCK_BALANCES: StockBalance[] = [
  {
    id: "stk-001",
    stockId: "stk-001",
    itemId: "itm-001",
    itemCode: "ITM-HYD-1025",
    itemName: "Hydraulic Return Filter Element PC1250",
    categoryName: "Spare Parts",
    unit: "PCS",
    partNumber: "208-60-71120",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    locationId: "loc-3",
    locationCode: "WH2-ZB-R04-S01-B05",
    onHand: 12,
    reserved: 4,
    available: 8,
    inTransit: 10,
    damaged: 0,
    quarantine: 0,
    unitCostIDR: 4250000,
    stockValueIDR: 51000000,
    status: "LOW_STOCK",
    lastMovementAt: "2026-08-12 14:20:00",
    batchNumber: "BAT-HYD-2026-07",
    criticality: "CRITICAL",
  },
  {
    id: "stk-002",
    stockId: "stk-002",
    itemId: "itm-002",
    itemCode: "ITM-TYR-2749",
    itemName: "Haul Truck Tyre 27.00R49 E4",
    categoryName: "Tyres",
    unit: "PCS",
    partNumber: "TYR-BS-2700R49-E4",
    warehouseId: "wh-001",
    warehouseName: "Central Logistics Warehouse",
    locationId: "loc-1",
    locationCode: "WH1-ZA-R01-S02-B01",
    onHand: 14,
    reserved: 2,
    available: 12,
    inTransit: 0,
    damaged: 1,
    quarantine: 0,
    unitCostIDR: 185000000,
    stockValueIDR: 2590000000,
    status: "IN_STOCK",
    lastMovementAt: "2026-08-10 11:15:00",
    batchNumber: "BS-TYR-2026-02",
    serialNumbers: ["BS-TYR-2026-001", "BS-TYR-2026-002", "BS-TYR-2026-003"],
    criticality: "CRITICAL",
  },
  {
    id: "stk-003",
    stockId: "stk-003",
    itemId: "itm-003",
    itemCode: "ITM-LUB-15W40",
    itemName: "Heavy Duty Engine Oil Shell Rimula R4 X 15W-40 (Drum 209L)",
    categoryName: "Lubricants",
    unit: "DRUM",
    partNumber: "SHL-RIM-R4X-209L",
    warehouseId: "wh-003",
    warehouseName: "Fuel & Oil Storage Depot",
    locationId: "loc-4",
    locationCode: "WH3-ZL-TANK01",
    onHand: 48,
    reserved: 6,
    available: 42,
    inTransit: 20,
    damaged: 0,
    quarantine: 0,
    unitCostIDR: 11200000,
    stockValueIDR: 537600000,
    status: "IN_STOCK",
    lastMovementAt: "2026-08-13 09:00:00",
    batchNumber: "SHL-DRM-2026-05",
    criticality: "HIGH",
  },
  {
    id: "stk-004",
    stockId: "stk-004",
    itemId: "itm-004",
    itemCode: "ITM-GET-BCK01",
    itemName: "Excavator Bucket Tooth Rock Chisel PC1250",
    categoryName: "Spare Parts",
    unit: "PCS",
    partNumber: "XS115RC-RC1250",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    locationId: "loc-3",
    locationCode: "WH2-ZB-R04-S01-B05",
    onHand: 42,
    reserved: 10,
    available: 32,
    inTransit: 0,
    damaged: 0,
    quarantine: 0,
    unitCostIDR: 2850000,
    stockValueIDR: 119700000,
    status: "IN_STOCK",
    lastMovementAt: "2026-08-11 16:45:00",
    criticality: "HIGH",
  },
  {
    id: "stk-005",
    stockId: "stk-005",
    itemId: "itm-005",
    itemCode: "ITM-PPE-RES02",
    itemName: "3M Half Facepiece Respirator 6200 + P100 Dust Filter Cartridge",
    categoryName: "PPE",
    unit: "SET",
    partNumber: "3M-6200-P100",
    warehouseId: "wh-004",
    warehouseName: "HSE Safety Gear Store",
    locationId: "loc-5",
    locationCode: "WH4-ZS-R02-S03-B12",
    onHand: 140,
    reserved: 15,
    available: 125,
    inTransit: 0,
    damaged: 0,
    quarantine: 0,
    unitCostIDR: 385000,
    stockValueIDR: 53900000,
    status: "IN_STOCK",
    lastMovementAt: "2026-08-12 13:10:00",
    criticality: "MEDIUM",
  },
  {
    id: "stk-006",
    stockId: "stk-006",
    itemId: "itm-006",
    itemCode: "ITM-ENG-INJ01",
    itemName: "Fuel Injector Unit CAT 3508B / 3512B Engine",
    categoryName: "Spare Parts",
    unit: "PCS",
    partNumber: "254-4339",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    locationId: "loc-3",
    locationCode: "WH2-ZB-R04-S01-B05",
    onHand: 5,
    reserved: 2,
    available: 3,
    inTransit: 6,
    damaged: 0,
    quarantine: 0,
    unitCostIDR: 14500000,
    stockValueIDR: 72500000,
    status: "LOW_STOCK",
    lastMovementAt: "2026-08-09 10:00:00",
    serialNumbers: ["INJ-CAT-9901", "INJ-CAT-9902", "INJ-CAT-9903"],
    criticality: "CRITICAL",
  },
];

// Initial Stock Movements Ledger
const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: "mvt-001",
    movementId: "mvt-001",
    movementNumber: "MVT-2026-0801-01",
    itemId: "itm-001",
    itemCode: "ITM-HYD-1025",
    itemName: "Hydraulic Return Filter Element PC1250",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    locationCode: "WH2-ZB-R04-S01-B05",
    quantity: 10,
    unit: "PCS",
    movementType: "GOODS_RECEIPT",
    referenceType: "PO",
    referenceId: "PO-2026-0810-01",
    userId: "USR-WH-02",
    userName: "Budi Santoso",
    timestamp: "2026-08-01 10:15:00",
    reason: "Penerimaan PO Pengadaan Sparepart Hexindo",
    unitCostIDR: 4250000,
    totalValueIDR: 42500000,
    balanceAfter: 16,
  },
  {
    id: "mvt-002",
    movementId: "mvt-002",
    movementNumber: "MVT-2026-0805-02",
    itemId: "itm-001",
    itemCode: "ITM-HYD-1025",
    itemName: "Hydraulic Return Filter Element PC1250",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    locationCode: "WH2-ZB-R04-S01-B05",
    quantity: -4,
    unit: "PCS",
    movementType: "GOODS_ISSUE",
    referenceType: "WORK_ORDER",
    referenceId: "WO-PM-2026-102",
    userId: "USR-MNT-01",
    userName: "Agus Rahmat (Maint Tech)",
    timestamp: "2026-08-05 14:30:00",
    reason: "Periodic Maintenance 250 Hours Excavator EX-012 (Komatsu PC1250)",
    unitCostIDR: 4250000,
    totalValueIDR: -17000000,
    balanceAfter: 12,
  },
  {
    id: "mvt-003",
    movementId: "mvt-003",
    movementNumber: "MVT-2026-0810-03",
    itemId: "itm-002",
    itemCode: "ITM-TYR-2749",
    itemName: "Haul Truck Tyre 27.00R49 E4",
    warehouseId: "wh-001",
    warehouseName: "Central Logistics Warehouse",
    locationCode: "WH1-ZA-R01-S02-B01",
    quantity: 4,
    unit: "PCS",
    movementType: "GOODS_RECEIPT",
    referenceType: "PO",
    referenceId: "PO-2026-0808-02",
    userId: "USR-WH-01",
    userName: "Hendra Gunawan",
    timestamp: "2026-08-10 11:15:00",
    reason: "Penerimaan PO Ban Tambang Bridgestone",
    unitCostIDR: 185000000,
    totalValueIDR: 740000000,
    balanceAfter: 14,
  },
  {
    id: "mvt-004",
    movementId: "mvt-004",
    movementNumber: "MVT-2026-0813-04",
    itemId: "itm-003",
    itemCode: "ITM-LUB-15W40",
    itemName: "Heavy Duty Engine Oil Shell Rimula R4 X 15W-40 (Drum 209L)",
    warehouseId: "wh-003",
    warehouseName: "Fuel & Oil Storage Depot",
    locationCode: "WH3-ZL-TANK01",
    quantity: -2,
    unit: "DRUM",
    movementType: "GOODS_ISSUE",
    referenceType: "WORK_ORDER",
    referenceId: "WO-PM-2026-118",
    userId: "USR-MNT-02",
    userName: "Wahyu Hidayat",
    timestamp: "2026-08-13 09:00:00",
    reason: "Engine Oil Replacement Haul Truck HT-05 (CAT 777D)",
    unitCostIDR: 11200000,
    totalValueIDR: -22400000,
    balanceAfter: 48,
  },
];

// Initial Goods Issue Requests
const INITIAL_ISSUE_REQUESTS: GoodsIssueRequest[] = [
  {
    id: "gi-001",
    issueRequestId: "gi-001",
    issueNumber: "GI-REQ-2026-0801",
    requesterId: "USR-ENG-05",
    requesterName: "Bambang Tri (Plant Mechanical Supv)",
    departmentId: "DEPT-MAINT",
    departmentName: "Plant & Equipment Maintenance",
    siteId: "site-001",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    purpose: "Pengantian Filter Hidrolik Breakdown Excavator EX-015",
    equipmentId: "EQ-EXC-1250-015",
    equipmentCode: "EX-015",
    workOrderId: "WO-EMG-2026-089",
    priority: "EMERGENCY",
    status: "APPROVED",
    items: [
      { itemId: "itm-001", itemCode: "ITM-HYD-1025", itemName: "Hydraulic Return Filter Element PC1250", requestedQty: 2, issuedQty: 2, unit: "PCS", unitCostIDR: 4250000, totalCostIDR: 8500000, locationCode: "WH2-ZB-R04-S01-B05" },
    ],
    approvedBy: "Hendra Gunawan (Warehouse Mgr)",
    approvedAt: "2026-08-12 09:00:00",
    createdAt: "2026-08-12 08:30:00",
    updatedAt: "2026-08-12 09:00:00",
  },
  {
    id: "gi-002",
    issueRequestId: "gi-002",
    issueNumber: "GI-REQ-2026-0802",
    requesterId: "USR-HSE-02",
    requesterName: "Siti Rahma (HSE Officer)",
    departmentId: "DEPT-HSE",
    departmentName: "Health, Safety & Environment",
    siteId: "site-001",
    warehouseId: "wh-004",
    warehouseName: "HSE Safety Gear Store",
    purpose: "Distribusi Masker Respirator APD Tim Crusher Plant & Pit Safety Inspection",
    priority: "NORMAL",
    status: "ISSUED",
    items: [
      { itemId: "itm-005", itemCode: "ITM-PPE-RES02", itemName: "3M Half Facepiece Respirator 6200", requestedQty: 25, issuedQty: 25, unit: "SET", unitCostIDR: 385000, totalCostIDR: 9625000, locationCode: "WH4-ZS-R02-S03-B12" },
    ],
    approvedBy: "Dewi Lestari",
    approvedAt: "2026-08-11 11:00:00",
    issuedBy: "Dewi Lestari",
    issuedAt: "2026-08-11 11:30:00",
    createdAt: "2026-08-11 10:15:00",
    updatedAt: "2026-08-11 11:30:00",
  },
];

// Initial Stock Transfers
const INITIAL_TRANSFERS: StockTransfer[] = [
  {
    id: "trf-001",
    transferId: "trf-001",
    transferNumber: "TRF-2026-0801",
    fromWarehouseId: "wh-001",
    fromWarehouseName: "Central Logistics Warehouse",
    toWarehouseId: "wh-002",
    toWarehouseName: "Workshop Spare Parts Depot",
    requestedBy: "Budi Santoso (Workshop Mgr)",
    approvedBy: "Hendra Gunawan",
    dispatchedAt: "2026-08-10 14:00:00",
    status: "IN_TRANSIT",
    items: [
      { itemId: "itm-001", itemCode: "ITM-HYD-1025", itemName: "Hydraulic Return Filter Element PC1250", requestedQty: 10, transferredQty: 10, receivedQty: 0, unit: "PCS", unitCostIDR: 4250000 },
    ],
    notes: "Transfer rutin stok buffer filter hidrolik untuk workshop",
    createdAt: "2026-08-10 09:00:00",
    updatedAt: "2026-08-10 14:00:00",
  },
];

// Initial Stock Opname
const INITIAL_OPNAME_SESSIONS: StockOpnameSession[] = [
  {
    id: "opn-001",
    opnameId: "opn-001",
    opnameNumber: "SO-2026-07-SITEA",
    warehouseId: "wh-002",
    warehouseName: "Workshop Spare Parts Depot",
    siteId: "site-001",
    countDate: "2026-07-30",
    countType: "CRITICAL_SPARE",
    createdBy: "Hendra Gunawan",
    assignedTeam: ["Budi Santoso", "Agus Rahmat"],
    status: "APPROVED",
    totalItemsCounted: 45,
    itemsWithVarianceCount: 2,
    totalSystemValueIDR: 850000000,
    totalPhysicalValueIDR: 845750000,
    totalVarianceValueIDR: -4250000,
    approvedBy: "Kurniawan (Finance Mgr)",
    approvedAt: "2026-07-31 16:00:00",
    notes: "Stock opname bulanan sparepart kritis workshop. Terdapat selisih 1 pcs filter hidrolik terpakai belum terinput WO.",
    createdAt: "2026-07-30 08:00:00",
    updatedAt: "2026-07-31 16:00:00",
  },
];

const INITIAL_AI_INSIGHTS: WarehouseAIInsight[] = [
  {
    id: "ai-wh-01",
    title: "Estimasi Risiko Stockout Filter Hidrolik (Komatsu PC1250)",
    finding: "Stok tersedia (8 pcs) berada di bawah Reorder Point (12 pcs) dengan tren konsumsi naik 25% minggu ini.",
    evidence: "On Hand: 12 pcs, Reserved: 4 pcs, Available: 8 pcs. Konsumsi Rata-rata: 3.5 pcs/minggu. PO outstanding: 10 pcs dalam perjalanan (ETA 3 hari).",
    trend: "Konsumsi naik akibat peningkatan jam kerja Excavator EX-012 dan EX-015 pasca cuaca cerah di Pit North.",
    cause: "Frekuensi maintenance berkala PM 250H bersamaan pada 2 unit heavy excavator.",
    risk: "Breakdown unit PC1250 bernilai loss prod $12,500/jam jika stok habis saat krisis hidrolik.",
    recommendation: "Lakukan expedited tracking untuk PO-2026-0810-01 dan alokasikan buffer temporary dari WH Central.",
    expectedImpact: "Mencegah potensi downtime 18 jam bernilai ~Rp 350 Juta.",
    confidencePct: 94,
    category: "STOCKOUT_PREDICTION",
    createdAt: "2026-08-13 08:00:00",
  },
  {
    id: "ai-wh-02",
    title: "Deteksi Overstock & Slow Moving Sparepart Pompa De-watering",
    finding: "Terdapat 15 unit Impeller Shaft Pompa Flygt di WH Main tanpa ada pergerakan selama >180 hari.",
    evidence: "Stock Value: Rp 180,000,000. Terakhir bergerak: 14 Februari 2026.",
    trend: "Stagnan sejak proyek dewatering sump B selesai.",
    cause: "Pengadaan berlebih saat musim hujan ekstrim awal tahun 2026.",
    risk: "Penumpukan modal kerja (working capital tie-up) dan potensi depresiasi suku cadang.",
    recommendation: "Evaluasi transfer antar site ke Site B Samarinda yang sedang melakukan expansi dewatering.",
    expectedImpact: "Optimasi cashflow & efisiensi nilai gudang hingga Rp 180 Juta.",
    confidencePct: 89,
    category: "DEAD_STOCK",
    createdAt: "2026-08-12 10:30:00",
  },
];

export class WarehouseRepository extends BaseRepository<any> {
  private whKey = "mine_smart_ai_warehouses";
  private locKey = "mine_smart_ai_storage_locations";
  private itemKey = "mine_smart_ai_inventory_items";
  private stockKey = "mine_smart_ai_stock_balances";
  private movementKey = "mine_smart_ai_stock_movements";
  private issueKey = "mine_smart_ai_goods_issue_requests";
  private transferKey = "mine_smart_ai_stock_transfers";
  private opnameKey = "mine_smart_ai_stock_opname_sessions";
  private insightKey = "mine_smart_ai_warehouse_insights";

  constructor() {
    super("mine_smart_ai_warehouse_meta");
  }

  // --- WAREHOUSES ---
  async getWarehouses(): Promise<Warehouse[]> {
    const raw = localStorage.getItem(this.whKey);
    if (!raw) {
      localStorage.setItem(this.whKey, JSON.stringify(INITIAL_WAREHOUSES));
      return INITIAL_WAREHOUSES;
    }
    return JSON.parse(raw);
  }

  async saveWarehouse(wh: Warehouse): Promise<Warehouse> {
    const list = await this.getWarehouses();
    const idx = list.findIndex((w) => w.warehouseId === wh.warehouseId);
    if (idx >= 0) {
      list[idx] = { ...wh, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
    } else {
      list.push({ ...wh, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
    }
    localStorage.setItem(this.whKey, JSON.stringify(list));
    await auditRepository.logAction("SAVE_WAREHOUSE", "WAREHOUSE", wh.warehouseId, { name: wh.warehouseName });
    return wh;
  }

  // --- STORAGE LOCATIONS ---
  async getLocations(): Promise<StorageLocation[]> {
    const raw = localStorage.getItem(this.locKey);
    if (!raw) {
      localStorage.setItem(this.locKey, JSON.stringify(INITIAL_LOCATIONS));
      return INITIAL_LOCATIONS;
    }
    return JSON.parse(raw);
  }

  async getStorageLocations(): Promise<StorageLocation[]> {
    return this.getLocations();
  }

  async saveLocation(loc: StorageLocation): Promise<StorageLocation> {
    const list = await this.getLocations();
    const idx = list.findIndex((l) => l.locationId === loc.locationId);
    if (idx >= 0) list[idx] = loc;
    else list.push(loc);
    localStorage.setItem(this.locKey, JSON.stringify(list));
    return loc;
  }

  async saveStorageLocation(loc: StorageLocation): Promise<StorageLocation> {
    return this.saveLocation(loc);
  }

  // --- ITEM MASTER ---
  async getItems(): Promise<InventoryItem[]> {
    const raw = localStorage.getItem(this.itemKey);
    if (!raw) {
      localStorage.setItem(this.itemKey, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  }

  async saveItem(item: InventoryItem): Promise<InventoryItem> {
    const list = await this.getItems();
    const idx = list.findIndex((i) => i.itemId === item.itemId);
    if (idx >= 0) {
      list[idx] = { ...item, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
    } else {
      list.push({ ...item, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
    }
    localStorage.setItem(this.itemKey, JSON.stringify(list));
    await auditRepository.logAction("SAVE_ITEM", "INVENTORY_ITEM", item.itemId, { code: item.itemCode, name: item.itemName });
    return item;
  }

  // --- STOCK BALANCES ---
  async getStockBalances(): Promise<StockBalance[]> {
    const raw = localStorage.getItem(this.stockKey);
    if (!raw) {
      localStorage.setItem(this.stockKey, JSON.stringify(INITIAL_STOCK_BALANCES));
      return INITIAL_STOCK_BALANCES;
    }
    return JSON.parse(raw);
  }

  async saveStockBalance(stock: StockBalance): Promise<StockBalance> {
    const list = await this.getStockBalances();
    const idx = list.findIndex((s) => s.stockId === stock.stockId);
    stock.available = Math.max(0, stock.onHand - stock.reserved);
    stock.stockValueIDR = stock.onHand * stock.unitCostIDR;

    // recalculate status
    if (stock.onHand === 0) stock.status = "OUT_OF_STOCK";
    else if (stock.available <= 10) stock.status = "LOW_STOCK";
    else stock.status = "IN_STOCK";

    if (idx >= 0) list[idx] = stock;
    else list.push(stock);

    localStorage.setItem(this.stockKey, JSON.stringify(list));
    return stock;
  }

  // --- STOCK MOVEMENTS LEDGER ---
  async getMovementLedger(): Promise<StockMovement[]> {
    const raw = localStorage.getItem(this.movementKey);
    if (!raw) {
      localStorage.setItem(this.movementKey, JSON.stringify(INITIAL_MOVEMENTS));
      return INITIAL_MOVEMENTS;
    }
    return JSON.parse(raw);
  }

  async getStockMovements(): Promise<StockMovement[]> {
    return this.getMovementLedger();
  }

  async recordStockMovement(mvt: Omit<StockMovement, "id" | "movementId" | "movementNumber" | "timestamp" | "totalValueIDR" | "balanceAfter">): Promise<StockMovement> {
    const movements = await this.getMovementLedger();
    const balances = await this.getStockBalances();

    let targetStock = balances.find((s) => s.itemId === mvt.itemId && s.warehouseId === mvt.warehouseId);
    if (!targetStock) {
      // create stock entry
      targetStock = {
        id: `stk-${Date.now()}`,
        stockId: `stk-${Date.now()}`,
        itemId: mvt.itemId,
        itemCode: mvt.itemCode,
        itemName: mvt.itemName,
        categoryName: "Spare Parts",
        unit: mvt.unit,
        partNumber: "-",
        warehouseId: mvt.warehouseId,
        warehouseName: mvt.warehouseName,
        locationId: mvt.locationId || "loc-1",
        locationCode: mvt.locationCode || "DEFAULT-LOC",
        onHand: 0,
        reserved: 0,
        available: 0,
        inTransit: 0,
        damaged: 0,
        quarantine: 0,
        unitCostIDR: mvt.unitCostIDR,
        stockValueIDR: 0,
        status: "OUT_OF_STOCK",
        lastMovementAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        criticality: "MEDIUM",
      };
    }

    // Apply quantity to stock balance
    targetStock.onHand = Math.max(0, targetStock.onHand + mvt.quantity);
    targetStock.available = Math.max(0, targetStock.onHand - targetStock.reserved);
    targetStock.stockValueIDR = targetStock.onHand * targetStock.unitCostIDR;
    targetStock.lastMovementAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    if (targetStock.onHand === 0) targetStock.status = "OUT_OF_STOCK";
    else if (targetStock.available <= 10) targetStock.status = "LOW_STOCK";
    else targetStock.status = "IN_STOCK";

    await this.saveStockBalance(targetStock);

    const newMovement: StockMovement = {
      ...mvt,
      id: `mvt-${Date.now()}`,
      movementId: `mvt-${Date.now()}`,
      movementNumber: `MVT-${new Date().toISOString().substring(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      totalValueIDR: Math.abs(mvt.quantity) * mvt.unitCostIDR,
      balanceAfter: targetStock.onHand,
    };

    movements.unshift(newMovement);
    localStorage.setItem(this.movementKey, JSON.stringify(movements));

    await auditRepository.logAction("STOCK_MOVEMENT", "INVENTORY", newMovement.movementNumber, {
      type: newMovement.movementType,
      item: newMovement.itemCode,
      qty: newMovement.quantity,
      warehouse: newMovement.warehouseName,
    });

    return newMovement;
  }

  async recordMovement(mvt: Omit<StockMovement, "id" | "movementId" | "movementNumber" | "timestamp" | "totalValueIDR" | "balanceAfter">): Promise<StockMovement> {
    return this.recordStockMovement(mvt);
  }

  // --- GOODS ISSUE REQUESTS ---
  async getGoodsIssueRequests(): Promise<GoodsIssueRequest[]> {
    const raw = localStorage.getItem(this.issueKey);
    if (!raw) {
      localStorage.setItem(this.issueKey, JSON.stringify(INITIAL_ISSUE_REQUESTS));
      return INITIAL_ISSUE_REQUESTS;
    }
    return JSON.parse(raw);
  }

  async saveGoodsIssueRequest(req: GoodsIssueRequest): Promise<GoodsIssueRequest> {
    const list = await this.getGoodsIssueRequests();
    const idx = list.findIndex((i) => i.issueRequestId === req.issueRequestId);
    if (idx >= 0) {
      list[idx] = { ...req, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
    } else {
      list.push({ ...req, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
    }
    localStorage.setItem(this.issueKey, JSON.stringify(list));
    return req;
  }

  async approveGoodsIssueRequest(requestId: string, approverName: string): Promise<GoodsIssueRequest> {
    const list = await this.getGoodsIssueRequests();
    const req = list.find((i) => i.issueRequestId === requestId || i.id === requestId);
    if (!req) throw new Error("Goods Issue Request not found");

    req.status = "APPROVED";
    req.approvedBy = approverName;
    req.approvedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    req.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    await this.saveGoodsIssueRequest(req);
    return req;
  }

  async fulfillGoodsIssue(requestId: string, issuerName: string): Promise<GoodsIssueRequest> {
    const list = await this.getGoodsIssueRequests();
    const req = list.find((i) => i.issueRequestId === requestId || i.id === requestId);
    if (!req) throw new Error("Goods Issue Request not found");

    // deduct stock balance via ledger
    for (const item of req.items) {
      await this.recordStockMovement({
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        warehouseId: req.warehouseId,
        warehouseName: req.warehouseName,
        locationCode: item.locationCode || "WH2-ZB-R04-S01-B05",
        quantity: -item.requestedQty,
        unit: item.unit,
        movementType: "GOODS_ISSUE",
        referenceType: req.workOrderId ? "WORK_ORDER" : "MANUAL",
        referenceId: req.workOrderId || req.issueNumber,
        userId: req.requesterId,
        userName: issuerName,
        reason: req.purpose,
        unitCostIDR: item.unitCostIDR,
      });
      item.issuedQty = item.requestedQty;
    }

    req.status = "ISSUED";
    req.issuedBy = issuerName;
    req.issuedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    req.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    await this.saveGoodsIssueRequest(req);
    return req;
  }

  async fulfillGoodsIssueRequest(requestId: string, issuerName: string): Promise<GoodsIssueRequest> {
    return this.fulfillGoodsIssue(requestId, issuerName);
  }

  // --- STOCK TRANSFERS ---
  async getTransfers(): Promise<StockTransfer[]> {
    const raw = localStorage.getItem(this.transferKey);
    if (!raw) {
      localStorage.setItem(this.transferKey, JSON.stringify(INITIAL_TRANSFERS));
      return INITIAL_TRANSFERS;
    }
    return JSON.parse(raw);
  }

  async saveTransfer(trf: StockTransfer): Promise<StockTransfer> {
    const list = await this.getTransfers();
    const idx = list.findIndex((t) => t.transferId === trf.transferId);
    if (idx >= 0) {
      list[idx] = { ...trf, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
    } else {
      list.push({ ...trf, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
    }
    localStorage.setItem(this.transferKey, JSON.stringify(list));
    return trf;
  }

  async dispatchTransfer(transferId: string, approverName: string): Promise<StockTransfer> {
    const list = await this.getTransfers();
    const trf = list.find((t) => t.transferId === transferId || t.id === transferId);
    if (!trf) throw new Error("Transfer not found");

    for (const item of trf.items) {
      await this.recordStockMovement({
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        warehouseId: trf.fromWarehouseId,
        warehouseName: trf.fromWarehouseName,
        quantity: -item.transferredQty,
        unit: item.unit,
        movementType: "TRANSFER_OUT",
        referenceType: "TRANSFER",
        referenceId: trf.transferNumber,
        userId: "USR-WH-01",
        userName: approverName,
        reason: `Transfer Keluar ke ${trf.toWarehouseName}`,
        unitCostIDR: item.unitCostIDR,
      });
    }

    trf.status = "IN_TRANSIT";
    trf.approvedBy = approverName;
    trf.dispatchedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    trf.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    await this.saveTransfer(trf);
    return trf;
  }

  async receiveTransfer(transferId: string, receiverName: string): Promise<StockTransfer> {
    const list = await this.getTransfers();
    const trf = list.find((t) => t.transferId === transferId || t.id === transferId);
    if (!trf) throw new Error("Transfer not found");

    for (const item of trf.items) {
      item.receivedQty = item.transferredQty;
      await this.recordStockMovement({
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        warehouseId: trf.toWarehouseId,
        warehouseName: trf.toWarehouseName,
        quantity: item.transferredQty,
        unit: item.unit,
        movementType: "TRANSFER_IN",
        referenceType: "TRANSFER",
        referenceId: trf.transferNumber,
        userId: "USR-WH-02",
        userName: receiverName,
        reason: `Transfer Masuk dari ${trf.fromWarehouseName}`,
        unitCostIDR: item.unitCostIDR,
      });
    }

    trf.status = "RECEIVED";
    trf.receivedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    trf.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    await this.saveTransfer(trf);
    return trf;
  }

  // --- STOCK OPNAME SESSIONS ---
  async getOpnameSessions(): Promise<StockOpnameSession[]> {
    const raw = localStorage.getItem(this.opnameKey);
    if (!raw) {
      localStorage.setItem(this.opnameKey, JSON.stringify(INITIAL_OPNAME_SESSIONS));
      return INITIAL_OPNAME_SESSIONS;
    }
    return JSON.parse(raw);
  }

  async saveOpnameSession(session: StockOpnameSession): Promise<StockOpnameSession> {
    const list = await this.getOpnameSessions();
    const idx = list.findIndex((s) => s.opnameId === session.opnameId);
    if (idx >= 0) {
      list[idx] = { ...session, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
    } else {
      list.push({ ...session, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
    }
    localStorage.setItem(this.opnameKey, JSON.stringify(list));
    return session;
  }

  // --- REORDER ENGINE ---
  async getReorderRecommendations(): Promise<ReorderRecommendation[]> {
    const items = await this.getItems();
    const stocks = await this.getStockBalances();

    const recommendations: ReorderRecommendation[] = [];

    for (const item of items) {
      // Find total available stock across warehouses
      const itemStocks = stocks.filter((s) => s.itemId === item.itemId);
      const totalOnHand = itemStocks.reduce((sum, s) => sum + s.onHand, 0);
      const totalReserved = itemStocks.reduce((sum, s) => sum + s.reserved, 0);
      const totalInTransit = itemStocks.reduce((sum, s) => sum + s.inTransit, 0);
      const totalAvailable = Math.max(0, totalOnHand - totalReserved);

      // Trigger condition: Available + InTransit <= ReorderPoint
      if (totalAvailable + totalInTransit <= item.reorderPoint) {
        const recommendedQty = item.reorderQuantity > 0 ? item.reorderQuantity : Math.max(1, item.maximumStock - totalAvailable);
        const urgency: "CRITICAL" | "HIGH" | "MEDIUM" = totalAvailable === 0 ? "CRITICAL" : item.criticality === "CRITICAL" ? "HIGH" : "MEDIUM";

        recommendations.push({
          id: `rec-${item.itemId}`,
          recommendationId: `rec-${item.itemId}`,
          itemId: item.itemId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          categoryName: item.categoryName,
          currentStock: totalOnHand,
          reservedStock: totalReserved,
          availableStock: totalAvailable,
          openPOQuantity: totalInTransit,
          reorderPoint: item.reorderPoint,
          minimumStock: item.minimumStock,
          maximumStock: item.maximumStock,
          recommendedQty,
          leadTimeDays: item.leadTimeDays,
          criticality: item.criticality,
          estimatedUnitCostIDR: item.unitCostIDR,
          totalEstimatedCostIDR: recommendedQty * item.unitCostIDR,
          supplierName: "PT Hexindo Adiperkasa Tbk",
          urgencyStatus: urgency,
          generatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        });
      }
    }

    return recommendations;
  }

  // --- KPI SUMMARY ---
  async getKPISummary(): Promise<WarehouseKPISummary> {
    const items = await this.getItems();
    const stocks = await this.getStockBalances();
    const issues = await this.getGoodsIssueRequests();
    const transfers = await this.getTransfers();
    const opnames = await this.getOpnameSessions();
    const reorders = await this.getReorderRecommendations();

    const totalStockValueIDR = stocks.reduce((sum, s) => sum + s.stockValueIDR, 0);
    const lowStockItems = stocks.filter((s) => s.status === "LOW_STOCK").length;
    const outOfStockItems = stocks.filter((s) => s.status === "OUT_OF_STOCK").length;
    const overstockItems = stocks.filter((s) => s.onHand > 100).length;

    const pendingGoodsIssue = issues.filter((i) => i.status === "SUBMITTED" || i.status === "APPROVED").length;
    const pendingTransfer = transfers.filter((t) => t.status === "REQUESTED" || t.status === "IN_TRANSIT").length;
    const pendingStockOpname = opnames.filter((o) => o.status === "IN_PROGRESS" || o.status === "PENDING_APPROVAL").length;

    const criticalSpareCount = items.filter((i) => i.criticality === "CRITICAL").length;

    return {
      totalItems: items.length,
      activeItems: items.filter((i) => i.status === "ACTIVE").length,
      totalStockValueIDR,
      lowStockItems,
      outOfStockItems,
      overstockItems,
      pendingReceivingPO: 2, // From procurement POs in transit
      pendingGoodsIssue,
      pendingTransfer,
      pendingStockOpname,
      reorderRequiredCount: reorders.length,
      criticalSpareCount,
      deadStockValueIDR: 180000000,
      stockAccuracyPct: 98.4,
      inventoryTurnoverRatio: 4.8,
      warehouseUtilizationPct: 75.2,
    };
  }

  // --- AI INSIGHTS ---
  async getAIInsights(): Promise<WarehouseAIInsight[]> {
    const raw = localStorage.getItem(this.insightKey);
    if (!raw) {
      localStorage.setItem(this.insightKey, JSON.stringify(INITIAL_AI_INSIGHTS));
      return INITIAL_AI_INSIGHTS;
    }
    return JSON.parse(raw);
  }
}

export const warehouseRepository = new WarehouseRepository();
