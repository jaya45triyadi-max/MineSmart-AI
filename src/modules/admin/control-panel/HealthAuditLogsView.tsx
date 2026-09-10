// MINE SMART AI - System Health, Developer Audit Trail & Error Logs Console
// PROMPT 36: Real-Time Subsystem Health, Redacted Error Logs & Immutable Audit Trail

import React, { useState } from "react";
import {
  Activity,
  Server,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCcw,
  Zap,
  Terminal,
  Cpu,
} from "lucide-react";
import {
  PlatformAuditLog,
  PlatformErrorLog,
  SystemHealthMetric,
} from "../../../types/developerControlPanelTypes";

interface HealthAuditLogsViewProps {
  auditLogs: PlatformAuditLog[];
}

export const DEFAULT_HEALTH_METRICS: SystemHealthMetric[] = [
  {
    serviceName: "Google Cloud Firestore Database",
    category: "DATABASE",
    status: "OPERATIONAL",
    uptime24h: 99.99,
    latencyMs: 24,
    lastChecked: new Date().toISOString(),
    message: "Firestore multi-region replication active and fully synchronized.",
  },
  {
    serviceName: "Firebase Multi-Tenant Auth Service",
    category: "AUTH",
    status: "OPERATIONAL",
    uptime24h: 100.0,
    latencyMs: 18,
    lastChecked: new Date().toISOString(),
    message: "Multi-tenant auth tokens validating normally with 0 auth timeouts.",
  },
  {
    serviceName: "Google Gemini 3.7 AI Reasoning Engine",
    category: "AI_SERVICE",
    status: "OPERATIONAL",
    uptime24h: 99.8,
    latencyMs: 142,
    lastChecked: new Date().toISOString(),
    message: "Generative AI API response rate 100% within SLA targets.",
  },
  {
    serviceName: "Pit HiveMQ IoT MQTT Telemetry Stream",
    category: "IOT_BROKER",
    status: "OPERATIONAL",
    uptime24h: 100.0,
    latencyMs: 38,
    lastChecked: new Date().toISOString(),
    message: "MQTT telemetry pipelines healthy. 820 events/sec throughput.",
  },
  {
    serviceName: "Google Maps Geocoding & Satellite Imagery",
    category: "MAPS_API",
    status: "OPERATIONAL",
    uptime24h: 99.9,
    latencyMs: 85,
    lastChecked: new Date().toISOString(),
    message: "High-resolution satellite tiles loading normally.",
  },
];

export const DEFAULT_ERROR_LOGS: PlatformErrorLog[] = [
  {
    id: "ERR-091",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    severity: "WARNING",
    module: "MQTT_TELEMETRY_RECEIVER",
    companyName: "PT Bukit Asam Tbk",
    userEmail: "dispatch@ptba.co.id",
    message: "Flowmeter sensor device ID #DT-204 sent intermittent null payload for 2 seconds. Auto-recovered.",
    stackTraceRedacted: "at TelemetryParser.decode [REDACTED_API_KEYS] line 42",
    browserOs: "Chrome 124 / Windows 11",
    resolved: true,
  },
  {
    id: "ERR-090",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    severity: "INFO",
    module: "AUTH_GATEWAY",
    companyName: "PT Kaltim Prima Coal",
    userEmail: "it-sec@kpc.co.id",
    message: "Rate limiter throttled 2 consecutive rapid login attempts from IP 182.253.xx.xx. Session safe.",
    stackTraceRedacted: "at RateLimiter.throttle [INTERNAL_GATEWAY] line 18",
    browserOs: "Edge 123 / macOS 14.4",
    resolved: true,
  },
];

export const HealthAuditLogsView: React.FC<HealthAuditLogsViewProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<"HEALTH" | "AUDIT" | "ERRORS">("HEALTH");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudit = auditLogs.filter(
    (l) =>
      l.developerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Platform Health, Audit Trail & Telemetry Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pemantauan performa subsistem real-time, jejak audit pengembang yang tidak dapat diubah (immutable), dan log anomali terenkripsi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["HEALTH", "AUDIT", "ERRORS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-slate-800 text-emerald-400 shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "HEALTH"
                ? "Subsystem Health"
                : tab === "AUDIT"
                ? "Developer Audit Trail"
                : "Error Logs"}
            </button>
          ))}
        </div>
      </div>

      {/* HEALTH TAB */}
      {activeTab === "HEALTH" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Live Subsystem Telemetry & Latency Status
            </h3>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 5 Core Services Online</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_HEALTH_METRICS.map((metric) => (
              <div
                key={metric.serviceName}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white line-clamp-1">
                    {metric.serviceName}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {metric.latencyMs}ms
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {metric.uptime24h}% Uptime
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Checked: {new Date(metric.lastChecked).toLocaleTimeString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT TRAIL TAB */}
      {activeTab === "AUDIT" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Immutable Developer Action Trail ({filteredAudit.length})
            </h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter riwayat audit..."
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {filteredAudit.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      {log.action}
                    </span>
                    <strong className="text-white">{log.targetResource}</strong>
                  </div>
                  <span className="font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Developer: {log.developerName} ({log.developerEmail})</span>
                  <span className="font-mono">IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR LOGS TAB */}
      {activeTab === "ERRORS" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Redacted Anomaly & System Error Logs
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              0 Critical Blockers Active
            </span>
          </div>

          <div className="space-y-3">
            {DEFAULT_ERROR_LOGS.map((err) => (
              <div
                key={err.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      err.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400"
                        : err.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {err.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(err.timestamp).toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  {err.message}
                </p>
                {err.stackTraceRedacted && (
                  <pre className="text-[10px] font-mono bg-slate-900 p-2 rounded-lg text-slate-400 border border-slate-800 overflow-x-auto">
                    {err.stackTraceRedacted}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
