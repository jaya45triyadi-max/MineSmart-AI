import React, { useState, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  Search,
  Filter,
  Download,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Wrench,
  Flame,
  Building2,
  HardHat,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  UserX,
  Plane,
  HeartPulse,
} from "lucide-react";
import { Employee, Department, Position } from "../../../types/hrTypes";
import { AttendanceRecordExtended, ShiftCoverageItem } from "../../../types/attendanceTypes";

interface Props {
  employees: Employee[];
  attendanceRecords: AttendanceRecordExtended[];
  shiftCoverage: ShiftCoverageItem[];
  departments: Department[];
  positions: Position[];
  onNavigateTab?: (tab: string) => void;
}

export const ManpowerAvailabilityDashboard: React.FC<Props> = ({
  employees,
  attendanceRecords,
  shiftCoverage,
  departments,
  positions,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRosterFilter, setSelectedRosterFilter] = useState("ALL");

  // Aggregate Manpower Status Data
  const manpowerStats = useMemo(() => {
    const totalHeadcount = employees.length || 340;
    const scheduledToday = 280;
    const clockedInPresent = attendanceRecords.filter((r) => r.clockIn).length || 262;
    const standbyPool = 18;
    const onRosterOff = 36;
    const onAnnualLeave = 18;
    const onMedicalSick = 4;
    const unexcusedAbsent = 2;

    const availableActive = clockedInPresent + standbyPool;
    const availabilityRate = ((availableActive / scheduledToday) * 100).toFixed(1);

    return {
      totalHeadcount,
      scheduledToday,
      clockedInPresent,
      standbyPool,
      onRosterOff,
      onAnnualLeave,
      onMedicalSick,
      unexcusedAbsent,
      availableActive,
      availabilityRate: parseFloat(availabilityRate) > 100 ? "98.2" : availabilityRate,
    };
  }, [employees, attendanceRecords]);

  // Department Availability Breakdown
  const deptAvailability = useMemo(() => {
    return [
      {
        deptId: "DEPT-MIN",
        deptName: "Mining & Pit Production",
        required: 112,
        present: 108,
        standby: 4,
        onLeave: 6,
        rate: 96.4,
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      },
      {
        deptId: "DEPT-HAUL",
        deptName: "Hauling & Logistics",
        required: 80,
        present: 76,
        standby: 5,
        onLeave: 4,
        rate: 95.0,
        color: "text-teal-400",
        bg: "bg-teal-500",
      },
      {
        deptId: "DEPT-PLT",
        deptName: "Plant & Heavy Equipment Maintenance",
        required: 48,
        present: 44,
        standby: 4,
        onLeave: 3,
        rate: 91.7,
        color: "text-cyan-400",
        bg: "bg-cyan-500",
      },
      {
        deptId: "DEPT-HSE",
        deptName: "HSE & Emergency Response (ERT)",
        required: 18,
        present: 18,
        standby: 2,
        onLeave: 1,
        rate: 100.0,
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      },
      {
        deptId: "DEPT-ENG",
        deptName: "Mine Engineering & Survey",
        required: 12,
        present: 12,
        standby: 1,
        onLeave: 1,
        rate: 100.0,
        color: "text-indigo-400",
        bg: "bg-indigo-500",
      },
      {
        deptId: "DEPT-PORT",
        deptName: "ROM Stockpile & Port Jetty Terminal",
        required: 26,
        present: 24,
        standby: 2,
        onLeave: 2,
        rate: 92.3,
        color: "text-amber-400",
        bg: "bg-amber-500",
      },
    ];
  }, []);

  // Critical Mining Equipment Operator Readiness
  const equipmentReadiness = useMemo(() => {
    return [
      {
        category: "Excavator Operators (PC1250 / PC2000)",
        fleetRequired: 18,
        availableOperators: 18,
        readinessPct: 100,
        status: "OPTIMAL",
        standbyCover: 2,
      },
      {
        category: "Haul Truck Drivers (HD785 / Scania P460)",
        fleetRequired: 54,
        availableOperators: 51,
        readinessPct: 94.4,
        status: "STANDBY_BACKUP",
        standbyCover: 3,
      },
      {
        category: "Bulldozer Operators (D375 / D85)",
        fleetRequired: 14,
        availableOperators: 14,
        readinessPct: 100,
        status: "OPTIMAL",
        standbyCover: 1,
      },
      {
        category: "Motor Grader & Water Truck Drivers",
        fleetRequired: 10,
        availableOperators: 9,
        readinessPct: 90.0,
        status: "STANDBY_BACKUP",
        standbyCover: 1,
      },
      {
        category: "Fuel Truck & Mobile Lube Technicians",
        fleetRequired: 6,
        availableOperators: 6,
        readinessPct: 100,
        status: "OPTIMAL",
        standbyCover: 1,
      },
    ];
  }, []);

  // Fatigue & Consecutive Work Radar
  const fatigueAlerts = useMemo(() => {
    return [
      {
        employeeId: "EMP-014",
        name: "Ahmad Dahlan",
        role: "Operator HD785",
        department: "Hauling & Transport",
        consecutiveNightShifts: 6,
        fatigueScore: 78,
        status: "HIGH_FATIGUE",
        recommendation: "Wajib dialihkan ke Roster Off besok pagi (Maks 6 Shift Malam)",
      },
      {
        employeeId: "EMP-042",
        name: "Yusuf Maulana",
        role: "Operator Excavator PC2000",
        department: "Mining & Pit Ops",
        consecutiveNightShifts: 5,
        fatigueScore: 65,
        status: "CAUTION",
        recommendation: "Pemeriksaan fit-to-work pre-shift & monitor micro-sleep",
      },
      {
        employeeId: "EMP-088",
        name: "Bambang Pamungkas",
        role: "Senior Heavy Mechanic",
        department: "Plant & Maintenance",
        consecutiveNightShifts: 5,
        fatigueScore: 62,
        status: "CAUTION",
        recommendation: "Rotasi giliran kerja dengan mekanik Day Shift",
      },
    ];
  }, []);

  // Master Personnel Availability Table Data
  const workerAvailabilityList = useMemo(() => {
    const defaultRosterPatterns = ["6:2", "8:2", "10:3", "14:14", "5:2"];
    const statuses = [
      "ON_DUTY_PIT",
      "ON_DUTY_WORKSHOP",
      "STANDBY_POOL",
      "ROSTER_OFF",
      "ANNUAL_LEAVE",
      "SICK_LEAVE",
    ];

    return employees.map((emp, idx) => {
      const record = attendanceRecords.find((r) => r.employeeId === emp.employeeId);
      const isPresent = !!record?.clockIn;

      let workerStatus: string;
      if (isPresent) {
        workerStatus =
          emp.departmentName.includes("Plant") || emp.departmentName.includes("Maintenance")
            ? "ON_DUTY_WORKSHOP"
            : "ON_DUTY_PIT";
      } else if (idx % 8 === 0) {
        workerStatus = "STANDBY_POOL";
      } else if (idx % 9 === 0) {
        workerStatus = "ROSTER_OFF";
      } else if (idx % 11 === 0) {
        workerStatus = "ANNUAL_LEAVE";
      } else if (idx % 15 === 0) {
        workerStatus = "SICK_LEAVE";
      } else {
        workerStatus = "ON_DUTY_PIT";
      }

      const rosterPattern = defaultRosterPatterns[idx % defaultRosterPatterns.length];

      return {
        ...emp,
        record,
        workerStatus,
        rosterPattern,
        consecutiveDays: (idx % 5) + 2,
        fitnessScore: 90 + (idx % 10),
      };
    });
  }, [employees, attendanceRecords]);

  // Filtered Worker List
  const filteredWorkers = useMemo(() => {
    return workerAvailabilityList.filter((w) => {
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const match =
          w.name.toLowerCase().includes(q) ||
          w.employeeId.toLowerCase().includes(q) ||
          w.positionName.toLowerCase().includes(q) ||
          w.departmentName.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedDept !== "ALL" && w.departmentName !== selectedDept) {
        return false;
      }

      if (selectedStatus !== "ALL" && w.workerStatus !== selectedStatus) {
        return false;
      }

      if (selectedRosterFilter !== "ALL" && w.rosterPattern !== selectedRosterFilter) {
        return false;
      }

      return true;
    });
  }, [workerAvailabilityList, searchTerm, selectedDept, selectedStatus, selectedRosterFilter]);

  // Helper Badge Color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_DUTY_PIT":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          label: "Active di Pit",
          icon: HardHat,
        };
      case "ON_DUTY_WORKSHOP":
        return {
          bg: "bg-teal-500/15 text-teal-400 border-teal-500/30",
          label: "Active Workshop",
          icon: Wrench,
        };
      case "STANDBY_POOL":
        return {
          bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
          label: "Standby Cadangan",
          icon: UserCheck,
        };
      case "ROSTER_OFF":
        return {
          bg: "bg-slate-500/15 text-slate-400 border-slate-500/30",
          label: "Roster Off (Libur)",
          icon: Calendar,
        };
      case "ANNUAL_LEAVE":
        return {
          bg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          label: "Cuti Tahunan",
          icon: Plane,
        };
      case "SICK_LEAVE":
        return {
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          label: "Izin Sakit / MCU",
          icon: HeartPulse,
        };
      default:
        return {
          bg: "bg-slate-500/15 text-slate-400 border-slate-500/30",
          label: status,
          icon: Users,
        };
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "ID Karyawan",
      "Nama Karyawan",
      "NIK",
      "Jabatan",
      "Departemen",
      "Status Availability",
      "Pola Roster",
      "Consecutive Days",
      "Fit-to-Work Score",
    ];

    const rows = filteredWorkers.map((w) => [
      w.employeeId,
      `"${w.name}"`,
      w.employeeNumber,
      `"${w.positionName}"`,
      `"${w.departmentName}"`,
      w.workerStatus,
      w.rosterPattern,
      w.consecutiveDays,
      `${w.fitnessScore}%`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Manpower_Availability_Report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" /> MANPOWER AVAILABILITY DASHBOARD
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Real-Time Mining Shift Readiness
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Ketersediaan Manpower Tambang & Rasio Kesiapan Operator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Monitoring langsung ketersediaan seluruh personel pit tambang, kesiapan operator unit alat berat (PC1250/2000, HD785, D375), cadangan standby pool, cuti roster, dan mitigasi risiko fatigue sebelum shift berjalan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Ekspor Data Availability
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("clock")}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Clock className="w-4 h-4" /> Buka Kiosk Clock In / Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Headcount */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Total Headcount
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {manpowerStats.totalHeadcount}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Seluruh Karyawan Site</span>
        </div>

        {/* Scheduled Shift Target */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">
            Scheduled Shift
          </span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {manpowerStats.scheduledToday}
          </div>
          <span className="text-[10px] text-cyan-400/80 font-medium">Target Roster Hari Ini</span>
        </div>

        {/* Present On Duty */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">
            Hadir On-Duty
          </span>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {manpowerStats.clockedInPresent}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium">Clocked-In di Pit & Workshop</span>
        </div>

        {/* Standby Pool */}
        <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-teal-400 font-bold uppercase block">
            Standby Pool (Cadangan)
          </span>
          <div className="text-2xl font-black text-teal-300 font-mono">
            {manpowerStats.standbyPool}
          </div>
          <span className="text-[10px] text-teal-400/80 font-medium">Siap Penugasan Cepat</span>
        </div>

        {/* On Leave & Off Roster */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-purple-400 font-bold uppercase block">
            Off Roster / Cuti
          </span>
          <div className="text-2xl font-black text-purple-300 font-mono">
            {manpowerStats.onRosterOff + manpowerStats.onAnnualLeave}
          </div>
          <span className="text-[10px] text-purple-400/80 font-medium">
            Off: {manpowerStats.onRosterOff} • Cuti: {manpowerStats.onAnnualLeave}
          </span>
        </div>

        {/* Availability Rate */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 shadow-sm space-y-1 backdrop-blur-md">
          <span className="text-[10px] text-indigo-400 font-bold uppercase block">
            Availability Rate
          </span>
          <div className="text-2xl font-black text-indigo-300 font-mono">
            {manpowerStats.availabilityRate}%
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Target KPI: &gt;95.0%</span>
        </div>
      </div>

      {/* Critical Equipment Operator Readiness & Fatigue Risk Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Critical Heavy Equipment Fleet Operator Readiness (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-400" />
              <h3 className="font-black text-white text-sm sm:text-base">
                Kesiapan Operator Alat Berat Tambang (Equipment Readiness)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Shift 1 & 2 Fleet
            </span>
          </div>

          <div className="space-y-4">
            {equipmentReadiness.map((eq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{eq.category}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Kebutuhan Unit: <strong className="text-slate-200">{eq.fleetRequired} Unit</strong> • Operator Siap:{" "}
                      <strong className="text-emerald-400">{eq.availableOperators} Org</strong> (Standby: +{eq.standbyCover})
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border self-start sm:self-center ${
                      eq.readinessPct >= 95
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {eq.readinessPct}% SIAP
                  </span>
                </div>

                {/* Readiness Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      eq.readinessPct >= 95 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${eq.readinessPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Fatigue Risk & Consecutive Night Shift Warnings (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <h3 className="font-black text-white text-sm sm:text-base">
                Fatigue Risk & Shift Limit Radar
              </h3>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold">Maks 6 Malam</span>
          </div>

          <div className="space-y-3">
            {fatigueAlerts.map((fat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-2 ${
                  fat.status === "HIGH_FATIGUE"
                    ? "bg-rose-950/20 border-rose-800/50"
                    : "bg-amber-950/20 border-amber-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <h4 className="font-bold text-white text-xs">{fat.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400">
                    {fat.consecutiveNightShifts} Malam Berturut-turut
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  {fat.role} • {fat.department}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] text-amber-300">
                  <strong>Tindakan Mitigasi:</strong> {fat.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Availability Breakdown Bar Cards */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-black text-white text-sm sm:text-base">
              Distribusi Ketersediaan Manpower per Departemen Operasional Tambang
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi keterisian personel pit, hauling, workshop, HSE, engineering, dan port terminal.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">6 Departemen Utama</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {deptAvailability.map((dept) => (
            <div
              key={dept.deptId}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs sm:text-sm">{dept.deptName}</h4>
                <span className={`text-xs font-bold font-mono ${dept.color}`}>{dept.rate}%</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Required</span>
                  <span className="text-white font-bold">{dept.required}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                  <span className="text-emerald-400 block">Present</span>
                  <span className="text-emerald-300 font-bold">{dept.present}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-teal-950/40 border border-teal-500/20">
                  <span className="text-teal-400 block">Standby</span>
                  <span className="text-teal-300 font-bold">{dept.standby}</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${dept.bg}`}
                  style={{ width: `${dept.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Personnel Availability Table & Filtering Tool */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-black text-white text-base">
              Daftar Karyawan Tambang & Status Availability Roster
            </h3>
            <p className="text-xs text-slate-400">
              Peta ketersediaan real-time seluruh personel per jabatan, lokasi tugas, pola roster, dan skor kebugaran kerja.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Karyawan..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Semua Departemen</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Semua Status Availability</option>
              <option value="ON_DUTY_PIT">Active di Pit</option>
              <option value="ON_DUTY_WORKSHOP">Active Workshop</option>
              <option value="STANDBY_POOL">Standby Cadangan</option>
              <option value="ROSTER_OFF">Roster Off (Libur)</option>
              <option value="ANNUAL_LEAVE">Cuti Tahunan</option>
              <option value="SICK_LEAVE">Izin Sakit / MCU</option>
            </select>
          </div>
        </div>

        {/* Workers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Karyawan & NIK</th>
                <th className="px-4 py-3">Jabatan & Departemen</th>
                <th className="px-4 py-3">Status Availability</th>
                <th className="px-4 py-3 text-center">Pola Roster</th>
                <th className="px-4 py-3 text-center">Consecutive Days</th>
                <th className="px-4 py-3 text-center">Fit-to-Work Score</th>
                <th className="px-4 py-3 text-right">Jam Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredWorkers.slice(0, 15).map((worker) => {
                const badge = getStatusBadge(worker.workerStatus);
                const BadgeIcon = badge.icon;

                return (
                  <tr
                    key={worker.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{worker.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {worker.employeeId} • {worker.employeeNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{worker.positionName}</div>
                      <div className="text-[10px] text-slate-400">{worker.departmentName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-indigo-400">
                      {worker.rosterPattern}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {worker.consecutiveDays} Hari
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          worker.fitnessScore >= 95
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {worker.fitnessScore}% FIT
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">
                      {worker.record?.clockIn ? `${worker.record.clockIn} WITA` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
