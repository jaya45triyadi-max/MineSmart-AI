// MINE SMART AI - Crushing Plant Operations & Telemetry View
// Stream 6: Crushing Production, Feed In, Output Sizing, Operating Hours, Throughput TPH

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  Layers,
  Scale,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CrushingRecord } from "../../../types/productionTypes";

interface CrushingManagementViewProps {
  crushingRecords: CrushingRecord[];
  onOpenInputModal: () => void;
}

export const CrushingManagementView: React.FC<CrushingManagementViewProps> = ({
  crushingRecords,
  onOpenInputModal,
}) => {
  const [selectedPlant, setSelectedPlant] = useState<string>("ALL");

  const filteredRecords = crushingRecords.filter(
    (c) => selectedPlant === "ALL" || c.crusherId === selectedPlant
  );

  const totalFeed = filteredRecords.reduce((s, r) => s + r.feedTonnage, 0);
  const totalOutput = filteredRecords.reduce((s, r) => s + r.crushedOutputTonnage, 0);
  const totalHours = filteredRecords.reduce((s, r) => s + r.operatingHours, 0);
  const avgThroughput = totalHours > 0 ? Number((totalOutput / totalHours).toFixed(1)) : 0;
  const yieldEfficiency = totalFeed > 0 ? Number(((totalOutput / totalFeed) * 100).toFixed(1)) : 98.2;

  // Crusher unit status cards
  const crushers = [
    {
      id: "CRUSH-PLANT-01",
      name: "Primary Crusher Plant 01",
      brand: "Telsmith 1200 TPH Jaw & Roll Crusher",
      capacityTPH: 1200,
      currentTPH: 706,
      utilization: 88.5,
      status: "RUNNING",
      feedToday: 6850,
      outputToday: 6710,
      productSize: "-50mm Export Product",
      location: "Stockpile ROM North",
    },
    {
      id: "CRUSH-PLANT-02",
      name: "Secondary Mobile Crusher 02",
      brand: "Metso Lokotrack LT1213S Impact",
      capacityTPH: 600,
      currentTPH: 460,
      utilization: 82.0,
      status: "RUNNING",
      feedToday: 4120,
      outputToday: 4050,
      productSize: "-38mm Domestic Power Plant",
      location: "Stockpile ROM South",
    },
  ];

  const productSizingData = [
    { name: "-50mm Sized Coal", value: 65, fill: "#06b6d4" },
    { name: "-38mm Sized Coal", value: 25, fill: "#3b82f6" },
    { name: "Undersize (<5mm Fines)", value: 7, fill: "#8b5cf6" },
    { name: "Oversize Re-crush", value: 3, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              STREAM 6 • CRUSHING PLANT MANAGEMENT
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-1">
            Crushing Plant & Coal Processing Monitoring
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring throughput rate feed ROM, ukuran produk sizing (-50mm / -38mm), jam operasi & yield efisiensi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Semua Crusher Plant</option>
            <option value="CRUSH-PLANT-01">Crusher 01 (Telsmith)</option>
            <option value="CRUSH-PLANT-02">Crusher 02 (Metso Mobile)</option>
          </select>

          <button
            onClick={onOpenInputModal}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Input Crushing Log</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Total ROM Feed In <Scale className="w-4 h-4 text-cyan-400" />
          </span>
          <div className="text-2xl font-black text-white font-mono">{totalFeed.toLocaleString()} <span className="text-xs text-slate-400">Ton</span></div>
          <p className="text-[11px] text-slate-400">Feed dari ROM Stockpile Dome</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Crushed Coal Output <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{totalOutput.toLocaleString()} <span className="text-xs text-slate-400">Ton</span></div>
          <p className="text-[11px] text-slate-400">Produk siap kirim ke stockpile bersih</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Avg Throughput Rate <Zap className="w-4 h-4 text-amber-400" />
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">{avgThroughput} <span className="text-xs text-slate-400">TPH</span></div>
          <p className="text-[11px] text-slate-400">Ton per operating hour</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Plant Recovery Yield <Activity className="w-4 h-4 text-indigo-400" />
          </span>
          <div className="text-2xl font-black text-indigo-400 font-mono">{yieldEfficiency}%</div>
          <p className="text-[11px] text-emerald-400">Tinggi (Minimal fine dust loss)</p>
        </div>
      </div>

      {/* 2 Active Crusher Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crushers.map((crusher) => (
          <div key={crusher.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{crusher.name}</h3>
                  <p className="text-[11px] text-slate-400">{crusher.brand}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {crusher.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Throughput Live</span>
                <span className="text-sm font-black text-white font-mono">{crusher.currentTPH} TPH</span>
                <span className="text-[10px] text-slate-500">Cap: {crusher.capacityTPH} TPH</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Feed Today</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{crusher.feedToday.toLocaleString()} T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Output Sized</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{crusher.outputToday.toLocaleString()} T</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Sizing: <strong className="text-white">{crusher.productSize}</strong></span>
              <span>Utilisasi: <strong className="text-amber-400">{crusher.utilization}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Sizing Distribution & Crushing Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sizing Donut Chart */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Distribusi Ukuran Produk
            </h3>
            <span className="text-xs text-slate-400 font-mono">Sieve Screen</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productSizingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {productSizingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {productSizingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Crushing Records History Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Log Riwayat Crushing Plant
            </h3>
            <span className="text-xs text-slate-400">Total {filteredRecords.length} Log Shift</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Crushing</th>
                  <th className="p-3">Tanggal / Shift</th>
                  <th className="p-3">Unit Plant</th>
                  <th className="p-3">Feed In</th>
                  <th className="p-3">Crushed Out</th>
                  <th className="p-3">Throughput</th>
                  <th className="p-3">Sizing</th>
                  <th className="p-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredRecords.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{cr.crushingId}</td>
                    <td className="p-3">{cr.date} ({cr.shift === "SHIFT_1_DAY" ? "Shift 1" : "Shift 2"})</td>
                    <td className="p-3 font-bold text-white">{cr.crusherId}</td>
                    <td className="p-3 font-mono">{cr.feedTonnage.toLocaleString()} T</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{cr.crushedOutputTonnage.toLocaleString()} T</td>
                    <td className="p-3 font-mono text-amber-400">{cr.throughputRateTonPerHour} TPH</td>
                    <td className="p-3 text-slate-300">{cr.productSize}</td>
                    <td className="p-3 text-slate-400">{cr.operatorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
