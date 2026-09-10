// MINE SMART AI - Accounts Payable (AP) & 3-Way Matching Tab
import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, DollarSign, Search, AlertOctagon, ArrowUpRight, FileCheck } from "lucide-react";
import { AccountsPayable } from "../../../types/financeTypes";

interface PayablesAPTabProps {
  apList: AccountsPayable[];
  onSaveAP: (ap: AccountsPayable) => Promise<void>;
}

export const PayablesAPTab: React.FC<PayablesAPTabProps> = ({ apList, onSaveAP }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAP, setSelectedAP] = useState<AccountsPayable | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const filteredAP = apList.filter(
    (ap) =>
      ap.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ap.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ap.supplierInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAP = apList.reduce((acc, a) => acc + a.outstandingAmountIDR, 0);

  const handleRecordPayment = async () => {
    if (!selectedAP || paymentAmount <= 0) return;

    if (selectedAP.matchingStatus === "MISMATCH") {
      alert("Peringatan Kebijakan Finance: Tidak dapat memproses pembayaran untuk tagihan yang statusnya 3-Way Match MISMATCH sebelum dilakukan kliring penyesuaian!");
      return;
    }

    const newPaid = selectedAP.paidAmountIDR + paymentAmount;
    const newOutstanding = Math.max(0, selectedAP.invoiceAmountIDR - newPaid);
    const newStatus = newOutstanding === 0 ? "PAID" : "PARTIALLY_PAID";

    const updatedAP: AccountsPayable = {
      ...selectedAP,
      paidAmountIDR: newPaid,
      outstandingAmountIDR: newOutstanding,
      status: newStatus,
    };

    await onSaveAP(updatedAP);
    setSelectedAP(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* 3-Way Matching Concept Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/30 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Prinsip Audit Finance: 3-Way Policy Matching</h3>
              <p className="text-xs text-slate-400">Pemberlakuan Verifikasi Tiga Arah: Purchase Order (PO) + Goods Receipt (GR) + Vendor Invoice</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-amber-400">
            Total AP Outstanding: {formatIDR(totalAP)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Step 1: Purchase Order</span>
            <span className="text-slate-200 font-medium">Validasi Harga Satuan & Item Disetujui Procurement</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Step 2: Goods Receipt</span>
            <span className="text-slate-200 font-medium">Validasi Volume Fisik Diterima Warehouse Site</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Step 3: Vendor Invoice</span>
            <span className="text-slate-200 font-medium">Verifikasi Total Tagihan Vendor Supplier</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Pemberlakuan Blokir Auto-Pay</span>
            <span className="text-rose-400 font-bold">Gagal Policy Match = Bayar Dikunci</span>
          </div>
        </div>
      </div>

      {/* AP Table Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari vendor, nomor PO, nomor invoice supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active Accounts Payable List ({filteredAP.length} Records)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Vendor Supplier</th>
                <th className="p-3">PO & Goods Receipt</th>
                <th className="p-3">Invoice Vendor</th>
                <th className="p-3">Nilai Tagihan IDR</th>
                <th className="p-3">3-Way Match Status</th>
                <th className="p-3 text-right">Sisa Hutang IDR</th>
                <th className="p-3 text-center">Status AP</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAP.map((ap) => {
                const isMatched = ap.matchingStatus === "MATCHED";
                return (
                  <tr key={ap.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">
                      <div>{ap.vendorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Jatuh Tempo: {ap.dueDate}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="text-amber-400 font-bold">{ap.poNumber}</div>
                      <div className="text-[10px] text-slate-400">{ap.goodsReceiptNumber}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{ap.supplierInvoiceNumber}</td>
                    <td className="p-3 font-mono text-slate-200">{formatIDR(ap.invoiceAmountIDR)}</td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                            isMatched
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isMatched ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {ap.matchingStatus}
                        </span>
                        {ap.matchingNotes && (
                          <div className="text-[10px] text-slate-400 leading-tight max-w-xs">{ap.matchingNotes}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-black text-amber-400 text-sm">
                      {formatIDR(ap.outstandingAmountIDR)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          ap.status === "PAID"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : ap.status === "PARTIALLY_PAID"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {ap.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ap.outstandingAmountIDR > 0 ? (
                        <button
                          disabled={!isMatched}
                          onClick={() => {
                            setSelectedAP(ap);
                            setPaymentAmount(ap.outstandingAmountIDR);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                            isMatched
                              ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30"
                              : "bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed"
                          }`}
                        >
                          {isMatched ? "Bayar Vendor" : "Dikunci Policy"}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500">Lunas</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Vendor Modal */}
      {selectedAP && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Proses Pembayaran Vendor (AP Payment Release)</h3>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>Vendor: <strong className="text-amber-400">{selectedAP.vendorName}</strong></div>
              <div>PO Reference: <strong className="text-white">{selectedAP.poNumber}</strong></div>
              <div>Matching Status: <strong className="text-emerald-400">3-WAY MATCHED OK</strong></div>
              <div>Outstanding Sisa: <strong className="text-amber-400 font-mono">{formatIDR(selectedAP.outstandingAmountIDR)}</strong></div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Jumlah Pembayaran Keluar (IDR)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedAP(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-600 transition"
              >
                Konfirmasi Release Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
