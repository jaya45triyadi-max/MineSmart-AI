// MINE SMART AI - Comprehensive Finance & Accounting Management Module
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  FolderTree,
  FileText,
  Calculator,
  PieChart,
  Building2,
  ShieldCheck,
  Sparkles,
  Settings as SettingsIcon,
  Layers,
  ArrowRight,
  Pickaxe,
  Clock,
  Shield,
  Plus,
} from "lucide-react";
import { financeRepository } from "../../services/repositories/FinanceRepository";
import {
  ChartOfAccount,
  CostCenter,
  JournalEntry,
  RevenueRecord,
  AccountsReceivable,
  AccountsPayable,
  OpexRecord,
  CapexRequest,
  FixedAsset,
  BudgetRecord,
  CashFlowRecord,
  MiningCostModel,
  EquipmentCostDetail,
  FinancialPeriod,
  FinanceKPISummary,
  AIFinanceInsight,
  FinanceTaxCode,
  CurrencyRate,
} from "../../types/financeTypes";

import { FinanceCommandCenterTab } from "./components/FinanceCommandCenterTab";
import { ChartOfAccountsTab } from "./components/ChartOfAccountsTab";
import { RevenueManagementTab } from "./components/RevenueManagementTab";
import { ReceivablesARTab } from "./components/ReceivablesARTab";
import { PayablesAPTab } from "./components/PayablesAPTab";
import { OpexManagementTab } from "./components/OpexManagementTab";
import { CapexAssetDepreciationTab } from "./components/CapexAssetDepreciationTab";
import { BudgetManagementTab } from "./components/BudgetManagementTab";
import { CashFlowTab } from "./components/CashFlowTab";
import { ProfitAndLossTab } from "./components/ProfitAndLossTab";
import { MiningCostAnalyticsTab } from "./components/MiningCostAnalyticsTab";
import { FinanceJournalTransactionsTab } from "./components/FinanceJournalTransactionsTab";
import { AIFinanceAssistantTab } from "./components/AIFinanceAssistantTab";
import { FinanceReportsTab } from "./components/FinanceReportsTab";
import { FinanceSettingsTab } from "./components/FinanceSettingsTab";

