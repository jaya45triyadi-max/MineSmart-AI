// MINE SMART AI - Geological Database Explorer & Version Control Center
// Full 8-entity Master Database:
// 1. Borehole
// 2. Collar
// 3. Survey (Downhole Survey)
// 4. Lithology
// 5. Seam
// 6. Sample
// 7. Assay
// 8. Coal Quality

import React, { useState } from "react";
import {
  Database,
  Layers,
  MapPin,
  Compass,
  Ruler,
  Flame,
  FlaskConical,
  FileSpreadsheet,
  FileText,
  Search,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  Tag,
} from "lucide-react";
import {
  Borehole,
  Collar,
  DownholeSurveyRecord,
  LithologyRecord,
  SeamIntersection,
  SampleRecord,
  AssayRecord,
  CoalQualityProfile,
  GeologicalDatabaseVersion,
} from "../../../types/geologyTypes";
import { GeologyRepository } from "../../../services/repositories/GeologyRepository";

interface GeologicalDatabaseViewProps {
  versions: GeologicalDatabaseVersion[];
  onAddVersion: (v: GeologicalDatabaseVersion) => void;
  onNavigateEntity?: (entity: string) => void;
}

export const GeologicalDatabaseView: React.FC<GeologicalDatabaseViewProps> = ({
  versions,
  onAddVersion,
  onNavigateEntity,
}) => {
  const [activeEntityTab, setActiveEntityTab] = useState<
    "borehole" | "collar" | "survey" | "lithology" | "seam" | "sample" | "assay" | "quality"
  >("borehole");

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);
  const [versionNumber, setVersionNumber] = useState("v2.1-APPROVED");
  const [versionTitle, setVersionTitle] = useState("Pembaruan Model Stratigrafi Q4 2026");
  const [versionDesc, setVersionDesc] = useState("Baseline data geologi hasil infill drilling kerapatan 50m.");

  // Datasets
  const boreholes = GeologyRepository.getBoreholes();
  const collars = GeologyRepository.getCollars();
  const surveys = GeologyRepository.getSurveys();
  const lithologies = GeologyRepository.getLithologies();
  const seams = GeologyRepository.getSeamIntersections();
  const samples = GeologyRepository.getSamples();
  const assays = GeologyRepository.getAssays();
  const qualities = GeologyRepository.getQualities();

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    const newVer: GeologicalDatabaseVersion = {
      id: `gdbv-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      versionNumber,
      title: versionTitle,
      description: versionDesc,
      totalBoreholesCount: boreholes.length,
      totalSamplesCount: samples.length,
      status: "APPROVED",
      approvedBy: "Hendra Kusuma (Chief CPI Geologi)",
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddVersion(newVer);
    setIsNewVersionModalOpen(false);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeEntityTab === "borehole") {
      csvContent += "BoreholeCode,PitName,DrillingType,PlannedDepth,ActualDepth,Status,Validation\n";
      boreholes.forEach((b) => {
        csvContent += `${b.boreholeCode},${b.pitName},${b.drillingType},${b.plannedDepth},${b.actualDepth},${b.status},${b.validationStatus}\n`;
      });
    } else if (activeEntityTab === "quality") {
      csvContent += "SampleCode,Borehole,Seam,GAR,GCV_adb,TM_ar,IM_adb,Ash_adb,TS_adb,VM_adb,FC_adb\n";
      qualities.forEach((q) => {
        csvContent += `${q.sampleCode},${q.boreholeCode},${q.seamCode},${q.garKcalKg},${q.gcvAdbKcalKg},${q.totalMoistureAr},${q.inherentMoistureAdb},${q.ashContentAdb},${q.totalSulfurAdb},${q.volatileMatterAdb},${q.fixedCarbonAdb}\n`;
      });
    } else {
      csvContent += "ID,BoreholeCode,ValidationStatus\n";
      boreholes.forEach((b) => {
        csvContent += `${b.id},${b.boreholeCode},${b.validationStatus}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `geology_db_${activeEntityTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Versioning & Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Geological Database Master Repository
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                v1.0-APPROVED
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Basis data tunggal (Single Source of Truth) geologi: Borehole, Collar, Survey, Lithology, Seam, Sample, Assay, Coal Quality.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV ({activeEntityTab.toUpperCase()})</span>
          </button>

          <button
            onClick={() => setIsNewVersionModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Versi Database Baru</span>
          </button>
        </div>
      </div>

      {/* 8-Entity Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { id: "borehole", label: "1. Borehole", icon: Layers, count: boreholes.length },
          { id: "collar", label: "2. Collar", icon: MapPin, count: collars.length },
          { id: "survey", label: "3. Survey", icon: Compass, count: surveys.length },
          { id: "lithology", label: "4. Lithology", icon: Ruler, count: lithologies.length },
          { id: "seam", label: "5. Seam", icon: Flame, count: seams.length },
          { id: "sample", label: "6. Sample", icon: FlaskConical, count: samples.length },
          { id: "assay", label: "7. Assay", icon: FileSpreadsheet, count: assays.length },
          { id: "quality", label: "8. Coal Quality", icon: FileText, count: qualities.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeEntityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveEntityTab(tab.id as any)}
              className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950"
                  : "bg-slate-900/90 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                }`}>
                  {tab.count}
                </span>
              </div>
              <div className="text-xs font-bold truncate">{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Main Entity Data Viewer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white capitalize">
              Tabel Data Geologi: {activeEntityTab}
            </h4>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={`Cari dalam ${activeEntityTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 1. Boreholes Table */}
        {activeEntityTab === "borehole" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Kode Borehole</th>
                  <th className="py-2 px-3">Pit Area</th>
                  <th className="py-2 px-3">Tipe Pengeboran</th>
                  <th className="py-2 px-3 text-right">Rencana (m)</th>
                  <th className="py-2 px-3 text-right">Aktual (m)</th>
                  <th className="py-2 px-3 text-right">Core Recov (%)</th>
                  <th className="py-2 px-3">Kontraktor & Rig</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {boreholes
                  .filter((b) => b.boreholeCode.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{b.boreholeCode}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">{b.pitName}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">{b.drillingType}</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">{b.plannedDepth}m</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{b.actualDepth}m</td>
                      <td className="py-2.5 px-3 text-right text-sky-300">{b.overallRecoveryPercent || 98.5}%</td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">{b.contractor}</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {b.validationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Collars Table */}
        {activeEntityTab === "collar" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Borehole Code</th>
                  <th className="py-2 px-3 text-right">Easting (m)</th>
                  <th className="py-2 px-3 text-right">Northing (m)</th>
                  <th className="py-2 px-3 text-right">Elevation RL</th>
                  <th className="py-2 px-3 text-right">LiDAR DEM</th>
                  <th className="py-2 px-3 text-right">Δ Elevasi</th>
                  <th className="py-2 px-3">Metode Survei</th>
                  <th className="py-2 px-3">Surveyor</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {collars.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{c.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">{c.easting.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">{c.northing.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">{c.elevation.toFixed(2)}m</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{(c.demLiDARElevation || c.elevation).toFixed(2)}m</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">{(c.elevationDelta || 0).toFixed(2)}m</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{c.surveyMethod}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{c.surveyorName || "Rudi Hartono"}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {c.validationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Downhole Surveys Table */}
        {activeEntityTab === "survey" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3 text-right">MD (m)</th>
                  <th className="py-2 px-3 text-right">Dip / Inclination</th>
                  <th className="py-2 px-3 text-right">Azimuth (°)</th>
                  <th className="py-2 px-3 text-right">TVD (m)</th>
                  <th className="py-2 px-3 text-right">Δ Easting</th>
                  <th className="py-2 px-3 text-right">Δ Northing</th>
                  <th className="py-2 px-3">Instrumen</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {surveys.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{s.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-300">{s.measuredDepthM.toFixed(1)}m</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">{s.inclinationDipDeg.toFixed(1)}°</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">{s.azimuthDeg.toFixed(1)}°</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{s.trueVerticalDepthM.toFixed(2)}m</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">+{s.deltaEastingM.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">+{s.deltaNorthingM.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{s.surveyTool}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {s.validationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Lithology Logs */}
        {activeEntityTab === "lithology" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3 text-right">From (m)</th>
                  <th className="py-2 px-3 text-right">To (m)</th>
                  <th className="py-2 px-3 text-right">Tebal (m)</th>
                  <th className="py-2 px-3">Kode Litologi</th>
                  <th className="py-2 px-3">Nama Batuan</th>
                  <th className="py-2 px-3">Deskripsi Geologi</th>
                  <th className="py-2 px-3 text-right">Recovery (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {lithologies.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{l.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{l.fromDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{l.toDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{l.thickness.toFixed(1)}m</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">{l.lithologyCode}</td>
                    <td className="py-2.5 px-3 font-sans text-white">{l.lithologyName}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 truncate max-w-xs">{l.description}</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">{l.coreRecoveryPercent || 98}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Seams Table */}
        {activeEntityTab === "seam" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3">Kode Seam</th>
                  <th className="py-2 px-3 text-right">From (m)</th>
                  <th className="py-2 px-3 text-right">To (m)</th>
                  <th className="py-2 px-3 text-right">Apparent Thick</th>
                  <th className="py-2 px-3 text-right text-emerald-400 font-bold">True Thick (m)</th>
                  <th className="py-2 px-3 text-right">Roof RL</th>
                  <th className="py-2 px-3 text-right">Floor RL</th>
                  <th className="py-2 px-3 text-center">Status Kualitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {seams.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{s.boreholeCode}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{s.seamCode}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{s.fromDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{s.toDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{s.apparentThickness.toFixed(2)}m</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{s.trueThickness.toFixed(2)}m</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">{s.roofElevation.toFixed(1)}m</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">{s.floorElevation.toFixed(1)}m</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {s.qualityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Samples Table */}
        {activeEntityTab === "sample" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Kode Sampel</th>
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3">Seam</th>
                  <th className="py-2 px-3 text-right">From (m)</th>
                  <th className="py-2 px-3 text-right">To (m)</th>
                  <th className="py-2 px-3 text-right">Berat (kg)</th>
                  <th className="py-2 px-3">Laboratorium Penguji</th>
                  <th className="py-2 px-3 text-center">Custody Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {samples.map((smp) => (
                  <tr key={smp.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{smp.sampleCode}</td>
                    <td className="py-2.5 px-3 text-slate-300">{smp.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{smp.seamCode || "-"}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{smp.fromDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{smp.toDepth.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">{smp.weightKg.toFixed(1)} kg</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{smp.laboratory}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {smp.custodyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. Assays Table */}
        {activeEntityTab === "assay" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Sampel</th>
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3">Parameter Uji</th>
                  <th className="py-2 px-3 text-right">Nilai Hasil</th>
                  <th className="py-2 px-3">Satuan</th>
                  <th className="py-2 px-3">Metode Standar</th>
                  <th className="py-2 px-3">No Sertifikat Lab</th>
                  <th className="py-2 px-3 text-center">Quality Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {assays.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{a.sampleCode}</td>
                    <td className="py-2.5 px-3 text-slate-300">{a.boreholeCode}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-200">{a.parameterName}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold text-sm">{a.resultValue}</td>
                    <td className="py-2.5 px-3 text-slate-400">{a.unit}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{a.methodStandard}</td>
                    <td className="py-2.5 px-3 text-slate-400">{a.certificateRef}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {a.qualityFlag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. Coal Quality Comprehensive Table */}
        {activeEntityTab === "quality" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-2 px-3">Sampel</th>
                  <th className="py-2 px-3">Borehole</th>
                  <th className="py-2 px-3">Seam</th>
                  <th className="py-2 px-3 text-right text-white font-bold">GAR (kcal/kg)</th>
                  <th className="py-2 px-3 text-right text-emerald-400">GCV (adb)</th>
                  <th className="py-2 px-3 text-right text-teal-300">TM (% ar)</th>
                  <th className="py-2 px-3 text-right text-sky-300">IM (% adb)</th>
                  <th className="py-2 px-3 text-right text-amber-300">Ash (% adb)</th>
                  <th className="py-2 px-3 text-right text-rose-300">TS (% adb)</th>
                  <th className="py-2 px-3 text-right text-indigo-300">VM (% adb)</th>
                  <th className="py-2 px-3 text-right text-purple-300">FC (% adb)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {qualities.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{q.sampleCode}</td>
                    <td className="py-2.5 px-3 text-slate-300">{q.boreholeCode}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{q.seamCode}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white text-sm">{q.garKcalKg}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{q.gcvAdbKcalKg}</td>
                    <td className="py-2.5 px-3 text-right text-teal-300">{q.totalMoistureAr.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-sky-300">{q.inherentMoistureAdb.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-amber-300">{q.ashContentAdb.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-rose-300">{q.totalSulfurAdb.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-right text-indigo-300">{q.volatileMatterAdb.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-purple-300">{q.fixedCarbonAdb.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Database Version Modal */}
      {isNewVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Snapshot Geological Database Version
              </h3>
              <button
                onClick={() => setIsNewVersionModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVersion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nomor Versi (misal v2.1-APPROVED)</label>
                <input
                  type="text"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Judul Snapshot Versi</label>
                <input
                  type="text"
                  value={versionTitle}
                  onChange={(e) => setVersionTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan Perubahan & Deskripsi</label>
                <textarea
                  rows={3}
                  value={versionDesc}
                  onChange={(e) => setVersionDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewVersionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/30 cursor-pointer"
                >
                  Simpan & Rilis Versi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
