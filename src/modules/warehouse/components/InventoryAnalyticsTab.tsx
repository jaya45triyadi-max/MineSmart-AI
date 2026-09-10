// MINE SMART AI - Inventory Analytics Tab
import React from "react";
import { BarChart3, TrendingUp, Clock, AlertTriangle, ShieldCheck, DollarSign } from "lucide-react";
import { WarehouseKPISummary } from "../../../types/warehouseTypes";

interface InventoryAnalyticsTabProps {
  kpi: WarehouseKPISummary;
}

export const InventoryAnalyticsTab: React.FC<InventoryAnalyticsTabProps> = ({ kpi }) => {
  const formatIDR = (val: number) => {
    if (!val) return "Rp 0";
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} Miliar`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Executive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventory Turnover Ratio</div>
          <div className="text-2xl font-black text-emerald-400">{kpi.inventoryTurnoverRatio}x / tahun</div>
          <p className="text-[11px] text-slate-400">Target Efisiensi Suku Cadang Mining: ≥ 4.0x</p>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Akurasi Fisik vs Sistem (Opname)</div>
          <div className="text-2xl font-black text-cyan-400">{kpi.stockAccuracyPct}%</div>
          <p className="text-[11px] text-slate-400">Verifikasi Opname Bulanan Site A</p>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimasi Nilai Dead Stock</div>
          <div className="text-2xl font-black text-amber-400">{formatIDR(kpi.deadStockValueIDR)}</div>
          <p className="text-[11px] text-slate-400">Material tanpa pergerakan &gt; 180 hari</p>
        </div>
      </div>

      {/* Stock Aging Analysis Buckets */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Analisis Umur Persediaan Suku Cadang (Inventory Aging Buckets)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-bold">0 - 30 Hari</div>
            <div className="text-base font-extrabold text-emerald-400 mt-1">Rp 8.2 Miliar</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Fast Moving Parts</div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-bold">31 - 60 Hari</div>
            <div className="text-base font-extrabold text-blue-400 mt-1">Rp 3.5 Miliar</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Normal Moving</div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-bold">61 - 90 Hari</div>
            <div className="text-base font-extrabold text-amber-400 mt-1">Rp 1.4 Miliar</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Slow Moving</div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-bold">91 - 180 Hari</div>
            <div className="text-base font-extrabold text-purple-400 mt-1">Rp 920 Juta</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Very Slow Moving</div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-bold">&gt; 180 Hari</div>
            <div className="text-base font-extrabold text-rose-400 mt-1">Rp 180 Juta</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dead Stock Candidate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
