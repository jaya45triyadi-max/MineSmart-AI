// MINE SMART AI - Document Repository Browser & Filter Tab
import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Building2,
  Clock,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  DocumentItem,
  DocumentCategory,
  DocumentDepartment,
  DocumentStatus,
} from "../../../types/documentTypes";
import { DocumentCategoryBadge } from "./DocumentCategoryBadge";

interface RepositoryBrowserTabProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (docId: string) => void;
  onOpenUploadModal: () => void;
}

export const RepositoryBrowserTab: React.FC<RepositoryBrowserTabProps> = ({
  documents,
  onOpenDocument,
  onDownloadDocument,
  onOpenUploadModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "ALL">("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState<DocumentDepartment | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filtering
  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory !== "ALL" && doc.category !== selectedCategory) return false;
    if (selectedDepartment !== "ALL" && doc.department !== selectedDepartment) return false;
    if (selectedStatus !== "ALL" && doc.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = doc.documentNumber.toLowerCase().includes(q);
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
      const matchEq = doc.equipmentTags?.some((e) => e.toLowerCase().includes(q));
      if (!matchNum && !matchTitle && !matchSummary && !matchTags && !matchEq) {
        return false;
      }
    }
    return true;
  });

  const categories: Array<{ key: DocumentCategory | "ALL"; label: string }> = [
    { key: "ALL", label: "Semua Kategori (9)" },
    { key: "SOP", label: "SOP" },
    { key: "WORK_INSTRUCTION", label: "Work Instruction" },
    { key: "CONTRACT", label: "Contract" },
    { key: "PERMIT", label: "Permit" },
    { key: "DRAWING", label: "Drawing" },
    { key: "REPORT", label: "Report" },
    { key: "CERTIFICATE", label: "Certificate" },
    { key: "INVOICE", label: "Invoice" },
    { key: "INSPECTION", label: "Inspection" },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor dokumen, judul, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick Selectors & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Departemen</option>
              <option value="Mining">Mining</option>
              <option value="Geology & Survey">Geology & Survey</option>
              <option value="Plant Maintenance">Plant Maintenance</option>
              <option value="Processing & Coal">Processing & Coal</option>
              <option value="HSE & Environment">HSE & Environment</option>
              <option value="Commercial & Finance">Commercial & Finance</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"
                }`}
                title="Tampilan Tabel"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"
                }`}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Dokumen</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === c.key
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                  : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-white font-mono">{filteredDocuments.length}</strong> dokumen terdaftar
        </span>
        {selectedCategory !== "ALL" && (
          <button
            onClick={() => setSelectedCategory("ALL")}
            className="text-amber-400 hover:underline font-bold"
          >
            Reset Filter Kategori
          </button>
        )}
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nomor & Kategori</th>
                  <th className="p-3.5">Judul Dokumen</th>
                  <th className="p-3.5">Departemen</th>
                  <th className="p-3.5">Versi</th>
                  <th className="p-3.5">Masa Berlaku</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="font-mono font-bold text-amber-400">{doc.documentNumber}</div>
                        <DocumentCategoryBadge category={doc.category} size="sm" />
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[320px]">
                      <div className="font-bold text-white group-hover:text-amber-300 transition leading-snug">
                        {doc.title}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{doc.summary}</p>
                      {doc.equipmentTags && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded">
                            Unit: {doc.equipmentTags.join(", ")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">{doc.department}</td>
                    <td className="p-3.5">
                      <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {doc.version}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      <div>Eff: {doc.effectiveDate}</div>
                      {doc.expiryDate && <div className="text-amber-400/80">Exp: {doc.expiryDate}</div>}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                          doc.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : doc.status === "UNDER_REVIEW"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onDownloadDocument(doc.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                          title="Unduh File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDocument(doc)}
                          className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition shadow-xl space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <DocumentCategoryBadge category={doc.category} size="sm" />
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      doc.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-amber-400">{doc.documentNumber}</div>

                <h4
                  onClick={() => onOpenDocument(doc)}
                  className="font-black text-white group-hover:text-amber-300 transition text-sm leading-snug cursor-pointer line-clamp-2"
                >
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Dept: <strong className="text-slate-300">{doc.department}</strong></span>
                  <span className="font-mono">{doc.fileType} • {doc.fileSizeMB}MB</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onDownloadDocument(doc.id)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Unduh File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Dokumen</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
