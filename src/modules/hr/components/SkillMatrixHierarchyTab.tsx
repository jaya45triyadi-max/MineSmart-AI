import React, { useState, useMemo } from "react";
import {
  Users,
  Award,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  FileCheck,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Eye,
  Check,
  X,
  GraduationCap,
} from "lucide-react";
import {
  Employee,
  Skill,
  EmployeeSkill,
  Certification,
  Department,
  Position,
  SkillLevel,
} from "../../../types/hrTypes";

interface Props {
  employees: Employee[];
  skills: Skill[];
  employeeSkills: EmployeeSkill[];
  certifications: Certification[];
  departments: Department[];
  positions: Position[];
  onAddSkillMapping?: (mapping: Omit<EmployeeSkill, "id">) => void;
  onAddCertification?: (cert: Omit<Certification, "id">) => void;
}

export type ViewMode = "HIERARCHY" | "MATRIX_GRID" | "EXPIRY_RADAR";

export const SkillMatrixHierarchyTab: React.FC<Props> = ({
  employees,
  skills,
  employeeSkills,
  certifications,
  departments,
  positions,
  onAddSkillMapping,
  onAddCertification,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("HIERARCHY");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState<string>("ALL");
  const [criticalHseOnly, setCriticalHseOnly] = useState<boolean>(false);
  const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({
    "EMP-001": true,
    "EMP-014": true,
    "EMP-088": true,
  });

  // Modal State for Add Skill / Cert
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"SKILL" | "CERT">("SKILL");
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.employeeId || "EMP-001");
  const [newSkillId, setNewSkillId] = useState<string>(skills[0]?.skillId || "");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("INTERMEDIATE");
  const [newCertName, setNewCertName] = useState<string>("");
  const [newCertNumber, setNewCertNumber] = useState<string>("");
  const [newCertIssuer, setNewCertIssuer] = useState<string>("Kementerian Ketenagakerjaan RI");
  const [newCertExpiry, setNewCertExpiry] = useState<string>("");

  // Helper to calculate expiry days diff
  const calculateDaysRemaining = (expiryDateStr: string) => {
    if (!expiryDateStr) return { days: 0, text: "No Date", status: "VALID" };
    const today = new Date("2026-08-15"); // current app system anchor date
    const exp = new Date(expiryDateStr);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        days: diffDays,
        text: `Kedaluwarsa ${Math.abs(diffDays)} hari lalu`,
        status: "EXPIRED" as const,
      };
    } else if (diffDays <= 60) {
      return {
        days: diffDays,
        text: `Berakhir dalam ${diffDays} hari`,
        status: "EXPIRING_SOON" as const,
      };
    } else {
      const years = (diffDays / 365).toFixed(1);
      return {
        days: diffDays,
        text: `Berlaku (${years} thn / ${diffDays} hari)`,
        status: "VALID" as const,
      };
    }
  };

  // Toggle single employee expand/collapse
  const toggleEmployee = (empId: string) => {
    setExpandedEmployees((prev) => ({
      ...prev,
      [empId]: !prev[empId],
    }));
  };

  // Expand / Collapse all
  const toggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    employees.forEach((e) => {
      newState[e.employeeId] = expand;
    });
    setExpandedEmployees(newState);
  };

  // Build the hierarchical dataset: Employee -> Skills -> Certifications -> Expiry
  const hierarchicalData = useMemo(() => {
    return employees.map((emp) => {
      // Find all skills assigned to this employee
      const empSkills = employeeSkills.filter((es) => es.employeeId === emp.employeeId);

      // Find all certifications of this employee
      const empCerts = certifications.filter((c) => c.employeeId === emp.employeeId);

      // Group skills with linked/relevant certifications
      const skillNodes = empSkills.map((sk) => {
        // Link certifications to this skill by matching name keywords or employee association
        const matchingCerts = empCerts.filter((c) => {
          const skName = sk.skillName.toLowerCase();
          const cName = c.name.toLowerCase();
          if (skName.includes("pit") || skName.includes("supervision")) {
            return cName.includes("pop") || cName.includes("pom") || cName.includes("pou");
          }
          if (skName.includes("exca") || skName.includes("digging")) {
            return cName.includes("sio") || cName.includes("simper") || cName.includes("excavator");
          }
          if (skName.includes("hydraul") || skName.includes("loto") || skName.includes("mechanic")) {
            return cName.includes("komatsu") || cName.includes("loto") || cName.includes("mechanic");
          }
          if (skName.includes("safety") || skName.includes("jsa") || skName.includes("hazard")) {
            return cName.includes("k3") || cName.includes("pop") || cName.includes("rescue") || cName.includes("first aid");
          }
          if (skName.includes("survey") || skName.includes("drone") || skName.includes("dtm")) {
            return cName.includes("uav") || cName.includes("drone") || cName.includes("survey");
          }
          if (skName.includes("haul") || skName.includes("truck")) {
            return cName.includes("sio") || cName.includes("truck") || cName.includes("simper");
          }
          if (skName.includes("env") || skName.includes("acid")) {
            return cName.includes("pppa") || cName.includes("lingkungan") || cName.includes("ak3u");
          }
          return false;
        });

        // Fallback: If no matching cert found, provide remaining unlinked certs or empty list
        const linkedCerts = matchingCerts.length > 0 ? matchingCerts : [];

        return {
          ...sk,
          certifications: linkedCerts.map((cert) => {
            const expiryCalc = calculateDaysRemaining(cert.expiryDate);
            return {
              ...cert,
              expiryCalc,
            };
          }),
        };
      });

      // Also gather any certifications not mapped directly to a specific skill
      const unmappedCerts = empCerts
        .filter(
          (c) => !skillNodes.some((sn) => sn.certifications.some((sc) => sc.id === c.id))
        )
        .map((cert) => ({
          ...cert,
          expiryCalc: calculateDaysRemaining(cert.expiryDate),
        }));

      // Count status badges
      const allEmpCerts = empCerts.map((c) => calculateDaysRemaining(c.expiryDate));
      const expiredCount = allEmpCerts.filter((c) => c.status === "EXPIRED").length;
      const expiringSoonCount = allEmpCerts.filter((c) => c.status === "EXPIRING_SOON").length;
      const validCount = allEmpCerts.filter((c) => c.status === "VALID").length;

      return {
        employee: emp,
        skills: skillNodes,
        unmappedCerts,
        totalSkills: empSkills.length,
        totalCerts: empCerts.length,
        expiredCount,
        expiringSoonCount,
        validCount,
      };
    });
  }, [employees, employeeSkills, certifications]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return hierarchicalData.filter((item) => {
      // Search filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchEmp =
          item.employee.name.toLowerCase().includes(query) ||
          item.employee.employeeId.toLowerCase().includes(query) ||
          item.employee.employeeNumber.toLowerCase().includes(query) ||
          item.employee.positionName.toLowerCase().includes(query) ||
          item.employee.departmentName.toLowerCase().includes(query);

        const matchSkill = item.skills.some((s) =>
          s.skillName.toLowerCase().includes(query)
        );

        const matchCert =
          item.skills.some((s) =>
            s.certifications.some(
              (c) =>
                c.name.toLowerCase().includes(query) ||
                c.certificateNumber.toLowerCase().includes(query) ||
                c.issuer.toLowerCase().includes(query)
            )
          ) ||
          item.unmappedCerts.some(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.certificateNumber.toLowerCase().includes(query) ||
              c.issuer.toLowerCase().includes(query)
          );

        if (!matchEmp && !matchSkill && !matchCert) return false;
      }

      // Department filter
      if (selectedDepartment !== "ALL" && item.employee.departmentName !== selectedDepartment) {
        return false;
      }

      // Critical HSE filter
      if (criticalHseOnly) {
        const hasCritical =
          item.skills.some((s) =>
            s.certifications.some((c) => c.isCriticalForHSE || c.isCriticalForEquipment)
          ) ||
          item.unmappedCerts.some((c) => c.isCriticalForHSE || c.isCriticalForEquipment);
        if (!hasCritical) return false;
      }

      // Expiry filter
      if (selectedExpiryFilter === "EXPIRED" && item.expiredCount === 0) return false;
      if (selectedExpiryFilter === "EXPIRING_SOON" && item.expiringSoonCount === 0) return false;
      if (selectedExpiryFilter === "VALID_ONLY" && (item.expiredCount > 0 || item.expiringSoonCount > 0)) return false;

      return true;
    });
  }, [hierarchicalData, searchTerm, selectedDepartment, criticalHseOnly, selectedExpiryFilter]);

  // Aggregate Metrics Summary
  const aggregateMetrics = useMemo(() => {
    const totalEmps = employees.length;
    const totalSkillsCount = employeeSkills.length;
    const totalCertsCount = certifications.length;
    const expiredCount = certifications.filter((c) => calculateDaysRemaining(c.expiryDate).status === "EXPIRED").length;
    const expiringCount = certifications.filter((c) => calculateDaysRemaining(c.expiryDate).status === "EXPIRING_SOON").length;
    const validCount = certifications.filter((c) => calculateDaysRemaining(c.expiryDate).status === "VALID").length;
    const complianceRate = totalCertsCount > 0 ? ((validCount / totalCertsCount) * 100).toFixed(1) : "100.0";

    return {
      totalEmps,
      totalSkillsCount,
      totalCertsCount,
      expiredCount,
      expiringCount,
      validCount,
      complianceRate,
    };
  }, [employees, employeeSkills, certifications]);

  // Level Badge Color Mapper
  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case "EXPERT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "ADVANCED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "INTERMEDIATE":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "BASIC":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "BEGINNER":
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  // Expiry Status Badge Mapper
  const getExpiryBadge = (status: "VALID" | "EXPIRING_SOON" | "EXPIRED") => {
    switch (status) {
      case "EXPIRED":
        return {
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          icon: ShieldAlert,
          label: "EXPIRED / KEDALUWARSA",
        };
      case "EXPIRING_SOON":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse",
          icon: Clock,
          label: "EXPIRING SOON (<60 HARI)",
        };
      case "VALID":
      default:
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: ShieldCheck,
          label: "VALID / AKTIF",
        };
    }
  };

  // Handle Add Skill / Cert submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = employees.find((emp) => emp.employeeId === selectedEmpId);
    if (!targetEmp) return;

    if (modalType === "SKILL") {
      const targetSkill = skills.find((s) => s.skillId === newSkillId);
      if (!targetSkill || !onAddSkillMapping) return;

      onAddSkillMapping({
        employeeSkillId: `ES-${Math.floor(100 + Math.random() * 900)}`,
        employeeId: targetEmp.employeeId,
        employeeName: targetEmp.name,
        skillId: targetSkill.skillId,
        skillName: targetSkill.name,
        level: newSkillLevel,
        verified: true,
        verifiedBy: "Ir. Hendra Gunawan",
        verificationDate: new Date().toISOString().split("T")[0],
      });
    } else {
      if (!onAddCertification) return;
      onAddCertification({
        certificationId: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeId: targetEmp.employeeId,
        employeeName: targetEmp.name,
        departmentName: targetEmp.departmentName,
        name: newCertName || "Sertifikasi Kompetensi Tambang",
        certificateNumber: newCertNumber || `CERT-ESDM-${Math.floor(10000 + Math.random() * 90000)}-2026`,
        issuer: newCertIssuer,
        issueDate: new Date().toISOString().split("T")[0],
        expiryDate: newCertExpiry || "2029-08-15",
        status: "VALID",
        verificationStatus: "VERIFIED",
        isCriticalForHSE: true,
        isCriticalForEquipment: false,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-900 border border-emerald-500/30 p-6 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> COMPETENCY & SKILL MATRIX
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Hierarchical Drill-Down & Expiry Tracker
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Employee <span className="text-emerald-400">→</span> Skill{" "}
              <span className="text-teal-400">→</span> Certification{" "}
              <span className="text-amber-400">→</span> Expiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Hierarki kompetensi komprehensif memetakan setiap karyawan tambang, level keahlian teknis terverifikasi, lisensi sertifikasi K3/SIO Kemenaker/ESDM, hingga masa kedaluwarsa dokumen izin operasi secara otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setModalType("SKILL");
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Skill Karyawan
            </button>
            <button
              onClick={() => {
                setModalType("CERT");
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" /> Tambah Sertifikat/SIO
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Total Karyawan</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {aggregateMetrics.totalEmps}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">Terdaftar di Sistem</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Skill Terpetakan</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {aggregateMetrics.totalSkillsCount}
          </div>
          <span className="text-[10px] text-emerald-500 font-sans">Level 1 - 5 Terverifikasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Total Sertifikat K3/SIO</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
            {aggregateMetrics.totalCertsCount}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">Lisensi Terdata</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-rose-500 font-sans font-bold uppercase block">Kedaluwarsa (Expired)</span>
          <div className="text-2xl font-black text-rose-500 font-mono">
            {aggregateMetrics.expiredCount}
          </div>
          <span className="text-[10px] text-rose-400 font-sans font-semibold">Perlu Perpanjangan Segera</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-amber-500 font-sans font-bold uppercase block">Mendekati Expired</span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {aggregateMetrics.expiringCount}
          </div>
          <span className="text-[10px] text-amber-400 font-sans">&lt;60 Hari Kalender</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-indigo-500 font-sans font-bold uppercase block">Compliance Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {aggregateMetrics.complianceRate}%
          </div>
          <span className="text-[10px] text-emerald-500 font-sans">Kepatuhan Regulasi ESDM</span>
        </div>
      </div>

      {/* Filter Toolbar & View Mode Switcher */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setViewMode("HIERARCHY")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "HIERARCHY"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Hierarchical Tree (Employee → Skill → Cert → Expiry)
            </button>

            <button
              onClick={() => setViewMode("MATRIX_GRID")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "MATRIX_GRID"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              2D Skill Matrix Grid
            </button>

            <button
              onClick={() => setViewMode("EXPIRY_RADAR")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "EXPIRY_RADAR"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Expiry Compliance Watchlist
            </button>
          </div>

          {/* Quick Expand All / Collapse All for Hierarchy */}
          {viewMode === "HIERARCHY" && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => toggleAll(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Karyawan / Skill / No. Sertifikat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">Semua Departemen</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Status Filter */}
          <div>
            <select
              value={selectedExpiryFilter}
              onChange={(e) => setSelectedExpiryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">Semua Status Sertifikasi</option>
              <option value="EXPIRED">Hanya Expired (Kedaluwarsa)</option>
              <option value="EXPIRING_SOON">Hanya Mendekati Expired (&lt;60 Hari)</option>
              <option value="VALID_ONLY">Hanya Yang Masih Valid</option>
            </select>
          </div>

          {/* Critical HSE Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={criticalHseOnly}
                onChange={(e) => setCriticalHseOnly(e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Hanya Kritis K3 / SIO Alat Berat
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* VIEW 1: HIERARCHICAL DRILL-DOWN (EMPLOYEE -> SKILL -> CERTIFICATION -> EXPIRY) */}
      {viewMode === "HIERARCHY" && (
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-xs font-bold">Tidak ada data karyawan atau skill yang sesuai filter.</p>
            </div>
          ) : (
            filteredData.map((item) => {
              const emp = item.employee;
              const isExpanded = !!expandedEmployees[emp.employeeId];

              return (
                <div
                  key={emp.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition"
                >
                  {/* LEVEL 1: EMPLOYEE MASTER ROW */}
                  <div
                    onClick={() => toggleEmployee(emp.employeeId)}
                    className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-900 dark:text-white text-sm">
                            {emp.name}
                          </h3>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {emp.employeeId} • NIK {emp.employeeNumber}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {emp.positionName}
                          </span>
                          <span>•</span>
                          <span>{emp.departmentName}</span>
                          <span>•</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {emp.employmentStatus} ({emp.employmentType})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Alert & Summary Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                        {item.totalSkills} Skill Terdaftar
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                        {item.totalCerts} Sertifikasi
                      </span>

                      {item.expiredCount > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> {item.expiredCount} Expired
                        </span>
                      )}

                      {item.expiringSoonCount > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.expiringSoonCount} Expiring Soon
                        </span>
                      )}

                      {item.expiredCount === 0 && item.expiringSoonCount === 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All Valid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* LEVEL 2 & 3: EXPANDED SKILLS & LINKED CERTIFICATIONS ACCORDION */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/60 space-y-4">
                      {item.skills.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Belum ada keahlian terverifikasi untuk karyawan ini.
                        </p>
                      ) : (
                        item.skills.map((skillItem, sIdx) => (
                          <div
                            key={skillItem.id || sIdx}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3"
                          >
                            {/* LEVEL 2: SKILL HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                      {skillItem.skillName}
                                    </h4>
                                    <span className="font-mono text-[10px] text-slate-400">
                                      ({skillItem.skillId})
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    Diverifikasi oleh: <strong className="text-slate-700 dark:text-slate-300">{skillItem.verifiedBy || "Superintendent"}</strong> ({skillItem.verificationDate})
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadge(
                                    skillItem.level
                                  )}`}
                                >
                                  LEVEL: {skillItem.level}
                                </span>
                              </div>
                            </div>

                            {/* LEVEL 3 & 4: LINKED CERTIFICATIONS & EXPIRY TRACKER */}
                            <div className="space-y-2 pt-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                  <Award className="w-3.5 h-3.5 text-teal-400" /> Sertifikasi & Lisensi Resmi Terkait (K3 / SIO / BNSP):
                                </span>
                              </div>

                              {skillItem.certifications.length === 0 ? (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                                  <span>Tidak ada sertifikasi spesifik terlampir untuk keahlian ini.</span>
                                  <button
                                    onClick={() => {
                                      setSelectedEmpId(emp.employeeId);
                                      setModalType("CERT");
                                      setIsAddModalOpen(true);
                                    }}
                                    className="text-emerald-500 hover:text-emerald-400 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Lampirkan Sertifikat
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {skillItem.certifications.map((cert) => {
                                    const badgeInfo = getExpiryBadge(cert.expiryCalc.status);
                                    const StatusIcon = badgeInfo.icon;

                                    return (
                                      <div
                                        key={cert.id}
                                        className={`p-3.5 rounded-xl border space-y-2 transition ${
                                          cert.expiryCalc.status === "EXPIRED"
                                            ? "bg-rose-950/20 border-rose-800/40"
                                            : cert.expiryCalc.status === "EXPIRING_SOON"
                                            ? "bg-amber-950/20 border-amber-800/40"
                                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <FileCheck className="w-3.5 h-3.5 text-teal-500" />
                                            {cert.name}
                                          </span>

                                          <span
                                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${badgeInfo.bg}`}
                                          >
                                            <StatusIcon className="w-3 h-3" />
                                            {badgeInfo.label}
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                                          <div>
                                            <span className="text-slate-400 block">No. Registrasi:</span>
                                            <strong className="text-slate-700 dark:text-slate-300">
                                              {cert.certificateNumber}
                                            </strong>
                                          </div>
                                          <div>
                                            <span className="text-slate-400 block">Lembaga Penerbit:</span>
                                            <strong className="text-slate-700 dark:text-slate-300 truncate block">
                                              {cert.issuer}
                                            </strong>
                                          </div>
                                        </div>

                                        {/* LEVEL 4: EXPIRY DETAILS & ACTION BAR */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px]">
                                          <div className="space-y-0.5">
                                            <span className="text-slate-400">
                                              Masa Berlaku s/d:{" "}
                                              <strong className="text-slate-900 dark:text-white font-mono">
                                                {cert.expiryDate}
                                              </strong>
                                            </span>
                                            <div
                                              className={`font-bold ${
                                                cert.expiryCalc.status === "EXPIRED"
                                                  ? "text-rose-500"
                                                  : cert.expiryCalc.status === "EXPIRING_SOON"
                                                  ? "text-amber-500"
                                                  : "text-emerald-500"
                                              }`}
                                            >
                                              {cert.expiryCalc.text}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            {cert.expiryCalc.status !== "VALID" ? (
                                              <button
                                                onClick={() =>
                                                  alert(
                                                    `Membuka formulir perpanjangan sertifikasi/SIO untuk ${emp.name}: ${cert.name}`
                                                  )
                                                }
                                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
                                              >
                                                Perpanjang / Refresher
                                              </button>
                                            ) : (
                                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> Siap Operasi
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: 2D CROSS-TABULAR SKILL MATRIX GRID */}
      {viewMode === "MATRIX_GRID" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2D Cross-Tabular Skill Matrix Heatmap (Employee × Competencies)
              </h3>
              <p className="text-xs text-slate-400">
                Peta visual keahlian karyawan: Nilai level 1 (Beginner) hingga 5 (Expert) dengan status verifikasi.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-500">
              {employees.length} Karyawan × {skills.length} Standar Keahlian
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <tr>
                  <th className="px-4 py-3 sticky left-0 bg-slate-100 dark:bg-slate-950 z-10">Karyawan & Posisi</th>
                  <th className="px-4 py-3">Departemen</th>
                  {skills.map((sk) => (
                    <th key={sk.id} className="px-4 py-3 text-center min-w-[130px]">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{sk.name}</div>
                      <span className="text-[9px] font-mono text-emerald-500">{sk.category}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map((emp) => {
                  const empSkList = employeeSkills.filter((es) => es.employeeId === emp.employeeId);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 sticky left-0 bg-white dark:bg-slate-900 z-10 font-medium">
                        <div className="font-bold text-slate-900 dark:text-white">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{emp.positionName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {emp.departmentName}
                      </td>

                      {skills.map((sk) => {
                        const matched = empSkList.find((es) => es.skillId === sk.skillId);
                        if (!matched) {
                          return (
                            <td key={sk.id} className="px-4 py-3 text-center text-slate-400 font-mono text-[11px]">
                              -
                            </td>
                          );
                        }

                        return (
                          <td key={sk.id} className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getLevelBadge(
                                matched.level
                              )}`}
                            >
                              {matched.level}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: EXPIRY RADAR & COMPLIANCE WATCHLIST */}
      {viewMode === "EXPIRY_RADAR" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  Sertifikasi & Lisensi Perlu Tindakan Segera (Expired & Expiring Soon)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar seluruh berkas perizinan operator, pengawas (POP/POM), dan sertifikat K3 yang kedaluwarsa atau mendekati jatuh tempo.
                </p>
              </div>

              <button
                onClick={() => alert("Mengirimkan notifikasi reminder email & WhatsApp kepada seluruh supervisor...")}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer"
              >
                Kirim Bulk Reminder Refresher
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications
                .map((c) => ({ ...c, expiryCalc: calculateDaysRemaining(c.expiryDate) }))
                .filter((c) => c.expiryCalc.status !== "VALID")
                .map((cert) => {
                  const badgeInfo = getExpiryBadge(cert.expiryCalc.status);
                  const Icon = badgeInfo.icon;

                  return (
                    <div
                      key={cert.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        cert.expiryCalc.status === "EXPIRED"
                          ? "bg-rose-950/20 border-rose-800/40"
                          : "bg-amber-950/20 border-amber-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-400">
                          {cert.employeeId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${badgeInfo.bg}`}>
                          <Icon className="w-3 h-3" /> {badgeInfo.label}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-sm">
                          {cert.employeeName}
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {cert.name}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-[11px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">No. Sertifikat:</span>
                          <strong className="text-slate-700 dark:text-slate-300">{cert.certificateNumber}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Jatuh Tempo:</span>
                          <strong className="text-rose-400">{cert.expiryDate}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <strong className="text-amber-400">{cert.expiryCalc.text}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Mendaftarkan ${cert.employeeName} ke sesi pelatihan/perpanjangan untuk ${cert.name}`)}
                        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                      >
                        Jadwalkan Perpanjangan K3
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SKILL MAPPING OR CERTIFICATION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {modalType === "SKILL" ? "Petakan Keahlian Karyawan (Skill)" : "Tambah Sertifikat / SIO Baru"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalType === "SKILL"
                      ? "Verifikasi dan catat kompetensi keahlian teknis karyawan."
                      : "Registrasi dokumen lisensi K3, SIO Alat Berat, atau Sertifikat BNSP."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              {/* Employee Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Pilih Karyawan</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId} - {emp.positionName})
                    </option>
                  ))}
                </select>
              </div>

              {modalType === "SKILL" ? (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Pilih Standar Keahlian (Skill)</label>
                    <select
                      value={newSkillId}
                      onChange={(e) => setNewSkillId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                    >
                      {skills.map((sk) => (
                        <option key={sk.id} value={sk.skillId}>
                          {sk.name} ({sk.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Level Kompetensi Terverifikasi</label>
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="BEGINNER">BEGINNER (Tingkat Pemula)</option>
                      <option value="BASIC">BASIC (Tingkat Dasar)</option>
                      <option value="INTERMEDIATE">INTERMEDIATE (Tingkat Menengah)</option>
                      <option value="ADVANCED">ADVANCED (Tingkat Lanjut)</option>
                      <option value="EXPERT">EXPERT (Tingkat Ahli / Trainer)</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nama Sertifikasi / SIO</label>
                    <input
                      type="text"
                      placeholder="e.g. SIO Dozer D375, POP ESDM, K3 Umum"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Nomor Sertifikat</label>
                      <input
                        type="text"
                        placeholder="e.g. SIO-KMNK-9921-2026"
                        value={newCertNumber}
                        onChange={(e) => setNewCertNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Lembaga Penerbit</label>
                      <input
                        type="text"
                        placeholder="e.g. Ditjen Minerba ESDM"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Tanggal Kedaluwarsa (Expiry Date)</label>
                    <input
                      type="date"
                      value={newCertExpiry}
                      onChange={(e) => setNewCertExpiry(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
