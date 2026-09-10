import { hrRepository } from "./HRRepository";
import {
  AttendanceRecordExtended,
  AttendanceEvent,
  AttendancePolicy,
  GeofenceZone,
  DynamicQRCode,
  AttendanceException,
  AttendanceCorrection,
  AttendanceDevice,
  OfflineAttendanceQueue,
  AttendanceAuditLog,
  AttendanceRiskSignal,
  ShiftCoverageItem,
  AttendanceKPISummaryExtended,
  AIAttendanceAnalysis,
  ClockActionType,
  VerificationStatusType,
} from "../../types/attendanceTypes";

class AttendanceRepository {
  private policies: AttendancePolicy[] = [
    {
      id: "pol-01",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      policyName: "Kebijakan Presensi Site Tapin Coal Field",
      clockInRequired: true,
      clockOutRequired: true,
      qrRequired: true,
      dynamicQrOnly: true,
      qrRefreshIntervalSeconds: 60,
      gpsRequired: true,
      geofenceRadiusMeters: 200,
      gracePeriodMinutes: 15,
      lateThresholdMinutes: 30,
      earlyLeaveThresholdMinutes: 15,
      overtimeThresholdMinutes: 30,
      autoApproval: false,
      manualReviewRequired: true,
      allowOfflineClocking: true,
    },
  ];

  private geofences: GeofenceZone[] = [
    {
      id: "geo-01",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Mine Site",
      zoneName: "Main Pit & Workshop Checkpoint",
      latitude: -2.9348,
      longitude: 115.215,
      radiusMeters: 250,
      status: "ACTIVE",
    },
    {
      id: "geo-02",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Mine Site",
      zoneName: "Port & Port Weighbridge Office",
      latitude: -2.9412,
      longitude: 115.228,
      radiusMeters: 300,
      status: "ACTIVE",
    },
  ];

  private devices: AttendanceDevice[] = [
    {
      id: "dev-01",
      deviceId: "DEV-IP14-PRO-881",
      deviceType: "iPhone 14 Pro",
      os: "iOS 17.4",
      appVersion: "v2.8.0",
      lastSeen: "2026-08-14 06:58",
      employeeId: "EMP-001",
      employeeName: "Budi Santoso",
      status: "ACTIVE",
    },
    {
      id: "dev-02",
      deviceId: "DEV-S23-ULTRA-902",
      deviceType: "Samsung Galaxy S23",
      os: "Android 14",
      appVersion: "v2.8.0",
      lastSeen: "2026-08-14 06:45",
      employeeId: "EMP-002",
      employeeName: "Siti Aminah",
      status: "ACTIVE",
    },
    {
      id: "dev-03",
      deviceId: "DEV-XIAOMI-13T-109",
      deviceType: "Xiaomi 13T",
      os: "Android 13",
      appVersion: "v2.7.9",
      lastSeen: "2026-08-14 07:12",
      employeeId: "EMP-003",
      employeeName: "Agus Setiawan",
      status: "ACTIVE",
    },
  ];

