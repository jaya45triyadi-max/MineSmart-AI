// MINE SMART AI - Enterprise Offline Mode & Conflict Resolution Center
// Real-time Pit Network Simulator, Offline Queue Manager, Auto-Sync & AI Conflict Resolver

import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Database,
  Smartphone,
  Server,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Trash2,
  ArrowRightLeft,
  Settings,
  FileDown,
  Activity,
  HardDrive,
  Cpu,
  Radio,
  Check,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  NetworkConnectivityStatus,
  OfflineRecordType,
  OfflineQueueItem,
  OfflineConflictRecord,
  SyncEngineStats,
  OfflineEngineSettings,
  SyncAuditLogItem,
} from "../../types/offlineSyncTypes";
import {
  OfflineManagerService,
  DEFAULT_OFFLINE_SETTINGS,
} from "../../services/offline/OfflineManagerService";
import { ConflictResolutionModal } from "../../components/offline/ConflictResolutionModal";

export const OfflineSyncCenterModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkConnectivityStatus>("ONLINE");
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [conflicts, setConflicts] = useState<OfflineConflictRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SyncAuditLogItem[]>([]);
  const [stats, setStats] = useState<SyncEngineStats>(OfflineManagerService.getStats());
  const [settings, setSettings] = useState<OfflineEngineSettings>(DEFAULT_OFFLINE_SETTINGS);

  const [activeTab, setActiveTab] = useState<"QUEUE" | "CONFLICTS" | "SETTINGS" | "AUDIT">("QUEUE");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedConflict, setSelectedConflict] = useState<OfflineConflictRecord | null>(null);

  // New Offline Input Simulation Modal State
  const [isQuickInputOpen, setIsQuickInputOpen] = useState<boolean>(false);
  const [quickInputType, setQuickInputType] = useState<OfflineRecordType>("PRODUCTION_RITASE");
  const [quickInputPit, setQuickInputPit] = useState("Pit North Alpha (Front 3)");
  const [quickInputTonnage, setQuickInputTonnage] = useState(98.5);
  const [quickInputOperator, setQuickInputOperator] = useState("Agus Supardi");
  const [quickInputNotes, setQuickInputNotes] = useState("Input saat sinyal tambang hilang di bench bawah");

  const refreshAll = () => {
    setNetworkStatus(OfflineManagerService.getNetworkStatus());
    setQueue(OfflineManagerService.getQueue());
    setConflicts(OfflineManagerService.getConflicts());
    setAuditLogs(OfflineManagerService.getAuditLogs());
    setStats(OfflineManagerService.getStats());
    setSettings(OfflineManagerService.getSettings());
  };

  useEffect(() => {
    OfflineManagerService.initialize();
    refreshAll();

    const unsub = OfflineManagerService.onNetworkChange((status) => {
      setNetworkStatus(status);
      refreshAll();
    });

    return () => unsub();
  }, []);

  // Handlers
  const handleSimulateNetwork = (status: NetworkConnectivityStatus) => {
    OfflineManagerService.setNetworkStatus(status);
    setNetworkStatus(status);
    refreshAll();
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    await OfflineManagerService.triggerAutoSync();
    setIsSyncing(false);
    refreshAll();
  };

  const handleCreateOfflineRecord = () => {
    let title = "";
    let dataPayload: Record<string, any> = {};

    if (quickInputType === "PRODUCTION_RITASE") {
      title = `Haul DT-105 (HD785) • ${quickInputTonnage} MT Coal`;
      dataPayload = {
        pit: quickInputPit,
        material: "COAL",
        grossTonnage: Number(quickInputTonnage),
        loader: "EX-01 (PC2000)",
        hauler: "DT-105 (HD785)",
        destination: "ROM_STOCKPILE_A",
        operator: quickInputOperator,
        notes: quickInputNotes,
        shift: "Shift 1 (Day)",
      };
    } else if (quickInputType === "P2H_INSPECTION") {
      title = `P2H Check Alat Berat DT-208 (CAT 777G)`;
      dataPayload = {
        unitCode: "DT-208 (CAT 777G)",
        hourMeter: 7540.2,
        brakeStatus: "PASS",
        engineStatus: "PASS",
        overallFitness: "FIT_TO_WORK",
        defectNotes: quickInputNotes,
        inspector: quickInputOperator,
      };
    } else if (quickInputType === "HSE_HAZARD") {
      title = `Laporan Bahaya: Jalan Licin & Genangan Air`;
      dataPayload = {
        title: "Genangan lumpur licin di tikungan KM 3.2",
        category: "UNSAFE_CONDITION",
        severity: "HIGH",
        location: quickInputPit,
        reporter: quickInputOperator,
        notes: quickInputNotes,
      };
    } else {
      title = `Pengisian Bahan Bakar Solar 3,500 L`;
      dataPayload = {
        litersDispensed: 3500,
        equipment: "EX-04 (EX1200)",
        fuelMan: quickInputOperator,
        location: quickInputPit,
      };
    }

    OfflineManagerService.enqueue(
      quickInputType,
      `REC-${Date.now().toString().slice(-4)}`,
      title,
      quickInputPit,
      dataPayload,
      quickInputOperator
    );

    setIsQuickInputOpen(false);
    refreshAll();
  };

  const handleResolveConflict = (
    conflictId: string,
    strategy: "KEEP_LOCAL" | "USE_SERVER" | "AI_SMART_MERGE" | "CUSTOM_MERGE",
    resolvedBy: string,
    customData?: Record<string, any>
  ) => {
    OfflineManagerService.resolveConflict(conflictId, strategy, resolvedBy, customData);
    refreshAll();
  };

  const handleExportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      stats: OfflineManagerService.getStats(),
      queue: OfflineManagerService.getQueue(),
      conflicts: OfflineManagerService.getConflicts(),
      auditLogs: OfflineManagerService.getAuditLogs(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `minesmart_offline_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredQueue = queue.filter((item) => {
    if (filterType === "ALL") return true;
    if (filterType === "CONFLICT") return item.status === "CONFLICT";
    if (filterType === "PENDING") return item.status === "QUEUED_LOCAL";
    if (filterType === "SYNCED") return item.status === "SYNCED";
    return item.recordType === filterType;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner: Real-Time Network & Pit Connectivity Simulator */}
      <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl border ${
                networkStatus === "ONLINE"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : networkStatus === "OFFLINE"
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}
            >
              {networkStatus === "ONLINE" ? (
                <Wifi className="w-6 h-6" />
              ) : networkStatus === "OFFLINE" ? (
                <WifiOff className="w-6 h-6" />
              ) : (
                <Radio className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-white">
                  MineSmart Offline & Auto-Sync Engine
                </h1>
                <span
                  className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                    networkStatus === "ONLINE"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : networkStatus === "OFFLINE"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {networkStatus === "ONLINE"
                    ? "🟢 ONLINE (Connected)"
                    : networkStatus === "OFFLINE"
                    ? "🔴 OFFLINE (Pit Sinyal Hilang)"
                    : "🟡 SATELLITE (Slow Bandwidth)"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Penyimpanan lokal *IndexedDB / LocalStorage* otomatis bekerja saat di dalam tambang tanpa sinyal. Sinkronisasi otomatis & resolusi konflik saat online kembali.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsQuickInputOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Data Offline</span>
            </button>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing || networkStatus === "OFFLINE"}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                networkStatus === "OFFLINE"
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
            </button>
          </div>
        </div>

        {/* Network Mode Simulator Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-300">Simulasi Konektivitas Pit Tambang:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ONLINE", label: "🟢 4G / Wi-Fi Stabil", desc: "Online Penuh" },
              { id: "SATELLITE_SLOW", label: "🟡 Satelit / Low Bandwidth", desc: "Lambat" },
              { id: "OFFLINE", label: "🔴 Offline (Front Tambang Bawah)", desc: "Tanpa Sinyal" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleSimulateNetwork(mode.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  networkStatus === mode.id
                    ? "bg-slate-800 text-white border border-purple-500/50 shadow"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            Total Antrean Lokal
          </span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {stats.totalQueued} <span className="text-xs text-slate-400 font-normal">Item</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {stats.pendingSync} pending &bull; {stats.syncedCount} synced
          </span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            Konflik Data (Local vs Server)
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            {stats.conflictCount} <span className="text-xs text-slate-400 font-normal">Kasus</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono">
            Butuh verifikasi / AI merge
          </span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Tersinkronisasi Master
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
            {stats.syncedCount} <span className="text-xs text-slate-400 font-normal">Data</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">
            Idempotency Verified
          </span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            Penggunaan Storage
          </span>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
            {stats.storageUsedKB} <span className="text-xs text-slate-400 font-normal">KB</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Kapasitas lokal &lt; 0.1%
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "QUEUE", label: "Antrean Sinkronisasi (Offline Queue)", icon: Layers, badge: stats.pendingSync },
            { id: "CONFLICTS", label: "Resolusi Konflik (Local vs Server)", icon: ArrowRightLeft, badge: stats.conflictCount },
            { id: "SETTINGS", label: "Konfigurasi Auto-Sync", icon: Settings },
            { id: "AUDIT", label: "Jejak Audit Sinkronisasi", icon: Clock },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleExportBackup}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Export Backup JSON</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OFFLINE QUEUE
          ========================================================================= */}
      {activeTab === "QUEUE" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-bold mr-1">Filter Modul:</span>
              {[
                { id: "ALL", label: "Semua" },
                { id: "PRODUCTION_RITASE", label: "Ritase Produksi" },
                { id: "P2H_INSPECTION", label: "Inspeksi P2H" },
                { id: "HSE_HAZARD", label: "HSE Bahaya" },
                { id: "FUEL_DISPENSE", label: "Fuel Log" },
                { id: "CONFLICT", label: "⚠️ Konflik Saja" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterType(btn.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterType === btn.id
                      ? "bg-purple-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                OfflineManagerService.clearCompleted();
                refreshAll();
              }}
              className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus yang Sudah Ter-sync</span>
            </button>
          </div>

          {/* Queue Items List */}
          <div className="space-y-3">
            {filteredQueue.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="font-bold text-white">Tidak ada antrean pending!</p>
                <p className="text-xs">Semua data lapangan telah tersinkronisasi aman ke database master.</p>
              </div>
            ) : (
              filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 bg-slate-900 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    item.status === "CONFLICT"
                      ? "border-amber-500/50 bg-amber-950/10"
                      : item.status === "SYNCED"
                      ? "border-emerald-500/30"
                      : "border-slate-800 hover:border-purple-500/40"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
                          item.recordType === "PRODUCTION_RITASE"
                            ? "bg-amber-500/20 text-amber-300"
                            : item.recordType === "P2H_INSPECTION"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : item.recordType === "HSE_HAZARD"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {item.recordType}
                      </span>

                      <h4 className="text-sm font-black text-white">{item.entityTitle}</h4>

                      {/* Status Badges */}
                      {item.status === "QUEUED_LOCAL" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                          📱 Disimpan Lokal (Offline)
                        </span>
                      )}
                      {item.status === "SYNCING" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse font-bold">
                          🔄 Mengunggah...
                        </span>
                      )}
                      {item.status === "CONFLICT" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Konflik Versi Master
                        </span>
                      )}
                      {item.status === "SYNCED" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          ✓ Ter-sync ke Cloud
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Lokasi: <strong className="text-slate-300">{item.pitLocation}</strong></span>
                      <span>Operator: <strong className="text-slate-300">{item.clientOperator}</strong></span>
                      <span>Idempotency: <code className="text-purple-400 font-mono text-[10px]">{item.idempotencyKey}</code></span>
                    </div>

                    {/* Data preview pill list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(item.data).slice(0, 4).map(([k, val]) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                        >
                          {k}: <strong>{typeof val === "object" ? JSON.stringify(val) : String(val)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "CONFLICT" && item.conflictId && (
                      <button
                        onClick={() => {
                          const c = conflicts.find((conf) => conf.conflictId === item.conflictId);
                          if (c) setSelectedConflict(c);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>Selesaikan Konflik</span>
                      </button>
                    )}

                    {item.status === "QUEUED_LOCAL" && (
                      <button
                        onClick={handleTriggerSync}
                        disabled={networkStatus === "OFFLINE"}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync Item</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        OfflineManagerService.deleteQueueItem(item.id);
                        refreshAll();
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Hapus antrean"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CONFLICTS RESOLVER CENTER
          ========================================================================= */}
      {activeTab === "CONFLICTS" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-black text-amber-300">
                Deteksi Konflik Multi-Operator & Multi-Device
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Konflik terjadi ketika data yang diubah saat offline berbeda dengan data terbaru di server master (misal: Dispatcher merevisi tonase di jembatan timbang saat Foreman menginput di pit). Gunakan **Side-by-Side Diff** atau **AI Smart Merge** untuk menyelesaikannya.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {conflicts.map((conf) => (
              <div
                key={conf.conflictId}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{conf.title}</h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          conf.status === "UNRESOLVED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {conf.status === "UNRESOLVED" ? "⚠️ Belum Diselesaikan" : "✓ Terselesaikan"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Entitas: <span className="text-purple-300 font-bold">{conf.entityName}</span> &bull; Terdeteksi: {conf.detectedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedConflict(conf)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Buka Resolver Diff</span>
                    </button>
                  </div>
                </div>

                {/* Conflict Quick Field Diff Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {conf.fieldDiffs.map((diff) => (
                    <div
                      key={diff.fieldName}
                      className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{diff.fieldLabel}</span>
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-purple-400">📱 {String(diff.localValue)}</span>
                        <span className="text-slate-600">vs</span>
                        <span className="text-cyan-400">🌐 {String(diff.serverValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Merge Quick Suggestion */}
                {conf.aiMergeSuggestion && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">
                        AI Smart Merge: Akurasi {conf.aiMergeSuggestion.confidence}%
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleResolveConflict(conf.conflictId, "AI_SMART_MERGE", "AI Auto-Resolver");
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                    >
                      Terapkan Instan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ENGINE SETTINGS
          ========================================================================= */}
      {activeTab === "SETTINGS" && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 max-w-3xl">
          <div>
            <h3 className="text-sm font-black text-white">Konfigurasi Sinkronisasi & Kebijakan Konflik</h3>
            <p className="text-xs text-slate-400">Atur strategi otomatisasi saat internet pulih kembali.</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Auto Sync Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Auto-Sync saat Sinyal Kembali (Auto Reconnect)</span>
                <span className="text-[11px] text-slate-400">
                  Secara otomatis memulai proses sinkronisasi antrean saat koneksi online terdeteksi.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSyncOnOnline}
                onChange={(e) => {
                  const updated = OfflineManagerService.updateSettings({
                    autoSyncOnOnline: e.target.checked,
                  });
                  setSettings(updated);
                }}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* AI Smart Merge Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-emerald-300 block">AI Smart Merge Assistant</span>
                <span className="text-[11px] text-slate-400">
                  Gunakan model Gemini untuk menganalisis dan menggabungkan field konflik secara cerdas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAISmartMerge}
                onChange={(e) => {
                  const updated = OfflineManagerService.updateSettings({
                    enableAISmartMerge: e.target.checked,
                  });
                  setSettings(updated);
                }}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Default Conflict Policy */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Kebijakan Default Resolusi Konflik:</span>
              <select
                value={settings.defaultConflictPolicy}
                onChange={(e) => {
                  const updated = OfflineManagerService.updateSettings({
                    defaultConflictPolicy: e.target.value as any,
                  });
                  setSettings(updated);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-xs"
              >
                <option value="MANUAL_PROMPT">Tanyakan Manual (Side-by-Side Diff)</option>
                <option value="LAST_WRITE_WINS">Last Write Wins (Waktu Terkini Menang)</option>
                <option value="CLIENT_WINS">Prioritaskan Input Lokal Lapangan (Client Wins)</option>
                <option value="SERVER_WINS">Prioritaskan Master Cloud (Server Wins)</option>
                <option value="AI_AUTO_MERGE">Otomatis Gabung dengan AI (AI Auto Merge)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                OfflineManagerService.resetSampleData();
                refreshAll();
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo Tambang</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: AUDIT TRAIL
          ========================================================================= */}
      {activeTab === "AUDIT" && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-white">Jejak Audit Sinkronisasi Tambang</h3>
            <span className="text-[10px] font-mono text-slate-500">50 Catatan Terakhir</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        log.action === "SYNC_SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : log.action === "CONFLICT_DETECTED"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-slate-200 font-bold">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Oleh: {log.operator} &bull; Mode: {log.networkMode}
                  </span>
                </div>

                <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: QUICK OFFLINE INPUT SIMULATOR
          ========================================================================= */}
      {isQuickInputOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>Simulasi Input Data (Mode Offline)</span>
              </div>
              <button
                onClick={() => setIsQuickInputOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block text-[10px] font-bold mb-1">Jenis Modul:</label>
                <select
                  value={quickInputType}
                  onChange={(e) => setQuickInputType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-xs"
                >
                  <option value="PRODUCTION_RITASE">Ritase Produksi (Haul Truck / Coal)</option>
                  <option value="P2H_INSPECTION">Inspeksi Harian P2H Alat Berat</option>
                  <option value="HSE_HAZARD">Pelaporan Bahaya K3 (Hazard Hunting)</option>
                  <option value="FUEL_DISPENSE">Pencatatan Refueling Bahan Bakar</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] font-bold mb-1">Lokasi Front / Pit:</label>
                <input
                  type="text"
                  value={quickInputPit}
                  onChange={(e) => setQuickInputPit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              {quickInputType === "PRODUCTION_RITASE" && (
                <div>
                  <label className="text-slate-400 block text-[10px] font-bold mb-1">Gross Tonnage (Ton):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={quickInputTonnage}
                    onChange={(e) => setQuickInputTonnage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 block text-[10px] font-bold mb-1">Nama Operator / Pengawas:</label>
                <input
                  type="text"
                  value={quickInputOperator}
                  onChange={(e) => setQuickInputOperator(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] font-bold mb-1">Catatan Tambahan:</label>
                <textarea
                  rows={2}
                  value={quickInputNotes}
                  onChange={(e) => setQuickInputNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsQuickInputOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreateOfflineRecord}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Simpan Lokal (Offline)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Conflict Resolution Modal */}
      {selectedConflict && (
        <ConflictResolutionModal
          conflict={selectedConflict}
          isOpen={true}
          onClose={() => setSelectedConflict(null)}
          onResolve={handleResolveConflict}
        />
      )}
    </div>
  );
};
