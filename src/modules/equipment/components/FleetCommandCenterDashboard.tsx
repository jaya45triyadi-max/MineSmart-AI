// MINE SMART AI - Fleet Command Center Dashboard

import React from "react";
import {
  Truck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Fuel,
  MapPin,
  Sparkles,
  Zap,
  TrendingUp,
  BarChart2,
  Wrench,
  Gauge,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { Equipment, EquipmentAlert, AIFleetInsight } from "../../../types/equipmentTypes";

interface FleetCommandCenterDashboardProps {
  equipmentList: Equipment[];
  alerts: EquipmentAlert[];
  onSelectUnit: (unit: Equipment) => void;
  onOpenAI: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const FleetCommandCenterDashboard: React.FC<FleetCommandCenterDashboardProps> = ({
  equipmentList,
  alerts,
  onSelectUnit,
  onOpenAI,
  onNavigateTab,
}) => {
  const totalUnits = equipmentList.length;
  const operatingUnits = equipmentList.filter((e) => e.status === "Operating").length;
  const standbyUnits = equipmentList.filter((e) => e.status === "Standby" || e.status === "Idle").length;
  const breakdownUnits = equipmentList.filter((e) => e.status === "Breakdown" || e.status === "Down").length;
  const maintenanceUnits = equipmentList.filter((e) => e.status === "Maintenance" || e.status === "Inspection").length;

  const avgPA = totalUnits > 0
    ? Number((equipmentList.reduce((acc, curr) => acc + curr.physicalAvailabilityPA, 0) / totalUnits).toFixed(1))
    : 90.0;

  const avgUA = totalUnits > 0
    ? Number((equipmentList.reduce((acc, curr) => acc + curr.useOfAvailabilityUA, 0) / totalUnits).toFixed(1))
    : 81.0;

  const totalEngineHours = equipmentList.reduce((acc, curr) => acc + curr.engineHour, 0);

  const topProductiveUnits = [...equipmentList]
    .sort((a, b) => b.useOfAvailabilityUA - a.useOfAvailabilityUA)
    .slice(0, 5);

  const lowProductiveUnits = [...equipmentList]
    .sort((a, b) => a.useOfAvailabilityUA - b.useOfAvailabilityUA)
    .slice(0, 4);

  const activeAlerts = alerts.filter((a) => !a.isResolved);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Card 1: Operating */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Operating</span>
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{operatingUnits}</div>
          <p className="text-[10px] text-slate-400 mt-1">Unit Aktif Beroperasi</p>
        </div>

        {/* Card 2: Standby & Idle */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Standby / Idle</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">{standbyUnits}</div>
          <p className="text-[10px] text-slate-400 mt-1">Siap Kerja / Menunggu</p>
        </div>

        {/* Card 3: Breakdown & Repair */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Breakdown</span>
            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">{breakdownUnits + maintenanceUnits}</div>
          <p className="text-[10px] text-slate-400 mt-1">Perbaikan / PM Work Order</p>
        </div>

        {/* Card 4: Physical Availability */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Fleet PA %</span>
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">{avgPA}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Physical Availability</p>
        </div>

        {/* Card 5: Utilization % */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Fleet UA %</span>
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">{avgUA}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Use of Availability</p>
        </div>

        {/* Card 6: Total Engine Hour */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Engine Hours</span>
            <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-teal-300 font-mono">{totalEngineHours.toLocaleString()} h</div>
          <p className="text-[10px] text-slate-400 mt-1">Akumulasi Jam SMU</p>
        </div>
      </div>

      {/* AI Fleet Intelligence Highlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold tracking-wide uppercase font-mono">
                AI FLEET INTELLIGENCE ANALYSIS REPORT
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>EVIDENCE & RECOMMENDATION:</strong> Terdeteksi 1 unit Excavator (EX-204) mengalami kebocoran hidrolik di Pit 2 West yang menyebabkan penurunan ketersediaan fisik (PA) site sebesar -2.4%. Disarankan memindahkan 2 unit Dump Truck HD785 ke Pit 1 South untuk memaksimalkan match factor EX-201.
            </p>
          </div>

          <button
            onClick={onOpenAI}
            className="px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Tanyakan AI Copilot</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Column (Map & Top Units) & Right Column (Alerts & Downtime) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: GIS Map & Fleet Productivity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mini GIS Map Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">GIS Fleet Real-Time Location Map</h3>
              </div>
              <button
                onClick={() => onNavigateTab("locations")}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Map Penuh</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated Canvas Map View */}
            <div className="relative w-full h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Map Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

              {/* Pits & Zones overlays */}
              <div className="absolute top-6 left-8 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-mono">
                PIT 1 SOUTH (BENCH RL +45)
              </div>
              <div className="absolute top-8 right-10 p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-[11px] text-sky-300 font-mono">
                DISPOSAL WASTE DUMP NORTH
              </div>
              <div className="absolute bottom-6 left-12 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 font-mono">
                ROM STOCKPILE #1 COAL
              </div>

              {/* Equipment Marker Pins */}
              {equipmentList.map((eq, idx) => {
                const colors =
                  eq.status === "Operating"
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/50"
                    : eq.status === "Breakdown"
                    ? "bg-rose-500 text-white border-rose-300 shadow-rose-500/50"
                    : "bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/50";

                const leftPos = `${15 + (idx * 13) % 70}%`;
                const topPos = `${20 + (idx * 17) % 60}%`;

                return (
                  <button
                    key={eq.id}
                    onClick={() => onSelectUnit(eq)}
                    style={{ left: leftPos, top: topPos }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold rounded-lg border shadow-lg cursor-pointer hover:scale-110 transition-transform ${colors} flex items-center gap-1 font-mono`}
                    title={`${eq.unitCode} - ${eq.status}`}
                  >
                    <Truck className="w-3 h-3" />
                    <span>{eq.unitCode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Productive Units vs Low Productivity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Productive */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Top Productive Units (High UA)</h4>
                </div>
              </div>

              <div className="space-y-2">
                {topProductiveUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => onSelectUnit(unit)}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{unit.unitCode}</span>
                        <span className="text-[10px] text-slate-400">{unit.brand} {unit.model}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{unit.location}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{unit.useOfAvailabilityUA}% UA</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{unit.engineHour.toLocaleString()} SMU</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Productivity / Attention Needed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Perlu Perhatian (Low UA / Down)</h4>
                </div>
              </div>

              <div className="space-y-2">
                {lowProductiveUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => onSelectUnit(unit)}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl border border-rose-500/20 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{unit.unitCode}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 rounded uppercase font-mono">
                          {unit.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{unit.location}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-400 font-mono">{unit.useOfAvailabilityUA}% UA</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{unit.physicalAvailabilityPA}% PA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Active Alerts & Fleet Downtime Ranking */}
        <div className="space-y-6">
          {/* Active Fleet Alerts Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Active Fleet Alerts ({activeAlerts.length})</h3>
              </div>
              <button
                onClick={() => onNavigateTab("alerts")}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 font-mono">{alert.unitCode}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-full">
                      {alert.severity}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-white">{alert.title}</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Downtime & Maintenance Status Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Wrench className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Downtime & Maintenance Summary</h3>
              </div>
              <button
                onClick={() => onNavigateTab("downtime")}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Detail
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Mean Time Between Failures (MTBF)</span>
                <span className="font-bold text-emerald-400">142.5 h</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Mean Time To Repair (MTTR)</span>
                <span className="font-bold text-sky-400">3.8 h</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Scheduled PM Compliance</span>
                <span className="font-bold text-amber-300">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
