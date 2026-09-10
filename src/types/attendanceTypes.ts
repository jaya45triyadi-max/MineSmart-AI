import { ShiftType } from "./hrTypes";

export type ClockActionType = "CLOCK_IN" | "CLOCK_OUT" | "BREAK_START" | "BREAK_END";

export type AttendanceStatusType =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EARLY_LEAVE"
  | "ON_LEAVE"
  | "TRAINING"
  | "OFF"
  | "HOLIDAY"
  | "INCOMPLETE"
  | "PENDING_REVIEW";

export type AttendanceSourceType = "QR_DYNAMIC" | "QR_STATIC" | "GPS" | "MANUAL" | "BIOMETRIC" | "FACE_VERIFICATION" | "OFFLINE_SYNC";

export type VerificationStatusType =
  | "GPS_VALID"
  | "GPS_OUTSIDE_ZONE"
  | "GPS_UNAVAILABLE"
  | "GPS_LOW_ACCURACY"
  | "GPS_REVIEW_REQUIRED"
  | "QR_VALID"
  | "FACE_VERIFIED"
  | "MANUAL_VERIFIED";

export type ExceptionType =
  | "MISSING_CLOCK_IN"
  | "MISSING_CLOCK_OUT"
  | "DUPLICATE_CLOCK_IN"
  | "DUPLICATE_CLOCK_OUT"
  | "LATE"
  | "EARLY_LEAVE"
  | "GPS_FAILURE"
  | "OUTSIDE_GEOFENCE"
  | "INVALID_QR"
  | "WRONG_SHIFT"
  | "WRONG_SITE"
  | "UNAUTHORIZED_OVERTIME";

export type CorrectionReason =
  | "FORGOT_CLOCK_IN"
  | "FORGOT_CLOCK_OUT"
  | "DEVICE_PROBLEM"
  | "GPS_PROBLEM"
  | "QR_PROBLEM"
  | "SYSTEM_GLITCH"
  | "OTHER";

export interface GPSLocation {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  address?: string;
  isWithinGeofence?: boolean;
  geofenceZoneId?: string;
}

export interface AttendanceEvent {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  timestamp: string;
  type: ClockActionType;
  shiftId: string;
  siteId: string;
  departmentId: string;
  source: AttendanceSourceType;
  deviceId: string;
  location?: GPSLocation;
  status: "VALID" | "FLAGGED" | "REJECTED" | "OFFLINE_PENDING";
  createdAt: string;
}

export interface AttendanceRecordExtended {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  departmentId: string;
  departmentName: string;
  positionName: string;
  siteId: string;
  siteName: string;
  date: string;
  shiftId: string;
  shiftName: string;
  shiftType: ShiftType;
  scheduledClockIn: string;
  scheduledClockOut: string;
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  grossDurationHours: number;
  breakDurationHours: number;
  netWorkingHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  potentialOvertimeHours: number;
  approvedOvertimeHours: number;
  status: AttendanceStatusType;
  source: AttendanceSourceType;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  isWithinGeofence?: boolean;
  deviceId?: string;
  verificationStatus: VerificationStatusType;
  qrTokenUsed?: string;
  remarks?: string;
  hasCorrectionRequest?: boolean;
  updatedAt: string;
}

export interface AttendancePolicy {
  id: string;
  companyId: string;
  siteId?: string;
  departmentId?: string;
  policyName: string;
  clockInRequired: boolean;
  clockOutRequired: boolean;
  qrRequired: boolean;
  dynamicQrOnly: boolean;
  qrRefreshIntervalSeconds: number; // 30, 60, 300, etc.
  gpsRequired: boolean;
  geofenceRadiusMeters: number;
  gracePeriodMinutes: number;
  lateThresholdMinutes: number;
  earlyLeaveThresholdMinutes: number;
  overtimeThresholdMinutes: number;
  autoApproval: boolean;
  manualReviewRequired: boolean;
  allowOfflineClocking: boolean;
}

