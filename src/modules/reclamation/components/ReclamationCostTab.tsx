import React from "react";
import {
  DollarSign,
  TrendingUp,
  Building,
  PieChart,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ReclamationCostRecord, ReclamationKPISummary } from "../../../types/reclamationTypes";

interface Props {
  costRecords: ReclamationCostRecord[];
  kpi: ReclamationKPISummary | null;
}

export const ReclamationCostTab: React.FC<Props> = ({ costRecords, kpi }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-purple-400" />
          Reclamation Cost Management & Cost/Hectare Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pengelolaan biaya operasional reklamasi, analisis biaya per hektare (Cost/Ha = Total Cost / Area Reclaimed), dan efisiensi kontraktor.
        </p>
      </div>

      {/* KPI Cost Breakdown */}
      {kpi && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Biaya Reklamasi</span>
            <div className="mt-2 text-2xl font-black text-white">
              Rp {(kpi.totalReclamationCostIDR / 1000000000).toFixed(2)} Miliar
            </div>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1">Realisasi Tahun 2026</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase">Luas Ter-reklamasi</span>
            <div className="mt-2 text-2xl font-black text-emerald-400">
              {kpi.areaReclamationProgressPercent ? `${kpi.areaReclaimedHa} ha` : `${kpi.areaRevegetatedHa} ha`}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Telah Ditata &amp; Ditanam</span>
          </div>

          <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-5 shadow-md border">
            <span className="text-xs font-semibold text-purple-300 uppercase">Cost per Hectare (Cost/Ha)</span>
            <div className="mt-2 text-2xl font-black text-purple-400">
              Rp {(kpi.costPerHectareIDR / 1000000).toFixed(1)} Juta / ha
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Standar Efisiensi RKAB</span>
          </div>
        </div>
      )}

      {/* Cost Transactions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Rincian Transaksi Biaya Reklamasi Per Pekerjaan (Cost Ledger)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Biaya</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Kategori Pekerjaan</th>
                <th className="px-4 py-3">Deskripsi / Uraian</th>
                <th className="px-4 py-3">Anggaran Budget</th>
                <th className="px-4 py-3">Realisasi Biaya</th>
                <th className="px-4 py-3">Biaya / Ha</th>
                <th className="px-4 py-3">Kontraktor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {costRecords.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-purple-400">{c.costId}</td>
                  <td className="px-4 py-3 text-slate-400">{c.date}</td>
                  <td className="px-4 py-3 font-semibold text-white">{c.costCategory}</td>
                  <td className="px-4 py-3 text-slate-300">{c.description}</td>
                  <td className="px-4 py-3 text-slate-400">
                    Rp {(c.budgetIDR / 1000000).toFixed(0)}M
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-400">
                    Rp {(c.actualCostIDR / 1000000).toFixed(0)}M
                  </td>
                  <td className="px-4 py-3 font-bold text-purple-300">
                    Rp {(c.costPerHaIDR / 1000000).toFixed(1)}M /ha
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.contractorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
