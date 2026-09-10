// MINE SMART AI - Enterprise Audit Trail System Types
// 6 Core Regulatory Dimensions: WHO | WHAT | WHEN | WHERE | BEFORE | AFTER
// Compliant with ESDM Kepmen 1827, ISO 27001, SOC2, and Minerba Governance

export type AuditActionType =
  | "UPDATE"          // Mengubah data (Before → After)
  | "CREATE"          // Menambah data baru
  | "DELETE"          // Menghapus data
  | "APPROVE"         // Menyetujui / Tanda Tangan Digital
  | "REJECT"          // Menolak pengajuan
  | "DISPENSE"        // Pengeluaran BBM / Spareparts
  | "OVERRIDE"        // Manual Override / Safety Bypass
  | "EXPORT"          // Ekspor data sensitif
  | "LOGIN"           // Sesi Otentikasi
  | "RESTORE";        // Pemulihan data dari snapshot

export type AuditModuleCategory =
  | "PRODUCTION"      // Produksi Pit, Ritase, Tonnage
  | "FLEET_DISPATCH"  // Dispatch, FMS, Unit Assignment
  | "FUEL_MANAGEMENT" // Dispensing Solar B35, Fuel Bowser
  | "MAINTENANCE"     // Work Order, Service PM, Backlog
  | "SAFETY_HSE"      // JSA, Safety Permit, Insiden K3
  | "GEOLOGY_QUALITY" // Seam Batubara, Assay Lab, Kalori
  | "SURVEY_VOLUME"   // Joint Survey, Cut & Fill, Kemajuan
  | "FINANCE_SALES"   // Invoicing, Royalti e-PNBP, HBA
  | "HR_ROSTER"       // Lembur SPL, Cuti, Absensi
  | "RKAB_COMPLIANCE" // Laporan Minerba ESDM
  | "SECURITY_ACCESS";// RBAC, IP Whitelist, KMS Key

export type AuditSeverity = "INFO" | "NOTICE" | "WARNING" | "CRITICAL";

export interface AuditActor {
  id: string;             // e.g. "USR-OPR-104"
  name: string;           // e.g. "User A (Ahmad Setiawan)"
  email?: string;
  role: string;           // e.g. "Production Pit Foreman"
  department: string;     // e.g. "Mining Operations"
  avatarUrl?: string;
}

export interface AuditTargetEntity {
  module: AuditModuleCategory;
  entityType: string;     // e.g. "Production Daily Record", "Fuel Dispense", "Work Order"
  entityId: string;       // e.g. "PROD-2026-0811", "WO-4921"
  entityName: string;     // e.g. "Pit 02 Seam B Shift 1"
  fieldName: string;      // e.g. "Production Tonnage", "Fuel Quantity", "Unit Status"
  fieldKey: string;       // e.g. "daily_tonnage", "fuel_liters", "status"
}

export interface AuditLocationContext {
  siteName: string;       // e.g. "Site Melak - Pit 02 North"
  area: string;           // e.g. "Loading Point Front 3"
  ipAddress: string;      // e.g. "182.253.110.42"
  networkType: "VSAT_PIT_LINK" | "CELLULAR_4G_5G" | "FIBER_HQ" | "SITE_WIFI_LAN";
  deviceInfo: string;     // e.g. "Rugged Pit Tablet #04 (Panasonic Toughbook)"
  appChannel: "DESKTOP_PORTAL" | "RUGGED_TABLET_PIT" | "MOBILE_APP" | "API_GATEWAY";
}

export interface AuditValueSnapshot {
  raw: any;               // Raw value
  formatted: string;      // Human readable formatted value, e.g. "1.250 ton"
  unit?: string;          // e.g. "ton", "Liter", "BCM", "IDR"
  snapshotJson?: Record<string, any>; // Full structured entity JSON snapshot
}

export interface AuditDeltaDiff {
  changed: boolean;
  deltaSummary: string;   // e.g. "+70 ton (+5.6%)"
  deltaType: "NUMERIC_INCREASE" | "NUMERIC_DECREASE" | "STATUS_TRANSITION" | "TEXT_MODIFIED" | "NEW_RECORD" | "RECORD_REMOVED";
  colorClass?: string;
}

export interface EnterpriseAuditRecord {
  id: string;             // Unique ID e.g. "AUD-20260811-104201"
  timestamp: string;      // Formatted timestamp e.g. "11 Agustus 2026 pukul 10:42 WIB"
  isoTimestamp: string;   // ISO 8601 e.g. "2026-08-11T10:42:00+07:00"
  relativeTime: string;   // e.g. "5 hari lalu"
  action: AuditActionType;
  severity: AuditSeverity;
  
  // 1. WHO (Pelaku Aksi)
  who: AuditActor;

  // 2. WHAT (Objek & Tindakan)
  what: {
    title: string;        // e.g. "User A mengubah Production 1.250 → 1.320 ton"
    summary: string;      // Human readable summary
    entity: AuditTargetEntity;
    reason?: string;      // Optional change justification
  };

  // 3. WHEN (Waktu Terjadinya)
  when: {
    formattedDate: string; // "11 Agustus 2026"
    formattedTime: string; // "10:42 WIB"
    fullText: string;      // "11 Agustus 2026 pukul 10:42 WIB"
    shift?: "SHIFT_1_DAY" | "SHIFT_2_NIGHT";
  };

  // 4. WHERE (Lokasi & Perangkat)
  where: AuditLocationContext;

  // 5. BEFORE (Nilai Sebelum Perubahan)
  before: AuditValueSnapshot;

  // 6. AFTER (Nilai Sesudah Perubahan)
  after: AuditValueSnapshot;

  // Visual Delta / Difference calculation
  diff: AuditDeltaDiff;

  // Cryptographic Ledger Verification
  tamperProofHash: string; // SHA-256 hash of entire block
  isTamperProofValid: boolean;
}

export interface AuditSummaryMetrics {
  totalAuditEvents: number;
  updatesCount: number;
  createsCount: number;
  deletesCount: number;
  approvalsCount: number;
  criticalEventsCount: number;
  uniqueActorsCount: number;
  integrityHealthScorePct: number; // 100% means 0 tampering detected
  moduleCounts: Record<AuditModuleCategory, number>;
}
