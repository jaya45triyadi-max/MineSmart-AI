export type AIIntent =
  | "EXECUTIVE_BRIEFING"
  | "PRODUCTION_ANALYSIS"
  | "PRODUCTION_FORECAST"
  | "EQUIPMENT_ANALYSIS"
  | "FUEL_ANALYSIS"
  | "MAINTENANCE_ANALYSIS"
  | "HAULING_ANALYSIS"
  | "GEOLOGY_ANALYSIS"
  | "QUALITY_ANALYSIS"
  | "HSE_ANALYSIS"
  | "ENVIRONMENT_ANALYSIS"
  | "STOCKPILE_ANALYSIS"
  | "FINANCE_ANALYSIS"
  | "COST_ANALYSIS"
  | "BUDGET_ANALYSIS"
  | "SALES_ANALYSIS"
  | "INVENTORY_ANALYSIS"
  | "HR_ANALYSIS"
  | "PROCUREMENT_ANALYSIS"
  | "GIS_QUERY"
  | "REPORT_GENERATION"
  | "DATA_QUERY"
  | "RECOMMENDATION"
  | "ANOMALY_DETECTION"
  | "WHAT_IF_SIMULATION"
  | "GENERAL_QUERY";

export interface AISourceCitation {
  module: string;
  label: string;
  period: string;
  siteName: string;
  routePath?: string;
  lastUpdated?: string;
}

export interface AIActionProposal {
  id: string;
  actionType: "CREATE_DRAFT_TARGET" | "DISPATCH_REBALANCE" | "CREATE_WORK_ORDER" | "HSE_INSPECTION_REQUEST" | "BUDGET_ADJUSTMENT";
  description: string;
  targetModule: string;
  payload: Record<string, any>;
  status: "PROPOSED" | "APPROVED" | "EXECUTED" | "REJECTED";
  createdAt: string;
  executedAt?: string;
}

export interface AIMapCommand {
  command: "SHOW_LOCATION" | "SHOW_PIT" | "SHOW_EQUIPMENT" | "SHOW_STOCKPILE" | "SHOW_ROUTE" | "CALCULATE_DISTANCE";
  locationName?: string;
  pitId?: string;
  equipmentId?: string;
  coordinates?: [number, number];
  distanceKm?: number;
}

export interface AIChatMessageExtended {
  id: string;
  conversationId: string;
  sender: "USER" | "AI" | "SYSTEM";
  text: string;
  timestamp: string;
  agentName?: string;
  model?: string;
  intent?: AIIntent;
  evidence?: Array<{ label: string; value: string | number; unit?: string; status?: "OK" | "WARNING" | "CRITICAL" }>;
  potentialDrivers?: string[];
  recommendations?: Array<{ text: string; priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; expectedImpact?: string }>;
  sources?: AISourceCitation[];
  confidence?: "High" | "Medium" | "Low";
  mapCommand?: AIMapCommand;
  actionProposal?: AIActionProposal;
  suggestedFollowups?: string[];
  toolsUsed?: string[];
  isProactiveAlert?: boolean;
}

export interface AIConversationRecord {
  id: string;
  companyId: string;
  siteId: string;
  userId: string;
  title: string;
  isArchived: boolean;
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIInsightRecord {
  id: string;
  companyId: string;
  siteId: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  module: "PRODUCTION" | "FLEET" | "FUEL" | "MAINTENANCE" | "FINANCE" | "HSE" | "GEOLOGY" | "STOCKPILE";
  evidence: string[];
  recommendation: string;
  createdAt: string;
  isDismissed?: boolean;
  isSnoozed?: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "SOP" | "POLICY" | "MANUAL" | "HSE" | "GEOLOGY" | "MAINTENANCE";
  section?: string;
  content: string;
  tags: string[];
  updatedDate: string;
  author?: string;
}

export interface AIInteractionAuditLog {
  id: string;
  aiInteractionId: string;
  userId: string;
  userName: string;
  companyId: string;
  siteId: string;
  prompt: string;
  intent: AIIntent;
  toolsUsed: string[];
  status: "SUCCESS" | "FAILED";
  tokenUsage: number;
  durationMs: number;
  timestamp: string;
}

export interface AIWhatIfParams {
  productionVolumeChangePct: number;
  fuelPriceChangePct: number;
  fleetAvailabilityChangePct: number;
  coalSellingPriceUSD: number;
}

export interface AIWhatIfResult {
  baseCoalMT: number;
  simulatedCoalMT: number;
  baseCostPerTonUSD: number;
  simulatedCostPerTonUSD: number;
  baseRevenueUSD: number;
  simulatedRevenueUSD: number;
  baseMarginPct: number;
  simulatedMarginPct: number;
  varianceCostUSD: number;
  varianceProfitUSD: number;
  summaryText: string;
}

export type AIAutoSignalType =
  | "PRODUKSI_TURUN"
  | "FUEL_MENINGKAT"
  | "DOWNTIME_MENINGKAT"
  | "CYCLE_TIME_MENINGKAT"
  | "HAULING_TIDAK_OPTIMAL"
  | "PRODUKTIVITAS_EXCAVATOR_TURUN"
  | "STOCKPILE_TIDAK_SEIMBANG"
  | "KUALITAS_COAL_BERUBAH"
  | "RISIKO_HSE_MENINGKAT";

export interface AIAutoDetectedSignal {
  id: string;
  type: AIAutoSignalType;
  title: string;
  category: "PRODUKSI" | "FLEET" | "FUEL" | "LOGISTIK" | "STOCKPILE" | "QUALITY" | "HSE";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  metricLabel: string;
  currentValue: string;
  baselineValue: string;
  deviation: string;
  detectedAt: string;
  affectedPitOrArea: string;
  rootCauseSummary: string;
  quickActionPrompt: string;
}

export interface AIStructuredRecommendation {
  id: string;
  code: string;
  title: string;
  category: "OPERASI" | "FLEET" | "FUEL" | "KUALITAS" | "SAFETY" | "COST";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  // 4 Core Steps
  problem: string;
  rootCause: string;
  recommendation: string;
  expectedImpact: string;
  // Execution
  actionLabel: string;
  actionType: string;
  targetModule: string;
  status: "OPEN" | "IN_PROGRESS" | "EXECUTED";
  verifiedGain?: string;
  sources: AISourceCitation[];
}
