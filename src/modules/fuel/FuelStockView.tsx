// MINE SMART AI - Fuel Stock & Stock Ledger View

import React, { useState } from "react";
import {
  Fuel,
  Search,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  History
} from "lucide-react";
import {
  FuelTank,
  FuelStation,
  FuelStockLedger,
  FuelTransfer,
  FuelAdjustment,
  FuelLocationType
} from "../../types/fuelTypes";

interface FuelStockViewProps {
  tanks: FuelTank[];
  stations: FuelStation[];
  adjustments: FuelAdjustment[];
  transfers: FuelTransfer[];
  onAddTransfer: (transfer: FuelTransfer) => void;
  onAddAdjustment: (adj: FuelAdjustment) => void;
}

export const FuelStockView: React.FC<FuelStockViewProps> = ({
  tanks,
  stations,
  adjustments,
  transfers,
  onAddTransfer,
  onAddAdjustment
}) => {
  const [activeTab, setActiveTab] = useState<"tanks" | "ledger" | "transfers" | "adjustments">("tanks");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    sourceLocation: "Main Storage Tank 01 (Bulk Storage)",
    destinationLocation: "Mobile Fuel Truck #01",
    quantity: 5000,
    vehicleNumber: "MFT-01",
    driverName: "Suharto",
    authorizedBy: "Hendra Kurniawan"
  });

  // Adjustment Form State
  const [adjustmentForm, setAdjustmentForm] = useState({
    locationId: tanks[0]?.id || "tank-01",
    locationName: tanks[0]?.name || "Main Storage Tank 01",
    quantity: -50,
    reason: "Meter Correction" as FuelAdjustment["reason"],
    beforeValue: 64250,
    afterValue: 64200,
    approvedBy: "Bambang M. (Fuel Manager)"
  });

  // Stock Ledgers mock generated from tanks & transactions
  const stockLedgers: FuelStockLedger[] = [
    {
      id: "led-01",
      fuelProductId: "fp-01",
      locationId: "tank-01",
      locationName: "Main Storage Tank 01",
      quantity: 32000,
      unit: "Liter",
      timestamp: "2026-08-12T08:30:00Z",
      referenceType: "Receiving",
      referenceId: "rcv-101",
      userId: "usr-101",
      userName: "Hendra Kurniawan",
      status: "Confirmed",
      createdAt: "2026-08-12T08:30:00Z",
      updatedAt: "2026-08-12T08:30:00Z"
    },
    {
      id: "led-02",
      fuelProductId: "fp-01",
      locationId: "tank-01",
      locationName: "Main Storage Tank 01",
      quantity: -8000,
      unit: "Liter",
      timestamp: "2026-08-13T05:30:00Z",
      referenceType: "Transfer Out",
      referenceId: "trf-01",
      userId: "usr-101",
      userName: "Hendra Kurniawan",
      status: "Confirmed",
      createdAt: "2026-08-13T05:30:00Z",
      updatedAt: "2026-08-13T05:30:00Z"
    },
    {
      id: "led-03",
      fuelProductId: "fp-01",
      locationId: "tank-02",
      locationName: "Pit A Fuel Station Tank",
      quantity: -120,
      unit: "Liter",
      timestamp: "2026-08-12T18:00:00Z",
      referenceType: "Adjustment",
      referenceId: "adj-01",
      userId: "usr-99",
      userName: "Bambang M.",
      status: "Approved & Audited",
      createdAt: "2026-08-12T18:00:00Z",
      updatedAt: "2026-08-12T18:00:00Z"
    }
  ];

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrf: FuelTransfer = {
      id: `trf-${Date.now()}`,
      sourceLocation: transferForm.sourceLocation,
      destinationLocation: transferForm.destinationLocation,
      quantity: transferForm.quantity,
      unit: "Liter",
      date: new Date().toISOString().split("T")[0],
      vehicleNumber: transferForm.vehicleNumber,
      driverName: transferForm.driverName,
      authorizedBy: transferForm.authorizedBy,
      status: "Completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddTransfer(newTrf);
    setIsTransferModalOpen(false);
  };

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTank = tanks.find(t => t.id === adjustmentForm.locationId);
    const newAdj: FuelAdjustment = {
      id: `adj-${Date.now()}`,
      adjustmentId: `ADJ-${Date.now().toString().slice(-6)}`,
      locationId: adjustmentForm.locationId,
      locationName: selectedTank?.name || adjustmentForm.locationName,
      quantity: Number(adjustmentForm.quantity),
      reason: adjustmentForm.reason,
      beforeValue: selectedTank ? selectedTank.currentStock : 60000,
      afterValue: selectedTank ? selectedTank.currentStock + Number(adjustmentForm.quantity) : 59950,
      approvedBy: adjustmentForm.approvedBy,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddAdjustment(newAdj);
    setIsAdjustmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tanks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tanks"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel Tanks & Storage
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ledger"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Stock Ledger
          </button>
          <button
            onClick={() => setActiveTab("transfers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "transfers"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel Transfers ({transfers.length})
          </button>
          <button
            onClick={() => setActiveTab("adjustments")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "adjustments"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Stock Adjustments ({adjustments.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            Transfer Solar
          </button>
          <button
            onClick={() => setIsAdjustmentModalOpen(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Stock Adjustment
          </button>
        </div>
      </div>

      {/* TAB 1: FUEL TANKS */}
      {activeTab === "tanks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tanks.map(t => {
            const fillPercent = (t.currentStock / t.capacity) * 100;
            return (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {t.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mt-3">{t.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t.locationType}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400">Current Stock</div>
                    <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                      {t.currentStock.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-400">/ {t.capacity.toLocaleString()} L</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>Kapasitas Tangki</span>
                      <span>{fillPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          fillPercent < 20 ? "bg-rose-500" : fillPercent < 45 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, fillPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Min Limit: {t.minThreshold.toLocaleString()} L</span>
                  <span>Max Limit: {t.maxThreshold.toLocaleString()} L</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STOCK LEDGER */}
      {activeTab === "ledger" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              Fuel Stock Ledger (Mutasi Stok Real-time)
            </h3>
            <span className="text-xs text-slate-400">Audit Trail Terverifikasi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Transaction Type</th>
                  <th className="px-4 py-3 text-right">Quantity (Liter)</th>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stockLedgers.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{l.locationName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        l.quantity > 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}>
                        {l.referenceType}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${l.quantity > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {l.quantity > 0 ? `+${l.quantity.toLocaleString()}` : l.quantity.toLocaleString()} L
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-400">{l.referenceId}</td>
                    <td className="px-4 py-3">{l.userName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSFERS */}
      {activeTab === "transfers" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100">Riwayat Transfer BBM Antar Lokasi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Sumber (Source)</th>
                  <th className="px-4 py-3">Tujuan (Destination)</th>
                  <th className="px-4 py-3 text-right">Volume (L)</th>
                  <th className="px-4 py-3">Kendaraan / Driver</th>
                  <th className="px-4 py-3">Authorized By</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transfers.map(trf => (
                  <tr key={trf.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-400 font-mono">{trf.date}</td>
                    <td className="px-4 py-3 text-slate-200 font-medium">{trf.sourceLocation}</td>
                    <td className="px-4 py-3 text-slate-200 font-medium">{trf.destinationLocation}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">{trf.quantity.toLocaleString()} L</td>
                    <td className="px-4 py-3">{trf.vehicleNumber} ({trf.driverName})</td>
                    <td className="px-4 py-3">{trf.authorizedBy}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {trf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADJUSTMENTS */}
      {activeTab === "adjustments" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100">Audit Trail Stock Adjustment</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID Adjust</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Lokasi Tangki</th>
                  <th className="px-4 py-3">Alasan (Reason)</th>
                  <th className="px-4 py-3 text-right">Adjustment (L)</th>
                  <th className="px-4 py-3 text-right">Stok Sebelum / Sesudah</th>
                  <th className="px-4 py-3">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {adjustments.map(adj => (
                  <tr key={adj.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-amber-400">{adj.adjustmentId}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{new Date(adj.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{adj.locationName}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-medium">{adj.reason}</span></td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${adj.quantity >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {adj.quantity >= 0 ? `+${adj.quantity}` : adj.quantity} L
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">
                      {adj.beforeValue.toLocaleString()} → <span className="text-slate-100 font-bold">{adj.afterValue.toLocaleString()} L</span>
                    </td>
                    <td className="px-4 py-3">{adj.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Transfer Solar */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              Form Transfer Solar Antar Tangki
            </h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Lokasi Asal (Source)</label>
                <select
                  value={transferForm.sourceLocation}
                  onChange={e => setTransferForm({ ...transferForm, sourceLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {tanks.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.currentStock.toLocaleString()} L)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Tujuan (Destination)</label>
                <select
                  value={transferForm.destinationLocation}
                  onChange={e => setTransferForm({ ...transferForm, destinationLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {tanks.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jumlah Transfer (Liter)</label>
                <input
                  type="number"
                  value={transferForm.quantity}
                  onChange={e => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kendaraan Transport</label>
                  <input
                    type="text"
                    value={transferForm.vehicleNumber}
                    onChange={e => setTransferForm({ ...transferForm, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Driver</label>
                  <input
                    type="text"
                    value={transferForm.driverName}
                    onChange={e => setTransferForm({ ...transferForm, driverName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Authorized By</label>
                <input
                  type="text"
                  value={transferForm.authorizedBy}
                  onChange={e => setTransferForm({ ...transferForm, authorizedBy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Eksekusi Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Stock Adjustment */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-400" />
              Stock Adjustment Authorization
            </h3>
            <p className="text-xs text-slate-400">
              Setiap adjustment stok wajib memiliki otoritas supervisor dan akan dicatat secara transparan di Audit Log.
            </p>
            <form onSubmit={handleCreateAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tangki Lokasi</label>
                <select
                  value={adjustmentForm.locationId}
                  onChange={e => setAdjustmentForm({ ...adjustmentForm, locationId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {tanks.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (Current: {t.currentStock.toLocaleString()} L)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Alasan Adjustment (Reason)</label>
                <select
                  value={adjustmentForm.reason}
                  onChange={e => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value as FuelAdjustment["reason"] })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Meter Correction">Meter Correction</option>
                  <option value="Stock Count Correction">Stock Count Correction</option>
                  <option value="Calibration">Calibration</option>
                  <option value="Data Correction">Data Correction</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nilai Adjustment (+ / - Liter)</label>
                <input
                  type="number"
                  value={adjustmentForm.quantity}
                  onChange={e => setAdjustmentForm({ ...adjustmentForm, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  placeholder="Contoh: -120 atau +300"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Approved By (Supervisor Role Required)</label>
                <input
                  type="text"
                  value={adjustmentForm.approvedBy}
                  onChange={e => setAdjustmentForm({ ...adjustmentForm, approvedBy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Simpan Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
