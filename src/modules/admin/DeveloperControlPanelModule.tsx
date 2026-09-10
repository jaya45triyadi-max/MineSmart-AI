// MINE SMART AI - MASTER DEVELOPER CONTROL PANEL & SAAS CONSOLE
// PROMPT 36: Full Multi-Tenant Admin, Dynamic CMS, Pricing, Feature Flags, AI Models & Audit

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  Users,
  Key,
  FileText,
  Image as ImageIcon,
  Palette,
  DollarSign,
  Flag,
  Cpu,
  Settings,
  Activity,
  ExternalLink,
  Plus,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  X,
  Lock,
  Layers,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  PlatformConfig,
  MasterCustomerRecord,
  PlatformAuditLog,
} from "../../types/developerControlPanelTypes";
import { platformConfigService } from "../../services/config/PlatformConfigService";
import {
  DevDashboardView,
  CustomersManagerView,
  GlobalUsersManagerView,
  MasterLicenseManagerView,
  WebsiteCMSManagerView,
  MediaLibraryManagerView,
  BrandingManagerView,
  PricingMatrixManagerView,
  FeatureFlagsManagerView,
  APIAIManagerView,
  PlatformSettingsView,
  HealthAuditLogsView,
  SupportImpersonationView,
} from "./control-panel";

interface DeveloperControlPanelModuleProps {
  onNavigateModule?: (moduleKey: string) => void;
  onEnterCustomerView?: () => void;
}

