// MINE SMART AI - Fleet Fuel Consumption & Idle Burn Analyzer View

import React from "react";
import {
  Fuel,
  Clock,
  Flame,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { FleetUnitProfile, FleetKPIOverview } from "../../../types/fleetManagementTypes";

interface FleetFuelAnalyzerViewProps {
  units: FleetUnitProfile[];
  kpiOverview: FleetKPIOverview;
  onOpenUnit: (unit: FleetUnitProfile) => void;
}

export const FleetFuelAnalyzerView: React.FC<FleetFuelAnalyzerViewProps> = ({
  units,
  kpiOverview,
  onOpenUnit,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            FUEL TELEMETRY ENGINE
          </span>
          <span className="text-xs text-slate-400">B35 Biodiesel Monitoring & Burn Rate Efficiency</span>
        </div>
        <h2 className="text-lg font-black text-white mt-1">
          Analisis Konsumsi Bahan Bakar, Idle Burn Loss, & Efisiensi Energi
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Pemantauan real-time laju konsumsi BBM (L/hr), konsumsi spesifik (L/BCM & L/Ton), kerugian bahan bakar akibat antrian idle, deteksi anomali konsumsi tidak wajar, dan estimasi biaya operasional solar tambang.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total BBM Terpakai Shift</span>
            <Fuel className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {kpiOverview.fuelConsumption.totalFuelConsumedLitersToday.toLocaleString()} L
          </div>
          <p className="text-[11px] text-slate-400">
            Biaya BBM: ${kpiOverview.fuelConsumption.totalFuelCostUsd} USD
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rata-Rata Burn Rate Fleet</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {kpiOverview.fuelConsumption.avgFleetBurnRateLitersPerHour} L/hr
          </div>
          <p className="text-[11px] text-slate-400">Excavator: ~185 L/hr • Hauler: ~62 L/hr</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>BBM Terbuang Saat Idle</span>
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {kpiOverview.idleTime.totalIdleFuelWastedLiters} L
          </div>
          <p className="text-[11px] text-rose-400">
            Loss: -${kpiOverview.idleTime.totalIdleCostWastedUsd} USD (6.35 jam idle)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spesifik BBM per BCM</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {kpiOverview.fuelConsumption.fuelConsumptionPerBcm} L/BCM
          </div>
          <p className="text-[11px] text-slate-400">Benchmark Hijau &lt;0.25 L/BCM</p>
        </div>
      </div>

      {/* Fuel Level & Burn Rate Table for all units */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Fuel className="h-4 w-4 text-amber-400" />
            Status Tangki BBM & Burn Rate Tiap Unit Fleet
          </h3>
          <span className="text-xs text-slate-400">B35 Biodiesel Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Unit ID</th>
                <th className="p-3 font-semibold">Brand / Model</th>
                <th className="p-3 font-semibold">Level Tangki (%)</th>
                <th className="p-3 font-semibold">Volume BBM (L)</th>
                <th className="p-3 font-semibold">Burn Rate (L/hr)</th>
                <th className="p-3 font-semibold">Shift Total (L)</th>
                <th className="p-3 font-semibold">Idle Wasted (L)</th>
                <th className="p-3 font-semibold">Spesifik (L/Ton)</th>
                <th className="p-3 font-semibold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-black text-white">{u.unitId}</td>
                  <td className="p-3">
                    {u.brand} {u.model}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold font-mono ${
                          u.fuelLevelPercent < 25
                            ? "text-rose-400"
                            : u.fuelLevelPercent < 45
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {u.fuelLevelPercent}%
                      </span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            u.fuelLevelPercent < 25
                              ? "bg-rose-500"
                              : u.fuelLevelPercent < 45
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${u.fuelLevelPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-200">
                    {u.fuelCurrentLiters} / {u.fuelTankCapacityLiters} L
                  </td>
                  <td className="p-3 font-bold text-amber-400">
                    {u.fuelBurnRateLitersPerHour} L/hr
                  </td>
                  <td className="p-3 font-bold text-slate-100">
                    {u.shiftTotalFuelConsumedLiters} L
                  </td>
                  <td className="p-3 font-bold text-rose-400">
                    {u.idleTime?.idleFuelBurnLiters} L
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {u.fuelSpecificConsumption}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenUnit(u)}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-amber-600 hover:text-white transition-all cursor-pointer"
                    >
                      Profil
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
