// MINE SMART AI - Security Center & Device Service (PROMPT 35)

import { UserDeviceRecord, SecurityEventRecord } from "../../types/commercialOfflineTypes";

export class SecurityCenterService {
  private static userDevices: UserDeviceRecord[] = [
    {
      deviceId: "dev-001",
      userId: "usr-admin-01",
      deviceName: "MacBook Pro 16 (Mine HQ Admin)",
      deviceType: "DESKTOP_WEB",
      browser: "Google Chrome 127.0",
      os: "macOS Sequoia",
      ipAddress: "182.253.110.42 (Jakarta, ID)",
      location: "Jakarta HQ Office",
      lastActiveAt: new Date().toISOString(),
      isCurrentDevice: true,
      status: "ACTIVE",
    },
    {
      deviceId: "dev-002",
      userId: "usr-admin-01",
      deviceName: "Samsung Galaxy S24 Ultra (KTT Field)",
      deviceType: "MOBILE_ANDROID",
      browser: "Chrome Mobile PWA",
      os: "Android 14",
      ipAddress: "114.122.204.18 (Muara Enim, ID)",
      location: "Site Muara Enim Pit 2",
      lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
      isCurrentDevice: false,
      status: "ACTIVE",
    },
    {
      deviceId: "dev-003",
      userId: "usr-admin-01",
      deviceName: "iPad Air 5 (Survey & GIS Tablet)",
      deviceType: "TABLET",
      browser: "Safari iOS 17.5",
      os: "iPadOS 17",
      ipAddress: "180.252.88.19 (Palembang, ID)",
      location: "Survey Basecamp",
      lastActiveAt: "2026-08-12T10:15:00Z",
      isCurrentDevice: false,
      status: "ACTIVE",
    },
  ];

  private static securityEvents: SecurityEventRecord[] = [
    {
      eventId: "sec-ev-001",
      eventType: "MASS_EXPORT_ALERT",
      severity: "MEDIUM",
      userId: "usr-fin-04",
      userName: "Finance Lead (Siti Nurhaliza)",
      ipAddress: "180.252.12.90",
      details: "Pengunduhan masal 2,400 record laporan keuangan & biaya operasi tambang",
      timestamp: new Date().toISOString(),
      status: "UNRESOLVED",
    },
    {
      eventId: "sec-ev-002",
      eventType: "UNKNOWN_DEVICE_LOGIN",
      severity: "HIGH",
      userId: "usr-disp-02",
      userName: "Supervisor Dispatch",
      ipAddress: "36.88.210.15",
      details: "Sesi login terdeteksi dari IP publik tidak dikenal di Surabaya",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "INVESTIGATING",
    },
    {
      eventId: "sec-ev-003",
      eventType: "LICENSE_LIMIT_REACHED",
      severity: "LOW",
      userId: "usr-sys-01",
      userName: "System Admin",
      ipAddress: "182.253.110.42",
      details: "Batas 25 akun aktif pengguna perusahaan hampir tercapai (24/25 User)",
      timestamp: "2026-08-13T14:20:00Z",
      status: "RESOLVED",
    },
  ];

  public static getDevices(): UserDeviceRecord[] {
    return this.userDevices;
  }

  public static getSecurityEvents(): SecurityEventRecord[] {
    return this.securityEvents;
  }

  /**
   * Revokes a device session immediately.
   */
  public static revokeDevice(deviceId: string): void {
    const dev = this.userDevices.find((d) => d.deviceId === deviceId);
    if (dev) {
      dev.status = "REVOKED";
    }
  }

  /**
   * Logs out all remote devices except current device.
   */
  public static logoutAllOtherDevices(): void {
    this.userDevices.forEach((dev) => {
      if (!dev.isCurrentDevice) {
        dev.status = "REVOKED";
      }
    });
  }

  /**
   * Disaster recovery checklist status.
   */
  public static getDisasterRecoveryStatus() {
    return {
      rpoHours: 1, // Recovery Point Objective (1 Hour Data Loss Max)
      rtoHours: 2, // Recovery Time Objective (2 Hours Restore Max)
      lastAutoBackupAt: new Date(Date.now() - 14400000).toLocaleString("id-ID") + " WITA",
      backupIntegrity: "VERIFIED_100_PCT",
      storageEncryption: "AES-256-GCM (Google Cloud KMS)",
      dataIsolation: "STRICT_MULTI_TENANT_FIRESTORE_RULES",
    };
  }
}
