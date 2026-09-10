// MINE SMART AI - Interactive IoT Sensor Anomaly Injector & Test Sandbox

import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  Layers,
  MapPin,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  Thermometer,
  Truck,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { EquipmentIoTTelemetry, SensorCategoryType } from "../../../types/iotTypes";

interface AnomalySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fleet: EquipmentIoTTelemetry[];
  onInjectAnomaly: (
    unitId: string,
    category: SensorCategoryType,
    anomalyType: string,
    injectedValue: any
  ) => void;
}

export const AnomalySimulatorModal: React.FC<AnomalySimulatorModalProps> = ({
  isOpen,
  onClose,
  fleet,
  onInjectAnomaly,
}) => {
  if (!isOpen) return null;

  const [selectedUnitId, setSelectedUnitId] = useState(fleet[0]?.id || "");
  const [selectedScenario, setSelectedScenario] = useState<string>("COOLANT_OVERHEAT");
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionSuccess, setInjectionSuccess] = useState(false);

  const simulationScenarios = [
    {
      id: "COOLANT_OVERHEAT",
      category: "temperature" as SensorCategoryType,
      title: "2. Temperature: Engine Coolant Overheat (104.5°C)",
      description: "Simulasi kenaikan suhu pendingin mesin ekstrem saat mendaki tanjakan hauling 8% dengan muatan penuh.",
      icon: Thermometer,
      badge: "🔴 CRITICAL",
      injectedValue: { coolant: 104.8, exhaust: 685.0 },
    },
    {
      id: "FUEL_SIPHONING",
      category: "fuel" as SensorCategoryType,
      title: "1. Fuel: Sudden Siphoning / Drain (-400L @ Engine OFF)",
      description: "Simulasi pengurasan solar ilegal saat mesin mati di rest area tanpa verifikasi otorisasi Smart Nozzle.",
      icon: Droplet,
      badge: "🔴 CRITICAL",
      injectedValue: { flowStatus: "RAPID_DROP_DRAIN", burnRate: 85.0 },
    },
    {
      id: "TPMS_PUNCTURE",
      category: "pressure" as SensorCategoryType,
      title: "3. Pressure: TPMS Tire Rapid Puncture (74 PSI)",
      description: "Simulasi kebocoran ban belakang kanan luar tertusuk batu tajam pada kecepatan 32 km/h.",
      icon: Gauge,
      badge: "🔴 CRITICAL",
      injectedValue: { rearRightOuterPsi: 74.2 },
    },
    {
      id: "HYDRAULIC_OVERPRESSURE",
      category: "pressure" as SensorCategoryType,
      title: "3. Pressure: Hydraulic Relief Stuck (342 Bar)",
      description: "Simulasi tekanan sirkuit hidrolik melebihi batas aman 330 Bar saat penetrasi batuan keras.",
      icon: Gauge,
      badge: "🔴 CRITICAL",
      injectedValue: { hydraulicBar: 342.0 },
    },
    {
      id: "STRUT_POTHOLE_SHOCK",
      category: "vibration" as SensorCategoryType,
      title: "6. Vibration: Severe Pothole Shock (13.8 mm/s, 3.8g Z)",
      description: "Simulasi hentakan lubang jalan hauling parah yang memicu getaran strut suspensi berbahaya.",
      icon: Layers,
      badge: "🟠 WARNING",
      injectedValue: { frontStrutRms: 13.8, verticalG: 3.82 },
    },
    {
      id: "PAYLOAD_OVERLOAD",
      category: "weight" as SensorCategoryType,
      title: "7. Weight: Suspension Payload Overload (96.8 Ton)",
      description: "Simulasi muatan berlebih melewati kapasitas rating desain 91.0 Ton dari shovel bucket overfill.",
      icon: Sliders,
      badge: "🟠 WARNING",
      injectedValue: { payloadTon: 96.8, overloadPct: 6.4 },
    },
    {
      id: "DUST_PM10_SPIKE",
      category: "environment" as SensorCategoryType,
      title: "8. Environment: Dust PM10 Exceedance (172 µg/m³)",
      description: "Simulasi lonjakan konsentrasi debu tambang melewati batas baku mutu Kepmen ESDM No. 1827/2018.",
      icon: Wind,
      badge: "🔴 CRITICAL",
      injectedValue: { dustPM10: 172.5, dustPM25: 78.0 },
    },
    {
      id: "SPEEDING_HAUL",
      category: "gps" as SensorCategoryType,
      title: "5. GPS: Pit Speeding Violation (54.0 km/h in Pit Bench)",
      description: "Simulasi over-speed di area bench tambang melebihi batas kecepatan keselamatan 40 km/h.",
      icon: MapPin,
      badge: "🟠 WARNING",
      injectedValue: { speedKmh: 54.2 },
    },
  ];

  const handleExecuteInjection = () => {
    const scenario = simulationScenarios.find((s) => s.id === selectedScenario);
    if (!scenario) return;

    setIsInjecting(true);
    setInjectionSuccess(false);

    setTimeout(() => {
      onInjectAnomaly(selectedUnitId, scenario.category, scenario.id, scenario.injectedValue);
      setIsInjecting(false);
      setInjectionSuccess(true);
      setTimeout(() => {
        setInjectionSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                AI IoT Sensor Anomaly Injector Sandbox
              </h2>
              <p className="text-xs text-slate-400">
                Uji responsivitas real-time AI Multi-Variate Anomaly Detection Engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Select Target Unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Pilih Target Mesin / Fleet:
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {fleet.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.equipmentCode} — {u.equipmentName} ({u.gps.geofenceZone})
                </option>
              ))}
            </select>
          </div>

          {/* Select Anomaly Scenario */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              2. Pilih Skenario Anomali Sensor (8-Sensor Catalog):
            </label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {simulationScenarios.map((scen) => {
                const Icon = scen.icon;
                const isSelected = selectedScenario === scen.id;

                return (
                  <div
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-slate-800/95 border-cyan-500 ring-2 ring-cyan-500/40 shadow-md"
                        : "bg-slate-850/60 border-slate-750 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 mt-0.5 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{scen.title}</h4>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              scen.badge.includes("CRITICAL")
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {scen.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {scen.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {injectionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Anomali Berhasil Diinjeksikan! AI Scanner mendeteksi lonjakan data dan memicu alert.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            AI Engine: Multi-Variate Dynamic Scanner Active
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteInjection}
              disabled={isInjecting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isInjecting ? "animate-spin" : ""}`} />
              {isInjecting ? "Injecting Live Telemetry..." : "Inject Anomaly Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
