import React from "react";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Skill, EmployeeSkill } from "../../../types/hrTypes";

interface Props {
  skills: Skill[];
  employeeSkills: EmployeeSkill[];
}

export const SkillManagementTab: React.FC<Props> = ({ skills, employeeSkills }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-400" />
          Skill Management & Verified Employee Skill Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Invetarisasi keahlian teknis (operasional, maintenance, K3), verifikasi level kompetensi karyawan, dan Skill Gap Analysis.
        </p>
      </div>

      {/* Skills Master Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((sk) => (
          <div
            key={sk.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-emerald-400">{sk.skillId}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {sk.category}
              </span>
            </div>

            <h3 className="font-bold text-white text-xs">{sk.name}</h3>
            <p className="text-[11px] text-slate-400 leading-snug">{sk.description}</p>
          </div>
        ))}
      </div>

      {/* Verified Employee Skill Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Matriks Skill Karyawan Terverifikasi (Employee Skill Ledger)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Skill</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Nama Skill</th>
                <th className="px-4 py-3">Level Kompetensi</th>
                <th className="px-4 py-3">Status Verifikasi</th>
                <th className="px-4 py-3">Diverifikasi Oleh</th>
                <th className="px-4 py-3">Tgl Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employeeSkills.map((es) => (
                <tr key={es.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{es.employeeSkillId}</td>
                  <td className="px-4 py-3 font-bold text-white">{es.employeeName}</td>
                  <td className="px-4 py-3 text-slate-200">{es.skillName}</td>
                  <td className="px-4 py-3 font-bold text-cyan-400">{es.level}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{es.verifiedBy}</td>
                  <td className="px-4 py-3 text-slate-400">{es.verificationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
