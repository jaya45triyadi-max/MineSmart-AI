// MINE SMART AI - Luxury Enterprise GIS Spatial Command Map Widget
// Features: Satellite / Dark GIS Layer, Active GPS Fleet Beacons, Geofencing, Blasting Exclusion Radar

import React, { useState } from "react";
import {
  MapPin,
  Layers,
  ShieldAlert,
  Radio,
  Truck,
  Eye,
  Sliders,
  Maximize2,
  Navigation,
  AlertTriangle,
  Flame,
  Activity,
  Trees,
  Crosshair,
  ExternalLink,
} from "lucide-react";

interface GISCommandMapWidgetProps {
  onNavigateModule?: (moduleKey: any) => void;
}

export const GISCommandMapWidget: React.FC<GISCommandMapWidgetProps> = ({ onNavigateModule }) => {
  const [mapStyle, setMapStyle] = useState<"DARK_HIGH_TECH" | "SATELLITE" | "CONTOUR">("DARK_HIGH_TECH");
  const [showGeofences, setShowGeofences] = useState(true);
  const [showFleetGPS, setShowFleetGPS] = useState(true);
  const [showSlopeSensors, setShowSlopeSensors] = useState(true);
  const [showBlastingZone, setShowBlastingZone] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>("DT-402");

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0A142F]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4 luxury-card-glow overflow-hidden relative">
      {/* Header with Layer Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                GIS Spatial Command & Fleet Telemetry Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                WGS84 UTM 50S
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Peta geospasial real-time, perimeter geofencing bahaya, dan posisi presisi seluruh unit tambang
            </p>
          </div>
        </div>

        {/* Map Mode Buttons & Fullscreen Shortcut */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setMapStyle("DARK_HIGH_TECH")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapStyle === "DARK_HIGH_TECH"
                  ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Dark GIS
            </button>
            <button
              onClick={() => setMapStyle("SATELLITE")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapStyle === "SATELLITE"
                  ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle("CONTOUR")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapStyle === "CONTOUR"
                  ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Contour
            </button>
          </div>

          <button
            onClick={() => onNavigateModule && onNavigateModule("gis")}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer shadow-sm"
            title="Buka Modul Peta GIS Lengkap"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setShowFleetGPS(!showFleetGPS)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
            showFleetGPS
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
              : "bg-slate-900/60 text-slate-500 border-slate-800"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>GPS Fleet (28 Units)</span>
        </button>

        <button
          onClick={() => setShowGeofences(!showGeofences)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
            showGeofences
              ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40"
              : "bg-slate-900/60 text-slate-500 border-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Geofence Boundaries</span>
        </button>

        <button
          onClick={() => setShowBlastingZone(!showBlastingZone)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
            showBlastingZone
              ? "bg-rose-500/15 text-rose-400 border-rose-500/40"
              : "bg-slate-900/60 text-slate-500 border-slate-800"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Blasting Zone (500m Exclusion)</span>
        </button>

        <button
          onClick={() => setShowSlopeSensors(!showSlopeSensors)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
            showSlopeSensors
              ? "bg-purple-500/15 text-purple-400 border-purple-500/40"
              : "bg-slate-900/60 text-slate-500 border-slate-800"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Geotechnical Slope Radar (SS-04)</span>
        </button>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="relative h-96 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#060D20] overflow-hidden">
        {/* Map Grid / Satellite Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            mapStyle === "SATELLITE"
              ? "bg-cover bg-center opacity-80"
              : mapStyle === "CONTOUR"
              ? "bg-slate-950 opacity-90"
              : "bg-radial from-[#0C1A3D] via-[#071126] to-[#030814]"
          }`}
          style={
            mapStyle === "SATELLITE"
              ? {
                  backgroundImage:
                    "radial-gradient(circle at 40% 50%, rgba(13, 30, 60, 0.4), rgba(4, 10, 20, 0.95)), linear-gradient(#0c1830 1px, transparent 1px), linear-gradient(90deg, #0c1830 1px, transparent 1px)",
                }
              : {}
          }
        />

        {/* Vector Map SVG Polygons & Roads */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Mining Concession IUP Polygon */}
          <polygon
            points="50,40 320,30 680,60 840,180 760,340 380,360 80,310"
            fill="rgba(6, 182, 212, 0.04)"
            stroke="#06B6D4"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />

          {/* Pit 01 Boundary */}
          {showGeofences && (
            <polygon
              points="140,80 340,70 540,110 580,220 440,280 180,250 120,160"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10B981"
              strokeWidth="2"
            />
          )}

          {/* Disposal North Area */}
          {showGeofences && (
            <polygon
              points="580,40 760,50 820,140 720,180 580,120"
              fill="rgba(168, 85, 247, 0.08)"
              stroke="#A855F7"
              strokeWidth="1.5"
            />
          )}

          {/* Blasting 500m Danger Exclusion Perimeter Ring */}
          {showBlastingZone && (
            <g className="animate-pulse">
              <circle
                cx="660"
                cy="260"
                r="70"
                fill="rgba(244, 63, 94, 0.12)"
                stroke="#F43F5E"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <circle cx="660" cy="260" r="8" fill="#F43F5E" />
            </g>
          )}

          {/* Haul Road Main Arteries */}
          <path
            d="M 160,180 Q 280,120 420,180 T 640,90 T 780,110"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-80"
          />
          <path
            d="M 420,180 Q 480,260 620,290"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>

        {/* Live GPS Fleet Units on Map */}
        {showFleetGPS && (
          <>
            {/* Truck 1 */}
            <div
              onClick={() => setSelectedPin("DT-402")}
              className="absolute left-[38%] top-[38%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="absolute -inset-2 rounded-full bg-emerald-500 animate-beacon opacity-75" />
              <div className="relative p-2 rounded-xl bg-slate-900 border border-emerald-400 text-emerald-300 shadow-xl group-hover:scale-125 transition-transform flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold font-mono">DT-402</span>
              </div>
            </div>

            {/* Truck 2 */}
            <div
              onClick={() => setSelectedPin("DT-408")}
              className="absolute left-[62%] top-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="p-1.5 rounded-xl bg-slate-900 border border-cyan-400 text-cyan-300 shadow-xl group-hover:scale-125 transition-transform flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold font-mono">DT-408</span>
              </div>
            </div>

            {/* Excavator 1 */}
            <div
              onClick={() => setSelectedPin("EX-2001")}
              className="absolute left-[24%] top-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-xl group-hover:scale-125 transition-transform flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono">EX-2001</span>
              </div>
            </div>
          </>
        )}

        {/* Slope Stability Radar Marker */}
        {showSlopeSensors && (
          <div className="absolute left-[18%] top-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20">
            <div className="p-1.5 rounded-xl bg-purple-950/90 border border-purple-400 text-purple-300 shadow-lg flex items-center gap-1 text-[9px] font-mono">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Slope Radar #01 (0.2 mm/hr - Safe)</span>
            </div>
          </div>
        )}

        {/* Selected Unit Telemetry HUD Card (Bottom Right Floating) */}
        {selectedPin && (
          <div className="absolute bottom-3 right-3 max-w-xs bg-slate-900/90 backdrop-blur-xl border border-emerald-500/40 p-3.5 rounded-2xl shadow-2xl space-y-2 text-xs z-30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                GPS Telemetry: {selectedPin}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              HD 785-7 Komatsu &bull; Driver: Hendra Setiawan (Shift 1)
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Kecepatan:</span>
                <span className="font-mono text-emerald-400 font-bold">28.4 km/h</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payload:</span>
                <span className="font-mono text-amber-400 font-bold">96.8 Ton</span>
              </div>
              <div>
                <span className="text-slate-500 block">Posisi:</span>
                <span className="font-mono text-cyan-400">Lat -0.584, Long 117.42</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fuel Flow:</span>
                <span className="font-mono text-white">42 L/hr</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Left Mini HUD */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-3">
          <span className="text-emerald-400 font-bold">RTK GPS Fix: 14 Satellites</span>
          <span className="text-slate-600">|</span>
          <span>Geofence Status: 0 Breach</span>
        </div>
      </div>
    </div>
  );
};
