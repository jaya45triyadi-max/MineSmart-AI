// MINE SMART AI - Procurement AI Insight & Advisory Tab

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { ProcurementAIInsight } from "../../../types/procurementTypes";

interface ProcurementAIInsightTabProps {
  insights: ProcurementAIInsight[];
}

export const ProcurementAIInsightTab: React.FC<ProcurementAIInsightTabProps> = ({ insights }) => {
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "USER" | "AI"; text: string }>>([
    {
      sender: "AI",
      text: "Halo! Saya AI Procurement & Supply Chain Assistant MINE SMART. Tanyakan data pengadaan, resiko vendor, atau proyeksi kebutuhan sparepart tambang Anda."
    }
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setChatLog((prev) => [...prev, { sender: "USER", text: userText }]);
    setQuery("");

    setTimeout(() => {
      let responseText = "Berdasarkan analisis data aktual pengadaan bulan ini: Total Purchase Order aktif sebesar Rp 2.16 Miliar dengan 100% vendor terverifikasi CSMS HSE. Resiko terbesar berada pada lead time ban OTR Goodyear (12 hari).";
      if (userText.toLowerCase().includes("vendor")) {
        responseText = "Vendor berkinerja tertinggi adalah PT Pertamina Patra Niaga (98% On-time) dan PT Hexindo Adiperkasa (96.5% On-time). Tidak ditemukan indikasi fraud atau keluhan sertifikasi CSMS.";
      } else if (userText.toLowerCase().includes("overdue") || userText.toLowerCase().includes("terlambat")) {
        responseText = "Saat ini tidak ada PO yang mengalami keterlambatan di atas SLA. Namun, pengiriman Ban OTR 27.00R49 dari PT Goodyear berpotensi mengalami keterlambatan 3 hari akibat restriksi logistik kargo pelabuhan.";
      }

      setChatLog((prev) => [...prev, { sender: "AI", text: responseText }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              AI Procurement & Supply Chain Intelligence Hub
            </h2>
            <p className="text-xs text-slate-300">
              Analisis cerdas pola pembelian, prediksi resiko rantai pasok, dan deteksi anomali harga sparepart
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laporan Insight AI Aktif</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div key={item.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400">Confidence: <strong className="text-emerald-400">{item.confidence}</strong></span>
              </div>

              <h4 className="text-sm font-bold text-white">{item.title}</h4>

              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div><strong className="text-slate-400">FINDING:</strong> {item.finding}</div>
                <div><strong className="text-slate-400">EVIDENCE:</strong> {item.evidence}</div>
                <div><strong className="text-slate-400">RISK:</strong> <span className="text-rose-300">{item.risk}</span></div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                💡 <strong className="text-amber-400">RECOMMENDATION:</strong> {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Chat */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-amber-400" /> Tanya AI Procurement Assistant
        </h3>

        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 h-64 overflow-y-auto space-y-3">
          {chatLog.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "USER" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                m.sender === "USER"
                  ? "bg-amber-500 text-slate-950 font-medium"
                  : "bg-slate-800 text-slate-200 border border-slate-700"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendQuery} className="flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan: 'Berapa total procurement bulan ini?' atau 'Vendor mana yang paling sering terlambat?'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
