// MINE SMART AI - Accounts Receivable (AR) & Aging Analytics Tab
import React, { useState } from "react";
import { Clock, ShieldAlert, CheckCircle2, DollarSign, Search, AlertTriangle, ArrowUpRight, UserCheck } from "lucide-react";
import { AccountsReceivable } from "../../../types/financeTypes";

interface ReceivablesARTabProps {
  arList: AccountsReceivable[];
  onSaveAR: (ar: AccountsReceivable) => Promise<void>;
}

export const ReceivablesARTab: React.FC<ReceivablesARTabProps> = ({ arList, onSaveAR }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAging, setSelectedAging] = useState<string>("ALL");
  const [selectedAR, setSelectedAR] = useState<AccountsReceivable | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const agingBuckets = [
    { key: "CURRENT", label: "Current (Lancar)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { key: "1-30_DAYS", label: "1–30 Hari", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { key: "31-60_DAYS", label: "31–60 Hari", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    { key: "61-90_DAYS", label: "61–90 Hari", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { key: ">180_DAYS", label: ">180 Hari", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  const filteredAR = arList.filter((ar) => {
    const matchesSearch =
      ar.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAging = selectedAging === "ALL" || ar.agingBucket === selectedAging;
    return matchesSearch && matchesAging;
  });

  const totalAR = arList.reduce((acc, a) => acc + a.outstandingAmountIDR, 0);

  const handleRecordPayment = async () => {
    if (!selectedAR || paymentAmount <= 0) return;

    const newPaid = selectedAR.paidAmountIDR + paymentAmount;
    const newOutstanding = Math.max(0, selectedAR.invoiceAmountIDR - newPaid);
    const newStatus = newOutstanding === 0 ? "PAID" : "PARTIALLY_PAID";

    const updatedAR: AccountsReceivable = {
      ...selectedAR,
      paidAmountIDR: newPaid,
      outstandingAmountIDR: newOutstanding,
      status: newStatus,
    };

    await onSaveAR(updatedAR);
    setSelectedAR(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* AR Aging Summary Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Outstanding AR</div>
          <div className="text-base font-black text-emerald-400 mt-1">{formatIDR(totalAR)}</div>
          <div className="text-[10px] text-slate-500 mt-1">{arList.length} Invoices Active</div>
        </div>

        {agingBuckets.map((bucket) => {
          const items = arList.filter((a) => a.agingBucket === bucket.key);
          const sum = items.reduce((acc, a) => acc + a.outstandingAmountIDR, 0);
          return (
            <div
              key={bucket.key}
              onClick={() => setSelectedAging(selectedAging === bucket.key ? "ALL" : bucket.key)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                selectedAging === bucket.key ? "ring-2 ring-amber-500 " + bucket.color : "bg-slate-900/90 border-slate-800"
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase">{bucket.label}</div>
              <div className={`text-sm font-black mt-1 ${bucket.color.split(" ")[0]}`}>{formatIDR(sum)}</div>
              <div className="text-[10px] text-slate-500 mt-1">{items.length} Invoices</div>
            </div>
          );
        })}
      </div>

      {/* AR Table Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama pelanggan, nomor invoice AR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {selectedAging !== "ALL" && (
            <button
              onClick={() => setSelectedAging("ALL")}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700"
            >
              Reset Filter Aging
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">No. Invoice & Tanggal</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Aging Bucket</th>
                <th className="p-3">Total Invoice</th>
                <th className="p-3">Sudah Dibayar</th>
                <th className="p-3 text-right">Sisa Outstanding</th>
                <th className="p-3 text-center">Risk Level</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAR.map((ar) => (
                <tr key={ar.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-amber-400">{ar.invoiceNumber}</div>
                    <div className="text-[10px] text-slate-500">Jatuh Tempo: {ar.dueDate}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{ar.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ar.contractCode}</div>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {ar.agingBucket} ({ar.daysOutstanding} Hari)
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(ar.invoiceAmountIDR)}</td>
                  <td className="p-3 font-mono text-emerald-400">{formatIDR(ar.paidAmountIDR)}</td>
                  <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                    {formatIDR(ar.outstandingAmountIDR)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ar.riskLevel === "LOW"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : ar.riskLevel === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {ar.riskLevel} RISK
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ar.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : ar.status === "PARTIALLY_PAID"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : ar.status === "OVERDUE"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {ar.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {ar.outstandingAmountIDR > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedAR(ar);
                          setPaymentAmount(ar.outstandingAmountIDR);
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30 transition"
                      >
                        Terima Bayar
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500">Lunas</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Receipt Modal */}
      {selectedAR && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Catat Pembayaran Masuk (AR Payment Receipt)</h3>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>Invoice: <strong className="text-amber-400">{selectedAR.invoiceNumber}</strong></div>
              <div>Pelanggan: <strong className="text-white">{selectedAR.customerName}</strong></div>
              <div>Outstanding Sisa: <strong className="text-emerald-400 font-mono">{formatIDR(selectedAR.outstandingAmountIDR)}</strong></div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Jumlah Pembayaran Diterima (IDR)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedAR(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs hover:bg-emerald-600 transition"
              >
                Konfirmasi Terima Kas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
