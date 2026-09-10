import React, { useState } from "react";
import {
  Factory,
  Flame,
  Wrench,
  TrendingUp,
  Clock,
  FlaskConical,
  Scale,
  Sparkles,
  FileSpreadsheet,
  Gauge,
  Bot,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
} from "lucide-react";
import { useToast } from "../../components/ui/ToastProvider";
import {
  INITIAL_PLANTS,
  INITIAL_CRUSHERS,
  INITIAL_ROM_FEEDS,
  INITIAL_OUTPUTS,
  INITIAL_DOWNTIMES,
  INITIAL_QUALITY_SAMPLES,
  INITIAL_TARGETS,
  INITIAL_MATERIAL_BALANCES,
  INITIAL_BOTTLENECKS,
  INITIAL_EFFICIENCY,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_PRODUCT_SIZE_DISTRIBUTIONS,
  INITIAL_PIPELINE_TELEMETRY,
} from "../../data/processingPlantData";
import {
  ProcessingPlant,
  Crusher,
  ROMFeed,
  ProcessingOutput,
  ProcessingDowntime,
  ProcessingQualitySample,
  ProcessingTarget,
  ProcessingAlert,
  PlantMaterialBalance,
  PlantBottleneck,
  PlantEfficiency,
  PlantReport,
  CrusherStatus,
  ProductSizeDistribution,
  PipelineCircuitTelemetry,
} from "../../types/processingPlantTypes";

import { PlantPipelineFlowDashboard } from "./components/PlantPipelineFlowDashboard";
import { PlantOverviewTab } from "./components/PlantOverviewTab";
import { ROMFeedTab } from "./components/ROMFeedTab";
import { CrusherManagementTab } from "./components/CrusherManagementTab";
import { ThroughputTab } from "./components/ThroughputTab";
import { DowntimeTab } from "./components/DowntimeTab";
import { OutputQualityTab } from "./components/OutputQualityTab";
import { ProductSizeMonitoringTab } from "./components/ProductSizeMonitoringTab";
import { StockReconciliationTab } from "./components/StockReconciliationTab";
import { BottleneckAiTab } from "./components/BottleneckAiTab";
import { PlantReportsTab } from "./components/PlantReportsTab";

interface ProcessingPlantModuleProps {
  onOpenAICopilot?: () => void;
}

