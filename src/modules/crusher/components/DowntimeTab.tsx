import React, { useState } from "react";
import {
  Clock,
  Wrench,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import { ProcessingDowntime, ProcessingPlant, ProcessingDowntimeCategory } from "../../../types/processingPlantTypes";

interface DowntimeTabProps {
  downtimes: ProcessingDowntime[];
  plants: ProcessingPlant[];
  onAddDowntime: (newDowntime: Partial<ProcessingDowntime>) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const DowntimeTab: React.FC<DowntimeTabProps> = ({
  downtimes,
  plants,
  onAddDowntime,
  onOpenAiAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    plantId: "CP-01",
    equipmentName: "Secondary Roll Crusher 102",
    category: "Material Blockage" as ProcessingDowntimeCategory,
    reason: "Oversized tramp rock trapped in feeder chute",
    subReason: "Manual hydraulic breaker intervention required",
    duration: 1.2,
    planned: false,
    impact: "CP-01 line stopped for 1.2 hours",
    shift: "SHIFT_1_DAY",
    workOrderId: "WO-CP01-8890",
  });

  const filteredDowntimes = downtimes.filter((d) => {
    const matchesSearch =
      d.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.downtimeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalDowntimeHours = downtimes.reduce((sum, d) => sum + d.duration, 0);
  const plannedHours = downtimes.filter((d) => d.planned).reduce((sum, d) => sum + d.duration, 0);
  const unplannedHours = downtimes.filter((d) => !d.planned).reduce((sum, d) => sum + d.duration, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDowntime({
      ...formData,
      equipmentId: "CR-102",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + formData.duration * 3600 * 1000).toISOString(),
      status: "RESOLVED",
      operatorId: "OP-USER",
      maintenanceId: "WO-REF-100",
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            Processing Downtime & Plant Interruption Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track planned vs unplanned downtime, equipment breakdowns, MTBF and MTTR metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiAnalysis("Apa penyebab utama downtime dan rekomendasi penurunan MTTR?")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            AI Root Cause Downtime
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Downtime Event
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Total Downtime Logged</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalDowntimeHours.toFixed(1)} <span className="text-xs font-normal text-slate-500">Hours</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Across 3 Plant Units
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Unplanned Breakdown</span>
          <div className="text-2xl font-bold text-rose-500 mt-1">
            {unplannedHours.toFixed(1)} <span className="text-xs font-normal text-slate-500">Hours</span>
          </div>
          <span className="text-[11px] text-rose-400 mt-1 block">
            Immediate Root Cause Focus
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">MTBF (Mean Time Between Failures)</span>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            48.5 <span className="text-xs font-normal text-slate-500">Hours</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            +6.2% Reliability
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">MTTR (Mean Time To Repair)</span>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            0.85 <span className="text-xs font-normal text-slate-500">Hours</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Average Repair Duration
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reason, equipment, WO ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Downtime Categories</option>
            <option value="Material Blockage">Material Blockage</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Power Failure">Power Failure</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Equipment Failure">Equipment Failure</option>
          </select>
        </div>
      </div>

      {/* Downtime Event Table */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Downtime & Interruption Events ({filteredDowntimes.length})
          </h4>
          <span className="text-xs text-slate-400">Linked to Work Orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Downtime ID</th>
                <th className="p-3">Equipment</th>
                <th className="p-3">Category</th>
                <th className="p-3">Root Reason</th>
                <th className="p-3 text-right">Duration (Hours)</th>
                <th className="p-3">Type</th>
                <th className="p-3">Work Order</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredDowntimes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-mono font-bold text-rose-500">
                    {d.downtimeId}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {d.equipmentName}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {d.category}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 max-w-xs">
                    <div>{d.reason}</div>
                    <div className="text-[11px] text-slate-400 italic">{d.impact}</div>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {d.duration} hrs
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.planned
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}
                    >
                      {d.planned ? "PLANNED" : "UNPLANNED"}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400">
                    {d.workOrderId}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Downtime Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                Record Downtime / Interruption Event
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
                    Equipment / Line
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Downtime Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProcessingDowntimeCategory })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Material Blockage">Material Blockage</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Power Failure">Power Failure</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Operational Delay">Operational Delay</option>
                    <option value="Feed Shortage">Feed Shortage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Planning Type
                  </label>
                  <select
                    value={formData.planned ? "PLANNED" : "UNPLANNED"}
                    onChange={(e) => setFormData({ ...formData, planned: e.target.value === "PLANNED" })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="UNPLANNED">Unplanned Interruption</option>
                    <option value="PLANNED">Scheduled Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Root Cause Reason
                </label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Impact Description
                </label>
                <input
                  type="text"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm"
                >
                  Save Downtime Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
