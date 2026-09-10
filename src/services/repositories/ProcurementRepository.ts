// MINE SMART AI - Procurement Repository

import { BaseRepository } from "./BaseRepository";
import {
  PurchaseRequest,
  RFQ,
  Vendor,
  Quotation,
  QuotationComparison,
  PurchaseOrder,
  GoodsReceipt,
  QualityInspection,
  Invoice,
  ProcurementContract,
  CatalogItem,
  ProcurementKPISummary,
  ProcurementAIInsight,
  PriceHistoryRecord,
  DeliveryPerformanceRecord,
  PRStatus,
  POStatus,
  DeliveryStatus,
  InvoiceStatus,
  MatchingStatus,
} from "../../types/procurementTypes";
import { auditRepository } from "./AuditRepository";

// Initial Mock Vendors
const INITIAL_VENDORS: Vendor[] = [
  {
    id: "vnd-001",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-001",
    vendorCode: "VND-HEX-01",
    legalName: "PT Hexindo Adiperkasa Tbk",
    tradeName: "Hexindo Hitachi Mining",
    vendorType: "Authorized Heavy Equipment Distributor",
    category: "Heavy Equipment Parts",
    address: "Jl. Industri Mining No. 88, Balikpapan",
    city: "Balikpapan",
    province: "Kalimantan Timur",
    country: "Indonesia",
    phone: "+62 542 7654321",
    email: "mining.sales@hexindo.co.id",
    website: "https://www.hexindo-tbk.co.id",
    taxInformation: "NPWP 01.234.567.8-012.000 (PKP Verified)",
    bankInformationReference: "Bank Mandiri Cabang Balikpapan - A/C *****8821 (Verified)",
    contactPersons: [
      { name: "Bambang Sujipto", position: "Key Account Manager Mining", email: "bambang.s@hexindo.co.id", phone: "+62 811 5432 109", isPrimary: true },
      { name: "Siti Rahma", position: "Parts Sales Representative", email: "siti.rahma@hexindo.co.id", phone: "+62 812 9876 543" }
    ],
    status: "APPROVED",
    rating: 4.8,
    riskLevel: "LOW",
    hseComplianceStatus: "COMPLIANT",
    documents: [
      { id: "doc-v1-1", documentType: "Company Document", documentNumber: "AHU-001234.AH.01.01", issueDate: "2020-01-15", expiryDate: "2030-01-15", issuer: "Kemenkumham RI", verificationStatus: "VERIFIED" },
      { id: "doc-v1-2", documentType: "Tax Document", documentNumber: "01.234.567.8-012.000", issueDate: "2020-02-01", expiryDate: "2028-02-01", issuer: "DJP Kaltim", verificationStatus: "VERIFIED" },
      { id: "doc-v1-3", documentType: "HSE Document", documentNumber: "SMK3-MIN-2025-089", issueDate: "2025-06-01", expiryDate: "2027-06-01", issuer: "Kemenaker / Minerba", verificationStatus: "VERIFIED" }
    ],
    performanceMetrics: {
      onTimeDeliveryRate: 96.5,
      qualityAcceptanceRate: 99.2,
      averageLeadTimeDays: 7,
      priceCompetitivenessScore: 88.5
    },
    tags: ["Excavator", "OEM Parts", "Hitachi Authorized"],
    createdAt: "2025-01-10 08:00:00",
    updatedAt: "2026-08-01 10:00:00"
  },
  {
    id: "vnd-002",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-002",
    vendorCode: "VND-PERT-02",
    legalName: "PT Pertamina Patra Niaga",
    tradeName: "Pertamina Fuel Industrial",
    vendorType: "State Fuel Provider",
    category: "Fuel",
    address: "Jl. Lapangan Olahraga No. 12, Samarinda",
    city: "Samarinda",
    province: "Kalimantan Timur",
    country: "Indonesia",
    phone: "+62 541 2345678",
    email: "industrial.b35@pertamina.com",
    website: "https://www.pertaminapatraniaga.com",
    taxInformation: "NPWP 01.000.111.2-098.000 (PKP Verified)",
    bankInformationReference: "Bank BNI Cabang Samarinda - A/C *****9911 (Verified)",
    contactPersons: [
      { name: "Andi Wijaya", position: "Industrial Fuel Account Lead", email: "andi.wijaya@pertamina.com", phone: "+62 813 4567 890", isPrimary: true }
    ],
    status: "APPROVED",
    rating: 4.9,
    riskLevel: "LOW",
    hseComplianceStatus: "COMPLIANT",
    documents: [
      { id: "doc-v2-1", documentType: "Business License", documentNumber: "Izin Niaga Umum B35 #8821", issueDate: "2022-01-01", expiryDate: "2032-01-01", issuer: "ESDM / Ditjen Migas", verificationStatus: "VERIFIED" },
      { id: "doc-v2-2", documentType: "HSE Document", documentNumber: "PROPER-GREEN-2025", issueDate: "2025-01-15", expiryDate: "2027-01-15", issuer: "KLHK", verificationStatus: "VERIFIED" }
    ],
    performanceMetrics: {
      onTimeDeliveryRate: 98.0,
      qualityAcceptanceRate: 99.8,
      averageLeadTimeDays: 3,
      priceCompetitivenessScore: 92.0
    },
    tags: ["Solar B35", "Fuel Supply", "Critical Vendor"],
    createdAt: "2025-01-10 08:00:00",
    updatedAt: "2026-08-01 10:00:00"
  },
  {
    id: "vnd-003",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-003",
    vendorCode: "VND-GY-03",
    legalName: "PT Goodyear Indonesia Tbk",
    tradeName: "Goodyear OTR Tyres Mining",
    vendorType: "OTR Tyre Manufacturer",
    category: "Tyres",
    address: "Kawasan Industri Kariangau, Balikpapan",
    city: "Balikpapan",
    province: "Kalimantan Timur",
    country: "Indonesia",
    phone: "+62 542 8899100",
    email: "otr.mining@goodyear.co.id",
    website: "https://www.goodyear.co.id",
    taxInformation: "NPWP 01.555.444.3-011.000 (PKP Verified)",
    bankInformationReference: "Bank Mandiri Cabang Jakarta - A/C *****4431 (Verified)",
    contactPersons: [
      { name: "Deni Kurniawan", position: "Technical Tyre Consultant", email: "deni_kurniawan@goodyear.com", phone: "+62 811 9988 776", isPrimary: true }
    ],
    status: "APPROVED",
    rating: 4.6,
    riskLevel: "MEDIUM",
    hseComplianceStatus: "COMPLIANT",
    documents: [
      { id: "doc-v3-1", documentType: "Certification", documentNumber: "SNI-OTR-27-2024", issueDate: "2024-05-10", expiryDate: "2027-05-10", issuer: "BSN / SNI", verificationStatus: "VERIFIED" }
    ],
    performanceMetrics: {
      onTimeDeliveryRate: 91.2,
      qualityAcceptanceRate: 97.5,
      averageLeadTimeDays: 12,
      priceCompetitivenessScore: 85.0
    },
    tags: ["OTR Tyre", "Haul Truck 100T", "Heavy Radial"],
    createdAt: "2025-02-15 08:00:00",
    updatedAt: "2026-08-05 10:00:00"
  },
  {
    id: "vnd-004",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-004",
    vendorCode: "VND-SSB-04",
    legalName: "PT Sanggar Sarana Baja",
    tradeName: "SSB Engineering & Bucket Works",
    vendorType: "Specialized Fabricator",
    category: "Mining Supplies",
    address: "Jl. Mulawarman Km. 16, Manggar, Balikpapan",
    city: "Balikpapan",
    province: "Kalimantan Timur",
    country: "Indonesia",
    phone: "+62 542 770012",
    email: "sales.bkn@ssb.co.id",
    website: "https://www.ssb.co.id",
    taxInformation: "NPWP 01.333.222.1-015.000",
    bankInformationReference: "Bank BCA Cabang Balikpapan - A/C *****1122",
    contactPersons: [
      { name: "Hendra Setiawan", position: "Mining Workshop Manager", email: "hendra.s@ssb.co.id", phone: "+62 812 3344 5566", isPrimary: true }
    ],
    status: "APPROVED",
    rating: 4.5,
    riskLevel: "LOW",
    hseComplianceStatus: "COMPLIANT",
    documents: [
      { id: "doc-v4-1", documentType: "HSE Document", documentNumber: "CSMS-LEVEL-HIGH-2025", issueDate: "2025-03-01", expiryDate: "2026-09-01", issuer: "K3 Mining Dept", verificationStatus: "VERIFIED" }
    ],
    performanceMetrics: {
      onTimeDeliveryRate: 93.0,
      qualityAcceptanceRate: 98.0,
      averageLeadTimeDays: 10,
      priceCompetitivenessScore: 89.0
    },
    tags: ["Bucket Repair", "GET Wear Plates", "Chute Fabrication"],
    createdAt: "2025-03-01 08:00:00",
    updatedAt: "2026-08-10 09:00:00"
  }
];

