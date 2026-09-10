import React, { useState } from "react";
import {
  Trees,
  Droplets,
  Wind,
  Trash2,
  Mountain,
  ShieldCheck,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Leaf,
  Activity,
  Layers,
  Sparkles,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  BarChart3,
  Globe,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  EnvironmentalKPISummary,
  EnvironmentalPerformanceScorecard,
  WaterSample,
  AirQualityReading,
  SedimentPond,
  EnvironmentalIncident,
  EnvironmentalCAPA,
  EnvironmentalAIInsight,
} from "../../../types/environmentTypes";

interface Props {
  kpi: EnvironmentalKPISummary | null;
  scorecard?: EnvironmentalPerformanceScorecard;
  waterSamples: WaterSample[];
  airReadings: AirQualityReading[];
  sedimentPonds: SedimentPond[];
  incidents: EnvironmentalIncident[];
  capas: EnvironmentalCAPA[];
  aiInsights: EnvironmentalAIInsight[];
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const EnvironmentalPerformanceDashboard: React.FC<Props> = ({
  kpi,
  waterSamples,
  airReadings,
  sedimentPonds,
  incidents,
  capas,
  aiInsights,
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"MONTHLY" | "QUARTERLY" | "YTD">("YTD");

  // Mocked Environmental Performance Scorecard Data (PROPER & ESG compliance)
  const scorecard: EnvironmentalPerformanceScorecard = {
    overallScore: 94.6,
    properRatingTarget: "HIJAU",
    properPredictedStatus: "HIJAU_CONFIRMED",
    complianceScorePercent: 98.4,
    waterQualityIndexScore: 96.2,
    airQualityIndexScore: 93.8,
    reclamationFulfillmentRatePercent: 91.2,
    biodiversityIndex: 2.86,
    hazardousWasteCompliancePercent: 100,
    ghgScope1EmissionsTonsCO2e: 42150,
    ghgScope2EmissionsTonsCO2e: 6420,
    carbonOffsetRevegetationTonsCO2e: 14850,
    netCarbonIntensityTonCO2ePerTonCoal: 0.0162,
    sedimentRetentionEfficiencyPercent: 95.8,
    spillIncidentsCountYTD: 0,
    esdmAuditReadinessPercent: 97.5,
  };

  const properColors: Record<string, { bg: string; text: string; border: string; desc: string }> = {
    EMAS: {
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      border: "border-amber-500/50",
      desc: "Beyond Compliance & Community Eco-Empowerment",
    },
    HIJAU: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-300",
      border: "border-emerald-500/50",
      desc: "Beyond Compliance, Zero Major Spill & 100% Waste Tracking",
    },
    BIRU: {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-500/50",
      desc: "100% Regulatory Standards Compliant",
    },
  };

  const targetProper = properColors[scorecard.properRatingTarget] || properColors.HIJAU;

  return (
    <div className="space-y-6">
      {/* Top Banner: Environmental Performance Scorecard Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950/80 to-teal-950 p-6 md:p-8 border border-emerald-500/30 shadow-2xl text-white">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" /> PROPER KLHK & ESDM ENVIRONMENT KPI
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Real-time Telemetry & Audit Score
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Environmental Performance Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dashboard kinerja pengelolaan lingkungan terintegrasi: <strong>PROPER Rating, Kualitas Air Limbah, Emisi Udara, Pengendalian Erosi, Kolam Sedimen, dan Dekarbonisasi Tambang</strong> sesuai regulasi Permen LHK & Kepmen ESDM No. 1827 K/30/MEM/2018.
            </p>
          </div>

          {/* PROPER Badge Showcase */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/30 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                Target Peringkat PROPER KLHK
              </span>
              <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                <Award className="w-6 h-6 text-emerald-400" />
                <span className="text-2xl font-black text-emerald-400 tracking-wide">
                  PROPER {scorecard.properRatingTarget}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Skor Ketaatan: {scorecard.complianceScorePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Scorecard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Overall Index */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Environmental Performance Index
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {scorecard.overallScore}
            </span>
            <span className="text-xs text-slate-400 font-sans">/ 100 (Grade A+)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.4% vs Target Triwulan</span>
          </div>
        </div>

        {/* Water Quality Index */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kualitas Air & SPARING
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
              {scorecard.waterQualityIndexScore}%
            </span>
            <span className="text-xs text-slate-400 font-sans">Baku Mutu 100%</span>
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            SPARING: <strong>6/6 Titik Online</strong> • pH 7.2 | TSS 42mg/L
          </div>
        </div>

        {/* Carbon & GHG Sequestration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Serapan Karbon Revegetasi
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
              {scorecard.carbonOffsetRevegetationTonsCO2e.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-sans">tCO2e/Th</span>
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            Kompensasi: <strong>30.6% Emisi Scope 1</strong>
          </div>
        </div>

        {/* Audit Readiness */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kesiapan Audit ESDM & DLH
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {scorecard.esdmAuditReadinessPercent}%
            </span>
            <span className="text-xs text-emerald-500 font-sans font-bold">Siap Audit</span>
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            0 Temuan Kritis • Dokumen RKL-RPL Lengkap
          </div>
        </div>
      </div>

      {/* 9 Modules Matrix Grid */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              Matriks Kinerja 9 Pilar Modul Lingkungan Tambang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik modul untuk membuka detail telemetri, inspeksi lapangan, dan pengendalian teknis.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
            9/9 Pilar Operasional Terpantau
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            {
              id: "reclamation",
              title: "Reklamasi Lahan",
              category: "Land Reshaping & Void",
              icon: Mountain,
              status: "ON TRACK",
              metric: "22.8 Ha / 25.0 Ha (91.2%)",
              sub: "Penataan Lereng & Penebaran Topsoil 40cm",
              color: "text-amber-500",
            },
            {
              id: "revegetation",
              title: "Revegetasi & Nursery",
              category: "Flora & Carbon Sink",
              icon: Trees,
              status: "EXCELLENT",
              metric: "18.5 Ha (88.6% Survival Rate)",
              sub: "24,500 Bibit Sengon, Johar, & Meranti",
              color: "text-emerald-500",
            },
            {
              id: "erosion",
              title: "Pengendalian Erosi",
              category: "RUSLE & Soil Conservation",
              icon: Activity,
              status: "EFFECTIVE",
              metric: "4.8 ton/ha/th (Ambang: <12 ton)",
              sub: "Hydroseeding, Cocomesh & 8 Check Dam",
              color: "text-rose-500",
            },
            {
              id: "sediment-pond",
              title: "Sediment Pond (KPL)",
              category: "Settling & Dosing System",
              icon: Mountain,
              status: "NORMAL",
              metric: "62% Okupansi Rata-rata Silt",
              sub: "4 Kolam Pengendap • Kapasitas 185k m³",
              color: "text-blue-500",
            },
            {
              id: "water",
              title: "Water Quality (Air Tambang)",
              category: "SPARING & Effluent Standard",
              icon: Droplets,
              status: "COMPLIANT",
              metric: "100% Baku Mutu PermenLHK 113",
              sub: "pH 7.2 • Fe 0.42mg/L • Mn 0.18mg/L",
              color: "text-cyan-500",
            },
            {
              id: "air",
              title: "Air Quality (Udara Ambien)",
              category: "Continuous Ambient Station",
              icon: Wind,
              status: "GOOD",
              metric: "ISPU 42 (Kategori Baik)",
              sub: "SO2, NO2, CO, TSP dalam ambang batas",
              color: "text-indigo-500",
            },
            {
              id: "dust",
              title: "Dust & Haul Road Spray",
              category: "Particulate PM2.5 / PM10",
              icon: Droplets,
              status: "CONTROLLED",
              metric: "Coverage 94% Haul Road",
              sub: "8 Unit Water Truck Fleet & Dust Suppressor",
              color: "text-amber-500",
            },
            {
              id: "waste",
              title: "Limbah B3 & Waste",
              category: "TPS LB3 & Festronik KLHK",
              icon: Trash2,
              status: "ZERO OVERDUE",
              metric: "100% Logbook Terverifikasi",
              sub: "Oli Bekas 48 Drum • Manifest Resmi",
              color: "text-purple-500",
            },
            {
              id: "drainage",
              title: "Penyaliran Tambang (Drainage)",
              category: "Sump Pit & Dewatering Pumps",
              icon: Layers,
              status: "OPTIMAL",
              metric: "Debit Pompa 1,450 m³/jam",
              sub: "6 Pompa Multiflo Aktif Bebas Genangan",
              color: "text-teal-500",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer space-y-3 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {item.metric}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    {item.sub}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Lihat Detail Telemetri</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Live Telemetry Alerts & AI Environmental Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Compliance Log & Sensor Streams */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                Live Telemetri Lingkungan & Titik Penaatan (Discharge Compliance)
              </h4>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                Online Sync 10 Detik
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  point: "Outfall KPL Alpha 1 (SW-01)",
                  type: "Air Limbah Tambang",
                  pH: "7.18",
                  tss: "38 mg/L",
                  flow: "120 L/s",
                  status: "COMPLIANT",
                  standard: "Baku Mutu: pH 6-9, TSS <300 mg/L",
                },
                {
                  point: "Outfall KPL Beta 2 (SW-03)",
                  type: "Air Limbah Tambang",
                  pH: "6.95",
                  tss: "45 mg/L",
                  flow: "95 L/s",
                  status: "COMPLIANT",
                  standard: "Baku Mutu: pH 6-9, TSS <300 mg/L",
                },
                {
                  point: "Stasiun Ambien ROM Stockpile (AQ-01)",
                  type: "Kualitas Udara",
                  pH: "PM10: 62 ug/m³",
                  tss: "PM2.5: 28 ug/m³",
                  flow: "SO2: 12 ug/m³",
                  status: "COMPLIANT",
                  standard: "Baku Mutu PP No. 22/2021",
                },
              ].map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{row.point}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        {row.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{row.standard}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-emerald-600 dark:text-emerald-400">
                      {row.pH}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-cyan-600 dark:text-cyan-400">
                      {row.tss}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Environmental Recommendations */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">AI Environmental Assistant</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">Gemini Engine</span>
            </div>

            <div className="space-y-3 text-xs">
              {aiInsights.slice(0, 2).map((ins, iIdx) => (
                <div
                  key={iIdx}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-xs">{ins.title}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{ins.confidence}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{ins.finding}</p>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200">
                    <strong>Rekomendasi:</strong> {ins.recommendation}
                  </div>
                </div>
              ))}

              <button
                onClick={onOpenAIAssistant}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                Buka AI Environmental Copilot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
