// MINE SMART AI - HSE / K3 Management Comprehensive Types

import { BaseEntity } from "./index";

export type IncidentType =
  | "ACCIDENT"
  | "NEAR_MISS"
  | "PROPERTY_DAMAGE"
  | "ENVIRONMENTAL"
  | "MEDICAL"
  | "FIRST_AID"
  | "VEHICLE"
  | "EQUIPMENT"
  | "FIRE"
  | "OTHER";

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "REPORTED"
  | "ACKNOWLEDGED"
  | "UNDER_INVESTIGATION"
  | "ACTION_REQUIRED"
  | "VERIFICATION"
  | "CLOSED"
  | "REJECTED";

export interface HSEIncident extends BaseEntity {
  incidentId: string;
  companyId: string;
  siteId: string;
  incidentNumber: string;
  incidentDate: string;
  incidentTime: string;
  reportedAt: string;
  locationId: string;
  locationName: string;
  departmentId?: string;
  departmentName?: string;
  activityId?: string;
  activityName?: string;
  reportedBy: string;
  involvedPersons?: string[];
  equipmentInvolved?: string[];
  incidentType: IncidentType;
  type?: IncidentType; // Backward compatibility
  severity: IncidentSeverity;
  description: string;
  immediateAction: string;
  status: IncidentStatus;
  investigationStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  rootCauseStatus: "PENDING" | "ANALYZED" | "VERIFIED";
  correctiveActionStatus: "OPEN" | "IN_PROGRESS" | "VERIFIED" | "CLOSED";
  rootCause?: string;
  correctiveAction?: string;
  attachments?: string[];
  gpsCoordinates?: { lat: number; lng: number };
}

export type HSEIncidentRecord = HSEIncident; // Alias for backward compatibility

// Accident Classification
export type AccidentClassification =
  | "FIRST_AID"
  | "MEDICAL_TREATMENT"
  | "RESTRICTED_WORK"
  | "LOST_TIME_INJURY"
  | "SERIOUS_INJURY"
  | "FATALITY"
  | "PROPERTY_DAMAGE"
  | "VEHICLE_ACCIDENT"
  | "EQUIPMENT_ACCIDENT";

export interface AccidentRecord extends BaseEntity {
  accidentId: string;
  incidentId: string;
  incidentNumber: string;
  classification: AccidentClassification;
  personName: string;
  employeeId: string;
  companyName: string;
  injuryType: string;
  bodyPart: string;
  treatment: string;
  lostWorkDays: number;
  restrictedWorkDays: number;
  medicalTreatment: boolean;
  hospitalization: boolean;
  fatality: boolean;
  propertyDamage: boolean;
  estimatedDamageCost: number; // IDR / USD
  notes?: string;
}

export interface NearMissRecord extends BaseEntity {
  nearMissId: string;
  incidentNumber: string;
  date: string;
  time: string;
  locationName: string;
  activityName: string;
  description: string;
  potentialConsequence: string;
  immediateAction: string;
  potentialSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  potentialProbability: "UNLIKELY" | "POSSIBLE" | "LIKELY" | "VERY_LIKELY";
  potentialRiskScore: number; // 1 - 25
  potentialRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  photoUrl?: string;
  reporterName: string;
  status: "REPORTED" | "REVIEWED" | "ACTION_ASSIGNED" | "CLOSED";
}

// Hazard Management
export type HazardCategory =
  | "Vehicle"
  | "Mobile Equipment"
  | "Heavy Equipment"
  | "Electrical"
  | "Mechanical"
  | "Ground Control"
  | "Geotechnical"
  | "Traffic"
  | "Hauling Road"
  | "Dust"
  | "Noise"
  | "Chemical"
  | "Fire"
  | "Explosion"
  | "Working at Height"
  | "Confined Space"
  | "Lifting"
  | "Ergonomic"
  | "Environmental"
  | "Weather"
  | "Fatigue"
  | "Human Factor"
  | "Other";

export type HazardStatus = "OPEN" | "ASSESSED" | "CONTROLLED" | "MONITORING" | "CLOSED";

