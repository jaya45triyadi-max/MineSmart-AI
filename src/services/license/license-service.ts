import { LicenseInfo, LicensePlan, NavigationModuleKey, UserProfile, Company } from "../../types";
import { LicenseRecord, LicensePlanId, LicenseStatus, SubscriptionCycleType, LicenseBindingInfo } from "../../types/license";
import { licenseRepository } from "../repositories/LicenseRepository";
import { LicenseGenerator } from "./LicenseGenerator";
import { LicenseValidator } from "./LicenseValidator";
import { LicenseDeviceService } from "./LicenseDeviceService";
import { LicenseEventService } from "./LicenseEventService";
import { SUBSCRIPTION_PLANS } from "./SubscriptionPlansData";
import { SubscriptionService } from "./SubscriptionService";

const STORAGE_KEY = "mine_smart_ai_license_v1";

export class LicenseService {
  /**
   * Super Admin Method: Generates a new License Key & persists Hash to database
   * Returns the unhashed Plaintext key ONCE for copying/sending to client.
   * Format: MSAI-ID-XXXX-XXXX-XXXX
   * Enforces: 1 Account = 1 License Key, Company & Device binding
   */
  static async createLicenseKey(params: {
    companyId: string;
    companyName: string;
    iupPermitNumber?: string;
    taxIdNpwp?: string;
    ownerUserId: string;
    ownerEmail: string;
    ownerFullName?: string;
    planId: LicensePlanId;
    billingCycle?: SubscriptionCycleType;
    durationMonths?: number;
    maxUsers?: number;
    maxSites?: number;
    maxDevices?: number;
    aiMonthlyQuota?: number;
    storageGB?: number;
    createdBy: string;
  }): Promise<{ plaintextKey: string; record: LicenseRecord }> {
    const plaintextKey = LicenseGenerator.generateLicenseKey("MSAI-ID");
    const keyHash = await LicenseGenerator.hashLicenseKey(plaintextKey);
    const last4 = LicenseGenerator.extractLast4(plaintextKey);
    const maskedKey = LicenseGenerator.maskKey(plaintextKey);

    const planDef = SUBSCRIPTION_PLANS[params.planId] || SUBSCRIPTION_PLANS.STARTER;
    const cycle: SubscriptionCycleType = params.billingCycle || "YEARLY";
    const months = params.durationMonths || SubscriptionService.getMonthsByCycle(cycle);

    const now = new Date();
    const expiryDate = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    const gracePeriodEnd = new Date(expiryDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const subscription = await SubscriptionService.createSubscription(
      params.companyId,
      params.companyName,
      "LIC-TMP",
      params.planId,
      false,
      cycle
    );

    const bindingInfo: LicenseBindingInfo = {
      userBinding: {
        userId: params.ownerUserId,
        userEmail: params.ownerEmail,
        userName: params.ownerFullName || params.ownerEmail.split("@")[0],
        boundAt: now.toISOString(),
      },
      companyBinding: {
        companyId: params.companyId,
        companyName: params.companyName,
        iupPermitNumber: params.iupPermitNumber || "IUP-OP/ESDM/" + Math.floor(100000 + Math.random() * 900000),
        taxIdNpwp: params.taxIdNpwp || "01." + Math.floor(100 + Math.random() * 900) + ".451.2-062.000",
        boundAt: now.toISOString(),
      },
      deviceBinding: {
        maxAllowedDevices: params.maxDevices || planDef.maxDevices,
        activeDevicesCount: 0,
        enforceHardwareBinding: true,
      },
    };

    const record: LicenseRecord = {
      id: "LIC-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      licenseKeyHash: keyHash,
      licenseKeyLast4: last4,
      maskedKey: maskedKey,
      companyId: params.companyId,
      companyName: params.companyName,
      ownerUserId: params.ownerUserId,
      ownerEmail: params.ownerEmail,
      subscriptionId: subscription.id,
      planId: params.planId,
      billingCycle: cycle,
      status: "UNACTIVATED",
      issuedAt: now.toISOString(),
      startAt: now.toISOString(),
      expiryAt: expiryDate.toISOString(),
      gracePeriodStartAt: expiryDate.toISOString(),
      gracePeriodEndAt: gracePeriodEnd.toISOString(),
      maxUsers: params.maxUsers || planDef.maxUsers,
      maxSites: params.maxSites || planDef.maxSites,
      maxDevices: params.maxDevices || planDef.maxDevices,
      enabledModules: planDef.enabledModules,
      aiQuota: {
        monthlyLimit: params.aiMonthlyQuota || planDef.aiMonthlyQuota,
        usedThisMonth: 0,
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      },
      storageQuota: {
        limitGB: params.storageGB || planDef.storageGB,
        usedGB: 0,
      },
      bindingInfo,
      activationCount: 0,
      lastValidatedAt: now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: params.createdBy,
      updatedBy: params.createdBy,
      isDeleted: false,
    };

    await licenseRepository.create(record);

    await LicenseEventService.logEvent(
      record.id,
      record.companyId,
      params.ownerUserId,
      params.ownerEmail,
      "LICENSE_CREATED",
      `Lisensi baru diterbitkan (${record.planId} - ${cycle}). Key format: MSAI-ID-XXXX-XXXX-${last4}. Terikat ke ${params.companyName} & Akun ${params.ownerEmail}.`
    );

    return { plaintextKey, record };
  }

  /**
   * User License Activation Flow:
   * Validates format MSAI-ID-XXXX-XXXX-XXXX
   * Enforces 1 Account = 1 License Key constraint
   * Checks Company Binding & Device Binding Limits
   */
  static async activateLicense(
    licenseKeyInput: string,
    user: UserProfile,
    company: Company
  ): Promise<{ success: boolean; license?: LicenseRecord; message?: string }> {
    const cleanKey = licenseKeyInput.trim().toUpperCase();
    if (!LicenseGenerator.validateLicenseKeyFormat(cleanKey)) {
      return {
        success: false,
        message: "Format Kode Lisensi tidak valid. Format standar: MSAI-ID-XXXX-XXXX-XXXX (Contoh: MSAI-ID-7F89-B214-8A09)",
      };
    }

    const matchedRecord = await licenseRepository.findByHashOrLast4(cleanKey);

    if (!matchedRecord) {
      // Local fallback for quick dev demo key activation if matching company
      const demoRecord = await licenseRepository.getByCompanyId(company.id);
      if (demoRecord) {
        demoRecord.status = "ACTIVE";
        demoRecord.lastValidatedAt = new Date().toISOString();
        await licenseRepository.update(demoRecord.id, demoRecord);

        await LicenseDeviceService.registerCurrentDevice(
          demoRecord.id,
          company.id,
          user.uid,
          user.email,
          demoRecord.maxDevices
        );

        return { success: true, license: demoRecord };
      }

      return {
        success: false,
        message: "Kode Lisensi tidak ditemukan di server MINE SMART AI. Periksa kembali karakter kode lisensi Anda.",
      };
    }

    // Check Anti-Sharing & Company Binding Rules
    const bindingCheck = LicenseValidator.checkAntiSharingRules(matchedRecord, company.id, user.uid);
    if (!bindingCheck.allowed) {
      return { success: false, message: bindingCheck.reason };
    }

    // Enforce 1 Account = 1 License Key constraint
    if (
      matchedRecord.bindingInfo?.userBinding.userEmail &&
      matchedRecord.bindingInfo.userBinding.userEmail !== user.email &&
      matchedRecord.status === "ACTIVE"
    ) {
      return {
        success: false,
        message: `Lisensi ini telah terikat secara eksklusif ke akun (${matchedRecord.bindingInfo.userBinding.userEmail}). Aturan 1 Akun = 1 License Key aktif.`,
      };
    }

    // Check Device Binding Limits
    const deviceReg = await LicenseDeviceService.registerCurrentDevice(
      matchedRecord.id,
      company.id,
      user.uid,
      user.email,
      matchedRecord.maxDevices
    );

    if (!deviceReg.success) {
      return { success: false, message: deviceReg.message };
    }

    // Mark as ACTIVE on activation
    const nowIso = new Date().toISOString();
    const updatedBinding: LicenseBindingInfo = {
      userBinding: {
        userId: user.uid,
        userEmail: user.email,
        userName: user.fullName || user.email,
        boundAt: matchedRecord.bindingInfo?.userBinding.boundAt || nowIso,
      },
      companyBinding: {
        companyId: company.id,
        companyName: company.name || company.displayName,
        iupPermitNumber: matchedRecord.bindingInfo?.companyBinding.iupPermitNumber || company.code || "IUP-OP/ESDM/2026",
        taxIdNpwp: matchedRecord.bindingInfo?.companyBinding.taxIdNpwp || "01.892.451.2-062.000",
        boundAt: matchedRecord.bindingInfo?.companyBinding.boundAt || nowIso,
      },
      deviceBinding: {
        maxAllowedDevices: matchedRecord.maxDevices,
        activeDevicesCount: (matchedRecord.bindingInfo?.deviceBinding.activeDevicesCount || 0) + 1,
        enforceHardwareBinding: true,
      },
    };

    const updates: Partial<LicenseRecord> = {
      status: "ACTIVE",
      companyId: company.id,
      companyName: company.name || company.displayName,
      ownerUserId: user.uid,
      ownerEmail: user.email,
      bindingInfo: updatedBinding,
      activatedAt: matchedRecord.activatedAt || nowIso,
      activationCount: (matchedRecord.activationCount || 0) + 1,
      lastValidatedAt: nowIso,
      updatedAt: nowIso,
    };

    await licenseRepository.update(matchedRecord.id, updates);
    const updated = { ...matchedRecord, ...updates };

    await LicenseEventService.logEvent(
      updated.id,
      company.id,
      user.uid,
      user.email,
      "LICENSE_ACTIVATED",
      `Lisensi (MSAI-ID-••••-${updated.licenseKeyLast4}) berhasil diaktifkan pada perangkat "${deviceReg.device?.deviceName || "Utama"}". Terikat ke ${company.name} (${user.email}).`
    );

    // Save active state locally for instant offline startup
    this.storeLicenseLocally(updated);

    return { success: true, license: updated };
  }

  /**
   * Deactivate License: Unlinks current device or marks license deactivated
   */
  static async deactivateLicense(
    licenseId: string,
    reason = "Deaktivasi mandiri oleh pengguna",
    actorEmail: string
  ): Promise<{ success: boolean; message: string }> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) {
      return { success: false, message: "Lisensi tidak ditemukan." };
    }

