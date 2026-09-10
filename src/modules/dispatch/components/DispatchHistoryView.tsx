// MINE SMART AI - Dispatch History View

import React, { useState } from "react";
import { Search, Filter, FileSpreadsheet, Clock } from "lucide-react";
import { DispatchRecord } from "../../../types/dispatchTypes";

interface DispatchHistoryViewProps {
  dispatches: DispatchRecord[];
  onExport: () => void;
}

export const DispatchHistoryView: React.FC<DispatchHistoryViewProps> = ({ dispatches, onExport }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = dispatches.filter(
    (d) =>
      d.truckUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.excavatorUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dispatchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            HISTORI AUDIT DISPATCH FLEET
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Arsip lengkap histori penugasan, durasi siklus, tonase aktual, dan operator per shift
          </p>
        </div>

        <button
          onClick={onExport}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export History CSV</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID Dispatch, Truck, Excavator..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Dispatch ID</th>
                <th className="p-3">Tanggal / Shift</th>
                <th className="p-3">Truck Unit</th>
                <th className="p-3">Excavator</th>
                <th className="p-3">Origin ➔ Destination</th>
                <th className="p-3">Material</th>
                <th className="p-3">Total Cycle</th>
                <th className="p-3">Production (Ton)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{d.dispatchId}</td>
                  <td className="p-3 text-slate-300">{d.date} • {d.shiftId}</td>
                  <td className="p-3 font-bold text-amber-300">{d.truckUnitCode}</td>
                  <td className="p-3 font-bold text-white">{d.excavatorUnitCode}</td>
                  <td className="p-3 text-slate-300">{d.originName} ➔ {d.destinationName}</td>
                  <td className="p-3 text-emerald-400">{d.materialType}</td>
                  <td className="p-3 font-bold text-sky-400">{d.totalCycleTimeMin} m</td>
                  <td className="p-3 font-bold text-amber-400">{d.actualProductionTon} Ton</td>
                  <td className="p-3 font-bold text-emerald-300">{d.dispatchStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
