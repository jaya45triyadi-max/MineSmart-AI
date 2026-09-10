import React, { useState } from "react";
import { ShieldAlert, Plus, Camera, AlertCircle, X, Check } from "lucide-react";
import { NearMissRecord } from "../../../types/hseTypes";

interface HSENearMissTabProps {
  nearMisses: NearMissRecord[];
  onCreateNearMiss: (data: Omit<NearMissRecord, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSENearMissTab: React.FC<HSENearMissTabProps> = ({ nearMisses, onCreateNearMiss }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nearMissId: `NM-${Math.floor(100 + Math.random() * 900)}`,
    incidentNumber: `NM-2026-${Math.floor(10 + Math.random() * 90)}`,
    date: new Date().toISOString().split("T")[0],
    time: "08:30",
    locationName: "Pit Alpha Crusher Feed Ramp",
    activityName: "Haulage Truck Reversing",
    description: "",
    potentialConsequence: "",
    immediateAction: "",
    potentialSeverity: "MEDIUM" as NearMissRecord["potentialSeverity"],
    potentialProbability: "LIKELY" as NearMissRecord["potentialProbability"],
    potentialRiskScore: 12,
    potentialRiskLevel: "MEDIUM" as NearMissRecord["potentialRiskLevel"],
    reporterName: "Lapangan Inspector",
    status: "REPORTED" as NearMissRecord["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNearMiss(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Laporan Near Miss (Hampir Celaka)
          </h2>
          <p className="text-xs text-slate-400">Pencatatan kejadian berpotensi bahaya untuk pencegahan dini kecelakaan</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Lapor Near Miss
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearMisses.map((nm) => (
          <div key={nm.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400">{nm.incidentNumber}</span>
                <h3 className="font-semibold text-white text-sm mt-0.5">{nm.locationName}</h3>
                <p className="text-[11px] text-slate-400">{nm.activityName}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Risk Score: {nm.potentialRiskScore}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg">{nm.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800 text-slate-400">
              <div>Pelapor: <span className="text-slate-200">{nm.reporterName}</span></div>
              <div>Tanggal: <span className="text-slate-200">{nm.date} {nm.time}</span></div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Lapor Near Miss / Hampir Celaka</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Lokasi Kejadian</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Aktivitas Kerja</label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Uraian Kejadian Near Miss</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Ceritakan apa yang hampir terjadi..."
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tindakan Langsung Pencegahan</label>
                <input
                  type="text"
                  value={formData.immediateAction}
                  onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Tindakan yang langsung dilakukan di tempat..."
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
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold">
                Kirim Laporan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
