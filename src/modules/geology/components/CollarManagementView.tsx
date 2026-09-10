// MINE SMART AI - Collar Management & Coordinate System Validation

import React, { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Globe,
  Plus,
  Edit2,
  Save,
  RotateCcw,
} from "lucide-react";
import { Collar, ValidationStatus } from "../../../types/geologyTypes";

interface CollarManagementViewProps {
  collars: Collar[];
  onUpdateCollar: (updatedCollar: Collar) => void;
}

export const CollarManagementView: React.FC<CollarManagementViewProps> = ({
  collars,
  onUpdateCollar,
}) => {
  const [selectedCollar, setSelectedCollar] = useState<Collar | null>(collars[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for editing
  const [easting, setEasting] = useState(selectedCollar?.easting || 0);
  const [northing, setNorthing] = useState(selectedCollar?.northing || 0);
  const [elevation, setElevation] = useState(selectedCollar?.elevation || 0);
  const [azimuth, setAzimuth] = useState(selectedCollar?.azimuth || 0);
  const [dip, setDip] = useState(selectedCollar?.dip || -90);
  const [epsg, setEpsg] = useState(selectedCollar?.coordinateSystem.epsg || "EPSG:32750");

  const handleSelectCollar = (c: Collar) => {
    setSelectedCollar(c);
    setEasting(c.easting);
    setNorthing(c.northing);
    setElevation(c.elevation);
    setAzimuth(c.azimuth);
    setDip(c.dip);
    setEpsg(c.coordinateSystem.epsg);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedCollar) return;
    const updated: Collar = {
      ...selectedCollar,
      easting: Number(easting),
      northing: Number(northing),
      elevation: Number(elevation),
      azimuth: Number(azimuth),
      dip: Number(dip),
      coordinateSystem: {
        ...selectedCollar.coordinateSystem,
        epsg,
      },
      validationStatus: "VALID",
      updatedAt: new Date().toISOString(),
    };
    onUpdateCollar(updated);
    setSelectedCollar(updated);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left List of Collars */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Daftar Collar Titik Bor
          </span>
          <span className="text-xs text-slate-400 font-mono">{collars.length} Recorded</span>
        </h3>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {collars.map((c) => {
            const isSelected = selectedCollar?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectCollar(c)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.boreholeCode}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      c.validationStatus === "VALID"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {c.validationStatus}
                  </span>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-400 grid grid-cols-2 gap-1">
                  <span>mE: {c.easting}</span>
                  <span>mN: {c.northing}</span>
                  <span>Elev: {c.elevation}m</span>
                  <span>EPSG: {c.coordinateSystem.epsg.split(":")[1] || c.coordinateSystem.epsg}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail / Edit Form */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-6">
        {selectedCollar ? (
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Detail Koordinat Collar: {selectedCollar.boreholeCode}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Survei Terakhir: {selectedCollar.surveyDate} ({selectedCollar.surveyMethod})
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Koordinat</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              )}
            </div>

            {/* Validation Alert Box */}
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">Status Validasi Koordinat: Lolos QC Survei</span>
                <span className="text-slate-300">
                  Koordinat berada di dalam batas izin konsesi tambang Pit 1 South dengan akurasi RTK GPS &lt; 0.05 meter.
                </span>
              </div>
            </div>

            {/* Coordinates Grid Form */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Easting (mE)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={easting}
                    onChange={(e) => setEasting(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-emerald-400"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-emerald-400">{selectedCollar.easting}</span>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Northing (mN)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={northing}
                    onChange={(e) => setNorthing(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-emerald-400"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-emerald-400">{selectedCollar.northing}</span>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Elevasi Collar (mRL)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={elevation}
                    onChange={(e) => setElevation(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-white"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-white">{selectedCollar.elevation} m</span>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Azimuth (° Deg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={azimuth}
                    onChange={(e) => setAzimuth(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-white"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-white">{selectedCollar.azimuth}°</span>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dip Angle (° Deg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={dip}
                    onChange={(e) => setDip(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-white"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-white">{selectedCollar.dip}°</span>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sistem Proyeksi EPSG</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={epsg}
                    onChange={(e) => setEpsg(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-mono text-white"
                  />
                ) : (
                  <span className="text-sm font-bold font-mono text-slate-300">{selectedCollar.coordinateSystem.epsg}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Pilih collar untuk melihat detail.</p>
        )}
      </div>
    </div>
  );
};
