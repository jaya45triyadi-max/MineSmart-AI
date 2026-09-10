import React, { useState } from "react";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  X,
  Smartphone,
  Fingerprint,
} from "lucide-react";
import {
  AttendanceRecord,
  Employee,
  AttendanceStatus,
  AttendanceSource,
  ShiftType,
} from "../../../types/hrTypes";

interface Props {
  attendance: AttendanceRecord[];
  employees: Employee[];
  onAddAttendance: (att: Omit<AttendanceRecord, "id">) => void;
}

export const AttendanceManagementTab: React.FC<Props> = ({
  attendance,
  employees,
  onAddAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState("2026-08-14");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [shift, setShift] = useState<ShiftType>("DAY");
  const [checkIn, setCheckIn] = useState("06:50:00");
  const [checkOut, setCheckOut] = useState("19:05:00");
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
  const [source, setSource] = useState<AttendanceSource>("Biometric");
  const [locationName, setLocationName] = useState("Main Turnstile Site Tapin");

  const dailyAttendance = attendance.filter((a) => a.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    onAddAttendance({
      attendanceId: `ATT-${Date.now()}`,
      employeeId,
      employeeName: emp?.name || "Karyawan",
      departmentName: emp?.departmentName || "Mining Dept",
      date: selectedDate,
      shift,
      checkIn,
      checkOut,
      status,
      source,
      latitude: -3.42,
      longitude: 115.23,
      locationName,
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
            Attendance Management & Geolocation Check-in System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring presensi real-time via Biometrik Turnstile, Mobile GPS Geofencing, dan log kehadiran shift tambang.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Input Presensi Manual
        </button>
      </div>

      {/* Attendance Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md space-y-3">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Pilih Tanggal Presensi:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Hadir Today: {dailyAttendance.length} Karyawan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Jam Masuk (Check In)</th>
                <th className="px-4 py-3">Jam Keluar (Check Out)</th>
                <th className="px-4 py-3">Status Presensi</th>
                <th className="px-4 py-3">Sumber & Lokasi GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dailyAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                    Belum ada log presensi pada tanggal ini.
                  </td>
                </tr>
              ) : (
                dailyAttendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white">
                      {att.employeeName}
                      <span className="block text-[10px] text-slate-400 font-normal">{att.departmentName}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-cyan-400">{att.shift}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{att.checkIn || "-"}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{att.checkOut || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="block font-medium text-slate-200">{att.source}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-rose-400" /> {att.locationName}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Presensi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" /> Input Presensi Manual
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
                  <label className="block font-semibold text-slate-300 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="DAY">SHIFT 1 (SIANG)</option>
                    <option value="NIGHT">SHIFT 2 (MALAM)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status Kehadiran</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="PRESENT">PRESENT (Hadir)</option>
                    <option value="LATE">LATE (Terlambat)</option>
                    <option value="ABSENT">ABSENT (Mangkir)</option>
                    <option value="ON_LEAVE">ON_LEAVE (Cuti)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jam Check In</label>
                  <input
                    type="time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jam Check Out</label>
                  <input
                    type="time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
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
                  Simpan Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
