import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import { AttendanceKPISummaryExtended, AttendanceRecordExtended } from "../../../types/attendanceTypes";
import { attendanceRepository } from "../../../services/repositories/AttendanceRepository";

interface Props {
  kpi: AttendanceKPISummaryExtended | null;
  records: AttendanceRecordExtended[];
}

export const AttendanceReportsTab: React.FC<Props> = ({ kpi, records }) => {
  const [reportType, setReportType] = useState<"daily" | "monthly">("daily");

  const handleExportDaily = () => {
    attendanceRepository.exportDailyReportCSV();
  };

  const handleExportMonthly = () => {
    attendanceRepository.exportMonthlyReportCSV();
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            AUDITABLE MINING ATTENDANCE REPORTS
          </span>
          <h2 className="text-xl font-black text-white mt-1">Laporan Presensi Harian & Rekap Bulanan Karyawan</h2>
          <p className="text-xs text-slate-400">
            Laporan transparan siap ekspor (PDF, Excel, CSV) sesuai standar compliance audit K3 dan Penggajian ESDM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reportType === "daily" ? handleExportDaily : handleExportMonthly}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor File Excel / CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Printer className="h-4 w-4 text-cyan-400" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setReportType("daily")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === "daily"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Laporan Presensi Harian (Daily Report)</span>
        </button>

        <button
          onClick={() => setReportType("monthly")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === "monthly"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Rekapitulasi Bulanan (Monthly Summary)</span>
        </button>
      </div>

      {/* Transparent Auditable Formula Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-indigo-300 font-bold">
          <Info className="h-4 w-4 text-indigo-400" />
          <span>Auditable Formula Breakdown (Rumus Penghitungan Transparan)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[10px] text-slate-400 font-sans block font-bold">Attendance Rate Formula</span>
            <code className="text-emerald-400 font-bold">
              (Actual Present / Expected Scheduled) × 100%
            </code>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              {kpi?.presentCount} / {kpi?.expectedToday} = <strong className="text-emerald-300">{kpi?.attendanceRate}%</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[10px] text-slate-400 font-sans block font-bold">Net Working Hours Formula</span>
            <code className="text-cyan-400 font-bold">
              (Clock Out - Clock In) - Break Duration
            </code>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Contoh: (19:00 - 07:00) - 1.0 Jam = <strong className="text-cyan-300">11.0 Jam Kerja Net</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Report Content Table */}
      {reportType === "daily" ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">Daily Mining Attendance Sheet - Tapin Site</span>
            <span className="text-xs font-mono text-cyan-400">Date: {new Date().toISOString().split("T")[0]}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Karyawan</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3">Clock In</th>
                  <th className="py-2.5 px-3">Clock Out</th>
                  <th className="py-2.5 px-3">Terlambat</th>
                  <th className="py-2.5 px-3">Jam Kerja Net</th>
                  <th className="py-2.5 px-3">Potensi Lembur</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {records.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-sans font-bold text-white">
                      {r.employeeName}
                      <div className="text-[10px] text-slate-400 font-normal">{r.employeeNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{r.shiftName}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{r.clockIn || "-"}</td>
                    <td className="py-2.5 px-3 text-slate-400">{r.clockOut || "-"}</td>
                    <td className="py-2.5 px-3 text-amber-400">{r.lateMinutes > 0 ? `${r.lateMinutes} Mnt` : "-"}</td>
                    <td className="py-2.5 px-3 text-slate-200">{r.netWorkingHours} Jam</td>
                    <td className="py-2.5 px-3 text-amber-300">{r.potentialOvertimeHours > 0 ? `${r.potentialOvertimeHours} Jam` : "-"}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">Monthly Attendance Summary Matrix - August 2026</span>
            <span className="text-xs font-mono text-emerald-400">Company Period: 2026-08</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">NIK & Karyawan</th>
                  <th className="py-2.5 px-3">Departemen</th>
                  <th className="py-2.5 px-3 text-center">Scheduled</th>
                  <th className="py-2.5 px-3 text-center">Hadir</th>
                  <th className="py-2.5 px-3 text-center">Terlambat</th>
                  <th className="py-2.5 px-3 text-center">Cuti / Izin</th>
                  <th className="py-2.5 px-3 text-center">Jam Lembur</th>
                  <th className="py-2.5 px-3 text-right">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">NIK-2021-001 • Budi Santoso</td>
                  <td className="py-3 px-3">Mining & Operation</td>
                  <td className="py-3 px-3 text-center font-mono">24 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">24 Hari</td>
                  <td className="py-3 px-3 text-center font-mono">0</td>
                  <td className="py-3 px-3 text-center font-mono">0</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-300 font-bold">18.5 Jam</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">100.0%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">NIK-2022-045 • Siti Aminah</td>
                  <td className="py-3 px-3">HSE & Environmental</td>
                  <td className="py-3 px-3 text-center font-mono">24 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">23 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-400">1 Kali</td>
                  <td className="py-3 px-3 text-center font-mono">1 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-300 font-bold">6.0 Jam</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">95.8%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">NIK-2020-012 • Agus Setiawan</td>
                  <td className="py-3 px-3">Mining & Operation</td>
                  <td className="py-3 px-3 text-center font-mono">24 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">22 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-400">3 Kali</td>
                  <td className="py-3 px-3 text-center font-mono">1 Hari</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-300 font-bold">12.0 Jam</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">91.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
