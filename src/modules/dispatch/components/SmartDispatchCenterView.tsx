// MINE SMART AI - Smart Dispatch AI Engine (Premium Suite)
// Visual Flow: Excavator → Queue → Loading → Hauling → Dumping → Return
// AI Calculations: Queue, Cycle Time, Loading Time, Hauling Time, Dumping Time, Return Time
// AI Real-Time Recommendations: "Tambahkan 2 unit HD 785 ke Fleet A" / "Kurangi 1 unit truck karena queue excavator meningkat"

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Truck,
  Layers,
  Clock,
  Gauge,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Compass,
  BarChart3,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Info,
  Maximize2,
} from "lucide-react";

export interface FleetFleetState {
  fleetId: string;
  fleetName: string;
  pitArea: string;
  materialType: "Coal" | "Overburden" | "Interburden" | "Waste";
  excavatorCode: string;
  excavatorModel: string;
  excavatorBucketM3: number;
  truckModel: string;
  truckCapacityTon: number;
  truckCount: number;
  truckUnits: string[];
  distanceKm: number;
  // Dynamic AI Computed Metrics
  queueTimeMin: number;
  loadingTimeMin: number;
  haulingTimeMin: number;
  dumpingTimeMin: number;
  returnTimeMin: number;
  totalCycleTimeMin: number;
  matchFactor: number;
  productionTonPerHour: number;
  targetTonPerHour: number;
  shovelIdlePercent: number;
  truckQueueCount: number;
  status: "OPTIMAL" | "OVER_TRUCKED" | "UNDER_TRUCKED" | "BOTTLENECK";
}

interface SmartDispatchCenterViewProps {
  onOpenAICopilot?: () => void;
  onNavigateTab?: (tabKey: string) => void;
}

