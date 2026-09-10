// MINE SMART AI - Document Categories Visual Overview Tab
import React from "react";
import {
  BookOpen,
  FileText,
  Briefcase,
  FileCheck2,
  Image,
  FileSpreadsheet,
  Award,
  Receipt,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DocumentItem, DocumentCategory } from "../../../types/documentTypes";

interface DocumentCategoriesOverviewTabProps {
  documents: DocumentItem[];
  onSelectCategory: (cat: DocumentCategory) => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const DocumentCategoriesOverviewTab: React.FC<DocumentCategoriesOverviewTabProps> = ({
  documents,
  onSelectCategory,
  onOpenDocument,
}) => {
  const categoryConfigs: Array<{
    category: DocumentCategory;
    title: string;
    description: string;
    icon: any;
    color: string;
    border: string;
    badgeColor: string;
    sampleDocCode: string;
  }> = [
    {
      category: "SOP",
      title: "Standard Operating Procedure (SOP)",
      description: "Prosedur baku operasional tambang, pemeliharaan berkala excavator/fleet, peledakan, hauling & K3 Golden Rules.",
      icon: BookOpen,
      color: "text-blue-400 bg-blue-500/10",
      border: "border-blue-500/30 hover:border-blue-500/60",
      badgeColor: "bg-blue-500/20 text-blue-300",
      sampleDocCode: "SOP-MNT-EX-001",
    },
    {
      category: "WORK_INSTRUCTION",
      title: "Work Instruction (WI / Petunjuk Kerja)",
      description: "Petunjuk teknis mendalam langkah demi langkah teknisi: penggantian filter hidrolik, penggantian ban OTR, uji gas beracun.",
      icon: FileText,
      color: "text-cyan-400 bg-cyan-500/10",
      border: "border-cyan-500/30 hover:border-cyan-500/60",
      badgeColor: "bg-cyan-500/20 text-cyan-300",
      sampleDocCode: "WI-PLT-HYD-014",
    },
    {
      category: "CONTRACT",
      title: "Contract & Agreement",
      description: "Perjanjian suplai solar B35 Pertamina, Master Service Agreement kontraktor penambangan PT SIS, dan Sales Agreement batubara.",
      icon: Briefcase,
      color: "text-purple-400 bg-purple-500/10",
      border: "border-purple-500/30 hover:border-purple-500/60",
      badgeColor: "bg-purple-500/20 text-purple-300",
      sampleDocCode: "CTR-COM-2026-089",
    },
    {
      category: "PERMIT",
      title: "Permit & Government Approvals",
      description: "Izin Pinjam Pakai Kawasan Hutan (IPPKH), Persetujuan RKAB Tahunan Ditjen Minerba ESDM, Izin Handak P2 Polri, dan AMDAL.",
      icon: FileCheck2,
      color: "text-emerald-400 bg-emerald-500/10",
      border: "border-emerald-500/30 hover:border-emerald-500/60",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
      sampleDocCode: "PMT-KLHK-2024-IPPKH",
    },
    {
      category: "DRAWING",
      title: "Drawing & Engineering CAD",
      description: "Gambar desain tambang Pit 1 South RL -50, penampang geologi batubara Seam A1/A2, kolam sedimen, dan single line diagram.",
      icon: Image,
      color: "text-amber-400 bg-amber-500/10",
      border: "border-amber-500/30 hover:border-amber-500/60",
      badgeColor: "bg-amber-500/20 text-amber-300",
      sampleDocCode: "DWG-ENG-PIT1-S-09",
    },
    {
      category: "REPORT",
      title: "Technical & Compliance Report",
      description: "Laporan studi geoteknik kestabilan lereng (FK), laporan pemantauan lingkungan RKL-RPL air limbah, dan evaluasi getaran peledakan.",
      icon: FileSpreadsheet,
      color: "text-indigo-400 bg-indigo-500/10",
      border: "border-indigo-500/30 hover:border-indigo-500/60",
      badgeColor: "bg-indigo-500/20 text-indigo-300",
      sampleDocCode: "REP-GEO-SLOPE-104",
    },
    {
      category: "CERTIFICATE",
      title: "Certificate & Licenses",
      description: "Sertifikat Pengawas Operasional Pertama (POP) Minerba KTT, Kalibrasi Tera Metrologi jembatan timbang 100 Ton, dan SILO Crane.",
      icon: Award,
      color: "text-teal-400 bg-teal-500/10",
      border: "border-teal-500/30 hover:border-teal-500/60",
      badgeColor: "bg-teal-500/20 text-teal-300",
      sampleDocCode: "CRT-MET-WEIGH-2026",
    },
    {
      category: "INVOICE",
      title: "Invoice & Commercial Billing",
      description: "Faktur tagihan pengadaan darurat silinder hidrolik United Tractors, tagihan solar BBM Pertamina, dan invoice laboratorium batubara.",
      icon: Receipt,
      color: "text-rose-400 bg-rose-500/10",
      border: "border-rose-500/30 hover:border-rose-500/60",
      badgeColor: "bg-rose-500/20 text-rose-300",
      sampleDocCode: "INV-UT-2026-9041",
    },
    {
      category: "INSPECTION",
      title: "Inspection Checklist & Safety Audit",
      description: "Laporan inspeksi tanggul settling pond sedimen, daily P2H pre-use checklist excavator PC1250 EX-204, dan audit tanggul jalan tambang.",
      icon: ClipboardCheck,
      color: "text-orange-400 bg-orange-500/10",
      border: "border-orange-500/30 hover:border-orange-500/60",
      badgeColor: "bg-orange-500/20 text-orange-300",
      sampleDocCode: "INS-HSE-SED-023",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">9 Pilar Klasifikasi Dokumen Tambang Terintegrasi</h3>
            <p className="text-xs text-slate-400">
              Pengelolaan Repositori Terpusat Sesuai Standar SMKP Minerba & Kepmen ESDM 1827/2018
            </p>
          </div>
        </div>
      </div>

      {/* 9 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryConfigs.map((cfg) => {
          const Icon = cfg.icon;
          const matchingDocs = documents.filter((d) => d.category === cfg.category);
          const activeDocsCount = matchingDocs.filter((d) => d.status === "ACTIVE").length;

          return (
            <div
              key={cfg.category}
              className={`bg-slate-900/90 p-5 rounded-2xl border ${cfg.border} shadow-xl transition flex flex-col justify-between space-y-4 group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${cfg.color} border border-white/5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${cfg.badgeColor}`}>
                    {matchingDocs.length} Dokumen
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition">
                    {cfg.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {cfg.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status Kepatuhan:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {activeDocsCount}/{matchingDocs.length} Aktif
                  </span>
                </div>

                {matchingDocs.length > 0 && (
                  <div
                    onClick={() => onOpenDocument(matchingDocs[0])}
                    className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate max-w-[200px] font-mono font-bold text-amber-400">
                      {matchingDocs[0].documentNumber}
                    </span>
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      Preview <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}

                <button
                  onClick={() => onSelectCategory(cfg.category)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buka Koleksi {cfg.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
