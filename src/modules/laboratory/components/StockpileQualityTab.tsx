import React from "react";
import { Flame, Droplets, ShieldCheck, Layers, RefreshCw, AlertTriangle } from "lucide-react";

export const StockpileQualityTab: React.FC = () => {
  const stockpileAssays = [
    { code: "SP-01", name: "Stockpile SP-01 High Grade Export", gar: 5850, tm: 22.4, ash: 5.8, ts: 0.58, status: "READY_EXPORT", tonnage: "85,000 MT" },
    { code: "SP-02", name: "Stockpile SP-02 Medium Blend", gar: 5420, tm: 26.2, ash: 7.2, ts: 0.68, status: "READY_BLEND", tonnage: "120,000 MT" },
    { code: "SP-03", name: "Stockpile SP-03 Low Grade / High Moisture", gar: 4890, tm: 31.2, ash: 9.8, ts: 0.82, status: "NEEDS_AERATION", tonnage: "65,000 MT" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" /> Kualitas Batubara Stockpile Real-Time
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring assay laboratorium terkini untuk setiap pile di ROM Stockpile, ketersediaan tonase, dan analisis degradasi kualitas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stockpileAssays.map((sp) => (
          <div
            key={sp.code}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-500">{sp.code}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sp.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {sp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">GAR (kcal/kg)</span>
                <strong className="text-base font-extrabold text-amber-600 dark:text-amber-400">{sp.gar}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Total Moisture</span>
                <strong className="text-base font-extrabold text-blue-600 dark:text-blue-400">{sp.tm}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Ash Content</span>
                <strong className="text-base font-extrabold text-slate-800 dark:text-slate-200">{sp.ash}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Total Sulfur</span>
                <strong className="text-base font-extrabold text-slate-800 dark:text-slate-200">{sp.ts}%</strong>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Volume Stok:</span>
              <strong className="text-slate-900 dark:text-slate-100 font-bold">{sp.tonnage}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
