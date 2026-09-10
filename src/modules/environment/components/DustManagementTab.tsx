import React from "react";
import {
  Wind,
  Truck,
  Droplets,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import {
  DustMonitoringRecord,
  WaterTruckDustControl,
} from "../../../types/environmentTypes";

interface Props {
  dustRecords: DustMonitoringRecord[];
  waterTrucks: WaterTruckDustControl[];
}

export const DustManagementTab: React.FC<Props> = ({ dustRecords, waterTrucks }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Dust Control & Water Truck Fleet Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengendalian debu tambang di Haul Road, Pit, ROM Crusher & integrasi armada Water Truck penyiraman otomatis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-950/40 p-3 border border-cyan-800/40 text-right">
            <span className="text-[10px] text-cyan-400 block font-semibold">Total Air Penyiraman Hari Ini</span>
            <span className="text-base font-extrabold text-white">295,000 Liter</span>
          </div>
        </div>
      </div>

      {/* Water Truck Fleet Status Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-400" />
          Aktivitas Operasional Armada Water Truck Penyiraman
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {waterTrucks.map((truck) => (
            <div
              key={truck.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{truck.truckUnitId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {truck.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <p><strong className="text-slate-400">Driver:</strong> {truck.driverName}</p>
                <p><strong className="text-slate-400">Rute Sektor:</strong> {truck.routeSector}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">Volume Air</span>
                  <p className="font-bold text-cyan-400">{truck.waterVolumeLiters.toLocaleString()} L</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Trips / Jarak</span>
                  <p className="font-bold text-white">{truck.tripCount} Trip ({truck.areaCoveredKm} km)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dust Monitoring Points Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Log Pemantauan Debu Sektor Tambang (Dust Monitoring Points)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Baku Mutu PM10: 75 µg/m³</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Titik Pemantauan</th>
                <th className="px-4 py-3.5">Sumber Debu</th>
                <th className="px-4 py-3.5">Kadar Debu (µg/m³)</th>
                <th className="px-4 py-3.5">Kondisi Cuaca & Angin</th>
                <th className="px-4 py-3.5">Status Evaluasi</th>
                <th className="px-4 py-3.5">Catatan Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dustRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    {rec.monitoringPointName}
                    <div className="text-[10px] text-slate-500">
                      {rec.date} • {rec.time} WITA
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{rec.dustSource}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-extrabold text-amber-400">
                      {rec.valueUgM3} µg/m³
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {rec.weatherCondition} ({rec.windDirection})
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        rec.status === "NORMAL"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {rec.status === "ELEVATED" && <AlertTriangle className="h-3 w-3" />}
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[11px]">{rec.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
