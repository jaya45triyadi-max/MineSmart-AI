// MINE SMART AI - Equipment Health Score & Transparency View

import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Info,
  Clock,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  X,
  Cpu,
  Database,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { EquipmentHealthScore } from "../../types/predictiveTypes";

interface EquipmentHealthViewProps {
  healthScores: EquipmentHealthScore[];
  onOpenAIAssistant: () => void;
}

export const EquipmentHealthView: React.FC<EquipmentHealthViewProps> = ({
  healthScores,
  onOpenAIAssistant,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<EquipmentHealthScore | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredScores = healthScores.filter((hs) => {
    const matchesSearch =
      hs.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hs.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hs.brandModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || hs.category === filterCategory;
    const matchesStatus = filterStatus === "ALL" || hs.statusCategory === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>Equipment Health Score Engine (0–100)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penilaian kesehatan unit berdasarkan riwayat maintenance, frekuensi breakdown, MTBF/MTTR, umur komponen, dan sensor telemetry.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis AI Health</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Unit Code / Kategori / Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Excavator">Excavator</option>
            <option value="Dump Truck">Dump Truck</option>
            <option value="Dozer">Dozer</option>
            <option value="Grader">Grader</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">Semua Status Health</option>
            <option value="Excellent">Excellent (90-100)</option>
            <option value="Good">Good (75-89)</option>
            <option value="Watch">Watch (60-74)</option>
            <option value="Poor">Poor (40-59)</option>
            <option value="Critical">Critical (0-39)</option>
          </select>
        </div>
      </div>

      {/* Equipment Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScores.map((hs) => {
          const getStatusBadgeClass = (status: string) => {
            switch (status) {
              case "Excellent":
                return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
              case "Good":
                return "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30";
              case "Watch":
                return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
              case "Poor":
                return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
              case "Critical":
                return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
              default:
                return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
            }
          };

          return (
            <div
              key={hs.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-base">{hs.unitCode}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({hs.category})</span>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(
                      hs.statusCategory
                    )}`}
                  >
                    {hs.statusCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hs.brandModel} • {hs.engineHours} SMU</p>
              </div>

              {/* Main Score & Risk Block */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80">
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">HEALTH SCORE</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                    {hs.healthScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">RISK LEVEL</p>
                  <span
                    className={`inline-block mt-1 font-black text-xs px-2 py-0.5 rounded ${
                      hs.riskLevel === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-500"
                        : hs.riskLevel === "HIGH"
                        ? "bg-orange-500/20 text-orange-500"
                        : hs.riskLevel === "MEDIUM"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-emerald-500/20 text-emerald-500"
                    }`}
                  >
                    {hs.riskLevel}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-slate-950/40">
                  <span className="text-[10px] text-slate-400 font-medium block">Failure Prob</span>
                  <span className="font-bold text-slate-900 dark:text-white">{hs.failureProbabilityPercent}%</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-slate-950/40">
                  <span className="text-[10px] text-slate-400 font-medium block">Pred. Downtime</span>
                  <span className="font-bold text-slate-900 dark:text-white">{hs.predictedDowntimeHours} hours</span>
                </div>
              </div>

              {/* Telematics Banner */}
              {!hs.isTelematicsConnected && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>Prediction based on available historical data</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => setSelectedUnit(hs)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>VIEW AI ANALYSIS</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Health Score Transparency Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedUnit.unitCode}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    ({selectedUnit.category} - {selectedUnit.brandModel})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Health Score Factor Transparency & AI Evidence Analysis
                </p>
              </div>

              <button
                onClick={() => setSelectedUnit(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score Overview Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 sm:space-y-0">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl">
                  {selectedUnit.healthScore}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base">
                    Overall Health Score: {selectedUnit.healthScore} / 100
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Category: {selectedUnit.statusCategory} • Risk: {selectedUnit.riskLevel}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Confidence: <span className="font-bold text-slate-900 dark:text-white">{selectedUnit.confidencePercent}%</span></p>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Sufficiency: <span className="font-bold text-emerald-500">{selectedUnit.dataSufficiency}</span>
                </p>
              </div>
            </div>

            {!selectedUnit.isTelematicsConnected && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                <span>Prediction based on available historical data (Telematics offline or not connected).</span>
              </div>
            )}

            {/* Factor Contribution Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Factor Contribution Breakdown</h4>
              <div className="space-y-2">
                {selectedUnit.factorContributions.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-950/60 gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{f.factor}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                            f.statusName === "Good"
                              ? "bg-emerald-500/20 text-emerald-500"
                              : f.statusName === "Warning"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-rose-500/20 text-rose-500"
                          }`}
                        >
                          {f.statusName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.valueDisplay}</p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-black text-slate-900 dark:text-white">
                        +{f.scoreContribution} pts
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">({f.weightPercent}% weight)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources Footer */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Database className="h-4 w-4 text-emerald-500" />
                <span>Audited Data Sources</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedUnit.dataSources.map((ds, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-200/60 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium"
                  >
                    {ds}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Last updated at: {new Date(selectedUnit.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