// Initial Mock Purchase Requests
const INITIAL_PRS: PurchaseRequest[] = [
  {
    id: "pr-001",
    prId: "pr-001",
    prNumber: "PR-2026-0801-01",
    companyId: "comp-001",
    siteId: "site-001",
    departmentId: "dept-maint",
    departmentName: "Plant Maintenance",
    requesterId: "emp-005",
    requesterName: "Agus Pratama (Senior Maintenance Lead)",
    requestDate: "2026-08-01 09:15:00",
    requiredDate: "2026-08-20",
    priority: "URGENT",
    purpose: "Replacement filter hydraulic & engine overhaul kit untuk Excavator EX-01 (Hitachi PC1250) pasca breakdown WO-8821",
    category: "Heavy Equipment Parts",
    budgetId: "bg-2026-maint-01",
    budgetCode: "OPEX-MAINT-2026-Q3",
    status: "APPROVED",
    approvalStatus: "APPROVED",
    estimatedValue: 485000000,
    currency: "IDR",
    notes: "Pengadaan mendesak agar excavator EX-01 siap kembali beroperasi di Pit Alpha.",
    attachments: ["WO-8821_breakdown_inspection.pdf"],
    items: [
      {
        itemId: "pr-item-001",
        prId: "pr-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        description: "High efficiency hydraulic filter 10 micron for Hitachi EX1250/PC1250",
        category: "Heavy Equipment Parts",
        quantity: 12,
        unit: "PCS",
        estimatedUnitPrice: 12500000,
        estimatedTotal: 150000000,
        requiredDate: "2026-08-20",
        warehouseId: "wh-main",
        equipmentId: "EX-01",
        workOrderId: "WO-8821"
      },
      {
        itemId: "pr-item-002",
        prId: "pr-001",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        description: "Genuine overhaul kit Cummins QSK19 engine for Excavator EX-01",
        category: "Heavy Equipment Parts",
        quantity: 1,
        unit: "SET",
        estimatedUnitPrice: 335000000,
        estimatedTotal: 335000000,
        requiredDate: "2026-08-20",
        warehouseId: "wh-main",
        equipmentId: "EX-01",
        workOrderId: "WO-8821"
      }
    ],
    approvalChain: [
      { step: 1, role: "Supervisor", name: "Agus Pratama", status: "APPROVED", timestamp: "2026-08-01 09:30:00", comment: "Verified with maintenance breakdown log." },
      { step: 2, role: "Department Manager", name: "Ir. Hendra Wijaya", status: "APPROVED", timestamp: "2026-08-01 10:15:00", comment: "Budget approved under Q3 maintenance OPEX." },
      { step: 3, role: "Finance Manager", name: "Rina Kusuma", status: "APPROVED", timestamp: "2026-08-01 11:00:00", comment: "Budget verified available." }
    ],
    createdAt: "2026-08-01 09:15:00",
    updatedAt: "2026-08-01 11:00:00"
  },
  {
    id: "pr-002",
    prId: "pr-002",
    prNumber: "PR-2026-0805-02",
    companyId: "comp-001",
    siteId: "site-001",
    departmentId: "dept-logistics",
    departmentName: "Hauling & Logistics",
    requesterId: "emp-012",
    requesterName: "Budi Santoso (Logistics Superintendent)",
    requestDate: "2026-08-05 14:00:00",
    requiredDate: "2026-08-25",
    priority: "HIGH",
    purpose: "Pengadaan Ban OTR 27.00R49 Radial untuk Dump Truck HD-785 armada hauling Pit Beta",
    category: "Tyres",
    budgetId: "bg-2026-tyre-02",
    budgetCode: "OPEX-TYRE-2026-Q3",
    status: "APPROVED",
    approvalStatus: "APPROVED",
    estimatedValue: 720000000,
    currency: "IDR",
    notes: "Penggantian ban gundul sesuai checklist HSE mingguan.",
    items: [
      {
        itemId: "pr-item-003",
        prId: "pr-002",
        itemCode: "TYR-OTR-27R49",
        itemName: "OTR Tyre 27.00R49 E4 Radial Tubeless",
        description: "Heavy duty mining OTR radial tyre for 100 Ton rigid dump truck HD785",
        category: "Tyres",
        quantity: 6,
        unit: "UNIT",
        estimatedUnitPrice: 120000000,
        estimatedTotal: 720000000,
        requiredDate: "2026-08-25",
        warehouseId: "wh-tyre"
      }
    ],
    approvalChain: [
      { step: 1, role: "Supervisor", name: "Budi Santoso", status: "APPROVED", timestamp: "2026-08-05 14:10:00" },
      { step: 2, role: "Department Manager", name: "Ir. Hendra Wijaya", status: "APPROVED", timestamp: "2026-08-05 15:30:00" }
    ],
    createdAt: "2026-08-05 14:00:00",
    updatedAt: "2026-08-05 15:30:00"
  },
  {
    id: "pr-003",
    prId: "pr-003",
    prNumber: "PR-2026-0810-03",
    companyId: "comp-001",
    siteId: "site-001",
    departmentId: "dept-hse",
    departmentName: "HSE & Environment",
    requesterId: "emp-020",
    requesterName: "Siti Rahayu (HSE Manager)",
    requestDate: "2026-08-10 11:00:00",
    requiredDate: "2026-08-28",
    priority: "NORMAL",
    purpose: "Pengadaan APD Tambang (Safety Boots, Helm Vented, Vest Reflektif 3M, Respirator Dust Proof) batch Q3",
    category: "Safety Equipment",
    budgetId: "bg-2026-hse-01",
    budgetCode: "OPEX-HSE-2026-Q3",
    status: "UNDER_REVIEW",
    approvalStatus: "PENDING_FINANCE",
    estimatedValue: 145000000,
    currency: "IDR",
    notes: "Distribusi untuk 150 pekerja operasional baru dan pembaruan APD aus.",
    items: [
      {
        itemId: "pr-item-004",
        prId: "pr-003",
        itemCode: "PPE-BOOTS-SAF",
        itemName: "Safety Boots Heavy Mining High Cut Steel Toe",
        description: "Waterproof steel toe boots EN ISO 20345 compliant",
        category: "PPE",
        quantity: 150,
        unit: "PAIR",
        estimatedUnitPrice: 650000,
        estimatedTotal: 97500000,
        requiredDate: "2026-08-28",
        warehouseId: "wh-main"
      },
      {
        itemId: "pr-item-005",
        prId: "pr-003",
        itemCode: "PPE-VEST-3M",
        itemName: "Mining Safety Vest High Visibility 3M Reflective",
        description: "Flame resistant high vis vest with radio pocket",
        category: "PPE",
        quantity: 190,
        unit: "PCS",
        estimatedUnitPrice: 250000,
        estimatedTotal: 47500000,
        requiredDate: "2026-08-28",
        warehouseId: "wh-main"
      }
    ],
    approvalChain: [
      { step: 1, role: "Department Manager", name: "Siti Rahayu", status: "APPROVED", timestamp: "2026-08-10 11:15:00" },
      { step: 2, role: "Finance Manager", name: "Rina Kusuma", status: "PENDING" }
    ],
    createdAt: "2026-08-10 11:00:00",
    updatedAt: "2026-08-10 11:15:00"
  }
];

