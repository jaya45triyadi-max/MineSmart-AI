// MINE SMART AI - HSE Repository

import { BaseRepository } from "./BaseRepository";
import {
  HSEIncident,
  AccidentRecord,
  NearMissRecord,
  Hazard,
  HSEInspection,
  SafetyObservation,
  JSA,
  WorkPermit,
  ToolboxMeeting,
  RiskAssessmentItem,
  CorrectiveActionItem,
  ContractorHSE,
  EmergencyContact,
  EmergencyPlan,
  EnvironmentalIncidentRecord,
  HSEAIInsight,
  HSEKPISummary,
  PermitStatus,
  CorrectiveActionStatus,
} from "../../types/hseTypes";

import {
  MOCK_HSE_KPIS,
  MOCK_HSE_INCIDENTS,
  MOCK_HSE_ACCIDENTS,
  MOCK_HSE_NEAR_MISSES,
  MOCK_HSE_HAZARDS,
  MOCK_HSE_INSPECTIONS,
  MOCK_SAFETY_OBSERVATIONS,
  MOCK_JSAS,
  MOCK_WORK_PERMITS,
  MOCK_TOOLBOX_MEETINGS,
  MOCK_RISK_ASSESSMENTS,
  MOCK_CORRECTIVE_ACTIONS,
  MOCK_CONTRACTOR_HSE,
  MOCK_EMERGENCY_CONTACTS,
  MOCK_EMERGENCY_PLAN,
  MOCK_ENV_INCIDENTS,
  MOCK_HSE_AI_INSIGHTS,
} from "../../data/hseData";

export class HSERepository extends BaseRepository<HSEIncident> {
  private accidents: AccidentRecord[] = [...MOCK_HSE_ACCIDENTS];
  private nearMisses: NearMissRecord[] = [...MOCK_HSE_NEAR_MISSES];
  private hazards: Hazard[] = [...MOCK_HSE_HAZARDS];
  private inspections: HSEInspection[] = [...MOCK_HSE_INSPECTIONS];
  private observations: SafetyObservation[] = [...MOCK_SAFETY_OBSERVATIONS];
  private jsas: JSA[] = [...MOCK_JSAS];
  private permits: WorkPermit[] = [...MOCK_WORK_PERMITS];
  private toolboxMeetings: ToolboxMeeting[] = [...MOCK_TOOLBOX_MEETINGS];
  private riskAssessments: RiskAssessmentItem[] = [...MOCK_RISK_ASSESSMENTS];
  private correctiveActions: CorrectiveActionItem[] = [...MOCK_CORRECTIVE_ACTIONS];
  private contractors: ContractorHSE[] = [...MOCK_CONTRACTOR_HSE];
  private emergencyContacts: EmergencyContact[] = [...MOCK_EMERGENCY_CONTACTS];
  private emergencyPlan: EmergencyPlan = { ...MOCK_EMERGENCY_PLAN };
  private envIncidents: EnvironmentalIncidentRecord[] = [...MOCK_ENV_INCIDENTS];
  private aiInsights: HSEAIInsight[] = [...MOCK_HSE_AI_INSIGHTS];

  constructor() {
    super("hse_incidents", MOCK_HSE_INCIDENTS);
  }

  // --- KPI SUMMARY ---
  async getKPISummary(): Promise<HSEKPISummary> {
    const incidents = await this.getAll();
    const openHazards = this.hazards.filter((h) => h.status !== "CLOSED").length;
    const openActions = this.correctiveActions.filter((a) => a.status !== "CLOSED" && a.status !== "VERIFIED").length;
    const overdueActions = this.correctiveActions.filter((a) => a.status === "OVERDUE").length;
    const activePermits = this.permits.filter((p) => p.approvalStatus === "ACTIVE").length;
    const activeJSA = this.jsas.filter((j) => j.approvalStatus === "APPROVED").length;

    return {
      ...MOCK_HSE_KPIS,
      totalIncidents: incidents.length,
      accidentsCount: this.accidents.length,
      nearMissCount: this.nearMisses.length,
      openHazardsCount: openHazards,
      openActionsCount: openActions,
      overdueActionsCount: overdueActions,
      permitsActiveCount: activePermits,
      jsaActiveCount: activeJSA,
    };
  }

  // --- INCIDENTS ---
  async getIncidentsBySeverity(severity: string, companyId?: string, siteId?: string): Promise<HSEIncident[]> {
    const list = await this.getAll(companyId, siteId);
    return list.filter((inc) => inc.severity === severity);
  }

  // --- ACCIDENTS ---
  async getAccidents(): Promise<AccidentRecord[]> {
    return this.accidents;
  }

