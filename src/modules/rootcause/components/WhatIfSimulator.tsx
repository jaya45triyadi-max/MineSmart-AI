import React, { useState } from "react";
import { RootCauseCase } from "../../../types/rootCauseTypes";
import {
  Sliders,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";

interface WhatIfSimulatorProps {
  activeCase: RootCauseCase;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ activeCase }) => {
  const [reroutedTrucks, setReroutedTrucks] = useState<number>(2);
  const [maintenanceSpeedHrs, setMaintenanceSpeedHrs] = useState<number>(0.6); // 35 mins
  const [roadGradingActive, setRoadGradingActive] = useState<boolean>(true);

  // Dynamic calculations based on user adjustments
  const baseDeficit = Math.abs(activeCase.primaryMetric.dropPct);
  const recoveryFromReroute = reroutedTrucks * 3.4; // 3.4% per truck balanced
  const recoveryFromMaintenance = Math.max(0, (2.5 - maintenanceSpeedHrs) * 2.8);
  const recoveryFromRoad = roadGradingActive ? 2.5 : 0;

  const totalRecoveryPct = Math.min(
    baseDeficit,
    Number((recoveryFromReroute + recoveryFromMaintenance + recoveryFromRoad).toFixed(1))
  );
  const netDeficitPct = Math.max(0, Number((baseDeficit - totalRecoveryPct).toFixed(1)));
  const recoveredVolumeBcm = Math.round((totalRecoveryPct / 100) * 12500);
  const savedCostMillions = Math.round(recoveredVolumeBcm * 0.076);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              COUNTERFACTUAL & WHAT-IF SIMULATOR
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Simulasi Skenario Penyelamatan Produksi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Uji dampak kombinasi keputusan sebelum eksekusi lapangan secara langsung.
          </p>
        </div>

        <button
          onClick={() => {
            setReroutedTrucks(2);
            setMaintenanceSpeedHrs(0.6);
            setRoadGradingActive(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          Reset Parameter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Controls Slider Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Parameter 1: Truck Re-routing */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <span>1. Jumlah Haul Truck Dialihkan ke Fleet B</span>
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {reroutedTrucks} Unit HD785 (+{(reroutedTrucks * 3.4).toFixed(1)}% recovery)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={reroutedTrucks}
              onChange={(e) => setReroutedTrucks(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0 (No Reroute)</span>
              <span>2 (Optimal Match Factor)</span>
              <span>5 (Max Fleet Transfer)</span>
            </div>
          </div>

          {/* Parameter 2: Maintenance Speed */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white">
                2. Target Waktu Perbaikan EX-03 (MTTR)
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                {Math.round(maintenanceSpeedHrs * 60)} Menit ({(recoveryFromMaintenance).toFixed(1)}% recovery)
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={maintenanceSpeedHrs}
              onChange={(e) => setMaintenanceSpeedHrs(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>20 min (Expedited Hose Replacement)</span>
              <span>150 min (Standard Overhaul)</span>
            </div>
          </div>

          {/* Parameter 3: Road Grading Auxiliary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">3. Aktivasi Grader GD-825 di Haul Road Ramp</h4>
              <p className="text-[11px] text-slate-400">
                Meratakan permukaan lunak untuk menurunkan Rolling Resistance
              </p>
            </div>
            <button
              onClick={() => setRoadGradingActive(!roadGradingActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roadGradingActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {roadGradingActive ? "AKTIF (+2.5%)" : "NONAKTIF"}
            </button>
          </div>
        </div>

        {/* Projected Outcome KPI Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-5 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Proyeksi Hasil Simulasi
              </h4>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Estimasi Recovery Produksi</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-400">
                    +{totalRecoveryPct.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400">
                    (Defisit sisa: <strong className="text-rose-400">-{netDeficitPct}%</strong>)
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Volume Tambahan Terselamatkan</span>
                <span className="text-lg font-black text-cyan-300">
                  +{recoveredVolumeBcm.toLocaleString()} BCM / Shift
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Penyelamatan Nilai Finansial</span>
                <span className="text-lg font-black text-amber-300">
                  Rp {savedCostMillions.toLocaleString()} Juta
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tingkat keyakinan simulasi Monte Carlo: <strong>94.2%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
