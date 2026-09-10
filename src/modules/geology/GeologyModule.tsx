// MINE SMART AI - Main Geology & Geological Intelligence Center Container

import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Compass,
  Ruler,
  Flame,
  FlaskConical,
  FileText,
  Database,
  Eye,
  ShieldCheck,
  FileSpreadsheet,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

// Components
import { GeologyHeader } from "./components/GeologyHeader";
import { GeologyDashboard } from "./components/GeologyDashboard";
import { AIGeologyHubView } from "./components/AIGeologyHubView";
import { BoreholeManagementView } from "./components/BoreholeManagementView";
import { BoreholeDetailView } from "./components/BoreholeDetailView";
import { CollarManagementView } from "./components/CollarManagementView";
import { DownholeSurveyView } from "./components/DownholeSurveyView";
import { LithologyManagementView } from "./components/LithologyManagementView";
import { SeamManagementView } from "./components/SeamManagementView";
import { SampleAssayView } from "./components/SampleAssayView";
import { CoalQualityView } from "./components/CoalQualityView";
import { GeologicalDatabaseView } from "./components/GeologicalDatabaseView";
import { GeologicalVisualizationView } from "./components/GeologicalVisualizationView";
import { GeologicalQCView } from "./components/GeologicalQCView";
import { GeologicalImportView } from "./components/GeologicalImportView";
import { GeologyAIModal } from "./components/GeologyAIModal";

// Repository & Services
import { GeologyRepository } from "../../services/repositories/GeologyRepository";
import { GeologyQCService } from "../../services/geology/GeologyQCService";
import { GeologyAIService } from "../../services/geology/GeologyAIService";
import {
  Borehole,
  Collar,
  DownholeSurveyRecord,
  LithologyRecord,
  SeamIntersection,
  SampleRecord,
  AssayRecord,
  CoalQualityProfile,
  GeologicalDatabaseVersion,
  GeologicalQCIssue,
} from "../../types/geologyTypes";

