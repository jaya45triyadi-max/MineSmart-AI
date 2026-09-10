// MINE SMART AI - AI Finance Assistant, Cost Analyst & Automated Anomaly Detection Tab
import React, { useState } from "react";
import {
  Sparkles,
  Send,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  HelpCircle,
  Bot,
  Layers,
  Fuel,
  Wrench,
  Truck,
  Users,
  CheckCircle2,
  Zap,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { AIFinanceInsight, FinanceKPISummary } from "../../../types/financeTypes";

interface AIFinanceAssistantTabProps {
  insights: AIFinanceInsight[];
  kpi: FinanceKPISummary;
}

export const AIFinanceAssistantTab: React.FC<AIFinanceAssistantTabProps> = ({ insights, kpi }) => {
  const [query, setQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const initialAIMessage = `[AI FINANCE & COST CONTROL ENGINE ONLINE]
Halo! Saya MINE SMART AI Financial Advisor. Saya siap membantu Anda melakukan audit biaya tambang secara real-time, mendeteksi anomali tagihan vendor, menghitung proyeksi arus kas, dan menganalisis fluktuasi unit cost per ton/BCM.

💡 Klik pertanyaan cepat di atas atau tanyakan: "Apa penyebab mining cost naik bulan ini?" untuk memulai analisis otomatis menyeluruh.`;

  const [messages, setMessages] = useState<Array<{ sender: "USER" | "AI"; text: string; isAnalysis?: boolean }>>([
    {
      sender: "AI",
      text: initialAIMessage,
    },
  ]);

  const presetQuestions = [
    "Apa penyebab mining cost naik bulan ini?",
    "Kenapa cost per ton naik di Pit 1 South?",
    "Cost center mana yang mengalami budget overrun?",
    "Bagaimana proyeksi cash flow & working capital akhir bulan?",
    "Apakah ada tagihan vendor yang terdeteksi anomali?",
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const userQuery = textToSend || query;
    if (!userQuery.trim()) return;

    const newMessages = [...messages, { sender: "USER" as const, text: userQuery }];
    setMessages(newMessages);
    if (!textToSend) setQuery("");

    setTimeout(() => {
      let aiResponse = "";
      let isAnalysis = false;
      const qLower = userQuery.toLowerCase();

      if (
        qLower.includes("apa penyebab mining cost naik bulan ini") ||
        qLower.includes("penyebab mining cost naik") ||
        qLower.includes("kenapa cost per ton naik") ||
        qLower.includes("mining cost naik")
      ) {
        isAnalysis = true;
        aiResponse = `===============================================================
📊 LAPORAN ANALISIS OTOMATIS AI: PENYEBAB KENAIKAN MINING COST
Periode: Agustus 2026 • Site: Sangatta Kalimantan A • Confidence: 94.8%
===============================================================

1. RINGKASAN VARIAN BIAYA TAMBANG
• Realisasi Cost / Ton: Rp 85.100 / MT (Baseline: Rp 78.500 / MT → 🔺 +8.41%)
• Realisasi Cost / BCM: Rp 23.200 / BCM (Baseline: Rp 21.500 / BCM → 🔺 +7.91%)
• Total Kenaikan Biaya: +Rp 1.386.000.000 (Satu Milyar Tiga Ratus Delapan Puluh Enam Juta Rupiah)

2. DEKOMPOSISI 4 FAKTOR AKAR PENYEBAB (ROOT CAUSE ANALYSIS)

📌 FAKTOR 1: LONJAKAN KONSUMSI FUEL HAULING FLEET (41.8% Kontribusi)
- Dampak Biaya: +Rp 580.000.000
- Fakta & Bukti:
  * Jarak angkut (hauling distance) dari Pit 1 South ke West Disposal Area bertambah +1.8 km (dari 3.2 km menjadi 5.0 km).
  * Rasio konsumsi solar B35 fleet CAT 777G naik dari 0.65 L/BCM menjadi 0.74 L/BCM.
- Aksi Rekomendasi:
  * Buka jalur intermediate in-pit disposal di Pit 1 South RL +30 untuk memangkas jarak siklus 1.4 km.
  * Potensi Efisiensi: Rp 350.000.000 / bulan.

📌 FAKTOR 2: UNSCHEDULED BREAKDOWN EXCAVATOR & AIR FREIGHT (28.1% Kontribusi)
- Dampak Biaya: +Rp 390.000.000
- Fakta & Bukti:
  * Kerusakan hydraulic cylinder & kebocoran seal Excavator Komatsu PC1250 EX-204.
  * Pembelian suku cadang darurat melalui expedited air freight dari United Tractors Balikpapan.
- Aksi Rekomendasi:
  * Terapkan routine oil sampling analysis mingguan & oil contamination audit setiap 250 SMU.
  * Potensi Efisiensi: Rp 220.000.000 / bulan.

📌 FAKTOR 3: DEGRADASI JALAN LICIN & CYCLE TIME BERTAMBAH (18.0% Kontribusi)
- Dampak Biaya: +Rp 250.000.000
- Fakta & Bukti:
  * Curah hujan 142 mm di minggu ke-2 mengakibatkan jalan tambang KM 12-14 licin.
  * Rata-rata kecepatan hauling dump truck turun dari 24 km/jam menjadi 16 km/jam (cycle time melambat 18%).
- Aksi Rekomendasi:
  * Intensifkan motor grader Komatsu GD825 dan penambahan lapisan batu split (macadam) di KM 12.
  * Potensi Efisiensi: Rp 150.000.000 / bulan.

📌 FAKTOR 4: JAM LEMBUR TENAGA KERJA SHIFT 2 & 3 (12.1% Kontribusi)
- Dampak Biaya: +Rp 166.000.000
- Fakta & Bukti:
  * Penambahan 140 jam lembur operator fleet untuk mengejar target stripping pasca rain stoppage.
- Aksi Rekomendasi:
  * Optimalisasi rotasi roster & fleet matching ratio 1:5 saat cuaca cerah tanpa lembur berlebih.
  * Potensi Efisiensi: Rp 95.000.000 / bulan.

===============================================================
💡 KESIMPULAN & TOTAL POTENSI PENGHEMATAN:
Dengan mengeksekusi 4 rekomendasi di atas, estimasi penurunan biaya operasional tambang mencapai Rp 815.000.000 / bulan, mengembalikan Cost/Ton ke kisaran Rp 79.200 / MT.
===============================================================`;
      } else if (qLower.includes("budget") || qLower.includes("overrun")) {
        aiResponse = `[AI BUDGET CONTROL ANALYST]
Berdasarkan verifikasi realisasi OPEX Cost Center:
1. CC-MNT-01 (Main Workshop): OVER BUDGET +8.24% (+Rp 70.000.000) akibat perbaikan silinder hidrolik unit PC1250 EX-204.
2. CC-HAUL-01 (Hauling & Road): NEAR LIMIT 95.19% (Rp 4.95 M / Budget Rp 5.20 M).
3. CC-MIN-01 (Pit A Stripping): WITHIN BUDGET 90.68% (Rp 1.63 M / Budget Rp 1.80 M).

Rekomendasi: Terapkan pre-approval ketat untuk purchase order suku cadang kategori Fast-Moving di atas Rp 25 Juta.`;
      } else if (qLower.includes("cash flow") || qLower.includes("proyeksi")) {
        aiResponse = `[AI CASH FLOW FORECAST REPORT]
• Saldo Kas Saat Ini: Rp ${kpi.cashBalanceIDR.toLocaleString("id-ID")}
• Proyeksi Kas Masuk Minggu ke-3 & 4: +Rp 66.838.150.000 (Penerimaan Invoice Ekspor Glencore)
• Komitmen Kas Keluar: -Rp 18.500.000.000 (Vendor Solar Pertamina & Contractor SIS)
• Estimasi Saldo Kas Akhir Periode: Rp ${(kpi.cashBalanceIDR + 48338150000).toLocaleString("id-ID")}

⚠️ PERINGATAN RISIKO:
Piutang PT Smelter Mineral Indonesia (Rp 3.25 Milyar) telah jatuh tempo >30 hari. Segera terbitkan Surat Tagihan II guna memitigasi risiko defisit likuiditas lokal.`;
      } else if (qLower.includes("anomali") || qLower.includes("vendor")) {
        aiResponse = `[AI VENDOR INVOICE & ANOMALY DETECTOR]
Sistem 3-Way Matching mendeteksi:
1. INV-UT-2026-9041 (United Tractors - Rp 385 Juta): MATCHED 100% (PO, GR & Invoice sinkron).
2. INV-PTPN-2026-8812 (Pertamina Patra Niaga - Rp 632.25 Juta): MATCHED (Toleransi selisih tera volume 0.12% aman).
3. Deteksi Anomali: Tagihan biaya angkut darurat (Air Freight) tidak terdaftar dalam kontrak blanket PO awal. Telah ditandai untuk review GM Procurement.`;
      } else {
        aiResponse = `[AI GENERAL FINANCE INSIGHT]
Berdasarkan data terkini MINE SMART ERP:
- Total Pendapatan: Rp ${kpi.totalRevenueIDR.toLocaleString("id-ID")}
- Laba Usaha (Operating Profit): Rp ${kpi.operatingProfitIDR.toLocaleString("id-ID")} (Margin ${kpi.operatingMarginPct}%)
- EBITDA: Rp ${kpi.ebitdaIDR.toLocaleString("id-ID")} (Margin ${kpi.ebitdaMarginPct}%)
- Working Capital AR/AP Ratio: ${(kpi.accountsReceivableIDR / (kpi.accountsPayableIDR || 1)).toFixed(2)}x

Kinerja finansial secara keseluruhan stabil dan mampu menopang rencana ekspansi Pit 2 North.`;
      }

      setMessages([...newMessages, { sender: "AI", text: aiResponse, isAnalysis }]);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Chat Panel */}
      <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">AI Finance & Mining Cost Advisor</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/30">
                  AUTONOMOUS ANALYST
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Terhubung Langsung ke Sensor Telemetry Fleet, Dispatch, COA, Budget & Data Penjualan Batubara
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleSend("Apa penyebab mining cost naik bulan ini?")}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Analisis Kenaikan Mining Cost</span>
            </button>
          </div>
        </div>

        {/* Preset Questions Chips */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Preset Audit:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                idx === 0
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "USER" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg relative group ${
                  m.sender === "USER"
                    ? "bg-amber-500 text-slate-950 font-bold rounded-br-none"
                    : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none font-mono text-[11px]"
                }`}
              >
                {m.sender === "AI" && (
                  <button
                    onClick={() => handleCopy(m.text, idx)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Input Box */}
        <div className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950 rounded-b-2xl">
          <input
            type="text"
            placeholder="Tanyakan: Apa penyebab mining cost naik bulan ini? / Cek varians budget / Proyeksi cash flow..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </div>

      {/* AI Anomaly Detection & Insights List */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4 h-[700px] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Deteksi Anomali Finansial</h3>
          </div>
          <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
            Realtime Audit
          </span>
        </div>

        <div className="space-y-3.5">
          {insights.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                    item.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-400"
                      : item.severity === "WARNING"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {item.severity} • {item.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Confidence {item.confidencePct}%</span>
              </div>

              <h4 className="font-bold text-white leading-snug">{item.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.finding}</p>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Akar Penyebab & Bukti:</div>
                <div className="text-[11px] text-slate-400 leading-tight">{item.rootCauseInference}</div>
              </div>

              <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-300 text-[11px] space-y-1">
                <div className="text-[10px] font-bold uppercase text-emerald-400">Rekomendasi Aksi:</div>
                <div>{item.recommendation}</div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-1">Impact: {item.expectedImpact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
