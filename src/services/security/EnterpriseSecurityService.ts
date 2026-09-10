// MINE SMART AI - Enterprise Security, Zero-Trust Governance & Disaster Recovery Engine

import {
  SecurityRole,
  SecurityPermissionCategory,
  PermissionDefinition,
  RoleRBACPolicy,
  UserSecurityProfile,
  JWTCryptographyConfig,
  EncryptionStatus,
  AuditTrailLogItem,
  LoginHistoryRecord,
  EnterpriseDeviceRecord,
  LiveUserSession,
  IPRestrictionRule,
  BackupRecord,
  RestorePoint,
  SecurityAlertLog,
} from "../../types/enterpriseSecurityTypes";

// ==========================================
// 1. MASTER PERMISSIONS DICTIONARY (Mining Domains)
// ==========================================
export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Operations & Production
  { id: "p-01", code: "PROD_VIEW", label: "Lihat Dashboard Produksi & Ritase", category: "OPERATIONS_PRODUCTION", description: "Melihat grafik ritase, tonase, dan stockpile coal/OB harian", riskLevel: "LOW" },
  { id: "p-02", code: "PROD_INPUT", label: "Input & Edit Ritase Muatan Front/Pit", category: "OPERATIONS_PRODUCTION", description: "Melakukan tallying dan pencatatan muatan DT di loading point", riskLevel: "MEDIUM" },
  { id: "p-03", code: "PROD_DELETE", label: "Hapus Data Produksi Historis", category: "OPERATIONS_PRODUCTION", description: "Menghapus catatan ritase produksi yang sudah terverifikasi", riskLevel: "CRITICAL" },
  { id: "p-04", code: "PROD_CRUSHER_MANAGE", label: "Atur Feeding & Output Crusher", category: "OPERATIONS_PRODUCTION", description: "Kontrol kapasitas crusher, sizing batubara, dan belt scale", riskLevel: "HIGH" },
  { id: "p-05", code: "PROD_STOCKPILE_ADJUST", label: "Rekonsiliasi Tonnage Stockpile", category: "OPERATIONS_PRODUCTION", description: "Melakukan penyesuaian inventory batubara ROM dan port stockpile", riskLevel: "HIGH" },
  
  // Fleet & Dispatch
  { id: "p-06", code: "DISPATCH_VIEW", label: "Monitor Posisi Armada FMS & GPS", category: "FLEET_DISPATCH", description: "Melihat live telemetry, kecepatan, dan status unit hauling/loading", riskLevel: "LOW" },
  { id: "p-07", code: "DISPATCH_CONTROL", label: "Alokasi Unit Hauler-Loader & Jalur Hauling", category: "FLEET_DISPATCH", description: "Mengubah rute haulage, assignment DT/EX, dan antrean crusher", riskLevel: "HIGH" },
  { id: "p-08", code: "FLEET_P2H_APPROVE", label: "Approval P2H Kelaikan Unit", category: "FLEET_DISPATCH", description: "Menandatangani status kelaikan operasional alat berat (Fit/Breakdown)", riskLevel: "HIGH" },
  { id: "p-09", code: "FLEET_FUEL_DISPENSE", label: "Catat Transaksi Solar Fuel Truck", category: "FLEET_DISPATCH", description: "Mencatat dispense bahan bakar solar B35 per nomor lambung unit", riskLevel: "MEDIUM" },
  
  // Mine Engineering & Planning
  { id: "p-10", code: "ENG_PIT_DESIGN_WRITE", label: "Buat & Edit Desain Tambang (Pit/Bench)", category: "MINE_ENGINEERING", description: "Mengubah desain lereng pit, ramp haulage, dan disposal limit", riskLevel: "HIGH" },
  { id: "p-11", code: "ENG_SCHEDULE_OPTIMIZE", label: "Simulasi Short/Long Term Mine Plan", category: "MINE_ENGINEERING", description: "Menjalankan optimasi sequence penambangan dan stripping ratio", riskLevel: "HIGH" },
  { id: "p-12", code: "ENG_EQUIPMENT_MATCH", label: "Kalkulasi Match Factor & Cycle Time", category: "MINE_ENGINEERING", description: "Menghitung efisiensi keserasian alat muat dan alat angkut", riskLevel: "MEDIUM" },
  
  // Geology & Exploration
  { id: "p-13", code: "GEO_CORE_LOG_WRITE", label: "Input Data Log Pemboran Inti & Seam", category: "GEOLOGY_EXPLORATION", description: "Mencatat data stratigrafi, roof, floor, dan ketebalan seam batubara", riskLevel: "MEDIUM" },
  { id: "p-14", code: "GEO_ASSAY_MANAGE", label: "Kelola Hasil Uji Lab Kualitas Batubara", category: "GEOLOGY_EXPLORATION", description: "Input nilai CV, TM, Ash, Total Sulfur, dan volatile matter", riskLevel: "HIGH" },
  { id: "p-15", code: "GEO_BLOCK_MODEL_EDIT", label: "Pemodelan Cadangan & Struktur 3D", category: "GEOLOGY_EXPLORATION", description: "Mengedit block model geologi dan perhitungan cadangan terukur", riskLevel: "CRITICAL" },
  
  // Survey & Mapping
  { id: "p-16", code: "SURV_DRONE_UPLOAD", label: "Unggah Point Cloud LIDAR & Ortofoto", category: "SURVEY_MAPPING", description: "Mengunggah data survei fotogrametri drone UAV ke sistem GIS", riskLevel: "MEDIUM" },
  { id: "p-17", code: "SURV_VOLUME_CALC", label: "Hitung Opname Volume Cut & Fill Bulanan", category: "SURVEY_MAPPING", description: "Menghitung volume kemajuan tambang (OB & Coal) joint survey", riskLevel: "HIGH" },
  { id: "p-18", code: "SURV_BOUNDARY_SIGN", label: "Validasi Batas Legal Konsesi IUP & Void", category: "SURVEY_MAPPING", description: "Menandatangani peta batas patok batas wilayah IUP resmi ESDM", riskLevel: "CRITICAL" },
  
  // Plant & Maintenance
  { id: "p-19", code: "MAINT_WORK_ORDER_CREATE", label: "Terbitkan Work Order Perbaikan Unit", category: "PLANT_MAINTENANCE", description: "Membuat WO breakdown, backlog, dan penugasan tim mekanik", riskLevel: "MEDIUM" },
  { id: "p-20", code: "MAINT_SCHEDULE_MANAGE", label: "Jadwalkan Periodic Maintenance (PM)", category: "PLANT_MAINTENANCE", description: "Menjadwalkan service berkala PM 250, PM 500, PM 1000, PM 2000", riskLevel: "HIGH" },
  { id: "p-21", code: "MAINT_OIL_ANALYSIS", label: "Input Rekomendasi Uji Oli (PAP)", category: "PLANT_MAINTENANCE", description: "Mencatat hasil laboratorium analisa pelumas dan partikel keausan", riskLevel: "MEDIUM" },
  
  // HSE & Safety
  { id: "p-22", code: "HSE_INSPECTION_RUN", label: "Lakukan Safety Walk & Hazard Hunting", category: "HSE_SAFETY", description: "Melakukan inspeksi K3 lapangan dan pencatatan temuan bahaya", riskLevel: "LOW" },
  { id: "p-23", code: "HSE_INCIDENT_INVESTIGATE", label: "Investigasi Insiden & Near-Miss", category: "HSE_SAFETY", description: "Menyusun laporan investigasi kecelakaan kerja dan tindakan korektif", riskLevel: "HIGH" },
  { id: "p-24", code: "HSE_JSA_APPROVE", label: "Otorisasi Job Safety Analysis (JSA)", category: "HSE_SAFETY", description: "Menyetujui dokumen JSA dan izin kerja risiko tinggi (Hot Work, Confined)", riskLevel: "HIGH" },
  
  // Environmental & Reclamation
  { id: "p-25", code: "ENV_WATER_TEST_LOG", label: "Catat Uji Kualitas Air Void (TSS & pH)", category: "ENVIRONMENTAL_RECLAMATION", description: "Pencatatan harian baku mutu air kolam pengendap (settling pond)", riskLevel: "MEDIUM" },
  { id: "p-26", code: "ENV_REVEGETATION_WRITE", label: "Input Luasan Reklamasi & Revegetasi", category: "ENVIRONMENTAL_RECLAMATION", description: "Mendokumentasikan progres penataan lahan dan pembibitan nursery", riskLevel: "MEDIUM" },
  { id: "p-27", code: "ENV_EMISSION_REPORT", label: "Kelola Pelaporan Emisi & Limbah B3", category: "ENVIRONMENTAL_RECLAMATION", description: "Menyusun manifes limbah B3 dan laporan emisi cerobong/genset", riskLevel: "HIGH" },
  
  // HR & Organization
  { id: "p-28", code: "HR_EMPLOYEE_MANAGE", label: "Kelola Data Karyawan, Simper & MCU", category: "HR_ORGANIZATION", description: "Memperbarui masa berlaku SIMPER mine permit dan status tes medis", riskLevel: "HIGH" },
  { id: "p-29", code: "HR_ROSTER_SCHEDULE", label: "Atur Roster Kerja & Shift Tambang", category: "HR_ORGANIZATION", description: "Mengatur jadwal giliran shift pagi/malam dan rotasi cuti lapangan", riskLevel: "MEDIUM" },
  { id: "p-30", code: "HR_PAYROLL_PROCESS", label: "Akses Penggajian & Tunjangan Site", category: "HR_ORGANIZATION", description: "Menghitung lembur, tunjangan remote site, dan slip gaji karyawan", riskLevel: "CRITICAL" },
  
  // Procurement & Vendors
  { id: "p-31", code: "PROC_PO_CREATE", label: "Terbitkan Purchase Order (PO)", category: "PROCUREMENT_VENDORS", description: "Membuat PO pengadaan suku cadang alat berat, BBM, dan logistik", riskLevel: "HIGH" },
  { id: "p-32", code: "PROC_VENDOR_EVALUATE", label: "Evaluasi Kinerja Kontraktor & Rekanan", category: "PROCUREMENT_VENDORS", description: "Memberi skor vendor, kontraktor hauling, dan penyedia jasa eksplorasi", riskLevel: "MEDIUM" },
  { id: "p-33", code: "PROC_CONTRACT_TENDER", label: "Kelola Tender Pengadaan Unit Tambang", category: "PROCUREMENT_VENDORS", description: "Mengelola proses lelang tender sewa alat berat dan jasa pemboran", riskLevel: "CRITICAL" },
  
  // Warehouse & Inventory
  { id: "p-34", code: "WH_STOCK_RECEIVE", label: "Input Penerimaan Barang Gudang (GR)", category: "WAREHOUSE_INVENTORY", description: "Memverifikasi surat jalan penerimaan spareparts dan material", riskLevel: "MEDIUM" },
  { id: "p-35", code: "WH_PART_ISSUANCE", label: "Pengeluaran Suku Cadang ke Mekanik", category: "WAREHOUSE_INVENTORY", description: "Mencatat part issuance berdasarkan nomor Work Order alat berat", riskLevel: "MEDIUM" },
  { id: "p-36", code: "WH_STOCK_OPNAME", label: "Eksekusi Stock Opname Gudang Site", category: "WAREHOUSE_INVENTORY", description: "Melakukan audit fisik stok pelumas, filter, tyre, dan wear plate", riskLevel: "HIGH" },
  
  // Finance & Commercial
  { id: "p-37", code: "FIN_COST_VIEW", label: "Lihat Cash Cost Stripping Ratio & HBA", category: "FINANCE_COMMERCIAL", description: "Melihat analisis cash cost FOB, HBA index margin, dan OPEX tambang", riskLevel: "HIGH" },
  { id: "p-38", code: "FIN_ROYALTY_CALC", label: "Hitung Estimasi Royalti PNBP e-PNBP", category: "FINANCE_COMMERCIAL", description: "Menghitung royalti tarif progresif PP 26/2022 dan dana reklamasi", riskLevel: "HIGH" },
  { id: "p-39", code: "FIN_INVOICE_APPROVE", label: "Otorisasi Pembayaran Invoice Tagihan", category: "FINANCE_COMMERCIAL", description: "Menyetujui invoice kontraktor penambangan, tongkang, dan vendor", riskLevel: "CRITICAL" },
  { id: "p-40", code: "SALES_CONTRACT_APPROVE", label: "Approval Kontrak Penjualan Batubara", category: "FINANCE_COMMERCIAL", description: "Menyetujui kontrak jual beli batubara domestik (DMO) dan ekspor", riskLevel: "CRITICAL" },
  
  // Executive Governance
  { id: "p-41", code: "EXEC_KPI_DASHBOARD", label: "Akses Executive Performance Summary", category: "EXECUTIVE_GOVERNANCE", description: "Melihat ringkasan laba kotor, realisasi target RKAB, dan EBITDA", riskLevel: "LOW" },
  { id: "p-42", code: "RKAB_SIGN_OFF", label: "Otorisasi Dokumen RKAB ESDM", category: "EXECUTIVE_GOVERNANCE", description: "Penandatanganan digital laporan RKAB Minerba ke Kementerian ESDM", riskLevel: "CRITICAL" },
  { id: "p-43", code: "STRATEGIC_BUDGET_APPROVE", label: "Approval Capex Pembelian Unit Baru", category: "EXECUTIVE_GOVERNANCE", description: "Otorisasi belanja modal armada baru dan ekspansi blok penambangan", riskLevel: "CRITICAL" },
  
  // User RBAC & System Security
  { id: "p-44", code: "USER_CREATE_EDIT", label: "Kelola Akun & Penugasan 18 Role", category: "USER_RBAC", description: "Menambah, menonaktifkan user, dan mengubah peran RBAC", riskLevel: "CRITICAL" },
  { id: "p-45", code: "MFA_OVERRIDE", label: "Reset MFA & Kredensial Pengguna", category: "USER_RBAC", description: "Mereset kunci 2FA darurat atau password user yang terkunci", riskLevel: "CRITICAL" },
  { id: "p-46", code: "SEC_KEY_ROTATE", label: "Rotasi Kunci Enkripsi & JWT RSA", category: "SYSTEM_SECURITY", description: "Memicu rotasi master key KMS dan token signature certificate", riskLevel: "CRITICAL" },
  { id: "p-47", code: "SEC_IP_WHITELIST_EDIT", label: "Konfigurasi Firewall & CIDR Whitelist", category: "SYSTEM_SECURITY", description: "Menambah atau memodifikasi daftar IP yang diizinkan", riskLevel: "HIGH" },
  { id: "p-48", code: "BACKUP_RESTORE_EXECUTE", label: "Eksekusi Backup & Restore Database", category: "SYSTEM_SECURITY", description: "Memicu backup manual dan menjalankan disaster recovery snapshot", riskLevel: "CRITICAL" },
  
  // Data Export & API
  { id: "p-49", code: "MASS_DATA_EXPORT", label: "Ekspor Masal Data Tambang (CSV/JSON)", category: "DATA_EXPORT_API", description: "Mengunduh dataset besar operasional atau keuangan tambang", riskLevel: "HIGH" },
  { id: "p-50", code: "API_KEY_MANAGE", label: "Generate & Revoke API Tokens", category: "DATA_EXPORT_API", description: "Membuat token integrasi ERP SAP / FMS pihak ketiga", riskLevel: "HIGH" },
  
  // Read Only
  { id: "p-51", code: "GLOBAL_READ_ONLY", label: "Akses Hanya-Baca Dashboard Operasional", category: "READ_ONLY_VIEW", description: "Melihat visualisasi data tanpa hak modifikasi atau penghapusan", riskLevel: "LOW" },
];

