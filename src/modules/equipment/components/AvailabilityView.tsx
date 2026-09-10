// MINE SMART AI - Physical & Mechanical Availability View

import React from "react";
import { Gauge, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface AvailabilityViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const AvailabilityView: React.FC<AvailabilityViewProps> = ({ equipmentList, onSelectUnit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-sky-400" />
          <span>PHYSICAL AVAILABILITY (PA %) & MECHANICAL AVAILABILITY (MA %)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          PA Formula: <code>((Operating + Standby) / Total Hours) * 100</code> | MA Formula: <code>(Operating / (Operating + Breakdown)) * 100</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList.map((unit) => (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit)}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl shadow-xl cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white font-mono">{unit.unitCode}</span>
              <span className="text-xs font-bold text-sky-400 font-mono">{unit.physicalAvailabilityPA}% PA</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Mechanical Availability (MA):</span>
                <span className="font-bold text-emerald-400">{unit.mechanicalAvailabilityMA}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Physical Availability (PA):</span>
                <span className="font-bold text-sky-400">{unit.physicalAvailabilityPA}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{unit.equipmentType}</span>
              <span>{unit.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
