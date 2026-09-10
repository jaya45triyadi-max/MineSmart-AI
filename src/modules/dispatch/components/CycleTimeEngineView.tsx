// MINE SMART AI - Cycle Time Engine View

import React, { useState } from "react";
import {
  Clock,
  Gauge,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  CheckCircle2,
  Filter,
} from "lucide-react";

import { DispatchCycleDetail } from "../../../types/dispatchTypes";

interface CycleTimeEngineViewProps {
  cycles: DispatchCycleDetail[];
}

export const CycleTimeEngineView: React.FC<CycleTimeEngineViewProps> = ({ cycles }) => {
  const [filterType, setFilterType] = useState<"ALL" | "ANOMALY">("ALL");

  const filteredCycles = cycles.filter((c) => {
    if (filterType === "ANOMALY") return c.isAnomaly;
    return true;
  });

  const totalCyclesCount = cycles.length;
  const avgQueue = cycles.length > 0
    ? Number((cycles.reduce((acc, curr) => acc + curr.queueMin, 0) / cycles.length).toFixed(1))
    : 4.5;
  const avgLoading = cycles.length > 0
    ? Number((cycles.reduce((acc, curr) => acc + curr.loadingMin, 0) / cycles.length).toFixed(1))
    : 4.0;
  const avgHauling = cycles.length > 0
    ? Number((cycles.reduce((acc, curr) => acc + curr.haulingMin, 0) / cycles.length).toFixed(1))
    : 11.5;
  const avgDumping = cycles.length > 0
    ? Number((cycles.reduce((acc, curr) => acc + curr.dumpingMin, 0) / cycles.length).toFixed(1))
    : 2.2;
  const avgReturn = cycles.length > 0
    ? Number((cycles.reduce((acc, curr) => acc + curr.returnMin, 0) / cycles.length).toFixed(1))
    : 9.5;

  const totalAvgCycle = Number((avgQueue + avgLoading + avgHauling + avgDumping + avgReturn).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              CENTRAL CYCLE TIME ENGINE & ANOMALY DETECTOR
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Formula: Total Cycle Time = Queue + Loading + Loaded Hauling + Dumping + Empty Return
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer ${
              filterType === "ALL" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-400"
            }`}
          >
            Semua Siklus ({cycles.length})
          </button>
          <button
            onClick={() => setFilterType("ANOMALY")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer ${
              filterType === "ANOMALY" ? "bg-rose-500 text-white" : "bg-slate-950 text-slate-400"
            }`}
          >
            Deteksi Anomali ({cycles.filter((c) => c.isAnomaly).length})
          </button>
        </div>
      </div>

      {/* Cycle Formula Breakdown Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-white uppercase font-mono">
          RATA-RATA KOMPONEN SIKLUS HAULING (TOTAL: {totalAvgCycle} MIN)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Queue</span>
            <span className="text-lg font-black text-rose-400 font-mono mt-1 block">{avgQueue} m</span>
            <span className="text-[9px] text-slate-500">Antrean bay</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Loading</span>
            <span className="text-lg font-black text-amber-300 font-mono mt-1 block">{avgLoading} m</span>
            <span className="text-[9px] text-slate-500">Isi bucket</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Loaded Haul</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">{avgHauling} m</span>
            <span className="text-[9px] text-slate-500">Angkut isi</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">4. Dumping</span>
            <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">{avgDumping} m</span>
            <span className="text-[9px] text-slate-500">Bongkar ROM</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">5. Empty Return</span>
            <span className="text-lg font-black text-teal-400 font-mono mt-1 block">{avgReturn} m</span>
            <span className="text-[9px] text-slate-500">Pulang kosong</span>
          </div>
        </div>
      </div>

      {/* Cycle Detail & Anomaly Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            HISTORI RINCIAN SIKLUS & DETEKSI ANOMALI
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Truck Code</th>
                <th className="p-3">Digger</th>
                <th className="p-3">Material</th>
                <th className="p-3">Queue (m)</th>
                <th className="p-3">Loading (m)</th>
                <th className="p-3">Haul (m)</th>
                <th className="p-3">Dump (m)</th>
                <th className="p-3">Return (m)</th>
                <th className="p-3">Total Cycle</th>
                <th className="p-3">Status Anomali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCycles.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    c.isAnomaly ? "bg-rose-950/20" : ""
                  }`}
                >
                  <td className="p-3 font-bold text-amber-300">{c.truckUnitCode}</td>
                  <td className="p-3 font-bold text-slate-200">{c.excavatorUnitCode}</td>
                  <td className="p-3 text-slate-300">{c.material}</td>
                  <td className="p-3 text-rose-400 font-bold">{c.queueMin}m</td>
                  <td className="p-3 text-amber-300 font-bold">{c.loadingMin}m</td>
                  <td className="p-3 text-emerald-400 font-bold">{c.haulingMin}m</td>
                  <td className="p-3 text-cyan-400 font-bold">{c.dumpingMin}m</td>
                  <td className="p-3 text-teal-400 font-bold">{c.returnMin}m</td>
                  <td className="p-3 font-black text-white text-sm">{c.totalCycleMin}m</td>
                  <td className="p-3">
                    {c.isAnomaly ? (
                      <span
                        className="px-2 py-0.5 text-[9px] bg-rose-950 text-rose-300 border border-rose-500/40 font-bold rounded"
                        title={c.anomalyReason}
                      >
                        ANOMALI: {c.anomalyReason}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold rounded">
                        NORMAL
                      </span>
                    )}
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
