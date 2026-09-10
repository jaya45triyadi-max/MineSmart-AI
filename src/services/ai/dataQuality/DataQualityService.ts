// MINE SMART AI - Data Quality Engine Service
// 6 Core AI Dimensions: Data Kosong | Data Duplikat | Data Tidak Wajar | Data Salah Input | Data Outlier | Data Conflict
// Featured Showcase: ⚠️ Fuel consumption HD-08 = 4.200 liter/jam. Nilai ini berada jauh di luar baseline.

import {
  DataQualityIssue,
  DataQualityDimension,
  DataQualitySeverity,
  DataQualitySummary,
  DataQualityRule,
  DomainHealthScore,
  CrossSourceComparison,
} from "../../../types/dataQualityTypes";

const INITIAL_ISSUES: DataQualityIssue[] = [
  // 1. DATA OUTLIER (FEATURED EXAMPLE)
  {
    id: "DQI-2026-OUT-001",
    dimension: "OUTLIER_DATA",
    severity: "CRITICAL",
    domain: "FLEET_FUEL",
    entityId: "HD-08",
    entityType: "HAULER",
    fieldAffected: "fuel_burn_rate_lph",
    currentValue: "4.200 Liter/Jam",
    expectedBaseline: "65.0 - 82.0 Liter/Jam (Baseline Komatsu HD785-7)",
    varianceRatio: "+5,020% di luar batas baseline wajar",
    detectedTimestamp: "5 menit yang lalu",
    sourceSystem: "IoT Telemetry CAN-Bus Gateway (Unit HD-08)",
    title: "⚠️ Fuel Consumption HD-08 Berada Jauh di Luar Baseline",
    description: "Nilai konsumsi bahan bakar unit HD-08 tercatat sebesar 4.200 liter/jam pada segmen hauling Pit 02 ke ROM Stockpile. Nilai ini secara fisik mustahil untuk engine Cummins SSA12V159 (Max flow limit 120 L/jam).",
    aiRootCauseHypothesis: "Anomali terdeteksi akibat pergeseran desimal (Decimal Shift Typo x100) pada parsing string telemetry CAN-Bus atau float multiplier buffer sensor FMS (nilai asli 42.00 L/jam disimpan sebagai 4200).",
    aiSuggestedFix: {
      recommendedValue: "42.00 Liter/Jam",
      confidenceScore: 99.4,
      actionType: "APPLY_DECIMAL_SHIFT",
      actionLabel: "Koreksi Desimal Otomatis (42.00 L/h)",
      explanation: "Terapkan normalisasi desimal /100 berdasarkan data korelasi RPM engine (1,450 RPM) dan historical burn rate 3 shift terakhir.",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "5 menit yang lalu",
        user: "AI Data Quality Engine (v3.4)",
        action: "OUTLIER_DETECTED",
        note: "Z-Score = +18.42 (Batas Sigma > 3.0). Severity diangkat ke CRITICAL.",
      },
    ],
  },

  // 2. DATA TIDAK WAJAR (UNREASONABLE / PHYSICAL IMPOSSIBILITY)
  {
    id: "DQI-2026-UNR-002",
    dimension: "UNREASONABLE_DATA",
    severity: "CRITICAL",
    domain: "PRODUCTION_HAULING",
    entityId: "HD-105",
    entityType: "HAULER",
    fieldAffected: "instantaneous_speed_kmh",
    currentValue: "185.4 km/jam",
    expectedBaseline: "15.0 - 45.0 km/jam (Speed Limit Pit Ramp: Max 40 km/jam)",
    varianceRatio: "+363.5% di atas mechanical speed governor",
    detectedTimestamp: "18 menit yang lalu",
    sourceSystem: "GPS Dispatch Transponder Pit Ramp 01",
    title: "⚡ Kecepatan Hauler HD-105 Melampaui Batas Fisik Mekanikal",
    description: "Transponder GPS mencatat kecepatan sesaat HD-105 sebesar 185.4 km/jam saat menaiki tanjakan ramp Pit 01. Kecepatan maksimal mekanis unit adalah 65 km/jam.",
    aiRootCauseHypothesis: "GPS Doppler multipath error atau koordinat melompat (coordinate jump / satellite clock drift) sejauh 320 meter dalam rentang 1 detik.",
    aiSuggestedFix: {
      recommendedValue: "28.2 km/jam",
      confidenceScore: 97.8,
      actionType: "CLAMP_TO_PHYSICAL_BOUNDS",
      actionLabel: "Clamp Kecepatan ke Interpolasi GPS Wheel-Speed",
      explanation: "Gunakan data roda transmisi (wheel-speed encoder) yang mencatat 28.2 km/jam pada timestamp yang sama.",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "18 menit yang lalu",
        user: "AI Telemetry Quality Validator",
        action: "PHYSICAL_BOUND_VIOLATION",
        note: "Nilai 185.4 km/h melanggar aturan Max Physical Limit (65.0 km/h).",
      },
    ],
  },

  // 3. DATA SALAH INPUT (TYPO / HUMAN ENTRY DECIMAL ERROR)
  {
    id: "DQI-2026-TYP-003",
    dimension: "TYPO_INPUT_DATA",
    severity: "HIGH",
    domain: "LABORATORY_ASSAY",
    entityId: "LAB-SMP-9921",
    entityType: "LAB_ASSAY",
    fieldAffected: "total_moisture_pct",
    currentValue: "280.0%",
    expectedBaseline: "18.0% - 34.0% Total Moisture (Seam B Pit 02)",
    varianceRatio: "+723% melampaui total fraksi fisik (Max 100%)",
    detectedTimestamp: "32 menit yang lalu",
    sourceSystem: "Manual Lab Entry Portal (Shift 1)",
    title: "✍️ Salah Input Persentase Total Moisture Batubara (280%)",
    description: "Analis lab memasukkan nilai Total Moisture sampel LAB-SMP-9921 sebesar 280.0%. Persentase kelembaban secara matematis tidak dapat melampaui 100%.",
    aiRootCauseHypothesis: "Human error salah ketik tombol nol ekstra (mengetik 280 alih-alih 28.0) pada form input laboratorium.",
    aiSuggestedFix: {
      recommendedValue: "28.0%",
      confidenceScore: 99.8,
      actionType: "APPLY_DECIMAL_SHIFT",
      actionLabel: "Koreksi Format Desimal ke 28.0%",
      explanation: "Koreksi nilai ke 28.0% sesuai rekapitulasi timbangan cawan oven thermo-gravimetri asli (Bobot basah 100g -> Bobot kering 72g = 28g TM).",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "32 menit yang lalu",
        user: "AI Lab Quality Checker",
        action: "FORMAT_TYPO_FLAGGED",
        note: "Nilai persentase > 100% dideteksi sebagai human input typo.",
      },
    ],
  },

  // 4. DATA KOSONG (MISSING / NULL CRITICAL FIELDS)
  {
    id: "DQI-2026-MIS-004",
    dimension: "MISSING_DATA",
    severity: "HIGH",
    domain: "WEIGHBRIDGE",
    entityId: "WB-TICKET-8891",
    entityType: "WEIGHBRIDGE_TICKET",
    fieldAffected: "tare_weight_mt & driver_nik",
    currentValue: "NULL / KOSONG",
    expectedBaseline: "Wajib Terisi: Tare Weight (18.0 - 22.0 MT) & Valid Operator NIK",
    varianceRatio: "Missing Critical Primary Key Attributes",
    detectedTimestamp: "45 menit yang lalu",
    sourceSystem: "Weighbridge Outbound Jembatan Timbang 02",
    title: "🔍 Data Kosong pada Tiket Timbangan Outbound (Tare Weight & NIK)",
    description: "Tiket timbangan batubara WB-8891 tercatat dengan Gross Weight 52.4 MT namun field Tare Weight dan NIK Driver kosong, menyebabkan Netto tidak dapat dihitung secara legal.",
    aiRootCauseHypothesis: "Sensor RFID card reader scanner di pos timbang mengalami timeout saat hauler melintas cepat sebelum kartu di-tap.",
    aiSuggestedFix: {
      recommendedValue: "Tare: 19.8 MT | NIK: 32049182 (Bambang S.)",
      confidenceScore: 96.5,
      actionType: "INTERPOLATE_MISSING",
      actionLabel: "Auto-Fill Tare Terkalibrasi & Driver Match",
      explanation: "Ambil tare weight terakhir unit DT-204 (19.8 MT) dan cocokkan NIK driver dari roster dispatch shift 1.",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "45 menit yang lalu",
        user: "AI Schema Integrity Validator",
        action: "NULL_FIELD_DETECTED",
        note: "Mandatory constraint violation pada tabel weighbridge_transactions.",
      },
    ],
  },

  // 5. DATA DUPLIKAT (DUPLICATE SUBMISSION / COLLISION)
  {
    id: "DQI-2026-DUP-005",
    dimension: "DUPLICATE_DATA",
    severity: "MEDIUM",
    domain: "PRODUCTION_HAULING",
    entityId: "RPT-HAUL-402-A & B",
    entityType: "DISPATCH_CYCLE",
    fieldAffected: "cycle_id / timestamp",
    currentValue: "2 Catatan Identik (Ritase 14:15:22)",
    expectedBaseline: "1 Catatan Unik per Ritase Unit",
    varianceRatio: "Duplikasi Ritase 100% (+32.4 MT Overcounting)",
    detectedTimestamp: "1 jam yang lalu",
    sourceSystem: "FMS Tablet Driver & Dispatch Manual Log",
    title: "👥 Data Duplikat Ritase Batubara Unit DT-402 di Seam B",
    description: "Tercatat 2 ritase dengan muatan 32.4 MT pada jam 14:15:22 untuk unit DT-402 yang sama, berpotensi menggandakan pencatatan produksi harian sebesar 32.4 MT.",
    aiRootCauseHypothesis: "Offline sync re-submission saat tablet driver reconnecting ke WiFi stockpile, sementara operator dispatch telah menginput manual.",
    aiSuggestedFix: {
      recommendedValue: "Merge menjadi 1 Record Terverifikasi (32.4 MT)",
      confidenceScore: 98.9,
      actionType: "MERGE_DUPLICATES",
      actionLabel: "Merge & Deduplikasi Record Otomatis",
      explanation: "Gabungkan metadata FMS GPS dengan ID transaksi manual, hapus duplikat tanpa kehilangan histori waktu muat.",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "1 jam yang lalu",
        user: "AI Deduplication Engine",
        action: "DUPLICATE_KEY_FOUND",
        note: "Ditemukan kesamaan 100% pada hauler_id, source_pit, destination, dan timestamp window +/- 15s.",
      },
    ],
  },

  // 6. DATA CONFLICT (CROSS-SOURCE INCONSISTENCY)
  {
    id: "DQI-2026-CNF-006",
    dimension: "CONFLICT_DATA",
    severity: "HIGH",
    domain: "WEIGHBRIDGE",
    entityId: "DT-308 / SHIFT-1",
    entityType: "HAULER",
    fieldAffected: "net_payload_tonnage",
    currentValue: "Weighbridge: 34.2 MT vs FMS Load Cell: 42.8 MT",
    expectedBaseline: "Delta Toleransi Cross-Source < 3.0% (Maksimal selisih 1.0 MT)",
    varianceRatio: "Discrepancy Delta: +8.6 MT (+25.1% Selisih)",
    detectedTimestamp: "1.5 jam yang lalu",
    sourceSystem: "Weighbridge POS 01 vs On-Board Load Cell VIMS",
    conflictingSource: {
      sourceName: "FMS On-board VIMS Load Cell",
      conflictingValue: "42.8 MT",
      discrepancyDelta: "+8.6 MT (+25.1%)",
    },
    title: "⚔️ Konflik Data Tonase: Jembatan Timbang vs Sensor Onboard FMS",
    description: "Terdapat perbedaan signifikan antara data jembatan timbang (34.2 MT) dan sensor onboard VIMS truk DT-308 (42.8 MT). Selisih 8.6 MT melampaui ambang batas audit ESDM.",
    aiRootCauseHypothesis: "Sensor strut suspension kiri belakang VIMS belum dikalibrasi pasca penggantian komponen peredam, atau ada tumpukan lumpur tebal pada sasis.",
    aiSuggestedFix: {
      recommendedValue: "34.2 MT (Gunakan Data Jembatan Timbang Bersertifikat Metrologi)",
      confidenceScore: 95.0,
      actionType: "RECONCILE_CROSS_SOURCE",
      actionLabel: "Rekonsiliasi Menggunakan Legal Weighbridge",
      explanation: "Gunakan data timbangan bersertifikat Tera Metrologi Legal (34.2 MT) dan buatkan work order kalibrasi sensor suspensi DT-308.",
    },
    status: "OPEN",
    auditTrail: [
      {
        timestamp: "1.5 jam yang lalu",
        user: "AI Cross-Source Reconciler",
        action: "DATA_CONFLICT_IDENTIFIED",
        note: "Discrepancy 25.1% terdeteksi antara 2 sumber data tepercaya.",
      },
    ],
  },
];

