// MINE SMART AI - Executive Summary & Operational Health Score Card

import React from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, Sparkles, Coins, ArrowRight } from "lucide-react";
import { ExecutiveSummaryData } from "../../../services/dashboard/DashboardAnalyticsService";
import { HealthScoreComponent } from "../../../services/dashboard/OperationalHealthScoreService";

interface ExecutiveSummaryCardProps {
  data: ExecutiveSummaryData;
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: string) => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  data,
  onOpenAICopilot,
  onNavigateModule,
}) => {
  const { healthScore, keyHighlights, riskWarnings, aiExecutiveRecommendation, financialMetrics } = data;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30" };
    if (score >= 70) return { text: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30" };
    return { text: "text-rose-400", bg: "bg-rose-500", border: "border-rose-500/30" };
  };

  const scoreTheme = getScoreColor(healthScore.totalScore);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Column: Operational Health Score Meter */}
        <div className="lg:w-1/3 flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Operational Health Score
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${scoreTheme.border} ${scoreTheme.text} bg-slate-900`}>
                {healthScore.rating}
              </span>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                <span className={`text-3xl font-black ${scoreTheme.text}`}>
                  {healthScore.totalScore}
                </span>
                <span className="text-[10px] text-slate-500 font-bold absolute bottom-1">/100</span>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200 leading-snug">
                  {healthScore.summary}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Kalkulasi berbobot multi-domain tambang (Produksi 30%, Fleet 20%, Cost 20%, HSE 15%, Fuel 10%, Stockpile 5%).
                </p>
              </div>
            </div>
          </div>

          {/* Component Sub-scores */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
            {Object.entries(healthScore.components).map(([key, compVal]) => {
              const comp = compVal as HealthScoreComponent;
              return (
                <div key={key} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[140px]">{comp.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${comp.score >= 80 ? "bg-emerald-400" : comp.score >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-200 w-7 text-right">{comp.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Key Highlights & Risk Warnings */}
        <div className="lg:w-1/3 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Ringkasan Pencapaian Utama</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {keyHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Potensi Risiko Operasional</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {riskWarnings.map((rw, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{rw}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: AI Executive Recommendation & Financial Metric */}
        <div className="lg:w-1/3 flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-slate-950 p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                Rekomendasi AI Direksi
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              "{aiExecutiveRecommendation}"
            </p>
          </div>

          {/* Financial Overview Card */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-amber-400" />
                <span>Est. Nilai Produksi Batu Bara</span>
              </span>
              <span className="font-bold text-amber-300">
                Rp {(financialMetrics.estimatedCoalValueIDR / 1000000000).toFixed(2)} M
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Est. Operating EBITDA Margin</span>
              <span className="font-bold text-emerald-400">{financialMetrics.marginPct}%</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onOpenAICopilot}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Diskusi dengan AI</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
