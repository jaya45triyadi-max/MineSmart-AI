import React, { useState } from "react";
import { Settings, Scale, Radio, CheckCircle2, ShieldCheck, Wrench, RefreshCw, AlertTriangle } from "lucide-react";
import { Weighbridge, WeighbridgeCalibration, ScaleDeviceReading } from "../../../types/weighbridgeTypes";

interface WeighbridgeSettingsTabProps {
  weighbridges: Weighbridge[];
  calibrations: WeighbridgeCalibration[];
  scaleReadings: ScaleDeviceReading[];
}

export const WeighbridgeSettingsTab: React.FC<WeighbridgeSettingsTabProps> = ({
  weighbridges,
  calibrations,
  scaleReadings,
}) => {
  const [overloadThresholdPercent, setOverloadThresholdPercent] = useState(5); // 5% over capacity
  const [varianceThresholdPercent, setVarianceThresholdPercent] = useState(2); // 2% max allowed variance

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            Konfigurasi Jembatan Timbang & Scale Hardware Interface
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pengaturan master weighbridge, integrasi protokol hardware indikator timbangan, sertifikasi kalibrasi metrologi, dan batas ambang toleransi.
          </p>
        </div>
      </div>

      {/* Scale Hardware Integration Architecture Info Box */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-emerald-300">SCALE HARDWARE INTEGRATION INTERFACE</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            GATEWAY ONLINE
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Arsitektur penghubung sensor timbangan mendukung sinyal serial RS485/RS232, Modbus TCP/IP, MQTT Gateway, REST API, dan Import Manual. Timbangan dikalibrasi untuk membedakan antara <span className="text-emerald-400 font-bold">Stable Weight Reading</span> vs <span className="text-amber-400 font-bold">Fluctuating Weight</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          {scaleReadings.map((sc) => (
            <div key={sc.deviceId} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{sc.deviceId}</span>
                <span className="text-emerald-400 font-bold">{sc.connectionStatus}</span>
              </div>
              <div className="text-slate-200 text-sm font-bold">{sc.scaleType}</div>
              <div className="text-emerald-400">Stable Reading: {sc.rawWeight.toLocaleString()} kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Toleransi Kapasitas Muatan (Overload Threshold)</h3>
          <p className="text-xs text-slate-500">Batas persentase kelebihan muatan terhadap kapasitas resmi unit truk sebelum memicu Overload Alert.</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={overloadThresholdPercent}
              onChange={(e) => setOverloadThresholdPercent(Number(e.target.value))}
              className="w-24 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-center text-sm"
            />
            <span className="text-xs text-slate-500">% Kelebihan Kapasitas Maksimum</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Batas Variansi Rekonsiliasi (Variance Threshold)</h3>
          <p className="text-xs text-slate-500">Batas toleransi selisih antara Tonase Timbangan vs Dispatch/Keuangan sebelum dikategorikan Major Variance.</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={varianceThresholdPercent}
              onChange={(e) => setVarianceThresholdPercent(Number(e.target.value))}
              className="w-24 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-center text-sm"
            />
            <span className="text-xs text-slate-500">% Variansi Maksimum Diizinkan</span>
          </div>
        </div>
      </div>

      {/* Metrology Calibration Records Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Sertifikasi & Riwayat Kalibrasi Metrologi Legal
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Kode Weighbridge</th>
                <th className="py-3 px-4">No. Sertifikat</th>
                <th className="py-3 px-4">Lembaga Penguji Metrologi</th>
                <th className="py-3 px-4">Tanggal Kalibrasi</th>
                <th className="py-3 px-4">Kalibrasi Berikutnya</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {calibrations.map((c) => (
                <tr key={c.calibrationId}>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.weighbridgeCode}</td>
                  <td className="py-3 px-4 font-mono">{c.certificateNumber}</td>
                  <td className="py-3 px-4">{c.performedBy}</td>
                  <td className="py-3 px-4">{new Date(c.calibrationDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-semibold">{new Date(c.nextCalibrationDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === "VALID" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-amber-100 text-amber-800"}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
