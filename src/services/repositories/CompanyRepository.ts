import { BaseRepository } from "./BaseRepository";
import { Company } from "../../types";
import { DEMO_COMPANY } from "../../data/mockData";

export class CompanyRepository extends BaseRepository<Company> {
  constructor() {
    super("companies", [DEMO_COMPANY]);
  }

  async getCompanyByCode(code: string): Promise<Company | null> {
    const all = await this.getAll();
    return all.find((c) => c.code.toLowerCase() === code.toLowerCase()) || null;
  }

  async getCompanyByLicenseKey(licenseKey: string): Promise<Company | null> {
    const all = await this.getAll();
    return all.find((c) => c.licenseKey === licenseKey) || null;
  }
}

export const companyRepository = new CompanyRepository();
