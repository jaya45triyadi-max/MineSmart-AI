// MINE SMART AI - Comprehensive Enterprise Security & Zero-Trust Governance Types

export type SecurityRole =
  | "SUPER_ADMIN"
  | "OWNER"
  | "DIRECTOR"
  | "GENERAL_MANAGER"
  | "MINE_MANAGER"
  | "ENGINEERING"
  | "GEOLOGY"
  | "SURVEY"
  | "PRODUCTION"
  | "DISPATCH"
  | "MAINTENANCE"
  | "HSE"
  | "ENVIRONMENT"
  | "HR"
  | "PROCUREMENT"
  | "WAREHOUSE"
  | "FINANCE"
  | "VIEWER";

export type SecurityPermissionCategory =
  | "OPERATIONS_PRODUCTION"
  | "FLEET_DISPATCH"
  | "MINE_ENGINEERING"
  | "GEOLOGY_EXPLORATION"
  | "SURVEY_MAPPING"
  | "PLANT_MAINTENANCE"
  | "HSE_SAFETY"
  | "ENVIRONMENTAL_RECLAMATION"
  | "HR_ORGANIZATION"
  | "PROCUREMENT_VENDORS"
  | "WAREHOUSE_INVENTORY"
  | "FINANCE_COMMERCIAL"
  | "EXECUTIVE_GOVERNANCE"
  | "USER_RBAC"
  | "SYSTEM_SECURITY"
  | "DATA_EXPORT_API"
  | "READ_ONLY_VIEW";

export interface PermissionDefinition {
  id: string;
  code: string;
  label: string;
  category: SecurityPermissionCategory;
  description: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface RoleRBACPolicy {
  role: SecurityRole;
  roleName: string;
  description: string;
  isSystemRole: boolean;
  assignedUsersCount: number;
  permissions: string[]; // list of permission codes
  maxSessionDurationHours: number;
  requireMFA: boolean;
  ipRestrictionEnabled: boolean;
}

export type MFAMethod =
  | "TOTP_AUTHENTICATOR"
  | "SMS_OTP"
  | "EMAIL_OTP"
  | "FIDO2_WEBAUTHN"
  | "BACKUP_CODES";

export interface UserSecurityProfile {
  userId: string;
  name: string;
  email: string;
  role: SecurityRole;
  department: string;
  mfaEnabled: boolean;
  preferredMfaMethod: MFAMethod;
  fido2KeysCount: number;
  backupCodesRemaining: number;
  lastPasswordChange: string;
  failedLoginAttempts: number;
  isAccountLocked: boolean;
  trustedDevicesCount: number;
  activeSessionsCount: number;
}

export interface JWTCryptographyConfig {
  algorithm: "RS256" | "ES256" | "HS256";
  activeKeyId: string;
  keyGeneratedAt: string;
  nextRotationDate: string;
  accessTokenExpiryMin: number;
  refreshTokenExpiryDays: number;
  issuer: string;
  audience: string;
  allowSlidingWindow: boolean;
  blacklistedTokensCount: number;
}

export interface EncryptionStatus {
  dataAtRestAlgorithm: "AES-256-GCM" | "CHACHA20-POLY1305";
  dataAtRestStatus: "FULLY_ENCRYPTED";
  inTransitProtocol: "TLS 1.3 (Strict HSTS)";
  kmsProvider: "Google Cloud KMS" | "AWS KMS" | "Hardware HSM";
  kmsKeyRing: string;
  masterKeyRotationPeriodDays: number;
  lastRotatedAt: string;
  fieldLevelEncryptionEnabled: boolean;
  encryptedFieldsCount: number;
}

export interface AuditTrailLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: SecurityRole;
  ipAddress: string;
  location: string;
  module: string;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT" | "MFA_VERIFY" | "PERMISSION_CHANGE" | "BACKUP" | "RESTORE" | "SECURITY_ALERT";
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  details: string;
  beforeSnapshot?: Record<string, any>;
  afterSnapshot?: Record<string, any>;
  signatureHash: string; // SHA-256 Tamper-evident ledger
}

export interface LoginHistoryRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: SecurityRole;
  ipAddress: string;
  location: string;
  isp: string;
  deviceType: "DESKTOP" | "LAPTOP" | "MOBILE" | "TABLET" | "RUGGED_PIT";
  browser: string;
  os: string;
  status: "SUCCESS" | "FAILED_BAD_PASSWORD" | "FAILED_MFA" | "BLOCKED_IP" | "ANOMALY_GEOVELOCITY";
  riskScore: number; // 0 - 100
  flaggedReason?: string;
}

export interface EnterpriseDeviceRecord {
  deviceId: string;
  deviceName: string;
  assignedUserId: string;
  assignedUserName: string;
  deviceType: "RUGGED_TABLET_PIT" | "OFFICE_DESKTOP" | "LAPTOP" | "MOBILE_HANDHELD";
  os: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  lastLocation: string;
  registeredAt: string;
  lastActiveAt: string;
  isBiometricEnrolled: boolean;
  isDiskEncrypted: boolean;
  isMdmCompliant: boolean;
  status: "TRUSTED" | "QUARANTINED" | "REVOKED" | "WIPED";
}

export interface LiveUserSession {
  sessionId: string;
  userId: string;
  userName: string;
  userRole: SecurityRole;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  siteId: string;
  siteName: string;
  createdAt: string;
  lastActivityAt: string;
  idleMinutes: number;
  isCurrentSession: boolean;
}

export interface IPRestrictionRule {
  id: string;
  label: string;
  cidr: string;
  type: "ALLOW_WHITELIST" | "DENY_BLACKLIST";
  targetScope: "ALL_SYSTEM" | "ADMIN_ONLY" | "PIT_DISPATCH_ONLY";
  description: string;
  siteId?: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export interface BackupRecord {
  backupId: string;
  timestamp: string;
  backupType: "FULL_DATABASE" | "INCREMENTAL" | "RKAB_DOCUMENTS" | "GIS_GEOPACKAGE" | "SYSTEM_CONFIG";
  sizeMB: number;
  encryptedChecksumSha256: string;
  storageTarget: "CLOUD_STORAGE_MULTI_REGION" | "COLD_VAULT_AWS" | "ON_PREMISE_SITE_NAS";
  retentionDays: number;
  status: "COMPLETED" | "RUNNING" | "FAILED" | "VERIFIED";
  initiatedBy: string; // e.g. "Automated Cron (02:00 WITA)"
  durationSec: number;
}

export interface RestorePoint {
  restorePointId: string;
  snapshotTime: string;
  backupRefId: string;
  description: string;
  rpoMinutes: number;
  rtoMinutes: number;
  verifiedIntegrity: boolean;
}

export interface SecurityAlertLog {
  id: string;
  timestamp: string;
  alertType:
    | "BRUTE_FORCE_ATTEMPT"
    | "IMPOSSIBLE_TRAVEL_SPEED"
    | "PRIVILEGE_ESCALATION_PROBE"
    | "MASS_DATA_EXPORT_EXFILTRATION"
    | "UNENCRYPTED_API_ACCESS"
    | "COMPROMISED_TOKEN_REPLAY";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceIp: string;
  targetUser: string;
  details: string;
  status: "OPEN" | "INVESTIGATING" | "MITIGATED" | "FALSE_POSITIVE";
  countermeasureTaken: string;
}
