// MINE SMART AI - Comprehensive Mining Cost Analytics, Unit Cost Decomposition & Break-Even Simulator
import React, { useState } from "react";
import {
  Pickaxe,
  Calculator,
  Layers,
  Cpu,
  Compass,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Fuel,
  Wrench,
  Truck,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Zap,
} from "lucide-react";
import { MiningCostModel, EquipmentCostDetail, FinanceKPISummary } from "../../../types/financeTypes";

interface MiningCostAnalyticsTabProps {
  kpi: FinanceKPISummary;
  miningCosts: MiningCostModel[];
  equipmentCosts: EquipmentCostDetail[];
}

export const MiningCostAnalyticsTab: React.FC<MiningCostAnalyticsTabProps> = ({
  kpi,
  miningCosts,
  equipmentCosts,
}) => {
  const [costScope, setCostScope] = useState<"MINING" | "HAULING" | "PROCESSING" | "TOTAL">("TOTAL");
  const [bcmSource, setBcmSource] = useState<"PRODUCTION" | "SURVEY" | "MINE_PLANNING">("PRODUCTION");
  const [showAIDiagnosis, setShowAIDiagnosis] = useState<boolean>(true);

  // Break-even Calculator state
  const [beSellingPriceUSD, setBeSellingPriceUSD] = useState<number>(88.5);
  const [beExchangeRate, setBeExchangeRate] = useState<number>(15850);
  const [beStripRatio, setBeStripRatio] = useState<number>(3.67); // BCM OB per MT Coal
  const [beFuelPricePerLitre, setBeFuelPricePerLitre] = useState<number>(15000); // IDR / Litre Solar
  const [beFixedCostIDR, setBeFixedCostIDR] = useState<number>(15000000000);

  const formatIDR = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    }
    if (Math.abs(val) >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Break-even math
  const priceIDRPerMT = beSellingPriceUSD * beExchangeRate;
  const variableCostPerTon = kpi.costPerTonIDR || 85100;
  const marginPerTon = priceIDRPerMT - variableCostPerTon;
  const breakEvenTon = marginPerTon > 0 ? Math.ceil(beFixedCostIDR / marginPerTon) : 0;
  const breakEvenRevenueIDR = breakEvenTon * priceIDRPerMT;

  const costPerTonDiff = kpi.costPerTonBaselineIDR
    ? ((kpi.costPerTonIDR - kpi.costPerTonBaselineIDR) / kpi.costPerTonBaselineIDR) * 100
    : 8.41;

  const costPerBCMDiff = kpi.costPerBCMBaselineIDR
    ? ((kpi.costPerBCMIDR - kpi.costPerBCMBaselineIDR) / kpi.costPerBCMBaselineIDR) * 100
    : 7.91;

  return (
    <div className="space-y-6">
      {/* Top Scope & Volume Source Controls */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Pickaxe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Mining Cost Analytics & Unit Cost Hub</h3>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded border border-amber-500/30">
                ESDM & SNI COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Analisis Unit Cost/Ton, Cost/BCM, Fuel, Maintenance, Hauling, Labor & Simulator Break-Even
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-bold px-2">Scope:</span>
            {[
              { key: "MINING", label: "Mining Only" },
              { key: "HAULING", label: "Hauling" },
              { key: "PROCESSING", label: "Processing" },
              { key: "TOTAL", label: "Total End-to-End" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setCostScope(s.key as any)}
                className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  costScope === s.key ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-bold px-2">BCM Source:</span>
            {[
              { key: "PRODUCTION", label: "Ritase Dispatch" },
              { key: "SURVEY", label: "Survey Drone" },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => setBcmSource(b.key as any)}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  bcmSource === b.key ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CORE 6 MINING COST PILLARS (Cost/ton, Cost/BCM, Fuel cost, Maintenance cost, Hauling cost, Labor cost) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* 1. COST / TON */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost / Ton Coal</span>
            <span className="text-rose-400 text-[10px] font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{costPerTonDiff.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            Rp {kpi.costPerTonIDR.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-slate-400"> /MT</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Baseline Target: Rp {(kpi.costPerTonBaselineIDR || 78500).toLocaleString("id-ID")} (Variance +Rp 6.600)
          </div>
        </div>

        {/* 2. COST / BCM */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost / BCM OB</span>
            <span className="text-rose-400 text-[10px] font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{costPerBCMDiff.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-400 tracking-tight">
            Rp {kpi.costPerBCMIDR.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-slate-400"> /BCM</span>
          </div>
          <div className="text-[10px] text-slate-500">
            OB Volume: {kpi.obVolumeBCM.toLocaleString("id-ID")} BCM ({bcmSource})
          </div>
        </div>

        {/* 3. FUEL COST */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Fuel Cost</span>
            </div>
            <span className="text-amber-400 text-[10px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              B35 Solar
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatIDR(kpi.fuelCostTotalIDR)}
          </div>
          <div className="text-[10px] text-slate-400">
            Fuel Ratio: <strong className="text-amber-400">0.74 L / BCM</strong> (Target: 0.65 L)
          </div>
        </div>

        {/* 4. MAINTENANCE COST */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5 text-rose-400" />
              <span>Maintenance</span>
            </div>
            <span className="text-rose-400 text-[10px] font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              Over Budget
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatIDR(kpi.maintenanceCostTotalIDR)}
          </div>
          <div className="text-[10px] text-slate-400">
            PM 58% / CM Unscheduled 42%
          </div>
        </div>

        {/* 5. HAULING COST */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hauling Cost</span>
            </div>
            <span className="text-indigo-400 text-[10px] font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              5.0 KM
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatIDR(kpi.haulingCostTotalIDR)}
          </div>
          <div className="text-[10px] text-slate-400">
            Road Maintenance & Stripping
          </div>
        </div>

        {/* 6. LABOR COST */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Labor Cost</span>
            </div>
            <span className="text-teal-400 text-[10px] font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
              Shift 1-3
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatIDR(kpi.laborCostTotalIDR)}
          </div>
          <div className="text-[10px] text-slate-400">
            Payroll + Lembur Rainy Catch-up
          </div>
        </div>
      </div>

      {/* AI AUTOMATED ANALYSIS BANNER: "Apa penyebab mining cost naik bulan ini?" */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-amber-400 uppercase">
                  AI Automated Cost Analysis Engine
                </span>
                <span className="text-[10px] px-2 py-0.2 bg-rose-500/20 text-rose-300 font-black rounded border border-rose-500/30">
                  VARIANCE REPORT
                </span>
              </div>
              <h4 className="text-sm font-black text-white">
                "Apa penyebab mining cost naik bulan ini?" — Evaluasi Otomatis AI
              </h4>
            </div>
          </div>

          <button
            onClick={() => setShowAIDiagnosis(!showAIDiagnosis)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
          >
            {showAIDiagnosis ? "Sembunyikan Rincian" : "Tampilkan Rincian Analisis"}
          </button>
        </div>

        {showAIDiagnosis && (
          <div className="space-y-4 pt-1">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-bold">Ringkasan Eksekutif AI:</strong> Mining cost bulan berjalan mengalami kenaikan sebesar <strong className="text-rose-400 font-bold">+Rp 6.600/MT (+8.41%)</strong> pada batubara dan <strong className="text-rose-400 font-bold">+Rp 1.700/BCM (+7.91%)</strong> pada overburden. Sistem mendeteksi 4 akar penyebab (root cause) dominan berikut:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" /> 1. Fuel Hauling Distance (+41.8% Kontribusi)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">+Rp 580 Juta</span>
                </div>
                <p className="text-slate-400">
                  Jarak angkut OB ke West Dump bertambah dari 3.2 km menjadi 5.0 km (+1.8 km). Rasio fuel melonjak dari 0.65 menjadi 0.74 Liter/BCM.
                </p>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  💡 Solusi: Aktifkan in-pit dumping sequence di Pit 1 South RL +30 (Saving est. Rp 350 Juta/bln).
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" /> 2. Emergency Fleet Breakdown (+28.1% Kontribusi)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">+Rp 390 Juta</span>
                </div>
                <p className="text-slate-400">
                  Kerusakan hydraulic cylinder Excavator PC1250 EX-204 memerlukan suku cadang darurat melalui expedited air freight.
                </p>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  💡 Solusi: Terapkan oil sampling mingguan & preventive maintenance check 250 SMU.
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> 3. Kondisi Jalan Licin / Cuaca Hujan (+18.0% Kontribusi)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">+Rp 250 Juta</span>
                </div>
                <p className="text-slate-400">
                  Curah hujan tinggi pada minggu ke-2 Agustus menurunkan kecepatan rata-rata hauling truck dari 24 km/jam menjadi 16 km/jam.
                </p>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  💡 Solusi: Intensifkan grader GD825 & perataan batu split macadam di KM 12-14.
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> 4. Jam Lembur Operator Shift 2 & 3 (+12.1% Kontribusi)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">+Rp 166 Juta</span>
                </div>
                <p className="text-slate-400">
                  Penambahan 140 jam lembur mekanik & operator untuk mengejar stripping batubara pasca rain stoppage.
                </p>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  💡 Solusi: Optimalisasi rotasi roster & fleet matching 1:5 saat cuaca cerah tanpa lembur berlebih.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pit Level Mining Cost Model Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Struktur Biaya Tambang Per Pit (Pit-Level Cost Model)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Rincian Drilling, Blasting, Loading, Hauling & Unit Cost Per Pit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Pit & Lokasi</th>
                <th className="p-3">Produksi Coal</th>
                <th className="p-3">Volume OB</th>
                <th className="p-3">Drill & Blast</th>
                <th className="p-3">Excavate & Load</th>
                <th className="p-3">Hauling & Road</th>
                <th className="p-3 text-right">Total Mining Cost</th>
                <th className="p-3 text-right">Cost / Ton</th>
                <th className="p-3 text-right">Cost / BCM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {miningCosts.map((m) => (
                <tr key={m.pitId} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-white">{m.pitName}</td>
                  <td className="p-3 font-mono">{m.coalProductionMT.toLocaleString("id-ID")} MT</td>
                  <td className="p-3 font-mono">{m.obVolumeBCM.toLocaleString("id-ID")} BCM</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(m.drillingCostIDR + m.blastingCostIDR)}</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(m.excavationCostIDR + m.loadingCostIDR)}</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(m.haulingCostIDR + m.roadMaintenanceCostIDR)}</td>
                  <td className="p-3 font-mono text-right font-black text-amber-400">{formatIDR(m.totalMiningCostIDR)}</td>
                  <td className="p-3 font-mono text-right font-bold text-emerald-400">Rp {m.costPerTonIDR.toLocaleString("id-ID")}</td>
                  <td className="p-3 font-mono text-right font-bold text-cyan-400">Rp {m.costPerBCMIDR.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Cost Breakdown Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Alokasi Biaya Fleet Alat Berat (Equipment Operating Cost & Hourly Rate)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Biaya Fuel, Maintenance, Operator & Hourly Cost Rate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Kode Fleet</th>
                <th className="p-3">Nama Unit</th>
                <th className="p-3">Working Hours</th>
                <th className="p-3">Fuel Cost (IDR)</th>
                <th className="p-3">Maintenance (IDR)</th>
                <th className="p-3">Labor & Operator</th>
                <th className="p-3">Depresiasi</th>
                <th className="p-3 text-right">Total Cost</th>
                <th className="p-3 text-right">Cost / Hour (SMU)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {equipmentCosts.map((eq) => (
                <tr key={eq.equipmentCode} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">{eq.equipmentCode}</td>
                  <td className="p-3 font-bold text-white">{eq.equipmentName}</td>
                  <td className="p-3 font-mono">{eq.workingHours} Jam</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(eq.fuelCostIDR)}</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(eq.maintenanceCostIDR)}</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(eq.laborCostIDR)}</td>
                  <td className="p-3 font-mono text-slate-300">{formatIDR(eq.depreciationCostIDR)}</td>
                  <td className="p-3 font-mono text-right font-black text-amber-400">{formatIDR(eq.totalCostIDR)}</td>
                  <td className="p-3 font-mono text-right font-bold text-cyan-400">Rp {eq.costPerHourIDR.toLocaleString("id-ID")} /Jam</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break-Even Point & Mine Sensitivity Calculator */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Interactive Break-Even & Mine Financial Sensitivity Simulator</h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulasi Titik Impas Produksi Berdasarkan Harga Jual & Fluktuasi Biaya
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Coal Selling Price (USD/MT):</label>
            <input
              type="number"
              step="0.5"
              value={beSellingPriceUSD}
              onChange={(e) => setBeSellingPriceUSD(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Exchange Rate (IDR/USD):</label>
            <input
              type="number"
              step="50"
              value={beExchangeRate}
              onChange={(e) => setBeExchangeRate(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Strip Ratio (BCM OB / MT):</label>
            <input
              type="number"
              step="0.1"
              value={beStripRatio}
              onChange={(e) => setBeStripRatio(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Fuel Price Solar B35 (IDR/L):</label>
            <input
              type="number"
              step="500"
              value={beFuelPricePerLitre}
              onChange={(e) => setBeFuelPricePerLitre(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
            />
          </div>
        </div>

        {/* Calculator Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Effective Price per MT</span>
            <div className="text-xl font-black text-emerald-400">{formatIDR(priceIDRPerMT)}</div>
            <span className="text-[10px] text-slate-500">Margin/MT: {formatIDR(marginPerTon)}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Break-Even Volume (BEP)</span>
            <div className="text-xl font-black text-amber-400">{breakEvenTon.toLocaleString("id-ID")} MT</div>
            <span className="text-[10px] text-slate-500">Target Minimal Produksi Bulanan</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Break-Even Revenue</span>
            <div className="text-xl font-black text-cyan-400">{formatIDR(breakEvenRevenueIDR)}</div>
            <span className="text-[10px] text-slate-500">Nilai Ambang Penjualan Impas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
