import React from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  CalendarDays,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  MapPin,
  QrCode,
  ShieldAlert,
  Bot,
  ArrowRight,
  Activity,
} from "lucide-react";
import {
  AttendanceKPISummaryExtended,
  AttendanceRecordExtended,
  AttendanceRiskSignal,
  AIAttendanceAnalysis,
  ShiftCoverageItem,
} from "../../../types/attendanceTypes";

interface Props {
  kpi: AttendanceKPISummaryExtended | null;
  records: AttendanceRecordExtended[];
  riskSignals: AttendanceRiskSignal[];
  shiftCoverage: ShiftCoverageItem[];
  aiAnalysis: AIAttendanceAnalysis | null;
  onNavigateTab: (tab: string) => void;
  onSelectRecord?: (record: AttendanceRecordExtended) => void;
}

export const AttendanceCommandCenterTab: React.FC<Props> = ({
  kpi,
  records,
  riskSignals,
  shiftCoverage,
  aiAnalysis,
  onNavigateTab,
  onSelectRecord,
}) => {
  if (!kpi) return null;

  return (
    <div className="space-y-6">
      {/* Top 13 KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Employees */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Karyawan</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{kpi.totalEmployees}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Seluruh Unit Tambang</p>
        </div>

        {/* Expected Today */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Target Shift</span>
            <CalendarDays className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{kpi.expectedToday}</div>
          <p className="text-[10px] text-blue-400 mt-0.5">Scheduled Hari Ini</p>
        </div>

        {/* Present */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hadir (Present)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300">{kpi.presentCount}</div>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">
            {((kpi.presentCount / kpi.expectedToday) * 100).toFixed(1)}% dari target
          </p>
        </div>

        {/* Late */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terlambat (Late)</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">{kpi.lateCount}</div>
          <p className="text-[10px] text-amber-400/80 mt-0.5">&gt; 15 menit Grace Period</p>
        </div>

        {/* Absent */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mangkir (Absent)</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-300">{kpi.absentCount}</div>
          <p className="text-[10px] text-rose-400/80 mt-0.5">Tanpa Keterangan</p>
        </div>

        {/* Attendance Rate */}
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Rate</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300">{kpi.attendanceRate}%</div>
          <p className="text-[10px] text-indigo-400/80 mt-0.5">KPI Target: &gt; 95.0%</p>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Pulang Awal</span>
          <p className="text-base font-bold text-slate-200 mt-0.5">{kpi.earlyLeaveCount} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Cuti / Izin</span>
          <p className="text-base font-bold text-cyan-300 mt-0.5">{kpi.onLeaveCount} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Pelatihan / K3</span>
          <p className="text-base font-bold text-purple-300 mt-0.5">{kpi.trainingCount} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Off Shift / Roster</span>
          <p className="text-base font-bold text-slate-400 mt-0.5">{kpi.offShiftCount} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Active On Site</span>
          <p className="text-base font-bold text-emerald-400 mt-0.5">{kpi.currentlyOnSite} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Potensi Lembur</span>
          <p className="text-base font-bold text-amber-300 mt-0.5">{kpi.overtimeCount} Org</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-center">
          <span className="text-[10px] font-semibold text-slate-400">Pending Correction</span>
          <p className="text-base font-bold text-rose-400 mt-0.5">{kpi.pendingCorrectionsCount} Req</p>
        </div>
      </div>

      {/* AI Attendance Insight Banner */}
      {aiAnalysis && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Bot className="h-32 w-32 text-emerald-400" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
                  AI Attendance Insight & Real-Time Operational Advisory
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab("ai-insight")}
                className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all"
              >
                <span>Lihat Analisis Lengkap AI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ringkasan Temuan</span>
                <p className="text-xs font-semibold text-slate-200">{aiAnalysis.finding}</p>
                <p className="text-[11px] text-slate-400">{aiAnalysis.evidence}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Faktor Penyebab AI</span>
                <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                  {aiAnalysis.possibleCauses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Rekomendasi Aksi</span>
                <p className="text-xs text-emerald-200">{aiAnalysis.recommendation}</p>
                <p className="text-[10px] text-emerald-400/80 mt-1">Impact: {aiAnalysis.expectedImpact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Shift Coverage & Risk Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shift Coverage & Live Presensi Today */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shift Coverage Live Widget */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Shift Coverage & Manpower Gap</h3>
              </div>
              <button
                onClick={() => onNavigateTab("shift")}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                Atur Roster & Shift
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {shiftCoverage.map((sc) => (
                <div
                  key={sc.shiftId}
                  className={`rounded-xl border p-3.5 space-y-2 ${
                    sc.alertLevel === "HIGH" || sc.alertLevel === "CRITICAL"
                      ? "border-amber-500/40 bg-amber-950/20"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{sc.shiftName.split("(")[0]}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        sc.coveragePercent >= 95
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {sc.coveragePercent}% Coverage
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-slate-400">
                    <span>Hadir: <strong className="text-emerald-400">{sc.presentCount}</strong> / {sc.requiredCount}</span>
                    <span>Gap: <strong className={sc.gap > 0 ? "text-amber-400" : "text-emerald-400"}>{sc.gap} Org</strong></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sc.coveragePercent >= 95 ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${Math.min(100, sc.coveragePercent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Presensi Live Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Presensi Terkini Hari Ini</h3>
                <p className="text-xs text-slate-400">Log transaksi masuk/keluar karyawan terverifikasi GPS & QR</p>
              </div>
              <button
                onClick={() => onNavigateTab("records")}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Lihat Semua Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Karyawan</th>
                    <th className="py-2.5 px-3">Shift</th>
                    <th className="py-2.5 px-3">Clock In</th>
                    <th className="py-2.5 px-3">Clock Out</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Sumber & Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {records.slice(0, 5).map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => onSelectRecord && onSelectRecord(r)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-all"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{r.employeeName}</div>
                        <div className="text-[10px] text-slate-400">{r.employeeNumber} • {r.departmentName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-200 font-medium">{r.shiftName}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {r.clockIn ? `${r.clockIn} WITA` : "-"}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {r.clockOut ? `${r.clockOut} WITA` : "-"}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            r.status === "PRESENT"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : r.status === "LATE"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : r.status === "ON_LEAVE"
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          {r.source.includes("QR") ? (
                            <QrCode className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          <span>{r.source}</span>
                          <span className="text-[10px] text-emerald-400 font-medium">({r.verificationStatus})</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Risk Signals & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Action Mobile/Web Clock */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Aksi Cepat Presensi Karyawan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Lakukan Clock In / Clock Out langsung dengan pemindaian QR dan deteksi GPS geofencing.
            </p>
            <button
              onClick={() => onNavigateTab("clock")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Clock className="h-4 w-4" />
              <span>BUKA MODUL CLOCK IN / CLOCK OUT</span>
            </button>
          </div>

          {/* Attendance Risk Signals / Fraud Watch */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Attendance Risk Signals</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {riskSignals.length} Terdeteksi
              </span>
            </div>

            <div className="space-y-3">
              {riskSignals.map((rs) => (
                <div key={rs.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rs.employeeName}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        rs.riskLevel === "HIGH" || rs.riskLevel === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {rs.riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">{rs.riskType.replace(/_/g, " ")}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{rs.evidence}</p>
                  <div className="pt-1 text-[10px] text-amber-400/90 italic">
                    Saran: {rs.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
