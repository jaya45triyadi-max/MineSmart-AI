import React, { useState, useEffect } from "react";
import { InvoiceService } from "../../services/license/PaymentService";
import { InvoiceRecord } from "../../types/license";
import { Receipt, CheckCircle2, Clock, AlertCircle, Search, DollarSign } from "lucide-react";

export const AdminSubscriptionsModule: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const all = await InvoiceService.getAllInvoices();
    setInvoices(all);
  };

  const handleApprovePayment = async (invId: string) => {
    if (confirm("Konfirmasi penerimaan pembayaran transfer bank untuk invoice ini?")) {
      await InvoiceService.verifyAndMarkPaid(invId, "BANK_TRANSFER");
      await loadInvoices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-widest">
            SUPER ADMIN SUBSCRIPTIONS & INVOICES
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Verifikasi Pembayaran Transfer Bank & Subskripsi
          </h1>
          <p className="text-xs text-slate-400">
            Daftar invoice tagihan commercial perusahaan tambang dan approval verifikasi manual pembayaran.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-3">No. Invoice</th>
              <th className="p-3">Perusahaan Tambang</th>
              <th className="p-3">Paket</th>
              <th className="p-3">Total Tagihan (IDR)</th>
              <th className="p-3">Tanggal Terbit</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                <td className="p-3 font-semibold text-slate-200">{inv.companyName}</td>
                <td className="p-3 font-bold text-amber-400">{inv.planId}</td>
                <td className="p-3 font-bold text-emerald-400">
                  Rp {inv.amountIDR.toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-slate-400">{new Date(inv.issuedAt).toLocaleDateString("id-ID")}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {inv.status !== "PAID" && (
                    <button
                      onClick={() => handleApprovePayment(inv.id)}
                      className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                    >
                      Approve Payment
                    </button>
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
