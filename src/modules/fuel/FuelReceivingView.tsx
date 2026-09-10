// MINE SMART AI - Fuel Receiving View & Approval Workflow

import React, { useState } from "react";
import {
  Droplets,
  Plus,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  Building2,
  Calendar,
  Search,
  ShieldCheck,
  ArrowRight,
  UserCheck
} from "lucide-react";
import {
  FuelReceiving,
  FuelSupplier,
  FuelProduct,
  FuelTank,
  FuelReceivingStatus
} from "../../types/fuelTypes";

interface FuelReceivingViewProps {
  receivings: FuelReceiving[];
  suppliers: FuelSupplier[];
  products: FuelProduct[];
  tanks: FuelTank[];
  onAddReceiving: (rcv: FuelReceiving) => void;
  onUpdateStatus: (id: string, newStatus: FuelReceivingStatus) => void;
}

export const FuelReceivingView: React.FC<FuelReceivingViewProps> = ({
  receivings,
  suppliers,
  products,
  tanks,
  onAddReceiving,
  onUpdateStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const [form, setForm] = useState({
    supplierId: suppliers[0]?.id || "sup-01",
    deliveryNumber: `DO-PTM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`,
    fuelProductId: products[0]?.id || "fp-01",
    quantity: 32000,
    receivingLocation: tanks[0]?.name || "Main Storage Tank 01",
    vehicleNumber: "B 9102 TFX",
    driverName: "Suharto",
    documentReference: "SJ-PTM-9901",
    meterReading: 1285000,
    density: 0.84,
    waterContent: 0.01,
    temperature: 28.5,
    visualQuality: "Clear yellow, free from sediment",
    hasQualityCheck: true,
    receivedBy: "Hendra Kurniawan"
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selSup = suppliers.find(s => s.id === form.supplierId);
    const selProd = products.find(p => p.id === form.fuelProductId);

    const newRcv: FuelReceiving = {
      id: `rcv-${Date.now()}`,
      supplierId: form.supplierId,
      supplierName: selSup?.name || "PT Pertamina Patra Niaga",
      deliveryNumber: form.deliveryNumber,
      fuelProduct: selProd?.name || "BioSolar B35",
      fuelProductId: form.fuelProductId,
      quantity: Number(form.quantity),
      unit: "Liter",
      deliveryDate: new Date().toISOString().split("T")[0],
      receivingLocation: form.receivingLocation,
      vehicleNumber: form.vehicleNumber,
      driverName: form.driverName,
      documentReference: form.documentReference,
      meterReading: Number(form.meterReading),
      qualityCheck: form.hasQualityCheck ? {
        isAvailable: true,
        density: Number(form.density),
        waterContent: Number(form.waterContent),
        temperature: Number(form.temperature),
        visualQuality: form.visualQuality,
        specification: "ASTM D975 B35 Standard"
      } : { isAvailable: false },
      receivedBy: form.receivedBy,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddReceiving(newRcv);
    setIsModalOpen(false);
  };

  const filtered = receivings.filter(r => {
    const matchesSearch =
      r.deliveryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.documentReference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getWorkflowBadge = (status: FuelReceivingStatus) => {
    switch (status) {
      case "Draft":
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[10px]">1. Draft</span>;
      case "Submitted":
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-[10px]">2. Submitted</span>;
      case "Verified":
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">3. Verified</span>;
      case "Approved":
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[10px]">4. Approved</span>;
      case "Posted":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">5. Posted (Stock Updated)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-400" />
            Fuel Receiving & Quality Check Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan penerimaan pasokan BBM dari vendor supplier dengan alur verifikasi & pengujian kualitas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Input Penerimaan BBM Baru
        </button>
      </div>

      {/* Workflow Stepper Explanation Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="text-xs font-bold text-slate-300 mb-2">Workflow Standard Operating Procedure (SOP) Penerimaan Stock:</div>
        <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700">1. Draft (Input Log)</div>
          <div className="p-2 rounded-xl bg-sky-950/40 text-sky-300 border border-sky-800">2. Submitted (Delivery Check)</div>
          <div className="p-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800">3. Verified (Quality Lab Test)</div>
          <div className="p-2 rounded-xl bg-indigo-950/40 text-indigo-300 border border-indigo-800">4. Approved (Manager Otorisasi)</div>
          <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-800 font-bold">5. Posted (Stock Masuk Ledger)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari DO, Supplier, Surat Jalan..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Status:</span>
          {["ALL", "Submitted", "Verified", "Approved", "Posted"].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Receivings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Delivery / DO Number</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Lokasi Tangki</th>
                <th className="px-4 py-3 text-right">Volume Received</th>
                <th className="px-4 py-3">Quality Test Result</th>
                <th className="px-4 py-3">Workflow Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(rcv => (
                <tr key={rcv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-amber-400">{rcv.deliveryNumber}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Ref: {rcv.documentReference}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">{rcv.deliveryDate}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{rcv.supplierName}</td>
                  <td className="px-4 py-3 text-slate-300">{rcv.receivingLocation}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                    +{rcv.quantity.toLocaleString()} L
                  </td>
                  <td className="px-4 py-3">
                    {rcv.qualityCheck?.isAvailable ? (
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Tested OK (Density: {rcv.qualityCheck.density} kg/L)
                        </div>
                        <div className="text-slate-400 text-[10px]">Temp: {rcv.qualityCheck.temperature}°C • Water: {rcv.qualityCheck.waterContent}%</div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 italic bg-slate-800 px-2 py-0.5 rounded">
                        Quality Data Not Available
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{getWorkflowBadge(rcv.status)}</td>
                  <td className="px-4 py-3 text-center">
                    {rcv.status === "Submitted" && (
                      <button
                        onClick={() => onUpdateStatus(rcv.id, "Verified")}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold hover:bg-amber-500/30"
                      >
                        Verify Quality Test
                      </button>
                    )}
                    {rcv.status === "Verified" && (
                      <button
                        onClick={() => onUpdateStatus(rcv.id, "Approved")}
                        className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold hover:bg-indigo-500/30"
                      >
                        Approve DO
                      </button>
                    )}
                    {rcv.status === "Approved" && (
                      <button
                        onClick={() => onUpdateStatus(rcv.id, "Posted")}
                        className="px-2.5 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-bold hover:bg-emerald-400 shadow-md"
                      >
                        Post to Stock Ledger
                      </button>
                    )}
                    {rcv.status === "Posted" && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Posted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form New Receiving */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-emerald-400" />
              Input Penerimaan Solar Baru (Receiving Log)
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Supplier</label>
                  <select
                    value={form.supplierId}
                    onChange={e => setForm({ ...form, supplierId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nomor DO / Surat Jalan</label>
                  <input
                    type="text"
                    value={form.deliveryNumber}
                    onChange={e => setForm({ ...form, deliveryNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Produk Solar</label>
                  <select
                    value={form.fuelProductId}
                    onChange={e => setForm({ ...form, fuelProductId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah Penerimaan (Liter)</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tangki Tujuan (Receiving Location)</label>
                <select
                  value={form.receivingLocation}
                  onChange={e => setForm({ ...form, receivingLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  {tanks.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Plat Truk Tangki</label>
                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Driver Tangki</label>
                  <input
                    type="text"
                    value={form.driverName}
                    onChange={e => setForm({ ...form, driverName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Quality Test Section */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Pemeriksaan Kualitas (Fuel Quality Lab Test)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.hasQualityCheck}
                      onChange={e => setForm({ ...form, hasQualityCheck: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500"
                    />
                    <span>Input Hasil Test</span>
                  </label>
                </div>

                {form.hasQualityCheck && (
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Density (kg/L)</span>
                      <input
                        type="number"
                        step="0.001"
                        value={form.density}
                        onChange={e => setForm({ ...form, density: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400">Water Content (%)</span>
                      <input
                        type="number"
                        step="0.01"
                        value={form.waterContent}
                        onChange={e => setForm({ ...form, waterContent: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400">Temp (°C)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={form.temperature}
                        onChange={e => setForm({ ...form, temperature: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Submit Penerimaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
