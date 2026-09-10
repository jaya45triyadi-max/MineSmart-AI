// MINE SMART AI - Top Operational Issues Component

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { TopOperationalIssueItem } from "../../../services/dashboard/DashboardAnalyticsService";

interface TopOperationalIssuesProps {
  issues: TopOperationalIssueItem[];
  onNavigateModule: (moduleKey: string) => void;
}

export const TopOperationalIssues: React.FC<TopOperationalIssuesProps> = ({ issues, onNavigateModule }) => {
  return (
    <div className="space-y-2.5">
      {issues.map((item) => (
        <div
          key={item.id}
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-amber-400 text-xs flex-shrink-0">
              #{item.rank}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <span
                  className={`px-1.5 py-0.2 rounded border text-[9px] font-extrabold uppercase ${
                    item.severity === "CRITICAL"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <p className="text-[11px] text-rose-400 font-semibold mt-0.5">{item.impactText}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Saran AI: {item.recommendedAction}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateModule(item.sourceModuleKey)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 self-end sm:self-center transition-colors whitespace-nowrap"
          >
            <span>Tindak Lanjuti</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
