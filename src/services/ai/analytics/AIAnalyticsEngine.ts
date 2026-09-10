// MINE SMART AI - AI Analytics, Prediction & Root Cause Central Engine (PROMPT 33)

import {
  ForecastHorizon,
  ProductionForecastResult,
  FuelForecastResult,
  CostForecastResult,
  QualityForecastResult,
  FleetOptimizationResult,
  WhatIfFleetSimulationParams,
  WhatIfFleetSimulationResult,
  RootCauseAnalysisResult,
  AnomalyItem,
  RiskMatrixItem,
  AIModelMetadata,
  AIAnalyticsRecommendation,
  AIAnalyticsSummary,
} from "../../../types/aiAnalyticsTypes";
import { ProductionPredictionEngine } from "./ProductionPredictionEngine";
import { FuelPredictionEngine } from "./FuelPredictionEngine";
import { MaintenancePredictionEngine } from "./MaintenancePredictionEngine";
import { CostPredictionEngine } from "./CostPredictionEngine";
import { QualityPredictionEngine } from "./QualityPredictionEngine";
import { FleetOptimizationEngine } from "./FleetOptimizationEngine";
import { RootCauseEngine } from "./RootCauseEngine";
import { AnomalyDetectionEngine } from "./AnomalyDetectionEngine";
import { RiskPredictionEngine } from "./RiskPredictionEngine";
import { AIModelRegistryService } from "./AIModelRegistryService";

export class AIAnalyticsEngine {
  /**
   * Generates 4-Tier Analytical Framework:
   * 1. Descriptive (What happened?)
   * 2. Diagnostic (Why did it happen?)
   * 3. Predictive (What is likely to happen?)
   * 4. Prescriptive (What is the best action?)
   */
  static async generateAnalyticsSummary(
    companyId: string,
    siteId: string
  ): Promise<AIAnalyticsSummary> {
    return {
      descriptive:
        "Produksi batubara hari ini mencapai 14,250 MT (95.0% dari target 15,000 MT) dengan pengupasan Overburden 48,600 BCM. Fleet Physical Availability (PA) berada pada 88.5% (68 Unit Aktif, 3 Unit Downtime). Cost/Ton bulan berjalan tercatat $26.80/MT.",
      diagnostic:
        "Penurunan produksi sebesar -750 MT disebabkan oleh kebocoran pipa hidrolik EX-204 di Pit 2 North (downtime 3.5 jam) serta peningkatan antrean truk (queue time 5.8 min/rit) akibat Match Factor 0.88.",
      predictive:
        "Proyeksi produksi hingga akhir bulan diperkirakan mencapai 86,700 MT (gap -3,300 MT dari target 90,000 MT). Terdapat potensi pembengkakan biaya OPEX +$2.30/MT akibat harga solar nonsubsidi & perbaikan hidrolik darurat.",
      prescriptive:
        "Disarankan melakukan rebalance 4 unit HD785 dari EX-204 ke EX-201 untuk memulihkan ritase (+650 MT), mempercepat perbaikan hidrolik EX-204, dan melakukan blending Seam C1 & B2 untuk menjaga spesifikasi GAR 4,200 kcal/kg.",
    };
  }

  // Wrapper delegates to sub-engines
  static async getProductionForecast(
    companyId: string,
    siteId: string,
    horizon: ForecastHorizon = "END_OF_MONTH",
    logs: any[] = []
  ): Promise<ProductionForecastResult> {
    return ProductionPredictionEngine.forecastProduction(companyId, siteId, horizon, logs);
  }

  static async getFuelForecast(
    companyId: string,
    siteId: string,
    horizon: ForecastHorizon = "END_OF_MONTH",
    logs: any[] = []
  ): Promise<FuelForecastResult> {
    return FuelPredictionEngine.forecastFuel(companyId, siteId, horizon, logs);
  }

  static async getEquipmentPrioritization() {
    return MaintenancePredictionEngine.getEquipmentPrioritization();
  }