export const DeveloperControlPanelModule: React.FC<DeveloperControlPanelModuleProps> = ({
  onNavigateModule,
  onEnterCustomerView,
}) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [config, setConfig] = useState<PlatformConfig>(platformConfigService.getConfig());
  const [customers, setCustomers] = useState<MasterCustomerRecord[]>(
    platformConfigService.getCustomers()
  );
  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(
    platformConfigService.getAuditLogs()
  );
  const [mediaAssets, setMediaAssets] = useState(platformConfigService.getMediaAssets());

  // Modal states
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [impersonationBanner, setImpersonationBanner] = useState<{
    companyName: string;
    readOnly: boolean;
    reason: string;
  } | null>(null);

  // New Customer Wizard Form State
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newIupNumber, setNewIupNumber] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPhone, setNewAdminPhone] = useState("");
  const [newPlan, setNewPlan] = useState<"STARTER" | "PROFESSIONAL" | "ENTERPRISE">("PROFESSIONAL");

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((updated) => {
      setConfig(updated);
      setCustomers(platformConfigService.getCustomers());
      setAuditLogs(platformConfigService.getAuditLogs());
      setMediaAssets(platformConfigService.getMediaAssets());
    });
    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setConfig(platformConfigService.getConfig());
    setCustomers(platformConfigService.getCustomers());
    setAuditLogs(platformConfigService.getAuditLogs());
    setMediaAssets(platformConfigService.getMediaAssets());
  };

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newAdminEmail) return;

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const price =
      newPlan === "ENTERPRISE" ? 65000000 : newPlan === "PROFESSIONAL" ? 35000000 : 15000000;
    const maxUsers = newPlan === "ENTERPRISE" ? 500 : newPlan === "PROFESSIONAL" ? 50 : 10;
    const maxSites = newPlan === "ENTERPRISE" ? 10 : newPlan === "PROFESSIONAL" ? 3 : 1;
    const maxStorageGB = newPlan === "ENTERPRISE" ? 1000 : newPlan === "PROFESSIONAL" ? 250 : 50;
    const maxAiQuotaMonth = newPlan === "ENTERPRISE" ? 25000 : newPlan === "PROFESSIONAL" ? 5000 : 1000;

    await platformConfigService.createCustomer(
      {
        companyName: newCompanyName,
        iupNumber: newIupNumber || `IUP-OP-540/${Math.floor(100 + Math.random() * 900)}/ESDM/2026`,
        adminName: newAdminName || "Mining Administrator",
        adminEmail: newAdminEmail,
        adminPhone: newAdminPhone || "+62 811 0000 0000",
        plan: newPlan,
        licenseStatus: "ACTIVE",
        subscriptionStatus: "ACTIVE",
        expiresAt: expiryDate.toISOString(),
        maxUsersLimit: maxUsers,
        activeSitesCount: 1,
        maxSitesLimit: maxSites,
        maxStorageGB: maxStorageGB,
        maxAiQuotaMonth: maxAiQuotaMonth,
        monthlyRevenueIDR: price,
      },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );

    setShowCreateCustomerModal(false);
    setNewCompanyName("");
    setNewIupNumber("");
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPhone("");
    refreshData();
  };

  const handleStartImpersonation = (
    cust: MasterCustomerRecord,
    reason: string,
    readOnly: boolean
  ) => {
    setImpersonationBanner({
      companyName: cust.companyName,
      readOnly,
      reason,
    });
    if (onEnterCustomerView) {
      onEnterCustomerView();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Master Dashboard", icon: LayoutDashboard, category: "OVERVIEW" },
    { id: "customers", label: "Customer Directory", icon: Building2, count: customers.length, category: "TENANTS" },
    { id: "users", label: "Global Users", icon: Users, category: "TENANTS" },
    { id: "license", label: "License & Subscriptions", icon: Key, category: "COMMERCIAL" },
    { id: "pricing", label: "Pricing & Entitlements", icon: DollarSign, category: "COMMERCIAL" },
    { id: "cms", label: "Website CMS & Banners", icon: FileText, category: "PLATFORM_CMS" },
    { id: "media", label: "Media Library", icon: ImageIcon, category: "PLATFORM_CMS" },
    { id: "branding", label: "Branding & White-Label", icon: Palette, category: "PLATFORM_CMS" },
    { id: "features", label: "Feature Flags", icon: Flag, category: "ARCHITECTURE" },
    { id: "ai_api", label: "AI Model & API Gateways", icon: Cpu, category: "ARCHITECTURE" },
    { id: "settings", label: "Platform Settings", icon: Settings, category: "SYSTEM" },
    { id: "health", label: "Health & Audit Logs", icon: Activity, category: "SYSTEM" },
    { id: "support", label: "Tenant Impersonation", icon: ExternalLink, category: "SUPPORT" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Impersonation Banner if active */}
      {impersonationBanner && (
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xl sticky top-0 z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>
              IMPERSONATION ACTIVE: Masuk sebagai tenant{" "}
              <strong>{impersonationBanner.companyName}</strong> (
              {impersonationBanner.readOnly ? "Read-Only" : "Full Access"})
            </span>
          </div>
          <button
            onClick={() => setImpersonationBanner(null)}
            className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded-lg text-white text-[11px] font-black cursor-pointer"
          >
            Akhiri Impersonasi &times;
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">
                MINE SMART AI &bull; Master Developer Console
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                v{config.version} LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Zero-Code-Deployment Configuration & Multi-Tenant Control Hub
            </p>
          </div>
        </div>

        {/* Right Action Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterCustomerView && onEnterCustomerView()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Buka Customer Dashboard</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center border border-purple-400">
              TJ
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-white">Triyadi Jaya</p>
              <p className="text-[10px] font-mono text-emerald-400 font-bold">MASTER DEVELOPER</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-1.5">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 py-1">
              Admin Modules
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-slate-800 text-slate-300">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Published By:</span>
              <strong className="text-white">{config.lastPublishedBy}</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Environment:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {config.environment}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Last Synced:</span>
              <span className="text-slate-300 font-mono text-[10px]">
                {new Date(config.lastPublishedAt).toLocaleTimeString("id-ID")}
              </span>
            </div>
          </div>
        </nav>

        {/* Right Active View Content Area */}
        <main className="lg:col-span-9">
          {activeTab === "dashboard" && (
            <DevDashboardView
              config={config}
              customers={customers}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCreateCustomerModal={() => setShowCreateCustomerModal(true)}
              onOpenGenerateLicenseModal={() => setShowLicenseModal(true)}
            />
          )}

          {activeTab === "customers" && (
            <CustomersManagerView
              customers={customers}
              config={config}
              onRefresh={refreshData}
              onOpenCreateModal={() => setShowCreateCustomerModal(true)}
              onImpersonateTenant={(cust) =>
                handleStartImpersonation(cust, "Akses cepat melalui tabel", true)
              }
            />
          )}

          {activeTab === "users" && <GlobalUsersManagerView />}

          {activeTab === "license" && (
            <MasterLicenseManagerView
              customers={customers}
              config={config}
              onRefresh={refreshData}
            />
          )}

          {activeTab === "pricing" && (
            <PricingMatrixManagerView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "cms" && (
            <WebsiteCMSManagerView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "media" && (
            <MediaLibraryManagerView mediaAssets={mediaAssets} onRefresh={refreshData} />
          )}

          {activeTab === "branding" && (
            <BrandingManagerView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "features" && (
            <FeatureFlagsManagerView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "ai_api" && (
            <APIAIManagerView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "settings" && (
            <PlatformSettingsView config={config} onRefresh={refreshData} />
          )}

          {activeTab === "health" && <HealthAuditLogsView auditLogs={auditLogs} />}

          {activeTab === "support" && (
            <SupportImpersonationView
              customers={customers}
              onStartImpersonation={handleStartImpersonation}
            />
          )}
        </main>
      </div>

      {/* CREATE CUSTOMER MODAL */}
      {showCreateCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-black text-white">Create New Customer Tenant</h3>
              </div>
              <button
                onClick={() => setShowCreateCustomerModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nama Perusahaan Tambang / Entitas Korporat
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Contoh: PT Berau Bara Sejahtera"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Nomor Izin Usaha Pertambangan (IUP)
                  </label>
                  <input
                    type="text"
                    value={newIupNumber}
                    onChange={(e) => setNewIupNumber(e.target.value)}
                    placeholder="IUP-OP-540/120/ESDM/2024"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Paket Lisensi Berlangganan
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="STARTER">Starter (1 Site, 10 Users)</option>
                    <option value="PROFESSIONAL">Professional (3 Sites, 50 Users)</option>
                    <option value="ENTERPRISE">Enterprise Dedicated (10 Sites, 500 Users, Full AI)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Nama Admin Utama Perusahaan
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Contoh: Ir. Gunawan Wibisono"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Alamat Email Admin Utama
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@perusahaan.co.id"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Provisioning Engine:</span>
                </span>
                <p className="text-[11px] text-emerald-400/90">
                  Sistem akan otomatis menghasilkan Kunci Lisensi RSA-4096 unik, membuat tenant terisolasi, dan menetapkan kuota sesuai paket.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCustomerModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer hover:from-emerald-400"
                >
                  Buat Customer & Lisensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE LICENSE MODAL (QUICK POPUP) */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span>Quick License Key Generation</span>
              </h3>
              <button
                onClick={() => setShowLicenseModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Beralih ke tab <strong>License & Subscriptions</strong> untuk manajemen lengkap lisensi dan perpanjangan masa berlaku.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowLicenseModal(false);
                  setActiveTab("license");
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Buka Tab License Manager &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperControlPanelModule;
