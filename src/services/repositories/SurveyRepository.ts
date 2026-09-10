// MINE SMART AI - Survey Repository & Mock Data Management

import {
  SurveyProject,
  SurveyPoint,
  SurveyControlPoint,
  SurveyEquipment,
  SurveySurface,
  DTMRecord,
  DSMRecord,
  ContourDataset,
  CrossSection,
  CutFillAnalysis,
  VolumeCalculation,
  SurveyImportJob,
  SurveyQCIssue,
  SurveyDocument,
  SurveyDeviceTelemetry,
  ProgressComparisonRecord,
  AISurfaceChangeAnalysis,
} from "../../types/surveyTypes";

const INITIAL_DEVICES: SurveyDeviceTelemetry[] = [
  {
    id: "dev-01",
    deviceId: "DRONE-DJI-M300",
    name: "DJI Matrice 300 RTK - UAV Unit 1",
    type: "Drone",
    brand: "DJI Enterprise",
    model: "Matrice 300 RTK + Zenmuse P1 (45MP Full-Frame)",
    serialNumber: "DJI-M300-88319",
    status: "ONLINE_ACTIVE",
    batteryLevelPct: 88,
    signalQualityPct: 96,
    currentSurveyor: "Ahmad Dani (Chief UAV Pilot)",
    location: {
      easting: 541450.2,
      northing: 9874320.5,
      elevation: 210.5,
      area: "Pit 1 South - Sector Charlie",
    },
    lastSyncAt: "2026-08-15T08:15:00Z",
    droneDetails: {
      flightMission: "Pit 1 South Weekly Topo Survey #33",
      altitudeAglMeters: 120,
      flightSpeedMs: 9.5,
      gsdCmPx: 2.3,
      capturedPhotos: 420,
      coverageAreaHa: 68.5,
      storageUsedGb: 28.4,
    },
  },
  {
    id: "dev-02",
    deviceId: "RTK-TRM-R12I",
    name: "Trimble R12i GNSS RTK Rover #01",
    type: "RTK GPS",
    brand: "Trimble Geospatial",
    model: "R12i with TIP Tilt Compensation & ProPoint Engine",
    serialNumber: "TRM-R12I-44912",
    status: "ONLINE_ACTIVE",
    batteryLevelPct: 74,
    signalQualityPct: 98,
    currentSurveyor: "Rian Pratama (Mine Surveyor)",
    location: {
      easting: 541310.8,
      northing: 9874180.2,
      elevation: 85.4,
      area: "Pit 1 South - Bench 11 Toe",
    },
    lastSyncAt: "2026-08-15T08:32:00Z",
    rtkDetails: {
      mode: "Rover",
      fixStatus: "FIXED",
      satellitesCount: 28,
      constellations: ["GPS", "GLONASS", "GALILEO", "BEIDOU"],
      pdop: 1.15,
      hdop: 0.65,
      horizontalRmsMm: 6.2,
      verticalRmsMm: 9.8,
      baseStationId: "BM-01-SGT (CORS)",
      baselineDistanceKm: 1.42,
    },
  },
  {
    id: "dev-03",
    deviceId: "TS-LEICA-TS16",
    name: "Leica TS16 Robotic Total Station 1\"",
    type: "Total Station",
    brand: "Leica Geosystems",
    model: "TS16 I 1\" R1000 AutoStar Robotic",
    serialNumber: "LCA-TS16-99214",
    status: "ONLINE_ACTIVE",
    batteryLevelPct: 62,
    signalQualityPct: 92,
    currentSurveyor: "Hendri Setiawan (Senior Surveyor)",
    location: {
      easting: 541800.4,
      northing: 9873900.2,
      elevation: 142.1,
      area: "Control Station BM-03-SGT",
    },
    lastSyncAt: "2026-08-15T08:20:00Z",
    totalStationDetails: {
      setupMethod: "Backsight & Occupied Point",
      occupiedPointId: "BM-03-SGT",
      backsightPointId: "BM-01-SGT",
      backsightDeltaHzSec: 1.2,
      prismType: "360 Prism",
      edmMode: "Precise (1mm)",
      horizontalCircleDeg: 142.4582,
      verticalAngleDeg: 89.1245,
    },
  },
  {
    id: "dev-04",
    deviceId: "GNSS-CORS-SGT",
    name: "Sangatta Mine CORS Reference Station",
    type: "GNSS",
    brand: "Leica Geosystems",
    model: "GR50 Multi-Frequency Geodetic Receiver + Choke Ring",
    serialNumber: "LCA-GR50-1049",
    status: "ONLINE_ACTIVE",
    batteryLevelPct: 100,
    signalQualityPct: 100,
    currentSurveyor: "Automated CORS Network",
    location: {
      easting: 541200.125,
      northing: 9874100.85,
      elevation: 125.45,
      area: "Geodetic Base Station 01",
    },
    lastSyncAt: "2026-08-15T08:35:00Z",
    gnssDetails: {
      corsStationName: "SGT-CORS-01",
      trackingHours: 8760,
      rinexVersion: "RINEX 3.04",
      baselineLoopClosureMm: 2.1,
    },
  },
  {
    id: "dev-05",
    deviceId: "LEVEL-LEICA-LS15",
    name: "Leica LS15 Digital Auto-Level (0.2mm)",
    type: "Digital Level",
    brand: "Leica Geosystems",
    model: "LS15 Digital Level with Invar Staff",
    serialNumber: "LCA-LS15-3211",
    status: "STANDBY",
    batteryLevelPct: 90,
    signalQualityPct: 100,
    currentSurveyor: "Bambang Wijaya",
    location: {
      easting: 541200.0,
      northing: 9874100.0,
      elevation: 125.45,
      area: "Survey Instrument Hub",
    },
    lastSyncAt: "2026-08-14T16:00:00Z",
  },
  {
    id: "dev-06",
    deviceId: "SCANNER-FARO-S350",
    name: "FARO Focus S350 Terrestrial 3D Laser Scanner",
    type: "Laser Scanner",
    brand: "FARO Technologies",
    model: "Focus S350 with HDR & On-Site Registration",
    serialNumber: "FARO-S350-7712",
    status: "STANDBY",
    batteryLevelPct: 85,
    signalQualityPct: 95,
    currentSurveyor: "Rian Pratama",
    location: {
      easting: 541520.0,
      northing: 9874400.0,
      elevation: 110.0,
      area: "Highwall Slope Monitoring Sector",
    },
    lastSyncAt: "2026-08-14T14:30:00Z",
    scannerDetails: {
      scanResolution: "1/4 High Density (40M points/scan)",
      pointsPerSec: "976,000 pts/s",
      registeredScansCount: 14,
      targetRegistrationErrorMm: 1.8,
    },
  },
];

