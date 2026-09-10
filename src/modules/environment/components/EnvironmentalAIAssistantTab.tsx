import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { EnvironmentalAIInsight } from "../../../types/environmentTypes";

interface Props {
  aiInsights: EnvironmentalAIInsight[];
}

export const EnvironmentalAIAssistantTab: React.FC<Props> = ({ aiInsights }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya AI Environmental Copilot MINE SMART AI. Ada yang ingin Anda konsultasikan mengenai baku mutu air limbah (Permen 113/2003), AMDAL, atau prediksi pengerukan sediment pond?",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputQuery("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Berdasarkan regulasi Permen LHK No. 113/2003 dan data sensor site Pit Alpha: Kualitas air outfall Settling Pond Alpha saat ini terpantau pH 6.8 dan TSS 180 mg/L (COMPLIANT). Untuk menjaga kepatuhan saat puncak curah hujan minggu depan, disarankan melakukan dredging kompartemen 1 segera.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950 p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              AI Environmental Assistant & Regulatory Advisory
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Konsultasi AI regulasi AMDAL/UKL-UPL, Permen LHK, audit risiko pencemaran & rekomendasi tindakan otomatis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Console */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex flex-col h-[520px]">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              Live AI Environmental Assistant Console
            </h3>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-2 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan regulasi lingkungan, rekomendasi TSS, atau jadwal dredging..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-md flex items-center gap-1"
            >
              <Send className="h-4 w-4" /> Kirim
            </button>
          </form>
        </div>

        {/* Structured AI Insights List */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            AI Structured Risk Insights
          </h3>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-2xl border border-emerald-900/40 bg-slate-900 p-4 space-y-3 text-xs shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{insight.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {insight.confidence}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <p><strong className="text-emerald-400">Temuan:</strong> {insight.finding}</p>
                  <p><strong className="text-amber-400">Penyebab:</strong> {insight.possibleCauses.join(", ")}</p>
                  <p><strong className="text-cyan-400">Rekomendasi:</strong> {insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
