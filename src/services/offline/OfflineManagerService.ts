// MINE SMART AI - Enterprise Offline Mode & Conflict Resolution Engine
// Features: Local Storage Queue, Auto-Sync on Reconnect, Local vs Server Diff Resolver, AI Smart Merge

import {
  NetworkConnectivityStatus,
  OfflineRecordType,
  OfflineItemSyncStatus,
  OfflineQueueItem,
  OfflineConflictRecord,
  SyncEngineStats,
  OfflineEngineSettings,
  SyncAuditLogItem,
  FieldDiff,
} from "../../types/offlineSyncTypes";

const LOCAL_STORAGE_QUEUE_KEY = "minesmart_offline_queue_v2";
const LOCAL_STORAGE_CONFLICTS_KEY = "minesmart_offline_conflicts_v2";
const LOCAL_STORAGE_AUDIT_KEY = "minesmart_offline_audit_v2";
const LOCAL_STORAGE_SETTINGS_KEY = "minesmart_offline_settings_v2";

export const DEFAULT_OFFLINE_SETTINGS: OfflineEngineSettings = {
  autoSyncOnOnline: true,
  backgroundSyncIntervalSec: 15,
  defaultConflictPolicy: "MANUAL_PROMPT",
  enableAISmartMerge: true,
  compressOfflineMedia: true,
  notifyOnConflict: true,
  soundOnSyncComplete: true,
};

// Initial simulated initial queue with realistic mine field data
const INITIAL_QUEUE_DATA: OfflineQueueItem[] = [
  {
    id: "off-q-101",
    idempotencyKey: "idem_rit_20260816_101",
    recordType: "PRODUCTION_RITASE",
    recordId: "RIT-8841",
    entityTitle: "Haul DT-102 (HD785) &bull; Seam 11 Coal",
    pitLocation: "Pit North Alpha Bench 3",
    data: {
      pit: "Pit North Alpha",
      bench: "Bench 3",
      loader: "EX-01 (PC2000)",
      hauler: "DT-102 (HD785)",
      material: "COAL",
      grossTonnage: 98.4,
      destination: "ROM_STOCKPILE_A",
      operator: "Agus Supardi",
      cycleTimeMin: 21.5,
      shift: "Shift 1 (Day)",
      gps: { lat: -0.8421, lng: 117.1523 },
    },
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    clientDeviceId: "DEV-TAB-SAM-049",
    clientOperator: "Agus Supardi (Foreman Pit)",
    status: "CONFLICT",
    retryCount: 1,
    maxRetries: 5,
    conflictId: "cnf-001",
    payloadSizeBytes: 1420,
  },
  {
    id: "off-q-102",
    idempotencyKey: "idem_p2h_20260816_102",
    recordType: "P2H_INSPECTION",
    recordId: "P2H-7704",
    entityTitle: "P2H Pre-Start Check Excavator EX-03",
    pitLocation: "Pit South Sump",
    data: {
      unitCode: "EX-03 (Hitachi EX1200)",
      hourMeter: 8412.5,
      hydraulicPressureBar: 0,
      engineOilStatus: "PASS",
      brakeStatus: "PASS",
      overallFitness: "DO_NOT_OPERATE",
      defectNotes: "Selang hidrolik utama bocor, tekanan nol bar. Butuh mekanik urgent.",
      inspector: "Bambang Wijaya",
    },
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    clientDeviceId: "DEV-MOB-AND-112",
    clientOperator: "Bambang Wijaya (Operator)",
    status: "QUEUED_LOCAL",
    retryCount: 0,
    maxRetries: 5,
    payloadSizeBytes: 2150,
  },
  {
    id: "off-q-103",
    idempotencyKey: "idem_hzd_20260816_103",
    recordType: "HSE_HAZARD",
    recordId: "HZD-9932",
    entityTitle: "Retakan Lereng Highwall (Tension Crack)",
    pitLocation: "Pit North Ramp KM 2.4",
    data: {
      title: "Retakan lereng selebar 15 cm terdeteksi di crest bench 4",
      category: "UNSAFE_CONDITION",
      severity: "CRITICAL",
      actionTaken: "Barricade dipasang, armada DT dialihkan lewat jalan pintas barat",
      reporter: "Rudi Hartono (HSE)",
    },
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    clientDeviceId: "DEV-MOB-IOS-008",
    clientOperator: "Rudi Hartono (HSE Officer)",
    status: "QUEUED_LOCAL",
    retryCount: 0,
    maxRetries: 5,
    payloadSizeBytes: 3400,
  },
  {
    id: "off-q-104",
    idempotencyKey: "idem_fuel_20260816_104",
    recordType: "FUEL_DISPENSE",
    recordId: "FUEL-6621",
    entityTitle: "Refueling Fuel Truck FT-02 &bull; 4,200 L",
    pitLocation: "Pit South Fuel Bay",
    data: {
      dispenserUnit: "FT-02 (Hino 500)",
      targetEquipment: "EX-02 (CAT 6020B)",
      litersDispensed: 4200,
      flowMeterStart: 184500,
      flowMeterEnd: 188700,
      operator: "Dedi Supriyadi",
    },
    createdAt: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    clientDeviceId: "DEV-TAB-SAM-049",
    clientOperator: "Dedi Supriyadi (Fuel Man)",
    status: "SYNCED",
    retryCount: 0,
    maxRetries: 5,
    payloadSizeBytes: 1100,
  },
];

