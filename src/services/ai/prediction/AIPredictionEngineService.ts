// MINE SMART AI - AI Prediction & Forecasting Service
// Multi-Horizon Forecasting Engine for Production, Fuel, Maintenance Breakdown, Cost, Sales, and Stock

import {
  PredictionHorizon,
  PredictionScenario,
  ProductionForecastSummary,
  FuelForecastSummary,
  MaintenanceForecastSummary,
  CostForecastSummary,
  SalesForecastSummary,
  StockpileForecastSummary,
  UnifiedPredictionEngineData,
  ComponentBreakdownRisk,
} from "../../../types/aiPredictionEngineTypes";

export class AIPredictionEngineService {
  /**
   * 1. PRODUCTION FORECAST
   */
  public static getProductionForecast(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): ProductionForecastSummary {
    const multiplier =
      scenario === "OPTIMISTIC"
        ? 1.08
        : scenario === "PESSIMISTIC"
        ? 0.91
        : scenario === "WEATHER_ADVERSE"
        ? 0.84
        : 1.0;

    const baseDates = [
      "17 Agu", "18 Agu", "19 Agu", "20 Agu", "21 Agu", "22 Agu", "23 Agu",
      "24 Agu", "25 Agu", "26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu",
    ];

    const timeSeries = baseDates.map((d, i) => {
      const isRainy = (i === 3 || i === 8 || i === 11) && scenario === "WEATHER_ADVERSE";
      const plannedCoal = 16000 + (i % 3) * 300;
      const forecastCoal = Math.round(
        (plannedCoal * multiplier + (Math.sin(i) * 600 - (isRainy ? 3500 : 0)))
      );
      const plannedOB = 92000 + (i % 4) * 1200;
      const forecastOB = Math.round(
        (plannedOB * multiplier + (Math.cos(i) * 2000 - (isRainy ? 18000 : 0)))
      );
      const sr = Number((forecastOB / forecastCoal).toFixed(2));

      return {
        date: d,
        coalPlannedMT: plannedCoal,
        coalForecastMT: forecastCoal,
        coalP10MT: Math.round(forecastCoal * 0.92),
        coalP90MT: Math.round(forecastCoal * 1.06),
        obPlannedBCM: plannedOB,
        obForecastBCM: forecastOB,
        strippingRatio: sr,
        rainfallMm: isRainy ? 42.5 : Math.round(Math.random() * 8),
        confidenceScore: isRainy ? 88.5 : 94.2,
      };
    });

    const totalCoalForecast = timeSeries.reduce((acc, p) => acc + p.coalForecastMT, 0);
    const totalCoalTarget = timeSeries.reduce((acc, p) => acc + p.coalPlannedMT, 0);
    const totalOBForecast = timeSeries.reduce((acc, p) => acc + p.obForecastBCM, 0);
    const totalOBTarget = timeSeries.reduce((acc, p) => acc + p.obPlannedBCM, 0);

    return {
      horizon,
      totalCoalForecastMT: totalCoalForecast,
      coalTargetMT: totalCoalTarget,
      coalVariancePct: Number((((totalCoalForecast - totalCoalTarget) / totalCoalTarget) * 100).toFixed(1)),
      totalOBForecastBCM: totalOBForecast,
      obTargetBCM: totalOBTarget,
      averageSR: Number((totalOBForecast / totalCoalForecast).toFixed(2)),
      rainDelayHoursPredicted: scenario === "WEATHER_ADVERSE" ? 18.5 : 4.0,
      pitForecasts: [
        { pitName: "Pit North Alpha", coalMT: Math.round(totalCoalForecast * 0.48), obBCM: Math.round(totalOBForecast * 0.46), confidence: 95.1 },
        { pitName: "Pit South Bravo", coalMT: Math.round(totalCoalForecast * 0.32), obBCM: Math.round(totalOBForecast * 0.33), confidence: 93.8 },
        { pitName: "Pit West Charlie", coalMT: Math.round(totalCoalForecast * 0.20), obBCM: Math.round(totalOBForecast * 0.21), confidence: 92.4 },
      ],
      modelInfo: {
        algorithm: "Gradient Boosted Tree + LSTM Spatio-Temporal Hybrid",
        accuracyMAPE: 3.42,
        trainingDataPoints: 148500,
        lastTrained: "2026-08-16 00:00 WITA",
      },
      timeSeries,
    };
  }

