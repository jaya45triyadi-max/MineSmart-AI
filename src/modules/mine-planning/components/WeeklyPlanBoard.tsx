// MINE SMART AI - Weekly Plan Board Component

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Flame,
  Pickaxe,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { WeeklyPlan } from "../../../types/minePlanningTypes";

interface WeeklyPlanBoardProps {
  weeklyPlans: WeeklyPlan[];
  onAddWeeklyPlan: (plan: WeeklyPlan) => void;
}

export const WeeklyPlanBoard: React.FC<WeeklyPlanBoardProps> = ({
  weeklyPlans,
  onAddWeeklyPlan,
}) => {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0);
  const activeWeekly = weeklyPlans[selectedWeekIdx] || weeklyPlans[0];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Papan Jadwal Operasional Weekly Plan (Week 32 - Week 36)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alokasi target harian Senin s/d Minggu sesuai kuota MTP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400">Pilih Minggu:</span>
          {weeklyPlans.map((wp, idx) => (
            <button
              key={wp.id}
              onClick={() => setSelectedWeekIdx(idx)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                idx === selectedWeekIdx
                  ? "bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm"
                  : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              Week {wp.weekNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Target Total Card Bar */}
      {activeWeekly && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-slate-400 block text-[10px] font-bold">Total Coal Target (Mingguan):</span>
            <span className="text-2xl font-black text-amber-500 font-mono">
              {activeWeekly.coalTargetMt.toLocaleString()} MT
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-slate-400 block text-[10px] font-bold">Total OB Target (Mingguan):</span>
            <span className="text-2xl font-black text-sky-400 font-mono">
              {activeWeekly.wasteTargetMbc.toLocaleString()} MBCM
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-slate-400 block text-[10px] font-bold">Armada Fleet Dialokasikan:</span>
            <span className="text-2xl font-black text-emerald-500 font-mono">
              {activeWeekly.equipmentTargetUnits} Unit Fleet
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <span className="text-slate-400 block text-[10px] font-bold">Bench Level Pit:</span>
            <span className="text-2xl font-black text-purple-400 font-mono">
              {activeWeekly.benchCode}
            </span>
          </div>
        </div>
      )}

      {/* Monday - Sunday 7 Days Grid */}
      {activeWeekly && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {activeWeekly.dailyAllocations.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {day.dayName}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{day.dateStr}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <span className="text-[10px] block font-sans">Coal Target:</span>
                  <strong className="font-mono text-sm">{day.coalTargetMt} MT</strong>
                </div>

                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <span className="text-[10px] block font-sans">Waste Target:</span>
                  <strong className="font-mono text-sm">{day.wasteTargetMbc} MBCM</strong>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 block font-bold">Fleet Assigned:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-bold block">
                    {day.equipmentAssigned}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">
                  ● {day.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
