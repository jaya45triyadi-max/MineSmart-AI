import React, { useState } from "react";
import {
  Scale,
  Truck,
  FileText,
  GitCompare,
  Layers,
  Flame,
  ShoppingCart,
  ShieldAlert,
  FileSpreadsheet,
  Settings,
  Bot,
  LayoutDashboard,
  QrCode,
  Sparkles,
} from "lucide-react";

import { WeighbridgeOverviewTab } from "./components/WeighbridgeOverviewTab";
import { WeighbridgeTransactionsTab } from "./components/WeighbridgeTransactionsTab";
import { WeighbridgeVehiclesTab } from "./components/WeighbridgeVehiclesTab";
import { WeighbridgeTicketsTab } from "./components/WeighbridgeTicketsTab";
import { WeighbridgeReconciliationTab } from "./components/WeighbridgeReconciliationTab";
import { WeighbridgeMaterialTab } from "./components/WeighbridgeMaterialTab";
import { WeighbridgeStockpileTab } from "./components/WeighbridgeStockpileTab";
import { WeighbridgeSalesTab } from "./components/WeighbridgeSalesTab";
import { WeighbridgeAlertsTab } from "./components/WeighbridgeAlertsTab";
import { WeighbridgeReportsTab } from "./components/WeighbridgeReportsTab";
import { WeighbridgeSettingsTab } from "./components/WeighbridgeSettingsTab";
import { WeighbridgeAICopilotTab } from "./components/WeighbridgeAICopilotTab";

import {
  MOCK_WEIGHBRIDGES,
  MOCK_WEIGHBRIDGE_VEHICLES,
  MOCK_WEIGHBRIDGE_TICKETS,
  MOCK_WEIGHIN_TRANSACTIONS,
  MOCK_WEIGHBRIDGE_RECONCILIATIONS,
  MOCK_SCALE_DEVICE_READINGS,
  MOCK_WEIGHBRIDGE_CALIBRATIONS,
  MOCK_WEIGHBRIDGE_ALERTS,
  MOCK_WEIGHBRIDGE_AI_INSIGHTS,
} from "../../data/weighbridgeData";

import {
  Weighbridge,
  WeighbridgeVehicle,
  WeighInTransaction,
  WeighbridgeTicket,
  WeighbridgeReconciliation,
  WeighbridgeAlert,
  WeighbridgeAIInsight,
} from "../../types/weighbridgeTypes";

interface WeighbridgeModuleProps {
  onOpenAICopilot?: () => void;
}

