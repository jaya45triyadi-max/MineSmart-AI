import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  XCircle,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { AttendanceRecordExtended } from "../../../types/attendanceTypes";
import { Department } from "../../../types/hrTypes";

interface Props {
  records: AttendanceRecordExtended[];
  departments: Department[];
  onExportCSV: () => void;
}

export const AttendanceRecordsTab: React.FC<Props> = ({ records, departments, onExportCSV }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecordExtended | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === "ALL" || r.departmentId === selectedDept;
    const matchesStatus = selectedStatus === "ALL" || r.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Controls Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-black text-white">Master Ledger Presensi Karyawan Tambang</h2>
          <p className="text-xs text-slate-400">Catatan riwayat presensi masuk/keluar, durasi kerja, dan koordinat GPS checkpoint.</p>
        </div>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 shadow-lg shadow-emerald-500/10 transition-all"
        >
          <Download className="h-4 w-4 text-emerald-400" />
          <span>Ekspor CSV / Excel</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NIK, Nama Karyawan..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Semua Departemen</option>
            {departments.map((d) => (
              <option key={d.id} value={d.departmentId}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Semua Status Presensi</option>
            <option value="PRESENT">PRESENT (Hadir)</option>
            <option value="LATE">LATE (Terlambat)</option>
            <option value="EARLY_LEAVE">EARLY LEAVE (Pulang Awal)</option>
            <option value="ON_LEAVE">ON LEAVE (Cuti / Izin)</option>
            <option value="OFF">OFF SHIFT</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Karyawan & NIK</th>
                <th className="py-3 px-4">Shift & Tanggal</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Jam Kerja Net</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sumber & Verifikasi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{r.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{r.employeeNumber} • {r.departmentName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{r.shiftName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {r.clockIn ? `${r.clockIn} WITA` : "-"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {r.clockOut ? `${r.clockOut} WITA` : "-"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {r.netWorkingHours > 0 ? `${r.netWorkingHours} Jam` : "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
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
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] text-slate-300 font-medium">{r.source}</div>
                    <div className="text-[10px] text-emerald-400">{r.verificationStatus}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      title="Lihat Detail Log GPS & Verification"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">{selectedRecord.employeeName}</h3>
                <p className="text-xs text-slate-400">{selectedRecord.attendanceId}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] font-bold text-slate-500 block">Status Presensi</span>
                  <span className="text-emerald-400 font-bold">{selectedRecord.status}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] font-bold text-slate-500 block">Jam Kerja Net</span>
                  <span className="text-white font-bold">{selectedRecord.netWorkingHours} Jam</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Lokasi Checkpoint GPS</span>
                <p className="text-slate-200 font-medium">{selectedRecord.locationName || "Tapin Main Pit Zone"}</p>
                <p className="text-[10px] font-mono text-cyan-400">
                  Lat: {selectedRecord.latitude || -2.9348}, Lng: {selectedRecord.longitude || 115.215}
                </p>
              </div>

              {selectedRecord.qrTokenUsed && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block">Dynamic QR Token Signature</span>
                  <p className="font-mono text-cyan-300 truncate">{selectedRecord.qrTokenUsed}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
