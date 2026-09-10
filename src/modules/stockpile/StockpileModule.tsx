import React, { useState } from "react";
import {
  Flame,
  Layers,
  MapPin,
  FlaskConical,
  TrendingUp,
  Scale,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  Search,
} from "lucide-react";

import {
  Stockpile,
  StockMovement,
  BlendingPlan,
  RehandlingRecord,
  StockReconciliation,
  StockAdjustment,
  StockForecast,
  StockpileAlert,
  StockpileReport,
} from "../../types/stockpileTypes";

import {
  INITIAL_STOCKPILES,
  INITIAL_MOVEMENTS,
  INITIAL_BLENDING_PLANS,
  INITIAL_REHANDLINGS,
  INITIAL_RECONCILIATIONS,
  INITIAL_ADJUSTMENTS,
  INITIAL_FORECASTS,
  INITIAL_STOCK_ALERTS,
  INITIAL_STOCK_REPORTS,
} from "../../data/stockpileData";

import { StockpileOverviewTab } from "./components/StockpileOverviewTab";
import { StockpileInventoryTab } from "./components/StockpileInventoryTab";
import { StockpileLocationGisTab } from "./components/StockpileLocationGisTab";
import { StockpileQualityTab } from "./components/StockpileQualityTab";
import { StockpileMovementTab } from "./components/StockpileMovementTab";
import { StockpileBlendingTab } from "./components/StockpileBlendingTab";
import { StockpileRehandlingTab } from "./components/StockpileRehandlingTab";
import { StockpileReconciliationTab } from "./components/StockpileReconciliationTab";
import { StockpileForecastTab } from "./components/StockpileForecastTab";
import { StockpileAlertsTab } from "./components/StockpileAlertsTab";
import { StockpileAiInsightTab } from "./components/StockpileAiInsightTab";
import { StockpileReportsTab } from "./components/StockpileReportsTab";

interface StockpileModuleProps {
  onOpenAICopilot?: () => void;
}

