// MINE SMART AI - Dispatch Header Component

import React from "react";
import {
  Radio,
  Plus,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  Gauge,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  Truck,
} from "lucide-react";

interface DispatchHeaderProps {
  totalActiveDispatch: number;
  operatingTrucks: number;
  queuedTrucks: number;
  avgCycleTimeMin: number;
  avgQueueTimeMin: number;
  targetAchievementPercent: number;
  onNewAssignment: () => void;
  onRunOptimization: () => void;
  onOpenSmartDispatch?: () => void;
  onOpenAlerts: () => void;
  onOpenAI: () => void;
  onExport: () => void;
}

export const DispatchHeader: React.FC<DispatchHeaderProps> = ({
  totalActiveDispatch,
  operatingTrucks,
  queuedTrucks,
  avgCycleTimeMin,
  avgQueueTimeMin,
  targetAchievementPercent,
  onNewAssignment,
  onRunOptimization,
  onOpenSmartDispatch,
  onOpenAlerts,
  onOpenAI,
  onExport,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Title & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wide uppercase">
                DISPATCH MANAGEMENT & AI OPTIMIZATION CENTER
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full uppercase">
                FMS Dispatch v4.2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pusat Pengaturan Fleet Assignment, Excavator-Truck Matching, Cycle Time Engine & Real-Time Dispatch Optimization
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenSmartDispatch && (
            <button
              onClick={onOpenSmartDispatch}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Dispatch AI</span>
            </button>
          )}

          <button
            onClick={onNewAssignment}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Fleet Assignment</span>
          </button>

          <button
            onClick={onRunOptimization}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>AI Optimizer</span>
          </button>

          <button
            onClick={onOpenAlerts}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Alerts</span>
          </button>

          <button
            onClick={onOpenAI}
            className="px-3.5 py-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={onExport}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-slate-800">
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Active Dispatch</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{totalActiveDispatch} <span className="text-xs font-normal text-slate-400">Trucks</span></div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% Assigned</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Operating Trucks</span>
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">{operatingTrucks}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active on route</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Queued Trucks</span>
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400 font-mono">{queuedTrucks}</div>
          <div className="text-[10px] text-rose-300 mt-0.5">Waiting loading/dump</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Avg Cycle Time</span>
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black text-sky-400 font-mono">{avgCycleTimeMin} <span className="text-xs text-slate-400">min</span></div>
          <div className="text-[10px] text-slate-400 mt-0.5">Target: 30.0 min</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Avg Queue Time</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">{avgQueueTimeMin} <span className="text-xs text-slate-400">min</span></div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Limit: &lt; 5.0 min</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Shift Target</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">{targetAchievementPercent}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">2,850 / 3,000 Ton</div>
        </div>
      </div>
    </div>
  );
};