const INITIAL_PROGRESS_COMPARISONS: ProgressComparisonRecord[] = [
  {
    id: "pcomp-01",
    comparisonId: "PCOMP-2026-08-PIT1",
    title: "Progress Penambangan Pit 1 South Minggu II Agustus vs RKAB 2026",
    pitArea: "Pit 1 South (Sangatta)",
    periodType: "Weekly",
    baseSurface: {
      id: "surf-01",
      name: "Pit 1 South July End Surface",
      surveyDate: "2026-07-31",
    },
    targetSurface: {
      id: "surf-02",
      name: "Pit 1 South Aug Mid Progress Surface",
      surveyDate: "2026-08-12",
    },
    planModelId: "PLAN-2026-AUG-P1",
    planModelName: "Mine Plan Design RKAB Agustus 2026 v2.1",
    actualExcavationBcm: 148200,
    planExcavationBcm: 152000,
    excavationVarianceBcm: -3800,
    excavationCompliancePct: 97.5,
    actualCoalTons: 38400,
    planCoalTons: 36000,
    coalVarianceTons: 2400,
    coalCompliancePct: 106.7,
    benchProgressions: [
      {
        benchName: "Bench 09 (RL 105)",
        targetElevationRl: 105.0,
        actualElevationRl: 104.8,
        dropRateMeters: 5.2,
        status: "ON_TRACK",
      },
      {
        benchName: "Bench 10 (RL 95)",
        targetElevationRl: 95.0,
        actualElevationRl: 94.6,
        dropRateMeters: 10.4,
        status: "AHEAD_PLAN",
      },
      {
        benchName: "Bench 11 (RL 85)",
        targetElevationRl: 85.0,
        actualElevationRl: 86.2,
        dropRateMeters: 8.8,
        status: "BEHIND_PLAN",
      },
      {
        benchName: "Bench 12 (RL 75)",
        targetElevationRl: 75.0,
        actualElevationRl: 75.1,
        dropRateMeters: 4.9,
        status: "ON_TRACK",
      },
    ],
    status: "APPROVED",
    analyzedAt: "2026-08-13T10:00:00Z",
    analyst: "Budi Santoso, S.T. (Chief Surveyor)",
  },
];

