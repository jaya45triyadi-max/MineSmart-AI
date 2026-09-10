// MINE SMART AI - Dispatch AI Copilot Q&A Assistant Modal

import React, { useState } from "react";
import { Sparkles, Send, ShieldAlert, Bot, User, HelpCircle, CheckCircle2 } from "lucide-react";

interface DispatchAICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchAICopilotModal: React.FC<DispatchAICopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; structured?: any }[]
  >([
    {
      role: "assistant",
      content:
        "Halo, Saya **AI Dispatch Copilot MINE SMART AI**. Saya siap membantu menganalisis armada, mengidentifikasi bottleneck, menghitung jumlah truk ideal, dan merekomendasikan skenario dispatch terbaik.",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");

  const sampleQuestions = [
    "Berapa truck ideal untuk EX-201?",
    "Kenapa queue di Pit 1 South tinggi?",
    "Bagaimana cara mengurangi cycle time?",
    "Apa bottleneck fleet saat ini?",
  ];

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user query
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInputQuery("");

    // Simulate structured AI Dispatch Copilot response with Guardrail compliance
    setTimeout(() => {
      let structuredAnswer: any = null;

      if (query.includes("truck ideal") || query.includes("EX-201")) {
        structuredAnswer = {
          currentCondition: "EX-201 saat ini beroperasi dengan 6 unit Dump Truck di Pit 1 South.",
          evidence: "Antrean rata-rata 10.0 menit. Loading time 4.2 menit. Jarak angkut ke ROM 01 adalah 4.2 km.",
          problem: "Over-allocation truk pada EX-201 menyebabkan akumulasi antrean berlebih.",
          rootCause: "Rasio truk terlalu tinggi dibanding kapasitas bucket EX-201 (7.0 m³).",
          recommendation: "Pindahkan 2 unit Dump Truck (DT-107 & DT-108) dari EX-201 ke EX-202 (Pit 2 North). Jumlah ideal untuk EX-201 adalah 4 unit DT.",
          expectedImpact: "Potensi pengurangan antrean sebesar -65% (dari 10m ke 3.5m) dan peningkatan produksi +350 Ton/shift.",
          confidence: 94,
          dataSources: ["Telemetry GPS", "FMS Cycle Engine", "Bucket Load Sensor"],
        };
      } else if (query.includes("queue") || query.includes("Pit 1")) {
        structuredAnswer = {
          currentCondition: "Terjadi kemacetan antrean di Pit 1 South Loading Bay dengan 3 truk menunggu.",
          evidence: "Queue duration saat ini mencapai 10.0 menit (melebihi threshold 5 menit).",
          problem: "Keterlambatan giliran muat akibat ketidakseimbangan armada.",
          rootCause: "Dump Truck tidak merata terdistribusi antara Pit 1 dan Pit 2.",
          recommendation: "Lakukan reassign parsial 2 unit truk ke EX-202.",
          expectedImpact: "Estimasi eliminasi penumpukan antrean dalam 15 menit.",
          confidence: 92,
          dataSources: ["Dispatch Queue Log", "GIS Location Tracker"],
        };
      } else {
        structuredAnswer = {
          currentCondition: "Pusat dispatch berjalan pada efisiensi 92.5% terhadap target produksi shift.",
          evidence: "Total produksi 2,850 Ton terakumulasi dari 12 unit aktif.",
          problem: "Sedikit kelambatan siklus pada rute Interburden akibat perbaikan drainase jalan.",
          rootCause: "Penyempitan badan jalan Km 2.4.",
          recommendation: "Bagi rute hauling alternatif melalui jalur bypass timur untuk truk muat ringan.",
          expectedImpact: "Potensi penghematan cycle time 2.5 menit per trip.",
          confidence: 89,
          dataSources: ["Haul Road GIS", "FMS Telemetry"],
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Berikut analisis & rekomendasi terstruktur dari AI Dispatch Copilot:",
          structured: structuredAnswer,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              AI DISPATCH COPILOT ASSISTANT
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  m.role === "user"
                    ? "bg-amber-500 text-slate-950 font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200"
                }`}
              >
                <p>{m.content}</p>

                {m.structured && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] font-sans">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <strong className="text-amber-400 block uppercase text-[9px]">Current Condition:</strong>
                      <span className="text-slate-300">{m.structured.currentCondition}</span>
                    </div>

                    <div className="p-2 bg-slate-900 rounded-lg">
                      <strong className="text-sky-400 block uppercase text-[9px]">Evidence:</strong>
                      <span className="text-slate-300">{m.structured.evidence}</span>
                    </div>

                    <div className="p-2 bg-slate-900 rounded-lg">
                      <strong className="text-rose-400 block uppercase text-[9px]">Problem & Root Cause:</strong>
                      <span className="text-slate-300">{m.structured.problem} — {m.structured.rootCause}</span>
                    </div>

                    <div className="p-2 bg-indigo-950/60 border border-indigo-500/30 rounded-lg">
                      <strong className="text-indigo-300 block uppercase text-[9px]">AI Recommendation:</strong>
                      <span className="text-white font-semibold">{m.structured.recommendation}</span>
                    </div>

                    <div className="p-2 bg-emerald-950/60 border border-emerald-500/30 rounded-lg">
                      <strong className="text-emerald-400 block uppercase text-[9px]">Expected Impact (Potential):</strong>
                      <span className="text-emerald-200 font-bold">{m.structured.expectedImpact}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>Confidence: <strong className="text-emerald-400">{m.structured.confidence}%</strong></span>
                      <span>Sources: {m.structured.dataSources.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sample Prompts Strip */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] whitespace-nowrap cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanyakan analisis dispatch, matching, atau queue..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
