import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Mountain,
  Layers,
  Ruler,
  TrendingDown,
  ShieldAlert,
  Droplets,
  Eye,
  Plus,
  Compass,
} from "lucide-react";
import { ErosionMonitoringRecord, ErosionControlStructure } from "../../../types/environmentTypes";

export const ErosionTab: React.FC = () => {
  const [records, setRecords] = useState<ErosionMonitoringRecord[]>([
    {
      id: "ERO-2026-001",
      recordId: "ERO-REC-ALPHA-01",
      locationName: "Pit Alpha West Slope Bench 4",
      slopePercent: 28,
      slopeLengthMeters: 45,
      erosionType: "RILL",
      severity: "LOW",
      estimatedLossTonHaYear: 4.2,
      toleranceLimitTonHaYear: 12.0,
      gullyDepthCm: 8,
      vegetationCoverPercent: 82,
      controlMeasureInPlace: "Hydroseeding Legume Cover Crop + Cocomesh Matting",
      controlStatus: "EFFECTIVE",
      inspectorName: "Hendra Wijaya (Soil Specialist)",
      inspectionDate: "2026-08-11",
      actionRequired: "Pemeliharaan rutin saluran drainase teras bangku",
    },
    {
      id: "ERO-2026-002",
      recordId: "ERO-DISPOSAL-N2",
      locationName: "Waste Dump Disposal North Slope Toe",
      slopePercent: 35,
      slopeLengthMeters: 60,
      erosionType: "GULLY",
      severity: "MODERATE",
      estimatedLossTonHaYear: 8.6,
      toleranceLimitTonHaYear: 12.0,
      gullyDepthCm: 22,
      vegetationCoverPercent: 55,
      controlMeasureInPlace: "Check Dam Batu + Penanaman Rumput Akar Wangi (Vetiver)",
      controlStatus: "NEEDS_MAINTENANCE",
      inspectorName: "Hendra Wijaya (Soil Specialist)",
      inspectionDate: "2026-08-12",
      actionRequired: "Perbaikan riprap batu check dam dan penambahan bibit vetiver",
    },
    {
      id: "ERO-2026-003",
      recordId: "ERO-HAULROAD-KM4",
      locationName: "Haul Road KM 4.5 Cut Slope",
      slopePercent: 40,
      slopeLengthMeters: 30,
      erosionType: "SHEET",
      severity: "LOW",
      estimatedLossTonHaYear: 3.8,
      toleranceLimitTonHaYear: 12.0,
      vegetationCoverPercent: 90,
      controlMeasureInPlace: "Geotextile Non-Woven + Drop Structure Beton Bertangga",
      controlStatus: "EFFECTIVE",
      inspectorName: "Siti Rahmawati (HSE Env Officer)",
      inspectionDate: "2026-08-13",
      actionRequired: "Kondisi stabil, tidak memerlukan perbaikan darurat",
    },
  ]);

  const [structures, setStructures] = useState<ErosionControlStructure[]>([
    {
      id: "STR-01",
      code: "CD-ALPHA-01",
      name: "Check Dam Batu Gabion Kompartemen 1",
      structureType: "CHECK_DAM",
      location: "Pit Alpha Catchment Channel",
      installationDate: "2024-05-10",
      lengthOrArea: "8 Unit Gabion",
      condition: "GOOD",
      lastMaintainedDate: "2026-07-20",
      nextInspectionDue: "2026-08-25",
      sedimentTrappedM3: 145,
      status: "ACTIVE",
    },
    {
      id: "STR-02",
      code: "CM-DISPOSAL-N",
      name: "Cocomesh & Jute Netting Lereng Kritis",
      structureType: "GEOTEXTILE_COCOMESH",
      location: "Disposal North Slope Bench 3",
      installationDate: "2025-02-15",
      lengthOrArea: "3,500 m²",
      condition: "FAIR",
      lastMaintainedDate: "2026-06-10",
      nextInspectionDue: "2026-08-20",
      sedimentTrappedM3: 40,
      status: "MAINTENANCE_REQUIRED",
    },
    {
      id: "STR-03",
      code: "DS-HAULROAD-04",
      name: "Drop Structure Cascade Bertangga Beton",
      structureType: "DROP_STRUCTURE",
      location: "Haul Road KM 4 Saluran Drainase",
      installationDate: "2023-11-01",
      lengthOrArea: "120 Meter",
      condition: "EXCELLENT",
      lastMaintainedDate: "2026-08-01",
      nextInspectionDue: "2026-09-01",
      sedimentTrappedM3: 210,
      status: "ACTIVE",
    },
    {
      id: "STR-04",
      code: "VH-SLOPE-BETA",
      name: "Sabuk Hijau Rumput Akar Wangi (Vetiver)",
      structureType: "VETIVER_HEDGE",
      location: "Lereng Teras Bangku Pit Beta",
      installationDate: "2025-08-20",
      lengthOrArea: "2,400 Rumpun",
      condition: "EXCELLENT",
      lastMaintainedDate: "2026-08-05",
      nextInspectionDue: "2026-08-30",
      sedimentTrappedM3: 85,
      status: "ACTIVE",
    },
  ]);

  const [activeSubTab, setActiveSubTab] = useState<"rusle" | "structures">("rusle");

  const avgErosionLoss = (records.reduce((sum, r) => sum + r.estimatedLossTonHaYear, 0) / records.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white border border-rose-500/30 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" /> PENGENDALIAN EROSI & KONSERVASI TANAH
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Metode RUSLE & Standar KLHK
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Soil Erosion Monitoring & Slope Conservation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Pemantauan erosi lereng tambang menggunakan model <strong>RUSLE (Revised Universal Soil Loss Equation)</strong>, deteksi erosi alur/parit (Rill & Gully), evaluasi <strong>Check Dam, Cocomesh, Drop Structure, dan Vetiver Grass</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
            Rata-rata Erosi: {avgErosionLoss} Ton/Ha/Th (&lt;12 Toleransi)
          </span>
        </div>
      </div>

      {/* Switcher */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: "rusle", label: "Inspeksi Erosi Lapangan & Model RUSLE", icon: Activity },
          { key: "structures", label: "Struktur Pengendali Erosi (Check Dam & Cocomesh)", icon: Layers },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.key;
          return (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(sub.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. RUSLE INSPECTIONS */}
      {activeSubTab === "rusle" && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Estimasi Laju Erosi Aktual</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {avgErosionLoss} <span className="text-xs font-sans">ton/ha/th</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Terkendali Sangat Baik</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Batas Toleransi Erosi (T)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                12.0 <span className="text-xs font-sans">ton/ha/th</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Berdasarkan Solum Tanah</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Rata-rata Tutupan Tanaman</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                75.6%
              </div>
              <span className="text-[10px] text-teal-500 font-sans">Cover Crop & Rumput</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Tingkat Efektivitas Mitigasi</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                93.4%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Sediment Trap Optimal</span>
            </div>
          </div>

          {/* Inspection Records List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              Hasil Pengukuran & Evaluasi Tingkat Erosi Lereng Tambang
            </h3>

            <div className="space-y-4">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        {rec.recordId}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {rec.locationName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Tipe: {rec.erosionType} ({rec.severity})
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {rec.inspectionDate} • {rec.inspectorName}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Kemiringan Lereng</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.slopePercent}% ({rec.slopeLengthMeters}m Panjang)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Laju Erosi (RUSLE)</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{rec.estimatedLossTonHaYear} Ton/Ha/Th</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Kedalaman Gully</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{rec.gullyDepthCm ? `${rec.gullyDepthCm} cm` : "0 cm"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Tutupan Vegetasi</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{rec.vegetationCoverPercent}%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-[11px] leading-relaxed">
                    <strong>Tindakan Terpasang:</strong> {rec.controlMeasureInPlace} • <strong className="text-emerald-600 dark:text-emerald-400">{rec.controlStatus}</strong>
                    {rec.actionRequired && <span className="block mt-0.5 text-slate-600 dark:text-slate-400">Rekomendasi Tindak Lanjut: {rec.actionRequired}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EROSION CONTROL STRUCTURES */}
      {activeSubTab === "structures" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Inventaris Struktur Fisik & Biologis Pengendalian Erosi
            </h3>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {structures.length} Struktur Terpasang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {structures.map((str) => (
              <div
                key={str.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                      {str.code}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {str.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{str.location}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      str.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {str.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dimensi / Luas</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{str.lengthOrArea}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Kondisi Fisik</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{str.condition}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sedimen Tertahan</span>
                    <strong className="text-amber-500 font-mono">{str.sedimentTrappedM3} m³</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Terpasang: {str.installationDate}</span>
                  <span>Inspeksi Berikutnya: <strong className="text-indigo-500">{str.nextInspectionDue}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
