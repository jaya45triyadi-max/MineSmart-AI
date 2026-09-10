import React from "react";
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  FileText,
} from "lucide-react";
import { EnvironmentalIncident } from "../../../types/environmentTypes";

interface Props {
  incidents: EnvironmentalIncident[];
}

export const EnvironmentalIncidentsTab: React.FC<Props> = ({ incidents }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Environmental Incident & Spill Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pelaporan insiden lingkungan, tumpahan B3, luapan air keruh, investigasi & tindakan lokalisasi darurat (Containment)
          </p>
        </div>
      </div>

      {/* Incidents Register */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {inc.incidentNumber}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{inc.incidentType}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{inc.locationName}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  inc.severity === "MINOR"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {inc.severity}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

            <div className="rounded-xl bg-slate-950 p-3 text-xs text-slate-300 space-y-1 border border-slate-800">
              <p><strong className="text-emerald-400">Tindakan Langsung:</strong> {inc.immediateAction}</p>
              <p><strong className="text-cyan-400">Status Lokalisasi:</strong> {inc.containmentStatus}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Waktu Kejadian: {inc.incidentDate}</span>
              <span className="font-bold text-slate-200">Status: {inc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
