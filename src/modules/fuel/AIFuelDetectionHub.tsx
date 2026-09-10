// MINE SMART AI - Dedicated AI Fuel Detection Engine & Diagnostics Hub
// Features: Konsumsi Abnormal, Idle Berlebihan, Potensi Fuel Loss (Theft/Siphoning), Unit Tidak Efisien

import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Zap,
  TrendingUp,
  TrendingDown,
  Truck,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  FileSearch,
  Award,
  AlertCircle,
  Radio,
  BarChart3,
  Flame,
  Volume2,
  Send,
  RefreshCw,
  X,
  Lock,
  Camera
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  ComposedChart,
  Line
} from "recharts";
import {
  FuelAnomaly,
  FuelIdleRecord,
  FuelEfficiencyRanking,
  FuelSiphoningAlert,
  FuelLossAlert,
  FuelInvestigation,
  InvestigationStatus
} from "../../types/fuelTypes";

interface AIFuelDetectionHubProps {
  anomalies: FuelAnomaly[];
  idleRecords: FuelIdleRecord[];
  efficiencyRankings: FuelEfficiencyRanking[];
  siphoningAlerts: FuelSiphoningAlert[];
  lossAlerts: FuelLossAlert[];
  investigations: FuelInvestigation[];
  onUpdateAnomalyStatus: (id: string, status: "Active" | "Investigating" | "Resolved" | "False Positive") => void;
  onUpdateIdleStatus: (id: string, status: "Flagged" | "Coaching Sent" | "Resolved") => void;
  onUpdateSiphoningStatus: (id: string, status: any, notes?: string) => void;
  onStartInvestigation?: (alert: FuelLossAlert) => void;
  onOpenAICopilot: () => void;
}

