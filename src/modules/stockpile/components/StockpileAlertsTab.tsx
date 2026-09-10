import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Filter, Sparkles, RefreshCw, XCircle } from "lucide-react";
import { StockpileAlert } from "../../../types/stockpileTypes";

interface StockpileAlertsTabProps {
  alerts: StockpileAlert[];
  onUpdateAlertStatus: (alertId: string, newStatus: StockpileAlert["status"]) => void;
  onOpenAICopilot?: () => void;
}

export const StockpileAlertsTab: React.FC<StockpileAlertsTabProps> = ({
  alerts,
  onUpdateAlertStatus,
  onOpenAICopilot,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "ALL") return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Stockpile Alert Center & Anomaly Detection ({alerts.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pusat pemantauan risiko kapasitas, variansi tinggi, penumpukan umur batubara (aging stock), dan kualitas out of spec.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="ALL">Semua Tingkat Keparahan</option>
            <option value="CRITICAL">CRITICAL (Kritis)</option>
            <option value="HIGH">HIGH (Tinggi)</option>
            <option value="MEDIUM">MEDIUM (Sedang)</option>
            <option value="LOW">LOW (Rendah)</option>
          </select>

          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-xs font-bold text-white hover:opacity-90 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Resolution Helper</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-5 transition-all ${
              alert.severity === "CRITICAL"
                ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10"
                : alert.severity === "HIGH"
                ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-xl p-2.5 ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-slate-950"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {alert.type}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {alert.stockpileName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Waktu Terdeteksi: {new Date(alert.timestamp).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={alert.status}
                  onChange={(e) => onUpdateAlertStatus(alert.alertId, e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Detected">Detected</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">{alert.title}</h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