const INITIAL_RULES: DataQualityRule[] = [
  {
    id: "RULE-FUEL-OUTLIER",
    name: "Fleet Fuel Consumption Outlier Guard",
    dimension: "OUTLIER_DATA",
    domain: "FLEET_FUEL",
    targetField: "fuel_burn_rate_lph",
    ruleType: "RANGE_BOUNDS",
    minBound: 10.0,
    maxBound: 130.0,
    unit: "L/h",
    toleratedVariancePct: 20.0,
    enabled: true,
    autoFixEnabled: true,
    description: "Memeriksa apakah konsumsi bahan bakar berada di luar batas fisik 10 - 130 L/jam atau melompat >20% dari baseline unit.",
  },
  {
    id: "RULE-SPEED-UNREASONABLE",
    name: "Haul Fleet Physical Speed Limit Barrier",
    dimension: "UNREASONABLE_DATA",
    domain: "PRODUCTION_HAULING",
    targetField: "speed_kmh",
    ruleType: "RANGE_BOUNDS",
    minBound: 0.0,
    maxBound: 65.0,
    unit: "km/h",
    enabled: true,
    autoFixEnabled: true,
    description: "Mencegah data kecepatan melampaui batas fisik mekanik kendaraan tambang (Max 65 km/h).",
  },
  {
    id: "RULE-MOISTURE-TYPO",
    name: "Laboratory Moisture Percentage Range (0 - 100%)",
    dimension: "TYPO_INPUT_DATA",
    domain: "LABORATORY_ASSAY",
    targetField: "moisture_pct",
    ruleType: "RANGE_BOUNDS",
    minBound: 0.1,
    maxBound: 60.0,
    unit: "%",
    enabled: true,
    autoFixEnabled: true,
    description: "Memastikan nilai analisa lab Total Moisture & Inherent Moisture tidak melebihi 60% dan mencegah typo kelipatan puluhan.",
  },
  {
    id: "RULE-WB-MANDATORY",
    name: "Weighbridge Mandatory Primary Keys & Non-Null",
    dimension: "MISSING_DATA",
    domain: "WEIGHBRIDGE",
    targetField: "tare_weight, driver_nik, ticket_no",
    ruleType: "NOT_NULL",
    enabled: true,
    autoFixEnabled: true,
    description: "Mencegah penyimpanan data transaksi timbangan dengan bobot kosong atau ID pengemudi hilang.",
  },
  {
    id: "RULE-HAUL-DEDUP",
    name: "Hauling Cycle Exact Match Deduplication",
    dimension: "DUPLICATE_DATA",
    domain: "PRODUCTION_HAULING",
    targetField: "hauler_id + timestamp (+/- 30s)",
    ruleType: "DUPLICATE_KEY",
    enabled: true,
    autoFixEnabled: true,
    description: "Mendeteksi entri ritase ganda dari sinkronisasi offline perangkat tablet driver dan log manual.",
  },
  {
    id: "RULE-TONNAGE-CROSS-CHECK",
    name: "Weighbridge vs On-Board FMS Payload Cross Check",
    dimension: "CONFLICT_DATA",
    domain: "WEIGHBRIDGE",
    targetField: "payload_tonnage",
    ruleType: "CROSS_SOURCE_CONSISTENCY",
    toleratedVariancePct: 5.0,
    enabled: true,
    autoFixEnabled: true,
    description: "Mendeteksi selisih data muatan antara sensor suspensi truk dan jembatan timbang statis >5%.",
  },
];