const INITIAL_IMPORT_JOBS: SurveyImportJob[] = [
  {
    id: "ij-01",
    jobId: "JOB-IMP-CSV-01",
    fileName: "SURVEY_POINTS_PIT1_AUG2026.csv",
    format: "CSV",
    fileSizeBytes: 245000,
    geometryType: "Point3D (XYZ + Code)",
    featureCount: 450,
    validFeatures: 448,
    invalidFeatures: 1,
    duplicateFeatures: 1,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    status: "Completed",
    createdAt: "2026-08-11T07:10:00Z",
    processedBy: "Budi Santoso",
  },
  {
    id: "ij-02",
    jobId: "JOB-IMP-DXF-01",
    fileName: "PIT1_MINE_DESIGN_AUGUST_REV3.dxf",
    format: "DXF",
    fileSizeBytes: 1850000,
    geometryType: "3D Polylines, TIN 3DFACE & Contours",
    featureCount: 1280,
    validFeatures: 1280,
    invalidFeatures: 0,
    duplicateFeatures: 0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    status: "Completed",
    createdAt: "2026-08-12T09:30:00Z",
    processedBy: "Hendri Setiawan",
  },
  {
    id: "ij-03",
    jobId: "JOB-IMP-SHP-01",
    fileName: "PIT_LIMIT_BOUNDARY_SGT2026.shp",
    format: "SHP",
    fileSizeBytes: 720000,
    geometryType: "PolygonZ (Pit Crest / Toe Boundary)",
    featureCount: 64,
    validFeatures: 64,
    invalidFeatures: 0,
    duplicateFeatures: 0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    status: "Completed",
    createdAt: "2026-08-13T11:15:00Z",
    processedBy: "Rian Pratama",
  },
  {
    id: "ij-04",
    jobId: "JOB-IMP-GEOJSON-01",
    fileName: "ENVIRONMENTAL_SETTLING_POND_MONITORING.geojson",
    format: "GeoJSON",
    fileSizeBytes: 410000,
    geometryType: "FeatureCollection (Polygons & Lines)",
    featureCount: 38,
    validFeatures: 38,
    invalidFeatures: 0,
    duplicateFeatures: 0,
    coordinateSystem: "WGS84 (EPSG:4326)",
    status: "Completed",
    createdAt: "2026-08-14T08:00:00Z",
    processedBy: "Budi Santoso",
  },
  {
    id: "ij-05",
    jobId: "JOB-IMP-LAS-01",
    fileName: "UAV_LIDAR_POINTCLOUD_PIT1_SOUTH.las",
    format: "LAS",
    fileSizeBytes: 48500000,
    geometryType: "LiDAR Point Cloud (XYZ + Intensity + Class)",
    featureCount: 3450000,
    validFeatures: 3448900,
    invalidFeatures: 1100,
    duplicateFeatures: 0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    status: "Completed",
    createdAt: "2026-08-14T14:20:00Z",
    processedBy: "Ahmad Dani (UAV Pilot)",
    lasMetadata: {
      pointCount: 3450000,
      densityPtsSqm: 42.5,
      returnClassification: {
        ground: 2890000,
        vegetation: 450000,
        structure: 98000,
        noise: 12000,
      },
      intensityRange: [15, 255],
    },
  },
  {
    id: "ij-06",
    jobId: "JOB-IMP-GEOTIFF-01",
    fileName: "ORTHOMOSAIC_EOM_DTM_AUG2026.tif",
    format: "GeoTIFF",
    fileSizeBytes: 125000000,
    geometryType: "Geo-Referenced Elevation Raster Grid",
    featureCount: 1,
    validFeatures: 1,
    invalidFeatures: 0,
    duplicateFeatures: 0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    status: "Completed",
    createdAt: "2026-08-15T06:45:00Z",
    processedBy: "Bambang Wijaya",
    geoTiffMetadata: {
      pixelSizeMeters: 0.1,
      rasterDimensions: { width: 4096, height: 4096 },
      minElevation: 25.4,
      maxElevation: 168.2,
      bandsCount: 1,
    },
  },
];

