import React, { useState } from "react";
import { Scale, CheckCircle2, AlertTriangle, Plus, FileText, X, ArrowUpRight, ArrowDownRight, Compass } from "lucide-react";
import { StockReconciliation, StockAdjustment, Stockpile } from "../../../types/stockpileTypes";

interface StockpileReconciliationTabProps {
  reconciliations: StockReconciliation[];
  adjustments: StockAdjustment[];
  stockpiles: Stockpile[];
  onAddAdjustment: (adj: StockAdjustment) => void;
}

export const StockpileReconciliationTab: React.FC<StockpileReconciliationTabProps> = ({
  reconciliations,
  adjustments,
  stockpiles,
  onAddAdjustment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    stockpileId: stockpiles[0]?.id || "",
    quantity: -500,
    reason: "Survey Adjustment" as const,
    reference: "Drone DTM Survey Reconciliation",
    evidence: "Drone Photogrammetry Volume Audit",
  });

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = stockpiles.find((s) => s.id === formData.stockpileId);

    const newAdj: StockAdjustment = {
      id: `ADJ-${Date.now()}`,
      adjustmentId: `ADJ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(10 + Math.random() * 90)}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      stockpileId: formData.stockpileId,
      stockpileName: sp?.stockpileName || "Stockpile",
      quantity: Number(formData.quantity),
      unit: "Ton",
      reason: formData.reason,
      reference: formData.reference,
      evidence: formData.evidence,
      approvedBy: "Site Manager (Pending Approval)",
      approvalStatus: "SUBMITTED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddAdjustment(newAdj);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-500" />
            Stockpile Mass Balance & Survey Reconciliation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rekonsiliasi berkala stok sistem vs stok fisik hasil pengukuran survey drone DTM/DSM (Volume m³ × Density Ton/m³).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Penyesuaian Stok (Adjustment)</span>
        </button>
      </div>

      {/* Formula Explanation Callout */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">Rumus Rekonsiliasi Massa (Survey Physical Stock Formula)</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Stok Fisik (Ton) = Volume DTM (m³) × Density Batubara (Ton/m³) | Variance % = ((Fisik - Sistem) / Sistem) × 100%
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            Toleransi Standar: ±1.5%
          </span>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Matriks Rekonsiliasi Stok Sistem vs Drone Survey Physical
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3.5 font-bold">Stockpile & Tanggal Survey</th>
                <th className="p-3.5 font-bold text-right">Stok Awal (Ton)</th>
                <th className="p-3.5 font-bold text-right">Masuk (+Ton)</th>
                <th className="p-3.5 font-bold text-right">Keluar (-Ton)</th>
                <th className="p-3.5 font-bold text-right">Stok Sistem (Ton)</th>
                <th className="p-3.5 font-bold text-right">Stok Survey (Ton)</th>
                <th className="p-3.5 font-bold text-right">Variansi (Ton / %)</th>
                <th className="p-3.5 font-bold text-center">Status Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reconciliations.map((rec) => {
                const isMajor = Math.abs(rec.variancePercent) > 2.0;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 dark:text-white">{rec.stockpileName}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Survey: {rec.surveyDate} • Ref: {rec.surveyRefId}
                      </p>
                    </td>
                    <td className="p-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">
                      {rec.openingStock.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      +{rec.totalIncoming.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-red-500">
                      -{rec.totalOutgoing.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900 dark:text-white">
                      {rec.calculatedClosing.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-black text-amber-600 dark:text-amber-400">
                      {rec.surveyQuantity.toLocaleString()}
                      <span className="block text-[10px] font-normal text-slate-400">({rec.volumeM3.toLocaleString()} m³ × {rec.density})</span>
                    </td>
                    <td className={`p-3.5 text-right font-extrabold ${isMajor ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {rec.variance > 0 ? `+${rec.variance}` : rec.variance} Ton
                      <span className="block text-[10px]">({rec.variancePercent}%)</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          rec.status === "MATCHED"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Riwayat Penyesuaian Stok (Stock Adjustment Log)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3.5 font-bold">ID Adjustment</th>
                <th className="p-3.5 font-bold">Stockpile</th>
                <th className="p-3.5 font-bold text-right">Jumlah Adjustment (Ton)</th>
                <th className="p-3.5 font-bold">Alasan Adjustment</th>
                <th className="p-3.5 font-bold">Referensi / Bukti Audit</th>
                <th className="p-3.5 font-bold text-center">Status Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{adj.adjustmentId}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{adj.stockpileName}</td>
                  <td className={`p-3.5 text-right font-black ${adj.quantity >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {adj.quantity >= 0 ? `+${adj.quantity}` : adj.quantity} Ton
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{adj.reason}</td>
                  <td className="p-3.5 text-slate-500 text-[11px]">{adj.reference}</td>
                  <td className="p-3.5 text-center">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {adj.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Adjustment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buat Adjustment Stok Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Pilih Stockpile Target</label>
                <select
                  value={formData.stockpileId}
                  onChange={(e) => setFormData({ ...formData, stockpileId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {stockpiles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.stockpileName} (Saat Ini: {s.currentQuantity.toLocaleString()} Ton)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Jumlah Adjustment Ton (+ / -)
                </label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  placeholder="Gunakan tanda minus untuk pengurangan"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Alasan Penyesuaian</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Survey Adjustment">Survey Adjustment (Hasil Drone DTM)</option>
                  <option value="Measurement Correction">Measurement Correction (Skala Timbang)</option>
                  <option value="Data Correction">Data Correction (Koreksi Input System)</option>
                  <option value="Loss">Loss (Susut Kadar Air / Degradasi)</option>
                  <option value="Gain">Gain (Pengambahan Stok)</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Dokumen Referensi / BAP</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Kirim untuk Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
