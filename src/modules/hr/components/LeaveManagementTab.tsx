import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Clock,
  UserCheck,
} from "lucide-react";
import { LeaveRequest, Employee, LeaveType } from "../../../types/hrTypes";

interface Props {
  leaves: LeaveRequest[];
  employees: Employee[];
  onAddLeaveRequest: (req: Omit<LeaveRequest, "id">) => void;
}

export const LeaveManagementTab: React.FC<Props> = ({
  leaves,
  employees,
  onAddLeaveRequest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [startDate, setStartDate] = useState("2026-08-25");
  const [endDate, setEndDate] = useState("2026-08-28");
  const [durationDays, setDurationDays] = useState(4);
  const [reason, setReason] = useState("Cuti lapangan tahunan Roster Phase III");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    onAddLeaveRequest({
      leaveRequestId: `LV-${Date.now()}`,
      employeeId,
      employeeName: emp?.name || "Karyawan",
      departmentName: emp?.departmentName || "Mining Dept",
      positionName: emp?.positionName || "Operator",
      leaveType,
      startDate,
      endDate,
      durationDays,
      reason,
      status: "APPROVED",
      approverName: emp?.supervisorName || "Ir. Hendra Gunawan",
      approvedAt: new Date().toISOString(),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Leave Management & Roster Leave Approvals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengajuan cuti tahunan, cuti lapangan roster, izin sakit, dan verifikasi persetujuan atasan/KTT.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajukan Cuti Baru
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Permohonan</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Jenis Cuti</th>
                <th className="px-4 py-3">Tanggal Cuti</th>
                <th className="px-4 py-3">Durasi</th>
                <th className="px-4 py-3">Alasan Permohonan</th>
                <th className="px-4 py-3">Status & Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaves.map((lv) => (
                <tr key={lv.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{lv.leaveRequestId}</td>
                  <td className="px-4 py-3 font-bold text-white">
                    {lv.employeeName}
                    <span className="block text-[10px] text-slate-400 font-normal">{lv.departmentName}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-400">{lv.leaveType}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {lv.startDate} s/d {lv.endDate}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{lv.durationDays} Hari</td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{lv.reason}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block w-fit">
                      {lv.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">By: {lv.approverName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Permohonan Cuti */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" /> Form Permohonan Cuti Karyawan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pilih Karyawan</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.employeeId}>
                      {e.name} - {e.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jenis Cuti</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Annual Leave">Annual Leave (Cuti Tahunan)</option>
                    <option value="Sick Leave">Sick Leave (Cuti Sakit)</option>
                    <option value="Personal Leave">Personal Leave (Cuti Khusus)</option>
                    <option value="Maternity Leave">Maternity Leave (Melahirkan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jumlah Durasi (Hari)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Mulai Cuti</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Selesai Cuti</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alasan Permohonan</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  Kirim & Approve Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
