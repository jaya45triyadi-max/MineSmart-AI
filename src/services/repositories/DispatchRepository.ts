// MINE SMART AI - Dispatch Repository

import { BaseRepository } from "./BaseRepository";
import {
  DispatchRecord,
  DispatchQueueItem,
  DispatchLoadingRecord,
  DispatchHaulingRecord,
  DispatchDumpingRecord,
  DispatchReturnRecord,
  DispatchCycleDetail,
  ExcavatorTruckMatchScore,
  DispatchScenarioResult,
  DispatchAlertRecord,
  DispatchOptimizationAudit,
} from "../../types/dispatchTypes";

import {
  INITIAL_DISPATCH_RECORDS,
  INITIAL_DISPATCH_QUEUES,
  INITIAL_DISPATCH_LOADINGS,
  INITIAL_DISPATCH_HAULINGS,
  INITIAL_DISPATCH_DUMPINGS,
  INITIAL_DISPATCH_RETURNS,
  INITIAL_DISPATCH_CYCLES,
  INITIAL_EXCAVATOR_TRUCK_MATCHES,
  INITIAL_DISPATCH_SCENARIOS,
  INITIAL_DISPATCH_ALERTS,
  INITIAL_OPTIMIZATION_AUDITS,
} from "../../data/dispatchData";

export class DispatchRepository extends BaseRepository<DispatchRecord> {
  private queueList: DispatchQueueItem[] = [...INITIAL_DISPATCH_QUEUES];
  private loadingList: DispatchLoadingRecord[] = [...INITIAL_DISPATCH_LOADINGS];
  private haulingList: DispatchHaulingRecord[] = [...INITIAL_DISPATCH_HAULINGS];
  private dumpingList: DispatchDumpingRecord[] = [...INITIAL_DISPATCH_DUMPINGS];
  private returnList: DispatchReturnRecord[] = [...INITIAL_DISPATCH_RETURNS];
  private cycleList: DispatchCycleDetail[] = [...INITIAL_DISPATCH_CYCLES];
  private matchesList: ExcavatorTruckMatchScore[] = [...INITIAL_EXCAVATOR_TRUCK_MATCHES];
  private scenariosList: DispatchScenarioResult[] = [...INITIAL_DISPATCH_SCENARIOS];
  private alertsList: DispatchAlertRecord[] = [...INITIAL_DISPATCH_ALERTS];
  private auditList: DispatchOptimizationAudit[] = [...INITIAL_OPTIMIZATION_AUDITS];

  constructor() {
    super("dispatch_records", INITIAL_DISPATCH_RECORDS);
  }

  public getAllDispatches(): DispatchRecord[] {
    return this.mockFallbackData;
  }

  public getActiveDispatches(): DispatchRecord[] {
    return this.mockFallbackData.filter((d) => d.assignmentStatus === "ACTIVE");
  }

  public getDispatchById(id: string): DispatchRecord | undefined {
    return this.mockFallbackData.find((d) => d.id === id || d.dispatchId === id);
  }

  public createDispatch(record: Omit<DispatchRecord, "id" | "createdAt" | "updatedAt">): DispatchRecord {
    const id = `DISP-${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 12)}-${Math.floor(Math.random() * 900 + 100)}`;
    const newRecord: DispatchRecord = {
      ...record,
      id,
      dispatchId: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    this.mockFallbackData.unshift(newRecord);
    return newRecord;
  }

  public updateDispatchStatus(id: string, newStatus: DispatchRecord["dispatchStatus"]): DispatchRecord | null {
    const record = this.getDispatchById(id);
    if (record) {
      record.dispatchStatus = newStatus;
      record.lastUpdateTimestamp = new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      return record;
    }
    return null;
  }

  public reassignDispatch(id: string, excavatorId: string, excavatorCode: string, origin: string, destination: string): DispatchRecord | null {
    const record = this.getDispatchById(id);
    if (record) {
      record.excavatorId = excavatorId;
      record.excavatorUnitCode = excavatorCode;
      record.originName = origin;
      record.destinationName = destination;
      record.lastUpdateTimestamp = new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      return record;
    }
    return null;
  }

  // Queue
  public getQueues(): DispatchQueueItem[] {
    return this.queueList;
  }

  public addQueueItem(item: Omit<DispatchQueueItem, "id" | "createdAt" | "updatedAt">): DispatchQueueItem {
    const id = `Q-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newItem: DispatchQueueItem = {
      ...item,
      id,
      queueId: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    this.queueList.unshift(newItem);
    return newItem;
  }

  // Loadings
  public getLoadings(): DispatchLoadingRecord[] {
    return this.loadingList;
  }

  // Haulings
  public getHaulings(): DispatchHaulingRecord[] {
    return this.haulingList;
  }

  // Dumpings
  public getDumpings(): DispatchDumpingRecord[] {
    return this.dumpingList;
  }

  // Returns
  public getReturns(): DispatchReturnRecord[] {
    return this.returnList;
  }

  // Cycles
  public getCycles(): DispatchCycleDetail[] {
    return this.cycleList;
  }

  public addCycle(cycle: Omit<DispatchCycleDetail, "id">): DispatchCycleDetail {
    const newCycle: DispatchCycleDetail = {
      ...cycle,
      id: `CYC-${Math.floor(Math.random() * 9000 + 1000)}`,
    };
    this.cycleList.unshift(newCycle);
    return newCycle;
  }

  // Matching
  public getMatchingScores(): ExcavatorTruckMatchScore[] {
    return this.matchesList;
  }

  // Scenarios
  public getScenarios(): DispatchScenarioResult[] {
    return this.scenariosList;
  }

  public addScenario(scenario: DispatchScenarioResult): DispatchScenarioResult {
    this.scenariosList.unshift(scenario);
    return scenario;
  }

  // Alerts
  public getAlerts(): DispatchAlertRecord[] {
    return this.alertsList;
  }

  public resolveAlert(alertId: string): void {
    const alert = this.alertsList.find((a) => a.alertId === alertId);
    if (alert) {
      alert.isResolved = true;
    }
  }

  // Audit
  public getAudits(): DispatchOptimizationAudit[] {
    return this.auditList;
  }

  public addAudit(audit: Omit<DispatchOptimizationAudit, "id" | "createdAt" | "updatedAt">): DispatchOptimizationAudit {
    const id = `AUDIT-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newAudit: DispatchOptimizationAudit = {
      ...audit,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    this.auditList.unshift(newAudit);
    return newAudit;
  }
}

export const dispatchRepository = new DispatchRepository();
