import React from "react";
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  UserCheck,
  Building2,
  Wrench,
} from "lucide-react";
import { DrainagePoint, DrainageInspection } from "../../../types/environmentTypes";

interface Props {
  drainagePoints: DrainagePoint[];
  inspections: DrainageInspection[];
}

export const DrainageManagementTab: React.FC<Props> = ({
  drainagePoints,
  inspections,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-teal-400" />
            <h2 className="text-lg font-bold text-white">
              Drainage System & Runoff Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan saluran drainase perimeter, culvert crossing, sump pit & inspeksi pencegahan erosi limpasan
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-400 border border-teal-500/20 self-start sm:self-auto">
          {drainagePoints.length} Titik Drainase Aktif
        </span>
      </div>

      {/* Points & Culverts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drainagePoints.map((dp) => (
          <div
            key={dp.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  {dp.drainageId}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{dp.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{dp.locationName}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  dp.status === "NORMAL"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {dp.status}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p><strong className="text-slate-400">Tipe:</strong> {dp.type}</p>
              <p><strong className="text-slate-400">Kapasitas Desain:</strong> {dp.capacityM3s} m³/s</p>
              <p><strong className="text-slate-400">PJ Lapangan:</strong> {dp.responsiblePerson}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Inspeksi Terakhir: {dp.lastInspectionDate}</span>
              <span>Frekuensi: {dp.inspectionFrequency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Drainage Inspections Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h3 className="font-bold text-white text-sm">
          Log Hasil Inspeksi Drainase & Penyumbatan
        </h3>

        <div className="space-y-3">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{insp.drainageName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      insp.overallCondition === "NORMAL"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {insp.overallCondition}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  {insp.inspectionDate} • Inspector: {insp.inspectorName}
                </span>
              </div>

              <p className="text-slate-300">{insp.notes}</p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Blockage: <strong className={insp.hasBlockage ? "text-amber-400" : "text-emerald-400"}>{insp.hasBlockage ? "YA" : "TIDAK"}</strong></span>
                <span>Erosi: <strong className="text-slate-200">{insp.hasErosion ? "YA" : "TIDAK"}</strong></span>
                <span>Sedimentasi: <strong className="text-slate-200">{insp.hasSedimentation ? "YA" : "TIDAK"}</strong></span>
                {insp.capaId && (
                  <span className="text-amber-400 font-semibold">CAPA Ref: {insp.capaId}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
