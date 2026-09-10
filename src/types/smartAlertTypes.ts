// MINE SMART AI - Smart Alert Engine & Notification Center Types
// 4 Standard Severities: 🔴 Critical | 🟠 Warning | 🟡 Attention | 🟢 Normal
// 5 Multi-Channel Delivery: 🔔 In-App | 📲 Push Notification | 📧 Email | 💬 WhatsApp | ✈️ Telegram

export type SmartAlertSeverity = "CRITICAL" | "WARNING" | "ATTENTION" | "NORMAL";

export type NotificationChannel = "IN_APP" | "PUSH" | "EMAIL" | "WHATSAPP" | "TELEGRAM";

export type SmartAlertCategory =
  | "FLEET_FUEL"
  | "EQUIPMENT_DOWNTIME"
  | "PRODUCTION_TARGET"
  | "HSE_SAFETY"
  | "STOCKPILE_ENVIRONMENT"
  | "COST_BUDGET"
  | "DISPATCH_HAULING";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "SNOOZED";

export interface ChannelDeliveryStatus {
  channel: NotificationChannel;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED" | "PENDING";
  sentAt: string;
  recipient: string; // e.g. "CEO / Direktur", "+62 812-9876-5432", "operations@nusamining.com", "@MineSmartBot"
  externalRefId?: string;
  errorMessage?: string;
}

export interface SmartAlertRule {
  id: string;
  name: string;
  category: SmartAlertCategory;
  severity: SmartAlertSeverity;
  metric: string;
  operator: ">" | ">=" | "<" | "<=" | "==" | "!=" | "VARIANCE_ABOVE" | "VARIANCE_BELOW";
  thresholdValue: number;
  unit: string;
  durationMinutes?: number;
  descriptionTemplate: string;
  enabled: boolean;
  autoEscalateMinutes?: number;
  targetChannels?: NotificationChannel[];
  targetRoles?: string[];
}

export interface SmartAlertItem {
  id: string;
  ruleId?: string;
  severity: SmartAlertSeverity;
  category: SmartAlertCategory;
  title: string;
  message: string;
  entityId: string; // e.g. "PIT-02", "HD785-05", "EX-03", "STOCKPILE-ROM-3"
  entityType: "EQUIPMENT" | "PIT" | "STOCKPILE" | "FLEET" | "OPERATOR" | "SYSTEM";
  currentValue: number | string;
  baselineValue: number | string;
  variancePct?: number;
  location?: string;
  timestamp: string;
  status: AlertStatus;
  channels: NotificationChannel[];
  channelDeliveries?: ChannelDeliveryStatus[];
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  assignedToRole?: string;
  suggestedAction: string;
  aiRootCauseAnalysis?: string;
  tags: string[];
}

export interface SmartAlertSummary {
  totalActive: number;
  criticalCount: number; // 🔴
  warningCount: number;  // 🟠
  attentionCount: number; // 🟡
  normalCount: number;   // 🟢
  acknowledgedCount: number;
  resolvedTodayCount: number;
  mttrMinutes: number; // Mean time to resolve
  channelDeliveryTotals?: Record<NotificationChannel, number>;
}

export interface NotificationGatewayConfig {
  inApp: {
    enabled: boolean;
    soundEnabled: boolean;
    autoPopupCritical: boolean;
  };
  push: {
    enabled: boolean;
    browserPermission: "default" | "granted" | "denied";
    vapidKeyConfigured: boolean;
    sendToRoles: string[];
  };
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: number;
    senderEmail: string;
    recipients: { name: string; email: string; role: string; severities: SmartAlertSeverity[] }[];
  };
  whatsapp: {
    enabled: boolean;
    businessAccountId: string;
    apiEndpoint: string;
    phoneNumbers: { name: string; phone: string; role: string; severities: SmartAlertSeverity[] }[];
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    botUsername: string;
    chatIds: { name: string; chatId: string; type: "GROUP" | "CHANNEL" | "DIRECT"; severities: SmartAlertSeverity[] }[];
  };
}

