// MINE SMART AI - Multi-Company, Holding & Tenant Isolation Types Definition

import { BaseEntity, Company, Site, LicensePlan } from "./index";

export type CommodityType = "COAL" | "NICKEL" | "GOLD_COPPER" | "BAUXITE" | "TIN" | "IRON_ORE" | "LIMESTONE";

export type TenantScopeLevel = "HOLDING" | "COMPANY" | "SITE";

export interface HoldingGroup extends BaseEntity {
  code: string;
  legalName: string;
  displayName: string;
  groupCode: string;
  tagline: string;
  headquarters: string;
  presidentDirector: string;
  chiefFinancialOfficer: string;
  totalCompanies: number;
  totalSites: number;
  totalConcessionHa: number;
  commodities: CommodityType[];
  currency: string;
  consolidationStatus: "ACTIVE" | "IN_REVIEW";
  establishedYear: number;
  annualRevenueTargetIDR: number;
  stockTicker?: string;
}

export interface MultiCompanyEntity extends Company {
  holdingId: string;
  commodity: CommodityType;
  commodityLabel: string;
  iupNumber: string;
  iupExpiryDate: string;
  concessionAreaHa: number;
  operatingSitesCount: number;
  totalEmployees: number;
  annualProductionTargetMT: number;
  smelterFacility?: boolean;
  colorTheme: string;
  badgeLabel: string;
  isolationKey: string;
  dataIsolationStatus: "STRICT_ISOLATED" | "CONSOLIDATING";
}

export interface MultiSiteEntity extends Site {
  holdingId: string;
  companyName: string;
  commodity: CommodityType;
  concessionAreaHa: number;
  pitCount: number;
  fleetCount: number;
  dailyProductionTargetMT: number;
  monthlyRevenueTargetIDR: number;
  k3SafetyIndex: number;
  isoCertifications: string[];
}

export interface HoldingConsolidatedKPIs {
  totalCoalProductionMT: number;
  totalNickelOreWMT: number;
  totalGoldProductionOz: number;
  totalOverburdenBCM: number;
  totalConsolidatedRevenueIDR: number;
  totalConsolidatedCostIDR: number;
  consolidatedEbitdaMarginPct: number;
  totalActiveFleetCount: number;
  groupFleetPhysicalAvailabilityPA: number;
  groupHseLostTimeIncidents: number;
  totalConcessionHa: number;
  totalActiveWorkforce: number;
  esgComplianceScore: number;
  rkabApprovalProgressPct: number;
}

export interface CompanyContributionSummary {
  companyId: string;
  companyName: string;
  commodity: CommodityType;
  commodityLabel: string;
  revenueIDR: number;
  revenueSharePct: number;
  productionActualMT: number;
  productionTargetMT: number;
  achievementPct: number;
  fleetCount: number;
  sitesCount: number;
  hseIncidentFreeDays: number;
  isolationVerificationStatus: "SECURE" | "WARNING";
}

export interface TenantIsolationAuditRecord {
  id: string;
  timestamp: string;
  accessingUserEmail: string;
  userRole: string;
  targetCompanyId: string;
  targetCompanyName: string;
  requestedModule: string;
  queryFilterApplied: string;
  isolationResult: "ISOLATED_PASS" | "CROSS_TENANT_DENIED" | "HOLDING_ROLLUP_AUTHORIZED";
  latencyMs: number;
  ipAddress: string;
}

export interface UserTenantAccessMatrix {
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  accessibleScope: TenantScopeLevel;
  holdingAccess: boolean;
  allowedCompanyIds: string[];
  allowedSiteIds: string[];
  defaultCompanyId: string;
  defaultSiteId: string;
}
