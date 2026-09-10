// MINE SMART AI - Spare Parts & Equipment Compatibility Tab
import React, { useState } from "react";
import { Wrench, ShieldCheck, Search, Filter, AlertTriangle, Layers, Cpu, CheckCircle } from "lucide-react";
import { InventoryItem, StockBalance } from "../../../types/warehouseTypes";

interface SparePartsEquipmentTabProps {
  items: InventoryItem[];
  stocks: StockBalance[];
}

export const SparePartsEquipmentTab: React.FC<SparePartsEquipmentTabProps> = ({ items, stocks }) => {
  const [selectedEq, setSelectedEq] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const equipmentList = [
    "Komatsu PC1250-8",
    "CAT 777D",
    "CAT 777E",
    "Hitachi EX1200-6",
    "Scania P410",
    "Volvo FMX440",
    "Komatsu HD785-7",
  ];

  const spareItems = items.filter(
    (item) => item.categoryName === "Spare Parts" || item.categoryName === "Tyres" || item.categoryName === "Hydraulic"
  );

  const filtered = spareItems.filter((item) => {
    const matchesEq =
      selectedEq === "ALL" || item.compatibleEquipment.some((eq) => eq.toLowerCase().includes(selectedEq.toLowerCase()));
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEq && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            Manajemen Suku Cadang Kritis & Pemetaan Kompatibilitas Alat Berat
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Menghubungkan spare parts, filter, ban, dan komponen mekanis ke armada Excavator, Haul Truck, dan Support Fleet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedEq}
            onChange={(e) => setSelectedEq(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
          >
            <option value="ALL">Semua Model Unit Alat Berat</option>
            {equipmentList.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Equipment Models & Parts count */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {equipmentList.map((eq) => {
          const count = spareItems.filter((i) => i.compatibleEquipment.includes(eq)).length;
          const isSelected = selectedEq === eq;
          return (
            <button
              key={eq}
              onClick={() => setSelectedEq(isSelected ? "ALL" : eq)}
              className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                isSelected
                  ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md"
                  : "bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <div>
                <div className="font-bold text-xs">{eq}</div>
                <div className="text-[11px] text-slate-400">{count} Suku Cadang Terdaftar</div>
              </div>
              <Cpu className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
            </button>
          );
        })}
      </div>

      {/* Parts Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter part number, nama komponen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Menampilkan {filtered.length} suku cadang</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Suku Cadang</th>
                <th className="py-3 px-4">Part Number / OEM</th>
                <th className="py-3 px-4">Kompatibilitas Unit Alat Berat</th>
                <th className="py-3 px-4 text-center">Kritikalitas</th>
                <th className="py-3 px-4 text-center">Stok WH Workshop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => {
                const stock = stocks.find((s) => s.itemId === item.itemId);
                return (
                  <tr key={item.itemId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-200">{item.itemName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.itemCode}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      <div>PN: {item.partNumber}</div>
                      <div className="text-[10px] text-slate-500">OEM: {item.oemNumber || "-"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.compatibleEquipment.map((eq) => (
                          <span key={eq} className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded text-[10px] font-bold border border-slate-700">
                            {eq}
                          </span>
                        ))}
                      </div>
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
                    <td className="py-3 px-4 text-center font-bold text-slate-200">
                      {stock ? (
                        <span className={stock.available <= item.reorderPoint ? "text-amber-400 font-black" : "text-emerald-400"}>
                          {stock.available} {item.unit}
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
