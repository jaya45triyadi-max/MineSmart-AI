// MINE SMART AI - Survey & Survey Intelligence Center Types

export type PointType =
  | "Bench"
  | "Topography"
  | "Boundary"
  | "Stockpile"
  | "Pit"
  | "Road"
  | "Drainage"
  | "Infrastructure"
  | "Control Point"
  | "Check Point"
  | "Other";

export type SurveyMethod =
  | "Total Station"
  | "GNSS / RTK"
  | "Drone Photogrammetry"
  | "LiDAR"
  | "Mobile Mapping"
  | "Manual Survey"
  | "Imported Dataset"
  | "Other";

export type AccuracyLevel = "High" | "Acceptable" | "Warning" | "Poor" | "Unknown";

export type SurfaceType =
  | "Existing Ground"
  | "Original Ground"
  | "Current Surface"
  | "Design Surface"
  | "Pit Surface"
  | "Stockpile Surface"
  | "Road Surface"
  | "Dump Surface"
  | "Reclamation Surface"
  | "Other";

export type SurfaceStatus = "Draft" | "Processing" | "QC" | "Validated" | "Approved" | "Archived";

export type VolumeMethod =
  | "TIN-to-TIN"
  | "Surface Difference"
  | "Cross Section Method"
  | "Grid Method"
  | "Stockpile Surface"
  | "Pit Surface";

export type VolumeObjectType =
  | "Pit"
  | "Stockpile"
  | "Disposal"
  | "ROM"
  | "Excavation"
  | "Embankment"
  | "Road"
  | "Other";

export type CoordinateSystemConfig = {
  latitude?: number;
  longitude?: number;
  easting: number;
  northing: number;
  elevation: number;
  epsg: string; // e.g. "EPSG:32750" (UTM Zone 50S)
  datum: string; // e.g. "WGS84"
  zone: string; // e.g. "Zone 50S"
  hemisphere: "North" | "South";
  units: "Meters" | "Feet";
};

export interface SurveyProject {
  id: string;
  projectId: string;
  projectName: string;
  companyId: string;
  siteId: string;
  area: string;
  surveyType: string;
  startDate: string;
  endDate?: string;
  surveyor: string;
  status: "Planned" | "Active" | "Processing" | "QC" | "Completed" | "Archived";
  description: string;
}

