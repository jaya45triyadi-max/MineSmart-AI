import { collection, doc, setDoc, getDocs, query, where, orderBy, limit as fsLimit } from "firebase/firestore";
import { db } from "../firebase/config";
import { BaseEntity } from "../../types";

export interface LoginHistoryItem extends BaseEntity {
  userId: string;
  userEmail: string;
  companyId: string;
  eventType:
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "LOGOUT"
    | "PASSWORD_RESET"
    | "EMAIL_VERIFIED"
    | "OTP_SUCCESS"
    | "OTP_FAILED"
    | "ACCOUNT_SUSPENDED";
  deviceType: string;
  browser: string;
  ipAddress: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
}

const LOCAL_LOGIN_HISTORY: LoginHistoryItem[] = [
  {
    id: "LOG-001",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    userId: "USR-001",
    userEmail: "owner@minesmart.ai",
    eventType: "LOGIN_SUCCESS",
    deviceType: "Desktop Windows 11",
    browser: "Chrome 128.0",
    ipAddress: "182.253.42.10",
    success: true,
    timestamp: "2026-08-12T08:30:00Z",
    status: "COMPLETED",
    isDeleted: false,
    createdAt: "2026-08-12T08:30:00Z",
    updatedAt: "2026-08-12T08:30:00Z",
    createdBy: "USR-001",
    updatedBy: "USR-001",
  },
  {
    id: "LOG-002",
    companyId: "COMP-BNU-01",
    siteId: "SITE-KAL-A",
    userId: "USR-002",
    userEmail: "mine.manager@minesmart.ai",
    eventType: "LOGIN_SUCCESS",
    deviceType: "MacBook Pro M3",
    browser: "Safari 17.5",
    ipAddress: "180.252.12.88",
    success: true,
    timestamp: "2026-08-12T07:15:22Z",
    status: "COMPLETED",
    isDeleted: false,
    createdAt: "2026-08-12T07:15:22Z",
    updatedAt: "2026-08-12T07:15:22Z",
    createdBy: "USR-002",
    updatedBy: "USR-002",
  },
];

export class SessionService {
  /**
   * Record login event into Firestore login_history
   */
  static async recordLoginEvent(event: Omit<LoginHistoryItem, "id" | "status" | "isDeleted" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">): Promise<LoginHistoryItem> {
    const logId = `LOG-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const record: LoginHistoryItem = {
      ...event,
      id: logId,
      status: "COMPLETED",
      isDeleted: false,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: event.userId || "SYSTEM",
      updatedBy: event.userId || "SYSTEM",
    };

    try {
      const docRef = doc(db, "login_history", logId);
      await setDoc(docRef, record);
    } catch (err) {
      console.warn("[SessionService] Failed to persist login event to Firestore, stored in local cache", err);
    }

    LOCAL_LOGIN_HISTORY.unshift(record);
    return record;
  }

  /**
   * Get login history logs for a specific user or company
   */
  static async getLoginHistory(userId?: string, companyId?: string, maxLimit = 20): Promise<LoginHistoryItem[]> {
    try {
      const qConstraints: any[] = [where("isDeleted", "==", false), fsLimit(maxLimit)];
      if (userId) qConstraints.push(where("userId", "==", userId));
      if (companyId) qConstraints.push(where("companyId", "==", companyId));

      const q = query(collection(db, "login_history"), ...qConstraints);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as LoginHistoryItem);
      }
    } catch (err) {
      console.warn("[SessionService] Offline mode or fetch failed, returning local login history", err);
    }

    return LOCAL_LOGIN_HISTORY.filter((item) => {
      if (userId && item.userId !== userId) return false;
      if (companyId && item.companyId !== companyId) return false;
      return true;
    }).slice(0, maxLimit);
  }
}
