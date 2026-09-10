// MINE SMART AI - Smart Alert & Multi-Channel Notification Engine Service
// 4 Standard Severities: 🔴 Critical | 🟠 Warning | 🟡 Attention | 🟢 Normal
// 5 Delivery Channels: 🔔 In-App | 📲 Push Notification | 📧 Email | 💬 WhatsApp | ✈️ Telegram

import {
  SmartAlertItem,
  SmartAlertSeverity,
  SmartAlertCategory,
  SmartAlertRule,
  SmartAlertSummary,
  AlertStatus,
  NotificationChannel,
  NotificationGatewayConfig,
  ChannelDeliveryStatus,
} from "../../../types/smartAlertTypes";

const INITIAL_RULES: SmartAlertRule[] = [
  {
    id: "RULE-PIT-PROD-DEFICIT",
    name: "Pit Production Monthly Shortfall Predictor",
    category: "PRODUCTION_TARGET",
    severity: "CRITICAL",
    metric: "Monthly Target Variance Forecast",
    operator: "VARIANCE_BELOW",
    thresholdValue: 8, // >8% below target
    unit: "%",
    descriptionTemplate: "Produksi {{entityId}} diprediksi gagal mencapai target bulanan (Defisit {{variancePct}}%).",
    enabled: true,
    autoEscalateMinutes: 15,
    targetChannels: ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"],
    targetRoles: ["MINING_OWNER", "SITE_MANAGER", "MINE_ENGINEER", "DISPATCH_OPERATOR"],
  },
  {
    id: "RULE-FUEL-VAR",
    name: "Fuel Consumption Spike vs Baseline",
    category: "FLEET_FUEL",
    severity: "WARNING",
    metric: "Fuel Burn Rate L/h",
    operator: "VARIANCE_ABOVE",
    thresholdValue: 15, // >15% variance
    unit: "%",
    descriptionTemplate: "{{entityId}} memiliki fuel consumption {{variancePct}}% di atas baseline.",
    enabled: true,
    autoEscalateMinutes: 120,
    targetChannels: ["IN_APP", "PUSH", "WHATSAPP", "TELEGRAM"],
    targetRoles: ["SITE_MANAGER", "DISPATCH_OPERATOR", "FINANCE_MANAGER"],
  },
  {
    id: "RULE-DOWNTIME-EX",
    name: "Heavy Excavator Prolonged Downtime",
    category: "EQUIPMENT_DOWNTIME",
    severity: "CRITICAL",
    metric: "Downtime Duration",
    operator: ">=",
    thresholdValue: 2, // >= 2 hours
    unit: "Hours",
    durationMinutes: 120,
    descriptionTemplate: "Excavator {{entityId}} mengalami downtime {{currentValue}} jam.",
    enabled: true,
    autoEscalateMinutes: 30,
    targetChannels: ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"],
    targetRoles: ["SITE_MANAGER", "DISPATCH_OPERATOR"],
  },
  {
    id: "RULE-HSE-FATIGUE",
    name: "Operator Fatigue Detection (Camera Sensor)",
    category: "HSE_SAFETY",
    severity: "CRITICAL",
    metric: "Fatigue Eye Closure Duration",
    operator: ">=",
    thresholdValue: 2.5,
    unit: "Seconds",
    descriptionTemplate: "Peringatan Microsleep pada Operator unit {{entityId}} di Pit North.",
    enabled: true,
    targetChannels: ["IN_APP", "PUSH", "WHATSAPP", "TELEGRAM"],
    targetRoles: ["HSE_OFFICER", "DISPATCH_OPERATOR"],
  },
  {
    id: "RULE-STOCK-SWABAKAR",
    name: "Stockpile Spontaneous Combustion High Temp",
    category: "STOCKPILE_ENVIRONMENT",
    severity: "ATTENTION",
    metric: "Internal Pile Temp",
    operator: ">=",
    thresholdValue: 55,
    unit: "°C",
    descriptionTemplate: "Suhu internal tumpukan {{entityId}} mencapai {{currentValue}}°C (Ambang Batas Kritis: 65°C).",
    enabled: true,
    targetChannels: ["IN_APP", "PUSH", "TELEGRAM"],
    targetRoles: ["SITE_MANAGER", "HSE_OFFICER"],
  },
  {
    id: "RULE-SPEED-ROAD",
    name: "Haul Road Over-Speeding Warning",
    category: "DISPATCH_HAULING",
    severity: "ATTENTION",
    metric: "Hauler Speed",
    operator: ">",
    thresholdValue: 40,
    unit: "km/h",
    descriptionTemplate: "Unit {{entityId}} melampaui batas kecepatan jalan tambang ({{currentValue}} km/h).",
    enabled: true,
    targetChannels: ["IN_APP", "PUSH"],
    targetRoles: ["DISPATCH_OPERATOR", "HSE_OFFICER"],
  },
];

