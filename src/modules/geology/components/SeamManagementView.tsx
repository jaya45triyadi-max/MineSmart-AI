// MINE SMART AI - Seam Management & Stratigraphic Correlation

import React, { useState } from "react";
import {
  Flame,
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SeamMaster, SeamIntersection } from "../../../types/geologyTypes";

interface SeamManagementViewProps {
  seamMasters: SeamMaster[];
  seamIntersections: SeamIntersection[];
  onAddSeamIntersection: (seam: SeamIntersection) => void;
}

export const SeamManagementView: React.FC<SeamManagementViewProps> = ({
  seamMasters,
  seamIntersections,
  onAddSeamIntersection,
}) => {
  const [selectedSeamCode, setSelectedSeamCode] = useState<string>("ALL");

  const filteredIntersections = seamIntersections.filter(
    (si) => selectedSeamCode === "ALL" || si.seamCode === selectedSeamCode
  );

  return (
    <div className="space-y-6">
      {/* Master Seams Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seamMasters.map((sm) => (
          <div
            key={sm.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedSeamCode(sm.seamCode)}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sm.colorBadge }}></span>
                  {sm.seamName}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {sm.qualityGrade}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Rata-rata Tebal</span>
                  <span className="font-bold text-emerald-400">{sm.averageThicknessMeters} Meter</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kemiringan (Dip)</span>
                  <span className="font-bold text-white">{sm.dipAngleDeg}° / Direction {sm.dipDirectionDeg}°</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Rank: {sm.coalRank}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>Filter Interseksi</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Seam Intersections Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Interseksi Seam Batubara pada Titik Bor
            </h3>
            <p className="text-xs text-slate-400">
              Menampilkan ketebalan sejati (True Thickness) & elevasi atap/alas (Roof/Floor Elevation)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter Seam:</span>
            <select
              value={selectedSeamCode}
              onChange={(e) => setSelectedSeamCode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Seam</option>
              {seamMasters.map((sm) => (
                <option key={sm.id} value={sm.seamCode}>
                  {sm.seamName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Borehole Code</th>
                <th className="px-4 py-3">Nama Seam</th>
                <th className="px-4 py-3">From - To (m)</th>
                <th className="px-4 py-3 text-right">Apparent Thick</th>
                <th className="px-4 py-3 text-right">True Thick</th>
                <th className="px-4 py-3 text-right">Roof Elev (mRL)</th>
                <th className="px-4 py-3 text-right">Floor Elev (mRL)</th>
                <th className="px-4 py-3 text-center">Status Lab</th>
                <th className="px-4 py-3 text-center">QC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIntersections.map((si) => (
                <tr key={si.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{si.boreholeCode}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-300">{si.seamName}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">
                    {si.fromDepth}m - {si.toDepth}m
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{si.apparentThickness}m</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                    {si.trueThickness}m
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">{si.roofElevation}m</td>
                  <td className="px-4 py-3 text-right font-mono text-white">{si.floorElevation}m</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      {si.qualityStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {si.validationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
