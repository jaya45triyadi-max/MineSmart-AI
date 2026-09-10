import React from "react";
import {
  Sparkles,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Layers,
  TrendingUp,
} from "lucide-react";
import { AIQualityInsight } from "../../../types/laboratoryTypes";

interface AIQualityInsightTabProps {
  insights: AIQualityInsight[];
}

export const AIQualityInsightTab: React.FC<AIQualityInsightTabProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> AI Quality Intelligence & Blending Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekomendasi AI transparan berbasis bukti data nyata (no ungrounded claim): deteksi anomali, formulasi resep blending presisi, dan prediksi kelembaban.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.timestamp} • Category: {item.category}</p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 w-fit">
                AI Confidence: {item.confidence}%
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {item.summary}
            </p>

            {/* Evidence Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-500" /> Grounded Data Evidence
              </h4>
              <p>• <strong>Samples Analyzed:</strong> {item.evidence.samplesAnalyzed} laboratory samples ({item.evidence.dateRange})</p>
              <p>• <strong>Key Parameters:</strong> {item.evidence.keyParameters.join(", ")}</p>
              <p>• <strong>Data Sources:</strong> {item.evidence.dataSources.join(", ")}</p>
            </div>

            {/* Root Cause & Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">Root Cause Identification</span>
                <p className="text-slate-700 dark:text-slate-300">{item.rootCause}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
                <span className="font-bold text-blue-700 dark:text-blue-400 block">Estimasi Dampak Bisnis / Finansial</span>
                <p className="text-slate-700 dark:text-slate-300">{item.businessImpact}</p>
              </div>
            </div>

            {/* Recommendation & Action */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> AI Prescriptive Action
              </h4>
              <p><strong>Rekomendasi:</strong> {item.recommendation}</p>
              <p><strong>Tindakan Sistem:</strong> {item.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
