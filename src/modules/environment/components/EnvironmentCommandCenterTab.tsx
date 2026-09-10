import React from "react";
import {
  Trees,
  Droplets,
  Wind,
  Trash2,
  Mountain,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Bot,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Gauge,
  Activity,
  Compass,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  EnvironmentalKPISummary,
  WaterSample,
  AirQualityReading,
  DustMonitoringRecord,
  SedimentPond,
  EnvironmentalIncident,
  EnvironmentalCAPA,
  EnvironmentalAIInsight,
  EnvironmentalPermit,
} from "../../../types/environmentTypes";

interface Props {
  kpi: EnvironmentalKPISummary | null;
  waterSamples: WaterSample[];
  airReadings: AirQualityReading[];
  dustRecords: DustMonitoringRecord[];
  sedimentPonds: SedimentPond[];
  incidents: EnvironmentalIncident[];
  capas: EnvironmentalCAPA[];
  aiInsights: EnvironmentalAIInsight[];
  permits: EnvironmentalPermit[];
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const EnvironmentCommandCenterTab: React.FC<Props> = ({
  kpi,
  waterSamples,
  airReadings,
  dustRecords,
  sedimentPonds,
  incidents,
  capas,
  aiInsights,
  permits,
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950 p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Trees className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Environmental Control Command Center
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <Activity className="h-3 w-3" /> Live Operations
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Pemantauan lingkungan tambang real-time: Kualitas Air, Udara, Pengendalian Debu, Limbah B3, Drainage & Sediment Pond
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab("water")}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Sampel Air Baru
          </button>
          <button
            onClick={() => onNavigateTab("dust")}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <Droplets className="h-4 w-4 text-cyan-400" /> Log Water Truck
          </button>
          <button
            onClick={() => onNavigateTab("waste")}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <Trash2 className="h-4 w-4 text-amber-400" /> Log Limbah B3
          </button>
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:opacity-90 shadow-md transition"
          >
            <Sparkles className="h-4 w-4" /> AI Env Audit
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Env Health Score */}
        <div
          onClick={() => onNavigateTab("compliance")}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-emerald-500/50 transition group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Environmental Score
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover:bg-emerald-500/20 transition">
              <Gauge className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {kpi ? `${kpi.environmentalScore}%` : "94.2%"}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-0.5" /> High Compliance
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Kepatuhan baku mutu nasional & izin IPLC/AMDAL
          </p>
        </div>

        {/* Card 2: Water Compliance */}
        <div
          onClick={() => onNavigateTab("water")}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-cyan-500/50 transition group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Baku Mutu Air Limbah
            </span>
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 group-hover:bg-cyan-500/20 transition">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {kpi ? `${kpi.waterComplianceRate}%` : "98.5%"}
            </span>
            <span className="text-xs text-slate-400">pH 6.8 | TSS 180 mg/L</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Outfall Settling Pond Alpha compliant dengan Permen 113/2003
          </p>
        </div>

        {/* Card 3: Air Quality & Dust */}
        <div
          onClick={() => onNavigateTab("dust")}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-amber-500/50 transition group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Udara & Debu Jalan
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 group-hover:bg-amber-500/20 transition">
              <Wind className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {kpi ? `${kpi.dustControlCoveragePercent}%` : "91.0%"}
            </span>
            <span className="text-xs text-amber-400">Penyiraman Aktif</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            3 Water Trucks aktif beroperasi di Haul Road KM 0-16
          </p>
        </div>

        {/* Card 4: Sediment Pond Capacity */}
        <div
          onClick={() => onNavigateTab("sediment-pond")}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-teal-500/50 transition group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kapasitas Sediment Pond
            </span>
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-400 group-hover:bg-teal-500/20 transition">
              <Mountain className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {kpi ? `${kpi.sedimentPondAvgCapacityPercent}%` : "80.7%"}
            </span>
            <span className="text-xs text-amber-400 flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-0.5" /> Pengerukan
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Pond Alpha terisi 80.7% (Rekomendasi dredging 3 hari ke depan)
          </p>
        </div>
      </div>

      {/* Main Grid Section: Live AI Insights & Priority Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Environmental Insights & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Rekomendasi Prediktif AI Lingkungan Tambang
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("ai-insight")}
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/30">
                        {insight.category}
                      </span>
                      <h4 className="font-semibold text-sm text-white">
                        {insight.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {insight.confidence}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-100">Temuan:</strong> {insight.finding}
                  </p>

                  <div className="rounded-lg bg-slate-900/80 p-3 text-xs text-slate-300 space-y-1.5 border border-slate-800">
                    <p>
                      <strong className="text-emerald-400">Rekomendasi Tindakan:</strong>{" "}
                      {insight.recommendation}
                    </p>
                    <p>
                      <strong className="text-cyan-400">Estimasi Dampak:</strong>{" "}
                      {insight.expectedImpact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Overview Tables: Recent Water Samples & Incidents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Water Sampling */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">
                    Sampel Air Terbaru
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateTab("water")}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Detail
                </button>
              </div>

              <div className="space-y-3">
                {waterSamples.slice(0, 3).map((sample) => (
                  <div
                    key={sample.id}
                    className="flex items-center justify-between rounded-xl bg-slate-950/50 p-3 border border-slate-800 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">
                        {sample.monitoringPointName}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        {sample.sampleDate} • {sample.sampleType}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        sample.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {sample.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Incidents & CAPA */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">
                    Insiden & CAPA Lingkungan
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateTab("incidents")}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Detail
                </button>
              </div>

              <div className="space-y-3">
                {incidents.slice(0, 2).map((inc) => (
                  <div
                    key={inc.id}
                    className="rounded-xl bg-slate-950/50 p-3 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        {inc.incidentNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {inc.incidentType}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">
                      {inc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Permit Expiry, Water Truck Fleet & Quick Map Link */}
        <div className="space-y-6">
          {/* Permits & Legal Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">
                  Izin & Legalitas Lingkungan
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab("compliance")}
                className="text-xs text-emerald-400 hover:underline"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-3">
              {permits.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-slate-950/50 p-3 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{p.permitType}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        p.status === "EXPIRING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {p.status === "EXPIRING" ? `${p.daysToExpiry} Hari Lagi` : "Aktif"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{p.permitNumber}</p>
                  <p className="text-slate-400 text-[10px]">
                    Authority: {p.issuerAuthority}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Map Widget */}
          <div
            onClick={() => onNavigateTab("maps")}
            className="cursor-pointer rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 p-5 hover:border-emerald-500/60 transition shadow-md group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition" />
                <h4 className="font-bold text-white text-sm">
                  Interactive GIS Env Map
                </h4>
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Lihat sebaran titik pantau air, stasiun udara, sediment pond, & TPS Limbah B3 di peta spasial site Pit Alpha.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Buka GIS Dashboard</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
