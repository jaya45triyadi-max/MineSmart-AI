// MINE SMART AI - Enterprise Types Definition

import { LicenseStatus } from "./license";
export * from "./license";
export * from "./minePlanningTypes";
export * from "./geologyTypes";
export * from "./surveyTypes";
export * from "./equipmentTypes";
export * from "./fleetManagementTypes";
export * from "./dispatchTypes";
export * from "./haulingTypes";
export * from "./fuelTypes";
export * from "./maintenanceTypes";
export * from "./predictiveTypes";
export * from "./processingPlantTypes";
export * from "./stockpileTypes";
export * from "./salesTypes";
export * from "./weighbridgeTypes";
export * from "./hseTypes";
export * from "./environmentTypes";
export * from "./procurementTypes";
export type {
  LabSample,
  LabTest,
  QualityResult,
  QualitySpecification,
  QualityAnomaly,
  LabInstrument,
  LabCalibrationRecord,
  CertificateOfAnalysis,
  QualityTrendPoint,
  AIQualityInsight,
  LaboratoryReport,
  LabSampleType,
  LabAnomalySeverity,
  SampleStatus,
  SamplePriority,
  QualityBasis,
  TestType,
  TestStatus,
  ParameterStatus,
  AnomalyStatus,
  CalibrationStatus,
} from "./laboratoryTypes";

export type LicensePlan = "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE" | "ENTERPRISE_DEDICATED";

export type UserRole =
  | "SUPER_ADMIN"
  | "OWNER"
  | "DIRECTOR"
  | "GENERAL_MANAGER"
  | "MINE_MANAGER"
  | "ENGINEERING"
  | "GEOLOGY"
  | "SURVEY"
  | "PRODUCTION"
  | "DISPATCH"
  | "MAINTENANCE"
  | "HSE"
  | "ENVIRONMENT"
  | "HR"
  | "PROCUREMENT"
  | "WAREHOUSE"
  | "FINANCE"
  | "VIEWER"
  // Legacy aliases for backwards compatibility
  | "MINING_OWNER"
  | "SITE_MANAGER"
  | "MINE_ENGINEER"
  | "GEOLOGIST"
  | "SURVEYOR"
  | "DISPATCH_OPERATOR"
  | "MAINTENANCE_SUPERVISOR"
  | "HSE_OFFICER"
  | "FINANCE_MANAGER"
  | "SUPERVISOR";

export type ActionPermission =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "export"
  | "manage"
  | "admin";

export type NavigationModuleKey =
  | "landing"
  | "dashboard"
  | "ai"
  | "gis"
  | "mine-planning"
  | "geology"
  | "survey"
  | "equipment"
  | "fleet"
  | "dispatch"
  | "production"
  | "hauling"
  | "fuel"
  | "maintenance"
  | "predictive-maintenance"
  | "predictive"
  | "crusher"
  | "processing-plant"
  | "stockpile"
  | "weighbridge"
  | "laboratory"
  | "shipment"
  | "sales"
  | "hse"
  | "environment"
  | "reclamation"
  | "hr"
  | "attendance"
  | "procurement"
  | "warehouse"
  | "finance"
  | "documents"
  | "document-management"
  | "rkab"
  | "bi-builder"
  | "ai-prediction"
  | "smart-alerts"
  | "mobile-app"
  | "offline-sync"
  | "data-quality"
  | "quality-center"
  | "digital-approval"
  | "approval"
  | "approvals"
  | "security"
  | "reports"
  | "analytics"
  | "users"
  | "roles"
  | "license"
  | "multi-company"
  | "holding"
  | "integration-hub"
  | "api-center"
  | "iot-center"
  | "iot"
  | "cctv"
  | "ai-cctv"
  | "root-cause"
  | "ai-root-cause"
  | "ai-reports"
  | "report-generator"
  | "settings"
  | "audit"
  | "audit-trail"
  | "developer-control-panel"
  | "control-panel"
  | "admin-panel"
  | "design-system";

