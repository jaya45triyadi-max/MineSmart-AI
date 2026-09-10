import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { InvoiceService } from "../../services/license/PaymentService";
import { InvoiceRecord } from "../../types/license";
import { Receipt, CheckCircle2, Clock, AlertCircle, FileText, Send, X } from "lucide-react";

export const CustomerInvoicesModule: React.FC = () => {
  const { company } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  useEffect(() => {
    loadInvoices();
  }, [company.id]);

  const loadInvoices = async () => {
    const list = await InvoiceService.getInvoicesForCompany(company.id);
    setInvoices(list);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
            INVOICE & RIWAYAT PEMBAYARAN
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Daftar Tagihan Komersial Subskripsi
          </h1>
          <p className="text-xs text-slate-400">
            Seluruh invoice tagihan resmi PT MINE SMART AI Indonesia beserta instruksi transfer bank resmi.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-3">No. Invoice</th>
              <th className="p-3">Tanggal Terbit</th>
              <th className="p-3">Jatuh Tempo</th>
              <th className="p-3">Paket Subskripsi</th>
              <th className="p-3">Total Tagihan (IDR)</th>
              <th className="p-3">Status Pembayaran</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Belum ada riwayat invoice diterbitkan.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                  <td className="p-3 text-slate-400">{new Date(inv.issuedAt).toLocaleDateString("id-ID")}</td>
                  <td className="p-3 text-slate-400">{new Date(inv.dueAt).toLocaleDateString("id-ID")}</td>
                  <td className="p-3 font-bold text-amber-400">{inv.planId}</td>
                  <td className="p-3 font-bold text-emerald-400">
                    Rp {inv.amountIDR.toLocaleString("id-ID")}
                  </td>
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
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700"
                    >
                      Detail Transfer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Receipt className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Detail Invoice Pembayaran</h3>
                <p className="text-xs text-slate-400">{selectedInvoice.invoiceNumber}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Tagihan:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    Rp {selectedInvoice.amountIDR.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Invoice:</span>
                  <span className="font-bold text-amber-400">{selectedInvoice.status}</span>
                </div>
              </div>

              <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/30 text-amber-300 space-y-2">
                <p className="font-bold text-amber-200">Rekening Tujuan Transfer Bank (IDR):</p>
                <div className="text-[11px] space-y-1">
                  <div>Bank: <span className="font-bold text-white">PT BANK MANDIRI (PERSERO) TBK</span></div>
                  <div>No. Rekening: <span className="font-bold text-emerald-300 font-mono text-xs">137-00-2026888-9</span></div>
                  <div>Atas Nama: <span className="font-bold text-white">PT MINE SMART AI INDONESIA</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
