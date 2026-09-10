// MINE SMART AI - Comprehensive Finance & Cost Control Repository
import { BaseRepository } from "./BaseRepository";
import {
  ChartOfAccount,
  CostCenter,
  JournalEntry,
  RevenueRecord,
  AccountsReceivable,
  AccountsPayable,
  OpexRecord,
  CapexRequest,
  FixedAsset,
  BudgetRecord,
  CashFlowRecord,
  MiningCostModel,
  EquipmentCostDetail,
  FinancialPeriod,
  FinanceKPISummary,
  AIFinanceInsight,
  FinanceTaxCode,
  CurrencyRate,
  JournalLine,
} from "../../types/financeTypes";

// Initial Chart of Accounts
const INITIAL_COA: ChartOfAccount[] = [
  // ASSETS (1000)
  { id: "COA-1000", accountId: "COA-1000", accountCode: "1000", accountName: "ASET LANCAR", accountType: "ASSET", level: 1, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1110", accountId: "COA-1110", accountCode: "1110", accountName: "Kas & Bank Utama", accountType: "ASSET", parentAccountId: "COA-1000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1120", accountId: "COA-1120", accountCode: "1120", accountName: "Piutang Usaha (AR - Coal Sales)", accountType: "ASSET", parentAccountId: "COA-1000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1130", accountId: "COA-1130", accountCode: "1130", accountName: "Persediaan Batubara (ROM & Clean Coal)", accountType: "ASSET", parentAccountId: "COA-1000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1140", accountId: "COA-1140", accountCode: "1140", accountName: "Persediaan Sparepart & Fuel", accountType: "ASSET", parentAccountId: "COA-1000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1200", accountId: "COA-1200", accountCode: "1200", accountName: "ASET TETAP", accountType: "ASSET", level: 1, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1210", accountId: "COA-1210", accountCode: "1210", accountName: "Alat Berat & Fleet Mining", accountType: "ASSET", parentAccountId: "COA-1200", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1220", accountId: "COA-1220", accountCode: "1220", accountName: "Processing Plant & Crusher", accountType: "ASSET", parentAccountId: "COA-1200", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-1290", accountId: "COA-1290", accountCode: "1290", accountName: "Akumulasi Penyusutan Aset Tetap", accountType: "ASSET", parentAccountId: "COA-1200", level: 2, normalBalance: "CREDIT", isActive: true },

  // LIABILITIES (2000)
  { id: "COA-2000", accountId: "COA-2000", accountCode: "2000", accountName: "KEWAJIBAN", accountType: "LIABILITY", level: 1, normalBalance: "CREDIT", isActive: true },
  { id: "COA-2110", accountId: "COA-2110", accountCode: "2110", accountName: "Hutang Usaha (AP - Vendors & Contractors)", accountType: "LIABILITY", parentAccountId: "COA-2000", level: 2, normalBalance: "CREDIT", isActive: true },
  { id: "COA-2120", accountId: "COA-2120", accountCode: "2120", accountName: "Hutang Pajak & Royalti Tambang", accountType: "LIABILITY", parentAccountId: "COA-2000", level: 2, normalBalance: "CREDIT", isActive: true },
  { id: "COA-2130", accountId: "COA-2130", accountCode: "2130", accountName: "Beban Yang Masih Harus Dibayar", accountType: "LIABILITY", parentAccountId: "COA-2000", level: 2, normalBalance: "CREDIT", isActive: true },

  // EQUITY (3000)
  { id: "COA-3000", accountId: "COA-3000", accountCode: "3000", accountName: "EKUITAS", accountType: "EQUITY", level: 1, normalBalance: "CREDIT", isActive: true },
  { id: "COA-3100", accountId: "COA-3100", accountCode: "3100", accountName: "Modal Disetor", accountType: "EQUITY", parentAccountId: "COA-3000", level: 2, normalBalance: "CREDIT", isActive: true },
  { id: "COA-3200", accountId: "COA-3200", accountCode: "3200", accountName: "Laba Ditahan", accountType: "EQUITY", parentAccountId: "COA-3000", level: 2, normalBalance: "CREDIT", isActive: true },

  // REVENUE (4000)
  { id: "COA-4000", accountId: "COA-4000", accountCode: "4000", accountName: "PENDAPATAN", accountType: "REVENUE", level: 1, normalBalance: "CREDIT", isActive: true },
  { id: "COA-4110", accountId: "COA-4110", accountCode: "4110", accountName: "Penjualan Batubara Domestik (PLN / Smelter)", accountType: "REVENUE", parentAccountId: "COA-4000", level: 2, normalBalance: "CREDIT", isActive: true },
  { id: "COA-4120", accountId: "COA-4120", accountCode: "4120", accountName: "Penjualan Batubara Ekspor (FOB / CIF)", accountType: "REVENUE", parentAccountId: "COA-4000", level: 2, normalBalance: "CREDIT", isActive: true },

  // OPERATING EXPENSES & COST OF GOODS SOLD (5000)
  { id: "COA-5000", accountId: "COA-5000", accountCode: "5000", accountName: "BIAYA OPERASIONAL TAMBANG (OPEX)", accountType: "EXPENSE", level: 1, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5100", accountId: "COA-5100", accountCode: "5100", accountName: "Biaya Bahan Bakar Fuel (B35 Diesel)", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5200", accountId: "COA-5200", accountCode: "5200", accountName: "Biaya Maintenance & Spare Parts Fleet", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5300", accountId: "COA-5300", accountCode: "5300", accountName: "Biaya Tenaga Kerja & Gaji Operator", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5400", accountId: "COA-5400", accountCode: "5400", accountName: "Biaya Contractor Mining & Hauling", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5500", accountId: "COA-5500", accountCode: "5500", accountName: "Biaya Processing & Crusher Plant", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5600", accountId: "COA-5600", accountCode: "5600", accountName: "Biaya HSE, Lingkungan & Reklamasi", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5700", accountId: "COA-5700", accountCode: "5700", accountName: "Biaya Umum, Admin & General Overhead", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
  { id: "COA-5800", accountId: "COA-5800", accountCode: "5800", accountName: "Beban Penyusutan Aset Tetap", accountType: "EXPENSE", parentAccountId: "COA-5000", level: 2, normalBalance: "DEBIT", isActive: true },
];

// Initial Cost Centers
const INITIAL_COST_CENTERS: CostCenter[] = [
  { id: "CC-MIN-01", costCenterId: "CC-MIN-01", code: "CC-MINING-PITA", name: "Pit A Operation & Stripping", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-MINING", departmentName: "Mining Production", managerId: "USR-001", managerName: "Ir. Hendra Wijaya", status: "ACTIVE" },
  { id: "CC-MIN-02", costCenterId: "CC-MIN-02", code: "CC-MINING-PITB", name: "Pit B Operation & Coal Winning", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-MINING", departmentName: "Mining Production", managerId: "USR-001", managerName: "Ir. Hendra Wijaya", status: "ACTIVE" },
  { id: "CC-HAUL-01", costCenterId: "CC-HAUL-01", code: "CC-HAULING-ROAD", name: "Coal Hauling & Road Maintenance", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-DISPATCH", departmentName: "Logistics & Dispatch", managerId: "USR-004", managerName: "Agus Pratama", status: "ACTIVE" },
  { id: "CC-MNT-01", costCenterId: "CC-MNT-01", code: "CC-WORKSHOP-MAIN", name: "Main Workshop & Heavy Maintenance", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-MAINTENANCE", departmentName: "Equipment Maintenance", managerId: "USR-002", managerName: "Suryadi", status: "ACTIVE" },
  { id: "CC-PLANT-01", costCenterId: "CC-PLANT-01", code: "CC-CRUSHER-PORT", name: "Port Processing & Crusher Plant", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-PLANT", departmentName: "Processing Plant", managerId: "USR-003", managerName: "Rudy Hartono", status: "ACTIVE" },
  { id: "CC-WHS-01", costCenterId: "CC-WHS-01", code: "CC-WAREHOUSE-SITE", name: "Main Site Warehouse & Logistics", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-WAREHOUSE", departmentName: "Warehouse & Inventory", managerId: "USR-006", managerName: "Eko Prasetyo", status: "ACTIVE" },
  { id: "CC-HSE-01", costCenterId: "CC-HSE-01", code: "CC-HSE-ENV", name: "HSE, Reclamation & Environment", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-HSE", departmentName: "HSE & Environment", managerId: "USR-005", managerName: "Fitriani, S.ST.", status: "ACTIVE" },
  { id: "CC-ADM-01", costCenterId: "CC-ADM-01", code: "CC-ADMIN-SITE", name: "General Site Administration & HR", companyId: "COMP-BNU-01", siteId: "SITE-KAL-A", departmentId: "DEP-HR", departmentName: "HR & Admin", managerId: "USR-007", managerName: "Maya Indah", status: "ACTIVE" },
];

// Initial Revenue Records
const INITIAL_REVENUE: RevenueRecord[] = [
  {
    id: "REV-2026-001",
    revenueId: "REV-2026-001",
    revenueNumber: "REV-BNU-2026-0801",
    customerId: "CUST-PLN-01",
    customerName: "PLN Energi Primer Indonesia",
    contractId: "CTR-PLN-2026-004",
    shipmentId: "SHP-2026-089",
    shipmentNumber: "SHP-BNU-2026-089",
    invoiceId: "INV-AR-2026-012",
    invoiceNumber: "INV-2026-08-012",
    product: "Coal GAR 6100",
    quantityMT: 8050,
    unitPriceUSD: 88.5,
    exchangeRate: 15850,
    unitPriceIDR: 1402725,
    grossRevenueIDR: 11291936250,
    deductionIDR: 125000000, // Quality penalty adjustment
    netRevenueIDR: 11166936250,
    recognitionDate: "2026-08-10",
    status: "INVOICED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "REV-2026-002",
    revenueId: "REV-2026-002",
    revenueNumber: "REV-BNU-2026-0802",
    customerId: "CUST-GLENCORE-01",
    customerName: "Glencore International AG",
    contractId: "CTR-GLEN-2026-001",
    shipmentId: "SHP-2026-092",
    shipmentNumber: "SHP-BNU-2026-092",
    invoiceId: "INV-AR-2026-015",
    invoiceNumber: "INV-2026-08-015",
    product: "Coal GAR 6200 Export",
    quantityMT: 45000,
    unitPriceUSD: 94.2,
    exchangeRate: 15850,
    unitPriceIDR: 1493070,
    grossRevenueIDR: 67188150000,
    deductionIDR: 350000000,
    netRevenueIDR: 66838150000,
    recognitionDate: "2026-08-12",
    status: "INVOICED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "REV-2026-003",
    revenueId: "REV-2026-003",
    revenueNumber: "REV-BNU-2026-0803",
    customerId: "CUST-ADARO-01",
    customerName: "PT Adaro Power Supply",
    contractId: "CTR-ADR-2026-009",
    shipmentId: "SHP-2026-095",
    shipmentNumber: "SHP-BNU-2026-095",
    invoiceId: "INV-AR-2026-018",
    invoiceNumber: "INV-2026-08-018",
    product: "Coal GAR 5800",
    quantityMT: 12500,
    unitPriceUSD: 76.0,
    exchangeRate: 15850,
    unitPriceIDR: 1204600,
    grossRevenueIDR: 15057500000,
    deductionIDR: 0,
    netRevenueIDR: 15057500000,
    recognitionDate: "2026-08-14",
    status: "RECOGNIZED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
];

// Initial Accounts Receivable
const INITIAL_AR: AccountsReceivable[] = [
  {
    id: "AR-2026-01",
    arId: "AR-2026-01",
    invoiceNumber: "INV-2026-08-012",
    customerId: "CUST-PLN-01",
    customerName: "PLN Energi Primer Indonesia",
    contractCode: "CTR-PLN-2026-004",
    invoiceDate: "2026-08-10",
    dueDate: "2026-09-09",
    invoiceAmountIDR: 11166936250,
    paidAmountIDR: 3000000000,
    outstandingAmountIDR: 8166936250,
    daysOutstanding: 4,
    agingBucket: "CURRENT",
    riskLevel: "LOW",
    status: "PARTIALLY_PAID",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AR-2026-02",
    arId: "AR-2026-02",
    invoiceNumber: "INV-2026-08-015",
    customerId: "CUST-GLENCORE-01",
    customerName: "Glencore International AG",
    contractCode: "CTR-GLEN-2026-001",
    invoiceDate: "2026-08-12",
    dueDate: "2026-08-27",
    invoiceAmountIDR: 66838150000,
    paidAmountIDR: 0,
    outstandingAmountIDR: 66838150000,
    daysOutstanding: 2,
    agingBucket: "CURRENT",
    riskLevel: "LOW",
    status: "ISSUED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AR-2026-03",
    arId: "AR-2026-03",
    invoiceNumber: "INV-2026-06-088",
    customerId: "CUST-SMI-01",
    customerName: "PT Smelter Mineral Indonesia",
    contractCode: "CTR-SMI-2025-012",
    invoiceDate: "2026-06-15",
    dueDate: "2026-07-15",
    invoiceAmountIDR: 4250000000,
    paidAmountIDR: 1000000000,
    outstandingAmountIDR: 3250000000,
    daysOutstanding: 30,
    agingBucket: "1-30_DAYS",
    riskLevel: "MEDIUM",
    status: "OVERDUE",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
];

// Initial Accounts Payable
const INITIAL_AP: AccountsPayable[] = [
  {
    id: "AP-2026-01",
    apId: "AP-2026-01",
    vendorId: "VND-UT-01",
    vendorName: "PT United Tractors Tbk",
    poNumber: "PO-BNU-2026-0158",
    goodsReceiptNumber: "GR-2026-08-042",
    supplierInvoiceNumber: "INV-UT-2026-9041",
    invoiceDate: "2026-08-08",
    dueDate: "2026-09-07",
    invoiceAmountIDR: 385000000,
    poAmountIDR: 385000000,
    grAmountIDR: 385000000,
    paidAmountIDR: 0,
    outstandingAmountIDR: 385000000,
    daysOutstanding: 6,
    matchingStatus: "MATCHED",
    matchingNotes: "3-Way Match Verified: PO, GR, & Invoice quantities & prices 100% aligned.",
    status: "APPROVED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AP-2026-02",
    apId: "AP-2026-02",
    vendorId: "VND-PERTAMINA-01",
    vendorName: "PT Pertamina Patra Niaga",
    poNumber: "PO-BNU-2026-0162",
    goodsReceiptNumber: "GR-2026-08-045",
    supplierInvoiceNumber: "INV-PTPN-2026-8812",
    invoiceDate: "2026-08-11",
    dueDate: "2026-08-25",
    invoiceAmountIDR: 632250000,
    poAmountIDR: 632250000,
    grAmountIDR: 632250000,
    paidAmountIDR: 200000000,
    outstandingAmountIDR: 432250000,
    daysOutstanding: 3,
    matchingStatus: "MATCHED",
    matchingNotes: "B35 Diesel volume and delivery receipt verified at Main Depot Tank.",
    status: "PARTIALLY_PAID",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AP-2026-03",
    apId: "AP-2026-03",
    vendorId: "VND-SIS-01",
    vendorName: "PT Saptaindra Sejati (Hauling Contractor)",
    poNumber: "PO-BNU-2026-0145",
    goodsReceiptNumber: "GR-2026-08-038",
    supplierInvoiceNumber: "INV-SIS-2026-0421",
    invoiceDate: "2026-08-05",
    dueDate: "2026-08-20",
    invoiceAmountIDR: 2450000000,
    poAmountIDR: 2300000000,
    grAmountIDR: 2300000000,
    paidAmountIDR: 0,
    outstandingAmountIDR: 2450000000,
    daysOutstanding: 9,
    matchingStatus: "MISMATCH",
    matchingNotes: "Price variance detected: Invoice total Rp 2.45B exceeds PO Rp 2.30B (+Rp 150M surcharge under review).",
    status: "VERIFIED",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
];

// Initial OPEX Records
const INITIAL_OPEX: OpexRecord[] = [
  {
    id: "OPX-2026-01",
    expenseId: "OPX-2026-01",
    date: "2026-08-12",
    accountId: "COA-5100",
    accountCode: "5100",
    accountName: "Biaya Bahan Bakar Fuel (B35 Diesel)",
    costCenterId: "CC-HAUL-01",
    costCenterName: "Coal Hauling & Road Maintenance",
    category: "Fuel",
    siteId: "SITE-KAL-A",
    vendorName: "PT Pertamina Patra Niaga",
    description: "BBM B35 Diesel 42,150 L untuk Haul Truck & Excavator Fleet",
    amountIDR: 632250000,
    referenceType: "FUEL_DISPENSE",
    referenceId: "FT-01-DISPENSE-0812",
    status: "APPROVED",
    companyId: "COMP-BNU-01",
  },
  {
    id: "OPX-2026-02",
    expenseId: "OPX-2026-02",
    date: "2026-08-12",
    accountId: "COA-5200",
    accountCode: "5200",
    accountName: "Biaya Maintenance & Spare Parts Fleet",
    costCenterId: "CC-MNT-01",
    costCenterName: "Main Workshop & Heavy Maintenance",
    category: "Maintenance",
    siteId: "SITE-KAL-A",
    vendorName: "PT United Tractors Tbk",
    description: "Perbaikan hidrolik arm boom & filter kit Komatsu PC1250 EX-204",
    amountIDR: 16000000,
    referenceType: "WORK_ORDER",
    referenceId: "WO-EX204-01",
    status: "APPROVED",
    companyId: "COMP-BNU-01",
  },
  {
    id: "OPX-2026-03",
    expenseId: "OPX-2026-03",
    date: "2026-08-10",
    accountId: "COA-5400",
    accountCode: "5400",
    accountName: "Biaya Contractor Mining & Hauling",
    costCenterId: "CC-MIN-01",
    costCenterName: "Pit A Operation & Stripping",
    category: "Contractor",
    siteId: "SITE-KAL-A",
    vendorName: "PT Saptaindra Sejati",
    description: "Jasa kontraktor Overburden removal 150,000 BCM",
    amountIDR: 2300000000,
    referenceType: "CONTRACTOR_PROGRESS",
    referenceId: "PROGRESS-SIS-20260810",
    status: "APPROVED",
    companyId: "COMP-BNU-01",
  },
  {
    id: "OPX-2026-04",
    expenseId: "OPX-2026-04",
    date: "2026-08-08",
    accountId: "COA-5300",
    accountCode: "5300",
    accountName: "Biaya Tenaga Kerja & Gaji Operator",
    costCenterId: "CC-ADM-01",
    costCenterName: "General Site Administration & HR",
    category: "Labor",
    siteId: "SITE-KAL-A",
    vendorName: "Internal Payroll",
    description: "Gaji & Uang Lembur Operator Fleet & Tim Site Bulan Juli/Agustus",
    amountIDR: 850000000,
    referenceType: "PAYROLL",
    referenceId: "PAYROLL-2026-07-SITEA",
    status: "PAID",
    companyId: "COMP-BNU-01",
  },
];

// Initial CAPEX Requests
const INITIAL_CAPEX: CapexRequest[] = [
  {
    id: "CPX-2026-01",
    capexId: "CPX-2026-01",
    capexNumber: "CPX-BNU-2026-001",
    title: "Pengadaan 2 Unit Dump Truck CAT 777G 100 Ton Payload",
    category: "Heavy Equipment",
    siteId: "SITE-KAL-A",
    costCenterId: "CC-MIN-01",
    proposedAmountIDR: 18500000000,
    approvedAmountIDR: 18500000000,
    usefulLifeYears: 8,
    justification: "Peningkatan target Overburden Removal dari 1.2M BCM menjadi 1.5M BCM per bulan di Pit A.",
    approvalStatus: "CAPITALIZED",
    requestorName: "Ir. Hendra Wijaya",
    approvedBy: "Direksi BNU",
    companyId: "COMP-BNU-01",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "CPX-2026-02",
    capexId: "CPX-2026-02",
    capexNumber: "CPX-BNU-2026-002",
    title: "Upgrading Primary Jaw Crusher Plant Capacity 800 TPH",
    category: "Processing Plant",
    siteId: "SITE-KAL-A",
    costCenterId: "CC-PLANT-01",
    proposedAmountIDR: 6200000000,
    approvedAmountIDR: 6200000000,
    usefulLifeYears: 10,
    justification: "Eliminasi bottleneck pengolahan batubara ROM di Port Jetty B.",
    approvalStatus: "APPROVED",
    requestorName: "Rudy Hartono",
    approvedBy: "Direksi BNU",
    companyId: "COMP-BNU-01",
    createdAt: "2026-03-10T00:00:00Z",
  },
  {
    id: "CPX-2026-03",
    capexId: "CPX-2026-03",
    capexNumber: "CPX-BNU-2026-003",
    title: "Konstruksi Concrete Settling Pond & Water Treatment Plant",
    category: "Infrastructure",
    siteId: "SITE-KAL-A",
    costCenterId: "CC-HSE-01",
    proposedAmountIDR: 2800000000,
    approvedAmountIDR: 2800000000,
    usefulLifeYears: 12,
    justification: "Kepatuhan baku mutu lingkungan AMDAL air asam tambang menjelang musim hujan.",
    approvalStatus: "SUBMITTED",
    requestorName: "Fitriani, S.ST.",
    companyId: "COMP-BNU-01",
    createdAt: "2026-07-20T00:00:00Z",
  },
];

// Initial Fixed Assets
const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  {
    id: "AST-2026-01",
    assetId: "AST-2026-01",
    assetCode: "AST-EX-201",
    assetName: "Excavator Komatsu PC1250-8R (Mining Unit #1)",
    category: "Heavy Equipment",
    serialNumber: "KMT-PC1250-98012",
    equipmentId: "EQ-EX201",
    purchaseDate: "2023-03-15",
    purchaseCostIDR: 14500000000,
    capitalizedDate: "2023-04-01",
    usefulLifeYears: 10,
    salvageValueIDR: 1450000000,
    location: "Pit 1 South RL +45",
    departmentId: "DEP-MINING",
    costCenterId: "CC-MIN-01",
    accumulatedDepreciationIDR: 4350000000,
    currentBookValueIDR: 10150000000,
    depreciationMethod: "STRAIGHT_LINE",
    annualDepreciationIDR: 1305000000,
    status: "ACTIVE",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AST-2026-02",
    assetId: "AST-2026-02",
    assetCode: "AST-HT-101",
    assetName: "CAT 777G Off-Highway Haul Truck #101",
    category: "Heavy Equipment",
    serialNumber: "CAT-777G-44021",
    equipmentId: "EQ-HT101",
    purchaseDate: "2024-01-10",
    purchaseCostIDR: 9250000000,
    capitalizedDate: "2024-02-01",
    usefulLifeYears: 8,
    salvageValueIDR: 925000000,
    location: "Main Haul Road KM 12",
    departmentId: "DEP-MINING",
    costCenterId: "CC-HAUL-01",
    accumulatedDepreciationIDR: 2867187500,
    currentBookValueIDR: 6382812500,
    depreciationMethod: "STRAIGHT_LINE",
    annualDepreciationIDR: 1040625000,
    status: "ACTIVE",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "AST-2026-03",
    assetId: "AST-2026-03",
    assetCode: "AST-CRS-01",
    assetName: "Stationary Coal Crusher Plant 500 TPH Port Jetty",
    category: "Processing Plant",
    serialNumber: "TEREX-CRS-500-09",
    purchaseDate: "2022-06-20",
    purchaseCostIDR: 18000000000,
    capitalizedDate: "2022-07-01",
    usefulLifeYears: 12,
    salvageValueIDR: 1800000000,
    location: "Port Jetty Area B",
    departmentId: "DEP-PLANT",
    costCenterId: "CC-PLANT-01",
    accumulatedDepreciationIDR: 5400000000,
    currentBookValueIDR: 12600000000,
    depreciationMethod: "STRAIGHT_LINE",
    annualDepreciationIDR: 1350000000,
    status: "ACTIVE",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
];

// Initial Budget Records
const INITIAL_BUDGETS: BudgetRecord[] = [
  {
    id: "BDG-2026-01",
    budgetId: "BDG-2026-01",
    fiscalYear: 2026,
    period: "MONTHLY",
    periodName: "2026-08",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    departmentId: "DEP-MINING",
    departmentName: "Mining Production",
    costCenterId: "CC-HAUL-01",
    costCenterName: "Coal Hauling & Road Maintenance",
    accountId: "COA-5100",
    accountCode: "5100",
    accountName: "Biaya Bahan Bakar Fuel (B35 Diesel)",
    budgetAmountIDR: 1800000000,
    actualAmountIDR: 1632250000,
    varianceIDR: -167750000,
    variancePct: -9.32,
    controlStatus: "WITHIN_BUDGET",
    status: "APPROVED",
  },
  {
    id: "BDG-2026-02",
    budgetId: "BDG-2026-02",
    fiscalYear: 2026,
    period: "MONTHLY",
    periodName: "2026-08",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    departmentId: "DEP-MAINTENANCE",
    departmentName: "Equipment Maintenance",
    costCenterId: "CC-MNT-01",
    costCenterName: "Main Workshop & Heavy Maintenance",
    accountId: "COA-5200",
    accountCode: "5200",
    accountName: "Biaya Maintenance & Spare Parts Fleet",
    budgetAmountIDR: 850000000,
    actualAmountIDR: 920000000,
    varianceIDR: 70000000,
    variancePct: 8.24,
    controlStatus: "OVER_BUDGET",
    status: "APPROVED",
  },
  {
    id: "BDG-2026-03",
    budgetId: "BDG-2026-03",
    fiscalYear: 2026,
    period: "MONTHLY",
    periodName: "2026-08",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    departmentId: "DEP-MINING",
    departmentName: "Mining Production",
    costCenterId: "CC-MIN-01",
    costCenterName: "Pit A Operation & Stripping",
    accountId: "COA-5400",
    accountCode: "5400",
    accountName: "Biaya Contractor Mining & Hauling",
    budgetAmountIDR: 5200000000,
    actualAmountIDR: 4950000000,
    varianceIDR: -250000000,
    variancePct: -4.81,
    controlStatus: "WITHIN_BUDGET",
    status: "APPROVED",
  },
  {
    id: "BDG-2026-04",
    budgetId: "BDG-2026-04",
    fiscalYear: 2026,
    period: "MONTHLY",
    periodName: "2026-08",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    departmentId: "DEP-HSE",
    departmentName: "HSE & Environment",
    costCenterId: "CC-HSE-01",
    costCenterName: "HSE, Reclamation & Environment",
    accountId: "COA-5600",
    accountCode: "5600",
    accountName: "Biaya HSE, Lingkungan & Reklamasi",
    budgetAmountIDR: 450000000,
    actualAmountIDR: 420000000,
    varianceIDR: -30000000,
    variancePct: -6.67,
    controlStatus: "WITHIN_BUDGET",
    status: "APPROVED",
  },
];

// Initial Cash Flow Records
const INITIAL_CASH_FLOW: CashFlowRecord[] = [
  {
    id: "CF-2026-01",
    cashId: "CF-2026-01",
    date: "2026-08-10",
    type: "OPERATING",
    direction: "INFLOW",
    category: "Customer Payment",
    description: "Penerimaan pembayaran parsial PLN Energi Primer Indonesia (Barge BG 3001)",
    amountIDR: 3000000000,
    sourceModule: "SALES",
    referenceId: "INV-2026-08-012",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "CF-2026-02",
    cashId: "CF-2026-02",
    date: "2026-08-11",
    type: "OPERATING",
    direction: "OUTFLOW",
    category: "Vendor Payment - Fuel",
    description: "Pembayaran DP pasokan BBM Pertamina Patra Niaga B35 Diesel",
    amountIDR: 2000000000,
    sourceModule: "PROCUREMENT",
    referenceId: "PO-BNU-2026-0162",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "CF-2026-03",
    cashId: "CF-2026-03",
    date: "2026-08-08",
    type: "OPERATING",
    direction: "OUTFLOW",
    category: "Payroll & Salaries",
    description: "Pembayaran gaji & insentif lembur karyawan & operator site",
    amountIDR: 850000000,
    sourceModule: "PAYROLL",
    referenceId: "PAYROLL-2026-07",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
  {
    id: "CF-2026-04",
    cashId: "CF-2026-04",
    date: "2026-08-01",
    type: "INVESTING",
    direction: "OUTFLOW",
    category: "CAPEX Equipment Acquisition",
    description: "Angsuran DP unit Dump Truck CAT 777G 100 Ton Payload",
    amountIDR: 3700000000,
    sourceModule: "FINANCE",
    referenceId: "CPX-BNU-2026-001",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
  },
];

// Initial Mining Cost Model per Pit
const INITIAL_MINING_COST_MODEL: MiningCostModel[] = [
  {
    siteId: "SITE-KAL-A",
    siteName: "Site Kalimantan A (Sangatta)",
    pitId: "PIT-1-SOUTH",
    pitName: "Pit 1 South (Seam 30)",
    period: "2026-08",
    coalProductionMT: 125000,
    obVolumeBCM: 450000,
    drillingCostIDR: 350000000,
    blastingCostIDR: 850000000,
    excavationCostIDR: 2100000000,
    loadingCostIDR: 1200000000,
    haulingCostIDR: 3400000000,
    dumpingCostIDR: 450000000,
    dozingCostIDR: 620000000,
    gradingCostIDR: 280000000,
    dewateringCostIDR: 310000000,
    roadMaintenanceCostIDR: 420000000,
    otherCostIDR: 220000000,
    totalMiningCostIDR: 10200000000,
    costPerTonIDR: 81600, // IDR / MT Coal
    costPerBCMIDR: 22666, // IDR / BCM OB
  },
  {
    siteId: "SITE-KAL-A",
    siteName: "Site Kalimantan A (Sangatta)",
    pitId: "PIT-2-NORTH",
    pitName: "Pit 2 North (Seam 42)",
    period: "2026-08",
    coalProductionMT: 85000,
    obVolumeBCM: 320000,
    drillingCostIDR: 280000000,
    blastingCostIDR: 620000000,
    excavationCostIDR: 1650000000,
    loadingCostIDR: 950000000,
    haulingCostIDR: 2600000000,
    dumpingCostIDR: 340000000,
    dozingCostIDR: 480000000,
    gradingCostIDR: 210000000,
    dewateringCostIDR: 240000000,
    roadMaintenanceCostIDR: 310000000,
    otherCostIDR: 180000000,
    totalMiningCostIDR: 7860000000,
    costPerTonIDR: 92470,
    costPerBCMIDR: 24562,
  },
];

// Initial Equipment Cost Details
const INITIAL_EQUIPMENT_COSTS: EquipmentCostDetail[] = [
  {
    equipmentCode: "EQ-EX201",
    equipmentName: "Komatsu PC1250 Excavator",
    category: "EXCAVATOR",
    workingHours: 480,
    fuelCostIDR: 450000000,
    maintenanceCostIDR: 185000000,
    laborCostIDR: 48000000,
    depreciationCostIDR: 108750000,
    totalCostIDR: 791750000,
    costPerHourIDR: 1649479,
  },
  {
    equipmentCode: "EQ-HT101",
    equipmentName: "CAT 777G Haul Truck #101",
    category: "HAUL_TRUCK",
    workingHours: 520,
    fuelCostIDR: 380000000,
    maintenanceCostIDR: 142000000,
    laborCostIDR: 42000000,
    depreciationCostIDR: 86718750,
    totalCostIDR: 650718750,
    costPerHourIDR: 1251382,
  },
];

// Initial Financial Periods
const INITIAL_FINANCIAL_PERIODS: FinancialPeriod[] = [
  { id: "FP-2026-07", periodId: "FP-2026-07", periodName: "2026-07", year: 2026, month: 7, startDate: "2026-07-01", endDate: "2026-07-31", status: "CLOSED" },
  { id: "FP-2026-08", periodId: "FP-2026-08", periodName: "2026-08", year: 2026, month: 8, startDate: "2026-08-01", endDate: "2026-08-31", status: "OPEN" },
  { id: "FP-2026-09", periodId: "FP-2026-09", periodName: "2026-09", year: 2026, month: 9, startDate: "2026-09-01", endDate: "2026-09-30", status: "OPEN" },
];

// Initial Double Entry Journal Entries
const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: "JRN-2026-001",
    journalId: "JRN-2026-001",
    journalNumber: "JRN-20260810-001",
    transactionDate: "2026-08-10",
    postingDate: "2026-08-10",
    referenceType: "SALES",
    referenceId: "INV-2026-08-012",
    description: "Pengakuan Pendapatan Penjualan Batubara PLN Energi Primer (Tongkang BG 3001)",
    fiscalPeriod: "2026-08",
    status: "POSTED",
    lines: [
      {
        lineId: "LN-01",
        accountId: "COA-1120",
        accountCode: "1120",
        accountName: "Piutang Usaha (AR - Coal Sales)",
        debitIDR: 11166936250,
        creditIDR: 0,
        description: "Piutang Usaha PLN EPI 8,050 MT Coal GAR 6100",
      },
      {
        lineId: "LN-02",
        accountId: "COA-4110",
        accountCode: "4110",
        accountName: "Penjualan Batubara Domestik (PLN / Smelter)",
        debitIDR: 0,
        creditIDR: 11166936250,
        description: "Pendapatan Bersih Penjualan Batubara Domestik",
      },
    ],
    totalDebitIDR: 11166936250,
    totalCreditIDR: 11166936250,
    isBalanced: true,
    createdBy: "Eko Prasetyo",
    approvedBy: "Finance Manager",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-08-10T10:00:00Z",
  },
  {
    id: "JRN-2026-002",
    journalId: "JRN-2026-002",
    journalNumber: "JRN-20260812-002",
    transactionDate: "2026-08-12",
    postingDate: "2026-08-12",
    referenceType: "PROCUREMENT",
    referenceId: "PO-BNU-2026-0162",
    description: "Pencatatan Beban Solar B35 Diesel Patra Niaga 42,150 Liters",
    fiscalPeriod: "2026-08",
    status: "POSTED",
    lines: [
      {
        lineId: "LN-03",
        accountId: "COA-5100",
        accountCode: "5100",
        accountName: "Biaya Bahan Bakar Fuel (B35 Diesel)",
        debitIDR: 632250000,
        creditIDR: 0,
        costCenterId: "CC-HAUL-01",
        costCenterName: "Coal Hauling & Road Maintenance",
        description: "Pengisian Tangki Utama Fuel Depot Site A",
      },
      {
        lineId: "LN-04",
        accountId: "COA-2110",
        accountCode: "2110",
        accountName: "Hutang Usaha (AP - Vendors & Contractors)",
        debitIDR: 0,
        creditIDR: 632250000,
        description: "Hutang Usaha PT Pertamina Patra Niaga",
      },
    ],
    totalDebitIDR: 632250000,
    totalCreditIDR: 632250000,
    isBalanced: true,
    createdBy: "Eko Prasetyo",
    approvedBy: "Finance Manager",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    createdAt: "2026-08-12T17:00:00Z",
    updatedAt: "2026-08-12T17:00:00Z",
  },
];

// Initial AI Insights
const INITIAL_AI_INSIGHTS: AIFinanceInsight[] = [
  {
    id: "FIN-AI-01",
    title: "Kenaikan Unit Cost Maintenance Fleet Pit A (+8.2%)",
    category: "COST",
    severity: "WARNING",
    finding: "Cost per Operating Hour unit Excavator Komatsu PC1250 naik dari Rp 1.52M/Jam menjadi Rp 1.65M/Jam pada periode berjalan.",
    evidence: "Pengadaan komprehensif hydraulic seal kit (WO-EX204-01 Rp 16M) & frekuensi breakdown meningkat akibat kontaminasi oli.",
    rootCauseInference: "Terjadi degradasi kualitas oli hidrolik akibat keterlambatan penggantian filter periodik di Pit 2.",
    impact: "Potensi pembengkakan OPEX maintenance sebesar Rp 180 Juta s.d. akhir bulan jika tidak diperbaiki.",
    recommendation: "Lakukan oil sampling audit & ganti filter elemen sesuai schedule PM 500 SMU.",
    expectedImpact: "Penurunan unit maintenance cost sebesar 6.5% dalam 14 hari.",
    confidencePct: 92,
    scope: "Equipment Maintenance / Pit A",
    isAnomaly: true,
    status: "ACTIVE",
  },
  {
    id: "FIN-AI-02",
    title: "Potensi Defisit Cash Flow Minggu Ke-4 akibat Delay AR Smelter (Rp 3.25 M)",
    category: "CASH_FLOW",
    severity: "CRITICAL",
    finding: "Piutang PT Smelter Mineral Indonesia (INV-2026-06-088) telah jatuh tempo >30 hari dengan outstanding Rp 3.25 Milyar.",
    evidence: "Total AR jatuh tempo >30 hari meningkat 14% dari baseline, sementara komitmen pembayaran contractor SIS jatuh tempo 20 Agustus.",
    rootCauseInference: "Delay klarifikasi kualitas laboratorium penyerahan hasil verifikasi Surveyor Independen.",
    impact: "Penyempitan liquidity margin pada akhir bulan Agustus.",
    recommendation: "Terbitkan formal Notice of Overdue & koordinasikan konfirmasi COA verifikasi dengan tim Sales.",
    expectedImpact: "Pencairan arus kas masuk Rp 3.25 M dalam 7 hari kerja.",
    confidencePct: 88,
    scope: "Accounts Receivable & Working Capital",
    isAnomaly: true,
    status: "ACTIVE",
  },
  {
    id: "FIN-AI-03",
    title: "Efisiensi Fuel Hauling Menurunkan Unit Cost / Ton (Sesuai Budget)",
    category: "PROFIT",
    severity: "INFO",
    finding: "Biaya Bahan Bakar (COA-5100) berada 9.32% di bawah batas anggaran (Within Budget Rp 1.63M vs Budget Rp 1.80M).",
    evidence: "Perbaikan kondisi main haul road KM 12 mengurangi cycle time dump truck & konsumsi B35 diesel dari 0.72 L/BCM menjadi 0.68 L/BCM.",
    rootCauseInference: "Dampak positif grading & perataan jalan tambang harian oleh tim Civil.",
    impact: "Penghematan biaya operasional fuel sebesar Rp 167.75 Juta pada bulan Agustus.",
    recommendation: "Pertahankan ketebalan lapisan macadam jalan tambang utama.",
    expectedImpact: "Stabilitas operating margin di atas 28%.",
    confidencePct: 95,
    scope: "Hauling Logistics & Fuel Efficiency",
    isAnomaly: false,
    status: "ACTIVE",
  },
];

// Initial Tax Codes & Currency Rates
const INITIAL_TAX_CODES: FinanceTaxCode[] = [
  { code: "PPN-11", name: "Pajak Pertambahan Nilai 11%", ratePct: 11.0, type: "VAT", description: "PPN Pengeluaran & Masukan Standar 11%" },
  { code: "ROY-ESD", name: "Royalti Tambang PNBP ESDM 14%", ratePct: 14.0, type: "ROYALTY", description: "IUPK / PKP2B Royalti Penjualan Batubara" },
  { code: "PPH-23", name: "PPh Pasal 23 Jasa Kontraktor 2%", ratePct: 2.0, type: "WITHHOLDING", description: "Pemotongan PPh 23 atas jasa pengangkutan/kontraktor" },
];

const INITIAL_CURRENCY_RATES: CurrencyRate[] = [
  { currencyCode: "USD", currencyName: "US Dollar", exchangeRateToIDR: 15850, effectiveDate: "2026-08-14" },
  { currencyCode: "IDR", currencyName: "Indonesian Rupiah", exchangeRateToIDR: 1, effectiveDate: "2026-08-14" },
];

export class FinanceRepository extends BaseRepository<JournalEntry> {
  private coaKey = "finance_chart_of_accounts_v1";
  private costCenterKey = "finance_cost_centers_v1";
  private journalKey = "finance_journals_v1";
  private revenueKey = "finance_revenue_v1";
  private arKey = "finance_ar_v1";
  private apKey = "finance_ap_v1";
  private opexKey = "finance_opex_v1";
  private capexKey = "finance_capex_v1";
  private fixedAssetKey = "finance_fixed_assets_v1";
  private budgetKey = "finance_budgets_v1";
  private cashFlowKey = "finance_cash_flow_v1";
  private miningCostKey = "finance_mining_cost_v1";
  private periodKey = "finance_periods_v1";
  private aiInsightKey = "finance_ai_insights_v1";

  constructor() {
    super("finance_journals_v1", INITIAL_JOURNALS);
  }

  // --- CHART OF ACCOUNTS ---
  async getChartOfAccounts(): Promise<ChartOfAccount[]> {
    const raw = localStorage.getItem(this.coaKey);
    if (!raw) {
      localStorage.setItem(this.coaKey, JSON.stringify(INITIAL_COA));
      return INITIAL_COA;
    }
    return JSON.parse(raw);
  }

  async saveAccount(account: ChartOfAccount): Promise<ChartOfAccount> {
    const list = await getStorageList<ChartOfAccount>(this.coaKey, INITIAL_COA);
    const idx = list.findIndex((a) => a.accountId === account.accountId || a.id === account.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...account };
    } else {
      list.push(account);
    }
    localStorage.setItem(this.coaKey, JSON.stringify(list));
    return account;
  }

  // --- COST CENTERS ---
  async getCostCenters(): Promise<CostCenter[]> {
    return getStorageList<CostCenter>(this.costCenterKey, INITIAL_COST_CENTERS);
  }

  async saveCostCenter(cc: CostCenter): Promise<CostCenter> {
    const list = await getStorageList<CostCenter>(this.costCenterKey, INITIAL_COST_CENTERS);
    const idx = list.findIndex((c) => c.costCenterId === cc.costCenterId || c.id === cc.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...cc };
    } else {
      list.push(cc);
    }
    localStorage.setItem(this.costCenterKey, JSON.stringify(list));
    return cc;
  }

  // --- JOURNALS & DOUBLE ENTRY ---
  async getJournals(): Promise<JournalEntry[]> {
    return this.getAll();
  }

  async createJournal(journal: Omit<JournalEntry, "id" | "isBalanced" | "createdAt" | "updatedAt">): Promise<JournalEntry> {
    const list = await this.getAll();
    const totalDebit = journal.lines.reduce((acc, l) => acc + (l.debitIDR || 0), 0);
    const totalCredit = journal.lines.reduce((acc, l) => acc + (l.creditIDR || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    if (!isBalanced && journal.status === "POSTED") {
      throw new Error("Cannot post unbalanced journal! Total Debit must equal Total Credit.");
    }

    const newJournal: JournalEntry = {
      ...journal,
      id: `JRN-${Date.now()}`,
      totalDebitIDR: totalDebit,
      totalCreditIDR: totalCredit,
      isBalanced,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newJournal);
    localStorage.setItem(this.journalKey, JSON.stringify(list));
    return newJournal;
  }

  // --- REVENUE ---
  async getRevenueRecords(): Promise<RevenueRecord[]> {
    return getStorageList<RevenueRecord>(this.revenueKey, INITIAL_REVENUE);
  }

  async saveRevenueRecord(rev: RevenueRecord): Promise<RevenueRecord> {
    const list = await getStorageList<RevenueRecord>(this.revenueKey, INITIAL_REVENUE);
    const idx = list.findIndex((r) => r.revenueId === rev.revenueId || r.id === rev.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...rev };
    } else {
      list.unshift(rev);
    }
    localStorage.setItem(this.revenueKey, JSON.stringify(list));
    return rev;
  }

  // --- ACCOUNTS RECEIVABLE ---
  async getAccountsReceivable(): Promise<AccountsReceivable[]> {
    return getStorageList<AccountsReceivable>(this.arKey, INITIAL_AR);
  }

  async saveAR(ar: AccountsReceivable): Promise<AccountsReceivable> {
    const list = await getStorageList<AccountsReceivable>(this.arKey, INITIAL_AR);
    const idx = list.findIndex((a) => a.arId === ar.arId || a.id === ar.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...ar };
    } else {
      list.unshift(ar);
    }
    localStorage.setItem(this.arKey, JSON.stringify(list));
    return ar;
  }

  // --- ACCOUNTS PAYABLE ---
  async getAccountsPayable(): Promise<AccountsPayable[]> {
    return getStorageList<AccountsPayable>(this.apKey, INITIAL_AP);
  }

  async saveAP(ap: AccountsPayable): Promise<AccountsPayable> {
    const list = await getStorageList<AccountsPayable>(this.apKey, INITIAL_AP);
    const idx = list.findIndex((a) => a.apId === ap.apId || a.id === ap.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...ap };
    } else {
      list.unshift(ap);
    }
    localStorage.setItem(this.apKey, JSON.stringify(list));
    return ap;
  }

  // --- OPEX ---
  async getOpexRecords(): Promise<OpexRecord[]> {
    return getStorageList<OpexRecord>(this.opexKey, INITIAL_OPEX);
  }

  async saveOpexRecord(opex: OpexRecord): Promise<OpexRecord> {
    const list = await getStorageList<OpexRecord>(this.opexKey, INITIAL_OPEX);
    const idx = list.findIndex((o) => o.expenseId === opex.expenseId || o.id === opex.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...opex };
    } else {
      list.unshift(opex);
    }
    localStorage.setItem(this.opexKey, JSON.stringify(list));
    return opex;
  }

  // --- CAPEX & FIXED ASSETS ---
  async getCapexRequests(): Promise<CapexRequest[]> {
    return getStorageList<CapexRequest>(this.capexKey, INITIAL_CAPEX);
  }

  async saveCapexRequest(capex: CapexRequest): Promise<CapexRequest> {
    const list = await getStorageList<CapexRequest>(this.capexKey, INITIAL_CAPEX);
    const idx = list.findIndex((c) => c.capexId === capex.capexId || c.id === capex.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...capex };
    } else {
      list.unshift(capex);
    }
    localStorage.setItem(this.capexKey, JSON.stringify(list));
    return capex;
  }

  async getFixedAssets(): Promise<FixedAsset[]> {
    return getStorageList<FixedAsset>(this.fixedAssetKey, INITIAL_FIXED_ASSETS);
  }

  async saveFixedAsset(asset: FixedAsset): Promise<FixedAsset> {
    const list = await getStorageList<FixedAsset>(this.fixedAssetKey, INITIAL_FIXED_ASSETS);
    const idx = list.findIndex((a) => a.assetId === asset.assetId || a.id === asset.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...asset };
    } else {
      list.unshift(asset);
    }
    localStorage.setItem(this.fixedAssetKey, JSON.stringify(list));
    return asset;
  }

  // --- BUDGETS ---
  async getBudgets(): Promise<BudgetRecord[]> {
    return getStorageList<BudgetRecord>(this.budgetKey, INITIAL_BUDGETS);
  }

  async saveBudget(bdg: BudgetRecord): Promise<BudgetRecord> {
    const list = await getStorageList<BudgetRecord>(this.budgetKey, INITIAL_BUDGETS);
    const idx = list.findIndex((b) => b.budgetId === bdg.budgetId || b.id === bdg.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...bdg };
    } else {
      list.unshift(bdg);
    }
    localStorage.setItem(this.budgetKey, JSON.stringify(list));
    return bdg;
  }

  // --- CASH FLOW ---
  async getCashFlowRecords(): Promise<CashFlowRecord[]> {
    return getStorageList<CashFlowRecord>(this.cashFlowKey, INITIAL_CASH_FLOW);
  }

  async saveCashFlow(cf: CashFlowRecord): Promise<CashFlowRecord> {
    const list = await getStorageList<CashFlowRecord>(this.cashFlowKey, INITIAL_CASH_FLOW);
    const idx = list.findIndex((c) => c.cashId === cf.cashId || c.id === cf.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...cf };
    } else {
      list.unshift(cf);
    }
    localStorage.setItem(this.cashFlowKey, JSON.stringify(list));
    return cf;
  }

  // --- MINING COST MODEL ---
  async getMiningCostModels(): Promise<MiningCostModel[]> {
    return getStorageList<MiningCostModel>(this.miningCostKey, INITIAL_MINING_COST_MODEL);
  }

  async getEquipmentCosts(): Promise<EquipmentCostDetail[]> {
    return INITIAL_EQUIPMENT_COSTS;
  }

  // --- PERIODS ---
  async getFinancialPeriods(): Promise<FinancialPeriod[]> {
    return getStorageList<FinancialPeriod>(this.periodKey, INITIAL_FINANCIAL_PERIODS);
  }

  // --- AI INSIGHTS ---
  async getAIInsights(): Promise<AIFinanceInsight[]> {
    return getStorageList<AIFinanceInsight>(this.aiInsightKey, INITIAL_AI_INSIGHTS);
  }

  async getTaxCodes(): Promise<FinanceTaxCode[]> {
    return INITIAL_TAX_CODES;
  }

  async getCurrencyRates(): Promise<CurrencyRate[]> {
    return INITIAL_CURRENCY_RATES;
  }

  // --- KPI SUMMARY CALCULATION ---
  async getKPISummary(): Promise<FinanceKPISummary> {
    const revenues = await this.getRevenueRecords();
    const opex = await this.getOpexRecords();
    const capex = await this.getCapexRequests();
    const ar = await this.getAccountsReceivable();
    const ap = await this.getAccountsPayable();
    const budgets = await this.getBudgets();
    const cash = await this.getCashFlowRecords();
    const assets = await this.getFixedAssets();

    const totalRevenueIDR = revenues.reduce((acc, r) => acc + r.netRevenueIDR, 0);
    const totalOpexIDR = opex.reduce((acc, o) => acc + o.amountIDR, 0);
    const totalCapexIDR = capex.reduce((acc, c) => acc + (c.approvedAmountIDR || c.proposedAmountIDR), 0);
    const totalCostIDR = totalOpexIDR;

    const grossProfitIDR = totalRevenueIDR - totalCostIDR * 0.65; // Estimated direct COGS ~65%
    const grossMarginPct = totalRevenueIDR > 0 ? (grossProfitIDR / totalRevenueIDR) * 100 : 0;

    const operatingProfitIDR = totalRevenueIDR - totalCostIDR;
    const operatingMarginPct = totalRevenueIDR > 0 ? (operatingProfitIDR / totalRevenueIDR) * 100 : 0;

    const netProfitIDR = operatingProfitIDR * 0.78; // After corporate tax ~22%

    const totalDepreciationIDR = assets.reduce((acc, a) => acc + a.annualDepreciationIDR / 12, 0);
    const ebitdaIDR = operatingProfitIDR + totalDepreciationIDR;
    const ebitdaMarginPct = totalRevenueIDR > 0 ? (ebitdaIDR / totalRevenueIDR) * 100 : 0;

    const accountsReceivableIDR = ar.reduce((acc, a) => acc + a.outstandingAmountIDR, 0);
    const accountsPayableIDR = ap.reduce((acc, a) => acc + a.outstandingAmountIDR, 0);

    const inflows = cash.filter((c) => c.direction === "INFLOW").reduce((acc, c) => acc + c.amountIDR, 0);
    const outflows = cash.filter((c) => c.direction === "OUTFLOW").reduce((acc, c) => acc + c.amountIDR, 0);
    const cashBalanceIDR = 48500000000 + inflows - outflows; // Baseline cash 48.5B

    const totalBudgetIDR = budgets.reduce((acc, b) => acc + b.budgetAmountIDR, 0);
    const totalActualIDR = budgets.reduce((acc, b) => acc + b.actualAmountIDR, 0);
    const budgetVarianceIDR = totalActualIDR - totalBudgetIDR;
    const budgetVariancePct = totalBudgetIDR > 0 ? (budgetVarianceIDR / totalBudgetIDR) * 100 : 0;

    const coalProductionMT = 210000; // Monthly total coal MT
    const obVolumeBCM = 770000; // Monthly total OB BCM

    // Breakdown costs
    const fuelCostTotalIDR = opex.filter((o) => o.category === "Fuel").reduce((acc, o) => acc + o.amountIDR, 0) || 1632250000;
    const maintenanceCostTotalIDR = opex.filter((o) => o.category === "Maintenance" || o.category === "Spare Parts").reduce((acc, o) => acc + o.amountIDR, 0) || 920000000;
    const haulingCostTotalIDR = opex.filter((o) => o.category === "Hauling" || o.category === "Contractor").reduce((acc, o) => acc + o.amountIDR, 0) || 4950000000;
    const laborCostTotalIDR = opex.filter((o) => o.category === "Labor").reduce((acc, o) => acc + o.amountIDR, 0) || 850000000;

    const costPerTonIDR = coalProductionMT > 0 ? Math.round(totalOpexIDR / coalProductionMT) : 85100;
    const costPerBCMIDR = obVolumeBCM > 0 ? Math.round(totalOpexIDR / obVolumeBCM) : 23200;
    const costPerTonBaselineIDR = 78500;
    const costPerBCMBaselineIDR = 21500;

    return {
      totalRevenueIDR,
      grossProfitIDR,
      grossMarginPct: Number(grossMarginPct.toFixed(2)),
      operatingProfitIDR,
      operatingMarginPct: Number(operatingMarginPct.toFixed(2)),
      netProfitIDR,
      totalCostIDR,
      totalOpexIDR,
      totalCapexIDR,
      cashBalanceIDR,
      cashInflowIDR: inflows,
      cashOutflowIDR: outflows,
      accountsReceivableIDR,
      accountsPayableIDR,
      totalBudgetIDR,
      totalActualIDR,
      budgetVarianceIDR,
      budgetVariancePct: Number(budgetVariancePct.toFixed(2)),
      costPerTonIDR,
      costPerBCMIDR,
      costPerTonBaselineIDR,
      costPerBCMBaselineIDR,
      fuelCostTotalIDR,
      maintenanceCostTotalIDR,
      haulingCostTotalIDR,
      laborCostTotalIDR,
      ebitdaIDR,
      ebitdaMarginPct: Number(ebitdaMarginPct.toFixed(2)),
      coalProductionMT,
      obVolumeBCM,
    };
  }

  async getMiningCostAnomalyAnalysis(): Promise<import("../../types/financeTypes").MiningCostAnomalyReport> {
    return {
      period: "2026-08 (Bulan Ini)",
      previousMonthCostPerTonIDR: 78500,
      currentMonthCostPerTonIDR: 85100,
      costPerTonIncreasePct: 8.41,
      previousMonthCostPerBCMIDR: 21500,
      currentMonthCostPerBCMIDR: 23200,
      costPerBCMIncreasePct: 7.91,
      totalCostIncreaseIDR: 1386000000,
      executiveSummary:
        "Kenaikan unit mining cost bulan ini (+8.41% Cost/Ton & +7.91% Cost/BCM) dipicu oleh 4 faktor utama: lonjakan konsumsi BBM solar akibat penambahan jarak hauling ke Disposal Barat (+1.8 km), perbaikan darurat silinder hidrolik Excavator PC1250 EX-204, penurunan cycle speed akibat kondisi jalan licin pasca hujan lebat, dan jam lembur operator untuk mengejar target stripping batubara.",
      factors: [
        {
          factor: "Kenaikan Konsumsi Fuel BBM (Solar B35)",
          category: "FUEL",
          impactIDR: 580000000,
          percentageContribution: 41.8,
          description: "Jarak angkut (hauling distance) dari Pit 1 South ke West Disposal Area bertambah +1.8 km (dari 3.2 km menjadi 5.0 km), meningkatkan konsumsi fuel fleet dump truck dari 0.65 L/BCM menjadi 0.74 L/BCM.",
          evidenceData: "Telemetry Fuel Sensor Fleet CAT 777G + Laporan Dispatch Ritase PIT 1",
          recommendedAction: "Buka jalur intermediate dump in-pit di Pit 1 RL +30 untuk memangkas jarak siklus 1.4 km.",
          estimatedSavingsIDR: 350000000,
        },
        {
          factor: "Unscheduled Maintenance & Part Rebuild Excavator",
          category: "MAINTENANCE",
          impactIDR: 390000000,
          percentageContribution: 28.1,
          description: "Kerusakan seal hidrolik mendadak dan kebocoran boom cylinder pada unit Excavator Komatsu PC1250 EX-204 yang membutuhkan penggantian spare part darurat dengan biaya expedited freight udara.",
          evidenceData: "Work Order WO-MNT-2026-0804 + Faktur Vendor United Tractors",
          recommendedAction: "Terapkan sampling oli rutin mingguan dan oil contamination check setiap 250 SMU.",
          estimatedSavingsIDR: 220000000,
        },
        {
          factor: "Kondisi Jalan Tambang Licin & Kecepatan Berkurang (Hauling)",
          category: "HAULING",
          impactIDR: 250000000,
          percentageContribution: 18.0,
          description: "Curah hujan tinggi pada minggu ke-2 Agustus menyebabkan degradasi jalan tambang KM 12-14. Kecepatan rata-rata hauling turun dari 24 km/jam menjadi 16 km/jam, memperpanjang cycle time sebesar 18%.",
          evidenceData: "GPS Speed Telemetry & Rain Gauge Station Pit 2 (Total Curah Hujan 142 mm)",
          recommendedAction: "Tingkatkan intensitas motor grader dan penambahan lapisan batu split (macadam) di segmen KM 12.",
          estimatedSavingsIDR: 150000000,
        },
        {
          factor: "Jam Lembur & Tenaga Kerja Tambahan (Labor)",
          category: "LABOR",
          impactIDR: 166000000,
          percentageContribution: 12.1,
          description: "Penambahan 140 jam lembur operator dan mekanik di shift 2 & shift 3 untuk mengejar ketertinggalan volume overburden pasca rain stoppage.",
          evidenceData: "Timesheet Operator HR & Dispatch Shift Catch-up Log",
          recommendedAction: "Optimalkan dispatch allocation dan roster rotasi operator saat cuaca cerah tanpa lembur berlebih.",
          estimatedSavingsIDR: 95000000,
        },
      ],
      quickActions: [
        "Aktivasi Intermediate In-Pit Disposal Sequence di Pit 1 South (Estimasi penghematan Rp 350 Juta)",
        "Jadwalkan Re-grading Macadam di Haul Road KM 12 oleh Tim Civil & Grader GD825",
        "Kirim Oil Sample Analisis PC1250 EX-204 ke Laboratorium Pelumas",
        "Batasi jam lembur non-kritis dengan optimasi fleet matching ratio 1:5",
      ],
    };
  }
}

function getStorageList<T>(key: string, defaultData: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(raw);
}

export const financeRepository = new FinanceRepository();
