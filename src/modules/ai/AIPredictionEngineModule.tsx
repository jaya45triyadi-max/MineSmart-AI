// MINE SMART AI - AI Prediction Engine Module
// 6 Core Forecasts: Production, Fuel, Maintenance Breakdown, Cost, Sales/Revenue, Stock/Inventory

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Fuel,
  Wrench,
  DollarSign,
  ShoppingCart,
  Boxes,
  Pickaxe,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  Flame,
  Ship,
  Truck,
  Activity,
  Cpu,
  BarChart3,
  Search,
  Check,
  Zap,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  PredictionHorizon,
  PredictionScenario,
  ForecastCategory,
  UnifiedPredictionEngineData,
} from "../../types/aiPredictionEngineTypes";
import { AIPredictionEngineService } from "../../services/ai/prediction/AIPredictionEngineService";

export const AIPredictionEngineModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { activeSite } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "PRODUCTION" | "FUEL" | "MAINTENANCE" | "COST" | "SALES" | "STOCK" | "SIMULATION"
  >("OVERVIEW");

  const [horizon, setHorizon] = useState<PredictionHorizon>("30_DAYS");
  const [scenario, setScenario] = useState<PredictionScenario>("BASELINE");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<UnifiedPredictionEngineData>(
    AIPredictionEngineService.getUnifiedPredictionData("30_DAYS", "BASELINE")
  );

  // What-If Simulation State
  const [simFleetAdd, setSimFleetAdd] = useState<number>(4); // +4 trucks
  const [simFuelPriceIDR, setSimFuelPriceIDR] = useState<number>(14500);
  const [simCoalPriceUSD, setSimCoalPriceUSD] = useState<number>(68.5);
  const [simRainfallDays, setSimRainfallDays] = useState<number>(3);

  const loadData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(AIPredictionEngineService.getUnifiedPredictionData(horizon, scenario));
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, [horizon, scenario]);

  // Simulation derived values
  const simProductionDeltaTons = simFleetAdd * 1200 - simRainfallDays * 3200;
  const simFuelDeltaLiters = simFleetAdd * 14000;
  const simCostDeltaUSD = (simFuelDeltaLiters * (simFuelPriceIDR / 16000)) + (simFleetAdd * 8500);
  const simRevenueDeltaUSD = simProductionDeltaTons * simCoalPriceUSD;
  const simNetProfitDeltaUSD = simRevenueDeltaUSD - simCostDeltaUSD;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 font-black">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Prediction & Forecasting Engine
                </h1>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                  GEMINI 3.7 MULTI-DOMAIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat peramalan cerdas: Produksi, Kebutuhan BBM, Breakdown Alat, Biaya OPEX, Revenue Penjualan & Kapasitas Stockpile.
              </p>
            </div>
          </div>

          {/* Controls: Horizon & Scenario */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Horizon Selector */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value as PredictionHorizon)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="7_DAYS" className="bg-slate-900">Horizon: 7 Hari ke Depan</option>
                <option value="14_DAYS" className="bg-slate-900">Horizon: 14 Hari ke Depan</option>
                <option value="30_DAYS" className="bg-slate-900">Horizon: 30 Hari (Bulan Berjalan)</option>
                <option value="QUARTER_Q3" className="bg-slate-900">Horizon: Kuartal 3 (Q3)</option>
                <option value="END_OF_YEAR" className="bg-slate-900">Horizon: Akhir Tahun (EOY)</option>
              </select>
            </div>

            {/* Scenario Selector */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as PredictionScenario)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="BASELINE" className="bg-slate-900">Skenario: Baseline RKAB</option>
                <option value="OPTIMISTIC" className="bg-slate-900">Skenario: Optimis (+8% Fleet PA)</option>
                <option value="PESSIMISTIC" className="bg-slate-900">Skenario: Pesimis (-9% Output)</option>
                <option value="WEATHER_ADVERSE" className="bg-slate-900">Skenario: Cuaca Ekstrem / Hujan</option>
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer disabled:opacity-50"
              title="Perbarui Prediksi AI"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Gemini Prescriptive Insight Banner */}
        <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-2xl flex items-start gap-3">
          <div className="p-1.5 bg-purple-500 text-slate-950 rounded-lg shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black text-purple-300 uppercase tracking-wide block">
              Gemini Prescriptive Mining Synthesis:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {data.geminiPrescriptiveInsight}
            </p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 scrollbar-none">
          {[
            { id: "OVERVIEW", label: "Ringkasan 6 Prediksi", icon: Activity },
            { id: "PRODUCTION", label: "1. Production Forecast", icon: Pickaxe, count: `${(data.production.totalCoalForecastMT / 1000).toFixed(0)}k MT` },
            { id: "FUEL", label: "2. Fuel Forecast", icon: Fuel, count: `${(data.fuel.totalPredictedLiters / 1000).toFixed(0)}k L` },
            { id: "MAINTENANCE", label: "3. Maintenance Breakdown", icon: Wrench, count: `${data.maintenance.highRiskUnits.length} Unit Risiko` },
            { id: "COST", label: "4. Cost Forecast", icon: DollarSign, count: `$${data.cost.forecastCostPerTonUSD}/MT` },
            { id: "SALES", label: "5. Sales & Revenue", icon: ShoppingCart, count: `$${(data.sales.totalProjectedRevenueUSD / 1e6).toFixed(1)}M` },
            { id: "STOCK", label: "6. Stock & Inventory", icon: Boxes, count: `${data.stock.capacityUtilizationPct}%` },
            { id: "SIMULATION", label: "What-If Simulator", icon: Sliders, badge: "AI Sandbox" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-purple-200">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB 0: OVERVIEW (UNIFIED COMMAND DECK)
          ========================================================================= */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* 6 Metric Forecast Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Production Card */}
            <div
              onClick={() => setActiveTab("PRODUCTION")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    <Pickaxe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Production Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Batubara & OB</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +{data.production.coalVariancePct}%
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {data.production.totalCoalForecastMT.toLocaleString()} <span className="text-xs font-normal text-slate-400">MT</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Target: {data.production.coalTargetMT.toLocaleString()} MT | OB: {(data.production.totalOBForecastBCM / 1000).toFixed(0)}k BCM (SR: {data.production.averageSR})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Akurasi Model: <strong>96.6% (MAPE 3.4%)</strong></span>
                <span className="text-amber-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>

            {/* 2. Fuel Card */}
            <div
              onClick={() => setActiveTab("FUEL")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Fuel Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Kebutuhan Solar</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {data.fuel.daysOfInventoryLeft} Hari Stok
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {data.fuel.totalPredictedLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liter</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Biaya Proyeksi: ${(data.fuel.projectedCostUSD / 1e3).toFixed(1)}k | Ratio: {data.fuel.averageFuelRatio} L/BCM
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Saran PO: <strong>{data.fuel.suggestedPoDate}</strong></span>
                <span className="text-rose-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>

            {/* 3. Maintenance Breakdown Card */}
            <div
              onClick={() => setActiveTab("MAINTENANCE")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Maintenance Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Kegagalan Komponen</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                  {data.maintenance.highRiskUnits.length} Unit Kritis
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-rose-400 font-mono">
                  {data.maintenance.highRiskUnits[0]?.equipmentId || "EX-204"}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    ({data.maintenance.highRiskUnits[0]?.breakdownProbability72hPct}% dlm 72h)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Penghematan Potensial: <strong>${data.maintenance.potentialCostSavingsUSD.toLocaleString()}</strong> via Pre-emptive Repair
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>MTBF Armada: <strong>{data.maintenance.fleetMeanTimeBetweenFailuresHours} Jam</strong></span>
                <span className="text-blue-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>

            {/* 4. Cost Forecast Card */}
            <div
              onClick={() => setActiveTab("COST")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Cost Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Biaya OPEX</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ${data.cost.forecastCostPerTonUSD}/MT
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  ${(data.cost.totalForecastOpexUSD / 1e6).toFixed(2)}M <span className="text-xs font-normal text-slate-400">OPEX</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Budget: ${(data.cost.totalBudgetOpexUSD / 1e6).toFixed(2)}M (Deviasi: {data.cost.variancePct}%)
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Budget Limit: <strong>${data.cost.budgetCostPerTonUSD}/MT</strong></span>
                <span className="text-emerald-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>

            {/* 5. Sales Forecast Card */}
            <div
              onClick={() => setActiveTab("SALES")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Sales & Revenue Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Penjualan & DMO</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400">
                  DMO {data.sales.dmoFulfilmentPct}%
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  ${(data.sales.totalProjectedRevenueUSD / 1e6).toFixed(2)}M <span className="text-xs font-normal text-slate-400">USD</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Penjualan: {data.sales.projectedCoalSalesMT.toLocaleString()} MT | Rata-rata: ${data.sales.averageSellingPriceUSD}/MT
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>ICI4 (GAR 4200): <strong>${data.sales.marketPriceIndexForecastUSD.ici4GAR4200}/MT</strong></span>
                <span className="text-purple-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>

            {/* 6. Stockpile Card */}
            <div
              onClick={() => setActiveTab("STOCK")}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl space-y-3 cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Stock Forecast</h3>
                    <p className="text-[10px] text-slate-400">Prediksi Inventory & Swabakar</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {data.stock.capacityUtilizationPct}% Kapasitas
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {data.stock.projectedClosingStockTons.toLocaleString()} <span className="text-xs font-normal text-slate-400">MT</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Kapasitas Maksimal: {data.stock.stockpileMaxCapacityTons.toLocaleString()} MT | Coverage: {data.stock.daysOfForwardSalesCoverage} Hari
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Risiko Swabakar: <strong className="text-amber-400">{data.stock.highRiskSelfHeatingPiles[0]?.pileId}</strong></span>
                <span className="text-cyan-400 font-bold group-hover:underline">Detail ➔</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: PRODUCTION FORECAST
          ========================================================================= */}
      {activeTab === "PRODUCTION" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  FORECASTING MODEL: {data.production.modelInfo.algorithm}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Proyeksi Batubara (MT) & Overburden (BCM)
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-3 h-3 rounded bg-amber-500" /> Forecast Coal (MT)
                </span>
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <span className="w-3 h-3 rounded bg-blue-500" /> Forecast OB (BCM)
                </span>
              </div>
            </div>

            {/* Time Series Bar / Area Visualization */}
            <div className="h-60 flex items-end justify-between gap-1 pt-6 pb-2 border-b border-slate-800 font-mono text-[9px]">
              {data.production.timeSeries.map((pt, idx) => {
                const coalH = Math.min((pt.coalForecastMT / 20000) * 100, 100);
                const obH = Math.min((pt.obForecastBCM / 110000) * 100, 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      <div
                        className="w-1/2 bg-amber-500/80 group-hover:bg-amber-400 rounded-t transition-all"
                        style={{ height: `${coalH}%` }}
                        title={`${pt.date}: Coal ${pt.coalForecastMT} MT (Planned: ${pt.coalPlannedMT})`}
                      />
                      <div
                        className="w-1/2 bg-blue-500/70 group-hover:bg-blue-400 rounded-t transition-all"
                        style={{ height: `${obH}%` }}
                        title={`${pt.date}: OB ${pt.obForecastBCM} BCM (SR: ${pt.strippingRatio})`}
                      />
                    </div>
                    <span className="text-slate-500 text-[8px] whitespace-nowrap">{pt.date}</span>
                  </div>
                );
              })}
            </div>

            {/* Pit Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.production.pitForecasts.map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{p.pitName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{p.confidence}% Confidence</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{p.coalMT.toLocaleString()} MT Coal</span>
                    <span className="text-blue-400 font-bold">{p.obBCM.toLocaleString()} BCM OB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FUEL FORECAST
          ========================================================================= */}
      {activeTab === "FUEL" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                  FUEL DEPLETION & BURN PREDICTION
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Prediksi Kebutuhan BBM Solar & Stok Tangki
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Ketahanan Stok: {data.fuel.daysOfInventoryLeft} Hari
                </span>
                <p className="text-[11px] text-slate-400">Saran Tanggal Order PO: {data.fuel.suggestedPoDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.fuel.equipmentClassBreakdown.map((eq, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{eq.className}</span>
                    <span className="font-mono text-rose-400 font-bold">{eq.predictedLiters.toLocaleString()} L</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(eq.predictedLiters / data.fuel.totalPredictedLiters) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{eq.unitCount} Unit Terjadwal</span>
                    <span>Burn Rate Rata-rata: {eq.burnRateLph} L/Jam</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MAINTENANCE BREAKDOWN FORECAST
          ========================================================================= */}
      {activeTab === "MAINTENANCE" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                REMAINING USEFUL LIFE (RUL) & FAILURE RISK MATRIX
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Prediksi Kemungkinan Kerusakan Komponen Alat Berat
              </h3>
            </div>

            <div className="space-y-3">
              {data.maintenance.highRiskUnits.map((u) => (
                <div
                  key={u.equipmentId}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-rose-500/50 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 font-black text-xs font-mono">
                        {u.equipmentId}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">
                          {u.model} — Komponen: <span className="text-amber-400">{u.component.replace("_", " ")}</span>
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Sisa Masa Pakai (RUL): <strong className="text-white">{u.remainingUsefulLifeHours} Jam Operasi</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Probabilitas Breakdown 72 Jam: {u.breakdownProbability72hPct}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/20 text-xs text-purple-300">
                    <strong>Rekomendasi Preskriptif AI:</strong> {u.recommendedAction}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 border-t border-slate-800/80 pt-2 font-mono">
                    <div className="flex items-center gap-2">
                      <span>Sensor Triggers:</span>
                      {u.sensorTriggers.map((tr, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-900 rounded text-[9px] text-slate-300">
                          {tr}
                        </span>
                      ))}
                    </div>
                    <span className="text-emerald-400 font-bold">
                      ✓ Hemat Biaya ${u.costImpactAvoidedUSD.toLocaleString()} & Downtime {u.estimatedDowntimeAvoidanceHours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: COST FORECAST
          ========================================================================= */}
      {activeTab === "COST" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  OPEX & UNIT COST PROJECTION
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Prediksi Struktur Biaya Tambang (Cost per Ton & Cost per BCM)
                </h3>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-emerald-400 font-mono">
                  ${data.cost.forecastCostPerTonUSD} <span className="text-xs text-slate-400 font-normal">/ MT</span>
                </span>
                <p className="text-[10px] text-slate-400">Baseline Budget: ${data.cost.budgetCostPerTonUSD}/MT</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.cost.costBreakdown.map((cb, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{cb.category}</span>
                    <span className="font-mono font-bold text-emerald-400">${cb.forecastUSD.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(cb.forecastUSD / data.cost.totalForecastOpexUSD) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Driver: {cb.primaryDriver}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SALES FORECAST
          ========================================================================= */}
      {activeTab === "SALES" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  COMMERCIAL REVENUE & DMO FULFILMENT
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Prediksi Penjualan Batubara & Proyeksi Indeks Harga
                </h3>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-purple-400 font-mono">
                  ${(data.sales.totalProjectedRevenueUSD / 1e6).toFixed(2)}M
                </span>
                <p className="text-[10px] text-slate-400">Rp {(data.sales.totalProjectedRevenueIDR / 1e9).toFixed(1)} Miliar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.sales.customerShipmentProjections.map((cust, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{cust.buyerName}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {cust.contractType}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{cust.contractedTons.toLocaleString()} MT</span>
                    <span className="text-emerald-400 font-bold">${(cust.projectedRevenueUSD / 1e3).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Laycan: {cust.laycanPeriod}</span>
                    <span>Demurrage Risk: {cust.demurrageRiskPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: STOCK FORECAST
          ========================================================================= */}
      {activeTab === "STOCK" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  STOCKPILE CAPACITY & SELF-HEATING (SWABAKAR)
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Prediksi Kapasitas Inventory & Risiko Swabakar Batubara
                </h3>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-cyan-400 font-mono">
                  {data.stock.projectedClosingStockTons.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                </span>
                <p className="text-[10px] text-slate-400">Utilisasi Kapasitas: {data.stock.capacityUtilizationPct}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.stock.highRiskSelfHeatingPiles.map((pile) => (
                <div key={pile.pileId} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{pile.pileId} ({pile.volumeTons.toLocaleString()} MT)</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        pile.spontaneousCombustionRisk === "HIGH"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      Swabakar: {pile.spontaneousCombustionRisk} (Aging {pile.agingDays} Hari)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    <strong>Tindakan AI:</strong> {pile.recommendedPriorityAction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: WHAT-IF SIMULATION SANDBOX
          ========================================================================= */}
      {activeTab === "SIMULATION" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                INTERACTIVE SCENARIO & PARAMETER SANDBOX
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Simulasi Dampak Lintas Parameter Tambang
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ubah parameter di bawah untuk melihat kalkulasi dampak otomatis terhadap Produksi, Fuel, Biaya OPEX, dan Profitabilitas.
              </p>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Penambahan Armada Truk Hauler:</span>
                  <span className="text-amber-400 font-mono">+{simFleetAdd} Unit</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={simFleetAdd}
                  onChange={(e) => setSimFleetAdd(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Harga BBM Solar Industri (IDR/Liter):</span>
                  <span className="text-rose-400 font-mono">Rp {simFuelPriceIDR.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="12000"
                  max="18000"
                  step="250"
                  value={simFuelPriceIDR}
                  onChange={(e) => setSimFuelPriceIDR(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Harga Jual Batubara Rata-rata ($/MT):</span>
                  <span className="text-purple-400 font-mono">${simCoalPriceUSD}/MT</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="0.5"
                  value={simCoalPriceUSD}
                  onChange={(e) => setSimCoalPriceUSD(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Estimasi Hari Hujan Lebat / Slippery:</span>
                  <span className="text-blue-400 font-mono">{simRainfallDays} Hari</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simRainfallDays}
                  onChange={(e) => setSimRainfallDays(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Impact Results */}
            <div className="p-5 bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950 rounded-2xl border border-purple-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dampak Produksi</span>
                <span className={`text-lg font-black ${simProductionDeltaTons >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {simProductionDeltaTons >= 0 ? `+${simProductionDeltaTons.toLocaleString()}` : simProductionDeltaTons.toLocaleString()} MT
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dampak Kebutuhan Solar</span>
                <span className="text-lg font-black text-rose-400">
                  +{simFuelDeltaLiters.toLocaleString()} L
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dampak Biaya OPEX</span>
                <span className="text-lg font-black text-amber-400">
                  +${Math.round(simCostDeltaUSD).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Net Margin Profit Impact</span>
                <span className={`text-lg font-black ${simNetProfitDeltaUSD >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {simNetProfitDeltaUSD >= 0 ? `+$${Math.round(simNetProfitDeltaUSD).toLocaleString()}` : `-$${Math.abs(Math.round(simNetProfitDeltaUSD)).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
