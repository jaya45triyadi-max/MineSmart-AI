// MINE SMART AI - 3D-Style Interactive Mine Visualization Widget
// Concept: Luxury Enterprise 3D Isometric Pit Topology, Active Fleet Nodes, Cut & Fill Visualizer

import React, { useState, useEffect } from "react";
import {
  Layers,
  Eye,
  Compass,
  Maximize2,
  Minimize2,
  Truck,
  Pickaxe,
  Activity,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Navigation,
  Info,
  Radio,
  Sliders,
} from "lucide-react";

interface Mine3DVisualizationWidgetProps {
  onNavigateModule?: (moduleKey: any) => void;
  onOpenAICopilot?: () => void;
}

type ViewMode = "ISOMETRIC_3D" | "TOP_DOWN" | "CROSS_SECTION" | "HAUL_PROFILE";

interface MiningNode {
  id: string;
  name: string;
  type: "EXCAVATOR" | "HAUL_TRUCK" | "CRUSHER" | "SUMP" | "BLASTING";
  benchRL: string;
  status: "ACTIVE" | "HAULING" | "STANDBY" | "ALERT";
  x: number; // percentage
  y: number; // percentage
  details: string;
  telemetry: {
    productionRate?: string;
    speed?: string;
    payload?: string;
    waterLevel?: string;
  };
}

const MINING_NODES: MiningNode[] = [
  {
    id: "NODE-EX01",
    name: "Excavator PC2000 #01",
    type: "EXCAVATOR",
    benchRL: "RL +40m (Seam B)",
    status: "ACTIVE",
    x: 32,
    y: 46,
    details: "Loading Batubara High-GAR Seam B ke DT-405",
    telemetry: { productionRate: "820 Ton/Hr", payload: "100% Target" },
  },
  {
    id: "NODE-EX02",
    name: "Excavator CAT 6020B #04",
    type: "EXCAVATOR",
    benchRL: "RL +80m (OB Front)",
    status: "ACTIVE",
    x: 64,
    y: 28,
    details: "Stripping Overburden Hard Rock Layer 3",
    telemetry: { productionRate: "1,150 BCM/Hr", payload: "94% Eff" },
  },
  {
    id: "NODE-DT01",
    name: "HD 785-7 (DT-405)",
    type: "HAUL_TRUCK",
    benchRL: "Ramp Pit 01",
    status: "HAULING",
    x: 48,
    y: 58,
    details: "Hauling Batubara Menuju ROM Crusher",
    telemetry: { speed: "26.4 km/h", payload: "98.5 Ton (Full)" },
  },
  {
    id: "NODE-DT02",
    name: "HD 785-7 (DT-412)",
    type: "HAUL_TRUCK",
    benchRL: "Ramp Disposal North",
    status: "HAULING",
    x: 78,
    y: 38,
    details: "Hauling OB Menuju Disposal Area 02",
    telemetry: { speed: "22.1 km/h", payload: "92.0 Ton (OB)" },
  },
  {
    id: "NODE-CRUSH",
    name: "Primary Crusher Station 01",
    type: "CRUSHER",
    benchRL: "Surface RL +120m",
    status: "ACTIVE",
    x: 18,
    y: 22,
    details: "Crushing Rate Batubara Size -50mm",
    telemetry: { productionRate: "1,850 TPH", payload: "Vibration Normal" },
  },
  {
    id: "NODE-SUMP",
    name: "Sump Dewatering Pump #02",
    type: "SUMP",
    benchRL: "Pit Bottom RL -40m",
    status: "ACTIVE",
    x: 45,
    y: 82,
    details: "Dewatering Turbidity Pump 250 L/s",
    telemetry: { waterLevel: "Level -38.2m RL (Safe)", productionRate: "250 L/s" },
  },
  {
    id: "NODE-BLAST",
    name: "Blast Pattern Area B-14",
    type: "BLASTING",
    benchRL: "RL +100m West",
    status: "ALERT",
    x: 82,
    y: 72,
    details: "Pola Peledakan 45 Lubang - Siaga Evakuasi 14:00",
    telemetry: { payload: "12.5 Ton ANFO Loaded" },
  },
];

