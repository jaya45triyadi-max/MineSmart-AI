import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Flame,
  Droplets,
  Activity,
  Filter,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { QualityResult } from "../../../types/laboratoryTypes";

interface MineQualityControlTabProps {
  results: QualityResult[];
}

export const MineQualityControlTab: React.FC<MineQualityControlTabProps> = ({ results }) => {
  const [selectedSeam, setSelectedSeam] = useState("ALL");

  const seamData = [
    { seam: "Seam A1 (Pit Alpha)", gar: 5880, tm: 22.1, ash: 5.6, ts: 0.55, status: "HIGH_GRADE", tonnage: "145,000 MT" },
    { seam: "Seam A2 (Pit Alpha)", gar: 5850, tm: 22.4, ash: 5.8, ts: 0.58, status: "HIGH_GRADE", tonnage: "210,000 MT" },
    { seam: "Seam B1 (Pit Alpha)", gar: 5420, tm: 26.5, ash: 7.4, ts: 0.65, status: "MEDIUM_GRADE", tonnage: "180,000 MT" },
    { seam: "Seam B2 (North Block)", gar: 5210, tm: 28.0, ash: 8.2, ts: 0.72, status: "MEDIUM_GRADE", tonnage: "95,000 MT" },
    { seam: "Seam C1 (Pit Beta)", gar: 4850, tm: 31.0, ash: 9.8, ts: 1.48, status: "HIGH_SULFUR_ALERT", tonnage: "120,000 MT" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" /> Mine Quality Control & Seam Quality Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemetaan parameter kualitas batubara per Pit, Seam, dan Block tambang untuk pengendalian grade tambang dan rekomendasi penambangan selektif.
          </p>
        </div>
      </div>

      {/* Coal Quality Seam Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seamData.map((item) => (
          <div
            key={item.seam}
            className={`p-5 rounded-2xl border transition bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-500/50 ${
              item.status === "HIGH_SULFUR_ALERT"
                ? "border-red-500/50 bg-red-50/20 dark:bg-red-950/10"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {item.seam}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  item.status === "HIGH_GRADE"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : item.status === "MEDIUM_GRADE"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                }`}
              >
                {item.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">GAR (kcal/kg)</span>
                <strong className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                  {item.gar}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Total Sulfur (%)</span>
                <strong
                  className={`text-base font-extrabold ${
                    item.ts > 1.0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.ts}%
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
              <div>TM: <strong className="text-slate-700 dark:text-slate-300">{item.tm}%</strong></div>
              <div>Ash: <strong className="text-slate-700 dark:text-slate-300">{item.ash}%</strong></div>
              <div className="text-right">Est: <strong className="text-slate-700 dark:text-slate-300">{item.tonnage}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
