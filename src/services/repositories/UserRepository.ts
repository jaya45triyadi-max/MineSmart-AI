import { BaseRepository } from "./BaseRepository";
import { UserProfile } from "../../types";
import { DEMO_USERS } from "../../data/mockData";

export class UserRepository extends BaseRepository<UserProfile> {
  constructor() {
    super("users", DEMO_USERS as unknown as UserProfile[]);
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const all = await this.getAll();
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUsersByCompanyId(companyId: string): Promise<UserProfile[]> {
    const all = await this.getAll();
    return all.filter((u) => u.companyId === companyId);
  }

  async getUsersByRole(role: string, companyId?: string): Promise<UserProfile[]> {
    const all = await this.getAll(companyId);
    return all.filter((u) => u.role === role);
  }
}

export const userRepository = new UserRepository();
