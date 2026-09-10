// MINE SMART AI - Fleet 7 Core KPIs Deep Dive Analytics View

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
  Info,
  Layers,
  Flame,
} from "lucide-react";
import { FleetKPIOverview, FleetUnitProfile } from "../../../types/fleetManagementTypes";

interface FleetKPIDeepDiveViewProps {
  kpiOverview: FleetKPIOverview;
  units: FleetUnitProfile[];
  onOpenUnit: (unit: FleetUnitProfile) => void;
}

export const FleetKPIDeepDiveView: React.FC<FleetKPIDeepDiveViewProps> = ({
  kpiOverview,
  units,
  onOpenUnit,
}) => {
  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            ANALYTICS ENGINE
          </span>
          <span className="text-xs text-slate-400">Mining Standard Compliance & Formulas</span>
        </div>
        <h2 className="text-lg font-black text-white mt-1">
          7 Fleet Key Performance Indicators Deep-Dive & Formula Breakdown
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Evaluasi komprehensif metrik performa armada: Physical Availability (PA), Mechanical Availability (MA), Utilization of Availability (UA), Effective Utilization (EU), Produktivitas (BCM/Ton per Jam), Konsumsi BBM (L/hr & L/BCM), Waktu Idle, Siklus Waktu Angkut (Cycle Time), dan Jam Operasi Mesin (SMU).
        </p>
      </div>

      {/* 7 KPI Deep Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* KPI 1 & 2: AVAILABILITY & UTILIZATION */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              <span>1. Availability (PA & MA) & 2. Utilization (UA & EU)</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">Target ≥90.0% / ≥85.0%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PA (Physical)</span>
              <span className="text-lg font-black text-emerald-400">
                {kpiOverview.availability.fleetPhysicalAvailabilityPA}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">(W + S) / T</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">MA (Mechanical)</span>
              <span className="text-lg font-black text-emerald-300">
                {kpiOverview.availability.fleetMechanicalAvailabilityMA}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">W / (W + R)</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">UA (Use of Avail)</span>
              <span className="text-lg font-black text-teal-400">
                {kpiOverview.utilization.fleetUtilizationOfAvailabilityUA}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">W / (W + S)</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">EU (Effective Util)</span>
              <span className="text-lg font-black text-teal-300">
                {kpiOverview.utilization.fleetEffectiveUtilizationEU}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">W / T</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-emerald-400" />
              <span>Keterangan Notasi Waktu Tambang:</span>
            </div>
            <p className="text-[11px] text-slate-400">
              • <strong>W (Working Hours)</strong>: Jam operasi berproduksi aktif.
              <br />• <strong>S (Standby/Idle Hours)</strong>: Jam alat siap operasi namun tidak bekerja (antrian, delay).
              <br />• <strong>R (Repair/Down Hours)</strong>: Jam unit mengalami perbaikan/servis di workshop atau pit.
              <br />• <strong>T (Total Scheduled Hours)</strong>: Total jam kerja terjadwal dalam satu shift (12 Jam).
            </p>
          </div>
        </div>

        {/* KPI 3: PRODUCTIVITY */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>3. Productivity (BCM/Hour & Ton/Hour)</span>
            </h3>
            <span className="text-xs font-bold text-blue-400">
              Pencapaian {kpiOverview.productivity.achievementPercentage}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Total Overburden Dig</span>
              <div className="text-xl font-black text-blue-400 mt-1">
                {kpiOverview.productivity.totalBcmToday.toLocaleString()} BCM
              </div>
              <span className="text-[10px] text-slate-400">
                Target: {kpiOverview.productivity.targetBcmShift.toLocaleString()} BCM
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Total Hauling Tons</span>
              <div className="text-xl font-black text-sky-400 mt-1">
                {kpiOverview.productivity.totalTonToday.toLocaleString()} Tons
              </div>
              <span className="text-[10px] text-slate-400">Coal & Overburden Material</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span>Rata-Rata Loading Excavator PC2000 / EX3600:</span>
              <span className="text-emerald-400">{kpiOverview.productivity.avgBcmPerHour} BCM/hr</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold mt-1">
              <span>Rata-Rata Hauling Dump Truck HD785 / 777E:</span>
              <span className="text-sky-400">{kpiOverview.productivity.avgTonPerHour} Ton/hr</span>
            </div>
          </div>
        </div>

        {/* KPI 4 & 5: FUEL CONSUMPTION & IDLE TIME */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Fuel className="h-5 w-5 text-amber-400" />
              <span>4. Fuel Consumption & 5. Idle Time Impact</span>
            </h3>
            <span className="text-xs font-bold text-amber-400">
              Burn Rate: {kpiOverview.fuelConsumption.avgFleetBurnRateLitersPerHour} L/hr
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Total BBM Shift</span>
              <span className="text-base font-extrabold text-amber-300">
                {kpiOverview.fuelConsumption.totalFuelConsumedLitersToday.toLocaleString()} L
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">
                ${kpiOverview.fuelConsumption.totalFuelCostUsd} USD
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Total Jam Idle</span>
              <span className="text-base font-extrabold text-yellow-400">
                {kpiOverview.idleTime.totalFleetIdleHoursToday} Hours
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Avg {kpiOverview.idleTime.avgIdleHoursPerUnit} hr/unit
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">BBM Hilang (Idle)</span>
              <span className="text-base font-extrabold text-rose-400">
                {kpiOverview.idleTime.totalIdleFuelWastedLiters} L
              </span>
              <span className="text-[9px] text-rose-400 block mt-0.5">
                -${kpiOverview.idleTime.totalIdleCostWastedUsd} USD
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Bottleneck Antrian Terbesar:</span>
              <span className="font-bold text-amber-300">
                {kpiOverview.idleTime.topBottleneckLocation}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-slate-400">Efisiensi Bahan Bakar (Specific):</span>
              <span className="font-bold text-emerald-400">
                {kpiOverview.fuelConsumption.fuelConsumptionPerBcm} Liter / BCM
              </span>
            </div>
          </div>
        </div>

        {/* KPI 6 & 7: CYCLE TIME & ENGINE HOUR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-purple-400" />
              <span>6. Cycle Time & 7. Engine Hour (SMU)</span>
            </h3>
            <span className="text-xs font-bold text-purple-400">
              Avg Cycle: {kpiOverview.cycleTime.avgTotalCycleTimeMin} Min
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Rata-Rata Waktu Antri (Queue)</span>
              <div className="text-xl font-black text-purple-400 mt-1">
                {kpiOverview.cycleTime.avgQueueLoaderMin} Menit
              </div>
              <span className="text-[10px] text-slate-400">Target Antri: &lt;1.5 Menit</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Jam Operasi Mesin Shift</span>
              <div className="text-xl font-black text-sky-400 mt-1">
                {kpiOverview.engineHour.totalFleetOperatingHoursToday} SMU
              </div>
              <span className="text-[10px] text-slate-400">
                Rata-rata {kpiOverview.engineHour.avgOperatingHoursPerUnit} jam/unit
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] block">Unit Menjelang Servis (&lt;30 jam):</span>
              <span className="font-bold text-amber-400">
                {kpiOverview.engineHour.unitsDueForMaintenanceWithin24h} Unit Membutuhkan PM
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Kecepatan Rata-Rata:</span>
              <span className="font-bold text-white">{kpiOverview.cycleTime.avgSpeedKmh} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit KPI Leaderboard Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Matriks Performa Lengkap Semua Unit Fleet
          </h3>
          <span className="text-xs text-slate-400">Total {units.length} Unit Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Unit ID</th>
                <th className="p-3 font-semibold">Brand & Model</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">PA (%)</th>
                <th className="p-3 font-semibold">UA (%)</th>
                <th className="p-3 font-semibold">Produktivitas</th>
                <th className="p-3 font-semibold">Fuel (L/hr)</th>
                <th className="p-3 font-semibold">Idle (hrs)</th>
                <th className="p-3 font-semibold">Cycle (min)</th>
                <th className="p-3 font-semibold">SMU Total</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-black text-white">{u.unitId}</td>
                  <td className="p-3">
                    <span className="text-slate-300 font-medium">
                      {u.brand} {u.model}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.status === "RUNNING"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : u.status === "IDLE"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : u.status === "BREAKDOWN"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-sky-500/20 text-sky-400 border-sky-500/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {u.availability?.physicalAvailabilityPA}%
                  </td>
                  <td className="p-3 font-bold text-teal-400">
                    {u.utilization?.utilizationOfAvailabilityUA}%
                  </td>
                  <td className="p-3 font-bold text-blue-400">
                    {u.productivity?.tonPerHour > 0
                      ? `${u.productivity.tonPerHour} T/hr`
                      : `${u.productivity?.bcmPerHour || 0} BCM/hr`}
                  </td>
                  <td className="p-3 font-bold text-amber-400">
                    {u.fuelBurnRateLitersPerHour} L/hr
                  </td>
                  <td className="p-3 font-bold text-yellow-400">
                    {u.idleTime?.totalIdleHoursToday}h
                  </td>
                  <td className="p-3 font-bold text-purple-400">
                    {u.cycleTime?.totalCycleTimeMin}m
                  </td>
                  <td className="p-3 font-mono font-bold text-sky-300">
                    {u.engineHour.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenUnit(u)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
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
