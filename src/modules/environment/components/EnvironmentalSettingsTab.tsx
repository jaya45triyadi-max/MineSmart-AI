import React from "react";
import { Settings, Sliders, CheckCircle2, ShieldAlert } from "lucide-react";

export const EnvironmentalSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Environmental Configuration & Threshold Settings
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan standar baku mutu air/udara, toleransi alarm alert otomatis & batas okupansi pengerukan sediment pond
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h3 className="font-bold text-white text-sm">
          Batas Baku Mutu & Ambang Batas Peringatan Dini (Alert Thresholds)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="font-bold text-white">Water Quality Effluent Limit (Permen LHK 113/2003)</span>
            <p className="text-slate-400">pH Target: 6.0 - 9.0 | TSS Maksimum: 400 mg/L | Fe: 7.0 mg/L | Mn: 4.0 mg/L</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Standard Active
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="font-bold text-white">Sediment Pond Dredging Trigger Level</span>
            <p className="text-slate-400">Trigger Alert Pengerukan: &gt; 75% Kapasitas Terisi Sedimen / Freeboard &lt; 2.0 Meter</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
              <ShieldAlert className="h-3 w-3" /> Auto Notification Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
