// MINE SMART AI - Sensor & Telematics Anomaly Center View

import React from "react";
import {
  Cpu,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Info,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import { PredictiveSensorAnomaly } from "../../types/predictiveTypes";

interface SensorAnomaliesViewProps {
  anomalies: PredictiveSensorAnomaly[];
  onOpenAIAssistant: () => void;
}

export const SensorAnomaliesView: React.FC<SensorAnomaliesViewProps> = ({
  anomalies,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-500" />
            <span>IoT Sensor & Telematics Anomaly Detection</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Memonitor sinyal sensor CAN-bus ECU, VIMS, hidrolik, suhu oli, dan vibrasi komponen untuk mendeteksi deviasi sebelum breakdown.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Sensor AI</span>
        </button>
      </div>

      {/* Sensor Architecture Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-emerald-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">IoT Telematics Architecture Status</h3>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            CAN-Bus & VIMS Ready
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sistem terhubung ke adapter telemetri unit (Komatsu VHMS, Cat VIMS, Cummins PowerCommand). Jika unit belum memiliki modul GPS/CAN, sistem menampilkan status "No sensor data connected".
        </p>
      </div>

      {/* Anomaly Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anomalies.map((sa) => (
          <div
            key={sa.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{sa.unitCode}</span>
                {sa.isSensorConnected ? (
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    <Wifi className="h-3 w-3" /> Live Connected
                  </span>
                ) : (
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                    <WifiOff className="h-3 w-3" /> No sensor data connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{sa.sensorName}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">ANOMALY TYPE</span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-500 uppercase">
                  {sa.anomalyType}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">MEASURED</span>
                  <span className="text-xl font-black text-rose-500">{sa.measuredValue} {sa.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">BASELINE</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{sa.baselineValue} {sa.unit}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">{sa.description}</p>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
              Detected: {new Date(sa.detectedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