// Initial Mock RFQs
const INITIAL_RFQS: RFQ[] = [
  {
    id: "rfq-001",
    rfqId: "rfq-001",
    rfqNumber: "RFQ-2026-0802-01",
    companyId: "comp-001",
    siteId: "site-001",
    prId: "pr-001",
    prNumber: "PR-2026-0801-01",
    issueDate: "2026-08-02",
    closingDate: "2026-08-08",
    currency: "IDR",
    deliveryLocation: "Warehouse Main Site Lati, Berau, Kaltim",
    paymentTerms: "NET 30 Days after Goods Receipt",
    deliveryTerms: "DDP Site Lati",
    status: "RESPONSES_RECEIVED",
    notes: "Pengadaan suku cadang excavator Hitachi PC1250",
    invitedVendorIds: ["vnd-001", "vnd-004"],
    invitedVendors: [
      { vendorId: "vnd-001", vendorName: "PT Hexindo Adiperkasa Tbk", invitationStatus: "RESPONDED", responseDate: "2026-08-04 11:00:00" },
      { vendorId: "vnd-004", vendorName: "PT Sanggar Sarana Baja", invitationStatus: "RESPONDED", responseDate: "2026-08-05 14:30:00" }
    ],
    items: [
      {
        rfqItemId: "rfq-item-001",
        rfqId: "rfq-001",
        prItemId: "pr-item-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        specification: "10 micron hydraulic filter element genuine or equivalent OEM",
        quantity: 12,
        unit: "PCS",
        requiredDate: "2026-08-20",
        deliveryLocation: "Main Site Lati Warehouse"
      },
      {
        rfqItemId: "rfq-item-002",
        rfqId: "rfq-001",
        prItemId: "pr-item-002",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        specification: "Genuine Cummins QSK19 overhaul gasket & seal set",
        quantity: 1,
        unit: "SET",
        requiredDate: "2026-08-20",
        deliveryLocation: "Main Site Lati Warehouse"
      }
    ],
    createdAt: "2026-08-02 08:00:00",
    updatedAt: "2026-08-05 15:00:00"
  }
];

// Initial Mock Quotations
const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "quot-001",
    quotationId: "quot-001",
    quotationNumber: "QUO-HEX-2026-0089",
    rfqId: "rfq-001",
    rfqNumber: "RFQ-2026-0802-01",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    quotationDate: "2026-08-04",
    validUntil: "2026-08-30",
    currency: "IDR",
    paymentTerms: "TOP 30 Hari",
    deliveryTerms: "DDP Site Lati",
    leadTimeDays: 7,
    shippingCost: 15000000,
    taxAmount: 48950000, // 11% PPN
    discountAmount: 10000000,
    subtotal: 445000000,
    grandTotal: 498950000,
    status: "ACCEPTED",
    technicalScore: 98,
    priceScore: 92,
    totalScore: 95.2,
    items: [
      {
        quotationItemId: "quo-item-001",
        quotationId: "quot-001",
        rfqItemId: "rfq-item-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        description: "Hitachi Genuine Filter #4658821",
        quantity: 12,
        unit: "PCS",
        unitPrice: 12000000,
        discount: 0,
        taxRate: 11,
        subtotal: 144000000,
        total: 159840000,
        leadTimeDays: 5,
        brand: "Hitachi Genuine",
        model: "EX1250-6",
        warranty: "12 Months / 2,000 Hours"
      },
      {
        quotationItemId: "quo-item-002",
        quotationId: "quot-001",
        rfqItemId: "rfq-item-002",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        description: "Cummins Genuine Overhaul Kit #4089882",
        quantity: 1,
        unit: "SET",
        unitPrice: 301000000,
        discount: 10000000,
        taxRate: 11,
        subtotal: 291000000,
        total: 323010000,
        leadTimeDays: 7,
        brand: "Cummins Genuine",
        model: "QSK19",
        warranty: "12 Months / 4,000 Hours"
      }
    ],
    validationWarnings: [],
    createdAt: "2026-08-04 11:00:00",
    updatedAt: "2026-08-06 10:00:00"
  },
  {
    id: "quot-002",
    quotationId: "quot-002",
    quotationNumber: "QUO-SSB-2026-0142",
    rfqId: "rfq-001",
    rfqNumber: "RFQ-2026-0802-01",
    vendorId: "vnd-004",
    vendorName: "PT Sanggar Sarana Baja",
    quotationDate: "2026-08-05",
    validUntil: "2026-08-25",
    currency: "IDR",
    paymentTerms: "TOP 30 Hari",
    deliveryTerms: "DDP Site Lati",
    leadTimeDays: 12,
    shippingCost: 18000000,
    taxAmount: 51150000,
    discountAmount: 0,
    subtotal: 465000000,
    grandTotal: 534150000,
    status: "REJECTED",
    technicalScore: 88,
    priceScore: 84,
    totalScore: 86.0,
    items: [
      {
        quotationItemId: "quo-item-003",
        quotationId: "quot-002",
        rfqItemId: "rfq-item-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        description: "Donaldson OEM Replacement Hydraulic Filter",
        quantity: 12,
        unit: "PCS",
        unitPrice: 12500000,
        discount: 0,
        taxRate: 11,
        subtotal: 150000000,
        total: 166500000,
        leadTimeDays: 10,
        brand: "Donaldson OEM",
        warranty: "6 Months"
      },
      {
        quotationItemId: "quo-item-004",
        quotationId: "quot-002",
        rfqItemId: "rfq-item-002",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        description: "Aftermarket Heavy Duty Overhaul Gasket Kit QSK19",
        quantity: 1,
        unit: "SET",
        unitPrice: 315000000,
        discount: 0,
        taxRate: 11,
        subtotal: 315000000,
        total: 349650000,
        leadTimeDays: 12,
        brand: "SSB Equivalent",
        warranty: "6 Months"
      }
    ],
    validationWarnings: ["Non-genuine engine kit warning", "Longer lead time (12 days vs 7 days requirement)"],
    createdAt: "2026-08-05 14:30:00",
    updatedAt: "2026-08-06 10:00:00"
  }
];

// Initial Mock Purchase Orders
const INITIAL_POS: PurchaseOrder[] = [
  {
    id: "po-001",
    poId: "po-001",
    poNumber: "PO-2026-0806-01",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    prId: "pr-001",
    prNumber: "PR-2026-0801-01",
    rfqId: "rfq-001",
    quotationId: "quot-001",
    poDate: "2026-08-06",
    deliveryDate: "2026-08-15",
    currency: "IDR",
    paymentTerms: "TOP 30 Hari after 3-Way Matching",
    deliveryTerms: "DDP Main Site Lati Warehouse",
    shippingAddress: "Gudang Utama Site Lati, PT Berau Coal & Partners, Sambaliung, Berau, Kaltim",
    billingAddress: "PT Mine Smart Indonesia, Gedung Palma Tower Lt. 18, Jakarta Selatan",
    subtotal: 445000000,
    discount: 10000000,
    tax: 48950000,
    shippingCost: 15000000,
    grandTotal: 498950000,
    status: "PARTIALLY_RECEIVED",
    approvalStatus: "APPROVED",
    createdBy: "Ir. Hendra Wijaya (Procurement Lead)",
    approvedBy: "Drs. Ahmad Subagyo (General Manager Procurement)",
    currentRevision: 0,
    revisionHistory: [
      {
        revisionNumber: 0,
        changedBy: "Ir. Hendra Wijaya",
        changeDate: "2026-08-06 11:30:00",
        changeReason: "Initial Purchase Order Issued based on approved PR-2026-0801-01 and quotation QUO-HEX-2026-0089",
        previousGrandTotal: 498950000,
        newGrandTotal: 498950000
      }
    ],
    items: [
      {
        poItemId: "po-item-001",
        poId: "po-001",
        prItemId: "pr-item-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        description: "Hitachi Genuine Filter #4658821",
        quantity: 12,
        unit: "PCS",
        unitPrice: 12000000,
        discount: 0,
        taxRate: 11,
        subtotal: 144000000,
        expectedDeliveryDate: "2026-08-15",
        warehouseId: "wh-main",
        costCenterId: "CC-MAINT-01",
        equipmentId: "EX-01"
      },
      {
        poItemId: "po-item-002",
        poId: "po-001",
        prItemId: "pr-item-002",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        description: "Cummins Genuine Overhaul Kit #4089882",
        quantity: 1,
        unit: "SET",
        unitPrice: 301000000,
        discount: 10000000,
        taxRate: 11,
        subtotal: 291000000,
        expectedDeliveryDate: "2026-08-15",
        warehouseId: "wh-main",
        costCenterId: "CC-MAINT-01",
        equipmentId: "EX-01"
      }
    ],
    receivedQtySummary: {
      ordered: 13,
      received: 12,
      percentage: 92.3
    },
    createdAt: "2026-08-06 11:30:00",
    updatedAt: "2026-08-12 14:00:00"
  },
  {
    id: "po-002",
    poId: "po-002",
    poNumber: "PO-2026-0808-02",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-002",
    vendorName: "PT Pertamina Patra Niaga",
    prId: "pr-fuel-aug",
    prNumber: "PR-2026-0801-00",
    poDate: "2026-08-08",
    deliveryDate: "2026-08-12",
    currency: "IDR",
    paymentTerms: "TOP 14 Hari",
    deliveryTerms: "FOB Tangki Fuel Site Lati",
    shippingAddress: "Fuel Station Terminal 01 Site Lati",
    billingAddress: "PT Mine Smart Indonesia Corporate Office",
    subtotal: 1500000000,
    discount: 0,
    tax: 165000000,
    shippingCost: 0,
    grandTotal: 1665000000,
    status: "FULLY_RECEIVED",
    approvalStatus: "APPROVED",
    createdBy: "Samsul Arifin (Fuel Procurement Officer)",
    approvedBy: "Drs. Ahmad Subagyo (GM Procurement)",
    currentRevision: 0,
    revisionHistory: [],
    items: [
      {
        poItemId: "po-item-003",
        poId: "po-002",
        itemCode: "FUL-SOL-B35",
        itemName: "Bio Solar B35 Industri",
        description: "High Quality Mining Diesel Fuel B35 Compliant ESDM",
        quantity: 100000,
        unit: "LITER",
        unitPrice: 15000,
        discount: 0,
        taxRate: 11,
        subtotal: 1500000000,
        expectedDeliveryDate: "2026-08-12",
        warehouseId: "wh-fuel-01"
      }
    ],
    receivedQtySummary: {
      ordered: 100000,
      received: 100000,
      percentage: 100.0
    },
    createdAt: "2026-08-08 09:00:00",
    updatedAt: "2026-08-12 16:00:00"
  }
];

