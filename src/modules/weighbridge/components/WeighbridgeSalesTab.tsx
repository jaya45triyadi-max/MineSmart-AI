import React from "react";
import { ShoppingCart, Ship, CheckCircle2, DollarSign, FileText, TrendingUp } from "lucide-react";
import { WeighbridgeTicket } from "../../../types/weighbridgeTypes";

interface WeighbridgeSalesTabProps {
  tickets: WeighbridgeTicket[];
}

export const WeighbridgeSalesTab: React.FC<WeighbridgeSalesTabProps> = ({ tickets }) => {
  const salesTickets = tickets.filter(
    (t) => t.destination.toLowerCase().includes("vessel") || t.destination.toLowerCase().includes("port") || t.destination.toLowerCase().includes("so-")
  );

  const totalSalesTonnage = salesTickets.reduce((acc, t) => acc + t.normalizedValue, 0).toFixed(1);
  const estimatedRevenueBasis = (Number(totalSalesTonnage) * 85 * 15500).toLocaleString("id-ID"); // ~$85/ton @ 15,500 IDR

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            Integrasi Penjualan (Sales & Shipment) & Biaya Komersial
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penetapan kuantitas akhir tongkang/kapal berdasarkan transaksi penimbangan resmi yang telah disetujui (Approved Net Quantity).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
            Total Tonnage Sales: {totalSalesTonnage} Ton
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-500 text-xs font-bold border border-sky-500/20">
            Est. Revenue Basis: Rp {estimatedRevenueBasis}
          </div>
        </div>
      </div>

      {/* Contract Fulfillment & Vessel Weighing Table */}
      <div className="rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span>Pemuatan Kapal / Tonase Kontrak Penjualan</span>
          <span className="text-xs text-emerald-500 font-medium">Berdasarkan Timbangan Port Jetty Gate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">No. Tiket</th>
                <th className="py-3 px-4">Unit Truk</th>
                <th className="py-3 px-4">Material Sales</th>
                <th className="py-3 px-4">Tujuan / Vessel / Contract</th>
                <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">Net Weighed</th>
                <th className="py-3 px-4">Quality & Certificate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {salesTickets.map((t) => (
                <tr key={t.ticketId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{t.ticketNumber}</td>
                  <td className="py-3 px-4 font-semibold">{t.unitNumber}</td>
                  <td className="py-3 px-4">{t.materialType}</td>
                  <td className="py-3 px-4 font-semibold text-sky-500">{t.destination}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.normalizedValue} Ton</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> QUALITY APPROVED
                    </span>
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
