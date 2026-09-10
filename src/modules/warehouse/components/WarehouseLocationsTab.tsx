// MINE SMART AI - Warehouse Locations Tab
import React, { useState } from "react";
import { StorageLocation, Warehouse } from "../../../types/warehouseTypes";
import { MapPin, Plus, Boxes, ShieldCheck, CheckCircle2, AlertTriangle, X } from "lucide-react";

interface WarehouseLocationsTabProps {
  warehouses: Warehouse[];
  locations: StorageLocation[];
  onSaveWarehouse: (wh: Warehouse) => void;
  onSaveLocation: (loc: StorageLocation) => void;
}

export const WarehouseLocationsTab: React.FC<WarehouseLocationsTabProps> = ({
  warehouses,
  locations,
  onSaveLocation,
}) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newLoc, setNewLoc] = useState<Partial<StorageLocation>>({
    warehouseId: warehouses[0]?.warehouseId || "wh-001",
    zone: "Zone A - Heavy Components",
    rack: "R-01",
    shelf: "S-01",
    bin: "B-01",
    capacityQty: 100,
  });

  const filteredLocations = locations.filter(
    (loc) => selectedWarehouseId === "ALL" || loc.warehouseId === selectedWarehouseId
  );

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.warehouseId === newLoc.warehouseId);
    const code = `${wh?.warehouseCode.substring(0, 3)}-${newLoc.zone?.substring(0, 6)}-${newLoc.rack}-${newLoc.shelf}-${newLoc.bin}`;

    const created: StorageLocation = {
      id: `loc-${Date.now()}`,
      locationId: `loc-${Date.now()}`,
      warehouseId: newLoc.warehouseId || "wh-001",
      warehouseName: wh?.warehouseName || "Gudang Utama",
      zone: newLoc.zone || "Zone A",
      rack: newLoc.rack || "R-01",
      shelf: newLoc.shelf || "S-01",
      bin: newLoc.bin || "B-01",
      locationCode: code,
      capacityQty: Number(newLoc.capacityQty) || 100,
      currentOccupancyQty: 0,
      status: "AVAILABLE",
    };

    onSaveLocation(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouses.map((wh) => {
          const isSelected = selectedWarehouseId === wh.warehouseId;
          const locCount = locations.filter((l) => l.warehouseId === wh.warehouseId).length;
          return (
            <div
              key={wh.warehouseId}
              onClick={() => setSelectedWarehouseId(isSelected ? "ALL" : wh.warehouseId)}
              className={`p-5 rounded-2xl border cursor-pointer transition shadow-lg space-y-3 ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 shadow-amber-500/10"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-800 text-amber-300 rounded-full border border-slate-700">
                  {wh.warehouseType}
                </span>
                <span className="text-xs text-slate-400 font-mono">{wh.warehouseCode}</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{wh.warehouseName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{wh.address}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300">
                <span>Manager: <strong className="text-white">{wh.managerName}</strong></span>
                <span className="font-bold text-amber-400">{locCount} Bin Lokasi</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage Locations Grid Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Hirarki Lokasi Penyimpanan (Zone → Rack → Shelf → Bin)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Struktur bin persediaan suku cadang dan material galian site A
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Bin Lokasi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Kode Lokasi (Bin Code)</th>
                <th className="py-3 px-4">Gudang</th>
                <th className="py-3 px-4">Zona / Rak / Shelf / Bin</th>
                <th className="py-3 px-4 text-center">Okupansi / Kapasitas</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLocations.map((loc) => (
                <tr key={loc.locationId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{loc.locationCode}</td>
                  <td className="py-3 px-4 text-slate-200">{loc.warehouseName}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="font-semibold text-slate-200">{loc.zone}</span>
                    <span className="text-slate-500"> | Rak: {loc.rack} | S: {loc.shelf} | Bin: {loc.bin}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-slate-200">{loc.currentOccupancyQty}</span>
                    <span className="text-slate-500"> / {loc.capacityQty} Unit</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        loc.status === "AVAILABLE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : loc.status === "FULL"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {loc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Location Modal */}
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
              <Plus className="w-5 h-5 text-amber-400" /> Tambah Bin Lokasi Penyimpanan
            </h2>

            <form onSubmit={handleCreateLocation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Gudang Tempat Penyimpanan</label>
                <select
                  value={newLoc.warehouseId}
                  onChange={(e) => setNewLoc({ ...newLoc, warehouseId: e.target.value })}
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
                <label className="block text-slate-400 mb-1">Nama Zone / Area Gudang</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zone A - Heavy Components"
                  value={newLoc.zone}
                  onChange={(e) => setNewLoc({ ...newLoc, zone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Rak (Rack)</label>
                  <input
                    type="text"
                    value={newLoc.rack}
                    onChange={(e) => setNewLoc({ ...newLoc, rack: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Shelf (Tingkat)</label>
                  <input
                    type="text"
                    value={newLoc.shelf}
                    onChange={(e) => setNewLoc({ ...newLoc, shelf: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bin (Kotak)</label>
                  <input
                    type="text"
                    value={newLoc.bin}
                    onChange={(e) => setNewLoc({ ...newLoc, bin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kapasitas Maksimal (Unit)</label>
                <input
                  type="number"
                  value={newLoc.capacityQty}
                  onChange={(e) => setNewLoc({ ...newLoc, capacityQty: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
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
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