// Initial Mock Goods Receipts
const INITIAL_RECEIPTS: GoodsReceipt[] = [
  {
    id: "rcpt-001",
    receiptId: "rcpt-001",
    receiptNumber: "GR-2026-0812-01",
    companyId: "comp-001",
    siteId: "site-001",
    poId: "po-001",
    poNumber: "PO-2026-0806-01",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    warehouseId: "wh-main",
    warehouseName: "Gudang Main Spareparts Lati",
    receivedDate: "2026-08-12 10:30:00",
    receivedBy: "Yudi Prasetyo (Warehouse Superintendent)",
    deliveryReference: "SJ-HEX-2026-8801 / Resi Truck Tronton KT-8821-AW",
    driverName: "Suratman",
    vehiclePlateNo: "KT 8821 AW",
    status: "PARTIALLY_RECEIVED",
    notes: "Pengiriman batch 1: 12 Pcs Hydraulic Return Filter diterima dalam kondisi segel intact. Item Overhaul Kit QSK19 dikirim terpisah via airfreight besok.",
    inspectionRequired: true,
    inspectionStatus: "PASSED",
    items: [
      {
        receivingItemId: "rcpt-item-001",
        receiptId: "rcpt-001",
        poItemId: "po-item-001",
        itemCode: "FLT-HYD-EX1250",
        itemName: "Hydraulic Return Filter Element PC1250",
        orderedQty: 12,
        deliveredQty: 12,
        acceptedQty: 12,
        rejectedQty: 0,
        remainingQty: 0,
        unit: "PCS",
        unitPrice: 12000000,
        warehouseId: "wh-main",
        notes: "Lolos QC fisik & kelengkapan part number"
      },
      {
        receivingItemId: "rcpt-item-002",
        receiptId: "rcpt-001",
        poItemId: "po-item-002",
        itemCode: "KIT-OVH-CUMMINS",
        itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
        orderedQty: 1,
        deliveredQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        remainingQty: 1,
        unit: "SET",
        unitPrice: 301000000,
        warehouseId: "wh-main",
        notes: "Pending delivery batch 2 (Expected 14 Aug 2026)"
      }
    ],
    createdAt: "2026-08-12 10:30:00",
    updatedAt: "2026-08-12 11:15:00"
  }
];

// Initial Quality Inspections
const INITIAL_INSPECTIONS: QualityInspection[] = [
  {
    inspectionId: "qc-001",
    receiptId: "rcpt-001",
    receiptNumber: "GR-2026-0812-01",
    poNumber: "PO-2026-0806-01",
    inspectionDate: "2026-08-12 11:00:00",
    inspectorName: "Dedi Suhendar (QC Maintenance Inspector)",
    itemCode: "FLT-HYD-EX1250",
    itemName: "Hydraulic Return Filter Element PC1250",
    specification: "Hitachi Genuine Spec 10 micron, Original Seal Stamp #4658821",
    result: "PASSED",
    acceptedQty: 12,
    rejectedQty: 0,
    rejectionReason: undefined
  }
];

// Initial Mock Invoices
const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoiceId: "inv-001",
    invoiceNumber: "INV-HEX-2026-0881",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poId: "po-001",
    poNumber: "PO-2026-0806-01",
    receiptId: "rcpt-001",
    receiptNumber: "GR-2026-0812-01",
    invoiceDate: "2026-08-13",
    dueDate: "2026-09-12",
    currency: "IDR",
    subtotal: 144000000,
    discount: 0,
    tax: 15840000,
    shippingCost: 5000000,
    grandTotal: 164840000,
    status: "MATCHED",
    matchingStatus: "MATCHED",
    matchingDiscrepancies: [],
    duplicateRisk: false,
    createdAt: "2026-08-13 09:00:00",
    updatedAt: "2026-08-13 09:30:00"
  }
];

// Initial Contracts
const INITIAL_CONTRACTS: ProcurementContract[] = [
  {
    id: "cnt-001",
    contractId: "cnt-001",
    contractNumber: "CTR-2025-PERT-FUEL-01",
    contractType: "LTA_CONTRACT",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-002",
    vendorName: "PT Pertamina Patra Niaga",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    value: 25000000000,
    utilizedValue: 18450000000,
    currency: "IDR",
    scope: "Kontrak Pasokan Solar B35 Industri untuk seluruh armada alat berat Tambang Lati (Est 1.5 Juta Liter / Bulan)",
    category: "Fuel",
    status: "ACTIVE",
    paymentTerms: "TOP 30 Hari after monthly reconciliation",
    slaTerms: "On-Time Delivery Guarantee >98%, Min Fuel Density 845 kg/m3",
    createdAt: "2025-01-01 00:00:00",
    updatedAt: "2026-08-01 00:00:00"
  },
  {
    id: "cnt-002",
    contractId: "cnt-002",
    contractNumber: "CTR-2025-HEX-PARTS-02",
    contractType: "CONSIGNMENT",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    startDate: "2025-06-01",
    endDate: "2026-09-30",
    value: 12000000000,
    utilizedValue: 10800000000,
    currency: "IDR",
    scope: "Consignment & Maintenance Spare Part Master Agreement untuk Excavator PC1250/PC2000",
    category: "Heavy Equipment Parts",
    status: "EXPIRING_SOON",
    paymentTerms: "TOP 30 Hari after consumption Goods Issue",
    slaTerms: "Buffer stock maintained in site depot, 24/7 technical assistance",
    createdAt: "2025-06-01 00:00:00",
    updatedAt: "2026-08-01 00:00:00"
  },
  {
    id: "cnt-003",
    contractId: "cnt-003",
    contractNumber: "CTR-2026-GY-TYRES-03",
    contractType: "BLANKET_PO",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-003",
    vendorName: "PT Goodyear Indonesia Tbk",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    value: 8500000000,
    utilizedValue: 4200000000,
    currency: "IDR",
    scope: "Master Supply Agreement Ban OTR Radial 27.00R49 untuk Dump Truck 100 Ton Pit Alpha & Beta",
    category: "Tyres",
    status: "ACTIVE",
    paymentTerms: "TOP 45 Hari",
    slaTerms: "Tyre life warranty minimum 4,500 Operating Hours, monthly scrap inspection",
    createdAt: "2026-01-01 00:00:00",
    updatedAt: "2026-08-01 00:00:00"
  },
  {
    id: "cnt-004",
    contractId: "cnt-004",
    contractNumber: "CTR-2025-SSB-FAB-04",
    contractType: "SERVICE_AGREEMENT",
    companyId: "comp-001",
    siteId: "site-001",
    vendorId: "vnd-004",
    vendorName: "PT Sanggar Sarana Baja",
    startDate: "2025-08-01",
    endDate: "2026-08-01",
    value: 4200000000,
    utilizedValue: 4200000000,
    currency: "IDR",
    scope: "Rekondisi & Hardfacing Excavator Bucket, GET Lip Shroud & Chute Fabrication Service",
    category: "Mining Supplies",
    status: "EXPIRED",
    paymentTerms: "TOP 30 Hari after QA/QC sign-off",
    slaTerms: "Hardfacing weld integrity guaranteed 2,000 Hours",
    createdAt: "2025-08-01 00:00:00",
    updatedAt: "2026-08-05 00:00:00"
  }
];

