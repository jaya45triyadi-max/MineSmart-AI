// MINE SMART AI - AI CCTV Vision Sandbox & Incident Injection Simulator Modal

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Flame,
  HardHat,
  Layers,
  Sparkles,
  Truck,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { CameraFeed, VisionDetectionCategory } from "../../../types/cctvTypes";

interface VisionAiSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameras: CameraFeed[];
  onInjectViolation: (cameraId: string, category: VisionDetectionCategory, customScenario: any) => void;
}

export const VisionAiSandboxModal: React.FC<VisionAiSandboxModalProps> = ({
  isOpen,
  onClose,
  cameras,
  onInjectViolation,
}) => {
  const [selectedCameraId, setSelectedCameraId] = useState(cameras[0]?.id || "");
  const [injectedCount, setInjectedCount] = useState(0);

  if (!isOpen) return null;

  const scenarios = [
    {
      category: "helmet" as VisionDetectionCategory,
      title: "Hardhat Missing in Swing Radius",
      desc: "Simulate worker entering Excavator PC2000 swing zone without SNI helmet.",
      icon: <HardHat className="w-5 h-5 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
      detection: {
        id: `INJ-HELMET-${Date.now()}`,
        label: "⚠️ VIOLATION: Person [NO HELMET] in Shovel Zone",
        category: "helmet",
        confidence: 0.97,
        x: 45,
        y: 65,
        width: 8,
        height: 20,
        isViolation: true,
        violationType: "MISSING_HELMET_IN_SWING_RADIUS",
        attributes: {
          hasHelmet: false,
          hasVest: true,
          distanceToNearestVehicleM: 4.2,
          zoneName: "Excavator 360° Slew Swing Hazard",
        },
      },
    },
    {
      category: "vest" as VisionDetectionCategory,
      title: "Missing High-Vis Vest on Haul Road",
      desc: "Simulate worker in dark clothing walking near active Haul Truck ramp.",
      icon: <CheckCircle2 className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-300",
      detection: {
        id: `INJ-VEST-${Date.now()}`,
        label: "⚠️ VIOLATION: Person [NO SAFETY VEST]",
        category: "vest",
        confidence: 0.96,
        x: 60,
        y: 68,
        width: 8,
        height: 22,
        isViolation: true,
        violationType: "MISSING_REFLECTIVE_SAFETY_VEST",
        attributes: {
          hasHelmet: true,
          hasVest: false,
          distanceToNearestVehicleM: 8.5,
        },
      },
    },
    {
      category: "unsafe_interaction" as VisionDetectionCategory,
      title: "Human-Machine Proximity Hazard (< 3.5m)",
      desc: "Simulate spotter worker stepping into blind spot of reversing HD785 Hauler.",
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
      color: "from-rose-600/30 to-red-600/30 border-rose-500 text-rose-200",
      detection: {
        id: `INJ-PROX-${Date.now()}`,
        label: "🔴 CRITICAL: Proximity Hazard (< 3.2m to Reversing Hauler)",
        category: "unsafe_interaction",
        confidence: 0.98,
        x: 28,
        y: 58,
        width: 8,
        height: 21,
        isViolation: true,
        violationType: "HUMAN_MACHINE_PROXIMITY_DANGER",
        attributes: {
          hasHelmet: true,
          hasVest: true,
          distanceToNearestVehicleM: 3.2,
        },
      },
    },
    {
      category: "restricted_area" as VisionDetectionCategory,
      title: "Blast Danger Perimeter Intrusion",
      desc: "Simulate unauthorized LV light vehicle entering active 500m blast exclusion boundary.",
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300",
      detection: {
        id: `INJ-RESTRICT-${Date.now()}`,
        label: "⛔ CRITICAL: Vehicle in Blast Danger Perimeter",
        category: "restricted_area",
        confidence: 0.95,
        x: 20,
        y: 30,
        width: 25,
        height: 30,
        isViolation: true,
        violationType: "BLAST_ZONE_INTRUSION",
        attributes: {
          zoneName: "Active Blasting Exclusion Zone",
        },
      },
    },
    {
      category: "smoke_fire" as VisionDetectionCategory,
      title: "Coal Stockpile Thermal Hotspot (92°C)",
      desc: "Simulate spontaneous combustion thermal plume on ROM coal stockpiles.",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: "from-orange-500/20 to-amber-500/20 border-orange-500/40 text-orange-300",
      detection: {
        id: `INJ-SMOKE-${Date.now()}`,
        label: "🔥 CRITICAL: Thermal Hotspot & Smoke Plume (92.4°C)",
        category: "smoke_fire",
        confidence: 0.94,
        x: 70,
        y: 20,
        width: 24,
        height: 28,
        isViolation: true,
        violationType: "SPONTANEOUS_COMBUSTION_SMOKE_PLUME",
        attributes: {
          thermalTempC: 92.4,
          zoneName: "ROM Coal Seam High-Temp Stockpile",
        },
      },
    },
    {
      category: "ppe" as VisionDetectionCategory,
      title: "Multiple PPE Non-Compliance",
      desc: "Simulate worker missing both Helmet & Vest in processing conveyor zone.",
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300",
      detection: {
        id: `INJ-PPE-${Date.now()}`,
        label: "⚠️ VIOLATION: Zero PPE (No Helmet, No Vest)",
        category: "ppe",
        confidence: 0.99,
        x: 50,
        y: 60,
        width: 8,
        height: 22,
        isViolation: true,
        violationType: "MULTIPLE_PPE_DEFICIENCY",
        attributes: {
          hasHelmet: false,
          hasVest: false,
          hasBoots: true,
        },
      },
    },
  ];

  const handleInject = (scenario: (typeof scenarios)[0]) => {
    onInjectViolation(selectedCameraId, scenario.category, scenario.detection);
    setInjectedCount((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Vision Sandbox & Incident Injector
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  TESTING SUITE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Uji coba live inferensi 8 Domain Deteksi AI Vision pada kamera terpilih.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Target Camera Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Target Kamera Feed:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {cameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedCameraId === cam.id
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-bold ring-1 ring-indigo-500"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750"
                  }`}
                >
                  <div className="font-mono text-indigo-400 text-[10px]">{cam.code}</div>
                  <div className="truncate font-semibold">{cam.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{cam.location}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Injection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pilih Skenario Deteksi AI untuk Diinjeksikan:
              </label>
              {injectedCount > 0 && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ✓ {injectedCount} skenario berhasil disuntikkan ke live stream!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((sc, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border bg-gradient-to-br ${sc.color} flex flex-col justify-between gap-2.5`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-750 shrink-0">
                      {sc.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{sc.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {sc.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                    <span className="text-[10px] font-mono text-slate-400">
                      Class: {sc.category.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleInject(sc)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1 border border-slate-700 shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Inject Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Complies with ESDM 1827/2018 K3 Minerba Standard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Tutup Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