  /**
   * 2. FUEL FORECAST
   */
  public static getFuelForecast(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): FuelForecastSummary {
    const multiplier = scenario === "WEATHER_ADVERSE" ? 1.08 : scenario === "OPTIMISTIC" ? 0.96 : 1.0;

    const baseDates = [
      "17 Agu", "18 Agu", "19 Agu", "20 Agu", "21 Agu", "22 Agu", "23 Agu",
      "24 Agu", "25 Agu", "26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu",
    ];

    let currentStock = 422500;
    const timeSeries = baseDates.map((d, i) => {
      const budgetLiters = 39800;
      const predictedLiters = Math.round((budgetLiters * multiplier) + (Math.sin(i * 1.5) * 1200));
      currentStock = Math.max(0, currentStock - predictedLiters + (i === 6 ? 250000 : 0)); // Delivery on day 7

      return {
        date: d,
        predictedLiters,
        budgetLiters,
        fuelRatioLperBCM: Number((0.42 * multiplier + (Math.cos(i) * 0.01)).toFixed(3)),
        fuelFarmStockLiters: currentStock,
        reorderAlert: currentStock < 150000,
      };
    });

    const totalPredicted = timeSeries.reduce((acc, p) => acc + p.predictedLiters, 0);
    const totalBudget = timeSeries.reduce((acc, p) => acc + p.budgetLiters, 0);

    return {
      horizon,
      totalPredictedLiters: totalPredicted,
      totalBudgetLiters: totalBudget,
      varianceLiters: totalPredicted - totalBudget,
      projectedCostUSD: Math.round(totalPredicted * 0.92), // ~ $0.92 per liter
      averageFuelRatio: 0.425,
      targetFuelRatio: 0.43,
      daysOfInventoryLeft: 10.8,
      suggestedPoDate: "2026-08-22",
      equipmentClassBreakdown: [
        { className: "Dump Truck 100T Fleet (CAT 777G / HD785)", predictedLiters: Math.round(totalPredicted * 0.54), unitCount: 58, burnRateLph: 69.2 },
        { className: "Heavy Excavators (PC2000 / EX1200)", predictedLiters: Math.round(totalPredicted * 0.28), unitCount: 10, burnRateLph: 105.4 },
        { className: "Bulldozers & Graders (D8R / GD825)", predictedLiters: Math.round(totalPredicted * 0.12), unitCount: 20, burnRateLph: 36.8 },
        { className: "Auxiliary & Light Vehicles", predictedLiters: Math.round(totalPredicted * 0.06), unitCount: 34, burnRateLph: 14.2 },
      ],
      timeSeries,
    };
  }

