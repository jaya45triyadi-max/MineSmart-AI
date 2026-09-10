// MINE SMART AI - Fuel Dispensing Management View

import React, { useState } from "react";
import {
  Fuel,
  Plus,
  CheckCircle2,
  Clock,
  Gauge,
  Truck,
  User,
  Building2,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  BarChart2
} from "lucide-react";
import {
  FuelDispensing,
  FuelStation,
  FuelTank,
  FuelProduct,
  FuelDispensingStatus
} from "../../types/fuelTypes";

interface FuelDispensingViewProps {
  dispensings: FuelDispensing[];
  stations: FuelStation[];
  tanks: FuelTank[];
  products: FuelProduct[];
  onAddDispensing: (disp: FuelDispensing) => void;
  onUpdateStatus: (id: string, newStatus: FuelDispensingStatus) => void;
}

export const FuelDispensingView: React.FC<FuelDispensingViewProps> = ({
  dispensings,
  stations,
  tanks,
  products,
  onAddDispensing,
  onUpdateStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterShift, setFilterShift] = useState<string>("ALL");

  const [form, setForm] = useState({
    fuelStationId: stations[0]?.id || "st-01",
    tankId: tanks[0]?.id || "tank-01",
    equipmentCode: "HT-201 (Dump Truck Scania)",
    equipmentId: "eq-01",
    operatorName: "Slamet Rahardjo",
    quantity: 380,
    engineHour: 4520,
    odometer: 112450,
    shiftId: "Shift 1 (Day)",
    meterStart: 1282000,
    meterEnd: 1282380,
    authorizedBy: "Hendra Kurniawan"
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selStation = stations.find(s => s.id === form.fuelStationId);
    const selTank = tanks.find(t => t.id === form.tankId);

    const newDisp: FuelDispensing = {
      id: `dsp-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fuelStationId: form.fuelStationId,
      fuelStationName: selStation?.name || "Main Fueling Station",
      tankId: form.tankId,
      equipmentId: form.equipmentId,
      equipmentCode: form.equipmentCode,
      operatorId: "op-101",
      operatorName: form.operatorName,
      fuelProductId: "fp-01",
      quantity: Number(form.quantity),
      unit: "Liter",
      engineHour: Number(form.engineHour),
      odometer: Number(form.odometer),
      shiftId: form.shiftId,
      location: selStation?.location || "Workshop Area",
      meterStart: Number(form.meterStart),
      meterEnd: Number(form.meterEnd),
      authorizedBy: form.authorizedBy,
      status: "Validated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddDispensing(newDisp);
    setIsModalOpen(false);
  };

  const filtered = dispensings.filter(d => {
    const matchesSearch =
      d.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fuelStationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = filterShift === "ALL" || d.shiftId.includes(filterShift);
    return matchesSearch && matchesShift;
  });

  const getStatusBadge = (status: FuelDispensingStatus) => {
    switch (status) {
      case "Requested":
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">1. Requested</span>;
      case "Authorized":
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">2. Authorized</span>;
      case "Dispensed":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">3. Dispensed</span>;
      case "Recorded":
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">4. Recorded</span>;
      case "Validated":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">5. Validated</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-400" />
            Fuel Dispensing & Refueling Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan penyaluran BBM ke alat berat (Excavator, Dump Truck, Dozer) dengan pembacaan meter start/end
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Catat Pengisian (Dispensing)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari Kode Alat, Operator, Stasiun..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Shift:</span>
          {["ALL", "Shift 1", "Shift 2"].map(sh => (
            <button
              key={sh}
              onClick={() => setFilterShift(sh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterShift === sh ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {sh}
            </button>
          ))}
        </div>
      </div>

      {/* Dispensings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Waktu & Shift</th>
                <th className="px-4 py-3">Stasiun Fuel</th>
                <th className="px-4 py-3">Equipment & Type</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3 text-right">Volume (Liter)</th>
                <th className="px-4 py-3 text-right">Engine Hour / KM</th>
                <th className="px-4 py-3 text-right">Flowmeter Start → End</th>
                <th className="px-4 py-3">Status Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(dsp => (
                <tr key={dsp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-slate-200">{dsp.date} {dsp.time}</div>
                    <div className="text-[10px] text-amber-400 font-medium">{dsp.shiftId}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">{dsp.fuelStationName}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" /> {dsp.equipmentCode}
                    </div>
                    <div className="text-[10px] text-slate-400">{dsp.equipmentType || "Mining Equipment"}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{dsp.operatorName}</td>
                  <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                    -{dsp.quantity.toLocaleString()} L
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {dsp.engineHour ? `${dsp.engineHour.toLocaleString()} Jam` : "-"} / {dsp.odometer ? `${dsp.odometer.toLocaleString()} km` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">
                    {dsp.meterStart.toLocaleString()} → <span className="font-bold text-slate-200">{dsp.meterEnd.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(dsp.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal New Dispensing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-amber-400" />
              Form Catat Pengisian Solar (Dispensing)
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Stasiun Pengisian</label>
                  <select
                    value={form.fuelStationId}
                    onChange={e => setForm({ ...form, fuelStationId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tangki Sumber</label>
                  <select
                    value={form.tankId}
                    onChange={e => setForm({ ...form, tankId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {tanks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.currentStock.toLocaleString()} L)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Unit Equipment / Kode Truk</label>
                  <input
                    type="text"
                    value={form.equipmentCode}
                    onChange={e => setForm({ ...form, equipmentCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-bold text-amber-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Operator Unit</label>
                  <input
                    type="text"
                    value={form.operatorName}
                    onChange={e => setForm({ ...form, operatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah Solar (Liter)</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Engine Hour (SMU)</label>
                  <input
                    type="number"
                    value={form.engineHour}
                    onChange={e => setForm({ ...form, engineHour: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={form.odometer}
                    onChange={e => setForm({ ...form, odometer: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Flowmeter Awal (Start)</label>
                  <input
                    type="number"
                    value={form.meterStart}
                    onChange={e => setForm({ ...form, meterStart: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Flowmeter Akhir (End)</label>
                  <input
                    type="number"
                    value={form.meterEnd}
                    onChange={e => setForm({ ...form, meterEnd: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono font-bold text-amber-400"
                  />
                </div>
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
                  Simpan Dispensing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
