// MINE SMART AI - Model Performance & Versioning Center View

import React from "react";
import {
  BrainCircuit,
  Cpu,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  CheckSquare,
} from "lucide-react";
import { PredictiveModelItem } from "../../types/predictiveTypes";

interface ModelPerformanceViewProps {
  models: PredictiveModelItem[];
  onOpenAIAssistant: () => void;
}

export const ModelPerformanceView: React.FC<ModelPerformanceViewProps> = ({
  models,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-emerald-500" />
            <span>AI Predictive Model Performance & Versioning Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manajemen siklus hidup model AI (Draft, Testing, Validated, Production, Retired), fitur masukan, dan metrik akurasi.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Audit Versi Model</span>
        </button>
      </div>

      {/* Model Cards */}
      <div className="space-y-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{model.modelName}</h3>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">
                    {model.version}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{model.description}</p>
              </div>

              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                  model.lifecycleStatus === "Production"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : model.lifecycleStatus === "Validated"
                    ? "bg-indigo-500/20 text-indigo-500"
                    : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {model.lifecycleStatus}
              </span>
            </div>

            {/* Performance Metrics or "Evaluation Not Available" */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
              {model.isGroundTruthEvaluated ? (
                <>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ACCURACY</span>
                    <span className="text-base font-black text-emerald-500">{((model.accuracy || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PRECISION</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{((model.precision || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">RECALL</span>
                    <span className="text-base font-black text-indigo-500">{((model.recall || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">F1 SCORE</span>
                    <span className="text-base font-black text-purple-500">{((model.f1Score || 0) * 100).toFixed(1)}%</span>
                  </div>
                </>
              ) : (
                <div className="col-span-4 p-2 text-center text-slate-400 italic font-semibold">
                  Evaluation Not Available (Ground-truth dataset pending verification)
                </div>
              )}
            </div>

            {/* Input Features */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Input Features:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {model.inputFeatures.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
