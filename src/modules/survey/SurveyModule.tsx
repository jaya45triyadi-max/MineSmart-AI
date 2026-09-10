// MINE SMART AI - Survey Module Container (Integrated Multi-Format Import, Hardware Telemetry, Progress Comparison, AI Surface Change Suite)

import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Layers,
  Ruler,
  TrendingUp,
  Box,
  UploadCloud,
  ShieldCheck,
  FileText,
  Sparkles,
  Radio,
  BarChart3,
} from "lucide-react";

import { SurveyRepository } from "../../services/repositories/SurveyRepository";
import { SurveyQCService } from "../../services/survey/SurveyQCService";

import { SurveyHeader } from "./components/SurveyHeader";
import { SurveyDashboard } from "./components/SurveyDashboard";
import { AISurveyHubView } from "./components/AISurveyHubView";
import { SurveyIntegrationView } from "./components/SurveyIntegrationView";
import { ProgressComparisonView } from "./components/ProgressComparisonView";
import { SurveyPointManagementView } from "./components/SurveyPointManagementView";
import { SurfaceManagementView } from "./components/SurfaceManagementView";
import { DTMView } from "./components/DTMView";
import { DSMView } from "./components/DSMView";
import { ContourManagementView } from "./components/ContourManagementView";
import { CrossSectionView } from "./components/CrossSectionView";
import { CutFillView } from "./components/CutFillView";
import { VolumeCalculationView } from "./components/VolumeCalculationView";
import { SurveyImportView } from "./components/SurveyImportView";
import { SurveyQCView } from "./components/SurveyQCView";
import { SurveyReportView } from "./components/SurveyReportView";
import { SurveyAIModal } from "./components/SurveyAIModal";

interface SurveyModuleProps {
  initialSubRoute?: string;
  onNavigateSubRoute?: (subRoute: string) => void;
}

