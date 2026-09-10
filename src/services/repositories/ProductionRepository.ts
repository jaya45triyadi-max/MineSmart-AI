import { BaseRepository } from "./BaseRepository";
import {
  ProductionRecord,
  ProductionTarget,
  ConversionFactor,
  ProductionForecast,
  ProductionLossRecord,
  RehandleRecord,
  ROMRecord,
  WasteRecord,
  ProductionAlertItem,
  ProductionReconciliationItem,
  CrushingRecord,
} from "../../types";
import {
  INITIAL_FULL_PRODUCTION_RECORDS,
  INITIAL_CONVERSION_FACTORS,
  INITIAL_PRODUCTION_TARGETS,
  INITIAL_REHANDLE_RECORDS,
  INITIAL_ROM_RECORDS,
  INITIAL_WASTE_RECORDS,
  INITIAL_PRODUCTION_LOSSES,
  INITIAL_PRODUCTION_ALERTS,
  INITIAL_PRODUCTION_RECONCILIATION,
  INITIAL_CRUSHING_RECORDS,
} from "../../data/productionData";

export class ProductionRepository extends BaseRepository<ProductionRecord> {
  private conversionFactors: ConversionFactor[] = INITIAL_CONVERSION_FACTORS;
  private targets: ProductionTarget[] = INITIAL_PRODUCTION_TARGETS;
  private rehandles: RehandleRecord[] = INITIAL_REHANDLE_RECORDS;
  private romRecords: ROMRecord[] = INITIAL_ROM_RECORDS;
  private wasteRecords: WasteRecord[] = INITIAL_WASTE_RECORDS;
  private crushingRecords: CrushingRecord[] = INITIAL_CRUSHING_RECORDS;
  private losses: ProductionLossRecord[] = INITIAL_PRODUCTION_LOSSES;
  private alerts: ProductionAlertItem[] = INITIAL_PRODUCTION_ALERTS;
  private reconciliations: ProductionReconciliationItem[] = INITIAL_PRODUCTION_RECONCILIATION;

  constructor() {
    super("production_records", INITIAL_FULL_PRODUCTION_RECORDS);
  }

  async getRecordsByDateRange(startDate: string, endDate: string, companyId?: string, siteId?: string): Promise<ProductionRecord[]> {
    const list = await this.getAll(companyId, siteId);
    return list.filter((rec) => rec.date >= startDate && rec.date <= endDate);
  }

  async getDailyTotal(date: string, companyId?: string, siteId?: string): Promise<{ totalCoalMT: number; totalOBBCM: number }> {
    const list = await this.getAll(companyId, siteId);
    const dayRecords = list.filter((rec) => rec.date === date);

    const totalCoalMT = dayRecords.reduce((sum, r) => sum + (r.coalMT || r.tonnage || 0), 0);
    const totalOBBCM = dayRecords.reduce((sum, r) => sum + (r.obBCM || r.volume || 0), 0);

    return { totalCoalMT, totalOBBCM };
  }

  // Conversion Factors
  async getConversionFactors(companyId?: string, siteId?: string): Promise<ConversionFactor[]> {
    return this.conversionFactors.filter(f => !f.isDeleted && (!companyId || f.companyId === companyId));
  }

  async addConversionFactor(factor: Omit<ConversionFactor, "id" | "createdAt" | "updatedAt">): Promise<ConversionFactor> {
    const now = new Date().toISOString();
    const newFactor: ConversionFactor = {
      ...factor,
      id: `CF-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.conversionFactors.push(newFactor);
    return newFactor;
  }

  // Targets
  async getTargets(companyId?: string, siteId?: string): Promise<ProductionTarget[]> {
    return this.targets.filter(t => !t.isDeleted && (!companyId || t.companyId === companyId));
  }

  async addTarget(target: Omit<ProductionTarget, "id" | "createdAt" | "updatedAt">): Promise<ProductionTarget> {
    const now = new Date().toISOString();
    const newTarget: ProductionTarget = {
      ...target,
      id: `TGT-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.targets.unshift(newTarget);
    return newTarget;
  }

  async updateTargetStatus(targetId: string, status: ProductionTarget["status"], approvedBy?: string): Promise<ProductionTarget | null> {
    const t = this.targets.find(x => x.targetId === targetId || x.id === targetId);
    if (t) {
      t.status = status;
      if (approvedBy) t.approvedBy = approvedBy;
      t.updatedAt = new Date().toISOString();
      return t;
    }
    return null;
  }

  // Rehandle
  async getRehandleRecords(companyId?: string, siteId?: string): Promise<RehandleRecord[]> {
    return this.rehandles.filter(r => !r.isDeleted && (!companyId || r.companyId === companyId));
  }

  async addRehandleRecord(rec: Omit<RehandleRecord, "id" | "createdAt" | "updatedAt">): Promise<RehandleRecord> {
    const now = new Date().toISOString();
    const item: RehandleRecord = {
      ...rec,
      id: `REH-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.rehandles.unshift(item);
    return item;
  }

  // ROM
  async getROMRecords(companyId?: string, siteId?: string): Promise<ROMRecord[]> {
    return this.romRecords.filter(r => !r.isDeleted && (!companyId || r.companyId === companyId));
  }

  async addROMRecord(rec: Omit<ROMRecord, "id" | "createdAt" | "updatedAt">): Promise<ROMRecord> {
    const now = new Date().toISOString();
    const item: ROMRecord = {
      ...rec,
      id: `ROM-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.romRecords.unshift(item);
    return item;
  }

  // Waste
  async getWasteRecords(companyId?: string, siteId?: string): Promise<WasteRecord[]> {
    return this.wasteRecords.filter(w => !w.isDeleted && (!companyId || w.companyId === companyId));
  }

  async addWasteRecord(rec: Omit<WasteRecord, "id" | "createdAt" | "updatedAt">): Promise<WasteRecord> {
    const now = new Date().toISOString();
    const item: WasteRecord = {
      ...rec,
      id: `WST-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.wasteRecords.unshift(item);
    return item;
  }

  // Crushing
  async getCrushingRecords(companyId?: string, siteId?: string): Promise<CrushingRecord[]> {
    return this.crushingRecords.filter(c => !c.isDeleted && (!companyId || c.companyId === companyId));
  }

  async addCrushingRecord(rec: Omit<CrushingRecord, "id" | "createdAt" | "updatedAt">): Promise<CrushingRecord> {
    const now = new Date().toISOString();
    const item: CrushingRecord = {
      ...rec,
      id: `CRUSH-${Math.floor(Math.random() * 90000 + 10000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.crushingRecords.unshift(item);
    return item;
  }

  // Losses
  async getLossRecords(companyId?: string, siteId?: string): Promise<ProductionLossRecord[]> {
    return this.losses.filter(l => !l.isDeleted && (!companyId || l.companyId === companyId));
  }

  // Alerts
  async getAlerts(companyId?: string, siteId?: string): Promise<ProductionAlertItem[]> {
    return this.alerts.filter(a => !a.isDeleted && (!companyId || a.companyId === companyId));
  }

  // Reconciliation
  async getReconciliations(companyId?: string, siteId?: string): Promise<ProductionReconciliationItem[]> {
    return this.reconciliations.filter(r => !r.isDeleted && (!companyId || r.companyId === companyId));
  }
}

export const productionRepository = new ProductionRepository();
