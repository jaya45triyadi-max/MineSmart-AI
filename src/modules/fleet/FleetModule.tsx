// MINE SMART AI - Fleet Management & Real-Time Telemetry Module Container

import React, { useState, useEffect } from "react";
import {
  Truck,
  Layers,
  Activity,
  Gauge,
  TrendingUp,
  Fuel,
  Clock,
  RotateCcw,
  Zap,
  Wrench,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { FleetUnitProfile, FleetUnitStatus } from "../../types/fleetManagementTypes";
import { fleetRepository } from "../../services/repositories/FleetRepository";

import { FleetHeader } from "./components/FleetHeader";
import { FleetKPIHeaderGrid } from "./components/FleetKPIHeaderGrid";
import { FleetStatusBar } from "./components/FleetStatusBar";
import { FleetUnitCard } from "./components/FleetUnitCard";
import { FleetUnitProfileModal } from "./components/FleetUnitProfileModal";
import { FleetUnitFormModal } from "./components/FleetUnitFormModal";
import { FleetQuickStatusModal } from "./components/FleetQuickStatusModal";
import { FleetKPIDeepDiveView } from "./components/FleetKPIDeepDiveView";
import { FleetCycleTimeView } from "./components/FleetCycleTimeView";
import { FleetFuelAnalyzerView } from "./components/FleetFuelAnalyzerView";
import { FleetMaintenanceTrackerView } from "./components/FleetMaintenanceTrackerView";
import { FleetAIOptimizerModal } from "./components/FleetAIOptimizerModal";
import { FleetExportReportModal } from "./components/FleetExportReportModal";

interface FleetModuleProps {
  onOpenAICopilot?: () => void;
  initialSubRoute?: string;
}

export const FleetModule: React.FC<FleetModuleProps> = ({
  onOpenAICopilot,
  initialSubRoute = "overview",
}) => {
  // Navigation & Sub-Route State
  const [activeTab, setActiveTab] = useState<
    "overview" | "kpi-deep-dive" | "cycle-time" | "fuel-idle" | "maintenance"
  >(
    initialSubRoute === "cycletime"
      ? "cycle-time"
      : initialSubRoute === "fuel"
      ? "fuel-idle"
      : initialSubRoute === "maintenance"
      ? "maintenance"
      : initialSubRoute === "kpis"
      ? "kpi-deep-dive"
      : "overview"
  );

  // Repository Data & KPIs
  const [units, setUnits] = useState<FleetUnitProfile[]>(fleetRepository.getAllFleetUnits());
  const [kpiOverview, setKpiOverview] = useState(fleetRepository.calculateKPIOverview());

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [selectedUnitForProfile, setSelectedUnitForProfile] = useState<FleetUnitProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [selectedUnitForQuickStatus, setSelectedUnitForQuickStatus] = useState<FleetUnitProfile | null>(null);
  const [isQuickStatusModalOpen, setIsQuickStatusModalOpen] = useState<boolean>(false);

  const [isUnitFormModalOpen, setIsUnitFormModalOpen] = useState<boolean>(false);
  const [unitToEdit, setUnitToEdit] = useState<FleetUnitProfile | null>(null);

  const [isAIOptimizerOpen, setIsAIOptimizerOpen] = useState<boolean>(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState<boolean>(false);

  const refreshData = () => {
    const freshUnits = [...fleetRepository.getAllFleetUnits()];
    setUnits(freshUnits);
    setKpiOverview(fleetRepository.calculateKPIOverview());
  };

  // State Mutators
  const handleUpdateStatus = (id: string, newStatus: FleetUnitStatus, reason?: string) => {
    fleetRepository.setUnitStatus(id, newStatus, reason);
    refreshData();
    if (selectedUnitForProfile && selectedUnitForProfile.id === id) {
      setSelectedUnitForProfile(fleetRepository.getUnitById(id) || null);
    }
  };

  const handleCreateOrUpdateUnit = (unit: FleetUnitProfile) => {
    const existing = fleetRepository.getUnitById(unit.id);
    if (existing) {
      fleetRepository.updateUnit(unit.id, unit);
    } else {
      fleetRepository.addUnit(unit);
    }
    refreshData();
  };

  const handleApplyAIOptimization = (suggestionId: string) => {
    if (suggestionId === "ai-disp-01") {
      // Re-route DT-785-02
      fleetRepository.setUnitStatus(
        "fleet-dt-785-02",
        "RUNNING",
        "Re-routed to Shovel PC2000 Pit 2 North (AI Dispatch)"
      );
    } else if (suggestionId === "ai-pm-03") {
      // Confirm work order for DT-785-03
      fleetRepository.setUnitStatus(
        "fleet-dt-785-03",
        "MAINTENANCE",
        "Service Truck ST-01 on-site replacing hydraulic hose & oil sensor"
      );
    }
    refreshData();
  };

  // Filtered units
  const filteredUnits = units.filter((u) => {
    const matchesCategory =
      selectedCategory === "ALL" || u.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "ALL" || u.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      u.unitId.toLowerCase().includes(q) ||
      u.brand.toLowerCase().includes(q) ||
      u.model.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.operator.name.toLowerCase().includes(q);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 md:p-6 min-h-screen">
      {/* 1. Header with Categories & Action Buttons */}
      <FleetHeader
        kpiOverview={kpiOverview}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onRefresh={refreshData}
        onNewUnit={() => {
          setUnitToEdit(null);
          setIsUnitFormModalOpen(true);
        }}
        onOpenAI={() => setIsAIOptimizerOpen(true)}
        onExportReport={() => setIsExportReportOpen(true)}
      />

      {/* 2. Seven Core KPIs Interactive Header Grid */}
      <FleetKPIHeaderGrid
        kpiOverview={kpiOverview}
        activeKPIFilter={activeTab}
        onSelectKPITab={(kpiKey) => {
          if (kpiKey === "availability" || kpiKey === "utilization" || kpiKey === "productivity") {
            setActiveTab("kpi-deep-dive");
          } else if (kpiKey === "cycle") {
            setActiveTab("cycle-time");
          } else if (kpiKey === "fuel" || kpiKey === "idle") {
            setActiveTab("fuel-idle");
          } else if (kpiKey === "engine-hour") {
            setActiveTab("maintenance");
          }
        }}
      />

      {/* 3. Sub-Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1.5 overflow-x-auto">
        {[
          { key: "overview", label: "Fleet Profile Cards", icon: Truck },
          { key: "kpi-deep-dive", label: "7 KPI Deep-Dive & Leaderboard", icon: Activity, isHighlight: true },
          { key: "cycle-time", label: "Cycle Time & Dispatch Queue", icon: RotateCcw, isHighlight: true },
          { key: "fuel-idle", label: "Fuel & Idle Analyzer", icon: Fuel },
          { key: "maintenance", label: "Maintenance & PM Countdown", icon: Wrench, badge: kpiOverview.engineHour.unitsDueForMaintenanceWithin24h },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.isHighlight
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40"
                    : "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : tab.isHighlight
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Switcher */}
      <div>
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Status distribution & search bar */}
            <FleetStatusBar
              kpiOverview={kpiOverview}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Grid of Unit Profile Cards */}
            {filteredUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUnits.map((unit) => (
                  <FleetUnitCard
                    key={unit.id}
                    unit={unit}
                    onOpenProfile={(u) => {
                      setSelectedUnitForProfile(u);
                      setIsProfileModalOpen(true);
                    }}
                    onQuickStatusChange={(u) => {
                      setSelectedUnitForQuickStatus(u);
                      setIsQuickStatusModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
                <Truck className="h-10 w-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">Tidak Ada Unit Fleet Sesuai Filter</h4>
                <p className="text-xs text-slate-400">
                  Coba ubah kata kunci pencarian atau reset filter kategori / status armada.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSelectedStatus("ALL");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "kpi-deep-dive" && (
          <FleetKPIDeepDiveView
            kpiOverview={kpiOverview}
            units={units}
            onOpenUnit={(u) => {
              setSelectedUnitForProfile(u);
              setIsProfileModalOpen(true);
            }}
          />
        )}

        {activeTab === "cycle-time" && (
          <FleetCycleTimeView
            units={units}
            kpiOverview={kpiOverview}
            onOpenUnit={(u) => {
              setSelectedUnitForProfile(u);
              setIsProfileModalOpen(true);
            }}
          />
        )}

        {activeTab === "fuel-idle" && (
          <FleetFuelAnalyzerView
            units={units}
            kpiOverview={kpiOverview}
            onOpenUnit={(u) => {
              setSelectedUnitForProfile(u);
              setIsProfileModalOpen(true);
            }}
          />
        )}

        {activeTab === "maintenance" && (
          <FleetMaintenanceTrackerView
            units={units}
            kpiOverview={kpiOverview}
            onOpenUnit={(u) => {
              setSelectedUnitForProfile(u);
              setIsProfileModalOpen(true);
            }}
          />
        )}
      </div>

      {/* 5. Modals */}
      {/* Unit Profile Modal */}
      <FleetUnitProfileModal
        unit={selectedUnitForProfile}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUnitForProfile(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Quick Status Modal */}
      <FleetQuickStatusModal
        unit={selectedUnitForQuickStatus}
        isOpen={isQuickStatusModalOpen}
        onClose={() => {
          setIsQuickStatusModalOpen(false);
          setSelectedUnitForQuickStatus(null);
        }}
        onConfirmStatusChange={handleUpdateStatus}
      />

      {/* Unit Form Modal (Create / Edit) */}
      <FleetUnitFormModal
        isOpen={isUnitFormModalOpen}
        onClose={() => setIsUnitFormModalOpen(false)}
        onSubmit={handleCreateOrUpdateUnit}
        initialUnit={unitToEdit}
      />

      {/* AI Fleet Optimization Copilot Modal */}
      <FleetAIOptimizerModal
        isOpen={isAIOptimizerOpen}
        onClose={() => setIsAIOptimizerOpen(false)}
        kpiOverview={kpiOverview}
        units={units}
        onApplyOptimization={handleApplyAIOptimization}
      />

      {/* Export Shift Report Modal */}
      <FleetExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        kpiOverview={kpiOverview}
        units={units}
      />
    </div>
  );
};