// Initial realistic conflict records
const INITIAL_CONFLICT_DATA: OfflineConflictRecord[] = [
  {
    conflictId: "cnf-001",
    syncQueueId: "off-q-101",
    recordId: "RIT-8841",
    recordType: "PRODUCTION_RITASE",
    title: "Konflik Tonase Ritase DT-102 (Seam 11 Coal)",
    entityName: "DT-102 (HD785) / EX-01",
    pitOrLocation: "Pit North Alpha Bench 3",
    detectedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    localVersion: {
      data: {
        pit: "Pit North Alpha",
        bench: "Bench 3",
        loader: "EX-01 (PC2000)",
        hauler: "DT-102 (HD785)",
        material: "COAL",
        grossTonnage: 98.4,
        destination: "ROM_STOCKPILE_A",
        operator: "Agus Supardi (Pit Foreman Input Manual)",
        cycleTimeMin: 21.5,
        shift: "Shift 1 (Day)",
        notes: "Ritase ke-4, muatan padat batubara seam 11 bersih dari kontaminan.",
      },
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedBy: "Agus Supardi (Offline Tablet)",
      clientDeviceId: "DEV-TAB-SAM-049",
    },
    serverVersion: {
      data: {
        pit: "Pit North Alpha",
        bench: "Bench 3",
        loader: "EX-01 (PC2000)",
        hauler: "DT-102 (HD785)",
        material: "COAL",
        grossTonnage: 92.1,
        destination: "ROM_STOCKPILE_B (Diverted)",
        operator: "Surya Hendra (Weighbridge Dispatcher)",
        cycleTimeMin: 24.0,
        shift: "Shift 1 (Day)",
        notes: "Timbangan jembatan menimbang 92.1 Ton. Stockpile A penuh, dialihkan ke ROM B.",
      },
      updatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      updatedBy: "Surya Hendra (Weighbridge System)",
      serverRevision: 4,
    },
    fieldDiffs: [
      {
        fieldName: "grossTonnage",
        fieldLabel: "Gross Tonnage (Ton)",
        localValue: 98.4,
        serverValue: 92.1,
        hasDifference: true,
      },
      {
        fieldName: "destination",
        fieldLabel: "Stockpile Tujuan",
        localValue: "ROM_STOCKPILE_A",
        serverValue: "ROM_STOCKPILE_B (Diverted)",
        hasDifference: true,
      },
      {
        fieldName: "cycleTimeMin",
        fieldLabel: "Cycle Time (Menit)",
        localValue: 21.5,
        serverValue: 24.0,
        hasDifference: true,
      },
      {
        fieldName: "notes",
        fieldLabel: "Catatan Tambahan",
        localValue: "Ritase ke-4, muatan padat batubara seam 11 bersih dari kontaminan.",
        serverValue: "Timbangan jembatan menimbang 92.1 Ton. Stockpile A penuh, dialihkan ke ROM B.",
        hasDifference: true,
      },
    ],
    aiMergeSuggestion: {
      confidence: 96,
      recommendedResolution: "MERGE",
      mergedData: {
        pit: "Pit North Alpha",
        bench: "Bench 3",
        loader: "EX-01 (PC2000)",
        hauler: "DT-102 (HD785)",
        material: "COAL",
        grossTonnage: 92.1, // Jembatan timbang lebih akurat secara legal
        destination: "ROM_STOCKPILE_B (Diverted)",
        operator: "Agus Supardi / Surya Hendra (Merged)",
        cycleTimeMin: 24.0,
        shift: "Shift 1 (Day)",
        notes: "Lokal: Seam 11 bersih tanpa kontaminan. | Server (Weighbridge): 92.1 Ton dialihkan ke ROM B karena ROM A penuh.",
      },
      rationale:
        "AI Merekomendasikan: Ambil nilai Gross Tonnage dari sensor jembatan timbang (92.1 MT) dan tujuan aktual (ROM B), sembari menggabungkan catatan kualitas batubara Seam 11 dari Foreman lapangan.",
    },
    status: "UNRESOLVED",
  },
];

