// MINE SMART AI - AI Maintenance Recommendations View & Work Order Conversion

import React, { useState } from "react";
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { PredictiveRecommendation } from "../../types/predictiveTypes";

interface AIRecommendationsViewProps {
  recommendations: PredictiveRecommendation[];
  onConvertRecommendation: (recId: string) => Promise<void>;
  onOpenAIAssistant: () => void;
}

export const AIRecommendationsView: React.FC<AIRecommendationsViewProps> = ({
  recommendations,
  onConvertRecommendation,
  onOpenAIAssistant,
}) => {
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleConvert = async (recId: string) => {
    setConvertingId(recId);
    try {
      await onConvertRecommendation(recId);
      setSuccessMessage("Rekomendasi AI berhasil dikonversi menjadi Work Order!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Gagal membuat Work Order: ${err.message}`);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wrench className="h-5 w-5 text-emerald-500" />
            <span>AI Maintenance Recommendation Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rekomendasi pemeliharaan preskriptif berbasis data AI untuk mencegah failure dan mengoptimalkan siklus pemeliharaan unit tambang.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Generate New AI Recommendations</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Workflow Rule Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 flex items-center gap-2 font-medium">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>
          <strong>AI Safety Workflow Rule:</strong> AI tidak dapat langsung menyelesaikan maintenance secara otomatis. Setiap rekomendasi harus disetujui supervisor dan dikonversi menjadi Work Order terverifikasi.
        </span>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4 hover:border-emerald-500/40 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-black text-sm">
                  {rec.unitCode}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {rec.unitCode} • {rec.category}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Type: <span className="font-bold text-emerald-500">{rec.recommendationType}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Status: <strong className="text-emerald-500">{rec.status}</strong>
                </span>

                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                    rec.priority === "Critical Action"
                      ? "bg-rose-500/20 text-rose-500"
                      : rec.priority === "Urgent Maintenance"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-amber-500/20 text-amber-500"
                  }`}
                >
                  {rec.priority}
                </span>
              </div>
            </div>

            {/* AI Structured Breakdown: Problem -> Evidence -> Risk -> Recommendation -> Timing -> Inspection -> Parts -> Impact */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">PROBLEM</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{rec.problem}</p>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">EVIDENCE & DATA</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{rec.evidence}</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 space-y-2">
                <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">AI PRESCRIPTIVE RECOMMENDATION</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{rec.recommendation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">SUGGESTED TIMING</p>
                  <p className="font-semibold text-amber-500 mt-0.5">{rec.suggestedTiming}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">REQUIRED INSPECTION</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{rec.requiredInspection}</p>
                </div>
              </div>

              {/* Potential Parts */}
              {rec.potentialParts.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40 space-y-1.5">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">POTENTIAL REQUIRED SPARE PARTS</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.potentialParts.map((part, pIdx) => (
                      <span
                        key={pIdx}
                        className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        {part.partName} ({part.partNumber}) x{part.estimatedQty} — Rp {part.estimatedCostIDR.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expected Impact */}
              <div className="rounded-xl bg-slate-900 p-3 dark:bg-slate-950 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">EXPECTED IMPACT</span>
                  <span className="text-xs font-semibold text-emerald-400">{rec.expectedImpact}</span>
                </div>

                {rec.status === "Converted to Work Order" ? (
                  <span className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    WO: {rec.convertedWorkOrderId}
                  </span>
                ) : (
                  <button
                    onClick={() => handleConvert(rec.id)}
                    disabled={convertingId === rec.id}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-extrabold text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{convertingId === rec.id ? "Converting..." : "Create Work Order"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
