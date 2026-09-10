// MINE SMART AI - Dashboard Analytics Service

import { UserRole } from "../../types";
import { OperationalHealthScore, OperationalHealthScoreService } from "./OperationalHealthScoreService";
import { AlertRuleEngine, DashboardAlertItem } from "./AlertRuleEngine";

export type DateRangeFilter = "Today" | "Yesterday" | "This Week" | "This Month" | "Custom";
export type ShiftFilter = "All Shift" | "Shift 1" | "Shift 2" | "Shift 3" | "Day Shift" | "Night Shift";

export interface DashboardFilterContext {
  companyId: string;
  siteId: string;
  dateRange: DateRangeFilter;
  shift: ShiftFilter;
  customStartDate?: string;
  customEndDate?: string;
  role: UserRole;
  permissions?: string[];
}

export interface ProductionKPIData {
  coalActualTon: number;
  coalTargetTon: number;
  coalAchievementPct: number;
  coalVarianceTon: number;
  obActualBCM: number;
  obTargetBCM: number;
  obAchievementPct: number;
  obVarianceBCM: number;
  stripRatioActual: number;
  stripRatioPlan: number;
  status: "ABOVE_TARGET" | "ON_TARGET" | "BELOW_TARGET" | "CRITICAL";
  statusText: string;
  hourlyTrend: Array<{ hour: string; coalActual: number; coalTarget: number; obActual: number }>;
  dailyTrend: Array<{ date: string; coal: number; target: number; ob: number }>;
}

export interface FleetKPIData {
  totalEquipment: number;
  running: number;
  idle: number;
  maintenance: number;
  breakdown: number;
  standby: number;
  physicalAvailabilityPA: number;
  paTarget: number;
  paVariance: number;
  useOfAvailabilityUA: number;
  uaTarget: number;
  uaVariance: number;
  topPerformers: Array<{ code: string; name: string; type: string; category: string; productionTon: number; utilizationPct: number; fuelRateLhr: number; status: string }>;
  lowestPerformers: Array<{ code: string; name: string; type: string; category: string; downtimeHours: number; utilizationPct: number; issue: string; status: string }>;
  distribution: Array<{ category: string; running: number; idle: number; maintenance: number; breakdown: number }>;
}

export interface FuelCostKPIData {
  totalFuelConsumptionLiters: number;
  fuelTargetLiters: number;
  fuelPerTonRatio: number; // L/Ton
  fuelPerTonTarget: number;
  totalFuelCostIDR: number;
  fuelVariancePct: number;
  hasFuelAnomaly: boolean;
  anomalyMessage?: string;
  operatingCostIDR: number;
  budgetCostIDR: number;
  costPerTonIDR: number;
  costPerTonBudgetIDR: number;
  costVariancePct: number;
  costBreakdown: {
    fuelIDR: number;
    maintenanceIDR: number;
    laborIDR: number;
    haulingExplosivesIDR: number;
    otherIDR: number;
  };
  dailyCostTrend: Array<{ date: string; actualCost: number; budgetCost: number; costPerTon: number }>;
}

export interface HSEKPIData {
  totalIncidents: number;
  daysWithoutLTI: number;
  nearMissCount: number;
  openCorrectiveActions: number;
  highRiskFindings: number;
  hseStatus: "SAFE" | "WATCH" | "HIGH_RISK" | "CRITICAL";
  statusText: string;
  hasCriticalAlert: boolean;
  criticalAlertMessage?: string;
  incidentTrend: Array<{ month: string; incidents: number; nearMiss: number; correctiveActions: number }>;
}

export interface StockpileKPIData {
  currentStockTon: number;
  totalCapacityTon: number;
  availableCapacityTon: number;
  occupancyPct: number;
  incomingTodayTon: number;
  outgoingTodayTon: number;
  stockpileStatus: "NORMAL" | "NEAR_CAPACITY" | "CRITICAL";
  quality: {
    calorificValueGAR: number;
    targetCV: number;
    ashContentPct: number;
    totalMoisturePct: number;
    totalSulfurPct: number;
    qualityDeviationText: string;
  };
}

