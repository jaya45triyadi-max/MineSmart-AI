// MINE SMART AI - HSE & Safety Performance Widget

import React from "react";
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { HSEKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface HSEWidgetProps {
  data: HSEKPIData;
  onNavigateModule: (moduleKey: string) => void;
}

export const HSEWidget: React.FC<HSEWidgetProps> = ({ data, onNavigateModule }) => {
  const getStatusBadge = (status: HSEKPIData["hseStatus"]) => {
    switch (status) {
      case "SAFE":
        return {
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          label: "STATUS: SAFE",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
        };
      case "WATCH":
        return {
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          label: "STATUS: WATCH",
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        };
      case "HIGH_RISK":
      case "CRITICAL":
      default:
        return {
          color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
          label: "STATUS: HIGH RISK",
          icon: <ShieldAlert className="h-4 w-4 text-rose-400" />,
        };
    }
  };

  const statusBadge = getStatusBadge(data.hseStatus);

  return (
    <div className="space-y-4">
      {/* Top Banner: LTI Counter & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              {data.daysWithoutLTI} <span className="text-xs font-normal text-slate-400">Hari</span>
            </div>
            <p className="text-xs font-semibold text-emerald-400">Zero Lost Time Injury (LTI) Record</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold text-xs ${statusBadge.color}`}>
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Critical Alert Banner if High Risk condition */}
      {data.hasCriticalAlert && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-rose-300 block mb-0.5">CRITICAL HSE ALERT</span>
            <p className="text-slate-300">{data.criticalAlertMessage}</p>
          </div>
          <button
            onClick={() => onNavigateModule("hse")}
            className="px-2.5 py-1 rounded bg-rose-500 text-slate-950 font-black text-[10px] hover:bg-rose-400 transition-colors flex-shrink-0"
          >
            Inspeksi K3LH
          </button>
        </div>
      )}

      {/* Incident & Near Miss Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Total Incident</div>
          <div className="text-lg font-black text-white mt-1">{data.totalIncidents}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bulan ini</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Near Miss Reported</div>
          <div className="text-lg font-black text-amber-300 mt-1">{data.nearMissCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Temuan Hazard</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">High Risk Findings</div>
          <div className="text-lg font-black text-rose-400 mt-1">{data.highRiskFindings}</div>
          <div className="text-[10px] text-rose-400/80 font-semibold mt-0.5">Perlu Tindakan</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Open Action Item</div>
          <div className="text-lg font-black text-cyan-400 mt-1">{data.openCorrectiveActions}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Status Follow-up</div>
        </div>
      </div>

      {/* Drill-Down Footer */}
      <div className="pt-1 flex justify-end">
        <button
          onClick={() => onNavigateModule("hse")}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Buka Dashboard HSE & K3LH</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
