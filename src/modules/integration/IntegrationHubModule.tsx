import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import {
  ConnectorCategory,
  IntegrationConnector,
  WebhookSubscription,
  ApiEndpointSpec,
  IntegrationTransactionLog,
  LiveHardwareFeedItem,
  IntegrationSummaryKPIs,
} from "../../types/integrationTypes";
import { integrationRepository } from "../../services/repositories/IntegrationRepository";
import {
  Network,
  Globe,
  Webhook,
  Navigation,
  Cpu,
  Truck,
  Database,
  Scale,
  FlaskConical,
  Plane,
  Camera,
  Radio,
  UserCheck,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Play,
  Copy,
  Check,
  Sliders,
  Terminal,
  Activity,
  Zap,
  Code2,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Send,
  Eye,
  Settings2,
  Layers,
  ArrowRight,
  HardDrive,
  FileCode2,
  Sparkles,
} from "lucide-react";

import { SupabaseManagementPanel } from "../../components/supabase/SupabaseManagementPanel";

export const IntegrationHubModule: React.FC = () => {
  const { company, activeCompany, activeSite, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "supabase" | "connectors" | "api-center" | "webhooks" | "hardware-stream" | "schema-mapping" | "audit-logs"
  >("supabase");

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [connectors, setConnectors] = useState<IntegrationConnector[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpointSpec[]>([]);
  const [logs, setLogs] = useState<IntegrationTransactionLog[]>([]);
  const [liveFeeds, setLiveFeeds] = useState<LiveHardwareFeedItem[]>([]);
  const [kpis, setKpis] = useState<IntegrationSummaryKPIs | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live Ping/Handshake Testing State
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);
  const [testModalData, setTestModalData] = useState<{
    connector: IntegrationConnector;
    result: {
      success: boolean;
      latencyMs: number;
      message: string;
      handshakeResponse: Record<string, any>;
    };
  } | null>(null);

  // Configuration Modal State
  const [configuringConnector, setConfiguringConnector] = useState<IntegrationConnector | null>(null);
  const [editEndpointUrl, setEditEndpointUrl] = useState("");
  const [editPort, setEditPort] = useState<number | undefined>(undefined);
  const [editApiKey, setEditApiKey] = useState("");
  const [editSyncFrequency, setEditSyncFrequency] = useState<any>("REALTIME_STREAM");

  // API Sandbox State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec | null>(null);
  const [apiSandboxRunning, setApiSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);
  const [requestHeadersInput, setRequestHeadersInput] = useState<string>('{\n  "Authorization": "Bearer msai_live_8f99a110",\n  "X-Company-ID": "COMP-BNU-01"\n}');
  const [requestBodyInput, setRequestBodyInput] = useState<string>("{}");
  const [codeSnippetLang, setCodeSnippetLang] = useState<"curl" | "typescript" | "python">("curl");
  const [copiedCode, setCopiedCode] = useState(false);

  // Webhook Test Dispatcher State
  const [selectedWebhookId, setSelectedWebhookId] = useState<string>("");
  const [testWebhookEvent, setTestWebhookEvent] = useState("weighbridge.gross.captured");
  const [testWebhookPayload, setTestWebhookPayload] = useState(
    JSON.stringify(
      {
        ticketId: "WB-20260816-0428",
        truckCode: "DT-108",
        grossWeightKg: 48500,
        tareWeightKg: 18200,
        netWeightKg: 30300,
        sourcePit: "Pit 02 North",
        commodity: "COAL",
      },
      null,
      2
    )
  );
  const [webhookDispatching, setWebhookDispatching] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<any | null>(null);

  // Add Webhook Modal State
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState("dispatch.cycle.completed, weighbridge.gross.captured");

  // Log filter
  const [logStatusFilter, setLogStatusFilter] = useState("ALL");

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => {
      refreshLiveTelemetry();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [kpiData, connData, whData, epData, logData, feedData] = await Promise.all([
        integrationRepository.getKPIs(),
        integrationRepository.getAllConnectors(),
        integrationRepository.getAllWebhooks(),
        integrationRepository.getApiEndpoints(),
        integrationRepository.getTransactionLogs(),
        integrationRepository.getLiveFeeds(),
      ]);
      setKpis(kpiData);
      setConnectors(connData);
      setWebhooks(whData);
      setApiEndpoints(epData);
      setLogs(logData);
      setLiveFeeds(feedData);
      if (epData.length > 0 && !selectedEndpoint) {
        setSelectedEndpoint(epData[0]);
        setRequestBodyInput(JSON.stringify(epData[0].requestBodySample || {}, null, 2));
      }
      if (whData.length > 0 && !selectedWebhookId) {
        setSelectedWebhookId(whData[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshLiveTelemetry = async () => {
    const feeds = await integrationRepository.getLiveFeeds();
    setLiveFeeds(feeds);
  };

  const handleTestConnection = async (connector: IntegrationConnector) => {
    setTestingConnectorId(connector.id);
    try {
      const res = await integrationRepository.testConnectorConnection(connector.id);
      setTestModalData({
        connector,
        result: res,
      });
      await loadAllData();
    } finally {
      setTestingConnectorId(null);
    }
  };

  const handleOpenConfigure = (c: IntegrationConnector) => {
    setConfiguringConnector(c);
    setEditEndpointUrl(c.endpointUrl);
    setEditPort(c.port);
    setEditApiKey(c.apiKeyMasked || "");
    setEditSyncFrequency(c.syncFrequency);
  };

  const handleSaveConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringConnector) return;

    await integrationRepository.updateConnector(
      configuringConnector.id,
      {
        endpointUrl: editEndpointUrl,
        port: editPort,
        apiKeyMasked: editApiKey,
        syncFrequency: editSyncFrequency,
      },
      currentUser.email
    );

    setConfiguringConnector(null);
    await loadAllData();
  };

  const handleRunApiSandbox = async () => {
    if (!selectedEndpoint) return;
    setApiSandboxRunning(true);
    setSandboxResult(null);
    try {
      let parsedHeaders = {};
      let parsedBody = {};
      try {
        parsedHeaders = JSON.parse(requestHeadersInput);
      } catch (err) {}
      try {
        parsedBody = JSON.parse(requestBodyInput);
      } catch (err) {}

      const res = await integrationRepository.executeApiSandbox(
        selectedEndpoint.id,
        parsedHeaders,
        {},
        parsedBody
      );
      setSandboxResult(res);
      await loadAllData();
    } finally {
      setApiSandboxRunning(false);
    }
  };

  const handleDispatchTestWebhook = async () => {
    if (!selectedWebhookId) return;
    setWebhookDispatching(true);
    setWebhookTestResult(null);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(testWebhookPayload);
      } catch (err) {
        parsedPayload = { raw: testWebhookPayload };
      }

      const res = await integrationRepository.triggerTestWebhook(
        selectedWebhookId,
        testWebhookEvent,
        parsedPayload
      );
      setWebhookTestResult(res);
      await loadAllData();
    } finally {
      setWebhookDispatching(false);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookName || !newWebhookUrl) return;

    const eventsList = newWebhookEvents.split(",").map((s) => s.trim()).filter(Boolean);

    await integrationRepository.createWebhook(
      {
        companyId: activeCompany?.id || "COMP-BNU-01",
        name: newWebhookName,
        targetUrl: newWebhookUrl,
        subscribedEvents: eventsList,
        secretTokenMasked: "whsec_live_" + Math.random().toString(36).substring(2, 15),
        status: "ACTIVE",
        retryPolicy: {
          maxRetries: 5,
          backoffMultiplier: 2,
          timeoutSeconds: 15,
        },
        headers: { "Content-Type": "application/json" },
        description: "Custom enterprise webhook endpoint",
      },
      currentUser.email
    );

    setIsAddWebhookOpen(false);
    setNewWebhookName("");
    setNewWebhookUrl("");
    await loadAllData();
  };

  const handleSimulateHardwareEvent = (cat: ConnectorCategory) => {
    if (cat === "weighbridge") {
      const gross = (45 + Math.random() * 8).toFixed(2);
      integrationRepository.simulateIncomingHardwarePacket(
        "weighbridge",
        "Mettler Toledo IND780 #WB-01",
        "Bobot Bruto Truk",
        gross,
        "Ton",
        {
          truckPlate: "KT " + Math.floor(1000 + Math.random() * 9000) + " WA",
          grossKg: parseFloat(gross) * 1000,
          tareKg: 18100,
          netKg: parseFloat(gross) * 1000 - 18100,
          status: "STABLE",
        }
      );
    } else if (cat === "gps") {
      const spd = (20 + Math.random() * 15).toFixed(1);
      integrationRepository.simulateIncomingHardwarePacket(
        "gps",
        "Teltonika FMB640 #DT-108",
        "Kecepatan Hauler",
        spd,
        "km/h",
        {
          lat: 0.4914 + (Math.random() - 0.5) * 0.01,
          lng: 117.5418 + (Math.random() - 0.5) * 0.01,
          speedKmh: parseFloat(spd),
          fuelPct: 76,
        }
      );
    } else if (cat === "attendance") {
      integrationRepository.simulateIncomingHardwarePacket(
        "attendance",
        "Hikvision MinMoe #TURNSTILE-01",
        "Fit-to-Work Alkohol Test",
        "0.00",
        "mg/L BrAC",
        {
          employeeNik: "OPR-" + Math.floor(1000 + Math.random() * 9000),
          temperature: (36.2 + Math.random() * 0.5).toFixed(1),
          pass: true,
        }
      );
    } else {
      integrationRepository.simulateIncomingHardwarePacket(
        cat,
        `Edge Gateway #${cat.toUpperCase()}`,
        "Packet Event",
        "STREAM_OK",
        "raw",
        { timestamp: new Date().toISOString(), status: "HEALTHY" }
      );
    }
    refreshLiveTelemetry();
  };

  const getCategoryIcon = (category: ConnectorCategory) => {
    switch (category) {
      case "rest_api":
        return Globe;
      case "webhook":
        return Webhook;
      case "gps":
        return Navigation;
      case "iot":
        return Cpu;
      case "fms":
        return Truck;
      case "erp":
        return Database;
      case "weighbridge":
        return Scale;
      case "laboratory":
        return FlaskConical;
      case "drone":
        return Plane;
      case "cctv":
        return Camera;
      case "rfid":
        return Radio;
      case "attendance":
        return UserCheck;
      case "accounting":
        return Coins;
      default:
        return Network;
    }
  };

  const filteredConnectors = connectors.filter((c) => {
    const matchCat = selectedCategory === "ALL" || c.category === selectedCategory;
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoriesList: { id: string; label: string; icon: any }[] = [
    { id: "ALL", label: "Semua Konektor (13)", icon: Network },
    { id: "rest_api", label: "REST API", icon: Globe },
    { id: "webhook", label: "Webhook", icon: Webhook },
    { id: "gps", label: "GPS Fleet", icon: Navigation },
    { id: "iot", label: "IoT Sensors", icon: Cpu },
    { id: "fms", label: "FMS & Dispatch", icon: Truck },
    { id: "erp", label: "ERP (SAP)", icon: Database },
    { id: "weighbridge", label: "Weighbridge", icon: Scale },
    { id: "laboratory", label: "Lab LIMS", icon: FlaskConical },
    { id: "drone", label: "Drone 3D", icon: Plane },
    { id: "cctv", label: "CCTV Vision", icon: Camera },
    { id: "rfid", label: "RFID Gate", icon: Radio },
    { id: "attendance", label: "Attendance", icon: UserCheck },
    { id: "accounting", label: "Accounting", icon: Coins },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Integration Hub Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#06142e] to-[#030914] p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 px-3 py-1 text-[10px] font-extrabold text-teal-300 border border-teal-500/30 uppercase tracking-widest flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5" />
                ENTERPRISE INTEGRATION HUB & API CENTER
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                13 INDUSTRIAL PROTOCOL CONNECTORS ACTIVE
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Enterprise API Center & Device Interconnection</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Pusat integrasi terpadu untuk menghubungkan seluruh ekosistem pertambangan: REST API, Webhooks, GPS Fleet, IoT Sensors, FMS Dispatch, ERP SAP, Timbangan Jembatan, Laboratorium LIMS, Drone Fotogrametri, CCTV AI Vision, RFID Gate, Presensi Biometrik, dan Sistem Akuntansi.
              </p>
            </div>

            {/* Sub Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                Active Tenant: <strong className="text-white">{company.displayName}</strong>
              </div>
              <div>•</div>
              <div>
                Target Site: <strong className="text-emerald-400">{activeSite.name}</strong>
              </div>
              <div>•</div>
              <div>
                Security: <span className="font-mono text-teal-400 font-bold">HMAC-SHA256 & TLS 1.3</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab("api-center")}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Terminal className="h-4 w-4" />
              <span>Buka API Sandbox Explorer</span>
            </button>
            <button
              onClick={() => setIsAddWebhookOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Webhook Subscription</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Rollup Cards */}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Network className="h-3.5 w-3.5 text-emerald-400" /> Total Konektor
            </span>
            <p className="text-xl font-black text-white">{kpis.totalConnectors} Sistem</p>
            <span className="text-[10px] text-emerald-400 block font-semibold">
              {kpis.activeConnectors} Terhubung Aktif
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-teal-400" /> Volume API 24 Jam
            </span>
            <p className="text-xl font-black text-teal-300">{kpis.totalApiRequests24h.toLocaleString()} Req</p>
            <span className="text-[10px] text-slate-400 block">Throughput 128 req/detik</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Avg Latency
            </span>
            <p className="text-xl font-black text-amber-300">{kpis.averageLatencyMs} ms</p>
            <span className="text-[10px] text-emerald-400 block font-semibold">Sub-50ms Edge Gateway</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Global Uptime
            </span>
            <p className="text-xl font-black text-emerald-400">{kpis.globalUptimePct}%</p>
            <span className="text-[10px] text-slate-400 block">SLA 99.9% Enterprise</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Webhook className="h-3.5 w-3.5 text-purple-400" /> Active Webhooks
            </span>
            <p className="text-xl font-black text-purple-300">{kpis.activeWebhooks} Endpoints</p>
            <span className="text-[10px] text-slate-400 block">Auto-Retry Exponential</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" /> Telemetri Fleet & IoT
            </span>
            <p className="text-xl font-black text-cyan-300">{kpis.syncedIoTFleets} Sensor</p>
            <span className="text-[10px] text-cyan-400 block font-semibold">Live MQTT & TCP/IP</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "supabase", label: "Supabase Database & Backend", icon: Database },
          { id: "connectors", label: "13 Connectors Directory", icon: Network },
          { id: "api-center", label: "REST API Center & Sandbox", icon: Terminal },
          { id: "webhooks", label: "Webhook Event Stream", icon: Webhook },
          { id: "hardware-stream", label: "Live Hardware Feeds", icon: Activity },
          { id: "schema-mapping", label: "Schema & Data Mapper", icon: Layers },
          { id: "audit-logs", label: "Integration Audit Logs", icon: FileCode2 },
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

      {/* TAB 0: SUPABASE DATABASE & BACKEND */}
      {activeTab === "supabase" && (
        <SupabaseManagementPanel />
      )}

      {/* TAB 1: 13 CONNECTORS DIRECTORY */}
      {activeTab === "connectors" && (
        <div className="space-y-6">
          {/* Categories Filter Pills & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categoriesList.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari protokol, provider, URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredConnectors.map((c) => {
              const Icon = getCategoryIcon(c.category);
              const isTesting = testingConnectorId === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider">
                              {c.categoryLabel}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {c.protocol}
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-white leading-tight">{c.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-400">{c.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{c.description}</p>

                    {/* Metadata & Endpoint Details */}
                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Provider & Device:</span>
                        <span className="font-semibold text-slate-200">{c.provider}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Endpoint / Host:</span>
                        <span className="font-mono text-[11px] text-teal-300 truncate max-w-[200px]">
                          {c.endpointUrl}
                        </span>
                      </div>
                      {c.ipAddress && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">IP & Port:</span>
                          <span className="font-mono text-[11px] text-amber-300">
                            {c.ipAddress}:{c.port}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Auth & Enkripsi:</span>
                        <span className="font-mono text-[10px] text-slate-300">{c.authType}</span>
                      </div>
                    </div>

                    {/* Live Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-[9px] text-slate-500 block">Latency</span>
                        <span className="font-bold text-amber-400">{c.latencyMs} ms</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-[9px] text-slate-500 block">Uptime</span>
                        <span className="font-bold text-emerald-400">{c.uptimePct}%</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-[9px] text-slate-500 block">Sync</span>
                        <span className="font-bold text-slate-300 text-[10px]">{c.syncFrequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <button
                      disabled={isTesting}
                      onClick={() => handleTestConnection(c)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTesting ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <Play className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      <span>{isTesting ? "Testing Ping..." : "Uji Koneksi"}</span>
                    </button>

                    <button
                      onClick={() => handleOpenConfigure(c)}
                      className="flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                      title="Konfigurasi Parameter"
                    >
                      <Sliders className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleSimulateHardwareEvent(c.category)}
                      className="flex items-center justify-center p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      title="Simulasi Packet Data Masuk"
                    >
                      <Zap className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REST API CENTER & SANDBOX */}
      {activeTab === "api-center" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: API Endpoints Directory */}
            <div className="lg:col-span-4 space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span>OpenAPI 3.1 Endpoints</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    v1.4 Live
                  </span>
                </div>

                <div className="space-y-2">
                  {apiEndpoints.map((ep) => {
                    const isSelected = selectedEndpoint?.id === ep.id;
                    const methodColor =
                      ep.method === "GET"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : ep.method === "POST"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30";

                    return (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEndpoint(ep);
                          setRequestBodyInput(JSON.stringify(ep.requestBodySample || {}, null, 2));
                          setSandboxResult(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                            : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${methodColor}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs text-white font-bold truncate">{ep.path}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* API Security Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Autentikasi & Rate Limiting</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Semua panggilan API wajib menyertakan Bearer Token di header <code className="text-emerald-400">Authorization</code> dan ID Perusahaan di <code className="text-emerald-400">X-Company-ID</code>.
                </p>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300">
                  Rate Limit: 1,200 requests/menit per API Key
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Sandbox Explorer */}
            <div className="lg:col-span-8 space-y-4">
              {selectedEndpoint && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                  {/* Endpoint Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-mono font-black border ${
                            selectedEndpoint.method === "GET"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {selectedEndpoint.method}
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-white">
                          {selectedEndpoint.path}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{selectedEndpoint.description}</p>
                    </div>

                    <button
                      disabled={apiSandboxRunning}
                      onClick={handleRunApiSandbox}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {apiSandboxRunning ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{apiSandboxRunning ? "Sending Request..." : "Kirim Request (Test)"}</span>
                    </button>
                  </div>

                  {/* Headers & Body Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Code2 className="h-3.5 w-3.5 text-teal-400" /> Request Headers (JSON)
                      </span>
                      <textarea
                        value={requestHeadersInput}
                        onChange={(e) => setRequestHeadersInput(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Code2 className="h-3.5 w-3.5 text-blue-400" /> Request Body (JSON)
                      </span>
                      <textarea
                        value={requestBodyInput}
                        onChange={(e) => setRequestBodyInput(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-blue-300 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sandbox Execution Result */}
                  {sandboxResult && (
                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                            HTTP {sandboxResult.statusCode} OK
                          </span>
                          <span className="text-xs text-slate-300 font-bold">
                            Response Time: <span className="text-amber-400">{sandboxResult.latencyMs} ms</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          RateLimit Remaining: {sandboxResult.headers["x-ratelimit-remaining"]}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Response JSON Body:</span>
                        <pre className="rounded-xl bg-slate-950 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800 max-h-60">
                          {JSON.stringify(sandboxResult.responseBody, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Code Generator Snippets */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Code2 className="h-4 w-4 text-emerald-400" />
                        <span>Contoh Kode Integrasi Klien</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {(["curl", "typescript", "python"] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setCodeSnippetLang(lang)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              codeSnippetLang === lang
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <pre className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
                      {codeSnippetLang === "curl"
                        ? `curl -X ${selectedEndpoint.method} "https://api.minesmart.ai${selectedEndpoint.path}" \\\n  -H "Authorization: Bearer msai_live_8f99a110" \\\n  -H "X-Company-ID: COMP-BNU-01" \\\n  -H "Content-Type: application/json"`
                        : codeSnippetLang === "typescript"
                        ? `const res = await fetch("https://api.minesmart.ai${selectedEndpoint.path}", {\n  method: "${selectedEndpoint.method}",\n  headers: {\n    "Authorization": "Bearer msai_live_8f99a110",\n    "X-Company-ID": "COMP-BNU-01",\n    "Content-Type": "application/json"\n  }\n});\nconst data = await res.json();`
                        : `import requests\n\nurl = "https://api.minesmart.ai${selectedEndpoint.path}"\nheaders = {\n    "Authorization": "Bearer msai_live_8f99a110",\n    "X-Company-ID": "COMP-BNU-01"\n}\nresponse = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers)\nprint(response.json())`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK EVENT STREAM & DISPATCHER */}
      {activeTab === "webhooks" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Webhook Subscriptions List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-purple-400" />
                    <span>Langganan Webhook Aktif (Event Bus)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Push notifikasi otomatis saat event operasional terjadi secara real-time.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddWebhookOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 text-xs font-bold hover:bg-purple-500/30 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Daftar Webhook Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {webhooks.map((wh) => (
                  <div
                    key={wh.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{wh.name}</span>
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-500/30">
                            {wh.status}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-teal-300 mt-1 truncate max-w-md">{wh.targetUrl}</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedWebhookId(wh.id);
                        }}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                      >
                        Pilih untuk Test
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{wh.description}</p>

                    {/* Subscribed Events Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {wh.subscribedEvents.map((ev) => (
                        <span
                          key={ev}
                          className="rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-slate-800"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <div>
                        Berhasil: <strong className="text-emerald-400">{wh.successCount} req</strong>
                      </div>
                      <div>
                        Gagal: <strong className="text-amber-400">{wh.failureCount} req</strong>
                      </div>
                      <div>
                        Retry Policy: <strong className="text-slate-300">{wh.retryPolicy.maxRetries}x Max</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook Live Dispatch Tester */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Send className="h-4 w-4 text-emerald-400" />
                    <span>Uji Dispatch Webhook & Verifikasi HMAC</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kirim payload simulasi untuk memverifikasi endpoint server tujuan Anda.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Target Webhook:</label>
                    <select
                      value={selectedWebhookId}
                      onChange={(e) => setSelectedWebhookId(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {webhooks.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.targetUrl})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Event Type:</label>
                    <input
                      type="text"
                      value={testWebhookEvent}
                      onChange={(e) => setTestWebhookEvent(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Payload JSON Data:</label>
                    <textarea
                      value={testWebhookPayload}
                      onChange={(e) => setTestWebhookPayload(e.target.value)}
                      rows={6}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-purple-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    disabled={webhookDispatching}
                    onClick={handleDispatchTestWebhook}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {webhookDispatching ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{webhookDispatching ? "Dispatching Event..." : "Kirim Event Webhook"}</span>
                  </button>

                  {webhookTestResult && (
                    <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                        <span>HTTP {webhookTestResult.statusCode} Delivered</span>
                        <span>{webhookTestResult.deliveryTimeMs} ms</span>
                      </div>
                      <div className="font-mono text-[10px] bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 break-all">
                        <span className="text-slate-500 block">X-MineSmart-Signature:</span>
                        {webhookTestResult.hmacSignature}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE HARDWARE FEEDS */}
      {activeTab === "hardware-stream" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Live Packet Telemetri Hardware (Weighbridge, GPS, TPMS, CCTV, RFID)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aliran paket data mentah (raw packet) langsung dari perangkat keras tepi di lapangan tambang.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateHardwareEvent("weighbridge")}
                className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                + Simulasi Timbangan
              </button>
              <button
                onClick={() => handleSimulateHardwareEvent("gps")}
                className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                + Simulasi GPS Ping
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveFeeds.map((feed) => {
              const Icon = getCategoryIcon(feed.category);
              return (
                <div
                  key={feed.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">{feed.deviceName}</span>
                        <span className="text-[10px] text-slate-400">{feed.location}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(feed.timestamp).toLocaleTimeString("id-ID")}
                    </span>
                  </div>

                  {/* Highlight Metric */}
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">{feed.metricLabel}</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {feed.metricValue} <span className="text-xs font-normal text-slate-400">{feed.unit}</span>
                    </span>
                  </div>

                  {/* Raw Packet Hex */}
                  {feed.rawPacketHex && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Raw Hex Frame:</span>
                      <div className="font-mono text-[10px] bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-teal-400">
                        {feed.rawPacketHex}
                      </div>
                    </div>
                  )}

                  {/* Parsed JSON */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">Parsed JSON Payload:</span>
                    <pre className="font-mono text-[10px] bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-slate-300 overflow-x-auto">
                      {JSON.stringify(feed.parsedPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SCHEMA & DATA MAPPER */}
      {activeTab === "schema-mapping" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Skema Pemetaan Data Antar-Sistem (Data Field Mapping Engine)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konversi otomatis format payload dari protokol pihak ketiga ke entitas data inti MineSmart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectors.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {c.name}
                    </span>
                    <span className="font-mono text-[10px] text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {c.protocol}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(c.dataMappingSchema).map(([srcKey, dstKey]) => (
                      <div
                        key={srcKey}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px]"
                      >
                        <span className="font-mono text-purple-300 font-semibold">{srcKey}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                        <span className="font-mono text-emerald-400 font-bold">{dstKey}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INTEGRATION AUDIT LOGS */}
      {activeTab === "audit-logs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-emerald-400" />
                <span>Log Transaksi Integrasi Real-Time</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail lengkap semua permintaan masuk dan keluar dari 13 konektor aktif.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="SUCCESS">Success Only</option>
                <option value="WARNING">Warning</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] bg-slate-950/80">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Konektor & Sistem</th>
                    <th className="p-3">Arah</th>
                    <th className="p-3">Action / Path</th>
                    <th className="p-3">Ringkasan Payload</th>
                    <th className="p-3">HTTP Status</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {logs
                    .filter((l) => logStatusFilter === "ALL" || l.status === logStatusFilter)
                    .map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono text-slate-400 text-[11px]">
                          {new Date(l.timestamp).toLocaleTimeString("id-ID")}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white block">{l.connectorName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{l.ipSource}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              l.direction === "INBOUND"
                                ? "bg-teal-500/20 text-teal-300"
                                : "bg-purple-500/20 text-purple-300"
                            }`}
                          >
                            {l.direction}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-300 text-[11px] max-w-[150px] truncate">
                          {l.methodOrAction}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] max-w-[250px] truncate">
                          {l.requestPayloadSummary}
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">{l.httpStatusCode || "-"}</td>
                        <td className="p-3 font-mono text-amber-400">{l.latencyMs} ms</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-extrabold border uppercase ${
                              l.status === "SUCCESS"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            {l.status}
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

      {/* MODAL: PING / HANDSHAKE TEST RESULT */}
      {testModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Hasil Uji Koneksi Edge Gateway</h3>
                  <p className="text-xs text-slate-400">{testModalData.connector.name}</p>
                </div>
              </div>
              <button
                onClick={() => setTestModalData(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <p className="font-bold">{testModalData.result.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Round-Trip Latency</span>
                  <span className="text-base font-black text-amber-400">{testModalData.result.latencyMs} ms</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Status Socket</span>
                  <span className="text-base font-black text-emerald-400">PASSED (200 OK)</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Handshake Diagnostics Payload:</span>
                <pre className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto">
                  {JSON.stringify(testModalData.result.handshakeResponse, null, 2)}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setTestModalData(null)}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURE CONNECTOR */}
      {configuringConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveConfiguration}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black text-white">Konfigurasi Konektor</h3>
                  <p className="text-xs text-slate-400">{configuringConnector.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfiguringConnector(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Endpoint URL / Hostname:</label>
                <input
                  type="text"
                  value={editEndpointUrl}
                  onChange={(e) => setEditEndpointUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Port Jaringan:</label>
                  <input
                    type="number"
                    value={editPort || ""}
                    onChange={(e) => setEditPort(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sync Frequency:</label>
                  <select
                    value={editSyncFrequency}
                    onChange={(e) => setEditSyncFrequency(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="REALTIME_STREAM">Realtime Stream</option>
                    <option value="EVERY_1_MIN">Setiap 1 Menit</option>
                    <option value="EVERY_5_MIN">Setiap 5 Menit</option>
                    <option value="HOURLY">Setiap Jam</option>
                    <option value="DAILY_BATCH">Daily Batch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">API Key / Secret Token:</label>
                <input
                  type="text"
                  value={editApiKey}
                  onChange={(e) => setEditApiKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfiguringConnector(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD WEBHOOK */}
      {isAddWebhookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateWebhook}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="text-base font-black text-white">Daftar Webhook Endpoint Baru</h3>
                  <p className="text-xs text-slate-400">Kirim event real-time ke sistem eksternal perusahaan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddWebhookOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Nama Webhook:</label>
                <input
                  type="text"
                  placeholder="e.g. ERP Inbound Cycle Dispatch"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Payload URL (HTTPS):</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/webhooks/receiver"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Langganan Events (Dipisah Koma):</label>
                <input
                  type="text"
                  value={newWebhookEvents}
                  onChange={(e) => setNewWebhookEvents(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-purple-300 focus:border-purple-500 focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Contoh: dispatch.cycle.completed, weighbridge.gross.captured, hse.incident.critical, fuel.dispense.authorized
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddWebhookOpen(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-500 px-5 py-2 text-xs font-bold text-white hover:brightness-110 cursor-pointer"
              >
                Simpan & Aktifkan Webhook
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
