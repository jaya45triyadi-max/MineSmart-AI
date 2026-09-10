import React from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { Laptop, Smartphone, Tablet, Trash2, ShieldCheck, AlertCircle, Clock } from "lucide-react";

export const CustomerDevicesModule: React.FC = () => {
  const { boundDevices, revokeDevice, currentLicense, usageSummary } = useLicense();

  const handleRevoke = async (deviceId: string, deviceName: string) => {
    if (confirm(`Apakah Anda yakin ingin mencabut (revoke) akses perangkat "${deviceName}"?`)) {
      await revokeDevice(deviceId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Device Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-extrabold text-teal-400 border border-teal-500/30 uppercase tracking-wider">
              MANAJEMEN PERANGKAT TERIKAT (DEVICE BINDING)
            </span>
            <span className="text-xs text-slate-400">
              {usageSummary.activeDevices} / {usageSummary.maxDevices} Perangkat Aktif
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Daftar Perangkat Terdaftar Lisensi
          </h1>
          <p className="text-xs text-slate-400">
            Sistem Anti-Sharing MINE SMART AI secara otomatis membatasi jumlah perangkat aktif berdasarkan paket subskripsi perusahaan.
          </p>
        </div>
      </div>

      {/* Devices Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boundDevices.map((dev) => {
          const isRevoked = dev.status === "REVOKED";

          return (
            <div
              key={dev.id}
              className={`rounded-2xl border p-5 space-y-4 relative transition-all ${
                isRevoked
                  ? "border-red-500/20 bg-slate-950/60 opacity-60"
                  : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
                    {dev.deviceType === "MOBILE" ? (
                      <Smartphone className="h-5 w-5" />
                    ) : dev.deviceType === "TABLET" ? (
                      <Tablet className="h-5 w-5" />
                    ) : (
                      <Laptop className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug">{dev.deviceName}</h3>
                    <p className="text-[10px] text-slate-400">{dev.platform} • {dev.browser}</p>
                  </div>
                </div>

                <span
                  className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                    isRevoked
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>User Mendaftarkan:</span>
                  <span className="font-bold text-slate-200">{dev.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pertama Aktif:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {new Date(dev.firstActivatedAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Aktivitas Terakhir:</span>
                  <span className="font-mono text-[11px] text-teal-300">
                    {new Date(dev.lastSeenAt).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {!isRevoked && (
                <button
                  onClick={() => handleRevoke(dev.id, dev.deviceName)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all mt-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Cabut Akses Perangkat (Revoke)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