const INITIAL_CROSS_SOURCE: CrossSourceComparison[] = [
  {
    id: "XSRC-001",
    recordIdentifier: "Ritase DT-308 (Pit 02 -> ROM 3)",
    field: "Tonnage (MT)",
    sourceA: { name: "Weighbridge Legal Scale", value: "34.2 MT", timestamp: "14:10:05", reliabilityScore: 99 },
    sourceB: { name: "VIMS Sensor Strut", value: "42.8 MT", timestamp: "14:10:02", reliabilityScore: 82 },
    deltaPercentage: 25.1,
    aiVerdict: "Sensor suspensi VIMS mengalami drift kalibrasi +8.6 MT.",
    recommendedValue: "34.2 MT",
  },
  {
    id: "XSRC-002",
    recordIdentifier: "Fuel Refueling Tanker FT-02 to HD-05",
    field: "Fuel Volume (Liter)",
    sourceA: { name: "Fuel Flowmeter Dispenser", value: "410.0 L", timestamp: "11:20:10", reliabilityScore: 98 },
    sourceB: { name: "Fuel Sensor Float HD-05", value: "392.5 L", timestamp: "11:20:15", reliabilityScore: 91 },
    deltaPercentage: 4.2,
    aiVerdict: "Toleransi wajar (suhu solar ekspansi termal + float sensor angle di tanjakan 3°).",
    recommendedValue: "410.0 L",
  },
  {
    id: "XSRC-003",
    recordIdentifier: "EX-03 Operating Engine Hours",
    field: "Total Service Meter Units (Hour)",
    sourceA: { name: "SCADA Telematics CAN", value: "14,892.4 hrs", timestamp: "16:00:00", reliabilityScore: 99 },
    sourceB: { name: "Manual Operator Daily Sheet", value: "14,820.0 hrs", timestamp: "16:00:00", reliabilityScore: 78 },
    deltaPercentage: 0.48,
    aiVerdict: "Operator membulatkan jam SMU ke bawah (72.4 jam hilang di catatan manual).",
    recommendedValue: "14,892.4 hrs",
  },
];

