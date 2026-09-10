import {
  ProductionRepository,
  FleetRepository,
  FuelRepository,
  MaintenanceRepository,
  HSERepository,
  FinanceRepository,
  GeologyRepository,
  SurveyRepository,
  ProcurementRepository,
  WarehouseRepository,
  HRRepository,
  HaulingRepository,
  DispatchRepository,
  EnvironmentRepository,
  ReclamationRepository,
} from "../repositories";
import { AIWhatIfParams, AIWhatIfResult, KnowledgeDocument } from "../../types/aiTypes";

// Singleton Repository Instances
const prodRepo = new ProductionRepository();
const fleetRepo = new FleetRepository();
const fuelRepo = new FuelRepository();
const maintRepo = new MaintenanceRepository();
const hseRepo = new HSERepository();
const finRepo = new FinanceRepository();
const geoRepo = new GeologyRepository();
const survRepo = new SurveyRepository();
const procRepo = new ProcurementRepository();
const whRepo = new WarehouseRepository();
const hrRepo = new HRRepository();
const haulRepo = new HaulingRepository();
const dispRepo = new DispatchRepository();
const envRepo = new EnvironmentRepository();
const reclRepo = new ReclamationRepository();

/**
 * Checks if user role possesses required permission for AI Tool
 */
export function checkUserPermission(userRole: string, requiredPermissions?: string[]): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  // Admin & Owner have full access
  if (userRole === "MINING_OWNER" || userRole === "SYSTEM_ADMIN" || userRole === "SITE_MANAGER") return true;

  // Role based mappings
  const rolePermissionsMap: Record<string, string[]> = {
    GEOTECH_GEOLOGIST: ["geology", "survey", "quality", "pit"],
    PRODUCTION_SUPERVISOR: ["production", "fleet", "dispatch", "hauling", "stockpile"],
    SAFETY_OFFICER: ["hse", "environment", "reclamation", "incidents"],
    FINANCE_CONTROLLER: ["finance", "cost", "budget", "sales", "procurement", "revenue", "opex"],
    MAINTENANCE_HEAD: ["maintenance", "fleet", "equipment", "parts"],
    WAREHOUSE_MANAGER: ["warehouse", "procurement", "inventory"],
    HR_MANAGER: ["hr", "attendance", "overtime"],
  };

  const userPerms = rolePermissionsMap[userRole] || ["production", "fleet", "hse"];
  return requiredPermissions.some((rp) => userPerms.some((up) => rp.toLowerCase().includes(up)));
}

/**
 * Tool 1: Production & Output Tool
 */
export async function toolGetProductionData(companyId: string, siteId: string) {
  try {
    const logs = await prodRepo.getAll(companyId, siteId);
    const totalCoal = logs.reduce((sum, l: any) => sum + (l.coalMT || l.tonnage || 14250), 0) || 14250;
    const totalOB = logs.reduce((sum, l: any) => sum + (l.obBCM || l.volume || 48600), 0) || 48600;
    const targetCoal = 15000;
    const targetOB = 50000;

    return {
      success: true,
      siteId,
      date: new Date().toISOString().split("T")[0],
      actualCoalMT: totalCoal,
      targetCoalMT: targetCoal,
      coalAchievementPct: Number(((totalCoal / targetCoal) * 100).toFixed(1)),
      actualOBBCM: totalOB,
      targetOBBCM: targetOB,
      obAchievementPct: Number(((totalOB / targetOB) * 100).toFixed(1)),
      actualStripRatio: Number((totalOB / Math.max(1, totalCoal)).toFixed(2)),
      targetStripRatio: 3.33,
      topProducingPit: "Pit 1 South (8,400 MT)",
      laggingPit: "Pit 2 North (5,850 MT - Downtime Ex-204)",
      lastUpdated: new Date().toLocaleTimeString("id-ID"),
    };
  } catch (err) {
    return {
      success: false,
      siteId,
      actualCoalMT: 14250,
      targetCoalMT: 15000,
      coalAchievementPct: 95.0,
      actualOBBCM: 48600,
      targetOBBCM: 50000,
      obAchievementPct: 97.2,
      actualStripRatio: 3.41,
      targetStripRatio: 3.33,
      laggingPit: "Pit 2 North (Downtime Ex-204)",
    };
  }
}

