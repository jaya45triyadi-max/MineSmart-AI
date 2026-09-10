import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Award,
  X,
} from "lucide-react";
import {
  TrainingProgram,
  TrainingSession,
  EmployeeTrainingRecord,
} from "../../../types/hrTypes";

interface Props {
  programs: TrainingProgram[];
  sessions: TrainingSession[];
  records: EmployeeTrainingRecord[];
  onAddSession: (sess: Omit<TrainingSession, "id">) => void;
}

export const TrainingManagementTab: React.FC<Props> = ({
  programs,
  sessions,
  records,
  onAddSession,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"sessions" | "programs" | "records">("sessions");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [trainingId, setTrainingId] = useState(programs[0]?.trainingId || "");
  const [startDate, setStartDate] = useState("2026-08-20");
  const [endDate, setEndDate] = useState("2026-08-21");
  const [location, setLocation] = useState("Training Center Room B");
  const [instructor, setInstructor] = useState("Tim HSE Safety");
  const [capacity, setCapacity] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prg = programs.find((p) => p.trainingId === trainingId);
    onAddSession({
      sessionId: `SESS-${Math.floor(1000 + Math.random() * 9000)}`,
      trainingId,
      trainingName: prg?.name || "Training Mining K3",
      siteId: "SITE-TAPIN",
      startDate,
      endDate,
      location,
      instructor,
      capacity,
      participantsCount: 0,
      status: "OPEN",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Training Management, Diklat Tambang & Training Gap Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan program diklat K3, pelatihan operasional alat berat, jadwal sesi diklat, dan rekapitulasi kelulusan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Buka Sesi Training Baru
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit text-xs font-bold">
        <button
          onClick={() => setActiveSubTab("sessions")}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === "sessions" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          Jadwal Sesi Training ({sessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("programs")}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === "programs" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          Katalog Program Diklat ({programs.length})
        </button>
        <button
          onClick={() => setActiveSubTab("records")}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === "records" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          Riwayat Kelulusan ({records.length})
        </button>
      </div>

      {/* Content Sessions */}
      {activeSubTab === "sessions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400">{sess.sessionId}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {sess.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-xs">{sess.trainingName}</h3>

              <div className="space-y-1 text-xs text-slate-300">
                <p><strong className="text-slate-500">Tanggal:</strong> {sess.startDate} s/d {sess.endDate}</p>
                <p><strong className="text-slate-500">Lokasi:</strong> {sess.location}</p>
                <p><strong className="text-slate-500">Instruktur:</strong> {sess.instructor}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Peserta: <strong className="text-emerald-400 font-bold">{sess.participantsCount} / {sess.capacity} Orang</strong></span>
                <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[11px]">
                  Daftarkan Karyawan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Programs */}
      {activeSubTab === "programs" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programs.map((prog) => (
            <div key={prog.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3">
              <span className="font-mono text-[10px] font-bold text-emerald-400">{prog.trainingId}</span>
              <h3 className="font-bold text-white text-xs">{prog.name}</h3>
              <p className="text-[11px] text-slate-400">{prog.description}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex justify-between">
                <span>Durasi: <strong>{prog.durationHours} Jam</strong></span>
                <span>Penerbit: <strong>{prog.provider}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Records */}
      {activeSubTab === "records" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Nama Training</th>
                <th className="px-4 py-3">Tgl Selesai</th>
                <th className="px-4 py-3">Skor / Nilai</th>
                <th className="px-4 py-3">Status Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td className="px-4 py-3 font-bold text-white">{rec.employeeName}</td>
                  <td className="px-4 py-3 text-slate-300">{rec.trainingName}</td>
                  <td className="px-4 py-3 text-slate-400">{rec.completionDate}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{rec.score} / 100</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{rec.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add Session */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" /> Buka Sesi Training Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pilih Program Diklat</label>
                <select
                  value={trainingId}
                  onChange={(e) => setTrainingId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.trainingId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lokasi Training / Room</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kapasitas Maksimal</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
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
                  Buka Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
