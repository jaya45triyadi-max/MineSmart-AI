// MINE SMART AI - Light Vehicle Specialized Category View

import React from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface LightVehicleViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const LightVehicleView: React.FC<LightVehicleViewProps> = ({ equipmentList, onSelectUnit }) => {
  const lvs = equipmentList.filter((e) => e.equipmentType === "Light Vehicle");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lvs.map((lv) => {
          const spec = lv.lightVehicleSpec;
          return (
            <div
              key={lv.id}
              onClick={() => onSelectUnit(lv)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-base font-black text-white font-mono">{lv.unitCode}</span>
                  <span className="text-xs text-slate-400 block">{lv.brand} {lv.model}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  {lv.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Plat Nomor</span>
                  <span className="font-bold text-amber-300">{spec?.plateNumber || "KT 8492 BNU"}</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Distance Today</span>
                  <span className="font-bold text-emerald-400">{spec?.distanceTodayKm || 85} km</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                <span>Driver: {spec?.driverName || lv.operatorName || "-"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
