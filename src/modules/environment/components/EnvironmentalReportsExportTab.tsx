import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  FileText,
  Building2,
} from "lucide-react";

export const EnvironmentalReportsExportTab: React.FC = () => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      alert(`Laporan Lingkungan Tambang berhasil diunduh dalam format ${format.toUpperCase()}!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Automated Environmental Reports & ESDM / DLH Export
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pembuatan laporan otomatis pengelolaan lingkungan tambang: Laporan Bulanan ESDM, UKL-UPL, IPLC, & AMDAL
          </p>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Laporan Triwulanan Rencana & Realisasi Lingkungan (RKAB / ESDM)
              </h3>
              <p className="text-[11px] text-slate-400">Format Resmi ESDM Form 04.B</p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Mencakup data pemantauan air limbah, baku mutu udara ambien, pengelolaan limbah B3 & rehabilitasi lahan.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleExport("PDF")}
              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5 inline mr-1" /> PDF Export
            </button>
            <button
              onClick={() => handleExport("Excel")}
              className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition border border-slate-700"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 inline mr-1" /> Excel
            </button>
          </div>
        </div>

        {/* Report 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Laporan Kepatuhan IPLC & Baku Mutu Air Limbah DLH
              </h3>
              <p className="text-[11px] text-slate-400">Format Resmi DLH Kabupaten Tapin</p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Ringkasan harian/bulanan debit pembuangan air settling pond, pH, TSS, Fe, Mn & sertifikat analisis Sucofindo.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleExport("PDF")}
              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5 inline mr-1" /> PDF Export
            </button>
            <button
              onClick={() => handleExport("Excel")}
              className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition border border-slate-700"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 inline mr-1" /> Excel
            </button>
          </div>
        </div>

        {/* Report 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Laporan Neraca & Manifes Limbah B3 Festronik (KLHK)
              </h3>
              <p className="text-[11px] text-slate-400">Format Resmi SIMPEL MoLHK</p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Laporan neraca limbah B3 (oli bekas, filter bekas), kapasitas simpan TPS B3 & nomor manifes pengangkutan.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleExport("PDF")}
              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5 inline mr-1" /> PDF Export
            </button>
            <button
              onClick={() => handleExport("Excel")}
              className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition border border-slate-700"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 inline mr-1" /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
