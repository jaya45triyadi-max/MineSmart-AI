// MINE SMART AI - Predictive Maintenance & AI Equipment Health Center Main Module

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Wrench,
  Clock,
  Gauge,
  Cpu,
  Layers,
  Boxes,
  History,
  BrainCircuit,
  ShieldAlert,
  Calculator,
  Sparkles,
  X,
  Send,
  RefreshCw,
} from "lucide-react";

import { PredictiveRepository } from "../../services/repositories/PredictiveRepository";
import {
  EquipmentHealthScore,
  FailurePrediction,
  DowntimePrediction,
  EquipmentRiskScore,
  PredictiveRecommendation,
  PredictiveSensorAnomaly,
  ComponentHealth,
  SparePartDemandForecast,
  WorkloadForecastItem,
  PredictionHistoryItem,
  PredictiveModelItem,
  PredictiveAlertItem,
} from "../../types/predictiveTypes";

import { PredictiveCommandCenter } from "./PredictiveCommandCenter";
import { EquipmentHealthView } from "./EquipmentHealthView";
import { FailurePredictionView } from "./FailurePredictionView";
import { DowntimePredictionView } from "./DowntimePredictionView";
import { EquipmentRiskView } from "./EquipmentRiskView";
import { AIRecommendationsView } from "./AIRecommendationsView";
import { SensorAnomaliesView } from "./SensorAnomaliesView";
import { ComponentHealthRULView } from "./ComponentHealthRULView";
import { SparePartsForecastView } from "./SparePartsForecastView";
import { MaintenanceWorkloadForecastView } from "./MaintenanceWorkloadForecastView";
import { PredictionHistoryView } from "./PredictionHistoryView";
import { ModelPerformanceView } from "./ModelPerformanceView";
import { PredictiveAlertsView } from "./PredictiveAlertsView";
import { PredictiveReportsAuditView } from "./PredictiveReportsAuditView";

export type PredictiveTabKey =
  | "COMMAND_CENTER"
  | "EQUIPMENT_HEALTH"
  | "FAILURE_PREDICTIONS"
  | "DOWNTIME_PREDICTIONS"
  | "RISK_MATRIX"
  | "AI_RECOMMENDATIONS"
  | "SENSOR_ANOMALIES"
  | "COMPONENT_HEALTH"
  | "SPARE_PARTS_FORECAST"
  | "WORKLOAD_FORECAST"
  | "PREDICTION_HISTORY"
  | "MODEL_PERFORMANCE"
  | "PREDICTIVE_ALERTS"
  | "SIMULATION_AUDIT";

