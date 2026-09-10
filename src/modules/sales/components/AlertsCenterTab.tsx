import React from "react";
import { AlertTriangle, Clock, ShieldAlert, FileText, Ship, DollarSign } from "lucide-react";

export const AlertsCenterTab: React.FC = () => {
  const alerts = [
    {
      id: "ALT-001",
      title: "Contract Fulfillment Rate Warning: CTR-2026-PLN-088",
      severity: "MEDIUM",
      category: "CONTRACT",
      description: "Current fulfillment rate is 55.3% with 140 days remaining. Need +1 additional barge load per fortnight to guarantee 100% target.",
      timestamp: "2026-08-13 11:30 WITA",
    },
    {
      id: "ALT-002",
      title: "Vessel Arrival Schedule Notice: MV Orient Ocean",
      severity: "LOW",
      category: "SHIPMENT",
      description: "Vessel ETA at Sangatta Anchorage updated to Aug 18 08:00 WITA. Stockpile SP-01/02/03 blending recipe is fully reserved.",
      timestamp: "2026-08-13 10:15 WITA",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Commercial & Shipment Alerts Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time notification feeds for contract fulfillment risks, vessel laytime delays, quality holds, and payment credit warnings.
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-amber-500/50 transition-all"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{alt.title}</h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {alt.severity}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{alt.description}</p>
            <span className="text-[10px] text-slate-400 block pt-1">{alt.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
