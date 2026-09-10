// MINE SMART AI - Spare Parts Management View (Part Number, Stock, Minimum Stock, Supplier, Price)

import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingDown,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Layers,
  MapPin,
  RefreshCw
} from "lucide-react";
import {
  SparePart,
  SparePartCategory,
  SparePartSupplier
} from "../../types/maintenanceTypes";

interface SparePartsManagementViewProps {
  spareParts: SparePart[];
  onUpdateStock: (id: string, delta: number, notes?: string) => void;
  onCreatePart: (part: Partial<SparePart>) => void;
}

export const SparePartsManagementView: React.FC<SparePartsManagementViewProps> = ({
  spareParts,
  onUpdateStock,
  onCreatePart,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<string>("ALL");
  const [selectedPartForStockModal, setSelectedPartForStockModal] = useState<SparePart | null>(null);
  const [stockAdjustmentType, setStockAdjustmentType] = useState<"IN" | "OUT">("IN");
  const [adjustmentQty, setAdjustmentQty] = useState(1);
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  const [isCreatePartModalOpen, setIsCreatePartModalOpen] = useState(false);

  // New Part Form State
  const [newPartNumber, setNewPartNumber] = useState("");
  const [newPartName, setNewPartName] = useState("");
  const [newCategory, setNewCategory] = useState<SparePartCategory>("Filters");
  const [newStock, setNewStock] = useState(10);
  const [newMinStock, setNewMinStock] = useState(5);
  const [newUnitPrice, setNewUnitPrice] = useState(1500000);
  const [newSupplierName, setNewSupplierName] = useState("PT United Tractors Tbk");
  const [newWarehouse, setNewWarehouse] = useState("Central Warehouse Sangatta");
  const [newBinLocation, setNewBinLocation] = useState("Rack A-01-01");

  const filteredParts = spareParts.filter((part) => {
    const matchesSearch =
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || part.category === selectedCategory;
    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "LOW_STOCK" && part.isLowStock) ||
      (stockFilter === "NORMAL" && !part.isLowStock);
    return matchesSearch && matchesCat && matchesStock;
  });

  const totalValuation = spareParts.reduce((sum, p) => sum + (p.totalValuationIDR || 0), 0);
  const lowStockCount = spareParts.filter((p) => p.isLowStock).length;

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartForStockModal) return;
    const delta = stockAdjustmentType === "IN" ? adjustmentQty : -adjustmentQty;
    onUpdateStock(selectedPartForStockModal.id, delta, adjustmentNotes);
    setSelectedPartForStockModal(null);
    setAdjustmentQty(1);
    setAdjustmentNotes("");
  };

  const handleCreatePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePart({
      partNumber: newPartNumber || `PRT-${Date.now().toString().slice(-4)}`,
      partName: newPartName,
      category: newCategory,
      stock: newStock,
      minimumStock: newMinStock,
      unitPriceIDR: newUnitPrice,
      storageWarehouse: newWarehouse,
      binLocation: newBinLocation,
      supplier: {
        id: `SUP-${Date.now()}`,
        name: newSupplierName,
        contactPerson: "Spare Part Representative",
        phone: "+62 541 789012",
        email: "orders@supplier.com",
        leadTimeDays: 4,
        city: "Balikpapan",
        isPreferredVendor: true,
        ratingScore: 4.8,
      },
    });
    setIsCreatePartModalOpen(false);
    setNewPartNumber("");
    setNewPartName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Spare Part SKUs</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{spareParts.length} SKUs</div>
          <div className="text-[11px] text-slate-400 mt-1">Cataloged & Active</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">{lowStockCount} Items</div>
          <div className="text-[11px] text-rose-400 mt-1 font-semibold">Below Minimum Safety Stock</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Inventory Value</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 mt-2">
            Rp {(totalValuation / 1000000000).toFixed(2)} Miliar
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Rp {totalValuation.toLocaleString("id-ID")}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold">Quick Action</div>
            <div className="text-sm font-extrabold text-white mt-0.5">Register New Part</div>
            <div className="text-[10px] text-slate-400">Add OEM / Aftermarket SKU</div>
          </div>
          <button
            onClick={() => setIsCreatePartModalOpen(true)}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 font-black" />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Spare Parts Inventory & Suppliers</h2>
              <p className="text-xs text-slate-400">Part Number, Stock, Minimum Stock, Supplier & Price</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatePartModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spare Part</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Part Number, Name, Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Filters">Filters</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Engine & Transmission">Engine & Transmission</option>
              <option value="Brakes & Steering">Brakes & Steering</option>
              <option value="Electrical & Sensors">Electrical & Sensors</option>
              <option value="Lubricants & Fluids">Lubricants & Fluids</option>
              <option value="Tyres & Rims">Tyres & Rims</option>
              <option value="Wear Parts & GET">Wear Parts & GET</option>
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="LOW_STOCK">⚠️ Low Stock / Reorder Needed</option>
              <option value="NORMAL">✅ Normal Stock</option>
            </select>
          </div>
        </div>

        {/* Parts Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
              <tr>
                <th className="p-3.5">Part Number</th>
                <th className="p-3.5">Part Name & Category</th>
                <th className="p-3.5 text-center">Stock / Min</th>
                <th className="p-3.5 text-right">Unit Price (IDR)</th>
                <th className="p-3.5 text-right">Total Valuation</th>
                <th className="p-3.5">Supplier & Lead Time</th>
                <th className="p-3.5">Warehouse Bin</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-amber-400">{part.partNumber}</div>
                    <div className="text-[10px] text-slate-500">{part.brandOem}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-white max-w-xs truncate">{part.partName}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      {part.category}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`text-sm font-black ${part.isLowStock ? "text-rose-400" : "text-emerald-400"}`}>
                        {part.stock}
                      </span>
                      <span className="text-slate-500 font-bold">/</span>
                      <span className="text-slate-400 text-xs font-semibold">{part.minimumStock}</span>
                      <span className="text-[10px] text-slate-400">{part.unit}</span>
                    </div>
                    {part.isLowStock && (
                      <span className="inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                        Reorder Needed
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right font-mono font-semibold text-slate-200">
                    Rp {part.unitPriceIDR.toLocaleString("id-ID")}
                  </td>

                  <td className="p-3.5 text-right font-mono font-black text-amber-400">
                    Rp {(part.totalValuationIDR || part.stock * part.unitPriceIDR).toLocaleString("id-ID")}
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{part.supplier.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {part.supplier.city} • Lead: {part.supplier.leadTimeDays} Hari
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono text-slate-300 text-[11px]">{part.binLocation}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{part.storageWarehouse}</div>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedPartForStockModal(part)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Stock In/Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In / Out Adjustment Modal */}
      {selectedPartForStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white">Adjust Physical Stock</h3>
              <button
                onClick={() => setSelectedPartForStockModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs font-black text-amber-400">
                {selectedPartForStockModal.partNumber}
              </div>
              <div className="text-xs font-bold text-white">{selectedPartForStockModal.partName}</div>
              <div className="text-[11px] text-slate-400">
                Current Stock: <strong className="text-emerald-400">{selectedPartForStockModal.stock}</strong>{" "}
                {selectedPartForStockModal.unit} (Min: {selectedPartForStockModal.minimumStock})
              </div>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setStockAdjustmentType("IN")}
                  className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    stockAdjustmentType === "IN"
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Stock IN (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStockAdjustmentType("OUT")}
                  className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    stockAdjustmentType === "OUT"
                      ? "bg-rose-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Stock OUT (-)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Adjustment Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notes / PO Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Penerimaan PO-2026-0814 dari Trakindo"
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartForStockModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Spare Part Modal */}
      {isCreatePartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white">Register New Spare Part</h3>
              <button
                onClick={() => setIsCreatePartModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Part Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLT-CAT-1R0716"
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SparePartCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Filters">Filters</option>
                    <option value="Hydraulics">Hydraulics</option>
                    <option value="Engine & Transmission">Engine & Transmission</option>
                    <option value="Brakes & Steering">Brakes & Steering</option>
                    <option value="Electrical & Sensors">Electrical & Sensors</option>
                    <option value="Lubricants & Fluids">Lubricants & Fluids</option>
                    <option value="Tyres & Rims">Tyres & Rims</option>
                    <option value="Wear Parts & GET">Wear Parts & GET</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fuel Water Separator Filter High Efficiency"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Minimum Stock (Reorder Point)</label>
                  <input
                    type="number"
                    min={1}
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Unit Price (IDR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Storage Warehouse & Bin</label>
                  <input
                    type="text"
                    value={newBinLocation}
                    onChange={(e) => setNewBinLocation(e.target.value)}
                    placeholder="e.g. Rack A-02-04"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePartModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