export interface Hazard extends BaseEntity {
  hazardId: string;
  companyId: string;
  siteId: string;
  locationId: string;
  locationName: string;
  activityName: string;
  category: HazardCategory;
  description: string;
  source: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  riskScore: number;
  existingControls: string;
  recommendedControls: string;
  reportedBy: string;
  status: HazardStatus;
  dueDate: string;
  photoUrl?: string;
  assignedTo?: string;
}

// Inspection
export type InspectionType =
  | "Daily Inspection"
  | "Weekly Inspection"
  | "Monthly Inspection"
  | "Equipment Inspection"
  | "Road Inspection"
  | "Pit Inspection"
  | "Workshop Inspection"
  | "Plant Inspection"
  | "Stockpile Inspection"
  | "Camp Inspection"
  | "Electrical Inspection"
  | "Fire Inspection"
  | "Emergency Equipment Inspection";

export interface InspectionChecklistItem {
  itemId: string;
  category: string;
  requirement: string;
  status: "PASS" | "FAIL" | "NA";
  observation?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  photoUrl?: string;
  correctiveActionRequired?: boolean;
}

export interface HSEInspection extends BaseEntity {
  inspectionId: string;
  inspectionNumber: string;
  companyId: string;
  siteId: string;
  locationName: string;
  inspectionType: InspectionType;
  inspectorName: string;
  inspectionDate: string;
  items: InspectionChecklistItem[];
  overallResult: "PASS" | "FAIL_WITH_ACTION" | "CRITICAL_FAIL";
  passCount: number;
  failCount: number;
  naCount: number;
  status: "IN_PROGRESS" | "COMPLETED" | "SYNCED_OFFLINE";
  notes?: string;
  gpsLocation?: { lat: number; lng: number };
}

// Behavior Based Safety / Observation
export type ObservationClassification =
  | "SAFE_ACT"
  | "UNSAFE_ACT"
  | "SAFE_CONDITION"
  | "UNSAFE_CONDITION"
  | "POSITIVE_OBSERVATION"
  | "IMPROVEMENT_OPPORTUNITY";

export interface SafetyObservation extends BaseEntity {
  observationId: string;
  locationName: string;
  activityName: string;
  observerName: string;
  description: string;
  classification: ObservationClassification;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  photoUrl?: string;
  immediateActionTaken?: string;
  correctiveActionId?: string;
  status: "OPEN" | "REVIEWED" | "RESOLVED";
}

// Job Safety Analysis (JSA)
export interface JSAStep {
  stepNumber: number;
  stepDescription: string;
  hazards: string[];
  potentialConsequences: string[];
  existingControls: string[];
  initialLikelihood: number; // 1-5
  initialSeverity: number; // 1-5
  initialRiskScore: number;
  initialRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  additionalControls: string[];
  controlHierarchy: "Elimination" | "Substitution" | "Engineering Control" | "Administrative Control" | "PPE";
  residualLikelihood: number;
  residualSeverity: number;
  residualRiskScore: number;
  residualRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
}

export interface JSA extends BaseEntity {
  jsaId: string;
  jsaNumber: string;
  title: string;
  activityName: string;
  locationName: string;
  departmentName: string;
  jobOwner: string;
  participants: string[];
  jobSteps: JSAStep[];
  requiredPPE: string[];
  approvalStatus: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  approvedAt?: string;
  validFrom: string;
  validUntil: string;
}

// Permit to Work (PTW)
export type PermitType =
  | "Hot Work"
  | "Confined Space"
  | "Working at Height"
  | "Electrical"
  | "Excavation"
  | "Lifting"
  | "Isolation / LOTO"
  | "Work Near Water"
  | "Critical Activity"
  | "Other";

export type PermitStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "COMPLETED"
  | "CLOSED"
  | "REJECTED";

export interface WorkPermit extends BaseEntity {
  permitId: string;
  permitNumber: string;
  permitType: PermitType;
  companyId: string;
  siteId: string;
  locationName: string;
  activityName: string;
  requesterName: string;
  contractorName?: string;
  supervisorName: string;
  workers: string[];
  startTime: string;
  endTime: string;
  jsaId?: string;
  jsaApproved: boolean;
  riskAssessmentDone: boolean;
  requiredControls: string[];
  requiredPPE: string[];
  isolationLOTORequired: boolean;
  isolationLOTOVerified: boolean;
  emergencyPlanDefined: boolean;
  approvalStatus: PermitStatus;
  approvedBy?: string;
  rejectionReason?: string;
  invalidationReasons?: string[];
}

