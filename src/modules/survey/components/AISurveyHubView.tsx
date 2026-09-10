// MINE SMART AI - AI Survey Intelligence & Automated Surface Change Analysis Center

import React, { useState } from "react";
import {
  Sparkles,
  UploadCloud,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Compass,
  Cpu,
  RefreshCw,
  Send,
  Sliders,
  Maximize2,
  Box,
} from "lucide-react";
import { SurveyAIService } from "../../../services/survey/SurveyAIService";
import {
  AISurfaceChangeAnalysis,
  SurveySurface,
  SurveyImportJob,
} from "../../../types/surveyTypes";

interface AISurveyHubViewProps {
  surfaces: SurveySurface[];
  importJobs?: SurveyImportJob[];
  totalPointsCount: number;
}

export const AISurveyHubView: React.FC<AISurveyHubViewProps> = ({
  surfaces,
  importJobs = [],
  totalPointsCount,
}) => {
  const [baselineSurface, setBaselineSurface] = useState<string>(
    surfaces[0]?.surfaceName || "Pit 1 South July End Surface"
  );
  const [currentSurface, setCurrentSurface] = useState<string>(
    surfaces[1]?.surfaceName || "Pit 1 South Aug Mid Progress Surface"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AISurveyAnalysisState>(() =>
    SurveyAIService.analyzeSurfaceChanges(baselineSurface, currentSurface)
  );

  // Chat Query State
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "user" | "ai"; message: string; details?: any }>
  >([
    {
      sender: "ai",
      message:
        "Halo! Saya AI Geodesist & Survey Intelligence Copilot. Unggah file survei (CSV, DXF, SHP, GeoJSON, LAS, GeoTIFF) atau pilih model surface untuk mendeteksi perubahan elevasi, galian cut/fill, pergeseran lereng, dan deviasi desain tambang.",
    },
  ]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = SurveyAIService.analyzeSurfaceChanges(baselineSurface, currentSurface);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 700);
  };

  const handleSendChat = (presetText?: string) => {
    const textToSend = presetText || chatQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user" as const, message: textToSend };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatQuery("");

    setTimeout(() => {
      const aiResp = SurveyAIService.processAIQuery(textToSend, totalPointsCount);
      const aiMsg = {
        sender: "ai" as const,
        message: aiResp.isBlockedByGuardrail
          ? aiResp.blockReason || aiResp.observation
          : `${aiResp.observation} ${aiResp.spatialAnalysis}`,
        details: aiResp,
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    }, 400);
  };

  const handleDownloadReport = () => {
    const reportText = SurveyAIService.generateSurveyExecutiveReport("Sangatta Coal Mine Pit 1");
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_Survey_Surface_Change_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/50 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                AI SURVEY SURFACE CHANGE ENGINE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                ACTIVE CO-PILOT
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Surface Change & Geotechnical Deformation Analysis
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Unggah data survei mentah atau bandingkan dua model topografi untuk mendeteksi volume galian (Cut OB), timbunan (Fill), pergerakan mikro lereng pit, dan kepatuhan desain batas tambang secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Ekspor Laporan Eksekutif</span>
            </button>
          </div>
        </div>
      </div>

      {/* Surface Comparison Configuration Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Konfigurasi Perbandingan Surface
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Sistem Komputasi: TIN-to-TIN & High-Density Differential Mesh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-xs">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Surface Baseline (Referensi Awal / EOM Lalu)
            </label>
            <select
              value={baselineSurface}
              onChange={(e) => setBaselineSurface(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
            >
              {surfaces.map((s) => (
                <option key={s.id} value={s.surfaceName}>
                  {s.surfaceName} ({s.surveyDate})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Surface Target (Survei Terkini / Drone UAV / Hasil Impor)
            </label>
            <select
              value={currentSurface}
              onChange={(e) => setCurrentSurface(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
            >
              {surfaces.map((s) => (
                <option key={s.id} value={s.surfaceName}>
                  {s.surfaceName} ({s.surveyDate})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-sky-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Menganalisis..." : "Analisis AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Results Grid */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cut Volume OB */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-sky-400" />
                  Cut Volume (Penggalian OB)
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {analysisResult.productionCorrelation.achievementPct}% RKAB
                </span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {analysisResult.cutFillSummary.cutVolumeBcm.toLocaleString()}{" "}
                <span className="text-xs text-slate-400">BCM</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Max Depth: -{analysisResult.elevationChanges.maxExcavationDepthMeters}m</span>
                <span className="text-sky-300">Net: {analysisResult.cutFillSummary.netVolumeBcm.toLocaleString()} BCM</span>
              </div>
            </div>

            {/* Slope Movement Risk */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Stabilitas Lereng Pit
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                  {analysisResult.slopeMovementRisk.riskLevel} RISK
                </span>
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                4.8 <span className="text-xs text-slate-400">mm/hari</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                {analysisResult.slopeMovementRisk.criticalZones.length} Titik Kritis Terdeteksi
              </div>
            </div>

            {/* Design Compliance Score */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Kepatuhan Desain Pit Shell
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {analysisResult.designCompliance.complianceScorePct}%
                </span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                94.2% <span className="text-xs text-slate-400">Score</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-rose-400">Overbreak: +{analysisResult.designCompliance.overbreakVolumeBcm} BCM</span>
                <span className="text-amber-400">Underbreak: {analysisResult.designCompliance.underbreakVolumeBcm} BCM</span>
              </div>
            </div>

            {/* Exposed Coal Tons */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  Estimasi Batubara Terbuka
                </span>
                <span className="font-mono text-emerald-400 font-bold">+6.7%</span>
              </div>
              <div className="text-xl font-bold text-teal-300 font-mono">
                {analysisResult.productionCorrelation.coalExposedTons.toLocaleString()}{" "}
                <span className="text-xs text-slate-400">Ton</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                Area: {analysisResult.totalAreaSqm.toLocaleString()} m²
              </div>
            </div>
          </div>

          {/* Critical Zones & Visual Isopach Differential Representation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Critical Slope Movement Zones */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Zona Kritis Pergeseran Lereng (Slope Movement Alerts)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {analysisResult.slopeMovementRisk.criticalZones.length} Sektor
                </span>
              </div>

              <div className="space-y-3">
                {analysisResult.slopeMovementRisk.criticalZones.map((zone, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans">{zone.zoneName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded-full">
                        {zone.displacementRateMmPerDay} mm/hari
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-400">
                      <div>E: {zone.easting.toFixed(1)}</div>
                      <div>N: {zone.northing.toFixed(1)}</div>
                      <div>RL: {zone.elevation.toFixed(1)}m</div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {zone.riskFactor}
                    </p>

                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-sky-300 font-sans flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{zone.suggestedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Design Compliance Findings & AI Recommendations */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Temuan Kepatuhan Desain & Rekomendasi AI
                </h3>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Temuan Lapangan:</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.designCompliance.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-emerald-400 block">Rekomendasi Tindakan AI:</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.aiRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-emerald-950/20 rounded-lg border border-emerald-500/20 text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Survey Copilot Chat Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            AI Survey Intelligence Copilot (Tanya Jawab Analisis Surface)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Didukung Guardrail Anti-Rekayasa Data Ukur
          </span>
        </div>

        {/* Prompt Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "Analisis perubahan elevasi bench",
            "Deteksi pergeseran lereng berisiko",
            "Hitung overbreak pit shell",
            "Berapa volume cut & fill aktual?",
            "Status kalibrasi alat ukur",
            "Hapus point survei BH-01 (Uji Guardrail)",
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendChat(pill)}
              className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                pill.includes("Guardrail")
                  ? "bg-rose-950/30 border-rose-500/30 text-rose-300 hover:bg-rose-900/40"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-sky-500/50 hover:text-white"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat History Box */}
        <div className="max-h-[320px] overflow-y-auto space-y-3 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-sky-600 text-white shadow-md rounded-br-none"
                    : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-md"
                }`}
              >
                <div className="font-bold text-[10px] text-slate-400 mb-1 font-mono">
                  {msg.sender === "user" ? "Mine Surveyor" : "AI Survey Copilot"}
                </div>
                <div>{msg.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Tanyakan analisis perubahan surface, volume galian, atau kepatuhan desain tambang..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-sky-500 focus:outline-none font-sans"
          />
          <button
            onClick={() => handleSendChat()}
            className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
type AISurveyAnalysisState = AISurfaceChangeAnalysis;
