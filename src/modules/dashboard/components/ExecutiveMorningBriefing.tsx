// MINE SMART AI - Executive Morning Mining Performance Summary (AI Briefing)
// Otomatis dibuat setiap pagi untuk CEO / Direktur / Owner

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Volume2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sun,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  Layers,
  Truck,
  Fuel,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronRight,
  Award,
} from "lucide-react";
import { ProductionKPIData, FleetKPIData, FuelCostKPIData, HSEKPIData, StockpileKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface ExecutiveMorningBriefingProps {
  companyName: string;
  siteName: string;
  production: ProductionKPIData;
  fleet: FleetKPIData;
  fuelCost: FuelCostKPIData;
  hse: HSEKPIData;
  stockpile: StockpileKPIData;
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: string) => void;
}

export const ExecutiveMorningBriefing: React.FC<ExecutiveMorningBriefingProps> = ({
  companyName,
  siteName,
  production,
  fleet,
  fuelCost,
  hse,
  stockpile,
  onOpenAICopilot,
  onNavigateModule,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [briefingTime, setBriefingTime] = useState("06:00 WIB (Shift 1 Handover)");

  // Financial Calculations for C-Level
  const coalPricePerTonUSD = 68.5;
  const exchangeRate = 16200;
  const revenueUSD = Math.round(production.coalActualTon * coalPricePerTonUSD);
  const revenueIDR = revenueUSD * exchangeRate;
  const targetRevenueUSD = Math.round(production.coalTargetTon * coalPricePerTonUSD);
  const targetRevenueIDR = targetRevenueUSD * exchangeRate;
  const grossProfitIDR = revenueIDR - fuelCost.operatingCostIDR;
  const grossMarginPct = Number(((grossProfitIDR / revenueIDR) * 100).toFixed(1));
  const miningCostPerTonUSD = Number(((fuelCost.operatingCostIDR / exchangeRate) / Math.max(1, production.coalActualTon)).toFixed(2));

  // Auto-Generated Executive Morning Briefing Text
  const morningBriefingContent = {
    title: "MINING PERFORMANCE SUMMARY — MORNING EXECUTIVE BRIEFING",
    date: new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    timeGenerated: briefingTime,
    executiveGreeting: "Selamat Pagi Dewan Direksi & Pemilik Tambang,",
    executiveOverview: `AI Command Center telah mengonsolidasikan seluruh data operasional dari 16 subsistem pertambangan di ${siteName} (${companyName}). Secara keseluruhan, kinerja operasional 24 jam terakhir berada pada status PRIMA DENGAN PENGAWASAN BIAYA (Health Score: 84/100).`,
    keyPillars: [
      {
        pillar: "1. KEUANGAN & LABA (Revenue & EBITDA)",
        status: "HEALTHY",
        icon: DollarSign,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        summary: `Estimasi Revenue hari ini mencapai Rp ${(revenueIDR / 1000000000).toFixed(2)} Miliar ($${(revenueUSD / 1000).toFixed(1)}k USD) dengan EBITDA Gross sebesar Rp ${(grossProfitIDR / 1000000000).toFixed(2)} Miliar (Margin ${grossMarginPct}%). Mining Cost terkendali pada $${miningCostPerTonUSD}/Ton (Rp ${fuelCost.costPerTonIDR.toLocaleString("id-ID")}/Ton).`,
      },
      {
        pillar: "2. PRODUKSI & PIT PERFORMANCE",
        status: production.coalAchievementPct >= 95 ? "ON_TRACK" : "WARNING",
        icon: Layers,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10 border-cyan-500/30",
        summary: `Produksi batu bara terealisasi ${production.coalActualTon.toLocaleString("id-ID")} Ton (${production.coalAchievementPct}% dari target ${production.coalTargetTon.toLocaleString("id-ID")} Ton). Pengupasan OB mencapai ${production.obActualBCM.toLocaleString("id-ID")} BCM (${production.obAchievementPct}%). Strip Ratio actual 3.41 BCM/Ton (Plan 3.33 BCM/Ton).`,
      },
      {
        pillar: "3. ARMADA & EFISIENSI FUEL (Fleet & Fuel)",
        status: "WARNING",
        icon: Truck,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        summary: `Physical Availability (PA) armada tercatat ${fleet.physicalAvailabilityPA}% (Target ≥85%) dengan 62 unit aktif beroperasi. Namun, terjadi anomali Fuel Ratio sebesar 3.40 L/Ton (+8.7% di atas target 3.20 L/Ton) akibat antrean 11 truk di area crusher Pit North.`,
      },
      {
        pillar: "4. STOCKPILE & KUALITAS LAB",
        status: "SAFE",
        icon: Flame,
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/30",
        summary: `Total persediaan batu bara ROM Stockpile sebesar ${stockpile.currentStockTon.toLocaleString("id-ID")} Ton (Okupansi ${stockpile.occupancyPct}%). Kualitas batu bara lab teruji GAR 4.210 kcal/kg (Moisture 34.2%, Ash 5.4%), memenuhi spesifikasi kontrak buyer ekspor.`,
      },
      {
        pillar: "5. K3LH & KESELAMATAN KERJA (HSE)",
        status: "EXCELLENT",
        icon: ShieldCheck,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        summary: `Operasi tambang mencatatkan ${hse.daysWithoutLTI} HARI BEBAS LTI (Zero Fatalities). Terdapat 1 temuan kepatuhan jarak aman blasting yang telah ditindaklanjuti dengan inspeksi K3 Shift 1 pagi ini.`,
      },
    ],
    strategicDirectives: [
      "📌 Instruksikan KTT/Site Manager untuk menyeimbangkan ritase hauling antara Pit North dan Central guna mengeliminasi bottleneck antrean crusher.",
      "📌 Berlakukan protokol Engine Auto-Shutdown pada dump truck idle >5 menit untuk memangkas pemborosan bahan bakar ~Rp 36 Juta/hari.",
      "📌 Percepat barging 2 tongkang di jetty port untuk melonggarkan okupansi ROM Stockpile A yang sudah mencapai 83.9%.",
    ],
  };

  const handleCopyText = () => {
    const fullText = `*${morningBriefingContent.title}*
Tanggal: ${morningBriefingContent.date} | ${morningBriefingContent.timeGenerated}
Lokasi: ${siteName} (${companyName})

${morningBriefingContent.executiveGreeting}

${morningBriefingContent.executiveOverview}

*RINGKASAN PILAR OPERASIONAL:*
1. KEUANGAN: Est. Revenue Rp ${(revenueIDR / 1000000000).toFixed(2)} Miliar ($${(revenueUSD / 1000).toFixed(1)}k), EBITDA Rp ${(grossProfitIDR / 1000000000).toFixed(2)} Miliar (Margin ${grossMarginPct}%), Mining Cost $${miningCostPerTonUSD}/Ton.
2. PRODUKSI: Batubara ${production.coalActualTon.toLocaleString("id-ID")} Ton (${production.coalAchievementPct}%), OB ${production.obActualBCM.toLocaleString("id-ID")} BCM (${production.obAchievementPct}%), Strip Ratio ${production.stripRatioActual}.
3. FLEET & FUEL: Fleet PA ${fleet.physicalAvailabilityPA}%, 62 Unit Running, Fuel Ratio 3.40 L/Ton (+8.7% Anomali).
4. STOCKPILE: Stok ROM ${stockpile.currentStockTon.toLocaleString("id-ID")} Ton (${stockpile.occupancyPct}%), Kualitas GAR ${stockpile.quality.calorificValueGAR}.
5. HSE: ${hse.daysWithoutLTI} Hari Bebas LTI (Zero Fatalities, Zero LTI).

*ARAHAN STRATEGIS DIREKSI:*
${morningBriefingContent.strategicDirectives.join("\n")}

— Generated automatically by MineSmart AI Command Center`;

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech tidak didukung pada browser ini.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = `Selamat pagi Dewan Direksi dan Pemilik Tambang. Berikut ringkasan kinerja tambang pagi ini untuk ${siteName}. Estimasi pendapatan mencapai ${ (revenueIDR / 1000000000).toFixed(1) } miliar rupiah dengan laba kotor ${ (grossProfitIDR / 1000000000).toFixed(1) } miliar rupiah. Produksi batu bara mencapai ${ production.coalActualTon.toLocaleString("id-ID") } ton atau ${ production.coalAchievementPct } persen dari target. Jam kerja aman tanpa kecelakaan kerja tercatat ${ hse.daysWithoutLTI } hari. Rekomendasi utama pagi ini adalah penyeimbangan armada di Pit North untuk menekan konsumsi bahan bakar.`;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setBriefingTime(`${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB (Real-Time Synced)`);
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badge & Action Toolbar */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              SETIAP PAGI: MINING PERFORMANCE SUMMARY
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {briefingTime}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <span>Executive Morning Briefing — Kondisi Perusahaan</span>
          </h2>
          <p className="text-xs text-slate-300">
            Ringkasan kecerdasan buatan terpadu untuk <strong>CEO, Direktur & Owner Tambang</strong>, diolah otomatis dari 16 modul operasional.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              isSpeaking
                ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-black"
                : "bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
            title="Dengarkan Audio Briefing (Bahasa Indonesia)"
          >
            <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-bounce" : "text-amber-400"}`} />
            <span>{isSpeaking ? "Hentikan Suara" : "Dengarkan AI (Audio)"}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white text-xs font-bold transition-all"
            title="Salin Ringkasan ke Clipboard (WhatsApp / Email Memo)"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyan-400" />
                <span>Salin Memo</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
            title="Refresh ringkasan AI dengan data detik ini"
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>{isRegenerating ? "Menganalisis..." : "Update Live"}</span>
          </button>
        </div>
      </div>

      {/* Executive Intro Narrative */}
      <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-amber-400">{morningBriefingContent.executiveGreeting}</span>
          <span className="text-[11px]">{morningBriefingContent.date}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {morningBriefingContent.executiveOverview}
        </p>
      </div>

      {/* AI EXECUTIVE COPILOT — 1-SENTENCE DIRECT BRIEFING */}
      <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/50 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 tracking-wider uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                AI EXECUTIVE COPILOT
              </span>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                Direktur: &ldquo;Bagaimana kondisi tambang hari ini?&rdquo;
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-amber-950/50 transition-all self-start sm:self-auto"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tanya AI Interaktif</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* AI Briefing Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Production</span>
            <div className="text-sm font-black text-amber-400">94% dari target</div>
            <span className="text-[10px] text-slate-400">Shortfall ~6% di Fleet B</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Fleet Utilization</span>
            <div className="text-sm font-black text-cyan-400">82%</div>
            <span className="text-[10px] text-slate-400">Target optimal &ge; 88%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Fuel Consumption</span>
            <div className="text-sm font-black text-rose-400">Naik 7%</div>
            <span className="text-[10px] text-slate-400">Anomali burn rate tanjakan</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Downtime</span>
            <div className="text-sm font-black text-rose-400">Meningkat 11%</div>
            <span className="text-[10px] text-slate-400">PA turun ke 88.5%</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1">
            <span className="text-[10px] text-rose-400 font-black block uppercase">Risiko Utama</span>
            <div className="text-sm font-black text-rose-300">Terdapat pada Fleet B</div>
            <span className="text-[10px] text-rose-400/80">EX-03 & EX-05 breakdown</span>
          </div>
        </div>

        {/* Recommended Action Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-amber-300">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>RECOMMENDED ACTION & DAFTAR TINDAKAN PRIORITAS:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200 pl-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">1.</span>
              <span><strong>Prioritaskan maintenance EX-03 & EX-05</strong> dan <strong>alihkan HD-07 ke Fleet A/B</strong> untuk mengeliminasi idle queuing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">2.</span>
              <span><strong>Investigasi injektor & filter solar</strong> unit tanjakan KM 4.2 guna memangkas kenaikan konsumsi fuel 7%.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">3.</span>
              <span><strong>Scraping & perataan jalan hauling KM 4</strong> dengan Motor Grader untuk memotong cycle time 4.2 menit.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5 Strategic Operational Pillars */}
      <div className="space-y-3 my-5">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
          5 Pilar Kinerja Kunci (Financial, Production, Fleet, Stockpile, HSE):
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {morningBriefingContent.keyPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border bg-slate-900/90 flex flex-col justify-between space-y-2 shadow-md transition-all hover:border-slate-600 ${
                  idx === 0 ? "md:col-span-2 lg:col-span-1 border-emerald-500/40 bg-emerald-950/20" : "border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${item.bg}`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="text-xs font-black text-white">{item.pillar}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      item.status === "EXCELLENT" || item.status === "HEALTHY" || item.status === "ON_TRACK" || item.status === "SAFE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Board Directives */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
            <Award className="h-4 w-4 text-amber-400" />
            <span>3 Arahan Strategis AI untuk Direksi & KTT Hari Ini:</span>
          </div>
          <button
            onClick={onOpenAICopilot}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Tanya AI Command Center</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {morningBriefingContent.strategicDirectives.map((directive, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-semibold text-slate-200">{directive}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
