// MINE SMART AI - AI Geology Intelligence Hub
// Comprehensive implementation of 6 Core AI Geological Workflows:
// 1. Seam correlation
// 2. Quality prediction
// 3. Anomaly detection
// 4. Geological interpretation
// 5. Data validation (QA/QC)
// 6. Resource estimation assistance (JORC/KCMI)

import React, { useState } from "react";
import {
  Sparkles,
  GitMerge,
  TrendingUp,
  AlertTriangle,
  Compass,
  ShieldCheck,
  Calculator,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  Download,
  Flame,
  ArrowRight,
  Split,
  Maximize2,
  Activity,
  Zap,
} from "lucide-react";
import {
  AIGeologySeamCorrelation,
  AIGeologyQualityPrediction,
  AIGeologyAnomaly,
  AIGeologyInterpretation,
  AIGeologyDataValidation,
  AIGeologyResourceEstimation,
} from "../../../types/geologyTypes";
import { GeologyRepository } from "../../../services/repositories/GeologyRepository";
import { GeologyAIService } from "../../../services/geology/GeologyAIService";

export const AIGeologyHubView: React.FC = () => {
  const [activeAIModule, setActiveAIModule] = useState<
    | "seam-correlation"
    | "quality-prediction"
    | "anomaly-detection"
    | "geological-interpretation"
    | "data-validation"
    | "resource-estimation"
  >("seam-correlation");

  // State Datasets from GeologyRepository / AIService
  const [correlations] = useState<AIGeologySeamCorrelation[]>(GeologyRepository.getSeamCorrelations());
  const [predictions] = useState<AIGeologyQualityPrediction[]>(GeologyRepository.getQualityPredictions());
  const [anomalies] = useState<AIGeologyAnomaly[]>(GeologyRepository.getAnomalies());
  const [interpretation] = useState<AIGeologyInterpretation>(GeologyRepository.getGeologicalInterpretation());
  const [validation] = useState<AIGeologyDataValidation>(GeologyRepository.getDataValidationSummary());
  const [resources] = useState<AIGeologyResourceEstimation[]>(GeologyRepository.getResourceEstimations());

  // Interactive Target Prediction State
  const [targetEasting, setTargetEasting] = useState<number>(516000);
  const [targetNorthing, setTargetNorthing] = useState<number>(9945500);
  const [selectedPredictionSeam, setSelectedPredictionSeam] = useState<string>("SEAM_A");
  const [livePrediction, setLivePrediction] = useState<AIGeologyQualityPrediction>(() =>
    GeologyAIService.runQualityPrediction(516000, 9945500, "SEAM_A")
  );

  const handleRecalculatePrediction = () => {
    const res = GeologyAIService.runQualityPrediction(
      Number(targetEasting),
      Number(targetNorthing),
      selectedPredictionSeam
    );
    setLivePrediction(res);
  };

  // Interactive Resource Calculation State
  const [customAreaHa, setCustomAreaHa] = useState<number>(185);
  const [customThickness, setCustomThickness] = useState<number>(12.4);
  const [customDensity, setCustomDensity] = useState<number>(1.32);
  const [customLoss, setCustomLoss] = useState<number>(5);

  const calculatedTonnageMt = Math.round(
    ((customAreaHa * 10000 * customThickness * customDensity * (1 - customLoss / 100)) / 1000000) * 100
  ) / 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                AI Geological Intelligence Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pusat Kecerdasan Buatan Geologi & Pemodelan Cadangan
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Engine AI mendalam untuk korelasi stratigrafi otomatis, prediksi spasial kualitas batubara (Kriging), deteksi anomali struktur/sesar, sintesis lingkungan pengendapan, validasi data QA/QC, dan estimasi sumberdaya JORC/KCMI 2017.
            </p>
          </div>

          <button
            onClick={() => {
              const report = GeologyAIService.generateGeologicalExecutiveReport();
              const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `AI_Geological_Report_${new Date().toISOString().slice(0, 10)}.txt`;
              link.click();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer whitespace-nowrap transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan JORC / KCMI AI</span>
          </button>
        </div>

        {/* 6 AI Workflow Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { id: "seam-correlation", label: "1. Seam Correlation", icon: GitMerge, desc: "Korelasi & Splitting" },
            { id: "quality-prediction", label: "2. Quality Prediction", icon: TrendingUp, desc: "Kriging Spasial GAR" },
            { id: "anomaly-detection", label: "3. Anomaly Detection", icon: AlertTriangle, desc: "Sesar & Outliers" },
            { id: "geological-interpretation", label: "4. Interpretation", icon: Compass, desc: "Deltaic Peat Mire" },
            { id: "data-validation", label: "5. Data Validation", icon: ShieldCheck, desc: "12-Rule QA/QC Audit" },
            { id: "resource-estimation", label: "6. Resource Estimation", icon: Calculator, desc: "JORC / KCMI Tonnage" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAIModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAIModule(tab.id as any)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isActive
                    ? "bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <div className="text-xs font-bold text-white">{tab.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{tab.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SEAM CORRELATION VIEW */}
      {/* ========================================================================= */}
      {activeAIModule === "seam-correlation" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-emerald-400" />
                  AI Automated Seam Correlation & Stratigraphic Continuity Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Algoritma pencocokan kurva geofisika (Gamma Ray / Density) dan ketebalan interval antar borehole
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Akurasi Korelasi: 97.8% (Machine Learned)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {correlations.map((cor) => (
                <div
                  key={cor.correlationId}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-white">{cor.boreholePair[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono font-bold text-xs text-white">{cor.boreholePair[1]}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {cor.correlationConfidence}% Skor
                    </span>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Seam Asal: <strong className="text-white">{cor.sourceSeamCode}</strong></span>
                      <span>Target: <strong className="text-emerald-400">{cor.targetSeamCode}</strong></span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Kemiringan Dip: <strong className="text-white">{cor.structuralDipCalculatedDeg}°</strong></span>
                      <span>Throw Sesar: <strong className="text-amber-400">{cor.throwDistanceMeters}m</strong></span>
                    </div>
                  </div>

                  {cor.isSplitDetected && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1 text-amber-300 font-bold">
                        <Split className="w-3.5 h-3.5" />
                        <span>Seam Splitting Terdeteksi</span>
                      </div>
                      <p className="text-[11px] text-amber-200/90">{cor.splitDetails}</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg">
                    {cor.aiExplanation}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Tindakan AI:</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      {cor.suggestedAction.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUALITY PREDICTION VIEW */}
      {/* ========================================================================= */}
      {activeAIModule === "quality-prediction" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Coordinates Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Target Koordinat Spasial Estimasi
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Seam Target</label>
                <select
                  value={selectedPredictionSeam}
                  onChange={(e) => setSelectedPredictionSeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold"
                >
                  <option value="SEAM_A">Seam Sangatta A (Main Seam)</option>
                  <option value="SEAM_B">Seam Sangatta B (Middle Seam)</option>
                  <option value="SEAM_C">Seam Sangatta C (Lower Seam)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Easting (UTM X - meter)</label>
                <input
                  type="number"
                  value={targetEasting}
                  onChange={(e) => setTargetEasting(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Northing (UTM Y - meter)</label>
                <input
                  type="number"
                  value={targetNorthing}
                  onChange={(e) => setTargetNorthing(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <button
                onClick={handleRecalculatePrediction}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Jalankan Ordinary Kriging AI</span>
              </button>
            </div>
          </div>

          {/* Prediction Result Display */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Hasil Prediksi Geostatistik & Kualitas Batubara (Spatial Interpolation)
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Confidence: {livePrediction.confidenceScorePercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold block">Prediksi GAR</span>
                <div className="text-xl font-bold text-white font-mono">{livePrediction.predictedGAR} kcal/kg</div>
                <span className="text-[10px] text-slate-400">Gross As Received</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-sky-400 font-bold block">Prediksi GCV (adb)</span>
                <div className="text-xl font-bold text-white font-mono">{livePrediction.predictedGCVAdb} kcal/kg</div>
                <span className="text-[10px] text-slate-400">Air Dried Basis</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-amber-400 font-bold block">Prediksi Ash (% adb)</span>
                <div className="text-xl font-bold text-amber-300 font-mono">{livePrediction.predictedAsh}%</div>
                <span className="text-[10px] text-slate-400">Kadar Abu</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-rose-400 font-bold block">Prediksi Sulfur (% adb)</span>
                <div className="text-xl font-bold text-rose-300 font-mono">{livePrediction.predictedSulfur}%</div>
                <span className="text-[10px] text-slate-400">Total Sulfur</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1.5 border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Kriging Variance: <strong className="text-white font-mono">{livePrediction.krigingVariance}</strong></span>
                <span>Jarak Sampel Terdekat: <strong className="text-white font-mono">{livePrediction.nearestSampleDistanceMeters}m</strong></span>
                <span>Titik Bor Kontributor: <strong className="text-emerald-400 font-mono">{livePrediction.contributingBoreholes.join(", ")}</strong></span>
              </div>
              <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                {livePrediction.spatialTrendDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ANOMALY DETECTION VIEW */}
      {/* ========================================================================= */}
      {activeAIModule === "anomaly-detection" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  AI Real-Time Geological Anomaly & Structural Risk Scanner
                </h3>
                <p className="text-xs text-slate-400">
                  Mendeteksi sesar tersembunyi, penipisan mendadak, intrusi termal, dan ketidaksesuaian data survei
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {anomalies.length} Anomali Terdeteksi
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((anm) => (
                <div
                  key={anm.anomalyId}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          anm.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : anm.severity === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        }`}
                      >
                        {anm.severity}
                      </span>
                      <span className="text-xs font-bold text-white">{anm.type.replace(/_/g, " ")}</span>
                      <span className="text-xs font-mono text-slate-400">({anm.boreholeCode})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">Z-Score: <strong className="text-white font-mono">{anm.statisticalZScore}σ</strong></span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {anm.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Deskripsi Deviasi:</span>
                      <p className="text-white">{anm.detectedDeviation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Analisis Akar Masalah (Root Cause):</span>
                      <p className="text-slate-300">{anm.rootCauseAnalysis}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <strong>Rekomendasi Mitigasi AI:</strong> {anm.mitigationRecommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GEOLOGICAL INTERPRETATION VIEW */}
      {/* ========================================================================= */}
      {activeAIModule === "geological-interpretation" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Compass className="w-4 h-4 text-emerald-400" />
              Model Lingkungan Pengendapan (Depositional Facies)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-bold block">Model Utama Cekungan</span>
                <div className="text-sm font-bold text-white">{interpretation.depositionalEnvironment.primaryModel}</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Arah Arus Purba (Paleocurrent): <strong className="text-slate-200">{interpretation.depositionalEnvironment.paleocurrentDirection}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Asosiasi Fasies Pengendapan:</span>
                {interpretation.depositionalEnvironment.faciesAssociations.map((fac, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4 text-emerald-400" />
              Kerangka Struktur Geologi & Tektonik
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg space-y-1">
                <span className="text-[10px] text-sky-400 font-bold block">Struktur Regional</span>
                <div className="text-sm font-bold text-white">{interpretation.structuralFramework.regionalStructure}</div>
                <div className="flex justify-between text-slate-400 pt-1 font-mono">
                  <span>Jurus (Strike): <strong className="text-white">{interpretation.structuralFramework.averageStrike}</strong></span>
                  <span>Kemiringan (Dip): <strong className="text-white">{interpretation.structuralFramework.averageDip}</strong></span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Sistem Sesar Utama:</span>
                {interpretation.structuralFramework.majorFaultSystems.map((flt, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded text-slate-300">
                    {flt}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-lg text-[11px] text-slate-300">
                {interpretation.geologicalSynthesisText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DATA VALIDATION (QA/QC) VIEW */}
      {/* ========================================================================= */}
      {activeAIModule === "data-validation" && (
        <div className="space-y-4">
          {/* Top Validation Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Skor Integritas Database</span>
              <div className="text-3xl font-bold text-emerald-400 font-mono">{validation.overallIntegrityScorePercent}%</div>
              <span className="text-[11px] text-slate-400">Total {validation.totalRecordsChecked} records diverifikasi</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Passed Checks</span>
              <div className="text-3xl font-bold text-white font-mono">{validation.passedValidationCount}</div>
              <span className="text-[11px] text-emerald-400">Sesuai standar JORC / KCMI</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Warnings / Perlu Review</span>
              <div className="text-3xl font-bold text-amber-400 font-mono">{validation.warningCount}</div>
              <span className="text-[11px] text-slate-400">Penyimpangan minor</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Critical Errors</span>
              <div className="text-3xl font-bold text-rose-400 font-mono">{validation.criticalErrorCount}</div>
              <span className="text-[11px] text-slate-400">Memerlukan re-survey</span>
            </div>
          </div>

          {/* 12-Rule Audit Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Hasil Pemindaian 12 Aturan Integritas Data Geologi (Automated Rule-Based QA/QC)
            </h3>

            <div className="space-y-2">
              {validation.checksRun.map((chk, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 rounded-lg flex items-center justify-between text-xs border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-white">{chk.checkName}</div>
                      <div className="text-[11px] text-slate-400">{chk.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        chk.passed
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {chk.passed ? "PASSED" : `${chk.issuesFound} ISSUES`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. RESOURCE ESTIMATION ASSISTANCE (JORC / KCMI) */}
      {/* ========================================================================= */}
      {activeAIModule === "resource-estimation" && (
        <div className="space-y-6">
          {/* Interactive Calculator Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Kalkulator Estimasi Tonase Poligon / Blok 3D (Formula Standar KCMI 2017)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Luas Poligon (Hektar)</label>
                <input
                  type="number"
                  value={customAreaHa}
                  onChange={(e) => setCustomAreaHa(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tebal Sejati (True Thickness - m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={customThickness}
                  onChange={(e) => setCustomThickness(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">In-situ Density (t/m³)</label>
                <input
                  type="number"
                  step="0.01"
                  value={customDensity}
                  onChange={(e) => setCustomDensity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Geological Loss (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={customLoss}
                  onChange={(e) => setCustomLoss(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] text-emerald-400 font-bold">Hasil Estimasi Tonase</span>
                <div className="text-xl font-bold text-white font-mono">{calculatedTonnageMt} Juta Ton</div>
              </div>
            </div>
          </div>

          {/* JORC Resource Breakdown Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Matriks Klasifikasi Sumberdaya Batubara Resmi (KCMI 2017 / JORC Code 2012)
                </h3>
                <p className="text-xs text-slate-400">
                  Radius observasi: Terukur (&le; 250m), Tertunjuk (250m - 500m), Tereka (500m - 1000m)
                </p>
              </div>

              <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                Total Sumberdaya Geologi: 50.53 Mt
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Lapisan Seam</th>
                    <th className="py-2.5 px-3 text-right">Luas Area (Ha)</th>
                    <th className="py-2.5 px-3 text-right">Tebal Rata-rata</th>
                    <th className="py-2.5 px-3 text-right text-emerald-400">Measured (Mt)</th>
                    <th className="py-2.5 px-3 text-right text-sky-400">Indicated (Mt)</th>
                    <th className="py-2.5 px-3 text-right text-amber-400">Inferred (Mt)</th>
                    <th className="py-2.5 px-3 text-right text-white font-bold">Total (Mt)</th>
                    <th className="py-2.5 px-3 text-right">Rata-rata GAR</th>
                    <th className="py-2.5 px-3 text-right">Rata-rata Ash</th>
                    <th className="py-2.5 px-3 text-right">Rata-rata TS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {resources.map((res) => (
                    <tr key={res.seamCode} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-white">{res.seamName}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{(res.polygonAreaM2 / 10000).toFixed(0)} Ha</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{res.averageTrueThicknessM.toFixed(2)} m</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{res.classificationBreakdown.measuredMt.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-sky-300">{res.classificationBreakdown.indicatedMt.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-300">{res.classificationBreakdown.inferredMt.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">{res.classificationBreakdown.totalResourceMt.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-300">{res.averageQuality.garKcalKg}</td>
                      <td className="py-2.5 px-3 text-right text-amber-300">{res.averageQuality.ashAdbPercent.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right text-rose-300">{res.averageQuality.tsAdbPercent.toFixed(2)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                    <td className="py-2.5 px-3 font-sans text-white">TOTAL SUMBERDAYA GEOLOGI</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">502 Ha</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">-</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">30.20 Mt</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">14.90 Mt</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">5.43 Mt</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 text-sm">50.53 Mt</td>
                    <td className="py-2.5 px-3 text-right text-emerald-300">5,510</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">7.6%</td>
                    <td className="py-2.5 px-3 text-right text-rose-300">0.91%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
