import React from "react";
import { Settings, ShieldCheck, Key, Lock, CheckCircle2 } from "lucide-react";

export const HRSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          HR Policies, Access Control (RBAC) & License Entitlement
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pengaturan kebijakan cuti, batas maksimum overtime, hak akses HR Manager/KTT, dan status lisensi modul MINE SMART.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Settings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="h-4 w-4 text-emerald-400" /> Kebijakan Kehadiran & Overtime Site
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Batas Maksimum Lembur (Overtime Limit) / Minggu</label>
              <input
                type="number"
                defaultValue={14}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Toleransi Keterlambatan Shift (Menit)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition">
              Simpan Kebijakan HR
            </button>
          </div>
        </div>

        {/* License Entitlement */}
        <div className="rounded-2xl border border-emerald-900/40 bg-slate-900/90 p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="h-4 w-4 text-emerald-400" /> Status Lisensi Modul HR & Manpower
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">Paket Lisensi:</span>
              <span className="font-bold text-emerald-400">ENTERPRISE DEDICATED</span>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">Kapasitas Manpower Quota:</span>
              <span className="font-bold text-white">420 / 1000 Karyawan</span>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">Masa Berlaku Lisensi:</span>
              <span className="font-bold text-emerald-400">Aktif s/d 31 Des 2028</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
