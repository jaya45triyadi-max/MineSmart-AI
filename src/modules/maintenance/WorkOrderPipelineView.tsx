// MINE SMART AI - Work Order 6-Stage Lifecycle Pipeline View

import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ChevronRight,
  Clock,
  Wrench,
  Activity,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Kanban,
  List,
  AlertTriangle,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import {
  WorkOrder,
  WorkOrderStage,
  WorkOrderPriority,
  MaintenanceType
} from "../../types/maintenanceTypes";

interface WorkOrderPipelineViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onOpenCreateWO: () => void;
  onAdvanceStage: (id: string, nextStage: WorkOrderStage) => void;
}

const STAGES: { stage: WorkOrderStage; title: string; color: string; bgBadge: string }[] = [
  { stage: "Request", title: "1. Request", color: "border-blue-500/40 text-blue-400", bgBadge: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { stage: "Approval", title: "2. Approval", color: "border-purple-500/40 text-purple-400", bgBadge: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { stage: "Assignment", title: "3. Assignment", color: "border-amber-500/40 text-amber-400", bgBadge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { stage: "Repair", title: "4. Repair", color: "border-orange-500/40 text-orange-400", bgBadge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  { stage: "Testing", title: "5. Testing", color: "border-teal-500/40 text-teal-400", bgBadge: "bg-teal-500/10 text-teal-400 border-teal-500/30" },
  { stage: "Closing", title: "6. Closing", color: "border-emerald-500/40 text-emerald-400", bgBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
];

export const WorkOrderPipelineView: React.FC<WorkOrderPipelineViewProps> = ({
  workOrders,
  onSelectWorkOrder,
  onOpenCreateWO,
  onAdvanceStage,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>("ALL");

  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStageFilter === "ALL" || wo.stage === selectedStageFilter;
    const matchesType = selectedTypeFilter === "ALL" || wo.maintenanceType === selectedTypeFilter;
    const matchesPriority = selectedPriorityFilter === "ALL" || wo.priority === selectedPriorityFilter;
    return matchesSearch && matchesStage && matchesType && matchesPriority;
  });

  const getNextStage = (currentStage: WorkOrderStage): WorkOrderStage | null => {
    const stageNames: WorkOrderStage[] = ["Request", "Approval", "Assignment", "Repair", "Testing", "Closing"];
    const idx = stageNames.indexOf(currentStage);
    return idx < stageNames.length - 1 ? stageNames[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & View Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Work Order 6-Stage Pipeline</h2>
              <p className="text-xs text-slate-400">Request &rarr; Approval &rarr; Assignment &rarr; Repair &rarr; Testing &rarr; Closing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={onOpenCreateWO}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search WO#, Unit, Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Stages (1-6)</option>
              <option value="Request">Stage 1: Request</option>
              <option value="Approval">Stage 2: Approval</option>
              <option value="Assignment">Stage 3: Assignment</option>
              <option value="Repair">Stage 4: Repair</option>
              <option value="Testing">Stage 5: Testing</option>
              <option value="Closing">Stage 6: Closing</option>
            </select>
          </div>

          <div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Maintenance Types</option>
              <option value="Preventive">Preventive (PM)</option>
              <option value="Predictive">Predictive (PdM)</option>
              <option value="Corrective">Corrective (CM)</option>
              <option value="Breakdown">Breakdown (BM)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((st) => {
            const stageWOs = filteredOrders.filter((w) => w.stage === st.stage);

            return (
              <div
                key={st.stage}
                className="flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800 p-3 min-w-[240px] max-h-[80vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-white">{st.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950 text-slate-300 border border-slate-800">
                    {stageWOs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageWOs.map((wo) => {
                    const nextSt = getNextStage(wo.stage);
                    const priorityBadge =
                      wo.priority === "Emergency"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : wo.priority === "High"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30";

                    return (
                      <div
                        key={wo.id}
                        onClick={() => onSelectWorkOrder(wo)}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer space-y-2 group shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-black text-amber-400 group-hover:underline">
                            {wo.woNumber}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border ${priorityBadge}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white line-clamp-2 leading-tight">
                          {wo.title}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold">
                            {wo.equipmentCode}
                          </span>
                          <span className="truncate">{wo.maintenanceType}</span>
                        </div>

                        {/* Progress Bar for checklist */}
                        {wo.tasksChecklist?.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] text-slate-400">
                              <span>Tasks</span>
                              <span>
                                {wo.tasksChecklist.filter((t) => t.isCompleted).length}/{wo.tasksChecklist.length}
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{
                                  width: `${
                                    (wo.tasksChecklist.filter((t) => t.isCompleted).length /
                                      wo.tasksChecklist.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Quick Advance Button */}
                        {nextSt && (
                          <div className="pt-2 border-t border-slate-850 flex items-center justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAdvanceStage(wo.id, nextSt);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              <span>Next &rarr; {nextSt}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {stageWOs.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-600 italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table List View */}
      {viewMode === "list" && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                <tr>
                  <th className="p-3.5">WO Number</th>
                  <th className="p-3.5">Equipment</th>
                  <th className="p-3.5">Title & Scope</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5 text-right">Cost (IDR)</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredOrders.map((wo) => (
                  <tr
                    key={wo.id}
                    onClick={() => onSelectWorkOrder(wo)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-mono font-bold text-amber-400">{wo.woNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{wo.equipmentCode}</div>
                      <div className="text-[10px] text-slate-400">{wo.equipmentType}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200 max-w-xs truncate">{wo.title}</td>
                    <td className="p-3.5 text-slate-300">{wo.maintenanceType}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          wo.priority === "Emergency"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : wo.priority === "High"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-amber-400">{wo.stage}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                      Rp {(wo.totalCostIDR || wo.estimatedBudgetIDR || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWorkOrder(wo);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
