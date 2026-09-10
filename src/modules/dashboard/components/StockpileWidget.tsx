// MINE SMART AI - Stockpile Capacity & Coal Quality Widget

import React from "react";
import { Flame, Layers, ArrowRight, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StockpileKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface StockpileWidgetProps {
  data: StockpileKPIData;
  onNavigateModule: (moduleKey: string) => void;
}

export const StockpileWidget: React.FC<StockpileWidgetProps> = ({ data, onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Capacity & Inventory Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-white text-base">
              {data.currentStockTon.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-slate-400">Ton Batu Bara</span>
            </span>
            <p className="text-[11px] text-slate-400">Total Kapasitas: {data.totalCapacityTon.toLocaleString("id-ID")} Ton</p>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-1 rounded-lg border font-black text-xs ${
                data.occupancyPct > 85
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              Okupansi {data.occupancyPct}%
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Sisa: {data.availableCapacityTon.toLocaleString("id-ID")} Ton</p>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              data.occupancyPct > 85 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${data.occupancyPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <ArrowDownRight className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Masuk Hari Ini</span>
              <span className="font-bold text-slate-200">+{data.incomingTodayTon.toLocaleString("id-ID")} Ton</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <ArrowUpRight className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Keluar (Barging)</span>
              <span className="font-bold text-slate-200">-{data.outgoingTodayTon.toLocaleString("id-ID")} Ton</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coal Quality Parameters Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Kualitas Batu Bara Stockpile (GAR Specification)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Calorific Value</span>
            <span className="font-extrabold text-amber-300 text-sm">{data.quality.calorificValueGAR}</span>
            <span className="text-[9px] text-slate-500 block">kcal/kg (GAR)</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Total Moisture</span>
            <span className="font-extrabold text-cyan-300 text-sm">{data.quality.totalMoisturePct}%</span>
            <span className="text-[9px] text-slate-500 block">Moisture</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Ash Content</span>
            <span className="font-extrabold text-slate-200 text-sm">{data.quality.ashContentPct}%</span>
            <span className="text-[9px] text-slate-500 block">Kadar Abu</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Total Sulfur</span>
            <span className="font-extrabold text-emerald-400 text-sm">{data.quality.totalSulfurPct}%</span>
            <span className="text-[9px] text-slate-500 block">Kadar Sulfur</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 italic px-1">
          {data.quality.qualityDeviationText}
        </p>
      </div>

      {/* Drill-Down Footer */}
      <div className="pt-1 flex justify-end">
        <button
          onClick={() => onNavigateModule("stockpile")}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Buka Manajemen Stockpile & Quality</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
