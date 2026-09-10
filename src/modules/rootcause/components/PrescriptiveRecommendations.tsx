import React, { useState } from "react";
import { PrescriptiveRecommendation } from "../../../types/rootCauseTypes";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Wrench,
  Truck,
  RotateCcw,
  ShieldAlert,
  Clock,
  UserCheck,
} from "lucide-react";

interface PrescriptiveRecommendationsProps {
  recommendations: PrescriptiveRecommendation[];
  onApplyRecommendation?: (recId: string) => void;
}

export const PrescriptiveRecommendations: React.FC<PrescriptiveRecommendationsProps> = ({
  recommendations: initialRecommendations,
  onApplyRecommendation,
}) => {
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleApply = (rec: PrescriptiveRecommendation) => {
    setAppliedMap((prev) => ({ ...prev, [rec.id]: true }));
    if (onApplyRecommendation) {
      onApplyRecommendation(rec.id);
    }
    setFeedbackMessage(`Perintah tindakan "${rec.title}" berhasil diteruskan ke FMS Dispatch & CMMS Maintenance!`);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI PRESCRIPTIVE RECOMMENDATIONS
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Tindakan Korektif & Mitigasi Cepat
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rekomendasi preskriptif berbantuan AI dengan proyeksi recovery output seketika.
            </p>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Response: &lt; 15 Menit</span>
          </div>
        </div>

        {/* Feedback alert on action */}
        {feedbackMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* List of Recommendations */}
        <div className="mt-5 space-y-4">
          {initialRecommendations.map((rec, idx) => {
            const isApplied = appliedMap[rec.id] || rec.isApplied;
            const isImmediate = rec.tier === "IMMEDIATE_DISPATCH";
            const isMaintenance = rec.tier === "MAINTENANCE_OVERHAUL";

            let tierBadge = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
            let tierIcon = Zap;
            if (isImmediate) {
              tierBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";
              tierIcon = Truck;
            } else if (isMaintenance) {
              tierBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30";
              tierIcon = Wrench;
            }
            const Icon = tierIcon;

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border transition-all ${
                  isApplied
                    ? "bg-slate-950/40 border-emerald-500/40 opacity-90"
                    : isImmediate
                    ? "bg-slate-950/80 border-amber-500/40 hover:border-amber-400"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${tierBadge}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierBadge}`}>
                          {rec.tier.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          PIC: {rec.actionOwner}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        {rec.actionText}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-emerald-400 font-bold text-xs">
                            +{rec.estimatedRecoveryPct}%
                          </span>{" "}
                          Estimated Recovery
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Timeframe: <strong className="text-slate-200">{rec.estimatedTimeframe}</strong>
                        </span>
                        <span className="text-cyan-300 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Target: {rec.targetEntity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Apply Button */}
                  <div className="sm:self-center shrink-0">
                    {isApplied ? (
                      <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Tindakan Diterapkan</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(rec)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-950 flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Eksekusi Tindakan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch & Maintenance Link */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <span>Sistem terhubung otomatis ke FMS Modular Dispatch & SAP PM / Komtrax.</span>
        <span className="text-emerald-400 font-semibold">Semua Rekomendasi Terverifikasi KTT / Mine Supt</span>
      </div>
    </div>
  );
};