  /**
   * 3. MAINTENANCE BREAKDOWN FORECAST
   */
  public static getMaintenanceForecast(
    horizon: PredictionHorizon = "30_DAYS"
  ): MaintenanceForecastSummary {
    const highRiskUnits: ComponentBreakdownRisk[] = [
      {
        equipmentId: "EX-204",
        model: "Komatsu PC2000-8",
        component: "HYDRAULIC_PUMP",
        breakdownProbability72hPct: 87.4,
        breakdownProbability30dPct: 98.2,
        remainingUsefulLifeHours: 42,
        recommendedAction: "Ganti main hydraulic pump cartridge & periksa kontaminasi oli saat Shift Service malam ini.",
        estimatedDowntimeAvoidanceHours: 36,
        costImpactAvoidedUSD: 24500,
        riskLevel: "CRITICAL",
        sensorTriggers: ["Vibration Frequency Spike (780 Hz)", "Differential Pressure > 3.2 bar", "Oil Particle Count ISO 21/18/15"],
      },
      {
        equipmentId: "DT-712",
        model: "CAT 777G",
        component: "FINAL_DRIVE",
        breakdownProbability72hPct: 74.2,
        breakdownProbability30dPct: 89.0,
        remainingUsefulLifeHours: 78,
        recommendedAction: "Inspeksi planetary gear wear & ganti seal final drive roda belakang kiri.",
        estimatedDowntimeAvoidanceHours: 24,
        costImpactAvoidedUSD: 16800,
        riskLevel: "HIGH",
        sensorTriggers: ["Hub Temperature +18°C above Ambient", "Ferrous Debris Sensor Warning"],
      },
      {
        equipmentId: "DT-803",
        model: "Komatsu HD785-7",
        component: "TRANSMISSION",
        breakdownProbability72hPct: 62.0,
        breakdownProbability30dPct: 81.5,
        remainingUsefulLifeHours: 110,
        recommendedAction: "Kalibrasi modulation valve & flushing torque converter fluid.",
        estimatedDowntimeAvoidanceHours: 18,
        costImpactAvoidedUSD: 12200,
        riskLevel: "HIGH",
        sensorTriggers: ["Clutch Slippage Warning Code 402", "Oil Sump Temp 112°C"],
      },
      {
        equipmentId: "EX-102",
        model: "Hitachi EX1200-7",
        component: "TURBOCHARGER",
        breakdownProbability72hPct: 45.0,
        breakdownProbability30dPct: 68.0,
        remainingUsefulLifeHours: 165,
        recommendedAction: "Periksa axial play turbin & bersihkan intercooler.",
        estimatedDowntimeAvoidanceHours: 12,
        costImpactAvoidedUSD: 7500,
        riskLevel: "MEDIUM",
        sensorTriggers: ["Boost Pressure Drop 0.4 bar", "Exhaust Temp Delta 45°C"],
      },
    ];

    return {
      horizon,
      predictedBreakdownsCount: 9,
      preventableFailuresCount: 8,
      fleetMeanTimeBetweenFailuresHours: 342,
      fleetMeanTimeToRepairHours: 4.8,
      projectedUnscheduledDowntimeHours: 32.5,
      potentialCostSavingsUSD: 61000,
      highRiskUnits,
    };
  }

  /**
   * 4. COST FORECAST
   */
  public static getCostForecast(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): CostForecastSummary {
    const multiplier = scenario === "WEATHER_ADVERSE" ? 1.06 : scenario === "OPTIMISTIC" ? 0.95 : 1.0;

    const baseDates = [
      "17 Agu", "18 Agu", "19 Agu", "20 Agu", "21 Agu", "22 Agu", "23 Agu",
      "24 Agu", "25 Agu", "26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu",
    ];

    const timeSeries = baseDates.map((d, i) => {
      const budgetCost = 385000;
      const forecastCost = Math.round(budgetCost * multiplier + Math.sin(i) * 12000);
      const coalTons = 16000;
      const obBcm = 92000;

      return {
        date: d,
        totalOpexUSD: forecastCost,
        budgetOpexUSD: budgetCost,
        costPerTonUSD: Number((forecastCost / coalTons).toFixed(2)),
        budgetCostPerTonUSD: Number((budgetCost / coalTons).toFixed(2)),
        costPerBcmUSD: Number((forecastCost / (coalTons + obBcm * 0.4)).toFixed(2)),
      };
    });

    const totalForecast = timeSeries.reduce((acc, p) => acc + p.totalOpexUSD, 0);
    const totalBudget = timeSeries.reduce((acc, p) => acc + p.budgetOpexUSD, 0);
    const varianceUSD = totalForecast - totalBudget;

    return {
      horizon,
      totalForecastOpexUSD: totalForecast,
      totalBudgetOpexUSD: totalBudget,
      costVarianceUSD: varianceUSD,
      variancePct: Number(((varianceUSD / totalBudget) * 100).toFixed(2)),
      forecastCostPerTonUSD: 24.18,
      budgetCostPerTonUSD: 24.85,
      costBreakdown: [
        { category: "Fuel & Oils (Solar)", forecastUSD: Math.round(totalForecast * 0.38), budgetUSD: Math.round(totalBudget * 0.39), variancePct: -1.2, primaryDriver: "Penurunan fuel burn rate efisiensi jalan hauling" },
        { category: "Parts & Maintenance", forecastUSD: Math.round(totalForecast * 0.26), budgetUSD: Math.round(totalBudget * 0.25), variancePct: 3.5, primaryDriver: "Preventive replacement hydraulic pump EX-204" },
        { category: "Labor & Operators", forecastUSD: Math.round(totalForecast * 0.18), budgetUSD: Math.round(totalBudget * 0.18), variancePct: 0.0, primaryDriver: "Sesuai jadwal shift man-power" },
        { category: "Explosives & Blasting", forecastUSD: Math.round(totalForecast * 0.10), budgetUSD: Math.round(totalBudget * 0.10), variancePct: -2.1, primaryDriver: "Optimasi spasi lubang ledak Pit North" },
        { category: "Overheads & HSE/Reclamation", forecastUSD: Math.round(totalForecast * 0.08), budgetUSD: Math.round(totalBudget * 0.08), variancePct: 0.5, primaryDriver: "Penanaman bibit reklamasi void 1" },
      ],
      timeSeries,
    };
  }

