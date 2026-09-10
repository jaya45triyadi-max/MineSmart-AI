// MINE SMART AI - Digital Surface Model (DSM) & DTM vs DSM Comparison Engine

import React, { useState } from "react";
import {
  Layers,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Download,
  Sliders,
  Maximize2,
  Box,
} from "lucide-react";
import { DSMRecord, DTMRecord } from "../../../types/surveyTypes";
import { SurveyCalculationService } from "../../../services/survey/SurveyCalculationService";

interface DSMViewProps {
  dsms: DSMRecord[];
  dtms: DTMRecord[];
}

export const DSMView: React.FC<DSMViewProps> = ({ dsms, dtms }) => {
  const [selectedDSM, setSelectedDSM] = useState<DSMRecord>(dsms[0]);
  const [selectedDTM, setSelectedDTM] = useState<DTMRecord>(dtms[0]);

  const diffResult = SurveyCalculationService.compareDTMvsDSM(
    selectedDTM.minElevation,
    (selectedDTM.minElevation + selectedDTM.maxElevation) / 2,
    (selectedDSM.minElevation + selectedDSM.maxElevation) / 2,
    selectedDSM.areaSqm
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Digital Surface Model (DSM) & DTM vs DSM Analyzer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model permukaan permukaan riil mencakup tajuk vegetasi & obyek infrastruktur. Digunakan untuk identifikasi kliring lahan & isolasi elevasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-mono">
            UAV GSD 5 cm/pixel
          </span>
        </div>
      </div>

      {/* DTM vs DSM Split Interactive Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: DTM Terrain Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              1. Bare Earth DTM (Terrain)
            </h3>
            <span className="text-xs font-mono text-slate-400">{selectedDTM.dtmId}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Sumber Point</span>
              <span>{selectedDTM.source}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Resolusi Grid</span>
              <span className="text-emerald-400 font-bold">{selectedDTM.resolutionMeters}m</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Rentang RL Elevasi</span>
              <span className="text-amber-300 font-bold">{selectedDTM.minElevation}m - {selectedDTM.maxElevation}m RL</span>
            </div>
          </div>
        </div>

        {/* Right: DSM Surface Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              2. Full Surface DSM (Drone Canopy)
            </h3>
            <span className="text-xs font-mono text-slate-400">{selectedDSM.dsmId}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Sensors / UAV</span>
              <span>{selectedDSM.source}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Resolusi GSD</span>
              <span className="text-purple-300 font-bold">{selectedDSM.resolutionMeters}m (5cm)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Min/Max Surface RL</span>
              <span className="text-amber-300 font-bold">{selectedDSM.minElevation}m - {selectedDSM.maxElevation}m RL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Analytics Result Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/40 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Hasil Analisis Beda Tinggi DTM vs DSM (Normalized Canopy Height Model)
          </h3>
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-200 rounded font-mono">
            Automatic Differential Grid
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-slate-400 text-[10px] font-sans block uppercase">Rata-Rata Beda Tinggi</span>
            <div className="text-xl font-bold text-indigo-300">{diffResult.averageDifference} Meter</div>
            <span className="text-[10px] text-slate-400">Pohon & Tajuk Hutan</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-slate-400 text-[10px] font-sans block uppercase">Beda Tinggi Maksimal</span>
            <div className="text-xl font-bold text-purple-300">{diffResult.maxDifference} Meter</div>
            <span className="text-[10px] text-slate-400">Pohon Tinggi / Alat Berat</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-slate-400 text-[10px] font-sans block uppercase">Luas Cakupan Area</span>
            <div className="text-xl font-bold text-emerald-400">{(diffResult.areaSqm / 10000).toFixed(2)} Ha</div>
            <span className="text-[10px] text-slate-400">Total Boundary UAV</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-slate-400 text-[10px] font-sans block uppercase">Volume Offset Biomassa</span>
            <div className="text-xl font-bold text-amber-300">{diffResult.volumeDifferenceM3.toLocaleString()} m³</div>
            <span className="text-[10px] text-slate-400 font-sans">Volume Vegetasi Lahan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
