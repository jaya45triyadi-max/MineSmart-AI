import React, { useState } from "react";
import { Users, Plus, CheckCircle2, FileText, Calendar, Clock, X } from "lucide-react";
import { ToolboxMeeting, ToolboxTopic } from "../../../types/hseTypes";

interface HSEToolboxTabProps {
  toolboxMeetings: ToolboxMeeting[];
  onCreateToolboxMeeting: (data: Omit<ToolboxMeeting, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSEToolboxTab: React.FC<HSEToolboxTabProps> = ({ toolboxMeetings, onCreateToolboxMeeting }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    meetingId: `TBM-${Date.now()}`,
    meetingNumber: `TBM-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split("T")[0],
    time: "06:30",
    locationName: "Pit Alpha Muster Point",
    supervisorName: "Eko Prasetyo (Shift Supervisor)",
    topic: "Traffic Safety" as ToolboxTopic,
    activityName: "Pre-Shift Briefing Shift 1",
    keyHazardsDiscussed: ["Jalan hauling licin", "Jarak pandang berdebu"],
    requiredControlsDiscussed: ["Jaga jarak aman 50m", "Lampu utama & rotary dinyalakan"],
    presentCount: 24,
    discussionNotes: "Instruksi kecepatan maksimal 40 km/jam.",
    participants: [
      { personId: "P-101", name: "Rudi Hermawan", company: "PT BBM", role: "Driver DT-201", attendanceStatus: "PRESENT" as const, digitalSignature: true },
      { personId: "P-102", name: "Agus Pratama", company: "PT BBM", role: "Driver DT-202", attendanceStatus: "PRESENT" as const, digitalSignature: true },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateToolboxMeeting(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Toolbox Meeting & Safety Briefing Harian
          </h2>
          <p className="text-xs text-slate-400">Pertemuan K3 awal shift, topik keselamatan, dan absensi digital</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Catat Toolbox Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toolboxMeetings.map((tbm) => (
          <div key={tbm.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-indigo-400">{tbm.meetingNumber}</span>
                <h3 className="font-semibold text-white text-sm mt-0.5">{tbm.topic} - {tbm.locationName}</h3>
                <p className="text-xs text-slate-400">Pengawas: {tbm.supervisorName}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30">
                {tbm.presentCount} Peserta
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Bahaya Dibahas:</span>
              <p className="text-slate-200 bg-slate-800/60 p-2 rounded">{tbm.keyHazardsDiscussed.join(", ")}</p>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
              <span>Tanggal: {tbm.date} {tbm.time}</span>
              <span className="text-emerald-400 font-medium">Absensi Digital Valid</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Input Briefing Toolbox Meeting</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Topik Briefing K3</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value as ToolboxTopic })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Traffic Safety">Traffic Safety & Hauling</option>
                  <option value="Fatigue">Fatigue & Overtime</option>
                  <option value="PPE">PPE Compliance</option>
                  <option value="Ground Control">Ground Control & Geotech</option>
                  <option value="Heavy Equipment">Heavy Equipment Safety</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lokasi Muster Point</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jumlah Peserta Hadir</label>
                <input
                  type="number"
                  value={formData.presentCount}
                  onChange={(e) => setFormData({ ...formData, presentCount: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
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
                Simpan Briefing
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
