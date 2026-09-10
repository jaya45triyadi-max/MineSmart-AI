// MINE SMART AI - Daily Shift Plan Board & Plan vs Actual Variance Tracker

import React, { useState } from "react";
import {
  Clock,
  Plus,
  Flame,
  Pickaxe,
  Truck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { DailyPlan } from "../../../types/minePlanningTypes";

interface DailyPlanBoardProps {
  dailyPlans: DailyPlan[];
  onAddDailyPlan: (plan: DailyPlan) => void;
}

export const DailyPlanBoard: React.FC<DailyPlanBoardProps> = ({
  dailyPlans,
  onAddDailyPlan,
}) => {
  const [selectedDate, setSelectedDate] = useState("2026-08-12");

  return (
    <div className="space-y-6">
      {/* Top Date & Shift Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Daily Operational Shift Plan & Dispatch Alignment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jadwal Shift 1 (Siang) & Shift 2 (Malam) terintegrasi ke Fleet Management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Tanggal Operasi:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Daily Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dailyPlans.map((dp) => {
          const coalVariance = dp.actualCoalMt ? dp.actualCoalMt - dp.coalTargetMt : 0;
          const wasteVariance = dp.actualWasteMbc ? dp.actualWasteMbc - dp.wasteTargetMbc : 0;

          return (
            <div
              key={dp.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-teal-500/10 text-teal-500 font-mono">
                    {dp.shift === "SHIFT_1_DAY" ? "SHIFT 1 (SIANG)" : "SHIFT 2 (MALAM)"}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{dp.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">
                  ● {dp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Pit Location:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{dp.pitName} ({dp.pushbackId})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Bench Level:</span>
                  <strong className="text-sky-400 font-mono">{dp.benchCode}</strong>
                </div>
              </div>

              {/* Plan vs Actual Metric Tracker */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">Produksi Coal (Target vs Actual):</span>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-xs text-slate-500">Plan: {dp.coalTargetMt}</span>
                    <span className="text-sm font-bold text-amber-500">Act: {dp.actualCoalMt || 0} MT</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-500 text-right">
                    Variansi: {coalVariance >= 0 ? `+${coalVariance}` : coalVariance} MT
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">Produksi OB (Target vs Actual):</span>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-xs text-slate-500">Plan: {dp.wasteTargetMbc}</span>
                    <span className="text-sm font-bold text-sky-400">Act: {dp.actualWasteMbc || 0} MBCM</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-500 text-right">
                    Variansi: {wasteVariance >= 0 ? `+${wasteVariance}` : wasteVariance} MBCM
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block font-bold">Alokasi Fleet Equipment:</span>
                <p className="font-mono text-slate-700 dark:text-slate-300">{dp.assignedEquipment.join(", ")}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 text-[10px] block font-bold">Rute Hauling Disetujui:</span>
                <p className="font-sans text-slate-600 dark:text-slate-400 text-[11px]">{dp.haulingRoute}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
