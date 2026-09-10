// MINE SMART AI - GIS Import GeoJSON / CSV Modal Component

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { SpatialEntity } from "../types/gisTypes";

interface GISImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedEntities: SpatialEntity[]) => void;
}

export const GISImportModal: React.FC<GISImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  if (!isOpen) return null;

  const [rawData, setRawData] = useState<string>("");
  const [crsFormat, setCrsFormat] = useState<string>("UTM_ZONE_50S");
  const [targetLayer, setTargetLayer] = useState<string>("layer-pits");
  const [importStatus, setImportStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [importedCount, setImportedCount] = useState<number>(0);

  const handleSimulateImport = () => {
    if (!rawData.trim()) {
      // Load sample GeoJSON payload if empty
      const sampleEntity: SpatialEntity = {
        id: `sp-import-${Date.now()}`,
        companyId: "comp-01",
        siteId: "site-01",
        siteName: "Sangatta Coal Mine Site A",
        name: "Imported Boundary Bench Pit 3",
        code: "PIT-03-IMP",
        type: "PIT",
        layerId: targetLayer,
        status: "OPERATING",
        rlElevation: "RL +20.0m",
        centerCoordinates: { lat: -0.496, lng: 117.145 },
        polygonCoordinates: [
          { lat: -0.495, lng: 117.142 },
          { lat: -0.494, lng: 117.148 },
          { lat: -0.498, lng: 117.149 },
          { lat: -0.499, lng: 117.143 },
        ],
        utmString: "50S 516100 m E 9945100 m N",
        areaHa: 45.2,
        volumeM3: 1200000,
        description: "Validasi pemetaan galian terimpor dari drone LiDAR RTK survey.",
        properties: [
          { label: "Format Impors", value: "GeoJSON WGS84" },
          { label: "Validasi Datum", value: "PASSED (ESDM Standard)" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onImportSuccess([sampleEntity]);
      setImportedCount(1);
      setImportStatus("SUCCESS");
      return;
    }

    try {
      const parsed = JSON.parse(rawData);
      setImportStatus("SUCCESS");
      setImportedCount(parsed.features ? parsed.features.length : 1);
    } catch (err) {
      setImportStatus("ERROR");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Import Data Spasial GeoJSON / CSV / KML
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah hasil ukur survey drone LiDAR atau CAD Mine Plan ke GIS MINE SMART AI.
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Sistem Koordinat Acuan (CRS):
              </label>
              <select
                value={crsFormat}
                onChange={(e) => setCrsFormat(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="UTM_ZONE_50S">UTM Zone 50S (Kaltim/Kalteng)</option>
                <option value="UTM_ZONE_49S">UTM Zone 49S (Kalbar/Kaltara)</option>
                <option value="WGS84">WGS 84 Latitude/Longitude</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Layer Tujuan (Target Layer):
              </label>
              <select
                value={targetLayer}
                onChange={(e) => setTargetLayer(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="layer-pits">Batas Active Pit Tambang</option>
                <option value="layer-seams">Batubara Seam Layers</option>
                <option value="layer-roads">Jalan Hauling Utama</option>
                <option value="layer-disposal">Waste Dump Disposal</option>
                <option value="layer-stockpile">Stockpile & ROM Coal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              GeoJSON String / Spatial File Content:
            </label>
            <textarea
              rows={5}
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder='Tempelkan string GeoJSON di sini atau biarkan kosong untuk simulasi impor sampel validasi ESDM...'
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {importStatus === "SUCCESS" && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-2 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Berhasil mengimpor {importedCount} objek spasial ke peta GIS active site!</span>
            </div>
          )}

          {importStatus === "ERROR" && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Format GeoJSON tidak valid! Pastikan sintaks JSON sesuai standar RFC 7946.</span>
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
          <button
            onClick={handleSimulateImport}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Upload className="h-4 w-4" />
            <span>Proses Impor Spasial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
