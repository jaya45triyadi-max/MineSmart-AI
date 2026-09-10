// MINE SMART AI - RKAB Production Targets & DMO Compliance Tab
import React, { useState } from "react";
import {
  Flame,
  Scale,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Edit3,
  Sliders,
} from "lucide-react";
import { ProductionTargetItem } from "../../../types/rkabTypes";

interface ProductionTargetsTabProps {
  productionData: ProductionTargetItem[];
  onUpdateMonth?: (item: ProductionTargetItem) => void;
}

export const ProductionTargetsTab: React.FC<ProductionTargetsTabProps> = ({
  productionData,
  onUpdateMonth,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<"ALL" | "Q1" | "Q2" | "Q3" | "Q4">("ALL");

  const filteredData = productionData.filter((item) => {
    if (selectedQuarter !== "ALL" && item.quarter !== selectedQuarter) return false;
    return true;
  });

  const totalTargetCoal = productionData.reduce((acc, curr) => acc + curr.coalTargetMT, 0);
  const totalActualCoal = productionData.reduce((acc, curr) => acc + curr.coalActualMT, 0);
  const totalTargetOB = productionData.reduce((acc, curr) => acc + curr.obTargetBCM, 0);
  const totalActualOB = productionData.reduce((acc, curr) => acc + curr.obActualBCM, 0);
  const totalDmoTarget = productionData.reduce((acc, curr) => acc + curr.dmoTargetMT, 0);
  const totalDmoActual = productionData.reduce((acc, curr) => acc + curr.dmoActualMT, 0);
  const totalExportActual = productionData.reduce((acc, curr) => acc + curr.exportActualMT, 0);

  const coalAchievementPct = totalTargetCoal > 0 ? (totalActualCoal / totalTargetCoal) * 100 : 0;
  const obAchievementPct = totalTargetOB > 0 ? (totalActualOB / totalTargetOB) * 100 : 0;
  const actualDmoRatio = totalActualCoal > 0 ? (totalDmoActual / totalActualCoal) * 100 : 0;
  const plannedSR = totalTargetCoal > 0 ? totalTargetOB / totalTargetCoal : 0;
  const actualSR = totalActualCoal > 0 ? totalActualOB / totalActualCoal : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Coal Production Target */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Target Batubara RKAB</span>
            <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              3.50 Juta MT
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {(totalActualCoal / 1e6).toFixed(3)} <span className="text-xs font-normal text-slate-400">Juta MT ({coalAchievementPct.toFixed(1)}%)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Realisasi YTD s/d Bulan Berjalan. Kuota resmi disetujui ESDM.
          </p>
        </div>

        {/* 2. Overburden & Stripping Ratio */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Overburden & SR</span>
            <span className="text-xs font-mono font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              SR: {actualSR.toFixed(2)}
            </span>
          </div>
          <div className="text-2xl font-black text-blue-400">
            {(totalActualOB / 1e6).toFixed(2)} / {(totalTargetOB / 1e6).toFixed(2)} <span className="text-xs font-normal text-slate-400">Juta BCM</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Planned SR: {plannedSR.toFixed(2)} BCM/MT | Deviasi: {((actualSR - plannedSR) / plannedSR * 100).toFixed(1)}%
          </p>
        </div>

        {/* 3. DMO Compliance (Min 25%) */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Pemenuhan DMO (Min. 25%)</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {actualDmoRatio.toFixed(1)}% Realisasi
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {(totalDmoActual / 1e3).toLocaleString()} <span className="text-xs font-normal text-slate-400">Ton (PLN/Semen)</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">
            ✓ Memenuhi ketentuan Kepmen ESDM 267.K/2022 (DMO ≥ 25%).
          </p>
        </div>

        {/* 4. Export Allocation */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Volume Penjualan Ekspor</span>
            <span className="text-xs font-mono font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              {(100 - actualDmoRatio).toFixed(1)}% Share
            </span>
          </div>
          <div className="text-2xl font-black text-purple-400">
            {(totalExportActual / 1e3).toLocaleString()} <span className="text-xs font-normal text-slate-400">Ton</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Tujuan: China (45%), India (35%), Vietnam & Lainnya (20%).
          </p>
        </div>
      </div>

      {/* Monthly Breakdown Table & Filter Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Matriks Bulanan Target & Realisasi Produksi (Format ESDM)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian produksi batubara, pengupasan OB, Stripping Ratio, dan alokasi DMO per bulan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["ALL", "Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedQuarter === q
                    ? "bg-amber-500 text-slate-950 font-black"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {q === "ALL" ? "Semua Bulan" : q}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Bulan / Kuartal</th>
                <th className="p-3.5 text-right">Target Batubara (MT)</th>
                <th className="p-3.5 text-right">Realisasi Batubara (MT)</th>
                <th className="p-3.5 text-right">Target OB (BCM)</th>
                <th className="p-3.5 text-right">Realisasi OB (BCM)</th>
                <th className="p-3.5 text-center">SR Target / Act</th>
                <th className="p-3.5 text-right">DMO Realisasi (MT)</th>
                <th className="p-3.5">Status Kepatuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredData.map((item) => {
                const coalPct = item.coalTargetMT > 0 ? (item.coalActualMT / item.coalTargetMT) * 100 : 0;
                const isPlan = item.coalActualMT === 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{item.month}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {item.quarter}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">{item.coalTargetMT.toLocaleString()}</td>
                    <td className="p-3.5 text-right font-bold text-amber-300">
                      {isPlan ? <span className="text-slate-500 italic font-normal">Belum Berjalan</span> : item.coalActualMT.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">{item.obTargetBCM.toLocaleString()}</td>
                    <td className="p-3.5 text-right text-blue-300 font-bold">
                      {isPlan ? <span className="text-slate-500 italic font-normal">-</span> : item.obActualBCM.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      {item.targetSR.toFixed(2)} / {isPlan ? "-" : item.actualSR.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right text-emerald-300">
                      {isPlan ? "-" : item.dmoActualMT.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-sans">
                      {isPlan ? (
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          TERJADWAL
                        </span>
                      ) : coalPct >= 95 ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          {coalPct.toFixed(1)}% ON TARGET
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          {coalPct.toFixed(1)}% SLIGHT DEV
                        </span>
                      )}
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