export const StockpileModule: React.FC<StockpileModuleProps> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // State Management
  const [stockpiles, setStockpiles] = useState<Stockpile[]>(INITIAL_STOCKPILES);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [blendingPlans, setBlendingPlans] = useState<BlendingPlan[]>(INITIAL_BLENDING_PLANS);
  const [rehandlings, setRehandlings] = useState<RehandlingRecord[]>(INITIAL_REHANDLINGS);
  const [reconciliations, setReconciliations] = useState<StockReconciliation[]>(INITIAL_RECONCILIATIONS);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(INITIAL_ADJUSTMENTS);
  const [forecasts, setForecasts] = useState<StockForecast[]>(INITIAL_FORECASTS);
  const [alerts, setAlerts] = useState<StockpileAlert[]>(INITIAL_STOCK_ALERTS);
  const [reports, setReports] = useState<StockpileReport[]>(INITIAL_STOCK_REPORTS);

  // Handlers
  const handleAddStockpile = (newStockpile: Stockpile) => {
    setStockpiles((prev) => [newStockpile, ...prev]);
  };

  const handleUpdateStockpile = (updatedStockpile: Stockpile) => {
    setStockpiles((prev) =>
      prev.map((s) => (s.id === updatedStockpile.id ? updatedStockpile : s))
    );
  };

  const handleDeleteStockpile = (id: string) => {
    setStockpiles((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddMovement = (newMov: StockMovement) => {
    setMovements((prev) => [newMov, ...prev]);

    // Atomic update on stockpiles currentQuantity
    setStockpiles((prev) =>
      prev.map((s) => {
        let qtyChange = 0;
        if (s.id === newMov.sourceStockpileId && (newMov.movementType === "TRANSFER" || newMov.movementType === "OUT")) {
          qtyChange -= newMov.quantity;
        }
        if (s.id === newMov.destinationStockpileId && (newMov.movementType === "TRANSFER" || newMov.movementType === "IN")) {
          qtyChange += newMov.quantity;
        }
        if (qtyChange === 0) return s;

        const newQty = Math.max(0, s.currentQuantity + qtyChange);
        let newStatus = s.status;
        if (newQty >= s.capacity) newStatus = "FULL";
        else if (newQty >= s.capacity * 0.9) newStatus = "NEAR_FULL";
        else if (newQty === 0) newStatus = "EMPTY";
        else newStatus = "ACTIVE";

        return {
          ...s,
          currentQuantity: newQty,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleAddBlendingPlan = (plan: BlendingPlan) => {
    setBlendingPlans((prev) => [plan, ...prev]);
  };

  const handleUpdateBlendingPlan = (updatedPlan: BlendingPlan) => {
    setBlendingPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handleAddAdjustment = (adj: StockAdjustment) => {
    setAdjustments((prev) => [adj, ...prev]);
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: StockpileAlert["status"]) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alertId === alertId ? { ...a, status: newStatus } : a))
    );
  };

  const handleGenerateReport = (rep: StockpileReport) => {
    setReports((prev) => [rep, ...prev]);
  };

  const subTabs = [
    { key: "overview", label: "Overview & Mass Balance", icon: Flame },
    { key: "inventory", label: "Stock Quantity & Inventory", icon: Layers },
    { key: "quality", label: "Stock Quality & Assay", icon: FlaskConical },
    { key: "location", label: "Location & GIS Map", icon: MapPin },
    { key: "blending", label: "AI Blending & Simulator", icon: Scale, isAi: true },
    { key: "rehandling", label: "Rehandling Analytics", icon: RefreshCw },
    { key: "movement", label: "Stock Movement Log", icon: TrendingUp },
    { key: "reconciliation", label: "Survei DTM Drone", icon: Scale },
    { key: "forecast", label: "Stock Forecast", icon: BarChart3 },
    { key: "alerts", label: "Alert Center", icon: AlertTriangle, badge: alerts.filter(a => a.status !== "Resolved").length },
    { key: "ai-insight", label: "AI Intelligence", icon: Sparkles, isAi: true },
    { key: "reports", label: "Laporan & Export", icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 dark:bg-[#090D16]">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Module Header Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/10 px-2.5 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                COAL PROCESSING MODULE
              </span>
              <span className="text-xs text-slate-400">Site BBNU-01</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white tracking-tight sm:text-3xl flex items-center gap-2.5">
              <Flame className="h-7 w-7 text-amber-500" />
              Stockpile Management System
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sistem terpadu kuantitas, kualitas assay GAR, coal blending, rehandling, dan rekonsiliasi survei drone DTM.
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs scrollbar-none dark:border-slate-800 dark:bg-slate-900">
          {subTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? "text-slate-950" : tab.isAi ? "text-amber-500" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${isActive ? "bg-slate-950 text-white" : "bg-red-500 text-white"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-route Tab Content */}
        <div className="pt-2">
          {activeTab === "overview" && (
            <StockpileOverviewTab
              stockpiles={stockpiles}
              movements={movements}
              alerts={alerts}
              blendingPlans={blendingPlans}
              onNavigateTab={(tabKey) => setActiveTab(tabKey)}
              onOpenAICopilot={onOpenAICopilot}
            />
          )}

          {activeTab === "inventory" && (
            <StockpileInventoryTab
              stockpiles={stockpiles}
              onAddStockpile={handleAddStockpile}
              onUpdateStockpile={handleUpdateStockpile}
              onDeleteStockpile={handleDeleteStockpile}
            />
          )}

          {activeTab === "location" && <StockpileLocationGisTab stockpiles={stockpiles} />}

          {activeTab === "quality" && <StockpileQualityTab stockpiles={stockpiles} />}

          {activeTab === "movement" && (
            <StockpileMovementTab
              movements={movements}
              stockpiles={stockpiles}
              onAddMovement={handleAddMovement}
            />
          )}

          {activeTab === "blending" && (
            <StockpileBlendingTab
              blendingPlans={blendingPlans}
              stockpiles={stockpiles}
              onAddBlendingPlan={handleAddBlendingPlan}
              onUpdateBlendingPlan={handleUpdateBlendingPlan}
              onOpenAICopilot={onOpenAICopilot}
            />
          )}

          {activeTab === "rehandling" && <StockpileRehandlingTab rehandlings={rehandlings} />}

          {activeTab === "reconciliation" && (
            <StockpileReconciliationTab
              reconciliations={reconciliations}
              adjustments={adjustments}
              stockpiles={stockpiles}
              onAddAdjustment={handleAddAdjustment}
            />
          )}

          {activeTab === "forecast" && (
            <StockpileForecastTab forecasts={forecasts} stockpiles={stockpiles} />
          )}

          {activeTab === "alerts" && (
            <StockpileAlertsTab
              alerts={alerts}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onOpenAICopilot={onOpenAICopilot}
            />
          )}

          {activeTab === "ai-insight" && (
            <StockpileAiInsightTab
              stockpiles={stockpiles}
              movements={movements}
              blendingPlans={blendingPlans}
            />
          )}

          {activeTab === "reports" && (
            <StockpileReportsTab reports={reports} onGenerateReport={handleGenerateReport} />
          )}
        </div>
      </div>
    </div>
  );
};
