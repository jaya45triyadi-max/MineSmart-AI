import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Award,
  GraduationCap,
  Calendar,
  Clock,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Bot,
  FileSpreadsheet,
  FolderGit2,
  Settings,
  Activity,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { hrRepository } from "../../services/repositories/HRRepository";
import {
  HRKPISummary,
  Department,
  Position,
  Employee,
  Skill,
  EmployeeSkill,
  Certification,
  TrainingProgram,
  TrainingSession,
  EmployeeTrainingRecord,
  RosterEntry,
  ShiftTemplate,
  AttendanceRecord,
  LeaveRequest,
  OvertimeRecord,
  ManpowerPlan,
  SuccessionReadiness,
  HRAIInsight,
  EmployeeDocument,
} from "../../types/hrTypes";

// HR Sub-Tab Components
import { HRCommandCenterTab } from "./components/HRCommandCenterTab";
import { SkillMatrixHierarchyTab } from "./components/SkillMatrixHierarchyTab";
import { EmployeeMasterTab } from "./components/EmployeeMasterTab";
import { DepartmentManagementTab } from "./components/DepartmentManagementTab";
import { PositionManagementTab } from "./components/PositionManagementTab";
import { SkillManagementTab } from "./components/SkillManagementTab";
import { CertificationManagementTab } from "./components/CertificationManagementTab";
import { TrainingManagementTab } from "./components/TrainingManagementTab";
import { RosterManagementTab } from "./components/RosterManagementTab";
import { AttendanceManagementTab } from "./components/AttendanceManagementTab";
import { LeaveManagementTab } from "./components/LeaveManagementTab";
import { OvertimeManagementTab } from "./components/OvertimeManagementTab";
import { ManpowerPlanningTab } from "./components/ManpowerPlanningTab";
import { CompetencyReadinessTab } from "./components/CompetencyReadinessTab";
import { HRAnalyticsTab } from "./components/HRAnalyticsTab";
import { HRAIAssistantTab } from "./components/HRAIAssistantTab";
import { HRReportsExportTab } from "./components/HRReportsExportTab";
import { HRDocumentsTab } from "./components/HRDocumentsTab";
import { HRSettingsTab } from "./components/HRSettingsTab";
import { EmployeeProfileModal } from "./components/EmployeeProfileModal";

export type HRSubTab =
  | "command-center"
  | "skill-matrix"
  | "employees"
  | "departments"
  | "positions"
  | "skills"
  | "certifications"
  | "training"
  | "roster"
  | "attendance"
  | "leave"
  | "overtime"
  | "manpower-planning"
  | "competency-readiness"
  | "analytics"
  | "ai-insight"
  | "reports"
  | "documents"
  | "settings";

interface HRModuleProps {
  onOpenAICopilot?: () => void;
}