const INITIAL_ALERTS: SmartAlertItem[] = [
  {
    id: "ALT-2026-CRIT-001",
    ruleId: "RULE-PIT-PROD-DEFICIT",
    severity: "CRITICAL", // 🔴
    category: "PRODUCTION_TARGET",
    title: "🚨 Critical Alert — Produksi Pit 02 Target Deficit Risk",
    message: "Produksi Pit 02 diprediksi gagal mencapai target bulanan.",
    entityId: "PIT-02",
    entityType: "PIT",
    currentValue: "432,000 MT (Proyeksi Akhir Bulan)",
    baselineValue: "480,000 MT (Target RKAB)",
    variancePct: -10.0,
    location: "Pit 02 South Seam A & B",
    timestamp: "3 menit yang lalu",
    status: "ACTIVE",
    assignedToRole: "Site General Manager & Mine Superintendent",
    suggestedAction: "Segera eksekusi Rebalancing Armada: Alihkan 4 unit Haul Truck ke Pit 01, percepat perbaikan hidrolik EX-03 di Pit 02, dan kerahkan Motor Grader perataan lumpur KM 4.2.",
    aiRootCauseAnalysis: "1. Breakdown tidak terencana pada Excavator Utama EX-03 (downtime 4.2 jam). 2. Kondisi jalan hauling KM 4.2 licin pasca hujan meningkatkan cycle time sebesar 4.2 menit/ritase. 3. Antrean idle (truck queuing) di Hopper Crusher 02 menurunkan throughput harian sebesar 1,600 MT.",
    tags: ["Critical", "Production", "Pit 02", "RKAB", "Deficit", "Multi-Channel Dispatched"],
    channels: ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"],
    channelDeliveries: [
      {
        channel: "IN_APP",
        status: "DELIVERED",
        sentAt: "3 menit yang lalu",
        recipient: "All Active Dispatchers & Executives",
      },
      {
        channel: "PUSH",
        status: "DELIVERED",
        sentAt: "3 menit yang lalu",
        recipient: "Device Mobile (GM, Mine Head, Owner)",
        externalRefId: "FCM-WEB-884920",
      },
      {
        channel: "EMAIL",
        status: "SENT",
        sentAt: "3 menit yang lalu",
        recipient: "management@nusamining.com, gm.mine@site-b.com",
        externalRefId: "SMTP-MSG-19034",
      },
      {
        channel: "WHATSAPP",
        status: "READ",
        sentAt: "2 menit yang lalu",
        recipient: "+62 812-9876-5432 (Mining Director) & +62 811-2345-6789 (GM Site)",
        externalRefId: "WA-BIZ-77189",
      },
      {
        channel: "TELEGRAM",
        status: "DELIVERED",
        sentAt: "3 menit yang lalu",
        recipient: "Telegram Channel @NMG_Mine_Command_Bot (Mining Ops Group)",
        externalRefId: "TG-BOT-44091",
      },
    ],
  },
  {
    id: "ALT-2026-001",
    ruleId: "RULE-DOWNTIME-EX",
    severity: "CRITICAL", // 🔴
    category: "EQUIPMENT_DOWNTIME",
    title: "Excavator EX-03 Prolonged Downtime",
    message: "🔴 Excavator EX-03 mengalami downtime 4.2 jam di Pit 02 (Tekanan hidrolik drop).",
    entityId: "EX-03",
    entityType: "EQUIPMENT",
    currentValue: 4.2,
    baselineValue: 0.5,
    variancePct: 740,
    location: "Pit 02 South - Loading Point 2",
    timestamp: "12 menit yang lalu",
    status: "ACTIVE",
    assignedToRole: "Maintenance Foreman / Plant Spv",
    suggestedAction: "Kirim tim respon cepat mekanik & ganti seal cartridge valve hidrolik EX-03.",
    aiRootCauseAnalysis: "Tekanan hidrolik turun tiba-tiba dari 320 bar ke 45 bar. Kemungkinan kegagalan O-ring seal cartridge valve.",
    tags: ["Excavator", "Downtime", "Critical", "Hydraulic"],
    channels: ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "12 menit yang lalu", recipient: "Dispatch Console" },
      { channel: "PUSH", status: "DELIVERED", sentAt: "12 menit yang lalu", recipient: "Plant Spv Mobile" },
      { channel: "WHATSAPP", status: "READ", sentAt: "10 menit yang lalu", recipient: "+62 813-7777-6666 (Plant Spv)" },
      { channel: "TELEGRAM", status: "DELIVERED", sentAt: "12 menit yang lalu", recipient: "@MineSmartBot" },
    ],
  },
  {
    id: "ALT-2026-002",
    ruleId: "RULE-FUEL-VAR",
    severity: "WARNING", // 🟠
    category: "FLEET_FUEL",
    title: "HD785-05 High Fuel Consumption Anomaly",
    message: "⚠️ HD785-05 memiliki fuel consumption 18% di atas baseline (81.4 L/Jam).",
    entityId: "HD785-05",
    entityType: "FLEET",
    currentValue: "81.4 L/Jam",
    baselineValue: "69.0 L/Jam",
    variancePct: 18.0,
    location: "Haul Road KM 3.8 to ROM 2",
    timestamp: "25 menit yang lalu",
    status: "ACTIVE",
    assignedToRole: "Fuel Management & Fleet Dispatcher",
    suggestedAction: "Inspeksi injector timing, filter udara tersumbat, dan evaluasi grade tanjakan jalan hauling.",
    aiRootCauseAnalysis: "Grade tanjakan segmen KM 3.8 mengalami kemiringan 11.2% (standar max 8%), menyebabkan engine beroperasi pada rpm tinggi di gigi transmisi 1 secara konstan.",
    tags: ["Fuel", "Warning", "HD785", "Efficiency"],
    channels: ["IN_APP", "PUSH", "WHATSAPP", "TELEGRAM"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "25 menit yang lalu", recipient: "Fuel Module" },
      { channel: "PUSH", status: "DELIVERED", sentAt: "25 menit yang lalu", recipient: "Fuel Engineer" },
      { channel: "TELEGRAM", status: "DELIVERED", sentAt: "25 menit yang lalu", recipient: "Mining Ops Telegram Channel" },
    ],
  },
  {
    id: "ALT-2026-004",
    ruleId: "RULE-HSE-FATIGUE",
    severity: "CRITICAL", // 🔴
    category: "HSE_SAFETY",
    title: "Operator Fatigue Alert (Microsleep)",
    message: "🔴 Peringatan Microsleep pada Operator unit DT-108 di Pit 02 Ramp.",
    entityId: "DT-108",
    entityType: "OPERATOR",
    currentValue: "3.2 detik",
    baselineValue: "< 1.0 detik",
    variancePct: 220,
    location: "Pit 02 Ramp Out",
    timestamp: "35 menit yang lalu",
    status: "ACTIVE",
    assignedToRole: "Safety Officer / Dispatcher",
    suggestedAction: "Hubungi operator via radio dua arah, instruksikan parkir aman di rest bay dan ganti operator cadangan.",
    aiRootCauseAnalysis: "Kamera AI DSS (Driver Safety System) mendeteksi mata terpejam lebih dari 3 detik saat unit melaju pada kecepatan 18 km/h.",
    tags: ["HSE", "Safety", "Fatigue", "Critical"],
    channels: ["IN_APP", "PUSH", "WHATSAPP", "TELEGRAM"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "35 menit yang lalu", recipient: "Safety Center" },
      { channel: "PUSH", status: "DELIVERED", sentAt: "35 menit yang lalu", recipient: "HSE Officer Mobile" },
      { channel: "WHATSAPP", status: "READ", sentAt: "33 menit yang lalu", recipient: "+62 811-9988-7766 (HSE Lead)" },
      { channel: "TELEGRAM", status: "DELIVERED", sentAt: "35 menit yang lalu", recipient: "@NMG_Mine_Command_Bot" },
    ],
  },
  {
    id: "ALT-2026-005",
    ruleId: "RULE-STOCK-SWABAKAR",
    severity: "ATTENTION", // 🟡
    category: "STOCKPILE_ENVIRONMENT",
    title: "Stockpile Hotspot Temperature Rise",
    message: "🟡 Suhu internal tumpukan ROM-3B mencapai 58.4°C (Ambang Batas: 65°C).",
    entityId: "ROM-3B",
    entityType: "STOCKPILE",
    currentValue: "58.4°C",
    baselineValue: "42.0°C",
    variancePct: 39.0,
    location: "Port ROM Stockpile Area Sector 3",
    timestamp: "2 jam yang lalu",
    status: "ACTIVE",
    assignedToRole: "Stockpile Controller & Port Foreman",
    suggestedAction: "Lakukan pemadatan (compaction) dozer dan prioritaskan pengumpanan batubara ke tongkang.",
    aiRootCauseAnalysis: "Batubara berkalori sedang dengan kandungan moisture 24% telah menumpuk selama 26 hari tanpa rotasi sirkulasi, memicu oksidasi perlahan.",
    tags: ["Stockpile", "Attention", "Swabakar", "Temperature"],
    channels: ["IN_APP", "PUSH", "TELEGRAM"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "2 jam yang lalu", recipient: "Stockpile In-App" },
      { channel: "TELEGRAM", status: "DELIVERED", sentAt: "2 jam yang lalu", recipient: "Port Ops Telegram" },
    ],
  },
  {
    id: "ALT-2026-006",
    ruleId: "RULE-SPEED-ROAD",
    severity: "ATTENTION", // 🟡
    category: "DISPATCH_HAULING",
    title: "Hauler Speed Exceedance Notice",
    message: "🟡 Unit DT-204 melampaui batas kecepatan jalan tambang (44.5 km/h vs Max 40 km/h).",
    entityId: "DT-204",
    entityType: "FLEET",
    currentValue: "44.5 km/h",
    baselineValue: "40.0 km/h",
    variancePct: 11.2,
    location: "Haul Road Bypass KM 1.2",
    timestamp: "3 jam yang lalu",
    status: "ACKNOWLEDGED",
    acknowledgedBy: "Budi Santoso (Dispatch Spv)",
    acknowledgedAt: "2 jam yang lalu",
    assignedToRole: "Traffic Controller",
    suggestedAction: "Kirim pengingat kecepatan otomatis melalui konsol FMS kabin unit.",
    tags: ["Speeding", "Attention", "Traffic", "Haul Road"],
    channels: ["IN_APP", "PUSH"],
    channelDeliveries: [
      { channel: "IN_APP", status: "READ", sentAt: "3 jam yang lalu", recipient: "Dispatch Console" },
    ],
  },
  {
    id: "ALT-2026-007",
    severity: "NORMAL", // 🟢
    category: "FLEET_FUEL",
    title: "Fuel Farm Tank 01 Normal Restock",
    message: "🟢 Level stok Fuel Farm Tank 01 kembali normal (88% kapasitas) setelah pengisian tangki bbm.",
    entityId: "TANK-01",
    entityType: "SYSTEM",
    currentValue: "396,000 Liter (88%)",
    baselineValue: "150,000 Liter (33%)",
    location: "Main Fuel Farm Depot",
    timestamp: "4 jam yang lalu",
    status: "RESOLVED",
    resolvedAt: "4 jam yang lalu",
    suggestedAction: "Kondisi operasional normal.",
    tags: ["Fuel", "Normal", "Stock", "Resolved"],
    channels: ["IN_APP"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "4 jam yang lalu", recipient: "Fuel Module" },
    ],
  },
  {
    id: "ALT-2026-008",
    severity: "NORMAL", // 🟢
    category: "EQUIPMENT_DOWNTIME",
    title: "Excavator EX-102 Service Completed",
    message: "🟢 Unit EX-102 selesai periodic maintenance 500-jam dan kembali beroperasi normal di Pit West.",
    entityId: "EX-102",
    entityType: "EQUIPMENT",
    currentValue: "PA 94.5%",
    baselineValue: "PA 90.0%",
    location: "Pit West Charlie",
    timestamp: "5 jam yang lalu",
    status: "RESOLVED",
    resolvedAt: "5 jam yang lalu",
    suggestedAction: "Siap beroperasi penuh shift 2.",
    tags: ["Maintenance", "Normal", "EX-102", "Resolved"],
    channels: ["IN_APP"],
    channelDeliveries: [
      { channel: "IN_APP", status: "DELIVERED", sentAt: "5 jam yang lalu", recipient: "Plant System" },
    ],
  },
];

