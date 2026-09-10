// MINE SMART AI - Master Developer Overview Dashboard
// PROMPT 36: Platform Overview KPIs, Revenue, AI Usage, Health & Quick Actions

import React from "react";
import {
  Users,
  Building2,
  Key,
  DollarSign,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Server,
  Radio,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  PlatformConfig,
  MasterCustomerRecord,
  PlatformAuditLog,
} from "../../../types/developerControlPanelTypes";

interface DevDashboardViewProps {
  config: PlatformConfig;
  customers: MasterCustomerRecord[];
  auditLogs: PlatformAuditLog[];
  onNavigateTab: (tabKey: string) => void;
  onOpenCreateCustomerModal: () => void;
  onOpenGenerateLicenseModal: () => void;
}

export const DevDashboardView: React.FC<DevDashboardViewProps> = ({
  config,
  customers,
  auditLogs,
  onNavigateTab,
  onOpenCreateCustomerModal,
  onOpenGenerateLicenseModal,
}) => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.licenseStatus === "ACTIVE").length;
  const trialCustomers = customers.filter((c) => c.licenseStatus === "TRIAL").length;
  const totalRevenueIDR = customers.reduce((acc, curr) => acc + (curr.monthlyRevenueIDR || 0), 0);
  const totalUsersAcrossTenants = customers.reduce((acc, curr) => acc + curr.activeUsersCount, 0);
  const totalAiCallsMonth = customers.reduce((acc, curr) => acc + curr.aiUsageCallsMonth, 0);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Global Health Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#07132F] via-[#0A1A40] to-[#071530] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-500/40 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                PLATFORM STATUS: 100% OPERATIONAL
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 font-mono text-xs font-bold border border-slate-700">
                CONFIG v{config.version} (PRODUCTION)
              </span>
              {config.maintenance.isActive && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MAINTENANCE MODE ACTIVE
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Developer Master Control Console
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pusat kendali operasional global MineSmart AI. Konfigurasi dinamis (CMS, API, AI Model, Branding, Pricing) tersinkronisasi langsung ke seluruh entitas customer tanpa memerlukan deployment ulang source code.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateCustomerModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>+ Create Customer</span>
            </button>

            <button
              onClick={onOpenGenerateLicenseModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Generate License Key</span>
            </button>

            <button
              onClick={() => onNavigateTab("cms")}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Edit Website CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Global Metric Cards Grid (8 Primary Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div
          onClick={() => onNavigateTab("customers")}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalCustomers}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeCustomers} Active</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {trialCustomers} on Trial &bull; 0 Suspended
          </p>
        </div>

        {/* Monthly Recurring Revenue */}
        <div
          onClick={() => onNavigateTab("pricing")}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monthly Platform Revenue
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
              {formatIDR(totalRevenueIDR)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">+18.5%</span> vs last quarter
          </p>
        </div>

        {/* Active Global Users */}
        <div
          onClick={() => onNavigateTab("users")}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Global Platform Users
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalUsersAcrossTenants}
            </span>
            <span className="text-xs font-bold text-cyan-400">Across 3 Companies</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-Tenant Isolated Sessions</p>
        </div>

        {/* AI Invocations & Reasoning */}
        <div
          onClick={() => onNavigateTab("ai_api")}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              AI Invocations (Gemini 3.7)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalAiCallsMonth.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400">99.8% Success</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg Latency: 142ms &bull; Zero Rate Limits</p>
        </div>
      </div>

      {/* 3. Operational Infrastructure Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Platform Services Status Matrix */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Platform Services & AI Gateways
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("health")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Health Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {config.apiProviders.map((provider) => (
              <div
                key={provider.providerId}
                className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      provider.status === "CONNECTED"
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                        : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {provider.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Endpoint: {provider.endpoint}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-xs font-bold font-mono text-emerald-400 block">
                      {provider.latencyMs}ms
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {provider.successRate24h}% Uptime
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/30 text-emerald-400 bg-emerald-950/40">
                    {provider.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Features Summary Bar */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>
              Enabled Feature Flags:{" "}
              <strong className="text-white">
                {config.featureFlags.filter((f) => f.status === "ENABLED").length} / {config.featureFlags.length}
              </strong>
            </span>
            <button
              onClick={() => onNavigateTab("features")}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Manage Flags &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Live Developer Audit Activity */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Developer Audit Trail
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("health")}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              All Logs &rarr;
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/70 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    {log.action}
                  </span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-200 line-clamp-1">
                  {log.targetResource}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>By: {log.developerName}</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
