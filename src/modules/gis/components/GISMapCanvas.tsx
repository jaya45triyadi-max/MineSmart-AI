// MINE SMART AI - Interactive GIS Map Canvas Component
// Menampilkan Canvas Peta Leaflet, 8 Tool Overlays, dan Simulasi Live Fleet GPS

import React, { useEffect, useRef, useState } from "react";
import {
  Compass,
  Ruler,
  Layers,
  MapPin,
  TrendingUp,
  Box,
  Circle,
  Activity,
  Copy,
  Check,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  BasemapType,
  SpatialEntity,
  LatLng,
  MeasurementMode,
  MeasurementResult,
  GISLayer,
} from "../types/gisTypes";
import { GISMapEngine } from "../../../services/gis/GISMapEngine";
import { GISService } from "../../../services/gis/GISService";

interface GISMapCanvasProps {
  basemap: BasemapType;
  layers: GISLayer[];
  entities: SpatialEntity[];
  measurementMode: MeasurementMode;
  bufferRadius: number;
  onObjectSelect: (entity: SpatialEntity) => void;
  onMeasurementUpdate: (result: MeasurementResult) => void;
  onClearMeasurement: () => void;
}

export const GISMapCanvas: React.FC<GISMapCanvasProps> = ({
  basemap,
  layers,
  entities,
  measurementMode,
  bufferRadius,
  onObjectSelect,
  onMeasurementUpdate,
  onClearMeasurement,
}) => {
  const containerId = "mine-smart-gis-map-container";
  const engineRef = useRef<GISMapEngine | null>(null);

  const [hoverCoords, setHoverCoords] = useState<LatLng>({
    lat: -0.4921,
    lng: 117.142,
    elevation: 35.0,
  });

  const [activeMeasurement, setActiveMeasurement] = useState<MeasurementResult>({
    mode: "NONE",
    points: [],
  });

  const [copiedCoord, setCopiedCoord] = useState(false);

  // Initialize Map Engine
  useEffect(() => {
    const engine = new GISMapEngine({
      containerId,
      initialCenter: { lat: -0.488, lng: 117.135 },
      initialZoom: 14,
      basemap,
      onMouseMove: (latLng) => setHoverCoords(latLng),
      onObjectClick: (entity) => onObjectSelect(entity),
      onMapClick: (latLng) => {
        if (measurementMode !== "NONE" && engineRef.current) {
          const result = engineRef.current.addMeasurementPoint(latLng);
          setActiveMeasurement(result);
          onMeasurementUpdate(result);
        }
      },
    });

    engine.initialize();
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update Basemap
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setBasemap(basemap);
    }
  }, [basemap]);

  // Update Buffer Radius in engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setBufferRadius(bufferRadius);
    }
  }, [bufferRadius]);

  // Update Rendered Entities & Layers
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.renderEntities(entities, layers);
    }
  }, [entities, layers]);

  // Handle Measurement Mode Change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setMeasurementMode(measurementMode);
      setActiveMeasurement({ mode: measurementMode, points: [] });
    }
  }, [measurementMode]);

  const utmString = GISService.convertToUTM(
    hoverCoords.lat,
    hoverCoords.lng,
    hoverCoords.elevation || 35.0
  );

  const handleCopyHoverCoord = () => {
    navigator.clipboard.writeText(
      `Lat: ${hoverCoords.lat.toFixed(6)}, Lng: ${hoverCoords.lng.toFixed(6)} | UTM: ${utmString}`
    );
    setCopiedCoord(true);
    setTimeout(() => setCopiedCoord(false), 2000);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#070D18] overflow-hidden shadow-lg flex flex-col justify-between">
      {/* Map Leaflet Container */}
      <div id={containerId} className="absolute inset-0 z-0 w-full h-full" />

      {/* Floating Top-Left: North Arrow & Geodetic Datum */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-2 text-white shadow-lg backdrop-blur-md pointer-events-auto">
          <Compass className="h-5 w-5 text-teal-400 animate-spin-slow" />
          <div className="text-[10px] font-bold tracking-wider">
            <div className="text-white">UTM ZONE 50S</div>
            <div className="text-teal-400">WGS84 / DGN95 DATUM</div>
          </div>
        </div>
      </div>

      {/* Floating Top-Right: Active Measurement & Tool Results Overlay */}
      {measurementMode !== "NONE" && (
        <div className="absolute top-3 right-3 z-10 rounded-2xl bg-slate-900/95 border border-teal-500/50 p-3.5 text-white shadow-2xl backdrop-blur-md max-w-sm w-80 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              {measurementMode === "DISTANCE" && <Ruler className="h-4 w-4 text-sky-400" />}
              {measurementMode === "AREA" && <Layers className="h-4 w-4 text-emerald-400" />}
              {measurementMode === "ELEVATION" && <TrendingUp className="h-4 w-4 text-amber-400" />}
              {measurementMode === "COORDINATE" && <MapPin className="h-4 w-4 text-cyan-400" />}
              {measurementMode === "VOLUME" && <Box className="h-4 w-4 text-purple-400" />}
              {measurementMode === "POLYGON" && <Activity className="h-4 w-4 text-teal-400" />}
              {measurementMode === "BUFFER" && <Circle className="h-4 w-4 text-red-400" />}
              Tool: {measurementMode}
            </span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
              {activeMeasurement.points.length} Titik Klik
            </span>
          </div>

          {/* 1. Distance Result */}
          {measurementMode === "DISTANCE" && (
            <div className="space-y-1">
              <div className="text-base font-black text-sky-300 font-mono">
                {(activeMeasurement.distanceMeters || 0).toLocaleString()} Meter
              </div>
              <div className="text-xs text-slate-400 font-mono">
                = {((activeMeasurement.distanceMeters || 0) / 1000).toFixed(3)} km (Hauling Route)
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Klik peta beberapa kali untuk menambah titik belokan jalan tambang.
              </p>
            </div>
          )}

          {/* 2. Area Result */}
          {(measurementMode === "AREA" || measurementMode === "POLYGON") && (
            <div className="space-y-1">
              <div className="text-base font-black text-emerald-300 font-mono">
                {activeMeasurement.areaHectares || 0} Hektar (Ha)
              </div>
              <div className="text-xs text-slate-300 font-mono">
                {(activeMeasurement.areaSquareMeters || 0).toLocaleString()} m²
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Keliling Boundary: {(activeMeasurement.perimeterMeters || 0).toLocaleString()} m
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Klik minimal 3 titik di peta untuk menutup poligon luasan.
              </p>
            </div>
          )}

          {/* 3. Elevation Result */}
          {measurementMode === "ELEVATION" && activeMeasurement.elevationProfile && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-1.5 rounded bg-slate-800/80">
                  <span className="text-slate-400 block text-[9px]">Titik Awal RL:</span>
                  <span className="font-bold text-amber-300">
                    RL +{activeMeasurement.elevationProfile.startElevationRL}m
                  </span>
                </div>
                <div className="p-1.5 rounded bg-slate-800/80">
                  <span className="text-slate-400 block text-[9px]">Titik Akhir RL:</span>
                  <span className="font-bold text-amber-300">
                    RL +{activeMeasurement.elevationProfile.endElevationRL}m
                  </span>
                </div>
              </div>
              <div className="text-xs font-mono text-white flex justify-between">
                <span>Beda Tinggi (Delta Z):</span>
                <span className="font-bold text-emerald-400">
                  {activeMeasurement.elevationProfile.elevationDelta > 0 ? "+" : ""}
                  {activeMeasurement.elevationProfile.elevationDelta} m
                </span>
              </div>
              <div className="text-xs font-mono text-white flex justify-between">
                <span>Kemiringan Grade:</span>
                <span className="font-bold text-amber-400">
                  {activeMeasurement.elevationProfile.slopePercent}% (
                  {Math.abs(activeMeasurement.elevationProfile.slopePercent) <= 8 ? "Aman Standar Hauling" : "Curam > 8%"})
                </span>
              </div>
            </div>
          )}

          {/* 4. Coordinate Result */}
          {measurementMode === "COORDINATE" && activeMeasurement.coordinateDetail && (
            <div className="space-y-1 text-xs font-mono">
              <div className="p-1.5 rounded bg-slate-800/80">
                <span className="text-slate-400 text-[10px] block">UTM Zone 50S:</span>
                <span className="font-bold text-cyan-300">
                  {activeMeasurement.coordinateDetail.eastingNorthing}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                WGS84: {activeMeasurement.coordinateDetail.wgs84.lat.toFixed(6)},{" "}
                {activeMeasurement.coordinateDetail.wgs84.lng.toFixed(6)}
              </div>
            </div>
          )}

          {/* 5. Volume Result */}
          {measurementMode === "VOLUME" && activeMeasurement.volumeEstimate && (
            <div className="space-y-1 font-mono text-xs">
              <div className="text-sm font-black text-purple-300">
                Net Volume: {activeMeasurement.volumeEstimate.netVolumeBCM.toLocaleString()} BCM
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className="text-slate-400">Cut OB: {activeMeasurement.volumeEstimate.cutVolumeBCM.toLocaleString()} BCM</span>
                <span className="text-slate-400">Fill: {activeMeasurement.volumeEstimate.fillVolumeBCM.toLocaleString()} BCM</span>
              </div>
              <div className="text-[10px] text-teal-400">
                Estimasi Batubara: {(activeMeasurement.volumeEstimate.netVolumeBCM * 1.3).toLocaleString()} Ton
              </div>
            </div>
          )}

          {/* 6. Buffer Result */}
          {measurementMode === "BUFFER" && (
            <div className="space-y-1 text-xs font-mono">
              <div className="text-sm font-black text-rose-400">
                Radius Zona Bahaya: {bufferRadius} Meter
              </div>
              <div className="text-[11px] text-slate-300">
                Luas Area Buffer: {((Math.PI * Math.pow(bufferRadius, 2)) / 10000).toFixed(2)} Ha
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Batas aman evakuasi alat & pekerja peledakan blasting tambang.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (engineRef.current) {
                  engineRef.current.clearMeasurement();
                }
                setActiveMeasurement({ mode: measurementMode, points: [] });
                onClearMeasurement();
              }}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset Ukur
            </button>
            <span className="text-[10px] text-slate-500">Klik di peta untuk menambah titik</span>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD: Real-time Cursor Coordinates & Crosshair */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-white shadow-lg backdrop-blur-md text-xs font-mono pointer-events-auto">
          <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
          <span className="text-slate-300 truncate">{utmString}</span>
          <button
            onClick={handleCopyHoverCoord}
            className="ml-1 p-1 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
            title="Salin Koordinat Cursor"
          >
            {copiedCoord ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-white shadow-lg backdrop-blur-md text-[11px] font-bold pointer-events-auto">
          <Truck className="h-4 w-4 text-pink-400" />
          <span className="text-slate-300">
            {entities.filter((e) => e.type === "EQUIPMENT").length} Unit Armada GPS Terdeteksi
          </span>
        </div>
      </div>
    </div>
  );
};
