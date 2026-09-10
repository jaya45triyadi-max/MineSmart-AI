// MINE SMART AI - Comprehensive Finance Reports Suite & Export Tab
import React, { useState } from "react";
import { FileText, Download, Printer, Share2, CheckCircle2 } from "lucide-react";
import { FinanceKPISummary } from "../../../types/financeTypes";

interface FinanceReportsTabProps {
  kpi: FinanceKPISummary;
}

export const FinanceReportsTab: React.FC<FinanceReportsTabProps> = ({ kpi }) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const reportsList = [
    { title: "Laporan Laba Rugi Operasional (P&L)", category: "Profitability", desc: "Laporan konsolidasi pendapatan, COGS, OPEX & EBITDA" },
    { title: "Laporan Penjualan & Pengakuan Revenue", category: "Revenue", desc: "Rincian penjualan batubara per pelanggan, vessel & kontrat" },
    { title: "Laporan Umur Piutang (AR Aging Report)", category: "Working Capital", desc: "Matriks aging piutang usaha 1-30, 31-60, 61-90, >180 hari" },
    { title: "Laporan Hutang Usaha (AP 3-Way Match Report)", category: "Working Capital", desc: "Daftar hutang vendor, status matching PO, GR & invoice" },
    { title: "Laporan Anggaran vs Realisasi (Budget Variance)", category: "Cost Control", desc: "Analisis varians pagu budget vs actual per cost center" },
    { title: "Laporan Unit Cost / Ton & Cost / BCM", category: "Cost Analytics", desc: "Rincian biaya penambangan per ton batubara & BCM overburden" },
    { title: "Laporan Laporan Arus Kas (Cash Flow Statement)", category: "Liquidity", desc: "Arus kas dari aktivitas operasional, investasi CAPEX & pendanaan" },
    { title: "Laporan Investasi & Depresiasi Fixed Asset", category: "CAPEX & Asset", desc: "Register aset tetap, nilai perolehan, depresiasi & book value" },
  ];

  const handleExport = (title: string, format: string) => {
    setDownloadNotice(`Laporan "${title}" berhasil diexport dalam format ${format}.`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadNotice && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((r, idx) => (
          <div key={idx} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {r.category}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExport(r.title, "PDF")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3 text-red-400" /> PDF
                </button>
                <button
                  onClick={() => handleExport(r.title, "Excel")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3 text-emerald-400" /> Excel
                </button>
                <button
                  onClick={() => handleExport(r.title, "CSV")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3 text-cyan-400" /> CSV
                </button>
              </div>
            </div>

            <div className="text-sm font-bold text-white">{r.title}</div>
            <p className="text-xs text-slate-400">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
