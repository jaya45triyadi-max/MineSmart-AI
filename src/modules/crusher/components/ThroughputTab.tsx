import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { ProcessingPlant, ProcessingTarget } from "../../../types/processingPlantTypes";

interface ThroughputTabProps {
  plants: ProcessingPlant[];
  targets: ProcessingTarget[];
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const ThroughputTab: React.FC<ThroughputTabProps> = ({
  plants,
  targets,
  onOpenAiAnalysis,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<"t/h" | "ton/day" | "ton/shift">("t/h");
  const [selectedPeriod, setSelectedPeriod] = useState<"Hourly" | "Shift" | "Daily" | "Weekly">("Daily");

  const hourlyData = [
    { hour: "06:00", actual: 1280, target: 1350, forecast: 1300 },
    { hour: "07:00", actual: 1340, target: 1350, forecast: 1350 },
    { hour: "08:00", actual: 1410, target: 1350, forecast: 1380 },
    { hour: "09:00", actual: 1325, target: 1350, forecast: 1340 },
    { hour: "10:00", actual: 1390, target: 1350, forecast: 1360 },
    { hour: "11:00", actual: 1310, target: 1350, forecast: 1320 },
    { hour: "12:00", actual: 1250, target: 1350, forecast: 1280 },
    { hour: "13:00", actual: 1380, target: 1350, forecast: 1370 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Unit Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Throughput & Processing Production Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formula: Throughput = Processed Material / Operating Time (configurable units: t/h, ton/day, ton/shift)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Configurable Unit Toggle */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {(["t/h", "ton/day", "ton/shift"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedUnit === unit
                    ? "bg-white dark:bg-[#111A2C] text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenAiAnalysis("Buatkan rekomendasi peningkatan throughput crusher 01 sampai 1,400 t/h")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Throughput Forecast AI
          </button>
        </div>
      </div>

      {/* Throughput Target vs Actual Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plants.map((plant) => {
          const currentVal =
            selectedUnit === "t/h"
              ? plant.currentThroughput
              : selectedUnit === "ton/day"
              ? plant.currentThroughput * 18.5
              : plant.currentThroughput * 9.2;

          const targetVal =
            selectedUnit === "t/h"
              ? plant.designCapacity
              : selectedUnit === "ton/day"
              ? plant.designCapacity * 20
              : plant.designCapacity * 10;

          const achievementPercent = Math.round((currentVal / (targetVal || 1)) * 100);

          return (
            <div
              key={plant.id}
              className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {plant.plantCode} • {plant.plantName}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedUnit}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400">Actual Throughput</span>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {Math.round(currentVal).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">{selectedUnit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Target</span>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {Math.round(targetVal).toLocaleString()} {selectedUnit}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Achievement Rate</span>
                  <span className={achievementPercent >= 90 ? "text-emerald-500" : "text-amber-500"}>
                    {achievementPercent}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      achievementPercent >= 90 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(achievementPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly & Shift Throughput Chart Representation */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Hourly Throughput Trend — Target vs Actual vs AI Forecast
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitored every 60 minutes across primary crushing lines
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["Hourly", "Shift", "Daily", "Weekly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  selectedPeriod === p
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="space-y-3 pt-2">
          {hourlyData.map((item) => {
            const maxVal = 1600;
            const actualPct = (item.actual / maxVal) * 100;
            const targetPct = (item.target / maxVal) * 100;
            const variance = item.actual - item.target;

            return (
              <div key={item.hour} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-16">
                    {item.hour}
                  </span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      Actual: {item.actual} t/h
                    </span>
                    <span className="text-slate-400">Target: {item.target} t/h</span>
                    <span
                      className={`font-semibold flex items-center gap-0.5 ${
                        variance >= 0 ? "text-emerald-500" : "text-amber-500"
                      }`}
                    >
                      {variance >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />)}
                      {variance >= 0 ? `+${variance}` : variance} t/h
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full relative overflow-hidden flex items-center">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${actualPct}%` }}
                  />
                  {/* Target Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                    style={{ left: `${targetPct}%` }}
                    title={`Target: ${item.target} t/h`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