  /**
   * 5. SALES & REVENUE FORECAST
   */
  public static getSalesForecast(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): SalesForecastSummary {
    const priceAdjustment = scenario === "OPTIMISTIC" ? 1.05 : scenario === "PESSIMISTIC" ? 0.94 : 1.0;

    const baseDates = [
      "17 Agu", "18 Agu", "19 Agu", "20 Agu", "21 Agu", "22 Agu", "23 Agu",
      "24 Agu", "25 Agu", "26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu",
    ];

    const timeSeries = baseDates.map((d, i) => {
      const contractSales = 9500;
      const spotSales = 4200;
      const dmoSales = 3500;
      const indexPrice = Number((68.5 * priceAdjustment + Math.sin(i * 0.8) * 2.5).toFixed(2));
      const totalTons = contractSales + spotSales + dmoSales;
      const revenue = Math.round(totalTons * indexPrice);

      return {
        date: d,
        contractSalesTons: contractSales,
        spotSalesTons: spotSales,
        dmoPlnSalesTons: dmoSales,
        projectedIndexPriceUSD: indexPrice,
        projectedRevenueUSD: revenue,
        bargeShipmentsPlanned: (i % 2 === 0) ? 2 : 1,
      };
    });

    const totalRevenueUSD = timeSeries.reduce((acc, p) => acc + p.projectedRevenueUSD, 0);
    const targetRevenueUSD = 16800000;
    const totalTons = timeSeries.reduce((acc, p) => acc + (p.contractSalesTons + p.spotSalesTons + p.dmoPlnSalesTons), 0);

    return {
      horizon,
      totalProjectedRevenueUSD: totalRevenueUSD,
      totalProjectedRevenueIDR: totalRevenueUSD * 16000,
      targetRevenueUSD,
      revenueVariancePct: Number((((totalRevenueUSD - targetRevenueUSD) / targetRevenueUSD) * 100).toFixed(2)),
      projectedCoalSalesMT: totalTons,
      averageSellingPriceUSD: Number((totalRevenueUSD / totalTons).toFixed(2)),
      dmoFulfilmentPct: 27.4, // Mandatory > 25%
      marketPriceIndexForecastUSD: {
        ici3GAR5000: Number((82.4 * priceAdjustment).toFixed(2)),
        ici4GAR4200: Number((58.6 * priceAdjustment).toFixed(2)),
        newcastleIndex: Number((138.2 * priceAdjustment).toFixed(2)),
      },
      customerShipmentProjections: [
        { buyerName: "PT PLN Nusantara Power (PLTU Paiton)", contractType: "DMO_PLN", contractedTons: 65000, projectedRevenueUSD: 3770000, laycanPeriod: "18-22 Agu", demurrageRiskPct: 4.2 },
        { buyerName: "Glencore International AG (Export)", contractType: "EXPORT_SPOT", contractedTons: 95000, projectedRevenueUSD: 6840000, laycanPeriod: "20-25 Agu", demurrageRiskPct: 8.5 },
        { buyerName: "Semen Indonesia Group (Tuban Plant)", contractType: "DMO_PLN", contractedTons: 35000, projectedRevenueUSD: 2100000, laycanPeriod: "23-27 Agu", demurrageRiskPct: 2.1 },
        { buyerName: "Jera Co. Inc (Japan Power Gen)", contractType: "LONG_TERM", contractedTons: 50000, projectedRevenueUSD: 4150000, laycanPeriod: "26-30 Agu", demurrageRiskPct: 5.0 },
      ],
      timeSeries,
    };
  }

