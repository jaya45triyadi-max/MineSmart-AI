// MINE SMART AI - Goods Receiving (GR) Tab
import React, { useState } from "react";
import { PackageCheck, Truck, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Search, Plus } from "lucide-react";
import { StockBalance, Warehouse } from "../../../types/warehouseTypes";

interface GoodsReceivingTabProps {
  stocks: StockBalance[];
  warehouses: Warehouse[];
  onRecordMovement: (mvt: any) => Promise<any>;
}

export const GoodsReceivingTab: React.FC<GoodsReceivingTabProps> = ({ stocks, warehouses, onRecordMovement }) => {
  const [poNumber, setPoNumber] = useState("PO-2026-0810-01");
  const [vendorName, setVendorName] = useState("PT Hexindo Adiperkasa Tbk");
  const [selectedItemId, setSelectedItemId] = useState("itm-001");
  const [receivedQty, setReceivedQty] = useState<number>(10);
  const [warehouseId, setWarehouseId] = useState("wh-002");
  const [deliveryNote, setDeliveryNote] = useState("DO-HEX-88912");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentGRs, setRecentGRs] = useState<any[]>([
    {
      id: "gr-1",
      grNumber: "GR-2026-0810-001",
      poNumber: "PO-2026-0810-01",
      vendor: "PT Hexindo Adiperkasa Tbk",
      deliveryNote: "DO-HEX-88912",
      item: "Hydraulic Return Filter Element PC1250",
      orderedQty: 10,
      receivedQty: 10,
      warehouse: "Workshop Spare Parts Depot",
      status: "FULLY_RECEIVED",
      date: "2026-08-10 11:30:00",
    },
  ]);

  const handleConfirmReceiving = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedStock = stocks.find((s) => s.itemId === selectedItemId);
      const wh = warehouses.find((w) => w.warehouseId === warehouseId);

      await onRecordMovement({
        itemId: selectedItemId,
        itemCode: selectedStock?.itemCode || "ITM-HYD-1025",
        itemName: selectedStock?.itemName || "Hydraulic Return Filter Element PC1250",
        warehouseId,
        warehouseName: wh?.warehouseName || "Workshop Spare Parts Depot",
        locationCode: selectedStock?.locationCode || "WH2-ZB-R04-S01-B05",
        quantity: Number(receivedQty),
        unit: selectedStock?.unit || "PCS",
        movementType: "GOODS_RECEIPT",
        referenceType: "PO",
        referenceId: poNumber,
        userId: "USR-WH-02",
        userName: "Budi Santoso (Warehouse Supervisor)",
        reason: `Goods Receipt Penerimaan PO ${poNumber} - Surjat SJ: ${deliveryNote}`,
        unitCostIDR: selectedStock?.unitCostIDR || 4250000,
      });

      const newGR = {
        id: `gr-${Date.now()}`,
        grNumber: `GR-${new Date().toISOString().substring(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
        poNumber,
        vendor: vendorName,
        deliveryNote,
        item: selectedStock?.itemName || "Hydraulic Return Filter Element PC1250",
        orderedQty: Number(receivedQty),
        receivedQty: Number(receivedQty),
        warehouse: wh?.warehouseName || "Gudang Utama",
        status: "FULLY_RECEIVED",
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
      };

      setRecentGRs([newGR, ...recentGRs]);
      setDeliveryNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Receiving Form & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              Penerimaan Barang Procurement (Goods Receipt / GR)
            </h3>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              PO Integration Active
            </span>
          </div>

          <form onSubmit={handleConfirmReceiving} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Nomor Purchase Order (PO) *</label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Vendor / Rekanan *</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Nomor Surat Jalan / Delivery Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DO-HEX-88912"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gudang Tujuan Penerimaan *</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  {warehouses.map((w) => (
                    <option key={w.warehouseId} value={w.warehouseId}>
                      {w.warehouseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-200">Rincian Item Diterima Fisik:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Pilih Item Sparepart / Material</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {stocks.map((s) => (
                      <option key={s.itemId} value={s.itemId}>
                        {s.itemName} ({s.itemCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Qty Diterima Fisik</label>
                  <input
                    type="number"
                    min="1"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-black text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" /> Confirmed Goods Receipt & Tambah Stok Masuk
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Aturan Validasi Penerimaan Gudang
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>Stok bertambah otomatis hanya pada transaksi <strong>Goods Receipt yang terverifikasi</strong>.</li>
            <li>Mendukung <strong>Partial Receiving</strong> apabila pengiriman dari vendor terbagi dalam beberapa tahap.</li>
            <li>Hasil inspeksi K3 dan kualitas dicatat bersamaan untuk kesesuaian 3-Way Match ke Finance.</li>
          </ul>
        </div>
      </div>

      {/* Recent Goods Receipts Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 font-bold text-white text-sm">
          Riwayat Dokumen Penerimaan Barang (Goods Receipt Log)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No GR & Tanggal</th>
                <th className="py-3 px-4">PO & Vendor</th>
                <th className="py-3 px-4">Surat Jalan</th>
                <th className="py-3 px-4">Item Sparepart</th>
                <th className="py-3 px-4 text-center">Qty Diterima</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentGRs.map((gr) => (
                <tr key={gr.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-amber-400 font-mono">{gr.grNumber}</div>
                    <div className="text-[10px] text-slate-400">{gr.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200 font-mono">{gr.poNumber}</div>
                    <div className="text-[11px] text-slate-400">{gr.vendor}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{gr.deliveryNote}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">{gr.item}</td>
                  <td className="py-3 px-4 text-center font-black text-emerald-400">{gr.receivedQty} PCS</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {gr.status}
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
