// MINE SMART AI - Borehole Management View

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  Calendar,
  Pickaxe,
} from "lucide-react";
import { Borehole, BoreholeStatus, DrillingType, ValidationStatus } from "../../../types/geologyTypes";

interface BoreholeManagementViewProps {
  boreholes: Borehole[];
  onSelectBorehole: (bh: Borehole) => void;
  onAddBoreholeSubmit: (newBh: Borehole) => void;
}

export const BoreholeManagementView: React.FC<BoreholeManagementViewProps> = ({
  boreholes,
  onSelectBorehole,
  onAddBoreholeSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [validationFilter, setValidationFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formCode, setFormCode] = useState(`BH-SGT-00${boreholes.length + 1}`);
  const [formPit, setFormPit] = useState("Pit 1 South");
  const [formType, setFormType] = useState<DrillingType>("DIAMOND_CORE");
  const [formPlannedDepth, setFormPlannedDepth] = useState(170);
  const [formActualDepth, setFormActualDepth] = useState(170);
  const [formContractor, setFormContractor] = useState("PT GeoDrill Indonesia");
  const [formRig, setFormRig] = useState("Rig Delta-03");

  // Filtering
  const filteredBoreholes = boreholes.filter((b) => {
    const matchesSearch =
      b.boreholeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contractor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesValidation = validationFilter === "ALL" || b.validationStatus === validationFilter;

    return matchesSearch && matchesStatus && matchesValidation;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBh: Borehole = {
      id: `bh-new-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      boreholeCode: formCode,
      pitId: "pit-01",
      pitName: formPit,
      projectId: "proj-exp-2026",
      status: "DRILLING",
      drillingType: formType,
      plannedDepth: Number(formPlannedDepth),
      actualDepth: Number(formActualDepth),
      startDate: new Date().toISOString().split("T")[0],
      contractor: formContractor,
      drillingRig: formRig,
      remarks: "Titik bor baru dibuat dari modul Borehole Management.",
      validationStatus: "VALID",
      seamCount: 0,
      sampleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddBoreholeSubmit(newBh);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Kode Titik Bor / Pit / Kontraktor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Dropdowns & Add Trigger */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="VALIDATED">Validated</option>
              <option value="COMPLETED">Completed</option>
              <option value="DRILLING">Drilling</option>
              <option value="PLANNED">Planned</option>
            </select>

            <select
              value={validationFilter}
              onChange={(e) => setValidationFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua QC Validasi</option>
              <option value="VALID">Valid</option>
              <option value="WARNING">Warning</option>
              <option value="INVALID">Invalid</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Borehole</span>
          </button>
        </div>
      </div>

      {/* Borehole Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Borehole Code</th>
                <th className="px-4 py-3">Pit / Area</th>
                <th className="px-4 py-3">Tipe Pengeboran</th>
                <th className="px-4 py-3 text-right">Target (m)</th>
                <th className="px-4 py-3 text-right">Actual (m)</th>
                <th className="px-4 py-3">Kontraktor / Rig</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">QC Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBoreholes.map((bh) => (
                <tr
                  key={bh.id}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => onSelectBorehole(bh)}
                >
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bh.boreholeCode}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{bh.pitName}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{bh.drillingType}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{bh.plannedDepth}m</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{bh.actualDepth}m</td>
                  <td className="px-4 py-3 text-slate-300">
                    <div>{bh.contractor}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{bh.drillingRig}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        bh.status === "VALIDATED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : bh.status === "COMPLETED"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse"
                      }`}
                    >
                      {bh.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        bh.validationStatus === "VALID"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {bh.validationStatus === "VALID" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {bh.validationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBorehole(bh);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded transition-colors"
                      title="Lihat Detail Borehole"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Borehole Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Registrasi Titik Pengeboran Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kode Borehole
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pit / Area Target
                  </label>
                  <select
                    value={formPit}
                    onChange={(e) => setFormPit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pit 1 South">Pit 1 South</option>
                    <option value="Pit 2 North">Pit 2 North</option>
                    <option value="Pit 3 West">Pit 3 West</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipe Pengeboran
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as DrillingType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DIAMOND_CORE">Diamond Core (HQ/NQ)</option>
                    <option value="REVERSE_CIRCULATION">Reverse Circulation (RC)</option>
                    <option value="OPEN_HOLE">Open Hole</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Rencana Depth (m)
                  </label>
                  <input
                    type="number"
                    value={formPlannedDepth}
                    onChange={(e) => setFormPlannedDepth(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kontraktor Pengeboran
                  </label>
                  <input
                    type="text"
                    value={formContractor}
                    onChange={(e) => setFormContractor(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rig ID
                  </label>
                  <input
                    type="text"
                    value={formRig}
                    onChange={(e) => setFormRig(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Simpan Titik Bor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