  private records: AttendanceRecordExtended[] = [
    {
      id: "att-rec-001",
      attendanceId: "ATT-20260814-001",
      employeeId: "EMP-001",
      employeeName: "Budi Santoso",
      employeeNumber: "NIK-2021-001",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Senior Operator Excavator PC1250",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: "06:52",
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "PRESENT",
      source: "QR_DYNAMIC",
      latitude: -2.9348,
      longitude: 115.215,
      locationName: "Main Pit Checkpoint A",
      isWithinGeofence: true,
      deviceId: "DEV-IP14-PRO-881",
      verificationStatus: "GPS_VALID",
      qrTokenUsed: "QR-DYN-20260814-0652-991A",
      updatedAt: "2026-08-14 06:52:10",
    },
    {
      id: "att-rec-002",
      attendanceId: "ATT-20260814-002",
      employeeId: "EMP-002",
      employeeName: "Siti Aminah",
      employeeNumber: "NIK-2022-045",
      departmentId: "DEPT-HSE",
      departmentName: "HSE & Environmental",
      positionName: "Safety Inspector K3",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: "06:48",
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "PRESENT",
      source: "GPS",
      latitude: -2.9347,
      longitude: 115.2149,
      locationName: "HSE Safety Office Pit Tapin",
      isWithinGeofence: true,
      deviceId: "DEV-S23-ULTRA-902",
      verificationStatus: "GPS_VALID",
      updatedAt: "2026-08-14 06:48:32",
    },
    {
      id: "att-rec-003",
      attendanceId: "ATT-20260814-003",
      employeeId: "EMP-003",
      employeeName: "Agus Setiawan",
      employeeNumber: "NIK-2020-012",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Dump Truck Driver HD785",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: "07:28",
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 28,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "LATE",
      source: "QR_DYNAMIC",
      latitude: -2.9349,
      longitude: 115.2151,
      locationName: "Dispatch Office Gate 2",
      isWithinGeofence: true,
      deviceId: "DEV-XIAOMI-13T-109",
      verificationStatus: "GPS_VALID",
      qrTokenUsed: "QR-DYN-20260814-0728-332X",
      remarks: "Terlambat 28 menit karena kendala bus jemputan karyawan line B",
      updatedAt: "2026-08-14 07:28:05",
    },
    {
      id: "att-rec-004",
      attendanceId: "ATT-20260814-004",
      employeeId: "EMP-004",
      employeeName: "Joko Widodo",
      employeeNumber: "NIK-2019-008",
      departmentId: "DEPT-PLT",
      departmentName: "Plant & Maintenance",
      positionName: "Senior Heavy Equipment Mechanic",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: "06:55",
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "PRESENT",
      source: "BIOMETRIC",
      latitude: -2.9348,
      longitude: 115.215,
      locationName: "Workshop Main Bay 3",
      isWithinGeofence: true,
      verificationStatus: "MANUAL_VERIFIED",
      updatedAt: "2026-08-14 06:55:40",
    },
    {
      id: "att-rec-005",
      attendanceId: "ATT-20260814-005",
      employeeId: "EMP-005",
      employeeName: "Dewi Lestari",
      employeeNumber: "NIK-2023-102",
      departmentId: "DEPT-ENG",
      departmentName: "Mine Engineering & Survey",
      positionName: "Mine Surveyor Specialist",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: undefined,
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "ON_LEAVE",
      source: "MANUAL",
      verificationStatus: "MANUAL_VERIFIED",
      remarks: "Cuti Tahunan (Approved Ticket #LV-2026-003)",
      updatedAt: "2026-08-14 00:00:00",
    },
    {
      id: "att-rec-006",
      attendanceId: "ATT-20260814-006",
      employeeId: "EMP-006",
      employeeName: "Rudi Hermawan",
      employeeNumber: "NIK-2021-089",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Pit Supervisor",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-2",
      shiftName: "Shift 2 - Night Shift",
      shiftType: "NIGHT",
      scheduledClockIn: "19:00",
      scheduledClockOut: "07:00",
      clockIn: undefined,
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "OFF",
      source: "MANUAL",
      verificationStatus: "MANUAL_VERIFIED",
      remarks: "Shift Malam - Menunggu Jam 19:00 WITA",
      updatedAt: "2026-08-14 00:00:00",
    },
    {
      id: "att-rec-007",
      attendanceId: "ATT-20260814-007",
      employeeId: "EMP-007",
      employeeName: "Bambang Triyono",
      employeeNumber: "NIK-2022-118",
      departmentId: "DEPT-PLT",
      departmentName: "Plant & Maintenance",
      positionName: "Auto Electrician Heavy Equipment",
      siteId: "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: "2026-08-14",
      shiftId: "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: "06:50",
      clockOut: undefined,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status: "PRESENT",
      source: "OFFLINE_SYNC",
      latitude: -2.9348,
      longitude: 115.215,
      locationName: "Pit Outpost B (Offline Synced)",
      isWithinGeofence: true,
      deviceId: "DEV-ANDROID-FIELD-01",
      verificationStatus: "GPS_VALID",
      remarks: "Data berhasil disinkronkan saat koneksi satelit pulih",
      updatedAt: "2026-08-14 08:15:00",
    },
  ];

  private events: AttendanceEvent[] = [
    {
      id: "evt-001",
      attendanceId: "ATT-20260814-001",
      employeeId: "EMP-001",
      employeeName: "Budi Santoso",
      date: "2026-08-14",
      timestamp: "2026-08-14 06:52:10",
      type: "CLOCK_IN",
      shiftId: "shift-1",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      source: "QR_DYNAMIC",
      deviceId: "DEV-IP14-PRO-881",
      location: {
        latitude: -2.9348,
        longitude: 115.215,
        accuracy: 8,
        address: "Main Pit Checkpoint A",
        isWithinGeofence: true,
        geofenceZoneId: "geo-01",
      },
      status: "VALID",
      createdAt: "2026-08-14 06:52:10",
    },
  ];

