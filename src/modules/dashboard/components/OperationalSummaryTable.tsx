// MINE SMART AI - Operational Summary Table Component

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { OperationalSummaryRow } from "../../../services/dashboard/DashboardAnalyticsService";

interface OperationalSummaryTableProps {
  rows: OperationalSummaryRow[];
}

export const OperationalSummaryTable: React.FC<OperationalSummaryTableProps> = ({ rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="p-3">Metrik Operasional</th>
            <th className="p-3">Kategori</th>
            <th className="p-3">Aktual</th>
            <th className="p-3">Target</th>
            <th className="p-3">Deviasi / Variance</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Tren</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
              <td className="p-3 font-bold text-white">{row.metric}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                  {row.category}
                </span>
              </td>
              <td className="p-3 font-extrabold text-slate-100">{row.actualFormatted}</td>
              <td className="p-3 text-slate-400">{row.targetFormatted}</td>
              <td className={`p-3 font-semibold ${row.varianceFormatted.startsWith("+") ? "text-amber-400" : "text-emerald-400"}`}>
                {row.varianceFormatted}
              </td>
              <td className="p-3 text-center">
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${
                    row.status === "GOOD"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : row.status === "WARN"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="inline-flex items-center justify-center">
                  {row.trend === "UP" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : row.trend === "DOWN" ? (
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-slate-500" />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
