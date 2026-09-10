import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Sparkles,
  Bot,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import {
  HRKPISummary,
  Employee,
  Certification,
  HRAIInsight,
} from "../../../types/hrTypes";

interface Props {
  kpi: HRKPISummary | null;
  employees: Employee[];
  certifications: Certification[];
  aiInsights: HRAIInsight[];
  onNavigateTab: (tab: string) => void;
  onSelectEmployee: (employee: Employee) => void;
}

export const HRCommandCenterTab: React.FC<Props> = ({
  kpi,
  employees,
  certifications,
  aiInsights,
  onNavigateTab,
  onSelectEmployee,
}) => {
  if (!kpi) return null;

  const expiringCerts = certifications.filter(
    (c) => c.status === "EXPIRING_SOON" || c.status === "EXPIRED"
  );

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total & Active Employees */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total & Active Manpower</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{kpi.totalEmployees}</span>
            <span className="text-xs font-bold text-emerald-400">({kpi.activeEmployees} Aktif)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>On Site: <strong className="text-slate-200">{kpi.employeesOnSite}</strong></span>
            <span>Off Site: <strong className="text-slate-200">{kpi.employeesOffSite}</strong></span>
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tingkat Kehadiran (Attendance)</span>
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">{kpi.attendanceRatePercent}%</span>
            <span className="text-xs font-bold text-slate-400">Presensi Today</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cuti: <strong className="text-amber-400">{kpi.employeesOnLeave} orang</strong></span>
            <span>Absens: <strong className="text-rose-400">{kpi.absenceRatePercent}%</strong></span>
          </div>
        </div>

        {/* Card 3: Certifications & Training */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Sertifikasi & Training</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {kpi.expiringSoonCertificationsCount + kpi.expiredCertificationsCount}
            </span>
            <span className="text-xs font-bold text-slate-400">Perlu Perpanjangan</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Training Due: <strong className="text-purple-300">{kpi.trainingDueCount}</strong></span>
            <span>Training In Prog: <strong className="text-emerald-400">{kpi.employeesOnTraining}</strong></span>
          </div>
        </div>

        {/* Card 4: Overtime & Manpower Utilization */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overtime & Utilisasi</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{kpi.overtimeHoursTotal}</span>
            <span className="text-xs font-bold text-slate-400">Jam Overtime / Bln</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Utilisasi Field: <strong className="text-emerald-400">{kpi.manpowerUtilizationPercent}%</strong></span>
            <span>Open Req: <strong className="text-amber-400">{kpi.openManpowerRequestsCount} pos</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Employees, Certification Warnings & AI HR Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Key Personnel List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Personel Kunci & Karyawan Aktif Tambang
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("employees")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              Lihat Semua Master Karyawan <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{emp.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {emp.employeeId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {emp.positionName} • <strong className="text-slate-300">{emp.departmentName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {emp.employmentType}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">{emp.phone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Expiring Certification Alert Section */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Peringatan Sertifikasi / Lisensi Mendekati Expired:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {expiringCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-xl bg-amber-950/20 border border-amber-800/40 p-3 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cert.employeeName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {cert.status}
                    </span>
                  </div>
                  <p className="text-amber-200/90 font-medium">{cert.name}</p>
                  <p className="text-[10px] text-slate-400">
                    No: {cert.certificateNumber} | Expired: <strong className="text-rose-400">{cert.expiryDate}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI HR Copilot Advisory Panel */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                AI Manpower & HR Risk Advisory
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("ai-insight")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Bot className="h-3.5 w-3.5" /> Copilot
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-emerald-800/30 bg-slate-950 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{insight.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {insight.risk}
                  </span>
                </div>

                <p className="text-slate-300"><strong className="text-emerald-400">Temuan:</strong> {insight.finding}</p>
                <p className="text-slate-400"><strong className="text-cyan-400">Saran AI:</strong> {insight.recommendation}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                  <span>Confidence: {insight.confidence}</span>
                  <span>Impact: {insight.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