export class OfflineManagerService {
  private static queue: OfflineQueueItem[] = [];
  private static conflicts: OfflineConflictRecord[] = [];
  private static auditLogs: SyncAuditLogItem[] = [];
  private static settings: OfflineEngineSettings = DEFAULT_OFFLINE_SETTINGS;
  private static simulatedNetwork: NetworkConnectivityStatus = "ONLINE";
  private static initialized: boolean = false;
  private static listeners: Array<(status: NetworkConnectivityStatus) => void> = [];

  public static initialize(): void {
    if (this.initialized) return;

    // Load persisted data from localStorage
    try {
      const q = localStorage.getItem(LOCAL_STORAGE_QUEUE_KEY);
      this.queue = q ? JSON.parse(q) : INITIAL_QUEUE_DATA;

      const c = localStorage.getItem(LOCAL_STORAGE_CONFLICTS_KEY);
      this.conflicts = c ? JSON.parse(c) : INITIAL_CONFLICT_DATA;

      const a = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
      this.auditLogs = a ? JSON.parse(a) : [];

      const s = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      this.settings = s ? JSON.parse(s) : DEFAULT_OFFLINE_SETTINGS;
    } catch (e) {
      console.warn("Failed to load offline storage:", e);
      this.queue = INITIAL_QUEUE_DATA;
      this.conflicts = INITIAL_CONFLICT_DATA;
      this.auditLogs = [];
      this.settings = DEFAULT_OFFLINE_SETTINGS;
    }

    // Set initial network based on browser
    if (typeof window !== "undefined") {
      this.simulatedNetwork = navigator.onLine ? "ONLINE" : "OFFLINE";

      window.addEventListener("online", () => {
        this.setNetworkStatus("ONLINE");
        if (this.settings.autoSyncOnOnline) {
          this.triggerAutoSync();
        }
      });

      window.addEventListener("offline", () => {
        this.setNetworkStatus("OFFLINE");
      });
    }

    this.initialized = true;
  }

  // --- Network State & Simulation ---
  public static getNetworkStatus(): NetworkConnectivityStatus {
    return this.simulatedNetwork;
  }

  public static setNetworkStatus(status: NetworkConnectivityStatus): void {
    this.simulatedNetwork = status;
    this.listeners.forEach((l) => l(status));

    this.addAuditLog({
      action: status === "ONLINE" ? "SYNC_ATTEMPT" : "ENQUEUED",
      recordType: "PRODUCTION_RITASE",
      recordId: "NETWORK",
      details: `Status jaringan berubah menjadi: ${status}`,
      networkMode: status,
      operator: "System Monitor",
    });
  }

