// MINE SMART AI - Survey Header Component

import React from "react";
import {
  Compass,
  Plus,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  Download,
  FileText,
  MapPin,
  Layers,
  Ruler,
} from "lucide-react";

interface SurveyHeaderProps {
  activeCoordinateSystem: string;
  totalPoints: number;
  activeSurfaces: number;
  pendingQCCount: number;
  onNewPoint: () => void;
  onImportData: () => void;
  onRunQC: () => void;
  onOpenAI: () => void;
  onExportReport: () => void;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  activeCoordinateSystem,
  totalPoints,
  activeSurfaces,
  pendingQCCount,
  onNewPoint,
  onImportData,
  onRunQC,
  onOpenAI,
  onExportReport,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Coordinate Metadata */}
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-xl text-white shadow-lg shadow-sky-900/30">
            <Compass className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Survey & Survey Intelligence Center
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3" />
                {activeCoordinateSystem}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Pusat Manajemen Pengukuran Tambang, Pemodelan Terrain DTM/DSM, Kontur, Penampang Cross Section, Perhitungan Cut & Fill, serta Analisis Volume Berbasis AI
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNewPoint}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Point</span>
          </button>

          <button
            onClick={onImportData}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import GIS/CSV</span>
          </button>

          <button
            onClick={onRunQC}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Run QC</span>
            {pendingQCCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1"></span>
            )}
          </button>

          <button
            onClick={onOpenAI}
            className="px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Survey Copilot</span>
          </button>

          <button
            onClick={onExportReport}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-700"
            title="Eksport Laporan Survei"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Point Ukur</span>
          <span className="text-sm font-bold text-white font-mono">{totalPoints} Points</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Surface Aktif</span>
          <span className="text-sm font-bold text-sky-400 font-mono">{activeSurfaces} Model</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Volume Cut (Aug)</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">148,200 BCM</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Stockpile Coal</span>
          <span className="text-sm font-bold text-amber-300 font-mono">32,450 m³</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">UAV Resolution</span>
          <span className="text-sm font-bold text-purple-300 font-mono">5 cm GSD</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Status QC</span>
          <span className={`text-sm font-bold font-mono ${pendingQCCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {pendingQCCount > 0 ? `${pendingQCCount} Warning` : "100% Validated"}
          </span>
        </div>
      </div>
    </div>
  );
};