export const SurveyModule: React.FC<SurveyModuleProps> = ({
  initialSubRoute = "survey/overview",
  onNavigateSubRoute,
}) => {
  const [currentSubRoute, setCurrentSubRoute] = useState<string>(
    initialSubRoute.startsWith("survey/") ? initialSubRoute : `survey/${initialSubRoute}`
  );

  // Repository State
  const [points, setPoints] = useState(SurveyRepository.getPoints());
  const [surfaces, setSurfaces] = useState(SurveyRepository.getSurfaces());
  const [dtms, setDtms] = useState(SurveyRepository.getDTMs());
  const [dsms, setDsms] = useState(SurveyRepository.getDSMs());
  const [contours, setContours] = useState(SurveyRepository.getContours());
  const [crossSections, setCrossSections] = useState(SurveyRepository.getCrossSections());
  const [cutFills, setCutFills] = useState(SurveyRepository.getCutFills());
  const [volumes, setVolumes] = useState(SurveyRepository.getVolumes());
  const [importJobs, setImportJobs] = useState(SurveyRepository.getImportJobs());
  const [controlPoints, setControlPoints] = useState(SurveyRepository.getControlPoints());
  const [equipment, setEquipment] = useState(SurveyRepository.getEquipment());
  const [documents, setDocuments] = useState(SurveyRepository.getDocuments());
  const [devices, setDevices] = useState(SurveyRepository.getDevices());
  const [progressComparisons, setProgressComparisons] = useState(
    SurveyRepository.getProgressComparisons()
  );

  // QC Issues
  const [qcIssues, setQcIssues] = useState(
    SurveyQCService.runSurveyQCScan(points, surfaces, equipment)
  );

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleSubRouteClick = (subRouteKey: string) => {
    const fullRoute = `survey/${subRouteKey}`;
    setCurrentSubRoute(fullRoute);
    if (onNavigateSubRoute) {
      onNavigateSubRoute(fullRoute);
    }
  };

  // State Mutators
  const handleAddPoint = (pt: any) => {
    SurveyRepository.addPoint(pt);
    setPoints([...SurveyRepository.getPoints()]);
  };

  const handleValidatePoint = (id: string) => {
    const pt = points.find((p) => p.id === id);
    if (pt) {
      pt.status = "Approved";
      SurveyRepository.updatePoint(pt);
      setPoints([...SurveyRepository.getPoints()]);
    }
  };

  const handleAddSurface = (surf: any) => {
    SurveyRepository.addSurface(surf);
    setSurfaces([...SurveyRepository.getSurfaces()]);
  };

  const handleAddContour = (cnt: any) => {
    SurveyRepository.addContour(cnt);
    setContours([...SurveyRepository.getContours()]);
  };

  const handleAddCutFill = (cf: any) => {
    SurveyRepository.addCutFill(cf);
    setCutFills([...SurveyRepository.getCutFills()]);
  };

  const handleAddVolume = (vol: any) => {
    SurveyRepository.addVolume(vol);
    setVolumes([...SurveyRepository.getVolumes()]);
  };

  const handleAddImportJob = (job: any) => {
    SurveyRepository.addImportJob(job);
    setImportJobs([...SurveyRepository.getImportJobs()]);
  };

  const handleResolveQCIssue = (id: string) => {
    setQcIssues(qcIssues.filter((i) => i.id !== id));
  };

  const handleRunQCScanner = () => {
    const freshIssues = SurveyQCService.runSurveyQCScan(points, surfaces, equipment);
    setQcIssues(freshIssues);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 md:p-6 min-h-screen">
      {/* Module Header */}
      <SurveyHeader
        activeCoordinateSystem="WGS84 / UTM Zone 50S (EPSG:32750)"
        totalPoints={points.length}
        activeSurfaces={surfaces.length}
        pendingQCCount={qcIssues.length}
        onNewPoint={() => handleSubRouteClick("points")}
        onImportData={() => handleSubRouteClick("import")}
        onRunQC={() => handleSubRouteClick("qc")}
        onOpenAI={() => setIsAIModalOpen(true)}
        onExportReport={() => handleSubRouteClick("reports")}
      />

      {/* Sub-Route Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1.5 overflow-x-auto">
        {[
          { key: "overview", label: "Survey Center", icon: Compass },
          { key: "ai-survey", label: "AI Survey Suite", icon: Sparkles, isHighlight: true },
          { key: "integrations", label: "Integrasi Alat", icon: Radio, isHighlight: true },
          { key: "progress", label: "Progress vs Plan", icon: BarChart3, isHighlight: true },
          { key: "points", label: "Points", icon: MapPin },
          { key: "surfaces", label: "Surfaces", icon: Layers },
          { key: "dtm", label: "DTM", icon: Layers },
          { key: "dsm", label: "DSM", icon: Layers },
          { key: "contours", label: "Contours", icon: Ruler },
          { key: "cross-sections", label: "Cross Section", icon: Ruler },
          { key: "cut-fill", label: "Cut & Fill", icon: TrendingUp },
          { key: "volumes", label: "Volumes", icon: Box },
          { key: "import", label: "Import Multi-Format", icon: UploadCloud },
          { key: "qc", label: "QC Audit", icon: ShieldCheck, badge: qcIssues.length },
          { key: "reports", label: "Reports", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentSubRoute === `survey/${tab.key}` ||
            (currentSubRoute === "survey/overview" && tab.key === "overview") ||
            (currentSubRoute === "survey" && tab.key === "overview");
          return (
            <button
              key={tab.key}
              onClick={() => handleSubRouteClick(tab.key)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.isHighlight
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-950/40 border border-sky-400/40"
                    : "bg-sky-600 text-white shadow-md shadow-sky-900/30"
                  : tab.isHighlight
                  ? "bg-sky-950/40 text-sky-300 border border-sky-500/30 hover:bg-sky-900/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
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

      {/* Main Sub-Route Content Switcher */}
      <div>
        {(currentSubRoute === "survey/overview" || currentSubRoute === "survey") && (
          <SurveyDashboard
            points={points}
            surfaces={surfaces}
            cutFills={cutFills}
            volumes={volumes}
            qcIssues={qcIssues}
            onNavigateSubRoute={handleSubRouteClick}
            onOpenAI={() => setIsAIModalOpen(true)}
          />
        )}

        {currentSubRoute === "survey/ai-survey" && (
          <AISurveyHubView
            surfaces={surfaces}
            importJobs={importJobs}
            totalPointsCount={points.length}
          />
        )}

        {currentSubRoute === "survey/integrations" && (
          <SurveyIntegrationView
            devices={devices}
            onRefreshTelemetry={() => setDevices([...SurveyRepository.getDevices()])}
            onOpenAIAnalyzeDevice={() => setIsAIModalOpen(true)}
          />
        )}

        {currentSubRoute === "survey/progress" && (
          <ProgressComparisonView
            progressComparisons={progressComparisons}
            surfaces={surfaces}
            onOpenAIAnalyze={() => handleSubRouteClick("ai-survey")}
          />
        )}

        {currentSubRoute === "survey/points" && (
          <SurveyPointManagementView
            points={points}
            onAddPointSubmit={handleAddPoint}
            onValidatePoint={handleValidatePoint}
            onOpenAIAnalyze={(code) => setIsAIModalOpen(true)}
          />
        )}

        {currentSubRoute === "survey/surfaces" && (
          <SurfaceManagementView
            surfaces={surfaces}
            onAddSurfaceSubmit={handleAddSurface}
            onSelectSurfacesForCompare={(s1, s2) => handleSubRouteClick("cut-fill")}
          />
        )}

        {currentSubRoute === "survey/dtm" && <DTMView dtms={dtms} surfaces={surfaces} />}

        {currentSubRoute === "survey/dsm" && <DSMView dsms={dsms} dtms={dtms} />}

        {currentSubRoute === "survey/contours" && (
          <ContourManagementView
            contours={contours}
            surfaces={surfaces}
            onAddContourSubmit={handleAddContour}
          />
        )}

        {currentSubRoute === "survey/cross-sections" && (
          <CrossSectionView sections={crossSections} surfaces={surfaces} />
        )}

        {currentSubRoute === "survey/cut-fill" && (
          <CutFillView
            cutFills={cutFills}
            surfaces={surfaces}
            onAddCutFillSubmit={handleAddCutFill}
          />
        )}

        {currentSubRoute === "survey/volumes" && (
          <VolumeCalculationView
            volumes={volumes}
            surfaces={surfaces}
            onAddVolumeSubmit={handleAddVolume}
          />
        )}

        {currentSubRoute === "survey/import" && (
          <SurveyImportView
            importJobs={importJobs}
            onAddImportJob={handleAddImportJob}
            onOpenAISurfaceAnalysis={() => handleSubRouteClick("ai-survey")}
          />
        )}

        {currentSubRoute === "survey/qc" && (
          <SurveyQCView
            qcIssues={qcIssues}
            controlPoints={controlPoints}
            equipment={equipment}
            onResolveIssue={handleResolveQCIssue}
            onRunScanner={handleRunQCScanner}
          />
        )}

        {currentSubRoute === "survey/reports" && <SurveyReportView documents={documents} />}
      </div>

      {/* AI Assistant Modal */}
      <SurveyAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        totalPointsCount={points.length}
      />
    </div>
  );
};
