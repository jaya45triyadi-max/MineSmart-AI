import React from "react";
import {
  Sprout,
  Trees,
  Mountain,
  Ruler,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ReclamationKPISummary,
  DisturbedArea,
  ReclamationProject,
  ReclamationAIInsight,
} from "../../../types/reclamationTypes";

interface Props {
  kpi: ReclamationKPISummary | null;
  disturbedAreas: DisturbedArea[];
  projects: ReclamationProject[];
  aiInsights: ReclamationAIInsight[];
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const ReclamationCommandCenterTab: React.FC<Props> = ({
  kpi,
  disturbedAreas,
  projects,
  aiInsights,
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  if (!kpi) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Disturbed Area */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Disturbed Area</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Mountain className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{kpi.totalDisturbedAreaHa}</span>
            <span className="text-xs font-bold text-slate-400">Hectare (ha)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Mining: <strong className="text-slate-200">{kpi.activeMiningAreaHa} ha</strong></span>
            <span>Ready: <strong className="text-emerald-400">{kpi.areaReadyForReclamationHa} ha</strong></span>
          </div>
        </div>

        {/* Card 2: Reclaimed & Revegetated */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Area Reclaimed & Revegetated</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Trees className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{kpi.areaRevegetatedHa}</span>
            <span className="text-xs font-bold text-slate-400">ha ({kpi.reclamationProgressPercent}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Target 2026: <strong className="text-slate-200">{kpi.targetAreaYearHa} ha</strong></span>
            <span className="text-emerald-400 font-bold">Surv. Rate {kpi.survivalRatePercent}%</span>
          </div>
        </div>

        {/* Card 3: Planting & Reclamation Progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Planting Progress</span>
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <Sprout className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">{kpi.plantingProgressPercent}%</span>
            <span className="text-xs font-bold text-slate-400">Achieved</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${kpi.plantingProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 4: Cost per Hectare */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cost per Hectare</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-white">
              Rp {(kpi.costPerHectareIDR / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs font-bold text-slate-400">/ ha</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Opex: <strong className="text-slate-200">Rp {(kpi.totalReclamationCostIDR / 1000000000).toFixed(2)}B</strong></span>
            <span className="text-emerald-400 font-bold">In Budget</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Key Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab("monitoring")}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Monitoring Center (6 Pilar)</h4>
              <p className="text-xs text-slate-400">Area Disturbed, Area Reclaimed, Planting, Survival Rate, Location & Progress</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>

        <div
          onClick={() => onNavigateTab("spatial-evolution")}
          className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 hover:border-teal-400 transition cursor-pointer flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Spatial Evolution Map (4-Stage)</h4>
              <p className="text-xs text-slate-400">Time-Lapse: Before → Mining → Reclamation → Revegetation</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-teal-400 shrink-0" />
        </div>
      </div>

      {/* Main Grid: Projects & AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Overview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Trees className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Proyek Reklamasi & Revegetasi Lahan Tambang Aktif
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("planning")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {proj.projectId} • {proj.disturbedAreaName}
                    </span>
                    <h4 className="font-bold text-white text-xs mt-0.5">{proj.projectName}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                      proj.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">{proj.objective}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">Target Luas:</span>
                    <strong className="text-white">{proj.targetAreaHa} ha</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Realisasi:</span>
                    <strong className="text-emerald-400">{proj.reclaimedAreaHa} ha</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">PIC / Kontraktor:</span>
                    <strong className="text-slate-200 truncate block">{proj.contractorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Selesai:</span>
                    <strong className="text-slate-200">{proj.targetCompletionDate}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Advisory Panel */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                AI Reclamation Risk & Advisory
              </h3>
            </div>
            <button
              onClick={onOpenAIAssistant}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Bot className="h-3.5 w-3.5" /> Copilot
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-emerald-800/30 bg-slate-950 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{insight.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {insight.reclamationRisk}
                  </span>
                </div>

                <p className="text-slate-300"><strong className="text-emerald-400">Temuan:</strong> {insight.finding}</p>
                <p className="text-slate-400"><strong className="text-cyan-400">Saran AI:</strong> {insight.recommendation}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                  <span>Confidence: {insight.confidence}</span>
                  <span>Impact: {insight.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
