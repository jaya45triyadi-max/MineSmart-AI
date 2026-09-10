// MINE SMART AI - Mobile App Service & Offline Store
// Handles 9 Mobile Modules with Offline-First Local Storage

import {
  MobileShiftSummary,
  MobileProductionTally,
  MobileP2HInspection,
  MobileHazardReport,
  MobileApprovalItem,
  MobileAttendanceLog,
} from "../../types/mobileAppTypes";

const LOCAL_STORAGE_TALLIES_KEY = "minesmart_mobile_tallies_v1";
const LOCAL_STORAGE_P2H_KEY = "minesmart_mobile_p2h_v1";
const LOCAL_STORAGE_HAZARDS_KEY = "minesmart_mobile_hazards_v1";
const LOCAL_STORAGE_APPROVALS_KEY = "minesmart_mobile_approvals_v1";
const LOCAL_STORAGE_ATTENDANCE_KEY = "minesmart_mobile_attendance_v1";

export const INITIAL_SHIFT_SUMMARY: MobileShiftSummary = {
  shift: "Shift 1 (Day)",
  pitName: "Pit North Alpha (Seam 11 & 12)",
  coalTonnageMT: 14250,
  coalTargetMT: 16000,
  obVolumeBCM: 48500,
  obTargetBCM: 52000,
  activeTrucks: 24,
  activeLoaders: 4,
  averageCycleTimeMin: 22.4,
  fuelBurnRateLph: 72.8,
  activeAlertsCount: 3,
  safetyDaysWithoutLTI: 342,
};

export const INITIAL_APPROVALS: MobileApprovalItem[] = [
  {
    id: "APR-2026-081",
    requestType: "FUEL_VOUCHER",
    title: "Alokasi Tambahan Solar 5,000 Liter - Pit South Excavators",
    requesterName: "Bambang Wijaya",
    requesterRole: "Production Spv",
    department: "Mining Operations",
    submittedAt: "15 menit yang lalu",
    amountOrVolume: "5,000 Liter Solar Industri",
    urgency: "HIGH",
    details: "Dibutuhkan untuk lembur 2 unit PC2000 dalam rangka pembersihan sump air Pit South sebelum hujan sore.",
    status: "PENDING",
  },
  {
    id: "APR-2026-082",
    requestType: "PURCHASE_REQUEST",
    title: "Emergency Hydraulic Hose Kit Komatsu HD785",
    requesterName: "Hendra Gunawan",
    requesterRole: "Plant Maintenance Foreman",
    department: "Plant & Fleet",
    submittedAt: "45 menit yang lalu",
    amountOrVolume: "Rp 18.500.000 (3 Set)",
    urgency: "HIGH",
    details: "Penggantian hose hidrolik utama yang retak pada unit HD785-05 untuk menghindari unplanned downtime.",
    status: "PENDING",
  },
  {
    id: "APR-2026-083",
    requestType: "WORK_PERMIT_JSA",
    title: "Izin Kerja Panas (Hot Work Permit) - Pengelasan Bucket Crusher",
    requesterName: "Siti Rahma",
    requesterRole: "HSE Officer",
    department: "Health, Safety & Environment",
    submittedAt: "1 jam yang lalu",
    amountOrVolume: "Durasi 4 Jam (Shift 1)",
    urgency: "MEDIUM",
    details: "Pengelasan hardfacing wear plate pada hopper crusher primer. JSA dan fire extinguisher standby sudah diverifikasi.",
    status: "PENDING",
  },
  {
    id: "APR-2026-084",
    requestType: "LEAVE_OVERTIME",
    title: "Pengajuan Lembur Roster Dispatch Shift 2",
    requesterName: "Dedi Prasetyo",
    requesterRole: "Lead Dispatcher",
    department: "Dispatch & FMS",
    submittedAt: "2 jam yang lalu",
    amountOrVolume: "4 Jam Overtime",
    urgency: "NORMAL",
    details: "Handover operasi malam dan pengawalan fleet hauling batubara ke port stockpile.",
    status: "PENDING",
  },
];

