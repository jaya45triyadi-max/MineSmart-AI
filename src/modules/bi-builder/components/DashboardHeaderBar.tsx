// MINE SMART AI - BI Dashboard Builder Header Bar
import React, { useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Sliders,
  Eye,
  Edit3,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  Layers,
  ChevronDown,
  Trash2,
  Copy,
  Sparkles,
  Maximize2,
  FileCode,
  Printer,
  Check,
} from "lucide-react";
import { CustomBIDashboard } from "../../../types/biBuilderTypes";

interface DashboardHeaderBarProps {
  dashboards: CustomBIDashboard[];
  currentDashboard: CustomBIDashboard;
  onSelectDashboard: (dashboardId: string) => void;
  onOpenNewDashboardModal: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenWidgetPalette: () => void;
  onDeleteDashboard: (dashboardId: string) => void;
  onDuplicateDashboard: (dashboard: CustomBIDashboard) => void;
  autoRefreshInterval: number;
  onSetAutoRefresh: (seconds: number) => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
}

export const DashboardHeaderBar: React.FC<DashboardHeaderBarProps> = ({
  dashboards,
  currentDashboard,
  onSelectDashboard,
  onOpenNewDashboardModal,
  isEditMode,
  onToggleEditMode,
  onOpenWidgetPalette,
  onDeleteDashboard,
  onDuplicateDashboard,
  autoRefreshInterval,
  onSetAutoRefresh,
  onExportPDF,
  onExportJSON,
}) => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("TODAY");

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Dashboard Selector & Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black shrink-0">
            <LayoutDashboard className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={currentDashboard.id}
                  onChange={(e) => onSelectDashboard(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm sm:text-base font-black text-white focus:outline-none focus:border-amber-400 cursor-pointer pr-8 max-w-[280px] sm:max-w-md truncate"
                >
                  {dashboards.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white font-medium">
                      {d.title} {d.isPreset ? "(Preset)" : "(Custom)"}
                    </option>
                  ))}
                </select>
              </div>

              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {currentDashboard.category}
              </span>

              {isEditMode && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  BUILDER MODE AKTIF
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 truncate">
              {currentDashboard.description}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="SHIFT" className="bg-slate-900">Shift 1 (06:00 - 18:00)</option>
              <option value="TODAY" className="bg-slate-900">Hari Ini (24 Jam)</option>
              <option value="7D" className="bg-slate-900">7 Hari Terakhir</option>
              <option value="MTD" className="bg-slate-900">Bulan Berjalan (MTD)</option>
              <option value="YTD" className="bg-slate-900">Tahun Berjalan (YTD)</option>
            </select>
          </div>

          {/* Auto Refresh Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${autoRefreshInterval > 0 ? "text-emerald-400 animate-spin" : "text-slate-500"}`} />
            <select
              value={autoRefreshInterval}
              onChange={(e) => onSetAutoRefresh(Number(e.target.value))}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value={0} className="bg-slate-900">Auto Refresh: Off</option>
              <option value={5} className="bg-slate-900">Refresh: Tiap 5 Detik</option>
              <option value={15} className="bg-slate-900">Refresh: Tiap 15 Detik</option>
              <option value={30} className="bg-slate-900">Refresh: Tiap 30 Detik</option>
              <option value={60} className="bg-slate-900">Refresh: Tiap 1 Menit</option>
            </select>
          </div>

          {/* Toggle Edit Mode vs Presentation Mode */}
          <button
            onClick={onToggleEditMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isEditMode
                ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Selesai Edit</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Layout</span>
              </>
            )}
          </button>

          {/* Add Widget Button (When in edit mode) */}
          {isEditMode && (
            <button
              onClick={onOpenWidgetPalette}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer animate-bounce"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Widget</span>
            </button>
          )}

          {/* New Dashboard Modal Trigger */}
          <button
            onClick={onOpenNewDashboardModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Dashboard Baru</span>
          </button>

          {/* Export / Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
              title="Menu Ekspor & Opsi Dashboard"
            >
              <Download className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                <button
                  onClick={() => {
                    onExportPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Cetak / Ekspor PDF</span>
                </button>

                <button
                  onClick={() => {
                    onExportJSON();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
                >
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>Ekspor Schema JSON</span>
                </button>

                <button
                  onClick={() => {
                    onDuplicateDashboard(currentDashboard);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Duplikasi Dashboard Ini</span>
                </button>

                {!currentDashboard.isPreset && (
                  <button
                    onClick={() => {
                      onDeleteDashboard(currentDashboard.id);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-400 flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Dashboard Ini</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
