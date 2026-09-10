// MINE SMART AI - AI Survey Intelligence Copilot Modal

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Layers,
  Ruler,
  TrendingUp,
} from "lucide-react";
import { SurveyAIService, AISurveyResponse } from "../../../services/survey/SurveyAIService";

interface SurveyAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPointsCount: number;
}

export const SurveyAIModal: React.FC<SurveyAIModalProps> = ({
  isOpen,
  onClose,
  totalPointsCount,
}) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AISurveyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = (promptText?: string) => {
    const activeQuery = promptText || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const res = SurveyAIService.processAIQuery(activeQuery, totalPointsCount);
      setResponse(res);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl text-white shadow-lg shadow-emerald-900/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Survey Intelligence Copilot
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                  Guardrail Rule #59 Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Asisten kecerdasan spasial survei tambang dengan perlindungan manipulasi data mentah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Input Section */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Tanyakan volume stockpile, progres cut & fill pit, atau isu QC..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <Send className="w-4 h-4" />
              <span>Tanya</span>
            </button>
          </div>

          {/* Quick Prompt Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
            <span className="text-slate-400 font-semibold whitespace-nowrap">Rekomendasi:</span>
            {[
              "Berapa volume Stockpile A saat ini?",
              "Analisis Cut & Fill Pit 1 South minggu II Agustus",
              "Apakah ada peringatan QC atau spike elevasi?",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleAsk(p);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap transition-colors cursor-pointer border border-slate-700"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* AI Response Display Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {loading && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p>Mengkalkulasi spasial & memverifikasi batas guardrail Rule #59...</p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4">
              {/* Question Header */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pertanyaan</span>
                <p className="text-white font-semibold">{response.question}</p>
              </div>

              {/* Guardrail Violation Warning */}
              {response.isBlockedByGuardrail && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl space-y-2 text-rose-200">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span>PERINGATAN SAFETY GUARDRAIL AI (RULE #59)</span>
                  </div>
                  <p>{response.blockReason}</p>
                </div>
              )}

              {/* Observation & Spatial Analysis */}
              {!response.isBlockedByGuardrail && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 block uppercase">
                      Observasi Data Survei Aktif
                    </span>
                    <p className="text-slate-200 leading-relaxed">{response.observation}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-sky-500/30 space-y-1">
                    <span className="text-xs font-bold text-sky-400 block uppercase">
                      Analisis Komputasi Spasial
                    </span>
                    <p className="text-slate-200 leading-relaxed">{response.spatialAnalysis}</p>
                  </div>

                  {response.volumeDetail && (
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1 font-mono">
                      <span className="text-xs font-bold text-amber-300 block uppercase font-sans">
                        Rincian Perhitungan Volume
                      </span>
                      <p className="text-amber-200">{response.volumeDetail}</p>
                    </div>
                  )}

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-purple-300 block uppercase">
                      Keterbatasan Data & Toleransi
                    </span>
                    <p className="text-slate-300">{response.limitation}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-white block uppercase">
                      Rekomendasi Tindakan Engineer
                    </span>
                    <p className="text-slate-300">{response.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