const DEFAULT_GATEWAY_CONFIG: NotificationGatewayConfig = {
  inApp: {
    enabled: true,
    soundEnabled: true,
    autoPopupCritical: true,
  },
  push: {
    enabled: true,
    browserPermission: typeof window !== "undefined" && "Notification" in window ? (Notification.permission as any) : "default",
    vapidKeyConfigured: true,
    sendToRoles: ["MINING_OWNER", "SITE_MANAGER", "MINE_ENGINEER", "DISPATCH_OPERATOR", "HSE_OFFICER"],
  },
  email: {
    enabled: true,
    smtpHost: "smtp.mailgun.org (or smtp.gmail.com)",
    smtpPort: 587,
    senderEmail: "alerts@nusamining.com",
    recipients: [
      { name: "Mining Owner & Board", email: "board@nusamining.com", role: "MINING_OWNER", severities: ["CRITICAL"] },
      { name: "Site General Manager", email: "gm.mine@nusamining.com", role: "SITE_MANAGER", severities: ["CRITICAL", "WARNING"] },
      { name: "Mine Planning Superintendent", email: "engineering@nusamining.com", role: "MINE_ENGINEER", severities: ["CRITICAL", "WARNING"] },
      { name: "Dispatch & Ops Center", email: "dispatch.room@nusamining.com", role: "DISPATCH_OPERATOR", severities: ["CRITICAL", "WARNING", "ATTENTION"] },
      { name: "HSE Head", email: "hse.lead@nusamining.com", role: "HSE_OFFICER", severities: ["CRITICAL", "WARNING"] },
    ],
  },
  whatsapp: {
    enabled: true,
    businessAccountId: "WABA-NMG-INDONESIA-9921",
    apiEndpoint: "https://graph.facebook.com/v19.0/minesmart-wa-cloud",
    phoneNumbers: [
      { name: "Direktur Tambang / CEO", phone: "+62 812-9876-5432", role: "MINING_OWNER", severities: ["CRITICAL"] },
      { name: "General Manager Site Pit 02", phone: "+62 811-2345-6789", role: "SITE_MANAGER", severities: ["CRITICAL", "WARNING"] },
      { name: "Superintendent Produksi", phone: "+62 813-1122-3344", role: "MINE_ENGINEER", severities: ["CRITICAL", "WARNING"] },
      { name: "Dispatcher Hot-Line", phone: "+62 812-5566-7788", role: "DISPATCH_OPERATOR", severities: ["CRITICAL", "WARNING", "ATTENTION"] },
      { name: "Emergency HSE Officer", phone: "+62 811-9988-7766", role: "HSE_OFFICER", severities: ["CRITICAL"] },
    ],
  },
  telegram: {
    enabled: true,
    botToken: "7182947219:AAHX_MineSmartAlertBot_SecureToken",
    botUsername: "MineSmart_MiningAlert_Bot",
    chatIds: [
      { name: "🚨 Mining Ops Room Pit 02 (Group)", chatId: "-1001928475891", type: "GROUP", severities: ["CRITICAL", "WARNING", "ATTENTION"] },
      { name: "📢 NMG Executive Critical Broadcast (Channel)", chatId: "@nmg_mine_critical", type: "CHANNEL", severities: ["CRITICAL"] },
      { name: "👔 Direct GM Notification", chatId: "847291039", type: "DIRECT", severities: ["CRITICAL", "WARNING"] },
    ],
  },
};

