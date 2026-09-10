// MINE SMART AI - Stock Opname Tab
import React, { useState } from "react";
import { CheckSquare, AlertTriangle, ShieldCheck, Plus, Clock, FileSpreadsheet, X } from "lucide-react";
import { StockBalance, StockOpnameSession, Warehouse } from "../../../types/warehouseTypes";

interface StockOpnameTabProps {
  opnameSessions: StockOpnameSession[];
  stocks: StockBalance[];
  warehouses: Warehouse[];
  onSaveOpnameSession: (session: StockOpnameSession) => void;
  onRecordMovement: (mvt: any) => Promise<any>;
}

export const StockOpnameTab: React.FC<StockOpnameTabProps> = ({
  opnameSessions,
  stocks,
  warehouses,
  onSaveOpnameSession,
  onRecordMovement,
}) => {
  const [selectedSession, setSelectedSession] = useState<StockOpnameSession | null>(opnameSessions[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Physical count state simulator
  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({
    "stk-001": 11, // system 12 -> variance -1
    "stk-002": 14, // system 14 -> match
    "stk-003": 48,
  });

  const [newOpname, setNewOpname] = useState<Partial<StockOpnameSession>>({
    warehouseId: warehouses[0]?.warehouseId || "wh-002",
    countType: "CRITICAL_SPARE",
    notes: "Stock Opname rutin suku cadang kritis workshop",
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.warehouseId === newOpname.warehouseId);

    const created: StockOpnameSession = {
      id: `opn-${Date.now()}`,
      opnameId: `opn-${Date.now()}`,
      opnameNumber: `SO-${new Date().toISOString().substring(0, 7)}-SITEA`,
      warehouseId: newOpname.warehouseId || "wh-002",
      warehouseName: wh?.warehouseName || "Workshop Warehouse",
      siteId: "site-001",
      countDate: new Date().toISOString().substring(0, 10),
      countType: newOpname.countType || "CRITICAL_SPARE",
      createdBy: "Hendra Gunawan (Warehouse Supervisor)",
      assignedTeam: ["Budi Santoso", "Agus Rahmat"],
      status: "IN_PROGRESS",
      totalItemsCounted: stocks.length,
      itemsWithVarianceCount: 1,
      totalSystemValueIDR: stocks.reduce((sum, s) => sum + s.stockValueIDR, 0),
      totalPhysicalValueIDR: stocks.reduce((sum, s) => sum + s.stockValueIDR, 0),
      totalVarianceValueIDR: -4250000,
      notes: newOpname.notes,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    onSaveOpnameSession(created);
    setSelectedSession(created);
    setIsModalOpen(false);
  };

  const handleApproveOpnameAdjustment = async (session: StockOpnameSession) => {
    // Record adjustment ledger for variances
    for (const stk of stocks) {
      const physical = physicalCounts[stk.stockId] ?? stk.onHand;
      const variance = physical - stk.onHand;
      if (variance !== 0) {
        await onRecordMovement({
          itemId: stk.itemId,
          itemCode: stk.itemCode,
          itemName: stk.itemName,
          warehouseId: stk.warehouseId,
          warehouseName: stk.warehouseName,
          locationCode: stk.locationCode,
          quantity: variance,
          unit: stk.unit,
          movementType: variance > 0 ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
          referenceType: "OPNAME",
          referenceId: session.opnameNumber,
          userId: "USR-MGR-01",
          userName: "Kurniawan (Finance Mgr)",
          reason: `Stock Opname Variance Adjustment Session ${session.opnameNumber}`,
          unitCostIDR: stk.unitCostIDR,
        });
      }
    }

    session.status = "APPROVED";
    session.approvedBy = "Kurniawan (Finance Mgr)";
    session.approvedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
    onSaveOpnameSession(session);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Action */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Stock Opname & Verifikasi Fisik Persediaan (Physical Count Session)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Proses perhitungan fisik berkala, analisis variansi (system vs physical), dan otorisasi adjustment persediaan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Buka Sesi Stock Opname Baru
        </button>
      </div>

      {/* Opname Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opnameSessions.map((sess) => {
          const isSelected = selectedSession?.opnameId === sess.opnameId;
          return (
            <div
              key={sess.opnameId}
              onClick={() => setSelectedSession(sess)}
              className={`p-4 rounded-2xl border cursor-pointer transition shadow-md space-y-2 ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 shadow-amber-500/10"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-amber-400 text-xs">{sess.opnameNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    sess.status === "APPROVED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {sess.status}
                </span>
              </div>

              <div className="font-bold text-slate-200 text-xs">{sess.warehouseName}</div>
              <div className="text-[11px] text-slate-400">
                Tipe: <span className="text-slate-200 font-semibold">{sess.countType}</span> | Tanggal: {sess.countDate}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Total Item: {sess.totalItemsCounted}</span>
                <span className="font-bold text-rose-400">Selisih: {sess.itemsWithVarianceCount} SKU</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Counting Detail */}
      {selectedSession && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Detail Sesi Opname Aktif
              </span>
              <h3 className="text-lg font-extrabold text-white">{selectedSession.opnameNumber}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSession.notes}</p>
            </div>

            {selectedSession.status !== "APPROVED" ? (
              <button
                onClick={() => handleApproveOpnameAdjustment(selectedSession)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Setujui Variansi & Adjust Stok Ledger
              </button>
            ) : (
              <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Disetujui oleh {selectedSession.approvedBy}
              </div>
            )}
          </div>

          {/* Physical vs System Counting Sheet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Nama Suku Cadang</th>
                  <th className="py-3 px-4">Lokasi Bin</th>
                  <th className="py-3 px-4 text-center">Stok Sistem</th>
                  <th className="py-3 px-4 text-center">Hasil Hitung Fisik</th>
                  <th className="py-3 px-4 text-center">Variansi (Selisih)</th>
                  <th className="py-3 px-4 text-right">Nilai Variansi IDR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stocks.map((stk) => {
                  const physical = physicalCounts[stk.stockId] ?? stk.onHand;
                  const variance = physical - stk.onHand;
                  const varianceValue = variance * stk.unitCostIDR;

                  return (
                    <tr key={stk.stockId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{stk.itemName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{stk.itemCode}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-amber-400">{stk.locationCode}</td>

                      <td className="py-3 px-4 text-center font-bold text-slate-300">
                        {stk.onHand} {stk.unit}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          value={physical}
                          onChange={(e) =>
                            setPhysicalCounts({
                              ...physicalCounts,
                              [stk.stockId]: Number(e.target.value),
                            })
                          }
                          disabled={selectedSession.status === "APPROVED"}
                          className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-white focus:border-amber-500"
                        />
                      </td>

                      <td className="py-3 px-4 text-center font-black">
                        <span
                          className={
                            variance === 0
                              ? "text-slate-400"
                              : variance > 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }
                        >
                          {variance > 0 ? `+${variance}` : variance} {stk.unit}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-200">
                        {formatIDR(varianceValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Session Modal */}
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
              <Plus className="w-5 h-5 text-amber-400" /> Buka Sesi Stock Opname Baru
            </h2>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Gudang Target Opname</label>
                <select
                  value={newOpname.warehouseId}
                  onChange={(e) => setNewOpname({ ...newOpname, warehouseId: e.target.value })}
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
                <label className="block text-slate-400 mb-1">Tipe Sesi Stock Opname</label>
                <select
                  value={newOpname.countType}
                  onChange={(e) => setNewOpname({ ...newOpname, countType: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="CRITICAL_SPARE">Suku Cadang Kritis (Critical Spare Parts)</option>
                  <option value="FULL">Stock Opname Total (Full Warehouse)</option>
                  <option value="CYCLE_COUNT">Cycle Count Harian / Mingguan</option>
                  <option value="CATEGORY">Kategori Spesifik (Lubricants / Tyres)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan / Lingkup Sesi</label>
                <input
                  type="text"
                  value={newOpname.notes}
                  onChange={(e) => setNewOpname({ ...newOpname, notes: e.target.value })}
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Mulai Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
