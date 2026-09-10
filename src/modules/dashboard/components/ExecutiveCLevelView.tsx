// MINE SMART AI - Dedicated Executive C-Level Board View (CEO / Direktur / Owner)
// Menyajikan seluruh KPI Finansial, Produksi, Alat, K3, Target vs Actual, dan Executive AI Summary

import React from "react";
import {
  DollarSign,
  TrendingUp,
  Pickaxe,
  Layers,
  Fuel,
  ShieldCheck,
  Flame,
  Truck,
  Coins,
  Scale,
  Sparkles,
  BarChart3,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  PackageCheck,
  Ship,
  FileSpreadsheet,
} from "lucide-react";
import { ProductionKPIData, FleetKPIData, FuelCostKPIData, HSEKPIData, StockpileKPIData, AIInsightItem } from "../../../services/dashboard/DashboardAnalyticsService";
import { ExecutiveMorningBriefing } from "./ExecutiveMorningBriefing";
import { ExecutiveTargetVsActualMatrix } from "./ExecutiveTargetVsActualMatrix";
import { DashboardKPICard } from "./DashboardKPICard";

interface ExecutiveCLevelViewProps {
  companyName: string;
  siteName: string;
  production: ProductionKPIData;
  fleet: FleetKPIData;
  fuelCost: FuelCostKPIData;
  hse: HSEKPIData;
  stockpile: StockpileKPIData;
  aiInsights: AIInsightItem[];
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: string) => void;
  onOpenExecutiveReport: () => void;
}