export const Mine3DVisualizationWidget: React.FC<Mine3DVisualizationWidgetProps> = ({
  onNavigateModule,
  onOpenAICopilot,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("ISOMETRIC_3D");
  const [selectedNode, setSelectedNode] = useState<MiningNode | null>(MINING_NODES[0]);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [benchElevationFilter, setBenchElevationFilter] = useState<string>("ALL");
  const [showWireframe, setShowWireframe] = useState(true);
  const [activeHaulPath, setActiveHaulPath] = useState(true);

  // Auto slow rotation simulation if toggled
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0A142F]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4 luxury-card-glow overflow-hidden relative">
      {/* Ambient Lighting Backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar with 3D Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 font-black">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                3D Pit Digital Twin & Spatial Topology
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live 3D Twin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visualisasi elevasi teras tambang (RL benches), pergerakan armada, dan kontur geologi real-time
            </p>
          </div>
        </div>

        {/* View Perspective Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode("ISOMETRIC_3D")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "ISOMETRIC_3D"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Isometric</span>
          </button>

          <button
            onClick={() => setViewMode("TOP_DOWN")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "TOP_DOWN"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Top-Down Aerial</span>
          </button>

          <button
            onClick={() => setViewMode("CROSS_SECTION")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "CROSS_SECTION"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Section</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isRotating
                ? "bg-amber-500/20 text-amber-500 border-amber-500/40"
                : "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-white"
            }`}
            title="Auto-Rotate 3D Scene"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3D Visualizer Canvas & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        {/* Main 3D Canvas Viewport */}
        <div className="lg:col-span-8 relative h-80 sm:h-96 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-b from-slate-950 via-[#071128] to-[#040A1A] overflow-hidden isometric-grid">
          {/* Elevation Depth Contour Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
            <defs>
              <linearGradient id="benchGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="benchGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0891B2" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="seamCoalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="sumpGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Iso Bench Layer 1: Surface & Highwall (RL +120m) */}
            <polygon
              points="40,30 280,20 480,45 680,30 760,110 640,160 380,140 80,120"
              fill="url(#benchGrad1)"
              stroke="#10B981"
              strokeWidth={showWireframe ? "1.5" : "0"}
              strokeDasharray="4 2"
              className="transition-all duration-700"
            />

            {/* Iso Bench Layer 2: OB Stripping Bench (RL +80m) */}
            <polygon
              points="100,100 340,90 580,110 680,170 540,210 260,190 90,160"
              fill="url(#benchGrad2)"
              stroke="#06B6D4"
              strokeWidth={showWireframe ? "1.5" : "0"}
              className="transition-all duration-700"
            />

            {/* Iso Bench Layer 3: Seam B Coal Exposed (RL +40m) */}
            <polygon
              points="140,150 380,140 520,160 590,210 460,250 200,230 130,190"
              fill="url(#seamCoalGrad)"
              stroke="#F59E0B"
              strokeWidth="2"
              className="transition-all duration-700"
            />

            {/* Iso Bench Layer 4: Pit Sump Water (RL -40m) */}
            <polygon
              points="220,220 380,210 480,230 420,280 260,285 200,250"
              fill="url(#sumpGrad)"
              stroke="#3B82F6"
              strokeWidth="2"
            />

            {/* Haul Ramp Main 3D Trajectory Path */}
            {activeHaulPath && (
              <path
                d="M 120,40 Q 240,130 360,160 T 520,240 T 700,120"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse opacity-80"
              />
            )}
          </svg>

          {/* Interactive 3D Nodes Placed on Topology */}
          {MINING_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Ping Beacon Effect */}
                <div
                  className={`absolute -inset-2 rounded-full animate-beacon opacity-75 ${
                    node.type === "EXCAVATOR"
                      ? "bg-emerald-500"
                      : node.type === "HAUL_TRUCK"
                      ? "bg-cyan-500"
                      : node.type === "BLASTING"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                  }`}
                />

                {/* Node Pin Marker */}
                <div
                  className={`p-2 rounded-xl border shadow-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 scale-125 ring-4 ring-emerald-500/30 border-white"
                      : "bg-slate-900/90 text-white border-slate-700 hover:scale-110 hover:border-emerald-400"
                  }`}
                >
                  {node.type === "EXCAVATOR" && <Pickaxe className="w-4 h-4" />}
                  {node.type === "HAUL_TRUCK" && <Truck className="w-4 h-4" />}
                  {node.type === "CRUSHER" && <Flame className="w-4 h-4" />}
                  {node.type === "SUMP" && <Activity className="w-4 h-4" />}
                  {node.type === "BLASTING" && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>

                {/* Node Mini Label Tag */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 opacity-100"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 opacity-80 group-hover:opacity-100"
                  }`}
                >
                  {node.name.split(" ")[0]}
                </div>
              </div>
            );
          })}

          {/* 3D Viewport HUD Overlay Bar */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Navigation className="w-3 h-3 rotate-45" /> Azimuth: 142° SE
            </span>
            <span className="text-slate-600">|</span>
            <span>Pitch: -28°</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">RL Zoom: 1:1,250</span>
          </div>

          {/* Legend Bench Heights */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1">
            <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1">
              Elevasi Jenjang (Bench RL)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" />
              <span className="text-slate-300">RL +120m (Highwall Surface)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500/80" />
              <span className="text-slate-300">RL +80m (OB Stripping)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/80" />
              <span className="text-slate-300">RL +40m (Batubara Seam B)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500/80" />
              <span className="text-slate-300">RL -40m (Sump Bottom)</span>
            </div>
          </div>
        </div>

        {/* Node Telemetry & Cut-Fill Spatial Analytics Panel */}
        <div className="lg:col-span-4 space-y-3">
          {/* Selected Node Details Card */}
          {selectedNode && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] font-mono border border-emerald-500/30">
                  {selectedNode.type} &bull; {selectedNode.benchRL}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-black text-white">{selectedNode.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedNode.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                {selectedNode.telemetry.productionRate && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Rate Produksi:</span>
                    <span className="font-mono text-emerald-300 font-bold text-xs">
                      {selectedNode.telemetry.productionRate}
                    </span>
                  </div>
                )}
                {selectedNode.telemetry.payload && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Status Muatan:</span>
                    <span className="font-mono text-amber-300 font-bold text-xs">
                      {selectedNode.telemetry.payload}
                    </span>
                  </div>
                )}
                {selectedNode.telemetry.speed && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Kecepatan:</span>
                    <span className="font-mono text-cyan-300 font-bold text-xs">
                      {selectedNode.telemetry.speed}
                    </span>
                  </div>
                )}
                {selectedNode.telemetry.waterLevel && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Water Level:</span>
                    <span className="font-mono text-blue-300 font-bold text-xs">
                      {selectedNode.telemetry.waterLevel}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (onNavigateModule) {
                    if (selectedNode.type === "EXCAVATOR" || selectedNode.type === "HAUL_TRUCK") {
                      onNavigateModule("dispatch");
                    } else if (selectedNode.type === "CRUSHER") {
                      onNavigateModule("crusher");
                    } else if (selectedNode.type === "SUMP") {
                      onNavigateModule("environment");
                    } else {
                      onNavigateModule("mine-planning");
                    }
                  }
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Buka Detail Telemetri Unit</span>
              </button>
            </div>
          )}

          {/* Spatial Cut & Fill Live Ledger */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Progress Cut & Fill Hari Ini</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">98.4% Acc</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Cut Excavation (OB+Coal):</span>
                <span className="font-mono font-bold text-emerald-400">45,280 BCM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Fill Backfill Disposal:</span>
                <span className="font-mono font-bold text-cyan-400">38,120 BCM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Void Pit Sisa Kapasitas:</span>
                <span className="font-mono font-bold text-amber-400">8.42M BCM</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Sensor: Drone LiDAR + RTK GPS</span>
              <span className="text-emerald-400 font-bold">Real-time Slicing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
