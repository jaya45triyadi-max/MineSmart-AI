// MINE SMART AI - Restricted Zone Geofence & Virtual Barrier Manager Component

import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Plus,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Video,
} from "lucide-react";
import { CameraFeed, VisionIncidentSeverity } from "../../../types/cctvTypes";

interface RestrictedZoneManagerProps {
  cameras: CameraFeed[];
  selectedCamera: CameraFeed;
  onSelectCamera: (cam: CameraFeed) => void;
  onAddZone: (cameraId: string, zone: any) => void;
}

export const RestrictedZoneManager: React.FC<RestrictedZoneManagerProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  onAddZone,
}) => {
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneType, setNewZoneType] = useState<
    "BLAST_DANGER" | "EXCAVATOR_SWING_RADIUS" | "HAUL_ROAD_LANE" | "HIGHWALL_DROP_EDGE" | "FUEL_DISPENSING_ZONE"
  >("EXCAVATOR_SWING_RADIUS");
  const [newSeverity, setNewSeverity] = useState<VisionIncidentSeverity>("CRITICAL");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    const newZone = {
      id: `ZONE-${Date.now()}`,
      name: newZoneName,
      polygonPoints: [
        { x: 25, y: 25 },
        { x: 75, y: 25 },
        { x: 75, y: 75 },
        { x: 25, y: 75 },
      ],
      zoneType: newZoneType,
      severityOnBreach: newSeverity,
    };

    onAddZone(selectedCamera.id, newZone);
    setNewZoneName("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Virtual Geofencing & Restricted Hazard Zones (ESDM K3)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Konfigurasi perimeter virtual bahaya pada feed CCTV AI (Radius Putar Excavator, Jalur Hauling, Tebing Kritis, Zona Peledakan).
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? "Cancel" : "Add Geofence Zone"}
        </button>
      </div>

      {/* Add Zone Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateZone}
          className="p-4 rounded-2xl bg-slate-850 border border-indigo-500/40 space-y-3 animate-in fade-in"
        >
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Buat Perimeter Virtual Baru untuk {selectedCamera.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nama Geofence</label>
              <input
                type="text"
                placeholder="Contoh: Zona Bahaya Hopper Crusher #02"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Tipe Bahaya Zona</label>
              <select
                value={newZoneType}
                onChange={(e: any) => setNewZoneType(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="EXCAVATOR_SWING_RADIUS">Radius Ayun Alat Berat (15m)</option>
                <option value="HAUL_ROAD_LANE">Jalur Hauling Aktif (No Pedestrian)</option>
                <option value="HIGHWALL_DROP_EDGE">Tepi Tebing Crest Highwall</option>
                <option value="BLAST_DANGER">Perimeter Peledakan (Blast Zone)</option>
                <option value="FUEL_DISPENSING_ZONE">Zona Dispenser BBM (No Spark)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Tingkat Bahaya Pelanggaran</label>
              <select
                value={newSeverity}
                onChange={(e: any) => setNewSeverity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="CRITICAL">CRITICAL (Alarm Sirine + Interlock)</option>
                <option value="HIGH">HIGH (Peringatan Radio KTT)</option>
                <option value="MEDIUM">MEDIUM (Notifikasi Visual Log)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-900/40"
            >
              Simpan Perimeter Geofence
            </button>
          </div>
        </form>
      )}

      {/* Cameras Geofence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cameras.map((cam) => (
          <div
            key={cam.id}
            onClick={() => onSelectCamera(cam)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-slate-900/90 ${
              selectedCamera.id === cam.id
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {cam.code} - {cam.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">{cam.location}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                {cam.virtualRestrictedZones.length} Geofence Aktif
              </span>
            </div>

            {/* List of Zones inside this Camera */}
            <div className="space-y-2">
              {cam.virtualRestrictedZones.length > 0 ? (
                cam.virtualRestrictedZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-750 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <div>
                        <div className="text-slate-200 font-bold">{zone.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Type: {zone.zoneType} • Points: {zone.polygonPoints.length} Vertex
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        zone.severityOnBreach === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {zone.severityOnBreach}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500 bg-slate-850/40 rounded-xl border border-dashed border-slate-800">
                  Belum ada perimeter geofence terpasang.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
