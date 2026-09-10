// MINE SMART AI - Fuel Master Data View

import React, { useState } from "react";
import {
  Building2,
  Droplets,
  Plus,
  Search,
  Fuel,
  Truck,
  CheckCircle2,
  Edit
} from "lucide-react";
import {
  FuelProduct,
  FuelTank,
  FuelStation,
  FuelSupplier
} from "../../types/fuelTypes";

interface FuelMasterDataViewProps {
  products: FuelProduct[];
  tanks: FuelTank[];
  stations: FuelStation[];
  suppliers: FuelSupplier[];
  onAddTank: (tank: FuelTank) => void;
  onAddStation: (station: FuelStation) => void;
}

export const FuelMasterDataView: React.FC<FuelMasterDataViewProps> = ({
  products,
  tanks,
  stations,
  suppliers,
  onAddTank,
  onAddStation
}) => {
  const [activeTab, setActiveTab] = useState<"tanks" | "stations" | "products" | "suppliers">("tanks");
  const [isTankModalOpen, setIsTankModalOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  const [tankForm, setTankForm] = useState({
    code: "TNK-PIT-C01",
    name: "Pit C Mobile Storage Tank",
    locationType: "Mobile Fuel Tank",
    capacity: 25000,
    currentStock: 18000,
    minThreshold: 3000,
    maxThreshold: 24000
  });

  const [stationForm, setStationForm] = useState({
    code: "ST-PIT-C",
    name: "Pit C Fast Refueling Station",
    location: "Pit C Mining Area",
    type: "Mobile Station",
    status: "Active"
  });

  const handleCreateTank = (e: React.FormEvent) => {
    e.preventDefault();
    const newTank: FuelTank = {
      id: `tank-${Date.now()}`,
      code: tankForm.code,
      name: tankForm.name,
      locationType: tankForm.locationType as any,
      fuelProductId: "fp-01",
      capacity: Number(tankForm.capacity),
      currentStock: Number(tankForm.currentStock),
      minThreshold: Number(tankForm.minThreshold),
      maxThreshold: Number(tankForm.maxThreshold),
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddTank(newTank);
    setIsTankModalOpen(false);
  };

  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    const newStation: FuelStation = {
      id: `st-${Date.now()}`,
      code: stationForm.code,
      name: stationForm.name,
      location: stationForm.location,
      type: stationForm.type as any,
      tanks: [],
      meters: [],
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddStation(newStation);
    setIsStationModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Subtabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tanks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tanks" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel Tanks ({tanks.length})
          </button>
          <button
            onClick={() => setActiveTab("stations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "stations" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel Stations ({stations.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "products" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel & Oil Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "suppliers" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Suppliers ({suppliers.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "tanks" && (
            <button
              onClick={() => setIsTankModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Tangki Baru
            </button>
          )}
          {activeTab === "stations" && (
            <button
              onClick={() => setIsStationModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Fuel Station
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: TANKS */}
      {activeTab === "tanks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tanks.map(t => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-amber-400 font-bold text-xs">{t.code}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {t.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{t.name}</h3>
              <p className="text-xs text-slate-400">{t.locationType}</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
                <div className="text-slate-400">Current Stock / Capacity</div>
                <div className="text-amber-400 font-bold text-sm mt-0.5">
                  {t.currentStock.toLocaleString()} L / {t.capacity.toLocaleString()} L
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: STATIONS */}
      {activeTab === "stations" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stations.map(s => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-amber-400 font-bold text-xs">{s.code}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {s.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{s.name}</h3>
              <p className="text-xs text-slate-400">Lokasi: {s.location} ({s.type})</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PRODUCTS */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-amber-400 font-bold text-xs">{p.code}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {p.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
              <p className="text-xs text-slate-400">{p.specification}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SUPPLIERS */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map(sup => (
            <div key={sup.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 text-sm">{sup.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {sup.status}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Contact: {sup.contactPerson} ({sup.phone})</div>
                <div>Email: {sup.email}</div>
                <div>Alamat: {sup.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Tank */}
      {isTankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Tambah Fuel Tank Baru</h3>
            <form onSubmit={handleCreateTank} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kode Tangki</label>
                <input
                  type="text"
                  value={tankForm.code}
                  onChange={e => setTankForm({ ...tankForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Tangki</label>
                <input
                  type="text"
                  value={tankForm.name}
                  onChange={e => setTankForm({ ...tankForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Kapasitas (Liter)</label>
                <input
                  type="number"
                  value={tankForm.capacity}
                  onChange={e => setTankForm({ ...tankForm, capacity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsTankModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Simpan Tangki</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Station */}
      {isStationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Tambah Fuel Station Baru</h3>
            <form onSubmit={handleCreateStation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kode Stasiun</label>
                <input
                  type="text"
                  value={stationForm.code}
                  onChange={e => setStationForm({ ...stationForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nama Fuel Station</label>
                <input
                  type="text"
                  value={stationForm.name}
                  onChange={e => setStationForm({ ...stationForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lokasi Area</label>
                <input
                  type="text"
                  value={stationForm.location}
                  onChange={e => setStationForm({ ...stationForm, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsStationModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Simpan Station</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
