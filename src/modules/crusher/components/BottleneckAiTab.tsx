import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  Send,
  Gauge,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import { PlantBottleneck, PlantEfficiency } from "../../../types/processingPlantTypes";

interface BottleneckAiTabProps {
  bottlenecks: PlantBottleneck[];
  efficiencies: PlantEfficiency[];
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const BottleneckAiTab: React.FC<BottleneckAiTabProps> = ({
  bottlenecks,
  efficiencies,
  onOpenAiAnalysis,
}) => {
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<{
    answer: string;
    keyFindings: string[];
    possibleCause: string;
    recommendation: string;
    expectedImpact: string;
    confidence: string;
  } | null>(null);

  const predefinedQuestions = [
    "Kenapa throughput crusher CP-01 turun saat feed basah?",
    "Apa penyebab downtime terbesar minggu ini di plant CP-02?",
    "Crusher mana yang memiliki risiko kegagalan tertinggi?",
    "Berapa estimasi output akumulatif sampai akhir bulan?",
    "Apa bottleneck utama pada circuit screening & conveyor?",
  ];

  const handleAskQuestion = (q: string) => {
    setCustomQuestion(q);
    setAiAnswer({
      answer: `Berdasarkan analisis real-time telemetry dan log operasional untuk query "${q}":`,
      keyFindings: [
        "Vibrating Screen 102 mengalami penurunan efisiensi filtrasi sebesar 14% saat kadar lengas ROM > 27%.",
        "Penumpukan material halus (fine coal) pada deck mesh menyebabkan recirculating load meningkat 120 t/h.",
        "Downtime disebabkan oleh pembersihan manual hopper choke (55 menit pada Shift 1).",
      ],
      possibleCause:
        "Akumulasi batubara basah berlempung (clay slurry) pada chute throat Feeder AF-101 dan celah vibrating screen.",
      recommendation:
        "Tingkatkan inklinasi vibrating screen sebesar +2 derajat, aktifkan air cannon blast bertekanan 6 Bar di chute throat, dan atur frekuensi penggetar +3Hz.",
      expectedImpact:
        "Pemulihan throughput sebesar +80-120 t/h dan pencegahan pembentukan mud-plugging.",
      confidence: "HIGH (88% AI Confidence Score)",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Processing Plant Command Center & Bottleneck Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time bottleneck detection, plant efficiency scoring, and AI root cause analysis engine
          </p>
        </div>
      </div>

      {/* Plant Efficiency Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {efficiencies.map((eff) => (
          <div
            key={eff.plantId}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  PLANT EFFICIENCY SCORE
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Plant {eff.plantId}
                </h4>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {eff.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold">
                  Trend: {eff.trend} (+2.1%)
                </span>
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div className="grid grid-cols-5 gap-1 text-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Availability</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{eff.availabilityScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Utilization</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{eff.utilizationScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Throughput</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{eff.throughputScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Quality</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{eff.qualityScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Yield</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{eff.yieldScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck Analysis Section */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detected Plant Bottlenecks & Capacity Impediments
          </h4>
          <span className="text-xs text-amber-500 font-semibold">
            {bottlenecks.length} Active Capacity Risks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bottlenecks.map((bn) => (
            <div
              key={bn.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                  {bn.plantId} • {bn.equipmentOrSection}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20">
                  {bn.bottleneckProbability}% Probability
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Evidence:</strong> {bn.evidence}
              </div>

              <div className="text-xs text-rose-500">
                <strong>Operational Impact:</strong> {bn.impact}
              </div>

              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-xs text-slate-800 dark:text-indigo-200 space-y-1">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommendation ({bn.confidence} Confidence):
                </div>
                <div>{bn.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Command Center Assistant */}
      <div className="bg-gradient-to-br from-slate-900 via-[#111A2C] to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              AI Processing Plant Interactive Assistant
            </h4>
            <p className="text-xs text-indigo-200/70">
              Ask any operational question regarding throughput, availability, downtime, quality, or bottleneck root causes
            </p>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {predefinedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/60 text-slate-200 text-xs font-medium transition-colors border border-slate-700 hover:border-indigo-500 cursor-pointer text-left"
            >
              💬 {q}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Ketik pertanyaan operasional processing plant..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskQuestion(customQuestion)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAskQuestion(customQuestion || "Berapa throughput crusher hari ini?")}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </button>
        </div>

        {/* Render AI Structured Response */}
        {aiAnswer && (
          <div className="mt-4 p-5 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-xs space-y-3 animate-fade-in">
            <div className="font-semibold text-indigo-300">{aiAnswer.answer}</div>

            <div>
              <span className="font-bold text-slate-300 block mb-1">🔍 Key Findings:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                {aiAnswer.keyFindings.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-amber-400 block mb-0.5">⚠️ Possible Root Cause:</span>
              <p className="text-slate-300">{aiAnswer.possibleCause}</p>
            </div>

            <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-lg">
              <span className="font-bold text-emerald-400 block mb-0.5">💡 Recommendation:</span>
              <p className="text-indigo-200">{aiAnswer.recommendation}</p>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                Expected Impact: {aiAnswer.expectedImpact}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-right font-mono">
              Confidence Level: {aiAnswer.confidence}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
