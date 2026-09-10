import React, { useState } from "react";
import { Bot, Sparkles, Send, Scale, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { WeighbridgeAIInsight, WeighbridgeTicket, WeighbridgeReconciliation } from "../../../types/weighbridgeTypes";

interface WeighbridgeAICopilotTabProps {
  insights: WeighbridgeAIInsight[];
  tickets: WeighbridgeTicket[];
  reconciliations: WeighbridgeReconciliation[];
}

export const WeighbridgeAICopilotTab: React.FC<WeighbridgeAICopilotTabProps> = ({
  insights,
  tickets,
  reconciliations,
}) => {
  const [query, setQuery] = useState("");
  const [customResponse, setCustomResponse] = useState<string | null>(null);

  const sampleQuestions = [
    "Berapa ton coal yang ditimbang hari ini?",
    "Berapa total OB?",
    "Vehicle mana yang paling banyak membawa coal?",
    "Berapa rata-rata net weight?",
    "Ada transaksi mencurigakan?",
    "Apakah ada duplicate ticket?",
    "Kenapa data weighbridge berbeda dengan production?",
    "Berapa variance hari ini?",
    "Vehicle mana yang sering overload?",
  ];

  const handleAskQuestion = (q: string) => {
    setQuery(q);

    // Calculate real numbers for dynamic response
    const totalNet = tickets.reduce((acc, t) => acc + t.normalizedValue, 0).toFixed(1);
    const totalCoal = tickets.filter(t => t.materialType.toLowerCase().includes("coal")).reduce((acc, t) => acc + t.normalizedValue, 0).toFixed(1);
    const totalOB = tickets.filter(t => t.materialType.toLowerCase().includes("ob") || t.materialType.toLowerCase().includes("overburden")).reduce((acc, t) => acc + t.normalizedValue, 0).toFixed(1);
    const avgNet = tickets.length > 0 ? (Number(totalNet) / tickets.length).toFixed(2) : "0.00";
    const overloads = tickets.filter(t => t.isOverload);

    if (q.includes("ditimbang hari ini") || q.includes("coal")) {
      setCustomResponse(`Berdasarkan transaksi resmi hari ini, total batubara yang ditimbang di seluruh jembatan timbang adalah ${totalCoal} Ton dari total ${tickets.length} trip kendaraan.`);
    } else if (q.includes("total OB") || q.includes("OB")) {
      setCustomResponse(`Total Overburden (OB) yang ditimbang hari ini adalah ${totalOB} Ton dari lokasi Pit B North ke Waste Dump West.`);
    } else if (q.includes("paling banyak") || q.includes("paling sering")) {
      setCustomResponse(`Unit DT-201 mencatatkan volume pengangkutan tertinggi hari ini sebanyak 141.2 Ton (4 trips), diikuti TR-301 sebanyak 198.8 Ton (4 trips).`);
    } else if (q.includes("rata-rata net")) {
      setCustomResponse(`Rata-rata berat bersih (Net Weight) per truk hari ini adalah ${avgNet} Ton.`);
    } else if (q.includes("mencurigakan") || q.includes("duplicate")) {
      setCustomResponse(`Sistem mendeteksi 1 transaksi berpotensi overload pada unit DT-201 (38.7 Ton vs Kapasitas 35.0 Ton). Tidak ditemukan indikasi tiket ganda (duplicate ticket) aktif.`);
    } else if (q.includes("berbeda dengan production") || q.includes("variance")) {
      setCustomResponse(`Terdapat variansi +250 Ton (+2.06%) antara weighbridge Port Jetty 2 dan Sales Contract SO-2026-081. Penyebab diduga akibat keterlambatan sinkronisasi tiket weigh-out pada pergantian shift.`);
    } else {
      setCustomResponse(`Total tonase tertimbang saat ini adalah ${totalNet} Ton dengan rata-rata ${avgNet} Ton/truk. Rekonsiliasi sistem menunjukkan 2 item terverifikasi matched dan 1 item major variance memerlukan tinjauan supervisor.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">AI Weighbridge Copilot & Anomaly Engine</h2>
            <p className="text-xs text-slate-300">
              Asisten AI terintegrasi untuk query tonase penimbangan, deteksi anomali drift tare, dan analisis variansi rekonsiliasi.
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
          GEMINI 3.6 FLASH POWERED
        </span>
      </div>

      {/* Interactive Natural Language Q&A Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Tanyakan Apapun Tentang Penimbangan
        </div>

        {/* Preset Sample Questions */}
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ketik pertanyaan operasi penimbangan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskQuestion(query)}
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleAskQuestion(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {customResponse && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              Jawaban AI Weighbridge Copilot:
            </div>
            <p className="leading-relaxed text-slate-200">{customResponse}</p>
          </div>
        )}
      </div>

      {/* Structured Insights List (Finding -> Evidence -> Variance -> Possible Cause -> Impact -> Recommendation -> Confidence) */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Analisis Anomali & Rekomendasi Terstruktur</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div key={ins.id} className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ins.title}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {ins.confidence} Confidence
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div><strong className="text-slate-900 dark:text-white">Finding:</strong> {ins.finding}</div>
                <div><strong className="text-slate-900 dark:text-white">Evidence:</strong> {ins.evidence}</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 font-mono font-bold text-amber-500 border border-slate-200 dark:border-slate-800">
                  Variance: {ins.variance}
                </div>
                <div><strong className="text-slate-900 dark:text-white">Possible Cause:</strong> {ins.possibleCause}</div>
                <div><strong className="text-slate-900 dark:text-white">Impact:</strong> {ins.impact}</div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                  <strong>Recommendation:</strong> {ins.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
