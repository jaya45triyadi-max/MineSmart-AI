// MINE SMART AI - Enterprise Maintenance Repository & Data Service

import { BaseRepository } from "./BaseRepository";
import {
  WorkOrder,
  SparePart,
  MaintenanceTypeDefinition,
  AIEarlyWarningAlert,
  MaintenanceKPIs,
  WorkOrderStage,
  WorkOrderPriority,
  MaintenanceType,
  AIPredictiveTelemetry
} from "../../types/maintenanceTypes";
import {
  INITIAL_WORK_ORDERS,
  INITIAL_SPARE_PARTS,
  INITIAL_MAINTENANCE_TYPES,
  INITIAL_AI_EARLY_WARNINGS,
  INITIAL_MAINTENANCE_KPIS,
  INITIAL_PREDICTIVE_TELEMETRIES
} from "../../data/maintenanceMockData";

const WO_KEY = "minesmart_maintenance_work_orders";
const PARTS_KEY = "minesmart_spare_parts";
const TYPES_KEY = "minesmart_maintenance_types";
const WARNINGS_KEY = "minesmart_ai_early_warnings";

function getStageIndex(stage: WorkOrderStage): number {
  const stages: WorkOrderStage[] = [
    "Request",
    "Approval",
    "Assignment",
    "Repair",
    "Testing",
    "Closing",
  ];
  const idx = stages.indexOf(stage);
  return idx === -1 ? 1 : idx + 1;
}

