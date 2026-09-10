// MINE SMART AI - Digital Approval System Types
// 4-Stage Enterprise Workflow: Request → Approval → Execution → Verification
// Across 8 Core Mining Categories: Purchase | Maintenance | Overtime | Leave | Fuel | Work Order | Permit | Document

export type ApprovalCategory =
  | "PURCHASE"      // PR, PO, Capex, Spareparts Requisition
  | "MAINTENANCE"   // Major Overhaul, Component Changeout, Critical Work Order
  | "OVERTIME"      // Surat Perintah Lembur (SPL), Pit Shift Extension
  | "LEAVE"         // Roster Leave (6:2, 8:2, 10:2), Annual, Sick, Emergency Leave
  | "FUEL"          // Fuel Dispense Requisition, Extra Fuel Quota, Fuel Bowser Dispatch
  | "WORK_ORDER"    // Mining Excavation WO, Blasting Initiation, Pit Dewatering WO
  | "PERMIT"        // SIMPER/Kimper Tambang, Working at Height, Hot Work, Confined Space
  | "DOCUMENT";     // Mine Design Plan, SOP Mining Release, RKAB Revision Draft

export type ApprovalStage =
  | "REQUEST"       // Stage 1: Permohonan diajukan / Draf
  | "APPROVAL"      // Stage 2: Proses Review & Tanda Tangan Bertingkat
  | "EXECUTION"     // Stage 3: Pekerjaan / Pembelian / Dispensing Sedang Berjalan
  | "VERIFICATION"; // Stage 4: Verifikasi Hasil, Inspeksi QC/HSE & Close-Out

export type ApprovalStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "REVISION_REQUESTED"
  | "APPROVED"
  | "IN_EXECUTION"
  | "EXECUTION_COMPLETED"
  | "VERIFIED_COMPLETED"
  | "VERIFICATION_FAILED"
  | "CANCELLED";

export type ApprovalUrgency = "NORMAL" | "HIGH" | "URGENT_EMERGENCY";

export interface ApprovalStepApprover {
  tier: number; // Tier 1: Spv, Tier 2: Dept Head / KTT, Tier 3: General Manager, Tier 4: Director
  roleTitle: string;
  assignedToName: string;
  assignedToEmail: string;
  assignedToAvatar?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED" | "DELEGATED";
  actionTimestamp?: string;
  comments?: string;
  digitalSignatureHash?: string; // Cryptographic sign hash
  delegatedToName?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  executorName: string;
  executorRole: string;
  action: string;
  notes: string;
  progressPercentage: number; // 0 - 100%
  attachedProofUrls?: string[];
  referenceNumber?: string; // e.g. PO-8821, WO-9921, DISPENSE-4421, SIMPER-0912
}

export interface VerificationDetails {
  inspectorName?: string;
  inspectorRole?: string;
  inspectionTimestamp?: string;
  verificationStatus: "PENDING" | "PASSED" | "PASSED_WITH_NOTE" | "FAILED";
  checklistScorePct?: number;
  findings?: string;
  digitalSignCertHash?: string;
  qrVerificationCode?: string;
}

export interface ApprovalItemDetail {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export interface DigitalApprovalRequest {
  id: string; // e.g. "REQ-PUR-2026-0891"
  requestCode: string;
  category: ApprovalCategory;
  title: string;
  description: string;
  urgency: ApprovalUrgency;
  currentStage: ApprovalStage;
  status: ApprovalStatus;
  
  // Requester Info
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterDept: string;
  requesterAvatar?: string;
  requestedAt: string;
  
  // Target Domain / Asset / Location
  targetLocation?: string; // e.g. "Pit 02 Seam B", "Workshop Main", "Stockpile 03"
  relatedUnitId?: string;  // e.g. "HD-08", "EX-301", "DZ-14"
  costEstimateIdr?: number; // Estimated financial cost
  costCenterCode?: string;
  
  // Structured Category Specific Items
  itemDetails: ApprovalItemDetail[];

  // 4-Stage Traceability
  // Stage 1: Request
  slaHoursRemaining: number;
  dueDate: string;
  isSlaBreached: boolean;

  // Stage 2: Approval Matrix (Sequential Tiers)
  approvalMatrix: ApprovalStepApprover[];
  currentPendingTier: number;

  // Stage 3: Execution Info
  executionLogs: ExecutionLog[];
  executionProgressPct: number;
  assignedExecutor?: string;

  // Stage 4: Verification Info
  verification: VerificationDetails;

  // AI Copilot Risk & Compliance Evaluation
  aiEvaluation: {
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    complianceScorePct: number;
    budgetImpactSummary?: string;
    anomalyDetected: boolean;
    anomalyWarning?: string;
    recommendation: "AUTO_RECOMMEND_APPROVE" | "REQUIRE_MANUAL_SCRUTINY" | "POTENTIAL_BUDGET_OVERRUN";
    aiNote: string;
  };

  // Digital Security & Audit Lineage (Who, What, When, Where, Before, After)
  digitalSignatureId: string;
  qrCodeUrl?: string;
  tamperProofHash: string;
  auditTrail: {
    timestamp: string; // When
    actor: string;    // Who
    action: string;   // What
    stage: ApprovalStage;
    details: string;
    where?: string;   // Where (Location/Device/IP)
    before?: string;  // Before state/value
    after?: string;   // After state/value
    diffDelta?: string; // e.g. "DRAFT → APPROVED" or "+200 L"
  }[];
}

export interface ApprovalSummaryMetrics {
  totalRequests: number;
  pendingMyApprovalCount: number;
  inExecutionCount: number;
  inVerificationCount: number;
  completedThisMonth: number;
  slaComplianceRatePct: number;
  categoryCounts: Record<ApprovalCategory, number>;
  stageCounts: Record<ApprovalStage, number>;
}
