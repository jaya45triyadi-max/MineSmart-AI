// MINE SMART AI - GIS & Spatial Intelligence Types Definition
// Memenuhi seluruh layer pertambangan, map tools, dan live equipment tracking

import { BaseEntity } from "../../../types";

export type SpatialObjectType =
  | "PIT"
  | "BLOCK"
  | "SEAM"
  | "ROAD"
  | "DISPOSAL"
  | "STOCKPILE"
  | "ROM"
  | "CRUSHER"
  | "WORKSHOP"
  | "FUEL_STATION"
  | "OFFICE"
  | "CAMP"
  | "DRAINAGE"
  | "SETTLING_POND"
  | "EQUIPMENT"
  | "SURVEY_POINT"
  | "BOREHOLE"
  | "GEOFENCE";

export type EquipmentCategory =
  | "EXCAVATOR"
  | "DUMP_TRUCK"
  | "DOZER"
  | "GRADER"
  | "WATER_TRUCK"
  | "LIGHT_VEHICLE";

export type BasemapType = "SATELLITE" | "TERRAIN" | "STREET" | "DARK";

export type SpatialLayerGroup =
  | "OPERATIONAL"
  | "GEOLOGY"
  | "INFRASTRUCTURE"
  | "ENVIRONMENT"
  | "SURVEY"
  | "FLEET"
  | "SAFETY";

export interface LatLng {
  lat: number;
  lng: number;
  elevation?: number;
}

export interface UTMCoordinate {
  zone: string; // e.g. "50S"
  easting: number;
  northing: number;
  elevationRL: number;
}

export interface GISLayer {
  id: string;
  name: string;
  group: SpatialLayerGroup;
  visible: boolean;
  opacity: number; // 0 to 1
  color: string;
  iconName: string;
  count: number;
  description: string;
}

export interface GISFeatureProperty {
  label: string;
  value: string | number;
  badgeColor?: string;
  unit?: string;
}

export interface SpatialEntity {
  id: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  code: string;
  type: SpatialObjectType;
  equipmentCategory?: EquipmentCategory;
  layerId: string;
  siteId: string;
  siteName: string;
  status: "OPERATING" | "ACTIVE" | "STANDBY" | "MAINTENANCE" | "CLOSED" | "HAZARD" | "RESTRICTED" | "IDLING" | "HAULING" | "LOADING" | "DUMPING";
  rlElevation: string;
  centerCoordinates: LatLng;
  polygonCoordinates?: LatLng[];
  pathCoordinates?: LatLng[];
  utmString: string;
  areaHa?: number;
  lengthKm?: number;
  volumeM3?: number;
  qualityGar?: number;
  capacityMT?: number;
  currentTonnageMT?: number;
  speedKmh?: number;
  fuelLevelPercent?: number;
  operatorName?: string;
  properties: GISFeatureProperty[];
  description: string;
  lastSurveyDate?: string;
  // Live telemetry additions
  headingDeg?: number;
  targetDestination?: string;
  payloadTon?: number;
  shiftCycleCount?: number;
}

export type MeasurementMode =
  | "NONE"
  | "DISTANCE"
  | "AREA"
  | "ELEVATION"
  | "COORDINATE"
  | "VOLUME"
  | "POLYGON"
  | "BUFFER"
  | "MEASUREMENT";

export interface MeasurementPoint {
  lat: number;
  lng: number;
  elevationRL?: number;
  label?: string;
}

export interface MeasurementResult {
  mode: MeasurementMode;
  points: MeasurementPoint[];
  distanceMeters?: number;
  areaSquareMeters?: number;
  areaHectares?: number;
  perimeterMeters?: number;
  radiusMeters?: number;
  elevationProfile?: {
    startElevationRL: number;
    endElevationRL: number;
    elevationDelta: number;
    slopePercent: number;
  };
  volumeEstimate?: {
    cutVolumeBCM: number;
    fillVolumeBCM: number;
    netVolumeBCM: number;
    benchDepthM: number;
  };
  coordinateDetail?: {
    wgs84: { lat: number; lng: number };
    utmZone: string;
    eastingNorthing: string;
    elevationRL: number;
  };
}

export interface GISFilterState {
  searchQuery: string;
  selectedLayerIds: string[];
  selectedEquipmentType?: string; // "ALL" | EquipmentCategory
  statusFilter: string;
  pitFilter: string;
  minElevationRL?: number;
  maxElevationRL?: number;
  radiusFilter?: {
    center: LatLng;
    radiusMeters: number;
  };
}

export interface GeoFenceAlert {
  id: string;
  geoFenceId: string;
  geoFenceName: string;
  equipmentCode: string;
  equipmentType: string;
  eventType: "ENTER" | "EXIT" | "SPEED_VIOLATION" | "UNAUTHORIZED_ENTRY" | "LONG_IDLE" | "LOW_FUEL";
  timestamp: string;
  coordinates: LatLng;
  speedKmh: number;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
}

export interface GISImportExportPayload {
  format: "GEOJSON" | "CSV" | "KML";
  crs: "WGS84" | "UTM_ZONE_50S" | "UTM_ZONE_49S";
  layerId: string;
  dataString?: string;
  entities?: SpatialEntity[];
}

export interface GISSpatialAnalysisResult {
  summary: string;
  totalAreaHa: number;
  activeEquipmentCount: number;
  totalVolumeInAreaBCM?: number;
  totalStockpileCoalMT?: number;
  hazardRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  recommendations: string[];
  affectedObjects: SpatialEntity[];
}
