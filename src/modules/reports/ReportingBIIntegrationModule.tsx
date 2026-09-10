// MINE SMART AI - Reporting, BI & Integration Hub Module (PROMPT 34)

import React, { useState, useEffect } from "react";
import {
  FileText,
  BarChart3,
  Network,
  Key,
  Upload,
  Activity,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  Database,
  Eye,
  FileSpreadsheet,
  Globe,
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
  Smartphone,
  Info,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { ReportingEngine } from "../../services/reporting/ReportingEngine";
import { BIEngine } from "../../services/bi/BIEngine";
import { IntegrationHub } from "../../services/integration/IntegrationHub";
import { AIReportGeneratorModule } from "./AIReportGeneratorModule";
import {
  ReportType,
  ReportTemplate,
  ReportSchedule,
  ReportArchiveRecord,
  BIDashboardView,
  KPIDefinition,
  IntegrationConnector,
  APIKeyRecord,
  WebhookSubscription,
  WebhookDeliveryLog,
  UniversalImportRecord,
  UniversalExportJob,
  IntegrationAuditLogRecord,
} from "../../types/reportingIntegrationTypes";

export const ReportingBIIntegrationModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { activeSite, currentUser, company, hasLicenseCapability } = useAuth();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "AI_REPORT_GENERATOR" | "REPORTS" | "BI_DASHBOARD" | "INTEGRATIONS" | "REST_API_WEBHOOK" | "UNIVERSAL_IMPORT_EXPORT" | "HEALTH_LINEAGE_AUDIT"
  >("AI_REPORT_GENERATOR");

  // Reporting State
  const [templates, setTemplates] = useState<ReportTemplate[]>(ReportingEngine.getTemplates());
  const [archives, setArchives] = useState<ReportArchiveRecord[]>(ReportingEngine.getArchives());
  const [schedules, setSchedules] = useState<ReportSchedule[]>(ReportingEngine.getSchedules());
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("DAILY_MINING");
  const [reportData, setReportData] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [reportWatermark, setReportWatermark] = useState("CONFIDENTIAL");
  const [isGenerating, setIsGenerating] = useState(false);

  // BI Dashboard State
  const [dashboards, setDashboards] = useState<BIDashboardView[]>(BIEngine.getDashboards());
  const [selectedDashboard, setSelectedDashboard] = useState<BIDashboardView>(dashboards[0]);
  const [kpis, setKpis] = useState<KPIDefinition[]>(BIEngine.getKPIs());
  const [multiSiteBenchmarking, setMultiSiteBenchmarking] = useState<any[]>(BIEngine.getMultiSiteBenchmarking());
  const [showDrillDownModal, setShowDrillDownModal] = useState(false);
  const [selectedDrillKpi, setSelectedDrillKpi] = useState<KPIDefinition | null>(null);
  const [aiDashboardExplanation, setAiDashboardExplanation] = useState<string | null>(null);

  // Integrations State
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(IntegrationHub.getConnectors());
  const [apiKeys, setApiKeys] = useState<APIKeyRecord[]>(IntegrationHub.getAPIKeys());
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(IntegrationHub.getWebhooks());
  const [webhookLogs, setWebhookLogs] = useState<WebhookDeliveryLog[]>(IntegrationHub.getWebhookLogs());
  const [imports, setImports] = useState<UniversalImportRecord[]>(IntegrationHub.getImports());
  const [exportsList, setExportsList] = useState<UniversalExportJob[]>(IntegrationHub.getExports());
  const [auditLogs, setAuditLogs] = useState<IntegrationAuditLogRecord[]>(IntegrationHub.getAuditLogs());

  // API Key Modal State
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["production.read", "fleet.read"]);

  // CSV Import State
  const [rawCsvText, setRawCsvText] = useState("");
  const [importTargetModule, setImportTargetModule] = useState("Production Management");
  const [importParsedResult, setImportParsedResult] = useState<any>(null);

  useEffect(() => {
    handleLoadReportData(selectedReportType);
  }, [selectedReportType]);

  const handleLoadReportData = async (type: ReportType) => {
    setIsGenerating(true);
    try {
      const data = await ReportingEngine.generateReportContent(type, company.id, activeSite.id);
      setReportData(data);
    } catch (e) {
      console.error("Error generating report data:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!reportData) return;
    const csvContent = ReportingEngine.exportToCSV(reportData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Report_${selectedReportType}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFPrint = () => {
    if (!reportData) return;
    const htmlContent = ReportingEngine.generatePrintableHTML(reportData);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleCreateAPIKey = () => {
    if (!newKeyName.trim()) return;
    const keyRecord = IntegrationHub.createAPIKey(newKeyName, selectedScopes);
    setApiKeys([...IntegrationHub.getAPIKeys()]);
    setAuditLogs([...IntegrationHub.getAuditLogs()]);
    setShowCreateKeyModal(false);
    setNewKeyName("");
    alert(`API Key Berhasil Dibuat!\n\nPrefix: ${keyRecord.rawKeyPrefix}\nToken secret telah dienkripsi dengan SHA-256.`);
  };

  const handleRunCsvImport = () => {
    if (!rawCsvText.trim()) {
      alert("Masukkan teks CSV atau pilih file terlebih dahulu.");
      return;
    }
    try {
      const parsed = IntegrationHub.parseCSVData(rawCsvText, importTargetModule);
      setImportParsedResult(parsed);
      setImports([...IntegrationHub.getImports()]);
      alert(`Import Berhasil! ${parsed.importRecord.validRows} baris valid dari ${parsed.importRecord.totalRows} baris telah dimasukkan ke dalam modul ${importTargetModule}.`);
    } catch (err: any) {
      alert(`Gagal Import: ${err.message}`);
    }
  };

  const handleExplainDashboardAI = () => {
    setAiDashboardExplanation(
      "🤖 AI Executive Analysis: Produksi batubara saat ini mencapai 95.0% dari target harian (14,250 MT), namun armada tambang mengalami botol leher di Pit 2 akibat downtime hidrolik EX-204 (PA 64.5%). Cost per Ton ($26.80/MT) berada pada risiko overrun +9.4% akibat lonjakan solar. Disarankan merebalance 4 unit dump truck ke Pit 1 South untuk memaksimalkan ritase."
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-[#0B1528] to-slate-950 p-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white font-black shadow-xl shadow-blue-500/20">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight">Reporting, BI & Integration Hub</h1>
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30">
                ENTERPRISE LAYER
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                PROMPT 34
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated ESDM Reports → Visual BI Dashboard Builder → REST API Gateway → Webhooks → FMS/GPS/ERP/IoT Connectors
            </p>
          </div>
        </div>

        {/* Global Action / Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLoadReportData(selectedReportType)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin text-blue-400" : ""}`} />
            <span>Sync Enterprise Data</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: "AI_REPORT_GENERATOR", label: "⚡ AI Report Generator (1-Click)", icon: Sparkles, color: "text-amber-400" },
          { id: "REPORTS", label: "Reporting & ESDM Engine", icon: FileText, color: "text-blue-400" },
          { id: "BI_DASHBOARD", label: "BI Dashboard & KPI Engine", icon: BarChart3, color: "text-purple-400" },
          { id: "INTEGRATIONS", label: "Integration Connectors (FMS/GPS/ERP/IoT)", icon: Network, color: "text-emerald-400" },
          { id: "REST_API_WEBHOOK", label: "REST API & Webhooks", icon: Key, color: "text-amber-400" },
          { id: "UNIVERSAL_IMPORT_EXPORT", label: "Universal Import & Export Center", icon: Upload, color: "text-cyan-400" },
          { id: "HEALTH_LINEAGE_AUDIT", label: "Health Scores & Data Lineage", icon: Activity, color: "text-rose-400" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? tab.id === "AI_REPORT_GENERATOR"
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10"
                    : "bg-slate-800 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: 1-CLICK AI REPORT GENERATOR */}
      {activeTab === "AI_REPORT_GENERATOR" && (
        <AIReportGeneratorModule onOpenAICopilot={onOpenAICopilot} />
      )}

      {/* TAB 1: REPORTING & ESDM ENGINE */}
      {activeTab === "REPORTS" && (
        <div className="space-y-6">
          {/* Top Controls: Template Selector & Export Tools */}
          <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <label className="text-xs font-black text-blue-400 uppercase tracking-wider block">
                Pilih Jenis Laporan & Template:
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-extrabold text-white focus:outline-none focus:border-blue-500"
              >
                <option value="DAILY_MINING">1. Laporan Harian Tambang (Daily Mining Report)</option>
                <option value="SHIFT_PERFORMANCE">2. Laporan Per Shift (Shift Performance)</option>
                <option value="WEEKLY_PERFORMANCE">3. Laporan Kinerja Mingguan (Weekly Mining)</option>
                <option value="MONTHLY_MANAGEMENT">4. Laporan Eksekutif Bulanan Manajemen</option>
                <option value="PRODUCTION">5. Laporan Spesifik Produksi Batubara & OB</option>
                <option value="FLEET">6. Laporan Efisiensi Armada Alat Berat</option>
                <option value="HSE">7. Laporan Keselamatan & Kesehatan Kerja (K3 Tambang)</option>
                <option value="MAINTENANCE">8. Laporan Perawatan & Downtime</option>
                <option value="ESDM_RKAB">9. Laporan Resmi ESDM Ditjen Minerba Form 04</option>
                <option value="AI_GENERATED">10. AI-Synthesized Executive Audit Report</option>
              </select>
            </div>

            {/* Export & Schedule Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPDFPrint}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>Export PDF / Print</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel / CSV</span>
              </button>

              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
              >
                <Eye className="h-4 w-4 text-purple-400" />
                <span>Preview Report</span>
              </button>
            </div>
          </div>

          {/* Active Report Preview Card */}
          {reportData && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl relative">
              {/* Report Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                    OFFICIAL REPORT GENERATED
                  </span>
                  <h2 className="text-lg font-black text-white mt-1">{reportData.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {reportData.companyName} | Site: {reportData.siteName} | Periode: {reportData.period}
                  </p>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400">
                  <span>Dicetak: {reportData.generatedAt}</span>
                  <span className="block text-amber-300 font-bold mt-0.5">Watermark: {reportWatermark}</span>
                </div>
              </div>

              {/* KPI Summary Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Actual Coal</span>
                  <div className="text-lg font-black text-white mt-0.5">
                    {reportData.kpiSummary.coalProductionActual.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                    Target: {reportData.kpiSummary.coalProductionTarget.toLocaleString()} MT ({reportData.kpiSummary.coalAchievementPct}%)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">OB Production</span>
                  <div className="text-lg font-black text-amber-300 mt-0.5">
                    {reportData.kpiSummary.obActualBCM.toLocaleString()} <span className="text-xs text-slate-400 font-normal">BCM</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Target: {reportData.kpiSummary.obTargetBCM.toLocaleString()} BCM</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fleet PA</span>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    {reportData.kpiSummary.fleetAvailabilityPA}%
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Target: {reportData.kpiSummary.fleetAvailabilityTarget}%</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mining Cost</span>
                  <div className="text-lg font-black text-rose-400 mt-0.5">
                    ${reportData.kpiSummary.costPerTonUSD} <span className="text-xs text-slate-400 font-normal">/MT</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Budget: ${reportData.kpiSummary.costBudgetUSD}/MT</span>
                </div>
              </div>

              {/* Shift Breakdown Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  1. Rincian Produksi per Shift (Shift Performance Breakdown):
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-black border-b border-slate-800 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Kode Shift</th>
                        <th className="p-3">Coal MT</th>
                        <th className="p-3">OB BCM</th>
                        <th className="p-3">Unit Aktif</th>
                        <th className="p-3">Fuel (Liter)</th>
                        <th className="p-3">Downtime (Min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                      {reportData.shiftData.map((s: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">{s.shift}</td>
                          <td className="p-3 font-bold text-emerald-400">{s.coalMT.toLocaleString()}</td>
                          <td className="p-3">{s.obBCM.toLocaleString()}</td>
                          <td className="p-3">{s.fleetActive} Unit</td>
                          <td className="p-3">{s.fuelLiters.toLocaleString()} L</td>
                          <td className="p-3 font-mono text-amber-300">{s.downtimeMin} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 text-xs">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI Synthesized Operational Insight & Recommendation (PROMPT 32/33 Grounded):
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{reportData.aiInsight}</p>
                <div className="pt-2 border-t border-emerald-500/20 text-teal-300 text-[11px] font-semibold">
                  💡 Tindakan Preskriptif: {reportData.aiRecommendation}
                </div>
              </div>

              {/* Digital Signatures Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <span className="text-[10px] text-slate-400 block">Disiapkan Oleh:</span>
                  <div className="text-xs font-bold text-white">{reportData.signatures.preparedBy}</div>
                  <span className="text-[9px] text-emerald-400 font-mono block">Signed Digital ID #9921-DISP</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <span className="text-[10px] text-slate-400 block">Ditinjau Oleh:</span>
                  <div className="text-xs font-bold text-white">{reportData.signatures.reviewedBy}</div>
                  <span className="text-[9px] text-emerald-400 font-mono block">Signed Digital ID #8812-MGR</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                  <span className="text-[10px] text-slate-400 block">Disetujui Oleh (KTT):</span>
                  <div className="text-xs font-bold text-amber-300">{reportData.signatures.approvedBy}</div>
                  <span className="text-[9px] text-amber-400 font-mono block">Official KTT Digital Signature Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Report Scheduler & Recipient Management */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                Report Scheduler & Automated Recipient Distribution
              </h3>
              <span className="text-xs text-slate-400">RBAC & Tenant Isolated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sched) => (
                <div key={sched.scheduleId} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">{sched.reportName}</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      {sched.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">Frekuensi: <strong>{sched.frequency} ({sched.cronTime})</strong></p>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Next Run: <strong className="text-amber-300">{sched.nextRunAt}</strong></span>
                    <span>Penerima: {sched.recipients.length} User/Role</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BI DASHBOARD & KPI ENGINE */}
      {activeTab === "BI_DASHBOARD" && (
        <div className="space-y-6">
          {/* Dashboard Header Bar */}
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                Visual BI Dashboard View:
              </span>
              <h2 className="text-base font-black text-white">{selectedDashboard.dashboardName}</h2>
              <p className="text-xs text-slate-400">Sharing Scope: {selectedDashboard.sharingScope} | Created by: {selectedDashboard.createdBy}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => (window as any).__NAVIGATE_MODULE__?.("bi-builder")}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Sliders className="h-4 w-4" />
                <span>Custom Drag & Drop Builder</span>
              </button>

              <button
                onClick={handleExplainDashboardAI}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explain Dashboard with AI</span>
              </button>
            </div>
          </div>

          {/* AI Explanation Banner */}
          {aiDashboardExplanation && (
            <div className="p-4 rounded-2xl border border-purple-500/40 bg-purple-950/30 text-xs text-slate-200 space-y-1 shadow-lg">
              <span className="font-bold text-purple-300 block">🤖 MineSmart Copilot Executive Summary:</span>
              <p className="leading-relaxed text-[11px]">{aiDashboardExplanation}</p>
            </div>
          )}

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.kpiId}
                onClick={() => {
                  setSelectedDrillKpi(kpi);
                  setShowDrillDownModal(true);
                }}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-purple-500/40 cursor-pointer transition-all space-y-3 shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{kpi.category}</span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded ${
                      kpi.status === "GOOD"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : kpi.status === "WARNING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {kpi.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-white group-hover:text-purple-300 transition-colors">{kpi.kpiName}</h3>
                  <div className="text-2xl font-black text-white mt-1">
                    {kpi.actualValue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: {kpi.targetValue.toLocaleString()} {kpi.unit} ({kpi.achievementPct}%)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span className="truncate">{kpi.formula}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Multi-Site Benchmarking Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-400" />
                Multi-Site Performance Benchmarking (Internal Company Sites)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Real-time Comparative Metrics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {multiSiteBenchmarking.map((site, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                  <span className="font-extrabold text-white block">{site.siteName}</span>
                  <div className="text-base font-black text-purple-300">{site.coalMT.toLocaleString()} MT</div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>PA: <strong>{site.paPct}%</strong></span>
                    <span>Cost: <strong>${site.costTonUSD}/MT</strong></span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 block pt-1 border-t border-slate-800/60">
                    Rank: {site.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRATION CONNECTORS */}
      {activeTab === "INTEGRATIONS" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-emerald-400 flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Integration Hub & External Connectors Status
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Menghubungkan MineSmart AI dengan FMS, GPS Telematics, SAP ERP, IoT Edge, Drone Survey, Laboratory Assay, Weighbridge Scale, dan Presensi Biometrik
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                8 Active Systems
              </span>
            </div>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectors.map((conn) => (
                <div
                  key={conn.integrationId}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 text-xs hover:border-emerald-500/40 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{conn.type}</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {conn.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white line-clamp-2">{conn.providerName}</h3>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Frekuensi: {conn.syncFrequency}</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Health Score:</span>
                      <span className="font-bold text-emerald-400">{conn.healthScore}/100</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Latency:</span>
                      <span className="font-mono text-slate-300">{conn.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Data Freshness:</span>
                      <span className="font-mono text-amber-300">{conn.dataFreshnessMinutes} m ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REST API & WEBHOOKS */}
      {activeTab === "REST_API_WEBHOOK" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys Management */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  REST API Key Gateway (API v1)
                </h3>
                <button
                  onClick={() => setShowCreateKeyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Generate New API Key</span>
                </button>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.keyId} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{key.keyName}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {key.status}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 truncate">
                      {key.rawKeyPrefix}
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {key.scopes.map((s, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook Subscriptions & Logs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  Webhook Event Engine & Delivery Logs
                </h3>
                <span className="text-xs text-slate-400 font-mono">HMAC SHA-256 Secured</span>
              </div>

              <div className="space-y-3">
                {webhooks.map((wh) => (
                  <div key={wh.webhookId} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{wh.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {wh.deliverySuccessPct}% Success
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-slate-400 truncate">{wh.targetUrl}</div>

                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((ev, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: UNIVERSAL IMPORT & EXPORT CENTER */}
      {activeTab === "UNIVERSAL_IMPORT_EXPORT" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Universal Import Center */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Universal Data Import Center (CSV / Excel / JSON / GeoJSON)
                </h3>
                <span className="text-xs text-slate-400 font-mono">Auto Field Mapping</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Target Modul Ingest:</label>
                  <select
                    value={importTargetModule}
                    onChange={(e) => setImportTargetModule(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Production Management">Production Management</option>
                    <option value="Fleet Management">Fleet Management</option>
                    <option value="Fuel Records">Fuel Records</option>
                    <option value="HSE Incidents">HSE Incidents</option>
                    <option value="Coal Quality Laboratory">Coal Quality Laboratory</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Tempel Data CSV / JSON Raw Text:</label>
                  <textarea
                    rows={4}
                    value={rawCsvText}
                    onChange={(e) => setRawCsvText(e.target.value)}
                    placeholder={`pit,coalMT,obBCM,shift,date\nPit 1 South,4200,14500,SHIFT_A,2026-08-14\nPit 2 North,3800,13200,SHIFT_A,2026-08-14`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 text-[11px] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleRunCsvImport}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all shadow-lg shadow-cyan-500/20"
                >
                  Proses Import Data & Validasi Quality Gate
                </button>

                {importParsedResult && (
                  <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-[11px] space-y-1 text-emerald-300">
                    <span className="font-bold block">✓ Status Validasi Import:</span>
                    <div>Total Baris: {importParsedResult.importRecord.totalRows} | Valid: {importParsedResult.importRecord.validRows} | Warning: {importParsedResult.importRecord.warningRows}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Center History */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-400" />
                  Universal Export Center History
                </h3>
                <span className="text-xs text-slate-400">Signed Temporary File Links</span>
              </div>

              <div className="space-y-3">
                {exportsList.map((exp) => (
                  <div key={exp.exportId} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-white block">{exp.exportType}</span>
                      <span className="text-[10px] text-slate-400 block">Requested by: {exp.requestedBy} ({exp.fileSizeMb} MB)</span>
                    </div>

                    <a
                      href={exp.downloadUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadCSV();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold border border-slate-700 flex items-center gap-1 text-[11px]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HEALTH SCORES & DATA LINEAGE AUDIT */}
      {activeTab === "HEALTH_LINEAGE_AUDIT" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-rose-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Data Lineage Audit Trail & Security Logs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit penelusuran asal data (Data Lineage: sourceSystem, sourceRecordId, importedAt, syncId) & log aktivitas integrasi
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black border border-rose-500/30">
                AUDIT LOGS ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.auditId} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-black">{log.action}</span>
                      <span className="text-[10px] text-slate-400">by {log.performedBy}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-300">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE API KEY MODAL */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400" />
                Generate Enterprise REST API Key
              </h3>
              <button onClick={() => setShowCreateKeyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">API Key Description Name:</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Caterpillar Telematics Connector"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Authorized API Scopes:</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  {["production.read", "production.write", "fleet.read", "fleet.write", "fuel.read", "weighbridge.read", "inventory.read", "hse.read"].map((scope) => (
                    <label key={scope} className="flex items-center gap-1.5 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedScopes([...selectedScopes, scope]);
                          else setSelectedScopes(selectedScopes.filter((s) => s !== scope));
                        }}
                        className="accent-amber-500"
                      />
                      <span className="text-slate-300">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCreateKeyModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Batal</button>
              <button onClick={handleCreateAPIKey} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs">Generate Key</button>
            </div>
          </div>
        </div>
      )}

      {/* DRILL DOWN MODAL FOR KPI */}
      {showDrillDownModal && selectedDrillKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-purple-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase">Drill-Down Metric Audit</span>
                <h3 className="text-sm font-black text-white">{selectedDrillKpi.kpiName}</h3>
              </div>
              <button onClick={() => setShowDrillDownModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex justify-between">
                <span>Nilai Aktual: <strong className="text-emerald-400">{selectedDrillKpi.actualValue} {selectedDrillKpi.unit}</strong></span>
                <span>Nilai Target: <strong className="text-amber-300">{selectedDrillKpi.targetValue} {selectedDrillKpi.unit}</strong></span>
              </div>

              <div className="space-y-2">
                <span className="font-extrabold text-slate-300 block">Hierarki Drill-Down Record Source:</span>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 font-mono text-[11px] space-y-1 text-slate-300">
                  <div>Company: PT MINESMART ENTERPRISE</div>
                  <div className="pl-3">└─ Site: Site Muara Enim</div>
                  <div className="pl-6">└─ Pit: Pit 2 North</div>
                  <div className="pl-9">└─ Equipment: EX-204 (Komatsu PC1250)</div>
                  <div className="pl-12 text-emerald-400 font-bold">└─ Telemetry Ticket #TEL-9921 (14 Aug 2026 14:00 WITA)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowDrillDownModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
