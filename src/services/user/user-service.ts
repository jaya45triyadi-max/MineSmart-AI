import { userRepository } from "../repositories/UserRepository";
import { siteRepository } from "../repositories/SiteRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { UserProfile, Site } from "../../types";

export interface UserQueryFilter {
  companyId?: string;
  siteId?: string;
  department?: string;
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedUsersResult {
  users: UserProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class UserService {
  /**
   * Fetch users with search query, filters, and pagination
   */
  static async getUsers(filter: UserQueryFilter = {}): Promise<PaginatedUsersResult> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const pageSize = filter.pageSize && filter.pageSize > 0 ? filter.pageSize : 10;

    let allUsers = await userRepository.getAll(filter.companyId);

    // Filter by search string (Name, Email, Employee ID)
    if (filter.search && filter.search.trim() !== "") {
      const queryStr = filter.search.toLowerCase().trim();
      allUsers = allUsers.filter(
        (u) =>
          u.fullName.toLowerCase().includes(queryStr) ||
          u.displayName.toLowerCase().includes(queryStr) ||
          u.email.toLowerCase().includes(queryStr) ||
          (u.employeeId && u.employeeId.toLowerCase().includes(queryStr))
      );
    }

    // Filter by Site ID
    if (filter.siteId && filter.siteId !== "ALL") {
      allUsers = allUsers.filter((u) => u.siteIds?.includes(filter.siteId!) || u.activeSiteId === filter.siteId);
    }

    // Filter by Department
    if (filter.department && filter.department !== "ALL") {
      allUsers = allUsers.filter((u) => u.department === filter.department || u.departmentId === filter.department);
    }

    // Filter by Role
    if (filter.role && filter.role !== "ALL") {
      allUsers = allUsers.filter((u) => u.role === filter.role);
    }

    // Filter by Status
    if (filter.status && filter.status !== "ALL") {
      allUsers = allUsers.filter((u) => u.status === filter.status);
    }

    const total = allUsers.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + pageSize);

    return {
      users: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Get single user by ID
   */
  static async getUserById(userId: string): Promise<UserProfile | null> {
    return userRepository.getById(userId);
  }

  /**
   * Create or invite user
   */
  static async createUser(userData: Omit<UserProfile, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">, authorId = "ADMIN"): Promise<UserProfile> {
    const newUser = await userRepository.create(
      {
        ...userData,
        status: userData.status || "PENDING_VERIFICATION",
        isActive: userData.status === "ACTIVE",
        createdBy: authorId,
        updatedBy: authorId,
      },
      authorId
    );

    // Audit log
    await auditRepository.create(
      {
        companyId: userData.companyId || "COMP-BNU-01",
        siteId: userData.activeSiteId || "SITE-KAL-A",
        userId: authorId,
        userName: authorId,
        userRole: "ADMIN",
        action: "CREATE_USER",
        module: "UserManagement",
        entityId: newUser.id,
        ipAddress: "127.0.0.1",
        details: `Dibuat pengguna baru ${newUser.fullName} (${newUser.email}) dengan Peran: ${newUser.role}`,
        timestamp: new Date().toISOString(),
        status: "COMPLETED",
        isDeleted: false,
        createdBy: authorId,
        updatedBy: authorId,
      },
      authorId
    );

    return newUser;
  }

  /**
   * Update user details
   */
  static async updateUser(userId: string, updates: Partial<UserProfile>, authorId = "ADMIN"): Promise<UserProfile> {
    const updated = await userRepository.update(userId, updates, authorId);

    await auditRepository.create(
      {
        companyId: updated.companyId || "COMP-BNU-01",
        siteId: updated.activeSiteId || "SITE-KAL-A",
        userId: authorId,
        userName: authorId,
        userRole: "ADMIN",
        action: "UPDATE_USER",
        module: "UserManagement",
        entityId: userId,
        ipAddress: "127.0.0.1",
        details: `Pembaruan profil pengguna ${updated.fullName} (${updated.email})`,
        timestamp: new Date().toISOString(),
        status: "COMPLETED",
        isDeleted: false,
        createdBy: authorId,
        updatedBy: authorId,
      },
      authorId
    );

    return updated;
  }

  /**
   * Suspend user account with MANDATORY reason
   */
  static async suspendUser(userId: string, reason: string, authorId = "ADMIN"): Promise<UserProfile> {
    if (!reason || reason.trim().length < 5) {
      throw new Error("Alasan penangguhan akun wajib diisi minimal 5 karakter.");
    }

    const updated = await userRepository.update(
      userId,
      {
        status: "SUSPENDED",
        isActive: false,
      },
      authorId
    );

    await auditRepository.create(
      {
        companyId: updated.companyId || "COMP-BNU-01",
        siteId: updated.activeSiteId || "SITE-KAL-A",
        userId: authorId,
        userName: authorId,
        userRole: "ADMIN",
        action: "SUSPEND_USER",
        module: "UserManagement",
        entityId: userId,
        ipAddress: "127.0.0.1",
        details: `Akun ${updated.fullName} (${updated.email}) DITANGGUHKAN/SUSPENDED. Alasan: "${reason.trim()}"`,
        timestamp: new Date().toISOString(),
        status: "COMPLETED",
        isDeleted: false,
        createdBy: authorId,
        updatedBy: authorId,
      },
      authorId
    );

    return updated;
  }

  /**
   * Activate user account
   */
  static async activateUser(userId: string, authorId = "ADMIN"): Promise<UserProfile> {
    const updated = await userRepository.update(
      userId,
      {
        status: "ACTIVE",
        isActive: true,
      },
      authorId
    );

    await auditRepository.create(
      {
        companyId: updated.companyId || "COMP-BNU-01",
        siteId: updated.activeSiteId || "SITE-KAL-A",
        userId: authorId,
        userName: authorId,
        userRole: "ADMIN",
        action: "ACTIVATE_USER",
        module: "UserManagement",
        entityId: userId,
        ipAddress: "127.0.0.1",
        details: `Akun ${updated.fullName} (${updated.email}) DIAKTIFKAN KEMBALI`,
        timestamp: new Date().toISOString(),
        status: "COMPLETED",
        isDeleted: false,
        createdBy: authorId,
        updatedBy: authorId,
      },
      authorId
    );

    return updated;
  }

  /**
   * Deactivate (Soft delete) user account
   */
  static async deactivateUser(userId: string, authorId = "ADMIN"): Promise<boolean> {
    const user = await userRepository.getById(userId);
    if (user) {
      await userRepository.update(userId, { status: "DEACTIVATED", isActive: false }, authorId);
      await userRepository.softDelete(userId, authorId);

      await auditRepository.create(
        {
          companyId: user.companyId || "COMP-BNU-01",
          siteId: user.activeSiteId || "SITE-KAL-A",
          userId: authorId,
          userName: authorId,
          userRole: "ADMIN",
          action: "DEACTIVATE_USER",
          module: "UserManagement",
          entityId: userId,
          ipAddress: "127.0.0.1",
          details: `Akun ${user.fullName} (${user.email}) dinonaktifkan secara permanen.`,
          timestamp: new Date().toISOString(),
          status: "COMPLETED",
          isDeleted: false,
          createdBy: authorId,
          updatedBy: authorId,
        },
        authorId
      );
    }
    return true;
  }

  /**
   * Assign Roles to user
   */
  static async assignRole(userId: string, role: string, authorId = "ADMIN"): Promise<UserProfile> {
    return this.updateUser(userId, { role: role as any }, authorId);
  }

  /**
   * Assign Sites to user
   */
  static async assignSites(userId: string, siteIds: string[], authorId = "ADMIN"): Promise<UserProfile> {
    const activeSiteId = siteIds.length > 0 ? siteIds[0] : "SITE-KAL-A";
    return this.updateUser(userId, { siteIds, activeSiteId }, authorId);
  }
}
