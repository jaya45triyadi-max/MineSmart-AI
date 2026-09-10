import React, { useState } from "react";
import {
  ClipboardCheck,
  Mountain,
  Trees,
  Sprout,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  BarChart3,
  Leaf,
  Eye,
} from "lucide-react";
import {
  DisturbedArea,
  ReclamationProject,
  PlantingProgram,
  ReclamationMonitoringPoint,
  ReclamationMonitoringForm,
  PlantSpecies,
} from "../../../types/reclamationTypes";

interface Props {
  disturbedAreas: DisturbedArea[];
  projects: ReclamationProject[];
  plantingPrograms: PlantingProgram[];
  monitoringPoints: ReclamationMonitoringPoint[];
  monitoringForms: ReclamationMonitoringForm[];
  speciesList: PlantSpecies[];
  onAddMonitoringForm?: (form: Omit<ReclamationMonitoringForm, "id">) => void;
  onNavigateTab?: (tab: string) => void;
}

export type MonitoringSubSection =
  | "area-disturbed"
  | "area-reclaimed"
  | "planting"
  | "survival-rate"
  | "monitoring-location"
  | "progress";

export const ReclamationMonitoringCenterTab: React.FC<Props> = ({
  disturbedAreas,
  projects,
  plantingPrograms,
  monitoringPoints,
  monitoringForms,
  speciesList,
  onAddMonitoringForm,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<MonitoringSubSection>("area-disturbed");
  const [selectedPointId, setSelectedPointId] = useState<string>(
    monitoringPoints[0]?.monitoringPointId || ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Aggregate Calculations
  const totalDisturbedHa = disturbedAreas.reduce((sum, a) => sum + a.areaHa, 0);
  const totalReclaimedHa = projects.reduce((sum, p) => sum + p.reclaimedAreaHa, 0);
  const totalTargetHa = projects.reduce((sum, p) => sum + p.targetAreaHa, 0);
  const totalPlantedTrees = plantingPrograms.reduce((sum, p) => sum + p.actualTreesPlanted, 0);
  const avgSurvivalRate = (
    projects.reduce((sum, p) => sum + p.survivalRatePercent, 0) / (projects.length || 1)
  ).toFixed(1);

  const subSections: {
    id: MonitoringSubSection;
    label: string;
    icon: React.ElementType;
    badge: string;
    desc: string;
  }[] = [
    {
      id: "area-disturbed",
      label: "Area Disturbed",
      icon: Mountain,
      badge: `${totalDisturbedHa.toFixed(1)} Ha`,
      desc: "Pemantauan bukaan tambang aktif, void pit, disposal overburden & stockpile.",
    },
    {
      id: "area-reclaimed",
      label: "Area Reclaimed",
      icon: Layers,
      badge: `${totalReclaimedHa.toFixed(1)} Ha`,
      desc: "Realisasi penataan lahan (reshaping), penebaran topsoil & pelepasan Jamrek ESDM.",
    },
    {
      id: "planting",
      label: "Planting",
      icon: Sprout,
      badge: `${totalPlantedTrees.toLocaleString()} Pohon`,
      desc: "Program penanaman pionir cepat tumbuh (Fast-Growing) & jenis lokal klimaks.",
    },
    {
      id: "survival-rate",
      label: "Survival Rate",
      icon: Trees,
      badge: `${avgSurvivalRate}%`,
      desc: "Tingkat keberhasilan hidup tanaman, kerapatan tajuk kanopi & penyulaman.",
    },
    {
      id: "monitoring-location",
      label: "Monitoring Location",
      icon: MapPin,
      badge: `${monitoringPoints.length} Titik RMP`,
      desc: "Titik pantau permanen (RMP), koordinat GPS spasial & log inspeksi berkala.",
    },
    {
      id: "progress",
      label: "Progress",
      icon: TrendingUp,
      badge: `${((totalReclaimedHa / totalTargetHa) * 100).toFixed(1)}%`,
      desc: "Progress Engine kurva-S, milestone penataan lahan vs RKAB ESDM tahunan.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <ClipboardCheck className="w-3.5 h-3.5" /> INTEGRATED RECLAMATION MONITORING
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Permen ESDM No. 26/2018 & Kepmen 1827 K
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Reclamation Performance & Field Monitoring System
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Monitoring terpusat mencakup 6 pilar utama: <strong>Area Disturbed, Area Reclaimed, Planting, Survival Rate, Monitoring Location (RMP), dan Realisasi Progress</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                Total Reklamasi Kumulatif
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {totalReclaimedHa.toFixed(1)} / {totalTargetHa.toFixed(1)} Ha
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Sub-Section Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {subSections.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSection === sub.id;
          return (
            <div
              key={sub.id}
              onClick={() => setActiveSection(sub.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                isActive
                  ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                  {sub.badge}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                  {sub.label}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                  {sub.desc}
                </p>
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* 1. SECTION: AREA DISTURBED */}
      {activeSection === "area-disturbed" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Bukaan Lahan Aktif</span>
              <div className="text-2xl font-black text-rose-500">
                {totalDisturbedHa.toFixed(1)} Ha
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Pit, Disposal & Jalan Angkut</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Bukaan Area Pit (Tambang)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                18.2 Ha
              </div>
              <span className="text-[10px] text-amber-500 font-sans font-semibold">63.8% dari Total Bukaan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Area Siap Direklamasi</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                9.4 Ha
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Siap Land Reshaping</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Rasio Bukaan vs Reklamasi</span>
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                1 : 0.88
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Memenuhi Batas RKAB</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Mountain className="w-5 h-5 text-rose-500" />
              Daftar Neraca Bukaan Lahan Tambang Aktif (Disturbed Land Register)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {disturbedAreas.map((da) => (
                <div
                  key={da.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {da.disturbedAreaId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {da.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {da.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Luas Area</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{da.areaHa} Ha</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tipe Bukaan</span>
                      <strong className="text-slate-800 dark:text-slate-200">{da.type}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
                    <span>Pit: {da.pitName}</span>
                    <span>Tahun: {da.yearDisturbed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION: AREA RECLAIMED */}
      {activeSection === "area-reclaimed" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Area Tereklamasi</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {totalReclaimedHa.toFixed(1)} Ha
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">91.2% Capaian Kumulatif</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Penebaran Topsoil Selesai</span>
              <div className="text-2xl font-black text-amber-500">
                22.0 Ha
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Ketebalan Rata-rata 42 cm</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Siap Evaluasi Pelepasan</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                12.5 Ha
              </div>
              <span className="text-[10px] text-indigo-500 font-sans font-semibold">Pencairan Jamrek Tahap I</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Jaminan Reklamasi Aktif</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                Rp 3.91 M
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Bank Garansi ESDM</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              Proyek Reklamasi Lahan & Rekonstruksi Pascatambang
            </h3>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {proj.projectId}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {proj.projectName}
                      </h4>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {proj.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Progres Luasan Reklamasi</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {proj.reclaimedAreaHa} Ha / {proj.targetAreaHa} Ha ({((proj.reclaimedAreaHa / proj.targetAreaHa) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${(proj.reclaimedAreaHa / proj.targetAreaHa) * 100}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tipe Penataan</span>
                      <strong className="text-slate-800 dark:text-slate-200">{proj.targetLandUse}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Metode Revegetasi</span>
                      <strong className="text-slate-800 dark:text-slate-200">{proj.revegetationMethod}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Survival Rate</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{proj.survivalRatePercent}%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Estimasi Selesai</span>
                      <strong className="text-slate-800 dark:text-slate-200">{proj.plannedEndDate}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SECTION: PLANTING */}
      {activeSection === "planting" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Pohon Tertanam</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {totalPlantedTrees.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">100% Target Tahunan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Kerapatan Tanam Rata-rata</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                1,100 <span className="text-xs font-sans">Pohon/Ha</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Pola Tanam 3m x 3m</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Pionir Cepat Tumbuh</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                70%
              </div>
              <span className="text-[10px] text-teal-500 font-sans">Sengon, Johar, Trembesi</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Spesies Lokal Klimaks</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                30%
              </div>
              <span className="text-[10px] text-indigo-500 font-sans">Meranti, Ulin, Mahoni</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-500" />
              Program Penanaman Bibit & Proporsi Jenis Tanaman Reklamasi
            </h3>

            <div className="space-y-4">
              {plantingPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {prog.programId}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {prog.programName}
                      </h4>
                    </div>
                    <span className="font-mono text-slate-500">Tanggal Tanam: {prog.plantingDate}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Target Pohon</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{prog.targetTrees.toLocaleString()}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Pohon Tertanam</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{prog.actualTreesPlanted.toLocaleString()}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Kepadatan / Ha</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{prog.spacingMeters} (Density)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Status Pelaksanaan</span>
                      <strong className="text-teal-600 dark:text-teal-400">{prog.status}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION: SURVIVAL RATE */}
      {activeSection === "survival-rate" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Rata-rata Survival Rate</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {avgSurvivalRate}%
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Standar ESDM: &gt;80%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Kategori Keberhasilan</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                SANGAT BAIK
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Passing Grade 100%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Bibit Perlu Disulam</span>
              <div className="text-2xl font-black text-amber-500">
                850 <span className="text-xs font-sans">Bibit</span>
              </div>
              <span className="text-[10px] text-amber-500 font-sans font-semibold">Jadwal Minggu Ini</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Kerapatan Tajuk Kanopi</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                78.2%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Drone Orthophoto Index</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-500" />
              Evaluasi Persentase Tingkat Keberhasilan Tumbuh Pohon (Survival Rate) Per Blok
            </h3>

            <div className="space-y-4 text-xs">
              {[
                {
                  block: "Pit Alpha West Slope (Plot 01-03)",
                  trees: "11,220 Pohon",
                  survival: 91.4,
                  species: "Sengon Buto, Johar & Meranti",
                  status: "SANGAT BAIK (>80%)",
                  action: "Pemupukan NPK lanjutan",
                },
                {
                  block: "North Waste Dump Disposal (Plot N1-N4)",
                  trees: "12,500 Pohon",
                  survival: 86.8,
                  species: "Trembesi, Kaliandra & Ulin",
                  status: "SANGAT BAIK (>80%)",
                  action: "Penyiangan gulma berkala",
                },
                {
                  block: "Corridor Sector 2 (Plot S1)",
                  trees: "5,760 Pohon",
                  survival: 82.5,
                  species: "Mahoni & Gmelina arborea",
                  status: "BAIK (>80%)",
                  action: "Penyulaman 850 bibit pengganti",
                },
              ].map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{row.block}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Spesies: <strong className="text-slate-700 dark:text-slate-300">{row.species}</strong> • Populasi: {row.trees}
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 text-[11px]">
                      Tindakan Lanjutan: {row.action}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {row.survival}%
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 block">{row.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION: MONITORING LOCATION */}
      {activeSection === "monitoring-location" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Points List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daftar Titik Pantau Tetap Reklamasi (RMP)
              </h3>
              {monitoringPoints.map((pt) => (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPointId(pt.monitoringPointId)}
                  className={`rounded-2xl p-4 border transition cursor-pointer space-y-2 ${
                    selectedPointId === pt.monitoringPointId
                      ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {pt.monitoringPointId}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {pt.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{pt.locationName}</h4>
                  <p className="text-[11px] text-slate-500">{pt.areaName}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Frekuensi: <strong>{pt.frequency}</strong></span>
                    <span>Jadwal: <strong className="text-amber-500">{pt.nextMonitoringDate}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Point Detail Inspector & GPS Coordinates */}
            <div className="lg:col-span-2 space-y-4">
              {selectedPointId && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                        Titik Pantau Terpilih
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {monitoringPoints.find((p) => p.monitoringPointId === selectedPointId)?.locationName}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600">
                      GPS: S 03°08'44" E 115°14'30"
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Kesehatan Vegetasi</span>
                      <strong className="text-emerald-600 text-sm mt-0.5 block">SANGAT BAIK</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Tingkat Erosi</span>
                      <strong className="text-emerald-600 text-sm mt-0.5 block">LOW (&lt;5 Ton/Ha)</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Kondisi Topsoil</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">Humus Lembab pH 6.2</strong>
                    </div>
                  </div>

                  {/* Inspection Log Table */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Riwayat Inspeksi Lapangan:</h5>
                    <div className="space-y-2 text-xs">
                      {monitoringForms
                        .filter((f) => f.monitoringPointId === selectedPointId)
                        .map((form) => (
                          <div
                            key={form.id}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex justify-between font-medium">
                              <span>Tanggal: <strong>{form.date}</strong></span>
                              <span className="text-slate-500">Inspektor: {form.inspectorName}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{form.remarks}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SECTION: PROGRESS */}
      {activeSection === "progress" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Capaian Progress RKAB</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                91.2%
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">Ahead of Schedule (+4.2%)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Tahap Penataan Lahan</span>
              <div className="text-2xl font-black text-amber-500">
                100%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">25.0 Ha Selesai Reshaping</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Tahap Penebaran Topsoil</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                95.0%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">23.8 Ha Tertebar Merata</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Tahap Penanaman & Revegetasi</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                88.5%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">22.1 Ha Tertanam Penuh</span>
            </div>
          </div>

          {/* Progress S-Curve & Milestone Tracker */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Kurva-S Realisasi Reklamasi Tambang (Rencana vs Aktual YTD)
            </h3>

            <div className="space-y-4">
              {[
                { stage: "1. Land Reshaping & Void Backfilling", plan: 100, actual: 100, color: "bg-emerald-500" },
                { stage: "2. Topsoil Spreading (min 40cm)", plan: 90, actual: 95, color: "bg-teal-500" },
                { stage: "3. Cover Cropping & Hydroseeding", plan: 85, actual: 92, color: "bg-cyan-500" },
                { stage: "4. Fast Growing Tree Planting", plan: 80, actual: 88, color: "bg-indigo-500" },
                { stage: "5. Local Climax Tree Enrichment", plan: 60, actual: 68, color: "bg-purple-500" },
                { stage: "6. Jamrek Relinquishment Inspection", plan: 40, actual: 45, color: "bg-amber-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{item.stage}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      Aktual: {item.actual}% | Rencana: {item.plan}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <div
                      style={{ width: `${item.actual}%` }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
