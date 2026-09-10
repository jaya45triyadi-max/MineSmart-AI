// MINE SMART AI - AI Prediction & Forecasting Engine Types
// 6 Core Forecasts: Production, Fuel, Maintenance Breakdown, Cost, Sales/Revenue, Stock/Inventory

export type PredictionHorizon = "7_DAYS" | "14_DAYS" | "30_DAYS" | "QUARTER_Q3" | "END_OF_YEAR";

export type PredictionScenario = "BASELINE" | "OPTIMISTIC" | "PESSIMISTIC" | "WEATHER_ADVERSE";

export type ForecastCategory =
  | "PRODUCTION"
  | "FUEL"
  | "MAINTENANCE"
  | "COST"
  | "SALES"
  | "STOCK";

// 1. Production Forecast Types
export interface ProductionForecastPoint {
  date: string;
  coalPlannedMT: number;
  coalForecastMT: number;
  coalP10MT: number;
  coalP90MT: number;
  obPlannedBCM: number;
  obForecastBCM: number;
  strippingRatio: number;
  rainfallMm: number;
  confidenceScore: number;
}

export interface ProductionForecastSummary {
  horizon: PredictionHorizon;
  totalCoalForecastMT: number;
  coalTargetMT: number;
  coalVariancePct: number;
  totalOBForecastBCM: number;
  obTargetBCM: number;
  averageSR: number;
  rainDelayHoursPredicted: number;
  pitForecasts: {
    pitName: string;
    coalMT: number;
    obBCM: number;
    confidence: number;
  }[];
  modelInfo: {
    algorithm: string;
    accuracyMAPE: number;
    trainingDataPoints: number;
    lastTrained: string;
  };
  timeSeries: ProductionForecastPoint[];
}

// 2. Fuel Forecast Types
export interface FuelForecastPoint {
  date: string;
  predictedLiters: number;
  budgetLiters: number;
  fuelRatioLperBCM: number;
  fuelFarmStockLiters: number;
  reorderAlert: boolean;
}

export interface FuelForecastSummary {
  horizon: PredictionHorizon;
  totalPredictedLiters: number;
  totalBudgetLiters: number;
  varianceLiters: number;
  projectedCostUSD: number;
  averageFuelRatio: number;
  targetFuelRatio: number;
  daysOfInventoryLeft: number;
  suggestedPoDate: string;
  equipmentClassBreakdown: {
    className: string;
    predictedLiters: number;
    unitCount: number;
    burnRateLph: number;
  }[];
  timeSeries: FuelForecastPoint[];
}

// 3. Maintenance Breakdown Forecast Types
export interface ComponentBreakdownRisk {
  equipmentId: string;
  model: string;
  component: "HYDRAULIC_PUMP" | "FINAL_DRIVE" | "TRANSMISSION" | "ENGINE_INJECTOR" | "TURBOCHARGER" | "SUSPENSION";
  breakdownProbability72hPct: number;
  breakdownProbability30dPct: number;
  remainingUsefulLifeHours: number;
  recommendedAction: string;
  estimatedDowntimeAvoidanceHours: number;
  costImpactAvoidedUSD: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sensorTriggers: string[];
}

export interface MaintenanceForecastSummary {
  horizon: PredictionHorizon;
  predictedBreakdownsCount: number;
  preventableFailuresCount: number;
  fleetMeanTimeBetweenFailuresHours: number;
  fleetMeanTimeToRepairHours: number;
  projectedUnscheduledDowntimeHours: number;
  potentialCostSavingsUSD: number;
  highRiskUnits: ComponentBreakdownRisk[];
}

// 4. Cost Forecast Types
export interface CostForecastPoint {
  date: string;
  totalOpexUSD: number;
  budgetOpexUSD: number;
  costPerTonUSD: number;
  budgetCostPerTonUSD: number;
  costPerBcmUSD: number;
}

export interface CostForecastSummary {
  horizon: PredictionHorizon;
  totalForecastOpexUSD: number;
  totalBudgetOpexUSD: number;
  costVarianceUSD: number;
  variancePct: number;
  forecastCostPerTonUSD: number;
  budgetCostPerTonUSD: number;
  costBreakdown: {
    category: string;
    forecastUSD: number;
    budgetUSD: number;
    variancePct: number;
    primaryDriver: string;
  }[];
  timeSeries: CostForecastPoint[];
}

// 5. Sales & Revenue Forecast Types
export interface AISalesForecastPoint {
  date: string;
  contractSalesTons: number;
  spotSalesTons: number;
  dmoPlnSalesTons: number;
  projectedIndexPriceUSD: number;
  projectedRevenueUSD: number;
  bargeShipmentsPlanned: number;
}

export interface SalesForecastSummary {
  horizon: PredictionHorizon;
  totalProjectedRevenueUSD: number;
  totalProjectedRevenueIDR: number;
  targetRevenueUSD: number;
  revenueVariancePct: number;
  projectedCoalSalesMT: number;
  averageSellingPriceUSD: number;
  dmoFulfilmentPct: number;
  marketPriceIndexForecastUSD: {
    ici3GAR5000: number;
    ici4GAR4200: number;
    newcastleIndex: number;
  };
  customerShipmentProjections: {
    buyerName: string;
    contractType: "DMO_PLN" | "EXPORT_SPOT" | "LONG_TERM";
    contractedTons: number;
    projectedRevenueUSD: number;
    laycanPeriod: string;
    demurrageRiskPct: number;
  }[];
  timeSeries: AISalesForecastPoint[];
}

// 6. Stock / Inventory Forecast Types
export interface StockpileForecastPoint {
  date: string;
  inboundCoalTons: number;
  outboundBargeTons: number;
  closingStockTons: number;
  maxStockCapacityTons: number;
  spontaneousCombustionRiskScore: number; // 0 - 100
}

export interface StockpileForecastSummary {
  horizon: PredictionHorizon;
  currentTotalStockTons: number;
  projectedClosingStockTons: number;
  stockpileMaxCapacityTons: number;
  capacityUtilizationPct: number;
  daysOfForwardSalesCoverage: number;
  highRiskSelfHeatingPiles: {
    pileId: string;
    seamQuality: string;
    volumeTons: number;
    agingDays: number;
    spontaneousCombustionRisk: "HIGH" | "MODERATE" | "LOW";
    recommendedPriorityAction: string;
  }[];
  timeSeries: StockpileForecastPoint[];
}

// Unified Prediction Dashboard State
export interface UnifiedPredictionEngineData {
  production: ProductionForecastSummary;
  fuel: FuelForecastSummary;
  maintenance: MaintenanceForecastSummary;
  cost: CostForecastSummary;
  sales: SalesForecastSummary;
  stock: StockpileForecastSummary;
  geminiPrescriptiveInsight: string;
}
