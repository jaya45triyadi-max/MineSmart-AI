// MINE SMART AI - Fleet Real-Time Status Distribution Bar

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Wrench, Search, Filter } from "lucide-react";
import { FleetKPIOverview, FleetUnitStatus } from "../../../types/fleetManagementTypes";

interface FleetStatusBarProps {
  kpiOverview: FleetKPIOverview;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const FleetStatusBar: React.FC<FleetStatusBarProps> = ({
  kpiOverview,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}) => {
  const { statusDistribution } = kpiOverview;

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
      {/* Status Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
        <button
          onClick={() => onSelectStatus("ALL")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatus === "ALL"
              ? "bg-slate-700 text-white border border-slate-600 shadow-sm"
              : "bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>Semua Status</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-300">
            {kpiOverview.totalFleetCount}
          </span>
        </button>

        {/* 🟢 Running */}
        <button
          onClick={() => onSelectStatus("RUNNING")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatus === "RUNNING"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500 shadow-md shadow-emerald-950/40"
              : "bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-emerald-400 hover:bg-slate-800"
          }`}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></span>
          <span>🟢 Running</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
            {statusDistribution.runningCount} ({statusDistribution.runningPercentage}%)
          </span>
        </button>

        {/* 🟡 Idle */}
        <button
          onClick={() => onSelectStatus("IDLE")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatus === "IDLE"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500 shadow-md shadow-amber-950/40"
              : "bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-amber-400 hover:bg-slate-800"
          }`}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-300"></span>
          <span>🟡 Idle</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-950/60 text-[10px] font-bold text-amber-400 border border-amber-500/30">
            {statusDistribution.idleCount} ({statusDistribution.idlePercentage}%)
          </span>
        </button>

        {/* 🔴 Breakdown */}
        <button
          onClick={() => onSelectStatus("BREAKDOWN")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatus === "BREAKDOWN"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500 shadow-md shadow-rose-950/40"
              : "bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-rose-400 hover:bg-slate-800"
          }`}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-400"></span>
          <span>🔴 Breakdown</span>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-950/60 text-[10px] font-bold text-rose-400 border border-rose-500/30">
            {statusDistribution.breakdownCount} ({statusDistribution.breakdownPercentage}%)
          </span>
        </button>

        {/* 🔵 Maintenance */}
        <button
          onClick={() => onSelectStatus("MAINTENANCE")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedStatus === "MAINTENANCE"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500 shadow-md shadow-sky-950/40"
              : "bg-slate-800/60 text-slate-400 border border-slate-800 hover:text-sky-400 hover:bg-slate-800"
          }`}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-300"></span>
          <span>🔵 Maintenance</span>
          <span className="px-1.5 py-0.5 rounded-full bg-sky-950/60 text-[10px] font-bold text-sky-400 border border-sky-500/30">
            {statusDistribution.maintenanceCount} ({statusDistribution.maintenancePercentage}%)
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari Unit ID, Brand, Model, Lokasi, Operator..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};
