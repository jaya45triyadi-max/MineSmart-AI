// MINE SMART AI - Fleet Dispatch & Excavator-Truck Matching AI View

import React, { useState } from "react";
import { Radio, Truck, Pickaxe, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { FleetDispatchAssignment, HaulingCycleData } from "../../../types/equipmentTypes";
import { INITIAL_FLEET_DISPATCH } from "../../../data/equipmentData";

export const FleetDispatchView: React.FC = () => {
  const [dispatchList, setDispatchList] = useState<FleetDispatchAssignment[]>(INITIAL_FLEET_DISPATCH);

  // Simulated cycle time breakdown
  const sampleCycleData: HaulingCycleData = {
    id: "CYC-01",
    truckUnitCode: "HT-101",
    excavatorUnitCode: "EX-201",
    loadingTimeMin: 3.4,
    travelLoadedMin: 9.5,
    queueAtDumpMin: 1.2,
    dumpingTimeMin: 1.0,
    travelEmptyMin: 8.2,
    queueAtExcavatorMin: 2.1,
    totalCycleTimeMin: 25.4,
    isCompleteData: true,
    timestamp: "2026-08-13T08:45:00Z",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <span>FLEET DISPATCH & EXCAVATOR-TRUCK MATCHING CENTER</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen Alokasi Fleet Hauling, Analisis Match Factor, Rincian Komponen Cycle Time, & Optimization AI
          </p>
        </div>
      </div>

      {/* AI Excavator-Truck Matching Recommendation Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 border border-sky-500/30 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-sky-300">
          <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            AI FLEET MATCH FACTOR RECOMMENDATION
          </h3>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-amber-300">Penyesuaian Fleet Pit 1 South (EX-201)</span>
            <span className="text-emerald-400 font-bold">Match Factor Optimal: 0.98</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            <strong>REKOMENDASI AI:</strong> Pindahkan 2 unit Dump Truck (HT-106 & HT-107) dari Pit 2 North ke Pit 1 South.
            Penambahan ini akan meniadakan waktu tunggu Excavator EX-201 (PC1250) sebesar -3.8 menit per siklus dan meningkatkan estimasi ritase total sebesar +18 trips/shift.
          </p>
        </div>
      </div>

      {/* Cycle Time Breakdown Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Hauling Cycle Time Component Breakdown (HT-101 @ EX-201)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Loading Time</span>
            <span className="font-bold text-amber-300">{sampleCycleData.loadingTimeMin} min</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Travel Loaded</span>
            <span className="font-bold text-sky-400">{sampleCycleData.travelLoadedMin} min</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Queue at Dump</span>
            <span className="font-bold text-indigo-300">{sampleCycleData.queueAtDumpMin} min</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Dumping Time</span>
            <span className="font-bold text-emerald-400">{sampleCycleData.dumpingTimeMin} min</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Travel Empty</span>
            <span className="font-bold text-sky-400">{sampleCycleData.travelEmptyMin} min</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30">
            <span className="text-[10px] text-slate-400 block font-sans">Queue @ EX</span>
            <span className="font-bold text-rose-400">{sampleCycleData.queueAtExcavatorMin} min</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Total Cycle Time per Trip:</span>
          <span className="text-base font-bold text-amber-400">{sampleCycleData.totalCycleTimeMin} Menit</span>
        </div>
      </div>

      {/* Active Dispatch Assignments */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Active Fleet Dispatch Lines</h3>

        <div className="space-y-3">
          {dispatchList.map((disp) => (
            <div
              key={disp.id}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 text-sm">{disp.dispatchId}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 rounded uppercase">
                    {disp.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-sans">
                  <Pickaxe className="w-4 h-4 text-amber-400" />
                  <span>Loading: <strong>{disp.loadingPoint}</strong> ({disp.excavatorUnitCode})</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>Dump: <strong>{disp.dumpPoint}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-slate-400 block font-sans">Trucks Assigned</span>
                  <span className="font-bold text-white">{disp.trucksAssigned.length} Unit</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Target vs Actual</span>
                  <span className="font-bold text-emerald-400">{disp.actualTripCount} / {disp.targetTripCount} Trips</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
