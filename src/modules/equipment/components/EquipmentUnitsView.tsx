// MINE SMART AI - All Equipment Master View

import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Gauge,
  MoreVertical,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
  X,
} from "lucide-react";
import { Equipment, EquipmentCategory, UnitOperationalStatus } from "../../../types/equipmentTypes";

interface EquipmentUnitsViewProps {
  equipmentList: Equipment[];
  onSelectUnit: (unit: Equipment) => void;
  onNewUnit: () => void;
  onImportSuccess: (importedUnits: Equipment[]) => void;
}

export const EquipmentUnitsView: React.FC<EquipmentUnitsViewProps> = ({
  equipmentList,
  onSelectUnit,
  onNewUnit,
  onImportSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileText, setImportFileText] = useState("");
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const filteredList = equipmentList.filter((item) => {
    const matchesSearch =
      item.unitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.equipmentType === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // CSV Import Parser
  const handleParseCsv = () => {
    setImportErrors([]);
    setImportPreview([]);

    if (!importFileText.trim()) {
      setImportErrors(["CSV data tidak boleh kosong."]);
      return;
    }

    const lines = importFileText.trim().split("\n");
    if (lines.length < 2) {
      setImportErrors(["CSV harus memiliki header dan minimal 1 baris data."]);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const parsed: any[] = [];
    const errors: string[] = [];

    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 3) {
        const unitCode = parts[0];

        // Duplicate check against existing equipmentList
        const isDuplicate = equipmentList.some((e) => e.unitCode.toLowerCase() === unitCode.toLowerCase());
        if (isDuplicate) {
          errors.push(`Baris ${idx + 2}: Kode unit '${unitCode}' sudah terdaftar (Duplicate Detected).`);
        } else {
          parsed.push({
            id: `EQ-IMP-${Date.now()}-${idx}`,
            equipmentId: `EQ-IMP-${Date.now()}-${idx}`,
            unitCode: unitCode,
            equipmentType: (parts[1] as EquipmentCategory) || "Dump Truck",
            brand: parts[2] || "Komatsu",
            model: parts[3] || "HD785",
            serialNumber: parts[4] || `SN-IMP-${idx}`,
            assetNumber: `AST-IMP-${idx}`,
            year: 2023,
            ownershipType: "OWNED",
            capacity: "Standard",
            fuelType: "B35 Biodiesel",
            status: "Operating" as UnitOperationalStatus,
            location: parts[5] || "Pit 1 South",
            engineHour: Number(parts[6]) || 5000,
            physicalAvailabilityPA: 90.0,
            mechanicalAvailabilityMA: 92.0,
            useOfAvailabilityUA: 80.0,
            fuelLevelPercent: 85,
            healthScore: "Healthy",
            healthScoreValue: 90,
            companyId: "COMP-BNU-01",
            siteId: "SITE-KAL-A",
            department: "Mining Operations",
            costCenter: "CC-MAIN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });

    setImportErrors(errors);
    setImportPreview(parsed);
  };

  const handleConfirmImport = () => {
    if (importPreview.length > 0) {
      onImportSuccess(importPreview);
      setIsImportModalOpen(false);
      setImportFileText("");
      setImportPreview([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Unit Code, Brand, Model, atau Lokasi..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Jenis Alat (All Types)</option>
            <option value="Excavator">Excavator</option>
            <option value="Dump Truck">Dump Truck</option>
            <option value="Dozer">Dozer</option>
            <option value="Grader">Grader</option>
            <option value="Water Truck">Water Truck</option>
            <option value="Light Vehicle">Light Vehicle</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status (All Status)</option>
            <option value="Operating">Operating</option>
            <option value="Standby">Standby</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onNewUnit}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Unit</span>
          </button>
        </div>
      </div>

      {/* Bulk Toolbar if selected */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Terpilih <strong>{selectedIds.length}</strong> unit alat</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold cursor-pointer">
              Set Bulk Status
            </button>
            <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold cursor-pointer">
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Equipment Master Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === filteredList.length && filteredList.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Unit Code</th>
                <th className="py-3 px-4">Category & Model</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Lokasi Pit / Zone</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-right">SMU (Hours)</th>
                <th className="py-3 px-4 text-right">PA %</th>
                <th className="py-3 px-4 text-right">UA %</th>
                <th className="py-3 px-4 text-center">Health</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredList.map((unit) => {
                const isSelected = selectedIds.includes(unit.id);
                const statusColors =
                  unit.status === "Operating"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : unit.status === "Breakdown"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-amber-500/10 text-amber-300 border-amber-500/30";

                return (
                  <tr
                    key={unit.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? "bg-amber-950/20" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleSelectOne(unit.id)} className="cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectUnit(unit)}
                          className="font-mono font-bold text-amber-400 hover:underline cursor-pointer text-xs"
                        >
                          {unit.unitCode}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">{unit.assetNumber}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{unit.equipmentType}</span>
                      <span className="text-[10px] text-slate-400">{unit.brand} {unit.model}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${statusColors} font-mono uppercase`}>
                        {unit.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {unit.location}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {unit.operatorName || "-"}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {unit.engineHour.toLocaleString()} h
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-sky-400">
                      {unit.physicalAvailabilityPA}%
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-300">
                      {unit.useOfAvailabilityUA}%
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          unit.healthScore === "Healthy"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : unit.healthScore === "Attention"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {unit.healthScoreValue} pts
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectUnit(unit)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 font-mono"
                      >
                        <span>Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Upload className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Import Equipment CSV Data</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Format CSV Header: <code>unitCode, equipmentType, brand, model, serialNumber, location, engineHour</code>
            </p>

            <textarea
              rows={6}
              value={importFileText}
              onChange={(e) => setImportFileText(e.target.value)}
              placeholder="unitCode, equipmentType, brand, model, serialNumber, location, engineHour&#10;HT-115, Dump Truck, Komatsu, HD785, KMT115, Pit 1 South, 8400&#10;EX-209, Excavator, Caterpillar, 6020B, CAT209, Pit 2 North, 11200"
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleParseCsv}
                className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all cursor-pointer"
              >
                Validasi & Pratinjau
              </button>

              {importPreview.length > 0 && (
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  {importPreview.length} unit valid & siap diimport
                </span>
              )}
            </div>

            {/* Import Errors */}
            {importErrors.length > 0 && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1 text-xs text-rose-300">
                <div className="flex items-center gap-1 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Temuan Masalah Import:</span>
                </div>
                {importErrors.map((err, idx) => (
                  <p key={idx} className="text-[11px] font-mono">• {err}</p>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={importPreview.length === 0}
                onClick={handleConfirmImport}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-all cursor-pointer ${
                  importPreview.length > 0 ? "bg-amber-600 hover:bg-amber-500" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Proses Import Data ({importPreview.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
