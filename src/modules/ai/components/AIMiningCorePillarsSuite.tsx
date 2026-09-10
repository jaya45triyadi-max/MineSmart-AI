// MINE SMART AI - 10 Core AI Mining Pillars Suite & Interactive Command Matrix
// High-impact interactive dashboard showcase for all 10 core pillars

import React, { useState } from "react";
import {
  Bot,
  Brain,
  Compass,
  Activity,
  Truck,
  Fuel,
  Flame,
  FileSpreadsheet,
  Layers,
  Key,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Cpu,
  Sliders,
  Scale,
  Clock,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../providers/AuthProvider";
import { useLicense } from "../../../providers/LicenseProvider";

export type AIPillarKey =
  | "COPILOT"
  | "RCA"
  | "MINE_PLANNING"
  | "PREDICTIVE_MAINT"
  | "FLEET_OPT"
  | "FUEL_LOSS"
  | "COAL_QUALITY"
  | "EXECUTIVE_REPORT"
  | "COMMAND_CENTER"
  | "LICENSE_KEY";

interface AIPillarDefinition {
  id: AIPillarKey;
  number: number;
  title: string;
  subtitle: string;
  tagline: string;
  icon: React.ElementType;
  badge: string;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    accent: string;
  };
  targetModuleKey: string;
  metrics: { label: string; value: string; trend?: string; isPositive?: boolean }[];
  keyCapabilities: string[];
  liveStatus: string;
}

