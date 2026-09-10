import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  BarChart3,
  TrendingUp,
  Plus,
  Filter,
  Search,
  Sparkles,
  Flame,
} from "lucide-react";
import { ProcessingOutput, ProcessingQualitySample, QualityParameter, QualityStatus } from "../../../types/processingPlantTypes";

interface OutputQualityTabProps {
  outputs: ProcessingOutput[];
  samples: ProcessingQualitySample[];
  onAddSample: (newSample: Partial<ProcessingQualitySample>) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const OutputQualityTab: React.FC<OutputQualityTabProps> = ({
  outputs,
  samples,
  onAddSample,
  onOpenAiAnalysis,
}) => {
  const [selectedParamFilter, setSelectedParamFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    plantId: "CP-01",
    stockpileName: "Product Stockpile 1A",
    productName: "Crushed Coal GAR 5,200",
    parameter: "Ash" as QualityParameter,
    value: 6.8,
    unit: "%",
    minSpec: 5.0,
    maxSpec: 8.5,
    target: 6.5,
    laboratory: "Internal Mine Site Lab BBNU",
  });

  const filteredSamples = samples.filter(
    (s) => selectedParamFilter === "ALL" || s.parameter === selectedParamFilter
  );

  const totalProductQty = outputs.reduce((sum, o) => sum + (o.productType !== "Reject" && o.productType !== "Waste" ? o.quantity : 0), 0);
  const totalRejectQty = outputs.reduce((sum, o) => sum + (o.productType === "Reject" || o.productType === "Waste" ? o.quantity : 0), 0);

  const calculatedYield = Math.round((totalProductQty / ((totalProductQty + totalRejectQty) || 1)) * 1000) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isOut = formData.value > formData.maxSpec || formData.value < formData.minSpec;
    const isWarn = Math.abs(formData.value - formData.target) > (formData.maxSpec - formData.minSpec) * 0.35;
    const statusVal: QualityStatus = isOut ? "OUT_OF_SPEC" : isWarn ? "WARNING" : "PASS";

    onAddSample({
      ...formData,
      sampleId: `QS-${Date.now().toString().slice(-4)}`,
      stockpileId: "SP-PROD-01",
      productId: "PROD-01",
      sampleDate: new Date().toISOString().split("T")[0],
      sampleTime: new Date().toLocaleTimeString(),
      shift: "SHIFT_1_DAY",
      sampleType: "Automatic Belt Sampler",
      status: statusVal,
      source: "Conveyor Discharge",
    });
    setIsAddModalOpen(false);
  };

  const getQualityBadge = (status: QualityStatus) => {
    switch (status) {
      case "PASS":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "WARNING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "OUT_OF_SPEC":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            Product Output, Yield & Quality Assay Control
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor product yield, recovery, coal calorific value (CV), moisture, ash, sulfur, and specification compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiAnalysis("Evaluasi tren kualitas CV dan Ash coal minggu ini")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quality Trend AI
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Lab Assay Sample
          </button>
        </div>
      </div>

      {/* Yield & Recovery Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Total Product Output</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalProductQty.toLocaleString()} <span className="text-xs font-normal text-slate-500">Ton</span>
          </div>
          <span className="text-[11px] text-emerald-500 mt-1 block">Crushed, Clean & Sized</span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Plant Yield Rate</span>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {calculatedYield}%
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Yield = Product Output / ROM Feed × 100
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Washing Plant Recovery</span>
          <div className="text-2xl font-bold text-cyan-500 mt-1">
            84.2%
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Jig Washer Clean Coal Yield
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Out-of-Spec Warning</span>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            1 Sample
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">
            Ash 9.8% on Washed Coal
          </span>
        </div>
      </div>

      {/* Quality Assay Log Table */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-indigo-500" />
            Laboratory Quality Assay Samples
          </h4>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedParamFilter}
              onChange={(e) => setSelectedParamFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Quality Parameters</option>
              <option value="CV">CV (Calorific Value)</option>
              <option value="Total Moisture">Total Moisture</option>
              <option value="Ash">Ash Content</option>
              <option value="Sulfur">Sulfur Content</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Sample ID</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Parameter</th>
                <th className="p-3 text-right">Tested Value</th>
                <th className="p-3 text-right">Spec Range</th>
                <th className="p-3">Stockpile</th>
                <th className="p-3">Laboratory</th>
                <th className="p-3">Sample Time</th>
                <th className="p-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {sample.sampleId}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {sample.productName}
                  </td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    {sample.parameter}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {sample.value} {sample.unit}
                  </td>
                  <td className="p-3 text-right text-slate-500 dark:text-slate-400">
                    {sample.minSpec} – {sample.maxSpec} {sample.unit}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {sample.stockpileName}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {sample.laboratory}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {sample.sampleDate} {sample.sampleTime}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getQualityBadge(
                        sample.status
                      )}`}
                    >
                      {sample.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Quality Sample Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-500" />
                Log Laboratory Quality Assay Sample
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quality Parameter
                  </label>
                  <select
                    value={formData.parameter}
                    onChange={(e) => setFormData({ ...formData, parameter: e.target.value as QualityParameter })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="CV">CV (Calorific Value)</option>
                    <option value="Total Moisture">Total Moisture</option>
                    <option value="Inherent Moisture">Inherent Moisture</option>
                    <option value="Ash">Ash Content</option>
                    <option value="Sulfur">Sulfur Content</option>
                    <option value="Volatile Matter">Volatile Matter</option>
                    <option value="HGI">HGI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tested Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Spec
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.minSpec}
                    onChange={(e) => setFormData({ ...formData, minSpec: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Spec
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.maxSpec}
                    onChange={(e) => setFormData({ ...formData, maxSpec: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stockpile Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stockpileName}
                    onChange={(e) => setFormData({ ...formData, stockpileName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Laboratory
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.laboratory}
                    onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Save Assay Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
