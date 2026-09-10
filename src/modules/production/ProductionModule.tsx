import React, { useState, useEffect } from "react";
import {
  Pickaxe,
  TrendingUp,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Search,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  FileSpreadsheet,
  Building2,
  Clock,
  UserCheck,
  Zap,
  BarChart3,
  Flame,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Bot,
  PieChart as PieChartIcon,
  ChevronRight,
  Database,
  Truck,
  Mountain,
  Sliders,
  Check,
  X,
  FileText,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../../providers/AuthProvider";
import {
  ProductionRecord,
  ProductionTarget,
  ConversionFactor,
  ProductionForecast,
  ProductionLossRecord,
  RehandleRecord,
  ROMRecord,
  WasteRecord,
  CrushingRecord,
  ProductionAlertItem,
  ProductionReconciliationItem,
  CoalQualityData,
  ProductionPeriodType,
} from "../../types/productionTypes";
import { productionRepository } from "../../services/repositories/ProductionRepository";
import { COAL_QUALITY_INTEGRATION_MOCK } from "../../data/productionData";
import { ProductionDashboardView } from "./components/ProductionDashboardView";
import { ProductionInputModal } from "./components/ProductionInputModal";
import { CrushingManagementView } from "./components/CrushingManagementView";

interface ProductionModuleProps {
  onOpenAICopilot: () => void;
}

export type ProductionSubTab =
  | "overview"
  | "hourly"
  | "shift"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "coal"
  | "ob"
  | "rom"
  | "waste"
  | "rehandle"
  | "crushing"
  | "target"
  | "actual"
  | "forecast"
  | "variance"
  | "fleet"
  | "dispatch"
  | "alerts"
  | "reports";

export const ProductionModule: React.FC<ProductionModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, currentUser, company } = useAuth();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<ProductionSubTab>("overview");

  // State collections
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [targets, setTargets] = useState<ProductionTarget[]>([]);
  const [conversionFactors, setConversionFactors] = useState<ConversionFactor[]>([]);
  const [rehandleRecords, setRehandleRecords] = useState<RehandleRecord[]>([]);
  const [romRecords, setRomRecords] = useState<ROMRecord[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [crushingRecords, setCrushingRecords] = useState<CrushingRecord[]>([]);
  const [lossRecords, setLossRecords] = useState<ProductionLossRecord[]>([]);
  const [alerts, setAlerts] = useState<ProductionAlertItem[]>([]);
  const [reconciliations, setReconciliations] = useState<ProductionReconciliationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Modals
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShift, setSelectedShift] = useState<string>("ALL");
  const [selectedPit, setSelectedPit] = useState<string>("ALL");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [modalInitialStream, setModalInitialStream] = useState<string>("COAL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string }>>([]);

  // Forecast scenario interactive state
  const [scenarioFleet, setScenarioFleet] = useState<string>("CURRENT_FLEET");
  const [scenarioTrucks, setScenarioTrucks] = useState<number>(32);
  const [scenarioUtil, setScenarioUtil] = useState<number>(85);

  // Helper to trigger toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenInputStream = (stream: string) => {
    setModalInitialStream(stream.toUpperCase());
    setIsRecordModalOpen(true);
  };

  // Load all data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [recs, tgts, cfs, rehs, roms, wsts, crush, lss, alts, recs_recon] = await Promise.all([
        productionRepository.getAll(company.id, activeSite.id),
        productionRepository.getTargets(company.id, activeSite.id),
        productionRepository.getConversionFactors(company.id, activeSite.id),
        productionRepository.getRehandleRecords(company.id, activeSite.id),
        productionRepository.getROMRecords(company.id, activeSite.id),
        productionRepository.getWasteRecords(company.id, activeSite.id),
        productionRepository.getCrushingRecords(company.id, activeSite.id),
        productionRepository.getLossRecords(company.id, activeSite.id),
        productionRepository.getAlerts(company.id, activeSite.id),
        productionRepository.getReconciliations(company.id, activeSite.id),
      ]);

      setRecords(recs);
      setTargets(tgts);
      setConversionFactors(cfs);
      setRehandleRecords(rehs);
      setRomRecords(roms);
      setWasteRecords(wsts);
      setCrushingRecords(crush);
      setLossRecords(lss);
      setAlerts(alts);
      setReconciliations(recs_recon);
    } catch (err) {
      console.error("Failed to load production data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [activeSite.id, company.id]);

  // Calculations for KPIs
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.pit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.excavatorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.operatorName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = selectedShift === "ALL" || r.shift === selectedShift;
    const matchesPit = selectedPit === "ALL" || r.pit === selectedPit;
    return matchesSearch && matchesShift && matchesPit;
  });

  const totalCoalTon = filteredRecords.filter(r => r.productionType === "COAL" || r.coalMT).reduce((sum, r) => sum + (r.coalMT || r.tonnage || 0), 0);
  const totalOBBCM = filteredRecords.filter(r => r.productionType === "OB" || r.obBCM).reduce((sum, r) => sum + (r.obBCM || r.volume || 0), 0);
  const totalROMTon = romRecords.reduce((sum, r) => sum + r.tonnage, 0);
  const totalWasteBCM = wasteRecords.reduce((sum, r) => sum + r.volumeBCM, 0);
  const totalRehandleTon = rehandleRecords.reduce((sum, r) => sum + r.tonnage, 0);

  // Daily target matching
  const dailyTargetObj = targets.find(t => t.periodType === "DAILY") || { coalTargetTon: 15000, obTargetBCM: 50000, targetStripRatio: 3.33 };
  const targetCoalTon = dailyTargetObj.coalTargetTon || 15000;
  const targetOBBCM = dailyTargetObj.obTargetBCM || 50000;

  const actualTotalTon = totalCoalTon;
  const coalAchievement = targetCoalTon > 0 ? Number(((totalCoalTon / targetCoalTon) * 100).toFixed(1)) : 0;
  const obAchievement = targetOBBCM > 0 ? Number(((totalOBBCM / targetOBBCM) * 100).toFixed(1)) : 0;
  const coalVariance = totalCoalTon - targetCoalTon;
  const actualStripRatio = totalCoalTon > 0 ? Number((totalOBBCM / totalCoalTon).toFixed(2)) : 0;

  // Forecast calculation (simulated rate * remaining time)
  const forecastCoalTon = Math.round(totalCoalTon * 1.08); // +8% projected end of day
  const forecastOBBCM = Math.round(totalOBBCM * 1.06);

  const handleApproveRecord = async (id: string) => {
    await productionRepository.update(id, {
      status: "APPROVED",
      approvedBy: currentUser?.displayName || "Site Manager",
      approvedAt: new Date().toISOString(),
    });
    await loadAllData();
  };

  const handleAskAI = () => {
    if (!aiPrompt.trim()) return;
    const q = aiPrompt.trim();
    let a = "";

    if (q.toLowerCase().includes("coal") || q.toLowerCase().includes("batubara")) {
      a = `Total produksi batubara hari ini adalah ${totalCoalTon.toLocaleString("id-ID")} Ton dengan pencapaian target ${coalAchievement}%. Pit 1 South memberikan kontribusi terbesar (58%).`;
    } else if (q.toLowerCase().includes("turun") || q.toLowerCase().includes("kenapa") || q.toLowerCase().includes("loss")) {
      a = `Penurunan produksi disebabkan oleh maintenance tidak terencana pada EX-201 (kebocoran selang hidrolik) selama 45 menit (estimasi loss ~450 Ton), serta antrian truk di Ramp 3 West.`;
    } else if (q.toLowerCase().includes("forecast") || q.toLowerCase().includes("proyeksi")) {
      a = `Proyeksi produksi batubara akhir shift/hari ini diperkirakan mencapai ${forecastCoalTon.toLocaleString("id-ID")} Ton (${(forecastCoalTon / targetCoalTon * 100).toFixed(1)}% dari target). Confidence level: HIGH.`;
    } else if (q.toLowerCase().includes("laporan") || q.toLowerCase().includes("report")) {
      a = `Laporan harian siap diunduh! Ringkasan: Coal = ${totalCoalTon} Ton, OB = ${totalOBBCM} BCM, Actual SR = ${actualStripRatio}, Zero LTI safety record.`;
    } else {
      a = `Berdasarkan data real-time Site ${activeSite.name}: Total Coal = ${totalCoalTon} MT, OB = ${totalOBBCM} BCM. Strip Ratio actual = ${actualStripRatio} BCM/MT vs Target = ${dailyTargetObj.targetStripRatio}.`;
    }

    setAiAnswers((prev) => [{ q, a, time: new Date().toLocaleTimeString("id-ID") }, ...prev]);
    setAiPrompt("");
  };

  const exportCSV = () => {
    const headers = ["ID", "Tanggal", "Shift", "Tipe", "Material", "Pit", "Bench", "Jumlah", "Unit", "Tonnage (Ton)", "Volume (BCM)", "Status", "Pencatat"];
    const rows = filteredRecords.map((r) => [
      r.productionId || r.id,
      r.date,
      r.shift,
      r.productionType,
      `"${r.materialType}"`,
      `"${r.pit}"`,
      `"${r.bench}"`,
      r.quantity,
      r.unit,
      r.tonnage || r.coalMT || 0,
      r.volume || r.obBCM || 0,
      r.status,
      `"${r.recordedBy}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Produksi_Pusat_Analitik_${activeSite.code}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sub-tabs list
  const navTabs: { key: ProductionSubTab; label: string; icon: any; count?: number }[] = [
    { key: "overview", label: "Dashboard Executive", icon: Sparkles },
    { key: "hourly", label: "Hourly", icon: Clock },
    { key: "shift", label: "Shift", icon: Layers },
    { key: "daily", label: "Harian", icon: Calendar },
    { key: "weekly", label: "Mingguan", icon: BarChart3 },
    { key: "monthly", label: "Bulanan", icon: PieChartIcon },
    { key: "yearly", label: "Tahunan", icon: TrendingUp },
    { key: "coal", label: "Coal Production", icon: Pickaxe },
    { key: "ob", label: "OB Stripping", icon: Mountain },
    { key: "rom", label: "ROM Stock", icon: Flame },
    { key: "waste", label: "Waste Disposal", icon: Layers },
    { key: "rehandle", label: "Rehandle Coal", icon: RefreshCw },
    { key: "crushing", label: "Crushing Plant", icon: Sliders, count: crushingRecords.length },
    { key: "target", label: "Target", icon: Sliders },
    { key: "actual", label: "Actual", icon: CheckCircle2 },
    { key: "forecast", label: "Forecast Center", icon: Zap },
    { key: "variance", label: "Variance", icon: TrendingUp },
    { key: "fleet", label: "Fleet Production", icon: Truck },
    { key: "dispatch", label: "Dispatch FMS", icon: Database },
    { key: "alerts", label: "Alerts", icon: AlertTriangle, count: alerts.length },
    { key: "reports", label: "Laporan", icon: FileText },
  ];

  return (
    <div className="space-y-6 text-slate-100 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              PROMPT 14 — UNIFIED PRODUCTION & CRUSHING SYSTEM
            </span>
            <span className="text-xs text-slate-400">
              Site: <strong className="text-slate-200">{activeSite.name}</strong> ({activeSite.code})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Production Management & AI Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Pusat pengelolaan Coal, OB, ROM, Waste, Rehandle, Crushing, Target vs Actual vs Forecast across Multi-Period.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
          >
            <Bot className="h-4 w-4 text-emerald-400" />
            <span>AI Production Assistant</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>Export Data</span>
          </button>

          <button
            onClick={() => handleOpenInputStream("COAL")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Input Catatan Produksi</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-slate-950 text-amber-400" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW OR PERIOD TABS (EXECUTIVE TARGET VS ACTUAL VS FORECAST) */}
      {(activeTab === "overview" || activeTab === "hourly" || activeTab === "shift" || activeTab === "yearly") && (
        <ProductionDashboardView
          records={records}
          targets={targets}
          romRecords={romRecords}
          wasteRecords={wasteRecords}
          rehandleRecords={rehandleRecords}
          crushingRecords={crushingRecords}
          onOpenInputModal={handleOpenInputStream}
          onOpenAICopilot={() => setIsAIModalOpen(true)}
        />
      )}

      {/* TAB CONTENT: CRUSHING MANAGEMENT (STREAM 6) */}
      {activeTab === "crushing" && (
        <CrushingManagementView
          crushingRecords={crushingRecords}
          onOpenInputModal={() => handleOpenInputStream("CRUSHING")}
        />
      )}

      {/* TAB CONTENT 1: OVERVIEW (PRODUCTION COMMAND CENTER) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 10 Core KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Coal Production <Pickaxe className="h-3.5 w-3.5 text-amber-400" />
              </span>
              <div className="text-xl font-black text-amber-400">{totalCoalTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">Real-time shift log</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                OB Production <Mountain className="h-3.5 w-3.5 text-emerald-400" />
              </span>
              <div className="text-xl font-black text-emerald-400">{totalOBBCM.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">BCM</span></div>
              <p className="text-[10px] text-slate-500">SR Actual: {actualStripRatio}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                ROM Stockpile <Flame className="h-3.5 w-3.5 text-orange-400" />
              </span>
              <div className="text-xl font-black text-orange-400">{totalROMTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">Crusher feeder active</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Waste Disposal <Layers className="h-3.5 w-3.5 text-cyan-400" />
              </span>
              <div className="text-xl font-black text-cyan-400">{totalWasteBCM.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">BCM</span></div>
              <p className="text-[10px] text-slate-500">In-Pit Disposal West 02</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Rehandle Volume <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
              </span>
              <div className="text-xl font-black text-indigo-400">{totalRehandleTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">Stockpile & Blending</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Daily Coal Target <Sliders className="h-3.5 w-3.5 text-blue-400" />
              </span>
              <div className="text-xl font-black text-blue-400">{targetCoalTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">Daily Plan</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Actual Coal Ton <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
              </span>
              <div className="text-xl font-black text-teal-400">{totalCoalTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">Weighbridge & FMS</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Achievement % <Zap className="h-3.5 w-3.5 text-yellow-400" />
              </span>
              <div className="text-xl font-black text-yellow-400">{coalAchievement}%</div>
              <p className="text-[10px] text-slate-500">Target vs Actual</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Variance <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
              </span>
              <div className={`text-xl font-black ${coalVariance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {coalVariance > 0 ? `+${coalVariance}` : coalVariance} <span className="text-xs font-bold text-slate-400">Ton</span>
              </div>
              <p className="text-[10px] text-slate-500">Actual - Target</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Forecast End Day <Activity className="h-3.5 w-3.5 text-purple-400" />
              </span>
              <div className="text-xl font-black text-purple-400">{forecastCoalTon.toLocaleString("id-ID")} <span className="text-xs font-bold text-slate-400">Ton</span></div>
              <p className="text-[10px] text-slate-500">AI Confidence: HIGH</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target vs Actual Trend */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Tren Target vs Actual Produksi (Harian)</h3>
                  <p className="text-xs text-slate-400">Komparasi tonase batubara terhadap target harian plan</p>
                </div>
                <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-[11px] font-bold text-amber-400">Target: 15,000 MT/Day</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={[
                      { date: "09 Aug", Target: 15000, Coal: 14800, OB: 49000 },
                      { date: "10 Aug", Target: 15000, Coal: 15200, OB: 51200 },
                      { date: "11 Aug", Target: 15000, Coal: 13900, OB: 47000 },
                      { date: "12 Aug", Target: 15000, Coal: 14250, OB: 48600 },
                      { date: "13 Aug (Today)", Target: 15000, Coal: totalCoalTon, OB: totalOBBCM },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                    <Legend />
                    <Bar dataKey="Coal" name="Actual Coal (MT)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="Target" name="Target Plan (MT)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Production Waterfall Analysis */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Production Waterfall & Loss Analysis</h3>
                  <p className="text-xs text-slate-400">Pengurangan rencana produksi akibat loss operasional (Estimasi)</p>
                </div>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase">Estimated Loss</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Planned", val: 15000, fill: "#3B82F6" },
                      { name: "Downtime Loss", val: 450, fill: "#EF4444" },
                      { name: "Queue Loss", val: 220, fill: "#F97316" },
                      { name: "Weather Loss", val: 0, fill: "#EAB308" },
                      { name: "Final Actual", val: totalCoalTon, fill: "#10B981" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                    <Bar dataKey="val" name="Tonase (MT)" radius={[4, 4, 0, 0]}>
                      {[
                        { name: "Planned", fill: "#3B82F6" },
                        { name: "Downtime Loss", fill: "#EF4444" },
                        { name: "Queue Loss", fill: "#F97316" },
                        { name: "Weather Loss", fill: "#EAB308" },
                        { name: "Final Actual", fill: "#10B981" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Production Insights Panel */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Production Insight & Root Cause Analysis</h3>
                  <p className="text-xs text-slate-400">Deteksi otomatis anomaly, hambatan rute, dan rekomendasi optimasi</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                Confidence: HIGH (94.2%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">1. Problem Identified</span>
                <p className="text-xs font-bold text-rose-400">Pencapaian Shift 1 Turun -14.3% dari Plan</p>
                <p className="text-[11px] text-slate-400">Tingkat pengupasan Pit 1 South melambat antara pukul 09:15-10:00.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">2. Evidence & Data</span>
                <p className="text-xs font-bold text-amber-400">Downtime EX-201 45 Min + Antrian Truck 4.8 min</p>
                <p className="text-[11px] text-slate-400">Telematics FMS mencatat delay akibat penggantian selang hidrolik.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">3. Recommended Action</span>
                <p className="text-xs font-bold text-emerald-400">Rebalance 2 Unit DT ke Pit 2 North</p>
                <p className="text-[11px] text-slate-400">Pengalihan 2 truk mengurangi antrian Pit 1 dan menaikkan output Pit 2 +380 Ton.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">4. Expected Impact</span>
                <p className="text-xs font-bold text-purple-400">Proyeksi Target Shift 2 Tercapai 98.2%</p>
                <p className="text-[11px] text-slate-400">Gap target berkurang dari -1,800 Ton menjadi -350 Ton.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SHIFT */}
      {activeTab === "shift" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monitoring Produksi Per Shift</h3>
              <p className="text-xs text-slate-400">Shift A (Siang: 06.00 - 18.00) & Shift B (Malam: 18.00 - 06.00)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">Shift A Running</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Shift A (Day Shift)</span>
                <span className="text-xs text-slate-400">06:00 - 18:00 WITA</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">Coal Target</span>
                  <div className="text-base font-bold text-white">7,800 MT</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">Coal Actual</span>
                  <div className="text-base font-bold text-amber-400">7,850 MT (100.6%)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">OB Target</span>
                  <div className="text-base font-bold text-white">26,000 BCM</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">OB Actual</span>
                  <div className="text-base font-bold text-emerald-400">26,400 BCM (101.5%)</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Shift B (Night Shift)</span>
                <span className="text-xs text-slate-400">18:00 - 06:00 WITA</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">Coal Target</span>
                  <div className="text-base font-bold text-white">7,200 MT</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">Coal Actual</span>
                  <div className="text-base font-bold text-amber-400">6,400 MT (88.8%)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">OB Target</span>
                  <div className="text-base font-bold text-white">24,000 BCM</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-400">OB Actual</span>
                  <div className="text-base font-bold text-emerald-400">22,200 BCM (92.5%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COAL */}
      {activeTab === "coal" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Coal Tonnage</span>
              <div className="text-2xl font-black text-amber-400">{totalCoalTon.toLocaleString("id-ID")} MT</div>
              <p className="text-[11px] text-slate-500">Volume Direct & Stockpile</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Coal Rate</span>
              <div className="text-2xl font-black text-emerald-400">620 MT/Hr</div>
              <p className="text-[11px] text-slate-500">Operating Hour Avg</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Coal Trips</span>
              <div className="text-2xl font-black text-blue-400">238 Trips</div>
              <p className="text-[11px] text-slate-500">FMS Hauling Total</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Avg Payload</span>
              <div className="text-2xl font-black text-purple-400">33.2 Ton/Trip</div>
              <p className="text-[11px] text-slate-500">Scania P410 Hauler</p>
            </div>
          </div>

          {/* Coal Quality Integration Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Integrasi Kualitas Batubara (Geology & Quality Assay)</h3>
                <p className="text-xs text-slate-400">Nilai Kalori (CV), Ash, Sulfur, dan Moisture per Seam</p>
              </div>
              <span className="rounded bg-teal-500/20 px-2.5 py-1 text-xs font-bold text-teal-400 border border-teal-500/30">
                Coal Quality Integration Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Coal Seam</th>
                    <th className="p-3">Calorific Value (CV)</th>
                    <th className="p-3">Ash Content</th>
                    <th className="p-3">Total Sulfur</th>
                    <th className="p-3">Moisture</th>
                    <th className="p-3">Status Assayed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {COAL_QUALITY_INTEGRATION_MOCK.map((cq, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-amber-400">{cq.seam}</td>
                      <td className="p-3">{cq.calorificValueKcal} kcal/kg</td>
                      <td className="p-3">{cq.ashPercent}%</td>
                      <td className="p-3">{cq.sulfurPercent}%</td>
                      <td className="p-3">{cq.moisturePercent}%</td>
                      <td className="p-3">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          {cq.integrationStatus}
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

      {/* TAB CONTENT: OB */}
      {activeTab === "ob" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Total OB Volume</span>
              <div className="text-2xl font-black text-emerald-400">{totalOBBCM.toLocaleString("id-ID")} BCM</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">OB Tonnage</span>
              <div className="text-2xl font-black text-teal-400">{(totalOBBCM * 2.1).toLocaleString("id-ID")} Ton</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">OB Productivity Rate</span>
              <div className="text-2xl font-black text-cyan-400">2,150 BCM/Hr</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REHANDLE */}
      {activeTab === "rehandle" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Rehandle Management</h3>
              <p className="text-xs text-slate-400">Pencatatan pemindahan batubara dari stockpile, reclaiming, & quality blending</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Rehandle</th>
                  <th className="p-3">Tanggal & Shift</th>
                  <th className="p-3">Asal (Source)</th>
                  <th className="p-3">Tujuan (Destination)</th>
                  <th className="p-3">Material</th>
                  <th className="p-3">Jumlah (Ton)</th>
                  <th className="p-3">Alasan (Reason)</th>
                  <th className="p-3">Pencatat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {rehandleRecords.map((rh) => (
                  <tr key={rh.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-400">{rh.rehandleId}</td>
                    <td className="p-3">{rh.date} ({rh.shift})</td>
                    <td className="p-3">{rh.source}</td>
                    <td className="p-3">{rh.destination}</td>
                    <td className="p-3 font-semibold text-amber-400">{rh.material}</td>
                    <td className="p-3 font-bold">{rh.tonnage.toLocaleString("id-ID")} Ton</td>
                    <td className="p-3">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                        {rh.reason}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{rh.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TARGET & APPROVAL WORKFLOW */}
      {activeTab === "target" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Target Production Management & Approval Workflow</h3>
              <p className="text-xs text-slate-400">Hierarki target: Tahunan → Bulanan → Mingguan → Harian → Shift</p>
            </div>
            <button
              onClick={() => setIsTargetModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Target Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Target</th>
                  <th className="p-3">Periode</th>
                  <th className="p-3">Rentang Tanggal</th>
                  <th className="p-3">Target Coal (MT)</th>
                  <th className="p-3">Target OB (BCM)</th>
                  <th className="p-3">Strip Ratio</th>
                  <th className="p-3">Status Workflow</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {targets.map((tgt) => (
                  <tr key={tgt.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-400">{tgt.targetId}</td>
                    <td className="p-3 font-bold">{tgt.periodType}</td>
                    <td className="p-3">{tgt.startDate} s/d {tgt.endDate}</td>
                    <td className="p-3 font-bold text-amber-400">{tgt.coalTargetTon.toLocaleString("id-ID")} MT</td>
                    <td className="p-3 font-bold text-emerald-400">{tgt.obTargetBCM.toLocaleString("id-ID")} BCM</td>
                    <td className="p-3">{tgt.targetStripRatio}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                          tgt.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {tgt.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {tgt.status !== "APPROVED" && (
                        <button
                          onClick={() => productionRepository.updateTargetStatus(tgt.targetId, "APPROVED", currentUser?.displayName)}
                          className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                        >
                          Approve Target
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FORECAST CENTER & SCENARIO SIMULATOR */}
      {activeTab === "forecast" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-300">AI Production Forecast Center & Scenario Simulator</h3>
                <p className="text-xs text-slate-400">Simulasi pencapaian target berdasarkan ketersediaan alat, siklus ritase, & utilisasi</p>
              </div>
              <span className="rounded bg-purple-500/20 px-2.5 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                AI Engine Active
              </span>
            </div>

            {/* Scenario Simulator Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Skenario Armada Fleet</label>
                <select
                  value={scenarioFleet}
                  onChange={(e) => setScenarioFleet(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="CURRENT_FLEET">Current Fleet (32 Trucks, 4 Exc)</option>
                  <option value="OPTIMIZED_FLEET">Optimized Fleet (+2 Trucks Rebalanced)</option>
                  <option value="REDUCED_FLEET">Reduced Fleet (-4 Trucks Breakdown)</option>
                  <option value="ADDITIONAL_EXCAVATOR">Additional Excavator (+1 PC1250)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Jumlah Dump Truck Aktif ({scenarioTrucks} Unit)</label>
                <input
                  type="range"
                  min={20}
                  max={45}
                  value={scenarioTrucks}
                  onChange={(e) => setScenarioTrucks(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Fleet Utilization ({scenarioUtil}%)</label>
                <input
                  type="range"
                  min={60}
                  max={98}
                  value={scenarioUtil}
                  onChange={(e) => setScenarioUtil(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* Simulator Output */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <span className="text-xs text-slate-400">Proyeksi End-of-Day Coal</span>
                <div className="text-2xl font-black text-amber-400">
                  {Math.round(15000 * (scenarioUtil / 85) * (scenarioTrucks / 32)).toLocaleString("id-ID")} MT
                </div>
                <p className="text-[11px] text-slate-400">Target Plan: 15,000 MT</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <span className="text-xs text-slate-400">Proyeksi Achievement</span>
                <div className="text-2xl font-black text-purple-400">
                  {((100 * scenarioUtil) / 85 * (scenarioTrucks / 32)).toFixed(1)}%
                </div>
                <p className="text-[11px] text-slate-400">Gap: {Math.round(15000 - 15000 * (scenarioUtil / 85) * (scenarioTrucks / 32))} MT</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                <span className="text-xs text-slate-400">Required Production Rate</span>
                <div className="text-2xl font-black text-emerald-400">
                  {Math.round(620 * (scenarioUtil / 85)).toLocaleString("id-ID")} Ton/Hour
                </div>
                <p className="text-[11px] text-slate-400">Operating Time: 22.5 Hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTUAL PRODUCTION TABLE VIEW */}
      {(activeTab === "actual" || activeTab === "daily" || activeTab === "weekly" || activeTab === "monthly") && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Pit, Excavator, Operator, atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">Semua Shift</option>
                <option value="SHIFT_1_DAY">Shift 1 (Siang)</option>
                <option value="SHIFT_2_NIGHT">Shift 2 (Malam)</option>
              </select>

              <select
                value={selectedPit}
                onChange={(e) => setSelectedPit(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">Semua Pit</option>
                <option value="Pit 1 South">Pit 1 South</option>
                <option value="Pit 2 North">Pit 2 North</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Produksi</th>
                  <th className="p-3">Tanggal & Shift</th>
                  <th className="p-3">Lokasi / Pit</th>
                  <th className="p-3">Tipe & Material</th>
                  <th className="p-3">Jumlah (Ton / BCM)</th>
                  <th className="p-3">Sumber Data</th>
                  <th className="p-3">Excavator / Unit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No production data available. Create a production record or import operational production data.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-amber-400">{r.productionId || r.id}</td>
                      <td className="p-3">
                        {r.date} ({r.shift === "SHIFT_1_DAY" ? "Shift 1" : "Shift 2"})
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{r.pit}</div>
                        <div className="text-[10px] text-slate-400">{r.bench}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                            r.productionType === "COAL"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {r.productionType}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{r.materialType}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">
                          {r.quantity.toLocaleString("id-ID")} {r.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">SR: {r.stripRatio || 3.33}</div>
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                          {r.sourceType || "Dispatch"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{r.excavatorCode}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            r.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {r.status !== "APPROVED" && (
                          <button
                            onClick={() => handleApproveRecord(r.id)}
                            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONVERSION FACTORS & RECONCILIATION EXTRA PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Factors */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Conversion Factor Configuration</h3>
            <span className="text-xs text-slate-400">Density & Swell Factors</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Tipe Material</th>
                  <th className="p-2.5">Faktor</th>
                  <th className="p-2.5">Nilai</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {conversionFactors.map((cf) => (
                  <tr key={cf.id}>
                    <td className="p-2.5 font-semibold text-amber-400">{cf.materialType}</td>
                    <td className="p-2.5">{cf.factorType}</td>
                    <td className="p-2.5 font-bold text-white">{cf.value} {cf.unit}</td>
                    <td className="p-2.5">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                        {cf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Production Reconciliation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Production Reconciliation (Dispatch vs Weighbridge vs Survey)</h3>
            <span className="text-xs text-teal-400">Tolerance Threshold: ±1.5%</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Lokasi / Pit</th>
                  <th className="p-2.5">Dispatch Ton</th>
                  <th className="p-2.5">Weighbridge Ton</th>
                  <th className="p-2.5">Variance %</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {reconciliations.map((rec) => (
                  <tr key={rec.id}>
                    <td className="p-2.5 font-bold text-white">{rec.pit}</td>
                    <td className="p-2.5">{rec.dispatchQuantityTon} MT</td>
                    <td className="p-2.5">{rec.weighbridgeQuantityTon} MT</td>
                    <td className="p-2.5 font-bold text-amber-400">{rec.variancePercent}%</td>
                    <td className="p-2.5">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                        {rec.reconciliationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* UNIFIED 6-STREAM PRODUCTION INPUT MODAL */}
      <ProductionInputModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          loadAllData();
        }}
        defaultStream={modalInitialStream}
        currentUser={currentUser}
      />

      {/* AI ASSISTANT MODAL */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">AI Production Assistant</h3>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tanyakan hal seputar produksi (contoh: Kenapa produksi hari ini turun?)..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                />
                <button
                  onClick={handleAskAI}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Tanya
                </button>
              </div>

              {/* Answers history */}
              <div className="max-h-64 overflow-y-auto space-y-3 pt-2">
                {aiAnswers.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">
                    Belum ada pertanyaan. Tanyakan seputar produksi coal, OB, forecast, atau loss.
                  </p>
                ) : (
                  aiAnswers.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                      <p className="text-xs font-bold text-amber-400">Q: {item.q}</p>
                      <p className="text-xs text-slate-200">A: {item.a}</p>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
