import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Send,
  UserCheck,
  ShieldCheck,
  Building,
} from "lucide-react";
import { AttendanceRecordExtended } from "../../../types/attendanceTypes";

interface Props {
  records: AttendanceRecordExtended[];
}

export const OvertimeWorkflowTab: React.FC<Props> = ({ records }) => {
  // Filter records with potential overtime
  const potentialRecords = records.filter(
    (r) => r.potentialOvertimeHours > 0 || r.approvedOvertimeHours > 0
  );

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecordExtended | null>(
    potentialRecords[0] || null
  );
  const [reasonInput, setReasonInput] = useState("Perbaikan darurat komponen hidrolik excavator PC1250 di Pit A");
  const [projectInput, setProjectInput] = useState("Overhaul Major Equipment Pit Tapin");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitOvertimeRequest = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            DETEKSI & VALIDASI LEMBUR (OVERTIME WORKFLOW)
          </span>
          <span className="text-xs text-slate-400">Integrated with HR Overtime Master</span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Deteksi Lembur Otomatis & Alur Persetujuan (Approval)</h2>
        <p className="text-xs text-slate-400">
          Sistem mendeteksi selisih jam pulang melebihi jam shift (Clock Out &gt; Shift End) dan mewajibkan alur pengajuan resmi sebelum dianggap overtime payroll.
        </p>
      </div>

      {/* Grid: Potential List & Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List of Detected Potential Overtimes */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Terdeteksi Potensi Lembur ({potentialRecords.length})</span>
          </h3>

          <div className="space-y-3">
            {potentialRecords.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  selectedRecord?.id === r.id
                    ? "border-amber-500/80 bg-amber-950/30 shadow-lg"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{r.employeeName}</span>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/30">
                    +{r.potentialOvertimeHours} Jam
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {r.departmentName} • {r.date}
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-300">
                  Clock In: {r.clockIn || "-"} | Clock Out: {r.clockOut || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Overtime Request Form & Verification Workflow */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          {selectedRecord ? (
            <>
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pengajuan Lembur Resmi</span>
                  <h3 className="text-base font-black text-white">{selectedRecord.employeeName}</h3>
                  <p className="text-xs text-slate-400">{selectedRecord.positionName} • {selectedRecord.departmentName}</p>
                </div>
                <span className="rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                  Potensi Lembur: {selectedRecord.potentialOvertimeHours} Jam
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Alasan Pengajuan Lembur Operasional</label>
                  <textarea
                    rows={3}
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Proyek / Work Order Terkait</label>
                  <input
                    type="text"
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Workflow Steps Preview */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Alur Approval Berjenjang (Audit Trail)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">1. System Detect</span>
                      <p className="text-xs font-bold text-white">Clock Out &gt; 19:30 WITA</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase">2. Supervisor Review</span>
                      <p className="text-xs font-bold text-white">Menunggu Verifikasi</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">3. HR Final Approved</span>
                      <p className="text-xs font-bold text-slate-500">Sync Payroll HR</p>
                    </div>
                  </div>
                </div>

                {submitted && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300 text-center animate-fade-in">
                    Pengajuan Lembur Berhasil Dikirim ke Supervisor & HR!
                  </div>
                )}

                <button
                  onClick={handleSubmitOvertimeRequest}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-black text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>AJUKAN LEMBUR RESMI KARYAWAN</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-bold text-xs">
              Pilih karyawan dari daftar potensi lembur di samping.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