export class MaintenanceRepository {
  private woKey = WO_KEY;
  private partsKey = PARTS_KEY;
  private typesKey = TYPES_KEY;
  private warningsKey = WARNINGS_KEY;

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem(this.woKey)) {
        localStorage.setItem(this.woKey, JSON.stringify(INITIAL_WORK_ORDERS));
      }
      if (!localStorage.getItem(this.partsKey)) {
        localStorage.setItem(this.partsKey, JSON.stringify(INITIAL_SPARE_PARTS));
      }
      if (!localStorage.getItem(this.typesKey)) {
        localStorage.setItem(this.typesKey, JSON.stringify(INITIAL_MAINTENANCE_TYPES));
      }
      if (!localStorage.getItem(this.warningsKey)) {
        localStorage.setItem(this.warningsKey, JSON.stringify(INITIAL_AI_EARLY_WARNINGS));
      }
    }
  }

  // --- STATIC CONVENIENCE METHODS ---
  static getWorkOrders(): WorkOrder[] {
    if (typeof window === "undefined") return INITIAL_WORK_ORDERS;
    const data = localStorage.getItem(WO_KEY);
    return data ? JSON.parse(data) : INITIAL_WORK_ORDERS;
  }

  static getSpareParts(): SparePart[] {
    if (typeof window === "undefined") return INITIAL_SPARE_PARTS;
    const data = localStorage.getItem(PARTS_KEY);
    return data ? JSON.parse(data) : INITIAL_SPARE_PARTS;
  }

  static getEarlyWarnings(): AIEarlyWarningAlert[] {
    if (typeof window === "undefined") return INITIAL_AI_EARLY_WARNINGS;
    const data = localStorage.getItem(WARNINGS_KEY);
    return data ? JSON.parse(data) : INITIAL_AI_EARLY_WARNINGS;
  }

  static getMaintenanceTypes(): MaintenanceTypeDefinition[] {
    if (typeof window === "undefined") return INITIAL_MAINTENANCE_TYPES;
    const data = localStorage.getItem(TYPES_KEY);
    return data ? JSON.parse(data) : INITIAL_MAINTENANCE_TYPES;
  }

  static getPredictiveTelemetries(): AIPredictiveTelemetry[] {
    return INITIAL_PREDICTIVE_TELEMETRIES;
  }

  static transitionWorkOrderStage(id: string, nextStage: WorkOrderStage): WorkOrder | undefined {
    const list = this.getWorkOrders();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) return undefined;

    const current = list[index];
    const stageIndex = getStageIndex(nextStage);
    const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    const updated: WorkOrder = {
      ...current,
      stage: nextStage,
      stageIndex,
      updatedAt: new Date().toISOString(),
    };

    if (nextStage === "Approval" && !updated.approvalStatus) {
      updated.approvalStatus = "APPROVED";
      updated.approvalDate = nowStr;
      updated.approvedBy = "Ir. Hendra Gunawan (Maintenance Superintendent)";
    } else if (nextStage === "Assignment" && !updated.assignedLeadMechanic) {
      updated.assignedLeadMechanic = "Budi Hartono (Master Technician)";
      updated.assignedWorkshopBay = "Bay 3 (Overhaul & Diagnostics)";
    } else if (nextStage === "Repair" && !updated.actualStartDate) {
      updated.actualStartDate = nowStr;
    } else if (nextStage === "Testing" && !updated.testingQC) {
      updated.testingQC = {
        testedBy: "Dimas Anggara (QC Engineer)",
        testDate: nowStr,
        testRunHoursSMU: 1.5,
        engineRpmTest: "Low Idle 800 RPM / High Idle 2150 RPM - Normal",
        hydraulicPressurePsi: 4850,
        operatingTempCelsius: 86,
        safetyCheckPassed: true,
        leakageCheckPassed: true,
        brakesAndSteeringPassed: true,
        overallStatus: "PASSED",
        qcNotes: "All operational parameters within OEM nominal range.",
      };
    } else if (nextStage === "Closing") {
      updated.closedBy = "Ir. Hendra Gunawan";
      updated.closedAt = nowStr;
      updated.releasedToOperations = true;
      updated.actualEndDate = nowStr;
      updated.feedbackScore = 5;
    }

    list[index] = updated;
    localStorage.setItem(WO_KEY, JSON.stringify(list));
    return updated;
  }

  static updateWorkOrder(updatedWO: WorkOrder): WorkOrder {
    const list = this.getWorkOrders();
    const index = list.findIndex((w) => w.id === updatedWO.id);
    const labor = updatedWO.laborCostIDR || 0;
    const parts = updatedWO.partsCostIDR || 0;
    const other = updatedWO.otherCostIDR || 0;
    const totalCostIDR = labor + parts + other;

    const finalWO: WorkOrder = {
      ...updatedWO,
      stageIndex: getStageIndex(updatedWO.stage),
      totalCostIDR,
      updatedAt: new Date().toISOString(),
    };

    if (index !== -1) {
      list[index] = finalWO;
    } else {
      list.unshift(finalWO);
    }
    localStorage.setItem(WO_KEY, JSON.stringify(list));
    return finalWO;
  }

  static createWorkOrder(wo: Partial<WorkOrder>): WorkOrder {
    const list = this.getWorkOrders();
    const count = list.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const woNumber = wo.woNumber || `WO-${dateStr}-${String(count).padStart(3, "0")}`;

    const newWO: WorkOrder = {
      id: `WO-${Date.now()}`,
      woNumber,
      title: wo.title || `Work Order ${wo.equipmentCode}`,
      equipmentId: wo.equipmentId || `EQ-${wo.equipmentCode}`,
      equipmentCode: wo.equipmentCode || "EX-101",
      equipmentType: wo.equipmentType || "Heavy Equipment",
      maintenanceType: wo.maintenanceType || "Preventive",
      priority: wo.priority || "Medium",
      stage: wo.stage || "Request",
      stageIndex: getStageIndex(wo.stage || "Request"),
      description: wo.description || "",
      defectDetails: wo.defectDetails || "",
      failureCategory: wo.failureCategory || "General Maintenance",
      location: wo.location || "Workshop Area",
      currentSMU: wo.currentSMU || 10000,
      requestedBy: wo.requestedBy || "Maintenance Planner",
      requestDate: wo.requestDate || new Date().toISOString().slice(0, 16).replace("T", " "),
      originSource: wo.originSource || "OPERATOR_LOG",
      approvalStatus: wo.approvalStatus || "PENDING",
      estimatedBudgetIDR: wo.estimatedBudgetIDR || 10000000,
      mechanicTeam: wo.mechanicTeam || [],
      tasksChecklist: wo.tasksChecklist || [
        { id: "T1", taskDescription: "Inspeksi visual & parameter operasional", category: "Inspection", isCompleted: false },
        { id: "T2", taskDescription: "Eksekusi penggantian part / perbaikan komponen", category: "Replacement", isCompleted: false },
        { id: "T3", taskDescription: "Commissioning test-run & quality inspection", category: "Testing", isCompleted: false },
      ],
      sparePartsUsed: wo.sparePartsUsed || [],
      laborCostIDR: wo.laborCostIDR || 0,
      partsCostIDR: wo.partsCostIDR || 0,
      otherCostIDR: wo.otherCostIDR || 0,
      totalCostIDR: (wo.laborCostIDR || 0) + (wo.partsCostIDR || 0) + (wo.otherCostIDR || 0),
      downtimeHours: wo.downtimeHours || 0,
      estimatedDurationHours: wo.estimatedDurationHours || 4,
      releasedToOperations: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      ...wo,
    };

    list.unshift(newWO);
    localStorage.setItem(WO_KEY, JSON.stringify(list));
    return newWO;
  }

  static updateSparePartStock(id: string, delta: number, notes?: string): SparePart | undefined {
    const list = this.getSpareParts();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const current = list[index];
    const newStock = Math.max(0, current.stock + delta);
    const isLowStock = newStock <= current.minimumStock;
    const totalValuationIDR = newStock * current.unitPriceIDR;

    const updated: SparePart = {
      ...current,
      stock: newStock,
      isLowStock,
      totalValuationIDR,
      lastRestockedDate: delta > 0 ? new Date().toISOString().slice(0, 10) : current.lastRestockedDate,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    localStorage.setItem(PARTS_KEY, JSON.stringify(list));
    return updated;
  }

  static createSparePart(part: Partial<SparePart>): SparePart {
    const list = this.getSpareParts();
    const stock = part.stock || 0;
    const unitPrice = part.unitPriceIDR || 1000000;
    const minStock = part.minimumStock || 5;

    const newPart: SparePart = {
      id: `SP-${Date.now()}`,
      partNumber: part.partNumber || `PRT-${Date.now().toString().slice(-4)}`,
      partName: part.partName || "Generic Spare Part",
      category: part.category || "Filters",
      description: part.description || "Mining replacement spare part item",
      stock,
      minimumStock: minStock,
      maxStock: minStock * 4,
      reorderQuantity: minStock * 2,
      unit: part.unit || "PCS",
      unitPriceIDR: unitPrice,
      totalValuationIDR: stock * unitPrice,
      supplier: part.supplier || {
        id: "SUP-01",
        name: "PT United Tractors Tbk",
        contactPerson: "Spare Parts Support",
        phone: "+62 21 4605959",
        email: "parts@unitedtractors.com",
        leadTimeDays: 3,
        city: "Jakarta / Balikpapan",
        isPreferredVendor: true,
        ratingScore: 4.9,
      },
      storageWarehouse: part.storageWarehouse || "Central Warehouse Sangatta",
      binLocation: part.binLocation || "Rack A-01-01",
      compatibleEquipment: part.compatibleEquipment || ["Heavy Mining Equipment"],
      brandOem: part.brandOem || "Genuine OEM",
      isLowStock: stock <= minStock,
      isCriticalStockout: stock === 0,
      lastRestockedDate: new Date().toISOString().slice(0, 10),
      monthlyAverageUsage: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...part,
    };

    list.unshift(newPart);
    localStorage.setItem(PARTS_KEY, JSON.stringify(list));
    return newPart;
  }

  static convertWarningToWorkOrder(warningId: string): WorkOrder | undefined {
    const warnings = this.getEarlyWarnings();
    const wIndex = warnings.findIndex((w) => w.id === warningId);
    if (wIndex === -1) return undefined;

    const warning = warnings[wIndex];

    const newWO = this.createWorkOrder({
      title: `[AI PdM Early Warning] ${warning.predictedFailureComponent} - ${warning.equipmentCode}`,
      equipmentId: warning.equipmentId,
      equipmentCode: warning.equipmentCode,
      equipmentType: warning.equipmentType,
      maintenanceType: "Predictive",
      priority: warning.overallRiskLevel === "Critical" ? "Emergency" : "High",
      stage: "Request",
      description: `Peringatan dini AI: ${warning.aiSynthesizedDiagnosis}`,
      defectDetails: warning.symptomsObserved.join(" | "),
      failureCategory: warning.predictedFailureComponent,
      originSource: "AI_PREDICTIVE_RADAR",
      estimatedBudgetIDR: warning.potentialCostImpactIDR ? Math.round(warning.potentialCostImpactIDR * 0.4) : 25000000,
      tasksChecklist: [
        { id: "T1", taskDescription: `Inspeksi diagnostik sensor & vibrasi: ${warning.predictedFailureComponent}`, category: "Inspection", isCompleted: false },
        { id: "T2", taskDescription: `Tindakan preskriptif: ${warning.prescriptiveAction}`, category: "Replacement", isCompleted: false },
        { id: "T3", taskDescription: "Commissioning test-run parameter normal pasca servis", category: "Testing", isCompleted: false },
      ],
      sparePartsUsed: warning.suggestedSpareParts.map((sp, idx) => ({
        id: `PU-AI-${idx}`,
        partId: `PART-${idx}`,
        partNumber: sp.partNumber,
        partName: sp.partName,
        quantity: sp.requiredQty,
        unit: "PCS",
        unitPriceIDR: sp.unitPriceIDR,
        totalCostIDR: sp.requiredQty * sp.unitPriceIDR,
        issuedFromWarehouse: "Central Warehouse Sangatta",
        issuedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      })),
    });

    warning.status = "WORK_ORDER_CREATED";
    warning.associatedWorkOrderId = newWO.woNumber;
    warning.updatedAt = new Date().toISOString();

    warnings[wIndex] = warning;
    localStorage.setItem(WARNINGS_KEY, JSON.stringify(warnings));

    return newWO;
  }

  static getKPIs(): MaintenanceKPIs {
    const wos = this.getWorkOrders();
    const parts = this.getSpareParts();
    const warnings = this.getEarlyWarnings();

    const stageCounts = {
      request: wos.filter((w) => w.stage === "Request").length,
      approval: wos.filter((w) => w.stage === "Approval").length,
      assignment: wos.filter((w) => w.stage === "Assignment").length,
      repair: wos.filter((w) => w.stage === "Repair").length,
      testing: wos.filter((w) => w.stage === "Testing").length,
      closing: wos.filter((w) => w.stage === "Closing").length,
    };

    const totalValuation = parts.reduce((acc, p) => acc + (p.totalValuationIDR || 0), 0);
    const lowStockCount = parts.filter((p) => p.isLowStock).length;
    const totalCost = wos.reduce((acc, w) => acc + (w.totalCostIDR || 0), 0);
    const activeWarnings = warnings.filter((w) => w.status === "ACTIVE_WARNING" || w.status === "IN_REVIEW").length;
    const criticalRisk = warnings.filter((w) => w.overallRiskLevel === "Critical" && w.status === "ACTIVE_WARNING").length;

    return {
      meanTimeBetweenFailuresMTBF: 540.5,
      meanTimeToRepairMTTR: 4.8,
      preventiveComplianceRatePercent: 92.4,
      fleetPhysicalAvailabilityPA: 89.2,
      fleetMechanicalAvailabilityMA: 91.8,
      activeWorkOrdersCount: wos.filter((w) => w.stage !== "Closing").length,
      workOrdersByStage: stageCounts,
      totalMonthlyMaintenanceCostIDR: totalCost || 348500000,
      sparePartsInventoryValueIDR: totalValuation || 1564300000,
      lowStockPartsAlertCount: lowStockCount,
      activeAIEarlyWarningsCount: activeWarnings,
      criticalRiskEquipmentCount: criticalRisk,
    };
  }

  // --- INSTANCE METHODS (For BaseRepository / PredictiveRepository compatibility) ---
  async create(item: any): Promise<any> {
    return MaintenanceRepository.createWorkOrder(item);
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    return MaintenanceRepository.getWorkOrders();
  }

  async getSpareParts(): Promise<SparePart[]> {
    return MaintenanceRepository.getSpareParts();
  }

  async getAIEarlyWarnings(): Promise<AIEarlyWarningAlert[]> {
    return MaintenanceRepository.getEarlyWarnings();
  }

  async getMaintenanceTypes(): Promise<MaintenanceTypeDefinition[]> {
    return MaintenanceRepository.getMaintenanceTypes();
  }
}

export const maintenanceRepository = new MaintenanceRepository();
