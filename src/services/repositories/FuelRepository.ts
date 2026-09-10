// MINE SMART AI - Fuel Management Repository

import { BaseRepository } from "./BaseRepository";
import {
  FuelProduct,
  FuelTank,
  FuelStation,
  FuelMeter,
  MeterCalibration,
  FuelSupplier,
  FuelReceiving,
  FuelDispensing,
  FuelTransfer,
  FuelAdjustment,
  FuelReconciliation,
  FuelConsumptionRecord,
  FuelAnomaly,
  FuelLossAlert,
  FuelInvestigation,
  FuelForecast,
  FuelStockAlertItem,
  FuelIdleRecord,
  FuelEfficiencyRanking,
  FuelSiphoningAlert,
  FuelReceivingStatus,
  FuelDispensingStatus,
  InvestigationStatus
} from "../../types/fuelTypes";
import {
  INITIAL_FUEL_PRODUCTS,
  INITIAL_FUEL_SUPPLIERS,
  INITIAL_FUEL_TANKS,
  INITIAL_FUEL_STATIONS,
  INITIAL_FUEL_METERS,
  INITIAL_METER_CALIBRATIONS,
  INITIAL_FUEL_RECEIVINGS,
  INITIAL_FUEL_DISPENSINGS,
  INITIAL_FUEL_TRANSFERS,
  INITIAL_FUEL_ADJUSTMENTS,
  INITIAL_FUEL_RECONCILIATIONS,
  INITIAL_CONSUMPTION_RECORDS,
  INITIAL_FUEL_ANOMALIES,
  INITIAL_FUEL_LOSS_ALERTS,
  INITIAL_FUEL_INVESTIGATIONS,
  INITIAL_FUEL_FORECASTS,
  INITIAL_FUEL_STOCK_ALERTS,
  INITIAL_FUEL_IDLE_RECORDS,
  INITIAL_FUEL_EFFICIENCY_RANKINGS,
  INITIAL_FUEL_SIPHONING_ALERTS
} from "../../data/fuelData";

export class FuelRepository extends BaseRepository<FuelDispensing> {
  private products: FuelProduct[] = [...INITIAL_FUEL_PRODUCTS];
  private suppliers: FuelSupplier[] = [...INITIAL_FUEL_SUPPLIERS];
  private tanks: FuelTank[] = [...INITIAL_FUEL_TANKS];
  private stations: FuelStation[] = [...INITIAL_FUEL_STATIONS];
  private meters: FuelMeter[] = [...INITIAL_FUEL_METERS];
  private calibrations: MeterCalibration[] = [...INITIAL_METER_CALIBRATIONS];
  private receivings: FuelReceiving[] = [...INITIAL_FUEL_RECEIVINGS];
  private dispensings: FuelDispensing[] = [...INITIAL_FUEL_DISPENSINGS];
  private transfers: FuelTransfer[] = [...INITIAL_FUEL_TRANSFERS];
  private adjustments: FuelAdjustment[] = [...INITIAL_FUEL_ADJUSTMENTS];
  private reconciliations: FuelReconciliation[] = [...INITIAL_FUEL_RECONCILIATIONS];
  private consumptionRecords: FuelConsumptionRecord[] = [...INITIAL_CONSUMPTION_RECORDS];
  private anomalies: FuelAnomaly[] = [...INITIAL_FUEL_ANOMALIES];
  private lossAlerts: FuelLossAlert[] = [...INITIAL_FUEL_LOSS_ALERTS];
  private investigations: FuelInvestigation[] = [...INITIAL_FUEL_INVESTIGATIONS];
  private forecasts: FuelForecast[] = [...INITIAL_FUEL_FORECASTS];
  private stockAlerts: FuelStockAlertItem[] = [...INITIAL_FUEL_STOCK_ALERTS];
  private idleRecords: FuelIdleRecord[] = [...INITIAL_FUEL_IDLE_RECORDS];
  private efficiencyRankings: FuelEfficiencyRanking[] = [...INITIAL_FUEL_EFFICIENCY_RANKINGS];
  private siphoningAlerts: FuelSiphoningAlert[] = [...INITIAL_FUEL_SIPHONING_ALERTS];

  constructor() {
    super("fuel_dispensing", INITIAL_FUEL_DISPENSINGS);
  }

