import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Image as ImageIcon,
  X,
  Layers,
} from "lucide-react";
import {
  ReclamationActivity,
  ReclamationProject,
  ActivityType,
} from "../../../types/reclamationTypes";

interface Props {
  activities: ReclamationActivity[];
  projects: ReclamationProject[];
  onAddActivity: (act: Omit<ReclamationActivity, "id">) => void;
}

export const ReclamationWorkTab: React.FC<Props> = ({
  activities,
  projects,
  onAddActivity,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [projectId, setProjectId] = useState(projects[0]?.projectId || "");
  const [activityType, setActivityType] = useState<ActivityType>("Land Shaping");
  const [plannedQuantity, setPlannedQuantity] = useState<number>(10);
  const [actualQuantity, setActualQuantity] = useState<number>(8);
  const [unit, setUnit] = useState("ha");
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-15");
  const [responsiblePerson, setResponsiblePerson] = useState("M. Rizal (Supervisor)");
  const [equipmentInput, setEquipmentInput] = useState("DZ-04 (CAT D8T), EX-08 (PC300)");
  const [costIDR, setCostIDR] = useState<number>(250000000);
  const [notes, setNotes] = useState("Reshaping lereng dump sesuai DTM Survey");

  const filteredActivities = activities.filter(
    (act) => selectedProjectId === "ALL" || act.projectId === selectedProjectId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddActivity({
      activityId: `ACT-00${activities.length + 1}`,
      projectId,
      activityType,
      plannedQuantity,
      actualQuantity,
      unit,
      startDate,
      endDate,
      responsiblePerson,
      equipmentUsed: equipmentInput.split(",").map((s) => s.trim()),
      status: actualQuantity >= plannedQuantity ? "COMPLETED" : "IN_PROGRESS",
      notes,
      costIDR,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-cyan-400" />
            Reclamation Work & Operational Activities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pelaksanaan kegiatan teknis penataan lahan, backfilling, grading, penebaran topsoil, konstruksi drainase, dan konservasi tanah.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/10"
        >
          <Plus className="h-4 w-4" /> Catat Aktivitas Lahan Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 font-bold">Filter Proyek:</span>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">Semua Proyek Reklamasi</option>
          {projects.map((p) => (
            <option key={p.id} value={p.projectId}>
              {p.projectId} - {p.projectName}
            </option>
          ))}
        </select>
      </div>

      {/* Activities Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Aktivitas</th>
                <th className="px-4 py-3">Tipe Pekerjaan</th>
                <th className="px-4 py-3">ID Proyek</th>
                <th className="px-4 py-3">Target vs Realisasi</th>
                <th className="px-4 py-3">Alat Berat Digunakan</th>
                <th className="px-4 py-3">Biaya (IDR)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">PIC / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    Belum ada catatan aktivitas untuk proyek ini.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const pct = Math.min(100, Math.round((act.actualQuantity / (act.plannedQuantity || 1)) * 100));
                  return (
                    <tr key={act.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-cyan-400">{act.activityId}</td>
                      <td className="px-4 py-3 font-bold text-white">{act.activityType}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{act.projectId}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-white">
                          {act.actualQuantity} / {act.plannedQuantity} {act.unit}
                        </span>
                        <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-[11px]">
                        {act.equipmentUsed.join(", ")}
                      </td>
                      <td className="px-4 py-3 font-bold text-purple-400">
                        Rp {(act.costIDR / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            act.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }`}
                        >
                          {act.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        <span className="text-slate-200 block font-semibold">{act.responsiblePerson}</span>
                        <span className="line-clamp-1">{act.notes}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Wrench className="h-4 w-4 text-cyan-400" /> Form Pencatatan Aktivitas Lahan Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pilih Proyek Reklamasi</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.projectId}>
                        {p.projectId} - {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipe Pekerjaan</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Land Shaping">Land Shaping (Reshaping Slope)</option>
                    <option value="Backfilling">Backfilling Void</option>
                    <option value="Grading">Grading Bench</option>
                    <option value="Topsoil Spreading">Topsoil Spreading</option>
                    <option value="Drainage Construction">Drainage Construction</option>
                    <option value="Erosion Control">Erosion Control</option>
                    <option value="Soil Amendment">Soil Amendment (Dolomite)</option>
                    <option value="Mulching">Mulching</option>
                    <option value="Planting">Planting</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Vol/Luas</label>
                  <input
                    type="number"
                    value={plannedQuantity}
                    onChange={(e) => setPlannedQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Realisasi</label>
                  <input
                    type="number"
                    value={actualQuantity}
                    onChange={(e) => setActualQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alat Berat Digunakan</label>
                <input
                  type="text"
                  placeholder="Contoh: DZ-04 (CAT D8T), EX-08 (PC300)"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Estimasi Biaya (IDR)</label>
                  <input
                    type="number"
                    value={costIDR}
                    onChange={(e) => setCostIDR(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Catatan Pekerjaan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Simpan Aktivitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
