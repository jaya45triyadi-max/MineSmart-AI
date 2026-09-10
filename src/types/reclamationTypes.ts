export interface ReclamationKPISummary {
  totalDisturbedAreaHa: number;
  activeMiningAreaHa: number;
  areaReadyForReclamationHa: number;
  areaUnderReclamationHa: number;
  areaReclaimedHa: number;
  areaRevegetatedHa: number;
  areaSuccessfullyEstablishedHa: number;
  plantingProgressPercent: number;
  reclamationProgressPercent: number;
  monitoringDueCount: number;
  monitoringOverdueCount: number;
  openReclamationIssuesCount: number;
  totalReclamationCostIDR: number;
  costPerHectareIDR: number;
  targetAreaYearHa: number;
  actualAreaYearHa: number;
  survivalRatePercent: number;
}

export type DisturbanceType =
  | "Mining"
  | "Hauling"
  | "Infrastructure"
  | "Stockpile"
  | "Disposal"
  | "Workshop"
  | "Road"
  | "Other";

export type DisturbedAreaStatus =
  | "ACTIVE"
  | "READY_FOR_RECLAMATION"
  | "UNDER_RECLAMATION"
  | "RECLAIMED"
  | "MONITORING"
  | "CLOSED";

export interface DisturbedArea {
  id: string;
  disturbedAreaId: string;
  companyId: string;
  siteId: string;
  name: string;
  code: string;
  pitId: string;
  pitName: string;
  blockId: string;
  blockName: string;
  latitude: number;
  longitude: number;
  elevation: number;
  areaHa: number;
  disturbanceType: DisturbanceType;
  disturbanceDate: string;
  currentLandUse: string;
  status: DisturbedAreaStatus;
  source: string;
  responsibleDept: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ProjectStatus =
  | "PLANNED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED";

export interface ReclamationProject {
  id: string;
  projectId: string;
  companyId: string;
  siteId: string;
  disturbedAreaId: string;
  disturbedAreaName: string;
  projectName: string;
  objective: string;
  targetAreaHa: number;
  reclaimedAreaHa: number;
  startDate: string;
  targetCompletionDate: string;
  responsiblePerson: string;
  contractorId: string;
  contractorName: string;
  budgetIDR: number;
  actualCostIDR: number;
  priority: ProjectPriority;
  status: ProjectStatus;
  assessmentStatus: "READY" | "NOT_READY" | "REQUIRES_ACTION";
  createdAt: string;
  updatedAt: string;
}

export interface ReclamationAssessment {
  id: string;
  projectId: string;
  topography: string;
  slopePercent: number;
  soilCondition: string;
  topsoilAvailabilityM3: number;
  drainageCondition: string;
  erosionRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  accessibility: string;
  revegetationReadiness: "READY" | "REQUIRES_PREPARATION" | "NOT_READY";
  environmentalRisk: string;
  assessedBy: string;
  assessedDate: string;
}

export type ActivityType =
  | "Land Shaping"
  | "Backfilling"
  | "Grading"
  | "Topsoil Spreading"
  | "Drainage Construction"
  | "Erosion Control"
  | "Soil Amendment"
  | "Mulching"
  | "Planting"
  | "Maintenance";

export interface ReclamationActivity {
  id: string;
  activityId: string;
  projectId: string;
  activityType: ActivityType;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  startDate: string;
  endDate: string;
  responsiblePerson: string;
  equipmentUsed: string[];
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  notes: string;
  evidencePhotoUrl?: string;
  costIDR: number;
}

export type SpeciesCategory =
  | "Cover Crop"
  | "Pioneer"
  | "Local Species"
  | "Fast Growing"
  | "Other";

export interface PlantSpecies {
  id: string;
  speciesId: string;
  name: string;
  scientificName: string;
  localName: string;
  category: SpeciesCategory;
  growthType: string;
  recommendedDensityPerHa: number;
  unit: string;
  status: "ACTIVE" | "INACTIVE";
}

export type PlantingStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "REPLANTING_REQUIRED";

export interface PlantingProgram {
  id: string;
  plantingProgramId: string;
  projectId: string;
  areaId: string;
  areaName: string;
  speciesId: string;
  speciesName: string;
  plantingDate: string;
  targetQuantity: number;
  actualQuantity: number;
  targetDensityPerHa: number;
  actualDensityPerHa: number;
  responsiblePerson: string;
  contractorName: string;
  seedlingsReceived: number;
  seedlingsPlanted: number;
  seedlingsDamaged: number;
  seedlingsReplaced: number;
  seedlingsSurvived: number;
  seedlingsFailed: number;
  survivalRatePercent: number;
  status: PlantingStatus;
}

export interface ReclamationMonitoringPoint {
  id: string;
  monitoringPointId: string;
  projectId: string;
  areaId: string;
  areaName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  elevation: number;
  monitoringType: "Vegetation" | "Erosion" | "Soil" | "Drainage" | "Overall";
  frequency: "Weekly" | "Monthly" | "Quarterly" | "Annual";
  responsiblePerson: string;
  lastMonitoringDate: string;
  nextMonitoringDate: string;
  status: "NORMAL" | "WARNING" | "CRITICAL" | "OVERDUE";
}

export interface ReclamationMonitoringForm {
  id: string;
  monitoringPointId: string;
  date: string;
  inspectorName: string;
  plantHealth: "GOOD" | "FAIR" | "POOR" | "CRITICAL";
  survivalRatePercent: number;
  vegetationCoveragePercent: number;
  bareAreaPercent: number;
  erosionSeverity: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  drainageCondition: "GOOD" | "PARTIALLY_BLOCKED" | "BLOCKED" | "DAMAGED";
  soilCondition: string;
  pestDiseasePresent: boolean;
  pestDiseaseNotes?: string;
  photoBeforeUrl?: string;
  photoAfterUrl?: string;
  gpsCoordinates: string;
  remarks: string;
  replantingRequired: boolean;
  replantingTargetQuantity?: number;
}

export type MaintenanceActivityType =
  | "Watering"
  | "Weeding"
  | "Fertilization"
  | "Replanting"
  | "Pest Control"
  | "Erosion Repair"
  | "Drainage Maintenance"
  | "Other";

export interface ReclamationMaintenance {
  id: string;
  maintenanceId: string;
  projectId: string;
  areaName: string;
  date: string;
  activity: MaintenanceActivityType;
  quantity: number;
  unit: string;
  equipment: string;
  workersCount: number;
  costIDR: number;
  responsiblePerson: string;
  evidencePhotoUrl?: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PLANNED";
}

export interface SoilAndTopsoilRecord {
  id: string;
  recordId: string;
  sourceArea: string;
  destinationArea: string;
  volumeM3: number;
  date: string;
  quality: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
  operator: string;
  equipment: string;
  type: "TOPSOIL_STOCK" | "TOPSOIL_SPREAD" | "SOIL_AMENDMENT";
}

export type CostCategory =
  | "Land Preparation"
  | "Topsoil"
  | "Equipment"
  | "Labor"
  | "Seedling"
  | "Planting"
  | "Maintenance"
  | "Monitoring"
  | "Contractor"
  | "Other";

export interface ReclamationCostRecord {
  id: string;
  costId: string;
  projectId: string;
  projectName: string;
  costCategory: CostCategory;
  description: string;
  budgetIDR: number;
  actualCostIDR: number;
  areaHa: number;
  costPerHaIDR: number;
  date: string;
  contractorName: string;
  approvedBy: string;
}

export interface ReclamationAIInsight {
  id: string;
  title: string;
  finding: string;
  evidence: string;
  trend: string;
  possibleCauses: string[];
  reclamationRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  expectedImpact: string;
  confidence: string;
}

export interface ReclamationDocument {
  id: string;
  documentNumber: string;
  title: string;
  category:
    | "RECLAMATION_PLAN"
    | "REVEGETATION_PLAN"
    | "PLANTING_RECORD"
    | "MONITORING_REPORT"
    | "SURVEY_DTM"
    | "DRONE_ORTHO"
    | "COMPLIANCE_EVIDENCE"
    | "CONTRACT";
  uploadDate: string;
  issuer: string;
  fileSize: string;
  status: "VALID" | "ARCHIVED" | "UNDER_REVIEW";
}
