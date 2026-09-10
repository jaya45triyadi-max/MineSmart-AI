import React, { useState } from "react";
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle2 } from "lucide-react";

export const HSEReportsExportTab: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: string, reportName: string) => {
    setDownloadSuccess(`Laporan "${reportName}" berhasil di-export dalam format ${format.toUpperCase()}.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const reports = [
    { title: "Laporan K3LH Bulanan (Monthly HSE Performance Report)", desc: "Statistik TRIFR, LTIFR, Insiden, Inspeksi, dan Kepatuhan CAPA", code: "REP-HSE-M" },
    { title: "Laporan Kejadian & Investigasi Insiden (Incident Log)", desc: "Daftar seluruh laporan insiden, kecelakaan, dan near miss", code: "REP-INC-LOG" },
    { title: "Register Bahaya & Matriks Risiko (Hazard Register)", desc: "Register potensi bahaya aktif dan mitigasi hirarki pengendalian", code: "REP-HAZ-REG" },
    { title: "Kepatuhan Izin Kerja Khusus (PTW Compliance Report)", desc: "Status persetujuan dan aktifasi Permit to Work seluruh site", code: "REP-PTW-CMP" },
    { title: "Laporan Evaluasi K3 Kontraktor (Contractor HSE)", desc: "Rating performa dan rasio keselamatan perusahaan jasa pertambangan", code: "REP-CONT-HSE" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Laporan K3LH & Export Data Sistem (HSE Reporting)
          </h2>
          <p className="text-xs text-slate-400">Generate laporan berkala K3LH dan export dokumen PDF, Excel, & CSV</p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {downloadSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div key={rep.code} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {rep.code}
              </span>
              <h3 className="font-bold text-white text-sm mt-1">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{rep.desc}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleExport("pdf", rep.title)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExport("excel", rep.title)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button
                onClick={() => handleExport("csv", rep.title)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <FileCode className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
