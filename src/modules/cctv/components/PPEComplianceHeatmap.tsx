// MINE SMART AI - PPE Compliance Heatmap & Safety Zone Analytics

import React from "react";
import {
  Activity,
  CheckCircle2,
  HardHat,
  Layers,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { PPEZoneSummary } from "../../../types/cctvTypes";

interface PPEComplianceHeatmapProps {
  zoneSummaries: PPEZoneSummary[];
}

export const PPEComplianceHeatmap: React.FC<PPEComplianceHeatmapProps> = ({
  zoneSummaries,
}) => {
  return (
    <div className="space-y-4">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-emerald-400" />
            Zona Kepatuhan APD (PPE Compliance Heatmap per Lokasi)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis Real-time Deteksi Helm (Hardhat), Rompi Reflektif (Vest), dan Sepatu Safety (Boots) sesuai Kepmen ESDM 1827/2018.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl">
            Target K3: ≥ 95.0%
          </span>
        </div>
      </div>

      {/* Grid of Safety Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {zoneSummaries.map((zone, idx) => {
          const isCompliant = zone.overallCompliancePct >= 95;
          const isWarning = zone.overallCompliancePct < 90;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all duration-200 bg-slate-900/90 shadow-lg ${
                isWarning
                  ? "border-rose-900/60 hover:border-rose-700"
                  : isCompliant
                  ? "border-slate-800 hover:border-emerald-500/40"
                  : "border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{zone.zoneName}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>{zone.totalWorkersObserved} Pekerja Terpantau</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-extrabold font-mono ${
                      isCompliant
                        ? "text-emerald-400"
                        : isWarning
                        ? "text-rose-400"
                        : "text-amber-400"
                    }`}
                  >
                    {zone.overallCompliancePct.toFixed(1)}%
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">PPE INDEX</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompliant
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : isWarning
                      ? "bg-gradient-to-r from-rose-500 to-red-500"
                      : "bg-gradient-to-r from-amber-500 to-orange-400"
                  }`}
                  style={{ width: `${zone.overallCompliancePct}%` }}
                ></div>
              </div>

              {/* Sub-item PPE Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                {/* 1. Helmet */}
                <div className="p-2 rounded-xl bg-slate-850/90 border border-slate-750">
                  <div className="text-[9px] text-slate-400">HELMET</div>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      zone.helmetCompliancePct >= 95 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {zone.helmetCompliancePct.toFixed(1)}%
                  </div>
                </div>

                {/* 2. Vest */}
                <div className="p-2 rounded-xl bg-slate-850/90 border border-slate-750">
                  <div className="text-[9px] text-slate-400">VEST</div>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      zone.vestCompliancePct >= 95 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {zone.vestCompliancePct.toFixed(1)}%
                  </div>
                </div>

                {/* 3. Boots */}
                <div className="p-2 rounded-xl bg-slate-850/90 border border-slate-750">
                  <div className="text-[9px] text-slate-400">BOOTS</div>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      zone.bootsCompliancePct >= 95 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {zone.bootsCompliancePct.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Footer violation indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Pelanggaran Terdeteksi:</span>
                <span
                  className={`font-mono font-bold ${
                    zone.violationsCount > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {zone.violationsCount} Temuan K3
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
