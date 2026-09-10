// MINE SMART AI - Selected GIS Object Detail Drawer Component
// Menampilkan Data Metrik Lengkap untuk 17 Layer Tambang & Kategori Live Equipment

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  MapPin,
  Compass,
  ArrowRight,
  Truck,
  Pickaxe,
  Boxes,
  Route,
  Mountain,
  Layers,
  ShieldAlert,
  Crosshair,
  ExternalLink,
  Flame,
  Cpu,
  Wrench,
  Fuel,
  Building2,
  Home,
  Waves,
  Droplets,
  Target,
  Gauge,
  Zap,
} from "lucide-react";
import { SpatialEntity } from "../types/gisTypes";

interface GISObjectDetailDrawerProps {
  entity: SpatialEntity | null;
  onClose: () => void;
}

export const GISObjectDetailDrawer: React.FC<GISObjectDetailDrawerProps> = ({
  entity,
  onClose,
}) => {
  if (!entity) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyCoords = () => {
    const text = `${entity.name} (${entity.code}) | Lat: ${entity.centerCoordinates.lat}, Lng: ${entity.centerCoordinates.lng} | UTM: ${entity.utmString}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModuleNavigationKey = (type: string) => {
    switch (type) {
      case "EQUIPMENT":
        return "fleet";
      case "STOCKPILE":
      case "ROM":
        return "stockpile";
      case "CRUSHER":
        return "crusher";
      case "PIT":
      case "BLOCK":
        return "production";
      case "SEAM":
      case "BOREHOLE":
        return "geology";
      case "ROAD":
        return "hauling";
      case "WORKSHOP":
        return "equipment";
      case "FUEL_STATION":
        return "fuel";
      case "DRAINAGE":
      case "SETTLING_POND":
        return "environment";
      case "SURVEY_POINT":
        return "survey";
      case "GEOFENCE":
        return "hse";
      default:
        return "dashboard";
    }
  };

  const navigateToModule = () => {
    const targetModule = getModuleNavigationKey(entity.type);
    if ((window as any).__NAVIGATE_MODULE__) {
      (window as any).__NAVIGATE_MODULE__(targetModule);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-all animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div>
          <span className="rounded bg-teal-500/10 dark:bg-teal-500/20 px-2 py-0.5 text-[10px] font-extrabold text-teal-600 dark:text-teal-400 border border-teal-500/30 uppercase tracking-wider">
            {entity.type} {entity.equipmentCategory ? `(${entity.equipmentCategory})` : ""} SPATIAL DETAILS
          </span>
          <h2 className="text-base font-black text-slate-900 dark:text-white mt-1 leading-snug">
            {entity.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
        {/* Status Badge & Code */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Kode Identitas</span>
            <span className="font-mono font-bold text-sm text-teal-600 dark:text-teal-400">{entity.code}</span>
          </div>
          <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
            {entity.status}
          </span>
        </div>

        {/* Live Equipment Quick Telemetry Banner (If Equipment) */}
        {entity.type === "EQUIPMENT" && (
          <div className="p-3 rounded-xl border border-pink-500/30 bg-pink-500/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-pink-600 dark:text-pink-400">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Live Fleet Telemetry
              </span>
              <span className="bg-pink-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                {entity.speedKmh ? `${entity.speedKmh} km/h` : "Stationary"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Bahan Bakar:</span>
                <span className="font-bold text-amber-500 font-mono text-xs">
                  {entity.fuelLevelPercent || 80}% Fuel Level
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Operator Aktif:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {entity.operatorName || "Reguler Shift"}
                </span>
              </div>
            </div>

            {entity.targetDestination && (
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Tujuan Rute:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{entity.targetDestination}</span>
              </div>
            )}
          </div>
        )}

        {/* Elevasi RL & UTM Coordinates */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-bold">
              <Compass className="h-3.5 w-3.5 text-teal-500" /> Elevasi RL Tambang
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{entity.rlElevation}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Sistem Koordinat UTM (WGS84)</span>
              <button
                onClick={handleCopyCoords}
                className="flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Tersalin!" : "Salin Koordinat"}</span>
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              {entity.utmString}
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              Latitude: {entity.centerCoordinates.lat.toFixed(6)}°, Longitude: {entity.centerCoordinates.lng.toFixed(6)}°
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Parameter Spasial & Rekayasa Tambang
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {entity.properties.map((prop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60"
              >
                <span className="text-slate-500 dark:text-slate-400 font-medium">{prop.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{prop.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description Note */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Keterangan Geologi & Operasional</span>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {entity.description}
          </p>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <button
          onClick={navigateToModule}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-xs py-2.5 transition-all shadow-md cursor-pointer"
        >
          <span>Akses Modul {entity.type} Terkait</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
