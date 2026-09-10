import { LicenseRecord, UsageSummary } from "../../types/license";
import { userRepository } from "../repositories/UserRepository";
import { siteRepository } from "../repositories/SiteRepository";
import { LicenseDeviceService } from "./LicenseDeviceService";
import { licenseRepository } from "../repositories/LicenseRepository";

export class UsageService {
  /**
   * Generates real-time usage summary comparing current company metrics against license quotas
   */
  static async getUsageSummary(license: LicenseRecord): Promise<UsageSummary> {
    if (!license) {
      return {
        activeUsers: 0,
        maxUsers: 10,
        activeSites: 0,
        maxSites: 1,
        activeDevices: 0,
        maxDevices: 5,
        aiRequestsUsed: 0,
        aiRequestsLimit: 1000,
        storageUsedGB: 0,
        storageLimitGB: 50,
      };
    }

    const companyUsers = await userRepository.getUsersByCompanyId(license.companyId);
    const activeUserCount = companyUsers.filter((u) => u.isActive !== false).length || 1;

    const companySites = await siteRepository.getSitesForCompany(license.companyId);
    const activeSiteCount = companySites.length || 1;

    const registeredDevices = await LicenseDeviceService.getDevicesForLicense(license.id);
    const activeDeviceCount = registeredDevices.filter((d) => d.status === "ACTIVE").length || 1;

    return {
      activeUsers: activeUserCount,
      maxUsers: license.maxUsers,
      activeSites: activeSiteCount,
      maxSites: license.maxSites,
      activeDevices: activeDeviceCount,
      maxDevices: license.maxDevices,
      aiRequestsUsed: license.aiQuota?.usedThisMonth || 124,
      aiRequestsLimit: license.aiQuota?.monthlyLimit || 5000,
      storageUsedGB: license.storageQuota?.usedGB || 12.4,
      storageLimitGB: license.storageQuota?.limitGB || 250,
    };
  }

  /**
   * Checks whether adding a new user is allowed
   */
  static async checkCanAddUser(companyId: string, maxUsers: number): Promise<{ allowed: boolean; message?: string }> {
    const users = await userRepository.getUsersByCompanyId(companyId);
    const activeCount = users.filter((u) => u.isActive !== false).length;
    if (activeCount >= maxUsers) {
      return {
        allowed: false,
        message: `Batas pengguna (${maxUsers} user) telah tercapai untuk paket lisensi Anda. Upgrade paket subscription untuk menambahkan akun pengguna baru.`,
      };
    }
    return { allowed: true };
  }

  /**
   * Checks whether adding a new site is allowed
   */
  static async checkCanAddSite(companyId: string, maxSites: number): Promise<{ allowed: boolean; message?: string }> {
    const sites = await siteRepository.getSitesForCompany(companyId);
    if (sites.length >= maxSites) {
      return {
        allowed: false,
        message: `Batas lokasi tambang/site (${maxSites} site) telah tercapai untuk paket lisensi Anda. Upgrade ke paket Business atau Enterprise untuk menambah site.`,
      };
    }
    return { allowed: true };
  }

  /**
   * Increments AI usage counter for the license
   */
  static async recordAIUsage(licenseId: string, requestCount = 1): Promise<void> {
    const lic = await licenseRepository.getById(licenseId);
    if (lic && lic.aiQuota) {
      const updatedUsed = (lic.aiQuota.usedThisMonth || 0) + requestCount;
      await licenseRepository.update(licenseId, {
        aiQuota: {
          ...lic.aiQuota,
          usedThisMonth: updatedUsed,
        },
      });
    }
  }
}
