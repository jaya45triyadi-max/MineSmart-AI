// MINE SMART AI - Volume Calculation & Stockpile Tonnage Center

import React, { useState } from "react";
import {
  Box,
  Sliders,
  CheckCircle2,
  Download,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { VolumeCalculation, SurveySurface, VolumeObjectType } from "../../../types/surveyTypes";
import { SurveyCalculationService } from "../../../services/survey/SurveyCalculationService";

interface VolumeCalculationViewProps {
  volumes: VolumeCalculation[];
  surfaces: SurveySurface[];
  onAddVolumeSubmit: (vol: VolumeCalculation) => void;
}

export const VolumeCalculationView: React.FC<VolumeCalculationViewProps> = ({
  volumes,
  surfaces,
  onAddVolumeSubmit,
}) => {
  const [objectType, setObjectType] = useState<VolumeObjectType>("Stockpile");
  const [objectName, setObjectName] = useState("Stockpile B Seam Sangatta B");
  const [baseElev, setBaseElev] = useState<number>(38.0);
  const [densityFactor, setDensityFactor] = useState<number>(1.30); // 1.30 Ton/m3 for Coal
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleCalculateStockpile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      const surf = surfaces[0];
      const newVol = SurveyCalculationService.calculateStockpileVolume(surf, baseElev, densityFactor);
      newVol.objectName = objectName;
      newVol.objectType = objectType;

      onAddVolumeSubmit(newVol);
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-400" />
            Volume Calculation Center & Stockpile Tonnage Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Komputasi volume progresif Pit, Stockpile Batubara, Disposal Overburden, dan ROM dengan konversi faktor densitas material.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Calculator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-amber-400" />
            Kalkulator Volume Stockpile & Obyek
          </h3>

          <form onSubmit={handleCalculateStockpile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Kategori Obyek</label>
              <select
                value={objectType}
                onChange={(e) => setObjectType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="Stockpile">Stockpile Batubara</option>
                <option value="Pit">Pit Overburden</option>
                <option value="Disposal">Disposal Area</option>
                <option value="ROM">ROM Stockpile</option>
                <option value="Excavation">Excavation Cut</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Nama Obyek Survei</label>
              <input
                type="text"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Elevasi Base (m RL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baseElev}
                  onChange={(e) => setBaseElev(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-300 font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Densitas (Ton/m³)</label>
                <input
                  type="number"
                  step="0.05"
                  value={densityFactor}
                  onChange={(e) => setDensityFactor(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold font-mono"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-300 block">Daftar Standar Densitas Material:</span>
              <p>• Batubara High-CV: 1.30 t/m³</p>
              <p>• Overburden (OB Loose): 1.60 t/m³</p>
              <p>• Overburden (OB Bank BCM): 2.30 t/m³</p>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30"
            >
              <Box className="w-4 h-4" />
              <span>{isCalculating ? "Menghitung Volume..." : "Kalkulasi Volume & Tonnase"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Calculated Volume List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span>Katalog Hasil Kalkulasi Volume Resmi ({volumes.length})</span>
          </h3>

          <div className="space-y-4">
            {volumes.map((vol) => (
              <div
                key={vol.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono">
                      {vol.calculationId}
                    </span>
                    <span className="text-xs font-bold text-white">{vol.objectName}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    {vol.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Volume (m³ / BCM)</span>
                    <span className="text-lg font-bold text-amber-300">{vol.volumeBcm.toLocaleString()} m³</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Hasil Tonnase</span>
                    <span className="text-lg font-bold text-emerald-400">{vol.tonnage.toLocaleString()} Ton</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Faktor Densitas</span>
                    <span className="text-lg font-bold text-sky-300">{vol.densityFactor} t/m³</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Metode: {vol.method} | Base: {vol.surfaceBName}</span>
                  <span>Oleh: {vol.calculatedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