const PILLARS_LIST: AIPillarDefinition[] = [
  {
    id: "COPILOT",
    number: 1,
    title: "AI Mining Copilot",
    subtitle: "Context-Aware Natural Language Operational Intelligence",
    tagline: "Asisten AI multi-modal dengan kemampuan reasoning terhadap 16 subsistem tambang secara real-time.",
    icon: Bot,
    badge: "Gemini 3.7",
    colorClass: {
      bg: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      accent: "bg-emerald-500 text-slate-950",
    },
    targetModuleKey: "ai",
    metrics: [
      { label: "Query Response Time", value: "0.85s", trend: "-45%", isPositive: true },
      { label: "Data Accuracy", value: "99.4%", trend: "Zero Hallucination", isPositive: true },
      { label: "Autonomous Actions", value: "482 Executed", trend: "+24% /wk", isPositive: true },
    ],
    keyCapabilities: [
      "Multi-Agent Triage (Produksi, Fleet, Fuel, Geologi, Safety)",
      "Pencarian SOP & Regulasi ESDM Kepmen 1827 Seketika",
      "Analisis Root Cause otomatis saat target pit deviasi",
      "Perintah suara & text berbahasa Indonesia, English & Chinese",
    ],
    liveStatus: "Active & Reasoning 24/7",
  },
  {
    id: "RCA",
    number: 2,
    title: "AI Root Cause Analysis (RCA)",
    subtitle: "Autonomous 5-Why & Fishbone Bottleneck Engine",
    tagline: "Mesin diagnostik cerdas yang mengidentifikasi akar penyebab keterlambatan produksi & lonjakan biaya.",
    icon: Brain,
    badge: "Core USP",
    colorClass: {
      bg: "from-purple-500/20 to-indigo-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      accent: "bg-purple-500 text-white",
    },
    targetModuleKey: "root-cause",
    metrics: [
      { label: "Root Causes Solved", value: "128 Issues", trend: "+94% Resolved", isPositive: true },
      { label: "Diagnostic Accuracy", value: "98.2%", trend: "Fishbone Verified", isPositive: true },
      { label: "Time-to-Resolve", value: "14 Menit", trend: "-78% Faster", isPositive: true },
    ],
    keyCapabilities: [
      "Diagram Fishbone (Ishikawa) & 5-Why terbuat otomatis",
      "Korelasi silang anomali cuaca pit, antrean hauling, dan downtime alat",
      "Generasi CAPA (Corrective & Preventive Action) terstruktur",
      "Pelacakan efektivitas solusi pasca-eksekusi",
    ],
    liveStatus: "Monitoring Pit Bottlenecks",
  },
  {
    id: "MINE_PLANNING",
    number: 3,
    title: "AI Mine Planning Assistant",
    subtitle: "Pit Sequencing & Strip Ratio Optimizer",
    tagline: "Optimasi sekuens penambangan jangka pendek hingga panjang untuk meminimalkan Strip Ratio dan biaya stripping.",
    icon: Compass,
    badge: "Mine Technical",
    colorClass: {
      bg: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
      accent: "bg-cyan-500 text-slate-950",
    },
    targetModuleKey: "mine-planning",
    metrics: [
      { label: "SR Optimization", value: "4.82 SR", trend: "-0.28 vs Target", isPositive: true },
      { label: "Pit Design Compliance", value: "99.1%", trend: "ESDM Ready", isPositive: true },
      { label: "Haul Distance Saved", value: "1.4 km", trend: "-12% Fuel Burn", isPositive: true },
    ],
    keyCapabilities: [
      "Simulasi Cut & Fill otomatis dengan data Drone LiDAR",
      "Optimalisasi elevasi jenjang (Bench RL) harian & mingguan",
      "Penyeimbangan target batubara Low-GAR dan High-GAR",
      "Skenario mitigasi longsor dan stabilitas lereng otomatis",
    ],
    liveStatus: "Optimizing Pit 01 Seam B",
  },
  {
    id: "PREDICTIVE_MAINT",
    number: 4,
    title: "AI Predictive Maintenance",
    subtitle: "Telemetry Anomaly & Remaining Useful Life (RUL)",
    tagline: "Deteksi dini kegagalan komponen hidrolik, engine, dan transmisi sebelum terjadi breakdown fatal di pit.",
    icon: Activity,
    badge: "Zero Breakdown",
    colorClass: {
      bg: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
      accent: "bg-amber-500 text-slate-950",
    },
    targetModuleKey: "predictive-maintenance",
    metrics: [
      { label: "Mean Time Between Failure", value: "480 Jam", trend: "+35% MTBF", isPositive: true },
      { label: "Unscheduled Breakdown", value: "0.4%", trend: "-82% Reduction", isPositive: true },
      { label: "Maintenance Cost Saved", value: "Rp 1.4B", trend: "This Quarter", isPositive: true },
    ],
    keyCapabilities: [
      "Analisis getaran (vibration FFT) dan thermal imaging sensor",
      "Prediksi sisa umur pakai komponen (RUL 14 hari ke depan)",
      "Auto-generate Work Order (WO) dan reservasi suku cadang ERP",
      "Pencegahan engine overheat & oil contamination otomatis",
    ],
    liveStatus: "28 Heavy Units Monitored",
  },
  {
    id: "FLEET_OPT",
    number: 5,
    title: "AI Fleet Optimization",
    subtitle: "Dynamic Dispatch & Match-Factor Balancer",
    tagline: "Penugasan dinamis dump truck dan excavator secara real-time untuk memusnahkan antrean di front tambang.",
    icon: Truck,
    badge: "FMS & GPS",
    colorClass: {
      bg: "from-teal-500/20 to-emerald-500/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      glow: "shadow-teal-500/20",
      accent: "bg-teal-500 text-slate-950",
    },
    targetModuleKey: "dispatch",
    metrics: [
      { label: "Match Factor", value: "0.98", trend: "Optimal (Zero Queue)", isPositive: true },
      { label: "Cycle Time Pit", value: "22.4 Menit", trend: "-3.2 Menit", isPositive: true },
      { label: "Fleet Productivity", value: "+18.5%", trend: "Ton/Hour Surge", isPositive: true },
    ],
    keyCapabilities: [
      "Dynamic Route Re-assignment berdasarkan kepadatan jalan hauling",
      "Geofencing otomatis front loading, dumping, dan ROM crusher",
      "Eliminasi antrean truk di excavator (Queue Time < 1.5 menit)",
      "Monitoring kecepatan armada dan kepatuhan batas kecepatan K3",
    ],
    liveStatus: "Real-time Dispatching Active",
  },
  {
    id: "FUEL_LOSS",
    number: 6,
    title: "AI Fuel Loss & Anomaly Detection",
    subtitle: "Fuel Burn vs Payload Telemetry & Theft Siphon Radar",
    tagline: "Audit digital konsumsi bahan bakar solar per ritase, mendeteksi anomali konsumsi, idle waste, dan potensi pencurian.",
    icon: Fuel,
    badge: "Fuel Audit",
    colorClass: {
      bg: "from-rose-500/20 to-red-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      glow: "shadow-rose-500/20",
      accent: "bg-rose-500 text-white",
    },
    targetModuleKey: "fuel",
    metrics: [
      { label: "Fuel Burn Ratio", value: "0.48 L/Ton", trend: "-0.04 L/Ton (Saving)", isPositive: true },
      { label: "Fuel Anomaly Flagged", value: "0 Liters Loss", trend: "100% Reconciled", isPositive: true },
      { label: "Solar OPEX Saved", value: "Rp 850M", trend: "Monthly Saving", isPositive: true },
    ],
    keyCapabilities: [
      "Rekonsiliasi otomatis Fuel Truck Dispenser vs Flowmeter Tangki Unit",
      "Deteksi penurunan volume tangki mendadak saat unit idle (theft alert)",
      "Analisis rasio efisiensi bahan bakar per operator dan per rute grade jalan",
      "Notifikasi instan via WhatsApp / Telegram ke Satpam & Pengawas",
    ],
    liveStatus: "Fuel Telemetry Secured",
  },
  {
    id: "COAL_QUALITY",
    number: 7,
    title: "AI Coal Quality Prediction",
    subtitle: "GAR, Ash, Total Moisture & Multi-Seam Blending",
    tagline: "Prediksi spesifikasi kalori batubara sebelum sampai ke tongkang dan formulasi resep blending presisi tinggi.",
    icon: Flame,
    badge: "Lab & Blending",
    colorClass: {
      bg: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
      accent: "bg-amber-500 text-slate-950",
    },
    targetModuleKey: "laboratory",
    metrics: [
      { label: "GAR Prediction Accuracy", value: "99.2%", trend: "±25 kcal/kg error", isPositive: true },
      { label: "Blending Quality Index", value: "5,420 kcal/kg", trend: "Exact Contract Spec", isPositive: true },
      { label: "Rejection / Penalty", value: "0% Penalty", trend: "Zero Claim Buyer", isPositive: true },
    ],
    keyCapabilities: [
      "Algoritma multi-seam blending (Seam A High-GAR + Seam C Low-GAR)",
      "Prediksi Total Moisture (TM) dan Ash Content real-time dari ROM",
      "Pencegahan swabakar (spontaneous combustion) di stockpile berbasis thermal AI",
      "Sertifikat COA (Certificate of Analysis) pre-loading generator",
    ],
    liveStatus: "Optimal Blending Running",
  },
  {
    id: "EXECUTIVE_REPORT",
    number: 8,
    title: "AI Executive Report Generator",
    subtitle: "1-Click Boardroom PDF/Excel & C-Level Briefing",
    tagline: "Menyusun laporan eksekutif lengkap dengan narasi strategis, visualisasi KPI, dan rekomendasi aksi dalam 1 klik.",
    icon: FileSpreadsheet,
    badge: "1-Click Executive",
    colorClass: {
      bg: "from-blue-500/20 to-indigo-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
      accent: "bg-blue-500 text-white",
    },
    targetModuleKey: "ai-reports",
    metrics: [
      { label: "Report Generation Time", value: "1.2 Detik", trend: "Instant PDF/Excel", isPositive: true },
      { label: "Data Points Synthesized", value: "24,000+", trend: "All Mine Subsystems", isPositive: true },
      { label: "Boardroom Readiness", value: "100%", trend: "C-Level Formatted", isPositive: true },
    ],
    keyCapabilities: [
      "Morning Executive Briefing otomatis terkirim pukul 06:00 WIB",
      "Analisis deviasi target bulanan RKAB Minerba ESDM",
      "Ekspor PDF resolusi tinggi, lembar kerja Excel, dan presentasi PowerPoint",
      "Ringkasan narasi eksekutif berbahasa Indonesia & English",
    ],
    liveStatus: "Briefing Ready (17:45 WIB)",
  },
  {
    id: "COMMAND_CENTER",
    number: 9,
    title: "Real-Time Mining Command Center",
    subtitle: "Mission Control Telemetry HUD, 3D Twin & GIS Radar",
    tagline: "Pusat komando terpadu seluruh tambang dengan pemantauan spatial 3D pit, geofence GIS, dan streaming telemetry.",
    icon: Layers,
    badge: "Mission Control",
    colorClass: {
      bg: "from-emerald-500/20 to-cyan-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      accent: "bg-emerald-500 text-slate-950",
    },
    targetModuleKey: "dashboard",
    metrics: [
      { label: "Telemetry Latency", value: "45ms", trend: "Sub-second Stream", isPositive: true },
      { label: "Connected IoT Sensors", value: "142 Nodes", trend: "100% Online", isPositive: true },
      { label: "Spatial Precision", value: "RTK 2cm", trend: "Millimeter Slope Radar", isPositive: true },
    ],
    keyCapabilities: [
      "Digital Twin 3D pit tambang dengan elevasi jenjang teras (Bench RL)",
      "Peta GIS resolusi tinggi dengan pelacakan posisi GPS armada",
      "Radar keselamatan kestabilan lereng & zona peledakan (blasting)",
      "Pusat alarm real-time terhubung ke seluruh pengawas lapangan",
    ],
    liveStatus: "Live Satellite & IoT Sync",
  },
  {
    id: "LICENSE_KEY",
    number: 10,
    title: "1 Account = 1 License Key",
    subtitle: "Commercial SaaS Enforcement & Cryptographic Binding",
    tagline: "Arsitektur lisensi komersial terenkripsi dengan pengikatan entitas perusahaan, batas kuota seat, dan hak modul.",
    icon: Key,
    badge: "Commercial Security",
    colorClass: {
      bg: "from-indigo-500/20 to-purple-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      glow: "shadow-indigo-500/20",
      accent: "bg-indigo-500 text-white",
    },
    targetModuleKey: "license",
    metrics: [
      { label: "License Status", value: "VERIFIED ACTIVE", trend: "RSA-4096 Signed", isPositive: true },
      { label: "Entitled Modules", value: "42 Modules", trend: "Enterprise Tier", isPositive: true },
      { label: "Active Site Seats", value: "3 / 10 Sites", trend: "Auto-Reconciled", isPositive: true },
    ],
    keyCapabilities: [
      "Aktivasi satu kunci lisensi per perusahaan/IUP tambang",
      "Pencegahan pembajakan dan login silang tanpa otorisasi",
      "Hak akses berbasis modul (RBAC & Feature-Flagging)",
      "Audit trail legalitas lisensi untuk kepatuhan ISO 27001",
    ],
    liveStatus: "Enterprise License Active",
  },
];

