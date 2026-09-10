import React, { useState } from "react";
import {
  Scale,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  QrCode,
  FileText,
  Truck,
  ArrowDownRight,
  ArrowUpRight,
  X,
  Sparkles,
  Download,
} from "lucide-react";
import {
  Weighbridge,
  WeighbridgeVehicle,
  WeighInTransaction,
  WeighbridgeTicket,
  WeightSource,
} from "../../../types/weighbridgeTypes";

interface WeighbridgeTransactionsTabProps {
  weighbridges: Weighbridge[];
  vehicles: WeighbridgeVehicle[];
  weighInTransactions: WeighInTransaction[];
  tickets: WeighbridgeTicket[];
  onAddWeighIn: (newTransaction: WeighInTransaction) => void;
  onCompleteWeighOut: (ticket: WeighbridgeTicket) => void;
  onOpenScanQR: () => void;
}

export const WeighbridgeTransactionsTab: React.FC<WeighbridgeTransactionsTabProps> = ({
  weighbridges,
  vehicles,
  weighInTransactions,
  tickets,
  onAddWeighIn,
  onCompleteWeighOut,
  onOpenScanQR,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isNewWeighInModalOpen, setIsNewWeighInModalOpen] = useState(false);
  const [isWeighOutModalOpen, setIsWeighOutModalOpen] = useState(false);
  const [selectedWeighIn, setSelectedWeighIn] = useState<WeighInTransaction | null>(null);

  // New Weigh-In Form State
  const [formWeighbridgeId, setFormWeighbridgeId] = useState(weighbridges[0]?.weighbridgeId || "WB-001");
  const [formVehicleId, setFormVehicleId] = useState(vehicles[0]?.vehicleId || "VEH-201");
  const [formMaterial, setFormMaterial] = useState("ROM Coal");
  const [formSource, setFormSource] = useState("Pit Alpha Seam 3");
  const [formDestination, setFormDestination] = useState("ROM Stockpile 1");
  const [formGrossWeight, setFormGrossWeight] = useState(49800);
  const [formGrossSource, setFormGrossSource] = useState<WeightSource>("DIGITAL_SCALE");

  // Weigh-Out Form State
  const [weighOutTareWeight, setWeighOutTareWeight] = useState(14500);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = selectedMaterial === "ALL" || ticket.materialType === selectedMaterial;
    const matchesStatus = selectedStatus === "ALL" || ticket.status === selectedStatus;
    return matchesSearch && matchesMaterial && matchesStatus;
  });

  const handleCreateWeighIn = (e: React.FormEvent) => {
    e.preventDefault();
    const wb = weighbridges.find((w) => w.weighbridgeId === formWeighbridgeId);
    const veh = vehicles.find((v) => v.vehicleId === formVehicleId);
    if (!wb || !veh) return;

    const newId = `WI-20260813-${Math.floor(100 + Math.random() * 900)}`;
    const trxNum = `TRX-WI-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTrx: WeighInTransaction = {
      id: newId,
      weighInId: newId,
      weighbridgeId: wb.weighbridgeId,
      weighbridgeName: wb.name,
      vehicleId: veh.vehicleId,
      unitNumber: veh.unitNumber,
      operatorId: veh.operatorId,
      operatorName: veh.operatorName,
      transactionNumber: trxNum,
      timestamp: new Date().toISOString(),
      scaleWeight: formGrossWeight,
      direction: "WEIGH_IN",
      materialType: formMaterial,
      sourceType: "PIT",
      sourceId: "PIT-01",
      sourceName: formSource,
      destinationType: "STOCKPILE",
      destinationId: "STK-01",
      destinationName: formDestination,
      grossWeight: formGrossWeight,
      grossUnit: "kg",
      grossTimestamp: new Date().toISOString(),
      grossSource: formGrossSource,
      status: "WEIGHED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddWeighIn(newTrx);
    setIsNewWeighInModalOpen(false);
  };

  const handleExecuteWeighOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWeighIn) return;

    const veh = vehicles.find((v) => v.vehicleId === selectedWeighIn.vehicleId);
    const grossKg = selectedWeighIn.grossWeight;
    const tareKg = Number(weighOutTareWeight);
    const netKg = grossKg - tareKg;
    const netTon = Number((netKg / 1000).toFixed(2));
    const isOver = veh ? netTon > veh.capacity : false;

    const ticketNum = `WB-20260813-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: WeighbridgeTicket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      ticketId: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      ticketNumber: ticketNum,
      weighInId: selectedWeighIn.weighInId,
      weighOutId: `WO-20260813-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: selectedWeighIn.vehicleId,
      unitNumber: selectedWeighIn.unitNumber,
      registrationNumber: veh?.registrationNumber || "B 9812 XKA",
      vehicleType: veh?.vehicleType || "DUMP_TRUCK",
      weighbridgeId: selectedWeighIn.weighbridgeId,
      weighbridgeName: selectedWeighIn.weighbridgeName,
      materialType: selectedWeighIn.materialType,
      source: selectedWeighIn.sourceName,
      destination: selectedWeighIn.destinationName,
      grossWeight: grossKg,
      tareWeight: tareKg,
      netWeight: netKg,
      unit: "kg",
      originalValue: netKg,
      originalUnit: "kg",
      normalizedValue: netTon,
      normalizedUnit: "ton",
      operatorId: selectedWeighIn.operatorId,
      operatorName: selectedWeighIn.operatorName,
      weighInTime: selectedWeighIn.timestamp,
      weighOutTime: new Date().toISOString(),
      shift: "Shift 1",
      status: "COMPLETED",
      qrCode: `WB-TICKET-${ticketNum}-VERIFIED`,
      barcode: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      isOverload: isOver,
      overloadSeverity: isOver ? "WARNING" : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCompleteWeighOut(newTicket);
    setIsWeighOutModalOpen(false);
    setSelectedWeighIn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" />
            Live Weighbridge Transactions & Tickets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar pencatatan penimbangan masuk (Weigh-In), penimbangan keluar (Weigh-Out), dan penetapan Net Weight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsNewWeighInModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Proses Weigh-In Baru
          </button>
          <button
            onClick={onOpenScanQR}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-sky-500" />
            Scan QR
          </button>
        </div>
      </div>

      {/* Active Weigh-In Queue Section */}
      {weighInTransactions.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Antrean Transaksi Weigh-In Aktif (Menunggu Weigh-Out)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
              {weighInTransactions.length} Truk On-Site / Loading
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weighInTransactions.map((trx) => (
              <div
                key={trx.weighInId}
                className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-amber-200 dark:border-amber-900/40 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{trx.unitNumber}</span>
                    <span className="text-[11px] font-mono text-slate-500">{new Date(trx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div>Material: <span className="font-semibold">{trx.materialType}</span></div>
                    <div>Source: {trx.sourceName}</div>
                    <div>Destination: {trx.destinationName}</div>
                    <div className="pt-1 text-emerald-600 dark:text-emerald-400 font-bold">Gross Captured: {trx.grossWeight.toLocaleString()} kg</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedWeighIn(trx);
                    setIsWeighOutModalOpen(true);
                  }}
                  className="mt-3 w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Proses Weigh-Out Truk Ini
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Tiket, Truk, Material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Material:</span>
          </div>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">Semua Material</option>
            <option value="ROM Coal">ROM Coal</option>
            <option value="Product Coal GAR 5000">Product Coal GAR 5000</option>
            <option value="Thermal Coal">Thermal Coal</option>
            <option value="Overburden (OB)">Overburden (OB)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="VALIDATED">VALIDATED</option>
            <option value="OPEN">OPEN</option>
            <option value="VOID">VOID</option>
          </select>
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nomor Tiket</th>
                <th className="py-3.5 px-4">Truk & Reg</th>
                <th className="py-3.5 px-4">Waktu In / Out</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Source / Dest</th>
                <th className="py-3.5 px-4">Gross Weight</th>
                <th className="py-3.5 px-4">Tare Weight</th>
                <th className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">NET (Ton)</th>
                <th className="py-3.5 px-4">Status & Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map((t) => (
                <tr key={t.ticketId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t.ticketNumber}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{t.unitNumber}</div>
                    <div className="text-[11px] text-slate-400">{t.registrationNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[11px]">In: {new Date(t.weighInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    {t.weighOutTime && <div className="text-[11px] text-slate-400">Out: {new Date(t.weighOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{t.materialType}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300">{t.source}</div>
                    <div className="text-[10px] text-slate-400">→ {t.destination}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{t.grossWeight.toLocaleString()} kg</td>
                  <td className="py-3.5 px-4 font-mono">{t.tareWeight.toLocaleString()} kg</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {t.normalizedValue} Ton
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold w-fit ${
                          t.status === "COMPLETED" || t.status === "VALIDATED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {t.status}
                      </span>
                      {t.isOverload && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                          <AlertTriangle className="w-3 h-3" /> OVERLOAD
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Process New Weigh-In */}
      {isNewWeighInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Catat Transaksi Weigh-In Baru
              </h3>
              <button
                onClick={() => setIsNewWeighInModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWeighIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Pilih Jembatan Timbang</label>
                <select
                  value={formWeighbridgeId}
                  onChange={(e) => setFormWeighbridgeId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {weighbridges.map((w) => (
                    <option key={w.weighbridgeId} value={w.weighbridgeId}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Pilih Unit Kendaraan / Truk</label>
                <select
                  value={formVehicleId}
                  onChange={(e) => setFormVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.vehicleId} value={v.vehicleId}>{v.unitNumber} ({v.registrationNumber}) - {v.operatorName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Jenis Material</label>
                  <select
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="ROM Coal">ROM Coal</option>
                    <option value="Product Coal GAR 5000">Product Coal GAR 5000</option>
                    <option value="Thermal Coal">Thermal Coal</option>
                    <option value="Overburden (OB)">Overburden (OB)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Gross Weight (kg)</label>
                  <input
                    type="number"
                    value={formGrossWeight}
                    onChange={(e) => setFormGrossWeight(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Sumber (Source)</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tujuan (Destination)</label>
                  <input
                    type="text"
                    value={formDestination}
                    onChange={(e) => setFormDestination(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewWeighInModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Simpan Weigh-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Process Weigh-Out */}
      {isWeighOutModalOpen && selectedWeighIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-500" />
                Proses Weigh-Out & Buat Tiket
              </h3>
              <button
                onClick={() => setIsWeighOutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWeighOut} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">{selectedWeighIn.unitNumber} ({selectedWeighIn.materialType})</div>
                <div className="text-slate-500">Gross Captured: <strong className="text-emerald-500 font-mono">{selectedWeighIn.grossWeight.toLocaleString()} kg</strong></div>
                <div className="text-slate-500">Source: {selectedWeighIn.sourceName} → {selectedWeighIn.destinationName}</div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tare Weight / Kosong Truk (kg)</label>
                <input
                  type="number"
                  value={weighOutTareWeight}
                  onChange={(e) => setWeighOutTareWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-sky-600 dark:text-sky-400 text-lg"
                />
              </div>

              {/* Live Net Calculation Preview Box */}
              <div className="p-4 rounded-xl bg-slate-950 text-white space-y-2 border border-slate-800 font-mono">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">Kalkulasi Net Weight Otomatis</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">GROSS:</span>
                  <span className="text-emerald-400 font-bold">{selectedWeighIn.grossWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">TARE:</span>
                  <span className="text-sky-400 font-bold">{weighOutTareWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between text-base pt-2 border-t border-slate-800">
                  <span className="text-emerald-300 font-bold">NET TONNAGE:</span>
                  <span className="text-emerald-400 font-extrabold text-xl">
                    {((selectedWeighIn.grossWeight - weighOutTareWeight) / 1000).toFixed(2)} TON
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWeighOutModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Selesaikan Weigh-Out & Terbitkan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
