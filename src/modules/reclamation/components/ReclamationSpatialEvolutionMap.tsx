import React, { useState, useEffect } from "react";
import {
  Layers,
  MapPin,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Maximize2,
  Trees,
  Mountain,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  Download,
  Info,
  Sun,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { DisturbedArea, ReclamationProject } from "../../../types/reclamationTypes";

interface Props {
  disturbedAreas: DisturbedArea[];
  projects: ReclamationProject[];
}

export type EvolutionStage = "BEFORE" | "MINING" | "RECLAMATION" | "REVEGETATION";

export const ReclamationSpatialEvolutionMap: React.FC<Props> = ({
  disturbedAreas,
  projects,
}) => {
  const [currentStage, setCurrentStage] = useState<EvolutionStage>("REVEGETATION");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2500);
  const [viewMode, setViewMode] = useState<"SINGLE" | "SPLIT_COMPARE" | "CROSS_SECTION">("SINGLE");
  const [compareStageLeft, setCompareStageLeft] = useState<EvolutionStage>("BEFORE");
  const [compareStageRight, setCompareStageRight] = useState<EvolutionStage>("REVEGETATION");
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [selectedBlockId, setSelectedBlockId] = useState<string>("BLK-ALPHA");
  const [activeLayers, setActiveLayers] = useState({
    topographyContours: true,
    ndviIndex: true,
    drainageLines: true,
    rmpPoints: true,
    satelliteOverlay: true,
  });

  const stages: {
    key: EvolutionStage;
    label: string;
    period: string;
    badge: string;
    color: string;
    border: string;
    bg: string;
    description: string;
    metrics: {
      canopyCover: string;
      disturbedArea: string;
      topsoilDepth: string;
      biodiversity: string;
      soilPh: string;
      slopeAngle: string;
    };
  }[] = [
    {
      key: "BEFORE",
      label: "1. Before (Rona Awal)",
      period: "Tahun 2018 (Pra-Penambangan)",
      badge: "Baseline Pristine Forest",
      color: "text-emerald-400",
      border: "border-emerald-500",
      bg: "from-emerald-950/80 to-teal-950/90",
      description:
        "Kondisi rona lingkungan awal sebelum bukaan tambang: Hutan sekunder rapat, keanekaragaman hayati tinggi (Shannon-Wiener H' 3.12), tutupan tajuk kanopi 92%, dan lapisan tanah pucuk (topsoil humus) alami tebal 60cm.",
      metrics: {
        canopyCover: "92.4%",
        disturbedArea: "0.0 Ha",
        topsoilDepth: "60 cm (Humus)",
        biodiversity: "H' 3.12 (Tinggi)",
        soilPh: "6.4 (Netral Alami)",
        slopeAngle: "12° - 15° (Alami)",
      },
    },
    {
      key: "MINING",
      label: "2. Mining (Bukaan Tambang)",
      period: "Tahun 2020 - 2023 (Operasi Aktif)",
      badge: "Active Pit & Waste Dump",
      color: "text-rose-400",
      border: "border-rose-500",
      bg: "from-rose-950/80 to-slate-950/90",
      description:
        "Fase penambangan aktif dan pengupasan overburden: Pembentukan open pit bench hingga kedalaman -45m RL, penimbunan waste dump disposal, saluran penyaliran sump pit, dan penyelamatan tanah pucuk (topsoil salvage).",
      metrics: {
        canopyCover: "0.0%",
        disturbedArea: "28.5 Ha",
        topsoilDepth: "0 cm (Disimpan di Stockpile)",
        biodiversity: "H' 0.20 (Minimal)",
        soilPh: "4.2 (Potensi AAT/PAF)",
        slopeAngle: "38° - 45° (Highwall)",
      },
    },
    {
      key: "RECLAMATION",
      label: "3. Reclamation (Penataan Lahan)",
      period: "Tahun 2024 - 2025 (Rekonstruksi)",
      badge: "Land Reshaping & Topsoil",
      color: "text-amber-400",
      border: "border-amber-500",
      bg: "from-amber-950/80 to-slate-950/90",
      description:
        "Penataan lahan pascatambang: Backfilling disposal, pelandaian lereng teras bangku menjadi <18°, konstruksi saluran drainase & drop structure, penebaran topsoil setebal 40cm, dan penaburan benih cover crop (LCC).",
      metrics: {
        canopyCover: "22.5% (Cover Crop)",
        disturbedArea: "14.2 Ha (Dalam Proses)",
        topsoilDepth: "40 - 45 cm (Disebar Merata)",
        biodiversity: "H' 1.45 (Perintisan)",
        soilPh: "5.8 (Pengapuran/Dolomit)",
        slopeAngle: "15° - 18° (Stabil Geoteknik)",
      },
    },
    {
      key: "REVEGETATION",
      label: "4. Revegetation (Revegetasi)",
      period: "Tahun 2026+ (Establishment Sukses)",
      badge: "Fast Growing & Local Climax",
      color: "text-emerald-300",
      border: "border-emerald-400",
      bg: "from-emerald-950/90 to-slate-950/90",
      description:
        "Hutan sekunder reklamasi mapan: Penanaman pohon pionir cepat tumbuh (Sengon, Johar, Trembesi) dikombinasikan spesies lokal klimaks (Meranti, Ulin), survival rate 89.4%, satwa liar mulai kembali, dan siap evaluasi relinquishment ESDM.",
      metrics: {
        canopyCover: "84.2%",
        disturbedArea: "0.0 Ha (Terpulihkan)",
        topsoilDepth: "45 cm + Serasah Daun",
        biodiversity: "H' 2.78 (Mapan)",
        soilPh: "6.3 (Taraf Subur)",
        slopeAngle: "15° (Teras Bangku Stabil)",
      },
    },
  ];

  const currentStageData = stages.find((s) => s.key === currentStage) || stages[3];

  // Auto-play time lapse effect
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev === "BEFORE") return "MINING";
          if (prev === "MINING") return "RECLAMATION";
          if (prev === "RECLAMATION") return "REVEGETATION";
          return "BEFORE";
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-900 border border-emerald-500/30 p-6 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" /> 4-STAGE SPATIAL EVOLUTION MAP
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Time-Lapse & Satellite GIS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Before <ArrowRight className="w-5 h-5 text-emerald-400 inline" /> Mining{" "}
              <ArrowRight className="w-5 h-5 text-rose-400 inline" /> Reclamation{" "}
              <ArrowRight className="w-5 h-5 text-amber-400 inline" /> Revegetation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Visualisasi spasial evolusi bentang alam tambang 4 fase: Dari rona awal hutan alam, bukaan operasional tambang, tahapan rekonstruksi penataan lahan/topsoil, hingga suksesi hutan revegetasi pascatambang.
            </p>
          </div>

          {/* Time Lapse Playback Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg cursor-pointer ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pause Time-Lapse" : "Play Time-Lapse"}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStage("BEFORE");
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              title="Reset ke Before (Rona Awal)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <span className="text-[11px] text-slate-400 font-medium">Speed:</span>
              {[
                { label: "1x", speed: 3500 },
                { label: "2x", speed: 2000 },
                { label: "3x", speed: 1000 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setPlaybackSpeed(s.speed)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    playbackSpeed === s.speed
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stage Interactive Switcher Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st, idx) => {
          const isSelected = currentStage === st.key;
          return (
            <div
              key={st.key}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStage(st.key);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                isSelected
                  ? `bg-slate-900 ${st.border} ring-2 ring-emerald-500/20 shadow-xl`
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black tracking-tight ${st.color}`}>
                  {st.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Tahap {idx + 1}/4
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                {st.period}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <span className="font-bold text-slate-700 dark:text-slate-300">{st.badge}</span>
                <span className="font-mono font-bold text-emerald-500">
                  {st.metrics.canopyCover} Kanopi
                </span>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Interactive Map & Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Layer Filters & Area Selector */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Mode Tampilan GIS Map
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl text-[11px] font-bold">
              {[
                { id: "SINGLE", label: "Fase Aktif" },
                { id: "SPLIT_COMPARE", label: "Split Compare" },
                { id: "CROSS_SECTION", label: "Penampang" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-center transition cursor-pointer ${
                    viewMode === m.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Filter Panel */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Layer Spasial GIS
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">Active</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Citra Satelit Orthophoto Drone
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.satelliteOverlay}
                  onChange={() => toggleLayer("satelliteOverlay")}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Garis Kontur Topografi & Lereng
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.topographyContours}
                  onChange={() => toggleLayer("topographyContours")}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  Indeks Vegetasi NDVI Spektral
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.ndviIndex}
                  onChange={() => toggleLayer("ndviIndex")}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Saluran Drainase & Kolam Sedimen
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.drainageLines}
                  onChange={() => toggleLayer("drainageLines")}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Titik Pantau RMP Lapangan
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.rmpPoints}
                  onChange={() => toggleLayer("rmpPoints")}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Block Selection */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Pilih Blok Tambang / Void
            </span>
            <div className="space-y-2 text-xs">
              {[
                { id: "BLK-ALPHA", name: "Pit Alpha West Slope", area: "12.5 Ha", phase: "Revegetated 2026" },
                { id: "BLK-DISPOSAL-N", name: "North Waste Dump Disposal", area: "18.2 Ha", phase: "Revegetated 2025" },
                { id: "BLK-BETA-VOID", name: "Pit Beta Void In-Pit", area: "14.8 Ha", phase: "Land Reshaping" },
                { id: "BLK-CORRIDOR-2", name: "Haul Road Corridor KM4", area: "6.2 Ha", phase: "Cover Cropping" },
              ].map((blk) => (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlockId(blk.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    selectedBlockId === blk.id
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-white"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{blk.name}</span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{blk.area}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{blk.phase}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas: Interactive Map Visualization */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-between p-6">
            {/* Background Simulated Satellite/Map Canvas */}
            <div
              className={`absolute inset-0 transition-all duration-700 bg-gradient-to-br ${
                currentStage === "BEFORE"
                  ? "from-emerald-950 via-teal-950 to-slate-950 opacity-95"
                  : currentStage === "MINING"
                  ? "from-rose-950/80 via-slate-900 to-amber-950/60 opacity-95"
                  : currentStage === "RECLAMATION"
                  ? "from-amber-950/70 via-stone-900 to-slate-950 opacity-95"
                  : "from-emerald-950/90 via-slate-950 to-teal-950 opacity-95"
              }`}
            />

            {/* Grid Mesh & Contour Lines Simulator */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

            {/* Stage Visual Watermark */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 font-mono font-bold text-xs text-emerald-400 flex items-center gap-1.5 shadow-lg">
                <Compass className="w-4 h-4 animate-pulse" /> S: 03°08'42" E: 115°14'28"
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 font-mono font-bold text-xs text-slate-300">
                Skala 1:5,000
              </span>
            </div>

            {/* Top Interactive Canvas Overlay Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                  Status Fase Bentang Alam
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-base font-black ${currentStageData.color}`}>
                    {currentStageData.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-semibold">
                    ({currentStageData.period})
                  </span>
                </div>
              </div>

              {/* View mode indicators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Mengunduh Peta GIS Resolusi Tinggi & Laporan Spasial GeoTIFF...")}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Map (GeoTIFF / PDF)
                </button>
              </div>
            </div>

            {/* Central Simulated Landscape Map Polygons */}
            {viewMode === "SINGLE" && (
              <div className="relative z-10 my-auto py-8">
                {/* Simulated Terraces / Pit Contours / Forest Canopy Shapes */}
                <div className="relative mx-auto max-w-2xl h-64 rounded-3xl border-2 border-dashed border-emerald-500/30 p-6 flex flex-col justify-between overflow-hidden shadow-inner backdrop-blur-xs">
                  {/* Visual Scene depending on Current Stage */}
                  {currentStage === "BEFORE" && (
                    <div className="space-y-4 text-center my-auto">
                      <div className="flex justify-center gap-3">
                        <Trees className="w-16 h-16 text-emerald-400 animate-bounce" />
                        <Trees className="w-20 h-20 text-emerald-500" />
                        <Trees className="w-14 h-14 text-teal-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-emerald-300">
                          Hutan Rona Awal (Baseline Tropical Forest)
                        </h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                          Tutupan tajuk kanopi 92.4% • Topsoil humus tebal 60cm • Habitat flora & fauna alami utuh.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStage === "MINING" && (
                    <div className="space-y-4 text-center my-auto">
                      <div className="flex justify-center gap-4">
                        <Mountain className="w-16 h-16 text-rose-500" />
                        <Activity className="w-16 h-16 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-rose-400">
                          Operasi Tambang & Bukaan Pit (Active Mining Void)
                        </h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                          Penggalian batubara kedalaman -45m RL • Waste dump disposal • Penampungan topsoil di stockpile.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStage === "RECLAMATION" && (
                    <div className="space-y-4 text-center my-auto">
                      <div className="flex justify-center gap-4">
                        <Layers className="w-16 h-16 text-amber-400" />
                        <TrendingUp className="w-16 h-16 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-amber-300">
                          Penataan Lahan, Teras Bangku & Penebaran Topsoil
                        </h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                          Backfilling disposal • Pembentukan kemiringan lereng &lt;18° • Penebaran topsoil 40cm + Cover Crop.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStage === "REVEGETATION" && (
                    <div className="space-y-4 text-center my-auto">
                      <div className="flex justify-center gap-3">
                        <Trees className="w-16 h-16 text-emerald-400" />
                        <ShieldCheck className="w-16 h-16 text-teal-400" />
                        <Trees className="w-14 h-14 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-emerald-300">
                          Hutan Revegetasi Mapan & Keanekaragaman Hayati
                        </h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                          Sengon, Johar, Meranti & Ulin tumbuh subur • Survival Rate 89.4% • Siap Penilaian Pelepasan Jamrek ESDM.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Simulated Polygon Coordinates Pin */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>POLYGON: {selectedBlockId}</span>
                    <span>NDVI INDEX: {currentStage === "BEFORE" ? "0.82" : currentStage === "MINING" ? "0.04" : currentStage === "RECLAMATION" ? "0.38" : "0.78"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Split Comparison Mode */}
            {viewMode === "SPLIT_COMPARE" && (
              <div className="relative z-10 my-auto py-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Kiri: {compareStageLeft}</span>
                    <span className="text-amber-400">Kanan: {compareStageRight}</span>
                  </div>

                  {/* Range slider for split */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={splitPosition}
                      onChange={(e) => setSplitPosition(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Rasio Kiri: {splitPosition}%</span>
                      <span>Rasio Kanan: {100 - splitPosition}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Fase Pra-Reklamasi (Mining)</span>
                      <strong className="text-rose-400 text-sm">Bukaan Tambang Terbuka</strong>
                      <p className="text-[11px] text-slate-400 mt-1">Erosi tinggi, tutupan tajuk 0%, tanah belum stabil.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Fase Pasca-Reklamasi (Revegetasi)</span>
                      <strong className="text-emerald-400 text-sm">Hutan Sekunder Mapan</strong>
                      <p className="text-[11px] text-slate-400 mt-1">Tajuk 84.2%, tanah humus subur, erosi tereduksi 95%.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-Section Profile Mode (Penampang Melintang Lereng) */}
            {viewMode === "CROSS_SECTION" && (
              <div className="relative z-10 my-auto py-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Penampang Melintang Rekonstruksi Lereng Teras Bangku Pascatambang
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Sudut Lereng 15° (Standar ESDM &lt;20°)
                    </span>
                  </div>

                  {/* Visual Slope Cross-Section Diagram */}
                  <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end justify-between font-mono text-[10px]">
                    <div className="space-y-1 text-slate-400">
                      <span>Teras 1 (+120m RL)</span>
                      <div className="w-16 h-8 bg-emerald-700/60 rounded-t border-t-2 border-emerald-400 text-center text-white py-1">
                        Pohon
                      </div>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <span>Teras 2 (+100m RL)</span>
                      <div className="w-20 h-16 bg-emerald-800/60 rounded-t border-t-2 border-emerald-400 text-center text-white py-1">
                        Topsoil 40cm
                      </div>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <span>Teras 3 (+80m RL)</span>
                      <div className="w-24 h-24 bg-amber-900/60 rounded-t border-t-2 border-amber-500 text-center text-white py-1">
                        Drainase Ditch
                      </div>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <span>Toe (+60m RL)</span>
                      <div className="w-28 h-28 bg-cyan-950/80 rounded-t border-t-2 border-cyan-400 text-center text-cyan-300 py-1">
                        Sediment Pond
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Telemetry Metrics Strip */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono pt-3 border-t border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Tutupan Tajuk</span>
                <span className="text-sm font-black text-emerald-400">{currentStageData.metrics.canopyCover}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Area Bukaan</span>
                <span className="text-sm font-black text-rose-400">{currentStageData.metrics.disturbedArea}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Tebal Topsoil</span>
                <span className="text-sm font-black text-amber-400">{currentStageData.metrics.topsoilDepth}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Biodiversitas</span>
                <span className="text-sm font-black text-teal-400">{currentStageData.metrics.biodiversity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">pH Tanah</span>
                <span className="text-sm font-black text-cyan-400">{currentStageData.metrics.soilPh}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Kemiringan Lereng</span>
                <span className="text-sm font-black text-indigo-400">{currentStageData.metrics.slopeAngle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
