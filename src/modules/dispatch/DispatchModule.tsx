// MINE SMART AI - Dispatch Management & AI Dispatch Optimization Module

import React, { useState, useEffect } from "react";
import {
  Radio,
  Activity,
  Truck,
  Layers,
  Clock,
  Gauge,
  Sparkles,
  Zap,
  MapPin,
  AlertTriangle,
  FileText,
  History,
  Sliders,
  ChevronRight,
} from "lucide-react";

import { dispatchRepository } from "../../services/repositories/DispatchRepository";
import {
  DispatchRecord,
  DispatchQueueItem,
  DispatchLoadingRecord,
  DispatchHaulingRecord,
  DispatchDumpingRecord,
  DispatchReturnRecord,
  DispatchCycleDetail,
  ExcavatorTruckMatchScore,
  DispatchScenarioResult,
  DispatchAlertRecord,
  DispatchOptimizationAudit,
} from "../../types/dispatchTypes";

// Component Sub-Views
import { DispatchHeader } from "./components/DispatchHeader";
import { DispatchCommandCenterDashboard } from "./components/DispatchCommandCenterDashboard";
import { DispatchLiveBoardView } from "./components/DispatchLiveBoardView";
import { FleetAssignmentView } from "./components/FleetAssignmentView";
import { ExcavatorTruckMatchingView } from "./components/ExcavatorTruckMatchingView";
import { QueueManagementView } from "./components/QueueManagementView";
import { LoadingManagementView } from "./components/LoadingManagementView";
import { HaulingManagementView } from "./components/HaulingManagementView";
import { DumpingManagementView } from "./components/DumpingManagementView";
import { ReturnManagementView } from "./components/ReturnManagementView";
import { CycleTimeEngineView } from "./components/CycleTimeEngineView";
import { SmartDispatchCenterView } from "./components/SmartDispatchCenterView";
import { DispatchOptimizationView } from "./components/DispatchOptimizationView";
import { DispatchAlertsView } from "./components/DispatchAlertsView";
import { DispatchHistoryView } from "./components/DispatchHistoryView";
import { DispatchReportsView } from "./components/DispatchReportsView";
import { DispatchAICopilotModal } from "./components/DispatchAICopilotModal";

interface DispatchModuleProps {
  initialSubRoute?: string;
  userRole?: string;
}

