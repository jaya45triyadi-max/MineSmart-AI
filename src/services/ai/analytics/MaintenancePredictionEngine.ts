// MINE SMART AI - Maintenance & Equipment Health Engine (PROMPT 33)

import { predictiveRepository } from "../../repositories/PredictiveRepository";
import { EquipmentHealthScore, EquipmentRiskScore, FailurePrediction } from "../../../types/predictiveTypes";

export class MaintenancePredictionEngine {
  /**
   * Retrieves equipment health scores, failure predictions, downtime risks,
   * and ranks Top 10 Equipment Requiring Attention.
   */
  static async getEquipmentPrioritization(): Promise<{
    topRiskEquipment: Array<{
      equipmentId: string;
      unitCode: string;
      category: string;
      healthScore: number;
      riskScore: number;
      failureProbabilityPct: number;
      criticality: string;
      downtimeRisk: string;
      recommendedAction: string;
    }>;
    failurePredictions: FailurePrediction[];
    overallFleetHealthAvg: number;
  }> {
    const healthScores: EquipmentHealthScore[] = await predictiveRepository.getHealthScores();
    const riskScores: EquipmentRiskScore[] = await predictiveRepository.getRiskScores();
    const failurePreds: FailurePrediction[] = await predictiveRepository.getFailurePredictions();

    // Map and prioritize
    const combined = healthScores.map((h) => {
      const r = riskScores.find((rs) => rs.unitCode === h.unitCode);
      const f = failurePreds.find((fp) => fp.unitCode === h.unitCode);

      return {
        equipmentId: h.equipmentId,
        unitCode: h.unitCode,
        category: h.category,
        healthScore: h.healthScore,
        riskScore: r?.riskScore || 100 - h.healthScore,
        failureProbabilityPct: h.failureProbabilityPercent || f?.probabilityPercent || 35,
        criticality: r?.criticality || "Medium",
        downtimeRisk: r?.downtimeRisk || "Medium",
        recommendedAction: f?.recommendedAction || "Inspect hydraulic pressure & oil filter",
      };
    });

    // Sort by highest risk score descending
    combined.sort((a, b) => b.riskScore - a.riskScore);

    const top10 = combined.slice(0, 10);
    const avgHealth =
      healthScores.length > 0
        ? Math.round(healthScores.reduce((sum, item) => sum + item.healthScore, 0) / healthScores.length)
        : 82;

    return {
      topRiskEquipment: top10,
      failurePredictions: failurePreds,
      overallFleetHealthAvg: avgHealth,
    };
  }
}
