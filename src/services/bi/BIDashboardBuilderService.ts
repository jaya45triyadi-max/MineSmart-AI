// MINE SMART AI - BI Dashboard Builder Service & Mock Data Engine
// Real-time telemetry generator, persistence, and widget catalog

import {
  CustomBIDashboard,
  CustomBIWidget,
  WidgetPaletteItem,
  KPIMetricData,
  ProductionSeriesPoint,
  FleetTelemetryData,
  FuelConsumptionPoint,
  CostBreakdownItem,
  AIInsightCard,
  MapPitFeature,
} from "../../types/biBuilderTypes";

const STORAGE_KEY = "mine_smart_ai_custom_bi_dashboards";

export class BIDashboardBuilderService {
  // Widget Palette Catalogue for Drag & Drop
  public static getWidgetCatalog(): WidgetPaletteItem[] {
    return [
      // 1. PRODUCTION
      {
        id: "pal-prod-area",
        title: "Coal & OB Production Curve",
        category: "PRODUCTION",
        description: "Grafik area/line realisasi vs target batubara dan overburden per jam/shift.",
        defaultWidth: 8,
        iconName: "Pickaxe",
        defaultConfig: {
          chartType: "AREA",
          timeRange: "TODAY",
          showLegend: true,
          colorTheme: "amber",
        },
      },
      {
        id: "pal-prod-bar",
        title: "Pit Production Breakdown",
        category: "PRODUCTION",
        description: "Diagram batang komparasi volume produksi per pit tambang.",
        defaultWidth: 4,
        iconName: "BarChart3",
        defaultConfig: {
          chartType: "BAR",
          timeRange: "TODAY",
          colorTheme: "amber",
        },
      },
      {
        id: "pal-prod-sr",
        title: "Stripping Ratio (SR) Trajectory",
        category: "PRODUCTION",
        description: "Garis tren rasio pengupasan tanah (BCM/MT) vs RKAB planned limit.",
        defaultWidth: 6,
        iconName: "TrendingUp",
        defaultConfig: {
          chartType: "LINE",
          timeRange: "30D",
          colorTheme: "purple",
        },
      },

      // 2. FLEET
      {
        id: "pal-fleet-availability",
        title: "Fleet Availability (PA / UA / MA)",
        category: "FLEET",
        description: "Metrik ketersediaan fisik, utilisasi, dan kesiapan mekanis unit alat berat.",
        defaultWidth: 6,
        iconName: "Truck",
        defaultConfig: {
          chartType: "GAUGE",
          timeRange: "SHIFT",
          colorTheme: "blue",
        },
      },
      {
        id: "pal-fleet-cycles",
        title: "Hauler Cycle Time Analysis",
        category: "FLEET",
        description: "Rincian waktu siklus hauling (travel empty, spotting, loading, dump).",
        defaultWidth: 6,
        iconName: "Clock",
        defaultConfig: {
          chartType: "BAR",
          timeRange: "SHIFT",
          colorTheme: "cyan",
        },
      },
      {
        id: "pal-fleet-status-donut",
        title: "Fleet Status Distribution",
        category: "FLEET",
        description: "Persentase unit: Operating, Standby, Breakdown, dan Refueling.",
        defaultWidth: 4,
        iconName: "PieChart",
        defaultConfig: {
          chartType: "DONUT",
          timeRange: "SHIFT",
          colorTheme: "emerald",
        },
      },

      // 3. FUEL
      {
        id: "pal-fuel-burn",
        title: "Fuel Burn Rate by Class",
        category: "FUEL",
        description: "Tingkat konsumsi BBM solar (L/Jam) per model excavator dan dump truck.",
        defaultWidth: 6,
        iconName: "Fuel",
        defaultConfig: {
          chartType: "BAR",
          timeRange: "TODAY",
          colorTheme: "rose",
        },
      },
      {
        id: "pal-fuel-tanks",
        title: "Storage Tank Stock & Burn Index",
        category: "FUEL",
        description: "Level stok tangki induk BBM, fuel truck site, dan Fuel Ratio L/BCM.",
        defaultWidth: 6,
        iconName: "Layers",
        defaultConfig: {
          chartType: "AREA",
          timeRange: "7D",
          colorTheme: "amber",
        },
      },

      // 4. COST
      {
        id: "pal-cost-breakdown",
        title: "Mining Cost Component Breakdown",
        category: "COST",
        description: "Struktur biaya operasional (Fuel, Parts/Maint, Labor, Handak, Overheads).",
        defaultWidth: 6,
        iconName: "Coins",
        defaultConfig: {
          chartType: "DONUT",
          timeRange: "MTD",
          colorTheme: "emerald",
        },
      },
      {
        id: "pal-cost-per-unit",
        title: "Cost Per Ton & Cost Per BCM",
        category: "COST",
        description: "Grafik komparasi biaya per ton ($/MT) vs baseline RKAB Budget.",
        defaultWidth: 6,
        iconName: "DollarSign",
        defaultConfig: {
          chartType: "LINE",
          timeRange: "MTD",
          colorTheme: "blue",
        },
      },

      // 5. MAP
      {
        id: "pal-map-pit",
        title: "Interactive Pit & Fleet Spatial Map",
        category: "MAP",
        description: "Peta interaktif batas pit tambang, rute hauling, stockpile, dan lokasi live GPS armada.",
        defaultWidth: 12,
        iconName: "MapPin",
        defaultConfig: {
          mapZoom: 14,
          mapCenterPit: "PIT_NORTH_ALPHA",
          colorTheme: "emerald",
        },
      },

      // 6. KPI CARD
      {
        id: "pal-kpi-metric",
        title: "Modular KPI Metric Card",
        category: "KPI",
        description: "Kartu indikator performa utama dengan sparkline tren dan target variance.",
        defaultWidth: 3,
        iconName: "Activity",
        defaultConfig: {
          metricKey: "TOTAL_COAL_TODAY",
          colorTheme: "amber",
        },
      },

      // 7. TABLE
      {
        id: "pal-table-logs",
        title: "Shift Operational & Telematics Table",
        category: "TABLE",
        description: "Tabel data tabular langsung dari Pit dispatch logs, antrean crusher & fleet health.",
        defaultWidth: 12,
        iconName: "Table",
        defaultConfig: {
          dataSource: "SHIFT_DISPATCH",
          tableLimit: 10,
        },
      },

      // 8. AI INSIGHT
      {
        id: "pal-ai-intelligence",
        title: "Gemini Mining AI Insight Engine",
        category: "AI_INSIGHT",
        description: "Sintesis cerdas anomali operasional, prediksi bottleneck, dan rekomendasi preskriptif.",
        defaultWidth: 12,
        iconName: "Sparkles",
        defaultConfig: {
          aiFocusPrompt: "Analyze current shift production bottleneck and fuel efficiency anomalies.",
          colorTheme: "purple",
        },
      },
    ];
  }

