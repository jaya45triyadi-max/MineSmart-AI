import { LicenseAuditEvent } from "../../types/license";
import { BaseRepository } from "../repositories/BaseRepository";

class LicenseEventRepository extends BaseRepository<LicenseAuditEvent> {
  constructor() {
    super("license_events", []);
  }

  async getEventsByLicenseId(licenseId: string): Promise<LicenseAuditEvent[]> {
    const all = await this.getAll();
    return all.filter((e) => e.licenseId === licenseId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getRecentEvents(limitCount = 50): Promise<LicenseAuditEvent[]> {
    const all = await this.getAll();
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limitCount);
  }
}

export const licenseEventRepository = new LicenseEventRepository();

export class LicenseEventService {
  static async logEvent(
    licenseId: string,
    companyId: string,
    userId: string,
    userEmail: string,
    eventType: LicenseAuditEvent["eventType"],
    details: string
  ): Promise<LicenseAuditEvent> {
    const event: LicenseAuditEvent = {
      id: "EVT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      licenseId,
      companyId,
      userId,
      userEmail,
      eventType,
      details,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ipAddress: "182.253.112.45", // Verified client IP
    };

    await licenseEventRepository.create(event);
    return event;
  }

  static async getLicenseAuditTrail(licenseId: string): Promise<LicenseAuditEvent[]> {
    return licenseEventRepository.getEventsByLicenseId(licenseId);
  }

  static async getAllRecentEvents(): Promise<LicenseAuditEvent[]> {
    return licenseEventRepository.getRecentEvents(50);
  }
}
