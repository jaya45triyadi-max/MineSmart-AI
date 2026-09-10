// MINE SMART AI - Procurement Reports Tab

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Filter,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { PurchaseRequest, PurchaseOrder, Vendor } from "../../../types/procurementTypes";

interface ProcurementReportsTabProps {
  prs: PurchaseRequest[];
  pos: PurchaseOrder[];
  vendors: Vendor[];
}

export const ProcurementReportsTab: React.FC<ProcurementReportsTabProps> = ({ prs, pos, vendors }) => {
  const [reportType, setReportType] = useState<string>("PO_SUMMARY");

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,PO Number,Vendor,Grand Total,Status,Delivery Date\n";
    pos.forEach((p) => {
      csvContent += `${p.poNumber},"${p.vendorName}",${p.grandTotal},${p.status},${p.deliveryDate}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Procurement_PO_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" /> Executive Procurement Reports & Export
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan berkala pengadaan tambang format standar ESDM, PDF, Excel & CSV
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-600"
          >
            <Printer className="w-4 h-4" /> Cetak / Print PDF
          </button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setReportType("PO_SUMMARY")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            reportType === "PO_SUMMARY"
              ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg"
              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          <FileText className="w-6 h-6 mb-2 text-amber-400" />
          <h3 className="font-bold text-sm text-white">Laporan Summary Purchase Order (PO)</h3>
          <p className="text-xs text-slate-400 mt-1">Rekapitulasi seluruh PO terbit, status delivery DDP site & realisasi nilai</p>
        </div>

        <div
          onClick={() => setReportType("PR_SUMMARY")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            reportType === "PR_SUMMARY"
              ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg"
              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          <FileSpreadsheet className="w-6 h-6 mb-2 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Laporan Requisition & Approval Time</h3>
          <p className="text-xs text-slate-400 mt-1">Analisa SLA kecepatan persetujuan PR per departemen operasional</p>
        </div>

        <div
          onClick={() => setReportType("VENDOR_PERF")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            reportType === "VENDOR_PERF"
              ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg"
              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          <Printer className="w-6 h-6 mb-2 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Laporan Kepatuhan CSMS & Delivery Vendor</h3>
          <p className="text-xs text-slate-400 mt-1">Audit sertifikasi CSMS, rating kualitas barang & ketepatan waktu pengiriman</p>
        </div>
      </div>

      {/* Preview Printable Table */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Preview Data Laporan ({reportType})</h3>
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Delivery Date</th>
                <th className="p-3 text-right">Nilai Grand Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {pos.map((p) => (
                <tr key={p.poId}>
                  <td className="p-3 font-mono font-bold text-amber-400">{p.poNumber}</td>
                  <td className="p-3 font-medium text-white">{p.vendorName}</td>
                  <td className="p-3">{p.deliveryDate}</td>
                  <td className="p-3 text-right font-bold text-amber-300">Rp {p.grandTotal.toLocaleString("id-ID")}</td>
                  <td className="p-3 font-bold text-emerald-400">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
