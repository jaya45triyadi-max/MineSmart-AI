import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Brain,
  Activity,
  Cpu,
  Layers,
  Search,
} from "lucide-react";
import { RcaPipelineStepKey } from "../../../types/rootCauseTypes";

interface LiveInvestigationRunnerProps {
  onRunComplete?: (scenarioTitle: string) => void;
}

export const LiveInvestigationRunner: React.FC<LiveInvestigationRunnerProps> = ({
  onRunComplete,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("Produksi Coal & OB Drop 15%");
  const [customDropPct, setCustomDropPct] = useState<number>(15);
  const [selectedPit, setSelectedPit] = useState<string>("Pit 01 Sangatta - Fleet A");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [investigationResult, setInvestigationResult] = useState<{
    rootCause: string;
    contribution: string;
    recommendation: string;
    pipelinePassed: boolean;
  } | null>(null);

  const pipelineSteps: Array<{ key: RcaPipelineStepKey; label: string; scanMessage: string }> = [
    {
      key: "production",
      label: "1. Production Layer",
      scanMessage: "Memindai log ritase dan output hourly BCM di Pit 01 front... [Defisit -1,875 BCM terdeteksi]",
    },
    {
      key: "fleet",
      label: "2. Fleet Availability",
      scanMessage: "Menganalisis Match Factor (MF=0.71) dan antrean 5 truk di Shovel Loading Face A...",
    },
    {
      key: "downtime",
      label: "3. Downtime & Stoppage",
      scanMessage: "Mendeteksi lonjakan unscheduled downtime excavator +21.4% (3.8 jam terhenti)...",
    },
    {
      key: "hauling",
      label: "4. Hauling Logistics",
      scanMessage: "Memvalidasi waktu siklus hauling (28.4 menit vs target 22.5 menit)...",
    },
    {
      key: "fuel",
      label: "5. Fuel & Energy",
      scanMessage: "Mengevaluasi fuel burn rate & idle solar loss 420 L pada truk antre...",
    },
    {
      key: "weather",
      label: "6. Weather & Pit",
      scanMessage: "Memeriksa sensor curah hujan (2.4 mm/jam) - Kondisi aman, bukan penyebab utama...",
    },
    {
      key: "maintenance",
      label: "7. Maintenance & Telemetry",
      scanMessage: "Membedah sensor PT-021 hidrolik EX-03 (Drop 140 bar) dan sensor suhu slew EX-05 (94°C)...",
    },
  ];

  const handleStartInvestigation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setExecutionLogs([]);
    setInvestigationResult(null);

    let step = 0;
    const interval = setInterval(() => {
      if (step < pipelineSteps.length) {
        const stepInfo = pipelineSteps[step];
        setCurrentStepIndex(step);
        setExecutionLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✔ ${stepInfo.label}: ${stepInfo.scanMessage}`,
        ]);
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setInvestigationResult({
          rootCause: "Downtime excavator lini utama meningkat 21.4% akibat kerusakan selang hidrolik EX-03 dan panas berlebih pada slew motor EX-05.",
          contribution: "64% penurunan produksi berasal dari unit EX-03 (41.0%) dan EX-05 (23.0%).",
          recommendation: "Prioritaskan emergency maintenance EX-03 dan alihkan HD-07 serta HD-12 ke Fleet B untuk menyeimbangkan Match Factor.",
          pipelinePassed: true,
        });
        if (onRunComplete) {
          onRunComplete(selectedMetric);
        }
      }
    }, 700);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Brain className="w-3 h-3 animate-pulse" />
              LIVE AI DIAGNOSTIC ENGINE
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Trigger Investigasi Multi-Pipeline Real-Time
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih anomali atau input target defisit untuk menjalankan penelusuran 7-Layer secara otomatis.
          </p>
        </div>
      </div>

      {/* Input configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            1. Anomali Target Investigasi
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            disabled={isRunning}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
          >
            <option value="Produksi Coal & OB Drop 15%">Produksi Coal & OB Turun 15.0%</option>
            <option value="Fuel Ratio Spike +18.5%">Fuel Ratio Melonjak +18.5%</option>
            <option value="Hauling Cycle Time +29.2%">Hauling Cycle Time Naik +29.2%</option>
            <option value="RKAB Monthly Deficit -12%">RKAB Monthly Target Deficit -12%</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            2. Lokasi Pit & Fleet Front
          </label>
          <select
            value={selectedPit}
            onChange={(e) => setSelectedPit(e.target.value)}
            disabled={isRunning}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
          >
            <option value="Pit 01 Sangatta - Fleet A">Pit 01 Sangatta - Fleet A (Loading Point 01)</option>
            <option value="Pit 02 Tutupan - Fleet B">Pit 02 Tutupan - Fleet B (Overburden Cut)</option>
            <option value="Haul Road KM 4.2 Main Ramp">Haul Road KM 4.2 Main Ramp</option>
            <option value="ROM Stockpile Infeed 03">ROM Stockpile Infeed 03 & Crusher</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleStartInvestigation}
            disabled={isRunning}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                <span>Memindai 7-Layer Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Investigasi AI RCA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Step Scan Indicators */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Pipeline Traversal Progress:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => {
            const isDone = currentStepIndex > idx || (!isRunning && investigationResult !== null);
            const isCurrent = isRunning && currentStepIndex === idx;

            return (
              <div
                key={step.key}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 animate-pulse"
                    : isDone
                    ? "bg-slate-950/90 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}
              >
                <span className="text-[10px] font-mono block font-bold">Layer 0{idx + 1}</span>
                <span className="text-[11px] font-bold block truncate mt-0.5">
                  {step.label.split(". ")[1]}
                </span>
                <div className="mt-1 flex justify-center">
                  {isCurrent ? (
                    <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Console Output */}
      {executionLogs.length > 0 && (
        <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
          {executionLogs.map((log, idx) => (
            <div key={idx} className="text-slate-300">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Investigation Synthesis Output */}
      {investigationResult && (
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/40 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              HASIL SINTESIS AI ROOT CAUSE ANALYSIS (USP)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: ROOT CAUSE */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                ROOT CAUSE
              </span>
              <p className="text-xs font-bold text-white leading-relaxed">
                {investigationResult.rootCause}
              </p>
            </div>

            {/* Box 2: CONTRIBUTION */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                CONTRIBUTION
              </span>
              <p className="text-xs font-bold text-white leading-relaxed">
                {investigationResult.contribution}
              </p>
            </div>

            {/* Box 3: RECOMMENDATION */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                RECOMMENDATION
              </span>
              <p className="text-xs font-bold text-white leading-relaxed">
                {investigationResult.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
