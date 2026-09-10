import { BaseEntity, NavigationModuleKey } from "./index";

export type LicenseStatus =
  | "UNACTIVATED"
  | "ACTIVE"
  | "TRIAL"
  | "EXPIRING"
  | "GRACE_PERIOD"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED"
  | "CANCELLED";

export type LicensePlanId = "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE";

export type SubscriptionCycleType = "MONTHLY" | "QUARTERLY" | "YEARLY" | "ENTERPRISE";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "GRACE_PERIOD"
  | "CANCELLED"
  | "EXPIRED"
  | "SUSPENDED";

export interface AIQuotaConfig {
  monthlyLimit: number;
  usedThisMonth: number;
  resetDate: string;
}

export interface StorageQuotaConfig {
  limitGB: number;
  usedGB: number;
}

export interface LicenseBindingInfo {
  // 1 Account = 1 License Key
  userBinding: {
    userId: string;
    userEmail: string;
    userName: string;
    boundAt: string;
  };
  companyBinding: {
    companyId: string;
    companyName: string;
    iupPermitNumber?: string;
    taxIdNpwp?: string;
    boundAt: string;
  };
  deviceBinding: {
    maxAllowedDevices: number;
    activeDevicesCount: number;
    enforceHardwareBinding: boolean;
  };
}

export interface LicenseRecord extends BaseEntity {
  licenseKeyHash: string;
  licenseKeyLast4: string;
  maskedKey?: string; // e.g. MSAI-ID-XXXX-XXXX-204E
  companyId: string;
  companyName: string;
  ownerUserId: string;
  ownerEmail: string;
  subscriptionId: string;
  planId: LicensePlanId;
  billingCycle: SubscriptionCycleType;
  status: LicenseStatus;
  issuedAt: string;
  activatedAt?: string;
  startAt: string;
  expiryAt: string;
  gracePeriodStartAt?: string;
  gracePeriodEndAt?: string;
  maxUsers: number;
  maxSites: number;
  maxDevices: number;
  enabledModules: NavigationModuleKey[];
  aiQuota: AIQuotaConfig;
  storageQuota: StorageQuotaConfig;
  bindingInfo?: LicenseBindingInfo;
  activationCount: number;
  lastValidatedAt: string;
  suspendedAt?: string;
  suspendedReason?: string;
  revokedAt?: string;
  revokedReason?: string;
  deactivatedAt?: string;
  deactivatedReason?: string;
}

export interface LicenseDeviceRecord extends BaseEntity {
  licenseId: string;
  companyId: string;
  userId: string;
  userEmail: string;
  deviceIdHash: string;
  deviceInstallationId: string;
  deviceName: string;
  deviceType: "DESKTOP" | "TABLET" | "MOBILE";
  platform: string;
  browser: string;
  ipAddress?: string;
  location?: string;
  firstActivatedAt: string;
  lastSeenAt: string;
  status: "ACTIVE" | "REVOKED";
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord extends BaseEntity {
  companyId: string;
  companyName: string;
  licenseId: string;
  planId: LicensePlanId;
  billingCycle: SubscriptionCycleType;
  status: SubscriptionStatus;
  amountIDR: number;
  startAt: string;
  currentPeriodStartAt: string;
  currentPeriodEndAt: string;
  autoRenew: boolean;
  trialStartAt?: string;
  trialEndAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlanDef {
  planId: LicensePlanId;
  displayName: string;
  tagline: string;
  priceMonthlyIDR: number;
  priceQuarterlyIDR: number;
  priceAnnualIDR: number;
  priceEnterpriseIDR: number;
  maxUsers: number;
  maxSites: number;
  maxDevices: number;
  storageGB: number;
  aiMonthlyQuota: number;
  enabledModules: NavigationModuleKey[];
  aiFeatures: string[];
  supportLevel: "STANDARD" | "PRIORITY" | "DEDICATED_24_7";
}

export interface InvoiceRecord extends BaseEntity {
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  subscriptionId: string;
  planId: LicensePlanId;
  amountIDR: number;
  currency: "IDR";
  status: "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  paymentMethod?: "BANK_TRANSFER" | "INVOICE_MANUAL" | "CREDIT_CARD";
  bankTransferDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LicenseAuditEvent extends BaseEntity {
  licenseId: string;
  companyId: string;
  userId: string;
  userEmail: string;
  eventType:
    | "LICENSE_CREATED"
    | "LICENSE_ACTIVATED"
    | "LICENSE_VALIDATED"
    | "LICENSE_RENEWED"
    | "LICENSE_SUSPENDED"
    | "LICENSE_RESUMED"
    | "LICENSE_REVOKED"
    | "DEVICE_ADDED"
    | "DEVICE_REVOKED"
    | "SUBSCRIPTION_UPGRADED"
    | "SUBSCRIPTION_DOWNGRADED"
    | "SUBSCRIPTION_RENEWED"
    | "SUBSCRIPTION_CANCELLED";
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface UsageSummary {
  activeUsers: number;
  maxUsers: number;
  activeSites: number;
  maxSites: number;
  activeDevices: number;
  maxDevices: number;
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  storageUsedGB: number;
  storageLimitGB: number;
}