  private exceptions: AttendanceException[] = [
    {
      id: "exc-001",
      exceptionId: "EXC-20260814-001",
      employeeId: "EMP-003",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      date: "2026-08-14",
      shiftName: "Shift 1 - Day Shift",
      exceptionType: "LATE",
      severity: "MEDIUM",
      status: "UNDER_REVIEW",
      description: "Terlambat 28 menit melewati Grace Period (15 Menit).",
      detectedAt: "2026-08-14 07:28:05",
    },
    {
      id: "exc-002",
      exceptionId: "EXC-20260813-004",
      employeeId: "EMP-015",
      employeeName: "Samsul Bahri",
      departmentName: "Plant & Maintenance",
      date: "2026-08-13",
      shiftName: "Shift 1 - Day Shift",
      exceptionType: "MISSING_CLOCK_OUT",
      severity: "HIGH",
      status: "DETECTED",
      description: "Tidak melakukan Clock Out sampai akhir shift 19:00 WITA.",
      detectedAt: "2026-08-13 21:00:00",
    },
  ];

  private corrections: AttendanceCorrection[] = [
    {
      id: "cor-001",
      requestNumber: "REQ-CORR-2026-001",
      employeeId: "EMP-015",
      employeeName: "Samsul Bahri",
      departmentName: "Plant & Maintenance",
      date: "2026-08-13",
      shiftName: "Shift 1 - Day Shift",
      originalClockIn: "06:55",
      originalClockOut: undefined,
      requestedClockIn: "06:55",
      requestedClockOut: "19:05",
      reason: "FORGOT_CLOCK_IN",
      explanation: "Lupa melambaikan QR scan saat pulang karena ada perbaikan emergency Excavator PC2000 di pit.",
      evidenceAttachment: "https://example.com/evidence-emergency-repair.pdf",
      status: "PENDING_SUPERVISOR",
      supervisorId: "SUP-004",
      supervisorName: "Dedy Kurniawan",
      createdAt: "2026-08-14 07:30:00",
      updatedAt: "2026-08-14 07:30:00",
    },
  ];

  private offlineQueue: OfflineAttendanceQueue[] = [
    {
      id: "off-q-01",
      localId: "LOC-EVT-9001",
      employeeId: "EMP-012",
      employeeName: "Danang Sutrisno",
      timestamp: "2026-08-14 06:40:00",
      action: "CLOCK_IN",
      source: "OFFLINE_SYNC",
      coords: { lat: -2.935, lng: 115.216 },
      syncStatus: "PENDING",
    },
  ];

  private auditLogs: AttendanceAuditLog[] = [
    {
      id: "aud-001",
      action: "CLOCK_IN",
      actorId: "EMP-001",
      actorName: "Budi Santoso",
      employeeId: "EMP-001",
      employeeName: "Budi Santoso",
      details: "Clock In berhasil via Dynamic QR & GPS Valid (-2.9348, 115.2150).",
      timestamp: "2026-08-14 06:52:10",
    },
    {
      id: "aud-002",
      action: "ATTENDANCE_CORRECTED",
      actorId: "EMP-015",
      actorName: "Samsul Bahri",
      employeeId: "EMP-015",
      employeeName: "Samsul Bahri",
      details: "Pengajuan koreksi presensi REQ-CORR-2026-001 untuk tanggal 2026-08-13.",
      timestamp: "2026-08-14 07:30:00",
    },
  ];

  private riskSignals: AttendanceRiskSignal[] = [
    {
      id: "risk-001",
      riskType: "MULTIPLE_ACCOUNTS_SAME_DEVICE",
      employeeId: "EMP-022",
      employeeName: "Rian Hidayat",
      departmentName: "Hauling & Logistics",
      riskLevel: "MEDIUM",
      evidence: "Perangkat DEV-XIAOMI-13T-109 terdeteksi digunakan untuk 2 akun berbeda dalam rentang 10 menit.",
      recommendedAction: "Pemeriksaan supervisor lapangan terkait potensi pemakaian ponsel bersama atau penitipan presensi.",
      timestamp: "2026-08-14 07:15:00",
    },
    {
      id: "risk-002",
      riskType: "REPEATED_IDENTICAL_GPS",
      employeeId: "EMP-041",
      employeeName: "Hasan Basri",
      departmentName: "Civil & Road Maintenance",
      riskLevel: "LOW",
      evidence: "Koordinat GPS persis sama hingga 6 digit desimal berturut-turut dalam 3 hari.",
      recommendedAction: "Verifikasi aplikasi mock location atau faked GPS pada perangkat Android karyawan.",
      timestamp: "2026-08-13 18:50:00",
    },
  ];

