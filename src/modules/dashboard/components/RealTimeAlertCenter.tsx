// MINE SMART AI - Real-Time Alert Center Component

import React, { useState } from "react";
import { AlertTriangle, AlertCircle, Info, ShieldAlert, CheckCircle2, Check, ExternalLink } from "lucide-react";
import { DashboardAlertItem, AlertSeverity } from "../../../services/dashboard/AlertRuleEngine";

interface RealTimeAlertCenterProps {
  alerts: DashboardAlertItem[];
  onAcknowledgeAlert: (alertId: string) => void;
  onNavigateModule: (moduleKey: string) => void;
}

export const RealTimeAlertCenter: React.FC<RealTimeAlertCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
  onNavigateModule,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter === "ALL") return true;
    return alert.severity === severityFilter;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          badge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          icon: <AlertCircle className="h-4 w-4 text-rose-400" />,
        };
      case "HIGH":
        return {
          badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        };
      case "MEDIUM":
        return {
          badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
          icon: <Info className="h-4 w-4 text-cyan-400" />,
        };
      case "LOW":
      case "INFO":
      default:
        return {
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          icon: <CheckCircle2 className="h-4 w-4 text-slate-400" />,
        };
    }
  };

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800/80">
        {[
          { label: "Semua Alert", key: "ALL" },
          { label: "Critical", key: "CRITICAL" },
          { label: "High", key: "HIGH" },
          { label: "Medium", key: "MEDIUM" },
          { label: "Info", key: "INFO" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSeverityFilter(tab.key)}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
              severityFilter === tab.key
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Tidak ada alert aktif untuk kategori ini.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getSeverityBadge(alert.severity);

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alert.acknowledged
                    ? "bg-slate-950/40 border-slate-800/50 opacity-60"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${style.badge} flex-shrink-0 mt-0.5`}>
                    {style.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase ${style.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {alert.source}
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.timeFormatted}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1">{alert.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {alert.actionModuleKey && (
                    <button
                      onClick={() => onNavigateModule(alert.actionModuleKey!)}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{alert.actionText}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}

                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Tandai Sudah Dilihat / Acknowledge"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Ack</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
