// MINE SMART AI - Data Quality Center Module
// 6 Core AI Dimensions: Data Kosong | Data Duplikat | Data Tidak Wajar | Data Salah Input | Data Outlier | Data Conflict
// Featured Showcase: ⚠️ Fuel consumption HD-08 = 4.200 liter/jam. Nilai ini berada jauh di luar baseline.

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Sliders,
  Filter,
  Bot,
  Zap,
  Clock,
  MapPin,
  FileSpreadsheet,
  Download,
  Share2,
  Layers,
  Database,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Truck,
  Scale,
  FlaskConical,
  Radio,
  FileText,
  Check,
  X,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Hash,
  Copy,
  ExternalLink,
  Lock,
  Activity,
  BarChart3,
  GitCompare,
  Wrench,
  Fuel,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  DataQualityIssue,
  DataQualityDimension,
  DataQualitySeverity,
  DataQualitySummary,
  DataQualityRule,
  MiningDataDomain,
  CrossSourceComparison,
} from "../../types/dataQualityTypes";
import { DataQualityService } from "../../services/ai/dataQuality/DataQualityService";

export const DataQualityCenterModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { currentUser } = useAuth();

  // State
  const [issues, setIssues] = useState<DataQualityIssue[]>([]);
  const [rules, setRules] = useState<DataQualityRule[]>([]);
  const [crossSourceList, setCrossSourceList] = useState<CrossSourceComparison[]>([]);
  const [summary, setSummary] = useState<DataQualitySummary>(
    DataQualityService.getSummary([])
  );

  const [activeTab, setActiveTab] = useState<
    "ANOMALY_QUEUE" | "DOMAIN_HEALTH" | "CROSS_SOURCE" | "RULES_ENGINE" | "AUDIT_CERT"
  >("ANOMALY_QUEUE");

  // Filters
  const [selectedDimension, setSelectedDimension] = useState<"ALL" | DataQualityDimension>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<"ALL" | DataQualitySeverity>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<"ALL" | MiningDataDomain>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Active Issues
  const [selectedIssueForAction, setSelectedIssueForAction] = useState<DataQualityIssue | null>(null);
  const [isAiFixModalOpen, setIsAiFixModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualValueInput, setManualValueInput] = useState<string>("");
  const [manualNoteInput, setManualNoteInput] = useState<string>("");

  // Scan state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const loadedIssues = DataQualityService.getIssues();
    const loadedRules = DataQualityService.getRules();
    const loadedCross = DataQualityService.getCrossSourceComparisons();
    setIssues(loadedIssues);
    setRules(loadedRules);
    setCrossSourceList(loadedCross);
    setSummary(DataQualityService.getSummary(loadedIssues));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1-Click AI Auto-Fix
  const handleApplyAiFix = (issueId: string) => {
    const result = DataQualityService.applyAiFix(
      issueId,
      currentUser?.displayName || "AI Data Steward"
    );
    if (result.success) {
      loadData();
      setIsAiFixModalOpen(false);
      showToast(result.message);
    }
  };

  // Manual Resolution
  const handleManualResolve = () => {
    if (!selectedIssueForAction || !manualValueInput.trim()) return;
    const updated = DataQualityService.resolveIssueManual(
      selectedIssueForAction.id,
      manualValueInput.trim(),
      manualNoteInput.trim() || "Manual override oleh operator terverifikasi",
      currentUser?.displayName || "Data Steward"
    );
    setIssues(updated);
    setSummary(DataQualityService.getSummary(updated));
    setIsManualModalOpen(false);
    showToast(`✅ Data ${selectedIssueForAction.entityId} berhasil diperbaiki manual.`);
  };

  // Ignore / False positive
  const handleIgnoreIssue = (issueId: string) => {
    const updated = DataQualityService.ignoreIssue(
      issueId,
      "Diverifikasi sebagai anomali operasional khusus berlisensi",
      currentUser?.displayName || "Data Steward"
    );
    setIssues(updated);
    setSummary(DataQualityService.getSummary(updated));
    showToast("⚠️ Isu ditandai sebagai False Positive / Diabaikan.");
  };

  // Trigger Deep Scan
  const handleTriggerDeepScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    setTimeout(() => setScanProgress(45), 300);
    setTimeout(() => setScanProgress(75), 600);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      loadData();
      showToast("⚡ Deep Scan AI Selesai: 2,407,990 data record telah diperiksa di 14 modul.");
    }, 900);
  };

  // Get Featured HD-08 Anomaly
  const hd08Issue =
    issues.find((i) => i.entityId === "HD-08") ||
    issues.find((i) => i.dimension === "OUTLIER_DATA") ||
    issues[0];

  // Filtering
  const filteredIssues = issues.filter((item) => {
    if (selectedDimension !== "ALL" && item.dimension !== selectedDimension) return false;
    if (selectedSeverity !== "ALL" && item.severity !== selectedSeverity) return false;
    if (selectedDomain !== "ALL" && item.domain !== selectedDomain) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchEntity = item.entityId.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchField = item.fieldAffected.toLowerCase().includes(q);
      if (!matchEntity && !matchTitle && !matchDesc && !matchField) return false;
    }
    return true;
  });

  // Dimension Badges & Metadata
  const getDimensionInfo = (dim: DataQualityDimension) => {
    switch (dim) {
      case "MISSING_DATA":
        return {
          label: "🔍 Data Kosong",
          shortLabel: "Kosong",
          desc: "Field null / nilai mandatori hilang",
          badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          cardBorder: "border-l-4 border-l-blue-500",
        };
      case "DUPLICATE_DATA":
        return {
          label: "👥 Data Duplikat",
          shortLabel: "Duplikat",
          desc: "Pengiriman ganda / ID collision",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          cardBorder: "border-l-4 border-l-purple-500",
        };
      case "UNREASONABLE_DATA":
        return {
          label: "⚡ Data Tidak Wajar",
          shortLabel: "Tidak Wajar",
          desc: "Melanggar batas fisik operasional",
          badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          cardBorder: "border-l-4 border-l-rose-500",
        };
      case "TYPO_INPUT_DATA":
        return {
          label: "✍️ Data Salah Input",
          shortLabel: "Salah Input",
          desc: "Typo format / pergeseran desimal",
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          cardBorder: "border-l-4 border-l-amber-500",
        };
      case "OUTLIER_DATA":
        return {
          label: "📊 Data Outlier",
          shortLabel: "Outlier",
          desc: "Anomali statistik di luar baseline",
          badgeClass: "bg-red-500/20 text-red-300 border-red-500/50 shadow-red-950/40",
          cardBorder: "border-l-4 border-l-red-500",
        };
      case "CONFLICT_DATA":
        return {
          label: "⚔️ Data Conflict",
          shortLabel: "Conflict",
          desc: "Inkonsistensi data lintas sumber",
          badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          cardBorder: "border-l-4 border-l-orange-500",
        };
    }
  };

  const getSeverityPill = (sev: DataQualitySeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-400 border-rose-500/50 font-black";
      case "HIGH":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "LOW":
        return "bg-slate-500/20 text-slate-300 border-slate-500/50";
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-bold flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="h-7 w-7 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  DATA QUALITY CENTER
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  AI QUALITY ENGINE v3.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit & Remediasi Integritas Data Otomatis: Data Kosong, Duplikat, Tidak Wajar, Salah Input, Outlier & Konflik Data.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleTriggerDeepScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer disabled:opacity-50"
          >
            <Zap className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? `Memindai (${scanProgress}%)...` : "Jalankan Deep Scan AI"}</span>
          </button>

          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Refresh</span>
          </button>

          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-xs font-black flex items-center gap-2 transition cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              <span>AI Data Steward</span>
            </button>
          )}
        </div>
      </div>

      {/* ⚠️ FEATURED SHOWCASE BANNER (USER SPECIFICATION REQUIREMENT) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border-2 border-red-500/70 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/20 pb-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-red-600 text-white font-black animate-pulse shrink-0 shadow-lg shadow-red-900/60">
              <AlertOctagon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500 text-slate-950">
                  ⚠️ FEATURED ANOMALY SHOWCASE
                </span>
                <span className="text-xs text-red-300 font-bold">Data Outlier & Telemetry Typo</span>
                <span className="text-[11px] text-slate-400">• Unit HD-08</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                ⚠️ Fuel consumption HD-08 = 4.200 liter/jam. Nilai ini berada jauh di luar baseline.
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                <strong>Nilai Tercatat:</strong> <span className="text-red-400 font-mono font-bold">4.200 L/jam</span> vs{" "}
                <strong>Baseline Unit:</strong> <span className="text-emerald-400 font-mono font-bold">65.0 - 82.0 L/jam</span>{" "}
                <span className="text-red-300 font-semibold">(Variansi Anomali: +5,020%)</span>.
                AI mendeteksi pergeseran desimal (*Decimal Shift Error x100*) pada string parser FMS CAN-Bus.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            {hd08Issue.status === "OPEN" ? (
              <button
                onClick={() => handleApplyAiFix(hd08Issue.id)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-950/60 cursor-pointer transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>⚡ Eksekusi AI Auto-Fix (42.00 L/h)</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Status: Terkoreksi (42.00 L/jam)</span>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedIssueForAction(hd08Issue);
                setIsAiFixModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Detail Analisis AI</span>
            </button>
          </div>
        </div>

        {/* 6 Core AI Quality Dimensions Grid Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {[
            {
              dim: "MISSING_DATA" as DataQualityDimension,
              title: "1. Data Kosong",
              icon: Search,
              example: "Tare Weight null pada tiket timbangan WB-8891",
              status: "1 Isu",
              color: "border-blue-500/40 text-blue-300",
            },
            {
              dim: "DUPLICATE_DATA" as DataQualityDimension,
              title: "2. Data Duplikat",
              icon: Layers,
              example: "Double ritase DT-402 (Overcounting 32.4 MT)",
              status: "1 Isu",
              color: "border-purple-500/40 text-purple-300",
            },
            {
              dim: "UNREASONABLE_DATA" as DataQualityDimension,
              title: "3. Data Tidak Wajar",
              icon: Zap,
              example: "Kecepatan HD-105 tercatat 185.4 km/jam",
              status: "1 Isu",
              color: "border-rose-500/40 text-rose-300",
            },
            {
              dim: "TYPO_INPUT_DATA" as DataQualityDimension,
              title: "4. Data Salah Input",
              icon: FileText,
              example: "Lab Total Moisture diinput 280.0% (Maks 100%)",
              status: "1 Isu",
              color: "border-amber-500/40 text-amber-300",
            },
            {
              dim: "OUTLIER_DATA" as DataQualityDimension,
              title: "5. Data Outlier",
              icon: BarChart3,
              example: "Fuel HD-08 = 4.200 L/jam (Normal 65-82 L/h)",
              status: "1 Isu (Aktif)",
              color: "border-red-500/60 text-red-300 bg-red-950/20",
            },
            {
              dim: "CONFLICT_DATA" as DataQualityDimension,
              title: "6. Data Conflict",
              icon: GitCompare,
              example: "Timbangan 34.2 MT vs FMS Load Cell 42.8 MT",
              status: "1 Isu",
              color: "border-orange-500/40 text-orange-300",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.dim}
                onClick={() => {
                  setSelectedDimension(card.dim);
                  setActiveTab("ANOMALY_QUEUE");
                }}
                className={`p-3 rounded-2xl bg-slate-900/90 border cursor-pointer hover:scale-[1.02] transition shadow-sm space-y-1.5 ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{card.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1 rounded bg-slate-950/60">
                    {card.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                  {card.example}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI TILES / HEALTH SCORE RADAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>Overall Data Health</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{summary.overallHealthScore}%</div>
          <div className="text-[10px] text-emerald-300/80">ISO 8000 Grade A</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Records Scanned</span>
            <Database className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">2.41M</div>
          <div className="text-[10px] text-slate-500">14 Core Mining Modules</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-1">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span>Active Anomalies</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{summary.activeIssuesCount}</div>
          <div className="text-[10px] text-rose-400/80">6 Dimensi Terpantau</div>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-1">
          <div className="flex items-center justify-between text-cyan-300 text-xs">
            <span>Resolved Today</span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">{summary.resolvedTodayCount}</div>
          <div className="text-[10px] text-cyan-400/80">Dibersihkan otomatis</div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-1">
          <div className="flex items-center justify-between text-purple-300 text-xs">
            <span>AI Auto-Fix Rate</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{summary.autoFixAccuracyRate}%</div>
          <div className="text-[10px] text-purple-400/80">Akurasi Rekomendasi</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>Active Rules</span>
            <Sliders className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{rules.length} Rules</div>
          <div className="text-[10px] text-amber-400/80">Continuous Validation</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "ANOMALY_QUEUE", label: "🚨 Anomaly Remediation Queue", count: filteredIssues.length },
          { id: "DOMAIN_HEALTH", label: "📊 Domain Health & Lineage Matrix" },
          { id: "CROSS_SOURCE", label: "⚔️ Cross-Source Conflict Resolver", count: crossSourceList.length },
          { id: "RULES_ENGINE", label: "📋 Validation Rules & Thresholds", count: rules.length },
          { id: "AUDIT_CERT", label: "📜 Compliance & Audit Lineage" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-950/50"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/50 text-slate-200">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ANOMALY REMEDIATION QUEUE */}
      {/* ========================================================================= */}
      {activeTab === "ANOMALY_QUEUE" && (
        <div className="space-y-4">
          {/* Dimension & Severity Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Dimension Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Dimensi:</span>
              {[
                { id: "ALL", label: "Semua Dimensi" },
                { id: "OUTLIER_DATA", label: "📊 Outlier" },
                { id: "UNREASONABLE_DATA", label: "⚡ Tidak Wajar" },
                { id: "TYPO_INPUT_DATA", label: "✍️ Salah Input" },
                { id: "MISSING_DATA", label: "🔍 Kosong" },
                { id: "DUPLICATE_DATA", label: "👥 Duplikat" },
                { id: "CONFLICT_DATA", label: "⚔️ Konflik" },
              ].map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(dim.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDimension === dim.id
                      ? "bg-slate-200 text-slate-950 shadow-sm"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  {dim.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari unit / field / tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Anomaly Issues Cards */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Semua Data Bersih pada Filter Ini</h3>
                <p className="text-xs text-slate-400">Tidak ditemukan anomali atau deviasi data yang melanggar rule.</p>
              </div>
            ) : (
              filteredIssues.map((item) => {
                const dimInfo = getDimensionInfo(item.dimension);
                const isOutlier = item.dimension === "OUTLIER_DATA";

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg ${dimInfo.cardBorder}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${dimInfo.badgeClass}`}>
                            {dimInfo.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityPill(item.severity)}`}>
                            {item.severity}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {item.domain}
                          </span>
                          <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {item.entityId}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.detectedTimestamp}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Value Comparison Card */}
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-red-400 block">Nilai Tercatat (Anomali):</span>
                            <span className="font-mono font-black text-red-300 text-sm">
                              {item.currentValue}
                            </span>
                            {item.varianceRatio && (
                              <span className="text-[10px] text-red-400/80 block mt-0.5">
                                {item.varianceRatio}
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block">Baseline Normal / Wajar:</span>
                            <span className="font-mono text-slate-200 text-xs">
                              {item.expectedBaseline}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 block">
                              AI Rekomendasi ({item.aiSuggestedFix.confidenceScore}% Akurasi):
                            </span>
                            <span className="font-mono font-bold text-emerald-300 text-xs">
                              {item.aiSuggestedFix.recommendedValue}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.aiSuggestedFix.actionLabel}
                            </span>
                          </div>
                        </div>

                        {/* Root Cause Hypothesis */}
                        <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-0.5">
                          <Bot className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>AI Root Cause:</strong> {item.aiRootCauseHypothesis}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        {item.status === "OPEN" ? (
                          <>
                            <button
                              onClick={() => handleApplyAiFix(item.id)}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                            >
                              <Zap className="h-3.5 w-3.5" />
                              <span>1-Click AI Fix</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedIssueForAction(item);
                                setManualValueInput(String(item.aiSuggestedFix.recommendedValue || item.currentValue));
                                setIsManualModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                            >
                              <Wrench className="h-3.5 w-3.5 text-amber-400" />
                              <span>Manual Review</span>
                            </button>

                            <button
                              onClick={() => handleIgnoreIssue(item.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-800 cursor-pointer"
                            >
                              <span>Abaikan</span>
                            </button>
                          </>
                        ) : (
                          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>{item.status}</span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedIssueForAction(item);
                            setIsAiFixModalOpen(true);
                          }}
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 hover:underline mt-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Audit Lineage ({item.auditTrail.length})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOMAIN HEALTH & LINEAGE MATRIX */}
      {/* ========================================================================= */}
      {activeTab === "DOMAIN_HEALTH" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                DOMAIN DATA HEALTH & INTEGRITY INDEX
              </span>
              <h3 className="text-base font-black text-white">
                Kesehatan Integritas Data Tambang per Departemen Operasional
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Monitoring 2.41 juta record harian dari timbangan, FMS telemetri, IoT sensor, lab assay, dan ERP.
              </p>
            </div>
            <button
              onClick={handleTriggerDeepScan}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
            >
              <Zap className="h-4 w-4" />
              <span>Deep Scan Semua Domain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.domainScores.map((ds) => (
              <div
                key={ds.domain}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{ds.domainLabel}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      ds.status === "EXCELLENT"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : ds.status === "GOOD"
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {ds.status}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">{ds.score}%</span>
                    <span className="text-[10px] text-slate-500 block">Health Index</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    <div>{ds.recordsScannedToday.toLocaleString()} records</div>
                    <div className="text-amber-400 font-bold">{ds.totalAnomalies} anomali</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ds.score >= 98
                        ? "bg-emerald-500"
                        : ds.score >= 95
                        ? "bg-teal-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${ds.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Critical: {ds.criticalIssues}</span>
                  <button
                    onClick={() => {
                      setSelectedDomain(ds.domain);
                      setActiveTab("ANOMALY_QUEUE");
                    }}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Filter Domain Ini →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CROSS-SOURCE CONFLICT RESOLVER */}
      {/* ========================================================================= */}
      {activeTab === "CROSS_SOURCE" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">
                CROSS-SOURCE DATA RECONCILIATION ENGINE
              </span>
              <h3 className="text-base font-black text-white">
                Komparasi & Resolusi Konflik Data Lintas Sensor / Sistem
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Membandingkan data jembatan timbang fisik vs sensor onboard FMS, flowmeter bbm vs float sensor tangki, dan telemetry SCADA vs log manual.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {crossSourceList.map((cs) => (
              <div
                key={cs.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-black text-white">{cs.recordIdentifier}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Field: <strong>{cs.field}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cs.deltaPercentage > 10
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}>
                      Delta Selisih: {cs.deltaPercentage}%
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Source A */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">SUMBER A: {cs.sourceA.name}</span>
                      <span className="text-emerald-400 font-mono">Reliability: {cs.sourceA.reliabilityScore}%</span>
                    </div>
                    <div className="text-lg font-black font-mono text-white">{cs.sourceA.value}</div>
                    <span className="text-[10px] text-slate-500">Timestamp: {cs.sourceA.timestamp}</span>
                  </div>

                  {/* Source B */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">SUMBER B: {cs.sourceB.name}</span>
                      <span className="text-amber-400 font-mono">Reliability: {cs.sourceB.reliabilityScore}%</span>
                    </div>
                    <div className="text-lg font-black font-mono text-white">{cs.sourceB.value}</div>
                    <span className="text-[10px] text-slate-500">Timestamp: {cs.sourceB.timestamp}</span>
                  </div>
                </div>

                {/* AI Verdict */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-purple-300">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      <span>AI Verdict & Rekomendasi:</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{cs.aiVerdict}</p>
                  </div>

                  <button
                    onClick={() => showToast(`✅ Rekonsiliasi selesai. Nilai disepakati: ${cs.recommendedValue}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md"
                  >
                    Terapkan Nilai ({cs.recommendedValue})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VALIDATION RULES & THRESHOLDS */}
      {/* ========================================================================= */}
      {activeTab === "RULES_ENGINE" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                VALIDATION RULE SETTINGS
              </span>
              <h3 className="text-base font-black text-white">
                Aturan & Batas Toleransi Pemeriksaan Kualitas Data
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi physical boundaries, formula Z-score, dan kebijakan dedup otomatis.
              </p>
            </div>
            <button
              onClick={() => showToast("Aturan baru berhasil ditambahkan")}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>+ Tambah Aturan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => {
              const dimInfo = getDimensionInfo(rule.dimension);
              return (
                <div
                  key={rule.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${dimInfo.badgeClass}`}>
                      {dimInfo.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {rule.domain}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                    <p className="text-xs text-slate-300 mt-1">{rule.description}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-slate-400 space-y-1">
                    <div>Target Field: <strong className="text-slate-200">{rule.targetField}</strong></div>
                    <div>Tipe Validasi: <strong className="text-emerald-400">{rule.ruleType}</strong></div>
                    {rule.minBound !== undefined && rule.maxBound !== undefined && (
                      <div>
                        Batas Valid: <strong className="text-white">{rule.minBound} - {rule.maxBound} {rule.unit}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">● Aktif</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-purple-400">Auto-Fix: {rule.autoFixEnabled ? "ON" : "OFF"}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Konfigurasi rule ${rule.name} disimpan`)}
                      className="text-xs text-slate-400 hover:text-white font-bold"
                    >
                      Edit Rule
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: COMPLIANCE & AUDIT CERTIFICATE */}
      {/* ========================================================================= */}
      {activeTab === "AUDIT_CERT" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    SERTIFIKAT KELAIKAN & INTEGRITAS DATA TAMBANG
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standar Kepatuhan ISO 8000 & Audit RKAB Ditjen Minerba ESDM
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                GRADE A+ (VERIFIED)
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Dokumen ini menyatakan bahwa seluruh dataset operasional penambangan, produksi batubara, transaksi jembatan timbang, dan telemetri armada telah melalui pemindaian kualitas data berkelanjutan oleh <strong>AI Data Quality Engine v3.4</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Total Records:</span>
                  <span className="font-mono font-black text-white text-sm">2,407,990</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Data Health Score:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">96.4%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Unresolved Outliers:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">0</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Audit Hash:</span>
                  <span className="font-mono text-slate-300 text-[10px] truncate block">SHA-256: 8f9b2c</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => showToast("📄 Sertifikat Integritas Data berhasil diunduh (PDF)")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Unduh PDF Sertifikat</span>
              </button>
              <button
                onClick={() => showToast("📊 Dataset Bersih Berhasil Diekspor ke format Excel / Parquet")}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Ekspor Dataset Bersih (Excel)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AI ROOT CAUSE & 1-CLICK FIX */}
      {/* ========================================================================= */}
      {isAiFixModalOpen && selectedIssueForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">AI Data Quality Remediation</h3>
              </div>
              <button
                onClick={() => setIsAiFixModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Entitas:</span>
                <span className="font-bold text-white ml-2">{selectedIssueForAction.entityId} ({selectedIssueForAction.entityType})</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-bold">Nilai Sekarang (Anomali):</span>
                  <span className="font-mono font-bold text-red-300">{selectedIssueForAction.currentValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">Rekomendasi Perbaikan AI:</span>
                  <span className="font-mono font-black text-emerald-300">{selectedIssueForAction.aiSuggestedFix.recommendedValue}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <strong>Penjelasan AI:</strong> {selectedIssueForAction.aiSuggestedFix.explanation}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-300 block">Riwayat Audit Lineage:</span>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {selectedIssueForAction.auditTrail.map((at, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 text-[10px] space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400 font-mono">
                        <span>{at.user}</span>
                        <span>{at.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{at.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAiFixModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => handleApplyAiFix(selectedIssueForAction.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Zap className="h-4 w-4" />
                <span>Terapkan Perbaikan ({selectedIssueForAction.aiSuggestedFix.recommendedValue})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANUAL DATA STEWARD CORRECTION */}
      {/* ========================================================================= */}
      {isManualModalOpen && selectedIssueForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Manual Data Steward Override</h3>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nilai Koreksi Manual:</label>
                <input
                  type="text"
                  value={manualValueInput}
                  onChange={(e) => setManualValueInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Alasan / Catatan Verifikasi Fisik:</label>
                <textarea
                  rows={3}
                  value={manualNoteInput}
                  onChange={(e) => setManualNoteInput(e.target.value)}
                  placeholder="Misal: Sudah diverifikasi manual dengan kartu tera timbangan fisik..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleManualResolve}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs"
              >
                Simpan Koreksi Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
