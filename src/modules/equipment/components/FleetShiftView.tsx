// MINE SMART AI - Fleet Shift Performance View

import React from "react";
import { Clock, Activity, TrendingUp, CheckCircle2 } from "lucide-react";

export const FleetShiftView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>FLEET SHIFT PERFORMANCE COMPARISON</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perbandingan Kinerja Fleet Tambang Antar Shift (Shift A / Shift B / Shift C)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-amber-400 text-sm">SHIFT A (DAY SHIFT)</span>
            <span className="text-emerald-400 font-bold">82.4% UA</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between"><span>Produksi Coal:</span><span className="font-bold text-white">7,850 MT</span></div>
            <div className="flex justify-between"><span>Produksi OB:</span><span className="font-bold text-white">26,400 BCM</span></div>
            <div className="flex justify-between"><span>Fuel Consumed:</span><span className="font-bold text-amber-300">22,400 L</span></div>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sky-400 text-sm">SHIFT B (NIGHT SHIFT)</span>
            <span className="text-emerald-400 font-bold">78.1% UA</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between"><span>Produksi Coal:</span><span className="font-bold text-white">6,400 MT</span></div>
            <div className="flex justify-between"><span>Produksi OB:</span><span className="font-bold text-white">22,200 BCM</span></div>
            <div className="flex justify-between"><span>Fuel Consumed:</span><span className="font-bold text-amber-300">19,750 L</span></div>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-indigo-400 text-sm">SHIFT C (CUSTOM SHIFT)</span>
            <span className="text-emerald-400 font-bold">80.0% UA</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between"><span>Produksi Coal:</span><span className="font-bold text-white">0 MT (Standby)</span></div>
            <div className="flex justify-between"><span>Produksi OB:</span><span className="font-bold text-white">12,500 BCM</span></div>
            <div className="flex justify-between"><span>Fuel Consumed:</span><span className="font-bold text-amber-300">8,500 L</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
