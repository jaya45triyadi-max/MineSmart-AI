// MINE SMART AI - Grader Specialized Category View

import React from "react";
import { Route, CheckCircle2 } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface GraderViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const GraderView: React.FC<GraderViewProps> = ({ equipmentList, onSelectUnit }) => {
  const graders = equipmentList.filter((e) => e.equipmentType === "Grader");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {graders.map((gr) => {
          const spec = gr.graderSpec;
          return (
            <div
              key={gr.id}
              onClick={() => onSelectUnit(gr)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-base font-black text-white font-mono">{gr.unitCode}</span>
                  <span className="text-xs text-slate-400 block">{gr.brand} {gr.model}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  {gr.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Blade Width</span>
                  <span className="font-bold text-white">{spec?.bladeWidthFt || 16} ft Moldboard</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Road Maintenance</span>
                  <span className="font-bold text-sky-400">{spec?.roadMaintenanceHoursToday || 7.2} h</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                <span>Segment: {gr.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