  // Products
  async getProducts(): Promise<FuelProduct[]> {
    return this.products;
  }

  // Suppliers
  async getSuppliers(): Promise<FuelSupplier[]> {
    return this.suppliers;
  }

  // Tanks
  async getTanks(): Promise<FuelTank[]> {
    return this.tanks;
  }

  async updateTankStock(tankId: string, quantityChange: number): Promise<FuelTank | null> {
    const tank = this.tanks.find(t => t.id === tankId);
    if (tank) {
      tank.currentStock += quantityChange;
      tank.updatedAt = new Date().toISOString();
      return tank;
    }
    return null;
  }

  // Stations
  async getStations(): Promise<FuelStation[]> {
    return this.stations;
  }

  // Meters & Calibration
  async getMeters(): Promise<FuelMeter[]> {
    return this.meters;
  }

  async getCalibrations(): Promise<MeterCalibration[]> {
    return this.calibrations;
  }

  async addCalibration(cal: MeterCalibration): Promise<MeterCalibration> {
    this.calibrations.unshift(cal);
    const mtr = this.meters.find(m => m.id === cal.meterId);
    if (mtr) {
      mtr.lastCalibrationDate = cal.calibrationDate;
      mtr.calibrationStatus = cal.result;
    }
    return cal;
  }

  // Receivings
  async getReceivings(): Promise<FuelReceiving[]> {
    return this.receivings;
  }

  async addReceiving(rcv: FuelReceiving): Promise<FuelReceiving> {
    this.receivings.unshift(rcv);
    return rcv;
  }

  async updateReceivingStatus(id: string, newStatus: FuelReceivingStatus): Promise<FuelReceiving | null> {
    const rcv = this.receivings.find(r => r.id === id);
    if (rcv) {
      rcv.status = newStatus;
      rcv.updatedAt = new Date().toISOString();
      if (newStatus === "Posted" || newStatus === "Approved") {
        // Adjust tank stock if matching
        const tank = this.tanks.find(t => t.name === rcv.receivingLocation || rcv.receivingLocation.includes(t.code));
        if (tank) {
          tank.currentStock += rcv.quantity;
        }
      }
      return rcv;
    }
    return null;
  }

  // Dispensings
  async getDispensings(): Promise<FuelDispensing[]> {
    return this.dispensings;
  }

  async addDispensing(disp: FuelDispensing): Promise<FuelDispensing> {
    this.dispensings.unshift(disp);
    const tank = this.tanks.find(t => t.id === disp.tankId);
    if (tank) {
      tank.currentStock = Math.max(0, tank.currentStock - disp.quantity);
    }
    return disp;
  }

  async updateDispensingStatus(id: string, newStatus: FuelDispensingStatus): Promise<FuelDispensing | null> {
    const disp = this.dispensings.find(d => d.id === id);
    if (disp) {
      disp.status = newStatus;
      disp.updatedAt = new Date().toISOString();
      return disp;
    }
    return null;
  }

  // Transfers
  async getTransfers(): Promise<FuelTransfer[]> {
    return this.transfers;
  }

  async addTransfer(trf: FuelTransfer): Promise<FuelTransfer> {
    this.transfers.unshift(trf);
    return trf;
  }

  // Adjustments
  async getAdjustments(): Promise<FuelAdjustment[]> {
    return this.adjustments;
  }

  async addAdjustment(adj: FuelAdjustment): Promise<FuelAdjustment> {
    this.adjustments.unshift(adj);
    const tank = this.tanks.find(t => t.id === adj.locationId || t.name === adj.locationName);
    if (tank) {
      tank.currentStock += adj.quantity;
    }
    return adj;
  }

  // Reconciliations
  async getReconciliations(): Promise<FuelReconciliation[]> {
    return this.reconciliations;
  }

  async addReconciliation(rec: FuelReconciliation): Promise<FuelReconciliation> {
    this.reconciliations.unshift(rec);
    return rec;
  }

  // Consumptions alias
  async getConsumptions(): Promise<FuelConsumptionRecord[]> {
    return this.consumptionRecords;
  }

  // Alias methods for creation
  async createTransfer(trf: FuelTransfer): Promise<FuelTransfer> {
    return this.addTransfer(trf);
  }

