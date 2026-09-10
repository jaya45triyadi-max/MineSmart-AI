import React, { useState } from "react";
import {
  Clock,
  Plus,
  X,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { OvertimeRecord, Employee } from "../../../types/hrTypes";

interface Props {
  overtime: OvertimeRecord[];
  employees: Employee[];
  onAddOvertime: (ot: Omit<OvertimeRecord, "id">) => void;
}

export const OvertimeManagementTab: React.FC<Props> = ({
  overtime,
  employees,
  onAddOvertime,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [date, setDate] = useState("2026-08-14");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("22:00");
  const [durationHours, setDurationHours] = useState(3.0);
  const [reason, setReason] = useState("Breakdown Darurat Hydraulic EX-08");
  const [project, setProject] = useState("Unscheduled Emergency Maintenance");

  const totalOvertimeHours = overtime.reduce((sum, o) => sum + o.durationHours, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    onAddOvertime({
      overtimeId: `OT-${Date.now()}`,
      employeeId,
      employeeName: emp?.name || "Karyawan",
      departmentName: emp?.departmentName || "Plant Maintenance",
      date,
      startTime,
      endTime,
      durationHours,
      reason,
      project,
      supervisorName: emp?.supervisorName || "Dedy Kurniawan, ST",
      status: "APPROVED",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Overtime Management, Hours Calculation & Project Allocation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengajuan lembur operasional tambang, kalkulasi jam lembur, dan alokasi cost center ke Finance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajukan Lembur (SPL)
        </button>
      </div>

      {/* Summary Stats */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Total Akumulasi Lembur Terverifikasi</span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{totalOvertimeHours.toFixed(1)} Jam Lembur</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Budget Status: OK (Within Threshold)
        </span>
      </div>

      {/* Overtime Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID SPL</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Tanggal & Jam Lembur</th>
                <th className="px-4 py-3">Durasi</th>
                <th className="px-4 py-3">Proyek / Alasan Lembur</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {overtime.map((ot) => (
                <tr key={ot.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{ot.overtimeId}</td>
                  <td className="px-4 py-3 font-bold text-white">
                    {ot.employeeName}
                    <span className="block text-[10px] text-slate-400 font-normal">{ot.departmentName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {ot.date} ({ot.startTime} - {ot.endTime})
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-400">{ot.durationHours} Jam</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="font-semibold block text-slate-200">{ot.project}</span>
                    <span className="text-[10px] text-slate-400">{ot.reason}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{ot.supervisorName}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{ot.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Overtime */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" /> Form Surat Perintah Lembur (SPL)
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
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Lembur</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Estimasi Durasi (Jam)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Proyek / Cost Allocation</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alasan Urgent Lembur</label>
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
                  Terbitkan SPL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