// Toolbox Meeting
export type ToolboxTopic =
  | "Traffic Safety"
  | "Fatigue"
  | "PPE"
  | "Ground Control"
  | "Hauling"
  | "Heavy Equipment"
  | "Electrical Safety"
  | "Fire Safety"
  | "Working at Height"
  | "Confined Space"
  | "Weather"
  | "Emergency Response"
  | "Environmental"
  | "Housekeeping"
  | "Other";

export interface ToolboxParticipant {
  personId: string;
  name: string;
  company: string;
  role: string;
  attendanceStatus: "PRESENT" | "ABSENT" | "EXCUSED";
  digitalSignature?: boolean;
}

export interface ToolboxMeeting extends BaseEntity {
  meetingId: string;
  meetingNumber: string;
  date: string;
  time: string;
  locationName: string;
  supervisorName: string;
  topic: ToolboxTopic;
  activityName: string;
  keyHazardsDiscussed: string[];
  requiredControlsDiscussed: string[];
  participants: ToolboxParticipant[];
  presentCount: number;
  discussionNotes: string;
  photoUrl?: string;
}

// Risk Assessment & Heatmap
export interface RiskAssessmentItem extends BaseEntity {
  riskAssessmentId: string;
  activityName: string;
  locationName: string;
  hazardDescription: string;
  consequence: string;
  likelihood: number; // 1-5
  severity: number; // 1-5
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  controls: string;
  controlHierarchy: "Elimination" | "Substitution" | "Engineering Control" | "Administrative Control" | "PPE";
  residualLikelihood: number;
  residualSeverity: number;
  residualRiskScore: number;
  residualRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  ownerName: string;
  reviewDate: string;
  status: "ACTIVE" | "REVIEW_DUE" | "CLOSED";
}

// Corrective Action (CAPA)
export type CorrectiveActionSource =
  | "Incident"
  | "Accident"
  | "Near Miss"
  | "Hazard"
  | "Inspection"
  | "Observation"
  | "JSA"
  | "Permit"
  | "Risk Assessment"
  | "Audit"
  | "Other";

export type CorrectiveActionStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "CLOSED"
  | "OVERDUE"
  | "REJECTED";