export const SmartDispatchCenterView: React.FC<SmartDispatchCenterViewProps> = ({
  onOpenAICopilot,
  onNavigateTab,
}) => {
  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [activeFleetId, setActiveFleetId] = useState<string>("FLEET-A");
  const [aiAutonomousMode, setAiAutonomousMode] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Fleets Data State
  const [fleets, setFleets] = useState<FleetFleetState[]>([
    {
      fleetId: "FLEET-A",
      fleetName: "Fleet A - Coal Production",
      pitArea: "Pit 1 South (Seam 100)",
      materialType: "Coal",
      excavatorCode: "EX-201",
      excavatorModel: "Komatsu PC2000-8",
      excavatorBucketM3: 12.0,
      truckModel: "Komatsu HD785-7",
      truckCapacityTon: 91.0,
      truckCount: 3,
      truckUnits: ["DT-101", "DT-102", "DT-103"],
      distanceKm: 4.2,
      queueTimeMin: 0.8,
      loadingTimeMin: 3.4,
      haulingTimeMin: 10.5,
      dumpingTimeMin: 1.8,
      returnTimeMin: 8.2,
      totalCycleTimeMin: 24.7,
      matchFactor: 0.76, // Under-trucked! Excavator is waiting
      productionTonPerHour: 663,
      targetTonPerHour: 880,
      shovelIdlePercent: 24.0,
      truckQueueCount: 0,
      status: "UNDER_TRUCKED",
    },
    {
      fleetId: "FLEET-B",
      fleetName: "Fleet B - Overburden Stripping",
      pitArea: "Pit 2 North (Bench RL -45)",
      materialType: "Overburden",
      excavatorCode: "EX-202",
      excavatorModel: "CAT 6020B Hydraulic Shovel",
      excavatorBucketM3: 14.5,
      truckModel: "CAT 777E Heavy Dump Truck",
      truckCapacityTon: 96.0,
      truckCount: 6,
      truckUnits: ["DT-104", "DT-105", "DT-106", "DT-107", "DT-108", "DT-109"],
      distanceKm: 3.0,
      queueTimeMin: 7.6, // High Queue!
      loadingTimeMin: 3.2,
      haulingTimeMin: 7.8,
      dumpingTimeMin: 1.6,
      returnTimeMin: 6.4,
      totalCycleTimeMin: 26.6,
      matchFactor: 1.35, // Over-trucked! Trucks are queueing
      productionTonPerHour: 1080,
      targetTonPerHour: 1100,
      shovelIdlePercent: 1.2,
      truckQueueCount: 3,
      status: "OVER_TRUCKED",
    },
    {
      fleetId: "FLEET-C",
      fleetName: "Fleet C - Interburden & Waste",
      pitArea: "Pit 3 West (Bench RL +20)",
      materialType: "Interburden",
      excavatorCode: "EX-203",
      excavatorModel: "Hitachi EX1900-6",
      excavatorBucketM3: 11.0,
      truckModel: "Scania Heavy Tipper P460",
      truckCapacityTon: 42.0,
      truckCount: 4,
      truckUnits: ["DT-110", "DT-111", "DT-112", "DT-113"],
      distanceKm: 2.1,
      queueTimeMin: 2.1,
      loadingTimeMin: 2.5,
      haulingTimeMin: 5.5,
      dumpingTimeMin: 1.4,
      returnTimeMin: 4.8,
      totalCycleTimeMin: 16.3,
      matchFactor: 0.98, // Optimal!
      productionTonPerHour: 618,
      targetTonPerHour: 620,
      shovelIdlePercent: 4.5,
      truckQueueCount: 1,
      status: "OPTIMAL",
    },
  ]);

  // Recalculate fleet physics when truckCount or parameters change
  const recalculateFleetMetrics = (fleet: FleetFleetState, newTruckCount: number): FleetFleetState => {
    const truckCount = Math.max(1, newTruckCount);
    const loadingTime = fleet.loadingTimeMin;
    const haulingTime = fleet.haulingTimeMin;
    const dumpingTime = fleet.dumpingTimeMin;
    const returnTime = fleet.returnTimeMin;

    // Standard Match Factor formula: (N_trucks * T_load) / (N_excavator * T_cycle_without_queue)
    const rawCycleWithoutQueue = loadingTime + haulingTime + dumpingTime + returnTime;
    const rawMatchFactor = (truckCount * loadingTime) / rawCycleWithoutQueue;

    // Queue time model based on Match Factor
    let queueTime = 0.5;
    let queueCount = 0;
    let shovelIdle = 0;
    let status: FleetFleetState["status"] = "OPTIMAL";

    if (rawMatchFactor < 0.9) {
      // Under-trucked: Excavator is waiting
      queueTime = Number((0.4 + Math.random() * 0.4).toFixed(1));
      queueCount = 0;
      shovelIdle = Number(((1 - rawMatchFactor) * 100).toFixed(1));
      status = "UNDER_TRUCKED";
    } else if (rawMatchFactor > 1.1) {
      // Over-trucked: Trucks queue up
      const excessTrucks = (rawMatchFactor - 1) * (rawCycleWithoutQueue / loadingTime);
      queueTime = Number((excessTrucks * loadingTime * 1.3).toFixed(1));
      queueCount = Math.round(excessTrucks);
      shovelIdle = 1.0;
      status = "OVER_TRUCKED";
    } else {
      // Balanced optimal
      queueTime = Number((1.5 + Math.random() * 0.8).toFixed(1));
      queueCount = 1;
      shovelIdle = 3.5;
      status = "OPTIMAL";
    }

    const totalCycle = Number((queueTime + loadingTime + haulingTime + dumpingTime + returnTime).toFixed(1));
    const effectiveMatchFactor = Number(((truckCount * loadingTime) / totalCycle).toFixed(2));
    const tripsPerHourPerTruck = 60 / totalCycle;
    const productionPerHour = Math.round(truckCount * tripsPerHourPerTruck * fleet.truckCapacityTon);

    return {
      ...fleet,
      truckCount,
      queueTimeMin: queueTime,
      totalCycleTimeMin: totalCycle,
      matchFactor: effectiveMatchFactor,
      productionTonPerHour: productionPerHour,
      shovelIdlePercent: shovelIdle,
      truckQueueCount: queueCount,
      status,
    };
  };

  // Live simulation tick timer
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setFleets((prevFleets) =>
        prevFleets.map((fleet) => {
          // slight natural jitter in hauling and queue
          const jitter = (Math.random() - 0.5) * 0.2;
          const newQueue = Math.max(0.2, Number((fleet.queueTimeMin + jitter).toFixed(1)));
          const newTotal = Number(
            (
              newQueue +
              fleet.loadingTimeMin +
              fleet.haulingTimeMin +
              fleet.dumpingTimeMin +
              fleet.returnTimeMin
            ).toFixed(1)
          );
          return {
            ...fleet,
            queueTimeMin: newQueue,
            totalCycleTimeMin: newTotal,
          };
        })
      );
    }, 3000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const activeFleet = fleets.find((f) => f.fleetId === activeFleetId) || fleets[0];

  // Action: Add Trucks to Fleet
  const handleAddTrucks = (fleetId: string, count: number) => {
    setFleets((prev) =>
      prev.map((f) => {
        if (f.fleetId === fleetId) {
          const updated = recalculateFleetMetrics(f, f.truckCount + count);
          const newTruckNames = Array.from({ length: count }, (_, i) => `DT-${200 + Math.floor(Math.random() * 800)}`);
          updated.truckUnits = [...f.truckUnits, ...newTruckNames];
          return updated;
        }
        return f;
      })
    );
    setLastActionMessage(`Berhasil menambahkan ${count} unit HD ke ${fleetId}. Match Factor dan Cycle Time telah dioptimalkan secara real-time.`);
    setTimeout(() => setLastActionMessage(null), 5000);
  };

  // Action: Reduce Truck from Fleet (Reallocate)
  const handleReduceTruck = (sourceFleetId: string, targetFleetId?: string) => {
    setFleets((prev) => {
      let reallocatedTruck = "";
      return prev.map((f) => {
        if (f.fleetId === sourceFleetId && f.truckCount > 1) {
          reallocatedTruck = f.truckUnits[f.truckUnits.length - 1];
          const updated = recalculateFleetMetrics(f, f.truckCount - 1);
          updated.truckUnits = f.truckUnits.slice(0, -1);
          return updated;
        }
        if (targetFleetId && f.fleetId === targetFleetId) {
          const updated = recalculateFleetMetrics(f, f.truckCount + 1);
          updated.truckUnits = [...f.truckUnits, reallocatedTruck || `DT-${Math.floor(Math.random() * 800 + 100)}`];
          return updated;
        }
        return f;
      });
    });
    setLastActionMessage(
      targetFleetId
        ? `Truk dipindahkan dari ${sourceFleetId} ke ${targetFleetId}. Antrean excavator berkurang, idle excavator teratasi!`
        : `1 unit truk berhasil ditarik dari ${sourceFleetId} untuk mengurangi antrean di loading bay.`
    );
    setTimeout(() => setLastActionMessage(null), 5000);
  };

  // Action: One-Click Execute All AI Recommendations
  const handleApplyAllAIRecommendations = () => {
    // 1. Add 2 trucks to Fleet A
    // 2. Reduce 1 truck from Fleet B and move to Fleet A
    setFleets((prev) =>
      prev.map((f) => {
        if (f.fleetId === "FLEET-A") {
          return recalculateFleetMetrics({
            ...f,
            truckUnits: [...f.truckUnits, "DT-109", "DT-114"],
          }, 5);
        }
        if (f.fleetId === "FLEET-B") {
          return recalculateFleetMetrics({
            ...f,
            truckUnits: f.truckUnits.filter((u) => u !== "DT-109"),
          }, 5);
        }
        return f;
      })
    );

    setLastActionMessage("🚀 SELURUH REKOMENDASI AI BERHASIL DITERAPKAN: Fleet A ditambahkan 2 unit (+1 dari Fleet B), antrean Fleet B normal, produksi tambang naik +420 Ton/jam.");
    setTimeout(() => setLastActionMessage(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with AI Engine Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500 text-slate-950 shadow-md">
                FITUR PREMIUM
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                SMART DISPATCH AI ENGINE
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              EXCAVATOR ➔ TRUCK ➔ HAULING ➔ DUMPING CYCLE OPTIMIZER
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Sistem memonitor pergerakan siklus tambang secara otomatis, menghitung kalkulasi <strong>Queue, Cycle Time, Loading, Hauling, Dumping & Return</strong>, serta memberikan rekomendasi penambahan atau pengurangan armada truk untuk mencapai <strong>Match Factor 1.0 (Zero Bottleneck)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Simulation Controls */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 text-xs">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSimulating
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                title="Pause / Resume Live Simulation Loop"
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSimulating ? "Live Running" : "Paused"}</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {[1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold cursor-pointer ${
                      simulationSpeed === speed
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* AI Auto-Pilot Switch */}
            <button
              onClick={() => setAiAutonomousMode(!aiAutonomousMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition-all ${
                aiAutonomousMode
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <Zap className={`w-4 h-4 ${aiAutonomousMode ? "text-amber-300 animate-bounce" : "text-slate-400"}`} />
              <span>{aiAutonomousMode ? "AI Auto-Balancing (ON)" : "AI Copilot (HITL)"}</span>
            </button>

            {/* Execute All Recommendations CTA */}
            <button
              onClick={handleApplyAllAIRecommendations}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Terapkan Rekomendasi AI</span>
            </button>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {lastActionMessage && (
          <div className="mt-4 p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{lastActionMessage}</span>
            </div>
            <button
              onClick={() => setLastActionMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. Top AI Recommendation Highlights (The exact requirements from prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommendation Box 1: Add Trucks to Fleet A */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  REKOMENDASI AI #1 • UNDER-TRUCKED
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  "Tambahkan 2 unit HD 785 ke Fleet A"
                </h4>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-1 rounded-lg border border-amber-500/30">
              MF: {fleets[0].matchFactor} (Low)
            </span>
          </div>

          <div className="mt-3.5 space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <p>
              <strong>Diagnosa AI:</strong> Excavator <strong className="text-amber-400">EX-201 (PC2000)</strong> mengalami idle time <strong>{fleets[0].shovelIdlePercent}%</strong> karena antrean truk kosong (Queue = {fleets[0].queueTimeMin} min).
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="text-slate-400">
                Alokasi Sekarang: <strong className="text-white font-mono">{fleets[0].truckCount} Unit</strong>
              </div>
              <div className="text-emerald-400 font-semibold">
                Target Optimal AI: <strong className="font-mono">{fleets[0].truckCount + 2} Unit HD 785</strong>
              </div>
              <div className="text-slate-400">
                Output Saat Ini: <strong className="text-white font-mono">{fleets[0].productionTonPerHour} T/jam</strong>
              </div>
              <div className="text-emerald-400 font-semibold">
                Proyeksi Output: <strong className="font-mono">+{fleets[0].truckCapacityTon * 2.4} T/jam</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Menghilangkan shovel waiting delay
            </span>
            <button
              onClick={() => handleAddTrucks("FLEET-A", 2)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Eksekusi Tambah 2 Unit HD 785</span>
            </button>
          </div>
        </div>

        {/* Recommendation Box 2: Reduce Truck from Fleet B */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950/30 border border-rose-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Minus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  REKOMENDASI AI #2 • OVER-TRUCKED (HIGH QUEUE)
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  "Kurangi 1 unit truck karena queue excavator meningkat"
                </h4>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-1 rounded-lg border border-rose-500/30">
              Queue: {fleets[1].queueTimeMin} min
            </span>
          </div>

          <div className="mt-3.5 space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <p>
              <strong>Diagnosa AI:</strong> Terjadi penumpukan <strong>{fleets[1].truckQueueCount} dump truck</strong> di loading bay <strong className="text-rose-400">EX-202 (CAT 6020B)</strong> dengan waktu antre <strong>{fleets[1].queueTimeMin} menit</strong> (Match Factor {fleets[1].matchFactor}).
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="text-slate-400">
                Alokasi Sekarang: <strong className="text-white font-mono">{fleets[1].truckCount} Unit</strong>
              </div>
              <div className="text-rose-300 font-semibold">
                Saran AI: <strong className="font-mono">Kurangi jadi {fleets[1].truckCount - 1} Unit</strong>
              </div>
              <div className="text-slate-400">
                Fuel Boros Idle: <strong className="text-rose-400 font-mono">~38.5 L/jam</strong>
              </div>
              <div className="text-emerald-400 font-semibold">
                Hemat Cycle Time: <strong className="font-mono">-4.5 min/trip</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Bisa dialihkan ke Fleet A
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReduceTruck("FLEET-B", "FLEET-A")}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 transition-all"
                title="Pindahkan 1 unit langsung ke Fleet A yang kekurangan armada"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Pindahkan ke Fleet A</span>
              </button>
              <button
                onClick={() => handleReduceTruck("FLEET-B")}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
              >
                <Minus className="w-3 h-3" />
                <span>Tarik 1 Unit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Fleet Selector & Match Factor Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              MONITORING FLEET & MATCH FACTOR STATUS
            </h3>
            <p className="text-xs text-slate-400">
              Pilih fleet untuk melihat detail perhitungan cycle time 6 tahap dan telemetri shovel-truck
            </p>
          </div>

          {/* Fleet Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {fleets.map((f) => {
              const isSelected = f.fleetId === activeFleetId;
              let statusBadge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
              if (f.status === "UNDER_TRUCKED") statusBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";
              if (f.status === "OVER_TRUCKED") statusBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30";

              return (
                <button
                  key={f.fleetId}
                  onClick={() => setActiveFleetId(f.fleetId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-slate-950 text-white border-amber-500/80 shadow-md ring-1 ring-amber-500/30"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Truck className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                  <span>{f.fleetName}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${statusBadge}`}>
                    MF: {f.matchFactor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Fleet Quick Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Excavator Digger</span>
            <span className="text-sm font-black text-amber-400 font-mono mt-0.5 block">{activeFleet.excavatorCode}</span>
            <span className="text-[10px] text-slate-400">{activeFleet.excavatorModel}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Armada Truck</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-sm font-black text-sky-400 font-mono">{activeFleet.truckCount} Unit</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleReduceTruck(activeFleet.fleetId)}
                  className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                  title="Kurangi 1 unit"
                >
                  -
                </button>
                <button
                  onClick={() => handleAddTrucks(activeFleet.fleetId, 1)}
                  className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                  title="Tambah 1 unit"
                >
                  +
                </button>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">{activeFleet.truckModel}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Match Factor (MF)</span>
            <span
              className={`text-sm font-black font-mono mt-0.5 block ${
                activeFleet.matchFactor < 0.9
                  ? "text-amber-400"
                  : activeFleet.matchFactor > 1.1
                  ? "text-rose-400"
                  : "text-emerald-400"
              }`}
            >
              {activeFleet.matchFactor} {activeFleet.matchFactor === 1.0 ? "🎯" : ""}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {activeFleet.matchFactor < 0.9
                ? "Under-trucked"
                : activeFleet.matchFactor > 1.1
                ? "Over-trucked"
                : "Balanced (1.0)"}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Queue Time Antrean</span>
            <span
              className={`text-sm font-black font-mono mt-0.5 block ${
                activeFleet.queueTimeMin > 5.0 ? "text-rose-400" : "text-slate-200"
              }`}
            >
              {activeFleet.queueTimeMin} min
            </span>
            <span className="text-[10px] text-slate-400">{activeFleet.truckQueueCount} truk menunggu</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Cycle Time</span>
            <span className="text-sm font-black text-indigo-300 font-mono mt-0.5 block">
              {activeFleet.totalCycleTimeMin} min
            </span>
            <span className="text-[10px] text-slate-400">Jarak Haul: {activeFleet.distanceKm} km</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Shovel Idle Delay</span>
            <span
              className={`text-sm font-black font-mono mt-0.5 block ${
                activeFleet.shovelIdlePercent > 10 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {activeFleet.shovelIdlePercent}%
            </span>
            <span className="text-[10px] text-slate-400">Menunggu truk</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Produktivitas Jam</span>
            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
              {activeFleet.productionTonPerHour} Ton/hr
            </span>
            <span className="text-[10px] text-slate-400">Target: {activeFleet.targetTonPerHour} T/hr</span>
          </div>
        </div>
      </div>

      {/* 4. The Core Visual Cycle Flow (Excavator → Queue → Loading → Hauling → Dumping → Return) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              END-TO-END TELEMETRY CYCLE LOOP • {activeFleet.fleetName.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400">
              AI secara real-time memonitor tahapan siklus pergerakan material dan mendeteksi titik kemacetan (bottleneck)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Lokasi:</span>
            <span className="text-amber-400 font-bold">{activeFleet.pitArea}</span>
          </div>
        </div>

        {/* 6 Stage Interactive Flow Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
          {/* Stage 1: Excavator */}
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 relative group hover:border-amber-400 transition-all flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-black flex items-center justify-center">
                1
              </span>
              <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                LOADING POINT
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">EXCAVATOR</p>
              <p className="text-base font-black text-amber-400 font-mono">{activeFleet.excavatorCode}</p>
              <p className="text-[11px] text-slate-300">{activeFleet.excavatorModel}</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Bucket:</span>
                <span className="text-white font-mono font-bold">{activeFleet.excavatorBucketM3} m³</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Passes:</span>
                <span className="text-white font-mono font-bold">4 - 5 Pass</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shovel Idle:</span>
                <span className={`font-mono font-bold ${activeFleet.shovelIdlePercent > 10 ? "text-amber-400" : "text-emerald-400"}`}>
                  {activeFleet.shovelIdlePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Stage 2: Queue */}
          <div className={`bg-slate-950/90 border rounded-2xl p-4 relative group transition-all flex flex-col justify-between shadow-lg ${
            activeFleet.queueTimeMin > 5.0
              ? "border-rose-500/60 bg-rose-950/20"
              : "border-slate-800 hover:border-slate-700"
          }`}>
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs font-black flex items-center justify-center">
                2
              </span>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                activeFleet.queueTimeMin > 5.0
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}>
                {activeFleet.queueTimeMin > 5.0 ? "HIGH QUEUE" : "BAY QUEUE"}
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">QUEUE TIME</p>
              <p className={`text-xl font-black font-mono ${activeFleet.queueTimeMin > 5.0 ? "text-rose-400" : "text-amber-300"}`}>
                {activeFleet.queueTimeMin} <span className="text-xs">min</span>
              </p>
              <p className="text-[11px] text-slate-400">{activeFleet.truckQueueCount} Unit menunggu</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Benchmark:</span>
                <span className="text-white font-mono font-bold">&lt; 2.0 min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className={`font-mono font-bold ${activeFleet.queueTimeMin > 5.0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {activeFleet.queueTimeMin > 5.0 ? "Over Limit" : "Normal"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Idle Fuel Loss:</span>
                <span className="text-rose-400 font-mono font-bold">
                  {(activeFleet.queueTimeMin * 1.8).toFixed(1)} L/trip
                </span>
              </div>
            </div>
          </div>

          {/* Stage 3: Loading */}
          <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 relative group transition-all flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black flex items-center justify-center">
                3
              </span>
              <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                UNDER BUCKET
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">LOADING TIME</p>
              <p className="text-xl font-black text-amber-300 font-mono">
                {activeFleet.loadingTimeMin} <span className="text-xs">min</span>
              </p>
              <p className="text-[11px] text-slate-400">Payload: {activeFleet.truckCapacityTon} Ton</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Spotting Delay:</span>
                <span className="text-white font-mono font-bold">0.4 min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Swing Cycle:</span>
                <span className="text-white font-mono font-bold">26.5 sec</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payload Fill:</span>
                <span className="text-emerald-400 font-mono font-bold">98.2%</span>
              </div>
            </div>
          </div>

          {/* Stage 4: Hauling */}
          <div className="bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 relative group transition-all flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-black flex items-center justify-center">
                4
              </span>
              <span className="text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                LOADED ROUTE
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">HAULING TIME</p>
              <p className="text-xl font-black text-emerald-400 font-mono">
                {activeFleet.haulingTimeMin} <span className="text-xs">min</span>
              </p>
              <p className="text-[11px] text-slate-400">Jarak: {activeFleet.distanceKm} km</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Avg Speed:</span>
                <span className="text-white font-mono font-bold">
                  {((activeFleet.distanceKm / (activeFleet.haulingTimeMin / 60))).toFixed(1)} km/h
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ramp Grade:</span>
                <span className="text-white font-mono font-bold">+7.5%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Segment Telemetry:</span>
                <span className="text-emerald-400 font-mono font-bold">Optimal</span>
              </div>
            </div>
          </div>

          {/* Stage 5: Dumping */}
          <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 relative group transition-all flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-black flex items-center justify-center">
                5
              </span>
              <span className="text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                UNLOAD POINT
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">DUMPING TIME</p>
              <p className="text-xl font-black text-cyan-400 font-mono">
                {activeFleet.dumpingTimeMin} <span className="text-xs">min</span>
              </p>
              <p className="text-[11px] text-slate-400">ROM Crusher / Disposal</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Spotting Time:</span>
                <span className="text-white font-mono font-bold">0.6 min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tipping Time:</span>
                <span className="text-white font-mono font-bold">1.2 min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Disposal Status:</span>
                <span className="text-cyan-400 font-mono font-bold">Clear</span>
              </div>
            </div>
          </div>

          {/* Stage 6: Return Empty */}
          <div className="bg-slate-950/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 relative group transition-all flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-mono text-xs font-black flex items-center justify-center">
                6
              </span>
              <span className="text-[9px] font-bold uppercase bg-teal-500/10 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">
                EMPTY RETURN
              </span>
            </div>

            <div className="my-3 space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-wide">RETURN TIME</p>
              <p className="text-xl font-black text-teal-400 font-mono">
                {activeFleet.returnTimeMin} <span className="text-xs">min</span>
              </p>
              <p className="text-[11px] text-slate-400">Back to {activeFleet.excavatorCode}</p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Empty Speed:</span>
                <span className="text-white font-mono font-bold">
                  {((activeFleet.distanceKm / (activeFleet.returnTimeMin / 60))).toFixed(1)} km/h
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Downhill Retard:</span>
                <span className="text-white font-mono font-bold">Active</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ETA to Shovel:</span>
                <span className="text-teal-400 font-mono font-bold">
                  {(activeFleet.returnTimeMin * 0.4).toFixed(1)} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Cycle Breakdown Formula Bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                FORMULA TOTAL CYCLE TIME ({activeFleet.fleetName})
              </p>
              <p className="text-sm font-black text-white font-mono">
                <span className="text-rose-400 font-bold">{activeFleet.queueTimeMin}m (Queue)</span>
                {" + "}
                <span className="text-amber-300 font-bold">{activeFleet.loadingTimeMin}m (Load)</span>
                {" + "}
                <span className="text-emerald-400 font-bold">{activeFleet.haulingTimeMin}m (Haul)</span>
                {" + "}
                <span className="text-cyan-400 font-bold">{activeFleet.dumpingTimeMin}m (Dump)</span>
                {" + "}
                <span className="text-teal-400 font-bold">{activeFleet.returnTimeMin}m (Return)</span>
                {" = "}
                <span className="text-indigo-400 font-black text-base">{activeFleet.totalCycleTimeMin} min Total</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Match Factor Formula</span>
              <span className="text-white font-mono font-bold">
                MF = ({activeFleet.truckCount} HD × {activeFleet.loadingTimeMin}m) ÷ (1 EX × {activeFleet.totalCycleTimeMin}m) = <strong className="text-amber-400">{activeFleet.matchFactor}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Truck Fleet Assignment & Re-Routing Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              UNIT TRUCK ASSIGNMENT & REAL-TIME DISPATCH MATRIX
            </h3>
            <p className="text-xs text-slate-400">
              Daftar truk yang saat ini beroperasi di {activeFleet.fleetName} beserta status siklus aktif
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddTrucks(activeFleet.fleetId, 1)}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Unit ke Fleet Ini</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeFleet.truckUnits.map((truckUnit, idx) => {
            const stages = ["Loading", "Hauling Loaded", "Dumping", "Returning", "Queued"];
            const assignedStage = stages[idx % stages.length];

            let stageBadge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            if (assignedStage === "Queued") stageBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30";
            if (assignedStage === "Loading") stageBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";
            if (assignedStage === "Dumping") stageBadge = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
            if (assignedStage === "Returning") stageBadge = "bg-teal-500/20 text-teal-300 border-teal-500/30";

            return (
              <div
                key={truckUnit}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white font-mono">{truckUnit}</p>
                      <p className="text-[10px] text-slate-400">{activeFleet.truckModel}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border font-mono ${stageBadge}`}>
                    {assignedStage}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Payload</span>
                    <span className="text-white font-mono font-bold">{activeFleet.truckCapacityTon} Ton</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Speed</span>
                    <span className="text-white font-mono font-bold">{assignedStage === "Queued" ? "0 km/h" : "28.4 km/h"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Trips Shift</span>
                    <span className="text-amber-400 font-mono font-bold">{7 + idx} Rit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">Re-route:</span>
                  <div className="flex items-center gap-1">
                    {fleets
                      .filter((f) => f.fleetId !== activeFleet.fleetId)
                      .map((otherFleet) => (
                        <button
                          key={otherFleet.fleetId}
                          onClick={() => handleReduceTruck(activeFleet.fleetId, otherFleet.fleetId)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded text-[10px] font-mono font-bold cursor-pointer transition-all"
                          title={`Pindahkan ${truckUnit} ke ${otherFleet.fleetName}`}
                        >
                          ➔ {otherFleet.fleetId.replace("FLEET-", "")}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. AI Dispatch Copilot Interactive Quick Dialog */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wide">
              BUTUH ANALISIS DISPATCH LEBIH MENDALAM?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Konsultasikan skenario pergantian shift, simulasi cuaca hujan pada haul road, atau optimasi alokasi bahan bakar dengan AI Copilot.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buka AI Copilot Dispatch</span>
            </button>
          )}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("optimization")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>Scenario Simulator</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
