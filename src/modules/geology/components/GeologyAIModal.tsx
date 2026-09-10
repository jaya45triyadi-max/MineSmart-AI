// MINE SMART AI - Geological AI Assistant Copilot & Safety Guardrail Engine

import React, { useState } from "react";
import {
  Bot,
  X,
  Sparkles,
  Send,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { GeologyAIService, AIGeologyResponse } from "../../../services/geology/GeologyAIService";

interface GeologyAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBoreholeCount: number;
}

export const GeologyAIModal: React.FC<GeologyAIModalProps> = ({
  isOpen,
  onClose,
  activeBoreholeCount,
}) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AIGeologyResponse | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = GeologyAIService.processAIQuery(query, activeBoreholeCount);
    setResponse(res);
  };

  const handleQuickQuestion = (qText: string) => {
    setQuery(qText);
    const res = GeologyAIService.processAIQuery(qText, activeBoreholeCount);
    setResponse(res);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const rep = GeologyAIService.generateGeologicalExecutiveReport("Pit Sangatta 1 South");
      setReportText(rep);
      setIsGeneratingReport(false);
    }, 800);
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Geology AI Command Assistant
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Guardrail Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pusat Analisis Geologi cerdas berbasis model AI & Integritas Data Resmi JORC/KCMI
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Contoh Pertanyaan Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Korelasi seam dan deteksi splitting",
                "Prediksi kualitas batubara GAR & Ash",
                "Deteksi anomali struktur & sesar",
                "Sintesis lingkungan pengendapan",
                "Validasi integritas data 12-Rule QA/QC",
                "Estimasi sumberdaya JORC & KCMI",
                "Hapus data borehole BH-001 (Uji Guardrail)",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    q.includes("Guardrail")
                      ? "bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/40"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* AI Output Response Box */}
          {response && (
            <div
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                response.isBlockedByGuardrail
                  ? "bg-rose-950/30 border-rose-500/50"
                  : "bg-slate-950/80 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Pertanyaan: {response.question}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Sumber: {response.dataUsed}
                </span>
              </div>

              {response.isBlockedByGuardrail && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Ditolak oleh AI Geological Safety Guardrail Rule #60</span>
                </div>
              )}

              <div className="space-y-2 text-slate-300 leading-relaxed">
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Observasi:</strong>
                  <p>{response.observation}</p>
                </div>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Analisis Stratigrafi:</strong>
                  <p>{response.analysis}</p>
                </div>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Keterbatasan Model:</strong>
                  <p className="text-slate-400">{response.limitation}</p>
                </div>
                <div>
                  <strong className="text-emerald-400 block font-semibold mb-0.5">Rekomendasi Geologist:</strong>
                  <p className="text-emerald-300">{response.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Executive Report Box */}
          {reportText && (
            <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Laporan Ringkasan Geologi Eksekutif
                </span>
                <button
                  onClick={handleCopyReport}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Tersalin!" : "Salin Laporan"}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-60">
                {reportText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <form onSubmit={handleAsk} className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tanyakan analisis geologi, seam, atau kualitas batubara..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim</span>
            </button>
          </form>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isGeneratingReport ? "Membuat Laporan..." : "Buat Laporan Ringkasan Geologi Automatic"}</span>
            </button>
            <span className="text-slate-500">Database Version: v1.0-APPROVED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
