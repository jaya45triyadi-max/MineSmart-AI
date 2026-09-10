// MINE SMART AI - Comprehensive Offline Mode & Conflict Resolution Types

export type NetworkConnectivityStatus =
  | "ONLINE"
  | "OFFLINE"
  | "INTERMITTENT"
  | "SATELLITE_SLOW";

export type OfflineRecordType =
  | "PRODUCTION_RITASE"
  | "P2H_INSPECTION"
  | "HSE_HAZARD"
  | "FUEL_DISPENSE"
  | "EQUIPMENT_BREAKDOWN"
  | "ATTENDANCE_CLOCK"
  | "APPROVAL_ACTION";

export type OfflineItemSyncStatus =
  | "QUEUED_LOCAL"
  | "SYNCING"
  | "SYNCED"
  | "CONFLICT"
  | "FAILED";

export type ConflictResolutionPolicy =
  | "MANUAL_PROMPT"
  | "LAST_WRITE_WINS"
  | "SERVER_WINS"
  | "CLIENT_WINS"
  | "AI_AUTO_MERGE";

export interface FieldDiff {
  fieldName: string;
  fieldLabel: string;
  localValue: any;
  serverValue: any;
  hasDifference: boolean;
  chosenValue?: "LOCAL" | "SERVER" | "CUSTOM";
  customValue?: any;
}

export interface OfflineConflictRecord {
  conflictId: string;
  syncQueueId: string;
  recordId: string;
  recordType: OfflineRecordType;
  title: string;
  entityName: string;
  pitOrLocation: string;
  detectedAt: string;
  localVersion: {
    data: Record<string, any>;
    updatedAt: string;
    updatedBy: string;
    clientDeviceId: string;
  };
  serverVersion: {
    data: Record<string, any>;
    updatedAt: string;
    updatedBy: string;
    serverRevision: number;
  };
  fieldDiffs: FieldDiff[];
  aiMergeSuggestion?: {
    confidence: number;
    recommendedResolution: "KEEP_LOCAL" | "USE_SERVER" | "MERGE";
    mergedData: Record<string, any>;
    rationale: string;
  };
  status: "UNRESOLVED" | "RESOLVED";
  resolvedAt?: string;
  resolvedBy?: string;
  appliedResolution?: "KEEP_LOCAL" | "USE_SERVER" | "AI_SMART_MERGE" | "CUSTOM_MERGE";
}

export interface OfflineQueueItem {
  id: string;
  idempotencyKey: string;
  recordType: OfflineRecordType;
  recordId: string;
  entityTitle: string;
  pitLocation: string;
  data: Record<string, any>;
  createdAt: string;
  clientDeviceId: string;
  clientOperator: string;
  status: OfflineItemSyncStatus;
  retryCount: number;
  maxRetries: number;
  lastRetryAt?: string;
  errorMessage?: string;
  conflictId?: string;
  photoBase64?: string;
  payloadSizeBytes: number;
}

export interface SyncEngineStats {
  totalQueued: number;
  pendingSync: number;
  syncingCount: number;
  syncedCount: number;
  conflictCount: number;
  failedCount: number;
  lastSyncTimestamp: string | null;
  storageUsedKB: number;
  autoSyncActive: boolean;
}

export interface OfflineEngineSettings {
  autoSyncOnOnline: boolean;
  backgroundSyncIntervalSec: number;
  defaultConflictPolicy: ConflictResolutionPolicy;
  enableAISmartMerge: boolean;
  compressOfflineMedia: boolean;
  notifyOnConflict: boolean;
  soundOnSyncComplete: boolean;
}

export interface SyncAuditLogItem {
  id: string;
  timestamp: string;
  action: "ENQUEUED" | "SYNC_ATTEMPT" | "SYNC_SUCCESS" | "CONFLICT_DETECTED" | "CONFLICT_RESOLVED" | "SYNC_FAILED";
  recordType: OfflineRecordType;
  recordId: string;
  details: string;
  networkMode: NetworkConnectivityStatus;
  operator: string;
}
