// MINE SMART AI - Scenario Manager & What-If Analysis Component

import React, { useState } from "react";
import {
  Sliders,
  Play,
  Plus,
  TrendingUp,
  Flame,
  Pickaxe,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MiningScenario, MinePlan } from "../../../types/minePlanningTypes";
import { MiningScenarioService } from "../../../services/mine-planning/MiningScenarioService";

interface ScenarioPlanningViewProps {
  scenarios: MiningScenario[];
  activePlan: MinePlan;
  onAddScenario: (scen: MiningScenario) => void;
}

export const ScenarioPlanningView: React.FC<ScenarioPlanningViewProps> = ({
  scenarios,
  activePlan,
  onAddScenario,
}) => {
  // Sliders for What-If
  const [targetMultiplier, setTargetMultiplier] = useState<number>(1.1);
  const [fuelPriceImpactPercent, setFuelPriceImpactPercent] = useState<number>(8);
  const [fleetAvailabilityPercent, setFleetAvailabilityPercent] = useState<number>(90);
  const [scenarioName, setScenarioName] = useState<string>("Skenario Ekspansi Kaltim Q4");

  const [activeScenario, setActiveScenario] = useState<MiningScenario>(scenarios[0]);

  const handleRunWhatIf = () => {
    const updated = MiningScenarioService.runWhatIfAnalysis(activeScenario, {
      targetMultiplier,
      fuelPriceImpactPercent,
      fleetAvailabilityPercent,
    });
    setActiveScenario(updated);
  };

  const handleSaveScenario = () => {
    const created = MiningScenarioService.createScenarioFromPlan(
      activePlan,
      scenarioName,
      `Simulasi What-If: Multiplier ${targetMultiplier}x, Fuel ${fuelPriceImpactPercent}%, Fleet ${fleetAvailabilityPercent}%`,
      targetMultiplier,
      fuelPriceImpactPercent,
      fleetAvailabilityPercent
    );
    onAddScenario(created);
    setActiveScenario(created);
  };

  return (
    <div className="space-y-6">
      {/* Top Sliders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Simulasi What-If Analysis & Strategic Scenario Engine
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">FINANCIAL & CAPACITY MODEL</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Nama Skenario Baru:</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-400">Target Multiplier Produksi ({targetMultiplier}x):</span>
                  <span className="text-amber-500 font-mono">{(targetMultiplier * 100).toFixed(0)}% dari Base</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={targetMultiplier}
                  onChange={(e) => setTargetMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-400">Ekspektasi Fluktuasi Harga BBM / Fuel ({fuelPriceImpactPercent}%):</span>
                  <span className="text-sky-400 font-mono">+{fuelPriceImpactPercent}% Dampak Biaya</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="1"
                  value={fuelPriceImpactPercent}
                  onChange={(e) => setFuelPriceImpactPercent(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-400">Ketersediaan Fleet (PA / Physical Availability):</span>
                  <span className="text-emerald-500 font-mono">{fleetAvailabilityPercent}% PA</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  step="1"
                  value={fleetAvailabilityPercent}
                  onChange={(e) => setFleetAvailabilityPercent(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleRunWhatIf}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Play className="h-4 w-4" />
                <span>Kalkulasi Simulasi</span>
              </button>

              <button
                onClick={handleSaveScenario}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Simpan Sebagai Skenario</span>
              </button>
            </div>
          </div>
        </div>

        {/* What-If Result Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Hasil Kalkulasi Skenario</span>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Proyeksi Coal Target:</span>
              <span className="text-xl font-black text-amber-500 font-mono">
                {activeScenario.results.coalMt} MT
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Proyeksi Waste OB Target:</span>
              <span className="text-xl font-black text-sky-400 font-mono">
                {activeScenario.results.wasteMbc} MBCM
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Estimasi Total Biaya Mining:</span>
              <span className="text-xl font-black text-emerald-500 font-mono">
                Rp {activeScenario.results.totalCostIdrBillion} Miliar
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Perkiraan Net Present Value (NPV):</span>
              <span className="text-xl font-black text-purple-400 font-mono">
                Rp {activeScenario.results.npvEstIdrBillion} Miliar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Comparison Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Matriks Perbandingan Skenario Penambangan ({scenarios.length} Scenarios)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Skenario ID & Nama</th>
                <th className="py-2.5 px-3 text-right">Coal Target</th>
                <th className="py-2.5 px-3 text-right">Waste Target</th>
                <th className="py-2.5 px-3 text-center">Strip Ratio</th>
                <th className="py-2.5 px-3 text-right">Biaya IDR</th>
                <th className="py-2.5 px-3 text-right">NPV Est.</th>
                <th className="py-2.5 px-3 text-center">Status Skenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {scenarios.map((scen) => (
                <tr key={scen.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{scen.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{scen.scenarioId}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-500">{scen.results.coalMt} MT</td>
                  <td className="py-3 px-3 text-right font-mono text-sky-400">{scen.results.wasteMbc} MBCM</td>
                  <td className="py-3 px-3 text-center font-mono text-teal-500">{scen.results.stripRatio}:1</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-500">Rp {scen.results.totalCostIdrBillion} M</td>
                  <td className="py-3 px-3 text-right font-mono text-purple-400 font-bold">Rp {scen.results.npvEstIdrBillion} M</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/10 text-teal-500">
                      {scen.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
