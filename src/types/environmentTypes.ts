// MINE SMART AI - Environmental Management Types

export type MonitoringPointType =
  | "WATER"
  | "AIR"
  | "DUST"
  | "DRAINAGE"
  | "SEDIMENT_POND"
  | "WASTE"
  | "OTHER";

export type MonitoringPointStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE" | "OFFLINE";

export interface MonitoringPoint {
  id: string;
  monitoringPointId: string;
  companyId: string;
  siteId: string;
  code: string;
  name: string;
  type: MonitoringPointType;
  locationName: string;
  latitude: number;
  longitude: number;
  elevation: number;
  coordinateSystem: string;
  status: MonitoringPointStatus;
  samplingFrequency: "DAILY" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY" | "QUARTERLY";
  responsiblePerson: string;
  lastSampleDate?: string;
  createdAt: string;
  updatedAt: string;
}

// --- WATER MANAGEMENT ---
export type WaterSampleType =
  | "RAW_WATER"
  | "PIT_WATER"
  | "RUNOFF"
  | "SURFACE_WATER"
  | "GROUNDWATER"
  | "DISCHARGE_WATER"
  | "PROCESS_WATER"
  | "DOMESTIC_WASTEWATER";

export type WaterSampleStatus =
  | "SCHEDULED"
  | "COLLECTED"
  | "IN_LAB"
  | "TESTED"
  | "APPROVED"
  | "REJECTED";

export type ComplianceStatus = "COMPLIANT" | "WARNING" | "NON_COMPLIANT" | "NOT_ASSESSED";

