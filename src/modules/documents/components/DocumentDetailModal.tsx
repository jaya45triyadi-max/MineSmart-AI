// MINE SMART AI - Full Document Preview & Inspection Modal
import React, { useState } from "react";
import {
  X,
  Download,
  Printer,
  Calendar,
  User,
  Shield,
  Tag,
  CheckCircle2,
  Clock,
  History,
  FileText,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Award,
} from "lucide-react";
import { DocumentItem } from "../../../types/documentTypes";
import { DocumentCategoryBadge } from "./DocumentCategoryBadge";

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload: (docId: string) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "procedures" | "revisions" | "metadata">("content");
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(document.documentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <DocumentCategoryBadge category={document.category} size="md" />
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                {document.documentNumber}
                <button
                  onClick={handleCopyNumber}
                  className="text-slate-400 hover:text-white transition"
                  title="Salin Nomor Dokumen"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {document.version}
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  document.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : document.status === "UNDER_REVIEW"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {document.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {document.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Dept: <strong className="text-slate-200">{document.department}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Efektif: <strong className="text-slate-200">{document.effectiveDate}</strong>
              </span>
              {document.expiryDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Berlaku s/d: <strong className="text-amber-300">{document.expiryDate}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(document.id)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh {document.fileType} ({document.fileSizeMB} MB)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          {[
            { key: "content", label: "Teks Dokumen & Ringkasan", icon: FileText },
            { key: "procedures", label: "Prosedur / Klausul / Item", icon: CheckCircle2 },
            { key: "revisions", label: "Riwayat Revisi (Version Log)", icon: History },
            { key: "metadata", label: "Metadata & Otoritas", icon: Shield },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`py-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === t.key
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {activeTab === "content" && (
            <div className="space-y-5">
              {/* Executive Summary Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400 tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Ringkasan Eksekutif AI Dokumen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {document.summary}
                </p>
                {document.complianceStandard && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Standar Kepatuhan: <strong className="text-emerald-300">{document.complianceStandard}</strong></span>
                  </div>
                )}
              </div>

              {/* Full Text Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Isi Dokumen Terformat (Document Viewer):</span>
                  <span className="font-mono text-[11px] text-slate-500">Encoding: UTF-8 • Format: {document.fileType}</span>
                </div>
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                  {document.fullTextContent}
                </div>
              </div>

              {/* Tag Cloud */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400">Kata Kunci & Label Terkait:</span>
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map((tg, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-800/90 text-slate-300 rounded-lg text-xs font-medium border border-slate-700"
                    >
                      #{tg}
                    </span>
                  ))}
                  {document.equipmentTags?.map((eq, idx) => (
                    <span
                      key={`eq-${idx}`}
                      className="px-2.5 py-1 bg-amber-500/15 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30"
                    >
                      Unit: {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "procedures" && (
            <div className="space-y-4">
              {document.keyProcedures && document.keyProcedures.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Tahapan Prosedur Kritis (Key Mandatory Procedures)
                  </h4>
                  <div className="space-y-2">
                    {document.keyProcedures.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3 text-xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[11px] border border-amber-500/30">
                          {idx + 1}
                        </span>
                        <p className="text-slate-200 leading-relaxed font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {document.checklistItems && document.checklistItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Daftar Uji Inspeksi & Checklist Item (Inspection Criteria)
                  </h4>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden text-xs">
                    {document.checklistItems.map((chk, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/50">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white">{chk.item}</div>
                          <div className="text-[11px] text-slate-400">Standar Acuan: {chk.standard}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded font-black text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {chk.status || "PASSED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {document.clauses && document.clauses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Pasal & Klausul Penting (Key Legal / Technical Clauses)
                  </h4>
                  <div className="space-y-2.5">
                    {document.clauses.map((cls, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-purple-400">{cls.clauseNumber}</span>
                          <span className="font-bold text-white">{cls.title}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{cls.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!document.keyProcedures && !document.checklistItems && !document.clauses && (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                  Prosedur tertanam langsung di dalam lembar teks dokumen utama. Silakan buka tab "Teks Dokumen & Ringkasan".
                </div>
              )}
            </div>
          )}

          {activeTab === "revisions" && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Riwayat Versi & Audit Perubahan Dokumen
              </h4>
              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                {document.revisionHistory.map((rev, idx) => (
                  <div key={idx} className="relative space-y-1.5 text-xs">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-4 border-slate-950" />
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[11px] border border-amber-500/30">
                        {rev.version}
                      </span>
                      <span className="text-slate-400 font-mono">{rev.date}</span>
                    </div>
                    <div className="font-bold text-white">{rev.changes}</div>
                    <div className="text-slate-400 text-[11px]">
                      Disusun oleh: <strong className="text-slate-300">{rev.author}</strong> • Disetujui oleh: <strong className="text-emerald-400">{rev.approvedBy}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h5 className="font-bold text-amber-400 uppercase text-[11px]">Otoritas & Pengesahan</h5>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Penyusun / Author:</span>
                    <span className="font-bold text-white">{document.author}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Peninjau / Reviewer:</span>
                    <span className="font-bold text-white">{document.reviewer}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Pengesah / Approver:</span>
                    <span className="font-bold text-emerald-400">{document.approvedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tingkat Kerahasiaan:</span>
                    <span className="font-bold text-amber-300">{document.confidentiality}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h5 className="font-bold text-amber-400 uppercase text-[11px]">Informasi File & Lokasi</h5>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Format Dokumen:</span>
                    <span className="font-bold text-white">{document.fileType} ({document.fileSizeMB} MB)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Cakupan Area:</span>
                    <span className="font-bold text-white">{document.locationScope || "Seluruh Site"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Total Unduhan:</span>
                    <span className="font-mono font-bold text-amber-400">{document.downloadCount} kali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Terakhir Diperbarui:</span>
                    <span className="font-mono text-slate-300">{document.updatedAt.slice(0, 10)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Dokumen terverifikasi resmi dalam Sistem Manajemen Keselamatan Pertambangan (SMKP)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
