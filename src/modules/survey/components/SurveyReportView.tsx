// MINE SMART AI - Survey Reports & Export Center

import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { SurveyDocument } from "../../../types/surveyTypes";
import { SurveyAIService } from "../../../services/survey/SurveyAIService";

interface SurveyReportViewProps {
  documents: SurveyDocument[];
}

export const SurveyReportView: React.FC<SurveyReportViewProps> = ({ documents }) => {
  const [reportText, setReportText] = useState<string>(
    SurveyAIService.generateSurveyExecutiveReport("PT MINING SMART SANGATTA SITE")
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            Survey Reports, Field Notes & Export Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Penyusunan laporan resmi ukur tambang, sertifikat instrumen, file CAD, dan dokumen pertanggungjawaban progresif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-900/30"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Formatted Printable Report */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span>Draf Laporan Eksekutif Survei & Spasial Tambang</span>
            <span className="text-xs text-emerald-400 font-mono">Format Terverifikasi</span>
          </h3>

          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="w-full h-[450px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-sky-500 leading-relaxed"
          ></textarea>
        </div>

        {/* Right Column: Repository Documents & Attachments */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Dokumen & Sertifikat Terlampir ({documents.length})
            </h3>

            <div className="space-y-3 text-xs">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{doc.title}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{doc.type} • {doc.fileSizeMb} MB</span>
                    <span>{doc.createdAt.split("T")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
