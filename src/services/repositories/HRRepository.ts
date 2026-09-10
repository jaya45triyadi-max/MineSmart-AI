import {
  Employee,
  EmployeeDocument,
  Department,
  Position,
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
  HRKPISummary,
  HRAIInsight,
} from "../../types/hrTypes";

export class HRRepository {
  private kpiSummary: HRKPISummary = {
    totalEmployees: 420,
    activeEmployees: 395,
    inactiveEmployees: 25,
    employeesOnSite: 340,
    employeesOffSite: 55,
    employeesOnLeave: 12,
    employeesOnTraining: 13,
    expiredCertificationsCount: 4,
    expiringSoonCertificationsCount: 18,
    trainingDueCount: 8,
    openManpowerRequestsCount: 5,
    overtimeHoursTotal: 1240,
    attendanceRatePercent: 98.2,
    absenceRatePercent: 1.8,
    manpowerUtilizationPercent: 94.5,
  };

  private departments: Department[] = [
    {
      id: "dept-1",
      departmentId: "DEPT-MIN",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Mining & Operation",
      code: "MIN",
      description: "Divisi Penambangan Coal & Overburden",
      managerName: "Ir. Hendra Gunawan",
      employeeCount: 185,
      status: "ACTIVE",
    },
    {
      id: "dept-2",
      departmentId: "DEPT-ENG",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Mine Engineering & Survey",
      code: "ENG",
      description: "Perencanaan Tambang, Geologi & Survey DTM",
      managerName: "Bambang Suherman, ST",
      employeeCount: 45,
      status: "ACTIVE",
    },
    {
      id: "dept-3",
      departmentId: "DEPT-PLT",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Plant & Heavy Equipment Maintenance",
      code: "PLT",
      description: "Perawatan & Perbaikan Fleet Alat Berat",
      managerName: "Dedy Kurniawan, ST",
      employeeCount: 95,
      status: "ACTIVE",
    },
    {
      id: "dept-4",
      departmentId: "DEPT-HSE",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "HSE & Environmental",
      code: "HSE",
      description: "Keselamatan Kerja, K3, dan Pengelolaan Lingkungan Tambang",
      managerName: "Siti Rahmawati, S.Si",
      employeeCount: 35,
      status: "ACTIVE",
    },
    {
      id: "dept-5",
      departmentId: "DEPT-HR",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Human Resources & General Affairs",
      code: "HRGA",
      description: "Pengelolaan Manpower, General Affairs & Industrial Relation",
      managerName: "Rudi Hartono, SH",
      employeeCount: 20,
      status: "ACTIVE",
    },
    {
      id: "dept-6",
      departmentId: "DEPT-FIN",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Finance & Logistics",
      code: "FIN",
      description: "Keuangan, Warehouse, dan Pengadaan Fuel",
      managerName: "Agus Pratama, SE",
      employeeCount: 40,
      status: "ACTIVE",
    },
  ];

  private positions: Position[] = [
    {
      id: "pos-1",
      positionId: "POS-SITE-MGR",
      companyId: "COMP-01",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      name: "Site Manager / Kepala Teknik Tambang (KTT)",
      code: "KTT",
      level: "EXECUTIVE",
      description: "Penanggung jawab operasional KTT sesuai regulasi ESDM",
      requiredSkills: ["Leadership", "Safety Management", "Mining Law"],
      requiredCertifications: ["POM (Pengawas Operasional Utama)", "K3 Utama"],
      requiredTraining: ["Mandatory ESDM KTT Refresher"],
      minExperienceYears: 12,
      status: "ACTIVE",
      headcountTarget: 1,
      headcountCurrent: 1,
      isCritical: true,
    },
    {
      id: "pos-2",
      positionId: "POS-PROD-SPV",
      companyId: "COMP-01",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      name: "Production Supervisor",
      code: "SPV-PROD",
      level: "SUPERVISOR",
      description: "Supervisi langsung pengalian pit dan hauling shift",
      requiredSkills: ["Pit Supervision", "Fleet Optimization", "Risk Assessment"],
      requiredCertifications: ["POP (Pengawas Operasional Pertama)"],
      requiredTraining: ["First Aid", "JSA & Pit Safety"],
      minExperienceYears: 5,
      status: "ACTIVE",
      headcountTarget: 12,
      headcountCurrent: 11,
      isCritical: true,
    },
    {
      id: "pos-3",
      positionId: "POS-EXCA-OPR",
      companyId: "COMP-01",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      name: "Excavator Operator PC1250 / PC2000",
      code: "OPR-EXCA",
      level: "OPERATOR",
      description: "Operator Alat Berat Excavator Loading Digging Class >100 Ton",
      requiredSkills: ["Heavy Equipment Digging", "Bench Loading Safety"],
      requiredCertifications: ["SIO Excavator Class 1 (Kemenaker)"],
      requiredTraining: ["Defensive Driving", "Fatigue Management"],
      minExperienceYears: 3,
      status: "ACTIVE",
      headcountTarget: 45,
      headcountCurrent: 42,
      isCritical: true,
    },
    {
      id: "pos-4",
      positionId: "POS-MCH-HEAVY",
      companyId: "COMP-01",
      departmentId: "DEPT-PLT",
      departmentName: "Plant & Heavy Equipment Maintenance",
      name: "Heavy Equipment Mechanic Class 1",
      code: "MCH-HEAVY",
      level: "ENGINEER",
      description: "Teknisi Perbaikan Engine & Hydraulics Fleet Tambang",
      requiredSkills: ["Engine Overhaul", "Hydraulic Troubleshooting", "CAN-bus Diagnostics"],
      requiredCertifications: ["Komatsu/CAT Certified Mechanic", "POP"],
      requiredTraining: ["Lockout Tagout (LOTO)", "Electrical Safety"],
      minExperienceYears: 4,
      status: "ACTIVE",
      headcountTarget: 28,
      headcountCurrent: 26,
      isCritical: true,
    },
  ];

