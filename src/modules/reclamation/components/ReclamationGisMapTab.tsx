import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Search,
  Filter,
  Maximize2,
  Trees,
  Mountain,
  CheckCircle2,
  Info,
} from "lucide-react";
import { DisturbedArea, ReclamationProject } from "../../../types/reclamationTypes";

interface Props {
  disturbedAreas: DisturbedArea[];
  projects: ReclamationProject[];
}

export const ReclamationGisMapTab: React.FC<Props> = ({
  disturbedAreas,
  projects,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(disturbedAreas[0]?.id || "");
  const [activeLayers, setActiveLayers] = useState({
    activeDisturbance: true,
    readyForReclamation: true,
    underReclamation: true,
    reclaimed: true,
    monitoringPoints: true,
  });

  const selectedArea = disturbedAreas.find((a) => a.id === selectedAreaId) || disturbedAreas[0];
  const relatedProject = projects.find((p) => p.disturbedAreaId === selectedArea?.disturbedAreaId);

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            GIS Reclamation Command Center & Spatial Polygon Layer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Peta GIS interaktif pemetaan polygon area terganggu, batas reklamasi, titik pantau RMP, dan zonasi revegetasi.
          </p>
        </div>
      </div>

      {/* GIS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Controls & Selection List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-400" /> Filter Layer Peta GIS
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.activeDisturbance}
                  onChange={() => toggleLayer("activeDisturbance")}
                  className="rounded border-slate-800 text-rose-500 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Active Mining Bukaan
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.readyForReclamation}
                  onChange={() => toggleLayer("readyForReclamation")}
                  className="rounded border-slate-800 text-amber-500 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Ready for Reclamation
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.underReclamation}
                  onChange={() => toggleLayer("underReclamation")}
                  className="rounded border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Under Reclamation
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.reclaimed}
                  onChange={() => toggleLayer("reclaimed")}
                  className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Reclaimed &amp; Revegetated
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.monitoringPoints}
                  onChange={() => toggleLayer("monitoringPoints")}
                  className="rounded border-slate-800 text-purple-500 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Titik Pantau RMP
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilih Area Polygon:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {disturbedAreas.map((da) => (
                <div
                  key={da.id}
                  onClick={() => setSelectedAreaId(da.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedAreaId === da.id
                      ? "border-emerald-500 bg-slate-950 text-white"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-white block">{da.name}</span>
                  <span className="text-[10px] text-slate-500">{da.disturbedAreaId} • {da.areaHa} ha</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GIS Interactive Visual Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 h-[480px] overflow-hidden shadow-2xl flex flex-col justify-between p-6">
            {/* Canvas Mock Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Simulated GIS Polygon Overlays */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-6 my-auto">
              {disturbedAreas.map((da) => {
                const isSelected = da.id === selectedAreaId;
                return (
                  <div
                    key={da.id}
                    onClick={() => setSelectedAreaId(da.id)}
                    className={`rounded-2xl p-5 border-2 cursor-pointer backdrop-blur-md transition transform hover:scale-[1.02] ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-500/10"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-400">{da.code}</span>
                      <MapPin className="h-4 w-4 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-xs">{da.name}</h4>
                    <p className="text-[11px] text-slate-300 font-black mt-1">{da.areaHa} Hektare</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-2">
                      {da.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Floating Inspector Card */}
            {selectedArea && (
              <div className="relative z-20 rounded-xl bg-slate-900/95 border border-slate-800 p-4 text-xs shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    GIS Inspector • {selectedArea.disturbedAreaId}
                  </span>
                  <h4 className="font-bold text-white text-sm">{selectedArea.name}</h4>
                  <p className="text-slate-400 text-[11px]">
                    Pit: {selectedArea.pitName} | Blok: {selectedArea.blockName} | Luas: <strong className="text-emerald-400">{selectedArea.areaHa} ha</strong>
                  </p>
                </div>

                {relatedProject && (
                  <div className="text-right text-[11px] text-slate-300">
                    <span className="text-slate-400 block">Proyek: {relatedProject.projectName}</span>
                    <span className="text-emerald-400 font-bold">Progress: {relatedProject.reclaimedAreaHa} / {relatedProject.targetAreaHa} ha</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
