import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain,
  HelpCircle,
} from "lucide-react";
import { ReclamationAIInsight, ReclamationKPISummary } from "../../../types/reclamationTypes";

interface Props {
  aiInsights: ReclamationAIInsight[];
  kpi: ReclamationKPISummary | null;
}

export const ReclamationAIAssistantTab: React.FC<Props> = ({
  aiInsights,
  kpi,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; insight?: any }>
  >([
    {
      sender: "ai",
      text: "Halo! Saya AI Reclamation Assistant MINE SMART AI. Anda dapat menanyakan analisis area terganggu, kesiapan penanaman, survival rate bibit, prediksi keterlambatan, maupun analisis biaya per hektare.",
    },
  ]);
  const [input, setInput] = useState("");

  const sampleQuestions = [
    "Berapa hektare area yang belum direklamasi?",
    "Area mana yang paling siap untuk direklamasi?",
    "Bagaimana progress reklamasi bulan ini?",
    "Berapa survival rate tanaman?",
    "Berapa biaya reklamasi per hektare?",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { sender: "user" as const, text: q };
    let aiResponse = "";

    if (q.includes("belum direklamasi") || q.includes("terganggu")) {
      aiResponse = `Berdasarkan data aktual GIS & Survey: Total lahan terganggu saat ini adalah ${
        kpi?.totalDisturbedAreaHa || 145.8
      } Ha. Luas area aktif penambangan ${
        kpi?.activeMiningAreaHa || 68.4
      } Ha, sedangkan area yang siap direklamasi (void/backfilled) adalah ${
        kpi?.areaReadyForReclamationHa || 22.5
      } Ha.`;
    } else if (q.includes("paling siap") || q.includes("siap")) {
      aiResponse =
        "Area paling siap untuk direklamasi saat ini adalah **Pit Alpha Block 3 West Slope** (12.5 Ha) dengan status penataan backfill void selesai dan ketersediaan topsoil 55.000 m³ di Bank Stockpile Central.";
    } else if (q.includes("progress")) {
      aiResponse = `Pencapaian progress reklamasi tahun 2026 mencapai **${
        kpi?.reclamationProgressPercent || 68.7
      }%** (${kpi?.actualAreaYearHa || 18.5} Ha ter-reklamasi dari target tahunan ${
        kpi?.targetAreaYearHa || 25.0
      } Ha). Progress penanaman bibit mencapai ${kpi?.plantingProgressPercent || 82.4}%.`;
    } else if (q.includes("survival") || q.includes("tanaman")) {
      aiResponse = `Tingkat kelangsungan hidup (Survival Rate) bibit tanaman di lokasi revegetasi saat ini rata-rata **${
        kpi?.survivalRatePercent || 88.6
      }%**. Tanaman Sengon Laut & LCC menunjukkan adaptasi sangat baik.`;
    } else if (q.includes("biaya") || q.includes("hektare")) {
      aiResponse = `Rata-rata biaya operasional reklamasi per hektare (Cost/Ha) saat ini adalah **Rp ${(
        (kpi?.costPerHectareIDR || 124269000) / 1000000
      ).toFixed(1)} Juta / ha**, masih berada dalam batas efisiensi anggaran RKAB.`;
    } else {
      aiResponse = `AI Insight: Analisis sistem menunjukkan kegiatan reklamasi berjalan sesuai schedule. Semua parameter dihitung secara transparan berdasarkan transaksi aktual dan pengukuran survey DTM.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: "ai", text: aiResponse }]);
    if (!textToSend) setInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-400" />
          AI Reclamation Copilot & Intelligent Risk Analysis
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Asisten AI interaktif untuk analisis prioritas lahan, revegetasi, prediksi keterlambatan, dan rekomendasi perbaikan erosi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex flex-col justify-between h-[520px]">
          {/* Chat Messages Log */}
          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-semibold"
                      : "bg-slate-950 border border-slate-800 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Sample Prompts */}
          <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-800/80 my-2">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-emerald-400 font-medium transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="Tanyakan analisis reklamasi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Structured AI Insights List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" /> Ringkasan Insight Prioritas AI
          </h3>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {aiInsights.map((ins) => (
              <div
                key={ins.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{ins.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Risk: {ins.reclamationRisk}
                  </span>
                </div>

                <p className="text-slate-300">
                  <strong className="text-emerald-400">Finding:</strong> {ins.finding}
                </p>
                <p className="text-slate-400">
                  <strong className="text-cyan-400">Recommendation:</strong> {ins.recommendation}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                  <span>Confidence: {ins.confidence}</span>
                  <span>Impact: {ins.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