  static async getCostForecast(
    companyId: string,
    siteId: string,
    horizon: ForecastHorizon = "END_OF_MONTH"
  ): Promise<CostForecastResult> {
    return CostPredictionEngine.forecastCost(companyId, siteId, horizon);
  }

  static async getQualityForecast(
    companyId: string,
    siteId: string,
    horizon: ForecastHorizon = "END_OF_MONTH",
    samplesCount: number = 24
  ): Promise<QualityForecastResult> {
    return QualityPredictionEngine.forecastQuality(companyId, siteId, horizon, samplesCount);
  }

  static async getFleetOptimization(
    companyId: string,
    siteId: string
  ): Promise<FleetOptimizationResult> {
    return FleetOptimizationEngine.optimizeFleet(companyId, siteId);
  }

  static runFleetSimulation(
    params: WhatIfFleetSimulationParams
  ): WhatIfFleetSimulationResult {
    return FleetOptimizationEngine.runFleetSimulation(params);
  }

  static getRootCauseAnalysis(
    problemType: "PRODUCTION_DROP" | "COST_OVERRUN" | "FUEL_SPIKE" | "EQUIPMENT_DOWNTIME" = "PRODUCTION_DROP"
  ): RootCauseAnalysisResult {
    return RootCauseEngine.analyzeRootCause(problemType);
  }

  static getAnomalies(): AnomalyItem[] {
    return AnomalyDetectionEngine.detectOperationalAnomalies();
  }

  static getRiskMatrix(): RiskMatrixItem[] {
    return RiskPredictionEngine.generateRiskMatrix();
  }

  static getModels(): AIModelMetadata[] {
    return AIModelRegistryService.getRegisteredModels();
  }

  static retrainModel(modelId: string): AIModelMetadata {
    return AIModelRegistryService.retrainModel(modelId);
  }

  static getActionableRecommendations(): AIAnalyticsRecommendation[] {
    return [
      {
        id: "rec-01",
        problem: "Penumpukan Antrean Truk di Pit 2 North (Match Factor 0.88)",
        evidence: ["Queue time 5.8 menit/rit", "12 truk menunggu EX-204"],
        prediction: "Kehilangan potensi muat 650 MT pada shift berikutnya jika tidak direbalance",
        risk: "HIGH",
        recommendation: "Pindahkan 3-4 unit HD785 dari Front EX-204 ke Front EX-201 di Pit 1 South",
        expectedImpact: "+650 MT Coal Output & Penurunan Queue Time -3.2 menit",
        priority: "HIGH",
        urgency: "IMMEDIATE",
        confidence: "HIGH",
      },
      {
        id: "rec-02",
        problem: "Anomali Konsumsi Solar HT-112 (68.4 L/Jam vs Baseline 48.2 L/Jam)",
        evidence: ["Penyimpangan konsumsi +41.9%", "Engine load 92% saat hauling menanjak"],
        prediction: "Potensi pemborosan 180 Liter solar/shift ($170 USD)",
        risk: "HIGH",
        recommendation: "Inspeksi kebersihan filter udara & tes emisi injektor HT-112 di Workshop",
        expectedImpact: "Penghematan Rp 2,610,000 / Shift & Pencegahan kerusakan mesin",
        priority: "HIGH",
        urgency: "WITHIN_SHIFT",
        confidence: "HIGH",
      },
      {
        id: "rec-03",
        problem: "Penurunan Quality GAR di Seam C1 akibat Moisture Tinggi (36.8%)",
        evidence: ["Genangan air di Pit 2 West pasca hujan", "Lab Assay #2041 GAR 3,980 kcal/kg"],
        prediction: "Risiko penolakan spesifikasi pengapalan (Contract Min GAR 4,200 kcal/kg)",
        risk: "MEDIUM",
        recommendation: "Lakukan blending 1:1 antara Seam C1 dan Seam B2 di ROM Hopper Crusher",
        expectedImpact: "Menjaga kualitas blending produk pada GAR 4,250 kcal/kg (Compliant)",
        priority: "MEDIUM",
        urgency: "THIS_WEEK",
        confidence: "HIGH",
      },
    ];
  }
}
