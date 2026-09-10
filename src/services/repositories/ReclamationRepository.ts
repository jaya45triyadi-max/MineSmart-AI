import {
  ReclamationKPISummary,
  DisturbedArea,
  ReclamationProject,
  ReclamationAssessment,
  ReclamationActivity,
  PlantSpecies,
  PlantingProgram,
  ReclamationMonitoringPoint,
  ReclamationMonitoringForm,
  ReclamationMaintenance,
  SoilAndTopsoilRecord,
  ReclamationCostRecord,
  ReclamationAIInsight,
  ReclamationDocument,
} from "../../types/reclamationTypes";

export class ReclamationRepository {
  private kpiSummary: ReclamationKPISummary = {
    totalDisturbedAreaHa: 145.8,
    activeMiningAreaHa: 68.4,
    areaReadyForReclamationHa: 22.5,
    areaUnderReclamationHa: 34.2,
    areaReclaimedHa: 20.7,
    areaRevegetatedHa: 18.5,
    areaSuccessfullyEstablishedHa: 12.3,
    plantingProgressPercent: 82.4,
    reclamationProgressPercent: 68.7,
    monitoringDueCount: 4,
    monitoringOverdueCount: 1,
    openReclamationIssuesCount: 2,
    totalReclamationCostIDR: 4250000000,
    costPerHectareIDR: 124269000,
    targetAreaYearHa: 25.0,
    actualAreaYearHa: 18.5,
    survivalRatePercent: 88.6,
  };

  private disturbedAreas: DisturbedArea[] = [
    {
      id: "da-1",
      disturbedAreaId: "DA-PIT-ALPHA-01",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Pit Alpha Block 3 West Slope",
      code: "DA-PIT-A3",
      pitId: "pit-alpha",
      pitName: "Pit Alpha",
      blockId: "blk-03",
      blockName: "Block 03",
      latitude: -3.4215,
      longitude: 115.2341,
      elevation: 65,
      areaHa: 12.5,
      disturbanceType: "Mining",
      disturbanceDate: "2023-04-10",
      currentLandUse: "Finished Void Backfill",
      status: "READY_FOR_RECLAMATION",
      source: "Survey Drone DTM 2026-08",
      responsibleDept: "Mine Engineering & Reclamation",
      createdAt: "2023-04-10T08:00:00Z",
      updatedAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "da-2",
      disturbedAreaId: "DA-DISPOSAL-NORTH",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Waste Dump Disposal North Slope A",
      code: "DA-WD-N1",
      pitId: "pit-alpha",
      pitName: "Pit Alpha",
      blockId: "blk-01",
      blockName: "Block 01",
      latitude: -3.418,
      longitude: 115.239,
      elevation: 92,
      areaHa: 18.2,
      disturbanceType: "Disposal",
      disturbanceDate: "2022-09-15",
      currentLandUse: "Shaped Waste Dump Bench",
      status: "UNDER_RECLAMATION",
      source: "Survey Laser DTM",
      responsibleDept: "Reclamation Operations",
      createdAt: "2022-09-15T08:00:00Z",
      updatedAt: "2026-08-12T14:30:00Z",
    },
    {
      id: "da-3",
      disturbedAreaId: "DA-HAULROAD-SECTOR2",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Ex-Haul Road Corridor Sector 2",
      code: "DA-HR-S2",
      pitId: "pit-beta",
      pitName: "Pit Beta",
      blockId: "blk-05",
      blockName: "Block 05",
      latitude: -3.428,
      longitude: 115.228,
      elevation: 48,
      areaHa: 8.4,
      disturbanceType: "Hauling",
      disturbanceDate: "2024-01-20",
      currentLandUse: "Ripped Road Base",
      status: "UNDER_RECLAMATION",
      source: "GIS GPS Survey",
      responsibleDept: "Civil & Reclamation",
      createdAt: "2024-01-20T08:00:00Z",
      updatedAt: "2026-08-11T11:00:00Z",
    },
    {
      id: "da-4",
      disturbedAreaId: "DA-DISPOSAL-SOUTH-REV",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      name: "Revegetated Disposal South Phase 1",
      code: "DA-WD-S1",
      pitId: "pit-alpha",
      pitName: "Pit Alpha",
      blockId: "blk-02",
      blockName: "Block 02",
      latitude: -3.432,
      longitude: 115.241,
      elevation: 110,
      areaHa: 15.6,
      disturbanceType: "Disposal",
      disturbanceDate: "2021-06-12",
      currentLandUse: "Established Local Forest",
      status: "RECLAIMED",
      source: "Remote Sensing NDVI",
      responsibleDept: "Environmental & Forestry",
      createdAt: "2021-06-12T08:00:00Z",
      updatedAt: "2026-08-01T09:00:00Z",
    },
  ];

