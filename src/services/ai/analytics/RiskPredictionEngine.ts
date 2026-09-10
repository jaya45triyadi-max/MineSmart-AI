// MINE SMART AI - Risk Prediction & Risk Matrix Engine (PROMPT 33)

import { RiskMatrixItem } from "../../../types/aiAnalyticsTypes";

export class RiskPredictionEngine {
  /**
   * Generates Risk Matrix items across operational domains.
   */
  static generateRiskMatrix(): RiskMatrixItem[] {
    return [
      {
        id: "risk-prod-1",
        category: "PRODUCTION",
        title: "Risk of missing monthly coal target (-3,300 MT Gap)",
        probability: "HIGH",
        impact: "HIGH",
        riskLevel: "CRITICAL",
        riskFactors: [
          "Historical daily average is 14,250 MT vs required 15,000 MT/day",
          "Fleet PA currently 88.5% below target 90.0%",
          "Downtime EX-204 hidrolik belum pulih 100%",
        ],
        recommendedAction: "Rebalance fleet dari Pit 2 ke Pit 1 & jalankan shift malam dengan optimalisasi Match Factor.",
      },
      {
        id: "risk-cost-2",
        category: "COST",
        title: "OPEX Cost/Ton Overrun Risk (+$2.30/MT)",
        probability: "HIGH",
        impact: "MEDIUM",
        riskLevel: "HIGH",
        riskFactors: [
          "Kenaikan harga solar nonsubsidi +8.2%",
          "Pemakaian komponen hidrolik tidak terencana",
          "High cycle time rute hauling Pit 2",
        ],
        recommendedAction: "Lakukan pengawasan pemakaian solar & percepat perbaikan jalan hauling KM 4.",
      },
      {
        id: "risk-maint-3",
        category: "MAINTENANCE",
        title: "Catastrophic Failure Risk pada Main Pump EX-201",
        probability: "MEDIUM",
        impact: "HIGH",
        riskLevel: "HIGH",
        riskFactors: [
          "Health score EX-201 turun ke 58%",
          "Kenaikan frekuensi vibrasi main pump",
          "Engine hours mendekati batas PM 250 Jam",
        ],
        recommendedAction: "Jadwalkan inspeksi seal valve & ganti filter hidrolik dalam 48 jam.",
      },
      {
        id: "risk-qual-4",
        category: "QUALITY",
        title: "Coal Specification Risk (GAR Drop di Seam C1)",
        probability: "MEDIUM",
        impact: "MEDIUM",
        riskLevel: "MEDIUM",
        riskFactors: [
          "Total Moisture Seam C1 naik ke 36.8%",
          "Genangan air di Pit 2 West belum полностью dipompa",
        ],
        recommendedAction: "Lakukan blending 1:1 antara Seam C1 dan Seam B2 di ROM Stockpile.",
      },
      {
        id: "risk-hse-5",
        category: "HSE",
        title: "Risiko Slip & Kebocoran Ban akibat Jalan Licin",
        probability: "LOW",
        impact: "HIGH",
        riskLevel: "MEDIUM",
        riskFactors: [
          "Curah hujan sedang kemarin sore",
          "Kepadatan truk di persimpangan KM 4",
        ],
        recommendedAction: "Operasikan Grader D375 untuk perbaikan leveling jalan hauling.",
      },
    ];
  }
}
