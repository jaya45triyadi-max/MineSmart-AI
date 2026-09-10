import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sun,
  Moon,
  X,
  FileCheck,
} from "lucide-react";
import {
  RosterEntry,
  ShiftTemplate,
  Employee,
  ShiftType,
} from "../../../types/hrTypes";

interface Props {
  roster: RosterEntry[];
  shiftTemplates: ShiftTemplate[];
  employees: Employee[];
  onAddRosterEntry: (entry: Omit<RosterEntry, "id">) => void;
}

export const RosterManagementTab: React.FC<Props> = ({
  roster,
  shiftTemplates,
  employees,
  onAddRosterEntry,
}) => {
  const [selectedDate, setSelectedDate] = useState("2026-08-14");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [shift, setShift] = useState<ShiftType>("DAY");
  const [workLocation, setWorkLocation] = useState("Pit Alpha Block 3");

  const dailyRoster = roster.filter((r) => r.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    onAddRosterEntry({
      rosterId: `RST-${Date.now()}`,
      employeeId,
      employeeName: emp?.name || "Karyawan Tambang",
      date: selectedDate,
      shift,
      siteId: "SITE-TAPIN",
      departmentId: emp?.departmentId || "DEPT-MIN",
      departmentName: emp?.departmentName || "Mining Dept",
      positionName: emp?.positionName || "Operator",
      workLocation,
      supervisorName: emp?.supervisorName || "Budi Santoso",
      status: "PUBLISHED",
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
            Roster Management, Shift Planning & Validation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penjadwalan shift kerja (Shift 1 Siang, Shift 2 Malam), validasi konflik jam kerja, dan penerbitan jadwal roster site.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Plot Roster Shift
        </button>
      </div>

      {/* Shift Templates Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shiftTemplates.map((st) => (
          <div key={st.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: `${st.color}20`, color: st.color, border: `1px solid ${st.color}40` }}
              >
                {st.isOvernight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">{st.name}</h4>
                <p className="text-[11px] text-slate-400">Jam Kerja: <strong className="text-slate-200">{st.startTime} - {st.endTime}</strong> ({st.breakDurationMins}m Istirahat)</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {st.status}
            </span>
          </div>
        ))}
      </div>

      {/* Date Picker & Roster Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md space-y-3">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Pilih Tanggal Roster:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Total Shift Active Today: {dailyRoster.length} Personel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Shift Allocated</th>
                <th className="px-4 py-3">Departemen & Posisi</th>
                <th className="px-4 py-3">Work Location / Pit Area</th>
                <th className="px-4 py-3">Supervisor On Duty</th>
                <th className="px-4 py-3">Status Roster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dailyRoster.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                    Belum ada plotting roster pada tanggal ini. Klik tombol Plot Roster Shift di atas.
                  </td>
                </tr>
              ) : (
                dailyRoster.map((rst) => (
                  <tr key={rst.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white">{rst.employeeName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          rst.shift === "DAY"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}
                      >
                        {rst.shift === "DAY" ? "SHIFT 1 (SIANG)" : "SHIFT 2 (MALAM)"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-200 font-medium block">{rst.positionName}</span>
                      <span className="text-[10px] text-slate-400">{rst.departmentName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">{rst.workLocation}</td>
                    <td className="px-4 py-3 text-slate-400">{rst.supervisorName}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{rst.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Plot Roster */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" /> Plotting Roster Shift Karyawan
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
                      {e.name} - {e.positionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="DAY">SHIFT 1 (SIANG 07:00-19:00)</option>
                    <option value="NIGHT">SHIFT 2 (MALAM 19:00-07:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lokasi Kerja / Pit Area</label>
                  <input
                    type="text"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
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
                  Simpan Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
