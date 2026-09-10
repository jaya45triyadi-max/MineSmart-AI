import React from "react";
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";

export const EnvironmentalDocumentsTab: React.FC = () => {
  const documents = [
    {
      id: "doc-1",
      title: "Izin Lingkungan AMDAL Tambang Batubara Pit Alpha",
      category: "PERMIT_AMDAL",
      number: "SK.512/MENLHK/SETJEN/PLA.1/8/2021",
      date: "2021-08-15",
      issuer: "KLHK RI",
      status: "VALID",
    },
    {
      id: "doc-2",
      title: "Izin Pembuangan Air Limbah (IPLC) Outfall Settling Pond",
      category: "PERMIT_IPLC",
      number: "SK-IPLC-2025/ENV-099",
      date: "2025-03-10",
      issuer: "DLH Kab. Tapin",
      status: "EXPIRING_SOON",
    },
    {
      id: "doc-3",
      title: "Izin Operasional Tempat Penyimpanan Sementara (TPS) Limbah B3",
      category: "PERMIT_TPS_B3",
      number: "SK-TPSB3-440/12/2024",
      date: "2024-05-20",
      issuer: "DPM PTSP Tapin",
      status: "VALID",
    },
    {
      id: "doc-4",
      title: "Sertifikat Hasil Uji (COA) Water Discharge Sucofindo Ags 2026",
      category: "LAB_COA",
      number: "SUCO-COA-88912-2026",
      date: "2026-08-12",
      issuer: "PT Sucofindo",
      status: "VALID",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Environmental Document Repository & Legal Archives
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arsip dokumen izin AMDAL, UKL-UPL, SK IPLC, Izin TPS B3, Sertifikat Hasil Uji (COA) Sucofindo & manifes Festronik
          </p>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {doc.category}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">No: {doc.number}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === "VALID"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {doc.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Penerbit: <strong className="text-slate-200">{doc.issuer}</strong></span>
              <span>Tanggal: {doc.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
