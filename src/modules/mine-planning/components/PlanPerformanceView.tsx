// MINE SMART AI - Plan vs Actual Performance & Audit Trail Component

import React from "react";
import {
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { PlanVsActualPerformance, PlanChangeLog } from "../../../types/minePlanningTypes";

interface PlanPerformanceViewProps {
  performances: PlanVsActualPerformance[];
  changeLogs: PlanChangeLog[];
}

export const PlanPerformanceView: React.FC<PlanPerformanceViewProps> = ({
  performances,
  changeLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Plan vs Actual Performance Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-500" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Evaluasi Akurasi Plan vs Actual & Variance Analysis
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Periode Review</th>
                <th className="py-2.5 px-3 text-right">Target Coal (MT)</th>
                <th className="py-2.5 px-3 text-right">Actual Coal (MT)</th>
                <th className="py-2.5 px-3 text-right">Target OB (MBCM)</th>
                <th className="py-2.5 px-3 text-right">Actual OB (MBCM)</th>
                <th className="py-2.5 px-3 text-center">Variansi Coal %</th>
                <th className="py-2.5 px-3 text-center">SR Actual</th>
                <th className="py-2.5 px-3 text-center">Status Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {performances.map((perf, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{perf.periodLabel}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{perf.coalPlanMt} MT</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-500">{perf.coalActualMt} MT</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{perf.wastePlanMbc} MBCM</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-sky-400">{perf.wasteActualMbc} MBCM</td>
                  <td className="py-3 px-3 text-center font-mono font-extrabold text-emerald-500">
                    +{perf.coalVariancePercent}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-teal-500">{perf.srActual}:1</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">
                      {perf.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail & Change Log Viewer */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Audit Trail Perubahan Plan & Log Pengesahan Official (Prompt 9 Governance)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Waktu & Tanggal</th>
                <th className="py-2.5 px-3">User / Engineering Role</th>
                <th className="py-2.5 px-3">Tindakan / Action</th>
                <th className="py-2.5 px-3">Nilai Lama (Old Value)</th>
                <th className="py-2.5 px-3">Nilai Baru (New Value)</th>
                <th className="py-2.5 px-3">Alasan / Justifikasi</th>
                <th className="py-2.5 px-3 text-center">Status Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {changeLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{log.userName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-teal-500 font-bold">{log.action}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.oldValue}</td>
                  <td className="py-3 px-3 font-mono text-sky-400 font-bold">{log.newValue}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px]">{log.reason}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        log.approvalStatus === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {log.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
