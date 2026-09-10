import { BaseRepository } from "./BaseRepository";
import {
  AIConversationRecord,
  AIChatMessageExtended,
  AIInsightRecord,
  KnowledgeDocument,
  AIInteractionAuditLog,
  AIActionProposal,
} from "../../types/aiTypes";

export class AIRepository {
  private convKey = "minesmart_ai_conversations_v1";
  private msgKey = "minesmart_ai_messages_v1";
  private insightKey = "minesmart_ai_insights_v1";
  private actionKey = "minesmart_ai_actions_v1";
  private auditKey = "minesmart_ai_audit_logs_v1";
  private docKey = "minesmart_ai_knowledge_docs_v1";

  // Conversations
  async getConversations(companyId: string, userId: string): Promise<AIConversationRecord[]> {
    try {
      const raw = localStorage.getItem(this.convKey);
      if (raw) {
        const list: AIConversationRecord[] = JSON.parse(raw);
        return list
          .filter((c) => c.companyId === companyId && c.userId === userId && !c.isArchived)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
    } catch (e) {
      console.error("Error reading AI conversations:", e);
    }
    return [];
  }

  async saveConversation(conv: AIConversationRecord): Promise<AIConversationRecord> {
    const raw = localStorage.getItem(this.convKey);
    const list: AIConversationRecord[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      list[idx] = { ...conv, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(conv);
    }
    localStorage.setItem(this.convKey, JSON.stringify(list));
    return conv;
  }

  async deleteConversation(convId: string): Promise<void> {
    const raw = localStorage.getItem(this.convKey);
    if (!raw) return;
    const list: AIConversationRecord[] = JSON.parse(raw);
    const updated = list.filter((c) => c.id !== convId);
    localStorage.setItem(this.convKey, JSON.stringify(updated));

    // Delete associated messages
    const rawMsg = localStorage.getItem(this.msgKey);
    if (rawMsg) {
      const msgs: AIChatMessageExtended[] = JSON.parse(rawMsg);
      const filteredMsgs = msgs.filter((m) => m.conversationId !== convId);
      localStorage.setItem(this.msgKey, JSON.stringify(filteredMsgs));
    }
  }

  // Messages
  async getMessages(conversationId: string): Promise<AIChatMessageExtended[]> {
    try {
      const raw = localStorage.getItem(this.msgKey);
      if (raw) {
        const list: AIChatMessageExtended[] = JSON.parse(raw);
        return list.filter((m) => m.conversationId === conversationId);
      }
    } catch (e) {
      console.error("Error reading AI messages:", e);
    }
    return [];
  }

  async saveMessage(msg: AIChatMessageExtended): Promise<AIChatMessageExtended> {
    const raw = localStorage.getItem(this.msgKey);
    const list: AIChatMessageExtended[] = raw ? JSON.parse(raw) : [];
    list.push(msg);
    localStorage.setItem(this.msgKey, JSON.stringify(list));
    return msg;
  }

  // Proactive Insights
  async getInsights(companyId: string, siteId?: string): Promise<AIInsightRecord[]> {
    try {
      const raw = localStorage.getItem(this.insightKey);
      if (raw) {
        const list: AIInsightRecord[] = JSON.parse(raw);
        return list.filter(
          (i) => i.companyId === companyId && (!siteId || i.siteId === siteId) && !i.isDismissed
        );
      }
    } catch (e) {}

    // Default proactive insights
    const defaultInsights: AIInsightRecord[] = [
      {
        id: "ins-001",
        companyId,
        siteId: siteId || "site-kal-a",
        title: "Downtime Excavator EX-204 Berpotensi Menunda Target Produksi Shift Malam",
        description: "EX-204 (PC1250) mengalami kebocoran pipa hidrolik boom (Downtime 3.5 jam). Efisiensi fleet Pit 2 North berisiko turun 12.4%.",
        severity: "HIGH",
        module: "FLEET",
        evidence: ["EX-204 Breakdown 3.5 Jam", "Antrean HT di Pit 2 naik +18%"],
        recommendation: "Rebalance 4 unit Truck HD785 ke Fleet EX-201 sementara sampai perbaikan selesai.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "ins-002",
        companyId,
        siteId: siteId || "site-kal-a",
        title: "Anomali Konsumsi Solar Terdeteksi Pada Haul Truck HT-112",
        description: "Konsumsi solar HT-112 hari ini mencapai 68.4 L/Jam (+41.9% dari baseline 48.2 L/Jam).",
        severity: "MEDIUM",
        module: "FUEL",
        evidence: ["Fuel Burn HT-112: 68.4 L/Jam", "Normal baseline: 48.2 L/Jam"],
        recommendation: "Lakukan pengujian kalibrasi injektor & cek kebocoran tangki di Workshop.",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "ins-003",
        companyId,
        siteId: siteId || "site-kal-a",
        title: "Cost/Ton OPEX Berada $2.30/MT Di Atas Pagu Budget Bulanan",
        description: "Biaya operasional aktual $26.80/MT vs budget $24.50/MT akibat kenaikan biaya solar dan spare parts.",
        severity: "CRITICAL",
        module: "FINANCE",
        evidence: ["Aktual Cost/Ton: $26.80/MT", "Budget Cost/Ton: $24.50/MT"],
        recommendation: "Evaluasi rute hauling untuk efisiensi fuel ratio dan tunda pembelian non-kritis.",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ];

    return defaultInsights;
  }

  async dismissInsight(insightId: string): Promise<void> {
    const raw = localStorage.getItem(this.insightKey);
    const list: AIInsightRecord[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((i) => i.id === insightId);
    if (idx >= 0) {
      list[idx].isDismissed = true;
      localStorage.setItem(this.insightKey, JSON.stringify(list));
    }
  }

  // Audit Logs
  async saveAuditLog(log: AIInteractionAuditLog): Promise<void> {
    try {
      const raw = localStorage.getItem(this.auditKey);
      const list: AIInteractionAuditLog[] = raw ? JSON.parse(raw) : [];
      list.unshift(log);
      // Keep max 200 logs locally
      localStorage.setItem(this.auditKey, JSON.stringify(list.slice(0, 200)));
    } catch (e) {}
  }

  async getAuditLogs(companyId: string): Promise<AIInteractionAuditLog[]> {
    try {
      const raw = localStorage.getItem(this.auditKey);
      if (raw) {
        const list: AIInteractionAuditLog[] = JSON.parse(raw);
        return list.filter((l) => l.companyId === companyId);
      }
    } catch (e) {}
    return [];
  }
}
