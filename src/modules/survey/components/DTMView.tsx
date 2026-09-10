// MINE SMART AI - Digital Terrain Model (DTM) Visualizer & Analytics

import React, { useState } from "react";
import {
  Layers,
  Eye,
  Sliders,
  Ruler,
  Maximize2,
  Download,
  CheckCircle2,
  Activity,
  Globe,
} from "lucide-react";
import { DTMRecord, SurveySurface } from "../../../types/surveyTypes";

interface DTMViewProps {
  dtms: DTMRecord[];
  surfaces: SurveySurface[];
}

export const DTMView: React.FC<DTMViewProps> = ({ dtms, surfaces }) => {
  const [selectedDTM, setSelectedDTM] = useState<DTMRecord>(dtms[0]);
  const [renderMode, setRenderMode] = useState<"Elevation" | "Hillshade" | "Slope" | "TIN Mesh">("Elevation");
  const [showPointOverlay, setShowPointOverlay] = useState(true);
  const [showContourOverlay, setShowContourOverlay] = useState(true);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Digital Terrain Model (DTM) Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model permukaan tanah asli tanpa vegetasi/bangunan, direkonstruksi dari jaringan segitiga TIN terverifikasi.
          </p>
        </div>

        {/* Render mode selector */}
        <div className="flex items-center gap-2">
          {["Elevation", "Hillshade", "Slope", "TIN Mesh"].map((mode) => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                renderMode === mode
                  ? "bg-sky-600 text-white shadow-md shadow-sky-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Canvas Representation */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">{selectedDTM.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPointOverlay}
                  onChange={(e) => setShowPointOverlay(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500"
                />
                Points
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContourOverlay}
                  onChange={(e) => setShowContourOverlay(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500"
                />
                Contours
              </label>
            </div>
          </div>

          {/* DTM Canvas Terrain Simulation */}
          <div className="relative w-full h-[380px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 group">
            {/* Background SVG Grid Terrain */}
            <svg className="w-full h-full opacity-80" viewBox="0 0 600 320">
              <defs>
                <linearGradient id="dtmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* TIN Mesh Triangles */}
              <path
                d="M 50 250 L 120 180 L 220 220 Z M 120 180 L 250 120 L 220 220 Z M 250 120 L 380 90 L 340 180 Z M 380 90 L 480 140 L 520 80 Z M 340 180 L 480 140 L 450 240 Z M 220 220 L 340 180 L 280 270 Z M 120 180 L 50 250 L 150 280 Z"
                fill="url(#dtmGrad)"
                stroke={renderMode === "TIN Mesh" ? "#38bdf8" : "#0284c7"}
                strokeWidth={renderMode === "TIN Mesh" ? "1.5" : "0.5"}
                opacity={renderMode === "Slope" ? "0.9" : "0.75"}
              />

              {/* Contour Overlay Lines */}
              {showContourOverlay && (
                <g stroke="#f87171" strokeWidth="1" fill="none" opacity="0.85">
                  <path d="M 60 230 Q 150 170 250 140 T 450 150 T 520 100" />
                  <path d="M 80 260 Q 180 200 280 170 T 470 180 T 530 130" strokeDasharray="3,3" />
                </g>
              )}

              {/* Points Overlay */}
              {showPointOverlay && (
                <g fill="#38bdf8">
                  <circle cx="50" cy="250" r="3" />
                  <circle cx="120" cy="180" r="3" />
                  <circle cx="220" cy="220" r="3" />
                  <circle cx="250" cy="120" r="3" />
                  <circle cx="380" cy="90" r="3" />
                  <circle cx="340" cy="180" r="3" />
                  <circle cx="480" cy="140" r="3" />
                  <circle cx="520" cy="80" r="3" />
                </g>
              )}
            </svg>

            {/* Terrain Legend Bar */}
            <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-2 rounded-lg text-[10px] space-y-1 font-mono">
              <span className="text-slate-400 font-sans block">Elevasi Spectrum (RL)</span>
              <div className="w-32 h-2.5 rounded bg-gradient-to-r from-sky-600 via-emerald-500 to-amber-500"></div>
              <div className="flex justify-between text-[9px] text-slate-300">
                <span>{selectedDTM.minElevation}m</span>
                <span>{selectedDTM.maxElevation}m</span>
              </div>
            </div>

            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded text-[11px] text-sky-300 border border-sky-500/30 font-mono">
              Mode: {renderMode}
            </div>
          </div>
        </div>

        {/* Right Column: DTM Specifications & Metrics */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span>Spesifikasi DTM Model</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">
                {selectedDTM.status}
              </span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-sans block">DTM Identifier</span>
                <span className="font-bold text-sky-400">{selectedDTM.dtmId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans block">Point Count</span>
                  <span className="font-bold text-white">{selectedDTM.pointCount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans block">Triangles</span>
                  <span className="font-bold text-white">{selectedDTM.triangleCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans block">Resolusi Grid</span>
                  <span className="font-bold text-emerald-400">{selectedDTM.resolutionMeters} Meter</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans block">Cakupan Luas</span>
                  <span className="font-bold text-amber-300">{(selectedDTM.areaSqm / 10000).toFixed(2)} Ha</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-sans block">Rentang Elevasi Vertikal</span>
                <span className="font-bold text-purple-300">{selectedDTM.elevationRange}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Memproses download GIS Raster GeoTIFF / Grid ASCII DTM ${selectedDTM.dtmId}`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download GeoTIFF / DTM Grid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