export interface SurveyPoint {
  id: string;
  pointId: string;
  pointCode: string;
  companyId: string;
  siteId: string;
  projectId: string;
  surveyDate: string;
  easting: number;
  northing: number;
  elevation: number;
  latitude?: number;
  longitude?: number;
  coordinateSystem: string;
  pointType: PointType;
  description: string;
  surveyMethod: SurveyMethod;
  instrument: string;
  accuracy: AccuracyLevel;
  horizontalAccuracy: number; // in meters
  verticalAccuracy: number; // in meters
  surveyorId: string;
  surveyorName: string;
  status: "Raw" | "Validated" | "QC_Warning" | "Approved";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyControlPoint {
  id: string;
  controlPointId: string;
  pointCode: string;
  easting: number;
  northing: number;
  elevation: number;
  datum: string;
  accuracy: string;
  status: "Active" | "Maintenance" | "Archived";
  establishedDate: string;
  verifiedDate: string;
  verifiedBy: string;
}

export interface SurveyEquipment {
  id: string;
  equipmentId: string;
  model: string;
  serialNumber: string;
  type: "GNSS" | "Total Station" | "Drone" | "LiDAR" | "Scanner" | "Other";
  calibrationDate: string;
  nextCalibrationDate: string;
  status: "Ready" | "Calibration Due Soon" | "Calibration Expired" | "Maintenance";
}

export interface SurveySurface {
  id: string;
  surfaceId: string;
  surfaceName: string;
  companyId: string;
  siteId: string;
  projectId: string;
  surfaceType: SurfaceType;
  surveyDate: string;
  coordinateSystem: string;
  unit: "Meters" | "Feet";
  source: string;
  pointCount: number;
  triangleCount: number;
  boundingBox: {
    minEasting: number;
    maxEasting: number;
    minNorthing: number;
    maxNorthing: number;
  };
  minElevation: number;
  maxElevation: number;
  averageElevation: number;
  status: SurfaceStatus;
  version: string; // e.g. "v1", "v2"
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DTMRecord {
  id: string;
  dtmId: string;
  surfaceId: string;
  name: string;
  source: string;
  surveyDate: string;
  pointCount: number;
  triangleCount: number;
  minElevation: number;
  maxElevation: number;
  elevationRange: string;
  areaSqm: number;
  resolutionMeters: number;
  status: SurfaceStatus;
  version: string;
}

export interface DSMRecord {
  id: string;
  dsmId: string;
  surfaceId: string;
  name: string;
  source: "Drone" | "LiDAR" | "Photogrammetry" | "Point Cloud" | "Imported Raster";
  surveyDate: string;
  resolutionMeters: number;
  pointCount: number;
  areaSqm: number;
  minElevation: number;
  maxElevation: number;
  coordinateSystem: string;
  version: string;
  status: SurfaceStatus;
}

export interface ContourDataset {
  id: string;
  contourId: string;
  surfaceId: string;
  surfaceName: string;
  intervalMeters: number;
  majorIntervalMeters: number;
  unit: string;
  minElevation: number;
  maxElevation: number;
  coordinateSystem: string;
  lineCount: number;
  status: "Active" | "Draft" | "Archived";
  createdAt: string;
}

export interface CrossSection {
  id: string;
  sectionId: string;
  sectionName: string;
  projectId: string;
  startPoint: { easting: number; northing: number };
  endPoint: { easting: number; northing: number };
  azimuthDeg: number;
  sectionWidthMeters: number;
  verticalExaggeration: number; // 1x, 2x, 5x, 10x
  surfaceIds: string[];
  pointsData: Array<{
    distance: number; // x axis
    existingElevation: number;
    designElevation?: number;
    cutFillDiff?: number;
  }>;
  status: "Active" | "Archived";
}

export interface CutFillAnalysis {
  id: string;
  cutFillId: string;
  projectId: string;
  existingSurfaceId: string;
  existingSurfaceName: string;
  designSurfaceId: string;
  designSurfaceName: string;
  boundaryName: string;
  cutVolumeBcm: number;
  fillVolumeBcm: number;
  netVolumeBcm: number; // cut - fill
  areaSqm: number;
  balanceStatus: "Cut Heavy" | "Fill Heavy" | "Balanced";
  calculationMethod: VolumeMethod;
  status: "Draft" | "Approved" | "Archived";
  processedAt: string;
  processedBy: string;
}

export interface VolumeCalculation {
  id: string;
  calculationId: string;
  projectId: string;
  objectType: VolumeObjectType;
  objectName: string;
  surfaceAId: string;
  surfaceAName: string;
  surfaceBId: string;
  surfaceBName: string;
  boundaryName: string;
  method: VolumeMethod;
  volumeBcm: number; // Volume in BCM or Loose
  tonnage: number; // Converted tonnage if applicable
  densityFactor: number; // e.g. 1.3 or 2.3 t/m3
  calculatedBy: string;
  status: "Verified" | "Pending QC" | "Draft";
  calculatedAt: string;
}

export type SurveyImportFormat = "CSV" | "DXF" | "SHP" | "GeoJSON" | "LAS" | "GeoTIFF";

export interface SurveyImportJob {
  id: string;
  jobId: string;
  fileName: string;
  format: SurveyImportFormat;
  fileSizeBytes: number;
  geometryType: string;
  featureCount: number;
  validFeatures: number;
  invalidFeatures: number;
  duplicateFeatures: number;
  coordinateSystem: string;
  status: "Queued" | "Processing" | "Completed" | "Failed";
  errorMessage?: string;
  createdAt: string;
  processedBy: string;
  // Format specific metadata
  lasMetadata?: {
    pointCount: number;
    densityPtsSqm: number;
    returnClassification: { ground: number; vegetation: number; structure: number; noise: number };
    intensityRange: [number, number];
  };
  geoTiffMetadata?: {
    pixelSizeMeters: number;
    rasterDimensions: { width: number; height: number };
    minElevation: number;
    maxElevation: number;
    bandsCount: number;
  };
}

export interface SurveyDeviceTelemetry {
  id: string;
  deviceId: string;
  name: string;
  type: "Drone" | "RTK GPS" | "Total Station" | "GNSS" | "Digital Level" | "Laser Scanner";
  brand: string;
  model: string;
  serialNumber: string;
  status: "ONLINE_ACTIVE" | "STANDBY" | "PROCESSING" | "CALIBRATION_DUE" | "OFFLINE";
  batteryLevelPct: number;
  signalQualityPct: number;
  currentSurveyor: string;
  location: {
    easting: number;
    northing: number;
    elevation: number;
    area: string;
  };
  lastSyncAt: string;
  // Specific device telemetry
  droneDetails?: {
    flightMission: string;
    altitudeAglMeters: number;
    flightSpeedMs: number;
    gsdCmPx: number;
    capturedPhotos: number;
    coverageAreaHa: number;
    storageUsedGb: number;
  };
  rtkDetails?: {
    mode: "Rover" | "Base" | "Network RTK (NTRIP)";
    fixStatus: "FIXED" | "FLOAT" | "AUTONOMOUS";
    satellitesCount: number;
    constellations: string[]; // ["GPS", "GLONASS", "GALILEO", "BEIDOU"]
    pdop: number;
    hdop: number;
    horizontalRmsMm: number;
    verticalRmsMm: number;
    baseStationId: string;
    baselineDistanceKm: number;
  };
  totalStationDetails?: {
    setupMethod: "Resection" | "Backsight & Occupied Point" | "Free Station";
    occupiedPointId: string;
    backsightPointId: string;
    backsightDeltaHzSec: number;
    prismType: "360 Prism" | "Circular Standard" | "Reflectorless (Direct Laser)";
    edmMode: "Precise (1mm)" | "Fast Tracking (3mm)";
    horizontalCircleDeg: number;
    verticalAngleDeg: number;
  };
  gnssDetails?: {
    corsStationName: string;
    trackingHours: number;
    rinexVersion: string;
    baselineLoopClosureMm: number;
  };
  scannerDetails?: {
    scanResolution: string; // e.g. "1/4 High Res"
    pointsPerSec: string; // e.g. "1,000,000 pts/s"
    registeredScansCount: number;
    targetRegistrationErrorMm: number;
  };
}

export interface ProgressComparisonRecord {
  id: string;
  comparisonId: string;
  title: string;
  pitArea: string;
  periodType: "Weekly" | "Monthly EOM" | "Custom";
  baseSurface: { id: string; name: string; surveyDate: string };
  targetSurface: { id: string; name: string; surveyDate: string };
  planModelId: string;
  planModelName: string;
  actualExcavationBcm: number;
  planExcavationBcm: number;
  excavationVarianceBcm: number;
  excavationCompliancePct: number;
  actualCoalTons: number;
  planCoalTons: number;
  coalVarianceTons: number;
  coalCompliancePct: number;
  benchProgressions: Array<{
    benchName: string;
    targetElevationRl: number;
    actualElevationRl: number;
    dropRateMeters: number;
    status: "ON_TRACK" | "BEHIND_PLAN" | "AHEAD_PLAN";
  }>;
  status: "APPROVED" | "IN_REVIEW" | "DRAFT";
  analyzedAt: string;
  analyst: string;
}

export interface AISurfaceChangeAnalysis {
  id: string;
  analysisTitle: string;
  comparedSurfaces: {
    baselineSurfaceName: string;
    baselineDate: string;
    currentSurfaceName: string;
    currentDate: string;
  };
  totalAreaSqm: number;
  elevationChanges: {
    maxExcavationDepthMeters: number;
    maxFillHeightMeters: number;
    averageElevationShiftMeters: number;
  };
  cutFillSummary: {
    cutVolumeBcm: number;
    fillVolumeBcm: number;
    netVolumeBcm: number;
    cutToFillRatio: number;
  };
  slopeMovementRisk: {
    riskLevel: "HIGH" | "MODERATE" | "LOW";
    criticalZones: Array<{
      zoneName: string;
      easting: number;
      northing: number;
      elevation: number;
      displacementRateMmPerDay: number;
      riskFactor: string;
      suggestedAction: string;
    }>;
  };
  designCompliance: {
    overbreakVolumeBcm: number;
    underbreakVolumeBcm: number;
    toeCrestDeviationAvgMeters: number;
    complianceScorePct: number;
    findings: string[];
  };
  productionCorrelation: {
    actualOBExcavatedBcm: number;
    targetRkabBcm: number;
    varianceBcm: number;
    achievementPct: number;
    coalExposedTons: number;
  };
  aiRecommendations: string[];
  generatedAt: string;
}

export interface SurveyQCIssue {
  id: string;
  issueId: string;
  pointCode?: string;
  surfaceId?: string;
  entityCode: string;
  issueType:
    | "Missing Elevation"
    | "Duplicate Point"
    | "Elevation Outlier"
    | "Invalid Geometry"
    | "Boundary Violation"
    | "Calibration Overdue";
  severity: "CRITICAL" | "WARNING" | "INFO";
  description: string;
  suggestedAction: string;
  status: "OPEN" | "RESOLVED" | "IGNORED";
  createdAt: string;
}

export interface SurveyDocument {
  id: string;
  documentId: string;
  title: string;
  type: "Survey Report" | "Field Notes" | "Calibration Certificate" | "Raw Data" | "Drawing";
  fileUrl: string;
  fileSizeMb: number;
  uploadedBy: string;
  createdAt: string;
}
