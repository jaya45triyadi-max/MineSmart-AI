import React, { useState } from "react";
import {
  Droplets,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  BarChart3,
  Calendar,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  X,
} from "lucide-react";
import {
  WaterSample,
  WaterQualityResult,
  WaterDischargeRecord,
  WaterBalanceSummary,
  WaterSampleType,
} from "../../../types/environmentTypes";

interface Props {
  waterSamples: WaterSample[];
  qualityResults: WaterQualityResult[];
  discharges: WaterDischargeRecord[];
  waterBalance: WaterBalanceSummary | null;
  onAddSample: (sample: Omit<WaterSample, "id" | "createdAt" | "updatedAt">) => void;
}

export const WaterManagementTab: React.FC<Props> = ({
  waterSamples,
  qualityResults,
  discharges,
  waterBalance,
  onAddSample,
}) => {
  const [selectedSampleType, setSelectedSampleType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<WaterSample | null>(null);

  // Modal Form State
  const [sampleNumber, setSampleNumber] = useState(`SPL-${Date.now().toString().slice(-6)}`);
  const [monitoringPointName, setMonitoringPointName] = useState("Outfall Sediment Pond Alpha 1");
  const [sampleType, setSampleType] = useState<WaterSampleType>("DISCHARGE_WATER");
  const [sampleDate, setSampleDate] = useState(new Date().toISOString().split("T")[0]);
  const [sampleTime, setSampleTime] = useState("08:00");
  const [weatherCondition, setWeatherCondition] = useState("Cerah");
  const [collectorName, setCollectorName] = useState("Ahmad Dahlan");
  const [laboratoryName, setLaboratoryName] = useState("PT Sucofindo Lab");

  const filteredSamples = waterSamples.filter((s) => {
    const matchesType = selectedSampleType === "ALL" || s.sampleType === selectedSampleType;
    const matchesSearch =
      s.sampleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.monitoringPointName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSample({
      sampleId: `SAMP-WAT-${Date.now()}`,
      sampleNumber,
      companyId: "COMP-01",
      siteId: "SITE-01",
      monitoringPointId: "mp-1",
      monitoringPointName,
      sampleDate,
      sampleTime,
      sampleType,
      weatherCondition,
      collectorName,
      laboratoryName,
      chainOfCustodyNumber: `COC-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "SCHEDULED",
      notes: "Catatan pengambilan sampel air otomatis.",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Water Management & Effluent Control
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pemantauan kualitas air tambang (pH, TSS, Fe, Mn), debit discharge settling pond & neraca air (Water Balance Model)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-md self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Catat Sampel Air Baru
        </button>
      </div>

      {/* Water Balance Analytical Card */}
      {waterBalance && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                Water Balance Model (Neraca Air Site Pit Alpha - {waterBalance.date})
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Kapasitas Total Storage: 156,000 m³
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Opening Storage</span>
              <p className="text-sm font-bold text-white mt-1">
                {waterBalance.openingStorageM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-900/40">
              <span className="text-emerald-400 text-[11px] flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Inflow Hujan
              </span>
              <p className="text-sm font-bold text-emerald-300 mt-1">
                +{waterBalance.inflowRainfallM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-900/40">
              <span className="text-emerald-400 text-[11px] flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Pompa Pit Water
              </span>
              <p className="text-sm font-bold text-emerald-300 mt-1">
                +{waterBalance.inflowPitWaterM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-amber-950/20 p-3 border border-amber-900/40">
              <span className="text-amber-400 text-[11px] flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> Air Crusher
              </span>
              <p className="text-sm font-bold text-amber-300 mt-1">
                -{waterBalance.usageCrusherM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-amber-950/20 p-3 border border-amber-900/40">
              <span className="text-amber-400 text-[11px] flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> Penyiraman Jalan
              </span>
              <p className="text-sm font-bold text-amber-300 mt-1">
                -{waterBalance.usageRoadWateringM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-cyan-950/20 p-3 border border-cyan-900/40">
              <span className="text-cyan-400 text-[11px] flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> Discharge
              </span>
              <p className="text-sm font-bold text-cyan-300 mt-1">
                -{waterBalance.dischargeVolumeM3.toLocaleString()} m³
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-700">
              <span className="text-slate-300 font-semibold text-[11px]">Closing Storage</span>
              <p className="text-sm font-extrabold text-cyan-400 mt-1">
                {waterBalance.closingStorageM3.toLocaleString()} m³
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari sampel, nomor SPL, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedSampleType}
            onChange={(e) => setSelectedSampleType(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Semua Jenis Water Sample</option>
            <option value="DISCHARGE_WATER">Discharge Water (Air Limbah)</option>
            <option value="PIT_WATER">Pit Water (Air Tambang)</option>
            <option value="SURFACE_WATER">Surface Water (Air Permukaan)</option>
            <option value="GROUNDWATER">Groundwater (Air Tanah)</option>
            <option value="DOMESTIC_WASTEWATER">Domestic Wastewater</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Menampilkan {filteredSamples.length} dari {waterSamples.length} sampel
        </span>
      </div>

      {/* Water Samples Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">No. Sampel / ID</th>
                <th className="px-4 py-3.5">Titik Pantau & Lokasi</th>
                <th className="px-4 py-3.5">Tanggal & Waktu</th>
                <th className="px-4 py-3.5">Tipe Air</th>
                <th className="px-4 py-3.5">Petugas Sampling</th>
                <th className="px-4 py-3.5">Laboratorium</th>
                <th className="px-4 py-3.5">Status Pengujian</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    {sample.sampleNumber}
                    <div className="text-[10px] font-normal text-slate-500">
                      {sample.chainOfCustodyNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-200">{sample.monitoringPointName}</p>
                    <p className="text-[10px] text-slate-400">{sample.weatherCondition}</p>
                  </td>
                  <td className="px-4 py-3">
                    {sample.sampleDate}
                    <div className="text-[10px] text-slate-500">{sample.sampleTime} WITA</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-400 border border-cyan-500/20">
                      {sample.sampleType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{sample.collectorName}</td>
                  <td className="px-4 py-3 text-slate-400">{sample.laboratoryName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                        sample.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : sample.status === "TESTED"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {sample.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                      {sample.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedSample(sample)}
                      className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:bg-slate-700 hover:text-white transition"
                    >
                      Hasil Lab
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Sample Result Modal / Detail Viewer */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  Hasil Pengujian Laboratorium - {selectedSample.sampleNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedSample.monitoringPointName} ({selectedSample.sampleDate})
                </p>
              </div>
              <button
                onClick={() => setSelectedSample(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Parameter Kualitas Air vs Baku Mutu (Permen LHK 113/2003)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {qualityResults
                  .filter((r) => r.sampleId === selectedSample.id)
                  .map((res) => (
                    <div
                      key={res.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {res.parameter}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            res.complianceStatus === "COMPLIANT"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {res.complianceStatus}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-cyan-400">
                          {res.value}
                        </span>
                        <span className="text-xs text-slate-400">{res.unit}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Baku Mutu: {res.standardLimitMin ?? 0} - {res.standardLimitMax ?? "-"} {res.unit}
                      </p>
                      <p className="text-[10px] text-slate-500">Metode: {res.method}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-slate-800">
              <button
                onClick={() => setSelectedSample(null)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Sample Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Formulir Pengambilan Sampel Air
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Nomor Sampel / Sample Number
                </label>
                <input
                  type="text"
                  required
                  value={sampleNumber}
                  onChange={(e) => setSampleNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Titik Pemantauan Air
                </label>
                <select
                  value={monitoringPointName}
                  onChange={(e) => setMonitoringPointName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Outfall Sediment Pond Alpha 1">Outfall Sediment Pond Alpha 1</option>
                  <option value="Sungai Barito Station Inlet">Sungai Barito Station Inlet</option>
                  <option value="Sump Main Pit Alpha">Sump Main Pit Alpha</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Jenis Air
                  </label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value as WaterSampleType)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="DISCHARGE_WATER">Discharge Water</option>
                    <option value="PIT_WATER">Pit Water</option>
                    <option value="SURFACE_WATER">Surface Water</option>
                    <option value="GROUNDWATER">Groundwater</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Tanggal Sampling
                  </label>
                  <input
                    type="date"
                    value={sampleDate}
                    onChange={(e) => setSampleDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Petugas Sampling
                  </label>
                  <input
                    type="text"
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Laboratorium Penguji
                  </label>
                  <input
                    type="text"
                    value={laboratoryName}
                    onChange={(e) => setLaboratoryName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
                >
                  Simpan Sampel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
