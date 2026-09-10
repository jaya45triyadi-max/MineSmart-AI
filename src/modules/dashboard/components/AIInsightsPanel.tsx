// MINE SMART AI - AI Insights Panel Component

import React from "react";
import { Sparkles, Bot, AlertTriangle, ArrowRight, CheckCircle2, Lock, Lightbulb } from "lucide-react";
import { AIInsightItem } from "../../../services/dashboard/DashboardAnalyticsService";

interface AIInsightsPanelProps {
  insights: AIInsightItem[];
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: string) => void;
  licensePlan?: string;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onOpenAICopilot,
  onNavigateModule,
  licensePlan = "ENTERPRISE",
}) => {
  const getPriorityStyle = (priority: AIInsightItem["priority"]) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "MEDIUM":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "LOW":
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-3">
      {/* License Plan Banner if Starter/Trial */}
      {licensePlan === "STARTER" && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-400" />
            <span className="text-slate-200">Rekomendasi AI Preskriptif Lanjutan terkunci pada paket Starter.</span>
          </div>
          <button
            onClick={() => onNavigateModule("license")}
            className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {insights.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-slate-700 transition-all space-y-2.5"
        >
          {/* Header Tag Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-extrabold uppercase ${getPriorityStyle(item.priority)}`}>
                {item.priority}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Akurasi {item.confidenceScore}%</span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h4 className="text-sm font-black text-white">{item.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
          </div>

          {/* Potential Causes List */}
          {item.potentialCauses.length > 0 && (
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block mb-1">Akar Penyebab Potensial (AI Root Cause):</span>
              <ul className="space-y-1 text-slate-300">
                {item.potentialCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation & Estimated Impact */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="text-xs">
              <span className="text-emerald-400 font-bold">Estimasi Dampak: </span>
              <span className="text-slate-200 font-semibold">{item.estimatedImpact}</span>
            </div>

            <div className="flex items-center gap-2">
              {item.actionModuleKey && (
                <button
                  onClick={() => onNavigateModule(item.actionModuleKey!)}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  Buka Modul
                </button>
              )}

              <button
                onClick={onOpenAICopilot}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/20"
              >
                <span>Analisis AI</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