  private projects: ReclamationProject[] = [
    {
      id: "proj-1",
      projectId: "REC-PROJ-2026-01",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      disturbedAreaId: "DA-DISPOSAL-NORTH",
      disturbedAreaName: "Waste Dump Disposal North Slope A",
      projectName: "Reclamation & Revegetation Waste Dump North Slope A",
      objective: "Membentuk lereng stabil (1:3), penebaran topsoil 30cm, penanaman cover crop & pohon sengon/akasia",
      targetAreaHa: 18.2,
      reclaimedAreaHa: 12.4,
      startDate: "2026-01-15",
      targetCompletionDate: "2026-11-30",
      responsiblePerson: "Bambang Suherman, S.Hut",
      contractorId: "CONT-001",
      contractorName: "PT Rimba Hijaubumi Ops",
      budgetIDR: 2200000000,
      actualCostIDR: 1540000000,
      priority: "HIGH",
      status: "IN_PROGRESS",
      assessmentStatus: "READY",
      createdAt: "2026-01-10T08:00:00Z",
      updatedAt: "2026-08-12T16:00:00Z",
    },
    {
      id: "proj-2",
      projectId: "REC-PROJ-2026-02",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      disturbedAreaId: "DA-PIT-ALPHA-01",
      disturbedAreaName: "Pit Alpha Block 3 West Slope",
      projectName: "Backfilled Pit Void Reclamation Alpha Block 3",
      objective: "Penataan lahan void, penggarudan topsoil & pembentukan saluran drainase terasering",
      targetAreaHa: 12.5,
      reclaimedAreaHa: 3.5,
      startDate: "2026-06-01",
      targetCompletionDate: "2026-12-20",
      responsiblePerson: "Ir. Hendra Gunawan",
      contractorId: "CONT-002",
      contractorName: "PT Nusa Reclamation Services",
      budgetIDR: 1500000000,
      actualCostIDR: 4200000000,
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      assessmentStatus: "READY",
      createdAt: "2026-05-20T08:00:00Z",
      updatedAt: "2026-08-10T11:00:00Z",
    },
    {
      id: "proj-3",
      projectId: "REC-PROJ-2025-04",
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      disturbedAreaId: "DA-DISPOSAL-SOUTH-REV",
      disturbedAreaName: "Revegetated Disposal South Phase 1",
      projectName: "Revegetation Maintenance & Forest Canopy Establishment Phase 1",
      objective: "Pemeliharaan lanjutan tahun ke-2, pemupukan NPK, penyisipan bibit lokal & penyiangan gulma",
      targetAreaHa: 15.6,
      reclaimedAreaHa: 15.6,
      startDate: "2025-02-01",
      targetCompletionDate: "2026-05-30",
      responsiblePerson: "Siti Rahmawati, S.Si",
      contractorId: "CONT-001",
      contractorName: "PT Rimba Hijaubumi Ops",
      budgetIDR: 850000000,
      actualCostIDR: 810000000,
      priority: "MEDIUM",
      status: "COMPLETED",
      assessmentStatus: "READY",
      createdAt: "2025-01-15T08:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z",
    },
  ];

  private assessments: ReclamationAssessment[] = [
    {
      id: "ass-1",
      projectId: "REC-PROJ-2026-01",
      topography: "Steep Dump Slope Angle 28° -> Target Reshaping 18°",
      slopePercent: 32.5,
      soilCondition: "Compacted Overburden Clay with Acid Soil Potential (pH 4.8)",
      topsoilAvailabilityM3: 55000,
      drainageCondition: "Requires Drop Structure & Bench Channels",
      erosionRisk: "HIGH",
      accessibility: "Accessible by CAT D8T Bulldozer and DT 20T",
      revegetationReadiness: "READY",
      environmentalRisk: "Risk of Gully Erosion & Acid Mine Drainage Runoff",
      assessedBy: "Eko Prasetyo (Senior Reclamation Engineer)",
      assessedDate: "2026-01-12",
    },
  ];

