import React, { useState, useEffect } from "react";
import {
  Route as RouteIcon,
  Truck,
  MapPin,
  TrendingUp,
  Clock,
  Fuel,
  AlertTriangle,
  Compass,
  Layers,
  Sparkles,
  Bot,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Sliders,
  RefreshCw,
  Zap,
  ShieldCheck,
  Building2,
  Calendar,
  Layers3,
  AlertCircle,
  BarChart3,
  ChevronRight,
  Eye,
  Wrench,
  Gauge,
  Navigation,
  FileSpreadsheet,
  Check,
  X,
  Map as MapIcon,
  Maximize2,
  Droplets,
  Share2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../../providers/AuthProvider";
import {
  HaulingTrip,
  HaulingRoute,
  HaulingRouteVersion,
  HaulingRouteSegment,
  HaulingQueueItem,
  RoadConditionItem,
  RoadInspectionRecord,
  HaulingFuelRecord,
  HaulingBottleneckItem,
  HaulingAlertItem,
  HaulingDataQualityCheck,
  TruckProductivityMetrics,
  HaulingScenario,
  AIDailyHaulingReport,
} from "../../types/haulingTypes";
import { haulingRepository } from "../../services/repositories/HaulingRepository";

interface HaulingModuleProps {
  onOpenAICopilot: () => void;
}

export type HaulingSubTab =
  | "overview"
  | "live"
  | "routes"
  | "map"
  | "distance"
  | "travel-time"
  | "cycle-time"
  | "queue"
  | "truck-productivity"
  | "road-condition"
  | "fuel-efficiency"
  | "optimization"
  | "alerts"
  | "history"
  | "reports";

export const HaulingModule: React.FC<HaulingModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, currentUser, company } = useAuth();

  // Active Sub-tab State
  const [activeTab, setActiveTab] = useState<HaulingSubTab>("overview");

  // State Collections
  const [trips, setTrips] = useState<HaulingTrip[]>([]);
  const [routes, setRoutes] = useState<HaulingRoute[]>([]);
  const [versions, setVersions] = useState<HaulingRouteVersion[]>([]);
  const [segments, setSegments] = useState<HaulingRouteSegment[]>([]);
  const [queues, setQueues] = useState<HaulingQueueItem[]>([]);
  const [roadConditions, setRoadConditions] = useState<RoadConditionItem[]>([]);
  const [roadInspections, setRoadInspections] = useState<RoadInspectionRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<HaulingFuelRecord[]>([]);
  const [bottlenecks, setBottlenecks] = useState<HaulingBottleneckItem[]>([]);
  const [alerts, setAlerts] = useState<HaulingAlertItem[]>([]);
  const [truckProductivity, setTruckProductivity] = useState<TruckProductivityMetrics[]>([]);
  const [dqChecks, setDqChecks] = useState<HaulingDataQualityCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Forms
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string }>>([]);
  const [aiDailyReport, setAiDailyReport] = useState<AIDailyHaulingReport | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTruckFilter, setSelectedTruckFilter] = useState("ALL");
  const [selectedRouteFilter, setSelectedRouteFilter] = useState("ALL");

  // Scenario Simulator State
  const [simSelectedRoutes, setSimSelectedRoutes] = useState<string[]>(["R-PIT1-ROM1"]);
  const [simTruckAdj, setSimTruckAdj] = useState<number>(2);
  const [simRoadImprove, setSimRoadImprove] = useState<boolean>(true);
  const [simQueueReduction, setSimQueueReduction] = useState<number>(3);
  const [scenarioResult, setScenarioResult] = useState<HaulingScenario | null>(null);

  // Route Comparison State
  const [compareRouteA, setCompareRouteA] = useState("R-PIT1-ROM1");
  const [compareRouteB, setCompareRouteB] = useState("R-PIT2-ROM2");

  // New Trip Form State
  const [tripForm, setTripForm] = useState({
    dispatchId: `DSP-${Math.floor(1000 + Math.random() * 9000)}`,
    truckUnitCode: "DT-021",
    operatorName: currentUser?.displayName || "Supriadi",
    originName: "Pit 1 South RL+45",
    destinationName: "ROM Stockpile 01",
    routeName: "Pit 1 South → ROM Stockpile 01",
    materialType: "Coal High Grade",
    distance: 4.8,
    loadedDistance: 2.5,
    emptyDistance: 2.3,
    payload: 38.5,
    fuelConsumed: 3.9,
    roadCondition: "Good" as RoadConditionItem["condition"],
  });

  // New Route Form State
  const [routeForm, setRouteForm] = useState({
    routeName: "",
    origin: "",
    destination: "",
    routeType: "Coal Hauling" as HaulingRoute["routeType"],
    distanceKm: 4.5,
    loadedDistanceKm: 2.3,
    emptyDistanceKm: 2.2,
    roadName: "Hauling Road Alpha",
    speedLimitKmh: 40,
    gradientPercent: 5,
  });

  // Road Inspection Form State
  const [inspectionForm, setInspectionForm] = useState({
    roadId: "RD-ALPHA",
    roadName: "Hauling Road Alpha",
    inspector: currentUser?.displayName || "Heri Santoso",
    condition: "Fair" as RoadConditionItem["condition"],
    findings: "",
    recommendation: "",
    priority: "MEDIUM" as RoadInspectionRecord["priority"],
  });

  // Load All Repository Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        tData,
        rData,
        vData,
        sData,
        qData,
        rcData,
        riData,
        fData,
        bData,
        aData,
        tpData,
        dqData,
      ] = await Promise.all([
        haulingRepository.getAllTrips(company.id, activeSite.id),
        haulingRepository.getRoutes(company.id, activeSite.id),
        haulingRepository.getRouteVersions(company.id, activeSite.id),
        haulingRepository.getRouteSegments(company.id, activeSite.id),
        haulingRepository.getQueues(company.id, activeSite.id),
        haulingRepository.getRoadConditions(company.id, activeSite.id),
        haulingRepository.getRoadInspections(company.id, activeSite.id),
        haulingRepository.getFuelRecords(company.id, activeSite.id),
        haulingRepository.getBottlenecks(company.id, activeSite.id),
        haulingRepository.getAlerts(company.id, activeSite.id),
        haulingRepository.getTruckProductivity(company.id, activeSite.id),
        haulingRepository.getDataQualityChecks(company.id, activeSite.id),
      ]);

      setTrips(tData);
      setRoutes(rData);
      setVersions(vData);
      setSegments(sData);
      setQueues(qData);
      setRoadConditions(rcData);
      setRoadInspections(riData);
      setFuelRecords(fData);
      setBottlenecks(bData);
      setAlerts(aData);
      setTruckProductivity(tpData);
      setDqChecks(dqData);
    } catch (err) {
      console.error("Failed to load hauling data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [company.id, activeSite.id]);

  // Calculations for Command Center KPIs
  const activeRoutesCount = routes.filter((r) => r.status === "ACTIVE").length;
  const activeTrucksCount = trips.filter((t) => t.tripStatus !== "Completed" && t.tripStatus !== "Cancelled").length || 18;
  const totalDistanceKm = trips.reduce((sum, t) => sum + (t.distance || 0), 0);
  const avgDistanceKm = trips.length > 0 ? Number((totalDistanceKm / trips.length).toFixed(1)) : 4.8;
  const avgTravelTimeMin = trips.length > 0 ? Number((trips.reduce((sum, t) => sum + (t.loadedTravelTime + t.emptyTravelTime), 0) / trips.length).toFixed(1)) : 22.5;
  const loadedTravelTimeMin = trips.length > 0 ? Number((trips.reduce((sum, t) => sum + t.loadedTravelTime, 0) / trips.length).toFixed(1)) : 12.5;
  const emptyReturnTimeMin = trips.length > 0 ? Number((trips.reduce((sum, t) => sum + t.emptyTravelTime, 0) / trips.length).toFixed(1)) : 10.0;
  const avgCycleTimeMin = trips.length > 0 ? Number((trips.reduce((sum, t) => sum + t.cycleTime, 0) / trips.length).toFixed(1)) : 34.2;
  const avgQueueTimeMin = queues.length > 0 ? Number((queues.reduce((sum, q) => sum + q.queueDurationMin, 0) / queues.length).toFixed(1)) : 5.4;
  const truckProductivityTonHr = truckProductivity.length > 0 ? Number((truckProductivity.reduce((sum, tp) => sum + tp.tonPerHour, 0) / truckProductivity.length).toFixed(1)) : 68.5;
  const fuelEfficiencyLPerTon = fuelRecords.length > 0 ? Number((fuelRecords.reduce((sum, f) => sum + f.fuelPerTon, 0) / fuelRecords.length).toFixed(3)) : 0.098;
  const criticalRoadsCount = roadConditions.filter((rc) => rc.condition === "Critical" || rc.condition === "Poor").length;
  const haulingDelaysCount = alerts.filter((a) => !a.isResolved).length;

  // Form Handlers
  const handleCreateTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: Omit<HaulingTrip, "id" | "createdAt" | "updatedAt"> = {
      haulingId: `HL-${Date.now()}`,
      dispatchId: tripForm.dispatchId,
      companyId: company.id,
      siteId: activeSite.id,
      truckId: `TRK-${tripForm.truckUnitCode}`,
      truckUnitCode: tripForm.truckUnitCode,
      operatorId: `OP-${Math.floor(100 + Math.random() * 900)}`,
      operatorName: tripForm.operatorName,
      originId: "LOC-ORIGIN",
      originName: tripForm.originName,
      destinationId: "LOC-DEST",
      destinationName: tripForm.destinationName,
      routeId: "R-PIT1-ROM1",
      routeName: tripForm.routeName,
      materialType: tripForm.materialType,
      tripStatus: "Loaded Hauling",
      startTime: new Date().toISOString(),
      loadingCompleteTime: new Date().toISOString(),
      haulingStartTime: new Date().toISOString(),
      destinationArrivalTime: "",
      dumpingCompleteTime: "",
      returnStartTime: "",
      returnArrivalTime: "",
      distance: tripForm.distance,
      loadedDistance: tripForm.loadedDistance,
      emptyDistance: tripForm.emptyDistance,
      loadedTravelTime: 12,
      emptyTravelTime: 10,
      queueTime: 4,
      loadingTime: 6,
      dumpingTime: 3,
      cycleTime: 35,
      payload: tripForm.payload,
      fuelConsumed: tripForm.fuelConsumed,
      fuelEfficiency: Number((tripForm.fuelConsumed / tripForm.payload).toFixed(3)),
      roadCondition: tripForm.roadCondition,
      gpsSource: "FMS Telematics",
      sourceTimestamp: new Date().toISOString(),
      dataQualityStatus: "VALID",
    };

    await haulingRepository.createTrip(newTrip);
    setIsNewTripModalOpen(false);
    await loadData();
  };

  const handleCreateRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: Omit<HaulingRoute, "id" | "createdAt" | "updatedAt"> = {
      routeId: `R-${Date.now()}`,
      routeName: routeForm.routeName,
      origin: routeForm.origin,
      destination: routeForm.destination,
      routeType: routeForm.routeType,
      distanceKm: routeForm.distanceKm,
      loadedDistanceKm: routeForm.loadedDistanceKm,
      emptyDistanceKm: routeForm.emptyDistanceKm,
      roadName: routeForm.roadName,
      status: "ACTIVE",
      effectiveDate: new Date().toISOString().split("T")[0],
      currentVersion: 1,
      targetCycleTimeMin: 28,
      speedLimitKmh: routeForm.speedLimitKmh,
      gradientPercent: routeForm.gradientPercent,
      companyId: company.id,
      siteId: activeSite.id,
    };

    await haulingRepository.createRoute(newRoute);
    setIsNewRouteModalOpen(false);
    await loadData();
  };

  const handleCreateInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: Omit<RoadInspectionRecord, "id" | "createdAt" | "updatedAt"> = {
      inspectionId: `INSP-${Date.now()}`,
      roadId: inspectionForm.roadId,
      roadName: inspectionForm.roadName,
      date: new Date().toISOString().split("T")[0],
      inspector: inspectionForm.inspector,
      condition: inspectionForm.condition,
      findings: inspectionForm.findings,
      photoReferences: [],
      recommendation: inspectionForm.recommendation,
      priority: inspectionForm.priority,
      status: "SUBMITTED",
      companyId: company.id,
      siteId: activeSite.id,
    };

    await haulingRepository.createRoadInspection(newInspection);
    setIsInspectionModalOpen(false);
    await loadData();
  };

  const handleRunSimulation = async () => {
    const res = await haulingRepository.runScenarioSimulation({
      selectedRoutes: simSelectedRoutes,
      trucksAdjustment: simTruckAdj,
      roadConditionImprovement: simRoadImprove,
      queueReductionMin: simQueueReduction,
    });
    setScenarioResult(res);
  };

  const handleGenerateAIDailyReport = async () => {
    const rep = await haulingRepository.generateAIDailyReport(
      new Date().toISOString().split("T")[0],
      "Shift 1 (Day Shift)"
    );
    setAiDailyReport(rep);
  };

  const handleAskAI = () => {
    if (!aiPrompt.trim()) return;
    const q = aiPrompt.trim().toLowerCase();
    let a = "";

    if (q.includes("efisien") || q.includes("route")) {
      a = `Route R-PIT1-ROM1 (Pit 1 South → ROM 01) paling efisien dengan fuel/ton 0.081 L/Ton dan cycle time 34.2 min. Route Overland Jetty paling lambat karena jarak 24.5km.`;
    } else if (q.includes("cycle time") || q.includes("kenapa")) {
      a = `Kenaikan cycle time sebesar +8.5 min pada shift ini disebabkan oleh kondisi jalan berlubang di ROM 01 Access Ramp (Km 3.8) dan antrian 18 menit di Pit 2 North EX-202.`;
    } else if (q.includes("produktif") || q.includes("truck")) {
      a = `Truk paling produktif hari ini adalah DT-005 (84.0 Ton/Jam, 16 trip) disusul oleh DT-021 (67.3 Ton/Jam, 14 trip).`;
    } else if (q.includes("fuel") || q.includes("konsumsi")) {
      a = `Rata-rata konsumsi bahan bakar hauling adalah 0.098 L/Ton. Terdeteksi anomali konsumsi pada DT-028 (+24% vs baseline) pada rute Overland akibat waktu idle tinggi.`;
    } else {
      a = `Berdasarkan telemetry real-time Site ${activeSite.name}: 5 Active Routes, 18 Active Trucks, Rata-rata Travel Time ${avgTravelTimeMin} min, Cycle Time ${avgCycleTimeMin} min, Fuel Efficiency ${fuelEfficiencyLPerTon} L/Ton.`;
    }

    setAiAnswers((prev) => [{ q: aiPrompt, a, time: new Date().toLocaleTimeString("id-ID") }, ...prev]);
    setAiPrompt("");
  };

  const exportCSV = () => {
    const headers = ["Hauling ID", "Dispatch ID", "Truck", "Route", "Material", "Status", "Distance (km)", "Cycle Time (min)", "Payload (Ton)", "Fuel (L)", "Road Condition"];
    const rows = trips.map((t) => [
      t.haulingId,
      t.dispatchId,
      t.truckUnitCode,
      `"${t.routeName}"`,
      `"${t.materialType}"`,
      t.tripStatus,
      t.distance,
      t.cycleTime,
      t.payload,
      t.fuelConsumed,
      t.roadCondition,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Hauling_${activeSite.code}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sub-navigation Tabs
  const navTabs: { key: HaulingSubTab; label: string; icon: any; count?: number }[] = [
    { key: "overview", label: "Command Center", icon: Activity },
    { key: "live", label: "Live Map & Trips", icon: Compass },
    { key: "routes", label: "Routes & Versioning", icon: RouteIcon },
    { key: "map", label: "GIS Layers", icon: MapIcon },
    { key: "distance", label: "Distance", icon: Navigation },
    { key: "travel-time", label: "Travel Time", icon: Clock },
    { key: "cycle-time", label: "Cycle Time Engine", icon: RefreshCw },
    { key: "queue", label: "Queue Center", icon: Layers3 },
    { key: "truck-productivity", label: "Truck Productivity", icon: Truck },
    { key: "road-condition", label: "Road Condition", icon: Wrench, count: criticalRoadsCount },
    { key: "fuel-efficiency", label: "Fuel Efficiency", icon: Droplets },
    { key: "optimization", label: "Optimization & Simulator", icon: Zap },
    { key: "alerts", label: "Alerts & Deviation", icon: AlertTriangle, count: haulingDelaysCount },
    { key: "history", label: "History & DQ", icon: FileText },
    { key: "reports", label: "Laporan Hauling", icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-extrabold text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              PROMPT 15 — HAULING INTELLIGENCE CENTER
            </span>
            <span className="text-xs text-slate-400">
              Site: <strong className="text-slate-200">{activeSite.name}</strong> ({activeSite.code})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Hauling Management & AI Hauling Intelligence Center
          </h1>
          <p className="text-xs text-slate-400">
            Monitoring rute hauling, jarak, cycle time, travel time, antrian truk, kondisi jalan, fuel efficiency, dan simulasi optimasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 shadow-lg shadow-emerald-500/10 transition-all"
          >
            <Bot className="h-4 w-4 text-emerald-400" />
            <span>AI Hauling Assistant</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Export Data</span>
          </button>

          <button
            onClick={() => setIsNewTripModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Input Trip Hauling</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-slate-950 text-indigo-400" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW (HAULING COMMAND CENTER) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 13 Core KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Active Routes <RouteIcon className="h-3.5 w-3.5 text-indigo-400" />
              </span>
              <div className="text-lg font-black text-indigo-400">{activeRoutesCount} <span className="text-[10px] font-bold text-slate-400">Routes</span></div>
              <p className="text-[9px] text-slate-500">Master Route Active</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Active Trucks <Truck className="h-3.5 w-3.5 text-blue-400" />
              </span>
              <div className="text-lg font-black text-blue-400">{activeTrucksCount} <span className="text-[10px] font-bold text-slate-400">Units</span></div>
              <p className="text-[9px] text-slate-500">Operating Fleet</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Total Distance <Navigation className="h-3.5 w-3.5 text-teal-400" />
              </span>
              <div className="text-lg font-black text-teal-400">{totalDistanceKm.toFixed(1)} <span className="text-[10px] font-bold text-slate-400">km</span></div>
              <p className="text-[9px] text-slate-500">Shift Total Distance</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Avg Distance <Compass className="h-3.5 w-3.5 text-cyan-400" />
              </span>
              <div className="text-lg font-black text-cyan-400">{avgDistanceKm} <span className="text-[10px] font-bold text-slate-400">km/trip</span></div>
              <p className="text-[9px] text-slate-500">Loaded + Empty</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Avg Travel Time <Clock className="h-3.5 w-3.5 text-amber-400" />
              </span>
              <div className="text-lg font-black text-amber-400">{avgTravelTimeMin} <span className="text-[10px] font-bold text-slate-400">min</span></div>
              <p className="text-[9px] text-slate-500">Travel Only (No queue)</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Loaded Travel <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              </span>
              <div className="text-lg font-black text-emerald-400">{loadedTravelTimeMin} <span className="text-[10px] font-bold text-slate-400">min</span></div>
              <p className="text-[9px] text-slate-500">Destination Arrival</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Empty Return <RefreshCw className="h-3.5 w-3.5 text-purple-400" />
              </span>
              <div className="text-lg font-black text-purple-400">{emptyReturnTimeMin} <span className="text-[10px] font-bold text-slate-400">min</span></div>
              <p className="text-[9px] text-slate-500">Return Arrival</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Avg Cycle Time <Zap className="h-3.5 w-3.5 text-yellow-400" />
              </span>
              <div className="text-lg font-black text-yellow-400">{avgCycleTimeMin} <span className="text-[10px] font-bold text-slate-400">min</span></div>
              <p className="text-[9px] text-slate-500">Full Trip Cycle</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Avg Queue Time <Layers3 className="h-3.5 w-3.5 text-rose-400" />
              </span>
              <div className="text-lg font-black text-rose-400">{avgQueueTimeMin} <span className="text-[10px] font-bold text-slate-400">min</span></div>
              <p className="text-[9px] text-slate-500">Waiting At Loader/Dump</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Truck Productivity <BarChart3 className="h-3.5 w-3.5 text-teal-400" />
              </span>
              <div className="text-lg font-black text-teal-400">{truckProductivityTonHr} <span className="text-[10px] font-bold text-slate-400">Ton/Hr</span></div>
              <p className="text-[9px] text-slate-500">Fleet Average</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Fuel Efficiency <Droplets className="h-3.5 w-3.5 text-orange-400" />
              </span>
              <div className="text-lg font-black text-orange-400">{fuelEfficiencyLPerTon} <span className="text-[10px] font-bold text-slate-400">L/Ton</span></div>
              <p className="text-[9px] text-slate-500">Consumption Rate</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Road Critical <Wrench className="h-3.5 w-3.5 text-red-400" />
              </span>
              <div className="text-lg font-black text-red-400">{criticalRoadsCount} <span className="text-[10px] font-bold text-slate-400">Segments</span></div>
              <p className="text-[9px] text-slate-500">Needs Maintenance</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                Hauling Delays <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              </span>
              <div className="text-lg font-black text-amber-400">{haulingDelaysCount} <span className="text-[10px] font-bold text-slate-400">Alerts</span></div>
              <p className="text-[9px] text-slate-500">Unresolved Issues</p>
            </div>
          </div>

          {/* Live Hauling Map Preview & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Route Performance Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Route Cycle Time Performance</h3>
                  <p className="text-xs text-slate-400">Perbandingan Actual Cycle Time vs Target Per Rute</p>
                </div>
                <span className="rounded bg-indigo-500/20 px-2 py-1 text-[11px] font-bold text-indigo-400">5 Active Routes</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { route: "R-PIT1-ROM1", Actual: 35, Target: 28 },
                      { route: "R-PIT1-DISP1", Actual: 24, Target: 22 },
                      { route: "R-PIT2-ROM2", Actual: 36, Target: 32 },
                      { route: "R-ROM1-CRU1", Actual: 12, Target: 12 },
                      { route: "R-PORT-JETTY", Actual: 117, Target: 85 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="route" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                    <Legend />
                    <Bar dataKey="Actual" name="Actual Cycle (min)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Target" name="Target Cycle (min)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Truck Productivity Center */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Truck Productivity Ranking (Ton/Hour)</h3>
                  <p className="text-xs text-slate-400">Performansi unit Scania & Volvo dump truck</p>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-1 text-[11px] font-bold text-emerald-400">FMS Telematics</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={truckProductivity.map((tp) => ({
                      unit: tp.truckUnitCode,
                      productivity: tp.tonPerHour,
                      trips: tp.tripsCount,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="unit" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                    <Bar dataKey="productivity" name="Productivity (Ton/Hr)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Hauling Intelligence & Root Cause Panel */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Hauling Insight & Queue Root Cause Analysis</h3>
                  <p className="text-xs text-slate-400">Deteksi otomatis kemacetan rute, kelambatan perjalanan, dan rekomendasi optimasi</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                Confidence: HIGH (96.5%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">1. Problem Identified</span>
                <p className="text-xs font-bold text-rose-400">Queue Peak 18 Min @ Pit 2 North EX-202</p>
                <p className="text-[11px] text-slate-400">Penumpukan 6 truk akibat waktu pengerukan loader memanjang.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">2. Evidence & Telematics</span>
                <p className="text-xs font-bold text-amber-400">Pass Count: 5 Pass / Loader Cycle</p>
                <p className="text-[11px] text-slate-400">Bucket fill factor melambat akibat material keras di Bench RL+30.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">3. AI Recommendation</span>
                <p className="text-xs font-bold text-emerald-400">Rebalance 2 Units DT ke Pit 1 South</p>
                <p className="text-[11px] text-slate-400">Pengalihan 2 unit DT menurunkan waktu antrian Pit 2 hingga -65%.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">4. Expected Impact</span>
                <p className="text-xs font-bold text-purple-400">+480 Ton Output / Shift</p>
                <p className="text-[11px] text-slate-400">Cycle time total membaik dari 36.8 min menjadi 31.2 min.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LIVE MAP & ACTIVE TRIPS */}
      {activeTab === "live" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Live Hauling Map & Active Fleet Tracker</h3>
              <p className="text-xs text-slate-400">Monitoring posisi truk real-time, status perjalanan, & telemetry FMS</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">Data Freshness: 3 sec ago</span>
            </div>
          </div>

          {/* Interactive Map Visualizer Canvas */}
          <div className="relative h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Simulated Route GIS Overlay */}
            <div className="relative z-10 flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Pit 1 South RL+45</span>
              </div>
              <div className="flex-1 mx-4 border-t-2 border-dashed border-indigo-500/60 relative flex items-center justify-center">
                <span className="bg-slate-900 px-2 text-[10px] text-indigo-400 font-mono">Hauling Road Alpha (4.8 km)</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white">ROM Stockpile 01</span>
              </div>
            </div>

            {/* Truck Position Markers on Canvas */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
              {trips.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-400 text-xs">{t.truckUnitCode}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      t.tripStatus === "Loaded Hauling" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      t.tripStatus === "Queue" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {t.tripStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold truncate">{t.routeName}</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>Payload: <strong className="text-white">{t.payload} Ton</strong></div>
                    <div>Cycle: <strong className="text-amber-400">{t.cycleTime} min</strong></div>
                    <div>Queue: <strong className="text-rose-400">{t.queueTime} min</strong></div>
                    <div>Fuel: <strong className="text-teal-400">{t.fuelEfficiency} L/Ton</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span>GPS Telematics Source: FMS Gateway v4</span>
              <span>Status: <strong className="text-emerald-400">All Nodes Online</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROUTE MANAGEMENT & VERSIONING */}
      {activeTab === "routes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Route Management & Version Control</h3>
              <p className="text-xs text-slate-400">Kelola master rute hauling, jarak, batas kecepatan, & histori versi perubahan rute</p>
            </div>
            <button
              onClick={() => setIsNewRouteModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Rute Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Rute</th>
                  <th className="p-3">Nama Rute</th>
                  <th className="p-3">Asal → Tujuan</th>
                  <th className="p-3">Tipe Rute</th>
                  <th className="p-3">Total Jarak (km)</th>
                  <th className="p-3">Loaded / Empty</th>
                  <th className="p-3">Versi</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {routes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-400">{r.routeId}</td>
                    <td className="p-3 font-bold">{r.routeName}</td>
                    <td className="p-3">{r.origin} → {r.destination}</td>
                    <td className="p-3 font-semibold text-amber-400">{r.routeType}</td>
                    <td className="p-3 font-bold">{r.distanceKm} km</td>
                    <td className="p-3 text-slate-400">{r.loadedDistanceKm}km / {r.emptyDistanceKm}km</td>
                    <td className="p-3">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                        v{r.currentVersion}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Route Version History Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Histori Route Versioning (Audit Trail)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">ID Versi</th>
                    <th className="p-3">Rute</th>
                    <th className="p-3">Versi Ke-</th>
                    <th className="p-3">Jarak Baru</th>
                    <th className="p-3">Berlaku Sejak</th>
                    <th className="p-3">Alasan Perubahan</th>
                    <th className="p-3">Pembuat</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {versions.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-purple-400">{v.versionId}</td>
                      <td className="p-3 font-bold">{v.routeName}</td>
                      <td className="p-3 font-bold text-indigo-400">v{v.versionNumber}</td>
                      <td className="p-3 font-bold text-teal-400">{v.distanceKm} km</td>
                      <td className="p-3">{v.effectiveFrom}</td>
                      <td className="p-3 text-slate-300">{v.reasonForChange}</td>
                      <td className="p-3 text-slate-400">{v.createdBy}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                          v.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROAD CONDITION & INSPECTIONS */}
      {activeTab === "road-condition" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Road Condition Management & Inspection Center</h3>
              <p className="text-xs text-slate-400">Pemantauan permukaan jalan, lubang, ruts, drainase, & inspeksi civil engineering</p>
            </div>
            <button
              onClick={() => setIsInspectionModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-500"
            >
              <Plus className="h-4 w-4" />
              <span>Input Inspeksi Jalan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadConditions.map((rc) => (
              <div key={rc.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rc.roadName}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase ${
                    rc.condition === "Good" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    rc.condition === "Fair" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                    "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}>
                    {rc.condition}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rc.segment} • {rc.location}</p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between"><span>Panjang:</span> <strong className="text-white">{rc.lengthKm} km</strong></div>
                  <div className="flex justify-between"><span>Permukaan:</span> <strong className="text-slate-200">{rc.surfaceType}</strong></div>
                  <div className="flex justify-between"><span>Kedalaman Rutting:</span> <strong className="text-rose-400">{rc.parameters?.ruttingDepthCm} cm</strong></div>
                  <div className="flex justify-between"><span>Jumlah Pothole:</span> <strong className="text-amber-400">{rc.parameters?.potholesCount} titik</strong></div>
                </div>
              </div>
            ))}
          </div>

          {/* Road Inspection History Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Laporan Inspeksi Jalan Operasional</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">ID Inspeksi</th>
                    <th className="p-3">Segmen Jalan</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Inspektur</th>
                    <th className="p-3">Temuan (Findings)</th>
                    <th className="p-3">Rekomendasi Action</th>
                    <th className="p-3">Prioritas</th>
                    <th className="p-3">Status Work Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {roadInspections.map((ri) => (
                    <tr key={ri.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-amber-400">{ri.inspectionId}</td>
                      <td className="p-3 font-bold">{ri.roadName}</td>
                      <td className="p-3">{ri.date}</td>
                      <td className="p-3">{ri.inspector}</td>
                      <td className="p-3 text-slate-300">{ri.findings}</td>
                      <td className="p-3 text-emerald-400">{ri.recommendation}</td>
                      <td className="p-3">
                        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                          {ri.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                          {ri.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPTIMIZATION & SCENARIO SIMULATOR */}
      {activeTab === "optimization" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-indigo-300">Hauling Optimization & Scenario Simulator</h3>
                <p className="text-xs text-slate-400">Simulasi dampak penambahan truk, perbaikan jalan, dan pengurangan waktu antrian terhadap total tonase</p>
              </div>
              <button
                onClick={handleRunSimulation}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-indigo-500/20"
              >
                <Zap className="h-4 w-4" />
                <span>Jalankan Simulasi</span>
              </button>
            </div>

            {/* Simulator Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Penyesuaian Jumlah Truk ({simTruckAdj > 0 ? `+${simTruckAdj}` : simTruckAdj} Unit)</label>
                <input
                  type="range"
                  min={-5}
                  max={10}
                  value={simTruckAdj}
                  onChange={(e) => setSimTruckAdj(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Perbaikan Kondisi Jalan (Grading & Ballast)</label>
                <select
                  value={simRoadImprove ? "YES" : "NO"}
                  onChange={(e) => setSimRoadImprove(e.target.value === "YES")}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="YES">Aktifkan Perbaikan Jalan (-8% Cycle Time)</option>
                  <option value="NO">Kondisi Jalan Eksisting</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Pengurangan Antrian ({simQueueReduction} min)</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={simQueueReduction}
                  onChange={(e) => setSimQueueReduction(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Status Simulator</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold text-center">
                  Engine Ready
                </div>
              </div>
            </div>

            {/* Simulator Output Cards */}
            {scenarioResult && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-indigo-500/30">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-xs text-slate-400">Proyeksi Tonase Produksi</span>
                  <div className="text-2xl font-black text-emerald-400">{scenarioResult.expectedProductionTon.toLocaleString("id-ID")} MT</div>
                  <p className="text-[11px] text-slate-400">Ekspektasi Output / Shift</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-xs text-slate-400">Proyeksi Cycle Time Target</span>
                  <div className="text-2xl font-black text-amber-400">{scenarioResult.expectedCycleTimeMin} min</div>
                  <p className="text-[11px] text-slate-400">Efisiensi Cycle membaik</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-xs text-slate-400">Proyeksi Fuel Efficiency</span>
                  <div className="text-2xl font-black text-indigo-400">{scenarioResult.expectedFuelPerTon} L/Ton</div>
                  <p className="text-[11px] text-slate-400">Konsumsi BBM Proyeksi</p>
                </div>
              </div>
            )}
          </div>

          {/* Route Comparison Tool */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Komparasi Matriks Antar Rute Hauling</h3>
                <p className="text-xs text-slate-400">Bandingkan efisiensi jarak, travel time, fuel, dan produktivitas secara fair</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Pilih Rute A</label>
                <select
                  value={compareRouteA}
                  onChange={(e) => setCompareRouteA(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.routeId}>{r.routeName} ({r.distanceKm}km)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Pilih Rute B</label>
                <select
                  value={compareRouteB}
                  onChange={(e) => setCompareRouteB(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.routeId}>{r.routeName} ({r.distanceKm}km)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY & DATA QUALITY */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="w-full sm:w-auto">
              <h3 className="text-sm font-bold text-white">Histori Perjalanan Hauling & Data Quality Checks</h3>
              <p className="text-xs text-slate-400">Audit trail log perjalanan truk dan validasi integritas data telemetry</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari Truk / Rute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID Hauling</th>
                  <th className="p-3">Truk</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Rute</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Jarak (km)</th>
                  <th className="p-3">Cycle (min)</th>
                  <th className="p-3">Payload (Ton)</th>
                  <th className="p-3">Integritas Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-400">{t.haulingId}</td>
                    <td className="p-3 font-bold">{t.truckUnitCode}</td>
                    <td className="p-3">{t.operatorName}</td>
                    <td className="p-3">{t.routeName}</td>
                    <td className="p-3">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {t.tripStatus}
                      </span>
                    </td>
                    <td className="p-3">{t.distance} km</td>
                    <td className="p-3 font-bold text-amber-400">{t.cycleTime} min</td>
                    <td className="p-3 font-bold text-teal-400">{t.payload} Ton</td>
                    <td className="p-3">
                      <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/30">
                        {t.dataQualityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Laporan Operasional Hauling & AI Daily Report Generator</h3>
              <p className="text-xs text-slate-400">Generate laporan executive summary hauling harian dan ekspor dokumen formal</p>
            </div>
            <button
              onClick={handleGenerateAIDailyReport}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
            >
              <Bot className="h-4 w-4" />
              <span>Generate AI Daily Hauling Report</span>
            </button>
          </div>

          {aiDailyReport && (
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white">Laporan Harian Operasional Hauling</h3>
                  <p className="text-xs text-slate-400">Tanggal: {aiDailyReport.reportDate} • Shift: {aiDailyReport.shift}</p>
                </div>
                <span className="rounded bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  {aiDailyReport.dataQualityStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">1. Executive Summary</h4>
                <p>{aiDailyReport.executiveSummary}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Total Trips</span>
                  <div className="text-lg font-bold text-white">{aiDailyReport.tripsTotal} Trips</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Total Produksi</span>
                  <div className="text-lg font-bold text-emerald-400">{aiDailyReport.productionTon.toLocaleString("id-ID")} Ton</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Rata-rata Cycle Time</span>
                  <div className="text-lg font-bold text-amber-400">{aiDailyReport.avgCycleTimeMin} min</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Fuel Efficiency</span>
                  <div className="text-lg font-bold text-teal-400">{aiDailyReport.fuelEfficiencyLPerTon} L/Ton</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">2. Major Delays & Bottlenecks</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  {aiDailyReport.majorDelays.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">3. AI Insights & Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  {aiDailyReport.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: NEW TRIP */}
      {isNewTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Input Catatan Trip Hauling Baru</h3>
              <button onClick={() => setIsNewTripModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateTripSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Kode Truk</label>
                  <input
                    type="text"
                    value={tripForm.truckUnitCode}
                    onChange={(e) => setTripForm({ ...tripForm, truckUnitCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400">Operator</label>
                  <input
                    type="text"
                    value={tripForm.operatorName}
                    onChange={(e) => setTripForm({ ...tripForm, operatorName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Asal (Origin)</label>
                  <input
                    type="text"
                    value={tripForm.originName}
                    onChange={(e) => setTripForm({ ...tripForm, originName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400">Tujuan (Destination)</label>
                  <input
                    type="text"
                    value={tripForm.destinationName}
                    onChange={(e) => setTripForm({ ...tripForm, destinationName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400">Jarak Total (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tripForm.distance}
                    onChange={(e) => setTripForm({ ...tripForm, distance: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Payload (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tripForm.payload}
                    onChange={(e) => setTripForm({ ...tripForm, payload: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Fuel Consumed (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tripForm.fuelConsumed}
                    onChange={(e) => setTripForm({ ...tripForm, fuelConsumed: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewTripModalOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300">Batal</button>
                <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500">Simpan Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW ROUTE */}
      {isNewRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Buat Master Rute Hauling Baru</h3>
              <button onClick={() => setIsNewRouteModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateRouteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Nama Rute</label>
                <input
                  type="text"
                  placeholder="e.g. Pit 3 South → ROM Stockpile 03"
                  value={routeForm.routeName}
                  onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Asal</label>
                  <input
                    type="text"
                    value={routeForm.origin}
                    onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400">Tujuan</label>
                  <input
                    type="text"
                    value={routeForm.destination}
                    onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400">Jarak Total (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeForm.distanceKm}
                    onChange={(e) => setRouteForm({ ...routeForm, distanceKm: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Batas Kecepatan (km/h)</label>
                  <input
                    type="number"
                    value={routeForm.speedLimitKmh}
                    onChange={(e) => setRouteForm({ ...routeForm, speedLimitKmh: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Kelandaian (%)</label>
                  <input
                    type="number"
                    value={routeForm.gradientPercent}
                    onChange={(e) => setRouteForm({ ...routeForm, gradientPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewRouteModalOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300">Batal</button>
                <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500">Simpan Rute</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ROAD INSPECTION */}
      {isInspectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Input Inspeksi Kondisi Jalan</h3>
              <button onClick={() => setIsInspectionModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateInspectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Segmen Jalan</label>
                <select
                  value={inspectionForm.roadId}
                  onChange={(e) => {
                    const sel = roadConditions.find((r) => r.roadId === e.target.value);
                    setInspectionForm({
                      ...inspectionForm,
                      roadId: e.target.value,
                      roadName: sel ? sel.roadName : "Hauling Road",
                    });
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                >
                  {roadConditions.map((rc) => (
                    <option key={rc.id} value={rc.roadId}>{rc.roadName} ({rc.segment})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400">Temuan (Findings)</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi kerusakan jalan, lubang, rutting, atau masalah air..."
                  value={inspectionForm.findings}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, findings: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400">Rekomendasi Tindakan</label>
                <textarea
                  rows={2}
                  placeholder="Rekomendasi perbaikan (e.g. Grader GD-825 & Roller Compact)..."
                  value={inspectionForm.recommendation}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, recommendation: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsInspectionModalOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300">Batal</button>
                <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-500">Kirim Inspeksi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: AI ASSISTANT */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">AI Hauling Assistant & Optimizer</h3>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                Halo! Saya AI Hauling Assistant. Tanyakan informasi seputar efisiensi rute, antrian truk, kondisi jalan, atau konsumsi bahan bakar hauling.
              </div>

              {aiAnswers.map((item, index) => (
                <div key={index} className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold self-end">Q: {item.q}</div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1">AI Answer ({item.time}):</span>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Tanyakan sesuatu seputar hauling..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleAskAI}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
