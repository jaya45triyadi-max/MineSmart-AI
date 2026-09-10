// MINE SMART AI - GIS Header & Control Bar Component
// Menyediakan kontrol basemap, 8 Map Tools analisis spasial, dan filter Live Equipment

import React from "react";
import {
  Map,
  Sparkles,
  Layers,
  Ruler,
  Maximize2,
  Download,
  Upload,
  Search,
  Compass,
  Circle,
  Activity,
  Box,
  MapPin,
  TrendingUp,
  Truck,
  RotateCcw,
} from "lucide-react";
import { BasemapType, MeasurementMode, EquipmentCategory } from "../types/gisTypes";
import { useAuth } from "../../../providers/AuthProvider";

interface GISHeaderProps {
  basemap: BasemapType;
  onSelectBasemap: (basemap: BasemapType) => void;
  measurementMode: MeasurementMode;
  onSelectMeasurementMode: (mode: MeasurementMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEquipmentType: string;
  onSelectEquipmentType: (cat: string) => void;
  bufferRadius: number;
  onChangeBufferRadius: (radius: number) => void;
  onOpenRadiusModal: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onOpenAICopilot: () => void;
  onFitAllBounds: () => void;
  onClearMeasurement: () => void;
}

export const GISHeader: React.FC<GISHeaderProps> = ({
  basemap,
  onSelectBasemap,
  measurementMode,
  onSelectMeasurementMode,
  searchQuery,
  onSearchChange,
  selectedEquipmentType,
  onSelectEquipmentType,
  bufferRadius,
  onChangeBufferRadius,
  onOpenRadiusModal,
  onOpenImportModal,
  onOpenExportModal,
  onOpenAICopilot,
  onFitAllBounds,
  onClearMeasurement,
}) => {
  const { activeSite } = useAuth();

  const equipmentFilters: { key: string; label: string; icon: string }[] = [
    { key: "ALL", label: "Semua Fleet", icon: "🚜" },
    { key: "EXCAVATOR", label: "Excavator", icon: "🚜" },
    { key: "DUMP_TRUCK", label: "Dump Truck", icon: "🚚" },
    { key: "DOZER", label: "Dozer", icon: "🚜" },
    { key: "GRADER", label: "Grader", icon: "🚜" },
    { key: "WATER_TRUCK", label: "Water Truck", icon: "💦" },
    { key: "LIGHT_VEHICLE", label: "Light Vehicle (LV)", icon: "🚙" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-sm backdrop-blur-md">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-500/10 dark:bg-teal-500/20 px-2 py-0.5 text-[10px] font-extrabold text-teal-600 dark:text-teal-400 border border-teal-500/30 uppercase tracking-wider">
              GIS / MINING MAP
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {activeSite?.name || "Sangatta Coal Mine Site A"} (UTM Zone 50S)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
            <Map className="h-6 w-6 text-teal-500" />
            Peta Tambang Interaktif & GIS Intelligence
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Copilot Spasial</span>
          </button>

          <button
            onClick={onOpenRadiusModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Circle className="h-4 w-4 text-sky-500" />
            <span className="hidden sm:inline">Analisis Radius</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Upload className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">Import GeoJSON/DXF</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span className="hidden sm:inline">Export Peta</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search, Basemaps, and Fit Bounds */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari Pit, Block, Seam, Hauling Road, Crusher, Stockpile, Unit Alat, BM..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="px-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:inline">
              Basemap:
            </span>
            {(["SATELLITE", "TERRAIN", "STREET", "DARK"] as BasemapType[]).map((b) => (
              <button
                key={b}
                onClick={() => onSelectBasemap(b)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  basemap === b
                    ? "bg-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={onFitAllBounds}
            className="flex items-center gap-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer text-xs font-bold"
            title="Reset Zoom & Fit All Bounds"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Fit Bounds</span>
          </button>
        </div>
      </div>

      {/* Row 3: 8 Map Tools Suite (Distance, Area, Elevation, Coordinate, Volume, Polygon, Buffer, Measurement) */}
      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Ruler className="h-3.5 w-3.5" /> Map Tools:
          </span>

          {/* 1. Distance */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "DISTANCE" ? "NONE" : "DISTANCE")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "DISTANCE"
                ? "bg-sky-500 border-sky-400 text-white shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Ruler className="h-3 w-3" />
            <span>Distance (Jarak)</span>
          </button>

          {/* 2. Area */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "AREA" ? "NONE" : "AREA")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "AREA"
                ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Area (Luas)</span>
          </button>

          {/* 3. Elevation */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "ELEVATION" ? "NONE" : "ELEVATION")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "ELEVATION"
                ? "bg-amber-500 border-amber-400 text-slate-950 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            <span>Elevation (Profil RL)</span>
          </button>

          {/* 4. Coordinate */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "COORDINATE" ? "NONE" : "COORDINATE")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "COORDINATE"
                ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="h-3 w-3" />
            <span>Coordinate (UTM)</span>
          </button>

          {/* 5. Volume */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "VOLUME" ? "NONE" : "VOLUME")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "VOLUME"
                ? "bg-purple-500 border-purple-400 text-white shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Box className="h-3 w-3" />
            <span>Volume (Cut/Fill)</span>
          </button>

          {/* 6. Polygon */}
          <button
            onClick={() => onSelectMeasurementMode(measurementMode === "POLYGON" ? "NONE" : "POLYGON")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              measurementMode === "POLYGON"
                ? "bg-teal-500 border-teal-400 text-slate-950 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="h-3 w-3" />
            <span>Polygon</span>
          </button>

          {/* 7. Buffer */}
          <div className="flex items-center">
            <button
              onClick={() => onSelectMeasurementMode(measurementMode === "BUFFER" ? "NONE" : "BUFFER")}
              className={`px-2.5 py-1 rounded-l-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                measurementMode === "BUFFER"
                  ? "bg-red-500 border-red-400 text-white shadow-sm"
                  : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Circle className="h-3 w-3" />
              <span>Buffer</span>
            </button>
            <select
              value={bufferRadius}
              onChange={(e) => onChangeBufferRadius(Number(e.target.value))}
              className="bg-slate-200 dark:bg-slate-800 border-y border-r border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs px-1.5 py-1 rounded-r-lg font-bold"
            >
              <option value={50}>50m</option>
              <option value={100}>100m</option>
              <option value={300}>300m</option>
              <option value={500}>500m</option>
              <option value={1000}>1000m</option>
            </select>
          </div>

          {/* 8. Clear / Reset Measurement */}
          {measurementMode !== "NONE" && (
            <button
              onClick={onClearMeasurement}
              className="px-2 py-1 rounded-lg text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 4: Live Equipment Map Filter (Excavator, Dump Truck, Dozer, Grader, Water Truck, Light Vehicle) */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-pink-500 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Truck className="h-3.5 w-3.5" /> Live Fleet:
          </span>

          {equipmentFilters.map((flt) => (
            <button
              key={flt.key}
              onClick={() => onSelectEquipmentType(flt.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedEquipmentType === flt.key
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{flt.icon}</span>
              <span>{flt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
            GPS Telemetry 100% Online
          </span>
        </div>
      </div>
    </div>
  );
};
