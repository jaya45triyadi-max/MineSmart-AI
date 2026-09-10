import React from "react";
import { FileText, Download, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { EmployeeDocument } from "../../../types/hrTypes";

interface Props {
  documents: EmployeeDocument[];
}

export const HRDocumentsTab: React.FC<Props> = ({ documents }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          Employee Documents Repository & Digital Archives
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Penyimpanan terpusat dokumen resmi karyawan (Kontrak Kerja, KTP/SIM B2, SIO Alat Berat, SK KTT ESDM, dan Sertifikat Medis).
        </p>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Dokumen</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Tipe Berkas Dokumen</th>
                <th className="px-4 py-3">No Dokumen & Penerbit</th>
                <th className="px-4 py-3">Tgl Terbit / Expired</th>
                <th className="px-4 py-3">Status Verifikasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{doc.documentId}</td>
                  <td className="px-4 py-3 font-bold text-white">{doc.employeeName}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-400">{doc.documentType}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="block font-medium">{doc.documentNumber}</span>
                    <span className="text-[10px] text-slate-400">{doc.issuer}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {doc.issueDate} / <strong className="text-amber-400">{doc.expiryDate || "N/A"}</strong>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[10px]">
                      Download Berkas
                    </button>
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
