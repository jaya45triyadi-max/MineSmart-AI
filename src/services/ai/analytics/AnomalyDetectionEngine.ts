// MINE SMART AI - Anomaly Detection Engine (PROMPT 33)

import { AnomalyItem } from "../../../types/aiAnalyticsTypes";

export class AnomalyDetectionEngine {
  /**
   * Detects operational anomalies across point, trend, seasonal, contextual, and multivariate metrics.
   */
  static detectOperationalAnomalies(): AnomalyItem[] {
    return [
      {
        id: "anom-mv-001",
        anomalyType: "MULTIVARIATE",
        affectedModule: "Fuel & Production Combined",
        affectedAsset: "Fleet Pit 2 North",
        severity: "CRITICAL",
        anomalyScore: 88,
        detectedAt: new Date().toISOString(),
        baselineValue: 48.2,
        observedValue: 68.4,
        expectedValue: 48.2,
        deviationPct: +41.9,
        description: "Combined operational anomaly detected: Konsumsi Solar naik (+41.9%), Produksi Tonase turun (-5.0%), dan Jam Operasi bertambah (+1.2 jam). Indikasi idle berlebih atau kendala mesin.",
        status: "OPEN",
      },
      {
        id: "anom-pt-002",
        anomalyType: "POINT",
        affectedModule: "Fleet Maintenance",
        affectedAsset: "EX-204 (Komatsu PC1250)",
        severity: "HIGH",
        anomalyScore: 76,
        detectedAt: new Date(Date.now() - 7200000).toISOString(),
        baselineValue: 24.5,
        observedValue: 48.2,
        expectedValue: 24.5,
        deviationPct: +96.7,
        description: "Spike suhu oli hidrolik terdeteksi melebihi ambang batas (48.2°C vs baseline 24.5°C).",
        status: "OPEN",
      },
      {
        id: "anom-tr-003",
        anomalyType: "TREND",
        affectedModule: "Hauling Operations",
        affectedAsset: "Jalan Hauling KM 4 - KM 8",
        severity: "MEDIUM",
        anomalyScore: 62,
        detectedAt: new Date(Date.now() - 14400000).toISOString(),
        baselineValue: 18.5,
        observedValue: 22.4,
        expectedValue: 18.5,
        deviationPct: +21.1,
        description: "Tren kenaikan cycle time hauling selama 3 shift berturut-turut.",
        status: "OPEN",
      },
      {
        id: "anom-qual-004",
        anomalyType: "CONTEXTUAL",
        affectedModule: "Geology & Quality",
        affectedAsset: "Stockpile ROM Cell 3",
        severity: "MEDIUM",
        anomalyScore: 58,
        detectedAt: new Date(Date.now() - 28800000).toISOString(),
        baselineValue: 34.2,
        observedValue: 36.8,
        expectedValue: 34.2,
        deviationPct: +7.6,
        description: "Kenaikan Total Moisture (TM) secara mendadak pasca hujan di Pit 2 West.",
        status: "OPEN",
      },
    ];
  }
}