  /**
   * 6. STOCK / INVENTORY FORECAST
   */
  public static getStockpileForecast(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): StockpileForecastSummary {
    const baseDates = [
      "17 Agu", "18 Agu", "19 Agu", "20 Agu", "21 Agu", "22 Agu", "23 Agu",
      "24 Agu", "25 Agu", "26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu",
    ];

    let currentStock = 185400;
    const maxCapacity = 350000;

    const timeSeries = baseDates.map((d, i) => {
      const inbound = 16200 + (i % 3) * 600;
      const outbound = (i % 2 === 0) ? 18000 : 12000;
      currentStock = currentStock + inbound - outbound;

      return {
        date: d,
        inboundCoalTons: inbound,
        outboundBargeTons: outbound,
        closingStockTons: currentStock,
        maxStockCapacityTons: maxCapacity,
        spontaneousCombustionRiskScore: Math.min(100, Math.round(35 + (i * 2.5) + (currentStock > 220000 ? 15 : 0))),
      };
    });

    const finalStock = timeSeries[timeSeries.length - 1].closingStockTons;

    return {
      horizon,
      currentTotalStockTons: 185400,
      projectedClosingStockTons: finalStock,
      stockpileMaxCapacityTons: maxCapacity,
      capacityUtilizationPct: Number(((finalStock / maxCapacity) * 100).toFixed(1)),
      daysOfForwardSalesCoverage: 11.4,
      highRiskSelfHeatingPiles: [
        { pileId: "Pile ROM-3B (GAR 4200)", seamQuality: "High Volatile Matter Seam 11", volumeTons: 42000, agingDays: 28, spontaneousCombustionRisk: "HIGH", recommendedPriorityAction: "Jadwalkan pemuatan tongkang TB Megamas hari ini & lakukan pemadatan (compaction) stockpile." },
        { pileId: "Pile Crushed-2A (GAR 5000)", seamQuality: "Low Ash Seam 8", volumeTons: 68000, agingDays: 14, spontaneousCombustionRisk: "MODERATE", recommendedPriorityAction: "Monitoring sensor termal infra-red 2x sehari pada zona timur." },
        { pileId: "Pile E-Stock (GAR 3800)", seamQuality: "Eco Coal Seam 6", volumeTons: 75400, agingDays: 8, spontaneousCombustionRisk: "LOW", recommendedPriorityAction: "Rotasi sirkulasi normal terjaga." },
      ],
      timeSeries,
    };
  }

  /**
   * Complete Multi-Domain Prediction Bundle
   */
  public static getUnifiedPredictionData(
    horizon: PredictionHorizon = "30_DAYS",
    scenario: PredictionScenario = "BASELINE"
  ): UnifiedPredictionEngineData {
    const production = this.getProductionForecast(horizon, scenario);
    const fuel = this.getFuelForecast(horizon, scenario);
    const maintenance = this.getMaintenanceForecast(horizon);
    const cost = this.getCostForecast(horizon, scenario);
    const sales = this.getSalesForecast(horizon, scenario);
    const stock = this.getStockpileForecast(horizon, scenario);

    const geminiPrescriptiveInsight =
      `Sintesis Multi-Domain AI: Prediksi periode ${horizon} menunjukkan output batubara ${production.totalCoalForecastMT.toLocaleString()} MT (+${production.coalVariancePct}% vs target). Namun terdeteksi anomali kritis pada Excavator EX-204 (probabilitas breakdown 87.4% dalam 72 jam) dan risiko swabakar pada Pile ROM-3B (aging 28 hari). Rekomendasi terintegrasi: Eksekusi penggantian hydraulic pump EX-204 malam ini, prioritaskan loading tongkang dari Pile ROM-3B, dan pertahankan fuel ratio pada 0.42 L/BCM untuk mengamankan margin profitabilitas sales $${(sales.totalProjectedRevenueUSD / 1e6).toFixed(2)}M.`;

    return {
      production,
      fuel,
      maintenance,
      cost,
      sales,
      stock,
      geminiPrescriptiveInsight,
    };
  }
}
