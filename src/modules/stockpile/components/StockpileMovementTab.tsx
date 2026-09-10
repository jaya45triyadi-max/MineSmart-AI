import React, { useState } from "react";
import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Truck,
  Calendar,
} from "lucide-react";
import { StockMovement, Stockpile, MovementType } from "../../../types/stockpileTypes";

interface StockpileMovementTabProps {
  movements: StockMovement[];
  stockpiles: Stockpile[];
  onAddMovement: (movement: StockMovement) => void;
}

export const StockpileMovementTab: React.FC<StockpileMovementTabProps> = ({
  movements,
  stockpiles,
  onAddMovement,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    movementType: "TRANSFER" as MovementType,
    sourceStockpileId: stockpiles[0]?.id || "",
    destinationStockpileId: stockpiles[1]?.id || "",
    quantity: 1000,
    unit: "Ton",
    shift: "SHIFT_1_DAY",
    equipmentId: "DT-105",
    truckId: "DT-105",
    operatorId: "OP-104",
    reason: "Transfer rutin stok batubara",
  });

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.movementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.sourceStockpileName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.destinationStockpileName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "ALL" || m.movementType === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = () => {
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const sourceSp = stockpiles.find((s) => s.id === formData.sourceStockpileId);
    const destSp = stockpiles.find((s) => s.id === formData.destinationStockpileId);

    const transferQty = Number(formData.quantity);

    // Atomic validation checks
    if (formData.movementType === "TRANSFER" || formData.movementType === "OUT") {
      if (!sourceSp) {
        setValidationError("Stockpile asal tidak ditemukan.");
        return;
      }
      if (sourceSp.currentQuantity < transferQty) {
        setValidationError(
          `Stok tidak mencukupi di ${sourceSp.stockpileName}! Tersedia ${sourceSp.currentQuantity.toLocaleString()} Ton, permintaan ${transferQty.toLocaleString()} Ton.`
        );
        return;
      }
    }

    if (formData.movementType === "TRANSFER" || formData.movementType === "IN") {
      if (!destSp) {
        setValidationError("Stockpile tujuan tidak ditemukan.");
        return;
      }
      const destAvailableCap = destSp.capacity - destSp.currentQuantity;
      if (destAvailableCap < transferQty) {
        setValidationError(
          `Kapasitas ${destSp.stockpileName} tidak mencukupi! Sisa ruang ${destAvailableCap.toLocaleString()} Ton, pengiriman ${transferQty.toLocaleString()} Ton.`
        );
        return;
      }
    }

    const newMov: StockMovement = {
      id: `MOV-${Date.now()}`,
      movementId: `MOV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      stockpileId: formData.sourceStockpileId || "SP-001",
      movementType: formData.movementType,
      sourceStockpileId: formData.sourceStockpileId,
      sourceStockpileName: sourceSp?.stockpileName || "External Pit",
      destinationStockpileId: formData.destinationStockpileId,
      destinationStockpileName: destSp?.stockpileName || "External Customer",
      materialType: sourceSp?.materialType || "Raw Coal",
      coalType: sourceSp?.coalType || "Raw Coal",
      quantity: transferQty,
      unit: "Ton",
      qualitySnapshot: sourceSp?.quality,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      shift: formData.shift,
      equipmentId: formData.equipmentId,
      truckId: formData.truckId,
      operatorId: formData.operatorId,
      reason: formData.reason,
      status: "COMPLETED",
      createdBy: "Operasional User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddMovement(newMov);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Stock Movement Transactions & Transfer Log
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat pergerakan masuk (IN), keluar (OUT), rehandling, transfer, dan blending batubara dengan validasi stok atomic.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Input Transfer Batubara</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID pergerakan, asal, tujuan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            >
              <option value="ALL">Semua Tipe Pergerakan</option>
              <option value="IN">IN (Masuk Tambang)</option>
              <option value="OUT">OUT (Keluar / Crusher / Jetty)</option>
              <option value="TRANSFER">TRANSFER (Antar Stockpile)</option>
              <option value="REHANDLE_OUT">REHANDLE</option>
              <option value="BLENDING_IN">BLENDING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movements Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3.5 font-bold">ID Transaksi & Waktu</th>
                <th className="p-3.5 font-bold">Tipe Pergerakan</th>
                <th className="p-3.5 font-bold">Stockpile Asal</th>
                <th className="p-3.5 font-bold">Stockpile Tujuan</th>
                <th className="p-3.5 font-bold text-right">Volume (Ton)</th>
                <th className="p-3.5 font-bold">Armada & Alat</th>
                <th className="p-3.5 font-bold">Alasan / Catatan</th>
                <th className="p-3.5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white">{m.movementId}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(m.timestamp).toLocaleString("id-ID")} • {m.shift}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        m.movementType === "IN"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : m.movementType === "OUT"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-purple-500/10 text-purple-600"
                      }`}
                    >
                      {m.movementType}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                    {m.sourceStockpileName || "Pit Face"}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                    {m.destinationStockpileName || "Crusher Hopper"}
                  </td>
                  <td className="p-3.5 text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                    {m.quantity.toLocaleString()} Ton
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      <span>{m.truckId || m.equipmentId || "-"}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px] max-w-xs truncate">
                    {m.reason || "-"}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Stock Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-amber-500" />
                Input Pergerakan / Transfer Batubara
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {validationError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMovement} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Tipe Pergerakan</label>
                <select
                  value={formData.movementType}
                  onChange={(e) => setFormData({ ...formData, movementType: e.target.value as MovementType })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="TRANSFER">TRANSFER (Antar Stockpile)</option>
                  <option value="IN">IN (Masuk Dari Pit)</option>
                  <option value="OUT">OUT (Keluar ke Crusher/Jetty)</option>
                  <option value="REHANDLE_OUT">REHANDLE</option>
                  <option value="BLENDING_IN">BLENDING IN</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Stockpile Asal</label>
                  <select
                    value={formData.sourceStockpileId}
                    onChange={(e) => setFormData({ ...formData, sourceStockpileId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {stockpiles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stockpileName} ({s.currentQuantity.toLocaleString()} Ton)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Stockpile Tujuan</label>
                  <select
                    value={formData.destinationStockpileId}
                    onChange={(e) => setFormData({ ...formData, destinationStockpileId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {stockpiles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stockpileName} (Sisa Ruang: {(s.capacity - s.currentQuantity).toLocaleString()} Ton)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Jumlah Transfer (Ton)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Shift Kerja</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="SHIFT_1_DAY">Shift 1 (Siang)</option>
                    <option value="SHIFT_2_NIGHT">Shift 2 (Malam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Armada Dump Truck / Excavator</label>
                <input
                  type="text"
                  value={formData.truckId}
                  onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                  placeholder="Contoh: DT-105 Fleet"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Alasan / Catatan Transfer</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Eksekusi Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
