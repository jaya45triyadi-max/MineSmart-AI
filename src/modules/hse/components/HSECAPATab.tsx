import React, { useState } from "react";
import { CheckCircle2, Clock, Plus, Filter, ShieldAlert, Check, X } from "lucide-react";
import { CorrectiveActionItem, CorrectiveActionStatus } from "../../../types/hseTypes";

interface HSECAPATabProps {
  correctiveActions: CorrectiveActionItem[];
  onCreateCAPA: (data: Omit<CorrectiveActionItem, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateStatus: (actionId: string, status: CorrectiveActionStatus, verifiedBy?: string, notes?: string) => void;
}

export const HSECAPATab: React.FC<HSECAPATabProps> = ({ correctiveActions, onCreateCAPA, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    actionId: `CAPA-${Date.now()}`,
    actionNumber: `CAPA-2026-${Math.floor(100 + Math.random() * 900)}`,
    sourceType: "Incident" as CorrectiveActionItem["sourceType"],
    sourceId: "INC-2026-001",
    description: "",
    rootCause: "",
    actionType: "CORRECTIVE" as CorrectiveActionItem["actionType"],
    priority: "HIGH" as CorrectiveActionItem["priority"],
    ownerName: "Budi Santoso",
    departmentName: "Hauling & Logistics",
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split("T")[0],
    status: "OPEN" as CorrectiveActionStatus,
  });

  const filtered = correctiveActions.filter((ca) => selectedStatus === "ALL" || ca.status === selectedStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCAPA(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-rose-400" />
            Tindakan Korektif & Pencegahan (CAPA Management)
          </h2>
          <p className="text-xs text-slate-400">Pelacakan tindakan penanggulangan insiden, inspeksi, hazard, dan SLA waktu penyelesaian</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buat CAPA Baru
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium">Filter Status CAPA:</span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="ALL">Semua Status CAPA</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PENDING_VERIFICATION">Pending Verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="CLOSED">Closed</option>
          <option value="OVERDUE">Overdue SLA</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">No CAPA</th>
                <th className="p-3">Sumber (Source)</th>
                <th className="p-3">Rencana Tindakan Korektif</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Penanggung Jawab</th>
                <th className="p-3">Jatuh Tempo</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((ca) => (
                <tr key={ca.id} className="hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-white">{ca.actionNumber}</td>
                  <td className="p-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {ca.sourceType} ({ca.sourceId})
                    </span>
                  </td>
                  <td className="p-3 max-w-xs text-slate-200 font-medium">{ca.description}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        ca.priority === "CRITICAL" || ca.priority === "HIGH"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {ca.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{ca.ownerName} ({ca.departmentName})</td>
                  <td className="p-3 text-slate-300">{ca.dueDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ca.status === "VERIFIED" || ca.status === "CLOSED"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : ca.status === "OVERDUE"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {ca.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {ca.status !== "VERIFIED" && ca.status !== "CLOSED" ? (
                      <button
                        onClick={() =>
                          onUpdateStatus(ca.actionId, "VERIFIED", "Irwan Setiawan (HSE Lead)", "Pemeriksaan lokasi selesai & bukti terverifikasi")
                        }
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium"
                      >
                        Verifikasi
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-[11px]">Terverifikasi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Buat Tindakan Korektif (CAPA)</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Sumber Tindakan</label>
                <select
                  value={formData.sourceType}
                  onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as CorrectiveActionItem["sourceType"] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Incident">Incident</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Hazard">Hazard</option>
                  <option value="Near Miss">Near Miss</option>
                  <option value="JSA">JSA</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Prioritas CAPA</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CorrectiveActionItem["priority"] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Uraian Tindakan Korektif</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Langkah spesifik perbaikan yang wajib dilaksanakan..."
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Penanggung Jawab (Owner)</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jatuh Tempo (Due Date)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold">
                Simpan CAPA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
