// MINE SMART AI - Unified Fuel Management & AI Fuel Intelligence Center

import React, { useState, useEffect } from "react";
import {
  Fuel,
  LayoutDashboard,
  Layers,
  Droplets,
  Send,
  Gauge,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  FileText,
  Database,
  Sparkles,
  RefreshCw,
  Building2,
  ShieldAlert,
  Clock,
  Award
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { fuelRepository } from "../../services/repositories";

// Sub-components
import { FuelCommandCenter } from "./FuelCommandCenter";
import { FuelStockView } from "./FuelStockView";
import { FuelReceivingView } from "./FuelReceivingView";
import { FuelDispensingView } from "./FuelDispensingView";
import { FuelConsumptionEfficiencyView } from "./FuelConsumptionEfficiencyView";
import { FuelReconciliationView } from "./FuelReconciliationView";
import { FuelAnomalyLossView } from "./FuelAnomalyLossView";
import { FuelForecastAlertsReportsView } from "./FuelForecastAlertsReportsView";
import { FuelMasterDataView } from "./FuelMasterDataView";
import { AIFuelAssistantModal } from "./AIFuelAssistantModal";
import { AIFuelDetectionHub } from "./AIFuelDetectionHub";

// Types
import {
  FuelTank,
  FuelStation,
  FuelReceiving,
  FuelDispensing,
  FuelConsumptionRecord,
  FuelReconciliation,
  FuelMeter,
  MeterCalibration,
  FuelAnomaly,
  FuelLossAlert,
  FuelInvestigation,
  FuelForecast,
  FuelStockAlertItem,
  FuelProduct,
  FuelSupplier,
  FuelTransfer,
  FuelAdjustment,
  FuelIdleRecord,
  FuelEfficiencyRanking,
  FuelSiphoningAlert,
  FuelReceivingStatus,
  FuelDispensingStatus,
  InvestigationStatus
} from "../../types/fuelTypes";

interface FuelModuleProps {
  onOpenAICopilot: () => void;
}

export const FuelModule: React.FC<FuelModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, company } = useAuth();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "ai-detection"
    | "stock"
    | "receiving"
    | "dispensing"
    | "consumption"
    | "reconciliation"
    | "anomalies"
    | "forecast"
    | "master-data"
  >("overview");

  // AI Assistant Modal State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Repository Data States
  const [tanks, setTanks] = useState<FuelTank[]>([]);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [receivings, setReceivings] = useState<FuelReceiving[]>([]);
  const [dispensings, setDispensings] = useState<FuelDispensing[]>([]);
  const [consumptions, setConsumptions] = useState<FuelConsumptionRecord[]>([]);
  const [reconciliations, setReconciliations] = useState<FuelReconciliation[]>([]);
  const [meters, setMeters] = useState<FuelMeter[]>([]);
  const [calibrations, setCalibrations] = useState<MeterCalibration[]>([]);
  const [anomalies, setAnomalies] = useState<FuelAnomaly[]>([]);
  const [lossAlerts, setLossAlerts] = useState<FuelLossAlert[]>([]);
  const [investigations, setInvestigations] = useState<FuelInvestigation[]>([]);
  const [forecasts, setForecasts] = useState<FuelForecast[]>([]);
  const [stockAlerts, setStockAlerts] = useState<FuelStockAlertItem[]>([]);
  const [products, setProducts] = useState<FuelProduct[]>([]);
  const [suppliers, setSuppliers] = useState<FuelSupplier[]>([]);
  const [transfers, setTransfers] = useState<FuelTransfer[]>([]);
  const [adjustments, setAdjustments] = useState<FuelAdjustment[]>([]);
  const [idleRecords, setIdleRecords] = useState<FuelIdleRecord[]>([]);
  const [efficiencyRankings, setEfficiencyRankings] = useState<FuelEfficiencyRanking[]>([]);
  const [siphoningAlerts, setSiphoningAlerts] = useState<FuelSiphoningAlert[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const t = await fuelRepository.getTanks();
      const s = await fuelRepository.getStations();
      const r = await fuelRepository.getReceivings();
      const d = await fuelRepository.getDispensings();
      const c = await fuelRepository.getConsumptions();
      const rec = await fuelRepository.getReconciliations();
      const m = await fuelRepository.getMeters();
      const cal = await fuelRepository.getCalibrations();
      const an = await fuelRepository.getAnomalies();
      const la = await fuelRepository.getLossAlerts();
      const inv = await fuelRepository.getInvestigations();
      const fc = await fuelRepository.getForecasts();
      const sa = await fuelRepository.getStockAlerts();
      const p = await fuelRepository.getProducts();
      const sup = await fuelRepository.getSuppliers();
      const trf = await fuelRepository.getTransfers();
      const adj = await fuelRepository.getAdjustments();
      const idle = await fuelRepository.getIdleRecords();
      const eff = await fuelRepository.getEfficiencyRankings();
      const siph = await fuelRepository.getSiphoningAlerts();

      setTanks(t);
      setStations(s);
      setReceivings(r);
      setDispensings(d);
      setConsumptions(c);
      setReconciliations(rec);
      setMeters(m);
      setCalibrations(cal);
      setAnomalies(an);
      setLossAlerts(la);
      setInvestigations(inv);
      setForecasts(fc);
      setStockAlerts(sa);
      setProducts(p);
      setSuppliers(sup);
      setTransfers(trf);
      setAdjustments(adj);
      setIdleRecords(idle);
      setEfficiencyRankings(eff);
      setSiphoningAlerts(siph);
    } catch (err) {
      console.error("Failed loading fuel data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [activeSite.id, company.id]);

  // Handler functions for adding/updating entities via Repository
  const handleAddTransfer = async (transfer: FuelTransfer) => {
    await fuelRepository.createTransfer(transfer);
    await loadAllData();
  };

  const handleAddAdjustment = async (adj: FuelAdjustment) => {
    await fuelRepository.createAdjustment(adj);
    await loadAllData();
  };

  const handleAddReceiving = async (rcv: FuelReceiving) => {
    await fuelRepository.createReceiving(rcv);
    await loadAllData();
  };

  const handleUpdateReceivingStatus = async (id: string, status: FuelReceivingStatus) => {
    await fuelRepository.updateReceivingStatus(id, status);
    await loadAllData();
  };

  const handleAddDispensing = async (dsp: FuelDispensing) => {
    await fuelRepository.createDispensing(dsp);
    await loadAllData();
  };

  const handleUpdateDispensingStatus = async (id: string, status: FuelDispensingStatus) => {
    await fuelRepository.updateDispensingStatus(id, status);
    await loadAllData();
  };

  const handleAddCalibration = async (cal: MeterCalibration) => {
    await fuelRepository.createCalibration(cal);
    await loadAllData();
  };

  const handleAddReconciliation = async (rec: FuelReconciliation) => {
    await fuelRepository.createReconciliation(rec);
    await loadAllData();
  };

  const handleUpdateAnomalyStatus = async (id: string, status: any) => {
    await fuelRepository.updateAnomalyStatus(id, status);
    await loadAllData();
  };

  const handleUpdateIdleStatus = async (id: string, status: any) => {
    await fuelRepository.updateIdleRecordStatus(id, status);
    await loadAllData();
  };

  const handleUpdateSiphoningStatus = async (id: string, status: any, notes?: string) => {
    await fuelRepository.updateSiphoningAlertStatus(id, status, notes);
    await loadAllData();
  };

  const handleAddInvestigation = async (inv: FuelInvestigation) => {
    await fuelRepository.createInvestigation(inv);
    await loadAllData();
  };

  const handleUpdateInvestigationStatus = async (id: string, status: InvestigationStatus, resolution?: string) => {
    await fuelRepository.updateInvestigationStatus(id, status, resolution);
    await loadAllData();
  };

  const handleAddTank = async (tank: FuelTank) => {
    await fuelRepository.createTank(tank);
    await loadAllData();
  };

  const handleAddStation = async (station: FuelStation) => {
    await fuelRepository.createStation(station);
    await loadAllData();
  };

  const totalAIDetectionAlerts =
    anomalies.length +
    idleRecords.filter(i => i.status !== "Resolved").length +
    siphoningAlerts.filter(s => s.status !== "Resolved").length +
    efficiencyRankings.filter(e => e.efficiencyStatus.includes("Inefficient")).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              ENTERPRISE FUEL MANAGEMENT & AI DETECTION
            </span>
            <span className="text-xs text-slate-400 font-medium">{activeSite.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <Fuel className="w-6 h-6 text-amber-400" />
            Fuel Management & AI Fuel Intelligence Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pusat pemantauan Fuel Received, Fuel Issued, Fuel Consumption, Fuel Stock, Fuel/km, Fuel/hour, Fuel/ton, serta AI Detection (Konsumsi abnormal, Idle berlebihan, Potensi fuel loss, Unit tidak efisien)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-amber-400" />
            <span>Sync Live Data</span>
          </button>

          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Fuel Assistant</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Overview Command Center
        </button>

        {/* Dedicated AI Fuel Detection Hub Tab */}
        <button
          onClick={() => setActiveTab("ai-detection")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "ai-detection"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
              : "text-amber-400 bg-amber-950/30 border border-amber-500/30 hover:bg-amber-900/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Fuel Detection</span>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black">
            {totalAIDetectionAlerts}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "stock"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          Fuel Stock & Ledger
        </button>

        <button
          onClick={() => setActiveTab("receiving")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "receiving"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Droplets className="w-4 h-4" />
          Fuel Received (DO)
        </button>

        <button
          onClick={() => setActiveTab("dispensing")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "dispensing"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Fuel className="w-4 h-4" />
          Fuel Issued (Dispensing)
        </button>

        <button
          onClick={() => setActiveTab("consumption")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "consumption"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Gauge className="w-4 h-4" />
          Fuel Consumption (L/km, L/h, L/ton)
        </button>

        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "reconciliation"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Reconciliation
        </button>

        <button
          onClick={() => setActiveTab("anomalies")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "anomalies"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Anomalies & Loss ({anomalies.length})
        </button>

        <button
          onClick={() => setActiveTab("forecast")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "forecast"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          AI Forecast & Reports
        </button>

        <button
          onClick={() => setActiveTab("master-data")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "master-data"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          Master Data
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "overview" && (
        <FuelCommandCenter
          tanks={tanks}
          receivings={receivings}
          dispensings={dispensings}
          anomalies={anomalies}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />
      )}

      {/* AI Fuel Detection Hub */}
      {activeTab === "ai-detection" && (
        <AIFuelDetectionHub
          anomalies={anomalies}
          idleRecords={idleRecords}
          efficiencyRankings={efficiencyRankings}
          siphoningAlerts={siphoningAlerts}
          lossAlerts={lossAlerts}
          investigations={investigations}
          onUpdateAnomalyStatus={handleUpdateAnomalyStatus}
          onUpdateIdleStatus={handleUpdateIdleStatus}
          onUpdateSiphoningStatus={handleUpdateSiphoningStatus}
          onStartInvestigation={alert => {
            setActiveTab("anomalies");
          }}
          onOpenAICopilot={onOpenAICopilot}
        />
      )}

      {activeTab === "stock" && (
        <FuelStockView
          tanks={tanks}
          stations={stations}
          adjustments={adjustments}
          transfers={transfers}
          onAddTransfer={handleAddTransfer}
          onAddAdjustment={handleAddAdjustment}
        />
      )}

      {activeTab === "receiving" && (
        <FuelReceivingView
          receivings={receivings}
          suppliers={suppliers}
          products={products}
          tanks={tanks}
          onAddReceiving={handleAddReceiving}
          onUpdateStatus={handleUpdateReceivingStatus}
        />
      )}

      {activeTab === "dispensing" && (
        <FuelDispensingView
          dispensings={dispensings}
          stations={stations}
          tanks={tanks}
          products={products}
          onAddDispensing={handleAddDispensing}
          onUpdateStatus={handleUpdateDispensingStatus}
        />
      )}

      {activeTab === "consumption" && (
        <FuelConsumptionEfficiencyView records={consumptions} />
      )}

      {activeTab === "reconciliation" && (
        <FuelReconciliationView
          reconciliations={reconciliations}
          meters={meters}
          calibrations={calibrations}
          onAddCalibration={handleAddCalibration}
          onAddReconciliation={handleAddReconciliation}
        />
      )}

      {activeTab === "anomalies" && (
        <FuelAnomalyLossView
          anomalies={anomalies}
          lossAlerts={lossAlerts}
          investigations={investigations}
          onUpdateAnomalyStatus={handleUpdateAnomalyStatus}
          onUpdateInvestigationStatus={handleUpdateInvestigationStatus}
          onAddInvestigation={handleAddInvestigation}
        />
      )}

      {activeTab === "forecast" && (
        <FuelForecastAlertsReportsView
          forecasts={forecasts}
          stockAlerts={stockAlerts}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />
      )}

      {activeTab === "master-data" && (
        <FuelMasterDataView
          products={products}
          tanks={tanks}
          stations={stations}
          suppliers={suppliers}
          onAddTank={handleAddTank}
          onAddStation={handleAddStation}
        />
      )}

      {/* AI Assistant Modal */}
      <AIFuelAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};
