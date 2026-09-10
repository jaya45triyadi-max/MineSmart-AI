import React from "react";
import { ContributionFactor } from "../../../types/rootCauseTypes";
import {
  PieChart,
  Layers,
  AlertTriangle,
  Flame,
  Truck,
  Pickaxe,
  Wrench,
  Percent,
  CheckCircle,
} from "lucide-react";

interface ContributionWaterfallProps {
  contributions: ContributionFactor[];
  totalDropLabel?: string;
}

export const ContributionWaterfall: React.FC<ContributionWaterfallProps> = ({
  contributions,
  totalDropLabel = "Penurunan Produksi",
}) => {
  // Compute top 2 combined percentage
  const top2Sum = contributions.slice(0, 2).reduce((acc, curr) => acc + curr.contributionPct, 0);
  const top2Names = contributions
    .slice(0, 2)
    .map((c) => c.entityCode.split(" ")[0])
    .join(" dan ");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <Percent className="w-3 h-3" />
                CONTRIBUTION BREAKDOWN (PARETO DECOMPOSITION)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Akar Kontribusi Defisit Produksi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dekomposisi kuantitatif dampak anomali terhadap total kehilangan volume/ritase.
            </p>
          </div>

          {/* Highlight Badge (Direct user prompt match: 64% penurunan dari EX-03 & EX-05) */}
          <div className="bg-gradient-to-r from-rose-950/80 to-amber-950/80 border border-rose-500/40 rounded-xl p-3 text-right">
            <span className="text-[10px] text-slate-300 font-semibold uppercase block">
              Dominant Impact Cluster:
            </span>
            <span className="text-sm sm:text-base font-black text-rose-300">
              {top2Sum.toFixed(0)}% {totalDropLabel}
            </span>
            <span className="text-xs text-amber-300 block font-medium">
              Berasal dari {top2Names}
            </span>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="mt-5 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Cumulative Anomaly Attribution (100%)</span>
            <span className="text-amber-400 font-bold">Top 2 Entities: {top2Sum.toFixed(1)}%</span>
          </div>
          <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
            {contributions.map((item, idx) => {
              const colors = [
                "bg-rose-500",
                "bg-rose-600",
                "bg-amber-500",
                "bg-cyan-500",
                "bg-slate-600",
              ];
              const color = colors[idx % colors.length];
              return (
                <div
                  key={idx}
                  style={{ width: `${item.contributionPct}%` }}
                  title={`${item.entityCode}: ${item.contributionPct}%`}
                  className={`${color} h-full rounded-sm transition-all duration-500 hover:brightness-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* List of Contribution Factors */}
        <div className="space-y-3">
          {contributions.map((item, index) => {
            const isDominant = index < 2;

            return (
              <div
                key={index}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDominant
                    ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-400"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isDominant
                          ? "bg-rose-500 text-white shadow-md shadow-rose-900"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {item.entityCode}
                        </h4>
                        {item.subSystem && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {item.subSystem}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Mode Kegagalan: <span className="text-slate-300 font-medium">{item.failureMode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Percentage & Loss metric */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm sm:text-base font-black ${
                        isDominant ? "text-rose-400" : "text-amber-400"
                      }`}
                    >
                      {item.contributionPct.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      -{item.lostVolumeTonsOrBcm} BCM/Ton lost
                    </span>
                  </div>
                </div>

                {/* Progress bar per item */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isDominant ? "bg-rose-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${item.contributionPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Cross-validated with FMS Telemetry & Fuel Log
        </span>
        <span className="text-slate-500">Algorithm: Multi-Variant Bayesian RCA</span>
      </div>
    </div>
  );
};
