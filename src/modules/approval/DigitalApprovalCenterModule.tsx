// MINE SMART AI - Enterprise Digital Approval Center
// 4-Stage Lifecycle: Request → Approval → Execution → Verification
// Across 8 Core Mining Categories: Purchase | Maintenance | Overtime | Leave | Fuel | Work Order | Permit | Document

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Filter,
  Search,
  Plus,
  ShoppingCart,
  Wrench,
  Timer,
  Palmtree,
  Fuel,
  Hammer,
  Award,
  FileText,
  UserCheck,
  Sparkles,
  Printer,
  QrCode,
  Lock,
  ChevronRight,
  RefreshCw,
  X,
  Check,
  Sliders,
  Send,
  AlertOctagon,
  Eye,
  Hash,
  Download,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  History,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  DigitalApprovalRequest,
  ApprovalCategory,
  ApprovalStage,
  ApprovalStatus,
  ApprovalUrgency,
  ApprovalSummaryMetrics,
  ApprovalStepApprover,
} from "../../types/approvalTypes";
import { DigitalApprovalService } from "../../services/approval/ApprovalService";

export const DigitalApprovalCenterModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { currentUser } = useAuth();

  // State
  const [requests, setRequests] = useState<DigitalApprovalRequest[]>([]);
  const [summary, setSummary] = useState<ApprovalSummaryMetrics>(
    DigitalApprovalService.getSummaryMetrics([])
  );

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ApprovalCategory>("ALL");
  const [selectedStage, setSelectedStage] = useState<"ALL" | ApprovalStage>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<"ALL" | ApprovalUrgency>("ALL");

  // Selected Request Detail / Action Modal
  const [selectedRequest, setSelectedRequest] = useState<DigitalApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [isPrintCertModalOpen, setIsPrintCertModalOpen] = useState<boolean>(false);

  // Form Inputs for Sign Modal
  const [signTierIndex, setSignTierIndex] = useState<number>(0);
  const [signComment, setSignComment] = useState<string>("");
  const [signPinCode, setSignPinCode] = useState<string>("8891");

  // Form Inputs for Execute Modal
  const [execActionName, setExecActionName] = useState<string>("");
  const [execProgressPct, setExecProgressPct] = useState<number>(100);
  const [execNotes, setExecNotes] = useState<string>("");
  const [execRefDoc, setExecRefDoc] = useState<string>("");

  // Form Inputs for Verify Modal
  const [verifStatus, setVerifStatus] = useState<"PASSED" | "PASSED_WITH_NOTE" | "FAILED">("PASSED");
  const [verifScore, setVerifScore] = useState<number>(100);
  const [verifFindings, setVerifFindings] = useState<string>(
    "Semua item dan spesifikasi telah diverifikasi sesuai SOP dan regulasi K3/ESDM."
  );

  // Form Inputs for New Request Modal
  const [newCat, setNewCat] = useState<ApprovalCategory>("PURCHASE");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newUrgency, setNewUrgency] = useState<ApprovalUrgency>("HIGH");
  const [newLocation, setNewLocation] = useState<string>("Pit 02 Seam B");
  const [newCost, setNewCost] = useState<string>("45000000");
  const [newUnitId, setNewUnitId] = useState<string>("HD-08");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const list = DigitalApprovalService.getRequests();
    setRequests(list);
    setSummary(DigitalApprovalService.getSummaryMetrics(list));
    if (selectedRequest) {
      const refreshed = list.find((r) => r.id === selectedRequest.id);
      if (refreshed) setSelectedRequest(refreshed);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Category visual metadata
  const getCategoryInfo = (cat: ApprovalCategory) => {
    switch (cat) {
      case "PURCHASE":
        return {
          label: "Purchase & Procurement",
          short: "Purchase",
          icon: ShoppingCart,
          badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          cardBorder: "border-l-4 border-l-emerald-500",
        };
      case "MAINTENANCE":
        return {
          label: "Plant Maintenance",
          short: "Maintenance",
          icon: Wrench,
          badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          cardBorder: "border-l-4 border-l-blue-500",
        };
      case "OVERTIME":
        return {
          label: "Overtime (SPL Lembur)",
          short: "Overtime",
          icon: Timer,
          badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          cardBorder: "border-l-4 border-l-amber-500",
        };
      case "LEAVE":
        return {
          label: "Leave (Cuti Roster)",
          short: "Leave",
          icon: Palmtree,
          badgeClass: "bg-teal-500/20 text-teal-400 border-teal-500/40",
          cardBorder: "border-l-4 border-l-teal-500",
        };
      case "FUEL":
        return {
          label: "Fuel Dispense / Quota",
          short: "Fuel",
          icon: Fuel,
          badgeClass: "bg-orange-500/20 text-orange-400 border-orange-500/40",
          cardBorder: "border-l-4 border-l-orange-500",
        };
      case "WORK_ORDER":
        return {
          label: "Mining Work Order (SPK)",
          short: "Work Order",
          icon: Hammer,
          badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/40",
          cardBorder: "border-l-4 border-l-purple-500",
        };
      case "PERMIT":
        return {
          label: "Permit & SIMPER K3",
          short: "Permit",
          icon: Award,
          badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          cardBorder: "border-l-4 border-l-rose-500",
        };
      case "DOCUMENT":
        return {
          label: "Document & Mine Plan",
          short: "Document",
          icon: FileText,
          badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
          cardBorder: "border-l-4 border-l-cyan-500",
        };
    }
  };

  const getStageInfo = (stage: ApprovalStage) => {
    switch (stage) {
      case "REQUEST":
        return {
          label: "1. Request (Permohonan)",
          stepNumber: 1,
          badgeClass: "bg-sky-500/20 text-sky-400 border-sky-500/40",
          color: "text-sky-400",
        };
      case "APPROVAL":
        return {
          label: "2. Approval (Tanda Tangan)",
          stepNumber: 2,
          badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          color: "text-amber-400",
        };
      case "EXECUTION":
        return {
          label: "3. Execution (Pengerjaan)",
          stepNumber: 3,
          badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/40",
          color: "text-purple-400",
        };
      case "VERIFICATION":
        return {
          label: "4. Verification (Verifikasi & Close)",
          stepNumber: 4,
          badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          color: "text-emerald-400",
        };
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "IN_EXECUTION":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "EXECUTION_COMPLETED":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "VERIFIED_COMPLETED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
      case "REJECTED":
      case "VERIFICATION_FAILED":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  // Handlers
  const handleApproveAction = () => {
    if (!selectedRequest) return;
    const approverName = currentUser?.displayName || "Ir. Hendra Gunawan, M.T. (Approver)";
    const res = DigitalApprovalService.approveTier(
      selectedRequest.id,
      signTierIndex,
      approverName,
      signComment
    );
    if (res.success) {
      loadData();
      setIsSignModalOpen(false);
      showToast(res.message);
    }
  };

  const handleRejectAction = () => {
    if (!selectedRequest) return;
    const approverName = currentUser?.displayName || "Approver";
    const res = DigitalApprovalService.rejectRequest(
      selectedRequest.id,
      signTierIndex,
      approverName,
      signComment || "Permohonan tidak disetujui setelah evaluasi."
    );
    if (res) {
      loadData();
      setIsSignModalOpen(false);
      showToast(`⚠️ Permohonan ${selectedRequest.requestCode} telah ditolak.`);
    }
  };

  const handleExecutionSubmit = () => {
    if (!selectedRequest || !execActionName.trim()) return;
    const executorName = currentUser?.displayName || "Pelaksana Lapangan Terverifikasi";
    const updated = DigitalApprovalService.logExecutionProgress(selectedRequest.id, {
      executorName,
      executorRole: "Operational Field Lead",
      action: execActionName.trim(),
      notes: execNotes.trim() || "Pekerjaan dilaksanakan sesuai instruksi SPK.",
      progressPercentage: Number(execProgressPct),
      referenceNumber: execRefDoc.trim() || undefined,
    });
    if (updated) {
      loadData();
      setIsExecuteModalOpen(false);
      showToast(
        execProgressPct >= 100
          ? `✅ Eksekusi selesai (100%)! Workflow otomatis beralih ke tahap VERIFIKASI.`
          : `✅ Progress eksekusi ${execProgressPct}% berhasil dicatat.`
      );
    }
  };

  const handleVerificationSubmit = () => {
    if (!selectedRequest) return;
    const inspectorName = currentUser?.displayName || "Inspektur Tambang / Safety QA";
    const updated = DigitalApprovalService.verifyAndClose(selectedRequest.id, {
      inspectorName,
      inspectorRole: "Mine QA & Safety Inspector",
      checklistScorePct: Number(verifScore),
      findings: verifFindings,
      status: verifStatus,
    });
    if (updated) {
      loadData();
      setIsVerifyModalOpen(false);
      showToast(
        verifStatus === "PASSED"
          ? `🎉 Permohonan ${selectedRequest.requestCode} resmi ditutup (VERIFIED COMPLETED). Sertifikat digital tersegel.`
          : `⚠️ Hasil verifikasi dicatat sebagai ${verifStatus}.`
      );
    }
  };

  const handleBatchApprove = () => {
    const approverName = currentUser?.displayName || "General Manager (1-Click Batch)";
    const count = DigitalApprovalService.quickBatchApproveAll(approverName);
    loadData();
    showToast(`⚡ Berhasil menandatangani ${count} permohonan tertunda secara batch!`);
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let defaultApprovers: ApprovalStepApprover[] = [];
    if (newCat === "PURCHASE") {
      defaultApprovers = [
        { tier: 1, roleTitle: "Superintendent Maintenance/Dept", assignedToName: "Bambang Sudibyo", assignedToEmail: "bambang@minesmart.id", status: "PENDING" },
        { tier: 2, roleTitle: "General Manager Mining Ops", assignedToName: "Ir. Hendra Gunawan, M.T.", assignedToEmail: "hendra@minesmart.id", status: "PENDING" },
        { tier: 3, roleTitle: "Finance & Procurement Director", assignedToName: "Dra. Siti Rahmawati", assignedToEmail: "siti@minesmart.id", status: "PENDING" },
      ];
    } else if (newCat === "PERMIT" || newCat === "WORK_ORDER") {
      defaultApprovers = [
        { tier: 1, roleTitle: "HSE & Mining Safety Lead", assignedToName: "Kapt. Wahyu Pratama", assignedToEmail: "wahyu@minesmart.id", status: "PENDING" },
        { tier: 2, roleTitle: "Kepala Teknik Tambang (KTT)", assignedToName: "Ir. Dedi Kusnadi, IPM", assignedToEmail: "dedi@minesmart.id", status: "PENDING" },
      ];
    } else if (newCat === "OVERTIME" || newCat === "LEAVE") {
      defaultApprovers = [
        { tier: 1, roleTitle: "Section Head / Supervisor", assignedToName: "Darmawan Santoso", assignedToEmail: "darmawan@minesmart.id", status: "PENDING" },
        { tier: 2, roleTitle: "HR & Site Superintendent", assignedToName: "Sri Wahyuni, S.Psi.", assignedToEmail: "sri@minesmart.id", status: "PENDING" },
      ];
    } else {
      defaultApprovers = [
        { tier: 1, roleTitle: "Section Head", assignedToName: "Kurniawan Putra", assignedToEmail: "kurniawan@minesmart.id", status: "PENDING" },
        { tier: 2, roleTitle: "Mine Operational Manager", assignedToName: "Ir. Hendra Gunawan", assignedToEmail: "hendra@minesmart.id", status: "PENDING" },
      ];
    }

    const created = DigitalApprovalService.submitNewRequest({
      category: newCat,
      title: newTitle.trim(),
      description: newDesc.trim() || `Pengajuan ${newCat} operasional tambang.`,
      urgency: newUrgency,
      requesterId: currentUser?.id || "USR-2026-001",
      requesterName: currentUser?.displayName || "Agus Pratama, S.T.",
      requesterRole: currentUser?.role || "Operational Supervisor",
      requesterDept: "Mining Operations Department",
      requestedAt: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      targetLocation: newLocation,
      relatedUnitId: newUnitId || undefined,
      costEstimateIdr: Number(newCost) || 0,
      costCenterCode: `CC-${newCat.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      itemDetails: [
        { label: "Kategori Approval", value: newCat, highlight: true },
        { label: "Estimasi Biaya", value: Number(newCost) ? `Rp ${Number(newCost).toLocaleString("id-ID")}` : "Non-Finansial", highlight: true },
        { label: "Lokasi Target", value: newLocation },
        { label: "Unit Terkait", value: newUnitId || "All Fleet" },
      ],
      slaHoursRemaining: 24,
      dueDate: "Besok, 17:00 WIB",
      isSlaBreached: false,
      approvalMatrix: defaultApprovers,
      currentPendingTier: 1,
      assignedExecutor: "Department Assigned Lead",
      aiEvaluation: {
        riskLevel: "LOW",
        complianceScorePct: 98,
        budgetImpactSummary: "Sesuai pagu anggaran operasional Q3.",
        anomalyDetected: false,
        recommendation: "AUTO_RECOMMEND_APPROVE",
        aiNote: "Parameter pengajuan lengkap dan sesuai standar SOP keselamatan kerja.",
      },
      digitalSignatureId: `DSIG-2026-${newCat.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
    });

    loadData();
    setIsNewRequestModalOpen(false);
    showToast(`🎉 Permohonan ${created.requestCode} berhasil diajukan ke tahap APPROVAL.`);
  };

  // Filter logic
  const filteredRequests = requests.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (selectedStage !== "ALL" && item.currentStage !== selectedStage) return false;
    if (selectedUrgency !== "ALL" && item.urgency !== selectedUrgency) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchCode = item.requestCode.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchReq = item.requesterName.toLowerCase().includes(q);
      const matchUnit = item.relatedUnitId?.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchReq && !matchUnit) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-bold flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-950/50">
              <FileCheck className="h-7 w-7 text-white font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  DIGITAL APPROVAL CENTER
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  4-STAGE WORKFLOW ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardisasi Alur End-to-End: <strong>Request → Approval → Execution → Verification</strong> di 8 Kategori Operasional Tambang.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Buat Permohonan Baru</span>
          </button>

          <button
            onClick={handleBatchApprove}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-xs font-black flex items-center gap-2 transition cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>1-Click Batch Sign</span>
          </button>

          <button
            onClick={loadData}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Refresh</span>
          </button>

          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Policy Auditor</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-STAGE INTERACTIVE WORKFLOW PIPELINE BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500 text-slate-950">
              CORE WORKFLOW ARCHITECTURE
            </span>
            <span className="text-xs text-indigo-300 font-bold">
              Standard Operating Procedure (SOP) Mining Digital Approval
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            SLA Compliance: <strong className="text-emerald-400">{summary.slaComplianceRatePct}%</strong>
          </span>
        </div>

        {/* 4 Stages Visualizer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {[
            {
              stage: "REQUEST" as ApprovalStage,
              number: "01",
              title: "REQUEST",
              sub: "Pengajuan & AI Risk Check",
              count: summary.stageCounts.REQUEST,
              desc: "Form terstandar, lampiran teknis, budget code & evaluasi risiko AI instan.",
              color: "border-sky-500/50 bg-sky-950/20 text-sky-300",
              badge: "bg-sky-500/20 text-sky-300",
            },
            {
              stage: "APPROVAL" as ApprovalStage,
              number: "02",
              title: "APPROVAL",
              sub: "Multi-Tier e-Signature",
              count: summary.stageCounts.APPROVAL,
              desc: "Persetujuan bertingkat (Spv → Dept Head → KTT/GM) dengan enkripsi tanda tangan SHA-256.",
              color: "border-amber-500/50 bg-amber-950/20 text-amber-300",
              badge: "bg-amber-500/20 text-amber-300",
            },
            {
              stage: "EXECUTION" as ApprovalStage,
              number: "03",
              title: "EXECUTION",
              sub: "Pengerjaan & Dispatch",
              count: summary.stageCounts.EXECUTION,
              desc: "Penerbitan PO / WO / Fuel Dispensing / SPK dengan log progress real-time.",
              color: "border-purple-500/50 bg-purple-950/20 text-purple-300",
              badge: "bg-purple-500/20 text-purple-300",
            },
            {
              stage: "VERIFICATION" as ApprovalStage,
              number: "04",
              title: "VERIFICATION",
              sub: "Inspeksi & Close-Out",
              count: summary.stageCounts.VERIFICATION,
              desc: "Verifikasi hasil kerja oleh K3/HSE/Finance, checklist QC & sertifikat bersegel QR.",
              color: "border-emerald-500/50 bg-emerald-950/20 text-emerald-300",
              badge: "bg-emerald-500/20 text-emerald-300",
            },
          ].map((st) => (
            <div
              key={st.stage}
              onClick={() => setSelectedStage(st.stage === selectedStage ? "ALL" : st.stage)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] shadow-sm space-y-1.5 ${
                selectedStage === st.stage
                  ? `${st.color} ring-2 ring-indigo-400 font-bold`
                  : `${st.color} opacity-90 hover:opacity-100`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-slate-950/60">
                    {st.number}
                  </span>
                  <span className="font-black text-xs">{st.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>
                  {st.count} Item
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-200">{st.sub}</div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8 CORE MINING CATEGORY SELECTOR CHIPS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>8 Kategori Operasional Tambang Terintegrasi:</span>
          </span>
          {selectedCategory !== "ALL" && (
            <button
              onClick={() => setSelectedCategory("ALL")}
              className="text-[11px] text-indigo-400 hover:underline font-bold"
            >
              Reset ke Semua Kategori
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { id: "PURCHASE" as ApprovalCategory, label: "Purchase", icon: ShoppingCart, count: summary.categoryCounts.PURCHASE },
            { id: "MAINTENANCE" as ApprovalCategory, label: "Maintenance", icon: Wrench, count: summary.categoryCounts.MAINTENANCE },
            { id: "OVERTIME" as ApprovalCategory, label: "Overtime", icon: Timer, count: summary.categoryCounts.OVERTIME },
            { id: "LEAVE" as ApprovalCategory, label: "Leave", icon: Palmtree, count: summary.categoryCounts.LEAVE },
            { id: "FUEL" as ApprovalCategory, label: "Fuel", icon: Fuel, count: summary.categoryCounts.FUEL },
            { id: "WORK_ORDER" as ApprovalCategory, label: "Work Order", icon: Hammer, count: summary.categoryCounts.WORK_ORDER },
            { id: "PERMIT" as ApprovalCategory, label: "Permit", icon: Award, count: summary.categoryCounts.PERMIT },
            { id: "DOCUMENT" as ApprovalCategory, label: "Document", icon: FileText, count: summary.categoryCounts.DOCUMENT },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? "ALL" : cat.id)}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-950/50 scale-[1.03]"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-indigo-400"}`} />
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-slate-950/40 text-white" : "bg-slate-950 text-slate-400"
                  }`}>
                    {cat.count}
                  </span>
                </div>
                <div className="text-xs font-bold mt-2 truncate">{cat.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Tahap:</span>
          {[
            { id: "ALL", label: "Semua Tahap" },
            { id: "REQUEST", label: "1. Request" },
            { id: "APPROVAL", label: "2. Approval" },
            { id: "EXECUTION", label: "3. Execution" },
            { id: "VERIFICATION", label: "4. Verification" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedStage === st.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-400"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari No. Request / Pemohon / Unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* REQUESTS LIST / CARDS */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Tidak Ada Permohonan pada Filter Ini</h3>
            <p className="text-xs text-slate-400">Silakan ubah filter kategori atau tahap di atas.</p>
          </div>
        ) : (
          filteredRequests.map((item) => {
            const catInfo = getCategoryInfo(item.category);
            const stageInfo = getStageInfo(item.currentStage);
            const CatIcon = catInfo.icon;

            const pendingTierIdx = item.approvalMatrix.findIndex((s) => s.status === "PENDING");
            const currentPendingApprover = pendingTierIdx !== -1 ? item.approvalMatrix[pendingTierIdx] : null;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg ${catInfo.cardBorder}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Request Overview */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Chip */}
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 border ${catInfo.badgeClass}`}>
                        <CatIcon className="h-3 w-3" />
                        <span>{catInfo.short}</span>
                      </span>

                      {/* Stage Chip */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stageInfo.badgeClass}`}>
                        {stageInfo.label}
                      </span>

                      {/* Request Code */}
                      <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.requestCode}
                      </span>

                      {/* Urgency */}
                      {item.urgency === "URGENT_EMERGENCY" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-slate-950 animate-pulse">
                          🔥 URGENT
                        </span>
                      )}

                      {/* Requester & Date */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.requestedAt} • Oleh: <strong>{item.requesterName}</strong>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Key Attributes & Values Grid */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                      {item.itemDetails.slice(0, 4).map((detail, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] text-slate-400 block">{detail.label}:</span>
                          <span className={`font-mono font-bold text-xs ${detail.highlight ? "text-indigo-300" : "text-slate-200"}`}>
                            {detail.value} {detail.unit || ""}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 4-Stage Mini Progress Indicator */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold">
                          Lifecycle Progress:
                        </span>
                        <span className="font-mono text-indigo-300 font-bold">
                          {item.currentStage === "REQUEST" && "Stage 1/4: Draft submitted"}
                          {item.currentStage === "APPROVAL" && `Stage 2/4: Tier ${item.currentPendingTier} Pending Approval`}
                          {item.currentStage === "EXECUTION" && `Stage 3/4: Execution ${item.executionProgressPct}% In-Progress`}
                          {item.currentStage === "VERIFICATION" && (item.status === "VERIFIED_COMPLETED" ? "Stage 4/4: Verified & Closed (100%)" : "Stage 4/4: Pending QC Verification")}
                        </span>
                      </div>

                      {/* 4 Steps Bar */}
                      <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                        <div className={`h-full ${item.currentStage === "REQUEST" ? "bg-sky-500 animate-pulse" : "bg-emerald-500"}`} />
                        <div className={`h-full ${
                          item.currentStage === "REQUEST"
                            ? "bg-slate-800"
                            : item.currentStage === "APPROVAL"
                            ? "bg-amber-500 animate-pulse"
                            : "bg-emerald-500"
                        }`} />
                        <div className={`h-full ${
                          item.currentStage === "REQUEST" || item.currentStage === "APPROVAL"
                            ? "bg-slate-800"
                            : item.currentStage === "EXECUTION"
                            ? "bg-purple-500 animate-pulse"
                            : "bg-emerald-500"
                        }`} />
                        <div className={`h-full ${
                          item.status === "VERIFIED_COMPLETED"
                            ? "bg-emerald-500"
                            : item.currentStage === "VERIFICATION"
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-slate-800"
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Current State */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800 min-w-[200px]">
                    {/* Status Pill */}
                    <span className={`px-3 py-1 rounded-xl text-xs border ${getStatusBadge(item.status)}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>

                    {/* Stage-Specific Context Button */}
                    {item.currentStage === "APPROVAL" && currentPendingApprover && (
                      <button
                        onClick={() => {
                          setSelectedRequest(item);
                          setSignTierIndex(pendingTierIdx);
                          setIsSignModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Sign Tier {item.currentPendingTier} (e-Sign)</span>
                      </button>
                    )}

                    {item.currentStage === "EXECUTION" && (
                      <button
                        onClick={() => {
                          setSelectedRequest(item);
                          setExecActionName(`Update pengerjaan ${item.title}`);
                          setExecProgressPct(item.executionProgressPct < 100 ? 100 : item.executionProgressPct);
                          setIsExecuteModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer"
                      >
                        <Hammer className="h-3.5 w-3.5" />
                        <span>Log Eksekusi & Progress</span>
                      </button>
                    )}

                    {item.currentStage === "VERIFICATION" && item.status !== "VERIFIED_COMPLETED" && (
                      <button
                        onClick={() => {
                          setSelectedRequest(item);
                          setIsVerifyModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verifikasi QC & Close-Out</span>
                      </button>
                    )}

                    {item.status === "VERIFIED_COMPLETED" && (
                      <button
                        onClick={() => {
                          setSelectedRequest(item);
                          setIsPrintCertModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/60 text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Award className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Sertifikat Bersegel QR</span>
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => {
                        setSelectedRequest(item);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 hover:underline mt-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Lihat Detail Matrix ({item.approvalMatrix.length} Tiers)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FULL DETAIL & APPROVAL MATRIX AUDIT TRAIL */}
      {/* ========================================================================= */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                  DIGITAL APPROVAL AUDIT DOSSIER
                </span>
                <h3 className="text-lg font-black text-white">{selectedRequest.requestCode}</h3>
                <p className="text-xs text-slate-400">{selectedRequest.title}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Approval Matrix Tiers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                <span>Approval Signing Matrix (Bertingkat):</span>
              </h4>

              <div className="space-y-2">
                {selectedRequest.approvalMatrix.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                          TIER {step.tier}
                        </span>
                        <span className="font-bold text-white">{step.roleTitle}</span>
                        <span className="text-slate-400">• {step.assignedToName}</span>
                      </div>
                      {step.comments && (
                        <p className="text-[11px] text-slate-300 italic">"{step.comments}"</p>
                      )}
                      {step.digitalSignatureHash && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Signature Hash: {step.digitalSignatureHash}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0 ${
                        step.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : step.status === "REJECTED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution History */}
            {selectedRequest.executionLogs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Hammer className="h-4 w-4 text-purple-400" />
                  <span>Execution Milestone Logs:</span>
                </h4>
                <div className="space-y-2">
                  {selectedRequest.executionLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300">{log.action}</span>
                        <span className="font-mono text-emerald-400 font-bold">{log.progressPercentage}%</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{log.notes}</p>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Oleh: {log.executorName} ({log.executorRole})</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Policy Copilot Assessment */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>AI Risk & Policy Evaluation ({selectedRequest.aiEvaluation.complianceScorePct}% Compliance)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                  Risk: {selectedRequest.aiEvaluation.riskLevel}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedRequest.aiEvaluation.aiNote}
              </p>
              {selectedRequest.aiEvaluation.budgetImpactSummary && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-indigo-500/20">
                  <strong>Budget / Fiscal Check:</strong> {selectedRequest.aiEvaluation.budgetImpactSummary}
                </div>
              )}
            </div>

            {/* 6-Dimension Regulatory Audit Trail (Who, What, When, Where, Before, After) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-4 w-4 text-indigo-400" />
                  <span>Audit Trail 6-Dimensi (Who, What, When, Where, Before, After):</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  ✓ SHA-256 Verified
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedRequest.auditTrail.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono border-b border-slate-800/60 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold">
                          {log.action}
                        </span>
                        <span className="text-slate-400">Stage: {log.stage}</span>
                      </div>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>

                    <p className="text-slate-200 text-[11px]">{log.details}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                      <div className="p-1.5 bg-slate-900 rounded-lg">
                        <span className="text-indigo-400 font-bold block">WHO:</span>
                        <span className="text-slate-300 truncate block">{log.actor}</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded-lg">
                        <span className="text-purple-400 font-bold block">WHERE:</span>
                        <span className="text-slate-300 truncate block">{log.where || "Central Operations"}</span>
                      </div>
                      <div className="p-1.5 bg-rose-950/30 rounded-lg border border-rose-500/20">
                        <span className="text-rose-400 font-bold block">BEFORE:</span>
                        <span className="text-rose-300 truncate block">{log.before || "Draft / Initial"}</span>
                      </div>
                      <div className="p-1.5 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                        <span className="text-emerald-400 font-bold block">AFTER:</span>
                        <span className="text-emerald-300 truncate block">{log.after || "Updated State"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: E-SIGNATURE APPROVAL SIGNING PAD */}
      {/* ========================================================================= */}
      {isSignModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Tanda Tangan Digital (e-Sign)</h3>
                  <p className="text-xs text-slate-400">
                    Tier {signTierIndex + 1}: {selectedRequest.approvalMatrix[signTierIndex]?.roleTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div>No. Permohonan: <strong className="text-white font-mono">{selectedRequest.requestCode}</strong></div>
              <div>Perihal: <strong className="text-indigo-300">{selectedRequest.title}</strong></div>
              <div>Estimasi Nilai: <strong className="text-emerald-400 font-mono">Rp {selectedRequest.costEstimateIdr?.toLocaleString("id-ID") || "0"}</strong></div>
            </div>

            {/* Comments / Remarks */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Catatan Persetujuan (Opsional):</label>
              <textarea
                rows={2}
                placeholder="Disetujui. Pastikan kepatuhan SOP K3..."
                value={signComment}
                onChange={(e) => setSignComment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* PIN Code Verification */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Security PIN / OTP Tanda Tangan:</label>
              <input
                type="password"
                value={signPinCode}
                onChange={(e) => setSignPinCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-sm text-amber-400 tracking-widest focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleRejectAction}
                className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold"
              >
                Tolak Permohonan
              </button>

              <button
                type="button"
                onClick={handleApproveAction}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-xs font-black shadow-lg shadow-emerald-950/50 flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Sah & Tanda Tangani</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EXECUTION MILESTONE & PROGRESS LOGGER */}
      {/* ========================================================================= */}
      {isExecuteModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white font-black">
                  <Hammer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Log Pengerjaan / Eksekusi Lapangan</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.requestCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsExecuteModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Deskripsi Tindakan / Milestone:</label>
                <input
                  type="text"
                  value={execActionName}
                  onChange={(e) => setExecActionName(e.target.value)}
                  placeholder="e.g. Selesai perbaikan komponen, pengujian fungsi running test..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300">Progress Pengerjaan Total (%):</label>
                  <span className="font-mono text-emerald-400 font-black">{execProgressPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={execProgressPct}
                  onChange={(e) => setExecProgressPct(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="text-[10px] text-slate-400 block">
                  *Jika progress mencapai 100%, sistem otomatis mengalihkan status ke tahap <strong>4. VERIFIKASI</strong>.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nomor Dokumen Bukti / PO / SPK (Opsional):</label>
                <input
                  type="text"
                  value={execRefDoc}
                  onChange={(e) => setExecRefDoc(e.target.value)}
                  placeholder="e.g. PO-8821, WO-9921, SIMPER-0912..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Catatan Pelaksanaan:</label>
                <textarea
                  rows={2}
                  value={execNotes}
                  onChange={(e) => setExecNotes(e.target.value)}
                  placeholder="Catatan kendala teknis atau hasil pengetesan..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsExecuteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecutionSubmit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Simpan Log Eksekusi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VERIFICATION & QC CLOSE-OUT */}
      {/* ========================================================================= */}
      {isVerifyModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Verifikasi QC & Final Close-Out</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.requestCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Hasil Inspeksi / Verifikasi:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "PASSED", label: "✅ Lulus (Passed)" },
                    { id: "PASSED_WITH_NOTE", label: "⚠️ Lulus Bersyarat" },
                    { id: "FAILED", label: "❌ Tidak Lulus" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVerifStatus(v.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        verifStatus === v.id
                          ? "bg-emerald-600 text-slate-950 border-emerald-400 font-black"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300">Nilai Checklist Kepatuhan (%):</label>
                  <span className="font-mono text-emerald-400 font-black">{verifScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={verifScore}
                  onChange={(e) => setVerifScore(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Temuan / Catatan Verifikator:</label>
                <textarea
                  rows={2}
                  value={verifFindings}
                  onChange={(e) => setVerifFindings(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleVerificationSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                <span>Terbitkan Sertifikat Selesai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: NEW APPROVAL REQUEST FORM */}
      {/* ========================================================================= */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateNewRequest}
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-black">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Buat Permohonan Digital Baru</h3>
                  <p className="text-xs text-slate-400">Pilih salah satu dari 8 kategori mining approval</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Pilih Kategori Permohonan:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "PURCHASE", label: "🛒 Purchase" },
                  { id: "MAINTENANCE", label: "🔧 Maintenance" },
                  { id: "OVERTIME", label: "⏱️ Overtime" },
                  { id: "LEAVE", label: "🌴 Leave" },
                  { id: "FUEL", label: "⛽ Fuel" },
                  { id: "WORK_ORDER", label: "🚜 Work Order" },
                  { id: "PERMIT", label: "🛡️ Permit" },
                  { id: "DOCUMENT", label: "📄 Document" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setNewCat(c.id as ApprovalCategory)}
                    className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      newCat === c.id
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Judul Permohonan / Scope of Work:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Pengadaan Spare Hoist Cylinder Komatsu HD785-7 Pit 02..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Deskripsi Rinci & Justifikasi Teknis:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Jelaskan kebutuhan operasional dan justifikasi kelayakan teknis..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Tingkat Urgensi:</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High (Prioritas)</option>
                    <option value="URGENT_EMERGENCY">🔥 Urgent Emergency</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lokasi / Pit:</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Pit 02 Seam B"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                  </input>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Estimasi Nilai (IDR):</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="45000000"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Ajukan ke Approval Matrix</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DIGITAL VERIFICATION CERTIFICATE (PRINTABLE) */}
      {/* ========================================================================= */}
      {isPrintCertModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-emerald-500/60 p-6 space-y-5 shadow-2xl my-8">
            <div className="text-center space-y-1 border-b border-slate-800 pb-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black mb-1">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                MINE SMART AI • SERTIFIKAT KELAIKAN & VERIFIKASI DIGITAL
              </h3>
              <p className="text-xs text-slate-400">
                Persetujuan & Verifikasi Tertutup Sah Sesuai Kepmen ESDM 1827 K/30/MEM/2018
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">No. Registrasi:</span>
                <span className="font-mono font-black text-emerald-400">{selectedRequest.requestCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kategori:</span>
                <span className="font-bold text-white">{selectedRequest.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pemohon:</span>
                <span className="text-slate-200">{selectedRequest.requesterName} ({selectedRequest.requesterDept})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Akhir:</span>
                <span className="text-emerald-400 font-bold">VERIFIED COMPLETED (100%)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Verifikator K3/QA:</span>
                <span className="text-white font-bold">{selectedRequest.verification.inspectorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Checklist Score:</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedRequest.verification.checklistScorePct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security Hash:</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[240px]">
                  {selectedRequest.verification.digitalSignCertHash}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">QR Code Kabsahan Resmi</span>
                <div className="text-[11px] font-mono text-slate-300">
                  {selectedRequest.verification.qrVerificationCode}
                </div>
              </div>
              <QrCode className="h-10 w-10 text-emerald-400" />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsPrintCertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Mempersiapkan cetak sertifikat...");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
