// MINE SMART AI - GIS Export Map & Spatial Data Modal Component

import React, { useState } from "react";
import { X, Download, FileText, Printer, Check, Copy } from "lucide-react";
import { SpatialEntity } from "../types/gisTypes";
import { GISService } from "../../../services/gis/GISService";

interface GISExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: SpatialEntity[];
}

export const GISExportModal: React.FC<GISExportModalProps> = ({
  isOpen,
  onClose,
  entities,
}) => {
  if (!isOpen) return null;

  const [exportFormat, setExportFormat] = useState<"GEOJSON" | "CSV" | "PRINT">("GEOJSON");
  const [copied, setCopied] = useState(false);

  const geojsonText = GISService.exportToGeoJSON(entities);
  const csvText = GISService.exportToCSV(entities);

  const handleCopy = () => {
    const content = exportFormat === "GEOJSON" ? geojsonText : csvText;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const isJson = exportFormat === "GEOJSON";
    const content = isJson ? geojsonText : csvText;
    const blob = new Blob([content], { type: isJson ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MINE_SMART_AI_GIS_EXPORT_${Date.now()}.${isJson ? "geojson" : "csv"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintMap = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Export Map & Data Spasial Tambang
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unduh data koordinat, polygon pit, dan peta ke format GeoJSON, CSV, atau Print PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setExportFormat("GEOJSON")}
              className={`p-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                exportFormat === "GEOJSON"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <span>Format GeoJSON</span>
            </button>

            <button
              onClick={() => setExportFormat("CSV")}
              className={`p-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                exportFormat === "CSV"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
              <span>Format CSV Data</span>
            </button>

            <button
              onClick={() => setExportFormat("PRINT")}
              className={`p-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                exportFormat === "PRINT"
                  ? "border-sky-500 bg-sky-500/10 text-sky-500"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Printer className="h-5 w-5 mx-auto mb-1 text-sky-500" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Export Code Preview */}
          {exportFormat !== "PRINT" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Pratinjau Export ({entities.length} Objek Spasial):
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Content"}</span>
                </button>
              </div>

              <textarea
                rows={6}
                readOnly
                value={exportFormat === "GEOJSON" ? geojsonText : csvText}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          )}

          {exportFormat === "PRINT" && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs leading-relaxed space-y-2">
              <span className="font-extrabold block text-sm">Mode Cetak Map Snapshot</span>
              <p>
                Fitur ini akan membuka dialog cetak browser untuk menyimpan Peta Spasial Tambang
                beserta seluruh layer aktif ke format PDF atau dokumen siap cetak ESDM.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Tutup
          </button>

          {exportFormat === "PRINT" ? (
            <button
              onClick={handlePrintMap}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Peta Map</span>
            </button>
          ) : (
            <button
              onClick={handleDownloadFile}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Download File .{exportFormat.toLowerCase()}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
