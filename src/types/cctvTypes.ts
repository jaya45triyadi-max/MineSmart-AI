// MINE SMART AI - Enterprise AI CCTV & Vision Mining Analytics Types
// Compliance: Kepmen ESDM No. 1827 K/30/MEM/2018 & Minerba Safety Surveillance

export type VisionDetectionCategory =
  | "ppe"
  | "helmet"
  | "vest"
  | "person"
  | "vehicle"
  | "restricted_area"
  | "unsafe_interaction"
  | "smoke_fire";

export type VisionIncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
export type VisionIncidentStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "FALSE_ALARM";

export interface BoundingBox {
  id: string;
  label: string; // e.g. "Person (No Helmet)", "Komatsu HD785", "Smoke Plume"
  category: VisionDetectionCategory;
  confidence: number; // 0.0 - 1.0 (e.g. 0.96)
  x: number; // percentage (0-100%)
  y: number; // percentage (0-100%)
  width: number; // percentage (0-100%)
  height: number; // percentage (0-100%)
  isViolation: boolean;
  violationType?: string;
  trackingId?: string; // e.g. "OBJ-TRK-8812"
  attributes?: {
    hasHelmet?: boolean;
    hasVest?: boolean;
    hasBoots?: boolean;
    hasMask?: boolean;
    vehicleType?: string;
    speedKmh?: number;
    distanceToNearestVehicleM?: number;
    distanceToNearestPersonM?: number;
    thermalTempC?: number;
    zoneName?: string;
  };
}

export interface CameraFeed {
  id: string; // e.g. "CAM-PIT-01"
  code: string; // e.g. "CAM-01"
  name: string; // e.g. "Pit 01 Highwall Loading Point"
  location: string; // e.g. "Pit 01 Bench 40 West"
  siteId: string; // e.g. "SITE-KAL-A"
  siteName: string; // e.g. "Sangatta Coal Mine"
  zoneType: "LOADING_POINT" | "HAUL_ROAD_INTERSECTION" | "ROM_STOCKPILE" | "WORKSHOP_BAY" | "FUEL_STATION" | "CRUSHER_HOPPER" | "PORT_CONVEYOR";
  streamUrl: string; // RTSP / HLS stream proxy
  resolution: "4K UHD (3840x2160)" | "1080p FHD (1920x1080)" | "720p HD";
  fps: number; // e.g. 30
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  edgeAiGateway: {
    nodeId: string;
    modelName: string; // e.g. "YOLOv10-Mining-Vision-v4"
    accelerator: "NVIDIA Jetson AGX Orin 64GB" | "TensorRT Edge NPU";
    inferenceLatencyMs: number; // e.g. 16.4 ms
    temperatureC: number;
    npuLoadPct: number;
  };
  ptzSupport: boolean;
  thermalOverlay: boolean;
  nightVisionActive: boolean;
  activeDetections: BoundingBox[];
  complianceScorePct: number; // e.g. 94.5%
  peopleCount: number;
  vehicleCount: number;
  activeViolationsCount: number;
  snapshotUrl?: string;
  virtualRestrictedZones: Array<{
    id: string;
    name: string;
    polygonPoints: Array<{ x: number; y: number }>; // percentage coords
    zoneType: "BLAST_DANGER" | "EXCAVATOR_SWING_RADIUS" | "HAUL_ROAD_LANE" | "HIGHWALL_DROP_EDGE" | "FUEL_DISPENSING_ZONE";
    severityOnBreach: VisionIncidentSeverity;
  }>;
}

export interface VisionIncident {
  id: string; // e.g. "INC-VIS-20260816-001"
  timestamp: string;
  cameraId: string;
  cameraCode: string;
  cameraName: string;
  location: string;
  siteId: string;
  category: VisionDetectionCategory;
  title: string; // e.g. "Pekerja Memasuki Radius Ayun Excavator Tanpa Helm"
  description: string;
  severity: VisionIncidentSeverity;
  status: VisionIncidentStatus;
  confidencePct: number; // e.g. 98.4%
  involvedEntities: {
    personCount: number;
    vehicleCount: number;
    equipmentCodes?: string[]; // e.g. ["EX-2000-01", "HD-785-04"]
    workerNames?: string[]; // e.g. ["Pekerja Unidentified #4"]
  };
  esdmComplianceRule: {
    code: string; // e.g. "Kepmen ESDM 1827/2018 Lampiran III (K3 Pertambangan)"
    article: string;
    requirement: string;
  };
  snapshotThumbnail?: string;
  aiForensicAnalysis: {
    detectionTrigger: string;
    dangerLevel: string;
    proximityDistanceM?: number;
    recommendedInstantAction: string;
    esdmSanctionRisk: string;
  };
  dispatchedAlerts: {
    radioBroadcastSent: boolean;
    kttSupervisorNotified: boolean;
    sirenActivated: boolean;
    interlockMachineSignalSent: boolean;
  };
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface PPEZoneSummary {
  zoneName: string;
  totalWorkersObserved: number;
  helmetCompliancePct: number;
  vestCompliancePct: number;
  bootsCompliancePct: number;
  overallCompliancePct: number;
  violationsCount: number;
}

export interface AICCTVEnterpriseSummary {
  enterprisePackageActive: boolean;
  licenseTier: "ENTERPRISE_TIER_PLUS";
  totalCamerasOnline: number;
  totalCamerasMonitored: number;
  totalFramesProcessedToday: number;
  averageInferenceLatencyMs: number;
  overallPPECompliancePct: number;
  totalViolationsToday: number;
  criticalSafetyBreachesToday: number;
  activeUnsafeInteractionsCount: number;
  smokeFireAlertsCount: number;
  restrictedAreaBreachesCount: number;
  esdmAuditReadinessScorePct: number;
  detectionsByCategory: Record<VisionDetectionCategory, number>;
}
