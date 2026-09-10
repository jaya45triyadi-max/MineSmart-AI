// MINE SMART AI - Return Management View

import React from "react";
import { Truck, Navigation, Clock, CheckCircle2 } from "lucide-react";
import { DispatchReturnRecord } from "../../../types/dispatchTypes";

interface ReturnManagementViewProps {
  returns: DispatchReturnRecord[];
}

export const ReturnManagementView: React.FC<ReturnManagementViewProps> = ({ returns }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              RETURN TRIP MANAGEMENT (EMPTY RETURN TO PIT)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelacakan perjalanan kembali dump truck kosong dari ROM/Disposal menuju area penambangan (Dump Completed → Return Travel → Queue)
          </p>
        </div>
      </div>

      {/* Return Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            LOG PERJALANAN PULANG KOSONG (EMPTY RETURN)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Return ID</th>
                <th className="p-3">Truck Code</th>
                <th className="p-3">Destination Digger</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">Distance (km)</th>
                <th className="p-3">Empty Travel Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {returns.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{r.returnId}</td>
                  <td className="p-3 font-bold text-amber-300">{r.truckUnitCode}</td>
                  <td className="p-3 font-bold text-white">{r.destinationExcavator}</td>
                  <td className="p-3 text-slate-400">{r.startTime.slice(11, 16)}</td>
                  <td className="p-3 text-slate-300">{r.distanceKm} km</td>
                  <td className="p-3 font-bold text-teal-300">{r.durationMin} min</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
                      {r.status}
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
