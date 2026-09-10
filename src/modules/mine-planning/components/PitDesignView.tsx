// MINE SMART AI - Pit Design & Boundary Editor Component

import React, { useState } from "react";
import {
  Compass,
  Layers,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Copy,
  Eye,
  Sliders,
  MapPin,
  Pickaxe,
} from "lucide-react";
import { PitDesign } from "../../../types/minePlanningTypes";
import { GISMapCanvas } from "../../gis/components/GISMapCanvas";
import { INITIAL_GIS_LAYERS, MOCK_SPATIAL_ENTITIES } from "../../../services/gis/GISService";

interface PitDesignViewProps {
  pitDesigns: PitDesign[];
  onAddPitDesign: (pit: PitDesign) => void;
}

export const PitDesignView: React.FC<PitDesignViewProps> = ({ pitDesigns, onAddPitDesign }) => {
  const [selectedPitId, setSelectedPitId] = useState<string>(pitDesigns[0]?.id || "");
  const [isEditingBoundary, setIsEditingBoundary] = useState(false);

  const activePit = pitDesigns.find((p) => p.id === selectedPitId) || pitDesigns[0];

  const handleCreateNewDesign = () => {
    const newPit: PitDesign = {
      id: `pd-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      pitId: `pit-0${pitDesigns.length + 1}`,
      name: `Pit 3 West Expansion Shell`,
      code: `PIT-03-W`,
      version: "v1.0",
      elevationMin: -30,
      elevationMax: 110,
      depthMeters: 140,
      areaHectares: 54.2,
      totalVolumeM3: 32000000,
      coalVolumeM3: 7200000,
      wasteVolumeM3: 24800000,
      stripRatio: 3.44,
      designStatus: "DRAFT",
      geometry: {
        boundaryCoordinates: [
          { lat: -0.495, lng: 117.15 },
          { lat: -0.492, lng: 117.158 },
          { lat: -0.498, lng: 117.16 },
          { lat: -0.5, lng: 117.152 },
        ],
        centerCoordinate: { lat: -0.4962, lng: 117.155 },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddPitDesign(newPit);
    setSelectedPitId(newPit.id);
  };

  return (
    <div className="space-y-4">
      {/* Top Design Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-500" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Pit Design & CAD Shell Management
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPitId}
            onChange={(e) => setSelectedPitId(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            {pitDesigns.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.code}] {p.name} ({p.version})
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateNewDesign}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Pit Design</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Parameters Panel + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left Col: Design Parameters */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-sm text-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
            <span className="font-extrabold text-slate-900 dark:text-white uppercase text-[11px]">
              Parameter Pit Design
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
              {activePit.designStatus}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">Nama Pit Design:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{activePit.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Kode Pit:</span>
                <span className="font-mono font-bold text-emerald-500">{activePit.code}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Versi Shell:</span>
                <span className="font-mono font-bold text-sky-400">{activePit.version}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Kedalaman Pit:</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                  {activePit.depthMeters} Meter
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Luas Pit Area:</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                  {activePit.areaHectares} Ha
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Rentang Elevasi RL:</span>
              <div className="flex justify-between font-mono font-bold text-teal-500 text-xs">
                <span>Min: RL {activePit.elevationMin}m</span>
                <span>Max: RL +{activePit.elevationMax}m</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Total Volume Galian:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {(activePit.totalVolumeM3 / 1000000).toFixed(1)} M M³
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Cadangan Coal (M³):</span>
                <span className="font-mono font-bold text-amber-500">
                  {(activePit.coalVolumeM3 / 1000000).toFixed(1)} M M³
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Overburden Waste (M³):</span>
                <span className="font-mono font-bold text-sky-400">
                  {(activePit.wasteVolumeM3 / 1000000).toFixed(1)} M M³
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Design Strip Ratio:</span>
                <span className="font-mono font-black text-emerald-500 text-sm">
                  {activePit.stripRatio} : 1
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingBoundary(!isEditingBoundary)}
            className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit2 className="h-4 w-4 text-emerald-500" />
            <span>{isEditingBoundary ? "Simpan Edit Boundary" : "Edit Pit Boundary GIS"}</span>
          </button>
        </div>

        {/* Right 3 Cols: GIS Map Canvas for Pit Design */}
        <div className="lg:col-span-3 h-[580px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <GISMapCanvas
            basemap="SATELLITE"
            layers={INITIAL_GIS_LAYERS}
            entities={MOCK_SPATIAL_ENTITIES}
            measurementMode="NONE"
            onObjectSelect={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
