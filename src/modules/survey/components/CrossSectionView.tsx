// MINE SMART AI - Cross Section & Surface Profile Visualizer

import React, { useState } from "react";
import {
  Ruler,
  Sliders,
  Eye,
  Download,
  CheckCircle2,
  TrendingUp,
  Maximize2,
  Layers,
} from "lucide-react";
import { CrossSection, SurveySurface } from "../../../types/surveyTypes";

interface CrossSectionViewProps {
  sections: CrossSection[];
  surfaces: SurveySurface[];
}

export const CrossSectionView: React.FC<CrossSectionViewProps> = ({ sections, surfaces }) => {
  const [selectedSection, setSelectedSection] = useState<CrossSection>(sections[0]);
  const [verticalExag, setVerticalExag] = useState<number>(2); // 2x preset

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-sky-400" />
            Survey Cross Section & Profile Comparison Tool
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Irisan melintang profil tambang, pembandingan profil permukaan eksisting vs desain vs kemajuan aktual.
          </p>
        </div>

        {/* Vertical Exaggeration Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Exaggeration Vertikal:</span>
          {[1, 2, 5, 10].map((ex) => (
            <button
              key={ex}
              onClick={() => setVerticalExag(ex)}
              className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                verticalExag === ex
                  ? "bg-sky-600 text-white shadow"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {ex}x
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Chart Canvas Representation */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">{selectedSection.sectionName}</h3>
              <p className="text-[11px] text-slate-400">
                Azimuth: {selectedSection.azimuthDeg}° | Lebar Irisan: {selectedSection.sectionWidthMeters}m
              </p>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 rounded font-mono">
              Skala Vertikal {verticalExag}x
            </span>
          </div>

          {/* Profile SVG Visual Canvas */}
          <div className="w-full h-[320px] bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex flex-col justify-between">
            {/* SVG Profile Lines */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 220">
              {/* Grid Horizontal RL lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#334155" strokeDasharray="3,3" />
              <text x="5" y="35" fill="#94a3b8" fontSize="9" fontFamily="monospace">140m RL</text>

              <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3,3" />
              <text x="5" y="95" fill="#94a3b8" fontSize="9" fontFamily="monospace">80m RL</text>

              <line x1="0" y1="160" x2="500" y2="160" stroke="#334155" strokeDasharray="3,3" />
              <text x="5" y="155" fill="#94a3b8" fontSize="9" fontFamily="monospace">20m RL</text>

              {/* Design Surface Profile Line (Green) */}
              <polyline
                points="30,35 120,80 220,120 320,160 420,190 480,200"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />

              {/* Existing Surface Profile Line (Sky Blue) */}
              <polyline
                points="30,35 120,65 220,95 320,135 420,160 480,180"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
              />

              {/* Shaded Area between existing and design (Cut Area) */}
              <polygon
                points="30,35 120,65 220,95 320,135 420,160 480,180 480,200 420,190 320,160 220,120 120,80 30,35"
                fill="#38bdf8"
                opacity="0.2"
              />
            </svg>

            {/* Profile Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-sky-400">
                <span className="w-3 h-0.5 bg-sky-400"></span> Surface Eksisting (SURF-2026-08)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-3 h-0.5 bg-emerald-400 border-dashed"></span> Surface Desain Pit (Ultimate)
              </span>
              <span className="text-amber-300 font-mono">Area Terpotong (Cut)</span>
            </div>
          </div>

          {/* Section Points Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold font-mono border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2">Jarak (m)</th>
                  <th className="px-3 py-2 text-right">Eksisting RL (m)</th>
                  <th className="px-3 py-2 text-right">Desain RL (m)</th>
                  <th className="px-3 py-2 text-right">Selisih Cut/Fill (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {selectedSection.pointsData.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="px-3 py-2 text-white font-bold">{pt.distance} m</td>
                    <td className="px-3 py-2 text-right text-sky-400 font-bold">{pt.existingElevation.toFixed(1)}m</td>
                    <td className="px-3 py-2 text-right text-emerald-400 font-bold">{pt.designElevation?.toFixed(1)}m</td>
                    <td className="px-3 py-2 text-right text-amber-300 font-bold">+{pt.cutFillDiff?.toFixed(1)}m Cut</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Section Controls & Specs */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span>Garis Penampang Berizin</span>
            </h3>

            <div className="space-y-3">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSection(sec)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedSection.id === sec.id
                      ? "bg-slate-950 border-sky-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{sec.sectionName}</span>
                    <span className="font-mono text-sky-400">{sec.sectionId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Start: ({sec.startPoint.easting}, {sec.startPoint.northing})
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert(`Sistem menyiapkan export profil cross-section ${selectedSection.sectionId} ke format DXF / CSV`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Cross Section DXF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
