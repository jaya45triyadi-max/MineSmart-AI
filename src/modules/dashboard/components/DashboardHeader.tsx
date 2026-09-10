// MINE SMART AI - Dashboard Header Component

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  Sparkles,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";
import { DateRangeFilter, ShiftFilter } from "../../../services/dashboard/DashboardAnalyticsService";
import { MULTI_COMPANIES_DATA } from "../../../data/multiCompanyData";

interface DashboardHeaderProps {
  companyName: string;
  selectedCompanyId: string;
  onCompanyChange: (companyId: string) => void;
  siteName: string;
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  availableSites: Array<{ id: string; name: string }>;
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  shift: ShiftFilter;
  onShiftChange: (shift: ShiftFilter) => void;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefreshInterval: number; // 0 = Manual, 30 = 30s, 60 = 1m, 300 = 5m
  onAutoRefreshIntervalChange: (intervalSec: number) => void;
  onOpenExecutiveReport: () => void;
  onOpenAICopilot: () => void;
  onOpenCustomizer: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  companyName,
  selectedCompanyId,
  onCompanyChange,
  siteName,
  selectedSiteId,
  onSiteChange,
  availableSites,
  dateRange,
  onDateRangeChange,
  shift,
  onShiftChange,
  lastUpdated,
  isRefreshing,
  onRefresh,
  autoRefreshInterval,
  onAutoRefreshIntervalChange,
  onOpenExecutiveReport,
  onOpenAICopilot,
  onOpenCustomizer,
}) => {
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showSiteMenu, setShowSiteMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showShiftMenu, setShowShiftMenu] = useState(false);
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);

  const dateOptions: DateRangeFilter[] = ["Today", "Yesterday", "This Week", "This Month", "Custom"];
  const shiftOptions: ShiftFilter[] = ["All Shift", "Shift 1", "Shift 2", "Shift 3", "Day Shift", "Night Shift"];

  const companyList = MULTI_COMPANIES_DATA.map((c) => ({
    id: c.id,
    name: c.displayName,
    commodity: c.commodityLabel,
  }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl transition-all">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" />
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Mining Operations Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Ekosistem Intelijen Operasional Tambang Terpadu & Analytic Real-Time
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            title="Kustomisasi Widget Dashboard"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Kustom Widget</span>
          </button>

          <button
            onClick={onOpenExecutiveReport}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>Laporan Eksekutif</span>
          </button>

          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-300 animate-bounce" />
            <span>Tanyakan AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Global Filters Control Bar */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Company Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCompanyMenu(!showCompanyMenu);
                setShowSiteMenu(false);
                setShowDateMenu(false);
                setShowShiftMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="truncate max-w-[150px] sm:max-w-[180px]">{companyName}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </button>

            {showCompanyMenu && (
              <div className="absolute left-0 mt-1 z-30 w-56 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Perusahaan Tambang
                </div>
                {companyList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onCompanyChange(c.id);
                      setShowCompanyMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      selectedCompanyId === c.id ? "text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-300"
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {selectedCompanyId === c.id && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Site Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSiteMenu(!showSiteMenu);
                setShowCompanyMenu(false);
                setShowDateMenu(false);
                setShowShiftMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{siteName}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </button>

            {showSiteMenu && (
              <div className="absolute left-0 mt-1 z-30 w-60 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Site Operasional
                </div>
                <button
                  onClick={() => {
                    onSiteChange("ALL_SITES");
                    setShowSiteMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    selectedSiteId === "ALL_SITES" ? "text-cyan-400 font-bold bg-cyan-500/10" : "text-slate-300"
                  }`}
                >
                  <span>Semua Site (Consolidated)</span>
                  {selectedSiteId === "ALL_SITES" && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
                {availableSites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      onSiteChange(site.id);
                      setShowSiteMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      selectedSiteId === site.id ? "text-cyan-400 font-bold bg-cyan-500/10" : "text-slate-300"
                    }`}
                  >
                    <span className="truncate">{site.name}</span>
                    {selectedSiteId === site.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateMenu(!showDateMenu);
                setShowCompanyMenu(false);
                setShowSiteMenu(false);
                setShowShiftMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>{dateRange}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </button>

            {showDateMenu && (
              <div className="absolute left-0 mt-1 z-30 w-44 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rentang Waktu
                </div>
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onDateRangeChange(opt);
                      setShowDateMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      dateRange === opt ? "text-amber-400 font-bold bg-amber-500/10" : "text-slate-300"
                    }`}
                  >
                    <span>{opt}</span>
                    {dateRange === opt && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shift Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowShiftMenu(!showShiftMenu);
                setShowCompanyMenu(false);
                setShowSiteMenu(false);
                setShowDateMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              <span>Shift: {shift}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </button>

            {showShiftMenu && (
              <div className="absolute left-0 mt-1 z-30 w-44 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Filter Shift Operasional
                </div>
                {shiftOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onShiftChange(s);
                      setShowShiftMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      shift === s ? "text-violet-400 font-bold bg-violet-500/10" : "text-slate-300"
                    }`}
                  >
                    <span>{s}</span>
                    {shift === s && <Check className="h-3.5 w-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Freshness & Manual/Auto Refresh */}
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span>Pembaruan Terakhir:</span>
            <span className="font-semibold text-slate-200">{lastUpdated}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRefreshMenu(!showRefreshMenu)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold border border-slate-700 flex items-center gap-1"
            >
              <span>
                {autoRefreshInterval === 0
                  ? "Manual Refresh"
                  : autoRefreshInterval < 60
                  ? `${autoRefreshInterval}s`
                  : `${autoRefreshInterval / 60}m`}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRefreshMenu && (
              <div className="absolute right-0 mt-1 z-30 w-40 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Interval Auto Refresh
                </div>
                {[
                  { label: "Manual", sec: 0 },
                  { label: "30 Detik", sec: 30 },
                  { label: "1 Menit", sec: 60 },
                  { label: "5 Menit", sec: 300 },
                ].map((item) => (
                  <button
                    key={item.sec}
                    onClick={() => {
                      onAutoRefreshIntervalChange(item.sec);
                      setShowRefreshMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 rounded-lg flex items-center justify-between text-xs hover:bg-slate-800 ${
                      autoRefreshInterval === item.sec ? "text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-300"
                    }`}
                  >
                    <span>{item.label}</span>
                    {autoRefreshInterval === item.sec && <Check className="h-3 w-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Segarkan Data Dashboard"
          >
            <RefreshCw className={`h-4 w-4 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
