import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  FileCode,
} from "lucide-react";
import { ReclamationDocument } from "../../../types/reclamationTypes";

interface Props {
  documents: ReclamationDocument[];
}

export const ReclamationDocumentsTab: React.FC<Props> = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          Reclamation Document & Evidence Repository
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Arsip terpusat dokumen resmi Rencana Reklamasi ESDM, peta DTM Survey, foto udara drone, dan sertifikat kepatuhan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari Judul Dokumen atau Nomor Surat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400">{doc.documentNumber}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {doc.category}
                </span>
              </div>

              <h3 className="font-bold text-white text-xs leading-snug">{doc.title}</h3>
              <p className="text-[11px] text-slate-400">Penerbit: {doc.issuer}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{doc.fileSize} • {doc.uploadDate}</span>
              <button className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                <Download className="h-3.5 w-3.5" /> Unduh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
