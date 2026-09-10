import { BaseRepository } from "./BaseRepository";
import { Site } from "../../types";
import { DEMO_SITES } from "../../data/mockData";

export class SiteRepository extends BaseRepository<Site> {
  constructor() {
    super("sites", DEMO_SITES as unknown as Site[]);
  }

  async getSitesForCompany(companyId: string): Promise<Site[]> {
    return this.getAll(companyId);
  }

  async getActiveSites(companyId: string): Promise<Site[]> {
    const sites = await this.getSitesForCompany(companyId);
    return sites.filter((s) => s.operationalStatus === "ACTIVE" || s.activeStatus);
  }
}

export const siteRepository = new SiteRepository();
