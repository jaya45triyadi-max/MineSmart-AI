import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit as fsLimit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getSupabaseClient } from "../supabase/config";
import { BaseEntity, AuditLogItem } from "../../types";

export abstract class BaseRepository<T extends BaseEntity> {
  protected collectionName: string;
  protected mockFallbackData: T[];

  constructor(collectionName: string, mockFallbackData: T[] = []) {
    this.collectionName = collectionName;
    this.mockFallbackData = mockFallbackData;
  }

  protected getCollectionRef() {
    return collection(db, this.collectionName);
  }

  protected nowIso(): string {
    return new Date().toISOString();
  }

  /**
   * Get all active (non-deleted) records for a given company and optional site
   */
  async getAll(companyId?: string, siteId?: string, maxLimit = 100): Promise<T[]> {
    // 1. Check Supabase first if available
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let queryBuilder = supabase.from(this.collectionName).select("*").limit(maxLimit);
        if (companyId) {
          queryBuilder = queryBuilder.eq("company_id", companyId);
        }
        if (siteId) {
          queryBuilder = queryBuilder.eq("site_id", siteId);
        }
        const { data, error } = await queryBuilder;
        if (!error && data && data.length > 0) {
          return data as T[];
        }
      } catch (sbErr) {
        // Fall through to Firestore / Mock
      }
    }

    try {
      const constraints: QueryConstraint[] = [
        where("isDeleted", "==", false),
        fsLimit(maxLimit),
      ];

      if (companyId) {
        constraints.push(where("companyId", "==", companyId));
      }
      if (siteId) {
        constraints.push(where("siteId", "==", siteId));
      }

      const q = query(this.getCollectionRef(), ...constraints);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as T[];
      }
    } catch (err) {
      // Offline fallback
    }

    // Fallback to in-memory mock data
    return this.mockFallbackData.filter((item) => {
      if (item.isDeleted) return false;
      if (companyId && item.companyId && item.companyId !== companyId) return false;
      if (siteId && item.siteId && item.siteId !== siteId) return false;
      return true;
    });
  }

  /**
   * Get single record by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (!data.isDeleted) {
          return { id: snapshot.id, ...data } as T;
        }
      }
    } catch (err) {
      console.warn(`[Firestore ${this.collectionName}] Fetch by ID failed, trying mock fallback`, err);
    }

    const found = this.mockFallbackData.find((item) => item.id === id && !item.isDeleted);
    return found || null;
  }

  /**
   * Create a new entity with server timestamps and audit logging
   */
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">, authorId = "SYSTEM"): Promise<T> {
    const newId = `${this.collectionName.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const nowStr = this.nowIso();

    const record: T = {
      ...data,
      id: newId,
      status: data.status || "ACTIVE",
      isDeleted: false,
      createdAt: nowStr,
      updatedAt: nowStr,
      createdBy: authorId,
      updatedBy: authorId,
    } as unknown as T;

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from(this.collectionName).insert([record]).then(() => {});
      }

      const docRef = doc(db, this.collectionName, newId);
      await setDoc(docRef, {
        ...record,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp(),
      });
      await this.writeAuditLog("CREATE", this.collectionName, newId, `Created record in ${this.collectionName}`, authorId, record.companyId, record.siteId);
    } catch (err) {
      // Offline fallback
    }

    this.mockFallbackData.unshift(record);
    return record;
  }

  /**
   * Update existing entity
   */
  async update(id: string, updates: Partial<T>, authorId = "SYSTEM"): Promise<T> {
    const nowStr = this.nowIso();
    const updatePayload = {
      ...updates,
      updatedAt: nowStr,
      updatedBy: authorId,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updatePayload,
        serverUpdatedAt: serverTimestamp(),
      });
      await this.writeAuditLog("UPDATE", this.collectionName, id, `Updated record in ${this.collectionName}`, authorId, updates.companyId, updates.siteId);
    } catch (err) {
      console.warn(`[Firestore ${this.collectionName}] Update failed, updating mock store locally`, err);
    }

    const index = this.mockFallbackData.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.mockFallbackData[index] = {
        ...this.mockFallbackData[index],
        ...updatePayload,
      };
      return this.mockFallbackData[index];
    }

    return { id, ...updatePayload } as T;
  }

  /**
   * Soft delete entity
   */
  async softDelete(id: string, authorId = "SYSTEM"): Promise<boolean> {
    const nowStr = this.nowIso();

    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: nowStr,
        deletedBy: authorId,
        updatedAt: nowStr,
        updatedBy: authorId,
        serverUpdatedAt: serverTimestamp(),
      });
      await this.writeAuditLog("SOFT_DELETE", this.collectionName, id, `Soft deleted record in ${this.collectionName}`, authorId);
    } catch (err) {
      console.warn(`[Firestore ${this.collectionName}] Soft delete failed, updating mock store locally`, err);
    }

    const index = this.mockFallbackData.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.mockFallbackData[index].isDeleted = true;
    }
    return true;
  }

  /**
   * Record audit log entry
   */
  protected async writeAuditLog(
    action: string,
    moduleName: string,
    entityId: string,
    details: string,
    userId = "SYSTEM",
    companyId = "COMP-BNU-01",
    siteId = "SITE-KAL-A"
  ) {
    try {
      const auditId = `AUD-${Date.now()}`;
      const logDoc: AuditLogItem = {
        id: auditId,
        companyId,
        siteId,
        userId,
        userName: userId,
        userRole: "OPERATOR",
        action,
        module: moduleName,
        entityId,
        ipAddress: "127.0.0.1",
        details,
        timestamp: this.nowIso(),
      };
      const docRef = doc(db, "audit_logs", auditId);
      await setDoc(docRef, logDoc);
    } catch (e) {
      // Quiet fail for audit logging in offline mode
    }
  }
}
