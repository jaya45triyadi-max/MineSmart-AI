// MINE SMART AI - Warehouse AI Insight Tab
import React, { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { WarehouseAIInsight } from "../../../types/warehouseTypes";

interface WarehouseAIInsightTabProps {
  insights: WarehouseAIInsight[];
}

export const WarehouseAIInsightTab: React.FC<WarehouseAIInsightTabProps> = ({ insights }) => {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Halo! Saya AI Warehouse & Inventory Advisor MINE SMART AI. Anda dapat menanyakan tentang potensi stockout sparepart, analisis dead stock, konsumsi abnormal filter hidrolik, atau rekomendasi reorder optimis site A.",
    },
  ]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setPrompt("");
    setChatLog((prev) => [...prev, { sender: "user", text: userText }]);

    setTimeout(() => {
      let aiResponse = "Berdasarkan analisis stok real-time gudang Site A: Stok filter hidrolik PC1250 saat ini berjumlah 8 unit (tersedia) dengan PO in-transit 10 unit. Rekomendasi: Lakukan pendorongan pengiriman PO-2026-0810-01 agar tiba sebelum jadwal maintenance Excavator EX-012 tanggal 16 Agustus.";
      const lower = userText.toLowerCase();
      if (lower.includes("filter") || lower.includes("pc1250") || lower.includes("12 hari") || lower.includes("habis")) {
        aiResponse = "🤖 PREDIKSI AI: 'Spare part Hydraulic Return Filter Element PC1250 (Part No: 208-60-71120) diperkirakan habis dalam 12 hari.'\n\nAnalisis: Sisa stok fisik tersedia 8 PCS dengan laju keausan armada excavator di Pit North mencapai 0.67 PCS/hari (2 unit setiap 3 hari). Direkomendasikan segera menyetujui Purchase Requisition buffer 20 PCS sebelum buffer habis pada 27 Agustus 2026.";
      } else if (lower.includes("injector") || lower.includes("cat")) {
        aiResponse = "🤖 PREDIKSI AI: 'Spare part Fuel Injector CAT 3508B (Part No: 254-4339) diperkirakan habis dalam 9 hari.'\n\nStok saat ini 3 unit, di bawah ROP 8 unit. Sangat mendesak untuk truk hauling HD-041.";
      } else if (lower.includes("oli") || lower.includes("lubricant") || lower.includes("consumable")) {
        aiResponse = "🤖 PREDIKSI AI: 'Engine Oil Shell Rimula 15W-40 diperkirakan habis dalam 14 hari.' Sisa stok 14 drum dengan laju pemakaian rutin 1.0 drum/hari untuk jadwal PM 250H armada.";
      } else if (lower.includes("dead") || lower.includes("stagnan")) {
        aiResponse = "Terdapat Impeller Shaft Pompa Flygt bernilai Rp 180 Juta tanpa pergerakan selama >180 hari di WH Central. Direkomendasikan transfer ke Site B Samarinda.";
      }

      setChatLog((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 400);
  };

  const handleQuickChip = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant Chat Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">AI Inventory Assistant & Stockout Predictor</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Predictive Model v4.8
          </span>
        </div>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleQuickChip("Kapan spare part Hydraulic Filter PC1250 habis?")}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer"
          >
            ⚡ Prediksi Spare Part PC1250 (12 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip("Kapan Fuel Injector CAT 3508B habis?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold transition cursor-pointer"
          >
            ⚙️ Fuel Injector CAT (9 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip("Bagaimana status ketahanan stok oli Shell Rimula?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold transition cursor-pointer"
          >
            🛢️ Oli Shell Rimula (14 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip("Tampilkan analisis dead stock suku cadang")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold transition cursor-pointer"
          >
            📦 Dead Stock Pompa Flygt
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-2xl ${
                msg.sender === "user"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 ml-auto"
                  : "bg-slate-800 text-slate-200 border border-slate-700 whitespace-pre-line"
              }`}
            >
              <div className="font-bold text-[10px] text-amber-400 mb-1">
                {msg.sender === "user" ? "Anda (Warehouse Officer)" : "AI Warehouse Advisor"}
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAskAI} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan ke AI: e.g. 'Item apa yang berisiko stockout?' atau 'Berapa nilai dead stock?'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Tanya AI
          </button>
        </form>
      </div>

      {/* AI Structured Insight Cards */}
      <div className="space-y-4">
        <h4 className="font-bold text-white text-sm">Hasil Deteksi Riset Cerdas AI (Structured Intelligence):</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div key={ins.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {ins.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">Confidence {ins.confidencePct}%</span>
              </div>

              <h4 className="font-bold text-white text-sm leading-snug">{ins.title}</h4>
              <p className="text-xs text-slate-300">{ins.finding}</p>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div>
                  <strong className="text-amber-400">Bukti Data (Evidence):</strong> {ins.evidence}
                </div>
                <div>
                  <strong className="text-rose-400">Potensi Risiko:</strong> {ins.risk}
                </div>
                <div>
                  <strong className="text-emerald-400">Rekomendasi AI:</strong> {ins.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
