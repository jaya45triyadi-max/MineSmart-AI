import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileText,
  MapPin,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { HSEIncident, IncidentSeverity, IncidentType, IncidentStatus } from "../../../types/hseTypes";

interface HSEIncidentsTabProps {
  incidents: HSEIncident[];
  onCreateIncident: (data: Omit<HSEIncident, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSEIncidentsTab: React.FC<HSEIncidentsTabProps> = ({ incidents, onCreateIncident }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<HSEIncident | null>(null);

  const [formData, setFormData] = useState({
    incidentNumber: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
    incidentDate: new Date().toISOString().split("T")[0],
    incidentTime: "10:00",
    reportedAt: new Date().toISOString(),
    locationName: "Pit Alpha South Haul Road KM 4",
    locationId: "LOC-PIT-01",
    departmentName: "Hauling & Logistics",
    activityName: "Coal Hauling Operation",
    reportedBy: "Irwan Setiawan (HSE Officer)",
    incidentType: "PROPERTY_DAMAGE" as IncidentType,
    severity: "MEDIUM" as IncidentSeverity,
    description: "",
    immediateAction: "",
  });

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = selectedSeverity === "ALL" || inc.severity === selectedSeverity;
    const matchesType = selectedType === "ALL" || inc.incidentType === selectedType;
    return matchesSearch && matchesSev && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateIncident({
      ...formData,
      incidentId: formData.incidentNumber,
      companyId: "COMP-01",
      siteId: "SITE-01",
      status: "REPORTED",
      investigationStatus: "PENDING",
      rootCauseStatus: "PENDING",
      correctiveActionStatus: "OPEN",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Manajemen Insiden & Laporan Kejadian K3
          </h2>
          <p className="text-xs text-slate-400">Pencatatan, investigasi, dan tindak lanjut insiden kerja tambang</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" /> Lapor Insiden Baru
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor insiden, lokasi, deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Semua Keparahan (Severity)</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Semua Tipe Insiden</option>
            <option value="ACCIDENT">Accident</option>
            <option value="NEAR_MISS">Near Miss</option>
            <option value="PROPERTY_DAMAGE">Property Damage</option>
            <option value="ENVIRONMENTAL">Environmental</option>
            <option value="MEDICAL">Medical</option>
            <option value="FIRST_AID">First Aid</option>
            <option value="VEHICLE">Vehicle</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3">No Insiden</th>
                <th className="p-3">Tanggal & Waktu</th>
                <th className="p-3">Lokasi</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Keparahan</th>
                <th className="p-3">Pelapor</th>
                <th className="p-3">Investigasi</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-semibold text-white">{inc.incidentNumber}</td>
                  <td className="p-3 text-slate-300">
                    {inc.incidentDate} <span className="text-slate-500">{inc.incidentTime}</span>
                  </td>
                  <td className="p-3 text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    {inc.locationName}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {inc.incidentType}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        inc.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : inc.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{inc.reportedBy}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {inc.investigationStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500 text-xs">
                    Tidak ada record insiden yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-white">Detail Insiden {selectedIncident.incidentNumber}</h3>
                <p className="text-xs text-slate-400">{selectedIncident.locationName}</p>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Deskripsi Kejadian:</span>
                <p className="bg-slate-800/80 p-3 rounded-lg text-slate-200">{selectedIncident.description}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Tindakan Langsung (Immediate Action):</span>
                <p className="bg-slate-800/80 p-3 rounded-lg text-slate-200">{selectedIncident.immediateAction}</p>
              </div>

              {selectedIncident.rootCause && (
                <div>
                  <span className="text-slate-400 block mb-1">Akar Masalah (Root Cause):</span>
                  <p className="bg-slate-800/80 p-3 rounded-lg text-amber-300">{selectedIncident.rootCause}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form New Incident */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Form Laporan Insiden Baru</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Nomor Insiden</label>
                <input
                  type="text"
                  value={formData.incidentNumber}
                  onChange={(e) => setFormData({ ...formData, incidentNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Tipe Insiden</label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value as IncidentType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="PROPERTY_DAMAGE">Property Damage</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="NEAR_MISS">Near Miss</option>
                  <option value="ENVIRONMENTAL">Environmental</option>
                  <option value="FIRST_AID">First Aid</option>
                  <option value="VEHICLE">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Lokasi Kejadian</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Tingkat Keparahan (Severity)</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as IncidentSeverity })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1 font-medium">Deskripsi Lengkap Kronologi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Jelaskan secara rinci kronologi kejadian..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1 font-medium">Tindakan Langsung (Immediate Control)</label>
                <textarea
                  rows={2}
                  value={formData.immediateAction}
                  onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Langkah pertolongan pertama / pengamanan lokasi..."
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold">
                Kirim Laporan Insiden
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
