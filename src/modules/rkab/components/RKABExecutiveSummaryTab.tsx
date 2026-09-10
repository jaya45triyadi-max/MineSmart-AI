// MINE SMART AI - RKAB Executive Summary Tab
import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  Trees,
  Users,
  Coins,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Scale,
  Building2,
  ArrowUpRight,
  Sparkles,
  Info,
} from "lucide-react";
import { MinerbaOneBridgePayload } from "../../../types/rkabTypes";

interface RKABExecutiveSummaryTabProps {
  payload: MinerbaOneBridgePayload | null;
  onNavigateTab: (tab: string) => void;
}

export const RKABExecutiveSummaryTab: React.FC<RKABExecutiveSummaryTabProps> = ({
  payload,
  onNavigateTab,
}) => {
  if (!payload) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        Memuat ringkasan eksekutif RKAB...
      </div>
    );
  }

  const { productionSummary, reclamationSummary, safetySummary, manpowerSummary, preValidationErrors } = payload;
  const hasErrors = preValidationErrors.some((e) => e.severity === "ERROR");
  const hasWarnings = preValidationErrors.some((e) => e.severity === "WARNING");

  return (
    <div className="space-y-6">
      {/* Official Positioning & MinerbaOne Compliance Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-blue-500/10 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-xl font-black shrink-0 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Sistem Internal Pendukung Kepatuhan RKAB Minerba
                </h3>
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-black rounded-lg border border-blue-500/30">
                  MINERBAONE READY
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/30">
                  SK ESDM: {payload.rkabApprovalSK}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Membantu pengendalian 8 aspek kepatuhan pertambangan (Target Produksi, Rencana Kerja, Investasi, Operasional, Reklamasi, Tenaga Kerja, K3, Pelaporan) sebelum sinkronisasi resmi ke portal MinerbaOne ESDM.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("minerbaone")}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Validasi MinerbaOne Bridge</span>
          </button>
        </div>

        {/* Pre-Validation Alert Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status Validasi Pra-Submit:</span>
            {hasErrors ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Ditemukan Deviasi Kritis
              </span>
            ) : hasWarnings ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Peringatan Kepatuhan (Sertifikasi/Revisi)
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Memenuhi Kriteria ESDM
              </span>
            )}
          </div>
          <div className="text-slate-400 text-[11px]">
            Perusahaan: <strong className="text-white">{payload.companyProfile.companyName}</strong> | IUP: <span className="font-mono text-amber-400">{payload.companyProfile.iupNumber}</span>
          </div>
        </div>
      </div>

      {/* 4 Core Master Pillar KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Target Produksi Batubara */}
        <div
          onClick={() => onNavigateTab("production")}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition cursor-pointer shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {productionSummary.achievementPercent}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Target vs Realisasi Batubara</div>
            <div className="text-xl font-black text-white mt-1">
              {(productionSummary.realizedCoalMT / 1e6).toFixed(2)} / {(productionSummary.targetCoalMT / 1e6).toFixed(2)} <span className="text-xs font-normal text-slate-400">Juta MT</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(productionSummary.achievementPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>DMO: <strong className="text-amber-400">{productionSummary.dmoPercent}%</strong> (Min. 25%)</span>
            <span className="text-amber-400 flex items-center gap-0.5 group-hover:translate-x-1 transition">
              Detail <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 2. Reklamasi & Lingkungan */}
        <div
          onClick={() => onNavigateTab("reclamation")}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Trees className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              JAMREK 100%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Penataan Lahan & Revegetasi</div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {reclamationSummary.reclamationHa} <span className="text-xs font-normal text-slate-400">Ha / 35 Ha</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min((reclamationSummary.reclamationHa / 35) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Garansi Jamrek: <strong className="text-slate-200">Rp 48.5 M</strong></span>
            <span className="text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-1 transition">
              Detail <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Keselamatan Pertambangan (K3 & SMKP) */}
        <div
          onClick={() => onNavigateTab("safety")}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition cursor-pointer shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              SMKP {safetySummary.smkpAuditScore}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">K3 & Keselamatan Operasi</div>
            <div className="text-xl font-black text-white mt-1">
              ZERO FATALITY <span className="text-xs font-normal text-emerald-400 font-bold">(0 LTI)</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${safetySummary.smkpAuditScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Safe Hours: <strong className="text-slate-200">4.28 Juta Jam</strong></span>
            <span className="text-blue-400 flex items-center gap-0.5 group-hover:translate-x-1 transition">
              Detail <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 4. Tenaga Kerja & Sertifikasi */}
        <div
          onClick={() => onNavigateTab("manpower")}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition cursor-pointer shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              {manpowerSummary.localWorkerPercent}% LOKAL
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Tenaga Kerja & Kompetensi</div>
            <div className="text-xl font-black text-white mt-1">
              {manpowerSummary.totalEmployees} <span className="text-xs font-normal text-slate-400">Karyawan</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${manpowerSummary.localWorkerPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>KTT, POP, POM, POU: <strong className="text-purple-300">{manpowerSummary.certifiedKTTPOPCount} Certified</strong></span>
            <span className="text-purple-400 flex items-center gap-0.5 group-hover:translate-x-1 transition">
              Detail <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 8 Aspek Kepatuhan Overview Grid */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Status 8 Aspek Kepatuhan RKAB Minerba (Tahun Berjalan {payload.year})
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">Regulasi: Kepmen ESDM 1827/2018 & Permen ESDM No 10/2023</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "1. Target Produksi",
              desc: "Realisasi 1.98 Juta Ton (56.8% Target 3.5 Juta MT). DMO 25.5% (Tercapai).",
              status: "COMPLIANT",
              tab: "production",
            },
            {
              title: "2. Rencana Kerja",
              desc: "7 Matriks kegiatan eksplorasi, penambangan, infrastruktur, & pengolahan berjalan on-track.",
              status: "COMPLIANT",
              tab: "workplan",
            },
            {
              title: "3. Rencana Investasi",
              desc: "Capex alat berat & infrastruktur port $9.3M, Opex penambangan & K3/Lingkungan $25.5M.",
              status: "COMPLIANT",
              tab: "budget",
            },
            {
              title: "4. Kegiatan Operasional",
              desc: "Stripping ratio 6.00 BCM/Ton, utilisasi armada 88.5%, kelaikan operasi SPIP 98.2%.",
              status: "COMPLIANT",
              tab: "production",
            },
            {
              title: "5. Reklamasi & Pascatambang",
              desc: "Realisasi penataan 29.5 Ha, 24.500 pohon ditanam, Bank Garansi Jamrek Rp 48.5 M terdeposit.",
              status: "COMPLIANT",
              tab: "reclamation",
            },
            {
              title: "6. Tenaga Kerja",
              desc: "Rasio tenaga kerja lokal 75.2% (Melebihi target 70%), sertifikasi KTT/POP/POM valid.",
              status: "WARNING",
              tab: "manpower",
            },
            {
              title: "7. Keselamatan (K3 & KO)",
              desc: "Zero Fatality, 0 LTI, skor audit internal SMKP 92.4% kategori Memuaskan.",
              status: "COMPLIANT",
              tab: "safety",
            },
            {
              title: "8. Pelaporan & MinerbaOne",
              desc: "Format Matriks 1-18 siap ekspor, pra-validasi SIMBARA & MinerbaOne aktif.",
              status: "COMPLIANT",
              tab: "minerbaone",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateTab(item.tab)}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs text-white group-hover:text-amber-400 transition">
                    {item.title}
                  </span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded ${
                      item.status === "COMPLIANT"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center justify-end text-[11px] text-amber-400 font-bold pt-2 border-t border-slate-800/60">
                <span>Buka Matriks &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
