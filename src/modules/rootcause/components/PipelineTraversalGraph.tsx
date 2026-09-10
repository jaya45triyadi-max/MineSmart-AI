import React from "react";
import {
  PipelineDiagnosticNode,
  RcaPipelineStepKey,
} from "../../../types/rootCauseTypes";
import {
  Pickaxe,
  Truck,
  Clock,
  Route,
  Fuel,
  CloudRain,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface PipelineTraversalGraphProps {
  traversal: PipelineDiagnosticNode[];
  activeStepKey: RcaPipelineStepKey | null;
  onSelectStep: (stepKey: RcaPipelineStepKey) => void;
  isInvestigating?: boolean;
  activeScanIndex?: number;
}

const STEP_ICONS: Record<RcaPipelineStepKey, React.ComponentType<{ className?: string }>> = {
  production: Pickaxe,
  fleet: Truck,
  downtime: Clock,
  hauling: Route,
  fuel: Fuel,
  weather: CloudRain,
  maintenance: Wrench,
};

export const PipelineTraversalGraph: React.FC<PipelineTraversalGraphProps> = ({
  traversal,
  activeStepKey,
  onSelectStep,
  isInvestigating = false,
  activeScanIndex = -1,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background glow styling */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3 animate-pulse" />
              MULTI-PIPELINE AI TRAVERSAL
            </span>
            <span className="text-xs text-slate-400">7 Connected Dimensions</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Automated Diagnostic Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            Penelusuran anomali sistemik dari output produksi hingga akar masalah komponen telemetri.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Critical Root Cause</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Anomaly / Correlated</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Normal Layer</span>
          </div>
        </div>
      </div>

      {/* Flow Steps Horizontal / Responsive Grid */}
      <div className="relative">
        {/* Connection Line Behind (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-5 bg-gradient-to-r from-amber-500/40 via-cyan-500/40 to-rose-500/40 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
          {traversal.map((node, index) => {
            const Icon = STEP_ICONS[node.stepKey] || Pickaxe;
            const isSelected = activeStepKey === node.stepKey;
            const isScanning = isInvestigating && activeScanIndex === index;
            const isCritical = node.status === "CRITICAL_BOTTLENECK";
            const isAnomaly = node.status === "ANOMALY_DETECTED";
            const isNormal = node.status === "NORMAL";

            let borderStyle = "border-slate-800 bg-slate-950/70 hover:border-slate-700";
            let badgeBg = "bg-slate-800 text-slate-300";
            let iconBg = "bg-slate-800/80 text-slate-300";

            if (isCritical) {
              borderStyle = isSelected
                ? "border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50"
                : "border-rose-500/60 bg-rose-950/20 hover:border-rose-400";
              badgeBg = "bg-rose-500/20 text-rose-300 border border-rose-500/40";
              iconBg = "bg-rose-500/20 text-rose-400";
            } else if (isAnomaly) {
              borderStyle = isSelected
                ? "border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/50"
                : "border-amber-500/50 bg-amber-950/20 hover:border-amber-400";
              badgeBg = "bg-amber-500/20 text-amber-300 border border-amber-500/40";
              iconBg = "bg-amber-500/20 text-amber-400";
            } else if (isNormal) {
              borderStyle = isSelected
                ? "border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50"
                : "border-slate-800 bg-slate-950/60 hover:border-emerald-500/40";
              badgeBg = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
              iconBg = "bg-emerald-500/20 text-emerald-400";
            }

            if (isScanning) {
              borderStyle = "border-cyan-400 bg-cyan-950/50 ring-4 ring-cyan-400/40 shadow-xl shadow-cyan-500/20 animate-pulse";
            }

            return (
              <div
                key={node.stepKey}
                onClick={() => onSelectStep(node.stepKey)}
                className={`relative group cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${borderStyle}`}
              >
                {/* Step numbering & status */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        0{index + 1}
                      </span>
                      <div className={`p-1.5 rounded-lg ${iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {isCritical ? (
                      <span className="flex items-center text-rose-400 font-semibold text-[10px]">
                        <AlertOctagon className="w-3.5 h-3.5 mr-0.5" />
                        ROOT
                      </span>
                    ) : isAnomaly ? (
                      <span className="flex items-center text-amber-400 font-semibold text-[10px]">
                        <AlertTriangle className="w-3.5 h-3.5 mr-0.5" />
                        ANOMALY
                      </span>
                    ) : (
                      <span className="flex items-center text-emerald-400 font-medium text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                        CLEAR
                      </span>
                    )}
                  </div>

                  {/* Title & category */}
                  <h4 className="text-xs font-bold text-white capitalize leading-tight mb-1 group-hover:text-amber-300 transition-colors">
                    {node.stepName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate mb-2">
                    {node.categoryLabel}
                  </p>

                  {/* Metric Deviation snippet */}
                  <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 mb-2">
                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-2">
                      {node.deviationText}
                    </p>
                  </div>
                </div>

                {/* Footer info: Impact score & Confidence */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    Impact:{" "}
                    <strong
                      className={
                        node.impactScore > 75
                          ? "text-rose-400"
                          : node.impactScore > 40
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {node.impactScore}%
                    </strong>
                  </span>
                  <span className="text-slate-400">
                    AI: <strong className="text-cyan-300">{node.confidencePct.toFixed(1)}%</strong>
                  </span>
                </div>

                {/* Arrow connector for small screens */}
                {index < traversal.length - 1 && (
                  <div className="lg:hidden flex justify-center pt-2">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed Inspection Banner */}
      {activeStepKey && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          {(() => {
            const selectedNode = traversal.find((n) => n.stepKey === activeStepKey);
            if (!selectedNode) return null;
            const Icon = STEP_ICONS[selectedNode.stepKey] || Sparkles;

            return (
              <>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {selectedNode.stepName} — Deep Layer Diagnostic
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        Latency: {selectedNode.latencyMs}ms
                      </span>
                    </div>
                    <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                      {selectedNode.metricObserved}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {selectedNode.keyFindings.map((finding, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedNode.contributingEntities && selectedNode.contributingEntities.length > 0 && (
                  <div className="shrink-0 bg-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
                      Flagged Entities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.contributingEntities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
