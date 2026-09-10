// MINE SMART AI - RKAB Mining Safety (K3 & Keselamatan Operasi KO) Tab
import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Flame,
  Truck,
  Wrench,
  FileCheck2,
  Award,
} from "lucide-react";
import { MiningSafetyKOAuditMetric } from "../../../types/rkabTypes";

interface MiningSafetyKOTabProps {
  safetyMetrics: MiningSafetyKOAuditMetric[];
}

export const MiningSafetyKOTab: React.FC<MiningSafetyKOTabProps> = ({
  safetyMetrics,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Safety KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Fatality Counter */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Insiden Fatalitas</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              ESDM MANDATORY
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            0 KASUS (ZERO)
          </div>
          <p className="text-[11px] text-slate-400">
            Penerapan Golden Rules & K3 Terpantau 24/7 di Pit dan Hauling Road.
          </p>
        </div>

        {/* 2. Lost Time Injury (LTI) */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Lost Time Injury (LTI)</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              LTIFR: 0.00
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            0 INSIDEN
          </div>
          <p className="text-[11px] text-slate-400">
            Bebas kecelakaan kerja yang menyebabkan kehilangan hari kerja.
          </p>
        </div>

        {/* 3. Safe Working Hours */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Jam Kerja Selamat Kumulatif</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            4.280.500 <span className="text-xs font-normal text-slate-400">Man-hours</span>
          </div>
          <p className="text-[11px] text-blue-300/80">
            Pencapaian keselamatan operasional berkelanjutan sejak tahun 2024.
          </p>
        </div>

        {/* 4. SMKP Internal Audit Score */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Skor Audit Internal SMKP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            92.4% <span className="text-xs font-normal text-slate-400">(Kategori Memuaskan)</span>
          </div>
          <p className="text-[11px] text-amber-400/80">
            Sesuai audit 7 elemen SMKP Minerba Kepmen 1827/2018.
          </p>
        </div>
      </div>

      {/* Safety Audit Breakdown & Keselamatan Operasi (KO) Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SMKP Audit Elements Metric Table */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Matriks Kinerja K3 & Kepatuhan SMKP Minerba
            </h4>
          </div>

          <div className="space-y-3">
            {safetyMetrics.map((metric) => (
              <div key={metric.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white max-w-[280px]">
                    {metric.metricName}
                  </span>
                  <span className="font-mono font-black text-emerald-400">
                    {metric.actualValue} {metric.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target: {metric.targetValue} {metric.unit}</span>
                  <span className="text-emerald-400/90 font-medium">✓ {metric.benchmarkESDM}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keselamatan Operasi (KO) - Kelaikan Alat & Prasarana */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Keselamatan Operasi (KO) & Kelaikan Peralatan Tambang
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              98.2% KELAIKAN
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Sertifikasi Kelaikan SPIP & SILO Alat Angkat / Crane",
                status: "100% Terkalibrasi & Tersertifikasi Disnaker / ESDM",
                icon: Wrench,
                badge: "4 Unit Crane Valid",
              },
              {
                title: "Pemeriksaan Berkala Uji Emisi & P2H Harian Fleet Dump Truck",
                status: "100% Dilakukan inspeksi harian sebelum serah terima shift",
                icon: Truck,
                badge: "58 Unit HD785/777G",
              },
              {
                title: "Gudang Handak & Tangki BBM (Kelaikan Instalasi)",
                status: "Izin P2 Polri aktif, penangkal petir & grounding &lt; 5 Ohm",
                icon: Flame,
                badge: "Izin P2 Aktif",
              },
              {
                title: "Uji Stabilitas Tanggul Disposal & Lereng Pit Geoteknik",
                status: "Faktor Keamanan lereng rata-rata FK 1.42 (Standar &gt; 1.30)",
                icon: ShieldCheck,
                badge: "FK 1.42 Stabil",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.status}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
