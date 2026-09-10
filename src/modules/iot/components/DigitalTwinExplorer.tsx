// MINE SMART AI - Equipment Digital Twin & 8-Sensor Visualizer Component

import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Battery,
  CheckCircle2,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Thermometer,
  Truck,
  Wifi,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { EquipmentIoTTelemetry, SensorCategoryType } from "../../../types/iotTypes";

interface DigitalTwinExplorerProps {
  unit: EquipmentIoTTelemetry;
  fleet: EquipmentIoTTelemetry[];
  onSelectUnit: (unit: EquipmentIoTTelemetry) => void;
  onOpenSimulator: () => void;
}

export const DigitalTwinExplorer: React.FC<DigitalTwinExplorerProps> = ({
  unit,
  fleet,
  onSelectUnit,
  onOpenSimulator,
}) => {
  const [activeSensorHotspot, setActiveSensorHotspot] = useState<SensorCategoryType>("temperature");
  const [activeChartTab, setActiveChartTab] = useState<"ENGINE_TEMP" | "FUEL_BURN" | "VIB_SHOCK" | "WEIGHT_PAYLOAD">("ENGINE_TEMP");

  // Generate dynamic 12-point time-series history
  const timeSeriesData = [
    { time: "10:00", coolant: 88, exhaust: 540, oilPres: 4.1, rpm: 1720, speed: 22, vib: 4.2, fuel: 840, payload: 92.1 },
    { time: "10:02", coolant: 91, exhaust: 570, oilPres: 3.9, rpm: 1850, speed: 28, vib: 5.5, fuel: 835, payload: 92.1 },
    { time: "10:04", coolant: 94, exhaust: 610, oilPres: 3.6, rpm: 1910, speed: 26, vib: 6.8, fuel: 830, payload: 93.4 },
    { time: "10:06", coolant: 97, exhaust: 630, oilPres: 3.2, rpm: 1940, speed: 25, vib: 8.4, fuel: 825, payload: 94.0 },
    { time: "10:08", coolant: 101, exhaust: 655, oilPres: 2.9, rpm: 1950, speed: 24, vib: 11.2, fuel: 820, payload: 95.4 },
    { time: "10:10", coolant: unit.temperature.engineCoolantC, exhaust: unit.temperature.exhaustManifoldC, oilPres: unit.pressure.engineOilPressureBar, rpm: unit.engine.rpm, speed: unit.gps.speedKmh, vib: unit.vibration.frontStrutRmsMmS, fuel: unit.fuel.currentVolumeLiter, payload: unit.weight.payloadGrossTon },
  ];

  return (
    <div className="space-y-4">
      {/* Unit Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Digital Twin Machine:
          </span>
          <select
            value={unit.id}
            onChange={(e) => {
              const selected = fleet.find((f) => f.id === e.target.value);
              if (selected) onSelectUnit(selected);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            {fleet.map((f) => (
              <option key={f.id} value={f.id}>
                {f.equipmentCode} — {f.equipmentName} ({f.highestSeverity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>{unit.hardwareGateway.protocol} Gateway</span>
            <span className="text-emerald-400 font-bold font-mono">
              {unit.hardwareGateway.signalStrengthDbm} dBm
            </span>
          </div>

          <button
            onClick={onOpenSimulator}
            className="px-3 py-1 rounded-md bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/50 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Inject Simulation
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2D/3D Equipment Schematic with 8 Hotspots, Right Realtime Sensor Gauges & Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 Cols: Interactive Digital Twin Schematic */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{unit.equipmentCode}</span>
                  <span className="text-xs font-normal text-slate-400">({unit.equipmentName})</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Operator: {unit.assignedOperator} • Pit Zone: {unit.gps.geofenceZone}
                </p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                  unit.highestSeverity === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : unit.highestSeverity === "WARNING"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                Health: {unit.overallHealthScorePct}%
              </span>
            </div>

            {/* Visual Chassis Hotspot Map */}
            <div className="relative bg-slate-950/80 rounded-xl p-4 border border-slate-800 min-h-[300px] flex flex-col justify-between">
              {/* Top Sensor Hotspots (GPS, Environment, Engine) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveSensorHotspot("gps")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeSensorHotspot === "gps"
                      ? "bg-indigo-600/30 border-indigo-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>5. GPS RTK</span>
                    <MapPin className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="font-bold text-xs mt-1 font-mono">{unit.gps.speedKmh} km/h</div>
                  <div className="text-[9px] text-slate-400 truncate">{unit.gps.geofenceZone}</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("environment")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeSensorHotspot === "environment"
                      ? "bg-lime-600/30 border-lime-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>8. ENVIRONMENT</span>
                    <Wind className="w-3 h-3 text-lime-400" />
                  </div>
                  <div className="font-bold text-xs mt-1 font-mono">
                    {unit.environment.dustPM10_ugm3} µg/m³
                  </div>
                  <div className="text-[9px] text-slate-400">{unit.environment.ambientTemperatureC}°C Ambient</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("engine")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeSensorHotspot === "engine"
                      ? "bg-emerald-600/30 border-emerald-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>4. ENGINE CAN</span>
                    <Cpu className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="font-bold text-xs mt-1 font-mono">{unit.engine.rpm} RPM</div>
                  <div className="text-[9px] text-slate-400">{unit.engine.engineLoadPct}% Load</div>
                </button>
              </div>

              {/* Middle Machine Schematic Graphic Representation */}
              <div className="my-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-inner">
                  {unit.equipmentType === "HAUL_TRUCK" && <Truck className="w-9 h-9" />}
                  {unit.equipmentType === "EXCAVATOR" && <Layers className="w-9 h-9" />}
                  {unit.equipmentType === "BULLDOZER" && <Cpu className="w-9 h-9" />}
                  {unit.equipmentType === "FUEL_BOWSER" && <Droplet className="w-9 h-9" />}
                  {unit.equipmentType === "PIT_WEATHER_STATION" && <Wind className="w-9 h-9" />}
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  KOMATSU SAA12V140E-3 DIESEL TWIN-TURBO 12-CYLINDER
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Full J1939 CAN-bus & High-Precision IoT Telematics Active
                </div>
              </div>

              {/* Bottom Sensor Hotspots (Fuel, Temp, Pressure, Vibration, Weight) */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  onClick={() => setActiveSensorHotspot("fuel")}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    activeSensorHotspot === "fuel"
                      ? "bg-cyan-600/30 border-cyan-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[9px] text-cyan-400 font-mono">1. FUEL</div>
                  <div className="font-bold text-xs mt-0.5 font-mono">{unit.fuel.tankLevelPct.toFixed(0)}%</div>
                  <div className="text-[8px] text-slate-400">{unit.fuel.burnRateLiterPerHour} L/h</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("temperature")}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    activeSensorHotspot === "temperature"
                      ? "bg-rose-600/30 border-rose-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[9px] text-rose-400 font-mono">2. TEMP</div>
                  <div className="font-bold text-xs mt-0.5 font-mono">
                    {unit.temperature.engineCoolantC > 0 ? `${unit.temperature.engineCoolantC.toFixed(0)}°` : `${unit.environment.ambientTemperatureC}°`}
                  </div>
                  <div className="text-[8px] text-slate-400">Coolant</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("pressure")}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    activeSensorHotspot === "pressure"
                      ? "bg-amber-600/30 border-amber-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[9px] text-amber-400 font-mono">3. PRES</div>
                  <div className="font-bold text-xs mt-0.5 font-mono">
                    {unit.pressure.engineOilPressureBar > 0 ? `${unit.pressure.engineOilPressureBar.toFixed(1)}b` : `${unit.pressure.hydraulicSystemBar.toFixed(0)}b`}
                  </div>
                  <div className="text-[8px] text-slate-400">Oil/Hyd</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("vibration")}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    activeSensorHotspot === "vibration"
                      ? "bg-purple-600/30 border-purple-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[9px] text-purple-400 font-mono">6. VIB</div>
                  <div className="font-bold text-xs mt-0.5 font-mono">
                    {unit.vibration.frontStrutRmsMmS.toFixed(1)}
                  </div>
                  <div className="text-[8px] text-slate-400">mm/s</div>
                </button>

                <button
                  onClick={() => setActiveSensorHotspot("weight")}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    activeSensorHotspot === "weight"
                      ? "bg-teal-600/30 border-teal-500 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[9px] text-teal-400 font-mono">7. WT</div>
                  <div className="font-bold text-xs mt-0.5 font-mono">
                    {unit.weight.payloadGrossTon > 0 ? `${unit.weight.payloadGrossTon.toFixed(1)}T` : "-"}
                  </div>
                  <div className="text-[8px] text-slate-400">{unit.weight.payloadStatus}</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Multi-Channel Real-time Oscilloscope & Active Hotspot Details */}
        <div className="lg:col-span-6 space-y-4">
          {/* Chart Header & Oscilloscope Tabs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Multi-Channel Oscilloscope
              </span>

              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setActiveChartTab("ENGINE_TEMP")}
                  className={`px-2 py-1 rounded font-mono font-medium transition-all ${
                    activeChartTab === "ENGINE_TEMP" ? "bg-rose-600 text-white" : "text-slate-400"
                  }`}
                >
                  Temp/Oil
                </button>
                <button
                  onClick={() => setActiveChartTab("FUEL_BURN")}
                  className={`px-2 py-1 rounded font-mono font-medium transition-all ${
                    activeChartTab === "FUEL_BURN" ? "bg-cyan-600 text-white" : "text-slate-400"
                  }`}
                >
                  Fuel L/h
                </button>
                <button
                  onClick={() => setActiveChartTab("VIB_SHOCK")}
                  className={`px-2 py-1 rounded font-mono font-medium transition-all ${
                    activeChartTab === "VIB_SHOCK" ? "bg-purple-600 text-white" : "text-slate-400"
                  }`}
                >
                  Vib/Speed
                </button>
                <button
                  onClick={() => setActiveChartTab("WEIGHT_PAYLOAD")}
                  className={`px-2 py-1 rounded font-mono font-medium transition-all ${
                    activeChartTab === "WEIGHT_PAYLOAD" ? "bg-teal-600 text-white" : "text-slate-400"
                  }`}
                >
                  Weight
                </button>
              </div>
            </div>

            {/* Recharts Area */}
            <div className="h-56 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === "ENGINE_TEMP" ? (
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    />
                    <Line type="monotone" dataKey="coolant" stroke="#f43f5e" strokeWidth={2} name="Coolant °C" />
                    <Line type="monotone" dataKey="oilPres" stroke="#fbbf24" strokeWidth={2} name="Oil Pres Bar" />
                  </LineChart>
                ) : activeChartTab === "FUEL_BURN" ? (
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    />
                    <Area type="monotone" dataKey="fuel" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Fuel (L)" />
                  </AreaChart>
                ) : activeChartTab === "VIB_SHOCK" ? (
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    />
                    <Line type="monotone" dataKey="vib" stroke="#a855f7" strokeWidth={2} name="Vibration RMS" />
                    <Line type="monotone" dataKey="speed" stroke="#6366f1" strokeWidth={2} name="Speed (km/h)" />
                  </LineChart>
                ) : (
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    />
                    <Area type="monotone" dataKey="payload" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} name="Payload (Ton)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Hotspot Sensor Detail Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Hotspot Sensor Readings: {activeSensorHotspot.toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Calibrated</span>
            </div>

            {/* Fuel Details */}
            {activeSensorHotspot === "fuel" && (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Current Volume</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    {unit.fuel.currentVolumeLiter.toFixed(0)} L
                  </div>
                  <div className="text-[9px] text-slate-500">of {unit.fuel.tankCapacityLiter} L</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Burn Rate</div>
                  <div className="text-base font-bold text-cyan-300 mt-0.5">
                    {unit.fuel.burnRateLiterPerHour} L/h
                  </div>
                  <div className="text-[9px] text-slate-500">Est. {unit.fuel.estimatedRemainingHours}h Left</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Water PPM</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {unit.fuel.fuelQualityWaterContentPpm} ppm
                  </div>
                  <div className="text-[9px] text-slate-500">Purity Grade A</div>
                </div>
              </div>
            )}

            {/* Temperature Details */}
            {activeSensorHotspot === "temperature" && (
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[9px] text-slate-400">Coolant</div>
                  <div className={`text-sm font-bold mt-0.5 ${unit.temperature.engineCoolantC > 99 ? "text-rose-400" : "text-slate-200"}`}>
                    {unit.temperature.engineCoolantC}°C
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[9px] text-slate-400">Hydraulic</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">
                    {unit.temperature.hydraulicOilC}°C
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[9px] text-slate-400">Exhaust</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {unit.temperature.exhaustManifoldC}°C
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[9px] text-slate-400">Ambient</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {unit.temperature.ambientC}°C
                  </div>
                </div>
              </div>
            )}

            {/* Pressure Details */}
            {activeSensorHotspot === "pressure" && (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Engine Oil Pres</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {unit.pressure.engineOilPressureBar} bar
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Hydraulic System</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5">
                    {unit.pressure.hydraulicSystemBar} bar
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Rear TPMS</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {unit.pressure.tpmsTiresPsi.rearRightOuter} PSI
                  </div>
                </div>
              </div>
            )}

            {/* Vibration Details */}
            {activeSensorHotspot === "vibration" && (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Front Strut RMS</div>
                  <div className="text-sm font-bold text-purple-400 mt-0.5">
                    {unit.vibration.frontStrutRmsMmS} mm/s
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Vertical Shock</div>
                  <div className="text-sm font-bold text-purple-300 mt-0.5">
                    {unit.vibration.triaxialG.zAxisVertical} g
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400">Pothole Count 1h</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {unit.vibration.shockPotholeCount1h} events
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
