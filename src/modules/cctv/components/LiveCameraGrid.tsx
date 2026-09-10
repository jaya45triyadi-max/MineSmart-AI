// MINE SMART AI - Live AI CCTV Camera Grid & Vision Player Component

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Expand,
  Eye,
  EyeOff,
  Flame,
  HardHat,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Move,
  Radio,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Thermometer,
  Truck,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from "lucide-react";
import { CameraFeed, BoundingBox, VisionDetectionCategory } from "../../../types/cctvTypes";

interface LiveCameraGridProps {
  cameras: CameraFeed[];
  selectedCamera: CameraFeed;
  onSelectCamera: (cam: CameraFeed) => void;
  onTriggerInspection: (cam: CameraFeed) => void;
  onOpenSandboxForCamera: (cam: CameraFeed) => void;
}

export const LiveCameraGrid: React.FC<LiveCameraGridProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  onTriggerInspection,
  onOpenSandboxForCamera,
}) => {
  const [gridLayout, setGridLayout] = useState<"1x1" | "2x2" | "3x2">("2x2");
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showThermal, setShowThermal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [ptzDirection, setPtzDirection] = useState<string | null>(null);

  const displayedCameras =
    gridLayout === "1x1"
      ? [selectedCamera]
      : gridLayout === "2x2"
      ? cameras.slice(0, 4)
      : cameras;

  const handlePtzAction = (dir: string) => {
    setPtzDirection(dir);
    setTimeout(() => setPtzDirection(null), 600);
  };

  const renderBoundingBox = (box: BoundingBox, cam: CameraFeed) => {
    if (!showOverlays) return null;
    if (filterCategory !== "ALL" && box.category !== filterCategory) return null;

    const isViolation = box.isViolation;
    const isCritical = box.category === "unsafe_interaction" || box.category === "smoke_fire" || box.category === "restricted_area";

    let borderColor = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
    if (isViolation) {
      borderColor = isCritical
        ? "border-rose-500 bg-rose-500/20 text-rose-200 animate-pulse ring-2 ring-rose-500/60"
        : "border-amber-500 bg-amber-500/20 text-amber-200";
    } else if (box.category === "vehicle") {
      borderColor = "border-cyan-400 bg-cyan-500/10 text-cyan-200";
    }

    return (
      <div
        key={box.id}
        className={`absolute border-2 rounded transition-all duration-300 pointer-events-none flex flex-col justify-between p-0.5 ${borderColor}`}
        style={{
          left: `${box.x}%`,
          top: `${box.y}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
        }}
      >
        {/* Label Tag */}
        <div className="flex items-center gap-1 bg-slate-950/90 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight shadow-md self-start border border-slate-750 max-w-[140%] truncate">
          {isViolation ? (
            <AlertTriangle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{box.label}</span>
          <span className="text-slate-400 text-[8px]">{(box.confidence * 100).toFixed(0)}%</span>
        </div>

        {/* Bottom Distance / Thermal Badge if available */}
        {box.attributes?.distanceToNearestVehicleM !== undefined && (
          <div className="bg-rose-950/90 text-rose-300 border border-rose-600 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold self-end shadow-md">
            ⚠️ Dist: {box.attributes.distanceToNearestVehicleM}m
          </div>
        )}

        {box.attributes?.thermalTempC !== undefined && (
          <div className="bg-orange-950/90 text-orange-300 border border-orange-600 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold self-end shadow-md animate-pulse">
            🔥 Temp: {box.attributes.thermalTempC}°C
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
        {/* Grid Layout Switches */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <span className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">
            Layout:
          </span>
          {(["1x1", "2x2", "3x2"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setGridLayout(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                gridLayout === mode
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* 8-Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { key: "ALL", label: "All 8 Classes" },
            { key: "helmet", label: "Hardhat/Helmet" },
            { key: "vest", label: "Reflective Vest" },
            { key: "person", label: "Person" },
            { key: "vehicle", label: "Vehicles" },
            { key: "restricted_area", label: "Restricted Zones" },
            { key: "unsafe_interaction", label: "Unsafe Proximity" },
            { key: "smoke_fire", label: "Smoke / Fire" },
          ].map((filt) => (
            <button
              key={filt.key}
              onClick={() => setFilterCategory(filt.key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
                filterCategory === filt.key
                  ? "bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold"
                  : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>

        {/* Overlay Switches */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
              showOverlays
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/50"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>AI Boxes</span>
          </button>

          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
              showZones
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/50"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Geofence</span>
          </button>

          <button
            onClick={() => setShowThermal(!showThermal)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
              showThermal
                ? "bg-orange-600/30 text-orange-300 border-orange-500/50"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Thermal IR</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div
        className={`grid gap-4 ${
          gridLayout === "1x1"
            ? "grid-cols-1"
            : gridLayout === "2x2"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {displayedCameras.map((cam) => {
          const isSelected = selectedCamera.id === cam.id;
          const hasViolations = cam.activeViolationsCount > 0;

          return (
            <div
              key={cam.id}
              onClick={() => onSelectCamera(cam)}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 relative bg-slate-900/95 shadow-xl flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-950/50"
                  : hasViolations
                  ? "border-rose-800/80 hover:border-rose-600"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Camera Header Overlay */}
              <div className="p-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs font-mono">{cam.code}</span>
                      <span className="text-xs text-slate-300 font-semibold">{cam.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {cam.location} • {cam.resolution} @ {cam.fps}fps
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasViolations ? (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      {cam.activeViolationsCount} Alert
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      PPE 100% OK
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSandboxForCamera(cam);
                    }}
                    title="Inject AI Anomaly Test"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 text-xs transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerInspection(cam);
                    }}
                    title="AI Deep Forensic Inspect"
                    className="p-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Feed Simulation Viewport */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
                {/* Visual Background Theme based on Zone */}
                <div
                  className={`absolute inset-0 opacity-40 mix-blend-overlay ${
                    showThermal
                      ? "bg-gradient-to-t from-purple-900 via-rose-900 to-amber-700 opacity-70"
                      : "bg-slate-900"
                  }`}
                ></div>

                {/* Grid guidelines & Crosshair */}
                <div className="absolute inset-0 opacity-15 pointer-events-none grid grid-cols-6 grid-rows-4 divide-x divide-y divide-emerald-500">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i}></div>
                  ))}
                </div>

                {/* Virtual Geofence Restricted Zones Polygon rendering */}
                {showZones &&
                  cam.virtualRestrictedZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="absolute border-2 border-dashed border-rose-500/70 bg-rose-500/10 rounded-xl pointer-events-none"
                      style={{
                        left: `${zone.polygonPoints[0].x}%`,
                        top: `${zone.polygonPoints[0].y}%`,
                        width: `${zone.polygonPoints[1].x - zone.polygonPoints[0].x}%`,
                        height: `${zone.polygonPoints[2].y - zone.polygonPoints[0].y}%`,
                      }}
                    >
                      <span className="bg-rose-950/90 text-rose-300 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-rose-700 m-1 inline-block">
                        ⛔ {zone.name}
                      </span>
                    </div>
                  ))}

                {/* Proximity line between worker & moving truck in CAM-01 */}
                {cam.code === "CAM-01" && showOverlays && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <line
                      x1="38%"
                      y1="70%"
                      x2="23%"
                      y2="66%"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                    <text
                      x="30%"
                      y="65%"
                      fill="#f43f5e"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ⚠️ 4.8m PROXIMITY HAZARD
                    </text>
                  </svg>
                )}

                {/* Render All Detected Bounding Boxes */}
                {cam.activeDetections.map((box) => renderBoundingBox(box, cam))}

                {/* Live Camera Watermark & Edge Stats HUD */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-bold text-white">REC</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  <span className="text-emerald-400 font-bold">{cam.edgeAiGateway.inferenceLatencyMs} ms</span>
                  <span className="text-slate-500">|</span>
                  <span>{cam.edgeAiGateway.npuLoadPct}% NPU</span>
                </div>

                {/* PTZ Feedback Toast if active */}
                {ptzDirection && isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-indigo-900/80 border border-indigo-400 text-white text-xs font-bold font-mono px-3 py-1.5 rounded-xl shadow-2xl animate-in zoom-in">
                      PTZ ACTIVE: {ptzDirection}
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Footer & PTZ Quick Controls */}
              <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                {/* Object Count Tags */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>{cam.peopleCount}</strong> Person
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-indigo-400" />
                    <strong>{cam.vehicleCount}</strong> Equipment
                  </span>
                </div>

                {/* PTZ Mini Joystick */}
                {cam.ptzSupport && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzAction("PAN LEFT");
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzAction("TILT UP");
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzAction("TILT DOWN");
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzAction("PAN RIGHT");
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                    >
                      ▶
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzAction("ZOOM 2X");
                      }}
                      className="px-1.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[9px] font-mono font-bold"
                    >
                      2X
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
