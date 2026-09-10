import { BaseRepository } from "./BaseRepository";
import { AuditLogItem } from "../../types";
import { INITIAL_AUDIT_LOGS } from "../../data/mockData";

export class AuditRepository extends BaseRepository<AuditLogItem & { companyId: string; status: string; isDeleted: boolean; createdAt: string; updatedAt: string; createdBy: string; updatedBy: string }> {
  constructor() {
    super("audit_logs", INITIAL_AUDIT_LOGS as unknown as any[]);
  }

  async getRecentLogs(limit = 20, companyId?: string): Promise<AuditLogItem[]> {
    const list = await this.getAll(companyId);
    return list.slice(0, limit);
  }

  async logAction(
    action: string,
    entityType: string,
    entityId: string,
    details?: string | Record<string, any>,
    userId = "SYSTEM",
    userName = "System"
  ): Promise<void> {
    try {
      const detailsStr = typeof details === "object" ? JSON.stringify(details) : (details || "");
      const logItem = {
        companyId: "comp-001",
        siteId: "site-001",
        timestamp: new Date().toISOString(),
        user: userName,
        action: `${action} on ${entityType} (${entityId})`,
        module: "PROCUREMENT",
        status: "SUCCESS" as const,
        details: detailsStr,
        isDeleted: false,
      };
      await this.create(logItem as any, userId);
    } catch (e) {
      console.warn("Audit log action failed:", e);
    }
  }
}

export const auditRepository = new AuditRepository();
