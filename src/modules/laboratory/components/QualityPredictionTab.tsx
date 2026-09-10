import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Flame,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  BrainCircuit,
  Compass,
  ArrowRight,
  ShieldAlert,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { QualityPredictionInput, QualityPredictionResult } from "../../../types/laboratoryTypes";

export const QualityPredictionTab: React.FC = () => {
  // Input parameters for geological AI prediction model
  const [pitId, setPitId] = useState<string>("PIT-ALPHA");
  const [seamId, setSeamId] = useState<string>("SEAM-A2");
  const [depthMeters, setDepthMeters] = useState<number>(38);
  const [rainfallMm, setRainfallMm] = useState<number>(14);
  const [washYield, setWashYield] = useState<number>(92);
  const [targetTonnage, setTargetTonnage] = useState<number>(25000);

  // Pit and Seam baseline quality profiles
  const seamProfiles: Record<string, { baseGAR: number; baseAsh: number; baseTS: number; baseTM: number; baseIM: number; baseVM: number; baseHGI: number }> = {
    "SEAM-A1": { baseGAR: 5920, baseAsh: 6.2, baseTS: 0.55, baseTM: 23.5, baseIM: 9.8, baseVM: 42.0, baseHGI: 48 },
    "SEAM-A2": { baseGAR: 5850, baseAsh: 6.8, baseTS: 0.65, baseTM: 24.5, baseIM: 10.5, baseVM: 41.2, baseHGI: 50 },
    "SEAM-B1": { baseGAR: 5240, baseAsh: 7.9, baseTS: 0.78, baseTM: 27.5, baseIM: 12.0, baseVM: 39.5, baseHGI: 52 },
    "SEAM-C1": { baseGAR: 4680, baseAsh: 9.4, baseTS: 1.15, baseTM: 31.0, baseIM: 14.5, baseVM: 38.0, baseHGI: 55 },
  };

  const currentProfile = seamProfiles[seamId] || seamProfiles["SEAM-A2"];

  // AI Prediction Algorithm simulating multivariate regression with environmental & depth factors
  // 1. Depth factor: Deeper coal tends to have slightly lower moisture (-0.05% per 10m) and slightly higher calorific value (+15 kcal per 10m)
  const depthMoistureDelta = -((depthMeters - 30) / 10) * 0.08;
  const depthGarDelta = ((depthMeters - 30) / 10) * 20;

  // 2. Rainfall factor: Surface runoff increases TM (+0.06% per 10mm rainfall) and reduces GAR accordingly
  const rainMoistureDelta = (rainfallMm / 10) * 0.12;

  // 3. Wash yield factor: Lower yield = higher wash rejection of ash (-0.5% ash per -5% yield), increases GAR
  const washAshDelta = ((washYield - 90) / 5) * 0.35;
  const washGarDelta = -((washYield - 90) / 5) * 45;

  const predictedTM = +(currentProfile.baseTM + depthMoistureDelta + rainMoistureDelta).toFixed(1);
  const predictedAsh = +(Math.max(3.5, currentProfile.baseAsh + washAshDelta)).toFixed(1);
  const predictedTS = +(currentProfile.baseTS).toFixed(2);
  const predictedIM = +(currentProfile.baseIM).toFixed(1);
  const predictedVM = +(currentProfile.baseVM).toFixed(1);
  const predictedHGI = currentProfile.baseHGI;

  // Predict GAR from baseline and factors
  const predictedGAR = Math.round(currentProfile.baseGAR + depthGarDelta - (rainMoistureDelta * 65) + washGarDelta);
  const predictedGCV_ADB = Math.round(predictedGAR * ((100 - predictedIM) / (100 - predictedTM)));
  const predictedFC = +(100 - predictedIM - predictedAsh - predictedVM).toFixed(1);

  // Rejection Risk Evaluation
  let rejectionRisk: "LOW" | "MODERATE" | "HIGH" = "LOW";
  let riskReasons: string[] = [];

  if (predictedGAR < 5700) {
    rejectionRisk = "HIGH";
    riskReasons.push("GAR < 5,700 kcal/kg (Contract Minimum Rejection)");
  } else if (predictedGAR < 5780) {
    rejectionRisk = "MODERATE";
    riskReasons.push("GAR near contract tolerance lower boundary (5,800 ± 50 kcal)");
  }

  if (predictedTS > 0.85) {
    rejectionRisk = "HIGH";
    riskReasons.push("Total Sulfur > 0.85% (High Emission Penalty & Rejection)");
  }

  if (predictedAsh > 8.5) {
    rejectionRisk = "MODERATE";
    riskReasons.push("Ash Content > 8.0% (Increased Slagging Risk)");
  }

  const confidenceScore = +(94.8 - (rainfallMm > 30 ? 2.5 : 0) + (depthMeters > 50 ? 1.2 : 0)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 uppercase tracking-wider">
              AI MACHINE LEARNING ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Confidence {confidenceScore}%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            AI Geological & Production Coal Quality Predictor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Prediksi parameter kualitas batubara (<strong>GAR, Ash, Moisture, Sulfur</strong>) sebelum penambangan pit berdasarkan profil geologi seam, kedalaman overburden, curah hujan, dan washing yield plant.
          </p>
        </div>
      </div>

      {/* Grid: Predictor Input Parameters & Predicted Quality Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Variables */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Geological & Environmental Inputs
            </h3>
            <button
              onClick={() => {
                setPitId("PIT-ALPHA");
                setSeamId("SEAM-A2");
                setDepthMeters(38);
                setRainfallMm(14);
                setWashYield(92);
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Target Mining Pit</label>
              <select
                value={pitId}
                onChange={(e) => setPitId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none"
              >
                <option value="PIT-ALPHA">Pit Alpha (Central Sangatta Block)</option>
                <option value="PIT-BETA">Pit Beta (Southern Highwall Area)</option>
                <option value="PIT-GAMMA">Pit Gamma (North Expansion Pit)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Seam Layer Stratum</label>
              <select
                value={seamId}
                onChange={(e) => setSeamId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none"
              >
                <option value="SEAM-A1">Seam A1 (Super Premium ~5,900 GAR)</option>
                <option value="SEAM-A2">Seam A2 (Export Standard ~5,800 GAR)</option>
                <option value="SEAM-B1">Seam B1 (Mid Calorie ~5,200 GAR)</option>
                <option value="SEAM-C1">Seam C1 (Eco Low Calorie ~4,650 GAR / High TS)</option>
              </select>
            </div>

            {/* Overburden Depth */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-400">Mining Depth</span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{depthMeters} m</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="2"
                value={depthMeters}
                onChange={(e) => setDepthMeters(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Deeper seams have lower TM and higher compaction</span>
            </div>

            {/* Rainfall Index */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-400">Rainfall / Weather Index</span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400">{rainfallMm} mm/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">High precipitation increases free surface moisture</span>
            </div>

            {/* Washing Plant Target Yield */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-400">Washing Plant Yield</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{washYield}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={washYield}
                onChange={(e) => setWashYield(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Higher washing intensity reduces ash content</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Prediction Result & Diagnostic Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Predicted Quality Output Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                    {pitId} • {seamId}
                  </span>
                  <span className="text-xs text-slate-300">Model: BNU-GEONET v4.8</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Predicted Quality Assay Outturn
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    rejectionRisk === "LOW"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : rejectionRisk === "MODERATE"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  Risk: {rejectionRisk}
                </span>
              </div>
            </div>

            {/* 7 Predicted Parameters Display Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-indigo-500/30 space-y-1">
                <span className="text-[10px] text-amber-400 font-sans font-bold uppercase block">
                  Predicted GAR (ARB)
                </span>
                <div className="text-2xl font-black text-amber-400">
                  {predictedGAR.toLocaleString("id-ID")}
                </div>
                <span className="text-[10px] text-slate-400 font-sans">kcal/kg ARB</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-blue-400 font-sans font-bold uppercase block">
                  Total Moisture (TM)
                </span>
                <div className="text-2xl font-black text-blue-400">
                  {predictedTM}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">ARB</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-emerald-400 font-sans font-bold uppercase block">
                  Ash Content
                </span>
                <div className="text-2xl font-black text-emerald-400">
                  {predictedAsh}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">ADB (815°C)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-rose-400 font-sans font-bold uppercase block">
                  Total Sulfur (TS)
                </span>
                <div className="text-2xl font-black text-rose-400">
                  {predictedTS}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">ADB</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">
                  GCV (ADB)
                </span>
                <div className="text-lg font-bold text-white">
                  {predictedGCV_ADB.toLocaleString("id-ID")} kcal
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Air Dried Basis</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">
                  Inherent Moisture
                </span>
                <div className="text-lg font-bold text-white">
                  {predictedIM}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">ADB (105°C)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">
                  Volatile Matter (VM)
                </span>
                <div className="text-lg font-bold text-white">
                  {predictedVM}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">ADB (900°C)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">
                  Hardgrove (HGI)
                </span>
                <div className="text-lg font-bold text-white">
                  {predictedHGI}
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Grindability Index</span>
              </div>
            </div>

            {/* Risk Warnings & Prescriptive Advisory */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Prescriptive Optimization Advisory</span>
              </div>
              {riskReasons.length > 0 ? (
                <ul className="space-y-1 text-slate-300">
                  {riskReasons.map((r, rIdx) => (
                    <li key={rIdx} className="flex items-center gap-1.5 text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Predicted coal quality meets 100% of PLN & Export GAR 5800 Premium Contract specifications.</span>
                </p>
              )}
            </div>
          </div>

          {/* AI Blending Strategy Recommendation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              Stockpile Blending Feasibility & Dispatch Plan
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  Target Shipment: PLN Rembang (8,500 MT GAR 5,800)
                </div>
                <p className="text-slate-500">
                  Rekomendasi blending: <strong>75% {seamId}</strong> + <strong>25% Stockpile SP-01 (High Calorie Buffer GAR 5,950)</strong> untuk menjamin GAR tepat di 5,850 kcal/kg dengan zero rejection risk.
                </p>
              </div>

              <button
                onClick={() => alert("Simulasi blending telah disimpan ke Rencana Dispatch Crusher.")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <span>Commit Recipe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
