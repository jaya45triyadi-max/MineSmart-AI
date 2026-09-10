import React from "react";
import {
  Award,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { SuccessionReadiness } from "../../../types/hrTypes";

interface Props {
  readiness: SuccessionReadiness[];
}

export const CompetencyReadinessTab: React.FC<Props> = ({ readiness }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-400" />
          Competency Matrix & Succession Replacement Readiness
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analisis kesiapan kandidat suksesi untuk posisi kunci (KTT, Production Supervisor) dan kesesuaian sertifikasi POP/POM.
        </p>
      </div>

      {/* Succession Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readiness.map((succ) => (
          <div key={succ.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Target Posisi Kunci</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{succ.positionName}</h3>
                <p className="text-[11px] text-slate-400">Pemegang Jabatan Saat Ini: <strong className="text-slate-200">{succ.currentHolderName}</strong></p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {succ.readiness}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Kandidat Suksesi Utama</span>
              <h4 className="font-bold text-white text-xs">{succ.candidateName}</h4>

              <div className="space-y-1.5 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Kesesuaian Skill:</span>
                    <strong className="text-emerald-400">{succ.skillMatchPercent}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-emerald-500" style={{ width: `${succ.skillMatchPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Kesesuaian Sertifikasi K3:</span>
                    <strong className="text-amber-400">{succ.certMatchPercent}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-amber-500" style={{ width: `${succ.certMatchPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