interface AIMiningCorePillarsSuiteProps {
  onNavigateModule?: (moduleKey: string) => void;
  onOpenAICopilot?: () => void;
}

export const AIMiningCorePillarsSuite: React.FC<AIMiningCorePillarsSuiteProps> = ({
  onNavigateModule,
  onOpenAICopilot,
}) => {
  const { activeSite, company } = useAuth();
  const { licenseState } = useLicense();
  const [selectedPillar, setSelectedPillar] = useState<AIPillarKey>("COPILOT");
  const [isSimulatingAction, setIsSimulatingAction] = useState<boolean>(false);
  const [simulatedActionResult, setSimulatedActionResult] = useState<string | null>(null);

  const activePillarData = PILLARS_LIST.find((p) => p.id === selectedPillar) || PILLARS_LIST[0];

  const handleRunSimulator = () => {
    setIsSimulatingAction(true);
    setSimulatedActionResult(null);

    setTimeout(() => {
      setIsSimulatingAction(false);
      switch (selectedPillar) {
        case "COPILOT":
          setSimulatedActionResult(
            "✅ [AI Copilot Engine]: Rekomendasi dispatch berhasil dikirimkan ke 6 operator DT di Seam B. Estimasi peningkatan ritase: +140 Ton hari ini."
          );
          break;
        case "RCA":
          setSimulatedActionResult(
            "✅ [RCA 5-Why Engine]: Akar masalah hambatan loading terisolasi pada gradien tanjakan Ramp 02 (grade 11.2%). Perintah grading dikirimkan ke Dozer DZ-102."
          );
          break;
        case "MINE_PLANNING":
          setSimulatedActionResult(
            "✅ [Mine Planning Assistant]: Sekuens stripping OB dioptimasi ulang. Strip Ratio berhasil diturunkan dari 5.10 menjadi 4.82 SR."
          );
          break;
        case "PREDICTIVE_MAINT":
          setSimulatedActionResult(
            "✅ [Predictive Maintenance]: Sensor hidrolik Excavator EX-2001 distabilkan. Work Order WO-2026-0816 dijadwalkan pada jam pergantian shift (18:00 WIB)."
          );
          break;
        case "FLEET_OPT":
          setSimulatedActionResult(
            "✅ [Fleet Dispatch Balancer]: 2 unit Dump Truck dialihkan dari Pit North ke ROM Crusher 01. Waktu tunggu (queue time) turun menjadi 0.8 menit."
          );
          break;
        case "FUEL_LOSS":
          setSimulatedActionResult(
            "✅ [Fuel Anomaly Guard]: Audit telemetri tangki DT-405 selesai. Tidak ditemukan indikasi kebocoran atau siphon. Rasio bahan bakar: 0.47 L/Ton (Optimal)."
          );
          break;
        case "COAL_QUALITY":
          setSimulatedActionResult(
            "✅ [Coal Quality Blending]: Formula blending 65% Seam B (5,800 kcal) + 35% Seam C (4,800 kcal) berhasil divalidasi. Target GAR 5,450 kcal/kg tercapai 100%."
          );
          break;
        case "EXECUTIVE_REPORT":
          setSimulatedActionResult(
            "✅ [Executive Report Generator]: Laporan ringkasan C-Level 1-Click telah disusun dan siap diunduh dalam format PDF & Excel."
          );
          break;
        case "COMMAND_CENTER":
          setSimulatedActionResult(
            "✅ [Real-time Command Center]: Streaming telemetry 142 node sensor pit, radar lereng, dan GPS fleet berhasil disegarkan dalam 45ms."
          );
          break;
        case "LICENSE_KEY":
          setSimulatedActionResult(
            "✅ [Cryptographic License]: Kunci lisensi Enterprise terverifikasi valid. Hak akses 42 modul dan 3 lokasi site aktif."
          );
          break;
      }
    }, 900);
  };

  const handleLaunchModule = (moduleKey: string) => {
    if (onNavigateModule) {
      onNavigateModule(moduleKey);
    } else if ((window as any).__NAVIGATE_MODULE__) {
      (window as any).__NAVIGATE_MODULE__(moduleKey);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/90 bg-gradient-to-r from-[#07132F] via-[#0B1A3E] to-[#081533] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-white">
        {/* Ambient Top Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                10 CORE PILLARS OF MINE SMART AI
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-700">
                Enterprise Suite Matrix
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Arsitektur Kecerdasan Buatan Terpadu Pertambangan
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Platform holistik yang mengintegrasikan kecerdasan buatan (*AI Reasoning*), pemodelan 3D pit, diagnostik *Root Cause (RCA)*, telemetri IoT, audit bahan bakar, hingga tata kelola lisensi multi-tenant komersial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleLaunchModule("ai")}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Buka AI Copilot Console</span>
            </button>

            <button
              onClick={() => handleLaunchModule("dashboard")}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Command Center 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid of 10 Interactive Pillars Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PILLARS_LIST.map((pillar) => {
          const isSelected = selectedPillar === pillar.id;
          const IconComponent = pillar.icon;
          return (
            <div
              key={pillar.id}
              onClick={() => {
                setSelectedPillar(pillar.id);
                setSimulatedActionResult(null);
              }}
              className={`rounded-2xl p-4 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-900/95 dark:bg-[#0E1E46] border-emerald-500/60 shadow-xl ${pillar.colorClass.glow} ring-2 ring-emerald-500/30 scale-[1.02]`
                  : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="font-mono text-[10px] font-black text-slate-400 dark:text-slate-500">
                    #{String(pillar.number).padStart(2, "0")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${pillar.colorClass.border} ${pillar.colorClass.text} bg-slate-950/60`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`p-2 rounded-xl border ${pillar.colorClass.border} bg-gradient-to-br ${pillar.colorClass.bg} ${pillar.colorClass.text} shrink-0`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white leading-tight">
                    {pillar.title}
                  </h4>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {pillar.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">{pillar.metrics[0].value}</span>
                <span
                  className={`font-bold flex items-center gap-0.5 ${
                    isSelected ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  <span>Detail</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Deep Interactive Spotlight Workspace for Selected Pillar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-[#0A142F]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden luxury-card-glow">
        {/* Top Header of Active Pillar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl border ${activePillarData.colorClass.border} bg-gradient-to-br ${activePillarData.colorClass.bg} ${activePillarData.colorClass.text} shadow-xl shrink-0 mt-1`}
            >
              {React.createElement(activePillarData.icon, { className: "w-7 h-7" })}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-slate-400">
                  PILLAR #{String(activePillarData.number).padStart(2, "0")}
                </span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activePillarData.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${activePillarData.colorClass.border} ${activePillarData.colorClass.text} bg-slate-900`}
                >
                  {activePillarData.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activePillarData.subtitle}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {activePillarData.tagline}
              </p>
            </div>
          </div>

          {/* Quick Launch Button to the Full Dedicated Module */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleLaunchModule(activePillarData.targetModuleKey)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Buka Modul Penuh ({activePillarData.title})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Operational Metrics Tri-Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activePillarData.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-1"
            >
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {metric.label}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {metric.value}
                </span>
                {metric.trend && (
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
                      metric.isPositive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {metric.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Key Capabilities & Live Simulation Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Capabilities List */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Kapabilitas & Algoritma Utama</span>
            </h4>

            <div className="space-y-2">
              {activePillarData.keyCapabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Sandbox Simulator */}
          <div className="lg:col-span-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-5 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Live AI Sandbox Simulator</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                {activePillarData.liveStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Uji coba eksekusi penalaran real-time dan orkestrasi perintah untuk <strong>{activePillarData.title}</strong> pada kondisi operasional site saat ini.
            </p>

            <button
              onClick={handleRunSimulator}
              disabled={isSimulatingAction}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSimulatingAction ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menjalankan Penalaran AI...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Jalankan Simulasi Penalaran AI ({activePillarData.badge})</span>
                </>
              )}
            </button>

            {simulatedActionResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 font-mono leading-relaxed animate-fadeIn">
                {simulatedActionResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
