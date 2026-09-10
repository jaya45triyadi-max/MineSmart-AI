import { BaseRepository } from "./BaseRepository";
import { LicenseRecord } from "../../types/license";
import { LicenseGenerator } from "../license/LicenseGenerator";

export const INITIAL_DEMO_LICENSES: LicenseRecord[] = [
  {
    id: "LIC-BNU-2026-001",
    companyId: "COMP-BNU-01",
    companyName: "PT Batubara Nusa Utama",
    ownerUserId: "USR-001",
    ownerEmail: "jaya45triyadi@gmail.com",
    subscriptionId: "SUB-BNU-2026",
    planId: "ENTERPRISE",
    billingCycle: "YEARLY",
    status: "ACTIVE",
    licenseKeyHash: "sha256_demo_enterprise_bnu_2026",
    licenseKeyLast4: "MINE",
    maskedKey: "MSAI-ID-••••-••••-MINE",
    issuedAt: "2026-01-01T00:00:00Z",
    activatedAt: "2026-01-01T08:00:00Z",
    startAt: "2026-01-01T00:00:00Z",
    expiryAt: "2027-12-31T23:59:59Z",
    gracePeriodStartAt: "2027-12-31T23:59:59Z",
    gracePeriodEndAt: "2028-01-07T23:59:59Z",
    maxUsers: 500,
    maxSites: 10,
    maxDevices: 100,
    bindingInfo: {
      userBinding: {
        userId: "USR-001",
        userEmail: "jaya45triyadi@gmail.com",
        userName: "Ir. Hendra Gunawan (Mine Manager/KTT)",
        boundAt: "2026-01-01T08:00:00Z",
      },
      companyBinding: {
        companyId: "COMP-BNU-01",
        companyName: "PT Batubara Nusa Utama",
        iupPermitNumber: "IUP-OP/540/MINERBA/2022",
        taxIdNpwp: "01.892.451.2-062.000",
        boundAt: "2026-01-01T08:00:00Z",
      },
      deviceBinding: {
        maxAllowedDevices: 100,
        activeDevicesCount: 3,
        enforceHardwareBinding: true,
      },
    },
    enabledModules: [
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
    aiQuota: {
      monthlyLimit: 100000,
      usedThisMonth: 1240,
      resetDate: "2026-09-01T00:00:00Z",
    },
    storageQuota: {
      limitGB: 5000,
      usedGB: 142.5,
    },
    activationCount: 1,
    lastValidatedAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    createdBy: "SUPER_ADMIN",
    updatedBy: "SYSTEM",
    isDeleted: false,
  },
];

export class LicenseRepository extends BaseRepository<LicenseRecord> {
  constructor() {
    super("licenses", INITIAL_DEMO_LICENSES);
  }

  async getByCompanyId(companyId: string): Promise<LicenseRecord | null> {
    const all = await this.getAll();
    const found = all.find((l) => l.companyId === companyId && !l.isDeleted);
    return found || null;
  }

  async getByOwnerUserId(userId: string): Promise<LicenseRecord | null> {
    const all = await this.getAll();
    const found = all.find((l) => (l.ownerUserId === userId || l.bindingInfo?.userBinding.userId === userId) && !l.isDeleted);
    return found || null;
  }

  async findByHashOrLast4(key: string): Promise<LicenseRecord | null> {
    const all = await this.getAll();
    const clean = key.trim().toUpperCase();
    const keyHash = await LicenseGenerator.hashLicenseKey(clean);
    const last4 = LicenseGenerator.extractLast4(clean);

    const match = all.find(
      (l) =>
        l.licenseKeyHash === keyHash ||
        l.licenseKeyLast4 === last4 ||
        l.id === clean ||
        (l.maskedKey && l.maskedKey.endsWith(last4))
    );
    return match || null;
  }
}

export const licenseRepository = new LicenseRepository();

