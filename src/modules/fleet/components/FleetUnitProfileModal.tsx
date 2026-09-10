// MINE SMART AI - Fleet Unit Comprehensive Profile & Telemetry Modal

import React, { useState } from "react";
import {
  X,
  Truck,
  Fuel,
  Clock,
  MapPin,
  User,
  Wrench,
  Activity,
  Gauge,
  RotateCcw,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Layers,
  Flame,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import { FleetUnitProfile, FleetUnitStatus } from "../../../types/fleetManagementTypes";

interface FleetUnitProfileModalProps {
  unit: FleetUnitProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: FleetUnitStatus, reason?: string) => void;
}

export const FleetUnitProfileModal: React.FC<FleetUnitProfileModalProps> = ({
  unit,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "telemetry" | "operator" | "maintenance" | "cycletime" | "fuel_idle"
  >("overview");

  if (!isOpen || !unit) return null;

  const getStatusBadge = (status: FleetUnitStatus) => {
    switch (status) {
      case "RUNNING":
        return {
          label: "🟢 Running (Operasi Aktif)",
          bg: "bg-emerald-500/20",
          text: "text-emerald-300",
          border: "border-emerald-500/40",
        };
      case "IDLE":
        return {
          label: "🟡 Idle (Standby / Antrian)",
          bg: "bg-amber-500/20",
          text: "text-amber-300",
          border: "border-amber-500/40",
        };
      case "BREAKDOWN":
        return {
          label: "🔴 Breakdown (Rusak Lapangan)",
          bg: "bg-rose-500/20",
          text: "text-rose-300",
          border: "border-rose-500/40",
        };
      case "MAINTENANCE":
        return {
          label: "🔵 Maintenance (Workshop Servis)",
          bg: "bg-sky-500/20",
          text: "text-sky-300",
          border: "border-sky-500/40",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-800",
          text: "text-slate-300",
          border: "border-slate-700",
        };
    }
  };

  const statusInfo = getStatusBadge(unit.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{unit.unitId}</h2>
                <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300 border border-slate-700">
                  {unit.brand} {unit.model}
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-extrabold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kapasitas: <span className="text-slate-200 font-bold">{unit.capacity}</span> • Lokasi:{" "}
                <span className="text-slate-200 font-medium">{unit.location}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 bg-slate-950/20 overflow-x-auto">
          {[
            { key: "overview", label: "Profil Unit & Specs", icon: Layers },
            { key: "telemetry", label: "Live Telemetri & Gauge", icon: Activity },
            { key: "operator", label: "Operator Dossier", icon: User },
            { key: "maintenance", label: "Maintenance & PM", icon: Wrench },
            { key: "cycletime", label: "Cycle Time & Prod", icon: RotateCcw },
            { key: "fuel_idle", label: "Fuel & Idle Analyzer", icon: Fuel },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Status Control Bar */}
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
            <div className="text-xs">
              <span className="text-slate-400">Status Operasi Saat Ini: </span>
              <span className="font-bold text-white">{unit.status}</span>
              <span className="text-slate-500 ml-2">({unit.statusReason})</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onUpdateStatus(unit.id, "RUNNING", "Kembali beroperasi aktif")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  unit.status === "RUNNING"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-emerald-400 hover:bg-emerald-950/50 border border-emerald-500/30"
                }`}
              >
                🟢 Running
              </button>

              <button
                onClick={() => onUpdateStatus(unit.id, "IDLE", "Unit antrian/standby")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  unit.status === "IDLE"
                    ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-amber-400 hover:bg-amber-950/50 border border-amber-500/30"
                }`}
              >
                🟡 Idle
              </button>

              <button
                onClick={() => onUpdateStatus(unit.id, "BREAKDOWN", "Kerusakan tidak terencana di pit")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  unit.status === "BREAKDOWN"
                    ? "bg-rose-500 text-slate-950 font-black shadow-md shadow-rose-500/20"
                    : "bg-slate-800 text-rose-400 hover:bg-rose-950/50 border border-rose-500/30"
                }`}
              >
                🔴 Breakdown
              </button>

              <button
                onClick={() => onUpdateStatus(unit.id, "MAINTENANCE", "Masuk jadwal workshop maintenance")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  unit.status === "MAINTENANCE"
                    ? "bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20"
                    : "bg-slate-800 text-sky-400 hover:bg-sky-950/50 border border-sky-500/30"
                }`}
              >
                🔵 Maintenance
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & SPECS */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Unit Specifications Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-emerald-400" />
                    Spesifikasi Profil Unit
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Unit ID</span>
                      <span className="font-extrabold text-white text-sm">{unit.unitId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Brand & Model</span>
                      <span className="font-bold text-white">
                        {unit.brand} {unit.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kategori Fleet</span>
                      <span className="font-bold text-slate-200">{unit.category.replace("_", " ")}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kapasitas Muatan</span>
                      <span className="font-extrabold text-emerald-400">{unit.capacity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Engine Hour (SMU)</span>
                      <span className="font-bold text-sky-300">
                        {unit.engineHour.toLocaleString()} Hours
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kapasitas Tangki BBM</span>
                      <span className="font-bold text-amber-300">
                        {unit.fuelTankCapacityLiters.toLocaleString()} Liters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location & Spatial Telemetry Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-rose-400" />
                    Lokasi & Koordinat GIS
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Area Tambang / Pit</span>
                      <span className="font-bold text-white text-sm">{unit.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Latitude</span>
                        <span className="font-mono text-slate-200 font-bold text-[11px]">
                          {unit.latitude}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Longitude</span>
                        <span className="font-mono text-slate-200 font-bold text-[11px]">
                          {unit.longitude}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Elevasi RL</span>
                        <span className="font-mono text-emerald-400 font-bold text-[11px]">
                          +{unit.elevationRl}m
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Update GPS Terakhir:</span>
                      <span className="text-slate-300 font-mono">
                        {new Date(unit.lastGpsUpdate).toLocaleTimeString()} WITA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Performance Summary Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Physical Availability</span>
                  <div className="text-lg font-black text-emerald-400">
                    {unit.availability?.physicalAvailabilityPA}%
                  </div>
                  <span className="text-[10px] text-slate-400">Target ≥90.0%</span>
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Use of Availability</span>
                  <div className="text-lg font-black text-teal-400">
                    {unit.utilization?.utilizationOfAvailabilityUA}%
                  </div>
                  <span className="text-[10px] text-slate-400">Target ≥85.0%</span>
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Productivity</span>
                  <div className="text-lg font-black text-blue-400">
                    {unit.productivity?.tonPerHour > 0
                      ? `${unit.productivity.tonPerHour} T/hr`
                      : `${unit.productivity?.bcmPerHour || 0} BCM/hr`}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {unit.productivity?.tripsCountToday || 0} Trips Shift Ini
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Fuel Burn Rate</span>
                  <div className="text-lg font-black text-amber-400">
                    {unit.fuelBurnRateLitersPerHour} L/hr
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Shift: {unit.shiftTotalFuelConsumedLiters} L
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TELEMETRY & GAUGES */}
          {activeTab === "telemetry" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Engine RPM */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Engine RPM</span>
                  <div className="text-2xl font-black text-sky-400 font-mono">{unit.engineRpm}</div>
                  <span className="text-[10px] text-slate-400">
                    {unit.engineRpm > 1000 ? "Operating RPM" : "Idle RPM"}
                  </span>
                </div>

                {/* Engine Temperature */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Engine Temp</span>
                  <div
                    className={`text-2xl font-black font-mono ${
                      unit.engineTemperatureC > 95
                        ? "text-rose-400"
                        : unit.engineTemperatureC > 88
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {unit.engineTemperatureC}°C
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {unit.engineTemperatureC > 95 ? "⚠️ High Temp" : "Optimal (75-90°C)"}
                  </span>
                </div>

                {/* Oil Pressure */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Oil Pressure</span>
                  <div
                    className={`text-2xl font-black font-mono ${
                      unit.oilPressureKpa < 150 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {unit.oilPressureKpa} kPa
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {unit.oilPressureKpa < 150 ? "⚠️ Low Pressure" : "Normal Pressure"}
                  </span>
                </div>

                {/* Ground Speed */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Kecepatan GPS</span>
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {unit.speedKmh} km/h
                  </div>
                  <span className="text-[10px] text-slate-400">Speed Limit 40 km/h</span>
                </div>
              </div>

              {/* Fuel Level & Tank Gauge */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Fuel className="h-4 w-4 text-amber-400" />
                    Kondisi Tangki Bahan Bakar (B35 Biodiesel)
                  </span>
                  <span className="text-sm font-extrabold text-amber-400">
                    {unit.fuelLevelPercent}% ({unit.fuelCurrentLiters} / {unit.fuelTankCapacityLiters} L)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      unit.fuelLevelPercent < 20
                        ? "bg-rose-500"
                        : unit.fuelLevelPercent < 40
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${unit.fuelLevelPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Burn Rate Real-Time</span>
                    <span className="font-extrabold text-white text-sm">
                      {unit.fuelBurnRateLitersPerHour} L/hr
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Total BBM Terpakai Shift</span>
                    <span className="font-extrabold text-amber-300 text-sm">
                      {unit.shiftTotalFuelConsumedLiters} Liters
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Estimasi Biaya BBM</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      ${unit.fuelCostTodayUsd} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OPERATOR DOSSIER */}
          {activeTab === "operator" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-500/30">
                      {unit.operator.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        {unit.operator.name}
                        <span className="text-xs font-mono text-slate-400">({unit.operator.nik})</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Operator ID: <span className="text-slate-200 font-mono">{unit.operator.operatorId}</span> •
                        Badge: <span className="text-slate-200 font-mono">{unit.operator.badgeNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-400">Shift 1 (06:00 - 18:00)</div>
                    <div className="text-xs text-amber-400 font-bold">Rating: ★ {unit.operator.operatorRating} / 5.0</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>SIMPER / SIO Tambang</span>
                    </div>
                    <div className="font-mono font-bold text-white mt-1 text-xs">
                      {unit.operator.simperNumber}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      Berlaku s/d {unit.operator.simperExpiry}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Activity className="h-4 w-4 text-sky-400" />
                      <span>Fatigue Level Risk</span>
                    </div>
                    <div className="font-extrabold text-white mt-1 text-xs flex items-center justify-between">
                      <span className={unit.operator.fatigueScore > 50 ? "text-rose-400" : "text-emerald-400"}>
                        {unit.operator.fatigueStatus.replace(/_/g, " ")}
                      </span>
                      <span className="text-slate-400 font-mono">{unit.operator.fatigueScore} / 100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Fit-to-work test passed 05:45
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Phone className="h-4 w-4 text-purple-400" />
                      <span>Kontak Komunikasi Radio / HP</span>
                    </div>
                    <div className="font-bold text-white mt-1 text-xs">
                      {unit.operator.phone}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Radio Channel: CH-04 Dispatch Pit 1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MAINTENANCE & PM COUNTDOWN */}
          {activeTab === "maintenance" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PM Schedule & Countdown */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Wrench className="h-4 w-4 text-purple-400" />
                    Jadwal Periodic Maintenance (PM)
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-slate-400">Servis Terakhir:</span>
                      <span className="font-bold text-white">
                        {unit.maintenance.lastServiceType} ({unit.maintenance.lastServiceSMU} hrs) • {unit.maintenance.lastServiceDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-slate-400">Jadwal PM Berikutnya:</span>
                      <span className="font-extrabold text-sky-400">
                        SMU {unit.maintenance.nextServiceSMU} hrs
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Sisa Jam Hingga PM:</span>
                        <span
                          className={`font-black text-sm ${
                            unit.maintenance.remainingHoursToService <= 0
                              ? "text-rose-400"
                              : unit.maintenance.remainingHoursToService < 30
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {unit.maintenance.remainingHoursToService} Hours
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            unit.maintenance.remainingHoursToService <= 0
                              ? "bg-rose-500"
                              : unit.maintenance.remainingHoursToService < 30
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, (unit.maintenance.remainingHoursToService / 250) * 100))}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Mekanik Penanggung Jawab:{" "}
                      <span className="font-bold text-slate-200">{unit.maintenance.assignedMechanic}</span>
                    </div>
                  </div>
                </div>

                {/* Component Health Status */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    Kesehatan Komponen Utama (% Health Score)
                  </h4>

                  <div className="space-y-2 text-xs">
                    {Object.entries(unit.maintenance.componentHealth).map(([compKey, val]) => {
                      const numVal = Number(val);
                      return (
                        <div key={compKey} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-300 capitalize">{compKey.replace(/([A-Z])/g, " $1")}</span>
                            <span
                              className={`font-bold font-mono ${
                                numVal < 70 ? "text-rose-400" : numVal < 85 ? "text-amber-400" : "text-emerald-400"
                              }`}
                            >
                              {numVal}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                numVal < 70 ? "bg-rose-500" : numVal < 85 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${numVal}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {unit.maintenance.workOrderDescription && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>Active Work Order: {unit.maintenance.currentWorkOrderId}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-300">{unit.maintenance.workOrderDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CYCLE TIME & PRODUCTIVITY */}
          {activeTab === "cycletime" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <RotateCcw className="h-4 w-4 text-purple-400" />
                    Rincian Siklus Waktu Angkut (Cycle Time Breakdown)
                  </h4>
                  <div className="text-sm font-black text-purple-400">
                    Total: {unit.cycleTime.totalCycleTimeMin} Menit / Trip
                  </div>
                </div>

                {/* Multi-Segment Step Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">1. Queue Shovel</span>
                    <span className="font-extrabold text-amber-400 text-sm">{unit.cycleTime.queueAtLoaderMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">2. Spot Shovel</span>
                    <span className="font-bold text-slate-200 text-sm">{unit.cycleTime.spotAtLoaderMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">3. Loading</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{unit.cycleTime.loadingTimeMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">4. Haul Loaded</span>
                    <span className="font-extrabold text-blue-400 text-sm">{unit.cycleTime.haulLoadedMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">5. Queue Dump</span>
                    <span className="font-bold text-amber-400 text-sm">{unit.cycleTime.queueAtDumpMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">6. Dumping</span>
                    <span className="font-bold text-slate-200 text-sm">{unit.cycleTime.dumpingTimeMin}m</span>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">7. Return Empty</span>
                    <span className="font-extrabold text-sky-400 text-sm">{unit.cycleTime.returnEmptyMin}m</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Jarak Angkut Satu Arah</span>
                    <span className="font-black text-white text-sm">{unit.cycleTime.haulDistanceKm} KM</span>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Kecepatan Muatan (Loaded)</span>
                    <span className="font-bold text-blue-300 text-sm">{unit.cycleTime.avgSpeedLoadedKmh} km/h</span>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Kecepatan Kosong (Empty)</span>
                    <span className="font-bold text-sky-300 text-sm">{unit.cycleTime.avgSpeedEmptyKmh} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FUEL & IDLE ANALYZER */}
          {activeTab === "fuel_idle" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Idle Breakdown */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    Analisis Waktu Idle & Kerugian BBM
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400">Total Jam Idle Shift:</span>
                      <span className="font-black text-yellow-400 text-sm">
                        {unit.idleTime.totalIdleHoursToday} Hours ({unit.idleTime.idlePercentageOfShift}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400">BBM Terbuang Saat Idle:</span>
                      <span className="font-extrabold text-amber-300 text-sm">
                        {unit.idleTime.idleFuelBurnLiters} Liters
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400">Estimasi Kerugian Biaya ($):</span>
                      <span className="font-extrabold text-rose-400 text-sm">
                        ${unit.idleTime.idleCostImpactUsd} USD
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Penyebab Utama Idle:</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {unit.idleTime.primaryIdleReason}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specific Fuel Index */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-400" />
                    Indeks Efisiensi Konsumsi BBM
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Konsumsi Spesifik (L/Ton / L/BCM)</span>
                      <span className="font-black text-emerald-400 text-lg">
                        {unit.fuelSpecificConsumption} L / Unit Prod
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Benchmark Efisiensi Industri: ≤0.25 L/Ton
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Catatan Operasional & Rekomendasi</span>
                      <p className="text-slate-300 text-[11px] mt-1">
                        {unit.notes || "Penggunaan bahan bakar efisien dan terkontrol sesuai standar ramah lingkungan."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="text-xs text-slate-400">
            Terakhir disinkronkan:{" "}
            <span className="font-mono text-slate-200">
              {new Date(unit.updatedAt).toLocaleTimeString()} WITA
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