  private employees: Employee[] = [
    {
      id: "emp-1",
      employeeId: "EMP-001",
      employeeNumber: "2021001",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionId: "POS-SITE-MGR",
      positionName: "Site Manager / KTT",
      name: "Ir. Hendra Gunawan, IPM",
      gender: "MALE",
      birthDate: "1978-05-12",
      joinDate: "2021-03-01",
      employmentType: "PERMANENT",
      employmentStatus: "ACTIVE",
      phone: "+62 812-3456-7890",
      email: "hendra.gunawan@minesmart.co.id",
      emergencyContact: {
        name: "Dewi Lestari",
        relation: "Istri",
        phone: "+62 812-9876-5432",
      },
      address: "Jl. A. Yani Km 36 No. 42, Banjarbaru, Kalsel",
      createdAt: "2021-03-01T08:00:00Z",
      updatedAt: "2026-08-01T10:00:00Z",
    },
    {
      id: "emp-2",
      employeeId: "EMP-014",
      employeeNumber: "2022014",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionId: "POS-PROD-SPV",
      positionName: "Production Supervisor",
      name: "Budi Santoso",
      gender: "MALE",
      birthDate: "1986-09-20",
      joinDate: "2022-01-15",
      employmentType: "PERMANENT",
      employmentStatus: "ACTIVE",
      phone: "+62 813-1122-3344",
      email: "budi.santoso@minesmart.co.id",
      emergencyContact: {
        name: "Siti Zubaidah",
        relation: "Istri",
        phone: "+62 813-9988-7766",
      },
      address: "Mess Perumahan Staff Site Tapin Block B-04",
      supervisorId: "EMP-001",
      supervisorName: "Ir. Hendra Gunawan",
      createdAt: "2022-01-15T08:00:00Z",
      updatedAt: "2026-08-10T09:00:00Z",
    },
    {
      id: "emp-3",
      employeeId: "EMP-088",
      employeeNumber: "2023088",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionId: "POS-EXCA-OPR",
      positionName: "Excavator Operator PC1250",
      name: "Agus Setiawan",
      gender: "MALE",
      birthDate: "1992-03-14",
      joinDate: "2023-05-10",
      employmentType: "CONTRACT",
      employmentStatus: "ACTIVE",
      phone: "+62 852-4455-6677",
      email: "agus.setiawan@minesmart.co.id",
      emergencyContact: {
        name: "Rina Mariani",
        relation: "Istri",
        phone: "+62 852-3322-1100",
      },
      address: "Desa Rantau Kanan RT 02 Tapin, Kalsel",
      supervisorId: "EMP-014",
      supervisorName: "Budi Santoso",
      contractStartDate: "2025-05-10",
      contractEndDate: "2027-05-09",
      createdAt: "2023-05-10T08:00:00Z",
      updatedAt: "2026-08-12T11:00:00Z",
    },
    {
      id: "emp-4",
      employeeId: "EMP-105",
      employeeNumber: "2024105",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-PLT",
      departmentName: "Plant & Heavy Equipment Maintenance",
      positionId: "POS-MCH-HEAVY",
      positionName: "Heavy Equipment Mechanic Class 1",
      name: "Rahmat Hidayat",
      gender: "MALE",
      birthDate: "1990-11-05",
      joinDate: "2024-02-01",
      employmentType: "PERMANENT",
      employmentStatus: "ACTIVE",
      phone: "+62 811-5566-7788",
      email: "rahmat.hidayat@minesmart.co.id",
      emergencyContact: {
        name: "Nurul Huda",
        relation: "Ibu",
        phone: "+62 811-2233-4455",
      },
      address: "Mess Karyawan Plant Site Tapin Block P-12",
      supervisorId: "EMP-001",
      supervisorName: "Ir. Hendra Gunawan",
      createdAt: "2024-02-01T08:00:00Z",
      updatedAt: "2026-08-05T14:00:00Z",
    },
    {
      id: "emp-5",
      employeeId: "EMP-032",
      employeeNumber: "2022032",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-HSE",
      departmentName: "HSE & Environmental",
      positionId: "POS-HSE-SPV",
      positionName: "HSE Superintendent & Inspector",
      name: "Siti Rahmawati, S.Si",
      gender: "FEMALE",
      birthDate: "1988-07-22",
      joinDate: "2022-04-10",
      employmentType: "PERMANENT",
      employmentStatus: "ACTIVE",
      phone: "+62 813-7788-9900",
      email: "siti.rahmawati@minesmart.co.id",
      emergencyContact: {
        name: "Faisal Reza",
        relation: "Suami",
        phone: "+62 813-6655-4433",
      },
      address: "Kompleks Permata Indah No. 18 Rantau, Tapin",
      supervisorId: "EMP-001",
      supervisorName: "Ir. Hendra Gunawan",
      createdAt: "2022-04-10T08:00:00Z",
      updatedAt: "2026-08-11T16:00:00Z",
    },
    {
      id: "emp-6",
      employeeId: "EMP-045",
      employeeNumber: "2023045",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-ENG",
      departmentName: "Mine Engineering & Survey",
      positionId: "POS-SRV-LEAD",
      positionName: "Mine Survey & DTM Lead",
      name: "Bambang Suherman, ST",
      gender: "MALE",
      birthDate: "1989-12-03",
      joinDate: "2023-01-20",
      employmentType: "PERMANENT",
      employmentStatus: "ACTIVE",
      phone: "+62 812-4433-2211",
      email: "bambang.suherman@minesmart.co.id",
      emergencyContact: {
        name: "Nur Aini",
        relation: "Istri",
        phone: "+62 812-1100-9988",
      },
      address: "Mess Engineering Site Tapin Block E-01",
      supervisorId: "EMP-001",
      supervisorName: "Ir. Hendra Gunawan",
      createdAt: "2023-01-20T08:00:00Z",
      updatedAt: "2026-08-08T13:00:00Z",
    },
    {
      id: "emp-7",
      employeeId: "EMP-120",
      employeeNumber: "2024120",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionId: "POS-TRK-OPR",
      positionName: "HD Dump Truck Driver 785 Class",
      name: "Dimas Saputra",
      gender: "MALE",
      birthDate: "1994-06-18",
      joinDate: "2024-03-15",
      employmentType: "CONTRACT",
      employmentStatus: "ACTIVE",
      phone: "+62 853-9988-1122",
      email: "dimas.saputra@minesmart.co.id",
      emergencyContact: {
        name: "Wahyudi",
        relation: "Ayah",
        phone: "+62 853-4455-6677",
      },
      address: "Desa Binuang RT 05 Tapin, Kalsel",
      supervisorId: "EMP-014",
      supervisorName: "Budi Santoso",
      contractStartDate: "2024-03-15",
      contractEndDate: "2026-03-14",
      createdAt: "2024-03-15T08:00:00Z",
      updatedAt: "2026-08-14T08:00:00Z",
    },
  ];

