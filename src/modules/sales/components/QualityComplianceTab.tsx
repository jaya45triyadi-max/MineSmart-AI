import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Lock, Unlock, FlaskConical } from "lucide-react";
import { Shipment } from "../../../types/salesTypes";

interface QualityComplianceTabProps {
  shipments: Shipment[];
  onToggleQualityHold: (shipmentId: string, hold: boolean, reason?: string) => void;
}

export const QualityComplianceTab: React.FC<QualityComplianceTabProps> = ({
  shipments,
  onToggleQualityHold,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-500" />
          Commercial Quality Gate & Quality Hold Lock
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automatic verification of ISO 17025 lab assays against buyer contract specifications. Non-compliant batches trigger immediate Quality Hold locks.
        </p>
      </div>

      <div className="space-y-4">
        {shipments.map((shp) => (
          <div
            key={shp.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm transition-all space-y-4 ${
              shp.isQualityHold
                ? "border-red-500/50 bg-red-950/10"
                : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {shp.shipmentNumber}
                  </span>
                  <span className="text-xs text-slate-500">• {shp.vesselName}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {shp.customerName} ({shp.productName})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    shp.qualityStatus === "COMPLIANT"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                  }`}
                >
                  {shp.qualityStatus}
                </span>

                <button
                  onClick={() => onToggleQualityHold(shp.id, !shp.isQualityHold, "Manual Quality Inspector Review")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    shp.isQualityHold
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {shp.isQualityHold ? (
                    <>
                      <Lock className="w-3.5 h-3.5" /> QUALITY HOLD LOCKED
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-500" /> Quality Released
                    </>
                  )}
                </button>
              </div>
            </div>

            {shp.isQualityHold && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>SHIPMENT LOCKED: {shp.holdReason || "Quality non-compliance hold applied by QA Officer."}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Target GAR</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">5,800 kcal/kg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Lab Assayed GAR</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">5,850 kcal/kg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Max Total Moisture</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">25.0%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Lab Assayed TM</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">22.4%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
