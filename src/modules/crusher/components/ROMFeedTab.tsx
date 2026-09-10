import React, { useState } from "react";
import {
  Flame,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  User,
  Truck,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { ROMFeed, ProcessingPlant } from "../../../types/processingPlantTypes";

interface ROMFeedTabProps {
  feeds: ROMFeed[];
  plants: ProcessingPlant[];
  onAddFeed: (newFeed: Partial<ROMFeed>) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const ROMFeedTab: React.FC<ROMFeedTabProps> = ({
  feeds,
  plants,
  onAddFeed,
  onOpenAiAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal Form State
  const [formData, setFormData] = useState({
    plantId: "CP-01",
    sourceLocation: "Pit 1 North Seam A",
    stockpileId: "SP-ROM-01",
    stockpileName: "ROM Stockpile A",
    materialType: "Coal High Grade (5,200 GAR)",
    quantity: 5000,
    unit: "Ton",
    operatingHours: 4.0,
    quality: "CV: 5,200 GAR, Ash: 6.5%, TM: 26.0%",
    shift: "SHIFT_1_DAY",
    operatorName: "Bambang Widodo",
    equipmentCode: "EX-101",
  });

  const filteredFeeds = feeds.filter((f) => {
    const matchesSearch =
      f.sourceLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.feedId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === "ALL" || f.sourceLocation.includes(selectedSource);
    return matchesSearch && matchesSource;
  });

  const calculatedFeedRate = formData.operatingHours > 0 ? Math.round(formData.quantity / formData.operatingHours) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFeed({
      ...formData,
      feedRate: calculatedFeedRate,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      status: "PROCESSING",
      operatorId: "OP-USER",
      equipmentId: formData.equipmentCode,
    });
    setIsAddModalOpen(false);
  };

  const totalFeedToday = feeds.reduce((sum, f) => sum + f.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            ROM Feed Management & Source Monitoring
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track ROM stock, dump rate, material grades, hauling origin, and crusher feed rate
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiAnalysis("Analisis optimasi blend ROM feed untuk menjaga kalori GAR 5,200")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Blend AI Optimizer
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record ROM Feed
          </button>
        </div>
      </div>

      {/* Feed Rate & Source Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Total ROM Feed Logged Today</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalFeedToday.toLocaleString()} <span className="text-xs font-normal text-slate-500">Ton</span>
          </div>
          <span className="text-[11px] text-emerald-500 mt-1 block">Active Shift 1 Data</span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Feed Rate Formula</span>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            Feed Rate = Quantity / Operating Time
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Excludes downtime operating hours
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Primary Feed Origin</span>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            Pit 1 North Seam A (54%)
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Direct Haul & ROM Stockpile
          </span>
        </div>

        <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Average Feed Quality</span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            GAR 5,180 kcal/kg
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            TM: 26.5%, Ash: 7.2%
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ROM source, grade, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Source Locations</option>
            <option value="Pit 1">Pit 1 North</option>
            <option value="Stockpile">ROM Stockpile</option>
            <option value="Direct">Direct Hauling</option>
          </select>
        </div>
      </div>

      {/* ROM Feed Table */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            ROM Feed Logged Entries ({filteredFeeds.length})
          </h4>
          <span className="text-xs text-slate-400">Shift 1 & 2 Live Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <th className="p-3">Feed ID</th>
                <th className="p-3">Source Location</th>
                <th className="p-3">Material Grade</th>
                <th className="p-3 text-right">Quantity (Ton)</th>
                <th className="p-3 text-right">Feed Rate (t/h)</th>
                <th className="p-3">Assay Quality</th>
                <th className="p-3">Equipment / Truck</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredFeeds.map((feed) => (
                <tr key={feed.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {feed.feedId}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {feed.sourceLocation}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {feed.materialType}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {feed.quantity.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {feed.feedRate} t/h
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {feed.quality}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {feed.equipmentCode}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {feed.operatorName}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {new Date(feed.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        feed.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      {feed.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add ROM Feed Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Record New ROM Feed Input
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
                    Target Processing Plant
                  </label>
                  <select
                    value={formData.plantId}
                    onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {plants.map((p) => (
                      <option key={p.plantId} value={p.plantId}>
                        {p.plantCode} - {p.plantName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Feed Source Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sourceLocation}
                    onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Feed Quantity (Ton)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Hours (h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0.1"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Calculated Feed Rate Badge */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 dark:text-indigo-300 font-medium">Calculated Feed Rate:</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                  {calculatedFeedRate} t/h
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Coal Material Grade
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.materialType}
                    onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Equipment / Excavator
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentCode}
                    onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quality Description
                </label>
                <input
                  type="text"
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Save Feed Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
