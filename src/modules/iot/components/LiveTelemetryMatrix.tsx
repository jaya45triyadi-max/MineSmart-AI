// MINE SMART AI - Live 8-Sensor Fleet Telemetry Matrix Component

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  Search,
  Sliders,
  Thermometer,
  Truck,
  Wind,
  Zap,
} from "lucide-react";
import { EquipmentIoTTelemetry, SensorCategoryType } from "../../../types/iotTypes";

interface LiveTelemetryMatrixProps {
  fleet: EquipmentIoTTelemetry[];
  selectedUnit: EquipmentIoTTelemetry | null;
  onSelectUnit: (unit: EquipmentIoTTelemetry) => void;
  onOpenDiagnosisModal: (unit: EquipmentIoTTelemetry) => void;
  onOpenSimulatorForUnit: (unit: EquipmentIoTTelemetry) => void;
}

export const LiveTelemetryMatrix: React.FC<LiveTelemetryMatrixProps> = ({
  fleet,
  selectedUnit,
  onSelectUnit,
  onOpenDiagnosisModal,
  onOpenSimulatorForUnit,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");

  const filteredFleet = fleet.filter((unit) => {
    const matchesSearch =
      unit.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.assignedOperator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "ALL" || unit.equipmentType === filterType;
    const matchesSeverity =
      filterSeverity === "ALL" || unit.highestSeverity === filterSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Unit Code, Operator, Pit Zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Equipment Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Equipment Types</option>
            <option value="HAUL_TRUCK">Haul Trucks (HD785)</option>
            <option value="EXCAVATOR">Excavators (PC2000)</option>
            <option value="BULLDOZER">Bulldozers (D375)</option>
            <option value="FUEL_BOWSER">Fuel Bowsers (Mobile)</option>
            <option value="PIT_WEATHER_STATION">Pit Weather Stations</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="WARNING">🟠 Warning Only</option>
            <option value="NORMAL">🟢 Normal Stable Only</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode("CARDS")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === "CARDS"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cards View
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === "TABLE"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dense Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Equipment Cards */}
      {viewMode === "CARDS" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFleet.map((unit) => {
            const isSelected = selectedUnit?.id === unit.id;
            const hasCritical = unit.highestSeverity === "CRITICAL";
            const hasWarning = unit.highestSeverity === "WARNING";

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit)}
                className={`cursor-pointer rounded-xl border transition-all duration-200 p-4 relative overflow-hidden backdrop-blur-md flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900/95 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl"
                    : hasCritical
                    ? "bg-rose-950/20 border-rose-800/80 hover:border-rose-600 shadow-md"
                    : hasWarning
                    ? "bg-amber-950/20 border-amber-800/70 hover:border-amber-600 shadow-md"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md"
                }`}
              >
                {/* Top Status Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border shadow-inner ${
                          hasCritical
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                            : hasWarning
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                            : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        }`}
                      >
                        {unit.equipmentType === "HAUL_TRUCK" && <Truck className="w-5 h-5" />}
                        {unit.equipmentType === "EXCAVATOR" && <Layers className="w-5 h-5" />}
                        {unit.equipmentType === "BULLDOZER" && <Cpu className="w-5 h-5" />}
                        {unit.equipmentType === "FUEL_BOWSER" && <Droplet className="w-5 h-5" />}
                        {unit.equipmentType === "PIT_WEATHER_STATION" && <Wind className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white tracking-wide text-base">
                            {unit.equipmentCode}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              hasCritical
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                : hasWarning
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            }`}
                          >
                            {unit.highestSeverity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {unit.equipmentName}
                        </p>
                      </div>
                    </div>

                    {/* Health Score Pill */}
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Health</div>
                      <div
                        className={`text-base font-extrabold font-mono ${
                          unit.overallHealthScorePct >= 90
                            ? "text-emerald-400"
                            : unit.overallHealthScorePct >= 75
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {unit.overallHealthScorePct.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Operator & Site Location info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md mb-3 border border-slate-750">
                    <span className="truncate max-w-[160px]">👤 {unit.assignedOperator}</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {unit.gps.geofenceZone}
                    </span>
                  </div>

                  {/* 8 Sensors Miniature Live Values Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] mb-3">
                    {/* 1. Fuel */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.fuel.flowSensorStatus === "RAPID_DROP_DRAIN"
                          ? "bg-rose-950/50 border-rose-700 text-rose-300 animate-pulse"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Droplet className="w-2.5 h-2.5 text-cyan-400" /> FUEL
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.fuel.tankLevelPct.toFixed(0)}%
                      </div>
                      <div className="text-[9px] text-slate-400">{unit.fuel.burnRateLiterPerHour} L/h</div>
                    </div>

                    {/* 2. Temperature */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.temperature.engineCoolantC > 99
                          ? "bg-rose-950/50 border-rose-700 text-rose-300 animate-pulse"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Thermometer className="w-2.5 h-2.5 text-rose-400" /> TEMP
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.temperature.engineCoolantC > 0 ? `${unit.temperature.engineCoolantC.toFixed(0)}°C` : `${unit.environment.ambientTemperatureC.toFixed(0)}°C`}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {unit.temperature.hydraulicOilC > 0 ? `Hyd ${unit.temperature.hydraulicOilC.toFixed(0)}°` : "Ambient"}
                      </div>
                    </div>

                    {/* 3. Pressure */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.pressure.tpmsTiresPsi.rearRightOuter < 85 && unit.pressure.tpmsTiresPsi.rearRightOuter > 0
                          ? "bg-rose-950/50 border-rose-700 text-rose-300 animate-pulse"
                          : unit.pressure.hydraulicSystemBar > 310
                          ? "bg-rose-950/50 border-rose-700 text-rose-300"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Gauge className="w-2.5 h-2.5 text-amber-400" /> PRES
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.pressure.engineOilPressureBar > 0
                          ? `${unit.pressure.engineOilPressureBar.toFixed(1)} bar`
                          : `${unit.pressure.hydraulicSystemBar.toFixed(0)} bar`}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {unit.pressure.tpmsTiresPsi.frontLeft > 0 ? `${unit.pressure.tpmsTiresPsi.rearRightOuter.toFixed(0)} PSI` : "Sys OK"}
                      </div>
                    </div>

                    {/* 4. Engine */}
                    <div className="p-1.5 rounded border bg-slate-800/80 border-slate-700 text-center font-mono text-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Cpu className="w-2.5 h-2.5 text-emerald-400" /> ENG
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.engine.rpm} <span className="text-[9px] font-normal">RPM</span>
                      </div>
                      <div className="text-[9px] text-slate-400">{unit.engine.engineLoadPct.toFixed(0)}% Load</div>
                    </div>

                    {/* 5. GPS */}
                    <div className="p-1.5 rounded border bg-slate-800/80 border-slate-700 text-center font-mono text-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-indigo-400" /> GPS
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.gps.speedKmh.toFixed(0)} <span className="text-[9px] font-normal">km/h</span>
                      </div>
                      <div className="text-[9px] text-emerald-400 font-semibold">
                        RTK Sub-M
                      </div>
                    </div>

                    {/* 6. Vibration */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.vibration.frontStrutRmsMmS > 11
                          ? "bg-amber-950/50 border-amber-700 text-amber-300"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Activity className="w-2.5 h-2.5 text-purple-400" /> VIB
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.vibration.frontStrutRmsMmS.toFixed(1)} <span className="text-[8px] font-normal">mm/s</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {unit.vibration.triaxialG.zAxisVertical.toFixed(1)}g Z
                      </div>
                    </div>

                    {/* 7. Weight */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.weight.payloadStatus === "OVERLOAD"
                          ? "bg-amber-950/50 border-amber-700 text-amber-300"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Sliders className="w-2.5 h-2.5 text-teal-400" /> WT
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.weight.payloadGrossTon > 0 ? `${unit.weight.payloadGrossTon.toFixed(1)}T` : "N/A"}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {unit.weight.payloadStatus}
                      </div>
                    </div>

                    {/* 8. Environment */}
                    <div
                      className={`p-1.5 rounded border text-center font-mono ${
                        unit.environment.dustPM10_ugm3 > 145
                          ? "bg-rose-950/50 border-rose-700 text-rose-300 animate-pulse"
                          : "bg-slate-800/80 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-sans flex items-center justify-center gap-0.5">
                        <Wind className="w-2.5 h-2.5 text-lime-400" /> ENV
                      </div>
                      <div className="font-bold text-xs mt-0.5">
                        {unit.environment.dustPM10_ugm3.toFixed(0)} <span className="text-[8px] font-normal">PM10</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {unit.environment.windSpeedMs.toFixed(1)} m/s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    GW: {unit.hardwareGateway.protocol} ({unit.hardwareGateway.signalStrengthDbm} dBm)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSimulatorForUnit(unit);
                      }}
                      title="Inject Anomaly Simulation"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all text-xs"
                    >
                      <Zap className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDiagnosisModal(unit);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 transition-all text-[11px] font-semibold flex items-center gap-1"
                    >
                      AI Diagnostics <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Matrix Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-3">Unit / Model</th>
                <th className="py-3 px-2">Health</th>
                <th className="py-3 px-2">1. Fuel</th>
                <th className="py-3 px-2">2. Temp</th>
                <th className="py-3 px-2">3. Pressure</th>
                <th className="py-3 px-2">4. Engine</th>
                <th className="py-3 px-2">5. GPS</th>
                <th className="py-3 px-2">6. Vib</th>
                <th className="py-3 px-2">7. Weight</th>
                <th className="py-3 px-2">8. Env</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredFleet.map((unit) => (
                <tr
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className={`cursor-pointer hover:bg-slate-800/50 transition-all ${
                    selectedUnit?.id === unit.id ? "bg-slate-800/80 font-semibold" : ""
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white font-sans">{unit.equipmentCode}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{unit.equipmentName}</div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        unit.overallHealthScorePct >= 90
                          ? "bg-emerald-500/20 text-emerald-300"
                          : unit.overallHealthScorePct >= 75
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {unit.overallHealthScorePct.toFixed(0)}%
                    </span>
                  </td>
                  {/* Fuel */}
                  <td className="py-2.5 px-2">
                    <div className={unit.fuel.flowSensorStatus === "RAPID_DROP_DRAIN" ? "text-rose-400 font-bold" : "text-cyan-300"}>
                      {unit.fuel.tankLevelPct.toFixed(0)}% ({unit.fuel.burnRateLiterPerHour}L/h)
                    </div>
                  </td>
                  {/* Temp */}
                  <td className="py-2.5 px-2">
                    <div className={unit.temperature.engineCoolantC > 99 ? "text-rose-400 font-bold" : "text-slate-200"}>
                      {unit.temperature.engineCoolantC > 0 ? `${unit.temperature.engineCoolantC.toFixed(0)}°C` : `${unit.environment.ambientTemperatureC.toFixed(0)}°C`}
                    </div>
                  </td>
                  {/* Pressure */}
                  <td className="py-2.5 px-2">
                    <div className="text-slate-200">
                      {unit.pressure.engineOilPressureBar > 0
                        ? `${unit.pressure.engineOilPressureBar.toFixed(1)} bar`
                        : `${unit.pressure.hydraulicSystemBar.toFixed(0)} bar`}
                    </div>
                  </td>
                  {/* Engine */}
                  <td className="py-2.5 px-2 text-slate-200">
                    {unit.engine.rpm} RPM ({unit.engine.engineLoadPct.toFixed(0)}%)
                  </td>
                  {/* GPS */}
                  <td className="py-2.5 px-2 text-slate-200">
                    {unit.gps.speedKmh.toFixed(0)} km/h • {unit.gps.geofenceZone}
                  </td>
                  {/* Vibration */}
                  <td className="py-2.5 px-2 text-slate-200">
                    {unit.vibration.frontStrutRmsMmS.toFixed(1)} mm/s
                  </td>
                  {/* Weight */}
                  <td className="py-2.5 px-2 text-slate-200">
                    {unit.weight.payloadGrossTon > 0 ? `${unit.weight.payloadGrossTon.toFixed(1)} Ton` : "-"}
                  </td>
                  {/* Env */}
                  <td className="py-2.5 px-2">
                    <span className={unit.environment.dustPM10_ugm3 > 145 ? "text-rose-400 font-bold" : "text-slate-200"}>
                      {unit.environment.dustPM10_ugm3.toFixed(0)} µg/m³
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDiagnosisModal(unit);
                      }}
                      className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 text-[10px] font-sans font-semibold"
                    >
                      AI Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
