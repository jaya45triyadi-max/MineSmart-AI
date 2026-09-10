// MINE SMART AI - Survey Point Management Table & View

import React, { useState } from "react";
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";
import { SurveyPoint, PointType, SurveyMethod } from "../../../types/surveyTypes";
import { SurveyPointDetailModal } from "./SurveyPointDetailModal";

interface SurveyPointManagementViewProps {
  points: SurveyPoint[];
  onAddPointSubmit: (pt: SurveyPoint) => void;
  onValidatePoint: (id: string) => void;
  onOpenAIAnalyze: (code: string) => void;
}

export const SurveyPointManagementView: React.FC<SurveyPointManagementViewProps> = ({
  points,
  onAddPointSubmit,
  onValidatePoint,
  onOpenAIAnalyze,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [selectedPoint, setSelectedPoint] = useState<SurveyPoint | null>(null);

  // New Point Form Drawer State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pointCode, setPointCode] = useState("PIT1-B11-01");
  const [pointType, setPointType] = useState<PointType>("Bench");
  const [easting, setEasting] = useState(541290.0);
  const [northing, setNorthing] = useState(9874190.0);
  const [elevation, setElevation] = useState(82.5);
  const [method, setMethod] = useState<SurveyMethod>("GNSS / RTK");
  const [instrument, setInstrument] = useState("Trimble R12i GNSS");
  const [description, setDescription] = useState("Pengukuran Bench 11 Toe Sisi Barat");

  const filteredPoints = points.filter((p) => {
    const matchesSearch =
      p.pointCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || p.pointType === selectedType;
    const matchesMethod = selectedMethod === "ALL" || p.surveyMethod === selectedMethod;
    return matchesSearch && matchesType && matchesMethod;
  });

  const handleCreatePoint = (e: React.FormEvent) => {
    e.preventDefault();
    const newPt: SurveyPoint = {
      id: `sp-${Date.now()}`,
      pointId: `SPT-2026-${Math.floor(100 + Math.random() * 900)}`,
      pointCode,
      companyId: "comp-01",
      siteId: "site-01",
      projectId: "PRJ-SURV-2026-01",
      surveyDate: new Date().toISOString().split("T")[0],
      easting: Number(easting),
      northing: Number(northing),
      elevation: Number(elevation),
      coordinateSystem: "UTM Zone 50S (EPSG:32750)",
      pointType,
      description,
      surveyMethod: method,
      instrument,
      accuracy: "High",
      horizontalAccuracy: 0.008,
      verticalAccuracy: 0.012,
      surveyorId: "usr-surv-01",
      surveyorName: "Budi Santoso",
      status: "Approved",
      createdBy: "usr-surv-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddPointSubmit(newPt);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode point, deskripsi, surveyor..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">Semua Tipe Point</option>
            <option value="Bench">Bench</option>
            <option value="Topography">Topography</option>
            <option value="Boundary">Boundary</option>
            <option value="Stockpile">Stockpile</option>
            <option value="Pit">Pit</option>
            <option value="Road">Road</option>
            <option value="Control Point">Control Point</option>
          </select>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">Semua Metode Survei</option>
            <option value="GNSS / RTK">GNSS / RTK</option>
            <option value="Total Station">Total Station</option>
            <option value="Drone Photogrammetry">Drone Photogrammetry</option>
            <option value="LiDAR">LiDAR</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Point Baru</span>
          </button>
          <button
            onClick={() => alert("Mengeksport data titik ukur ke format CSV / DXF...")}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Export CSV / DXF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Survey Points Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            Daftar Titik Ukur Survei (Survey Points Master)
          </h3>
          <span className="text-xs text-slate-400 font-mono">{filteredPoints.length} Point Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-3 py-2">Point Code</th>
                <th className="px-3 py-2">Point Type</th>
                <th className="px-3 py-2 text-right">Easting (X)</th>
                <th className="px-3 py-2 text-right">Northing (Y)</th>
                <th className="px-3 py-2 text-right">Elevation (Z)</th>
                <th className="px-3 py-2">Survey Method</th>
                <th className="px-3 py-2">Surveyor</th>
                <th className="px-3 py-2 text-center">Accuracy</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredPoints.map((pt) => (
                <tr
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 font-bold text-white font-sans flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span>{pt.pointCode}</span>
                  </td>
                  <td className="px-3 py-2 font-sans text-slate-300">
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-200">
                      {pt.pointType}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-400 font-bold">{pt.easting.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right text-emerald-400 font-bold">{pt.northing.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right text-amber-300 font-bold">{pt.elevation.toFixed(2)}m</td>
                  <td className="px-3 py-2 font-sans text-slate-300">{pt.surveyMethod}</td>
                  <td className="px-3 py-2 font-sans text-slate-400">{pt.surveyorName}</td>
                  <td className="px-3 py-2 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        pt.accuracy === "High"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {pt.accuracy}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        pt.status === "Approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {pt.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPoint(pt);
                      }}
                      className="p-1 hover:bg-slate-700 text-sky-400 rounded transition-colors"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Point Input Modal Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              Input Titik Ukur Survei Baru
            </h3>

            <form onSubmit={handleCreatePoint} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Point Code</label>
                  <input
                    type="text"
                    value={pointCode}
                    onChange={(e) => setPointCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Point Type</label>
                  <select
                    value={pointType}
                    onChange={(e) => setPointType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Bench">Bench</option>
                    <option value="Topography">Topography</option>
                    <option value="Boundary">Boundary</option>
                    <option value="Stockpile">Stockpile</option>
                    <option value="Pit">Pit</option>
                    <option value="Road">Road</option>
                    <option value="Control Point">Control Point</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold font-sans">Easting (X)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={easting}
                    onChange={(e) => setEasting(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold font-sans">Northing (Y)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={northing}
                    onChange={(e) => setNorthing(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-emerald-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold font-sans">Elevation (Z)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={elevation}
                    onChange={(e) => setElevation(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-amber-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Survey Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="GNSS / RTK">GNSS / RTK</option>
                    <option value="Total Station">Total Station</option>
                    <option value="Drone Photogrammetry">Drone Photogrammetry</option>
                    <option value="LiDAR">LiDAR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Instrumen</label>
                  <input
                    type="text"
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Deskripsi / Lokasi</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded cursor-pointer"
                >
                  Simpan Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Point Detail Modal */}
      <SurveyPointDetailModal
        point={selectedPoint}
        onClose={() => setSelectedPoint(null)}
        onValidatePoint={onValidatePoint}
        onOpenAIAnalyze={onOpenAIAnalyze}
      />
    </div>
  );
};
