import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
  Bot,
  Pickaxe,
  Truck,
  Fuel,
  ShieldCheck,
  Settings,
  Key,
  FileSpreadsheet,
  MapPin,
  X,
  Sparkles,
  Compass,
  Layers,
  Ruler,
  Radio,
  Route,
  Wrench,
  Activity,
  Flame,
  Scale,
  Factory,
  FlaskConical,
  ShoppingCart,
  Ship,
  Trees,
  Mountain,
  Users,
  Clock,
  Boxes,
  Coins,
  BarChart3,
  Smartphone,
  HardDrive,
  Award,
  Building2,
  Globe2,
  Network,
} from "lucide-react";
import { NavigationModuleKey } from "../../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavigationModuleKey) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          (window as any).__OPEN_COMMAND_PALETTE__ && (window as any).__OPEN_COMMAND_PALETTE__();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commandItems = [
    { key: "dashboard", label: "Executive Dashboard Operations", category: "Navigasi Utama", icon: LayoutDashboard },
    { key: "multi-company", label: "Holding & Multi-Company Architecture (Holding → Company → Site)", category: "Navigasi Utama", icon: Building2 },
    { key: "integration-hub", label: "Integration Hub & API Center (REST, Webhook, GPS, IoT, FMS, ERP, Weighbridge, Lab, Drone, CCTV, RFID, Attendance, Accounting)", category: "Navigasi Utama", icon: Network },
    { key: "ai", label: "AI Command Center & Copilot Grounding", category: "AI Assistant", icon: Bot },
    { key: "gis", label: "Peta GIS Tambang & Citra Satelit", category: "Mine Technical", icon: MapPin },
    { key: "mine-planning", label: "Mine Planning & Target RKAB", category: "Mine Technical", icon: Compass },
    { key: "geology", label: "Geologi, Coal Seam & Cadangan", category: "Mine Technical", icon: Layers },
    { key: "survey", label: "Pemetaan Survey Drone & Topografi", category: "Mine Technical", icon: Ruler },
    { key: "production", label: "Produksi Batubara & Overburden (OB)", category: "Operations", icon: Pickaxe },
    { key: "equipment", label: "Populasi Alat Berat & Telematika Fleet", category: "Operations", icon: Truck },
    { key: "dispatch", label: "FMS & Dispatch Queue Optimization", category: "Operations", icon: Radio },
    { key: "hauling", label: "Hauling Logistics & Cycle Time Road", category: "Operations", icon: Route },
    { key: "fuel", label: "Pengawasan Bahan Bakar Solar B35", category: "Operations", icon: Fuel },
    { key: "maintenance", label: "Plant Maintenance & Work Orders", category: "Maintenance", icon: Wrench },
    { key: "predictive-maintenance", label: "Predictive Maintenance AI Engine", category: "Maintenance AI", icon: Activity },
    { key: "stockpile", label: "Manajemen Stockpile & Coal Blending", category: "Coal Processing", icon: Flame },
    { key: "weighbridge", label: "Jembatan Timbang Weighbridge", category: "Coal Processing", icon: Scale },
    { key: "crusher", label: "Crusher Unit & Processing Plant", category: "Coal Processing", icon: Factory },
    { key: "laboratory", label: "Quality Control & Quality Lab Assay", category: "Coal Processing", icon: FlaskConical },
    { key: "sales", label: "Sales Commercial & Contract", category: "Commercial", icon: ShoppingCart },
    { key: "shipment", label: "Barge Shipping & Vessel Transport", category: "Commercial", icon: Ship },
    { key: "hse", label: "Insiden K3 & Keselamatan Tambang", category: "Safety & Environment", icon: ShieldCheck },
    { key: "environment", label: "Pemantauan Lingkungan & Amdal", category: "Safety & Environment", icon: Trees },
    { key: "reclamation", label: "Reklamasi Void & Revegetasi", category: "Safety & Environment", icon: Mountain },
    { key: "hr", label: "Human Resources & Tenaga Kerja", category: "Corporate", icon: Users },
    { key: "attendance", label: "Presensi Biometrik & Attendance", category: "Corporate", icon: Clock },
    { key: "procurement", label: "Pengadaan Barang & Procurement", category: "Corporate", icon: ShoppingCart },
    { key: "warehouse", label: "Gudang & Logistik Suku Cadang", category: "Corporate", icon: Boxes },
    { key: "finance", label: "Keuangan & Biaya Operasional (HPP)", category: "Finance", icon: Coins },
    { key: "reports", label: "Laporan RKAB & Form ESDM 04", category: "Reporting & BI", icon: FileSpreadsheet },
    { key: "analytics", label: "Predictive Analytics & What-If Simulator", category: "Reporting & BI", icon: BarChart3 },
    { key: "commercial", label: "Commercial Hub, Mobile PWA & Offline Sync", category: "Commercial Release", icon: Award },
    { key: "license", label: "Lisensi & Paket Langganan", category: "System", icon: Key },
    { key: "settings", label: "Pengaturan Perusahaan & Site", category: "System", icon: Settings },
    { key: "design-system", label: "Design System Showcase", category: "System UI", icon: Sparkles },
  ];

  const filteredItems = commandItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl z-10">
        <div className="relative flex items-center pb-3 border-b border-slate-800">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari modul, laporan, alat berat, atau perintah AI (Ctrl + K)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            autoFocus
          />
          <button onClick={onClose} className="absolute right-3 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filteredItems.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500">
              Tidak ada perintah atau modul yang cocok dengan "{query}".
            </p>
          ) : (
            filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key as NavigationModuleKey);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Buka →</span>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-3 border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Gunakan panah untuk navigasi, Enter untuk memilih</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400 font-mono">ESC</span>
        </div>
      </div>
    </div>
  );
};
