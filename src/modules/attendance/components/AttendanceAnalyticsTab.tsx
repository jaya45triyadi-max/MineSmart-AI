import React from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  XCircle,
  Users,
  Building,
  Activity,
} from "lucide-react";
import { AttendanceKPISummaryExtended } from "../../../types/attendanceTypes";

interface Props {
  kpi: AttendanceKPISummaryExtended | null;
}

export const AttendanceAnalyticsTab: React.FC<Props> = ({ kpi }) => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-extrabold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
            PREDICTIVE ATTENDANCE ANALYTICS
          </span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Visualisasi Grafis & Tren Kehadiran Tambang</h2>
        <p className="text-xs text-slate-400">
          Analisis perbandingan tren keterlambatan, absenteeism, lembur, serta performa disiplin per divisi & site.
        </p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Rate Trend Bar Visual */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Tren Kehadiran Harian (Weekly Trend)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">Rata-rata: 96.8%</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { day: "Senin", rate: 98.2, late: 2 },
              { day: "Selasa", rate: 97.5, late: 3 },
              { day: "Rabu", rate: 96.8, late: 4 },
              { day: "Kamis", rate: 98.0, late: 2 },
              { day: "Jumat", rate: 94.2, late: 8 },
              { day: "Sabtu", rate: 95.8, late: 5 },
              { day: "Minggu", rate: 97.0, late: 3 },
            ].map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-bold">{d.day}</span>
                  <span className="font-mono">{d.rate}% ({d.late} Terlambat)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Comparison */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Building className="h-4 w-4 text-cyan-400" />
            <span>Perbandingan Kehadiran Per Departemen</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { dept: "Mine Engineering & Survey", rate: 99.1, count: "45/45 Hadir" },
              { dept: "HSE & Environmental", rate: 98.5, count: "34/35 Hadir" },
              { dept: "Plant & Maintenance", rate: 96.2, count: "91/95 Hadir" },
              { dept: "Mining & Operation", rate: 95.4, count: "176/185 Hadir" },
              { dept: "Hauling & Port Logistics", rate: 94.0, count: "56/60 Hadir" },
            ].map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-bold">{dept.dept}</span>
                  <span className="font-mono text-cyan-400">{dept.rate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
