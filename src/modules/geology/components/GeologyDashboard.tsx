// MINE SMART AI - Geology Executive Dashboard

import React from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Flame,
  FileCheck2,
  Sparkles,
  Bot,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { Borehole, CoalQualityProfile } from "../../../types/geologyTypes";

interface GeologyDashboardProps {
  boreholes: Borehole[];
  qualities: CoalQualityProfile[];
  onNavigateSubRoute: (route: string) => void;
  onOpenAI: () => void;
}

export const GeologyDashboard: React.FC<GeologyDashboardProps> = ({
  boreholes,
  qualities,
  onNavigateSubRoute,
  onOpenAI,
}) => {
  const totalBoreholes = boreholes.length;
  const activeBoreholes = boreholes.filter((b) => b.status === "DRILLING").length;
  const completedBoreholes = boreholes.filter((b) => b.status === "COMPLETED" || b.status === "VALIDATED").length;
  const validatedBoreholes = boreholes.filter((b) => b.validationStatus === "VALID").length;
  const warningBoreholes = boreholes.filter((b) => b.validationStatus === "WARNING" || b.validationStatus === "INVALID").length;

  const validatedPct = totalBoreholes > 0 ? Math.round((validatedBoreholes / totalBoreholes) * 100) : 100;

  // Coal Quality Averages
  const avgCV = qualities.length > 0 ? Math.round(qualities.reduce((a, b) => a + b.calorificValueAdbKcal, 0) / qualities.length) : 6215;
  const avgAsh = qualities.length > 0 ? (qualities.reduce((a, b) => a + b.ashContentAdb, 0) / qualities.length).toFixed(1) : "6.1";
  const avgTS = qualities.length > 0 ? (qualities.reduce((a, b) => a + b.totalSulfurAdb, 0) / qualities.length).toFixed(2) : "0.60";
  const avgTM = qualities.length > 0 ? (qualities.reduce((a, b) => a + b.totalMoistureAr, 0) / qualities.length).toFixed(1) : "14.8";

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Boreholes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Boreholes</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalBoreholes}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              {completedBoreholes} Selesai & Valid
            </span>
          </div>
        </div>

        {/* Active Drilling */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Boreholes</span>
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-sky-400">{activeBoreholes}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Proses Pengeboran Rig</span>
          </div>
        </div>

        {/* Total Samples & Assays */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Assay Records</span>
            <FlaskConical className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-300">48</div>
            <span className="text-[11px] text-purple-400 mt-1 block">Sampel Ter-analisis Lab</span>
          </div>
        </div>

        {/* Seams Identified */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Seam Count</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-300">3 Seam</div>
            <span className="text-[11px] text-amber-400 mt-1 block">Seam A, B, C Utama</span>
          </div>
        </div>

        {/* Validation % */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Data Completeness</span>
            <FileCheck2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-teal-300">{validatedPct}%</div>
            <span className="text-[11px] text-teal-400 mt-1 block">Kelengkapan Log & QC</span>
          </div>
        </div>

        {/* Records Requiring QC */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">QC Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400">{warningBoreholes}</div>
            <span className="text-[11px] text-amber-300 mt-1 block">Perlu Verifikasi Geologist</span>
          </div>
        </div>
      </div>

      {/* AI Geological Insight Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-32 h-32 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Geological Intelligence Insight</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Sistem Mendeteksi Kesinambungan Seam Sangatta A dengan Tebal Rata-rata 12.4 Metres
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Analisis korelasi 24 titik bor menunjukkan kelangsungan lapisan batubara Seam A sangat stabil dari Pit 1 South hingga perbatasan Pit 2 North dengan kemiringan rata-rata 10°. Kualitas batubara tergolong High-CV Premium Export (6,250 kcal/kg, TS 0.58%).
            </p>
          </div>
          <button
            onClick={onOpenAI}
            className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/50 whitespace-nowrap cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Tanya AI Geologi</span>
          </button>
        </div>
      </div>

      {/* Summary Charts & Quality Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coal Quality Summary Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Rata-rata Kualitas Batubara (ADB)
              </h3>
              <button
                onClick={() => onNavigateSubRoute("/geology/coal-quality")}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Calorific Value (CV)</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">{avgCV} kcal/kg</div>
                <span className="text-[10px] text-emerald-500/80">High CV Grade</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Ash Content (Ash)</span>
                <div className="text-lg font-bold text-amber-300 mt-1">{avgAsh} %</div>
                <span className="text-[10px] text-amber-500/80">Low Ash Content</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Total Sulfur (TS)</span>
                <div className="text-lg font-bold text-sky-300 mt-1">{avgTS} %</div>
                <span className="text-[10px] text-sky-500/80">Low Sulfur Spec</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Total Moisture (TM)</span>
                <div className="text-lg font-bold text-teal-300 mt-1">{avgTM} %</div>
                <span className="text-[10px] text-teal-500/80">As-Received</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Standar Analisis: ASTM D3172/3175</span>
            <span className="text-emerald-400 font-semibold">ISO 17025 Accredited</span>
          </div>
        </div>

        {/* Stratigraphic Seam Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Ringkasan Seam Batubara
            </h3>
            <button
              onClick={() => onNavigateSubRoute("/geology/seams")}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Semua Seam</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-white">Seam Sangatta A (Main)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Tebal: 12.4m | Dip: 10°</span>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                EXPORT GRADE
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="text-xs font-bold text-white">Seam Sangatta B (Upper)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Tebal: 4.2m | Dip: 10°</span>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                HIGH CV
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span className="text-xs font-bold text-white">Seam Sangatta C (Deep)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Tebal: 6.8m | Dip: 12°</span>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                MEDIUM CV
              </span>
            </div>
          </div>
        </div>

        {/* Recent Borehole Activity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Aktivitas Pengeboran Terbaru
            </h3>
            <button
              onClick={() => onNavigateSubRoute("/geology/boreholes")}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Bor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {boreholes.slice(0, 3).map((bh) => (
              <div key={bh.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{bh.boreholeCode}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      bh.status === "VALIDATED" ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/20 text-sky-400"
                    }`}>
                      {bh.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {bh.pitName} | Actual Depth: {bh.actualDepth}m ({bh.drillingType})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{bh.startDate}</span>
                  <span className="text-[10px] font-semibold text-emerald-400">{bh.contractor.split(" ")[1] || bh.contractor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