  private activities: ReclamationActivity[] = [
    {
      id: "act-1",
      activityId: "ACT-001",
      projectId: "REC-PROJ-2026-01",
      activityType: "Land Shaping",
      plannedQuantity: 18.2,
      actualQuantity: 18.2,
      unit: "ha",
      startDate: "2026-01-15",
      endDate: "2026-03-10",
      responsiblePerson: "M. Rizal (Supervisor Civil)",
      equipmentUsed: ["DZ-04 (CAT D8T)", "EX-08 (Komatsu PC300)"],
      status: "COMPLETED",
      notes: "Pembentukan jenjang/bench lebar 5m interval tinggi 10m rampung sesuai DTM",
      costIDR: 450000000,
    },
    {
      id: "act-2",
      activityId: "ACT-002",
      projectId: "REC-PROJ-2026-01",
      activityType: "Topsoil Spreading",
      plannedQuantity: 54000,
      actualQuantity: 42000,
      unit: "m³",
      startDate: "2026-03-15",
      endDate: "2026-05-20",
      responsiblePerson: "Sulaeman (Forman Topsoil)",
      equipmentUsed: ["DT-12 (Volvo FMX)", "DZ-05 (Komatsu D65)"],
      status: "IN_PROGRESS",
      notes: "Ketebalan penebaran rerata 30 cm pada bench 1 dan bench 2",
      costIDR: 380000000,
    },
    {
      id: "act-3",
      activityId: "ACT-003",
      projectId: "REC-PROJ-2026-01",
      activityType: "Planting",
      plannedQuantity: 11000,
      actualQuantity: 8800,
      unit: "seedlings",
      startDate: "2026-05-25",
      endDate: "2026-09-30",
      responsiblePerson: "Bambang Suherman",
      equipmentUsed: ["Manual Crew 15 Person"],
      status: "IN_PROGRESS",
      notes: "Penanaman Sengon Laut (Paraserianthes falcataria) & Cover Crop LCC",
      costIDR: 290000000,
    },
  ];

  private speciesList: PlantSpecies[] = [
    {
      id: "sp-1",
      speciesId: "SPEC-LCC-01",
      name: "Legume Cover Crop (LCC Mixture)",
      scientificName: "Centrosema pubescens / Pueraria javanica",
      localName: "Kacangan Cover Crop LCC",
      category: "Cover Crop",
      growthType: "Creeping / Vine",
      recommendedDensityPerHa: 15,
      unit: "kg/ha",
      status: "ACTIVE",
    },
    {
      id: "sp-2",
      speciesId: "SPEC-TRE-01",
      name: "Sengon Laut",
      scientificName: "Paraserianthes falcataria",
      localName: "Sengon / Jeungjing",
      category: "Fast Growing",
      growthType: "Fast Growing Tree",
      recommendedDensityPerHa: 625,
      unit: "plants/ha",
      status: "ACTIVE",
    },
    {
      id: "sp-3",
      speciesId: "SPEC-TRE-02",
      name: "Akasia Mangium",
      scientificName: "Acacia mangium",
      localName: "Akasia",
      category: "Pioneer",
      growthType: "Nitrogen Fixing Tree",
      recommendedDensityPerHa: 625,
      unit: "plants/ha",
      status: "ACTIVE",
    },
    {
      id: "sp-4",
      speciesId: "SPEC-LOC-01",
      name: "Ulin / Kayu Besi",
      scientificName: "Eusideroxylon zwageri",
      localName: "Ulin Kalimantan",
      category: "Local Species",
      growthType: "Slow Growing Native",
      recommendedDensityPerHa: 200,
      unit: "plants/ha",
      status: "ACTIVE",
    },
  ];