  async createAdjustment(adj: FuelAdjustment): Promise<FuelAdjustment> {
    return this.addAdjustment(adj);
  }

  async createReceiving(rcv: FuelReceiving): Promise<FuelReceiving> {
    return this.addReceiving(rcv);
  }

  async createDispensing(disp: FuelDispensing): Promise<FuelDispensing> {
    return this.addDispensing(disp);
  }

  async createCalibration(cal: MeterCalibration): Promise<MeterCalibration> {
    return this.addCalibration(cal);
  }

  async createReconciliation(rec: FuelReconciliation): Promise<FuelReconciliation> {
    return this.addReconciliation(rec);
  }

  async createInvestigation(inv: FuelInvestigation): Promise<FuelInvestigation> {
    return this.addInvestigation(inv);
  }

  async createTank(tank: FuelTank): Promise<FuelTank> {
    this.tanks.unshift(tank);
    return tank;
  }

  async createStation(station: FuelStation): Promise<FuelStation> {
    this.stations.unshift(station);
    return station;
  }

  // Anomalies
  async getAnomalies(): Promise<FuelAnomaly[]> {
    return this.anomalies;
  }

  async updateAnomalyStatus(id: string, status: "Active" | "Investigating" | "Resolved" | "False Positive"): Promise<FuelAnomaly | null> {
    const anom = this.anomalies.find(a => a.id === id);
    if (anom) {
      anom.status = status;
      anom.updatedAt = new Date().toISOString();
      return anom;
    }
    return null;
  }

  // Loss Alerts & Investigations
  async getLossAlerts(): Promise<FuelLossAlert[]> {
    return this.lossAlerts;
  }

  async getInvestigations(): Promise<FuelInvestigation[]> {
    return this.investigations;
  }

  async addInvestigation(inv: FuelInvestigation): Promise<FuelInvestigation> {
    this.investigations.unshift(inv);
    const alert = this.lossAlerts.find(a => a.id === inv.alertId);
    if (alert) {
      alert.status = inv.status;
    }
    return inv;
  }

  async updateInvestigationStatus(id: string, status: InvestigationStatus, resolution?: string): Promise<FuelInvestigation | null> {
    const inv = this.investigations.find(i => i.id === id);
    if (inv) {
      inv.status = status;
      if (resolution) inv.resolution = resolution;
      if (status === "Closed" || status === "Resolved") {
        inv.closedAt = new Date().toISOString();
        inv.closedBy = "Current User (Supervisor)";
      }
      const alert = this.lossAlerts.find(a => a.id === inv.alertId);
      if (alert) {
        alert.status = status;
      }
      return inv;
    }
    return null;
  }

  // Forecasts & Alerts
  async getForecasts(): Promise<FuelForecast[]> {
    return this.forecasts;
  }

  async getStockAlerts(): Promise<FuelStockAlertItem[]> {
    return this.stockAlerts;
  }

  // AI Fuel Detection: Idle Records
  async getIdleRecords(): Promise<FuelIdleRecord[]> {
    return this.idleRecords;
  }

  async updateIdleRecordStatus(id: string, status: "Flagged" | "Coaching Sent" | "Resolved"): Promise<FuelIdleRecord | null> {
    const rec = this.idleRecords.find(r => r.id === id);
    if (rec) {
      rec.status = status;
      rec.updatedAt = new Date().toISOString();
      return rec;
    }
    return null;
  }

  // AI Fuel Detection: Equipment Efficiency Rankings
  async getEfficiencyRankings(): Promise<FuelEfficiencyRanking[]> {
    return this.efficiencyRankings;
  }

  // AI Fuel Detection: Siphoning & Loss Alerts
  async getSiphoningAlerts(): Promise<FuelSiphoningAlert[]> {
    return this.siphoningAlerts;
  }

  async updateSiphoningAlertStatus(
    id: string, 
    status: "Detected" | "Security Dispatched" | "Under Investigation" | "Confirmed Theft" | "Sensor Glitch" | "Resolved",
    notes?: string
  ): Promise<FuelSiphoningAlert | null> {
    const alert = this.siphoningAlerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
      if (notes) alert.investigationNotes = notes;
      alert.updatedAt = new Date().toISOString();
      return alert;
    }
    return null;
  }
}

export const fuelRepository = new FuelRepository();