  // Helper Methods

  public async getKPISummary(): Promise<AttendanceKPISummaryExtended> {
    const totalEmployees = 420;
    const expectedToday = 210; // Shift 1 scheduled
    const presentCount = this.records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length + 185;
    const lateCount = this.records.filter((r) => r.status === "LATE").length + 4;
    const absentCount = 3;
    const earlyLeaveCount = 1;
    const onLeaveCount = 12;
    const trainingCount = 13;
    const offShiftCount = 181;
    const currentlyOnSite = presentCount - 5;
    const currentlyOffSite = totalEmployees - currentlyOnSite;
    const overtimeCount = 18;
    const attendanceRate = Number(((presentCount / expectedToday) * 100).toFixed(1));
    const absenceRate = Number((100 - attendanceRate).toFixed(1));

    return {
      totalEmployees,
      expectedToday,
      presentCount,
      absentCount,
      lateCount,
      earlyLeaveCount,
      onLeaveCount,
      trainingCount,
      offShiftCount,
      currentlyOnSite,
      currentlyOffSite,
      overtimeCount,
      attendanceRate,
      absenceRate,
      gpsExceptionsCount: 2,
      qrExceptionsCount: 1,
      pendingCorrectionsCount: this.corrections.filter((c) => c.status === "PENDING_SUPERVISOR" || c.status === "PENDING_HR").length,
    };
  }

