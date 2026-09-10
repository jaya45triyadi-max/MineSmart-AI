// MINE SMART AI - Real-Time Alert Rule Engine

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type AlertCategory =
  | "PRODUCTION"
  | "FLEET"
  | "FUEL"
  | "MAINTENANCE"
  | "HSE"
  | "STOCKPILE"
  | "COST"
  | "SYSTEM"
  | "LICENSE";

export interface AlertRule {
  id: string;
  name: string;
  category: AlertCategory;
  metricKey: string;
  condition: "LESS_THAN" | "GREATER_THAN" | "EQUAL" | "NOT_EQUAL";
  thresholdValue: number;
  severity: AlertSeverity;
  enabled: boolean;
  descriptionTemplate: string;
  recommendedAction: string;
}

export interface DashboardAlertItem {
  id: string;
  ruleId?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  timestamp: string;
  timeFormatted: string;
  source: string;
  siteId?: string;
  companyId?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionText: string;
  actionModuleKey?: string;
  metadata?: Record<string, any>;
}

export class AlertRuleEngine {
  private static defaultRules: AlertRule[] = [
    {
      id: "RULE-PROD-01",
      name: "Pencapaian Produksi di Bawah Target Critical",
      category: "PRODUCTION",
      metricKey: "productionAchievementPct",
      condition: "LESS_THAN",
      thresholdValue: 85,
      severity: "CRITICAL",
      enabled: true,
      descriptionTemplate: "Target produksi harian batu bara tercapai {value}%, di bawah batas kritis 85%.",
      recommendedAction: "Evaluasi hambatan loader & hauling cycle time di Pit North.",
    },
    {
      id: "RULE-FLEET-01",
      name: "Penurunan Utilisasi Fleet (UA)",
      category: "FLEET",
      metricKey: "fleetUtilizationPct",
      condition: "LESS_THAN",
      thresholdValue: 72,
      severity: "HIGH",
      enabled: true,
      descriptionTemplate: "Utilisasi alat berat (UA) turun ke {value}% dalam 2 jam terakhir.",
      recommendedAction: "Periksa ketersediaan operator & jam standby dump truck.",
    },
    {
      id: "RULE-FUEL-01",
      name: "Lonjakan Anomali Konsumsi Bahan Bakar",
      category: "FUEL",
      metricKey: "fuelVariancePct",
      condition: "GREATER_THAN",
      thresholdValue: 8,
      severity: "HIGH",
      enabled: true,
      descriptionTemplate: "Konsumsi solar meningkat +{value}% melebihi rata-rata histori 7 hari.",
      recommendedAction: "Buka modul Fuel Analytics untuk audit dispensing solar alat berat.",
    },
    {
      id: "RULE-HSE-01",
      name: "Incident / Near Miss Tingkat Tinggi Registered",
      category: "HSE",
      metricKey: "highRiskIncidentCount",
      condition: "GREATER_THAN",
      thresholdValue: 0,
      severity: "CRITICAL",
      enabled: true,
      descriptionTemplate: "Terdeteksi {value} insiden potensi bahaya tinggi / Near Miss di area blasting Pit A.",
      recommendedAction: "Gelar Stand Down Safety dan verifikasi JSA sebelum melanjutkan blasting.",
    },
    {
      id: "RULE-STOCKPILE-01",
      name: "Kapasitas Stockpile Mendekati Penuh",
      category: "STOCKPILE",
      metricKey: "stockpileOccupancyPct",
      condition: "GREATER_THAN",
      thresholdValue: 88,
      severity: "HIGH",
      enabled: true,
      descriptionTemplate: "Kapasitas penampungan batu bara di Stockpile Port A mencapai {value}%.",
      recommendedAction: "Percepat jadwal barging loading & koordinasikan dengan agen kapal.",
    },
  ];

  public static getDefaultRules(): AlertRule[] {
    return [...this.defaultRules];
  }