const LOCAL_STORAGE_ALERTS_KEY = "minesmart_smart_alerts_v2";
const LOCAL_STORAGE_RULES_KEY = "minesmart_smart_rules_v2";
const LOCAL_STORAGE_GATEWAY_KEY = "minesmart_gateway_config_v2";

export class SmartAlertEngineService {
  public static getAlerts(): SmartAlertItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ALERTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load alerts from storage:", e);
    }
    return INITIAL_ALERTS;
  }

  public static saveAlerts(alerts: SmartAlertItem[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.warn("Failed to save alerts:", e);
    }
  }

  public static getRules(): SmartAlertRule[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load rules from storage:", e);
    }
    return INITIAL_RULES;
  }

  public static saveRules(rules: SmartAlertRule[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn("Failed to save rules:", e);
    }
  }

  public static getGatewayConfig(): NotificationGatewayConfig {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_GATEWAY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load gateway config:", e);
    }
    return DEFAULT_GATEWAY_CONFIG;
  }

  public static saveGatewayConfig(config: NotificationGatewayConfig): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_GATEWAY_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn("Failed to save gateway config:", e);
    }
  }

  public static getSummary(alerts: SmartAlertItem[]): SmartAlertSummary {
    const active = alerts.filter((a) => a.status === "ACTIVE");
    const criticalCount = active.filter((a) => a.severity === "CRITICAL").length;
    const warningCount = active.filter((a) => a.severity === "WARNING").length;
    const attentionCount = active.filter((a) => a.severity === "ATTENTION").length;
    const normalCount = alerts.filter((a) => a.severity === "NORMAL").length;
    const acknowledgedCount = alerts.filter((a) => a.status === "ACKNOWLEDGED").length;
    const resolvedTodayCount = alerts.filter((a) => a.status === "RESOLVED").length;

    const channelDeliveryTotals: Record<NotificationChannel, number> = {
      IN_APP: 0,
      PUSH: 0,
      EMAIL: 0,
      WHATSAPP: 0,
      TELEGRAM: 0,
    };

    alerts.forEach((alt) => {
      alt.channels.forEach((ch) => {
        if (channelDeliveryTotals[ch] !== undefined) {
          channelDeliveryTotals[ch]++;
        }
      });
    });

    return {
      totalActive: active.length,
      criticalCount,
      warningCount,
      attentionCount,
      normalCount,
      acknowledgedCount,
      resolvedTodayCount,
      mttrMinutes: 32.4,
      channelDeliveryTotals,
    };
  }

  public static acknowledgeAlert(alertId: string, userName: string = "Mine Operator"): SmartAlertItem[] {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: "ACKNOWLEDGED" as AlertStatus,
          acknowledgedBy: userName,
          acknowledgedAt: "Baru saja",
        };
      }
      return a;
    });
    this.saveAlerts(updated);
    return updated;
  }

  public static resolveAlert(alertId: string): SmartAlertItem[] {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: "RESOLVED" as AlertStatus,
          resolvedAt: "Baru saja",
        };
      }
      return a;
    });
    this.saveAlerts(updated);
    return updated;
  }

  // Multi-Channel Dispatch Execution
  public static dispatchMultiChannelAlert(params: {
    title: string;
    message: string;
    severity: SmartAlertSeverity;
    category: SmartAlertCategory;
    entityId: string;
    entityType: "EQUIPMENT" | "PIT" | "STOCKPILE" | "FLEET" | "OPERATOR" | "SYSTEM";
    currentValue: string | number;
    baselineValue: string | number;
    variancePct?: number;
    location?: string;
    suggestedAction: string;
    aiRootCauseAnalysis?: string;
    tags?: string[];
    channels?: NotificationChannel[];
  }): SmartAlertItem {
    const alerts = this.getAlerts();
    const gateway = this.getGatewayConfig();
    const id = `ALT-${Date.now().toString().slice(-6)}`;
    const targetChannels = params.channels || ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"];

    const nowStr = "Baru saja";
    const deliveries: ChannelDeliveryStatus[] = [];

    if (targetChannels.includes("IN_APP") && gateway.inApp.enabled) {
      deliveries.push({
        channel: "IN_APP",
        status: "DELIVERED",
        sentAt: nowStr,
        recipient: "All Dispatch Terminals & In-App Bell",
      });
    }

    if (targetChannels.includes("PUSH") && gateway.push.enabled) {
      deliveries.push({
        channel: "PUSH",
        status: "DELIVERED",
        sentAt: nowStr,
        recipient: `Mobile Push (${gateway.push.sendToRoles.join(", ")})`,
        externalRefId: `PUSH-VAPID-${Date.now().toString().slice(-5)}`,
      });

      // Attempt native browser notification if permitted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(params.title, {
            body: params.message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: id,
          });
        } catch (e) {
          console.log("Browser notification suppressed in sandbox/iframe:", e);
        }
      }
    }

    if (targetChannels.includes("EMAIL") && gateway.email.enabled) {
      const emailRecipients = gateway.email.recipients
        .filter((r) => r.severities.includes(params.severity))
        .map((r) => r.email)
        .join(", ");

      deliveries.push({
        channel: "EMAIL",
        status: "SENT",
        sentAt: nowStr,
        recipient: emailRecipients || gateway.email.recipients[0]?.email || "management@nusamining.com",
        externalRefId: `SMTP-${Date.now().toString().slice(-5)}`,
      });
    }

    if (targetChannels.includes("WHATSAPP") && gateway.whatsapp.enabled) {
      const waRecipients = gateway.whatsapp.phoneNumbers
        .filter((r) => r.severities.includes(params.severity))
        .map((r) => `${r.name} (${r.phone})`)
        .join(", ");

      deliveries.push({
        channel: "WHATSAPP",
        status: "DELIVERED",
        sentAt: nowStr,
        recipient: waRecipients || "+62 812-9876-5432",
        externalRefId: `WABA-${Date.now().toString().slice(-5)}`,
      });
    }

    if (targetChannels.includes("TELEGRAM") && gateway.telegram.enabled) {
      const tgTargets = gateway.telegram.chatIds
        .filter((c) => c.severities.includes(params.severity))
        .map((c) => `${c.name} [${c.chatId}]`)
        .join(", ");

      deliveries.push({
        channel: "TELEGRAM",
        status: "DELIVERED",
        sentAt: nowStr,
        recipient: tgTargets || "@MineSmart_MiningAlert_Bot",
        externalRefId: `TG-MSG-${Date.now().toString().slice(-5)}`,
      });
    }

    const newAlert: SmartAlertItem = {
      id,
      severity: params.severity,
      category: params.category,
      title: params.title,
      message: params.message,
      entityId: params.entityId,
      entityType: params.entityType,
      currentValue: params.currentValue,
      baselineValue: params.baselineValue,
      variancePct: params.variancePct,
      location: params.location || "Pit 02 Area",
      timestamp: nowStr,
      status: "ACTIVE",
      channels: targetChannels,
      channelDeliveries: deliveries,
      assignedToRole: "Site General Manager & Dispatch Lead",
      suggestedAction: params.suggestedAction,
      aiRootCauseAnalysis: params.aiRootCauseAnalysis,
      tags: params.tags || ["Multi-Channel", "Real-Time"],
    };

    const updated = [newAlert, ...alerts];
    this.saveAlerts(updated);

    // Audio chime if enabled
    if (gateway.inApp.soundEnabled) {
      this.playAlertSound(params.severity);
    }

    return newAlert;
  }

  // Trigger Featured Example Alert: Pit 02 Monthly Production Deficit
  public static triggerPit02ShortfallAlert(): SmartAlertItem {
    return this.dispatchMultiChannelAlert({
      title: "🚨 Critical Alert — Produksi Pit 02 Gagal Mencapai Target",
      message: "Produksi Pit 02 diprediksi gagal mencapai target bulanan.",
      severity: "CRITICAL",
      category: "PRODUCTION_TARGET",
      entityId: "PIT-02",
      entityType: "PIT",
      currentValue: "432,000 MT (Proyeksi)",
      baselineValue: "480,000 MT (Target RKAB)",
      variancePct: -10.0,
      location: "Pit 02 South Seam A & B",
      suggestedAction: "1. Alihkan 4 unit DT dari Pit 02 ke Pit 01 untuk menghindari antrean idle. 2. Prioritaskan perbaikan hidrolik Excavator EX-03. 3. Kerahkan Motor Grader untuk scraping lumpur KM 4.2.",
      aiRootCauseAnalysis: "AI Predictive Engine mendeteksi shortfall 48,000 MT akibat: (1) Downtime Excavator Utama EX-03 selama 4.2 jam, (2) Hambatan jalan hauling KM 4.2 pasca hujan meningkatkan cycle time 4.2 menit, (3) Bottleneck antrean dump truck di hopper Crusher 02.",
      tags: ["Critical", "Production", "Pit 02", "RKAB", "Deficit Risk", "Multi-Channel Dispatched"],
      channels: ["IN_APP", "PUSH", "EMAIL", "WHATSAPP", "TELEGRAM"],
    });
  }

  public static playAlertSound(severity: SmartAlertSeverity = "CRITICAL"): void {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (severity === "CRITICAL") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio playback before user interaction might be restricted
    }
  }

  public static triggerSimulatedAlert(
    severity: SmartAlertSeverity,
    customMessage?: string
  ): SmartAlertItem {
    if (severity === "CRITICAL") {
      return this.triggerPit02ShortfallAlert();
    }

    return this.dispatchMultiChannelAlert({
      title: severity === "WARNING" ? "🟠 Fuel Anomaly Warning" : severity === "ATTENTION" ? "🟡 Stockpile Temperature Rise" : "🟢 Production Normal",
      message: customMessage || (severity === "WARNING" ? "⚠️ HD785-05 memiliki fuel consumption 18% di atas baseline." : severity === "ATTENTION" ? "🟡 Suhu tumpukan batubara Seam 11 naik ke 56°C." : "🟢 Ritase Pit North shift 1 telah mencapai 100% target RKAB."),
      severity,
      category: severity === "WARNING" ? "FLEET_FUEL" : severity === "ATTENTION" ? "STOCKPILE_ENVIRONMENT" : "PRODUCTION_TARGET",
      entityId: severity === "WARNING" ? "HD785-05" : severity === "ATTENTION" ? "ROM-11" : "PIT-NORTH",
      entityType: severity === "WARNING" ? "FLEET" : severity === "ATTENTION" ? "STOCKPILE" : "PIT",
      currentValue: severity === "WARNING" ? "81.4 L/Jam" : severity === "ATTENTION" ? "56.0°C" : "18,200 MT",
      baselineValue: severity === "WARNING" ? "69.0 L/Jam" : severity === "ATTENTION" ? "40.0°C" : "18,000 MT",
      variancePct: severity === "WARNING" ? 18.0 : severity === "ATTENTION" ? 40.0 : 1.1,
      location: "Mining Area",
      suggestedAction: severity === "WARNING" ? "Periksa nozzle injector dan kalibrasi grade jalan." : severity === "ATTENTION" ? "Lakukan pemadatan dozer." : "Kondisi optimal.",
      channels: severity === "WARNING" ? ["IN_APP", "PUSH", "WHATSAPP", "TELEGRAM"] : severity === "ATTENTION" ? ["IN_APP", "PUSH", "TELEGRAM"] : ["IN_APP"],
    });
  }
}
