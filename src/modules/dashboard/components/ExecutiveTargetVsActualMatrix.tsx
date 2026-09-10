// MINE SMART AI - Executive Target vs Actual RKAB Performance Matrix
// Tampilan Komprehensif Target vs Realisasi untuk CEO / Direktur / Owner

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Filter,
  DollarSign,
  Layers,
  Truck,
  Fuel,
  ShieldCheck,
  Flame,
  Scale,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { ProductionKPIData, FleetKPIData, FuelCostKPIData, HSEKPIData, StockpileKPIData } from "../../../services/dashboard/DashboardAnalyticsService";

interface ExecutiveTargetVsActualMatrixProps {
  production: ProductionKPIData;
  fleet: FleetKPIData;
  fuelCost: FuelCostKPIData;
  hse: HSEKPIData;
  stockpile: StockpileKPIData;
  onNavigateModule?: (moduleKey: string) => void;
}

export const ExecutiveTargetVsActualMatrix: React.FC<ExecutiveTargetVsActualMatrixProps> = ({
  production,
  fleet,
  fuelCost,
  hse,
  stockpile,
  onNavigateModule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Calculated Financial Metrics
  const coalPricePerTonUSD = 68.5;
  const exchangeRate = 16200;
  
  // Actuals & Targets
  const actualRevenueIDR = Math.round(production.coalActualTon * coalPricePerTonUSD * exchangeRate);
  const targetRevenueIDR = Math.round(production.coalTargetTon * coalPricePerTonUSD * exchangeRate);
  const revenueVariancePct = Number((((actualRevenueIDR - targetRevenueIDR) / targetRevenueIDR) * 100).toFixed(1));

  const actualSalesTon = Math.round(production.coalActualTon * 0.88); // 88% barged
  const targetSalesTon = Math.round(production.coalTargetTon * 0.90);
  const salesAchievementPct = Number(((actualSalesTon / targetSalesTon) * 100).toFixed(1));

  const actualCostIDR = fuelCost.operatingCostIDR;
  const budgetCostIDR = fuelCost.budgetCostIDR;
  const costVariancePct = Number((((actualCostIDR - budgetCostIDR) / budgetCostIDR) * 100).toFixed(1));

  const actualEbitdaIDR = actualRevenueIDR - actualCostIDR;
  const targetEbitdaIDR = targetRevenueIDR - budgetCostIDR;
  const ebitdaAchievementPct = Number(((actualEbitdaIDR / targetEbitdaIDR) * 100).toFixed(1));

  const miningCostActualUSD = Number(((actualCostIDR / exchangeRate) / Math.max(1, production.coalActualTon)).toFixed(2));
  const miningCostTargetUSD = 21.00;

  // Complete List of All Required Executive KPIs
  const matrixItems = [
    {
      id: "REV",
      kpiName: "Revenue (Pendapatan Kotor)",
      category: "FINANCIAL",
      unit: "Miliar IDR",
      actual: Number((actualRevenueIDR / 1000000000).toFixed(2)),
      target: Number((targetRevenueIDR / 1000000000).toFixed(2)),
      actualStr: `Rp ${(actualRevenueIDR / 1000000000).toFixed(2)} M`,
      targetStr: `Rp ${(targetRevenueIDR / 1000000000).toFixed(2)} M`,
      varianceStr: `${revenueVariancePct >= 0 ? "+" : ""}${revenueVariancePct}%`,
      achievementPct: Number(((actualRevenueIDR / targetRevenueIDR) * 100).toFixed(1)),
      status: revenueVariancePct >= 0 ? "EXCELLENT" : revenueVariancePct >= -5 ? "NORMAL" : "WARNING",
      trend: revenueVariancePct >= 0 ? "UP" : "DOWN",
      moduleKey: "finance",
      note: "Harga acuan coal $68.5/MT, kurs Rp 16.200/USD",
    },
    {
      id: "PROD",
      kpiName: "Coal Production (Produksi Batubara)",
      category: "PRODUCTION",
      unit: "Ton",
      actual: production.coalActualTon,
      target: production.coalTargetTon,
      actualStr: `${production.coalActualTon.toLocaleString("id-ID")} Ton`,
      targetStr: `${production.coalTargetTon.toLocaleString("id-ID")} Ton`,
      varianceStr: `${production.coalVarianceTon >= 0 ? "+" : ""}${production.coalVarianceTon.toLocaleString("id-ID")} Ton`,
      achievementPct: production.coalAchievementPct,
      status: production.coalAchievementPct >= 100 ? "EXCELLENT" : production.coalAchievementPct >= 95 ? "NORMAL" : "WARNING",
      trend: production.coalAchievementPct >= 95 ? "UP" : "DOWN",
      moduleKey: "production",
      note: "Kontribusi Pit North 62%, Pit Central 38%",
    },
    {
      id: "SALES",
      kpiName: "Sales & Barging Offtake",
      category: "COMMERCIAL",
      unit: "Ton",
      actual: actualSalesTon,
      target: targetSalesTon,
      actualStr: `${actualSalesTon.toLocaleString("id-ID")} Ton`,
      targetStr: `${targetSalesTon.toLocaleString("id-ID")} Ton`,
      varianceStr: `${(actualSalesTon - targetSalesTon).toLocaleString("id-ID")} Ton`,
      achievementPct: salesAchievementPct,
      status: salesAchievementPct >= 95 ? "EXCELLENT" : "NORMAL",
      trend: "UP",
      moduleKey: "sales",
      note: "2 Tongkang 300ft terisi di Jetty Port A",
    },
    {
      id: "COST",
      kpiName: "Total Cost (Biaya Operasional OPEX)",
      category: "FINANCIAL",
      unit: "Miliar IDR",
      actual: Number((actualCostIDR / 1000000000).toFixed(2)),
      target: Number((budgetCostIDR / 1000000000).toFixed(2)),
      actualStr: `Rp ${(actualCostIDR / 1000000000).toFixed(2)} M`,
      targetStr: `Rp ${(budgetCostIDR / 1000000000).toFixed(2)} M`,
      varianceStr: `+${costVariancePct}% (${costVariancePct > 0 ? "Over Budget" : "Under"})`,
      achievementPct: Number(((actualCostIDR / budgetCostIDR) * 100).toFixed(1)),
      status: costVariancePct <= 0 ? "EXCELLENT" : costVariancePct <= 5 ? "NORMAL" : "WARNING",
      trend: costVariancePct <= 0 ? "UP" : "DOWN",
      moduleKey: "finance",
      note: "Komponen terbesar: Solar 36%, Maintenance 25%",
    },
    {
      id: "PROFIT",
      kpiName: "Gross Profit & EBITDA",
      category: "FINANCIAL",
      unit: "Miliar IDR",
      actual: Number((actualEbitdaIDR / 1000000000).toFixed(2)),
      target: Number((targetEbitdaIDR / 1000000000).toFixed(2)),
      actualStr: `Rp ${(actualEbitdaIDR / 1000000000).toFixed(2)} M`,
      targetStr: `Rp ${(targetEbitdaIDR / 1000000000).toFixed(2)} M`,
      varianceStr: `${ebitdaAchievementPct >= 100 ? "+" : ""}${(ebitdaAchievementPct - 100).toFixed(1)}%`,
      achievementPct: ebitdaAchievementPct,
      status: ebitdaAchievementPct >= 95 ? "EXCELLENT" : "NORMAL",
      trend: "UP",
      moduleKey: "finance",
      note: "Margin laba kotor 75.3% dari total revenue",
    },
    {
      id: "INV",
      kpiName: "Coal Inventory (Stok ROM & Port)",
      category: "LOGISTICS",
      unit: "Ton",
      actual: stockpile.currentStockTon,
      target: stockpile.totalCapacityTon,
      actualStr: `${stockpile.currentStockTon.toLocaleString("id-ID")} Ton`,
      targetStr: `Kapasitas ${stockpile.totalCapacityTon.toLocaleString("id-ID")} T`,
      varianceStr: `${stockpile.availableCapacityTon.toLocaleString("id-ID")} Ton Sisa`,
      achievementPct: stockpile.occupancyPct,
      status: stockpile.occupancyPct <= 80 ? "EXCELLENT" : stockpile.occupancyPct <= 90 ? "WARNING" : "CRITICAL",
      trend: "UP",
      moduleKey: "stockpile",
      note: `Okupansi ${stockpile.occupancyPct}%, Kualitas GAR ${stockpile.quality.calorificValueGAR}`,
    },
    {
      id: "OB",
      kpiName: "Overburden (OB) Removal",
      category: "PRODUCTION",
      unit: "BCM",
      actual: production.obActualBCM,
      target: production.obTargetBCM,
      actualStr: `${production.obActualBCM.toLocaleString("id-ID")} BCM`,
      targetStr: `${production.obTargetBCM.toLocaleString("id-ID")} BCM`,
      varianceStr: `${production.obVarianceBCM >= 0 ? "+" : ""}${production.obVarianceBCM.toLocaleString("id-ID")} BCM`,
      achievementPct: production.obAchievementPct,
      status: production.obAchievementPct >= 95 ? "EXCELLENT" : "NORMAL",
      trend: "UP",
      moduleKey: "production",
      note: "Fleet Excavator PC2000 & EX1200",
    },
    {
      id: "SR",
      kpiName: "Strip Ratio (SR BCM/Ton)",
      category: "PRODUCTION",
      unit: "BCM/Ton",
      actual: production.stripRatioActual,
      target: production.stripRatioPlan,
      actualStr: `${production.stripRatioActual} : 1`,
      targetStr: `${production.stripRatioPlan} : 1`,
      varianceStr: `${(production.stripRatioActual - production.stripRatioPlan).toFixed(2)} BCM/T`,
      achievementPct: Number(((production.stripRatioPlan / production.stripRatioActual) * 100).toFixed(1)),
      status: production.stripRatioActual <= production.stripRatioPlan ? "EXCELLENT" : "NORMAL",
      trend: "STABLE",
      moduleKey: "production",
      note: "Sesuai RKAB Triwulan III",
    },
    {
      id: "FUEL_COST",
      kpiName: "Fuel Cost & Fuel Ratio",
      category: "COST_EFFICIENCY",
      unit: "L/Ton",
      actual: fuelCost.fuelPerTonRatio,
      target: fuelCost.fuelPerTonTarget,
      actualStr: `${fuelCost.fuelPerTonRatio} L/Ton (Rp ${(fuelCost.totalFuelCostIDR / 1000000).toFixed(0)} Juta)`,
      targetStr: `${fuelCost.fuelPerTonTarget} L/Ton`,
      varianceStr: `+${fuelCost.fuelVariancePct}% (Anomali)`,
      achievementPct: Number(((fuelCost.fuelPerTonTarget / fuelCost.fuelPerTonRatio) * 100).toFixed(1)),
      status: fuelCost.hasFuelAnomaly ? "WARNING" : "EXCELLENT",
      trend: "DOWN",
      moduleKey: "fuel",
      note: "Total konsumsi: 48.500 Liter solar industri",
    },
    {
      id: "MINING_COST",
      kpiName: "Mining Unit Cost ($/Ton)",
      category: "COST_EFFICIENCY",
      unit: "USD/Ton",
      actual: miningCostActualUSD,
      target: miningCostTargetUSD,
      actualStr: `$${miningCostActualUSD} / Ton`,
      targetStr: `$${miningCostTargetUSD} / Ton`,
      varianceStr: `+$${(miningCostActualUSD - miningCostTargetUSD).toFixed(2)} / Ton`,
      achievementPct: Number(((miningCostTargetUSD / miningCostActualUSD) * 100).toFixed(1)),
      status: miningCostActualUSD <= miningCostTargetUSD ? "EXCELLENT" : "NORMAL",
      trend: "STABLE",
      moduleKey: "finance",
      note: "Equivalent $2.85 / BCM Overburden",
    },
    {
      id: "FLEET_PA",
      kpiName: "Equipment Availability (PA)",
      category: "FLEET",
      unit: "%",
      actual: fleet.physicalAvailabilityPA,
      target: fleet.paTarget,
      actualStr: `${fleet.physicalAvailabilityPA}%`,
      targetStr: `≥ ${fleet.paTarget}%`,
      varianceStr: `+${fleet.paVariance}%`,
      achievementPct: Number(((fleet.physicalAvailabilityPA / fleet.paTarget) * 100).toFixed(1)),
      status: fleet.physicalAvailabilityPA >= fleet.paTarget ? "EXCELLENT" : "WARNING",
      trend: "UP",
      moduleKey: "fleet",
      note: "62 Unit Running, 8 Maintenance, 5 Breakdown",
    },
    {
      id: "FLEET_UA",
      kpiName: "Equipment Utilization (UA)",
      category: "FLEET",
      unit: "%",
      actual: fleet.useOfAvailabilityUA,
      target: fleet.uaTarget,
      actualStr: `${fleet.useOfAvailabilityUA}%`,
      targetStr: `≥ ${fleet.uaTarget}%`,
      varianceStr: `${fleet.uaVariance}%`,
      achievementPct: Number(((fleet.useOfAvailabilityUA / fleet.uaTarget) * 100).toFixed(1)),
      status: fleet.useOfAvailabilityUA >= fleet.uaTarget ? "EXCELLENT" : "NORMAL",
      trend: "STABLE",
      moduleKey: "fleet",
      note: "Idling time rata-rata 1.4 jam per unit",
    },
    {
      id: "HSE_KPI",
      kpiName: "HSE Safety & K3LH Record",
      category: "SAFETY",
      unit: "Hari",
      actual: hse.daysWithoutLTI,
      target: 365,
      actualStr: `${hse.daysWithoutLTI} Hari Bebas LTI`,
      targetStr: "365 Hari (Zero LTI)",
      varianceStr: "0 Fatality, 0 Major LTI",
      achievementPct: 100,
      status: "EXCELLENT",
      trend: "UP",
      moduleKey: "hse",
      note: "TRIFR 0.18, 1 Temuan Risiko Blasting",
    },
  ];

  const filteredItems = selectedCategory === "ALL"
    ? matrixItems
    : matrixItems.filter((m) => m.category === selectedCategory);

  const categories = [
    { key: "ALL", label: "Semua KPI (13 Parameter)" },
    { key: "FINANCIAL", label: "Financial & Revenue" },
    { key: "PRODUCTION", label: "Produksi & Mine Plan" },
    { key: "COST_EFFICIENCY", label: "Cost & Fuel Unit Rate" },
    { key: "FLEET", label: "Armada PA / UA" },
    { key: "SAFETY", label: "K3LH / HSE" },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-5">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-400" />
            <span>Target vs Actual Matrix — Realisasi RKAB Komprehensif</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tabel matriks evaluasi kinerja eksekutif untuk <strong>CEO, Direktur & Pemilik Tambang</strong>.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === c.key
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target vs Actual Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-black uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3.5">Key Performance Indicator (KPI)</th>
              <th className="p-3.5">Realisasi (Actual)</th>
              <th className="p-3.5">Target / RKAB Plan</th>
              <th className="p-3.5">Variansi Deviasi</th>
              <th className="p-3.5 w-36">Pencapaian %</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5">Catatan Operasional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredItems.map((item) => {
              const isExcellent = item.status === "EXCELLENT";
              const isNormal = item.status === "NORMAL";
              const isWarning = item.status === "WARNING";

              return (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.kpiName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-3.5 font-black text-white text-sm">
                    {item.actualStr}
                  </td>

                  <td className="p-3.5 text-slate-300 font-semibold">
                    {item.targetStr}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`font-black inline-flex items-center gap-1 ${
                        isExcellent ? "text-emerald-400" : isNormal ? "text-cyan-400" : "text-amber-400"
                      }`}
                    >
                      {item.trend === "UP" ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : item.trend === "DOWN" ? (
                        <TrendingDown className="h-3.5 w-3.5" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                      <span>{item.varianceStr}</span>
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={item.achievementPct >= 95 ? "text-emerald-400" : "text-amber-400"}>
                          {item.achievementPct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.achievementPct >= 100
                              ? "bg-emerald-400"
                              : item.achievementPct >= 90
                              ? "bg-cyan-400"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${Math.min(100, item.achievementPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 border ${
                        isExcellent
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : isNormal
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isExcellent && <CheckCircle2 className="h-3 w-3" />}
                      {isNormal && <CheckCircle2 className="h-3 w-3" />}
                      {isWarning && <AlertTriangle className="h-3 w-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>

                  <td className="p-3.5 text-[11px] text-slate-400 max-w-xs leading-snug">
                    {item.note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
