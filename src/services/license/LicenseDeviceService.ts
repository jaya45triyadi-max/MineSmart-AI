import { LicenseDeviceRecord } from "../../types/license";
import { BaseRepository } from "../repositories/BaseRepository";

const DEVICE_INSTALLATION_KEY = "msai_device_installation_id_v1";

class LicenseDeviceRepository extends BaseRepository<LicenseDeviceRecord> {
  constructor() {
    super("license_devices", []);
  }

  async getDevicesByLicenseId(licenseId: string): Promise<LicenseDeviceRecord[]> {
    const all = await this.getAll();
    return all.filter((d) => d.licenseId === licenseId && d.status === "ACTIVE");
  }
}

export const licenseDeviceRepository = new LicenseDeviceRepository();

export class LicenseDeviceService {
  /**
   * Retrieves or generates a privacy-conscious device installation UUID
   */
  static getOrCreateDeviceInstallationId(): string {
    let id = localStorage.getItem(DEVICE_INSTALLATION_KEY);
    if (!id) {
      id = "DEV-INST-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
      localStorage.setItem(DEVICE_INSTALLATION_KEY, id);
    }
    return id;
  }

  /**
   * Detects non-invasive client metadata
   */
  static getClientMetadata() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown Browser";
    let platform = "Windows PC";
    if (ua.includes("Mac")) platform = "macOS";
    else if (ua.includes("Linux")) platform = "Linux";
    else if (ua.includes("Android")) platform = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) platform = "iOS";

    let browser = "Chrome";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    let deviceType: "DESKTOP" | "TABLET" | "MOBILE" = "DESKTOP";
    if (/Android|iPhone|iPad|iPod/i.test(ua)) {
      deviceType = /iPad|Tablet/i.test(ua) ? "TABLET" : "MOBILE";
    }

    return {
      platform,
      browser,
      deviceType,
      deviceName: `${platform} (${browser})`,
    };
  }

  /**
   * Registers current device with a license, checking device limits
   */
  static async registerCurrentDevice(
    licenseId: string,
    companyId: string,
    userId: string,
    userEmail: string,
    maxDevices: number
  ): Promise<{ success: boolean; device?: LicenseDeviceRecord; message?: string }> {
    const installationId = this.getOrCreateDeviceInstallationId();
    const meta = this.getClientMetadata();

    const activeDevices = await licenseDeviceRepository.getDevicesByLicenseId(licenseId);
    const existing = activeDevices.find((d) => d.deviceInstallationId === installationId);

    if (existing) {
      // Touch lastSeenAt
      existing.lastSeenAt = new Date().toISOString();
      await licenseDeviceRepository.update(existing.id, { lastSeenAt: existing.lastSeenAt });
      return { success: true, device: existing };
    }

    // Check device limit
    if (activeDevices.length >= maxDevices) {
      return {
        success: false,
        message: `Batas maksimum perangkat (${maxDevices} unit) telah tercapai. Hapus/revoke perangkat lama di Pengaturan Lisensi untuk mengaktifkan perangkat ini.`,
      };
    }

    const newDevice: LicenseDeviceRecord = {
      id: "DEV-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      licenseId,
      companyId,
      userId,
      userEmail,
      deviceIdHash: "hash_" + installationId,
      deviceInstallationId: installationId,
      deviceName: meta.deviceName,
      deviceType: meta.deviceType,
      platform: meta.platform,
      browser: meta.browser,
      firstActivatedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await licenseDeviceRepository.create(newDevice);
    return { success: true, device: newDevice };
  }

  /**
   * Revokes a device binding
   */
  static async revokeDevice(deviceId: string): Promise<boolean> {
    await licenseDeviceRepository.update(deviceId, {
      status: "REVOKED",
      revokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return true;
  }

  /**
   * Gets list of all devices registered under a license
   */
  static async getDevicesForLicense(licenseId: string): Promise<LicenseDeviceRecord[]> {
    const all = await licenseDeviceRepository.getAll();
    return all.filter((d) => d.licenseId === licenseId);
  }
}
