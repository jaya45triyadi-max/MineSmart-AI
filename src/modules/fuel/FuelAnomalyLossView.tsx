// MINE SMART AI - Fuel Anomaly Detection & Fuel Loss Investigation Center

import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  FileSearch,
  Sparkles,
  TrendingUp,
  UserCheck,
  Building2,
  FileText
} from "lucide-react";
import {
  FuelAnomaly,
  FuelLossAlert,
  FuelInvestigation,
  InvestigationStatus
} from "../../types/fuelTypes";

interface FuelAnomalyLossViewProps {
  anomalies: FuelAnomaly[];
  lossAlerts: FuelLossAlert[];
  investigations: FuelInvestigation[];
  onUpdateAnomalyStatus: (id: string, status: "Active" | "Investigating" | "Resolved" | "False Positive") => void;
  onUpdateInvestigationStatus: (id: string, status: InvestigationStatus, resolution?: string) => void;
  onAddInvestigation: (inv: FuelInvestigation) => void;
}

export const FuelAnomalyLossView: React.FC<FuelAnomalyLossViewProps> = ({
  anomalies,
  lossAlerts,
  investigations,
  onUpdateAnomalyStatus,
  onUpdateInvestigationStatus,
  onAddInvestigation
}) => {
  const [activeTab, setActiveTab] = useState<"anomalies" | "loss-detection" | "investigations">("anomalies");
  const [selectedAlertForInv, setSelectedAlertForInv] = useState<FuelLossAlert | null>(null);

  const [invForm, setInvForm] = useState({
    assignedTo: "Hendra Kurniawan (Fuel Supervisor)",
    finding: "Pemeriksaan akurasi flowmeter MTR-LC-99304 dan verifikasi dipstick manual shift malam.",
    evidence1: "Sucofindo Meter Calibration Certificate #99304",
    evidence2: "CCTV Log Area Stasiun Pit A 22:00 - 06:00",
    action: "Dilakukan re-kalibrasi flowmeter dan penyesuaian tiket adjustment ADJ-01 (-120 Liter).",
    resolution: "Deviasi disebabkan oleh keausan mekanis flowmeter (-120 L) dan temperatur shrinkage (-10 L). Tidak ditemukan bukti kecurangan (No Theft Identified)."
  });

  const handleStartInvestigation = (alert: FuelLossAlert) => {
    setSelectedAlertForInv(alert);
    setActiveTab("investigations");
  };

  const handleSaveInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForInv) return;

    const newInv: FuelInvestigation = {
      id: `inv-${Date.now()}`,
      alertId: selectedAlertForInv.id,
      locationName: selectedAlertForInv.locationName,
      assignedTo: invForm.assignedTo,
      finding: invForm.finding,
      evidence: [invForm.evidence1, invForm.evidence2].filter(Boolean),
      action: invForm.action,
      resolution: invForm.resolution,
      closedBy: "Bambang M. (Fuel Manager)",
      closedAt: new Date().toISOString(),
      status: "Resolved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddInvestigation(newInv);
    setSelectedAlertForInv(null);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "Critical":
        return <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">CRITICAL</span>;
      case "High":
        return <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">HIGH</span>;
      case "Medium":
        return <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab("anomalies")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "anomalies" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          AI Fuel Anomaly Detection ({anomalies.filter(a => a.status === "Active" || a.status === "Investigating").length})
        </button>
        <button
          onClick={() => setActiveTab("loss-detection")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "loss-detection" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Potential Fuel Loss Alerts ({lossAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab("investigations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "investigations" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Investigation Center ({investigations.length})
        </button>
      </div>

      {/* TAB 1: ANOMALIES */}
      {activeTab === "anomalies" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-slate-300">
                <span className="font-bold text-amber-300">Automated Background Anomaly Engine:</span> Mengidentifikasi lonjakan konsumsi, idle berlebih, dan inefisiensi per jam/ton/km berdasarkan Moving Average & Standard deviation.
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              AI Confidence Threshold: &gt;85%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {anomalies.map(anom => (
              <div key={anom.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400">{anom.equipmentCode}</span>
                    <span className="text-xs text-slate-400 ml-2">({anom.equipmentType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(anom.severity)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {anom.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" /> {anom.type}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {anom.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Baseline Standard</div>
                    <div className="text-slate-200 font-bold">{anom.baselineValue}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Aktual Reading</div>
                    <div className="text-amber-400 font-bold">{anom.actualValue} (+{anom.deviationPercent}%)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Deteksi: {anom.detectionMethod} (Conf: {(anom.confidence * 100).toFixed(0)}%)</span>
                  {anom.status === "Active" && (
                    <button
                      onClick={() => onUpdateAnomalyStatus(anom.id, "Investigating")}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-500/30"
                    >
                      Mulai Investigasi
                    </button>
                  )}
                  {anom.status === "Investigating" && (
                    <button
                      onClick={() => onUpdateAnomalyStatus(anom.id, "Resolved")}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-500/30"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOSS DETECTION ALERTS */}
      {activeTab === "loss-detection" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Potential Fuel Loss Detection Alerts
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Indikasi deviasi stok berlebih yang membutuhkan klasifikasi penyebab dan verifikasi bukti.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {lossAlerts.map(alert => (
              <div key={alert.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <span>{alert.locationName}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Variance: {alert.variance} L ({alert.variancePercent}%)
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{alert.period} • Detected: {alert.detectedAt}</div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    Status: {alert.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-slate-200">Kemungkinan Penyebab (Possible Causes):</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-0.5 pl-2">
                    {alert.possibleCauses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleStartInvestigation(alert)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <FileSearch className="w-4 h-4" />
                    Buka Kasus Investigasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVESTIGATIONS */}
      {activeTab === "investigations" && (
        <div className="space-y-6">
          {/* New Investigation Form if triggered */}
          {selectedAlertForInv && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-amber-400" />
                Form Investigasi Kasus Deviasi: {selectedAlertForInv.locationName}
              </h3>

              <form onSubmit={handleSaveInvestigation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Investigator</label>
                  <input
                    type="text"
                    value={invForm.assignedTo}
                    onChange={e => setInvForm({ ...invForm, assignedTo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Temuan Lapangan (Finding)</label>
                  <textarea
                    value={invForm.finding}
                    onChange={e => setInvForm({ ...invForm, finding: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 h-20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Bukti 1 (Evidence Cert/CCTV)</label>
                    <input
                      type="text"
                      value={invForm.evidence1}
                      onChange={e => setInvForm({ ...invForm, evidence1: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bukti 2 (Log Sheet / Photo)</label>
                    <input
                      type="text"
                      value={invForm.evidence2}
                      onChange={e => setInvForm({ ...invForm, evidence2: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tindakan Koreksi (Action Taken)</label>
                  <input
                    type="text"
                    value={invForm.action}
                    onChange={e => setInvForm({ ...invForm, action: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Kesimpulan & Resolusi Kasus</label>
                  <textarea
                    value={invForm.resolution}
                    onChange={e => setInvForm({ ...invForm, resolution: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 h-20"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAlertForInv(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                  >
                    Simpan & Close Kasus
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Investigations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Daftar Laporan Investigasi Fuel Loss</h3>

            <div className="space-y-4">
              {investigations.map(inv => (
                <div key={inv.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="font-bold text-slate-100">{inv.locationName}</div>
                      <div className="text-xs text-slate-400">Investigator: {inv.assignedTo}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      {inv.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-bold text-amber-300">Temuan (Finding): </span>
                      <span className="text-slate-300">{inv.finding}</span>
                    </div>

                    <div>
                      <span className="font-bold text-amber-300">Bukti Verifikasi (Evidence): </span>
                      <span className="text-slate-400 font-mono">{inv.evidence.join(", ")}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-emerald-300 font-medium">
                      <span className="font-bold">Resolusi Kasus: </span>{inv.resolution}
                    </div>
                  </div>

                  {inv.closedAt && (
                    <div className="text-[10px] text-slate-500 text-right pt-1 font-mono">
                      Closed by {inv.closedBy} on {new Date(inv.closedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
