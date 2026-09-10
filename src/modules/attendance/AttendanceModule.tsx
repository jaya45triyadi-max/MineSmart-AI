import React, { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  QrCode,
  MapPin,
  Layers,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Bot,
  Settings,
  Download,
  RefreshCw,
  Users,
  Camera,
  Calendar,
  Plane,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { attendanceRepository } from "../../services/repositories/AttendanceRepository";
import { hrRepository } from "../../services/repositories/HRRepository";
import {
  AttendanceKPISummaryExtended,
  AttendanceRecordExtended,
  AttendanceRiskSignal,
  AIAttendanceAnalysis,
  ShiftCoverageItem,
  AttendanceException,
  AttendanceCorrection,
  AttendanceDevice,
  AttendancePolicy,
} from "../../types/attendanceTypes";
import { Department, Employee, Position } from "../../types/hrTypes";

// Sub-Tab Components
import { ManpowerAvailabilityDashboard } from "./components/ManpowerAvailabilityDashboard";
import { AttendanceCommandCenterTab } from "./components/AttendanceCommandCenterTab";
import { ClockInOutTab } from "./components/ClockInOutTab";
import { FaceVerificationTab } from "./components/FaceVerificationTab";
import { QRAttendanceTab } from "./components/QRAttendanceTab";
import { GPSGeofenceTab } from "./components/GPSGeofenceTab";
import { ShiftCoverageTab } from "./components/ShiftCoverageTab";
import { RosterAttendanceTab } from "./components/RosterAttendanceTab";
import { OvertimeWorkflowTab } from "./components/OvertimeWorkflowTab";
import { LeaveAttendanceTab } from "./components/LeaveAttendanceTab";
import { AttendanceRecordsTab } from "./components/AttendanceRecordsTab";
import { AttendanceExceptionsTab } from "./components/AttendanceExceptionsTab";
import { AttendanceApprovalsTab } from "./components/AttendanceApprovalsTab";
import { AttendanceReportsTab } from "./components/AttendanceReportsTab";
import { AttendanceAnalyticsTab } from "./components/AttendanceAnalyticsTab";
import { AIAttendanceAssistantTab } from "./components/AIAttendanceAssistantTab";
import { AttendanceSettingsTab } from "./components/AttendanceSettingsTab";

export type AttendanceSubTab =
  | "manpower-availability"
  | "command-center"
  | "clock"
  | "face"
  | "gps"
  | "qr"
  | "shift"
  | "roster"
  | "overtime"
  | "leave"
  | "records"
  | "exceptions"
  | "approvals"
  | "reports"
  | "analytics"
  | "ai-insight"
  | "settings";

interface AttendanceModuleProps {
  onOpenAICopilot?: () => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, company } = useAuth();

  const [activeTab, setActiveTab] = useState<AttendanceSubTab>("manpower-availability");

  // State Collections
  const [kpi, setKpi] = useState<AttendanceKPISummaryExtended | null>(null);
  const [records, setRecords] = useState<AttendanceRecordExtended[]>([]);
  const [riskSignals, setRiskSignals] = useState<AttendanceRiskSignal[]>([]);
  const [shiftCoverage, setShiftCoverage] = useState<ShiftCoverageItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAttendanceAnalysis | null>(null);
  const [exceptions, setExceptions] = useState<AttendanceException[]>([]);
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([]);
  const [devices, setDevices] = useState<AttendanceDevice[]>([]);
  const [policies, setPolicies] = useState<AttendancePolicy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load All Attendance Data
  const loadAttendanceData = async () => {
    setIsLoading(true);
    try {
      const [
        kpiRes,
        recRes,
        riskRes,
        scRes,
        aiRes,
        excRes,
        corrRes,
        devRes,
        polRes,
        deptRes,
        posRes,
        empRes,
      ] = await Promise.all([
        attendanceRepository.getKPISummary(),
        attendanceRepository.getAttendanceRecords(),
        attendanceRepository.getRiskSignals(),
        attendanceRepository.getShiftCoverage(),
        attendanceRepository.queryAIAssistant("ringkasan kehadiran hari ini"),
        attendanceRepository.getExceptions(),
        attendanceRepository.getCorrections(),
        attendanceRepository.getDevices(),
        attendanceRepository.getPolicies(),
        hrRepository.getDepartments(),
        hrRepository.getPositions(),
        hrRepository.getEmployees(),
      ]);

      setKpi(kpiRes);
      setRecords(recRes);
      setRiskSignals(riskRes);
      setShiftCoverage(scRes);
      setAiAnalysis(aiRes);
      setExceptions(excRes);
      setCorrections(corrRes);
      setDevices(devRes);
      setPolicies(polRes);
      setDepartments(deptRes);
      setPositions(posRes);
      setEmployees(empRes);
    } catch (err) {
      console.error("Failed to load attendance module data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [activeSite.id, company.id]);

  // Clock In Action Handler
  const handleClockIn = async (data: {
    employeeId: string;
    employeeName: string;
    source: "QR_DYNAMIC" | "GPS" | "FACE_VERIFICATION";
    coords?: { lat: number; lng: number };
    qrToken?: string;
  }) => {
    const res = await attendanceRepository.clockIn({
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      shiftId: "shift-1",
      siteId: activeSite.id || "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      source: data.source,
      latitude: data.coords?.lat,
      longitude: data.coords?.lng,
      qrToken: data.qrToken,
      deviceId: "DEV-IP14-PRO-881",
    });

    if (!res.success) {
      throw new Error(res.message);
    }
    await loadAttendanceData();
  };

  // Clock Out Action Handler
  const handleClockOut = async (attendanceId: string) => {
    const res = await attendanceRepository.clockOut({
      employeeId: "EMP-001",
      attendanceId,
      source: "GPS",
      deviceId: "DEV-IP14-PRO-881",
    });

    if (!res.success) {
      throw new Error(res.message);
    }
    await loadAttendanceData();
  };

  // Correction Handlers
  const handleSubmitCorrection = async (data: Omit<AttendanceCorrection, "id" | "requestNumber" | "status" | "createdAt" | "updatedAt">) => {
    await attendanceRepository.submitCorrection(data);
    await loadAttendanceData();
  };

  const handleApproveCorrection = async (id: string, approverName: string, comment: string) => {
    await attendanceRepository.approveCorrection(id, approverName, comment);
    await loadAttendanceData();
  };

  const handleRejectCorrection = async (id: string, approverName: string, comment: string) => {
    await attendanceRepository.rejectCorrection(id, approverName, comment);
    await loadAttendanceData();
  };

  // Active Clock In Record for current user
  const activeRecord = records.find(
    (r) => r.employeeId === "EMP-001" && r.date === new Date().toISOString().split("T")[0]
  );

  // Sub-Navigation Tabs
  const navTabs: { key: AttendanceSubTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { key: "manpower-availability", label: "Dashboard: Manpower Availability", icon: Users, badge: "LIVE" },
    { key: "command-center", label: "Command Center", icon: Activity },
    { key: "clock", label: "Clock In / Out", icon: Clock },
    { key: "face", label: "Face Verification", icon: Camera },
    { key: "gps", label: "GPS & Geofencing", icon: MapPin },
    { key: "qr", label: "Dynamic QR", icon: QrCode },
    { key: "shift", label: "Shift Coverage", icon: Layers },
    { key: "roster", label: "Roster Management", icon: Calendar },
    { key: "overtime", label: "Overtime (Lembur)", icon: TrendingUp },
    { key: "leave", label: "Leave & Cuti", icon: Plane },
    { key: "records", label: "Master Ledger", icon: FileSpreadsheet, count: records.length },
    { key: "exceptions", label: "Anomali & Koreksi", icon: AlertTriangle, count: exceptions.length },
    { key: "approvals", label: "Approval Hub", icon: CheckCircle2, count: kpi?.pendingCorrectionsCount },
    { key: "reports", label: "Laporan Presensi", icon: FileSpreadsheet },
    { key: "analytics", label: "Analytics & Trend", icon: BarChart3 },
    { key: "ai-insight", label: "AI Attendance Copilot", icon: Bot },
    { key: "settings", label: "Aturan & Perangkat", icon: Settings },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              ATTENDANCE, ROSTER & MANPOWER SYSTEM
            </span>
            <span className="text-xs text-slate-400">
              Site: <strong className="text-slate-200">{activeSite.name}</strong> ({activeSite.code})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Mining Attendance, Roster & Manpower Availability
          </h1>
          <p className="text-xs text-slate-400">
            Sistem presensi terpadu tambang batu bara: Multi-Mode Clock In/Out (GPS, QR, Face Verification), Shift Coverage, Roster Cycles, SPKL Overtime, Leave & Dashboard Manpower Availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 shadow-lg transition-all cursor-pointer"
            >
              <Bot className="h-4 w-4 text-emerald-400" />
              <span>AI Copilot</span>
            </button>
          )}

          <button
            onClick={() => attendanceRepository.exportDailyReportCSV()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Ekspor Presensi</span>
          </button>

          <button
            onClick={loadAttendanceData}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
            title="Refresh Presensi Data"
          >
            <RefreshCw className={`h-4 w-4 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${isActive ? "bg-slate-950 text-emerald-400" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"}`}>
                  {t.badge}
                </span>
              )}
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-slate-950 text-emerald-400" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50">
          <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Memuat Data Presensi, Roster & Manpower Server...</p>
        </div>
      ) : (
        <>
          {activeTab === "manpower-availability" && (
            <ManpowerAvailabilityDashboard
              employees={employees}
              attendanceRecords={records}
              shiftCoverage={shiftCoverage}
              departments={departments}
              positions={positions}
              onNavigateTab={(tab) => setActiveTab(tab as AttendanceSubTab)}
            />
          )}

          {activeTab === "command-center" && (
            <AttendanceCommandCenterTab
              kpi={kpi}
              records={records}
              riskSignals={riskSignals}
              shiftCoverage={shiftCoverage}
              aiAnalysis={aiAnalysis}
              onNavigateTab={(tab) => setActiveTab(tab as AttendanceSubTab)}
            />
          )}

          {activeTab === "clock" && (
            <ClockInOutTab
              currentEmployee={employees[0] || null}
              activeRecord={activeRecord || null}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}

          {activeTab === "face" && (
            <FaceVerificationTab
              employees={employees}
              records={records}
              onClockIn={async (data) => {
                await handleClockIn({
                  employeeId: data.employeeId,
                  employeeName: data.employeeName,
                  source: "FACE_VERIFICATION",
                  coords: data.coords,
                });
              }}
              onClockOut={handleClockOut}
            />
          )}

          {activeTab === "qr" && <QRAttendanceTab />}

          {activeTab === "gps" && <GPSGeofenceTab />}

          {activeTab === "shift" && (
            <ShiftCoverageTab
              shiftCoverage={shiftCoverage}
              onNavigateTab={(tab) => setActiveTab(tab as AttendanceSubTab)}
            />
          )}

          {activeTab === "roster" && (
            <RosterAttendanceTab employees={employees} />
          )}

          {activeTab === "overtime" && <OvertimeWorkflowTab records={records} />}

          {activeTab === "leave" && (
            <LeaveAttendanceTab employees={employees} />
          )}

          {activeTab === "records" && (
            <AttendanceRecordsTab
              records={records}
              departments={departments}
              onExportCSV={() => attendanceRepository.exportDailyReportCSV()}
            />
          )}

          {activeTab === "exceptions" && (
            <AttendanceExceptionsTab
              exceptions={exceptions}
              corrections={corrections}
              onSubmitCorrection={handleSubmitCorrection}
            />
          )}

          {activeTab === "approvals" && (
            <AttendanceApprovalsTab
              corrections={corrections}
              onApprove={handleApproveCorrection}
              onReject={handleRejectCorrection}
            />
          )}

          {activeTab === "reports" && (
            <AttendanceReportsTab kpi={kpi} records={records} />
          )}

          {activeTab === "analytics" && <AttendanceAnalyticsTab kpi={kpi} />}

          {activeTab === "ai-insight" && (
            <AIAttendanceAssistantTab riskSignals={riskSignals} />
          )}

          {activeTab === "settings" && (
            <AttendanceSettingsTab
              policies={policies}
              devices={devices}
              onUpdatePolicy={async (pol) => {
                setPolicies([pol]);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