  public async getAttendanceRecords(filters?: {
    date?: string;
    departmentId?: string;
    status?: string;
    searchQuery?: string;
  }): Promise<AttendanceRecordExtended[]> {
    let list = [...this.records];
    if (filters?.date) {
      list = list.filter((r) => r.date === filters.date);
    }
    if (filters?.departmentId && filters.departmentId !== "ALL") {
      list = list.filter((r) => r.departmentId === filters.departmentId);
    }
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeNumber.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q) ||
          r.positionName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public async clockIn(params: {
    employeeId: string;
    employeeName: string;
    shiftId: string;
    siteId: string;
    departmentId: string;
    source: "QR_DYNAMIC" | "QR_STATIC" | "GPS" | "MANUAL" | "BIOMETRIC" | "FACE_VERIFICATION";
    latitude?: number;
    longitude?: number;
    qrToken?: string;
    deviceId: string;
  }): Promise<{ success: boolean; record?: AttendanceRecordExtended; message: string }> {
    // 1. Validation check
    const existingActive = this.records.find(
      (r) => r.employeeId === params.employeeId && r.date === new Date().toISOString().split("T")[0] && r.clockIn && !r.clockOut
    );

    if (existingActive) {
      return {
        success: false,
        message: "BLOCK: Karyawan sudah melakukan Clock In aktif pada hari ini dan belum Clock Out.",
      };
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);
    const dateStr = now.toISOString().split("T")[0];

    // Determine status (grace period: 15 mins)
    // Assuming shift 1 starts at 07:00
    const [h, m] = timeStr.split(":").map(Number);
    const totalMinutes = h * 60 + m;
    const targetMinutes = 7 * 60; // 07:00
    let lateMinutes = 0;
    let status: AttendanceRecordExtended["status"] = "PRESENT";

    if (totalMinutes > targetMinutes + 15) {
      lateMinutes = totalMinutes - targetMinutes;
      status = "LATE";
    }

    const newRec: AttendanceRecordExtended = {
      id: `att-rec-${Date.now()}`,
      attendanceId: `ATT-${dateStr.replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: params.employeeId,
      employeeName: params.employeeName,
      employeeNumber: `NIK-2024-${params.employeeId.slice(-3)}`,
      departmentId: params.departmentId || "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Mine Field Worker",
      siteId: params.siteId || "SITE-TAPIN",
      siteName: "Tapin Coal Field",
      date: dateStr,
      shiftId: params.shiftId || "shift-1",
      shiftName: "Shift 1 - Day Shift",
      shiftType: "DAY",
      scheduledClockIn: "07:00",
      scheduledClockOut: "19:00",
      clockIn: timeStr,
      grossDurationHours: 0,
      breakDurationHours: 1.0,
      netWorkingHours: 0,
      lateMinutes,
      earlyLeaveMinutes: 0,
      potentialOvertimeHours: 0,
      approvedOvertimeHours: 0,
      status,
      source: params.source,
      latitude: params.latitude || -2.9348,
      longitude: params.longitude || 115.215,
      locationName: "Pit Entrance Checkpoint",
      isWithinGeofence: true,
      deviceId: params.deviceId,
      verificationStatus: params.source === "FACE_VERIFICATION" ? "FACE_VERIFIED" : params.source.includes("GPS") ? "GPS_VALID" : "QR_VALID",
      qrTokenUsed: params.qrToken,
      updatedAt: `${dateStr} ${timeStr}:00`,
    };

    this.records.unshift(newRec);

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      action: "CLOCK_IN",
      actorId: params.employeeId,
      actorName: params.employeeName,
      employeeId: params.employeeId,
      employeeName: params.employeeName,
      details: `Clock In berhasil jam ${timeStr} WITA (${status}). Source: ${params.source}`,
      timestamp: `${dateStr} ${timeStr}:00`,
    });

    return {
      success: true,
      record: newRec,
      message: `Presensi Masuk Berhasil DICATAT (${status === "LATE" ? `Terlambat ${lateMinutes} menit` : "On Time"})`,
    };
  }

  public async clockOut(params: {
    employeeId: string;
    attendanceId: string;
    source: "QR_DYNAMIC" | "QR_STATIC" | "GPS" | "MANUAL" | "BIOMETRIC";
    latitude?: number;
    longitude?: number;
    deviceId: string;
  }): Promise<{ success: boolean; record?: AttendanceRecordExtended; message: string }> {
    const index = this.records.findIndex((r) => r.id === params.attendanceId || (r.employeeId === params.employeeId && !r.clockOut));

    if (index === -1) {
      return {
        success: false,
        message: "BLOCK: Tidak ditemukan transaksi Clock In aktif untuk karyawan ini.",
      };
    }

    const rec = this.records[index];
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);
    const dateStr = now.toISOString().split("T")[0];

    // Compute working hours
    const [inH, inM] = (rec.clockIn || "07:00").split(":").map(Number);
    const [outH, outM] = timeStr.split(":").map(Number);
    
    let inTotal = inH * 60 + inM;
    let outTotal = outH * 60 + outM;
    if (outTotal < inTotal) {
      outTotal += 24 * 60; // Overnight shift
    }

    const grossMins = outTotal - inTotal;
    const netMins = Math.max(0, grossMins - 60); // 1 hr break
    const netHours = Number((netMins / 60).toFixed(1));

    // Overtime check (after 19:00 = 1140 mins)
    const shiftEndMins = 19 * 60;
    let potentialOt = 0;
    if (outTotal > shiftEndMins + 30) {
      potentialOt = Number(((outTotal - shiftEndMins) / 60).toFixed(1));
    }

    // Early leave check
    let earlyMins = 0;
    if (outTotal < shiftEndMins - 15) {
      earlyMins = shiftEndMins - outTotal;
      rec.status = "EARLY_LEAVE";
    }

    rec.clockOut = timeStr;
    rec.grossDurationHours = Number((grossMins / 60).toFixed(1));
    rec.netWorkingHours = netHours;
    rec.earlyLeaveMinutes = earlyMins;
    rec.potentialOvertimeHours = potentialOt;
    rec.updatedAt = `${dateStr} ${timeStr}:00`;

    this.records[index] = rec;

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      action: "CLOCK_OUT",
      actorId: params.employeeId,
      actorName: rec.employeeName,
      employeeId: params.employeeId,
      employeeName: rec.employeeName,
      details: `Clock Out jam ${timeStr} WITA. Total jam kerja net: ${netHours} jam. ${potentialOt > 0 ? `Potensi lembur: ${potentialOt} jam` : ""}`,
      timestamp: `${dateStr} ${timeStr}:00`,
    });

    return {
      success: true,
      record: rec,
      message: `Clock Out Berhasil! Jam Kerja: ${netHours} Jam ${potentialOt > 0 ? `(Deteksi Potensi Lembur ${potentialOt} Jam)` : ""}`,
    };
  }

  // Dynamic QR Code Generator
  public generateDynamicQR(siteId: string, shiftId: string, intervalSeconds: number = 60): DynamicQRCode {
    const now = new Date();
    const ts = now.toISOString();
    const exp = new Date(now.getTime() + intervalSeconds * 1000).toISOString();
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const qrToken = `QR-DYN-${siteId}-${now.valueOf()}-${randomHex}`;
    const signature = `SIG-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      qrToken,
      timestamp: ts,
      siteId,
      siteName: "Tapin Coal Mine Site",
      shiftId,
      shiftName: "Shift 1 - Day Shift",
      expirationTimestamp: exp,
      signature,
      intervalSeconds,
      qrString: JSON.stringify({ token: qrToken, site: siteId, exp, sig: signature }),
    };
  }

