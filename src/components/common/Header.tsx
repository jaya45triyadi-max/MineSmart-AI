import React, { useState } from "react";
import {
  Pickaxe,
  Building2,
  MapPin,
  Search,
  Bell,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  Sparkles,
  Layers,
  ShieldCheck,
  Globe2,
  Lock,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { useLanguage } from "../../providers/LanguageProvider";
import { UserRole } from "../../types";
import { CommandPalette } from "./CommandPalette";
import { NotificationCenter } from "./NotificationCenter";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenAICopilot: () => void;
  onOpenLicenseModal: () => void;
  activeModule: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenAICopilot,
  onOpenLicenseModal,
  activeModule,
}) => {
  const {
    currentUser,
    holding,
    companies,
    company,
    activeCompany,
    sites,
    activeSite,
    activeScope,
    isHoldingScope,
    license,
    switchHoldingView,
    switchCompany,
    switchSite,
    switchRole,
  } = useAuth();

  const { effectiveTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global command palette hook window function
  (window as any).__OPEN_COMMAND_PALETTE__ = () => setIsCommandPaletteOpen(true);

  const rolesList: { role: UserRole; label: string }[] = [
    { role: "MINING_OWNER", label: "Mining Owner (Group President)" },
    { role: "SITE_MANAGER", label: "Site General Manager" },
    { role: "MINE_ENGINEER", label: "Mine Planning Engineer" },
    { role: "DISPATCH_OPERATOR", label: "Dispatch / FMS Operator" },
    { role: "HSE_OFFICER", label: "HSE & Safety Officer" },
    { role: "FINANCE_MANAGER", label: "Finance & Cost Controller" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#070E20]/95 px-3 sm:px-4 backdrop-blur-md text-slate-100 transition-colors">
        {/* Left: Brand / Sidebar Toggle / Multi-Company 3-Tier Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-300 hover:bg-[#132247] lg:hidden cursor-pointer"
            title="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => {
              if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("dashboard");
              }
            }}
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 shadow-md shadow-emerald-500/20">
              <Pickaxe className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  MINE SMART
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] lg:max-w-[200px]">
                {holding?.displayName || "NUSA MINING GROUP"}
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* 3-Tier Multi-Company Hierarchy Selector (Holding -> Company -> Site) */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Level 1: Holding View Trigger Button */}
            <button
              onClick={() => {
                switchHoldingView();
                setIsCompanyDropdownOpen(false);
                setIsSiteDropdownOpen(false);
              }}
              title="Konsolidasi Level Holding (Seluruh Anak Perusahaan)"
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isHoldingScope
                  ? "border-purple-500/60 bg-purple-500/20 text-purple-300 shadow-sm"
                  : "border-slate-800 bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden xl:inline">Holding:</span>
              <span className="font-bold text-purple-200">NMG Group</span>
            </button>

            {/* Level 2: Company Selector Dropdown (Company A / B / C) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
                  setIsSiteDropdownOpen(false);
                }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all cursor-pointer ${
                  !isHoldingScope
                    ? "border-emerald-500/50 bg-[#132247] text-white shadow-sm"
                    : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold max-w-[130px] lg:max-w-[170px] truncate">
                  {company?.shortName || company?.displayName || "PT Batubara Nusa Utama"}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isCompanyDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-slate-700 bg-[#0D1938] p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Pilih Anak Perusahaan (Company)</span>
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Data Terisolasi
                    </span>
                  </div>

                  <div className="space-y-1">
                    {companies.map((comp) => {
                      const isSelected = !isHoldingScope && company.id === comp.id;
                      return (
                        <button
                          key={comp.id}
                          onClick={() => {
                            switchCompany(comp.id);
                            setIsCompanyDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                              : "text-slate-300 hover:bg-[#132247]"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{comp.displayName}</span>
                            </div>
                            <p className="text-[10px] text-slate-400">{comp.commodityLabel}</p>
                            <span className="inline-block text-[9px] font-mono text-slate-500">
                              IUP: {comp.iupNumber} • {comp.operatingSitesCount} Sites
                            </span>
                          </div>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        if ((window as any).__NAVIGATE_MODULE__) {
                          (window as any).__NAVIGATE_MODULE__("multi-company");
                        }
                        setIsCompanyDropdownOpen(false);
                      }}
                      className="w-full text-center text-[11px] font-bold text-teal-400 hover:text-teal-300 py-1"
                    >
                      Kelola Holding & Multi-Company Hub →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Level 3: Site Selector Dropdown (Filtered under active Company) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSiteDropdownOpen(!isSiteDropdownOpen);
                  setIsCompanyDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#132247] px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-500/50 hover:bg-[#1A2C5B] transition-all cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-teal-400" />
                <span className="font-semibold max-w-[120px] lg:max-w-[150px] truncate">
                  {activeSite?.name || "Pilih Site"}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isSiteDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-700 bg-[#0D1938] p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1.5">
                    Lokasi Tambang ({company?.shortName || "Company"})
                  </div>
                  <div className="space-y-1">
                    {sites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          switchSite(site.id);
                          setIsSiteDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl p-2 text-left text-xs transition-all cursor-pointer ${
                          activeSite.id === site.id
                            ? "bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30"
                            : "text-slate-300 hover:bg-[#132247]"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-white">{site.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {site.province} • {site.miningType}
                          </p>
                        </div>
                        {activeSite.id === site.id && (
                          <span className="h-2 w-2 rounded-full bg-teal-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tenant Isolation Indicator Badge */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>ISOLATION: <strong className="text-emerald-300">{company?.isolationKey ? "STRICT_ISOLATED" : "ACTIVE"}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Command Search, AI Quick Trigger, Multi-Company Hub Link, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Company Hub Quick Button */}
          <button
            onClick={() => {
              if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("multi-company");
              }
            }}
            className={`hidden lg:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeModule === "multi-company" || activeModule === "holding"
                ? "border-teal-500/50 bg-teal-500/20 text-teal-300"
                : "border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-teal-400" />
            <span>{t("header.multiCompanyHub", "Multi-Company Hub")}</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden xl:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{t("header.searchPrompt", "Pencarian / Command...")}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              Ctrl K
            </span>
          </button>

          {/* AI Command Center Trigger */}
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
            <span className="hidden sm:inline">{t("header.aiCopilot", "AI Copilot")}</span>
          </button>

          {/* Master Developer Control Panel Trigger */}
          <button
            onClick={() => {
              if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("developer-control-panel");
              }
            }}
            className="hidden lg:flex items-center gap-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 px-2.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition-all cursor-pointer"
            title="Developer Master Control Panel"
          >
            <ShieldAlert className="h-4 w-4 text-purple-400" />
            <span>Dev Console</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-bold text-[11px]">{currentUser.role}</span>
              <ChevronDown className="h-3 w-3 text-amber-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-700 bg-[#0D1938] p-2 shadow-2xl z-50">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Switch User Role Simulation
                </div>
                <div className="space-y-0.5">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        currentUser.role === r.role
                          ? "bg-amber-500/20 text-amber-300 font-bold"
                          : "text-slate-300 hover:bg-[#132247]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Multi-Language Switcher (ID / EN / ZH) */}
          <LanguageSwitcher variant="header" />

          {/* Notification Center Trigger */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
            title={t("header.notificationTitle", "Pusat Notifikasi Smart Alert")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => {
              if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("profile");
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1 pl-2.5 cursor-pointer hover:border-slate-700 transition-all"
          >
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                {currentUser.fullName || "Drs. H. Bambang"}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                {company?.code || "BNU"}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-500 text-slate-950 font-black text-xs">
              {currentUser.fullName ? currentUser.fullName[0] : "B"}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(modKey) => {
          if ((window as any).__NAVIGATE_MODULE__) {
            (window as any).__NAVIGATE_MODULE__(modKey);
          }
        }}
      />

      {/* Global Notification Drawer */}
      <NotificationCenter
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </>
  );
};
