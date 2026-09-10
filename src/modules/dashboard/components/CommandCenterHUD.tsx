// MINE SMART AI - Luxury Enterprise Command Center Mission Control HUD
// Features: Real-time Telemetry Ticker, Weather Pit Radar, Live AI Action Triage

import React from "react";
import {
  Activity,
  Sparkles,
  CloudRain,
  Wind,
  Sun,
  ShieldCheck,
  Zap,
  TrendingUp,
  Radio,
  Clock,
  Compass,
  AlertTriangle,
} from "lucide-react";

interface CommandCenterHUDProps {
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: any) => void;
}

export const CommandCenterHUD: React.FC<CommandCenterHUDProps> = ({
  onOpenAICopilot,
  onNavigateModule,
}) => {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0A142F]/90 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-4 luxury-card-glow relative overflow-hidden">
      {/* Background Neon Flow */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Mission Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0 m-auto" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight uppercase">
                Mine Smart Operations Command Center
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black border border-emerald-500/30">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sinkronisasi data terpusat dari FMS, GPS Dispatch, SCADA Crusher, dan IoT Sensor Tambang
            </p>
          </div>
        </div>

        {/* Real-Time Pit Micro-Climate & Weather Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 p-2 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sun className="w-4 h-4" />
            <span>31.5°C</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-[11px]">0.0 mm/hr (Dry Pit)</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-[11px]">12 km/h NW</span>
          </div>
        </div>
      </div>

      {/* Real-time Ticker Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 relative z-10">
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Coal Velocity
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-emerald-400 font-mono">1,480</span>
            <span className="text-[10px] text-slate-500">Ton/Hr</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-1 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% vs Plan</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            OB Stripping Rate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-cyan-400 font-mono">3,620</span>
            <span className="text-[10px] text-slate-500">BCM/Hr</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-cyan-400 mt-1 font-bold">
            <Activity className="w-3 h-3" />
            <span>5 Fleets Running</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Strip Ratio
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-purple-400 font-mono">4.82</span>
            <span className="text-[10px] text-slate-500">SR</span>
          </div>
          <div className="text-[9px] text-purple-400 mt-1 font-bold">
            Target: 4.90 (Optimal)
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Crusher 01 Rate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-amber-400 font-mono">1,820</span>
            <span className="text-[10px] text-slate-500">TPH</span>
          </div>
          <div className="text-[9px] text-amber-400 mt-1 font-bold">
            Stockpile ROM: 76.5%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pit Cycle Time
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-sky-400 font-mono">22.4</span>
            <span className="text-[10px] text-slate-500">Menit</span>
          </div>
          <div className="text-[9px] text-emerald-400 mt-1 font-bold">
            Efficiency: 94.8%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            HSE Zero Harm
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-emerald-400 font-mono">184</span>
            <span className="text-[10px] text-slate-500">Hari</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-1 font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero LTI Confirmed</span>
          </div>
        </div>
      </div>

      {/* AI Copilot Instant Action Triage Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white">AI Prescriptive Copilot:</span>
            <span className="text-slate-600 dark:text-slate-300 ml-1.5">
              Terdeteksi peluang optimasi dispatch +120 Ton pada Rute Pit Seam B ke Crusher 01.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAICopilot}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Terapkan Dispatch AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
