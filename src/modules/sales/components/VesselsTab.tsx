import React from "react";
import { Anchor, ShieldCheck, Ship, Navigation } from "lucide-react";
import { Vessel } from "../../../types/salesTypes";

interface VesselsTabProps {
  vessels: Vessel[];
}

export const VesselsTab: React.FC<VesselsTabProps> = ({ vessels }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-blue-500" />
          Vessel Fleet & Transshipment Register
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Maritime vessels, river barges, tugboat fleets, deadweight tonnage (DWT), draft limits, and voyage availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vessels.map((vsl) => (
          <div
            key={vsl.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  {vsl.imoNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {vsl.vesselName}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  vsl.status === "AVAILABLE"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {vsl.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Vessel Type:</span>
                <strong className="text-slate-800 dark:text-slate-200">{vsl.vesselType}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Flag Country:</span>
                <strong className="text-slate-800 dark:text-slate-200">{vsl.flag}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Capacity DWT:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{vsl.capacity.toLocaleString("id-ID")} MT</strong>
              </div>
              <div className="flex justify-between">
                <span>Draft Clearance:</span>
                <strong className="text-slate-800 dark:text-slate-200">{vsl.draft} meters</strong>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
              Owner: {vsl.owner}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
