// MINE SMART AI - Mobile Native App Types
// Responsive Native Viewport Modes: PC | Laptop | Tablet | Android | iOS
// Dedicated Mobile Workflows: 9 Core Modules

export type DeviceViewportMode = "PC" | "LAPTOP" | "TABLET" | "ANDROID" | "IOS";

export type MobileTab =
  | "DASHBOARD"
  | "PRODUCTION_INPUT"
  | "INSPECTION"
  | "HSE"
  | "EQUIPMENT"
  | "ATTENDANCE"
  | "APPROVAL"
  | "NOTIFICATION"
  | "AI_ASSISTANT";

export interface MobileShiftSummary {
  shift: "Shift 1 (Day)" | "Shift 2 (Night)";
  pitName: string;
  coalTonnageMT: number;
  coalTargetMT: number;
  obVolumeBCM: number;
  obTargetBCM: number;
  activeTrucks: number;
  activeLoaders: number;
  averageCycleTimeMin: number;
  fuelBurnRateLph: number;
  activeAlertsCount: number;
  safetyDaysWithoutLTI: number;
}

export interface MobileProductionTally {
  id: string;
  timestamp: string;
  shift: "Shift 1" | "Shift 2";
  pitId: string;
  loaderUnitId: string;
  haulerUnitId: string;
  materialType: "COAL" | "OVERBURDEN" | "INTERBURDEN" | "TOP_SOIL";
  destination: "ROM_STOCKPILE" | "IN_PIT_DUMP" | "WASTE_DUMP_WEST" | "CRUSHER_1";
  grossWeightTon?: number;
  bucketCount?: number;
  operatorName: string;
  gpsCoordinates: { lat: number; lng: number };
  synced: boolean;
}

export interface MobileP2HCheckItem {
  id: string;
  category: "ENGINE" | "HYDRAULIC" | "BRAKE_STEERING" | "TIRES_TRACKS" | "SAFETY_CABIN";
  label: string;
  status: "PASS" | "FAIL" | "ATTENTION" | "PENDING";
  note?: string;
  photoAttached?: boolean;
}

export interface MobileP2HInspection {
  id: string;
  unitCode: string;
  unitType: "DUMP_TRUCK" | "EXCAVATOR" | "DOZER" | "GRADER" | "WATER_TRUCK";
  inspectorName: string;
  inspectorBadgeNumber: string;
  currentHourMeter: number;
  date: string;
  shift: string;
  overallStatus: "FIT_TO_WORK" | "FIT_WITH_NOTE" | "DO_NOT_OPERATE";
  items: MobileP2HCheckItem[];
  digitalSignature?: string;
  synced: boolean;
}

export interface MobileHazardReport {
  id: string;
  title: string;
  category: "UNSAFE_CONDITION" | "UNSAFE_ACTION" | "NEAR_MISS" | "ENVIRONMENTAL";
  severityRating: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location: string;
  gpsCoordinates?: { lat: number; lng: number };
  reportedBy: string;
  timestamp: string;
  description: string;
  actionTaken?: string;
  status: "OPEN" | "INVESTIGATING" | "CLOSED";
  photoUrl?: string;
}

export interface MobileApprovalItem {
  id: string;
  requestType: "PURCHASE_REQUEST" | "FUEL_VOUCHER" | "WORK_PERMIT_JSA" | "LEAVE_OVERTIME" | "RKAB_VARIANCE";
  title: string;
  requesterName: string;
  requesterRole: string;
  department: string;
  submittedAt: string;
  amountOrVolume?: string;
  urgency: "HIGH" | "MEDIUM" | "NORMAL";
  details: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface MobileAttendanceLog {
  id: string;
  date: string;
  shift: string;
  clockInTime: string;
  clockOutTime?: string;
  geofenceStatus: "INSIDE_SITE_GEOFENCE" | "OUTSIDE_GEOFENCE";
  locationName: string;
  verifiedByFace: boolean;
  totalWorkingHours?: number;
}
