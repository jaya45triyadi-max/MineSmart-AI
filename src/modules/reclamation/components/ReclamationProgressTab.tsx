import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Image as ImageIcon,
  Ruler,
} from "lucide-react";
import { ReclamationProject } from "../../../types/reclamationTypes";

interface Props {
  projects: ReclamationProject[];
}

export const ReclamationProgressTab: React.FC<Props> = ({ projects }) => {
  const stages = [
    "Planning & Assessment",
    "Land Preparation",
    "Topsoil Spreading",
    "Land Shaping",
    "Drainage & Erosion Control",
    "Revegetation / Cover Crop",
    "Planting Fast Growing",
    "Maintenance & Fertilization",
    "Monitoring & Survival",
    "Verification & Closure",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Reclamation Progress Engine & Stage Timeline
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kalkulasi tingkat penyelesaian proyek reklamasi (Completion % = Realisasi / Target Area) dan tracking tahapan pekerjaan secara berurutan.
        </p>
      </div>

      {/* Projects Progress List */}
      <div className="space-y-6">
        {projects.map((proj) => {
          const completionPct =
            proj.targetAreaHa > 0
              ? Math.min(100, Math.round((proj.reclaimedAreaHa / proj.targetAreaHa) * 100))
              : 0;

          return (
            <div
              key={proj.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-5"
            >
              {/* Top Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase">
                    {proj.projectId} • {proj.disturbedAreaName}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{proj.projectName}</h3>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Progress Area</span>
                    <strong className="text-emerald-400 text-base font-black">
                      {proj.reclaimedAreaHa} / {proj.targetAreaHa} ha ({completionPct}%)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>

              {/* Workflow Stages Timeline */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tahapan Alur Pekerjaan Reklamasi (Reclamation Workflow):
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 text-center text-[10px]">
                  {stages.map((st, idx) => {
                    const isCompleted = idx < Math.floor((completionPct / 100) * 10);
                    const isCurrent = idx === Math.floor((completionPct / 100) * 10);

                    return (
                      <div
                        key={st}
                        className={`rounded-xl p-2 border flex flex-col justify-between h-20 transition ${
                          isCompleted
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : isCurrent
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-300 animate-pulse"
                            : "border-slate-800 bg-slate-950 text-slate-500"
                        }`}
                      >
                        <span className="font-mono text-[9px] font-bold block opacity-60">Step {idx + 1}</span>
                        <span className="font-semibold line-clamp-2">{st}</span>
                        <span className="font-bold text-[9px] mt-1">
                          {isCompleted ? "✓ DONE" : isCurrent ? "IN PROGRESS" : "PENDING"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Before vs After Photo Visual Mockup */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> kondisi Awal Lahan (Before - Disturbed Area)
                  </span>
                  <div className="h-28 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-600 text-xs italic">
                    [ Foto Udara Drone: Bekas Bukaan Tambang / Dumping Ground Tanpa Tanaman ]
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Kondisi Terkini (After - Reclaimed & Revegetated)
                  </span>
                  <div className="h-28 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    [ Foto Udara Drone: Lahan Terpenuhi Cover Crop &amp; Pohon Sengon Rimbun ]
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
