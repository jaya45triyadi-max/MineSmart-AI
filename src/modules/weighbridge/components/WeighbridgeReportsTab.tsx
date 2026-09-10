import React from "react";
import { FileSpreadsheet, Download, Printer, FileText, BarChart3 } from "lucide-react";

export const WeighbridgeReportsTab: React.FC = () => {
  const reportsList = [
    { id: "REP-WB-01", name: "Daily Weighbridge Summary Report", format: "PDF / EXCEL", freq: "Harian", desc: "Laporan rekapitulasi tonase harian per jembatan timbang, jenis material, dan shift." },
    { id: "REP-WB-02", name: "Shift Weighbridge Operational Report", format: "PDF / CSV", freq: "Per Shift", desc: "Detail transaksi penimbangan per shift operator dengan timestamp masuk/keluar." },
    { id: "REP-WB-03", name: "Vehicle Weight & Overload Analysis Report", format: "EXCEL", freq: "Mingguan", desc: "Analisis beban muatan truk, frekuensi overload, serta simpangan tare weight." },
    { id: "REP-WB-04", name: "Weighbridge vs Production & Sales Reconciliation Report", format: "PDF / EXCEL", freq: "Bulanan", desc: "Laporan resmi rekonsiliasi tonase timbangan untuk audit ESDM & Finance." },
    { id: "REP-WB-05", name: "Weighbridge Calibration & Downtime Audit Log", format: "PDF", freq: "Triwulan", desc: "Audit sertifikat kalibrasi metrologi dan catatan downtime alat timbang." },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            Pusat Pelaporan Penimbangan (Weighbridge Reports & Export)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekspor laporan resmi penimbangan, rekonsiliasi, dan kepatuhan muatan sesuai standar regulasi tambang.
          </p>
        </div>
      </div>

      {/* Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep) => (
          <div key={rep.id} className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">{rep.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{rep.format}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{rep.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{rep.desc}</p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => alert(`Mengunduh laporan ${rep.name} (PDF)...`)}
                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => alert(`Mengunduh data ${rep.name} (Excel CSV)...`)}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Excel / CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