export const PredictiveMaintenanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PredictiveTabKey>("COMMAND_CENTER");
  const [repo] = useState(() => new PredictiveRepository());

  // State
  const [healthScores, setHealthScores] = useState<EquipmentHealthScore[]>([]);
  const [failurePredictions, setFailurePredictions] = useState<FailurePrediction[]>([]);
  const [downtimePredictions, setDowntimePredictions] = useState<DowntimePrediction[]>([]);
  const [riskScores, setRiskScores] = useState<EquipmentRiskScore[]>([]);
  const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);
  const [anomalies, setAnomalies] = useState<PredictiveSensorAnomaly[]>([]);
  const [componentHealth, setComponentHealth] = useState<ComponentHealth[]>([]);
  const [sparePartForecasts, setSparePartForecasts] = useState<SparePartDemandForecast[]>([]);
  const [workloadForecasts, setWorkloadForecasts] = useState<WorkloadForecastItem[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [models, setModels] = useState<PredictiveModelItem[]>([]);
  const [alerts, setAlerts] = useState<PredictiveAlertItem[]>([]);

  // AI Assistant Drawer State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Halo, saya AI Predictive Equipment Health Center Copilot. Saya siap membantu analisa Failure Patterns, Health Score, Sisa Umur Komponen (RUL), serta simulasi What-If. Ada yang ingin Anda tanyakan?",
    },
  ]);
  const [isAIResponding, setIsAIResponding] = useState(false);

  // Load Data
  const loadAllData = async () => {
    setHealthScores(await repo.getEquipmentHealthScores());
    setFailurePredictions(await repo.getFailurePredictions());
    setDowntimePredictions(await repo.getDowntimePredictions());
    setRiskScores(await repo.getEquipmentRiskScores());
    setRecommendations(await repo.getPredictiveRecommendations());
    setAnomalies(await repo.getSensorAnomalies());
    setComponentHealth(await repo.getComponentHealthList());
    setSparePartForecasts(await repo.getSparePartDemandForecasts());
    setWorkloadForecasts(await repo.getWorkloadForecasts());
    setPredictionHistory(await repo.getPredictionHistory());
    setModels(await repo.getPredictiveModels());
    setAlerts(await repo.getPredictiveAlerts());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleUpdateCriticality = async (id: string, criticality: "Low" | "Medium" | "High" | "Critical") => {
    await repo.updateEquipmentCriticality(id, criticality);
    loadAllData();
  };

  const handleConvertRecommendation = async (recId: string) => {
    await repo.convertRecommendationToWorkOrder(recId);
    loadAllData();
  };

  const handleVerifyOutcome = async (
    historyId: string,
    result: "Correct Prediction" | "False Positive" | "False Negative" | "Missed Event",
    actualOutcome: string
  ) => {
    await repo.verifyPredictionOutcome(historyId, result, actualOutcome);
    loadAllData();
  };

  const handleUpdateAlertStatus = async (
    alertId: string,
    status: "Detected" | "Reviewed" | "Acknowledged" | "Assigned" | "Action Taken" | "Resolved" | "Closed"
  ) => {
    await repo.updateAlertStatus(alertId, status);
    loadAllData();
  };

  const handleRunWhatIf = async (req: any) => {
    return await repo.runWhatIfSimulation(req);
  };

  const handleSendAIPrompt = async () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setAiPrompt("");
    setIsAIResponding(true);

    try {
      const responseText = await repo.queryAIPredictiveAssistant(userMsg, {
        healthScores,
        failurePredictions,
        riskScores,
        recommendations,
      });

      setAiMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan saat menghubungi AI Intelligence Center." },
      ]);
    } finally {
      setIsAIResponding(false);
    }
  };

  // Tabs List
  const tabsList = [
    { key: "COMMAND_CENTER", label: "Command Center", icon: Activity },
    { key: "EQUIPMENT_HEALTH", label: "Health Score Engine", icon: Gauge },
    { key: "FAILURE_PREDICTIONS", label: "Failure Predictions", icon: AlertTriangle },
    { key: "DOWNTIME_PREDICTIONS", label: "Downtime Impact", icon: Clock },
    { key: "RISK_MATRIX", label: "Risk Matrix Grid", icon: ShieldAlert },
    { key: "AI_RECOMMENDATIONS", label: "AI Recommendations", icon: Wrench },
    { key: "SENSOR_ANOMALIES", label: "IoT Sensor Anomalies", icon: Cpu },
    { key: "COMPONENT_HEALTH", label: "Component RUL", icon: Layers },
    { key: "SPARE_PARTS_FORECAST", label: "Parts Demand Forecast", icon: Boxes },
    { key: "WORKLOAD_FORECAST", label: "Workload Forecast", icon: Clock },
    { key: "PREDICTION_HISTORY", label: "Prediction Feedback Log", icon: History },
    { key: "MODEL_PERFORMANCE", label: "Model Lifecycle & Accuracy", icon: BrainCircuit },
    { key: "PREDICTIVE_ALERTS", label: "Early Warning Alerts", icon: ShieldAlert },
    { key: "SIMULATION_AUDIT", label: "What-If & Audit Trail", icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 lg:p-8 space-y-6">
      {/* Top Main Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 border border-emerald-500/20">
              <Activity className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              PREDICTIVE MAINTENANCE & AI EQUIPMENT HEALTH CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pusat Intelijen Kesehatan Unit Tambang • Health Score (0–100) • Failure Prediction • Downtime Cost • Prescriptive WO Conversion
          </p>
        </div>

        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI MAINTENANCE COPILOT</span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 min-w-max border-b border-slate-200 dark:border-slate-800 pb-2">
          {tabsList.map((t) => {
            const IconComponent = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as PredictiveTabKey)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <div>
        {activeTab === "COMMAND_CENTER" && (
          <PredictiveCommandCenter
            healthScores={healthScores}
            failurePredictions={failurePredictions}
            downtimePredictions={downtimePredictions}
            riskScores={riskScores}
            recommendations={recommendations}
            alerts={alerts}
            onOpenAIAssistant={() => setIsAIOpen(true)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "EQUIPMENT_HEALTH" && (
          <EquipmentHealthView
            healthScores={healthScores}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "FAILURE_PREDICTIONS" && (
          <FailurePredictionView
            failurePredictions={failurePredictions}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "DOWNTIME_PREDICTIONS" && (
          <DowntimePredictionView
            downtimePredictions={downtimePredictions}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "RISK_MATRIX" && (
          <EquipmentRiskView
            riskScores={riskScores}
            onUpdateCriticality={handleUpdateCriticality}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "AI_RECOMMENDATIONS" && (
          <AIRecommendationsView
            recommendations={recommendations}
            onConvertRecommendation={handleConvertRecommendation}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "SENSOR_ANOMALIES" && (
          <SensorAnomaliesView
            anomalies={anomalies}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "COMPONENT_HEALTH" && (
          <ComponentHealthRULView
            componentHealthList={componentHealth}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "SPARE_PARTS_FORECAST" && (
          <SparePartsForecastView
            sparePartForecasts={sparePartForecasts}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "WORKLOAD_FORECAST" && (
          <MaintenanceWorkloadForecastView
            workloadForecasts={workloadForecasts}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "PREDICTION_HISTORY" && (
          <PredictionHistoryView
            historyItems={predictionHistory}
            onVerifyOutcome={handleVerifyOutcome}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "MODEL_PERFORMANCE" && (
          <ModelPerformanceView
            models={models}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "PREDICTIVE_ALERTS" && (
          <PredictiveAlertsView
            alerts={alerts}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === "SIMULATION_AUDIT" && (
          <PredictiveReportsAuditView
            onRunWhatIf={handleRunWhatIf}
            onOpenAIAssistant={() => setIsAIOpen(true)}
          />
        )}
      </div>

      {/* AI Assistant Side Drawer */}
      {isAIOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  AI Predictive Intelligence Assistant
                </h3>
              </div>
              <button
                onClick={() => setIsAIOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-semibold"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAIResponding && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                  <span>AI sedang menganalisis telemetri & model kesehatan equipment...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAIPrompt()}
                placeholder="Tanyakan analisis RUL, failure pattern, atau WO..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <button
                onClick={handleSendAIPrompt}
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
