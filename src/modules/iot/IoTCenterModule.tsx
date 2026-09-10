// MINE SMART AI - Enterprise IoT Center & 8-Sensor Anomaly Radar Module

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  Layers,
  LayoutGrid,
  ListFilter,
  MapPin,
  Maximize2,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Thermometer,
  Truck,
  Wifi,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import {
  EquipmentIoTTelemetry,
  IoTAnomaly,
  SensorThresholdConfig,
  IoTAnalyticsSummary,
  SensorCategoryType,
} from "../../types/iotTypes";
import {
  INITIAL_IOT_TELEMETRY_FLEET,
  INITIAL_IOT_ANOMALIES_LIST,
  INITIAL_SENSOR_THRESHOLDS,
  INITIAL_IOT_ANALYTICS_SUMMARY,
} from "../../data/iotData";
import { IoTAnomalyDetectionEngine } from "../../services/iot/iotAnomalyEngine";
import { IoTHeaderStats } from "./components/IoTHeaderStats";
import { LiveTelemetryMatrix } from "./components/LiveTelemetryMatrix";
import { AiAnomalyRadar } from "./components/AiAnomalyRadar";
import { DigitalTwinExplorer } from "./components/DigitalTwinExplorer";
import { SensorCategoryDeepDive } from "./components/SensorCategoryDeepDive";
import { AnomalySimulatorModal } from "./components/AnomalySimulatorModal";
import { ThresholdSettingsModal } from "./components/ThresholdSettingsModal";

