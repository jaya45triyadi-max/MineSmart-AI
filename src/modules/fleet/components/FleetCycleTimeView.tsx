// MINE SMART AI - Fleet Cycle Time Analyzer & Dispatch Optimization View

import React, { useState } from "react";
import {
  RotateCcw,
  Truck,
  TrendingUp,
  Clock,
  MapPin,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { FleetUnitProfile, FleetKPIOverview } from "../../../types/fleetManagementTypes";

interface FleetCycleTimeViewProps {
  units: FleetUnitProfile[];
  kpiOverview: FleetKPIOverview;
  onOpenUnit: (unit: FleetUnitProfile) => void;
}

export const FleetCycleTimeView: React.FC<FleetCycleTimeViewProps> = ({
  units,
  kpiOverview,
  onOpenUnit,
}) => {
  const dumpTrucks = units.filter((u) => u.category === "DUMP_TRUCK");

  // Simulation state
  const [targetQueueReductionMin, setTargetQueueReductionMin] = useState(1.5);
  const [simulatedTrucks, setSimulatedTrucks] = useState(dumpTrucks.length);

  // Computed simulation impact
  const currentAvgCycle = kpiOverview.cycleTime.avgTotalCycleTimeMin;
  const optimizedAvgCycle = Math.max(18, currentAvgCycle - targetQueueReductionMin);
  const additionalTripsPerShift = Number(
    ((12 * 60) / optimizedAvgCycle - (12 * 60) / currentAvgCycle).toFixed(1)
  );
  const extraTonnageShift = Math.round(additionalTripsPerShift * 91 * simulatedTrucks);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black text-purple-400 border border-purple-500/30 uppercase tracking-wider">
            CYCLE TIME OPTIMIZATION
          </span>
          <span className="text-xs text-slate-400">7-Step Segmented Haul Cycle Breakdown</span>
        </div>
        <h2 className="text-lg font-black text-white mt-1">
          Analisis Waktu Siklus Angkut & Simulasi Dispatching
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Visualisasi mendalam setiap tahapan siklus: Queue Loader → Spotting → Loading → Haul Loaded → Queue Dump → Dumping → Return Empty. Identifikasi bottleneck antrian untuk meningkatkan ritase armada dan tonase harian.
        </p>
      </div>

      {/* 7-Segment Stage Overview Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-purple-400" />
            Rata-Rata Siklus Waktu Armada Dump Truck ({kpiOverview.cycleTime.avgTotalCycleTimeMin} Menit)
          </h3>
          <span className="text-xs font-black text-purple-400">Jarak Rata-Rata: 3.4 KM</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center text-xs">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block">1. Queue Shovel</span>
            <span className="text-lg font-black text-amber-400">
              {kpiOverview.cycleTime.avgQueueLoaderMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Antrian di Pocket</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">2. Spot Shovel</span>
            <span className="text-lg font-black text-slate-200">
              {kpiOverview.cycleTime.avgSpotLoaderMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Manuver Mundur</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">3. Loading</span>
            <span className="text-lg font-black text-emerald-400">
              {kpiOverview.cycleTime.avgLoadingMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Pengisian Bucket</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-blue-400 font-bold block">4. Haul Loaded</span>
            <span className="text-lg font-black text-blue-400">
              {kpiOverview.cycleTime.avgHaulLoadedMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Kecepatan 24 km/h</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block">5. Queue Dump</span>
            <span className="text-lg font-black text-amber-400">
              {kpiOverview.cycleTime.avgQueueDumpMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Antri di Disposal</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">6. Dumping</span>
            <span className="text-lg font-black text-slate-200">
              {kpiOverview.cycleTime.avgDumpingMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Angkat Vessel</span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] text-sky-400 font-bold block">7. Return Empty</span>
            <span className="text-lg font-black text-sky-400">
              {kpiOverview.cycleTime.avgReturnEmptyMin} m
            </span>
            <span className="text-[10px] text-slate-500 block">Kecepatan 31 km/h</span>
          </div>
        </div>
      </div>

      {/* Simulator: Queue Reduction & Fleet Gain */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-black text-white">
              AI What-If Simulation: Pengurangan Antrian Shovel & Dampak Tonase
            </h3>
          </div>
          <span className="text-xs text-purple-300 font-mono">Dynamic Dispatch Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">
              Target Pengurangan Waktu Antri (Menit): {targetQueueReductionMin} min
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.5"
              value={targetQueueReductionMin}
              onChange={(e) => setTargetQueueReductionMin(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.5 Menit</span>
              <span>1.5 Menit (Optimal)</span>
              <span>3.0 Menit</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Cycle Time Baru Pasca Optimasi</span>
            <div className="text-2xl font-black text-purple-300">{optimizedAvgCycle} Menit</div>
            <span className="text-[10px] text-emerald-400">
              Penghematan {targetQueueReductionMin} menit per rit per unit
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Tambahan Produksi per Shift</span>
            <div className="text-2xl font-black text-emerald-400">
              +{extraTonnageShift.toLocaleString()} Tons
            </div>
            <span className="text-[10px] text-slate-300">
              +{additionalTripsPerShift} Trips per unit ({simulatedTrucks} dump trucks aktif)
            </span>
          </div>
        </div>
      </div>

      {/* Individual Haul Truck Cycle Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Truck className="h-4 w-4 text-purple-400" />
            Matriks Cycle Time Tiap Dump Truck HD785 & 777E
          </h3>
          <span className="text-xs text-slate-400">{dumpTrucks.length} Haul Trucks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Unit ID</th>
                <th className="p-3 font-semibold">Model</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Queue (m)</th>
                <th className="p-3 font-semibold">Load (m)</th>
                <th className="p-3 font-semibold">Haul (m)</th>
                <th className="p-3 font-semibold">Dump (m)</th>
                <th className="p-3 font-semibold">Return (m)</th>
                <th className="p-3 font-semibold">Total Cycle</th>
                <th className="p-3 font-semibold">Trips Today</th>
                <th className="p-3 font-semibold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {dumpTrucks.map((dt) => (
                <tr key={dt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-black text-white">{dt.unitId}</td>
                  <td className="p-3">
                    {dt.brand} {dt.model}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        dt.status === "RUNNING"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : dt.status === "IDLE"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : dt.status === "BREAKDOWN"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-sky-500/20 text-sky-400 border-sky-500/30"
                      }`}
                    >
                      {dt.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-400">
                    {dt.cycleTime?.queueAtLoaderMin}m
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {dt.cycleTime?.loadingTimeMin}m
                  </td>
                  <td className="p-3 font-bold text-blue-400">{dt.cycleTime?.haulLoadedMin}m</td>
                  <td className="p-3 font-bold text-slate-300">{dt.cycleTime?.dumpingTimeMin}m</td>
                  <td className="p-3 font-bold text-sky-400">{dt.cycleTime?.returnEmptyMin}m</td>
                  <td className="p-3 font-black text-purple-400">
                    {dt.cycleTime?.totalCycleTimeMin}m
                  </td>
                  <td className="p-3 font-extrabold text-white">
                    {dt.productivity?.tripsCountToday || 0} Rit
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenUnit(dt)}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                    >
                      Lihat
                    </button>
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