  // Initial Presets
  private static defaultDashboards: CustomBIDashboard[] = [
    {
      id: "dash-exec-master",
      title: "Executive Mining Intelligence 360°",
      description: "Tinjauan komprehensif C-Level: Target Batubara, Kesiapan Fleet, Efisiensi BBM, Biaya & AI Insight.",
      category: "EXECUTIVE",
      createdAt: "2026-08-01T08:00:00Z",
      updatedAt: "2026-08-16T08:00:00Z",
      author: "Mining Director",
      isPreset: true,
      autoRefreshInterval: 15,
      widgets: [
        {
          id: "w-kpi-1",
          title: "Total Coal Production Today",
          category: "KPI",
          width: 3,
          config: { metricKey: "TOTAL_COAL_TODAY", colorTheme: "amber" },
        },
        {
          id: "w-kpi-2",
          title: "Overburden (OB) Volume",
          category: "KPI",
          width: 3,
          config: { metricKey: "OB_VOLUME_TODAY", colorTheme: "blue" },
        },
        {
          id: "w-kpi-3",
          title: "Fleet Physical Availability (PA)",
          category: "KPI",
          width: 3,
          config: { metricKey: "FLEET_PA", colorTheme: "emerald" },
        },
        {
          id: "w-kpi-4",
          title: "Mining Cost Per Ton",
          category: "KPI",
          width: 3,
          config: { metricKey: "COST_PER_TON", colorTheme: "purple" },
        },
        {
          id: "w-prod-chart",
          title: "Daily Coal & Overburden Hourly Output",
          category: "PRODUCTION",
          width: 8,
          config: { chartType: "AREA", colorTheme: "amber", showLegend: true },
        },
        {
          id: "w-fleet-donut",
          title: "Fleet Operational Status",
          category: "FLEET",
          width: 4,
          config: { chartType: "DONUT", colorTheme: "emerald" },
        },
        {
          id: "w-map-live",
          title: "Pit North Alpha & Fleet Spatial Telemetry",
          category: "MAP",
          width: 8,
          config: { mapZoom: 14, mapCenterPit: "PIT_NORTH_ALPHA" },
        },
        {
          id: "w-cost-chart",
          title: "Opex Expense Breakdown",
          category: "COST",
          width: 4,
          config: { chartType: "DONUT", colorTheme: "emerald" },
        },
        {
          id: "w-ai-prescriptive",
          title: "Gemini Mining AI Prescriptive Anomaly & Optimization",
          category: "AI_INSIGHT",
          width: 12,
          config: { colorTheme: "purple" },
        },
      ],
    },
    {
      id: "dash-ops-fleet",
      title: "Pit Operations & Fleet Dispatch Control",
      description: "Pemantauan teknis utilisasi fleet, antrean excavator, cycle time, dan konsumsi BBM per unit.",
      category: "OPERATIONS",
      createdAt: "2026-08-05T09:00:00Z",
      updatedAt: "2026-08-16T08:00:00Z",
      author: "Mine Operations Head",
      isPreset: true,
      autoRefreshInterval: 10,
      widgets: [
        {
          id: "w-f-kpi-1",
          title: "Active Haulers in Pit",
          category: "KPI",
          width: 3,
          config: { metricKey: "ACTIVE_HAULERS", colorTheme: "blue" },
        },
        {
          id: "w-f-kpi-2",
          title: "Average Haul Cycle Time",
          category: "KPI",
          width: 3,
          config: { metricKey: "CYCLE_TIME", colorTheme: "cyan" },
        },
        {
          id: "w-f-kpi-3",
          title: "Excavator Productivity",
          category: "KPI",
          width: 3,
          config: { metricKey: "EXCAVATOR_PROD", colorTheme: "amber" },
        },
        {
          id: "w-f-kpi-4",
          title: "Fuel Ratio (L/BCM)",
          category: "KPI",
          width: 3,
          config: { metricKey: "FUEL_RATIO", colorTheme: "rose" },
        },
        {
          id: "w-f-map",
          title: "Live GPS Hauling Tracking & Geofence Pit",
          category: "MAP",
          width: 12,
          config: { mapZoom: 14 },
        },
        {
          id: "w-f-cycles",
          title: "Haul Cycle Stages Distribution (Minutes)",
          category: "FLEET",
          width: 6,
          config: { chartType: "BAR", colorTheme: "cyan" },
        },
        {
          id: "w-f-burn",
          title: "Fuel Burn Rate by Model Class (L/Hour)",
          category: "FUEL",
          width: 6,
          config: { chartType: "BAR", colorTheme: "rose" },
        },
        {
          id: "w-f-table",
          title: "Live Pit Dispatch & Equipment Health Stream",
          category: "TABLE",
          width: 12,
          config: { dataSource: "SHIFT_DISPATCH", tableLimit: 8 },
        },
      ],
    },
    {
      id: "dash-fuel-cost",
      title: "Fuel Management & Cost Optimizer",
      description: "Analisis konsumsi solar, rasio efisiensi L/BCM, struktur OPEX, dan deviasi anggaran belanja.",
      category: "FUEL_COST",
      createdAt: "2026-08-10T11:00:00Z",
      updatedAt: "2026-08-16T08:00:00Z",
      author: "Finance & Supply Chain Lead",
      isPreset: true,
      autoRefreshInterval: 30,
      widgets: [
        {
          id: "w-fc-kpi-1",
          title: "Fuel Consumed Today",
          category: "KPI",
          width: 4,
          config: { metricKey: "FUEL_TODAY", colorTheme: "rose" },
        },
        {
          id: "w-fc-kpi-2",
          title: "Mining Cost Per BCM",
          category: "KPI",
          width: 4,
          config: { metricKey: "COST_PER_BCM", colorTheme: "purple" },
        },
        {
          id: "w-fc-kpi-3",
          title: "Fuel Farm Storage Level",
          category: "KPI",
          width: 4,
          config: { metricKey: "FUEL_FARM_LEVEL", colorTheme: "emerald" },
        },
        {
          id: "w-fc-burn-trend",
          title: "7-Day Fuel Consumption & Ratio Curve",
          category: "FUEL",
          width: 6,
          config: { chartType: "AREA", colorTheme: "amber" },
        },
        {
          id: "w-fc-cost-unit",
          title: "Unit Cost vs RKAB Baseline ($/MT)",
          category: "COST",
          width: 6,
          config: { chartType: "LINE", colorTheme: "blue" },
        },
        {
          id: "w-fc-breakdown",
          title: "Detailed Operational Cost Structure",
          category: "COST",
          width: 6,
          config: { chartType: "DONUT", colorTheme: "emerald" },
        },
        {
          id: "w-fc-ai",
          title: "AI Fuel Conservation & Cost Saving Recommendations",
          category: "AI_INSIGHT",
          width: 6,
          config: { colorTheme: "purple" },
        },
      ],
    },
  ];

