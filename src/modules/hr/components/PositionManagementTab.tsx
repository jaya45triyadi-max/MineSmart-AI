import React from "react";
import {
  Briefcase,
  ShieldAlert,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Position } from "../../../types/hrTypes";

interface Props {
  positions: Position[];
}

export const PositionManagementTab: React.FC<Props> = ({ positions }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-emerald-400" />
          Position Management & Job Descriptions Requirements
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Master data jabatan operasional, kualifikasi minimum, syarat sertifikasi K3/alat berat, dan monitoring headcount target.
        </p>
      </div>

      {/* Position Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">
                  {pos.positionId} • {pos.departmentName}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{pos.name}</h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {pos.isCritical && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Posisi Kritis
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {pos.level}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {pos.description}
            </p>

            {/* Requirements Breakdown */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Wajib Sertifikasi:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pos.requiredCertifications.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Wajib Skill & Training:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pos.requiredSkills.concat(pos.requiredTraining).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Headcount Stats */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Pengalaman Min: <strong className="text-slate-200">{pos.minExperienceYears} Tahun</strong></span>
              <span>Headcount: <strong className="text-emerald-400 font-bold">{pos.headcountCurrent} / {pos.headcountTarget} Orang</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
