// MINE SMART AI - Fleet AI Copilot & Real-Time Optimization Modal

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Fuel,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { FleetKPIOverview, FleetUnitProfile } from "../../../types/fleetManagementTypes";

interface FleetAIOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiOverview: FleetKPIOverview;
  units: FleetUnitProfile[];
  onApplyOptimization: (suggestionId: string) => void;
}

export const FleetAIOptimizerModal: React.FC<FleetAIOptimizerModalProps> = ({
  isOpen,
  onClose,
  kpiOverview,
  units,
  onApplyOptimization,
}) => {
  const [appliedList, setAppliedList] = useState<string[]>([]);

  if (!isOpen) return null;

  const aiRecommendations = [
    {
      id: "ai-disp-01",
      category: "DISPATCH_BALANCING",
      title: "Eliminasi Antrian Shovel EX-3600-01 (Pit 1 South)",
      description:
        "Terdeteksi antrian 3 unit HD785 di loading pocket EX-3600-01 (Waktu antri rata-rata 5.4 menit). AI merekomendasikan re-routing DT-785-02 ke Loading Shovel PC2000-8 di Pit 2 yang memiliki waktu tunggu 0 menit.",
      impact: "+480 Ton Produksi / Shift • Menghemat 18.5 Liter BBM Idle",
      severity: "HIGH_GAIN",
      actionText: "Terapkan Re-Dispatch DT-785-02",
    },
    {
      id: "ai-fuel-02",
      category: "FUEL_EFFICIENCY",
      title: "Optimasi Kecepatan Jalan Angkut (Eco-Speed Advisory)",
      description:
        "Tiga unit HD785 terdeteksi melaju pada kecepatan rata-rata >32 km/h di tanjakan segmen ramp B-3 dengan RPM mesin 2100 (Over-rev). AI menyarankan pengaturan batas kecepatan adaptif 26 km/h pada gear 4 untuk efisiensi bahan bakar.",
      impact: "Penghematan 42 Liter Solar B35 / Shift (~$46.2 USD / Shift)",
      severity: "MEDIUM_GAIN",
      actionText: "Kirim Broadcast Eco-Speed ke FMS Cab",
    },
    {
      id: "ai-pm-03",
      category: "PREDICTIVE_MAINTENANCE",
      title: "Peringatan Dini Penurunan Tekanan Oli DT-785-03",
      description:
        "Telemetri DT-785-03 mendeteksi penurunan tekanan oli mesin ke 110 kPa pada suhu 98°C saat mendaki ramp. Unit telah distop otomatis untuk mencegah catastrophic engine seizure.",
      impact: "Mencegah Biaya Kerusakan Overhaul Mesin senilai $45,000 USD",
      severity: "SAFETY_CRITICAL",
      actionText: "Konfirmasi Work Order Service Truck ST-01",
    },
    {
      id: "ai-fatigue-04",
      category: "FATIGUE_PREVENTION",
      title: "Fatigue Monitoring Operator Shift 1",
      description:
        "Operator Joko Susilo (DT-785-03) mencatat fatigue score 34 (Mendekati ambang batas). Disarankan rotasi istirahat 15 menit dan minum air terhidrasi pada pergantian jam ke-6 shift.",
      impact: "Zero Accident Compliance & Peningkatan Fokus Operator",
      severity: "SAFETY_CRITICAL",
      actionText: "Kirim Notifikasi Rehat ke Supervisor Pit",
    },
  ];

  const handleApply = (id: string) => {
    setAppliedList([...appliedList, id]);
    onApplyOptimization(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-purple-500/30 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>AI Fleet Optimization Copilot</span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  REAL-TIME DISPATCH ADVISORY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Optimasi otomatis alokasi armada, minimasi antrian shovel, efisiensi konsumsi BBM, dan pencegahan kerusakan unit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {aiRecommendations.map((rec) => {
            const isApplied = appliedList.includes(rec.id);
            return (
              <div
                key={rec.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-purple-500/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {rec.category}
                      </span>
                      <span className="text-xs font-black text-white">{rec.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Estimasi Dampak Operasional:
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{rec.impact}</span>
                  </div>

                  <button
                    disabled={isApplied}
                    onClick={() => handleApply(rec.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isApplied
                        ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-md shadow-purple-900/40"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Telah Diterapkan</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-yellow-300" />
                        <span>{rec.actionText}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Powered by DeepMind Gemini Mining Optimization Engine
          </span>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup Copilot
          </button>
        </div>
      </div>
    </div>
  );
};
