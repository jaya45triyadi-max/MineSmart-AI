// MINE SMART AI - Stock Balances Tab
import React, { useState } from "react";
import { StockBalance, Warehouse } from "../../../types/warehouseTypes";
import { Search, Filter, ShieldCheck, AlertTriangle, Layers, DollarSign, Calendar, Tag } from "lucide-react";

interface StockBalancesTabProps {
  stocks: StockBalance[];
  warehouses: Warehouse[];
}

export const StockBalancesTab: React.FC<StockBalancesTabProps> = ({ stocks, warehouses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filtered = stocks.filter((s) => {
    const matchesSearch =
      s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.batchNumber && s.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesWh = selectedWarehouseId === "ALL" || s.warehouseId === selectedWarehouseId;
    const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;

    return matchesSearch && matchesWh && matchesStatus;
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari item, part number, batch, serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Gudang</option>
            {warehouses.map((w) => (
              <option key={w.warehouseId} value={w.warehouseId}>
                {w.warehouseName}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status Stok</option>
            <option value="IN_STOCK">In Stock (Aman)</option>
            <option value="LOW_STOCK">Low Stock (Rendah)</option>
            <option value="OUT_OF_STOCK">Out of Stock (Kosong)</option>
            <option value="QUARANTINE">Quarantine (Karantina)</option>
            <option value="DAMAGED">Damaged (Rusak)</option>
          </select>
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Suku Cadang & Kode</th>
                <th className="py-3 px-4">Gudang & Lokasi Bin</th>
                <th className="py-3 px-4 text-center">Fisik (On-Hand)</th>
                <th className="py-3 px-4 text-center">Tersedia (Available)</th>
                <th className="py-3 px-4 text-center">Reserved / In-Transit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Nilai Stok (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((stk) => {
                const available = Math.max(0, stk.onHand - stk.reserved);
                return (
                  <tr key={stk.stockId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{stk.itemName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {stk.itemCode} | Part: {stk.partNumber}
                      </div>
                      {stk.batchNumber && (
                        <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                          Batch: {stk.batchNumber}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{stk.warehouseName}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{stk.locationCode}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-100 text-sm">
                      {stk.onHand} {stk.unit}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-emerald-400 text-sm">
                        {available} {stk.unit}
                      </span>
                      <div className="text-[10px] text-slate-500">Formula: Fisik - Reserved</div>
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-300">
                      <div>Res: <strong className="text-amber-300">{stk.reserved}</strong></div>
                      <div className="text-[10px] text-purple-300">Transit: {stk.inTransit}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          stk.status === "OUT_OF_STOCK"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : stk.status === "LOW_STOCK"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {stk.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-emerald-400">
                      {formatIDR(stk.stockValueIDR)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