export * from "./developerControlPanelTypes";
export * from "./aiReportTypes";
export * from "./rootCauseTypes";
export * from "./cctvTypes";
export * from "./iotTypes";
export * from "./multiCompanyTypes";
export * from "./integrationTypes";
export * from "./documentTypes";
export * from "./rkabTypes";
export * from "./biBuilderTypes";
export * from "./aiPredictionEngineTypes";
export * from "./smartAlertTypes";
export * from "./mobileAppTypes";
export * from "./offlineSyncTypes";
export * from "./dataQualityTypes";
export * from "./approvalTypes";
export * from "./enterpriseSecurityTypes";
export * from "./auditTrailTypes";

// Global Base Document Convention
export interface BaseEntity {
  id: string;
  companyId?: string;
  siteId?: string;
  status?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Company extends BaseEntity {
  code: string;
  legalName: string;
  displayName: string;
  shortName: string;
  npwpMasked?: string;
  businessType: string;
  address?: string;
  province?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  timezone: string;
  currency: string;
  language: string;
  subscriptionPlan: LicensePlan;
  licenseId: string;
  licenseKey: string;
  name: string; // Alias for displayName
}

export interface Site extends BaseEntity {
  code: string;
  name: string;
  miningType: string;
  province: string;
  regency?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  operationalStatus: "ACTIVE" | "MAINTENANCE" | "SUSPENDED" | "CLOSED";
  productionTarget: {
    monthlyCoalMT: number;
    monthlyOBBCM: number;
  };
  startDate?: string;
  managerUserId?: string;
  managerName: string;
  location: string;
  targetCoalMonthlyMT: number;
  targetOBMonthlyBCM: number;
  activeStatus: boolean;
}

export interface Department extends BaseEntity {
  code: string;
  name: string;
  parentDepartmentId?: string;
  managerUserId?: string;
}

export interface UserProfile extends BaseEntity {
  uid: string;
  authUid?: string;
  email: string;
  displayName: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  companyName: string;
  siteIds: string[];
  activeSiteId: string;
  role: UserRole;
  departmentId?: string;
  department: string;
  roleIds?: string[];
  employeeId?: string;
  language?: string;
  timezone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  avatarUrl?: string;
}

export interface RolePermission extends BaseEntity {
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
}

export interface LicenseInfo {
  id?: string;
  licenseKey: string;
  companyId: string;
  companyName: string;
  ownerUserId?: string;
  plan: LicensePlan;
  status: LicenseStatus;
  activationDate: string;
  expirationDate: string;
  deviceLimit: number;
  userLimit: number;
  siteLimit?: number;
  activeUserCount: number;
  features: string[];
}

export interface OperationalKPIs {
  coalProductionTodayMT: number;
  coalTargetTodayMT: number;
  obProductionTodayBCM: number;
  obTargetTodayBCM: number;
  stripRatioActual: number;
  stripRatioPlan: number;
  fleetPhysicalAvailabilityPA: number;
  fleetUseOfAvailabilityUA: number;
  activeFleetCount: number;
  breakdownFleetCount: number;
  fuelConsumedLiters: number;
  fuelEfficiencyLitersPerBCM: number;
  hseIncidentFreeDays: number;
  hseNearMisses: number;
  romStockpileMT: number;
  cleanCoalStockpileMT: number;
  estimatedRevenueIDR: number;
  estimatedOperatingCostIDR: number;
}

export * from "./productionTypes";


export interface EquipmentItem extends BaseEntity {
  code: string;
  unitNumber?: string;
  assetNumber?: string;
  category: "EXCAVATOR" | "HAUL_TRUCK" | "BULLDOZER" | "GRADER" | "WATER_TRUCK" | "COMPACTOR" | "CRUSHER";
  equipmentType?: string;
  brandModel: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: number;
  manufactureYear?: number;
  engineHour?: number;
  workingHoursSMU: number;
  status: "OPERATING" | "STANDBY" | "BREAKDOWN" | "MAINTENANCE";
  currentStatus?: string;
  locationPit: string;
  currentLocation?: string;
  operatorName?: string;
  operatorId?: string;
  ownershipType?: "OWNED" | "RENTED" | "SUBCONTRACTOR";
  purchaseDate?: string;
  warrantyExpiry?: string;
  fuelType?: string;
  fuelLevelPercent: number;
  physicalAvailability: number;
  useOfAvailability: number;
}

export interface FleetStatus extends BaseEntity {
  equipmentId: string;
  location: string;
  latitude: number;
  longitude: number;
  speed: number;
  engineHour: number;
  fuelLevel: number;
  utilization: number;
  availability: number;
  operatorId?: string;
  lastTelemetryAt: string;
}

export interface TelemetryData extends BaseEntity {
  equipmentId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  engineHour: number;
  fuelLevel: number;
  engineTemperature: number;
  oilPressure: number;
  payload: number;
  source: string;
}

export interface MinePlan extends BaseEntity {
  planName: string;
  version: string;
  period: "SHORT_TERM" | "LONG_TERM" | "ANNUAL";
  targetSeam: string;
  targetCoalMT: number;
  targetOBBCM: number;
  stripRatioTarget: number;
  approvalStatus: "DRAFT" | "REVIEW" | "APPROVED" | "ARCHIVED";
}

export interface BoreholeData extends BaseEntity {
  boreholeCode: string;
  latitude: number;
  longitude: number;
  elevation: number;
  totalDepth: number;
  drillingDate: string;
  seamCode: string;
  calorificGAR: number;
  moisturePercent: number;
  ashPercent: number;
  sulfurPercent: number;
}

export interface SurveyProject extends BaseEntity {
  surveyCode: string;
  surveyDate: string;
  pitLocation: string;
  elevationRL: string;
  areaHa: number;
  volumeOBBCM: number;
  volumeCoalMT: number;
  surveyorName: string;
}

export interface DispatchCycle extends BaseEntity {
  truckId: string;
  truckCode: string;
  excavatorId: string;
  excavatorCode: string;
  loadingPoint: string;
  dumpingPoint: string;
  loadingStart: string;
  loadingEnd: string;
  haulingStart: string;
  haulingEnd: string;
  dumpingStart: string;
  dumpingEnd: string;
  cycleTimeMinutes: number;
  payloadTon: number;
  recordedAt: string;
}

export interface HaulingRecord extends BaseEntity {
  truckId: string;
  routeCode: string;
  distanceKM: number;
  cycleTimeMinutes: number;
  payloadTon: number;
  tripCount: number;
  fuelConsumedLiters: number;
  date: string;
  shift: string;
}

export interface FuelTank extends BaseEntity {
  tankCode: string;
  tankName: string;
  location: string;
  capacityLiters: number;
  currentLevelLiters: number;
  fuelType: string;
}

export interface FuelRecord extends BaseEntity {
  equipmentCode: string;
  equipmentId?: string;
  fuelTankCode: string;
  fuelTankId?: string;
  litersIssued: number;
  smuMeter: number;
  issuedAt: string;
  issuedBy: string;
  operatorId?: string;
  transactionType: "RECEIVE" | "DISPENSE" | "ADJUSTMENT" | "TRANSFER";
  costIDR: number;
}

export interface MaintenanceWorkOrder extends BaseEntity {
  woCode: string;
  equipmentId: string;
  equipmentCode: string;
  type: "PREVENTIVE" | "UNSCHEDULED" | "OVERHAUL" | "INSPECTION";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  problemDescription: string;
  workDescription: string;
  mechanicLead: string;
  assignedTo?: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  downtimeHours: number;
  laborCostIDR: number;
  partsCostIDR: number;
}

export interface StockpileItem extends BaseEntity {
  code: string;
  name: string;
  materialType: "ROM" | "CLEAN_COAL" | "CRUSHED";
  currentTonnage: number;
  location: string;
  qualityGAR: number;
}

export interface LabSampleRecord extends BaseEntity {
  sampleCode: string;
  batchId: string;
  pitLocation: string;
  samplingDate: string;
  calorificGAR: number;
  totalMoisture: number;
  inherentMoisture: number;
  ashContent: number;
  totalSulfur: number;
  volatileMatter: number;
  laboratoryName: string;
}

export interface ShipmentRecord extends BaseEntity {
  shipmentNumber: string;
  customerName: string;
  contractCode: string;
  vesselBargeName: string;
  coalType: string;
  targetQuantityMT: number;
  actualQuantityMT: number;
  destinationPort: string;
  shipmentDate: string;
}

export interface HSEIncidentRecord extends BaseEntity {
  type: "NEAR_MISS" | "FIRST_AID" | "MEDICAL_TREATMENT" | "LOST_TIME_INJURY" | "PROPERTY_DAMAGE";
  incidentNumber?: string;
  location: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  peopleInvolved?: string[];
  equipmentInvolved?: string[];
  immediateAction?: string;
  rootCause?: string;
  correctiveAction?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface EnvironmentRecord extends BaseEntity {
  monitoringPoint: string;
  parameter: "WATER_PH" | "AIR_DUST" | "TURBIDITY" | "NOISE";
  measuredValue: number;
  unit: string;
  standardLimit: number;
  isCompliant: boolean;
  sampleDate: string;
}

export interface EmployeeRecord extends BaseEntity {
  employeeNumber: string;
  fullName: string;
  position: string;
  departmentId: string;
  departmentName: string;
  employmentStatus: "PERMANENT" | "CONTRACT" | "SUBCONTRACTOR";
  joinDate: string;
  phone: string;
  emergencyContact: string;
}

export interface AttendanceRecord extends BaseEntity {
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  shift: string;
  attendanceStatus: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";
}

export interface PurchaseOrderRecord extends BaseEntity {
  poNumber: string;
  vendorName: string;
  category: string;
  itemsDescription: string;
  totalAmountIDR: number;
  requestorName: string;
  approvalStatus: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
}

export interface InventoryTransaction extends BaseEntity {
  itemCode: string;
  itemName: string;
  warehouseLocation: string;
  transactionType: "RECEIPT" | "ISSUE" | "TRANSFER" | "ADJUSTMENT";
  quantity: number;
  unitCostIDR: number;
  referenceDoc: string;
  transactionDate: string;
}

export interface FinancialTransaction extends BaseEntity {
  transactionCode: string;
  accountCategory: "REVENUE" | "OPEX" | "CAPEX" | "ROYALTY";
  description: string;
  amountIDR: number;
  costCenter: string;
  transactionDate: string;
}

export interface DocumentMetadata extends BaseEntity {
  title: string;
  category: "PERMIT" | "REPORT" | "DRAWING" | "CONTRACT" | "SAFETY";
  fileName: string;
  fileType: string;
  storagePath: string;
  version: string;
  accessLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL";
  uploadedBy: string;
  uploadedAt: string;
}

export interface AIConversation extends BaseEntity {
  userId: string;
  title: string;
}

export interface AIMessage {
  id: string;
  conversationId?: string;
  sender: "USER" | "AI" | "SYSTEM";
  text: string;
  timestamp: string;
  category?: "PRODUCTION" | "FLEET" | "FUEL" | "HSE" | "GENERAL";
  agentName?: string;
  model?: string;
}

export interface AIChatMessage extends AIMessage {}

export interface NotificationRecord {
  id: string;
  companyId: string;
  siteId?: string;
  recipientUserId: string;
  type: "ALERT" | "APPROVAL" | "SYSTEM" | "HSE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  companyId: string;
  siteId?: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  beforeData?: any;
  afterData?: any;
  ipAddress: string;
  details: string;
  timestamp: string;
}

export interface DailySummaryRecord extends BaseEntity {
  date: string;
  totalCoalMT: number;
  totalOBBCM: number;
  averageStripRatio: number;
  fleetPA: number;
  fleetUA: number;
  totalFuelLiters: number;
  fuelRatioLitersPerBCM: number;
  hseIncidentsCount: number;
  totalRevenueIDR: number;
  totalOpexIDR: number;
}

export * from "./financeTypes";
export * from "./aiTypes";