  // GPS Geofence Validator
  public validateGPSLocation(latitude: number, longitude: number, siteId: string): {
    isValid: boolean;
    distanceMeters: number;
    zoneName: string;
    status: VerificationStatusType;
    message: string;
  } {
    const zone = this.geofences.find((g) => g.siteId === siteId) || this.geofences[0];
    
    // Simple Haversine calculation approximation
    const R = 6371000; // Earth radius in meters
    const dLat = ((latitude - zone.latitude) * Math.PI) / 180;
    const dLon = ((longitude - zone.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((zone.latitude * Math.PI) / 180) *
        Math.cos((latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = Math.round(R * c);

    if (distanceMeters <= zone.radiusMeters) {
      return {
        isValid: true,
        distanceMeters,
        zoneName: zone.zoneName,
        status: "GPS_VALID",
        message: `Lokasi VALID (${distanceMeters}m dari pusat zona ${zone.zoneName})`,
      };
    } else {
      return {
        isValid: false,
        distanceMeters,
        zoneName: zone.zoneName,
        status: "GPS_OUTSIDE_ZONE",
        message: `LOKASI DI LUAR ZONA TERDAFTAR! Jarak: ${distanceMeters}m (Batas radius: ${zone.radiusMeters}m)`,
      };
    }
  }

  public async getShiftCoverage(): Promise<ShiftCoverageItem[]> {
    return [
      {
        shiftId: "shift-1",
        shiftName: "Shift 1 - Day Shift (07:00 - 19:00)",
        timeRange: "07:00 - 19:00 WITA",
        requiredCount: 210,
        scheduledCount: 208,
        presentCount: 202,
        absentCount: 6,
        gap: 8,
        coveragePercent: 96.2,
        alertLevel: "LOW",
      },
      {
        shiftId: "shift-2",
        shiftName: "Shift 2 - Night Shift (19:00 - 07:00)",
        timeRange: "19:00 - 07:00 WITA",
        requiredCount: 180,
        scheduledCount: 175,
        presentCount: 168,
        absentCount: 7,
        gap: 12,
        coveragePercent: 93.3,
        alertLevel: "MEDIUM",
      },
      {
        shiftId: "shift-3",
        shiftName: "Office & Non-Shift (08:00 - 17:00)",
        timeRange: "08:00 - 17:00 WITA",
        requiredCount: 30,
        scheduledCount: 30,
        presentCount: 30,
        absentCount: 0,
        gap: 0,
        coveragePercent: 100.0,
        alertLevel: "NORMAL",
      },
    ];
  }

  public async getExceptions(): Promise<AttendanceException[]> {
    return [...this.exceptions];
  }

  public async getCorrections(): Promise<AttendanceCorrection[]> {
    return [...this.corrections];
  }

  public async submitCorrection(data: Omit<AttendanceCorrection, "id" | "requestNumber" | "status" | "createdAt" | "updatedAt">): Promise<AttendanceCorrection> {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];

    const newCorr: AttendanceCorrection = {
      ...data,
      id: `cor-${Date.now()}`,
      requestNumber: `REQ-CORR-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: "PENDING_SUPERVISOR",
      createdAt: `${dateStr} ${timeStr}`,
      updatedAt: `${dateStr} ${timeStr}`,
    };

    this.corrections.unshift(newCorr);

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      action: "ATTENDANCE_CORRECTED",
      actorId: data.employeeId,
      actorName: data.employeeName,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      details: `Mengajukan koreksi presensi ${newCorr.requestNumber} tanggal ${data.date} (Alasan: ${data.reason}).`,
      timestamp: `${dateStr} ${timeStr}`,
    });

    return newCorr;
  }

  public async approveCorrection(id: string, approverName: string, comment: string): Promise<boolean> {
    const index = this.corrections.findIndex((c) => c.id === id);
    if (index !== -1) {
      const corr = this.corrections[index];
      corr.status = "APPROVED";
      corr.hrApproverName = approverName;
      corr.hrComment = comment;
      corr.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 19);
      this.corrections[index] = corr;

      // Update actual attendance record if matching
      const record = this.records.find((r) => r.employeeId === corr.employeeId && r.date === corr.date);
      if (record) {
        record.clockIn = corr.requestedClockIn;
        record.clockOut = corr.requestedClockOut;
        record.status = "PRESENT";
        record.remarks = `Dikoreksi via ${corr.requestNumber} oleh ${approverName}`;
      }

      this.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        action: "ATTENDANCE_APPROVED",
        actorId: "MGR-001",
        actorName: approverName,
        employeeId: corr.employeeId,
        employeeName: corr.employeeName,
        details: `Menyetujui koreksi presensi ${corr.requestNumber}. Catatan: ${comment}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      });

      return true;
    }
    return false;
  }

  public async rejectCorrection(id: string, approverName: string, comment: string): Promise<boolean> {
    const index = this.corrections.findIndex((c) => c.id === id);
    if (index !== -1) {
      const corr = this.corrections[index];
      corr.status = "REJECTED";
      corr.hrApproverName = approverName;
      corr.hrComment = comment;
      corr.updatedAt = new Date().toISOString().replace("T", " ").slice(0, 19);
      this.corrections[index] = corr;

      this.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        action: "ATTENDANCE_REJECTED",
        actorId: "MGR-001",
        actorName: approverName,
        employeeId: corr.employeeId,
        employeeName: corr.employeeName,
        details: `Menolak koreksi presensi ${corr.requestNumber}. Alasan: ${comment}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      });

      return true;
    }
    return false;
  }

  public async getRiskSignals(): Promise<AttendanceRiskSignal[]> {
    return [...this.riskSignals];
  }

  public async getDevices(): Promise<AttendanceDevice[]> {
    return [...this.devices];
  }

  public async getPolicies(): Promise<AttendancePolicy[]> {
    return [...this.policies];
  }

  public async getOfflineQueue(): Promise<OfflineAttendanceQueue[]> {
    return [...this.offlineQueue];
  }

  public async getAuditLogs(): Promise<AttendanceAuditLog[]> {
    return [...this.auditLogs];
  }

  // AI Attendance Assistant Query Engine
  public async queryAIAssistant(prompt: string): Promise<AIAttendanceAnalysis> {
    const q = prompt.toLowerCase();

    if (q.includes("terlambat") || q.includes("late")) {
      return {
        finding: "Ditemukan 5 karyawan terlambat pada Shift 1 hari ini.",
        evidence: "Antara pukul 07:15 - 07:35 WITA di Gate 2 Pit Tapin (Grace Period 15 menit terlewati).",
        trend: "Keterlambatan di hari Jumat meningkat +12% dibanding hari kerja biasa.",
        possibleCauses: [
          "Keterlambatan bus jemputan karyawan rute B (Kabupaten Tapin).",
          "Kepadatan antrean barcode scanner QR di gate pemeriksaan K3.",
        ],
        risk: "MEDIUM",
        recommendation: "Sesuaikan jam keberangkatan bus Line B lebih awal 15 menit dan buka 2 barcode scanner tambahan di Gate 2.",
        expectedImpact: "Menurunkan potensi keterlambatan harian hingga <2% dan mempercepat safety briefing p2h.",
        confidence: "High",
      };
    }

    if (q.includes("overtime") || q.includes("lembur")) {
      return {
        finding: "Total potensi lembur hari ini mencapai 38 jam dari 18 karyawan tambang.",
        evidence: "Mayoritas dari Departemen Plant & Heavy Equipment (Perbaikan breakdown Excavator PC2000).",
        trend: "Trend lembur teknisi maintenance melonjak +18% dalam 3 hari terakhir.",
        possibleCauses: [
          "Breakdown tidak terencana unit excavator utama di Pit A.",
          "Kekurangan mekanik Grade 3 pada Shift Malam.",
        ],
        risk: "HIGH",
        recommendation: "Evaluasi kebutuhan pengajuan lembur via HR Approval & percepat rotasi shift mekanik.",
        expectedImpact: "Mengendalikan efisiensi biaya lembur hingga 15% tanpa mengganggu readiness unit.",
        confidence: "High",
      };
    }

    if (q.includes("rendah") || q.includes("absenteeism") || q.includes("kurang")) {
      return {
        finding: "Shift 2 (Night Shift) memiliki gap manpower tertinggi (12 operator absent/off).",
        evidence: "Required: 180 orang, Scheduled: 175 orang, Present: 168 orang (Coverage Rate 93.3%).",
        trend: "Trend kehadiran shift malam turun 2.8% pada pertengahan bulan.",
        possibleCauses: [
          "Masa fatigue dan penyesuaian pola tidur karyawan rotasi 2 minggu.",
          "Beberapa driver HD mengajukan sakit mendadak.",
        ],
        risk: "HIGH",
        recommendation: "Aktifkan Standby Operator Pool dari Shift 1 atau berikan insentif shift malam berjenjang.",
        expectedImpact: "Mencegah idle time unit haul truck dan menjaga target ritase harian 45,000 Ton.",
        confidence: "Medium",
      };
    }

    return {
      finding: "Tingkat Kehadiran (Attendance Rate) Keseluruhan Site Hari Ini Adalah 96.2%.",
      evidence: "Dari total 210 karyawan scheduled shift 1, sebanyak 202 hadir tepat waktu / terverifikasi GPS.",
      trend: "Stabilitas presensi berada di atas target minimum KPI perusahaan (95.0%).",
      possibleCauses: ["Penerapan Dynamic QR & Geofence GPS efektif menekan keterlambatan dan salah lokasi."],
      risk: "LOW",
      recommendation: "Pertahankan pemantauan berkala via Attendance Command Center & validasi insentif presensi bulanan.",
      expectedImpact: "Menjaga disiplin operasional tambang dan akurasi data penggajian.",
      confidence: "High",
    };
  }

  // Export Generators
  public exportDailyReportCSV(): void {
    const headers = [
      "No Presensi",
      "NIK",
      "Nama Karyawan",
      "Departemen",
      "Jabatan",
      "Tanggal",
      "Shift",
      "Jam Masuk",
      "Jam Keluar",
      "Terlambat (Mnt)",
      "Jam Kerja (Jam)",
      "Potensi Lembur (Jam)",
      "Status",
      "Metode Presensi",
      "Lokasi Checkpoint",
      "Verifikasi GPS",
    ];

    const rows = this.records.map((r) => [
      r.attendanceId,
      r.employeeNumber,
      `"${r.employeeName}"`,
      `"${r.departmentName}"`,
      `"${r.positionName}"`,
      r.date,
      `"${r.shiftName}"`,
      r.clockIn || "-",
      r.clockOut || "-",
      r.lateMinutes,
      r.netWorkingHours,
      r.potentialOvertimeHours,
      r.status,
      r.source,
      `"${r.locationName || "-"}"`,
      r.verificationStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Presensi_Harian_Tambang_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportMonthlyReportCSV(): void {
    const headers = [
      "NIK",
      "Nama Karyawan",
      "Departemen",
      "Total Hari Kerja Scheduled",
      "Jumlah Hadir",
      "Terlambat (Kali)",
      "Izin / Cuti",
      "Sakit / Training",
      "Alpha / Absen",
      "Total Jam Lembur Approved",
      "Attendance Rate (%)",
    ];

    const rows = [
      ["NIK-2021-001", '"Budi Santoso"', '"Mining & Operation"', 24, 24, 0, 0, 0, 0, 18.5, "100.0%"],
      ["NIK-2022-045", '"Siti Aminah"', '"HSE & Environmental"', 24, 23, 1, 1, 0, 0, 6.0, "95.8%"],
      ["NIK-2020-012", '"Agus Setiawan"', '"Mining & Operation"', 24, 22, 3, 0, 1, 1, 12.0, "91.6%"],
      ["NIK-2019-008", '"Joko Widodo"', '"Plant & Maintenance"', 24, 24, 0, 0, 0, 0, 28.0, "100.0%"],
      ["NIK-2023-102", '"Dewi Lestari"', '"Mine Engineering"', 24, 18, 0, 5, 1, 0, 0.0, "75.0%"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Rekap_Presensi_Bulanan_${new Date().toISOString().slice(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const attendanceRepository = new AttendanceRepository();
