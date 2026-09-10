// MINE SMART AI - Survey Progress Comparison Center (Multi-Temporal Surface vs RKAB Mine Plan)

import React, { useState } from "react";
import {
  TrendingUp,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  BarChart3,
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Box,
  Compass,
  Download,
} from "lucide-react";
import { ProgressComparisonRecord, SurveySurface } from "../../../types/surveyTypes";

interface ProgressComparisonViewProps {
  progressComparisons: ProgressComparisonRecord[];
  surfaces: SurveySurface[];
  onAddComparisonSubmit?: (pcomp: ProgressComparisonRecord) => void;
  onOpenAIAnalyze?: (pcomp: ProgressComparisonRecord) => void;
}

export const ProgressComparisonView: React.FC<ProgressComparisonViewProps> = ({
  progressComparisons,
  surfaces,
  onAddComparisonSubmit,
  onOpenAIAnalyze,
}) => {
  const [selectedComp, setSelectedComp] = useState<ProgressComparisonRecord>(
    progressComparisons[0] || null
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Progress Comparison Center (EOM & Weekly vs Mine Plan RKAB)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Komparasi multi-temporal kemajuan penggalian Overburden (BCM) dan Batubara (Ton) terhadap target model desain tambang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedComp && (
            <button
              onClick={() => {
                const reportContent = `MINE SMART AI - LAPORAN KOMPARASI PROGRES TAMBANG
ID: ${selectedComp.comparisonId}
Judul: ${selectedComp.title}
Area: ${selectedComp.pitArea}
Base Surface: ${selectedComp.baseSurface.name} (${selectedComp.baseSurface.surveyDate})
Target Surface: ${selectedComp.targetSurface.name} (${selectedComp.targetSurface.surveyDate})
Plan Model: ${selectedComp.planModelName}

1. OVERBURDEN REMOVAL:
- Aktual: ${selectedComp.actualExcavationBcm.toLocaleString()} BCM
- Rencana: ${selectedComp.planExcavationBcm.toLocaleString()} BCM
- Deviasi: ${selectedComp.excavationVarianceBcm.toLocaleString()} BCM (${selectedComp.excavationCompliancePct}%)

2. COAL MINING:
- Aktual: ${selectedComp.actualCoalTons.toLocaleString()} Ton
- Rencana: ${selectedComp.planCoalTons.toLocaleString()} Ton
- Deviasi: ${selectedComp.coalVarianceTons.toLocaleString()} Ton (${selectedComp.coalCompliancePct}%)
`;
                const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Progress_Comparison_${selectedComp.comparisonId}.txt`;
                link.click();
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Laporan</span>
            </button>
          )}
        </div>
      </div>

      {selectedComp && (
        <div className="space-y-6">
          {/* Main Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* OB Excavation */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-sky-400" />
                  OB Excavation (Aktual)
                </span>
                <span className="font-mono text-emerald-400">{selectedComp.excavationCompliancePct}%</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {selectedComp.actualExcavationBcm.toLocaleString()} <span className="text-xs text-slate-400">BCM</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                <span>Target: {selectedComp.planExcavationBcm.toLocaleString()} BCM</span>
                <span className={selectedComp.excavationVarianceBcm >= 0 ? "text-emerald-400" : "text-amber-400"}>
                  {selectedComp.excavationVarianceBcm > 0 ? "+" : ""}{selectedComp.excavationVarianceBcm.toLocaleString()} BCM
                </span>
              </div>
            </div>

            {/* Coal Mining */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Coal Exposed (Aktual)
                </span>
                <span className="font-mono text-emerald-400">{selectedComp.coalCompliancePct}%</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {selectedComp.actualCoalTons.toLocaleString()} <span className="text-xs text-slate-400">Ton</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                <span>Target: {selectedComp.planCoalTons.toLocaleString()} Ton</span>
                <span className="text-emerald-400">
                  +{selectedComp.coalVarianceTons.toLocaleString()} Ton
                </span>
              </div>
            </div>

            {/* Surface Models Pair */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1.5 shadow-lg">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                Pasangan Model Surface
              </span>
              <div className="text-xs font-bold text-white truncate font-mono">
                {selectedComp.targetSurface.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                vs {selectedComp.baseSurface.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                Periode: {selectedComp.baseSurface.surveyDate} ~ {selectedComp.targetSurface.surveyDate}
              </div>
            </div>

            {/* AI Compliance Status */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Status Kepatuhan Desain
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-mono">
                  {selectedComp.status}
                </span>
                <span className="text-xs text-slate-300">97.5% On Track</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                Analyst: {selectedComp.analyst.split(",")[0]}
              </div>
            </div>
          </div>

          {/* Bench Progression Breakdown Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Kemajuan Vertikal per Jenjang Tambang (Bench RL Drop Progression)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Model: {selectedComp.planModelName}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <th className="p-3 font-semibold font-sans">Nama Jenjang (Bench)</th>
                    <th className="p-3 font-semibold">Elevasi Rencana (RL)</th>
                    <th className="p-3 font-semibold">Elevasi Aktual (RL)</th>
                    <th className="p-3 font-semibold">Penurunan RL (m)</th>
                    <th className="p-3 font-semibold font-sans">Status Progres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedComp.benchProgressions.map((bench, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-white font-sans">{bench.benchName}</td>
                      <td className="p-3 text-slate-300">{bench.targetElevationRl.toFixed(1)} m RL</td>
                      <td className="p-3 text-sky-400 font-bold">{bench.actualElevationRl.toFixed(1)} m RL</td>
                      <td className="p-3 text-emerald-400 font-bold">-{bench.dropRateMeters.toFixed(1)} m</td>
                      <td className="p-3 font-sans">
                        {bench.status === "AHEAD_PLAN" ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                            Ahead of Plan (+0.4m)
                          </span>
                        ) : bench.status === "BEHIND_PLAN" ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                            Behind Plan (-1.2m)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
                            On Track (±0.2m)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
