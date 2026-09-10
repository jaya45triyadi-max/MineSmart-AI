// MINE SMART AI - Production Performance & Trend Widget

import React, { useState } from "react";
import { Pickaxe, TrendingUp, Layers, ArrowRight, BarChart3, LineChart } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ProductionKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface ProductionWidgetProps {
  data: ProductionKPIData;
  onNavigateModule: (moduleKey: string) => void;
}

export const ProductionWidget: React.FC<ProductionWidgetProps> = ({ data, onNavigateModule }) => {
  const [chartType, setChartType] = useState<"HOURLY" | "DAILY">("HOURLY");

  return (
    <div className="space-y-4">
      {/* Target vs Actual Header Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Coal Production</div>
          <div className="text-lg sm:text-xl font-black text-white mt-1">
            {data.coalActualTon.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-slate-400">Ton</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Target: {data.coalTargetTon.toLocaleString("id-ID")} Ton
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Pencapaian Target</div>
          <div
            className={`text-lg sm:text-xl font-black mt-1 ${
              data.coalAchievementPct >= 100
                ? "text-emerald-400"
                : data.coalAchievementPct >= 90
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {data.coalAchievementPct}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Deviasi: {data.coalVarianceTon > 0 ? "+" : ""}
            {data.coalVarianceTon.toLocaleString("id-ID")} Ton
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Overburden (OB)</div>
          <div className="text-lg sm:text-xl font-black text-white mt-1">
            {data.obActualBCM.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-slate-400">BCM</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Target: {data.obTargetBCM.toLocaleString("id-ID")} BCM ({data.obAchievementPct}%)
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Strip Ratio (SR)</div>
          <div className="text-lg sm:text-xl font-black text-amber-300 mt-1">
            {data.stripRatioActual}{" "}
            <span className="text-xs font-normal text-slate-400">BCM/Ton</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Plan: {data.stripRatioPlan} BCM/Ton</div>
        </div>
      </div>

      {/* Chart Selector Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Pickaxe className="h-3.5 w-3.5 text-emerald-400" />
          <span>Grafik Tren Produksi per Jam Shift</span>
        </span>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setChartType("HOURLY")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              chartType === "HOURLY" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Jam Shift
          </button>
          <button
            onClick={() => setChartType("DAILY")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              chartType === "DAILY" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Mingguan
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "HOURLY" ? (
            <AreaChart data={data.hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCoal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area type="monotone" dataKey="coalActual" name="Batu Bara (Ton)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCoal)" />
              <Area type="monotone" dataKey="obActual" name="Overburden (BCM)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorOB)" />
            </AreaChart>
          ) : (
            <BarChart data={data.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="coal" name="Aktual Coal (Ton)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target Coal (Ton)" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Drill-Down Footer */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => onNavigateModule("production")}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Buka Modul Produksi Detail</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
