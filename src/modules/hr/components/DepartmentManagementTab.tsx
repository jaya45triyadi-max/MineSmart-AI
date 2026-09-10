import React from "react";
import {
  Building2,
  Users,
  GitFork,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Department } from "../../../types/hrTypes";

interface Props {
  departments: Department[];
}

export const DepartmentManagementTab: React.FC<Props> = ({ departments }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-400" />
          Department Management & Hierarchical Organization Structure
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Struktur hierarki departemen perusahaan tambang, manajer divisi, dan alokasi total manpower per departemen.
        </p>
      </div>

      {/* Organization Chart Visual */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <GitFork className="h-4 w-4 text-emerald-400" /> Diagram Visual Struktur Organisasi (Site Tapin Operational Hierarchy)
        </h3>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center space-y-6">
          {/* Top Level KTT */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-950/40 px-6 py-3 text-center shadow-xl shadow-emerald-500/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Level 1 • Site Management</span>
            <h4 className="font-bold text-white text-sm mt-0.5">Kepala Teknik Tambang (KTT) / Site Manager</h4>
            <span className="text-xs text-slate-300 font-medium block">Ir. Hendra Gunawan, IPM</span>
          </div>

          <div className="w-0.5 h-6 bg-emerald-500/40" />

          {/* Department Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2 hover:border-slate-700 transition shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-400">{dept.departmentId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {dept.employeeCount} Karyawan
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs">{dept.name}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{dept.description}</p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex justify-between items-center">
                  <span>Manager: <strong className="text-slate-200">{dept.managerName || "Pending"}</strong></span>
                  <span className="text-emerald-400 font-bold">{dept.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