export interface AIInsightItem {
  id: string;
  category: "PRODUCTION" | "FLEET" | "FUEL" | "MAINTENANCE" | "HSE" | "STOCKPILE" | "COST";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  potentialCauses: string[];
  recommendation: string;
  estimatedImpact: string;
  confidenceScore: number; // e.g. 94%
  actionText: string;
  actionModuleKey?: string;
}

export interface ExecutiveSummaryData {
  healthScore: OperationalHealthScore;
  keyHighlights: string[];
  riskWarnings: string[];
  aiExecutiveRecommendation: string;
  financialMetrics: {
    estimatedCoalValueIDR: number;
    operatingCostIDR: number;
    grossEbitdaEstimateIDR: number;
    marginPct: number;
  };
}

export interface OperationalSummaryRow {
  metric: string;
  category: string;
  actualFormatted: string;
  targetFormatted: string;
  varianceFormatted: string;
  status: "GOOD" | "WARN" | "ALERT";
  trend: "UP" | "DOWN" | "STABLE";
}

export interface TopOperationalIssueItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  impactText: string;
  recommendedAction: string;
  sourceModuleKey: string;
}

export interface DashboardPayload {
  context: DashboardFilterContext;
  healthScore: OperationalHealthScore;
  production: ProductionKPIData;
  fleet: FleetKPIData;
  fuelCost: FuelCostKPIData;
  hse: HSEKPIData;
  stockpile: StockpileKPIData;
  aiInsights: AIInsightItem[];
  alerts: DashboardAlertItem[];
  executiveSummary: ExecutiveSummaryData;
  operationalSummaryTable: OperationalSummaryRow[];
  topOperationalIssues: TopOperationalIssueItem[];
  lastUpdatedTime: string;
  dataFreshnessStatus: "FRESH" | "STALE" | "LIVE";
}

