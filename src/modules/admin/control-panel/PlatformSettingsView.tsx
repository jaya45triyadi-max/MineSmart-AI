// MINE SMART AI - Global System Settings & Maintenance Mode Console
// PROMPT 36: System Settings, Maintenance Mode, Regional Localization & Security Policy

import React, { useState } from "react";
import {
  Settings,
  AlertTriangle,
  Clock,
  Globe2,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Radio,
} from "lucide-react";
import {
  PlatformConfig,
  MaintenanceModeConfig,
  SystemSettingsConfig,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface PlatformSettingsViewProps {
  config: PlatformConfig;
  onRefresh: () => void;
}

export const PlatformSettingsView: React.FC<PlatformSettingsViewProps> = ({
  config,
  onRefresh,
}) => {
  const [maintenanceDraft, setMaintenanceDraft] = useState<MaintenanceModeConfig>({
    ...config.maintenance,
  });
  const [systemDraft, setSystemDraft] = useState<SystemSettingsConfig>({
    ...config.systemSettings,
  });
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleSaveSettings = async () => {
    await platformConfigService.publishConfig(
      {
        maintenance: maintenanceDraft,
        systemSettings: systemDraft,
      },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com",
      "Pembaruan Konfigurasi Sistem Global & Status Maintenance"
    );
    setActionSuccessMessage("✅ Pengaturan sistem global berhasil diperbarui!");
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Global System Settings & Maintenance Controls</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kendali pemeliharaan server darurat, kebijakan sesi keamanan, frekuensi telemetri, dan zona waktu operasional.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi Sistem</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Mode Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Emergency Maintenance Mode
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                maintenanceDraft.isActive
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {maintenanceDraft.isActive ? "MAINTENANCE ACTIVE" : "OFFLINE / NORMAL"}
            </span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">
                  Aktifkan Mode Pemeliharaan
                </span>
                <span className="text-[11px] text-slate-400">
                  Akan menampilkan banner pemberitahuan pemeliharaan di portal pelanggan.
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceDraft.isActive}
                onChange={(e) =>
                  setMaintenanceDraft({ ...maintenanceDraft, isActive: e.target.checked })
                }
                className="h-5 w-5 rounded text-amber-500 focus:ring-amber-500"
              />
            </label>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Judul Banner Pemeliharaan
              </label>
              <input
                type="text"
                value={maintenanceDraft.title}
                onChange={(e) =>
                  setMaintenanceDraft({ ...maintenanceDraft, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Pesan Penjelasan ke Pengguna
              </label>
              <textarea
                rows={3}
                value={maintenanceDraft.message}
                onChange={(e) =>
                  setMaintenanceDraft({ ...maintenanceDraft, message: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>

            <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceDraft.allowReadOnlyForClients}
                onChange={(e) =>
                  setMaintenanceDraft({
                    ...maintenanceDraft,
                    allowReadOnlyForClients: e.target.checked,
                  })
                }
                className="rounded text-amber-500"
              />
              <span>Izinkan Akses Read-Only untuk Client (Data tidak dapat diubah)</span>
            </label>
          </div>
        </div>

        {/* Localization & Security Policy */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Localization & Security Policy
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Zona Waktu Tambang Default
              </label>
              <select
                value={systemDraft.defaultTimezone}
                onChange={(e) =>
                  setSystemDraft({ ...systemDraft, defaultTimezone: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB - UTC+7)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA - UTC+8)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT - UTC+9)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Mata Uang Default
                </label>
                <input
                  type="text"
                  value={systemDraft.defaultCurrency}
                  onChange={(e) =>
                    setSystemDraft({ ...systemDraft, defaultCurrency: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Telemetry Stream (Detik)
                </label>
                <input
                  type="number"
                  value={systemDraft.telemetryStreamIntervalSec}
                  onChange={(e) =>
                    setSystemDraft({
                      ...systemDraft,
                      telemetryStreamIntervalSec: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Session Idle Timeout (Menit)
              </label>
              <input
                type="number"
                value={systemDraft.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSystemDraft({
                    ...systemDraft,
                    sessionTimeoutMinutes: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <label className="flex items-center gap-2 pt-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={systemDraft.enforceMFAForAdmins}
                onChange={(e) =>
                  setSystemDraft({
                    ...systemDraft,
                    enforceMFAForAdmins: e.target.checked,
                  })
                }
                className="rounded text-cyan-500"
              />
              <span className="font-bold text-white">Wajibkan Two-Factor Authentication (2FA) untuk Akun Admin</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
