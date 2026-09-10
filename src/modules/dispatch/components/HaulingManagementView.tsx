// MINE SMART AI - Hauling Management & GIS Route View

import React from "react";
import {
  Truck,
  MapPin,
  Navigation,
  Clock,
  Gauge,
  TrendingUp,
  Activity,
  Compass,
} from "lucide-react";

import { DispatchHaulingRecord } from "../../../types/dispatchTypes";

interface HaulingManagementViewProps {
  haulings: DispatchHaulingRecord[];
}

export const HaulingManagementView: React.FC<HaulingManagementViewProps> = ({ haulings }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              HAULING ROAD MANAGEMENT & GIS ROUTE TRACKER
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemantauan perjalanan angkut bermuatan (loaded haul), analisis kecepatan rata-rata, dan jarak rute terintegrasi GIS
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Active Haul Routes: <strong className="text-emerald-400">3 Main Routes (Alpha, Beta, Gamma)</strong>
        </div>
      </div>

      {/* GIS Route Interactive Map Simulation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              PETA RUTE HAULING TERINTEGRASI GIS (PIT → ROM / DISPOSAL)
            </h4>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">GPS Telemetry: Active</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 h-64 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Route Map Overlay */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-amber-400 font-bold">Pit 1 South (Origin)</span>
              <span className="text-slate-500">══════════ [Haul Road Alpha 4.2 km] ══════════►</span>
              <span className="text-cyan-400 font-bold">ROM 01 (Destination)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Grade: 8% Max
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 my-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Loaded Travel Time</span>
              <span className="text-lg font-black text-emerald-400 font-mono">12.0 min</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Empty Return Time</span>
              <span className="text-lg font-black text-teal-400 font-mono">9.8 min</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Travel Time</span>
              <span className="text-lg font-black text-sky-400 font-mono">21.8 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hauling Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            LOG PERJALANAN HAULING TRUCK AKTIF
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Hauling ID</th>
                <th className="p-3">Truck Code</th>
                <th className="p-3">Origin Pit</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Distance (km)</th>
                <th className="p-3">Route Name</th>
                <th className="p-3">Avg Speed</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {haulings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{h.haulingId}</td>
                  <td className="p-3 font-bold text-amber-300">{h.truckUnitCode}</td>
                  <td className="p-3 text-slate-300">{h.origin}</td>
                  <td className="p-3 text-slate-300">{h.destination}</td>
                  <td className="p-3 font-bold text-emerald-400">{h.distanceKm} km</td>
                  <td className="p-3 text-slate-300">{h.routeName}</td>
                  <td className="p-3 font-bold text-sky-400">{h.avgSpeedKmh} km/h</td>
                  <td className="p-3 text-slate-400">{h.startTime.slice(11, 16)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {h.status}
                    </span>
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
