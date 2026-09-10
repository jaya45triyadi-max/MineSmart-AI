// MINE SMART AI - Survey Point Detail Modal

import React, { useState } from "react";
import {
  X,
  MapPin,
  Ruler,
  Globe,
  History,
  ShieldCheck,
  FileText,
  Layers,
  Edit3,
  CheckCircle2,
  Sparkles,
  Download,
} from "lucide-react";
import { SurveyPoint } from "../../../types/surveyTypes";

interface SurveyPointDetailModalProps {
  point: SurveyPoint | null;
  onClose: () => void;
  onValidatePoint: (id: string) => void;
  onOpenAIAnalyze: (ptCode: string) => void;
}

export const SurveyPointDetailModal: React.FC<SurveyPointDetailModalProps> = ({
  point,
  onClose,
  onValidatePoint,
  onOpenAIAnalyze,
}) => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Coordinate" | "Elevation" | "GIS" | "History" | "QC" | "Documents" | "Related Surface"
  >("Overview");

  if (!point) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 border border-sky-500/40 rounded-lg text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{point.pointCode}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                  {point.pointType}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    point.status === "Approved"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {point.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{point.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Controls */}
        <div className="flex items-center gap-1 border-b border-slate-800 px-4 bg-slate-950/50 overflow-x-auto">
          {[
            { id: "Overview", label: "Overview", icon: MapPin },
            { id: "Coordinate", label: "Coordinate", icon: Globe },
            { id: "Elevation", label: "Elevation", icon: Ruler },
            { id: "GIS", label: "GIS Spatial", icon: Globe },
            { id: "History", label: "History", icon: History },
            { id: "QC", label: "QC Audit", icon: ShieldCheck },
            { id: "Documents", label: "Documents", icon: FileText },
            { id: "Related Surface", label: "Surfaces", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-sky-500 text-sky-400 bg-sky-500/10"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Point ID & Code</span>
                <span className="font-bold text-white font-mono">{point.pointId} ({point.pointCode})</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Tanggal Survei</span>
                <span className="font-bold text-sky-400 font-mono">{point.surveyDate}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Metode Pengukuran</span>
                <span className="font-bold text-emerald-400">{point.surveyMethod}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Instrumen / Alat</span>
                <span className="font-bold text-purple-300">{point.instrument}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Akurasi Pengukuran</span>
                <span className="font-bold text-amber-300">{point.accuracy} (H: ±{point.horizontalAccuracy}m, V: ±{point.verticalAccuracy}m)</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Surveyor / Chieff</span>
                <span className="font-bold text-white">{point.surveyorName}</span>
              </div>
            </div>
          )}

          {activeTab === "Coordinate" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <h4 className="text-xs font-bold text-sky-400 uppercase font-sans">Koordinat Terapan (EPSG / UTM)</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Sistem Proyeksi</span>
                  <span className="text-white font-bold">{point.coordinateSystem}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Datum Geodesi</span>
                  <span className="text-white font-bold">WGS 84</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Easting (X)</span>
                  <span className="text-emerald-400 font-bold text-sm">{point.easting.toFixed(3)} m</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Northing (Y)</span>
                  <span className="text-emerald-400 font-bold text-sm">{point.northing.toFixed(3)} m</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Latitude (Φ)</span>
                  <span className="text-slate-300">{point.latitude ?? "-1.138240°"}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Longitude (λ)</span>
                  <span className="text-slate-300">{point.longitude ?? "117.371250°"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Elevation" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <h4 className="text-xs font-bold text-amber-300 uppercase font-sans">Elevasi & Profil Vertikal (Z)</h4>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-300 font-sans">Elevasi Z (Reduced Level)</span>
                <span className="text-xl font-bold text-amber-300">{point.elevation.toFixed(2)} m RL</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Tinggi diukur terhadap titik Benchmark Utama GCP-SGT-01 (125.450m RL).
              </p>
            </div>
          )}

          {activeTab === "QC" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">Status QC Point</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    point.status === "Approved" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {point.status}
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                {point.status === "Approved"
                  ? "Point ini telah melewati verifikasi toleransi elevasi dan dinyatakan valid untuk DTM Surface."
                  : "Point membutuhkan tinjauan Senior Surveyor karena elevasi melebihi ambang batas toleransi."}
              </p>
            </div>
          )}

          {/* Other tabs placeholder fallback */}
          {["GIS", "History", "Documents", "Related Surface"].includes(activeTab) && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
              Menampilkan data terintegrasi {activeTab} untuk point <strong className="text-white font-mono">{point.pointCode}</strong>.
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onOpenAIAnalyze(point.pointCode)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Analyze Point</span>
          </button>

          <div className="flex items-center gap-2">
            {point.status !== "Approved" && (
              <button
                onClick={() => onValidatePoint(point.id)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validasi Point</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
