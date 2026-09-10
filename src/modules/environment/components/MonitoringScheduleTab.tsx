import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { MonitoringPoint } from "../../../types/environmentTypes";

interface Props {
  monitoringPoints: MonitoringPoint[];
}

export const MonitoringScheduleTab: React.FC<Props> = ({ monitoringPoints }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Master Titik Pemantauan & Jadwal Sampling Lingkungan
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master data lokasi pemantauan air, stasiun udara, debu, drainage & kalender sampling harian/mingguan
          </p>
        </div>
      </div>

      {/* Points Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Kode / Nama Titik</th>
                <th className="px-4 py-3.5">Tipe & Kategori</th>
                <th className="px-4 py-3.5">Koordinat (UTM)</th>
                <th className="px-4 py-3.5">Frekuensi Sampling</th>
                <th className="px-4 py-3.5">Penanggung Jawab</th>
                <th className="px-4 py-3.5">Sampling Terakhir</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {monitoringPoints.map((mp) => (
                <tr key={mp.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    {mp.code} - {mp.name}
                    <div className="text-[10px] text-slate-500">{mp.locationName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {mp.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                    Lat: {mp.latitude}, Long: {mp.longitude}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-300">
                    {mp.samplingFrequency}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{mp.responsiblePerson}</td>
                  <td className="px-4 py-3 text-slate-400">{mp.lastSampleDate ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> {mp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