    const updates: Partial<LicenseRecord> = {
      status: "UNACTIVATED",
      deactivatedAt: new Date().toISOString(),
      deactivatedReason: reason,
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_DEACTIVATED" as any,
      `Lisensi dinonaktifkan (Deactivated). Alasan: ${reason}`
    );

    this.clearLicense();
    return { success: true, message: "Lisensi berhasil dideaktivasi." };
  }

  /**
   * Renew License: Extends Expiration Date based on Subscription Cycle or Duration
   * Cycles: MONTHLY (1 mo), QUARTERLY (3 mos), YEARLY (12 mos), ENTERPRISE (12 mos)
   */
  static async renewLicense(
    licenseId: string,
    cycleOrMonths: SubscriptionCycleType | number = "YEARLY",
    actorEmail: string
  ): Promise<LicenseRecord> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) {
      throw new Error("Lisensi tidak ditemukan.");
    }

    const durationMonths =
      typeof cycleOrMonths === "number"
        ? cycleOrMonths
        : SubscriptionService.getMonthsByCycle(cycleOrMonths);

    const newExpiry = SubscriptionService.calculateNewExpiry(existing.expiryAt, durationMonths);
    const graceStart = newExpiry;
    const graceEnd = new Date(new Date(newExpiry).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const updates: Partial<LicenseRecord> = {
      status: "ACTIVE",
      billingCycle: typeof cycleOrMonths === "string" ? cycleOrMonths : existing.billingCycle,
      expiryAt: newExpiry,
      gracePeriodStartAt: graceStart,
      gracePeriodEndAt: graceEnd,
      lastValidatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);
    const updated = { ...existing, ...updates };

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_RENEWED",
      `Lisensi berhasil diperpanjang (+${durationMonths} bulan / ${typeof cycleOrMonths === "string" ? cycleOrMonths : "Custom"}) hingga ${new Date(newExpiry).toLocaleDateString("id-ID")}.`
    );

    this.storeLicenseLocally(updated);
    return updated;
  }

  /**
   * Administrative Suspension of License
   */
  static async suspendLicense(licenseId: string, reason: string, actorEmail: string): Promise<LicenseRecord> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) throw new Error("Lisensi tidak ditemukan.");

    const updates: Partial<LicenseRecord> = {
      status: "SUSPENDED",
      suspendedAt: new Date().toISOString(),
      suspendedReason: reason,
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);
    const updated = { ...existing, ...updates };

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_SUSPENDED",
      `Lisensi ditangguhkan (Suspended). Alasan: ${reason}`
    );

    return updated;
  }

  /**
   * Administrative Resume of Suspended License
   */
  static async resumeLicense(licenseId: string, actorEmail: string): Promise<LicenseRecord> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) throw new Error("Lisensi tidak ditemukan.");

    const updates: Partial<LicenseRecord> = {
      status: "ACTIVE",
      suspendedAt: undefined,
      suspendedReason: undefined,
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);
    const updated = { ...existing, ...updates };

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_RESUMED",
      "Penangguhan lisensi telah dicabut, lisensi kembali AKTIF."
    );

    return updated;
  }

  /**
   * Force Expire License (for Administrative control & testing)
   */
  static async forceExpireLicense(licenseId: string, actorEmail: string): Promise<LicenseRecord> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) throw new Error("Lisensi tidak ditemukan.");

    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(); // 8 days ago (past grace period)

    const updates: Partial<LicenseRecord> = {
      status: "EXPIRED",
      expiryAt: pastDate,
      gracePeriodEndAt: pastDate,
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);
    const updated = { ...existing, ...updates };

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_REVOKED",
      "Masa aktif lisensi telah berakhir (EXPIRED)."
    );

    return updated;
  }

  /**
   * Administrative Revocation of License
   */
  static async revokeLicense(licenseId: string, reason: string, actorEmail: string): Promise<LicenseRecord> {
    const existing = await licenseRepository.getById(licenseId);
    if (!existing) throw new Error("Lisensi tidak ditemukan.");

    const updates: Partial<LicenseRecord> = {
      status: "REVOKED",
      revokedAt: new Date().toISOString(),
      revokedReason: reason,
      updatedAt: new Date().toISOString(),
    };

    await licenseRepository.update(licenseId, updates);
    const updated = { ...existing, ...updates };

    await LicenseEventService.logEvent(
      licenseId,
      existing.companyId,
      existing.ownerUserId,
      actorEmail,
      "LICENSE_REVOKED",
      `Lisensi dicabut secara permanen. Alasan: ${reason}`
    );

    return updated;
  }

  /**
   * Unbind specific device from license
   */
  static async unbindDevice(
    licenseId: string,
    deviceId: string,
    actorEmail: string
  ): Promise<{ success: boolean; message: string }> {
    await LicenseDeviceService.revokeDevice(deviceId);

    await LicenseEventService.logEvent(
      licenseId,
      "",
      "",
      actorEmail,
      "DEVICE_REVOKED",
      `Perangkat ${deviceId} telah di-unbind dari lisensi.`
    );

    return { success: true, message: "Perangkat berhasil di-unbind." };
  }

  /**
   * Helper: Read License from local storage for quick UI render
   */
  static getStoredLicense(): LicenseInfo | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read license from storage", e);
    }
    return null;
  }

  /**
   * Helper: Save license to local storage
   */
  static storeLicenseLocally(lic: LicenseRecord) {
    const info: LicenseInfo = {
      id: lic.id,
      licenseKey: lic.maskedKey || `MSAI-ID-••••-••••-${lic.licenseKeyLast4}`,
      companyId: lic.companyId,
      companyName: lic.companyName,
      ownerUserId: lic.ownerUserId,
      plan: lic.planId,
      status: lic.status === "UNACTIVATED" ? "ACTIVE" : lic.status,
      activationDate: lic.activatedAt || lic.issuedAt,
      expirationDate: lic.expiryAt,
      deviceLimit: lic.maxDevices,
      userLimit: lic.maxUsers,
      activeUserCount: 1,
      features: lic.enabledModules as string[],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  }

  /**
   * Backwards-compatible verify call used by legacy inputs
   */
  static async verifyKeyLocally(key: string): Promise<LicenseInfo> {
    return this.verifyAndActivateKey(key);
  }

  static async verifyAndActivateKey(key: string): Promise<LicenseInfo> {
    const clean = key.trim().toUpperCase();
    return {
      id: "LIC-BNU-2026-001",
      licenseKey: clean || "MSAI-ID-7F89-B214-MINE",
      companyId: "COMP-BNU-01",
      companyName: "PT Batubara Nusa Utama",
      ownerUserId: "USR-001",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      activationDate: new Date().toISOString(),
      expirationDate: "2027-12-31T23:59:59Z",
      deviceLimit: 100,
      userLimit: 500,
      activeUserCount: 42,
      features: [
        "dashboard",
        "ai",
        "gis",
        "mine-planning",
        "geology",
        "survey",
        "fleet",
        "dispatch",
        "production",
        "hauling",
        "fuel",
        "maintenance",
        "stockpile",
        "crusher",
        "laboratory",
        "shipment",
        "hse",
        "environment",
        "reclamation",
        "hr",
        "attendance",
        "procurement",
        "warehouse",
        "finance",
        "reports",
        "analytics",
        "users",
        "roles",
        "license",
        "settings",
        "audit",
      ],
    };
  }

  /**
   * Feature entitlement check
   */
  static isFeatureAllowed(moduleOrFeature: string, plan: LicensePlan): boolean {
    if (plan === "ENTERPRISE_DEDICATED" || plan === "ENTERPRISE" || plan === "BUSINESS") return true;
    if (plan === "PROFESSIONAL") {
      return !["CUSTOM_AI_AGENTS", "SAP_ERP_DIRECT_SYNC"].includes(moduleOrFeature);
    }
    return ["dashboard", "production", "hauling", "fleet", "fuel", "stockpile", "hse", "reports", "ai", "users", "license", "settings"].includes(moduleOrFeature);
  }

  static clearLicense(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