  private plantingPrograms: PlantingProgram[] = [
    {
      id: "pp-1",
      plantingProgramId: "PLANT-2026-A1",
      projectId: "REC-PROJ-2026-01",
      areaId: "DA-DISPOSAL-NORTH",
      areaName: "Waste Dump Disposal North Slope Bench 1-2",
      speciesId: "SPEC-TRE-01",
      speciesName: "Sengon Laut (Paraserianthes falcataria)",
      plantingDate: "2026-06-10",
      targetQuantity: 7500,
      actualQuantity: 6800,
      targetDensityPerHa: 625,
      actualDensityPerHa: 610,
      responsiblePerson: "Bambang Suherman",
      contractorName: "PT Rimba Hijaubumi Ops",
      seedlingsReceived: 7500,
      seedlingsPlanted: 6800,
      seedlingsDamaged: 120,
      seedlingsReplaced: 100,
      seedlingsSurvived: 6120,
      seedlingsFailed: 680,
      survivalRatePercent: 90.0,
      status: "IN_PROGRESS",
    },
    {
      id: "pp-2",
      plantingProgramId: "PLANT-2026-A2",
      projectId: "REC-PROJ-2026-01",
      areaId: "DA-DISPOSAL-NORTH",
      areaName: "Waste Dump Disposal North Slope Slope Faces",
      speciesId: "SPEC-LCC-01",
      speciesName: "LCC Mixture (Centrosema / Pueraria)",
      plantingDate: "2026-05-15",
      targetQuantity: 270,
      actualQuantity: 270,
      targetDensityPerHa: 15,
      actualDensityPerHa: 15,
      responsiblePerson: "M. Rizal",
      contractorName: "PT Rimba Hijaubumi Ops",
      seedlingsReceived: 300,
      seedlingsPlanted: 270,
      seedlingsDamaged: 10,
      seedlingsReplaced: 0,
      seedlingsSurvived: 250,
      seedlingsFailed: 20,
      survivalRatePercent: 92.5,
      status: "COMPLETED",
    },
  ];

  private monitoringPoints: ReclamationMonitoringPoint[] = [
    {
      id: "rmp-1",
      monitoringPointId: "RMP-WD-N01",
      projectId: "REC-PROJ-2026-01",
      areaId: "DA-DISPOSAL-NORTH",
      areaName: "Waste Dump Disposal North Slope A",
      locationName: "Bench 1 Plot A (Elevation 92m RL)",
      latitude: -3.4182,
      longitude: 115.2392,
      elevation: 92,
      monitoringType: "Overall",
      frequency: "Monthly",
      responsiblePerson: "Siti Rahmawati, S.Si",
      lastMonitoringDate: "2026-08-05",
      nextMonitoringDate: "2026-09-05",
      status: "NORMAL",
    },
    {
      id: "rmp-2",
      monitoringPointId: "RMP-PIT-A03",
      projectId: "REC-PROJ-2026-02",
      areaId: "DA-PIT-ALPHA-01",
      areaName: "Pit Alpha Block 3 West Slope",
      locationName: "Backfill Slope Toe Plot B",
      latitude: -3.4218,
      longitude: 115.2345,
      elevation: 65,
      monitoringType: "Erosion",
      frequency: "Weekly",
      responsiblePerson: "Eko Prasetyo",
      lastMonitoringDate: "2026-07-28",
      nextMonitoringDate: "2026-08-11",
      status: "OVERDUE",
    },
  ];

  private monitoringForms: ReclamationMonitoringForm[] = [
    {
      id: "mf-1",
      monitoringPointId: "RMP-WD-N01",
      date: "2026-08-05",
      inspectorName: "Siti Rahmawati",
      plantHealth: "GOOD",
      survivalRatePercent: 90.0,
      vegetationCoveragePercent: 82.5,
      bareAreaPercent: 17.5,
      erosionSeverity: "LOW",
      drainageCondition: "GOOD",
      soilCondition: "Topsoil moist, pH 6.2 (Post Dolomite)",
      pestDiseasePresent: false,
      gpsCoordinates: "Lat -3.4182, Long 115.2392",
      remarks: "Pertumbuhan Sengon rata-rata tinggi 1.2m, LCC menutup tanah 85%",
      replantingRequired: false,
    },
  ];

  private maintenanceList: ReclamationMaintenance[] = [
    {
      id: "maint-1",
      maintenanceId: "MNT-202608-01",
      projectId: "REC-PROJ-2026-01",
      areaName: "Waste Dump Disposal North Bench 1",
      date: "2026-08-02",
      activity: "Fertilization",
      quantity: 1200,
      unit: "kg NPK 15-15-15",
      equipment: "Manual Broadcast & Water Truck WT-02",
      workersCount: 12,
      costIDR: 28000000,
      responsiblePerson: "Bambang Suherman",
      status: "COMPLETED",
    },
    {
      id: "maint-2",
      maintenanceId: "MNT-202608-02",
      projectId: "REC-PROJ-2026-01",
      areaName: "Waste Dump Disposal North Slope 2",
      date: "2026-08-08",
      activity: "Weeding",
      quantity: 4.5,
      unit: "ha",
      equipment: "Grass Cutter & Manual Crew",
      workersCount: 10,
      costIDR: 15000000,
      responsiblePerson: "Sulaeman",
      status: "COMPLETED",
    },
  ];

