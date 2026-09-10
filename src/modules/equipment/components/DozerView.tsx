// MINE SMART AI - Dozer Specialized Category View

import React from "react";
import { Compass, CheckCircle2, Clock } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface DozerViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const DozerView: React.FC<DozerViewProps> = ({ equipmentList, onSelectUnit }) => {
  const dozers = equipmentList.filter((e) => e.equipmentType === "Dozer");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dozers.map((dz) => {
          const spec = dz.dozerSpec;
          return (
            <div
              key={dz.id}
              onClick={() => onSelectUnit(dz)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-base font-black text-white font-mono">{dz.unitCode}</span>
                  <span className="text-xs text-slate-400 block">{dz.brand} {dz.model}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  {dz.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Blade Capacity</span>
                  <span className="font-bold text-white">{spec?.bladeCapacityM3 || 22.0} m³</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Productivity</span>
                  <span className="font-bold text-emerald-400">{spec?.productivityBcmHr || 540} BCM/h</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                <span>Location: {dz.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
