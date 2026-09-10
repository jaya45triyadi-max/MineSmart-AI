// MINE SMART AI - Predictive Reports, What-If Simulation & Audit View

import React, { useState } from "react";
import {
  FileText,
  Play,
  Calculator,
  History,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import {
  WhatIfSimulationRequest,
  WhatIfSimulationResult,
} from "../../types/predictiveTypes";

interface PredictiveReportsAuditViewProps {
  onRunWhatIf: (req: WhatIfSimulationRequest) => Promise<WhatIfSimulationResult>;
  onOpenAIAssistant: () => void;
}

export const PredictiveReportsAuditView: React.FC<PredictiveReportsAuditViewProps> = ({
  onRunWhatIf,
  onOpenAIAssistant,
}) => {
  const [selectedUnitCode, setSelectedUnitCode] = useState("EX-201");
  const [downtimeHours, setDowntimeHours] = useState(8);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await onRunWhatIf({
        equipmentId: "EQ-EX201",
        unitCode: selectedUnitCode,
        simulatedDowntimeHours: downtimeHours,
        scenarioDescription: `Downtime simulation for ${selectedUnitCode} for ${downtimeHours} hours`,
      });
      setSimulationResult(res);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const auditLogs = [
    { timestamp: "2026-08-13T08:45:00Z", user: "AI Engine", event: "RECOMMENDATION_TO_WORK_ORDER", details: "Converted REC-001 to WO-AI-8812 for DZ-301 final drive" },
    { timestamp: "2026-08-13T08:30:00Z", user: "AI Engine", event: "HEALTH_SCORE_GENERATED", details: "Recalculated health score for EX-201 (92/100)" },
    { timestamp: "2026-08-13T08:00:00Z", user: "Site Admin", event: "MODEL_DEPLOYED", details: "Deployed predictive model v2.4.1-hybrid to production" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-500" />
            <span>AI What-If Simulation Engine & Predictive Reports</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulasi dampak skenario downtime unit terhadap target produksi tambang, keseimbangan fleet hauling, dan estimasi finansial.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Simulasi AI Copilot</span>
        </button>
      </div>

      {/* What-If Simulation Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Simulasi Skenario Operational What-If</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">PILIH UNIT EQUIPMENT</label>
            <select
              value={selectedUnitCode}
              onChange={(e) => setSelectedUnitCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="EX-201">EX-201 (Excavator PC1250)</option>
              <option value="EX-202">EX-202 (Excavator PC2000)</option>
              <option value="DT-102">DT-102 (Dump Truck 777E)</option>
              <option value="DZ-301">DZ-301 (Dozer D10T2)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">SIMULASI DOWNTIME (JAM)</label>
            <input
              type="number"
              value={downtimeHours}
              onChange={(e) => setDowntimeHours(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              <span>{isSimulating ? "Menghitung..." : "Jalankan Simulasi"}</span>
            </button>
          </div>
        </div>

        {/* Simulation Output Card */}
        {simulationResult && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                HASIL SIMULASI SKENARIO ({simulationResult.equipmentUnitCode} - {simulationResult.simulatedDowntimeHours} Jam Downtime)
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                Simulation / Estimate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">EST. OB LOSS</span>
                <span className="text-lg font-black text-amber-500">{simulationResult.potentialOBLossBCM.toLocaleString()} BCM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">EST. COAL LOSS</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{simulationResult.potentialCoalLossMT} MT</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">TRUCK IMBALANCE</span>
                <span className="text-lg font-black text-purple-500">{simulationResult.potentialTruckImbalanceCount} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">EST. COST IMPACT</span>
                <span className="text-lg font-black text-rose-500">Rp {(simulationResult.potentialCostImpactIDR / 1000000).toLocaleString()} Juta</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white text-[11px]">Assumptions:</span>
              <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                {simulationResult.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-500" />
          <span>Predictive AI System Audit Trail</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 rounded-l-lg">Timestamp</th>
                <th className="p-2.5">User / System</th>
                <th className="p-2.5">Event Code</th>
                <th className="p-2.5 rounded-r-lg">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">{log.user}</td>
                  <td className="p-2.5 font-mono text-[10px] text-emerald-500 font-bold">{log.event}</td>
                  <td className="p-2.5 text-slate-500">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
