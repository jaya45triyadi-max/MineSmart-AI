// MINE SMART AI - AI Mine Planning Scenario Comparison & Optimization Engine
// Comparing Scenario A, Scenario B, and Scenario C (Production, Cost, SR, Hauling Distance) with AI Recommendations

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  TrendingUp,
  Scale,
  DollarSign,
  Fuel,
  Route,
  Target,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  MiningScenario,
  AIScenarioRecommendation,
  MinePlan,
} from "../../../types/minePlanningTypes";
import { MinePlanningRepository } from "../../../services/repositories/MinePlanningRepository";

interface AIMinePlanningScenarioViewProps {
  onScenarioApplied?: (scenarioName: string) => void;
}

export const AIMinePlanningScenarioView: React.FC<AIMinePlanningScenarioViewProps> = ({
  onScenarioApplied,
}) => {
  const [scenarios, setScenarios] = useState<MiningScenario[]>(
    MinePlanningRepository.getScenarios()
  );
  const [recommendation, setRecommendation] = useState<AIScenarioRecommendation>(
    MinePlanningRepository.getAIRecommendation()
  );
  const [selectedScenario, setSelectedScenario] = useState<MiningScenario>(
    scenarios.find((s) => s.isRecommendedByAI) || scenarios[0]
  );
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  // Custom What-If Adjustments
  const [customFuelPriceImpact, setCustomFuelPriceImpact] = useState<number>(0);
  const [customCoalPriceUSD, setCustomCoalPriceUSD] = useState<number>(70);

  const handleApplyScenario = (scen: MiningScenario) => {
    setIsApplying(true);
    setTimeout(() => {
      MinePlanningRepository.applyRecommendedScenario(scen.scenarioCode);
      setIsApplying(false);
      setAppliedSuccess(
        `Sukses! ${scen.name} telah diterapkan sebagai acuan operasional pada Rencana Tambang Aktif (LTP/MTP/Weekly).`
      );
      if (onScenarioApplied) {
        onScenarioApplied(scen.name);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="h-64 w-64 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> AI MINE PLANNING DECISION ENGINE
              </span>
              <span className="text-xs text-amber-300/80 font-mono">
                Multi-Scenario Trade-Off Evaluator
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Komparasi Skenario Tambang & Rekomendasi AI
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              AI membandingkan berbagai skenario tambang secara komprehensif berdasarkan 4 pilar utama: <strong>Volume Produksi (Coal & OB)</strong>, <strong>Struktur Biaya (Mining & Stripping Cost)</strong>, <strong>Strip Ratio (SR)</strong>, dan <strong>Jarak Hauling (Cycle Time & Konsumsi Fuel)</strong>, kemudian memberikan rekomendasi strategis terbaik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Confidence Score</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {recommendation.confidenceScorePercent}%
              </span>
            </div>
            <button
              onClick={() => handleApplyScenario(selectedScenario)}
              disabled={isApplying}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isApplying ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Sinkronisasi Rencana...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Terapkan {selectedScenario.scenarioCode.replace("_", " ")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {appliedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <span>{appliedSuccess}</span>
            <button
              onClick={() => setAppliedSuccess(null)}
              className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Side-by-Side 3 Scenario Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scen) => {
          const isSelected = selectedScenario.id === scen.id;
          const isRec = scen.isRecommendedByAI;

          return (
            <div
              key={scen.id}
              onClick={() => setSelectedScenario(scen)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "border-amber-500 bg-white dark:bg-slate-900 shadow-xl ring-2 ring-amber-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {isRec && (
                <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI RECOMMENDED
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    {scen.scenarioCode.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    AI Score: <strong className="text-amber-500">{scen.aiScore}/100</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {scen.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {scen.subtitle}
                  </p>
                </div>

                {/* 4 Pillars Mini KPIs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 block font-sans">1. Produksi Batubara:</span>
                    <span className="font-bold text-amber-500">{scen.metrics.coalProductionMt} Mt</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 block font-sans">2. Margin / Ton:</span>
                    <span className="font-bold text-emerald-500">${scen.metrics.profitMarginPerTonUSD}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 block font-sans">3. Strip Ratio (SR):</span>
                    <span className="font-bold text-teal-500">{scen.metrics.actualStripRatio} : 1</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 block font-sans">4. Jarak Hauling:</span>
                    <span className="font-bold text-sky-500">{scen.metrics.averageHaulDistanceKm} km</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Klik untuk telaah komprehensif</span>
                <ChevronRight className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive 4-Pillars Side-by-Side Comparison Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">
              HEAD-TO-HEAD TRADE-OFF COMPARISON MATRIX
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Perbandingan Mendalam: Skenario A vs Skenario B vs Skenario C
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dianalisis oleh AI Engineering Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-400 font-bold font-sans">
                <th className="p-3">Parameter Evaluasi Tambang</th>
                <th className="p-3 bg-amber-500/5 text-amber-600 dark:text-amber-400">Skenario A (High Volume Push)</th>
                <th className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Skenario B (AI Optimal) ⭐</th>
                <th className="p-3 bg-sky-500/5 text-sky-600 dark:text-sky-400">Skenario C (Low Cost Selective)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {/* PILAR 1: PRODUKSI */}
              <tr className="bg-slate-100/50 dark:bg-slate-950/40 font-sans font-black text-[11px] text-slate-500">
                <td colSpan={4} className="p-2.5">
                  1. PILAR PRODUKSI (VOLUME & RECOVERY)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Target Produksi Batubara</td>
                <td className="p-3 font-bold text-amber-500">{scenarios[0].metrics.coalProductionMt} Juta Ton</td>
                <td className="p-3 font-black text-emerald-500">{scenarios[1].metrics.coalProductionMt} Juta Ton</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{scenarios[2].metrics.coalProductionMt} Juta Ton</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Pengupasan Overburden (OB)</td>
                <td className="p-3 text-rose-500 font-bold">{scenarios[0].metrics.obRemovalMbc} Mbc</td>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{scenarios[1].metrics.obRemovalMbc} Mbc</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{scenarios[2].metrics.obRemovalMbc} Mbc</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Rata-rata Kalori (GAR)</td>
                <td className="p-3">{scenarios[0].metrics.averageGarKcal} kcal/kg</td>
                <td className="p-3 font-bold text-emerald-500">{scenarios[1].metrics.averageGarKcal} kcal/kg</td>
                <td className="p-3 font-bold text-amber-500">{scenarios[2].metrics.averageGarKcal} kcal/kg</td>
              </tr>

              {/* PILAR 2: STRIP RATIO */}
              <tr className="bg-slate-100/50 dark:bg-slate-950/40 font-sans font-black text-[11px] text-slate-500">
                <td colSpan={4} className="p-2.5">
                  2. PILAR STRIP RATIO (SR EFISIENSI)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Actual Strip Ratio (SR)</td>
                <td className="p-3 text-rose-500 font-bold">{scenarios[0].metrics.actualStripRatio} : 1 (Tinggi)</td>
                <td className="p-3 font-black text-emerald-500">{scenarios[1].metrics.actualStripRatio} : 1 (Ideal RKAB)</td>
                <td className="p-3 font-bold text-teal-500">{scenarios[2].metrics.actualStripRatio} : 1 (Rendah)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Break-Even Strip Ratio (BESR)</td>
                <td className="p-3 text-slate-500">{scenarios[0].metrics.economicBreakEvenSR} : 1</td>
                <td className="p-3 text-slate-500">{scenarios[1].metrics.economicBreakEvenSR} : 1</td>
                <td className="p-3 text-slate-500">{scenarios[2].metrics.economicBreakEvenSR} : 1</td>
              </tr>

              {/* PILAR 3: JARAK HAULING & FUEL */}
              <tr className="bg-slate-100/50 dark:bg-slate-950/40 font-sans font-black text-[11px] text-slate-500">
                <td colSpan={4} className="p-2.5">
                  3. PILAR JARAK HAULING & KONSUMSI FUEL
                </td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Jarak Haul 1-Arah Rata-rata</td>
                <td className="p-3 text-rose-500 font-bold">{scenarios[0].metrics.averageHaulDistanceKm} km</td>
                <td className="p-3 font-black text-emerald-500">{scenarios[1].metrics.averageHaulDistanceKm} km (-30% lebih dekat)</td>
                <td className="p-3 font-bold text-teal-500">{scenarios[2].metrics.averageHaulDistanceKm} km</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Cycle Time Ritase</td>
                <td className="p-3 text-rose-500">{scenarios[0].metrics.cycleTimeMinutes} Menit</td>
                <td className="p-3 font-bold text-emerald-500">{scenarios[1].metrics.cycleTimeMinutes} Menit</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{scenarios[2].metrics.cycleTimeMinutes} Menit</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Konsumsi Solar per Hari</td>
                <td className="p-3 text-rose-500 font-bold">{scenarios[0].metrics.totalFuelLitersPerDay.toLocaleString()} L/hari</td>
                <td className="p-3 font-black text-emerald-500">{scenarios[1].metrics.totalFuelLitersPerDay.toLocaleString()} L/hari (Hemat 41.7k L)</td>
                <td className="p-3 text-teal-500 font-bold">{scenarios[2].metrics.totalFuelLitersPerDay.toLocaleString()} L/hari</td>
              </tr>

              {/* PILAR 4: STRUKTUR BIAYA & PROFIT */}
              <tr className="bg-slate-100/50 dark:bg-slate-950/40 font-sans font-black text-[11px] text-slate-500">
                <td colSpan={4} className="p-2.5">
                  4. PILAR BIAYA (COST & FINANCIAL RETURN)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Biaya Pengupasan OB ($/BCM)</td>
                <td className="p-3 text-rose-500 font-bold">${scenarios[0].metrics.strippingCostPerBcmUSD} / BCM</td>
                <td className="p-3 font-bold text-emerald-500">${scenarios[1].metrics.strippingCostPerBcmUSD} / BCM</td>
                <td className="p-3 font-bold text-teal-500">${scenarios[2].metrics.strippingCostPerBcmUSD} / BCM</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Total OPEX Tambang</td>
                <td className="p-3 text-rose-500 font-bold">${(scenarios[0].metrics.totalOpexUSD / 1000000).toFixed(1)} Juta</td>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">${(scenarios[1].metrics.totalOpexUSD / 1000000).toFixed(1)} Juta</td>
                <td className="p-3 font-bold text-teal-500">${(scenarios[2].metrics.totalOpexUSD / 1000000).toFixed(1)} Juta</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-bold text-slate-700 dark:text-slate-300">Profit Margin per Ton</td>
                <td className="p-3 text-amber-500 font-bold">${scenarios[0].metrics.profitMarginPerTonUSD} / Ton</td>
                <td className="p-3 font-black text-emerald-500 text-sm">${scenarios[1].metrics.profitMarginPerTonUSD} / Ton</td>
                <td className="p-3 font-bold text-teal-500">${scenarios[2].metrics.profitMarginPerTonUSD} / Ton</td>
              </tr>
              <tr className="bg-emerald-500/5 font-black">
                <td className="p-3 font-sans text-slate-900 dark:text-white">Net Present Value (NPV @10%)</td>
                <td className="p-3 text-amber-500">${scenarios[0].metrics.npvUSDMillion} M</td>
                <td className="p-3 text-emerald-500 text-sm">${scenarios[1].metrics.npvUSDMillion} M (TERTINGGI)</td>
                <td className="p-3 text-teal-500">${scenarios[2].metrics.npvUSDMillion} M</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Deep Intelligence Report */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5 md:p-6 space-y-4 text-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bot className="h-6 w-6 text-amber-400" />
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
              AI CHIEF MINE PLANNER RECOMMENDATION
            </span>
            <h3 className="text-lg font-black text-white">
              {recommendation.recommendedScenarioName}
            </h3>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {recommendation.executiveSummary}
        </p>

        {/* Financial & Operational Trade-Off Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <DollarSign className="h-4 w-4" /> Keunggulan Finansial & Margin
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {recommendation.financialAdvantage}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5 uppercase">
              <Route className="h-4 w-4" /> Keunggulan Operasional & Rute Hauling
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {recommendation.operationalAdvantage}
            </p>
          </div>
        </div>

        {/* Actionable Roadmap */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Zap className="h-4 w-4" /> Langkah Tindak Lanjut Rencana Tambang (Actionable Roadmap):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recommendation.actionableRoadmap.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
              >
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity Analysis Box */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Uji Sensitivitas AI (What-If Stress Testing):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
            <div>
              <span className="text-amber-400 block font-bold text-[10px]">Solar Naik +20%:</span>
              <p className="text-[11px] mt-0.5">{recommendation.sensitivityAnalysis.fuelPricePlus20PercentImpact}</p>
            </div>
            <div>
              <span className="text-rose-400 block font-bold text-[10px]">Harga Batubara Turun -15%:</span>
              <p className="text-[11px] mt-0.5">{recommendation.sensitivityAnalysis.coalPriceDrop15PercentImpact}</p>
            </div>
            <div>
              <span className="text-sky-400 block font-bold text-[10px]">Dampak Musim Hujan:</span>
              <p className="text-[11px] mt-0.5">{recommendation.sensitivityAnalysis.rainySeasonDisruptionImpact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
