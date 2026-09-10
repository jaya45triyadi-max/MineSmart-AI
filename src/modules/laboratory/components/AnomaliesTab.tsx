import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { QualityAnomaly, AnomalyStatus } from "../../../types/laboratoryTypes";

interface AnomaliesTabProps {
  anomalies: QualityAnomaly[];
  onAcknowledgeAnomaly: (anomalyId: string) => void;
  onResolveAnomaly: (anomalyId: string, notes: string) => void;
}

export const AnomaliesTab: React.FC<AnomaliesTabProps> = ({
  anomalies,
  onAcknowledgeAnomaly,
  onResolveAnomaly,
}) => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<QualityAnomaly | null>(anomalies[0] || null);
  const [resolutionText, setResolutionText] = useState("");

  const handleResolve = () => {
    if (!selectedAnomaly) return;
    onResolveAnomaly(selectedAnomaly.anomalyId, resolutionText || "Diverted stock and updated blending setpoint.");
    alert(`Anomali ${selectedAnomaly.anomalyCode} berhasil diselesaikan!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> Deteksi Anomali Kualitas AI & Investigasi CAPA
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem deteksi otomatis lonjakan parameter abnormal (Sulfur, Moisture, Ash, GCV) dan manajemen tindakan korektif (CAPA).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anomaly List */}
        <div className="lg:col-span-2 space-y-3">
          {anomalies.map((ano) => (
            <div
              key={ano.id}
              onClick={() => setSelectedAnomaly(ano)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedAnomaly?.id === ano.id
                  ? "border-red-500 bg-red-50/20 dark:bg-red-950/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    {ano.anomalyCode}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {ano.sourceName}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    ano.severity === "CRITICAL"
                      ? "bg-red-600 text-white"
                      : ano.severity === "HIGH"
                      ? "bg-amber-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {ano.severity}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Parameter: {ano.parameter} • Nilai Terdeteksi: <strong className="text-red-600 dark:text-red-400">{ano.observedValue} {ano.unit}</strong> vs Ekspektasi {ano.expectedValue} {ano.unit} ({ano.deviationPercent > 0 ? `+${ano.deviationPercent}%` : `${ano.deviationPercent}%`})
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <span>Method: {ano.detectionMethod}</span>
                <span>Status: <strong className="text-slate-800 dark:text-slate-200">{ano.status}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: CAPA Resolution Detail */}
        {selectedAnomaly && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-mono text-xs font-bold text-red-500">{selectedAnomaly.anomalyCode}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Form Investigasi Anomali
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p><strong>Sumber:</strong> {selectedAnomaly.sourceName}</p>
                <p><strong>Terdeteksi Pada:</strong> {selectedAnomaly.detectedAt}</p>
                <p><strong>Deviasi:</strong> {selectedAnomaly.deviation} {selectedAnomaly.unit} ({selectedAnomaly.deviationPercent}%)</p>
                <p><strong>Akar Masalah (Root Cause):</strong> {selectedAnomaly.rootCauseCategory || "Penyusupan Pyrite / Air Hujan"}</p>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Tindakan Penanganan CAPA (Corrective Action)
                </label>
                <textarea
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Isi rencana atau tindakan yang telah diambil (misal: pengalihan dumping, blending 60:40)..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onAcknowledgeAnomaly(selectedAnomaly.anomalyId)}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition"
                >
                  Acknowledge Anomaly
                </button>
                <button
                  onClick={handleResolve}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Resolve & Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