  /**
   * Generates active real-time alerts by evaluating current operational data against rules
   */
  public static evaluateRules(metrics: {
    productionAchievementPct: number;
    fleetUtilizationPct: number;
    fuelVariancePct: number;
    highRiskIncidentCount: number;
    stockpileOccupancyPct: number;
    costVariancePct?: number;
    siteName?: string;
  }): DashboardAlertItem[] {
    const alerts: DashboardAlertItem[] = [];
    const now = new Date();

    // 1. Critical Production Target Alert
    if (metrics.productionAchievementPct < 85) {
      alerts.push({
        id: "ALT-PROD-101",
        ruleId: "RULE-PROD-01",
        severity: "CRITICAL",
        category: "PRODUCTION",
        title: "Pencapaian Produksi Kritis (<85%)",
        description: `Pencapaian produksi batu bara harian hanya ${metrics.productionAchievementPct.toFixed(1)}% dari target (${(100 - metrics.productionAchievementPct).toFixed(1)}% defisit).`,
        timestamp: new Date(now.getTime() - 12 * 60000).toISOString(),
        timeFormatted: "12 menit lalu",
        source: "Production Module",
        acknowledged: false,
        actionText: "Tinjau Detail Produksi",
        actionModuleKey: "production",
      });
    } else if (metrics.productionAchievementPct < 92) {
      alerts.push({
        id: "ALT-PROD-102",
        ruleId: "RULE-PROD-02",
        severity: "MEDIUM",
        category: "PRODUCTION",
        title: "Deviasi Produksi Ringan",
        description: `Pencapaian produksi harian ${metrics.productionAchievementPct.toFixed(1)}% sedikit di bawah target optimal 100%.`,
        timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
        timeFormatted: "45 menit lalu",
        source: "Production Module",
        acknowledged: false,
        actionText: "Cek Pit Production",
        actionModuleKey: "production",
      });
    }

    // 2. High Risk HSE Incident Alert
    if (metrics.highRiskIncidentCount > 0) {
      alerts.push({
        id: "ALT-HSE-901",
        ruleId: "RULE-HSE-01",
        severity: "CRITICAL",
        category: "HSE",
        title: "CRITICAL HSE ALERT: High Risk Near Miss",
        description: "Laporan insiden berisiko tinggi terdeteksi di Pit South. Tim K3LH perlu segera melakukan verifikasi mitigasi.",
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        timeFormatted: "25 menit lalu",
        source: "HSE Module",
        acknowledged: false,
        actionText: "Inspeksi HSE Now",
        actionModuleKey: "hse",
      });
    }

    // 3. Fuel Consumption Anomaly Alert
    if (metrics.fuelVariancePct > 8) {
      alerts.push({
        id: "ALT-FUEL-301",
        ruleId: "RULE-FUEL-01",
        severity: "HIGH",
        category: "FUEL",
        title: "Anomali Lonjakan Konsumsi Solar (+8.7%)",
        description: `Konsumsi bahan bakar solar meningkat +${metrics.fuelVariancePct.toFixed(1)}% dibandingkan baseline 7 hari terakhir tanpa peningkatan jarak angkut setara.`,
        timestamp: new Date(now.getTime() - 65 * 60000).toISOString(),
        timeFormatted: "1 jam lalu",
        source: "Fuel Management System",
        acknowledged: false,
        actionText: "Audit BBM",
        actionModuleKey: "fuel",
      });
    }

    // 4. Fleet Utilization Drop Alert
    if (metrics.fleetUtilizationPct < 75) {
      alerts.push({
        id: "ALT-FLEET-201",
        ruleId: "RULE-FLEET-01",
        severity: "HIGH",
        category: "FLEET",
        title: "Penurunan Utilisasi Fleet Trucking",
        description: `Utilisasi alat angkut (UA) berada di angka ${metrics.fleetUtilizationPct.toFixed(1)}%. Terdeteksi 11 unit dump truck mengalami antrean idle di ROM crusher.`,
        timestamp: new Date(now.getTime() - 110 * 60000).toISOString(),
        timeFormatted: "1.8 jam lalu",
        source: "Fleet Management System",
        acknowledged: false,
        actionText: "Buka Dispatch Center",
        actionModuleKey: "fleet",
      });
    }

    // 5. Stockpile Capacity Alert
    if (metrics.stockpileOccupancyPct > 85) {
      alerts.push({
        id: "ALT-STK-401",
        ruleId: "RULE-STOCKPILE-01",
        severity: "HIGH",
        category: "STOCKPILE",
        title: "Stockpile Mendekati Kapasitas Maksimum",
        description: `Okupansi penampungan batu bara di ROM Stockpile A mencapai ${metrics.stockpileOccupancyPct.toFixed(1)}%. Sisa kapasitas aman tinggal 15.000 ton.`,
        timestamp: new Date(now.getTime() - 180 * 60000).toISOString(),
        timeFormatted: "3 jam lalu",
        source: "Stockpile & Logistics",
        acknowledged: false,
        actionText: "Atur Barging",
        actionModuleKey: "stockpile",
      });
    }

    // 6. Maintenance Warning Alert (Always relevant in active mine)
    alerts.push({
      id: "ALT-MAINT-501",
      category: "MAINTENANCE",
      severity: "MEDIUM",
      title: "Jadwal Servis Berkala EX-204 Overshoot",
      description: "Excavator CAT 6020B (EX-204) telah melampaui 250 jam operasi tanpa servis oli berkala.",
      timestamp: new Date(now.getTime() - 240 * 60000).toISOString(),
      timeFormatted: "4 jam lalu",
      source: "CMMS Maintenance",
      acknowledged: false,
      actionText: "Jadwalkan PM",
      actionModuleKey: "maintenance",
    });

    // 7. System Info Alert
    alerts.push({
      id: "ALT-SYS-001",
      category: "SYSTEM",
      severity: "INFO",
      title: "Sinkronisasi Realtime Firestore Aktif",
      description: "Telemetri IoT GPS Fleet dan Fuel Dispenser terhubung dengan latency < 1.2 detik.",
      timestamp: new Date(now.getTime() - 360 * 60000).toISOString(),
      timeFormatted: "6 jam lalu",
      source: "MINE SMART AI Core",
      acknowledged: true,
      actionText: "Cek Status System",
      actionModuleKey: "settings",
    });

    return alerts.sort((a, b) => {
      const severityMap: Record<AlertSeverity, number> = {
        CRITICAL: 5,
        HIGH: 4,
        MEDIUM: 3,
        LOW: 2,
        INFO: 1,
      };
      return severityMap[b.severity] - severityMap[a.severity];
    });
  }
}
