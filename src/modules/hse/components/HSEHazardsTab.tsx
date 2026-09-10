import React, { useState } from "react";
import { AlertCircle, Plus, Filter, CheckCircle2, MapPin, Clock, X } from "lucide-react";
import { Hazard, HazardCategory, HazardStatus } from "../../../types/hseTypes";

interface HSEHazardsTabProps {
  hazards: Hazard[];
  onCreateHazard: (data: Omit<Hazard, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateStatus: (hazardId: string, status: HazardStatus) => void;
}

export const HSEHazardsTab: React.FC<HSEHazardsTabProps> = ({ hazards, onCreateHazard, onUpdateStatus }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    hazardId: `HAZ-${Math.floor(100 + Math.random() * 900)}`,
    companyId: "COMP-01",
    siteId: "SITE-01",
    locationId: "LOC-PIT-01",
    locationName: "Pit Bravo Bench +20",
    activityName: "Overburden Digging",
    category: "Geotechnical" as HazardCategory,
    description: "",
    source: "Inspeksi Lapangan Safety Officer",
    riskLevel: "HIGH" as Hazard["riskLevel"],
    riskScore: 16,
    existingControls: "Penandaan garis bahaya 15m",
    recommendedControls: "Pengalihan loader & scaling lereng",
    reportedBy: "Irwan Setiawan (HSE Officer)",
    status: "OPEN" as HazardStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
    assignedTo: "Supervisor Operasi",
  });

  const filtered = hazards.filter((h) => selectedCategory === "ALL" || h.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateHazard(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            HSE Hazard Register & Pengelolaan Bahaya
          </h2>
          <p className="text-xs text-slate-400">Identifikasi potensi bahaya tempat kerja, tingkat risiko, dan pengendalian</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Catat Bahaya Baru
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium">Filter Kategori Bahaya:</span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="ALL">Semua Kategori Bahaya</option>
          <option value="Geotechnical">Geoteknik & Slope</option>
          <option value="Traffic">Traffic & Hauling Road</option>
          <option value="Electrical">Electrical</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Dust">Dust & Air Quality</option>
          <option value="Heavy Equipment">Heavy Equipment</option>
          <option value="Environmental">Environmental</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Kategori</th>
                <th className="p-3">Lokasi & Uraian Bahaya</th>
                <th className="p-3">Tingkat Risiko</th>
                <th className="p-3">Pengendalian Saat Ini</th>
                <th className="p-3">Penanggung Jawab</th>
                <th className="p-3">Jatuh Tempo</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((haz) => (
                <tr key={haz.id} className="hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-white">{haz.category}</td>
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {haz.locationName}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{haz.description}</p>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        haz.riskLevel === "EXTREME" || haz.riskLevel === "HIGH"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {haz.riskLevel} (Score: {haz.riskScore})
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{haz.existingControls}</td>
                  <td className="p-3 text-slate-300">{haz.assignedTo || "Unassigned"}</td>
                  <td className="p-3 text-slate-300">{haz.dueDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700 font-medium">
                      {haz.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onUpdateStatus(haz.hazardId, haz.status === "CLOSED" ? "OPEN" : "CLOSED")}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium"
                    >
                      {haz.status === "CLOSED" ? "Re-open" : "Close Hazard"}
                    </button>
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
              <h3 className="font-bold text-lg text-white">Input Potensi Bahaya Baru (Hazard)</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Kategori Bahaya</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as HazardCategory })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Geotechnical">Geoteknik & Lereng</option>
                  <option value="Traffic">Traffic & Haul Road</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Dust">Dust & Air Quality</option>
                  <option value="Heavy Equipment">Heavy Equipment</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lokasi Bahaya</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Deskripsi Kondisi Bahaya</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  placeholder="Uraikan temuan kondisi/tindakan tidak aman..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Rekomendasi Pengendalian (Control)</label>
                <input
                  type="text"
                  value={formData.recommendedControls}
                  onChange={(e) => setFormData({ ...formData, recommendedControls: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
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
                Simpan Hazard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
