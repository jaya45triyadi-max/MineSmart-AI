// MINE SMART AI - Pit Planning Master View Component
// Covering: Pit Boundary, Pit Design, Bench, Ramp, Berm, Slope, Pushback, and Mining Sequence

import React, { useState } from "react";
import {
  Layers,
  Sliders,
  Route,
  Target,
  GitCommit,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus,
  Edit,
} from "lucide-react";
import {
  PitDesign,
  Bench,
  Ramp,
  Pushback,
  MiningSequence,
} from "../../../types/minePlanningTypes";
import { MinePlanningRepository } from "../../../services/repositories/MinePlanningRepository";

export const PitPlanningMasterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "DESIGN" | "BENCH" | "RAMP" | "BERM_SLOPE" | "PUSHBACK" | "SEQUENCE"
  >("DESIGN");

  const [pitDesigns, setPitDesigns] = useState<PitDesign[]>(
    MinePlanningRepository.getPitDesigns()
  );
  const [selectedPit, setSelectedPit] = useState<PitDesign>(pitDesigns[0]);

  const [benches, setBenches] = useState<Bench[]>(
    MinePlanningRepository.getBenches()
  );
  const [ramps, setRamps] = useState<Ramp[]>(MinePlanningRepository.getRamps());
  const [pushbacks, setPushbacks] = useState<Pushback[]>(
    MinePlanningRepository.getPushbacks()
  );
  const [sequences, setSequences] = useState<MiningSequence[]>(
    MinePlanningRepository.getSequences()
  );

  return (
    <div className="space-y-6">
      {/* Navigation Top Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 md:p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-sky-500/10 dark:bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 border border-sky-500/30 uppercase tracking-wider">
                MINE PIT ENGINEERING & GEOTECHNICS
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedPit.name} ({selectedPit.version})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
              <Compass className="h-6 w-6 text-sky-500" />
              Pit Planning, Geotechnical Design & Mining Sequence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Desain batas pit (Pit boundary / UPL), geometri lereng (Bench & Berm), ramp jalan angkut, kemantapan lereng (Slope FK), tahapan pushback, dan urutan penambangan (Mining sequence).
            </p>
          </div>

          {/* Pit Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Pilih Pit:</span>
            <select
              value={selectedPit.id}
              onChange={(e) => {
                const found = pitDesigns.find((p) => p.id === e.target.value);
                if (found) setSelectedPit(found);
              }}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold px-3 py-2 rounded-xl text-slate-900 dark:text-white cursor-pointer"
            >
              {pitDesigns.map((pd) => (
                <option key={pd.id} value={pd.id}>
                  {pd.name} ({pd.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {[
            { id: "DESIGN", label: "1. Pit Boundary & Design", icon: Layers },
            { id: "BENCH", label: "2. Geometri Bench", icon: Sliders },
            { id: "RAMP", label: "3. Ramp & Haul Road", icon: Route },
            { id: "BERM_SLOPE", label: "4. Berm & Slope Stability", icon: ShieldAlert },
            { id: "PUSHBACK", label: "5. Pushback Staging", icon: Target },
            { id: "SEQUENCE", label: "6. Mining Sequence", icon: GitCommit },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  active
                    ? "bg-sky-500 border-sky-400 text-white shadow-md shadow-sky-500/20"
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

      {/* SUBTAB 1: PIT DESIGN & BOUNDARY */}
      {activeSubTab === "DESIGN" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-sky-500 uppercase">
                  DESAIN GEOMETRI & BOUNDARY PIT
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedPit.name}
                </h3>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-500/20">
                {selectedPit.designStatus}
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Luas Pit (UPL)</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                  {selectedPit.areaHectares} Ha
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Kedalaman Pit</span>
                <span className="text-sm font-black text-sky-500 font-mono">
                  {selectedPit.depthMeters} Meter
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Rentang Elevasi</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                  RL +{selectedPit.elevationMax}m s/d RL {selectedPit.elevationMin}m
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Strip Ratio Desain</span>
                <span className="text-sm font-black text-amber-500 font-mono">
                  {selectedPit.stripRatio} : 1
                </span>
              </div>
            </div>

            {/* Volumetric Summary */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                Estimasi Total Volume & Cadangan Pit
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cadangan Batubara:</span>
                  <span className="font-bold text-amber-500">{(selectedPit.coalVolumeM3 / 1000000).toFixed(2)} Juta m³ ({(selectedPit.coalVolumeM3 * 1.32 / 1000000).toFixed(2)} Mt)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Overburden (OB):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{(selectedPit.wasteVolumeM3 / 1000000).toFixed(2)} Juta BCM</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Material Movement:</span>
                  <span className="font-bold text-teal-500">{(selectedPit.totalVolumeM3 / 1000000).toFixed(2)} Juta m³</span>
                </div>
              </div>
            </div>

            {/* Boundary Polygon Coordinates */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Koordinat Batas Crest Terluar (Pit Boundary / Ultimate Pit Limit):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {selectedPit.geometry.boundaryCoordinates.map((coord, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-400">Vertex #{idx + 1}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{coord.lat.toFixed(5)}°, {coord.lng.toFixed(5)}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geotechnical Quick Specs */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-emerald-500" /> Parameter Geoteknik Lereng
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Factor of Safety (FoS / FK):</span>
                <span className="text-base font-black text-emerald-500 font-mono">
                  FK = {selectedPit.factorOfSafetyFK} (Stabil Aman &gt; 1.30)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800 font-mono">
                <span className="text-slate-400 font-sans">Overall Slope Angle:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPit.overallSlopeAngleDeg}°</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800 font-mono">
                <span className="text-slate-400 font-sans">Batter / Face Angle:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPit.batterAngleDeg}°</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800 font-mono">
                <span className="text-slate-400 font-sans">Lebar Berm Pengaman:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPit.bermWidthMeters} Meter</span>
              </div>
              <div className="flex justify-between py-1.5 font-mono">
                <span className="text-slate-400 font-sans">Tinggi Single Bench:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPit.benchHeightMeters} Meter</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BENCH CONFIG */}
      {activeSubTab === "BENCH" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-teal-500 uppercase">
                  BENCH CONFIGURATION & FLITCH ELEVATIONS
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Daftar Bench Aktif & Rencana Galian (Top-Down)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{benches.length} Jenjang Terdaftar</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-bold text-slate-400 font-sans">
                    <th className="p-3">Kode Bench</th>
                    <th className="p-3">Crest RL</th>
                    <th className="p-3">Toe RL</th>
                    <th className="p-3">Tinggi</th>
                    <th className="p-3">Lebar Kerja</th>
                    <th className="p-3">Flitch Sub-bench</th>
                    <th className="p-3">Slope Face</th>
                    <th className="p-3">Tipe Material</th>
                    <th className="p-3">Status Galian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {benches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-teal-600 dark:text-teal-400">{b.benchCode}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">RL +{b.crestElevation}m</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">RL {b.toeElevation >= 0 ? "+" : ""}{b.toeElevation}m</td>
                      <td className="p-3">{b.heightMeters} m</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{b.widthMeters} m</td>
                      <td className="p-3">{b.flitchHeightMeters} m (x4 Flitch)</td>
                      <td className="p-3 text-amber-500 font-bold">{b.slopeAngleDeg}°</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.materialType === "COAL_SEAM"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}>
                          {b.materialType}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === "ACTIVE_EXCAVATION"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : b.status === "COMPLETED"
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400"
                            : "bg-sky-500/10 text-sky-500"
                        }`}>
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
      )}

      {/* SUBTAB 3: RAMP & HAUL ROAD */}
      {activeSubTab === "RAMP" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ramps.map((ramp) => (
            <div
              key={ramp.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase">{ramp.rampId}</span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{ramp.name}</h4>
                </div>
                <span className="bg-emerald-500/10 text-emerald-500 font-bold text-xs px-2.5 py-1 rounded-full">
                  {ramp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Panjang Total Ramp:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ramp.lengthMeters} Meter</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Lebar Ramp:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ramp.widthMeters} Meter (Dual Lane)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Kemiringan Grade (%):</span>
                  <span className="font-bold text-amber-500">{ramp.gradePercent}% (Aman K3 &lt; 10%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Tinggi Tanggul K3:</span>
                  <span className="font-bold text-emerald-500">{ramp.safetyBermHeightMeters} Meter</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: BERM & SLOPE STABILITY */}
      {activeSubTab === "BERM_SLOPE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-500" /> Analisis Kestabilan Lereng (Slope Stability)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pemodelan Bishop & Morgenstern-Price menunjukkan lereng Highwall Pit 1 South berada pada kondisi stabil dengan nilai Faktor Keamanan (FK) = 1.42 (Standar K3 Kepmen ESDM 1827 K &gt; 1.30).
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Muka Air Tanah (Phreatic Surface):</span>
                <span className="font-bold text-teal-500">RL -12.0m (Terdewatering Aman)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Kohesi Rata-rata (c):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">45.0 kPa</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Sudut Geser Dalam (phi):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">32.5 Derajat</span>
              </div>
              <div className="flex justify-between py-2 font-mono">
                <span className="text-slate-400 font-sans">Prisma Pemantauan RTS:</span>
                <span className="font-bold text-emerald-500">4 Titik Online (Pergeseran &lt; 0.2mm/hari)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Sliders className="h-4 w-4 text-sky-500" /> Spesifikasi Catch Berm & Safety Bund
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Berm penahan jatuhan batu (Catch Berm) didesain dengan kapasitas tampung spillover minimal 400 m³ per 100 meter lari lereng jenjang.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Lebar Catch Berm Bersih:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">6.0 Meter</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Tinggi Tanggul Pengaman (Bund):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">2.0 Meter (&gt; 0.75x Roda HD785)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Kemiringan Crossfall Drainase Berm:</span>
                <span className="font-bold text-sky-500">2.5% Mengarah ke Toe Ditch</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: PUSHBACK STAGING */}
      {activeSubTab === "PUSHBACK" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pushbacks.map((pb) => (
              <div
                key={pb.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <span className="bg-sky-500 text-white font-black text-[10px] px-2 py-0.5 rounded">
                    TAHAP #{pb.sequenceOrder}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{pb.startPeriod} - {pb.endPeriod}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{pb.name}</h4>
                <div className="space-y-1.5 text-xs font-mono pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Target Batubara:</span>
                    <span className="font-bold text-amber-500">{pb.coalReserveMt} Mt</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Volume Overburden:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pb.wasteVolumeMbc} Mbc</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Strip Ratio:</span>
                    <span className="font-bold text-teal-500">{pb.stripRatio} : 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Rentang Bench:</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{pb.targetBenchRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: MINING SEQUENCE */}
      {activeSubTab === "SEQUENCE" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-teal-500 uppercase">
                MINING CUT & HAUL SEQUENCE SCHEDULING
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Urutan Penggalian Top-Down & Alokasi Loading Fleet
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{sequences.length} Urutan Aktif</span>
          </div>

          <div className="space-y-3">
            {sequences.map((seq) => (
              <div
                key={seq.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                      PRIORITAS #{seq.priorityOrder}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {seq.benchCode} ({seq.blockId}) - {seq.materialType}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Fleet: <strong className="text-slate-800 dark:text-slate-200">{seq.assignedFleet}</strong> | Rute Tujuan: <strong className="text-teal-600 dark:text-teal-400">{seq.haulDestination}</strong>
                  </p>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="text-slate-400 block text-[10px]">{seq.period}</span>
                  <span className="font-bold text-sm text-emerald-500">{seq.volumeMbcOrMt} {seq.materialType === "COAL_SEAM" ? "Mt Coal" : "Mbc OB"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
