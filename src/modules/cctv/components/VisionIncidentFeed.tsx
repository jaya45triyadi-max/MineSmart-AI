// MINE SMART AI - AI CCTV Vision Incident Feed & Forensic Center Component

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  HardHat,
  Layers,
  MapPin,
  Megaphone,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Video,
  Volume2,
  Wrench,
  Zap,
} from "lucide-react";
import { VisionIncident, CameraFeed, VisionDetectionCategory } from "../../../types/cctvTypes";
import { VisionAiEngine } from "../../../services/cctv/visionAiEngine";

interface VisionIncidentFeedProps {
  incidents: VisionIncident[];
  cameras: CameraFeed[];
  onAcknowledge: (id: string) => void;
  onSelectCamera: (cameraId: string) => void;
  onDispatchAlert: (incident: VisionIncident) => void;
}

export const VisionIncidentFeed: React.FC<VisionIncidentFeedProps> = ({
  incidents,
  cameras,
  onAcknowledge,
  onSelectCamera,
  onDispatchAlert,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<VisionIncident | null>(incidents[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [isDiagnosingGemini, setIsDiagnosingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<any | null>(null);

  const filteredIncidents = incidents.filter((item) => {
    const matchesCategory = filterCategory === "ALL" || item.category === filterCategory;
    const matchesSeverity = filterSeverity === "ALL" || item.severity === filterSeverity;
    return matchesCategory && matchesSeverity;
  });

  const activeCamera = cameras.find((c) => c.id === selectedIncident?.cameraId) || cameras[0];

  const handleRunGeminiForensics = async (incident: VisionIncident) => {
    if (!activeCamera) return;
    setIsDiagnosingGemini(true);
    setGeminiResult(null);

    try {
      const res = await VisionAiEngine.requestGeminiVisionForensics(incident, activeCamera);
      setGeminiResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosingGemini(false);
    }
  };

  const getCategoryIcon = (category: VisionDetectionCategory) => {
    switch (category) {
      case "helmet":
        return <HardHat className="w-4 h-4 text-emerald-400" />;
      case "vest":
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case "person":
        return <Users className="w-4 h-4 text-cyan-400" />;
      case "vehicle":
        return <Truck className="w-4 h-4 text-indigo-400" />;
      case "restricted_area":
        return <Layers className="w-4 h-4 text-rose-400" />;
      case "unsafe_interaction":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "smoke_fire":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "ppe":
        return <HardHat className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-md">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
          Safety Class:
        </span>
        {[
          { key: "ALL", label: "All 8 Domains" },
          { key: "helmet", label: "Helmet Missing" },
          { key: "vest", label: "Vest Missing" },
          { key: "unsafe_interaction", label: "Unsafe Proximity" },
          { key: "restricted_area", label: "Restricted Zone" },
          { key: "smoke_fire", label: "Smoke / Fire" },
          { key: "person", label: "Worker Count" },
          { key: "vehicle", label: "Mobile Fleet" },
        ].map((tab) => {
          const isActive = filterCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-900/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-750"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Split View: Left List of Incidents (5 Cols), Right Forensic Inspector (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Incidents Stream */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Live AI Safety Breaches ({filteredIncidents.length})
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-rose-400 font-medium font-mono">Vision Stream Active</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCritical = inc.severity === "CRITICAL";

              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setGeminiResult(null);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-slate-800/95 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg"
                      : isCritical
                      ? "bg-rose-950/20 border-rose-900/60 hover:border-rose-700 shadow-sm"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-slate-800 border border-slate-700">
                        {getCategoryIcon(inc.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs font-mono">
                            {inc.cameraCode}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              isCritical
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(inc.timestamp).toLocaleTimeString()} • {inc.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-mono">AI Conf</div>
                      <div className="text-sm font-extrabold text-emerald-400 font-mono">
                        {inc.confidencePct}%
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                    {inc.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {inc.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-750 font-mono">
                    <span className="text-slate-400 truncate max-w-[200px]">{inc.location}</span>
                    <span
                      className={`font-bold ${
                        inc.status === "ACTIVE"
                          ? "text-rose-400 animate-pulse"
                          : inc.status === "ACKNOWLEDGED"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Deep Forensic Analysis & Dispatch Panel */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-4">
              {/* Incident Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                        {selectedIncident.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Camera: <strong className="text-white">{selectedIncident.cameraName}</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide mt-1">
                      {selectedIncident.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-md ${
                      selectedIncident.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {selectedIncident.severity}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Status: <span className="text-cyan-400 font-bold">{selectedIncident.status}</span>
                  </div>
                </div>
              </div>

              {/* ESDM Minerba Compliance Card */}
              <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    ESDM Regulatory Reference:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedIncident.esdmComplianceRule.code}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {selectedIncident.esdmComplianceRule.article}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "{selectedIncident.esdmComplianceRule.requirement}"
                </p>
              </div>

              {/* Forensic Metric Badges */}
              <div className="grid grid-cols-3 gap-2.5 font-mono text-xs text-center">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Detection Trigger</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                    {selectedIncident.aiForensicAnalysis.detectionTrigger}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Confidence {selectedIncident.confidencePct}%</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Proximity Distance</div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">
                    {selectedIncident.aiForensicAnalysis.proximityDistanceM
                      ? `${selectedIncident.aiForensicAnalysis.proximityDistanceM} Meter`
                      : "Direct Visual Breach"}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Min Safe: 15.0m</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Danger Level</div>
                  <div className="text-xs font-bold text-amber-400 mt-1 truncate">
                    {selectedIncident.aiForensicAnalysis.dangerLevel}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ESDM Red Risk</div>
                </div>
              </div>

              {/* AI Gemini Reasoning Output */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Gemini AI Vision Forensic Analysis
                  </span>
                  <button
                    onClick={() => handleRunGeminiForensics(selectedIncident)}
                    disabled={isDiagnosingGemini}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/50 text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDiagnosingGemini ? "animate-spin" : ""}`} />
                    {isDiagnosingGemini ? "Analyzing Frame..." : "Deep Reasoning"}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {geminiResult?.forensicSummary || selectedIncident.description}
                </p>
              </div>

              {/* Recommended Proactive Actions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Rekomendasi Tindakan Cepat Pengawas K3:
                </span>
                <div className="space-y-1.5">
                  {(geminiResult?.immediateMitigationPlan || [selectedIncident.aiForensicAnalysis.recommendedInstantAction]).map(
                    (action: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{action}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onSelectCamera(selectedIncident.cameraId)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  View Live Camera Feed
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAcknowledge(selectedIncident.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>

                  <button
                    onClick={() => onDispatchAlert(selectedIncident)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-900/40 transition-all"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    Broadcast K3 Radio Alert
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-500">
              Select an incident from the stream to view AI forensics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