const INITIAL_PROJECTS: SurveyProject[] = [
  {
    id: "sproj-01",
    projectId: "PRJ-SURV-2026-01",
    projectName: "Pit Sangatta South Topography Survey Q3",
    companyId: "comp-01",
    siteId: "site-01",
    area: "Pit 1 South - Sangatta",
    surveyType: "Topography & Progress Survey",
    startDate: "2026-08-01",
    surveyor: "Budi Santoso, S.T. (Chief Surveyor)",
    status: "Active",
    description: "Pemetaan rutin mingguan прогресс tambang Pit 1 South & Stockpile A",
  },
  {
    id: "sproj-02",
    projectId: "PRJ-SURV-2026-02",
    projectName: "Disposal Area 2 UAV Photogrammetry",
    companyId: "comp-01",
    siteId: "site-01",
    area: "Disposal North 2",
    surveyType: "Drone UAV & DSM Mapping",
    startDate: "2026-08-10",
    surveyor: "Ahmad Dani (UAV Pilot)",
    status: "Processing",
    description: "Survei kemajuan penimbunan overburden Disposal North 2 menggunakan Drone RTK",
  },
];

const INITIAL_CONTROL_POINTS: SurveyControlPoint[] = [
  {
    id: "scp-01",
    controlPointId: "GCP-SGT-01",
    pointCode: "BM-01-SGT",
    easting: 541200.125,
    northing: 9874100.850,
    elevation: 125.450,
    datum: "WGS84 / UTM Zone 50S (EPSG:32750)",
    accuracy: "±0.005 m",
    status: "Active",
    establishedDate: "2024-01-15",
    verifiedDate: "2026-07-01",
    verifiedBy: "Bambang Wijaya (Senior Geodesist)",
  },
  {
    id: "scp-02",
    controlPointId: "GCP-SGT-02",
    pointCode: "BM-02-SGT",
    easting: 542350.680,
    northing: 9875250.310,
    elevation: 110.820,
    datum: "WGS84 / UTM Zone 50S (EPSG:32750)",
    accuracy: "±0.005 m",
    status: "Active",
    establishedDate: "2024-01-15",
    verifiedDate: "2026-07-01",
    verifiedBy: "Bambang Wijaya (Senior Geodesist)",
  },
  {
    id: "scp-03",
    controlPointId: "GCP-SGT-03",
    pointCode: "BM-03-SGT",
    easting: 541800.420,
    northing: 9873900.150,
    elevation: 142.100,
    datum: "WGS84 / UTM Zone 50S (EPSG:32750)",
    accuracy: "±0.008 m",
    status: "Maintenance",
    establishedDate: "2024-05-10",
    verifiedDate: "2026-06-12",
    verifiedBy: "Rian Pratama",
  },
];

const INITIAL_EQUIPMENT: SurveyEquipment[] = [
  {
    id: "seq-01",
    equipmentId: "EQ-RTK-01",
    model: "Trimble R12i GNSS RTK System",
    serialNumber: "TRM-982144-RTK",
    type: "GNSS",
    calibrationDate: "2026-02-10",
    nextCalibrationDate: "2027-02-10",
    status: "Ready",
  },
  {
    id: "seq-02",
    equipmentId: "EQ-TS-02",
    model: "Leica TS16 Robotic Total Station 1\"",
    serialNumber: "LCA-88319-TS",
    type: "Total Station",
    calibrationDate: "2025-08-20",
    nextCalibrationDate: "2026-08-20", // Calibration due soon!
    status: "Calibration Due Soon",
  },
  {
    id: "seq-03",
    equipmentId: "EQ-UAV-01",
    model: "DJI Matrice 300 RTK + Zenmuse P1",
    serialNumber: "DJI-M300-4820",
    type: "Drone",
    calibrationDate: "2026-04-05",
    nextCalibrationDate: "2027-04-05",
    status: "Ready",
  },
];

