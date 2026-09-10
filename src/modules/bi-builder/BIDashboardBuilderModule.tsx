// MINE SMART AI - BI Dashboard Builder Main Module
// Full drag-and-drop custom analytics platform with 8 rich widget categories

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Plus,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  GripVertical,
  CheckCircle2,
  FileCode,
  Download,
  Printer,
  Info,
} from "lucide-react";
import {
  CustomBIDashboard,
  CustomBIWidget,
  WidgetPaletteItem,
  WidgetWidthSpan,
} from "../../types/biBuilderTypes";
import { BIDashboardBuilderService } from "../../services/bi/BIDashboardBuilderService";
import { DashboardHeaderBar } from "./components/DashboardHeaderBar";
import { WidgetPaletteDrawer } from "./components/WidgetPaletteDrawer";
import { WidgetRenderer } from "./components/WidgetRenderer";
import { WidgetConfigModal } from "./components/WidgetConfigModal";
import { NewDashboardModal } from "./components/NewDashboardModal";
import { useAuth } from "../../providers/AuthProvider";

export const BIDashboardBuilderModule: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { activeSite, currentUser } = useAuth();

  // State
  const [dashboards, setDashboards] = useState<CustomBIDashboard[]>(
    BIDashboardBuilderService.getAllDashboards()
  );
  const [currentDashboardId, setCurrentDashboardId] = useState<string>(
    dashboards[0]?.id || "dash-exec-master"
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isNewDashModalOpen, setIsNewDashModalOpen] = useState<boolean>(false);
  const [configTargetWidget, setConfigTargetWidget] = useState<CustomBIWidget | null>(null);
  const [draggedWidgetIndex, setDraggedWidgetIndex] = useState<number | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [jsonExportPayload, setJsonExportPayload] = useState<string | null>(null);

  const catalog = BIDashboardBuilderService.getWidgetCatalog();

  const currentDashboard =
    dashboards.find((d) => d.id === currentDashboardId) || dashboards[0];

  // Auto-refresh interval ticker
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  // Save current dashboard changes
  const updateCurrentDashboard = (updatedWidgets: CustomBIWidget[]) => {
    const updated: CustomBIDashboard = {
      ...currentDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date().toISOString(),
    };
    BIDashboardBuilderService.saveDashboard(updated);
    setDashboards((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  // Add Widget to Dashboard
  const handleAddWidget = (paletteItem: WidgetPaletteItem) => {
    const newWidget: CustomBIWidget = {
      id: `w-${paletteItem.category.toLowerCase()}-${Date.now()}`,
      title: paletteItem.title,
      category: paletteItem.category,
      width: paletteItem.defaultWidth,
      config: { ...paletteItem.defaultConfig },
      customDescription: paletteItem.description,
    };

    const newWidgets = [...currentDashboard.widgets, newWidget];
    updateCurrentDashboard(newWidgets);
  };

  // Update Widget Column Width
  const handleUpdateWidth = (widgetId: string, newWidth: WidgetWidthSpan) => {
    const updated = currentDashboard.widgets.map((w) =>
      w.id === widgetId ? { ...w, width: newWidth } : w
    );
    updateCurrentDashboard(updated);
  };

  // Save Config from Modal
  const handleSaveWidgetConfig = (updatedWidget: CustomBIWidget) => {
    const updated = currentDashboard.widgets.map((w) =>
      w.id === updatedWidget.id ? updatedWidget : w
    );
    updateCurrentDashboard(updated);
    setConfigTargetWidget(null);
  };

  // Duplicate Widget
  const handleDuplicateWidget = (widgetId: string) => {
    const target = currentDashboard.widgets.find((w) => w.id === widgetId);
    if (!target) return;
    const clone: CustomBIWidget = {
      ...target,
      id: `w-${target.category.toLowerCase()}-${Date.now()}`,
      title: `${target.title} (Salinan)`,
    };
    const idx = currentDashboard.widgets.findIndex((w) => w.id === widgetId);
    const updated = [...currentDashboard.widgets];
    updated.splice(idx + 1, 0, clone);
    updateCurrentDashboard(updated);
  };

  // Delete Widget
  const handleDeleteWidget = (widgetId: string) => {
    const updated = currentDashboard.widgets.filter((w) => w.id !== widgetId);
    updateCurrentDashboard(updated);
  };

  // Reordering Drag & Drop handlers on widgets
  const handleDragStartWidget = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedWidgetIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverWidget = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropWidget = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditMode) return;
    e.preventDefault();

    // Check if drop is from palette
    try {
      const paletteData = e.dataTransfer.getData("application/json");
      if (paletteData) {
        const item: WidgetPaletteItem = JSON.parse(paletteData);
        if (item && item.id) {
          const newWidget: CustomBIWidget = {
            id: `w-${item.category.toLowerCase()}-${Date.now()}`,
            title: item.title,
            category: item.category,
            width: item.defaultWidth,
            config: { ...item.defaultConfig },
            customDescription: item.description,
          };
          const updated = [...currentDashboard.widgets];
          updated.splice(dropIndex, 0, newWidget);
          updateCurrentDashboard(updated);
          return;
        }
      }
    } catch (err) {
      console.error("Drop from palette parse error:", err);
    }

    // Drop from reordering existing widget
    if (draggedWidgetIndex === null || draggedWidgetIndex === dropIndex) return;
    const reordered = [...currentDashboard.widgets];
    const [moved] = reordered.splice(draggedWidgetIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    updateCurrentDashboard(reordered);
    setDraggedWidgetIndex(null);
  };

  // Drop at canvas bottom
  const handleCanvasDragOver = (e: React.DragEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    try {
      const paletteData = e.dataTransfer.getData("application/json");
      if (paletteData) {
        const item: WidgetPaletteItem = JSON.parse(paletteData);
        if (item && item.id) {
          handleAddWidget(item);
        }
      }
    } catch (err) {
      console.error("Canvas drop error:", err);
    }
  };

  // Create New Dashboard
  const handleCreateDashboard = (
    title: string,
    description: string,
    templateType: string
  ) => {
    let newWidgets: CustomBIWidget[] = [];
    if (templateType === "EXECUTIVE") {
      newWidgets = [
        {
          id: `w-kpi-1-${Date.now()}`,
          title: "Total Coal Output Today",
          category: "KPI",
          width: 3,
          config: { metricKey: "TOTAL_COAL_TODAY", colorTheme: "amber" },
        },
        {
          id: `w-kpi-2-${Date.now()}`,
          title: "Fleet Physical Availability (PA)",
          category: "KPI",
          width: 3,
          config: { metricKey: "FLEET_PA", colorTheme: "emerald" },
        },
        {
          id: `w-kpi-3-${Date.now()}`,
          title: "Mining Cost Per Ton",
          category: "KPI",
          width: 3,
          config: { metricKey: "COST_PER_TON", colorTheme: "purple" },
        },
        {
          id: `w-kpi-4-${Date.now()}`,
          title: "Fuel Ratio (L/BCM)",
          category: "KPI",
          width: 3,
          config: { metricKey: "FUEL_RATIO", colorTheme: "rose" },
        },
        {
          id: `w-prod-${Date.now()}`,
          title: "Daily Production Trajectory vs Target",
          category: "PRODUCTION",
          width: 8,
          config: { chartType: "AREA", colorTheme: "amber" },
        },
        {
          id: `w-fleet-${Date.now()}`,
          title: "Fleet Operational Status Breakdown",
          category: "FLEET",
          width: 4,
          config: { chartType: "DONUT", colorTheme: "emerald" },
        },
        {
          id: `w-ai-${Date.now()}`,
          title: "Gemini Mining Real-time Intelligence",
          category: "AI_INSIGHT",
          width: 12,
          config: { colorTheme: "purple" },
        },
      ];
    } else if (templateType === "OPERATIONS") {
      newWidgets = [
        {
          id: `w-map-${Date.now()}`,
          title: "Interactive Pit Map & Real-Time Hauler Tracking",
          category: "MAP",
          width: 12,
          config: { mapZoom: 14 },
        },
        {
          id: `w-cycles-${Date.now()}`,
          title: "Haul Cycle Stages Distribution (Minutes)",
          category: "FLEET",
          width: 6,
          config: { chartType: "BAR" },
        },
        {
          id: `w-burn-${Date.now()}`,
          title: "Equipment Burn Rate by Class (L/Hour)",
          category: "FUEL",
          width: 6,
          config: { chartType: "BAR" },
        },
        {
          id: `w-table-${Date.now()}`,
          title: "Shift Operational & Telematics Log",
          category: "TABLE",
          width: 12,
          config: { dataSource: "SHIFT_DISPATCH" },
        },
      ];
    } else if (templateType === "FUEL_COST") {
      newWidgets = [
        {
          id: `w-burn-trend-${Date.now()}`,
          title: "Fuel Stock & Consumption Profile",
          category: "FUEL",
          width: 6,
          config: { chartType: "AREA" },
        },
        {
          id: `w-cost-pie-${Date.now()}`,
          title: "OPEX Cost Breakdown Structure",
          category: "COST",
          width: 6,
          config: { chartType: "DONUT" },
        },
        {
          id: `w-ai-cost-${Date.now()}`,
          title: "AI Fuel Optimization & Saving Insights",
          category: "AI_INSIGHT",
          width: 12,
          config: { colorTheme: "purple" },
        },
      ];
    }

    const newDash: CustomBIDashboard = {
      id: `dash-user-${Date.now()}`,
      title: title || "Custom Mine Dashboard",
      description: description || "Dashboard analitik kustom",
      category: "CUSTOM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: currentUser?.name || "Mining Engineer",
      isPreset: false,
      autoRefreshInterval: 15,
      widgets: newWidgets,
    };

    BIDashboardBuilderService.saveDashboard(newDash);
    const updatedList = BIDashboardBuilderService.getAllDashboards();
    setDashboards(updatedList);
    setCurrentDashboardId(newDash.id);
    setIsEditMode(true);
    setIsPaletteOpen(true);
  };

  // Duplicate Dashboard
  const handleDuplicateDashboard = (dash: CustomBIDashboard) => {
    const clone: CustomBIDashboard = {
      ...dash,
      id: `dash-clone-${Date.now()}`,
      title: `${dash.title} (Salinan)`,
      isPreset: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    BIDashboardBuilderService.saveDashboard(clone);
    const updatedList = BIDashboardBuilderService.getAllDashboards();
    setDashboards(updatedList);
    setCurrentDashboardId(clone.id);
  };

  // Delete Dashboard
  const handleDeleteDashboard = (dashboardId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dashboard kustom ini?")) {
      BIDashboardBuilderService.deleteDashboard(dashboardId);
      const updatedList = BIDashboardBuilderService.getAllDashboards();
      setDashboards(updatedList);
      setCurrentDashboardId(updatedList[0]?.id || "dash-exec-master");
    }
  };

  // Export handlers
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const payload = JSON.stringify(currentDashboard, null, 2);
    setJsonExportPayload(payload);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <DashboardHeaderBar
        dashboards={dashboards}
        currentDashboard={currentDashboard}
        onSelectDashboard={setCurrentDashboardId}
        onOpenNewDashboardModal={() => setIsNewDashModalOpen(true)}
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          setIsEditMode(!isEditMode);
          if (!isEditMode) setIsPaletteOpen(true);
        }}
        onOpenWidgetPalette={() => setIsPaletteOpen(true)}
        onDeleteDashboard={handleDeleteDashboard}
        onDuplicateDashboard={handleDuplicateDashboard}
        autoRefreshInterval={autoRefreshInterval}
        onSetAutoRefresh={setAutoRefreshInterval}
        onExportPDF={handleExportPDF}
        onExportJSON={handleExportJSON}
      />

      {/* Builder Notification Banner */}
      {isEditMode && (
        <div className="p-3.5 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border border-blue-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-200 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500 text-slate-950 rounded-lg font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <span>
              <strong>Mode Drag & Drop Aktif:</strong> Anda dapat menggeser posisi kartu, mengubah lebar kolom (3–12 grid), mengatur parameter metrik, atau menarik widget baru dari panel kanan.
            </span>
          </div>

          <button
            onClick={() => setIsPaletteOpen(true)}
            className="px-3 py-1.5 bg-blue-500 text-slate-950 font-black rounded-xl hover:bg-blue-400 transition text-[11px] shrink-0 cursor-pointer shadow-md"
          >
            Buka Widget Palette
          </button>
        </div>
      )}

      {/* Main Grid Canvas */}
      <div
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        className={`min-h-[450px] transition-all rounded-3xl ${
          isEditMode
            ? "border-2 border-dashed border-slate-700/80 p-4 bg-slate-950/20"
            : ""
        }`}
      >
        {currentDashboard.widgets.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl w-16 h-16 mx-auto flex items-center justify-center text-amber-400">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dashboard Masih Kosong</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tarik widget dari Palette atau klik tombol di bawah untuk menambahkan grafik pertama Anda.
              </p>
            </div>
            <button
              onClick={() => {
                setIsEditMode(true);
                setIsPaletteOpen(true);
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buka Palette Widget</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4" key={refreshKey}>
            {currentDashboard.widgets.map((widget, index) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onUpdateWidth={handleUpdateWidth}
                onOpenSettings={(w) => setConfigTargetWidget(w)}
                onDuplicate={handleDuplicateWidget}
                onDelete={handleDeleteWidget}
                onDragStartWidget={handleDragStartWidget}
                onDragOverWidget={handleDragOverWidget}
                onDropWidget={handleDropWidget}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Widget Palette Drawer */}
      <WidgetPaletteDrawer
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        catalog={catalog}
        onAddWidget={handleAddWidget}
      />

      {/* Widget Settings Modal */}
      <WidgetConfigModal
        isOpen={!!configTargetWidget}
        onClose={() => setConfigTargetWidget(null)}
        widget={configTargetWidget}
        onSaveConfig={handleSaveWidgetConfig}
      />

      {/* New Dashboard Modal */}
      <NewDashboardModal
        isOpen={isNewDashModalOpen}
        onClose={() => setIsNewDashModalOpen(false)}
        onCreateDashboard={handleCreateDashboard}
      />

      {/* JSON Schema Export Modal */}
      {jsonExportPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <FileCode className="w-5 h-5 text-blue-400" />
                <span>Dashboard JSON Schema Definition</span>
              </div>
              <button
                onClick={() => setJsonExportPayload(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <textarea
              readOnly
              value={jsonExportPayload}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-xs text-amber-300 focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonExportPayload);
                  alert("JSON Schema berhasil disalin ke clipboard!");
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Salin ke Clipboard
              </button>
              <button
                onClick={() => setJsonExportPayload(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
