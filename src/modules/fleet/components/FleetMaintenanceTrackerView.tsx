// MINE SMART AI - Fleet Maintenance & Periodic Service (PM) Tracker View

import React from "react";
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  ShieldAlert,
  User,
} from "lucide-react";
import { FleetUnitProfile, FleetKPIOverview } from "../../../types/fleetManagementTypes";

interface FleetMaintenanceTrackerViewProps {
  units: FleetUnitProfile[];
  kpiOverview: FleetKPIOverview;
  onOpenUnit: (unit: FleetUnitProfile) => void;
}

export const FleetMaintenanceTrackerView: React.FC<FleetMaintenanceTrackerViewProps> = ({
  units,
  kpiOverview,
  onOpenUnit,
}) => {
  const inWorkshopUnits = units.filter(
    (u) => u.status === "MAINTENANCE" || u.maintenance?.serviceStatus === "IN_WORKSHOP"
  );
  const dueSoonUnits = units.filter(
    (u) =>
      u.maintenance?.remainingHoursToService <= 30 &&
      u.maintenance?.remainingHoursToService > 0 &&
      u.status !== "MAINTENANCE"
  );
  const overdueUnits = units.filter(
    (u) => u.maintenance?.remainingHoursToService <= 0 && u.status !== "MAINTENANCE"
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-black text-sky-400 border border-sky-500/30 uppercase tracking-wider">
            MAINTENANCE MANAGEMENT
          </span>
          <span className="text-xs text-slate-400">Periodic Maintenance (PM) & Component Health Tracking</span>
        </div>
        <h2 className="text-lg font-black text-white mt-1">
          Jadwal Servis Terencana (PM), Workshop Bays, & Hitung Mundur Jam SMU
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Pantau sisa jam operasi (SMU) hingga servis berkala PM-250 / PM-500 / PM-1000 / PM-2000, antrian bengkel workshop bay, work order backlog mekanik, dan skor kesehatan komponen (Engine, Transmisi, Hidrolik, Final Drive, Undercarriage/Ban).
        </p>
      </div>

      {/* Maintenance Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* In Workshop */}
        <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              <span>In Workshop Bays (Aktif Servis)</span>
            </span>
            <span className="text-xl font-black text-sky-400">{inWorkshopUnits.length} Unit</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Unit sedang dalam pengerjaan mekanik di Main Workshop Bay.
          </p>
        </div>

        {/* Due Soon (<30 hrs) */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Due Soon (&lt;30 Hours SMU)</span>
            </span>
            <span className="text-xl font-black text-amber-400">{dueSoonUnits.length} Unit</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Perlu persiapan slot workshop dan kit suku cadang servis PM.
          </p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Overdue Service (Kritis)</span>
            </span>
            <span className="text-xl font-black text-rose-400">{overdueUnits.length} Unit</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Unit telah melewati batas SMU servis berkala, risiko breakdown tinggi.
          </p>
        </div>
      </div>

      {/* Full Fleet Maintenance Schedule Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-sky-400" />
            Jadwal PM & Status Kesehatan Komponen Seluruh Armada
          </h3>
          <span className="text-xs text-slate-400">{units.length} Unit Armada</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Unit ID</th>
                <th className="p-3 font-semibold">Brand / Model</th>
                <th className="p-3 font-semibold">Status Operasi</th>
                <th className="p-3 font-semibold">SMU Saat Ini</th>
                <th className="p-3 font-semibold">Target Next PM</th>
                <th className="p-3 font-semibold">Sisa Jam (Countdown)</th>
                <th className="p-3 font-semibold">Status Servis</th>
                <th className="p-3 font-semibold">Mekanik PIC</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {units.map((u) => {
                const rem = u.maintenance?.remainingHoursToService;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-black text-white">{u.unitId}</td>
                    <td className="p-3">
                      {u.brand} {u.model}
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
                    <td className="p-3 font-mono font-bold text-sky-300">
                      {u.engineHour.toLocaleString()} hrs
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-200">
                      {u.maintenance?.nextServiceSMU} hrs
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-extrabold ${
                          rem <= 0
                            ? "text-rose-400"
                            : rem < 30
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {rem <= 0 ? `⚠️ Overdue (${Math.abs(rem)}h)` : `${rem} Hours`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.maintenance?.serviceStatus === "IN_WORKSHOP"
                            ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
                            : rem <= 0
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                            : rem < 30
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {u.maintenance?.serviceStatus === "IN_WORKSHOP"
                          ? "In Workshop"
                          : rem <= 0
                          ? "Overdue Service"
                          : rem < 30
                          ? "Due Soon"
                          : "Good Status"}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {u.maintenance?.assignedMechanic || "Workshop Team"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenUnit(u)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-sky-600 hover:text-white transition-all cursor-pointer"
                      >
                        Detail PM
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