// Initial Price History Records
const INITIAL_PRICE_HISTORY: PriceHistoryRecord[] = [
  {
    id: "ph-001",
    itemCode: "FLT-HYD-EX1250",
    itemName: "Hydraulic Return Filter Element PC1250",
    category: "Heavy Equipment Parts",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0806-01",
    poDate: "2026-08-06",
    unitPrice: 12000000,
    quantity: 12,
    unit: "PCS",
    currency: "IDR",
    priceVariancePct: -2.04,
    notes: "Volume tier 1 discount applied"
  },
  {
    id: "ph-002",
    itemCode: "FLT-HYD-EX1250",
    itemName: "Hydraulic Return Filter Element PC1250",
    category: "Heavy Equipment Parts",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0512-04",
    poDate: "2026-05-12",
    unitPrice: 12250000,
    quantity: 8,
    unit: "PCS",
    currency: "IDR",
    priceVariancePct: 0.0,
    notes: "Regular scheduled maintenance order"
  },
  {
    id: "ph-003",
    itemCode: "FLT-HYD-EX1250",
    itemName: "Hydraulic Return Filter Element PC1250",
    category: "Heavy Equipment Parts",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0210-02",
    poDate: "2026-02-10",
    unitPrice: 12500000,
    quantity: 10,
    unit: "PCS",
    currency: "IDR",
    priceVariancePct: 2.04,
    notes: "Q1 baseline price"
  },
  {
    id: "ph-004",
    itemCode: "KIT-OVH-CUMMINS",
    itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
    category: "Heavy Equipment Parts",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0806-01",
    poDate: "2026-08-06",
    unitPrice: 291000000,
    quantity: 1,
    unit: "SET",
    currency: "IDR",
    priceVariancePct: -1.35,
    notes: "Negotiated discount savings vs PR estimate Rp 335M"
  },
  {
    id: "ph-005",
    itemCode: "KIT-OVH-CUMMINS",
    itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
    category: "Heavy Equipment Parts",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2025-1120-09",
    poDate: "2025-11-20",
    unitPrice: 295000000,
    quantity: 1,
    unit: "SET",
    currency: "IDR",
    priceVariancePct: 0.0,
    notes: "Annual major rebuild kit"
  },
  {
    id: "ph-006",
    itemCode: "TYR-OTR-27R49",
    itemName: "OTR Tyre 27.00R49 E4 Radial Tubeless",
    category: "Tyres",
    vendorId: "vnd-003",
    vendorName: "PT Goodyear Indonesia Tbk",
    poNumber: "PO-2026-0718-03",
    poDate: "2026-07-18",
    unitPrice: 120000000,
    quantity: 6,
    unit: "UNIT",
    currency: "IDR",
    priceVariancePct: -1.23,
    notes: "Blanket PO contracted rate"
  },
  {
    id: "ph-007",
    itemCode: "TYR-OTR-27R49",
    itemName: "OTR Tyre 27.00R49 E4 Radial Tubeless",
    category: "Tyres",
    vendorId: "vnd-003",
    vendorName: "PT Goodyear Indonesia Tbk",
    poNumber: "PO-2026-0315-01",
    poDate: "2026-03-15",
    unitPrice: 121500000,
    quantity: 4,
    unit: "UNIT",
    currency: "IDR",
    priceVariancePct: 0.0,
    notes: "Spot purchase before LTA lock"
  },
  {
    id: "ph-008",
    itemCode: "FUL-SOL-B35",
    itemName: "Bio Solar B35 Industri",
    category: "Fuel",
    vendorId: "vnd-002",
    vendorName: "PT Pertamina Patra Niaga",
    poNumber: "PO-2026-0801-01",
    poDate: "2026-08-01",
    unitPrice: 15000,
    quantity: 1500000,
    unit: "LITER",
    currency: "IDR",
    priceVariancePct: 1.01,
    notes: "MOPS benchmark adjustment index"
  },
  {
    id: "ph-009",
    itemCode: "FUL-SOL-B35",
    itemName: "Bio Solar B35 Industri",
    category: "Fuel",
    vendorId: "vnd-002",
    vendorName: "PT Pertamina Patra Niaga",
    poNumber: "PO-2026-0701-01",
    poDate: "2026-07-01",
    unitPrice: 14850,
    quantity: 1500000,
    unit: "LITER",
    currency: "IDR",
    priceVariancePct: 0.0,
    notes: "July official industrial rate"
  },
  {
    id: "ph-010",
    itemCode: "OIL-15W40-DRUM",
    itemName: "Engine Oil Shell Rimula R4X 15W-40 (209L)",
    category: "Lubricants",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0810-02",
    poDate: "2026-08-10",
    unitPrice: 9800000,
    quantity: 15,
    unit: "DRUM",
    currency: "IDR",
    priceVariancePct: -2.0,
    notes: "Bulk lubrication agreement"
  }
];

// Initial Delivery Performance Records
const INITIAL_DELIVERY_PERFORMANCE: DeliveryPerformanceRecord[] = [
  {
    id: "dp-001",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0806-01",
    receiptNumber: "GR-2026-0812-01",
    expectedDate: "2026-08-15",
    actualDate: "2026-08-12",
    leadTimeDaysPromised: 7,
    leadTimeDaysActual: 6,
    varianceDays: -3,
    onTimeStatus: "EARLY",
    defectCount: 0,
    totalReceivedQty: 8,
    acceptedQty: 8,
    rejectedQty: 0,
    deliveryRating: 5.0,
    notes: "Delivered 3 days ahead of schedule via Balikpapan express truck"
  },
  {
    id: "dp-002",
    vendorId: "vnd-001",
    vendorName: "PT Hexindo Adiperkasa Tbk",
    poNumber: "PO-2026-0512-04",
    receiptNumber: "GR-2026-0519-02",
    expectedDate: "2026-05-19",
    actualDate: "2026-05-19",
    leadTimeDaysPromised: 7,
    leadTimeDaysActual: 7,
    varianceDays: 0,
    onTimeStatus: "ON_TIME",
    defectCount: 0,
    totalReceivedQty: 8,
    acceptedQty: 8,
    rejectedQty: 0,
    deliveryRating: 4.8,
    notes: "Perfect lead time compliance"
  },
  {
    id: "dp-003",
    vendorId: "vnd-002",
    vendorName: "PT Pertamina Patra Niaga",
    poNumber: "PO-2026-0801-01",
    receiptNumber: "GR-2026-0803-01",
    expectedDate: "2026-08-04",
    actualDate: "2026-08-03",
    leadTimeDaysPromised: 3,
    leadTimeDaysActual: 2,
    varianceDays: -1,
    onTimeStatus: "EARLY",
    defectCount: 0,
    totalReceivedQty: 500000,
    acceptedQty: 500000,
    rejectedQty: 0,
    deliveryRating: 5.0,
    notes: "Barge delivery to Jetty Lati on schedule"
  },
  {
    id: "dp-004",
    vendorId: "vnd-003",
    vendorName: "PT Goodyear Indonesia Tbk",
    poNumber: "PO-2026-0718-03",
    receiptNumber: "GR-2026-0730-01",
    expectedDate: "2026-07-25",
    actualDate: "2026-07-30",
    leadTimeDaysPromised: 7,
    leadTimeDaysActual: 12,
    varianceDays: 5,
    onTimeStatus: "DELAYED",
    defectCount: 0,
    totalReceivedQty: 6,
    acceptedQty: 6,
    rejectedQty: 0,
    deliveryRating: 3.8,
    notes: "Barge delay at Surabaya Port caused 5 days delay"
  },
  {
    id: "dp-005",
    vendorId: "vnd-004",
    vendorName: "PT Sanggar Sarana Baja",
    poNumber: "PO-2026-0620-01",
    receiptNumber: "GR-2026-0630-02",
    expectedDate: "2026-06-30",
    actualDate: "2026-06-30",
    leadTimeDaysPromised: 10,
    leadTimeDaysActual: 10,
    varianceDays: 0,
    onTimeStatus: "ON_TIME",
    defectCount: 0,
    totalReceivedQty: 2,
    acceptedQty: 2,
    rejectedQty: 0,
    deliveryRating: 4.6,
    notes: "Bucket overhaul passed QA/QC dimensional check"
  }
];