export const HRModule: React.FC<HRModuleProps> = ({ onOpenAICopilot }) => {
  const { activeSite, company } = useAuth();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<HRSubTab>("command-center");

  // Selected employee for profile modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Data Collections State
  const [kpi, setKpi] = useState<HRKPISummary | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<EmployeeTrainingRecord[]>([]);
  const [rosterEntries, setRosterEntries] = useState<RosterEntry[]>([]);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [manpowerPlans, setManpowerPlans] = useState<ManpowerPlan[]>([]);
  const [successionReadiness, setSuccessionReadiness] = useState<SuccessionReadiness[]>([]);
  const [aiInsights, setAiInsights] = useState<HRAIInsight[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load all HR domain data
  const loadHRData = async () => {
    setIsLoading(true);
    try {
      const [
        kpiRes,
        deptRes,
        posRes,
        empRes,
        skRes,
        empSkRes,
        certRes,
        trnProgRes,
        trnSessRes,
        trnRecRes,
        rstRes,
        stRes,
        attRes,
        lvRes,
        otRes,
        mpRes,
        succRes,
        aiRes,
        docRes,
      ] = await Promise.all([
        hrRepository.getKPISummary(),
        hrRepository.getDepartments(),
        hrRepository.getPositions(),
        hrRepository.getEmployees(),
        hrRepository.getSkills(),
        hrRepository.getEmployeeSkills(),
        hrRepository.getCertifications(),
        hrRepository.getTrainingPrograms(),
        hrRepository.getTrainingSessions(),
        hrRepository.getTrainingRecords(),
        hrRepository.getRosterEntries(),
        hrRepository.getShiftTemplates(),
        hrRepository.getAttendanceRecords(),
        hrRepository.getLeaveRequests(),
        hrRepository.getOvertimeRecords(),
        hrRepository.getManpowerPlans(),
        hrRepository.getSuccessionReadiness(),
        hrRepository.getAIInsights(),
        hrRepository.getDocuments(),
      ]);

      setKpi(kpiRes);
      setDepartments(deptRes);
      setPositions(posRes);
      setEmployees(empRes);
      setSkills(skRes);
      setEmployeeSkills(empSkRes);
      setCertifications(certRes);
      setTrainingPrograms(trnProgRes);
      setTrainingSessions(trnSessRes);
      setTrainingRecords(trnRecRes);
      setRosterEntries(rstRes);
      setShiftTemplates(stRes);
      setAttendanceRecords(attRes);
      setLeaveRequests(lvRes);
      setOvertimeRecords(otRes);
      setManpowerPlans(mpRes);
      setSuccessionReadiness(succRes);
      setAiInsights(aiRes);
      setDocuments(docRes);
    } catch (err) {
      console.error("Failed to load HR module data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHRData();
  }, [activeSite.id, company.id]);

  // Handler functions for user actions
  const handleAddEmployee = async (empData: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    await hrRepository.addEmployee(empData);
    await loadHRData();
  };

  const handleAddEmployeeSkill = async (skillData: Omit<EmployeeSkill, "id">) => {
    await hrRepository.addEmployeeSkill(skillData);
    await loadHRData();
  };

  const handleAddCertification = async (certData: Omit<Certification, "id">) => {
    await hrRepository.addCertification(certData);
    await loadHRData();
  };

  const handleAddTrainingSession = async (sessData: Omit<TrainingSession, "id">) => {
    await hrRepository.addTrainingSession(sessData);
    await loadHRData();
  };

  const handleAddRosterEntry = async (rosterData: Omit<RosterEntry, "id">) => {
    await hrRepository.addRosterEntry(rosterData);
    await loadHRData();
  };

  const handleAddAttendance = async (attData: Omit<AttendanceRecord, "id">) => {
    await hrRepository.addAttendanceRecord(attData);
    await loadHRData();
  };

  const handleAddLeave = async (leaveData: Omit<LeaveRequest, "id">) => {
    await hrRepository.addLeaveRequest(leaveData);
    await loadHRData();
  };

  const handleAddOvertime = async (otData: Omit<OvertimeRecord, "id">) => {
    await hrRepository.addOvertimeRecord(otData);
    await loadHRData();
  };

  // CSV Export for HR Data
  const exportHRData = () => {
    const headers = ["Employee ID", "NIK", "Nama Lengkap", "Departemen", "Jabatan", "Tipe", "Status", "Telepon", "Email"];
    const rows = employees.map((e) => [
      e.employeeId,
      e.employeeNumber,
      `"${e.name}"`,
      `"${e.departmentName}"`,
      `"${e.positionName}"`,
      e.employmentType,
      e.employmentStatus,
      e.phone,
      e.email,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HR_Master_Karyawan_${activeSite.code}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Nav Tabs configuration - covering all 12 core domains and hierarchy view
  const navTabs: { key: HRSubTab; label: string; icon: any; count?: number; highlight?: boolean }[] = [
    { key: "command-center", label: "Command Center", icon: Activity },
    { key: "skill-matrix", label: "Skill Matrix (Emp → Skill → Cert → Expiry)", icon: Sparkles, count: employeeSkills.length, highlight: true },
    { key: "employees", label: "Master Karyawan", icon: Users, count: employees.length },
    { key: "positions", label: "Jabatan (Position)", icon: Briefcase, count: positions.length },
    { key: "departments", label: "Departemen", icon: Building2, count: departments.length },
    { key: "skills", label: "Katalog Skill", icon: Award, count: skills.length },
    { key: "certifications", label: "Sertifikasi K3 & SIO", icon: ShieldCheck, count: kpi ? kpi.expiringSoonCertificationsCount + kpi.expiredCertificationsCount : undefined },
    { key: "training", label: "Pelatihan / Training", icon: GraduationCap, count: trainingPrograms.length },
    { key: "attendance", label: "Presensi / Kehadiran", icon: Clock },
    { key: "roster", label: "Roster & Shift", icon: Calendar },
    { key: "leave", label: "Cuti & Izin", icon: CalendarDays },
    { key: "overtime", label: "Lembur / Overtime", icon: TrendingUp },
    { key: "manpower-planning", label: "Manpower Planning", icon: Users },
    { key: "competency-readiness", label: "Kesiapan & Suksesi", icon: ShieldCheck },
    { key: "analytics", label: "HR Analytics", icon: BarChart3 },
    { key: "ai-insight", label: "AI HR Copilot", icon: Bot },
    { key: "reports", label: "Laporan & Ekspor", icon: FileSpreadsheet },
    { key: "documents", label: "Dokumen Digital", icon: FolderGit2 },
    { key: "settings", label: "Pengaturan HR & Shift", icon: Settings },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Module Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              PROMPT 27 — HR & HUMAN CAPITAL MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">
              Site: <strong className="text-slate-200">{activeSite.name}</strong> ({activeSite.code})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Mining HR, Manpower & Competency System
          </h1>
          <p className="text-xs text-slate-400">
            Sistem terintegrasi pengelolaan karyawan tambang, roster shift, presensi, sertifikasi K3/SIO, pelatihan, dan suksesi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAICopilot && (
            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 shadow-lg shadow-emerald-500/10 transition-all"
            >
              <Bot className="h-4 w-4 text-emerald-400" />
              <span>AI HR Assistant</span>
            </button>
          )}

          <button
            onClick={exportHRData}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Ekspor Master Data</span>
          </button>

          <button
            onClick={loadHRData}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
            title="Refresh HR Data"
          >
            <RefreshCw className={`h-4 w-4 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-slate-950 text-emerald-400" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content Rendering */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50">
          <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Memuat data HR & Manpower Tambang...</p>
        </div>
      ) : (
        <>
          {activeTab === "command-center" && (
            <HRCommandCenterTab
              kpi={kpi}
              employees={employees}
              certifications={certifications}
              aiInsights={aiInsights}
              onNavigateTab={(tab) => setActiveTab(tab as HRSubTab)}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            />
          )}

          {activeTab === "skill-matrix" && (
            <SkillMatrixHierarchyTab
              employees={employees}
              skills={skills}
              employeeSkills={employeeSkills}
              certifications={certifications}
              departments={departments}
              positions={positions}
              onAddSkillMapping={handleAddEmployeeSkill}
              onAddCertification={handleAddCertification}
            />
          )}

          {activeTab === "employees" && (
            <EmployeeMasterTab
              employees={employees}
              departments={departments}
              positions={positions}
              onAddEmployee={handleAddEmployee}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            />
          )}

          {activeTab === "departments" && (
            <DepartmentManagementTab departments={departments} />
          )}

          {activeTab === "positions" && (
            <PositionManagementTab positions={positions} departments={departments} />
          )}

          {activeTab === "skills" && (
            <SkillManagementTab skills={skills} employeeSkills={employeeSkills} />
          )}

          {activeTab === "certifications" && (
            <CertificationManagementTab
              certifications={certifications}
              employees={employees}
              onAddCertification={handleAddCertification}
            />
          )}

          {activeTab === "training" && (
            <TrainingManagementTab
              trainingPrograms={trainingPrograms}
              trainingSessions={trainingSessions}
              trainingRecords={trainingRecords}
              onAddTrainingSession={handleAddTrainingSession}
            />
          )}

          {activeTab === "roster" && (
            <RosterManagementTab
              rosterEntries={rosterEntries}
              employees={employees}
              shiftTemplates={shiftTemplates}
              onAddRosterEntry={handleAddRosterEntry}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceManagementTab
              attendanceRecords={attendanceRecords}
              employees={employees}
              onAddAttendance={handleAddAttendance}
            />
          )}

          {activeTab === "leave" && (
            <LeaveManagementTab
              leaveRequests={leaveRequests}
              employees={employees}
              onAddLeave={handleAddLeave}
            />
          )}

          {activeTab === "overtime" && (
            <OvertimeManagementTab
              overtimeRecords={overtimeRecords}
              employees={employees}
              onAddOvertime={handleAddOvertime}
            />
          )}

          {activeTab === "manpower-planning" && (
            <ManpowerPlanningTab
              manpowerPlans={manpowerPlans}
              departments={departments}
              positions={positions}
            />
          )}

          {activeTab === "competency-readiness" && (
            <CompetencyReadinessTab
              successionReadiness={successionReadiness}
              positions={positions}
              employees={employees}
            />
          )}

          {activeTab === "analytics" && (
            <HRAnalyticsTab
              kpi={kpi}
              departments={departments}
              employees={employees}
              overtimeRecords={overtimeRecords}
              attendanceRecords={attendanceRecords}
            />
          )}

          {activeTab === "ai-insight" && (
            <HRAIAssistantTab
              aiInsights={aiInsights}
              employees={employees}
              certifications={certifications}
              kpi={kpi}
            />
          )}

          {activeTab === "reports" && (
            <HRReportsExportTab
              kpi={kpi}
              employees={employees}
              certifications={certifications}
              attendanceRecords={attendanceRecords}
              leaveRequests={leaveRequests}
            />
          )}

          {activeTab === "documents" && (
            <HRDocumentsTab documents={documents} employees={employees} />
          )}

          {activeTab === "settings" && (
            <HRSettingsTab shiftTemplates={shiftTemplates} />
          )}
        </>
      )}

      {/* Employee Profile Detail Modal */}
      <EmployeeProfileModal
        employee={selectedEmployee}
        certifications={certifications}
        skills={employeeSkills}
        trainings={trainingRecords}
        attendance={attendanceRecords}
        leaves={leaveRequests}
        overtime={overtimeRecords}
        documents={documents}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
