// MINE SMART AI - Executive Finance & Cost Control Command Center Tab
import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Layers,
  Calendar,
  Building2,
  HelpCircle,
  Clock,
  Briefcase,
  FileText,
  Pickaxe,
  Fuel,
  Wrench,
  Truck,
  Users,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { FinanceKPISummary, AIFinanceInsight, RevenueRecord, OpexRecord } from "../../../types/financeTypes";

interface FinanceCommandCenterTabProps {
  kpi: FinanceKPISummary;
  insights: AIFinanceInsight[];
  recentRevenues: RevenueRecord[];
  recentOpex: OpexRecord[];
  onNavigateTab: (tabKey: string) => void;
}

export const FinanceCommandCenterTab: React.FC<FinanceCommandCenterTabProps> = ({
  kpi,
  insights,
  recentRevenues,
  recentOpex,
  onNavigateTab,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("THIS_MONTH");
  const [showAutoAnalysisModal, setShowAutoAnalysisModal] = useState<boolean>(false);

  const formatIDR = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    }
    if (Math.abs(val) >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  const costPerTonDiff = kpi.costPerTonBaselineIDR
    ? ((kpi.costPerTonIDR - kpi.costPerTonBaselineIDR) / kpi.costPerTonBaselineIDR) * 100
    : 8.41;

  const costPerBCMDiff = kpi.costPerBCMBaselineIDR
    ? ((kpi.costPerBCMIDR - kpi.costPerBCMBaselineIDR) / kpi.costPerBCMBaselineIDR) * 100
    : 7.91;

  return (
    <div className="space-y-6">
      {/* Top Filter & Period Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Executive Finance & Mining Cost Dashboard</h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/30">
                LIVE ERP SYNC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Konsolidasi Finansial: Revenue, Cost, OPEX, CAPEX, Budget, Actual, Cash Flow & Profitabilitas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-400">Periode:</span>
          {[
            { key: "TODAY", label: "Hari Ini" },
            { key: "THIS_WEEK", label: "Minggu Ini" },
            { key: "THIS_MONTH", label: "Bulan Ini (Agustus)" },
            { key: "THIS_QUARTER", label: "Q3 2026" },
            { key: "YTD", label: "YTD 2026" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedPeriod === p.key
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Automated Cause Analysis Prompt Card */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                AI Automated Cost Diagnosis Engine
              </span>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-black rounded border border-rose-500/30 animate-pulse">
                Mining Cost Alert (+8.4%)
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              "Apa penyebab mining cost naik bulan ini?"
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl">
              AI telah mengidentifikasi 4 faktor penyebab kenaikan Cost/Ton (Rp 85.100 vs Rp 78.500) & Cost/BCM (Rp 23.200 vs Rp 21.500):
              lonjakan konsumsi fuel hauling (+1.8 km), kerusakan darurat silinder hidrolik PC1250 EX-204, degradasi jalan licin, dan penambahan jam lembur.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAutoAnalysisModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Lihat Analisis Otomatis AI</span>
            </button>
            <button
              onClick={() => onNavigateTab("ai-insight")}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>AI Advisor Chat</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRIMARY FINANCIAL DASHBOARD METRICS (Revenue, Cost, OPEX, CAPEX, Budget, Actual, Cash Flow, Profit) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Financial Executive Summary (8 Core Pillars)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Klik kartu untuk membuka modul terkait</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. REVENUE */}
          <div
            onClick={() => onNavigateTab("revenue")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue (Pendapatan)</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-400 tracking-tight">
              {formatIDR(kpi.totalRevenueIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Gross Margin:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {kpi.grossMarginPct}%
              </span>
            </div>
          </div>

          {/* 2. TOTAL COST */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Mining Cost</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition">
                <Pickaxe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-400 tracking-tight">
              {formatIDR(kpi.totalCostIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Cost/Ton Coal:</span>
              <span className="font-bold text-amber-300">
                Rp {kpi.costPerTonIDR.toLocaleString("id-ID")} <span className="text-[10px] font-normal text-slate-400">/ MT</span>
              </span>
            </div>
          </div>

          {/* 3. OPEX */}
          <div
            onClick={() => onNavigateTab("opex")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Expense (OPEX)</span>
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 group-hover:scale-110 transition">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-rose-400 tracking-tight">
              {formatIDR(kpi.totalOpexIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Fuel & Contractor:</span>
              <span className="font-bold text-slate-200">
                {(((kpi.fuelCostTotalIDR + kpi.haulingCostTotalIDR) / (kpi.totalOpexIDR || 1)) * 100).toFixed(0)}% of OPEX
              </span>
            </div>
          </div>

          {/* 4. CAPEX */}
          <div
            onClick={() => onNavigateTab("capex")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CAPEX Investment</span>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-indigo-400 tracking-tight">
              {formatIDR(kpi.totalCapexIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Fleet & Infrastructure:</span>
              <span className="font-bold text-indigo-300">3 Capital Projects</span>
            </div>
          </div>

          {/* 5. BUDGET */}
          <div
            onClick={() => onNavigateTab("budget")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Budget Allocation</span>
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-cyan-400 tracking-tight">
              {formatIDR(kpi.totalBudgetIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Cost Centers:</span>
              <span className="font-bold text-slate-200">8 Active Departs</span>
            </div>
          </div>

          {/* 6. ACTUAL */}
          <div
            onClick={() => onNavigateTab("budget")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Spend</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-300 tracking-tight">
              {formatIDR(kpi.totalActualIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Budget Variance:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${kpi.budgetVarianceIDR <= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"}`}>
                {kpi.budgetVariancePct}% ({formatIDR(kpi.budgetVarianceIDR)})
              </span>
            </div>
          </div>

          {/* 7. CASH FLOW */}
          <div
            onClick={() => onNavigateTab("cash-flow")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cash Flow & Balance</span>
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 group-hover:scale-110 transition">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-teal-400 tracking-tight">
              {formatIDR(kpi.cashBalanceIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Net Working Capital:</span>
              <span className="font-bold text-teal-300">
                AR: {formatIDR(kpi.accountsReceivableIDR)}
              </span>
            </div>
          </div>

          {/* 8. PROFIT */}
          <div
            onClick={() => onNavigateTab("profit-loss")}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating & Net Profit</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-300 tracking-tight">
              {formatIDR(kpi.operatingProfitIDR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>EBITDA Margin:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {kpi.ebitdaMarginPct}% ({formatIDR(kpi.ebitdaIDR)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MINING COST BREAKDOWN (Cost/ton, Cost/BCM, Fuel cost, Maintenance cost, Hauling cost, Labor cost) */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Pickaxe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Mining Cost Structure & Unit Cost Indices
              </h3>
              <p className="text-xs text-slate-400">
                Rincian Biaya Tambang: Cost/Ton, Cost/BCM, Fuel, Maintenance, Hauling & Labor
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("cost-per-ton")}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Analisis Detail Pit & Equipment <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
          {/* 1. COST / TON */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Cost / Ton Coal</span>
              <span className="text-rose-400 flex items-center text-[10px]">
                <ArrowUpRight className="w-3 h-3" /> +{costPerTonDiff.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-black text-amber-400">
              Rp {kpi.costPerTonIDR.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-400"> /MT</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Target Plan: Rp {(kpi.costPerTonBaselineIDR || 78500).toLocaleString("id-ID")}
            </div>
          </div>

          {/* 2. COST / BCM */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Cost / BCM OB</span>
              <span className="text-rose-400 flex items-center text-[10px]">
                <ArrowUpRight className="w-3 h-3" /> +{costPerBCMDiff.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-black text-cyan-400">
              Rp {kpi.costPerBCMIDR.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-400"> /BCM</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Target Plan: Rp {(kpi.costPerBCMBaselineIDR || 21500).toLocaleString("id-ID")}
            </div>
          </div>

          {/* 3. FUEL COST */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Fuel Cost</span>
              </div>
              <span className="text-amber-400 text-[10px]">B35 Diesel</span>
            </div>
            <div className="text-xl font-black text-white">
              {formatIDR(kpi.fuelCostTotalIDR)}
            </div>
            <div className="text-[10px] text-slate-500">
              Ratio: ~0.74 Liter / BCM
            </div>
          </div>

          {/* 4. MAINTENANCE COST */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-rose-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-rose-400" />
                <span>Maintenance</span>
              </div>
              <span className="text-rose-400 text-[10px]">+18.2%</span>
            </div>
            <div className="text-xl font-black text-white">
              {formatIDR(kpi.maintenanceCostTotalIDR)}
            </div>
            <div className="text-[10px] text-slate-500">
              Workshop & Parts Fleet
            </div>
          </div>

          {/* 5. HAULING COST */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hauling Cost</span>
              </div>
              <span className="text-indigo-400 text-[10px]">5.0 KM</span>
            </div>
            <div className="text-xl font-black text-white">
              {formatIDR(kpi.haulingCostTotalIDR)}
            </div>
            <div className="text-[10px] text-slate-500">
              Contractor & Road Maint.
            </div>
          </div>

          {/* 6. LABOR COST */}
          <div
            onClick={() => onNavigateTab("cost-per-ton")}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-teal-500/40 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Labor Cost</span>
              </div>
              <span className="text-teal-400 text-[10px]">Shift 1-3</span>
            </div>
            <div className="text-xl font-black text-white">
              {formatIDR(kpi.laborCostTotalIDR)}
            </div>
            <div className="text-[10px] text-slate-500">
              Operator Gaji & Lembur
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BUDGET VS ACTUAL WATERFALL & AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget vs Actual Visual Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Budget vs Actual Spend per Komponen Biaya</h3>
            </div>
            <button
              onClick={() => onNavigateTab("budget")}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Lihat Detail Budget <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { category: "BBM Diesel B35 Fuel", budget: 1800000000, actual: kpi.fuelCostTotalIDR, pct: Math.round((kpi.fuelCostTotalIDR / 1800000000) * 100) },
              { category: "Maintenance & Spare Parts Fleet", budget: 850000000, actual: kpi.maintenanceCostTotalIDR, pct: Math.round((kpi.maintenanceCostTotalIDR / 850000000) * 100) },
              { category: "Contractor Mining & Overburden Removal", budget: 5200000000, actual: kpi.haulingCostTotalIDR, pct: Math.round((kpi.haulingCostTotalIDR / 5200000000) * 100) },
              { category: "Gaji & Tenaga Kerja Operator", budget: 900000000, actual: kpi.laborCostTotalIDR, pct: Math.round((kpi.laborCostTotalIDR / 900000000) * 100) },
              { category: "HSE, Lingkungan & Reklamasi", budget: 450000000, actual: 420000000, pct: 93 },
            ].map((item, idx) => {
              const isOver = item.actual > item.budget;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.category}</span>
                    <span className="text-slate-400 font-mono">
                      {formatIDR(item.actual)} / {formatIDR(item.budget)}{" "}
                      <span className={`font-bold ${isOver ? "text-rose-400" : "text-emerald-400"}`}>
                        ({item.pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? "bg-rose-500" : item.pct > 90 ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Financial Insights List */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <h3 className="text-sm font-bold text-white">AI Financial Insights</h3>
            </div>
            <button
              onClick={() => onNavigateTab("ai-insight")}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Open AI <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {insights.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab("ai-insight")}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                      item.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400"
                        : item.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {item.severity} • {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.confidencePct}% Conf.</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.finding}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: AI Automated Analysis for "Apa penyebab mining cost naik bulan ini?" */}
      {showAutoAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-4xl rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">AI COST DIAGNOSTICS</span>
                    <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-300 font-black rounded border border-rose-500/30">
                      COST SURGE +8.41%
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Hasil Analisis Otomatis: Penyebab Kenaikan Mining Cost Bulan Ini
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowAutoAnalysisModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>

            {/* Metrics Comparison */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cost / Ton Coal</div>
                <div className="text-lg font-black text-amber-400 mt-1">
                  Rp 85.100 <span className="text-xs font-normal text-slate-500">vs Rp 78.500</span>
                </div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">+8.41% vs Baseline</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cost / BCM OB</div>
                <div className="text-lg font-black text-cyan-400 mt-1">
                  Rp 23.200 <span className="text-xs font-normal text-slate-500">vs Rp 21.500</span>
                </div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">+7.91% vs Baseline</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Cost Variance</div>
                <div className="text-lg font-black text-rose-400 mt-1">+Rp 1,38 M</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Kenaikan Total Bulan Ini</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">AI Diagnosis Accuracy</div>
                <div className="text-lg font-black text-emerald-400 mt-1">94.8%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Multi-Telemetry Correlated</div>
              </div>
            </div>

            {/* Root Cause Factors Decomposition */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                4 Faktor Utama Penyebab Kenaikan Biaya Tambang (Weighted Decomposition)
              </h4>

              <div className="space-y-2.5">
                {[
                  {
                    title: "1. Kenaikan Konsumsi Fuel BBM (+41.8% Kontribusi)",
                    cost: "+Rp 580 Juta",
                    desc: "Jarak angkut (hauling distance) dari Pit 1 South ke West Disposal Area bertambah +1.8 km (dari 3.2 km menjadi 5.0 km), meningkatkan konsumsi fuel fleet dump truck dari 0.65 L/BCM menjadi 0.74 L/BCM.",
                    action: "Buka jalur intermediate dump in-pit di Pit 1 RL +30 (Estimasi penghematan: Rp 350 Juta/bln).",
                    badge: "FUEL SURGE",
                    color: "border-amber-500/40 bg-amber-500/5",
                  },
                  {
                    title: "2. Unscheduled Maintenance & Part Rebuild (+28.1% Kontribusi)",
                    cost: "+Rp 390 Juta",
                    desc: "Kerusakan seal hidrolik mendadak dan kebocoran boom cylinder Excavator Komatsu PC1250 EX-204 yang membutuhkan emergency parts replacement via expedited air freight.",
                    action: "Terapkan schedule oil sampling audit dan check kontaminasi pelumas tiap 250 SMU.",
                    badge: "FLEET BREAKDOWN",
                    color: "border-rose-500/40 bg-rose-500/5",
                  },
                  {
                    title: "3. Kondisi Jalan Licin & Cycle Time Berkurang (+18.0% Kontribusi)",
                    cost: "+Rp 250 Juta",
                    desc: "Curah hujan tinggi pada minggu ke-2 Agustus menyebabkan degradasi jalan tambang KM 12-14. Kecepatan rata-rata hauling turun dari 24 km/jam menjadi 16 km/jam, memperpanjang cycle time sebesar 18%.",
                    action: "Tingkatkan intensitas motor grader dan lapisi batu split (macadam) di segmen KM 12.",
                    badge: "HAUL ROAD WEATHER",
                    color: "border-indigo-500/40 bg-indigo-500/5",
                  },
                  {
                    title: "4. Jam Lembur Tenaga Kerja Shift 2 & 3 (+12.1% Kontribusi)",
                    cost: "+Rp 166 Juta",
                    desc: "Penambahan 140 jam lembur operator dan mekanik di shift malam untuk mengejar ketertinggalan volume overburden pasca rain stoppage.",
                    action: "Optimalkan dispatch matching ratio saat cuaca cerah tanpa lembur berlebih.",
                    badge: "LABOR OVERTIME",
                    color: "border-teal-500/40 bg-teal-500/5",
                  },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${item.color} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-rose-400">{item.cost}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                    <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Rekomendasi Aksi: {item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Total potensi efisiensi perbaikan: <strong className="text-emerald-400 font-mono">Rp 815 Juta / bulan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAutoAnalysisModal(false);
                    onNavigateTab("cost-per-ton");
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Buka Mining Cost Analytics
                </button>
                <button
                  onClick={() => {
                    setShowAutoAnalysisModal(false);
                    onNavigateTab("ai-insight");
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
                >
                  Tanyakan AI Advisor Lebih Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
