import React from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { ShiftCoverageItem } from "../../../types/attendanceTypes";

interface Props {
  shiftCoverage: ShiftCoverageItem[];
  onNavigateTab?: (tab: string) => void;
}

export const ShiftCoverageTab: React.FC<Props> = ({ shiftCoverage, onNavigateTab }) => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-extrabold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
            INTEGRATION WITH PROMPT 27 — ROSTER & SHIFT
          </span>
          <h2 className="text-xl font-black text-white mt-1">Shift Coverage & Manpower Gap Monitor</h2>
          <p className="text-xs text-slate-400">
            Perbandingan kebutuhan manpower (Required), Roster terjadwal (Scheduled), dan Kehadiran aktual (Present) per shift.
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("manpower-planning")}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-900/50 transition-all"
          >
            <Users className="h-4 w-4" />
            <span>Manpower Planning & Roster</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Coverage Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shiftCoverage.map((item) => (
          <div
            key={item.shiftId}
            className={`rounded-3xl border p-6 space-y-4 relative overflow-hidden ${
              item.alertLevel === "HIGH" || item.alertLevel === "CRITICAL"
                ? "border-amber-500/40 bg-amber-950/20"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">{item.shiftName}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.timeRange}</p>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  item.coveragePercent >= 95
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {item.coveragePercent}%
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Required Target</span>
                <p className="text-lg font-black text-white">{item.requiredCount} Org</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Scheduled Roster</span>
                <p className="text-lg font-black text-blue-400">{item.scheduledCount} Org</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Present Clock-In</span>
                <p className="text-lg font-black text-emerald-300">{item.presentCount} Org</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Manpower Gap</span>
                <p className="text-lg font-black text-amber-300">{item.gap} Org</p>
              </div>
            </div>

            {/* Coverage Progress Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Shift Readiness</span>
                <span className="text-emerald-400">{item.coveragePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.coveragePercent >= 95 ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                  style={{ width: `${Math.min(100, item.coveragePercent)}%` }}
                />
              </div>
            </div>

            {item.gap > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-300 flex items-center gap-2 font-medium">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  Alert: Terdapat deviasi {item.gap} operator pada shift ini. Direkomendasikan pemanggilan operator cadangan (Standby Pool).
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
