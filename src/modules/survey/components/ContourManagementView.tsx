// MINE SMART AI - Contour Management & Line Generator Engine

import React, { useState } from "react";
import {
  Ruler,
  Plus,
  Sliders,
  Download,
  Eye,
  CheckCircle2,
  FileCode,
  Layers,
} from "lucide-react";
import { ContourDataset, SurveySurface } from "../../../types/surveyTypes";

interface ContourManagementViewProps {
  contours: ContourDataset[];
  surfaces: SurveySurface[];
  onAddContourSubmit: (cnt: ContourDataset) => void;
}

export const ContourManagementView: React.FC<ContourManagementViewProps> = ({
  contours,
  surfaces,
  onAddContourSubmit,
}) => {
  const [selectedSurfaceId, setSelectedSurfaceId] = useState<string>(surfaces[0]?.id || "");
  const [minorInterval, setMinorInterval] = useState<number>(1.0);
  const [majorInterval, setMajorInterval] = useState<number>(5.0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const surf = surfaces.find((s) => s.id === selectedSurfaceId) || surfaces[0];
      const newCnt: ContourDataset = {
        id: `cnt-${Date.now()}`,
        contourId: `CNT-${surf.surfaceId.slice(-4)}-${minorInterval}M`,
        surfaceId: surf.id,
        surfaceName: surf.surfaceName,
        intervalMeters: minorInterval,
        majorIntervalMeters: majorInterval,
        unit: "Meters",
        minElevation: surf.minElevation,
        maxElevation: surf.maxElevation,
        coordinateSystem: surf.coordinateSystem,
        lineCount: Math.round((surf.maxElevation - surf.minElevation) / minorInterval * 12),
        status: "Active",
        createdAt: new Date().toISOString(),
      };

      onAddContourSubmit(newCnt);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-purple-400" />
            Contour Management & Line Generation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generasi garis kontur interval teratur dari DTM/DSM surface model untuk peta topografi tambang.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-sky-400" />
            Konfigurasi Generator Kontur
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Pilih Model Surface</label>
              <select
                value={selectedSurfaceId}
                onChange={(e) => setSelectedSurfaceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {surfaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.surfaceName} ({s.version})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Interval Minor (m)</label>
                <select
                  value={minorInterval}
                  onChange={(e) => setMinorInterval(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value={0.5}>0.5 Meter</option>
                  <option value={1.0}>1.0 Meter</option>
                  <option value={2.0}>2.0 Meter</option>
                  <option value={5.0}>5.0 Meter</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Interval Major (m)</label>
                <select
                  value={majorInterval}
                  onChange={(e) => setMajorInterval(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value={2.0}>2.0 Meter</option>
                  <option value={5.0}>5.0 Meter</option>
                  <option value={10.0}>10.0 Meter</option>
                  <option value={25.0}>25.0 Meter</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-sky-400 block">Aturan Pewarnaan Garis:</span>
              <p>• Garis Major ({majorInterval}m): Warna Merah Tebal dengan Label RL Elevasi.</p>
              <p>• Garis Minor ({minorInterval}m): Warna Oranye Tipis tanpa label.</p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
            >
              <Ruler className="w-4 h-4" />
              <span>{isGenerating ? "Mengkalkulasi Kontur..." : "Generate Garis Kontur Baru"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Contour Datasets */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Dataset Garis Kontur Aktif ({contours.length})
            </span>
          </h3>

          <div className="space-y-3">
            {contours.map((cnt) => (
              <div
                key={cnt.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-mono">
                      {cnt.contourId}
                    </span>
                    <span className="text-xs font-bold text-white">{cnt.surfaceName}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded">
                    {cnt.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Interval Minor</span>
                    <span className="text-sky-300 font-bold">{cnt.intervalMeters}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Interval Major</span>
                    <span className="text-purple-300 font-bold">{cnt.majorIntervalMeters}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Total Lines</span>
                    <span className="text-white font-bold">{cnt.lineCount} Lines</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Elev Range</span>
                    <span className="text-amber-300 font-bold">{cnt.minElevation}m - {cnt.maxElevation}m RL</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => alert(`Mengeksport dataset kontur ${cnt.contourId} ke format DXF / SHP / GeoJSON`)}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export DXF / SHP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
