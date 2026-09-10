// MINE SMART AI - Fleet Unit Profile Card (Full Specifications & Live Telemetries)

import React from "react";
import {
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
  ChevronRight,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { FleetUnitProfile, FleetUnitStatus } from "../../../types/fleetManagementTypes";

interface FleetUnitCardProps {
  unit: FleetUnitProfile;
  onOpenProfile: (unit: FleetUnitProfile) => void;
  onQuickStatusChange: (unit: FleetUnitProfile) => void;
  onAssignOperator?: (unit: FleetUnitProfile) => void;
}

export const FleetUnitCard: React.FC<FleetUnitCardProps> = ({
  unit,
  onOpenProfile,
  onQuickStatusChange,
  onAssignOperator,
}) => {
  const getStatusBadge = (status: FleetUnitStatus) => {
    switch (status) {
      case "RUNNING":
        return {
          label: "🟢 Running",
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          dot: "bg-emerald-500",
        };
      case "IDLE":
        return {
          label: "🟡 Idle",
          bg: "bg-amber-500/10",
          text: "text-amber-400",
          border: "border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "BREAKDOWN":
        return {
          label: "🔴 Breakdown",
          bg: "bg-rose-500/10",
          text: "text-rose-400",
          border: "border-rose-500/30",
          dot: "bg-rose-500",
        };
      case "MAINTENANCE":
        return {
          label: "🔵 Maintenance",
          bg: "bg-sky-500/10",
          text: "text-sky-400",
          border: "border-sky-500/30",
          dot: "bg-sky-400",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-800",
          text: "text-slate-300",
          border: "border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const statusInfo = getStatusBadge(unit.status);

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/50 flex flex-col justify-between">
      <div>
        {/* Top Card Header: Unit ID, Brand, Model & Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                {unit.unitId}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                {unit.brand} {unit.model}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Kapasitas: <span className="text-slate-200 font-bold">{unit.capacity}</span>
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickStatusChange(unit);
            }}
            title="Klik untuk ubah status cepat"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer hover:scale-105 ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`}></span>
            <span>{statusInfo.label}</span>
          </button>
        </div>

        {/* Status reason or operational notes */}
        <div className="mt-2.5 rounded-lg bg-slate-950/60 p-2 text-[11px] text-slate-300 border border-slate-800/80 flex items-center justify-between">
          <span className="truncate pr-2">{unit.statusReason || "Unit beroperasi normal"}</span>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
            {unit.speedKmh > 0 ? `${unit.speedKmh} km/h` : "0 km/h"}
          </span>
        </div>

        {/* Essential 4 Profile Grids: Location, Engine Hour, Fuel, Maintenance */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
          {/* Location */}
          <div className="rounded-xl bg-slate-800/40 p-2.5 border border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <span>Location</span>
            </div>
            <div className="font-bold text-white text-[11px] truncate mt-1" title={unit.location}>
              {unit.location}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Elevasi: RL +{unit.elevationRl}m
            </div>
          </div>

          {/* Engine Hour */}
          <div className="rounded-xl bg-slate-800/40 p-2.5 border border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              <span>Engine Hour</span>
            </div>
            <div className="font-extrabold text-sky-300 text-xs mt-1">
              {unit.engineHour.toLocaleString()} hrs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Shift SMU: +{unit.shiftDeltaEngineHour} hrs
            </div>
          </div>

          {/* Fuel */}
          <div className="rounded-xl bg-slate-800/40 p-2.5 border border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Fuel className="h-3.5 w-3.5 text-amber-400" />
              <span>Fuel System</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-extrabold text-amber-300 text-xs">{unit.fuelLevelPercent}%</span>
              <span className="text-[10px] text-slate-400">{unit.fuelBurnRateLitersPerHour} L/hr</span>
            </div>
            <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  unit.fuelLevelPercent < 20
                    ? "bg-rose-500"
                    : unit.fuelLevelPercent < 40
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${unit.fuelLevelPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="rounded-xl bg-slate-800/40 p-2.5 border border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Wrench className="h-3.5 w-3.5 text-purple-400" />
              <span>Maintenance</span>
            </div>
            <div className="font-bold text-slate-200 text-[11px] mt-1">
              Next PM: {unit.maintenance?.nextServiceSMU} hrs
            </div>
            <div className="text-[10px] mt-0.5">
              {unit.maintenance?.remainingHoursToService <= 0 ? (
                <span className="text-rose-400 font-bold">⚠️ Overdue Service</span>
              ) : unit.maintenance?.remainingHoursToService < 30 ? (
                <span className="text-amber-400 font-bold">
                  ⚠️ Due in {unit.maintenance.remainingHoursToService} hrs
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">
                  {unit.maintenance?.remainingHoursToService} hrs lagi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Operator Profile Line */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/40 px-3 py-2 border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              {unit.operator.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{unit.operator.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({unit.operator.operatorId})</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>SIMPER Valid</span>
                <span>•</span>
                <span
                  className={
                    unit.operator.fatigueStatus === "FIT_TO_WORK"
                      ? "text-emerald-400 font-medium"
                      : "text-amber-400 font-bold"
                  }
                >
                  {unit.operator.fatigueStatus === "FIT_TO_WORK" ? "Fit to Work" : "Fatigue Warning"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold text-emerald-400">Shift 1 (Day)</div>
            <div className="text-[10px] text-slate-400 font-mono">★ {unit.operator.operatorRating}</div>
          </div>
        </div>
      </div>

      {/* Card Footer: Quick Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div>
            PA: <span className="font-bold text-white">{unit.availability?.physicalAvailabilityPA}%</span>
          </div>
          <div>
            UA: <span className="font-bold text-white">{unit.utilization?.utilizationOfAvailabilityUA}%</span>
          </div>
        </div>

        <button
          onClick={() => onOpenProfile(unit)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <span>Detail Profil</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
