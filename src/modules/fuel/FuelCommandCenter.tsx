// MINE SMART AI - Fuel Command Center (Overview Dashboard)

import React from "react";
import {
  Fuel,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Truck,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  FuelTank,
  FuelStation,
  FuelConsumptionRecord,
  FuelAnomaly,
  FuelLossAlert,
  FuelForecast
} from "../../types/fuelTypes";

interface FuelCommandCenterProps {
  tanks: FuelTank[];
  stations: FuelStation[];
  consumptionRecords: FuelConsumptionRecord[];
  anomalies: FuelAnomaly[];
  lossAlerts: FuelLossAlert[];
  forecasts: FuelForecast[];
  onOpenDispenseModal: () => void;
  onOpenReceivingModal: () => void;
  onOpenAIAssistant: () => void;
}

export const FuelCommandCenter: React.FC<FuelCommandCenterProps> = ({
  tanks,
  stations,
  consumptionRecords,
  anomalies,
  lossAlerts,
  forecasts,
  onOpenDispenseModal,
  onOpenReceivingModal,
  onOpenAIAssistant
}) => {
  // Aggregate KPIs
  const totalCurrentStock = tanks.reduce((sum, t) => sum + t.currentStock, 0);
  const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
  const stockPercentage = totalCapacity > 0 ? (totalCurrentStock / totalCapacity) * 100 : 0;

  const openingStock = 120500;
  const fuelReceived = 48000;
  const fuelDispensed = 26400;
  const recordedConsumption = 26250;
  const reconciledConsumption = 26380;
  const stockVariance = -130; // Liters
  const avgFuelPerHour = 43.1;
  const avgFuelPerTon = 0.81;
  const avgFuelPerKm = 1.95;
  const abnormalCount = anomalies.filter(a => a.status === "Active" || a.status === "Investigating").length;
  const potentialFuelLossLiters = lossAlerts.reduce((sum, l) => sum + Math.abs(l.variance), 0);

  // Mock trend data for Recharts
  const trendData = [
    { time: "00:00", stock: 120500, dispensing: 1200, receiving: 0 },
    { time: "04:00", stock: 119300, dispensing: 2100, receiving: 0 },
    { time: "08:00", stock: 149200, dispensing: 3800, receiving: 32000 },
    { time: "12:00", stock: 142400, dispensing: 6800, receiving: 0 },
    { time: "16:00", stock: 132100, dispensing: 10300, receiving: 0 },
    { time: "20:00", stock: 122100, dispensing: 10000, receiving: 0 }
  ];

  const efficiencyData = [
    { type: "Dump Truck Scania P410", actual: 0.84, target: 0.88, unit: "L/Ton" },
    { type: "Dump Truck Volvo FMX", actual: 1.08, target: 0.88, unit: "L/Ton" },
    { type: "Excavator CAT 6020B", actual: 85.0, target: 88.0, unit: "L/Hr" },
    { type: "Excavator Komatsu PC2000", actual: 93.9, target: 82.0, unit: "L/Hr" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Actions & Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                Fuel Command Center
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Site Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat monitoring stok BBM, dispensing, efisiensi konsumsi, anomali, dan kecerdasan AI Fuel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenReceivingModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Droplets className="w-4 h-4 text-emerald-400" />
            Terima Solar (Receiving)
          </button>
          <button
            onClick={onOpenDispenseModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Fuel className="w-4 h-4" />
            Catat Dispensing
          </button>
          <button
            onClick={onOpenAIAssistant}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            AI Fuel Copilot
          </button>
        </div>
      </div>

      {/* 12 Core KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Current Fuel Stock</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {totalCurrentStock.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {stockPercentage.toFixed(1)}% Kapasitas Tangki
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Opening Stock</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {openingStock.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awal Shift Today</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Fuel Received</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1">
            +{fuelReceived.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> Pertamina & AKR
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Fuel Dispensed</div>
          <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline gap-1">
            -{fuelDispensed.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" /> All Units Shift 1
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Recorded Consumption</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {recordedConsumption.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Telematics + Sensors</div>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Reconciled Cons.</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {reconciledConsumption.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Verified Audit</div>
        </div>

        {/* KPI 7 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Stock Variance</div>
          <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline gap-1">
            {stockVariance}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">-0.23% (Within Limit)</div>
        </div>

        {/* KPI 8 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Fuel / Hour</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {avgFuelPerHour}
            <span className="text-xs text-slate-400 font-normal">L/Hr</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Site Fleet Average</div>
        </div>

        {/* KPI 9 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Fuel / Ton</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1">
            {avgFuelPerTon}
            <span className="text-xs text-slate-400 font-normal">L/Ton</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Target: 0.88 L/Ton</div>
        </div>

        {/* KPI 10 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Fuel / Distance</div>
          <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1">
            {avgFuelPerKm}
            <span className="text-xs text-slate-400 font-normal">L/km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Hauling Trucks</div>
        </div>

        {/* KPI 11 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Abnormal Consumption</div>
          <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline gap-1">
            {abnormalCount}
            <span className="text-xs text-slate-400 font-normal">Alerts</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">Requires Review</div>
        </div>

        {/* KPI 12 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400 font-medium">Potential Loss</div>
          <div className="text-xl font-bold text-rose-400 mt-1 flex items-baseline gap-1">
            {potentialFuelLossLiters}
            <span className="text-xs text-slate-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Investigated / Closed</div>
        </div>
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock & Dispensing Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Fuel Stock & Dispensing Flow Trend
              </h3>
              <p className="text-xs text-slate-400">Monitoring real-time akumulasi stok dan penerimaan solar</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">24 Hours View</span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Area type="monotone" dataKey="stock" name="Total Fuel Stock (L)" stroke="#f59e0b" fillOpacity={1} fill="url(#stockGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="dispensing" name="Cum. Dispensed (L)" stroke="#10b981" fillOpacity={1} fill="url(#dispGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Fuel Insight Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">AI Fuel Intelligence</h3>
                <p className="text-xs text-slate-400">Automated Root Cause & Recommendations</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>Inefisiensi Dump Truck HT-203</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Confidence 91%</span>
                </div>
                <p className="text-slate-300 mt-1">
                  Fuel per Ton HT-203 melonjak ke **1.078 L/Ton** (+22.5% vs target). Telemetri menunjukkan **idle time 28 menit** di loading ramp Pit A.
                </p>
                <div className="mt-2 pt-2 border-t border-amber-500/20 text-emerald-300 font-semibold">
                  💡 Rekomendasi: Lakukan re-dispatch 2 unit truk dari Pit A ke Pit B untuk kurangi antrian.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <div className="font-bold text-slate-200 flex items-center justify-between">
                  <span>Proyeksi Stok & Reorder Date</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">End of Week</span>
                </div>
                <p className="text-slate-300 mt-1">
                  Total stok 122.100 L aman hingga **8.2 hari kedepan**. Tanggal reorder disarankan pada **16 Aug 2026** (32.000 L).
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Tanyakan Detail ke AI Assistant
          </button>
        </div>
      </div>

      {/* Fuel Efficiency Comparison & Tanks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency by Equipment Type */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            Fuel Efficiency vs Configured Target
          </h3>
          <p className="text-xs text-slate-400 mb-4">Perbandingan konsumsi aktual vs batas standar operasional</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                <Legend />
                <Bar dataKey="actual" name="Aktual Konsumsi" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target Baseline" fill="#64748b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Fuel Tanks & Mobile Fuel Fleet */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-400" />
              Tangki Stok & Mobile Fuel Truck Status
            </h3>
            <p className="text-xs text-slate-400 mb-4">Status kapasitas dan ketersediaan solar per lokasi</p>

            <div className="space-y-3">
              {tanks.map(t => {
                const fillPct = (t.currentStock / t.capacity) * 100;
                return (
                  <div key={t.id} className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-200">{t.name}</span>
                      <span className="text-amber-400 font-mono">{t.currentStock.toLocaleString()} / {t.capacity.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          fillPct < 25 ? "bg-rose-500" : fillPct < 50 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Location: {t.locationType}</span>
                      <span className="text-emerald-400 font-medium">{fillPct.toFixed(1)}% Full</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
