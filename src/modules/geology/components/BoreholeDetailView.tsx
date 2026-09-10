// MINE SMART AI - Borehole Detail View Explorer

import React, { useState } from "react";
import {
  ArrowLeft,
  Layers,
  MapPin,
  Flame,
  FlaskConical,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  History,
  Ruler,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
} from "lucide-react";
import {
  Borehole,
  Collar,
  LithologyRecord,
  SeamIntersection,
  SampleRecord,
  AssayRecord,
  CoalQualityProfile,
  CorePhotoRecord,
} from "../../../types/geologyTypes";

interface BoreholeDetailViewProps {
  borehole: Borehole;
  collar?: Collar;
  lithologies: LithologyRecord[];
  seams: SeamIntersection[];
  samples: SampleRecord[];
  assays: AssayRecord[];
  qualities: CoalQualityProfile[];
  corePhotos: CorePhotoRecord[];
  onBack: () => void;
}

export const BoreholeDetailView: React.FC<BoreholeDetailViewProps> = ({
  borehole,
  collar,
  lithologies,
  seams,
  samples,
  assays,
  qualities,
  corePhotos,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "collar"
    | "lithology"
    | "seam"
    | "samples"
    | "assays"
    | "quality"
    | "photos"
    | "qc"
  >("overview");

  return (
    <div className="space-y-6">
      {/* Detail Navigation Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{borehole.boreholeCode}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                {borehole.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pit: {borehole.pitName} | Target Depth: {borehole.plannedDepth}m | Actual: {borehole.actualDepth}m ({borehole.drillingType})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Validasi Geologis:</span>
          <span className="px-2 py-0.5 font-bold bg-emerald-500/10 text-emerald-400 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {borehole.validationStatus}
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: Layers },
          { id: "collar", label: "Collar & Koordinat", icon: MapPin },
          { id: "lithology", label: "Lithology Log", icon: Ruler },
          { id: "seam", label: "Seam Intersections", icon: Flame },
          { id: "samples", label: "Samples & Chain Custody", icon: FlaskConical },
          { id: "assays", label: "Assay Records", icon: FileText },
          { id: "quality", label: "Coal Quality", icon: Flame },
          { id: "photos", label: "Core Photos", icon: ImageIcon },
          { id: "qc", label: "QC Audit", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Spesifikasi Titik Bor
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Kontraktor</span>
                <span className="font-semibold text-white">{borehole.contractor}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rig Pengeboran</span>
                <span className="font-semibold text-white">{borehole.drillingRig}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tanggal Mulai</span>
                <span className="font-semibold text-white">{borehole.startDate}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tanggal Selesai</span>
                <span className="font-semibold text-white">{borehole.completionDate || "In Progress"}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] mb-1">Catatan Geologis:</span>
              <p className="text-slate-200 italic">{borehole.remarks}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Ringkasan Koordinat Collar & Seam
            </h3>
            {collar ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Easting (mE)</span>
                  <span className="font-mono font-bold text-emerald-400">{collar.easting}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Northing (mN)</span>
                  <span className="font-mono font-bold text-emerald-400">{collar.northing}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Elevasi (mRL)</span>
                  <span className="font-mono font-bold text-white">{collar.elevation} m</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Sistem Koordinat</span>
                  <span className="font-mono text-slate-200">{collar.coordinateSystem.epsg}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Data collar belum diinput.</p>
            )}
          </div>
        </div>
      )}

      {/* Lithology Tab */}
      {activeTab === "lithology" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Log Lithology Terdaftar ({lithologies.length} Interval)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2">From (m)</th>
                  <th className="px-3 py-2">To (m)</th>
                  <th className="px-3 py-2 text-right">Thickness (m)</th>
                  <th className="px-3 py-2">Lithology Name</th>
                  <th className="px-3 py-2">Deskripsi Detail</th>
                  <th className="px-3 py-2">Kekerasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lithologies.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2 font-mono text-slate-400">{l.fromDepth}</td>
                    <td className="px-3 py-2 font-mono text-slate-400">{l.toDepth}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-emerald-400">{l.thickness}m</td>
                    <td className="px-3 py-2 font-bold text-white">
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: l.lithologyCode === "COAL" ? "#10b981" : "#38bdf8" }}></span>
                      {l.lithologyName}
                    </td>
                    <td className="px-3 py-2 text-slate-300">{l.description}</td>
                    <td className="px-3 py-2 font-mono text-xs">{l.hardness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Core Photos Tab */}
      {activeTab === "photos" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Foto Core Box Pengeboran</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corePhotos.map((photo) => (
              <div key={photo.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <img src={photo.imageUrl} alt={photo.caption} className="w-full h-48 object-cover" />
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>Box #{photo.boxNumber}</span>
                    <span>{photo.fromDepth}m - {photo.toDepth}m</span>
                  </div>
                  <p className="text-xs text-slate-300">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