export interface WaterSample {
  id: string;
  sampleId: string;
  sampleNumber: string;
  companyId: string;
  siteId: string;
  monitoringPointId: string;
  monitoringPointName: string;
  sampleDate: string;
  sampleTime: string;
  sampleType: WaterSampleType;
  weatherCondition: string;
  collectorName: string;
  laboratoryName: string;
  chainOfCustodyNumber: string;
  status: WaterSampleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaterQualityResult {
  id: string;
  sampleId: string;
  parameter: string; // pH, TSS, TDS, Fe, Mn, DO, COD, BOD, Oil & Grease, Sulfate
  value: number;
  unit: string;
  detectionLimit: number;
  method: string;
  standardLimitMin?: number;
  standardLimitMax?: number;
  standardId: string;
  complianceStatus: ComplianceStatus;
  testedBy: string;
  testedAt: string;
}

export interface WaterDischargeRecord {
  id: string;
  dischargeId: string;
  siteId: string;
  pointName: string;
  date: string;
  volumeM3: number;
  flowRateLps: number;
  pH: number;
  tssMgL: number;
  permitNumber: string;
  complianceStatus: ComplianceStatus;
}

export interface WaterBalanceSummary {
  date: string;
  openingStorageM3: number;
  inflowRainfallM3: number;
  inflowPitWaterM3: number;
  usageCrusherM3: number;
  usageRoadWateringM3: number;
  dischargeVolumeM3: number;
  lossesEvaporationM3: number;
  closingStorageM3: number;
}

// --- AIR QUALITY MANAGEMENT ---
export interface AirMonitoringStation {
  id: string;
  stationId: string;
  companyId: string;
  siteId: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  parametersMonitored: string[]; // PM10, PM2.5, SO2, NO2, CO, TSP
  deviceId: string;
  status: "ONLINE" | "OFFLINE" | "CALIBRATION";
  lastReadingAt: string;
  calibrationStatus: "VALID" | "DUE_SOON" | "EXPIRED";
}

export interface AirQualityReading {
  id: string;
  readingId: string;
  stationId: string;
  stationName: string;
  timestamp: string;
  parameter: "PM10" | "PM2.5" | "SO2" | "NO2" | "CO" | "TSP";
  value: number;
  unit: string;
  standardLimit: number;
  source: "SENSOR" | "MANUAL" | "LABORATORY" | "IMPORT" | "API";
  qualityFlag: "GOOD" | "SUSPECT" | "BAD";
  complianceStatus: ComplianceStatus;
}

// --- DUST MANAGEMENT ---
export interface DustMonitoringRecord {
  id: string;
  dustMonitoringId: string;
  monitoringPointId: string;
  monitoringPointName: string;
  date: string;
  time: string;
  dustSource: "Haul Road" | "Pit" | "Crusher" | "Stockpile" | "Disposal" | "Loading Area";
  valueUgM3: number;
  weatherCondition: string;
  windSpeedKmh: number;
  windDirection: string;
  status: "NORMAL" | "ELEVATED" | "CRITICAL";
  remarks?: string;
}

export interface WaterTruckDustControl {
  id: string;
  truckUnitId: string;
  driverName: string;
  routeSector: string;
  waterVolumeLiters: number;
  tripCount: number;
  durationMinutes: number;
  areaCoveredKm: number;
  date: string;
  status: "ACTIVE" | "COMPLETED";
}

// --- WASTE MANAGEMENT ---
export type WasteCategory =
  | "HAZARDOUS_B3"
  | "NON_HAZARDOUS"
  | "DOMESTIC"
  | "INDUSTRIAL"
  | "USED_OIL"
  | "USED_FILTER"
  | "CONTAMINATED_SOIL"
  | "SCRAP_METAL"
  | "CHEMICAL_WASTE";

export type WasteStatus =
  | "GENERATED"
  | "COLLECTED"
  | "STORED"
  | "IN_TRANSIT"
  | "TREATED"
  | "RECYCLED"
  | "DISPOSED"
  | "CLOSED";

export interface EnvironmentalWasteRecord {
  id: string;
  wasteId: string;
  companyId: string;
  siteId: string;
  wasteType: string;
  category: WasteCategory;
  sourceLocation: string;
  generationDate: string;
  quantity: number;
  unit: "KG" | "TON" | "LITER" | "BARREL" | "DRUM";
  temporaryStorageLocation: string;
  destinationHandler: string;
  transportMethod: string;
  manifestNumber: string;
  status: WasteStatus;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

// --- DRAINAGE MANAGEMENT ---
export interface DrainagePoint {
  id: string;
  drainageId: string;
  siteId: string;
  name: string;
  type: "CHANNEL" | "CULVERT" | "SUMP" | "DIVERSION" | "OUTLET";
  locationName: string;
  capacityM3s: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  inspectionFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  lastInspectionDate: string;
  nextInspectionDate: string;
  responsiblePerson: string;
}

export interface DrainageInspection {
  id: string;
  inspectionId: string;
  drainageId: string;
  drainageName: string;
  inspectionDate: string;
  inspectorName: string;
  hasBlockage: boolean;
  hasErosion: boolean;
  hasSedimentation: boolean;
  hasOverflow: boolean;
  structuralDamage: boolean;
  overallCondition: "NORMAL" | "WARNING" | "CRITICAL";
  notes: string;
  correctiveActionRequired: boolean;
  capaId?: string;
}

// --- SEDIMENT POND MANAGEMENT ---
export interface SedimentPond {
  id: string;
  pondId: string;
  siteId: string;
  name: string;
  locationName: string;
  designCapacityM3: number;
  currentWaterVolumeM3: number;
  currentSedimentVolumeM3: number;
  waterLevelMeter: number;
  sedimentLevelMeter: number;
  freeboardMeter: number;
  capacityOccupiedPercent: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  lastInspectionDate: string;
  nextInspectionDate: string;
}

export interface SedimentPondInspection {
  id: string;
  inspectionId: string;
  pondId: string;
  pondName: string;
  date: string;
  inspectorName: string;
  waterLevel: number;
  sedimentLevel: number;
  freeboard: number;
  phValue: number;
  tssValue: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  dredgingRequired: boolean;
  remarks: string;
}

// --- ENVIRONMENTAL COMPLIANCE & PERMITS ---
export interface EnvironmentalStandard {
  id: string;
  standardId: string;
  name: string; // e.g., "Baku Mutu Air Limbah Tambang Batubara Permen LHK No. 113/2003"
  version: string;
  jurisdiction: string;
  parameter: string;
  minLimit?: number;
  maxLimit?: number;
  unit: string;
  condition?: string;
  effectiveDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "SUPERSEDED" | "EXPIRED" | "DRAFT";
}

export interface EnvironmentalComplianceRequirement {
  id: string;
  requirementId: string;
  companyId: string;
  siteId: string;
  category: "WATER" | "AIR" | "DUST" | "WASTE" | "DRAINAGE" | "RECLAMATION" | "REPORTING";
  title: string;
  description: string;
  referenceDoc: string;
  parameter: string;
  limitText: string;
  monitoringFrequency: string;
  reportingFrequency: string;
  responsiblePerson: string;
  dueDate: string;
  complianceStatus: ComplianceStatus;
  createdAt: string;
}

export interface EnvironmentalPermit {
  id: string;
  permitId: string;
  permitNumber: string;
  permitType: "AMDAL" | "UKL_UPL" | "IPLC_WATER_DISCHARGE" | "TPS_LB3_HAZARDOUS" | "AIR_EMISSION";
  issuerAuthority: string;
  effectiveDate: string;
  expiryDate: string;
  daysToExpiry: number;
  status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "SUSPENDED" | "RENEWAL";
  documentUrl?: string;
}

// --- INCIDENTS & CAPA INTEGRATION ---
export interface EnvironmentalIncident {
  id: string;
  incidentId: string;
  incidentNumber: string;
  companyId: string;
  siteId: string;
  incidentType: "SPILL" | "WATER_CONTAMINATION" | "DUST_EVENT" | "WASTE_LEAKAGE" | "DRAINAGE_OVERFLOW" | "SEDIMENT_FAILURE";
  severity: "MINOR" | "MODERATE" | "MAJOR" | "CRITICAL";
  locationName: string;
  incidentDate: string;
  reportedBy: string;
  description: string;
  immediateAction: string;
  containmentStatus: "CONTAINED" | "IN_PROGRESS" | "UNCONTAINED";
  status: "REPORTED" | "INVESTIGATING" | "ACTION_REQUIRED" | "CLOSED";
}

export interface EnvironmentalCAPA {
  id: string;
  actionId: string;
  actionNumber: string;
  sourceType: "INCIDENT" | "INSPECTION" | "AUDIT" | "COMPLIANCE_NON_CONFORMITY";
  sourceId: string;
  findingDescription: string;
  correctiveAction: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedTo: string;
  department: string;
  dueDate: string;
  status: "OPEN" | "IN_PROGRESS" | "PENDING_VERIFICATION" | "VERIFIED" | "CLOSED";
  verificationNotes?: string;
  verifiedBy?: string;
}

// --- AI & ANALYTICS ---
export interface EnvironmentalAIInsight {
  id: string;
  title: string;
  category: "WATER" | "AIR" | "DUST" | "WASTE" | "SEDIMENT" | "COMPLIANCE";
  finding: string;
  evidence: string;
  trend: string;
  possibleCauses: string[];
  environmentalRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  expectedImpact: string;
  confidence: string; // e.g. "92% Confidence"
  createdAt: string;
}

export interface EnvironmentalKPISummary {
  environmentalScore: number; // 0 - 100
  waterComplianceRate: number; // %
  airQualityIndex: string; // "GOOD", "MODERATE", etc.
  dustControlCoveragePercent: number; // %
  totalWasteGeneratedTons: number;
  hazardousWasteStoredTons: number;
  sedimentPondAvgCapacityPercent: number;
  openEnvironmentalIncidents: number;
  openCAPA: number;
  overdueCAPA: number;
  activePermitsCount: number;
  expiringPermitsCount: number;
}

export interface EnvironmentalOfflineDraft {
  id: string;
  type: "WATER_SAMPLE" | "DRAINAGE_INSPECTION" | "SEDIMENT_INSPECTION" | "WASTE_RECORD" | "INCIDENT";
  data: any;
  createdAt: string;
  syncStatus: "DRAFT" | "PENDING_SYNC" | "SYNCED" | "SYNC_FAILED";
}

// --- EROSION MONITORING & CONTROL TYPES ---
export type ErosionSeverity = "NONE" | "VERY_LOW" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type ErosionType = "SPLASH" | "SHEET" | "RILL" | "GULLY" | "STREAMBANK" | "LANDSLIP";

export interface ErosionMonitoringRecord {
  id: string;
  recordId: string;
  locationName: string;
  slopePercent: number;
  slopeLengthMeters: number;
  erosionType: ErosionType;
  severity: ErosionSeverity;
  estimatedLossTonHaYear: number;
  toleranceLimitTonHaYear: number;
  gullyDepthCm?: number;
  vegetationCoverPercent: number;
  controlMeasureInPlace: string;
  controlStatus: "EFFECTIVE" | "NEEDS_MAINTENANCE" | "FAILED" | "NOT_INSTALLED";
  inspectorName: string;
  inspectionDate: string;
  photoUrl?: string;
  actionRequired?: string;
}

export interface ErosionControlStructure {
  id: string;
  code: string;
  name: string;
  structureType: "CHECK_DAM" | "DROP_STRUCTURE" | "GEOTEXTILE_COCOMESH" | "HYDROSEEDING" | "TERRACE_BENCH" | "VETIVER_HEDGE" | "RIPRAP_ROCK";
  location: string;
  installationDate: string;
  lengthOrArea: string; // e.g. "450 m²" or "12 Units"
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  lastMaintainedDate: string;
  nextInspectionDue: string;
  sedimentTrappedM3: number;
  status: "ACTIVE" | "MAINTENANCE_REQUIRED" | "REPAIRED";
}

// --- REVEGETATION & NURSERY TYPES ---
export interface RevegetationPlot {
  id: string;
  plotCode: string;
  blockName: string;
  areaHa: number;
  plantingDate: string;
  targetTreesPerHa: number;
  actualTreesPlanted: number;
  dominantSpecies: string[];
  survivalRatePercent: number;
  canopyDensityPercent: number;
  averageHeightMeters: number;
  averageDiameterCm: number;
  healthStatus: "HEALTHY" | "MODERATE" | "STRESSED" | "HIGH_MORTALITY";
  maintenanceStatus: "ROUTINE" | "FERTILIZATION_DUE" | "WEEDING_DUE" | "REPLANTING_REQUIRED";
  lastInspectionDate: string;
  nextActivityDate: string;
}

export interface NurseryInventoryItem {
  id: string;
  speciesName: string;
  botanicalName: string;
  category: "PIONEER_FAST_GROWING" | "LOCAL_CLIMAX" | "COVER_CROP_LEGUME" | "FRUIT_MULTINUTRITION" | "SOIL_BINDER";
  readyStockCount: number;
  seedlingInNurseryCount: number;
  germinationRatePercent: number;
  distributedToDateCount: number;
  monthlyTargetCount: number;
  growthTimeWeeks: number;
  bagSizeCm: string;
  status: "OPTIMAL" | "LOW_STOCK" | "RESTOCK_IN_PROGRESS";
}

// --- RECLAMATION LAND RESHAPING TYPES ---
export interface ReclamationLandParcel {
  id: string;
  parcelCode: string;
  pitOrDisposalName: string;
  targetLandUse: "PRODUCTION_FOREST" | "CONSERVATION_FOREST" | "AGROFORESTRY" | "RAW_WATER_RESERVOIR" | "ECOTOURISM";
  totalAreaHa: number;
  reshapedAreaHa: number;
  topsoilSpreadingAreaHa: number;
  revegetatedAreaHa: number;
  slopeAngleDeg: number;
  topsoilThicknessCm: number;
  soilPh: number;
  backfillingVolumeM3: number;
  reclamationGuaranteeBondIDR: number; // Jaminan Reklamasi ESDM
  relinquishmentStatus: "UNDER_PREPARATION" | "READY_FOR_EVALUATION" | "ESDM_APPROVED" | "BOND_RELEASED";
  status: "LAND_RESHAPING" | "TOPSOIL_SPREADING" | "COVER_CROPPING" | "FAST_GROWING_PLANTED" | "LOCAL_SPECIES_PLANTED" | "FINAL_ESTABLISHED";
}

// --- ENVIRONMENTAL PERFORMANCE SCORECARD (PROPER / ESDM / GHG) ---
export interface EnvironmentalPerformanceScorecard {
  overallScore: number; // 0 - 100
  properRatingTarget: "EMAS" | "HIJAU" | "BIRU" | "MERAH" | "HITAM";
  properPredictedStatus: "HIJAU_CONFIRMED" | "ON_TRACK_EMAS" | "BIRU_SAFE";
  complianceScorePercent: number;
  waterQualityIndexScore: number; // 0 - 100
  airQualityIndexScore: number; // 0 - 100
  reclamationFulfillmentRatePercent: number;
  biodiversityIndex: number; // Shannon-Wiener Index e.g. 2.84
  hazardousWasteCompliancePercent: number;
  ghgScope1EmissionsTonsCO2e: number;
  ghgScope2EmissionsTonsCO2e: number;
  carbonOffsetRevegetationTonsCO2e: number;
  netCarbonIntensityTonCO2ePerTonCoal: number;
  sedimentRetentionEfficiencyPercent: number;
  spillIncidentsCountYTD: number;
  esdmAuditReadinessPercent: number;
}

