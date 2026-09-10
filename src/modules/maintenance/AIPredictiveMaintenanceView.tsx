// MINE SMART AI - AI Predictive Maintenance View
// Multi-factor AI Analysis: Engine Hours, Breakdown History, Maintenance History, Fuel, Operating Pattern -> Early Warning

import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  Flame,
  Activity,
  History,
  Clock,
  Gauge,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Sliders,
  RefreshCw,
  Search,
  ShieldAlert,
  Layers
} from "lucide-react";
import {
  AIEarlyWarningAlert,
  AIPredictiveTelemetry
} from "../../types/maintenanceTypes";

interface AIPredictiveMaintenanceViewProps {
  alerts: AIEarlyWarningAlert[];
  telemetries: AIPredictiveTelemetry[];
  onTriggerConvertToWO: (alert: AIEarlyWarningAlert) => void;
  onOpenAIAssistant: () => void;
}

export const AIPredictiveMaintenanceView: React.FC<AIPredictiveMaintenanceViewProps> = ({
  alerts,
  telemetries,
  onTriggerConvertToWO,
  onOpenAIAssistant,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"warnings" | "telemetry" | "factors">("warnings");

  const filteredAlerts = alerts.filter((alt) =>
    selectedUnit === "ALL" ? true : alt.equipmentCode === selectedUnit
  );

  const handleRunAiScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Hero AI Predictive banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MINE SMART AI™ • Predictive Failure Prevention</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              AI Multi-Factor Anomaly & Early Warning Engine
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI continuously analyzes <strong className="text-amber-400">Engine Hours</strong>,{" "}
              <strong className="text-amber-400">Breakdown History</strong>,{" "}
              <strong className="text-amber-400">Maintenance History</strong>,{" "}
              <strong className="text-amber-400">Fuel Consumption</strong>, and{" "}
              <strong className="text-amber-400">Operating Patterns</strong> to detect component fatigue 40–120 hours before catastrophic breakdown occurs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAiScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Running Telemetry Neural Scan..." : "Re-Scan Fleet Telemetry"}</span>
            </button>

            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>Ask AI Maintenance Copilot</span>
            </button>
          </div>
        </div>

        {/* 5 Analytical Dimensions Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>1. Engine Hours</span>
            </div>
            <div className="text-xs font-black text-white mt-1">Cumulative SMU Wear</div>
            <div className="text-[10px] text-slate-400 mt-0.5">MTBF calculation & degradation model</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>2. Breakdown History</span>
            </div>
            <div className="text-xs font-black text-white mt-1">Recurrent Failure Vectors</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pattern matching previous unscheduled stops</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>3. Maintenance Hist</span>
            </div>
            <div className="text-xs font-black text-white mt-1">PM Service Compliance</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Component lifetime remaining & past jobs</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Fuel Telemetry</span>
            </div>
            <div className="text-xs font-black text-white mt-1">Thermal & Burn Delta</div>
            <div className="text-[10px] text-slate-400 mt-0.5">L/hr surges indicating injector/turbo drag</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>5. Operating Pattern</span>
            </div>
            <div className="text-xs font-black text-white mt-1">Duty Cycle Stress</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Haul ramp gradient, brake friction & idle %</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("warnings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "warnings"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Active Early Warnings ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "telemetry"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Unit Diagnostic Matrix ({telemetries.length})</span>
        </button>
      </div>

      {/* View 1: Active Early Warnings */}
      {activeTab === "warnings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 shadow-xl space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        alt.riskLevel === "CRITICAL"
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : alt.riskLevel === "HIGH"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-white">{alt.equipmentCode}</span>
                        <span className="text-xs text-slate-400">• {alt.componentTarget}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            alt.riskLevel === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : alt.riskLevel === "HIGH"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {alt.riskLevel} Risk
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white mt-0.5">{alt.title}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-black">AI Confidence</div>
                      <div className="text-sm font-black text-amber-400">{alt.confidenceScore}% Model Match</div>
                    </div>

                    <button
                      onClick={() => onTriggerConvertToWO(alt)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <span>Generate Work Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description & Est Time */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  {alt.description}
                </p>

                {/* The 5 Factor Analysis breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">1. Engine Hours</div>
                    <div className="text-xs font-bold text-white mt-1">{alt.analyzedFactors.engineHoursAnalysis}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">2. Breakdown History</div>
                    <div className="text-xs font-bold text-white mt-1">{alt.analyzedFactors.breakdownHistoryAnalysis}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">3. Maintenance History</div>
                    <div className="text-xs font-bold text-white mt-1">{alt.analyzedFactors.maintenanceHistoryAnalysis}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">4. Fuel Telemetry</div>
                    <div className="text-xs font-bold text-white mt-1">{alt.analyzedFactors.fuelTelemetryAnalysis}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">5. Operating Pattern</div>
                    <div className="text-xs font-bold text-white mt-1">{alt.analyzedFactors.operatingPatternAnalysis}</div>
                  </div>
                </div>

                {/* Recommended Action & Cost savings */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <strong className="text-amber-400">Recommended Action:</strong>
                    <span>{alt.recommendedAction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <span>Est. Downtime Prevention:</span>
                    <strong className="text-emerald-400">{alt.estimatedHoursToFailure} Jam</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Unit Diagnostic Matrix */}
      {activeTab === "telemetry" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {telemetries.map((tele) => (
            <div
              key={tele.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 shadow-xl space-y-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-base font-black text-white">{tele.equipmentCode}</div>
                  <div className="text-[11px] text-slate-400">{tele.model}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">AI Wear Index</div>
                  <div
                    className={`text-base font-black ${
                      tele.engineWearIndex > 80
                        ? "text-rose-400"
                        : tele.engineWearIndex > 60
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {tele.engineWearIndex}%
                  </div>
                </div>
              </div>

              {/* Progress bar of wear */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      tele.engineWearIndex > 80
                        ? "bg-rose-500"
                        : tele.engineWearIndex > 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${tele.engineWearIndex}%` }}
                  />
                </div>
              </div>

              {/* Telemetry Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Current SMU</div>
                  <div className="font-bold text-white mt-0.5">{tele.currentEngineHours.toLocaleString()} Hrs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Next PM Due</div>
                  <div className="font-bold text-amber-400 mt-0.5">In {tele.nextPMDueHours} Hrs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Fuel Delta</div>
                  <div className="font-bold text-rose-400 mt-0.5">{tele.fuelDeltaFromBenchmark}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Idle Ratio</div>
                  <div className="font-bold text-slate-200 mt-0.5">{tele.idlePercentage}%</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Operating Pattern:</div>
                <div>{tele.operatingPatternNote}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
