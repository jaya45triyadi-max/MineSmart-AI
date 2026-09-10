import React, { useState } from "react";
import {
  Flame,
  Droplets,
  Layers,
  Zap,
  Scale,
  Sparkles,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Info,
  CheckCircle2,
  Sliders,
  RefreshCw,
} from "lucide-react";

interface QualityParameterDef {
  key: string;
  name: string;
  shortName: string;
  unit: string;
  standardBasis: "ARB" | "ADB" | "DB" | "DAF";
  typicalValue: number;
  minWarning: number;
  maxWarning: number;
  rejectionLimit: string;
  testMethod: string;
  equipment: string;
  description: string;
  commercialImpact: string;
}

export const QualityParametersTab: React.FC = () => {
  // 7 Core Coal Quality Parameters
  const qualityParameters: QualityParameterDef[] = [
    {
      key: "GCV",
      name: "Gross Calorific Value (GCV)",
      shortName: "GCV (ADB)",
      unit: "kcal/kg",
      standardBasis: "ADB",
      typicalValue: 6150,
      minWarning: 5950,
      maxWarning: 6350,
      rejectionLimit: "< 5,900 kcal/kg ADB",
      testMethod: "ASTM D5865 / ISO 1928",
      equipment: "Isoperibol Bomb Calorimeter (IKA C6000)",
      description: "Nilai kalor kotor batubara pada basis Air Dried. Menentukan potensi energi termal batubara murni.",
      commercialImpact: "Basis utama penentuan harga dasar batubara FOB dan indeks ICI / Newcastle.",
    },
    {
      key: "GAR",
      name: "Gross As Received (GAR)",
      shortName: "GAR (ARB)",
      unit: "kcal/kg",
      standardBasis: "ARB",
      typicalValue: 5820,
      minWarning: 5700,
      maxWarning: 5950,
      rejectionLimit: "< 5,700 kcal/kg ARB",
      testMethod: "Calculated from GCV, TM, & IM (ASTM D3180)",
      equipment: "Computational Conversion Engine",
      description: "Nilai kalor total pada kondisi saat batubara diterima/dikirim (memperhitungkan total moisture).",
      commercialImpact: "Spesifikasi kontrak mutlak untuk PLTU PLN dan pembeli ekspor global. GAR Bonus/Penalty applies.",
    },
    {
      key: "Ash",
      name: "Ash Content",
      shortName: "Ash (ADB)",
      unit: "%",
      standardBasis: "ADB",
      typicalValue: 6.8,
      minWarning: 5.0,
      maxWarning: 8.0,
      rejectionLimit: "> 8.5% ADB",
      testMethod: "ASTM D3174 / ISO 1171",
      equipment: "Muffle Furnace (815°C Slow Ashing)",
      description: "Residu anorganik (abu) yang tersisa setelah pembakaran sempurna pada suhu 815°C.",
      commercialImpact: "Abu tinggi menyebabkan penumpukan slagging/fouling pada boiler PLTU dan biaya disposal abu fly ash/bottom ash.",
    },
    {
      key: "Sulfur",
      name: "Total Sulfur (TS)",
      shortName: "TS (ADB)",
      unit: "%",
      standardBasis: "ADB",
      typicalValue: 0.65,
      minWarning: 0.40,
      maxWarning: 0.80,
      rejectionLimit: "> 0.85% ADB",
      testMethod: "ASTM D4239 / ISO 19579",
      equipment: "High Temperature Combustion Sulfur Analyzer (LECO SC-632)",
      description: "Kandungan total belerang organik, pirit, dan sulfat dalam batubara.",
      commercialImpact: "Faktor pembatas emisi SOx lingkungan. Sulfur > 0.85% dikenakan penalti berat atau penolakan kargo (Rejection).",
    },
    {
      key: "TM",
      name: "Total Moisture (TM)",
      shortName: "TM (ARB)",
      unit: "%",
      standardBasis: "ARB",
      typicalValue: 24.5,
      minWarning: 22.0,
      maxWarning: 25.5,
      rejectionLimit: "> 26.0% ARB",
      testMethod: "ASTM D3302 / ISO 589",
      equipment: "Nitrogen Purged Moisture Oven (105°C)",
      description: "Total kelembaban (Inherent Moisture + Free Surface Moisture) pada batubara as-received.",
      commercialImpact: "Setiap kenaikan 1% TM menurunkan GAR sekitar 80 kcal/kg dan meningkatkan beban ongkos angkut (freight water penalty).",
    },
    {
      key: "IM",
      name: "Inherent Moisture (IM)",
      shortName: "IM (ADB)",
      unit: "%",
      standardBasis: "ADB",
      typicalValue: 10.5,
      minWarning: 9.5,
      maxWarning: 12.0,
      rejectionLimit: "> 13.0% ADB",
      testMethod: "ASTM D3173 / ISO 11722",
      equipment: "Drying Oven under Inert Atmosphere (105°C - 110°C)",
      description: "Kelembaban intrinsik yang terikat dalam pori-pori mikroskopis struktur batubara.",
      commercialImpact: "Indikator rank kematangan batubara (Sub-bituminous vs Bituminous). Menentukan rasio konversi ADB ke ARB.",
    },
    {
      key: "VM",
      name: "Volatile Matter (VM)",
      shortName: "VM (ADB)",
      unit: "%",
      standardBasis: "ADB",
      typicalValue: 41.2,
      minWarning: 38.0,
      maxWarning: 43.0,
      rejectionLimit: "< 37.0% ADB",
      testMethod: "ASTM D3175 / ISO 562",
      equipment: "High Temp Volatile Crucible Furnace (900°C ± 10°C)",
      description: "Gas dan uap organik yang terlepas saat batubara dipanaskan tanpa udara pada suhu 900°C selama 7 menit.",
      commercialImpact: "Menentukan kemudahan penyalaan (flame ignition stability) dan reaktivitas batubara di ruang bakar boiler.",
    },
  ];

  // Secondary Proximate Parameters
  const secondaryParams = [
    { name: "Fixed Carbon (FC)", value: "41.5%", basis: "ADB", method: "100 - (IM + Ash + VM)", role: "Kandungan karbon murni yang menghasilkan panas stabil." },
    { name: "Hardgrove Index (HGI)", value: "48 - 52", basis: "Index", method: "ASTM D409", role: "Tingkat kemudahan penggilingan pada coal pulverizer boiler." },
    { name: "Ash Fusion Temp (IDT)", value: "1,220 °C", basis: "Reducing", method: "ASTM D1857", role: "Titik leleh abu untuk mencegah terak di dinding boiler." },
    { name: "Sizing (0 - 50 mm)", value: "95% passing", basis: "Screen", method: "ISO 1953", role: "Ukuran butir seragam untuk kelancaran conveyor & bunker." },
  ];

  // Interactive Multi-Basis Conversion Calculator State
  const [calcGCV_adb, setCalcGCV_adb] = useState<number>(6150);
  const [calcTM, setCalcTM] = useState<number>(24.5);
  const [calcIM, setCalcIM] = useState<number>(10.5);
  const [calcAsh_adb, setCalcAsh_adb] = useState<number>(6.8);
  const [calcTS_adb, setCalcTS_adb] = useState<number>(0.65);
  const [calcVM_adb, setCalcVM_adb] = useState<number>(41.2);

  // Derived Conversions
  // Conversion factors:
  // ADB to ARB: (100 - TM) / (100 - IM)
  // ADB to DB: 100 / (100 - IM)
  // ADB to DAF: 100 / (100 - IM - Ash_adb)
  const adbToArbFactor = (100 - calcTM) / (100 - calcIM);
  const adbToDbFactor = 100 / (100 - calcIM);
  const adbToDafFactor = 100 / Math.max(1, 100 - calcIM - calcAsh_adb);

  const garArb = Math.round(calcGCV_adb * adbToArbFactor);
  const gcvDb = Math.round(calcGCV_adb * adbToDbFactor);
  const gcvDaf = Math.round(calcGCV_adb * adbToDafFactor);

  const ashArb = +(calcAsh_adb * adbToArbFactor).toFixed(2);
  const ashDb = +(calcAsh_adb * adbToDbFactor).toFixed(2);

  const tsArb = +(calcTS_adb * adbToArbFactor).toFixed(2);
  const tsDb = +(calcTS_adb * adbToDbFactor).toFixed(2);

  const vmArb = +(calcVM_adb * adbToArbFactor).toFixed(2);
  const vmDb = +(calcVM_adb * adbToDbFactor).toFixed(2);
  const vmDaf = +(calcVM_adb * adbToDafFactor).toFixed(2);

  const fcAdb = +(100 - calcIM - calcAsh_adb - calcVM_adb).toFixed(2);
  const fcArb = +(fcAdb * adbToArbFactor).toFixed(2);
  const fcDb = +(fcAdb * adbToDbFactor).toFixed(2);

  const [selectedParamKey, setSelectedParamKey] = useState<string>("GCV");
  const activeDetailParam = qualityParameters.find((p) => p.key === selectedParamKey) || qualityParameters[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 uppercase tracking-wider">
              COAL QUALITY PARAMETERS & CERTIFIED ASSAYS
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              ASTM / ISO Standardized
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            7 Core Coal Quality Parameters & Multi-Basis Assay Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Parameter kualitas batubara komersial: <strong>GCV, GAR, Ash, Sulfur (TS), Total Moisture (TM), Inherent Moisture (IM), dan Volatile Matter (VM)</strong> beserta konversi multi-basis (ARB / ADB / DB / DAF) otomatis.
          </p>
        </div>
      </div>

      {/* 7 PARAMETER QUICK CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityParameters.map((param) => {
          const isSelected = selectedParamKey === param.key;
          return (
            <div
              key={param.key}
              onClick={() => setSelectedParamKey(param.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? "bg-slate-50 dark:bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {param.key}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Basis: {param.standardBasis}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {param.name}
                </h3>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {param.typicalValue.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-slate-400 font-sans">{param.unit}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono text-[10px]">
                  Rejection: {param.rejectionLimit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED PARAMETER DEEP DIAGNOSTIC CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                PARAMETER PROFILE & LABORATORY PROTOCOL
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activeDetailParam.name} ({activeDetailParam.shortName})
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ASTM / ISO Certified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Test Standard Method</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {activeDetailParam.testMethod}
            </div>
            <p className="text-[11px] text-slate-500">{activeDetailParam.equipment}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Description & Chemical Meaning</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeDetailParam.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Commercial & Contract Impact</span>
            <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
              {activeDetailParam.commercialImpact}
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MULTI-BASIS CONVERSION CALCULATOR (ARB / ADB / DB / DAF) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Interactive Multi-Basis Coal Quality Calculator (ARB ⇄ ADB ⇄ DB ⇄ DAF)
              </h3>
              <p className="text-xs text-slate-400">
                Ubah parameter input (ADB & Moisture) untuk menghitung secara instan nilai parameter dalam semua basis standar ISO 11722 / ASTM D3180.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCalcGCV_adb(6150);
              setCalcTM(24.5);
              setCalcIM(10.5);
              setCalcAsh_adb(6.8);
              setCalcTS_adb(0.65);
              setCalcVM_adb(41.2);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 cursor-pointer transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default
          </button>
        </div>

        {/* Sliders and Numerical Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-amber-300">GCV (ADB)</span>
              <span className="font-bold text-white font-mono">{calcGCV_adb} kcal</span>
            </div>
            <input
              type="range"
              min="4000"
              max="7200"
              step="50"
              value={calcGCV_adb}
              onChange={(e) => setCalcGCV_adb(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-blue-300">Total Moisture (TM)</span>
              <span className="font-bold text-white font-mono">{calcTM}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.5"
              value={calcTM}
              onChange={(e) => setCalcTM(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-cyan-300">Inherent Moisture (IM)</span>
              <span className="font-bold text-white font-mono">{calcIM}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="25"
              step="0.5"
              value={calcIM}
              onChange={(e) => setCalcIM(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-emerald-300">Ash Content (ADB)</span>
              <span className="font-bold text-white font-mono">{calcAsh_adb}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="0.1"
              value={calcAsh_adb}
              onChange={(e) => setCalcAsh_adb(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-rose-300">Total Sulfur (ADB)</span>
              <span className="font-bold text-white font-mono">{calcTS_adb}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={calcTS_adb}
              onChange={(e) => setCalcTS_adb(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between font-sans">
              <span className="text-[10px] uppercase font-bold text-violet-300">Volatile Matter (ADB)</span>
              <span className="font-bold text-white font-mono">{calcVM_adb}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="0.5"
              value={calcVM_adb}
              onChange={(e) => setCalcVM_adb(Number(e.target.value))}
              className="w-full accent-violet-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Conversion Matrix Table */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-700">
              <tr>
                <th className="p-3.5">Parameter</th>
                <th className="p-3.5 text-right text-amber-400">As Received (ARB)</th>
                <th className="p-3.5 text-right text-emerald-400">Air Dried (ADB)</th>
                <th className="p-3.5 text-right text-blue-400">Dry Basis (DB)</th>
                <th className="p-3.5 text-right text-violet-400">Dry Ash Free (DAF)</th>
                <th className="p-3.5">Standard Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-mono text-[12px]">
              <tr>
                <td className="p-3.5 font-sans font-bold text-white">Calorific Value (GCV / GAR)</td>
                <td className="p-3.5 text-right font-black text-amber-400">{garArb} kcal/kg</td>
                <td className="p-3.5 text-right font-bold text-emerald-400">{calcGCV_adb} kcal/kg</td>
                <td className="p-3.5 text-right text-blue-300">{gcvDb} kcal/kg</td>
                <td className="p-3.5 text-right text-violet-300">{gcvDaf} kcal/kg</td>
                <td className="p-3.5 font-sans text-[10px] text-slate-400">GAR = GCV_adb × [(100-TM)/(100-IM)]</td>
              </tr>
              <tr>
                <td className="p-3.5 font-sans font-bold text-white">Ash Content</td>
                <td className="p-3.5 text-right text-amber-300">{ashArb}%</td>
                <td className="p-3.5 text-right font-bold text-emerald-400">{calcAsh_adb}%</td>
                <td className="p-3.5 text-right text-blue-300">{ashDb}%</td>
                <td className="p-3.5 text-right text-slate-500">-</td>
                <td className="p-3.5 font-sans text-[10px] text-slate-400">Ash_db = Ash_adb × [100/(100-IM)]</td>
              </tr>
              <tr>
                <td className="p-3.5 font-sans font-bold text-white">Total Sulfur (TS)</td>
                <td className="p-3.5 text-right text-amber-300">{tsArb}%</td>
                <td className="p-3.5 text-right font-bold text-emerald-400">{calcTS_adb}%</td>
                <td className="p-3.5 text-right text-blue-300">{tsDb}%</td>
                <td className="p-3.5 text-right text-slate-500">-</td>
                <td className="p-3.5 font-sans text-[10px] text-slate-400">TS_arb = TS_adb × [(100-TM)/(100-IM)]</td>
              </tr>
              <tr>
                <td className="p-3.5 font-sans font-bold text-white">Volatile Matter (VM)</td>
                <td className="p-3.5 text-right text-amber-300">{vmArb}%</td>
                <td className="p-3.5 text-right font-bold text-emerald-400">{calcVM_adb}%</td>
                <td className="p-3.5 text-right text-blue-300">{vmDb}%</td>
                <td className="p-3.5 text-right text-violet-300">{vmDaf}%</td>
                <td className="p-3.5 font-sans text-[10px] text-slate-400">VM_daf = VM_adb × [100/(100-IM-Ash)]</td>
              </tr>
              <tr>
                <td className="p-3.5 font-sans font-bold text-white">Fixed Carbon (FC)</td>
                <td className="p-3.5 text-right text-amber-300">{fcArb}%</td>
                <td className="p-3.5 text-right font-bold text-emerald-400">{fcAdb}%</td>
                <td className="p-3.5 text-right text-blue-300">{fcDb}%</td>
                <td className="p-3.5 text-right text-slate-500">-</td>
                <td className="p-3.5 font-sans text-[10px] text-slate-400">FC = 100 - (IM + Ash + VM)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECONDARY PROXIMATE & PHYSICAL PROPERTIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryParams.map((sec, sIdx) => (
          <div
            key={sIdx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>{sec.name}</span>
              <span className="font-mono">{sec.basis}</span>
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {sec.value}
            </div>
            <p className="text-[10px] text-slate-400 font-sans">{sec.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
