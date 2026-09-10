import React, { useState } from "react";
import {
  FlaskConical,
  Gauge,
  Sliders,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  ArrowRight,
  Layers,
  BarChart3,
  Scale,
  RefreshCw,
} from "lucide-react";
import {
  ProductSizeDistribution,
  ProcessingPlant,
  SizeFractionItem,
} from "../../../types/processingPlantTypes";

interface ProductSizeMonitoringTabProps {
  psdList: ProductSizeDistribution[];
  plants: ProcessingPlant[];
  onAddPSDSample: (sample: Partial<ProductSizeDistribution>) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const ProductSizeMonitoringTab: React.FC<ProductSizeMonitoringTabProps> = ({
  psdList,
  plants,
  onAddPSDSample,
  onOpenAiAnalysis,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>("CP-01");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Sample Form State
  const [newNominalTopSize, setNewNominalTopSize] = useState<number>(50);
  const [newActualTopSize, setNewActualTopSize] = useState<number>(48.5);
  const [newCss, setNewCss] = useState<number>(45);
  const [newNutPercent, setNewNutPercent] = useState<number>(42);
  const [newFinesPercent, setNewFinesPercent] = useState<number>(48);
  const [newUltraFines, setNewUltraFines] = useState<number>(8);
  const [newSamplePoint, setNewSamplePoint] = useState<
    "CRUSHER_DISCHARGE" | "SCREEN_UNDERSIZE" | "PRODUCT_CONVEYOR" | "STOCKPILE_DISCHARGE"
  >("PRODUCT_CONVEYOR");
  const [newNotes, setNewNotes] = useState<string>("");

  const activePsd =
    psdList.find((p) => p.plantId === selectedPlantId) || psdList[0];
  const activePlant =
    plants.find((p) => p.plantId === selectedPlantId) || plants[0];

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const lump = Math.max(0, 100 - (newNutPercent + newFinesPercent));
    const compliance =
      newActualTopSize <= newNominalTopSize
        ? "COMPLIANT"
        : newActualTopSize <= newNominalTopSize + 3
        ? "BORDERLINE"
        : "OUT_OF_SPEC";

    onAddPSDSample({
      plantId: selectedPlantId,
      sampleTime: new Date().toISOString().slice(0, 16).replace("T", " "),
      samplePoint: newSamplePoint,
      nominalTopSizeMM: newNominalTopSize,
      actualTopSizeMM: newActualTopSize,
      closedSideSettingCSS: newCss,
      lumpPercent50to100mm: lump,
      nutPercent25to50mm: newNutPercent,
      finesPercent0to25mm: newFinesPercent,
      ultraFinesBelow2mmPercent: newUltraFines,
      oversizeRecirculationRateTph: Math.round(newActualTopSize * 1.5),
      screeningEfficiencyPercent: 92.5,
      sizeComplianceStatus: compliance,
      operatorNotes: newNotes || "QC laboratory sieve sample logged via Plant Management console.",
      sieveFractions: [
        { meshSizeMM: 100, fractionLabel: "+100 mm (Boulders)", passingPercent: 100.0, retainedPercent: 0.0, specMinPercent: 100, specMaxPercent: 100, status: "NORMAL" },
        { meshSizeMM: 50, fractionLabel: "+50 mm (Top Oversize)", passingPercent: 100 - lump, retainedPercent: lump, specMinPercent: 98, specMaxPercent: 100, status: lump > 2 ? "HIGH" : "NORMAL" },
        { meshSizeMM: 31.5, fractionLabel: "31.5 - 50 mm (Nut)", passingPercent: 100 - lump - (newNutPercent * 0.5), retainedPercent: newNutPercent * 0.5, specMinPercent: 70, specMaxPercent: 85, status: "NORMAL" },
        { meshSizeMM: 25, fractionLabel: "25 - 31.5 mm (Mid Nut)", passingPercent: newFinesPercent, retainedPercent: newNutPercent * 0.5, specMinPercent: 50, specMaxPercent: 65, status: "NORMAL" },
        { meshSizeMM: 10, fractionLabel: "10 - 25 mm (Fines)", passingPercent: newFinesPercent * 0.6, retainedPercent: newFinesPercent * 0.4, specMinPercent: 25, specMaxPercent: 40, status: "NORMAL" },
        { meshSizeMM: 2, fractionLabel: "< 2 mm (Ultrafines)", passingPercent: newUltraFines, retainedPercent: newFinesPercent * 0.6 - newUltraFines, specMinPercent: 4, specMaxPercent: 10, status: newUltraFines > 10 ? "HIGH" : "NORMAL" },
      ],
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            Product Size Distribution & Sieve Analysis (PSD)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time particle sizing curves, screening separation efficiency, and Closed Side Setting (CSS) calibration
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Plant Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {plants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => setSelectedPlantId(plant.plantId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  plant.plantId === selectedPlantId
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {plant.plantCode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sieve Sample</span>
          </button>
        </div>
      </div>

      {/* Top Sizing Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Nominal Top Size</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activePsd.actualTopSizeMM} <span className="text-xs font-normal text-slate-500">mm</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Spec Max: {activePsd.nominalTopSizeMM} mm</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                activePsd.sizeComplianceStatus === "COMPLIANT"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {activePsd.sizeComplianceStatus}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Closed Side Setting (CSS)</span>
            <Sliders className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activePsd.closedSideSettingCSS} <span className="text-xs font-normal text-slate-500">mm</span>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Secondary Roll Sizer Hydraulic Gap
          </p>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Screening Separation Efficiency</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activePsd.screeningEfficiencyPercent}%
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Oversize Recirculation: {activePsd.oversizeRecirculationRateTph} t/h
          </p>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ultrafines / Dust Generation</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activePsd.ultraFinesBelow2mmPercent}% <span className="text-xs font-normal text-slate-500">(&lt; 2mm)</span>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Spec Limit: Max 10.0% Dust Fraction
          </p>
        </div>
      </div>

      {/* Sieve Fraction Analysis Curve & Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Sieve Fraction Data Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Sieve Analysis Mesh Fractions & Passing Percentage Curve
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sample taken at {activePsd.samplePoint.replace(/_/g, " ")} • {activePsd.sampleTime}
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Plant: {activePlant?.plantName}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Sieve Mesh (mm)</th>
                  <th className="py-2.5 px-3">Fraction Label</th>
                  <th className="py-2.5 px-3 text-right">Retained %</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Passing %</th>
                  <th className="py-2.5 px-3 text-center">Spec Range %</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {activePsd.sieveFractions.map((fraction, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {fraction.meshSizeMM} mm
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {fraction.fractionLabel}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                      {fraction.retainedPercent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {fraction.passingPercent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                      {fraction.specMinPercent}% – {fraction.specMaxPercent}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          fraction.status === "NORMAL"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        }`}
                      >
                        {fraction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">QC Inspector Notes:</span>
            <p className="text-slate-500 dark:text-slate-400 italic">
              "{activePsd.operatorNotes}"
            </p>
          </div>
        </div>

        {/* Right 1 Col: Visual Particle Size Fraction Breakdown Bar & AI Insight */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Product Size Fractions Mix
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Nut Coal (25 – 50 mm):</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{activePsd.nutPercent25to50mm}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${activePsd.nutPercent25to50mm}%` }} className="h-full bg-indigo-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Coarse Fines (2 – 25 mm):</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {(activePsd.finesPercent0to25mm - activePsd.ultraFinesBelow2mmPercent).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${activePsd.finesPercent0to25mm - activePsd.ultraFinesBelow2mmPercent}%` }}
                    className="h-full bg-cyan-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Ultrafines (&lt; 2 mm):</span>
                  <span className="font-bold text-amber-500">{activePsd.ultraFinesBelow2mmPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${activePsd.ultraFinesBelow2mmPercent}%` }} className="h-full bg-amber-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Top Oversize (&gt; 50 mm):</span>
                  <span className="font-bold text-rose-500">{activePsd.lumpPercent50to100mm}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${Math.max(2, activePsd.lumpPercent50to100mm * 10)}%` }} className="h-full bg-rose-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Crusher CSS Recommendation */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 text-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold text-indigo-200">AI Crusher Gap Optimization</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Current CSS at {activePsd.closedSideSettingCSS}mm produces optimal 99.5% passing 50mm. To reduce ultrafines from {activePsd.ultraFinesBelow2mmPercent}% to &lt;6%, AI recommends slightly opening the roll gap by +2mm (CSS 47mm) without violating contract top size.
            </p>
            <button
              onClick={() => onOpenAiAnalysis(`Analisis optimasi roll gap CSS untuk meminimalkan fine coal <2mm pada plant ${activePlant?.plantName}`)}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center cursor-pointer"
            >
              Ask AI Sizing Advisor →
            </button>
          </div>
        </div>
      </div>

      {/* Historical PSD Log Records */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Historical Sieve Quality Log (All Processing Plants)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Sample ID</th>
                <th className="py-2.5 px-3">Plant</th>
                <th className="py-2.5 px-3">Sample Point</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Top Size</th>
                <th className="py-2.5 px-3 text-right">CSS Gap</th>
                <th className="py-2.5 px-3 text-right">Nut %</th>
                <th className="py-2.5 px-3 text-right">Fines %</th>
                <th className="py-2.5 px-3 text-right">Ultrafines</th>
                <th className="py-2.5 px-3 text-center">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {psdList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {item.plantId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {item.samplePoint.replace(/_/g, " ")}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">
                    {item.sampleTime}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {item.actualTopSizeMM} mm
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {item.closedSideSettingCSS} mm
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                    {item.nutPercent25to50mm}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-cyan-600 dark:text-cyan-400">
                    {item.finesPercent0to25mm}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-500">
                    {item.ultraFinesBelow2mmPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.sizeComplianceStatus === "COMPLIANT"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {item.sizeComplianceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sieve Sample Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-indigo-500" />
                Record New Sieve Particle Size Sample
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Processing Plant</label>
                  <select
                    value={selectedPlantId}
                    onChange={(e) => setSelectedPlantId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {plants.map((p) => (
                      <option key={p.id} value={p.plantId}>
                        {p.plantCode} - {p.plantName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Sample Point</label>
                  <select
                    value={newSamplePoint}
                    onChange={(e) => setNewSamplePoint(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="PRODUCT_CONVEYOR">Product Conveyor</option>
                    <option value="CRUSHER_DISCHARGE">Crusher Discharge</option>
                    <option value="SCREEN_UNDERSIZE">Screen Undersize</option>
                    <option value="STOCKPILE_DISCHARGE">Stockpile Discharge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Nominal Top (mm)</label>
                  <input
                    type="number"
                    value={newNominalTopSize}
                    onChange={(e) => setNewNominalTopSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Actual Top (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newActualTopSize}
                    onChange={(e) => setNewActualTopSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">CSS Gap (mm)</label>
                  <input
                    type="number"
                    value={newCss}
                    onChange={(e) => setNewCss(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Nut (25-50mm) %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newNutPercent}
                    onChange={(e) => setNewNutPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Fines (0-25mm) %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFinesPercent}
                    onChange={(e) => setNewFinesPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Ultrafines &lt;2mm %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newUltraFines}
                    onChange={(e) => setNewUltraFines(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">QC Laboratory Comments</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on screening efficiency, moisture effect, roll liner condition..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-18 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Sieve Assay Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
