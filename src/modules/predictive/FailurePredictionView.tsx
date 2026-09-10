// MINE SMART AI - Failure Prediction Center View

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  ShieldAlert,
  Clock,
  Search,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { FailurePrediction } from "../../types/predictiveTypes";

interface FailurePredictionViewProps {
  failurePredictions: FailurePrediction[];
  onOpenAIAssistant: () => void;
}

export const FailurePredictionView: React.FC<FailurePredictionViewProps> = ({
  failurePredictions,
  onOpenAIAssistant,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const componentsList = [
    "ALL",
    "Engine",
    "Hydraulic System",
    "Transmission",
    "Electrical System",
    "Cooling System",
    "Fuel System",
    "Brake System",
    "Tyres / Tracks",
    "Undercarriage",
  ];

  const filteredPredictions = failurePredictions.filter((fp) => {
    const matchesComp = selectedComponent === "ALL" || fp.component === selectedComponent;
    const matchesSearch =
      fp.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fp.potentialFailureType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fp.evidence.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesComp && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <span>AI Component Failure Prediction Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Prediksi statistik potensi kegagalan komponen berdasarkan pola degradasi, analisa oli, dan indikator telemetri.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Failure Patterns</span>
        </button>
      </div>

      {/* Component Filter Pills & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {componentsList.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedComponent(comp)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                selectedComponent === comp
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              }`}
            >
              {comp}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari unit / jenis potensi failure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          Semua proyeksi diklasifikasikan sebagai <strong>Potential Failure</strong> berdasarkan estimasi statistik, bukan kegagalan yang pasti terjadi.
        </span>
      </div>

      {/* Prediction Cards List */}
      <div className="space-y-4">
        {filteredPredictions.map((fp) => (
          <div
            key={fp.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4 hover:border-indigo-500/40 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 font-black text-sm">
                  {fp.unitCode}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {fp.unitCode} • {fp.component}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Category: {fp.category} • Model: <span className="font-mono text-slate-700 dark:text-slate-300">{fp.modelVersion}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Window: {fp.predictionWindow}</span>
                </span>

                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                    fp.riskLevel === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                      : fp.riskLevel === "HIGH"
                      ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {fp.riskLevel} RISK
                </span>
              </div>
            </div>

            {/* Failure Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
              <div className="col-span-2 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">POTENTIAL FAILURE TYPE</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{fp.potentialFailureType}</p>
                
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider pt-2">EVIDENCE & SIGNAL DATA</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{fp.evidence}</p>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">PROBABILITY</p>
                  <p className="text-xl font-black text-rose-500">{fp.probabilityPercent}% <span className="text-xs font-normal text-slate-400">({fp.probabilityCategory})</span></p>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">CONFIDENCE</p>
                  <p className="text-sm font-bold text-emerald-500">{fp.confidencePercent}%</p>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">TIMESTAMP</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(fp.predictionTimestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Recommended Action & Data Sources */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Recommended Action: </span>
                <span className="text-slate-600 dark:text-slate-300">{fp.recommendedAction}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {fp.dataSources.map((ds, idx) => (
                  <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {ds}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
