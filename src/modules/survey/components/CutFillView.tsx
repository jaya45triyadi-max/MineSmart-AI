// MINE SMART AI - Cut & Fill Volume Analysis Center

import React, { useState } from "react";
import {
  TrendingUp,
  Sliders,
  CheckCircle2,
  Download,
  Flame,
  ArrowRightLeft,
  Sparkles,
  Layers,
} from "lucide-react";
import { CutFillAnalysis, SurveySurface } from "../../../types/surveyTypes";
import { SurveyCalculationService } from "../../../services/survey/SurveyCalculationService";

interface CutFillViewProps {
  cutFills: CutFillAnalysis[];
  surfaces: SurveySurface[];
  onAddCutFillSubmit: (cf: CutFillAnalysis) => void;
}

export const CutFillView: React.FC<CutFillViewProps> = ({
  cutFills,
  surfaces,
  onAddCutFillSubmit,
}) => {
  const [existingSurfId, setExistingSurfId] = useState<string>(surfaces[0]?.id || "");
  const [designSurfId, setDesignSurfId] = useState<string>(surfaces[1]?.id || surfaces[0]?.id || "");
  const [method, setMethod] = useState<any>("TIN-to-TIN");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleRunCutFill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const s1 = surfaces.find((s) => s.id === existingSurfId) || surfaces[0];
      const s2 = surfaces.find((s) => s.id === designSurfId) || surfaces[1] || surfaces[0];

      const newCF = SurveyCalculationService.calculateCutAndFill(s1, s2, method);
      onAddCutFillSubmit(newCF);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Analisis Matrix Cut & Fill Volume
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perhitungan beda volume galian (Cut) dan timbunan (Fill) antar dua model permukaan DTM/DSM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cut & Fill Processor */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-sky-400" />
            Proses Komputasi Cut & Fill
          </h3>

          <form onSubmit={handleRunCutFill} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Surface Awal (Existing Ground / Surface 1)</label>
              <select
                value={existingSurfId}
                onChange={(e) => setExistingSurfId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {surfaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.surfaceName} ({s.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Surface Akhir / Desain (Surface 2)</label>
              <select
                value={designSurfId}
                onChange={(e) => setDesignSurfId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {surfaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.surfaceName} ({s.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Metode Kalkulasi Volume</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="TIN-to-TIN">TIN-to-TIN Triangulation Method</option>
                <option value="Grid Method">Grid Cell Difference Method</option>
                <option value="Cross Section Method">End Area Cross Section Method</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isProcessing ? "Menghitung Volume..." : "Hitung Cut & Fill Volume"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Historical Analysis Records */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span>Riwayat Perhitungan Cut & Fill ({cutFills.length})</span>
          </h3>

          <div className="space-y-4">
            {cutFills.map((cf) => (
              <div
                key={cf.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                      {cf.cutFillId}
                    </span>
                    <span className="text-xs font-bold text-white">{cf.boundaryName}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded uppercase font-mono">
                    {cf.balanceStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 font-sans block">Cut Volume (Galian)</span>
                    <span className="text-lg font-bold text-emerald-400">{cf.cutVolumeBcm.toLocaleString()} BCM</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-sky-500/30">
                    <span className="text-[10px] text-slate-400 font-sans block">Fill Volume (Timbunan)</span>
                    <span className="text-lg font-bold text-sky-300">{cf.fillVolumeBcm.toLocaleString()} BCM</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-purple-500/30">
                    <span className="text-[10px] text-slate-400 font-sans block">Net Volume</span>
                    <span className="text-lg font-bold text-purple-300">{cf.netVolumeBcm.toLocaleString()} BCM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Surface: {cf.existingSurfaceName} vs {cf.designSurfaceName}</span>
                  <span>Oleh: {cf.processedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