const INITIAL_POINTS: SurveyPoint[] = [
  {
    id: "sp-101",
    pointId: "SPT-2026-001",
    pointCode: "PIT1-B10-01",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surveyDate: "2026-08-11",
    easting: 541250.45,
    northing: 9874150.80,
    elevation: 85.20,
    latitude: -1.13824,
    longitude: 117.37125,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    pointType: "Bench",
    description: "Crest Bench 10 Pit 1 South",
    surveyMethod: "GNSS / RTK",
    instrument: "Trimble R12i GNSS",
    accuracy: "High",
    horizontalAccuracy: 0.008,
    verticalAccuracy: 0.012,
    surveyorId: "usr-surv-01",
    surveyorName: "Budi Santoso",
    status: "Approved",
    createdBy: "usr-surv-01",
    createdAt: "2026-08-11T08:30:00Z",
    updatedAt: "2026-08-11T08:30:00Z",
  },
  {
    id: "sp-102",
    pointId: "SPT-2026-002",
    pointCode: "PIT1-B10-02",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surveyDate: "2026-08-11",
    easting: 541280.10,
    northing: 9874180.25,
    elevation: 85.15,
    latitude: -1.13802,
    longitude: 117.37152,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    pointType: "Bench",
    description: "Toe Bench 10 Pit 1 South",
    surveyMethod: "GNSS / RTK",
    instrument: "Trimble R12i GNSS",
    accuracy: "High",
    horizontalAccuracy: 0.009,
    verticalAccuracy: 0.011,
    surveyorId: "usr-surv-01",
    surveyorName: "Budi Santoso",
    status: "Approved",
    createdBy: "usr-surv-01",
    createdAt: "2026-08-11T08:45:00Z",
    updatedAt: "2026-08-11T08:45:00Z",
  },
  {
    id: "sp-103",
    pointId: "SPT-2026-003",
    pointCode: "STK-A-01",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surveyDate: "2026-08-12",
    easting: 541900.50,
    northing: 9874800.60,
    elevation: 42.80,
    latitude: -1.13240,
    longitude: 117.37710,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    pointType: "Stockpile",
    description: "Puncak Stockpile Batubara A Seam Sangatta A",
    surveyMethod: "Drone Photogrammetry",
    instrument: "DJI Matrice 300 RTK",
    accuracy: "High",
    horizontalAccuracy: 0.015,
    verticalAccuracy: 0.020,
    surveyorId: "usr-surv-02",
    surveyorName: "Ahmad Dani",
    status: "Approved",
    createdBy: "usr-surv-02",
    createdAt: "2026-08-12T09:15:00Z",
    updatedAt: "2026-08-12T09:15:00Z",
  },
  {
    id: "sp-104",
    pointId: "SPT-2026-004",
    pointCode: "ROAD-PIT1-05",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surveyDate: "2026-08-12",
    easting: 541450.20,
    northing: 9874300.10,
    elevation: 68.40,
    latitude: -1.13680,
    longitude: 117.37305,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    pointType: "Road",
    description: "Centerline Ramp Utama Pit 1 South Slope 8%",
    surveyMethod: "GNSS / RTK",
    instrument: "Trimble R12i GNSS",
    accuracy: "High",
    horizontalAccuracy: 0.007,
    verticalAccuracy: 0.010,
    surveyorId: "usr-surv-01",
    surveyorName: "Budi Santoso",
    status: "Approved",
    createdBy: "usr-surv-01",
    createdAt: "2026-08-12T10:00:00Z",
    updatedAt: "2026-08-12T10:00:00Z",
  },
  {
    id: "sp-105",
    pointId: "SPT-2026-005",
    pointCode: "CHECK-01-WARN",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surveyDate: "2026-08-12",
    easting: 541300.00,
    northing: 9874200.00,
    elevation: 195.00, // Elevation Spike anomaly!
    latitude: -1.13780,
    longitude: 117.37170,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    pointType: "Topography",
    description: "Survei Batas Sisi Barat (Spike Check)",
    surveyMethod: "Manual Survey",
    instrument: "Leica TS16",
    accuracy: "Warning",
    horizontalAccuracy: 0.080,
    verticalAccuracy: 0.150,
    surveyorId: "usr-surv-03",
    surveyorName: "Rian Pratama",
    status: "QC_Warning",
    createdBy: "usr-surv-03",
    createdAt: "2026-08-12T11:20:00Z",
    updatedAt: "2026-08-12T11:20:00Z",
  },
];

