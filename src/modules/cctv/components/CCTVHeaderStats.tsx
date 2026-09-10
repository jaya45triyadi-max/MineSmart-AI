// MINE SMART AI - AI CCTV Header Stats Component

import React from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Cpu,
  Eye,
  Flame,
  HardHat,
  Layers,
  Radio,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Video,
  Wind,
  Zap,
} from "lucide-react";
import { AICCTVEnterpriseSummary, VisionDetectionCategory } from "../../../types/cctvTypes";

interface CCTVHeaderStatsProps {
  summary: AICCTVEnterpriseSummary;
  liveFrameCount: number;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onOpenSandbox: () => void;
  onOpenConfig: () => void;
}

export const CCTVHeaderStats: React.FC<CCTVHeaderStatsProps> = ({
  summary,
  liveFrameCount,
  isStreaming,
  onToggleStreaming,
  onOpenSandbox,
  onOpenConfig,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
            <Video className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-wide">
                AI CCTV & MINING VISION ANALYTICS
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                ENTERPRISE PACKAGE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ESDM 1827/2018 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              8-Domain Edge AI Vision: PPE • Helmet • Vest • Person • Vehicle • Restricted Area • Unsafe Proximity • Smoke/Fire
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edge Ingestion Rate */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
            <Radio className={`w-4 h-4 ${isStreaming ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
            <span className="text-slate-300 font-medium">Edge Tensor:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {summary.averageInferenceLatencyMs.toFixed(1)} ms
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              (Frame #{liveFrameCount})
            </span>
          </div>

          <button
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isStreaming
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40"
                : "bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {isStreaming ? "Live Streams Active" : "Streams Paused"}
          </button>

          <button
            onClick={onOpenSandbox}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-purple-900/30"
          >
            <Zap className="w-3.5 h-3.5" />
            Inject AI Vision Test
          </button>

          <button
            onClick={onOpenConfig}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            RTSP Config
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total AI Cameras Online */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">AI CCTV Network</span>
            <Video className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white font-mono">
              {summary.totalCamerasOnline}/{summary.totalCamerasMonitored}
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">
              100% Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Jetson AGX Orin Edge Tensor @ 30 FPS DeepStream
          </p>
        </div>

        {/* Card 2: PPE Compliance Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">PPE Compliance Index</span>
            <HardHat className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {summary.overallPPECompliancePct.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 font-mono">
              Target: 95.0%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.overallPPECompliancePct}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Active Safety Incidents */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-900/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Safety Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-rose-400 font-mono">
              {summary.criticalSafetyBreachesToday}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-md border border-rose-500/30 font-bold">
                {summary.activeUnsafeInteractionsCount} Proximity
              </span>
              <span className="bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-md border border-orange-500/30 font-bold">
                {summary.smokeFireAlertsCount} Smoke
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-rose-400 font-bold">{summary.restrictedAreaBreachesCount} Zone Breach</span> • ESDM High Potential Incident (HPI)
          </p>
        </div>

        {/* Card 4: 8-Detection Class Matrix Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">8 Vision Detection Domains</span>
            <Scan className="w-4 h-4 text-purple-400" />
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">HELMET</div>
              <div className="text-emerald-400 font-bold">{summary.detectionsByCategory.helmet}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">VEST</div>
              <div className="text-amber-400 font-bold">{summary.detectionsByCategory.vest}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">PERSON</div>
              <div className="text-cyan-400 font-bold">{summary.detectionsByCategory.person}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">VEHICLE</div>
              <div className="text-indigo-400 font-bold">{summary.detectionsByCategory.vehicle}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">ZONE</div>
              <div className="text-rose-400 font-bold">{summary.detectionsByCategory.restricted_area}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">PROXIM</div>
              <div className="text-rose-400 font-bold">{summary.detectionsByCategory.unsafe_interaction}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">SMOKE</div>
              <div className="text-orange-400 font-bold">{summary.detectionsByCategory.smoke_fire}</div>
            </div>
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-[9px]">PPE OK</div>
              <div className="text-teal-400 font-bold">{summary.detectionsByCategory.ppe}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
