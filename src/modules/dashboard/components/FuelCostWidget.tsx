// MINE SMART AI - Fuel & Operating Cost Analytics Widget

import React from "react";
import { Fuel, Coins, AlertTriangle, ArrowRight, TrendingUp, DollarSign } from "lucide-react";
import { FuelCostKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface FuelCostWidgetProps {
  data: FuelCostKPIData;
  onNavigateModule: (moduleKey: string) => void;
}

export const FuelCostWidget: React.FC<FuelCostWidgetProps> = ({ data, onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Fuel Fuel Ratio & Cost Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Total Konsumsi BBM</div>
          <div className="text-lg sm:text-xl font-black text-white mt-1">
            {data.totalFuelConsumptionLiters.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-slate-400">Liter</span>
          </div>
          <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
            Var +{data.fuelVariancePct}% vs baseline
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Fuel Ratio Index</div>
          <div className="text-lg sm:text-xl font-black text-amber-300 mt-1">
            {data.fuelPerTonRatio}{" "}
            <span className="text-xs font-normal text-slate-400">L/Ton</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Target: {data.fuelPerTonTarget} L/Ton</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Biaya Operasional</div>
          <div className="text-lg sm:text-xl font-black text-white mt-1">
            Rp {(data.operatingCostIDR / 1000000000).toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-400">Miliar</span>
          </div>
          <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
            Var +{data.costVariancePct}% vs budget
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] font-bold text-slate-400">Cost per Ton</div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">
            Rp {data.costPerTonIDR.toLocaleString("id-ID")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Budget: Rp {data.costPerTonBudgetIDR.toLocaleString("id-ID")}</div>
        </div>
      </div>

      {/* Fuel Anomaly Alert Banner */}
      {data.hasFuelAnomaly && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-300 block mb-0.5">ANOMALI KONSUMSI BBM TERDETEKSI</span>
            <p className="text-slate-300">{data.anomalyMessage}</p>
          </div>
        </div>
      )}

      {/* Cost Breakdown Progress Bars */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>Rincian Struktur Biaya Operasional (OPEX)</span>
          </span>
          <span className="text-slate-400">Total Rp 4.5 Miliar</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300">Bahan Bakar Solar (BBM)</span>
              <span className="font-bold text-white">Rp 1.62 M (36%)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: "36%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300">Maintenance & Spare Parts</span>
              <span className="font-bold text-white">Rp 1.12 M (25%)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: "25%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300">Labor & Gaji Operator</span>
              <span className="font-bold text-white">Rp 900 Juta (20%)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: "20%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300">Blasting & Drilling Explosives</span>
              <span className="font-bold text-white">Rp 585 Juta (13%)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-violet-400 h-full" style={{ width: "13%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Drill-Down Footer */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => onNavigateModule("finance")}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          Lihat Financial Control
        </button>
        <button
          onClick={() => onNavigateModule("fuel")}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Buka Audit Fuel Management</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
