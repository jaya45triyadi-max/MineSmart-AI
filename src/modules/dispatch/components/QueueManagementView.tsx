// MINE SMART AI - Queue Management View

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  Sparkles,
  Sliders,
  CheckCircle2,
  Users,
  MapPin,
  Truck,
  TrendingDown,
  Layers,
} from "lucide-react";

import { DispatchQueueItem } from "../../../types/dispatchTypes";

interface QueueManagementViewProps {
  queues: DispatchQueueItem[];
  onOpenAI: () => void;
}

export const QueueManagementView: React.FC<QueueManagementViewProps> = ({
  queues,
  onOpenAI,
}) => {
  const [alertThresholdMin, setAlertThresholdMin] = useState<number>(5);

  const totalQueued = queues.filter((q) => q.status === "QUEUED").length;
  const avgQueueDuration = queues.length > 0
    ? Number((queues.reduce((acc, curr) => acc + curr.queueDurationMin, 0) / queues.length).toFixed(1))
    : 7.2;

  const longestQueue = queues.length > 0
    ? Math.max(...queues.map((q) => q.queueDurationMin))
    : 10.0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              QUEUE MANAGEMENT & MONITORING CENTER
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemantauan antrean armada di loading bay, threshold peringatan durasi tunggu, dan AI analisis penyebab kemacetan
          </p>
        </div>

        {/* Threshold Configuration */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300 font-medium">Alert Threshold:</span>
          <select
            value={alertThresholdMin}
            onChange={(e) => setAlertThresholdMin(Number(e.target.value))}
            className="bg-slate-900 text-xs text-amber-300 font-bold font-mono px-2 py-1 rounded border border-slate-800 focus:outline-none"
          >
            <option value={5}>5 Menit</option>
            <option value={10}>10 Menit</option>
            <option value={15}>15 Menit</option>
            <option value={20}>20 Menit</option>
          </select>
        </div>
      </div>

      {/* Queue Monitor KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Current Queue</p>
          <p className="text-2xl font-black text-rose-400 font-mono mt-1">{totalQueued} Trucks</p>
          <p className="text-[10px] text-rose-300 mt-0.5">Menunggu loading bucket</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Average Queue Time</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">{avgQueueDuration} min</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Threshold: {alertThresholdMin} min</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Longest Queue</p>
          <p className="text-2xl font-black text-rose-500 font-mono mt-1">{longestQueue} min</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Location: Pit 1 South</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Queue by Digger</p>
          <p className="text-2xl font-black text-indigo-400 font-mono mt-1">EX-201 (3 DT)</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Highest queue concentration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Queue Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              DAFTAR ANTREAN REAL-TIME DUMP TRUCK ({queues.length})
            </h4>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
              {queues.filter((q) => q.queueDurationMin >= alertThresholdMin).length} Over Threshold ({alertThresholdMin}m)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Pos</th>
                  <th className="p-3">Truck Unit</th>
                  <th className="p-3">Excavator</th>
                  <th className="p-3">Queue Start</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {queues.map((q) => {
                  const isOverThreshold = q.queueDurationMin >= alertThresholdMin;

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isOverThreshold ? "bg-rose-950/20" : ""
                      }`}
                    >
                      <td className="p-3 font-bold text-amber-400">#{q.queuePosition}</td>
                      <td className="p-3 font-bold text-white">{q.truckUnitCode}</td>
                      <td className="p-3 font-bold text-amber-300">{q.excavatorUnitCode}</td>
                      <td className="p-3 text-slate-400">{q.queueStartTime.slice(11, 16)}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            isOverThreshold ? "text-rose-400 animate-pulse" : "text-emerald-400"
                          }`}
                        >
                          {q.queueDurationMin} min
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{q.location}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[9px] rounded font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/30">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Queue Analysis Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI QUEUE BOTTLENECK ANALYSIS</span>
            </div>
            <button onClick={onOpenAI} className="text-[10px] text-emerald-400 hover:underline cursor-pointer">
              Ask AI
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Problem Identified:</span>
              <p className="text-rose-300 font-bold">Penumpukan 3 Dump Truck di Bay EX-201 (Pit 1 South)</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Evidence & Telemetry:</span>
              <p className="text-slate-300">Durasi antrean rata-rata 10.0 menit. 6 Dump Truck dialokasikan ke 1 Digger PC1250.</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Possible Cause:</span>
              <p className="text-amber-300">Imbalance Fleet Dispatch — Kelebihan alokasi armada truck ke Pit 1 sementara Pit 2 kekurangan truck.</p>
            </div>

            <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/30">
              <span className="text-indigo-300 text-[10px] uppercase font-bold block mb-1">AI Recommendation:</span>
              <p className="text-slate-200">Reassign DT-107 & DT-108 ke EX-202 (Pit 2 North) segera.</p>
              <span className="text-[10px] text-emerald-400 font-bold mt-2 block">
                Expected Impact: Menurunkan antrean dari 10m ke 3m (-70%).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
