import { LicenseRecord, LicenseStatus } from "../../types/license";
import { NavigationModuleKey } from "../../types";

export class LicenseValidator {
  /**
   * Validates state machine transition rules for license status
   */
  static validateLicenseStateTransition(fromState: LicenseStatus, toState: LicenseStatus): boolean {
    const validTransitions: Record<LicenseStatus, LicenseStatus[]> = {
      UNACTIVATED: ["ACTIVE", "REVOKED", "CANCELLED"],
      ACTIVE: ["EXPIRING", "GRACE_PERIOD", "EXPIRED", "SUSPENDED", "REVOKED", "CANCELLED"],
      TRIAL: ["ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"],
      EXPIRING: ["ACTIVE", "GRACE_PERIOD", "EXPIRED", "SUSPENDED", "REVOKED"],
      GRACE_PERIOD: ["ACTIVE", "EXPIRED", "SUSPENDED", "REVOKED"],
      SUSPENDED: ["ACTIVE", "REVOKED", "EXPIRED"],
      EXPIRED: ["ACTIVE", "REVOKED"],
      REVOKED: [], // Terminal state unless administrative recovery
      CANCELLED: ["ACTIVE"],
    };

    return validTransitions[fromState]?.includes(toState) ?? false;
  }

  /**
   * Evaluates real-time calculated license status based on current timestamp
   */
  static evaluateLicenseStatus(license: LicenseRecord): LicenseStatus {
    if (license.status === "REVOKED") return "REVOKED";
    if (license.status === "SUSPENDED") return "SUSPENDED";
    if (license.status === "CANCELLED") return "CANCELLED";
    if (license.status === "UNACTIVATED") return "UNACTIVATED";

    const now = new Date();
    const expiry = new Date(license.expiryAt);

    if (now <= expiry) {
      // Check if within 30 days of expiring
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (expiry.getTime() - now.getTime() <= thirtyDaysMs && license.status === "ACTIVE") {
        return "EXPIRING";
      }
      return license.status === "TRIAL" ? "TRIAL" : "ACTIVE";
    }

    // Past expiryAt - check Grace Period (e.g. 7 days after expiry)
    const graceEnd = license.gracePeriodEndAt
      ? new Date(license.gracePeriodEndAt)
      : new Date(expiry.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (now <= graceEnd) {
      return "GRACE_PERIOD";
    }

    return "EXPIRED";
  }

  /**
   * Validates if a specific module is entitled under current license
   */
  static validateEntitlement(license: LicenseRecord, moduleKey: NavigationModuleKey): boolean {
    if (!license) return false;
    const currentStatus = this.evaluateLicenseStatus(license);

    if (["SUSPENDED", "REVOKED", "CANCELLED", "EXPIRED"].includes(currentStatus)) {
      return false;
    }

    // In GRACE_PERIOD, basic modules are allowed, advanced modules restricted
    if (currentStatus === "GRACE_PERIOD") {
      const graceAllowedModules: NavigationModuleKey[] = ["dashboard", "reports", "settings", "license"];
      return graceAllowedModules.includes(moduleKey);
    }

    return license.enabledModules.includes(moduleKey);
  }

  /**
   * Anti-sharing checks: Company Binding, Account Binding, Status
   */
  static checkAntiSharingRules(
    license: LicenseRecord,
    requestingCompanyId: string,
    requestingUserId: string
  ): { allowed: boolean; reason?: string } {
    if (!license) {
      return { allowed: false, reason: "Lisensi tidak ditemukan." };
    }

    // Company Binding Validation
    if (license.companyId && license.companyId !== requestingCompanyId) {
      return {
        allowed: false,
        reason: `Akses Ditolak: Lisensi ini telah terikat ke Perusahaan (${license.companyName}) dan tidak dapat digunakan oleh Perusahaan Anda.`,
      };
    }

    // Owner Account Binding Validation for UNACTIVATED licenses
    if (license.status === "UNACTIVATED") {
      return { allowed: true }; // Allowed to activate
    }

    // Status check
    const status = this.evaluateLicenseStatus(license);
    if (status === "SUSPENDED") {
      return {
        allowed: false,
        reason: `Akses Ditolak: Lisensi Perusahaan Ditangguhkan (Suspended). Alasan: ${license.suspendedReason || "Pelanggaran Ketentuan Service"}.`,
      };
    }

    if (status === "REVOKED") {
      return {
        allowed: false,
        reason: `Akses Ditolak: Lisensi Perusahaan Telah Dicabut (Revoked). Silakan hubungi tim sales MINE SMART AI.`,
      };
    }

    if (status === "EXPIRED") {
      return {
        allowed: false,
        reason: `Akses Ditolak: Masa aktif lisensi telah berakhir pada ${new Date(license.expiryAt).toLocaleDateString("id-ID")}. Silakan perpanjang lisensi Anda.`,
      };
    }

    return { allowed: true };
  }
}