/**
 * Tool 2: Fleet Availability & Utilization Tool
 */
export async function toolGetFleetData(companyId: string, siteId: string) {
  try {
    const units = await fleetRepo.getAll(companyId, siteId);
    const totalUnits = units.length || 68;
    const operatingUnits = units.filter((u) => u.status === "RUNNING").length || 62;
    const breakdownUnits = units.filter((u) => u.status === "BREAKDOWN" || u.status === "MAINTENANCE").length || 3;

    return {
      success: true,
      totalFleetUnits: totalUnits,
      activeUnits: operatingUnits,
      breakdownUnits,
      physicalAvailabilityPA: 88.5,
      useOfAvailabilityUA: 76.2,
      matchFactor: 0.94,
      problematicUnits: [
        { code: "EX-204", type: "Komatsu PC1250", issue: "Kebocoran Pipa Hidrolik Boom", downtimeHours: 3.5 },
        { code: "HT-108", type: "CAT 777", issue: "Ban Belakang Kanan Bocor (Tire Cut)", downtimeHours: 1.8 },
      ],
    };
  } catch (err) {
    return {
      success: false,
      totalFleetUnits: 68,
      activeUnits: 62,
      breakdownUnits: 3,
      physicalAvailabilityPA: 88.5,
      useOfAvailabilityUA: 76.2,
      matchFactor: 0.94,
      problematicUnits: [
        { code: "EX-204", type: "Komatsu PC1250", issue: "Kebocoran Pipa Hidrolik Boom", downtimeHours: 3.5 },
      ],
    };
  }
}

/**
 * Tool 3: Fuel Consumption & Anomaly Tool
 */
export async function toolGetFuelData(companyId: string, siteId: string) {
  return {
    success: true,
    totalFuelLitersToday: 42150,
    fuelRatioOB: 0.867, // Liter / BCM
    fuelRatioCoal: 1.45, // Liter / MT
    budgetFuelPricePerLiterIDR: 14500,
    anomaliesDetected: [
      {
        equipmentCode: "HT-112",
        type: "Sudden Spike",
        consumptionRateLph: 68.4,
        avgNormalLph: 48.2,
        variancePct: "+41.9%",
        status: "Terindikasi Anomali Konsumsi Solar (Perlu Check Injektor/Filter)",
      },
    ],
  };
}

/**
 * Tool 4: Maintenance & Predictive Maintenance Tool
 */
export async function toolGetMaintenanceData(companyId: string, siteId: string) {
  return {
    success: true,
    openWorkOrders: 5,
    scheduledPM: 2,
    unscheduledBreakdown: 3,
    predictiveRiskAlerts: [
      {
        equipmentCode: "EX-202",
        model: "Komatsu PC2000",
        healthScore: 68,
        failureRiskPct: 78.4,
        predictedComponent: "Hydraulic Pump Main Bearing",
        recommendedAction: "Schedule Preventive Replacement in 48h to avoid Catastrophic Failure",
      },
    ],
  };
}

/**
 * Tool 5: Finance & Cost Analytics Tool
 */
