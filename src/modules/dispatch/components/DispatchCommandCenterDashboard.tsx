// MINE SMART AI - Dispatch Command Center Dashboard Component

import React from "react";
import {
  Activity,
  Truck,
  Layers,
  Clock,
  Gauge,
  Sparkles,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Zap,
  Radio,
  Sliders,
  ShieldAlert,
} from "lucide-react";

import { DispatchRecord, DispatchQueueItem, ExcavatorTruckMatchScore, DispatchAlertRecord } from "../../../types/dispatchTypes";

interface DispatchCommandCenterDashboardProps {
  dispatches: DispatchRecord[];
  queues: DispatchQueueItem[];
  matches: ExcavatorTruckMatchScore[];
  alerts: DispatchAlertRecord[];
  onSelectSubTab: (subTabKey: string) => void;
  onOpenAI: () => void;
  onNewAssignment: () => void;
}

export const DispatchCommandCenterDashboard: React.FC<DispatchCommandCenterDashboardProps> = ({
  dispatches,
  queues,
  matches,
  alerts,
  onSelectSubTab,
  onOpenAI,
  onNewAssignment,
}) => {
  // Aggregate KPIs
  const totalActiveDispatch = dispatches.filter((d) => d.assignmentStatus === "ACTIVE").length;
  const activeTrucks = dispatches.length;
  const activeExcavators = Array.from(new Set(dispatches.map((d) => d.excavatorUnitCode))).length;

  const operatingCount = dispatches.filter((d) => d.dispatchStatus === "Hauling Loaded" || d.dispatchStatus === "Returning").length;
  const queuedCount = dispatches.filter((d) => d.dispatchStatus === "Queued").length;
  const loadingCount = dispatches.filter((d) => d.dispatchStatus === "Loading").length;
  const haulingCount = dispatches.filter((d) => d.dispatchStatus === "Hauling Loaded").length;
  const dumpingCount = dispatches.filter((d) => d.dispatchStatus === "Dumping").length;
  const returningCount = dispatches.filter((d) => d.dispatchStatus === "Returning").length;
  const idleCount = dispatches.filter((d) => d.dispatchStatus === "Assigned" || d.dispatchStatus === "Exception").length;

  const avgCycleTime = dispatches.length > 0
    ? Number((dispatches.reduce((acc, curr) => acc + curr.totalCycleTimeMin, 0) / dispatches.length).toFixed(1))
    : 32.0;

  const avgQueueTime = dispatches.length > 0
    ? Number((dispatches.reduce((acc, curr) => acc + curr.queueTimeMin, 0) / dispatches.length).toFixed(1))
    : 4.5;

  const avgLoadingTime = dispatches.length > 0
    ? Number((dispatches.reduce((acc, curr) => acc + curr.loadingTimeMin, 0) / dispatches.length).toFixed(1))
    : 4.0;

  const totalActualProductionTon = dispatches.reduce((acc, curr) => acc + curr.actualProductionTon, 0);
  const totalTargetProductionTon = dispatches.reduce((acc, curr) => acc + curr.targetProductionTon, 0);
  const targetAchievement = totalTargetProductionTon > 0
    ? Number(((totalActualProductionTon / totalTargetProductionTon) * 100).toFixed(1))
    : 92.5;

  return (
    <div className="space-y-6">
      {/* 1. Full Dispatch Command Center KPI Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              DISPATCH COMMAND CENTER - OPERATIONAL METRICS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last Synced: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Dispatch</p>
            <p className="text-lg font-black text-amber-400 font-mono mt-1">{totalActiveDispatch}</p>
            <p className="text-[9px] text-slate-400">Trucks active</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Trucks</p>
            <p className="text-lg font-black text-sky-400 font-mono mt-1">{activeTrucks}</p>
            <p className="text-[9px] text-slate-400">Haul units</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Diggers</p>
            <p className="text-lg font-black text-indigo-400 font-mono mt-1">{activeExcavators}</p>
            <p className="text-[9px] text-slate-400">Excavators</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Queued Trucks</p>
            <p className="text-lg font-black text-rose-400 font-mono mt-1">{queuedCount}</p>
            <p className="text-[9px] text-rose-300">In loading bay</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Loading State</p>
            <p className="text-lg font-black text-amber-300 font-mono mt-1">{loadingCount}</p>
            <p className="text-[9px] text-slate-400">Under bucket</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Hauling State</p>
            <p className="text-lg font-black text-emerald-400 font-mono mt-1">{haulingCount}</p>
            <p className="text-[9px] text-slate-400">Loaded en route</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Dumping State</p>
            <p className="text-lg font-black text-cyan-400 font-mono mt-1">{dumpingCount}</p>
            <p className="text-[9px] text-slate-400">At ROM/Waste</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Returning State</p>
            <p className="text-lg font-black text-teal-400 font-mono mt-1">{returningCount}</p>
            <p className="text-[9px] text-slate-400">Empty return</p>
          </div>
        </div>
      </div>

      {/* 2. Dispatch Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              REAL-TIME DISPATCH CYCLE FLOW
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              PREMIUM AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectSubTab("smart-dispatch")}
              className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Dispatch Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectSubTab("cycle-time")}
              className="text-xs text-slate-400 font-bold hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Cycle Engine</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
          {/* Step 1: EXCAVATOR */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-amber-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              01
            </div>
            <p className="text-xs font-bold text-white uppercase">EXCAVATOR</p>
            <p className="text-[11px] font-mono text-amber-400 font-bold mt-1">{activeExcavators} Diggers</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Pit 1, Pit 2, Pit 3</p>
          </div>

          {/* Step 2: QUEUE */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-rose-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              02
            </div>
            <p className="text-xs font-bold text-white uppercase">QUEUE</p>
            <p className="text-[11px] font-mono text-rose-400 font-bold mt-1">{queuedCount} Trucks</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Avg: {avgQueueTime} min</p>
          </div>

          {/* Step 3: LOADING */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-amber-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              03
            </div>
            <p className="text-xs font-bold text-white uppercase">LOADING</p>
            <p className="text-[11px] font-mono text-amber-300 font-bold mt-1">{loadingCount} Trucks</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Avg: {avgLoadingTime} min</p>
          </div>

          {/* Step 4: HAULING LOADED */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-emerald-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              04
            </div>
            <p className="text-xs font-bold text-white uppercase">HAULING LOADED</p>
            <p className="text-[11px] font-mono text-emerald-400 font-bold mt-1">{haulingCount} Trucks</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Speed: ~28 km/h</p>
          </div>

          {/* Step 5: DUMPING */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-cyan-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              05
            </div>
            <p className="text-xs font-bold text-white uppercase">DUMPING</p>
            <p className="text-[11px] font-mono text-cyan-400 font-bold mt-1">{dumpingCount} Trucks</p>
            <p className="text-[10px] text-slate-400 mt-0.5">ROM & Disposal</p>
          </div>

          {/* Step 6: RETURN EMPTY */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center relative group hover:border-teal-500/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              06
            </div>
            <p className="text-xs font-bold text-white uppercase">RETURN EMPTY</p>
            <p className="text-[11px] font-mono text-teal-400 font-bold mt-1">{returningCount} Trucks</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Back to loading</p>
          </div>
        </div>
      </div>

      {/* 3. Live GIS Map & AI Dispatch Optimization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live GIS Map View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                LIVE GIS DISPATCH FLEET MAP
              </h3>
            </div>
            <button
              onClick={() => onSelectSubTab("live")}
              className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg hover:bg-amber-500/30 cursor-pointer"
            >
              Live Board
            </button>
          </div>

          {/* Simulated Interactive Vector Map View */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-80 relative overflow-hidden flex flex-col justify-between">
            {/* Map Terrain Topo Lines Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Map Overlays & Legend */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping" /> EXCAVATOR
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> HAULING
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> QUEUE
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> DUMPING
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Pit 1 South ↔ ROM 01 Route</span>
            </div>

            {/* Map Visual Active Nodes */}
            <div className="relative z-10 grid grid-cols-3 gap-4 my-auto">
              {/* Origin Pit Node */}
              <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl">
                <p className="text-[10px] text-amber-400 font-bold uppercase">Loading Area</p>
                <p className="text-xs font-extrabold text-white">Pit 1 South</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">EX-201</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-1.5 py-0.5 rounded">3 DT Queue</span>
                </div>
              </div>

              {/* Haul Road Route Node */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Haul Road Alpha</p>
                <p className="text-xs font-mono text-emerald-300 font-bold mt-0.5">Distance: 4.2 km</p>
                <p className="text-[10px] text-slate-400 mt-1">DT-101, DT-102 En Route</p>
              </div>

              {/* Destination ROM Node */}
              <div className="bg-cyan-950/40 border border-cyan-500/40 p-3 rounded-xl text-right">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">Destination Area</p>
                <p className="text-xs font-extrabold text-white">ROM Stockpile 01</p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded">DT-104 Dumping</span>
                </div>
              </div>
            </div>

            {/* Map Footer Bar */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-[11px]">
              <span className="text-slate-400">Total Active Units in Map: <strong className="text-white font-mono">12 Fleet Vehicles</strong></span>
              <button
                onClick={() => onSelectSubTab("locations")}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Full Interactive GIS Map →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Dispatch Optimizer & Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm uppercase tracking-wider text-white">AI DISPATCH OPTIMIZER</h3>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                94% Confidence
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between font-bold text-xs text-amber-400 mb-1">
                  <span>BOTTLENECK DETECTED</span>
                  <span className="text-[10px] text-rose-400 font-mono">Pit 1 South</span>
                </div>
                <p className="text-xs text-slate-300">
                  Antrean di EX-201 mencapai <strong>10.0 menit</strong> (3 Dump Truck menunggu). Terjadi ketidakseimbangan armada antara Pit 1 dan Pit 2.
                </p>
              </div>

              <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/30 space-y-2">
                <p className="text-xs font-bold text-indigo-300 uppercase">Rekomendasi AI Optimization:</p>
                <p className="text-xs text-slate-200">
                  Pindahkan <strong>DT-107 & DT-108</strong> dari <strong>EX-201 (Pit 1)</strong> ke <strong>EX-202 (Pit 2)</strong>.
                </p>
                <div className="pt-2 border-t border-indigo-500/20 text-[11px] text-emerald-400 font-semibold">
                  Potensi Pengurangan Queue: -62% | Potensi Peningkatan Production: +350 Ton/Shift
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => onSelectSubTab("smart-dispatch")}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Buka Smart Dispatch AI Suite (Premium)</span>
            </button>

            <button
              onClick={() => onSelectSubTab("optimization")}
              className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Simulasikan Scenario Plan</span>
            </button>

            <button
              onClick={onOpenAI}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tanya AI Copilot Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Excavator-Truck Matching & Queue Alert Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excavator-Truck Matching Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                EXCAVATOR-TRUCK MATCHING HIGHLIGHTS
              </h3>
            </div>
            <button
              onClick={() => onSelectSubTab("excavator-truck")}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Lihat Detail Matching →
            </button>
          </div>

          <div className="space-y-3">
            {matches.slice(0, 2).map((m, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-white font-mono">
                    <span>{m.excavatorUnitCode} ↔ {m.truckUnitCode}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-sans">
                      Ratio: {m.recommendedRatio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.reason}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 font-mono">{m.compatibilityScorePercent}%</span>
                  <p className="text-[9px] text-slate-400 uppercase">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Dispatch Alerts Strip */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                ACTIVE DISPATCH ALERTS ({alerts.filter((a) => !a.isResolved).length})
              </h3>
            </div>
            <button
              onClick={() => onSelectSubTab("alerts")}
              className="text-xs text-rose-400 font-bold hover:underline cursor-pointer"
            >
              Kelola Alerts →
            </button>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
            {alerts.filter((a) => !a.isResolved).map((alt) => (
              <div key={alt.alertId} className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <span className="font-mono text-white">[{alt.unitCode}]</span>
                    <span>{alt.alertType}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{alt.message}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap ml-2">
                  {alt.timestamp.slice(11, 16)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