export interface GeofenceZone {
  id: string;
  siteId: string;
  siteName: string;
  zoneName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface DynamicQRCode {
  qrToken: string;
  timestamp: string;
  siteId: string;
  siteName: string;
  shiftId: string;
  shiftName: string;
  expirationTimestamp: string;
  signature: string;
  intervalSeconds: number;
  qrString: string;
}

export interface AttendanceException {
  id: string;
  exceptionId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  shiftName: string;
  exceptionType: ExceptionType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "DETECTED" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  description: string;
  detectedAt: string;
}

export interface AttendanceCorrection {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  shiftName: string;
  originalClockIn?: string;
  originalClockOut?: string;
  requestedClockIn: string;
  requestedClockOut: string;
  reason: CorrectionReason;
  explanation: string;
  evidenceAttachment?: string;
  status: "PENDING_SUPERVISOR" | "PENDING_HR" | "APPROVED" | "REJECTED";
  supervisorId?: string;
  supervisorName?: string;
  supervisorComment?: string;
  hrApproverId?: string;
  hrApproverName?: string;
  hrComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceDevice {
  id: string;
  deviceId: string;
  deviceType: string;
  os: string;
  appVersion: string;
  lastSeen: string;
  employeeId: string;
  employeeName: string;
  status: "ACTIVE" | "BLOCKED" | "UNKNOWN";
}

export interface OfflineAttendanceQueue {
  id: string;
  localId: string;
  employeeId: string;
  employeeName: string;
  timestamp: string;
  action: ClockActionType;
  source: AttendanceSourceType;
  coords?: { lat: number; lng: number };
  syncStatus: "PENDING" | "SYNCED" | "FAILED" | "CONFLICT";
  failureReason?: string;
}

export interface AttendanceAuditLog {
  id: string;
  action:
    | "CLOCK_IN"
    | "CLOCK_OUT"
    | "BREAK_START"
    | "BREAK_END"
    | "QR_SCAN"
    | "GPS_VALIDATION"
    | "GPS_FAILURE"
    | "ATTENDANCE_CREATED"
    | "ATTENDANCE_UPDATED"
    | "ATTENDANCE_CORRECTED"
    | "ATTENDANCE_APPROVED"
    | "ATTENDANCE_REJECTED"
    | "OVERTIME_DETECTED"
    | "OVERTIME_APPROVED";
  actorId: string;
  actorName: string;
  employeeId: string;
  employeeName: string;
  details: string;
  timestamp: string;
}

export interface AttendanceRiskSignal {
  id: string;
  riskType:
    | "MULTIPLE_ACCOUNTS_SAME_DEVICE"
    | "REPEATED_IDENTICAL_GPS"
    | "QR_REPLAY_ATTEMPT"
    | "IMPOSSIBLE_TIMESTAMP_PATTERN"
    | "REPEATED_VERY_SHORT_SHIFT"
    | "GEO_SPOOF_SUSPECT";
  employeeId: string;
  employeeName: string;
  departmentName: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidence: string;
  recommendedAction: string;
  timestamp: string;
}

export interface ShiftCoverageItem {
  shiftId: string;
  shiftName: string;
  timeRange: string;
  requiredCount: number;
  scheduledCount: number;
  presentCount: number;
  absentCount: number;
  gap: number;
  coveragePercent: number;
  alertLevel: "NORMAL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AttendanceKPISummaryExtended {
  totalEmployees: number;
  expectedToday: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  onLeaveCount: number;
  trainingCount: number;
  offShiftCount: number;
  currentlyOnSite: number;
  currentlyOffSite: number;
  overtimeCount: number;
  attendanceRate: number;
  absenceRate: number;
  gpsExceptionsCount: number;
  qrExceptionsCount: number;
  pendingCorrectionsCount: number;
}

export interface AIAttendanceAnalysis {
  finding: string;
  evidence: string;
  trend: string;
  possibleCauses: string[];
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  expectedImpact: string;
  confidence: "Low" | "Medium" | "High";
}
