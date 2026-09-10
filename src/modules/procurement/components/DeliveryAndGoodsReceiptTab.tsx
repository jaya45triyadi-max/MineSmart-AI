// MINE SMART AI - Delivery Tracking & Goods Receipt (GR) Tab

import React, { useState } from "react";
import {
  Truck,
  CheckCircle2,
  PackageCheck,
  AlertTriangle,
  Plus,
  Search,
  X,
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import { GoodsReceipt, QualityInspection, PurchaseOrder } from "../../../types/procurementTypes";

interface DeliveryAndGoodsReceiptTabProps {
  receipts: GoodsReceipt[];
  inspections: QualityInspection[];
  pos: PurchaseOrder[];
  onSaveReceipt: (receipt: GoodsReceipt) => void;
  onSaveInspection: (inspection: QualityInspection) => void;
}

export const DeliveryAndGoodsReceiptTab: React.FC<DeliveryAndGoodsReceiptTabProps> = ({
  receipts,
  inspections,
  pos,
  onSaveReceipt,
  onSaveInspection,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"RECEIPTS" | "INSPECTIONS">("RECEIPTS");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceiptModal, setSelectedReceiptModal] = useState<GoodsReceipt | null>(null);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" /> Delivery Tracking, Goods Receipt (GR) & Quality Inspection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Penerimaan fisik barang site tambang (Surat Jalan), verifikasi kuantitas & Quality Control (QC)
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 pb-3">
        <button
          onClick={() => setActiveSubTab("RECEIPTS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === "RECEIPTS"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <PackageCheck className="w-4 h-4" /> Goods Receipt (GR) ({receipts.length})
        </button>
        <button
          onClick={() => setActiveSubTab("INSPECTIONS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === "INSPECTIONS"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Quality Control (QC Inspection) ({inspections.length})
        </button>
      </div>

      {/* Receipts Sub-Tab */}
      {activeSubTab === "RECEIPTS" && (
        <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5">GR Number & Date</th>
                  <th className="p-3.5">PO Ref & Vendor</th>
                  <th className="p-3.5">No. Surat Jalan / Resi</th>
                  <th className="p-3.5">Penerima & Lokasi Gudang</th>
                  <th className="p-3.5">Status QC</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {receipts.map((gr) => (
                  <tr key={gr.receiptId} className="hover:bg-slate-700/30 transition">
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-emerald-400">{gr.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400">{gr.receivedDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-amber-400 font-mono">{gr.poNumber}</div>
                      <div className="text-[11px] text-white">{gr.vendorName}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">
                      {gr.deliveryReference}
                      <div className="text-[10px] text-slate-400">Driver: {gr.driverName || "-"} ({gr.vehiclePlateNo || "-"})</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{gr.warehouseName}</div>
                      <div className="text-[10px] text-slate-400">Diterima: {gr.receivedBy}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        gr.inspectionStatus === "PASSED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {gr.inspectionStatus || "PENDING QC"}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedReceiptModal(gr)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-[11px] transition"
                      >
                        Detail Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QC Sub-tab */}
      {activeSubTab === "INSPECTIONS" && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4">
            <h3 className="text-sm font-bold text-white mb-3">Laporan Quality Inspection Sparepart Tambang</h3>
            <div className="space-y-3">
              {inspections.map((qc) => (
                <div key={qc.inspectionId} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{qc.receiptNumber}</span>
                      <span className="text-sm font-bold text-white">{qc.itemName}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Inspector: {qc.inspectorName} | Spec: {qc.specification}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">
                      {qc.result} ({qc.acceptedQty} Diterima)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GR Detail Modal */}
      {selectedReceiptModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold">{selectedReceiptModal.receiptNumber}</span>
                <h3 className="text-lg font-bold text-white">Goods Receipt Item Breakdown</h3>
              </div>
              <button onClick={() => setSelectedReceiptModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div><span className="text-slate-400">Vendor:</span> <strong className="text-white">{selectedReceiptModal.vendorName}</strong></div>
              <div><span className="text-slate-400">PO Ref:</span> <span className="font-mono text-amber-400 font-bold">{selectedReceiptModal.poNumber}</span></div>
              <div><span className="text-slate-400">No Resi/Surat Jalan:</span> <span className="text-slate-200">{selectedReceiptModal.deliveryReference}</span></div>
              <div><span className="text-slate-400">Catatan Penerima:</span> <span className="text-slate-200">{selectedReceiptModal.notes}</span></div>
            </div>

            <div className="bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-2.5">Item Code & Name</th>
                    <th className="p-2.5 text-center">Ordered</th>
                    <th className="p-2.5 text-center">Delivered</th>
                    <th className="p-2.5 text-center">Accepted</th>
                    <th className="p-2.5 text-center">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {selectedReceiptModal.items.map((it) => (
                    <tr key={it.receivingItemId}>
                      <td className="p-2.5">
                        <div className="font-mono font-bold text-amber-400">{it.itemCode}</div>
                        <div>{it.itemName}</div>
                      </td>
                      <td className="p-2.5 text-center">{it.orderedQty} {it.unit}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-400">{it.deliveredQty} {it.unit}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-300">{it.acceptedQty} {it.unit}</td>
                      <td className="p-2.5 text-center font-bold text-rose-400">{it.remainingQty} {it.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button onClick={() => setSelectedReceiptModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