const INITIAL_SURFACES: SurveySurface[] = [
  {
    id: "surf-01",
    surfaceId: "SURF-2026-07",
    surfaceName: "Pit 1 South Surface End-July 2026",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surfaceType: "Current Surface",
    surveyDate: "2026-07-31",
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    unit: "Meters",
    source: "GNSS RTK & UAV Composite",
    pointCount: 4850,
    triangleCount: 9620,
    boundingBox: {
      minEasting: 541000,
      maxEasting: 542200,
      minNorthing: 9874000,
      maxNorthing: 9875200,
    },
    minElevation: 25.0,
    maxElevation: 145.0,
    averageElevation: 78.5,
    status: "Approved",
    version: "v1",
    createdBy: "Budi Santoso",
    createdAt: "2026-07-31T17:00:00Z",
    updatedAt: "2026-07-31T17:00:00Z",
  },
  {
    id: "surf-02",
    surfaceId: "SURF-2026-08",
    surfaceName: "Pit 1 South Surface Mid-August 2026",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surfaceType: "Current Surface",
    surveyDate: "2026-08-12",
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    unit: "Meters",
    source: "Drone UAV Photogrammetry M300 RTK",
    pointCount: 8420,
    triangleCount: 16750,
    boundingBox: {
      minEasting: 541000,
      maxEasting: 542200,
      minNorthing: 9874000,
      maxNorthing: 9875200,
    },
    minElevation: 18.0,
    maxElevation: 145.0,
    averageElevation: 72.1,
    status: "Approved",
    version: "v2",
    createdBy: "Ahmad Dani",
    createdAt: "2026-08-12T16:00:00Z",
    updatedAt: "2026-08-12T16:00:00Z",
  },
  {
    id: "surf-03",
    surfaceId: "SURF-DESIGN-01",
    surfaceName: "Pit 1 South Ultimate Mine Design 2026",
    companyId: "comp-01",
    siteId: "site-01",
    projectId: "PRJ-SURV-2026-01",
    surfaceType: "Design Surface",
    surveyDate: "2026-01-01",
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    unit: "Meters",
    source: "Mine Planning Software CAD Design",
    pointCount: 12500,
    triangleCount: 24800,
    boundingBox: {
      minEasting: 541000,
      maxEasting: 542200,
      minNorthing: 9874000,
      maxNorthing: 9875200,
    },
    minElevation: 0.0,
    maxElevation: 145.0,
    averageElevation: 55.0,
    status: "Approved",
    version: "v1",
    createdBy: "Mine Engineering Dept",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

const INITIAL_DTM: DTMRecord[] = [
  {
    id: "dtm-01",
    dtmId: "DTM-2026-08-SGT",
    surfaceId: "surf-02",
    name: "Digital Terrain Model - Pit 1 South Aug 2026",
    source: "TIN Triangulation from RTK & UAV Points",
    surveyDate: "2026-08-12",
    pointCount: 8420,
    triangleCount: 16750,
    minElevation: 18.0,
    maxElevation: 145.0,
    elevationRange: "18.0m - 145.0m RL",
    areaSqm: 245000,
    resolutionMeters: 0.5,
    status: "Validated",
    version: "v2.0",
  },
];

const INITIAL_DSM: DSMRecord[] = [
  {
    id: "dsm-01",
    dsmId: "DSM-2026-08-UAV",
    surfaceId: "surf-02",
    name: "Digital Surface Model - UAV Photogrammetry Dispos2",
    source: "Drone",
    surveyDate: "2026-08-10",
    resolutionMeters: 0.05, // 5cm GSD
    pointCount: 1250000,
    areaSqm: 380000,
    minElevation: 35.0,
    maxElevation: 160.0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    version: "v1.0",
    status: "Approved",
  },
];

const INITIAL_CONTOURS: ContourDataset[] = [
  {
    id: "cnt-01",
    contourId: "CNT-PIT1-5M",
    surfaceId: "surf-02",
    surfaceName: "Pit 1 South Surface Mid-August 2026",
    intervalMeters: 1.0,
    majorIntervalMeters: 5.0,
    unit: "Meters",
    minElevation: 18.0,
    maxElevation: 145.0,
    coordinateSystem: "UTM Zone 50S (EPSG:32750)",
    lineCount: 342,
    status: "Active",
    createdAt: "2026-08-12T17:00:00Z",
  },
];

const INITIAL_CROSS_SECTIONS: CrossSection[] = [
  {
    id: "cs-01",
    sectionId: "SEC-A-A-SURV",
    sectionName: "Cross Section Line A-A' (Pit 1 Dip Direction)",
    projectId: "PRJ-SURV-2026-01",
    startPoint: { easting: 541100, northing: 9874100 },
    endPoint: { easting: 541800, northing: 9874600 },
    azimuthDeg: 35.5,
    sectionWidthMeters: 20,
    verticalExaggeration: 2, // 2x preset
    surfaceIds: ["surf-01", "surf-02", "surf-03"],
    pointsData: [
      { distance: 0, existingElevation: 142.0, designElevation: 142.0, cutFillDiff: 0 },
      { distance: 100, existingElevation: 110.5, designElevation: 105.0, cutFillDiff: 5.5 },
      { distance: 200, existingElevation: 82.0, designElevation: 70.0, cutFillDiff: 12.0 },
      { distance: 300, existingElevation: 58.0, designElevation: 45.0, cutFillDiff: 13.0 },
      { distance: 400, existingElevation: 35.0, designElevation: 20.0, cutFillDiff: 15.0 },
      { distance: 500, existingElevation: 18.0, designElevation: 0.0, cutFillDiff: 18.0 },
    ],
    status: "Active",
  },
];

const INITIAL_CUT_FILL: CutFillAnalysis[] = [
  {
    id: "cf-01",
    cutFillId: "CF-2026-08-PIT1",
    projectId: "PRJ-SURV-2026-01",
    existingSurfaceId: "surf-01",
    existingSurfaceName: "Pit 1 South Surface End-July 2026",
    designSurfaceId: "surf-02",
    designSurfaceName: "Pit 1 South Surface Mid-August 2026",
    boundaryName: "Pit 1 Mining Progress Boundary Q3",
    cutVolumeBcm: 148200, // Total Overburden Excavated in 2 weeks
    fillVolumeBcm: 1200, // Minor ramp fill
    netVolumeBcm: 147000,
    areaSqm: 85000,
    balanceStatus: "Cut Heavy",
    calculationMethod: "TIN-to-TIN",
    status: "Approved",
    processedAt: "2026-08-12T18:00:00Z",
    processedBy: "Budi Santoso (Chief Surveyor)",
  },
];

const INITIAL_VOLUMES: VolumeCalculation[] = [
  {
    id: "vol-01",
    calculationId: "VOL-STK-A-AUG12",
    projectId: "PRJ-SURV-2026-01",
    objectType: "Stockpile",
    objectName: "Stockpile A Batubara High-CV",
    surfaceAId: "surf-02",
    surfaceAName: "UAV Photogrammetry Surface August 12",
    surfaceBId: "surf-base-00",
    surfaceBName: "Stockpile Flat Base Level (38.0m RL)",
    boundaryName: "Stockpile A Polygon Footprint",
    method: "Stockpile Surface",
    volumeBcm: 32450, // 32,450 m3
    tonnage: 42185, // 32,450 * 1.3 t/m3 density
    densityFactor: 1.30,
    calculatedBy: "Ahmad Dani",
    status: "Verified",
    calculatedAt: "2026-08-12T19:30:00Z",
  },
  {
    id: "vol-02",
    calculationId: "VOL-PIT1-OB-AUG12",
    projectId: "PRJ-SURV-2026-01",
    objectType: "Pit",
    objectName: "Pit 1 South Overburden Removal Block 2",
    surfaceAId: "surf-01",
    surfaceAName: "Pit 1 July End Surface",
    surfaceBId: "surf-02",
    surfaceBName: "Pit 1 Mid-Aug Surface",
    boundaryName: "Pit 1 South Perimeter",
    method: "TIN-to-TIN",
    volumeBcm: 148200,
    tonnage: 340860, // OB Density ~ 2.3 t/m3
    densityFactor: 2.30,
    calculatedBy: "Budi Santoso",
    status: "Verified",
    calculatedAt: "2026-08-12T18:30:00Z",
  },
];

const INITIAL_DOCUMENTS: SurveyDocument[] = [
  {
    id: "sdoc-01",
    documentId: "DOC-SURV-CALIB-01",
    title: "Sertifikat Kalibrasi Total Station Leica TS16 2025",
    type: "Calibration Certificate",
    fileUrl: "/docs/survey/calibration_ts16.pdf",
    fileSizeMb: 1.8,
    uploadedBy: "Bambang Wijaya",
    createdAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "sdoc-02",
    documentId: "DOC-SURV-REP-AUG12",
    title: "Laporan Hasil Pengukuran Progress Tambang Pit 1 South Minggu II Agustus 2026",
    type: "Survey Report",
    fileUrl: "/docs/survey/report_aug12_2026.pdf",
    fileSizeMb: 4.2,
    uploadedBy: "Budi Santoso",
    createdAt: "2026-08-12T20:00:00Z",
  },
];

export class SurveyRepository {
  private static projects: SurveyProject[] = [...INITIAL_PROJECTS];
  private static points: SurveyPoint[] = [...INITIAL_POINTS];
  private static controlPoints: SurveyControlPoint[] = [...INITIAL_CONTROL_POINTS];
  private static equipment: SurveyEquipment[] = [...INITIAL_EQUIPMENT];
  private static surfaces: SurveySurface[] = [...INITIAL_SURFACES];
  private static dtms: DTMRecord[] = [...INITIAL_DTM];
  private static dsms: DSMRecord[] = [...INITIAL_DSM];
  private static contours: ContourDataset[] = [...INITIAL_CONTOURS];
  private static crossSections: CrossSection[] = [...INITIAL_CROSS_SECTIONS];
  private static cutFills: CutFillAnalysis[] = [...INITIAL_CUT_FILL];
  private static volumes: VolumeCalculation[] = [...INITIAL_VOLUMES];
  private static importJobs: SurveyImportJob[] = [...INITIAL_IMPORT_JOBS];
  private static documents: SurveyDocument[] = [...INITIAL_DOCUMENTS];
  private static devices: SurveyDeviceTelemetry[] = [...INITIAL_DEVICES];
  private static progressComparisons: ProgressComparisonRecord[] = [...INITIAL_PROGRESS_COMPARISONS];

  // Getters
  public static getProjects() { return this.projects; }
  public static getPoints() { return this.points; }
  public static getControlPoints() { return this.controlPoints; }
  public static getEquipment() { return this.equipment; }
  public static getSurfaces() { return this.surfaces; }
  public static getDTMs() { return this.dtms; }
  public static getDSMs() { return this.dsms; }
  public static getContours() { return this.contours; }
  public static getCrossSections() { return this.crossSections; }
  public static getCutFills() { return this.cutFills; }
  public static getVolumes() { return this.volumes; }
  public static getImportJobs() { return this.importJobs; }
  public static getDocuments() { return this.documents; }
  public static getDevices() { return this.devices; }
  public static getProgressComparisons() { return this.progressComparisons; }

  // Mutations
  public static addPoint(pt: SurveyPoint) {
    this.points.unshift(pt);
  }

  public static updatePoint(pt: SurveyPoint) {
    this.points = this.points.map((p) => (p.id === pt.id ? pt : p));
  }

  public static addSurface(surf: SurveySurface) {
    this.surfaces.unshift(surf);
  }

  public static addVolume(vol: VolumeCalculation) {
    this.volumes.unshift(vol);
  }

  public static addCutFill(cf: CutFillAnalysis) {
    this.cutFills.unshift(cf);
  }

  public static addContour(cnt: ContourDataset) {
    this.contours.unshift(cnt);
  }

  public static addImportJob(job: SurveyImportJob) {
    this.importJobs.unshift(job);
  }

  public static addDocument(doc: SurveyDocument) {
    this.documents.unshift(doc);
  }

  public static addDevice(dev: SurveyDeviceTelemetry) {
    this.devices.unshift(dev);
  }

  public static updateDevice(dev: SurveyDeviceTelemetry) {
    this.devices = this.devices.map((d) => (d.id === dev.id ? dev : d));
  }

  public static addProgressComparison(pcomp: ProgressComparisonRecord) {
    this.progressComparisons.unshift(pcomp);
  }
}