export const DispatchModule: React.FC<DispatchModuleProps> = ({
  initialSubRoute = "overview",
  userRole = "DISPATCH_OPERATOR",
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSubRoute);

  // Repository State
  const [dispatches, setDispatches] = useState<DispatchRecord[]>(dispatchRepository.getAllDispatches());
  const [queues, setQueues] = useState<DispatchQueueItem[]>(dispatchRepository.getQueues());
  const [loadings, setLoadings] = useState<DispatchLoadingRecord[]>(dispatchRepository.getLoadings());
  const [haulings, setHaulings] = useState<DispatchHaulingRecord[]>(dispatchRepository.getHaulings());
  const [dumpings, setDumpings] = useState<DispatchDumpingRecord[]>(dispatchRepository.getDumpings());
  const [returns, setReturns] = useState<DispatchReturnRecord[]>(dispatchRepository.getReturns());
  const [cycles, setCycles] = useState<DispatchCycleDetail[]>(dispatchRepository.getCycles());
  const [matches, setMatches] = useState<ExcavatorTruckMatchScore[]>(dispatchRepository.getMatchingScores());
  const [scenarios, setScenarios] = useState<DispatchScenarioResult[]>(dispatchRepository.getScenarios());
  const [alerts, setAlerts] = useState<DispatchAlertRecord[]>(dispatchRepository.getAlerts());
  const [audits, setAudits] = useState<DispatchOptimizationAudit[]>(dispatchRepository.getAudits());

  // Modal Controls
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  // Sync state from repository
  const refreshData = () => {
    setDispatches([...dispatchRepository.getAllDispatches()]);
    setQueues([...dispatchRepository.getQueues()]);
    setAlerts([...dispatchRepository.getAlerts()]);
    setScenarios([...dispatchRepository.getScenarios()]);
    setAudits([...dispatchRepository.getAudits()]);
  };

  useEffect(() => {
    if (initialSubRoute) {
      setActiveTab(initialSubRoute);
    }
  }, [initialSubRoute]);

  // Handler Actions
  const handleCreateAssignment = (assignmentData: Partial<DispatchRecord>) => {
    dispatchRepository.createDispatch(assignmentData as any);
    refreshData();
  };

  const handleUpdateStatus = (dispatchId: string, status: DispatchRecord["dispatchStatus"]) => {
    dispatchRepository.updateDispatchStatus(dispatchId, status);
    refreshData();
  };

  const handleReassign = (dispatchId: string, excavatorCode: string, origin: string, destination: string) => {
    const excId = `EQ-${excavatorCode.replace("-", "")}`;
    dispatchRepository.reassignDispatch(dispatchId, excId, excavatorCode, origin, destination);
    refreshData();
  };

  const handleRunScenario = (scenarioName: string, targetTon: number) => {
    const newScenario: DispatchScenarioResult = {
      scenarioId: `SCEN-${Math.floor(Math.random() * 900 + 100)}`,
      scenarioName,
      createdAt: new Date().toISOString(),
      recommendedTruckAllocation: [
        { excavatorCode: "EX-201", trucks: ["DT-101", "DT-102", "DT-103", "DT-107"], targetTon: targetTon * 0.35 },
        { excavatorCode: "EX-202", trucks: ["DT-104", "DT-105", "DT-108", "DT-109", "DT-110"], targetTon: targetTon * 0.45 },
        { excavatorCode: "EX-203", trucks: ["DT-106", "DT-111"], targetTon: targetTon * 0.20 },
      ],
      expectedProductionTon: Math.round(targetTon * 1.02),
      expectedCycleTimeMin: 28.5,
      expectedQueueReductionPercent: 45,
      expectedUtilizationPercent: 91.0,
      potentialBottlenecks: ["Rintisan Simpang ROM 01 jam 12:00"],
      aiSummary: `Skenario ${scenarioName} mengoptimalkan penempatan truk untuk meminimalkan antrean di EX-201. Target ${targetTon} Ton diproyeksikan tercapai.`,
      confidencePercent: 93,
      status: "SIMULATED",
    };

    dispatchRepository.addScenario(newScenario);
    refreshData();
  };

  const handleApplyOptimization = (scenario: DispatchScenarioResult) => {
    scenario.status = "APPLIED";
    dispatchRepository.addAudit({
      companyId: "COMP-MINE-01",
      optimizationId: `OPT-${Math.floor(Math.random() * 9000 + 1000)}`,
      scenarioId: scenario.scenarioId,
      scenarioName: scenario.scenarioName,
      inputDataSnapshot: { targetTon: scenario.expectedProductionTon },
      recommendationSummary: scenario.aiSummary,
      affectedUnitsCount: 2,
      appliedChanges: [
        { unitCode: "DT-107", oldExcavator: "EX-201", newExcavator: "EX-202", oldRoute: "Pit 1 -> ROM", newRoute: "Pit 2 -> Waste Dump" },
      ],
      appliedBy: "CurrentUser (Dispatch Officer)",
      appliedAt: new Date().toISOString(),
      resultStatus: "SUCCESS",
    });

    refreshData();
  };

  const handleResolveAlert = (alertId: string) => {
    dispatchRepository.resolveAlert(alertId);
    refreshData();
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["DispatchID,TruckCode,ExcavatorCode,Status,CycleTime,ProductionTon,Date"]
        .concat(
          dispatches.map(
            (d) =>
              `${d.dispatchId},${d.truckUnitCode},${d.excavatorUnitCode},${d.dispatchStatus},${d.totalCycleTimeMin},${d.actualProductionTon},${d.date}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dispatch_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sub Navigation Tabs Setup
  const subNavTabs = [
    { key: "overview", label: "Command Center", icon: Activity },
    { key: "smart-dispatch", label: "Smart Dispatch AI (Premium)", icon: Sparkles, isPremium: true },
    { key: "live", label: "Live Board", icon: Radio },
    { key: "assignments", label: "Assignments", icon: Truck },
    { key: "excavator-truck", label: "Matching", icon: Layers },
    { key: "queue", label: "Queue Monitor", icon: Clock },
    { key: "loading", label: "Loading", icon: Gauge },
    { key: "hauling", label: "Hauling Route", icon: MapPin },
    { key: "dumping", label: "Dumping", icon: Sliders },
    { key: "return", label: "Return", icon: Truck },
    { key: "cycle-time", label: "Cycle Time Engine", icon: Gauge },
    { key: "optimization", label: "AI Optimizer", icon: Zap },
    { key: "alerts", label: "Alerts", icon: AlertTriangle },
    { key: "history", label: "History", icon: History },
    { key: "reports", label: "Reports", icon: FileText },
  ];

  const operatingTrucks = dispatches.filter(
    (d) => d.dispatchStatus === "Hauling Loaded" || d.dispatchStatus === "Returning"
  ).length;
  const queuedTrucks = dispatches.filter((d) => d.dispatchStatus === "Queued").length;
  const avgCycleTimeMin = dispatches.length > 0
    ? Number((dispatches.reduce((a, b) => a + b.totalCycleTimeMin, 0) / dispatches.length).toFixed(1))
    : 32.0;
  const avgQueueTimeMin = dispatches.length > 0
    ? Number((dispatches.reduce((a, b) => a + b.queueTimeMin, 0) / dispatches.length).toFixed(1))
    : 4.5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Header Bar */}
      <DispatchHeader
        totalActiveDispatch={dispatches.filter((d) => d.assignmentStatus === "ACTIVE").length}
        operatingTrucks={operatingTrucks}
        queuedTrucks={queuedTrucks}
        avgCycleTimeMin={avgCycleTimeMin}
        avgQueueTimeMin={avgQueueTimeMin}
        targetAchievementPercent={95.0}
        onNewAssignment={() => setActiveTab("assignments")}
        onRunOptimization={() => setActiveTab("optimization")}
        onOpenSmartDispatch={() => setActiveTab("smart-dispatch")}
        onOpenAlerts={() => setActiveTab("alerts")}
        onOpenAI={() => setIsAICopilotOpen(true)}
        onExport={handleExportCSV}
      />

      {/* Sub-Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {subNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isSpecial = tab.key === "smart-dispatch";

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isSpecial
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-400"
                    : "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : isSpecial
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                  : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSpecial && !isActive ? "text-amber-400" : ""}`} />
              <span>{tab.label}</span>
              {isSpecial && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === "overview" && (
          <DispatchCommandCenterDashboard
            dispatches={dispatches}
            queues={queues}
            matches={matches}
            alerts={alerts}
            onSelectSubTab={(key) => setActiveTab(key)}
            onOpenAI={() => setIsAICopilotOpen(true)}
            onNewAssignment={() => setActiveTab("assignments")}
          />
        )}

        {activeTab === "smart-dispatch" && (
          <SmartDispatchCenterView
            onOpenAICopilot={() => setIsAICopilotOpen(true)}
            onNavigateTab={(key) => setActiveTab(key)}
          />
        )}

        {activeTab === "live" && (
          <DispatchLiveBoardView
            dispatches={dispatches}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === "assignments" && (
          <FleetAssignmentView
            dispatches={dispatches}
            onCreateAssignment={handleCreateAssignment}
            onUpdateStatus={handleUpdateStatus}
            onReassign={handleReassign}
          />
        )}

        {activeTab === "excavator-truck" && (
          <ExcavatorTruckMatchingView
            matches={matches}
            onOpenAI={() => setIsAICopilotOpen(true)}
          />
        )}

        {activeTab === "queue" && (
          <QueueManagementView
            queues={queues}
            onOpenAI={() => setIsAICopilotOpen(true)}
          />
        )}

        {activeTab === "loading" && <LoadingManagementView loadings={loadings} />}

        {activeTab === "hauling" && <HaulingManagementView haulings={haulings} />}

        {activeTab === "dumping" && <DumpingManagementView dumpings={dumpings} />}

        {activeTab === "return" && <ReturnManagementView returns={returns} />}

        {activeTab === "cycle-time" && <CycleTimeEngineView cycles={cycles} />}

        {activeTab === "optimization" && (
          <DispatchOptimizationView
            scenarios={scenarios}
            audits={audits}
            onRunScenario={handleRunScenario}
            onApplyOptimization={handleApplyOptimization}
          />
        )}

        {activeTab === "alerts" && (
          <DispatchAlertsView alerts={alerts} onResolveAlert={handleResolveAlert} />
        )}

        {activeTab === "history" && (
          <DispatchHistoryView dispatches={dispatches} onExport={handleExportCSV} />
        )}

        {activeTab === "reports" && <DispatchReportsView />}
      </div>

      {/* AI Copilot Modal */}
      <DispatchAICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
      />
    </div>
  );
};

export default DispatchModule;
