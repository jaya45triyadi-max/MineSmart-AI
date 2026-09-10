import React, { useState } from "react";
import {
  FileText,
  Pickaxe,
  Boxes,
  Ship,
  DollarSign,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  ChevronRight,
  Info,
  ShieldCheck,
  RefreshCw,
  Layers,
  Flame,
} from "lucide-react";
import {
  PipelineStageMetric,
  PipelineStageKey,
  SalesContract,
  Shipment,
  SalesRevenue,
} from "../../../types/salesTypes";

interface PipelineFlowChainProps {
  pipelineStages: PipelineStageMetric[];
  contracts: SalesContract[];
  shipments: Shipment[];
  revenues: SalesRevenue[];
  onSelectSubTab: (tabKey: string) => void;
}

export const PipelineFlowChain: React.FC<PipelineFlowChainProps> = ({
  pipelineStages,
  contracts,
  shipments,
  revenues,
  onSelectSubTab,
}) => {
  const [selectedStageKey, setSelectedStageKey] = useState<PipelineStageKey>("contract");
  const [surgeTonnage, setSurgeTonnage] = useState<number>(0);

  const stageIcons: Record<PipelineStageKey, React.ComponentType<{ className?: string }>> = {
    contract: FileText,
    production: Pickaxe,
    stock: Boxes,
    shipment: Ship,
    revenue: DollarSign,
  };

  const stageColors: Record<PipelineStageKey, { border: string; bg: string; text: string; badge: string }> = {
    contract: {
      border: "border-indigo-500",
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-500 text-white",
    },
    production: {
      border: "border-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-500 text-slate-950",
    },
    stock: {
      border: "border-blue-500",
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-500 text-white",
    },
    shipment: {
      border: "border-cyan-500",
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-500 text-slate-950",
    },
    revenue: {
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-500 text-slate-950",
    },
  };

  const activeStage = pipelineStages.find((s) => s.stageKey === selectedStageKey) || pipelineStages[0];

  // What-If Simulation Projections
  const simulatedVolume = activeStage.volumeMT + surgeTonnage;
  const simulatedRevenue = (simulatedVolume * 85.0); // estimated $85/ton average

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Top Title & Pipeline Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 uppercase tracking-wider">
              END-TO-END COMMERCIAL PIPELINE
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Mass & Value Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Contract → Production → Stock → Shipment → Revenue
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Klik pada setiap tahapan untuk melihat rincian operasional, rasio konversi tonase, status bottleneck, dan proyeksi finansial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectSubTab("ai-insight")}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Pipeline Optimizer</span>
          </button>
        </div>
      </div>

      {/* 5-STAGE INTERACTIVE PIPELINE NODES */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {pipelineStages.map((stage, idx) => {
          const isSelected = selectedStageKey === stage.stageKey;
          const Icon = stageIcons[stage.stageKey];
          const color = stageColors[stage.stageKey];

          return (
            <div
              key={stage.stageKey}
              onClick={() => setSelectedStageKey(stage.stageKey)}
              className={`rounded-2xl p-4 transition-all cursor-pointer border relative flex flex-col justify-between space-y-3 ${
                isSelected
                  ? `bg-slate-50 dark:bg-slate-800/80 ${color.border} ring-2 ring-emerald-500/30 shadow-lg`
                  : "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-90"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${color.bg} ${color.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Step {idx + 1}
                </span>
              </div>

              {/* Title & Numbers */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  {stage.stageName.split(". ")[1]}
                </h3>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-1">
                  {(stage.volumeMT / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}k MT
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  ${(stage.valueUSD / 1000000).toFixed(1)}M USD
                </div>
              </div>

              {/* Progress & Conversion Rate */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">Conversion:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {stage.conversionPercent}%
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>On-Track (Healthy)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED STAGE DETAILED DRILLDOWN VIEW */}
      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${stageColors[activeStage.stageKey].bg} ${stageColors[activeStage.stageKey].text}`}>
              {React.createElement(stageIcons[activeStage.stageKey], { className: "w-6 h-6" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Stage Diagnostic Detail
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Lead Time: ~{activeStage.leadTimeDays} Days
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {activeStage.stageName}: {activeStage.stageSubtitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeStage.stageKey === "contract") onSelectSubTab("contracts");
                else if (activeStage.stageKey === "production") onSelectSubTab("products");
                else if (activeStage.stageKey === "stock") onSelectSubTab("allocations");
                else if (activeStage.stageKey === "shipment") onSelectSubTab("shipments");
                else if (activeStage.stageKey === "revenue") onSelectSubTab("revenue");
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Explore Dedicated {activeStage.stageName.split(". ")[1]} Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Key Operational Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeStage.keyDrivers.map((driver, dIdx) => (
            <div
              key={dIdx}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {driver.label}
              </span>
              <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{driver.value}</span>
                {driver.trend === "UP" && (
                  <span className="text-xs text-emerald-500 font-bold">↑</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Live Linked Items Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Active Linked Entities in this Stage ({activeStage.activeItemsCount} Items)
          </h4>

          {activeStage.stageKey === "contract" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Contract #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product Spec</th>
                    <th className="p-3 text-right">Committed Qty</th>
                    <th className="p-3 text-right">Base Price</th>
                    <th className="p-3 text-center">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {contracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {c.contractNumber}
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {c.customerName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{c.productName}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {c.contractQuantity.toLocaleString("id-ID")} MT
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        ${c.price.toFixed(2)}/MT
                      </td>
                      <td className="p-3 text-center font-bold text-indigo-600">
                        {c.fulfillmentPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeStage.stageKey === "shipment" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Shipment #</th>
                    <th className="p-3">Vessel / Barge</th>
                    <th className="p-3">Customer & Destination</th>
                    <th className="p-3 text-right">Dispatched Qty</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                      <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {s.shipmentNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {s.vesselName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {s.customerName} → {s.destinationName}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {s.quantity.toLocaleString("id-ID")} MT
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {s.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{s.estimatedArrival}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeStage.stageKey === "revenue" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3 text-right">Billed Qty</th>
                    <th className="p-3 text-right">Base Price</th>
                    <th className="p-3 text-right">Net Revenue</th>
                    <th className="p-3 text-center">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {revenues.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {r.invoiceReference || r.revenueCode}
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {r.customerName}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {r.quantity.toLocaleString("id-ID")} MT
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        ${r.basePrice.toFixed(2)}/MT
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ${(r.netRevenue / 1000000).toFixed(3)}M
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeStage.stageKey === "production" || activeStage.stageKey === "stock") && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  Stockpile Quality Matching & Blending Hub
                </div>
                <p className="text-slate-500">
                  320,000 MT active clean coal in buffer (GAR 5,850 Premium, GAR 5,200 Standard, GAR 4,650 Washed, Eco 3,950).
                </p>
              </div>
              <button
                onClick={() => onSelectSubTab("allocations")}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                View Stock Allocations →
              </button>
            </div>
          )}
        </div>

        {/* Dynamic What-If Volume Surge Simulator */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h5 className="text-xs font-bold text-white">
                What-If Scenario: Surge Volume Projection Simulator
              </h5>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 font-bold">
              +{surgeTonnage.toLocaleString("id-ID")} MT Surge
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={surgeTonnage}
            onChange={(e) => setSurgeTonnage(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
            <span className="text-slate-400">
              Projected Throughput: <strong className="text-white font-mono">{simulatedVolume.toLocaleString("id-ID")} MT</strong>
            </span>
            <span className="text-slate-400">
              Projected Commercial Revenue: <strong className="text-emerald-400 font-mono">${(simulatedRevenue / 1000000).toFixed(2)}M USD</strong>
            </span>
            <button
              onClick={() => setSurgeTonnage(0)}
              className="text-[10px] text-indigo-300 hover:text-white underline cursor-pointer"
            >
              Reset Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
