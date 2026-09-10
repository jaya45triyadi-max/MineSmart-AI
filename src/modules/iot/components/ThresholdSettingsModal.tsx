// MINE SMART AI - IoT Sensor Thresholds & Automated Interlock Policy Modal

import React, { useState } from "react";
import {
  Check,
  Cpu,
  Droplet,
  Gauge,
  Layers,
  MapPin,
  Save,
  ShieldCheck,
  Sliders,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { SensorThresholdConfig, SensorCategoryType } from "../../../types/iotTypes";

interface ThresholdSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: SensorThresholdConfig[];
  onSaveThresholds: (updated: SensorThresholdConfig[]) => void;
}

export const ThresholdSettingsModal: React.FC<ThresholdSettingsModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
}) => {
  if (!isOpen) return null;

  const [activeThresholds, setActiveThresholds] = useState<SensorThresholdConfig[]>(thresholds);
  const [activeCategory, setActiveCategory] = useState<SensorCategoryType>("temperature");
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleField = (index: number, field: "autoTriggerWorkOrder" | "autoNotifyDispatcher" | "autoInterlockShutdown") => {
    setActiveThresholds((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: !copy[index][field],
      };
      return copy;
    });
  };

  const handleNumberChange = (index: number, field: "normalMin" | "normalMax" | "criticalMax", val: number) => {
    setActiveThresholds((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: val,
      };
      return copy;
    });
  };

  const handleSave = () => {
    onSaveThresholds(activeThresholds);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const filtered = activeThresholds.filter((t) => t.sensorCategory === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                8-Sensor Threshold & Automated Action Rules
              </h2>
              <p className="text-xs text-slate-400">
                Konfigurasi batas toleransi normal, peringatan kritis, dan trigger aksi otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sensor Category Tabs */}
        <div className="flex items-center gap-1.5 p-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {[
            { key: "temperature", label: "2. Temperature", icon: Thermometer },
            { key: "fuel", label: "1. Fuel", icon: Droplet },
            { key: "pressure", label: "3. Pressure", icon: Gauge },
            { key: "engine", label: "4. Engine", icon: Cpu },
            { key: "gps", label: "5. GPS", icon: MapPin },
            { key: "vibration", label: "6. Vibration", icon: Layers },
            { key: "weight", label: "7. Weight", icon: Sliders },
            { key: "environment", label: "8. Environment", icon: Wind },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as SensorCategoryType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="space-y-3">
            {filtered.map((item) => {
              const globalIndex = activeThresholds.findIndex((t) => t.metricKey === item.metricKey);
              return (
                <div
                  key={item.metricKey}
                  className="p-4 rounded-xl bg-slate-850/80 border border-slate-750 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.metricLabel}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Key: {item.metricKey} • Satuan: {item.unit}
                      </p>
                    </div>
                  </div>

                  {/* Min / Max Inputs */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Normal Min ({item.unit})</label>
                      <input
                        type="number"
                        value={item.normalMin}
                        onChange={(e) => handleNumberChange(globalIndex, "normalMin", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Normal Max ({item.unit})</label>
                      <input
                        type="number"
                        value={item.normalMax}
                        onChange={(e) => handleNumberChange(globalIndex, "normalMax", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-rose-400 block mb-1">Critical Max ({item.unit})</label>
                      <input
                        type="number"
                        value={item.criticalMax || 0}
                        onChange={(e) => handleNumberChange(globalIndex, "criticalMax", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-rose-300 text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Automated Action Toggles */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.autoTriggerWorkOrder}
                        onChange={() => handleToggleField(globalIndex, "autoTriggerWorkOrder")}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                      />
                      <span>Auto-Generate Work Order</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.autoNotifyDispatcher}
                        onChange={() => handleToggleField(globalIndex, "autoNotifyDispatcher")}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                      />
                      <span>Notify Dispatcher & Radio Alert</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.autoInterlockShutdown}
                        onChange={() => handleToggleField(globalIndex, "autoInterlockShutdown")}
                        className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 bg-slate-800"
                      />
                      <span className="text-rose-400 font-semibold">Engine Interlock Shutdown</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Compliant with ESDM 1827/2018 & OEM Engineering Standards
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-900/30 transition-all"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {isSaved ? "Saved!" : "Save Thresholds"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
