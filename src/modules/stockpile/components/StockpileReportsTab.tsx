import React, { useState } from "react";
import { FileSpreadsheet, Download, FileText, CheckCircle2, Search, Filter } from "lucide-react";
import { StockpileReport } from "../../../types/stockpileTypes";

interface StockpileReportsTabProps {
  reports: StockpileReport[];
  onGenerateReport: (report: StockpileReport) => void;
}

export const StockpileReportsTab: React.FC<StockpileReportsTabProps> = ({
  reports,
  onGenerateReport,
}) => {
  const [reportType, setReportType] = useState("Daily Stockpile Report");
  const [format, setFormat] = useState<"PDF" | "EXCEL" | "CSV">("PDF");
  const [isExporting, setIsExporting] = useState(false);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);

    setTimeout(() => {
      const newRep: StockpileReport = {
        id: `SR-${Date.now()}`,
        reportId: `SR-${Date.now()}`,
        companyId: "COMP-01",
        siteId: "SITE-BBNU-01",
        reportCode: `REP-${reportType.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        title: `${reportType} (${new Date().toLocaleDateString("id-ID")})`,
        type: reportType,
        period: new Date().toISOString().split("T")[0],
        generatedAt: new Date().toISOString(),
        format: format,
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onGenerateReport(newRep);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-amber-500" />
            Automated Stockpile Reports & Export Desk
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generator laporan resmi neraca persediaan batubara, audit kualitas lab, rekonsiliasi survei drone DTM, dan analisis rehandling.
          </p>
        </div>
      </div>

      {/* Report Generator Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Generate & Export Report</h4>

        <form onSubmit={handleCreateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Jenis Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="Daily Stockpile Report">Daily Stockpile Inventory Report</option>
              <option value="Stock Movement Log">Stock Movement & Transfer Log</option>
              <option value="Mass Balance Reconciliation">Mass Balance Survey Reconciliation</option>
              <option value="Coal Quality & Assay Audit">Coal Quality & Assay Audit Report</option>
              <option value="Blending Ratio Summary">Coal Blending Ratio Summary</option>
              <option value="Rehandling Cost & Fuel">Rehandling Cost & Fuel Efficiency Report</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Format Output</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="PDF">PDF (Format Resmi Direksi / ESDM)</option>
              <option value="EXCEL">EXCEL (.xlsx - Data Matriks Kompleks)</option>
              <option value="CSV">CSV (.csv - Integrasi SAP ERP)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isExporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Memproses Laporan..." : "Download & Generate"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Reports Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Riwayat Laporan Yang Telah Diterbitkan ({reports.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3.5 font-bold">Kode Laporan</th>
                <th className="p-3.5 font-bold">Judul & Tipe Laporan</th>
                <th className="p-3.5 font-bold">Periode</th>
                <th className="p-3.5 font-bold">Format</th>
                <th className="p-3.5 font-bold">Waktu Diterbitkan</th>
                <th className="p-3.5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{rep.reportCode}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{rep.title}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{rep.period}</td>
                  <td className="p-3.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {rep.format}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{new Date(rep.generatedAt).toLocaleString("id-ID")}</td>
                  <td className="p-3.5 text-center">
                    <button className="flex items-center gap-1 mx-auto rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-600 hover:bg-amber-500 hover:text-slate-950 transition-all">
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh File</span>
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
