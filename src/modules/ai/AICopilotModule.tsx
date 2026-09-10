import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Compass,
  Truck,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Search,
  Trash2,
  Edit2,
  Download,
  Sliders,
  BookOpen,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Mic,
  ArrowUpRight,
  FileText,
  X,
  Layers,
  Fuel,
  Wrench,
  DollarSign,
  Boxes,
  FileSpreadsheet,
  Zap,
  Info,
  Clock,
  Flame,
  ArrowRight,
  TrendingDown,
  Gauge,
  HelpCircle,
  BarChart3,
  Scale,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  AIChatMessageExtended,
  AIConversationRecord,
  AIInsightRecord,
  AIWhatIfParams,
  AIWhatIfResult,
  KnowledgeDocument,
  AIInteractionAuditLog,
  AIAutoDetectedSignal,
  AIStructuredRecommendation,
} from "../../types/aiTypes";
import { AICopilotService } from "../../services/ai/ai-copilot-service";
import { AIRepository } from "../../services/repositories/AIRepository";
import { AIOrchestrator } from "../../services/ai/aiOrchestrator";
import { toolSimulateWhatIf, toolGetKnowledgeBaseDocs } from "../../services/ai/aiToolRegistry";
import { AIMiningCorePillarsSuite } from "./components/AIMiningCorePillarsSuite";

const aiRepo = new AIRepository();

