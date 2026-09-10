import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2,
  FileCheck2,
  Users,
  Eye,
  FileText,
  MapPin,
  Building2,
  Sparkles,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { hseRepository } from "../../services/repositories/HSERepository";
import {
  HSEIncident,
  AccidentRecord,
  NearMissRecord,
  Hazard,
  HSEInspection,
  SafetyObservation,
  JSA,
  WorkPermit,
  ToolboxMeeting,
  RiskAssessmentItem,
  CorrectiveActionItem,
  ContractorHSE,
  EmergencyContact,
  EmergencyPlan,
  EnvironmentalIncidentRecord,
  HSEAIInsight,
  HSEKPISummary,
  HazardStatus,
  CorrectiveActionStatus,
} from "../../types/hseTypes";

// Tab Components
import { HSECommandCenterTab } from "./components/HSECommandCenterTab";
import { HSEIncidentsTab } from "./components/HSEIncidentsTab";
import { HSEAccidentsTab } from "./components/HSEAccidentsTab";
import { HSENearMissTab } from "./components/HSENearMissTab";
import { HSEHazardsTab } from "./components/HSEHazardsTab";
import { HSEInspectionsTab } from "./components/HSEInspectionsTab";
import { HSEObservationsTab } from "./components/HSEObservationsTab";
import { HSEJSATab } from "./components/HSEJSATab";
import { HSEPermitsTab } from "./components/HSEPermitsTab";
import { HSEToolboxTab } from "./components/HSEToolboxTab";
import { HSERiskMatrixTab } from "./components/HSERiskMatrixTab";
import { HSECAPATab } from "./components/HSECAPATab";
import { HSEGisIntegrationTab } from "./components/HSEGisIntegrationTab";
import { HSEContractorEmergencyTab } from "./components/HSEContractorEmergencyTab";
import { HSEAIAssistantTab } from "./components/HSEAIAssistantTab";
import { HSESafetyCampaignTab } from "./components/HSESafetyCampaignTab";
import { HSEAISafetyTab } from "./components/HSEAISafetyTab";
import { HSEReportsExportTab } from "./components/HSEReportsExportTab";
import { Megaphone, BrainCircuit } from "lucide-react";

interface HSEModuleProps {
  onOpenAICopilot: () => void;
}

