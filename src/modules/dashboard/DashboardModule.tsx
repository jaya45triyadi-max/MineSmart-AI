// MINE SMART AI - Main Operations Command Center & Executive Dashboard Module
// Concept: Luxury Enterprise Dashboard (Glassmorphism, 3D Pit Twin, GIS Telemetry Radar, Animated KPIs)

import React, { useState, useEffect, useCallback } from "react";
import {
  Pickaxe,
  Truck,
  Fuel,
  ShieldCheck,
  Flame,
  Coins,
  Bot,
  Sparkles,
  AlertTriangle,
  Layers,
  PlusCircle,
  CheckCircle2,
  Crown,
  Activity,
  SlidersHorizontal,
  Compass,
  MapPin,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { useLicense } from "../../providers/LicenseProvider";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardKPICard } from "./components/DashboardKPICard";
import { DashboardWidget } from "./components/DashboardWidget";
import { ExecutiveSummaryCard } from "./components/ExecutiveSummaryCard";
import { ExecutiveCLevelView } from "./components/ExecutiveCLevelView";
import { ProductionWidget } from "./components/ProductionWidget";
import { FleetWidget } from "./components/FleetWidget";
import { FuelCostWidget } from "./components/FuelCostWidget";
import { HSEWidget } from "./components/HSEWidget";
import { StockpileWidget } from "./components/StockpileWidget";
import { AIInsightsPanel } from "./components/AIInsightsPanel";
import { RealTimeAlertCenter } from "./components/RealTimeAlertCenter";
import { OperationalSummaryTable } from "./components/OperationalSummaryTable";
import { TopOperationalIssues } from "./components/TopOperationalIssues";
import { QuickActionsBar } from "./components/QuickActionsBar";
import { ExecutiveReportModal } from "./components/ExecutiveReportModal";
import { DashboardCustomizerModal, WidgetVisibilityState } from "./components/DashboardCustomizerModal";
import { CommandCenterHUD } from "./components/CommandCenterHUD";
import { Mine3DVisualizationWidget } from "./components/Mine3DVisualizationWidget";
import { GISCommandMapWidget } from "./components/GISCommandMapWidget";
import { AIMiningCorePillarsSuite } from "../ai/components/AIMiningCorePillarsSuite";
import { DashboardService } from "../../services/dashboard/DashboardService";
import {
  DashboardPayload,
  DateRangeFilter,
  ShiftFilter,
} from "../../services/dashboard/DashboardAnalyticsService";

