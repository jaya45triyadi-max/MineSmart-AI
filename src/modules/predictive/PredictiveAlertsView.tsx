// MINE SMART AI - Predictive Alerts & Workflow View

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { PredictiveAlertItem } from "../../types/predictiveTypes";

interface PredictiveAlertsViewProps {
  alerts: PredictiveAlertItem[];
  onUpdateAlertStatus: (
    alertId: string,
    status: "Detected" | "Reviewed" | "Acknowledged" | "Assigned" | "Action Taken" | "Resolved" | "Closed"
  ) => Promise<void>;
  onOpenAIAssistant: () => void;
}

export const PredictiveAlertsView: React.FC<PredictiveAlertsViewProps> = ({
  alerts,
  onUpdateAlertStatus,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <span>Predictive Early Warning Alerts & Workflow</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Peringatan dini AI terotomatisasi untuk risiko breakdown, penurunan skor kesehatan mendadak, dan komponen mendekati end-of-life.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Peringatan AI</span>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                    a.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-500"
                      : a.severity === "HIGH"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-amber-500/20 text-amber-500"
                  }`}
                >
                  {a.severity}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">{a.unitCode} • {a.alertType}</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{a.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{a.message}</p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Status:</span>
                <select
                  value={a.status}
                  onChange={(e) => onUpdateAlertStatus(a.id, e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Detected">Detected</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <span className="text-[10px] text-slate-400">Assigned: {a.assignedTo || "Unassigned"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
