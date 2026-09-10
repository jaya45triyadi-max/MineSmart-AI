import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";

export const ReclamationReportsExportTab: React.FC = () => {
  const [reportType, setReportType] = useState("ESDM_FORM_04C");
  const [period, setPeriod] = useState("2026-Q3");
  const [isExporting, setIsExporting] = useState(false);
  const [exportedMsg, setExportedMsg] = useState("");

  const handleExport = (format: string) => {
    setIsExporting(true);
    setExportedMsg("");

    setTimeout(() => {
      setIsExporting(false);
      setExportedMsg(`Laporan [${reportType}] format ${format} berhasil di-export dan diunduh.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
          Reclamation Reports & Official Regulatory Exports
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Generator laporan otomatis pelaksanaan reklamasi format ESDM (Form 04.C), Laporan Revegetasi Triwulanan, dan Rekapitulasi Biaya.
        </p>
      </div>

      {/* Export Options Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Pilih Jenis Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ESDM_FORM_04C">Laporan RKAB ESDM Form 04.C (Kemajuan Reklamasi)</option>
              <option value="REVEGETATION_SURVIVAL">Laporan Pemantauan Keberhasilan Revegetasi & Survival Rate</option>
              <option value="DISTURBED_AREA_INVENTORY">Laporan Inventarisasi Lahan Terganggu & Kesiapan Area</option>
              <option value="RECLAMATION_COST_HA">Laporan Biaya Operasional Reklamasi Per Hektare</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Periode Laporan</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="2026-Q3">Triwulan III Tahun 2026 (Juli - September)</option>
              <option value="2026-Q2">Triwulan II Tahun 2026 (April - Juni)</option>
              <option value="2026-ANNUAL">Laporan Tahunan Reklamasi 2026</option>
            </select>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport("PDF")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition shadow-md shadow-rose-500/10"
          >
            <Download className="h-4 w-4" /> Download Laporan PDF
          </button>

          <button
            onClick={() => handleExport("EXCEL")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/10"
          >
            <FileSpreadsheet className="h-4 w-4" /> Download Format Excel (.xlsx)
          </button>

          <button
            onClick={() => handleExport("CSV")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            <Download className="h-4 w-4" /> Export Raw CSV
          </button>
        </div>

        {exportedMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {exportedMsg}
          </div>
        )}
      </div>
    </div>
  );
};
