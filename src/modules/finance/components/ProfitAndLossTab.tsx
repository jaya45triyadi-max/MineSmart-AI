// MINE SMART AI - Profit & Loss (P&L) Statement & EBITDA Tab
import React from "react";
import { DollarSign, PieChart, TrendingUp, TrendingDown, FileText, AlertCircle } from "lucide-react";
import { FinanceKPISummary } from "../../../types/financeTypes";

interface ProfitAndLossTabProps {
  kpi: FinanceKPISummary;
}

export const ProfitAndLossTab: React.FC<ProfitAndLossTabProps> = ({ kpi }) => {
  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* P&L Statement Header Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Laporan Laba Rugi Operasional (Profit & Loss Statement)</h3>
              <p className="text-xs text-slate-400">Periode Agustus 2026 • Site Kalimantan A & Konsolidasi Tambang</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">EBITDA Margin</span>
            <span className="text-lg font-black text-cyan-400">{kpi.ebitdaMarginPct}%</span>
          </div>
        </div>

        {/* Financial Income Statement Lines */}
        <div className="space-y-4 text-xs">
          {/* Revenue */}
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
            <span className="font-extrabold text-emerald-400 text-sm">TOTAL PENDAPATAN OPERASIONAL (REVENUE)</span>
            <span className="font-black text-emerald-400 text-base">{formatIDR(kpi.totalRevenueIDR)}</span>
          </div>

          {/* Cost of Sales / Mining Cost */}
          <div className="space-y-2 pl-4">
            <div className="flex items-center justify-between text-slate-300">
              <span>Beban Pokok Penjualan Batubara (Cost of Goods Sold - COGS)</span>
              <span className="font-mono text-rose-400 font-bold">- {formatIDR(kpi.totalCostIDR * 0.65)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] pl-4">
              <span>• Mining, Excavation & Blasting Direct Costs</span>
              <span className="font-mono">{formatIDR(kpi.totalCostIDR * 0.4)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] pl-4">
              <span>• Fuel & Energy Consumption</span>
              <span className="font-mono">{formatIDR(kpi.totalCostIDR * 0.25)}</span>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 font-mono">
            <span className="font-extrabold text-white">LABA KOTOR (GROSS PROFIT)</span>
            <span className="font-black text-cyan-400 text-sm">
              {formatIDR(kpi.grossProfitIDR)} <span className="text-[10px] text-slate-500">({kpi.grossMarginPct}%)</span>
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="space-y-2 pl-4">
            <div className="flex items-center justify-between text-slate-300">
              <span>Beban Operasional, General & Administrative (OPEX)</span>
              <span className="font-mono text-rose-400 font-bold">- {formatIDR(kpi.totalOpexIDR * 0.35)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] pl-4">
              <span>• Jasa Kontraktor Hauling & Maintenance</span>
              <span className="font-mono">{formatIDR(kpi.totalOpexIDR * 0.2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] pl-4">
              <span>• HSE, Lingkungan & Reklamasi Tambang</span>
              <span className="font-mono">{formatIDR(kpi.totalOpexIDR * 0.15)}</span>
            </div>
          </div>

          {/* Operating Profit */}
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 font-mono">
            <span className="font-extrabold text-white">LABA OPERASIONAL (OPERATING PROFIT)</span>
            <span className="font-black text-emerald-400 text-sm">
              {formatIDR(kpi.operatingProfitIDR)} <span className="text-[10px] text-slate-500">({kpi.operatingMarginPct}%)</span>
            </span>
          </div>

          {/* EBITDA Component Box */}
          <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 uppercase text-[11px]">EBITDA (Earnings Before Interest, Tax, Depreciation, Amortization)</span>
              <span className="font-mono font-black text-cyan-300 text-base">{formatIDR(kpi.ebitdaIDR)}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              EBITDA dihitung dari Laba Operasional + Beban Penyusutan Aset Tetap Fleet/Plant (Rp {(kpi.ebitdaIDR - kpi.operatingProfitIDR).toLocaleString("id-ID")}).
            </p>
          </div>

          {/* Tax Notice */}
          <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Catatan Pajak: Pajak Penghasilan Badan (CIT) menggunakan asumsi kualifikasi UU Harmonisasi Peraturan Perpajakan (22%).
            </span>
          </div>

          {/* Net Profit */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 rounded-xl border border-emerald-500/40 font-mono">
            <span className="font-black text-emerald-400 text-sm">LABA BERSIH TAHUN BERJALAN (NET PROFIT)</span>
            <span className="font-black text-emerald-400 text-lg">{formatIDR(kpi.netProfitIDR)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