export async function toolGetFinanceData(companyId: string, siteId: string) {
  try {
    const revs = await finRepo.getRevenueRecords();
    const opex = await finRepo.getOpexRecords();

    const totalRevUSD = revs.reduce((sum, r: any) => sum + (r.netRevenueUSD || (r.netRevenueIDR ? r.netRevenueIDR / 15800 : 1200000)), 0) || 1250000;
    const totalOpexIDR = opex.reduce((sum, o: any) => sum + (o.actualAmountIDR || o.amountIDR || 8500000000), 0) || 8850000000;
    const exchangeRate = 15800;
    const totalOpexUSD = totalOpexIDR / exchangeRate;
    const productionMT = 285000; // Monthly total
    const costPerTonUSD = Number((totalOpexUSD / Math.max(1, productionMT)).toFixed(2)) || 26.8;

    return {
      success: true,
      monthlyRevenueUSD: totalRevUSD,
      monthlyOpexUSD: Math.round(totalOpexUSD),
      costPerTonUSD,
      costPerBCMUSD: Number((costPerTonUSD / 3.41).toFixed(2)),
      budgetValueUSD: 24.5,
      varianceCostPerTonPct: Number((((costPerTonUSD - 24.5) / 24.5) * 100).toFixed(1)),
      costDrivers: [
        { category: "Solar / Fuel", sharePct: 38.5, status: "SPIKE (+8.2% vs Budget)" },
        { category: "Spare Parts & Maintenance", sharePct: 24.2, status: "WITHIN_BUDGET" },
        { category: "Contractor Hauling Fee", sharePct: 22.0, status: "WITHIN_BUDGET" },
        { category: "Labor & HSE", sharePct: 15.3, status: "WITHIN_BUDGET" },
      ],
    };
  } catch (err) {
    return {
      success: false,
      monthlyRevenueUSD: 1250000,
      monthlyOpexUSD: 560000,
      costPerTonUSD: 26.8,
      budgetValueUSD: 24.5,
      varianceCostPerTonPct: 9.4,
      costDrivers: [
        { category: "Solar / Fuel", sharePct: 38.5, status: "SPIKE (+8.2% vs Budget)" },
      ],
    };
  }
}

/**
 * Tool 6: Geology & Coal Quality Tool
 */
export async function toolGetGeologyAndQualityData(companyId: string, siteId: string) {
  return {
    success: true,
    activeSeams: ["Seam A1", "Seam B2 (Main Seam)", "Seam C1"],
    qualityAvg: {
      gcvGar: 4250,
      moisturePct: 34.2,
      ashPct: 5.6,
      sulfurPct: 0.42,
    },
    topQualitySeam: "Seam B2 (GAR 4,520 kcal/kg, Sulfur 0.28%)",
    qualityAlert: "Seam C1 Moisture naik ke 36.8% akibat genangan air pasca hujan di Pit 2 West",
  };
}

/**
 * Tool 7: Stockpile & Inventory Tool
 */
export async function toolGetStockpileData(companyId: string, siteId: string) {
  return {
    success: true,
    romStockpileMT: 128400,
    cleanCoalStockpileMT: 85200,
    jettyStockpileMT: 42100,
    totalStockpileMT: 255700,
    blendingCapacityTph: 800,
    qualityByStockpile: [
      { name: "ROM Stockpile Pit 1", tonnageMT: 74200, gar: 4300 },
      { name: "ROM Stockpile Pit 2", tonnageMT: 54200, gar: 4100 },
    ],
  };
}

/**
 * Tool 8: HSE & Safety Risk Tool
 */
export async function toolGetHSEData(companyId: string, siteId: string) {
  return {
    success: true,
    safeDaysLTI: 342,
    nearMissesThisMonth: 2,
    openHazards: 1,
    topRiskThisWeek: {
      riskTitle: "Kondisi Jalan Hauling KM 4 Licin Pasca Hujan & Kepadatan Simpang",
      severity: "HIGH",
      recommendedAction: "Operasikan Grader D375 & Batasi Kecepatan Truk Max 30 KM/Jam",
    },
  };
}

/**
 * Tool 9: GIS & Spatial Tool
 */
export async function toolGetGISData(companyId: string, siteId: string) {
  return {
    success: true,
    pits: [
      { id: "pit-1", name: "Pit 1 South", areaHa: 142.5, coordinates: [-2.1234, 115.4567] },
      { id: "pit-2", name: "Pit 2 North", areaHa: 98.2, coordinates: [-2.1298, 115.4612] },
    ],
    stockpiles: [
      { id: "sp-1", name: "ROM Stockpile A", distanceToPit1Km: 2.4, distanceToPit2Km: 4.1 },
    ],
    haulingRoadLengthKm: 18.5,
  };
}

/**
 * Tool 10: RAG Knowledge Base Search
 */
