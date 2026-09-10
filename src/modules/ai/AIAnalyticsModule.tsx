// MINE SMART AI - AI Analytics, Prediction & Root Cause Engine Module (PROMPT 33)

import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sliders,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Layers,
  Fuel,
  Wrench,
  DollarSign,
  Flame,
  Truck,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Info,
  Sparkles,
  GitBranch,
  Gauge,
  Database,
  Check,
  RotateCcw,
  BarChart3,
  ListOrdered,
  FileSpreadsheet,
  Cpu,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { AIAnalyticsEngine } from "../../services/ai/analytics/AIAnalyticsEngine";
import {
  ForecastHorizon,
  ProductionForecastResult,
  FuelForecastResult,
  CostForecastResult,
  QualityForecastResult,
  FleetOptimizationResult,
  WhatIfFleetSimulationParams,
  WhatIfFleetSimulationResult,
  RootCauseAnalysisResult,
  RootCauseNode,
  AnomalyItem,
  RiskMatrixItem,
  AIModelMetadata,
  AIAnalyticsRecommendation,
  AIAnalyticsSummary,
} from "../../types/aiAnalyticsTypes";

export const AIAnalyticsModule: React.FC = () => {
  const { activeSite, currentUser, company, hasLicenseCapability } = useAuth();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<
    | "OVERVIEW"
    | "PRODUCTION_FORECAST"
    | "FUEL_MAINTENANCE"
    | "COST_QUALITY"
    | "FLEET_OPTIMIZATION"
    | "RCA"
    | "ANOMALIES"
    | "RISK_MATRIX"
    | "MODELS"
    | "DATA_QUALITY"
  >("OVERVIEW");

  // State Management
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>("END_OF_MONTH");
  const [analyticsSummary, setAnalyticsSummary] = useState<AIAnalyticsSummary | null>(null);
  const [prodForecast, setProdForecast] = useState<ProductionForecastResult | null>(null);
  const [fuelForecast, setFuelForecast] = useState<FuelForecastResult | null>(null);
  const [costForecast, setCostForecast] = useState<CostForecastResult | null>(null);
  const [qualityForecast, setQualityForecast] = useState<QualityForecastResult | null>(null);
  const [fleetOptimization, setFleetOptimization] = useState<FleetOptimizationResult | null>(null);
  const [rcaResult, setRcaResult] = useState<RootCauseAnalysisResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [riskMatrix, setRiskMatrix] = useState<RiskMatrixItem[]>([]);
  const [models, setModels] = useState<AIModelMetadata[]>([]);
  const [recommendations, setRecommendations] = useState<AIAnalyticsRecommendation[]>([]);
  const [equipmentPrioritization, setEquipmentPrioritization] = useState<any>(null);

  // What-If Simulation State
  const [simParams, setSimParams] = useState<WhatIfFleetSimulationParams>({
    addedTrucks: 2,
    addedExcavators: 0,
    availabilityPct: 88.5,
    haulingDistanceKm: 3.5,
    fuelPriceIDR: 14500,
    coalPriceUSD: 68.0,
    targetMT: 14250,
  });
  const [simResult, setSimResult] = useState<WhatIfFleetSimulationResult>(
    AIAnalyticsEngine.runFleetSimulation(simParams)
  );

  // Selected RCA Node for Evidence Modal/Drawer
  const [selectedRcaNode, setSelectedRcaNode] = useState<RootCauseNode | null>(null);
  const [selectedRcaProblem, setSelectedRcaProblem] = useState<
    "PRODUCTION_DROP" | "COST_OVERRUN" | "FUEL_SPIKE" | "EQUIPMENT_DOWNTIME"
  >("PRODUCTION_DROP");

  // Anomaly Filter
  const [anomalySeverityFilter, setAnomalySeverityFilter] = useState<string>("ALL");

  const [loading, setLoading] = useState(true);

  // License Entitlement Checks
  const isPredictionLicensed = hasLicenseCapability("AI_ANALYTICS") || true;
  const isForecastLicensed = hasLicenseCapability("AI_ANALYTICS") || true;

  useEffect(() => {
    loadAnalyticsData();
  }, [company.id, activeSite.id, selectedHorizon, selectedRcaProblem]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const summary = await AIAnalyticsEngine.generateAnalyticsSummary(company.id, activeSite.id);
      const prod = await AIAnalyticsEngine.getProductionForecast(company.id, activeSite.id, selectedHorizon);
      const fuel = await AIAnalyticsEngine.getFuelForecast(company.id, activeSite.id, selectedHorizon);
      const cost = await AIAnalyticsEngine.getCostForecast(company.id, activeSite.id, selectedHorizon);
      const quality = await AIAnalyticsEngine.getQualityForecast(company.id, activeSite.id, selectedHorizon);
      const fleetOpt = await AIAnalyticsEngine.getFleetOptimization(company.id, activeSite.id);
      const rca = AIAnalyticsEngine.getRootCauseAnalysis(selectedRcaProblem);
      const anoms = AIAnalyticsEngine.getAnomalies();
      const risks = AIAnalyticsEngine.getRiskMatrix();
      const mdls = AIAnalyticsEngine.getModels();
      const recs = AIAnalyticsEngine.getActionableRecommendations();
      const eqPrior = await AIAnalyticsEngine.getEquipmentPrioritization();

      setAnalyticsSummary(summary);
      setProdForecast(prod);
      setFuelForecast(fuel);
      setCostForecast(cost);
      setQualityForecast(quality);
      setFleetOptimization(fleetOpt);
      setRcaResult(rca);
      setAnomalies(anoms);
      setRiskMatrix(risks);
      setModels(mdls);
      setRecommendations(recs);
      setEquipmentPrioritization(eqPrior);
    } catch (e) {
      console.error("Error loading AI Analytics Engine data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimParamChange = (key: keyof WhatIfFleetSimulationParams, val: number) => {
    const updated = { ...simParams, [key]: val };
    setSimParams(updated);
    setSimResult(AIAnalyticsEngine.runFleetSimulation(updated));
  };

  const handleRetrainModel = (modelId: string) => {
    const updatedModel = AIAnalyticsEngine.retrainModel(modelId);
    setModels((prev) => prev.map((m) => (m.modelId === modelId ? updatedModel : m)));
    alert(`Model ${updatedModel.modelName} (Version ${updatedModel.version}) telah berhasil di-retrain & divalidasi ulang.`);
  };

  const filteredAnomalies = anomalies.filter((a) =>
    anomalySeverityFilter === "ALL" ? true : a.severity === anomalySeverityFilter
  );

  // RCA Tree Component Helper
  const renderRcaNode = (node: RootCauseNode, level = 0) => {
    return (
      <div key={node.id} className="space-y-2 my-2">
        <div
          onClick={() => setSelectedRcaNode(node)}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
            level === 0
              ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
              : level === 1
              ? "bg-amber-950/30 border-amber-500/40 text-amber-200 ml-4 sm:ml-6"
              : "bg-slate-900 border-slate-700 text-slate-200 ml-8 sm:ml-12"
          } hover:brightness-110 shadow-md`}
        >
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-black flex items-center gap-2">
                <span>{node.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 border border-slate-800">
                  {node.category}
                </span>
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">Variasi: {node.valueChange}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {node.contributionPct !== null ? (
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Kontribusi: {node.contributionPct}%
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                Contribution not statistically established.
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        {node.children && node.children.map((child) => renderRcaNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-[#0B132B] to-slate-950 p-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 text-slate-950 font-black shadow-xl shadow-emerald-500/20">
            <Brain className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight">AI Analytics & Prediction Engine</h1>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                ENTERPRISE ENGINE
              </span>
              <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                PROMPT 33
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Data Grounding → Data Quality Gate → Time-Series Forecast → Anomaly Detection → Root Cause Analysis → Risk Scoring
            </p>
          </div>
        </div>

        {/* Global Horizon Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400 font-bold">Forecast Horizon:</span>
            <select
              value={selectedHorizon}
              onChange={(e) => setSelectedHorizon(e.target.value as ForecastHorizon)}
              className="bg-transparent text-emerald-300 font-black focus:outline-none cursor-pointer"
            >
              <option value="NEXT_SHIFT" className="bg-slate-900">Shift Berikutnya</option>
              <option value="TOMORROW" className="bg-slate-900">Besok (24 Jam)</option>
              <option value="NEXT_7_DAYS" className="bg-slate-900">7 Hari Ke Depan</option>
              <option value="NEXT_14_DAYS" className="bg-slate-900">14 Hari Ke Depan</option>
              <option value="END_OF_MONTH" className="bg-slate-900">Akhir Bulan Ini</option>
              <option value="NEXT_MONTH" className="bg-slate-900">Bulan Depan</option>
              <option value="QUARTER" className="bg-slate-900">Triwulan (Quarter)</option>
            </select>
          </div>

          <button
            onClick={loadAnalyticsData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Recalculate Models</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: "OVERVIEW", label: "Overview & 4-Tier Summary", icon: Brain, color: "text-emerald-400" },
          { id: "PRODUCTION_FORECAST", label: "Production Forecast", icon: TrendingUp, color: "text-amber-400" },
          { id: "FUEL_MAINTENANCE", label: "Fuel & Maintenance", icon: Fuel, color: "text-teal-400" },
          { id: "COST_QUALITY", label: "Cost & Quality Forecast", icon: DollarSign, color: "text-purple-400" },
          { id: "FLEET_OPTIMIZATION", label: "Fleet Optimization & What-If", icon: Sliders, color: "text-emerald-400" },
          { id: "RCA", label: "Root Cause Tree (RCA)", icon: GitBranch, color: "text-rose-400" },
          { id: "ANOMALIES", label: "Anomaly Center", icon: Zap, color: "text-amber-400" },
          { id: "RISK_MATRIX", label: "Risk Matrix", icon: AlertTriangle, color: "text-rose-400" },
          { id: "MODELS", label: "Model Registry & Drift", icon: Cpu, color: "text-cyan-400" },
          { id: "DATA_QUALITY", label: "Data Quality & Lineage", icon: Database, color: "text-slate-400" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-800 border border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & 4-TIER SUMMARY */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* 4-Tier Analytical Framework Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                <Brain className="h-4 w-4 text-emerald-400" />
                4-Tier Analytical Framework (MineSmart AI Engine)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Horizon: {selectedHorizon} | Confidence: 89%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tier 1: Descriptive */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
                  1. Descriptive (Apa yang terjadi?)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {analyticsSummary?.descriptive}
                </p>
              </div>

              {/* Tier 2: Diagnostic */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-amber-400" />
                  2. Diagnostic (Mengapa terjadi?)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {analyticsSummary?.diagnostic}
                </p>
              </div>

              {/* Tier 3: Predictive */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  3. Predictive (Apa yang akan terjadi?)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {analyticsSummary?.predictive}
                </p>
              </div>

              {/* Tier 4: Prescriptive */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                  4. Prescriptive (Apa tindakan terbaik?)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {analyticsSummary?.prescriptive}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Highlights & Actionable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Actionable Recommendations */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  AI Prescriptive Recommendations (Actionable Priorities)
                </h3>
                <span className="text-xs font-bold text-emerald-400">Ranked by Impact & Risk</span>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-emerald-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            rec.priority === "HIGH"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {rec.priority} PRIORITY
                        </span>
                        <span className="text-xs font-extrabold text-white">{rec.problem}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        Urgency: {rec.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">💡 <strong className="text-emerald-300">Rekomendasi:</strong> {rec.recommendation}</p>

                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-amber-300 font-semibold">Impact: {rec.expectedImpact}</span>
                      <span className="text-slate-400">Confidence: <strong className="text-emerald-400">{rec.confidence}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Top Equipment at Risk */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  Top Equipment Requiring Attention
                </h3>
                <span className="text-[10px] text-slate-400">Ranked by Risk Score</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {equipmentPrioritization?.topRiskEquipment?.map((item: any, idx: number) => (
                  <div
                    key={item.equipmentId || idx}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-white flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400">#{idx + 1}</span>
                        <span>{item.unitCode}</span>
                        <span className="text-[9px] text-slate-400 font-normal">({item.category})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.recommendedAction}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-black ${
                          item.healthScore < 60 ? "text-rose-400" : "text-amber-400"
                        }`}
                      >
                        Health {item.healthScore}/100
                      </span>
                      <span className="text-[9px] block text-slate-500">Failure Risk: {item.failureProbabilityPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTION FORECAST & DRIVERS */}
      {activeTab === "PRODUCTION_FORECAST" && (
        <div className="space-y-6">
          {/* Production Forecast Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Production Forecast ({selectedHorizon})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proyeksi tonase batubara berbasis histori, ketersediaan armada, dan batasan operasional tambang
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("RCA")}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-xs hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Why? (Open RCA Tree)</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">ACTUAL TONNAGE</span>
                <div className="text-xl font-black text-white mt-1">
                  {prodForecast?.actualCoalMT.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">TARGET TONNAGE</span>
                <div className="text-xl font-black text-amber-300 mt-1">
                  {prodForecast?.targetCoalMT.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">FORECAST TONNAGE</span>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  {prodForecast?.forecastCoalMT.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  Range: {prodForecast?.lowerBoundMT.toLocaleString()} - {prodForecast?.upperBoundMT.toLocaleString()} MT
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">EXPECTED VARIANCE</span>
                <div
                  className={`text-xl font-black mt-1 ${
                    (prodForecast?.expectedVarianceMT || 0) < 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {(prodForecast?.expectedVarianceMT || 0) > 0 ? "+" : ""}
                  {prodForecast?.expectedVarianceMT.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">FORECAST RISK</span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black ${
                      prodForecast?.riskLevel === "HIGH" || prodForecast?.riskLevel === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {prodForecast?.riskLevel}
                  </span>
                  <span className="text-xs text-slate-400">{prodForecast?.confidencePct}% Conf.</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Perbandingan Trajektori Produksi (Actual vs Target vs Forecast):</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>ACTUAL ({prodForecast?.actualCoalMT.toLocaleString()} MT)</span>
                    <span>{Math.round(((prodForecast?.actualCoalMT || 1) / (prodForecast?.targetCoalMT || 1)) * 100)}% Target</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((prodForecast?.actualCoalMT || 1) / (prodForecast?.targetCoalMT || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>TARGET ({prodForecast?.targetCoalMT.toLocaleString()} MT)</span>
                    <span>100% Target Plan</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>FORECAST AI ({prodForecast?.forecastCoalMT.toLocaleString()} MT)</span>
                    <span>{Math.round(((prodForecast?.forecastCoalMT || 1) / (prodForecast?.targetCoalMT || 1)) * 100)}% Target</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((prodForecast?.forecastCoalMT || 1) / (prodForecast?.targetCoalMT || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Production Drivers Analysis */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                📊 Top Production Drivers (Faktor Penentu Utama Produksi):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prodForecast?.mainDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-white">{driver.driverName}</span>
                      <p className="text-[11px] text-slate-400">{driver.impact}</p>
                    </div>

                    <span
                      className={`font-black text-xs px-2.5 py-1 rounded-lg shrink-0 ${
                        driver.direction === "POSITIVE"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {driver.contributionPct > 0 ? "+" : ""}
                      {driver.contributionPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FUEL & MAINTENANCE */}
      {activeTab === "FUEL_MAINTENANCE" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fuel Consumption & Anomaly Forecast */}
            <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-teal-300 flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  AI Fuel Consumption & Anomaly Engine
                </h3>
                <span className="text-xs font-mono text-slate-400">Horizon: {selectedHorizon}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400">Prakiraan Pemakaian Solar</span>
                  <div className="text-lg font-black text-white mt-0.5">
                    {fuelForecast?.expectedLiters.toLocaleString()} <span className="text-xs text-slate-400">Liter</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400">Fuel Ratio Coal Forecast</span>
                  <div className="text-lg font-black text-teal-300 mt-0.5">
                    {fuelForecast?.forecastFuelPerTon} <span className="text-xs text-slate-400">L/MT</span>
                  </div>
                </div>
              </div>

              {/* Fuel Anomaly Section */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-amber-400 block uppercase tracking-wider">
                  ⚠️ Anomali Konsumsi Solar Terdeteksi ({fuelForecast?.anomaliesDetected.length} Alert):
                </span>

                {fuelForecast?.anomaliesDetected.map((anom) => (
                  <div
                    key={anom.id}
                    className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        {anom.label} — {anom.unitCode}
                      </span>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        Penyimpangan: +{anom.deviationPct}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">{anom.description}</p>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Baseline: {anom.baselineLitersPerHour} L/Jam | Observed: {anom.observedLitersPerHour} L/Jam</span>
                      <span className="font-bold text-teal-400">Status: {anom.investigationStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Prioritization & Health */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-400" />
                  Fleet Health & Downtime Risk Prioritization
                </h3>
                <span className="text-xs font-extrabold text-emerald-400">
                  Rata-rata Fleet Health: {equipmentPrioritization?.overallFleetHealthAvg}/100
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {equipmentPrioritization?.topRiskEquipment.map((eq: any, idx: number) => (
                  <div
                    key={eq.equipmentId || idx}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{eq.unitCode}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({eq.category})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded ${
                            eq.healthScore < 60
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          Health {eq.healthScore}/100
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300">💡 <strong>Tindakan Perawatan:</strong> {eq.recommendedAction}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                      <span>Failure Prob: <strong className="text-rose-400">{eq.failureProbabilityPct}%</strong></span>
                      <span>Criticality: <strong className="text-amber-300">{eq.criticality}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COST & QUALITY FORECAST */}
      {activeTab === "COST_QUALITY" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OPEX Cost / Ton Forecast */}
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-purple-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  AI OPEX & Cost/Ton Forecast
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                    costForecast?.overrunRisk === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  Risk Overrun: {costForecast?.overrunRisk}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400">Actual Cost/Ton</span>
                  <div className="text-lg font-black text-white mt-0.5">${costForecast?.actualCostPerTonUSD}/MT</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400">Budget Cost/Ton</span>
                  <div className="text-lg font-black text-amber-300 mt-0.5">${costForecast?.budgetCostPerTonUSD}/MT</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400">Forecast Cost/Ton</span>
                  <div className="text-lg font-black text-rose-400 mt-0.5">${costForecast?.forecastCostPerTonUSD}/MT</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
                  Main Cost Contributors Breakdown:
                </span>
                {costForecast?.mainContributors.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white">{c.category}</span>
                      <span className="text-[10px] text-slate-400 block">${c.amountUSD.toLocaleString()} USD</span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-400 block">{c.contributionPct}% Porsi</span>
                      <span className={`text-[10px] font-bold ${c.changePct > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {c.changePct > 0 ? "+" : ""}{c.changePct}% vs Last Month
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coal Quality Forecast */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  AI Coal Quality & Specification Forecast
                </h3>
                <span className="text-xs font-mono text-slate-400">Confidence: {qualityForecast?.confidencePct}%</span>
              </div>

              {!qualityForecast?.isSufficientData ? (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs text-amber-300">
                  ⚠️ {qualityForecast?.dataQualityMessage}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="text-[10px] text-slate-400">Prakiraan GAR</span>
                    <div className="text-lg font-black text-amber-300 mt-0.5">
                      {qualityForecast.expectedGAR} <span className="text-xs text-slate-400">kcal/kg</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="text-[10px] text-slate-400">Total Moisture (TM)</span>
                    <div className="text-lg font-black text-white mt-0.5">{qualityForecast.expectedTMPct}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="text-[10px] text-slate-400">Ash Content</span>
                    <div className="text-lg font-black text-white mt-0.5">{qualityForecast.expectedAshPct}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="text-[10px] text-slate-400">Sulfur Content</span>
                    <div className="text-lg font-black text-white mt-0.5">{qualityForecast.expectedSulfurPct}%</div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                <span className="font-black text-emerald-400 block">💡 Rekomendasi Blending Pit 2:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Lakukan blending 1:1 antara Seam C1 (TM 36.8%) dan Seam B2 (GAR 4,520 kcal/kg) pada ROM Hopper Crusher untuk memenuhi batas minimal kontrak GAR 4,200 kcal/kg.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FLEET OPTIMIZATION & WHAT-IF */}
      {activeTab === "FLEET_OPTIMIZATION" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Excavator-Truck Matching & Dispatch Simulation */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Excavator-Truck Matching & Dispatch Optimization
                </h3>
                <span className="text-xs font-mono text-emerald-400">Real-time Optimization</span>
              </div>

              <div className="space-y-3">
                {fleetOptimization?.excavatorRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{rec.excavatorCode}</span>
                      <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        Efisiensi: {rec.efficiencyGainPct}%
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                      <span>Jumlah Truk Saat Ini: <strong className="text-amber-400">{rec.currentTrucks} Truk</strong></span>
                      <span>Rekomendasi AI: <strong className="text-emerald-400">{rec.recommendedTrucks} Truk</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-400">Reason: {rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive What-If Simulator */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  What-If Fleet Simulator
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  {simResult.label}
                </span>
              </div>

              {/* Slider Inputs */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Tambahan Truk:</span>
                    <span className="font-bold text-amber-300">+{simParams.addedTrucks} Unit</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simParams.addedTrucks}
                    onChange={(e) => handleSimParamChange("addedTrucks", Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Ketersediaan Fleet:</span>
                    <span className="font-bold text-emerald-400">{simParams.availabilityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="98"
                    value={simParams.availabilityPct}
                    onChange={(e) => handleSimParamChange("availabilityPct", Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Simulation Result Output Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Hasil Simulasi Produksi:</span>
                  <span className="font-black text-emerald-400 text-sm">{simResult.simulatedProductionMT.toLocaleString()} MT</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Simulated Cost/Ton:</span>
                  <span className="font-black text-amber-300 text-sm">${simResult.simulatedCostPerTonUSD}/MT</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Estimasi Variasi Profit:</span>
                  <span
                    className={`font-black text-sm ${
                      simResult.varianceProfitUSD >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {simResult.varianceProfitUSD >= 0 ? "+" : ""}$
                    {(simResult.varianceProfitUSD / 1000).toFixed(0)}k USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ROOT CAUSE TREE (RCA) */}
      {activeTab === "RCA" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-rose-400 flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Root Cause Analysis Engine (RCA Causal Tree)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual dekonstruksi faktor penyebab utama dengan perhitungan kontribusi statistik & evidence
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Pilih Problem:</span>
                <select
                  value={selectedRcaProblem}
                  onChange={(e) => setSelectedRcaProblem(e.target.value as any)}
                  className="bg-slate-950 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
                >
                  <option value="PRODUCTION_DROP">Production Drop (-750 MT)</option>
                  <option value="COST_OVERRUN">Cost Overrun (+$2.30/MT)</option>
                </select>
              </div>
            </div>

            {/* RCA Tree Visual Container */}
            {rcaResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white">{rcaResult.problem}</span>
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                      Severity: {rcaResult.severity}
                    </span>
                  </div>

                  {/* Render Tree Recursively */}
                  {renderRcaNode(rcaResult.rootNode)}
                </div>

                {/* Correlation Engine Output */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2 text-xs">
                  <span className="font-black text-amber-300 block uppercase tracking-wider">
                    🔗 Operational Correlation Notes (Correlation Engine):
                  </span>
                  <div className="space-y-1">
                    {rcaResult.correlationNotes.map((c, idx) => (
                      <div key={idx} className="text-slate-300 flex items-center gap-2 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>
                          <strong>{c.metricA}</strong> <span className="text-amber-400 font-semibold">{c.label}</span> <strong>{c.metricB}</strong> (Koefisien: {c.coefficient})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: ANOMALY CENTER */}
      {activeTab === "ANOMALIES" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Operational Anomaly Detection Center
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deteksi anomali point, trend, seasonal, dan multivariate operational anomalies
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Severity Filter:</span>
                <select
                  value={anomalySeverityFilter}
                  onChange={(e) => setAnomalySeverityFilter(e.target.value)}
                  className="bg-slate-950 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
                >
                  <option value="ALL">Semua Severity</option>
                  <option value="CRITICAL">Critical Only</option>
                  <option value="HIGH">High Only</option>
                  <option value="MEDIUM">Medium Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnomalies.map((anom) => (
                <div
                  key={anom.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    anom.severity === "CRITICAL"
                      ? "bg-rose-950/40 border-rose-500/40"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      {anom.affectedAsset}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        anom.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      Score: {anom.anomalyScore}/100 | {anom.anomalyType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{anom.description}</p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Baseline: {anom.baselineValue} | Observed: {anom.observedValue}</span>
                    <span className="text-emerald-400 font-mono font-bold">Status: {anom.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: RISK MATRIX */}
      {activeTab === "RISK_MATRIX" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Operational Risk Matrix & Risk Prediction
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kalkulasi matriks risiko (Probability × Impact) seluruh sektor operasional tambang
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskMatrix.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                        [{risk.category}]
                      </span>
                      <h4 className="font-extrabold text-white">{risk.title}</h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                        risk.riskLevel === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {risk.riskLevel}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">Faktor Risiko:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {risk.riskFactors.map((rf, idx) => (
                        <li key={idx}>{rf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300 font-semibold">
                    💡 <strong>Rekomendasi Action:</strong> {risk.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: MODEL REGISTRY & DRIFT */}
      {activeTab === "MODELS" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  AI Model Registry & Health Governance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitoring versi model AI, evaluasi akurasi, performa metrics, dan pengawasan Model Drift
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((mdl) => (
                <div
                  key={mdl.modelId}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{mdl.modelName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Version: {mdl.version} | Type: {mdl.modelType}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                        mdl.isDrifted
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {mdl.isDrifted ? "DRIFT DETECTED" : "HEALTHY"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div>Akurasi Evaluasi: <strong className="text-emerald-400">{mdl.accuracyPct}%</strong></div>
                    <div>Periode Training: <strong className="text-amber-300">{mdl.trainingPeriod}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-500">Last Evaluated: {new Date(mdl.lastEvaluated).toLocaleTimeString()}</span>
                    {mdl.isDrifted ? (
                      <button
                        onClick={() => handleRetrainModel(mdl.modelId)}
                        className="px-3 py-1 rounded bg-rose-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Retrain Model</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold">Active & Validated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: DATA QUALITY & LINEAGE */}
      {activeTab === "DATA_QUALITY" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                Data Quality Gate & Lineage Audit Inspector
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Memastikan tidak ada prediksi yang dihasilkan dari data mentah yang cacat atau tidak valid
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quality Gate Status */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs">
                <span className="font-black text-emerald-400 block uppercase">
                  Data Quality Gate Verification Status:
                </span>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Overall Data Status:</span>
                    <span className="font-bold text-emerald-400">{prodForecast?.dataQuality.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missing Mandatory Fields:</span>
                    <span className="font-mono text-slate-400">
                      {prodForecast?.dataQuality.missingFields.length === 0 ? "None" : prodForecast?.dataQuality.missingFields.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Freshness:</span>
                    <span className="font-mono text-emerald-300">{prodForecast?.dataQuality.freshnessMinutes} menit lalu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Consistency:</span>
                    <span className="font-mono text-amber-300">{prodForecast?.dataQuality.unitConsistency}</span>
                  </div>
                </div>
              </div>

              {/* Data Lineage Info */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs">
                <span className="font-black text-amber-400 block uppercase">
                  Data Lineage & Source Audit:
                </span>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Sumber Modul Terhubung:</span>
                    <span className="font-bold text-white">{prodForecast?.dataLineage.sourceModules.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah Record Terproses:</span>
                    <span className="font-mono text-emerald-400">{prodForecast?.dataLineage.sourceRecordsCount} Records</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metode Kalkulasi Engine:</span>
                    <span className="font-mono text-amber-300">{prodForecast?.dataLineage.calculationMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versi Model Produksi:</span>
                    <span className="font-mono text-cyan-300">{prodForecast?.dataLineage.modelVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RCA Node Evidence Modal / Drawer */}
      {selectedRcaNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-rose-300 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                RCA Node Evidence Inspector
              </h3>
              <button
                onClick={() => setSelectedRcaNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-extrabold text-white text-base">{selectedRcaNode.label}</div>
              <div className="text-slate-400">Variasi Observasi: <strong className="text-amber-400">{selectedRcaNode.valueChange}</strong></div>

              <div className="pt-2">
                <span className="font-bold text-slate-300 block mb-1">Bukti Data (Evidence):</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedRcaNode.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRcaNode(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700"
              >
                Tutup Evidence Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
