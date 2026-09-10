// MINE SMART AI - Survey Command Center Dashboard

import React from "react";
import {
  Compass,
  Layers,
  MapPin,
  Ruler,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Box,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import {
  SurveyPoint,
  SurveySurface,
  CutFillAnalysis,
  VolumeCalculation,
  SurveyQCIssue,
} from "../../../types/surveyTypes";

interface SurveyDashboardProps {
  points: SurveyPoint[];
  surfaces: SurveySurface[];
  cutFills: CutFillAnalysis[];
  volumes: VolumeCalculation[];
  qcIssues: SurveyQCIssue[];
  onNavigateSubRoute: (route: string) => void;
  onOpenAI: () => void;
}

export const SurveyDashboard: React.FC<SurveyDashboardProps> = ({
  points,
  surfaces,
  cutFills,
  volumes,
  qcIssues,
  onNavigateSubRoute,
  onOpenAI,
}) => {
  const latestCutFill = cutFills[0];
  const latestVolume = volumes[0];

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigateSubRoute("survey/points")}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Points</span>
            <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{points.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">RTK & UAV Photogrammetry</span>
        </div>

        <div
          onClick={() => onNavigateSubRoute("survey/surfaces")}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Surfaces</span>
            <Layers className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{surfaces.length}</div>
          <span className="text-[10px] text-sky-300 font-semibold mt-1 block">DTM v1 & v2 Approved</span>
        </div>

        <div
          onClick={() => onNavigateSubRoute("survey/cut-fill")}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Cut Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">148.2k BCM</div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Periode 1-12 Agustus</span>
        </div>

        <div
          onClick={() => onNavigateSubRoute("survey/volumes")}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Stockpile Coal</span>
            <Box className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">32.4k m³</div>
          <span className="text-[10px] text-amber-400 font-semibold mt-1 block">42,185 Ton (High CV)</span>
        </div>

        <div
          onClick={() => onNavigateSubRoute("survey/contours")}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Contours</span>
            <Ruler className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">342 Lines</div>
          <span className="text-[10px] text-purple-300 font-semibold mt-1 block">1m / 5m Major Grid</span>
        </div>

        <div
          onClick={() => onNavigateSubRoute("survey/qc")}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Pending QC</span>
            <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{qcIssues.length}</div>
          <span className="text-[10px] text-amber-300 font-semibold mt-1 block">Warnings to Review</span>
        </div>
      </div>

      {/* Center Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Surface & Cut/Fill Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Surface & Cut-Fill Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Kemajuan Tambang & Analisis Perubahan Surface (Cut & Fill)
              </h3>
              <button
                onClick={() => onNavigateSubRoute("survey/cut-fill")}
                className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Eksplorasi Detail <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestCutFill && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Cut Volume (Galian)</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {latestCutFill.cutVolumeBcm.toLocaleString()} BCM
                  </div>
                  <span className="text-[10px] text-emerald-300">Overburden Pit 1 South</span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-sky-500/30 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Fill Volume (Timbunan)</span>
                  <div className="text-xl font-bold text-sky-300 font-mono">
                    {latestCutFill.fillVolumeBcm.toLocaleString()} BCM
                  </div>
                  <span className="text-[10px] text-sky-200">Perbaikan Ramp & Slope</span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-purple-500/30 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Net Difference</span>
                  <div className="text-xl font-bold text-purple-300 font-mono">
                    {latestCutFill.netVolumeBcm.toLocaleString()} BCM
                  </div>
                  <span className="text-[10px] text-purple-200 font-bold uppercase">
                    {latestCutFill.balanceStatus}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>Surface A: Pit 1 July End (v1)</span>
                <span>Surface B: Pit 1 Mid-Aug (v2 UAV)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: "95%" }}></div>
                <div className="bg-sky-400 h-full" style={{ width: "5%" }}></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Galian Overburden (95%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Timbunan Ramp (5%)
                </span>
              </div>
            </div>
          </div>

          {/* Active Survey Projects Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                Proyek Survei Geospasial Aktif
              </span>
              <span className="text-xs text-slate-400 font-mono">Pit Sangatta & Disposal</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  code: "PRJ-SURV-2026-01",
                  name: "Pit Sangatta South Topography Survey Q3",
                  method: "GNSS RTK & Drone M300 RTK",
                  date: "2026-08-12",
                  status: "Active",
                  surveyor: "Budi Santoso, S.T.",
                },
                {
                  code: "PRJ-SURV-2026-02",
                  name: "Disposal Area 2 UAV Photogrammetry",
                  method: "Drone UAV Photogrammetry",
                  date: "2026-08-10",
                  status: "Processing",
                  surveyor: "Ahmad Dani",
                },
              ].map((prj) => (
                <div
                  key={prj.code}
                  className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{prj.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30 font-mono">
                        {prj.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Metode: {prj.method} | Surveyor: {prj.surveyor}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      prj.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {prj.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Survey Insight & QC Alerts */}
        <div className="space-y-6">
          {/* AI Survey Insight Box */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                AI Survey Intelligence Insight
              </h3>
              <button
                onClick={onOpenAI}
                className="text-[11px] font-bold text-emerald-300 hover:underline cursor-pointer"
              >
                Copilot AI
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400 block text-[11px]">
                  Analisis Volume Galian (Overburden)
                </span>
                <p>
                  Produktivitas galian minggu kedua Agustus mencapai 148,200 BCM, meningkat 4.2% dibandingkan periode survei sebelumnya.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-sky-500/20 space-y-1">
                <span className="font-bold text-sky-400 block text-[11px]">
                  Stockpile Coal Inventory Status
                </span>
                <p>
                  Volume Stockpile A tercatat 32,450 m³ (42,185 Ton). Kapasitas tersisa area stockpile mencapai 68%.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-400 block text-[11px]">
                  Peringatan Kalibrasi Alat
                </span>
                <p>
                  Total Station Leica TS16 mendekati batas sertifikat kalibrasi (20 Agustus 2026).
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAI}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tanyakan Laporan Survei Ke AI</span>
            </button>
          </div>

          {/* Survey QC Warnings */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Peringatan Quality Control ({qcIssues.length})
              </span>
              <button
                onClick={() => onNavigateSubRoute("survey/qc")}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {qcIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    issue.severity === "CRITICAL"
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-300"
                      : "bg-amber-950/30 border-amber-500/40 text-amber-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{issue.issueType}</span>
                    <span className="font-mono text-[10px]">{issue.entityCode}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