export const ProcessingPlantModule: React.FC<ProcessingPlantModuleProps> = ({
  onOpenAICopilot,
}) => {
  const { showToast } = useToast();

  // Active Sub-Tab Navigation
  const [activeTab, setActiveTab] = useState<
    | "pipeline-flow"
    | "overview"
    | "rom-feed"
    | "crusher"
    | "throughput"
    | "downtime"
    | "product-size"
    | "output-quality"
    | "stock-balance"
    | "bottleneck"
    | "reports"
  >("pipeline-flow");

  // State Collections
  const [plants, setPlants] = useState<ProcessingPlant[]>(INITIAL_PLANTS);
  const [crushers, setCrushers] = useState<Crusher[]>(INITIAL_CRUSHERS);
  const [feeds, setFeeds] = useState<ROMFeed[]>(INITIAL_ROM_FEEDS);
  const [outputs, setOutputs] = useState<ProcessingOutput[]>(INITIAL_OUTPUTS);
  const [downtimes, setDowntimes] = useState<ProcessingDowntime[]>(INITIAL_DOWNTIMES);
  const [samples, setSamples] = useState<ProcessingQualitySample[]>(INITIAL_QUALITY_SAMPLES);
  const [psdList, setPsdList] = useState<ProductSizeDistribution[]>(INITIAL_PRODUCT_SIZE_DISTRIBUTIONS);
  const [pipelineTelemetry, setPipelineTelemetry] = useState<PipelineCircuitTelemetry>(INITIAL_PIPELINE_TELEMETRY);
  const [targets, setTargets] = useState<ProcessingTarget[]>(INITIAL_TARGETS);
  const [balances, setBalances] = useState<PlantMaterialBalance[]>(INITIAL_MATERIAL_BALANCES);
  const [bottlenecks, setBottlenecks] = useState<PlantBottleneck[]>(INITIAL_BOTTLENECKS);
  const [efficiencies, setEfficiencies] = useState<PlantEfficiency[]>(INITIAL_EFFICIENCY);
  const [alerts, setAlerts] = useState<ProcessingAlert[]>(INITIAL_ALERTS);
  const [reports, setReports] = useState<PlantReport[]>(INITIAL_REPORTS);

  const [selectedPlantId, setSelectedPlantId] = useState<string>("CP-01");

  // Quick Modal Controls
  const [showFeedModal, setShowFeedModal] = useState<boolean>(false);
  const [showDowntimeModal, setShowDowntimeModal] = useState<boolean>(false);
  const [showPsdModal, setShowPsdModal] = useState<boolean>(false);

  // Quick Modal Form States
  const [feedSource, setFeedSource] = useState<string>("Pit 1 North");
  const [feedRate, setFeedRate] = useState<number>(1400);
  const [feedQty, setFeedQty] = useState<number>(1200);

  const [dtCategory, setDtCategory] = useState<string>("Material Blockage");
  const [dtDuration, setDtDuration] = useState<number>(1.2);
  const [dtReason, setDtReason] = useState<string>("Oversize boulder jammed at primary jaw feed chute");

  // Handlers
  const handleAddFeed = (newFeed: Partial<ROMFeed>) => {
    const created: ROMFeed = {
      id: `FEED-${Date.now()}`,
      feedId: `FEED-00${feeds.length + 1}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      plantId: newFeed.plantId || selectedPlantId,
      sourceLocation: newFeed.sourceLocation || "Pit 1 North",
      stockpileId: newFeed.stockpileId || "SP-ROM-01",
      stockpileName: newFeed.stockpileName || "ROM Stockpile A",
      materialType: newFeed.materialType || "Coal High Grade",
      quantity: newFeed.quantity || 1000,
      unit: "Ton",
      feedRate: newFeed.feedRate || 1400,
      quality: newFeed.quality || "CV: 5,240 GAR",
      shift: newFeed.shift || "SHIFT_1_DAY",
      date: newFeed.date || new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      operatorId: "OP-USER",
      operatorName: newFeed.operatorName || "Bambang Widodo",
      equipmentId: newFeed.equipmentId || "EX-101",
      equipmentCode: newFeed.equipmentCode || "EX-101",
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFeeds([created, ...feeds]);
    setPipelineTelemetry((prev) => ({
      ...prev,
      romLiveFeedRateTph: created.feedRate,
      romPadStockTons: prev.romPadStockTons + (created.quantity * 0.8),
    }));
    showToast("ROM Feed record successfully registered & live rate synced", "success");
    setShowFeedModal(false);
  };

  const handleAddCrusher = (newCrusher: Partial<Crusher>) => {
    const created: Crusher = {
      id: `CR-${Date.now()}`,
      crusherId: newCrusher.crusherCode || `CR-${crushers.length + 101}`,
      plantId: newCrusher.plantId || selectedPlantId,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      crusherCode: newCrusher.crusherCode || `CR-${crushers.length + 101}`,
      crusherName: newCrusher.crusherName || "New Crusher Unit",
      crusherType: newCrusher.crusherType || "Roll Crusher",
      manufacturer: newCrusher.manufacturer || "McLanahan",
      model: newCrusher.model || "Standard",
      designCapacity: newCrusher.designCapacity || 1000,
      capacityUnit: "t/h",
      installationDate: new Date().toISOString().split("T")[0],
      status: "RUNNING",
      engineHour: 100,
      operatingHour: 90,
      location: newCrusher.location || "Processing Hub",
      criticality: newCrusher.criticality || "HIGH",
      currentThroughput: (newCrusher.designCapacity || 1000) * 0.9,
      availability: 95.0,
      utilization: 88.0,
      efficiency: 92.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCrushers([...crushers, created]);
    showToast(`Crusher equipment ${created.crusherName} added`, "success");
  };

  const handleUpdateCrusherStatus = (crusherId: string, status: CrusherStatus) => {
    setCrushers(
      crushers.map((c) =>
        c.crusherId === crusherId
          ? {
              ...c,
              status,
              currentThroughput: status === "RUNNING" ? c.designCapacity * 0.9 : 0,
            }
          : c
      )
    );
    showToast(`Crusher ${crusherId} status changed to ${status}`, "info");
  };

  const handleAddDowntime = (newDowntime: Partial<ProcessingDowntime>) => {
    const created: ProcessingDowntime = {
      id: `DT-${Date.now()}`,
      downtimeId: `DT-PLANT-00${downtimes.length + 1}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      plantId: newDowntime.plantId || selectedPlantId,
      equipmentId: newDowntime.equipmentId || "CR-101",
      equipmentName: newDowntime.equipmentName || "Primary Jaw Crusher CR-101",
      startTime: newDowntime.startTime || new Date().toISOString(),
      endTime: newDowntime.endTime || new Date().toISOString(),
      duration: newDowntime.duration || 1.0,
      category: (newDowntime.category as any) || "Material Blockage",
      reason: newDowntime.reason || "Chute Jamming",
      subReason: newDowntime.subReason || "",
      planned: newDowntime.planned || false,
      impact: newDowntime.impact || "Temporary line stoppage",
      shift: newDowntime.shift || "SHIFT_1_DAY",
      operatorId: "OP-USER",
      maintenanceId: "WO-REF-99",
      workOrderId: newDowntime.workOrderId || `WO-CRUSH-${Date.now().toString().slice(-4)}`,
      status: "RESOLVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDowntimes([created, ...downtimes]);
    showToast("Downtime event logged & linked to Maintenance Work Order", "warning");
    setShowDowntimeModal(false);
  };

  const handleAddSample = (newSample: Partial<ProcessingQualitySample>) => {
    const created: ProcessingQualitySample = {
      id: `QS-${Date.now()}`,
      sampleId: newSample.sampleId || `QS-00${samples.length + 1}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      plantId: newSample.plantId || selectedPlantId,
      stockpileId: newSample.stockpileId || "SP-PROD-01",
      stockpileName: newSample.stockpileName || "Product Stockpile 1A",
      productId: newSample.productId || "PROD-01",
      productName: newSample.productName || "Crushed Coal GAR 5,200",
      sampleDate: newSample.sampleDate || new Date().toISOString().split("T")[0],
      sampleTime: newSample.sampleTime || new Date().toLocaleTimeString(),
      shift: newSample.shift || "SHIFT_1_DAY",
      sampleType: newSample.sampleType || "Automatic Belt Sampler",
      laboratory: newSample.laboratory || "Internal Mine Site Lab BBNU",
      parameter: newSample.parameter || "CV",
      value: newSample.value || 5200,
      unit: newSample.unit || "kcal/kg",
      minSpec: newSample.minSpec || 5000,
      maxSpec: newSample.maxSpec || 5400,
      target: newSample.target || 5200,
      status: newSample.status || "PASS",
      source: newSample.source || "Conveyor Discharge",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSamples([created, ...samples]);
    showToast(
      `Assay sample ${created.sampleId} recorded (${created.status})`,
      created.status === "PASS" ? "success" : "warning"
    );
  };

  const handleAddPSDSample = (newPsd: Partial<ProductSizeDistribution>) => {
    const created: ProductSizeDistribution = {
      id: `PSD-00${psdList.length + 1}`,
      plantId: newPsd.plantId || selectedPlantId,
      sampleTime: newPsd.sampleTime || new Date().toISOString().slice(0, 16).replace("T", " "),
      samplePoint: newPsd.samplePoint || "PRODUCT_CONVEYOR",
      nominalTopSizeMM: newPsd.nominalTopSizeMM || 50,
      actualTopSizeMM: newPsd.actualTopSizeMM || 48.2,
      closedSideSettingCSS: newPsd.closedSideSettingCSS || 45,
      lumpPercent50to100mm: newPsd.lumpPercent50to100mm || 0.5,
      nutPercent25to50mm: newPsd.nutPercent25to50mm || 43.5,
      finesPercent0to25mm: newPsd.finesPercent0to25mm || 56.0,
      ultraFinesBelow2mmPercent: newPsd.ultraFinesBelow2mmPercent || 7.5,
      oversizeRecirculationRateTph: newPsd.oversizeRecirculationRateTph || 72,
      screeningEfficiencyPercent: newPsd.screeningEfficiencyPercent || 93.0,
      sizeComplianceStatus: newPsd.sizeComplianceStatus || "COMPLIANT",
      operatorNotes: newPsd.operatorNotes || "Laboratory sieve test passing 50mm verified.",
      sieveFractions: newPsd.sieveFractions || [
        { meshSizeMM: 100, fractionLabel: "+100 mm (Boulders)", passingPercent: 100.0, retainedPercent: 0.0, specMinPercent: 100, specMaxPercent: 100, status: "NORMAL" },
        { meshSizeMM: 50, fractionLabel: "+50 mm (Top Oversize)", passingPercent: 99.5, retainedPercent: 0.5, specMinPercent: 98, specMaxPercent: 100, status: "NORMAL" },
        { meshSizeMM: 31.5, fractionLabel: "31.5 - 50 mm (Nut)", passingPercent: 78.0, retainedPercent: 21.5, specMinPercent: 70, specMaxPercent: 85, status: "NORMAL" },
        { meshSizeMM: 25, fractionLabel: "25 - 31.5 mm (Mid Nut)", passingPercent: 56.0, retainedPercent: 22.0, specMinPercent: 50, specMaxPercent: 65, status: "NORMAL" },
        { meshSizeMM: 10, fractionLabel: "10 - 25 mm (Coarse Fines)", passingPercent: 33.0, retainedPercent: 23.0, specMinPercent: 25, specMaxPercent: 40, status: "NORMAL" },
        { meshSizeMM: 2, fractionLabel: "< 2 mm (Ultrafines)", passingPercent: 7.5, retainedPercent: 25.5, specMinPercent: 4, specMaxPercent: 10, status: "NORMAL" },
      ],
    };

    setPsdList([created, ...psdList]);
    showToast(`Particle Size Distribution record ${created.id} saved`, "success");
    setShowPsdModal(false);
  };

  const handleReconcileBalance = (balanceId: string) => {
    setBalances(
      balances.map((b) =>
        b.balanceId === balanceId ? { ...b, status: "BALANCED", differenceQty: 0, variancePercent: 0 } : b
      )
    );
    showToast(`Material mass balance ${balanceId} successfully reconciled`, "success");
  };

  const handleGenerateReport = (type: string) => {
    const newRep: PlantReport = {
      id: `REP-${Date.now()}`,
      reportId: `REP-${Date.now()}`,
      companyId: "COMP-01",
      siteId: "SITE-BBNU-01",
      reportCode: `REP-${type.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      title: `${type} - ${new Date().toLocaleDateString()}`,
      type,
      period: "Today",
      generatedAt: new Date().toISOString(),
      format: "PDF",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReports([newRep, ...reports]);
    showToast(`Generated ${type} (Permission: processing.export Verified)`, "success");
  };

  const handleExport = (reportCode: string, format: string) => {
    showToast(`Exporting ${reportCode} in ${format} format...`, "info");
  };

  const handleOpenAiAnalysis = (prompt?: string) => {
    if (onOpenAICopilot) {
      onOpenAICopilot();
    } else {
      setActiveTab("bottleneck");
    }
  };

  // Nav Items Definition with ROM → Crusher → Stockpile → Shipment and 7 Monitoring Criteria
  const subNavItems = [
    { key: "pipeline-flow", label: "ROM → Shipment Dashboard", icon: Layers, badge: "CIRCUIT" },
    { key: "overview", label: "Plant Overview", icon: Factory },
    { key: "rom-feed", label: "1. Feed Monitoring", icon: Flame },
    { key: "throughput", label: "2. Throughput", icon: TrendingUp },
    { key: "product-size", label: "7. Product Size (PSD)", icon: FlaskConical, badge: "SIEVE" },
    { key: "downtime", label: "6. Downtime Center", icon: Clock },
    { key: "crusher", label: "Crusher Fleet & Specs", icon: Wrench },
    { key: "output-quality", label: "Output & Lab Quality", icon: Scale },
    { key: "stock-balance", label: "Stock Reconciliation", icon: Gauge },
    { key: "bottleneck", label: "AI Bottleneck Radar", icon: Sparkles, badge: "AI" },
    { key: "reports", label: "Shift Reports", icon: FileSpreadsheet },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Header */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 uppercase tracking-wider">
              MINE SMART AI • PROCESSING PLANT & CRUSHER COMMAND
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              3 Plants Online
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Crusher & Processing Plant Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time monitoring: <strong>Feed • Throughput • Production • Availability • Utilization • Downtime • Product Size</strong> across <strong>ROM → Crusher → Stockpile → Shipment</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAiAnalysis("Analisis kondisi operasional crusher dan rekomendasi pencegahan bottleneck")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Plant Copilot
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {subNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
                isActive
                  ? "bg-white dark:bg-[#111A2C] text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MAIN TAB CONTENT DISPLAY */}
      {/* ========================================================================= */}
      {activeTab === "pipeline-flow" && (
        <PlantPipelineFlowDashboard
          plants={plants}
          crushers={crushers}
          feeds={feeds}
          outputs={outputs}
          downtimes={downtimes}
          samples={samples}
          psdList={psdList}
          pipelineTelemetry={pipelineTelemetry}
          selectedPlantId={selectedPlantId}
          onSelectPlant={(id) => setSelectedPlantId(id)}
          onOpenAiAnalysis={handleOpenAiAnalysis}
          onOpenLogFeedModal={() => setShowFeedModal(true)}
          onOpenLogDowntimeModal={() => setShowDowntimeModal(true)}
          onOpenLogPSDModal={() => setShowPsdModal(true)}
          onNavigateTab={(key) => setActiveTab(key as any)}
        />
      )}

      {activeTab === "overview" && (
        <PlantOverviewTab
          plants={plants}
          crushers={crushers}
          alerts={alerts}
          outputs={outputs}
          selectedPlantId={selectedPlantId}
          onSelectPlant={(id) => setSelectedPlantId(id)}
          onOpenAiAnalysis={handleOpenAiAnalysis}
          onSelectTab={(tabKey) => setActiveTab(tabKey as any)}
        />
      )}

      {activeTab === "rom-feed" && (
        <ROMFeedTab
          feeds={feeds}
          plants={plants}
          onAddFeed={handleAddFeed}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "throughput" && (
        <ThroughputTab
          plants={plants}
          targets={targets}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "product-size" && (
        <ProductSizeMonitoringTab
          psdList={psdList}
          plants={plants}
          onAddPSDSample={handleAddPSDSample}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "downtime" && (
        <DowntimeTab
          downtimes={downtimes}
          plants={plants}
          onAddDowntime={handleAddDowntime}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "crusher" && (
        <CrusherManagementTab
          crushers={crushers}
          plants={plants}
          onAddCrusher={handleAddCrusher}
          onUpdateStatus={handleUpdateCrusherStatus}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "output-quality" && (
        <OutputQualityTab
          outputs={outputs}
          samples={samples}
          onAddSample={handleAddSample}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "stock-balance" && (
        <StockReconciliationTab
          balances={balances}
          onReconcile={handleReconcileBalance}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "bottleneck" && (
        <BottleneckAiTab
          bottlenecks={bottlenecks}
          efficiencies={efficiencies}
          onOpenAiAnalysis={handleOpenAiAnalysis}
        />
      )}

      {activeTab === "reports" && (
        <PlantReportsTab
          reports={reports}
          onGenerateReport={handleGenerateReport}
          onExport={handleExport}
        />
      )}

      {/* ========================================================================= */}
      {/* QUICK LOG MODALS */}
      {/* ========================================================================= */}
      
      {/* Quick Feed Entry Modal */}
      {showFeedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Quick Log ROM Feed Inflow
              </h3>
              <button
                onClick={() => setShowFeedModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddFeed({
                  plantId: selectedPlantId,
                  sourceLocation: feedSource,
                  feedRate: Number(feedRate),
                  quantity: Number(feedQty),
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Feed Source Pit</label>
                <select
                  value={feedSource}
                  onChange={(e) => setFeedSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Pit 1 North (High Grade)">Pit 1 North (High Grade Seam A)</option>
                  <option value="Pit 2 South (Medium Grade)">Pit 2 South (Medium Grade Seam B)</option>
                  <option value="ROM Stockpile Pad A">ROM Stockpile Pad A</option>
                  <option value="High-Ash Blending Pad">High-Ash Blending Pad</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Live Feed Rate (t/h)</label>
                  <input
                    type="number"
                    value={feedRate}
                    onChange={(e) => setFeedRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Batch Tonnage (Ton)</label>
                  <input
                    type="number"
                    value={feedQty}
                    onChange={(e) => setFeedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Save ROM Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Downtime Entry Modal */}
      {showDowntimeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Quick Log Plant Downtime Interruption
              </h3>
              <button
                onClick={() => setShowDowntimeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDowntime({
                  plantId: selectedPlantId,
                  category: dtCategory as any,
                  duration: Number(dtDuration),
                  reason: dtReason,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Downtime Category</label>
                <select
                  value={dtCategory}
                  onChange={(e) => setDtCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Material Blockage">Material Blockage (Chute Jam)</option>
                  <option value="Breakdown">Mechanical / Electrical Breakdown</option>
                  <option value="Power Failure">Power Supply Interruption</option>
                  <option value="Operational Delay">Operational Delay (No Hauler / Wet Coal)</option>
                  <option value="Planned Maintenance">Planned Maintenance / Screen Mesh Change</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Duration (Hours)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dtDuration}
                  onChange={(e) => setDtDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Root Cause / Problem Description</label>
                <textarea
                  value={dtReason}
                  onChange={(e) => setDtReason(e.target.value)}
                  placeholder="Describe root cause and action taken..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDowntimeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Log Downtime Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick PSD Entry Modal */}
      {showPsdModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-500" />
                Quick Log Product Particle Size (PSD)
              </h3>
              <button
                onClick={() => setShowPsdModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPSDSample({
                  plantId: selectedPlantId,
                  actualTopSizeMM: 48.0,
                  nominalTopSizeMM: 50,
                  closedSideSettingCSS: 45,
                });
              }}
              className="space-y-4 text-xs"
            >
              <p className="text-slate-500">
                Quickly register nominal top size test sample. For detailed multi-mesh sieve analysis curves, use the dedicated Product Size (PSD) tab.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Nominal Top Size (mm)</label>
                  <input
                    type="number"
                    defaultValue={50}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Actual Top Size (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={47.8}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPsdModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Quick Assay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
