// MINE SMART AI - Comprehensive Multi-Channel Notification Center & Smart Alert Engine
// Channels: 🔔 In-App | 📲 Push Notification | 📧 Email | 💬 WhatsApp | ✈️ Telegram
// Featured: 🚨 Critical Alert — Produksi Pit 02 diprediksi gagal mencapai target bulanan.

import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Sliders,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  Plus,
  ArrowUpRight,
  Clock,
  MapPin,
  Tag,
  Download,
  Share2,
  ShieldAlert,
  Fuel,
  Wrench,
  Pickaxe,
  Boxes,
  Activity,
  Check,
  ChevronRight,
  Eye,
  Trash2,
  Zap,
  Smartphone,
  Mail,
  MessageSquare,
  Send,
  Radio,
  ExternalLink,
  Layers,
  Users,
  Settings2,
  CheckCheck,
  FileSpreadsheet,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  SmartAlertItem,
  SmartAlertSeverity,
  SmartAlertCategory,
  SmartAlertRule,
  SmartAlertSummary,
  NotificationChannel,
  NotificationGatewayConfig,
  ChannelDeliveryStatus,
} from "../../types/smartAlertTypes";
import { SmartAlertEngineService } from "../../services/ai/alerts/SmartAlertEngineService";

export const SmartAlertCenterModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { currentUser } = useAuth();

  // State
  const [alerts, setAlerts] = useState<SmartAlertItem[]>([]);
  const [rules, setRules] = useState<SmartAlertRule[]>([]);
  const [gatewayConfig, setGatewayConfig] = useState<NotificationGatewayConfig>(
    SmartAlertEngineService.getGatewayConfig()
  );
  const [summary, setSummary] = useState<SmartAlertSummary>({
    totalActive: 0,
    criticalCount: 0,
    warningCount: 0,
    attentionCount: 0,
    normalCount: 0,
    acknowledgedCount: 0,
    resolvedTodayCount: 0,
    mttrMinutes: 32.4,
    channelDeliveryTotals: { IN_APP: 0, PUSH: 0, EMAIL: 0, WHATSAPP: 0, TELEGRAM: 0 },
  });

  const [activeTab, setActiveTab] = useState<
    "FEED" | "CHANNELS_PREVIEW" | "GATEWAYS" | "AUDIT_LOGS" | "RULES"
  >("FEED");

  const [selectedSeverity, setSelectedSeverity] = useState<"ALL" | SmartAlertSeverity>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<"ALL" | NotificationChannel>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Alert for Modals & Previews
  const [selectedAlertForAI, setSelectedAlertForAI] = useState<SmartAlertItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [selectedAlertForDeliveries, setSelectedAlertForDeliveries] = useState<SmartAlertItem | null>(null);
  const [isDeliveriesModalOpen, setIsDeliveriesModalOpen] = useState<boolean>(false);

  // Channel Preview Tab Selected Subchannel
  const [previewChannel, setPreviewChannel] = useState<NotificationChannel>("IN_APP");

  // Notification Toast / Quick Banner Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const loadedAlerts = SmartAlertEngineService.getAlerts();
    const loadedRules = SmartAlertEngineService.getRules();
    const loadedConfig = SmartAlertEngineService.getGatewayConfig();
    setAlerts(loadedAlerts);
    setRules(loadedRules);
    setGatewayConfig(loadedConfig);
    setSummary(SmartAlertEngineService.getSummary(loadedAlerts));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Acknowledge
  const handleAcknowledge = (alertId: string) => {
    const updated = SmartAlertEngineService.acknowledgeAlert(
      alertId,
      currentUser?.displayName || "Dispatch Supervisor"
    );
    setAlerts(updated);
    setSummary(SmartAlertEngineService.getSummary(updated));
    showToast("✅ Notifikasi telah dikonfirmasi (Acknowledged)");
  };

  // Handle Resolve
  const handleResolve = (alertId: string) => {
    const updated = SmartAlertEngineService.resolveAlert(alertId);
    setAlerts(updated);
    setSummary(SmartAlertEngineService.getSummary(updated));
    showToast("🟢 Status Alert berhasil diubah menjadi RESOLVED");
  };

  // Trigger Featured Example Alert (Pit 02 Shortfall)
  const handleTriggerPit02Example = () => {
    const newAlert = SmartAlertEngineService.triggerPit02ShortfallAlert();
    loadData();
    showToast("🚨 Broadcast 5 Channel Terkirim: Produksi Pit 02 diprediksi gagal mencapai target bulanan.");
  };

  // Trigger Test Alert on Specific Channel
  const handleTestSingleChannel = (channel: NotificationChannel) => {
    const newAlert = SmartAlertEngineService.dispatchMultiChannelAlert({
      title: `🚨 Test Alert via ${channel}`,
      message: `Produksi Pit 02 diprediksi gagal mencapai target bulanan (Defisit -10%).`,
      severity: "CRITICAL",
      category: "PRODUCTION_TARGET",
      entityId: "PIT-02",
      entityType: "PIT",
      currentValue: "432,000 MT",
      baselineValue: "480,000 MT",
      variancePct: -10.0,
      location: "Pit 02 South Seam A & B",
      suggestedAction: "Rebalance 4 DT ke Pit 01, percepat perbaikan EX-03 & scraping lumpur KM 4.2.",
      channels: [channel],
    });
    loadData();
    showToast(`✅ Notifikasi berhasil dikirim melalui channel: ${channel}`);
  };

  // Browser Web Push Permission Request
  const handleRequestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        const updatedConfig = {
          ...gatewayConfig,
          push: {
            ...gatewayConfig.push,
            browserPermission: perm as any,
          },
        };
        SmartAlertEngineService.saveGatewayConfig(updatedConfig);
        setGatewayConfig(updatedConfig);
        if (perm === "granted") {
          new Notification("MINE SMART AI - Push Notification Active", {
            body: "🚨 Browser Push Notification berhasil diaktifkan untuk alert darurat tambang.",
            icon: "/favicon.ico",
          });
          showToast("📲 Izin Web Push Notification berhasil diberikan!");
        } else {
          showToast("⚠️ Izin Web Push ditolak oleh browser.");
        }
      } catch (e) {
        showToast("⚠️ Browser tidak mendukung Push API di iframe.");
      }
    }
  };

  // Filter Alerts
  const filteredAlerts = alerts.filter((item) => {
    if (selectedSeverity !== "ALL" && item.severity !== selectedSeverity) return false;
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (selectedChannelFilter !== "ALL" && !item.channels.includes(selectedChannelFilter)) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchEntity = item.entityId.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchEntity && !matchLoc) return false;
    }
    return true;
  });

  // Featured Alert (Top #1 or default Pit 02)
  const pit02FeaturedAlert =
    alerts.find((a) => a.entityId === "PIT-02") ||
    alerts.find((a) => a.severity === "CRITICAL") ||
    alerts[0];

  const getSeverityBadge = (sev: SmartAlertSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return {
          icon: AlertOctagon,
          label: "🔴 Critical",
          class: "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-950/40",
          cardBorder: "border-l-4 border-l-rose-500 bg-rose-950/10",
        };
      case "WARNING":
        return {
          icon: AlertTriangle,
          label: "🟠 Warning",
          class: "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/40",
          cardBorder: "border-l-4 border-l-amber-500 bg-amber-950/10",
        };
      case "ATTENTION":
        return {
          icon: Info,
          label: "🟡 Attention",
          class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
          cardBorder: "border-l-4 border-l-yellow-400 bg-yellow-950/10",
        };
      case "NORMAL":
      default:
        return {
          icon: CheckCircle2,
          label: "🟢 Normal",
          class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
          cardBorder: "border-l-4 border-l-emerald-500 bg-emerald-950/10",
        };
    }
  };

  const getChannelIcon = (ch: NotificationChannel) => {
    switch (ch) {
      case "IN_APP":
        return <Bell className="h-3.5 w-3.5 text-purple-400" />;
      case "PUSH":
        return <Smartphone className="h-3.5 w-3.5 text-blue-400" />;
      case "EMAIL":
        return <Mail className="h-3.5 w-3.5 text-amber-400" />;
      case "WHATSAPP":
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />;
      case "TELEGRAM":
        return <Send className="h-3.5 w-3.5 text-cyan-400" />;
    }
  };

  const getChannelBadge = (ch: NotificationChannel) => {
    switch (ch) {
      case "IN_APP":
        return "bg-purple-950/40 text-purple-300 border-purple-500/30";
      case "PUSH":
        return "bg-blue-950/40 text-blue-300 border-blue-500/30";
      case "EMAIL":
        return "bg-amber-950/40 text-amber-300 border-amber-500/30";
      case "WHATSAPP":
        return "bg-emerald-950/40 text-emerald-300 border-emerald-500/30";
      case "TELEGRAM":
        return "bg-cyan-950/40 text-cyan-300 border-cyan-500/30";
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-bold flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 shadow-lg shadow-rose-950/50">
              <Bell className="h-6 w-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  NOTIFICATION CENTER & ALERT DISPATCH HUB
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  5 CHANNELS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat Distribusi Notifikasi Otomatis Terintegrasi: In-App, Push Notification, Email, WhatsApp & Telegram.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-purple-950/40 border-purple-500/40 text-purple-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle Audio Alert Chime"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-purple-400" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>

          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Refresh</span>
          </button>

          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-950/50 transition cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              <span>AI Copilot Smart Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* 🚨 FEATURED CRITICAL ALERT BANNER (DIRECT USER SPECIFICATION) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/50 border-2 border-rose-500/60 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white font-black animate-pulse shrink-0 shadow-lg shadow-rose-900/60">
              <AlertOctagon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-slate-950">
                  🚨 CRITICAL ALERT
                </span>
                <span className="text-xs text-rose-400 font-bold">Pit 02 Production Deficit</span>
                <span className="text-[11px] text-slate-400">• Real-Time Broadcast Active</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Produksi Pit 02 diprediksi gagal mencapai target bulanan.
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                <strong>Proyeksi Akhir Bulan:</strong> 432,000 MT vs <strong>Target RKAB:</strong> 480,000 MT (Shortfall -10% / -48,000 MT). 
                Bottleneck utama terjadi akibat breakdown hidrolik EX-03 dan jalan hauling licin KM 4.2.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleTriggerPit02Example}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-110 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-rose-950/60 cursor-pointer transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>Broadcast 5 Channel Sekarang</span>
            </button>
          </div>
        </div>

        {/* 5 Delivery Channels Status Grid for Pit 02 Alert */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. In-App */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-black text-purple-300">In-App</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              Pop-up banner, Audio siren, Header bell badge, dan Dispatch terminal.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Status: Terkirim</span>
              <button
                onClick={() => handleTestSingleChannel("IN_APP")}
                className="text-purple-400 hover:underline font-bold"
              >
                Test In-App
              </button>
            </div>
          </div>

          {/* 2. Push Notification */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-black text-blue-300">Push Notification</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SENT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              Web Push API & Mobile Lockscreen notification (GM, Mine Head, Owner).
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Status: Delivered</span>
              <button
                onClick={() => handleTestSingleChannel("PUSH")}
                className="text-blue-400 hover:underline font-bold"
              >
                Test Push
              </button>
            </div>
          </div>

          {/* 3. Email */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-black text-amber-300">Email</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DELIVERED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              Corporate HTML alert to management@nusamining.com & GM Site.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Status: Sent</span>
              <button
                onClick={() => handleTestSingleChannel("EMAIL")}
                className="text-amber-400 hover:underline font-bold"
              >
                Test Email
              </button>
            </div>
          </div>

          {/* 4. WhatsApp */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-300">WhatsApp</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                READ (✓✓)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              WhatsApp Business API to +62 812-9876-5432 & Pit Emergency Group.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Status: Read</span>
              <button
                onClick={() => handleTestSingleChannel("WHATSAPP")}
                className="text-emerald-400 hover:underline font-bold"
              >
                Test WA
              </button>
            </div>
          </div>

          {/* 5. Telegram */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-1.5 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Send className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-black text-cyan-300">Telegram</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POSTED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              Bot Broadcast to @MineSmart_MiningAlert_Bot & Ops Room Channel.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Status: Delivered</span>
              <button
                onClick={() => handleTestSingleChannel("TELEGRAM")}
                className="text-cyan-400 hover:underline font-bold"
              >
                Test Telegram
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Active Alerts</span>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.totalActive}</div>
          <div className="text-[10px] text-slate-500">Real-time monitoring</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-1">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span>🔴 Critical Alerts</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{summary.criticalCount}</div>
          <div className="text-[10px] text-rose-400/80">Immediate action needed</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>🟠 Warning Alerts</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{summary.warningCount}</div>
          <div className="text-[10px] text-amber-400/80">Requires mitigation</div>
        </div>

        <div className="p-4 rounded-2xl bg-yellow-950/20 border border-yellow-500/40 space-y-1">
          <div className="flex items-center justify-between text-yellow-300 text-xs">
            <span>🟡 Attention Alerts</span>
            <Info className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-400">{summary.attentionCount}</div>
          <div className="text-[10px] text-yellow-400/80">Monitoring thresholds</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>🟢 Normal / Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{summary.resolvedTodayCount + summary.normalCount}</div>
          <div className="text-[10px] text-emerald-400/80">Optimal operations</div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-1">
          <div className="flex items-center justify-between text-purple-300 text-xs">
            <span>⚡ MTTR Response</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{summary.mttrMinutes} m</div>
          <div className="text-[10px] text-purple-400/80">Mean Time to Resolve</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "FEED", label: "🔔 Live Notification Feed", count: filteredAlerts.length },
          { id: "CHANNELS_PREVIEW", label: "📡 Multi-Channel Interactive Simulator (5 Channels)" },
          { id: "GATEWAYS", label: "⚙️ Gateway & Recipient Configuration" },
          { id: "AUDIT_LOGS", label: "📜 Delivery Logs & Audit Trail" },
          { id: "RULES", label: "📋 Alert Rules & Auto-Escalation Engine", count: rules.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/50 text-slate-200">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE NOTIFICATION FEED */}
      {/* ========================================================================= */}
      {activeTab === "FEED" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Severity Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL", label: "Semua Severity" },
                { id: "CRITICAL", label: "🔴 Critical" },
                { id: "WARNING", label: "🟠 Warning" },
                { id: "ATTENTION", label: "🟡 Attention" },
                { id: "NORMAL", label: "🟢 Normal" },
              ].map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => setSelectedSeverity(sev.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedSeverity === sev.id
                      ? "bg-slate-200 text-slate-950 shadow-sm"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>

            {/* Channel Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Channel:</span>
              {[
                { id: "ALL", label: "Semua" },
                { id: "IN_APP", label: "🔔 In-App" },
                { id: "PUSH", label: "📲 Push" },
                { id: "EMAIL", label: "📧 Email" },
                { id: "WHATSAPP", label: "💬 WhatsApp" },
                { id: "TELEGRAM", label: "✈️ Telegram" },
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelFilter(ch.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    selectedChannelFilter === ch.id
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800/60 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari alert / unit / pit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Alert Cards Feed */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Tidak ada alert aktif pada filter ini</h3>
                <p className="text-xs text-slate-400">Semua sistem telemetri beroperasi dalam parameter toleransi normal.</p>
              </div>
            ) : (
              filteredAlerts.map((item) => {
                const sevBadge = getSeverityBadge(item.severity);
                const SevIcon = sevBadge.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg ${sevBadge.cardBorder}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      {/* Left: Icon & Alert Info */}
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${sevBadge.class}`}>
                          <SevIcon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${sevBadge.class}`}>
                              {sevBadge.label}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {item.category}
                            </span>
                            <span className="text-xs font-black text-white">{item.entityId}</span>
                            {item.location && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-500" />
                                {item.location}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-600" />
                              {item.timestamp}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.message}</p>

                          {/* Multi-Channel Delivery Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                            <span className="text-[10px] font-bold text-slate-500">Channels Dispatched:</span>
                            {item.channels.map((ch) => (
                              <span
                                key={ch}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getChannelBadge(
                                  ch
                                )}`}
                              >
                                {getChannelIcon(ch)}
                                <span>
                                  {ch === "IN_APP"
                                    ? "In-App"
                                    : ch === "PUSH"
                                    ? "Push"
                                    : ch === "EMAIL"
                                    ? "Email"
                                    : ch === "WHATSAPP"
                                    ? "WhatsApp"
                                    : "Telegram"}
                                </span>
                              </span>
                            ))}

                            {item.channelDeliveries && (
                              <button
                                onClick={() => {
                                  setSelectedAlertForDeliveries(item);
                                  setIsDeliveriesModalOpen(true);
                                }}
                                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline"
                              >
                                Detail Status ({item.channelDeliveries.length})
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        {item.status === "ACTIVE" ? (
                          <>
                            <button
                              onClick={() => handleAcknowledge(item.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                            >
                              <Check className="h-3.5 w-3.5 text-amber-400" />
                              <span>Acknowledge</span>
                            </button>

                            <button
                              onClick={() => handleResolve(item.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40 transition"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Resolve</span>
                            </button>
                          </>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1">
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{item.status}</span>
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setSelectedAlertForAI(item);
                            setIsAiModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-500/40 transition"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                          <span>AI RCA & Action</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-CHANNEL INTERACTIVE SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === "CHANNELS_PREVIEW" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                MULTI-CHANNEL SIMULATOR ENGINE
              </span>
              <h3 className="text-base font-black text-white">
                Pratinjau Live Notifikasi: &ldquo;Produksi Pit 02 diprediksi gagal mencapai target bulanan&rdquo;
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulasi rendering format pesan di 5 platform komunikasi eksekutif & operasional tambang.
              </p>
            </div>

            <button
              onClick={handleTriggerPit02Example}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-950/50 self-start md:self-auto"
            >
              <Zap className="h-4 w-4" />
              <span>Broadcast Semua Channel</span>
            </button>
          </div>

          {/* Subchannel Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: "IN_APP", label: "🔔 In-App Terminal", desc: "Industrial Pop-Up / Web Toast", icon: Bell, border: "hover:border-purple-500" },
              { id: "PUSH", label: "📲 Push Notification", desc: "Smartphone Lockscreen Banner", icon: Smartphone, border: "hover:border-blue-500" },
              { id: "EMAIL", label: "📧 Corporate Email", desc: "HTML Rich Executive Digest", icon: Mail, border: "hover:border-amber-500" },
              { id: "WHATSAPP", label: "💬 WhatsApp Business", desc: "Verified Dark Mode Chat Bubble", icon: MessageSquare, border: "hover:border-emerald-500" },
              { id: "TELEGRAM", label: "✈️ Telegram Bot", desc: "Mining Ops Channel Post", icon: Send, border: "hover:border-cyan-500" },
            ].map((chan) => {
              const Icon = chan.icon;
              const isSel = previewChannel === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setPreviewChannel(chan.id as any)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSel
                      ? "bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500"
                      : "bg-slate-900/80 border-slate-800 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${isSel ? "text-purple-400" : "text-slate-400"}`} />
                    <span className="text-xs font-black text-white">{chan.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{chan.desc}</p>
                </button>
              );
            })}
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* 1. IN-APP SIMULATION */}
            {previewChannel === "IN_APP" && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider">
                    IN-APP NOTIFICATION OVERLAY
                  </span>
                  <h4 className="text-sm font-bold text-white">Tampilan Banner Real-Time di Web / Dispatch Console</h4>
                </div>

                <div className="p-5 rounded-2xl bg-[#091122] border-2 border-rose-500/70 shadow-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                      <AlertOctagon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500 text-slate-950">
                          🚨 CRITICAL OPERATIONAL ALERT
                        </span>
                        <span className="text-[11px] text-slate-400">Baru saja</span>
                      </div>
                      <h4 className="text-sm font-black text-white">
                        Produksi Pit 02 diprediksi gagal mencapai target bulanan.
                      </h4>
                      <p className="text-xs text-slate-300">
                        Proyeksi: <strong>432,000 MT</strong> vs Target RKAB: <strong>480,000 MT</strong> (-10% Defisit). 
                        Root Cause: Excavator EX-03 breakdown 4.2 jam & KM 4.2 licin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleTestSingleChannel("IN_APP")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      Acknowledge & Mute
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAlertForAI(pit02FeaturedAlert);
                        setIsAiModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs shadow-md"
                    >
                      Eksekusi Action Dispatch
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PUSH NOTIFICATION SIMULATION */}
            {previewChannel === "PUSH" && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider">
                    SMARTPHONE PUSH NOTIFICATION
                  </span>
                  <h4 className="text-sm font-bold text-white">Simulasi Lockscreen Smartphone C-Level & Site GM</h4>
                </div>

                {/* Smartphone Mockup */}
                <div className="p-4 rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl space-y-3">
                  <div className="text-center text-[10px] text-slate-500 font-mono">19:32 • Kamis, 16 Agustus 2026</div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-blue-500/40 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md bg-rose-600 flex items-center justify-center text-white text-[10px] font-black">
                          M
                        </div>
                        <span className="text-xs font-bold text-white">MINE SMART AI • CRITICAL</span>
                      </div>
                      <span className="text-[10px] text-slate-400">1m ago</span>
                    </div>

                    <div className="space-y-0.5">
                      <h5 className="text-xs font-black text-rose-300">
                        🚨 Critical Alert: Defisit Target Pit 02
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        Produksi Pit 02 diprediksi gagal mencapai target bulanan (Proyeksi 432k MT vs 480k MT).
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleRequestPushPermission}
                        className="flex-1 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black text-center"
                      >
                        Buka Aplikasi
                      </button>
                      <button
                        onClick={() => showToast("Notifikasi smartphone di-snooze selama 15 menit")}
                        className="flex-1 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold text-center"
                      >
                        Snooze 15m
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={handleRequestPushPermission}
                      className="px-3 py-1 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-[10px] font-bold"
                    >
                      Aktifkan Push Notifikasi Browser
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EMAIL SIMULATION */}
            {previewChannel === "EMAIL" && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                    CORPORATE HTML EMAIL DISPATCH
                  </span>
                  <h4 className="text-sm font-bold text-white">Email Format Standar Eksekutif & Manajemen Holding</h4>
                </div>

                <div className="rounded-2xl bg-white text-slate-900 p-6 shadow-2xl space-y-4 font-sans text-xs">
                  {/* Email Header */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase">
                        MINE SMART AI — OPERATIONAL ALERT SYSTEM
                      </span>
                      <h3 className="text-base font-extrabold text-slate-950 mt-0.5">
                        🚨 Critical Alert: Produksi Pit 02 Diprediksi Gagal Mencapai Target Bulanan
                      </h3>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <div>Kepada: <strong>management@nusamining.com</strong></div>
                      <div>Site: <strong>Pit 02 South Seam A & B</strong></div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5">
                    <div className="font-bold text-rose-700">RINGKASAN STATUS OPERASIONAL:</div>
                    <p className="leading-relaxed">
                      Sistem AI Predictive Engine mendeteksi anomali shortfall sebesar <strong>48,000 MT (-10%)</strong> pada sekuens penambangan Pit 02 hingga penutupan bulan berjalan.
                    </p>
                  </div>

                  {/* Metric Table */}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-100 text-slate-700">
                        <th className="p-2 font-bold">Indikator Kinerja</th>
                        <th className="p-2 font-bold">Target RKAB</th>
                        <th className="p-2 font-bold">Proyeksi AI</th>
                        <th className="p-2 font-bold">Deviasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Produksi Batubara Bulanan</td>
                        <td className="p-2">480,000 MT</td>
                        <td className="p-2 font-bold text-rose-600">432,000 MT</td>
                        <td className="p-2 font-bold text-rose-600">-10.0% Defisit</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Physical Availability (PA) Excavator EX-03</td>
                        <td className="p-2">90.0%</td>
                        <td className="p-2 font-bold text-amber-600">76.5%</td>
                        <td className="p-2 font-bold text-amber-600">-13.5% Downtime</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Hauling Cycle Time KM 4.2</td>
                        <td className="p-2">18.0 Menit</td>
                        <td className="p-2 font-bold text-rose-600">22.2 Menit</td>
                        <td className="p-2 font-bold text-rose-600">+4.2 Menit (Lumpur)</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">REKOMENDASI AKSI CEPAT:</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                      <li>Alihkan 4 unit Haul Truck dari Pit 02 ke Pit 01 untuk menghindari antrean idle di loading point.</li>
                      <li>Percepat pengiriman seal hidrolik untuk unit Excavator EX-03 di Workshop Central.</li>
                      <li>Kerahkan Motor Grader D375 untuk perataan lumpur licin pada segmen KM 4.2 pasca hujan.</li>
                    </ol>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => handleTestSingleChannel("EMAIL")}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                    >
                      Buka di Portal MINE SMART AI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WHATSAPP SIMULATION */}
            {previewChannel === "WHATSAPP" && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                    WHATSAPP BUSINESS BROADCAST
                  </span>
                  <h4 className="text-sm font-bold text-white">Pesan WhatsApp Otomatis ke Grup Direksi & Dispatcher</h4>
                </div>

                {/* WhatsApp Chat Box */}
                <div className="rounded-3xl bg-[#0b141a] border border-slate-800 p-4 shadow-2xl space-y-3">
                  {/* WA Header */}
                  <div className="flex items-center gap-2.5 border-b border-[#202c33] pb-2.5">
                    <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      MS
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">MINE SMART AI Alert Bot</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 fill-emerald-400 text-slate-950" />
                      </div>
                      <span className="text-[10px] text-slate-400">Official Mining Notification</span>
                    </div>
                  </div>

                  {/* WA Bubble */}
                  <div className="rounded-2xl rounded-tl-none bg-[#1f2c34] p-3.5 text-slate-100 space-y-2 border border-[#2a3942] text-xs shadow-md">
                    <div className="font-bold text-rose-400">
                      🚨 *CRITICAL MINING ALERT*
                    </div>
                    <div className="font-bold text-white">
                      *Produksi Pit 02 diprediksi gagal mencapai target bulanan.*
                    </div>
                    <div className="text-slate-300 space-y-1 text-[11px] leading-relaxed">
                      <div>📍 *Lokasi:* Pit 02 South Seam A & B</div>
                      <div>🎯 *Target RKAB:* 480,000 MT</div>
                      <div>📉 *Proyeksi Aktual:* 432,000 MT (-10% Shortfall)</div>
                      <div>⚠️ *Faktor Kritis:* Breakdown EX-03 (4.2 jam) & Jalan Licin KM 4.2 (+4.2 mnt)</div>
                    </div>
                    <div className="text-[11px] text-amber-300 font-semibold border-t border-[#2a3942] pt-1.5">
                      📋 *Rekomendasi Aksi:*
                      <br />• Rebalance 4 DT ke Pit 01
                      <br />• Prioritas service hidrolik EX-03
                      <br />• Scraping jalan KM 4.2 dg Motor Grader
                    </div>
                    <div className="text-right text-[9px] text-slate-400 pt-1 flex items-center justify-end gap-1">
                      <span>19:32</span>
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                  </div>

                  {/* WA Quick Action Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => handleTestSingleChannel("WHATSAPP")}
                      className="w-full py-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-emerald-400 text-xs font-bold text-center border border-[#2a3942]"
                    >
                      ✅ Konfirmasi Terima (Acknowledge)
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        "🚨 *CRITICAL ALERT*: Produksi Pit 02 diprediksi gagal mencapai target bulanan (Defisit -10%). Segera eksekusi rebalancing armada ke Pit 01!"
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black text-center flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Forward ke WhatsApp Nyata (wa.me)</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TELEGRAM SIMULATION */}
            {previewChannel === "TELEGRAM" && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                    TELEGRAM BOT & CHANNEL BROADCAST
                  </span>
                  <h4 className="text-sm font-bold text-white">Broadcast Otomatis ke Grup Telegram Mining Operations</h4>
                </div>

                {/* Telegram Chat Box */}
                <div className="rounded-3xl bg-[#17212b] border border-slate-800 p-4 shadow-2xl space-y-3">
                  {/* TG Header */}
                  <div className="flex items-center gap-2.5 border-b border-[#242f3d] pb-2.5">
                    <div className="h-9 w-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                      <Send className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">@MineSmart_MiningAlert_Bot</span>
                        <span className="text-[9px] bg-cyan-900/60 text-cyan-300 px-1 rounded">bot</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Broadcast Channel: Mining Ops Room</span>
                    </div>
                  </div>

                  {/* TG Message Post */}
                  <div className="rounded-2xl bg-[#242f3d] p-3.5 text-slate-100 space-y-2 text-xs border border-slate-700/50 shadow-md">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400">
                      <AlertOctagon className="h-4 w-4 shrink-0" />
                      <span>🚨 CRITICAL OPERATIONAL ALERT</span>
                    </div>
                    <div className="font-black text-white text-sm">
                      Produksi Pit 02 diprediksi gagal mencapai target bulanan.
                    </div>
                    <div className="font-mono text-[11px] bg-[#17212b] p-2.5 rounded-xl border border-slate-700 text-slate-200 space-y-1">
                      <div>🎯 Target RKAB : 480,000 MT</div>
                      <div>📉 Proyeksi   : 432,000 MT (-10.0%)</div>
                      <div>⏱️ Gap Volume : -48,000 MT</div>
                      <div>🚜 Key Unit   : EX-03 (Downtime 4.2h)</div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      *Root Cause:* Breakdown hidrolik EX-03 dan hambatan jalan licin KM 4.2.
                    </p>
                    <div className="text-right text-[9px] text-slate-400">19:32</div>
                  </div>

                  {/* Telegram Inline Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleTestSingleChannel("TELEGRAM")}
                      className="py-2 rounded-xl bg-[#2b5278] hover:bg-[#34628f] text-white text-xs font-bold text-center"
                    >
                      📊 Buka Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAlertForAI(pit02FeaturedAlert);
                        setIsAiModalOpen(true);
                      }}
                      className="py-2 rounded-xl bg-[#2b5278] hover:bg-[#34628f] text-white text-xs font-bold text-center"
                    >
                      ⚙️ Work Order EX-03
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GATEWAYS & RECIPIENT CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === "GATEWAYS" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Push & In-App Config */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Push & In-App Notification Gateway</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Browser Web Push Permission</div>
                  <div className="text-slate-400 text-[11px]">
                    Status izin browser: <strong className="text-blue-400">{gatewayConfig.push.browserPermission}</strong>
                  </div>
                </div>
                <button
                  onClick={handleRequestPushPermission}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                >
                  Request Permission
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">In-App Audio Chime</div>
                  <div className="text-slate-400 text-[11px]">Bunyikan sirine audio otomatis pada level Critical & Warning</div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-4 w-4 rounded accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Email SMTP Config */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Corporate Email SMTP Gateway</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PORT 587
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Daftar Penerima Email Otomatis:</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {gatewayConfig.email.recipients.map((rec, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{rec.name}</div>
                      <div className="text-slate-400 text-[11px]">{rec.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      {rec.severities.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Config */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">WhatsApp Business Cloud API</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                VERIFIED WABA
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Kontak WhatsApp Emergency Routing:</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {gatewayConfig.whatsapp.phoneNumbers.map((num, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{num.name}</div>
                      <div className="text-emerald-400 text-[11px]">{num.phone}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {num.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Telegram Config */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Telegram Bot & Broadcast Channel</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                @{gatewayConfig.telegram.botUsername}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Channel & Group Targets:</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {gatewayConfig.telegram.chatIds.map((tg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{tg.name}</div>
                      <div className="text-cyan-400 text-[11px]">ID: {tg.chatId}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {tg.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DELIVERY LOGS & AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeTab === "AUDIT_LOGS" && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Multi-Channel Delivery Audit Trail</h3>
              <p className="text-xs text-slate-400">Log lengkap transmisi alert ke 5 channel distribusi.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Alert Title</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Penerima / Target</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ref ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {alerts.flatMap((alt) =>
                  (alt.channelDeliveries || []).map((del, i) => (
                    <tr key={`${alt.id}-${i}`} className="hover:bg-slate-850/50">
                      <td className="p-3 font-mono text-[11px] text-slate-400">{del.sentAt}</td>
                      <td className="p-3 font-bold text-white max-w-[200px] truncate">{alt.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(alt.severity).class}`}>
                          {alt.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getChannelBadge(del.channel)}`}>
                          {getChannelIcon(del.channel)}
                          <span>{del.channel}</span>
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">{del.recipient}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {del.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{del.externalRefId || `MSG-${alt.id.slice(-4)}`}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ALERT RULES & AUTO-ESCALATION */}
      {/* ========================================================================= */}
      {activeTab === "RULES" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => {
              const badge = getSeverityBadge(rule.severity);
              return (
                <div key={rule.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.class}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{rule.id}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-slate-300 font-mono space-y-1">
                    <div>Metrik: <strong className="text-white">{rule.metric}</strong></div>
                    <div>Ambang Batas: <strong className="text-purple-400">{rule.operator} {rule.thresholdValue} {rule.unit}</strong></div>
                  </div>

                  {rule.targetChannels && (
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="text-slate-500 font-bold">Auto-Dispatch:</span>
                      {rule.targetChannels.map((c) => (
                        <span key={c} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getChannelBadge(c)}`}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI ROOT CAUSE & QUICK ACTION MODAL */}
      {/* ========================================================================= */}
      {isAiModalOpen && selectedAlertForAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/50 shadow-2xl p-6 space-y-5 text-xs text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                    AI ROOT CAUSE & MITIGATION ENGINE
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedAlertForAI.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Box */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-300 text-xs">
                <Sparkles className="h-4 w-4" />
                <span>DIAGNOSIS AKAR MASALAH (AI ROOT CAUSE):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedAlertForAI.aiRootCauseAnalysis ||
                  "AI mendeteksi anomali pada sekuens operasional yang memerlukan intervensi langsung."}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>DAFTAR TINDAKAN PRIORITAS (DISPATCH ACTION):</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedAlertForAI.suggestedAction}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleAcknowledge(selectedAlertForAI.id);
                  setIsAiModalOpen(false);
                  showToast("🚀 Perintah Dispatch & Rebalancing Armada berhasil dieksekusi!");
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-lg shadow-purple-950/50"
              >
                Eksekusi Aksi Mitigasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MULTI-CHANNEL DELIVERIES DETAIL MODAL */}
      {/* ========================================================================= */}
      {isDeliveriesModalOpen && selectedAlertForDeliveries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white">Status Pengiriman 5 Channel</h3>
                <p className="text-[11px] text-slate-400 truncate max-w-sm">{selectedAlertForDeliveries.title}</p>
              </div>
              <button
                onClick={() => setIsDeliveriesModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {selectedAlertForDeliveries.channelDeliveries?.map((d, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getChannelIcon(d.channel)}
                    <div>
                      <div className="font-bold text-white">{d.channel}</div>
                      <div className="text-[10px] text-slate-400">{d.recipient}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {d.status}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{d.sentAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