// Initial Catalog Items
const INITIAL_CATALOG: CatalogItem[] = [
  {
    itemCode: "FLT-HYD-EX1250",
    itemName: "Hydraulic Return Filter Element PC1250",
    category: "Heavy Equipment Parts",
    specification: "10 micron high efficiency hydraulic filter element, Hitachi #4658821",
    unit: "PCS",
    preferredVendorId: "vnd-001",
    preferredVendorName: "PT Hexindo Adiperkasa Tbk",
    lastPurchasePrice: 12000000,
    avgPurchasePrice: 12250000,
    leadTimeDays: 7,
    stockAvailable: 4,
    minStockLevel: 6
  },
  {
    itemCode: "KIT-OVH-CUMMINS",
    itemName: "Engine Gasket & Seal Overhaul Kit QSK19",
    category: "Heavy Equipment Parts",
    specification: "Cummins Genuine Overhaul Kit #4089882",
    unit: "SET",
    preferredVendorId: "vnd-001",
    preferredVendorName: "PT Hexindo Adiperkasa Tbk",
    lastPurchasePrice: 291000000,
    avgPurchasePrice: 295000000,
    leadTimeDays: 7,
    stockAvailable: 0,
    minStockLevel: 1
  },
  {
    itemCode: "TYR-OTR-27R49",
    itemName: "OTR Tyre 27.00R49 E4 Radial Tubeless",
    category: "Tyres",
    specification: "Heavy duty mining OTR radial tyre for 100 Ton rigid dump truck HD785",
    unit: "UNIT",
    preferredVendorId: "vnd-003",
    preferredVendorName: "PT Goodyear Indonesia Tbk",
    lastPurchasePrice: 120000000,
    avgPurchasePrice: 121500000,
    leadTimeDays: 12,
    stockAvailable: 2,
    minStockLevel: 8
  },
  {
    itemCode: "FUL-SOL-B35",
    itemName: "Bio Solar B35 Industri",
    category: "Fuel",
    specification: "Bio Solar B35 Industri ESDM Standard",
    unit: "LITER",
    preferredVendorId: "vnd-002",
    preferredVendorName: "PT Pertamina Patra Niaga",
    lastPurchasePrice: 15000,
    avgPurchasePrice: 14850,
    leadTimeDays: 3,
    stockAvailable: 85000,
    minStockLevel: 50000
  }
];

// Initial AI Insights
const INITIAL_AI_INSIGHTS: ProcurementAIInsight[] = [
  {
    id: "ai-proc-01",
    type: "DELIVERY_RISK",
    title: "Proyeksi Keterlambatan Pasokan Ban OTR 27.00R49",
    finding: "Lead time Vendor PT Goodyear Indonesia meningkat dari rerata 7 hari menjadi 12 hari akibat restriksi logistik kapal kargo Tanjung Perak - Balikpapan.",
    evidence: "Orders: 3 PO Terakhir | Lead Time Expected: 7 Hari | Lead Time Actual: 12.2 Hari | Buffer Stock Site: 2 Unit (Kritis < 8 Unit).",
    trend: "Tren keterlambatan meningkat 40% dalam 2 bulan terakhir.",
    possibleCause: "Kongesti jadwal pelayaran kapal kargo kontainer OTR dan lonjakan permintaan ban komoditas mineral Kaltim.",
    risk: "Resiko armada Dump Truck HD-785 Pit Beta mengalami idle/standstill karena ketiadaan ban cadangan.",
    recommendation: "Lakukan penerbitan PO buffer stock tambahan 4 unit lebih awal (Early Reorder) atau minta expedited barge shipment langsung dari Surabaya.",
    expectedImpact: "Menghindari resiko kerugian produksi 15.000 BCM OB per hari akibat DT breakdown.",
    confidence: "High",
    date: "2026-08-14"
  },
  {
    id: "ai-proc-02",
    type: "PRICE_VARIANCE",
    title: "Efisiensi Pembelian Sparepart Overhaul Cummins QSK19 (Savings 3.3%)",
    finding: "Negosiasi quotation QUO-HEX-2026-0089 berhasil menurunkan unit price Kit Overhaul dari estimasi awal Rp 335.000.000 menjadi Rp 291.000.000.",
    evidence: "PR Estimated: Rp 335.000.000 | Final Agreed PO: Rp 291.000.000 | Total Direct Cost Savings: Rp 44.000.000.",
    trend: "Konsistensi harga genuine part Hexindo berada 4.2% di bawah batas pagu budget OPEX Q3.",
    possibleCause: "Skema diskon volume tahunan master agreement PT Hexindo Adiperkasa.",
    risk: "Minimal.",
    recommendation: "Pertahankan alokasi order konsinyasi tahunan dengan Hexindo untuk mengunci diskon Tier 1.",
    expectedImpact: "Penghematan anggaran perawatan alat berat sebesar Rp 44 Juta per paket overhaul.",
    confidence: "High",
    date: "2026-08-14"
  }
];

export class ProcurementRepository extends BaseRepository<any> {
  private prsKey = "mine_smart_procurement_prs";
  private rfqsKey = "mine_smart_procurement_rfqs";
  private vendorsKey = "mine_smart_procurement_vendors";
  private quotationsKey = "mine_smart_procurement_quotations";
  private posKey = "mine_smart_procurement_pos";
  private receiptsKey = "mine_smart_procurement_receipts";
  private inspectionsKey = "mine_smart_procurement_inspections";
  private invoicesKey = "mine_smart_procurement_invoices";
  private contractsKey = "mine_smart_procurement_contracts";
  private catalogKey = "mine_smart_procurement_catalog";
  private aiInsightsKey = "mine_smart_procurement_ai_insights";
  private priceHistoryKey = "mine_smart_procurement_price_history";
  private deliveryPerformanceKey = "mine_smart_procurement_delivery_perf";

  constructor() {
    super("mine_smart_procurement_prs", INITIAL_PRS);
    this.initLocalStorage();
  }

