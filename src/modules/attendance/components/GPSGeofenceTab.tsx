import React, { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Crosshair,
  Info,
  CheckCircle2,
  XCircle,
  Plus,
  Compass,
} from "lucide-react";
import { GeofenceZone } from "../../../types/attendanceTypes";
import { attendanceRepository } from "../../../services/repositories/AttendanceRepository";

export const GPSGeofenceTab: React.FC = () => {
  const [zones, setZones] = useState<GeofenceZone[]>(
    attendanceRepository["geofences"] || [
      {
        id: "geo-01",
        siteId: "SITE-TAPIN",
        siteName: "Tapin Coal Mine Site",
        zoneName: "Main Pit & Workshop Checkpoint",
        latitude: -2.9348,
        longitude: 115.215,
        radiusMeters: 250,
        status: "ACTIVE",
      },
      {
        id: "geo-02",
        siteId: "SITE-TAPIN",
        siteName: "Tapin Coal Mine Site",
        zoneName: "Port & Port Weighbridge Office",
        latitude: -2.9412,
        longitude: 115.228,
        radiusMeters: 300,
        status: "ACTIVE",
      },
    ]
  );

  // Test GPS Coordinates Simulator State
  const [testLat, setTestLat] = useState(-2.9348);
  const [testLng, setTestLng] = useState(115.215);
  const [testResult, setTestResult] = useState<{
    isValid: boolean;
    distanceMeters: number;
    zoneName: string;
    message: string;
  } | null>(null);

  const handleTestGPS = () => {
    const res = attendanceRepository.validateGPSLocation(testLat, testLng, "SITE-TAPIN");
    setTestResult(res);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            GPS & GEOFENCING VALIDATOR
          </span>
          <span className="text-xs text-slate-400">High Precision Radius Control</span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Pengaturan Zona Geofencing GPS Presensi Tambang</h2>
        <p className="text-xs text-slate-400">
          Membatasi area presensi karyawan hanya dalam radius tertentu di koordinat Pit, Workshop, Port, dan Kantor Administrasi.
        </p>
      </div>

      {/* Grid: Geofence Zones & Test Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Geofence Zones List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Daftar Zona Presensi Terdaftar</h3>
            </div>
            <button className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all">
              <Plus className="h-3 w-3" />
              <span>Tambah Zona</span>
            </button>
          </div>

          <div className="space-y-3">
            {zones.map((z) => (
              <div key={z.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">{z.zoneName}</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {z.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans block">Koordinat Lat/Lng</span>
                    {z.latitude}, {z.longitude}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans block">Radius Geofence</span>
                    <strong className="text-cyan-400">{z.radiusMeters} Meter</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: GPS Location Simulator & Verification */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-cyan-400" />
              <span>Simulasi Uji Koordinat GPS Karyawan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={testLat}
                    onChange={(e) => setTestLat(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={testLng}
                    onChange={(e) => setTestLng(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTestLat(-2.9348);
                    setTestLng(115.215);
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Set In-Zone (-2.9348, 115.2150)
                </button>
                <button
                  onClick={() => {
                    setTestLat(-2.9800);
                    setTestLng(115.3000);
                  }}
                  className="rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-2 text-amber-300 font-bold hover:bg-amber-900/60"
                >
                  Set Out-Zone (Jauh)
                </button>
              </div>

              <button
                onClick={handleTestGPS}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-cyan-400 shadow-lg transition-all"
              >
                UJI KELAYAKAN ZONA GPS
              </button>

              {testResult && (
                <div
                  className={`rounded-xl border p-4 space-y-1.5 ${
                    testResult.isValid
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                      : "border-rose-500/40 bg-rose-950/40 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {testResult.isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span>{testResult.isValid ? "STATUS GPS VALID" : "STATUS GPS DI LUAR ZONA"}</span>
                  </div>
                  <p className="text-xs">{testResult.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Privacy Notice & RBAC */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Info className="h-4 w-4" />
              <span>Location Privacy Notice & RBAC Statement</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Data lokasi GPS hanya diambil saat karyawan menekan tombol Clock In / Clock Out. Sistem tidak melakukan continuous background tracking demi privasi karyawan. Akses log GPS dibatasi hanya untuk user berizin <code className="text-cyan-300">attendance.gps</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
