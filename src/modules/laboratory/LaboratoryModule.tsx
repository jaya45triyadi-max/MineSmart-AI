import React, { useState } from "react";
import {
  FlaskConical,
  TestTube,
  FileText,
  ShieldCheck,
  Layers,
  Scale,
  TrendingUp,
  AlertTriangle,
  Flame,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  Sparkles,
  Database,
  BrainCircuit,
  Calculator,
  Boxes,
} from "lucide-react";

// Import Sub-Components
import { OverviewTab } from "./components/OverviewTab";
import { SamplingTab } from "./components/SamplingTab";
import { SampleRegisterTab } from "./components/SampleRegisterTab";
import { TestExecutionTab } from "./components/TestExecutionTab";
import { QualityResultsTab } from "./components/QualityResultsTab";
import { QualityParametersTab } from "./components/QualityParametersTab";
import { QualityPredictionTab } from "./components/QualityPredictionTab";
import { MineQualityControlTab } from "./components/MineQualityControlTab";
import { SpecificationsTab } from "./components/SpecificationsTab";
import { QualityTrendsTab } from "./components/QualityTrendsTab";
import { AnomaliesTab } from "./components/AnomaliesTab";
import { StockpileQualityTab } from "./components/StockpileQualityTab";
import { ProductionQualityTab } from "./components/ProductionQualityTab";
import { CoaGeneratorTab } from "./components/CoaGeneratorTab";
import { ReportsTab } from "./components/ReportsTab";
import { AIQualityInsightTab } from "./components/AIQualityInsightTab";

// Import Mock Data & Types
import {
  MOCK_LAB_SAMPLES,
  MOCK_LAB_TESTS,
  MOCK_QUALITY_RESULTS,
  MOCK_QUALITY_SPECS,
  MOCK_QUALITY_ANOMALIES,
  MOCK_LAB_INSTRUMENTS,
  MOCK_COAS,
  MOCK_QUALITY_TRENDS,
  MOCK_AI_QUALITY_INSIGHTS,
  MOCK_LAB_REPORTS,
} from "../../data/laboratoryData";

import {
  LabSample,
  LabTest,
  QualityResult,
  QualityAnomaly,
  TestStatus,
} from "../../types/laboratoryTypes";

interface LaboratoryModuleProps {
  onOpenAICopilot?: () => void;
}

