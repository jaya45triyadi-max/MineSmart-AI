// MINE SMART AI - Reorder Engine Tab
import React from "react";
import { AlertTriangle, TrendingUp, ShieldCheck, ShoppingCart, CheckCircle2 } from "lucide-react";
import { ReorderRecommendation } from "../../../types/warehouseTypes";

interface ReorderEngineTabProps {
  recommendations: ReorderRecommendation[];
  onOpenProcurementPR?: () => void;
}

export const ReorderEngineTab: React.FC<ReorderEngineTabProps> = ({ recommendations }) => {
  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Mesin Rekomendasi Reorder Otomatis (Reorder Engine & Safety Stock)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Menganalisis rumus [Stok Tersedia + PO Dalam Perjalanan ≤ Reorder Point] agar pengadaan suku cadang tepat waktu tanpa duplikasi pembelian.
          </p>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Item & Kode</th>
                <th className="py-3 px-4">Kategori / Supplier</th>
                <th className="py-3 px-4 text-center">Tersedia</th>
                <th className="py-3 px-4 text-center">PO In-Transit</th>
                <th className="py-3 px-4 text-center">Reorder Point</th>
                <th className="py-3 px-4 text-center">Rekomendasi Qty</th>
                <th className="py-3 px-4 text-right">Estimasi Biaya (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recommendations.map((rec) => (
                <tr key={rec.recommendationId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{rec.itemName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{rec.itemCode}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div>{rec.categoryName}</div>
                    <div className="text-[11px] text-slate-500">{rec.supplierName}</div>
                  </td>

                  <td className="py-3 px-4 text-center font-black text-rose-400">
                    {rec.availableStock}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-purple-300">
                    {rec.openPOQuantity}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-amber-400">
                    {rec.reorderPoint}
                  </td>

                  <td className="py-3 px-4 text-center font-black text-emerald-400 text-sm">
                    {rec.recommendedQty}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-emerald-400">
                    {formatIDR(rec.totalEstimatedCostIDR)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