  private soilRecords: SoilAndTopsoilRecord[] = [
    {
      id: "soil-1",
      recordId: "TOP-REC-202608-01",
      sourceArea: "Topsoil Bank Stockpile Alpha 2",
      destinationArea: "Waste Dump Disposal North Slope Bench 2",
      volumeM3: 12500,
      date: "2026-08-01",
      quality: "EXCELLENT",
      operator: "Budi Santoso",
      equipment: "EX-08 + DT-14 (12 Trips)",
      type: "TOPSOIL_SPREAD",
    },
    {
      id: "soil-2",
      recordId: "TOP-STOCK-202608-02",
      sourceArea: "Pit Beta Extension Clearing",
      destinationArea: "Topsoil Bank Stockpile Central B",
      volumeM3: 38000,
      date: "2026-07-20",
      quality: "GOOD",
      operator: "Agus Setiawan",
      equipment: "EX-05 + DT-08",
      type: "TOPSOIL_STOCK",
    },
  ];

  private costRecords: ReclamationCostRecord[] = [
    {
      id: "cost-1",
      costId: "COST-REC-001",
      projectId: "REC-PROJ-2026-01",
      projectName: "Reclamation Waste Dump North Slope A",
      costCategory: "Land Preparation",
      description: "Penataan Lahan & Reshaping Bench dengan Bulldozer D8T",
      budgetIDR: 500000000,
      actualCostIDR: 450000000,
      areaHa: 18.2,
      costPerHaIDR: 24725000,
      date: "2026-03-10",
      contractorName: "PT Rimba Hijaubumi Ops",
      approvedBy: "Manager Mine Engineering",
    },
    {
      id: "cost-2",
      costId: "COST-REC-002",
      projectId: "REC-PROJ-2026-01",
      projectName: "Reclamation Waste Dump North Slope A",
      costCategory: "Topsoil",
      description: "Transportasi & Penebaran Humus Topsoil 30cm",
      budgetIDR: 400000000,
      actualCostIDR: 380000000,
      areaHa: 18.2,
      costPerHaIDR: 20879000,
      date: "2026-05-20",
      contractorName: "PT Rimba Hijaubumi Ops",
      approvedBy: "Manager Mine Engineering",
    },
  ];

  private aiInsights: ReclamationAIInsight[] = [
    {
      id: "rec-ai-1",
      title: "Optimasi Penanaman Cover Crop pada Slope Pit Beta",
      finding: "Tingkat erosi gully terpantau 12% lebih tinggi pada lereng tanpa perlakuan mulching.",
      evidence: "Data DTM Drone & Foto Udara Plot RMP-PIT-A03 tanggal 28 Juli 2026.",
      trend: "Sensitivitas erosi meningkat saat curah hujan > 45 mm/hari.",
      possibleCauses: [
        "Kemiringan lereng asli > 28 derajat",
        "Penebaran topsoil belum terikat perakaran cover crop",
      ],
      reclamationRisk: "HIGH",
      recommendation: "Lakukan hydroseeding mulching selulosa pada lereng terjal & pasang sengkedan bambu (fascine).",
      expectedImpact: "Mengurangi risiko erosi tanah hingga 75% dan mempercepat penutupan LCC.",
      confidence: "High (89%)",
    },
    {
      id: "rec-ai-2",
      title: "Prediksi Pencapaian Target Reklamasi RKAB 2026",
      finding: "Realisasi reklamasi 18.5 Ha (74% dari target tahunan 25.0 Ha).",
      evidence: "Proyeksi kecepatan penanaman 2.2 Ha/bulan dengan 15 personil.",
      trend: "Proyeksi penyelesaian target RKAB pada bulan Oktober 2026 (1 bulan lebih awal dari deadline).",
      possibleCauses: [
        "Ketersediaan topsoil memadai di Bank Stockpile Central",
        "Suplai bibit Sengon & Akasia dari Nursery Site kontinyu",
      ],
      reclamationRisk: "LOW",
      recommendation: "Pertahankan ritme penanaman saat ini & siapkan plotting area tambahan di Pit Alpha Block 4.",
      expectedImpact: "Memastikan ketaatan 100% pada persetujuan RKAB ESDM.",
      confidence: "High (94%)",
    },
  ];

