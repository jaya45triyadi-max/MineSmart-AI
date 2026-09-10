import React from "react";
import {
  FlaskConical,
  TestTube,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  QrCode,
  ShieldAlert,
  FileCheck2,
  Activity,
  Flame,
  Droplets,
  Zap,
  Layers,
  Database,
  BrainCircuit,
  TrendingUp,
  Scale,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Compass,
} from "lucide-react";
import {
  LabSample,
  LabTest,
  QualityResult,
  QualityAnomaly,
  LabInstrument,
  AIQualityInsight,
} from "../../../types/laboratoryTypes";

interface OverviewTabProps {
  samples: LabSample[];
  tests: LabTest[];
  results: QualityResult[];
  anomalies: QualityAnomaly[];
  instruments: LabInstrument[];
  insights: AIQualityInsight[];
  onNavigateTab: (tab: string) => void;
  onOpenNewSampleModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  samples,
  tests,
  results,
  anomalies,
  instruments,
  insights,
  onNavigateTab,
  onOpenNewSampleModal,
}) => {
  const approvedResults = results.filter((r) => r.isApproved);
  const pendingApprovalCount = results.filter((r) => !r.isApproved).length;
  const criticalAnomalies = anomalies.filter((a) => a.severity === "CRITICAL" && a.status !== "Closed");
  const activeInstruments = instruments.filter((i) => i.calibrationStatus === "ACTIVE").length;

  const avgGAR = Math.round(
    approvedResults.filter((r) => r.parameter === "GAR").reduce((acc, curr) => acc + curr.value, 0) /
      (approvedResults.filter((r) => r.parameter === "GAR").length || 1)
  );

  const avgTM = (
    approvedResults.filter((r) => r.parameter === "TM").reduce((acc, curr) => acc + curr.value, 0) /
    (approvedResults.filter((r) => r.parameter === "TM").length || 1)
  ).toFixed(1);

  const avgAsh = (
    approvedResults.filter((r) => r.parameter === "ASH").reduce((acc, curr) => acc + curr.value, 0) /
    (approvedResults.filter((r) => r.parameter === "ASH").length || 1)
  ).toFixed(1);

  const avgTS = (
    approvedResults.filter((r) => r.parameter === "TS").reduce((acc, curr) => acc + curr.value, 0) /
    (approvedResults.filter((r) => r.parameter === "TS").length || 1)
  ).toFixed(2);

  // 1. Database Pillars
  const databaseCards = [
    {
      id: "samples",
      title: "1. Sample Database",
      count: `${samples.length} Samples`,
      desc: "Pit, Stockpile, Belt & Barge registers with ISO 17025 Chain of Custody & QR tracking.",
      icon: TestTube,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "testing",
      title: "2. Test Execution",
      count: `${tests.length} Tests Active`,
      desc: "Bomb Calorimeter, Sulfur Analyzer, Muffle Furnace & Proximate ASTM testing protocols.",
      icon: FlaskConical,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "results",
      title: "3. Quality Results",
      count: `${approvedResults.length} Approved`,
      desc: "Multi-basis results (ADB, ARB, DB, DAF), tolerance verification & sign-off workflow.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "coa",
      title: "4. Certificate (COA)",
      count: "8 Issued COAs",
      desc: "Official Certificate of Analysis generator with KAN accreditation & QR code verification.",
      icon: FileCheck2,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  // 2. Core Quality Parameter Gauges
  const qualityParams = [
    { key: "GCV", name: "GCV (ADB)", val: "6,150 kcal", unit: "kcal/kg", status: "On-Spec", color: "text-amber-500" },
    { key: "GAR", name: "GAR (ARB)", val: `${avgGAR || 5830} kcal`, unit: "kcal/kg", status: "Target: 5,800", color: "text-amber-500 font-black" },
    { key: "Ash", name: "Ash Content", val: `${avgAsh}%`, unit: "% ADB", status: "Max: 8.0%", color: "text-emerald-500" },
    { key: "Sulfur", name: "Total Sulfur (TS)", val: `${avgTS}%`, unit: "% ADB", status: "Max: 0.85%", color: "text-slate-800 dark:text-slate-200" },
    { key: "TM", name: "Total Moisture", val: `${avgTM}%`, unit: "% ARB", status: "Max: 26.0%", color: "text-blue-500" },
    { key: "IM", name: "Inherent Moisture", val: "10.5%", unit: "% ADB", status: "Typical: 10.5%", color: "text-cyan-500" },
    { key: "VM", name: "Volatile Matter", val: "41.2%", unit: "% ADB", status: "Typical: 41.2%", color: "text-violet-500" },
  ];

  // 3. AI Intelligence Cards
  const aiCards = [
    {
      id: "ai-prediction",
      title: "AI Quality Prediction",
      badge: "Geological ML",
      desc: "Prediksi GAR, Ash, TM dari kedalaman stratum, curah hujan & yield washing sebelum ditambang.",
      icon: BrainCircuit,
      color: "from-indigo-950 to-slate-900 border-indigo-500/30 text-indigo-400",
    },
    {
      id: "trends",
      title: "AI Quality Trends",
      badge: "Statistical Control",
      desc: "Time-series trendline multi-parameter dengan Upper/Lower Control Limits (±2σ) & process capability.",
      icon: TrendingUp,
      color: "from-emerald-950 to-slate-900 border-emerald-500/30 text-emerald-400",
    },
    {
      id: "anomalies",
      title: "AI Quality Anomaly (CAPA)",
      badge: `${anomalies.length} Flagged`,
      desc: "Deteksi otomatis deviasi spesifikasi, kontaminasi seam, instrumen drift & resolusi CAPA terpadu.",
      icon: AlertTriangle,
      color: "from-amber-950 to-slate-900 border-amber-500/30 text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" /> ISO 17025 ACCREDITED COAL LABORATORY
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI QUALITY INTELLIGENCE ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Coal Laboratory & Quality Management
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Sistem terintegrasi 3 Pilar: <strong>Database (Sample, Test, Result, Certificate)</strong>, <strong>Quality Parameters (GCV, GAR, Ash, Sulfur, TM, IM, VM)</strong>, dan <strong>AI Intelligence (Quality Prediction, Trend, Anomaly)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab("sampling")}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Scan QR / Tag Sample</span>
          </button>
          <button
            onClick={() => onNavigateTab("ai-prediction")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Quality Predictor</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DATABASE PILLARS (Sample, Test, Result, Certificate) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              1. Laboratory Database (Sample • Test • Result • Certificate)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Chain of Custody & ISO 17025 Workflow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {databaseCards.map((db) => {
            const Icon = db.icon;
            return (
              <div
                key={db.id}
                onClick={() => onNavigateTab(db.id)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${db.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {db.title}
                  </h4>
                  <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {db.count}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {db.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 7 CORE QUALITY PARAMETERS (GCV, GAR, Ash, Sulfur, TM, IM, VM) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                2. Coal Quality Parameters (GCV • GAR • Ash • Sulfur • TM • IM • VM)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified averages and commercial contract specifications (Air Dried vs As Received Basis).
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("parameters")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Multi-Basis Calculator Hub →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {qualityParams.map((p) => (
            <div
              key={p.key}
              onClick={() => onNavigateTab("parameters")}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition cursor-pointer space-y-1"
            >
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                <span>{p.name}</span>
              </div>
              <div className={`text-base font-black font-mono ${p.color}`}>
                {p.val}
              </div>
              <span className="text-[9px] text-slate-500 block">{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AI INTELLIGENCE (Quality Prediction, Trend, Anomaly) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              3. AI Quality Intelligence (Prediction • Trend • Anomaly)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Machine Learning & Anomaly Detection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiCards.map((ai) => {
            const Icon = ai.icon;
            return (
              <div
                key={ai.id}
                onClick={() => onNavigateTab(ai.id)}
                className={`bg-gradient-to-br ${ai.color} text-white rounded-3xl p-6 border shadow-lg hover:shadow-xl transition-all cursor-pointer space-y-4 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/20">
                    {ai.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white flex items-center justify-between">
                    <span>{ai.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {ai.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Laboratory Activity Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Live Sample Testing & Certification Feed
          </h3>
          <button
            onClick={() => onNavigateTab("samples")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            View All Register ({samples.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samples.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.sampleCode}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : s.status === "IN_TESTING"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{s.sourceName}</div>
                <div className="text-[11px] text-slate-500">
                  {s.sampleType} • {s.sampleWeightKg} kg • Collector: {s.collectorName.split(" ")[0]}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400">{s.samplingDate} {s.samplingTime}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Seal: {s.chainOfCustody.sealNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
