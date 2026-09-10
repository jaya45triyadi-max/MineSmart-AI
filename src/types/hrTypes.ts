export type EmploymentType =
  | "PERMANENT"
  | "CONTRACT"
  | "PROBATION"
  | "DAILY"
  | "OUTSOURCE"
  | "CONTRACTOR"
  | "OTHER";

export type EmploymentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "RESIGNED"
  | "TERMINATED";

export interface Employee {
  id: string;
  employeeId: string;
  employeeNumber: string;
  userId?: string;
  companyId: string;
  siteId: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  name: string;
  photo?: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  joinDate: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  supervisorId?: string;
  supervisorName?: string;
  contractorId?: string;
  contractorName?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDocument {
  id: string;
  documentId: string;
  employeeId: string;
  employeeName: string;
  documentType:
    | "EMPLOYMENT_CONTRACT"
    | "ID_CARD"
    | "CERTIFICATE"
    | "TRAINING_CERTIFICATE"
    | "MEDICAL_FITNESS"
    | "SIM_A_B2"
    | "SIO_OPERATOR"
    | "OTHER";
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  attachmentUrl?: string;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED" | "PENDING_VERIFICATION";
}

export interface Department {
  id: string;
  departmentId: string;
  companyId: string;
  siteId: string;
  name: string;
  code: string;
  description: string;
  managerId?: string;
  managerName?: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  employeeCount: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Position {
  id: string;
  positionId: string;
  companyId: string;
  departmentId: string;
  departmentName: string;
  name: string;
  code: string;
  level: "EXECUTIVE" | "MANAGER" | "SUPERVISOR" | "ENGINEER" | "STAFF" | "OPERATOR" | "HELPER";
  description: string;
  supervisorPositionId?: string;
  supervisorPositionName?: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiredTraining: string[];
  minExperienceYears: number;
  status: "ACTIVE" | "INACTIVE";
  headcountTarget: number;
  headcountCurrent: number;
  isCritical: boolean;
}

export type SkillCategory =
  | "Technical"
  | "Operational"
  | "Safety"
  | "Leadership"
  | "Digital"
  | "Maintenance"
  | "Mining"
  | "Geology"
  | "Survey"
  | "Environment"
  | "Other";

export type SkillLevel = "BEGINNER" | "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface Skill {
  id: string;
  skillId: string;
  name: string;
  category: SkillCategory;
  description: string;
  levelDefinition: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface EmployeeSkill {
  id: string;
  employeeSkillId: string;
  employeeId: string;
  employeeName: string;
  skillId: string;
  skillName: string;
  level: SkillLevel;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  expiryDate?: string;
}

export type CertificationStatus =
  | "VALID"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "PENDING_VERIFICATION"
  | "REVOKED";

export interface Certification {
  id: string;
  certificationId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  name: string; // e.g. POP (Pengawas Operasional Pertama), SIO Excavator PC1250, K3 Utama
  certificateNumber: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  attachmentUrl?: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED";
  isCriticalForHSE: boolean;
  isCriticalForEquipment: boolean;
}

export interface TrainingProgram {
  id: string;
  trainingId: string;
  name: string;
  category: "Safety K3" | "Technical Mining" | "Equipment Operation" | "Maintenance" | "Leadership" | "Compliance";
  description: string;
  provider: string;
  requiredForPositions: string[];
  durationHours: number;
  validityMonths: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TrainingSession {
  id: string;
  sessionId: string;
  trainingId: string;
  trainingName: string;
  siteId: string;
  startDate: string;
  endDate: string;
  location: string;
  instructor: string;
  capacity: number;
  participantsCount: number;
  status: "PLANNED" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface EmployeeTrainingRecord {
  id: string;
  recordId: string;
  employeeId: string;
  employeeName: string;
  sessionId: string;
  trainingName: string;
  completionDate: string;
  result: string;
  score: number;
  attendancePercent: number;
  certificateNumber?: string;
  expiryDate?: string;
  status: "SCHEDULED" | "ATTENDED" | "PASSED" | "FAILED" | "ABSENT" | "EXPIRED";
}

export type ShiftType = "DAY" | "NIGHT" | "MORNING" | "AFTERNOON" | "OFF" | "LEAVE";

export interface RosterEntry {
  id: string;
  rosterId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: ShiftType;
  siteId: string;
  departmentId: string;
  departmentName: string;
  positionName: string;
  workLocation: string;
  supervisorName: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";
}

export interface ShiftTemplate {
  id: string;
  shiftId: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDurationMins: number;
  isOvernight: boolean;
  color: string;
  status: "ACTIVE" | "INACTIVE";
}

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EARLY_LEAVE"
  | "ON_LEAVE"
  | "TRAINING"
  | "OFF";

export type AttendanceSource = "Manual" | "Mobile" | "Biometric" | "API";

export interface AttendanceRecord {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  shift: ShiftType;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  source: AttendanceSource;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export type LeaveType =
  | "Annual Leave"
  | "Sick Leave"
  | "Personal Leave"
  | "Special Leave"
  | "Maternity Leave";

export interface LeaveRequest {
  id: string;
  leaveRequestId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  positionName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  attachmentUrl?: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";
  approverName?: string;
  approvedAt?: string;
}

export interface OvertimeRecord {
  id: string;
  overtimeId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  reason: string;
  project: string;
  supervisorName: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
}

export interface ManpowerPlan {
  id: string;
  planId: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  requiredCount: number;
  currentCount: number;
  gap: number;
  forecastNextMonth: number;
  isCritical: boolean;
}

export interface SuccessionReadiness {
  id: string;
  positionId: string;
  positionName: string;
  currentHolderName: string;
  candidateEmployeeId: string;
  candidateName: string;
  skillMatchPercent: number;
  certMatchPercent: number;
  trainingGapCount: number;
  readiness: "READY" | "PARTIALLY_READY" | "NOT_READY";
}

export interface HRKPISummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  employeesOnSite: number;
  employeesOffSite: number;
  employeesOnLeave: number;
  employeesOnTraining: number;
  expiredCertificationsCount: number;
  expiringSoonCertificationsCount: number;
  trainingDueCount: number;
  openManpowerRequestsCount: number;
  overtimeHoursTotal: number;
  attendanceRatePercent: number;
  absenceRatePercent: number;
  manpowerUtilizationPercent: number;
}

export interface HRAIInsight {
  id: string;
  title: string;
  finding: string;
  evidence: string;
  trend: string;
  possibleCauses: string[];
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  expectedImpact: string;
  confidence: string;
}
