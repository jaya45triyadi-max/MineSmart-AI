// MINE SMART AI - Geology Module Header Component

import React from "react";
import {
  Layers,
  Plus,
  FileSpreadsheet,
  ShieldCheck,
  Eye,
  Download,
  Bot,
  Database,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react";

interface GeologyHeaderProps {
  onAddBorehole: () => void;
  onImportData: () => void;
  onRunQC: () => void;
  onVisualize: () => void;
  onExport: () => void;
  onOpenAI: () => void;
  activeDatabaseVersion: string;
}

export const GeologyHeader: React.FC<GeologyHeaderProps> = ({
  onAddBorehole,
  onImportData,
  onRunQC,
  onVisualize,
  onExport,
  onOpenAI,
  activeDatabaseVersion,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and Metadata Badges */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Geology & Geological Intelligence Center
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {activeDatabaseVersion}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat Intelijen Geologi, Pengeboran, Model Stratigrafi, Assay Lab & Quality Control Batubara
              </p>
            </div>
          </div>

          {/* Site Context Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perusahaan:</span>
              <span className="font-semibold text-white">PT Kaltim Coal Mining</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Site / Pit:</span>
              <span className="font-semibold text-white">Sangatta Block / Pit 1 South</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Periode Data:</span>
              <span className="font-semibold text-white">Q1 - Q3 2026</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddBorehole}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Borehole</span>
          </button>

          <button
            onClick={onImportData}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import</span>
          </button>

          <button
            onClick={onRunQC}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Run QC</span>
          </button>

          <button
            onClick={onVisualize}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Visualize</span>
          </button>

          <button
            onClick={onExport}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenAI}
            className="px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-teal-900/30 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-teal-200 animate-pulse" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
