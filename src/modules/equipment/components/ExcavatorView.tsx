// MINE SMART AI - Excavator Specialized Category View

import React from "react";
import { Pickaxe, CheckCircle2, AlertTriangle, TrendingUp, Gauge, Activity, Clock } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface ExcavatorViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const ExcavatorView: React.FC<ExcavatorViewProps> = ({ equipmentList, onSelectUnit }) => {
  const excavators = equipmentList.filter((e) => e.equipmentType === "Excavator");

  const totalBcmHr = excavators.reduce((sum, e) => sum + (e.excavatorSpec?.bcmPerHour || 0), 0);
  const avgCycleSec = excavators.length > 0
    ? Number((excavators.reduce((sum, e) => sum + (e.excavatorSpec?.cycleTimeSec || 0), 0) / excavators.length).toFixed(1))
    : 25.0;

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Excavator</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{excavators.length} Unit</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Laju Excavation (BCM/Hr)</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{totalBcmHr.toLocaleString()} BCM/h</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Rata-Rata Cycle Time</span>
          <span className="text-2xl font-black text-sky-400 font-mono">{avgCycleSec} Detik</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Avg Bucket Fill Factor</span>
          <span className="text-2xl font-black text-indigo-300 font-mono">93.5%</span>
        </div>
      </div>

      {/* Excavator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {excavators.map((exc) => {
          const spec = exc.excavatorSpec;
          return (
            <div
              key={exc.id}
              onClick={() => onSelectUnit(exc)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white font-mono">{exc.unitCode}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                        exc.status === "Operating"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {exc.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{exc.brand} {exc.model}</span>
                </div>

                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Pickaxe className="w-5 h-5" />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Bucket Capacity</span>
                  <span className="font-bold text-white">{spec?.bucketCapacityM3 || 7.0} m³</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Produktivitas</span>
                  <span className="font-bold text-emerald-400">{spec?.bcmPerHour || 450} BCM/h</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Cycle Time</span>
                  <span className="font-bold text-sky-400">{spec?.cycleTimeSec || 25} Detik</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Fill Factor</span>
                  <span className="font-bold text-indigo-300">{spec?.bucketFillFactorPercent || 92}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Location: {exc.location}</span>
                <span>SMU: {exc.engineHour.toLocaleString()} h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