export const IoTCenterModule: React.FC = () => {
  // State management
  const [fleet, setFleet] = useState<EquipmentIoTTelemetry[]>(INITIAL_IOT_TELEMETRY_FLEET);
  const [anomalies, setAnomalies] = useState<IoTAnomaly[]>(INITIAL_IOT_ANOMALIES_LIST);
  const [thresholds, setThresholds] = useState<SensorThresholdConfig[]>(INITIAL_SENSOR_THRESHOLDS);
  const [summary, setSummary] = useState<IoTAnalyticsSummary>(INITIAL_IOT_ANALYTICS_SUMMARY);
  const [selectedUnit, setSelectedUnit] = useState<EquipmentIoTTelemetry>(INITIAL_IOT_TELEMETRY_FLEET[0]);

  const [activeTab, setActiveTab] = useState<"MATRIX" | "AI_RADAR" | "DIGITAL_TWIN" | "SENSORS_DEEP">("MATRIX");
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [liveTickCount, setLiveTickCount] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isThresholdsOpen, setIsThresholdsOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time live simulation ticker
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setLiveTickCount((prev) => prev + 1);

      setFleet((currentFleet) => {
        return currentFleet.map((unit) => {
          // Simulate dynamic minor fluctuations
          const tickedUnit = IoTAnomalyDetectionEngine.simulateLiveTelemetryTick(unit);

          // Real-time scan for new anomalies
          const detected = IoTAnomalyDetectionEngine.scanEquipmentTelemetry(tickedUnit, thresholds);
          if (detected.length > 0) {
            setAnomalies((prevAnoms) => {
              const existingIds = new Set(prevAnoms.map((a) => `${a.equipmentCode}-${a.metricName}`));
              const newItems = detected.filter((d) => !existingIds.has(`${d.equipmentCode}-${d.metricName}`));
              return [...newItems, ...prevAnoms];
            });
          }

          return tickedUnit;
        });
      });

      // Update analytics ingestion rate summary
      setSummary((prev) => ({
        ...prev,
        totalTelemetryPacketsToday: prev.totalTelemetryPacketsToday + 8,
        ingestionRatePerSec: 140 + Math.random() * 8,
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming, thresholds]);

  // Acknowledge anomaly
  const handleAcknowledgeAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED", resolvedAt: new Date().toISOString() } : a))
    );
    showToast("Anomali berhasil diakui (Acknowledged) oleh dispatcher K3.");
  };

  // Auto Generate Work Order
  const handleGenerateWorkOrder = (anomaly: IoTAnomaly) => {
    const woId = `WO-IOT-${Math.floor(1000 + Math.random() * 9000)}`;
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomaly.id ? { ...a, status: "INVESTIGATING", workOrderId: woId } : a))
    );
    showToast(`Auto-Work Order #${woId} berhasil diterbitkan & dikirim ke Mekanik Pit Service!`);
  };

  // Select unit from anomaly click
  const handleSelectUnitFromAnomaly = (unitCode: string) => {
    const found = fleet.find((f) => f.equipmentCode === unitCode);
    if (found) {
      setSelectedUnit(found);
      setActiveTab("DIGITAL_TWIN");
    }
  };

  // Anomaly Injection Handler
  const handleInjectAnomaly = (
    unitId: string,
    category: SensorCategoryType,
    scenarioId: string,
    injectedValue: any
  ) => {
    setFleet((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;

        let updated = { ...unit, highestSeverity: "CRITICAL" as const, activeAnomaliesCount: unit.activeAnomaliesCount + 1 };

        if (category === "temperature" && injectedValue.coolant) {
          updated.temperature = {
            ...updated.temperature,
            engineCoolantC: injectedValue.coolant,
            exhaustManifoldC: injectedValue.exhaust || updated.temperature.exhaustManifoldC,
          };
        } else if (category === "fuel") {
          updated.fuel = {
            ...updated.fuel,
            flowSensorStatus: "RAPID_DROP_DRAIN",
            burnRateLiterPerHour: injectedValue.burnRate || 85.0,
            currentVolumeLiter: Math.max(10, updated.fuel.currentVolumeLiter - 400),
          };
        } else if (category === "pressure") {
          if (injectedValue.rearRightOuterPsi) {
            updated.pressure = {
              ...updated.pressure,
              tpmsTiresPsi: {
                ...updated.pressure.tpmsTiresPsi,
                rearRightOuter: injectedValue.rearRightOuterPsi,
              },
            };
          }
          if (injectedValue.hydraulicBar) {
            updated.pressure = {
              ...updated.pressure,
              hydraulicSystemBar: injectedValue.hydraulicBar,
            };
          }
        } else if (category === "vibration" && injectedValue.frontStrutRms) {
          updated.vibration = {
            ...updated.vibration,
            frontStrutRmsMmS: injectedValue.frontStrutRms,
            triaxialG: {
              ...updated.vibration.triaxialG,
              zAxisVertical: injectedValue.verticalG || 3.5,
            },
          };
        } else if (category === "weight" && injectedValue.payloadTon) {
          updated.weight = {
            ...updated.weight,
            payloadGrossTon: injectedValue.payloadTon,
            payloadStatus: "OVERLOAD",
            overloadPct: injectedValue.overloadPct || 5.0,
          };
        } else if (category === "environment" && injectedValue.dustPM10) {
          updated.environment = {
            ...updated.environment,
            dustPM10_ugm3: injectedValue.dustPM10,
            dustPM25_ugm3: injectedValue.dustPM25 || 60,
          };
        } else if (category === "gps" && injectedValue.speedKmh) {
          updated.gps = {
            ...updated.gps,
            speedKmh: injectedValue.speedKmh,
          };
        }

        // Run scanner immediately on injected unit
        const newAnoms = IoTAnomalyDetectionEngine.scanEquipmentTelemetry(updated, thresholds);
        if (newAnoms.length > 0) {
          setAnomalies((prevA) => [...newAnoms, ...prevA]);
        }

        return updated;
      })
    );

    showToast(`🚨 AI Engine mendeteksi anomali pada ${category.toUpperCase()}!`);
  };

  return (
    <div className="space-y-5 p-4 lg:p-6 bg-slate-950 min-h-screen text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/80 shadow-2xl text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Stats */}
      <IoTHeaderStats
        summary={summary}
        liveTickCount={liveTickCount}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenThresholds={() => setIsThresholdsOpen(true)}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {[
            { key: "MATRIX", label: "1. 8-Sensor Fleet Matrix", icon: LayoutGrid, count: fleet.length },
            { key: "AI_RADAR", label: "2. AI Anomaly Radar & Diagnostics", icon: Sparkles, count: anomalies.length, alert: true },
            { key: "DIGITAL_TWIN", label: "3. Digital Twin 360° Visualizer", icon: Truck },
            { key: "SENSORS_DEEP", label: "4. 8-Sensor Deep Dive", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      tab.alert
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Unit Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Active Target:</span>
          <strong className="text-emerald-400 font-bold">{selectedUnit.equipmentCode}</strong>
          <span>({selectedUnit.equipmentType})</span>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "MATRIX" && (
        <LiveTelemetryMatrix
          fleet={fleet}
          selectedUnit={selectedUnit}
          onSelectUnit={(unit) => {
            setSelectedUnit(unit);
            setActiveTab("DIGITAL_TWIN");
          }}
          onOpenDiagnosisModal={(unit) => {
            setSelectedUnit(unit);
            setActiveTab("AI_RADAR");
          }}
          onOpenSimulatorForUnit={(unit) => {
            setSelectedUnit(unit);
            setIsSimulatorOpen(true);
          }}
        />
      )}

      {activeTab === "AI_RADAR" && (
        <AiAnomalyRadar
          anomalies={anomalies}
          fleet={fleet}
          onAcknowledgeAnomaly={handleAcknowledgeAnomaly}
          onGenerateWorkOrder={handleGenerateWorkOrder}
          onSelectUnitFromAnomaly={handleSelectUnitFromAnomaly}
        />
      )}

      {activeTab === "DIGITAL_TWIN" && (
        <DigitalTwinExplorer
          unit={selectedUnit}
          fleet={fleet}
          onSelectUnit={setSelectedUnit}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />
      )}

      {activeTab === "SENSORS_DEEP" && (
        <SensorCategoryDeepDive
          fleet={fleet}
          onSelectUnit={(unit) => {
            setSelectedUnit(unit);
            setActiveTab("DIGITAL_TWIN");
          }}
        />
      )}

      {/* Modals */}
      <AnomalySimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        fleet={fleet}
        onInjectAnomaly={handleInjectAnomaly}
      />

      <ThresholdSettingsModal
        isOpen={isThresholdsOpen}
        onClose={() => setIsThresholdsOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={(updated) => {
          setThresholds(updated);
          showToast("Ambang batas sensor & aturan interlock berhasil diperbarui!");
        }}
      />
    </div>
  );
};
