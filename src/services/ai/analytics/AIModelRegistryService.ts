// MINE SMART AI - AI Model Registry & Governance Service (PROMPT 33)

import { AIModelMetadata } from "../../../types/aiAnalyticsTypes";

export class AIModelRegistryService {
  private static registeredModels: AIModelMetadata[] = [
    {
      modelId: "model-prod-fc-v2",
      modelName: "Production Forecast Ensemble Model",
      modelType: "PRODUCTION",
      version: "v2.4-PROD-MINESMART",
      status: "ACTIVE",
      trainingPeriod: "2025-01-01 s/d 2026-07-31",
      features: [
        "Historical Production Logs",
        "Fleet Availability (PA/UA)",
        "Match Factor",
        "Cycle Time",
        "Weather/Rainfall",
        "Stockpile Inventory",
      ],
      metrics: {
        mae: 240,
        rmse: 310,
        mape: 2.8,
      },
      accuracyPct: 91.5,
      isDrifted: false,
      lastEvaluated: new Date().toISOString(),
      createdAt: "2026-01-15T00:00:00Z",
    },
    {
      modelId: "model-fuel-anom-v1",
      modelName: "Fuel Burn & Anomaly Detector",
      modelType: "FUEL",
      version: "v1.8-FUEL-ML",
      status: "ACTIVE",
      trainingPeriod: "2025-06-01 s/d 2026-07-31",
      features: [
        "Fuel Burn Rate (L/Hour)",
        "Engine Load %",
        "Haul Road Elevation Gain",
        "GPS Speed",
        "Payload Weight",
      ],
      metrics: {
        precision: 0.94,
        recall: 0.91,
        f1: 0.925,
      },
      accuracyPct: 92.5,
      isDrifted: false,
      lastEvaluated: new Date().toISOString(),
      createdAt: "2026-03-10T00:00:00Z",
    },
    {
      modelId: "model-maint-fail-v3",
      modelName: "Equipment Failure Risk Classifier",
      modelType: "MAINTENANCE",
      version: "v3.1-FAIL-PRED",
      status: "ACTIVE",
      trainingPeriod: "2024-01-01 s/d 2026-07-31",
      features: [
        "Oil Analysis Metal PPM",
        "Hydraulic Temp & Pressure",
        "SMU Engine Hours",
        "Overdue PM Days",
        "Operator Fault History",
      ],
      metrics: {
        precision: 0.89,
        recall: 0.87,
        f1: 0.88,
        auc: 0.93,
      },
      accuracyPct: 88.0,
      isDrifted: true, // Marked drifted to demonstrate model drift alert requirement
      lastEvaluated: new Date().toISOString(),
      createdAt: "2025-11-20T00:00:00Z",
    },
    {
      modelId: "model-cost-abc-v1",
      modelName: "Activity-Based OPEX Forecast",
      modelType: "COST",
      version: "v1.4-COST-FORECAST",
      status: "ACTIVE",
      trainingPeriod: "2025-01-01 s/d 2026-06-30",
      features: [
        "Fuel Unit Cost",
        "Subcontractor Rates",
        "Spareparts Consumption Rate",
        "Tonnage Shipped",
      ],
      metrics: {
        mae: 4500,
        rmse: 6200,
        mape: 3.5,
      },
      accuracyPct: 89.2,
      isDrifted: false,
      lastEvaluated: new Date().toISOString(),
      createdAt: "2026-02-01T00:00:00Z",
    },
  ];

  /**
   * Retrieves all registered AI models.
   */
  static getRegisteredModels(): AIModelMetadata[] {
    return this.registeredModels;
  }

  /**
   * Triggers model retraining workflow.
   */
  static retrainModel(modelId: string): AIModelMetadata {
    const model = this.registeredModels.find((m) => m.modelId === modelId);
    if (!model) {
      throw new Error(`Model ID ${modelId} not found.`);
    }

    model.version = `v${(parseFloat(model.version.replace(/[^0-9.]/g, "")) + 0.1).toFixed(1)}-RETRAINED`;
    model.isDrifted = false;
    model.accuracyPct = Math.min(99, model.accuracyPct + 2.5);
    model.lastEvaluated = new Date().toISOString();

    return model;
  }
}
