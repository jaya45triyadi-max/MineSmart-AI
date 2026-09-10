import React, { useState } from "react";
import {
  FileCheck2,
  Printer,
  QrCode,
  ShieldCheck,
  Building,
  CheckCircle2,
  Download,
  Plus,
} from "lucide-react";
import { CertificateOfAnalysis } from "../../../types/laboratoryTypes";

interface CoaGeneratorTabProps {
  coas: CertificateOfAnalysis[];
}

export const CoaGeneratorTab: React.FC<CoaGeneratorTabProps> = ({ coas }) => {
  const [selectedCoa, setSelectedCoa] = useState<CertificateOfAnalysis | null>(coas[0] || null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-500" /> Certificate of Analysis (COA) Generator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penerbitan Sertifikat Analisis Resmi berakreditasi ISO/IEC 17025 KAN untuk pengapalan, barge loading, dan transaksi komersial.
          </p>
        </div>
        <button
          onClick={() => alert("Membuka COA Generator Wizard...")}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Issue COA Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: COA List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Sertifikat Terbit ({coas.length})
          </h3>
          {coas.map((coa) => (
            <div
              key={coa.id}
              onClick={() => setSelectedCoa(coa)}
              className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                selectedCoa?.id === coa.id
                  ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {coa.certificateNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {coa.status}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {coa.clientName}
              </div>
              <div className="text-[11px] text-slate-500">
                Tongkang: {coa.bargeName || "-"} • Tonase: {coa.tonnageMT.toLocaleString()} MT
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Official Certificate Document Preview */}
        {selectedCoa && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-2xl text-slate-900 dark:text-slate-100 space-y-6 font-serif">
              {/* COA Header */}
              <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold font-sans tracking-wide uppercase text-slate-900 dark:text-slate-100">
                    PT BATUBARA NUSA UTAMA
                  </h1>
                  <p className="text-xs font-sans text-slate-600 dark:text-slate-400">
                    {selectedCoa.laboratoryName}
                  </p>
                  <p className="text-[11px] font-sans text-slate-500">
                    Akreditasi Komite Akreditasi Nasional: <strong className="text-emerald-600 font-mono">{selectedCoa.accreditationNo}</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="px-3 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-sans font-bold text-xs rounded">
                    CERTIFICATE OF ANALYSIS
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedCoa.certificateNumber}
                  </div>
                </div>
              </div>

              {/* Client & Vessel Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 block">Client / Buyer:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.clientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Product Grade:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.productName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Barge / Vessel Name:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.bargeName} / {selectedCoa.vesselName || "-"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Tonnage Quantity:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.tonnageMT.toLocaleString()} Metric Tons</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Sampling Date:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.samplingDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Issue:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCoa.issueDate}</strong>
                </div>
              </div>

              {/* Results Table */}
              <div className="space-y-2 font-sans">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Analytical Test Results
                </h4>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-900 dark:border-slate-100 text-[11px] font-bold uppercase">
                      <th className="py-2">Test Parameter</th>
                      <th className="py-2">Basis</th>
                      <th className="py-2">Unit</th>
                      <th className="py-2 font-mono text-right">Result Value</th>
                      <th className="py-2">Standard Test Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedCoa.results.map((r, i) => (
                      <tr key={i} className="font-mono">
                        <td className="py-2 font-sans font-semibold">{r.parameterName}</td>
                        <td className="py-2">{r.basis}</td>
                        <td className="py-2">{r.unit}</td>
                        <td className="py-2 text-right font-extrabold text-emerald-600 dark:text-emerald-400">{r.value}</td>
                        <td className="py-2 font-sans text-slate-600 dark:text-slate-400">{r.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures Footer & QR Verification */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center font-sans text-xs">
                <div className="space-y-8">
                  <span className="text-slate-500 block">Tested By:</span>
                  <strong className="block border-t border-slate-400 pt-1 text-slate-800 dark:text-slate-200">{selectedCoa.analystName}</strong>
                </div>
                <div className="space-y-8">
                  <span className="text-slate-500 block">Verified By:</span>
                  <strong className="block border-t border-slate-400 pt-1 text-slate-800 dark:text-slate-200">{selectedCoa.reviewerName}</strong>
                </div>
                <div className="space-y-8">
                  <span className="text-slate-500 block">Approved By (Director):</span>
                  <strong className="block border-t border-slate-400 pt-1 text-slate-800 dark:text-slate-200">{selectedCoa.approverName}</strong>
                </div>
              </div>

              {/* Print / Download Button Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <QrCode className="w-4 h-4 text-emerald-500" /> Verify online via QR Verification Link
                </div>
                <button
                  onClick={() => alert(`Mencetak Certificate of Analysis ${selectedCoa.certificateNumber}...`)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print / Export PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
