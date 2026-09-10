import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Compass,
  Droplets,
  Wind,
  Trash2,
  Mountain,
  ShieldAlert,
  Eye,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { MonitoringPoint, SedimentPond, AirMonitoringStation, EnvironmentalWasteRecord } from "../../../types/environmentTypes";

interface Props {
  monitoringPoints: MonitoringPoint[];
  sedimentPonds: SedimentPond[];
  airStations: AirMonitoringStation[];
  wasteRecords: EnvironmentalWasteRecord[];
}

export const EnvironmentalGisMapTab: React.FC<Props> = ({
  monitoringPoints,
  sedimentPonds,
  airStations,
  wasteRecords,
}) => {
  const [showWaterLayers, setShowWaterLayers] = useState(true);
  const [showAirLayers, setShowAirLayers] = useState(true);
  const [showSedimentLayers, setShowSedimentLayers] = useState(true);
  const [showWasteLayers, setShowWasteLayers] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>("Settling Pond Alpha 1");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Spatial GIS Environmental Map & Monitoring Network
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Peta Spasial Interaktif: Sebaran Titik Pantau Air, Stasiun Udara Ambien, Sediment Pond, TPS B3 & Outfall Stream Pit Alpha
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWaterLayers(!showWaterLayers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showWaterLayers
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Droplets className="h-3.5 w-3.5 inline mr-1" /> Water Points
          </button>
          <button
            onClick={() => setShowAirLayers(!showAirLayers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showAirLayers
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Wind className="h-3.5 w-3.5 inline mr-1" /> Air Stations
          </button>
          <button
            onClick={() => setShowSedimentLayers(!showSedimentLayers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showSedimentLayers
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Mountain className="h-3.5 w-3.5 inline mr-1" /> Sediment Ponds
          </button>
        </div>
      </div>

      {/* Map Canvas Simulation */}
      <div className="relative h-[500px] w-full rounded-2xl border border-slate-800 bg-[#0B1522] overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Terrain Topography Lines Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Simulated Pit Contour Lines & Topography Overlay */}
        <div className="absolute top-12 left-20 w-80 h-80 rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-pulse" />
        <div className="absolute top-24 left-32 w-56 h-56 rounded-full border border-emerald-500/30 bg-emerald-500/10" />

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 z-10 rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-xs space-y-1 backdrop-blur-md">
          <p className="font-bold text-white">Pit Alpha Site Boundary</p>
          <p className="text-slate-400 text-[10px]">UTM Zone 50S • Elevasi 32m - 120m RL</p>
        </div>

        {/* Spatial Pins on Canvas */}
        {showWaterLayers && (
          <div
            onClick={() => setSelectedPin("Outfall Sediment Pond Alpha 1")}
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-cyan-500 text-cyan-400 text-xs shadow-lg group-hover:scale-105 transition">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span className="font-bold">SW-01 Outfall Pond Alpha 1</span>
            </div>
            <div className="mx-auto h-3 w-0.5 bg-cyan-500" />
            <div className="mx-auto h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
        )}

        {showAirLayers && (
          <div
            onClick={() => setSelectedPin("Station 1 - ROM & Crusher")}
            className="absolute top-1/4 right-1/3 cursor-pointer group"
          >
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-emerald-500 text-emerald-400 text-xs shadow-lg group-hover:scale-105 transition">
              <Wind className="h-4 w-4 text-emerald-400" />
              <span className="font-bold">AQ-01 ROM Station North</span>
            </div>
            <div className="mx-auto h-3 w-0.5 bg-emerald-500" />
            <div className="mx-auto h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        )}

        {showSedimentLayers && (
          <div
            onClick={() => setSelectedPin("Sedimentation Pond Alpha")}
            className="absolute bottom-1/4 left-1/2 cursor-pointer group"
          >
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-amber-500 text-amber-400 text-xs shadow-lg group-hover:scale-105 transition">
              <Mountain className="h-4 w-4 text-amber-400" />
              <span className="font-bold">POND-A Settling Basin (80.7%)</span>
            </div>
            <div className="mx-auto h-3 w-0.5 bg-amber-500" />
            <div className="mx-auto h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          </div>
        )}

        {/* Detail Inspector Drawer */}
        {selectedPin && (
          <div className="absolute bottom-4 right-4 z-10 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 text-xs space-y-2 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white">{selectedPin}</span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300">
              Status Operasional Normal. Pengujian baku mutu terakreditasi SUCOFINDO compliant dengan Permen LHK 113/2003.
            </p>
            <div className="text-[10px] text-slate-400 pt-1">
              Koordinat: -3.4215 S, 115.2341 E • Elevasi: 45m RL
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
