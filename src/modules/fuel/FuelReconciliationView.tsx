// MINE SMART AI - Fuel Reconciliation & Meter Calibration View

import React, { useState } from "react";
import {
  RotateCcw,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Calendar,
  Building2,
  SlidersHorizontal,
  History,
  FileText,
  ShieldCheck
} from "lucide-react";
import {
  FuelReconciliation,
  FuelMeter,
  MeterCalibration
} from "../../types/fuelTypes";

interface FuelReconciliationViewProps {
  reconciliations: FuelReconciliation[];
  meters: FuelMeter[];
  calibrations: MeterCalibration[];
  onAddCalibration: (cal: MeterCalibration) => void;
  onAddReconciliation: (rec: FuelReconciliation) => void;
}

export const FuelReconciliationView: React.FC<FuelReconciliationViewProps> = ({
  reconciliations,
  meters,
  calibrations,
  onAddCalibration,
  onAddReconciliation
}) => {
  const [activeTab, setActiveTab] = useState<"reconciliation" | "meters" | "calibrations">("reconciliation");
  const [isCalibModalOpen, setIsCalibModalOpen] = useState(false);

  const [calibForm, setCalibForm] = useState({
    meterId: meters[0]?.id || "mtr-01",
    meterSerial: meters[0]?.serialNumber || "MTR-LC-88421",
    testVolume: 1000,
    beforeReading: 1250000,
    afterReading: 1251002,
    variance: 2,
    result: "Pass" as "Pass" | "Warning" | "Fail",
    calibratedBy: "Ir. Bambang (Sucofindo Certified Inspector)",
    nextCalibrationDate: "2026-10-15"
  });

  const handleCreateCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    const selMtr = meters.find(m => m.id === calibForm.meterId);
    const newCal: MeterCalibration = {
      id: `cal-${Date.now()}`,
      meterId: calibForm.meterId,
      meterSerial: selMtr?.serialNumber || calibForm.meterSerial,
      calibrationDate: new Date().toISOString().split("T")[0],
      beforeReading: Number(calibForm.beforeReading),
      testVolume: Number(calibForm.testVolume),
      afterReading: Number(calibForm.afterReading),
      variance: Number(calibForm.variance),
      result: calibForm.result,
      calibratedBy: calibForm.calibratedBy,
      nextCalibrationDate: calibForm.nextCalibrationDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddCalibration(newCal);
    setIsCalibModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "reconciliation" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Fuel Reconciliation Engine
          </button>
          <button
            onClick={() => setActiveTab("meters")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "meters" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Flowmeter Status
          </button>
          <button
            onClick={() => setActiveTab("calibrations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "calibrations" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Meter Calibration Logs ({calibrations.length})
          </button>
        </div>

        {activeTab === "calibrations" && (
          <button
            onClick={() => setIsCalibModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Input Kalibrasi Meter
          </button>
        )}
      </div>

      {/* TAB 1: FUEL RECONCILIATION ENGINE */}
      {activeTab === "reconciliation" && (
        <div className="space-y-6">
          {/* Formula Explanation Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Rumus Matematika Fuel Reconciliation Engine:</h3>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 flex flex-wrap items-center gap-2">
              <span>Expected Closing Stock = Opening Stock</span>
              <span>+ Receiving</span>
              <span>- Dispensing</span>
              <span>- Transfers Out</span>
              <span>+ Adjustments</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Laporan Rekonsiliasi Stok BBM Harian (Periodical Reconciliation)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Periode & Date</th>
                    <th className="px-4 py-3">Lokasi Tangki</th>
                    <th className="px-4 py-3 text-right">Opening</th>
                    <th className="px-4 py-3 text-right">Receiving (+)</th>
                    <th className="px-4 py-3 text-right">Dispensing (-)</th>
                    <th className="px-4 py-3 text-right">Expected Stock</th>
                    <th className="px-4 py-3 text-right">Physical Stock</th>
                    <th className="px-4 py-3 text-right">Variance (L / %)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {reconciliations.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-200">{rec.period}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{rec.date}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-amber-300">{rec.locationName}</td>
                      <td className="px-4 py-3 text-right font-mono">{rec.openingStock.toLocaleString()} L</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-400">+{rec.receiving.toLocaleString()} L</td>
                      <td className="px-4 py-3 text-right font-mono text-amber-400">-{rec.dispensing.toLocaleString()} L</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">{rec.expectedClosingStock.toLocaleString()} L</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sky-400">{rec.physicalClosingStock.toLocaleString()} L</td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${rec.variance === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                        {rec.variance} L ({rec.variancePercent}%)
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec.status === "Balanced" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLOWMETERS */}
      {activeTab === "meters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meters.map(m => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs text-slate-400">Serial Number Flowmeter</div>
                  <div className="text-lg font-black text-amber-400 font-mono">{m.serialNumber}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  m.calibrationStatus === "Pass" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400"
                }`}>
                  Status: {m.calibrationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Start Reading</div>
                  <div className="text-base font-bold text-slate-200 font-mono">{m.startReading.toLocaleString()} L</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Current Reading</div>
                  <div className="text-base font-bold text-amber-400 font-mono">{m.currentReading.toLocaleString()} L</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2">
                <span>Terakhir Kalibrasi: {m.lastCalibrationDate}</span>
                <span className="text-emerald-400 font-medium">Sucofindo Certified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CALIBRATIONS */}
      {activeTab === "calibrations" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100">Riwayat Certificate Kalibrasi Flowmeter</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Tanggal Kalibrasi</th>
                  <th className="px-4 py-3">Meter Serial</th>
                  <th className="px-4 py-3 text-right">Test Volume (L)</th>
                  <th className="px-4 py-3 text-right">Variance Meter (L)</th>
                  <th className="px-4 py-3">Hasil Test</th>
                  <th className="px-4 py-3">Inspektor Certified</th>
                  <th className="px-4 py-3 font-mono">Next Calibration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {calibrations.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-400 font-mono">{c.calibrationDate}</td>
                    <td className="px-4 py-3 font-bold text-amber-300 font-mono">{c.meterSerial}</td>
                    <td className="px-4 py-3 text-right font-mono">{c.testVolume.toLocaleString()} L</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">{c.variance} L</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {c.result}
                      </span>
                    </td>
                    <td className="px-4 py-3">{c.calibratedBy}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{c.nextCalibrationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Kalibrasi Meter */}
      {isCalibModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              Input Hasil Test Kalibrasi Flowmeter
            </h3>

            <form onSubmit={handleCreateCalibration} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Flowmeter ID</label>
                <select
                  value={calibForm.meterId}
                  onChange={e => setCalibForm({ ...calibForm, meterId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  {meters.map(m => (
                    <option key={m.id} value={m.id}>{m.serialNumber} (Current Reading: {m.currentReading.toLocaleString()} L)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Volume Uji Standard (Liter)</label>
                  <input
                    type="number"
                    value={calibForm.testVolume}
                    onChange={e => setCalibForm({ ...calibForm, testVolume: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deviasi Meter (Variance L)</label>
                  <input
                    type="number"
                    value={calibForm.variance}
                    onChange={e => setCalibForm({ ...calibForm, variance: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hasil Test</label>
                  <select
                    value={calibForm.result}
                    onChange={e => setCalibForm({ ...calibForm, result: e.target.value as "Pass" | "Warning" | "Fail" })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Pass">Pass</option>
                    <option value="Warning">Warning</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jadwal Kalibrasi Berikutnya</label>
                  <input
                    type="date"
                    value={calibForm.nextCalibrationDate}
                    onChange={e => setCalibForm({ ...calibForm, nextCalibrationDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Certified Inspector</label>
                <input
                  type="text"
                  value={calibForm.calibratedBy}
                  onChange={e => setCalibForm({ ...calibForm, calibratedBy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCalibModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Simpan Certificate Kalibrasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
