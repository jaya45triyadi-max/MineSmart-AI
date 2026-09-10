// MINE SMART AI - Predictive Maintenance Command Center View

import React from "react";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Clock,
  TrendingDown,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  Wrench,
  Gauge,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck,
} from "lucide-react";
import {
  EquipmentHealthScore,
  FailurePrediction,
  DowntimePrediction,
  EquipmentRiskScore,
  PredictiveAlertItem,
} from "../../types/predictiveTypes";

interface PredictiveCommandCenterProps {
  healthScores: EquipmentHealthScore[];
  failurePredictions: FailurePrediction[];
  downtimePredictions: DowntimePrediction[];
  riskScores: EquipmentRiskScore[];
  alerts: PredictiveAlertItem[];
  onSelectSubTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
}

export const PredictiveCommandCenter: React.FC<PredictiveCommandCenterProps> = ({
  healthScores,
  failurePredictions,
  downtimePredictions,
  riskScores,
  alerts,
  onSelectSubTab,
  onOpenAIAssistant,
}) => {
  // KPI Calculations
  const totalMonitored = healthScores.length;
  const healthyCount = healthScores.filter((h) => h.statusCategory === "Excellent" || h.statusCategory === "Good").length;
  const watchlistCount = healthScores.filter((h) => h.statusCategory === "Watch").length;
  const highRiskCount = healthScores.filter((h) => h.statusCategory === "Poor").length;
  const criticalRiskCount = healthScores.filter((h) => h.statusCategory === "Critical").length;

  const predictedFailuresCount = failurePredictions.length;
  const totalPredictedDowntime = downtimePredictions.reduce((acc, d) => acc + d.potentialDowntimeHours, 0);
  const overdueMaintenanceCount = riskScores.reduce((acc, r) => acc + r.overduePMCount, 0);

  const avgHealthScore = totalMonitored > 0
    ? Math.round(healthScores.reduce((acc, h) => acc + h.healthScore, 0) / totalMonitored)
    : 0;

  const fleetRiskScoreAvg = totalMonitored > 0
    ? Math.round(riskScores.reduce((acc, r) => acc + r.riskScore, 0) / totalMonitored)
    : 0;

  const avgConfidence = totalMonitored > 0
    ? Math.round(healthScores.reduce((acc, h) => acc + h.confidencePercent, 0) / totalMonitored)
    : 0;

  const activeCriticalAlerts = alerts.filter((a) => a.severity === "CRITICAL" && a.status !== "Closed");

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Copilot Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-black text-white tracking-tight">Predictive AI Maintenance Command Center</h2>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/40">
              Live AI Inference
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Monitoring equipment health scores, component failure risk, downtime forecasts, and AI maintenance recommendations across site heavy fleet.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Tanya AI Predictive Copilot</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Equipment Monitored</span>
            <Cpu className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalMonitored} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>100% Coverage</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Healthy Equipment</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{healthyCount} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Score &gt;= 75</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Watch & High Risk</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-500">{watchlistCount + highRiskCount} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">{watchlistCount} Watch | {highRiskCount} Poor</div>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3.5 dark:bg-rose-950/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-medium">
            <span>Critical Risk Units</span>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">{criticalRiskCount} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="mt-1 text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Immediate Action Req</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Predicted Failures</span>
            <Activity className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{predictedFailuresCount} <span className="text-xs text-slate-400 font-normal">cases</span></div>
          <div className="mt-1 text-[10px] text-indigo-500 font-medium">Potential Failures</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Predicted Downtime</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">{totalPredictedDowntime} <span className="text-xs text-slate-400 font-normal">Hours</span></div>
          <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{overdueMaintenanceCount} Overdue PMs</div>
        </div>
      </div>

      {/* Fleet Averages Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fleet Health Average</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgHealthScore} <span className="text-xs text-slate-400">/ 100</span></p>
            <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Weighted across all active units</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-sm">
            {avgHealthScore}%
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fleet Risk Score Index</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{fleetRiskScoreAvg} <span className="text-xs text-slate-400">/ 100</span></p>
            <p className="text-[10px] text-amber-500 font-medium mt-0.5">Probability x Impact Matrix</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm">
            {fleetRiskScoreAvg}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Prediction Confidence</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgConfidence}%</p>
            <p className="text-[10px] text-indigo-500 font-medium mt-0.5">Ground-truth validated features</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-sm">
            {avgConfidence}%
          </div>
        </div>
      </div>

      {/* Critical Active Alerts & High Risk Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Critical Predictive Alerts</h3>
            </div>
            <button
              onClick={() => onSelectSubTab("/predictive-maintenance/alerts")}
              className="text-xs text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All Alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 dark:bg-rose-950/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-rose-600 dark:text-rose-400 text-xs uppercase tracking-wide">
                    {alert.unitCode} • {alert.alertType}
                  </span>
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{alert.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist & High Risk Equipment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">High Risk Equipment Watchlist</h3>
            </div>
            <button
              onClick={() => onSelectSubTab("/predictive-maintenance/equipment-health")}
              className="text-xs text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All Health Cards</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {healthScores
              .filter((h) => h.statusCategory === "Critical" || h.statusCategory === "Poor" || h.statusCategory === "Watch")
              .map((hs) => (
                <div
                  key={hs.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-black text-xs ${
                        hs.healthScore < 40
                          ? "bg-rose-500/20 text-rose-500"
                          : hs.healthScore < 60
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {hs.healthScore}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{hs.unitCode} ({hs.category})</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{hs.brandModel} • {hs.engineHours} SMU</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                        hs.statusCategory === "Critical"
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          : hs.statusCategory === "Poor"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {hs.statusCategory}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Fail Prob: <span className="font-bold text-slate-900 dark:text-white">{hs.failureProbabilityPercent}%</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Direct Module Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onSelectSubTab("/predictive-maintenance/failure-prediction")}
          className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all cursor-pointer text-left group"
        >
          <Activity className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-slate-900 dark:text-white text-xs mt-2">Failure Predictions</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Analisis potensi breakdown komponen</p>
        </button>

        <button
          onClick={() => onSelectSubTab("/predictive-maintenance/recommendations")}
          className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all cursor-pointer text-left group"
        >
          <Wrench className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-slate-900 dark:text-white text-xs mt-2">AI Recommendations</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Convert AI insights ke Work Order</p>
        </button>

        <button
          onClick={() => onSelectSubTab("/predictive-maintenance/risk")}
          className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all cursor-pointer text-left group"
        >
          <Gauge className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-slate-900 dark:text-white text-xs mt-2">Risk Matrix & Criticality</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Matriks Probabilitas x Dampak</p>
        </button>

        <button
          onClick={() => onSelectSubTab("/predictive-maintenance/reports")}
          className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all cursor-pointer text-left group"
        >
          <FileCheck className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-slate-900 dark:text-white text-xs mt-2">What-If Simulation</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Simulasi dampak downtime operasional</p>
        </button>
      </div>
    </div>
  );
};
