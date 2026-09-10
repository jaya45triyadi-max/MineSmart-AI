import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, X } from "lucide-react";
import { WeighbridgeAlert } from "../../../types/weighbridgeTypes";

interface WeighbridgeAlertsTabProps {
  alerts: WeighbridgeAlert[];
  onResolveAlert: (id: string) => void;
}

export const WeighbridgeAlertsTab: React.FC<WeighbridgeAlertsTabProps> = ({ alerts, onResolveAlert }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Pusat Peringatan & Deteksi Anomali Penimbangan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring pelanggaran kapasitas muatan (Overload), kalibrasi kadaluarsa, indikasi tiket ganda, dan deviasi timbangan.
          </p>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alert.isResolved
                ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70"
                : alert.severity === "CRITICAL" || alert.severity === "HIGH"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                : "bg-amber-500/10 border-amber-500/30 text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  alert.isResolved
                    ? "bg-emerald-500/20 text-emerald-400"
                    : alert.severity === "HIGH" || alert.severity === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{alert.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{alert.description}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(alert.timestamp).toLocaleString()} {alert.vehicleNumber && `| Unit: ${alert.vehicleNumber}`}
                </div>
              </div>
            </div>

            {!alert.isResolved ? (
              <button
                onClick={() => onResolveAlert(alert.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Tandai Selesai / Resolved
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4" /> RESOLVED
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
