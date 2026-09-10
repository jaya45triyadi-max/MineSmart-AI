// MINE SMART AI - Life of Mine (LOM) Reserve Depletion Component

import React, { useState } from "react";
import {
  Layers,
  Flame,
  Pickaxe,
  TrendingUp,
  BarChart3,
  Sliders,
} from "lucide-react";
import { MinePlanningCalculationService } from "../../../services/mine-planning/MinePlanningCalculationService";

export const LOMView: React.FC = () => {
  const [initialReserveMt, setInitialReserveMt] = useState<number>(125.0);
  const [annualCoalMt, setAnnualCoalMt] = useState<number>(12.5);
  const [annualWasteMbc, setAnnualWasteMbc] = useState<number>(52.5);

  const lomData = MinePlanningCalculationService.calculateLOM(
    initialReserveMt,
    annualCoalMt,
    annualWasteMbc
  );

  return (
    <div className="space-y-6">
      {/* Top Controls & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Parameter Life of Mine (LOM) & Proyeksi Deplesi Cadangan
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">JORC / KAPI VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Total Cadangan Awal (MT):</label>
              <input
                type="number"
                step="0.5"
                value={initialReserveMt}
                onChange={(e) => setInitialReserveMt(parseFloat(e.target.value) || 100)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Target Coal / Tahun (MT):</label>
              <input
                type="number"
                step="0.1"
                value={annualCoalMt}
                onChange={(e) => setAnnualCoalMt(parseFloat(e.target.value) || 10)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Target OB / Tahun (MBCM):</label>
              <input
                type="number"
                step="0.5"
                value={annualWasteMbc}
                onChange={(e) => setAnnualWasteMbc(parseFloat(e.target.value) || 40)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-sky-400"
              />
            </div>
          </div>
        </div>

        {/* LOM Summary Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Hasil Proyeksi Umur Tambang</span>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-500 font-mono">{lomData.years} Tahun</span>
            <span className="text-xs font-bold text-slate-400">s/d Tahun {2026 + lomData.years}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Overall LOM Strip Ratio:</span>
              <strong className="text-teal-500 font-mono">{lomData.overallStripRatio} : 1</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimasi Revenue LOM:</span>
              <strong className="text-amber-500 font-mono">${(initialReserveMt * 65 / 1000).toFixed(2)} Miliar USD</strong>
            </div>
          </div>
        </div>
      </div>

      {/* LOM Yearly Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Jadwal Deplesi Cadangan LOM Tahun Ke-1 s/d Tahun Ke-{lomData.years}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Tahun Operasi</th>
                <th className="py-2.5 px-3 text-right">Coal Target (MT)</th>
                <th className="py-2.5 px-3 text-right">OB Waste Target (MBCM)</th>
                <th className="py-2.5 px-3 text-center">Strip Ratio</th>
                <th className="py-2.5 px-3 text-right">Sisa Cadangan (MT)</th>
                <th className="py-2.5 px-3 text-right">Est. Revenue (MUSD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {lomData.yearlyDepletion.map((item) => (
                <tr key={item.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    Tahun {2025 + item.year} (Year {item.year})
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-500">{item.coalTargetMt} MT</td>
                  <td className="py-3 px-3 text-right font-mono text-sky-400">{item.wasteTargetMbc} MBCM</td>
                  <td className="py-3 px-3 text-center font-mono text-teal-500">{item.stripRatio}:1</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">{item.remainingReserveMt} MT</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">${item.revenueEstMUSD} M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
