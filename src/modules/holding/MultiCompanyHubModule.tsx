import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import {
  HoldingGroup,
  MultiCompanyEntity,
  MultiSiteEntity,
  HoldingConsolidatedKPIs,
  CompanyContributionSummary,
  TenantIsolationAuditRecord,
  UserTenantAccessMatrix,
  CommodityType,
} from "../../types/multiCompanyTypes";
import { multiCompanyRepository } from "../../services/repositories/MultiCompanyRepository";
import {
  Building2,
  Globe2,
  MapPin,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  TrendingUp,
  Coins,
  Truck,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  Database,
  Search,
  ExternalLink,
  Sliders,
  Award,
  Flame,
  Scale,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  Briefcase,
  Eye,
  Activity,
  Check,
  X,
  Radio,
} from "lucide-react";

export const MultiCompanyHubModule: React.FC = () => {
  const {
    holding,
    companies,
    company,
    activeCompany,
    sites,
    activeSite,
    activeScope,
    isHoldingScope,
    currentUser,
    switchHoldingView,
    switchCompany,
    switchSite,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "hierarchy" | "consolidation" | "companies" | "isolation-guard" | "access-matrix"
  >("hierarchy");

  const [allCompanies, setAllCompanies] = useState<MultiCompanyEntity[]>([]);
  const [allSites, setAllSites] = useState<MultiSiteEntity[]>([]);
  const [consolidatedKpis, setConsolidatedKpis] = useState<HoldingConsolidatedKPIs | null>(null);
  const [contributions, setContributions] = useState<CompanyContributionSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<TenantIsolationAuditRecord[]>([]);
  const [accessMatrix, setAccessMatrix] = useState<UserTenantAccessMatrix[]>([]);
  const [loading, setLoading] = useState(false);

  // New Company Modal State
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    code: "",
    displayName: "",
    legalName: "",
    shortName: "",
    commodity: "COAL" as CommodityType,
    commodityLabel: "",
    iupNumber: "",
    iupExpiryDate: "2040-12-31",
    concessionAreaHa: 10000,
    annualProductionTargetMT: 5000000,
    colorTheme: "emerald",
  });

  // New Site Modal State
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [selectedCompanyForSite, setSelectedCompanyForSite] = useState<string>("");
  const [newSiteData, setNewSiteData] = useState({
    name: "",
    code: "",
    miningType: "Open Pit Mining",
    province: "Kalimantan Timur",
    location: "",
    concessionAreaHa: 3500,
    pitCount: 2,
    fleetCount: 30,
    monthlyCoalMT: 200000,
    monthlyOBBCM: 800000,
    managerName: "Ir. Ahmad Sanusi, S.T.",
  });

  // Isolation Test Simulation State
  const [isolationTesting, setIsolationTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    resultType: string;
    message: string;
    appliedQueryFilter: string;
    isolationKey: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [comps, sts, kpis, contr, logs, acc] = await Promise.all([
        multiCompanyRepository.getAllCompanies(),
        multiCompanyRepository.getAllSites(),
        multiCompanyRepository.getConsolidatedKPIs(),
        multiCompanyRepository.getCompanyContributions(),
        multiCompanyRepository.getIsolationAuditLogs(),
        multiCompanyRepository.getUserAccessMatrix(),
      ]);
      setAllCompanies(comps);
      setAllSites(sts);
      setConsolidatedKpis(kpis);
      setContributions(contr);
      setAuditLogs(logs);
      setAccessMatrix(acc);
      if (comps.length > 0 && !selectedCompanyForSite) {
        setSelectedCompanyForSite(comps[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyData.displayName || !newCompanyData.code) return;

    await multiCompanyRepository.createCompany(
      {
        ...newCompanyData,
        companyId: "",
        name: newCompanyData.displayName,
        npwpMasked: "01.999.888.7-011.000",
        businessType: `Mining Operation (${newCompanyData.commodity})`,
        operatingSitesCount: 0,
        totalEmployees: 500,
        badgeLabel: `Company • Divisi ${newCompanyData.commodity}`,
        timezone: "Asia/Makassar",
        currency: "IDR",
        language: "id",
        subscriptionPlan: "ENTERPRISE",
        licenseId: `MSAI-NEW-${Date.now().toString().slice(-4)}`,
        licenseKey: `MSAI-ID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        isolationKey: "",
        dataIsolationStatus: "STRICT_ISOLATED",
      },
      currentUser.email
    );

    setIsAddCompanyOpen(false);
    await loadData();
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteData.name || !newSiteData.code || !selectedCompanyForSite) return;

    const parentComp = allCompanies.find((c) => c.id === selectedCompanyForSite);

    await multiCompanyRepository.createSite(
      {
        ...newSiteData,
        siteId: "",
        companyId: selectedCompanyForSite,
        companyName: parentComp?.displayName || "Subsidiary Company",
        commodity: parentComp?.commodity || "COAL",
        dailyProductionTargetMT: Math.round(newSiteData.monthlyCoalMT / 30),
        monthlyRevenueTargetIDR: newSiteData.monthlyCoalMT * 1100000,
        k3SafetyIndex: 99.0,
        isoCertifications: ["ISO 14001:2015", "ISO 45001:2018"],
        timezone: "Asia/Makassar",
        operationalStatus: "ACTIVE",
        activeStatus: true,
        productionTarget: {
          monthlyCoalMT: newSiteData.monthlyCoalMT,
          monthlyOBBCM: newSiteData.monthlyOBBCM,
        },
        targetCoalMonthlyMT: newSiteData.monthlyCoalMT,
        targetOBMonthlyBCM: newSiteData.monthlyOBBCM,
      },
      currentUser.email
    );

    setIsAddSiteOpen(false);
    await loadData();
  };

  const handleRunIsolationTest = async (targetCompId: string) => {
    setIsolationTesting(true);
    setTestResult(null);
    try {
      const res = await multiCompanyRepository.runIsolationVerificationTest(
        currentUser.email,
        currentUser.role,
        targetCompId,
        "Production Dispatch & Reserve Vault"
      );
      setTestResult(res);
      await loadData();
    } finally {
      setIsolationTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Multi-Company Hierarchy Overview */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#071228] to-[#040A18] p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-3 py-1 text-[10px] font-extrabold text-purple-300 border border-purple-500/30 uppercase tracking-widest flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                HOLDING & MULTI-COMPANY ARCHITECTURE
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                DATA TIAP PERUSAHAAN TERISOLASI 100%
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{holding?.displayName || "NUSA MINING GROUP HOLDING"}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {holding?.stockTicker || "NUSA.JK"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Satu platform terintegrasi untuk mengelola seluruh entitas grup pertambangan: dari level Holding Group Konsolidasi, anak perusahaan (Company A, Company B, Company C), hingga operasional site pit tambang (Site 1, Site 2, Site 3) dengan isolasi database dan akses yang ketat.
              </p>
            </div>

            {/* Quick Context Summary */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                Holding: <strong className="text-white">{holding?.legalName}</strong>
              </div>
              <div>•</div>
              <div>
                Active Scope:{" "}
                <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeScope === "HOLDING"
                    ? "🏛️ HOLDING CONSOLIDATED"
                    : `🏭 ${company.displayName} (${activeSite.name})`}
                </span>
              </div>
              <div>•</div>
              <div>
                Total Anak Perusahaan: <strong className="text-emerald-400">{allCompanies.length} Entitas</strong>
              </div>
              <div>•</div>
              <div>
                Total Mining Sites: <strong className="text-teal-400">{allSites.length} Lokasi</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddCompanyOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Anak Perusahaan</span>
            </button>
            <button
              onClick={() => setIsAddSiteOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Tambah Mining Site Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "hierarchy", label: "Hierarki & Topologi (Holding → Company → Site)", icon: Layers },
          { id: "consolidation", label: "Holding Consolidated Dashboard", icon: TrendingUp },
          { id: "companies", label: "Daftar Perusahaan & Site", icon: Building2 },
          { id: "isolation-guard", label: "Data Isolation & Security Guard", icon: ShieldCheck },
          { id: "access-matrix", label: "User Access Control Matrix", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 3-TIER HIERARCHY & TOPOLOGY VISUALIZER */}
      {activeTab === "hierarchy" && (
        <div className="space-y-6">
          {/* Holding Header Level Card */}
          <div className="rounded-3xl border-2 border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-6 shadow-xl relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shrink-0">
                  <Globe2 className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                      TIER 1 • HOLDING LEVEL
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Kode: {holding?.code}</span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">{holding?.legalName}</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Kantor Pusat: {holding?.headquarters} • Komoditas Terpadu: Batubara, Nikel, Emas & Tembaga.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={switchHoldingView}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isHoldingScope
                      ? "bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/30"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>{isHoldingScope ? "Aktif di Mode Holding" : "Pilih Mode Holding Group"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tree Connection Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/90 px-4 py-1 rounded-full border border-slate-800">
              <span>↓ Membawahi 3 Anak Perusahaan (Subsidiaries) ↓</span>
            </div>
          </div>

          {/* Companies (Tier 2) and Sites (Tier 3) Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {allCompanies.map((comp, compIdx) => {
              const compSites = allSites.filter((s) => s.companyId === comp.id);
              const isCompActive = !isHoldingScope && company.id === comp.id;

              return (
                <div
                  key={comp.id}
                  className={`rounded-3xl border transition-all flex flex-col justify-between space-y-5 p-5 ${
                    isCompActive
                      ? "border-emerald-500 bg-slate-900/95 ring-2 ring-emerald-500/30 shadow-2xl shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  {/* Company Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-xs">
                          C{compIdx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            TIER 2 • SUBSIDIARY
                          </span>
                          <h3 className="text-sm font-black text-white">{comp.displayName}</h3>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {comp.commodity}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-300">
                      <p className="text-[11px] text-slate-400 leading-snug">{comp.commodityLabel}</p>
                      <div className="pt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block">IUP / Kontrak</span>
                          <span className="font-mono text-white font-bold">{comp.iupNumber}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block">Luas Konsesi</span>
                          <span className="text-white font-bold">{comp.concessionAreaHa.toLocaleString()} Ha</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-emerald-500/20 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Lock className="h-3 w-3" />
                          <span>Tenant Isolation Token:</span>
                        </span>
                        <span className="text-slate-300">{comp.isolationKey}</span>
                      </div>
                    </div>

                    {/* Switch Company Context Action */}
                    <button
                      onClick={() => switchCompany(comp.id)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        isCompActive
                          ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{isCompActive ? "Perusahaan Aktif (Isolated Scope)" : "Pilih Perusahaan Ini"}</span>
                    </button>
                  </div>

                  {/* Tier 3: Sites under this company */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-teal-400" />
                        <span>TIER 3 • SITES ({compSites.length} Lokasi Tambang)</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {compSites.map((st, siteIdx) => {
                        const isSiteActive = isCompActive && activeSite.id === st.id;
                        return (
                          <div
                            key={st.id}
                            className={`rounded-2xl p-3 border transition-all ${
                              isSiteActive
                                ? "border-teal-500/60 bg-teal-950/30 text-white"
                                : "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-white">
                                    Site {siteIdx + 1}: {st.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {st.location} • {st.miningType}
                                </p>
                              </div>

                              <button
                                onClick={() => switchSite(st.id)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                  isSiteActive
                                    ? "bg-teal-500 text-slate-950 font-black"
                                    : "bg-slate-800 text-teal-300 hover:bg-slate-700"
                                }`}
                              >
                                {isSiteActive ? "Active Site" : "Pilih Site"}
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                              <div>
                                <span className="text-slate-500 block">Fleet Unit</span>
                                <span className="font-bold text-slate-200">{st.fleetCount} Unit</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Target MT/Bln</span>
                                <span className="font-bold text-emerald-400">
                                  {st.productionTarget.monthlyCoalMT.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">K3 Safety</span>
                                <span className="font-bold text-amber-400">{st.k3SafetyIndex}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: HOLDING CONSOLIDATED DASHBOARD */}
      {activeTab === "consolidation" && consolidatedKpis && (
        <div className="space-y-6">
          {/* Executive Consolidated Rollup Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Coins className="h-4 w-4 text-emerald-400" /> Pendapatan Konsolidasi Grup
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  MTD
                </span>
              </div>
              <p className="text-2xl font-black text-white">
                Rp {(consolidatedKpis.totalConsolidatedRevenueIDR / 1000000000000).toFixed(2)} Triliun
              </p>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>EBITDA Margin: <strong className="text-emerald-400">{consolidatedKpis.consolidatedEbitdaMarginPct}%</strong></span>
                <span>Target: Rp 8.45 T</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Flame className="h-4 w-4 text-amber-400" /> Total Output Batubara (MT)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  Company A
                </span>
              </div>
              <p className="text-2xl font-black text-amber-400">
                {consolidatedKpis.totalCoalProductionMT.toLocaleString("id-ID")} MT
              </p>
              <span className="text-[11px] text-slate-400 block">
                3 Sites Aktif (Sangatta, Muara Teweh, Lahat)
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Layers className="h-4 w-4 text-cyan-400" /> Total Output Nikel (WMT)
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                  Company B
                </span>
              </div>
              <p className="text-2xl font-black text-cyan-400">
                {consolidatedKpis.totalNickelOreWMT.toLocaleString("id-ID")} WMT
              </p>
              <span className="text-[11px] text-slate-400 block">
                Pomalaa, Morowali Block, Halmahera
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Award className="h-4 w-4 text-yellow-400" /> Total Output Emas (Oz)
                </span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-bold">
                  Company C
                </span>
              </div>
              <p className="text-2xl font-black text-yellow-400">
                {consolidatedKpis.totalGoldProductionOz.toLocaleString("id-ID")} Oz
              </p>
              <span className="text-[11px] text-slate-400 block">
                Grasberg Sector, Batu Hijau, Tujuh Bukit
              </span>
            </div>
          </div>

          {/* Subsidiary Contribution Breakdown Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Kontribusi & Kinerja Setiap Anak Perusahaan (Company A, B, C)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rekapitulasi keuangan, target produksi, dan ketaatan isolasi data lintas entitas.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Anak Perusahaan</th>
                    <th className="p-3">Komoditas Inti</th>
                    <th className="p-3">Pendapatan (IDR)</th>
                    <th className="p-3">Share Pendapatan</th>
                    <th className="p-3">Produksi Aktual / Target</th>
                    <th className="p-3">Pencapaian</th>
                    <th className="p-3">Fleet / Sites</th>
                    <th className="p-3">Status Isolasi Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {contributions.map((c) => (
                    <tr key={c.companyId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-emerald-400" />
                          <span>{c.companyName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 font-medium">{c.commodityLabel}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        Rp {(c.revenueIDR / 1000000000000).toFixed(2)} Triliun
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${c.revenueSharePct}%` }} />
                          </div>
                          <span className="font-bold text-xs">{c.revenueSharePct}%</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono">
                        {c.productionActualMT.toLocaleString()} / {c.productionTargetMT.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                          {c.achievementPct}% ON TARGET
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-300">
                        {c.fleetCount} unit / {c.sitesCount} sites
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <Lock className="h-3 w-3" />
                          <span>SECURE & ISOLATED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPANIES & SITES DIRECTORY */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {allCompanies.map((comp) => {
              const compSites = allSites.filter((s) => s.companyId === comp.id);
              return (
                <div key={comp.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{comp.legalName}</h3>
                        <p className="text-xs text-slate-400">
                          IUP: <span className="font-mono text-emerald-400 font-bold">{comp.iupNumber}</span> • NPWP: {comp.npwpMasked}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => switchCompany(comp.id)}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 cursor-pointer"
                      >
                        Beralih ke Perusahaan Ini
                      </button>
                    </div>
                  </div>

                  {/* Company Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Komoditas & Mutu</span>
                      <span className="font-bold text-white">{comp.commodityLabel}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Total Karyawan</span>
                      <span className="font-bold text-emerald-400">{comp.totalEmployees.toLocaleString()} Orang</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Target Tahunan</span>
                      <span className="font-bold text-amber-400">{comp.annualProductionTargetMT.toLocaleString()} MT/Thn</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Data Isolation Token</span>
                      <span className="font-mono text-xs text-teal-400">{comp.isolationKey}</span>
                    </div>
                  </div>

                  {/* Mining Sites Subtable */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-400" />
                      <span>Daftar Mining Site di Bawah {comp.shortName}:</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {compSites.map((st) => (
                        <div key={st.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{st.name}</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              {st.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{st.location}</p>
                          <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-900">
                            <div>Kepala Teknik / KTT: <strong className="text-slate-200">{st.managerName}</strong></div>
                            <div>Target MT: <strong className="text-emerald-400">{st.targetCoalMonthlyMT.toLocaleString()} MT/bln</strong></div>
                            <div>Fleet: <strong className="text-amber-400">{st.fleetCount} Unit</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: STRICT DATA ISOLATION & SECURITY GUARD */}
      {activeTab === "isolation-guard" && (
        <div className="space-y-6">
          {/* Isolation Architecture Explanation Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                MULTI-TENANT ISOLATION ARCHITECTURE
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Prinsip Isolasi Data Perusahaan MINE SMART AI
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Setiap entitas anak perusahaan (Company A, Company B, Company C) memiliki <strong>Logical Database Partition</strong> yang terisolasi total. Setiap query transaksi pertambangan (Produksi, Dispatch, Keuangan, Lab Assay, Dokumen IUP, RKAB) dipagari dengan klausa <code className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded">where("companyId", "==", activeCompany.id)</code>. Pengguna Company A tidak dapat melihat atau mengubah data Company B atau C.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 1. Query Scoping Guard
                </span>
                <p className="text-[11px] text-slate-400">
                  Semua Repository mengeksekusi filter partisi tenant di tingkat database layer Firestore & Memory cache.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 2. Row-Level Tokenization
                </span>
                <p className="text-[11px] text-slate-400">
                  Setiap dokumen memiliki <code className="font-mono text-teal-300">isolationKey</code> unik yang diverifikasi sebelum render UI.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 3. Immutable Audit Trail
                </span>
                <p className="text-[11px] text-slate-400">
                  Upaya akses lintas tenant dicatat dalam log audit yang tidak dapat dihapus dengan deteksi anomali.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Isolation Test Simulator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Simulasi Uji Penetrasi & Verifikasi Isolasi Data Antar-Perusahaan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lakukan pengujian langsung untuk memverifikasi proteksi isolasi data terhadap percobaan akses lintas tenant.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {allCompanies.map((c) => (
                <button
                  key={c.id}
                  disabled={isolationTesting}
                  onClick={() => handleRunIsolationTest(c.id)}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:border-emerald-500/50 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Uji Isolasi: {c.shortName}</span>
                </button>
              ))}

              <button
                disabled={isolationTesting}
                onClick={() => handleRunIsolationTest("HOLDING")}
                className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/20 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/30 cursor-pointer disabled:opacity-50"
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span>Uji Akses Holding Rollup</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`rounded-2xl p-4 border space-y-2 text-xs ${
                  testResult.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Hasil Verifikasi: {testResult.resultType}</span>
                  </span>
                  <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                    Token: {testResult.isolationKey}
                  </span>
                </div>
                <p className="text-slate-200">{testResult.message}</p>
                <div className="font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-emerald-400">
                  Filter Diterapkan: {testResult.appliedQueryFilter}
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="h-4 w-4 text-teal-400" />
              <span>Log Audit Isolasi Data & Akses Multi-Tenant</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">User & Peran</th>
                    <th className="p-3">Target Entitas</th>
                    <th className="p-3">Modul Akses</th>
                    <th className="p-3">Query Scoping</th>
                    <th className="p-3">Hasil Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-white block">{log.accessingUserEmail}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{log.userRole}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-200">{log.targetCompanyName}</td>
                      <td className="p-3 text-slate-300">{log.requestedModule}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400 max-w-[200px] truncate">
                        {log.queryFilterApplied}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-extrabold border uppercase ${
                            log.isolationResult === "ISOLATED_PASS"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : log.isolationResult === "HOLDING_ROLLUP_AUTHORIZED"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }`}
                        >
                          {log.isolationResult}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER ACCESS CONTROL MATRIX */}
      {activeTab === "access-matrix" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>Matriks Hak Akses Pengguna Multi-Tenant</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hak otorisasi pengguna terhadap level Holding, Anak Perusahaan (Company), atau Site tertentu.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Peran / Jabatan</th>
                    <th className="p-3">Cakupan Akses</th>
                    <th className="p-3">Akses Holding</th>
                    <th className="p-3">Perusahaan Yang Diizinkan</th>
                    <th className="p-3">Site Yang Diizinkan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {accessMatrix.map((acc) => (
                    <tr key={acc.userId} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block">{acc.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{acc.userEmail}</span>
                      </td>
                      <td className="p-3 font-semibold text-amber-300">{acc.role}</td>
                      <td className="p-3">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-200 border border-slate-700">
                          {acc.accessibleScope} LEVEL
                        </span>
                      </td>
                      <td className="p-3">
                        {acc.holdingAccess ? (
                          <span className="rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold">
                            YA (Holding Wide)
                          </span>
                        ) : (
                          <span className="rounded bg-slate-800 text-slate-400 px-2 py-0.5 text-[10px] font-bold">
                            TIDAK
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {acc.allowedCompanyIds.map((cid) => (
                            <span key={cid} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-slate-800">
                              {cid}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-slate-300">{acc.allowedSiteIds.length} Sites terotorisasi</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Anak Perusahaan Baru */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddCompanyOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Tambah Anak Perusahaan Baru</h3>
                <p className="text-xs text-slate-400">Daftarkan entitas PT baru di bawah Holding Group</p>
              </div>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan (Display)</label>
                  <input
                    type="text"
                    required
                    value={newCompanyData.displayName}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, displayName: e.target.value })}
                    placeholder="Contoh: PT Bauksit Mineral Prima"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Singkat (3-4 Karakter)</label>
                  <input
                    type="text"
                    required
                    value={newCompanyData.code}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, code: e.target.value.toUpperCase() })}
                    placeholder="Contoh: BMP"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono uppercase focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Legal Lengkap</label>
                <input
                  type="text"
                  required
                  value={newCompanyData.legalName}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, legalName: e.target.value })}
                  placeholder="Contoh: PT Bauksit Mineral Prima (Perseroan IUP Bauksit)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Komoditas Tambang</label>
                  <select
                    value={newCompanyData.commodity}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, commodity: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="COAL">Batubara (Coal)</option>
                    <option value="NICKEL">Nikel Laterit (Nickel)</option>
                    <option value="GOLD_COPPER">Emas & Tembaga (Gold/Copper)</option>
                    <option value="BAUXITE">Bauksit (Bauxite)</option>
                    <option value="TIN">Timah (Tin)</option>
                    <option value="IRON_ORE">Bijih Besi (Iron Ore)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor IUP / Kontrak</label>
                  <input
                    type="text"
                    required
                    value={newCompanyData.iupNumber}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, iupNumber: e.target.value })}
                    placeholder="IUP-OP/999/MINERBA/2026"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Luas Konsesi (Hektar)</label>
                  <input
                    type="number"
                    value={newCompanyData.concessionAreaHa}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, concessionAreaHa: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Produksi Tahunan (MT)</label>
                  <input
                    type="number"
                    value={newCompanyData.annualProductionTargetMT}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, annualProductionTargetMT: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Tenant Partition Key otomatis dibuat untuk menjamin isolasi database 100%.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 font-black text-slate-950 hover:bg-emerald-400 cursor-pointer"
                >
                  Buat Anak Perusahaan Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Mining Site Baru */}
      {isAddSiteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddSiteOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Tambah Mining Site Baru</h3>
                <p className="text-xs text-slate-400">Daftarkan lokasi pit / konsesi di bawah anak perusahaan</p>
              </div>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Anak Perusahaan Induk</label>
                <select
                  value={selectedCompanyForSite}
                  onChange={(e) => setSelectedCompanyForSite(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                >
                  {allCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} ({c.code}) - {c.commodity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Site Tambang</label>
                  <input
                    type="text"
                    required
                    value={newSiteData.name}
                    onChange={(e) => setNewSiteData({ ...newSiteData, name: e.target.value })}
                    placeholder="Contoh: Site Berau Pit 03"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Site</label>
                  <input
                    type="text"
                    required
                    value={newSiteData.code}
                    onChange={(e) => setNewSiteData({ ...newSiteData, code: e.target.value.toUpperCase() })}
                    placeholder="BER-03"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono uppercase focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Provinsi & Lokasi</label>
                  <input
                    type="text"
                    required
                    value={newSiteData.location}
                    onChange={(e) => setNewSiteData({ ...newSiteData, location: e.target.value })}
                    placeholder="Berau, Kalimantan Timur"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kepala Teknik Tambang (KTT)</label>
                  <input
                    type="text"
                    required
                    value={newSiteData.managerName}
                    onChange={(e) => setNewSiteData({ ...newSiteData, managerName: e.target.value })}
                    placeholder="Ir. Hendra Gunawan, M.T."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Bulanan (MT)</label>
                  <input
                    type="number"
                    value={newSiteData.monthlyCoalMT}
                    onChange={(e) => setNewSiteData({ ...newSiteData, monthlyCoalMT: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target OB (BCM)</label>
                  <input
                    type="number"
                    value={newSiteData.monthlyOBBCM}
                    onChange={(e) => setNewSiteData({ ...newSiteData, monthlyOBBCM: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alokasi Fleet</label>
                  <input
                    type="number"
                    value={newSiteData.fleetCount}
                    onChange={(e) => setNewSiteData({ ...newSiteData, fleetCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSiteOpen(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-500 px-5 py-2.5 font-black text-slate-950 hover:bg-teal-400 cursor-pointer"
                >
                  Simpan Site Tambang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
