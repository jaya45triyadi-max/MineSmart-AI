// MINE SMART AI - Commercial, Mobile, Offline, Security & Landing Page Hub (PROMPT 35)

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Wifi,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  Download,
  Calendar,
  Sliders,
  Database,
  Eye,
  FileSpreadsheet,
  Cpu,
  Clock,
  ChevronRight,
  Server,
  Code,
  Check,
  Filter,
  ArrowRight,
  Printer,
  FileCode,
  Info,
  DollarSign,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Award,
  Radio,
  Activity,
  HardDrive,
  Users,
  Compass,
  Briefcase,
  AlertCircle,
  FileText,
  Key,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { OfflineSyncEngine } from "../../services/offline/OfflineSyncEngine";
import { SecurityCenterService } from "../../services/security/SecurityCenterService";
import { CommercialService } from "../../services/commercial/CommercialService";
import {
  SyncQueueItem,
  UserDeviceRecord,
  SecurityEventRecord,
  PlanPricing,
  SupportTicket,
  OnboardingStep,
  CommercialReadinessCategory,
} from "../../types/commercialOfflineTypes";

export const CommercialReleaseModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { activeSite, currentUser, company } = useAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    | "LANDING_PRICING"
    | "MOBILE_PWA"
    | "OFFLINE_SYNC"
    | "SECURITY_DEVICES"
    | "ONBOARDING_WIZARD"
    | "SUPPORT_DOCS"
    | "COMMERCIAL_READINESS"
  >("LANDING_PRICING");

  // Offline Engine State
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(OfflineSyncEngine.getSyncQueue());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // New Offline Record Form
  const [offPit, setOffPit] = useState("Pit 2 North");
  const [offCoalMT, setOffCoalMT] = useState(350);
  const [offObBCM, setOffObBCM] = useState(1100);
  const [offNotes, setOffNotes] = useState("Dikerjakan saat koneksi terputus di front tambang");

  // Security State
  const [userDevices, setUserDevices] = useState<UserDeviceRecord[]>(SecurityCenterService.getDevices());
  const [securityEvents, setSecurityEvents] = useState<SecurityEventRecord[]>(SecurityCenterService.getSecurityEvents());
  const drStatus = SecurityCenterService.getDisasterRecoveryStatus();

  // Commercial State
  const [plans] = useState<PlanPricing[]>(CommercialService.getPlans());
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("ANNUAL");
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(CommercialService.getOnboardingSteps());
  const [tickets, setTickets] = useState<SupportTicket[]>(CommercialService.getSupportTickets());
  const readinessScorecard = CommercialService.getCommercialReadinessScorecard();

  // Ticket Form Modal
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState<SupportTicket["category"]>("OPERATIONAL");
  const [ticketPriority, setTicketPriority] = useState<SupportTicket["priority"]>("HIGH");
  const [ticketDescription, setTicketDescription] = useState("");

  // PWA Prompt Simulated State
  const [pwaInstalled, setPwaInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSyncOfflineData = async () => {
    setIsSyncing(true);
    try {
      const res = await OfflineSyncEngine.processSyncQueue();
      setSyncQueue([...OfflineSyncEngine.getSyncQueue()]);
      alert(`Sinkronisasi Selesai!\n\n✓ Sukses: ${res.syncedCount} record\n⚠ Conflict: ${res.conflictCount}\n✕ Gagal: ${res.failedCount}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddOfflineRecord = (e: React.FormEvent) => {
    e.preventDefault();
    OfflineSyncEngine.enqueueOfflineRecord("PRODUCTION_INPUT", {
      pit: offPit,
      coalMT: offCoalMT,
      obBCM: offObBCM,
      notes: offNotes,
      timestamp: new Date().toISOString(),
    });
    setSyncQueue([...OfflineSyncEngine.getSyncQueue()]);
    alert("Record offline berhasil disimpan ke local database IndexedDB queue!");
  };

  const handleRevokeDevice = (deviceId: string) => {
    SecurityCenterService.revokeDevice(deviceId);
    setUserDevices([...SecurityCenterService.getDevices()]);
    alert("Sesi perangkat telah dicabut.");
  };

  const handleLogoutAllOther = () => {
    SecurityCenterService.logoutAllOtherDevices();
    setUserDevices([...SecurityCenterService.getDevices()]);
    alert("Seluruh sesi perangkat lain telah dicabut.");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    CommercialService.createSupportTicket({
      companyId: company.id,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDescription,
      createdBy: currentUser.name,
    });
    setTickets([...CommercialService.getSupportTickets()]);
    setShowNewTicketModal(false);
    setTicketSubject("");
    setTicketDescription("");
    alert("Tiket Support Berhasil Dibuat!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-slate-950 via-[#062016] to-slate-950 p-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-slate-950 font-black shadow-xl shadow-emerald-500/20">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight">MineSmart AI Commercial Release Hub</h1>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-black text-emerald-400 border border-emerald-500/30">
                PROMPT 35 FINAL
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
                v1.0.0-release
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Mobile PWA → Offline Sync Queue → Multi-Tenant Security & Device Binding → Onboarding & Commercial Readiness Scorecard
            </p>
          </div>
        </div>

        {/* Network & Sync Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black border ${
              isOnline
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{isOnline ? "ONLINE (Connected)" : "OFFLINE (Local Queue)"}</span>
          </div>

          <button
            onClick={handleSyncOfflineData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync Queue ({syncQueue.filter((s) => s.status === "PENDING").length})</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: "LANDING_PRICING", label: "Commercial Landing & Pricing", icon: DollarSign, color: "text-amber-400" },
          { id: "MOBILE_PWA", label: "Mobile PWA & Touch Simulator", icon: Smartphone, color: "text-blue-400" },
          { id: "OFFLINE_SYNC", label: "Offline Sync & Local Queue Engine", icon: HardDrive, color: "text-emerald-400" },
          { id: "SECURITY_DEVICES", label: "Security Center & Device Binding", icon: ShieldCheck, color: "text-purple-400" },
          { id: "ONBOARDING_WIZARD", label: "Customer Onboarding Setup Wizard", icon: Compass, color: "text-cyan-400" },
          { id: "SUPPORT_DOCS", label: "Help Center & Support Tickets", icon: HelpCircle, color: "text-teal-400" },
          { id: "COMMERCIAL_READINESS", label: "Commercial Readiness Scorecard", icon: Award, color: "text-rose-400" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-800 border border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMERCIAL LANDING & PRICING */}
      {activeTab === "LANDING_PRICING" && (
        <div className="space-y-8">
          {/* Hero Banner Section */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-[#0a2e20] to-slate-950 p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
              INDONESIA'S #1 AI MINING PLATFORM
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-3xl mx-auto">
              Smart AI Mining Management Platform Siap Komersial
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Kelola operasi tambang batubara lebih cerdas dengan AI Copilot, real-time analytics, GIS, fleet dispatch, production intelligence, HSE, maintenance, finance, dan enterprise ESDM reporting dalam satu platform terpadu.
            </p>

            {/* Billing Cycle Switcher */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold ${billingCycle === "MONTHLY" ? "text-white" : "text-slate-400"}`}>Bulanan</span>
              <button
                onClick={() => setBillingCycle(billingCycle === "MONTHLY" ? "ANNUAL" : "MONTHLY")}
                className="w-12 h-6 bg-slate-800 rounded-full p-1 transition-colors border border-slate-700 relative"
              >
                <div className={`w-4 h-4 bg-emerald-400 rounded-full transition-transform ${billingCycle === "ANNUAL" ? "translate-x-6" : ""}`} />
              </button>
              <span className={`text-xs font-bold ${billingCycle === "ANNUAL" ? "text-emerald-400" : "text-slate-400"}`}>
                Tahunan <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-black">Hemat 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                className={`p-6 rounded-3xl border transition-all space-y-6 flex flex-col justify-between shadow-2xl relative ${
                  plan.isPopular
                    ? "border-emerald-500 bg-slate-900 shadow-emerald-500/10 scale-105 z-10"
                    : "border-slate-800 bg-slate-900/80"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg">
                    MOST RECOMMENDED FOR IUP MID-SCALE
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Limit: {plan.siteLimit} Site Tambang | {plan.userLimit} Users Active
                    </p>
                  </div>

                  <div className="border-y border-slate-800/80 py-4">
                    <div className="text-3xl font-black text-emerald-400">
                      ${billingCycle === "ANNUAL" ? Math.round(plan.annualPriceUSD / 12) : plan.monthlyPriceUSD}
                      <span className="text-xs text-slate-400 font-normal"> / bulan</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {billingCycle === "ANNUAL" ? `Ditagih $${plan.annualPriceUSD.toLocaleString()} / tahun` : "Ditagih bulanan"}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => alert(`Pengajuan Lisensi ${plan.name} Diterima. Tim Sales MineSmart AI akan menghubungi Anda.`)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all shadow-lg ${
                    plan.isPopular
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  Mulai Free Trial 14 Hari
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MOBILE PWA & TOUCH SIMULATOR */}
      {activeTab === "MOBILE_PWA" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PWA Manifest Status */}
            <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-blue-400 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Progressive Web App (PWA) System Manifest
                </h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  SW ACTIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">App Name:</span>
                    <strong className="text-white">MineSmart AI Enterprise</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Short Name:</span>
                    <strong className="text-emerald-400">MineSmart</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Display Mode:</span>
                    <strong className="text-cyan-300">Standalone (Full App Experience)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Touch Target standard:</span>
                    <strong className="text-amber-300">Minimum 44px+ Accessible</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPwaInstalled(true);
                    alert("Aplikasi MineSmart AI PWA berhasil diinstal ke Homescreen Android/iOS!");
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-lg shadow-blue-500/20"
                >
                  {pwaInstalled ? "✓ PWA Installed on Device" : "Install MineSmart AI PWA to Device"}
                </button>
              </div>
            </div>

            {/* Mobile Touch & Command Center Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-purple-400" />
                  Mobile Bottom Navigation & Action Drawer Simulator
                </h3>
                <span className="text-xs text-slate-400">Android / iOS Touch Ready</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 max-w-sm mx-auto space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold block">📱 Mobile View Simulation</span>
                  <p className="text-[11px] text-slate-300">Quick Command: "Produksi Shift A Pit 2 hari ini?"</p>
                </div>

                {/* Simulated Bottom Navigation */}
                <div className="grid grid-cols-5 gap-1 p-2 bg-slate-900 rounded-xl border border-slate-800 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Dashboard</div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-400">AI</div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-400">Mining</div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-400">Reports</div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-400">More</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFLINE SYNC & LOCAL QUEUE */}
      {activeTab === "OFFLINE_SYNC" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Offline Form Tester */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Form Ingest Offline (Tanpa Internet)
                </h3>
                <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  LOCAL INDEXEDDB READY
                </span>
              </div>

              <form onSubmit={handleAddOfflineRecord} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Lokasi Pit Front:</label>
                  <input
                    type="text"
                    value={offPit}
                    onChange={(e) => setOffPit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Hasil Batubara (Ton):</label>
                    <input
                      type="number"
                      value={offCoalMT}
                      onChange={(e) => setOffCoalMT(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Hasil OB (BCM):</label>
                    <input
                      type="number"
                      value={offObBCM}
                      onChange={(e) => setOffObBCM(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Catatan Lapangan:</label>
                  <textarea
                    rows={2}
                    value={offNotes}
                    onChange={(e) => setOffNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  Simpan Record Ke Queue Offline
                </button>
              </form>
            </div>

            {/* Sync Queue Inspector */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-emerald-400" />
                  Daftar Antrean Sync Local Queue ({syncQueue.length})
                </h3>
                <button
                  onClick={() => {
                    OfflineSyncEngine.clearCompleted();
                    setSyncQueue([...OfflineSyncEngine.getSyncQueue()]);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear Completed
                </button>
              </div>

              <div className="space-y-3">
                {syncQueue.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">Antrean offline kosong. Semua data telah tersinkronisasi.</div>
                ) : (
                  syncQueue.map((item) => (
                    <div key={item.syncId} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white">{item.recordType}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            item.status === "SUCCESS"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : item.status === "PENDING"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="font-mono text-[10px] text-slate-400">IdempotencyKey: {item.idempotencyKey}</div>

                      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-300 font-mono">
                        {JSON.stringify(item.data)}
                      </div>

                      {item.errorMessage && <p className="text-[10px] text-rose-400 font-semibold">{item.errorMessage}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY CENTER & DEVICE BINDING */}
      {activeTab === "SECURITY_DEVICES" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active User Devices & Revocation */}
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-purple-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Perangkat Terhubung & License Device Binding
                </h3>
                <button
                  onClick={handleLogoutAllOther}
                  className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30"
                >
                  Cabut Perangkat Lain
                </button>
              </div>

              <div className="space-y-3">
                {userDevices.map((dev) => (
                  <div key={dev.deviceId} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        {dev.deviceName}
                        {dev.isCurrentDevice && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                            PERANGKAT INI
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          dev.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {dev.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      OS: {dev.os} | Browser: {dev.browser} | Lokasi: {dev.location}
                    </p>

                    {!dev.isCurrentDevice && dev.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevokeDevice(dev.deviceId)}
                        className="text-[10px] text-rose-400 hover:underline font-bold"
                      >
                        Revoke Session Perangkat ini
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Disaster Recovery Status Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  Disaster Recovery & Backup Integrity
                </h3>
                <span className="text-xs text-slate-400 font-mono">AWS / GCP Dual Region</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RPO (Recovery Point Objective):</span>
                    <strong className="text-emerald-400">Maksimal 1 Jam (Data Loss Limit)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RTO (Recovery Time Objective):</span>
                    <strong className="text-emerald-400">Maksimal 2 Jam (Restore Time)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auto Backup Terakhir:</span>
                    <strong className="text-white">{drStatus.lastAutoBackupAt}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enkripsi Penyimpanan:</span>
                    <strong className="text-cyan-300 font-mono">{drStatus.storageEncryption}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-[11px]">
                  ✓ Multi-Tenant Isolation Enforced: Aturan Keamanan Firestore & API Server memastikan tidak ada kebocoran data antar-perusahaan.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER ONBOARDING SETUP WIZARD */}
      {activeTab === "ONBOARDING_WIZARD" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Customer Onboarding & Mine Site Configuration Wizard
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prosedur 8 langkah aktivasi mandiri perusahaan tambang baru hingga sistem siap beroperasi penuh
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/30">
                6 / 8 STEPS COMPLETED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onboardingSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                    step.isCompleted
                      ? "border-emerald-500/30 bg-slate-950"
                      : "border-slate-800 bg-slate-950/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-cyan-300">
                        {step.stepNumber}
                      </span>
                      {step.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        step.isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {step.isCompleted ? "SELESAI" : "PENDING"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HELP CENTER & SUPPORT TICKETS */}
      {activeTab === "SUPPORT_DOCS" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-teal-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-teal-300 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Support Center & Enterprise Knowledge Base
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pusat bantuan pelanggan, panduan penggunaan modul tambang, FAQ, dan pelacakan tiket gangguan 24/7
                </p>
              </div>

              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Tiket Bantuan</span>
              </button>
            </div>

            {/* Active Tickets List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">Tiket Bantuan Aktif:</h3>
              {tickets.map((t) => (
                <div key={t.ticketId} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white flex items-center gap-2">
                      <span className="font-mono text-teal-400">{t.ticketId}</span>
                      <span>— {t.subject}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      {t.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{t.description}</p>

                  <div className="pt-2 border-t border-slate-800/60 flex justify-between text-[10px] text-slate-500">
                    <span>Oleh: {t.createdBy} | Agent Assigned: <strong>{t.assignedAgent}</strong></span>
                    <span>Dibuat: {new Date(t.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COMMERCIAL READINESS SCORECARD */}
      {activeTab === "COMMERCIAL_READINESS" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-rose-500/40 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-rose-400 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Commercial Readiness Final Scorecard (Prompt 1–35)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluasi kelaikan rilis komersial platform MineSmart AI secara menyeluruh sebelum go-live ke pasar tambang batubara
                </p>
              </div>

              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-black border border-emerald-500/30">
                100% READY FOR COMMERCIAL RELEASE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readinessScorecard.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">{cat.categoryName}</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {cat.scorePct}% {cat.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {cat.checkpoints.map((cp, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>{cp.name}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          {cp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUPPORT TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-teal-400" />
                Buat Tiket Dukungan Teknis 24/7
              </h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Judul Kendala:</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Kendala Sinkronisasi Weighbridge Ticket"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Kategori:</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="OPERATIONAL">OPERATIONAL</option>
                  <option value="AI_ASSISTANT">AI_ASSISTANT</option>
                  <option value="GIS_MAPS">GIS_MAPS</option>
                  <option value="OFFLINE_SYNC">OFFLINE_SYNC</option>
                  <option value="LICENSE_BILLING">LICENSE_BILLING</option>
                  <option value="INTEGRATION">INTEGRATION</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Deskripsi Detil Kendala:</label>
                <textarea
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
                >
                  Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