export interface CorrectiveActionItem extends BaseEntity {
  actionId: string;
  actionNumber: string;
  sourceType: CorrectiveActionSource;
  sourceId: string;
  description: string;
  rootCause?: string;
  actionType: "CORRECTIVE" | "PREVENTIVE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ownerName: string;
  departmentName: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// Witness Statement
export interface IncidentWitness {
  witnessId: string;
  incidentId: string;
  name: string;
  employeeId: string;
  company: string;
  contact: string;
  statement: string;
  statementDate: string;
}

// Contractor HSE
export interface ContractorHSE extends BaseEntity {
  contractorId: string;
  companyName: string;
  activeWorkerCount: number;
  incidentRate: number;
  openActionCount: number;
  permitCompliancePercent: number;
  inspectionCompliancePercent: number;
  trainingCompliancePercent: number;
  safetyRating: "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "WARNING";
}

// Emergency Management
export interface EmergencyContact {
  contactId: string;
  name: string;
  role: string;
  phone: string;
  radioFrequency: string;
  location: string;
  isPrimary: boolean;
}

export interface EmergencyPlan {
  planId: string;
  siteName: string;
  assemblyPoints: string[];
  responseTeamCount: number;
  lastDrillDate: string;
  nextDrillDate: string;
}

// Environmental Incident
export interface EnvironmentalIncidentRecord extends BaseEntity {
  envIncidentId: string;
  incidentNumber: string;
  category: "Spill" | "Water Pollution" | "Dust" | "Air Quality" | "Noise" | "Waste" | "Land Disturbance" | "Other";
  volumeEstimated?: string;
  substanceName?: string;
  containmentStatus: "CONTAINED" | "CLEANUP_IN_PROGRESS" | "RESOLVED";
  locationName: string;
  reportedDate: string;
  description: string;
}

// AI Insight
export interface HSEAIInsight {
  id: string;
  finding: string;
  evidence: string;
  trend: string;
  possibleCause: string;
  risk: string;
  recommendation: string;
  expectedImpact: string;
  confidence: "Low" | "Medium" | "High";
  timestamp: string;
}

// HSE KPI Summary
export interface HSEKPISummary {
  totalIncidents: number;
  accidentsCount: number;
  nearMissCount: number;
  openHazardsCount: number;
  openActionsCount: number;
  overdueActionsCount: number;
  inspectionsToday: number;
  jsaActiveCount: number;
  permitsActiveCount: number;
  toolboxMeetingsCount: number;
  riskAssessmentsCount: number;
  highRiskActivitiesCount: number;
  daysWithoutLTI: number;
  trifr: number;
  ltifr: number;
  severityRate: number;
}

// Safety Campaign Types
export type CampaignCategory =
  | "Bulan K3 Nasional"
  | "Golden Safety Rules"
  | "Fatigue & Alertness"
  | "Pedestrian & Heavy Vehicle Interaction"
  | "Hand & Finger Safety"
  | "Heat Stress & Hydration"
  | "Ground Stability & Slope Safety"
  | "Zero Harm Initiative";

export interface SafetyCampaign {
  id: string;
  title: string;
  category: CampaignCategory;
  theme: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  targetAudience: string;
  organizer: string;
  description: string;
  keyMessages: string[];
  bannerUrl?: string;
  completionRatePercent: number;
  participantsCount: number;
  activitiesCount: number;
  awardsCount: number;
}

export interface CampaignActivity {
  id: string;
  campaignId: string;
  title: string;
  activityType: "WORKSHOP" | "QUIZ" | "DRILL" | "POSTER_COMPETITION" | "SAFETY_PLEDGE" | "RECOGNITION";
  date: string;
  location: string;
  participants: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  rewardPoints: number;
}

// AI Incident Pattern & Prioritization
export interface AIIncidentPatternAnalysis {
  patternId: string;
  clusterName: string;
  incidentCount: number;
  nearMissCount: number;
  primaryRiskFactor: string;
  temporalCorrelation: string; // e.g. "Shift 2 (14:00 - 16:00) Post-Rain"
  equipmentCluster: string[];
  severityTrend: "INCREASING" | "STABLE" | "DECREASING";
  rootCausePattern: string;
  aiConfidenceScore: number;
}

export interface AIPrioritizedAction {
  actionId: string;
  title: string;
  targetCategory: string;
  priorityScore: number; // 1 - 100
  urgencyLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedRiskReductionPercent: number;
  recommendedIntervention: string;
  estimatedImplementationCost: "LOW" | "MEDIUM" | "HIGH";
  responsibleDepartment: string;
  deadlineDays: number;
}

// Human & Heavy Vehicle AI Monitoring (PWS / Computer Vision)
export type InteractionEventType =
  | "PEDESTRIAN_IN_BLIND_SPOT"
  | "EXCLUSION_ZONE_BREACH"
  | "CLOSE_PROXIMITY_HAUL_ROAD"
  | "GROUND_WORKER_BEHIND_REVERSING_DOZER"
  | "OPERATOR_FATIGUE_MICRO_SLEEP"
  | "OPERATOR_DISTRACTION_MOBILE"
  | "UNAUTHORIZED_FOOT_TRAFFIC_IN_PIT";

export interface HumanVehicleInteractionEvent {
  eventId: string;
  timestamp: string;
  location: string;
  eventType: InteractionEventType;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  heavyEquipmentId: string;
  heavyEquipmentType: string;
  workerId?: string;
  workerName?: string;
  distanceMeters: number;
  safeDistanceThresholdMeters: number;
  aiDetectionSource: "CAMERA_AI_VISION" | "RADAR_PWS" | "UWB_TAG" | "GPS_TELEMETRY";
  actionTaken: string;
  status: "RESOLVED_AUTO" | "INVESTIGATED" | "UNDER_REVIEW";
  snapshotUrl?: string;
}

export interface HeavyVehicleSafetyMetrics {
  totalInteractions24h: number;
  criticalBreaches24h: number;
  nearMissesPrevented: number;
  fatigueAlerts24h: number;
  activePWSUnits: number;
  complianceRate: number; // %
}