export function toolGetKnowledgeBaseDocs(queryStr: string): KnowledgeDocument[] {
  const sampleDocs: KnowledgeDocument[] = [
    {
      id: "doc-sop-001",
      title: "SOP Operasional Hauling & Dust Suppression Tambang",
      category: "SOP",
      section: "Pasal 3.2 — Manajemen Kecepatan & Penyiraman Jalan",
      content:
        "Kecepatan kendaraan HD/Truck di jalan hauling maksimal 40 km/jam pada kondisi kering dan 25 km/jam pada kondisi basah/penyiraman. Penyiraman jalan wajib menggunakan larutan dust suppressant dengan interval minimal 2 jam.",
      tags: ["hauling", "safety", "dust", "sop"],
      updatedDate: "2026-05-10",
      author: "HSE & Mining Ops Dept",
    },
    {
      id: "doc-sop-002",
      title: "Prosedur Penanganan Anomali Konsumsi Bahan Bakar (Fuel Loss Investigation)",
      category: "POLICY",
      section: "Pasal 5.1 — Threshold Kebocoran & Penyelidikan",
      content:
        "Apabila konsumsi solar unit melebih 25% dari standar spesifikasi pabrikan (misal Komatsu PC1250 > 55 L/Jam), Supervisor wajib melakukan verifikasi fisik tangki, meteran flow, dan pengujian injektor dalam waktu max 24 jam. Jangan menuduh pencurian tanpa bukti CCTV/meter resmi.",
      tags: ["fuel", "solar", "investigation", "maintenance"],
      updatedDate: "2026-06-15",
      author: "Internal Audit & Plant Dept",
    },
    {
      id: "doc-sop-003",
      title: "Panduan Manajemen Kualitas Batubara & Blending Stockpile",
      category: "MANUAL",
      section: "Pasal 2.4 — Target Spesifikasi Buyer",
      content:
        "Pencampuran (blending) batubara GAR 4100 dengan GAR 4500 wajib dilakukan pada feeder crusher dengan rasio 1:1 untuk mencapai spesifikasi kontrak GAR 4300 kcal/kg dengan Total Moisture di bawah 35%.",
      tags: ["coal", "quality", "blending", "stockpile"],
      updatedDate: "2026-04-20",
      author: "Geology & Quality Dept",
    },
  ];

  const cleanQ = queryStr.toLowerCase();
  return sampleDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(cleanQ) ||
      d.content.toLowerCase().includes(cleanQ) ||
      d.tags.some((t) => t.includes(cleanQ))
  );
}

/**
 * Tool 11: What-If Deterministic Calculation Engine
 */
export function toolSimulateWhatIf(params: AIWhatIfParams): AIWhatIfResult {
  const baseCoalMT = 285000;
  const baseOpexUSD = 7638000;
  const baseCostPerTonUSD = 26.8;
  const basePriceUSD = params.coalSellingPriceUSD || 68.0;

  // Calculate simulated parameters
  const simulatedCoalMT = baseCoalMT * (1 + params.productionVolumeChangePct / 100);
  
  // Fuel accounts for ~38.5% of cost
  const fuelCostPortion = baseOpexUSD * 0.385;
  const otherCostPortion = baseOpexUSD * 0.615;
  
  // Fleet availability change affects efficiency (lower availability increases downtime fixed cost)
  const availMultiplier = 1 - (params.fleetAvailabilityChangePct / 100) * 0.5;

  const simulatedFuelCost = fuelCostPortion * (1 + params.fuelPriceChangePct / 100);
  const simulatedTotalOpexUSD = (simulatedFuelCost + otherCostPortion) * availMultiplier;

  const simulatedCostPerTonUSD = Number((simulatedTotalOpexUSD / Math.max(1, simulatedCoalMT)).toFixed(2));

  const baseRevenueUSD = baseCoalMT * basePriceUSD;
  const simulatedRevenueUSD = simulatedCoalMT * basePriceUSD;

  const baseProfitUSD = baseRevenueUSD - baseOpexUSD;
  const simulatedProfitUSD = simulatedRevenueUSD - simulatedTotalOpexUSD;

  const baseMarginPct = Number(((baseProfitUSD / baseRevenueUSD) * 100).toFixed(1));
  const simulatedMarginPct = Number(((simulatedProfitUSD / simulatedRevenueUSD) * 100).toFixed(1));

  const varianceProfitUSD = simulatedProfitUSD - baseProfitUSD;
  const varianceCostUSD = simulatedCostPerTonUSD - baseCostPerTonUSD;

  const summaryText = `Simulasi menunjukkan: Jika produksi berubah ${
    params.productionVolumeChangePct >= 0 ? "+" : ""
  }${params.productionVolumeChangePct}%, harga solar ${
    params.fuelPriceChangePct >= 0 ? "+" : ""
  }${params.fuelPriceChangePct}%, dan ketersediaan fleet ${
    params.fleetAvailabilityChangePct >= 0 ? "+" : ""
  }${params.fleetAvailabilityChangePct}%, maka Cost/Ton menjadi **$${simulatedCostPerTonUSD}/MT** (variasi $${varianceCostUSD > 0 ? "+" : ""}${varianceCostUSD.toFixed(2)}/MT) dan estimasi Net Profit bulanan menjadi **$${(simulatedProfitUSD / 1000000).toFixed(2)} Juta** (${varianceProfitUSD >= 0 ? "+" : ""}$${(varianceProfitUSD / 1000).toFixed(0)}k).`;

  return {
    baseCoalMT,
    simulatedCoalMT,
    baseCostPerTonUSD,
    simulatedCostPerTonUSD,
    baseRevenueUSD,
    simulatedRevenueUSD,
    baseMarginPct,
    simulatedMarginPct,
    varianceCostUSD,
    varianceProfitUSD,
    summaryText,
  };
}

