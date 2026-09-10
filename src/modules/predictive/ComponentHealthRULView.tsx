// MINE SMART AI - Component Health & Remaining Useful Life (RUL) View

import React from "react";
import {
  Layers,
  Activity,
  Clock,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ComponentHealth } from "../../types/predictiveTypes";

interface ComponentHealthRULViewProps {
  componentHealthList: ComponentHealth[];
  onOpenAIAssistant: () => void;
}

export const ComponentHealthRULView: React.FC<ComponentHealthRULViewProps> = ({
  componentHealthList,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            <span>Component Health & Remaining Useful Life (RUL) Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimasi sisa umur pakai komponen utama (RUL) berbasis distribusi Weibull dan analisa partikel keausan oli.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis RUL Komponen</span>
        </button>
      </div>

      {/* RUL Safety Notice */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>
          Jika telemetri atau data historis komponen belum memadai, indikator RUL akan menampilkan <strong>RUL unavailable</strong> secara jujur untuk menjaga integritas data.
        </span>
      </div>

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {componentHealthList.map((ch) => (
          <div
            key={ch.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-base">{ch.unitCode}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {ch.category}
                  </span>
                </div>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mt-1">{ch.componentName}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Health Score</span>
                <span
                  className={`text-xl font-black ${
                    ch.healthScore < 40 ? "text-rose-500" : ch.healthScore < 70 ? "text-amber-500" : "text-emerald-500"
                  }`}
                >
                  {ch.healthScore} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">OPERATING HOURS</span>
                <span className="font-bold text-slate-900 dark:text-white">{ch.operatingHours.toLocaleString()} SMU</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">EXPECTED LIFE</span>
                <span className="font-bold text-slate-900 dark:text-white">{ch.expectedLifeHours.toLocaleString()} SMU</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">REMAINING USEFUL LIFE</span>
                {ch.isRulAvailable && ch.remainingUsefulLifeHours !== null ? (
                  <span className="font-black text-emerald-500">{ch.remainingUsefulLifeHours} SMU</span>
                ) : (
                  <span className="font-bold text-slate-400 italic">RUL unavailable</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs pt-1">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400">Last Service: {ch.lastMaintenanceDate}</p>
                <p className="text-[10px] text-amber-500 font-semibold">Next Inspection: {ch.nextInspectionDue}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase ${
                    ch.failureRisk === "Critical"
                      ? "bg-rose-500/20 text-rose-500"
                      : ch.failureRisk === "High"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-emerald-500/20 text-emerald-500"
                  }`}
                >
                  {ch.failureRisk} RISK
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
