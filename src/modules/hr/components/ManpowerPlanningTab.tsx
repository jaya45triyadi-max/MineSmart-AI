import React from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { ManpowerPlan } from "../../../types/hrTypes";

interface Props {
  plans: ManpowerPlan[];
}

export const ManpowerPlanningTab: React.FC<Props> = ({ plans }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          Workforce Planning, Gap Analysis & Headcount Forecasting
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perencanaan kebutuhan tenaga kerja tambang (MPP), analisis shortage/gap posisi kritis, dan proyeksi bulan depan.
        </p>
      </div>

      {/* MPP Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Matriks Manpower Planning & Defisit Posisi (MPP RKAB ESDM 2026)
          </h3>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            Total Shortage Gap: -5 Personel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Plan</th>
                <th className="px-4 py-3">Departemen</th>
                <th className="px-4 py-3">Jabatan / Posisi</th>
                <th className="px-4 py-3">Target MPP</th>
                <th className="px-4 py-3">Eksisting (Current)</th>
                <th className="px-4 py-3">Gap (Defisit)</th>
                <th className="px-4 py-3">Proyeksi Bln Depan</th>
                <th className="px-4 py-3 text-right">Aksi Rekrutmen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{p.planId}</td>
                  <td className="px-4 py-3 font-semibold text-white">{p.departmentName}</td>
                  <td className="px-4 py-3 text-slate-200">{p.positionName}</td>
                  <td className="px-4 py-3 font-bold text-slate-300">{p.requiredCount} Orang</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{p.currentCount} Orang</td>
                  <td className="px-4 py-3 font-bold text-rose-400">{p.gap} Orang</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold">{p.forecastNextMonth} Orang</td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px]">
                      Buka Job Requisition
                    </button>
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