export const LaboratoryModule: React.FC<LaboratoryModuleProps> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Module State
  const [samples, setSamples] = useState<LabSample[]>(MOCK_LAB_SAMPLES);
  const [tests, setTests] = useState<LabTest[]>(MOCK_LAB_TESTS);
  const [results, setResults] = useState<QualityResult[]>(MOCK_QUALITY_RESULTS);
  const [anomalies, setAnomalies] = useState<QualityAnomaly[]>(MOCK_QUALITY_ANOMALIES);
  const [instruments] = useState(MOCK_LAB_INSTRUMENTS);
  const [specifications] = useState(MOCK_QUALITY_SPECS);
  const [coas] = useState(MOCK_COAS);
  const [trends] = useState(MOCK_QUALITY_TRENDS);
  const [insights] = useState(MOCK_AI_QUALITY_INSIGHTS);
  const [reports] = useState(MOCK_LAB_REPORTS);

  // Handlers
  const handleRegisterSample = (newSample: Partial<LabSample>) => {
    const created: LabSample = {
      id: `SMP-${Date.now()}`,
      sampleId: `SMP-${Date.now()}`,
      sampleCode: newSample.sampleCode || `SMP-2026-0813-00${samples.length + 1}`,
      sampleType: newSample.sampleType || "ROM",
      sourceType: newSample.sourceType || "PIT",
      sourceId: newSample.sourceId || "SRC-01",
      sourceName: newSample.sourceName || "Pit Alpha - Seam A2",
      location: newSample.location || { area: "Pit Alpha" },
      samplingDate: newSample.samplingDate || new Date().toISOString().split("T")[0],
      samplingTime: newSample.samplingTime || "08:00",
      shift: newSample.shift || "SHIFT_1",
      collectorId: "USR-SMP-CURRENT",
      collectorName: newSample.collectorName || "Bambang Sujipto",
      sampleWeightKg: newSample.sampleWeightKg || 12.5,
      status: newSample.status || "COLLECTED",
      priority: newSample.priority || "NORMAL",
      remarks: newSample.remarks,
      qrCode: newSample.qrCode || `QR-${Date.now()}`,
      barcode: newSample.barcode || `89912345600${samples.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chainOfCustody: newSample.chainOfCustody || {
        collectedBy: newSample.collectorName || "Bambang Sujipto",
        collectedDate: `${new Date().toISOString().split("T")[0]} 08:00 WITA`,
        laboratory: "Central Site Lab Sangatta",
        sampleCondition: "Intact Sealed Sample",
        sealNumber: "SL-BNU-NEW",
        storageLocation: "Shelf R-01",
        transferHistory: [],
      },
    };
    setSamples([created, ...samples]);
  };

  const handleUpdateTestStatus = (testId: string, status: TestStatus, resultValue?: number) => {
    setTests(
      tests.map((t) => (t.testId === testId ? { ...t, status, resultValue: resultValue ?? t.resultValue } : t))
    );
  };

  const handleApproveResult = (resultId: string) => {
    setResults(
      results.map((r) =>
        r.resultId === resultId
          ? {
              ...r,
              isApproved: true,
              approvedBy: "Dr. Irwan Setiawan (Lab Director)",
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const handleRejectResult = (resultId: string) => {
    setResults(
      results.map((r) =>
        r.resultId === resultId ? { ...r, isApproved: false, status: "RETEST" } : r
      )
    );
  };

  const handleAcknowledgeAnomaly = (anomalyId: string) => {
    setAnomalies(
      anomalies.map((a) => (a.anomalyId === anomalyId ? { ...a, status: "Acknowledged" } : a))
    );
  };

  const handleResolveAnomaly = (anomalyId: string, notes: string) => {
    setAnomalies(
      anomalies.map((a) =>
        a.anomalyId === anomalyId
          ? {
              ...a,
              status: "Resolved",
              resolutionNotes: notes,
              resolvedBy: "Ir. Ahmad Hidayat (Quality Lead)",
            }
          : a
      )
    );
  };

  // Structured tabs grouping
  const tabs = [
    { id: "overview", label: "Overview", icon: FlaskConical },
    // DATABASE PILLAR
    { id: "samples", label: "1. Sample", icon: TestTube, group: "Database" },
    { id: "testing", label: "2. Test", icon: FlaskConical, group: "Database" },
    { id: "results", label: "3. Result", icon: ShieldCheck, group: "Database" },
    { id: "coa", label: "4. Certificate", icon: FileCheck2, group: "Database" },
    // QUALITY PARAMETERS PILLAR
    { id: "parameters", label: "Quality Parameters (GCV • GAR • Ash • Sulfur • TM • IM • VM)", icon: Flame, group: "Quality" },
    // AI INTELLIGENCE PILLAR
    { id: "ai-prediction", label: "AI Quality Prediction", icon: BrainCircuit, badge: "AI", group: "AI" },
    { id: "trends", label: "AI Quality Trend", icon: TrendingUp, group: "AI" },
    { id: "anomalies", label: "AI Quality Anomaly", icon: AlertTriangle, badge: anomalies.length > 0 ? `${anomalies.length}` : undefined, group: "AI" },
    // EXTENDED OPERATIONS
    { id: "sampling", label: "Field Sampling", icon: TestTube },
    { id: "quality", label: "Mine Quality Matrix", icon: Layers },
    { id: "specifications", label: "Specs & Contracts", icon: Scale },
    { id: "stockpile-quality", label: "Stockpile Quality", icon: Boxes },
    { id: "production-quality", label: "Plan Reconciliation", icon: Compass },
    { id: "reports", label: "ESDM Reports", icon: FileSpreadsheet },
    { id: "ai-insight", label: "AI Blending Engine", icon: Sparkles, badge: "AI" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation Bar */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-slate-950 text-emerald-400"
                      : "bg-red-500 text-white dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-Tab View */}
      {activeTab === "overview" && (
        <OverviewTab
          samples={samples}
          tests={tests}
          results={results}
          anomalies={anomalies}
          instruments={instruments}
          insights={insights}
          onNavigateTab={setActiveTab}
          onOpenNewSampleModal={() => setActiveTab("sampling")}
        />
      )}

      {/* 1. DATABASE PILLAR */}
      {activeTab === "samples" && (
        <SampleRegisterTab samples={samples} />
      )}

      {activeTab === "testing" && (
        <TestExecutionTab
          tests={tests}
          instruments={instruments}
          onUpdateTestStatus={handleUpdateTestStatus}
        />
      )}

      {activeTab === "results" && (
        <QualityResultsTab
          results={results}
          onApproveResult={handleApproveResult}
          onRejectResult={handleRejectResult}
        />
      )}

      {activeTab === "coa" && (
        <CoaGeneratorTab coas={coas} />
      )}

      {/* 2. QUALITY PARAMETERS PILLAR */}
      {activeTab === "parameters" && (
        <QualityParametersTab />
      )}

      {/* 3. AI INTELLIGENCE PILLAR */}
      {activeTab === "ai-prediction" && (
        <QualityPredictionTab />
      )}

      {activeTab === "trends" && (
        <QualityTrendsTab trends={trends} />
      )}

      {activeTab === "anomalies" && (
        <AnomaliesTab
          anomalies={anomalies}
          onAcknowledgeAnomaly={handleAcknowledgeAnomaly}
          onResolveAnomaly={handleResolveAnomaly}
        />
      )}

      {/* EXTENDED OPERATIONAL VIEWS */}
      {activeTab === "sampling" && (
        <SamplingTab
          samples={samples}
          onRegisterSample={handleRegisterSample}
        />
      )}

      {activeTab === "quality" && (
        <MineQualityControlTab results={results} />
      )}

      {activeTab === "specifications" && (
        <SpecificationsTab specifications={specifications} />
      )}

      {activeTab === "stockpile-quality" && <StockpileQualityTab />}

      {activeTab === "production-quality" && <ProductionQualityTab />}

      {activeTab === "reports" && <ReportsTab reports={reports} />}

      {activeTab === "ai-insight" && <AIQualityInsightTab insights={insights} />}
    </div>
  );
};
