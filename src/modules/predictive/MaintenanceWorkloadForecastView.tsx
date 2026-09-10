// MINE SMART AI - Maintenance Workload Forecast View

import React from "react";
import {
  Clock,
  Wrench,
  Users,
  Coins,
  Calendar,
  Sparkles,
} from "lucide-react";
import { WorkloadForecastItem } from "../../types/predictiveTypes";

interface MaintenanceWorkloadForecastViewProps {
  workloadForecasts: WorkloadForecastItem[];
  onOpenAIAssistant: () => void;
}

export const MaintenanceWorkloadForecastView: React.FC<MaintenanceWorkloadForecastViewProps> = ({
  workloadForecasts,
  onOpenAIAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>AI Maintenance Workload & Resource Forecast</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proyeksi beban kerja teknisi workshop, alokasi man-hour, dan perkiraan biaya parts untuk 7, 14, 30, dan 90 hari.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 px-3.5 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Workload AI</span>
        </button>
      </div>

      {/* Grid Cards for Periods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workloadForecasts.map((wf, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{wf.periodLabel}</h3>
              </div>
              <span className="rounded bg-purple-500/15 px-2.5 py-0.5 text-xs font-black text-purple-500">
                {wf.expectedWorkOrdersCount} Planned WOs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">UPCOMING PMs</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{wf.upcomingPMCount} Scheduled</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">PREDICTED FAILURES</span>
                <span className="text-base font-black text-rose-500">{wf.predictedFailureCount} Cases</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TECHNICIAN MAN-HOURS</span>
                <span className="text-base font-black text-indigo-500">{wf.expectedTechnicianHours} Hours</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">EST. DOWNTIME</span>
                <span className="text-base font-black text-purple-500">{wf.potentialDowntimeHoursTotal} Hours</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Est. Parts Budget:</span>
              <span className="font-black text-emerald-500 text-sm">
                Rp {(wf.estimatedPartsCostIDR / 1000000).toLocaleString()} Juta
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
