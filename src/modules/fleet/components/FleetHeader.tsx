// MINE SMART AI - Fleet Header Component

import React from "react";
import {
  Truck,
  Plus,
  RefreshCw,
  Sparkles,
  Download,
  Activity,
  Layers,
  Fuel,
  Clock,
  Radio,
} from "lucide-react";
import { FleetKPIOverview } from "../../../types/fleetManagementTypes";

interface FleetHeaderProps {
  kpiOverview: FleetKPIOverview;
  onRefresh: () => void;
  onNewUnit: () => void;
  onOpenAI: () => void;
  onExportReport: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const FleetHeader: React.FC<FleetHeaderProps> = ({
  kpiOverview,
  onRefresh,
  onNewUnit,
  onOpenAI,
  onExportReport,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { key: "ALL", label: "All Fleet", icon: Layers },
    { key: "DUMP_TRUCK", label: "Dump Trucks", icon: Truck },
    { key: "EXCAVATOR", label: "Excavators / Shovels", icon: Activity },
    { key: "DOZER", label: "Dozers", icon: Activity },
    { key: "MOTOR_GRADER", label: "Motor Graders", icon: Activity },
    { key: "WATER_TRUCK", label: "Water Trucks", icon: Fuel },
    { key: "WHEEL_LOADER", label: "Wheel Loaders", icon: Truck },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-400 border border-emerald-500/30 tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              FLEET TELEMETRY ACTIVE
            </span>
            <span className="text-xs text-slate-400">
              Mine Site Sangatta • Shift 1 (Day Shift 06:00 - 18:00)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Truck className="h-7 w-7 text-emerald-400" />
            Fleet Management & Real-Time Telemetry
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Monitoring profil unit lengkap (Unit ID, Brand, Model, Kapasitas, SMU Engine Hour, Fuel, Lokasi, Status Operasi, Operator, Maintenance) & 7 KPI Fleet (Availability, Utilization, Productivity, Fuel, Idle Time, Cycle Time, SMU).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-emerald-400" />
            <span>Refresh Sync</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-sky-400" />
            <span>Laporan Shift</span>
          </button>

          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
          >
            <Sparkles className="h-4 w-4 text-purple-200" />
            <span>AI Fleet Copilot</span>
          </button>

          <button
            onClick={onNewUnit}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Unit Profil</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
