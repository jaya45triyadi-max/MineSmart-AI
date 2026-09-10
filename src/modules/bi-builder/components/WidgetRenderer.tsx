// MINE SMART AI - BI Dashboard Builder Widget Renderer
// Renders all 8 widget types: Production, Fleet, Fuel, Cost, Map, KPI, Table, and AI Insight

import React, { useState } from "react";
import {
  Pickaxe,
  BarChart3,
  TrendingUp,
  Truck,
  Clock,
  PieChart,
  Fuel,
  Layers,
  Coins,
  DollarSign,
  MapPin,
  Activity,
  Table as TableIcon,
  Sparkles,
  Settings,
  Trash2,
  Copy,
  GripVertical,
  Maximize2,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Droplets,
  Radio,
  Eye,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import {
  CustomBIWidget,
  KPIMetricData,
  ProductionSeriesPoint,
  FleetTelemetryData,
  FuelConsumptionPoint,
  CostBreakdownItem,
  AIInsightCard,
  MapPitFeature,
  WidgetWidthSpan,
} from "../../../types/biBuilderTypes";
import { BIDashboardBuilderService } from "../../../services/bi/BIDashboardBuilderService";

interface WidgetRendererProps {
  widget: CustomBIWidget;
  isEditMode: boolean;
  onUpdateWidth: (widgetId: string, newWidth: WidgetWidthSpan) => void;
  onOpenSettings: (widget: CustomBIWidget) => void;
  onDuplicate: (widgetId: string) => void;
  onDelete: (widgetId: string) => void;
  onDragStartWidget: (e: React.DragEvent, index: number) => void;
  onDragOverWidget: (e: React.DragEvent, index: number) => void;
  onDropWidget: (e: React.DragEvent, index: number) => void;
  index: number;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isEditMode,
  onUpdateWidth,
  onOpenSettings,
  onDuplicate,
  onDelete,
  onDragStartWidget,
  onDragOverWidget,
  onDropWidget,
  index,
}) => {
  const [selectedPitFilter, setSelectedPitFilter] = useState<string>("ALL");
  const [tableSearch, setTableSearch] = useState<string>("");
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [activeMapLayer, setActiveMapLayer] = useState<"ALL" | "PITS" | "FLEET" | "DISPOSAL">("ALL");

  // Fetch mock data sets
  const kpiMetrics = BIDashboardBuilderService.getKPIMetrics();
  const prodSeries = BIDashboardBuilderService.getProductionTimeSeries();
  const pitBreakdown = BIDashboardBuilderService.getPitProductionBreakdown();
  const fleetStatus = BIDashboardBuilderService.getFleetStatusData();
  const cycleStages = BIDashboardBuilderService.getCycleTimeStages();
  const fuelBurnData = BIDashboardBuilderService.getFuelBurnRateByClass();
  const costBreakdown = BIDashboardBuilderService.getCostBreakdown();
  const { features: mapFeatures, fleetUnits: mapFleet } = BIDashboardBuilderService.getSpatialMapFeatures();
  const aiInsights = BIDashboardBuilderService.getAIInsights();

  // Grid width Tailwind mapping
  const getColSpanClass = (width: WidgetWidthSpan) => {
    switch (width) {
      case 3:
        return "col-span-12 sm:col-span-6 lg:col-span-3";
      case 4:
        return "col-span-12 sm:col-span-6 lg:col-span-4";
      case 6:
        return "col-span-12 lg:col-span-6";
      case 8:
        return "col-span-12 lg:col-span-8";
      case 9:
        return "col-span-12 lg:col-span-9";
      case 12:
      default:
        return "col-span-12";
    }
  };

  const handleRegenerateAI = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
    }, 1200);
  };

  return (
    <div
      draggable={isEditMode}
      onDragStart={(e) => onDragStartWidget(e, index)}
      onDragOver={(e) => onDragOverWidget(e, index)}
      onDrop={(e) => onDropWidget(e, index)}
      className={`${getColSpanClass(
        widget.width
      )} bg-slate-900/90 rounded-3xl border transition-all shadow-xl flex flex-col overflow-hidden relative group ${
        isEditMode
          ? "border-slate-700/80 hover:border-amber-400/60 ring-1 ring-slate-800"
          : "border-slate-800/80 hover:border-slate-700"
      }`}
    >
      {/* Widget Header Toolbar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-950/40">
        <div className="flex items-center gap-2.5 min-w-0">
          {isEditMode && (
            <div
              className="text-slate-500 hover:text-amber-400 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800 transition"
              title="Geser posisi widget (Drag & Drop)"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <h4 className="text-xs font-black text-white tracking-wide truncate">
            {widget.title}
          </h4>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase hidden sm:inline-block">
            {widget.category}
          </span>
        </div>

        {/* Edit Mode Quick Actions */}
        {isEditMode ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Width Selector */}
            <select
              value={widget.width}
              onChange={(e) => onUpdateWidth(widget.id, Number(e.target.value) as WidgetWidthSpan)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
              title="Ubah lebar kolom widget (12 grid)"
            >
              <option value={3}>3 Kolom (1/4)</option>
              <option value={4}>4 Kolom (1/3)</option>
              <option value={6}>6 Kolom (1/2)</option>
              <option value={8}>8 Kolom (2/3)</option>
              <option value={9}>9 Kolom (3/4)</option>
              <option value={12}>12 Kolom (Full)</option>
            </select>

            <button
              onClick={() => onOpenSettings(widget)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Pengaturan Widget"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDuplicate(widget.id)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Duplikasi Widget"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(widget.id)}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition"
              title="Hapus Widget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </div>
        )}
      </div>

      {/* Widget Content Body by Category */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* 1. PRODUCTION WIDGET */}
        {widget.category === "PRODUCTION" && (
          <div className="space-y-4">
            {widget.config.chartType === "BAR" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                  <span>Pit Tambang</span>
                  <span>Produksi Batubara / OB</span>
                </div>
                {pitBreakdown.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">{p.pit}</span>
                      <span className="font-mono font-bold text-amber-400">{p.coalMT.toLocaleString()} MT</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-amber-500 h-full" style={{ width: `${p.pctShare}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>OB: {p.obBCM.toLocaleString()} BCM</span>
                      <span>SR: {p.sr.toFixed(2)} BCM/MT</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Batubara (MT)
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Overburden (BCM)
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">Shift 1 & 2 Output</span>
                </div>

                {/* Production Bar / Area SVG Visualization */}
                <div className="h-44 w-full flex items-end justify-between gap-1 pt-4 pb-2 border-b border-slate-800 font-mono text-[9px]">
                  {prodSeries.map((pt, idx) => {
                    const maxVal = 2000;
                    const coalH = Math.min((pt.coalActualMT / maxVal) * 100, 100);
                    const obH = Math.min((pt.obActualBCM / 10000) * 100, 100);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar">
                        <div className="w-full flex items-end justify-center gap-0.5 h-full">
                          <div
                            className="w-1/2 bg-amber-500/80 group-hover/bar:bg-amber-400 rounded-t transition-all relative"
                            style={{ height: `${coalH}%` }}
                            title={`${pt.time}: Coal ${pt.coalActualMT} MT`}
                          />
                          <div
                            className="w-1/2 bg-blue-500/70 group-hover/bar:bg-blue-400 rounded-t transition-all"
                            style={{ height: `${obH}%` }}
                            title={`${pt.time}: OB ${pt.obActualBCM} BCM`}
                          />
                        </div>
                        <span className="text-slate-500 text-[8px]">{pt.time}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Total Batubara Hari Ini: <strong className="text-amber-400 font-mono">16,840 MT</strong></span>
                  <span>Planned Stripping Ratio: <strong className="text-blue-400 font-mono">5.50 BCM/MT</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. FLEET WIDGET */}
        {widget.category === "FLEET" && (
          <div className="space-y-4">
            {widget.config.chartType === "DONUT" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {fleetStatus.map((st, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                        <span className="text-xs font-bold text-slate-200 truncate">{st.name}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-mono font-black text-white">{st.count} <span className="text-xs font-normal text-slate-500">Unit</span></span>
                        <span className="text-xs font-mono font-bold text-slate-400">{st.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : widget.config.chartType === "BAR" ? (
              <div className="space-y-2.5">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Komponen Durasi Siklus Hauling (Menit)
                </div>
                {cycleStages.map((cs, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cs.stage}</span>
                      <span className="font-mono font-bold text-white">
                        {cs.minutes} m <span className="text-slate-500 text-[10px]">(Target {cs.benchmarkMin}m)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cs.deviationPct > 10 ? "bg-amber-500" : "bg-cyan-400"
                        }`}
                        style={{ width: `${(cs.minutes / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Physical Availability (PA)</span>
                  <div className="text-2xl font-mono font-black text-emerald-400">91.4%</div>
                  <div className="text-[10px] text-emerald-400 font-medium">✓ Target ESDM &gt; 90%</div>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Use of Availability (UA)</span>
                  <div className="text-2xl font-mono font-black text-blue-400">84.8%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Standby Delay: 15.2%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. FUEL WIDGET */}
        {widget.category === "FUEL" && (
          <div className="space-y-3">
            {widget.config.chartType === "BAR" ? (
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase mb-1">
                  <span>Model Alat Berat</span>
                  <span>Burn Rate (L/Jam)</span>
                </div>
                {fuelBurnData.map((f, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">{f.model} <span className="text-[10px] text-slate-500 font-normal">({f.unitCount} Unit)</span></span>
                      <span className="font-mono font-bold text-rose-400">{f.burnRateLph} L/h</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${(f.burnRateLph / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Stok Tangki Solar Induk (Fuel Farm)</span>
                    <span className="font-mono font-bold text-emerald-400">422,500 L (84.5%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "84.5%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Kapasitas: 500,000 Liter</span>
                    <span>Ketahanan: 10.8 Hari</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Fuel Ratio (L/BCM)</div>
                    <div className="text-lg font-mono font-black text-amber-400 mt-0.5">0.42 L/BCM</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Fuel Ratio (L/Ton)</div>
                    <div className="text-lg font-mono font-black text-rose-400 mt-0.5">2.35 L/MT</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. COST WIDGET */}
        {widget.category === "COST" && (
          <div className="space-y-3">
            {widget.config.chartType === "LINE" ? (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase">Mining Cost Per Ton ($/MT)</div>
                  <div className="text-2xl font-mono font-black text-emerald-400">
                    $24.15 <span className="text-xs font-normal text-slate-500">/ MT (Budget: $25.00)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80">
                    ✓ Efisiensi biaya 3.4% di bawah pagu RKAB.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-400">Cost Per BCM:</span>
                  <span className="font-mono font-bold text-white">$2.18 / BCM</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Struktur Biaya Operasional (OPEX)
                </div>
                {costBreakdown.map((c, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-200">{c.category}</span>
                      <span className="font-mono font-bold text-white">{c.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Rp {(c.amountIDR / 1e9).toFixed(1)} Miliar</span>
                      <span>${c.costPerTonUSD.toFixed(2)}/MT</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. MAP WIDGET (Interactive Pit & Fleet Spatial Map) */}
        {widget.category === "MAP" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(["ALL", "PITS", "FLEET", "DISPOSAL"] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveMapLayer(layer)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      activeMapLayer === layer
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {mapFleet.length} Unit Live GPS Tracked
              </span>
            </div>

            {/* Interactive Pit Spatial Graphic Area */}
            <div className="relative h-64 w-full bg-[#050C1A] rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Pit Grid Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px), radial-gradient(#3B82F6 1px, #050C1A 1px)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              />

              {/* Haul Road Path Vectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/30" strokeDasharray="4 4" strokeWidth="2">
                <line x1="28%" y1="35%" x2="42%" y2="22%" />
                <line x1="28%" y1="35%" x2="15%" y2="75%" />
                <line x1="65%" y1="70%" x2="42%" y2="22%" />
                <line x1="65%" y1="70%" x2="80%" y2="48%" />
                <line x1="15%" y1="75%" x2="12%" y2="82%" />
              </svg>

              {/* Spatial Features (Pits, Disposal, Stockpile) */}
              {(activeMapLayer === "ALL" || activeMapLayer === "PITS" || activeMapLayer === "DISPOSAL") &&
                mapFeatures.map((f) => {
                  const isPit = f.type === "PIT";
                  const isDisposal = f.type === "DISPOSAL";
                  const isStockpile = f.type === "STOCKPILE" || f.type === "CRUSHER";

                  return (
                    <div
                      key={f.id}
                      className="absolute p-2 rounded-xl border backdrop-blur-md shadow-xl transition hover:scale-105 cursor-pointer flex items-center gap-1.5 z-10"
                      style={{
                        left: `${f.coordinates.x}%`,
                        top: `${f.coordinates.y}%`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: isPit
                          ? "rgba(245, 158, 11, 0.15)"
                          : isDisposal
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(16, 185, 129, 0.15)",
                        borderColor: isPit ? "#F59E0B" : isDisposal ? "#3B82F6" : "#10B981",
                      }}
                      title={`${f.name} - ${f.activeUnitsCount} Unit Beroperasi`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isPit ? "text-amber-400" : isDisposal ? "text-blue-400" : "text-emerald-400"
                        }`}
                      />
                      <div className="text-[10px] font-bold text-white whitespace-nowrap">
                        {f.name}
                        <span className="block text-[8px] font-mono text-slate-400">
                          {f.activeUnitsCount} Units
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* Live Fleet GPS Dots */}
              {(activeMapLayer === "ALL" || activeMapLayer === "FLEET") &&
                mapFleet.map((u, idx) => {
                  const offsetX = (idx % 3) * 6 - 6;
                  const offsetY = Math.floor(idx / 3) * 6 - 6;
                  const isExcavator = u.type === "EXCAVATOR";

                  return (
                    <div
                      key={u.equipmentId}
                      className="absolute w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shadow-lg border border-slate-900 cursor-pointer hover:scale-125 transition z-20"
                      style={{
                        left: `calc(${isExcavator ? "28%" : "50%"} + ${offsetX}%)`,
                        top: `calc(${isExcavator ? "35%" : "45%"} + ${offsetY}%)`,
                        backgroundColor: u.status === "OPERATING" ? "#10B981" : "#F59E0B",
                        color: "#0F172A",
                      }}
                      title={`${u.equipmentId} (${u.model}) - ${u.operator} - ${u.status}`}
                    >
                      {isExcavator ? "⛏" : "🚚"}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 6. KPI CARD WIDGET */}
        {widget.category === "KPI" && (
          <div className="space-y-3">
            {(() => {
              const kpiKey = widget.config.metricKey || "TOTAL_COAL_TODAY";
              const data = kpiMetrics[kpiKey] || kpiMetrics["TOTAL_COAL_TODAY"];

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{data.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                        data.changePct >= 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {data.changePct >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(data.changePct)}%
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white font-mono">
                    {data.value.toLocaleString()} <span className="text-xs font-normal text-slate-400">{data.unit}</span>
                  </div>

                  {/* Sparkline Visual */}
                  <div className="h-8 flex items-end gap-1 pt-1">
                    {data.sparkline.map((val, idx) => {
                      const min = Math.min(...data.sparkline);
                      const max = Math.max(...data.sparkline);
                      const h = max === min ? 50 : ((val - min) / (max - min)) * 80 + 20;

                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-amber-500/40 hover:bg-amber-400 rounded-t transition-all"
                          style={{ height: `${h}%` }}
                          title={`Value: ${val}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-2">
                    <span>Target: {data.target.toLocaleString()} {data.unit}</span>
                    <span className="text-emerald-400 font-bold">✓ ON TRACK</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 7. TABLE WIDGET */}
        {widget.category === "TABLE" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Cari armada / operator / pit..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Menampilkan 8 Baris
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Unit & Model</th>
                    <th className="p-2.5">Tipe</th>
                    <th className="p-2.5">Operator</th>
                    <th className="p-2.5">Lokasi Pit</th>
                    <th className="p-2.5 text-right">PA / UA</th>
                    <th className="p-2.5 text-right">Fuel Burn</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {mapFleet
                    .filter(
                      (u) =>
                        !tableSearch ||
                        u.equipmentId.toLowerCase().includes(tableSearch.toLowerCase()) ||
                        u.operator.toLowerCase().includes(tableSearch.toLowerCase()) ||
                        u.locationPit.toLowerCase().includes(tableSearch.toLowerCase())
                    )
                    .slice(0, widget.config.tableLimit || 8)
                    .map((u) => (
                      <tr key={u.equipmentId} className="hover:bg-slate-800/40 transition">
                        <td className="p-2.5 font-sans font-bold text-white">
                          {u.equipmentId} <span className="text-slate-500 font-mono text-[10px]">({u.model})</span>
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-400">{u.type}</td>
                        <td className="p-2.5 font-sans text-slate-300">{u.operator}</td>
                        <td className="p-2.5 font-sans text-amber-300">{u.locationPit}</td>
                        <td className="p-2.5 text-right text-emerald-400">{u.paPercent}% / {u.uaPercent}%</td>
                        <td className="p-2.5 text-right text-rose-400">{u.fuelBurnLph} L/h</td>
                        <td className="p-2.5 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === "OPERATING"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. AI INSIGHT WIDGET */}
        {widget.category === "AI_INSIGHT" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Gemini Mining Real-Time Prescriptive Intelligence
                </span>
              </div>

              <button
                onClick={handleRegenerateAI}
                disabled={isAiGenerating}
                className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "Menganalisis..." : "Generate Ulang AI"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiInsights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        ins.severity === "CRITICAL_ALERT"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : ins.severity === "OPTIMIZATION"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {ins.severity.replace("_", " ")}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{ins.timestamp}</span>
                  </div>

                  <h5 className="text-xs font-bold text-white leading-snug">{ins.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ins.summary}</p>

                  <div className="p-2 bg-purple-500/5 rounded-xl border border-purple-500/20 text-[10px] text-purple-300 space-y-0.5">
                    <strong>Tindakan Rekomendasi:</strong>
                    <div>{ins.prescriptiveAction}</div>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-bold">
                    🚀 {ins.impactPotential}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