  private skills: Skill[] = [
    {
      id: "sk-1",
      skillId: "SK-PIT-SUP",
      name: "Pit Mine Supervision & Scheduling",
      category: "Mining",
      description: "Kemampuan memimpin pit, mengarahkan fleet dump truck & excavator",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-2",
      skillId: "SK-EXCA-OPS",
      name: "Excavator PC1250 Digging & Bench Safety",
      category: "Operational",
      description: "Pengoperasian excavator heavy class pada lereng curam & loading rate tinggi",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-3",
      skillId: "SK-DIAG-HYD",
      name: "Hydraulic Diagnostics & Pressure Tuning",
      category: "Maintenance",
      description: "Troubleshooting sistem hidrolik, pump, valve pressure dan proportional valves",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-4",
      skillId: "SK-HSE-JSA",
      name: "Job Safety Analysis (JSA) & Hazard Identification",
      category: "Safety",
      description: "Penyusunan dan inspeksi mitigasi bahaya kerja K3 Tambang sesuai Kepmen 1827 K",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-5",
      skillId: "SK-SRV-DTM",
      name: "Drone UAV Photogrammetry & DTM Survey",
      category: "Survey",
      description: "Pemetaan topografi tambang, batas pit limit, dan kalkulasi volume stockpile LiDAR",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-6",
      skillId: "SK-HD-HAUL",
      name: "Off-Highway Dump Truck HD785 Operation",
      category: "Operational",
      description: "Pengoperasian truk angkut tambang kapasitas 100 Ton pada jalan tambang basah & turunan curam",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-7",
      skillId: "SK-ENV-COMP",
      name: "Environmental Compliance & Acid Mine Drainage Control",
      category: "Environment",
      description: "Pengelolaan air asam tambang (AAT), sediment pond TSS, dan reklamasi pascatambang",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
    {
      id: "sk-8",
      skillId: "SK-LOTO-ENG",
      name: "Lockout Tagout (LOTO) & Electrical Isolation",
      category: "Safety",
      description: "Prosedur pemutusan dan penguncian sumber energi berbahaya saat overhaul alat berat",
      levelDefinition: "Level 1-5 (Beginner to Expert)",
      status: "ACTIVE",
    },
  ];

  private employeeSkills: EmployeeSkill[] = [
    {
      id: "es-1",
      employeeSkillId: "ES-001",
      employeeId: "EMP-001",
      employeeName: "Ir. Hendra Gunawan, IPM",
      skillId: "SK-PIT-SUP",
      skillName: "Pit Mine Supervision & Scheduling",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Direktur Operasional",
      verificationDate: "2025-01-15",
    },
    {
      id: "es-2",
      employeeSkillId: "ES-002",
      employeeId: "EMP-001",
      employeeName: "Ir. Hendra Gunawan, IPM",
      skillId: "SK-HSE-JSA",
      skillName: "Job Safety Analysis (JSA) & Hazard Identification",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Kepala Inspektur Tambang (KAIT)",
      verificationDate: "2025-01-20",
    },
    {
      id: "es-3",
      employeeSkillId: "ES-003",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      skillId: "SK-PIT-SUP",
      skillName: "Pit Mine Supervision & Scheduling",
      level: "ADVANCED",
      verified: true,
      verifiedBy: "Ir. Hendra Gunawan",
      verificationDate: "2026-01-10",
    },
    {
      id: "es-4",
      employeeSkillId: "ES-004",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      skillId: "SK-HSE-JSA",
      skillName: "Job Safety Analysis (JSA) & Hazard Identification",
      level: "ADVANCED",
      verified: true,
      verifiedBy: "Siti Rahmawati, S.Si",
      verificationDate: "2026-02-15",
    },
    {
      id: "es-5",
      employeeSkillId: "ES-005",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      skillId: "SK-EXCA-OPS",
      skillName: "Excavator PC1250 Digging & Bench Safety",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Budi Santoso",
      verificationDate: "2026-03-15",
    },
    {
      id: "es-6",
      employeeSkillId: "ES-006",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      skillId: "SK-HSE-JSA",
      skillName: "Job Safety Analysis (JSA) & Hazard Identification",
      level: "INTERMEDIATE",
      verified: true,
      verifiedBy: "Budi Santoso",
      verificationDate: "2026-03-18",
    },
    {
      id: "es-7",
      employeeSkillId: "ES-007",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      skillId: "SK-DIAG-HYD",
      skillName: "Hydraulic Diagnostics & Pressure Tuning",
      level: "ADVANCED",
      verified: true,
      verifiedBy: "Dedy Kurniawan, ST",
      verificationDate: "2026-02-20",
    },
    {
      id: "es-8",
      employeeSkillId: "ES-008",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      skillId: "SK-LOTO-ENG",
      skillName: "Lockout Tagout (LOTO) & Electrical Isolation",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Siti Rahmawati, S.Si",
      verificationDate: "2026-04-12",
    },
    {
      id: "es-9",
      employeeSkillId: "ES-009",
      employeeId: "EMP-032",
      employeeName: "Siti Rahmawati, S.Si",
      skillId: "SK-ENV-COMP",
      skillName: "Environmental Compliance & Acid Mine Drainage Control",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Ir. Hendra Gunawan",
      verificationDate: "2025-11-10",
    },
    {
      id: "es-10",
      employeeSkillId: "ES-010",
      employeeId: "EMP-032",
      employeeName: "Siti Rahmawati, S.Si",
      skillId: "SK-HSE-JSA",
      skillName: "Job Safety Analysis (JSA) & Hazard Identification",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Ir. Hendra Gunawan",
      verificationDate: "2025-11-15",
    },
    {
      id: "es-11",
      employeeSkillId: "ES-011",
      employeeId: "EMP-045",
      employeeName: "Bambang Suherman, ST",
      skillId: "SK-SRV-DTM",
      skillName: "Drone UAV Photogrammetry & DTM Survey",
      level: "EXPERT",
      verified: true,
      verifiedBy: "Ir. Hendra Gunawan",
      verificationDate: "2026-01-25",
    },
    {
      id: "es-12",
      employeeSkillId: "ES-012",
      employeeId: "EMP-120",
      employeeName: "Dimas Saputra",
      skillId: "SK-HD-HAUL",
      skillName: "Off-Highway Dump Truck HD785 Operation",
      level: "ADVANCED",
      verified: true,
      verifiedBy: "Budi Santoso",
      verificationDate: "2026-03-30",
    },
  ];

  private certifications: Certification[] = [
    {
      id: "cert-1",
      certificationId: "CERT-POU-KTT-01",
      employeeId: "EMP-001",
      employeeName: "Ir. Hendra Gunawan, IPM",
      departmentName: "Mining & Operation",
      name: "POU (Pengawas Operasional Utama ESDM)",
      certificateNumber: "POU-ESDM-00192-2021",
      issuer: "LSP Minerba / Ditjen Minerba ESDM",
      issueDate: "2021-04-15",
      expiryDate: "2026-04-14",
      status: "EXPIRED",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-2",
      certificationId: "CERT-K3-UTAMA-01",
      employeeId: "EMP-001",
      employeeName: "Ir. Hendra Gunawan, IPM",
      departmentName: "Mining & Operation",
      name: "Sertifikasi Ahli K3 Pertambangan Utama",
      certificateNumber: "K3U-BNSP-7712-2024",
      issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
      issueDate: "2024-05-10",
      expiryDate: "2027-05-09",
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-3",
      certificationId: "CERT-POP-2024-08",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      departmentName: "Mining & Operation",
      name: "POP (Pengawas Operasional Pertama ESDM)",
      certificateNumber: "POP-ESDM-88421-2024",
      issuer: "LSP ESDM / KESDM Ditjen Minerba",
      issueDate: "2024-03-10",
      expiryDate: "2027-03-09",
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-4",
      certificationId: "CERT-FA-MEDIC-01",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      departmentName: "Mining & Operation",
      name: "First Aid & Emergency Mine Rescue (P3K Tambang)",
      certificateNumber: "FA-KMNK-4421-2023",
      issuer: "Kementerian Ketenagakerjaan RI",
      issueDate: "2023-10-05",
      expiryDate: "2026-10-04",
      status: "EXPIRING_SOON",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-5",
      certificationId: "CERT-SIO-EXCA-01",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      name: "SIO Excavator Class I (Surat Ijin Operator Kemenaker)",
      certificateNumber: "SIO-KMNK-12093-2023",
      issuer: "Kementerian Ketenagakerjaan RI",
      issueDate: "2023-09-01",
      expiryDate: "2026-08-31",
      status: "EXPIRING_SOON",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: true,
    },
    {
      id: "cert-6",
      certificationId: "CERT-SIMPER-EXCA-01",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      name: "SIMPER Tambang (Full Pit Access PC1250/2000)",
      certificateNumber: "SIMPER-TPN-8812-2025",
      issuer: "KTT Site Tapin HSE Division",
      issueDate: "2025-06-01",
      expiryDate: "2026-06-01",
      status: "EXPIRED",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: true,
    },
    {
      id: "cert-7",
      certificationId: "CERT-KOM-MCH-01",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      departmentName: "Plant & Heavy Equipment Maintenance",
      name: "Komatsu Master Heavy Equipment Mechanic Level 3",
      certificateNumber: "KMT-UT-9941-2024",
      issuer: "United Tractors Training Center",
      issueDate: "2024-02-15",
      expiryDate: "2027-02-14",
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: false,
      isCriticalForEquipment: true,
    },
    {
      id: "cert-8",
      certificationId: "CERT-LOTO-AUTH-01",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      departmentName: "Plant & Heavy Equipment Maintenance",
      name: "LOTO Authorized Person & High Voltage Isolation",
      certificateNumber: "LOTO-PLT-2024-105",
      issuer: "Internal HSE & Electrical Authority",
      issueDate: "2024-07-20",
      expiryDate: "2026-07-19",
      status: "EXPIRED",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-9",
      certificationId: "CERT-AK3U-HSE-01",
      employeeId: "EMP-032",
      employeeName: "Siti Rahmawati, S.Si",
      departmentName: "HSE & Environmental",
      name: "Ahli K3 Umum Kemenaker & SKP K3 Minerba",
      certificateNumber: "AK3U-KMNK-33910-2024",
      issuer: "Kementerian Ketenagakerjaan RI",
      issueDate: "2024-04-18",
      expiryDate: "2027-04-17",
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-10",
      certificationId: "CERT-ENV-AMD-01",
      employeeId: "EMP-032",
      employeeName: "Siti Rahmawati, S.Si",
      departmentName: "HSE & Environmental",
      name: "Sertifikasi Penanggung Jawab Pengendalian Pencemaran Air (PPPA)",
      certificateNumber: "BNSP-PPPA-5510-2023",
      issuer: "LSP Lingkungan Hidup / BNSP",
      issueDate: "2023-11-20",
      expiryDate: "2026-11-19",
      status: "EXPIRING_SOON",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: false,
    },
    {
      id: "cert-11",
      certificationId: "CERT-UAV-BNSP-01",
      employeeId: "EMP-045",
      employeeName: "Bambang Suherman, ST",
      departmentName: "Mine Engineering & Survey",
      name: "Remote Pilot UAV Drone Pemetaan Tambang BNSP",
      certificateNumber: "BNSP-UAV-7712-2023",
      issuer: "LSP Geospasial / DKUPPU Kemenhub",
      issueDate: "2023-08-25",
      expiryDate: "2026-08-24",
      status: "EXPIRING_SOON",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: false,
      isCriticalForEquipment: true,
    },
    {
      id: "cert-12",
      certificationId: "CERT-SIO-HD-01",
      employeeId: "EMP-120",
      employeeName: "Dimas Saputra",
      departmentName: "Mining & Operation",
      name: "SIO Dump Truck Off-Highway HD785 (Kelas II)",
      certificateNumber: "SIO-KMNK-99012-2024",
      issuer: "Kementerian Ketenagakerjaan RI",
      issueDate: "2024-03-20",
      expiryDate: "2027-03-19",
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE: true,
      isCriticalForEquipment: true,
    },
  ];

  private trainingPrograms: TrainingProgram[] = [
    {
      id: "tp-1",
      trainingId: "TRN-POP-PREP",
      name: "Sertifikasi & Pembekalan POP (Pengawas Operasional Pertama)",
      category: "Safety K3",
      description: "Persiapan ujian lisensi POP KESDM untuk Supervisor Tambang",
      provider: "Pusdiklat PPSDM Geominerba",
      requiredForPositions: ["Production Supervisor", "Mining Engineer"],
      durationHours: 40,
      validityMonths: 36,
      status: "ACTIVE",
    },
    {
      id: "tp-2",
      trainingId: "TRN-FATIGUE-01",
      name: "Fatigue Risk Management & Defensive Driving Heavy Fleet",
      category: "Equipment Operation",
      description: "Pengelolaan kelelahan operator shift malam dan teknik mengemudi aman",
      provider: "Internal Safety Academy MINE SMART AI",
      requiredForPositions: ["Excavator Operator", "Haul Truck Driver"],
      durationHours: 16,
      validityMonths: 12,
      status: "ACTIVE",
    },
    {
      id: "tp-3",
      trainingId: "TRN-LOTO-PLT",
      name: "Lockout Tagout (LOTO) & Electrical Isolation Procedure",
      category: "Maintenance",
      description: "Isolasi energi berbahaya saat perbaikan mesin di Workshop",
      provider: "Internal HSE & Plant Dept",
      requiredForPositions: ["Heavy Equipment Mechanic", "Electrician"],
      durationHours: 8,
      validityMonths: 24,
      status: "ACTIVE",
    },
  ];

  private trainingSessions: TrainingSession[] = [
    {
      id: "ts-1",
      sessionId: "SESS-2026-0815",
      trainingId: "TRN-FATIGUE-01",
      trainingName: "Fatigue Risk Management & Defensive Driving Heavy Fleet",
      siteId: "SITE-TAPIN",
      startDate: "2026-08-18",
      endDate: "2026-08-19",
      location: "Training Center Hall Room A",
      instructor: "Siti Rahmawati (HSE Manager)",
      capacity: 25,
      participantsCount: 22,
      status: "OPEN",
    },
    {
      id: "ts-2",
      sessionId: "SESS-2026-0720",
      trainingId: "TRN-LOTO-PLT",
      trainingName: "Lockout Tagout (LOTO) & Electrical Isolation Procedure",
      siteId: "SITE-TAPIN",
      startDate: "2026-07-20",
      endDate: "2026-07-20",
      location: "Workshop Safety Room",
      instructor: "Dedy Kurniawan, ST",
      capacity: 15,
      participantsCount: 15,
      status: "COMPLETED",
    },
  ];

  private trainingRecords: EmployeeTrainingRecord[] = [
    {
      id: "tr-1",
      recordId: "TR-2026-001",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      sessionId: "SESS-2026-0720",
      trainingName: "Lockout Tagout (LOTO) & Electrical Isolation Procedure",
      completionDate: "2026-07-20",
      result: "PASSED",
      score: 92,
      attendancePercent: 100,
      certificateNumber: "CERT-LOTO-2026-105",
      expiryDate: "2028-07-20",
      status: "PASSED",
    },
  ];

  private rosterEntries: RosterEntry[] = [
    {
      id: "rst-1",
      rosterId: "RST-20260814-01",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      date: "2026-08-14",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Production Supervisor",
      workLocation: "Pit Alpha Block 3",
      supervisorName: "Ir. Hendra Gunawan",
      status: "PUBLISHED",
    },
    {
      id: "rst-2",
      rosterId: "RST-20260814-02",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      date: "2026-08-14",
      shift: "DAY",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionName: "Excavator Operator PC1250",
      workLocation: "EX-08 Loading Point A",
      supervisorName: "Budi Santoso",
      status: "PUBLISHED",
    },
    {
      id: "rst-3",
      rosterId: "RST-20260814-03",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      date: "2026-08-14",
      shift: "NIGHT",
      siteId: "SITE-TAPIN",
      departmentId: "DEPT-PLT",
      departmentName: "Plant Maintenance",
      positionName: "Heavy Equipment Mechanic",
      workLocation: "Central Workshop Pit Alpha",
      supervisorName: "Dedy Kurniawan, ST",
      status: "PUBLISHED",
    },
  ];

  private shiftTemplates: ShiftTemplate[] = [
    {
      id: "st-1",
      shiftId: "SHIFT-DAY",
      name: "Shift 1 (Siang)",
      startTime: "07:00",
      endTime: "19:00",
      breakDurationMins: 60,
      isOvernight: false,
      color: "#10b981",
      status: "ACTIVE",
    },
    {
      id: "st-2",
      shiftId: "SHIFT-NIGHT",
      name: "Shift 2 (Malam)",
      startTime: "19:00",
      endTime: "07:00",
      breakDurationMins: 60,
      isOvernight: true,
      color: "#06b6d4",
      status: "ACTIVE",
    },
  ];

  private attendanceRecords: AttendanceRecord[] = [
    {
      id: "att-1",
      attendanceId: "ATT-20260814-01",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      departmentName: "Mining & Operation",
      date: "2026-08-14",
      shift: "DAY",
      checkIn: "06:45:12",
      checkOut: "19:10:05",
      status: "PRESENT",
      source: "Biometric",
      latitude: -3.4215,
      longitude: 115.2341,
      locationName: "Main Gate Checkpoint Pit Alpha",
    },
    {
      id: "att-2",
      attendanceId: "ATT-20260814-02",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      date: "2026-08-14",
      shift: "DAY",
      checkIn: "06:52:40",
      checkOut: "19:05:00",
      status: "PRESENT",
      source: "Mobile",
      latitude: -3.422,
      longitude: 115.235,
      locationName: "Loading Area EX-08",
    },
    {
      id: "att-3",
      attendanceId: "ATT-20260814-03",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      departmentName: "Plant Maintenance",
      date: "2026-08-14",
      shift: "NIGHT",
      checkIn: "18:48:10",
      status: "PRESENT",
      source: "Biometric",
      latitude: -3.418,
      longitude: 115.239,
      locationName: "Workshop Turnstile Pit Alpha",
    },
  ];

  private leaveRequests: LeaveRequest[] = [
    {
      id: "lv-1",
      leaveRequestId: "LV-2026-0801",
      employeeId: "EMP-014",
      employeeName: "Budi Santoso",
      departmentName: "Mining & Operation",
      positionName: "Production Supervisor",
      leaveType: "Annual Leave",
      startDate: "2026-08-25",
      endDate: "2026-08-28",
      durationDays: 4,
      reason: "Cuti tahunan lapangan (Roster leave period)",
      status: "APPROVED",
      approverName: "Ir. Hendra Gunawan",
      approvedAt: "2026-08-10T14:20:00Z",
    },
    {
      id: "lv-2",
      leaveRequestId: "LV-2026-0805",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      positionName: "Excavator Operator",
      leaveType: "Sick Leave",
      startDate: "2026-08-02",
      endDate: "2026-08-03",
      durationDays: 2,
      reason: "Demam dan radang tenggorokan (Surat Dokter Klinik Site)",
      status: "APPROVED",
      approverName: "Budi Santoso",
      approvedAt: "2026-08-02T09:00:00Z",
    },
  ];

  private overtimeRecords: OvertimeRecord[] = [
    {
      id: "ot-1",
      overtimeId: "OT-20260812-01",
      employeeId: "EMP-105",
      employeeName: "Rahmat Hidayat",
      departmentName: "Plant Maintenance",
      date: "2026-08-12",
      startTime: "19:00",
      endTime: "22:00",
      durationHours: 3.0,
      reason: "Breakdown Darurat Engine EX-08 Komatsu PC1250",
      project: "Unscheduled Maintenance Repair",
      supervisorName: "Dedy Kurniawan, ST",
      status: "APPROVED",
    },
    {
      id: "ot-2",
      overtimeId: "OT-20260813-02",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      departmentName: "Mining & Operation",
      date: "2026-08-13",
      startTime: "19:00",
      endTime: "21:00",
      durationHours: 2.0,
      reason: "Kejar Target Cathing Up Coal Removal Pit Alpha",
      project: "Production Target Extension",
      supervisorName: "Budi Santoso",
      status: "APPROVED",
    },
  ];

  private manpowerPlans: ManpowerPlan[] = [
    {
      id: "mp-1",
      planId: "MP-2026-MIN",
      departmentId: "DEPT-MIN",
      departmentName: "Mining & Operation",
      positionId: "POS-EXCA-OPR",
      positionName: "Excavator Operator PC1250",
      requiredCount: 45,
      currentCount: 42,
      gap: -3,
      forecastNextMonth: 46,
      isCritical: true,
    },
    {
      id: "mp-2",
      planId: "MP-2026-PLT",
      departmentId: "DEPT-PLT",
      departmentName: "Plant Maintenance",
      positionId: "POS-MCH-HEAVY",
      positionName: "Heavy Equipment Mechanic",
      requiredCount: 28,
      currentCount: 26,
      gap: -2,
      forecastNextMonth: 30,
      isCritical: true,
    },
  ];

  private successionReadiness: SuccessionReadiness[] = [
    {
      id: "succ-1",
      positionId: "POS-SITE-MGR",
      positionName: "Site Manager / KTT",
      currentHolderName: "Ir. Hendra Gunawan",
      candidateEmployeeId: "EMP-014",
      candidateName: "Budi Santoso",
      skillMatchPercent: 85,
      certMatchPercent: 70,
      trainingGapCount: 1,
      readiness: "PARTIALLY_READY",
    },
  ];

  private aiInsights: HRAIInsight[] = [
    {
      id: "hr-ai-1",
      title: "Risiko Expiry Sertifikasi SIO Operator Excavator",
      finding: "Sertifikasi SIO Kemenaker milik Agus Setiawan (Operator PC1250) akan habis masa berlaku pada 31 Agustus 2026.",
      evidence: "Data Sertifikat CERT-SIO-EXCA-01 tanggal kedaluwarsa 2026-08-31.",
      trend: "Ada 4 operator heavy equipment lainnya dengan lisensi SIO expired dalam 60 hari mendatang.",
      possibleCauses: [
        "Jadwal perpanjangan sertifikasi ulang dari PJT3/Kemenaker tertunda",
        "Kesibukan jam kerja shift produksi tinggi",
      ],
      risk: "HIGH",
      recommendation: "Daftarkan 5 operator ke program re-sertifikasi SIO Batch III secara konsinyasi di Site Tapin.",
      expectedImpact: "Mencegah stop operasi unit Excavator PC1250 akibat ketidaktaatan regulasi K3.",
      confidence: "High (96%)",
    },
    {
      id: "hr-ai-2",
      title: "Anomali Kenaikan Jam Overtime Dept Maintenance (+28%)",
      finding: "Total jam lembur teknis mekanik mencapai 420 jam bulan ini, melebihi rata-rata batas wajar.",
      evidence: "Data Log Overtime OT-20260812-01 & OT-20260813-02 pada sistem Plant Dept.",
      trend: "Peningkatan jam lembur dipicu tingginya urutan breakdown unit paska hujan berat.",
      possibleCauses: [
        "Defisit manpower mekanik (-2 orang dari target 28 orang)",
        "Frekuensi perbaikan darurat komponen hidrolik terakumulasi",
      ],
      risk: "MEDIUM",
      recommendation: "Buka rekrutmen cepat 2 mekanik senior & lakukan penjadwalan shift preventive maintenance berkala.",
      expectedImpact: "Mengurangi biaya lembur operasional hingga Rp 45 Juta/bulan & mencegah kelelahan pekerja.",
      confidence: "High (91%)",
    },
  ];

  private documents: EmployeeDocument[] = [
    {
      id: "doc-1",
      documentId: "DOC-EMP-001-KTT",
      employeeId: "EMP-001",
      employeeName: "Ir. Hendra Gunawan",
      documentType: "CERTIFICATE",
      documentNumber: "SK-KTT-ESDM-2021-009",
      issueDate: "2021-03-01",
      expiryDate: "2026-12-31",
      issuer: "Direktorat Jenderal Minerba KESDM",
      status: "VALID",
    },
    {
      id: "doc-2",
      documentId: "DOC-EMP-088-SIO",
      employeeId: "EMP-088",
      employeeName: "Agus Setiawan",
      documentType: "SIO_OPERATOR",
      documentNumber: "SIO-KMNK-12093-2023",
      issueDate: "2023-09-01",
      expiryDate: "2026-08-31",
      issuer: "Kementerian Ketenagakerjaan RI",
      status: "EXPIRING_SOON",
    },
  ];

  // Async Accessors
  async getKPISummary(): Promise<HRKPISummary> {
    return { ...this.kpiSummary };
  }

  async getDepartments(): Promise<Department[]> {
    return [...this.departments];
  }

  async getPositions(): Promise<Position[]> {
    return [...this.positions];
  }

  async getEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  async addEmployee(emp: Omit<Employee, "id" | "createdAt" | "updatedAt">): Promise<Employee> {
    const created: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.employees.unshift(created);
    this.kpiSummary.totalEmployees += 1;
    this.kpiSummary.activeEmployees += 1;
    return created;
  }

  async getSkills(): Promise<Skill[]> {
    return [...this.skills];
  }

  async addSkill(skill: Omit<Skill, "id">): Promise<Skill> {
    const created: Skill = {
      ...skill,
      id: `sk-${Date.now()}`,
    };
    this.skills.unshift(created);
    return created;
  }

  async getEmployeeSkills(): Promise<EmployeeSkill[]> {
    return [...this.employeeSkills];
  }

  async addEmployeeSkill(empSkill: Omit<EmployeeSkill, "id">): Promise<EmployeeSkill> {
    const created: EmployeeSkill = {
      ...empSkill,
      id: `es-${Date.now()}`,
    };
    this.employeeSkills.unshift(created);
    return created;
  }

  async getCertifications(): Promise<Certification[]> {
    return [...this.certifications];
  }

  async addCertification(cert: Omit<Certification, "id">): Promise<Certification> {
    const created: Certification = {
      ...cert,
      id: `cert-${Date.now()}`,
    };
    this.certifications.unshift(created);
    return created;
  }

  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    return [...this.trainingPrograms];
  }

