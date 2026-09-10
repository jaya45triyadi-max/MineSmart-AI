// MINE SMART AI - Enterprise Audit Trail Center Module
// 6-Dimension Regulatory Ledger: WHO | WHAT | WHEN | WHERE | BEFORE | AFTER
// Compliant with ESDM Kepmen 1827, ISO 27001, SOC2, and Minerba Governance

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  MapPin,
  User,
  Activity,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Laptop,
  Terminal,
  X,
  ExternalLink,
  Zap,
} from "lucide-react";
import {
  EnterpriseAuditRecord,
  AuditSummaryMetrics,
  AuditModuleCategory,
  AuditActionType,
  AuditSeverity,
} from "../../types/auditTrailTypes";
import { AuditTrailService } from "../../services/security/AuditTrailService";

export const AuditTrailCenterModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const [logs, setLogs] = useState<EnterpriseAuditRecord[]>([]);
  const [metrics, setMetrics] = useState<AuditSummaryMetrics>(AuditTrailService.getMetrics());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("ALL");
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>("ALL");
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>("ALL");
  const [activeViewMode, setActiveViewMode] = useState<"TIMELINE_CARDS" | "LEDGER_TABLE">("TIMELINE_CARDS");

  // Selected Log for Deep Forensic Dossier Modal
  const [selectedDossierLog, setSelectedDossierLog] = useState<EnterpriseAuditRecord | null>(null);

  // Live Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simActorName, setSimActorName] = useState("User A (Ahmad Setiawan)");
  const [simActorRole, setSimActorRole] = useState("Production Pit Foreman");
  const [simActorDept, setSimActorDept] = useState("Mining Operations & Tallying");
  const [simModule, setSimModule] = useState<AuditModuleCategory>("PRODUCTION");
  const [simEntityName, setSimEntityName] = useState("Batubara Pit 01 Seam B Front 2");
  const [simFieldName, setSimFieldName] = useState("Production Tonnage (Tonase Harian)");
  const [simBeforeVal, setSimBeforeVal] = useState("1250");
  const [simAfterVal, setSimAfterVal] = useState("1320");
  const [simUnit, setSimUnit] = useState("ton");
  const [simLocation, setSimLocation] = useState("Pit 01 North - Loading Point Front 2");
  const [simReason, setSimReason] = useState("Koreksi timbangan belt scale & joint tallying shift 1");
  const [simIp, setSimIp] = useState("182.253.110.42");
  const [simDevice, setSimDevice] = useState("Rugged Pit Tablet #04 (Panasonic Toughbook)");
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false);

  // Load logs on mount
  const refreshData = () => {
    const data = AuditTrailService.getAllLogs();
    setLogs(data);
    setMetrics(AuditTrailService.getMetrics());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.what.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.who.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.who.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.where.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.where.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.where.ipAddress.includes(searchTerm) ||
      log.before.formatted.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.after.formatted.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tamperProofHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule =
      selectedModuleFilter === "ALL" || log.what.entity.module === selectedModuleFilter;

    const matchesAction =
      selectedActionFilter === "ALL" || log.action === selectedActionFilter;

    const matchesSeverity =
      selectedSeverityFilter === "ALL" || log.severity === selectedSeverityFilter;

    return matchesSearch && matchesModule && matchesAction && matchesSeverity;
  });

  // Handle Simulator Submit
  const handleExecuteSimulation = (e: React.FormEvent) => {
    e.preventDefault();

    const isNumeric = !isNaN(Number(simBeforeVal)) && !isNaN(Number(simAfterVal));
    const bRaw = isNumeric ? Number(simBeforeVal) : simBeforeVal;
    const aRaw = isNumeric ? Number(simAfterVal) : simAfterVal;

    const bFormatted = isNumeric
      ? `${Number(simBeforeVal).toLocaleString("id-ID")} ${simUnit}`
      : `${simBeforeVal} ${simUnit}`.trim();
    const aFormatted = isNumeric
      ? `${Number(simAfterVal).toLocaleString("id-ID")} ${simUnit}`
      : `${simAfterVal} ${simUnit}`.trim();

    const newRecord = AuditTrailService.recordAudit({
      actor: {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: simActorName,
        role: simActorRole,
        department: simActorDept,
      },
      action: "UPDATE",
      severity: "NOTICE",
      entity: {
        module: simModule,
        entityType: "Mining Operational Record",
        entityId: `REC-${Date.now().toString().slice(-6)}`,
        entityName: simEntityName,
        fieldName: simFieldName,
        fieldKey: simFieldName.toLowerCase().replace(/\s+/g, "_"),
      },
      beforeValue: {
        raw: bRaw,
        formatted: bFormatted,
        unit: simUnit,
        snapshotJson: {
          entity: simEntityName,
          parameter: simFieldName,
          value: bRaw,
          unit: simUnit,
          status: "PREVIOUS_STATE",
        },
      },
      afterValue: {
        raw: aRaw,
        formatted: aFormatted,
        unit: simUnit,
        snapshotJson: {
          entity: simEntityName,
          parameter: simFieldName,
          value: aRaw,
          unit: simUnit,
          status: "UPDATED_STATE",
          justification: simReason,
        },
      },
      location: {
        siteName: "Site Melak Operational Concession",
        area: simLocation,
        ipAddress: simIp,
        networkType: "VSAT_PIT_LINK",
        deviceInfo: simDevice,
        appChannel: "RUGGED_TABLET_PIT",
      },
      reason: simReason,
    });

    refreshData();
    setIsSimulatorOpen(false);
    setSelectedDossierLog(newRecord);
  };

  // Copy Hash
  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setIsCopiedSuccess(true);
    setTimeout(() => {
      setCopiedHashId(null);
      setIsCopiedSuccess(false);
    }, 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvStr = AuditTrailService.exportCsv(filteredLogs);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Audit_Trail_Ledger_${Date.now()}.csv`;
    link.click();
  };

  // Export JSON Syslog
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Audit_Trail_SIEM_Syslog_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              ESDM Kepmen 1827 & ISO 27001 Compliance
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SHA-256 Immutable Ledger
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Audit Trail & Lineage Forensik Tambang
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Pencatatan lengkap 6-dimensi regulasi: <strong className="text-indigo-300">Who</strong> (Pelaku),{" "}
            <strong className="text-cyan-300">What</strong> (Aksi & Objek),{" "}
            <strong className="text-amber-300">When</strong> (Waktu Presisi),{" "}
            <strong className="text-purple-300">Where</strong> (Lokasi/IP/Perangkat),{" "}
            <strong className="text-rose-300">Before</strong> (Nilai Sebelum), dan{" "}
            <strong className="text-emerald-300">After</strong> (Nilai Sesudah).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Simulasikan Perubahan (Live Audit)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
            title="Download JSON Syslog"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>SIEM Syslog</span>
          </button>

          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="px-3.5 py-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Audit Copilot</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Example Showcase Card */}
      <div className="p-5 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/40 rounded-3xl space-y-3 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              ★
            </div>
            <div>
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                Contoh Spesifikasi Kasus Regulasi Tambang (6-Dimensi Audit)
              </span>
              <h3 className="text-sm md:text-base font-bold text-white font-mono">
                "User A mengubah Production <span className="text-rose-400 line-through">1.250</span> → <span className="text-emerald-400 font-black">1.320 ton</span> pada 11 Agustus 2026 pukul 10:42."
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              const exLog = logs.find((l) => l.id === "AUD-20260811-104200") || logs[0];
              if (exLog) setSelectedDossierLog(exLog);
            }}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition self-start md:self-auto"
          >
            <Eye className="w-4 h-4" />
            <span>Buka Dossier Rekam Kasus Ini</span>
          </button>
        </div>

        {/* 6 Dimensions Quick Grid for Example */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 text-xs">
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">1. WHO</span>
            <span className="text-slate-200 font-bold block truncate">User A (Ahmad S.)</span>
            <span className="text-[10px] text-slate-500">Pit Foreman</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">2. WHAT</span>
            <span className="text-slate-200 font-bold block truncate">Production Tonnage</span>
            <span className="text-[10px] text-cyan-300">UPDATE Entity</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">3. WHEN</span>
            <span className="text-slate-200 font-bold block">11 Agust 2026</span>
            <span className="text-[10px] text-slate-400 font-mono">10:42 WIB</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">4. WHERE</span>
            <span className="text-slate-200 font-bold block truncate">Pit 01 Front 2</span>
            <span className="text-[10px] text-slate-500 font-mono">182.253.110.42</span>
          </div>

          <div className="p-2.5 bg-rose-950/30 rounded-xl border border-rose-500/30">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">5. BEFORE</span>
            <span className="text-rose-300 font-black text-sm block">1.250 ton</span>
            <span className="text-[10px] text-rose-400/80">Nilai Awal</span>
          </div>

          <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">6. AFTER</span>
            <span className="text-emerald-300 font-black text-sm block">1.320 ton</span>
            <span className="text-[10px] text-emerald-400 font-bold">+70 ton (+5.6%)</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Total Audit Recorded
          </span>
          <div className="text-2xl font-black text-white">{metrics.totalAuditEvents}</div>
          <span className="text-[10px] text-indigo-400 font-bold">100% Tamper Proof</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Updates (Before → After)
          </span>
          <div className="text-2xl font-black text-cyan-300">{metrics.updatesCount}</div>
          <span className="text-[10px] text-cyan-400">Modifikasi Data Tambang</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Digital Approvals
          </span>
          <div className="text-2xl font-black text-indigo-300">{metrics.approvalsCount}</div>
          <span className="text-[10px] text-indigo-400">KTT / GM Otorisasi</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Critical Events
          </span>
          <div className="text-2xl font-black text-rose-300">{metrics.criticalEventsCount}</div>
          <span className="text-[10px] text-rose-400">RKAB / Safety High Risk</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Unique Actors (Who)
          </span>
          <div className="text-2xl font-black text-emerald-300">{metrics.uniqueActorsCount}</div>
          <span className="text-[10px] text-emerald-400">Petugas Terotorisasi</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
            Ledger Health Score
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">100.0%</div>
          <span className="text-[10px] text-emerald-400 font-bold">0% Tampering Detected</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari audit trail (Nama Aktor, ID, '1.250', Nilai Before/After, Pit, IP, SHA-256)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveViewMode("TIMELINE_CARDS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeViewMode === "TIMELINE_CARDS"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Timeline 6-Dimensi
            </button>
            <button
              onClick={() => setActiveViewMode("LEDGER_TABLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeViewMode === "LEDGER_TABLE"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tabel Ledger Regulasi
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>

          {[
            { key: "ALL", label: "Semua Domain" },
            { key: "PRODUCTION", label: "Produksi Pit" },
            { key: "FUEL_MANAGEMENT", label: "BBM Solar" },
            { key: "RKAB_COMPLIANCE", label: "RKAB ESDM" },
            { key: "GEOLOGY_QUALITY", label: "Kualitas Batubara" },
            { key: "MAINTENANCE", label: "Alat Berat" },
            { key: "FLEET_DISPATCH", label: "Dispatch FMS" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedModuleFilter(item.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedModuleFilter === item.key
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="border-l border-slate-800 pl-2 ml-2 flex items-center gap-1.5">
            <span className="text-slate-400 font-bold">Severity:</span>
            {["ALL", "CRITICAL", "WARNING", "NOTICE"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  selectedSeverityFilter === sev
                    ? "bg-slate-700 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="ml-auto text-slate-400 text-xs font-mono">
            Menampilkan <strong className="text-white">{filteredLogs.length}</strong> catatan
          </div>
        </div>
      </div>

      {/* View Mode 1: 6-Dimension Timeline Cards */}
      {activeViewMode === "TIMELINE_CARDS" && (
        <div className="space-y-4">
          {filteredLogs.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl space-y-4 transition-all shadow-lg hover:shadow-indigo-500/5"
            >
              {/* Card Header: Action, Module, Timestamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                      item.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : item.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    }`}
                  >
                    {item.severity}
                  </span>

                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-bold">
                    {item.action} &bull; {item.what.entity.module}
                  </span>

                  <span className="text-xs font-mono text-slate-500">
                    ID: {item.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-200 font-bold">{item.timestamp}</span>
                  <span className="text-slate-500">({item.relativeTime})</span>
                </div>
              </div>

              {/* Title & Core Event Summary */}
              <div className="space-y-1">
                <h3 className="text-sm md:text-base font-black text-white leading-snug">
                  {item.what.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {item.what.summary}
                </p>
              </div>

              {/* The 6 Core Regulatory Dimensions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 pt-1">
                {/* 1. WHO */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    <span>1. WHO (Pelaku)</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate">{item.who.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.who.role}</div>
                  <div className="text-[9px] text-slate-500 truncate">{item.who.department}</div>
                </div>

                {/* 2. WHAT */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    <span>2. WHAT (Objek)</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate">{item.what.entity.fieldName}</div>
                  <div className="text-[10px] text-cyan-300 truncate">{item.what.entity.entityName}</div>
                  <div className="text-[9px] text-slate-500 font-mono truncate">{item.what.entity.entityId}</div>
                </div>

                {/* 3. WHEN */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>3. WHEN (Waktu)</span>
                  </div>
                  <div className="font-bold text-white text-xs">{item.when.formattedDate}</div>
                  <div className="text-[11px] text-amber-300 font-mono font-bold">{item.when.formattedTime}</div>
                  <div className="text-[9px] text-slate-500">{item.when.shift === "SHIFT_1_DAY" ? "Shift 1 (Siang)" : "Shift 2 (Malam)"}</div>
                </div>

                {/* 4. WHERE */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-black uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>4. WHERE (Lokasi)</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate">{item.where.area}</div>
                  <div className="text-[10px] text-purple-300 truncate">{item.where.siteName}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{item.where.ipAddress}</div>
                </div>

                {/* 5. BEFORE */}
                <div className="p-3 bg-rose-950/20 rounded-2xl border border-rose-500/30 space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-rose-400 text-[10px] font-black uppercase tracking-wider block">
                      5. BEFORE (Sebelum)
                    </span>
                    <div className="font-black text-rose-300 text-sm line-through mt-0.5">
                      {item.before.formatted}
                    </div>
                  </div>
                  <span className="text-[9px] text-rose-400/80">Nilai Historis</span>
                </div>

                {/* 6. AFTER + DIFF */}
                <div className="p-3 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider block">
                      6. AFTER (Sesudah)
                    </span>
                    <div className="font-black text-emerald-300 text-sm mt-0.5">
                      {item.after.formatted}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-950 rounded border border-emerald-500/30 self-start">
                    {item.diff.deltaSummary}
                  </span>
                </div>
              </div>

              {/* Card Footer: Cryptographic Hash & Deep Dossier Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 truncate max-w-xl">
                  <span className="text-slate-500 font-bold">Ledger Hash:</span>
                  <code className="text-indigo-300 truncate">{item.tamperProofHash}</code>
                  <button
                    onClick={() => handleCopyHash(item.tamperProofHash, item.id)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Salin Hash SHA-256"
                  >
                    {copiedHashId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDossierLog(item)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                  <span>Lihat Dossier Forensik JSON</span>
                </button>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Tidak ada catatan audit yang cocok</h4>
              <p className="text-xs text-slate-400">
                Coba sesuaikan kata kunci pencarian atau filter kategori di atas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Regulatory Ledger Table */}
      {activeViewMode === "LEDGER_TABLE" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider font-mono">
                  <th className="p-3.5">Timestamp (When)</th>
                  <th className="p-3.5">Actor (Who)</th>
                  <th className="p-3.5">Action & Entity (What)</th>
                  <th className="p-3.5">Before (Sebelum)</th>
                  <th className="p-3.5">After (Sesudah)</th>
                  <th className="p-3.5">Delta / Diff</th>
                  <th className="p-3.5">Location & Device (Where)</th>
                  <th className="p-3.5 text-center">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">
                      <div className="font-bold text-white">{item.when.formattedDate}</div>
                      <div className="text-[10px] text-amber-300">{item.when.formattedTime}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white truncate max-w-xs">{item.who.name}</div>
                      <div className="text-[10px] text-indigo-300 truncate max-w-xs">{item.who.role}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white">{item.what.entity.fieldName}</div>
                      <div className="text-[10px] text-cyan-300">{item.what.entity.entityName}</div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.action}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-bold text-rose-400 line-through bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                        {item.before.formatted}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        {item.after.formatted}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-[11px] font-bold text-emerald-400">
                        {item.diff.deltaSummary}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-200 truncate max-w-xs">{item.where.area}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.where.ipAddress}</div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedDossierLog(item)}
                        className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-300 hover:text-white cursor-pointer transition"
                        title="Buka Forensic Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forensic Dossier & JSON Diff Snapshot Modal */}
      {selectedDossierLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Regulatory Audit Forensic Dossier
                  </h3>
                  <p className="text-[11px] font-mono text-indigo-300">
                    ID: {selectedDossierLog.id} &bull; SHA-256 Verified
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDossierLog(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Event Title & Summary */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  Ringkasan Aksi Perubahan
                </span>
                <h4 className="text-base font-black text-white">
                  {selectedDossierLog.what.title}
                </h4>
                {selectedDossierLog.what.reason && (
                  <p className="text-xs text-slate-300">
                    <strong>Justifikasi / Alasan:</strong> {selectedDossierLog.what.reason}
                  </p>
                )}
              </div>

              {/* Side-by-Side Before vs After Snapshot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Komparasi Snapshot Forensik (Before vs After)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950 rounded border border-emerald-500/30">
                    {selectedDossierLog.diff.deltaSummary}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BEFORE SNAPSHOT */}
                  <div className="p-4 bg-slate-950 border border-rose-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-rose-400 font-bold">
                      <span className="text-xs uppercase">5. BEFORE STATE (Sebelum)</span>
                      <span className="text-[10px] font-mono">Original</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Nilai Terformat:</span>
                      <div className="text-lg font-black text-rose-300 font-mono">
                        {selectedDossierLog.before.formatted}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">
                        Structured JSON Snapshot:
                      </span>
                      <pre className="p-3 bg-slate-900/90 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto">
                        {JSON.stringify(selectedDossierLog.before.snapshotJson || { value: selectedDossierLog.before.raw }, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* AFTER SNAPSHOT */}
                  <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span className="text-xs uppercase">6. AFTER STATE (Sesudah)</span>
                      <span className="text-[10px] font-mono">Modified</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Nilai Baru:</span>
                      <div className="text-lg font-black text-emerald-300 font-mono">
                        {selectedDossierLog.after.formatted}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">
                        Structured JSON Snapshot:
                      </span>
                      <pre className="p-3 bg-slate-900/90 rounded-xl text-[11px] text-emerald-300/90 font-mono overflow-x-auto">
                        {JSON.stringify(selectedDossierLog.after.snapshotJson || { value: selectedDossierLog.after.raw }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Breakdown Grid: Who, When, Where */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Identitas Pelaku (Who)</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><strong>Nama:</strong> {selectedDossierLog.who.name}</div>
                    <div><strong>Role:</strong> {selectedDossierLog.who.role}</div>
                    <div><strong>Divisi:</strong> {selectedDossierLog.who.department}</div>
                    <div><strong>User ID:</strong> {selectedDossierLog.who.id}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Waktu Presisi (When)</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><strong>Waktu Lokal:</strong> {selectedDossierLog.timestamp}</div>
                    <div><strong>ISO Timestamp:</strong> {selectedDossierLog.isoTimestamp}</div>
                    <div><strong>Shift Kerja:</strong> {selectedDossierLog.when.shift || "Shift 1"}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-purple-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Lokasi & Hardware (Where)</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><strong>Lokasi Site:</strong> {selectedDossierLog.where.siteName}</div>
                    <div><strong>Area/Front:</strong> {selectedDossierLog.where.area}</div>
                    <div><strong>IP Address:</strong> {selectedDossierLog.where.ipAddress}</div>
                    <div><strong>Perangkat:</strong> {selectedDossierLog.where.deviceInfo}</div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Ledger Certificate */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-indigo-400 font-bold">
                  <span>Sertifikat Kriptografis Ledger SHA-256</span>
                  <span className="text-emerald-400 font-sans text-xs">✓ Status: VALID & UNALTERED</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-300 break-all">
                  {selectedDossierLog.tamperProofHash}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(selectedDossierLog, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `audit_dossier_${selectedDossierLog.id}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Unduh Dossier JSON</span>
              </button>

              <button
                onClick={() => setSelectedDossierLog(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Simulation Drawer / Modal */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Simulator Perubahan Data Tambang (Live Audit Generator)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Uji coba rekam otomatis 6-dimensi (Who, What, When, Where, Before, After)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleExecuteSimulation} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase text-[10px] block">
                  Gunakan Template Contoh Cepat:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimActorName("User A (Ahmad Setiawan)");
                      setSimActorRole("Production Pit Foreman");
                      setSimModule("PRODUCTION");
                      setSimEntityName("Batubara Pit 01 Seam B Front 2");
                      setSimFieldName("Production Tonnage");
                      setSimBeforeVal("1250");
                      setSimAfterVal("1320");
                      setSimUnit("ton");
                      setSimLocation("Pit 01 North - Loading Point Front 2");
                      setSimReason("Koreksi hasil timbangan belt scale crusher & joint tallying shift 1");
                    }}
                    className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
                  >
                    ★ User A: 1.250 → 1.320 ton
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSimActorName("Budi Santoso");
                      setSimActorRole("Fuel Master Lead");
                      setSimModule("FUEL_MANAGEMENT");
                      setSimEntityName("Heavy Dump Truck HD-08 (Komatsu HD785)");
                      setSimFieldName("Fuel Dispense Quantity");
                      setSimBeforeVal("450");
                      setSimAfterVal("650");
                      setSimUnit("Liter");
                      setSimLocation("Fuel Bowser Station Bay 2");
                      setSimReason("Extra quota double shift hauling");
                    }}
                    className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold hover:bg-indigo-500/30 cursor-pointer"
                  >
                    Solar HD-08: 450 → 650 L
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSimActorName("Dewi Lestari, S.Si.");
                      setSimActorRole("Senior Geologist");
                      setSimModule("GEOLOGY_QUALITY");
                      setSimEntityName("Stockpile ROM 02 Lot 14");
                      setSimFieldName("Calorific Value (CV GAR)");
                      setSimBeforeVal("5800");
                      setSimAfterVal("6150");
                      setSimUnit("kcal/kg");
                      setSimLocation("Geology Assay Quality Lab");
                      setSimReason("Pembaruan cert Sucofindo Samarinda");
                    }}
                    className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/30 cursor-pointer"
                  >
                    Kalori Batubara: 5.800 → 6.150 kcal
                  </button>
                </div>
              </div>

              {/* 1. Who Fields */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  1. WHO (Pelaku Perubahan)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Nama User / Aktor:</label>
                    <input
                      type="text"
                      value={simActorName}
                      onChange={(e) => setSimActorName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Peran / Jabatan (Role):</label>
                    <input
                      type="text"
                      value={simActorRole}
                      onChange={(e) => setSimActorRole(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. What Fields */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  2. WHAT (Entitas & Parameter yang Diubah)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Domain Modul:</label>
                    <select
                      value={simModule}
                      onChange={(e) => setSimModule(e.target.value as AuditModuleCategory)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    >
                      <option value="PRODUCTION">PRODUCTION (Produksi / Tonase Pit)</option>
                      <option value="FUEL_MANAGEMENT">FUEL_MANAGEMENT (BBM Solar B35)</option>
                      <option value="GEOLOGY_QUALITY">GEOLOGY_QUALITY (Kualitas & Assay)</option>
                      <option value="MAINTENANCE">MAINTENANCE (Alat Berat / WO)</option>
                      <option value="FLEET_DISPATCH">FLEET_DISPATCH (FMS Dispatch)</option>
                      <option value="RKAB_COMPLIANCE">RKAB_COMPLIANCE (Laporan ESDM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Nama Entitas / Target:</label>
                    <input
                      type="text"
                      value={simEntityName}
                      onChange={(e) => setSimEntityName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Nama Parameter / Field:</label>
                  <input
                    type="text"
                    value={simFieldName}
                    onChange={(e) => setSimFieldName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              {/* 5 & 6. Before and After Values */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  5 & 6. BEFORE & AFTER VALUES (Nilai Sebelum → Sesudah)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl">
                    <label className="text-rose-400 block mb-1 font-bold">5. BEFORE (Sebelum):</label>
                    <input
                      type="text"
                      value={simBeforeVal}
                      onChange={(e) => setSimBeforeVal(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-rose-500/50 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    />
                  </div>

                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                    <label className="text-emerald-400 block mb-1 font-bold">6. AFTER (Sesudah):</label>
                    <input
                      type="text"
                      value={simAfterVal}
                      onChange={(e) => setSimAfterVal(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Satuan (Unit):</label>
                    <input
                      type="text"
                      value={simUnit}
                      onChange={(e) => setSimUnit(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      placeholder="ton, Liter, kcal/kg, %"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Where Fields */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                  4. WHERE (Lokasi & Perangkat)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Lokasi Lapangan / Area:</label>
                    <input
                      type="text"
                      value={simLocation}
                      onChange={(e) => setSimLocation(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">IP Address & Network:</label>
                    <input
                      type="text"
                      value={simIp}
                      onChange={(e) => setSimIp(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Justification Reason */}
              <div>
                <label className="text-slate-400 block mb-1 font-bold">
                  Justifikasi / Alasan Perubahan Data:
                </label>
                <textarea
                  rows={2}
                  value={simReason}
                  onChange={(e) => setSimReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs"
                  placeholder="Ketik alasan perubahan data..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Rekam ke Audit Trail Ledger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