const LOCAL_STORAGE_ISSUES_KEY = "minesmart_data_quality_issues_v2";
const LOCAL_STORAGE_RULES_KEY = "minesmart_data_quality_rules_v2";

export class DataQualityService {
  public static getIssues(): DataQualityIssue[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ISSUES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load data quality issues from storage:", e);
    }
    return INITIAL_ISSUES;
  }

  public static saveIssues(issues: DataQualityIssue[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_ISSUES_KEY, JSON.stringify(issues));
    } catch (e) {
      console.warn("Failed to save data quality issues:", e);
    }
  }

  public static getRules(): DataQualityRule[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load rules:", e);
    }
    return INITIAL_RULES;
  }

  public static saveRules(rules: DataQualityRule[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn("Failed to save rules:", e);
    }
  }

  public static getCrossSourceComparisons(): CrossSourceComparison[] {
    return INITIAL_CROSS_SOURCE;
  }

  public static getSummary(issues: DataQualityIssue[]): DataQualitySummary {
    const active = issues.filter((i) => i.status === "OPEN" || i.status === "IN_REVIEW");
    const resolvedToday = issues.filter((i) => i.status === "RESOLVED" || i.status === "AUTO_FIXED");

    const dimensionCounts: Record<DataQualityDimension, number> = {
      MISSING_DATA: 0,
      DUPLICATE_DATA: 0,
      UNREASONABLE_DATA: 0,
      TYPO_INPUT_DATA: 0,
      OUTLIER_DATA: 0,
      CONFLICT_DATA: 0,
    };

    const severityCounts: Record<DataQualitySeverity, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    active.forEach((issue) => {
      if (dimensionCounts[issue.dimension] !== undefined) {
        dimensionCounts[issue.dimension]++;
      }
      if (severityCounts[issue.severity] !== undefined) {
        severityCounts[issue.severity]++;
      }
    });

    const domainScores: DomainHealthScore[] = [
      {
        domain: "FLEET_FUEL",
        domainLabel: "Fleet & Fuel Telematics",
        score: 94.2,
        recordsScannedToday: 142800,
        totalAnomalies: 1,
        criticalIssues: 1,
        status: "WARNING",
      },
      {
        domain: "PRODUCTION_HAULING",
        domainLabel: "Production & Hauling Cycles",
        score: 96.8,
        recordsScannedToday: 384500,
        totalAnomalies: 2,
        criticalIssues: 1,
        status: "GOOD",
      },
      {
        domain: "WEIGHBRIDGE",
        domainLabel: "Weighbridge Transactions",
        score: 93.5,
        recordsScannedToday: 19840,
        totalAnomalies: 2,
        criticalIssues: 0,
        status: "WARNING",
      },
      {
        domain: "LABORATORY_ASSAY",
        domainLabel: "Coal Quality & Lab Assays",
        score: 97.4,
        recordsScannedToday: 2450,
        totalAnomalies: 1,
        criticalIssues: 0,
        status: "GOOD",
      },
      {
        domain: "IOT_TELEMETRY",
        domainLabel: "IoT & Sensor Gateways",
        score: 99.1,
        recordsScannedToday: 1850000,
        totalAnomalies: 0,
        criticalIssues: 0,
        status: "EXCELLENT",
      },
      {
        domain: "SURVEY_GEOLOGY",
        domainLabel: "Survey & Seam Volume Models",
        score: 99.6,
        recordsScannedToday: 8400,
        totalAnomalies: 0,
        criticalIssues: 0,
        status: "EXCELLENT",
      },
    ];

    // Compute overall score
    const avgScore = Number(
      (domainScores.reduce((acc, curr) => acc + curr.score, 0) / domainScores.length).toFixed(1)
    );

    return {
      overallHealthScore: avgScore,
      totalRecordsScanned: 2407990,
      activeIssuesCount: active.length,
      resolvedTodayCount: resolvedToday.length,
      autoFixAccuracyRate: 98.6,
      dimensionCounts,
      severityCounts,
      domainScores,
    };
  }

  // 1-Click AI Auto-Fix Execution
  public static applyAiFix(issueId: string, userName: string = "AI Quality Officer"): {
    success: boolean;
    issue?: DataQualityIssue;
    message: string;
  } {
    const issues = this.getIssues();
    const target = issues.find((i) => i.id === issueId);
    if (!target) {
      return { success: false, message: "Issue tidak ditemukan." };
    }

    const updated = issues.map((item) => {
      if (item.id === issueId) {
        const auditEntry = {
          timestamp: "Baru saja",
          user: `${userName} (AI 1-Click Fix)`,
          action: "AUTO_FIX_APPLIED",
          note: `Nilai dikoreksi dari '${item.currentValue}' menjadi '${item.aiSuggestedFix.recommendedValue}'. ${item.aiSuggestedFix.explanation}`,
        };
        return {
          ...item,
          status: "AUTO_FIXED" as const,
          resolvedBy: userName,
          resolvedAt: "Baru saja",
          currentValue: item.aiSuggestedFix.recommendedValue,
          auditTrail: [auditEntry, ...item.auditTrail],
        };
      }
      return item;
    });

    this.saveIssues(updated);
    const fixedIssue = updated.find((i) => i.id === issueId);
    return {
      success: true,
      issue: fixedIssue,
      message: `✅ Berhasil memperbaiki data ${target.entityId} [${target.fieldAffected}] menjadi ${target.aiSuggestedFix.recommendedValue}`,
    };
  }

  // Manual Custom Resolution
  public static resolveIssueManual(
    issueId: string,
    resolvedValue: any,
    notes: string,
    userName: string = "Data Steward"
  ): DataQualityIssue[] {
    const issues = this.getIssues();
    const updated = issues.map((item) => {
      if (item.id === issueId) {
        const auditEntry = {
          timestamp: "Baru saja",
          user: userName,
          action: "MANUAL_RESOLVED",
          note: `Diperbaiki manual menjadi '${resolvedValue}'. Catatan: ${notes}`,
        };
        return {
          ...item,
          status: "RESOLVED" as const,
          resolvedBy: userName,
          resolvedAt: "Baru saja",
          currentValue: resolvedValue,
          auditTrail: [auditEntry, ...item.auditTrail],
        };
      }
      return item;
    });
    this.saveIssues(updated);
    return updated;
  }

  // Mark as Ignored (False positive)
  public static ignoreIssue(
    issueId: string,
    reason: string,
    userName: string = "Data Steward"
  ): DataQualityIssue[] {
    const issues = this.getIssues();
    const updated = issues.map((item) => {
      if (item.id === issueId) {
        const auditEntry = {
          timestamp: "Baru saja",
          user: userName,
          action: "IGNORED_FALSE_POSITIVE",
          note: `Diabaikan sebagai False Positive. Alasan: ${reason}`,
        };
        return {
          ...item,
          status: "IGNORED" as const,
          resolvedBy: userName,
          resolvedAt: "Baru saja",
          auditTrail: [auditEntry, ...item.auditTrail],
        };
      }
      return item;
    });
    this.saveIssues(updated);
    return updated;
  }

  // Reset / Trigger Deep Scan Simulation
  public static triggerDeepScan(): {
    scannedCount: number;
    anomaliesFound: number;
    timestamp: string;
  } {
    return {
      scannedCount: 2407990,
      anomaliesFound: 6,
      timestamp: new Date().toLocaleTimeString("id-ID"),
    };
  }

  // Helper to get the specific featured HD-08 Outlier
  public static getHD08FeaturedAnomaly(): DataQualityIssue {
    const issues = this.getIssues();
    const found = issues.find((i) => i.entityId === "HD-08");
    return found || INITIAL_ISSUES[0];
  }
}
