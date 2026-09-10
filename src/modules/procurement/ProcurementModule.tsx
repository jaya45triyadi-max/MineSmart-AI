// MINE SMART AI - Integrated Procurement Module
import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  FileText,
  Send,
  PackageCheck,
  Building2,
  DollarSign,
  Truck,
  ShieldCheck,
  Sparkles,
  BarChart3,
  CheckSquare,
  Award,
  RefreshCw,
  Boxes,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "../../components/ui/ToastProvider";
import { procurementRepository } from "../../services/repositories/ProcurementRepository";
import {
  PurchaseRequest,
  RFQ,
  Vendor,
  Quotation,
  PurchaseOrder,
  GoodsReceipt,
  QualityInspection,
  Invoice,
  ProcurementContract,
  CatalogItem,
  ProcurementKPISummary,
  ProcurementAIInsight,
} from "../../types/procurementTypes";

// Component imports
import { ProcurementCommandCenterTab } from "./components/ProcurementCommandCenterTab";
import { PurchaseRequestsTab } from "./components/PurchaseRequestsTab";
import { RFQAndQuotationTab } from "./components/RFQAndQuotationTab";
import { PurchaseOrdersTab } from "./components/PurchaseOrdersTab";
import { DeliveryAndGoodsReceiptTab } from "./components/DeliveryAndGoodsReceiptTab";
import { InvoiceAndMatchingTab } from "./components/InvoiceAndMatchingTab";
import { VendorManagementTab } from "./components/VendorManagementTab";
import { ContractsAndCatalogTab } from "./components/ContractsAndCatalogTab";
import { ProcurementAnalyticsTab } from "./components/ProcurementAnalyticsTab";
import { ProcurementAIInsightTab } from "./components/ProcurementAIInsightTab";
import { ProcurementApprovalCenterTab } from "./components/ProcurementApprovalCenterTab";
import { ProcurementReportsTab } from "./components/ProcurementReportsTab";

interface ProcurementModuleProps {
  onOpenAICopilot?: () => void;
}

