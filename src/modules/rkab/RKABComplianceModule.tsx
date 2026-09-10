// MINE SMART AI - Central RKAB & Compliance Management Module
// Sistem Internal Pendukung Compliance RKAB Ditjen Minerba ESDM & Integrasi MinerbaOne

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Flame,
  Layers,
  Coins,
  Trees,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Building2,
  Calendar,
  Sparkles,
  Download,
  Info,
} from "lucide-react";
import {
  RKABPeriod,
  ProductionTargetItem,
  WorkPlanMatrixItem,
  InvestmentBudgetItem,
  ReclamationComplianceItem,
  ManpowerComplianceItem,
  MandatoryCertificationPersonnel,
  MiningSafetyKOAuditMetric,
  MinerbaOneBridgePayload,
} from "../../types/rkabTypes";
import { RKABRepository } from "../../services/repositories/RKABRepository";
import { RKABExecutiveSummaryTab } from "./components/RKABExecutiveSummaryTab";
import { ProductionTargetsTab } from "./components/ProductionTargetsTab";
import { WorkPlanMatrixTab } from "./components/WorkPlanMatrixTab";
import { InvestmentBudgetTab } from "./components/InvestmentBudgetTab";
import { ReclamationComplianceTab } from "./components/ReclamationComplianceTab";
import { ManpowerCertificationTab } from "./components/ManpowerCertificationTab";
import { MiningSafetyKOTab } from "./components/MiningSafetyKOTab";
import { MinerbaOneReportingBridgeTab } from "./components/MinerbaOneReportingBridgeTab";
import { AddWorkPlanModal } from "./components/AddWorkPlanModal";

export const RKABComplianceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [period, setPeriod] = useState<RKABPeriod>("2026");

  // Data states
  const [productionData, setProductionData] = useState<ProductionTargetItem[]>([]);
  const [workPlans, setWorkPlans] = useState<WorkPlanMatrixItem[]>([]);
  const [investmentBudgets, setInvestmentBudgets] = useState<InvestmentBudgetItem[]>([]);
  const [reclamationData, setReclamationData] = useState<ReclamationComplianceItem[]>([]);
  const [manpowerData, setManpowerData] = useState<ManpowerComplianceItem[]>([]);
  const [certifiedPersonnel, setCertifiedPersonnel] = useState<MandatoryCertificationPersonnel[]>([]);
  const [safetyMetrics, setSafetyMetrics] = useState<MiningSafetyKOAuditMetric[]>([]);
  const [minerbaPayload, setMinerbaPayload] = useState<MinerbaOneBridgePayload | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAllData = async () => {
    const [prod, wp, inv, rec, mp, cert, safe, payload] = await Promise.all([
      RKABRepository.getProductionData(),
      RKABRepository.getWorkPlans(),
      RKABRepository.getInvestmentBudgets(),
      RKABRepository.getReclamationData(),
      RKABRepository.getManpowerData(),
      RKABRepository.getCertifiedPersonnel(),
      RKABRepository.getSafetyMetrics(),
      RKABRepository.generateMinerbaOnePayload(),
    ]);

    setProductionData(prod);
    setWorkPlans(wp);
    setInvestmentBudgets(inv);
    setReclamationData(rec);
    setManpowerData(mp);
    setCertifiedPersonnel(cert);
    setSafetyMetrics(safe);
    setMinerbaPayload(payload);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAddWorkPlan = async (item: Omit<WorkPlanMatrixItem, "id">) => {
    const created = await RKABRepository.addWorkPlan(item);
    setToastMessage(`Program kerja berhasil didaftarkan: ${created.matrixCode} (${created.activityName})`);
    setTimeout(() => setToastMessage(null), 4000);
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-[#070E20] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Executive Compliance Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                RKAB & Mining Compliance Management
              </h1>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-black rounded-lg border border-amber-500/30">
                TAHUN BERJALAN {period}
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-black rounded-lg border border-blue-500/30">
                MINERBAONE COMPATIBLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sistem Internal Pendukung Kepatuhan: Target Produksi, Rencana Kerja, Investasi, Operasional, Reklamasi, Tenaga Kerja, K3 & Pelaporan
            </p>
          </div>
        </div>

        {/* Period Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as RKABPeriod)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-slate-900">Tahun RKAB 2026 (Aktif)</option>
              <option value="2025" className="bg-slate-900">Tahun RKAB 2025 (Arsip)</option>
              <option value="2027 (Draft)" className="bg-slate-900">Tahun RKAB 2027 (Penyusunan)</option>
            </select>
          </div>

          <button
            onClick={() => setActiveTab("minerbaone")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>MinerbaOne Bridge</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs - 8 Aspek Kepatuhan */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto scrollbar-none pb-1">
        {[
          { key: "summary", label: "Ringkasan Eksekutif", icon: ShieldCheck },
          { key: "production", label: "1. Target Produksi & DMO", icon: Flame },
          { key: "workplan", label: "2. Rencana Kerja (Matriks)", icon: Layers, count: workPlans.length },
          { key: "budget", label: "3. Rencana Investasi & Biaya", icon: Coins },
          { key: "reclamation", label: "4. Reklamasi & Lingkungan", icon: Trees },
          { key: "manpower", label: "5. Tenaga Kerja & Sertifikasi", icon: Users, count: certifiedPersonnel.length },
          { key: "safety", label: "6. Keselamatan K3 & SMKP", icon: ShieldCheck },
          { key: "minerbaone", label: "7. Pelaporan & MinerbaOne", icon: FileCheck2, badge: "Bridge" },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-3.5 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "summary" && (
        <RKABExecutiveSummaryTab
          payload={minerbaPayload}
          onNavigateTab={(targetTab) => setActiveTab(targetTab)}
        />
      )}

      {activeTab === "production" && (
        <ProductionTargetsTab
          productionData={productionData}
        />
      )}

      {activeTab === "workplan" && (
        <WorkPlanMatrixTab
          workPlans={workPlans}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {activeTab === "budget" && (
        <InvestmentBudgetTab
          investmentBudgets={investmentBudgets}
        />
      )}

      {activeTab === "reclamation" && (
        <ReclamationComplianceTab
          reclamationData={reclamationData}
        />
      )}

      {activeTab === "manpower" && (
        <ManpowerCertificationTab
          manpowerData={manpowerData}
          certifiedPersonnel={certifiedPersonnel}
        />
      )}

      {activeTab === "safety" && (
        <MiningSafetyKOTab
          safetyMetrics={safetyMetrics}
        />
      )}

      {activeTab === "minerbaone" && (
        <MinerbaOneReportingBridgeTab
          payload={minerbaPayload}
          onRefresh={loadAllData}
        />
      )}

      {/* Add Work Plan Modal */}
      <AddWorkPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWorkPlan}
      />
    </div>
  );
};
