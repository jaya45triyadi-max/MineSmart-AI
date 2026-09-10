// MINE SMART AI - Fleet 7 Core KPIs Interactive Grid

import React from "react";
import {
  Activity,
  Gauge,
  TrendingUp,
  Fuel,
  Clock,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { FleetKPIOverview } from "../../../types/fleetManagementTypes";

interface FleetKPIHeaderGridProps {
  kpiOverview: FleetKPIOverview;
  activeKPIFilter?: string;
  onSelectKPITab?: (kpiKey: string) => void;
}

export const FleetKPIHeaderGrid: React.FC<FleetKPIHeaderGridProps> = ({
  kpiOverview,
  activeKPIFilter,
  onSelectKPITab,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-emerald-400" />
          7 Fleet Core Key Performance Indicators (KPI)
        </h3>
        <span className="text-[11px] text-slate-400">
          Target Enterprise PA: ≥90.0% • Target UA: ≥85.0%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* KPI 1: Availability */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("availability")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "availability"
              ? "border-emerald-500 bg-slate-800 shadow-lg shadow-emerald-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">1. Availability</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-400">
              {kpiOverview.availability.fleetPhysicalAvailabilityPA}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold">PA</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>MA (Mech):</span>
            <span className="font-bold text-slate-200">
              {kpiOverview.availability.fleetMechanicalAvailabilityMA}%
            </span>
          </div>
        </div>

        {/* KPI 2: Utilization */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("utilization")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-teal-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "utilization"
              ? "border-teal-500 bg-slate-800 shadow-lg shadow-teal-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">2. Utilization</span>
            <Gauge className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-teal-400">
              {kpiOverview.utilization.fleetUtilizationOfAvailabilityUA}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold">UA</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>EU (Effective):</span>
            <span className="font-bold text-slate-200">
              {kpiOverview.utilization.fleetEffectiveUtilizationEU}%
            </span>
          </div>
        </div>

        {/* KPI 3: Productivity */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("productivity")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "productivity"
              ? "border-blue-500 bg-slate-800 shadow-lg shadow-blue-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">3. Productivity</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-blue-400">
              {kpiOverview.productivity.totalBcmToday.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">BCM</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>Total Haul:</span>
            <span className="font-bold text-slate-200">
              {kpiOverview.productivity.totalTonToday.toLocaleString()} Ton
            </span>
          </div>
        </div>

        {/* KPI 4: Fuel Consumption */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("fuel")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "fuel"
              ? "border-amber-500 bg-slate-800 shadow-lg shadow-amber-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">4. Fuel Burn</span>
            <Fuel className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-400">
              {kpiOverview.fuelConsumption.avgFleetBurnRateLitersPerHour}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">L/hr</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>Shift Total:</span>
            <span className="font-bold text-amber-300">
              {kpiOverview.fuelConsumption.totalFuelConsumedLitersToday.toLocaleString()} L
            </span>
          </div>
        </div>

        {/* KPI 5: Idle Time */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("idle")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-yellow-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "idle"
              ? "border-yellow-500 bg-slate-800 shadow-lg shadow-yellow-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">5. Idle Time</span>
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-yellow-400">
              {kpiOverview.idleTime.totalFleetIdleHoursToday}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Hours</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>Fuel Wasted:</span>
            <span className="font-bold text-yellow-300">
              {kpiOverview.idleTime.totalIdleFuelWastedLiters} L
            </span>
          </div>
        </div>

        {/* KPI 6: Cycle Time */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("cycle")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-purple-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "cycle"
              ? "border-purple-500 bg-slate-800 shadow-lg shadow-purple-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">6. Cycle Time</span>
            <RotateCcw className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-purple-400">
              {kpiOverview.cycleTime.avgTotalCycleTimeMin}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Min/Trip</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>Queue:</span>
            <span className="font-bold text-purple-300">
              {kpiOverview.cycleTime.avgQueueLoaderMin} min
            </span>
          </div>
        </div>

        {/* KPI 7: Engine Hour (SMU) */}
        <div
          onClick={() => onSelectKPITab && onSelectKPITab("engine-hour")}
          className={`rounded-2xl border p-3.5 transition-all cursor-pointer hover:border-sky-500/50 hover:bg-slate-800/80 ${
            activeKPIFilter === "engine-hour"
              ? "border-sky-500 bg-slate-800 shadow-lg shadow-sky-950/40"
              : "border-slate-800 bg-slate-900/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">7. Engine Hour</span>
            <Zap className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-sky-400">
              {kpiOverview.engineHour.totalFleetOperatingHoursToday}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">SMU Shift</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span>Due PM &lt;24h:</span>
            <span className={`font-bold ${kpiOverview.engineHour.unitsDueForMaintenanceWithin24h > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {kpiOverview.engineHour.unitsDueForMaintenanceWithin24h} Unit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
