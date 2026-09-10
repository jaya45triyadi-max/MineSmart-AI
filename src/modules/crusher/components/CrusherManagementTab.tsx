import React, { useState } from "react";
import {
  Wrench,
  Factory,
  Plus,
  Play,
  Pause,
  Clock,
  Gauge,
  Activity,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Crusher, ProcessingPlant, CrusherType, CrusherStatus } from "../../../types/processingPlantTypes";

interface CrusherManagementTabProps {
  crushers: Crusher[];
  plants: ProcessingPlant[];
  onAddCrusher: (newCrusher: Partial<Crusher>) => void;
  onUpdateStatus: (crusherId: string, status: CrusherStatus) => void;
  onOpenAiAnalysis: (prompt?: string) => void;
}

export const CrusherManagementTab: React.FC<CrusherManagementTabProps> = ({
  crushers,
  plants,
  onAddCrusher,
  onUpdateStatus,
  onOpenAiAnalysis,
}) => {
  const [selectedPlantFilter, setSelectedPlantFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    plantId: "CP-01",
    crusherCode: "CR-103",
    crusherName: "Tertiary Cone Crusher 103",
    crusherType: "Cone Crusher" as CrusherType,
    manufacturer: "Metso Outotec",
    model: "HP400",
    designCapacity: 800,
    capacityUnit: "t/h",
    location: "CP-01 Secondary Loop",
    criticality: "HIGH" as "HIGH",
  });

  const filteredCrushers = crushers.filter(
    (c) => selectedPlantFilter === "ALL" || c.plantId === selectedPlantFilter
  );

  const getStatusBadge = (status: CrusherStatus) => {
    switch (status) {
      case "RUNNING":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "STOPPED":
      case "IDLE":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "MAINTENANCE":
      case "BREAKDOWN":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "STANDBY":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCrusher({
      ...formData,
      status: "RUNNING",
      engineHour: 100,
      operatingHour: 90,
      currentThroughput: formData.designCapacity * 0.9,
      availability: 95.0,
      utilization: 88.0,
      efficiency: 92.0,
      installationDate: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-indigo-500" />
            Crusher Fleet & Processing Equipment Management
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor primary, secondary, tertiary crushers, sizers, roll crushers, jaw crushers, and cones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPlantFilter}
            onChange={(e) => setSelectedPlantFilter(e.target.value)}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
          >
            <option value="ALL">All Processing Plants</option>
            {plants.map((p) => (
              <option key={p.plantId} value={p.plantId}>
                {p.plantCode} - {p.plantName}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Crusher
          </button>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrushers.map((crusher) => (
          <div
            key={crusher.id}
            className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {crusher.crusherCode} • {crusher.crusherType}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {crusher.crusherName}
                </h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                  crusher.status
                )}`}
              >
                ● {crusher.status}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div>Manufacturer: <strong className="text-slate-800 dark:text-slate-200">{crusher.manufacturer} ({crusher.model})</strong></div>
              <div>Location: {crusher.location}</div>
            </div>

            {/* Performance KPI Box */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Design Capacity</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {crusher.designCapacity} {crusher.capacityUnit}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Live Throughput</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {crusher.currentThroughput} {crusher.capacityUnit}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Availability (PA)</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {crusher.availability}%
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Utilization (UA)</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {crusher.utilization}%
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Engine Hours: <strong className="text-slate-800 dark:text-slate-200">{crusher.engineHour.toLocaleString()} hrs</strong></span>
              <span>Operating: <strong className="text-slate-800 dark:text-slate-200">{crusher.operatingHour.toLocaleString()} hrs</strong></span>
            </div>

            {/* Quick Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateStatus(crusher.crusherId, "RUNNING")}
                  className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    crusher.status === "RUNNING"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-emerald-500"
                  }`}
                  title="Set RUNNING"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateStatus(crusher.crusherId, "STANDBY")}
                  className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    crusher.status === "STANDBY"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-blue-500"
                  }`}
                  title="Set STANDBY"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateStatus(crusher.crusherId, "MAINTENANCE")}
                  className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    crusher.status === "MAINTENANCE"
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-500"
                  }`}
                  title="Set MAINTENANCE"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() =>
                  onOpenAiAnalysis(`Analisis wear rate dan prediksi kegagalan komponen crusher ${crusher.crusherName}`)
                }
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                AI Predict
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Crusher */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Factory className="w-5 h-5 text-indigo-500" />
                Add New Crusher Equipment
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
                    Processing Plant
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
                    Crusher Equipment Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.crusherCode}
                    onChange={(e) => setFormData({ ...formData, crusherCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Crusher Equipment Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.crusherName}
                  onChange={(e) => setFormData({ ...formData, crusherName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Crusher Type
                  </label>
                  <select
                    value={formData.crusherType}
                    onChange={(e) => setFormData({ ...formData, crusherType: e.target.value as CrusherType })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Primary Crusher">Primary Crusher</option>
                    <option value="Secondary Crusher">Secondary Crusher</option>
                    <option value="Tertiary Crusher">Tertiary Crusher</option>
                    <option value="Sizer">Sizer</option>
                    <option value="Roll Crusher">Roll Crusher</option>
                    <option value="Jaw Crusher">Jaw Crusher</option>
                    <option value="Cone Crusher">Cone Crusher</option>
                    <option value="Impact Crusher">Impact Crusher</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Design Capacity (t/h)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.designCapacity}
                    onChange={(e) => setFormData({ ...formData, designCapacity: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
