// MINE SMART AI - Commercial, Mobile, Offline & Security Types (PROMPT 35)

export type OfflineSyncStatus = "PENDING" | "SYNCING" | "SUCCESS" | "FAILED" | "CONFLICT";

export interface SyncQueueItem {
  syncId: string;
  idempotencyKey: string;
  recordType: "PRODUCTION_INPUT" | "HSE_INSPECTION font" | "EQUIPMENT_CHECKLIST" | "MAINTENANCE_LOG" | "ATTENDANCE_CLOCK";
  recordId: string;
  data: Record<string, any>;
  createdAt: string;
  retryCount: number;
  status: OfflineSyncStatus;
  errorMessage?: string;
  photoUrl?: string;
}

export interface UserDeviceRecord {
  deviceId: string;
  userId: string;
  deviceName: string;
  deviceType: "MOBILE_ANDROID" | "MOBILE_IOS" | "TABLET" | "DESKTOP_WEB" | "PWA";
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
  status: "ACTIVE" | "REVOKED";
}

export interface SecurityEventRecord {
  eventId: string;
  eventType: "MULTIPLE_FAILED_LOGINS" | "UNKNOWN_DEVICE_LOGIN" | "MASS_EXPORT_ALERT" | "LICENSE_LIMIT_REACHED" | "PERMISSION_ELEVATION";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId: string;
  userName: string;
  ipAddress: string;
  details: string;
  timestamp: string;
  status: "UNRESOLVED" | "INVESTIGATING" | "RESOLVED";
}

export type SubscriptionTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export interface PlanPricing {
  tier: SubscriptionTier;
  name: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  userLimit: number;
  siteLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface SupportTicket {
  ticketId: string;
  companyId: string;
  subject: string;
  category: "OPERATIONAL" | "AI_ASSISTANT" | "GIS_MAPS" | "OFFLINE_SYNC" | "LICENSE_BILLING" | "INTEGRATION";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
}

export interface OnboardingStep {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface CommercialReadinessCategory {
  categoryName: string;
  scorePct: number;
  status: "READY" | "WARNING" | "BLOCKED";
  checkpoints: { name: string; status: "PASS" | "WARNING" | "FAIL" }[];
}
