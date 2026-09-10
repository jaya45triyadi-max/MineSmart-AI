import React from "react";
import {
  TrendingUp,
  DollarSign,
  Ship,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Box,
  ChevronRight,
  Scale,
  Building2,
  ShieldAlert,
  Flame,
  Anchor,
  Globe,
  Layers,
  FileCheck,
} from "lucide-react";
import {
  Customer,
  SalesContract,
  SalesOrder,
  Shipment,
  SalesRevenue,
  AISalesInsight,
  PipelineStageMetric,
  CoalPriceIndex,
} from "../../../types/salesTypes";
import { PipelineFlowChain } from "./PipelineFlowChain";
import { MOCK_PIPELINE_STAGES, MOCK_PRICE_INDICES } from "../../../data/salesData";

interface OverviewTabProps {
  customers: Customer[];
  contracts: SalesContract[];
  salesOrders: SalesOrder[];
  shipments: Shipment[];
  revenues: SalesRevenue[];
  aiInsights: AISalesInsight[];
  onSelectSubTab: (tabKey: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  customers,
  contracts,
  salesOrders,
  shipments,
  revenues,
  aiInsights,
  onSelectSubTab,
}) => {
  // Metric Calculations
  const activeContractsCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const activeCustomersCount = customers.filter((c) => c.status === "ACTIVE").length;
  
  const totalContractedQty = contracts.reduce((sum, c) => sum + c.contractQuantity, 0);
  const totalShippedQty = contracts.reduce((sum, c) => sum + c.shippedQuantity, 0);
  const totalDeliveredQty = contracts.reduce((sum, c) => sum + c.deliveredQuantity, 0);
  const totalRemainingQty = contracts.reduce((sum, c) => sum + c.remainingQuantity, 0);

  const totalGrossRevenueUSD = revenues.reduce((sum, r) => sum + r.grossRevenue, 0);
  const totalNetRevenueUSD = revenues.reduce((sum, r) => sum + r.netRevenue, 0);
  const averagePriceUSD = 84.50;

  const activeShipments = shipments.filter((s) => ["IN_TRANSIT", "LOADING", "READY_TO_LOAD"].includes(s.status));

  // 8 Pillars of Sales & Shipment Monitoring
  const monitoringPillars = [
    { key: "customers", name: "Customer", count: `${customers.length} Accounts`, desc: "PLN, Traders, Global Utilities", icon: Users, color: "text-indigo-500 bg-indigo-500/10" },
    { key: "contracts", name: "Contract", count: `${contracts.length} Contracts`, desc: "Long-term, Spot, Tender", icon: FileText, color: "text-emerald-500 bg-emerald-500/10" },
    { key: "products", name: "Coal Specification", count: "4 Active Grades", desc: "GAR 5800, 5200, 4650, 3950", icon: Flame, color: "text-amber-500 bg-amber-500/10" },
    { key: "quantity", name: "Quantity (Mass Balance)", count: `${(totalContractedQty / 1000).toLocaleString("id-ID")}k MT`, desc: "Draft Survey & Scale Reconciliation", icon: Scale, color: "text-blue-500 bg-blue-500/10" },
    { key: "shipments", name: "Shipment", count: `${shipments.length} Dispatches`, desc: "Barges & Mother Vessels", icon: Ship, color: "text-cyan-500 bg-cyan-500/10" },
    { key: "vessels", name: "Vessel", count: "8 Vessels Registered", desc: "Panamax, Supramax, Barges", icon: Anchor, color: "text-violet-500 bg-violet-500/10" },
    { key: "destinations", name: "Destination", count: "6 Ports & Jetties", desc: "Rembang, Suralaya, Guangzhou, Mundra", icon: Globe, color: "text-teal-500 bg-teal-500/10" },
    { key: "revenue", name: "Price & Revenue", count: `$${(totalNetRevenueUSD / 1000000).toFixed(1)}M USD`, desc: "ICI / Newcastle / HBA Formulas", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Commercial Assistant Alert */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Ship className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              MINE SMART AI • SALES & SHIPMENT COMMAND CENTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sales, Shipment & Commercial Intelligence
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Monitoring 8 Pilar Komersial: <strong>Customer, Contract, Coal Specification, Quantity, Shipment, Vessel, Destination, Price</strong> serta integrasi rantai nilai <strong>Contract → Production → Stock → Shipment → Revenue</strong> secara presisi dan real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectSubTab("ai-insight")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              AI Commercial Engine
            </button>
            <button
              onClick={() => onSelectSubTab("quantity")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              Mass Balance Reconciliation
            </button>
          </div>
        </div>
      </div>

      {/* COAL PRICE INDEX REAL-TIME TICKER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Market Price Indices & Index-Linked Benchmarks (USD/MT)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Updated 14 Aug 2026</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_PRICE_INDICES.map((idx) => (
            <div
              key={idx.indexCode}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{idx.indexCode.replace("_", " ")}</span>
                <span className={idx.changeWeeklyUSD >= 0 ? "text-emerald-500 font-mono" : "text-rose-500 font-mono"}>
                  {idx.changeWeeklyUSD >= 0 ? `+${idx.changeWeeklyUSD}` : idx.changeWeeklyUSD}
                </span>
              </div>
              <div className="text-base font-black font-mono text-slate-900 dark:text-white">
                ${idx.currentPriceUSD.toFixed(2)}
              </div>
              <p className="text-[9px] text-slate-400 truncate">{idx.indexName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MASTER PIPELINE DASHBOARD: Contract → Production → Stock → Shipment → Revenue */}
      <PipelineFlowChain
        pipelineStages={MOCK_PIPELINE_STAGES}
        contracts={contracts}
        shipments={shipments}
        revenues={revenues}
        onSelectSubTab={onSelectSubTab}
      />

      {/* 8 MONITORING PILLARS QUICK NAVIGATION CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              8 Pilar Monitoring Sales & Shipment
            </h3>
            <p className="text-xs text-slate-500">
              Navigasi komprehensif ke modul operasional terperinci
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monitoringPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.key}
                onClick={() => onSelectSubTab(pillar.key)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {pillar.name}
                  </h4>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {pillar.count}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Contracts & Customers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Active Contracts
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {activeContractsCount} <span className="text-xs text-slate-500 font-normal">/ {contracts.length} Total</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{activeCustomersCount} Active Key Customers</span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              100% Active <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Total Contracted & Remaining Qty */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Contracted Coal Qty
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {(totalContractedQty / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}k <span className="text-xs text-slate-500 font-normal">MT</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Sisa Kontrak: {(totalRemainingQty / 1000).toLocaleString("id-ID")}k MT</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {((totalShippedQty / totalContractedQty) * 100).toFixed(1)}% Fulfilled
            </span>
          </div>
        </div>

        {/* Shipped & Delivered Qty */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Shipped / Delivered
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {(totalDeliveredQty / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}k <span className="text-xs text-slate-500 font-normal">MT Delivered</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{activeShipments.length} Vessels / Barges In-Transit</span>
            <span className="text-amber-600 font-medium">On-Time 98.4%</span>
          </div>
        </div>

        {/* Net Revenue MTD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Net Commercial Revenue
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                USD ${(totalNetRevenueUSD / 1000000).toFixed(2)}M
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Avg Price: ${averagePriceUSD.toFixed(2)}/MT</span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              +4.8% vs Target <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Operational Overview Layout: Live Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Ship className="w-5 h-5 text-emerald-500" />
              Live Shipment & Dispatch Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active vessel loading, barge river hauling, and international transshipment points
            </p>
          </div>
          <button
            onClick={() => onSelectSubTab("shipments")}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            View All ({shipments.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {shipments.map((shp) => (
            <div
              key={shp.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{shp.shipmentNumber}</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{shp.vesselName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {shp.vesselType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">{shp.customerName}</strong> • {shp.productName} ({shp.quantity.toLocaleString("id-ID")} MT)
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Port: {shp.loadingPort}</span>
                  <span>→</span>
                  <span>Dest: {shp.destinationName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    shp.status === "IN_TRANSIT"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : shp.status === "DELIVERED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {shp.status.replace("_", " ")}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ETA: {new Date(shp.estimatedArrival).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
