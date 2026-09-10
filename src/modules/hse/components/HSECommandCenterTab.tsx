import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2,
  FileCheck2,
  Clock,
  Flame,
  UserCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  Zap,
  HardHat,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";
import { HSEKPISummary, HSEAIInsight } from "../../../types/hseTypes";

interface HSECommandCenterTabProps {
  kpis: HSEKPISummary;
  insights: HSEAIInsight[];
  onSelectTab: (tabKey: string) => void;
  onOpenReportModal: () => void;
}

export const HSECommandCenterTab: React.FC<HSECommandCenterTabProps> = ({
  kpis,
  insights,
  onSelectTab,
  onOpenReportModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">HSE / K3 Command Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Safe Operations
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Pusat Kendali Keselamatan, Kesehatan Kerja & Pengelolaan Lingkungan Pertambangan (K3LH)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={onOpenReportModal}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20"
          >
            <AlertTriangle className="w-4 h-4" />
            Lapor Insiden / Near Miss
          </button>
          <button
            onClick={() => onSelectTab("inspections")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Inspeksi Lapangan
          </button>
          <button
            onClick={() => onSelectTab("permits")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            Izin Kerja (PTW)
          </button>
        </div>
      </div>

      {/* Safety Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Hari Tanpa LTI</div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
            {kpis.daysWithoutLTI} <span className="text-xs text-slate-400 font-normal">Hari</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400/80 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Target: Zero LTI Target 365 Days
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">TRIFR Rate</div>
          <div className="text-2xl font-bold text-slate-100">{kpis.trifr}</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Di bawah ambang batas (1.2)
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">LTIFR Rate</div>
          <div className="text-2xl font-bold text-emerald-400">{kpis.ltifr}</div>
          <div className="mt-2 text-[11px] text-emerald-400">Nol Kecelakaan Berat</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Open Hazards</div>
          <div className="text-2xl font-bold text-amber-400">{kpis.openHazardsCount}</div>
          <div className="mt-2 text-[11px] text-slate-400">Bahaya Teridentifikasi</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Open CAPA</div>
          <div className="text-2xl font-bold text-rose-400">{kpis.openActionsCount}</div>
          <div className="mt-2 text-[11px] text-rose-400">{kpis.overdueActionsCount} Overdue SLA</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Permits Active</div>
          <div className="text-2xl font-bold text-cyan-400">{kpis.permitsActiveCount}</div>
          <div className="mt-2 text-[11px] text-slate-400">High-Risk Operations</div>
        </div>
      </div>

      {/* Main Grid: AI Safety Insight & High Risk Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Safety Intelligence */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-100">AI Safety Intelligence & Risk Warning</h3>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Gemini Predictive Engine
              </span>
            </div>

            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      {insight.finding}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      Key Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{insight.recommendation}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-700/40">
                    <div>
                      <span className="text-slate-400">Bukti Data:</span>{" "}
                      <span className="text-slate-200 font-medium">{insight.evidence}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Dampak Diharapkan:</span>{" "}
                      <span className="text-emerald-400 font-medium">{insight.expectedImpact}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Kepercayaan AI:</span>{" "}
                      <span className="text-indigo-400 font-medium">{insight.confidence} Confidence</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Matrix Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Active JSA Dokumentasi</div>
                <div className="text-xl font-bold text-slate-100">{kpis.jsaActiveCount} JSA Disetujui</div>
              </div>
              <button
                onClick={() => onSelectTab("jsa")}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Lihat
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Toolbox Meetings Today</div>
                <div className="text-xl font-bold text-slate-100">{kpis.toolboxMeetingsCount} Briefing</div>
              </div>
              <button
                onClick={() => onSelectTab("toolbox")}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Absensi
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Inspeksi Harian</div>
                <div className="text-xl font-bold text-slate-100">{kpis.inspectionsToday} Terlaksana</div>
              </div>
              <button
                onClick={() => onSelectTab("inspections")}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Form
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High Risk Real-Time Monitor */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" /> High-Risk Operational Activities
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-rose-300 mb-1">
                  <span>Confined Space Cleaning</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400">Extreme Risk</span>
                </div>
                <p className="text-slate-300 text-[11px] mb-1">Fuel Tank 02 Interior Maintenance</p>
                <div className="text-[10px] text-slate-400">
                  Status: <span className="text-amber-400 font-medium">Pending Approval JSA</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-amber-300 mb-1">
                  <span>Hot Work Welding Line 2</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400">High Risk</span>
                </div>
                <p className="text-slate-300 text-[11px] mb-1">Port Jetty Conveyor Structural Repair</p>
                <div className="text-[10px] text-slate-400">
                  Status: <span className="text-emerald-400 font-medium">Permit PTW Active</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                  <span>Blasting Pit Alpha Seam 3</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400">Scheduled</span>
                </div>
                <p className="text-slate-300 text-[11px] mb-1">Flyrock Clearance Zone 500m</p>
                <div className="text-[10px] text-slate-400">
                  Status: <span className="text-cyan-400 font-medium">Radio Clearance Ready</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab("risk-matrix")}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg text-center"
            >
              Buka Matriks & Heatmap Risiko
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
