import { SubscriptionRecord, LicensePlanId, SubscriptionCycleType } from "../../types/license";
import { SUBSCRIPTION_PLANS } from "./SubscriptionPlansData";
import { BaseRepository } from "../repositories/BaseRepository";

class SubscriptionRepository extends BaseRepository<SubscriptionRecord> {
  constructor() {
    super("subscriptions", []);
  }

  async getByCompanyId(companyId: string): Promise<SubscriptionRecord | null> {
    const all = await this.getAll();
    const found = all.find((s) => s.companyId === companyId);
    return found || null;
  }
}

export const subscriptionRepository = new SubscriptionRepository();

export class SubscriptionService {
  /**
   * Retrieves subscription definition details for a plan
   */
  static getPlanDef(planId: LicensePlanId) {
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.STARTER;
  }

  /**
   * Helper to get duration months by cycle
   */
  static getMonthsByCycle(cycle: SubscriptionCycleType): number {
    switch (cycle) {
      case "MONTHLY":
        return 1;
      case "QUARTERLY":
        return 3;
      case "YEARLY":
        return 12;
      case "ENTERPRISE":
        return 12;
      default:
        return 12;
    }
  }

  /**
   * Helper to calculate amount based on plan & cycle
   */
  static getCycleAmountIDR(planId: LicensePlanId, cycle: SubscriptionCycleType): number {
    const plan = this.getPlanDef(planId);
    switch (cycle) {
      case "MONTHLY":
        return plan.priceMonthlyIDR;
      case "QUARTERLY":
        return plan.priceQuarterlyIDR;
      case "YEARLY":
        return plan.priceAnnualIDR;
      case "ENTERPRISE":
        return plan.priceEnterpriseIDR;
      default:
        return plan.priceAnnualIDR;
    }
  }

  /**
   * Creates initial trial or paid subscription for a company
   */
  static async createSubscription(
    companyId: string,
    companyName: string,
    licenseId: string,
    planId: LicensePlanId,
    isTrial = false,
    billingCycle: SubscriptionCycleType = "YEARLY"
  ): Promise<SubscriptionRecord> {
    const amount = this.getCycleAmountIDR(planId, billingCycle);
    const months = this.getMonthsByCycle(billingCycle);
    const now = new Date();
    const endDate = isTrial
      ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
      : new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    const newSub: SubscriptionRecord = {
      id: "SUB-" + Date.now(),
      companyId,
      companyName,
      licenseId,
      planId,
      billingCycle,
      status: isTrial ? "TRIAL" : "ACTIVE",
      amountIDR: amount,
      startAt: now.toISOString(),
      currentPeriodStartAt: now.toISOString(),
      currentPeriodEndAt: endDate.toISOString(),
      autoRenew: true,
      trialStartAt: isTrial ? now.toISOString() : undefined,
      trialEndAt: isTrial ? endDate.toISOString() : undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await subscriptionRepository.create(newSub);
    return newSub;
  }

  /**
   * Calculates new expiration date preserved from current expiry
   */
  static calculateNewExpiry(currentExpiryIso: string, durationMonths = 12): string {
    const now = new Date();
    const currentExpiry = new Date(currentExpiryIso);

    // If current expiry is in the future, extend from current expiry
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + durationMonths);
    return newDate.toISOString();
  }

  /**
   * Validates if plan downgrade is allowed based on current active user and site usage
   */
  static validateDowngradeAllowed(
    currentActiveUsers: number,
    currentActiveSites: number,
    targetPlanId: LicensePlanId
  ): { allowed: boolean; reason?: string } {
    const targetPlan = this.getPlanDef(targetPlanId);

    if (currentActiveUsers > targetPlan.maxUsers) {
      return {
        allowed: false,
        reason: `Gagal Downgrade: Jumlah pengguna aktif saat ini (${currentActiveUsers} user) melebihi batas maksimum paket ${targetPlan.displayName} (${targetPlan.maxUsers} user). Kurangi jumlah pengguna terlebih dahulu.`,
      };
    }

    if (currentActiveSites > targetPlan.maxSites) {
      return {
        allowed: false,
        reason: `Gagal Downgrade: Jumlah lokasi tambang/site aktif (${currentActiveSites} site) melebihi batas maksimum paket ${targetPlan.displayName} (${targetPlan.maxSites} site).`,
      };
    }

    return { allowed: true };
  }
}
