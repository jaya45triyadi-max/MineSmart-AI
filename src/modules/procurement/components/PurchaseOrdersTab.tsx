// MINE SMART AI - Purchase Orders (PO) Tab with Amendment & Versioning

import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  History,
  Building2,
  Plus,
  X,
  Truck,
  Edit3
} from "lucide-react";
import { PurchaseOrder, POStatus } from "../../../types/procurementTypes";

interface PurchaseOrdersTabProps {
  pos: PurchaseOrder[];
  onSavePO: (po: PurchaseOrder) => void;
}

export const PurchaseOrdersTab: React.FC<PurchaseOrdersTabProps> = ({
  pos,
  onSavePO,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPOModal, setSelectedPOModal] = useState<PurchaseOrder | null>(null);
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState("");

  const filteredPOs = pos.filter((p) => {
    const matchesSearch =
      p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.prNumber && p.prNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleAmendPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOModal) return;
    if (!amendmentReason.trim()) {
      alert("Harap masukkan alasan perubahan PO Amendment!");
      return;
    }

    const updatedPO: PurchaseOrder = {
      ...selectedPOModal,
      notes: amendmentReason,
      // Modify small detail to simulate revision
      grandTotal: selectedPOModal.grandTotal + 5000000,
    };

    onSavePO(updatedPO);
    setShowAmendmentForm(false);
    setSelectedPOModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" /> Purchase Orders (PO) & Versioning Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dokumen pemesanan resmi vendor, kontrol revisi (Rev 0, Rev 1), lacak penerimaan barang DDP
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari PO No, Vendor, PR Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none"
        >
          <option value="ALL">Semua Status PO</option>
          <option value="APPROVED">APPROVED / ACTIVE</option>
          <option value="PARTIALLY_RECEIVED">PARTIALLY RECEIVED</option>
          <option value="FULLY_RECEIVED">FULLY RECEIVED</option>
          <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
        </select>
      </div>

      {/* PO Table */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">PO Number & Revision</th>
                <th className="p-3.5">Vendor Name</th>
                <th className="p-3.5">Tanggal PO & Delivery</th>
                <th className="p-3.5 text-right">Grand Total (IDR)</th>
                <th className="p-3.5">Progres Penerimaan</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredPOs.map((po) => (
                <tr key={po.poId} className="hover:bg-slate-700/30 transition">
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      {po.poNumber}
                      <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded text-[10px] font-sans font-bold">
                        Rev {po.currentRevision}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">PR Ref: {po.prNumber || "Direct PO"}</div>
                  </td>
                  <td className="p-3.5 font-bold text-white max-w-xs truncate">
                    {po.vendorName}
                  </td>
                  <td className="p-3.5">
                    <div>PO: {po.poDate}</div>
                    <div className="text-[10px] text-amber-300 font-semibold">Delivery Exp: {po.deliveryDate}</div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-amber-300">
                    {formatIDR(po.grandTotal)}
                  </td>
                  <td className="p-3.5">
                    <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{ width: `${po.receivedQtySummary?.percentage || (po.status === "FULLY_RECEIVED" ? 100 : po.status === "PARTIALLY_RECEIVED" ? 50 : 0)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {po.receivedQtySummary?.received || 0} / {po.receivedQtySummary?.ordered || po.items.length} Received
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      po.status === "FULLY_RECEIVED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : po.status === "PARTIALLY_RECEIVED"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedPOModal(po)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-[11px] transition"
                    >
                      Detail & Rev
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Detail & Amendment Modal */}
      {selectedPOModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">{selectedPOModal.poNumber} (Rev {selectedPOModal.currentRevision})</span>
                <h3 className="text-lg font-bold text-white">Purchase Order Details</h3>
              </div>
              <button onClick={() => { setSelectedPOModal(null); setShowAmendmentForm(false); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div><span className="text-slate-400">Vendor:</span> <strong className="text-white">{selectedPOModal.vendorName}</strong></div>
              <div><span className="text-slate-400">Diterbitkan Oleh:</span> <span className="text-white">{selectedPOModal.createdBy}</span></div>
              <div><span className="text-slate-400">Alamat Pengiriman DDP:</span> <span className="text-slate-300">{selectedPOModal.shippingAddress}</span></div>
              <div><span className="text-slate-400">Termin Pembayaran:</span> <span className="text-amber-300 font-semibold">{selectedPOModal.paymentTerms}</span></div>
            </div>

            {/* Item Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Item Terdaftar di PO</h4>
              <div className="bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-2.5">Item Code & Name</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Harga Satuan</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {selectedPOModal.items.map((it) => (
                      <tr key={it.poItemId}>
                        <td className="p-2.5">
                          <div className="font-mono font-bold text-amber-400">{it.itemCode}</div>
                          <div>{it.itemName}</div>
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.quantity} {it.unit}</td>
                        <td className="p-2.5 text-right">{formatIDR(it.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-amber-300">{formatIDR(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs font-bold px-2">
                <span className="text-slate-400">Grand Total PO:</span>
                <span className="text-lg text-amber-400">{formatIDR(selectedPOModal.grandTotal)}</span>
              </div>
            </div>

            {/* Revision History */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-amber-400" /> Riwayat Amandemen PO (Revision Audit Log)
              </h4>
              <div className="space-y-2">
                {selectedPOModal.revisionHistory.map((rev) => (
                  <div key={rev.revisionNumber} className="p-2.5 bg-slate-800/40 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-400">Revision {rev.revisionNumber}</span>
                      <span className="text-slate-400 text-[10px]">{rev.changeDate}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{rev.changeReason}</p>
                    <div className="text-[10px] text-slate-400">Oleh: {rev.changedBy}</div>
                  </div>
                ))}
              </div>
            </div>

            {!showAmendmentForm ? (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowAmendmentForm(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Amandemen PO (Buat Rev Baru)
                </button>
              </div>
            ) : (
              <form onSubmit={handleAmendPO} className="p-3 bg-slate-800/80 rounded-xl border border-amber-500/40 space-y-3">
                <h4 className="text-xs font-bold text-amber-400">Form PO Amendment / Revision</h4>
                <div>
                  <label className="text-[11px] text-slate-300 font-medium">Alasan Amandemen / Perubahan Jumlah & Spesifikasi *</label>
                  <textarea
                    required
                    rows={2}
                    value={amendmentReason}
                    onChange={(e) => setAmendmentReason(e.target.value)}
                    placeholder="Contoh: Penyesuaian ongkos kirim helikopter darurat sesuai kesepakatan vendor..."
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAmendmentForm(false)} className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg">
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg">
                    Simpan Rev Baru
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
