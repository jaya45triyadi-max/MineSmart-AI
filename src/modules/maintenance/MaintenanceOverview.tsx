// MINE SMART AI - Maintenance Executive Overview & KPI Dashboard

import React from "react";
import {
  Wrench,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  ChevronRight,
  DollarSign,
  Plus,
  AlertOctagon,
  CalendarClock
} from "lucide-react";
import {
  WorkOrder,
  SparePart,
  MaintenanceTypeDefinition,
  AIEarlyWarningAlert,
  MaintenanceKPIs,
  WorkOrderStage
} from "../../types/maintenanceTypes";

interface MaintenanceOverviewProps {
  kpis: MaintenanceKPIs;
  workOrders: WorkOrder[];
  spareParts: SparePart[];
  maintenanceTypes: MaintenanceTypeDefinition[];
  earlyWarnings: AIEarlyWarningAlert[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onNavigateTab: (tab: string) => void;
  onOpenCreateWO: () => void;
  onOpenAIAssistant: () => void;
  onConvertWarning: (warningId: string) => void;
}

const STAGES: { stage: WorkOrderStage; label: string; icon: any; color: string }[] = [
  { stage: "Request", label: "Stage 1: Request", icon: Plus, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { stage: "Approval", label: "Stage 2: Approval", icon: ShieldCheck, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { stage: "Assignment", label: "Stage 3: Assignment", icon: Layers, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { stage: "Repair", label: "Stage 4: Repair", icon: Wrench, color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { stage: "Testing", label: "Stage 5: Testing", icon: Activity, color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  { stage: "Closing", label: "Stage 6: Closing", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
];

export const MaintenanceOverview: React.FC<MaintenanceOverviewProps> = ({
  kpis,
  workOrders,
  spareParts,
  maintenanceTypes,
  earlyWarnings,
  onSelectWorkOrder,
  onNavigateTab,
  onOpenCreateWO,
  onOpenAIAssistant,
  onConvertWarning,
}) => {
  const activeWOs = workOrders.filter((w) => w.stage !== "Closing");
  const lowStockParts = spareParts.filter((p) => p.isLowStock);
  const activeEarlyWarnings = earlyWarnings.filter((w) => w.status === "ACTIVE_WARNING" || w.status === "IN_REVIEW");

  return (
    <div className="space-y-6">
      {/* Top AI Early Warning Alert Banner (if any critical warning) */}
      {activeEarlyWarnings.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-slate-900 border border-amber-500/40 p-5 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white uppercase tracking-wider">
                    AI PREDICTIVE EARLY WARNING
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {activeEarlyWarnings.length} Active Prescriptive Alerts
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-white mt-1">
                  {activeEarlyWarnings[0].equipmentCode} ({activeEarlyWarnings[0].equipmentType}):{" "}
                  {activeEarlyWarnings[0].predictedFailureComponent}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {activeEarlyWarnings[0].prescriptiveAction} • Estimasi kegagalan dalam {activeEarlyWarnings[0].predictedDaysToFailure} hari
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onConvertWarning(activeEarlyWarnings[0].id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>1-Click Generate WO</span>
              </button>
              <button
                onClick={() => onNavigateTab("ai-predictive")}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View All Early Warnings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Summary Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* MTBF */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MTBF</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {kpis.meanTimeBetweenFailuresMTBF}{" "}
            <span className="text-xs font-normal text-slate-400">Hours</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span>Mean Time Between Failures</span>
          </div>
        </div>

        {/* MTTR */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MTTR</span>
            <Wrench className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {kpis.meanTimeToRepairMTTR}{" "}
            <span className="text-xs font-normal text-slate-400">Hours</span>
          </div>
          <div className="text-[11px] text-blue-400 mt-1 font-semibold flex items-center gap-1">
            <span>Mean Time To Repair</span>
          </div>
        </div>

        {/* PM Compliance */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>PM Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400 mt-2">
            {kpis.preventiveComplianceRatePercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">
            Target: &gt;90% On-Time
          </div>
        </div>

        {/* Fleet Availability */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Fleet Availability</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {kpis.fleetPhysicalAvailabilityPA}%{" "}
            <span className="text-xs font-normal text-slate-400">PA</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">
            MA: {kpis.fleetMechanicalAvailabilityMA}%
          </div>
        </div>

        {/* Active Work Orders */}
        <div
          onClick={() => onNavigateTab("work-orders")}
          className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active WOs</span>
            <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {activeWOs.length}{" "}
            <span className="text-xs font-normal text-slate-400">Orders</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">
            Across 6 Stages
          </div>
        </div>

        {/* Low Stock Parts Alert */}
        <div
          onClick={() => onNavigateTab("spare-parts")}
          className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all shadow-xl cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Part Stock Alert</span>
            <Package className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            {lowStockParts.length}{" "}
            <span className="text-xs font-normal text-slate-400">Items</span>
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-semibold">
            Below Minimum Stock
          </div>
        </div>
      </div>

      {/* 6-Stage Work Order Pipeline Kanban Overview Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Work Order 6-Stage Lifecycle Pipeline</h2>
              <p className="text-xs text-slate-400">Request &rarr; Approval &rarr; Assignment &rarr; Repair &rarr; Testing &rarr; Closing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateWO}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Work Order</span>
            </button>
            <button
              onClick={() => onNavigateTab("work-orders")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Full Pipeline Board</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Stage Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((st, idx) => {
            const count = workOrders.filter((w) => w.stage === st.stage).length;
            const Icon = st.icon;

            return (
              <div
                key={st.stage}
                onClick={() => onNavigateTab("work-orders")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${st.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider">{st.label.split(":")[1]}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black mt-2">{count}</div>
                <div className="text-[10px] opacity-80 mt-1">Stage {idx + 1} of 6</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: 4 Maintenance Types & Active Work Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 4 Maintenance Types Matrix */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">4 Maintenance Types</h3>
                <p className="text-[11px] text-slate-400">Klasifikasi & Strategi Pemeliharaan</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("types")}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Details &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceTypes.map((mt) => {
              const activeCount = workOrders.filter((w) => w.maintenanceType === mt.type && w.stage !== "Closing").length;
              return (
                <div
                  key={mt.id}
                  onClick={() => onNavigateTab("types")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:bg-slate-800/80 ${mt.bgLight} ${mt.borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-white">{mt.code}</span>
                      <span className="text-xs font-bold text-slate-200">{mt.type}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-slate-300 border border-slate-700">
                      {activeCount} Active WOs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {mt.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <span>SLA: {mt.targetSLAHours} Jam</span>
                    <span className="font-bold text-slate-300">Cost Impact: {mt.costImpactLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Priority Work Orders Queue */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Active Priority Work Orders</h3>
                <p className="text-[11px] text-slate-400">Monitoring antrean eksekusi perbaikan alat berat</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("work-orders")}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              View All ({workOrders.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {activeWOs.slice(0, 4).map((wo) => (
              <div
                key={wo.id}
                onClick={() => onSelectWorkOrder(wo)}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-amber-400 group-hover:underline">
                      {wo.woNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                      {wo.equipmentCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        wo.priority === "Emergency"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : wo.priority === "High"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {wo.stage}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">{wo.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{wo.description}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Lead: {wo.assignedLeadMechanic || "Unassigned"}</span>
                  <span>Bay: {wo.assignedWorkshopBay || "In-Pit"}</span>
                  <span className="font-mono text-amber-400">
                    Est: Rp {(wo.totalCostIDR || wo.estimatedBudgetIDR || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
