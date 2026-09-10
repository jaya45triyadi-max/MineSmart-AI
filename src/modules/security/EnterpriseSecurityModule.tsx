// MINE SMART AI - Comprehensive Enterprise Security, Zero-Trust Governance & Disaster Recovery Suite

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Smartphone,
  Cpu,
  Users,
  Database,
  RefreshCw,
  Clock,
  MapPin,
  Wifi,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  UploadCloud,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Terminal,
  Activity,
  Laptop,
  Radio,
  FileText,
  Sparkles,
  Zap,
  Trash2,
  Plus,
  QrCode,
  Fingerprint,
} from "lucide-react";
import {
  SecurityRole,
  PermissionDefinition,
  RoleRBACPolicy,
  UserSecurityProfile,
  JWTCryptographyConfig,
  EncryptionStatus,
  AuditTrailLogItem,
  LoginHistoryRecord,
  EnterpriseDeviceRecord,
  LiveUserSession,
  IPRestrictionRule,
  BackupRecord,
  RestorePoint,
  SecurityAlertLog,
} from "../../types/enterpriseSecurityTypes";
import {
  EnterpriseSecurityService,
  ALL_PERMISSIONS,
} from "../../services/security/EnterpriseSecurityService";

export const EnterpriseSecurityModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  // Navigation Tabs
  type TabKey =
    | "OVERVIEW"
    | "RBAC"
    | "MFA"
    | "JWT"
    | "ENCRYPTION"
    | "AUDIT"
    | "LOGIN_HISTORY"
    | "DEVICES"
    | "SESSIONS"
    | "IP_RULES"
    | "BACKUP_RESTORE"
    | "SECURITY_LOGS";

  const [activeTab, setActiveTab] = useState<TabKey>("OVERVIEW");

  // State from Service
  const [roles, setRoles] = useState<RoleRBACPolicy[]>([]);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserSecurityProfile[]>([]);
  const [jwtConfig, setJwtConfig] = useState<JWTCryptographyConfig>(
    EnterpriseSecurityService.getJWTConfig()
  );
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus>(
    EnterpriseSecurityService.getEncryptionStatus()
  );
  const [auditLogs, setAuditLogs] = useState<AuditTrailLogItem[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);
  const [devices, setDevices] = useState<EnterpriseDeviceRecord[]>([]);
  const [sessions, setSessions] = useState<LiveUserSession[]>([]);
  const [ipRules, setIpRules] = useState<IPRestrictionRule[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlertLog[]>([]);

  // RBAC Tab Specific State
  const [selectedRoleKey, setSelectedRoleKey] = useState<SecurityRole>("SUPER_ADMIN");
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [rbacSaveSuccess, setRbacSaveSuccess] = useState<boolean>(false);
  const [rbacViewMode, setRbacViewMode] = useState<"CARD_EDITOR" | "MATRIX_TABLE">("CARD_EDITOR");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  // MFA Setup Modal & Backup Codes State
  const [mfaModalUser, setMfaModalUser] = useState<UserSecurityProfile | null>(null);
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>([]);
  const [totpSimulatedCode, setTotpSimulatedCode] = useState<string>("849 201");
  const [totpCountdown, setTotpCountdown] = useState<number>(28);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // JWT Live Inspector State
  const [selectedJwtUser, setSelectedJwtUser] = useState<UserSecurityProfile | null>(null);
  const [liveJwtToken, setLiveJwtToken] = useState<string>("");
  const [jwtKeyRotated, setJwtKeyRotated] = useState<boolean>(false);

  // Live Encryption Playground State
  const [plainTextInput, setPlainTextInput] = useState<string>(
    "Batubara Seam 11 Pit North: Tonase 45,000 MT, CV 6,200 kcal/kg, Kontrak Royalti $4.8M"
  );
  const [encryptedPayload, setEncryptedPayload] = useState<{
    cipherText: string;
    iv: string;
    authTag: string;
    algorithm: string;
  } | null>(null);

  // Audit Filter State
  const [auditSearch, setAuditSearch] = useState<string>("");
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<string>("ALL");

  // IP Rule Modal State
  const [isAddIpOpen, setIsAddIpOpen] = useState<boolean>(false);
  const [newIpLabel, setNewIpLabel] = useState<string>("");
  const [newIpCidr, setNewIpCidr] = useState<string>("");
  const [newIpType, setNewIpType] = useState<"ALLOW_WHITELIST" | "DENY_BLACKLIST">(
    "ALLOW_WHITELIST"
  );
  const [newIpScope, setNewIpScope] = useState<
    "ALL_SYSTEM" | "ADMIN_ONLY" | "PIT_DISPATCH_ONLY"
  >("ALL_SYSTEM");

  // Backup & Restore Modal State
  const [isBackupRunning, setIsBackupRunning] = useState<boolean>(false);
  const [restoreProgress, setRestoreProgress] = useState<number | null>(null);
  const [restoreActiveStep, setRestoreActiveStep] = useState<string>("");

  // Initialize and load data
  const refreshAllData = () => {
    const r = EnterpriseSecurityService.getRoles();
    setRoles(r);
    setPermissions(EnterpriseSecurityService.getPermissions());
    const u = EnterpriseSecurityService.getUserProfiles();
    setUserProfiles(u);
    if (!selectedJwtUser && u.length > 0) {
      setSelectedJwtUser(u[0]);
      setLiveJwtToken(EnterpriseSecurityService.generateSampleJWT(u[0]));
    }
    setJwtConfig(EnterpriseSecurityService.getJWTConfig());
    setEncryptionStatus(EnterpriseSecurityService.getEncryptionStatus());
    setAuditLogs(EnterpriseSecurityService.getAuditLogs());
    setLoginHistory(EnterpriseSecurityService.getLoginHistory());
    setDevices(EnterpriseSecurityService.getDevices());
    setSessions(EnterpriseSecurityService.getSessions());
    setIpRules(EnterpriseSecurityService.getIPRules());
    setBackups(EnterpriseSecurityService.getBackups());
    setRestorePoints(EnterpriseSecurityService.getRestorePoints());
    setSecurityAlerts(EnterpriseSecurityService.getSecurityAlerts());

    // set edited permissions for selected role
    const currentRoleObj = r.find((item) => item.role === selectedRoleKey);
    if (currentRoleObj) {
      setEditedPermissions(currentRoleObj.permissions);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update edited permissions when selected role changes
  useEffect(() => {
    const currentRoleObj = roles.find((item) => item.role === selectedRoleKey);
    if (currentRoleObj) {
      setEditedPermissions(currentRoleObj.permissions);
    }
  }, [selectedRoleKey, roles]);

  // Simulated TOTP Clock countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpCountdown((prev) => {
        if (prev <= 1) {
          // Generate new 6-digit TOTP
          const rand = Math.floor(100000 + Math.random() * 900000).toString();
          setTotpSimulatedCode(`${rand.slice(0, 3)} ${rand.slice(3)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleTogglePermission = (code: string) => {
    setEditedPermissions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSaveRolePermissions = () => {
    EnterpriseSecurityService.updateRolePermissions(selectedRoleKey, editedPermissions);
    setRbacSaveSuccess(true);
    setTimeout(() => setRbacSaveSuccess(false), 3000);
    refreshAllData();
  };

  const handleRotateJWT = () => {
    const updated = EnterpriseSecurityService.rotateJWTRSAKeys();
    setJwtConfig(updated);
    setJwtKeyRotated(true);
    setTimeout(() => setJwtKeyRotated(false), 4000);
    if (selectedJwtUser) {
      setLiveJwtToken(EnterpriseSecurityService.generateSampleJWT(selectedJwtUser));
    }
    refreshAllData();
  };

  const handleEncryptTest = () => {
    const res = EnterpriseSecurityService.simulateEncryptAES(plainTextInput);
    setEncryptedPayload(res);
  };

  const handleTriggerBackup = (
    type: "FULL_DATABASE" | "INCREMENTAL" | "RKAB_DOCUMENTS" | "GIS_GEOPACKAGE" | "SYSTEM_CONFIG"
  ) => {
    setIsBackupRunning(true);
    setTimeout(() => {
      EnterpriseSecurityService.triggerManualBackup(type);
      setIsBackupRunning(false);
      refreshAllData();
    }, 1200);
  };

  const handleRunRestoreSimulation = (rp: RestorePoint) => {
    setRestoreProgress(5);
    setRestoreActiveStep("1/4: Memverifikasi Integritas Checksum SHA-256...");

    setTimeout(() => {
      setRestoreProgress(35);
      setRestoreActiveStep("2/4: Mempersiapkan Sandbox Isolated Container...");
    }, 1000);

    setTimeout(() => {
      setRestoreProgress(70);
      setRestoreActiveStep("3/4: Melakukan Rekonsiliasi Skema Database & Kunci KMS...");
    }, 2000);

    setTimeout(() => {
      setRestoreProgress(100);
      setRestoreActiveStep("4/4: Selesai! Validasi Disaster Recovery Berhasil 100%.");
      EnterpriseSecurityService.recordAudit({
        actorId: "usr-002",
        actorName: "Super Admin",
        actorRole: "SUPER_ADMIN",
        module: "DISASTER_RECOVERY",
        action: "RESTORE",
        severity: "CRITICAL",
        details: `Simulasi Disaster Recovery Restore (${rp.description}) berhasil dieksekusi tanpa gangguan ke database produksi.`,
      });
      refreshAllData();
      setTimeout(() => {
        setRestoreProgress(null);
        setRestoreActiveStep("");
      }, 3500);
    }, 3000);
  };

  const handleAddIpRule = () => {
    if (!newIpCidr || !newIpLabel) return;
    EnterpriseSecurityService.addIPRule({
      label: newIpLabel,
      cidr: newIpCidr,
      type: newIpType,
      targetScope: newIpScope,
      description: `Konfigurasi IP Firewall ditambahkan secara manual oleh administrator.`,
      isActive: true,
    });
    setIsAddIpOpen(false);
    setNewIpLabel("");
    setNewIpCidr("");
    refreshAllData();
  };

  // Filtered Audits
  const filteredAudits = auditLogs.filter((log) => {
    const matchSearch =
      auditSearch === "" ||
      log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.includes(auditSearch);

    const matchSeverity =
      auditSeverityFilter === "ALL" || log.severity === auditSeverityFilter;

    return matchSearch && matchSeverity;
  });

  return (
    <div className="space-y-6 pb-20 text-slate-100">
      {/* =========================================================================
          TOP BANNER: ENTERPRISE SECURITY & ZERO-TRUST POSTURE
          ========================================================================= */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-72 h-72 text-emerald-400" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Enterprise Security & Zero-Trust Governance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  DEFCON 5: AMAN (98/100 A+)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                  AES-256-GCM &bull; TLS 1.3 Strict
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Arsitektur pertahanan siber berlapis untuk operasi tambang: RBAC granular, MFA/2FA FIDO2, JWT RSA-256 Cryptography, Enkripsi KMS tingkat perbankan, Immutable Audit Trail, Device MDM, IP Whitelist, dan Disaster Recovery Otomatis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTriggerBackup("FULL_DATABASE")}
              disabled={isBackupRunning}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Database className={`w-4 h-4 ${isBackupRunning ? "animate-spin" : ""}`} />
              <span>{isBackupRunning ? "Memproses Backup..." : "Backup Snapshot Instan"}</span>
            </button>

            {onOpenAICopilot && (
              <button
                onClick={onOpenAICopilot}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tanya AI Security Copilot</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Security Metric Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> RBAC Roles
            </span>
            <div className="text-lg font-black text-white font-mono">{roles.length} Roles</div>
            <span className="text-[10px] text-slate-500">{permissions.length} Granular Permissions</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> MFA Enrollment
            </span>
            <div className="text-lg font-black text-emerald-300 font-mono">
              {Math.round((userProfiles.filter((u) => u.mfaEnabled).length / userProfiles.length) * 100)}%
            </div>
            <span className="text-[10px] text-emerald-500 font-mono">TOTP &bull; FIDO2 &bull; SMS</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
              <Lock className="w-3 h-3" /> Data Encryption
            </span>
            <div className="text-lg font-black text-cyan-300 font-mono">AES-256-GCM</div>
            <span className="text-[10px] text-slate-500">{encryptionStatus.encryptedFieldsCount} Kolom Terenkripsi</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
              <Laptop className="w-3 h-3" /> Active Devices
            </span>
            <div className="text-lg font-black text-amber-300 font-mono">
              {devices.filter((d) => d.status === "TRUSTED").length} Trusted
            </div>
            <span className="text-[10px] text-slate-500">{sessions.length} Live Active Sessions</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
              <Database className="w-3 h-3" /> Disaster Recovery
            </span>
            <div className="text-lg font-black text-purple-300 font-mono">RPO 5m / RTO 12m</div>
            <span className="text-[10px] text-purple-400 font-mono">7-Year Compliance</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION TABS (12 Enterprise Modules)
          ========================================================================= */}
      <div className="flex border-b border-slate-800 gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold pb-2">
        {[
          { key: "OVERVIEW", label: "Ringkasan & SIEM", icon: Activity, badge: securityAlerts.filter((a) => a.status === "OPEN").length || undefined },
          { key: "RBAC", label: "RBAC & Izin Akses", icon: Users },
          { key: "MFA", label: "MFA & 2FA Suite", icon: Smartphone },
          { key: "JWT", label: "JWT & Kriptografi", icon: Key },
          { key: "ENCRYPTION", label: "Enkripsi AES & KMS", icon: Lock },
          { key: "AUDIT", label: "Immutable Audit Trail", icon: FileText },
          { key: "LOGIN_HISTORY", label: "Riwayat Login & Anomali", icon: Clock },
          { key: "DEVICES", label: "Device MDM", icon: Laptop },
          { key: "SESSIONS", label: "Live Sessions", icon: Radio },
          { key: "IP_RULES", label: "IP Restriction & CIDR", icon: Wifi },
          { key: "BACKUP_RESTORE", label: "Backup & Restore (DR)", icon: Database },
          { key: "SECURITY_LOGS", label: "Log Keamanan SIEM", icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & THREAT POSTURE
          ========================================================================= */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* Active Security Threat Alerts Banner */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  Deteksi Ancaman SIEM Real-Time & Anomali Siber
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {securityAlerts.length} Event Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {securityAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                    alt.severity === "CRITICAL"
                      ? "bg-rose-950/30 border-rose-500/40"
                      : alt.severity === "HIGH"
                      ? "bg-amber-950/30 border-amber-500/40"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                          alt.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {alt.severity} &bull; {alt.alertType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-white">{alt.details}</p>
                    <p className="text-[11px] text-slate-400">
                      Target: <span className="text-indigo-300">{alt.targetUser}</span> ({alt.sourceIp})
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {alt.status}
                    </span>
                    <button
                      onClick={() => {
                        EnterpriseSecurityService.updateAlertStatus(alt.id, "MITIGATED");
                        refreshAllData();
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Tandai Selesai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Overview Quick Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Security Controls Checklist */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Matriks Kepatuhan ISO 27001 & ESDM
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Role-Based Access Control (RBAC)", status: "COMPLIANT", detail: "8 Roles & 17 Granular Matrix" },
                  { label: "Hardware MFA / WebAuthn FIDO2", status: "ENFORCED", detail: "Mandatory for KTT & Admin" },
                  { label: "JWT Token RSA-256 Key Rotation", status: "ACTIVE", detail: "90-Day Periodic Rotation" },
                  { label: "Data At Rest Hardware AES-256", status: "COMPLIANT", detail: "KMS Envelope Encryption" },
                  { label: "Immutable SHA-256 Audit Trail", status: "COMPLIANT", detail: "Tamper-evident Blockchain Ledger" },
                  { label: "Point-in-Time Disaster Recovery", status: "TESTED", detail: "Daily Automated Snapshots" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.detail}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Live Session Geo Map & Activity */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Sesi Pengguna Aktif Tambang
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {sessions.length} Live
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {sessions.map((ses) => (
                  <div
                    key={ses.sessionId}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">{ses.userName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ses.userRole}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{ses.location}</span>
                      <span className="text-indigo-300">{ses.ipAddress}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{ses.deviceName}</span>
                      <span className="text-emerald-400">Idle: {ses.idleMinutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Quick Key & Security Action Hub */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Aksi Cepat Keamanan Eksekutif
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  onClick={handleRotateJWT}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white block">Rotasi Kunci RSA JWT</span>
                    <span className="text-[10px] text-slate-400">Key ID: {jwtConfig.activeKeyId}</span>
                  </div>
                  <RefreshCw className={`w-4 h-4 text-indigo-400 ${jwtKeyRotated ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={() => setActiveTab("MFA")}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white block">Konfigurasi Hardware Key 2FA</span>
                    <span className="text-[10px] text-slate-400">YubiKey & Google Authenticator</span>
                  </div>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => setActiveTab("BACKUP_RESTORE")}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white block">Simulasi Disaster Recovery (DR)</span>
                    <span className="text-[10px] text-slate-400">Point-in-Time Restore Verification</span>
                  </div>
                  <Database className="w-4 h-4 text-purple-400" />
                </button>

                <button
                  onClick={() => setActiveTab("IP_RULES")}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white block">Kelola IP Whitelist / Firewall</span>
                    <span className="text-[10px] text-slate-400">{ipRules.length} Aturan Aktif</span>
                  </div>
                  <Wifi className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RBAC (ROLE-BASED ACCESS CONTROL) MATRIX & 18 MINING ROLES
          ========================================================================= */}
      {activeTab === "RBAC" && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                  18 MINING ROLES &bull; {permissions.length} PERMISSIONS
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-1">
                Role-Based Access Control (RBAC) Management
              </h3>
              <p className="text-xs text-slate-400">
                18 peran operasional pertambangan dengan konfigurasi hak akses spesifik, isolasi wewenang operasional, limit durasi sesi, dan pemaksaan MFA.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Toggle */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setRbacViewMode("CARD_EDITOR")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
                    rbacViewMode === "CARD_EDITOR"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Editor Peran
                </button>
                <button
                  onClick={() => setRbacViewMode("MATRIX_TABLE")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
                    rbacViewMode === "MATRIX_TABLE"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Matriks 18 Peran vs Hak Akses
                </button>
              </div>

              {rbacSaveSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                </span>
              )}
              {rbacViewMode === "CARD_EDITOR" && (
                <button
                  onClick={handleSaveRolePermissions}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan RBAC</span>
                </button>
              )}
            </div>
          </div>

          {rbacViewMode === "CARD_EDITOR" ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Roles Selector List (All 18 Roles) */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 max-h-[780px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Daftar 18 Peran Tambang:
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">
                    {roles.length} Role
                  </span>
                </div>
                {roles.map((r, idx) => {
                  const isSelected = selectedRoleKey === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => setSelectedRoleKey(r.role)}
                      className={`w-full p-3 rounded-2xl text-left transition cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                          : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono opacity-60">#{idx + 1}</span>
                          <span className="font-bold">{r.roleName}</span>
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {r.permissions.length} Izin
                        </span>
                      </div>
                      <span className="text-[10px] opacity-70 line-clamp-1">{r.description}</span>
                    </button>
                  );
                })}
              </div>

              {/* Permissions Granular Matrix for Selected Role */}
              <div className="lg:col-span-3 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                {/* Selected Role Meta */}
                {(() => {
                  const currentRole = roles.find((r) => r.role === selectedRoleKey);
                  if (!currentRole) return null;
                  return (
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white">{currentRole.roleName}</h4>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                            {currentRole.role}
                          </span>
                          {currentRole.isSystemRole && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                              SYSTEM ROLE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{currentRole.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                          <input
                            type="checkbox"
                            checked={currentRole.requireMFA}
                            onChange={(e) => {
                              EnterpriseSecurityService.toggleRoleMFA(currentRole.role, e.target.checked);
                              refreshAllData();
                            }}
                            className="w-4 h-4 accent-emerald-500 rounded"
                          />
                          <span className="font-bold text-emerald-300">Wajib MFA 2FA</span>
                        </label>

                        <div className="text-slate-400 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                          Max Sesi: <strong className="text-white">{currentRole.maxSessionDurationHours} Jam</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Category Chips Filters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Filter Kategori Hak Akses:
                    </span>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => setEditedPermissions(permissions.map((p) => p.code))}
                        className="text-indigo-400 hover:underline cursor-pointer font-bold"
                      >
                        Pilih Semua ({permissions.length})
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        onClick={() => setEditedPermissions([])}
                        className="text-slate-400 hover:underline cursor-pointer"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "ALL", label: "Semua Kategori" },
                      { id: "OPERATIONS_PRODUCTION", label: "Produksi & Ritase" },
                      { id: "FLEET_DISPATCH", label: "Fleet & FMS Dispatch" },
                      { id: "MINE_ENGINEERING", label: "Engineering / Desain" },
                      { id: "GEOLOGY_EXPLORATION", label: "Geologi & Lab Kualitas" },
                      { id: "SURVEY_MAPPING", label: "Survey & Drone LIDAR" },
                      { id: "PLANT_MAINTENANCE", label: "Maintenance & Plant" },
                      { id: "HSE_SAFETY", label: "HSE & K3" },
                      { id: "ENVIRONMENTAL_RECLAMATION", label: "Lingkungan & Reklamasi" },
                      { id: "HR_ORGANIZATION", label: "HR, SIMPER & Payroll" },
                      { id: "PROCUREMENT_VENDORS", label: "Procurement & Vendor" },
                      { id: "WAREHOUSE_INVENTORY", label: "Warehouse & BBM Solar" },
                      { id: "FINANCE_COMMERCIAL", label: "Finance & Royalti PNBP" },
                      { id: "EXECUTIVE_GOVERNANCE", label: "Eksekutif & RKAB" },
                      { id: "USER_RBAC", label: "RBAC Pengguna" },
                      { id: "SYSTEM_SECURITY", label: "Keamanan Sistem & Backup" },
                      { id: "DATA_EXPORT_API", label: "Ekspor Data & API" },
                      { id: "READ_ONLY_VIEW", label: "Hanya-Baca (Viewer)" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          selectedCategoryFilter === cat.id
                            ? "bg-indigo-600 text-white font-bold"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grouped Permissions Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Hak Akses Aktif: {editedPermissions.length} dari {permissions.length} Izin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {permissions
                      .filter(
                        (p) =>
                          selectedCategoryFilter === "ALL" ||
                          p.category === selectedCategoryFilter
                      )
                      .map((perm) => {
                        const isChecked = editedPermissions.includes(perm.code);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => handleTogglePermission(perm.code)}
                            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                              isChecked
                                ? "bg-indigo-950/30 border-indigo-500/50 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div
                              className="mt-1 w-4 h-4 accent-indigo-500 rounded cursor-pointer shrink-0"
                            />
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">{perm.label}</span>
                                <span
                                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    perm.riskLevel === "CRITICAL"
                                      ? "bg-rose-500/20 text-rose-300"
                                      : perm.riskLevel === "HIGH"
                                      ? "bg-amber-500/20 text-amber-300"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {perm.riskLevel}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">{perm.description}</p>
                              <div className="flex items-center justify-between pt-1">
                                <code className="text-[10px] text-indigo-400 font-mono">{perm.code}</code>
                                <span className="text-[9px] text-slate-500 font-mono">{perm.category}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Matrix Cross-Tab (18 Roles vs Permissions Table) */
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">
                    Matriks Komparasi 18 Peran Tambang
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tinjau pemetaan hak akses setiap peran secara komparatif untuk audit kepatuhan ISO 27001 dan Minerba ESDM.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-[9px] font-bold">✓</span> Memiliki Akses
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-slate-800 text-[9px] flex items-center justify-center">-</span> Tidak Diizinkan
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[650px] border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[1200px]">
                  <thead className="bg-slate-950 text-slate-300 font-mono text-[10px] uppercase sticky top-0 z-20 shadow-md">
                    <tr>
                      <th className="p-3 border-b border-r border-slate-800 min-w-[240px] bg-slate-950 sticky left-0 z-30">
                        Hak Akses / Modul
                      </th>
                      <th className="p-3 border-b border-r border-slate-800 text-center min-w-[70px]">Risiko</th>
                      {roles.map((r) => (
                        <th
                          key={r.role}
                          className="p-2.5 border-b border-r border-slate-800 text-center min-w-[100px] text-indigo-300 font-bold whitespace-nowrap"
                        >
                          {r.roleName.split("/")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {permissions.map((perm) => (
                      <tr key={perm.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 border-r border-slate-800 font-medium bg-slate-900/90 sticky left-0 z-10">
                          <div className="font-bold text-white text-xs">{perm.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{perm.code}</div>
                        </td>
                        <td className="p-2 border-r border-slate-800 text-center">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              perm.riskLevel === "CRITICAL"
                                ? "bg-rose-500/20 text-rose-300"
                                : perm.riskLevel === "HIGH"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {perm.riskLevel}
                          </span>
                        </td>
                        {roles.map((r) => {
                          const hasPerm = r.permissions.includes(perm.code);
                          return (
                            <td
                              key={r.role}
                              className={`p-2 border-r border-slate-800 text-center font-bold text-xs ${
                                hasPerm
                                  ? "bg-emerald-950/20 text-emerald-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {hasPerm ? "✓" : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: MFA & 2FA SUITE
          ========================================================================= */}
      {activeTab === "MFA" && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="text-sm font-black text-white">
              Multi-Factor Authentication (MFA & 2FA) Management
            </h3>
            <p className="text-xs text-slate-400">
              Otentikasi multi-faktor berbasis standar NIST SP 800-63B: TOTP Aplikasi (Google Authenticator), Kunci Keamanan Perangkat Keras FIDO2 / WebAuthn (YubiKey), SMS/Email OTP, dan Kode Pemulihan Darurat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live TOTP Authenticator Simulator */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Simulator TOTP Live (RFC 6238)
                  </h4>
                </div>

                <div className="p-5 bg-slate-950 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                  <span className="text-xs text-slate-400 block">
                    MineSmart Enterprise Authenticator:
                  </span>
                  <div className="text-3xl font-black text-emerald-300 font-mono tracking-widest">
                    {totpSimulatedCode}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>Kadaluarsa dalam <strong className="text-emerald-300">{totpCountdown}s</strong></span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 font-bold block">Metode 2FA yang Didukung:</span>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">🔑 FIDO2 / WebAuthn (YubiKey 5C)</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Aktif</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">📱 Google / Microsoft Authenticator</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Aktif</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">💬 SMS OTP & WhatsApp Dispatcher</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Aktif</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const codes = EnterpriseSecurityService.regenerateBackupCodes("usr-001");
                  setGeneratedBackupCodes(codes);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Key className="w-4 h-4" />
                <span>Generate 10 Kode Pemulihan Darurat</span>
              </button>
            </div>

            {/* User MFA Roster & Emergency Codes Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Emergency Backup Codes Display if generated */}
              {generatedBackupCodes.length > 0 && (
                <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-400" />
                      <h4 className="text-xs font-black text-amber-300">
                        10 Kode Pemulihan Darurat (One-Time Backup Codes)
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBackupCodes.join("\n"));
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Disalin!" : "Salin Semua"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Simpan kode-kode ini di tempat aman. Setiap kode hanya dapat digunakan 1 kali jika Anda kehilangan akses ke aplikasi authenticator atau perangkat seluler.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-xs font-bold text-center">
                    {generatedBackupCodes.map((code, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User MFA Roster Table */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Status Otentikasi Multi-Faktor Pengguna Tambang
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="pb-2">Nama & Email</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Status MFA</th>
                        <th className="pb-2">Metode Utama</th>
                        <th className="pb-2">Kunci FIDO2</th>
                        <th className="pb-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {userProfiles.map((u) => (
                        <tr key={u.userId} className="hover:bg-slate-800/40 transition">
                          <td className="py-3">
                            <span className="font-bold text-white block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-indigo-300">{u.role}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                u.mfaEnabled
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              }`}
                            >
                              {u.mfaEnabled ? "AKTIF (ENROLLED)" : "NONAKTIF"}
                            </span>
                          </td>
                          <td className="py-3 text-[11px] text-slate-300">{u.preferredMfaMethod}</td>
                          <td className="py-3 font-mono text-cyan-300">{u.fido2KeysCount} Kunci</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                EnterpriseSecurityService.toggleUserMFA(u.userId, !u.mfaEnabled);
                                refreshAllData();
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                u.mfaEnabled
                                  ? "bg-slate-800 text-slate-300 hover:text-rose-300"
                                  : "bg-emerald-600 text-white hover:bg-emerald-500"
                              }`}
                            >
                              {u.mfaEnabled ? "Nonaktifkan" : "Aktifkan MFA"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: JWT & TOKEN CRYPTOGRAPHY
          ========================================================================= */}
      {activeTab === "JWT" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <h3 className="text-sm font-black text-white">
                JSON Web Token (JWT) Asymmetric RSA-256 Engine
              </h3>
              <p className="text-xs text-slate-400">
                Inspektur token akses terenkripsi secara kriptografis, rotasi kunci asimetris, dan validasi klaim identitas sesi.
              </p>
            </div>

            <button
              onClick={handleRotateJWT}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${jwtKeyRotated ? "animate-spin" : ""}`} />
              <span>{jwtKeyRotated ? "Kunci Berhasil Dirotasi!" : "Rotasi Kunci RSA Baru"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* JWT Config Meta Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Parameter Kriptografi Token:
              </span>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Algoritma Signature:</span>
                <span className="text-sm font-black text-indigo-300 font-mono">{jwtConfig.algorithm} (RSA PKCS#1 v1.5)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Active Key ID (kid):</span>
                <span className="text-xs font-bold text-white font-mono">{jwtConfig.activeKeyId}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Access Token TTL:</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">{jwtConfig.accessTokenExpiryMin} Menit</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Refresh Token TTL:</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{jwtConfig.refreshTokenExpiryDays} Hari (Sliding Window)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Blacklisted JTI Tokens:</span>
                <span className="text-xs font-bold text-rose-300 font-mono">{jwtConfig.blacklistedTokensCount} Token Dicabut</span>
              </div>
            </div>

            {/* Live JWT Decoder & Visualizer */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Live Signed JWT Inspector
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Inspeksi Akun:</span>
                  <select
                    value={selectedJwtUser?.userId || ""}
                    onChange={(e) => {
                      const u = userProfiles.find((item) => item.userId === e.target.value);
                      if (u) {
                        setSelectedJwtUser(u);
                        setLiveJwtToken(EnterpriseSecurityService.generateSampleJWT(u));
                      }
                    }}
                    className="bg-slate-950 border border-slate-800 text-white rounded-lg p-1.5 text-xs font-bold"
                  >
                    {userProfiles.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Raw Encoded JWT (Color-coded Header.Payload.Signature) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Raw Bearer Token (Header.Payload.Signature):
                </span>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] break-all leading-relaxed">
                  {(() => {
                    const parts = liveJwtToken.split(".");
                    return (
                      <>
                        <span className="text-rose-400 font-bold">{parts[0]}</span>
                        <span className="text-slate-500">.</span>
                        <span className="text-purple-400 font-bold">{parts[1]}</span>
                        <span className="text-slate-500">.</span>
                        <span className="text-cyan-400 font-bold">{parts[2]}</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Decoded Blocks (Header & Payload JSON) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-4 bg-slate-950 border border-rose-500/30 rounded-2xl space-y-2">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">
                    HEADER: Algorithm & Key ID
                  </span>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto">
                    {JSON.stringify({ alg: jwtConfig.algorithm, typ: "JWT", kid: jwtConfig.activeKeyId }, null, 2)}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-2xl space-y-2">
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">
                    PAYLOAD: Claims & Identity
                  </span>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto max-h-48">
                    {selectedJwtUser
                      ? JSON.stringify(
                          {
                            sub: selectedJwtUser.userId,
                            email: selectedJwtUser.email,
                            name: selectedJwtUser.name,
                            role: selectedJwtUser.role,
                            department: selectedJwtUser.department,
                            iss: jwtConfig.issuer,
                            aud: jwtConfig.audience,
                            mfa_verified: selectedJwtUser.mfaEnabled,
                          },
                          null,
                          2
                        )
                      : "{}"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ENCRYPTION & KMS ENGINE
          ========================================================================= */}
      {activeTab === "ENCRYPTION" && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="text-sm font-black text-white">
              Data Encryption & Hardware Key Management Service (KMS)
            </h3>
            <p className="text-xs text-slate-400">
              Enkripsi ganda: Data-at-Rest (AES-256-GCM FIPS 140-3), Data-in-Transit (TLS 1.3 Strict HSTS), Envelope Encryption dengan Master Key Hardware Security Module (HSM).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KMS Status Panel */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>Status Kunci Cloud KMS</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">KMS Provider:</span>
                <span className="text-xs font-bold text-white">{encryptionStatus.kmsProvider}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Key Ring HSM:</span>
                <code className="text-[10px] text-cyan-300 font-mono block break-all">
                  {encryptionStatus.kmsKeyRing}
                </code>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Rotasi Master Key:</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">
                  Setiap {encryptionStatus.masterKeyRotationPeriodDays} Hari (Otomatis)
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">In-Transit Security:</span>
                <span className="text-xs font-bold text-indigo-300 font-mono">
                  {encryptionStatus.inTransitProtocol}
                </span>
              </div>
            </div>

            {/* Live Field Encryption Playground */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Interactive AES-256-GCM Encryption Playground
                </h4>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Plaintext Data Tambang (Data Asli):
                </label>
                <textarea
                  rows={2}
                  value={plainTextInput}
                  onChange={(e) => setPlainTextInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white font-mono"
                  placeholder="Ketik data rahasia tambang..."
                />
              </div>

              <button
                onClick={handleEncryptTest}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Enkripsi Sekarang dengan Kunci KMS (AES-256-GCM)</span>
              </button>

              {encryptedPayload && (
                <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      Hasil Enkripsi Hardware AES-256-GCM:
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ NIST FIPS 140-3</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">Ciphertext (Base64 Encoded):</span>
                    <p className="p-2.5 bg-slate-900 rounded-xl text-cyan-300 break-all text-[11px]">
                      {encryptedPayload.cipherText}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-500 block">Initialization Vector (IV 96-bit):</span>
                      <span className="text-slate-300 font-mono">{encryptedPayload.iv}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-500 block">Authentication Tag (128-bit):</span>
                      <span className="text-emerald-300 font-mono">{encryptedPayload.authTag}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: IMMUTABLE AUDIT TRAIL
          ========================================================================= */}
      {activeTab === "AUDIT" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <h3 className="text-sm font-black text-white">
                Immutable Regulatory Audit Trail (ESDM & ISO Compliance)
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan kriptografis tanpa manipulasi untuk seluruh tindakan eksekutif, modifikasi izin, ekspor masal, dan digital sign-off.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `minesmart_immutable_audit_${Date.now()}.json`;
                  a.click();
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export SIEM Syslog JSON</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <input
              type="text"
              placeholder="Cari audit trail (aktor, rincian, IP, modul)..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs w-full sm:w-80"
            />

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">Filter Severity:</span>
              {["ALL", "CRITICAL", "WARNING", "INFO"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setAuditSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    auditSeverityFilter === sev
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Trail List */}
          <div className="space-y-3">
            {filteredAudits.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                        log.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : log.severity === "WARNING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{log.action} &bull; {log.module}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-200">{log.details}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-slate-500">
                  <span>Aktor: <strong className="text-indigo-300">{log.actorName}</strong> ({log.actorRole})</span>
                  <span>IP: {log.ipAddress} ({log.location})</span>
                  <span className="text-slate-600 line-clamp-1 max-w-xs">{log.signatureHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: LOGIN HISTORY & ANOMALY DETECTION
          ========================================================================= */}
      {activeTab === "LOGIN_HISTORY" && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="text-sm font-black text-white">
              Riwayat Login & Deteksi Anomali Geovelocity AI
            </h3>
            <p className="text-xs text-slate-400">
              Pemantauan sidik jari perangkat (fingerprinting), ISP, lokasi geografis, dan mitigasi otomatis terhadap percobaan brute-force atau impossible travel.
            </p>
          </div>

          <div className="space-y-3">
            {loginHistory.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.status === "ANOMALY_GEOVELOCITY"
                    ? "bg-rose-950/20 border-rose-500/50"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.status === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {item.status}
                    </span>
                    <h4 className="text-xs font-black text-white">{item.userName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">({item.userRole})</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                    <span>IP: <strong className="text-indigo-300">{item.ipAddress}</strong></span>
                    <span>Lokasi: {item.location}</span>
                    <span>ISP: {item.isp}</span>
                    <span>OS/Browser: {item.os} &bull; {item.browser}</span>
                  </div>

                  {item.flaggedReason && (
                    <div className="p-2.5 bg-rose-950/50 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
                      ⚠️ {item.flaggedReason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Risk Score:</span>
                    <span
                      className={`text-sm font-black font-mono ${
                        item.riskScore > 50 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {item.riskScore}/100
                    </span>
                  </div>

                  {item.riskScore > 50 && (
                    <button
                      onClick={() => {
                        EnterpriseSecurityService.lockAccount(item.userId, item.flaggedReason || "Anomali terdeteksi");
                        refreshAllData();
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Kunci Akun
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: DEVICE MDM (MOBILE DEVICE MANAGEMENT)
          ========================================================================= */}
      {activeTab === "DEVICES" && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="text-sm font-black text-white">
              Enterprise Device Registry & Zero-Trust Endpoint MDM
            </h3>
            <p className="text-xs text-slate-400">
              Registrasi tablet tangguh lapangan (*Panasonic Toughbook*, *Samsung Tab Active*), laptop eksekutif KTT, verifikasi enkripsi disk, dan fungsi *Remote Wipe* darurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div
                key={dev.deviceId}
                className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 ${
                  dev.status === "WIPED"
                    ? "bg-rose-950/20 border-rose-500/40"
                    : dev.status === "REVOKED"
                    ? "bg-amber-950/20 border-amber-500/40"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-sm font-black text-white">{dev.deviceName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        dev.status === "TRUSTED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <p>Pengguna: <strong className="text-white">{dev.assignedUserName}</strong></p>
                    <p>Model: <span className="text-slate-300">{dev.model}</span> (SN: <span className="font-mono">{dev.serialNumber}</span>)</p>
                    <p>OS: <span className="text-slate-300">{dev.os}</span></p>
                    <p>Lokasi Terakhir: <span className="text-indigo-300">{dev.lastLocation}</span> &bull; {dev.lastActiveAt}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                    <div className="p-1.5 bg-slate-950 rounded-lg text-center">
                      <span className="text-slate-500 block">Biometric:</span>
                      <span className={dev.isBiometricEnrolled ? "text-emerald-400" : "text-slate-400"}>
                        {dev.isBiometricEnrolled ? "✓ Enrolled" : "Off"}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg text-center">
                      <span className="text-slate-500 block">Disk Encrypted:</span>
                      <span className="text-emerald-400 font-bold">✓ AES-256</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg text-center">
                      <span className="text-slate-500 block">MDM Compliant:</span>
                      <span className="text-emerald-400 font-bold">✓ Pass</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      EnterpriseSecurityService.revokeDevice(dev.deviceId);
                      refreshAllData();
                    }}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cabut Akses Token
                  </button>

                  <button
                    onClick={() => {
                      EnterpriseSecurityService.remoteWipeDevice(dev.deviceId);
                      refreshAllData();
                    }}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    title="Hapus seluruh data di perangkat dari jarak jauh"
                  >
                    Remote Wipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: LIVE SESSIONS
          ========================================================================= */}
      {activeTab === "SESSIONS" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <h3 className="text-sm font-black text-white">
                Live Concurrent Session Management
              </h3>
              <p className="text-xs text-slate-400">
                Kontrol sesi login secara real-time. Batasi akses bersamaan, pantau idle timeout, dan putus sesi yang tidak dikenal.
              </p>
            </div>

            <button
              onClick={() => {
                EnterpriseSecurityService.terminateAllOtherSessions("usr-001");
                refreshAllData();
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Putus Semua Sesi Lain Saya
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((ses) => (
              <div
                key={ses.sessionId}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-white">{ses.userName}</h4>
                    <span className="text-[10px] font-mono text-indigo-300">({ses.userRole})</span>
                    {ses.isCurrentSession && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
                        SESI ANDA SAAT INI
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                    <span>Device: <strong className="text-slate-200">{ses.deviceName}</strong></span>
                    <span>Lokasi: {ses.location}</span>
                    <span>IP: {ses.ipAddress}</span>
                    <span>Aktif Sejak: {ses.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Idle: {ses.idleMinutes} Menit
                  </span>

                  {!ses.isCurrentSession && (
                    <button
                      onClick={() => {
                        EnterpriseSecurityService.terminateSession(ses.sessionId);
                        refreshAllData();
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Putus Sesi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: IP RESTRICTION & WHITELIST RULES
          ========================================================================= */}
      {activeTab === "IP_RULES" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <h3 className="text-sm font-black text-white">
                IP Whitelist, CIDR Subnets & Geofencing Rules
              </h3>
              <p className="text-xs text-slate-400">
                Batasi akses platform tambang hanya dari alamat IP kantor pusat resmi, jaringan Wi-Fi/VSAT pit tambang, atau VPN perusahaan.
              </p>
            </div>

            <button
              onClick={() => setIsAddIpOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Aturan IP</span>
            </button>
          </div>

          <div className="space-y-3">
            {ipRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        rule.type === "ALLOW_WHITELIST"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {rule.type === "ALLOW_WHITELIST" ? "WHITELIST (ALLOW)" : "BLACKLIST (DENY)"}
                    </span>
                    <h4 className="text-xs font-black text-white">{rule.label}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{rule.description}</p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span>CIDR: <strong className="text-cyan-300">{rule.cidr}</strong></span>
                    <span>Scope: <strong className="text-indigo-300">{rule.targetScope}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      EnterpriseSecurityService.toggleIPRule(rule.id, !rule.isActive);
                      refreshAllData();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      rule.isActive
                        ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {rule.isActive ? "Aktif" : "Nonaktif"}
                  </button>

                  <button
                    onClick={() => {
                      EnterpriseSecurityService.deleteIPRule(rule.id);
                      refreshAllData();
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add IP Modal */}
          {isAddIpOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white">Tambah Aturan IP Firewall</h4>
                  <button onClick={() => setIsAddIpOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block text-[10px] font-bold mb-1">Nama / Label Lokasi:</label>
                    <input
                      type="text"
                      placeholder="e.g. Kantor Cabang Palembang"
                      value={newIpLabel}
                      onChange={(e) => setNewIpLabel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block text-[10px] font-bold mb-1">Alamat IP / Blok CIDR:</label>
                    <input
                      type="text"
                      placeholder="e.g. 182.253.110.0/24"
                      value={newIpCidr}
                      onChange={(e) => setNewIpCidr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block text-[10px] font-bold mb-1">Jenis Kebijakan:</label>
                    <select
                      value={newIpType}
                      onChange={(e) => setNewIpType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="ALLOW_WHITELIST">Izinkan Akses (Allow Whitelist)</option>
                      <option value="DENY_BLACKLIST">Blokir Akses (Deny Blacklist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block text-[10px] font-bold mb-1">Cakupan Pengguna:</label>
                    <select
                      value={newIpScope}
                      onChange={(e) => setNewIpScope(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="ALL_SYSTEM">Semua Pengguna Platform</option>
                      <option value="ADMIN_ONLY">Khusus Administrator & KTT</option>
                      <option value="PIT_DISPATCH_ONLY">Khusus Operator Pit Dispatch</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsAddIpOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddIpRule}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Simpan Aturan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 11: DATA BACKUP & RESTORE (DISASTER RECOVERY)
          ========================================================================= */}
      {activeTab === "BACKUP_RESTORE" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl">
            <div>
              <h3 className="text-sm font-black text-white">
                Disaster Recovery (DR), Encrypted Backups & Point-in-Time Restore
              </h3>
              <p className="text-xs text-slate-400">
                Snapshot harian terenkripsi multi-region (Google Cloud Storage Asia & AWS S3 Jakarta Vault) dengan target RPO &lt; 5 menit dan RTO &lt; 12 menit.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerBackup("FULL_DATABASE")}
                disabled={isBackupRunning}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>+ Buat Backup On-Demand</span>
              </button>
            </div>
          </div>

          {/* Restore Progress Bar if running */}
          {restoreProgress !== null && (
            <div className="p-5 bg-slate-950 border border-indigo-500/40 rounded-3xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  {restoreActiveStep}
                </span>
                <span className="font-mono font-bold text-white">{restoreProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${restoreProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Point-in-Time Restore Drill Cards */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Titik Pemulihan Point-in-Time (PITR Snapshots)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restorePoints.map((rp) => (
                <div
                  key={rp.restorePointId}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-white">{rp.description}</h5>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ✓ Checksum Valid
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Waktu Snapshot: <strong className="text-indigo-300">{rp.snapshotTime}</strong>
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                      <span>RPO Target: {rp.rpoMinutes} Menit</span>
                      <span>RTO Target: {rp.rtoMinutes} Menit</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunRestoreSimulation(rp)}
                    disabled={restoreProgress !== null}
                    className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Jalankan Simulasi Restore Sandbox (Dry Run)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Backups List Table */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Arsip Cadangan Terenkripsi ({backups.length} Snapshots)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">ID Backup & Tipe</th>
                    <th className="pb-2">Waktu Eksekusi</th>
                    <th className="pb-2">Ukuran (MB)</th>
                    <th className="pb-2">Penyimpanan Target</th>
                    <th className="pb-2">Retensi</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {backups.map((b) => (
                    <tr key={b.backupId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3">
                        <span className="font-bold text-white block">{b.backupId}</span>
                        <span className="text-[10px] text-indigo-300 font-mono">{b.backupType}</span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-300">{b.timestamp}</td>
                      <td className="py-3 font-mono text-white font-bold">{b.sizeMB} MB</td>
                      <td className="py-3 text-[11px] text-slate-400">{b.storageTarget}</td>
                      <td className="py-3 font-mono text-cyan-300">{b.retentionDays} Hari</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          ✓ {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 12: SECURITY LOGS & SIEM INTEGRATION
          ========================================================================= */}
      {activeTab === "SECURITY_LOGS" && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="text-sm font-black text-white">
              Log Keamanan SIEM (Security Information & Event Management)
            </h3>
            <p className="text-xs text-slate-400">
              Integrasi feed log keamanan enterprise ke Splunk, Elastic SIEM, Microsoft Sentinel, atau IBM QRadar via Webhook Syslog TLS.
            </p>
          </div>

          <div className="space-y-3">
            {securityAlerts.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        log.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300"
                          : log.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {log.severity} &bull; {log.alertType}
                    </span>
                    <span className="text-xs font-bold text-white">{log.id}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-200">{log.details}</p>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-mono">
                  🛡️ Mitigasi Otomatis: {log.countermeasureTaken}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
