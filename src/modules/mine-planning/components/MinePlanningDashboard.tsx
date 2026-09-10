// MINE SMART AI - Mine Planning Executive Dashboard & Overview

import React from "react";
import {
  Compass,
  Target,
  Pickaxe,
  TrendingUp,
  Layers,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Flame,
  Truck,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { MinePlan, PlanningConstraint, PlanVsActualPerformance } from "../../../types/minePlanningTypes";

interface MinePlanningDashboardProps {
  currentPlan: MinePlan;
  constraints: PlanningConstraint[];
  performances: PlanVsActualPerformance[];
  onNavigateTab: (tabKey: string) => void;
  onOpenAICopilot: () => void;
}

export const MinePlanningDashboard: React.FC<MinePlanningDashboardProps> = ({
  currentPlan,
  constraints,
  performances,
  onNavigateTab,
  onOpenAICopilot,
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Plan Target Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Coal (MT)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {currentPlan.coalTargetMt.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-500">+4.2% MTD</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Rencana Aktif: <strong className="text-slate-700 dark:text-slate-200">{currentPlan.planVersion}</strong>
          </p>
        </div>

        {/* Waste Target Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Waste OB (MBCM)</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Pickaxe className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {currentPlan.wasteTargetMbc.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-sky-400">On Track</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total Movement: <strong className="text-slate-700 dark:text-slate-200">{currentPlan.totalMovementMbc} MBCM</strong>
          </p>
        </div>

        {/* Target Strip Ratio Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Strip Ratio (SR)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-500 font-mono">
              {currentPlan.targetStripRatio}:1
            </span>
            <span className="text-xs font-bold text-slate-400">BCM / Ton</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Pushback PB01 SR: <strong className="text-emerald-500">3.2:1</strong>
          </p>
        </div>

        {/* Reserve & LOM Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sisa Cadangan (LOM)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              125.0 MT
            </span>
            <span className="text-xs font-bold text-teal-400">10 Tahun</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Geology Model: <strong className="text-slate-700 dark:text-slate-200">JORC 2026 Verified</strong>
          </p>
        </div>
      </div>

      {/* Plan Hierarchy & Status Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <button
          onClick={() => onNavigateTab("lom")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">LOM (Life of Mine)</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">2026 - 2035</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1">● APPROVED</span>
        </button>

        <button
          onClick={() => onNavigateTab("ltp")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">LTP (Long Term)</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">LTP 2026 v1.0</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1">● ACTIVE</span>
        </button>

        <button
          onClick={() => onNavigateTab("mtp")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">MTP (Medium Term)</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">Q3 2026 Target</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1">● ACTIVE</span>
        </button>

        <button
          onClick={() => onNavigateTab("stp")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">STP (Short Term)</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">Agustus 2026</span>
          <span className="text-[10px] text-amber-500 font-bold block mt-1">● REVIEW</span>
        </button>

        <button
          onClick={() => onNavigateTab("weekly")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">Weekly Plan</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">Week 32 Plan</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1">● ACTIVE</span>
        </button>

        <button
          onClick={() => onNavigateTab("daily")}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 block">Daily Shift Plan</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white block mt-0.5">Today Shift 1</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1">● EXECUTING</span>
        </button>
      </div>

      {/* Main Grid: Plan vs Actual & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Plan vs Actual Summary */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Pencapaian Rencana Produksi (Plan vs Actual Performance)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("performance")}
              className="text-xs font-bold text-teal-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Detail</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Area / Pit</th>
                  <th className="py-2.5 px-3 text-right">Coal Plan</th>
                  <th className="py-2.5 px-3 text-right">Coal Actual</th>
                  <th className="py-2.5 px-3 text-right">Waste Plan</th>
                  <th className="py-2.5 px-3 text-right">Waste Actual</th>
                  <th className="py-2.5 px-3 text-center">Strip Ratio</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {performances.map((perf, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{perf.periodLabel}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{perf.coalPlanMt} MT</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">{perf.coalActualMt} MT</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{perf.wastePlanMbc} MBCM</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-sky-400">{perf.wasteActualMbc} MBCM</td>
                    <td className="py-3 px-3 text-center font-mono text-teal-500">{perf.srActual}:1</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          perf.status === "Above Plan" || perf.status === "On Plan"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {perf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: AI Planning Insights & Critical Issues */}
        <div className="space-y-4">
          {/* AI Planning Insights Box */}
          <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-slate-900 to-slate-950 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-xs font-black uppercase tracking-wider">AI Planning Insight</h4>
              </div>
              <button
                onClick={onOpenAICopilot}
                className="px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 text-[10px] font-black hover:bg-teal-400 cursor-pointer"
              >
                Tanya AI
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">
                Rekomendasi Optimalisasi Sequence Pushback PB02:
              </p>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                <li>Penggalian OB Bench RL +80m perlu dipercepat +8% minggu ini.</li>
                <li>Dua unit Rigid Truck HD785 berpotensi idle jika ramp utara tidak diperlebar.</li>
                <li>Peluang penurunan Strip Ratio sebesar -0.3 BCM/Ton di Q4.</li>
              </ul>
            </div>
          </div>

          {/* Critical Planning Constraints Widget */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Kendala Lapangan Aktif ({constraints.length})
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              {constraints.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-amber-500">
                    <span>[{c.type}] {c.affectedArea}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10">{c.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
