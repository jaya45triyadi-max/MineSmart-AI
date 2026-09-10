import React from "react";
import {
  Mountain,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Ruler,
  Calendar,
  Sparkles,
} from "lucide-react";
import { SedimentPond, SedimentPondInspection } from "../../../types/environmentTypes";

interface Props {
  sedimentPonds: SedimentPond[];
  inspections: SedimentPondInspection[];
}

export const SedimentPondTab: React.FC<Props> = ({ sedimentPonds, inspections }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Sedimentation Pond & Settling Basin Control
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan kolam pengendapan sedimen (Kompartemen 1-4), elevasi lumpur, freeboard & jadwal pengerukan (dredging)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4" /> 1 Pond Memerlukan Dredging
          </span>
        </div>
      </div>

      {/* Sediment Ponds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sedimentPonds.map((pond) => (
          <div
            key={pond.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {pond.pondId}
                </span>
                <h3 className="font-bold text-white text-base mt-0.5">{pond.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{pond.locationName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  pond.status === "NORMAL"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {pond.status}
              </span>
            </div>

            {/* Capacity Progress Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Okupansi Kapasitas Terisi</span>
                <span className="font-bold text-amber-400">{pond.capacityOccupiedPercent}% Occupied</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pond.capacityOccupiedPercent > 75 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${pond.capacityOccupiedPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                Kapasitas Desain: {pond.designCapacityM3.toLocaleString()} m³
              </p>
            </div>

            {/* Metric Gauges */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Volume Air</span>
                <span className="font-bold text-cyan-400 text-sm mt-0.5 block">
                  {pond.currentWaterVolumeM3.toLocaleString()} m³
                </span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Sedimen Lumpur</span>
                <span className="font-bold text-amber-400 text-sm mt-0.5 block">
                  {pond.currentSedimentVolumeM3.toLocaleString()} m³
                </span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Freeboard Sisa</span>
                <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                  {pond.freeboardMeter} Meter
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sediment Inspections Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h3 className="font-bold text-white text-sm">
          Hasil Inspeksi Elevasi Lumpur & Rekomendasi Pengerukan
        </h3>

        <div className="space-y-3">
          {inspections.map((spi) => (
            <div
              key={spi.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{spi.pondName}</span>
                <span className="text-slate-400 text-[11px]">
                  {spi.date} • Inspector: {spi.inspectorName}
                </span>
              </div>

              <p className="text-slate-300">{spi.remarks}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Elevasi Sedimen: <strong className="text-amber-400">{spi.sedimentLevel}m</strong></span>
                <span>TSS Outfall: <strong className="text-cyan-400">{spi.tssValue} mg/L</strong></span>
                <span>pH: <strong className="text-emerald-400">{spi.phValue}</strong></span>
                <span>Status Dredging: <strong className="text-amber-400 font-bold">{spi.dredgingRequired ? "DREDGING REQUIRED" : "NORMAL"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