export const GeologyModule: React.FC = () => {
  // Navigation Sub-Routes
  const [activeSubRoute, setActiveSubRoute] = useState<
    | "overview"
    | "ai-geology"
    | "coal-quality"
    | "database"
    | "boreholes"
    | "collars"
    | "surveys"
    | "lithology"
    | "seams"
    | "samples"
    | "visualization"
    | "qc"
    | "import"
  >("overview");

  // Repository Data State
  const [boreholes, setBoreholes] = useState<Borehole[]>(GeologyRepository.getBoreholes());
  const [collars, setCollars] = useState<Collar[]>(GeologyRepository.getCollars());
  const [surveys, setSurveys] = useState<DownholeSurveyRecord[]>(GeologyRepository.getSurveys());
  const [catalog] = useState(GeologyRepository.getLithologyCatalog());
  const [lithologies, setLithologies] = useState<LithologyRecord[]>(GeologyRepository.getLithologies());
  const [seamMasters] = useState(GeologyRepository.getSeamMasters());
  const [seams, setSeams] = useState<SeamIntersection[]>(GeologyRepository.getSeamIntersections());
  const [samples, setSamples] = useState<SampleRecord[]>(GeologyRepository.getSamples());
  const [assays, setAssays] = useState<AssayRecord[]>(GeologyRepository.getAssays());
  const [qualities, setQualities] = useState<CoalQualityProfile[]>(GeologyRepository.getQualities());
  const [versions, setVersions] = useState<GeologicalDatabaseVersion[]>(GeologyRepository.getDatabaseVersions());
  const [corePhotos] = useState(GeologyRepository.getCorePhotos());

  // Selected Borehole for Detailed Explorer
  const [selectedBorehole, setSelectedBorehole] = useState<Borehole | null>(null);

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // QC Issues State
  const [qcIssues, setQCIssues] = useState<GeologicalQCIssue[]>(() =>
    GeologyQCService.runGeologyQCScan(boreholes, collars, lithologies, seams, samples, assays, qualities)
  );

  // Handlers
  const handleAddBorehole = (newBh: Borehole) => {
    GeologyRepository.addBorehole(newBh);
    setBoreholes([...GeologyRepository.getBoreholes()]);
  };

  const handleUpdateCollar = (updatedCollar: Collar) => {
    const nextCollars = collars.map((c) => (c.id === updatedCollar.id ? updatedCollar : c));
    setCollars(nextCollars);
  };

  const handleAddSurvey = (newSrv: DownholeSurveyRecord) => {
    GeologyRepository.addSurvey(newSrv);
    setSurveys([...GeologyRepository.getSurveys()]);
  };

  const handleAddLithology = (newLith: LithologyRecord) => {
    GeologyRepository.addLithology(newLith);
    setLithologies([...GeologyRepository.getLithologies()]);
  };

  const handleAddSeamIntersection = (newSeam: SeamIntersection) => {
    GeologyRepository.addSeamIntersection(newSeam);
    setSeams([...GeologyRepository.getSeamIntersections()]);
  };

  const handleAddSample = (newSmp: SampleRecord) => {
    GeologyRepository.addSample(newSmp);
    setSamples([...GeologyRepository.getSamples()]);
  };

  const handleAddDatabaseVersion = (newVer: GeologicalDatabaseVersion) => {
    GeologyRepository.addDatabaseVersion(newVer);
    setVersions([...GeologyRepository.getDatabaseVersions()]);
  };

  const handleRunQCScan = () => {
    const freshIssues = GeologyQCService.runGeologyQCScan(
      boreholes,
      collars,
      lithologies,
      seams,
      samples,
      assays,
      qualities
    );
    setQCIssues(freshIssues);
    setActiveSubRoute("qc");
  };

  const handleResolveQCIssue = (issueId: string) => {
    setQCIssues(qcIssues.filter((i) => i.id !== issueId));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Primary Geology Header */}
      <GeologyHeader
        activeDatabaseVersion="v1.0-APPROVED"
        onAddBorehole={() => setActiveSubRoute("boreholes")}
        onImportData={() => setActiveSubRoute("import")}
        onRunQC={handleRunQCScan}
        onVisualize={() => setActiveSubRoute("visualization")}
        onExport={() => {
          const report = GeologyAIService.generateGeologicalExecutiveReport();
          const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Geology_Master_Report_${new Date().toISOString().slice(0, 10)}.txt`;
          link.click();
        }}
        onOpenAI={() => setIsAIModalOpen(true)}
      />

      {/* Sub-Route Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview Center", icon: LayoutDashboard },
          { id: "ai-geology", label: "AI Geology Suite", icon: Sparkles, isHighlight: true },
          { id: "coal-quality", label: "Coal Quality (GAR/GCV)", icon: Flame, isHighlight: true },
          { id: "database", label: "Geological DB", icon: Database },
          { id: "boreholes", label: "Boreholes", icon: Layers },
          { id: "collars", label: "Collars", icon: MapPin },
          { id: "surveys", label: "Surveys (Dev)", icon: Compass },
          { id: "lithology", label: "Lithology Logs", icon: Ruler },
          { id: "seams", label: "Seams", icon: Flame },
          { id: "samples", label: "Samples & Assays", icon: FlaskConical },
          { id: "visualization", label: "Visualization 2D/GIS", icon: Eye },
          { id: "qc", label: "Quality Control", icon: ShieldCheck, badge: qcIssues.length },
          { id: "import", label: "Import", icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubRoute === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedBorehole(null);
                setActiveSubRoute(tab.id as any);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.isHighlight
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/40"
                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                  : tab.isHighlight
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main View Router Content */}
      {selectedBorehole ? (
        <BoreholeDetailView
          borehole={selectedBorehole}
          collar={collars.find((c) => c.boreholeCode === selectedBorehole.boreholeCode)}
          lithologies={lithologies.filter((l) => l.boreholeCode === selectedBorehole.boreholeCode)}
          seams={seams.filter((s) => s.boreholeCode === selectedBorehole.boreholeCode)}
          samples={samples.filter((s) => s.boreholeCode === selectedBorehole.boreholeCode)}
          assays={assays.filter((a) => a.boreholeCode === selectedBorehole.boreholeCode)}
          qualities={qualities.filter((q) => q.boreholeCode === selectedBorehole.boreholeCode)}
          corePhotos={corePhotos.filter((p) => p.boreholeCode === selectedBorehole.boreholeCode)}
          onBack={() => setSelectedBorehole(null)}
        />
      ) : (
        <>
          {activeSubRoute === "overview" && (
            <GeologyDashboard
              boreholes={boreholes}
              qualities={qualities}
              onNavigateSubRoute={(route) => {
                const sub = route.split("/")[2] || "overview";
                setActiveSubRoute(sub as any);
              }}
              onOpenAI={() => setIsAIModalOpen(true)}
            />
          )}

          {activeSubRoute === "ai-geology" && <AIGeologyHubView />}

          {activeSubRoute === "coal-quality" && <CoalQualityView qualities={qualities} />}

          {activeSubRoute === "database" && (
            <GeologicalDatabaseView
              versions={versions}
              onAddVersion={handleAddDatabaseVersion}
            />
          )}

          {activeSubRoute === "boreholes" && (
            <BoreholeManagementView
              boreholes={boreholes}
              onSelectBorehole={(bh) => setSelectedBorehole(bh)}
              onAddBoreholeSubmit={handleAddBorehole}
            />
          )}

          {activeSubRoute === "collars" && (
            <CollarManagementView
              collars={collars}
              onUpdateCollar={handleUpdateCollar}
            />
          )}

          {activeSubRoute === "surveys" && (
            <DownholeSurveyView
              surveys={surveys}
              onAddSurvey={handleAddSurvey}
            />
          )}

          {activeSubRoute === "lithology" && (
            <LithologyManagementView
              catalog={catalog}
              lithologies={lithologies}
              onAddLithology={handleAddLithology}
            />
          )}

          {activeSubRoute === "seams" && (
            <SeamManagementView
              seamMasters={seamMasters}
              seamIntersections={seams}
              onAddSeamIntersection={handleAddSeamIntersection}
            />
          )}

          {activeSubRoute === "samples" && (
            <SampleAssayView
              samples={samples}
              assays={assays}
              onAddSampleSubmit={handleAddSample}
            />
          )}

          {activeSubRoute === "visualization" && (
            <GeologicalVisualizationView
              boreholes={boreholes}
              collars={collars}
              lithologies={lithologies}
              seams={seams}
            />
          )}

          {activeSubRoute === "qc" && (
            <GeologicalQCView
              issues={qcIssues}
              onResolveIssue={handleResolveQCIssue}
              onRunQCScan={handleRunQCScan}
            />
          )}

          {activeSubRoute === "import" && (
            <GeologicalImportView
              onImportComplete={() => setActiveSubRoute("boreholes")}
            />
          )}
        </>
      )}

      {/* AI Copilot Assistant Modal */}
      <GeologyAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        activeBoreholeCount={boreholes.length}
      />
    </div>
  );
};
