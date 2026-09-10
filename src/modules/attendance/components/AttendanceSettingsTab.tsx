import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Smartphone,
  ShieldCheck,
  Key,
  CheckCircle2,
  Lock,
  Save,
  Building,
} from "lucide-react";
import { AttendancePolicy, AttendanceDevice } from "../../../types/attendanceTypes";

interface Props {
  policies: AttendancePolicy[];
  devices: AttendanceDevice[];
  onUpdatePolicy?: (policy: AttendancePolicy) => Promise<void>;
}

export const AttendanceSettingsTab: React.FC<Props> = ({ policies, devices, onUpdatePolicy }) => {
  const [activeTab, setActiveTab] = useState<"policy" | "devices" | "license">("policy");

  const [policy, setPolicy] = useState<AttendancePolicy>(
    policies[0] || {
      id: "pol-01",
      companyId: "COMP-01",
      policyName: "Kebijakan Presensi Site Tapin Coal Field",
      clockInRequired: true,
      clockOutRequired: true,
      qrRequired: true,
      dynamicQrOnly: true,
      qrRefreshIntervalSeconds: 60,
      gpsRequired: true,
      geofenceRadiusMeters: 200,
      gracePeriodMinutes: 15,
      lateThresholdMinutes: 30,
      earlyLeaveThresholdMinutes: 15,
      overtimeThresholdMinutes: 30,
      autoApproval: false,
      manualReviewRequired: true,
      allowOfflineClocking: true,
    }
  );

  const [saved, setSaved] = useState(false);

  const handleSavePolicy = async () => {
    if (onUpdatePolicy) {
      await onUpdatePolicy(policy);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
            SYSTEM CONFIGURATION & ENTITLEMENTS
          </span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Pengaturan Kebijakan Presensi, Perangkat & Lisensi</h2>
        <p className="text-xs text-slate-400">
          Konfigurasi aturan presensi site, pengelolaan perangkat seluler terdaftar, serta hak akses RBAC dan entitlement lisensi.
        </p>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("policy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "policy"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Attendance Policy Config</span>
        </button>

        <button
          onClick={() => setActiveTab("devices")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "devices"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>Perangkat Mobile Terdaftar ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("license")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "license"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Key className="h-4 w-4" />
          <span>RBAC & License Entitlement</span>
        </button>
      </div>

      {/* Tab 1: Policy Form */}
      {activeTab === "policy" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white">{policy.policyName}</h3>
              <p className="text-xs text-slate-400">Aturan toleransi waktu dan validasi keamanan lokasi</p>
            </div>

            <button
              onClick={handleSavePolicy}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 shadow-lg transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Aturan Policy</span>
            </button>
          </div>

          {saved && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300 text-center animate-fade-in">
              Kebijakan Presensi Berhasil Diperbarui!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <label className="block text-slate-300 font-bold">Grace Period Keterlambatan</label>
              <input
                type="number"
                value={policy.gracePeriodMinutes}
                onChange={(e) => setPolicy({ ...policy, gracePeriodMinutes: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-cyan-300 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">Menit toleransi sebelum dianggap LATE (Terlambat).</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <label className="block text-slate-300 font-bold">Radius Geofence GPS (Meter)</label>
              <input
                type="number"
                value={policy.geofenceRadiusMeters}
                onChange={(e) => setPolicy({ ...policy, geofenceRadiusMeters: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-cyan-300 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">Batas toleransi jarak dari pusat koordinat checkpoint.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <label className="block text-slate-300 font-bold">Refresh Interval Dynamic QR</label>
              <input
                type="number"
                value={policy.qrRefreshIntervalSeconds}
                onChange={(e) => setPolicy({ ...policy, qrRefreshIntervalSeconds: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-cyan-300 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">Interval pembaruan barcode otomatis dalam detik.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Devices */}
      {activeTab === "devices" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Device ID</th>
                  <th className="py-3 px-4">Tipe & OS</th>
                  <th className="py-3 px-4">Karyawan Terdaftar</th>
                  <th className="py-3 px-4">Versi App</th>
                  <th className="py-3 px-4">Aktivitas Terakhir</th>
                  <th className="py-3 px-4">Status Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {devices.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 px-4 font-bold text-cyan-400">{d.deviceId}</td>
                    <td className="py-3 px-4 font-sans font-bold text-white">
                      {d.deviceType}
                      <div className="text-[10px] text-slate-400 font-normal">{d.os}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-200">{d.employeeName}</td>
                    <td className="py-3 px-4 text-slate-400">{d.appVersion}</td>
                    <td className="py-3 px-4 text-slate-400">{d.lastSeen}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: License & RBAC Entitlements */}
      {activeTab === "license" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-cyan-400" />
            <span>Matriks Entitlement Lisensi & Permission RBAC</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">1 Account = 1 License Key</span>
              <h4 className="text-sm font-black text-white">ACTIVE ENTERPRISE LICENSE</h4>
              <p className="text-slate-400 text-[11px]">
                Seluruh modul presensi (Dynamic QR, GPS Geofencing, AI Copilot, Audit Trail) aktif sepenuhnya.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">RBAC Roles Permitted</span>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">attendance.clock</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">attendance.qr</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">attendance.gps</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">attendance.approve</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">attendance.ai</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
