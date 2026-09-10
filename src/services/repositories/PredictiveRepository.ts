// MINE SMART AI - Predictive Maintenance Repository Data Service

import { BaseRepository } from "./BaseRepository";
import {
  EquipmentHealthScore,
  FailurePrediction,
  DowntimePrediction,
  EquipmentRiskScore,
  PredictiveRecommendation,
  ComponentHealth,
  PredictiveSensorAnomaly,
  SparePartDemandForecast,
  WorkloadForecastItem,
  PredictionHistoryItem,
  PredictiveModelItem,
  PredictiveAlertItem,
  WhatIfSimulationRequest,
  WhatIfSimulationResult,
} from "../../types/predictiveTypes";
import {
  INITIAL_EQUIPMENT_HEALTH_SCORES,
  INITIAL_FAILURE_PREDICTIONS,
  INITIAL_DOWNTIME_PREDICTIONS,
  INITIAL_EQUIPMENT_RISK_SCORES,
  INITIAL_PREDICTIVE_RECOMMENDATIONS,
  INITIAL_COMPONENT_HEALTH_LIST,
  INITIAL_PREDICTIVE_SENSOR_ANOMALIES,
  INITIAL_SPARE_PART_FORECASTS,
  INITIAL_WORKLOAD_FORECASTS,
  INITIAL_PREDICTION_HISTORY,
  INITIAL_PREDICTIVE_MODELS,
  INITIAL_PREDICTIVE_ALERTS,
} from "../../data/predictiveData";
import { maintenanceRepository } from "./MaintenanceRepository";
import { MaintenanceWorkOrder } from "../../types";

export class PredictiveRepository extends BaseRepository<EquipmentHealthScore> {
  private failurePredictions: FailurePrediction[] = [...INITIAL_FAILURE_PREDICTIONS];
  private downtimePredictions: DowntimePrediction[] = [...INITIAL_DOWNTIME_PREDICTIONS];
  private riskScores: EquipmentRiskScore[] = [...INITIAL_EQUIPMENT_RISK_SCORES];
  private recommendations: PredictiveRecommendation[] = [...INITIAL_PREDICTIVE_RECOMMENDATIONS];
  private componentHealths: ComponentHealth[] = [...INITIAL_COMPONENT_HEALTH_LIST];
  private sensorAnomalies: PredictiveSensorAnomaly[] = [...INITIAL_PREDICTIVE_SENSOR_ANOMALIES];
  private sparePartForecasts: SparePartDemandForecast[] = [...INITIAL_SPARE_PART_FORECASTS];
  private workloadForecasts: WorkloadForecastItem[] = [...INITIAL_WORKLOAD_FORECASTS];
  private predictionHistory: PredictionHistoryItem[] = [...INITIAL_PREDICTION_HISTORY];
  private models: PredictiveModelItem[] = [...INITIAL_PREDICTIVE_MODELS];
  private alerts: PredictiveAlertItem[] = [...INITIAL_PREDICTIVE_ALERTS];

  constructor() {
    super("equipment_health_scores", INITIAL_EQUIPMENT_HEALTH_SCORES);
  }

  // --- HEALTH SCORES ---
  async getHealthScores(): Promise<EquipmentHealthScore[]> {
    return this.getAll();
  }

  async getEquipmentHealthScores(): Promise<EquipmentHealthScore[]> {
    return this.getHealthScores();
  }

  async getHealthScoreByUnit(unitCode: string): Promise<EquipmentHealthScore | undefined> {
    const list = await this.getAll();
    return list.find((h) => h.unitCode.toLowerCase() === unitCode.toLowerCase());
  }

  // --- FAILURE PREDICTIONS ---
  async getFailurePredictions(): Promise<FailurePrediction[]> {
    return this.failurePredictions.filter((f) => !f.isDeleted);
  }

  // --- DOWNTIME PREDICTIONS ---
  async getDowntimePredictions(): Promise<DowntimePrediction[]> {
    return this.downtimePredictions.filter((d) => !d.isDeleted);
  }

  // --- RISK SCORES ---
  async getRiskScores(): Promise<EquipmentRiskScore[]> {
    return this.riskScores.filter((r) => !r.isDeleted);
  }

  async getEquipmentRiskScores(): Promise<EquipmentRiskScore[]> {
    return this.getRiskScores();
  }

