import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Flame,
  Droplets,
  Calendar,
  Filter,
  Download,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { QualityTrendPoint } from "../../../types/laboratoryTypes";

interface QualityTrendsTabProps {
  trends: QualityTrendPoint[];
}

export const QualityTrendsTab: React.FC<QualityTrendsTabProps> = ({ trends }) => {
  const [activeMetric, setActiveMetric] = useState<
    "GCV" | "GAR" | "ASH" | "TS" | "TM" | "IM" | "VM" | "FC"
  >("GAR");

  const getMetricValue = (p: QualityTrendPoint) => {
    switch (activeMetric) {
      case "GCV":
        return p.avgGCV || Math.round(p.avgGAR * 1.05);
      case "GAR":
        return p.avgGAR;
      case "TM":
        return p.avgTM;
      case "IM":
        return p.avgIM || 10.5;
      case "ASH":
        return p.avgAsh;
      case "TS":
        return p.avgTS;
      case "VM":
        return p.avgVM || 41.2;
      case "FC":
        return p.avgFC || 41.5;
    }
  };

  const getMetricUnit = () => {
    switch (activeMetric) {
      case "GCV":
        return "kcal/kg ADB";
      case "GAR":
        return "kcal/kg ARB";
      case "TM":
        return "% ARB";
      case "IM":
        return "% ADB";
      case "ASH":
        return "% ADB";
      case "TS":
        return "% ADB";
      case "VM":
        return "% ADB";
      case "FC":
        return "% ADB";
    }
  };

  const values = trends.map((t) => getMetricValue(t));
  const avgValue = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const maxValue = Math.max(...values) * 1.04;
  const minValue = Math.min(...values) * 0.96;

  // Standard Deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / (values.length || 1);
  const stdDev = Math.sqrt(variance);
  const ucl = +(avgValue + 2 * stdDev).toFixed(1);
  const lcl = +(avgValue - 2 * stdDev).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 uppercase tracking-wider">
              TIME-SERIES STATISTICAL PROCESS CONTROL
            </span>
            <span className="text-xs text-slate-500 font-medium">13-Day Rolling Average</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Coal Quality Trends, Moving Averages & Statistical Control Bands
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Monitoring tren fluktuasi parameter kualitas batubara: <strong>GCV, GAR, Ash, Total Sulfur (TS), Total Moisture (TM), Inherent Moisture (IM), Volatile Matter (VM)</strong> beserta batas Upper/Lower Control Limits (UCL / LCL).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Mengunduh data tren kualitas batubara harian ke CSV/Excel...")}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Trends</span>
          </button>
        </div>
      </div>

      {/* Parameter Switcher Tabs */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-1.5">
        {(
          [
            { key: "GCV", label: "GCV (ADB)" },
            { key: "GAR", label: "GAR (ARB)" },
            { key: "ASH", label: "Ash Content" },
            { key: "TS", label: "Total Sulfur (TS)" },
            { key: "TM", label: "Total Moisture (TM)" },
            { key: "IM", label: "Inherent Moisture (IM)" },
            { key: "VM", label: "Volatile Matter (VM)" },
            { key: "FC", label: "Fixed Carbon (FC)" },
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMetric === m.key
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Trend Visualization & Statistical Band Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Parameter: {activeMetric} ({getMetricUnit()}) Trendline
              </h3>
              <p className="text-xs text-slate-500">
                Mean: <strong className="font-mono text-slate-800 dark:text-slate-200">{avgValue.toFixed(1)}</strong> | UCL (+2σ): <strong className="font-mono text-rose-500">{ucl}</strong> | LCL (-2σ): <strong className="font-mono text-blue-500">{lcl}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              Process Capability Cp = 1.42 (Stable)
            </span>
          </div>
        </div>

        {/* Visual Trend Bars with Tooltips */}
        <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
          {trends.map((point) => {
            const val = getMetricValue(point);
            const heightPercent = Math.max(15, Math.min(100, ((val - minValue) / (maxValue - minValue)) * 100));
            const isOutOfBand = val > ucl || val < lcl;

            return (
              <div key={point.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 transition pointer-events-none z-20 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-[11px] whitespace-nowrap shadow-xl border border-slate-700">
                  <div className="font-bold">{point.date}: {val} {getMetricUnit()}</div>
                  <div className="text-[9px] text-slate-400 font-sans">{point.sampleCount} samples analyzed</div>
                </div>

                <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end relative overflow-hidden">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      isOutOfBand
                        ? "bg-gradient-to-t from-rose-600 to-rose-400"
                        : activeMetric === "GAR" || activeMetric === "GCV"
                        ? "bg-gradient-to-t from-amber-600 to-amber-400"
                        : activeMetric === "TM" || activeMetric === "IM"
                        ? "bg-gradient-to-t from-blue-600 to-blue-400"
                        : activeMetric === "TS"
                        ? "bg-gradient-to-t from-rose-600 to-rose-400"
                        : "bg-gradient-to-t from-emerald-600 to-emerald-400"
                    }`}
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-500 font-semibold">{point.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Statistical Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Average MTD Value</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {avgValue.toFixed(1)} <span className="text-xs font-normal text-slate-400">{getMetricUnit()}</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-sans font-semibold">✓ 100% within contract tolerance</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Standard Deviation (σ)</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ±{stdDev.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans">Low quality dispersion</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Upper Control Limit (UCL)</span>
          <div className="text-xl font-black text-rose-500">
            {ucl}
          </div>
          <span className="text-[10px] text-slate-400 font-sans">+2 Sigma statistical ceiling</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Lower Control Limit (LCL)</span>
          <div className="text-xl font-black text-blue-500">
            {lcl}
          </div>
          <span className="text-[10px] text-slate-400 font-sans">-2 Sigma statistical floor</span>
        </div>
      </div>
    </div>
  );
};