export const ExecutiveCLevelView: React.FC<ExecutiveCLevelViewProps> = ({
  companyName,
  siteName,
  production,
  fleet,
  fuelCost,
  hse,
  stockpile,
  aiInsights,
  onOpenAICopilot,
  onNavigateModule,
  onOpenExecutiveReport,
}) => {
  // Financial computations
  const coalPricePerTonUSD = 68.5;
  const exchangeRate = 16200;
  
  const revenueUSD = Math.round(production.coalActualTon * coalPricePerTonUSD);
  const revenueIDR = revenueUSD * exchangeRate;
  const targetRevenueUSD = Math.round(production.coalTargetTon * coalPricePerTonUSD);
  const targetRevenueIDR = targetRevenueUSD * exchangeRate;
  
  const grossProfitIDR = revenueIDR - fuelCost.operatingCostIDR;
  const grossProfitUSD = Math.round(grossProfitIDR / exchangeRate);
  const marginPct = Number(((grossProfitIDR / revenueIDR) * 100).toFixed(1));

  const salesVolumeTon = Math.round(production.coalActualTon * 0.88);
  const miningCostPerTonUSD = Number(((fuelCost.operatingCostIDR / exchangeRate) / Math.max(1, production.coalActualTon)).toFixed(2));
  const miningCostPerBCMUSD = Number(((fuelCost.operatingCostIDR / exchangeRate) / Math.max(1, production.obActualBCM)).toFixed(2));

  return (
    <div className="space-y-8">
      {/* 1. Morning Mining Performance Summary (Auto-Generated AI Briefing) */}
      <ExecutiveMorningBriefing
        companyName={companyName}
        siteName={siteName}
        production={production}
        fleet={fleet}
        fuelCost={fuelCost}
        hse={hse}
        stockpile={stockpile}
        onOpenAICopilot={onOpenAICopilot}
        onNavigateModule={onNavigateModule}
      />

      {/* 2. Executive C-Level Headline Scoreboard (12 Key Metric Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Executive C-Level KPI Scoreboard
            </h3>
          </div>
          <span className="text-xs text-slate-400">Target vs Realisasi Periode Berjalan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {/* 1. Revenue */}
          <DashboardKPICard
            title="Revenue"
            value={`Rp ${(revenueIDR / 1000000000).toFixed(2)}M`}
            unit={`($${(revenueUSD / 1000).toFixed(0)}k)`}
            target={`Tgt Rp ${(targetRevenueIDR / 1000000000).toFixed(1)}M`}
            achievementPct={Number(((revenueIDR / targetRevenueIDR) * 100).toFixed(1))}
            icon={<DollarSign className="h-5 w-5" />}
            iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            statusBadge={{ label: "Gross Sales", type: "SUCCESS" }}
            onClick={() => onNavigateModule("finance")}
          />

          {/* 2. Production */}
          <DashboardKPICard
            title="Production"
            value={production.coalActualTon.toLocaleString("id-ID")}
            unit="Ton"
            target={`${production.coalTargetTon.toLocaleString("id-ID")} T`}
            achievementPct={production.coalAchievementPct}
            icon={<Pickaxe className="h-5 w-5" />}
            iconBgColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            statusBadge={{
              label: `${production.coalAchievementPct}% RKAB`,
              type: production.coalAchievementPct >= 95 ? "SUCCESS" : "WARNING",
            }}
            onClick={() => onNavigateModule("production")}
          />

          {/* 3. Sales & Offtake */}
          <DashboardKPICard
            title="Sales Offtake"
            value={salesVolumeTon.toLocaleString("id-ID")}
            unit="Ton"
            target={`$${coalPricePerTonUSD}/T`}
            icon={<Ship className="h-5 w-5" />}
            iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/30"
            statusBadge={{ label: "2 Barges Loaded", type: "INFO" }}
            onClick={() => onNavigateModule("sales")}
          />

          {/* 4. Cost (OPEX) */}
          <DashboardKPICard
            title="Total Cost (OPEX)"
            value={`Rp ${(fuelCost.operatingCostIDR / 1000000000).toFixed(2)}M`}
            target={`Bgt Rp ${(fuelCost.budgetCostIDR / 1000000000).toFixed(1)}M`}
            variance={`+${fuelCost.costVariancePct}%`}
            icon={<Coins className="h-5 w-5" />}
            iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/30"
            statusBadge={{
              label: fuelCost.costVariancePct <= 0 ? "Under Budget" : "Over Budget",
              type: fuelCost.costVariancePct <= 0 ? "SUCCESS" : "WARNING",
            }}
            onClick={() => onNavigateModule("finance")}
          />

          {/* 5. Profit & Margin */}
          <DashboardKPICard
            title="Profit (EBITDA)"
            value={`Rp ${(grossProfitIDR / 1000000000).toFixed(2)}M`}
            unit={`(${marginPct}%)`}
            target={`$${(grossProfitUSD / 1000).toFixed(0)}k`}
            icon={<TrendingUp className="h-5 w-5" />}
            iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            statusBadge={{ label: `Margin ${marginPct}%`, type: "SUCCESS" }}
            onClick={() => onNavigateModule("finance")}
          />

          {/* 6. Coal Inventory */}
          <DashboardKPICard
            title="Coal Inventory"
            value={stockpile.currentStockTon.toLocaleString("id-ID")}
            unit="Ton"
            target={`${stockpile.occupancyPct}% Cap`}
            icon={<PackageCheck className="h-5 w-5" />}
            iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/30"
            statusBadge={{
              label: `GAR ${stockpile.quality.calorificValueGAR}`,
              type: stockpile.occupancyPct <= 85 ? "SUCCESS" : "WARNING",
            }}
            onClick={() => onNavigateModule("stockpile")}
          />

          {/* 7. OB Removal */}
          <DashboardKPICard
            title="OB Removal"
            value={production.obActualBCM.toLocaleString("id-ID")}
            unit="BCM"
            target={`${production.obTargetBCM.toLocaleString("id-ID")} B`}
            achievementPct={production.obAchievementPct}
            icon={<Layers className="h-5 w-5" />}
            iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/30"
            statusBadge={{ label: `${production.obAchievementPct}% Plan`, type: "SUCCESS" }}
            onClick={() => onNavigateModule("production")}
          />

          {/* 8. Strip Ratio */}
          <DashboardKPICard
            title="Strip Ratio (SR)"
            value={`${production.stripRatioActual}`}
            unit="BCM/Ton"
            target={`Plan ${production.stripRatioPlan}`}
            variance={`${(production.stripRatioActual - production.stripRatioPlan).toFixed(2)}`}
            icon={<Scale className="h-5 w-5" />}
            iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/30"
            statusBadge={{
              label: production.stripRatioActual <= production.stripRatioPlan ? "Optimal SR" : "High SR",
              type: production.stripRatioActual <= production.stripRatioPlan ? "SUCCESS" : "WARNING",
            }}
            onClick={() => onNavigateModule("production")}
          />

          {/* 9. Fuel Cost & Ratio */}
          <DashboardKPICard
            title="Fuel Cost & Ratio"
            value={`${fuelCost.fuelPerTonRatio}`}
            unit="L/Ton"
            target={`Tgt ${fuelCost.fuelPerTonTarget}`}
            variance={`+${fuelCost.fuelVariancePct}%`}
            icon={<Fuel className="h-5 w-5" />}
            iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/30"
            statusBadge={{
              label: fuelCost.hasFuelAnomaly ? "Anomali Solar" : "Normal",
              type: fuelCost.hasFuelAnomaly ? "WARNING" : "SUCCESS",
            }}
            onClick={() => onNavigateModule("fuel")}
          />

          {/* 10. Mining Unit Cost */}
          <DashboardKPICard
            title="Mining Cost"
            value={`$${miningCostPerTonUSD}`}
            unit="/Ton"
            target={`$${miningCostPerBCMUSD}/BCM`}
            icon={<Coins className="h-5 w-5" />}
            iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
            statusBadge={{ label: "Unit Cost", type: "INFO" }}
            onClick={() => onNavigateModule("finance")}
          />

          {/* 11. Equipment Availability (PA) & Utilization (UA) */}
          <DashboardKPICard
            title="Equipment PA / UA"
            value={`${fleet.physicalAvailabilityPA}%`}
            unit={`(UA ${fleet.useOfAvailabilityUA}%)`}
            target={`PA ≥${fleet.paTarget}%`}
            icon={<Truck className="h-5 w-5" />}
            iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            statusBadge={{ label: `${fleet.running} Units Run`, type: "SUCCESS" }}
            onClick={() => onNavigateModule("fleet")}
          />

          {/* 12. HSE Safety KPI */}
          <DashboardKPICard
            title="HSE KPI (LTI Free)"
            value={`${hse.daysWithoutLTI}`}
            unit="Hari"
            target="Zero LTI"
            icon={<ShieldCheck className="h-5 w-5" />}
            iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            statusBadge={{ label: "Zero Fatality", type: "SUCCESS" }}
            onClick={() => onNavigateModule("hse")}
          />
        </div>
      </div>

      {/* 3. Comprehensive Target vs Actual Matrix */}
      <ExecutiveTargetVsActualMatrix
        production={production}
        fleet={fleet}
        fuelCost={fuelCost}
        hse={hse}
        stockpile={stockpile}
        onNavigateModule={onNavigateModule}
      />

      {/* 4. Financial Cost Structure & Efficiency Breakdown for Board of Directors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Structure Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" />
              <span>Struktur Biaya Tambang (OPEX Breakdown)</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-400">
              Total: Rp {(fuelCost.operatingCostIDR / 1000000000).toFixed(2)} M
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Bahan Bakar Solar Industri (Fuel)", amountIDR: fuelCost.costBreakdown.fuelIDR, pct: 36.0, color: "bg-amber-400" },
              { label: "Maintenance & Suku Cadang Alat", amountIDR: fuelCost.costBreakdown.maintenanceIDR, pct: 25.0, color: "bg-blue-400" },
              { label: "Tenaga Kerja & Operator (Labor)", amountIDR: fuelCost.costBreakdown.laborIDR, pct: 20.0, color: "bg-emerald-400" },
              { label: "Peledakan (Blasting) & Hauling", amountIDR: fuelCost.costBreakdown.haulingExplosivesIDR, pct: 13.0, color: "bg-purple-400" },
              { label: "Overhead & General Admin (Other)", amountIDR: fuelCost.costBreakdown.otherIDR, pct: 6.0, color: "bg-slate-400" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-bold text-white">
                    Rp {(item.amountIDR / 1000000).toFixed(0)} Jt ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stockpile & Barging Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-purple-400" />
              <span>Inventori ROM & Kualitas Batubara</span>
            </h4>
            <span className="text-[11px] font-black text-purple-400">
              {stockpile.occupancyPct}% Kapasitas
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Stok Saat Ini (ROM Stockpile):</span>
                <span className="font-black text-white">{stockpile.currentStockTon.toLocaleString("id-ID")} Ton</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Kapasitas Maksimal:</span>
                <span className="font-bold text-slate-300">{stockpile.totalCapacityTon.toLocaleString("id-ID")} Ton</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Ruang Tersisa:</span>
                <span className="font-bold text-emerald-400">{stockpile.availableCapacityTon.toLocaleString("id-ID")} Ton</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Kalori (GAR)</span>
                <span className="font-black text-amber-400 text-sm">{stockpile.quality.calorificValueGAR} kcal</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Total Moisture</span>
                <span className="font-black text-cyan-400 text-sm">{stockpile.quality.totalMoisturePct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Ash Content</span>
                <span className="font-black text-slate-200 text-sm">{stockpile.quality.ashContentPct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Total Sulfur</span>
                <span className="font-black text-emerald-400 text-sm">{stockpile.quality.totalSulfurPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Board Direct Actions & Export */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                Direktori Eksekutif & Laporan Direksi
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Akses cepat laporan ringkasan berkas direksi, analitika AI copilot, dan penandatanganan instruksi operasional harian.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onOpenExecutiveReport}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Buka Laporan Eksekutif PDF / Excel</span>
            </button>

            <button
              onClick={onOpenAICopilot}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 hover:text-white transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Konsultasi Strategis dengan AI Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
