import React from "react";
import {
  Flame,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Layers,
  Sparkles,
  RefreshCw,
  Scale,
  Zap,
  CheckCircle2,
  XCircle,
  BarChart3,
  ChevronRight,
  MapPin,
  Filter,
  DollarSign,
  Droplets,
} from "lucide-react";
import { Stockpile, StockMovement, StockpileAlert, BlendingPlan } from "../../../types/stockpileTypes";

interface StockpileOverviewTabProps {
  stockpiles: Stockpile[];
  movements: StockMovement[];
  alerts: StockpileAlert[];
  blendingPlans: BlendingPlan[];
  onNavigateTab: (tabKey: string) => void;
  onOpenAICopilot?: () => void;
}

export const StockpileOverviewTab: React.FC<StockpileOverviewTabProps> = ({
  stockpiles,
  movements,
  alerts,
  blendingPlans,
  onNavigateTab,
  onOpenAICopilot,
}) => {
  const totalCapacity = stockpiles.reduce((acc, s) => acc + s.capacity, 0);
  const currentTotalStock = stockpiles.reduce((acc, s) => acc + s.currentQuantity, 0);
  const overallUtilization = totalCapacity > 0 ? ((currentTotalStock / totalCapacity) * 100).toFixed(1) : "0";

  const totalRomStock = stockpiles
    .filter((s) => s.stockpileType === "ROM")
    .reduce((acc, s) => acc + s.currentQuantity, 0);

  const totalProductStock = stockpiles
    .filter((s) => s.stockpileType === "PRODUCT" || s.stockpileType === "BLENDING")
    .reduce((acc, s) => acc + s.currentQuantity, 0);

  const activeAlertsCount = alerts.filter((a) => a.status !== "Resolved").length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === "CRITICAL" && a.status !== "Resolved").length;

  const activeBlendPlans = blendingPlans.filter((b) => b.status === "APPROVED" || b.status === "SUBMITTED").length;

  // Calculate weighted average CV GAR
  const weightedCV = Math.round(
    stockpiles.reduce((acc, s) => acc + s.quality.cvGAR * s.currentQuantity, 0) / (currentTotalStock || 1)
  );

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/80 p-6 text-white shadow-xl dark:border-slate-800">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              <Flame className="h-3.5 w-3.5" />
              <span>Coal Stockpile Command & Control Center</span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-white tracking-tight sm:text-3xl">
              Real-time Inventory & Mass Balance
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Sistem manajemen terpadu kuantitas, kualitas assay GAR, coal blending simulation, rehandling cost optimization, dan rekonsiliasi survei drone DTM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("inventory")}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              <Layers className="h-4 w-4" />
              <span>Kelola Stockpile ({stockpiles.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab("blending")}
              className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-white border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Scale className="h-4 w-4 text-emerald-400" />
              <span>Coal Blending Simulator</span>
            </button>
            {onOpenAICopilot && (
              <button
                onClick={onOpenAICopilot}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Stockpile Assistant</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Stock Volume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Stock Ton</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentTotalStock.toLocaleString()}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-500">Ton</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Kapasitas: {totalCapacity.toLocaleString()} Ton</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{overallUtilization}% Fill</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                Number(overallUtilization) > 90 ? "bg-red-500" : Number(overallUtilization) > 75 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, Number(overallUtilization))}%` }}
            />
          </div>
        </div>

        {/* ROM Stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ROM Pad Stock</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalRomStock.toLocaleString()}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-500">Ton</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Ready for Crusher Feed</span>
          </div>
        </div>

        {/* Product & Blended Stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Product & Port Stock</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalProductStock.toLocaleString()}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-500">Ton</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rata-rata Quality:</span>
            <span className="font-bold text-slate-900 dark:text-white">{weightedCV} kcal/kg</span>
          </div>
        </div>

        {/* Blending Plans Active */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Blending Plans</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {activeBlendPlans}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-500">Rencana Batch</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Target Vessel Export 5,000 GAR
          </div>
        </div>

        {/* Active Stock Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Peringatan Stockpile</span>
            <div className={`rounded-xl p-2 ${criticalAlertsCount > 0 ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-black ${criticalAlertsCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
              {activeAlertsCount}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-500">Alerts Active</span>
          </div>
          <div className="mt-2 text-[11px] text-red-600 dark:text-red-400 font-medium">
            {criticalAlertsCount} Kritis Perlu Tindakan
          </div>
        </div>
      </div>

      {/* Main Stockpile Status Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            Status Kapasitas & Kualitas per Stockpile
          </h3>
          <button
            onClick={() => onNavigateTab("inventory")}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Lihat semua tabel <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockpiles.map((sp) => {
            const fillPct = ((sp.currentQuantity / sp.capacity) * 100).toFixed(1);
            return (
              <div
                key={sp.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-amber-500/50 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {sp.stockpileCode}
                      </span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {sp.stockpileType}
                      </span>
                    </div>
                    <h4 className="mt-1.5 font-bold text-slate-900 dark:text-white text-sm">
                      {sp.stockpileName}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      sp.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : sp.status === "NEAR_FULL"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {sp.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Tonnage Saat Ini:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {sp.currentQuantity.toLocaleString()} / {sp.capacity.toLocaleString()} Ton
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(fillPct) > 90 ? "bg-red-500" : Number(fillPct) > 75 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, Number(fillPct))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Terpakai: {fillPct}%</span>
                    <span>Tersedia: {((sp.capacity - sp.currentQuantity)).toLocaleString()} Ton</span>
                  </div>
                </div>

                {/* Quality Badge Grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                    <p className="text-[10px] text-slate-400">CV (GAR)</p>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">{sp.quality.cvGAR}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                    <p className="text-[10px] text-slate-400">Ash (%)</p>
                    <p className={`font-bold text-[11px] ${sp.quality.ash > 9 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                      {sp.quality.ash}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                    <p className="text-[10px] text-slate-400">Moisture</p>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">{sp.quality.totalMoisture}%</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                    <p className="text-[10px] text-slate-400">Sulfur</p>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">{sp.quality.sulfur}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{sp.location.area}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      sp.quality.status === "ON SPEC"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : sp.quality.status === "WARNING"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ● {sp.quality.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Movements & Alerts Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements Log */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Pergerakan Batubara Terbaru
            </h3>
            <button
              onClick={() => onNavigateTab("movement")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Lihat Semua Transaksi →
            </button>
          </div>

          <div className="space-y-3">
            {movements.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2 ${
                      m.movementType === "IN"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : m.movementType === "OUT"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-purple-500/10 text-purple-500"
                    }`}
                  >
                    {m.movementType === "IN" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : m.movementType === "OUT" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {m.movementType} - {m.quantity.toLocaleString()} Ton
                      </span>
                      <span className="text-[10px] text-slate-400">{m.shift}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {m.sourceStockpileName || "Pit/Source"} → {m.destinationStockpileName || "Crusher/Target"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {m.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Alert Desk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Notifikasi & Peringatan Aktif
            </h3>
            <button
              onClick={() => onNavigateTab("alerts")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Lihat Alert Center →
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-3.5 text-xs ${
                  alert.severity === "CRITICAL"
                    ? "border-red-500/30 bg-red-500/5 dark:bg-red-500/10"
                    : alert.severity === "HIGH"
                    ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10"
                    : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 ${
                        alert.severity === "CRITICAL"
                          ? "text-red-500"
                          : alert.severity === "HIGH"
                          ? "text-amber-500"
                          : "text-blue-500"
                      }`}
                    />
                    <h4 className="font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                      alert.severity === "CRITICAL"
                        ? "bg-red-500 text-white"
                        : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 pl-6">
                  {alert.description}
                </p>
                <div className="mt-2 pl-6 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Lokasi: {alert.stockpileName}</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
