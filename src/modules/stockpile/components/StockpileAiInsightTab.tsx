import React, { useState } from "react";
import { Sparkles, Bot, Send, Flame, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Stockpile, StockMovement, BlendingPlan } from "../../../types/stockpileTypes";

interface StockpileAiInsightTabProps {
  stockpiles: Stockpile[];
  movements: StockMovement[];
  blendingPlans: BlendingPlan[];
}

interface AiQueryPreset {
  title: string;
  query: string;
  problem: string;
  cause: string;
  recommendation: string;
  impact: string;
}

export const StockpileAiInsightTab: React.FC<StockpileAiInsightTabProps> = ({
  stockpiles,
  movements,
  blendingPlans,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<AiQueryPreset | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const presets: AiQueryPreset[] = [
    {
      title: "Risiko Kongesti Tonnage ROM-02",
      query: "Analisis tingkat kepenuhan ROM Stockpile B (Pit 2 East) dan rekomendasi pengalihan dump.",
      problem: "Kapasitas ROM Stockpile B mencapai 93.6% (46,800 Ton dari max 50,000 Ton). Risiko overtopping dalam 12 jam ke depan.",
      cause: "Tingginya rate hauling dari Pit 2 East (12,000 Ton/hari) sementara feed Crusher CP-01 diprioritaskan untuk ROM Pad 1 High GAR.",
      recommendation: "1. Alihkan 40% armada DT-100 dari Pit 2 East ke ROM Pad 1\n2. Eksekusi rehandling order RH-03 sebanyak 5,000 Ton ke Temporary Yard B\n3. Tingkatkan feed Crusher CP-02 ke 800 Ton/jam",
      impact: "Mencegah stop operasi pit 2 East senilai estimasi potensi rugi IDR 450 Juta/hari akibat antrean truck dumping.",
    },
    {
      title: "Optimasi Blending Vessel Target 5,000 GAR",
      query: "Rekomendasi rasio blending terbaik dari Stockpile PROD-01 dan PROD-02 untuk kontrak ekspor MV Coal Star.",
      problem: "Clean Coal Stockpile 02 memiliki kadar Ash 9.8% (out of spec kontrak max 8.5%), namun harga murah.",
      cause: "Karakteristik batubara dari Seam B Pit 2 memiliki kandungan parting/clay lebih tinggi.",
      recommendation: "Gunakan rasio Blending 55% Product Stockpile 1A (5,230 GAR, Ash 6.6%) + 45% Clean Coal 02 (4,650 GAR, Ash 9.8%). Hasil kalkulasi CV 4,969 GAR dan Ash 8.04% (ON SPEC).",
      impact: "Mencegah pinalti klaim reject palka kapal senilai USD 35,000 sekaligus menghemat biaya rewashing.",
    },
    {
      title: "Audit Variansi Survey Drone DTM Clean Coal 02",
      query: "Mengapa stok sistem Clean Coal 02 beda 1,100 Ton (-5.64%) dibanding fisik survey DTM?",
      problem: "Terdapat variansi negatif -5.64% antara stok tercatat sistem (19,500 Ton) vs hasil pemetaan survey drone (18,400 Ton).",
      cause: "1. Penyusutan kadar air (Total Moisture loss 2.5%) akibat penumpukan aging 35 hari di bawah sinar matahari\n2. Unrecorded rehandling movement pada Shift 2 tanggal 11 Agustus.",
      recommendation: "Lakukan adjustment stok -500 Ton akibat moisture evaporation loss dan terbitkan BAP investigasi shift operator.",
      impact: "Meningkatkan akurasi mass balance stok ke level 99.2% dan mematuhi audit SOX / IUP.",
    },
  ];

  const handleSelectPreset = (preset: AiQueryPreset) => {
    setIsThinking(true);
    setSelectedPreset(null);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsThinking(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery) return;
    setIsThinking(true);
    setTimeout(() => {
      setSelectedPreset({
        title: "Analisis Query Kustom AI",
        query: customQuery,
        problem: "Analisis berdasarkan data telemetri stockpile real-time site BBNU-01.",
        cause: "Pola variabilitas hauling, crusher throughput, dan spesifikasi kadar air harian.",
        recommendation: "Optimalkan jadwal feeder crusher dan siapkan buffer blending di port jetty yard.",
        impact: "Efisiensi operasional meningkat 8.4% dan meminimalisir rehandling cost.",
      });
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Stockpile AI Intelligence & Prescriptive Analytics Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Asisten cerdas kecerdasan buatan untuk optimasi blending batubara, analisis risiko spillage, dan audit variansi tonase.
          </p>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div>
        <p className="text-xs font-bold text-slate-500 mb-2">Pilih Rekomendasi Skenario Analisis AI:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(p)}
              className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-amber-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <Bot className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xs">{p.title}</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{p.query}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input Bar */}
      <form onSubmit={handleCustomSubmit} className="relative">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Tanyakan analisis AI seputar stockpile (misal: 'Berapa biaya rehandling MTD dan potensi penghematan?')..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-4 pr-12 text-xs text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 rounded-xl bg-amber-500 p-2 text-slate-950 hover:bg-amber-400 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* AI Response Card Structure */}
      {isThinking ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-amber-500 animate-spin" />
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-3">AI Sedang Menganalisis Neraca Stockpile & Assay Quality...</p>
        </div>
      ) : selectedPreset ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
              {selectedPreset.title}
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            {/* Problem & Cause */}
            <div className="space-y-3">
              <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
                <span className="font-extrabold text-red-600 dark:text-red-400 text-xs block mb-1">
                  1. PROBLEM IDENTIFIED (Masalah)
                </span>
                <p className="text-slate-700 dark:text-slate-300">{selectedPreset.problem}</p>
              </div>

              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs block mb-1">
                  2. ROOT CAUSE (Penyebab Utama)
                </span>
                <p className="text-slate-700 dark:text-slate-300">{selectedPreset.cause}</p>
              </div>
            </div>

            {/* Recommendation & Impact */}
            <div className="space-y-3">
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs block mb-1">
                  3. PRESCRIPTIVE RECOMMENDATION (Tindakan)
                </span>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{selectedPreset.recommendation}</p>
              </div>

              <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xs block mb-1">
                  4. ESTIMATED BUSINESS IMPACT (Dampak Bisnis)
                </span>
                <p className="text-slate-700 dark:text-slate-300">{selectedPreset.impact}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