export const WeighbridgeModule: React.FC<WeighbridgeModuleProps> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Local State Store
  const [weighbridges, setWeighbridges] = useState<Weighbridge[]>(MOCK_WEIGHBRIDGES);
  const [vehicles, setVehicles] = useState<WeighbridgeVehicle[]>(MOCK_WEIGHBRIDGE_VEHICLES);
  const [tickets, setTickets] = useState<WeighbridgeTicket[]>(MOCK_WEIGHBRIDGE_TICKETS);
  const [weighInTransactions, setWeighInTransactions] = useState<WeighInTransaction[]>(MOCK_WEIGHIN_TRANSACTIONS);
  const [reconciliations, setReconciliations] = useState<WeighbridgeReconciliation[]>(MOCK_WEIGHBRIDGE_RECONCILIATIONS);
  const [alerts, setAlerts] = useState<WeighbridgeAlert[]>(MOCK_WEIGHBRIDGE_ALERTS);
  const [insights] = useState<WeighbridgeAIInsight[]>(MOCK_WEIGHBRIDGE_AI_INSIGHTS);
  const [scaleReadings] = useState(MOCK_SCALE_DEVICE_READINGS);
  const [calibrations] = useState(MOCK_WEIGHBRIDGE_CALIBRATIONS);

  // Modal triggers
  const [isScanQRModalOpen, setIsScanQRModalOpen] = useState(false);

  // Handlers
  const handleAddWeighIn = (newTrx: WeighInTransaction) => {
    setWeighInTransactions([newTrx, ...weighInTransactions]);
  };

  const handleCompleteWeighOut = (newTicket: WeighbridgeTicket) => {
    setTickets([newTicket, ...tickets]);
    // Remove completed weigh-in from active queue
    setWeighInTransactions(weighInTransactions.filter((t) => t.weighInId !== newTicket.weighInId));

    // If overload, add alert
    if (newTicket.isOverload) {
      const newAlert: WeighbridgeAlert = {
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        type: "OVERLOAD",
        severity: "HIGH",
        title: `Overload Detected on ${newTicket.unitNumber}`,
        description: `Net weight ${newTicket.normalizedValue} Ton exceeds rated truck capacity.`,
        vehicleNumber: newTicket.unitNumber,
        ticketNumber: newTicket.ticketNumber,
        timestamp: new Date().toISOString(),
        isResolved: false,
      };
      setAlerts([newAlert, ...alerts]);
    }
  };

  const handleVoidTicket = (ticketId: string, reason: string) => {
    setTickets(
      tickets.map((t) =>
        t.ticketId === ticketId
          ? {
              ...t,
              status: "VOID",
              voidReason: reason,
              voidedBy: "Ir. Bambang Triyono",
              voidedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleResolveReconciliation = (id: string, resolution: string) => {
    setReconciliations(
      reconciliations.map((r) =>
        r.reconciliationId === id
          ? {
              ...r,
              status: "RESOLVED",
              resolution,
              resolvedBy: "Ir. Bambang Triyono",
            }
          : r
      )
    );
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isResolved: true } : a)));
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Scale },
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "tickets", label: "Tickets", icon: FileText },
    { id: "reconciliation", label: "Reconciliation", icon: GitCompare },
    { id: "material", label: "Material Movement", icon: Layers },
    { id: "stockpile", label: "Stockpile", icon: Flame },
    { id: "sales", label: "Sales & Shipment", icon: ShoppingCart },
    { id: "alerts", label: "Alerts", icon: ShieldAlert, badge: alerts.filter((a) => !a.isResolved).length },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "ai-insight", label: "AI Copilot", icon: Bot, badge: "AI" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Module Sub-Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-white dark:bg-[#111C2E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-slate-950 text-emerald-400"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Subview according to Active Tab */}
      {activeTab === "overview" && (
        <WeighbridgeOverviewTab
          weighbridges={weighbridges}
          vehicles={vehicles}
          tickets={tickets}
          reconciliations={reconciliations}
          alerts={alerts}
          insights={insights}
          scaleReadings={scaleReadings}
          onOpenNewWeighIn={() => setActiveTab("transactions")}
          onOpenNewWeighOut={() => setActiveTab("transactions")}
          onOpenScanQR={() => setActiveTab("tickets")}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === "transactions" && (
        <WeighbridgeTransactionsTab
          weighbridges={weighbridges}
          vehicles={vehicles}
          weighInTransactions={weighInTransactions}
          tickets={tickets}
          onAddWeighIn={handleAddWeighIn}
          onCompleteWeighOut={handleCompleteWeighOut}
          onOpenScanQR={() => setActiveTab("tickets")}
        />
      )}

      {activeTab === "vehicles" && (
        <WeighbridgeVehiclesTab vehicles={vehicles} tickets={tickets} />
      )}

      {activeTab === "tickets" && (
        <WeighbridgeTicketsTab tickets={tickets} onVoidTicket={handleVoidTicket} />
      )}

      {activeTab === "reconciliation" && (
        <WeighbridgeReconciliationTab
          reconciliations={reconciliations}
          onResolveReconciliation={handleResolveReconciliation}
        />
      )}

      {activeTab === "material" && (
        <WeighbridgeMaterialTab tickets={tickets} />
      )}

      {activeTab === "stockpile" && (
        <WeighbridgeStockpileTab tickets={tickets} />
      )}

      {activeTab === "sales" && (
        <WeighbridgeSalesTab tickets={tickets} />
      )}

      {activeTab === "alerts" && (
        <WeighbridgeAlertsTab alerts={alerts} onResolveAlert={handleResolveAlert} />
      )}

      {activeTab === "reports" && (
        <WeighbridgeReportsTab />
      )}

      {activeTab === "settings" && (
        <WeighbridgeSettingsTab
          weighbridges={weighbridges}
          calibrations={calibrations}
          scaleReadings={scaleReadings}
        />
      )}

      {activeTab === "ai-insight" && (
        <WeighbridgeAICopilotTab
          insights={insights}
          tickets={tickets}
          reconciliations={reconciliations}
        />
      )}
    </div>
  );
};
