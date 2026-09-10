// MINE SMART AI - Surface Management & Versioning Center

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Layers3,
  Download,
  Eye,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { SurveySurface, SurfaceType } from "../../../types/surveyTypes";

interface SurfaceManagementViewProps {
  surfaces: SurveySurface[];
  onAddSurfaceSubmit: (surf: SurveySurface) => void;
  onSelectSurfacesForCompare: (s1: SurveySurface, s2: SurveySurface) => void;
}

export const SurfaceManagementView: React.FC<SurfaceManagementViewProps> = ({
  surfaces,
  onAddSurfaceSubmit,
  onSelectSurfacesForCompare,
}) => {
  const [selectedSurface, setSelectedSurface] = useState<SurveySurface | null>(surfaces[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Surface form state
  const [surfaceName, setSurfaceName] = useState("Pit 1 South End-August 2026 Surface");
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("Current Surface");
  const [version, setVersion] = useState("v3");
  const [source, setSource] = useState("LiDAR + RTK Composite Survey");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurf: SurveySurface = {
      id: `surf-${Date.now()}`,
      surfaceId: `SURF-2026-${Math.floor(10 + Math.random() * 90)}`,
      surfaceName,
      companyId: "comp-01",
      siteId: "site-01",
      projectId: "PRJ-SURV-2026-01",
      surfaceType,
      surveyDate: new Date().toISOString().split("T")[0],
      coordinateSystem: "UTM Zone 50S (EPSG:32750)",
      unit: "Meters",
      source,
      pointCount: 9200,
      triangleCount: 18300,
      boundingBox: {
        minEasting: 541000,
        maxEasting: 542200,
        minNorthing: 9874000,
        maxNorthing: 9875200,
      },
      minElevation: 15.0,
      maxElevation: 145.0,
      averageElevation: 68.5,
      status: "Approved",
      version,
      createdBy: "Budi Santoso",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddSurfaceSubmit(newSurf);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Surface Management & Spatial Version Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen model 3D permukaan terrain tambang, versi historis DTM/DSM, serta perbandingan versi surface.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {surfaces.length >= 2 && (
            <button
              onClick={() => onSelectSurfacesForCompare(surfaces[0], surfaces[1])}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Bandingkan Versi ({surfaces[0].version} vs {surfaces[1].version})</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Surface Baru</span>
          </button>
        </div>
      </div>

      {/* Surface Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surfaces.map((surf) => {
          const isSelected = selectedSurface?.id === surf.id;
          return (
            <div
              key={surf.id}
              onClick={() => setSelectedSurface(surf)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? "bg-slate-900 border-sky-500 shadow-lg shadow-sky-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-mono">
                      {surf.version}
                    </span>
                    <span className="text-xs font-bold text-white">{surf.surfaceName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{surf.surfaceType} • {surf.source}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  {surf.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Jumlah Point</span>
                  <span className="text-white font-bold">{surf.pointCount.toLocaleString()} pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Segitiga TIN</span>
                  <span className="text-sky-300 font-bold">{surf.triangleCount.toLocaleString()} tris</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Min / Max Elev</span>
                  <span className="text-amber-300 font-bold">{surf.minElevation}m - {surf.maxElevation}m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Rata-rata RL</span>
                  <span className="text-emerald-400 font-bold">{surf.averageElevation}m RL</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {surf.surveyDate}
                </span>
                <span>Oleh: {surf.createdBy}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Surface Detailed View Box */}
      {selectedSurface && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers3 className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-sm font-bold text-white">{selectedSurface.surfaceName}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedSurface.surfaceId} | Proyeksi: {selectedSurface.coordinateSystem}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Sistem menyiapkan export file LandXML / DXF Surface untuk ${selectedSurface.surfaceName}`)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export LandXML / DXF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Bounding Easting</span>
              <span className="text-white font-bold">{selectedSurface.boundingBox.minEasting}m - {selectedSurface.boundingBox.maxEasting}m</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Bounding Northing</span>
              <span className="text-white font-bold">{selectedSurface.boundingBox.minNorthing}m - {selectedSurface.boundingBox.maxNorthing}m</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Elevation Range</span>
              <span className="text-amber-300 font-bold">{selectedSurface.minElevation}m RL s.d. {selectedSurface.maxElevation}m RL</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Versi Surface</span>
              <span className="text-emerald-400 font-bold">{selectedSurface.version} ({selectedSurface.status})</span>
            </div>
          </div>
        </div>
      )}

      {/* Create New Surface Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Generate Surface Model Baru
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nama Surface</label>
                <input
                  type="text"
                  value={surfaceName}
                  onChange={(e) => setSurfaceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Surface Type</label>
                  <select
                    value={surfaceType}
                    onChange={(e) => setSurfaceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Current Surface">Current Surface</option>
                    <option value="Design Surface">Design Surface</option>
                    <option value="Original Ground">Original Ground</option>
                    <option value="Pit Surface">Pit Surface</option>
                    <option value="Stockpile Surface">Stockpile Surface</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Versi</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Sumber Data / Sensor</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded cursor-pointer"
                >
                  Generate TIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