  async createAccident(acc: Omit<AccidentRecord, "id" | "createdAt" | "updatedAt">): Promise<AccidentRecord> {
    const newAcc: AccidentRecord = {
      ...acc,
      id: `ACC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accidents.unshift(newAcc);
    return newAcc;
  }

  // --- NEAR MISSES ---
  async getNearMisses(): Promise<NearMissRecord[]> {
    return this.nearMisses;
  }

  async createNearMiss(nm: Omit<NearMissRecord, "id" | "createdAt" | "updatedAt">): Promise<NearMissRecord> {
    const newNM: NearMissRecord = {
      ...nm,
      id: `NM-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nearMisses.unshift(newNM);
    return newNM;
  }

  // --- HAZARDS ---
  async getHazards(): Promise<Hazard[]> {
    return this.hazards;
  }

  async createHazard(haz: Omit<Hazard, "id" | "createdAt" | "updatedAt">): Promise<Hazard> {
    const newHaz: Hazard = {
      ...haz,
      id: `HAZ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.hazards.unshift(newHaz);
    return newHaz;
  }

  async updateHazardStatus(hazardId: string, status: Hazard["status"]): Promise<Hazard | undefined> {
    const item = this.hazards.find((h) => h.hazardId === hazardId || h.id === hazardId);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- INSPECTIONS ---
  async getInspections(): Promise<HSEInspection[]> {
    return this.inspections;
  }

  async createInspection(insp: Omit<HSEInspection, "id" | "createdAt" | "updatedAt">): Promise<HSEInspection> {
    const newInsp: HSEInspection = {
      ...insp,
      id: `INSP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.inspections.unshift(newInsp);

    // Auto create Corrective Action for FAIL items
    insp.items.forEach((itm) => {
      if (itm.status === "FAIL" && itm.correctiveActionRequired) {
        this.createCorrectiveAction({
          actionId: `CAPA-${Date.now()}`,
          actionNumber: `CAPA-INSP-${Math.floor(1000 + Math.random() * 9000)}`,
          sourceType: "Inspection",
          sourceId: newInsp.inspectionNumber,
          description: `Temuan inspeksi [${itm.category}]: ${itm.requirement} - ${itm.observation || "Memerlukan perbaikan segera."}`,
          actionType: "CORRECTIVE",
          priority: itm.riskLevel === "EXTREME" || itm.riskLevel === "HIGH" ? "CRITICAL" : "MEDIUM",
          ownerName: "Duty Inspector",
          departmentName: "Site Operations",
          dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split("T")[0],
          status: "OPEN",
        });
      }
    });

    return newInsp;
  }

  // --- OBSERVATIONS ---
  async getObservations(): Promise<SafetyObservation[]> {
    return this.observations;
  }

  async createObservation(obs: Omit<SafetyObservation, "id" | "createdAt" | "updatedAt">): Promise<SafetyObservation> {
    const newObs: SafetyObservation = {
      ...obs,
      id: `OBS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.observations.unshift(newObs);
    return newObs;
  }

  // --- JSAs ---
  async getJSAs(): Promise<JSA[]> {
    return this.jsas;
  }

  async createJSA(jsa: Omit<JSA, "id" | "createdAt" | "updatedAt">): Promise<JSA> {
    const newJSA: JSA = {
      ...jsa,
      id: `JSA-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.jsas.unshift(newJSA);
    return newJSA;
  }

  async approveJSA(jsaId: string, approvedBy: string): Promise<JSA | undefined> {
    const item = this.jsas.find((j) => j.jsaId === jsaId || j.id === jsaId);
    if (item) {
      item.approvalStatus = "APPROVED";
      item.approvedBy = approvedBy;
      item.approvedAt = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- PERMITS ---
  async getPermits(): Promise<WorkPermit[]> {
    return this.permits;
  }

  async validateAndActivatePermit(permitId: string, approvedBy: string): Promise<{ success: boolean; permit?: WorkPermit; errors: string[] }> {
    const item = this.permits.find((p) => p.permitId === permitId || p.id === permitId);
    if (!item) return { success: false, errors: ["Permit not found."] };

    const errors: string[] = [];
    if (!item.jsaApproved) errors.push("Approved Job Safety Analysis (JSA) is required.");
    if (!item.riskAssessmentDone) errors.push("Risk Assessment validation incomplete.");
    if (!item.supervisorName) errors.push("Responsible Supervisor must be assigned.");
    if (item.isolationLOTORequired && !item.isolationLOTOVerified) errors.push("Isolation / LOTO verification incomplete.");
    if (!item.emergencyPlanDefined) errors.push("Emergency Plan must be defined.");

    if (errors.length > 0) {
      item.invalidationReasons = errors;
      return { success: false, permit: item, errors };
    }

    item.approvalStatus = "ACTIVE";
    item.approvedBy = approvedBy;
    item.invalidationReasons = [];
    item.updatedAt = new Date().toISOString();
    return { success: true, permit: item, errors: [] };
  }

  async createPermit(permit: Omit<WorkPermit, "id" | "createdAt" | "updatedAt">): Promise<WorkPermit> {
    const newPermit: WorkPermit = {
      ...permit,
      id: `PTW-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.permits.unshift(newPermit);
    return newPermit;
  }

  async updatePermitStatus(permitId: string, status: PermitStatus): Promise<WorkPermit | undefined> {
    const item = this.permits.find((p) => p.permitId === permitId || p.id === permitId);
    if (item) {
      item.approvalStatus = status;
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- TOOLBOX MEETINGS ---
  async getToolboxMeetings(): Promise<ToolboxMeeting[]> {
    return this.toolboxMeetings;
  }

  async createToolboxMeeting(tbm: Omit<ToolboxMeeting, "id" | "createdAt" | "updatedAt">): Promise<ToolboxMeeting> {
    const newTBM: ToolboxMeeting = {
      ...tbm,
      id: `TBM-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.toolboxMeetings.unshift(newTBM);
    return newTBM;
  }

  // --- RISK ASSESSMENTS ---
  async getRiskAssessments(): Promise<RiskAssessmentItem[]> {
    return this.riskAssessments;
  }

  async createRiskAssessment(ra: Omit<RiskAssessmentItem, "id" | "createdAt" | "updatedAt">): Promise<RiskAssessmentItem> {
    const newRA: RiskAssessmentItem = {
      ...ra,
      id: `RA-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.riskAssessments.unshift(newRA);
    return newRA;
  }

  // --- CORRECTIVE ACTIONS ---
  async getCorrectiveActions(): Promise<CorrectiveActionItem[]> {
    return this.correctiveActions;
  }

  async createCorrectiveAction(ca: Omit<CorrectiveActionItem, "id" | "createdAt" | "updatedAt">): Promise<CorrectiveActionItem> {
    const newCA: CorrectiveActionItem = {
      ...ca,
      id: `CAPA-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.correctiveActions.unshift(newCA);
    return newCA;
  }

  async updateCorrectiveActionStatus(
    actionId: string,
    status: CorrectiveActionStatus,
    verifiedBy?: string,
    verificationNotes?: string
  ): Promise<CorrectiveActionItem | undefined> {
    const item = this.correctiveActions.find((a) => a.actionId === actionId || a.id === actionId);
    if (item) {
      item.status = status;
      if (verifiedBy) {
        item.verifiedBy = verifiedBy;
        item.verifiedAt = new Date().toISOString();
      }
      if (verificationNotes) {
        item.verificationNotes = verificationNotes;
      }
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- CONTRACTORS & OTHER INTEGRATIONS ---
  async getContractorHSE(): Promise<ContractorHSE[]> {
    return this.contractors;
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return this.emergencyContacts;
  }

  async getEmergencyPlan(): Promise<EmergencyPlan> {
    return this.emergencyPlan;
  }

  async getEnvironmentalIncidents(): Promise<EnvironmentalIncidentRecord[]> {
    return this.envIncidents;
  }

  async getAIInsights(): Promise<HSEAIInsight[]> {
    return this.aiInsights;
  }

  // --- AI ASSISTANT QUERY ---
  async queryAIHSEAssistant(query: string): Promise<string> {
    const q = query.toLowerCase();
    if (q.includes("incident") || q.includes("insiden")) {
      const incs = await this.getAll();
      return `Berdasarkan record aktual HSE, tercatat total ${incs.length} kejadian insiden terdaftar. ${
        this.accidents.length
      } kecelakaan medis (Accident), ${this.nearMisses.length} Near Miss, dan ${
        this.hazards.filter((h) => h.status !== "CLOSED").length
      } Hazard terbuka. Insiden terakhir terjadi pada area ${incs[0]?.locationName || "Haul Road"}.`;
    } else if (q.includes("hazard") || q.includes("bahaya")) {
      const openH = this.hazards.filter((h) => h.status !== "CLOSED");
      return `Saat ini terdapat ${openH.length} potensi bahaya (Hazard) aktif yang memerlukan pemantauan. Kategori tertinggi adalah Geoteknik dinding lereng (Pit Bravo) dan debu tebal jalan hauling.`;
    } else if (q.includes("permit") || q.includes("ptw") || q.includes("izin")) {
      const activeP = this.permits.filter((p) => p.approvalStatus === "ACTIVE");
      return `Terdapat ${activeP.length} Izin Kerja Aktif (Permit to Work), termasuk Hot Work pengelasan di Port Jetty Line 2. 1 izin kerja Confined Space sedang ditangguhkan karena syarat kelengkapan JSA.`;
    } else if (q.includes("action") || q.includes("capa") || q.includes("korektif")) {
      const openCA = this.correctiveActions.filter((a) => a.status !== "CLOSED");
      const overdue = this.correctiveActions.filter((a) => a.status === "OVERDUE");
      return `Terdapat ${openCA.length} Tindakan Korektif (CAPA) aktif, dengan ${overdue.length} status overdue. Tindakan dengan prioritas tertinggi adalah pengadaan rambu aquaplaning di KM 4.`;
    } else {
      return `HSE Command Center melaporkan Indeks Keselamatan Tambang: ${MOCK_HSE_KPIS.daysWithoutLTI} hari tanpa Lost Time Injury (LTI), TRIFR ${MOCK_HSE_KPIS.trifr}, dan LTIFR ${MOCK_HSE_KPIS.ltifr}. Semua sistem pemantauan K3LH beroperasi normal.`;
    }
  }
}

export const hseRepository = new HSERepository();
