// MINE SMART AI - RKAB Investment & Budget Compliance Tab
import React, { useState } from "react";
import {
  Coins,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  Truck,
  Trees,
  Scale,
  FileCheck2,
  Info,
} from "lucide-react";
import { InvestmentBudgetItem } from "../../../types/rkabTypes";

interface InvestmentBudgetTabProps {
  investmentBudgets: InvestmentBudgetItem[];
}

export const InvestmentBudgetTab: React.FC<InvestmentBudgetTabProps> = ({
  investmentBudgets,
}) => {
  const [currencyView, setCurrencyView] = useState<"IDR" | "USD">("IDR");

  const totalPlanIDR = investmentBudgets.reduce((acc, curr) => acc + curr.planAmountIDR, 0);
  const totalActualIDR = investmentBudgets.reduce((acc, curr) => acc + curr.actualAmountIDR, 0);
  const totalPlanUSD = investmentBudgets.reduce((acc, curr) => acc + curr.planAmountUSD, 0);
  const totalActualUSD = investmentBudgets.reduce((acc, curr) => acc + curr.actualAmountUSD, 0);

  const totalAbsorptionPct = totalPlanIDR > 0 ? (totalActualIDR / totalPlanIDR) * 100 : 0;

  const mandatoryItems = investmentBudgets.filter((i) => i.isMandatoryESDM);
  const mandatoryTotalActual = mandatoryItems.reduce((acc, curr) => acc + curr.actualAmountIDR, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "CAPEX_HEAVY_EQUIPMENT":
        return Truck;
      case "CAPEX_INFRASTRUCTURE":
        return Building2;
      case "OPEX_SAFETY_HSE":
        return ShieldCheck;
      case "OPEX_RECLAMATION":
        return Trees;
      case "ROYALTY_PNBP":
        return Scale;
      default:
        return Coins;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Investment Plan */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Rencana Investasi (RKAB)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {currencyView === "IDR"
              ? `Rp ${(totalPlanIDR / 1e12).toFixed(2)} Triliun`
              : `$ ${(totalPlanUSD / 1e6).toFixed(1)} M`}
          </div>
          <p className="text-[11px] text-slate-400">
            Capex pengadaan alat, infrastruktur, operasional tambang & royalti.
          </p>
        </div>

        {/* 2. Realized Absorption */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Realisasi Penyerapan YTD</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {totalAbsorptionPct.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {currencyView === "IDR"
              ? `Rp ${(totalActualIDR / 1e12).toFixed(2)} Triliun`
              : `$ ${(totalActualUSD / 1e6).toFixed(1)} M`}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(totalAbsorptionPct, 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Mandatory ESDM Compliance Budget */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Anggaran Wajib ESDM (K3/Lingkungan/PNBP)</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            Rp {(mandatoryTotalActual / 1e9).toFixed(1)} Miliar
          </div>
          <p className="text-[11px] text-blue-300/80">
            ✓ 100% dialokasikan sesuai regulasi Kepmen 1827/2018.
          </p>
        </div>

        {/* 4. PNBP & SIMBARA Royalti Status */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Royalti Batubara e-PNBP</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              LUNAS SIMBARA
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            Rp {(206.4).toFixed(1)} Miliar
          </div>
          <p className="text-[11px] text-slate-400">
            Penyetoran NTPN tervalidasi sebelum penerbitan LHV/COA pengapalan.
          </p>
        </div>
      </div>

      {/* Main Budget Items Breakdown */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Rincian Alokasi Investasi & Biaya Operasional (RKAB 2026)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Matriks pembiayaan modal (Capex), biaya operasi (Opex), pemenuhan kewajiban K3, lingkungan, dan royalti negara.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Tampilan Mata Uang:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrencyView("IDR")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currencyView === "IDR" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                IDR (Rupiah)
              </button>
              <button
                onClick={() => setCurrencyView("USD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currencyView === "USD" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Kategori & Program</th>
                <th className="p-3.5">Deskripsi Teknis</th>
                <th className="p-3.5 text-right">Rencana Anggaran</th>
                <th className="p-3.5 text-right">Realisasi YTD</th>
                <th className="p-3.5">Penyerapan (%)</th>
                <th className="p-3.5">Status Mandatori ESDM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {investmentBudgets.map((item) => {
                const Icon = getCategoryIcon(item.category);
                const absorption = item.planAmountIDR > 0 ? (item.actualAmountIDR / item.planAmountIDR) * 100 : 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-amber-300 transition">
                            {item.title}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[280px] text-slate-400 text-[11px] leading-relaxed">
                      {item.description}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                      {currencyView === "IDR"
                        ? `Rp ${(item.planAmountIDR / 1e9).toFixed(2)} M`
                        : `$ ${(item.planAmountUSD / 1e3).toLocaleString()} k`}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      {currencyView === "IDR"
                        ? `Rp ${(item.actualAmountIDR / 1e9).toFixed(2)} M`
                        : `$ ${(item.actualAmountUSD / 1e3).toLocaleString()} k`}
                    </td>
                    <td className="p-3.5 min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-300">
                          <span>{absorption.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(absorption, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {item.isMandatoryESDM ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          MANDATORI ESDM
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                          Internal Capex/Opex
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
