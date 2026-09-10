// MINE SMART AI - Geological Import Center & Template Importer

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

interface GeologicalImportViewProps {
  onImportComplete: () => void;
}

export const GeologicalImportView: React.FC<GeologicalImportViewProps> = ({
  onImportComplete,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState("BOREHOLE");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    totalRows: number;
    validRows: number;
    warningRows: number;
    invalidRows: number;
  } | null>(null);

  const handleSimulatedUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setImportSummary({
        totalRows: 12,
        validRows: 11,
        warningRows: 1,
        invalidRows: 0,
      });
    }, 1200);
  };

  const handleDownloadTemplate = (type: string) => {
    alert(`Mengunduh Template CSV/Excel Resmi: TEMPLATE_GEOLOGY_${type}_v2026.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Pusat Import Data Geologi & Validasi Skema
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dukungan import data masif dari file CSV, Excel (.xlsx), GeoJSON, dan JSON format terakreditasi
            </p>
          </div>
        </div>

        {/* Template Selector & Downloads */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { id: "BOREHOLE", label: "Borehole Master" },
            { id: "COLLAR", label: "Collar Coordinates" },
            { id: "LITHOLOGY", label: "Lithology Logs" },
            { id: "SEAM", label: "Seam Intersections" },
            { id: "SAMPLE", label: "Samples & Custody" },
            { id: "ASSAY", label: "Assay Lab Results" },
          ].map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                selectedTemplate === tmpl.id
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span>{tmpl.label}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTemplate(tmpl.id);
                }}
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mt-1"
              >
                <Download className="w-3 h-3" />
                Template
              </span>
            </button>
          ))}
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleSimulatedUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? "border-emerald-500 bg-emerald-950/30"
              : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
          }`}
        >
          <UploadCloud className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-white">Tarik & Lepas File CSV / Excel Di Sini</h4>
          <p className="text-xs text-slate-400 mt-1">
            Format file didukung: .csv, .xlsx, .json, .geojson (Maksimal 25MB per berkas)
          </p>

          <label className="inline-block mt-4 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer">
            <span>Pilih Berkas Komputer</span>
            <input
              type="file"
              accept=".csv,.xlsx,.json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleSimulatedUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Validation Preview Summary */}
        {isProcessing && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-emerald-400 font-bold animate-pulse">
            Memindai Skema & Validasi Koordinat File Geologi...
          </div>
        )}

        {importSummary && (
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Hasil Pemindaian Skema Sebelum Import
            </h4>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total Baris</span>
                <span className="text-lg font-bold text-white">{importSummary.totalRows}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Baris Valid</span>
                <span className="text-lg font-bold text-emerald-400">{importSummary.validRows}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Peringatan Warning</span>
                <span className="text-lg font-bold text-amber-400">{importSummary.warningRows}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Baris Invalid</span>
                <span className="text-lg font-bold text-rose-400">{importSummary.invalidRows}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  alert("Data geologi berhasil di-import ke database!");
                  onImportComplete();
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Eksekusi Import Data Valid</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