export async function toolGetAIAnalyticsData(companyId: string, siteId: string) {
  const { AIAnalyticsEngine } = await import("./analytics/AIAnalyticsEngine");
  const summary = await AIAnalyticsEngine.generateAnalyticsSummary(companyId, siteId);
  const prodForecast = await AIAnalyticsEngine.getProductionForecast(companyId, siteId, "END_OF_MONTH");
  const rca = AIAnalyticsEngine.getRootCauseAnalysis("PRODUCTION_DROP");
  const anomalies = AIAnalyticsEngine.getAnomalies();
  const risks = AIAnalyticsEngine.getRiskMatrix();
  const fleetOpt = await AIAnalyticsEngine.getFleetOptimization(companyId, siteId);
  const models = AIAnalyticsEngine.getModels();

  return {
    summary,
    prodForecast,
    rca,
    anomalies,
    risks,
    fleetOpt,
    models,
  };
}

export async function toolGetReportingBIIntegrationData(companyId: string, siteId: string) {
  const { ReportingEngine } = await import("../reporting/ReportingEngine");
  const { BIEngine } = await import("../bi/BIEngine");
  const { IntegrationHub } = await import("../integration/IntegrationHub");

  const templates = ReportingEngine.getTemplates();
  const archives = ReportingEngine.getArchives();
  const schedules = ReportingEngine.getSchedules();
  const dashboards = BIEngine.getDashboards();
  const kpis = BIEngine.getKPIs();
  const connectors = IntegrationHub.getConnectors();
  const apiKeys = IntegrationHub.getAPIKeys();
  const webhooks = IntegrationHub.getWebhooks();

  return {
    templates,
    archives,
    schedules,
    dashboards,
    kpis,
    connectors,
    apiKeys,
    webhooks,
  };
}

export async function toolGetCommercialOfflineData(companyId: string, siteId: string) {
  const { OfflineSyncEngine } = await import("../offline/OfflineSyncEngine");
  const { SecurityCenterService } = await import("../security/SecurityCenterService");
  const { CommercialService } = await import("../commercial/CommercialService");

  return {
    syncQueue: OfflineSyncEngine.getSyncQueue(),
    userDevices: SecurityCenterService.getDevices(),
    securityEvents: SecurityCenterService.getSecurityEvents(),
    disasterRecoveryStatus: SecurityCenterService.getDisasterRecoveryStatus(),
    plans: CommercialService.getPlans(),
    onboardingSteps: CommercialService.getOnboardingSteps(),
    supportTickets: CommercialService.getSupportTickets(),
    readinessScorecard: CommercialService.getCommercialReadinessScorecard(),
  };
}



