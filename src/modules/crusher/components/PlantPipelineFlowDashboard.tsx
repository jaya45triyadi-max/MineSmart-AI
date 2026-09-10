import React, { useState } from "react";
import {
  Factory,
  Flame,
  Wrench,
  TrendingUp,
  Clock,
  FlaskConical,
  Scale,
  Sparkles,
  Gauge,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Truck,
  Ship,
  Layers,
  Sliders,
  Play,
  Pause,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Database,
  Compass,
  BarChart3,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  ProcessingPlant,
  Crusher,
  ROMFeed,
  ProcessingOutput,
  ProcessingDowntime,
  ProcessingQualitySample,
  ProductSizeDistribution,
  PipelineCircuitTelemetry,
  ProcessingAlert,
} from "../../../types/processingPlantTypes";

interface PlantPipelineFlowDashboardProps {
  plants: ProcessingPlant[];
  crushers: Crusher[];
  feeds: ROMFeed[];
  outputs: ProcessingOutput[];
  downtimes: ProcessingDowntime[];
  samples: ProcessingQualitySample[];
  psdList: ProductSizeDistribution[];
  pipelineTelemetry: PipelineCircuitTelemetry;
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
  onOpenLogFeedModal: () => void;
  onOpenLogDowntimeModal: () => void;
  onOpenLogPSDModal: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const PlantPipelineFlowDashboard: React.FC<PlantPipelineFlowDashboardProps> = ({
  plants,
  crushers,
  feeds,
  outputs,
  downtimes,
  samples,
  psdList,
  pipelineTelemetry,
  selectedPlantId,
  onSelectPlant,
  onOpenAiAnalysis,
  onOpenLogFeedModal,
  onOpenLogDowntimeModal,
  onOpenLogPSDModal,
  onNavigateTab,
}) => {
  const [isFlowAnimated, setIsFlowAnimated] = useState<boolean>(true);
  const [activeStageDetail, setActiveStageDetail] = useState<"ROM" | "CRUSHER" | "STOCKPILE" | "SHIPMENT">("CRUSHER");
  
  // Interactive Simulation State
  const [simFeedRate, setSimFeedRate] = useState<number>(pipelineTelemetry.romLiveFeedRateTph);
  const [simCssMm, setSimCssMm] = useState<number>(pipelineTelemetry.primaryCrusherCssMM);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activePlant = plants.find((p) => p.plantId === selectedPlantId) || plants[0];
  const activeCrushers = crushers.filter((c) => c.plantId === activePlant?.plantId);
  const currentPSD = psdList.find((p) => p.plantId === activePlant?.plantId) || psdList[0];

  // Live Metrics Calculations
  const calculatedThroughput = isSimulating 
    ? Math.round(simFeedRate * (1 - (simCssMm < 45 ? 0.08 : 0.04))) 
    : pipelineTelemetry.circuitLiveThroughputTph;
  const calculatedYield = Math.round((calculatedThroughput / (simFeedRate || 1)) * 1000) / 10;
  const totalDowntimeTodayHours = downtimes
    .filter((d) => d.plantId === activePlant?.plantId)
    .reduce((sum, d) => sum + d.duration, 0);
  const totalProductionToday = outputs
    .filter((o) => o.plantId === activePlant?.plantId)
    .reduce((sum, o) => sum + o.quantity, 0) || 15900;
  const totalFeedToday = feeds
    .filter((f) => f.plantId === activePlant?.plantId)
    .reduce((sum, f) => sum + f.quantity, 0) || 16800;

  // 7 Pillars Data Summary
  const monitoringPillars = {
    feed: {
      liveRateTph: simFeedRate,
      cumulativeTodayTons: totalFeedToday,
      targetTons: 18000,
      feederHz: pipelineTelemetry.apronFeederSpeedHz,
      moisture: pipelineTelemetry.romMoisturePercent,
      ash: pipelineTelemetry.romAshPercent,
    },
    throughput: {
      liveTph: calculatedThroughput,
      designCapacityTph: activePlant?.designCapacity || 1500,
      utilizationCapacityPercent: Math.round((calculatedThroughput / (activePlant?.designCapacity || 1500)) * 100),
      shiftAverageTph: 1340,
    },
    production: {
      cumulativeOutputTons: totalProductionToday,
      targetOutputTons: 17000,
      yieldPercent: calculatedYield,
      achievementPercent: Math.round((totalProductionToday / 17000) * 100),
    },
    availability: {
      physicalAvailabilityPA: activePlant?.availability || 94.2,
      mechanicalAvailabilityMA: 96.5,
      operatingHours: activePlant?.operatingHours || 18.2,
      mtbfHours: 142.5,
    },
    utilization: {
      operationalUtilizationUA: activePlant?.utilization || 88.5,
      effectiveUtilizationEU: 83.4,
      idleHours: 2.1,
      standbyHours: 1.5,
    },
    downtime: {
      totalHours: totalDowntimeTodayHours || 1.8,
      unplannedHours: 0.8,
      plannedHours: 1.0,
      lostTonnage: Math.round((totalDowntimeTodayHours || 1.8) * 1350),
      mttrHours: 0.9,
    },
    productSize: {
      topSizeMM: isSimulating ? Math.round(simCssMm * 1.05 * 10) / 10 : currentPSD.actualTopSizeMM,
      specTopSizeMM: currentPSD.nominalTopSizeMM,
      cssSettingMM: simCssMm,
      nutPercent: currentPSD.nutPercent25to50mm,
      finesPercent: currentPSD.finesPercent0to25mm,
      ultraFinesPercent: currentPSD.ultraFinesBelow2mmPercent,
      compliance: currentPSD.sizeComplianceStatus,
    },
  };

  return (
    <div className="space-y-6">
      {/* Plant Selector & Circuit Quick Toolbar */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Processing Plant:</span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => onSelectPlant(plant.plantId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plant.plantId === activePlant?.plantId
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {plant.plantCode} ({plant.plantName.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:border-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {activePlant?.operatingStatus || "ONLINE"}
            </span>
            <span className="text-slate-400">Design: <strong className="text-slate-700 dark:text-slate-300">{activePlant?.designCapacity} t/h</strong></span>
          </div>
        </div>

        {/* Live Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFlowAnimated(!isFlowAnimated)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isFlowAnimated
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
            }`}
            title="Toggle animated circuit flow particles"
          >
            {isFlowAnimated ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isFlowAnimated ? "Animation Live" : "Animation Paused"}</span>
          </button>

          <button
            onClick={onOpenLogFeedModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>+ Log Feed</span>
          </button>

          <button
            onClick={onOpenLogDowntimeModal}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>+ Log Downtime</span>
          </button>

          <button
            onClick={onOpenLogPSDModal}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>+ PSD Quality</span>
          </button>

          <button
            onClick={() => onOpenAiAnalysis(`Analisis optimasi circuit ROM ke Shipment pada plant ${activePlant?.plantName}`)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Circuit Advisor</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MASTER DASHBOARD: ROM → CRUSHER → STOCKPILE → SHIPMENT CIRCUIT */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0D1527] to-slate-950 border border-indigo-900/40 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              INTEGRATED MATERIAL VALUE CHAIN PIPELINE
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              ROM → Crusher → Stockpile → Shipment Live Flow Circuit
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              End-to-end continuous monitoring across mining haulage tipping, crushing & screening, stacker stockpile blending, and marine vessel loadout.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Circuit Net Output</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {calculatedThroughput.toLocaleString()} <span className="text-xs text-slate-300 font-normal">t/h</span>
              </span>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Circuit Yield</span>
              <span className="text-base font-extrabold text-cyan-400 font-mono">{calculatedYield}%</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE 4-STAGE PIPELINE CIRCUIT DIAGRAM */}
        {/* ========================================================================= */}
        <div className="relative z-10 overflow-x-auto pb-3 scrollbar-thin">
          <div className="min-w-[980px] grid grid-cols-4 gap-4 relative">
            
            {/* Connecting Animated Conveyor Lines (Visual Backbone) */}
            <div className="absolute top-16 left-28 right-28 h-2 bg-slate-800 rounded-full -z-0 overflow-hidden">
              <div
                className={`h-full w-full bg-gradient-to-r from-amber-500 via-indigo-500 via-emerald-500 to-cyan-500 opacity-60 ${
                  isFlowAnimated ? "animate-pulse" : ""
                }`}
              />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 1: ROM (RUN OF MINE) */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => setActiveStageDetail("ROM")}
              className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                activeStageDetail === "ROM"
                  ? "bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "bg-slate-800/50 hover:bg-slate-800/70 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-extrabold tracking-wider border border-amber-500/30">
                  STAGE 1: ROM
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">ROM Pad & Hopper</h4>
                  <span className="text-[11px] text-slate-400">Pit Inflow & Tipping</span>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Feed Rate:</span>
                  <span className="font-bold text-amber-300">{simFeedRate.toLocaleString()} t/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">ROM Pad Stock:</span>
                  <span className="text-white">{pipelineTelemetry.romPadStockTons.toLocaleString()} Ton</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Hopper Bin Level:</span>
                  <span className="text-emerald-400">{pipelineTelemetry.romHopperLevelPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Feed Moisture:</span>
                  <span className="text-cyan-300">{pipelineTelemetry.romMoisturePercent}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-amber-400" /> 3 Haulers Active</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 2: CRUSHER & SIZING CIRCUIT */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => setActiveStageDetail("CRUSHER")}
              className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                activeStageDetail === "CRUSHER"
                  ? "bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "bg-slate-800/50 hover:bg-slate-800/70 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold tracking-wider border border-indigo-500/30">
                  STAGE 2: CRUSHER
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  ONLINE
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Crushing & Sizing</h4>
                  <span className="text-[11px] text-slate-400">Jaw & Double Roll Sizer</span>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Throughput:</span>
                  <span className="font-bold text-indigo-300">{calculatedThroughput.toLocaleString()} t/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">CSS Setting:</span>
                  <span className="text-white">{simCssMm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Screen Eff.:</span>
                  <span className="text-emerald-400">{pipelineTelemetry.vibratingScreenEfficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Motor Power:</span>
                  <span className="text-amber-300">{pipelineTelemetry.primaryCrusherMotorKw} kW</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-indigo-400" /> CR-101 & CR-102</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 3: STOCKPILE & BLENDING */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => setActiveStageDetail("STOCKPILE")}
              className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                activeStageDetail === "STOCKPILE"
                  ? "bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-800/50 hover:bg-slate-800/70 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold tracking-wider border border-emerald-500/30">
                  STAGE 3: STOCKPILE
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {pipelineTelemetry.stockpileCapacityPercent}% FULL
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Product Stockpile</h4>
                  <span className="text-[11px] text-slate-400">Stacker & Reclaim</span>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Stock Volume:</span>
                  <span className="font-bold text-emerald-300">{pipelineTelemetry.stockpileTotalTons.toLocaleString()} Ton</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Quality Grade:</span>
                  <span className="text-white">CV {pipelineTelemetry.stockpileGradeCV} GAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Stacker Conveyor:</span>
                  <span className="text-cyan-300">{pipelineTelemetry.stackerConveyorSpeedMps} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Reclaim Rate:</span>
                  <span className="text-amber-300">{pipelineTelemetry.reclaimerRateTph} t/h</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-emerald-400" /> Stockpile 1A & 1B</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 4: SHIPMENT & PORT JETTY */}
            {/* ------------------------------------------------------------- */}
            <div
              onClick={() => setActiveStageDetail("SHIPMENT")}
              className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                activeStageDetail === "SHIPMENT"
                  ? "bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-800/50 hover:bg-slate-800/70 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold tracking-wider border border-cyan-500/30">
                  STAGE 4: SHIPMENT
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                  LOADING
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                  <Ship className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Port & Barge Loading</h4>
                  <span className="text-[11px] text-slate-400">Jetty Conveyor & Dispatch</span>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Loading Rate:</span>
                  <span className="font-bold text-cyan-300">{pipelineTelemetry.shipmentLiveRateTph.toLocaleString()} t/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Loaded Today:</span>
                  <span className="text-white">{pipelineTelemetry.todayLoadedTonnage.toLocaleString()} Ton</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Barge Progress:</span>
                  <span className="text-emerald-400">{pipelineTelemetry.bargeLoadedPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Demurrage Risk:</span>
                  <span className="text-emerald-300 font-sans font-bold">NONE (0 hrs)</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Ship className="w-3.5 h-3.5 text-cyan-400" /> BG. Kalimantan Star</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Dynamic Simulation Panel (Feed Rate & CSS Controls) */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                Live ROM Feed Rate Simulation:
              </span>
              <span className="text-amber-400 font-mono font-bold">{simFeedRate} t/h</span>
            </div>
            <input
              type="range"
              min="800"
              max="1800"
              step="50"
              value={simFeedRate}
              onChange={(e) => {
                setSimFeedRate(Number(e.target.value));
                setIsSimulating(true);
              }}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>800 t/h (Min)</span>
              <span>1,400 (Nominal)</span>
              <span>1,800 t/h (Max)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Crusher CSS (Closed Side Setting):
              </span>
              <span className="text-indigo-400 font-mono font-bold">{simCssMm} mm</span>
            </div>
            <input
              type="range"
              min="35"
              max="65"
              step="1"
              value={simCssMm}
              onChange={(e) => {
                setSimCssMm(Number(e.target.value));
                setIsSimulating(true);
              }}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>35 mm (Fine)</span>
              <span>48 mm (Optimal)</span>
              <span>65 mm (Coarse)</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isSimulating && (
              <button
                onClick={() => {
                  setSimFeedRate(pipelineTelemetry.romLiveFeedRateTph);
                  setSimCssMm(pipelineTelemetry.primaryCrusherCssMM);
                  setIsSimulating(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Baseline
              </button>
            )}
            <button
              onClick={() => onOpenAiAnalysis(`Prediksi performa dan ukuran partikel jika feed rate ${simFeedRate} t/h dan CSS ${simCssMm} mm`)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Predict Impact
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 7 MANDATORY MONITORING PILLARS (DEEP ANALYTIC CARDS) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Comprehensive 7-Pillar Plant Monitoring Center
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live telemetry tracking: Feed, Throughput, Production, Availability, Utilization, Downtime, and Product Size
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Shift 1 • Day Operating Window</span>
        </div>

        {/* 7-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Feed Monitoring */}
          <div
            onClick={() => onNavigateTab("rom-feed")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-amber-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 1. Feed Monitoring
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                Pit Inflow
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.feed.liveRateTph.toLocaleString()} <span className="text-xs font-normal text-slate-500">t/h</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Live Apron Feeder Discharge</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Cumulative Feed Today:</span>
                <span className="font-bold text-slate-900 dark:text-white">{monitoringPillars.feed.cumulativeTodayTons.toLocaleString()} Ton</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Feeder Speed Frequency:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{monitoringPillars.feed.feederHz} Hz</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Feed Moisture / Ash:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{monitoringPillars.feed.moisture}% / {monitoringPillars.feed.ash}%</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Throughput Monitoring */}
          <div
            onClick={() => onNavigateTab("throughput")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 2. Throughput
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                Live Rate
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.throughput.liveTph.toLocaleString()} <span className="text-xs font-normal text-slate-500">t/h</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Design: {monitoringPillars.throughput.designCapacityTph} t/h ({monitoringPillars.throughput.utilizationCapacityPercent}%)</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shift Average Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white">{monitoringPillars.throughput.shiftAverageTph} t/h</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Primary Crusher 101:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">1,380 t/h</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Secondary Roll Sizer 102:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">1,325 t/h</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Production Monitoring */}
          <div
            onClick={() => onNavigateTab("output-quality")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" /> 3. Production
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Yield {monitoringPillars.production.yieldPercent}%
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.production.cumulativeOutputTons.toLocaleString()} <span className="text-xs font-normal text-slate-500">Ton</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Target: {monitoringPillars.production.targetOutputTons.toLocaleString()} Ton ({monitoringPillars.production.achievementPercent}%)</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GAR 5,200 (Standard):</span>
                <span className="font-bold text-slate-900 dark:text-white">11,200 Ton</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GAR 5,800 (Premium):</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">4,700 Ton</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Production Yield Loss:</span>
                <span className="font-semibold text-slate-500">5.7% (Reject/Moist)</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Availability */}
          <div
            onClick={() => onNavigateTab("crusher")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-cyan-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> 4. Availability
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">
                PA / MA
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.availability.physicalAvailabilityPA}% <span className="text-xs font-normal text-slate-500">PA</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Mechanical Availability: {monitoringPillars.availability.mechanicalAvailabilityMA}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Operating Hours Today:</span>
                <span className="font-bold text-slate-900 dark:text-white">{monitoringPillars.availability.operatingHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>MTBF (Reliability):</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{monitoringPillars.availability.mtbfHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Availability Target:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">92.0% (Passed)</span>
              </div>
            </div>
          </div>

          {/* Pillar 5: Utilization */}
          <div
            onClick={() => onNavigateTab("throughput")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 5. Utilization
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                UA / EU
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.utilization.operationalUtilizationUA}% <span className="text-xs font-normal text-slate-500">UA</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Effective Utilization: {monitoringPillars.utilization.effectiveUtilizationEU}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Idle Waiting Feed:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{monitoringPillars.utilization.idleHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Standby / Meal Delay:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{monitoringPillars.utilization.standbyHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Utilization Target:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">80.0% (Passed)</span>
              </div>
            </div>
          </div>

          {/* Pillar 6: Downtime */}
          <div
            onClick={() => onNavigateTab("downtime")}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-rose-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 6. Downtime
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                Loss Tracking
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoringPillars.downtime.totalHours} <span className="text-xs font-normal text-slate-500">Hours</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Lost Tonnage: ~{monitoringPillars.downtime.lostTonnage.toLocaleString()} Ton</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Unplanned Breakdowns:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{monitoringPillars.downtime.unplannedHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Planned Maintenance:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{monitoringPillars.downtime.plannedHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>MTTR (Mean Repair Time):</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{monitoringPillars.downtime.mttrHours} Hours</span>
              </div>
            </div>
          </div>

          {/* Pillar 7: Product Size (PSD Analysis) */}
          <div
            onClick={() => onNavigateTab("output-quality")}
            className="sm:col-span-2 bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-cyan-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" /> 7. Product Size & Sieve Analysis (PSD)
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  monitoringPillars.productSize.compliance === "COMPLIANT"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                ● {monitoringPillars.productSize.compliance}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {monitoringPillars.productSize.topSizeMM} <span className="text-xs font-normal text-slate-500">mm Top Size</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Spec: Nominal &lt; {monitoringPillars.productSize.specTopSizeMM} mm (CSS {monitoringPillars.productSize.cssSettingMM} mm)</p>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Nut (25 - 50 mm):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{monitoringPillars.productSize.nutPercent}%</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Fines (0 - 25 mm):</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{monitoringPillars.productSize.finesPercent}%</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Ultrafines (&lt; 2 mm):</span>
                  <span className="font-semibold text-amber-500">{monitoringPillars.productSize.ultraFinesPercent}%</span>
                </div>
              </div>
            </div>

            {/* Sieve Fraction Visual Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Particle Distribution Bar</span>
                <span>Passing 50mm: 99.5%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${monitoringPillars.productSize.nutPercent}%` }} className="bg-indigo-500" title="Nut Coal 25-50mm" />
                <div style={{ width: `${monitoringPillars.productSize.finesPercent - monitoringPillars.productSize.ultraFinesPercent}%` }} className="bg-cyan-500" title="Coarse Fines 2-25mm" />
                <div style={{ width: `${monitoringPillars.productSize.ultraFinesPercent}%` }} className="bg-amber-400" title="Ultrafines <2mm" />
                <div style={{ width: `0.5%` }} className="bg-rose-500" title="Top Oversize >50mm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STAGE DRILL-DOWN & LIVE SENSORS INSPECTOR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              Stage Sensor Inspector & Deep Diagnostics: {activeStageDetail} Circuit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any stage in the flow diagram above to view dedicated sensory telemetry, equipment list, and active bottlenecks
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(["ROM", "CRUSHER", "STOCKPILE", "SHIPMENT"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStageDetail(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStageDetail === stage
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Card Based on Active Stage */}
        {activeStageDetail === "ROM" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" /> ROM Hopper & Feeder Status
              </h4>
              <p className="text-xs text-slate-500">
                Primary Dump Hopper equipped with static grizzly bar (spacing 300mm). Apron feeder AF-101 variable frequency drive running smoothly.
              </p>
              <div className="text-xs space-y-1 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between"><span>Hopper Level:</span><span className="text-emerald-500 font-bold">{pipelineTelemetry.romHopperLevelPercent}% (Optimum)</span></div>
                <div className="flex justify-between"><span>Grizzly Bypass:</span><span>{pipelineTelemetry.grizzlyScreenBypassTph} t/h</span></div>
                <div className="flex justify-between"><span>Rock Breaker:</span><span className="text-cyan-500 font-bold">READY (STANDBY)</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-500" /> Active Haul Truck Dispatch Queue
              </h4>
              <p className="text-xs text-slate-500">
                Real-time hauler cycle feeding ROM pad from Pit 1 North & Pit 2 South:
              </p>
              <div className="space-y-1 pt-1">
                {pipelineTelemetry.activeHaulerTipping.map((truck, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{truck}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">TIPPING NOW</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> AI ROM Blending Advice
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Moisture index is at {pipelineTelemetry.romMoisturePercent}%. Feeding 70% Seam A (5,400 GAR) with 30% Seam C (4,800 GAR) maintains target calorific value 5,240 GAR with minimal chute adhesion risk.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("rom-feed")}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Open Full ROM Feed Management →
              </button>
            </div>
          </div>
        )}

        {activeStageDetail === "CRUSHER" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Factory className="w-4 h-4 text-indigo-500" /> Primary Jaw Crusher (CR-101)
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Status:</span><span className="text-emerald-500 font-bold">RUNNING</span></div>
                <div className="flex justify-between"><span>Throughput:</span><span className="text-indigo-400 font-bold">{pipelineTelemetry.primaryCrusherThroughputTph} t/h</span></div>
                <div className="flex justify-between"><span>Motor Load:</span><span>{pipelineTelemetry.primaryCrusherMotorKw} kW (74% Load)</span></div>
                <div className="flex justify-between"><span>Bearing Temp:</span><span className="text-slate-700 dark:text-slate-300">62.4 °C (Normal)</span></div>
                <div className="flex justify-between"><span>Liner Wear:</span><span className="text-slate-700 dark:text-slate-300">32% Worn (1,420 hrs remaining)</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-indigo-500" /> Secondary Roll Sizer (CR-102) & Screen
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Status:</span><span className="text-emerald-500 font-bold">RUNNING</span></div>
                <div className="flex justify-between"><span>Throughput:</span><span className="text-indigo-400 font-bold">{pipelineTelemetry.secondaryCrusherThroughputTph} t/h</span></div>
                <div className="flex justify-between"><span>Screen Efficiency:</span><span className="text-emerald-400 font-bold">{pipelineTelemetry.vibratingScreenEfficiency}%</span></div>
                <div className="flex justify-between"><span>Oversize Recirc:</span><span className="text-amber-400">{pipelineTelemetry.screenOversizeRecircTph} t/h</span></div>
                <div className="flex justify-between"><span>CSS Roll Gap:</span><span className="text-cyan-400 font-bold">{simCssMm} mm</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Screen & Sizer Optimization
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Vibrating screen deck 102 amplitude is 6.4mm. Fine coal recirculation is steady at {pipelineTelemetry.screenOversizeRecircTph} t/h. No choke conditions detected in the underpan chute.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("crusher")}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Open Full Crusher Fleet View →
              </button>
            </div>
          </div>
        )}

        {activeStageDetail === "STOCKPILE" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-500" /> Product Stockpile 1A & 1B
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Total Inventory:</span><span className="text-emerald-400 font-bold">{pipelineTelemetry.stockpileTotalTons.toLocaleString()} Ton</span></div>
                <div className="flex justify-between"><span>Total Capacity:</span><span>{pipelineTelemetry.stockpileCapacityTons.toLocaleString()} Ton</span></div>
                <div className="flex justify-between"><span>Capacity Used:</span><span className="text-cyan-400 font-bold">{pipelineTelemetry.stockpileCapacityPercent}%</span></div>
                <div className="flex justify-between"><span>Self-Combustion Risk:</span><span className="text-emerald-500 font-bold">LOW (Temp &lt; 42°C)</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-500" /> Stacker & Reclaim Logistics
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Radial Stacker:</span><span className="text-emerald-500 font-bold">ONLINE (3.2 m/s)</span></div>
                <div className="flex justify-between"><span>Reclaimer Rate:</span><span className="text-indigo-400 font-bold">{pipelineTelemetry.reclaimerRateTph} t/h</span></div>
                <div className="flex justify-between"><span>Wheel Loader Support:</span><span>2 Units (WL-401, WL-402)</span></div>
                <div className="flex justify-between"><span>Dust Suppression:</span><span className="text-cyan-400">SPRAY WATER ACTIVE</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-500" /> Mass Balance Reconciliation
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Plant Mass balance variance is within acceptable audit limits (0.4% delta). Stockpile 1A ready for barge nomination.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("stock-balance")}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Open Stock Reconciliation →
              </button>
            </div>
          </div>
        )}

        {activeStageDetail === "SHIPMENT" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-cyan-500" /> Jetty Barge Loading Terminal (BLT-01)
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Nominated Vessel:</span><span className="text-white font-bold">{pipelineTelemetry.bargeName}</span></div>
                <div className="flex justify-between"><span>Barge Capacity:</span><span>{pipelineTelemetry.bargeCapacityTons.toLocaleString()} Ton</span></div>
                <div className="flex justify-between"><span>Loaded Progress:</span><span className="text-cyan-400 font-bold">{pipelineTelemetry.bargeLoadedPercent}%</span></div>
                <div className="flex justify-between"><span>Est. Departure:</span><span>Today 18:30 WITA</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-500" /> Daily Port Despatch Achievement
              </h4>
              <div className="text-xs space-y-1.5 font-mono pt-2">
                <div className="flex justify-between"><span>Loading Rate:</span><span className="text-emerald-400 font-bold">{pipelineTelemetry.shipmentLiveRateTph} t/h</span></div>
                <div className="flex justify-between"><span>Loaded Today:</span><span className="text-white font-bold">{pipelineTelemetry.todayLoadedTonnage.toLocaleString()} Ton</span></div>
                <div className="flex justify-between"><span>Target Today:</span><span>{pipelineTelemetry.targetDailyTonnage.toLocaleString()} Ton</span></div>
                <div className="flex justify-between"><span>Demurrage Penalty Risk:</span><span className="text-emerald-500 font-bold">NONE (0 hrs)</span></div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" /> Pre-Shipment Assay Clearance
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Automatic mechanical belt sampler QS-001 assay verified: CV 5,220 GAR, Total Moisture 12.4%, Ash 6.8%, Total Sulfur 0.62% (All Export Spec Compliant).
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("reports")}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Generate Shipment Certificate of Sampling & Analysis (COA) →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
