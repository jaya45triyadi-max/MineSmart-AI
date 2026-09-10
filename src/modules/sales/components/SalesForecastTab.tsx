import React from "react";
import { TrendingUp, BarChart3, Calendar, DollarSign, Box } from "lucide-react";
import { SalesForecastPoint } from "../../../types/salesTypes";

interface SalesForecastTabProps {
  forecast: SalesForecastPoint[];
}

export const SalesForecastTab: React.FC<SalesForecastTabProps> = ({ forecast }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Commercial Sales & Revenue Forecast
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Forward-looking projection of monthly contract sales, expected barge shipment schedules, and commercial cash flow realization.
        </p>
      </div>

      {/* Forecast Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Period</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Contracted Qty</th>
                <th className="p-3.5">Expected Shipment</th>
                <th className="p-3.5">Expected Revenue (USD)</th>
                <th className="p-3.5">Remaining Contract Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {forecast.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {pt.period}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        pt.forecastType === "ACTUAL"
                          ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {pt.forecastType}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {pt.contractedQty.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                    {pt.expectedShipmentQty.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    ${(pt.expectedRevenue / 1000000).toFixed(2)}M
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">
                    {pt.remainingContractQty.toLocaleString("id-ID")} MT
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