export const HSEModule: React.FC<HSEModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, company, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [kpis, setKpis] = useState<HSEKPISummary | null>(null);
  const [incidents, setIncidents] = useState<HSEIncident[]>([]);
  const [accidents, setAccidents] = useState<AccidentRecord[]>([]);
  const [nearMisses, setNearMisses] = useState<NearMissRecord[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [inspections, setInspections] = useState<HSEInspection[]>([]);
  const [observations, setObservations] = useState<SafetyObservation[]>([]);
  const [jsas, setJsas] = useState<JSA[]>([]);
  const [permits, setPermits] = useState<WorkPermit[]>([]);
  const [toolboxMeetings, setToolboxMeetings] = useState<ToolboxMeeting[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentItem[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionItem[]>([]);
  const [contractors, setContractors] = useState<ContractorHSE[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [emergencyPlan, setEmergencyPlan] = useState<EmergencyPlan | null>(null);
  const [envIncidents, setEnvIncidents] = useState<EnvironmentalIncidentRecord[]>([]);
  const [aiInsights, setAiInsights] = useState<HSEAIInsight[]>([]);

  const loadAllHSEData = async () => {
    setIsLoading(true);
    try {
      const kpiData = await hseRepository.getKPISummary();
      const incData = await hseRepository.getAll(company.id, activeSite.id);
      const accData = await hseRepository.getAccidents();
      const nmData = await hseRepository.getNearMisses();
      const hazData = await hseRepository.getHazards();
      const inspData = await hseRepository.getInspections();
      const obsData = await hseRepository.getObservations();
      const jsaData = await hseRepository.getJSAs();
      const ptwData = await hseRepository.getPermits();
      const tbmData = await hseRepository.getToolboxMeetings();
      const raData = await hseRepository.getRiskAssessments();
      const caData = await hseRepository.getCorrectiveActions();
      const contData = await hseRepository.getContractorHSE();
      const emgCont = await hseRepository.getEmergencyContacts();
      const emgPlan = await hseRepository.getEmergencyPlan();
      const envData = await hseRepository.getEnvironmentalIncidents();
      const aiData = await hseRepository.getAIInsights();

      setKpis(kpiData);
      setIncidents(incData);
      setAccidents(accData);
      setNearMisses(nmData);
      setHazards(hazData);
      setInspections(inspData);
      setObservations(obsData);
      setJsas(jsaData);
      setPermits(ptwData);
      setToolboxMeetings(tbmData);
      setRiskAssessments(raData);
      setCorrectiveActions(caData);
      setContractors(contData);
      setEmergencyContacts(emgCont);
      setEmergencyPlan(emgPlan);
      setEnvIncidents(envData);
      setAiInsights(aiData);
    } catch (err) {
      console.error("Error loading HSE module data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllHSEData();
  }, [company.id, activeSite.id]);

  // Handlers
  const handleCreateIncident = async (data: Omit<HSEIncident, "id" | "createdAt" | "updatedAt">) => {
    const newInc = await hseRepository.create(data as HSEIncident);
    setIncidents((prev) => [newInc, ...prev]);
    loadAllHSEData();
  };

  const handleCreateAccident = async (data: Omit<AccidentRecord, "id" | "createdAt" | "updatedAt">) => {
    const newAcc = await hseRepository.createAccident(data);
    setAccidents((prev) => [newAcc, ...prev]);
    loadAllHSEData();
  };

  const handleCreateNearMiss = async (data: Omit<NearMissRecord, "id" | "createdAt" | "updatedAt">) => {
    const newNM = await hseRepository.createNearMiss(data);
    setNearMisses((prev) => [newNM, ...prev]);
    loadAllHSEData();
  };

  const handleCreateHazard = async (data: Omit<Hazard, "id" | "createdAt" | "updatedAt">) => {
    const newHaz = await hseRepository.createHazard(data);
    setHazards((prev) => [newHaz, ...prev]);
    loadAllHSEData();
  };

  const handleUpdateHazardStatus = async (hazardId: string, status: HazardStatus) => {
    await hseRepository.updateHazardStatus(hazardId, status);
    loadAllHSEData();
  };

  const handleCreateInspection = async (data: Omit<HSEInspection, "id" | "createdAt" | "updatedAt">) => {
    const newInsp = await hseRepository.createInspection(data);
    setInspections((prev) => [newInsp, ...prev]);
    loadAllHSEData();
  };

  const handleCreateObservation = async (data: Omit<SafetyObservation, "id" | "createdAt" | "updatedAt">) => {
    const newObs = await hseRepository.createObservation(data);
    setObservations((prev) => [newObs, ...prev]);
    loadAllHSEData();
  };

  const handleCreateJSA = async (data: Omit<JSA, "id" | "createdAt" | "updatedAt">) => {
    const newJSA = await hseRepository.createJSA(data);
    setJsas((prev) => [newJSA, ...prev]);
    loadAllHSEData();
  };

  const handleApproveJSA = async (jsaId: string, approvedBy: string) => {
    await hseRepository.approveJSA(jsaId, approvedBy);
    loadAllHSEData();
  };

  const handleCreatePermit = async (data: Omit<WorkPermit, "id" | "createdAt" | "updatedAt">) => {
    const newPermit = await hseRepository.createPermit(data);
    setPermits((prev) => [newPermit, ...prev]);
    loadAllHSEData();
  };

  const handleValidateActivatePermit = async (permitId: string, approvedBy: string) => {
    const res = await hseRepository.validateAndActivatePermit(permitId, approvedBy);
    loadAllHSEData();
    return res;
  };

  const handleCreateToolboxMeeting = async (data: Omit<ToolboxMeeting, "id" | "createdAt" | "updatedAt">) => {
    const newTBM = await hseRepository.createToolboxMeeting(data);
    setToolboxMeetings((prev) => [newTBM, ...prev]);
    loadAllHSEData();
  };

  const handleCreateRiskAssessment = async (data: Omit<RiskAssessmentItem, "id" | "createdAt" | "updatedAt">) => {
    const newRA = await hseRepository.createRiskAssessment(data);
    setRiskAssessments((prev) => [newRA, ...prev]);
    loadAllHSEData();
  };

  const handleCreateCAPA = async (data: Omit<CorrectiveActionItem, "id" | "createdAt" | "updatedAt">) => {
    const newCA = await hseRepository.createCorrectiveAction(data);
    setCorrectiveActions((prev) => [newCA, ...prev]);
    loadAllHSEData();
  };

  const handleUpdateCAPAStatus = async (
    actionId: string,
    status: CorrectiveActionStatus,
    verifiedBy?: string,
    notes?: string
  ) => {
    await hseRepository.updateCorrectiveActionStatus(actionId, status, verifiedBy, notes);
    loadAllHSEData();
  };

  const handleQueryAI = async (query: string) => {
    return await hseRepository.queryAIHSEAssistant(query);
  };

  const tabs = [
    { key: "overview", label: "Command Center", icon: ShieldAlert },
    { key: "incidents", label: "Incident", icon: AlertTriangle },
    { key: "accidents", label: "Accident", icon: Activity },
    { key: "near-miss", label: "Near Miss", icon: ShieldAlert },
    { key: "hazards", label: "Hazard", icon: AlertTriangle },
    { key: "inspections", label: "Inspection", icon: CheckCircle2 },
    { key: "observations", label: "Observation", icon: Eye },
    { key: "permits", label: "Permit (PTW)", icon: FileCheck2 },
    { key: "risk-matrix", label: "Risk Assessment", icon: Activity },
    { key: "jsa", label: "JSA", icon: FileText },
    { key: "toolbox", label: "Toolbox Meeting", icon: Users },
    { key: "safety-campaign", label: "Safety Campaign", icon: Megaphone },
    { key: "ai-safety", label: "AI Safety", icon: BrainCircuit },
    { key: "corrective-actions", label: "CAPA Korektif", icon: CheckCircle2 },
    { key: "gis", label: "Peta GIS", icon: MapPin },
    { key: "contractors-emergency", label: "Kontraktor & ERT", icon: Building2 },
    { key: "reports", label: "Laporan & Export", icon: Download },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">HSE / K3 MANAGEMENT</h1>
              <p className="text-xs text-slate-400 font-medium">
                Health, Safety & Environment Management System - {company.name} [{activeSite.name}]
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllHSEData}
            disabled={isLoading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-rose-400" : ""}`} />
            Refresh
          </button>
          <button
            onClick={onOpenAICopilot}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" /> AI Copilot
          </button>
        </div>
      </div>

      {/* Sub-route / Tab Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      {isLoading && !kpis ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-rose-400" /> Memuat Data HSE & K3LH Pertambangan...
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "overview" && kpis && (
            <HSECommandCenterTab
              kpis={kpis}
              insights={aiInsights}
              onSelectTab={setActiveTab}
              onOpenReportModal={() => setActiveTab("incidents")}
            />
          )}

          {activeTab === "incidents" && (
            <HSEIncidentsTab incidents={incidents} onCreateIncident={handleCreateIncident} />
          )}

          {activeTab === "accidents" && (
            <HSEAccidentsTab accidents={accidents} onCreateAccident={handleCreateAccident} />
          )}

          {activeTab === "near-miss" && (
            <HSENearMissTab nearMisses={nearMisses} onCreateNearMiss={handleCreateNearMiss} />
          )}

          {activeTab === "hazards" && (
            <HSEHazardsTab
              hazards={hazards}
              onCreateHazard={handleCreateHazard}
              onUpdateStatus={handleUpdateHazardStatus}
            />
          )}

          {activeTab === "inspections" && (
            <HSEInspectionsTab inspections={inspections} onCreateInspection={handleCreateInspection} />
          )}

          {activeTab === "observations" && (
            <HSEObservationsTab observations={observations} onCreateObservation={handleCreateObservation} />
          )}

          {activeTab === "jsa" && (
            <HSEJSATab jsas={jsas} onCreateJSA={handleCreateJSA} onApproveJSA={handleApproveJSA} />
          )}

          {activeTab === "permits" && (
            <HSEPermitsTab
              permits={permits}
              onCreatePermit={handleCreatePermit}
              onValidateActivate={handleValidateActivatePermit}
            />
          )}

          {activeTab === "toolbox" && (
            <HSEToolboxTab toolboxMeetings={toolboxMeetings} onCreateToolboxMeeting={handleCreateToolboxMeeting} />
          )}

          {activeTab === "risk-matrix" && (
            <HSERiskMatrixTab
              riskAssessments={riskAssessments}
              onCreateRiskAssessment={handleCreateRiskAssessment}
            />
          )}

          {activeTab === "corrective-actions" && (
            <HSECAPATab
              correctiveActions={correctiveActions}
              onCreateCAPA={handleCreateCAPA}
              onUpdateStatus={handleUpdateCAPAStatus}
            />
          )}

          {activeTab === "gis" && (
            <HSEGisIntegrationTab incidents={incidents} hazards={hazards} />
          )}

          {activeTab === "contractors-emergency" && emergencyPlan && (
            <HSEContractorEmergencyTab
              contractors={contractors}
              emergencyContacts={emergencyContacts}
              emergencyPlan={emergencyPlan}
              envIncidents={envIncidents}
            />
          )}

          {activeTab === "safety-campaign" && (
            <HSESafetyCampaignTab />
          )}

          {activeTab === "ai-safety" && (
            <HSEAISafetyTab insights={aiInsights} onQueryAI={handleQueryAI} />
          )}

          {activeTab === "ai-insight" && (
            <HSEAISafetyTab insights={aiInsights} onQueryAI={handleQueryAI} />
          )}

          {activeTab === "reports" && <HSEReportsExportTab />}
        </div>
      )}
    </div>
  );
};
