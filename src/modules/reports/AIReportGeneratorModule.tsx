// MINE SMART AI - AI Report Generator Module
// 1-Click Instant Multi-Report Synthesis & Multi-Format Export (PDF, Excel, Word)

import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Layers,
  Truck,
  ShieldCheck,
  Wrench,
  Building2,
  Pickaxe,
  TrendingUp,
  Sliders,
  Check,
  Clock,
  Send,
  Zap,
  ArrowRight,
  Eye,
  Share2,
  FileCheck,
  ChevronRight,
  Copy,
  Info,
} from "lucide-react";
import { AIReportType, ExportFormat, GeneratedAIReport } from "../../types/aiReportTypes";
import { REPORT_CONFIGS, INITIAL_AI_REPORTS } from "../../data/aiReportData";
import { ReportExporter } from "../../utils/reportExportUtils";

export const AIReportGeneratorModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<AIReportType>("DAILY_MINING");
  const [reports, setReports] = useState<Record<AIReportType, GeneratedAIReport>>(INITIAL_AI_REPORTS);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchCurrentStep, setBatchCurrentStep] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-08-16");
  const [selectedShift, setSelectedShift] = useState<"ALL" | "SHIFT_1" | "SHIFT_2">("ALL");
  const [activeSite, setActiveSite] = useState("Site Sangatta & Tutupan");
  const [showExportSuccessToast, setShowExportSuccessToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"PREVIEW" | "ALL_REPORTS" | "SCHEDULE">("PREVIEW");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const activeReport = reports[selectedReportType];
  const activeConfig = REPORT_CONFIGS.find((c) => c.type === selectedReportType) || REPORT_CONFIGS[0];

  const getReportIcon = (type: AIReportType) => {
    switch (type) {
      case "DAILY_MINING":
        return <Pickaxe className="h-5 w-5 text-amber-400" />;
      case "DAILY_PRODUCTION":
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case "WEEKLY_REPORT":
        return <Calendar className="h-5 w-5 text-blue-400" />;
      case "MONTHLY_REPORT":
        return <FileSpreadsheet className="h-5 w-5 text-purple-400" />;
      case "HSE_REPORT":
        return <ShieldCheck className="h-5 w-5 text-rose-400" />;
      case "MAINTENANCE_REPORT":
        return <Wrench className="h-5 w-5 text-cyan-400" />;
      case "FLEET_REPORT":
        return <Truck className="h-5 w-5 text-orange-400" />;
      case "MANAGEMENT_REPORT":
        return <Building2 className="h-5 w-5 text-indigo-400" />;
    }
  };

  // 1-Click Generate Single Report
  const handleGenerateSingle = (type: AIReportType) => {
    setIsGeneratingSingle(true);
    setTimeout(() => {
      setReports((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          metadata: {
            ...prev[type].metadata,
            generatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WITA",
            approvalStatus: "APPROVED",
          },
        },
      }));
      setIsGeneratingSingle(false);
      setShowExportSuccessToast(`Laporan ${type} berhasil digenerate oleh AI!`);
      setTimeout(() => setShowExportSuccessToast(null), 3000);
    }, 900);
  };

  // 1-Click Master Generate All 8 Reports
  const handleGenerateAllReports = () => {
    setIsGeneratingAll(true);
    setBatchProgress(0);
    const steps = [
      "1/8 Mengagregasi data Daily Mining Report (Pit 01 & 02)...",
      "2/8 Mensintesis ritase & volume Daily Production Report...",
      "3/8 Merekonsiliasi kemajuan Weekly W-33 Advance Bench...",
      "4/8 Menghitung neraca kepatuhan Monthly & RKAB ESDM...",
      "5/8 Menganalisis Safe Man-Hours & K3 HSE Compliance...",
      "6/8 Mengevaluasi Physical Availability (PA/MA) Maintenance...",
      "7/8 Memproses telemetri & Cycle Time Fleet FMS...",
      "8/8 Mengompilasi Executive Management & Unit Cash Cost Report...",
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setBatchCurrentStep(steps[current]);
        setBatchProgress(Math.round(((current + 1) / steps.length) * 100));
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGeneratingAll(false);
          setShowExportSuccessToast("Semua 8 Laporan Tambang berhasil disintesis oleh AI dalam 1-Klik!");
          setTimeout(() => setShowExportSuccessToast(null), 4000);
        }, 400);
      }
    }, 350);
  };

  const handleExport = (format: ExportFormat) => {
    if (format === "PDF") {
      ReportExporter.exportToPdf(activeReport);
      setShowExportSuccessToast("Dokumen PDF dibuka dalam mode cetak resmi!");
    } else if (format === "EXCEL") {
      ReportExporter.exportToExcel(activeReport);
      setShowExportSuccessToast("File Excel/CSV berhasil diunduh!");
    } else if (format === "WORD") {
      ReportExporter.exportToWord(activeReport);
      setShowExportSuccessToast("Dokumen Word (.doc) berhasil diunduh!");
    }
    setTimeout(() => setShowExportSuccessToast(null), 3000);
  };

  const handleCopySummary = () => {
    const text = `
MINE SMART AI - ${activeReport.metadata.title}
Periode: ${activeReport.metadata.periodLabel}
No. Dokumen: ${activeReport.metadata.documentNumber}

HIGHLIGHTS:
${activeReport.aiExecutiveSummary.highlights.map((h) => `• ${h}`).join("\n")}

AI INSIGHT:
${activeReport.aiExecutiveSummary.geminiInsight}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Toast Notification */}
      {showExportSuccessToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl shadow-emerald-950 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold text-sm">{showExportSuccessToast}</span>
        </div>
      )}

      {/* MASTER TOP BAR: 1-CLICK GENERATOR */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">AI Report Generator</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ⚡ 1-Click Synthesis
                  </span>
                </div>
                <p className="text-xs lg:text-sm text-slate-400">
                  Generate otomatis 8 Laporan Tambang Komprehensif (Daily, Production, Weekly, Monthly, HSE, Maintenance, Fleet & Management) dengan Ekspor PDF, Excel & Word.
                </p>
              </div>
            </div>

            {/* Quick Context Selectors */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                <span>Shift:</span>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value as any)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900">24 Jam (Shift 1 & 2)</option>
                  <option value="SHIFT_1" className="bg-slate-900">Shift 1 (Day 07-19)</option>
                  <option value="SHIFT_2" className="bg-slate-900">Shift 2 (Night 19-07)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-semibold text-slate-200">{activeSite}</span>
              </div>
            </div>
          </div>

          {/* MASTER 1-CLICK BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <button
              onClick={handleGenerateAllReports}
              disabled={isGeneratingAll}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm lg:text-base shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isGeneratingAll ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Mensintesis 8 Laporan...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 fill-slate-950" />
                  <span>⚡ 1-Click Generate All 8 Reports</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleGenerateSingle(selectedReportType)}
              disabled={isGeneratingSingle || isGeneratingAll}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-amber-400 ${isGeneratingSingle ? "animate-spin" : ""}`} />
              <span>Generate Laporan Aktif</span>
            </button>
          </div>
        </div>

        {/* Batch Progress Bar Indicator */}
        {isGeneratingAll && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-400 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                {batchCurrentStep}
              </span>
              <span className="text-white">{batchProgress}% Selesai</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${batchProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 8 REPORT SELECTOR GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Pilih 1 dari 8 Jenis Laporan Tambang
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
              8 Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("PREVIEW")}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "PREVIEW"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Document Preview
            </button>
            <button
              onClick={() => setActiveTab("ALL_REPORTS")}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "ALL_REPORTS"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Overview 8 Laporan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {REPORT_CONFIGS.map((cfg) => {
            const isSelected = selectedReportType === cfg.type;
            return (
              <button
                key={cfg.type}
                onClick={() => {
                  setSelectedReportType(cfg.type);
                  setActiveTab("PREVIEW");
                }}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative ${
                  isSelected
                    ? "bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    {getReportIcon(cfg.type)}
                  </div>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-100 line-clamp-1 leading-snug">
                  {cfg.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {cfg.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {activeTab === "PREVIEW" ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* LEFT 3 COLUMNS: OFFICIAL DOCUMENT PREVIEW */}
          <div className="xl:col-span-3 space-y-4">
            {/* DOCUMENT ACTION TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {getReportIcon(selectedReportType)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{activeReport.metadata.title}</h3>
                  <p className="text-xs text-slate-400">
                    Doc: <span className="font-mono text-slate-300">{activeReport.metadata.documentNumber}</span> • {activeReport.metadata.periodLabel}
                  </p>
                </div>
              </div>

              {/* EXPORT ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Export:</span>

                {/* PDF EXPORT */}
                <button
                  onClick={() => handleExport("PDF")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all shadow-sm"
                  title="Ekspor ke PDF Cetak Resmi"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </button>

                {/* EXCEL EXPORT */}
                <button
                  onClick={() => handleExport("EXCEL")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all shadow-sm"
                  title="Ekspor ke Excel / CSV Spreadsheet"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Excel (.xlsx)</span>
                </button>

                {/* WORD EXPORT */}
                <button
                  onClick={() => handleExport("WORD")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs transition-all shadow-sm"
                  title="Ekspor ke Microsoft Word (.doc)"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Word (.doc)</span>
                </button>

                {/* COPY SUMMARY */}
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs transition-all"
                  title="Salin Ringkasan Teks"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* THE OFFICIAL REPORT SHEET (A4 STYLE LIVE CANVAS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl">
              {/* DOCUMENT HEADER / KOP SURAT TAMBANG */}
              <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                    MS
                  </div>
                  <div>
                    <div className="text-base font-black tracking-tight text-white">
                      {activeReport.metadata.companyName}
                    </div>
                    <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                      MINE SMART AI • SITE OPERATIONAL MANAGEMENT SYSTEM
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Operasi Penambangan Terbuka • {activeReport.metadata.siteName}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-right text-xs space-y-0.5">
                  <div className="text-slate-400">Nomor Dokumen:</div>
                  <div className="font-mono font-bold text-amber-400">{activeReport.metadata.documentNumber}</div>
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-emerald-400 font-bold">TERVERIFIKASI KTT</span>
                  </div>
                </div>
              </div>

              {/* REPORT TITLE BANNER */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">{activeReport.metadata.title}</h2>
                    <p className="text-xs text-slate-300 mt-0.5">{activeReport.metadata.subtitle}</p>
                  </div>
                  <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Periode: {activeReport.metadata.periodLabel}
                  </span>
                </div>
              </div>

              {/* 4 KEY KPI HIGHLIGHT CARDS */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  I. Key Performance Indicators (KPI Operasional)
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeReport.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-1"
                    >
                      <div className="text-[11px] font-bold text-slate-400 uppercase line-clamp-1">
                        {kpi.label}
                      </div>
                      <div className="text-xl font-black text-white flex items-baseline gap-1">
                        {kpi.actual}
                        <span className="text-xs font-normal text-slate-400">{kpi.unit}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Target: {kpi.target}</span>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded ${
                            kpi.variancePct >= 0
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {kpi.variancePct > 0 ? "+" : ""}
                          {kpi.variancePct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI EXECUTIVE SUMMARY & FORENSIC SYNTHESIS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>II. AI Executive Synthesis & Insights (Gemini 3.7 Engine)</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    Confidence: {activeReport.aiExecutiveSummary.confidenceScore}%
                  </span>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                  {/* Highlights */}
                  <div>
                    <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Ringkasan Eksekutif & Temuan Kunci:</span>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc text-slate-300">
                      {activeReport.aiExecutiveSummary.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Flagged Anomalies */}
                  {activeReport.aiExecutiveSummary.criticalAnomalies.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        <span>Anomali Terdeteksi:</span>
                      </div>
                      <ul className="space-y-1 pl-5 list-disc text-rose-200">
                        {activeReport.aiExecutiveSummary.criticalAnomalies.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prescriptive Actions */}
                  <div>
                    <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>Tindakan Rekomendasi Preskriptif:</span>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc text-slate-300">
                      {activeReport.aiExecutiveSummary.actionItems.map((ai, i) => (
                        <li key={i}>{ai}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Gemini Quote */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 italic text-slate-400 text-[11px]">
                    <span className="font-bold text-amber-400 not-italic">AI Outlook:</span>
                    <span>"{activeReport.aiExecutiveSummary.geminiInsight}"</span>
                  </div>
                </div>
              </div>

              {/* DATA TABLES SECTION */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  III. Rincian Data Tabular Lengkap
                </div>
                {activeReport.tables.map((table, tIdx) => (
                  <div key={tIdx} className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">{table.title}</div>
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-800/90 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            {table.columns.map((col, cIdx) => (
                              <th
                                key={cIdx}
                                className={`py-2.5 px-3 border-b border-slate-700 text-${
                                  col.align || "left"
                                }`}
                              >
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                          {table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                              {table.columns.map((col, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-2.5 px-3 text-${col.align || "left"} text-slate-300`}
                                >
                                  {col.key === "status" || col.key === "efficiency" ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                      {row[col.key]}
                                    </span>
                                  ) : (
                                    row[col.key]
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}

                          {/* Table Totals Row */}
                          {table.totals && (
                            <tr className="bg-slate-800/80 font-bold text-amber-300 border-t-2 border-slate-700">
                              {table.columns.map((col, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-2.5 px-3 text-${col.align || "left"}`}
                                >
                                  {table.totals![col.key] || ""}
                                </td>
                              ))}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* KTT APPROVAL & SIGNATURE BLOCK */}
              <div className="pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  IV. Otorisasi & Verifikasi Legal Tambang
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <div className="text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
                    <div className="text-xs text-slate-400">Dibuat & Diverifikasi oleh:</div>
                    <div className="h-14 flex items-center justify-center">
                      <div className="font-serif italic text-base text-amber-400/90 tracking-wide font-bold">
                        {activeReport.complianceSignoff.mineSuperintendentSignature.split(" (")[0]}
                      </div>
                    </div>
                    <div className="border-t border-slate-700 pt-1 text-xs font-bold text-slate-200">
                      {activeReport.complianceSignoff.mineSuperintendentSignature}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-xs text-slate-400">Disetujui oleh Kepala Teknik Tambang (KTT):</div>
                    <div className="h-14 flex items-center justify-center">
                      <div className="font-serif italic text-base text-emerald-400/90 tracking-wide font-bold">
                        {activeReport.complianceSignoff.kttSignature}
                      </div>
                    </div>
                    <div className="border-t border-slate-700 pt-1 text-xs font-bold text-slate-200">
                      {activeReport.complianceSignoff.kttSignature}
                      <div className="text-[10px] font-normal text-slate-400">
                        SK KTT ESDM No. 482/ESDM/2021
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-4 px-1">
                  <div>Digital Sign Hash: <span className="font-mono text-slate-300">{activeReport.complianceSignoff.qrHash}</span></div>
                  <div>Dokumen Sah Sesuai Kepmen ESDM No 1827 K/30/MEM/2018</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: QUICK EXPORT & REPORT DETAILS */}
          <div className="space-y-4">
            {/* EXPORT HUB CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm">Download & Export Hub</h3>
              </div>
              <p className="text-xs text-slate-400">
                Pilih format berkas untuk laporan <strong className="text-slate-200">{activeReport.metadata.title}</strong>:
              </p>

              <div className="space-y-2.5">
                {/* PDF Button */}
                <button
                  onClick={() => handleExport("PDF")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/50 text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-slate-100">PDF Document</div>
                      <div className="text-[10px] text-slate-400">Print ready with KTT Stamp</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-rose-400" />
                </button>

                {/* Excel Button */}
                <button
                  onClick={() => handleExport("EXCEL")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-slate-100">Microsoft Excel</div>
                      <div className="text-[10px] text-slate-400">.xlsx / .csv spreadsheet</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
                </button>

                {/* Word Button */}
                <button
                  onClick={() => handleExport("WORD")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-500/50 text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                      <FileCode className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-slate-100">Microsoft Word</div>
                      <div className="text-[10px] text-slate-400">.doc editable narrative</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                </button>
              </div>

              {/* BATCH EXPORT ALL 8 REPORTS */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    // Export all in sequence
                    (Object.values(reports) as GeneratedAIReport[]).forEach((rep) => ReportExporter.exportToExcel(rep));
                    setShowExportSuccessToast("Semua 8 file Excel berhasil diunduh secara batch!");
                    setTimeout(() => setShowExportSuccessToast(null), 3500);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download All 8 Reports (ZIP/Batch)</span>
                </button>
              </div>
            </div>

            {/* AUTOMATED DISTRIBUTION SCHEDULE CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-slate-100 text-sm">Auto-Distribution</h3>
              </div>
              <p className="text-xs text-slate-400">
                Jadwal pengiriman otomatis via WhatsApp & Email ke stakeholder tambang:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">KTT & GM Operations</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono">07:00 WITA Daily</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">ESDM Minerba Gateway</span>
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono">Monthly RKAB</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">HSE & Safety Committee</span>
                  </div>
                  <span className="text-[11px] text-rose-400 font-mono">Weekly Shift Talk</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowExportSuccessToast("Pesan broadcast laporan telah dikirimkan ke KTT & GM via WhatsApp!");
                  setTimeout(() => setShowExportSuccessToast(null), 3000);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                <Share2 className="h-3.5 w-3.5 text-blue-400" />
                <span>Kirim WhatsApp Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ALL 8 REPORTS OVERVIEW TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REPORT_CONFIGS.map((cfg) => {
            const report = reports[cfg.type];
            return (
              <div
                key={cfg.type}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getReportIcon(cfg.type)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Ready to Export
                    </span>
                  </div>

                  <h3 className="font-black text-slate-100 text-sm">{report.metadata.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cfg.shortDesc}</p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Metrik Utama:</div>
                    <div className="font-bold text-amber-300">{cfg.primaryMetric}</div>
                    <div className="text-[10px] text-slate-400">{report.metadata.periodLabel}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedReportType(cfg.type);
                      setActiveTab("PREVIEW");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Lihat Dokumen</span>
                  </button>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => ReportExporter.exportToPdf(report)}
                      className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-slate-700 transition-all text-center"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => ReportExporter.exportToExcel(report)}
                      className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-slate-700 transition-all text-center"
                    >
                      Excel
                    </button>
                    <button
                      onClick={() => ReportExporter.exportToWord(report)}
                      className="py-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-slate-700 transition-all text-center"
                    >
                      Word
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
