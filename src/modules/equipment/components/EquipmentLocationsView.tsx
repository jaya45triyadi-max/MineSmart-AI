// MINE SMART AI - GIS Fleet Map & Equipment Location Tracking View

import React from "react";
import { MapPin, ShieldAlert, Signal, Clock, Truck, Layers } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";

interface EquipmentLocationsViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
}

export const EquipmentLocationsView: React.FC<EquipmentLocationsViewProps> = ({
  equipmentList,
  onSelectUnit,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>GIS FLEET MAP & REAL-TIME LOCATION TRACKING</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi Posisi Unit, Deteksi GPS Offline/Kedaluwarsa, Pemantauan Geofence, & Histori Pergerakan
          </p>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="relative w-full h-96 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Map Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

          {/* Zones */}
          <div className="absolute top-10 left-12 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono">
            GEOFENCE: PIT 1 SOUTH
          </div>
          <div className="absolute top-12 right-16 p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-xs text-sky-300 font-mono">
            GEOFENCE: DISPOSAL NORTH
          </div>
          <div className="absolute bottom-12 left-20 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-mono">
            GEOFENCE: ROM STOCKPILE #1
          </div>

          {/* Pins */}
          {equipmentList.map((eq, idx) => {
            const leftPos = `${20 + (idx * 15) % 65}%`;
            const topPos = `${25 + (idx * 19) % 55}%`;

            return (
              <button
                key={eq.id}
                onClick={() => onSelectUnit(eq)}
                style={{ left: leftPos, top: topPos }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono border border-amber-300 shadow-xl cursor-pointer hover:scale-110 transition-transform flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{eq.unitCode}</span>
              </button>
            );
          })}
        </div>

        {/* Location List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase">
                <th className="py-2.5 px-4">Unit Code</th>
                <th className="py-2.5 px-4">Lokasi Saat Ini</th>
                <th className="py-2.5 px-4">Easting / Northing</th>
                <th className="py-2.5 px-4">Sumber Data GPS</th>
                <th className="py-2.5 px-4">Status Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {equipmentList.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-400">{eq.unitCode}</td>
                  <td className="py-2.5 px-4 text-slate-200">{eq.location}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-mono">
                    {eq.easting || 554000} E / {eq.northing || 9944000} N
                  </td>
                  <td className="py-2.5 px-4 text-slate-300 font-mono">GNSS Real-Time</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                      GPS Live
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
