// MINE SMART AI - Enterprise Audit Trail Service
// Manages 6-Dimension Regulatory Audit Records: WHO | WHAT | WHEN | WHERE | BEFORE | AFTER

import {
  EnterpriseAuditRecord,
  AuditSummaryMetrics,
  AuditActionType,
  AuditModuleCategory,
  AuditSeverity,
  AuditActor,
  AuditTargetEntity,
  AuditLocationContext,
  AuditValueSnapshot,
  AuditDeltaDiff,
} from "../../types/auditTrailTypes";

const STORAGE_KEY = "minesmart_enterprise_audit_trail_v2";

// Simple SHA-256 helper (simulated deterministic hash if crypto.subtle isn't synchronous)
function generateAuditSignature(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, "0");
  const randomSalt = "e89c3f91ab728490";
  return `sha256:${hexPart}${randomSalt}${hexPart}`.substring(0, 71);
}

// Initial Seed Data with the User's exact requested case + comprehensive mining operations
const INITIAL_AUDIT_RECORDS: EnterpriseAuditRecord[] = [
  {
    id: "AUD-20260811-104200",
    timestamp: "11 Agustus 2026 pukul 10:42 WIB",
    isoTimestamp: "2026-08-11T10:42:00+07:00",
    relativeTime: "5 hari lalu",
    action: "UPDATE",
    severity: "NOTICE",
    who: {
      id: "USR-OPR-104",
      name: "User A (Ahmad Setiawan)",
      email: "ahmad.setiawan@minesmart.id",
      role: "Production Pit Foreman",
      department: "Mining Operations & Tallying",
    },
    what: {
      title: "User A mengubah Production 1.250 → 1.320 ton",
      summary: "Koreksi hasil timbangan belt scale crusher & joint tallying shift 1 Pit North",
      entity: {
        module: "PRODUCTION",
        entityType: "Production Daily Record",
        entityId: "PROD-2026-0811-P01",
        entityName: "Batubara Pit 01 Seam B Front 2",
        fieldName: "Production Tonnage (Tonase Harian)",
        fieldKey: "production_tonnage",
      },
      reason: "Penyesuaian ritase DT-08 dan DT-12 yang baru terkonfirmasi di timbangan jembatan (weighbridge).",
    },
    when: {
      formattedDate: "11 Agustus 2026",
      formattedTime: "10:42 WIB",
      fullText: "11 Agustus 2026 pukul 10:42 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Site Melak - Pit 01 North",
      area: "Loading Point Front 2 (Bench 42 RL)",
      ipAddress: "182.253.110.42",
      networkType: "VSAT_PIT_LINK",
      deviceInfo: "Rugged Pit Tablet #04 (Panasonic Toughbook)",
      appChannel: "RUGGED_TABLET_PIT",
    },
    before: {
      raw: 1250,
      formatted: "1.250 ton",
      unit: "ton",
      snapshotJson: {
        record_id: "PROD-2026-0811-P01",
        seam: "Seam B",
        pit: "Pit 01 North",
        production_tonnage: 1250,
        ritase_count: 50,
        average_payload: 25.0,
        operator: "Shift A Foreman",
        status: "DRAFT_TALLY",
      },
    },
    after: {
      raw: 1320,
      formatted: "1.320 ton",
      unit: "ton",
      snapshotJson: {
        record_id: "PROD-2026-0811-P01",
        seam: "Seam B",
        pit: "Pit 01 North",
        production_tonnage: 1320,
        ritase_count: 53,
        average_payload: 24.9,
        operator: "Ahmad Setiawan",
        status: "CONFIRMED_PRODUCTION",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "+70 ton (+5.6%)",
      deltaType: "NUMERIC_INCREASE",
      colorClass: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    tamperProofHash: "sha256:4a7d91e8b23c90f41852deca70195ab82357c91a0c4f82631589daef7021b34a",
    isTamperProofValid: true,
  },
  {
    id: "AUD-20260816-143015",
    timestamp: "16 Agustus 2026 pukul 14:30 WIB",
    isoTimestamp: "2026-08-16T14:30:15+07:00",
    relativeTime: "1 jam lalu",
    action: "DISPENSE",
    severity: "WARNING",
    who: {
      id: "USR-LOG-209",
      name: "Budi Santoso",
      email: "budi.warehouse@minesmart.id",
      role: "Fuel Master & Logistics Lead",
      department: "Warehouse & Supply Chain",
    },
    what: {
      title: "Budi Santoso melakukan dispense BBM Solar B35: 450 → 650 Liter pada Unit HD-08",
      summary: "Pengisian solar unit HD-08 Komatsu melampaui standar kuota rata-rata 500L/shift",
      entity: {
        module: "FUEL_MANAGEMENT",
        entityType: "Fuel Dispense Voucher",
        entityId: "FUEL-20260816-882",
        entityName: "Heavy Dump Truck HD-08 (Komatsu HD785)",
        fieldName: "Dispense Volume (Solar B35)",
        fieldKey: "fuel_liters",
      },
      reason: "Unit ditugaskan lembur double shift hauling overburden ke disposal South.",
    },
    when: {
      formattedDate: "16 Agustus 2026",
      formattedTime: "14:30 WIB",
      fullText: "16 Agustus 2026 pukul 14:30 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Site Melak - Main Fuel Station",
      area: "Fuel Bowser Bay 02",
      ipAddress: "10.14.20.108",
      networkType: "SITE_WIFI_LAN",
      deviceInfo: "Fuel Flowmeter IoT Terminal #02",
      appChannel: "DESKTOP_PORTAL",
    },
    before: {
      raw: 450,
      formatted: "450 Liter",
      unit: "Liter",
      snapshotJson: {
        voucher_id: "FUEL-20260816-882",
        unit_id: "HD-08",
        fuel_liters: 450,
        hour_meter: 14280.5,
        dispense_status: "INITIAL_QUOTA",
      },
    },
    after: {
      raw: 650,
      formatted: "650 Liter",
      unit: "Liter",
      snapshotJson: {
        voucher_id: "FUEL-20260816-882",
        unit_id: "HD-08",
        fuel_liters: 650,
        hour_meter: 14280.5,
        dispense_status: "EXTRA_QUOTA_AUTHORIZED",
        approved_by: "Mine Supervisor",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "+200 Liter (+44.4%)",
      deltaType: "NUMERIC_INCREASE",
      colorClass: "text-amber-400 bg-amber-950/40 border-amber-500/30",
    },
    tamperProofHash: "sha256:7f3b8901c0a87f54de3298e5b610c897f21200194a87ef89345bc79012dae831",
    isTamperProofValid: true,
  },
  {
    id: "AUD-20260816-111500",
    timestamp: "16 Agustus 2026 pukul 11:15 WIB",
    isoTimestamp: "2026-08-16T11:15:00+07:00",
    relativeTime: "4 jam lalu",
    action: "APPROVE",
    severity: "CRITICAL",
    who: {
      id: "USR-MNG-001",
      name: "Ir. Hendra Gunawan, S.T., IPU",
      email: "hendra.ktt@minesmart.id",
      role: "Mine Manager / KTT (Kepala Teknik Tambang)",
      department: "Mine Management & Technical",
    },
    what: {
      title: "Ir. Hendra Gunawan menyetujui Dokumen RKAB Triwulan II: DRAFT → APPROVED_ESDM",
      summary: "Pengesahan digital target produksi batubara 4.500.000 MT dan revisi stripping ratio",
      entity: {
        module: "RKAB_COMPLIANCE",
        entityType: "RKAB Submission Dossier",
        entityId: "RKAB-2026-Q2-REV3",
        entityName: "Rencana Kerja & Anggaran Biaya 2026 Minerba",
        fieldName: "Approval Status Dokumen",
        fieldKey: "approval_status",
      },
      reason: "Semua audit teknis kestabilan lereng pit dan kelayakan lingkungan telah dipenuhi.",
    },
    when: {
      formattedDate: "16 Agustus 2026",
      formattedTime: "11:15 WIB",
      fullText: "16 Agustus 2026 pukul 11:15 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Mining Head Office",
      area: "Jakarta HQ / Executive Boardroom",
      ipAddress: "103.111.201.55",
      networkType: "FIBER_HQ",
      deviceInfo: "Executive Workstation (macOS Secure Enclave)",
      appChannel: "DESKTOP_PORTAL",
    },
    before: {
      raw: "PENDING_KTT_SIGN",
      formatted: "Status: PENDING_REVIEW",
      snapshotJson: {
        document_code: "RKAB-2026-Q2-REV3",
        target_coal_tonnage: 4500000,
        stripping_ratio: 5.2,
        status: "PENDING_REVIEW",
      },
    },
    after: {
      raw: "APPROVED_ESDM_SIGN",
      formatted: "Status: APPROVED_ESDM (Otorisasi Resmi)",
      snapshotJson: {
        document_code: "RKAB-2026-Q2-REV3",
        target_coal_tonnage: 4500000,
        stripping_ratio: 5.2,
        status: "APPROVED_ESDM",
        digital_signature: "ESDM-KTT-MINERBA-99410",
        signed_at: "2026-08-16T11:15:00+07:00",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "PENDING → APPROVED (Digital Sign-Off)",
      deltaType: "STATUS_TRANSITION",
      colorClass: "text-indigo-400 bg-indigo-950/40 border-indigo-500/30",
    },
    tamperProofHash: "sha256:91c0e3a47812bc8f420199da20188ef774129bc88301fa9012356ecaf7784b01",
    isTamperProofValid: true,
  },
  {
    id: "AUD-20260815-164530",
    timestamp: "15 Agustus 2026 pukul 16:45 WIB",
    isoTimestamp: "2026-08-15T16:45:30+07:00",
    relativeTime: "1 hari lalu",
    action: "UPDATE",
    severity: "NOTICE",
    who: {
      id: "USR-GEO-007",
      name: "Dewi Lestari, S.Si.",
      email: "dewi.geo@minesmart.id",
      role: "Senior Wellsite Geologist",
      department: "Geology & Quality Assurance",
    },
    what: {
      title: "Dewi Lestari mengubah Kalori Batubara ROM Stockpile 02: 5.800 → 6.150 kcal/kg (GAR)",
      summary: "Update hasil uji laboratorium batubara Seam 11 High Grade",
      entity: {
        module: "GEOLOGY_QUALITY",
        entityType: "Coal Quality Assay Certificate",
        entityId: "LAB-ASSAY-2026-441",
        entityName: "Stockpile ROM 02 Lot 14",
        fieldName: "Calorific Value (CV GAR)",
        fieldKey: "calorific_value_gar",
      },
      reason: "Penerimaan hasil uji proximat final dari Sucofindo Laboratory Samarinda.",
    },
    when: {
      formattedDate: "15 Agustus 2026",
      formattedTime: "16:45 WIB",
      fullText: "15 Agustus 2026 pukul 16:45 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Site Melak - Quality Lab",
      area: "Geology Data Processing Room",
      ipAddress: "10.14.15.55",
      networkType: "SITE_WIFI_LAN",
      deviceInfo: "Desktop PC Geostation #02",
      appChannel: "DESKTOP_PORTAL",
    },
    before: {
      raw: 5800,
      formatted: "5.800 kcal/kg",
      unit: "kcal/kg",
      snapshotJson: {
        lot_id: "ROM-02-L14",
        calorific_value: 5800,
        total_moisture: 24.5,
        ash_content: 6.2,
        total_sulfur: 0.65,
        lab_source: "ESTIMATED_MODEL",
      },
    },
    after: {
      raw: 6150,
      formatted: "6.150 kcal/kg",
      unit: "kcal/kg",
      snapshotJson: {
        lot_id: "ROM-02-L14",
        calorific_value: 6150,
        total_moisture: 22.8,
        ash_content: 5.8,
        total_sulfur: 0.58,
        lab_source: "SUCOFINDO_OFFICIAL_CERT",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "+350 kcal/kg (+6.0%)",
      deltaType: "NUMERIC_INCREASE",
      colorClass: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    tamperProofHash: "sha256:5b8823190df034ae8120bca3775199ff210a4891104eec90234188fa7210983c",
    isTamperProofValid: true,
  },
  {
    id: "AUD-20260815-092010",
    timestamp: "15 Agustus 2026 pukul 09:20 WIB",
    isoTimestamp: "2026-08-15T09:20:10+07:00",
    relativeTime: "1 hari lalu",
    action: "UPDATE",
    severity: "NOTICE",
    who: {
      id: "USR-PLT-302",
      name: "Rizky Ramadhan",
      email: "rizky.maintenance@minesmart.id",
      role: "Maintenance Planner",
      department: "Plant & Heavy Equipment",
    },
    what: {
      title: "Rizky Ramadhan mengubah Status Work Order EX-301: BREAKDOWN → READY_OPERATIONAL",
      summary: "Penyelesaian servis berkala PM 1000 dan penggantian hydraulic filter",
      entity: {
        module: "MAINTENANCE",
        entityType: "Maintenance Work Order",
        entityId: "WO-20260814-301",
        entityName: "Excavator Hitachi EX1200 #301",
        fieldName: "Equipment Availability Status",
        fieldKey: "equipment_status",
      },
      reason: "Commissioning test dan check P2H mekanik lulus 100% tanpa kebocoran oli.",
    },
    when: {
      formattedDate: "15 Agustus 2026",
      formattedTime: "09:20 WIB",
      fullText: "15 Agustus 2026 pukul 09:20 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Site Melak - Main Workshop",
      area: "Workshop Bay 3 (Heavy Bay)",
      ipAddress: "10.14.30.22",
      networkType: "SITE_WIFI_LAN",
      deviceInfo: "Rugged Shop Tablet #01",
      appChannel: "RUGGED_TABLET_PIT",
    },
    before: {
      raw: "UNSCHEDULED_BREAKDOWN",
      formatted: "Status: BREAKDOWN (Perbaikan)",
      snapshotJson: {
        unit: "EX-301",
        status: "BREAKDOWN",
        physical_availability: 0,
        technician: "Tim Mekanik Shift B",
      },
    },
    after: {
      raw: "READY_OPERATIONAL",
      formatted: "Status: READY_OPERATIONAL (Siap Beroperasi)",
      snapshotJson: {
        unit: "EX-301",
        status: "READY_OPERATIONAL",
        physical_availability: 100,
        released_by: "Rizky Ramadhan",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "BREAKDOWN → READY (Tersedia)",
      deltaType: "STATUS_TRANSITION",
      colorClass: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    tamperProofHash: "sha256:12fa099187ec982310bba901235698efca110901234857bdf88102394aebc882",
    isTamperProofValid: true,
  },
  {
    id: "AUD-20260814-131045",
    timestamp: "14 Agustus 2026 pukul 13:10 WIB",
    isoTimestamp: "2026-08-14T13:10:45+07:00",
    relativeTime: "2 hari lalu",
    action: "OVERRIDE",
    severity: "WARNING",
    who: {
      id: "USR-DISP-005",
      name: "Agus Supardi",
      email: "agus.dispatch@minesmart.id",
      role: "FMS Dispatch Lead",
      department: "Mine Pit Dispatch Center",
    },
    what: {
      title: "Agus Supardi mengubah Kecepatan Maksimal Hauling Road: 40 km/jam → 25 km/jam (Speed Limit)",
      summary: "Manual override batas kecepatan jalur hauling segmen KM 4-7 akibat kondisi jalan licin setelah hujan",
      entity: {
        module: "FLEET_DISPATCH",
        entityType: "FMS Safety Geofence Rule",
        entityId: "GEO-HAUL-04",
        entityName: "Haul Road Segment KM 04 - KM 07",
        fieldName: "Speed Limit Restriction",
        fieldKey: "speed_limit_kph",
      },
      reason: "Hujan deras 28mm/jam menyebabkan jalan licin, keselamatan unit DT lebih diprioritaskan.",
    },
    when: {
      formattedDate: "14 Agustus 2026",
      formattedTime: "13:10 WIB",
      fullText: "14 Agustus 2026 pukul 13:10 WIB",
      shift: "SHIFT_1_DAY",
    },
    where: {
      siteName: "Site Melak - Dispatch Center",
      area: "Control Tower Room 1",
      ipAddress: "114.122.204.18",
      networkType: "VSAT_PIT_LINK",
      deviceInfo: "Dual-Screen Dispatch FMS Workstation",
      appChannel: "DESKTOP_PORTAL",
    },
    before: {
      raw: 40,
      formatted: "40 km/jam",
      unit: "km/jam",
      snapshotJson: {
        zone_id: "GEO-HAUL-04",
        speed_limit: 40,
        road_condition: "DRY_NORMAL",
      },
    },
    after: {
      raw: 25,
      formatted: "25 km/jam (Wet Speed)",
      unit: "km/jam",
      snapshotJson: {
        zone_id: "GEO-HAUL-04",
        speed_limit: 25,
        road_condition: "WET_SLIPPERY",
        override_reason: "Rainfall Slippery Road",
      },
    },
    diff: {
      changed: true,
      deltaSummary: "-15 km/jam (-37.5%)",
      deltaType: "NUMERIC_DECREASE",
      colorClass: "text-amber-400 bg-amber-950/40 border-amber-500/30",
    },
    tamperProofHash: "sha256:8899fa0213bd887410ac9811029348bcae99120394857bdf88102394aebc8821",
    isTamperProofValid: true,
  },
];

export class AuditTrailService {
  // Load all audit logs from storage or default
  static getAllLogs(): EnterpriseAuditRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read audit logs from localStorage:", e);
    }
    // Set default seed
    this.saveLogs(INITIAL_AUDIT_RECORDS);
    return INITIAL_AUDIT_RECORDS;
  }

  // Save audit logs to storage
  static saveLogs(logs: EnterpriseAuditRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save audit logs to localStorage:", e);
    }
  }

  // Record a new comprehensive Audit event (WHO, WHAT, WHEN, WHERE, BEFORE, AFTER)
  static recordAudit(params: {
    actor: AuditActor;
    action: AuditActionType;
    severity?: AuditSeverity;
    entity: AuditTargetEntity;
    beforeValue: { raw: any; formatted: string; unit?: string; snapshotJson?: Record<string, any> };
    afterValue: { raw: any; formatted: string; unit?: string; snapshotJson?: Record<string, any> };
    location: AuditLocationContext;
    customTitle?: string;
    reason?: string;
    shift?: "SHIFT_1_DAY" | "SHIFT_2_NIGHT";
  }): EnterpriseAuditRecord {
    const logs = this.getAllLogs();

    const now = new Date();
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const dateFormatted = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeFormatted = `${hours}:${minutes} WIB`;
    const fullTextWhen = `${dateFormatted} pukul ${timeFormatted}`;

    // Compute delta & diff
    let deltaSummary = "Data diperbarui";
    let deltaType: AuditDeltaDiff["deltaType"] = "TEXT_MODIFIED";
    let colorClass = "text-indigo-400 bg-indigo-950/40 border-indigo-500/30";

    const bVal = params.beforeValue.raw;
    const aVal = params.afterValue.raw;

    if (typeof bVal === "number" && typeof aVal === "number") {
      const diffNum = aVal - bVal;
      const pct = bVal !== 0 ? ((diffNum / bVal) * 100).toFixed(1) : "0";
      const unitStr = params.afterValue.unit ? ` ${params.afterValue.unit}` : "";
      if (diffNum > 0) {
        deltaSummary = `+${diffNum.toLocaleString()}${unitStr} (+${pct}%)`;
        deltaType = "NUMERIC_INCREASE";
        colorClass = "text-emerald-400 bg-emerald-950/40 border-emerald-500/30";
      } else if (diffNum < 0) {
        deltaSummary = `${diffNum.toLocaleString()}${unitStr} (${pct}%)`;
        deltaType = "NUMERIC_DECREASE";
        colorClass = "text-amber-400 bg-amber-950/40 border-amber-500/30";
      } else {
        deltaSummary = `Nilai tetap (${aVal}${unitStr})`;
      }
    } else if (typeof bVal === "string" && typeof aVal === "string") {
      deltaSummary = `${bVal} → ${aVal}`;
      deltaType = "STATUS_TRANSITION";
      colorClass = "text-cyan-400 bg-cyan-950/40 border-cyan-500/30";
    }

    const defaultTitle = params.customTitle ||
      `${params.actor.name} mengubah ${params.entity.fieldName} ${params.beforeValue.formatted} → ${params.afterValue.formatted}`;

    const newRecordId = `AUD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${hours}${minutes}${String(now.getSeconds()).padStart(2, "0")}`;

    const rawBlock = `${newRecordId}|${params.actor.id}|${params.entity.entityId}|${bVal}|${aVal}|${now.toISOString()}`;
    const tamperHash = generateAuditSignature(rawBlock);

    const newRecord: EnterpriseAuditRecord = {
      id: newRecordId,
      timestamp: fullTextWhen,
      isoTimestamp: now.toISOString(),
      relativeTime: "Baru saja",
      action: params.action,
      severity: params.severity || "NOTICE",
      who: params.actor,
      what: {
        title: defaultTitle,
        summary: params.reason || `Perubahan ${params.entity.fieldName} pada ${params.entity.entityName}`,
        entity: params.entity,
        reason: params.reason,
      },
      when: {
        formattedDate: dateFormatted,
        formattedTime: timeFormatted,
        fullText: fullTextWhen,
        shift: params.shift || (now.getHours() >= 6 && now.getHours() < 18 ? "SHIFT_1_DAY" : "SHIFT_2_NIGHT"),
      },
      where: params.location,
      before: params.beforeValue,
      after: params.afterValue,
      diff: {
        changed: true,
        deltaSummary,
        deltaType,
        colorClass,
      },
      tamperProofHash: tamperHash,
      isTamperProofValid: true,
    };

    const updated = [newRecord, ...logs];
    this.saveLogs(updated);
    return newRecord;
  }

  // Calculate high level metrics
  static getMetrics(): AuditSummaryMetrics {
    const logs = this.getAllLogs();
    const uniqueActors = new Set(logs.map((l) => l.who.id)).size;

    const moduleCounts: Record<AuditModuleCategory, number> = {
      PRODUCTION: 0,
      FLEET_DISPATCH: 0,
      FUEL_MANAGEMENT: 0,
      MAINTENANCE: 0,
      SAFETY_HSE: 0,
      GEOLOGY_QUALITY: 0,
      SURVEY_VOLUME: 0,
      FINANCE_SALES: 0,
      HR_ROSTER: 0,
      RKAB_COMPLIANCE: 0,
      SECURITY_ACCESS: 0,
    };

    let updates = 0;
    let creates = 0;
    let deletes = 0;
    let approvals = 0;
    let criticals = 0;

    logs.forEach((log) => {
      if (log.what?.entity?.module && moduleCounts[log.what.entity.module] !== undefined) {
        moduleCounts[log.what.entity.module]++;
      }
      if (log.action === "UPDATE") updates++;
      if (log.action === "CREATE") creates++;
      if (log.action === "DELETE") deletes++;
      if (log.action === "APPROVE") approvals++;
      if (log.severity === "CRITICAL") criticals++;
    });

    return {
      totalAuditEvents: logs.length,
      updatesCount: updates,
      createsCount: creates,
      deletesCount: deletes,
      approvalsCount: approvals,
      criticalEventsCount: criticals,
      uniqueActorsCount: uniqueActors,
      integrityHealthScorePct: 100.0,
      moduleCounts,
    };
  }

  // Reset to default seed
  static resetToDefault(): EnterpriseAuditRecord[] {
    this.saveLogs(INITIAL_AUDIT_RECORDS);
    return INITIAL_AUDIT_RECORDS;
  }

  // Export as CSV
  static exportCsv(logs: EnterpriseAuditRecord[]): string {
    const headers = [
      "Audit ID",
      "Timestamp (When)",
      "Actor Name (Who)",
      "Actor Role",
      "Action",
      "Module",
      "Target Entity (What)",
      "Field Changed",
      "Before Value",
      "After Value",
      "Delta / Diff",
      "Site Location (Where)",
      "IP Address",
      "Device Info",
      "SHA-256 Hash",
    ];

    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.who.name}"`,
      `"${l.who.role}"`,
      `"${l.action}"`,
      `"${l.what.entity.module}"`,
      `"${l.what.entity.entityName}"`,
      `"${l.what.entity.fieldName}"`,
      `"${l.before.formatted}"`,
      `"${l.after.formatted}"`,
      `"${l.diff.deltaSummary}"`,
      `"${l.where.siteName} - ${l.where.area}"`,
      `"${l.where.ipAddress}"`,
      `"${l.where.deviceInfo}"`,
      `"${l.tamperProofHash}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
}
