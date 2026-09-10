// MINE SMART AI - Comprehensive Coal Quality Management Center
// Covers GAR, GCV, TM, IM, Ash, Sulfur, VM, FC, HGI, AFT, Basis Conversions, and Blending Simulator

import React, { useState } from "react";
import {
  Flame,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  RefreshCw,
  Layers,
  Calculator,
  Scale,
  FileSpreadsheet,
  Download,
  Info,
} from "lucide-react";
import { CoalQualityProfile } from "../../../types/geologyTypes";
import { GeologyCalculationService } from "../../../services/geology/GeologyCalculationService";

interface CoalQualityViewProps {
  qualities: CoalQualityProfile[];
  onAddQuality?: (cq: CoalQualityProfile) => void;
}

export const CoalQualityView: React.FC<CoalQualityViewProps> = ({ qualities }) => {
  const [activeTab, setActiveTab] = useState<"matrix" | "converter" | "blending" | "thermal">("matrix");
  const [selectedSeamCode, setSelectedSeamCode] = useState<string>("ALL");

  const filteredQualities = qualities.filter(
    (q) => selectedSeamCode === "ALL" || q.seamCode === selectedSeamCode
  );

  // Statistics
  const garStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "garKcalKg");
  const gcvStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "gcvAdbKcalKg");
  const tmStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "totalMoistureAr");
  const imStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "inherentMoistureAdb");
  const ashStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "ashContentAdb");
  const tsStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "totalSulfurAdb");
  const vmStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "volatileMatterAdb");
  const fcStats = GeologyCalculationService.calculateQualityStatistics(filteredQualities, "fixedCarbonAdb");

  // Basis Converter State
  const [convGCV, setConvGCV] = useState<number>(6250);
  const [convTM, setConvTM] = useState<number>(14.5);
  const [convIM, setConvIM] = useState<number>(8.2);
  const [convAsh, setConvAsh] = useState<number>(5.8);
  const [convTS, setConvTS] = useState<number>(0.58);
  const [convVM, setConvVM] = useState<number>(41.2);
  const [convFC, setConvFC] = useState<number>(44.8);

  const convertedResults = GeologyCalculationService.convertCoalQualityBasis({
    gcvAdbKcalKg: convGCV,
    totalMoistureAr: convTM,
    inherentMoistureAdb: convIM,
    ashContentAdb: convAsh,
    totalSulfurAdb: convTS,
    volatileMatterAdb: convVM,
    fixedCarbonAdb: convFC,
  });

  // Blending Simulator State
  const [blendSeamAWeight, setBlendSeamAWeight] = useState<number>(60000);
  const [blendSeamBWeight, setBlendSeamBWeight] = useState<number>(30000);
  const [blendSeamCWeight, setBlendSeamCWeight] = useState<number>(10000);

  const blendResult = GeologyCalculationService.simulateCoalBlend([
    { name: "Seam A (Main High CV)", weightTon: blendSeamAWeight, gar: 5820, gcvAdb: 6250, tm: 14.5, im: 8.2, ash: 5.8, sulfur: 0.58 },
    { name: "Seam B (Mid CV / Med Sulfur)", weightTon: blendSeamBWeight, gar: 5240, gcvAdb: 5720, tm: 18.2, im: 10.5, ash: 9.0, sulfur: 1.15 },
    { name: "Seam C (Low CV / High Ash)", weightTon: blendSeamCWeight, gar: 4680, gcvAdb: 5150, tm: 21.5, im: 12.0, ash: 12.5, sulfur: 1.85 },
  ]);

  return (
    <div className="space-y-6">
      {/* 8 Primary Coal Quality KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. GAR */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 shadow-lg shadow-emerald-950/20">
          <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">GAR (kcal/kg)</span>
          <div className="text-lg font-bold text-white font-mono">{garStats.avg}</div>
          <span className="text-[9px] text-slate-400 font-mono">Min {garStats.min} | Max {garStats.max}</span>
        </div>

        {/* 2. GCV adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">GCV (adb)</span>
          <div className="text-lg font-bold text-emerald-400 font-mono">{gcvStats.avg}</div>
          <span className="text-[9px] text-slate-400 font-mono">Min {gcvStats.min} | Max {gcvStats.max}</span>
        </div>

        {/* 3. TM ar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-teal-400 block mb-0.5">TM (% ar)</span>
          <div className="text-lg font-bold text-teal-300 font-mono">{tmStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Total Moisture</span>
        </div>

        {/* 4. IM adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-sky-400 block mb-0.5">IM (% adb)</span>
          <div className="text-lg font-bold text-sky-300 font-mono">{imStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Inherent Moisture</span>
        </div>

        {/* 5. Ash adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-amber-400 block mb-0.5">Ash (% adb)</span>
          <div className="text-lg font-bold text-amber-300 font-mono">{ashStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Ash Content</span>
        </div>

        {/* 6. Total Sulfur adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-rose-400 block mb-0.5">Sulfur (% adb)</span>
          <div className="text-lg font-bold text-rose-300 font-mono">{tsStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Total Sulfur</span>
        </div>

        {/* 7. VM adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-indigo-400 block mb-0.5">VM (% adb)</span>
          <div className="text-lg font-bold text-indigo-300 font-mono">{vmStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Volatile Matter</span>
        </div>

        {/* 8. FC adb */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-purple-400 block mb-0.5">FC (% adb)</span>
          <div className="text-lg font-bold text-purple-300 font-mono">{fcStats.avg}%</div>
          <span className="text-[9px] text-slate-400 font-mono">Fixed Carbon</span>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "matrix"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Matriks Kualitas Batubara (GAR, GCV, TM, IM, Ash, TS, VM, FC)</span>
        </button>

        <button
          onClick={() => setActiveTab("converter")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "converter"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Kalkulator Konversi Basis (ADB → AR / GAR / DB / DAF / NAR)</span>
        </button>

        <button
          onClick={() => setActiveTab("blending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "blending"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Simulator Blending Batubara (Multi-Seam Optimization)</span>
        </button>

        <button
          onClick={() => setActiveTab("thermal")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "thermal"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sifat Termal & Grindability (HGI, AFT, Rank)</span>
        </button>
      </div>

      {/* 1. MATRIX TAB */}
      {activeTab === "matrix" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                Daftar Analisis Kualitas Batubara Laboratorium Terakreditasi
              </h3>
              <p className="text-xs text-slate-400">
                Nilai parameter proksimat, ultimat, kalori, dan sulfur per sampel interseksi borehole
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Filter Seam:</span>
              <select
                value={selectedSeamCode}
                onChange={(e) => setSelectedSeamCode(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Seam</option>
                <option value="SEAM_A">Seam Sangatta A</option>
                <option value="SEAM_B">Seam Sangatta B</option>
                <option value="SEAM_C">Seam Sangatta C</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Sampel ID</th>
                  <th className="py-2.5 px-3">Borehole</th>
                  <th className="py-2.5 px-3">Seam</th>
                  <th className="py-2.5 px-3 text-right">GAR (kcal/kg)</th>
                  <th className="py-2.5 px-3 text-right">GCV (adb)</th>
                  <th className="py-2.5 px-3 text-right">TM (% ar)</th>
                  <th className="py-2.5 px-3 text-right">IM (% adb)</th>
                  <th className="py-2.5 px-3 text-right">Ash (% adb)</th>
                  <th className="py-2.5 px-3 text-right">Sulfur (% adb)</th>
                  <th className="py-2.5 px-3 text-right">VM (% adb)</th>
                  <th className="py-2.5 px-3 text-right">FC (% adb)</th>
                  <th className="py-2.5 px-3 text-center">Neraca Proksimat</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQualities.map((q) => {
                  const proxSum = q.proximateClosureSum || (q.inherentMoistureAdb + q.ashContentAdb + q.volatileMatterAdb + q.fixedCarbonAdb);
                  const isBalanced = Math.abs(proxSum - 100) <= 0.15;
                  return (
                    <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white font-mono">{q.sampleCode}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono">{q.boreholeCode}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {q.seamCode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{q.garKcalKg}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{q.gcvAdbKcalKg}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-teal-300">{q.totalMoistureAr.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sky-300">{q.inherentMoistureAdb.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-300">{q.ashContentAdb.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-300">{q.totalSulfurAdb.toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-indigo-300">{q.volatileMatterAdb.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-purple-300">{q.fixedCarbonAdb.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            isBalanced
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {proxSum.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
                          {q.complianceGrade?.replace(/_/g, " ") || "EXPORT"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. BASIS CONVERTER TAB */}
      {activeTab === "converter" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Parameters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Parameter Masukan Laboratorium (Basis Air-Dried / adb & Total Moisture)
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Gross Calorific Value (GCV adb - kcal/kg)</label>
                <input
                  type="number"
                  value={convGCV}
                  onChange={(e) => setConvGCV(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Total Moisture (TM % ar)</label>
                <input
                  type="number"
                  step="0.1"
                  value={convTM}
                  onChange={(e) => setConvTM(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-teal-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inherent Moisture (IM % adb)</label>
                <input
                  type="number"
                  step="0.1"
                  value={convIM}
                  onChange={(e) => setConvIM(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sky-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ash Content (Ash % adb)</label>
                <input
                  type="number"
                  step="0.1"
                  value={convAsh}
                  onChange={(e) => setConvAsh(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Total Sulfur (TS % adb)</label>
                <input
                  type="number"
                  step="0.01"
                  value={convTS}
                  onChange={(e) => setConvTS(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-rose-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Volatile Matter (VM % adb)</label>
                <input
                  type="number"
                  step="0.1"
                  value={convVM}
                  onChange={(e) => setConvVM(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-indigo-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fixed Carbon (FC % adb)</label>
                <input
                  type="number"
                  step="0.1"
                  value={convFC}
                  onChange={(e) => setConvFC(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-purple-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Status Neraca Proksimat (100%)</label>
                <div
                  className={`p-2 rounded-lg font-mono font-bold text-center ${
                    convertedResults.isProximateBalanced
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {convertedResults.proximateSum}% ({convertedResults.isProximateBalanced ? "BALANCED" : "IMBALANCE"})
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Rumus standar konversi ISO 1170 & ASTM D3180: GAR = GCV_adb × ((100 - TM_ar) / (100 - IM_adb))
            </p>
          </div>

          {/* Conversion Output Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Hasil Konversi Berbagai Basis (AR, DB, DAF, NAR)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-bold block">GAR (Gross As Received)</span>
                <div className="text-2xl font-bold text-white font-mono">{convertedResults.garKcalKg} kcal/kg</div>
                <span className="text-[10px] text-slate-400">Nilai rujukan komersial & ekspor utama</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-sky-400 font-bold block">NAR (Net As Received)</span>
                <div className="text-2xl font-bold text-white font-mono">{convertedResults.narKcalKg} kcal/kg</div>
                <span className="text-[10px] text-slate-400">Koreksi kalor laten uap air</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-amber-400 font-bold block">Dry Basis (db)</span>
                <div className="text-base font-bold text-white font-mono">{convertedResults.gcvDbKcalKg} kcal/kg</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Ash (db): {convertedResults.ashDb}% | TS (db): {convertedResults.sulfurDb}%
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-purple-400 font-bold block">Dry Ash Free (daf)</span>
                <div className="text-base font-bold text-white font-mono">{convertedResults.gcvDafKcalKg} kcal/kg</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  VM (daf): {convertedResults.vmDaf}% | FC (daf): {convertedResults.fcDaf}%
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg">
              <span className="text-xs font-semibold text-slate-300 block mb-1">Parameter Basis As Received (ar):</span>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono text-slate-300">
                <div>Ash (ar): <span className="text-amber-400 font-bold">{convertedResults.ashAr}%</span></div>
                <div>TS (ar): <span className="text-rose-400 font-bold">{convertedResults.sulfurAr}%</span></div>
                <div>VM (ar): <span className="text-indigo-400 font-bold">{convertedResults.vmAr}%</span></div>
                <div>FC (ar): <span className="text-purple-400 font-bold">{convertedResults.fcAr}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BLENDING SIMULATOR TAB */}
      {activeTab === "blending" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Scale className="w-4 h-4 text-emerald-400" />
              Alokasi Tonase Pencampuran Seam (Stockpile ROM)
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold text-emerald-400">Seam A (High CV 5,820 GAR / Low Ash 5.8%)</span>
                  <span className="font-mono font-bold text-white">{blendSeamAWeight.toLocaleString()} Ton</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={blendSeamAWeight}
                  onChange={(e) => setBlendSeamAWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold text-sky-400">Seam B (Mid CV 5,240 GAR / Med Sulfur 1.15%)</span>
                  <span className="font-mono font-bold text-white">{blendSeamBWeight.toLocaleString()} Ton</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={blendSeamBWeight}
                  onChange={(e) => setBlendSeamBWeight(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-semibold text-amber-400">Seam C (Low CV 4,680 GAR / High Ash 12.5%)</span>
                  <span className="font-mono font-bold text-white">{blendSeamCWeight.toLocaleString()} Ton</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={blendSeamCWeight}
                  onChange={(e) => setBlendSeamCWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-400">Total Berat Pengapalan (Shipment):</span>
                <span className="text-base font-bold text-white font-mono">{blendResult.totalWeightTon.toLocaleString()} Ton</span>
              </div>
            </div>
          </div>

          {/* Blending Result Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Hasil Prediksi Komposisi Kualitas Campuran (Composite Blend)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-bold block">Composite GAR</span>
                <div className="text-2xl font-bold text-white font-mono">{blendResult.blendGAR} kcal/kg</div>
                <span className="text-[10px] text-slate-400">Spec Kontrak Ekspor Target: &gt; 5,500 kcal/kg</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-amber-400 font-bold block">Composite Ash (% adb)</span>
                <div className="text-2xl font-bold text-amber-300 font-mono">{blendResult.blendAsh}%</div>
                <span className="text-[10px] text-slate-400">Maksimum Batas Kontrak: &lt; 8.5%</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-rose-400 font-bold block">Composite Total Sulfur (% adb)</span>
                <div className="text-2xl font-bold text-rose-300 font-mono">{blendResult.blendSulfur}%</div>
                <span className="text-[10px] text-slate-400">Maksimum Batas Kontrak: &lt; 0.90%</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-teal-400 font-bold block">Composite Total Moisture (% ar)</span>
                <div className="text-2xl font-bold text-teal-300 font-mono">{blendResult.blendTM}%</div>
                <span className="text-[10px] text-slate-400">Maksimum Batas Kontrak: &lt; 17.0%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rekomendasi AI Blending:</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Formulasi 60% Seam A + 30% Seam B + 10% Seam C menghasilkan GAR {blendResult.blendGAR} kcal/kg dan Sulfur {blendResult.blendSulfur}%, lolos sertifikasi ekspor ICI 3 tanpa penalti kualitas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. THERMAL & GRINDABILITY TAB */}
      {activeTab === "thermal" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Ash Fusion Temperature (AFT °C)
            </h3>
            <p className="text-xs text-slate-400">Karakteristik peleburan abu di boiler (Reducing Atm)</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Deformation Temp (DT / IT)</span>
                <span className="font-bold text-white">1,220 °C</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Spherical Temp (ST)</span>
                <span className="font-bold text-white">1,280 °C</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Hemispherical Temp (HT)</span>
                <span className="font-bold text-white">1,330 °C</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Fluid Temp (FT)</span>
                <span className="font-bold text-emerald-400">1,390 °C</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Hardgrove Grindability Index (HGI)
            </h3>
            <p className="text-xs text-slate-400">Kemudahan batubara digiling di pulverizer mill</p>
            <div className="text-3xl font-bold text-sky-300 font-mono py-4 text-center bg-slate-950 rounded-lg">
              50 HGI
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Kategori: Medium Hardness (Standar PLTU Internasional 45 - 55 HGI)
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Klasifikasi Coal Rank (ASTM D388)
            </h3>
            <p className="text-xs text-slate-400">Tingkat pematangan batubara geologi</p>
            <div className="p-3 bg-slate-950 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Rank Utama:</span>
                <span className="font-bold text-amber-400">Sub-Bituminous A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">In-situ Density:</span>
                <span className="font-bold text-white">1.32 t/m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reflektansi Vitrinit:</span>
                <span className="font-bold text-white">0.52% Rv,r</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
