// MINE SMART AI - Full Maintenance & Plant Reliability Module
// Comprehensive Maintenance Types, 6-Stage Work Orders, Spare Parts, AI Predictive Multi-factor Early Warning

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Layers,
  Package,
  Activity,
  Sparkles,
  LayoutDashboard,
  Plus,
  BrainCircuit,
  RefreshCw,
  BellRing,
  CheckCircle2,
  Calendar,
  Filter,
  Download,
  Flame,
  FileSpreadsheet
} from "lucide-react";
import { MaintenanceRepository } from "../../services/repositories/MaintenanceRepository";
import {
  WorkOrder,
  WorkOrderStage,
  SparePart,
  AIEarlyWarningAlert,
  MaintenanceTypeDefinition,
  AIPredictiveTelemetry
} from "../../types/maintenanceTypes";
import { MaintenanceOverview } from "./MaintenanceOverview";
import { MaintenanceTypesView } from "./MaintenanceTypesView";
import { WorkOrderPipelineView } from "./WorkOrderPipelineView";
import { SparePartsManagementView } from "./SparePartsManagementView";
import { AIPredictiveMaintenanceView } from "./AIPredictiveMaintenanceView";
import { WorkOrderDetailsModal } from "./WorkOrderDetailsModal";
import { CreateWorkOrderModal } from "./CreateWorkOrderModal";
import { AIMaintenanceAssistantModal } from "./AIMaintenanceAssistantModal";

type ActiveTab = "overview" | "types" | "pipeline" | "spare-parts" | "ai-predictive";

interface MaintenanceModuleProps {
  onOpenAICopilot?: () => void;
}

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [alerts, setAlerts] = useState<AIEarlyWarningAlert[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceTypeDefinition[]>([]);
  const [telemetries, setTelemetries] = useState<AIPredictiveTelemetry[]>([]);

  // Modals state
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isCreateWOModalOpen, setIsCreateWOModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Load data from repository
  const loadData = () => {
    setWorkOrders(MaintenanceRepository.getWorkOrders());
    setSpareParts(MaintenanceRepository.getSpareParts());
    setAlerts(MaintenanceRepository.getEarlyWarnings());
    setMaintenanceTypes(MaintenanceRepository.getMaintenanceTypes());
    setTelemetries(MaintenanceRepository.getPredictiveTelemetries());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => {
      setNotificationBanner(null);
    }, 4000);
  };

  // Handlers
  const handleStageTransition = (id: string, nextStage: WorkOrderStage) => {
    const updated = MaintenanceRepository.transitionWorkOrderStage(id, nextStage);
    if (updated) {
      loadData();
      if (selectedWorkOrder && selectedWorkOrder.id === id) {
        setSelectedWorkOrder(updated);
      }
      showNotification(`Work Order ${updated.woNumber} transitioned to stage: ${nextStage}`);
    }
  };

  const handleUpdateWorkOrder = (updated: WorkOrder) => {
    MaintenanceRepository.updateWorkOrder(updated);
    loadData();
    setSelectedWorkOrder(updated);
    showNotification(`Work Order ${updated.woNumber} successfully updated.`);
  };

  const handleCreateWorkOrder = (newWO: Partial<WorkOrder>) => {
    const created = MaintenanceRepository.createWorkOrder(newWO);
    loadData();
    setIsCreateWOModalOpen(false);
    showNotification(`Created new Work Order: ${created.woNumber}`);
  };

  const handleUpdateSparePartStock = (id: string, delta: number, notes?: string) => {
    const updated = MaintenanceRepository.updateSparePartStock(id, delta, notes);
    if (updated) {
      loadData();
      showNotification(`Stock for ${updated.partNumber} updated. New balance: ${updated.stock} ${updated.unit}`);
    }
  };

  const handleCreateSparePart = (part: Partial<SparePart>) => {
    const created = MaintenanceRepository.createSparePart(part);
    loadData();
    showNotification(`Registered new Spare Part SKU: ${created.partNumber} (${created.partName})`);
  };

  const handleTriggerConvertWarningToWO = (alert: AIEarlyWarningAlert) => {
    const wo = MaintenanceRepository.convertWarningToWorkOrder(alert.id);
    if (wo) {
      loadData();
      showNotification(`AI Alert converted to Work Order ${wo.woNumber} (Priority: ${wo.priority})`);
      setSelectedWorkOrder(wo);
    }
  };

  const kpis = MaintenanceRepository.getKPIs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-6">
      {/* Toast Banner Notification */}
      {notificationBanner && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* Main Header & Module Navigation Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Wrench className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Plant & Fleet Maintenance</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MINE RELIABILITY 4.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Preventive, Predictive, Corrective & Breakdown • 6-Stage Work Order • Spare Parts & Multi-Factor AI Early Warning
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 text-xs font-black hover:bg-amber-500/30 transition-all cursor-pointer shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Predictive Copilot</span>
          </button>

          <button
            onClick={() => setIsCreateWOModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Work Order</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 text-xs font-black">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Maintenance Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("types")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "types"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Types (PM/PdM/CM/BM)</span>
        </button>

        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "pipeline"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Work Order 6-Stage Pipeline</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
            {workOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("spare-parts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "spare-parts"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Spare Parts & Suppliers</span>
          {spareParts.filter((p) => p.isLowStock).length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
              {spareParts.filter((p) => p.isLowStock).length} Low
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("ai-predictive")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ai-predictive"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>AI Predictive Maintenance</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40">
            {alerts.length} Warnings
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "overview" && (
          <MaintenanceOverview
            kpis={kpis}
            workOrders={workOrders}
            spareParts={spareParts}
            alerts={alerts}
            onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
            onOpenCreateWO={() => setIsCreateWOModalOpen(true)}
            onTriggerConvertToWO={handleTriggerConvertWarningToWO}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}

        {activeTab === "types" && (
          <MaintenanceTypesView
            maintenanceTypes={maintenanceTypes}
            telemetries={telemetries}
            onOpenCreateWO={() => setIsCreateWOModalOpen(true)}
          />
        )}

        {activeTab === "pipeline" && (
          <WorkOrderPipelineView
            workOrders={workOrders}
            onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
            onOpenCreateWO={() => setIsCreateWOModalOpen(true)}
            onAdvanceStage={handleStageTransition}
          />
        )}

        {activeTab === "spare-parts" && (
          <SparePartsManagementView
            spareParts={spareParts}
            onUpdateStock={handleUpdateSparePartStock}
            onCreatePart={handleCreateSparePart}
          />
        )}

        {activeTab === "ai-predictive" && (
          <AIPredictiveMaintenanceView
            alerts={alerts}
            telemetries={telemetries}
            onTriggerConvertToWO={handleTriggerConvertWarningToWO}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      {selectedWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onAdvanceStage={(nextStage) => handleStageTransition(selectedWorkOrder.id, nextStage)}
          onSaveUpdates={handleUpdateWorkOrder}
        />
      )}

      {isCreateWOModalOpen && (
        <CreateWorkOrderModal
          onClose={() => setIsCreateWOModalOpen(false)}
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      )}

      {isAIAssistantOpen && (
        <AIMaintenanceAssistantModal
          onClose={() => setIsAIAssistantOpen(false)}
          alerts={alerts}
          onTriggerWorkOrder={handleTriggerConvertWarningToWO}
        />
      )}
    </div>
  );
};
