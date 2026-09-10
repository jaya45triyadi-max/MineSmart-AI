// MINE SMART AI - Developer Control Panel & Master Admin Types
// PROMPT 36: Dynamic Platform CMS, Master Management, Configuration Engine & Security

export type DeveloperRole =
  | "MASTER_DEVELOPER"
  | "DEVELOPER"
  | "CONTENT_ADMIN"
  | "SUPPORT_ADMIN"
  | "BILLING_ADMIN"
  | "TECHNICAL_ADMIN";

export type DeveloperPermission =
  | "manage_customers"
  | "manage_users"
  | "manage_license"
  | "manage_subscription"
  | "manage_api"
  | "manage_ai"
  | "manage_cms"
  | "manage_media"
  | "manage_pricing"
  | "manage_feature_flags"
  | "manage_system"
  | "view_audit"
  | "manage_support"
  | "impersonate_tenant";

export interface DeveloperUser {
  id: string;
  name: string;
  email: string;
  role: DeveloperRole;
  permissions: DeveloperPermission[];
  avatarUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  lastLogin: string;
  mfaEnabled: boolean;
  createdAt: string;
}

// -------------------------------------------------------------
// DYNAMIC PLATFORM CONFIGURATION SCHEMA
// -------------------------------------------------------------

export interface CMSHeroSection {
  badge: string;
  title: string;
  highlightedTitle: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  demoVideoUrl?: string;
  heroImageUrl?: string;
}

export interface CMSFeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "AI" | "MINING" | "FLEET" | "HSE" | "COMMERCIAL";
  badge?: string;
  order: number;
}

export interface CMSFAQItem {
  id: string;
  question: string;
  answer: string;
  category: "GENERAL" | "PRICING" | "SECURITY" | "INTEGRATION" | "AI";
  order: number;
}

export interface CMSAnnouncement {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  targetScope: "ALL_USERS" | "ENTERPRISE_ONLY" | "PROSPECT_ONLY";
  active: boolean;
  startDate: string;
  endDate?: string;
  linkUrl?: string;
}

export interface WebsiteCMSConfig {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  hero: CMSHeroSection;
  features: CMSFeatureCard[];
  faqs: CMSFAQItem[];
  announcements: CMSAnnouncement[];
  contactEmail: string;
  contactPhone: string;
  whatsappSupportNumber: string;
  footerTagline: string;
  copyrightText: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "LOGO" | "FAVICON" | "DOCUMENT";
  format: "PNG" | "JPG" | "WEBP" | "SVG" | "MP4" | "PDF";
  sizeKB: number;
  dimensions?: { width: number; height: number };
  category: "HERO" | "BRANDING" | "FEATURES" | "BLOG" | "DOCS";
  uploadedBy: string;
  uploadedAt: string;
  altText?: string;
}

export interface BrandingConfig {
  appName: string;
  companyName: string;
  tagline: string;
  primaryColor: string; // e.g. #10B981
  secondaryColor: string; // e.g. #06B6D4
  accentColor: string; // e.g. #F59E0B
  fontFamily: string;
  mainLogoUrl: string;
  darkLogoUrl: string;
  lightLogoUrl: string;
  faviconUrl: string;
  loginHeroLogoUrl: string;
  pdfReportLogoUrl: string;
  allowTenantWhiteLabeling: boolean;
}

export interface PricingPlanConfig {
  planId: "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE" | "CUSTOM";
  displayName: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthlyIDR: number;
  priceAnnualIDR: number;
  priceQuarterlyIDR?: number;
  maxUsers: number;
  maxSites: number;
  maxDevices: number;
  storageGB: number;
  aiMonthlyQuota: number;
  supportSLA: string;
  featuresList: string[];
  enabledModuleKeys: string[];
  aiCapabilityFlags: string[];
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description: string;
  category: "AI_CORE" | "GEOSPATIAL" | "FLEET_FMS" | "ERP_FINANCE" | "COMMERCIAL";
  status: "ENABLED" | "DISABLED" | "BETA" | "MAINTENANCE";
  minPlanRequired: "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE";
  tenantOverrides?: Record<string, boolean>; // companyId -> boolean
  rolloutPercentage?: number; // 0 - 100
  updatedAt: string;
  updatedBy: string;
}

export interface APIProviderCredential {
  providerId: string;
  name: string;
  category: "AI_CORE" | "MAPS" | "STORAGE" | "WHATSAPP" | "EMAIL" | "GPS_FMS" | "IOT_MQTT";
  endpoint: string;
  modelIdentifier?: string;
  maskedApiKey: string; // ••••••••••••A82F (Plain secrets never exposed to frontend)
  status: "CONNECTED" | "DEGRADED" | "TIMEOUT" | "RATE_LIMIT" | "DISABLED";
  lastTestedAt: string;
  latencyMs: number;
  successRate24h: number;
  isPrimary: boolean;
  isFallback: boolean;
}

