// MINE SMART AI - Geological Model Master Component
// Covering: Seam, Block Model, Borehole, Lithology, Quality, Elevation, and Thickness

import React, { useState } from "react";
import {
  Layers,
  Box,
  Target,
  FileText,
  Activity,
  TrendingUp,
  Compass,
  Filter,
  Search,
  Download,
  Info,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  BarChart3,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  GeologicalSeam,
  GeologicalBlockModel,
  GeologicalBorehole,
  LithologyUnit,
} from "../../../types/minePlanningTypes";
import { MinePlanningRepository } from "../../../services/repositories/MinePlanningRepository";

export const GeologicalModelView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "SEAMS" | "BLOCK_MODEL" | "BOREHOLE" | "LITHOLOGY" | "QUALITY" | "THICKNESS"
  >("SEAMS");

  const [seams, setSeams] = useState<GeologicalSeam[]>(
    MinePlanningRepository.getSeams()
  );
  const [selectedSeam, setSelectedSeam] = useState<GeologicalSeam>(seams[0]);

  const [boreholes, setBoreholes] = useState<GeologicalBorehole[]>(
    MinePlanningRepository.getBoreholes()
  );
  const [selectedBorehole, setSelectedBorehole] = useState<GeologicalBorehole>(
    boreholes[0]
  );

  const [blockModels, setBlockModels] = useState<GeologicalBlockModel[]>(
    MinePlanningRepository.getBlockModels()
  );
  const [selectedBenchFilter, setSelectedBenchFilter] = useState<string>("ALL");

  const lithologyUnits = MinePlanningRepository.getLithologyUnits();

  const filteredBlockModels = blockModels.filter((bm) => {
    if (selectedBenchFilter !== "ALL" && bm.benchCode !== selectedBenchFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 md:p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-500/10 dark:bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-600 dark:text-teal-400 border border-teal-500/30 uppercase tracking-wider">
                MINE GEOLOGY & RESOURCE MODELING
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                JORC & KCMI Code Compliant (2026 Updated)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
              <Layers className="h-6 w-6 text-teal-500" />
              Geological Model & Stratigraphy Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pemodelan lapisan batubara (Seam), 3D Block Model, log pemboran (Borehole), litologi batuan, kualitas batubara (Quality), kontur elevasi, dan ketebalan (Thickness).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Cadangan</span>
              <span className="text-sm font-black text-teal-600 dark:text-teal-400 font-mono">
                {seams.reduce((acc, s) => acc + s.totalReserveMt, 0).toFixed(2)} Mt
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Seam Teridentifikasi</span>
              <span className="text-sm font-black text-amber-500 font-mono">
                {seams.length} Seam Utama
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Titik Bor Terkoreksi</span>
              <span className="text-sm font-black text-sky-500 font-mono">
                {boreholes.length} Boreholes
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {[
            { id: "SEAMS", label: "1. Seam Batubara", icon: Layers },
            { id: "BLOCK_MODEL", label: "2. 3D Block Model", icon: Box },
            { id: "BOREHOLE", label: "3. Borehole Logging", icon: Target },
            { id: "LITHOLOGY", label: "4. Litologi Batuan", icon: FileText },
            { id: "QUALITY", label: "5. Analisis Kualitas", icon: Activity },
            { id: "THICKNESS", label: "6. Elevasi & Ketebalan", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  active
                    ? "bg-teal-500 border-teal-400 text-slate-950 shadow-md shadow-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: SEAM BATUBARA */}
      {activeSubTab === "SEAMS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seam List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Daftar Lapisan Seam Batubara
            </h3>
            {seams.map((seam) => {
              const isSelected = selectedSeam.id === seam.id;
              return (
                <div
                  key={seam.id}
                  onClick={() => setSelectedSeam(seam)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-teal-500 bg-teal-500/10 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {seam.code}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {seam.confidenceCategory}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {seam.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tebal Rata-rata:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {seam.averageThicknessM} Meter
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kalori (GAR):</span>
                      <span className="font-bold text-amber-500 font-mono">
                        {seam.quality.garKcal} kcal/kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seam Detailed Specs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase">
                    DETAIL PARAMETER GEOLOGI SEAM
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedSeam.name} ({selectedSeam.code})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Sumberdaya</span>
                  <span className="text-base font-black text-emerald-500 font-mono">
                    {selectedSeam.totalReserveMt.toFixed(2)} Juta Ton
                  </span>
                </div>
              </div>

              {/* Spatial Geometry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Kemiringan Dip</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {selectedSeam.dipAngleDeg}° ({selectedSeam.dipDirection})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Jurus Strike</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {selectedSeam.strike}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Elevasi Roof / Top</span>
                  <span className="text-sm font-black text-teal-500 font-mono">
                    RL {selectedSeam.roofElevationRL > 0 ? "+" : ""}{selectedSeam.roofElevationRL}m
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Elevasi Floor / Base</span>
                  <span className="text-sm font-black text-cyan-500 font-mono">
                    RL {selectedSeam.floorElevationRL > 0 ? "+" : ""}{selectedSeam.floorElevationRL}m
                  </span>
                </div>
              </div>

              {/* Quality & Recovery Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-amber-500" /> Kualitas Batubara Laboratorium
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">Nilai Kalori (GAR):</span>
                      <span className="font-bold text-amber-500 font-mono">{selectedSeam.quality.garKcal} kcal/kg</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">Total Moisture (TM):</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedSeam.quality.totalMoisturePercent}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">Kadar Abu (Ash Content):</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedSeam.quality.ashContentPercent}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Total Sulfur (TS):</span>
                      <span className="font-bold text-emerald-500 font-mono">{selectedSeam.quality.totalSulfurPercent}% (Low Sulfur)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-teal-500" /> Parameter Penambangan & Recovery
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">Mining Recovery Factor:</span>
                      <span className="font-bold text-teal-500 font-mono">{selectedSeam.coalRecoveryPercent}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">Geological Loss:</span>
                      <span className="font-bold text-rose-500 font-mono">{selectedSeam.geologicalLossPercent}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-400">In-situ Density:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedSeam.inSituDensity} Ton/m³</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Tebal Parting Rata-rata:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedSeam.partingThicknessM} m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 3D BLOCK MODEL */}
      {activeSubTab === "BLOCK_MODEL" && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Filter Bench Elevasi:</span>
              <select
                value={selectedBenchFilter}
                onChange={(e) => setSelectedBenchFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="ALL">Semua Bench (+40m s/d 0m)</option>
                <option value="RL +40m">RL +40m (Overburden Top)</option>
                <option value="RL +30m">RL +30m (Overburden Mid)</option>
                <option value="RL +20m">RL +20m (Seam 30 Roof)</option>
                <option value="RL +10m">RL +10m (Interburden Shale)</option>
                <option value="RL 0m">RL 0m (Seam 28 Zone)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Voxel Block Size: <strong className="text-teal-500">25m x 25m x 10m</strong> (Volume: 6,250 m³)
            </div>
          </div>

          {/* Block Model Grid Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-bold text-slate-400">
                  <th className="p-3">Block ID</th>
                  <th className="p-3">Easting (X)</th>
                  <th className="p-3">Northing (Y)</th>
                  <th className="p-3">Elevasi RL (Z)</th>
                  <th className="p-3">Tipe Material</th>
                  <th className="p-3">Seam</th>
                  <th className="p-3">Densitas</th>
                  <th className="p-3">Ton / Volume</th>
                  <th className="p-3">Estimasi GAR</th>
                  <th className="p-3">Klasifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {filteredBlockModels.map((bm) => (
                  <tr key={bm.blockId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-teal-600 dark:text-teal-400">{bm.blockId}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{bm.coordX} m E</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{bm.coordY} m N</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">RL +{bm.coordZ}m</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        bm.materialType === "COAL"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {bm.materialType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-500">{bm.seamCode || "-"}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{bm.densityTonnePerM3} t/m³</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {bm.tonnageMt ? `${(bm.tonnageMt * 1000).toFixed(0)} Ton` : `${bm.volumeM3} m³`}
                    </td>
                    <td className="p-3 font-bold text-emerald-500">
                      {bm.garKcal ? `${bm.garKcal} kcal` : "-"}
                    </td>
                    <td className="p-3">
                      <span className="bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded text-[10px] font-bold">
                        {bm.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: BOREHOLE LOGGING */}
      {activeSubTab === "BOREHOLE" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Borehole List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Daftar Titik Bor Eksplorasi
            </h3>
            {boreholes.map((bh) => {
              const isSelected = selectedBorehole.id === bh.id;
              return (
                <div
                  key={bh.id}
                  onClick={() => setSelectedBorehole(bh)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky-500 bg-sky-500/10 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">
                      {bh.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{bh.drilledDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kedalaman Total:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {bh.totalDepthM} Meter
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Core Recovery:</span>
                      <span className="font-bold text-emerald-500 font-mono">
                        {bh.overallCoreRecoveryPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Borehole Stratigraphy Visualization Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-sky-500 uppercase">
                    STRATIGRAPHY CORE LOGGING COLUMN
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedBorehole.code} (Collar RL +{selectedBorehole.collarElevationRL}m)
                  </h3>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400 block text-[10px]">Koordinat Collar UTM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedBorehole.collarEasting.toFixed(1)} E, {selectedBorehole.collarNorthing.toFixed(1)} N
                  </span>
                </div>
              </div>

              {/* Visual Stratigraphy Column Bars */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Profil Penampang Lapisan Batuan:
                </span>
                <div className="space-y-1.5">
                  {selectedBorehole.intervals.map((inv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      style={{ borderLeftColor: inv.colorHex, borderLeftWidth: 6 }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {inv.lithologyName}
                          </span>
                          {inv.seamCode && (
                            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                              {inv.seamCode} ({inv.garKcal} kcal)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {inv.description}
                        </p>
                      </div>

                      <div className="text-right font-mono text-xs shrink-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {inv.fromDepthM}m - {inv.toDepthM}m ({inv.thicknessM}m)
                        </span>
                        <span className="text-[10px] text-emerald-500">Recovery: {inv.coreRecoveryPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: LITOLOGI BATUAN */}
      {activeSubTab === "LITHOLOGY" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lithologyUnits.map((lit) => (
            <div
              key={lit.code}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="h-3.5 w-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: lit.colorHex }}
                />
                <span className="font-mono text-xs font-bold text-slate-400">{lit.code}</span>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {lit.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {lit.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Densitas:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{lit.density} g/cm³</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kekuatan Tekan (UCS):</span>
                  <span className="font-bold text-amber-500">{lit.ucsMpa} MPa</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Tingkat Kemudahan Gali: <span className="text-teal-500">{lit.diggabilityIndex}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 5: ANALISIS KUALITAS */}
      {activeSubTab === "QUALITY" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-amber-500 uppercase">
                COAL QUALITY & PROXIMATE ANALYSIS
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Matriks Parameter Kualitas Batubara Lintas Seam
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Standar ASTM / ISO</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-bold text-slate-400">
                  <th className="p-3">Seam Code</th>
                  <th className="p-3">GAR (kcal/kg)</th>
                  <th className="p-3">NAR (kcal/kg)</th>
                  <th className="p-3">Total Moisture (TM %)</th>
                  <th className="p-3">Inherent Moisture (IM %)</th>
                  <th className="p-3">Ash Content (%)</th>
                  <th className="p-3">Volatile Matter (VM %)</th>
                  <th className="p-3">Fixed Carbon (FC %)</th>
                  <th className="p-3">Total Sulfur (TS %)</th>
                  <th className="p-3">HGI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {seams.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-teal-500">{s.code}</td>
                    <td className="p-3 font-black text-amber-500">{s.quality.garKcal}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{s.quality.narKcal}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.quality.totalMoisturePercent}%</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.quality.inherentMoisturePercent}%</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.quality.ashContentPercent}%</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.quality.volatileMatterPercent}%</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.quality.fixedCarbonPercent}%</td>
                    <td className="p-3 font-bold text-emerald-500">{s.quality.totalSulfurPercent}%</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">{s.quality.hgi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 6: ELEVASI & KETEBALAN */}
      {activeSubTab === "THICKNESS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">
              Perbandingan True vs Apparent Thickness
            </h3>
            <div className="space-y-3">
              {seams.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-teal-600 dark:text-teal-400">{s.name} ({s.code})</span>
                    <span className="text-slate-400 font-mono">Dip: {s.dipAngleDeg}°</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tebal Sejati:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.trueThicknessM} m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tebal Semu:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.apparentThicknessM} m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Interburden:</span>
                      <span className="font-bold text-amber-500">{s.interburdenThicknessM} m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">
              Struktur Kontur Elevasi Seam
            </h3>
            <div className="space-y-3">
              {seams.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-teal-500 font-mono">Jurus: {s.strike}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    <span>Atap (Roof): RL {s.roofElevationRL > 0 ? "+" : ""}{s.roofElevationRL}m</span>
                    <span>Lantai (Floor): RL {s.floorElevationRL > 0 ? "+" : ""}{s.floorElevationRL}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
