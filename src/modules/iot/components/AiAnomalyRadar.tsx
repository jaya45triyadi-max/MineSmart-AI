// MINE SMART AI - AI Anomaly Radar & Diagnostic Center Component

import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  HelpCircle,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Thermometer,
  Truck,
  Wind,
  Wrench,
  X,
} from "lucide-react";
import { IoTAnomaly, EquipmentIoTTelemetry, SensorCategoryType } from "../../../types/iotTypes";
import { IoTAnomalyDetectionEngine } from "../../../services/iot/iotAnomalyEngine";

interface AiAnomalyRadarProps {
  anomalies: IoTAnomaly[];
  fleet: EquipmentIoTTelemetry[];
  onAcknowledgeAnomaly: (id: string) => void;
  onGenerateWorkOrder: (anomaly: IoTAnomaly) => void;
  onSelectUnitFromAnomaly: (unitCode: string) => void;
}

export const AiAnomalyRadar: React.FC<AiAnomalyRadarProps> = ({
  anomalies,
  fleet,
  onAcknowledgeAnomaly,
  onGenerateWorkOrder,
  onSelectUnitFromAnomaly,
}) => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<IoTAnomaly | null>(anomalies[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [isDiagnosingGemini, setIsDiagnosingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<any | null>(null);

  const filteredAnomalies = anomalies.filter((item) => {
    const matchesCategory = filterCategory === "ALL" || item.sensorCategory === filterCategory;
    const matchesSeverity = filterSeverity === "ALL" || item.severity === filterSeverity;
    return matchesCategory && matchesSeverity;
  });

  const activeEquipment = fleet.find((f) => f.equipmentCode === selectedAnomaly?.equipmentCode);

  const handleRunGeminiDeepAnalysis = async (anomaly: IoTAnomaly) => {
    if (!activeEquipment) return;
    setIsDiagnosingGemini(true);
    setGeminiResult(null);

    try {
      const result = await IoTAnomalyDetectionEngine.requestGeminiDeepDiagnosis(
        anomaly,
        activeEquipment
      );
      setGeminiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosingGemini(false);
    }
  };

  const getCategoryIcon = (category: SensorCategoryType) => {
    switch (category) {
      case "fuel":
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case "temperature":
        return <Thermometer className="w-4 h-4 text-rose-400" />;
      case "pressure":
        return <Gauge className="w-4 h-4 text-amber-400" />;
      case "engine":
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "gps":
        return <MapPin className="w-4 h-4 text-indigo-400" />;
      case "vibration":
        return <Layers className="w-4 h-4 text-purple-400" />;
      case "weight":
        return <Sliders className="w-4 h-4 text-teal-400" />;
      case "environment":
        return <Wind className="w-4 h-4 text-lime-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl backdrop-blur-md">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
          Sensor Domain:
        </span>
        {[
          { key: "ALL", label: "All 8 Sensors", icon: Cpu },
          { key: "fuel", label: "1. Fuel", icon: Droplet },
          { key: "temperature", label: "2. Temperature", icon: Thermometer },
          { key: "pressure", label: "3. Pressure", icon: Gauge },
          { key: "engine", label: "4. Engine", icon: Cpu },
          { key: "gps", label: "5. GPS", icon: MapPin },
          { key: "vibration", label: "6. Vibration", icon: Layers },
          { key: "weight", label: "7. Weight", icon: Sliders },
          { key: "environment", label: "8. Environment", icon: Wind },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filterCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-750"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Split View: Left List of Anomalies, Right Detailed AI Diagnostic Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Anomaly List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Detected Sensor Anomalies ({filteredAnomalies.length})
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-rose-400 font-medium">Real-time Stream Active</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredAnomalies.map((anom) => {
              const isSelected = selectedAnomaly?.id === anom.id;
              const isCritical = anom.severity === "CRITICAL";

              return (
                <div
                  key={anom.id}
                  onClick={() => {
                    setSelectedAnomaly(anom);
                    setGeminiResult(null);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-slate-800/95 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg"
                      : isCritical
                      ? "bg-rose-950/20 border-rose-900/60 hover:border-rose-700 shadow-sm"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
                        {getCategoryIcon(anom.sensorCategory)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs font-mono">
                            {anom.equipmentCode}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              isCritical
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {anom.severity}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(anom.timestamp).toLocaleTimeString()} • {anom.sensorCategory.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-mono">AI Score</div>
                      <div
                        className={`text-sm font-extrabold font-mono ${
                          anom.anomalyScore >= 90
                            ? "text-rose-400"
                            : anom.anomalyScore >= 75
                            ? "text-amber-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {anom.anomalyScore}/100
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                    {anom.metricLabel}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] bg-slate-800/60 px-2 py-1 rounded border border-slate-750 font-mono">
                    <span className="text-slate-400">Observed:</span>
                    <span className={isCritical ? "text-rose-400 font-bold" : "text-amber-300 font-bold"}>
                      {anom.observedValue} {anom.unit}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      (Exp: {anom.expectedRange.min}-{anom.expectedRange.max})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Deep Diagnostic Center (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedAnomaly ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-5">
              {/* Diagnostic Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        {selectedAnomaly.aiDetectionModel}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Confidence: <strong className="text-emerald-400">{selectedAnomaly.aiConfidencePct}%</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide mt-1">
                      {selectedAnomaly.metricLabel}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Unit: {selectedAnomaly.equipmentCode} ({selectedAnomaly.equipmentType}) • Site: {selectedAnomaly.siteId}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-md ${
                      selectedAnomaly.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {selectedAnomaly.severity}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Status: <span className="text-cyan-400 font-bold">{selectedAnomaly.status}</span>
                  </div>
                </div>
              </div>

              {/* Sensor Comparison Metrics Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Observed Sensor Value</div>
                  <div className="text-base font-bold text-rose-400 mt-1">
                    {selectedAnomaly.observedValue} {selectedAnomaly.unit}
                  </div>
                  <div className="text-[10px] text-rose-400/80 mt-0.5">
                    Deviasi: +{selectedAnomaly.deviationPct}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Expected Normal Envelope</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {selectedAnomaly.expectedRange.min} - {selectedAnomaly.expectedRange.max} {selectedAnomaly.unit}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ESDM / OEM Limit</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Est. Time to Failure</div>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    {selectedAnomaly.aiEstimatedTimeToFailureHours
                      ? `${selectedAnomaly.aiEstimatedTimeToFailureHours} Jam`
                      : "Immediate Action"}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Probabilitas: {selectedAnomaly.aiFailureProbabilityPct}%
                  </div>
                </div>
              </div>

              {/* AI Diagnosis Narrative */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    AI Multi-Sensor Telemetry Diagnosis
                  </span>
                  <button
                    onClick={() => handleRunGeminiDeepAnalysis(selectedAnomaly)}
                    disabled={isDiagnosingGemini}
                    className="px-2.5 py-1 rounded-md bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDiagnosingGemini ? "animate-spin" : ""}`} />
                    {isDiagnosingGemini ? "Analyzing with Gemini..." : "Gemini Deep Scan"}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {geminiResult?.detailedDiagnosis || selectedAnomaly.aiDiagnosis}
                </p>
              </div>

              {/* Root Cause Hypothesis */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  Hipotesis Penyebab Utama (Root Cause):
                </span>
                <p className="text-xs text-slate-300">
                  {geminiResult?.rootCauseAnalysis || selectedAnomaly.aiRootCauseHypothesis}
                </p>
              </div>

              {/* Recommended Proactive Action Plan */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Rekomendasi Tindakan Cepat (AI Action Checklist):
                </span>
                <div className="space-y-1.5">
                  {(geminiResult?.stepByStepActionPlan || selectedAnomaly.aiRecommendedActions).map(
                    (action: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
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
                  onClick={() => onSelectUnitFromAnomaly(selectedAnomaly.equipmentCode)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  View Unit Digital Twin
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAcknowledgeAnomaly(selectedAnomaly.id)}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>

                  <button
                    onClick={() => onGenerateWorkOrder(selectedAnomaly)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Auto-Dispatch Work Order
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500">
              Select an anomaly from the left stream to inspect AI Diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
