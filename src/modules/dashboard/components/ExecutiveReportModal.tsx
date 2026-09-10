// MINE SMART AI - Executive Report Modal Component

import React from "react";
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { DashboardPayload } from "../../../services/dashboard/DashboardAnalyticsService";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: DashboardPayload;
  companyName: string;
  siteName: string;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  payload,
  companyName,
  siteName,
}) => {
  if (!isOpen) return null;

  const { production, fleet, fuelCost, hse, stockpile, healthScore, executiveSummary } = payload;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Laporan Eksekutif Operasional Tambang</h2>
              <p className="text-xs text-slate-400">
                {companyName} - {siteName} ({new Date().toLocaleDateString("id-ID", { dateStyle: "full" })})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-amber-400" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-800 bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Report Printable Content */}
        <div className="py-6 space-y-6 text-xs text-slate-200">
          {/* Executive Overview Header */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                MINE SMART AI — EXECUTIVE SUMMARY REPORT
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                Status Operational Health Score: {healthScore.totalScore}/100 ({healthScore.rating})
              </h3>
              <p className="text-xs text-slate-300 mt-1">{healthScore.summary}</p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400">{production.coalAchievementPct}%</div>
              <div className="text-[11px] text-slate-400">Pencapaian Target Batu Bara</div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
              <div className="text-[10px] text-slate-400 font-bold">Produksi Coal</div>
              <div className="text-base font-black text-white mt-1">
                {production.coalActualTon.toLocaleString("id-ID")} Ton
              </div>
              <div className="text-[10px] text-slate-500">Target: {production.coalTargetTon.toLocaleString("id-ID")} Ton</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
              <div className="text-[10px] text-slate-400 font-bold">Fleet Availability (PA)</div>
              <div className="text-base font-black text-emerald-400 mt-1">{fleet.physicalAvailabilityPA}%</div>
              <div className="text-[10px] text-slate-500">{fleet.running} Units Operating</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
              <div className="text-[10px] text-slate-400 font-bold">Fuel Ratio</div>
              <div className="text-base font-black text-amber-300 mt-1">{fuelCost.fuelPerTonRatio} L/Ton</div>
              <div className="text-[10px] text-slate-500">Var +{fuelCost.fuelVariancePct}%</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
              <div className="text-[10px] text-slate-400 font-bold">HSE Zero LTI Record</div>
              <div className="text-base font-black text-emerald-400 mt-1">{hse.daysWithoutLTI} Hari</div>
              <div className="text-[10px] text-slate-500">{hse.totalIncidents} Incident Act</div>
            </div>
          </div>

          {/* AI Prescriptive Guidance */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-1 text-emerald-400 font-extrabold">
              <Sparkles className="h-4 w-4" />
              <span>Rekomendasi Strategis AI Copilot</span>
            </div>
            <p className="italic text-slate-300 leading-relaxed">
              "{executiveSummary.aiExecutiveRecommendation}"
            </p>
          </div>

          {/* Signatures Block */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-[11px] text-slate-400">
            <div>
              <p className="mb-12">Disiapkan Oleh (Mine Manager):</p>
              <div className="border-b border-slate-700 w-48 mx-auto pb-1 font-bold text-slate-200">
                Ir. Hendra Wijaya, M.T.
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Head of Mining Operations</p>
            </div>

            <div>
              <p className="mb-12">Disetujui Oleh (Director / Owner):</p>
              <div className="border-b border-slate-700 w-48 mx-auto pb-1 font-bold text-slate-200">
                Drs. H. Bambang Soeprapto
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">President Director</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs transition-colors"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
