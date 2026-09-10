// MINE SMART AI - Bench Management & Validation Component

import React, { useState } from "react";
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Sliders,
  Ruler,
  ShieldAlert,
} from "lucide-react";
import { Bench } from "../../../types/minePlanningTypes";

interface BenchManagementViewProps {
  benches: Bench[];
  onAddBench: (bench: Bench) => void;
}

export const BenchManagementView: React.FC<BenchManagementViewProps> = ({
  benches,
  onAddBench,
}) => {
  // Configurable Parameters State
  const [benchHeight, setBenchHeight] = useState<number>(10);
  const [benchWidth, setBenchWidth] = useState<number>(12);
  const [faceAngle, setFaceAngle] = useState<number>(60);
  const [bermWidth, setBermWidth] = useState<number>(5);
  const [benchCode, setBenchCode] = useState<string>("RL -10.0m");
  const [elevation, setElevation] = useState<number>(-10);
  const [materialType, setMaterialType] = useState<Bench["materialType"]>("COAL_SEAM");

  // Validation Engine
  const validateBenchParameters = (height: number, width: number, angle: number, berm: number) => {
    const warnings: string[] = [];
    if (angle > 70) {
      warnings.push("Sudut kemiringan lereng (Face Angle > 70°) berisiko tinggi menyebabkan geoteknik kelongsoran!");
    }
    if (berm < 4) {
      warnings.push("Lebar berm keselamatan (< 4.0m) di bawah batas standar keamanan alat berat!");
    }
    if (width < 10) {
      warnings.push("Lebar bench (< 10.0m) terlalu sempit untuk manuver Excavator & Dump Truck!");
    }
    return warnings;
  };

  const currentWarnings = validateBenchParameters(benchHeight, benchWidth, faceAngle, bermWidth);

  const handleCreateBench = () => {
    const newBch: Bench = {
      id: `bch-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      benchId: `BENCH-${benchCode.replace(/[^a-zA-Z0-9]/g, "")}`,
      pitId: "pit-01",
      benchCode,
      elevation,
      crestElevation: elevation,
      toeElevation: elevation - benchHeight,
      heightMeters: benchHeight,
      widthMeters: benchWidth,
      slopeAngleDeg: faceAngle,
      bermWidthMeters: bermWidth,
      materialType,
      status: "PLANNED",
      coalReserveMt: materialType === "COAL_SEAM" ? 0.35 : 0,
      wasteVolumeMbc: materialType === "OVERBURDEN" ? 1.5 : 0.2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddBench(newBch);
  };

  return (
    <div className="space-y-6">
      {/* Top Configurator Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bench Parameter Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-teal-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Konfigurasi Parameter Design Bench Tambang
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">STANDAR GEOTEKNIK ESDM</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Kode Bench / RL:</label>
              <input
                type="text"
                value={benchCode}
                onChange={(e) => setBenchCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Elevasi RL (Meter):</label>
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Tinggi Bench (m):</label>
              <input
                type="number"
                value={benchHeight}
                onChange={(e) => setBenchHeight(parseFloat(e.target.value) || 10)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Lebar Bench (m):</label>
              <input
                type="number"
                value={benchWidth}
                onChange={(e) => setBenchWidth(parseFloat(e.target.value) || 12)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Face Slope Angle (°):</label>
              <input
                type="number"
                value={faceAngle}
                onChange={(e) => setFaceAngle(parseFloat(e.target.value) || 60)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Lebar Berm Safe (m):</label>
              <input
                type="number"
                value={bermWidth}
                onChange={(e) => setBermWidth(parseFloat(e.target.value) || 5)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Jenis Material Bench:</span>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as Bench["materialType"])}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="OVERBURDEN">Overburden (OB)</option>
                <option value="COAL_SEAM">Seam Batubara (Coal)</option>
                <option value="INTERBURDEN">Interburden (IB)</option>
                <option value="HARD_ROCK">Batuan Keras (Hard Rock Blasting)</option>
              </select>
            </div>

            <button
              onClick={handleCreateBench}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Bench Ke Model</span>
            </button>
          </div>
        </div>

        {/* Bench Validation Warnings Panel */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">
              Engine Validasi Geoteknik Bench
            </h4>
          </div>

          {currentWarnings.length > 0 ? (
            <div className="space-y-2">
              {currentWarnings.map((warn, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Parameter Bench Memenuhi Standar Keamanan & Geoteknik!</span>
            </div>
          )}
        </div>
      </div>

      {/* Bench List Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Daftar Elevasi Bench Aktif ({benches.length} Bench Level)
          </h3>
          <span className="text-xs text-slate-400 font-mono">PIT 1 SOUTH SANGATTA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Kode Bench</th>
                <th className="py-2.5 px-3 text-center">Elevasi RL</th>
                <th className="py-2.5 px-3 text-center">Tinggi (m)</th>
                <th className="py-2.5 px-3 text-center">Lebar (m)</th>
                <th className="py-2.5 px-3 text-center">Face Angle</th>
                <th className="py-2.5 px-3 text-center">Berm Safe</th>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3 text-center">Status Galian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {benches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-teal-500">{b.benchCode}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                    RL {b.elevation > 0 ? `+${b.elevation}` : b.elevation}m
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{b.heightMeters} m</td>
                  <td className="py-3 px-3 text-center font-mono">{b.widthMeters} m</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-500 font-bold">{b.slopeAngleDeg}°</td>
                  <td className="py-3 px-3 text-center font-mono">{b.bermWidthMeters} m</td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">{b.materialType}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        b.status === "ACTIVE_EXCAVATION"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : b.status === "COMPLETED"
                          ? "bg-slate-500/10 text-slate-400"
                          : "bg-sky-500/10 text-sky-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
