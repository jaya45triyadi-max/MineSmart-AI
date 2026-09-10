import React, { useState } from "react";
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { WeighbridgeReconciliation } from "../../../types/weighbridgeTypes";

interface WeighbridgeReconciliationTabProps {
  reconciliations: WeighbridgeReconciliation[];
  onResolveReconciliation: (id: string, resolution: string) => void;
}

export const WeighbridgeReconciliationTab: React.FC<WeighbridgeReconciliationTabProps> = ({
  reconciliations,
  onResolveReconciliation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<WeighbridgeReconciliation | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const filteredRecons = reconciliations.filter((r) => {
    const matchesSearch =
      r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.reason && r.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const matchedCount = reconciliations.filter((r) => r.status === "MATCHED").length;
  const minorCount = reconciliations.filter((r) => r.status === "MINOR_VARIANCE").length;
  const majorCount = reconciliations.filter((r) => r.status === "MAJOR_VARIANCE").length;
  const resolvedCount = reconciliations.filter((r) => r.status === "RESOLVED").length;

  const handleResolve = () => {
    if (!selectedItem || !resolutionNote.trim()) return;
    onResolveReconciliation(selectedItem.reconciliationId, resolutionNote);
    setSelectedItem(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-500" />
            Engine Rekonsiliasi Timbangan & Variansi Operasional
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit pembanding otomatis antara Tonase Timbangan (Weighbridge) vs Dispatch, Produksi Pit, Sales Contract, dan Laporan Keuangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
            Matched: {matchedCount}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
            Minor Var: {minorCount}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
            Major Var: {majorCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Referensi, Source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status Rekonsiliasi:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="MATCHED">MATCHED (0% Var)</option>
            <option value="MINOR_VARIANCE">MINOR VARIANCE (&lt;1%)</option>
            <option value="MAJOR_VARIANCE">MAJOR VARIANCE (&gt;2%)</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Reconciliations Table */}
      <div className="rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Modul Sumber</th>
                <th className="py-3.5 px-4">No. Referensi</th>
                <th className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Tonase Timbangan</th>
                <th className="py-3.5 px-4">Tonase Sistem</th>
                <th className="py-3.5 px-4">Variansi (Ton)</th>
                <th className="py-3.5 px-4">Variansi (%)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecons.map((r) => (
                <tr key={r.reconciliationId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.sourceType}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">{r.referenceNumber}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {r.weighbridgeQuantity.toLocaleString()} Ton
                  </td>
                  <td className="py-3.5 px-4 font-mono">{r.systemQuantity.toLocaleString()} Ton</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {r.variance > 0 ? `+${r.variance}` : r.variance} Ton
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span
                      className={
                        r.variancePercent === 0
                          ? "text-emerald-500"
                          : r.variancePercent > 2
                          ? "text-rose-500"
                          : "text-amber-500"
                      }
                    >
                      {r.variancePercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        r.status === "MATCHED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : r.status === "MAJOR_VARIANCE"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          : r.status === "RESOLVED"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.status !== "MATCHED" && r.status !== "RESOLVED" && (
                      <button
                        onClick={() => setSelectedItem(r)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Investigasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Resolve Variance Investigation */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-purple-500 flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Investigasi Variansi Rekonsiliasi
              </h3>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Modul: {selectedItem.sourceType} ({selectedItem.referenceNumber})</div>
                <div className="text-slate-500">Weighbridge: <strong className="text-emerald-500">{selectedItem.weighbridgeQuantity} Ton</strong> | System: <strong>{selectedItem.systemQuantity} Ton</strong></div>
                <div className="text-slate-500">Selisih Variansi: <strong className="text-rose-500">+{selectedItem.variance} Ton ({selectedItem.variancePercent}%)</strong></div>
              </div>

              {selectedItem.possibleCause && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  <span className="font-bold block text-[11px] mb-0.5">ANALISIS DETEKSI AI / POSSIBLE CAUSE:</span>
                  <p className="text-slate-200 leading-relaxed">{selectedItem.possibleCause}</p>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Catatan Penyelesaian (Resolution Notes)</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Masukkan hasil verifikasi fisik, penyesuaian tiket, atau persetujuan koreksi..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleResolve}
                disabled={!resolutionNote.trim()}
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-bold cursor-pointer text-xs"
              >
                Tandai Resolved & Disetujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
