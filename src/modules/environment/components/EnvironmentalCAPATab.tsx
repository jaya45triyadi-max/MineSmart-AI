import React from "react";
import {
  CheckSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { EnvironmentalCAPA } from "../../../types/environmentTypes";

interface Props {
  capas: EnvironmentalCAPA[];
}

export const EnvironmentalCAPATab: React.FC<Props> = ({ capas }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Environmental Corrective & Preventive Action (CAPA)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Penugasan perbaikan lingkungan, pengerukan sediment pond, pembersihan culvert, tindak lanjut inspeksi & verifikasi penutupan
          </p>
        </div>
      </div>

      {/* CAPA List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capas.map((capa) => (
          <div
            key={capa.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {capa.actionNumber} • Source: {capa.sourceType}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{capa.findingDescription}</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  capa.priority === "HIGH"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {capa.priority} PRIORITY
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 text-xs text-slate-300 space-y-1 border border-slate-800">
              <p><strong className="text-emerald-400">Rencana Perbaikan:</strong> {capa.correctiveAction}</p>
              {capa.verificationNotes && (
                <p><strong className="text-cyan-400">Catatan Verifikasi:</strong> {capa.verificationNotes}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>PIC: <strong className="text-slate-200">{capa.assignedTo} ({capa.department})</strong></span>
              <span className="font-bold text-emerald-400">Status: {capa.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
