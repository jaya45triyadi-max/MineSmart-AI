import React, { useState, useEffect } from "react";
import {
  Trees,
  Mountain,
  FileText,
  Wrench,
  Sprout,
  ClipboardCheck,
  TrendingUp,
  Layers,
  RefreshCw,
  ShieldCheck,
  DollarSign,
  FileSpreadsheet,
  Brain,
  FolderOpen,
  Settings,
  Bot,
  Sparkles,
} from "lucide-react";
import { reclamationRepository } from "../../services/repositories/ReclamationRepository";
import {
  ReclamationKPISummary,
  DisturbedArea,
  ReclamationProject,
  ReclamationAssessment,
  ReclamationActivity,
  PlantSpecies,
  PlantingProgram,
  ReclamationMonitoringPoint,
  ReclamationMonitoringForm,
  ReclamationMaintenance,
  SoilAndTopsoilRecord,
  ReclamationCostRecord,
  ReclamationAIInsight,
  ReclamationDocument,
} from "../../types/reclamationTypes";

// Component imports
import { ReclamationCommandCenterTab } from "./components/ReclamationCommandCenterTab";
import { ReclamationMonitoringCenterTab } from "./components/ReclamationMonitoringCenterTab";
import { ReclamationSpatialEvolutionMap } from "./components/ReclamationSpatialEvolutionMap";
import { DisturbedAreaTab } from "./components/DisturbedAreaTab";
import { ReclamationPlanningTab } from "./components/ReclamationPlanningTab";
import { ReclamationWorkTab } from "./components/ReclamationWorkTab";
import { RevegetationTab } from "./components/RevegetationTab";
import { PlantingProgramTab } from "./components/PlantingProgramTab";
import { ReclamationMonitoringTab } from "./components/ReclamationMonitoringTab";
import { ReclamationProgressTab } from "./components/ReclamationProgressTab";
import { ReclamationGisMapTab } from "./components/ReclamationGisMapTab";
import { ReclamationMaintenanceTab } from "./components/ReclamationMaintenanceTab";
import { ReclamationComplianceTab } from "./components/ReclamationComplianceTab";
import { ReclamationCostTab } from "./components/ReclamationCostTab";
import { ReclamationReportsExportTab } from "./components/ReclamationReportsExportTab";
import { ReclamationAIAssistantTab } from "./components/ReclamationAIAssistantTab";
import { ReclamationDocumentsTab } from "./components/ReclamationDocumentsTab";
import { ReclamationSettingsTab } from "./components/ReclamationSettingsTab";

interface Props {
  onOpenAICopilot?: () => void;
}

