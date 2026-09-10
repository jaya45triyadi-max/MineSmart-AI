import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import {
  LicenseRecord,
  SubscriptionRecord,
  SubscriptionPlanDef,
  LicenseDeviceRecord,
  UsageSummary,
  LicenseStatus,
  LicenseAuditEvent,
} from "../types/license";
import { NavigationModuleKey } from "../types";
import { licenseRepository, INITIAL_DEMO_LICENSES } from "../services/repositories/LicenseRepository";
import { subscriptionRepository } from "../services/license/SubscriptionService";
import { LicenseValidator } from "../services/license/LicenseValidator";
import { LicenseDeviceService } from "../services/license/LicenseDeviceService";
import { LicenseService } from "../services/license/license-service";
import { SubscriptionService } from "../services/license/SubscriptionService";
import { UsageService } from "../services/license/UsageService";
import { LicenseEventService } from "../services/license/LicenseEventService";

interface LicenseContextType {
  licenseLoading: boolean;
  currentLicense: LicenseRecord;
  currentSubscription: SubscriptionRecord | null;
  currentPlanDef: SubscriptionPlanDef;
  usageSummary: UsageSummary;
  boundDevices: LicenseDeviceRecord[];
  auditEvents: LicenseAuditEvent[];
  calculatedStatus: LicenseStatus;
  daysRemaining: number;
  isGracePeriod: boolean;
  isExpired: boolean;
  isSuspended: boolean;
  isRevoked: boolean;
  checkEntitlement: (moduleKey: NavigationModuleKey) => boolean;
  activateLicense: (keyInput: string) => Promise<{ success: boolean; message?: string }>;
  renewLicense: (months?: number) => Promise<boolean>;
  revokeDevice: (deviceId: string) => Promise<boolean>;
  refreshLicenseData: () => Promise<void>;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { company, currentUser } = useAuth();

  const [licenseLoading, setLicenseLoading] = useState<boolean>(true);
  const [currentLicense, setCurrentLicense] = useState<LicenseRecord>(INITIAL_DEMO_LICENSES[0]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionRecord | null>(null);
  const [boundDevices, setBoundDevices] = useState<LicenseDeviceRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<LicenseAuditEvent[]>([]);
  const [usageSummary, setUsageSummary] = useState<UsageSummary>({
    activeUsers: 42,
    maxUsers: 500,
    activeSites: 2,
    maxSites: 10,
    activeDevices: 3,
    maxDevices: 100,
    aiRequestsUsed: 1240,
    aiRequestsLimit: 100000,
    storageUsedGB: 142.5,
    storageLimitGB: 5000,
  });

  const loadData = useCallback(async () => {
    setLicenseLoading(true);
    try {
      let lic = await licenseRepository.getByCompanyId(company.id);
      if (!lic) {
        lic = INITIAL_DEMO_LICENSES[0];
      }
      setCurrentLicense(lic);

      // Load Subscription
      let sub = await subscriptionRepository.getByCompanyId(company.id);
      if (!sub) {
        sub = await SubscriptionService.createSubscription(
          company.id,
          company.name || company.displayName,
          lic.id,
          lic.planId,
          false
        );
      }
      setCurrentSubscription(sub);

      // Load Registered Devices & Register Current Device
      await LicenseDeviceService.registerCurrentDevice(
        lic.id,
        company.id,
        currentUser.uid,
        currentUser.email,
        lic.maxDevices
      );

      const devs = await LicenseDeviceService.getDevicesForLicense(lic.id);
      setBoundDevices(devs);

      // Load Audit Events
      const evts = await LicenseEventService.getLicenseAuditTrail(lic.id);
      setAuditEvents(evts);

      // Load Usage
      const usage = await UsageService.getUsageSummary(lic);
      setUsageSummary(usage);
    } catch (err) {
      console.error("Error loading license provider state:", err);
    } finally {
      setLicenseLoading(false);
    }
  }, [company.id, company.name, company.displayName, currentUser.uid, currentUser.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentPlanDef = SubscriptionService.getPlanDef(currentLicense.planId);
  const calculatedStatus = LicenseValidator.evaluateLicenseStatus(currentLicense);

  const expiry = new Date(currentLicense.expiryAt);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const isGracePeriod = calculatedStatus === "GRACE_PERIOD";
  const isExpired = calculatedStatus === "EXPIRED";
  const isSuspended = calculatedStatus === "SUSPENDED";
  const isRevoked = calculatedStatus === "REVOKED";

  const checkEntitlement = (moduleKey: NavigationModuleKey): boolean => {
    return LicenseValidator.validateEntitlement(currentLicense, moduleKey);
  };

  const activateLicense = async (keyInput: string) => {
    const res = await LicenseService.activateLicense(keyInput, currentUser, company);
    if (res.success && res.license) {
      setCurrentLicense(res.license);
      await loadData();
    }
    return res;
  };

  const renewLicense = async (months = 12) => {
    try {
      const updated = await LicenseService.renewLicense(currentLicense.id, months, currentUser.email);
      setCurrentLicense(updated);
      await loadData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const revokeDevice = async (deviceId: string) => {
    const ok = await LicenseDeviceService.revokeDevice(deviceId);
    if (ok) {
      await LicenseEventService.logEvent(
        currentLicense.id,
        company.id,
        currentUser.uid,
        currentUser.email,
        "DEVICE_REVOKED",
        `Perangkat #${deviceId} dicabut oleh user/admin.`
      );
      await loadData();
    }
    return ok;
  };

  return (
    <LicenseContext.Provider
      value={{
        licenseLoading,
        currentLicense,
        currentSubscription,
        currentPlanDef,
        usageSummary,
        boundDevices,
        auditEvents,
        calculatedStatus,
        daysRemaining,
        isGracePeriod,
        isExpired,
        isSuspended,
        isRevoked,
        checkEntitlement,
        activateLicense,
        renewLicense,
        revokeDevice,
        refreshLicenseData: loadData,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error("useLicense must be used within a LicenseProvider");
  }
  return context;
};
