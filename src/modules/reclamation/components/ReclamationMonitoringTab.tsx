import React, { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  Camera,
  Activity,
} from "lucide-react";
import {
  ReclamationMonitoringPoint,
  ReclamationMonitoringForm,
} from "../../../types/reclamationTypes";

interface Props {
  monitoringPoints: ReclamationMonitoringPoint[];
  forms: ReclamationMonitoringForm[];
  onAddForm: (form: Omit<ReclamationMonitoringForm, "id">) => void;
}

export const ReclamationMonitoringTab: React.FC<Props> = ({
  monitoringPoints,
  forms,
  onAddForm,
}) => {
  const [selectedPointId, setSelectedPointId] = useState<string>(
    monitoringPoints[0]?.monitoringPointId || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [date, setDate] = useState("2026-08-14");
  const [inspectorName, setInspectorName] = useState("Siti Rahmawati, S.Si");
  const [plantHealth, setPlantHealth] = useState<"GOOD" | "FAIR" | "POOR" | "CRITICAL">("GOOD");
  const [survivalRatePercent, setSurvivalRatePercent] = useState<number>(88);
  const [vegetationCoveragePercent, setVegetationCoveragePercent] = useState<number>(80);
  const [bareAreaPercent, setBareAreaPercent] = useState<number>(20);
  const [erosionSeverity, setErosionSeverity] = useState<"NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("LOW");
  const [drainageCondition, setDrainageCondition] = useState<"GOOD" | "PARTIALLY_BLOCKED" | "BLOCKED" | "DAMAGED">("GOOD");
  const [soilCondition, setSoilCondition] = useState("Humus topsoil lembab, pH 6.0");
  const [pestDiseasePresent, setPestDiseasePresent] = useState(false);
  const [remarks, setRemarks] = useState("Pertumbuhan tajuk rapat, tidak ditemukan indikasi hama berat.");
  const [replantingRequired, setReplantingRequired] = useState(false);

  const selectedPoint = monitoringPoints.find((p) => p.monitoringPointId === selectedPointId) || monitoringPoints[0];
  const pointForms = forms.filter((f) => f.monitoringPointId === selectedPointId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddForm({
      monitoringPointId: selectedPointId,
      date,
      inspectorName,
      plantHealth,
      survivalRatePercent,
      vegetationCoveragePercent,
      bareAreaPercent,
      erosionSeverity,
      drainageCondition,
      soilCondition,
      pestDiseasePresent,
      gpsCoordinates: selectedPoint ? `Lat ${selectedPoint.latitude}, Long ${selectedPoint.longitude}` : "GPS Field Recorded",
      remarks,
      replantingRequired,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-400" />
            Reclamation Field Monitoring & Inspection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pemantauan berkala keberhasilan revegetasi, tingkat penutupan tajuk (vegetation coverage %), erosi, serta jadwal pemantauan lapangan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" /> Input Pemantauan Lapangan
        </button>
      </div>

      {/* Grid Monitoring Points & Inspection Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitoring Points Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Titik Pantau Reklamasi (RMP)</h3>
          {monitoringPoints.map((pt) => (
            <div
              key={pt.id}
              onClick={() => setSelectedPointId(pt.monitoringPointId)}
              className={`rounded-2xl p-4 border transition cursor-pointer space-y-2 ${
                selectedPointId === pt.monitoringPointId
                  ? "border-emerald-500 bg-slate-900 shadow-md shadow-emerald-500/5"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400">{pt.monitoringPointId}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    pt.status === "NORMAL"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {pt.status}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs">{pt.locationName}</h4>
              <p className="text-xs text-slate-400">{pt.areaName}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Frekuensi: <strong className="text-slate-300">{pt.frequency}</strong></span>
                <span>Jadwal Berikut: <strong className="text-amber-400">{pt.nextMonitoringDate}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Point Inspection Log */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPoint && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                    {selectedPoint.monitoringPointId} • {selectedPoint.areaName}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedPoint.locationName}</h3>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span className="block">Inspector: <strong className="text-slate-200">{selectedPoint.responsiblePerson}</strong></span>
                  <span className="block text-[11px]">GPS: {selectedPoint.latitude}, {selectedPoint.longitude}</span>
                </div>
              </div>

              {/* Log Forms History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Riwayat Inspeksi Lapangan:</h4>
                {pointForms.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">
                    Belum ada catatan laporan pemantauan untuk titik pantau ini.
                  </p>
                ) : (
                  pointForms.map((form) => (
                    <div key={form.id} className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-400" /> Tgl Inspeksi: {form.date}
                        </span>
                        <span className="text-slate-400">Inspektur: <strong className="text-slate-200">{form.inspectorName}</strong></span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Kesehatan Pohon</span>
                          <strong className="text-emerald-400 font-bold">{form.plantHealth}</strong>
                        </div>
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Survival Rate</span>
                          <strong className="text-emerald-400 font-bold">{form.survivalRatePercent}%</strong>
                        </div>
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Penutupan Tajuk</span>
                          <strong className="text-cyan-400 font-bold">{form.vegetationCoveragePercent}%</strong>
                        </div>
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Tingkat Erosi</span>
                          <strong className="text-amber-400 font-bold">{form.erosionSeverity}</strong>
                        </div>
                      </div>

                      <p className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/60">
                        <strong className="text-slate-400">Catatan Lapangan:</strong> {form.remarks}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Monitoring Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-emerald-400" /> Form Input Pemantauan Lapangan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Titik Pantau RMP</label>
                  <select
                    value={selectedPointId}
                    onChange={(e) => setSelectedPointId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {monitoringPoints.map((pt) => (
                      <option key={pt.id} value={pt.monitoringPointId}>
                        {pt.monitoringPointId} - {pt.locationName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Inspeksi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Inspektur</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kesehatan Tanaman</label>
                  <select
                    value={plantHealth}
                    onChange={(e) => setPlantHealth(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GOOD">GOOD (Sehat)</option>
                    <option value="FAIR">FAIR (Cukup)</option>
                    <option value="POOR">POOR (Kurang Sehat)</option>
                    <option value="CRITICAL">CRITICAL (Kritis)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Survival Rate (%)</label>
                  <input
                    type="number"
                    value={survivalRatePercent}
                    onChange={(e) => setSurvivalRatePercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Coverage (%)</label>
                  <input
                    type="number"
                    value={vegetationCoveragePercent}
                    onChange={(e) => setVegetationCoveragePercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bare Area (%)</label>
                  <input
                    type="number"
                    value={bareAreaPercent}
                    onChange={(e) => setBareAreaPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Catatan Observasi Lapangan</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Simpan Laporan Pemantauan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