export const AIFuelDetectionHub: React.FC<AIFuelDetectionHubProps> = ({
  anomalies,
  idleRecords,
  efficiencyRankings,
  siphoningAlerts,
  lossAlerts,
  investigations,
  onUpdateAnomalyStatus,
  onUpdateIdleStatus,
  onUpdateSiphoningStatus,
  onStartInvestigation,
  onOpenAICopilot
}) => {
  // Detection Categories Tabs
  const [detectionTab, setDetectionTab] = useState<
    "abnormal" | "idle" | "loss-theft" | "inefficient-units"
  >("abnormal");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Siphoning Alert Modal for Investigation
  const [inspectSiphoning, setInspectSiphoning] = useState<FuelSiphoningAlert | null>(null);
  const [investigationNoteInput, setInvestigationNoteInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs Calculations
  const activeAbnormalCount = anomalies.filter(a => a.status === "Active" || a.status === "Investigating").length;
  const totalIdleHours = idleRecords.reduce((sum, r) => sum + r.idleHours, 0);
  const totalIdleWastedLiters = idleRecords.reduce((sum, r) => sum + r.idleFuelWastedLiters, 0);
  const totalIdleWastedCost = idleRecords.reduce((sum, r) => sum + r.estimatedWastedCostIDR, 0);
  const activeSiphoningAlerts = siphoningAlerts.filter(s => s.status !== "Resolved" && s.status !== "Sensor Glitch").length;
  const severeInefficientUnits = efficiencyRankings.filter(e => e.efficiencyStatus === "Severe Inefficiency" || e.efficiencyStatus === "Inefficient").length;

  // Chart data for Idle Analysis
  const idleChartData = idleRecords.map(r => ({
    name: r.equipmentCode,
    workingHours: r.workingHours,
    idleHours: r.idleHours,
    wastedLiters: r.idleFuelWastedLiters,
    idlePct: r.idlePercentage
  }));

  // Chart data for Efficiency Score
  const efficiencyChartData = efficiencyRankings.map(e => ({
    code: e.equipmentCode,
    score: e.efficiencyScore,
    fuelPerHour: e.fuelPerHour,
    targetHour: e.targetFuelPerHour,
    status: e.efficiencyStatus
  }));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with AI Engine Summary */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              AI FUEL INTELLIGENCE ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">Neural Anomaly & Loss Defense v3.8</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            AI Fuel Detection & Diagnostics Hub
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Sistem deteksi otomatis berbasis Machine Learning untuk mengidentifikasi <strong>Konsumsi Abnormal</strong>, 
            <strong> Idle Berlebihan</strong>, <strong>Potensi Fuel Loss & Anti-Siphoning (Theft)</strong>, serta 
            <strong> Peringkat Unit Tidak Efisien</strong> di seluruh armada tambang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Tanya AI Fuel Advisor</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Konsumsi Abnormal */}
        <div
          onClick={() => setDetectionTab("abnormal")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            detectionTab === "abnormal"
              ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">1. Konsumsi Abnormal</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
            {activeAbnormalCount} <span className="text-xs text-slate-400 font-normal">Active Alerts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Spike Deviation &gt; 15%</span>
            <span className="text-amber-400 font-bold">Investigating</span>
          </div>
        </div>

        {/* Pillar 2: Idle Berlebihan */}
        <div
          onClick={() => setDetectionTab("idle")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            detectionTab === "idle"
              ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">2. Idle Berlebihan</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-400 mt-2 font-mono">
            {totalIdleWastedLiters.toFixed(1)} <span className="text-xs text-slate-400 font-normal">Liters Wasted</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{totalIdleHours.toFixed(1)} Jam Idle</span>
            <span className="text-rose-400 font-bold font-mono">Rp {(totalIdleWastedCost / 1000000).toFixed(2)} Jt</span>
          </div>
        </div>

        {/* Pillar 3: Potensi Fuel Loss & Anti-Theft */}
        <div
          onClick={() => setDetectionTab("loss-theft")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            detectionTab === "loss-theft"
              ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">3. Potensi Fuel Loss</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 font-mono">
            {activeSiphoningAlerts + lossAlerts.length} <span className="text-xs text-slate-400 font-normal">Events Flagged</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Anti-Siphoning & ATG Discrepancy</span>
            <span className="text-rose-400 font-bold">High Priority</span>
          </div>
        </div>

        {/* Pillar 4: Unit Tidak Efisien */}
        <div
          onClick={() => setDetectionTab("inefficient-units")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            detectionTab === "inefficient-units"
              ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
              : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">4. Unit Tidak Efisien</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-2 font-mono">
            {severeInefficientUnits} <span className="text-xs text-slate-400 font-normal">Units Suboptimal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>L/Hr, L/Ton, L/Km Index</span>
            <span className="text-cyan-400 font-bold">Actionable Fix</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-lg">
        <button
          onClick={() => setDetectionTab("abnormal")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            detectionTab === "abnormal"
              ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Deteksi Konsumsi Abnormal</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono">
            {anomalies.length}
          </span>
        </button>

        <button
          onClick={() => setDetectionTab("idle")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            detectionTab === "idle"
              ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Deteksi Idle Berlebihan</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono">
            {idleRecords.length}
          </span>
        </button>

        <button
          onClick={() => setDetectionTab("loss-theft")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            detectionTab === "loss-theft"
              ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Potensi Fuel Loss & Anti-Siphoning</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono">
            {siphoningAlerts.length + lossAlerts.length}
          </span>
        </button>

        <button
          onClick={() => setDetectionTab("inefficient-units")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            detectionTab === "inefficient-units"
              ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Peringkat Unit Tidak Efisien</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono">
            {efficiencyRankings.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DETEKSI KONSUMSI ABNORMAL TAB */}
      {/* ========================================================================= */}
      {detectionTab === "abnormal" && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-slate-300">
                <div className="font-bold text-amber-300 text-sm">Automated Real-Time Spike & Deviation Algorithm</div>
                <p className="text-slate-400 mt-0.5">
                  Mendeteksi lonjakan konsumsi solar di luar batas toleransi (&gt;15% dari baseline moving average) dengan mengkorelasikan CANBus telemetry, tiket dispensing, dan output tonase/BCM.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold">
                AI Precision: 94.8%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {anomalies.map(anom => (
              <div
                key={anom.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-black text-white flex items-center gap-2">
                        {anom.equipmentCode}
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                          {anom.equipmentType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {new Date(anom.timestamp).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        anom.severity === "High" || anom.severity === "Critical"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {anom.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {anom.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  <span>{anom.type} (+{anom.deviationPercent}% Deviation)</span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  {anom.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Standard Baseline</div>
                    <div className="text-slate-200 font-black text-sm mt-0.5">{anom.baselineValue}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Actual Recorded</div>
                    <div className="text-rose-400 font-black text-sm mt-0.5">
                      {anom.actualValue} (+{anom.deviationPercent}%)
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Method: <strong className="text-slate-300">{anom.detectionMethod}</strong> (Confidence: {(anom.confidence * 100).toFixed(0)}%)
                  </span>

                  <div className="flex items-center gap-2">
                    {anom.status === "Active" && (
                      <button
                        onClick={() => {
                          onUpdateAnomalyStatus(anom.id, "Investigating");
                          showToast(`Status anomali ${anom.equipmentCode} diubah menjadi Investigasi`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                      >
                        Mulai Investigasi
                      </button>
                    )}
                    {anom.status === "Investigating" && (
                      <button
                        onClick={() => {
                          onUpdateAnomalyStatus(anom.id, "Resolved");
                          showToast(`Anomali ${anom.equipmentCode} berhasil diselesaikan!`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                      >
                        Tandai Selesai (Resolved)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DETEKSI IDLE BERLEBIHAN TAB */}
      {/* ========================================================================= */}
      {detectionTab === "idle" && (
        <div className="space-y-6">
          <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-slate-300">
                <div className="font-bold text-orange-300 text-sm">Excessive Engine Idle & Fuel Waste Monitoring</div>
                <p className="text-slate-400 mt-0.5">
                  Mendeteksi unit yang menyala dalam kondisi diam (Engine On Standby &gt; 15 menit) di antrean loading, dumping area, dan pergantian shift.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400">Total Kerugian BBM Idle</div>
              <div className="text-lg font-black text-rose-400 font-mono">
                Rp {totalIdleWastedCost.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          {/* Idle Comparison Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Rasio Jam Kerja Produktif vs Jam Idle Mesin
                </h3>
                <p className="text-xs text-slate-400">Visualisasi jam kerja efektif vs pemborosan solar idle per equipment</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={idleChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                  />
                  <Legend />
                  <Bar dataKey="workingHours" name="Jam Kerja Efektif (Hours)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="idleHours" name="Jam Idle Boros (Hours)" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Idle Records Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Daftar Unit Teridentifikasi Idle Berlebihan
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Equipment & Operator</th>
                    <th className="p-3.5">Lokasi Terdeteksi</th>
                    <th className="p-3.5 text-center">Total / Idle Hours</th>
                    <th className="p-3.5 text-center">% Idle</th>
                    <th className="p-3.5 text-right">Solar Terbuang</th>
                    <th className="p-3.5 text-right">Estimasi Biaya Wasted</th>
                    <th className="p-3.5">Penyebab (Root Cause) & Rekomendasi</th>
                    <th className="p-3.5 text-center">Aksi AI Coaching</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {idleRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-black text-white text-sm">{r.equipmentCode}</div>
                        <div className="text-[11px] text-slate-400 font-sans">{r.operatorName} • {r.shift}</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="text-slate-300">{r.idleLocation}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="text-slate-200">{r.totalEngineHours}h</span> /{" "}
                        <span className="text-orange-400 font-black">{r.idleHours}h</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                          r.idlePercentage > 35 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                          {r.idlePercentage}%
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-orange-400">
                        {r.idleFuelWastedLiters} L
                      </td>
                      <td className="p-3.5 text-right font-black text-rose-400">
                        Rp {r.estimatedWastedCostIDR.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3.5 font-sans max-w-xs">
                        <div className="text-slate-300 line-clamp-1 font-semibold">{r.rootCause}</div>
                        <div className="text-[10px] text-amber-400 line-clamp-1">{r.recommendation}</div>
                      </td>
                      <td className="p-3.5 text-center font-sans">
                        {r.status === "Flagged" && (
                          <button
                            onClick={() => {
                              onUpdateIdleStatus(r.id, "Coaching Sent");
                              showToast(`Pesan Coaching hemat solar dikirim ke operator ${r.operatorName}`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 mx-auto transition-all cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Kirim Coaching
                          </button>
                        )}
                        {r.status === "Coaching Sent" && (
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                            Coaching Terkirim
                          </span>
                        )}
                        {r.status === "Resolved" && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 mx-auto justify-center">
                            <CheckCircle2 className="w-3 h-3" /> Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. POTENSI FUEL LOSS & ANTI-SIPHONING (THEFT) TAB */}
      {/* ========================================================================= */}
      {detectionTab === "loss-theft" && (
        <div className="space-y-6">
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-slate-300">
                <div className="font-bold text-rose-300 text-sm">Anti-Siphoning, Theft & Tank Loss Defense Engine</div>
                <p className="text-slate-400 mt-0.5">
                  Mendeteksi penurunan level BBM drastis saat mesin mati (Engine Off Siphoning), deviasi rekonsiliasi tangki &gt;0.5%, dan indikasi manipulasi flowmeter.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold font-mono">
                Security Patrol Active
              </span>
            </div>
          </div>

          {/* Siphoning & Sudden Drop Events */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
              Insiden Siphoning & Penurunan Level Solar Tiba-Tiba
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siphoningAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-rose-500/50 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-base font-black text-rose-400 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-rose-400" />
                        {alert.targetCode}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{alert.location}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black">
                      {alert.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Level Awal</div>
                      <div className="font-bold text-slate-200 mt-0.5">{alert.initialLevelLiters} L</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Level Akhir</div>
                      <div className="font-bold text-slate-200 mt-0.5">{alert.finalLevelLiters} L</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                      <div className="text-[10px] text-rose-400 font-bold">Penurunan (Drop)</div>
                      <div className="font-black text-rose-400 mt-0.5">-{alert.fuelDropLiters} Liter</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Kondisi Mesin: <strong className="text-rose-400">{alert.engineStatus}</strong></span>
                      <span>Durasi Drop: <strong>{alert.durationMinutes} Menit</strong></span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                      {alert.investigationNotes}
                    </p>
                    {alert.cctvSnapshotRef && (
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono pt-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>CCTV Evidence: {alert.cctvSnapshotRef}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Status: <strong className="text-amber-400">{alert.status}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setInspectSiphoning(alert);
                        setInvestigationNoteInput(alert.investigationNotes || "");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      Detail & Investigasi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tank Variance & Discrepancies Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Peringatan Deviasi Rekonsiliasi Tangki (Tank Variance)
            </h3>

            <div className="space-y-3">
              {lossAlerts.map(alert => (
                <div key={alert.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-400 text-sm">{alert.locationName}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                        Variance: {alert.variance} L ({alert.variancePercent}%)
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Expected: {alert.expectedStock.toLocaleString()} L • Physical ATG: {alert.physicalStock.toLocaleString()} L • {alert.period}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                      {alert.status}
                    </span>
                    {onStartInvestigation && (
                      <button
                        onClick={() => onStartInvestigation(alert)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                      >
                        Buka Tiket Investigasi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PERINGKAT UNIT TIDAK EFISIEN TAB */}
      {/* ========================================================================= */}
      {detectionTab === "inefficient-units" && (
        <div className="space-y-6">
          <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-slate-300">
                <div className="font-bold text-cyan-300 text-sm">Equipment Fleet Efficiency Benchmark & Diagnostic Matrix</div>
                <p className="text-slate-400 mt-0.5">
                  Evaluasi efisiensi konsumsi solar per unit berdasarkan <strong>Fuel/Hour (L/h)</strong>, <strong>Fuel/Ton (L/ton)</strong>, dan <strong>Fuel/km (L/km)</strong> terhadap target standar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedEquipmentFilter}
                onChange={e => setSelectedEquipmentFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="ALL">Semua Kategori Alat</option>
                <option value="Dump Truck">Dump Trucks</option>
                <option value="Excavator">Excavators</option>
                <option value="Bulldozer">Bulldozers</option>
              </select>
            </div>
          </div>

          {/* Efficiency Score Leaderboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {efficiencyRankings
              .filter(e => selectedEquipmentFilter === "ALL" || e.equipmentCategory === selectedEquipmentFilter)
              .map(unit => {
                const isInefficient = unit.efficiencyStatus === "Inefficient" || unit.efficiencyStatus === "Severe Inefficiency";
                return (
                  <div
                    key={unit.id}
                    className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 transition-all ${
                      unit.efficiencyStatus === "Optimal"
                        ? "border-emerald-500/30"
                        : unit.efficiencyStatus === "Normal"
                        ? "border-slate-800"
                        : "border-rose-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-base font-black text-white flex items-center gap-2">
                          <Truck className="w-5 h-5 text-amber-400" />
                          {unit.equipmentCode}
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                            {unit.model}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Operator: <strong className="text-slate-200">{unit.assignedOperator}</strong></div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black font-mono flex items-center gap-1 justify-end">
                          <span className={unit.efficiencyScore >= 90 ? "text-emerald-400" : unit.efficiencyScore >= 80 ? "text-amber-400" : "text-rose-400"}>
                            {unit.efficiencyScore.toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-400 font-normal">Score</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            unit.efficiencyStatus === "Optimal"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : unit.efficiencyStatus === "Normal"
                              ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {unit.efficiencyStatus}
                        </span>
                      </div>
                    </div>

                    {/* Fuel Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Fuel / Hour</div>
                        <div className="text-sm font-black text-slate-200 mt-0.5">
                          {unit.fuelPerHour} <span className="text-[10px] text-slate-400">L/h</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Target: {unit.targetFuelPerHour} L/h</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Fuel / Ton</div>
                        <div className="text-sm font-black text-slate-200 mt-0.5">
                          {unit.fuelPerTon ? `${unit.fuelPerTon} L/t` : "-"}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {unit.targetFuelPerTon ? `Target: ${unit.targetFuelPerTon} L/t` : "-"}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Fuel / KM</div>
                        <div className="text-sm font-black text-slate-200 mt-0.5">
                          {unit.fuelPerKm ? `${unit.fuelPerKm} L/km` : "-"}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {unit.targetFuelPerKm ? `Target: ${unit.targetFuelPerKm} L/km` : "-"}
                        </div>
                      </div>
                    </div>

                    {/* Root causes and suggested action */}
                    <div className="space-y-2 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        AI Diagnosis & Root Causes:
                      </div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px] pl-1">
                        {unit.rootCauses.map((rc, idx) => (
                          <li key={idx}>{rc}</li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                        <span className="font-bold text-amber-400">Rekomendasi Tindakan: </span>
                        <span className="text-slate-300">{unit.suggestedAction}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL: INVESTIGATE SIPHONING ALERT */}
      {inspectSiphoning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Investigasi Potensi Siphoning ({inspectSiphoning.targetCode})
              </h3>
              <button
                onClick={() => setInspectSiphoning(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Target</div>
                  <div className="font-bold text-white text-sm mt-0.5">{inspectSiphoning.targetName}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Lokasi Kejadian</div>
                  <div className="font-bold text-white text-sm mt-0.5">{inspectSiphoning.location}</div>
                </div>
              </div>

              <div className="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl text-rose-200">
                <div className="font-bold">Kejadian Terdeteksi:</div>
                <p className="mt-1">
                  Penurunan BBM sebesar <strong>-{inspectSiphoning.fuelDropLiters} Liter</strong> dalam durasi {inspectSiphoning.durationMinutes} menit saat status mesin <strong>{inspectSiphoning.engineStatus}</strong>.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Catatan Hasil Investigasi & Tindakan</label>
                <textarea
                  rows={4}
                  value={investigationNoteInput}
                  onChange={e => setInvestigationNoteInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Tuliskan temuan CCTV, verifikasi fisik tangki, atau penyebab anomali..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiphoningStatus(inspectSiphoning.id, "Sensor Glitch", investigationNoteInput);
                    setInspectSiphoning(null);
                    showToast("Alert ditandai sebagai Sensor Glitch / False Positive");
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold"
                >
                  Sensor Glitch
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiphoningStatus(inspectSiphoning.id, "Confirmed Theft", investigationNoteInput);
                    setInspectSiphoning(null);
                    showToast("Kasus dikonfirmasi sebagai Theft / Unauthorized Loss dan diteruskan ke Manajemen");
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Konfirmasi Theft (Loss)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiphoningStatus(inspectSiphoning.id, "Resolved", investigationNoteInput);
                    setInspectSiphoning(null);
                    showToast("Kasus investigasi siphoning ditandai Selesai (Resolved)");
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Selesaikan Kasus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