export class DashboardAnalyticsService {
  /**
   * Main aggregator method retrieving holistic dashboard payload for selected context filters
   */
  public static getDashboardPayload(filter: DashboardFilterContext): DashboardPayload {
    const isSiteB = filter.siteId === "SITE-KAL-B";
    const isSumatera = filter.siteId === "SITE-SUM-A";
    const isShift2 = filter.shift === "Shift 2" || filter.shift === "Night Shift";

    // Dynamic multipliers based on filter
    const siteMultiplier = isSiteB ? 0.65 : isSumatera ? 0.72 : 1.0;
    const shiftMultiplier = isShift2 ? 0.88 : 1.0;

    // 1. Production KPIs
    const coalTargetTon = Math.round(15000 * siteMultiplier);
    const coalActualTon = Math.round(14250 * siteMultiplier * shiftMultiplier);
    const coalAchievementPct = Number(((coalActualTon / coalTargetTon) * 100).toFixed(1));
    const coalVarianceTon = coalActualTon - coalTargetTon;

    const obTargetBCM = Math.round(50000 * siteMultiplier);
    const obActualBCM = Math.round(48600 * siteMultiplier * shiftMultiplier);
    const obAchievementPct = Number(((obActualBCM / obTargetBCM) * 100).toFixed(1));
    const obVarianceBCM = obActualBCM - obTargetBCM;

    const stripRatioActual = Number((obActualBCM / Math.max(1, coalActualTon)).toFixed(2));
    const stripRatioPlan = 3.33;

    let prodStatus: ProductionKPIData["status"] = "ON_TARGET";
    let prodStatusText = "Produksi On-Target";
    if (coalAchievementPct >= 100) {
      prodStatus = "ABOVE_TARGET";
      prodStatusText = "Melampaui Target";
    } else if (coalAchievementPct < 85) {
      prodStatus = "CRITICAL";
      prodStatusText = "Deviasi Kritis (<85%)";
    } else if (coalAchievementPct < 95) {
      prodStatus = "BELOW_TARGET";
      prodStatusText = "Di Bawah Target (-5.0%)";
    }

    const production: ProductionKPIData = {
      coalActualTon,
      coalTargetTon,
      coalAchievementPct,
      coalVarianceTon,
      obActualBCM,
      obTargetBCM,
      obAchievementPct,
      obVarianceBCM,
      stripRatioActual,
      stripRatioPlan,
      status: prodStatus,
      statusText: prodStatusText,
      hourlyTrend: [
        { hour: "07:00", coalActual: Math.round(1200 * siteMultiplier), coalTarget: 1250, obActual: Math.round(4200 * siteMultiplier) },
        { hour: "09:00", coalActual: Math.round(2400 * siteMultiplier), coalTarget: 2300, obActual: Math.round(8100 * siteMultiplier) },
        { hour: "11:00", coalActual: Math.round(2100 * siteMultiplier), coalTarget: 2200, obActual: Math.round(7800 * siteMultiplier) },
        { hour: "13:00", coalActual: Math.round(1800 * siteMultiplier), coalTarget: 2000, obActual: Math.round(6900 * siteMultiplier) },
        { hour: "15:00", coalActual: Math.round(2500 * siteMultiplier), coalTarget: 2400, obActual: Math.round(8400 * siteMultiplier) },
        { hour: "17:00", coalActual: Math.round(2250 * siteMultiplier), coalTarget: 2300, obActual: Math.round(7600 * siteMultiplier) },
        { hour: "19:00", coalActual: Math.round(2000 * siteMultiplier), coalTarget: 2100, obActual: Math.round(5600 * siteMultiplier) },
      ],
      dailyTrend: [
        { date: "Senin", coal: 14100, target: 15000, ob: 49200 },
        { date: "Selasa", coal: 15200, target: 15000, ob: 51000 },
        { date: "Rabu", coal: 13800, target: 15000, ob: 47500 },
        { date: "Kamis", coal: 14900, target: 15000, ob: 49800 },
        { date: "Jumat", coal: 15500, target: 15000, ob: 52100 },
        { date: "Sabtu", coal: 14250, target: 15000, ob: 48600 },
      ],
    };

    // 2. Fleet KPIs
    const fleet: FleetKPIData = {
      totalEquipment: 86,
      running: 62,
      idle: 11,
      maintenance: 8,
      breakdown: 5,
      standby: 0,
      physicalAvailabilityPA: 88.5,
      paTarget: 85.0,
      paVariance: +3.5,
      useOfAvailabilityUA: 76.2,
      uaTarget: 80.0,
      uaVariance: -3.8,
      topPerformers: [
        { code: "EX-101", name: "Komatsu PC2000-8", type: "Excavator", category: "Loading", productionTon: 3420, utilizationPct: 89.2, fuelRateLhr: 112, status: "RUNNING" },
        { code: "EX-104", name: "CAT 6020B", type: "Excavator", category: "Loading", productionTon: 3280, utilizationPct: 87.5, fuelRateLhr: 118, status: "RUNNING" },
        { code: "DT-302", name: "Scania P410 CB 8x4", type: "Dump Truck", category: "Hauling", productionTon: 1150, utilizationPct: 84.1, fuelRateLhr: 28.5, status: "RUNNING" },
      ],
      lowestPerformers: [
        { code: "EX-107", name: "Hitachi EX1200", type: "Excavator", category: "Loading", downtimeHours: 4.5, utilizationPct: 42.0, issue: "Main Hydraulic Hose Leakage", status: "MAINTENANCE" },
        { code: "DT-315", name: "Volvo FMX 440", type: "Dump Truck", category: "Hauling", downtimeHours: 3.8, utilizationPct: 51.2, issue: "Overheating Engine Sensors", status: "BREAKDOWN" },
        { code: "DZ-005", name: "CAT D8R Bulldozer", type: "Bulldozer", category: "Support", downtimeHours: 2.2, utilizationPct: 62.0, issue: "Track Chain Tension Adjustment", status: "IDLE" },
      ],
      distribution: [
        { category: "Excavator", running: 10, idle: 1, maintenance: 1, breakdown: 0 },
        { category: "Dump Truck", running: 42, idle: 8, maintenance: 5, breakdown: 3 },
        { category: "Bulldozer", running: 6, idle: 1, maintenance: 1, breakdown: 1 },
        { category: "Motor Grader", running: 4, idle: 1, maintenance: 0, breakdown: 0 },
      ],
    };

    // 3. Fuel & Cost KPIs
    const fuelCost: FuelCostKPIData = {
      totalFuelConsumptionLiters: 48500,
      fuelTargetLiters: 46000,
      fuelPerTonRatio: 3.40, // L/Ton
      fuelPerTonTarget: 3.20,
      totalFuelCostIDR: 727500000, // Rp 727.5 Juta
      fuelVariancePct: +8.7,
      hasFuelAnomaly: true,
      anomalyMessage: "Konsumsi BBM meningkat +8.7% akibat antrean hauling truck di lokasi dumping ROM A.",
      operatingCostIDR: 4500000000, // Rp 4.5 Miliar
      budgetCostIDR: 4200000000, // Rp 4.2 Miliar
      costPerTonIDR: 350467, // Rp 350.467 / ton
      costPerTonBudgetIDR: 327000,
      costVariancePct: +7.1,
      costBreakdown: {
        fuelIDR: 1620000000,
        maintenanceIDR: 1125000000,
        laborIDR: 900000000,
        haulingExplosivesIDR: 585000000,
        otherIDR: 270000000,
      },
      dailyCostTrend: [
        { date: "1 Aug", actualCost: 4.1, budgetCost: 4.2, costPerTon: 335000 },
        { date: "2 Aug", actualCost: 4.3, budgetCost: 4.2, costPerTon: 342000 },
        { date: "3 Aug", actualCost: 4.0, budgetCost: 4.2, costPerTon: 320000 },
        { date: "4 Aug", actualCost: 4.4, budgetCost: 4.2, costPerTon: 348000 },
        { date: "5 Aug", actualCost: 4.5, budgetCost: 4.2, costPerTon: 350467 },
      ],
    };

    // 4. HSE KPIs
    const hse: HSEKPIData = {
      totalIncidents: 1,
      daysWithoutLTI: 142,
      nearMissCount: 3,
      openCorrectiveActions: 2,
      highRiskFindings: 1,
      hseStatus: "WATCH",
      statusText: "PERHATIAN: 1 High-Risk Finding di Area Blasting Pit A",
      hasCriticalAlert: true,
      criticalAlertMessage: "High-risk condition detected: Ketidaksesuaian jarak aman blasting dengan area kerja loader.",
      incidentTrend: [
        { month: "Mei", incidents: 0, nearMiss: 4, correctiveActions: 3 },
        { month: "Jun", incidents: 1, nearMiss: 2, correctiveActions: 2 },
        { month: "Jul", incidents: 0, nearMiss: 5, correctiveActions: 4 },
        { month: "Agt", incidents: 1, nearMiss: 3, correctiveActions: 2 },
      ],
    };

    // 5. Stockpile KPIs
    const stockpile: StockpileKPIData = {
      currentStockTon: 184500,
      totalCapacityTon: 220000,
      availableCapacityTon: 35500,
      occupancyPct: 83.9,
      incomingTodayTon: 14250,
      outgoingTodayTon: 11000,
      stockpileStatus: "NEAR_CAPACITY",
      quality: {
        calorificValueGAR: 4210,
        targetCV: 4200,
        ashContentPct: 5.4,
        totalMoisturePct: 34.2,
        totalSulfurPct: 0.48,
        qualityDeviationText: "Kualitas batu bara sesuai spesifikasi ekspor GAR 4200 (Moisture 34.2%).",
      },
    };

    // 6. AI Insights
    const aiInsights: AIInsightItem[] = [
      {
        id: "INS-01",
        category: "PRODUCTION",
        priority: "CRITICAL",
        title: "Penurunan Produksi Batubara 8.4% di Pit North",
        description: "Pencapaian ritase dump truck ke ROM A terhambat akibat akumulasi antrean 11 unit truk di crusher.",
        potentialCauses: [
          "Downtime Excavator EX-107 (Hydraulic Hose)",
          "Cycle time hauling meningkat +3.8 menit akibat kondisi jalan tambang basah",
          "Mismatched loader-truck ratio pada Flotila 3",
        ],
        recommendation: "Relokasi 3 unit Dump Truck Scania dari Pit North ke Pit Central untuk menyeimbangkan cycle time.",
        estimatedImpact: "+850 Ton batu bara per shift",
        confidenceScore: 94,
        actionText: "Analisis dengan AI",
        actionModuleKey: "ai",
      },
      {
        id: "INS-02",
        category: "FUEL",
        priority: "HIGH",
        title: "Penyimpangan Fuel Ratio +8.7% pada Hauling Fleet",
        description: "Konsumsi solar mencapai 3.40 L/Ton vs target 3.20 L/Ton. Idling time truk menyumbang 18% dari total bahan bakar yang terbakar.",
        potentialCauses: [
          "Truk melakukan idling berlebih saat menunggu antrean loading excavator",
          "Kondisi ban dump truck kurang tekanan udara ideal (under-inflated)",
        ],
        recommendation: "Instruksikan dispatch untuk memberlakukan Engine Shutdown Protocol jika antrean > 5 menit.",
        estimatedImpact: "Hemat 2.400 Liter Solar / hari (Rp 36 Juta)",
        confidenceScore: 89,
        actionText: "Lihat Rekomendasi BBM",
        actionModuleKey: "fuel",
      },
      {
        id: "INS-03",
        category: "MAINTENANCE",
        priority: "MEDIUM",
        title: "Prediksi Preventive Maintenance EX-104",
        description: "AI Sensor vibration dan oil quality menganalisis risiko kegagalan bearing pompa utama dalam 48 jam ke depan.",
        potentialCauses: ["Kenaikan partikel kontaminasi mikro pada oli hidrolik."],
        recommendation: "Jadwalkan penggantian filter hidrolik pada Shift 2 malam ini.",
        estimatedImpact: "Mencegah unscheduled breakdown senilai Rp 180 Juta",
        confidenceScore: 92,
        actionText: "Buka CMMS Maintenance",
        actionModuleKey: "maintenance",
      },
      {
        id: "INS-04",
        category: "STOCKPILE",
        priority: "MEDIUM",
        title: "Okupansi Stockpile A Mendekati Batas Aman (83.9%)",
        description: "Sisa ruang penampungan batu bara di ROM A tersisa 35.500 Ton. Jika barging tidak dipercepat, penumpukan akan memicu masalah ketersediaan space.",
        potentialCauses: ["Keterlambatan tongkang akibat cuaca buruk di muara sungai."],
        recommendation: "Lakukan pengalihan dump ke Stockpile B sementara waktu.",
        estimatedImpact: "Menghindari bottleneck unloading truk di ROM A",
        confidenceScore: 88,
        actionText: "Atur Stockpile",
        actionModuleKey: "stockpile",
      },
    ];

    // 7. Active Real-Time Alerts
    const alerts = AlertRuleEngine.evaluateRules({
      productionAchievementPct: coalAchievementPct,
      fleetUtilizationPct: fleet.useOfAvailabilityUA,
      fuelVariancePct: fuelCost.fuelVariancePct,
      highRiskIncidentCount: hse.highRiskFindings,
      stockpileOccupancyPct: stockpile.occupancyPct,
      costVariancePct: fuelCost.costVariancePct,
      siteName: filter.siteId,
    });

    // 8. Health Score Calculation
    const healthScore = OperationalHealthScoreService.calculateHealthScore({
      coalActual: coalActualTon,
      coalTarget: coalTargetTon,
      obActual: obActualBCM,
      obTarget: obTargetBCM,
      fleetPA: fleet.physicalAvailabilityPA,
      fleetUA: fleet.useOfAvailabilityUA,
      actualCostRatio: fuelCost.operatingCostIDR / fuelCost.budgetCostIDR,
      incidentsCount: hse.totalIncidents,
      daysWithoutLTI: hse.daysWithoutLTI,
      fuelEfficiencyRatio: fuelCost.fuelPerTonRatio / fuelCost.fuelPerTonTarget,
      stockpileUtilizationPct: stockpile.occupancyPct,
    });

    // 9. Executive Summary
    const executiveSummary: ExecutiveSummaryData = {
      healthScore,
      keyHighlights: [
        `Pencapaian batu bara hari ini ${coalActualTon.toLocaleString("id-ID")} Ton (${coalAchievementPct}% dari target harian).`,
        `Physical Availability (PA) armada utama terjaga baik di angka ${fleet.physicalAvailabilityPA}%.`,
        `Operasi mencapai ${hse.daysWithoutLTI} hari kerja aman tanpa Lost Time Injury (LTI).`,
      ],
      riskWarnings: [
        "Terjadi lonjakan biaya solar +8.7% akibat antrean hauling truck di crusher.",
        "Kapasitas penampungan batu bara ROM Stockpile A mencapai 83.9% (mendekati batas kritis).",
        "Terdapat 1 temuan risiko tinggi K3LH pada proyek blasting area utara.",
      ],
      aiExecutiveRecommendation:
        "Disarankan melakukan penyeimbangan ritase armada loader antara Pit North dan Pit Central, menerapkan protokol engine auto-shutdown pada dump truck idle, dan mengalihkan alokasi dumping ke Stockpile B.",
      financialMetrics: {
        estimatedCoalValueIDR: coalActualTon * 1250000, // Rp 1.25 Juta / Ton
        operatingCostIDR: fuelCost.operatingCostIDR,
        grossEbitdaEstimateIDR: coalActualTon * 1250000 - fuelCost.operatingCostIDR,
        marginPct: Number((((coalActualTon * 1250000 - fuelCost.operatingCostIDR) / (coalActualTon * 1250000)) * 100).toFixed(1)),
      },
    };

    // 10. Operational Summary Table
    const operationalSummaryTable: OperationalSummaryRow[] = [
      {
        metric: "Produksi Batu Bara (Ton)",
        category: "Production",
        actualFormatted: `${coalActualTon.toLocaleString("id-ID")} Ton`,
        targetFormatted: `${coalTargetTon.toLocaleString("id-ID")} Ton`,
        varianceFormatted: `${coalVarianceTon > 0 ? "+" : ""}${coalVarianceTon.toLocaleString("id-ID")} Ton (${coalAchievementPct}%)`,
        status: coalAchievementPct >= 95 ? "GOOD" : "WARN",
        trend: "UP",
      },
      {
        metric: "Pengupasan Overburden (BCM)",
        category: "Production",
        actualFormatted: `${obActualBCM.toLocaleString("id-ID")} BCM`,
        targetFormatted: `${obTargetBCM.toLocaleString("id-ID")} BCM`,
        varianceFormatted: `${obVarianceBCM > 0 ? "+" : ""}${obVarianceBCM.toLocaleString("id-ID")} BCM (${obAchievementPct}%)`,
        status: obAchievementPct >= 95 ? "GOOD" : "WARN",
        trend: "STABLE",
      },
      {
        metric: "Strip Ratio (BCM/Ton)",
        category: "Mine Plan",
        actualFormatted: `${stripRatioActual}`,
        targetFormatted: `${stripRatioPlan}`,
        varianceFormatted: `${(stripRatioActual - stripRatioPlan).toFixed(2)}`,
        status: stripRatioActual <= stripRatioPlan ? "GOOD" : "WARN",
        trend: "STABLE",
      },
      {
        metric: "Physical Availability Alat (PA)",
        category: "Fleet",
        actualFormatted: `${fleet.physicalAvailabilityPA}%`,
        targetFormatted: `${fleet.paTarget}%`,
        varianceFormatted: `+${fleet.paVariance}%`,
        status: "GOOD",
        trend: "UP",
      },
      {
        metric: "Utilisasi Alat (UA)",
        category: "Fleet",
        actualFormatted: `${fleet.useOfAvailabilityUA}%`,
        targetFormatted: `${fleet.uaTarget}%`,
        varianceFormatted: `${fleet.uaVariance}%`,
        status: "WARN",
        trend: "DOWN",
      },
      {
        metric: "Konsumsi Solar / Ton",
        category: "Fuel",
        actualFormatted: `${fuelCost.fuelPerTonRatio} L/Ton`,
        targetFormatted: `${fuelCost.fuelPerTonTarget} L/Ton`,
        varianceFormatted: `+${(fuelCost.fuelPerTonRatio - fuelCost.fuelPerTonTarget).toFixed(2)} L/Ton`,
        status: "ALERT",
        trend: "UP",
      },
      {
        metric: "Biaya Operasional Hari Ini",
        category: "Finance",
        actualFormatted: `Rp ${(fuelCost.operatingCostIDR / 1000000000).toFixed(2)} M`,
        targetFormatted: `Rp ${(fuelCost.budgetCostIDR / 1000000000).toFixed(2)} M`,
        varianceFormatted: `+${fuelCost.costVariancePct}%`,
        status: "WARN",
        trend: "UP",
      },
      {
        metric: "Hari Kerja Tanpa LTI",
        category: "HSE",
        actualFormatted: `${hse.daysWithoutLTI} Hari`,
        targetFormatted: "> 100 Hari",
        varianceFormatted: "Aman",
        status: "GOOD",
        trend: "STABLE",
      },
      {
        metric: "Okupansi Stockpile ROM A",
        category: "Stockpile",
        actualFormatted: `${stockpile.occupancyPct}%`,
        targetFormatted: "< 80.0%",
        varianceFormatted: `+${(stockpile.occupancyPct - 80).toFixed(1)}%`,
        status: "WARN",
        trend: "UP",
      },
    ];

    // 11. Top Operational Issues
    const topOperationalIssues: TopOperationalIssueItem[] = [
      {
        id: "ISS-01",
        rank: 1,
        title: "Excavator EX-107 Down (Hydraulic Leaking)",
        category: "Fleet Maintenance",
        severity: "CRITICAL",
        impactText: "Kehilangan potensi loading 450 Ton/jam pada Flotila 3.",
        recommendedAction: "Percepat penggantian spare hose hydraulic kit dari gudang utama.",
        sourceModuleKey: "maintenance",
      },
      {
        id: "ISS-02",
        rank: 2,
        title: "Peningkatan Hauling Cycle Time (+3.8 menit)",
        category: "Production & Fleet",
        severity: "HIGH",
        impactText: "Menurunkan ritase harian armada dump truck hingga -12%.",
        recommendedAction: "Operasikan motor grader & compactor di segmen KM 4.2 jalan tambang.",
        sourceModuleKey: "fleet",
      },
      {
        id: "ISS-03",
        rank: 3,
        title: "Anomali Idling Fuel Loss pada Dump Truck Fleet",
        category: "Fuel & Cost",
        severity: "HIGH",
        impactText: "Pemborosan solar senilai Rp 36 Juta per hari.",
        recommendedAction: "Disiplinkan protokol auto-shutdown mesin truk saat antrean > 5 menit.",
        sourceModuleKey: "fuel",
      },
      {
        id: "ISS-04",
        rank: 4,
        title: "Okupansi Stockpile A Mendekati Kapasitas Maksimal",
        category: "Logistics & Stockpile",
        severity: "MEDIUM",
        impactText: "Potensi antrean unloading dump truck di area ROM A.",
        recommendedAction: "Alihkan rilis ritase dumping ke lokasi Stockpile B.",
        sourceModuleKey: "stockpile",
      },
      {
        id: "ISS-05",
        rank: 5,
        title: "Temuan HSE: Jarak Aman Blasting Pit North",
        category: "HSE Safety",
        severity: "HIGH",
        impactText: "Batas kelonggaran perimeter blasting mendekati jalur haul road.",
        recommendedAction: "Kaji ulang barikade pengaman & perketat koordinasi K3LH.",
        sourceModuleKey: "hse",
      },
    ];

    const now = new Date();
    const lastUpdatedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;

    return {
      context: filter,
      healthScore,
      production,
      fleet,
      fuelCost,
      hse,
      stockpile,
      aiInsights,
      alerts,
      executiveSummary,
      operationalSummaryTable,
      topOperationalIssues,
      lastUpdatedTime,
      dataFreshnessStatus: "LIVE",
    };
  }
}
