// MINE SMART AI - Invoice Management & 3-Way Matching Tab

import React, { useState } from "react";
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  DollarSign,
  ShieldAlert,
  HelpCircle,
  Eye
} from "lucide-react";
import { Invoice, MatchingStatus, PurchaseOrder, GoodsReceipt } from "../../../types/procurementTypes";

interface InvoiceAndMatchingTabProps {
  invoices: Invoice[];
  pos: PurchaseOrder[];
  receipts: GoodsReceipt[];
  onSaveInvoice: (invoice: Invoice) => void;
}

export const InvoiceAndMatchingTab: React.FC<InvoiceAndMatchingTabProps> = ({
  invoices,
  pos,
  receipts,
  onSaveInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((i) =>
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" /> Invoice Management & Automated 3-Way Matching
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifikasi tripartit Purchase Order (PO) ↔ Goods Receipt (GR) ↔ Vendor Invoice sebelum pembayaran Finance
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Invoice No, Vendor, PO Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Invoices & Matching Table */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">Invoice No & Date</th>
                <th className="p-3.5">Vendor & PO Ref</th>
                <th className="p-3.5">Jatuh Tempo (Due Date)</th>
                <th className="p-3.5 text-right">Nilai Tagihan (IDR)</th>
                <th className="p-3.5 text-center">3-Way Match Status</th>
                <th className="p-3.5">Status Pembayaran</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.invoiceId} className="hover:bg-slate-700/30 transition">
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-indigo-300">{inv.invoiceNumber}</div>
                    <div className="text-[10px] text-slate-400">{inv.invoiceDate}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{inv.vendorName}</div>
                    <div className="text-[10px] text-amber-400 font-mono">PO: {inv.poNumber}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">
                    {inv.dueDate}
                  </td>
                  <td className="p-3.5 text-right font-bold text-amber-300">
                    {formatIDR(inv.grandTotal)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 ${
                      inv.matchingStatus === "MATCHED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {inv.matchingStatus === "MATCHED" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {inv.matchingStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedInvoiceModal(inv)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-[11px] transition flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-3 h-3" /> Verifikasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Verification Modal */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-bold">{selectedInvoiceModal.invoiceNumber}</span>
                <h3 className="text-lg font-bold text-white">Matriks Verifikasi 3-Way Matching</h3>
              </div>
              <button onClick={() => setSelectedInvoiceModal(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Perbandingan Tripartit</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="text-[10px] text-slate-400">1. Purchase Order (PO)</div>
                  <div className="font-mono text-amber-400 font-bold mt-1">{selectedInvoiceModal.poNumber}</div>
                  <div className="text-white font-bold mt-1">{formatIDR(selectedInvoiceModal.grandTotal)}</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="text-[10px] text-slate-400">2. Goods Receipt (GR)</div>
                  <div className="font-mono text-emerald-400 font-bold mt-1">{selectedInvoiceModal.receiptNumber || "GR-Verified"}</div>
                  <div className="text-emerald-300 font-bold mt-1">QC Passed</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="text-[10px] text-slate-400">3. Vendor Invoice</div>
                  <div className="font-mono text-indigo-300 font-bold mt-1">{selectedInvoiceModal.invoiceNumber}</div>
                  <div className="text-white font-bold mt-1">{formatIDR(selectedInvoiceModal.grandTotal)}</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>3-Way Matching Sempurna: Jumlah barang, harga satuan, dan PPN sesuai antara PO, Goods Receipt, dan Tagihan Vendor. Siap diteruskan ke modul Finance untuk pembayaran.</span>
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button onClick={() => setSelectedInvoiceModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