export const INITIAL_HAZARDS: MobileHazardReport[] = [
  {
    id: "HZD-001",
    title: "Tumpahan Solar Licin di Tikungan Haul Road KM 2.4",
    category: "UNSAFE_CONDITION",
    severityRating: "HIGH",
    location: "Haul Road Bypass KM 2.4 (Dekat Jembatan Timbang)",
    reportedBy: "Ahmad Dani (Driver DT-402)",
    timestamp: "30 menit yang lalu",
    description: "Terdapat ceceran solar sekitar 15 meter pada jalur turunan yang membuat roda belakang selip.",
    actionTaken: "Pemasangan safety cone dan penaburan pasir serap tumpahan oleh tim grader.",
    status: "INVESTIGATING",
  },
  {
    id: "HZD-002",
    title: "Retakan Tebing Highwall Pit South (Potensi Longsor)",
    category: "UNSAFE_CONDITION",
    severityRating: "CRITICAL",
    location: "Pit South Bravo Seam 11 Bench 4",
    reportedBy: "Rudi Hartono (Pit Geotech Inspector)",
    timestamp: "2 jam yang lalu",
    description: "Tension crack selebar 12 cm terdeteksi sepanjang 25 meter di atas crest bench 4.",
    actionTaken: "Evakuasi armada excavator 50 meter dari kaki lereng dan pasang batas barricade line.",
    status: "OPEN",
  },
];

export const INITIAL_P2H_TEMPLATE = (unitCode: string, unitType: string = "DUMP_TRUCK"): MobileP2HInspection => ({
  id: `P2H-${Date.now().toString().slice(-4)}`,
  unitCode: unitCode || "HD785-05",
  unitType: (unitType as any) || "DUMP_TRUCK",
  inspectorName: "Andi Saputra",
  inspectorBadgeNumber: "OP-4492",
  currentHourMeter: 8452.6,
  date: "2026-08-16",
  shift: "Shift 1 (Day)",
  overallStatus: "FIT_TO_WORK",
  items: [
    { id: "p1", category: "ENGINE", label: "Level & Kualitas Oli Mesin (Engine Oil)", status: "PASS" },
    { id: "p2", category: "ENGINE", label: "Air Radiator & Kebocoran Coolant", status: "PASS" },
    { id: "p3", category: "HYDRAULIC", label: "Level Oli Hidrolik & Steering Tank", status: "PASS" },
    { id: "p4", category: "HYDRAULIC", label: "Kondisi Hose Hidrolik Hoist Silinder", status: "ATTENTION", note: "Sedikit rembesan pada fitting sambungan" },
    { id: "p5", category: "BRAKE_STEERING", label: "Service Brake & Retarder Function", status: "PASS" },
    { id: "p6", category: "BRAKE_STEERING", label: "Emergency Steering & Horn Test", status: "PASS" },
    { id: "p7", category: "TIRES_TRACKS", label: "Tekanan & Kerusakan Fisik Ban (Tires 6x)", status: "PASS" },
    { id: "p8", category: "SAFETY_CABIN", label: "Safety Belt, Spion, Wiper & Kamera CCTV", status: "PASS" },
    { id: "p9", category: "SAFETY_CABIN", label: "APAR (Fire Extinguisher) Pressure Gauge", status: "PASS" },
    { id: "p10", category: "SAFETY_CABIN", label: "Radio Komunikasi 2-Arah (Rig Frequency)", status: "PASS" },
  ],
  synced: true,
});

