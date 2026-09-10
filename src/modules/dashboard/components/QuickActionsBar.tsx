// MINE SMART AI - Quick Actions Bar Component

import React from "react";
import { PlusCircle, Truck, ShieldAlert, Layers, FileText, Sparkles, Brain } from "lucide-react";

interface QuickActionsBarProps {
  onNavigateModule: (moduleKey: string) => void;
  onOpenAICopilot: () => void;
  onOpenExecutiveReport: () => void;
  permissions?: string[];
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onNavigateModule,
  onOpenAICopilot,
  onOpenExecutiveReport,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
        Aksi Cepat:
      </span>

      <button
        onClick={() => onNavigateModule("root-cause")}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 hover:brightness-125 font-black transition-all whitespace-nowrap shadow-md shadow-amber-950/40"
      >
        <Brain className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>⚡ AI Root Cause (RCA)</span>
      </button>

      <button
        onClick={() => onNavigateModule("ai-reports")}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-black transition-all whitespace-nowrap shadow-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>⚡ AI Report Generator</span>
      </button>

      <button
        onClick={() => onNavigateModule("production")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold transition-all whitespace-nowrap"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>+ Input Produksi</span>
      </button>

      <button
        onClick={() => onNavigateModule("fleet")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-bold transition-all whitespace-nowrap"
      >
        <Truck className="h-3.5 w-3.5" />
        <span>+ Status Fleet</span>
      </button>

      <button
        onClick={() => onNavigateModule("hse")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold transition-all whitespace-nowrap"
      >
        <ShieldAlert className="h-3.5 w-3.5" />
        <span>Catat Incident K3LH</span>
      </button>

      <button
        onClick={() => onNavigateModule("stockpile")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-bold transition-all whitespace-nowrap"
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Mutasi Stockpile</span>
      </button>

      <button
        onClick={onOpenExecutiveReport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold transition-all whitespace-nowrap"
      >
        <FileText className="h-3.5 w-3.5 text-slate-400" />
        <span>Cetak Report</span>
      </button>

      <button
        onClick={onOpenAICopilot}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow transition-all whitespace-nowrap ml-auto"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        <span>Tanya AI Copilot</span>
      </button>
    </div>
  );
};
