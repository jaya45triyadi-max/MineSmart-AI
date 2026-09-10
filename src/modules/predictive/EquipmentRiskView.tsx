// MINE SMART AI - Equipment Risk Score & Risk Matrix View

import React, { useState } from "react";
import {
  Gauge,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";
import { EquipmentRiskScore } from "../../types/predictiveTypes";

interface EquipmentRiskViewProps {
  riskScores: EquipmentRiskScore[];
  onUpdateCriticality: (id: string, newCriticality: "Low" | "Medium" | "High" | "Critical") => void;
  onOpenAIAssistant: () => void;
}

export const EquipmentRiskView: React.FC<EquipmentRiskViewProps> = ({
  riskScores,
  onUpdateCriticality,
  onOpenAIAssistant,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Probability x Impact Risk Matrix Mapping
  const matrixGrid = [
    { probability: "Critical", impactLevels: ["Medium", "High", "Critical", "Critical"] },
    { probability: "High", impactLevels: ["Low", "Medium", "High", "Critical"] },
    { probability: "Medium", impactLevels: ["Low", "Low", "Medium", "High"] },
    { probability: "Low", impactLevels: ["Very Low", "Low", "Low", "Medium"] },
  ];

  const getRiskColorClass = (riskCat: string) => {
    switch (riskCat) {
      case "Critical":
        return "bg-rose-500/20 text-rose-500 border-rose-500/40";
      case "High":
        return "bg-orange-500/20 text-orange-500 border-orange-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-500 border-amber-500/40";
      case "Low":
        return "bg-teal-500/20 text-teal-500 border-teal-500/40";
      case "Very Low":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/40";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Gauge className="h-5 w-5 text-amber-500" />
            <span>Equipment Risk Score & Probability × Impact Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kalkulasi tingkat risiko unit berdasarkan probabilitas kegagalan, kritikalitas operasional, histori downtime, dan dampak ketersediaan fleet.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Evaluasi Matriks Risiko</span>
        </button>
      </div>

      {/* Probability x Impact Matrix Visual Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">3D Equipment Risk Matrix Grid (Probabilitas vs Impact)</h3>
          <span className="text-[10px] text-slate-400">ISO 31000 Risk Management Standard</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] grid grid-cols-5 gap-2 text-center text-xs font-bold">
            <div className="p-2 text-slate-400 flex items-center justify-center font-extrabold text-[10px]">PROBABILITY \ IMPACT</div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">Low Impact</div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">Medium Impact</div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">High Impact</div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">Critical Impact</div>

            {/* Matrix Rows */}
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center">Critical Prob</div>
            <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30">MEDIUM</div>
            <div className="p-3 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-500/30">HIGH</div>
            <div className="p-3 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/30 font-black">CRITICAL (DZ-301)</div>
            <div className="p-3 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/30 font-black">CRITICAL</div>

            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center">High Prob</div>
            <div className="p-3 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/30">LOW</div>
            <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30">MEDIUM</div>
            <div className="p-3 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-500/30 font-bold">HIGH (DT-102)</div>
            <div className="p-3 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/30 font-black">CRITICAL</div>

            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center">Medium Prob</div>
            <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/30">VERY LOW</div>
            <div className="p-3 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/30">LOW</div>
            <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30 font-bold">MEDIUM (EX-202)</div>
            <div className="p-3 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-500/30">HIGH</div>

            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center">Low Prob</div>
            <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/30 font-bold">VERY LOW (EX-201)</div>
            <div className="p-3 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/30 font-bold">LOW (DT-101)</div>
            <div className="p-3 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg border border-teal-500/30">LOW</div>
            <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30">MEDIUM</div>
          </div>
        </div>
      </div>

      {/* Risk Ranking Table & Criticality Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Equipment Risk Ranking & Criticality Level Config</h3>
          <span className="text-xs text-slate-400">Sorted by Highest Risk Index</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Rank & Unit</th>
                <th className="p-3">Category</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Risk Category</th>
                <th className="p-3">Criticality Level</th>
                <th className="p-3">MTBF / MTTR</th>
                <th className="p-3">Backlog & PM</th>
                <th className="p-3">Priority Action</th>
                <th className="p-3 rounded-r-xl text-right">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {riskScores
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((rs, idx) => (
                  <tr key={rs.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      #{idx + 1} {rs.unitCode}
                    </td>
                    <td className="p-3">{rs.category}</td>
                    <td className="p-3 font-black text-sm text-slate-900 dark:text-white">{rs.riskScore} / 100</td>
                    <td className="p-3">
                      <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-black uppercase ${getRiskColorClass(rs.riskCategory)}`}>
                        {rs.riskCategory}
                      </span>
                    </td>
                    <td className="p-3">
                      {editingId === rs.id ? (
                        <select
                          value={rs.criticality}
                          onChange={(e) => {
                            onUpdateCriticality(rs.id, e.target.value as any);
                            setEditingId(null);
                          }}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      ) : (
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{rs.criticality}</span>
                      )}
                    </td>
                    <td className="p-3">{rs.mtbfHours}h / {rs.mttrHours}h</td>
                    <td className="p-3 text-slate-500">
                      {rs.overduePMCount > 0 ? (
                        <span className="text-rose-500 font-bold">{rs.overduePMCount} Overdue PM</span>
                      ) : (
                        <span className="text-emerald-500">Up to date</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-amber-500">{rs.priority}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingId(editingId === rs.id ? null : rs.id)}
                        className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        {editingId === rs.id ? "Done" : "Edit Criticality"}
                      </button>
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
