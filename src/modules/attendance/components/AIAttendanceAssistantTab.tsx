import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  AIAttendanceAnalysis,
  AttendanceRiskSignal,
} from "../../../types/attendanceTypes";
import { attendanceRepository } from "../../../services/repositories/AttendanceRepository";

interface Props {
  riskSignals: AttendanceRiskSignal[];
}

export const AIAttendanceAssistantTab: React.FC<Props> = ({ riskSignals }) => {
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAttendanceAnalysis | null>(null);

  const presetQueries = [
    "Berapa attendance hari ini?",
    "Berapa orang terlambat?",
    "Departemen mana yang attendance-nya paling rendah?",
    "Berapa overtime dari attendance hari ini?",
    "Apakah ada shift kekurangan manpower?",
  ];

  const handleRunQuery = async (queryText: string) => {
    setPromptInput(queryText);
    setLoading(true);
    const result = await attendanceRepository.queryAIAssistant(queryText);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            AI COMMAND CENTER — ATTENDANCE INTELLIGENCE
          </span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Asisten AI Presensi & Deteksi Fraud/Anomali Tambang</h2>
        <p className="text-xs text-slate-400">
          Tanyakan performa presensi harian atau analisis pola indikator risiko presensi dengan kecerdasan buatan Gemini.
        </p>
      </div>

      {/* Preset Chip Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Contoh Pertanyaan:
        </span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleRunQuery(pq)}
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Prompt Search Box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ketik pertanyaan presensi..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 pl-4 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => handleRunQuery(promptInput)}
          disabled={loading || !promptInput}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{loading ? "Analisis..." : "Tanyakan AI"}</span>
        </button>
      </div>

      {/* AI Analysis Result Display */}
      {analysis && (
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white">Hasil Analisis Asisten AI</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Confidence: {analysis.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">FINDING (Temuan Utama)</span>
              <p className="text-sm font-bold text-white">{analysis.finding}</p>
              <p className="text-slate-400 pt-1">{analysis.evidence}</p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">POSSIBLE CAUSE (Dugaan Penyebab)</span>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {analysis.possibleCauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1 md:col-span-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">RECOMMENDATION & IMPACT</span>
              <p className="text-emerald-200 font-medium">{analysis.recommendation}</p>
              <p className="text-[11px] text-slate-400 mt-1">Estimasi Dampak: {analysis.expectedImpact}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Anomaly & Fraud Risk Signals Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Deteksi Anomali & Indikator Risiko Presensi (Risk Signals)</h3>
          </div>
          <span className="text-xs font-bold text-amber-400">{riskSignals.length} Signal Terdeteksi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskSignals.map((rs) => (
            <div key={rs.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rs.employeeName}</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    rs.riskLevel === "HIGH" || rs.riskLevel === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {rs.riskLevel} RISK
                </span>
              </div>
              <p className="text-xs font-bold text-cyan-300">{rs.riskType.replace(/_/g, " ")}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{rs.evidence}</p>
              <div className="pt-2 text-[11px] text-amber-300/90 italic border-t border-slate-800/80">
                Rekomendasi Review: {rs.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
