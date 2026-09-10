// MINE SMART AI - Procurement Analytics Tab

import React from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Clock,
  Building2,
  Award,
  Layers
} from "lucide-react";
import { ProcurementKPISummary } from "../../../types/procurementTypes";

interface ProcurementAnalyticsTabProps {
  kpi: ProcurementKPISummary;
}

export const ProcurementAnalyticsTab: React.FC<ProcurementAnalyticsTabProps> = ({ kpi }) => {
  const formatIDR = (val: number) => `Rp ${(val / 1_000_000).toFixed(0)} Juta`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" /> Procurement Analytics & Spend Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisa pengeluaran pembelian per kategori, evaluasi savings negosiasi & Purchase Price Variance (PPV)
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="text-xs text-slate-400 mb-1">Rerata Cycle Time Procurement</div>
          <div className="text-2xl font-bold text-white">{kpi.avgCycleTimeDays} Hari</div>
          <div className="text-[11px] text-emerald-400 mt-1">PR Submit → PO Issued</div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="text-xs text-slate-400 mb-1">Total Direct Negotiation Savings</div>
          <div className="text-2xl font-bold text-emerald-400">Rp 44 Juta</div>
          <div className="text-[11px] text-emerald-300 mt-1">Negosiasi RFQ Q3</div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="text-xs text-slate-400 mb-1">Purchase Price Variance (PPV)</div>
          <div className="text-2xl font-bold text-amber-400">- 2.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Di bawah batas budget baseline</div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="text-xs text-slate-400 mb-1">Vendor On-Time Delivery Rate</div>
          <div className="text-2xl font-bold text-blue-400">{kpi.onTimeDeliveryRatePct}%</div>
          <div className="text-[11px] text-blue-300 mt-1">DDP Site Lati Warehouse</div>
        </div>
      </div>

      {/* Spend Breakdown Charts Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" /> Proporsi Pengeluaran per Kategori (Spend Breakdown)
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">1. Bio Solar B35 (Fuel)</span>
                <span className="text-amber-300 font-bold">Rp 1.66 Miliar (68%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">2. Heavy Equipment Parts (Hitachi & Cummins)</span>
                <span className="text-amber-300 font-bold">Rp 498 Juta (21%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: "21%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">3. Ban OTR Mining Truck (Goodyear)</span>
                <span className="text-amber-300 font-bold">Rp 180 Juta (7%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: "7%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">4. APD & Safety PPE</span>
                <span className="text-amber-300 font-bold">Rp 97 Juta (4%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: "4%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Top Vendor Spend & Performance Score
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">PT Pertamina Patra Niaga</div>
                <div className="text-[10px] text-slate-400">Fuel Supplier • Rating: 4.9 / 5</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-300">Rp 1.66 Miliar</div>
                <div className="text-[10px] text-emerald-400 font-bold">98% On-time</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">PT Hexindo Adiperkasa Tbk</div>
                <div className="text-[10px] text-slate-400">Hitachi Mining Parts • Rating: 4.8 / 5</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-300">Rp 498 Juta</div>
                <div className="text-[10px] text-emerald-400 font-bold">96.5% On-time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
