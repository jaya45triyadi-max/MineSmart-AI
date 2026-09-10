import React, { useState } from "react";
import {
  QrCode,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  PackageCheck,
  Printer,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileSpreadsheet,
} from "lucide-react";
import { LabSample, SampleType, SamplePriority } from "../../../types/laboratoryTypes";

interface SamplingTabProps {
  samples: LabSample[];
  onRegisterSample: (sample: Partial<LabSample>) => void;
}

export const SamplingTab: React.FC<SamplingTabProps> = ({ samples, onRegisterSample }) => {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSampleForQR, setSelectedSampleForQR] = useState<LabSample | null>(samples[0] || null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form State for new sample
  const [newSampleType, setNewSampleType] = useState<SampleType>("ROM");
  const [newSourceName, setNewSourceName] = useState("Pit Alpha - Seam A2");
  const [newSourceType, setNewSourceType] = useState<"PIT" | "STOCKPILE" | "PROCESSING" | "BARGE" | "BOREHOLE" | "OTHER">("PIT");
  const [newCollectorName, setNewCollectorName] = useState("Bambang Sujipto");
  const [newWeight, setNewWeight] = useState(12.5);
  const [newPriority, setNewPriority] = useState<SamplePriority>("NORMAL");
  const [newRemarks, setNewRemarks] = useState("");
  const [newSealNo, setNewSealNo] = useState("SL-BNU-88230");

  const filteredSamples = samples.filter((s) => {
    const matchesType = filterType === "ALL" || s.sampleType === filterType;
    const matchesSearch =
      s.sampleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmitNewSample = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SMP-2026-0813-00${samples.length + 1}`;
    onRegisterSample({
      sampleCode: code,
      sampleType: newSampleType,
      sourceType: newSourceType,
      sourceId: "SRC-GEN-01",
      sourceName: newSourceName,
      location: {
        area: "Pit Alpha South Zone",
        latitude: -1.2485,
        longitude: 116.8921,
      },
      samplingDate: new Date().toISOString().split("T")[0],
      samplingTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      shift: "SHIFT_1",
      collectorId: "USR-SMP-CURRENT",
      collectorName: newCollectorName,
      sampleWeightKg: Number(newWeight),
      status: "COLLECTED",
      priority: newPriority,
      remarks: newRemarks,
      qrCode: `QR-${code}`,
      barcode: `89912345600${samples.length + 1}`,
      chainOfCustody: {
        collectedBy: newCollectorName,
        collectedDate: `${new Date().toISOString().split("T")[0]} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} WITA`,
        laboratory: "Central Site Lab Sangatta",
        sampleCondition: "Intact Sealed Sample Bag",
        sealNumber: newSealNo,
        storageLocation: "Receiving Rack R-01",
        transferHistory: [],
      },
    });
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-500" /> Sampling Management & Chain of Custody
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan jadwal sampling, identifikasi sampel, pelabelan QR/Barcode, dan serah-terima sampel laboratorium.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Form Sampling Baru
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode sample, lokasi, sampler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {["ALL", "ROM", "STOCKPILE", "PROCESSING", "SHIPMENT", "BOREHOLE", "CHECK_SAMPLE"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                filterType === t
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sampling Table & Selected Sample QR Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Table: Sampling Cards / List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Daftar Sampel Lapangan ({filteredSamples.length})
            </h3>
            <div className="space-y-3">
              {filteredSamples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => setSelectedSampleForQR(sample)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedSampleForQR?.id === sample.id
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {sample.sampleCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                        {sample.sampleType}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sample.priority === "URGENT"
                            ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {sample.priority}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {sample.samplingDate} {sample.samplingTime}
                    </div>
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Sumber: {sample.sourceName}
                  </div>

                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <div>
                      <span>Sampler: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{sample.collectorName}</strong>
                    </div>
                    <div>
                      <span>Berat: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{sample.sampleWeightKg} kg</strong>
                    </div>
                    <div>
                      <span>Segel: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{sample.chainOfCustody.sealNumber}</strong>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        {sample.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details: Digital QR Tag & Chain of Custody */}
        {selectedSampleForQR && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-500" /> Tagging & QR Identity
                </h3>
                <button
                  onClick={() => alert(`Mencetak label QR untuk ${selectedSampleForQR.sampleCode}...`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tag
                </button>
              </div>

              {/* Tag Mock Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-center space-y-3 border border-slate-800">
                <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-sans font-bold">
                  PT BATUBARA NUSA UTAMA — LAB SAMPLE
                </div>

                <div className="p-3 bg-white text-slate-950 rounded-lg inline-block border-2 border-slate-900">
                  <div className="w-28 h-28 mx-auto flex items-center justify-center bg-slate-100 border border-dashed border-slate-400 font-sans text-xs text-slate-500 font-bold p-2 text-center">
                    [QR CODE]<br />
                    {selectedSampleForQR.qrCode}
                  </div>
                </div>

                <div className="text-base font-bold text-emerald-400 tracking-wider">
                  {selectedSampleForQR.sampleCode}
                </div>
                <div className="text-xs font-sans text-slate-300">
                  {selectedSampleForQR.sourceName}
                </div>
                <div className="text-[11px] font-sans text-slate-400 flex items-center justify-center gap-2">
                  <span>Weight: {selectedSampleForQR.sampleWeightKg} kg</span> •{" "}
                  <span>Seal: {selectedSampleForQR.chainOfCustody.sealNumber}</span>
                </div>
              </div>

              {/* Chain of Custody History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Chain of Custody Log
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>Collected By:</strong> {selectedSampleForQR.chainOfCustody.collectedBy} ({selectedSampleForQR.chainOfCustody.collectedDate})
                  </p>
                  <p>
                    <strong>Lab Receiving Tech:</strong> {selectedSampleForQR.chainOfCustody.receivedBy || "Pending Acceptance"}
                  </p>
                  <p>
                    <strong>Condition:</strong> {selectedSampleForQR.chainOfCustody.sampleCondition}
                  </p>
                  <p>
                    <strong>Storage Shelf:</strong> {selectedSampleForQR.chainOfCustody.storageLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Sampling Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Form Regristrasi Sample Baru
            </h3>
            <form onSubmit={handleSubmitNewSample} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Kategori Sample Type
                </label>
                <select
                  value={newSampleType}
                  onChange={(e) => setNewSampleType(e.target.value as SampleType)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="ROM">ROM Coal</option>
                  <option value="STOCKPILE">Stockpile Product</option>
                  <option value="PROCESSING">Processing Crusher Plant</option>
                  <option value="SHIPMENT">Barge Shipment</option>
                  <option value="BOREHOLE">Borehole Drill Core</option>
                  <option value="CHECK_SAMPLE">Check / Quality Anomaly Sample</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Nama Sumber / Pit / Stockpile
                </label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Petugas Sampler
                  </label>
                  <input
                    type="text"
                    value={newCollectorName}
                    onChange={(e) => setNewCollectorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Berat Sample (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Segel (Seal No.)
                  </label>
                  <input
                    type="text"
                    value={newSealNo}
                    onChange={(e) => setNewSealNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Prioritas
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as SamplePriority)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Catatan</label>
                <textarea
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  Simpan & Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
