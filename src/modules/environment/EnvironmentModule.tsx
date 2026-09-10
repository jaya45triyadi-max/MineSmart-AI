import React, { useState, useEffect } from "react";
import {
  Trees,
  Droplets,
  Wind,
  Trash2,
  Mountain,
  ShieldAlert,
  FileCheck2,
  CheckSquare,
  MapPin,
  BarChart3,
  Sparkles,
  FileSpreadsheet,
  FolderOpen,
  Settings,
  Calendar,
  Layers,
  Activity,
  Bot,
  RefreshCw,
  Award,
  Sprout,
} from "lucide-react";

import { environmentRepository } from "../../services/repositories/EnvironmentRepository";
import {
  EnvironmentalKPISummary,
  WaterSample,
  WaterQualityResult,
  WaterDischargeRecord,
  WaterBalanceSummary,
  AirMonitoringStation,
  AirQualityReading,
  DustMonitoringRecord,
  WaterTruckDustControl,
  EnvironmentalWasteRecord,
  DrainagePoint,
  DrainageInspection,
  SedimentPond,
  SedimentPondInspection,
  EnvironmentalStandard,
  EnvironmentalComplianceRequirement,
  EnvironmentalPermit,
  EnvironmentalIncident,
  EnvironmentalCAPA,
  EnvironmentalAIInsight,
} from "../../types/environmentTypes";

import { EnvironmentalPerformanceDashboard } from "./components/EnvironmentalPerformanceDashboard";
import { ReclamationTab } from "./components/ReclamationTab";
import { RevegetationTab } from "./components/RevegetationTab";
import { ErosionTab } from "./components/ErosionTab";
import { SedimentPondTab } from "./components/SedimentPondTab";
import { WaterManagementTab } from "./components/WaterManagementTab";
import { AirQualityTab } from "./components/AirQualityTab";
import { DustManagementTab } from "./components/DustManagementTab";
import { WasteManagementTab } from "./components/WasteManagementTab";
import { DrainageManagementTab } from "./components/DrainageManagementTab";
import { MonitoringScheduleTab } from "./components/MonitoringScheduleTab";
import { EnvironmentalIncidentsTab } from "./components/EnvironmentalIncidentsTab";
import { CompliancePermitsTab } from "./components/CompliancePermitsTab";
import { EnvironmentalCAPATab } from "./components/EnvironmentalCAPATab";
import { EnvironmentalGisMapTab } from "./components/EnvironmentalGisMapTab";
import { EnvironmentalAnalyticsTab } from "./components/EnvironmentalAnalyticsTab";
import { EnvironmentalAIAssistantTab } from "./components/EnvironmentalAIAssistantTab";
import { EnvironmentalReportsExportTab } from "./components/EnvironmentalReportsExportTab";
import { EnvironmentalDocumentsTab } from "./components/EnvironmentalDocumentsTab";
import { EnvironmentalSettingsTab } from "./components/EnvironmentalSettingsTab";

interface Props {
  onOpenAICopilot?: () => void;
}

export type EnvTab =
  | "performance"
  | "reclamation"
  | "revegetation"
  | "erosion"
  | "sediment-pond"
  | "water"
  | "air"
  | "dust"
  | "waste"
  | "drainage"
  | "monitoring"
  | "incidents"
  | "compliance"
  | "corrective-actions"
  | "maps"
  | "analytics"
  | "ai-insight"
  | "reports"
  | "documents"
  | "settings";