  async updateRiskCriticality(id: string, newCriticality: "Low" | "Medium" | "High" | "Critical"): Promise<EquipmentRiskScore | undefined> {
    const item = this.riskScores.find((r) => r.id === id);
    if (item) {
      item.criticality = newCriticality;
      item.updatedAt = new Date().toISOString();
      item.lastEvaluatedAt = new Date().toISOString();
    }
    return item;
  }

  async updateEquipmentCriticality(id: string, newCriticality: "Low" | "Medium" | "High" | "Critical"): Promise<EquipmentRiskScore | undefined> {
    return this.updateRiskCriticality(id, newCriticality);
  }

  // --- RECOMMENDATIONS & WORK ORDER CONVERSION ---
  async getRecommendations(): Promise<PredictiveRecommendation[]> {
    return this.recommendations.filter((r) => !r.isDeleted);
  }

  async getPredictiveRecommendations(): Promise<PredictiveRecommendation[]> {
    return this.getRecommendations();
  }

  async convertRecommendationToWorkOrder(
    recId: string,
    supervisorName: string = "Maintenance Supervisor"
  ): Promise<{ recommendation: PredictiveRecommendation; workOrder: MaintenanceWorkOrder }> {
    const rec = this.recommendations.find((r) => r.id === recId);
    if (!rec) {
      throw new Error(`Recommendation ID ${recId} not found.`);
    }

    const woCode = `WO-AI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWO: MaintenanceWorkOrder = {
      id: `WO-${Date.now()}`,
      woCode,
      equipmentId: rec.equipmentId,
      equipmentCode: rec.unitCode,
      type: "UNSCHEDULED",
      priority: rec.priority === "Critical Action" ? "CRITICAL" : rec.priority === "Urgent Maintenance" ? "HIGH" : "MEDIUM",
      problemDescription: `[AI PREDICTIVE WORK ORDER] ${rec.problem}\nEvidence: ${rec.evidence}`,
      workDescription: `${rec.recommendation}\nSuggested Timing: ${rec.suggestedTiming}\nInspection Required: ${rec.requiredInspection}`,
      mechanicLead: supervisorName,
      assignedTo: supervisorName,
      downtimeHours: 0,
      laborCostIDR: 2500000,
      partsCostIDR: rec.potentialParts.reduce((acc, p) => acc + p.estimatedCostIDR * p.estimatedQty, 0),
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: supervisorName,
    };

    await maintenanceRepository.create(newWO);

    rec.status = "Converted to Work Order";
    rec.convertedWorkOrderId = woCode;
    rec.approvedBy = supervisorName;
    rec.approvedAt = new Date().toISOString();
    rec.updatedAt = new Date().toISOString();

    return { recommendation: rec, workOrder: newWO };
  }

  // --- COMPONENT HEALTH & RUL ---
  async getComponentHealthList(): Promise<ComponentHealth[]> {
    return this.componentHealths.filter((c) => !c.isDeleted);
  }

  // --- SENSOR ANOMALIES ---
  async getSensorAnomalies(): Promise<PredictiveSensorAnomaly[]> {
    return this.sensorAnomalies.filter((s) => !s.isDeleted);
  }

  // --- SPARE PART FORECASTS ---
  async getSparePartForecasts(): Promise<SparePartDemandForecast[]> {
    return this.sparePartForecasts.filter((s) => !s.isDeleted);
  }

  async getSparePartDemandForecasts(): Promise<SparePartDemandForecast[]> {
    return this.getSparePartForecasts();
  }

  // --- WORKLOAD FORECASTS ---
  async getWorkloadForecasts(): Promise<WorkloadForecastItem[]> {
    return this.workloadForecasts;
  }

  // --- PREDICTION HISTORY & OUTCOMES ---
  async getPredictionHistory(): Promise<PredictionHistoryItem[]> {
    return this.predictionHistory.filter((p) => !p.isDeleted);
  }

  async verifyPredictionOutcome(
    historyId: string,
    verificationResult: "Correct Prediction" | "False Positive" | "False Negative" | "Missed Event",
    actualOutcome: string
  ): Promise<PredictionHistoryItem | undefined> {
    const item = this.predictionHistory.find((p) => p.id === historyId);
    if (item) {
      item.verificationResult = verificationResult;
      item.actualOutcome = actualOutcome;
      item.outcomeDate = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- MODELS & PERFORMANCE ---
  async getModels(): Promise<PredictiveModelItem[]> {
    return this.models.filter((m) => !m.isDeleted);
  }

  async getPredictiveModels(): Promise<PredictiveModelItem[]> {
    return this.getModels();
  }

  // --- PREDICTIVE ALERTS ---
  async getAlerts(): Promise<PredictiveAlertItem[]> {
    return this.alerts.filter((a) => !a.isDeleted);
  }

  async getPredictiveAlerts(): Promise<PredictiveAlertItem[]> {
    return this.getAlerts();
  }

  // --- AI ASSISTANT ---
  async queryAIPredictiveAssistant(userMsg: string, contextData?: any): Promise<string> {
    const msg = userMsg.toLowerCase();
    if (msg.includes("ex-201") || msg.includes("excavator")) {
      return "EX-201 (Hitachi EX2000) menunjukkan penurunan Health Score menjadi 58% akibat vibrasi berlebih pada Main Hydraulic Pump. Disarankan penggantian filter hidrolik dan inspeksi seal valve dalam 48 jam untuk menghindari breakdown terencana.";
    } else if (msg.includes("dt-201") || msg.includes("truck") || msg.includes("dump")) {
      return "DT-201 (CAT 777D) mengalami kenaikan temperatur transmisi saat memuat beban >35 Ton. Prediksi Sisa Umur Komponen (RUL) transmisi diperkirakan 320 Jam Operasi.";
    } else if (msg.includes("what-if") || msg.includes("simulasi")) {
      return "Anda dapat menjalankan Simulasi What-If pada tab Simulation & Audit untuk menghitung estimasi kerugian tonase (BCM/MT) dan biaya operasional jika suatu unit mengalami breakdown.";
    } else {
      return `Berdasarkan analisis telemetry real-time dari AI Predictive Engine, saat ini terdapat ${this.alerts.length} sistem peringatan aktif dan ${this.recommendations.length} rekomendasi perawatan preventif terdeteksi. Silakan pilih unit spesifik untuk analisa lebih dalam.`;
    }
  }

  async updateAlertStatus(
    alertId: string,
    status: "Detected" | "Reviewed" | "Acknowledged" | "Assigned" | "Action Taken" | "Resolved" | "Closed"
  ): Promise<PredictiveAlertItem | undefined> {
    const item = this.alerts.find((a) => a.id === alertId);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  // --- WHAT-IF SIMULATION ENGINE ---
  async runWhatIfSimulation(req: WhatIfSimulationRequest): Promise<WhatIfSimulationResult> {
    const hours = req.simulatedDowntimeHours || 8;
    const isExcavator = req.unitCode.toUpperCase().startsWith("EX");
    const isTruck = req.unitCode.toUpperCase().startsWith("DT");
    const isDozer = req.unitCode.toUpperCase().startsWith("DZ");

    let coalLoss = 0;
    let obLoss = 0;
    let truckImbalance = 0;
    let costImpact = 0;

    if (isExcavator) {
      obLoss = Math.round(hours * 420); // 420 BCM/hr
      truckImbalance = Math.min(8, Math.round(hours * 0.8));
      costImpact = Math.round(obLoss * 22000 + hours * 3500000);
    } else if (isTruck) {
      obLoss = Math.round(hours * 110);
      coalLoss = Math.round(hours * 45);
      truckImbalance = 1;
      costImpact = Math.round(hours * 2800000 + obLoss * 18000);
    } else if (isDozer) {
      obLoss = Math.round(hours * 250);
      costImpact = Math.round(hours * 3100000 + obLoss * 15000);
    } else {
      costImpact = Math.round(hours * 2000000);
    }

    return {
      equipmentUnitCode: req.unitCode,
      simulatedDowntimeHours: hours,
      potentialCoalLossMT: coalLoss,
      potentialOBLossBCM: obLoss,
      potentialTruckImbalanceCount: truckImbalance,
      potentialCostImpactIDR: costImpact,
      confidencePercent: 82,
      assumptions: [
        "Simulation based on 30-day historical unit production baseline.",
        "Assumes standard pit weather and normal haul road conditions.",
        "Does not account for immediate fleet reallocation during shift.",
      ],
    };
  }
}

export const predictiveRepository = new PredictiveRepository();
