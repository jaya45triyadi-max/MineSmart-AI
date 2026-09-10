// MINE SMART AI - RKAB Work Plan Matrix Tab
import React, { useState } from "react";
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Compass,
  Truck,
  Factory,
  Trees,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react";
import { WorkPlanMatrixItem } from "../../../types/rkabTypes";

interface WorkPlanMatrixTabProps {
  workPlans: WorkPlanMatrixItem[];
  onOpenAddModal: () => void;
}

export const WorkPlanMatrixTab: React.FC<WorkPlanMatrixTabProps> = ({
  workPlans,
  onOpenAddModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredWorkPlans = workPlans.filter((wp) => {
    if (selectedCategory !== "ALL" && wp.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "EKSPLORASI":
        return Compass;
      case "PENAMBANGAN":
        return Truck;
      case "PENGOLAHAN":
        return Factory;
      case "INFRASTRUKTUR":
        return Building2;
      case "LINGKUNGAN":
        return Trees;
      case "K3":
        return ShieldCheck;
      default:
        return Layers;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {[
            { key: "ALL", label: "Semua Kegiatan" },
            { key: "EKSPLORASI", label: "Eksplorasi (1A)" },
            { key: "PENAMBANGAN", label: "Penambangan (2A/2C)" },
            { key: "PENGOLAHAN", label: "Pengolahan (3A)" },
            { key: "INFRASTRUKTUR", label: "Infrastruktur (4B)" },
            { key: "LINGKUNGAN", label: "Lingkungan & Reklamasi (5A)" },
            { key: "K3", label: "K3 & SMKP (6A)" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                  : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Matriks Kerja</span>
        </button>
      </div>

      {/* Work Plan Grid Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Matriks Rencana Kerja Operasional Tambang Standar ESDM
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {filteredWorkPlans.length} Program Kerja Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Kode Matriks & Kategori</th>
                <th className="p-3.5">Nama Kegiatan</th>
                <th className="p-3.5 text-right">Target Volume</th>
                <th className="p-3.5 text-right">Realisasi</th>
                <th className="p-3.5">Progres Fisik</th>
                <th className="p-3.5">Timeline Kuartal</th>
                <th className="p-3.5">PIC Penanggung Jawab</th>
                <th className="p-3.5 text-right">Anggaran Realisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredWorkPlans.map((wp) => {
                const Icon = getCategoryIcon(wp.category);
                return (
                  <tr key={wp.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-amber-400">{wp.matrixCode}</div>
                          <div className="text-[10px] text-slate-400">{wp.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[280px]">
                      <div className="font-bold text-white group-hover:text-amber-300 transition leading-snug">
                        {wp.activityName}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      {wp.targetVolume.toLocaleString()} <span className="text-slate-500">{wp.unit}</span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      {wp.realizedVolume.toLocaleString()} <span className="text-slate-500">{wp.unit}</span>
                    </td>
                    <td className="p-3.5 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>{wp.progressPercent}%</span>
                          <span
                            className={`font-bold ${
                              wp.status === "COMPLETED"
                                ? "text-emerald-400"
                                : wp.status === "ON_TRACK"
                                ? "text-blue-400"
                                : "text-amber-400"
                            }`}
                          >
                            {wp.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              wp.progressPercent >= 90
                                ? "bg-emerald-500"
                                : wp.progressPercent >= 60
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(wp.progressPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                          const isActive = wp.timelineQuarter.includes(q as any);
                          return (
                            <span
                              key={q}
                              className={`px-1.5 py-0.5 rounded ${
                                isActive
                                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                                  : "text-slate-600 bg-slate-950"
                              }`}
                            >
                              {q}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium text-[11px]">
                      {wp.responsiblePerson}
                    </td>
                    <td className="p-3.5 text-right font-mono text-[11px]">
                      <div className="text-slate-200">
                        Rp {(wp.budgetSpentIDR / 1e9).toFixed(2)} M
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        dari Rp {(wp.budgetAllocatedIDR / 1e9).toFixed(2)} M
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
