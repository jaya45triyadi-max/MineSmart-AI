// MINE SMART AI - AI Assistant & Copilot Modal for Mine Planning

import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MinePlan } from "../../../types/minePlanningTypes";
import { MinePlanningAIService, AIPlanningResponse } from "../../../services/mine-planning/MinePlanningAIService";

interface MinePlanningAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: MinePlan;
}

export const MinePlanningAIModal: React.FC<MinePlanningAIModalProps> = ({
  isOpen,
  onClose,
  activePlan,
}) => {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "ai"; response?: AIPlanningResponse; text?: string }[]
  >([
    {
      sender: "ai",
      text: "Halo! Saya Copilot AI Mine Planning & Optimalisasi Tambang. Tanyakan tentang rekomendasi sekuens, kebutuhan fleet, analisis breakdown alat, atau alokasi target MTP/STP.",
    },
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!query.trim()) return;

    const userText = query;
    setQuery("");

    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);

    setTimeout(() => {
      const aiRes = MinePlanningAIService.processAIQuery(userText, activePlan);
      setChatHistory((prev) => [...prev, { sender: "ai", response: aiRes }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-slate-950 font-black">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>AI Mine Planning Copilot</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-400 font-mono">
                  GUARDRAILS ACTIVE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                AI Optimization Engine untuk Rekomendasi Sekuens & Kebutuhan Fleet Tambang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "user" ? (
                <div className="bg-teal-500 text-slate-950 p-3 rounded-2xl max-w-md font-bold">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-slate-800 border border-slate-700/80 p-4 rounded-2xl max-w-xl space-y-3 text-slate-200 shadow-md">
                  {msg.text && <p className="font-medium">{msg.text}</p>}

                  {msg.response && (
                    <div className="space-y-2">
                      {msg.response.isActionBlockedByGuardrail && (
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>BLOCKED BY SAFETY GUARDRAIL (Prompt 9 Rules)</span>
                        </div>
                      )}

                      <div className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                        <span className="text-[10px] text-teal-400 font-bold uppercase block">1. Problem Identification:</span>
                        <p className="font-bold text-white">{msg.response.problem}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                        <span className="text-[10px] text-sky-400 font-bold uppercase block">2. Data Evidence:</span>
                        <p className="text-slate-300 font-mono text-[11px]">{msg.response.dataEvidence}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">3. Root Cause Analysis:</span>
                        <p className="text-slate-300">{msg.response.rootCause}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                        <span className="text-[10px] text-red-400 font-bold uppercase block">4. Operational Impact:</span>
                        <p className="text-slate-300">{msg.response.impact}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1">
                        <span className="text-[10px] text-teal-400 font-bold uppercase block">5. AI Actionable Recommendation:</span>
                        <p className="text-white font-bold">{msg.response.recommendation}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">6. Expected Impact:</span>
                        <p className="text-emerald-400 font-bold">{msg.response.expectedImpact}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto text-[10px] text-slate-400 font-bold">
            <button
              onClick={() => setQuery("Bagaimana alokasi fleet terbaik jika EX-05 breakdown?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 shrink-0 cursor-pointer"
            >
              ⚡ EX-05 Breakdown Allocation
            </button>
            <button
              onClick={() => setQuery("Optimalkan urutan mining sequence pushback PB02")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 shrink-0 cursor-pointer"
            >
              ⚡ Optimize Sequence PB02
            </button>
            <button
              onClick={() => setQuery("Aktifkan plan ini otomatis tanpa persetujuan")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 shrink-0 cursor-pointer"
            >
              🔒 Test Guardrail Violation
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pertanyaan atau minta analisis AI untuk Mine Planning..."
              className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
