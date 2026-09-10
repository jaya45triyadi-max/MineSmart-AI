// MINE SMART AI - Stock Transfers Tab
import React, { useState } from "react";
import { ArrowRightLeft, CheckCircle2, Truck, Plus, X } from "lucide-react";
import { StockBalance, StockTransfer, Warehouse } from "../../../types/warehouseTypes";

interface StockTransfersTabProps {
  transfers: StockTransfer[];
  warehouses: Warehouse[];
  stocks: StockBalance[];
  onDispatchTransfer: (id: string, approver: string) => void;
  onReceiveTransfer: (id: string, receiver: string) => void;
  onSaveTransfer: (trf: StockTransfer) => void;
}

export const StockTransfersTab: React.FC<StockTransfersTabProps> = ({
  transfers,
  warehouses,
  stocks,
  onDispatchTransfer,
  onReceiveTransfer,
  onSaveTransfer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromWhId, setFromWhId] = useState("wh-001");
  const [toWhId, setToWhId] = useState("wh-002");
  const [selectedItemId, setSelectedItemId] = useState("itm-001");
  const [transferQty, setTransferQty] = useState(10);
  const [notes, setNotes] = useState("Transfer rutin stok buffer filter hidrolik");

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const fromWh = warehouses.find((w) => w.warehouseId === fromWhId);
    const toWh = warehouses.find((w) => w.warehouseId === toWhId);
    const stock = stocks.find((s) => s.itemId === selectedItemId);

    const created: StockTransfer = {
      id: `trf-${Date.now()}`,
      transferId: `trf-${Date.now()}`,
      transferNumber: `TRF-${new Date().toISOString().substring(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      fromWarehouseId: fromWhId,
      fromWarehouseName: fromWh?.warehouseName || "Gudang Asal",
      toWarehouseId: toWhId,
      toWarehouseName: toWh?.warehouseName || "Gudang Tujuan",
      requestedBy: "Hendra Gunawan (Warehouse Supervisor)",
      status: "REQUESTED",
      items: [
        {
          itemId: selectedItemId,
          itemCode: stock?.itemCode || "ITM-001",
          itemName: stock?.itemName || "Sparepart Item",
          requestedQty: Number(transferQty),
          transferredQty: Number(transferQty),
          receivedQty: 0,
          unit: stock?.unit || "PCS",
          unitCostIDR: stock?.unitCostIDR || 1000000,
        },
      ],
      notes,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    onSaveTransfer(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-purple-400" />
            Transfer Stok Antar Gudang Site Tambang (Inter-Warehouse Transfer)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Perpindahan material & suku cadang antar gudang (Gudang Logistik Utama ↔ Workshop ↔ Fuel Farm ↔ Store HSE).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Buat Request Transfer
        </button>
      </div>

      {/* Transfer Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No Transfer & Tanggal</th>
                <th className="py-3 px-4">Gudang Asal → Gudang Tujuan</th>
                <th className="py-3 px-4">Detail Item & Qty</th>
                <th className="py-3 px-4 text-center">Status Tracking</th>
                <th className="py-3 px-4 text-center">Aksi Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transfers.map((trf) => (
                <tr key={trf.transferId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-purple-400 font-mono">{trf.transferNumber}</div>
                    <div className="text-[10px] text-slate-400">{trf.createdAt}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-200">
                    <div>
                      <span className="font-bold text-slate-300">{trf.fromWarehouseName}</span>
                    </div>
                    <div className="text-purple-400 font-bold">↓ Transfer Ke:</div>
                    <div className="font-bold text-slate-200">{trf.toWarehouseName}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {trf.items.map((it, idx) => (
                      <div key={idx}>
                        <div className="font-bold text-slate-200">{it.itemName}</div>
                        <div className="text-[11px] text-amber-400 font-mono">
                          {it.transferredQty} {it.unit}
                        </div>
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        trf.status === "RECEIVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : trf.status === "IN_TRANSIT"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {trf.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {trf.status === "REQUESTED" && (
                      <button
                        onClick={() => onDispatchTransfer(trf.transferId, "Hendra Gunawan")}
                        className="px-3 py-1 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[11px] rounded-lg shadow transition"
                      >
                        Setujui & Dispatch
                      </button>
                    )}

                    {trf.status === "IN_TRANSIT" && (
                      <button
                        onClick={() => onReceiveTransfer(trf.transferId, "Budi Santoso")}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg shadow transition"
                      >
                        Konfirmasi Terima
                      </button>
                    )}

                    {trf.status === "RECEIVED" && (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Transfer Selesai
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" /> Permintaan Transfer Stok Antar Gudang
            </h2>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Gudang Asal (Source)</label>
                  <select
                    value={fromWhId}
                    onChange={(e) => setFromWhId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {warehouses.map((w) => (
                      <option key={w.warehouseId} value={w.warehouseId}>
                        {w.warehouseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Gudang Tujuan (Target)</label>
                  <select
                    value={toWhId}
                    onChange={(e) => setToWhId(e.target.value)}
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

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-slate-200">Item yang Ditransfer:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      {stocks.map((s) => (
                        <option key={s.itemId} value={s.itemId}>
                          {s.itemName} (Avail: {s.available})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={transferQty}
                      onChange={(e) => setTransferQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-purple-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan Alasan Transfer</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl"
                >
                  Kirim Request Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
