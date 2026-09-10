// MINE SMART AI - Warehouse Reports Tab
import React, { useState } from "react";
import { FileText, Download, Printer, Search, Calendar, Filter, Layers } from "lucide-react";
import { StockBalance, StockMovement } from "../../../types/warehouseTypes";

interface WarehouseReportsTabProps {
  movements: StockMovement[];
  stocks: StockBalance[];
}

export const WarehouseReportsTab: React.FC<WarehouseReportsTabProps> = ({ movements, stocks }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>("CARD");
  const [selectedItemId, setSelectedItemId] = useState<string>("itm-001");

  const activeStock = stocks.find((s) => s.itemId === selectedItemId) || stocks[0];
  const itemMovements = movements.filter((m) => m.itemId === selectedItemId);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleExportCSV = () => {
    const headers = "Date,MovementNumber,Type,Reference,Qty,UnitCost,BalanceAfter,User\n";
    const rows = itemMovements
      .map(
        (m) =>
          `"${m.timestamp}","${m.movementNumber}","${m.movementType}","${m.referenceId}",${m.quantity},${m.unitCostIDR},${m.balanceAfter},"${m.userName}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Stock_Card_${activeStock?.itemCode || "Item"}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
          >
            <option value="CARD">Kartu Stok (Stock Card Ledger per Item)</option>
            <option value="MOVEMENT">Jurnal Mutasi Stok Gudang (Movement Ledger)</option>
            <option value="VALUATION">Laporan Valuasi Persediaan (Valuation Report)</option>
          </select>

          {selectedReportType === "CARD" && (
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
            >
              {stocks.map((s) => (
                <option key={s.itemId} value={s.itemId}>
                  {s.itemName} ({s.itemCode})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Cetak PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Stock Card View */}
      {selectedReportType === "CARD" && activeStock && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Laporan Kartu Stok (Stock Card)
              </span>
              <h3 className="text-lg font-extrabold text-white">{activeStock.itemName}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Kode: {activeStock.itemCode} | Part Number: {activeStock.partNumber} | Gudang: {activeStock.warehouseName}
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Saldo Fisik Saat Ini</span>
              <span className="text-xl font-black text-amber-400">
                {activeStock.onHand} {activeStock.unit}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Tanggal & Waktu</th>
                  <th className="py-3 px-4">Nomor Mutasi</th>
                  <th className="py-3 px-4">Tipe Transaksi</th>
                  <th className="py-3 px-4">Referensi / Keterangan</th>
                  <th className="py-3 px-4 text-center">Masuk (+)</th>
                  <th className="py-3 px-4 text-center">Keluar (-)</th>
                  <th className="py-3 px-4 text-center">Saldo Akhir</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {itemMovements.map((mvt) => (
                  <tr key={mvt.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-300">{mvt.timestamp}</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">{mvt.movementNumber}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mvt.quantity > 0
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {mvt.movementType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{mvt.reason}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Ref: {mvt.referenceId} ({mvt.userName})</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">
                      {mvt.quantity > 0 ? `+${mvt.quantity}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-rose-400">
                      {mvt.quantity < 0 ? mvt.quantity : "-"}
                    </td>
                    <td className="py-3 px-4 text-center font-black text-amber-400">{mvt.balanceAfter}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">{formatIDR(mvt.unitCostIDR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
