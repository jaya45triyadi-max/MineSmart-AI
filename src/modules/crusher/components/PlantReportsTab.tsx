import React from "react";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";
import { PlantReport } from "../../../types/processingPlantTypes";

interface PlantReportsTabProps {
  reports: PlantReport[];
  onGenerateReport: (type: string) => void;
  onExport: (reportCode: string, format: string) => void;
}

export const PlantReportsTab: React.FC<PlantReportsTabProps> = ({
  reports,
  onGenerateReport,
  onExport,
}) => {
  const reportTemplates = [
    { title: "Daily Processing Operational Report", code: "DPR-DAILY", type: "Daily Processing Report" },
    { title: "Shift Processing Production Report", code: "SPR-SHIFT", type: "Shift Processing Report" },
    { title: "Weekly Plant Performance & Yield Summary", code: "WPR-WEEKLY", type: "Weekly Processing Report" },
    { title: "Monthly Crusher Throughput & Downtime", code: "MPR-MONTHLY", type: "Monthly Processing Report" },
    { title: "Crusher Equipment Performance Audit", code: "CPR-EQUIP", type: "Crusher Performance Report" },
    { title: "Product Quality Assay & Lab Compliance Report", code: "PQR-QUALITY", type: "Product Quality Report" },
    { title: "Plant Material Balance & Mass Reconciliation", code: "MBR-RECON", type: "Material Balance Report" },
    { title: "AI Bottleneck & Efficiency Insights", code: "AIR-BOTTLENECK", type: "AI Processing Report" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
            Processing Plant Operational Reports & ESDM Exports
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate and export daily, shift, weekly, monthly, and quality compliance reports (PDF, EXCEL, CSV)
          </p>
        </div>
      </div>

      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTemplates.map((template) => (
          <div
            key={template.code}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {template.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Format: PDF, Excel, CSV
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onGenerateReport(template.type)}
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Recently Generated Processing Reports ({reports.length})
          </h4>
          <span className="text-xs text-slate-400">Permission: processing.export Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Report Code</th>
                <th className="p-3">Report Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Period</th>
                <th className="p-3">Generated Date</th>
                <th className="p-3">Format</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {r.reportCode}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {r.title}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {r.type}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {r.period}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {new Date(r.generatedAt).toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                    {r.format}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onExport(r.reportCode, "PDF")}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <button
                        onClick={() => onExport(r.reportCode, "EXCEL")}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Excel
                      </button>
                      <button
                        onClick={() => onExport(r.reportCode, "CSV")}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> CSV
                      </button>
                    </div>
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