interface FinanceModuleProps {
  currentSubRoute?: string;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ currentSubRoute = "dashboard" }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State loaded from FinanceRepository
  const [kpi, setKpi] = useState<FinanceKPISummary | null>(null);
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [revenues, setRevenues] = useState<RevenueRecord[]>([]);
  const [arList, setArList] = useState<AccountsReceivable[]>([]);
  const [apList, setApList] = useState<AccountsPayable[]>([]);
  const [opexList, setOpexList] = useState<OpexRecord[]>([]);
  const [capexRequests, setCapexRequests] = useState<CapexRequest[]>([]);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>([]);
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const [cashFlows, setCashFlows] = useState<CashFlowRecord[]>([]);
  const [miningCosts, setMiningCosts] = useState<MiningCostModel[]>([]);
  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCostDetail[]>([]);
  const [periods, setPeriods] = useState<FinancialPeriod[]>([]);
  const [insights, setInsights] = useState<AIFinanceInsight[]>([]);
  const [taxCodes, setTaxCodes] = useState<FinanceTaxCode[]>([]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync sub-route with active tab
  useEffect(() => {
    if (currentSubRoute) {
      const cleanRoute = currentSubRoute.replace("/finance/", "").replace("/finance", "").replace("/", "");
      const routeMap: Record<string, string> = {
        "": "dashboard",
        dashboard: "dashboard",
        accounts: "accounts",
        revenue: "revenue",
        cost: "opex",
        opex: "opex",
        capex: "capex",
        budget: "budget",
        actual: "budget",
        "cash-flow": "cash-flow",
        "profit-loss": "profit-loss",
        "cost-center": "accounts",
        "cost-per-ton": "cost-per-ton",
        "cost-per-bcm": "cost-per-ton",
        transactions: "transactions",
        invoices: "revenue",
        payables: "payables",
        receivables: "receivables",
        assets: "capex",
        depreciation: "capex",
        forecast: "ai-insight",
        variance: "budget",
        reports: "reports",
        "ai-insight": "ai-insight",
        settings: "settings",
      };
      if (routeMap[cleanRoute]) {
        setActiveTab(routeMap[cleanRoute]);
      }
    }
  }, [currentSubRoute]);

  // Load repository data
  const loadData = async () => {
    const summary = await financeRepository.getKPISummary();
    setKpi(summary);
    setAccounts(await financeRepository.getChartOfAccounts());
    setCostCenters(await financeRepository.getCostCenters());
    setJournals(await financeRepository.getJournals());
    setRevenues(await financeRepository.getRevenueRecords());
    setArList(await financeRepository.getAccountsReceivable());
    setApList(await financeRepository.getAccountsPayable());
    setOpexList(await financeRepository.getOpexRecords());
    setCapexRequests(await financeRepository.getCapexRequests());
    setFixedAssets(await financeRepository.getFixedAssets());
    setBudgets(await financeRepository.getBudgets());
    setCashFlows(await financeRepository.getCashFlowRecords());
    setMiningCosts(await financeRepository.getMiningCostModels());
    setEquipmentCosts(await financeRepository.getEquipmentCosts());
    setPeriods(await financeRepository.getFinancialPeriods());
    setInsights(await financeRepository.getAIInsights());
    setTaxCodes(await financeRepository.getTaxCodes());
    setCurrencyRates(await financeRepository.getCurrencyRates());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler functions for mutation & persistence
  const handleSaveAccount = async (account: ChartOfAccount) => {
    await financeRepository.saveAccount(account);
    await loadData();
    showToast(`Akun ${account.accountCode} - ${account.accountName} berhasil diperbarui.`);
  };

  const handleSaveRevenue = async (rev: RevenueRecord) => {
    await financeRepository.saveRevenueRecord(rev);
    await loadData();
    showToast(`Pengakuan Revenue ${rev.revenueNumber} berhasil dicatat!`);
  };

  const handleSaveAR = async (ar: AccountsReceivable) => {
    await financeRepository.saveAR(ar);
    await loadData();
    showToast(`Pembayaran AR ${ar.invoiceNumber} berhasil diperbarui.`);
  };

  const handleSaveAP = async (ap: AccountsPayable) => {
    await financeRepository.saveAP(ap);
    await loadData();
    showToast(`Pembayaran AP ${ap.poNumber} vendor ${ap.vendorName} berhasil diproses.`);
  };

  const handleSaveOpex = async (opex: OpexRecord) => {
    await financeRepository.saveOpexRecord(opex);
    await loadData();
    showToast(`Beban OPEX ${opex.category} sebesar Rp ${opex.amountIDR.toLocaleString("id-ID")} berhasil dicatat.`);
  };

  const handleSaveCapex = async (capex: CapexRequest) => {
    await financeRepository.saveCapexRequest(capex);
    await loadData();
    showToast(`Proposal CAPEX ${capex.capexNumber} berhasil diajukan.`);
  };

  const handleSaveFixedAsset = async (asset: FixedAsset) => {
    await financeRepository.saveFixedAsset(asset);
    await loadData();
    showToast(`Fixed Asset ${asset.assetCode} berhasil didaftarkan.`);
  };

  const handleSaveBudget = async (budget: BudgetRecord) => {
    await financeRepository.saveBudget(budget);
    await loadData();
    showToast(`Budget ${budget.costCenterName} berhasil dialokasikan.`);
  };

  const handleCreateJournal = async (journal: Omit<JournalEntry, "id" | "isBalanced" | "createdAt" | "updatedAt">) => {
    await financeRepository.createJournal(journal);
    await loadData();
    showToast(`Jurnal Double-Entry ${journal.journalNumber} berhasil diposting!`);
  };

  // Nav Tabs Config
  const navTabs = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3 },
    { key: "accounts", label: "Chart of Accounts", icon: FolderTree },
    { key: "revenue", label: "Revenue & Sales", icon: TrendingUp },
    { key: "receivables", label: "Receivables (AR)", icon: Wallet },
    { key: "payables", label: "Payables (AP)", icon: ShieldCheck },
    { key: "opex", label: "OPEX Ledger", icon: TrendingDown },
    { key: "capex", label: "CAPEX & Assets", icon: Building2 },
    { key: "budget", label: "Budget & Variance", icon: PieChart },
    { key: "cash-flow", label: "Cash Flow", icon: DollarSign },
    { key: "profit-loss", label: "Profit & Loss", icon: FileText },
    { key: "cost-per-ton", label: "Mining Cost Analytics", icon: Pickaxe },
    { key: "transactions", label: "Journal Entries", icon: Layers },
    { key: "ai-insight", label: "AI Advisor", icon: Sparkles },
    { key: "reports", label: "Reports Export", icon: FileText },
    { key: "settings", label: "Settings & Period Lock", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500/90 text-slate-950 font-black text-xs px-4 py-3 rounded-xl border border-emerald-400 shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PROMPT 31 • FINANCE & ACCOUNTING ERP
            </span>
            <span className="text-xs font-mono text-slate-400">• Double-Entry Accounting Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Finance, Cost Control & Mining Cost Analytics Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-slate-300">
            Base Currency: <span className="text-emerald-400">IDR (Rp)</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-amber-400">
            Fiscal Period: <span className="text-amber-400">2026-08 (OPEN)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render Views */}
      {kpi && (
        <div className="transition-all duration-300">
          {activeTab === "dashboard" && (
            <FinanceCommandCenterTab
              kpi={kpi}
              insights={insights}
              recentRevenues={revenues}
              recentOpex={opexList}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "accounts" && (
            <ChartOfAccountsTab accounts={accounts} onSaveAccount={handleSaveAccount} />
          )}

          {activeTab === "revenue" && (
            <RevenueManagementTab revenues={revenues} onSaveRevenue={handleSaveRevenue} />
          )}

          {activeTab === "receivables" && (
            <ReceivablesARTab arList={arList} onSaveAR={handleSaveAR} />
          )}

          {activeTab === "payables" && (
            <PayablesAPTab apList={apList} onSaveAP={handleSaveAP} />
          )}

          {activeTab === "opex" && (
            <OpexManagementTab
              opexList={opexList}
              costCenters={costCenters}
              accounts={accounts}
              onSaveOpex={handleSaveOpex}
            />
          )}

          {activeTab === "capex" && (
            <CapexAssetDepreciationTab
              capexRequests={capexRequests}
              fixedAssets={fixedAssets}
              onSaveCapex={handleSaveCapex}
              onSaveAsset={handleSaveFixedAsset}
            />
          )}

          {activeTab === "budget" && (
            <BudgetManagementTab
              budgets={budgets}
              costCenters={costCenters}
              accounts={accounts}
              onSaveBudget={handleSaveBudget}
            />
          )}

          {activeTab === "cash-flow" && <CashFlowTab cashFlows={cashFlows} />}

          {activeTab === "profit-loss" && <ProfitAndLossTab kpi={kpi} />}

          {activeTab === "cost-per-ton" && (
            <MiningCostAnalyticsTab kpi={kpi} miningCosts={miningCosts} equipmentCosts={equipmentCosts} />
          )}

          {activeTab === "transactions" && (
            <FinanceJournalTransactionsTab
              journals={journals}
              accounts={accounts}
              costCenters={costCenters}
              periods={periods}
              onCreateJournal={handleCreateJournal}
            />
          )}

          {activeTab === "ai-insight" && <AIFinanceAssistantTab insights={insights} kpi={kpi} />}

          {activeTab === "reports" && <FinanceReportsTab kpi={kpi} />}

          {activeTab === "settings" && (
            <FinanceSettingsTab
              taxCodes={taxCodes}
              currencyRates={currencyRates}
              periods={periods}
              costCenters={costCenters}
            />
          )}
        </div>
      )}
    </div>
  );
};