interface DashboardModuleProps {
  onOpenAICopilot: () => void;
  onNavigateModule: (moduleKey: any) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onOpenAICopilot,
  onNavigateModule,
}) => {
  const { activeSite, activeCompany, company, companies, sites, switchCompany, switchSite, currentUser } = useAuth();
  const { licenseState } = useLicense();

  // Role Based View Defaults
  const userRole = currentUser?.role || "SITE_MANAGER";
  const isOwnerDirector = userRole === "MINING_OWNER" || userRole === "SUPER_ADMIN" || userRole === "FINANCE_MANAGER";
  const isHSEOfficer = userRole === "HSE_OFFICER";
  const isFinanceManager = userRole === "FINANCE_MANAGER";
  const isMineEngineer = userRole === "MINE_ENGINEER" || userRole === "GEOLOGIST" || userRole === "SURVEYOR";

  // Dashboard Mode State: C-Level Executive vs Operations Command Center vs 10 Core AI Pillars
  const [dashboardMode, setDashboardMode] = useState<"EXECUTIVE" | "OPERATIONS" | "AI_PILLARS">(() =>
    isOwnerDirector ? "EXECUTIVE" : "OPERATIONS"
  );

  // Operations Sub-view: ALL / 3D_SPATIAL / ANALYTICS / GIS_RADAR
  const [operationsView, setOperationsView] = useState<"ALL" | "3D_SPATIAL" | "ANALYTICS" | "GIS_RADAR">("ALL");

  // Context Filter States
  const companyId = activeCompany?.id || "COMP-BNU-01";
  const siteId = activeSite?.id || "SITE-KAL-A";
  const [dateRange, setDateRange] = useState<DateRangeFilter>("Today");
  const [shift, setShift] = useState<ShiftFilter>("All Shift");
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(60); // seconds

  // Data Loading States
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Modal States
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState<boolean>(false);
  const [showCustomizerModal, setShowCustomizerModal] = useState<boolean>(false);

  // Widget Visibility Preferences State
  const [visibility, setVisibility] = useState<WidgetVisibilityState>({
    executiveSummary: true,
    production: true,
    fleet: true,
    fuelCost: true,
    hse: true,
    stockpile: true,
    aiInsights: true,
    alerts: true,
    operationalSummary: true,
    topIssues: true,
  });

  // Fetch Dashboard Payload
  const loadDashboardData = useCallback(async (isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setIsError(false);

    try {
      const data = await DashboardService.getDashboardData({
        companyId,
        siteId,
        dateRange,
        shift,
        role: currentUser?.role || "SITE_MANAGER",
        permissions: currentUser ? [currentUser.role] : [],
      });
      setPayload(data);
    } catch (error) {
      console.error("[DashboardModule] Error loading dashboard payload:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [companyId, siteId, dateRange, shift, currentUser?.role]);

  // Initial Load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh interval timer
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      loadDashboardData(true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, loadDashboardData]);

  // Handle alert acknowledge
  const handleAcknowledgeAlert = async (alertId: string) => {
    if (!payload) return;
    await DashboardService.acknowledgeAlert(alertId, currentUser?.id || "USR-CURRENT");

    setPayload((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        alerts: prev.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
      };
    });
  };

  const handleToggleWidget = (key: keyof WidgetVisibilityState, visible: boolean) => {
    setVisibility((prev) => ({ ...prev, [key]: visible }));
  };

  const handleResetCustomizer = () => {
    setVisibility({
      executiveSummary: true,
      production: true,
      fleet: true,
      fuelCost: true,
      hse: true,
      stockpile: true,
      aiInsights: true,
      alerts: true,
      operationalSummary: true,
      topIssues: true,
    });
  };

  const companyNameDisplay = activeCompany?.displayName || "PT Batubara Nusa Utama";
  const siteNameDisplay = activeSite?.name || "Site Kalimantan A (Sangatta)";
  const availableSitesList = sites.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Global Controls */}
      <DashboardHeader
        companyName={companyNameDisplay}
        selectedCompanyId={companyId}
        onCompanyChange={(cid) => switchCompany(cid)}
        siteName={siteNameDisplay}
        selectedSiteId={siteId}
        onSiteChange={(sid) => switchSite(sid)}
        availableSites={availableSitesList}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        shift={shift}
        onShiftChange={setShift}
        lastUpdated={payload?.lastUpdatedTime || "17:45 WIB"}
        isRefreshing={isRefreshing}
        onRefresh={() => loadDashboardData(true)}
        autoRefreshInterval={autoRefreshInterval}
        onAutoRefreshIntervalChange={setAutoRefreshInterval}
        onOpenExecutiveReport={() => setShowExecutiveReportModal(true)}
        onOpenAICopilot={onOpenAICopilot}
        onOpenCustomizer={() => setShowCustomizerModal(true)}
      />

      {/* 2. Luxury Command Mode Switcher Bar */}
      <div className="rounded-3xl border border-slate-800/90 bg-[#0D1A3B]/90 p-3.5 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 luxury-card-glow">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDashboardMode("EXECUTIVE")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              dashboardMode === "EXECUTIVE"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black"
                : "bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Crown className={`h-4 w-4 ${dashboardMode === "EXECUTIVE" ? "text-slate-950" : "text-amber-400"}`} />
            <span>EXECUTIVE BOARDROOM (C-LEVEL)</span>
          </button>

          <button
            onClick={() => setDashboardMode("OPERATIONS")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              dashboardMode === "OPERATIONS"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black"
                : "bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Activity className={`h-4 w-4 ${dashboardMode === "OPERATIONS" ? "text-slate-950" : "text-emerald-400"}`} />
            <span>OPERATIONS COMMAND CENTER</span>
          </button>

          <button
            onClick={() => setDashboardMode("AI_PILLARS")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              dashboardMode === "AI_PILLARS"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 font-black"
                : "bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Sparkles className={`h-4 w-4 ${dashboardMode === "AI_PILLARS" ? "text-amber-300" : "text-purple-400"}`} />
            <span>10 CORE AI PILLARS SUITE</span>
          </button>
        </div>

        {/* Sub-view switcher for operations */}
        {dashboardMode === "OPERATIONS" && (
          <div className="flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setOperationsView("ALL")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                operationsView === "ALL"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Full Command Suite
            </button>
            <button
              onClick={() => setOperationsView("3D_SPATIAL")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                operationsView === "3D_SPATIAL"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Pit Twin</span>
            </button>
            <button
              onClick={() => setOperationsView("GIS_RADAR")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                operationsView === "GIS_RADAR"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>GIS Radar</span>
            </button>
            <button
              onClick={() => setOperationsView("ANALYTICS")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                operationsView === "ANALYTICS"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Quick Actions Bar */}
      <QuickActionsBar
        onNavigateModule={onNavigateModule}
        onOpenAICopilot={onOpenAICopilot}
        onOpenExecutiveReport={() => setShowExecutiveReportModal(true)}
      />

      {/* 4. MODE 1: EXECUTIVE C-LEVEL BOARD VIEW (CEO / DIREKTUR / OWNER) */}
      {dashboardMode === "EXECUTIVE" && payload && (
        <ExecutiveCLevelView
          companyName={companyNameDisplay}
          siteName={siteNameDisplay}
          production={payload.production}
          fleet={payload.fleet}
          fuelCost={payload.fuelCost}
          hse={payload.hse}
          stockpile={payload.stockpile}
          aiInsights={payload.aiInsights}
          onOpenAICopilot={onOpenAICopilot}
          onNavigateModule={onNavigateModule}
          onOpenExecutiveReport={() => setShowExecutiveReportModal(true)}
        />
      )}

      {/* 5. MODE 2: 10 CORE AI PILLARS MATRIX */}
      {dashboardMode === "AI_PILLARS" && (
        <AIMiningCorePillarsSuite
          onOpenAICopilot={onOpenAICopilot}
          onNavigateModule={onNavigateModule}
        />
      )}

      {/* 6. MODE 3: OPERATIONS COMMAND CENTER VIEW */}
      {dashboardMode === "OPERATIONS" && (
        <>
          {/* Mission Control Live Telemetry HUD */}
          <CommandCenterHUD
            onOpenAICopilot={onOpenAICopilot}
            onNavigateModule={onNavigateModule}
          />

          {/* 3D Pit Digital Twin & Topology Widget */}
          {(operationsView === "ALL" || operationsView === "3D_SPATIAL") && (
            <Mine3DVisualizationWidget
              onNavigateModule={onNavigateModule}
              onOpenAICopilot={onOpenAICopilot}
            />
          )}

          {/* GIS Spatial Command & Fleet Telemetry Radar */}
          {(operationsView === "ALL" || operationsView === "GIS_RADAR") && (
            <GISCommandMapWidget onNavigateModule={onNavigateModule} />
          )}

          {/* Executive Summary Card (Manager Priority) */}
          {visibility.executiveSummary && payload && (operationsView === "ALL" || operationsView === "ANALYTICS") && (
            <ExecutiveSummaryCard
              data={payload.executiveSummary}
              onOpenAICopilot={onOpenAICopilot}
              onNavigateModule={onNavigateModule}
            />
          )}

          {/* Top KPI Overview Cards Row */}
          {payload && (operationsView === "ALL" || operationsView === "ANALYTICS") && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* KPI 1: Production */}
              <DashboardKPICard
                title="Produksi Coal"
                value={payload.production.coalActualTon.toLocaleString("id-ID")}
                unit="Ton"
                target={`${payload.production.coalTargetTon.toLocaleString("id-ID")} T`}
                achievementPct={payload.production.coalAchievementPct}
                icon={<Pickaxe className="h-5 w-5" />}
                iconBgColor="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                statusBadge={{
                  label:
                    payload.production.status === "ABOVE_TARGET"
                      ? "Melampaui Target"
                      : payload.production.status === "CRITICAL"
                      ? "Deviasi Kritis"
                      : "On Target",
                  type:
                    payload.production.status === "ABOVE_TARGET"
                      ? "SUCCESS"
                      : payload.production.status === "CRITICAL"
                      ? "DANGER"
                      : "WARNING",
                }}
                onClick={() => onNavigateModule("production")}
                isLoading={isLoading}
              />

              {/* KPI 2: Overburden */}
              <DashboardKPICard
                title="Overburden (OB)"
                value={payload.production.obActualBCM.toLocaleString("id-ID")}
                unit="BCM"
                target={`${payload.production.obTargetBCM.toLocaleString("id-ID")} B`}
                achievementPct={payload.production.obAchievementPct}
                icon={<Layers className="h-5 w-5" />}
                iconBgColor="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
                statusBadge={{ label: `SR ${payload.production.stripRatioActual}`, type: "INFO" }}
                onClick={() => onNavigateModule("production")}
                isLoading={isLoading}
              />

              {/* KPI 3: Fleet Physical Availability */}
              <DashboardKPICard
                title="Fleet PA"
                value={`${payload.fleet.physicalAvailabilityPA}%`}
                target={`Tgt ${payload.fleet.paTarget}%`}
                variance={`+${payload.fleet.paVariance}%`}
                icon={<Truck className="h-5 w-5" />}
                iconBgColor="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                statusBadge={{ label: `${payload.fleet.running} Units Run`, type: "SUCCESS" }}
                onClick={() => onNavigateModule("fleet")}
                isLoading={isLoading}
              />

              {/* KPI 4: Fuel Consumption Ratio */}
              <DashboardKPICard
                title="Fuel Ratio"
                value={`${payload.fuelCost.fuelPerTonRatio}`}
                unit="L/Ton"
                target={`Tgt ${payload.fuelCost.fuelPerTonTarget}`}
                variance={`+${payload.fuelCost.fuelVariancePct}%`}
                icon={<Fuel className="h-5 w-5" />}
                iconBgColor="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                statusBadge={{
                  label: payload.fuelCost.hasFuelAnomaly ? "Anomali +8.7%" : "Normal",
                  type: payload.fuelCost.hasFuelAnomaly ? "WARNING" : "SUCCESS",
                }}
                onClick={() => onNavigateModule("fuel")}
                isLoading={isLoading}
              />

              {/* KPI 5: Operating Cost */}
              <DashboardKPICard
                title="OPEX Cost"
                value={`Rp ${(payload.fuelCost.operatingCostIDR / 1000000000).toFixed(1)}M`}
                target={`Bgt Rp ${(payload.fuelCost.budgetCostIDR / 1000000000).toFixed(1)}M`}
                variance={`+${payload.fuelCost.costVariancePct}%`}
                icon={<Coins className="h-5 w-5" />}
                iconBgColor="bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30"
                statusBadge={{ label: `Rp ${payload.fuelCost.costPerTonIDR.toLocaleString("id-ID")}/T`, type: "INFO" }}
                onClick={() => onNavigateModule("finance")}
                isLoading={isLoading}
              />

              {/* KPI 6: HSE Record */}
              <DashboardKPICard
                title="HSE Safety"
                value={`${payload.hse.daysWithoutLTI}`}
                unit="Hari LTI"
                icon={<ShieldCheck className="h-5 w-5" />}
                iconBgColor="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                statusBadge={{
                  label: payload.hse.hseStatus === "SAFE" ? "Zero LTI" : "1 High Risk",
                  type: payload.hse.hseStatus === "SAFE" ? "SUCCESS" : "DANGER",
                }}
                onClick={() => onNavigateModule("hse")}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Main Operations Grid */}
          {payload && (operationsView === "ALL" || operationsView === "ANALYTICS") && (
            <div className="grid grid-cols-12 gap-6">
              {/* Production Performance & Trend Widget */}
              {visibility.production && (
                <DashboardWidget
                  id="widget-production"
                  title="Performa Produksi Batu Bara & OB"
                  subtitle="Pencapaian ritase harian vs target pit"
                  badgeText={`${payload.production.coalAchievementPct}% ACHIEVED`}
                  badgeType={payload.production.coalAchievementPct >= 95 ? "EMERALD" : "AMBER"}
                  colSpan={isMineEngineer || isOwnerDirector ? "col-span-12 lg:col-span-8" : "col-span-12 lg:col-span-6"}
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("production", false)}
                >
                  <ProductionWidget data={payload.production} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* Fleet Performance & Status Widget */}
              {visibility.fleet && (
                <DashboardWidget
                  id="widget-fleet"
                  title="Performa Fleet & Status Peralatan"
                  subtitle="Utilisasi (UA) dan ketersediaan fisik (PA) alat berat"
                  badgeText={`PA ${payload.fleet.physicalAvailabilityPA}%`}
                  badgeType="CYAN"
                  colSpan={isMineEngineer || isOwnerDirector ? "col-span-12 lg:col-span-4" : "col-span-12 lg:col-span-6"}
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("fleet", false)}
                >
                  <FleetWidget data={payload.fleet} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* AI Insights Panel */}
              {visibility.aiInsights && (
                <DashboardWidget
                  id="widget-ai-insights"
                  title="AI Prescriptive Insights & Root Cause Analysis"
                  subtitle="Rekomendasi optimasi berbasis AI pada seluruh rantai pasok tambang"
                  badgeText="REAL-TIME AI"
                  badgeType="EMERALD"
                  colSpan="col-span-12 lg:col-span-6"
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("aiInsights", false)}
                >
                  <AIInsightsPanel
                    insights={payload.aiInsights}
                    onOpenAICopilot={onOpenAICopilot}
                    onNavigateModule={onNavigateModule}
                    licensePlan={licenseState?.licenseKey?.plan || "ENTERPRISE"}
                  />
                </DashboardWidget>
              )}

              {/* Real-Time Alert Center */}
              {visibility.alerts && (
                <DashboardWidget
                  id="widget-alerts"
                  title="Real-Time Operational Alerts Center"
                  subtitle="Feed peringatan kritis otomatis dari telemetri IoT & rule engine"
                  badgeText={`${payload.alerts.filter((a) => !a.acknowledged).length} AKTIF`}
                  badgeType={payload.alerts.some((a) => a.severity === "CRITICAL" && !a.acknowledged) ? "ROSE" : "AMBER"}
                  colSpan="col-span-12 lg:col-span-6"
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("alerts", false)}
                >
                  <RealTimeAlertCenter
                    alerts={payload.alerts}
                    onAcknowledgeAlert={handleAcknowledgeAlert}
                    onNavigateModule={onNavigateModule}
                  />
                </DashboardWidget>
              )}

              {/* Fuel & Operating Cost Analytics Widget */}
              {visibility.fuelCost && (
                <DashboardWidget
                  id="widget-fuel-cost"
                  title="Audit Konsumsi BBM & Struktur Biaya OPEX"
                  subtitle="Evaluasi efisiensi solar (L/Ton) dan variance anggaran operasional"
                  badgeText={payload.fuelCost.hasFuelAnomaly ? "ANOMALI BBM" : "COST STABLE"}
                  badgeType={payload.fuelCost.hasFuelAnomaly ? "AMBER" : "EMERALD"}
                  colSpan={isFinanceManager ? "col-span-12 lg:col-span-8" : "col-span-12 lg:col-span-6"}
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("fuelCost", false)}
                >
                  <FuelCostWidget data={payload.fuelCost} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* HSE & Safety Performance Widget */}
              {visibility.hse && (
                <DashboardWidget
                  id="widget-hse"
                  title="Keselamatan & Kesehatan Kerja (HSE / K3LH)"
                  subtitle="Monitoring catatan hari kerja tanpa LTI dan temuan risiko tinggi"
                  badgeText={`${payload.hse.daysWithoutLTI} HARI LTI`}
                  badgeType={isHSEOfficer ? "ROSE" : "EMERALD"}
                  colSpan={isHSEOfficer ? "col-span-12 lg:col-span-8" : "col-span-12 lg:col-span-6"}
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("hse", false)}
                >
                  <HSEWidget data={payload.hse} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* Stockpile Capacity & Quality Widget */}
              {visibility.stockpile && (
                <DashboardWidget
                  id="widget-stockpile"
                  title="Okupansi Stockpile & Spesifikasi Kualitas Batubara"
                  subtitle="Kapasitas penampungan ROM dan parameter laboratorium batu bara"
                  badgeText={`OKUPANSI ${payload.stockpile.occupancyPct}%`}
                  badgeType="AMBER"
                  colSpan="col-span-12 lg:col-span-6"
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("stockpile", false)}
                >
                  <StockpileWidget data={payload.stockpile} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* Top Operational Issues Tracking Widget */}
              {visibility.topIssues && (
                <DashboardWidget
                  id="widget-top-issues"
                  title="Top 5 Hambatan Operasional Kritis"
                  subtitle="Isu hambatan paling dominan yang menurunkan efisiensi tambang hari ini"
                  badgeText="PRIORITY ISSUES"
                  badgeType="ROSE"
                  colSpan="col-span-12 lg:col-span-6"
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("topIssues", false)}
                >
                  <TopOperationalIssues issues={payload.topOperationalIssues} onNavigateModule={onNavigateModule} />
                </DashboardWidget>
              )}

              {/* Operational Summary Table */}
              {visibility.operationalSummary && (
                <DashboardWidget
                  id="widget-operational-summary"
                  title="Tabel Rincian Ringkasan Metrik Operasional"
                  subtitle="Perbandingan komprehensif antara aktual, target, dan status deviasi"
                  badgeText="HOLISTIC MATRIX"
                  badgeType="CYAN"
                  colSpan="col-span-12"
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => loadDashboardData()}
                  onHide={() => handleToggleWidget("operationalSummary", false)}
                >
                  <OperationalSummaryTable rows={payload.operationalSummaryTable} />
                </DashboardWidget>
              )}
            </div>
          )}
        </>
      )}

      {/* Executive Report Modal */}
      {payload && (
        <ExecutiveReportModal
          isOpen={showExecutiveReportModal}
          onClose={() => setShowExecutiveReportModal(false)}
          payload={payload}
          companyName={companyNameDisplay}
          siteName={siteNameDisplay}
        />
      )}

      {/* Customizer Modal */}
      <DashboardCustomizerModal
        isOpen={showCustomizerModal}
        onClose={() => setShowCustomizerModal(false)}
        visibility={visibility}
        onChangeVisibility={handleToggleWidget}
        onReset={handleResetCustomizer}
      />
    </div>
  );
};
