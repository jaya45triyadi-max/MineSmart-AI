// MINE SMART AI - Downtime Prediction Center View

import React from "react";
import {
  Clock,
  AlertTriangle,
  TrendingDown,
  Coins,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import { DowntimePrediction } from "../../types/predictiveTypes";

interface DowntimePredictionViewProps {
  downtimePredictions: DowntimePrediction[];
  onOpenAIAssistant: () => void;
}

export const DowntimePredictionView: React.FC<DowntimePredictionViewProps> = ({
  downtimePredictions,
  onOpenAIAssistant,
}) => {
  const totalDowntimeHours = downtimePredictions.reduce((acc, d) => acc + d.potentialDowntimeHours, 0);
  const totalCostImpact = downtimePredictions.reduce((acc, d) => acc + d.potentialCostImpactIDR, 0);
  const totalOBLoss = downtimePredictions.reduce((acc, d) => acc + d.potentialProductionImpactBCM, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>Downtime Prediction Center & Potential Operational Impact</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Prediksi estimasi durasi downtime dan dampaknya terhadap volume produksi tambang dan estimasi biaya operasional.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 px-3.5 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Dampak Downtime</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Potential Downtime</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalDowntimeHours} <span className="text-xs text-slate-400 font-normal">Hours</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Across all high-risk units in pipeline</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Potential Production Loss</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{totalOBLoss.toLocaleString()} <span className="text-xs text-slate-400 font-normal">BCM OB</span></p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Estimated volume reduction</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Potential Cost Impact</p>
          <p className="text-2xl font-black text-rose-500 mt-1">Rp {(totalCostImpact / 1000000).toFixed(0)} <span className="text-xs text-slate-400 font-normal">Juta</span></p>
          <p className="text-[10px] text-rose-500 mt-1">Unplanned repair & delay cost</p>
        </div>
      </div>

      {/* Label Notice Banner */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          Semua estimasi produksi dan finansial berlabel <strong>Potential Impact</strong> karena downtime belum menjadi kehilangan aktual.
        </span>
      </div>

      {/* Downtime Prediction Cards */}
      <div className="space-y-4">
        {downtimePredictions.map((dp) => (
          <div
            key={dp.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 font-black text-sm">
                  {dp.unitCode}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {dp.unitCode} ({dp.category})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cause: <span className="font-semibold text-slate-700 dark:text-slate-300">{dp.possibleCause}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{dp.predictionWindow}</span>
                </span>

                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                    dp.downtimeRisk === "Critical"
                      ? "bg-rose-500/20 text-rose-500"
                      : dp.downtimeRisk === "High"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-amber-500/20 text-amber-500"
                  }`}
                >
                  {dp.downtimeRisk} DOWNTIME RISK
                </span>
              </div>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">EST. DOWNTIME</p>
                <p className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5">{dp.potentialDowntimeHours} Hours</p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">POTENTIAL COAL IMPACT</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{dp.potentialProductionImpactMT} MT</p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">POTENTIAL OB IMPACT</p>
                <p className="text-base font-black text-amber-500 mt-0.5">{dp.potentialProductionImpactBCM.toLocaleString()} BCM</p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">POTENTIAL COST IMPACT</p>
                <p className="text-base font-black text-rose-500 mt-0.5">Rp {(dp.potentialCostImpactIDR / 1000000).toFixed(1)}M</p>
              </div>
            </div>

            {/* Evidence & Confidence */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                <span className="font-bold">Evidence: </span>{dp.evidence}
              </p>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400">Confidence: </span>
                <span className="font-bold text-emerald-500">{dp.confidencePercent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
