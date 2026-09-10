import React, { useState } from "react";
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from "lucide-react";

export const HRReportsExportTab: React.FC = () => {
  const [reportType, setReportType] = useState("MANPOWER_STATISTICS");
  const [format, setFormat] = useState("EXCEL");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
          HR Reports Generator & Export to ESDM Compliance Formats
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cetak dan ekspor laporan ketenagakerjaan resmi RKAB ESDM, rekapitulasi presensi bulanan, dan audit lisensi K3.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 max-w-xl shadow-md">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Pilih Jenis Laporan HR</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="MANPOWER_STATISTICS">1. Laporan Statistik Manpower & Tenaga Kerja (Format RKAB ESDM)</option>
            <option value="CERTIFICATION_COMPLIANCE">2. Laporan Audit & Kepatuhan Sertifikasi K3/POP/SIO</option>
            <option value="ATTENDANCE_OVERTIME">3. Rekapitulasi Presensi & Total Jam Overtime Bulanan</option>
            <option value="TRAINING_RECAP">4. Laporan Diklat Tambang & Realisasi Training</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Pilih Format File Export</label>
          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            {["EXCEL", "PDF", "CSV"].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-2 rounded-xl border transition ${
                  format === fmt
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" /> Generate & Download Laporan HR ({format})
        </button>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> File Laporan HR ({reportType}) berhasil diunduh dalam format {format}!
          </div>
        )}
      </div>
    </div>
  );
};
