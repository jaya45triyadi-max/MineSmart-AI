// MINE SMART AI - Inventory Catalog Tab
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Boxes,
  Tag,
  ShieldCheck,
  AlertTriangle,
  X,
  QrCode,
  Layers,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  InventoryItem,
  ItemCategory,
  ItemCriticality,
  StockBalance,
  StockMovement,
} from "../../../types/warehouseTypes";

interface InventoryCatalogTabProps {
  items: InventoryItem[];
  stocks: StockBalance[];
  movements: StockMovement[];
  onSaveItem: (item: InventoryItem) => void;
}

export const InventoryCatalogTab: React.FC<InventoryCatalogTabProps> = ({
  items,
  stocks,
  movements,
  onSaveItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCriticality, setSelectedCriticality] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Item Form State
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    itemCode: `ITM-SP-${Math.floor(1000 + Math.random() * 9000)}`,
    sku: `SKU-MIN-${Math.floor(100 + Math.random() * 900)}`,
    itemName: "",
    description: "",
    categoryName: "Spare Parts",
    itemType: "SPARE_PART",
    unit: "PCS",
    brand: "",
    model: "",
    partNumber: "",
    oemNumber: "",
    manufacturer: "",
    minimumStock: 5,
    maximumStock: 30,
    reorderPoint: 10,
    reorderQuantity: 15,
    leadTimeDays: 14,
    criticality: "MEDIUM",
    unitCostIDR: 1500000,
    compatibleEquipment: [],
  });

  const categories: ItemCategory[] = [
    "Spare Parts",
    "Consumables",
    "Lubricants",
    "Tyres",
    "PPE",
    "Electrical",
    "Hydraulic",
    "Mechanical",
    "Workshop Tools",
    "Mining Supplies",
    "Office Supplies",
    "Fuel & Oils",
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.categoryName === selectedCategory;
    const matchesCriticality = selectedCriticality === "ALL" || item.criticality === selectedCriticality;

    return matchesSearch && matchesCategory && matchesCriticality;
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleSubmitNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName) return;

    const created: InventoryItem = {
      id: `itm-${Date.now()}`,
      itemId: `itm-${Date.now()}`,
      itemCode: newItem.itemCode || `ITM-${Date.now()}`,
      sku: newItem.sku || `SKU-${Date.now()}`,
      itemName: newItem.itemName,
      description: newItem.description || "",
      categoryId: "cat-gen",
      categoryName: (newItem.categoryName as ItemCategory) || "Spare Parts",
      itemType: newItem.itemType || "SPARE_PART",
      unit: newItem.unit || "PCS",
      brand: newItem.brand || "-",
      model: newItem.model || "-",
      partNumber: newItem.partNumber || "-",
      oemNumber: newItem.oemNumber || "-",
      manufacturer: newItem.manufacturer || "-",
      serialTracking: false,
      batchTracking: false,
      barcode: `880${Math.floor(100000000 + Math.random() * 900000000)}`,
      qrCode: `QR-${newItem.itemCode}`,
      minimumStock: Number(newItem.minimumStock) || 5,
      maximumStock: Number(newItem.maximumStock) || 30,
      reorderPoint: Number(newItem.reorderPoint) || 10,
      reorderQuantity: Number(newItem.reorderQuantity) || 15,
      leadTimeDays: Number(newItem.leadTimeDays) || 14,
      criticality: (newItem.criticality as ItemCriticality) || "MEDIUM",
      status: "ACTIVE",
      unitCostIDR: Number(newItem.unitCostIDR) || 1000000,
      compatibleEquipment: newItem.compatibleEquipment || [],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    onSaveItem(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama item, kode ITM, part number, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Kritikalitas</option>
            <option value="CRITICAL">Critical (Sangat Vital)</option>
            <option value="HIGH">High (Tinggi)</option>
            <option value="MEDIUM">Medium (Sedang)</option>
            <option value="LOW">Low (Rendah)</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Tambah Item Master
        </button>
      </div>

      {/* Item Master Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Kode & Nama Item</th>
                <th className="py-3 px-4">Kategori & Part No</th>
                <th className="py-3 px-4">Merk / Manufacturer</th>
                <th className="py-3 px-4 text-center">Reorder Point / Min</th>
                <th className="py-3 px-4 text-center">Kritikalitas</th>
                <th className="py-3 px-4 text-right">Harga Satuan (IDR)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => (
                <tr key={item.itemId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{item.itemName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.itemCode} | SKU: {item.sku}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{item.categoryName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Part: {item.partNumber}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{item.brand}</div>
                    <div className="text-[11px] text-slate-500">{item.manufacturer}</div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300 font-medium">
                    {item.reorderPoint} / {item.minimumStock} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.criticality === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : item.criticality === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.criticality}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    {formatIDR(item.unitCostIDR)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-700 transition"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal / Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Item Master Detail</span>
                <h2 className="text-lg font-extrabold text-white">{selectedItem.itemName}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedItem.itemCode} | SKU: {selectedItem.sku} | Barcode: {selectedItem.barcode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Kategori & Tipe</span>
                <span className="text-slate-200 font-bold block mt-0.5">{selectedItem.categoryName}</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Part Number</span>
                <span className="text-slate-200 font-bold block mt-0.5">{selectedItem.partNumber}</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Merk / Brand</span>
                <span className="text-slate-200 font-bold block mt-0.5">{selectedItem.brand}</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Minimum / Max Stock</span>
                <span className="text-amber-400 font-bold block mt-0.5">
                  {selectedItem.minimumStock} / {selectedItem.maximumStock} {selectedItem.unit}
                </span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Reorder Point</span>
                <span className="text-amber-400 font-bold block mt-0.5">{selectedItem.reorderPoint} {selectedItem.unit}</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Harga Satuan IDR</span>
                <span className="text-emerald-400 font-bold block mt-0.5">{formatIDR(selectedItem.unitCostIDR)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-white">Kompatibilitas Unit Alat Berat (Equipment Compatibility):</h4>
              {selectedItem.compatibleEquipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedItem.compatibleEquipment.map((eq) => (
                    <span
                      key={eq}
                      className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 font-bold"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500">Kompatibel secara umum / Consumable universal.</span>
              )}
            </div>

            {/* Stock per Warehouse */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white">Saldo Stok Saat Ini di Gudang Site A:</h4>
              <div className="space-y-2">
                {stocks
                  .filter((s) => s.itemId === selectedItem.itemId)
                  .map((stk) => (
                    <div
                      key={stk.stockId}
                      className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{stk.warehouseName}</div>
                        <div className="text-[11px] text-slate-400">Lokasi: {stk.locationCode}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-amber-400 text-sm">
                          {stk.onHand} {stk.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">Available: {stk.available}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Registrasi Item Master Baru
            </h2>

            <form onSubmit={handleSubmitNewItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kode Item</label>
                  <input
                    type="text"
                    value={newItem.itemCode}
                    onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">SKU</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Item Suku Cadang / Material *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydraulic Filter Return PC1250"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kategori</label>
                  <select
                    value={newItem.categoryName}
                    onChange={(e) => setNewItem({ ...newItem, categoryName: e.target.value as ItemCategory })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Part Number</label>
                  <input
                    type="text"
                    placeholder="208-60-71120"
                    value={newItem.partNumber}
                    onChange={(e) => setNewItem({ ...newItem, partNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={newItem.minimumStock}
                    onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={newItem.reorderPoint}
                    onChange={(e) => setNewItem({ ...newItem, reorderPoint: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga Satuan IDR</label>
                  <input
                    type="number"
                    value={newItem.unitCostIDR}
                    onChange={(e) => setNewItem({ ...newItem, unitCostIDR: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
