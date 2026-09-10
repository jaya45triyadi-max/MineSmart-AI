import React, { useState } from "react";
import {
  Layers,
  Flame,
  Scale,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PlantMaterialBalance } from "../../../types/processingPlantTypes";

interface StockReconciliationTabProps {
  balances: PlantMaterialBalance[];
  onReconcile: (balanceId: string) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const StockReconciliationTab: React.FC<StockReconciliationTabProps> = ({
  balances,
  onReconcile,
  onOpenAiAnalysis,
}) => {
  const stockInventory = [
    { stockpile: "ROM Stockpile A (Pit 1 North)", opening: 42000, incoming: 11200, processed: 14000, outgoing: 0, closing: 39200, status: "BALANCED" },
    { stockpile: "ROM Stockpile B (Pit 2 East)", opening: 28500, incoming: 9800, processed: 8500, outgoing: 0, closing: 29800, status: "BALANCED" },
    { stockpile: "Product Stockpile 1A (Crushed 5200 GAR)", opening: 65000, incoming: 10600, processed: 0, outgoing: 12000, closing: 63600, status: "BALANCED" },
    { stockpile: "Clean Coal Stockpile 02 (Washed 4600 GAR)", opening: 18200, incoming: 5800, processed: 0, outgoing: 4500, closing: 19500, status: "REVIEW_REQUIRED" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-500" />
            Stock Balance & Material Balance Reconciliation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formula: Closing Stock = Opening Stock + Incoming - Outgoing ± Adjustments | Mass Balance Audit
          </p>
        </div>
        <button
          onClick={() => onOpenAiAnalysis("Audit rekonsiliasi material balance dan selisih tonase stockpile")}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Material Reconciliation AI
        </button>
      </div>

      {/* Stock Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stockInventory.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {item.stockpile}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  item.status === "BALANCED"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Formula grid */}
            <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Opening</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.opening.toLocaleString()} t
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">+ Incoming</span>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{item.incoming.toLocaleString()} t
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">- Outgoing</span>
                <div className="font-semibold text-rose-500">
                  -{item.outgoing > 0 ? item.outgoing.toLocaleString() : item.processed.toLocaleString()} t
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] font-bold text-indigo-500">= Closing</span>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  {item.closing.toLocaleString()} t
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Material Mass Balance Table */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Plant Mass Balance Log & Audit Trail
          </h4>
          <span className="text-xs text-slate-400">Threshold Alert: Variance &gt; 2.0%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Balance ID</th>
                <th className="p-3">Plant Unit</th>
                <th className="p-3 text-right">ROM Feed (Ton)</th>
                <th className="p-3 text-right">Processed (Ton)</th>
                <th className="p-3 text-right">Product Output (Ton)</th>
                <th className="p-3 text-right">Reject/Waste (Ton)</th>
                <th className="p-3 text-right">Difference (Ton)</th>
                <th className="p-3 text-right">Variance %</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {balances.map((mb) => (
                <tr key={mb.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {mb.balanceId}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {mb.plantId}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {mb.romFeedQty.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                    {mb.processedQty.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {mb.productQty.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-rose-500">
                    {(mb.rejectQty + mb.wasteQty).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {mb.differenceQty} t
                  </td>
                  <td className="p-3 text-right font-bold">
                    <span className={mb.variancePercent > 2.0 ? "text-amber-500" : "text-emerald-500"}>
                      {mb.variancePercent}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mb.status === "BALANCED"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {mb.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onReconcile(mb.balanceId)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reconcile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
