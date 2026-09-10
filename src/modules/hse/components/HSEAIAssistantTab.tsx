import React, { useState } from "react";
import { Sparkles, Send, Bot, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { HSEAIInsight } from "../../../types/hseTypes";

interface HSEAIAssistantTabProps {
  insights: HSEAIInsight[];
  onQueryAI: (query: string) => Promise<string>;
}

export const HSEAIAssistantTab: React.FC<HSEAIAssistantTabProps> = ({ insights, onQueryAI }) => {
  const [userQuery, setUserQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Halo! Saya AI HSE Assistant Gemini MINE SMART AI. Anda dapat menanyakan ringkasan insiden, analisis pola risiko, masa berlaku permit, atau rekomendasi tindakan pencegahan K3LH.",
    },
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isQuerying) return;

    const q = userQuery;
    setUserQuery("");
    setChatLog((prev) => [...prev, { sender: "user", text: q }]);
    setIsQuerying(true);

    try {
      const response = await onQueryAI(q);
      setChatLog((prev) => [...prev, { sender: "ai", text: response }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "ai", text: "Maaf, terjadi kesalahan pemrosesan AI." }]);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI HSE Safety Assistant & Predictive Intelligence
          </h2>
          <p className="text-xs text-slate-400">Analisis risiko K3, pola bahaya berulang, dan asisten percakapan cerdas</p>
        </div>

        <span className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-semibold">
          Gemini 1.5 Pro AI Engine
        </span>
      </div>

      {/* AI Chat Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {chatLog.map((chat, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {chat.sender === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-xl leading-relaxed ${
                  chat.sender === "user"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-800 text-slate-200 border border-slate-700"
                }`}
              >
                {chat.text}
              </div>
            </div>
          ))}
          {isQuerying && (
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <Bot className="w-4 h-4 animate-spin" /> Menganalisis data K3 pertambangan...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Tanyakan sesuatu: 'Berapa insiden bulan ini?', 'Apa hazard paling banyak?'..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isQuerying}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </form>
      </div>

      {/* Structured AI Insights Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm">Hasil Temuan AI Insight & Structure Guardrails</h3>

        <div className="space-y-3">
          {insights.map((ins) => (
            <div key={ins.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <span className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {ins.finding}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold">
                  Confidence: {ins.confidence}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                  <span className="text-indigo-400 font-semibold block mb-0.5">[FACT & EVIDENCE]</span>
                  {ins.evidence}
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                  <span className="text-amber-400 font-semibold block mb-0.5">[POSSIBLE CAUSE & INFERENCE]</span>
                  {ins.possibleCause}
                </div>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-emerald-300">
                <span className="font-bold block mb-0.5">[AI RECOMMENDATION]</span>
                {ins.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
