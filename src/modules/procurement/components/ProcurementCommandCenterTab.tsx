// MINE SMART AI - Procurement Command Center Tab

import React from "react";
import {
  ShoppingCart,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  TrendingUp,
  PackageCheck,
  Building2,
  DollarSign,
  Truck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  BarChart3,
  Search,
  Filter,
  CheckSquare,
  Award
} from "lucide-react";
import { ProcurementKPISummary, ProcurementAIInsight, PurchaseRequest, PurchaseOrder, Vendor } from "../../../types/procurementTypes";

interface ProcurementCommandCenterTabProps {
  kpi: ProcurementKPISummary;
  insights: ProcurementAIInsight[];
  recentPRs: PurchaseRequest[];
  recentPOs: PurchaseOrder[];
  vendors: Vendor[];
  onNavigateTab: (tabKey: string) => void;
  onOpenCreatePR: () => void;
}

export const ProcurementCommandCenterTab: React.FC<ProcurementCommandCenterTabProps> = ({
  kpi,
  insights,
  recentPRs,
  recentPOs,
  vendors,
  onNavigateTab,
  onOpenCreatePR,
}) => {
  const formatIDR = (val: number) => {
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    }
    if (val >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl shadow-lg shadow-amber-500/20 text-white">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Procurement & Purchasing Command Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE ESDM / MINING OPERATIONAL
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Pusat kendali rantai pasok tambang batubara: PR → RFQ → Vendor → Quotation → PO → Delivery → 3-Way Matching Invoice
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onOpenCreatePR}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl transition shadow-lg shadow-amber-500/20 text-sm"
          >
            <Send className="w-4 h-4" /> Buat Purchase Request (PR)
          </button>
          <button
            onClick={() => onNavigateTab("comparison")}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition text-sm border border-slate-600"
          >
            <Award className="w-4 h-4" /> Evaluasi Quotation
          </button>
          <button
            onClick={() => onNavigateTab("approvals")}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition text-sm border border-slate-600 relative"
          >
            <CheckSquare className="w-4 h-4 text-amber-400" /> Approval Queue
            {kpi.pendingPR + kpi.pendingApproval > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-500 text-slate-950 font-bold rounded-full">
                {kpi.pendingPR + kpi.pendingApproval}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Procurement Workflow Timeline */}
      <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" /> End-to-End Mining Procurement Workflow Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div
            onClick={() => onNavigateTab("requisitions")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">1. Purchase Request</div>
            <div className="text-lg font-bold text-white">{kpi.totalPR} PR</div>
            <div className="text-[11px] text-amber-400 mt-0.5">{kpi.pendingPR} Pending Review</div>
          </div>

          <div
            onClick={() => onNavigateTab("rfq")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">2. RFQ & Invitation</div>
            <div className="text-lg font-bold text-white">{kpi.openRFQ} Open</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{kpi.pendingQuotation} Responses Received</div>
          </div>

          <div
            onClick={() => onNavigateTab("comparison")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">3. Comparison Matrix</div>
            <div className="text-lg font-bold text-white">{kpi.pendingComparison} Evaluation</div>
            <div className="text-[11px] text-blue-400 mt-0.5">Weighted Scoring</div>
          </div>

          <div
            onClick={() => onNavigateTab("approvals")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">4. PO Approval</div>
            <div className="text-lg font-bold text-white">{kpi.pendingApproval} Approval</div>
            <div className="text-[11px] text-amber-400 mt-0.5">RBAC & Budget Check</div>
          </div>

          <div
            onClick={() => onNavigateTab("purchase-orders")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">5. Purchase Order (PO)</div>
            <div className="text-lg font-bold text-white">{kpi.openPO} Active PO</div>
            <div className="text-[11px] text-amber-300 mt-0.5">{formatIDR(kpi.poValueIDR)}</div>
          </div>

          <div
            onClick={() => onNavigateTab("delivery")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">6. Delivery & GR QC</div>
            <div className="text-lg font-bold text-white">{kpi.pendingDelivery} Pending Delivery</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{kpi.partialDelivery} Partial Receipts</div>
          </div>

          <div
            onClick={() => onNavigateTab("invoices")}
            className="cursor-pointer bg-slate-900/60 hover:bg-slate-700/50 p-3 rounded-xl border border-slate-700/60 transition text-center group"
          >
            <div className="text-xs text-slate-400 mb-1 group-hover:text-amber-400 transition">7. 3-Way Invoice Match</div>
            <div className="text-lg font-bold text-white">{kpi.pendingInvoice} Pending Inv</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{kpi.threeWayMatchRatePct}% Matched</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Purchase Requests</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{kpi.totalPR}</div>
          <div className="flex items-center justify-between text-[11px] mt-2">
            <span className="text-emerald-400">{kpi.approvedPR} Disetujui</span>
            <span className="text-rose-400">{kpi.rejectedPR} Ditolak</span>
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Open Purchase Orders</span>
            <ShoppingCart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{kpi.openPO}</div>
          <div className="text-[11px] text-amber-400 mt-2 truncate font-medium">
            Nilai: {formatIDR(kpi.poValueIDR)}
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Vendor Terverifikasi</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{kpi.vendorCount}</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">
            100% HSE Compliant
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>On-Time Delivery Rate</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{kpi.onTimeDeliveryRatePct}%</div>
          <div className="text-[11px] text-slate-400 mt-2">
            {kpi.overdueDelivery > 0 ? (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" /> {kpi.overdueDelivery} Overdue PO
              </span>
            ) : (
              "Semua jadwal tepat"
            )}
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Direct Cost Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{formatIDR(kpi.savingsTotalIDR)}</div>
          <div className="text-[11px] text-slate-400 mt-2">
            Hasil Negosiasi RFQ Q3
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>3-Way Match Rate</span>
            <PackageCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{kpi.threeWayMatchRatePct}%</div>
          <div className="text-[11px] text-indigo-300 mt-2">
            PO ↔ GR ↔ Invoice Verified
          </div>
        </div>
      </div>

      {/* AI Procurement Advisory & Risk Signals */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900/90 p-5 rounded-2xl border border-amber-500/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">AI Procurement Risk & Supply Chain Intelligence</h3>
          </div>
          <button
            onClick={() => onNavigateTab("ai-insight")}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            Buka AI Insight Hub <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 2).map((item) => (
            <div key={item.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.type === "DELIVERY_RISK" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {item.type}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Confidence: {item.confidence}</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-300 mb-2 line-clamp-2">{item.finding}</p>
              <div className="p-2 bg-slate-950/60 rounded text-[11px] text-amber-300/90 font-mono border border-slate-800">
                💡 <span className="font-semibold text-amber-400">Rekomendasi:</span> {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent PRs & Recent POs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchase Requests */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Purchase Requests Terbaru
            </h3>
            <button
              onClick={() => onNavigateTab("requisitions")}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {recentPRs.map((pr) => (
              <div key={pr.prId} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 hover:border-amber-500/40 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">{pr.prNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pr.priority === "URGENT" || pr.priority === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {pr.priority}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    pr.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {pr.status}
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-medium mb-1 line-clamp-1">{pr.purpose}</div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Pemohon: {pr.requesterName.split("(")[0]}</span>
                  <span className="font-semibold text-amber-300">{formatIDR(pr.estimatedValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" /> Purchase Orders (PO) Aktif
            </h3>
            <button
              onClick={() => onNavigateTab("purchase-orders")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {recentPOs.map((po) => (
              <div key={po.poId} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{po.poNumber}</span>
                    <span className="text-[11px] text-slate-300 font-medium truncate max-w-[150px]">{po.vendorName}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    po.status === "FULLY_RECEIVED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : po.status === "PARTIALLY_RECEIVED"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {po.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>Delivery Expected: <strong className="text-slate-200">{po.deliveryDate}</strong></span>
                  <span className="font-bold text-emerald-400">{formatIDR(po.grandTotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