export type ProcurementTabKey =
  | "COMMAND_CENTER"
  | "PURCHASE_REQUESTS"
  | "RFQ_QUOTATIONS"
  | "PURCHASE_ORDERS"
  | "DELIVERY_GR"
  | "INVOICE_MATCHING"
  | "VENDORS"
  | "CONTRACTS_CATALOG"
  | "APPROVAL_CENTER"
  | "ANALYTICS"
  | "AI_INSIGHTS"
  | "REPORTS";

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({ onOpenAICopilot }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ProcurementTabKey>("COMMAND_CENTER");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data states
  const [kpi, setKpi] = useState<ProcurementKPISummary | null>(null);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [contracts, setContracts] = useState<ProcurementContract[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [insights, setInsights] = useState<ProcurementAIInsight[]>([]);

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        loadedPrs,
        loadedRfqs,
        loadedQuotations,
        loadedPos,
        loadedReceipts,
        loadedInspections,
        loadedInvoices,
        loadedVendors,
        loadedContracts,
        loadedCatalog,
        loadedInsights,
        loadedKpi,
      ] = await Promise.all([
        procurementRepository.getPurchaseRequests(),
        procurementRepository.getRFQs(),
        procurementRepository.getQuotations(),
        procurementRepository.getPurchaseOrders(),
        procurementRepository.getGoodsReceipts(),
        procurementRepository.getQualityInspections(),
        procurementRepository.getInvoices(),
        procurementRepository.getVendors(),
        procurementRepository.getContracts(),
        procurementRepository.getCatalog(),
        procurementRepository.getAIInsights(),
        procurementRepository.getKPISummary(),
      ]);

      setPrs(loadedPrs);
      setRfqs(loadedRfqs);
      setQuotations(loadedQuotations);
      setPos(loadedPos);
      setReceipts(loadedReceipts);
      setInspections(loadedInspections);
      setInvoices(loadedInvoices);
      setVendors(loadedVendors);
      setContracts(loadedContracts);
      setCatalog(loadedCatalog);
      setInsights(loadedInsights);
      setKpi(loadedKpi);
    } catch (error) {
      console.error("Failed to load procurement data:", error);
      showToast("error", "Gagal Memuat Data", "Terjadi kesalahan saat memuat data pengadaan.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshKPISummary = async () => {
    const updatedKpi = await procurementRepository.getKPISummary();
    setKpi(updatedKpi);
  };

  // Action handlers
  const handleCreatePR = async (newPr: PurchaseRequest) => {
    try {
      await procurementRepository.savePurchaseRequest(newPr);
      const updated = await procurementRepository.getPurchaseRequests();
      setPrs(updated);
      await refreshKPISummary();
      showToast("success", "PR Dibuat", `Purchase Request ${newPr.prNumber} berhasil dikirim.`);
    } catch (err) {
      showToast("error", "Gagal Membuat PR", "Terjadi kesalahan saat menyimpan Purchase Request.");
    }
  };

  const handleApprovePR = async (prId: string, comment?: string) => {
    try {
      await procurementRepository.approvePR(prId, "USR-MGR-01", "Budi Santoso", comment);
      const updated = await procurementRepository.getPurchaseRequests();
      setPrs(updated);
      await refreshKPISummary();
      showToast("success", "PR Disetujui", `Purchase Request disetujui.`);
    } catch (err) {
      showToast("error", "Gagal Setujui PR", "Terjadi kesalahan saat menyetujui Purchase Request.");
    }
  };

  const handleCreateRFQ = async (newRfq: RFQ) => {
    try {
      await procurementRepository.saveRFQ(newRfq);
      const updated = await procurementRepository.getRFQs();
      setRfqs(updated);
      await refreshKPISummary();
      showToast("success", "RFQ Diterbitkan", `RFQ ${newRfq.rfqNumber} berhasil disimpan.`);
    } catch (err) {
      showToast("error", "Gagal Buat RFQ", "Terjadi kesalahan saat menyimpan RFQ.");
    }
  };

  const handleSubmitQuotation = async (quotation: Quotation) => {
    try {
      await procurementRepository.saveQuotation(quotation);
      const updated = await procurementRepository.getQuotations();
      setQuotations(updated);
      await refreshKPISummary();
      showToast("success", "Penawaran Disimpan", `Penawaran dari vendor berhasil dicatat.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan Penawaran", "Terjadi kesalahan saat menyimpan penawaran.");
    }
  };

  const handleAwardQuotation = async (quotationId: string, vendorId: string) => {
    try {
      const quots = await procurementRepository.getQuotations();
      const selected = quots.find((q) => q.id === quotationId || q.quotationId === quotationId);
      if (selected) {
        selected.status = "ACCEPTED";
        await procurementRepository.saveQuotation(selected);
        const updated = await procurementRepository.getQuotations();
        setQuotations(updated);
        await refreshKPISummary();
        showToast("success", "Penawaran Dimenangkan", `Penawaran dari vendor berhasil dimenangkan.`);
      }
    } catch (err) {
      showToast("error", "Gagal Memilih Pemenang", "Terjadi kesalahan saat memproses keputusan tender.");
    }
  };

  const handleSavePO = async (po: PurchaseOrder) => {
    try {
      await procurementRepository.savePurchaseOrder(po);
      const updated = await procurementRepository.getPurchaseOrders();
      setPos(updated);
      await refreshKPISummary();
      showToast("success", "PO Disimpan", `Purchase Order ${po.poNumber} berhasil diperbarui.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan PO", "Terjadi kesalahan saat menyimpan Purchase Order.");
    }
  };

  const handleSaveReceipt = async (receipt: GoodsReceipt) => {
    try {
      await procurementRepository.saveGoodsReceipt(receipt);
      const updated = await procurementRepository.getGoodsReceipts();
      setReceipts(updated);
      await refreshKPISummary();
      showToast("success", "Penerimaan Disimpan", `Goods Receipt ${receipt.receiptNumber} berhasil dicatat.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan GR", "Terjadi kesalahan saat mencatat penerimaan barang.");
    }
  };

  const handleSaveInspection = async (inspection: QualityInspection) => {
    try {
      await procurementRepository.saveQualityInspection(inspection);
      const updated = await procurementRepository.getQualityInspections();
      setInspections(updated);
      showToast("success", "Inspeksi Disimpan", `Hasil inspeksi K3 & Kualitas berhasil dicatat.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan Inspeksi", "Terjadi kesalahan saat mencatat hasil inspeksi.");
    }
  };

  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      await procurementRepository.saveInvoice(invoice);
      const updated = await procurementRepository.getInvoices();
      setInvoices(updated);
      await refreshKPISummary();
      showToast("success", "Faktur Disimpan", `Invoice ${invoice.invoiceNumber} berhasil diproses.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan Faktur", "Terjadi kesalahan saat memproses faktur.");
    }
  };

  const handleSaveVendor = async (vendor: Vendor) => {
    try {
      await procurementRepository.saveVendor(vendor);
      const updated = await procurementRepository.getVendors();
      setVendors(updated);
      await refreshKPISummary();
      showToast("success", "Vendor Disimpan", `Data vendor ${vendor.legalName} berhasil diperbarui.`);
    } catch (err) {
      showToast("error", "Gagal Menyimpan Vendor", "Terjadi kesalahan saat menyimpan vendor.");
    }
  };

  const tabNavigationItems: Array<{
    key: ProcurementTabKey;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number | string;
  }> = [
    { key: "COMMAND_CENTER", label: "Command Center", icon: ShoppingCart },
    {
      key: "PURCHASE_REQUESTS",
      label: "Purchase Request",
      icon: FileText,
      badge: kpi?.pendingPR || 0,
    },
    { key: "RFQ_QUOTATIONS", label: "RFQ & Penawaran", icon: Send, badge: kpi?.openRFQ || 0 },
    { key: "PURCHASE_ORDERS", label: "Purchase Order (PO)", icon: ShoppingCart, badge: kpi?.openPO || 0 },
    {
      key: "DELIVERY_GR",
      label: "Penerimaan & GR",
      icon: Truck,
      badge: kpi?.pendingDelivery || 0,
    },
    {
      key: "INVOICE_MATCHING",
      label: "3-Way Match & Invoice",
      icon: PackageCheck,
      badge: kpi?.pendingInvoice || 0,
    },
    { key: "VENDORS", label: "Vendor & CSMS HSE", icon: Building2, badge: kpi?.vendorCount || 0 },
    { key: "CONTRACTS_CATALOG", label: "Kontrak & Katalog", icon: Boxes },
    {
      key: "APPROVAL_CENTER",
      label: "Approval Center",
      icon: CheckSquare,
      badge: (kpi?.pendingPR || 0) + (kpi?.pendingApproval || 0),
    },
    { key: "ANALYTICS", label: "Analisis Biaya", icon: BarChart3 },
    { key: "AI_INSIGHTS", label: "AI Advisor", icon: Sparkles },
    { key: "REPORTS", label: "Laporan Pengadaan", icon: FileSpreadsheet },
  ];

  const formatIDR = (val: number) => {
    if (!val) return "Rp 0";
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    }
    if (val >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-900/40 rounded-2xl border border-slate-800 p-8 text-center backdrop-blur-md">
        <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Memuat Smart Procurement System...</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Menghubungkan ke repositori data pengadaan, inventaris alat berat, CSMS HSE vendor, dan kalkulasi 3-way matching.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                Supply Chain & Procurement Engine
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> CSMS Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-amber-400" /> Procurement & Supply Chain Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Sistem pengadaan cerdas terintegrasi untuk site tambang batu bara: siklus penuh PR, RFQ, PO, Goods Receipt, 3-Way Matching, CSMS HSE Vendor, dan Analisis Hemat Biaya AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAICopilot && (
              <button
                onClick={onOpenAICopilot}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                AI Procurement Copilot
              </button>
            )}
            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Executive Stats Strip */}
        {kpi && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-700/60">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Pending PR</span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">{kpi.pendingPR} Dokumen</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Open PO Commitments</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{formatIDR(kpi.poValueIDR)}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Overdue Delivery</span>
              <span className="text-base font-bold text-rose-400 mt-0.5 block">{kpi.overdueDelivery} PO</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">3-Way Match Rate</span>
              <span className="text-base font-bold text-cyan-400 mt-0.5 block">{kpi.threeWayMatchRatePct}%</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Active CSMS Vendors</span>
              <span className="text-base font-bold text-blue-400 mt-0.5 block">{kpi.vendorCount} Rekanan</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Cost Savings MTD</span>
              <span className="text-base font-bold text-teal-400 mt-0.5 block">{formatIDR(kpi.savingsTotalIDR)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {tabNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border-slate-700/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-extrabold ${
                    isActive
                      ? "bg-slate-950 text-amber-400"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Active View */}
      {kpi && (
        <div className="transition-all duration-200">
          {activeTab === "COMMAND_CENTER" && (
            <ProcurementCommandCenterTab
              kpi={kpi}
              insights={insights}
              recentPRs={prs.slice(0, 5)}
              recentPOs={pos.slice(0, 5)}
              vendors={vendors}
              onNavigateTab={(tab) => {
                const map: Record<string, ProcurementTabKey> = {
                  requisitions: "PURCHASE_REQUESTS",
                  rfq: "RFQ_QUOTATIONS",
                  comparison: "RFQ_QUOTATIONS",
                  approvals: "APPROVAL_CENTER",
                  "purchase-orders": "PURCHASE_ORDERS",
                  delivery: "DELIVERY_GR",
                  invoices: "INVOICE_MATCHING",
                  vendors: "VENDORS",
                  contracts: "CONTRACTS_CATALOG",
                };
                setActiveTab(map[tab] || (tab as ProcurementTabKey));
              }}
              onOpenCreatePR={() => setActiveTab("PURCHASE_REQUESTS")}
            />
          )}

          {activeTab === "PURCHASE_REQUESTS" && (
            <PurchaseRequestsTab prs={prs} onCreatePR={handleCreatePR} onApprovePR={handleApprovePR} />
          )}

          {activeTab === "RFQ_QUOTATIONS" && (
            <RFQAndQuotationTab
              rfqs={rfqs}
              quotations={quotations}
              vendors={vendors}
              onCreateRFQ={handleCreateRFQ}
              onSubmitQuotation={handleSubmitQuotation}
              onAwardQuotation={handleAwardQuotation}
            />
          )}

          {activeTab === "PURCHASE_ORDERS" && <PurchaseOrdersTab pos={pos} onSavePO={handleSavePO} />}

          {activeTab === "DELIVERY_GR" && (
            <DeliveryAndGoodsReceiptTab
              receipts={receipts}
              inspections={inspections}
              pos={pos}
              onSaveReceipt={handleSaveReceipt}
              onSaveInspection={handleSaveInspection}
            />
          )}

          {activeTab === "INVOICE_MATCHING" && (
            <InvoiceAndMatchingTab invoices={invoices} pos={pos} receipts={receipts} onSaveInvoice={handleSaveInvoice} />
          )}

          {activeTab === "VENDORS" && <VendorManagementTab vendors={vendors} contracts={contracts} onSaveVendor={handleSaveVendor} />}

          {activeTab === "CONTRACTS_CATALOG" && <ContractsAndCatalogTab contracts={contracts} catalog={catalog} />}

          {activeTab === "APPROVAL_CENTER" && (
            <ProcurementApprovalCenterTab prs={prs} pos={pos} invoices={invoices} onApprovePR={handleApprovePR} />
          )}

          {activeTab === "ANALYTICS" && <ProcurementAnalyticsTab kpi={kpi} />}

          {activeTab === "AI_INSIGHTS" && <ProcurementAIInsightTab insights={insights} />}

          {activeTab === "REPORTS" && <ProcurementReportsTab prs={prs} pos={pos} vendors={vendors} />}
        </div>
      )}
    </div>
  );
};
