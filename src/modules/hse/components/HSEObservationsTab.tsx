import React, { useState } from "react";
import { Eye, Plus, CheckCircle2, AlertTriangle, TrendingUp, X } from "lucide-react";
import { SafetyObservation, ObservationClassification } from "../../../types/hseTypes";

interface HSEObservationsTabProps {
  observations: SafetyObservation[];
  onCreateObservation: (data: Omit<SafetyObservation, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSEObservationsTab: React.FC<HSEObservationsTabProps> = ({ observations, onCreateObservation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    observationId: `OBS-${Math.floor(100 + Math.random() * 900)}`,
    locationName: "Pit Alpha Loading Point 2",
    activityName: "Excavator Operation",
    observerName: "Bambang Triyono",
    description: "",
    classification: "SAFE_ACT" as ObservationClassification,
    riskLevel: "LOW" as SafetyObservation["riskLevel"],
    immediateActionTaken: "",
    status: "OPEN" as SafetyObservation["status"],
  });

  const safeCount = observations.filter((o) => o.classification === "SAFE_ACT" || o.classification === "SAFE_CONDITION").length;
  const unsafeCount = observations.filter((o) => o.classification === "UNSAFE_ACT" || o.classification === "UNSAFE_CONDITION").length;
  const safePercent = observations.length > 0 ? Math.round((safeCount / observations.length) * 100) : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateObservation(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            Behavior-Based Safety (BBS) & Safety Observation
          </h2>
          <p className="text-xs text-slate-400">Observasi perilaku aman/tidak aman & kondisi lingkungan kerja</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Input Observasi
        </button>
      </div>

      {/* BBS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Indeks Perilaku Aman (Safe Act %)</div>
          <div className="text-2xl font-bold text-emerald-400">{safePercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{safeCount} Observasi Perilaku Aman</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Temuan Unsafe Act & Condition</div>
          <div className="text-2xl font-bold text-rose-400">{unsafeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Perlu Pembinaan & Perbaikan</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Observasi Bulan Ini</div>
          <div className="text-2xl font-bold text-indigo-400">{observations.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Partisipasi Seluruh Pengawas</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {observations.map((obs) => (
          <div key={obs.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">{obs.locationName}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  obs.classification.includes("SAFE")
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}
              >
                {obs.classification}
              </span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg">{obs.description}</p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>Observer: {obs.observerName}</span>
              <span>Aktivitas: {obs.activityName}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Input Observasi Keselamatan (BBS)</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Klasifikasi Observasi</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value as ObservationClassification })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="SAFE_ACT">Safe Act (Tindakan Aman)</option>
                  <option value="UNSAFE_ACT">Unsafe Act (Tindakan Tidak Aman)</option>
                  <option value="SAFE_CONDITION">Safe Condition (Kondisi Aman)</option>
                  <option value="UNSAFE_CONDITION">Unsafe Condition (Kondisi Tidak Aman)</option>
                  <option value="POSITIVE_OBSERVATION">Positive Observation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lokasi Observasi</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deskripsi Observasi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Uraikan perilaku atau kondisi yang diobservasi..."
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
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                Simpan Observasi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
