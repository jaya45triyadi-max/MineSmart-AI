// MINE SMART AI - IoT Center Header Stats Component

import React from "react";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Droplet,
  Radio,
  ShieldCheck,
  Thermometer,
  Zap,
} from "lucide-react";
import { IoTAnalyticsSummary } from "../../../types/iotTypes";

interface IoTHeaderStatsProps {
  summary: IoTAnalyticsSummary;
  liveTickCount: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onOpenSimulator: () => void;
  onOpenThresholds: () => void;
}

export const IoTHeaderStats: React.FC<IoTHeaderStatsProps> = ({
  summary,
  liveTickCount,
  isStreaming,
  onToggleStreaming,
  onOpenSimulator,
  onOpenThresholds,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                MINE SMART IoT CENTER & AI ANOMALY RADAR
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                8-SENSOR MATRIX LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous Real-Time Telemetry: Fuel • Temp • Pressure • Engine • GPS • Vibration • Weight • Environment
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Ingestion Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <Radio className={`w-4 h-4 ${isStreaming ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
            <span className="text-slate-300 font-medium">Ingestion:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {summary.ingestionRatePerSec.toFixed(1)} pkt/s
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              (Tick #{liveTickCount})
            </span>
          </div>

          <button
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isStreaming
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40"
                : "bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {isStreaming ? "Streaming Active" : "Stream Paused"}
          </button>

          <button
            onClick={onOpenSimulator}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Inject AI Anomaly Test
          </button>

          <button
            onClick={onOpenThresholds}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Thresholds
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Monitored Sensors */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total IoT Sensor Array</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">
              {summary.totalSensorsMonitored}
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {summary.onlineGatewaysCount} Gateways Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            8 Sensor Streams per Unit (100% telemetry fidelity)
          </p>
        </div>

        {/* Card 2: AI Multi-Variate Fleet Health */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fleet Health Index</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">
              {summary.averageFleetHealthScorePct.toFixed(1)}%
            </div>
            <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              AI Confidence {summary.aiDetectionAccuracyPct}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.averageFleetHealthScorePct}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Active Anomalies Detected */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-900/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">AI Anomalies Active</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-rose-400 font-mono">
              {summary.criticalAnomaliesCount + summary.warningAnomaliesCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-semibold">
                {summary.criticalAnomaliesCount} Critical
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-semibold">
                {summary.warningAnomaliesCount} Warn
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-rose-400 font-semibold">{summary.fuelTheftAlertsToday} Fuel Theft Alert</span> •{" "}
            <span>{summary.overheatingRisksToday} Overheating</span>
          </p>
        </div>

        {/* Card 4: 8-Sensor Breakdown Matrix */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">8-Sensor Anomaly Breakdown</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">FUEL</div>
              <div className="text-cyan-400 font-bold">{summary.anomaliesByCategory.fuel}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">TEMP</div>
              <div className="text-rose-400 font-bold">{summary.anomaliesByCategory.temperature}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">PRES</div>
              <div className="text-amber-400 font-bold">{summary.anomaliesByCategory.pressure}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">ENG</div>
              <div className="text-emerald-400 font-bold">{summary.anomaliesByCategory.engine}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">GPS</div>
              <div className="text-indigo-400 font-bold">{summary.anomaliesByCategory.gps}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">VIB</div>
              <div className="text-purple-400 font-bold">{summary.anomaliesByCategory.vibration}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">WT</div>
              <div className="text-teal-400 font-bold">{summary.anomaliesByCategory.weight}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded border border-slate-700">
              <div className="text-slate-400 text-[9px]">ENV</div>
              <div className="text-lime-400 font-bold">{summary.anomaliesByCategory.environment}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
