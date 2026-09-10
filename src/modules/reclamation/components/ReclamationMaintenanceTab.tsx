import React from "react";
import {
  Wrench,
  RefreshCw,
  Droplets,
  Sprout,
  Users,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ReclamationMaintenance } from "../../../types/reclamationTypes";

interface Props {
  maintenanceList: ReclamationMaintenance[];
}

export const ReclamationMaintenanceTab: React.FC<Props> = ({
  maintenanceList,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-amber-400" />
          Reclamation Maintenance & Replanting Workflow
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pemeliharaan rutin tanaman (penyiangan gulma, pemupukan, penyiraman, perbaikan erosi) dan alur penyisipan bibit (replanting).
        </p>
      </div>

      {/* Replanting Workflow Stages Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Sprout className="h-4 w-4" /> Alur Prosedur Penyisipan Bibit (Replanting Workflow):
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block font-mono">Tahap 1</span>
            <strong className="text-white block font-bold">Field Monitoring</strong>
            <span className="text-[10px] text-slate-400">Deteksi survival rate &lt; 75%</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block font-mono">Tahap 2</span>
            <strong className="text-amber-400 block font-bold">Failure Detection</strong>
            <span className="text-[10px] text-slate-400">Identifikasi jumlah bibit mati</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block font-mono">Tahap 3</span>
            <strong className="text-cyan-400 block font-bold">Rekomendasi Replanting</strong>
            <span className="text-[10px] text-slate-400">Pengajuan kebutuhan bibit penyisip</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block font-mono">Tahap 4</span>
            <strong className="text-purple-400 block font-bold">Persetujuan & Drop Bibit</strong>
            <span className="text-[10px] text-slate-400">Pengiriman bibit dari Nursery</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block font-mono">Tahap 5</span>
            <strong className="text-emerald-400 block font-bold">Pelaksanaan Penyisipan</strong>
            <span className="text-[10px] text-slate-400">Penanaman ulang &amp; monitoring</span>
          </div>
        </div>
      </div>

      {/* Maintenance Activities List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Log Kegiatan Pemeliharaan Reklamasi (Maintenance Log)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Maint</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Area Sektor</th>
                <th className="px-4 py-3">Aktivitas Pemeliharaan</th>
                <th className="px-4 py-3">Volume / Kuantitas</th>
                <th className="px-4 py-3">Pekerja / Peralatan</th>
                <th className="px-4 py-3">Biaya (IDR)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {maintenanceList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">{m.maintenanceId}</td>
                  <td className="px-4 py-3 text-slate-400">{m.date}</td>
                  <td className="px-4 py-3 font-bold text-white">{m.areaName}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">{m.activity}</td>
                  <td className="px-4 py-3 text-slate-200">
                    {m.quantity} {m.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[11px]">
                    <span className="block font-medium">{m.workersCount} Pekerja</span>
                    <span className="text-slate-500 block">{m.equipment}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-purple-400">
                    Rp {(m.costIDR / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {m.status}
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
