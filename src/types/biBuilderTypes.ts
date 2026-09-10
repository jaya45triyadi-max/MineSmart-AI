// MINE SMART AI - BI Dashboard Builder Types
// Real-time custom drag & drop widget analytics platform

export type WidgetCategory =
  | "PRODUCTION"
  | "FLEET"
  | "FUEL"
  | "COST"
  | "MAP"
  | "KPI"
  | "TABLE"
  | "AI_INSIGHT";

export type ChartRenderType =
  | "BAR"
  | "STACKED_BAR"
  | "LINE"
  | "AREA"
  | "DONUT"
  | "PIE"
  | "RADAR"
  | "GAUGE"
  | "SPARKLINE";

export type WidgetWidthSpan = 3 | 4 | 6 | 8 | 9 | 12; // 12-column grid system

export interface WidgetConfig {
  metricKey?: string;
  chartType?: ChartRenderType;
  timeRange?: "SHIFT" | "TODAY" | "7D" | "30D" | "MTD" | "YTD";
  refreshIntervalSeconds?: number;
  showLegend?: boolean;
  colorTheme?: "amber" | "emerald" | "blue" | "purple" | "rose" | "cyan";
  thresholdGood?: number;
  thresholdWarning?: number;
  thresholdCritical?: number;
  dataSource?: string;
  tableLimit?: number;
  mapZoom?: number;
  mapCenterPit?: string;
  aiFocusPrompt?: string;
}

export interface CustomBIWidget {
  id: string;
  title: string;
  category: WidgetCategory;
  width: WidgetWidthSpan;
  heightPx?: number;
  config: WidgetConfig;
  customDescription?: string;
}

export interface CustomBIDashboard {
  id: string;
  title: string;
  description: string;
  category: "EXECUTIVE" | "OPERATIONS" | "FLEET" | "FUEL_COST" | "SPATIAL" | "CUSTOM";
  createdAt: string;
  updatedAt: string;
  author: string;
  isPreset?: boolean;
  autoRefreshInterval: number; // 0 for off, or seconds (e.g. 10, 30, 60)
  widgets: CustomBIWidget[];
}

export interface WidgetPaletteItem {
  id: string;
  title: string;
  category: WidgetCategory;
  description: string;
  defaultWidth: WidgetWidthSpan;
  iconName: string;
  defaultConfig: WidgetConfig;
}

export interface KPIMetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  changePct: number;
  isPositiveGood: boolean;
  target: number;
  status: "GOOD" | "WARNING" | "CRITICAL";
  sparkline: number[];
  category: WidgetCategory;
}

export interface ProductionSeriesPoint {
  time: string;
  coalActualMT: number;
  coalTargetMT: number;
  obActualBCM: number;
  obTargetBCM: number;
  strippingRatio: number;
}

export interface FleetTelemetryData {
  equipmentId: string;
  model: string;
  type: "EXCAVATOR" | "DUMP_TRUCK" | "DOZER" | "GRADER" | "WATER_TRUCK";
  operator: string;
  status: "OPERATING" | "STANDBY" | "BREAKDOWN" | "REFUELING";
  paPercent: number; // Physical Availability
  uaPercent: number; // Use of Availability
  fuelBurnLph: number;
  payloadTons?: number;
  cycleCount?: number;
  locationPit: string;
}

export interface FuelConsumptionPoint {
  time: string;
  totalLiters: number;
  excavatorLiters: number;
  truckLiters: number;
  auxiliaryLiters: number;
  fuelRatioLiterPerBCM: number;
}

export interface CostBreakdownItem {
  category: string;
  amountUSD: number;
  amountIDR: number;
  percentage: number;
  costPerTonUSD: number;
  budgetVariancePct: number;
}

export interface AIInsightCard {
  id: string;
  timestamp: string;
  severity: "OPTIMIZATION" | "WARNING" | "CRITICAL_ALERT" | "OPPORTUNITY";
  title: string;
  summary: string;
  rootCause: string;
  prescriptiveAction: string;
  impactPotential: string;
  tags: string[];
}

export interface MapPitFeature {
  id: string;
  name: string;
  type: "PIT" | "DISPOSAL" | "STOCKPILE" | "HAUL_ROAD" | "CRUSHER";
  coordinates: { x: number; y: number };
  activeUnitsCount: number;
  status: "ACTIVE" | "RESTRICTED" | "STANDBY";
}
