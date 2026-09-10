import React, { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Smartphone,
  WifiOff,
  Bot,
  Activity,
  MapPin,
  Compass,
  Layers,
  Ruler,
  Truck,
  Radio,
  Pickaxe,
  Route,
  Fuel,
  Wrench,
  Flame,
  Scale,
  Factory,
  FlaskConical,
  Ship,
  ShieldCheck,
  ShieldAlert,
  Trees,
  Mountain,
  Users,
  Clock,
  ShoppingCart,
  Boxes,
  Coins,
  FileSpreadsheet,
  BarChart3,
  FolderGit2,
  Sliders,
  UserCog,
  Key,
  Settings,
  History,
  Building2,
  Globe2,
  Network,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Cpu,
  Video,
  Brain,
  FileCheck,
} from "lucide-react";
import { NavigationModuleKey } from "../../types";
import { useLanguage } from "../../providers/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SidebarProps {
  activeModule: NavigationModuleKey;
  onSelectModule: (module: NavigationModuleKey) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  title: string;
  items: {
    key: NavigationModuleKey;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpen,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const navGroups: NavGroup[] = [
    {
      title: t("nav.groupMain", "UTAMA"),
      items: [
        { key: "dashboard", label: t("nav.dashboard", "Executive Dashboard"), icon: LayoutDashboard },
        { key: "root-cause", label: t("nav.rootCause", "AI Root Cause Engine (RCA)"), icon: Brain, badge: "⭐ Core USP" },
        { key: "ai-reports", label: t("nav.aiReports", "AI Report Generator"), icon: FileSpreadsheet, badge: "⚡ 1-Click" },
        { key: "cctv", label: t("nav.cctv", "AI CCTV & Vision Guard"), icon: Video, badge: "⚡ 8-Class AI" },
        { key: "iot-center", label: t("nav.iotCenter", "IoT Center & AI Radar"), icon: Cpu, badge: "⚡ 8-Sensor" },
        { key: "multi-company", label: t("nav.multiCompany", "Holding & Multi-Company"), icon: Building2, badge: "🏢 Group" },
        { key: "integration-hub", label: t("nav.integrationHub", "Integration Hub & API"), icon: Network, badge: "⚡ 13 API" },
        { key: "mobile-app", label: t("nav.mobileApp", "Mobile App (9-in-1)"), icon: Smartphone, badge: "📱 Native" },
        { key: "offline-sync", label: t("nav.offlineSync", "Offline Sync & Conflict"), icon: WifiOff, badge: "⚡ Offline" },
        { key: "data-quality", label: t("nav.dataQuality", "Data Quality Center"), icon: ShieldCheck, badge: "⚡ 6-Dim AI" },
        { key: "digital-approval", label: t("nav.digitalApproval", "Digital Approval (4-Stage)"), icon: FileCheck, badge: "⚡ 8-Flow" },
        { key: "audit-trail", label: t("nav.auditTrail", "Audit Trail (6-Dimensi)"), icon: History, badge: "⚡ Who-What" },
        { key: "smart-alerts", label: t("nav.smartAlerts", "Notification & Alert Center"), icon: Bell, badge: "⚡ 5 Channels" },
        { key: "ai-prediction", label: t("nav.aiPrediction", "AI Prediction Engine"), icon: Sparkles, badge: "AI" },
        { key: "rkab", label: t("nav.rkab", "RKAB & Minerba Compliance"), icon: ShieldCheck, badge: "ESDM" },
        { key: "ai", label: t("nav.ai", "AI Command Center"), icon: Bot, badge: "AI" },
      ],
    },
    {
      title: t("nav.groupMineTechnical", "MINE TECHNICAL"),
      items: [
        { key: "gis", label: t("nav.gis", "GIS & Spatial Map"), icon: MapPin },
        { key: "mine-planning", label: t("nav.minePlanning", "Mine Planning"), icon: Compass },
        { key: "geology", label: t("nav.geology", "Geology & Seam"), icon: Layers },
        { key: "survey", label: t("nav.survey", "Mine Survey"), icon: Ruler },
      ],
    },
    {
      title: t("nav.groupOperations", "OPERATIONS & FLEET"),
      items: [
        { key: "root-cause", label: t("nav.rootCause", "AI Root Cause (RCA)"), icon: Brain, badge: "⭐ USP" },
        { key: "equipment", label: t("nav.equipment", "Equipment & Fleet Management"), icon: Truck },
        { key: "dispatch", label: t("nav.dispatch", "FMS & Dispatch"), icon: Radio },
        { key: "production", label: t("nav.production", "Coal & OB Production"), icon: Pickaxe },
        { key: "hauling", label: t("nav.hauling", "Hauling & Logistics"), icon: Route },
        { key: "fuel", label: t("nav.fuel", "Fuel Management"), icon: Fuel },
        { key: "maintenance", label: t("nav.maintenance", "Plant Maintenance"), icon: Wrench },
        { key: "predictive-maintenance", label: t("nav.predictiveMaintenance", "Predictive Maintenance AI"), icon: Activity, badge: "AI" },
      ],
    },
    {
      title: t("nav.groupCoalProcessing", "COAL PROCESSING"),
      items: [
        { key: "stockpile", label: t("nav.stockpile", "Stockpile Management"), icon: Flame },
        { key: "weighbridge", label: t("nav.weighbridge", "Weighbridge Management"), icon: Scale, badge: "AI" },
        { key: "crusher", label: t("nav.crusher", "Crusher & Processing Plant"), icon: Factory, badge: "AI" },
        { key: "laboratory", label: t("nav.laboratory", "Quality & Lab Assay"), icon: FlaskConical },
        { key: "sales", label: t("nav.sales", "Sales & Commercial"), icon: ShoppingCart, badge: "AI" },
        { key: "shipment", label: t("nav.shipment", "Barge & Shipment"), icon: Ship },
      ],
    },
    {
      title: t("nav.groupHSE", "HSE & ENVIRONMENT"),
      items: [
        { key: "cctv", label: t("nav.cctv", "AI CCTV & Vision Guard"), icon: Video, badge: "Enterprise" },
        { key: "hse", label: t("nav.hse", "HSE & Incident Safety"), icon: ShieldCheck },
        { key: "environment", label: t("nav.environment", "Environmental Control"), icon: Trees },
        { key: "reclamation", label: t("nav.reclamation", "Reclamation & Void"), icon: Mountain },
      ],
    },
    {
      title: t("nav.groupCorporate", "CORPORATE & FINANCE"),
      items: [
        { key: "documents", label: t("nav.documents", "Document Management"), icon: FolderGit2, badge: "AI" },
        { key: "hr", label: t("nav.hr", "Human Resources"), icon: Users },
        { key: "attendance", label: t("nav.attendance", "Mining Attendance"), icon: Clock },
        { key: "procurement", label: t("nav.procurement", "Procurement & Vendor"), icon: ShoppingCart },
        { key: "warehouse", label: t("nav.warehouse", "Warehouse & Parts"), icon: Boxes },
        { key: "finance", label: t("nav.finance", "Cost & Commercial"), icon: Coins },
      ],
    },
    {
      title: t("nav.groupAnalytics", "ANALYTICS & REPORTING"),
      items: [
        { key: "bi-builder", label: t("nav.biBuilder", "BI Dashboard Builder"), icon: Sliders, badge: "BI" },
        { key: "reports", label: t("nav.reports", "Automated Reports"), icon: FileSpreadsheet },
        { key: "analytics", label: t("nav.analytics", "Predictive Analytics"), icon: BarChart3 },
      ],
    },
    {
      title: t("nav.groupAdministration", "ADMINISTRATION"),
      items: [
        { key: "developer-control-panel", label: "Master Control Panel", icon: ShieldAlert, badge: "⚡ Dev" },
        { key: "security", label: t("nav.security", "Enterprise Security"), icon: ShieldCheck, badge: "SEC" },
        { key: "users", label: t("nav.users", "User Management"), icon: UserCog },
        { key: "license", label: t("nav.license", "License & Subscriptions"), icon: Key },
        { key: "settings", label: t("nav.settings", "Company Settings"), icon: Settings },
        { key: "audit", label: t("nav.audit", "System Audit Logs"), icon: History },
        { key: "design-system", label: t("nav.designSystem", "Design System Showcase"), icon: Sparkles, badge: "UI" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-[#070E20] text-slate-100 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header Header Bar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <Pickaxe className="h-5 w-5 text-emerald-400" />
              <span className="font-extrabold text-white text-sm tracking-tight">
                MINE SMART AI
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Pickaxe className="h-5 w-5" />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            title={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Search Filter (Only when expanded) */}
        {!isCollapsed && (
          <div className="p-3 pb-1">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={t("common.filter", "Filter") + " menu..."}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-1.5 pl-8 pr-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {navGroups.map((group, groupIdx) => {
            const filteredItems = group.items.filter((item) =>
              item.label.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2 pt-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {group.title}
                  </div>
                )}

                {filteredItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeModule === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelectModule(item.key);
                        onCloseMobile();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`group relative flex w-full items-center ${
                        isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                      } rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-semibold border border-emerald-500/30 shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? "text-emerald-500"
                              : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer AI Copilot & Language Switcher */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5">
            <button
              onClick={() => {
                onSelectModule("ai");
                onCloseMobile();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white text-[11px]">AI Copilot Engine</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400">
                    {t("header.aiCopilot", "AI Copilot")} &bull; Online
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Quick Multi-Language Switcher */}
            <LanguageSwitcher variant="full" />
          </div>
        )}
      </aside>
    </>
  );
};
