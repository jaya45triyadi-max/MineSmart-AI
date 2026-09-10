// MINE SMART AI - Offline Sync Engine (PROMPT 35)

import { SyncQueueItem, OfflineSyncStatus } from "../../types/commercialOfflineTypes";

export class OfflineSyncEngine {
  private static STORAGE_KEY = "minesmart_offline_sync_queue";

  private static syncQueue: SyncQueueItem[] = [
    {
      syncId: "sync-001",
      idempotencyKey: "idem_prod_20260814_001",
      recordType: "PRODUCTION_INPUT",
      recordId: "prod-off-101",
      data: {
        pit: "Pit 2 North (Front B)",
        coalMT: 450,
        obBCM: 1200,
        shift: "SHIFT_B",
        operator: "Joko (HT-112)",
        notes: "Input saat sinyal seluler terputus di tambang bawah",
      },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      retryCount: 0,
      status: "PENDING",
    },
    {
      syncId: "sync-002",
      idempotencyKey: "idem_hse_20260814_002",
      recordType: "HSE_INSPECTION font",
      recordId: "hse-off-202",
      data: {
        location: "Stockpile A Haul Road",
        hazardType: "Debu Tinggi & Jarak Pandang Terbatas",
        severity: "HIGH",
        actionTaken: "Penyiraman Water Truck WT-05 Diperintahkan",
        inspector: "Bambang K3",
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      retryCount: 1,
      status: "PENDING",
      photoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23059669'/><text x='10' y='50' fill='white' font-size='12'>Photo Field</text></svg>",
    },
  ];

  /**
   * Returns current sync queue items.
   */
  public static getSyncQueue(): SyncQueueItem[] {
    return this.syncQueue;
  }

  /**
   * Enqueues an offline record with an idempotency key to prevent duplicates.
   */
  public static enqueueOfflineRecord(
    recordType: SyncQueueItem["recordType"],
    data: Record<string, any>,
    photoUrl?: string
  ): SyncQueueItem {
    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newItem: SyncQueueItem = {
      syncId: `sync-${Date.now()}`,
      idempotencyKey,
      recordType,
      recordId: `off-${Date.now()}`,
      data,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: "PENDING",
      photoUrl,
    };

    this.syncQueue.unshift(newItem);
    this.persistToLocalStorage();
    return newItem;
  }

  /**
   * Triggers automatic or manual synchronization of pending items.
   */
  public static async processSyncQueue(): Promise<{
    syncedCount: number;
    failedCount: number;
    conflictCount: number;
  }> {
    let syncedCount = 0;
    let failedCount = 0;
    let conflictCount = 0;

    for (const item of this.syncQueue) {
      if (item.status === "PENDING" || item.status === "FAILED") {
        item.status = "SYNCING";

        // Simulate network API request
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Simulate successful idempotency check and server commit
        if (Math.random() > 0.05) {
          item.status = "SUCCESS";
          syncedCount++;
        } else {
          item.retryCount += 1;
          if (item.retryCount >= 3) {
            item.status = "FAILED";
            item.errorMessage = "Koneksi server timeout (Exponential Backoff Limit Reached)";
            failedCount++;
          } else {
            item.status = "CONFLICT";
            item.errorMessage = "Server conflict: Data telah diperbarui oleh pengguna lain";
            conflictCount++;
          }
        }
      }
    }

    this.persistToLocalStorage();
    return { syncedCount, failedCount, conflictCount };
  }

  /**
   * Resolves a data conflict manually ("KEEP_LOCAL" or "USE_SERVER").
   */
  public static resolveConflict(syncId: string, resolution: "KEEP_LOCAL" | "USE_SERVER"): void {
    const target = this.syncQueue.find((s) => s.syncId === syncId);
    if (target) {
      if (resolution === "KEEP_LOCAL") {
        target.status = "SUCCESS";
        target.errorMessage = undefined;
      } else {
        // Discard local version
        this.syncQueue = this.syncQueue.filter((s) => s.syncId !== syncId);
      }
      this.persistToLocalStorage();
    }
  }

  /**
   * Clears synced items from the local queue.
   */
  public static clearCompleted(): void {
    this.syncQueue = this.syncQueue.filter((s) => s.status !== "SUCCESS");
    this.persistToLocalStorage();
  }

  private static persistToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.syncQueue));
    } catch (e) {
      console.warn("Could not persist offline queue to localStorage:", e);
    }
  }
}
