import React, { useState } from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, Calendar, ShieldAlert, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StockForecast, Stockpile } from "../../../types/stockpileTypes";

interface StockpileForecastTabProps {
  forecasts: StockForecast[];
  stockpiles: Stockpile[];
}

export const StockpileForecastTab: React.FC<StockpileForecastTabProps> = ({ forecasts, stockpiles }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7 Days");

  const filteredForecasts = forecasts.filter((f) => f.period === selectedPeriod);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Stockpile Inventory Projections & Capacity Forecast
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Proyeksi neraca persediaan batubara (1 Hari, 7 Hari, 30 Hari, Bulanan) berbasis rate hauling tambang, crushing speed, dan jadwal tongkang port.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["1 Day", "7 Days", "30 Days", "Monthly"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                selectedPeriod === period
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredForecasts.map((fc) => {
          const isOverflow = fc.potentialOverflow > 0 || fc.capacityUtilization > 100;

          return (
            <div
              key={fc.id}
              className={`rounded-2xl border p-6 transition-all ${
                isOverflow
                  ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10 shadow-lg shadow-red-500/5"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    Proyeksi {fc.period}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                    {fc.stockpileName}
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    fc.confidence === "HIGH"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  Kepercayaan AI: {fc.confidence}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-slate-400">Stok Saat Ini:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {fc.currentStock.toLocaleString()} Ton
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-slate-400">Estimasi Stok Akhir:</span>
                  <p className="font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                    {fc.expectedClosingStock.toLocaleString()} Ton
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-slate-400">Estimasi Masuk (+):</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{fc.expectedIncoming.toLocaleString()} Ton
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-slate-400">Estimasi Keluar (-):</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    -{fc.expectedOutgoing.toLocaleString()} Ton
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Proyeksi Utilasi Kapasitas:</span>
                  <span className={`font-black ${fc.capacityUtilization > 100 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                    {fc.capacityUtilization}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      fc.capacityUtilization > 100
                        ? "bg-red-500"
                        : fc.capacityUtilization > 85
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, fc.capacityUtilization)}%` }}
                  />
                </div>
              </div>

              {isOverflow && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    PERINGATAN OVERFLOW! Potensi kelebihan {fc.potentialOverflow.toLocaleString()} Ton melampaui batas max.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
