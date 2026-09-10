// MINE SMART AI - Expiring Permits, Legal & Compliance Audit Tab
import React from "react";
import {
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Award,
  Briefcase,
  ExternalLink,
  BellRing,
  Eye,
  Download,
  ShieldCheck,
} from "lucide-react";
import { DocumentItem } from "../../../types/documentTypes";
import { DocumentCategoryBadge } from "./DocumentCategoryBadge";

interface ExpiringPermitsAuditTabProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (docId: string) => void;
}

export const ExpiringPermitsAuditTab: React.FC<ExpiringPermitsAuditTabProps> = ({
  documents,
  onOpenDocument,
  onDownloadDocument,
}) => {
  // Filter documents with expiryDate
  const expiringDocs = documents
    .filter((d) => Boolean(d.expiryDate))
    .sort((a, b) => (a.expiryDate || "").localeCompare(b.expiryDate || ""));

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Monitoring Masa Berlaku Izin, Sertifikat & Kontrak</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded border border-amber-500/30">
                  SMKP COMPLIANCE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Peringatan Dini Kadaluarsa Izin Operasional (IPPKH, RKAB, P2 Handak, Kalibrasi Timbangan & Kontrak Vendor)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Izin & Kontrak Terdaftar</div>
          <div className="text-2xl font-black text-white">{expiringDocs.length} Dokumen</div>
          <span className="text-[10px] text-slate-500">Mencakup IPPKH, RKAB, Sertifikat Tera & Vendor Contract</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Status Kepatuhan Hukum</div>
          <div className="text-2xl font-black text-emerald-400">100% Valid</div>
          <span className="text-[10px] text-emerald-400/80">Seluruh izin operasi tambang dalam status ACTIVE</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Renewal Window (2026-2027)</div>
          <div className="text-2xl font-black text-amber-400">3 Dokumen</div>
          <span className="text-[10px] text-amber-400/80">Jadwal perpanjangan berkala RKAB 2027 & Tera Metrologi</span>
        </div>
      </div>

      {/* Tracked Documents Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Daftar Dokumen Kepatuhan Terjadwal
          </h4>
          <span className="text-xs text-slate-500 font-mono">Urutan Berdasarkan Tanggal Kadaluarsa</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Dokumen & Nomor</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Penerbit / Instansi</th>
                <th className="p-3.5">Masa Berlaku (Expiry Date)</th>
                <th className="p-3.5">Status Kepatuhan</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {expiringDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 max-w-[280px]">
                    <div className="font-bold text-white leading-snug">{doc.title}</div>
                    <div className="font-mono text-amber-400 text-[11px] mt-0.5">{doc.documentNumber}</div>
                  </td>
                  <td className="p-3.5">
                    <DocumentCategoryBadge category={doc.category} size="sm" />
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{doc.author}</td>
                  <td className="p-3.5 font-mono text-amber-300 font-bold">
                    {doc.expiryDate}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LEGAL & ACTIVE
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDownloadDocument(doc.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Unduh"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
