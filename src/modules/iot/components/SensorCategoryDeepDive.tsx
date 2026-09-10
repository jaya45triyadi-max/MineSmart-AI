// MINE SMART AI - 8 Sensors Deep Dive Analytical Module

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Droplet,
  Flame,
  Gauge,
  Layers,
  MapPin,
  ShieldAlert,
  Sliders,
  Thermometer,
  Truck,
  Wind,
  Zap,
} from "lucide-react";
import { EquipmentIoTTelemetry, SensorCategoryType } from "../../../types/iotTypes";

interface SensorCategoryDeepDiveProps {
  fleet: EquipmentIoTTelemetry[];
  onSelectUnit: (unit: EquipmentIoTTelemetry) => void;
}

export const SensorCategoryDeepDive: React.FC<SensorCategoryDeepDiveProps> = ({
  fleet,
  onSelectUnit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SensorCategoryType>("fuel");

  return (
    <div className="space-y-4">
      {/* 8 Sensor Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { key: "fuel", label: "1. Fuel", desc: "Tank & Burn Rate", icon: Droplet, color: "text-cyan-400" },
          { key: "temperature", label: "2. Temperature", desc: "Coolant & Exhaust", icon: Thermometer, color: "text-rose-400" },
          { key: "pressure", label: "3. Pressure", desc: "Oil & TPMS PSI", icon: Gauge, color: "text-amber-400" },
          { key: "engine", label: "4. Engine", desc: "RPM & DTC Codes", icon: Cpu, color: "text-emerald-400" },
          { key: "gps", label: "5. GPS", desc: "Speed & Pit Zone", icon: MapPin, color: "text-indigo-400" },
          { key: "vibration", label: "6. Vibration", desc: "Strut & Shock g", icon: Layers, color: "text-purple-400" },
          { key: "weight", label: "7. Weight", desc: "Payload & Strut", icon: Sliders, color: "text-teal-400" },
          { key: "environment", label: "8. Environment", desc: "Dust PM10 & Gas", icon: Wind, color: "text-lime-400" },
        ].map((sensor) => {
          const Icon = sensor.icon;
          const isActive = selectedCategory === sensor.key;

          return (
            <button
              key={sensor.key}
              onClick={() => setSelectedCategory(sensor.key as SensorCategoryType)}
              className={`p-3 rounded-xl border text-left transition-all backdrop-blur-md ${
                isActive
                  ? "bg-slate-800/95 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${sensor.color}`} />
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
              </div>
              <div className="font-bold text-xs text-white tracking-wide">{sensor.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{sensor.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Analytical Table for Selected Sensor Category */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              {selectedCategory === "fuel" && "1. FUEL SENSOR ANALYTICS & SMART FLOWMETER LOGS"}
              {selectedCategory === "temperature" && "2. TEMPERATURE SENSORS (COOLANT, HYDRAULIC, EXHAUST, BRAKES)"}
              {selectedCategory === "pressure" && "3. PRESSURE TRANSMITTERS & TPMS WIRELESS TIRE SENSORS"}
              {selectedCategory === "engine" && "4. ENGINE J1939 CAN-BUS, RPM & ACTIVE DTC DIAGNOSTICS"}
              {selectedCategory === "gps" && "5. HIGH-PRECISION RTK GPS POSITIONING & PIT GEOFENCING"}
              {selectedCategory === "vibration" && "6. TRIAXIAL ACCELEROMETERS & STRUT VIBRATION RMS"}
              {selectedCategory === "weight" && "7. SUSPENSION LOAD CELL PAYLOAD & OVERLOAD ANALYTICS"}
              {selectedCategory === "environment" && "8. PIT ENVIRONMENTAL WEATHER, DUST PM10 & TOXIC GAS ARRAY"}
            </h3>
            <p className="text-xs text-slate-400">
              Comparative multi-unit telemetry stream and anomaly thresholds.
            </p>
          </div>
        </div>

        {/* Dynamic Table for the Category */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-3">Unit Code</th>
                <th className="py-3 px-3">Type</th>
                {selectedCategory === "fuel" && (
                  <>
                    <th className="py-3 px-3">Tank Level %</th>
                    <th className="py-3 px-3">Volume (L)</th>
                    <th className="py-3 px-3">Burn Rate</th>
                    <th className="py-3 px-3">Est. Rem.</th>
                    <th className="py-3 px-3">Status</th>
                  </>
                )}
                {selectedCategory === "temperature" && (
                  <>
                    <th className="py-3 px-3">Coolant °C</th>
                    <th className="py-3 px-3">Hydraulic °C</th>
                    <th className="py-3 px-3">Exhaust °C</th>
                    <th className="py-3 px-3">Brakes °C</th>
                    <th className="py-3 px-3">Ambient °C</th>
                  </>
                )}
                {selectedCategory === "pressure" && (
                  <>
                    <th className="py-3 px-3">Engine Oil (Bar)</th>
                    <th className="py-3 px-3">Hydraulic (Bar)</th>
                    <th className="py-3 px-3">Turbo Boost</th>
                    <th className="py-3 px-3">TPMS Min PSI</th>
                    <th className="py-3 px-3">TPMS Max PSI</th>
                  </>
                )}
                {selectedCategory === "engine" && (
                  <>
                    <th className="py-3 px-3">RPM</th>
                    <th className="py-3 px-3">Load %</th>
                    <th className="py-3 px-3">Throttle %</th>
                    <th className="py-3 px-3">Battery V</th>
                    <th className="py-3 px-3">Active DTC</th>
                  </>
                )}
                {selectedCategory === "gps" && (
                  <>
                    <th className="py-3 px-3">Speed (km/h)</th>
                    <th className="py-3 px-3">Geofence Zone</th>
                    <th className="py-3 px-3">Heading</th>
                    <th className="py-3 px-3">Altitude</th>
                    <th className="py-3 px-3">Sats / HDOP</th>
                  </>
                )}
                {selectedCategory === "vibration" && (
                  <>
                    <th className="py-3 px-3">Front Strut RMS</th>
                    <th className="py-3 px-3">Rear Strut RMS</th>
                    <th className="py-3 px-3">Vert Shock (g)</th>
                    <th className="py-3 px-3">Potholes 1h</th>
                    <th className="py-3 px-3">Roughness IRI</th>
                  </>
                )}
                {selectedCategory === "weight" && (
                  <>
                    <th className="py-3 px-3">Gross Payload (T)</th>
                    <th className="py-3 px-3">Net Coal (T)</th>
                    <th className="py-3 px-3">Rated Cap. (T)</th>
                    <th className="py-3 px-3">Overload %</th>
                    <th className="py-3 px-3">Payload Status</th>
                  </>
                )}
                {selectedCategory === "environment" && (
                  <>
                    <th className="py-3 px-3">PM10 (µg/m³)</th>
                    <th className="py-3 px-3">PM2.5 (µg/m³)</th>
                    <th className="py-3 px-3">Wind Speed</th>
                    <th className="py-3 px-3">NO2 / CO Gas</th>
                    <th className="py-3 px-3">AQI Status</th>
                  </>
                )}
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {fleet.map((unit) => (
                <tr
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className="cursor-pointer hover:bg-slate-800/50 transition-all"
                >
                  <td className="py-3 px-3 font-bold text-white font-sans">{unit.equipmentCode}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">{unit.equipmentType}</td>

                  {/* Fuel Columns */}
                  {selectedCategory === "fuel" && (
                    <>
                      <td className="py-3 px-3 text-cyan-300 font-bold">{unit.fuel.tankLevelPct.toFixed(1)}%</td>
                      <td className="py-3 px-3">{unit.fuel.currentVolumeLiter.toFixed(0)} L</td>
                      <td className="py-3 px-3">{unit.fuel.burnRateLiterPerHour} L/h</td>
                      <td className="py-3 px-3">{unit.fuel.estimatedRemainingHours} h</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            unit.fuel.flowSensorStatus === "RAPID_DROP_DRAIN"
                              ? "bg-rose-500/20 text-rose-300 animate-pulse border border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {unit.fuel.flowSensorStatus}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Temperature Columns */}
                  {selectedCategory === "temperature" && (
                    <>
                      <td className={`py-3 px-3 font-bold ${unit.temperature.engineCoolantC > 99 ? "text-rose-400 animate-pulse" : "text-slate-200"}`}>
                        {unit.temperature.engineCoolantC > 0 ? `${unit.temperature.engineCoolantC}°C` : "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {unit.temperature.hydraulicOilC > 0 ? `${unit.temperature.hydraulicOilC}°C` : "-"}
                      </td>
                      <td className="py-3 px-3 text-amber-300">
                        {unit.temperature.exhaustManifoldC > 0 ? `${unit.temperature.exhaustManifoldC}°C` : "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {unit.temperature.rearBrakeDiscC > 0 ? `${unit.temperature.rearBrakeDiscC}°C` : "-"}
                      </td>
                      <td className="py-3 px-3 text-emerald-400">{unit.environment.ambientTemperatureC}°C</td>
                    </>
                  )}

                  {/* Pressure Columns */}
                  {selectedCategory === "pressure" && (
                    <>
                      <td className={`py-3 px-3 font-bold ${unit.pressure.engineOilPressureBar < 2.5 && unit.pressure.engineOilPressureBar > 0 ? "text-rose-400" : "text-amber-300"}`}>
                        {unit.pressure.engineOilPressureBar > 0 ? `${unit.pressure.engineOilPressureBar} bar` : "-"}
                      </td>
                      <td className={`py-3 px-3 font-bold ${unit.pressure.hydraulicSystemBar > 310 ? "text-rose-400" : "text-slate-200"}`}>
                        {unit.pressure.hydraulicSystemBar > 0 ? `${unit.pressure.hydraulicSystemBar} bar` : "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {unit.pressure.turboBoostPressureBar > 0 ? `${unit.pressure.turboBoostPressureBar} bar` : "-"}
                      </td>
                      <td className={`py-3 px-3 ${unit.pressure.tpmsTiresPsi.rearRightOuter < 85 && unit.pressure.tpmsTiresPsi.rearRightOuter > 0 ? "text-rose-400 font-bold animate-pulse" : "text-slate-300"}`}>
                        {unit.pressure.tpmsTiresPsi.rearRightOuter > 0 ? `${unit.pressure.tpmsTiresPsi.rearRightOuter} PSI` : "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {unit.pressure.tpmsTiresPsi.frontLeft > 0 ? `${unit.pressure.tpmsTiresPsi.frontLeft} PSI` : "-"}
                      </td>
                    </>
                  )}

                  {/* Engine Columns */}
                  {selectedCategory === "engine" && (
                    <>
                      <td className="py-3 px-3 text-emerald-300 font-bold">{unit.engine.rpm} RPM</td>
                      <td className="py-3 px-3">{unit.engine.engineLoadPct}%</td>
                      <td className="py-3 px-3">{unit.engine.throttlePositionPct}%</td>
                      <td className="py-3 px-3 text-cyan-300">{unit.engine.batteryVoltageV} V</td>
                      <td className="py-3 px-3">
                        {unit.engine.dtcActiveFaultCodes.length > 0 ? (
                          <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {unit.engine.dtcActiveFaultCodes[0].code}
                          </span>
                        ) : (
                          <span className="text-emerald-400">None (OK)</span>
                        )}
                      </td>
                    </>
                  )}

                  {/* GPS Columns */}
                  {selectedCategory === "gps" && (
                    <>
                      <td className="py-3 px-3 text-indigo-300 font-bold">{unit.gps.speedKmh} km/h</td>
                      <td className="py-3 px-3 text-slate-200">{unit.gps.geofenceZone}</td>
                      <td className="py-3 px-3">{unit.gps.headingDeg}°</td>
                      <td className="py-3 px-3">{unit.gps.altitudeM} m</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{unit.gps.satelliteCount} Sats (HDOP {unit.gps.hdopAcuracy})</td>
                    </>
                  )}

                  {/* Vibration Columns */}
                  {selectedCategory === "vibration" && (
                    <>
                      <td className={`py-3 px-3 font-bold ${unit.vibration.frontStrutRmsMmS > 11 ? "text-amber-400" : "text-purple-300"}`}>
                        {unit.vibration.frontStrutRmsMmS} mm/s
                      </td>
                      <td className="py-3 px-3">{unit.vibration.rearStrutRmsMmS} mm/s</td>
                      <td className="py-3 px-3 text-slate-200">{unit.vibration.triaxialG.zAxisVertical} g</td>
                      <td className="py-3 px-3 text-rose-400 font-bold">{unit.vibration.shockPotholeCount1h}</td>
                      <td className="py-3 px-3">{unit.vibration.roadRoughnessIndexIRI} m/km</td>
                    </>
                  )}

                  {/* Weight Columns */}
                  {selectedCategory === "weight" && (
                    <>
                      <td className="py-3 px-3 text-teal-300 font-bold">
                        {unit.weight.payloadGrossTon > 0 ? `${unit.weight.payloadGrossTon} T` : "-"}
                      </td>
                      <td className="py-3 px-3">{unit.weight.payloadNetCoalTon > 0 ? `${unit.weight.payloadNetCoalTon} T` : "-"}</td>
                      <td className="py-3 px-3">{unit.weight.ratedCapacityTon > 0 ? `${unit.weight.ratedCapacityTon} T` : "-"}</td>
                      <td className="py-3 px-3 text-amber-300">+{unit.weight.overloadPct}%</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            unit.weight.payloadStatus === "OVERLOAD"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {unit.weight.payloadStatus}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Environment Columns */}
                  {selectedCategory === "environment" && (
                    <>
                      <td className={`py-3 px-3 font-bold ${unit.environment.dustPM10_ugm3 > 145 ? "text-rose-400 animate-pulse" : "text-slate-200"}`}>
                        {unit.environment.dustPM10_ugm3} µg/m³
                      </td>
                      <td className="py-3 px-3">{unit.environment.dustPM25_ugm3} µg/m³</td>
                      <td className="py-3 px-3 text-cyan-300">{unit.environment.windSpeedMs} m/s</td>
                      <td className="py-3 px-3">
                        NO2: {unit.environment.hazardousGasPpm.nitrogenDioxideNO2} ppm
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-800 text-lime-400 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-bold">
                          AQI {unit.environment.airQualityIndexAQI}
                        </span>
                      </td>
                    </>
                  )}

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-sans font-semibold transition-all"
                    >
                      Deep Dive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
