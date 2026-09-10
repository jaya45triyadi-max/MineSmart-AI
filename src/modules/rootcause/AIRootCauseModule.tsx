import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Activity,
  Layers,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingDown,
  Brain,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react";
import {
  ROOT_CAUSE_CASES,
  INITIAL_RCA_DASHBOARD_SUMMARY,
  PIPELINE_STEPS_METADATA,
} from "../../data/rootCauseData";
import {
  RootCauseCase,
  RcaPipelineStepKey,
} from "../../types/rootCauseTypes";
import { PipelineTraversalGraph } from "./components/PipelineTraversalGraph";
import { RootCauseSummaryCard } from "./components/RootCauseSummaryCard";
import { ContributionWaterfall } from "./components/ContributionWaterfall";
import { PrescriptiveRecommendations } from "./components/PrescriptiveRecommendations";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { LiveInvestigationRunner } from "./components/LiveInvestigationRunner";

export const AIRootCauseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dossier" | "live_runner" | "dependency_graph" | "history">("dossier");
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ROOT_CAUSE_CASES[0].id);
  const [selectedStepKey, setSelectedStepKey] = useState<RcaPipelineStepKey | null>("downtime");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCase = ROOT_CAUSE_CASES.find((c) => c.id === selectedCaseId) || ROOT_CAUSE_CASES[0];

  const handleExportDossier = () => {
    setToastMessage(`Laporan AI RCA "${activeCase.code}" berhasil diekspor ke format PDF & Minerba Dossier.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Highlight USP */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                CORE USP FEATURE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Multi-Pipeline Traversal 7-Layer
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950 border border-cyan-800">
                Production ➔ Fleet ➔ Downtime ➔ Hauling ➔ Fuel ➔ Weather ➔ Maintenance
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Root Cause Analysis & Diagnostic Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Pelacak akar masalah otomatis lintas-dimensi pertambangan. Menemukan penyebab defisit produksi,
              menghitung bobot kontribusi entitas (Pareto), dan menghasilkan tindakan preskriptif mitigasi instan.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Avg Diagnostic Speed
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">1.8s</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Real-time</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                AI Accuracy Rate
              </span>
              <span className="text-xl font-black text-cyan-400 font-mono">97.4%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Validated FMS</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Recovered BCM
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">+4,620</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Today</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("dossier")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "dossier"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950"
                : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Interactive RCA Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab("live_runner")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "live_runner"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950"
                : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Live Investigation Runner</span>
          </button>

          <button
            onClick={() => setActiveTab("dependency_graph")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "dependency_graph"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950"
                : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>7-Layer Dependency Topology</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950"
                : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>RCA Audit Log ({ROOT_CAUSE_CASES.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MAIN INTERACTIVE RCA DOSSIER */}
      {activeTab === "dossier" && (
        <div className="space-y-6">
          {/* Case Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-slate-400 font-bold uppercase shrink-0 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              Pilih Kasus:
            </span>
            {ROOT_CAUSE_CASES.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCaseId(item.id);
                  setSelectedStepKey("downtime");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                  selectedCaseId === item.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-950"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{item.title}</span>
                <span className="text-[10px] font-mono opacity-70">({item.code})</span>
              </button>
            ))}
          </div>

          {/* 1. Multi-Pipeline Visual Traversal Graph */}
          <PipelineTraversalGraph
            traversal={activeCase.pipelineTraversal}
            activeStepKey={selectedStepKey}
            onSelectStep={(key) => setSelectedStepKey(key)}
          />

          {/* 2. ROOT CAUSE Verdict Summary Card */}
          <RootCauseSummaryCard
            activeCase={activeCase}
            onExportReport={handleExportDossier}
          />

          {/* 3. 2-Column Grid: CONTRIBUTION (Pareto) & RECOMMENDATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box A: Contribution Breakdown */}
            <ContributionWaterfall
              contributions={activeCase.contributions}
              totalDropLabel="Penurunan Produksi"
            />

            {/* Box B: Actionable Prescriptive Recommendations */}
            <PrescriptiveRecommendations
              recommendations={activeCase.recommendations}
            />
          </div>

          {/* 4. What-If Countermeasure Simulator */}
          <WhatIfSimulator activeCase={activeCase} />
        </div>
      )}

      {/* TAB 2: LIVE INVESTIGATION RUNNER */}
      {activeTab === "live_runner" && (
        <div className="space-y-6">
          <LiveInvestigationRunner
            onRunComplete={() => {
              setToastMessage("Investigasi AI RCA selesai! Hasil telah disintesis ke dalam diagram pipeline.");
            }}
          />
        </div>
      )}

      {/* TAB 3: 7-LAYER DEPENDENCY TOPOLOGY */}
      {activeTab === "dependency_graph" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              ARCHITECTURE OVERVIEW
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              7-Layer Integrated Mining Intelligence Topology
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bagaimana mesin AI menelusuri data telemetri, GPS, FMS, dan sensor cuaca secara berkesinambungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PIPELINE_STEPS_METADATA.map((step, idx) => (
              <div
                key={step.key}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3.5 hover:border-amber-500/40 transition-all"
              >
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                    STAGE 0{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{step.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{step.shortDesc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Prinsip Algoritma Multi-Variant Bayesian & Causal Inference
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem tidak sekadar mendeteksi korelasi statistik, tetapi membangun Directed Acyclic Graph (DAG)
              untuk memvalidasi arah kausalitas murni. Ketika output produksi turun, AI memverifikasi apakah truk menganggur
              karena kerusakan excavator atau sebaliknya, sehingga menghapus bias kesalahan alokasi armada.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === "history" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">RCA Diagnostic Audit Log</h3>
              <p className="text-xs text-slate-400">
                Daftar investigasi anomali tambang yang telah didiagnosis dan ditindaklanjuti.
              </p>
            </div>
            <button
              onClick={handleExportDossier}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export All Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Case Code</th>
                  <th className="p-3">Title & Lokasi</th>
                  <th className="p-3">Trigger Defisit</th>
                  <th className="p-3">Akar Masalah (Root Cause)</th>
                  <th className="p-3">Kontribusi Utama</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ROOT_CAUSE_CASES.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-400">{c.code}</td>
                    <td className="p-3">
                      <span className="font-bold text-white block">{c.title}</span>
                      <span className="text-[11px] text-slate-400">{c.pitLocation}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-rose-400">
                        {c.primaryMetric.dropPct > 0 ? "+" : ""}
                        {c.primaryMetric.dropPct}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {c.primaryMetric.impactLossVal}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs text-slate-300 truncate">
                      {c.rootCauseSummary.headline}
                    </td>
                    <td className="p-3 font-medium text-slate-300">
                      {c.contributions[0]?.entityCode} ({c.contributions[0]?.contributionPct}%)
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                        {c.rootCauseSummary.confidencePct}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedCaseId(c.id);
                          setActiveTab("dossier");
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40"
                      >
                        Buka Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
