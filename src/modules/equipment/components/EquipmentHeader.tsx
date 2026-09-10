// MINE SMART AI - Equipment & Fleet Header Component

import React from "react";
import {
  Truck,
  Plus,
  Radio,
  ShieldAlert,
  Sparkles,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  Sliders,
  Compass,
} from "lucide-react";

interface EquipmentHeaderProps {
  totalUnits: number;
  operatingUnits: number;
  breakdownUnits: number;
  avgPA: number;
  avgUA: number;
  onNewUnit: () => void;
  onDispatch: () => void;
  onOpenAlerts: () => void;
  onOpenAI: () => void;
  onExport: () => void;
}

export const EquipmentHeader: React.FC<EquipmentHeaderProps> = ({
  totalUnits,
  operatingUnits,
  breakdownUnits,
  avgPA,
  avgUA,
  onNewUnit,
  onDispatch,
  onOpenAlerts,
  onOpenAI,
  onExport,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl text-white shadow-lg shadow-amber-900/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                EQUIPMENT & FLEET MANAGEMENT CENTER
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                PROMPT 12 • FMS Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pusat Manajemen Unit Tambang, Telemetri Jam Kerja (SMU), Dispatch FMS, Ketersediaan Fisik (PA), & Intelligence AI
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewUnit}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit Baru</span>
          </button>

          <button
            onClick={onDispatch}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-900/30"
          >
            <Radio className="w-4 h-4" />
            <span>Fleet Dispatch FMS</span>
          </button>

          <button
            onClick={onOpenAlerts}
            className="px-3.5 py-2 text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Peringatan Fleet</span>
          </button>

          <button
            onClick={onOpenAI}
            className="px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI Fleet Copilot</span>
          </button>

          <button
            onClick={onExport}
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Fleet</span>
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-sans block">Total Master Unit</span>
          <span className="text-sm font-bold text-white">{totalUnits} Unit</span>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-emerald-500/30">
          <span className="text-[10px] text-slate-400 font-sans block">Unit Operating</span>
          <span className="text-sm font-bold text-emerald-400">{operatingUnits} Unit</span>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-rose-500/30">
          <span className="text-[10px] text-slate-400 font-sans block">Unit Down / Repair</span>
          <span className="text-sm font-bold text-rose-400">{breakdownUnits} Unit</span>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-amber-500/30">
          <span className="text-[10px] text-slate-400 font-sans block">Avg Physical Availability</span>
          <span className="text-sm font-bold text-amber-300">{avgPA}% PA</span>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-sky-500/30">
          <span className="text-[10px] text-slate-400 font-sans block">Avg Fleet Utilization</span>
          <span className="text-sm font-bold text-sky-400">{avgUA}% UA</span>
        </div>
      </div>
    </div>
  );
};
