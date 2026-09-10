import React from "react";
import { RootCauseCase } from "../../../types/rootCauseTypes";
import {
  AlertOctagon,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  MapPin,
  Share2,
  Download,
} from "lucide-react";

interface RootCauseSummaryCardProps {
  activeCase: RootCauseCase;
  onExportReport?: () => void;
}

export const RootCauseSummaryCard: React.FC<RootCauseSummaryCardProps> = ({
  activeCase,
  onExportReport,
}) => {
  const isPositiveDrop = activeCase.primaryMetric.dropPct > 0;
  const isProdDrop = activeCase.anomalyCategory === "PRODUCTION_DROP";

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                {activeCase.code}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {activeCase.pitLocation}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {activeCase.title}
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onExportReport && (
            <button
              onClick={onExportReport}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export RCA Dossier
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Left: Primary Metric Anomaly & Impact */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Trigger Anomaly
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-white">
                {activeCase.primaryMetric.actual}
              </span>
              <span className="text-xs text-slate-400">
                / Target {activeCase.primaryMetric.target}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 mb-3">
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  isProdDrop
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {isProdDrop ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                <span>
                  {activeCase.primaryMetric.dropPct > 0 ? "+" : ""}
                  {activeCase.primaryMetric.dropPct.toFixed(1)}% Deficit
                </span>
              </div>
              <span className="text-xs text-slate-400">vs Shift Baseline</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">
              Impact Loss Value
            </span>
            <p className="text-xs font-bold text-amber-400 mt-0.5">
              {activeCase.primaryMetric.impactLossVal}
            </p>
          </div>
        </div>

        {/* Middle & Right: ROOT CAUSE FINDING (USP Highlight) */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl p-5 border border-amber-500/30 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ROOT CAUSE VERDICT (AI CONFIDENCE: {activeCase.rootCauseSummary.confidencePct}%)
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Diagnosed in 1.8s
              </span>
            </div>

            {/* Core Root Cause Headline (Matching User Prompt Specification) */}
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-2 text-rose-200">
              {activeCase.rootCauseSummary.headline}
            </h3>

            <div className="mt-3 p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-1">
                Primary Causal Factor:
              </span>
              <p className="text-xs text-slate-200 font-semibold">
                {activeCase.rootCauseSummary.primaryFactor}
              </p>
            </div>
          </div>

          {/* Causal Chain Traversal String */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Multi-Dimensional Causal Propagation Chain:
            </span>
            <p className="text-xs font-mono text-cyan-300/90 leading-relaxed bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
              {activeCase.rootCauseSummary.causalChainSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
