// MINE SMART AI - Dispatch Optimization & Scenario Planning View

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Users,
} from "lucide-react";

import { DispatchScenarioResult, DispatchOptimizationAudit } from "../../../types/dispatchTypes";

interface DispatchOptimizationViewProps {
  scenarios: DispatchScenarioResult[];
  audits: DispatchOptimizationAudit[];
  onRunScenario: (scenarioName: string, targetTon: number) => void;
  onApplyOptimization: (scenario: DispatchScenarioResult) => void;
}

export const DispatchOptimizationView: React.FC<DispatchOptimizationViewProps> = ({
  scenarios,
  audits,
  onRunScenario,
  onApplyOptimization,
}) => {
  const [scenarioName, setScenarioName] = useState("Optimasi Shift Siang - Target Coal 8,500 Ton");
  const [targetTon, setTargetTon] = useState(8500);
  const [shiftHours, setShiftHours] = useState(10);
  const [maxTrucksPerEx, setMaxTrucksPerEx] = useState(6);
  const [minTrucksPerEx, setMinTrucksPerEx] = useState(3);

  // Review & Apply Modal State
  const [reviewScenario, setReviewScenario] = useState<DispatchScenarioResult | null>(null);
  const [hasPermission, setHasPermission] = useState(true); // Permission check simulation: dispatch.optimize.apply
  const [applyConfirmed, setApplyConfirmed] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    onRunScenario(scenarioName, targetTon);
  };

  const handleConfirmApply = () => {
    if (reviewScenario) {
      onApplyOptimization(reviewScenario);
      setApplyConfirmed(true);
      setTimeout(() => {
        setApplyConfirmed(false);
        setReviewScenario(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              DISPATCH OPTIMIZATION CENTER & SCENARIO SIMULATOR
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mesin optimasi alokasi armada berbasis AI untuk meminimalkan antrean dan memaksimalkan target produksi shift
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-xl border border-indigo-500/30 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Guardrail Active: Permission Check [dispatch.optimize.apply]</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scenario Input Configurator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4" />
            <span>KONFIGURASI SCENARIO OPTIMASI</span>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nama Skenario</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Produksi (Ton)</label>
              <input
                type="number"
                value={targetTon}
                onChange={(e) => setTargetTon(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Durasi Shift (Jam)</label>
                <input
                  type="number"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Max DT / Excavator</label>
                <input
                  type="number"
                  value={maxTrucksPerEx}
                  onChange={(e) => setMaxTrucksPerEx(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jalankan Simulasi Optimasi</span>
            </button>
          </form>
        </div>

        {/* Right Column: Scenario Comparison & Results */}
        <div className="lg:col-span-2 space-y-6">
          {scenarios.map((scen) => (
            <div key={scen.scenarioId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-black text-white">{scen.scenarioName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {scen.scenarioId} | Confidence: {scen.confidencePercent}%</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    scen.status === "APPLIED"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      : "bg-indigo-950 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {scen.status}
                </span>
              </div>

              {/* Metrics Comparison: Current vs AI Recommended */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Expected Production</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">{scen.expectedProductionTon} Ton</span>
                  <span className="text-[9px] text-emerald-300">+1.8% di atas target</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Expected Cycle Time</span>
                  <span className="text-lg font-black text-sky-400 font-mono mt-1 block">{scen.expectedCycleTimeMin} m</span>
                  <span className="text-[9px] text-slate-400">-3.6 min hemat waktu</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Queue Reduction</span>
                  <span className="text-lg font-black text-rose-400 font-mono mt-1 block">-{scen.expectedQueueReductionPercent}%</span>
                  <span className="text-[9px] text-rose-300">Pengurangan antrean</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fleet Utilization</span>
                  <span className="text-lg font-black text-indigo-400 font-mono mt-1 block">{scen.expectedUtilizationPercent}%</span>
                  <span className="text-[9px] text-slate-400">Pemanfaatan armada</span>
                </div>
              </div>

              {/* AI Summary Statement */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl space-y-1 text-xs">
                <strong className="text-indigo-300 block uppercase font-bold text-[10px]">Ringkasan AI Recommendation:</strong>
                <p className="text-slate-200">{scen.aiSummary}</p>
              </div>

              {/* Action Button */}
              {scen.status !== "APPLIED" && (
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setReviewScenario(scen)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Review Changes & Apply Optimization</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Optimization Audit History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              AUDIT TRAIL LOG OPTIMASI DISPATCH ({audits.length})
            </h4>

            <div className="space-y-3">
              {audits.map((a) => (
                <div key={a.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-amber-300">{a.scenarioName}</span>
                    <span className="text-slate-400 text-[10px]">{a.appliedAt.slice(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="text-slate-300">{a.recommendationSummary}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Applied By: {a.appliedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Changes & Authorization Modal */}
      {reviewScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <h3>REVIEW CHANGES & AUTHORIZE OPTIMIZATION</h3>
              </div>
              <button onClick={() => setReviewScenario(null)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Affected Fleet Units:</span>
                <p className="text-white font-mono font-bold">2 Dump Trucks (DT-107, DT-108)</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Action Plan:</span>
                <p className="text-amber-300 font-mono">Reassign DT-107 & DT-108 dari EX-201 (Pit 1) ke EX-202 (Pit 2)</p>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl space-y-1">
                <span className="text-emerald-400 text-[10px] uppercase font-bold block">Expected Outcome:</span>
                <p className="text-emerald-200">Antrean Pit 1 berkurang 62%. Target produksi shift 8,500 ton tercapai.</p>
              </div>

              {applyConfirmed ? (
                <div className="p-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-center">
                  ✓ Optimization Plan Applied Successfully!
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setReviewScenario(null)}
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmApply}
                    className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl cursor-pointer"
                  >
                    Authorize & Apply Plan Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
