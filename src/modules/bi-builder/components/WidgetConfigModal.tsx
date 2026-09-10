// MINE SMART AI - BI Dashboard Builder Widget Config Modal
import React, { useState, useEffect } from "react";
import { X, Settings, Check, Sliders, Sparkles, Layers } from "lucide-react";
import {
  CustomBIWidget,
  ChartRenderType,
  WidgetCategory,
} from "../../../types/biBuilderTypes";

interface WidgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: CustomBIWidget | null;
  onSaveConfig: (updatedWidget: CustomBIWidget) => void;
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({
  isOpen,
  onClose,
  widget,
  onSaveConfig,
}) => {
  const [title, setTitle] = useState<string>("");
  const [chartType, setChartType] = useState<ChartRenderType>("BAR");
  const [metricKey, setMetricKey] = useState<string>("TOTAL_COAL_TODAY");
  const [timeRange, setTimeRange] = useState<string>("TODAY");
  const [colorTheme, setColorTheme] = useState<string>("amber");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [aiFocusPrompt, setAiFocusPrompt] = useState<string>("");

  useEffect(() => {
    if (widget) {
      setTitle(widget.title || "");
      setChartType(widget.config.chartType || "BAR");
      setMetricKey(widget.config.metricKey || "TOTAL_COAL_TODAY");
      setTimeRange(widget.config.timeRange || "TODAY");
      setColorTheme(widget.config.colorTheme || "amber");
      setCustomDescription(widget.customDescription || "");
      setAiFocusPrompt(widget.config.aiFocusPrompt || "");
    }
  }, [widget]);

  if (!isOpen || !widget) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomBIWidget = {
      ...widget,
      title,
      customDescription,
      config: {
        ...widget.config,
        chartType,
        metricKey,
        timeRange: timeRange as any,
        colorTheme: colorTheme as any,
        aiFocusPrompt,
      },
    };
    onSaveConfig(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Konfigurasi Widget BI</h3>
              <p className="text-xs text-slate-400">
                Kategori: <span className="font-mono text-amber-400 font-bold">{widget.category}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Judul Widget</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Chart Type (if applicable) */}
          {(widget.category === "PRODUCTION" ||
            widget.category === "FLEET" ||
            widget.category === "FUEL" ||
            widget.category === "COST") && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Tipe Visualisasi / Grafik</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartRenderType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="BAR">Bar Chart (Batang)</option>
                <option value="AREA">Area Chart (Gradien Area)</option>
                <option value="LINE">Line Chart (Garis Tren)</option>
                <option value="DONUT">Donut / Pie Chart (Proporsi)</option>
                <option value="GAUGE">Gauge / Meter Indikator</option>
              </select>
            </div>
          )}

          {/* Metric Selector (for KPI) */}
          {widget.category === "KPI" && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Pilihan Metrik Tambang</label>
              <select
                value={metricKey}
                onChange={(e) => setMetricKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="TOTAL_COAL_TODAY">Total Coal Production (MT)</option>
                <option value="OB_VOLUME_TODAY">Overburden Volume (BCM)</option>
                <option value="FLEET_PA">Physical Availability PA (%)</option>
                <option value="COST_PER_TON">Mining Cost Per Ton ($/MT)</option>
                <option value="ACTIVE_HAULERS">Active Haulers Count (Unit)</option>
                <option value="CYCLE_TIME">Average Cycle Time (Minutes)</option>
                <option value="EXCAVATOR_PROD">Excavator Productivity (BCM/Hr)</option>
                <option value="FUEL_RATIO">Fuel Ratio (L/BCM)</option>
                <option value="FUEL_TODAY">Total Fuel Burn Today (Liters)</option>
                <option value="COST_PER_BCM">Cost Per BCM ($/BCM)</option>
                <option value="FUEL_FARM_LEVEL">Fuel Farm Storage Level (%)</option>
              </select>
            </div>
          )}

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Rentang Waktu Data</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="SHIFT">Current Shift (Shift 1/2)</option>
                <option value="TODAY">Hari Ini (24 Jam)</option>
                <option value="7D">7 Hari Terakhir</option>
                <option value="30D">30 Hari Terakhir</option>
                <option value="MTD">Month to Date (MTD)</option>
                <option value="YTD">Year to Date (YTD)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Aksen Warna Tema</label>
              <select
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="amber">Amber Gold</option>
                <option value="emerald">Emerald Green</option>
                <option value="blue">Electric Blue</option>
                <option value="purple">Cosmic Purple</option>
                <option value="rose">Rose Red</option>
                <option value="cyan">Cyan Teal</option>
              </select>
            </div>
          </div>

          {/* AI Focus Prompt (for AI Insight) */}
          {widget.category === "AI_INSIGHT" && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Prompt Fokus Analisis Gemini AI
              </label>
              <textarea
                value={aiFocusPrompt}
                onChange={(e) => setAiFocusPrompt(e.target.value)}
                rows={2}
                placeholder="Contoh: Analisis anomali konsumsi BBM dan antrean excavator di Pit North..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none text-[11px]"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-300 block mb-1">Catatan Keterangan Tambahan</label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Keterangan singkat sumber data atau instruksi operasional..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
