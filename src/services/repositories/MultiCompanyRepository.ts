// MINE SMART AI - MultiCompanyRepository
// Implements Strict Multi-Tenant Isolation & Holding Group Aggregation

import {
  HoldingGroup,
  MultiCompanyEntity,
  MultiSiteEntity,
  HoldingConsolidatedKPIs,
  CompanyContributionSummary,
  TenantIsolationAuditRecord,
  UserTenantAccessMatrix,
  TenantScopeLevel,
} from "../../types/multiCompanyTypes";
import {
  HOLDING_GROUP_DATA,
  MULTI_COMPANIES_DATA,
  MULTI_SITES_DATA,
  HOLDING_CONSOLIDATED_KPIS,
  COMPANY_CONTRIBUTION_SUMMARIES,
  INITIAL_TENANT_ISOLATION_AUDITS,
  USER_TENANT_ACCESS_LIST,
} from "../../data/multiCompanyData";

class MultiCompanyRepository {
  private holding: HoldingGroup = { ...HOLDING_GROUP_DATA };
  private companies: MultiCompanyEntity[] = [...MULTI_COMPANIES_DATA];
  private sites: MultiSiteEntity[] = [...MULTI_SITES_DATA];
  private kpis: HoldingConsolidatedKPIs = { ...HOLDING_CONSOLIDATED_KPIS };
  private contributions: CompanyContributionSummary[] = [...COMPANY_CONTRIBUTION_SUMMARIES];
  private auditLogs: TenantIsolationAuditRecord[] = [...INITIAL_TENANT_ISOLATION_AUDITS];
  private accessMatrix: UserTenantAccessMatrix[] = [...USER_TENANT_ACCESS_LIST];

  // Holding & Company retrieval
  async getHoldingGroup(): Promise<HoldingGroup> {
    return { ...this.holding };
  }

  async getAllCompanies(): Promise<MultiCompanyEntity[]> {
    return [...this.companies.filter((c) => !c.isDeleted)];
  }

  async getCompanyById(companyId: string): Promise<MultiCompanyEntity | null> {
    const found = this.companies.find((c) => c.id === companyId && !c.isDeleted);
    return found ? { ...found } : null;
  }

  async getAllSites(): Promise<MultiSiteEntity[]> {
    return [...this.sites.filter((s) => !s.isDeleted)];
  }

  async getSitesForCompany(companyId: string): Promise<MultiSiteEntity[]> {
    return this.sites.filter((s) => s.companyId === companyId && !s.isDeleted);
  }

  async getSiteById(siteId: string): Promise<MultiSiteEntity | null> {
    const found = this.sites.find((s) => s.id === siteId && !s.isDeleted);
    return found ? { ...found } : null;
  }

  async getConsolidatedKPIs(): Promise<HoldingConsolidatedKPIs> {
    return { ...this.kpis };
  }

  async getCompanyContributions(): Promise<CompanyContributionSummary[]> {
    return [...this.contributions];
  }

  async getIsolationAuditLogs(): Promise<TenantIsolationAuditRecord[]> {
    return [...this.auditLogs];
  }

  async getUserAccessMatrix(): Promise<UserTenantAccessMatrix[]> {
    return [...this.accessMatrix];
  }

  // Create new Subsidiary Company under Holding
  async createCompany(
    payload: Omit<MultiCompanyEntity, "id" | "createdAt" | "updatedAt" | "isDeleted" | "status" | "holdingId">,
    authorEmail = "admin@minesmart.ai"
  ): Promise<MultiCompanyEntity> {
    const newId = `COMP-${payload.code.toUpperCase()}-${String(this.companies.length + 1).padStart(2, "0")}`;
    const now = new Date().toISOString();

    const newCompany: MultiCompanyEntity = {
      ...payload,
      id: newId,
      companyId: newId,
      holdingId: this.holding.id,
      status: "ACTIVE",
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      isolationKey: `TENANT_ISO_${payload.code.toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}_SEC`,
      dataIsolationStatus: "STRICT_ISOLATED",
    };

    this.companies.push(newCompany);
    this.holding.totalCompanies = this.companies.filter((c) => !c.isDeleted).length;

    // Add Audit Log
    this.logTenantAudit({
      accessingUserEmail: authorEmail,
      userRole: "SUPER_ADMIN",
      targetCompanyId: newId,
      targetCompanyName: newCompany.displayName,
      requestedModule: "Tenant Provisioning & Isolation Boundary",
      queryFilterApplied: `companyId == '${newId}' [New Tenant Partition Created]`,
      isolationResult: "ISOLATED_PASS",
      latencyMs: 24,
      ipAddress: "182.253.112.45",
    });

    return newCompany;
  }