export const ReclamationModule: React.FC<Props> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Data State
  const [kpi, setKpi] = useState<ReclamationKPISummary | null>(null);
  const [disturbedAreas, setDisturbedAreas] = useState<DisturbedArea[]>([]);
  const [projects, setProjects] = useState<ReclamationProject[]>([]);
  const [assessments, setAssessments] = useState<ReclamationAssessment[]>([]);
  const [activities, setActivities] = useState<ReclamationActivity[]>([]);
  const [speciesList, setSpeciesList] = useState<PlantSpecies[]>([]);
  const [plantingPrograms, setPlantingPrograms] = useState<PlantingProgram[]>([]);
  const [monitoringPoints, setMonitoringPoints] = useState<ReclamationMonitoringPoint[]>([]);
  const [monitoringForms, setMonitoringForms] = useState<ReclamationMonitoringForm[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<ReclamationMaintenance[]>([]);
  const [soilRecords, setSoilRecords] = useState<SoilAndTopsoilRecord[]>([]);
  const [costRecords, setCostRecords] = useState<ReclamationCostRecord[]>([]);
  const [aiInsights, setAiInsights] = useState<ReclamationAIInsight[]>([]);
  const [documents, setDocuments] = useState<ReclamationDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          kpiRes,
          daRes,
          projRes,
          assRes,
          actRes,
          spRes,
          ppRes,
          rmpRes,
          rmfRes,
          mntRes,
          soilRes,
          costRes,
          aiRes,
          docRes,
        ] = await Promise.all([
          reclamationRepository.getKPISummary(),
          reclamationRepository.getDisturbedAreas(),
          reclamationRepository.getProjects(),
          reclamationRepository.getAssessments(),
          reclamationRepository.getActivities(),
          reclamationRepository.getSpeciesList(),
          reclamationRepository.getPlantingPrograms(),
          reclamationRepository.getMonitoringPoints(),
          reclamationRepository.getMonitoringForms(),
          reclamationRepository.getMaintenanceList(),
          reclamationRepository.getSoilRecords(),
          reclamationRepository.getCostRecords(),
          reclamationRepository.getAIInsights(),
          reclamationRepository.getDocuments(),
        ]);

        setKpi(kpiRes);
        setDisturbedAreas(daRes);
        setProjects(projRes);
        setAssessments(assRes);
        setActivities(actRes);
        setSpeciesList(spRes);
        setPlantingPrograms(ppRes);
        setMonitoringPoints(rmpRes);
        setMonitoringForms(rmfRes);
        setMaintenanceList(mntRes);
        setSoilRecords(soilRes);
        setCostRecords(costRes);
        setAiInsights(aiRes);
        setDocuments(docRes);
      } catch (err) {
        console.error("Failed to load reclamation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleAddDisturbedArea = async (
    area: Omit<DisturbedArea, "id" | "createdAt" | "updatedAt">
  ) => {
    const created = await reclamationRepository.addDisturbedArea(area);
    setDisturbedAreas((prev) => [created, ...prev]);
  };

  const handleAddProject = async (
    proj: Omit<ReclamationProject, "id" | "createdAt" | "updatedAt">
  ) => {
    const created = await reclamationRepository.addProject(proj);
    setProjects((prev) => [created, ...prev]);
  };

  const handleAddActivity = async (act: Omit<ReclamationActivity, "id">) => {
    const created = await reclamationRepository.addActivity(act);
    setActivities((prev) => [created, ...prev]);
  };

  const handleAddPlantingProgram = async (program: Omit<PlantingProgram, "id">) => {
    const created = await reclamationRepository.addPlantingProgram(program);
    setPlantingPrograms((prev) => [created, ...prev]);
  };

  const handleAddMonitoringForm = async (
    form: Omit<ReclamationMonitoringForm, "id">
  ) => {
    const created = await reclamationRepository.addMonitoringForm(form);
    setMonitoringForms((prev) => [created, ...prev]);
  };

  const navTabs = [
    { id: "overview", label: "Command Center", icon: Trees },
    { id: "monitoring", label: "Monitoring Center", icon: ClipboardCheck },
    { id: "spatial-evolution", label: "Map: Before → Revegetation", icon: Layers },
    { id: "disturbed-area", label: "Disturbed Area", icon: Mountain },
    { id: "planning", label: "Planning", icon: FileText },
    { id: "reclamation-work", label: "Reclamation Work", icon: Wrench },
    { id: "revegetation", label: "Revegetation", icon: Trees },
    { id: "planting", label: "Planting Program", icon: Sprout },
    { id: "field-inspection", label: "Field Inspection Form", icon: ClipboardCheck },
    { id: "progress", label: "Progress Engine", icon: TrendingUp },
    { id: "gis", label: "GIS Polygon Layers", icon: Layers },
    { id: "maintenance", label: "Maintenance", icon: RefreshCw },
    { id: "compliance", label: "Compliance & Soil", icon: ShieldCheck },
    { id: "cost", label: "Cost Management", icon: DollarSign },
    { id: "reports", label: "Reports & Export", icon: FileSpreadsheet },
    { id: "ai-insight", label: "AI Assistant", icon: Brain },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-emerald-400" />
          <span className="text-sm font-semibold">Memuat Data Modul Reclamation Management...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PROMPT 26 • MINE SMART AI
            </span>
            <span className="text-xs text-slate-400 font-bold">| Tapin Site Ops</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trees className="h-6 w-6 text-emerald-400" /> RECLAMATION MANAGEMENT
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Pusat pengelolaan terintegrasi area terganggu, penataan lahan, topsoil, penanaman, revegetasi, monitoring survival rate, dan ketaatan RKAB ESDM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab("ai-insight");
              if (onOpenAICopilot) onOpenAICopilot();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/10"
          >
            <Sparkles className="h-4 w-4" /> AI Reclamation Advisory
          </button>
        </div>
      </div>

      {/* Navigation Sub-routes Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering */}
      <div>
        {activeTab === "overview" && (
          <ReclamationCommandCenterTab
            kpi={kpi}
            disturbedAreas={disturbedAreas}
            projects={projects}
            aiInsights={aiInsights}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={() => setActiveTab("ai-insight")}
          />
        )}

        {activeTab === "monitoring" && (
          <ReclamationMonitoringCenterTab
            disturbedAreas={disturbedAreas}
            projects={projects}
            plantingPrograms={plantingPrograms}
            monitoringPoints={monitoringPoints}
            monitoringForms={monitoringForms}
            speciesList={speciesList}
            onAddMonitoringForm={handleAddMonitoringForm}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "spatial-evolution" && (
          <ReclamationSpatialEvolutionMap
            disturbedAreas={disturbedAreas}
            projects={projects}
          />
        )}

        {activeTab === "disturbed-area" && (
          <DisturbedAreaTab
            disturbedAreas={disturbedAreas}
            onAddDisturbedArea={handleAddDisturbedArea}
          />
        )}

        {activeTab === "planning" && (
          <ReclamationPlanningTab
            projects={projects}
            assessments={assessments}
            disturbedAreas={disturbedAreas}
            onAddProject={handleAddProject}
          />
        )}

        {activeTab === "reclamation-work" && (
          <ReclamationWorkTab
            activities={activities}
            projects={projects}
            onAddActivity={handleAddActivity}
          />
        )}

        {activeTab === "revegetation" && (
          <RevegetationTab speciesList={speciesList} />
        )}

        {activeTab === "planting" && (
          <PlantingProgramTab
            programs={plantingPrograms}
            projects={projects}
            speciesList={speciesList}
            onAddProgram={handleAddPlantingProgram}
          />
        )}

        {activeTab === "field-inspection" && (
          <ReclamationMonitoringTab
            monitoringPoints={monitoringPoints}
            forms={monitoringForms}
            onAddForm={handleAddMonitoringForm}
          />
        )}

        {activeTab === "progress" && (
          <ReclamationProgressTab projects={projects} />
        )}

        {activeTab === "gis" && (
          <ReclamationGisMapTab
            disturbedAreas={disturbedAreas}
            projects={projects}
          />
        )}

        {activeTab === "maintenance" && (
          <ReclamationMaintenanceTab maintenanceList={maintenanceList} />
        )}

        {activeTab === "compliance" && (
          <ReclamationComplianceTab soilRecords={soilRecords} />
        )}

        {activeTab === "cost" && (
          <ReclamationCostTab costRecords={costRecords} kpi={kpi} />
        )}

        {activeTab === "reports" && <ReclamationReportsExportTab />}

        {activeTab === "ai-insight" && (
          <ReclamationAIAssistantTab aiInsights={aiInsights} kpi={kpi} />
        )}

        {activeTab === "documents" && (
          <ReclamationDocumentsTab documents={documents} />
        )}

        {activeTab === "settings" && <ReclamationSettingsTab />}
      </div>
    </div>
  );
};
