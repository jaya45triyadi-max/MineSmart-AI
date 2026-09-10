// MINE SMART AI - BI Dashboard Builder Widget Palette Drawer
import React, { useState } from "react";
import {
  Pickaxe,
  BarChart3,
  TrendingUp,
  Truck,
  Clock,
  PieChart,
  Fuel,
  Layers,
  Coins,
  DollarSign,
  MapPin,
  Activity,
  Table,
  Sparkles,
  Search,
  Plus,
  GripVertical,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";
import { WidgetPaletteItem, WidgetCategory } from "../../../types/biBuilderTypes";

interface WidgetPaletteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: WidgetPaletteItem[];
  onAddWidget: (item: WidgetPaletteItem) => void;
}

export const WidgetPaletteDrawer: React.FC<WidgetPaletteDrawerProps> = ({
  isOpen,
  onClose,
  catalog,
  onAddWidget,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  const categories: { key: string; label: string }[] = [
    { key: "ALL", label: "Semua Widget" },
    { key: "PRODUCTION", label: "Production" },
    { key: "FLEET", label: "Fleet & FMS" },
    { key: "FUEL", label: "Fuel & BBM" },
    { key: "COST", label: "Cost & Finance" },
    { key: "MAP", label: "Map & Spatial" },
    { key: "KPI", label: "KPI Metric" },
    { key: "TABLE", label: "Data Table" },
    { key: "AI_INSIGHT", label: "AI Insight" },
  ];

  const filteredItems = catalog.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (category: WidgetCategory) => {
    switch (category) {
      case "PRODUCTION":
        return Pickaxe;
      case "FLEET":
        return Truck;
      case "FUEL":
        return Fuel;
      case "COST":
        return Coins;
      case "MAP":
        return MapPin;
      case "KPI":
        return Activity;
      case "TABLE":
        return Table;
      case "AI_INSIGHT":
        return Sparkles;
      default:
        return BarChart3;
    }
  };

  const getCategoryBadgeColor = (category: WidgetCategory) => {
    switch (category) {
      case "PRODUCTION":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "FLEET":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "FUEL":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "COST":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "MAP":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "KPI":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "TABLE":
        return "bg-slate-500/10 text-slate-300 border-slate-500/20";
      case "AI_INSIGHT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const handleDragStart = (e: React.DragEvent, item: WidgetPaletteItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Widget Palette Library</h3>
            <p className="text-[11px] text-slate-400">Tarik (Drag) atau klik tambah widget ke dashboard</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 space-y-3 border-b border-slate-800 bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari widget (Production, Fuel, Map, KPI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-amber-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Tidak ada widget yang sesuai kriteria pencarian.
          </div>
        ) : (
          filteredItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const badgeClass = getCategoryBadgeColor(item.category);

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="group p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800/90 hover:border-amber-500/50 shadow-lg transition-all cursor-grab active:cursor-grabbing space-y-2.5 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badgeClass}`}>
                          {item.category}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {item.defaultWidth}/12 Kolom
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAddWidget(item)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition text-xs font-bold"
                      title="Klik untuk Tambah ke Dashboard"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="text-slate-600 group-hover:text-slate-400 cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[10px] text-slate-500">
        💡 Drag widget langsung ke kanvas dashboard atau klik ikon (+)
      </div>
    </div>
  );
};