  private documents: ReclamationDocument[] = [
    {
      id: "doc-rec-1",
      documentNumber: "DOC-REC-PLAN-2026",
      title: "Rencana Reklamasi Lima Tahun (5-Year Mining Reclamation Plan 2026-2030)",
      category: "RECLAMATION_PLAN",
      uploadDate: "2026-01-05",
      issuer: "Direktorat Jenderal Minerba ESDM",
      fileSize: "14.2 MB",
      status: "VALID",
    },
    {
      id: "doc-rec-2",
      documentNumber: "SURV-DTM-202608",
      title: "Drone Orthomosaic & DTM Survey Topografi Reklamasi Pit Alpha",
      category: "SURVEY_DTM",
      uploadDate: "2026-08-01",
      issuer: "Tim Survey & GIS MINE SMART AI",
      fileSize: "88.5 MB",
      status: "VALID",
    },
    {
      id: "doc-rec-3",
      documentNumber: "REP-MON-REC-Q2-2026",
      title: "Laporan Hasil Pemantauan Keberhasilan Revegetation Triwulan II 2026",
      category: "MONITORING_REPORT",
      uploadDate: "2026-07-15",
      issuer: "Departemen Lingkungan & K3",
      fileSize: "5.8 MB",
      status: "VALID",
    },
  ];

  // Async Accessors
  async getKPISummary(): Promise<ReclamationKPISummary> {
    return { ...this.kpiSummary };
  }

  async getDisturbedAreas(): Promise<DisturbedArea[]> {
    return [...this.disturbedAreas];
  }

  async addDisturbedArea(area: Omit<DisturbedArea, "id" | "createdAt" | "updatedAt">): Promise<DisturbedArea> {
    const created: DisturbedArea = {
      ...area,
      id: `da-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.disturbedAreas.unshift(created);
    return created;
  }

  async getProjects(): Promise<ReclamationProject[]> {
    return [...this.projects];
  }

  async addProject(project: Omit<ReclamationProject, "id" | "createdAt" | "updatedAt">): Promise<ReclamationProject> {
    const created: ReclamationProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(created);
    return created;
  }

  async getAssessments(): Promise<ReclamationAssessment[]> {
    return [...this.assessments];
  }

  async getActivities(): Promise<ReclamationActivity[]> {
    return [...this.activities];
  }

  async addActivity(act: Omit<ReclamationActivity, "id">): Promise<ReclamationActivity> {
    const created: ReclamationActivity = {
      ...act,
      id: `act-${Date.now()}`,
    };
    this.activities.unshift(created);
    return created;
  }

  async getSpeciesList(): Promise<PlantSpecies[]> {
    return [...this.speciesList];
  }

  async getPlantingPrograms(): Promise<PlantingProgram[]> {
    return [...this.plantingPrograms];
  }

  async addPlantingProgram(program: Omit<PlantingProgram, "id">): Promise<PlantingProgram> {
    const created: PlantingProgram = {
      ...program,
      id: `pp-${Date.now()}`,
    };
    this.plantingPrograms.unshift(created);
    return created;
  }

  async getMonitoringPoints(): Promise<ReclamationMonitoringPoint[]> {
    return [...this.monitoringPoints];
  }

  async getMonitoringForms(): Promise<ReclamationMonitoringForm[]> {
    return [...this.monitoringForms];
  }

  async addMonitoringForm(form: Omit<ReclamationMonitoringForm, "id">): Promise<ReclamationMonitoringForm> {
    const created: ReclamationMonitoringForm = {
      ...form,
      id: `mf-${Date.now()}`,
    };
    this.monitoringForms.unshift(created);
    return created;
  }

  async getMaintenanceList(): Promise<ReclamationMaintenance[]> {
    return [...this.maintenanceList];
  }

  async getSoilRecords(): Promise<SoilAndTopsoilRecord[]> {
    return [...this.soilRecords];
  }

  async getCostRecords(): Promise<ReclamationCostRecord[]> {
    return [...this.costRecords];
  }

  async getAIInsights(): Promise<ReclamationAIInsight[]> {
    return [...this.aiInsights];
  }

  async getDocuments(): Promise<ReclamationDocument[]> {
    return [...this.documents];
  }
}

export const reclamationRepository = new ReclamationRepository();
