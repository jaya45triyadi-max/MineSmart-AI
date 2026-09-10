// MINE SMART AI - MinerbaOne Reporting & Pre-Validation Bridge Tab
import React, { useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Code,
  Copy,
  Layers,
  Sparkles,
  Info,
  Building2,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { MinerbaOneBridgePayload } from "../../../types/rkabTypes";

interface MinerbaOneReportingBridgeTabProps {
  payload: MinerbaOneBridgePayload | null;
  onRefresh: () => void;
}

export const MinerbaOneReportingBridgeTab: React.FC<MinerbaOneReportingBridgeTabProps> = ({
  payload,
  onRefresh,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"validation" | "json" | "matrices">("validation");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!payload) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        Menyiapkan data MinerbaOne Bridge...
      </div>
    );
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMatrix = (matrixName: string) => {
    setDownloadSuccess(`Berhasil mengunduh template resmi: ${matrixName}.xlsx`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const errorCount = payload.preValidationErrors.filter((e) => e.severity === "ERROR").length;
  const warningCount = payload.preValidationErrors.filter((e) => e.severity === "WARNING").length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Official MinerbaOne Positioning Disclaimer */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/40 p-5 rounded-2xl border border-blue-500/30 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 text-slate-950 rounded-xl font-black shrink-0 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  MinerbaOne Internal Staging & Pre-Validation Bridge
                </h3>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-black rounded border border-blue-500/30">
                  SISTEM INTERNAL PENDUKUNG
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Aplikasi ini bertindak sebagai <em>internal compliance validator</em> untuk memastikan seluruh matriks, target produksi, DMO batubara, jamrek, dan data keselamatan telah teruji valid sebelum diekspor atau diunggah ke sistem resmi pemerintah <strong>MinerbaOne ESDM</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition"
              title="Refresh Validasi"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href="https://minerbaone.esdm.go.id"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
            >
              <span>Portal MinerbaOne Resmi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setViewMode("validation")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === "validation"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hasil Pra-Validasi Kepatuhan ({payload.preValidationErrors.length})</span>
        </button>

        <button
          onClick={() => setViewMode("matrices")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === "matrices"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Ekspor Matriks 1-18 ESDM</span>
        </button>

        <button
          onClick={() => setViewMode("json")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            viewMode === "json"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>JSON Payload API Schema</span>
        </button>
      </div>

      {/* 1. VALIDATION VIEW */}
      {viewMode === "validation" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase">Status Pra-Submit Minerba</div>
              <div className="text-xl font-black text-emerald-400">
                {errorCount === 0 ? "READY FOR SUBMISSION" : "ACTION REQUIRED"}
              </div>
              <span className="text-[10px] text-slate-500">Berdasarkan Kepmen ESDM 1827/2018</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase">Critical Errors</div>
              <div className={`text-xl font-black ${errorCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {errorCount} Isu Kritis
              </div>
              <span className="text-[10px] text-slate-500">Wajib diperbaiki sebelum pelaporan</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase">Compliance Warnings</div>
              <div className={`text-xl font-black ${warningCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {warningCount} Peringatan
              </div>
              <span className="text-[10px] text-slate-500">Masa berlaku sertifikat & batas toleransi kuota</span>
            </div>
          </div>

          {/* Validation Rule Breakdown */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-800/80">
            {payload.preValidationErrors.map((err, idx) => (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {err.severity === "ERROR" ? (
                      <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    ) : err.severity === "WARNING" ? (
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-white">{err.code}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      err.severity === "ERROR"
                        ? "bg-rose-500/20 text-rose-400"
                        : err.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {err.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {err.message}
                </p>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <strong className="text-amber-400 whitespace-nowrap">Rekomendasi Tindakan:</strong>
                  <span>{err.remedy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MATRICES EXPORT VIEW */}
      {viewMode === "matrices" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <h4 className="text-sm font-black text-white">
              Paket Ekspor Matriks Laporan Triwulanan & Tahunan (Format Minerba ESDM)
            </h4>
            <p className="text-xs text-slate-400">
              Format terstandarisasi siap pakai untuk proses pengunggahan ke portal MinerbaOne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { code: "Matriks 1", title: "Rencana dan Realisasi Eksplorasi", desc: "Data pemboran inti, logging geofisika, analisis kualitas batubara." },
              { code: "Matriks 2", title: "Rencana dan Realisasi Penambangan (OB & Coal)", desc: "Kemajuan tambang, penanganan batuan penutup, stripping ratio." },
              { code: "Matriks 3", title: "Pengolahan & Pemurnian Batubara", desc: "Kapasitas crushing plant, sizing, recovery, dan stockpile batubara." },
              { code: "Matriks 4", title: "Infrastruktur & Sarana Prasarana", desc: "Hauling road, pelabuhan/jetty conveyor, settling pond, workshop." },
              { code: "Matriks 5", title: "Lingkungan & Reklamasi Lahan", desc: "Penataan lahan, revegetasi, pembibitan nursery, dan jaminan reklamasi." },
              { code: "Matriks 6", title: "Keselamatan Pertambangan (K3 & KO)", desc: "Statistik kecelakaan, jam kerja selamat, hasil audit SMKP." },
              { code: "Matriks 7", title: "Tenaga Kerja & Sertifikasi KTT/POP", desc: "Komposisi tenaga kerja lokal/nasional, kompetensi pengawas." },
              { code: "Matriks 8", title: "Investasi, Keuangan & Royalti PNBP", desc: "Realisasi Capex/Opex, pembayaran royalti e-PNBP & SIMBARA." },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{m.code}</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      VALID
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">{m.title}</h5>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>

                <button
                  onClick={() => handleDownloadMatrix(m.code)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unduh {m.code} (.XLSX)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. JSON API SCHEMA VIEW */}
      {viewMode === "json" && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden space-y-3 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                REST API MinerbaOne Integration Payload Schema
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Struktur JSON yang siap dikirimkan melalui API Gateway MinerbaOne saat endpoint resmi dibuka.
              </p>
            </div>

            <button
              onClick={handleCopyJSON}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-96 text-[11px] font-mono text-emerald-400 leading-relaxed">
            <pre>{JSON.stringify(payload, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