export const AICopilotModule: React.FC = () => {
  const { activeSite, currentUser, company } = useAuth();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<
    "PILLARS" | "CHAT" | "INSIGHTS" | "RECOMMENDATIONS" | "WHAT_IF" | "KNOWLEDGE" | "AUDIT"
  >("CHAT");

  // State Management
  const [conversations, setConversations] = useState<AIConversationRecord[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("conv-default");
  const [messages, setMessages] = useState<AIChatMessageExtended[]>([]);
  const [insights, setInsights] = useState<AIInsightRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AIInteractionAuditLog[]>([]);

  // 9 Auto-Detected Operational Signals & 5 Structured Recommendations
  const [autoSignals, setAutoSignals] = useState<AIAutoDetectedSignal[]>(() =>
    AIOrchestrator.getAutoDetectedSignals(activeSite?.name || "Site Kalimantan")
  );
  const [structuredRecs, setStructuredRecs] = useState<AIStructuredRecommendation[]>(() =>
    AIOrchestrator.getStructuredRecommendations(activeSite?.name || "Site Kalimantan")
  );

  const [selectedSignalCategory, setSelectedSignalCategory] = useState<string>("ALL");
  const [selectedRecPriority, setSelectedRecPriority] = useState<string>("ALL");

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  // Modals & Active Views
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // What-If Parameters
  const [whatIfParams, setWhatIfParams] = useState<AIWhatIfParams>({
    productionVolumeChangePct: -5,
    fuelPriceChangePct: 10,
    fleetAvailabilityChangePct: -3,
    coalSellingPriceUSD: 68.0,
  });
  const [whatIfResult, setWhatIfResult] = useState<AIWhatIfResult>(() => toolSimulateWhatIf(whatIfParams));

  // Knowledge Base Search
  const [kbSearch, setKbSearch] = useState("SOP");
  const [kbDocs, setKbDocs] = useState<KnowledgeDocument[]>(() => toolGetKnowledgeBaseDocs("SOP"));

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quick Indonesian Prompt List (Direct User Requirement)
  const quickIndonesianPrompts = [
    { label: "Bagaimana kondisi tambang hari ini?", icon: Sparkles, color: "text-amber-300 border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 font-black shadow-md shadow-amber-950/40" },
    { label: "Kenapa produksi hari ini turun?", icon: TrendingDown, color: "text-rose-400 border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/50" },
    { label: "Alat mana yang paling tidak produktif?", icon: Truck, color: "text-amber-400 border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/50" },
    { label: "Berapa estimasi produksi sampai akhir bulan?", icon: TrendingUp, color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/50" },
    { label: "Kenapa fuel consumption meningkat?", icon: Fuel, color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/50" },
    { label: "Buatkan laporan produksi hari ini.", icon: FileText, color: "text-purple-400 border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/50" },
  ];

  // Load Initial Data
  useEffect(() => {
    loadData();
    setAutoSignals(AIOrchestrator.getAutoDetectedSignals(activeSite?.name || "Site Kalimantan"));
    setStructuredRecs(AIOrchestrator.getStructuredRecommendations(activeSite?.name || "Site Kalimantan"));
  }, [company?.id, currentUser?.id, activeSite?.id]);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadData = async () => {
    const companyId = company?.id || "comp-1";
    const userId = currentUser?.id || "usr-1";
    const siteId = activeSite?.id || "site-1";

    const convs = await aiRepo.getConversations(companyId, userId);
    if (convs.length === 0) {
      const defaultConv: AIConversationRecord = {
        id: "conv-default",
        companyId,
        siteId,
        userId,
        title: "Operasional & Produksi Today",
        isArchived: false,
        messagesCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await aiRepo.saveConversation(defaultConv);
      setConversations([defaultConv]);
      setActiveConvId("conv-default");
    } else {
      setConversations(convs);
      setActiveConvId(convs[0].id);
    }

    const ins = await aiRepo.getInsights(companyId, siteId);
    setInsights(ins);

    const logs = await aiRepo.getAuditLogs(companyId);
    setAuditLogs(logs);
  };

  const loadMessages = async (convId: string) => {
    const msgs = await aiRepo.getMessages(convId);
    if (msgs.length === 0) {
      const welcomeMsg: AIChatMessageExtended = {
        id: "msg-welcome",
        conversationId: convId,
        sender: "AI",
        text: `### 🧠 AI COMMAND CENTER — MINING OPERATIONS ASSISTANT
Selamat datang, **${currentUser?.fullName || "Engineer"}**! Saya adalah otak utama kecerdasan buatan terpadu untuk operasional **${activeSite?.name || "Site Kalimantan"}** (${company?.name || "Mining Enterprise"}).

Saya menganalisis data secara real-time dari 16 subsistem pertambangan (Produksi, Fleet & FMS, Fuel IoT, Maintenance, Stockpile, Kualitas Lab, Finance, dan HSE).

---

#### 🗣️ Anda dapat langsung bertanya menggunakan Bahasa Indonesia:
- 📉 *"Kenapa produksi hari ini turun?"*
- 🚜 *"Alat mana yang paling tidak produktif?"*
- 📈 *"Berapa estimasi produksi sampai akhir bulan?"*
- ⛽ *"Kenapa fuel consumption meningkat?"*
- 📋 *"Buatkan laporan produksi hari ini."*

*Gunakan tombol pintas di atas kolom input atau ketik pertanyaan spesifik Anda di bawah.*`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        agentName: "MineSmart AI Command Center",
        model: "Gemini 3.6 Flash / Operational Engine",
        evidence: [
          { label: "Coal Production", value: "14,250 MT (95%)", status: "WARNING" },
          { label: "OB Stripping", value: "48,600 BCM (97%)", status: "OK" },
          { label: "Fleet PA", value: "88.5%", status: "WARNING" },
          { label: "Safe Days LTI", value: "342 Hari", status: "OK" },
        ],
        confidence: "High",
        suggestedFollowups: [
          "Kenapa produksi hari ini turun?",
          "Alat mana yang paling tidak produktif?",
          "Berapa estimasi produksi sampai akhir bulan?",
          "Kenapa fuel consumption meningkat?",
          "Buatkan laporan produksi hari ini.",
        ],
        sources: [
          { module: "Modul Produksi", label: "Production Consolidation", period: "Hari Ini", siteName: activeSite?.name || "Site Kalimantan" },
          { module: "Modul Fleet", label: "Fleet PA/UA Ledger", period: "Real-time", siteName: activeSite?.name || "Site Kalimantan" },
        ],
      };
      setMessages([welcomeMsg]);
    } else {
      setMessages(msgs);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText("");
    const userMsg: AIChatMessageExtended = {
      id: "msg-u-" + Date.now(),
      conversationId: activeConvId,
      sender: "USER",
      text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    await aiRepo.saveMessage(userMsg);
    setLoading(true);

    try {
      // Process through AI Copilot Service / Orchestrator
      const aiReply = await AICopilotService.sendMessage({
        message: text,
        conversationId: activeConvId,
        context: {
          companyId: company?.id || "comp-1",
          companyName: company?.name || "PT Batubara Nusa Utama",
          siteId: activeSite?.id || "site-1",
          siteName: activeSite?.name || "Site Kalimantan",
          userId: currentUser?.id || "usr-1",
          userName: currentUser?.fullName || "Site User",
          userRole: currentUser?.role || "MINING_OWNER",
        },
      });

      setMessages((prev) => [...prev, aiReply]);

      // Update conversation timestamp
      const conv = conversations.find((c) => c.id === activeConvId);
      if (conv) {
        conv.updatedAt = new Date().toISOString();
        conv.messagesCount = (conv.messagesCount || 0) + 2;
        await aiRepo.saveConversation(conv);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMsg: AIChatMessageExtended = {
        id: "msg-err-" + Date.now(),
        conversationId: activeConvId,
        sender: "AI",
        text: "⚠️ Terjadi kendala saat memproses analisis AI. Sistem mengembalikan data grounded dari cache lokal.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        agentName: "MineSmart AI Command Center",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    const newConv: AIConversationRecord = {
      id: "conv-" + Date.now(),
      companyId: company?.id || "comp-1",
      siteId: activeSite?.id || "site-1",
      userId: currentUser?.id || "usr-1",
      title: `Analisis Tambang ${conversations.length + 1}`,
      isArchived: false,
      messagesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await aiRepo.saveConversation(newConv);
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await aiRepo.deleteConversation(id);
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeConvId === id && updated.length > 0) {
      setActiveConvId(updated[0].id);
    }
  };

  const handleRenameChat = async (id: string) => {
    if (!editingTitle.trim()) return;
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      conv.title = editingTitle;
      await aiRepo.saveConversation(conv);
      setConversations([...conversations]);
    }
    setEditingConvId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeakingId === id) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_\[\]()]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      setIsSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExecuteAction = (actionId: string, title: string) => {
    setExecutedActions((prev) => ({ ...prev, [actionId]: true }));
    alert(`✅ Rekomendasi "${title}" telah disetujui dan instruksi kerja telah diteruskan ke modul terkait.`);
  };

  const handleSimulate = () => {
    const res = toolSimulateWhatIf(whatIfParams);
    setWhatIfResult(res);
  };

  const handleKBSearch = (term: string) => {
    setKbSearch(term);
    const docs = toolGetKnowledgeBaseDocs(term);
    setKbDocs(docs);
  };

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSignals = autoSignals.filter(
    (s) => selectedSignalCategory === "ALL" || s.category === selectedSignalCategory
  );

  const filteredRecommendations = structuredRecs.filter(
    (r) => selectedRecPriority === "ALL" || r.priority === selectedRecPriority
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Navy Blue Theme */}
      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase border border-emerald-500/30">
                Core Mining Intelligence Engine
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-300 font-semibold">{activeSite?.name || "Site Kalimantan"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Bot className="h-8 w-8 text-emerald-400" />
              <span>AI COMMAND CENTER</span>
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Otak utama operasional pertambangan batubara cerdas. Menganalisis data lintas modul, mendeteksi 9 sinyal anomali operasional, dan merumuskan rekomendasi tindakan terstruktur (*Problem → Root Cause → Recommendation → Expected Impact*).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Ekspor Laporan Harian</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("INSIGHTS");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
            >
              <Activity className="h-4 w-4" />
              <span>Live AI Monitor ({autoSignals.length})</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 scrollbar-none">
          {[
            { key: "PILLARS", label: "10 Core AI Pillars", icon: Sparkles, badge: "10 AI" },
            { key: "CHAT", label: "AI Mining Assistant", icon: Bot, badge: undefined },
            { key: "INSIGHTS", label: "AI Auto-Insight Engine", icon: Activity, badge: autoSignals.length },
            { key: "RECOMMENDATIONS", label: "AI Recommendation Matrix", icon: CheckCircle2, badge: structuredRecs.length },
            { key: "WHAT_IF", label: "Simulasi What-If", icon: Sliders, badge: undefined },
            { key: "KNOWLEDGE", label: "SOP & Knowledge Base", icon: BookOpen, badge: undefined },
            { key: "AUDIT", label: "Audit & Observabilitas", icon: ShieldCheck, badge: undefined },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shrink-0 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-700/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-slate-950" : "text-emerald-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? "bg-slate-950 text-emerald-400" : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB 0: 10 CORE AI PILLARS SUITE */}
      {activeTab === "PILLARS" && (
        <AIMiningCorePillarsSuite
          onOpenAICopilot={() => setActiveTab("CHAT")}
          onNavigateModule={(mod) => {
            if ((window as any).__NAVIGATE_MODULE__) {
              (window as any).__NAVIGATE_MODULE__(mod);
            }
          }}
        />
      )}

      {/* 3. TAB 1: CHAT MAIN VIEW (AI Mining Assistant) */}
      {activeTab === "CHAT" && (
        <div className="space-y-4">
          {/* Quick Action Indonesian Pills */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Pertanyaan Populer Operasional Tambang (Bahasa Indonesia):
              </span>
              <span className="text-[10px] text-slate-400">Klik untuk langsung menganalisis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {quickIndonesianPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.label)}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${p.color}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar: Conversations */}
            <div className="lg:col-span-1 space-y-4">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Percakapan Baru</span>
              </button>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari percakapan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                  {filteredConvs.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                        activeConvId === conv.id
                          ? "bg-slate-800 border border-emerald-500/40 text-emerald-300 font-extrabold"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Bot className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {editingConvId === conv.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameChat(conv.id)}
                            onBlur={() => handleRenameChat(conv.id)}
                            className="bg-slate-950 text-white px-2 py-0.5 rounded text-xs w-full focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="truncate">{conv.title}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingConvId(conv.id);
                            setEditingTitle(conv.title);
                          }}
                          className="text-slate-400 hover:text-white p-1"
                          title="Ubah Nama"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(conv.id, e)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Quick Presets */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 space-y-2.5 shadow-lg">
                <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block">
                  Pusat Analisis Spesifik:
                </span>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => handleSend("Bagaimana kondisi tambang hari ini?")}
                    className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-extrabold border border-amber-500/40 flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>👔 Briefing Direktur (Status Hari Ini)</span>
                  </button>

                  <button
                    onClick={() => handleSend("Kenapa produksi hari ini tidak mencapai target?")}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 flex items-center gap-2 transition-all"
                  >
                    <Compass className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Produksi & Pit Target</span>
                  </button>

                  <button
                    onClick={() => handleSend("Alat mana yang paling tidak produktif hari ini?")}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-amber-300 flex items-center gap-2 transition-all"
                  >
                    <Truck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Fleet PA/UA & Downtime</span>
                  </button>

                  <button
                    onClick={() => handleSend("Kenapa fuel consumption meningkat hari ini?")}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-teal-300 flex items-center gap-2 transition-all"
                  >
                    <Fuel className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                    <span>Fuel Ratio & Anomali Solar</span>
                  </button>

                  <button
                    onClick={() => handleSend("Berapa estimasi produksi batubara sampai akhir bulan?")}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-purple-300 flex items-center gap-2 transition-all"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>Proyeksi RKAB Akhir Bulan</span>
                  </button>

                  <button
                    onClick={() => handleSend("Buatkan laporan produksi hari ini lengkap.")}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-rose-300 flex items-center gap-2 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Daily Production Executive Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Chat Panel */}
            <div className="lg:col-span-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 flex flex-col h-[680px] shadow-2xl overflow-hidden relative">
              {/* Grounding & Data Freshness Bar */}
              <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-extrabold text-slate-200">Data Grounding Active:</span>
                  <span className="text-emerald-400 font-bold">16 Mining Modules Synced</span>
                </div>
                <div>Site: <strong className="text-white">{activeSite?.name || "Site Kalimantan"}</strong> | Role: <strong className="text-slate-300">{currentUser?.role || "MINING_OWNER"}</strong></div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === "USER" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-black text-xs ${
                        msg.sender === "USER"
                          ? "bg-amber-500 text-slate-950 font-black shadow-md"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {msg.sender === "USER" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Chat Content Bubble */}
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === "USER"
                          ? "bg-amber-500 text-slate-950 font-semibold rounded-tr-none shadow-md"
                          : "bg-slate-800/95 border border-slate-700/80 text-slate-200 rounded-tl-none space-y-4 shadow-xl"
                      }`}
                    >
                      {/* Header line for AI Agent */}
                      {msg.sender === "AI" && (
                        <div className="flex items-center justify-between pb-2 border-b border-slate-700/50 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-emerald-400">{msg.agentName}</span>
                            {msg.confidence && (
                              <span className="rounded bg-slate-950 px-2 py-0.5 text-[9px] font-bold text-slate-400 border border-slate-800">
                                Grounding: {msg.confidence}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSpeak(msg.id, msg.text)}
                              className="text-slate-400 hover:text-amber-400 transition-colors"
                              title="Text to Speech (Bahasa Indonesia)"
                            >
                              <Volume2
                                className={`h-3.5 w-3.5 ${
                                  isSpeakingId === msg.id ? "text-amber-400 animate-bounce" : ""
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="text-slate-400 hover:text-white transition-colors"
                              title="Salin Teks"
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Main Markdown Text */}
                      <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-100">{msg.text}</div>

                      {/* Evidence Card Grid */}
                      {msg.evidence && msg.evidence.length > 0 && (
                        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 space-y-2">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            📊 Bukti Data & Metrik Kunci Terintegrasi:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {msg.evidence.map((e, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
                              >
                                <span className="text-[9px] text-slate-400">{e.label}</span>
                                <span
                                  className={`text-xs font-black mt-1 ${
                                    e.status === "CRITICAL"
                                      ? "text-rose-400"
                                      : e.status === "WARNING"
                                      ? "text-amber-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  {e.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Potential Drivers / Root Causes */}
                      {msg.potentialDrivers && msg.potentialDrivers.length > 0 && (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 space-y-1.5">
                          <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                            ⚠️ Potensi Faktor Penyebab Utama (Root Cause Candidate):
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                            {msg.potentialDrivers.map((pd, idx) => (
                              <li key={idx}>{pd}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations List */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 space-y-2">
                          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                            💡 Rekomendasi Solusi AI (*Problem → Root Cause → Solution → Impact*):
                          </span>
                          <div className="space-y-2">
                            {msg.recommendations.map((rec, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-200 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-white">{rec.text}</p>
                                  {rec.expectedImpact && (
                                    <span className="text-[10px] text-amber-300 font-bold block">
                                      📈 Dampak Ekspektasi: {rec.expectedImpact}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Proposal Card */}
                      {msg.actionProposal && (
                        <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-3.5 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                            <Zap className="h-4 w-4" />
                            <span>AI Propose Action (Konfirmasi Eksekusi Dispatch):</span>
                          </div>
                          <p className="text-xs text-slate-300">{msg.actionProposal.description}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => alert("Instruksi Rebalance Dispatch disetujui & dicatat pada Audit Log.")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110"
                            >
                              Setujui & Eksekusi Dispatch
                            </button>
                            <button
                              onClick={() => alert("Action proposal telah dibatalkan.")}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 font-bold text-xs hover:bg-slate-700"
                            >
                              Abaikan
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Sources & Multi-Module Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="text-slate-400 font-extrabold">Sumber Data Terverifikasi:</span>
                          {msg.sources.map((s, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
                            >
                              <Info className="h-3 w-3 text-emerald-400" />
                              <span className="font-bold text-white">{s.module}</span>
                              <span className="text-slate-400">({s.label})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Followups */}
                      {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-bold">Rekomendasi Pertanyaan:</span>
                          {msg.suggestedFollowups.map((sf, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(sf)}
                              className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-emerald-300 hover:bg-slate-700 transition-all"
                            >
                              • {sf}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="text-[9px] opacity-60 text-right">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-spin">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 px-4 py-3 text-xs text-emerald-400 font-bold animate-pulse">
                      AI Command Center sedang menganalisis data lintas modul & melakukan cross-verification...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-950/90 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tanya AI dalam Bahasa Indonesia (contoh: Kenapa produksi hari ini turun?)..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span>Kirim</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: AI AUTO-INSIGHT ENGINE (Otomatis Mendeteksi 9 Sinyal Operasional) */}
      {activeTab === "INSIGHTS" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                <span>AI Auto-Insight Engine: Deteksi Otomatis 9 Sinyal Kritis</span>
              </h2>
              <p className="text-xs text-slate-300">
                Sistem AI terus-menerus mengaudit telematika pit, dispenser bahan bakar, FMS hauling, lab batubara, dan register K3 untuk mendeteksi penyimpangan dari baseline target.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {["ALL", "PRODUKSI", "FLEET", "FUEL", "LOGISTIK", "STOCKPILE", "QUALITY", "HSE"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSignalCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSignalCategory === cat
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 9 Signals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSignals.map((sig) => {
              const isCritical = sig.severity === "CRITICAL";
              const isHigh = sig.severity === "HIGH";

              return (
                <div
                  key={sig.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                    isCritical
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-100"
                      : isHigh
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-100"
                      : "bg-slate-900/90 border-slate-700/80 text-slate-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          isCritical
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : isHigh
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        }`}
                      >
                        {sig.severity} • {sig.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{sig.detectedAt}</span>
                    </div>

                    <h3 className="text-sm font-black text-white leading-snug">{sig.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{sig.rootCauseSummary}</p>
                  </div>

                  {/* Metrics Box */}
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{sig.metricLabel}:</span>
                      <span className="font-black text-white">{sig.currentValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Target / Baseline:</span>
                      <span className="font-bold text-slate-300">{sig.baselineValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Deviasi:</span>
                      <span
                        className={`font-black ${
                          isCritical ? "text-rose-400" : isHigh ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {sig.deviation}
                      </span>
                    </div>
                  </div>

                  {/* Area and Action Button */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-slate-400">
                      Lokasi: <strong className="text-slate-200">{sig.affectedPitOrArea}</strong>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("CHAT");
                        handleSend(sig.quickActionPrompt);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-1 shadow-md"
                    >
                      <span>Tanya AI</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 3: AI RECOMMENDATION MATRIX (Problem -> Root Cause -> Recommendation -> Expected Impact) */}
      {activeTab === "RECOMMENDATIONS" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>AI Recommendation Engine: Structured 4-Stage Operational Matrix</span>
              </h2>
              <p className="text-xs text-slate-300">
                Formula rekomendasi aksi: <strong>Problem 🚨</strong> ➔ <strong>Root Cause 🔍</strong> ➔ <strong>Recommendation 💡</strong> ➔ <strong>Expected Impact 📈</strong>
              </p>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedRecPriority(prio)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRecPriority === prio
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Cards */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => {
              const isExecuted = !!executedActions[rec.id];

              return (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-xl space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs border border-slate-700">
                        {rec.code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          rec.priority === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : rec.priority === "HIGH"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {rec.priority} PRIORITY
                      </span>
                      <h3 className="text-sm font-black text-white">{rec.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Target Modul:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[10px]">
                        {rec.targetModule}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Flow Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Stage 1: Problem */}
                    <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        1. Problem (Masalah):
                      </span>
                      <p className="text-xs text-rose-100 leading-relaxed">{rec.problem}</p>
                    </div>

                    {/* Stage 2: Root Cause */}
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Search className="h-3.5 w-3.5" />
                        2. Root Cause (Akar Penyebab):
                      </span>
                      <p className="text-xs text-amber-100 leading-relaxed">{rec.rootCause}</p>
                    </div>

                    {/* Stage 3: Recommendation */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        3. Recommendation (Solusi):
                      </span>
                      <p className="text-xs text-cyan-100 leading-relaxed">{rec.recommendation}</p>
                    </div>

                    {/* Stage 4: Expected Impact */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        4. Expected Impact (Dampak):
                      </span>
                      <p className="text-xs text-emerald-100 leading-relaxed font-semibold">{rec.expectedImpact}</p>
                    </div>
                  </div>

                  {/* Action Trigger Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Sumber:</span>
                      {rec.sources.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {s.module}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {isExecuted ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/40">
                          <Check className="h-4 w-4" />
                          <span>Instruksi Telah Diteruskan</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleExecuteAction(rec.id, rec.title)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          <span>{rec.actionLabel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB 4: WHAT-IF SIMULATION */}
      {activeTab === "WHAT_IF" && (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-400" />
              <span>Simulasi Skenario Tambang & Perencanaan Sensitivitas (What-If)</span>
            </h2>
            <p className="text-xs text-slate-300">
              Uji dampak perubahan volume produksi, fluktuasi harga solar, ketersediaan unit armada, dan harga jual batubara terhadap EBITDA operasional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Parameter Simulasi:
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Variasi Volume Produksi Batubara (%):</span>
                    <span className="font-bold text-emerald-400">{whatIfParams.productionVolumeChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={whatIfParams.productionVolumeChangePct}
                    onChange={(e) =>
                      setWhatIfParams({ ...whatIfParams, productionVolumeChangePct: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Fluktuasi Harga Solar Industri (%):</span>
                    <span className="font-bold text-amber-400">{whatIfParams.fuelPriceChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={whatIfParams.fuelPriceChangePct}
                    onChange={(e) =>
                      setWhatIfParams({ ...whatIfParams, fuelPriceChangePct: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Perubahan Ketersediaan Fleet PA (%):</span>
                    <span className="font-bold text-cyan-400">{whatIfParams.fleetAvailabilityChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    value={whatIfParams.fleetAvailabilityChangePct}
                    onChange={(e) =>
                      setWhatIfParams({ ...whatIfParams, fleetAvailabilityChangePct: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Harga Jual Batubara Acuan (USD/MT):</span>
                    <span className="font-bold text-purple-400">${whatIfParams.coalSellingPriceUSD} / MT</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={whatIfParams.coalSellingPriceUSD}
                    onChange={(e) =>
                      setWhatIfParams({ ...whatIfParams, coalSellingPriceUSD: Number(e.target.value) })
                    }
                    className="w-full accent-purple-500"
                  />
                </div>

                <button
                  onClick={handleSimulate}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-md"
                >
                  Jalankan Simulasi Skenario
                </button>
              </div>
            </div>

            {/* Results Output */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Hasil Prediksi Finansial & Operasional:
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Simulasi Output Produksi:</span>
                  <div className="text-sm font-black text-white">
                    {whatIfResult.simulatedCoalMT.toLocaleString()} MT
                  </div>
                  <span className="text-[9px] text-slate-500">Base: {whatIfResult.baseCoalMT.toLocaleString()} MT</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Simulasi Cost / Ton (OPEX):</span>
                  <div className="text-sm font-black text-amber-400">
                    ${whatIfResult.simulatedCostPerTonUSD.toFixed(2)} / MT
                  </div>
                  <span className="text-[9px] text-slate-500">Base: ${whatIfResult.baseCostPerTonUSD.toFixed(2)} / MT</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Estimasi Revenue:</span>
                  <div className="text-sm font-black text-emerald-400">
                    ${(whatIfResult.simulatedRevenueUSD / 1000).toFixed(0)}k USD
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Margin Operasional:</span>
                  <div
                    className={`text-sm font-black ${
                      whatIfResult.simulatedMarginPct >= 20 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {whatIfResult.simulatedMarginPct.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {whatIfResult.summaryText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 5: SOP & KNOWLEDGE BASE RAG */}
      {activeTab === "KNOWLEDGE" && (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <span>Knowledge Base & SOP Pertambangan Terintegrasi (RAG Engine)</span>
              </h2>
              <p className="text-xs text-slate-300">
                Pencarian berbasis semantik terhadap dokumen SOP Kepmen ESDM 1827/2018, Manual Alat, dan Regulasi K3.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari SOP (e.g. Blending, Fuel, HSE)..."
                value={kbSearch}
                onChange={(e) => handleKBSearch(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kbDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{doc.updatedDate}</span>
                </div>

                <h3 className="text-sm font-black text-white">{doc.title}</h3>
                {doc.section && <span className="text-[10px] font-mono text-amber-300 block">{doc.section}</span>}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{doc.content}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("CHAT");
                      handleSend(`Jelaskan prosedur pada dokumen: ${doc.title}`);
                    }}
                    className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Tanya AI tentang SOP ini</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 6: AUDIT & OBSERVABILITAS */}
      {activeTab === "AUDIT" && (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>AI Observability & Interaction Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-300">
              Log audit kepatuhan keamanan enterprise untuk melacak setiap prompt, intent klasifikasi, token, dan alat data yang diakses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-black uppercase text-slate-400">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Prompt</th>
                  <th className="p-3">Intent Terklasifikasi</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850">
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                    </td>
                    <td className="p-3 font-bold text-white">{log.userName}</td>
                    <td className="p-3 max-w-xs truncate">{log.prompt}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-mono">
                        {log.intent}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{log.durationMs} ms</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Report Export Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>Unduh Laporan Produksi Harian</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Format laporan harian telah disesuaikan dengan standar regulasi ESDM Form 04 dan rekapitulasi internal PT Batubara Nusa Utama.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert("Laporan Produksi PDF berhasil di-generate.");
                  setShowReportModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Format PDF (Executive Summary)</span>
              </button>

              <button
                onClick={() => {
                  alert("Laporan Excel (XLSX) berhasil diekspor.");
                  setShowReportModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Format Spreadsheet (Excel Raw Data)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AICopilotModule;