  // Dashboard CRUD Methods
  public static getAllDashboards(): CustomBIDashboard[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved dashboards:", e);
      }
    }
    return this.defaultDashboards;
  }

  public static saveDashboard(dash: CustomBIDashboard): void {
    const all = this.getAllDashboards();
    const idx = all.findIndex((d) => d.id === dash.id);
    if (idx >= 0) {
      all[idx] = { ...dash, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...dash, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  public static deleteDashboard(dashboardId: string): boolean {
    const all = this.getAllDashboards();
    const filtered = all.filter((d) => d.id !== dashboardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  public static createNewDashboard(title: string, description: string): CustomBIDashboard {
    const newDash: CustomBIDashboard = {
      id: `dash-custom-${Date.now()}`,
      title: title || "Custom Mine Dashboard",
      description: description || "Custom user-built analytics dashboard",
      category: "CUSTOM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Current User",
      isPreset: false,
      autoRefreshInterval: 15,
      widgets: [
        {
          id: `w-kpi-${Date.now()}`,
          title: "Total Coal Output",
          category: "KPI",
          width: 4,
          config: { metricKey: "TOTAL_COAL_TODAY", colorTheme: "amber" },
        },
        {
          id: `w-prod-${Date.now()}`,
          title: "Coal & OB Production Curve",
          category: "PRODUCTION",
          width: 8,
          config: { chartType: "AREA", colorTheme: "amber" },
        },
      ],
    };
    this.saveDashboard(newDash);
    return newDash;
  }

  // Telemetry & Real-Time Mock Data Providers
  public static getKPIMetrics(): Record<string, KPIMetricData> {
    return {
      TOTAL_COAL_TODAY: {
        id: "TOTAL_COAL_TODAY",
        name: "Produksi Batubara Hari Ini",
        value: 16840,
        unit: "MT",
        changePct: 4.8,
        isPositiveGood: true,
        target: 16000,
        status: "GOOD",
        sparkline: [14200, 15100, 15800, 16200, 15900, 16500, 16840],
        category: "PRODUCTION",
      },
      OB_VOLUME_TODAY: {
        id: "OB_VOLUME_TODAY",
        name: "Pengupasan OB Hari Ini",
        value: 94250,
        unit: "BCM",
        changePct: 2.1,
        isPositiveGood: true,
        target: 92000,
        status: "GOOD",
        sparkline: [88000, 89500, 91000, 93000, 92500, 93800, 94250],
        category: "PRODUCTION",
      },
      FLEET_PA: {
        id: "FLEET_PA",
        name: "Physical Availability (PA)",
        value: 91.4,
        unit: "%",
        changePct: 1.2,
        isPositiveGood: true,
        target: 90.0,
        status: "GOOD",
        sparkline: [89.2, 89.8, 90.1, 90.5, 91.0, 90.8, 91.4],
        category: "FLEET",
      },
      COST_PER_TON: {
        id: "COST_PER_TON",
        name: "Mining Cost Per Ton",
        value: 24.15,
        unit: "$/MT",
        changePct: -3.2,
        isPositiveGood: false,
        target: 25.0,
        status: "GOOD",
        sparkline: [25.8, 25.4, 24.9, 24.8, 24.5, 24.3, 24.15],
        category: "COST",
      },
      ACTIVE_HAULERS: {
        id: "ACTIVE_HAULERS",
        name: "Dump Truck Beroperasi",
        value: 48,
        unit: "Unit",
        changePct: 0,
        isPositiveGood: true,
        target: 52,
        status: "GOOD",
        sparkline: [46, 47, 48, 48, 47, 48, 48],
        category: "FLEET",
      },
      CYCLE_TIME: {
        id: "CYCLE_TIME",
        name: "Rata-rata Cycle Time",
        value: 24.8,
        unit: "Menit",
        changePct: -5.1,
        isPositiveGood: false,
        target: 26.0,
        status: "GOOD",
        sparkline: [27.2, 26.8, 26.1, 25.5, 25.2, 25.0, 24.8],
        category: "FLEET",
      },
      EXCAVATOR_PROD: {
        id: "EXCAVATOR_PROD",
        name: "Produktivitas Excavator",
        value: 845,
        unit: "BCM/Jam",
        changePct: 6.3,
        isPositiveGood: true,
        target: 800,
        status: "GOOD",
        sparkline: [780, 795, 810, 820, 830, 835, 845],
        category: "FLEET",
      },
      FUEL_RATIO: {
        id: "FUEL_RATIO",
        name: "Fuel Ratio Index",
        value: 0.42,
        unit: "L/BCM",
        changePct: -2.3,
        isPositiveGood: false,
        target: 0.45,
        status: "GOOD",
        sparkline: [0.46, 0.45, 0.44, 0.43, 0.43, 0.42, 0.42],
        category: "FUEL",
      },
      FUEL_TODAY: {
        id: "FUEL_TODAY",
        name: "Total Konsumsi Solar",
        value: 39585,
        unit: "Liter",
        changePct: 1.5,
        isPositiveGood: false,
        target: 41400,
        status: "GOOD",
        sparkline: [38200, 39100, 38800, 39400, 40100, 39200, 39585],
        category: "FUEL",
      },
      COST_PER_BCM: {
        id: "COST_PER_BCM",
        name: "Biaya Pengupasan OB",
        value: 2.18,
        unit: "$/BCM",
        changePct: -4.0,
        isPositiveGood: false,
        target: 2.3,
        status: "GOOD",
        sparkline: [2.35, 2.31, 2.28, 2.24, 2.21, 2.2, 2.18],
        category: "COST",
      },
      FUEL_FARM_LEVEL: {
        id: "FUEL_FARM_LEVEL",
        name: "Stok Tangki Solar Induk",
        value: 84.5,
        unit: "% (422 kL)",
        changePct: -8.2,
        isPositiveGood: true,
        target: 70.0,
        status: "GOOD",
        sparkline: [98.0, 95.0, 92.4, 90.1, 88.0, 86.2, 84.5],
        category: "FUEL",
      },
    };
  }

  public static getProductionTimeSeries(): ProductionSeriesPoint[] {
    return [
      { time: "06:00", coalActualMT: 1250, coalTargetMT: 1300, obActualBCM: 7100, obTargetBCM: 7500, strippingRatio: 5.68 },
      { time: "08:00", coalActualMT: 1420, coalTargetMT: 1350, obActualBCM: 7950, obTargetBCM: 7600, strippingRatio: 5.60 },
      { time: "10:00", coalActualMT: 1580, coalTargetMT: 1400, obActualBCM: 8400, obTargetBCM: 7800, strippingRatio: 5.32 },
      { time: "12:00", coalActualMT: 1100, coalTargetMT: 1200, obActualBCM: 6800, obTargetBCM: 7200, strippingRatio: 6.18 },
      { time: "14:00", coalActualMT: 1650, coalTargetMT: 1450, obActualBCM: 8900, obTargetBCM: 8000, strippingRatio: 5.39 },
      { time: "16:00", coalActualMT: 1720, coalTargetMT: 1500, obActualBCM: 9200, obTargetBCM: 8200, strippingRatio: 5.35 },
      { time: "18:00", coalActualMT: 1380, coalTargetMT: 1350, obActualBCM: 7600, obTargetBCM: 7500, strippingRatio: 5.51 },
      { time: "20:00", coalActualMT: 1510, coalTargetMT: 1400, obActualBCM: 8300, obTargetBCM: 7800, strippingRatio: 5.50 },
      { time: "22:00", coalActualMT: 1600, coalTargetMT: 1450, obActualBCM: 8700, obTargetBCM: 8100, strippingRatio: 5.44 },
      { time: "00:00", coalActualMT: 1480, coalTargetMT: 1400, obActualBCM: 8100, obTargetBCM: 7900, strippingRatio: 5.47 },
      { time: "02:00", coalActualMT: 1530, coalTargetMT: 1400, obActualBCM: 8400, obTargetBCM: 7900, strippingRatio: 5.49 },
      { time: "04:00", coalActualMT: 1620, coalTargetMT: 1450, obActualBCM: 8800, obTargetBCM: 8100, strippingRatio: 5.43 },
    ];
  }

  public static getPitProductionBreakdown(): { pit: string; coalMT: number; obBCM: number; sr: number; pctShare: number }[] {
    return [
      { pit: "Pit North Alpha", coalMT: 7850, obBCM: 42300, sr: 5.39, pctShare: 46.6 },
      { pit: "Pit South Bravo", coalMT: 5420, obBCM: 31200, sr: 5.76, pctShare: 32.2 },
      { pit: "Pit West Charlie", coalMT: 3570, obBCM: 20750, sr: 5.81, pctShare: 21.2 },
    ];
  }

  public static getFleetStatusData(): { name: string; count: number; percentage: number; color: string }[] {
    return [
      { name: "Operating", count: 68, percentage: 73.9, color: "#10B981" },
      { name: "Standby / Shift Change", count: 12, percentage: 13.0, color: "#F59E0B" },
      { name: "Scheduled Service / P2H", count: 7, percentage: 7.6, color: "#3B82F6" },
      { name: "Unscheduled Breakdown", count: 5, percentage: 5.5, color: "#EF4444" },
    ];
  }

  public static getCycleTimeStages(): { stage: string; minutes: number; benchmarkMin: number; deviationPct: number }[] {
    return [
      { stage: "Travel Empty (Haul Road)", minutes: 8.2, benchmarkMin: 8.5, deviationPct: -3.5 },
      { stage: "Spot & Queue at Shovel", minutes: 2.1, benchmarkMin: 1.8, deviationPct: 16.7 },
      { stage: "Loading by Excavator", minutes: 3.4, benchmarkMin: 3.2, deviationPct: 6.2 },
      { stage: "Travel Loaded to Disposal/ROM", minutes: 9.6, benchmarkMin: 10.0, deviationPct: -4.0 },
      { stage: "Dumping & Maneuver", minutes: 1.5, benchmarkMin: 1.5, deviationPct: 0.0 },
    ];
  }

  public static getFuelBurnRateByClass(): { model: string; classType: string; burnRateLph: number; benchmarkLph: number; unitCount: number }[] {
    return [
      { model: "Komatsu PC2000-8", classType: "Excavator 200T", burnRateLph: 128.4, benchmarkLph: 135.0, unitCount: 4 },
      { model: "Hitachi EX1200-7", classType: "Excavator 120T", burnRateLph: 74.2, benchmarkLph: 78.0, unitCount: 6 },
      { model: "CAT 777G", classType: "Dump Truck 100T", burnRateLph: 68.5, benchmarkLph: 72.0, unitCount: 32 },
      { model: "Komatsu HD785-7", classType: "Dump Truck 100T", burnRateLph: 69.8, benchmarkLph: 73.5, unitCount: 26 },
      { model: "CAT D8R / D375", classType: "Bulldozer", burnRateLph: 42.0, benchmarkLph: 45.0, unitCount: 14 },
      { model: "Komatsu GD825A", classType: "Motor Grader", burnRateLph: 28.5, benchmarkLph: 30.0, unitCount: 6 },
    ];
  }

  public static getCostBreakdown(): CostBreakdownItem[] {
    return [
      { category: "Fuel & Lubricants", amountUSD: 954000, amountIDR: 15264000000, percentage: 38.2, costPerTonUSD: 9.22, budgetVariancePct: -2.5 },
      { category: "Equipment Maintenance & Parts", amountUSD: 648000, amountIDR: 10368000000, percentage: 25.9, costPerTonUSD: 6.26, budgetVariancePct: 1.8 },
      { category: "Direct Mining Labor & Operators", amountUSD: 442000, amountIDR: 7072000000, percentage: 17.7, costPerTonUSD: 4.27, budgetVariancePct: -0.4 },
      { category: "Explosives & Blasting (Handak)", amountUSD: 245000, amountIDR: 3920000000, percentage: 9.8, costPerTonUSD: 2.37, budgetVariancePct: -4.2 },
      { category: "Site Overheads & HSE/Reclamation", amountUSD: 211000, amountIDR: 3376000000, percentage: 8.4, costPerTonUSD: 2.03, budgetVariancePct: 0.8 },
    ];
  }

  public static getSpatialMapFeatures(): { features: MapPitFeature[]; fleetUnits: FleetTelemetryData[] } {
    const features: MapPitFeature[] = [
      { id: "pit-north", name: "Pit North Alpha (Active Seam 11)", type: "PIT", coordinates: { x: 28, y: 35 }, activeUnitsCount: 28, status: "ACTIVE" },
      { id: "pit-south", name: "Pit South Bravo (Seam 8 & 9)", type: "PIT", coordinates: { x: 65, y: 70 }, activeUnitsCount: 20, status: "ACTIVE" },
      { id: "disp-east", name: "Disposal East In-Pit Dumper", type: "DISPOSAL", coordinates: { x: 42, y: 22 }, activeUnitsCount: 14, status: "ACTIVE" },
      { id: "disp-west", name: "Out-Pit Waste Dump West", type: "DISPOSAL", coordinates: { x: 80, y: 48 }, activeUnitsCount: 12, status: "ACTIVE" },
      { id: "rom-stock", name: "ROM Stockpile & Sizing Hopper", type: "STOCKPILE", coordinates: { x: 15, y: 75 }, activeUnitsCount: 8, status: "ACTIVE" },
      { id: "crusher-01", name: "Primary Crusher Plant 1200 TPH", type: "CRUSHER", coordinates: { x: 12, y: 82 }, activeUnitsCount: 4, status: "ACTIVE" },
    ];

    const fleetUnits: FleetTelemetryData[] = [
      { equipmentId: "EX-201", model: "PC2000-8", type: "EXCAVATOR", operator: "Rudi Hartono", status: "OPERATING", paPercent: 94.2, uaPercent: 88.5, fuelBurnLph: 124.5, locationPit: "Pit North Alpha" },
      { equipmentId: "EX-202", model: "PC2000-8", type: "EXCAVATOR", operator: "Bambang Pamungkas", status: "OPERATING", paPercent: 92.8, uaPercent: 85.0, fuelBurnLph: 127.0, locationPit: "Pit North Alpha" },
      { equipmentId: "EX-101", model: "EX1200-7", type: "EXCAVATOR", operator: "Agus Prasetyo", status: "OPERATING", paPercent: 91.0, uaPercent: 84.2, fuelBurnLph: 72.8, locationPit: "Pit South Bravo" },
      { equipmentId: "DT-701", model: "CAT 777G", type: "DUMP_TRUCK", operator: "Hendra Wijaya", status: "OPERATING", paPercent: 95.0, uaPercent: 90.1, fuelBurnLph: 68.2, payloadTons: 98.4, cycleCount: 18, locationPit: "Pit North Alpha" },
      { equipmentId: "DT-702", model: "CAT 777G", type: "DUMP_TRUCK", operator: "Yudi Santoso", status: "OPERATING", paPercent: 93.5, uaPercent: 87.4, fuelBurnLph: 67.5, payloadTons: 96.2, cycleCount: 17, locationPit: "Pit North Alpha" },
      { equipmentId: "DT-801", model: "HD785-7", type: "DUMP_TRUCK", operator: "Dedi Supriyadi", status: "OPERATING", paPercent: 90.0, uaPercent: 83.2, fuelBurnLph: 70.1, payloadTons: 94.8, cycleCount: 16, locationPit: "Pit South Bravo" },
      { equipmentId: "DT-805", model: "HD785-7", type: "DUMP_TRUCK", operator: "Arif Hidayat", status: "STANDBY", paPercent: 88.0, uaPercent: 62.0, fuelBurnLph: 18.0, locationPit: "Disposal East" },
      { equipmentId: "DZ-301", model: "CAT D8R", type: "DOZER", operator: "Sugeng Riyadi", status: "OPERATING", paPercent: 96.0, uaPercent: 92.0, fuelBurnLph: 41.5, locationPit: "Disposal East" },
      { equipmentId: "WT-102", model: "Scania WT20K", type: "WATER_TRUCK", operator: "Joko Widodo", status: "OPERATING", paPercent: 98.0, uaPercent: 91.0, fuelBurnLph: 24.0, locationPit: "Main Haul Road" },
    ];

    return { features, fleetUnits };
  }

  public static getAIInsights(): AIInsightCard[] {
    return [
      {
        id: "ai-ins-1",
        timestamp: "10 menit yang lalu",
        severity: "OPTIMIZATION",
        title: "Peluang Efisiensi Rute Hauling Pit North",
        summary: "Penumpukan antrean rata-rata 3.2 unit pada Excavator EX-202 akibat deviasi kecepatan hauler di tikungan Ramp B.",
        rootCause: "Kondisi jalan hauling Ramp B mengalami gelombang mikro (corrugation) sedalam 6-8 cm.",
        prescriptiveAction: "Disposisikan Motor Grader MG-03 untuk perataan Ramp B selama 20 menit saat pergantian giliran makan siang.",
        impactPotential: "+280 BCM/Jam potensi peningkatan output & reduksi cycle time 1.4 menit.",
        tags: ["Hauling", "Cycle Time", "Road Maintenance"],
      },
      {
        id: "ai-ins-2",
        timestamp: "28 menit yang lalu",
        severity: "CRITICAL_ALERT",
        title: "Anomali Fuel Burn Rate pada Fleet Excavator EX-104",
        summary: "Tingkat konsumsi BBM EX-104 melonjak 18.4% di atas baseline model EX1200-7 (88.2 L/jam vs standar 74.5 L/jam).",
        rootCause: "Tekanan balik hydraulic filter terdeteksi abnormal (DP > 2.8 bar) & teeth bucket aus berlebih pada formasi batuan siltstone keras.",
        prescriptiveAction: "Jadwalkan penggantian hydraulic return filter dan bucket teeth inspeksi pada shift breakdown malam.",
        impactPotential: "Mencegah potensi kegagalan pompa hidrolik utama senilai $18,500 & menghemat 140L solar/shift.",
        tags: ["Fuel", "Predictive Maintenance", "Hydraulics"],
      },
      {
        id: "ai-ins-3",
        timestamp: "1 jam yang lalu",
        severity: "OPPORTUNITY",
        title: "Optimasi Stripping Ratio & Penempatan Disposal",
        summary: "Jarak angkut rata-rata ke Disposal East 1.2 km lebih pendek dibandingkan Disposal West dengan kapasitas dumping tersisa 480.000 BCM.",
        rootCause: "Sebagian besar armada Pit North diarahkan ke Disposal West karena keterbatasan lebar jalan masuk.",
        prescriptiveAction: "Aktifkan jalur ganda akses Disposal East dengan pelebaran 4 meter oleh Dozer DZ-302.",
        impactPotential: "Efisiensi biaya hauling $42,000 / bulan dan penghematan BBM 4.2%.",
        tags: ["Mine Planning", "Disposal", "Cost Saving"],
      },
    ];
  }
}
