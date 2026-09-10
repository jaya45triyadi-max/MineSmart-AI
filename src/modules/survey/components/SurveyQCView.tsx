// MINE SMART AI - Survey Quality Control, Benchmark & Instrument Audit

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Compass,
  Wrench,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  SurveyQCIssue,
  SurveyControlPoint,
  SurveyEquipment,
} from "../../../types/surveyTypes";

interface SurveyQCViewProps {
  qcIssues: SurveyQCIssue[];
  controlPoints: SurveyControlPoint[];
  equipment: SurveyEquipment[];
  onResolveIssue: (id: string) => void;
  onRunScanner: () => void;
}

export const SurveyQCView: React.FC<SurveyQCViewProps> = ({
  qcIssues,
  controlPoints,
  equipment,
  onResolveIssue,
  onRunScanner,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Survey Quality Control, Benchmark (GCP) & Audit Alat
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemeriksaan otomatis kelaikan data ukur, spike elevasi Z, duplikasi titik, keabsahan Bench Mark, dan sertifikat kalibrasi instrumen.
          </p>
        </div>

        <button
          onClick={onRunScanner}
          className="px-3.5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-900/30"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Jalankan Scan QC Ulang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detected Issues */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Isu Kualitas Data & Peringatan ({qcIssues.length})
            </span>
          </h3>

          <div className="space-y-3">
            {qcIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border space-y-2 text-xs ${
                  issue.severity === "CRITICAL"
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                    : "bg-amber-950/20 border-amber-500/40 text-amber-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {issue.issueType}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-black/40 rounded border border-white/10">
                    {issue.entityCode}
                  </span>
                </div>

                <p className="text-slate-300">{issue.description}</p>

                <div className="p-2.5 bg-black/30 rounded-lg border border-white/10 text-[11px] text-slate-300">
                  <strong className="text-sky-300">Saran Tindakan:</strong> {issue.suggestedAction}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onResolveIssue(issue.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-[11px] transition-colors cursor-pointer"
                  >
                    Tandai Selesai / Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Control Points GCP & Instrument Calibration */}
        <div className="space-y-6">
          {/* Ground Control Points Master */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                Titik Ikat Utama (Bench Mark / GCP)
              </span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {controlPoints.map((cp) => (
                <div key={cp.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-sky-400">{cp.pointCode}</span>
                    <span className="text-emerald-400">{cp.accuracy}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    E: {cp.easting} | N: {cp.northing} | Z: {cp.elevation}m RL
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    Diverifikasi: {cp.verifiedDate} oleh {cp.verifiedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Instruments Calibration */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-400" />
                Status Alat & Kalibrasi ({equipment.length})
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              {equipment.map((eq) => (
                <div key={eq.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{eq.model}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded font-mono ${
                        eq.status === "Ready" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {eq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">S/N: {eq.serialNumber}</p>
                  <p className="text-[11px] text-amber-300 font-mono">
                    Kalibrasi Berikutnya: {eq.nextCalibrationDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
