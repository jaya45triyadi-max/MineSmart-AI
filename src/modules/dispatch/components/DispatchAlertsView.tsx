// MINE SMART AI - Dispatch Alerts View

import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, MapPin } from "lucide-react";
import { DispatchAlertRecord } from "../../../types/dispatchTypes";

interface DispatchAlertsViewProps {
  alerts: DispatchAlertRecord[];
  onResolveAlert: (alertId: string) => void;
}

export const DispatchAlertsView: React.FC<DispatchAlertsViewProps> = ({ alerts, onResolveAlert }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              DISPATCH OPERATIONAL ALERTS CENTER
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Peringatan otomatis antrean panjang, kemacetan rute, truk idle, dan anomali waktu siklus
          </p>
        </div>

        <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl font-bold">
          {alerts.filter((a) => !a.isResolved).length} Alerts Perlu Penanganan
        </span>
      </div>

      {/* Alert List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-5 space-y-4">
        {alerts.map((alt) => (
          <div
            key={alt.alertId}
            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              alt.isResolved
                ? "bg-slate-950 border-slate-800 opacity-60"
                : alt.severity === "CRITICAL"
                ? "bg-rose-950/40 border-rose-500/40"
                : "bg-amber-950/40 border-amber-500/40"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-xs">[{alt.unitCode}]</span>
                <span className="text-xs font-black uppercase text-amber-300">{alt.alertType}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {alt.timestamp.slice(11, 16)} • {alt.location}
                </span>
              </div>
              <p className="text-xs text-slate-200">{alt.message}</p>
            </div>

            <div>
              {alt.isResolved ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Resolved
                </span>
              ) : (
                <button
                  onClick={() => onResolveAlert(alt.alertId)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
