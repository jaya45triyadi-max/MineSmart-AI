// MINE SMART AI - Spare Part Demand Forecast View

import React from "react";
import {
  Boxes,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";
import { SparePartDemandForecast } from "../../types/predictiveTypes";

interface SparePartsForecastViewProps {
  sparePartForecasts: SparePartDemandForecast[];
  onOpenAIAssistant: () => void;
}

export const SparePartsForecastView: React.FC<SparePartsForecastViewProps> = ({
  sparePartForecasts,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-500" />
            <span>AI Predictive Spare Part Demand Forecast</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proyeksi kebutuhan suku cadang 30-90 hari ke depan berdasarkan rekomendasi pemeliharaan AI dan jadwal PM fleet.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Stok Spare Part</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 text-indigo-500 shrink-0" />
        <span>
          <strong>Gudang Safety Rule:</strong> AI hanya memproyeksikan estimasi kebutuhan suku cadang dan tidak mengurangi stok secara otomatis tanpa persetujuan tim Warehouse & Logistics.
        </span>
      </div>

      {/* Forecast Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Predictive Parts Reorder List</h3>
          <span className="text-xs text-slate-400">30-Day Demand Window</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Part Code & Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Lead Time</th>
                <th className="p-3">Predicted Demand (30d)</th>
                <th className="p-3">Suggested Reorder</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 rounded-r-xl">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {sparePartForecasts.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    <div>{part.partName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{part.partNumber}</div>
                  </td>
                  <td className="p-3">{part.category}</td>
                  <td className="p-3">
                    <span className={`font-extrabold ${part.currentStockQty === 0 ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                      {part.currentStockQty} units
                    </span>
                    {part.potentialStockoutDate && (
                      <span className="block text-[10px] text-rose-500 font-semibold">
                        Stockout risk: {part.potentialStockoutDate}
                      </span>
                    )}
                  </td>
                  <td className="p-3">{part.leadTimeDays} Days</td>
                  <td className="p-3 font-bold text-indigo-500">{part.predictedDemand30Days} units</td>
                  <td className="p-3 font-black text-emerald-500">{part.suggestedReorderQty} units</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{part.confidencePercent}%</td>
                  <td className="p-3 text-slate-500 max-w-xs">{part.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