export interface AIProviderConfig {
  primaryProvider: "GEMINI_3_7_FLASH" | "GEMINI_3_7_PRO" | "GEMINI_3_7_THINKING" | "CUSTOM_AI_GATEWAY";
  fallbackProvider: "GEMINI_FLASH_BACKUP" | "LOCAL_LLM_GATEWAY" | "DISABLED";
  temperature: number; // 0.0 - 1.0
  maxTokens: number;
  defaultSystemInstruction: string;
  reasoningEffort: "LOW" | "MEDIUM" | "HIGH";
  enabledSubFeatures: {
    naturalLanguageQuery: boolean;
    rootCause5WhyEngine: boolean;
    minePlanningSequencer: boolean;
    predictiveMaintenanceVibration: boolean;
    fleetMatchFactorOptimizer: boolean;
    fuelTheftRadar: boolean;
    coalQualityGARBlending: boolean;
    executiveReport1Click: boolean;
  };
}

export interface MaintenanceModeConfig {
  isActive: boolean;
  title: string;
  message: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  allowedBypassRoles: DeveloperRole[];
  allowReadOnlyForClients: boolean;
}

export interface SystemSettingsConfig {
  defaultTimezone: "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";
  defaultCurrency: "IDR" | "USD";
  telemetryStreamIntervalSec: number;
  sessionTimeoutMinutes: number;
  enforceMFAForAdmins: boolean;
  auditRetentionDays: number;
}

export interface PlatformConfig {
  version: number;
  lastPublishedAt: string;
  lastPublishedBy: string;
  environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  websiteCMS: WebsiteCMSConfig;
  branding: BrandingConfig;
  pricingPlans: PricingPlanConfig[];
  featureFlags: FeatureFlagItem[];
  apiProviders: APIProviderCredential[];
  aiConfig: AIProviderConfig;
  maintenance: MaintenanceModeConfig;
  systemSettings: SystemSettingsConfig;
}

// -------------------------------------------------------------
// CMS VERSION RECORD & AUDIT
// -------------------------------------------------------------

export interface CMSVersionRecord {
  version: number;
  publishedAt: string;
  publishedBy: string;
  comment: string;
  changesSummary: string[];
  snapshot: PlatformConfig;
}

// -------------------------------------------------------------
// CUSTOMER & TENANT MANAGEMENT SCHEMA
// -------------------------------------------------------------

export interface MasterCustomerRecord {
  id: string; // e.g. COMP-BNU-01
  companyName: string;
  iupNumber: string;
  holdingGroupId?: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  plan: "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE" | "CUSTOM";
  licenseKey: string;
  licenseStatus: "ACTIVE" | "TRIAL" | "EXPIRED" | "SUSPENDED" | "GRACE_PERIOD";
  subscriptionStatus: "ACTIVE" | "PAST_DUE" | "TRIAL" | "CANCELLED";
  expiresAt: string;
  activeUsersCount: number;
  maxUsersLimit: number;
  activeSitesCount: number;
  maxSitesLimit: number;
  storageUsageGB: number;
  maxStorageGB: number;
  aiUsageCallsMonth: number;
  maxAiQuotaMonth: number;
  monthlyRevenueIDR: number;
  createdAt: string;
  lastActiveAt: string;
  customOverrides?: {
    customLogoUrl?: string;
    customThemeColor?: string;
    customModulesAllowed?: string[];
  };
}

export interface MasterGlobalUser {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
  lastLogin: string;
  registeredAt: string;
  activeSessionsCount: number;
  activeDeviceName: string;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  developerName: string;
  developerEmail: string;
  action:
    | "CMS_PUBLISH"
    | "CMS_ROLLBACK"
    | "PRICING_UPDATED"
    | "FEATURE_FLAG_TOGGLED"
    | "API_KEY_ROTATED"
    | "AI_CONFIG_UPDATED"
    | "CUSTOMER_CREATED"
    | "CUSTOMER_SUSPENDED"
    | "LICENSE_GENERATED"
    | "LICENSE_EXTENDED"
    | "MAINTENANCE_TOGGLED"
    | "IMPERSONATION_STARTED"
    | "IMPERSONATION_ENDED";
  targetResource: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface PlatformErrorLog {
  id: string;
  timestamp: string;
  module: string;
  severity: "CRITICAL" | "ERROR" | "WARNING" | "INFO";
  companyName?: string;
  userEmail?: string;
  message: string;
  stackTraceRedacted: string;
  browserOs: string;
  resolved: boolean;
}

export interface SystemHealthMetric {
  serviceName: string;
  category: "DATABASE" | "AUTH" | "AI_SERVICE" | "STORAGE" | "IOT_BROKER" | "MAPS_API";
  status: "OPERATIONAL" | "DEGRADED" | "OUTAGE";
  latencyMs: number;
  uptime24h: number;
  lastChecked: string;
  message: string;
}

export interface ImpersonationSession {
  active: boolean;
  tenantCompanyId: string;
  tenantCompanyName: string;
  adminEmail: string;
  reason: string;
  startedAt: string;
  expiresAt: string;
}
