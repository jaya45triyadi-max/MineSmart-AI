// MINE SMART AI - Mining GIS & Spatial Intelligence Master Module
// Modul Master Peta Tambang Interaktif dengan 17 Layer, 8 Tools, dan Live Equipment Tracking

import React, { useState, useEffect } from "react";
import { GISHeader } from "./components/GISHeader";
import { GISLayerControl } from "./components/GISLayerControl";
import { GISMapCanvas } from "./components/GISMapCanvas";
import { GISObjectDetailDrawer } from "./components/GISObjectDetailDrawer";
import { GISRadiusAnalysisModal } from "./components/GISRadiusAnalysisModal";
import { GISImportModal } from "./components/GISImportModal";
import { GISExportModal } from "./components/GISExportModal";
import { GISAICopilotDrawer } from "./components/GISAICopilotDrawer";
import {
  BasemapType,
  GISLayer,
  SpatialEntity,
  MeasurementMode,
  MeasurementResult,
  LatLng,
  GISFilterState,
  SpatialLayerGroup,
} from "./types/gisTypes";
import { INITIAL_GIS_LAYERS, MOCK_SPATIAL_ENTITIES, GISService } from "../../services/gis/GISService";
import { useAuth } from "../../providers/AuthProvider";

interface GISMapModuleProps {
  onOpenAICopilot: () => void;
}

export const GISMapModule: React.FC<GISMapModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, user } = useAuth();

  // Master States
  const [basemap, setBasemap] = useState<BasemapType>("SATELLITE");
  const [layers, setLayers] = useState<GISLayer[]>(INITIAL_GIS_LAYERS);
  const [entities, setEntities] = useState<SpatialEntity[]>(MOCK_SPATIAL_ENTITIES);
  const [selectedEntity, setSelectedEntity] = useState<SpatialEntity | null>(MOCK_SPATIAL_ENTITIES[0]);
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>("NONE");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>("ALL");
  const [bufferRadius, setBufferRadius] = useState<number>(300);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Drawers
  const [isRadiusModalOpen, setIsRadiusModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);

  // Active Radius Filter Center
  const [radiusFilter, setRadiusFilter] = useState<{ center: LatLng; radiusMeters: number } | null>(null);

  // Periodic Live Fleet GPS Simulation (subtle movement of active hauling units)
  useEffect(() => {
    const interval = setInterval(() => {
      setEntities((prev) =>
        prev.map((e) => {
          if (e.type === "EQUIPMENT" && (e.status === "HAULING" || e.status === "OPERATING")) {
            const jitterLat = (Math.random() - 0.5) * 0.00015;
            const jitterLng = (Math.random() - 0.5) * 0.00015;
            const newLat = e.centerCoordinates.lat + jitterLat;
            const newLng = e.centerCoordinates.lng + jitterLng;
            return {
              ...e,
              centerCoordinates: {
                lat: newLat,
                lng: newLng,
                elevation: e.centerCoordinates.elevation,
              },
              speedKmh: Math.max(8, Math.min(42, Math.round((e.speedKmh || 25) + (Math.random() - 0.5) * 4))),
            };
          }
          return e;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Filtered Entities Calculation
  const filteredEntities = GISService.filterEntities(entities, {
    searchQuery,
    selectedLayerIds: layers.filter((l) => l.visible).map((l) => l.id),
    selectedEquipmentType,
    statusFilter: "ALL",
    pitFilter: "ALL",
    radiusFilter: radiusFilter || undefined,
  });

  // Layer Toggle Handler
  const handleToggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  // Layer Opacity Handler
  const handleChangeOpacity = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, opacity } : l))
    );
  };

  // Layer Group Toggle Handler
  const handleToggleGroup = (group: SpatialLayerGroup, visible: boolean) => {
    setLayers((prev) =>
      prev.map((l) => (l.group === group ? { ...l, visible } : l))
    );
  };

  // Clear Measurement Handler
  const handleClearMeasurement = () => {
    setMeasurementMode("NONE");
  };

  // Imported Data Handler
  const handleImportSuccess = (imported: SpatialEntity[]) => {
    setEntities((prev) => [...imported, ...prev]);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Map Control Bar */}
      <GISHeader
        basemap={basemap}
        onSelectBasemap={setBasemap}
        measurementMode={measurementMode}
        onSelectMeasurementMode={setMeasurementMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEquipmentType={selectedEquipmentType}
        onSelectEquipmentType={setSelectedEquipmentType}
        bufferRadius={bufferRadius}
        onChangeBufferRadius={setBufferRadius}
        onOpenRadiusModal={() => setIsRadiusModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onFitAllBounds={() => {
          setRadiusFilter(null);
          setSearchQuery("");
          setSelectedEquipmentType("ALL");
        }}
        onClearMeasurement={handleClearMeasurement}
      />

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left Sidebar: 17 Layer Control & Legends */}
        <div className="lg:col-span-1">
          <GISLayerControl
            layers={layers}
            onToggleLayer={handleToggleLayer}
            onChangeOpacity={handleChangeOpacity}
            onToggleGroup={handleToggleGroup}
          />
        </div>

        {/* Center Canvas: Interactive Mine GIS Map & Live Fleet Tracking */}
        <div className="lg:col-span-3 h-[640px]">
          <GISMapCanvas
            basemap={basemap}
            layers={layers}
            entities={filteredEntities}
            measurementMode={measurementMode}
            bufferRadius={bufferRadius}
            onObjectSelect={(entity) => setSelectedEntity(entity)}
            onMeasurementUpdate={(result) => {
              // Measurement update callback
            }}
            onClearMeasurement={handleClearMeasurement}
          />
        </div>
      </div>

      {/* Slide-over Object Detail Drawer */}
      <GISObjectDetailDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />

      {/* Spatial Radius Analysis Modal */}
      <GISRadiusAnalysisModal
        isOpen={isRadiusModalOpen}
        onClose={() => setIsRadiusModalOpen(false)}
        entities={entities}
        onApplyRadiusFilter={(center, radiusMeters) => {
          setRadiusFilter({ center, radiusMeters });
        }}
        onClearRadiusFilter={() => setRadiusFilter(null)}
      />

      {/* Import Modal */}
      <GISImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Export Modal */}
      <GISExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entities={filteredEntities}
      />

      {/* Embedded AI Spatial Copilot Drawer */}
      <GISAICopilotDrawer
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        onSelectEntityOnMap={(entity) => {
          setSelectedEntity(entity);
        }}
      />
    </div>
  );
};