export class MobileAppService {
  // Production Tallies
  public static getTallies(): MobileProductionTally[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TALLIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load tallies:", e);
    }
    return [
      {
        id: "TLY-101",
        timestamp: "07:45",
        shift: "Shift 1",
        pitId: "Pit North Alpha",
        loaderUnitId: "EX-01 (PC2000)",
        haulerUnitId: "DT-102 (HD785)",
        materialType: "COAL",
        destination: "ROM_STOCKPILE",
        grossWeightTon: 98.4,
        operatorName: "Agus Supardi",
        gpsCoordinates: { lat: -0.8421, lng: 117.1523 },
        synced: true,
      },
      {
        id: "TLY-102",
        timestamp: "08:05",
        shift: "Shift 1",
        pitId: "Pit North Alpha",
        loaderUnitId: "EX-01 (PC2000)",
        haulerUnitId: "DT-105 (HD785)",
        materialType: "OVERBURDEN",
        destination: "WASTE_DUMP_WEST",
        grossWeightTon: 96.8,
        operatorName: "Eko Prasetyo",
        gpsCoordinates: { lat: -0.8432, lng: 117.1511 },
        synced: true,
      },
      {
        id: "TLY-103",
        timestamp: "08:22",
        shift: "Shift 1",
        pitId: "Pit South Bravo",
        loaderUnitId: "EX-02 (CAT 6020B)",
        haulerUnitId: "DT-208 (CAT 777G)",
        materialType: "COAL",
        destination: "CRUSHER_1",
        grossWeightTon: 102.1,
        operatorName: "Ilham Ramadhan",
        gpsCoordinates: { lat: -0.8512, lng: 117.1488 },
        synced: true,
      },
    ];
  }

  public static addTally(tally: MobileProductionTally): MobileProductionTally[] {
    const list = this.getTallies();
    const updated = [tally, ...list];
    try {
      localStorage.setItem(LOCAL_STORAGE_TALLIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return updated;
  }

  // Approvals
  public static getApprovals(): MobileApprovalItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_APPROVALS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load approvals:", e);
    }
    return INITIAL_APPROVALS;
  }

  public static updateApprovalStatus(id: string, status: "APPROVED" | "REJECTED"): MobileApprovalItem[] {
    const list = this.getApprovals();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    try {
      localStorage.setItem(LOCAL_STORAGE_APPROVALS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return updated;
  }

  // Hazards
  public static getHazards(): MobileHazardReport[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HAZARDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load hazards:", e);
    }
    return INITIAL_HAZARDS;
  }

  public static addHazard(hazard: MobileHazardReport): MobileHazardReport[] {
    const list = this.getHazards();
    const updated = [hazard, ...list];
    try {
      localStorage.setItem(LOCAL_STORAGE_HAZARDS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return updated;
  }

  // Attendance
  public static getAttendanceLogs(): MobileAttendanceLog[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ATTENDANCE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load attendance:", e);
    }
    return [
      {
        id: "ATT-001",
        date: "2026-08-16",
        shift: "Shift 1 (Day)",
        clockInTime: "05:48:12 WITA",
        geofenceStatus: "INSIDE_SITE_GEOFENCE",
        locationName: "Main Office Mess & Muster Point 1",
        verifiedByFace: true,
      },
    ];
  }

  public static recordAttendance(action: "CLOCK_IN" | "CLOCK_OUT", location: string): MobileAttendanceLog[] {
    const logs = this.getAttendanceLogs();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} WITA`;

    let updated: MobileAttendanceLog[];
    if (action === "CLOCK_IN") {
      const newLog: MobileAttendanceLog = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        date: "2026-08-16",
        shift: "Shift 1 (Day)",
        clockInTime: timeStr,
        geofenceStatus: "INSIDE_SITE_GEOFENCE",
        locationName: location || "Pit North Alpha Muster Point",
        verifiedByFace: true,
      };
      updated = [newLog, ...logs];
    } else {
      updated = logs.map((log, idx) =>
        idx === 0
          ? {
              ...log,
              clockOutTime: timeStr,
              totalWorkingHours: 8.5,
            }
          : log
      );
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_ATTENDANCE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return updated;
  }
}
