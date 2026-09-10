// MINE SMART AI - Dump Truck Specialized Category View

import React from "react";
import { Truck, CheckCircle2, Clock, Route, Activity, BarChart2 } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface DumpTruckViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const DumpTruckView: React.FC<DumpTruckViewProps> = ({ equipmentList, onSelectUnit }) => {
  const dumpTrucks = equipmentList.filter((e) => e.equipmentType === "Dump Truck");

  const totalTripsToday = dumpTrucks.reduce((sum, e) => sum + (e.dumpTruckSpec?.tripsCountToday || 0), 0);
  const avgPayloadTon = dumpTrucks.length > 0
    ? Number((dumpTrucks.reduce((sum, e) => sum + (e.dumpTruckSpec?.payloadTonActual || 90), 0) / dumpTrucks.length).toFixed(1))
    : 92.5;

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Dump Trucks</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{dumpTrucks.length} Unit</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Trips Hari Ini</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{totalTripsToday} Trips</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Avg Payload Rata-Rata</span>
          <span className="text-2xl font-black text-sky-400 font-mono">{avgPayloadTon} Ton</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Avg Cycle Time Hauling</span>
          <span className="text-2xl font-black text-indigo-300 font-mono">18.5 Min</span>
        </div>
      </div>

      {/* Dump Truck Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dumpTrucks.map((dt) => {
          const spec = dt.dumpTruckSpec;
          return (
            <div
              key={dt.id}
              onClick={() => onSelectUnit(dt)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white font-mono">{dt.unitCode}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                        dt.status === "Operating"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {dt.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{dt.brand} {dt.model}</span>
                </div>

                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Payload Target</span>
                  <span className="font-bold text-white">{spec?.payloadCapacityTon || 96} Ton</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Trips Hari Ini</span>
                  <span className="font-bold text-emerald-400">{spec?.tripsCountToday || 0} Trips</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Cycle Time</span>
                  <span className="font-bold text-sky-400">{spec?.cycleTimeMin || 18.2} Min</span>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Queue Time</span>
                  <span className="font-bold text-indigo-300">{spec?.queueTimeMin || 2.1} Min</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Rute: {dt.location}</span>
                <span>Odometer: {dt.odometerKm?.toLocaleString() || 0} km</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
