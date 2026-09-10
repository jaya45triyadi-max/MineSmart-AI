// MINE SMART AI - Ramp Design & Haul Road Validation Component

import React, { useState } from "react";
import {
  Route,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Truck,
  ShieldAlert,
  Compass,
} from "lucide-react";
import { Ramp } from "../../../types/minePlanningTypes";

interface RampDesignViewProps {
  ramps: Ramp[];
  onAddRamp: (ramp: Ramp) => void;
}

export const RampDesignView: React.FC<RampDesignViewProps> = ({ ramps, onAddRamp }) => {
  const [rampName, setRampName] = useState<string>("Ramp Baru Akses Barat");
  const [lengthMeters, setLengthMeters] = useState<number>(850);
  const [widthMeters, setWidthMeters] = useState<number>(26);
  const [gradePercent, setGradePercent] = useState<number>(8.5);
  const [startElevation, setStartElevation] = useState<number>(80);
  const [endElevation, setEndElevation] = useState<number>(0);
  const [direction, setDirection] = useState<Ramp["direction"]>("INCLINE_SOUTH");

  // Ramp Engineering Limits Validation
  const validateRampEngineering = (grade: number, width: number) => {
    const warnings: string[] = [];
    if (grade > 10) {
      warnings.push("WARNING KELAMPAUAN DERAJAT RAMP (Grade > 10%): Berisiko tinggi kampas rem truk aus & overheat engine saat hauling melaju naik!");
    }
    if (width < 22) {
      warnings.push("WARNING LEBAR JALAN (< 22m): Kurang dari 3.5x lebar truk Caterpillar 777 / Komatsu HD785 untuk dua lajur aman!");
    }
    return warnings;
  };

  const currentWarnings = validateRampEngineering(gradePercent, widthMeters);

  const handleCreateRamp = () => {
    const newRamp: Ramp = {
      id: `rmp-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      rampId: `RAMP-${Date.now().toString().slice(-4)}`,
      name: rampName,
      pitId: "pit-01",
      lengthMeters,
      widthMeters,
      gradePercent,
      elevationStart: startElevation,
      elevationEnd: endElevation,
      direction,
      turningRadiusMeters: 28,
      safetyBermHeightMeters: 1.6,
      status: "DESIGNED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddRamp(newRamp);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Configurator */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-sky-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Ramp Design & Engineering Limit Standard
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">STANDAR K3 HAULING ROAD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-slate-400 font-bold block mb-1">Nama Desain Ramp:</label>
              <input
                type="text"
                value={rampName}
                onChange={(e) => setRampName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Panjang Ramp (m):</label>
              <input
                type="number"
                value={lengthMeters}
                onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 500)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Lebar Jalan (m):</label>
              <input
                type="number"
                value={widthMeters}
                onChange={(e) => setWidthMeters(parseFloat(e.target.value) || 24)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Ramp Grade (%):</label>
              <input
                type="number"
                step="0.1"
                value={gradePercent}
                onChange={(e) => setGradePercent(parseFloat(e.target.value) || 8)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-extrabold text-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Elevasi Awal (RL m):</label>
              <input
                type="number"
                value={startElevation}
                onChange={(e) => setStartElevation(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Elevasi Akhir (RL m):</label>
              <input
                type="number"
                value={endElevation}
                onChange={(e) => setEndElevation(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Arah Ramp:</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as Ramp["direction"])}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="INCLINE_SOUTH">Incline South</option>
                <option value="INCLINE_NORTH">Incline North</option>
                <option value="INCLINE_EAST">Incline East</option>
                <option value="INCLINE_WEST">Incline West</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleCreateRamp}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Ramp Ke Pit Model</span>
            </button>
          </div>
        </div>

        {/* Ramp Engineering Validation */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">
              Ramp Engineering Limits Check
            </h4>
          </div>

          {currentWarnings.length > 0 ? (
            <div className="space-y-2">
              {currentWarnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Desain Ramp Memenuhi Batas Aman Hauling K3 Tambang!</span>
            </div>
          )}
        </div>
      </div>

      {/* Ramp List Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Daftar Ramp Akses Hauling Tambang ({ramps.length} Ramp Active)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Nama Ramp</th>
                <th className="py-2.5 px-3 text-center">Panjang (m)</th>
                <th className="py-2.5 px-3 text-center">Lebar (m)</th>
                <th className="py-2.5 px-3 text-center">Ramp Grade</th>
                <th className="py-2.5 px-3 text-center">Awal RL</th>
                <th className="py-2.5 px-3 text-center">Akhir RL</th>
                <th className="py-2.5 px-3">Arah Ramp</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {ramps.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{r.name}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.lengthMeters} m</td>
                  <td className="py-3 px-3 text-center font-mono">{r.widthMeters} m</td>
                  <td className="py-3 px-3 text-center font-mono font-extrabold text-amber-500">{r.gradePercent}%</td>
                  <td className="py-3 px-3 text-center font-mono">RL +{r.elevationStart}m</td>
                  <td className="py-3 px-3 text-center font-mono">RL {r.elevationEnd}m</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{r.direction}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">
                      {r.status}
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
