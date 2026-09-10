// MINE SMART AI - Water Truck Specialized Category View

import React from "react";
import { Fuel, CheckCircle2 } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface WaterTruckViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const WaterTruckView: React.FC<WaterTruckViewProps> = ({ equipmentList, onSelectUnit }) => {
  const waterTrucks = equipmentList.filter((e) => e.equipmentType === "Water Truck");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {waterTrucks.map((wt) => {
          const spec = wt.waterTruckSpec;
          return (
            <div
              key={wt.id}
              onClick={() => onSelectUnit(wt)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-base font-black text-white font-mono">{wt.unitCode}</span>
                  <span className="text-xs text-slate-400 block">{wt.brand} {wt.model}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  {wt.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Tank Capacity</span>
                  <span className="font-bold text-white">{(spec?.tankCapacityLiters || 30000).toLocaleString()} L</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Water Volume Today</span>
                  <span className="font-bold text-sky-400">{spec?.waterVolumeM3Today || 360} m³</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                <span>Location: {wt.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
