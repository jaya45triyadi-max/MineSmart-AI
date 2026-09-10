// MINE SMART AI - Geological Visualization Center (Cross-Section & GIS Spatial Profiles)

import React, { useState } from "react";
import {
  Eye,
  Layers,
  MapPin,
  Ruler,
  Compass,
  Download,
  Printer,
  Sliders,
  Flame,
  Maximize2,
} from "lucide-react";
import { Borehole, LithologyRecord, SeamIntersection, Collar } from "../../../types/geologyTypes";

interface GeologicalVisualizationViewProps {
  boreholes: Borehole[];
  collars: Collar[];
  lithologies: LithologyRecord[];
  seams: SeamIntersection[];
}

export const GeologicalVisualizationView: React.FC<GeologicalVisualizationViewProps> = ({
  boreholes,
  collars,
  lithologies,
  seams,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<"CROSS_SECTION" | "BOREHOLE_MAP">("CROSS_SECTION");
  const [verticalReference, setVerticalReference] = useState<"ELEVATION" | "DEPTH">("ELEVATION");

  const orderedBoreholeCodes = ["BH-SGT-001", "BH-SGT-002", "BH-SGT-003"];

  return (
    <div className="space-y-6">
      {/* View Switcher & Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Geological Visualization Center</h3>
            <p className="text-xs text-slate-400">
              Visualisasi Penampang Stratigrafi (Cross Section) & Pemetaan Borehole GIS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggles */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveViewMode("CROSS_SECTION")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "CROSS_SECTION"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Cross Section 2D</span>
            </button>
            <button
              onClick={() => setActiveViewMode("BOREHOLE_MAP")}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "BOREHOLE_MAP"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Spatial Map</span>
            </button>
          </div>

          {activeViewMode === "CROSS_SECTION" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Vertical Ref:</span>
              <select
                value={verticalReference}
                onChange={(e) => setVerticalReference(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="ELEVATION">Elevasi (mRL)</option>
                <option value="DEPTH">Kedalaman (m Depth)</option>
              </select>
            </div>
          )}

          <button
            onClick={() => alert("Mengunduh gambar penampang geologi tinggi (PNG/PDF)...")}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Export Image/PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cross Section Canvas View */}
      {activeViewMode === "CROSS_SECTION" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Geological Cross Section Line A-A' (Pit 1 South Dip Section)
            </h4>
            <span className="text-xs text-emerald-400 font-mono">
              Boreholes: {orderedBoreholeCodes.join(" ➔ ")} (Jarak: 510 meter)
            </span>
          </div>

          {/* Graphical Section Canvas */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-6 min-h-[450px] relative overflow-x-auto flex items-end justify-around gap-12">
            {orderedBoreholeCodes.map((code, idx) => {
              const bh = boreholes.find((b) => b.boreholeCode === code);
              const col = collars.find((c) => c.boreholeCode === code);
              const bhSeams = seams.filter((s) => s.boreholeCode === code);

              return (
                <div key={code} className="flex flex-col items-center relative group min-w-[120px]">
                  {/* Top Borehole Header Badge */}
                  <div className="mb-2 text-center">
                    <span className="text-xs font-bold text-white block">{code}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {col ? `Elev: ${col.elevation}mRL` : "Elev: 85m"}
                    </span>
                  </div>

                  {/* Vertical Drillhole Pillar */}
                  <div className="w-6 bg-slate-800 rounded-t border border-slate-700 relative h-72 flex flex-col justify-start overflow-hidden shadow-inner">
                    {/* Seam Sangatta B */}
                    <div className="w-full bg-sky-500/80 my-4 h-6 border-y border-sky-300 relative">
                      <span className="text-[8px] font-bold text-slate-900 absolute inset-0 flex items-center justify-center">
                        Seam B
                      </span>
                    </div>

                    {/* Interburden */}
                    <div className="w-full bg-slate-700/60 my-2 h-16"></div>

                    {/* Seam Sangatta A (Main Seam) */}
                    <div className="w-full bg-emerald-500/90 h-16 border-y border-emerald-300 relative shadow-lg">
                      <span className="text-[9px] font-bold text-slate-950 absolute inset-0 flex items-center justify-center font-mono">
                        Seam A (12m)
                      </span>
                    </div>
                  </div>

                  {/* Bottom Depth Badge */}
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    Depth: {bh ? bh.actualDepth : 175}m
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-300 border-t border-slate-800/80">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Seam Sangatta A (Main Floor)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-400"></span>
              <span>Seam Sangatta B (Upper Seam)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-700"></span>
              <span>Interburden / Waste Rock</span>
            </span>
          </div>
        </div>
      )}

      {/* Spatial Borehole Map View */}
      {activeViewMode === "BOREHOLE_MAP" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Distribusi Peta Titik Bor (Spatial Borehole Location)
          </h4>

          <div className="w-full h-96 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Grid background simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>

            {/* Drillhole Pins on Map */}
            {collars.map((col, idx) => (
              <div
                key={col.id}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{
                  left: `${25 + idx * 22}%`,
                  top: `${30 + (idx % 2) * 25}%`,
                }}
              >
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-900/50">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 mt-1">
                  {col.boreholeCode}
                </span>

                {/* Hover Tooltip Popup */}
                <div className="hidden group-hover:block absolute bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-[11px] text-slate-200 shadow-xl w-48 z-20">
                  <span className="font-bold text-emerald-400 block">{col.boreholeCode}</span>
                  <span>Easting: {col.easting}</span>
                  <br />
                  <span>Northing: {col.northing}</span>
                  <br />
                  <span>Elev: {col.elevation}mRL</span>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 backdrop-blur">
              <span className="font-bold text-white block mb-1">Peta Lokasi Bor Pit 1 South</span>
              <span>Proyeksi: UTM Zone 50S (WGS84)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
