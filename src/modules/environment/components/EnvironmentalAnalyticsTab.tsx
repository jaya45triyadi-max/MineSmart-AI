import React from "react";
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Wind,
  Trash2,
  Mountain,
} from "lucide-react";

export const EnvironmentalAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Environmental Analytics & Water Balance Trends
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analisis tren parameter air (pH, TSS), tren debu harian, neraca air bulanan & efisiensi pengelolaan limbah
          </p>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend 1: Water Quality pH & TSS */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                Tren TSS Outfall Settling Pond Alpha (30 Hari)
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Rata-rata 185 mg/L</span>
          </div>

          <div className="h-40 flex items-end gap-2 pt-4 px-2">
            {[140, 160, 210, 180, 195, 170, 180, 220, 190, 175, 180, 165, 180].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-md bg-cyan-500/80 group-hover:bg-cyan-400 transition"
                  style={{ height: `${(val / 300) * 100}%` }}
                />
                <span className="text-[9px] text-slate-500">{idx + 1}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            Batas Maksimum Baku Mutu TSS: <strong className="text-white">400 mg/L</strong> (Seluruh sampel compliant).
          </p>
        </div>

        {/* Trend 2: PM10 Ambient Air Trend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Korelasi Trafik HD vs Konsentrasi Debu PM10
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Peak 68.9 µg/m³</span>
          </div>

          <div className="h-40 flex items-end gap-2 pt-4 px-2">
            {[35, 42, 58, 65, 68, 52, 45, 60, 55, 48, 52, 58, 54].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-400 transition"
                  style={{ height: `${(val / 100) * 100}%` }}
                />
                <span className="text-[9px] text-slate-500">{idx + 1}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            Batas Baku Mutu PM10: <strong className="text-white">75 µg/m³</strong> (Efisiensi penyiraman Water Truck 91%).
          </p>
        </div>
      </div>
    </div>
  );
};
