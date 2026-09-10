// MINE SMART AI - GIS Layer Control Panel Component
// Menampilkan dan mengontrol 17 Layer Pertambangan Interaktif

import React from "react";
import {
  Layers,
  Eye,
  EyeOff,
  Pickaxe,
  Grid,
  Route,
  Mountain,
  Boxes,
  Truck,
  Crosshair,
  ShieldAlert,
  Sliders,
  Flame,
  Cpu,
  Wrench,
  Fuel,
  Building2,
  Home,
  Waves,
  Droplets,
  Target,
} from "lucide-react";
import { GISLayer, SpatialLayerGroup } from "../types/gisTypes";

interface GISLayerControlProps {
  layers: GISLayer[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  onToggleGroup: (group: SpatialLayerGroup, visible: boolean) => void;
}

export const GISLayerControl: React.FC<GISLayerControlProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
  onToggleGroup,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Pickaxe":
        return <Pickaxe className="h-3.5 w-3.5 text-emerald-400" />;
      case "Grid":
        return <Grid className="h-3.5 w-3.5 text-blue-400" />;
      case "Layers":
        return <Layers className="h-3.5 w-3.5 text-amber-400" />;
      case "Route":
        return <Route className="h-3.5 w-3.5 text-yellow-400" />;
      case "Mountain":
        return <Mountain className="h-3.5 w-3.5 text-teal-400" />;
      case "Boxes":
        return <Boxes className="h-3.5 w-3.5 text-purple-400" />;
      case "Flame":
        return <Flame className="h-3.5 w-3.5 text-fuchsia-400" />;
      case "Cpu":
        return <Cpu className="h-3.5 w-3.5 text-red-400" />;
      case "Wrench":
        return <Wrench className="h-3.5 w-3.5 text-indigo-400" />;
      case "Fuel":
        return <Fuel className="h-3.5 w-3.5 text-orange-400" />;
      case "Building2":
        return <Building2 className="h-3.5 w-3.5 text-sky-400" />;
      case "Home":
        return <Home className="h-3.5 w-3.5 text-purple-300" />;
      case "Waves":
        return <Waves className="h-3.5 w-3.5 text-sky-500" />;
      case "Droplets":
        return <Droplets className="h-3.5 w-3.5 text-emerald-500" />;
      case "Truck":
        return <Truck className="h-3.5 w-3.5 text-pink-400" />;
      case "Crosshair":
        return <Crosshair className="h-3.5 w-3.5 text-cyan-400" />;
      case "Target":
        return <Target className="h-3.5 w-3.5 text-lime-400" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-teal-400" />;
    }
  };

  const groups: { name: SpatialLayerGroup; title: string }[] = [
    { name: "OPERATIONAL", title: "Operasional Tambang & Material" },
    { name: "FLEET", title: "Live Fleet GPS Tracking" },
    { name: "GEOLOGY", title: "Geologi & Eksplorasi (Seam, Bor)" },
    { name: "INFRASTRUCTURE", title: "Infrastruktur & Fasilitas Site" },
    { name: "ENVIRONMENT", title: "Drainase & Lingkungan Tambang" },
    { name: "SURVEY", title: "Survey Point & Geodesi" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 space-y-3 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
          <Layers className="h-4 w-4 text-teal-500" />
          <span>17 Layer Tambang Interaktif</span>
        </div>
        <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
          {layers.filter((l) => l.visible).length} / {layers.length} Aktif
        </span>
      </div>

      <div className="space-y-3.5 overflow-y-auto max-h-[560px] pr-1">
        {groups.map((grp) => {
          const groupLayers = layers.filter((l) => l.group === grp.name);
          if (groupLayers.length === 0) return null;

          const allVisible = groupLayers.every((l) => l.visible);

          return (
            <div key={grp.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg">
                <span>{grp.title}</span>
                <button
                  onClick={() => onToggleGroup(grp.name, !allVisible)}
                  className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  {allVisible ? "Sembunyikan" : "Tampilkan Semua"}
                </button>
              </div>

              <div className="space-y-1">
                {groupLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`p-2 rounded-xl border transition-all ${
                      layer.visible
                        ? "border-teal-500/30 bg-slate-50 dark:bg-slate-950/70"
                        : "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/40 dark:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="p-1 rounded-md bg-slate-200 dark:bg-slate-800">
                          {renderIcon(layer.iconName)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {layer.name}
                            </span>
                            <span
                              className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: layer.color }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                            {layer.count} Objek Terdata
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleLayer(layer.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          layer.visible
                            ? "border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400"
                            : "border-slate-300 dark:border-slate-700 text-slate-400"
                        }`}
                        title={layer.visible ? "Sembunyikan Layer" : "Tampilkan Layer"}
                      >
                        {layer.visible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Opacity Slider */}
                    {layer.visible && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <Sliders className="h-3 w-3" />
                        <span>Transparansi:</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={layer.opacity}
                          onChange={(e) =>
                            onChangeOpacity(layer.id, parseFloat(e.target.value))
                          }
                          className="flex-1 accent-teal-500 h-1 rounded-lg bg-slate-200 dark:bg-slate-700 cursor-pointer"
                        />
                        <span className="font-mono text-[9px] w-6 text-right font-bold text-teal-600 dark:text-teal-400">
                          {Math.round(layer.opacity * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
