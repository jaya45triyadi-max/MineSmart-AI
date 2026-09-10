import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Flame,
  Layers,
  MapPin,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Download,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Stockpile, StockpileType, StockpileStatus, CoalType } from "../../../types/stockpileTypes";

interface StockpileInventoryTabProps {
  stockpiles: Stockpile[];
  onAddStockpile: (newStockpile: Stockpile) => void;
  onUpdateStockpile: (updatedStockpile: Stockpile) => void;
  onDeleteStockpile: (id: string) => void;
}

export const StockpileInventoryTab: React.FC<StockpileInventoryTabProps> = ({
  stockpiles,
  onAddStockpile,
  onUpdateStockpile,
  onDeleteStockpile,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCoalType, setFilterCoalType] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStockpile, setEditingStockpile] = useState<Stockpile | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Stockpile>>({
    stockpileCode: "",
    stockpileName: "",
    stockpileType: "ROM",
    coalType: "Raw Coal",
    materialType: "Raw Coal High Grade",
    capacity: 50000,
    currentQuantity: 0,
    quantityUnit: "Ton",
    capacityUnit: "Ton",
    status: "ACTIVE",
    qualityStatus: "ON SPEC",
    operationalStatus: "DUMPING_FEEDING",
    ageDays: 0,
    location: {
      area: "Pit 1 North Pad",
      block: "Block 04",
      latitude: -2.3512,
      longitude: 115.4211,
    },
    quality: {
      cvGAR: 5000,
      totalMoisture: 26.0,
      inherentMoisture: 12.0,
      ash: 7.0,
      sulfur: 0.7,
      volatileMatter: 38.0,
      hgi: 50,
      status: "ON SPEC",
    },
  });

  const filteredStockpiles = stockpiles.filter((sp) => {
    const matchesSearch =
      sp.stockpileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.stockpileCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.location.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "ALL" || sp.stockpileType === filterType;
    const matchesStatus = filterStatus === "ALL" || sp.status === filterStatus;
    const matchesCoal = filterCoalType === "ALL" || sp.coalType === filterCoalType;

    return matchesSearch && matchesType && matchesStatus && matchesCoal;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStockpiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStockpiles.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAddModal = () => {
    setEditingStockpile(null);
    setFormData({
      stockpileCode: `SP-${String(stockpiles.length + 1).padStart(2, "0")}`,
      stockpileName: "",
      stockpileType: "ROM",
      coalType: "Raw Coal",
      materialType: "Raw Coal High Grade",
      capacity: 50000,
      currentQuantity: 0,
      quantityUnit: "Ton",
      capacityUnit: "Ton",
      status: "ACTIVE",
      qualityStatus: "ON SPEC",
      operationalStatus: "DUMPING_FEEDING",
      ageDays: 0,
      location: {
        area: "Main Pad Area",
        block: "Block 01",
        latitude: -2.3500,
        longitude: 115.4200,
      },
      quality: {
        cvGAR: 5000,
        totalMoisture: 26.0,
        inherentMoisture: 12.0,
        ash: 7.0,
        sulfur: 0.7,
        volatileMatter: 38.0,
        hgi: 50,
        status: "ON SPEC",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sp: Stockpile) => {
    setEditingStockpile(sp);
    setFormData(sp);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stockpileName || !formData.stockpileCode) return;

    if (editingStockpile) {
      onUpdateStockpile({
        ...editingStockpile,
        ...formData,
        updatedAt: new Date().toISOString(),
      } as Stockpile);
    } else {
      const newSp: Stockpile = {
        id: `SP-${Date.now()}`,
        stockpileId: formData.stockpileCode || `SP-${Date.now()}`,
        companyId: "COMP-01",
        siteId: "SITE-BBNU-01",
        stockpileCode: formData.stockpileCode || "SP-NEW",
        stockpileName: formData.stockpileName || "New Stockpile",
        stockpileType: (formData.stockpileType as StockpileType) || "ROM",
        coalType: (formData.coalType as CoalType) || "Raw Coal",
        materialType: formData.materialType || "Raw Coal",
        capacity: Number(formData.capacity) || 50000,
        currentQuantity: Number(formData.currentQuantity) || 0,
        capacityUnit: "Ton",
        quantityUnit: "Ton",
        status: (formData.status as StockpileStatus) || "ACTIVE",
        qualityStatus: formData.quality?.status || "ON SPEC",
        quality: formData.quality || {
          cvGAR: 5000,
          totalMoisture: 26,
          inherentMoisture: 12,
          ash: 7,
          sulfur: 0.7,
          volatileMatter: 38,
          hgi: 50,
          status: "ON SPEC",
        },
        operationalStatus: formData.operationalStatus || "ACTIVE",
        ageDays: Number(formData.ageDays) || 0,
        location: formData.location || {
          area: "Main Yard",
          block: "Block 01",
          latitude: -2.35,
          longitude: 115.42,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddStockpile(newSp);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Control Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            Stockpile Profiles & Live Inventory ({stockpiles.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen master lokasi stockpile batubara, batas kapasitas max, volume saat ini, serta status operasional site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Tampilan: {viewMode === "table" ? "Grid Cards" : "Tabel Matriks"}
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Stockpile Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode, nama, area..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            >
              <option value="ALL">Semua Tipe Stockpile</option>
              <option value="ROM">ROM Pad Stockpile</option>
              <option value="PRODUCT">Product Coal Stockpile</option>
              <option value="BLENDING">Blending Stockpile</option>
              <option value="TEMPORARY">Temporary Dump</option>
              <option value="REJECT">Reject Dump</option>
            </select>
          </div>

          {/* Coal Type Filter */}
          <div>
            <select
              value={filterCoalType}
              onChange={(e) => setFilterCoalType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            >
              <option value="ALL">Semua Jenis Batubara</option>
              <option value="Raw Coal">Raw Coal</option>
              <option value="Clean Coal">Clean Coal</option>
              <option value="Crushed Coal">Crushed Coal</option>
              <option value="Washed Coal">Washed Coal</option>
              <option value="Product Coal">Product Coal</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            >
              <option value="ALL">Semua Status Operasional</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="NEAR_FULL">NEAR FULL</option>
              <option value="FULL">FULL</option>
              <option value="EMPTY">EMPTY</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Content View */}
      {viewMode === "table" ? (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <button onClick={handleSelectAll}>
                      {selectedIds.length === filteredStockpiles.length && filteredStockpiles.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5 font-bold">Kode & Nama Stockpile</th>
                  <th className="p-3.5 font-bold">Tipe & Jenis</th>
                  <th className="p-3.5 font-bold">Area / Pit / Block</th>
                  <th className="p-3.5 font-bold text-right">Kuantitas / Kapasitas</th>
                  <th className="p-3.5 font-bold">Pengisian (%)</th>
                  <th className="p-3.5 font-bold text-center">Quality (CV GAR)</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredStockpiles.map((sp) => {
                  const isSelected = selectedIds.includes(sp.id);
                  const fillPct = ((sp.currentQuantity / sp.capacity) * 100).toFixed(1);

                  return (
                    <tr
                      key={sp.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-amber-500/5" : ""
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleToggleSelect(sp.id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{sp.stockpileName}</div>
                        <div className="text-[10px] text-slate-400">{sp.stockpileCode} • Umur: {sp.ageDays} hari</div>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {sp.stockpileType}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{sp.coalType}</p>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{sp.location.area}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{sp.location.block} {sp.location.pit ? `• ${sp.location.pit}` : ""}</p>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-slate-900 dark:text-white">
                        {sp.currentQuantity.toLocaleString()} / {sp.capacity.toLocaleString()} Ton
                      </td>
                      <td className="p-3.5 w-36">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{fillPct}%</span>
                            <span className="text-slate-400">{((sp.capacity - sp.currentQuantity)).toLocaleString()} Ton sisa</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                Number(fillPct) > 90 ? "bg-red-500" : Number(fillPct) > 75 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(100, Number(fillPct))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-slate-900 dark:text-white">{sp.quality.cvGAR} kcal</span>
                        <p className="text-[10px] text-slate-400">Ash: {sp.quality.ash}% • TM: {sp.quality.totalMoisture}%</p>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            sp.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : sp.status === "NEAR_FULL"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {sp.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(sp)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Edit Stockpile"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStockpile(sp.id)}
                            className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Hapus Stockpile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStockpiles.map((sp) => {
            const fillPct = ((sp.currentQuantity / sp.capacity) * 100).toFixed(1);
            return (
              <div
                key={sp.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                      {sp.stockpileCode}
                    </span>
                    <h4 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{sp.stockpileName}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(sp)}
                      className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteStockpile(sp.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipe:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{sp.stockpileType} ({sp.coalType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kapasitas:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sp.currentQuantity.toLocaleString()} / {sp.capacity.toLocaleString()} Ton
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(fillPct) > 90 ? "bg-red-500" : Number(fillPct) > 75 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, Number(fillPct))}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Quality CV:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{sp.quality.cvGAR} kcal/kg</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Ash / Moisture:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{sp.quality.ash}% / {sp.quality.totalMoisture}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Stockpile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingStockpile ? "Edit Profile Stockpile" : "Tambah Stockpile Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Kode Stockpile</label>
                  <input
                    type="text"
                    required
                    value={formData.stockpileCode || ""}
                    onChange={(e) => setFormData({ ...formData, stockpileCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Stockpile</label>
                  <input
                    type="text"
                    required
                    value={formData.stockpileName || ""}
                    onChange={(e) => setFormData({ ...formData, stockpileName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tipe Stockpile</label>
                  <select
                    value={formData.stockpileType || "ROM"}
                    onChange={(e) => setFormData({ ...formData, stockpileType: e.target.value as StockpileType })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="ROM">ROM Pad Stockpile</option>
                    <option value="PRODUCT">Product Coal Stockpile</option>
                    <option value="BLENDING">Blending Stockpile</option>
                    <option value="TEMPORARY">Temporary Dump</option>
                    <option value="REJECT">Reject Dump</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Jenis Batubara</label>
                  <select
                    value={formData.coalType || "Raw Coal"}
                    onChange={(e) => setFormData({ ...formData, coalType: e.target.value as CoalType })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Raw Coal">Raw Coal</option>
                    <option value="Clean Coal">Clean Coal</option>
                    <option value="Crushed Coal">Crushed Coal</option>
                    <option value="Washed Coal">Washed Coal</option>
                    <option value="Product Coal">Product Coal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Kapasitas Maksimal (Ton)</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity || 50000}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tonnage Saat Ini (Ton)</label>
                  <input
                    type="number"
                    value={formData.currentQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, currentQuantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Area / Lokasi</label>
                  <input
                    type="text"
                    value={formData.location?.area || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, area: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Kalori CV (kcal/kg GAR)</label>
                  <input
                    type="number"
                    value={formData.quality?.cvGAR || 5000}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quality: { ...formData.quality!, cvGAR: Number(e.target.value) },
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
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
                  Simpan Stockpile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
