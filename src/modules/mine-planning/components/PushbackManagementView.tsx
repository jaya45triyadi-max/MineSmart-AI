// MINE SMART AI - Pushback Management & Stage Mining Component

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Flame,
  Pickaxe,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Pushback } from "../../../types/minePlanningTypes";

interface PushbackManagementViewProps {
  pushbacks: Pushback[];
  onAddPushback: (pushback: Pushback) => void;
}

export const PushbackManagementView: React.FC<PushbackManagementViewProps> = ({
  pushbacks,
  onAddPushback,
}) => {
  const [pbName, setPbName] = useState("Pushback 4 (PB04 - North Deep Extension)");
  const [coalReserve, setCoalReserve] = useState(6.2);
  const [wasteVolume, setWasteVolume] = useState(31.0);
  const [startPeriod, setStartPeriod] = useState("2028-Q3");
  const [endPeriod, setEndPeriod] = useState("2032-Q4");

  const handleCreatePushback = () => {
    const stripRatio = Math.round((wasteVolume / coalReserve) * 100) / 100;
    const newPb: Pushback = {
      id: `pb-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      pushbackId: `PB0${pushbacks.length + 1}`,
      name: pbName,
      pitId: "pit-01",
      sequenceOrder: pushbacks.length + 1,
      coalReserveMt: coalReserve,
      wasteVolumeMbc: wasteVolume,
      totalMovementMbc: Math.round((wasteVolume + coalReserve / 1.3) * 100) / 100,
      stripRatio,
      startPeriod,
      endPeriod,
      status: "PLANNED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddPushback(newPb);
  };

  return (
    <div className="space-y-6">
      {/* Top Config Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Pushback & Stage Mining Allocation
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">MINE STAGING ENGINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="text-slate-400 font-bold block mb-1">Nama Pushback / Stage:</label>
            <input
              type="text"
              value={pbName}
              onChange={(e) => setPbName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Cadangan Coal (MT):</label>
            <input
              type="number"
              step="0.1"
              value={coalReserve}
              onChange={(e) => setCoalReserve(parseFloat(e.target.value) || 1)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Volume Waste (MBCM):</label>
            <input
              type="number"
              step="0.1"
              value={wasteVolume}
              onChange={(e) => setWasteVolume(parseFloat(e.target.value) || 5)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCreatePushback}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Pushback Stage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pushback Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pushbacks.map((pb) => (
          <div
            key={pb.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-teal-500/10 text-teal-500 font-mono">
                Urutan Ke-{pb.sequenceOrder}: {pb.pushbackId}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  pb.status === "CURRENT_MINING"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-slate-500/10 text-slate-400"
                }`}
              >
                ● {pb.status}
              </span>
            </div>

            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
              {pb.name}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Cadangan Coal:</span>
                <span className="font-bold text-amber-500 text-sm">{pb.coalReserveMt} MT</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Volume Waste:</span>
                <span className="font-bold text-sky-400 text-sm">{pb.wasteVolumeMbc} MBCM</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Design Strip Ratio:</span>
              <span className="font-mono font-black text-emerald-500">{pb.stripRatio} : 1</span>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Periode Mining: {pb.startPeriod} s/d {pb.endPeriod}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
