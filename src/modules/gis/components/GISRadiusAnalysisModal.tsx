// MINE SMART AI - GIS Spatial Radius Analysis Modal

import React, { useState } from "react";
import { X, Circle, Search, Truck, Pickaxe, Mountain, ShieldAlert, Check } from "lucide-react";
import { SpatialEntity, LatLng } from "../types/gisTypes";
import { GISService } from "../../../services/gis/GISService";

interface GISRadiusAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: SpatialEntity[];
  onApplyRadiusFilter: (center: LatLng, radiusMeters: number) => void;
  onClearRadiusFilter: () => void;
}

export const GISRadiusAnalysisModal: React.FC<GISRadiusAnalysisModalProps> = ({
  isOpen,
  onClose,
  entities,
  onApplyRadiusFilter,
  onClearRadiusFilter,
}) => {
  if (!isOpen) return null;

  const [selectedCenterId, setSelectedCenterId] = useState<string>(entities[0]?.id || "");
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);
  const [nearbyResults, setNearbyResults] = useState<SpatialEntity[]>([]);

  const centerEntity = entities.find((e) => e.id === selectedCenterId) || entities[0];

  const handleRunAnalysis = () => {
    if (!centerEntity) return;

    const results = GISService.findNearbyObjects(
      entities,
      centerEntity.centerCoordinates,
      radiusMeters
    );

    setNearbyResults(results);
    setAnalysisDone(true);
    onApplyRadiusFilter(centerEntity.centerCoordinates, radiusMeters);
  };

  const handleReset = () => {
    setAnalysisDone(false);
    setNearbyResults([]);
    onClearRadiusFilter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Circle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Analisis Proksimitas Spasial Radius (Buffer)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hitung populasi fleet, jalan, & hazard dalam jangkauan radius buffer dari titik acuan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* Select Center Point */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Pilih Titik Pusat Acuan (Center Coordinate):
            </label>
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
            >
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  [{e.type}] {e.name} ({e.rlElevation})
                </option>
              ))}
            </select>
          </div>

          {/* Radius Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-xs">
              <span className="text-slate-900 dark:text-white">Jarak Radius Buffer:</span>
              <span className="text-teal-500 font-mono text-sm">
                {radiusMeters.toLocaleString()} Meter ({radiusMeters / 1000} km)
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(parseInt(e.target.value))}
              className="w-full accent-teal-500 h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>100m</span>
              <span>1,000m</span>
              <span>2,500m</span>
              <span>5,000m</span>
            </div>
          </div>

          {/* Analysis Results Summary */}
          {analysisDone && (
            <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/10 space-y-3">
              <div className="flex items-center justify-between font-extrabold text-teal-600 dark:text-teal-400">
                <span>Hasil Radius Analysis</span>
                <span>{nearbyResults.length} Objek Terdeteksi</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block">Active Equipment:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {nearbyResults.filter((e) => e.type === "EQUIPMENT").length} Unit
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block">Hazard & GeoFence:</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {nearbyResults.filter((e) => e.type === "GEOFENCE" || e.status === "HAZARD").length} Zone
                  </span>
                </div>
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Daftar Objek Dalam Radius:
                </span>
                {nearbyResults.map((e) => (
                  <div
                    key={e.id}
                    className="p-1.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-semibold text-slate-200">{e.name}</span>
                    <span className="font-mono text-[10px] text-teal-400">{e.code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
          >
            Reset Filter
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleRunAnalysis}
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Search className="h-4 w-4" />
              <span>Jalankan Radius Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
