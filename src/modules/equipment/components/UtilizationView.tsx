// MINE SMART AI - Utilization Analysis View

import React from "react";
import { TrendingUp, BarChart2, Activity, Clock } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface UtilizationViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const UtilizationView: React.FC<UtilizationViewProps> = ({ equipmentList, onSelectUnit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <span>FLEET UTILIZATION OF AVAILABILITY (UA %) ANALYSIS</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Formula: <code>UA % = (Jam Operasi / (Jam Operasi + Jam Standby)) * 100</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList.map((unit) => (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit)}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl shadow-xl cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white font-mono">{unit.unitCode}</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">{unit.useOfAvailabilityUA}% UA</span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, unit.useOfAvailabilityUA)}%` }}
                className="bg-indigo-500 h-full rounded-full transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{unit.equipmentType}</span>
              <span>Status: {unit.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