  private initLocalStorage() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(this.vendorsKey)) {
      localStorage.setItem(this.vendorsKey, JSON.stringify(INITIAL_VENDORS));
    }
    if (!localStorage.getItem(this.prsKey)) {
      localStorage.setItem(this.prsKey, JSON.stringify(INITIAL_PRS));
    }
    if (!localStorage.getItem(this.rfqsKey)) {
      localStorage.setItem(this.rfqsKey, JSON.stringify(INITIAL_RFQS));
    }
    if (!localStorage.getItem(this.quotationsKey)) {
      localStorage.setItem(this.quotationsKey, JSON.stringify(INITIAL_QUOTATIONS));
    }
    if (!localStorage.getItem(this.posKey)) {
      localStorage.setItem(this.posKey, JSON.stringify(INITIAL_POS));
    }
    if (!localStorage.getItem(this.receiptsKey)) {
      localStorage.setItem(this.receiptsKey, JSON.stringify(INITIAL_RECEIPTS));
    }
    if (!localStorage.getItem(this.inspectionsKey)) {
      localStorage.setItem(this.inspectionsKey, JSON.stringify(INITIAL_INSPECTIONS));
    }
    if (!localStorage.getItem(this.invoicesKey)) {
      localStorage.setItem(this.invoicesKey, JSON.stringify(INITIAL_INVOICES));
    }
    if (!localStorage.getItem(this.contractsKey)) {
      localStorage.setItem(this.contractsKey, JSON.stringify(INITIAL_CONTRACTS));
    }
    if (!localStorage.getItem(this.catalogKey)) {
      localStorage.setItem(this.catalogKey, JSON.stringify(INITIAL_CATALOG));
    }
    if (!localStorage.getItem(this.aiInsightsKey)) {
      localStorage.setItem(this.aiInsightsKey, JSON.stringify(INITIAL_AI_INSIGHTS));
    }
    if (!localStorage.getItem(this.priceHistoryKey)) {
      localStorage.setItem(this.priceHistoryKey, JSON.stringify(INITIAL_PRICE_HISTORY));
    }
    if (!localStorage.getItem(this.deliveryPerformanceKey)) {
      localStorage.setItem(this.deliveryPerformanceKey, JSON.stringify(INITIAL_DELIVERY_PERFORMANCE));
    }
  }

  // --- VENDORS ---
  async getVendors(): Promise<Vendor[]> {
    const raw = localStorage.getItem(this.vendorsKey);
    return raw ? JSON.parse(raw) : INITIAL_VENDORS;
  }

  async saveVendor(vendor: Vendor, actorName = "Admin"): Promise<Vendor> {
    const list = await this.getVendors();
    const idx = list.findIndex((v) => v.vendorId === vendor.vendorId);
    let updated: Vendor;
    if (idx >= 0) {
      updated = { ...vendor, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("VENDOR_UPDATED", `Updated vendor profile: ${vendor.legalName} (${vendor.vendorCode})`, actorName, { vendorId: vendor.vendorId });
    } else {
      updated = { ...vendor, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("VENDOR_CREATED", `Registered new vendor: ${vendor.legalName} (${vendor.vendorCode})`, actorName, { vendorId: vendor.vendorId });
    }
    localStorage.setItem(this.vendorsKey, JSON.stringify(list));
    return updated;
  }

  // --- PURCHASE REQUESTS (PR) ---
  async getPurchaseRequests(): Promise<PurchaseRequest[]> {
    const raw = localStorage.getItem(this.prsKey);
    return raw ? JSON.parse(raw) : INITIAL_PRS;
  }

  async savePurchaseRequest(pr: PurchaseRequest, actorName = "User"): Promise<PurchaseRequest> {
    const list = await this.getPurchaseRequests();
    const idx = list.findIndex((p) => p.prId === pr.prId);
    let updated: PurchaseRequest;
    if (idx >= 0) {
      updated = { ...pr, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("PR_UPDATED", `Updated Purchase Request ${pr.prNumber} (Status: ${pr.status})`, actorName, { prNumber: pr.prNumber });
    } else {
      updated = { ...pr, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("PR_CREATED", `Submitted Purchase Request ${pr.prNumber} (Priority: ${pr.priority})`, actorName, { prNumber: pr.prNumber });
    }
    localStorage.setItem(this.prsKey, JSON.stringify(list));
    return updated;
  }

  async approvePR(prId: string, approverId = "USR-MGR-01", approverName = "Manager", comment?: string): Promise<PurchaseRequest> {
    return this.approvePurchaseRequest(prId, approverName, "Manager", comment);
  }

  async approvePurchaseRequest(prId: string, approverName: string, role: string, comment?: string): Promise<PurchaseRequest> {
    const list = await this.getPurchaseRequests();
    const pr = list.find((p) => p.prId === prId);
    if (!pr) throw new Error("Purchase request not found");

    if (!pr.approvalChain) pr.approvalChain = [];
    const pendingStep = pr.approvalChain.find((c) => c.status === "PENDING");
    if (pendingStep) {
      pendingStep.status = "APPROVED";
      pendingStep.name = approverName;
      pendingStep.timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
      pendingStep.comment = comment;
    }

    const hasMorePending = pr.approvalChain.some((c) => c.status === "PENDING");
    if (!hasMorePending) {
      pr.status = "APPROVED";
      pr.approvalStatus = "APPROVED";
    } else {
      pr.status = "UNDER_REVIEW";
      pr.approvalStatus = `PENDING_${pr.approvalChain.find((c) => c.status === "PENDING")?.role.toUpperCase()}`;
    }

    pr.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    localStorage.setItem(this.prsKey, JSON.stringify(list));
    await auditRepository.logAction("PR_APPROVED", `Approved Purchase Request ${pr.prNumber} by ${approverName} (${role})`, approverName, { prNumber: pr.prNumber });
    return pr;
  }

  // --- RFQS ---
  async getRFQs(): Promise<RFQ[]> {
    const raw = localStorage.getItem(this.rfqsKey);
    return raw ? JSON.parse(raw) : INITIAL_RFQS;
  }

  async saveRFQ(rfq: RFQ, actorName = "Procurement"): Promise<RFQ> {
    const list = await this.getRFQs();
    const idx = list.findIndex((r) => r.rfqId === rfq.rfqId);
    let updated: RFQ;
    if (idx >= 0) {
      updated = { ...rfq, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("RFQ_UPDATED", `Updated RFQ ${rfq.rfqNumber}`, actorName, { rfqNumber: rfq.rfqNumber });
    } else {
      updated = { ...rfq, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("RFQ_CREATED", `Created RFQ ${rfq.rfqNumber} for PR ${rfq.prNumber}`, actorName, { rfqNumber: rfq.rfqNumber });
    }
    localStorage.setItem(this.rfqsKey, JSON.stringify(list));
    return updated;
  }

  // --- QUOTATIONS ---
  async getQuotations(): Promise<Quotation[]> {
    const raw = localStorage.getItem(this.quotationsKey);
    return raw ? JSON.parse(raw) : INITIAL_QUOTATIONS;
  }

  async saveQuotation(quotation: Quotation, actorName = "Vendor"): Promise<Quotation> {
    const list = await this.getQuotations();
    const idx = list.findIndex((q) => q.quotationId === quotation.quotationId);
    let updated: Quotation;
    if (idx >= 0) {
      updated = { ...quotation, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("QUOTATION_UPDATED", `Updated quotation ${quotation.quotationNumber} from ${quotation.vendorName}`, actorName, { quotationNumber: quotation.quotationNumber });
    } else {
      updated = { ...quotation, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("QUOTATION_RECEIVED", `Received quotation ${quotation.quotationNumber} from ${quotation.vendorName}`, actorName, { quotationNumber: quotation.quotationNumber });
    }
    localStorage.setItem(this.quotationsKey, JSON.stringify(list));
    return updated;
  }

  // --- PURCHASE ORDERS (PO) ---
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const raw = localStorage.getItem(this.posKey);
    return raw ? JSON.parse(raw) : INITIAL_POS;
  }

  async savePurchaseOrder(po: PurchaseOrder, actorName = "Procurement Lead"): Promise<PurchaseOrder> {
    const list = await this.getPurchaseOrders();
    const idx = list.findIndex((p) => p.poId === po.poId);
    let updated: PurchaseOrder;
    if (idx >= 0) {
      const existing = list[idx];
      let newRevision = existing.currentRevision;
      const revisionHistory = existing.revisionHistory ? [...existing.revisionHistory] : [];
      if (existing.grandTotal !== po.grandTotal || JSON.stringify(existing.items) !== JSON.stringify(po.items)) {
        newRevision += 1;
        revisionHistory.push({
          revisionNumber: newRevision,
          changedBy: actorName,
          changeDate: new Date().toISOString().replace("T", " ").substring(0, 19),
          changeReason: po.notes || "Amendment to items or total value",
          previousGrandTotal: existing.grandTotal,
          newGrandTotal: po.grandTotal
        });
      }
      updated = { ...po, currentRevision: newRevision, revisionHistory, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("PO_AMENDED", `Amended Purchase Order ${po.poNumber} to Rev ${newRevision}`, actorName, { poNumber: po.poNumber });
    } else {
      updated = { ...po, currentRevision: 0, revisionHistory: [{ revisionNumber: 0, changedBy: actorName, changeDate: new Date().toISOString().replace("T", " ").substring(0, 19), changeReason: "Initial Creation", previousGrandTotal: po.grandTotal, newGrandTotal: po.grandTotal }], createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("PO_CREATED", `Created Purchase Order ${po.poNumber} for vendor ${po.vendorName}`, actorName, { poNumber: po.poNumber });
    }
    localStorage.setItem(this.posKey, JSON.stringify(list));
    return updated;
  }

  // --- GOODS RECEIPTS (GR) ---
  async getGoodsReceipts(): Promise<GoodsReceipt[]> {
    const raw = localStorage.getItem(this.receiptsKey);
    return raw ? JSON.parse(raw) : INITIAL_RECEIPTS;
  }

  async saveGoodsReceipt(receipt: GoodsReceipt, actorName = "Warehouse Staff"): Promise<GoodsReceipt> {
    const list = await this.getGoodsReceipts();
    const idx = list.findIndex((r) => r.receiptId === receipt.receiptId);
    let updated: GoodsReceipt;
    if (idx >= 0) {
      updated = { ...receipt, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("DELIVERY_RECEIVED", `Updated Goods Receipt ${receipt.receiptNumber}`, actorName, { receiptNumber: receipt.receiptNumber });
    } else {
      updated = { ...receipt, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("DELIVERY_RECEIVED", `Recorded Goods Receipt ${receipt.receiptNumber} for PO ${receipt.poNumber}`, actorName, { receiptNumber: receipt.receiptNumber });
    }
    localStorage.setItem(this.receiptsKey, JSON.stringify(list));
    return updated;
  }

  // --- QUALITY INSPECTION ---
  async getInspections(): Promise<QualityInspection[]> {
    const raw = localStorage.getItem(this.inspectionsKey);
    return raw ? JSON.parse(raw) : INITIAL_INSPECTIONS;
  }

  async getQualityInspections(): Promise<QualityInspection[]> {
    return this.getInspections();
  }

  async saveInspection(insp: QualityInspection, actorName = "Inspector"): Promise<QualityInspection> {
    const list = await this.getInspections();
    const idx = list.findIndex((i) => i.inspectionId === insp.inspectionId);
    if (idx >= 0) {
      list[idx] = insp;
    } else {
      list.unshift(insp);
    }
    localStorage.setItem(this.inspectionsKey, JSON.stringify(list));
    await auditRepository.logAction("DELIVERY_RECEIVED", `Completed QC inspection for receipt ${insp.receiptNumber}: ${insp.result}`, actorName, { inspectionId: insp.inspectionId });
    return insp;
  }

  async saveQualityInspection(insp: QualityInspection, actorName = "Inspector"): Promise<QualityInspection> {
    return this.saveInspection(insp, actorName);
  }

  // --- INVOICES & 3-WAY MATCHING ---
  async getInvoices(): Promise<Invoice[]> {
    const raw = localStorage.getItem(this.invoicesKey);
    return raw ? JSON.parse(raw) : INITIAL_INVOICES;
  }

  async saveInvoice(invoice: Invoice, actorName = "Finance/Procurement"): Promise<Invoice> {
    const list = await this.getInvoices();

    // 3-Way Matching Engine check
    const pos = await this.getPurchaseOrders();
    const receipts = await this.getGoodsReceipts();
    const targetPo = pos.find((p) => p.poNumber === invoice.poNumber || p.poId === invoice.poId);

    let matchingStatus: MatchingStatus = "MATCHED";
    const discrepancies: string[] = [];

    if (!targetPo) {
      matchingStatus = "MISMATCH";
      discrepancies.push("PO Number not found in system");
    } else {
      if (Math.abs(invoice.grandTotal - targetPo.grandTotal) > 1000 && Math.abs(invoice.subtotal - targetPo.subtotal) > 1000) {
        matchingStatus = "MISMATCH";
        discrepancies.push(`Invoice total (Rp ${invoice.grandTotal.toLocaleString("id-ID")}) differs from PO total (Rp ${targetPo.grandTotal.toLocaleString("id-ID")})`);
      }
    }

    // Duplicate Invoice check
    const isDuplicate = list.some((i) => i.invoiceNumber === invoice.invoiceNumber && i.vendorId === invoice.vendorId && i.invoiceId !== invoice.invoiceId);

    const updatedInvoice: Invoice = {
      ...invoice,
      matchingStatus,
      matchingDiscrepancies: discrepancies,
      duplicateRisk: isDuplicate,
      status: matchingStatus === "MATCHED" && !isDuplicate ? "MATCHED" : "MISMATCH"
    };

    const idx = list.findIndex((i) => i.invoiceId === invoice.invoiceId);
    if (idx >= 0) {
      list[idx] = { ...updatedInvoice, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      await auditRepository.logAction("INVOICE_MATCHED", `Updated invoice ${invoice.invoiceNumber} (Status: ${updatedInvoice.status})`, actorName, { invoiceNumber: invoice.invoiceNumber });
    } else {
      list.unshift({ ...updatedInvoice, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) });
      await auditRepository.logAction("INVOICE_RECEIVED", `Recorded invoice ${invoice.invoiceNumber} from ${invoice.vendorName}`, actorName, { invoiceNumber: invoice.invoiceNumber });
    }
    localStorage.setItem(this.invoicesKey, JSON.stringify(list));
    return updatedInvoice;
  }

  // --- CONTRACTS ---
  async getContracts(): Promise<ProcurementContract[]> {
    const raw = localStorage.getItem(this.contractsKey);
    return raw ? JSON.parse(raw) : INITIAL_CONTRACTS;
  }

  async saveContract(contract: ProcurementContract, actorName = "Procurement Legal"): Promise<ProcurementContract> {
    const list = await this.getContracts();
    const idx = list.findIndex((c) => c.contractId === contract.contractId);
    let updated: ProcurementContract;
    if (idx >= 0) {
      updated = { ...contract, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list[idx] = updated;
      await auditRepository.logAction("CONTRACT_UPDATED", `Updated vendor contract ${contract.contractNumber}`, actorName, { contractNumber: contract.contractNumber });
    } else {
      updated = { ...contract, createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
      list.unshift(updated);
      await auditRepository.logAction("CONTRACT_CREATED", `Created vendor contract ${contract.contractNumber} with ${contract.vendorName}`, actorName, { contractNumber: contract.contractNumber });
    }
    localStorage.setItem(this.contractsKey, JSON.stringify(list));
    return updated;
  }

  // --- PRICE HISTORY ---
  async getPriceHistory(itemCode?: string, vendorId?: string): Promise<PriceHistoryRecord[]> {
    const raw = localStorage.getItem(this.priceHistoryKey);
    const list: PriceHistoryRecord[] = raw ? JSON.parse(raw) : INITIAL_PRICE_HISTORY;
    return list.filter((p) => {
      const matchItem = itemCode ? p.itemCode === itemCode : true;
      const matchVendor = vendorId ? p.vendorId === vendorId : true;
      return matchItem && matchVendor;
    });
  }

  async savePriceHistory(record: PriceHistoryRecord): Promise<PriceHistoryRecord> {
    const raw = localStorage.getItem(this.priceHistoryKey);
    const list: PriceHistoryRecord[] = raw ? JSON.parse(raw) : INITIAL_PRICE_HISTORY;
    list.unshift({ ...record, id: record.id || `ph-${Date.now()}` });
    localStorage.setItem(this.priceHistoryKey, JSON.stringify(list));
    return record;
  }

  // --- DELIVERY PERFORMANCE ---
  async getDeliveryPerformance(vendorId?: string): Promise<DeliveryPerformanceRecord[]> {
    const raw = localStorage.getItem(this.deliveryPerformanceKey);
    const list: DeliveryPerformanceRecord[] = raw ? JSON.parse(raw) : INITIAL_DELIVERY_PERFORMANCE;
    return list.filter((d) => (vendorId ? d.vendorId === vendorId : true));
  }

  async saveDeliveryPerformance(record: DeliveryPerformanceRecord): Promise<DeliveryPerformanceRecord> {
    const raw = localStorage.getItem(this.deliveryPerformanceKey);
    const list: DeliveryPerformanceRecord[] = raw ? JSON.parse(raw) : INITIAL_DELIVERY_PERFORMANCE;
    list.unshift({ ...record, id: record.id || `dp-${Date.now()}` });
    localStorage.setItem(this.deliveryPerformanceKey, JSON.stringify(list));
    return record;
  }

  // --- CATALOG ---
  async getCatalog(): Promise<CatalogItem[]> {
    const raw = localStorage.getItem(this.catalogKey);
    return raw ? JSON.parse(raw) : INITIAL_CATALOG;
  }

  // --- AI INSIGHTS ---
  async getAIInsights(): Promise<ProcurementAIInsight[]> {
    const raw = localStorage.getItem(this.aiInsightsKey);
    return raw ? JSON.parse(raw) : INITIAL_AI_INSIGHTS;
  }

  // --- SUMMARY KPI CALCULATION ---
  async getKPISummary(): Promise<ProcurementKPISummary> {
    const prs = await this.getPurchaseRequests();
    const rfqs = await this.getRFQs();
    const quots = await this.getQuotations();
    const pos = await this.getPurchaseOrders();
    const receipts = await this.getGoodsReceipts();
    const invoices = await this.getInvoices();
    const vendors = await this.getVendors();

    const openPOList = pos.filter((p) => p.status !== "CLOSED" && p.status !== "CANCELLED");
    const openPOValue = openPOList.reduce((acc, curr) => acc + curr.grandTotal, 0);

    const pendingInvoiceList = invoices.filter((i) => i.status === "RECEIVED" || i.status === "UNDER_REVIEW" || i.status === "MISMATCH");
    const pendingInvoiceVal = pendingInvoiceList.reduce((acc, curr) => acc + curr.grandTotal, 0);

    return {
      totalPR: prs.length,
      pendingPR: prs.filter((p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW").length,
      approvedPR: prs.filter((p) => p.status === "APPROVED").length,
      rejectedPR: prs.filter((p) => p.status === "REJECTED").length,
      openRFQ: rfqs.filter((r) => r.status === "OPEN" || r.status === "SENT").length,
      pendingQuotation: rfqs.filter((r) => r.status === "RESPONSES_RECEIVED").length,
      pendingComparison: rfqs.filter((r) => r.status === "EVALUATION").length,
      pendingApproval: pos.filter((p) => p.status === "PENDING_APPROVAL").length,
      openPO: openPOList.length,
      poValueIDR: openPOValue,
      pendingDelivery: pos.filter((p) => p.status === "APPROVED" || p.status === "SENT" || p.status === "ACKNOWLEDGED").length,
      partialDelivery: pos.filter((p) => p.status === "PARTIALLY_RECEIVED").length,
      overdueDelivery: pos.filter((p) => p.status !== "FULLY_RECEIVED" && p.status !== "CLOSED" && new Date(p.deliveryDate) < new Date()).length,
      pendingInvoice: pendingInvoiceList.length,
      invoiceValueIDR: pendingInvoiceVal,
      vendorCount: vendors.filter((v) => v.status === "APPROVED").length,
      savingsTotalIDR: 44000000,
      onTimeDeliveryRatePct: 94.8,
      avgCycleTimeDays: 8.5,
      threeWayMatchRatePct: 96.2
    };
  }
}

export const procurementRepository = new ProcurementRepository();