export const EnvironmentModule: React.FC<Props> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<EnvTab>("performance");
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [kpi, setKpi] = useState<EnvironmentalKPISummary | null>(null);
  const [monitoringPoints, setMonitoringPoints] = useState<any[]>([]);
  const [waterSamples, setWaterSamples] = useState<WaterSample[]>([]);
  const [qualityResults, setQualityResults] = useState<WaterQualityResult[]>([]);
  const [discharges, setDischarges] = useState<WaterDischargeRecord[]>([]);
  const [waterBalance, setWaterBalance] = useState<WaterBalanceSummary | null>(null);
  const [airStations, setAirStations] = useState<AirMonitoringStation[]>([]);
  const [airReadings, setAirReadings] = useState<AirQualityReading[]>([]);
  const [dustRecords, setDustRecords] = useState<DustMonitoringRecord[]>([]);
  const [waterTrucks, setWaterTrucks] = useState<WaterTruckDustControl[]>([]);
  const [wasteRecords, setWasteRecords] = useState<EnvironmentalWasteRecord[]>([]);
  const [drainagePoints, setDrainagePoints] = useState<DrainagePoint[]>([]);
  const [drainageInspections, setDrainageInspections] = useState<DrainageInspection[]>([]);
  const [sedimentPonds, setSedimentPonds] = useState<SedimentPond[]>([]);
  const [sedimentInspections, setSedimentInspections] = useState<SedimentPondInspection[]>([]);
  const [standards, setStandards] = useState<EnvironmentalStandard[]>([]);
  const [complianceReqs, setComplianceReqs] = useState<EnvironmentalComplianceRequirement[]>([]);
  const [permits, setPermits] = useState<EnvironmentalPermit[]>([]);
  const [incidents, setIncidents] = useState<EnvironmentalIncident[]>([]);
  const [capas, setCapas] = useState<EnvironmentalCAPA[]>([]);
  const [aiInsights, setAiInsights] = useState<EnvironmentalAIInsight[]>([]);

  useEffect(() => {
    loadEnvironmentData();
  }, []);

  const loadEnvironmentData = async () => {
    setIsLoading(true);
    try {
      const [
        kpiData,
        pointsData,
        samplesData,
        resultsData,
        dischargesData,
        balanceData,
        stationsData,
        readingsData,
        dustData,
        trucksData,
        wasteData,
        drainagePtsData,
        drainageInspData,
        pondsData,
        pondInspData,
        stdsData,
        reqsData,
        permitsData,
        incidentsData,
        capasData,
        insightsData,
      ] = await Promise.all([
        environmentRepository.getKPISummary(),
        environmentRepository.getMonitoringPoints(),
        environmentRepository.getWaterSamples(),
        environmentRepository.getWaterQualityResults(),
        environmentRepository.getWaterDischarges(),
        environmentRepository.getWaterBalance(),
        environmentRepository.getAirStations(),
        environmentRepository.getAirReadings(),
        environmentRepository.getDustRecords(),
        environmentRepository.getWaterTruckActivities(),
        environmentRepository.getWasteRecords(),
        environmentRepository.getDrainagePoints(),
        environmentRepository.getDrainageInspections(),
        environmentRepository.getSedimentPonds(),
        environmentRepository.getSedimentPondInspections(),
        environmentRepository.getStandards(),
        environmentRepository.getComplianceRequirements(),
        environmentRepository.getPermits(),
        environmentRepository.getIncidents(),
        environmentRepository.getCAPAs(),
        environmentRepository.getAIInsights(),
      ]);

      setKpi(kpiData);
      setMonitoringPoints(pointsData);
      setWaterSamples(samplesData);
      setQualityResults(resultsData);
      setDischarges(dischargesData);
      setWaterBalance(balanceData);
      setAirStations(stationsData);
      setAirReadings(readingsData);
      setDustRecords(dustData);
      setWaterTrucks(trucksData);
      setWasteRecords(wasteData);
      setDrainagePoints(drainagePtsData);
      setDrainageInspections(drainageInspData);
      setSedimentPonds(pondsData);
      setSedimentInspections(pondInspData);
      setStandards(stdsData);
      setComplianceReqs(reqsData);
      setPermits(permitsData);
      setIncidents(incidentsData);
      setCapas(capasData);
      setAiInsights(insightsData);
    } catch (err) {
      console.error("Error loading environmental management data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWaterSample = async (sampleData: Omit<WaterSample, "id" | "createdAt" | "updatedAt">) => {
    const created = await environmentRepository.addWaterSample(sampleData);
    setWaterSamples((prev) => [created, ...prev]);
  };

  const handleAddWasteRecord = async (wasteData: Omit<EnvironmentalWasteRecord, "id" | "createdAt" | "updatedAt">) => {
    const created = await environmentRepository.addWasteRecord(wasteData);
    setWasteRecords((prev) => [created, ...prev]);
  };

  const navTabs: { id: EnvTab; label: string; icon: React.ElementType }[] = [
    { id: "performance", label: "Environmental Performance", icon: Award },
    { id: "reclamation", label: "Reklamasi", icon: Mountain },
    { id: "revegetation", label: "Revegetasi", icon: Trees },
    { id: "erosion", label: "Erosi", icon: Activity },
    { id: "sediment-pond", label: "Sediment Pond", icon: Mountain },
    { id: "water", label: "Water Quality", icon: Droplets },
    { id: "air", label: "Air Quality", icon: Wind },
    { id: "dust", label: "Dust", icon: Droplets },
    { id: "waste", label: "Waste", icon: Trash2 },
    { id: "drainage", label: "Drainage", icon: Layers },
    { id: "monitoring", label: "Jadwal Sampling", icon: Calendar },
    { id: "incidents", label: "Insiden Lingkungan", icon: ShieldAlert },
    { id: "compliance", label: "Izin & Compliance", icon: FileCheck2 },
    { id: "corrective-actions", label: "CAPA Tracking", icon: CheckSquare },
    { id: "maps", label: "Peta Spasial GIS", icon: MapPin },
    { id: "analytics", label: "Analitik & Tren", icon: BarChart3 },
    { id: "ai-insight", label: "AI Env Assistant", icon: Sparkles },
    { id: "reports", label: "Laporan ESDM/DLH", icon: FileSpreadsheet },
    { id: "documents", label: "Arsip Dokumen", icon: FolderOpen },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              MINE SMART AI • SHE & Environment Division
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-3">
            <Trees className="h-8 w-8 text-emerald-400" />
            Environmental Management & Control System
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sistem terpadu pengelolaan lingkungan tambang: Reklamasi, Revegetasi, Erosi, Sediment Pond, Water Quality, Air Quality, Dust, Waste & Drainage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEnvironmentData}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            Refresh
          </button>
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 shadow-md transition"
          >
            <Bot className="h-4 w-4" /> AI Copilot
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-slate-800/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-xs text-slate-400">Memuat data manajemen lingkungan tambang...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "performance" && (
            <EnvironmentalPerformanceDashboard
              kpi={kpi}
              waterSamples={waterSamples}
              airReadings={airReadings}
              sedimentPonds={sedimentPonds}
              incidents={incidents}
              capas={capas}
              aiInsights={aiInsights}
              onNavigateTab={(tab) => setActiveTab(tab as EnvTab)}
              onOpenAIAssistant={() => setActiveTab("ai-insight")}
            />
          )}

          {activeTab === "reclamation" && <ReclamationTab />}

          {activeTab === "revegetation" && <RevegetationTab />}

          {activeTab === "erosion" && <ErosionTab />}

          {activeTab === "sediment-pond" && (
            <SedimentPondTab
              sedimentPonds={sedimentPonds}
              inspections={sedimentInspections}
            />
          )}

          {activeTab === "water" && (
            <WaterManagementTab
              waterSamples={waterSamples}
              qualityResults={qualityResults}
              discharges={discharges}
              waterBalance={waterBalance}
              onAddSample={handleAddWaterSample}
            />
          )}

          {activeTab === "air" && (
            <AirQualityTab stations={airStations} readings={airReadings} />
          )}

          {activeTab === "dust" && (
            <DustManagementTab dustRecords={dustRecords} waterTrucks={waterTrucks} />
          )}

          {activeTab === "waste" && (
            <WasteManagementTab
              wasteRecords={wasteRecords}
              onAddWasteRecord={handleAddWasteRecord}
            />
          )}

          {activeTab === "drainage" && (
            <DrainageManagementTab
              drainagePoints={drainagePoints}
              inspections={drainageInspections}
            />
          )}

          {activeTab === "monitoring" && (
            <MonitoringScheduleTab monitoringPoints={monitoringPoints} />
          )}

          {activeTab === "incidents" && (
            <EnvironmentalIncidentsTab incidents={incidents} />
          )}

          {activeTab === "compliance" && (
            <CompliancePermitsTab
              standards={standards}
              complianceRequirements={complianceReqs}
              permits={permits}
            />
          )}

          {activeTab === "corrective-actions" && (
            <EnvironmentalCAPATab capas={capas} />
          )}

          {activeTab === "maps" && (
            <EnvironmentalGisMapTab
              monitoringPoints={monitoringPoints}
              sedimentPonds={sedimentPonds}
              airStations={airStations}
              wasteRecords={wasteRecords}
            />
          )}

          {activeTab === "analytics" && <EnvironmentalAnalyticsTab />}

          {activeTab === "ai-insight" && (
            <EnvironmentalAIAssistantTab aiInsights={aiInsights} />
          )}

          {activeTab === "reports" && <EnvironmentalReportsExportTab />}

          {activeTab === "documents" && <EnvironmentalDocumentsTab />}

          {activeTab === "settings" && <EnvironmentalSettingsTab />}
        </>
      )}
    </div>
  );
};

