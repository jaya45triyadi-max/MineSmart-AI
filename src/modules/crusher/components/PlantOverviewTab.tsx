import React from "react";
import {
  Factory,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Layers,
  Flame,
  Wrench,
  Gauge,
  Play,
  Pause,
  SlidersHorizontal,
} from "lucide-react";
import { ProcessingPlant, Crusher, ProcessingAlert, ProcessingOutput } from "../../../types/processingPlantTypes";

interface PlantOverviewTabProps {
  plants: ProcessingPlant[];
  crushers: Crusher[];
  alerts: ProcessingAlert[];
  outputs: ProcessingOutput[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
  onSelectTab: (tabKey: string) => void;
}

export const PlantOverviewTab: React.FC<PlantOverviewTabProps> = ({
  plants,
  crushers,
  alerts,
  outputs,
  selectedPlantId,
  onSelectPlant,
  onOpenAiAnalysis,
  onSelectTab,
}) => {
  const activePlant = plants.find((p) => p.plantId === selectedPlantId) || plants[0];
  const activeCrushers = crushers.filter((c) => c.plantId === activePlant?.plantId);

  // Computed overview metrics
  const totalThroughput = plants.reduce((sum, p) => sum + (p.operatingStatus === "ONLINE" || p.operatingStatus === "PARTIAL_OPERATION" ? p.currentThroughput : 0), 0);
  const avgAvailability = Math.round((plants.reduce((sum, p) => sum + p.availability, 0) / (plants.length || 1)) * 10) / 10;
  const avgUtilization = Math.round((plants.reduce((sum, p) => sum + p.utilization, 0) / (plants.length || 1)) * 10) / 10;
  const totalTodayOutput = outputs.reduce((sum, o) => sum + o.quantity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE":
      case "RUNNING":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PARTIAL_OPERATION":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "MAINTENANCE":
      case "BREAKDOWN":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "STANDBY":
      case "IDLE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Command KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Feed Rate</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            2,780 <span className="text-xs font-normal text-slate-500">t/h</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Target 2,800 t/h (99.2%)
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Live Throughput</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {totalThroughput.toLocaleString()} <span className="text-xs font-normal text-slate-500">t/h</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Combined 3 Plant Units
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Plant Availability</span>
            <Gauge className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {avgAvailability}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            +1.8% vs Target 92.0%
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Utilization Rate</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {avgUtilization}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target 80.0% (Optimum)
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Product Output Today</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {totalTodayOutput.toLocaleString()} <span className="text-xs font-normal text-slate-500">Ton</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Yield Average: 94.3%
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Quality Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            96.8%
          </div>
          <div className="text-[11px] text-amber-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 1 Out-of-Spec Warning
          </div>
        </div>
      </div>

      {/* AI Command Center Quick Plant Insight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI Plant Optimization Insight
            </div>
            <h3 className="text-base font-bold text-white">
              Crusher CP-01 running at optimum 1,325 t/h. Secondary Screen 102 experiencing moisture load surge.
            </h3>
            <p className="text-xs text-indigo-200/80 max-w-3xl">
              Throughput is stable (+2.4% shift variance). AI recommends adjusting feeder 101 vibration frequency by +3Hz to clear fine coal recirculation on Vibrating Screen 102.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAiAnalysis("Kenapa throughput crusher CP-01 turun saat feed basah?")}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Command
            </button>
            <button
              onClick={() => onSelectTab("bottleneck")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
            >
              Bottleneck Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Processing Plant Profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Factory className="w-5 h-5 text-indigo-500" />
              Processing Plant Profiles
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time operating status, throughput, availability, and unit capacity
            </p>
          </div>
          <button
            onClick={() => onSelectTab("crusher")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Manage Equipment & Crushers <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plants.map((plant) => {
            const isSelected = plant.plantId === activePlant?.plantId;
            return (
              <div
                key={plant.id}
                onClick={() => onSelectPlant(plant.plantId)}
                className={`bg-white dark:bg-[#111A2C] border rounded-2xl p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {plant.plantCode} • {plant.plantType}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {plant.plantName}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(
                      plant.operatingStatus
                    )}`}
                  >
                    ● {plant.operatingStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {plant.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Design Capacity</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {plant.designCapacity} {plant.capacityUnit}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Current Throughput</span>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">
                      {plant.currentThroughput} {plant.capacityUnit}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Availability</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {plant.availability}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Utilization</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {plant.utilization}%
                    </div>
                  </div>
                </div>

                {/* Feed vs Output Status */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Live ROM Feed:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {plant.currentFeed} t/h
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Live Product Output:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {plant.currentOutput} t/h
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlant(plant.plantId);
                      onSelectTab("throughput");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAiAnalysis(`Analisis performa dan efisiensi plant ${plant.plantName}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Analysis
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Plant Flow Diagram */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Live Process Flow Schema — {activePlant?.plantName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive material flow circuit from ROM feed hopper to crushed coal product stockpile
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Active Plant: <strong className="text-slate-800 dark:text-slate-200">{activePlant?.plantCode}</strong>
            </span>
          </div>
        </div>

        {/* Process Flow Map */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 relative overflow-x-auto">
          <div className="flex items-center justify-between min-w-[800px] gap-4 py-2">
            {/* Step 1: ROM Dump */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-36 text-center space-y-1">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mb-1">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">ROM FEED</span>
              <span className="text-xs font-bold text-white">Pit 1 North</span>
              <span className="text-[11px] text-emerald-400 font-mono">1,400 t/h</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Step 2: Feeder */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-36 text-center space-y-1">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mb-1">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">APRON FEEDER</span>
              <span className="text-xs font-bold text-white">AF-101</span>
              <span className="text-[11px] text-emerald-400 font-mono">1,400 t/h</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Step 3: Primary Crusher */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 w-40 text-center space-y-1 ring-1 ring-indigo-500/30">
              <div className="p-2 rounded-lg bg-indigo-500/30 text-indigo-300 mb-1">
                <Factory className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-indigo-300 font-semibold tracking-wider">PRIMARY CRUSHER</span>
              <span className="text-xs font-bold text-white">Jaw Crusher CR-101</span>
              <span className="text-[11px] text-emerald-400 font-mono">1,380 t/h (RUNNING)</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Step 4: Screen */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-36 text-center space-y-1">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 mb-1">
                <Gauge className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">SCREENING</span>
              <span className="text-xs font-bold text-white">Vib. Screen 102</span>
              <span className="text-[11px] text-amber-400 font-mono">78% Efficiency</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Step 5: Secondary Crusher */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-40 text-center space-y-1">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mb-1">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">SECONDARY SIZER</span>
              <span className="text-xs font-bold text-white">Roll Crusher CR-102</span>
              <span className="text-[11px] text-emerald-400 font-mono">1,325 t/h</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Step 6: Product Stockpile */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/40 w-40 text-center space-y-1">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider">PRODUCT OUTPUT</span>
              <span className="text-xs font-bold text-white">Stockpile 1A</span>
              <span className="text-[11px] text-emerald-400 font-mono">5,200 GAR Coal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Processing Plant Alerts */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active Plant Alerts & Operational Warnings
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
            {alerts.length} Warnings Logged
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {alert.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {alert.description}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Plant: {alert.plantName}</span>
                  <span>Assigned: {alert.assignedTo}</span>
                  <span>Timestamp: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                  Status: {alert.status}
                </span>
                <button
                  onClick={() => onOpenAiAnalysis(`Rekomendasi penanganan alert: ${alert.title}`)}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Fix AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
