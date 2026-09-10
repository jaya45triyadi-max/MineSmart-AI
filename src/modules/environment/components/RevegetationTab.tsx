import React, { useState } from "react";
import {
  Trees,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Leaf,
  Droplets,
  Award,
  Sparkles,
  BarChart3,
  TrendingUp,
  Plus,
} from "lucide-react";
import { RevegetationPlot, NurseryInventoryItem } from "../../../types/environmentTypes";

export const RevegetationTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"plots" | "nursery" | "maintenance">("plots");

  const [plots, setPlots] = useState<RevegetationPlot[]>([
    {
      id: "REV-PL01",
      plotCode: "PLOT-ALPHA-01",
      blockName: "Pit Alpha West Slope (12.5 Ha)",
      areaHa: 10.2,
      plantingDate: "2024-11-15",
      targetTreesPerHa: 1100,
      actualTreesPlanted: 11220,
      dominantSpecies: ["Sengon Buto (Enterolobium cyclocarpum)", "Johar (Senna siamea)", "Meranti (Shorea leprosula)"],
      survivalRatePercent: 91.4,
      canopyDensityPercent: 78.5,
      averageHeightMeters: 4.8,
      averageDiameterCm: 8.2,
      healthStatus: "HEALTHY",
      maintenanceStatus: "ROUTINE",
      lastInspectionDate: "2026-08-10",
      nextActivityDate: "2026-09-05",
    },
    {
      id: "REV-PL02",
      plotCode: "PLOT-DISPOSAL-N",
      blockName: "Disposal North Bench 2-4 (18.2 Ha)",
      areaHa: 12.5,
      plantingDate: "2025-03-20",
      targetTreesPerHa: 1000,
      actualTreesPlanted: 12500,
      dominantSpecies: ["Trembesi (Samanea saman)", "Kaliandra (Calliandra calothyrsus)", "Ulin (Eusideroxylon zwageri)"],
      survivalRatePercent: 86.8,
      canopyDensityPercent: 62.0,
      averageHeightMeters: 2.9,
      averageDiameterCm: 5.1,
      healthStatus: "HEALTHY",
      maintenanceStatus: "FERTILIZATION_DUE",
      lastInspectionDate: "2026-08-12",
      nextActivityDate: "2026-08-25",
    },
    {
      id: "REV-PL03",
      plotCode: "PLOT-CORRIDOR-S",
      blockName: "Ex-Haul Road Corridor Sector 2",
      areaHa: 4.8,
      plantingDate: "2025-10-10",
      targetTreesPerHa: 1200,
      actualTreesPlanted: 5760,
      dominantSpecies: ["Mahoni (Swietenia macrophylla)", "Gmelina arborea", "Centrosema pubescens"],
      survivalRatePercent: 82.5,
      canopyDensityPercent: 45.0,
      averageHeightMeters: 1.8,
      averageDiameterCm: 3.4,
      healthStatus: "MODERATE",
      maintenanceStatus: "REPLANTING_REQUIRED",
      lastInspectionDate: "2026-08-08",
      nextActivityDate: "2026-08-20",
    },
  ]);

  const [nurseryItems, setNurseryItems] = useState<NurseryInventoryItem[]>([
    {
      id: "NUR-01",
      speciesName: "Sengon Buto",
      botanicalName: "Enterolobium cyclocarpum",
      category: "PIONEER_FAST_GROWING",
      readyStockCount: 14500,
      seedlingInNurseryCount: 8200,
      germinationRatePercent: 94.0,
      distributedToDateCount: 45000,
      monthlyTargetCount: 5000,
      growthTimeWeeks: 12,
      bagSizeCm: "15 x 20",
      status: "OPTIMAL",
    },
    {
      id: "NUR-02",
      speciesName: "Johar / Kassod Tree",
      botanicalName: "Senna siamea",
      category: "PIONEER_FAST_GROWING",
      readyStockCount: 9800,
      seedlingInNurseryCount: 6500,
      germinationRatePercent: 89.5,
      distributedToDateCount: 32000,
      monthlyTargetCount: 4000,
      growthTimeWeeks: 14,
      bagSizeCm: "15 x 20",
      status: "OPTIMAL",
    },
    {
      id: "NUR-03",
      speciesName: "Meranti Merah",
      botanicalName: "Shorea leprosula",
      category: "LOCAL_CLIMAX",
      readyStockCount: 4200,
      seedlingInNurseryCount: 5800,
      germinationRatePercent: 78.0,
      distributedToDateCount: 12000,
      monthlyTargetCount: 2500,
      growthTimeWeeks: 24,
      bagSizeCm: "20 x 25",
      status: "RESTOCK_IN_PROGRESS",
    },
    {
      id: "NUR-04",
      speciesName: "Kayu Ulin / Ironwood",
      botanicalName: "Eusideroxylon zwageri",
      category: "LOCAL_CLIMAX",
      readyStockCount: 1850,
      seedlingInNurseryCount: 3200,
      germinationRatePercent: 72.5,
      distributedToDateCount: 5400,
      monthlyTargetCount: 1000,
      growthTimeWeeks: 36,
      bagSizeCm: "25 x 30",
      status: "LOW_STOCK",
    },
    {
      id: "NUR-05",
      speciesName: "Rumput Akar Wangi (Vetiver)",
      botanicalName: "Chrysopogon zizanioides",
      category: "SOIL_BINDER",
      readyStockCount: 35000,
      seedlingInNurseryCount: 15000,
      germinationRatePercent: 96.0,
      distributedToDateCount: 120000,
      monthlyTargetCount: 15000,
      growthTimeWeeks: 6,
      bagSizeCm: "Polybag Strip",
      status: "OPTIMAL",
    },
  ]);

  const totalNurseryStock = nurseryItems.reduce((sum, item) => sum + item.readyStockCount, 0);
  const avgSurvivalRate = (plots.reduce((sum, p) => sum + p.survivalRatePercent, 0) / plots.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <Trees className="w-3.5 h-3.5" /> REVEGETASI & BIODIVERSITAS TAMBANG
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Permen ESDM No. 26/2018
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Revegetation, Nursery & Canopy Monitoring
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Program penanaman tanaman pionir cepat tumbuh (Fast-Growing) dan jenis lokal klimaks, inventaris pembibitan (Nursery), monitoring tingkat tumbuh (Survival Rate), dan tutupan tajuk kanopi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
            Nursery Ready: {totalNurseryStock.toLocaleString()} Bibit
          </span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: "plots", label: "Plot Revegetasi & Survival Rate", icon: Trees },
          { key: "nursery", label: "Inventaris Nursery & Pembibitan", icon: Sprout },
          { key: "maintenance", label: "Jadwal Pemeliharaan & Pemupukan", icon: Calendar },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.key;
          return (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(sub.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. REVEGETATION PLOTS */}
      {activeSubTab === "plots" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Luas Ter-revegetasi</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                27.5 Ha
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">100% Target Tahunan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Rata-rata Survival Rate</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {avgSurvivalRate}%
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Standar ESDM: &gt;80%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Pohon Tertanam</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                29,480
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Kepadatan: ~1,072 Pohon/Ha</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Rata-rata Tutupan Kanopi</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                61.8%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Drone Orthophoto Index</span>
            </div>
          </div>

          {/* Plots Grid */}
          <div className="space-y-4">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {plot.plotCode}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {plot.blockName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500">Tanam: {plot.plantingDate}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        plot.healthStatus === "HEALTHY"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {plot.healthStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tingkat Kelangsungan (Survival)</span>
                    <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {plot.survivalRatePercent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tutupan Kanopi (Canopy)</span>
                    <span className="text-xl font-mono font-black text-teal-600 dark:text-teal-400 mt-0.5 block">
                      {plot.canopyDensityPercent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tinggi Rata-rata</span>
                    <span className="text-xl font-mono font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {plot.averageHeightMeters} m
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Diameter Batang (DBH)</span>
                    <span className="text-xl font-mono font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {plot.averageDiameterCm} cm
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Spesies Dominan Ditanam:</span>
                  <div className="flex flex-wrap gap-2">
                    {plot.dominantSpecies.map((sp, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                      >
                        🌱 {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NURSERY INVENTORY */}
      {activeSubTab === "nursery" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-500" />
                Inventaris Persemaian Bibit (Central Mining Nursery Stock)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kapasitas maksimum: 65,000 bibit • Waktu aklimatisasi & persemaian bibit siap tanam.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Total Siap Tanam: {totalNurseryStock.toLocaleString()} Bibit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {nurseryItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {item.category.replace(/_/g, " ")}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {item.speciesName}
                    </h4>
                    <p className="text-[11px] italic text-slate-500">{item.botanicalName}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === "OPTIMAL"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Stok Siap Tanam</span>
                    <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {item.readyStockCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dalam Persemaian</span>
                    <span className="text-base font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.seedlingInNurseryCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Daya Berkecambah:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{item.germinationRatePercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Masa Semai:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{item.growthTimeWeeks} Minggu</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Terdistribusi YTD:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{item.distributedToDateCount.toLocaleString()} Bibit</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAINTENANCE & FERTILIZATION */}
      {activeSubTab === "maintenance" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Jadwal Pemeliharaan, Penyiangan Gulma & Pemupukan NPK
          </h3>

          <div className="space-y-3 text-xs">
            {[
              {
                activity: "Pemupukan NPK 15-15-15 Lanjutan (Tahun ke-2)",
                plot: "Plot Pit Alpha West (PLOT-ALPHA-01)",
                dueDate: "2026-08-25",
                target: "10.2 Ha (11,200 Tanaman)",
                responsible: "Tim Agronomi & SHE Lapangan",
                status: "SCHEDULED",
              },
              {
                activity: "Penyulaman Bibit Mati (Mortality Replacement)",
                plot: "Plot Corridor Sector 2 (PLOT-CORRIDOR-S)",
                dueDate: "2026-08-20",
                target: "850 Bibit Mahoni & Gmelina",
                responsible: "Subkontraktor Reklamasi PT Hijau Alam",
                status: "IN_PROGRESS",
              },
              {
                activity: "Pemberantasan Hama Rayap & Penyemprotan Bio-Pestisida",
                plot: "Plot Disposal North Bench (PLOT-DISPOSAL-N)",
                dueDate: "2026-09-02",
                target: "12.5 Ha",
                responsible: "Tim Nursery & Proteksi Tanaman",
                status: "SCHEDULED",
              },
            ].map((task, tIdx) => (
              <div
                key={tIdx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    {task.activity}
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Lokasi: <strong className="text-slate-700 dark:text-slate-300">{task.plot}</strong> • Target: {task.target}
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                    Pelaksana: {task.responsible}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-slate-500 font-bold">{task.dueDate}</span>
                  <span
                    className={`px-2.5 py-1 rounded-xl font-bold uppercase text-[10px] ${
                      task.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
