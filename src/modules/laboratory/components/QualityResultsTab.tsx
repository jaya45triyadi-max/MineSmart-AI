import React, { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  UserCheck,
  Sparkles,
  FileSpreadsheet,
  XCircle,
} from "lucide-react";
import { QualityResult, ParameterStatus } from "../../../types/laboratoryTypes";

interface QualityResultsTabProps {
  results: QualityResult[];
  onApproveResult: (resultId: string) => void;
  onRejectResult: (resultId: string) => void;
}

export const QualityResultsTab: React.FC<QualityResultsTabProps> = ({
  results,
  onApproveResult,
  onRejectResult,
}) => {
  const [filterApproval, setFilterApproval] = useState<"ALL" | "APPROVED" | "UNAPPROVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.sampleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.parameter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.analystName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApproval =
      filterApproval === "ALL" ||
      (filterApproval === "APPROVED" && r.isApproved) ||
      (filterApproval === "UNAPPROVED" && !r.isApproved);
    return matchesSearch && matchesApproval;
  });

  const approvedCount = results.filter((r) => r.isApproved).length;
  const unapprovedCount = results.filter((r) => !r.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Hasil Kualitas & Verifikasi Approval
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat verifikasi hasil pengujian laboratorium. Membedakan secara ketat antara hasil <strong className="text-emerald-600 dark:text-emerald-400">Approved Official</strong> dan <strong className="text-amber-600 dark:text-amber-400">Unapproved Draft</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            {approvedCount} Approved
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/20">
            {unapprovedCount} Pending Review
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode sample, parameter, atau analis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status Approval:</span>
          {(["ALL", "APPROVED", "UNAPPROVED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterApproval(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterApproval === status
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3">Kode Sample</th>
              <th className="py-3 px-3">Parameter & Basis</th>
              <th className="py-3 px-3">Hasil Pengujian</th>
              <th className="py-3 px-3">Method Standard</th>
              <th className="py-3 px-3">Kesesuaian Spec</th>
              <th className="py-3 px-3">Analis / Reviewer</th>
              <th className="py-3 px-3">Approval Status</th>
              <th className="py-3 px-3 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredResults.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {res.sampleCode}
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {res.parameterName || res.parameter}
                  </div>
                  <div className="text-[11px] text-slate-500">Basis: {res.basis}</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {res.value} <span className="text-xs font-normal text-slate-500">{res.unit}</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                  {res.method}
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      res.status === "PASS"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : res.status === "WARNING"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {res.analystName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Approved By: {res.approvedBy || "Belum Disetujui"}
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  {res.isApproved ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                      <Clock className="w-3.5 h-3.5" /> UNAPPROVED DRAFT
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-right">
                  {!res.isApproved ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onApproveResult(res.resultId)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px] transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectResult(res.resultId)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 font-bold text-[11px] transition"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">Verified & Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
