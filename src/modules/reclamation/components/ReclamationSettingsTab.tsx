import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Key,
  CheckCircle2,
  Bell,
  Sliders,
  Database,
} from "lucide-react";

export const ReclamationSettingsTab: React.FC = () => {
  const [targetSurvivalRate, setTargetSurvivalRate] = useState(80);
  const [targetDensity, setTargetDensity] = useState(625);
  const [costBenchmark, setCostBenchmark] = useState(130000000);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg("Pengaturan modul Reclamation Management berhasil diperbarui.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          Reclamation Module Settings & Standards Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Konfigurasi ambang batas kelangsungan hidup bibit, kerapatan tanam standar, acuan biaya per hektare, dan otorisasi lisensi RBAC.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sliders className="h-4 w-4 text-emerald-400" /> Standar Mutu Revegetasi & Cost Benchmarks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Survival Rate Minimal (%)</label>
              <input
                type="number"
                value={targetSurvivalRate}
                onChange={(e) => setTargetSurvivalRate(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standar kelulusan keberhasilan penanaman</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kerapatan Tanam Standar (plants/ha)</label>
              <input
                type="number"
                value={targetDensity}
                onChange={(e) => setTargetDensity(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Spasi tanam 4m x 4m = 625 tanaman/ha</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Acuan Cost per Hectare Maksimal (IDR / ha)</label>
            <input
              type="number"
              value={costBenchmark}
              onChange={(e) => setCostBenchmark(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* License & RBAC Summary */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" /> License Entitlement & RBAC Permissions
          </h3>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>• License Active: <strong className="text-emerald-400">reclamation.analytics / reclamation.ai / reclamation.gis</strong></p>
            <p>• Role Assigned: <strong className="text-slate-200">Reclamation Manager & Environmental Engineer</strong></p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/10"
          >
            Simpan Konfigurasi
          </button>

          {savedMsg && (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> {savedMsg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
