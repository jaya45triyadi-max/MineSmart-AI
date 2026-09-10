// MINE SMART AI - Mine Planning Header & Action Control Bar Component

import React, { useState } from "react";
import {
  Compass,
  Plus,
  FolderOpen,
  Save,
  Copy,
  GitCompare,
  Sliders,
  Download,
  Bot,
  CheckCircle2,
  Clock,
  Send,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { MinePlan, PlanStatus } from "../../../types/minePlanningTypes";
import { useAuth } from "../../../providers/AuthProvider";

interface MinePlanningHeaderProps {
  currentPlan: MinePlan;
  plans: MinePlan[];
  onSelectPlan: (plan: MinePlan) => void;
  onNewPlan: () => void;
  onSavePlan: () => void;
  onDuplicatePlan: () => void;
  onOpenCompareModal: () => void;
  onOpenScenarioModal: () => void;
  onOpenExportModal: () => void;
  onOpenAICopilot: () => void;
  onUpdateStatus: (newStatus: PlanStatus) => void;
}

export const MinePlanningHeader: React.FC<MinePlanningHeaderProps> = ({
  currentPlan,
  plans,
  onSelectPlan,
  onNewPlan,
  onSavePlan,
  onDuplicatePlan,
  onOpenCompareModal,
  onOpenScenarioModal,
  onOpenExportModal,
  onOpenAICopilot,
  onUpdateStatus,
}) => {
  const { activeSite, company, user } = useAuth();
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);

  // Status Badge Colors
  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "Approved":
        return "bg-sky-500/10 text-sky-500 border-sky-500/30";
      case "Review":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "Draft":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
      case "Archived":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const workflowSteps: { status: PlanStatus; label: string; roleNeeded: string }[] = [
    { status: "Draft", label: "Planner Draft", roleNeeded: "MINE_ENGINEER" },
    { status: "Review", label: "Reviewer Check", roleNeeded: "MINE_ENGINEER" },
    { status: "Approved", label: "Manager Approve", roleNeeded: "SITE_MANAGER" },
    { status: "Active", label: "Active Plan", roleNeeded: "SITE_MANAGER" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
      {/* Top Header Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 font-black shadow-md">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Mine Planning & Strategic Optimization
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusBadge(
                  currentPlan.status
                )}`}
              >
                ● {currentPlan.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perencanaan Tambang Terintegrasi: LOM, LTP, MTP, STP, Weekly, Daily, Pit Design & What-If Scenario.
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewPlan}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Plan</span>
          </button>

          {/* Open Plan Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPlanSelectorOpen(!isPlanSelectorOpen)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderOpen className="h-4 w-4 text-amber-500" />
              <span>Open Plan</span>
            </button>

            {isPlanSelectorOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-2 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Daftar Plan Tambang</span>
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPlan(p);
                      setIsPlanSelectorOpen(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                      p.planId === currentPlan.planId ? "bg-teal-500/10 text-teal-500" : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="truncate">{p.planVersion} - {p.pitName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">{p.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onSavePlan}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4 text-emerald-500" />
            <span>Save</span>
          </button>

          <button
            onClick={onDuplicatePlan}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="h-4 w-4 text-sky-500" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={onOpenCompareModal}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <GitCompare className="h-4 w-4 text-purple-500" />
            <span>Compare</span>
          </button>

          <button
            onClick={onOpenScenarioModal}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="h-4 w-4 text-amber-500" />
            <span>Scenario</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4 text-teal-500" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenAICopilot}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Info Metadata Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Perusahaan / Site:</span>
          <span className="font-bold text-slate-900 dark:text-white truncate block">{company.displayName || "PT Kaltim Coal"}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Lokasi Pit:</span>
          <span className="font-bold text-emerald-500 font-mono block">{currentPlan.pitName}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Periode Plan:</span>
          <span className="font-bold text-slate-900 dark:text-white block">{currentPlan.periodLabel}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Plan Version:</span>
          <span className="font-bold text-sky-400 font-mono block">{currentPlan.planVersion}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Approved By:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 block truncate">{currentPlan.approvedBy || "Drafting"}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Last Updated:</span>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">
            {new Date(currentPlan.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Plan Approval Workflow Stepper */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">
          Approval Workflow:
        </span>

        <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto py-0.5">
          {workflowSteps.map((step, idx) => {
            const isCurrent = currentPlan.status === step.status;
            const isCompleted =
              (currentPlan.status === "Approved" && (step.status === "Draft" || step.status === "Review")) ||
              (currentPlan.status === "Active" && step.status !== "Cancelled");

            return (
              <React.Fragment key={step.status}>
                <button
                  onClick={() => onUpdateStatus(step.status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? "bg-teal-500 text-slate-950 shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-white"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  <span>{step.label}</span>
                </button>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-slate-400 text-[10px] font-mono shrink-0">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
