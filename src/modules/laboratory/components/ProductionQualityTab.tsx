import React from "react";
import { Compass, Layers, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const ProductionQualityTab: React.FC = () => {
  const reconData = [
    { seam: "Seam A2 (Pit Alpha)", planGAR: 5800, actualGAR: 5850, varGAR: "+50", planTS: 0.60, actualTS: 0.58, status: "EXCEEDS_PLAN" },
    { seam: "Seam B1 (North Block)", planGAR: 5400, actualGAR: 5420, varGAR: "+20", planTS: 0.65, actualTS: 0.65, status: "MATCH_PLAN" },
    { seam: "Seam C1 (Pit Beta)", planGAR: 5000, actualGAR: 4850, varGAR: "-150", planTS: 0.70, actualTS: 1.48, status: "HIGH_SULFUR_ALERT" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" /> Rekonsiliasi Kualitas Model Geology vs Actual Lab
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan antara estimasi kualitas dari Mine Planning / Block Model Geologi dengan hasil aktual analisis laboratorium.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3">Seam / Location</th>
              <th className="py-3 px-3">Plan GAR</th>
              <th className="py-3 px-3">Actual Lab GAR</th>
              <th className="py-3 px-3">Variansi GAR</th>
              <th className="py-3 px-3">Plan TS</th>
              <th className="py-3 px-3">Actual Lab TS</th>
              <th className="py-3 px-3">Status Reconciliation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {reconData.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">{item.seam}</td>
                <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">{item.planGAR}</td>
                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.actualGAR}</td>
                <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.varGAR}</td>
                <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">{item.planTS}%</td>
                <td className="py-3.5 px-3 font-mono font-bold text-red-600 dark:text-red-400">{item.actualTS}%</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === "EXCEEDS_PLAN"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : item.status === "MATCH_PLAN"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
