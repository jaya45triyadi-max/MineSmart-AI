import React, { useState } from "react";
import {
  AlertTriangle,
  Clock,
  FileCheck,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import {
  AttendanceException,
  AttendanceCorrection,
  CorrectionReason,
} from "../../../types/attendanceTypes";

interface Props {
  exceptions: AttendanceException[];
  corrections: AttendanceCorrection[];
  onSubmitCorrection: (data: Omit<AttendanceCorrection, "id" | "requestNumber" | "status" | "createdAt" | "updatedAt">) => Promise<void>;
}

export const AttendanceExceptionsTab: React.FC<Props> = ({
  exceptions,
  corrections,
  onSubmitCorrection,
}) => {
  const [activeTab, setActiveTab] = useState<"exceptions" | "corrections">("exceptions");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Form State
  const [empId, setEmpId] = useState("EMP-015");
  const [empName, setEmpName] = useState("Samsul Bahri");
  const [deptName, setDeptName] = useState("Plant & Maintenance");
  const [dateStr, setDateStr] = useState("2026-08-13");
  const [shiftName, setShiftName] = useState("Shift 1 - Day Shift");
  const [reqIn, setReqIn] = useState("06:55");
  const [reqOut, setReqOut] = useState("19:05");
  const [reason, setReason] = useState<CorrectionReason>("FORGOT_CLOCK_IN");
  const [explanation, setExplanation] = useState("Lupa melambaikan QR scan saat pulang karena ada perbaikan emergency excavator di pit.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitCorrection({
      employeeId: empId,
      employeeName: empName,
      departmentName: deptName,
      date: dateStr,
      shiftName,
      originalClockIn: "06:55",
      originalClockOut: undefined,
      requestedClockIn: reqIn,
      requestedClockOut: reqOut,
      reason,
      explanation,
    });
    setShowRequestModal(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-400 border border-rose-500/30 uppercase tracking-wider">
            EXCEPTION & CORRECTION CENTER
          </span>
          <h2 className="text-xl font-black text-white mt-1">Pusat Anomali Presensi & Pengajuan Koreksi</h2>
          <p className="text-xs text-slate-400">
            Deteksi otomatis transaksi presensi abnormal (Missing Clock Out, Terlambat, Geofence Failure) dan alur pengajuan koreksi resmi.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Ajukan Koreksi Presensi</span>
        </button>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("exceptions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "exceptions"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <span>Anomali Terdeteksi System ({exceptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("corrections")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "corrections"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <FileCheck className="h-4 w-4 text-emerald-400" />
          <span>Pengajuan Koreksi ({corrections.length})</span>
        </button>
      </div>

      {/* Tab 1: Exceptions List */}
      {activeTab === "exceptions" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Karyawan & NIK</th>
                  <th className="py-3 px-4">Jenis Anomali</th>
                  <th className="py-3 px-4">Tanggal & Shift</th>
                  <th className="py-3 px-4">Tingkat Keparahan</th>
                  <th className="py-3 px-4">Deskripsi Temuan System</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {exceptions.map((exc) => (
                  <tr key={exc.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {exc.employeeName}
                      <div className="text-[10px] text-slate-400 font-normal">{exc.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{exc.exceptionType}</td>
                    <td className="py-3.5 px-4">
                      <div>{exc.date}</div>
                      <div className="text-[10px] text-slate-400">{exc.shiftName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          exc.severity === "HIGH" || exc.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {exc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">{exc.description}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {exc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Corrections List */}
      {activeTab === "corrections" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">No Request</th>
                  <th className="py-3 px-4">Karyawan</th>
                  <th className="py-3 px-4">Tanggal & Shift</th>
                  <th className="py-3 px-4">Jam Diminta</th>
                  <th className="py-3 px-4">Alasan & Penjelasan</th>
                  <th className="py-3 px-4">Status Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {corrections.map((corr) => (
                  <tr key={corr.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{corr.requestNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {corr.employeeName}
                      <div className="text-[10px] text-slate-400 font-normal">{corr.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{corr.date}</div>
                      <div className="text-[10px] text-slate-400">{corr.shiftName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      In: {corr.requestedClockIn} | Out: {corr.requestedClockOut}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-200">{corr.reason}</div>
                      <p className="text-[10px] text-slate-400 truncate">{corr.explanation}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          corr.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : corr.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {corr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Form Pengajuan Koreksi Presensi</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Karyawan</label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Tanggal Tanggal Presensi</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Jam Clock In Diminta</label>
                  <input
                    type="text"
                    value={reqIn}
                    onChange={(e) => setReqIn(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Jam Clock Out Diminta</label>
                  <input
                    type="text"
                    value={reqOut}
                    onChange={(e) => setReqOut(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Kategori Alasan Kendala</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as CorrectionReason)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                >
                  <option value="FORGOT_CLOCK_IN">Lupa Clock In / Clock Out</option>
                  <option value="DEVICE_PROBLEM">Kendala Perangkat Mobile / Ponsel Rusak</option>
                  <option value="GPS_PROBLEM">Sinyal GPS / Satelit Hilang</option>
                  <option value="QR_PROBLEM">Barcode Scanner Layar Buram</option>
                  <option value="OTHER">Alasan Operasional Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Penjelasan & Bukti Pendukung</label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all"
              >
                KIRIM PENGAJUAN KOREKSI UNTUK APPROVAL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