  async getTrainingSessions(): Promise<TrainingSession[]> {
    return [...this.trainingSessions];
  }

  async addTrainingSession(sess: Omit<TrainingSession, "id">): Promise<TrainingSession> {
    const created: TrainingSession = {
      ...sess,
      id: `ts-${Date.now()}`,
    };
    this.trainingSessions.unshift(created);
    return created;
  }

  async getTrainingRecords(): Promise<EmployeeTrainingRecord[]> {
    return [...this.trainingRecords];
  }

  async getRosterEntries(): Promise<RosterEntry[]> {
    return [...this.rosterEntries];
  }

  async addRosterEntry(entry: Omit<RosterEntry, "id">): Promise<RosterEntry> {
    const created: RosterEntry = {
      ...entry,
      id: `rst-${Date.now()}`,
    };
    this.rosterEntries.unshift(created);
    return created;
  }

  async getShiftTemplates(): Promise<ShiftTemplate[]> {
    return [...this.shiftTemplates];
  }

  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return [...this.attendanceRecords];
  }

  async addAttendanceRecord(att: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> {
    const created: AttendanceRecord = {
      ...att,
      id: `att-${Date.now()}`,
    };
    this.attendanceRecords.unshift(created);
    return created;
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return [...this.leaveRequests];
  }

  async addLeaveRequest(req: Omit<LeaveRequest, "id">): Promise<LeaveRequest> {
    const created: LeaveRequest = {
      ...req,
      id: `lv-${Date.now()}`,
    };
    this.leaveRequests.unshift(created);
    return created;
  }

  async getOvertimeRecords(): Promise<OvertimeRecord[]> {
    return [...this.overtimeRecords];
  }

  async addOvertimeRecord(ot: Omit<OvertimeRecord, "id">): Promise<OvertimeRecord> {
    const created: OvertimeRecord = {
      ...ot,
      id: `ot-${Date.now()}`,
    };
    this.overtimeRecords.unshift(created);
    return created;
  }

  async getManpowerPlans(): Promise<ManpowerPlan[]> {
    return [...this.manpowerPlans];
  }

  async getSuccessionReadiness(): Promise<SuccessionReadiness[]> {
    return [...this.successionReadiness];
  }

  async getAIInsights(): Promise<HRAIInsight[]> {
    return [...this.aiInsights];
  }

  async getDocuments(): Promise<EmployeeDocument[]> {
    return [...this.documents];
  }
}

export const hrRepository = new HRRepository();
