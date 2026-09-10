// MINE SMART AI - Fleet Performance & Equipment Status Widget

import React from "react";
import { Truck, CheckCircle2, AlertTriangle, Clock, Wrench, ArrowRight } from "lucide-react";
import { FleetKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface FleetWidgetProps {
  data: FleetKPIData;
  onNavigateModule: (moduleKey: string) => void;
}

export const FleetWidget: React.FC<FleetWidgetProps> = ({ data, onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Fleet Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Total Unit Alat</div>
          <div className="text-lg sm:text-xl font-black text-white mt-1">
            {data.totalEquipment} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
            {data.running} Running ({( (data.running / data.totalEquipment) * 100 ).toFixed(0)}%)
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Availability (PA)</div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">
            {data.physicalAvailabilityPA}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Target: {data.paTarget}% (Var +{data.paVariance}%)</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Utilization (UA)</div>
          <div className="text-lg sm:text-xl font-black text-amber-300 mt-1">
            {data.useOfAvailabilityUA}%
          </div>
          <div className="text-[10px] text-rose-400 font-semibold mt-0.5">Target: {data.uaTarget}% (Var {data.uaVariance}%)</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Downtime / Maint.</div>
          <div className="text-lg sm:text-xl font-black text-rose-400 mt-1">
            {data.maintenance + data.breakdown} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Maint: {data.maintenance} | Down: {data.breakdown}</div>
        </div>
      </div>

      {/* Equipment Status Distribution Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Status Distribusi Operasional Fleet</span>
          </span>
          <span className="text-[11px] text-slate-400">62 Running / 11 Standby / 13 Breakdown</span>
        </div>

        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full" style={{ width: "72%" }} title="Running (72%)" />
          <div className="bg-amber-400 h-full" style={{ width: "13%" }} title="Idle / Standby (13%)" />
          <div className="bg-cyan-500 h-full" style={{ width: "9%" }} title="Maintenance (9%)" />
          <div className="bg-rose-500 h-full" style={{ width: "6%" }} title="Breakdown (6%)" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Running (62)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Idle/Standby (11)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Maintenance (8)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Breakdown (5)</span>
        </div>
      </div>

      {/* Top & Lowest Performers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Top Performers */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Top Performing Equipment</span>
          </div>

          <div className="space-y-2">
            {data.topPerformers.map((item) => (
              <div key={item.code} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-white">{item.code} <span className="font-normal text-slate-400">({item.type})</span></div>
                  <div className="text-[10px] text-slate-400">Prod: {item.productionTon.toLocaleString("id-ID")} Ton | Solar: {item.fuelRateLhr} L/Jam</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    UA {item.utilizationPct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lowest Performers */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Lowest Performing Equipment</span>
          </div>

          <div className="space-y-2">
            {data.lowestPerformers.map((item) => (
              <div key={item.code} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-white">{item.code} <span className="font-normal text-slate-400">({item.type})</span></div>
                  <div className="text-[10px] text-rose-400">{item.issue}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[10px]">
                    Down {item.downtimeHours} Jam
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drill-Down Footer */}
      <div className="pt-1 flex justify-end">
        <button
          onClick={() => onNavigateModule("fleet")}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Buka Manajemen Fleet & FMS</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
