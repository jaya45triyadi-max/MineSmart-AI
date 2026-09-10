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
  Search,
  Filter,
  MapPin,
  Sparkles,
} from "lucide-react";
import { RosterEntry, ShiftTemplate, Employee, ShiftType } from "../../../types/hrTypes";

interface Props {
  employees: Employee[];
}

export const RosterAttendanceTab: React.FC<Props> = ({ employees }) => {
  const [selectedDate, setSelectedDate] = useState("2026-08-15");
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>("ALL");
  const [selectedCrew, setSelectedCrew] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.employeeId || "");
  const [shift, setShift] = useState<ShiftType>("DAY");
  const [workLocation, setWorkLocation] = useState("Pit Alpha Block 3");
  const [rosterPattern, setRosterPattern] = useState("6:2");

  // Initial Roster List
  const [rosterList, setRosterList] = useState<RosterEntry[]>([
    {
      id: "rst-1",
      rosterId: "RST-20260815-001",
      employeeId: "EMP-001",
      employeeName: "Budi Santoso",
      date: "2026-08-15",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Pit Operations",
      positionName: "Mine Superintendent",
      workLocation: "Pit Alpha Block 3",
      supervisorName: "Ir. Hendra Gunawan",
      status: "PUBLISHED",
    },
    {
      id: "rst-2",
      rosterId: "RST-20260815-002",
      employeeId: "EMP-002",
      employeeName: "Siti Aminah",
      date: "2026-08-15",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-HSE",
      departmentName: "HSE & Environmental",
      positionName: "HSE Officer & Paramedic",
      workLocation: "Main Mining Camp Clinic",
      supervisorName: "Budi Santoso",
      status: "PUBLISHED",
    },
    {
      id: "rst-3",
      rosterId: "RST-20260815-003",
      employeeId: "EMP-003",
      employeeName: "Agus Setiawan",
      date: "2026-08-15",
      shift: "NIGHT",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Pit Operations",
      positionName: "Heavy Excavator Operator PC2000",
      workLocation: "Pit Bravo Loading Point",
      supervisorName: "Budi Santoso",
      status: "PUBLISHED",
    },
    {
      id: "rst-4",
      rosterId: "RST-20260815-004",
      employeeId: "EMP-004",
      employeeName: "Joko Widodo",
      date: "2026-08-15",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-PLT",
      departmentName: "Plant & Maintenance",
      positionName: "Senior Heavy Equipment Mechanic",
      workLocation: "Central Workshop Bay 2",
      supervisorName: "Ir. Hendra Gunawan",
      status: "PUBLISHED",
    },
    {
      id: "rst-5",
      rosterId: "RST-20260815-005",
      employeeId: "EMP-005",
      employeeName: "Dewi Lestari",
      date: "2026-08-15",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-ENG",
      departmentName: "Mine Engineering & Survey",
      positionName: "Mine Surveyor Specialist",
      workLocation: "Disposal Area & Highwall",
      supervisorName: "Budi Santoso",
      status: "PUBLISHED",
    },
    {
      id: "rst-6",
      rosterId: "RST-20260815-006",
      employeeId: "EMP-006",
      employeeName: "Rudi Hartono",
      date: "2026-08-15",
      shift: "NIGHT",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-LOG",
      departmentName: "Hauling & Logistics",
      positionName: "Haul Truck HD785 Operator",
      workLocation: "Hauling Road KM 14",
      supervisorName: "Budi Santoso",
      status: "PUBLISHED",
    },
  ]);

  const handleAddRoster = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === employeeId);
    const newEntry: RosterEntry = {
      id: `rst-${Date.now()}`,
      rosterId: `RST-20260815-${Math.floor(100 + Math.random() * 900)}`,
      employeeId,
      employeeName: emp?.name || "Karyawan Tambang",
      date: selectedDate,
      shift,
      siteId: "SITE-TAPIN",
      departmentId: emp?.departmentId || "DEPT-MIN",
      departmentName: emp?.departmentName || "Mining & Operation",
      positionName: emp?.positionName || "Operator",
      workLocation,
      supervisorName: emp?.supervisorName || "Budi Santoso",
      status: "PUBLISHED",
    };

    setRosterList([newEntry, ...rosterList]);
    setIsModalOpen(false);
  };

  const filteredRoster = rosterList.filter((r) => {
    if (selectedShiftFilter !== "ALL" && r.shift !== selectedShiftFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-extrabold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              MINING ROSTER & ROTATION CYCLES
            </span>
            <span className="text-xs text-slate-400">Site Tapin Coal Operations</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Penjadwalan Roster Kerja & Penugasan Pit
          </h2>
          <p className="text-xs text-slate-400">
            Pengaturan jadwal giliran kerja mining roster (6:2, 8:2, 10:3, 14:14 on/off site), pembagian crew, dan penempatan armada alat berat.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Tambah Jadwal Roster
        </button>
      </div>

      {/* Roster Pattern Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Roster 6:2 (Local)</span>
          <div className="text-lg font-black text-white font-mono">140 Karyawan</div>
          <p className="text-[10px] text-slate-400">6 Hari Kerja, 2 Hari Off</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-indigo-400 font-bold uppercase">Roster 8:2 (Regional)</span>
          <div className="text-lg font-black text-indigo-300 font-mono">110 Karyawan</div>
          <p className="text-[10px] text-indigo-400/80">8 Hari Kerja, 2 Hari Off</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-teal-400 font-bold uppercase">Roster 14:14 (Fly-in Fly-out)</span>
          <div className="text-lg font-black text-teal-300 font-mono">65 Karyawan</div>
          <p className="text-[10px] text-teal-400/80">14 On Site, 14 Field Break</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase">Roster 5:2 (Office & Head)</span>
          <div className="text-lg font-black text-emerald-300 font-mono">25 Karyawan</div>
          <p className="text-[10px] text-emerald-400/80">Senin - Jumat 08:00-17:00</p>
        </div>
      </div>

      {/* Roster Controls & Filter */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Jadwal Roster Tanggal: <span className="font-mono text-indigo-300">{selectedDate}</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <select
              value={selectedShiftFilter}
              onChange={(e) => setSelectedShiftFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Semua Shift</option>
              <option value="DAY">Shift 1 (Day: 07:00-19:00)</option>
              <option value="NIGHT">Shift 2 (Night: 19:00-07:00)</option>
              <option value="OFF">Roster Off</option>
            </select>
          </div>
        </div>

        {/* Table of Roster Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">No Roster</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Departemen & Jabatan</th>
                <th className="px-4 py-3">Shift Penugasan</th>
                <th className="px-4 py-3">Lokasi Kerja / Pit</th>
                <th className="px-4 py-3">Pengawas (SPV)</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRoster.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-400">{r.rosterId}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{r.employeeName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.employeeId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200 font-medium">{r.positionName}</div>
                    <div className="text-[10px] text-slate-400">{r.departmentName}</div>
                  </td>
                  <td className="px-4 py-3">
                    {r.shift === "DAY" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Sun className="h-3 w-3" /> Shift 1 (Siang)
                      </span>
                    ) : r.shift === "NIGHT" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        <Moon className="h-3 w-3" /> Shift 2 (Malam)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                        Roster Off
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {r.workLocation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{r.supervisorName}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Tambah Jadwal Roster Shift</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoster} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Karyawan</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.employeeId}>
                      {e.name} ({e.employeeId}) - {e.positionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as ShiftType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="DAY">Shift 1 (Day: 07:00 - 19:00)</option>
                  <option value="NIGHT">Shift 2 (Night: 19:00 - 07:00)</option>
                  <option value="OFF">Roster Off (Libur)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Lokasi Tugas / Pit</label>
                <input
                  type="text"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  placeholder="Contoh: Pit Alpha Block 3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Pola Roster</label>
                <select
                  value={rosterPattern}
                  onChange={(e) => setRosterPattern(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="6:2">6:2 (6 Hari Kerja, 2 Off)</option>
                  <option value="8:2">8:2 (8 Hari Kerja, 2 Off)</option>
                  <option value="10:3">10:3 (10 Hari Kerja, 3 Off)</option>
                  <option value="14:14">14:14 (14 On Site, 14 Field Break)</option>
                  <option value="5:2">5:2 (Office)</option>
                </select>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white"
                >
                  Simpan Jadwal Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
