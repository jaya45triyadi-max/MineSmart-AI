// MINE SMART AI - Mine Planning & Strategic Optimization Main Module
// Full Suite: Geological Model, Pit Planning, Scheduling, and AI Scenario Analysis

import React, { useState } from "react";
import {
  Compass,
  Layers,
  Sliders,
  Calendar,
  Clock,
  TrendingUp,
  GitCommit,
  Route,
  Target,
  BarChart3,
  Bot,
  Sparkles,
  Award,
  Box,
  ShieldCheck,
} from "lucide-react";
import {
  MinePlan,
  PlanStatus,
} from "../../types/minePlanningTypes";
import { MinePlanningRepository } from "../../services/repositories/MinePlanningRepository";
import { MinePlanningHeader } from "./components/MinePlanningHeader";
import { MinePlanningDashboard } from "./components/MinePlanningDashboard";
import { GeologicalModelView } from "./components/GeologicalModelView";
import { PitPlanningMasterView } from "./components/PitPlanningMasterView";
import { SchedulingMasterView } from "./components/SchedulingMasterView";
import { AIMinePlanningScenarioView } from "./components/AIMinePlanningScenarioView";
import { PlanPerformanceView } from "./components/PlanPerformanceView";
import { MinePlanningAIModal } from "./components/MinePlanningAIModal";

export const MinePlanningModule: React.FC = () => {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<string>("ai-scenario");

  // Repository States
  const [plans, setPlans] = useState<MinePlan[]>(MinePlanningRepository.getPlans());
  const [currentPlan, setCurrentPlan] = useState<MinePlan>(plans[0]);
  const [changeLogs, setChangeLogs] = useState(MinePlanningRepository.getChangeLogs());

  // AI Modal State
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  // Performers Mock Data
  const performances = [
    {
      periodLabel: "Minggu 32 (Agustus 2026)",
      coalPlanMt: 88000,
      coalActualMt: 91500,
      wastePlanMbc: 368000,
      wasteActualMbc: 372000,
      coalVariancePercent: 4.0,
      wasteVariancePercent: 1.1,
      srPlan: 4.18,
      srActual: 4.06,
      status: "Above Plan" as const,
    },
    {
      periodLabel: "Triwulan II (Q2 2026)",
      coalPlanMt: 1100000,
      coalActualMt: 1125000,
      wastePlanMbc: 4620000,
      wasteActualMbc: 4680000,
      coalVariancePercent: 2.3,
      wasteVariancePercent: 1.3,
      srPlan: 4.2,
      srActual: 4.16,
      status: "On Plan" as const,
    },
  ];

  // Actions
  const handleUpdateStatus = (newStatus: PlanStatus) => {
    MinePlanningRepository.updatePlanStatus(
      currentPlan.planId,
      newStatus,
      "SITE_MANAGER",
      "Agus Pratama"
    );
    setCurrentPlan({ ...currentPlan, status: newStatus });
    setChangeLogs(MinePlanningRepository.getChangeLogs());
  };

  const handleDuplicatePlan = () => {
    const dup: MinePlan = {
      ...currentPlan,
      id: `mp-${Date.now()}`,
      planId: `${currentPlan.planId}-COPY`,
      planVersion: `${currentPlan.planVersion} (Rev 1)`,
      status: "Draft",
      title: `${currentPlan.title} (Revisi)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MinePlanningRepository.addPlan(dup);
    setPlans(MinePlanningRepository.getPlans());
    setCurrentPlan(dup);
  };

  const handleSavePlan = () => {
    alert(`Rencana ${currentPlan.planVersion} berhasil disimpan ke database!`);
  };

  // 4 Core Master Tabs + Overview & Audit
  const tabs = [
    {
      id: "ai-scenario",
      label: "AI Mine Planning (Skenario A vs B)",
      icon: Sparkles,
      highlight: true,
    },
    {
      id: "geology",
      label: "Geological Model (Seam & Block)",
      icon: Box,
    },
    {
      id: "pit-planning",
      label: "Pit Planning & Geoteknik",
      icon: Layers,
    },
    {
      id: "scheduling",
      label: "Scheduling (LOM s/d Daily)",
      icon: Calendar,
    },
    {
      id: "overview",
      label: "Executive Dashboard",
      icon: Compass,
    },
    {
      id: "performance",
      label: "Plan vs Actual & Audit",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-100 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      {/* Module Header */}
      <MinePlanningHeader
        currentPlan={currentPlan}
        plans={plans}
        onSelectPlan={(p) => setCurrentPlan(p)}
        onNewPlan={() => handleDuplicatePlan()}
        onSavePlan={handleSavePlan}
        onDuplicatePlan={handleDuplicatePlan}
        onOpenCompareModal={() => setActiveTab("ai-scenario")}
        onOpenScenarioModal={() => setActiveTab("ai-scenario")}
        onOpenExportModal={() => alert("Mengeksport Laporan Plan ke PDF / Excel...")}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Navigation Master Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? t.highlight
                    ? "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                    : "bg-teal-500 border-teal-400 text-slate-950 font-black shadow-md shadow-teal-500/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area based on Active Tab */}
      <div>
        {/* 1. AI MINE PLANNING (SCENARIO A VS B ENGINE) */}
        {activeTab === "ai-scenario" && (
          <AIMinePlanningScenarioView
            onScenarioApplied={(scenName) => {
              setPlans(MinePlanningRepository.getPlans());
              setCurrentPlan(MinePlanningRepository.getPlans()[0]);
            }}
          />
        )}

        {/* 2. GEOLOGICAL MODEL */}
        {activeTab === "geology" && <GeologicalModelView />}

        {/* 3. PIT PLANNING & GEOTECHNICS */}
        {activeTab === "pit-planning" && <PitPlanningMasterView />}

        {/* 4. SCHEDULING MASTER HIERARCHY */}
        {activeTab === "scheduling" && <SchedulingMasterView />}

        {/* 5. EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <MinePlanningDashboard
            currentPlan={currentPlan}
            constraints={[]}
            performances={performances}
            onNavigateTab={(tabKey) => {
              if (tabKey === "scenario") setActiveTab("ai-scenario");
              else if (tabKey === "pit-design" || tabKey === "bench" || tabKey === "ramp" || tabKey === "pushback" || tabKey === "sequence") setActiveTab("pit-planning");
              else if (tabKey === "lom" || tabKey === "weekly" || tabKey === "daily") setActiveTab("scheduling");
              else setActiveTab(tabKey);
            }}
            onOpenAICopilot={() => setIsAICopilotOpen(true)}
          />
        )}

        {/* 6. PLAN PERFORMANCE & AUDIT */}
        {activeTab === "performance" && (
          <PlanPerformanceView
            performances={performances}
            changeLogs={changeLogs}
            currentPlan={currentPlan}
          />
        )}
      </div>

      {/* AI Copilot Drawer Modal */}
      {isAICopilotOpen && (
        <MinePlanningAIModal
          isOpen={isAICopilotOpen}
          onClose={() => setIsAICopilotOpen(false)}
          activePlan={currentPlan}
        />
      )}
    </div>
  );
};
