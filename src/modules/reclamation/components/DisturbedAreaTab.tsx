import React, { useState } from "react";
import {
  Mountain,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  X,
  CheckCircle2,
  Clock,
  Building,
} from "lucide-react";
import {
  DisturbedArea,
  DisturbanceType,
  DisturbedAreaStatus,
} from "../../../types/reclamationTypes";

interface Props {
  disturbedAreas: DisturbedArea[];
  onAddDisturbedArea: (
    area: Omit<DisturbedArea, "id" | "createdAt" | "updatedAt">
  ) => void;
}

export const DisturbedAreaTab: React.FC<Props> = ({
  disturbedAreas,
  onAddDisturbedArea,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pitName, setPitName] = useState("Pit Alpha");
  const [blockName, setBlockName] = useState("Block 03");
  const [areaHa, setAreaHa] = useState<number>(10.0);
  const [disturbanceType, setDisturbanceType] = useState<DisturbanceType>("Mining");
  const [disturbanceDate, setDisturbanceDate] = useState("2026-08-14");
  const [currentLandUse, setCurrentLandUse] = useState("Finished Void Backfill");
  const [status, setStatus] = useState<DisturbedAreaStatus>("READY_FOR_RECLAMATION");
  const [responsibleDept, setResponsibleDept] = useState("Reclamation Operations");

  const filteredAreas = disturbedAreas.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disturbedAreaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesType = typeFilter === "ALL" || item.disturbanceType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    onAddDisturbedArea({
      disturbedAreaId: `DA-${code.toUpperCase()}`,
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name,
      code,
      pitId: pitName.toLowerCase().replace(/\s+/g, "-"),
      pitName,
      blockId: blockName.toLowerCase().replace(/\s+/g, "-"),
      blockName,
      latitude: -3.4215,
      longitude: 115.2341,
      elevation: 70,
      areaHa,
      disturbanceType,
      disturbanceDate,
      currentLandUse,
      status,
      source: "Manual Surveyor Measurement",
      responsibleDept,
    });

    setIsModalOpen(false);
    setName("");
    setCode("");
  };

  const getStatusBadge = (st: DisturbedAreaStatus) => {
    switch (st) {
      case "ACTIVE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "READY_FOR_RECLAMATION":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "UNDER_RECLAMATION":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "RECLAIMED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "MONITORING":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CLOSED":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mountain className="h-5 w-5 text-amber-400" />
            Disturbed Area Management (Pencatatan Laporan Lahan Terganggu)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inventarisasi luas area terganggu tambang, tipe bukaan, posisi GIS, dan status kesiapan reklamasi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" /> Catat Area Terganggu Baru
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari ID Area, Nama, Pit, atau Blok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status Area</option>
            <option value="ACTIVE">ACTIVE (Sedang Tambang)</option>
            <option value="READY_FOR_RECLAMATION">READY_FOR_RECLAMATION</option>
            <option value="UNDER_RECLAMATION">UNDER_RECLAMATION</option>
            <option value="RECLAIMED">RECLAIMED</option>
            <option value="MONITORING">MONITORING</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Tipe Bukaan</option>
            <option value="Mining">Mining (Lubang Pit)</option>
            <option value="Disposal">Disposal (Waste Dump)</option>
            <option value="Hauling">Hauling (Jalan Tambang)</option>
            <option value="Stockpile">Stockpile</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </div>
      </div>

      {/* Area Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID / Kode Area</th>
                <th className="px-4 py-3">Nama Area Terganggu</th>
                <th className="px-4 py-3">Pit / Blok</th>
                <th className="px-4 py-3">Tipe Bukaan</th>
                <th className="px-4 py-3">Luas (Ha)</th>
                <th className="px-4 py-3">Tgl Bukaan</th>
                <th className="px-4 py-3">Status Saat Ini</th>
                <th className="px-4 py-3">Penanggung Jawab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    Tidak ada data area terganggu yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-amber-400 font-bold">
                      {item.disturbedAreaId}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {item.name}
                      <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                        {item.currentLandUse}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-200 font-medium">{item.pitName}</span>
                      <span className="block text-[10px] text-slate-400">{item.blockName}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-cyan-400">
                      {item.disturbanceType}
                    </td>
                    <td className="px-4 py-3 font-black text-white text-sm">
                      {item.areaHa} ha
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.disturbanceDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{item.responsibleDept}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Disturbed Area */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Mountain className="h-4 w-4 text-amber-400" /> Form Pencatatan Area Terganggu Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Area Terganggu</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Disposal North Slope B"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kode Sektor Area</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: WD-N2"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Pit</label>
                  <input
                    type="text"
                    value={pitName}
                    onChange={(e) => setPitName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Blok</label>
                  <input
                    type="text"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Luas Area (Hektare)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={areaHa}
                    onChange={(e) => setAreaHa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipe Bukaan</label>
                  <select
                    value={disturbanceType}
                    onChange={(e) => setDisturbanceType(e.target.value as DisturbanceType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mining">Mining (Lubang Pit)</option>
                    <option value="Disposal">Disposal (Waste Dump)</option>
                    <option value="Hauling">Hauling (Jalan Tambang)</option>
                    <option value="Stockpile">Stockpile</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Road">Road</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Pembukaan</label>
                  <input
                    type="date"
                    value={disturbanceDate}
                    onChange={(e) => setDisturbanceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status Kesiapan Area</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DisturbedAreaStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ACTIVE">ACTIVE (Sedang Tambang)</option>
                    <option value="READY_FOR_RECLAMATION">READY_FOR_RECLAMATION</option>
                    <option value="UNDER_RECLAMATION">UNDER_RECLAMATION</option>
                    <option value="RECLAIMED">RECLAIMED</option>
                    <option value="MONITORING">MONITORING</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Penanggung Jawab Departemen</label>
                <input
                  type="text"
                  value={responsibleDept}
                  onChange={(e) => setResponsibleDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
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
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Area Terganggu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
