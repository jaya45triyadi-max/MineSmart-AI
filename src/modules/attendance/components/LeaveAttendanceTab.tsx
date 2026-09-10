import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  UserCheck,
  Plane,
  HeartPulse,
  Briefcase,
  Search,
  Filter,
  X,
  Sparkles,
} from "lucide-react";
import { LeaveRequest, Employee, LeaveType } from "../../../types/hrTypes";

interface Props {
  employees: Employee[];
}

export const LeaveAttendanceTab: React.FC<Props> = ({ employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeaveFilter, setSelectedLeaveFilter] = useState("ALL");

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [startDate, setStartDate] = useState("2026-08-20");
  const [endDate, setEndDate] = useState("2026-08-26");
  const [durationDays, setDurationDays] = useState(6);
  const [reason, setReason] = useState("Cuti Lapangan Roster Periode Q3");
  const [replacementName, setReplacementName] = useState("Agus Setiawan (Standby Operator)");

  // Initial Leave Requests Data
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: "lv-1",
      leaveRequestId: "LV-202608-001",
      employeeId: "EMP-005",
      employeeName: "Dewi Lestari",
      departmentName: "Mine Engineering & Survey",
      positionName: "Mine Surveyor Specialist",
      leaveType: "Annual Leave",
      startDate: "2026-08-18",
      endDate: "2026-08-24",
      durationDays: 6,
      reason: "Cuti tahunan dan evaluasi keluarga",
      status: "APPROVED",
      approverName: "Ir. Hendra Gunawan",
      approvedAt: "2026-08-14 10:30",
    },
    {
      id: "lv-2",
      leaveRequestId: "LV-202608-002",
      employeeId: "EMP-003",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      positionName: "Heavy Excavator Operator PC2000",
      leaveType: "Roster Leave",
      startDate: "2026-08-20",
      endDate: "2026-08-22",
      durationDays: 2,
      reason: "Roster off period 6:2",
      status: "APPROVED",
      approverName: "Budi Santoso",
      approvedAt: "2026-08-14 09:15",
    },
    {
      id: "lv-3",
      leaveRequestId: "LV-202608-003",
      employeeId: "EMP-006",
      employeeName: "Rudi Hartono",
      departmentName: "Hauling & Logistics",
      positionName: "Haul Truck HD785 Operator",
      leaveType: "Sick Leave",
      startDate: "2026-08-15",
      endDate: "2026-08-16",
      durationDays: 2,
      reason: "Demam dan fatigue setelah shift malam (Surat Dokter Terlampir)",
      status: "PENDING",
    },
  ]);

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    const newReq: LeaveRequest = {
      id: `lv-${Date.now()}`,
      leaveRequestId: `LV-202608-${Math.floor(100 + Math.random() * 900)}`,
      employeeId,
      employeeName: emp?.name || "Karyawan Tambang",
      departmentName: emp?.departmentName || "Mining & Operation",
      positionName: emp?.positionName || "Operator",
      leaveType,
      startDate,
      endDate,
      durationDays,
      reason: `${reason} (Delegasi: ${replacementName})`,
      status: "APPROVED",
      approverName: "Budi Santoso (Superintendent)",
      approvedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setLeaves([newReq, ...leaves]);
    setIsModalOpen(false);
  };

  const handleApprove = (id: string) => {
    setLeaves(
      leaves.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "APPROVED",
              approverName: "Budi Santoso",
              approvedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
            }
          : l
      )
    );
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: "REJECTED" } : l)));
  };

  const filteredLeaves = leaves.filter((l) => {
    if (selectedLeaveFilter !== "ALL" && l.status !== selectedLeaveFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold text-purple-400 border border-purple-500/30 uppercase tracking-wider">
              LEAVE & ABSENCE MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">Integrated with Roster Availability</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Pengajuan Cuti Lapangan & Izin Sakit Tambang
          </h2>
          <p className="text-xs text-slate-400">
            Kelola pengajuan cuti roster, cuti tahunan, izin sakit (MCU), dan penugasan operator pengganti agar shift coverage tidak terganggu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Ajukan Cuti / Izin Lapangan
        </button>
      </div>

      {/* Leave Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-purple-400 font-bold uppercase">Cuti Tahunan Aktif</span>
          <div className="text-lg font-black text-purple-300 font-mono">18 Karyawan</div>
          <p className="text-[10px] text-slate-400">Annual Leave Terjadwal</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-indigo-400 font-bold uppercase">Cuti Roster Off</span>
          <div className="text-lg font-black text-indigo-300 font-mono">36 Karyawan</div>
          <p className="text-[10px] text-slate-400">Off Site Roster Cycles</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-rose-400 font-bold uppercase">Izin Sakit / Medical</span>
          <div className="text-lg font-black text-rose-300 font-mono">4 Karyawan</div>
          <p className="text-[10px] text-rose-400/80">Klinik Site Tapin Check</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase">Menunggu Approval</span>
          <div className="text-lg font-black text-amber-300 font-mono">
            {leaves.filter((l) => l.status === "PENDING").length} Pengajuan
          </div>
          <p className="text-[10px] text-amber-400/80">Perlu Review SPV/KTT</p>
        </div>
      </div>

      {/* Leave Ledger Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Daftar Pengajuan Cuti & Izin Personel</h3>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedLeaveFilter}
              onChange={(e) => setSelectedLeaveFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Menunggu Persetujuan (Pending)</option>
              <option value="APPROVED">Disetujui (Approved)</option>
              <option value="REJECTED">Ditolak (Rejected)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">No Pengajuan</th>
                <th className="px-4 py-3">Karyawan</th>
                <th className="px-4 py-3">Jenis Cuti / Izin</th>
                <th className="px-4 py-3">Periode Cuti</th>
                <th className="px-4 py-3 text-center">Durasi</th>
                <th className="px-4 py-3">Alasan & Delegasi</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-400">{l.leaveRequestId}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{l.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{l.departmentName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-300">
                      {l.leaveType === "Annual Leave" && <Plane className="h-3.5 w-3.5" />}
                      {l.leaveType === "Sick Leave" && <HeartPulse className="h-3.5 w-3.5 text-rose-400" />}
                      {l.leaveType === "Roster Leave" && <Calendar className="h-3.5 w-3.5 text-indigo-400" />}
                      {l.leaveType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {l.startDate} s/d {l.endDate}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-white">
                    {l.durationDays} Hari
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate" title={l.reason}>
                    {l.reason}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        l.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : l.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(l.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(l.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-[10px] border border-rose-500/30 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {l.approverName || "Verified"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Ajukan Cuti / Izin Lapangan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Karyawan</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.employeeId}>
                      {e.name} ({e.employeeId}) - {e.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Jenis Cuti</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Annual Leave">Cuti Tahunan (Annual Leave)</option>
                  <option value="Roster Leave">Cuti Roster Lapangan (Roster Leave)</option>
                  <option value="Sick Leave">Izin Sakit / Medical Leave</option>
                  <option value="Maternity Leave">Cuti Melahirkan / Bersalin</option>
                  <option value="Unpaid Leave">Cuti Di Luar Tanggungan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Operator Delegasi / Pengganti</label>
                <input
                  type="text"
                  value={replacementName}
                  onChange={(e) => setReplacementName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  placeholder="Nama operator pengganti..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alasan Cuti</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white h-16 resize-none"
                  placeholder="Jelaskan keperluan cuti..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white"
                >
                  Kirim Pengajuan Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