  public static onNetworkChange(callback: (status: NetworkConnectivityStatus) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // --- Queue Operations ---
  public static getQueue(): OfflineQueueItem[] {
    this.initialize();
    return [...this.queue];
  }

  public static enqueue(
    recordType: OfflineRecordType,
    recordId: string,
    entityTitle: string,
    pitLocation: string,
    data: Record<string, any>,
    operatorName: string,
    photoBase64?: string
  ): OfflineQueueItem {
    this.initialize();

    const idempotencyKey = `idem_${recordType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newItem: OfflineQueueItem = {
      id: `off-q-${Date.now().toString().slice(-6)}`,
      idempotencyKey,
      recordType,
      recordId,
      entityTitle,
      pitLocation,
      data,
      createdAt: new Date().toISOString(),
      clientDeviceId: "DEV-LAP-MOBILE-MINE",
      clientOperator: operatorName || "Operator Lapangan",
      status: "QUEUED_LOCAL",
      retryCount: 0,
      maxRetries: 5,
      photoBase64,
      payloadSizeBytes: Math.round(JSON.stringify(data).length * 1.5),
    };

    this.queue.unshift(newItem);
    this.persistQueue();

    this.addAuditLog({
      action: "ENQUEUED",
      recordType,
      recordId,
      details: `Data '${entityTitle}' disimpan di storage lokal perangkat (Offline Mode)`,
      networkMode: this.simulatedNetwork,
      operator: operatorName || "Operator Lapangan",
    });

    // If currently online and autoSync enabled, trigger background sync
    if (this.simulatedNetwork === "ONLINE" && this.settings.autoSyncOnOnline) {
      setTimeout(() => this.triggerAutoSync(), 400);
    }

    return newItem;
  }

  public static deleteQueueItem(id: string): void {
    this.initialize();
    this.queue = this.queue.filter((item) => item.id !== id);
    this.persistQueue();
  }

  // --- Auto-Sync Engine ---
  public static async triggerAutoSync(): Promise<{
    syncedCount: number;
    conflictCount: number;
    failedCount: number;
  }> {
    this.initialize();

    if (this.simulatedNetwork === "OFFLINE") {
      return { syncedCount: 0, conflictCount: 0, failedCount: 0 };
    }

    let syncedCount = 0;
    let conflictCount = 0;
    let failedCount = 0;

    const pendingItems = this.queue.filter(
      (q) => q.status === "QUEUED_LOCAL" || q.status === "FAILED"
    );

    for (const item of pendingItems) {
      item.status = "SYNCING";
      this.persistQueue();

      // Simulate network latency (250ms - 500ms)
      await new Promise((r) => setTimeout(r, 350));

      // Check simulated conflict or failure logic
      // In satellite mode or poor signal, simulate 10% conflict / retry
      const isSlow = this.simulatedNetwork === "SATELLITE_SLOW";
      const randomSeed = Math.random();

      if (randomSeed < 0.15) {
        // Generate a Conflict!
        const conflict = this.generateConflictFromItem(item);
        item.status = "CONFLICT";
        item.conflictId = conflict.conflictId;
        conflictCount++;

        this.addAuditLog({
          action: "CONFLICT_DETECTED",
          recordType: item.recordType,
          recordId: item.recordId,
          details: `Konflik terdeteksi antara data lokal vs server untuk '${item.entityTitle}'`,
          networkMode: this.simulatedNetwork,
          operator: item.clientOperator,
        });
      } else if (isSlow && randomSeed < 0.3) {
        // Failed with retry
        item.retryCount += 1;
        if (item.retryCount >= item.maxRetries) {
          item.status = "FAILED";
          item.errorMessage = "Timeout jaringan satelit (Batas maksimum retry tercapai)";
          failedCount++;
        } else {
          item.status = "QUEUED_LOCAL";
          item.errorMessage = `Percobaan gagal ${item.retryCount}/${item.maxRetries} (Exponential backoff)`;
        }
      } else {
        // Success!
        item.status = "SYNCED";
        item.errorMessage = undefined;
        syncedCount++;

        this.addAuditLog({
          action: "SYNC_SUCCESS",
          recordType: item.recordType,
          recordId: item.recordId,
          details: `Sinkronisasi berhasil ke server master (Idempotent: ${item.idempotencyKey})`,
          networkMode: this.simulatedNetwork,
          operator: item.clientOperator,
        });
      }

      this.persistQueue();
    }

    return { syncedCount, conflictCount, failedCount };
  }

  // --- Conflict Detection & AI Smart Merge ---
  private static generateConflictFromItem(item: OfflineQueueItem): OfflineConflictRecord {
    const conflictId = `cnf-${Date.now().toString().slice(-4)}`;

    // Create realistic server variations based on record type
    let serverData: Record<string, any> = { ...item.data };
    const diffs: FieldDiff[] = [];

    if (item.recordType === "PRODUCTION_RITASE") {
      const serverTonnage = Math.round(((item.data.grossTonnage || 90) * 0.94) * 10) / 10;
      serverData = {
        ...item.data,
        grossTonnage: serverTonnage,
        destination: "ROM_STOCKPILE_WEST (Redirected)",
        notes: "Diverted by Central Pit Control due to crusher maintenance",
      };

      diffs.push(
        {
          fieldName: "grossTonnage",
          fieldLabel: "Tonase Muatan (Ton)",
          localValue: item.data.grossTonnage,
          serverValue: serverTonnage,
          hasDifference: true,
        },
        {
          fieldName: "destination",
          fieldLabel: "Tujuan Stockpile",
          localValue: item.data.destination || "ROM_STOCKPILE_A",
          serverValue: "ROM_STOCKPILE_WEST (Redirected)",
          hasDifference: true,
        }
      );
    } else if (item.recordType === "P2H_INSPECTION") {
      serverData = {
        ...item.data,
        hourMeter: (item.data.hourMeter || 8000) + 12.4,
        overallFitness: "FIT_WITH_NOTE",
        defectNotes: "Workshop telah melakukan ganti filter oli kemarin sore.",
      };
      diffs.push(
        {
          fieldName: "hourMeter",
          fieldLabel: "Hour Meter (HM)",
          localValue: item.data.hourMeter,
          serverValue: (item.data.hourMeter || 8000) + 12.4,
          hasDifference: true,
        },
        {
          fieldName: "defectNotes",
          fieldLabel: "Catatan Kerusakan",
          localValue: item.data.defectNotes,
          serverValue: "Workshop telah melakukan ganti filter oli kemarin sore.",
          hasDifference: true,
        }
      );
    } else {
      serverData = {
        ...item.data,
        status: "INVESTIGATING_CENTRAL",
        severity: "HIGH",
        comments: "Server updated by HSE Supervisor at 08:30 WITA",
      };
      diffs.push({
        fieldName: "status",
        fieldLabel: "Status Tiket",
        localValue: item.data.status || "OPEN",
        serverValue: "INVESTIGATING_CENTRAL",
        hasDifference: true,
      });
    }

    const newConflict: OfflineConflictRecord = {
      conflictId,
      syncQueueId: item.id,
      recordId: item.recordId,
      recordType: item.recordType,
      title: `Konflik Versi: ${item.entityTitle}`,
      entityName: item.entityTitle,
      pitOrLocation: item.pitLocation,
      detectedAt: new Date().toISOString(),
      localVersion: {
        data: item.data,
        updatedAt: item.createdAt,
        updatedBy: item.clientOperator,
        clientDeviceId: item.clientDeviceId,
      },
      serverVersion: {
        data: serverData,
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedBy: "Server Central Dispatch / Weighbridge",
        serverRevision: 3,
      },
      fieldDiffs: diffs,
      aiMergeSuggestion: {
        confidence: 94,
        recommendedResolution: "MERGE",
        mergedData: {
          ...serverData,
          ...item.data,
          grossTonnage: serverData.grossTonnage || item.data.grossTonnage,
          notes: `Lokal: ${item.data.notes || ""} | Server: ${serverData.notes || ""}`,
        },
        rationale:
          "AI merekomendasikan penggabungan data: Nilai pengukuran sensor timbangan server dipertahankan, dan catatan observasi lapangan lokal digabungkan.",
      },
      status: "UNRESOLVED",
    };

    this.conflicts.unshift(newConflict);
    this.persistConflicts();
    return newConflict;
  }

  // --- Conflicts Management ---
  public static getConflicts(): OfflineConflictRecord[] {
    this.initialize();
    return [...this.conflicts];
  }

  public static resolveConflict(
    conflictId: string,
    strategy: "KEEP_LOCAL" | "USE_SERVER" | "AI_SMART_MERGE" | "CUSTOM_MERGE",
    resolvedBy: string,
    customMergedData?: Record<string, any>
  ): void {
    this.initialize();
    const conflict = this.conflicts.find((c) => c.conflictId === conflictId);
    if (!conflict) return;

    conflict.status = "RESOLVED";
    conflict.appliedResolution = strategy;
    conflict.resolvedAt = new Date().toISOString();
    conflict.resolvedBy = resolvedBy || "Foreman Pengawas";

    // Update corresponding queue item
    const queueItem = this.queue.find((q) => q.id === conflict.syncQueueId);
    if (queueItem) {
      if (strategy === "KEEP_LOCAL") {
        queueItem.status = "SYNCED";
        queueItem.errorMessage = undefined;
      } else if (strategy === "USE_SERVER") {
        queueItem.data = conflict.serverVersion.data;
        queueItem.status = "SYNCED";
      } else if (strategy === "AI_SMART_MERGE") {
        queueItem.data = conflict.aiMergeSuggestion?.mergedData || conflict.serverVersion.data;
        queueItem.status = "SYNCED";
      } else if (strategy === "CUSTOM_MERGE" && customMergedData) {
        queueItem.data = customMergedData;
        queueItem.status = "SYNCED";
      }
    }

    this.persistConflicts();
    this.persistQueue();

    this.addAuditLog({
      action: "CONFLICT_RESOLVED",
      recordType: conflict.recordType,
      recordId: conflict.recordId,
      details: `Konflik diselesaikan dengan strategi: ${strategy} oleh ${resolvedBy || "Foreman"}`,
      networkMode: this.simulatedNetwork,
      operator: resolvedBy || "Foreman Pengawas",
    });
  }

  // --- Statistics & Storage Quota ---
  public static getStats(): SyncEngineStats {
    this.initialize();
    const totalQueued = this.queue.length;
    const pendingSync = this.queue.filter((q) => q.status === "QUEUED_LOCAL").length;
    const syncingCount = this.queue.filter((q) => q.status === "SYNCING").length;
    const syncedCount = this.queue.filter((q) => q.status === "SYNCED").length;
    const conflictCount = this.conflicts.filter((c) => c.status === "UNRESOLVED").length;
    const failedCount = this.queue.filter((q) => q.status === "FAILED").length;

    const rawString = JSON.stringify(this.queue) + JSON.stringify(this.conflicts);
    const storageUsedKB = Math.round((rawString.length * 2) / 1024);

    return {
      totalQueued,
      pendingSync,
      syncingCount,
      syncedCount,
      conflictCount,
      failedCount,
      lastSyncTimestamp: new Date().toLocaleTimeString("id-ID"),
      storageUsedKB,
      autoSyncActive: this.settings.autoSyncOnOnline,
    };
  }

  // --- Audit Logs ---
  public static getAuditLogs(): SyncAuditLogItem[] {
    this.initialize();
    return [...this.auditLogs];
  }

  private static addAuditLog(log: Omit<SyncAuditLogItem, "id" | "timestamp">): void {
    const item: SyncAuditLogItem = {
      id: `aud-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      ...log,
    };
    this.auditLogs.unshift(item);
    if (this.auditLogs.length > 50) {
      this.auditLogs = this.auditLogs.slice(0, 50);
    }
    this.persistAudit();
  }

  // --- Settings ---
  public static getSettings(): OfflineEngineSettings {
    this.initialize();
    return { ...this.settings };
  }

  public static updateSettings(newSettings: Partial<OfflineEngineSettings>): OfflineEngineSettings {
    this.initialize();
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return this.settings;
  }

  public static clearCompleted(): void {
    this.initialize();
    this.queue = this.queue.filter((q) => q.status !== "SYNCED");
    this.persistQueue();
  }

  public static resetSampleData(): void {
    this.queue = INITIAL_QUEUE_DATA;
    this.conflicts = INITIAL_CONFLICT_DATA;
    this.auditLogs = [];
    this.persistQueue();
    this.persistConflicts();
    this.persistAudit();
  }

  // --- Storage Persisters ---
  private static persistQueue(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn("Failed to persist queue:", e);
    }
  }

  private static persistConflicts(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFLICTS_KEY, JSON.stringify(this.conflicts));
    } catch (e) {
      console.warn("Failed to persist conflicts:", e);
    }
  }

  private static persistAudit(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn("Failed to persist audit:", e);
    }
  }
}
