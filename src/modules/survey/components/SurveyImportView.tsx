// MINE SMART AI - Survey Multi-Format Import Processor (CSV, DXF, SHP, GeoJSON, LAS, GeoTIFF)

import React, { useState } from "react";
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Database,
  Eye,
  Radio,
  HardDrive,
  Cpu,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";
import { SurveyImportFormat, SurveyImportJob } from "../../../types/surveyTypes";

interface SurveyImportViewProps {
  importJobs: SurveyImportJob[];
  onAddImportJob: (job: SurveyImportJob) => void;
  onOpenAISurfaceAnalysis?: (job: SurveyImportJob) => void;
}

export const SurveyImportView: React.FC<SurveyImportViewProps> = ({
  importJobs,
  onAddImportJob,
  onOpenAISurfaceAnalysis,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<SurveyImportFormat>("CSV");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [epsgCode, setEpsgCode] = useState("EPSG:32750 (WGS84 / UTM Zone 50S)");
  const [activeJobDetails, setActiveJobDetails] = useState<SurveyImportJob | null>(null);

  const formatPresets: Record<
    SurveyImportFormat,
    {
      label: string;
      extension: string;
      description: string;
      geometryType: string;
      typicalSize: string;
      featureEstimate: number;
    }
  > = {
    CSV: {
      label: "CSV Point Data",
      extension: ".csv",
      description: "Point XYZ dengan kode titik, layer, instrumen, dan koordinat UTM",
      geometryType: "Point3D (Easting, Northing, RL)",
      typicalSize: "450 KB",
      featureEstimate: 520,
    },
    DXF: {
      label: "AutoCAD DXF CAD",
      extension: ".dxf",
      description: "AutoCAD Drawing Exchange format dengan 3D Polylines, TIN 3DFACE & Kontur",
      geometryType: "3D Polyline, Mesh, Point",
      typicalSize: "2.8 MB",
      featureEstimate: 1450,
    },
    SHP: {
      label: "ESRI Shapefile",
      extension: ".shp / .zip",
      description: "Paket batas IUP/Pit Crest/Toe, boundary disposal, dan polygon geospasial",
      geometryType: "PolygonZ & PolyLineZ",
      typicalSize: "1.2 MB",
      featureEstimate: 85,
    },
    GeoJSON: {
      label: "GeoJSON Vector",
      extension: ".geojson / .json",
      description: "Standar geospasial web GIS FeatureCollection dengan atribut metadata",
      geometryType: "FeatureCollection (Polygons/Points)",
      typicalSize: "850 KB",
      featureEstimate: 120,
    },
    LAS: {
      label: "LiDAR Point Cloud",
      extension: ".las / .laz",
      description: "Point cloud 3D elevasi padat dari UAV LiDAR & sensor terrestrial",
      geometryType: "Point Cloud (XYZ + Intensity + Class)",
      typicalSize: "54 MB",
      featureEstimate: 3850000,
    },
    GeoTIFF: {
      label: "GeoTIFF Elevation Raster",
      extension: ".tif / .tiff",
      description: "Grid raster DTM/DSM & Orthomosaic georeferenced beresolusi tinggi",
      geometryType: "Elevation Raster Grid",
      typicalSize: "140 MB",
      featureEstimate: 1,
    },
  };

  const handleSimulatedUpload = (customName?: string) => {
    setIsUploading(true);
    setUploadProgress(15);

    const preset = formatPresets[selectedFormat];
    const fileName =
      customName || `MINE_SURVEY_${selectedFormat}_PIT1_AUG2026${preset.extension}`;

    const timer1 = setTimeout(() => setUploadProgress(55), 300);
    const timer2 = setTimeout(() => setUploadProgress(85), 600);

    const timer3 = setTimeout(() => {
      setUploadProgress(100);

      const isLAS = selectedFormat === "LAS";
      const isGeoTIFF = selectedFormat === "GeoTIFF";

      const newJob: SurveyImportJob = {
        id: `ij-${Date.now()}`,
        jobId: `JOB-IMP-${selectedFormat}-${Math.floor(100 + Math.random() * 900)}`,
        fileName,
        format: selectedFormat,
        fileSizeBytes: isLAS ? 52400000 : isGeoTIFF ? 135000000 : 380000,
        geometryType: preset.geometryType,
        featureCount: preset.featureEstimate,
        validFeatures: isLAS ? 3848900 : preset.featureEstimate,
        invalidFeatures: isLAS ? 1100 : selectedFormat === "CSV" ? 2 : 0,
        duplicateFeatures: 0,
        coordinateSystem: epsgCode,
        status: "Completed",
        createdAt: new Date().toISOString(),
        processedBy: "Budi Santoso, S.T.",
        lasMetadata: isLAS
          ? {
              pointCount: 3850000,
              densityPtsSqm: 48.2,
              returnClassification: {
                ground: 3200000,
                vegetation: 510000,
                structure: 120000,
                noise: 20000,
              },
              intensityRange: [10, 255],
            }
          : undefined,
        geoTiffMetadata: isGeoTIFF
          ? {
              pixelSizeMeters: 0.1,
              rasterDimensions: { width: 4096, height: 4096 },
              minElevation: 22.4,
              maxElevation: 172.8,
              bandsCount: 1,
            }
          : undefined,
      };

      onAddImportJob(newJob);
      setIsUploading(false);
      setUploadProgress(0);
      setActiveJobDetails(newJob);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Multi-Format Survey Import Engine
              <span className="px-2 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-mono">
                CSV • DXF • SHP • GeoJSON • LAS • GeoTIFF
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Impor langsung data ukur lapangan dari Drone UAV, LiDAR Point Cloud, GNSS RTK, Total Station, dan CAD/GIS Layer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulatedUpload()}
            disabled={isUploading}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Impor Sampel {selectedFormat}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Center & Format Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Format Switcher & Drag Drop */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-400" />
              Pilih Format File Masukan
            </h3>
          </div>

          {/* 6 Format Buttons Grid */}
          <div className="grid grid-cols-3 gap-2">
            {(["CSV", "DXF", "SHP", "GeoJSON", "LAS", "GeoTIFF"] as const).map((fmt) => {
              const isSelected = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-600/20 border-sky-500 text-white shadow-lg shadow-sky-950/40 ring-1 ring-sky-400/40"
                      : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{fmt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                    {formatPresets[fmt].extension}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Format Description Card */}
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold text-white">{formatPresets[selectedFormat].label}</span>
              <span className="text-[11px] font-mono text-sky-400">{formatPresets[selectedFormat].typicalSize}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {formatPresets[selectedFormat].description}
            </p>
            <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Geometri: {formatPresets[selectedFormat].geometryType}</span>
            </div>
          </div>

          {/* Target Coordinate Projection */}
          <div className="space-y-1.5 text-xs">
            <label className="block text-slate-300 font-semibold">Sistem Proyeksi Target</label>
            <input
              type="text"
              value={epsgCode}
              onChange={(e) => setEpsgCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files.length > 0) {
                handleSimulatedUpload(e.dataTransfer.files[0].name);
              }
            }}
            onClick={() => handleSimulatedUpload()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all cursor-pointer ${
              dragActive
                ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
                : "border-slate-800 bg-slate-950/70 hover:border-sky-500/50 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-sky-400 shadow-md">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Drag & Drop file {selectedFormat} ({formatPresets[selectedFormat].extension}) di sini
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                atau klik untuk memilih file dari komputer lokal
              </p>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="p-3 bg-slate-950 rounded-xl border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-sky-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  Validasi parsing {selectedFormat}...
                </span>
                <span className="font-mono font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Historical Import Jobs & Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Inspector if selected */}
          {activeJobDetails && (
            <div className="bg-slate-900/90 border border-sky-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-lg font-mono">
                    {activeJobDetails.format}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{activeJobDetails.fileName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{activeJobDetails.jobId} • {activeJobDetails.coordinateSystem}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenAISurfaceAnalysis && (
                    <button
                      onClick={() => onOpenAISurfaceAnalysis(activeJobDetails)}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analisis AI Surface</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveJobDetails(null)}
                    className="p-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              {/* LAS Point Cloud Specific Metadata */}
              {activeJobDetails.lasMetadata && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-2 text-sky-400">
                      <Cpu className="w-4 h-4" />
                      Metadata LiDAR Point Cloud (LAS / LAZ)
                    </span>
                    <span className="font-mono text-slate-300">
                      Densitas: {activeJobDetails.lasMetadata.densityPtsSqm} pts/m²
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-emerald-400 block">Class 2: Ground</span>
                      <span className="font-bold text-white">
                        {activeJobDetails.lasMetadata.returnClassification.ground.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-teal-400 block">Class 3-5: Vegetation</span>
                      <span className="font-bold text-white">
                        {activeJobDetails.lasMetadata.returnClassification.vegetation.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-amber-400 block">Class 6: Structure</span>
                      <span className="font-bold text-white">
                        {activeJobDetails.lasMetadata.returnClassification.structure.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-rose-400 block">Class 7: Noise</span>
                      <span className="font-bold text-white">
                        {activeJobDetails.lasMetadata.returnClassification.noise.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* GeoTIFF Raster Specific Metadata */}
              {activeJobDetails.geoTiffMetadata && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-2 text-sky-400">
                      <Layers className="w-4 h-4" />
                      Metadata GeoTIFF Elevation Raster (DEM / DTM / DSM)
                    </span>
                    <span className="font-mono text-slate-300">
                      GSD Pixel: {activeJobDetails.geoTiffMetadata.pixelSizeMeters}m
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Dimensi Grid</span>
                      <span className="font-bold text-white">
                        {activeJobDetails.geoTiffMetadata.rasterDimensions.width} x{" "}
                        {activeJobDetails.geoTiffMetadata.rasterDimensions.height} px
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Rentang Elevasi</span>
                      <span className="font-bold text-sky-400">
                        {activeJobDetails.geoTiffMetadata.minElevation}m ~{" "}
                        {activeJobDetails.geoTiffMetadata.maxElevation}m RL
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Raster Bands</span>
                      <span className="font-bold text-emerald-400">
                        {activeJobDetails.geoTiffMetadata.bandsCount} Band (Float32)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Jobs List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Riwayat Pekerjaan Impor ({importJobs.length})
              </h3>
              <span className="text-xs text-slate-400">Audit Trail Geometri Valid</span>
            </div>

            <div className="space-y-3">
              {importJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setActiveJobDetails(job)}
                  className={`p-4 bg-slate-950 border rounded-xl space-y-2.5 transition-all cursor-pointer ${
                    activeJobDetails?.id === job.id
                      ? "border-sky-500 bg-sky-950/20"
                      : "border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-mono">
                        {job.format}
                      </span>
                      <span className="font-bold text-white font-mono text-xs">{job.fileName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                        {job.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(job.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 font-mono text-[11px] pt-1 border-t border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Geometri</span>
                      <span className="text-slate-300 truncate block">{job.geometryType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Total Fitur</span>
                      <span className="text-white font-bold">{job.featureCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Valid / Sukses</span>
                      <span className="text-emerald-400 font-bold">{job.validFeatures.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Surveyor</span>
                      <span className="text-sky-300 truncate block">{job.processedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