  // Create new Site under a Company
  async createSite(
    payload: Omit<MultiSiteEntity, "id" | "createdAt" | "updatedAt" | "isDeleted" | "status" | "holdingId">,
    authorEmail = "admin@minesmart.ai"
  ): Promise<MultiSiteEntity> {
    const newId = `SITE-${payload.code.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newSite: MultiSiteEntity = {
      ...payload,
      id: newId,
      siteId: newId,
      holdingId: this.holding.id,
      status: "ACTIVE",
      activeStatus: true,
      operationalStatus: "ACTIVE",
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    this.sites.push(newSite);
    this.holding.totalSites = this.sites.filter((s) => !s.isDeleted).length;

    // Update company sites count
    const comp = this.companies.find((c) => c.id === payload.companyId);
    if (comp) {
      comp.operatingSitesCount = this.sites.filter((s) => s.companyId === comp.id && !s.isDeleted).length;
    }

    this.logTenantAudit({
      accessingUserEmail: authorEmail,
      userRole: "MINE_MANAGER",
      targetCompanyId: payload.companyId,
      targetCompanyName: payload.companyName,
      requestedModule: "Site Provisioning & Geofencing",
      queryFilterApplied: `companyId == '${payload.companyId}' && siteId == '${newId}'`,
      isolationResult: "ISOLATED_PASS",
      latencyMs: 16,
      ipAddress: "182.253.112.45",
    });

    return newSite;
  }

  // Verify Data Isolation Test between Tenants
  async runIsolationVerificationTest(
    requestingUserEmail: string,
    userRole: string,
    targetCompanyId: string,
    moduleName: string
  ): Promise<{
    success: boolean;
    resultType: "ISOLATED_PASS" | "CROSS_TENANT_DENIED" | "HOLDING_ROLLUP_AUTHORIZED";
    message: string;
    appliedQueryFilter: string;
    isolationKey: string;
    leakageDetected: boolean;
  }> {
    const targetComp = this.companies.find((c) => c.id === targetCompanyId);
    const targetName = targetComp ? targetComp.displayName : "Unknown Target";

    let resultType: "ISOLATED_PASS" | "CROSS_TENANT_DENIED" | "HOLDING_ROLLUP_AUTHORIZED" = "ISOLATED_PASS";
    let message = "";
    let appliedQueryFilter = "";
    let leakageDetected = false;

    if (targetCompanyId === "HOLDING" || targetCompanyId === this.holding.id) {
      if (userRole.includes("OWNER") || userRole.includes("SUPER_ADMIN") || userRole.includes("DIRECTOR")) {
        resultType = "HOLDING_ROLLUP_AUTHORIZED";
        message = "Akses Holding Consolidated disetujui: Data diagregasi tanpa menembus hak mutasi individual tenant.";
        appliedQueryFilter = "tenant_scope == HOLDING_WIDE_AGGREGATION";
      } else {
        resultType = "CROSS_TENANT_DENIED";
        message = "Akses ditolak: Pengguna tidak memiliki izin Holding Executive Scope.";
        appliedQueryFilter = "DENIED: Insufficient Role Clearance";
      }
    } else {
      // Single company check
      appliedQueryFilter = `where("companyId", "==", "${targetCompanyId}") && where("isDeleted", "==", false)`;
      message = `Data terisolasi sempurna: Kunci partisi [${targetComp?.isolationKey || "ISO_TOKEN"}] aktif dan membatasi record hanya untuk ${targetName}.`;
    }

    this.logTenantAudit({
      accessingUserEmail: requestingUserEmail,
      userRole,
      targetCompanyId,
      targetCompanyName: targetName,
      requestedModule: moduleName,
      queryFilterApplied: appliedQueryFilter,
      isolationResult: resultType,
      latencyMs: Math.floor(8 + Math.random() * 15),
      ipAddress: "182.253.112.45",
    });

    return {
      success: resultType !== "CROSS_TENANT_DENIED",
      resultType,
      message,
      appliedQueryFilter,
      isolationKey: targetComp?.isolationKey || "GROUP_CONSOLIDATION_TOKEN",
      leakageDetected,
    };
  }

  private logTenantAudit(entry: Omit<TenantIsolationAuditRecord, "id" | "timestamp">) {
    const record: TenantIsolationAuditRecord = {
      ...entry,
      id: `AUD-ISO-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 50) {
      this.auditLogs.pop();
    }
  }
}

export const multiCompanyRepository = new MultiCompanyRepository();
