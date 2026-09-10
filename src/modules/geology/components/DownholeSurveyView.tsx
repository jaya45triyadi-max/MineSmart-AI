// MINE SMART AI - Downhole Survey & Hole Deviation Management View

import React, { useState } from "react";
import {
  Compass,
  Plus,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  TrendingDown,
  Ruler,
  Layers,
} from "lucide-react";
import { DownholeSurveyRecord } from "../../../types/geologyTypes";

interface DownholeSurveyViewProps {
  surveys: DownholeSurveyRecord[];
  onAddSurvey?: (survey: DownholeSurveyRecord) => void;
}

export const DownholeSurveyView: React.FC<DownholeSurveyViewProps> = ({
  surveys,
  onAddSurvey,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBorehole, setSelectedBorehole] = useState<string>("ALL");
  const [selectedTool, setSelectedTool] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtered Surveys
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.boreholeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.surveyor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBorehole = selectedBorehole === "ALL" || s.boreholeCode === selectedBorehole;
    const matchesTool = selectedTool === "ALL" || s.surveyTool === selectedTool;
    return matchesSearch && matchesBorehole && matchesTool;
  });

  const uniqueBoreholes = Array.from(new Set(surveys.map((s) => s.boreholeCode)));

  // Form State
  const [formData, setFormData] = useState({
    boreholeCode: "BH-SGT-001",
    measuredDepthM: 60,
    inclinationDipDeg: -89.5,
    azimuthDeg: 90,
    trueVerticalDepthM: 59.98,
    deltaEastingM: 0.35,
    deltaNorthingM: 0.05,
    doglegSeverityDegPer30M: 0.25,
    surveyTool: "GYRO_SURVEY" as const,
    surveyor: "GeoSurv Specialist",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddSurvey) {
      onAddSurvey({
        id: `srv-${Date.now().toString().slice(-4)}`,
        companyId: "comp-01",
        siteId: "site-01",
        boreholeId: "bh-001",
        boreholeCode: formData.boreholeCode,
        measuredDepthM: Number(formData.measuredDepthM),
        inclinationDipDeg: Number(formData.inclinationDipDeg),
        azimuthDeg: Number(formData.azimuthDeg),
        trueVerticalDepthM: Number(formData.trueVerticalDepthM),
        deltaEastingM: Number(formData.deltaEastingM),
        deltaNorthingM: Number(formData.deltaNorthingM),
        doglegSeverityDegPer30M: Number(formData.doglegSeverityDegPer30M),
        surveyTool: formData.surveyTool,
        surveyor: formData.surveyor,
        validationStatus: "VALID",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Survey Records</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{surveys.length} Stasiun</div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-interval downhole logs</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Rata-rata Kemiringan (Dip)</span>
            <TrendingDown className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono">-89.1°</div>
          <p className="text-[11px] text-emerald-400 mt-1">Vertikalitas prima (&lt; 2° deviasi)</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Maks Dogleg Severity</span>
            <ArrowDownRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">0.35°/30m</div>
          <p className="text-[11px] text-slate-400 mt-1">Batas aman &lt; 1.5°/30m</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Status Validasi Deviasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">100% Valid</div>
          <p className="text-[11px] text-slate-400 mt-1">Gyro & Magnetic calibrated</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari borehole / surveyor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedBorehole}
              onChange={(e) => setSelectedBorehole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Borehole</option>
              {uniqueBoreholes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Alat Survey</option>
              <option value="GYRO_SURVEY">Gyro Survey</option>
              <option value="MAGNETIC_MULTI_SHOT">Magnetic Multi-Shot</option>
              <option value="ACOUSTIC_TELEVIEWER">Acoustic Televiewer</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Survey Deviasi</span>
          </button>
        </div>

        {/* Survey Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Borehole</th>
                <th className="py-2.5 px-3 text-right">Measured Depth (MD)</th>
                <th className="py-2.5 px-3 text-right">Inclination / Dip</th>
                <th className="py-2.5 px-3 text-right">Azimuth (°)</th>
                <th className="py-2.5 px-3 text-right">True Vertical Depth (TVD)</th>
                <th className="py-2.5 px-3 text-right">Δ Easting (m)</th>
                <th className="py-2.5 px-3 text-right">Δ Northing (m)</th>
                <th className="py-2.5 px-3 text-right">Dogleg Severity</th>
                <th className="py-2.5 px-3">Instrumen Survey</th>
                <th className="py-2.5 px-3">Surveyor</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500">
                    Tidak ada data survey yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredSurveys.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white font-mono">{srv.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{srv.measuredDepthM.toFixed(1)} m</td>
                    <td className="py-2.5 px-3 text-right font-mono text-sky-300">{srv.inclinationDipDeg.toFixed(1)}°</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-300">{srv.azimuthDeg.toFixed(1)}°</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{srv.trueVerticalDepthM.toFixed(2)} m</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">+{srv.deltaEastingM.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">+{srv.deltaNorthingM.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{srv.doglegSeverityDegPer30M.toFixed(2)}°/30m</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">
                        {srv.surveyTool.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{srv.surveyor}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {srv.validationStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Survey Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                Input Data Downhole Survey Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Borehole Code</label>
                  <select
                    value={formData.boreholeCode}
                    onChange={(e) => setFormData({ ...formData, boreholeCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    {uniqueBoreholes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Measured Depth (MD - m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.measuredDepthM}
                    onChange={(e) => setFormData({ ...formData, measuredDepthM: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Dip / Inclination (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.inclinationDipDeg}
                    onChange={(e) => setFormData({ ...formData, inclinationDipDeg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Azimuth (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.azimuthDeg}
                    onChange={(e) => setFormData({ ...formData, azimuthDeg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">TVD (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.trueVerticalDepthM}
                    onChange={(e) => setFormData({ ...formData, trueVerticalDepthM: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Instrumen Survey</label>
                  <select
                    value={formData.surveyTool}
                    onChange={(e) => setFormData({ ...formData, surveyTool: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="GYRO_SURVEY">Gyro Survey</option>
                    <option value="MAGNETIC_MULTI_SHOT">Magnetic Multi-Shot</option>
                    <option value="ACOUSTIC_TELEVIEWER">Acoustic Televiewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Surveyor</label>
                  <input
                    type="text"
                    value={formData.surveyor}
                    onChange={(e) => setFormData({ ...formData, surveyor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/30"
                >
                  Simpan Data Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
