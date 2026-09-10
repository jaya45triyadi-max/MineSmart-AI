// MINE SMART AI - Dumping Management View

import React from "react";
import { Layers, MapPin, CheckCircle2, Clock, Truck } from "lucide-react";
import { DispatchDumpingRecord, DumpingType } from "../../../types/dispatchTypes";

interface DumpingManagementViewProps {
  dumpings: DispatchDumpingRecord[];
}

export const DumpingManagementView: React.FC<DumpingManagementViewProps> = ({ dumpings }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              DUMPING MANAGEMENT & TIPPING POINT CONTROL
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan aktivitas bongkar muatan di ROM Stockpile, Waste Disposal Dump, Crusher, Bunker, & Stockpile Area
          </p>
        </div>

        <div className="flex gap-1.5">
          {["ROM", "Stockpile", "Disposal", "Crusher", "Bunker", "Other"].map((dt) => (
            <span key={dt} className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-cyan-300 rounded-lg">
              {dt}
            </span>
          ))}
        </div>
      </div>

      {/* Dumping Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            DAFTAR AKTIVITAS BONGKAR (DUMPING LOGS)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Dumping ID</th>
                <th className="p-3">Truck Code</th>
                <th className="p-3">Dump Point</th>
                <th className="p-3">Dump Type</th>
                <th className="p-3">Payload (Ton)</th>
                <th className="p-3">Material</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dumpings.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{d.dumpingId}</td>
                  <td className="p-3 font-bold text-amber-300">{d.truckUnitCode}</td>
                  <td className="p-3 font-bold text-white">{d.dumpPoint}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold rounded">
                      {d.dumpType}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{d.payloadTon} Ton</td>
                  <td className="p-3 text-slate-300">{d.materialType}</td>
                  <td className="p-3 text-amber-300">{d.durationMin} min</td>
                  <td className="p-3 text-slate-300">{d.operatorName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {d.status}
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