// ==========================================
// 2. ALL 18 DEFAULT MINING RBAC POLICIES
// ==========================================
export const INITIAL_ROLES: RoleRBACPolicy[] = [
  {
    role: "SUPER_ADMIN",
    roleName: "Super Admin",
    description: "Akses absolut tak terbatas ke seluruh sistem, audit log, manajemen otorisasi 18 role, KMS enkripsi, dan backup disaster recovery.",
    isSystemRole: true,
    assignedUsersCount: 2,
    permissions: ALL_PERMISSIONS.map((p) => p.code),
    maxSessionDurationHours: 4,
    requireMFA: true,
    ipRestrictionEnabled: true,
  },
  {
    role: "OWNER",
    roleName: "Owner / Pemilik Konsesi",
    description: "Pemegang saham dan pemilik konsesi tambang: akses penuh KPI eksekutif, audit keuangan, laporan cadangan, dan persetujuan belanja strategis.",
    isSystemRole: true,
    assignedUsersCount: 2,
    permissions: [
      "EXEC_KPI_DASHBOARD", "STRATEGIC_BUDGET_APPROVE", "RKAB_SIGN_OFF", "FIN_COST_VIEW",
      "FIN_ROYALTY_CALC", "SALES_CONTRACT_APPROVE", "PROD_VIEW", "MASS_DATA_EXPORT", "GLOBAL_READ_ONLY"
    ],
    maxSessionDurationHours: 8,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "DIRECTOR",
    roleName: "Director / Dewan Direksi",
    description: "Direksi pengambil keputusan strategis operasional, target produksi tahunan, komersial penjualan batubara, dan kepatuhan Minerba.",
    isSystemRole: true,
    assignedUsersCount: 3,
    permissions: [
      "EXEC_KPI_DASHBOARD", "STRATEGIC_BUDGET_APPROVE", "RKAB_SIGN_OFF", "FIN_COST_VIEW",
      "FIN_ROYALTY_CALC", "FIN_INVOICE_APPROVE", "SALES_CONTRACT_APPROVE", "PROD_VIEW",
      "PROC_CONTRACT_TENDER", "MASS_DATA_EXPORT", "GLOBAL_READ_ONLY"
    ],
    maxSessionDurationHours: 8,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "GENERAL_MANAGER",
    roleName: "General Manager (GM)",
    description: "Pimpinan tertinggi operasional seluruh divisi tambang: pengawasan cross-functional produksi, fleet, maintenance, HSE, supply chain, dan anggaran site.",
    isSystemRole: false,
    assignedUsersCount: 4,
    permissions: [
      "EXEC_KPI_DASHBOARD", "RKAB_SIGN_OFF", "PROD_VIEW", "PROD_INPUT", "PROD_CRUSHER_MANAGE",
      "DISPATCH_VIEW", "DISPATCH_CONTROL", "FLEET_P2H_APPROVE", "ENG_PIT_DESIGN_WRITE",
      "ENG_SCHEDULE_OPTIMIZE", "SURV_VOLUME_CALC", "MAINT_SCHEDULE_MANAGE", "HSE_INCIDENT_INVESTIGATE",
      "HSE_JSA_APPROVE", "ENV_WATER_TEST_LOG", "HR_ROSTER_SCHEDULE", "PROC_PO_CREATE",
      "FIN_COST_VIEW", "FIN_INVOICE_APPROVE", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 10,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "MINE_MANAGER",
    roleName: "Mine Manager / KTT",
    description: "Kepala Teknik Tambang (KTT) bersertifikasi POU: pemegang tanggung jawab teknis operasional dan keselamatan penambangan sesuai kaidah Good Mining Practice.",
    isSystemRole: true,
    assignedUsersCount: 4,
    permissions: [
      "RKAB_SIGN_OFF", "PROD_VIEW", "PROD_INPUT", "PROD_CRUSHER_MANAGE", "PROD_STOCKPILE_ADJUST",
      "DISPATCH_VIEW", "DISPATCH_CONTROL", "FLEET_P2H_APPROVE", "ENG_PIT_DESIGN_WRITE",
      "ENG_SCHEDULE_OPTIMIZE", "ENG_EQUIPMENT_MATCH", "SURV_VOLUME_CALC", "SURV_BOUNDARY_SIGN",
      "HSE_INSPECTION_RUN", "HSE_INCIDENT_INVESTIGATE", "HSE_JSA_APPROVE", "ENV_WATER_TEST_LOG",
      "HR_ROSTER_SCHEDULE", "FIN_COST_VIEW", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 12,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "ENGINEERING",
    roleName: "Engineering / Mine Plan",
    description: "Insinyur perancangan tambang: desain pit slope, short-term & long-term mine planning, cut-and-fill sequence, dan evaluasi keserasian alat (match factor).",
    isSystemRole: false,
    assignedUsersCount: 7,
    permissions: [
      "ENG_PIT_DESIGN_WRITE", "ENG_SCHEDULE_OPTIMIZE", "ENG_EQUIPMENT_MATCH", "PROD_VIEW",
      "SURV_VOLUME_CALC", "GEO_BLOCK_MODEL_EDIT", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
  {
    role: "GEOLOGY",
    roleName: "Geology / Exploration",
    description: "Ahli geologi tambang: logging pemboran eksplorasi, penarikan korelasi seam batubara, block modeling 3D, dan manajemen kualitas (CV, TM, Ash, TS).",
    isSystemRole: false,
    assignedUsersCount: 5,
    permissions: [
      "GEO_CORE_LOG_WRITE", "GEO_ASSAY_MANAGE", "GEO_BLOCK_MODEL_EDIT", "PROD_VIEW",
      "ENG_PIT_DESIGN_WRITE", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
  {
    role: "SURVEY",
    roleName: "Survey & Geodetic",
    description: "Surveyor tambang: pemetaan topografi, joint survey kemajuan bulanan, foto udara drone UAV LIDAR, dan pematokan batas konsesi resmi.",
    isSystemRole: false,
    assignedUsersCount: 6,
    permissions: [
      "SURV_DRONE_UPLOAD", "SURV_VOLUME_CALC", "SURV_BOUNDARY_SIGN", "PROD_VIEW",
      "ENG_PIT_DESIGN_WRITE", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
  {
    role: "PRODUCTION",
    roleName: "Production / Pit Foreman",
    description: "Pengawas lapangan pit: monitoring loading point, tallying ritase OB dan Coal, operasional crushing plant, dan penataan stockpile ROM.",
    isSystemRole: false,
    assignedUsersCount: 16,
    permissions: [
      "PROD_VIEW", "PROD_INPUT", "PROD_CRUSHER_MANAGE", "PROD_STOCKPILE_ADJUST",
      "DISPATCH_VIEW", "FLEET_P2H_APPROVE", "HSE_INSPECTION_RUN"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: true,
  },
  {
    role: "DISPATCH",
    roleName: "Dispatch / FMS Operator",
    description: "Operator pusat kendali Fleet Management System (FMS): penugasan real-time dump truck ke excavator, manajemen antrean crusher, dan optimasi rute hauling.",
    isSystemRole: false,
    assignedUsersCount: 12,
    permissions: [
      "DISPATCH_VIEW", "DISPATCH_CONTROL", "FLEET_P2H_APPROVE", "FLEET_FUEL_DISPENSE",
      "PROD_VIEW", "PROD_INPUT"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: true,
  },
  {
    role: "MAINTENANCE",
    roleName: "Maintenance / Plant Lead",
    description: "Divisi pemeliharaan alat berat (Plant & Maintenance): penerbitan work order, penjadwalan PM berkala, analisa oli (PAP), dan pengelolaan ketersediaan unit (PA/MA).",
    isSystemRole: false,
    assignedUsersCount: 10,
    permissions: [
      "MAINT_WORK_ORDER_CREATE", "MAINT_SCHEDULE_MANAGE", "MAINT_OIL_ANALYSIS",
      "FLEET_P2H_APPROVE", "WH_PART_ISSUANCE", "PROD_VIEW"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
  {
    role: "HSE",
    roleName: "HSE / K3 Manager",
    description: "Divisi Kesehatan, Keselamatan Kerja & Lingkungan (K3): inspeksi hazard, investigasi insiden, pengesahan JSA, izin kerja panas, dan verifikasi SIMPER.",
    isSystemRole: false,
    assignedUsersCount: 6,
    permissions: [
      "HSE_INSPECTION_RUN", "HSE_INCIDENT_INVESTIGATE", "HSE_JSA_APPROVE",
      "HR_EMPLOYEE_MANAGE", "PROD_VIEW", "FLEET_P2H_APPROVE", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 10,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "ENVIRONMENT",
    roleName: "Environment & Reclamation",
    description: "Spesialis lingkungan hidup tambang: monitoring settling pond (pH & TSS), progres reklamasi lahan, penanaman cover crop di nursery, dan pelaporan limbah B3.",
    isSystemRole: false,
    assignedUsersCount: 4,
    permissions: [
      "ENV_WATER_TEST_LOG", "ENV_REVEGETATION_WRITE", "ENV_EMISSION_REPORT",
      "SURV_DRONE_UPLOAD", "PROD_VIEW", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 10,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
  {
    role: "HR",
    roleName: "HR & Organization",
    description: "Divisi Sumber Daya Manusia: administrasi karyawan, absensi geofencing, penjadwalan roster shift kerja, validasi MCU & SIMPER, serta pemrosesan penggajian.",
    isSystemRole: false,
    assignedUsersCount: 5,
    permissions: [
      "HR_EMPLOYEE_MANAGE", "HR_ROSTER_SCHEDULE", "HR_PAYROLL_PROCESS",
      "USER_CREATE_EDIT", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 8,
    requireMFA: true,
    ipRestrictionEnabled: true,
  },
  {
    role: "PROCUREMENT",
    roleName: "Procurement / Purchasing",
    description: "Divisi Pengadaan Barang & Jasa: penerbitan PO sparepart, tender sewa armada hauling, evaluasi kontraktor rekanan, dan negosiasi harga material.",
    isSystemRole: false,
    assignedUsersCount: 6,
    permissions: [
      "PROC_PO_CREATE", "PROC_VENDOR_EVALUATE", "PROC_CONTRACT_TENDER",
      "WH_STOCK_RECEIVE", "FIN_COST_VIEW", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 8,
    requireMFA: true,
    ipRestrictionEnabled: false,
  },
  {
    role: "WAREHOUSE",
    roleName: "Warehouse / Logistics",
    description: "Pengelola logistik gudang site: penerimaan barang (Goods Receipt), pengeluaran suku cadang ke mekanik, audit stock opname, dan pengawasan tangki BBM solar.",
    isSystemRole: false,
    assignedUsersCount: 8,
    permissions: [
      "WH_STOCK_RECEIVE", "WH_PART_ISSUANCE", "WH_STOCK_OPNAME",
      "FLEET_FUEL_DISPENSE", "PROC_PO_CREATE"
    ],
    maxSessionDurationHours: 12,
    requireMFA: false,
    ipRestrictionEnabled: true,
  },
  {
    role: "FINANCE",
    roleName: "Finance & Commercial",
    description: "Keuangan dan komersial tambang: verifikasi cash cost stripping ratio, kalkulasi royalti e-PNBP Minerba, invoice kontraktor, dan penagihan penjualan batubara.",
    isSystemRole: false,
    assignedUsersCount: 6,
    permissions: [
      "FIN_COST_VIEW", "FIN_ROYALTY_CALC", "FIN_INVOICE_APPROVE", "SALES_CONTRACT_APPROVE",
      "PROC_PO_CREATE", "EXEC_KPI_DASHBOARD", "MASS_DATA_EXPORT"
    ],
    maxSessionDurationHours: 8,
    requireMFA: true,
    ipRestrictionEnabled: true,
  },
  {
    role: "VIEWER",
    roleName: "Viewer / Read-Only Guest",
    description: "Akses peninjau tamu atau auditor eksternal: hanya dapat melihat dashboard dan grafik ringkasan operasional tanpa izin input, edit, atau penghapusan data.",
    isSystemRole: false,
    assignedUsersCount: 15,
    permissions: ["GLOBAL_READ_ONLY", "PROD_VIEW", "DISPATCH_VIEW"],
    maxSessionDurationHours: 4,
    requireMFA: false,
    ipRestrictionEnabled: false,
  },
];

// ==========================================
// 3. USER SECURITY PROFILES (Covering 18 Roles)
// ==========================================
export const INITIAL_USER_PROFILES: UserSecurityProfile[] = [
  {
    userId: "usr-001",
    name: "Ir. Hendra Gunawan, S.T., IPU",
    email: "hendra.ktt@minesmart.id",
    role: "MINE_MANAGER",
    department: "Technical Management & KTT",
    mfaEnabled: true,
    preferredMfaMethod: "TOTP_AUTHENTICATOR",
    fido2KeysCount: 2,
    backupCodesRemaining: 8,
    lastPasswordChange: "2026-07-15",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 3,
    activeSessionsCount: 2,
  },
  {
    userId: "usr-002",
    name: "Ahmad Rizky (Super Admin)",
    email: "admin.sec@minesmart.id",
    role: "SUPER_ADMIN",
    department: "Enterprise Information Security",
    mfaEnabled: true,
    preferredMfaMethod: "FIDO2_WEBAUTHN",
    fido2KeysCount: 3,
    backupCodesRemaining: 10,
    lastPasswordChange: "2026-08-01",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-003",
    name: "Drs. Budi Santoso (Owner)",
    email: "budi.owner@minesmart.id",
    role: "OWNER",
    department: "Board of Commissioners & Ownership",
    mfaEnabled: true,
    preferredMfaMethod: "TOTP_AUTHENTICATOR",
    fido2KeysCount: 1,
    backupCodesRemaining: 10,
    lastPasswordChange: "2026-06-10",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-004",
    name: "Siti Nurhaliza, S.E.",
    email: "siti.finance@minesmart.id",
    role: "FINANCE",
    department: "Commercial & Cost Control",
    mfaEnabled: true,
    preferredMfaMethod: "SMS_OTP",
    fido2KeysCount: 0,
    backupCodesRemaining: 6,
    lastPasswordChange: "2026-06-20",
    failedLoginAttempts: 1,
    isAccountLocked: false,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-005",
    name: "Agus Supardi",
    email: "agus.dispatch@minesmart.id",
    role: "DISPATCH",
    department: "Mine Pit Dispatch Center",
    mfaEnabled: false,
    preferredMfaMethod: "EMAIL_OTP",
    fido2KeysCount: 0,
    backupCodesRemaining: 0,
    lastPasswordChange: "2026-05-10",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 1,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-006",
    name: "Bambang Wibowo, S.T.",
    email: "bambang.eng@minesmart.id",
    role: "ENGINEERING",
    department: "Mine Planning & Design",
    mfaEnabled: true,
    preferredMfaMethod: "TOTP_AUTHENTICATOR",
    fido2KeysCount: 1,
    backupCodesRemaining: 8,
    lastPasswordChange: "2026-07-02",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-007",
    name: "Dewi Lestari, S.Si.",
    email: "dewi.geo@minesmart.id",
    role: "GEOLOGY",
    department: "Geological Exploration & Quality",
    mfaEnabled: false,
    preferredMfaMethod: "EMAIL_OTP",
    fido2KeysCount: 0,
    backupCodesRemaining: 0,
    lastPasswordChange: "2026-06-18",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 1,
    activeSessionsCount: 1,
  },
  {
    userId: "usr-008",
    name: "Rahmat Hidayat (HSE Lead)",
    email: "rahmat.hse@minesmart.id",
    role: "HSE",
    department: "Health, Safety & Environment",
    mfaEnabled: true,
    preferredMfaMethod: "TOTP_AUTHENTICATOR",
    fido2KeysCount: 1,
    backupCodesRemaining: 9,
    lastPasswordChange: "2026-07-20",
    failedLoginAttempts: 0,
    isAccountLocked: false,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
];

// ==========================================
// 4. JWT & ENCRYPTION CONFIGURATION
// ==========================================
export const INITIAL_JWT_CONFIG: JWTCryptographyConfig = {
  algorithm: "RS256",
  activeKeyId: "mine-rsa-key-2026-q3-v4",
  keyGeneratedAt: "2026-07-01T00:00:00Z",
  nextRotationDate: "2026-10-01T00:00:00Z",
  accessTokenExpiryMin: 30,
  refreshTokenExpiryDays: 14,
  issuer: "https://auth.minesmart.ai/oauth/v2",
  audience: "https://api.minesmart.ai",
  allowSlidingWindow: true,
  blacklistedTokensCount: 14,
};

export const INITIAL_ENCRYPTION_STATUS: EncryptionStatus = {
  dataAtRestAlgorithm: "AES-256-GCM",
  dataAtRestStatus: "FULLY_ENCRYPTED",
  inTransitProtocol: "TLS 1.3 (Strict HSTS)",
  kmsProvider: "Google Cloud KMS",
  kmsKeyRing: "projects/minesmart-enterprise/locations/asia-southeast2/keyRings/hsm-mine-ring",
  masterKeyRotationPeriodDays: 90,
  lastRotatedAt: "2026-07-01T08:00:00Z",
  fieldLevelEncryptionEnabled: true,
  encryptedFieldsCount: 48,
};

// ==========================================
// 5. IMMUTABLE AUDIT TRAIL LOGS
// ==========================================
export const INITIAL_AUDIT_LOGS_EXT: AuditTrailLogItem[] = [
  {
    id: "aud-901",
    timestamp: "2026-08-16 14:15:22 WITA",
    actorId: "usr-001",
    actorName: "Ir. Hendra Gunawan (Mine Manager/KTT)",
    actorRole: "MINE_MANAGER",
    ipAddress: "182.253.110.42",
    location: "Jakarta HQ (Secure Tunnel)",
    module: "RKAB_COMPLIANCE",
    action: "UPDATE",
    severity: "CRITICAL",
    details: "Melakukan digital sign-off persetujuan Dokumen RKAB Triwulan II 2026 ke Dirjen Minerba ESDM.",
    signatureHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "aud-902",
    timestamp: "2026-08-16 13:40:11 WITA",
    actorId: "usr-002",
    actorName: "Ahmad Rizky (Super Admin)",
    actorRole: "SUPER_ADMIN",
    ipAddress: "103.111.201.55",
    location: "Balikpapan Operations Hub",
    module: "SECURITY_SETTINGS",
    action: "PERMISSION_CHANGE",
    severity: "WARNING",
    details: "Memodifikasi kebijakan IP Whitelist CIDR untuk subnet Pit North Dispatch (10.14.0.0/16).",
    signatureHash: "sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589",
  },
  {
    id: "aud-903",
    timestamp: "2026-08-16 12:10:05 WITA",
    actorId: "usr-004",
    actorName: "Siti Nurhaliza (Finance)",
    actorRole: "FINANCE",
    ipAddress: "180.252.12.90",
    location: "Muara Enim Basecamp",
    module: "COMMERCIAL_COST",
    action: "EXPORT",
    severity: "WARNING",
    details: "Melakukan ekspor 2,400 data transaksi pembayaran royalti batubara format XLSX terenkripsi.",
    signatureHash: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  },
  {
    id: "aud-904",
    timestamp: "2026-08-16 10:30:00 WITA",
    actorId: "usr-002",
    actorName: "Ahmad Rizky (Super Admin)",
    actorRole: "SUPER_ADMIN",
    ipAddress: "103.111.201.55",
    location: "Balikpapan Operations Hub",
    module: "BACKUP_SYSTEM",
    action: "BACKUP",
    severity: "INFO",
    details: "Eksekusi snapshot backup manual database master dan seluruh layer GIS (2.4 GB, SHA-256 verified).",
    signatureHash: "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
  },
  {
    id: "aud-905",
    timestamp: "2026-08-16 08:00:15 WITA",
    actorId: "usr-005",
    actorName: "Agus Supardi (Dispatch)",
    actorRole: "DISPATCH",
    ipAddress: "114.122.204.18",
    location: "Pit North Front 3 (VSAT)",
    module: "AUTH_LOGIN",
    action: "MFA_VERIFY",
    severity: "INFO",
    details: "Login berhasil dengan perangkat terdaftar Samsung Galaxy Tab Active4 Pro.",
    signatureHash: "sha256:1a84f3c9e69c1e7a5b3a4f6e3c8d9e2f1a0b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
];

// ==========================================
// 6. LOGIN HISTORY & ANOMALIES
// ==========================================
export const INITIAL_LOGIN_HISTORY: LoginHistoryRecord[] = [
  {
    id: "log-101",
    timestamp: "2026-08-16 14:02:11 WITA",
    userId: "usr-001",
    userName: "Ir. Hendra Gunawan (Mine Manager)",
    userRole: "MINE_MANAGER",
    ipAddress: "182.253.110.42",
    location: "Jakarta, Indonesia",
    isp: "PT Telkom Indonesia",
    deviceType: "DESKTOP",
    browser: "Chrome 127.0 Enterprise",
    os: "macOS Sequoia 15.0",
    status: "SUCCESS",
    riskScore: 5,
  },
  {
    id: "log-102",
    timestamp: "2026-08-16 13:45:00 WITA",
    userId: "usr-004",
    userName: "Siti Nurhaliza",
    userRole: "FINANCE",
    ipAddress: "180.252.12.90",
    location: "Palembang, Indonesia",
    isp: "Indosat Ooredoo",
    deviceType: "LAPTOP",
    browser: "Edge 126.0",
    os: "Windows 11 Pro",
    status: "SUCCESS",
    riskScore: 12,
  },
  {
    id: "log-103",
    timestamp: "2026-08-16 11:20:45 WITA",
    userId: "usr-unknown",
    userName: "Percobaan Akses: hendra.ktt@minesmart.id",
    userRole: "MINE_MANAGER",
    ipAddress: "45.142.120.88",
    location: "Frankfurt, Germany",
    isp: "Anonymized VPN Exit Node",
    deviceType: "DESKTOP",
    browser: "Firefox 115 (Headless)",
    os: "Linux x86_64",
    status: "ANOMALY_GEOVELOCITY",
    riskScore: 98,
    flaggedReason: "Kecepatan perjalanan fisik mustahil (Jakarta -> Frankfurt dalam selang 10 menit). Diblokir otomatis oleh AI Threat Shield.",
  },
  {
    id: "log-104",
    timestamp: "2026-08-16 07:15:30 WITA",
    userId: "usr-005",
    userName: "Agus Supardi",
    userRole: "DISPATCH",
    ipAddress: "114.122.204.18",
    location: "Muara Enim, South Sumatra",
    isp: "Telkomsel Mining Satellite",
    deviceType: "RUGGED_PIT",
    browser: "MineSmart Mobile PWA",
    os: "Android 14 Rugged",
    status: "SUCCESS",
    riskScore: 2,
  },
  {
    id: "log-105",
    timestamp: "2026-08-15 22:40:10 WITA",
    userId: "usr-002",
    userName: "Ahmad Rizky",
    userRole: "SUPER_ADMIN",
    ipAddress: "103.111.201.55",
    location: "Balikpapan, East Kalimantan",
    isp: "Biznet Networks",
    deviceType: "DESKTOP",
    browser: "Chrome 127.0",
    os: "macOS Sequoia",
    status: "SUCCESS",
    riskScore: 4,
  },
];

// ==========================================
// 7. ENTERPRISE DEVICE REGISTRY
// ==========================================
export const INITIAL_DEVICES: EnterpriseDeviceRecord[] = [
  {
    deviceId: "dev-001",
    deviceName: "MacBook Pro 16 - KTT Executive",
    assignedUserId: "usr-001",
    assignedUserName: "Ir. Hendra Gunawan (KTT)",
    deviceType: "LAPTOP",
    os: "macOS Sequoia 15.0",
    model: "Apple MacBook Pro M3 Max",
    serialNumber: "C02G80XZMD6R",
    ipAddress: "182.253.110.42",
    lastLocation: "Jakarta Corporate HQ",
    registeredAt: "2026-01-10",
    lastActiveAt: "2026-08-16 14:15 WITA",
    isBiometricEnrolled: true,
    isDiskEncrypted: true,
    isMdmCompliant: true,
    status: "TRUSTED",
  },
  {
    deviceId: "dev-002",
    deviceName: "Panasonic Toughbook CF-33 (Pit Alpha Control)",
    assignedUserId: "usr-004",
    assignedUserName: "Agus Supardi (Dispatcher)",
    deviceType: "RUGGED_TABLET_PIT",
    os: "Windows 11 Pro Rugged Edition",
    model: "Panasonic Toughbook CF-33 Mk3",
    serialNumber: "TB-2026-8841-ID",
    ipAddress: "114.122.204.18",
    lastLocation: "Pit North Alpha Bench 3",
    registeredAt: "2026-03-15",
    lastActiveAt: "2026-08-16 14:10 WITA",
    isBiometricEnrolled: true,
    isDiskEncrypted: true,
    isMdmCompliant: true,
    status: "TRUSTED",
  },
  {
    deviceId: "dev-003",
    deviceName: "Samsung Galaxy Tab Active4 Pro (Weighbridge Bay)",
    assignedUserId: "usr-004",
    assignedUserName: "Agus Supardi (Dispatcher)",
    deviceType: "RUGGED_TABLET_PIT",
    os: "Android 14 Knox Enterprise",
    model: "SM-T636B Rugged",
    serialNumber: "R52N30A88XZ",
    ipAddress: "10.14.2.80",
    lastLocation: "Jembatan Timbang ROM B",
    registeredAt: "2026-04-01",
    lastActiveAt: "2026-08-16 13:50 WITA",
    isBiometricEnrolled: true,
    isDiskEncrypted: true,
    isMdmCompliant: true,
    status: "TRUSTED",
  },
  {
    deviceId: "dev-004",
    deviceName: "Dell Latitude 5440 (Finance Dept)",
    assignedUserId: "usr-003",
    assignedUserName: "Siti Nurhaliza",
    deviceType: "LAPTOP",
    os: "Windows 11 Pro",
    model: "Dell Latitude 5440",
    serialNumber: "8G2HK43",
    ipAddress: "180.252.12.90",
    lastLocation: "Palembang Finance Office",
    registeredAt: "2026-02-20",
    lastActiveAt: "2026-08-16 13:45 WITA",
    isBiometricEnrolled: false,
    isDiskEncrypted: true,
    isMdmCompliant: true,
    status: "TRUSTED",
  },
];

// ==========================================
// 8. LIVE USER SESSIONS
// ==========================================
export const INITIAL_SESSIONS: LiveUserSession[] = [
  {
    sessionId: "ses-9981-a",
    userId: "usr-001",
    userName: "Ir. Hendra Gunawan (Mine Manager)",
    userRole: "MINE_MANAGER",
    deviceId: "dev-001",
    deviceName: "MacBook Pro 16 - Mine Manager Executive",
    ipAddress: "182.253.110.42",
    location: "Jakarta Corporate HQ",
    siteId: "site-01",
    siteName: "Pit North Alpha (East Kalimantan)",
    createdAt: "2026-08-16 08:30 WITA",
    lastActivityAt: "2026-08-16 14:15 WITA",
    idleMinutes: 2,
    isCurrentSession: true,
  },
  {
    sessionId: "ses-9982-b",
    userId: "usr-005",
    userName: "Agus Supardi",
    userRole: "DISPATCH",
    deviceId: "dev-002",
    deviceName: "Panasonic Toughbook CF-33",
    ipAddress: "114.122.204.18",
    location: "Pit North Front 3",
    siteId: "site-01",
    siteName: "Pit North Alpha (East Kalimantan)",
    createdAt: "2026-08-16 07:00 WITA",
    lastActivityAt: "2026-08-16 14:10 WITA",
    idleMinutes: 5,
    isCurrentSession: false,
  },
  {
    sessionId: "ses-9983-c",
    userId: "usr-004",
    userName: "Siti Nurhaliza",
    userRole: "FINANCE",
    deviceId: "dev-004",
    deviceName: "Dell Latitude 5440",
    ipAddress: "180.252.12.90",
    location: "Palembang Finance Office",
    siteId: "site-02",
    siteName: "Pit South Bravo (South Sumatra)",
    createdAt: "2026-08-16 09:15 WITA",
    lastActivityAt: "2026-08-16 13:45 WITA",
    idleMinutes: 30,
    isCurrentSession: false,
  },
];

// ==========================================
// 9. IP RESTRICTION & WHITELIST RULES
// ==========================================
export const INITIAL_IP_RULES: IPRestrictionRule[] = [
  {
    id: "ip-rule-01",
    label: "Headquarters Jakarta Office (Corporate VPN)",
    cidr: "182.253.110.0/24",
    type: "ALLOW_WHITELIST",
    targetScope: "ALL_SYSTEM",
    description: "IP publik resmi kantor pusat Jakarta untuk staf eksekutif dan manajemen komersial.",
    createdAt: "2026-01-05",
    createdBy: "Super Admin",
    isActive: true,
  },
  {
    id: "ip-rule-02",
    label: "Pit North Alpha Mining Wi-Fi Subnet",
    cidr: "10.14.0.0/16",
    type: "ALLOW_WHITELIST",
    targetScope: "PIT_DISPATCH_ONLY",
    description: "Subnet jaringan nirkabel MESH tambang untuk armada DT, Excavator, dan Pos Dispatcher.",
    createdAt: "2026-02-12",
    createdBy: "Super Admin",
    isActive: true,
  },
  {
    id: "ip-rule-03",
    label: "Balikpapan Engineering Hub",
    cidr: "103.111.201.0/24",
    type: "ALLOW_WHITELIST",
    targetScope: "ADMIN_ONLY",
    description: "Koneksi fiber optic pusat engineering & IT support Balikpapan.",
    createdAt: "2026-03-01",
    createdBy: "Super Admin",
    isActive: true,
  },
  {
    id: "ip-rule-04",
    label: "Tor Exit Nodes & Known Botnet IP Range",
    cidr: "45.142.120.0/24",
    type: "DENY_BLACKLIST",
    targetScope: "ALL_SYSTEM",
    description: "Daftar hitam ancaman eksternal yang teridentifikasi melakukan password spraying.",
    createdAt: "2026-08-16",
    createdBy: "AI Threat Shield",
    isActive: true,
  },
];

// ==========================================
// 10. BACKUP & DISASTER RECOVERY
// ==========================================
export const INITIAL_BACKUPS: BackupRecord[] = [
  {
    backupId: "bak-20260816-0200",
    timestamp: "2026-08-16 02:00:00 WITA",
    backupType: "FULL_DATABASE",
    sizeMB: 2840,
    encryptedChecksumSha256: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    storageTarget: "CLOUD_STORAGE_MULTI_REGION",
    retentionDays: 2555, // 7 years for mining compliance
    status: "VERIFIED",
    initiatedBy: "Automated Cron (Daily Nightly)",
    durationSec: 142,
  },
  {
    backupId: "bak-20260815-0200",
    timestamp: "2026-08-15 02:00:00 WITA",
    backupType: "FULL_DATABASE",
    sizeMB: 2815,
    encryptedChecksumSha256: "sha256:1a84f3c9e69c1e7a5b3a4f6e3c8d9e2f1a0b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    storageTarget: "COLD_VAULT_AWS",
    retentionDays: 2555,
    status: "VERIFIED",
    initiatedBy: "Automated Cron (Daily Nightly)",
    durationSec: 138,
  },
  {
    backupId: "bak-20260816-1030-rkab",
    timestamp: "2026-08-16 10:30:00 WITA",
    backupType: "RKAB_DOCUMENTS",
    sizeMB: 840,
    encryptedChecksumSha256: "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    storageTarget: "ON_PREMISE_SITE_NAS",
    retentionDays: 3650, // 10 years legal documents
    status: "VERIFIED",
    initiatedBy: "Ahmad Rizky (Super Admin Manual)",
    durationSec: 45,
  },
  {
    backupId: "bak-20260816-1200-gis",
    timestamp: "2026-08-16 12:00:00 WITA",
    backupType: "GIS_GEOPACKAGE",
    sizeMB: 1450,
    encryptedChecksumSha256: "sha256:9c8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a",
    storageTarget: "CLOUD_STORAGE_MULTI_REGION",
    retentionDays: 1825,
    status: "VERIFIED",
    initiatedBy: "Chief Geologist GIS Sync",
    durationSec: 88,
  },
];

export const INITIAL_RESTORE_POINTS: RestorePoint[] = [
  {
    restorePointId: "rp-01-latest",
    snapshotTime: "2026-08-16 02:00 WITA",
    backupRefId: "bak-20260816-0200",
    description: "Snapshot Penuh Master Database & Seluruh Modul Operasional.",
    rpoMinutes: 5,
    rtoMinutes: 12,
    verifiedIntegrity: true,
  },
  {
    restorePointId: "rp-02-yesterday",
    snapshotTime: "2026-08-15 02:00 WITA",
    backupRefId: "bak-20260815-0200",
    description: "Snapshot Konsisten Akhir Hari (Closing Produksi Harian).",
    rpoMinutes: 15,
    rtoMinutes: 15,
    verifiedIntegrity: true,
  },
];

// ==========================================
// 11. REAL-TIME SECURITY ALERTS
// ==========================================
export const INITIAL_SECURITY_ALERTS: SecurityAlertLog[] = [
  {
    id: "sec-alt-01",
    timestamp: "2026-08-16 11:20 WITA",
    alertType: "IMPOSSIBLE_TRAVEL_SPEED",
    severity: "CRITICAL",
    sourceIp: "45.142.120.88 (Frankfurt, DE)",
    targetUser: "ktt@minesmart.id (Ir. Hendra Gunawan)",
    details: "Terdeteksi login berkecepatan 9,800 km/jam antara sesi Jakarta dan Frankfurt dalam rentang 10 menit.",
    status: "MITIGATED",
    countermeasureTaken: "Sesi asing dihentikan seketika, IP diblacklist, dan notifikasi SMS OTP darurat dikirim ke KTT.",
  },
  {
    id: "sec-alt-02",
    timestamp: "2026-08-16 12:15 WITA",
    alertType: "MASS_DATA_EXPORT_EXFILTRATION",
    severity: "MEDIUM",
    sourceIp: "180.252.12.90",
    targetUser: "siti.finance@minesmart.id",
    details: "Pengunduhan masal lebih dari 2,000 baris data keuangan & kontrak komersial melampaui ambang batas harian.",
    status: "INVESTIGATING",
    countermeasureTaken: "Watermark kriptografis disisipkan pada file ekspor dan notifikasi audit dicatat.",
  },
  {
    id: "sec-alt-03",
    timestamp: "2026-08-16 09:30 WITA",
    alertType: "BRUTE_FORCE_ATTEMPT",
    severity: "HIGH",
    sourceIp: "103.245.88.12",
    targetUser: "admin.sec@minesmart.id",
    details: "6 kali percobaan password salah berturut-turut dalam 30 detik pada endpoint login administrator.",
    status: "MITIGATED",
    countermeasureTaken: "IP sumber di-rate-limit 60 menit dan akun admin mewajibkan kunci keamanan fisik FIDO2.",
  },
];

// ==========================================
// 12. ENTERPRISE SECURITY SERVICE CLASS
// ==========================================
export class EnterpriseSecurityService {
  private static permissions: PermissionDefinition[] = ALL_PERMISSIONS;
  private static roles: RoleRBACPolicy[] = INITIAL_ROLES;
  private static userProfiles: UserSecurityProfile[] = INITIAL_USER_PROFILES;
  private static jwtConfig: JWTCryptographyConfig = INITIAL_JWT_CONFIG;
  private static encryptionStatus: EncryptionStatus = INITIAL_ENCRYPTION_STATUS;
  private static auditLogs: AuditTrailLogItem[] = INITIAL_AUDIT_LOGS_EXT;
  private static loginHistory: LoginHistoryRecord[] = INITIAL_LOGIN_HISTORY;
  private static devices: EnterpriseDeviceRecord[] = INITIAL_DEVICES;
  private static liveSessions: LiveUserSession[] = INITIAL_SESSIONS;
  private static ipRules: IPRestrictionRule[] = INITIAL_IP_RULES;
  private static backups: BackupRecord[] = INITIAL_BACKUPS;
  private static restorePoints: RestorePoint[] = INITIAL_RESTORE_POINTS;
  private static securityAlerts: SecurityAlertLog[] = INITIAL_SECURITY_ALERTS;

  // --- RBAC Operations ---
  public static getRoles(): RoleRBACPolicy[] {
    return [...this.roles];
  }

  public static getPermissions(): PermissionDefinition[] {
    return [...this.permissions];
  }

  public static updateRolePermissions(roleKey: SecurityRole, newPermissions: string[]): void {
    const r = this.roles.find((item) => item.role === roleKey);
    if (r) {
      r.permissions = newPermissions;
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "RBAC_PERMISSIONS",
        action: "PERMISSION_CHANGE",
        severity: "CRITICAL",
        details: `Izin akses untuk role '${r.roleName}' diperbarui (${newPermissions.length} permissions aktif).`,
      });
    }
  }

  public static toggleRoleMFA(roleKey: SecurityRole, required: boolean): void {
    const r = this.roles.find((item) => item.role === roleKey);
    if (r) {
      r.requireMFA = required;
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "MFA_POLICY",
        action: "PERMISSION_CHANGE",
        severity: "WARNING",
        details: `Kebijakan wajib MFA untuk role '${r.roleName}' diubah menjadi: ${required ? "WAJIB" : "OPSIONAL"}.`,
      });
    }
  }

  // --- User Security & MFA ---
  public static getUserProfiles(): UserSecurityProfile[] {
    return [...this.userProfiles];
  }

  public static toggleUserMFA(userId: string, enabled: boolean): void {
    const u = this.userProfiles.find((item) => item.userId === userId);
    if (u) {
      u.mfaEnabled = enabled;
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "MFA_ENROLLMENT",
        action: "UPDATE",
        severity: "INFO",
        details: `Status 2FA/MFA untuk user '${u.name}' (${u.email}) diatur ke: ${enabled ? "AKTIF" : "NONAKTIF"}.`,
      });
    }
  }

  public static regenerateBackupCodes(userId: string): string[] {
    const codes = Array.from({ length: 10 }, () =>
      `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    );
    const u = this.userProfiles.find((item) => item.userId === userId);
    if (u) {
      u.backupCodesRemaining = 10;
      this.recordAudit({
        actorId: u.userId,
        actorName: u.name,
        actorRole: u.role,
        module: "MFA_BACKUP_CODES",
        action: "UPDATE",
        severity: "WARNING",
        details: `10 Kode Pemulihan Darurat (Emergency Backup Codes) baru di-generate.`,
      });
    }
    return codes;
  }

  // --- JWT Cryptography ---
  public static getJWTConfig(): JWTCryptographyConfig {
    return { ...this.jwtConfig };
  }

  public static rotateJWTRSAKeys(): JWTCryptographyConfig {
    const newKeyId = `mine-rsa-key-${new Date().getFullYear()}-q${Math.floor((new Date().getMonth() + 3) / 3)}-v${Date.now().toString().slice(-4)}`;
    this.jwtConfig = {
      ...this.jwtConfig,
      activeKeyId: newKeyId,
      keyGeneratedAt: new Date().toISOString(),
      nextRotationDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
    };

    this.recordAudit({
      actorId: "usr-002",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      module: "JWT_CRYPTOGRAPHY",
      action: "UPDATE",
      severity: "CRITICAL",
      details: `Rotasi Pasangan Kunci Asimetris RSA-256 JWT berhasil dilakukan. Key ID Baru: ${newKeyId}`,
    });

    return { ...this.jwtConfig };
  }

  public static generateSampleJWT(user: UserSecurityProfile): string {
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT", kid: this.jwtConfig.activeKeyId }));
    const payload = btoa(
      JSON.stringify({
        sub: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        iss: this.jwtConfig.issuer,
        aud: this.jwtConfig.audience,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.jwtConfig.accessTokenExpiryMin * 60,
        jti: `jti-${Math.random().toString(36).substring(2, 9)}`,
        mfa_verified: user.mfaEnabled,
      })
    );
    const mockSignature = btoa(`rsa_sig_${Date.now()}_sha256_verified_minesmart_cloud_kms_key`);
    return `${header}.${payload}.${mockSignature}`;
  }

  // --- Encryption Status & Live Playground ---
  public static getEncryptionStatus(): EncryptionStatus {
    return { ...this.encryptionStatus };
  }

  public static simulateEncryptAES(plainText: string): {
    cipherText: string;
    iv: string;
    authTag: string;
    algorithm: string;
  } {
    const iv = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const authTag = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const cipherText = btoa(unescape(encodeURIComponent(`ENC_AES256GCM[${plainText}]_KEY_MINE_HSM`)));
    return {
      cipherText,
      iv,
      authTag,
      algorithm: "AES-256-GCM (NIST FIPS 140-3 Compliant)",
    };
  }

  // --- Audit Trail ---
  public static getAuditLogs(): AuditTrailLogItem[] {
    return [...this.auditLogs];
  }

  public static recordAudit(
    log: Omit<AuditTrailLogItem, "id" | "timestamp" | "ipAddress" | "location" | "signatureHash">
  ): AuditTrailLogItem {
    const newLog: AuditTrailLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WITA",
      ipAddress: "182.253.110.42",
      location: "Jakarta HQ / Mining Cloud",
      signatureHash: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      ...log,
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // --- Login History ---
  public static getLoginHistory(): LoginHistoryRecord[] {
    return [...this.loginHistory];
  }

  public static lockAccount(userId: string, reason: string): void {
    const u = this.userProfiles.find((item) => item.userId === userId);
    if (u) {
      u.isAccountLocked = true;
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "ACCOUNT_SECURITY",
        action: "UPDATE",
        severity: "CRITICAL",
        details: `Akun '${u.name}' (${u.email}) dikunci secara paksa. Alasan: ${reason}`,
      });
    }
  }

  // --- Device Management ---
  public static getDevices(): EnterpriseDeviceRecord[] {
    return [...this.devices];
  }

  public static remoteWipeDevice(deviceId: string): void {
    const d = this.devices.find((item) => item.deviceId === deviceId);
    if (d) {
      d.status = "WIPED";
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "DEVICE_MDM",
        action: "UPDATE",
        severity: "CRITICAL",
        details: `Perintah Remote Wipe dikirim ke perangkat '${d.deviceName}' (SN: ${d.serialNumber}). Seluruh data lokal dihapus.`,
      });
    }
  }

  public static revokeDevice(deviceId: string): void {
    const d = this.devices.find((item) => item.deviceId === deviceId);
    if (d) {
      d.status = "REVOKED";
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "DEVICE_MDM",
        action: "UPDATE",
        severity: "WARNING",
        details: `Izin otentikasi perangkat '${d.deviceName}' dicabut (Token Revoked).`,
      });
    }
  }

  // --- Session Management ---
  public static getSessions(): LiveUserSession[] {
    return [...this.liveSessions];
  }

  public static terminateSession(sessionId: string): void {
    const ses = this.liveSessions.find((s) => s.sessionId === sessionId);
    if (ses) {
      this.liveSessions = this.liveSessions.filter((s) => s.sessionId !== sessionId);
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "SESSION_MANAGER",
        action: "LOGOUT",
        severity: "INFO",
        details: `Sesi aktif '${ses.sessionId}' milik user '${ses.userName}' pada perangkat '${ses.deviceName}' diputus paksa.`,
      });
    }
  }

  public static terminateAllOtherSessions(userId: string): void {
    const count = this.liveSessions.filter((s) => s.userId === userId && !s.isCurrentSession).length;
    this.liveSessions = this.liveSessions.filter((s) => s.userId !== userId || s.isCurrentSession);
    this.recordAudit({
      actorId: userId,
      actorName: "User Self-Service",
      actorRole: "MINE_MANAGER",
      module: "SESSION_MANAGER",
      action: "LOGOUT",
      severity: "INFO",
      details: `${count} sesi paralel lainnya berhasil diputus.`,
    });
  }

  // --- IP Restriction Rules ---
  public static getIPRules(): IPRestrictionRule[] {
    return [...this.ipRules];
  }

  public static addIPRule(rule: Omit<IPRestrictionRule, "id" | "createdAt" | "createdBy">): IPRestrictionRule {
    const newRule: IPRestrictionRule = {
      id: `ip-rule-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Super Admin",
      ...rule,
    };
    this.ipRules.push(newRule);
    this.recordAudit({
      actorId: "usr-002",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      module: "IP_FIREWALL",
      action: "CREATE",
      severity: "HIGH",
      details: `Aturan CIDR baru ditambahkan: ${rule.cidr} (${rule.label}) - ${rule.type}`,
    });
    return newRule;
  }

  public static toggleIPRule(id: string, active: boolean): void {
    const r = this.ipRules.find((item) => item.id === id);
    if (r) {
      r.isActive = active;
    }
  }

  public static deleteIPRule(id: string): void {
    this.ipRules = this.ipRules.filter((r) => r.id !== id);
  }

  // --- Backup & Disaster Recovery ---
  public static getBackups(): BackupRecord[] {
    return [...this.backups];
  }

  public static triggerManualBackup(
    type: "FULL_DATABASE" | "INCREMENTAL" | "RKAB_DOCUMENTS" | "GIS_GEOPACKAGE" | "SYSTEM_CONFIG"
  ): BackupRecord {
    const newBak: BackupRecord = {
      backupId: `bak-${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12)}-manual`,
      timestamp: new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" }) + " WITA",
      backupType: type,
      sizeMB: type === "FULL_DATABASE" ? 2890 : type === "GIS_GEOPACKAGE" ? 1480 : 850,
      encryptedChecksumSha256: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      storageTarget: "CLOUD_STORAGE_MULTI_REGION",
      retentionDays: 2555,
      status: "VERIFIED",
      initiatedBy: "Super Admin (On-Demand Backup)",
      durationSec: Math.floor(30 + Math.random() * 50),
    };
    this.backups.unshift(newBak);
    this.recordAudit({
      actorId: "usr-002",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      module: "BACKUP_SYSTEM",
      action: "BACKUP",
      severity: "INFO",
      details: `Backup on-demand tipe '${type}' berhasil dieksekusi (${newBak.sizeMB} MB, Terenkripsi AES-256).`,
    });
    return newBak;
  }

  public static getRestorePoints(): RestorePoint[] {
    return [...this.restorePoints];
  }

  // --- Security Alerts ---
  public static getSecurityAlerts(): SecurityAlertLog[] {
    return [...this.securityAlerts];
  }

  public static updateAlertStatus(alertId: string, status: "INVESTIGATING" | "MITIGATED" | "FALSE_POSITIVE"): void {
    const a = this.securityAlerts.find((item) => item.id === alertId);
    if (a) {
      a.status = status;
      this.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "SIEM_ALERTS",
        action: "UPDATE",
        severity: "WARNING",
        details: `Status insiden keamanan '${a.alertType}' (${a.id}) diubah menjadi: ${status}`,
      });
    }
  }
}
