// MINE SMART AI - Excavator-Truck Matching View

import React, { useState } from "react";
import {
  Layers,
  Truck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Percent,
} from "lucide-react";

import { ExcavatorTruckMatchScore } from "../../../types/dispatchTypes";

interface ExcavatorTruckMatchingViewProps {
  matches: ExcavatorTruckMatchScore[];
  onOpenAI: () => void;
}

export const ExcavatorTruckMatchingView: React.FC<ExcavatorTruckMatchingViewProps> = ({
  matches,
  onOpenAI,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<ExcavatorTruckMatchScore>(matches[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              EXCAVATOR–TRUCK MATCHING & COMPATIBILITY ENGINE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis rasio bucket pass, kesesuaian payload, waktu muat, dan jarak hauling untuk optimasi produktivitas alat
          </p>
        </div>

        <button
          onClick={onOpenAI}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>AI Matching Assistant</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Match Pair Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase font-mono px-1">
            EXCAVATOR-TRUCK MATCH SCORES ({matches.length})
          </h4>

          {matches.map((m, idx) => {
            const isSelected = selectedMatch.excavatorUnitCode === m.excavatorUnitCode && selectedMatch.truckUnitCode === m.truckUnitCode;

            return (
              <div
                key={idx}
                onClick={() => setSelectedMatch(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-sm">
                      {m.excavatorUnitCode} ↔ {m.truckUnitCode}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black font-mono ${
                      m.compatibilityScorePercent >= 90
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        : m.compatibilityScorePercent >= 80
                        ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                        : "bg-rose-950 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    Score: {m.compatibilityScorePercent}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <span className="text-slate-400">Recommended Ratio: <strong className="text-amber-300">{m.recommendedRatio}</strong></span>
                  <span className="text-slate-400 text-right">Cycle: <strong className="text-white">{m.cycleTimeMin} m</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Match Breakdown & AI Recommendation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Match Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl font-bold font-mono">
                  {selectedMatch.excavatorUnitCode} ↔ {selectedMatch.truckUnitCode}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">ANALISIS COMPATIBILITY SCORE</h4>
                  <p className="text-xs text-slate-400">Rasio Kombinasi & Produktivitas Muat-Angkut</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {selectedMatch.compatibilityScorePercent}%
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Overall Match</p>
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Kapasitas Match</p>
                <p className="text-lg font-black text-emerald-400 font-mono mt-1">{selectedMatch.capacityMatchPercent}%</p>
                <p className="text-[9px] text-slate-400">{selectedMatch.excavatorCapacityM3} m³ bucket / {selectedMatch.truckPayloadTon} Ton</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Distance Factor</p>
                <p className="text-lg font-black text-sky-400 font-mono mt-1">{selectedMatch.distanceScore}%</p>
                <p className="text-[9px] text-slate-400">Jarak hauling terkalibrasi</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Cycle Time</p>
                <p className="text-lg font-black text-amber-300 font-mono mt-1">{selectedMatch.cycleTimeMin} m</p>
                <p className="text-[9px] text-slate-400">Waktu total 1 putaran</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Queue Index</p>
                <p className="text-lg font-black text-rose-400 font-mono mt-1">{selectedMatch.queueMin} m</p>
                <p className="text-[9px] text-slate-400">Waktu tunggu antrean</p>
              </div>
            </div>

            {/* Match Reason Details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-amber-400 uppercase">Analisis Teknis Pasangan:</p>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedMatch.reason}</p>
            </div>
          </div>

          {/* AI Recommendation Output Card */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI MATCHING RECOMMENDATION FOR DISPATCH</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Recommended Pair:</span>
                <strong className="font-mono text-emerald-400">{selectedMatch.excavatorUnitCode} + {selectedMatch.truckUnitCode} ({selectedMatch.recommendedRatio})</strong>
              </div>

              <div className="flex items-center justify-between text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Alternative Pair:</span>
                <strong className="font-mono text-amber-300">{selectedMatch.excavatorUnitCode} + DT-104 (1 EX : 4 DT)</strong>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Expected Impact (Estimasi/Potential):</span>
                <p className="text-emerald-300 font-medium">{selectedMatch.expectedImpact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
