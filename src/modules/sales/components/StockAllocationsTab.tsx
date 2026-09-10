import React from "react";
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Boxes,
  ArrowUpRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { SalesAllocation } from "../../../types/salesTypes";

interface StockAllocationsTabProps {
  allocations: SalesAllocation[];
  onConfirmAllocation: (id: string) => void;
}

export const StockAllocationsTab: React.FC<StockAllocationsTabProps> = ({
  allocations,
  onConfirmAllocation,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Boxes className="w-5 h-5 text-amber-500" />
          Stockpile & Quality Allocation Engine
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time reservation of stockpile tonnages and quality assay verification prior to conveyor loading dispatch.
        </p>
      </div>

      {/* Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allocations.map((alc) => (
          <div
            key={alc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                  {alc.allocationCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  SO Ref: {alc.salesOrderNumber}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  alc.status === "CONSUMED"
                    ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                    : alc.status === "RESERVED"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {alc.status}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-slate-500 block font-semibold">Stockpile Origin</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{alc.stockpileName}</p>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-1">
                <span>Allocated Tonnage:</span>
                <strong className="text-amber-600 dark:text-amber-400 text-sm">
                  {alc.allocatedQuantity.toLocaleString("id-ID")} MT
                </strong>
              </div>
            </div>

            {/* Quality Snapshot Assay */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
                Approved Lab Quality Snapshot
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[9px] text-slate-500 block">GAR</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{alc.qualitySnapshot.gar}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span className="text-[9px] text-slate-500 block">TM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{alc.qualitySnapshot.tm}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span className="text-[9px] text-slate-500 block">Ash</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{alc.qualitySnapshot.ash}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span className="text-[9px] text-slate-500 block">TS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{alc.qualitySnapshot.ts}%</span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Stockpile Available Capacity Verified
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Quality Spec Compliant with Contract Terms
              </div>
            </div>

            {alc.status === "RESERVED" && (
              <button
                onClick={() => onConfirmAllocation(alc.id)}
                className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Confirm Stock Release to Jetty
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
