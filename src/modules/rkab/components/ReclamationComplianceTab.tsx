// MINE SMART AI - RKAB Reclamation & Environmental Compliance Tab
import React from "react";
import {
  Trees,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  ShieldCheck,
  Building2,
  FileCheck2,
  Sprout,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { ReclamationComplianceItem } from "../../../types/rkabTypes";

interface ReclamationComplianceTabProps {
  reclamationData: ReclamationComplianceItem[];
}

export const ReclamationComplianceTab: React.FC<ReclamationComplianceTabProps> = ({
  reclamationData,
}) => {
  const current = reclamationData[0] || {
    openedAreaHa: 45.0,
    cumulativeOpenedHa: 382.4,
    reclamationTargetHa: 35.0,
    reclamationActualHa: 29.5,
    revegetationTargetHa: 30.0,
    revegetationActualHa: 26.8,
    treesPlantedCount: 24500,
    nurseryStockCount: 42000,
    jamrekGuaranteeAmountIDR: 48500000000,
    jamrekStatus: "DEPOSITED",
    acidWaterPondPH: 7.2,
    tssPPM: 142,
  };

  const reclamationProgress = (current.reclamationActualHa / current.reclamationTargetHa) * 100;
  const revegetationProgress = (current.revegetationActualHa / current.revegetationTargetHa) * 100;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Penataan Lahan Bekas Tambang */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Penataan Lahan (Landscaping)</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {reclamationProgress.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {current.reclamationActualHa} <span className="text-xs font-normal text-slate-400">/ {current.reclamationTargetHa} Ha Target</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(reclamationProgress, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Backfilling & recontouring lereng disposal timur.
          </p>
        </div>

        {/* 2. Revegetasi & Penanaman Pohon */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Revegetasi & Tanam Pohon</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {revegetationProgress.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {current.treesPlantedCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">Pohon ({current.revegetationActualHa} Ha)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(revegetationProgress, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Spesies: Sengon, Johar, Trembesi, dan Mahoni.
          </p>
        </div>

        {/* 3. Nursery & Stok Bibit */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Nursery & Bibit Siap Tanam</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {current.nurseryStockCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bibit</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">
            ✓ Ketersediaan bibit mencukupi kebutuhan tanam 2026-2027.
          </p>
        </div>

        {/* 4. Jaminan Reklamasi (Jamrek) */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Jaminan Reklamasi (Jamrek)</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {current.jamrekStatus}
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400">
            Rp {(current.jamrekGuaranteeAmountIDR / 1e9).toFixed(1)} <span className="text-xs font-normal text-slate-400">Miliar</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Bank Garansi Mandiri disetorkan ke rekening resmi ESDM.
          </p>
        </div>
      </div>

      {/* Water Treatment & Environmental Settling Pond Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settling Pond Quality Card */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Baku Mutu Air Settling Pond
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              COMPLIANT
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300">Derajat Keasaman (pH)</div>
                <div className="text-[10px] text-slate-500">Standar Baku Mutu ESDM: 6.0 - 9.0</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-black text-emerald-400">{current.acidWaterPondPH}</div>
                <div className="text-[10px] text-emerald-400">Optimal (Netral)</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300">Total Suspended Solid (TSS)</div>
                <div className="text-[10px] text-slate-500">Standar Baku Mutu: &lt; 300 mg/L</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-black text-emerald-400">{current.tssPPM} <span className="text-xs font-normal">mg/L</span></div>
                <div className="text-[10px] text-emerald-400">Sesuai Baku Mutu</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
            Pengapuran aktif otomatis (automatic liming dosing) berjalan 24/7 di Outlet Kolam Pengendap Sedimen Pond 3.
          </div>
        </div>

        {/* 5-Year Reclamation Plan Comparison */}
        <div className="lg:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              Riwayat Kepatuhan Rencana Reklamasi (Dokumen RR 5 Tahun)
            </h4>
            <span className="text-xs text-slate-500 font-mono">SK Persetujuan RR: 298.K/MB.07/DJB/2024</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Periode</th>
                  <th className="p-3">Area Tambang</th>
                  <th className="p-3 text-right">Bukaan (Ha)</th>
                  <th className="p-3 text-right">Target Penataan (Ha)</th>
                  <th className="p-3 text-right">Realisasi (Ha)</th>
                  <th className="p-3 text-right">Pohon Ditanam</th>
                  <th className="p-3 text-center">Status Jamrek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {reclamationData.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white">{rec.year}</td>
                    <td className="p-3 font-sans text-slate-400">{rec.pitArea}</td>
                    <td className="p-3 text-right">{rec.openedAreaHa} Ha</td>
                    <td className="p-3 text-right">{rec.reclamationTargetHa} Ha</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{rec.reclamationActualHa} Ha</td>
                    <td className="p-3 text-right text-amber-300">{rec.treesPlantedCount.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                        {rec.jamrekStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
