// MINE SMART AI - RKAB & Compliance Data Repository
// Mendukung Pengelolaan 8 Aspek Kepatuhan & Integrasi Format MinerbaOne ESDM

import {
  RKABPeriod,
  ProductionTargetItem,
  WorkPlanMatrixItem,
  InvestmentBudgetItem,
  ReclamationComplianceItem,
  ManpowerComplianceItem,
  MandatoryCertificationPersonnel,
  MiningSafetyKOAuditMetric,
  MinerbaOneBridgePayload,
} from "../../types/rkabTypes";

export class RKABRepository {
  // 1. Initial Production Targets & Actuals (Year 2026 Coal & Overburden Target: 3.5 Million MT)
  private static productionData: ProductionTargetItem[] = [
    {
      id: "PROD-01",
      month: "Jan",
      quarter: "Q1",
      coalTargetMT: 280000,
      coalActualMT: 285400,
      obTargetBCM: 1680000,
      obActualBCM: 1710000,
      targetSR: 6.0,
      actualSR: 5.99,
      dmoTargetMT: 70000,
      dmoActualMT: 75000,
      exportActualMT: 210400,
      notes: "Kondisi cuaca cerah, produktivitas fleet EX-201 & EX-202 optimal.",
    },
    {
      id: "PROD-02",
      month: "Feb",
      quarter: "Q1",
      coalTargetMT: 270000,
      coalActualMT: 262000,
      obTargetBCM: 1620000,
      obActualBCM: 1580000,
      targetSR: 6.0,
      actualSR: 6.03,
      dmoTargetMT: 67500,
      dmoActualMT: 70000,
      exportActualMT: 192000,
      notes: "Curah hujan tinggi pada minggu ke-2, slippage penambangan bench 3.",
    },
    {
      id: "PROD-03",
      month: "Mar",
      quarter: "Q1",
      coalTargetMT: 290000,
      coalActualMT: 298500,
      obTargetBCM: 1740000,
      obActualBCM: 1790000,
      targetSR: 6.0,
      actualSR: 5.99,
      dmoTargetMT: 72500,
      dmoActualMT: 78000,
      exportActualMT: 220500,
      notes: "Penambahan 1 fleet CAT 777G meningkatkan volume hauling ke crushing plant.",
    },
    {
      id: "PROD-04",
      month: "Apr",
      quarter: "Q2",
      coalTargetMT: 300000,
      coalActualMT: 308200,
      obTargetBCM: 1800000,
      obActualBCM: 1845000,
      targetSR: 6.0,
      actualSR: 5.98,
      dmoTargetMT: 75000,
      dmoActualMT: 80000,
      exportActualMT: 228200,
      notes: "Operasi Pit 1 South seam utama A2 terekspos optimal.",
    },
    {
      id: "PROD-05",
      month: "Mei",
      quarter: "Q2",
      coalTargetMT: 310000,
      coalActualMT: 315000,
      obTargetBCM: 1860000,
      obActualBCM: 1890000,
      targetSR: 6.0,
      actualSR: 6.0,
      dmoTargetMT: 77500,
      dmoActualMT: 82000,
      exportActualMT: 233000,
      notes: "Pengiriman tongkang lancar ke PLTU Batang & Paiton.",
    },
    {
      id: "PROD-06",
      month: "Jun",
      quarter: "Q2",
      coalTargetMT: 310000,
      coalActualMT: 312800,
      obTargetBCM: 1860000,
      obActualBCM: 1872000,
      targetSR: 6.0,
      actualSR: 5.98,
      dmoTargetMT: 77500,
      dmoActualMT: 81500,
      exportActualMT: 231300,
      notes: "Penutupan Semester I dengan capaian produksi 102.3% dari target RKAB.",
    },
    {
      id: "PROD-07",
      month: "Jul",
      quarter: "Q3",
      coalTargetMT: 320000,
      coalActualMT: 325400,
      obTargetBCM: 1920000,
      obActualBCM: 1950000,
      targetSR: 6.0,
      actualSR: 5.99,
      dmoTargetMT: 80000,
      dmoActualMT: 85000,
      exportActualMT: 240400,
      notes: "Musim kemarau, kecepatan pengangkutan hauling road mencapai 42 km/jam.",
    },
    {
      id: "PROD-08",
      month: "Agu (Current)",
      quarter: "Q3",
      coalTargetMT: 320000,
      coalActualMT: 182000, // YTD mid month
      obTargetBCM: 1920000,
      obActualBCM: 1120000,
      targetSR: 6.0,
      actualSR: 6.15,
      dmoTargetMT: 80000,
      dmoActualMT: 48000,
      exportActualMT: 134000,
      notes: "Bulan berjalan (Progres 57% pada pertengahan Agustus 2026).",
    },
    {
      id: "PROD-09",
      month: "Sep (Plan)",
      quarter: "Q3",
      coalTargetMT: 300000,
      coalActualMT: 0,
      obTargetBCM: 1800000,
      obActualBCM: 0,
      targetSR: 6.0,
      actualSR: 0,
      dmoTargetMT: 75000,
      dmoActualMT: 0,
      exportActualMT: 0,
      notes: "Rencana transisi penambangan ke Pit 2 North.",
    },
    {
      id: "PROD-10",
      month: "Okt (Plan)",
      quarter: "Q4",
      coalTargetMT: 290000,
      coalActualMT: 0,
      obTargetBCM: 1740000,
      obActualBCM: 0,
      targetSR: 6.0,
      actualSR: 0,
      dmoTargetMT: 72500,
      dmoActualMT: 0,
      exportActualMT: 0,
      notes: "Peningkatan antisipasi saluran dewatering menghadapi musim hujan.",
    },
    {
      id: "PROD-11",
      month: "Nov (Plan)",
      quarter: "Q4",
      coalTargetMT: 270000,
      coalActualMT: 0,
      obTargetBCM: 1620000,
      obActualBCM: 0,
      targetSR: 6.0,
      actualSR: 0,
      dmoTargetMT: 67500,
      dmoActualMT: 0,
      exportActualMT: 0,
      notes: "Proyeksi curah hujan sedang, prioritas backfilling disposal utara.",
    },
    {
      id: "PROD-12",
      month: "Des (Plan)",
      quarter: "Q4",
      coalTargetMT: 240000,
      coalActualMT: 0,
      obTargetBCM: 1440000,
      obActualBCM: 0,
      targetSR: 6.0,
      actualSR: 0,
      dmoTargetMT: 60000,
      dmoActualMT: 0,
      exportActualMT: 0,
      notes: "Finalisasi target tahunan & rekonsiliasi cadangan batubara.",
    },
  ];

  // 2. Work Plan Matrix Items (ESDM Standard Matriks)
  private static workPlans: WorkPlanMatrixItem[] = [
    {
      id: "WP-01",
      matrixCode: "Matriks 1A",
      activityName: "Pemboran Eksplorasi Lanjutan & Geoteknik Pit 2",
      category: "EKSPLORASI",
      targetVolume: 4500,
      unit: "Meter",
      realizedVolume: 4200,
      progressPercent: 93.3,
      timelineQuarter: ["Q1", "Q2", "Q3"],
      responsiblePerson: "Ir. Doni Hendrawan (Chief Geologist)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 2800000000,
      budgetSpentIDR: 2650000000,
    },
    {
      id: "WP-02",
      matrixCode: "Matriks 2A",
      activityName: "Pembersihan Lahan (Land Clearing) Tahap 4",
      category: "PENAMBANGAN",
      targetVolume: 45,
      unit: "Ha",
      realizedVolume: 41,
      progressPercent: 91.1,
      timelineQuarter: ["Q1", "Q2"],
      responsiblePerson: "Budi Santoso, ST (Mine Operation Superintendent)",
      status: "COMPLETED",
      budgetAllocatedIDR: 1350000000,
      budgetSpentIDR: 1280000000,
    },
    {
      id: "WP-03",
      matrixCode: "Matriks 2C",
      activityName: "Pengupasan Batuan Penutup (Overburden Removal)",
      category: "PENAMBANGAN",
      targetVolume: 21000000,
      unit: "BCM",
      realizedVolume: 12867000,
      progressPercent: 61.3,
      timelineQuarter: ["Q1", "Q2", "Q3", "Q4"],
      responsiblePerson: "Hendri Kurniawan (Mining Dept Head)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 252000000000,
      budgetSpentIDR: 154404000000,
    },
    {
      id: "WP-04",
      matrixCode: "Matriks 3A",
      activityName: "Peningkatan Kapasitas Crushing Plant 2 (500 TPH)",
      category: "PENGOLAHAN",
      targetVolume: 1,
      unit: "Unit",
      realizedVolume: 0.85,
      progressPercent: 85.0,
      timelineQuarter: ["Q2", "Q3"],
      responsiblePerson: "Agus Pratama, ST (Plant Manager)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 12500000000,
      budgetSpentIDR: 10625000000,
    },
    {
      id: "WP-05",
      matrixCode: "Matriks 4B",
      activityName: "Perkerasan & Pelebaran Jalan Angkut Hauling KM 12-18",
      category: "INFRASTRUKTUR",
      targetVolume: 6,
      unit: "KM",
      realizedVolume: 5.5,
      progressPercent: 91.6,
      timelineQuarter: ["Q1", "Q2", "Q3"],
      responsiblePerson: "Syarif Hidayat (Civil Engineering Head)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 7200000000,
      budgetSpentIDR: 6600000000,
    },
    {
      id: "WP-06",
      matrixCode: "Matriks 5A",
      activityName: "Penataan Lahan Bekas Tambang & Backfilling Disposal",
      category: "LINGKUNGAN",
      targetVolume: 35,
      unit: "Ha",
      realizedVolume: 29.5,
      progressPercent: 84.3,
      timelineQuarter: ["Q1", "Q2", "Q3", "Q4"],
      responsiblePerson: "Dr. Maya Safitri (Env & Reclamation Manager)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 8750000000,
      budgetSpentIDR: 7376000000,
    },
    {
      id: "WP-07",
      matrixCode: "Matriks 6A",
      activityName: "Audit Internal SMKP Minerba & Sertifikasi POP/POM",
      category: "K3",
      targetVolume: 120,
      unit: "Personel",
      realizedVolume: 108,
      progressPercent: 90.0,
      timelineQuarter: ["Q1", "Q2", "Q3", "Q4"],
      responsiblePerson: "Rahmat Hidayat (HSE & K3 Head)",
      status: "ON_TRACK",
      budgetAllocatedIDR: 3500000000,
      budgetSpentIDR: 3150000000,
    },
  ];

  // 3. Investment & Budget Items
  private static investmentBudgets: InvestmentBudgetItem[] = [
    {
      id: "INV-01",
      category: "CAPEX_HEAVY_EQUIPMENT",
      title: "Pengadaan 2 Unit Excavator Komatsu PC1250-8R & 6 Unit CAT 777G",
      description: "Peremajaan armada stripping overburden dan pemuatan batubara pit utama.",
      planAmountUSD: 6500000,
      actualAmountUSD: 6450000,
      planAmountIDR: 104000000000,
      actualAmountIDR: 103200000000,
      allocationPercent: 38.5,
      isMandatoryESDM: false,
      notes: "Unit telah tiba di site dan terpasang Fleet Management System (FMS).",
    },
    {
      id: "INV-02",
      category: "CAPEX_INFRASTRUCTURE",
      title: "Pembangunan Jetty Conveyor Loading Tambahan di Pelabuhan Muara",
      description: "Meningkatkan kecepatan loading tongkang 300 feet dari 850 TPH menjadi 1.200 TPH.",
      planAmountUSD: 2800000,
      actualAmountUSD: 2400000,
      planAmountIDR: 44800000000,
      actualAmountIDR: 38400000000,
      allocationPercent: 16.6,
      isMandatoryESDM: false,
      notes: "Progres fisik konstruksi 86%, target uji coba komisioning September 2026.",
    },
    {
      id: "INV-03",
      category: "OPEX_MINING",
      title: "Biaya Operasional Penambangan, Bahan Bakar Solar B35 & Drilling",
      description: "Konsumsi solar B35 alokasi 1.200.000 L/bulan, bahan peledak ANFO, dan jasa kontraktor.",
      planAmountUSD: 24000000,
      actualAmountUSD: 16200000,
      planAmountIDR: 384000000000,
      actualAmountIDR: 259200000000,
      allocationPercent: 41.2,
      isMandatoryESDM: false,
      notes: "Realisasi YTD sesuai anggaran operasional per BCM.",
    },
    {
      id: "INV-04",
      category: "OPEX_SAFETY_HSE",
      title: "Anggaran Wajib K3 & Penerapan SMKP Minerba (Kepmen 1827/2018)",
      description: "Pengadaan APD terstandar, audit SMKP eksternal, pelatihan sertifikasi, APAR, dan ERT.",
      planAmountUSD: 650000,
      actualAmountUSD: 490000,
      planAmountIDR: 10400000000,
      actualAmountIDR: 7840000000,
      allocationPercent: 2.1,
      isMandatoryESDM: true,
      notes: "Alokasi wajib minimal 1.5% dari total OPEX penambangan terealisasi penuh.",
    },
    {
      id: "INV-05",
      category: "OPEX_RECLAMATION",
      title: "Anggaran Pengelolaan Lingkungan, Reklamasi Lahan & Pembibitan Nursery",
      description: "Penataan tanah pucuk (top soil), penanaman pohon pionir (Sengon, Johar), pemantauan air limbah.",
      planAmountUSD: 850000,
      actualAmountUSD: 680000,
      planAmountIDR: 13600000000,
      actualAmountIDR: 10880000000,
      allocationPercent: 2.7,
      isMandatoryESDM: true,
      notes: "Termasuk pemeliharaan tanaman tahun ke-1 s/d tahun ke-3 sesuai dokumen Rencana Reklamasi 5 Tahun.",
    },
    {
      id: "INV-06",
      category: "ROYALTY_PNBP",
      title: "Kewajiban Pembayaran Royalti Iuran Produksi PNBP ke Kas Negara",
      description: "Penyetoran royalti batubara berjenjang (14%-28% sesuai HBA ESDM via e-PNBP).",
      planAmountUSD: 18500000,
      actualAmountUSD: 12900000,
      planAmountIDR: 296000000000,
      actualAmountIDR: 206400000000,
      allocationPercent: 25.0,
      isMandatoryESDM: true,
      notes: "Status lunas tervalidasi di SIMBARA (Sistem Informasi Mineral dan Batubara).",
    },
  ];

  // 4. Reclamation & Post-Mining Compliance
  private static reclamationData: ReclamationComplianceItem[] = [
    {
      id: "REC-01",
      year: "2026 (YTD)",
      pitArea: "Pit 1 South & Disposal East",
      openedAreaHa: 45.0,
      cumulativeOpenedHa: 382.4,
      reclamationTargetHa: 35.0,
      reclamationActualHa: 29.5,
      revegetationTargetHa: 30.0,
      revegetationActualHa: 26.8,
      treesPlantedCount: 24500,
      nurseryStockCount: 42000,
      jamrekGuaranteeAmountIDR: 48500000000,
      jamrekStatus: "DEPOSITED",
      acidWaterPondPH: 7.2,
      tssPPM: 142,
    },
    {
      id: "REC-02",
      year: "2025",
      pitArea: "Disposal North & Pit 1 North",
      openedAreaHa: 52.0,
      cumulativeOpenedHa: 337.4,
      reclamationTargetHa: 42.0,
      reclamationActualHa: 43.1,
      revegetationTargetHa: 38.0,
      revegetationActualHa: 39.5,
      treesPlantedCount: 35600,
      nurseryStockCount: 38000,
      jamrekGuaranteeAmountIDR: 44200000000,
      jamrekStatus: "DEPOSITED",
      acidWaterPondPH: 7.4,
      tssPPM: 118,
    },
  ];

  // 5. Manpower Ratio Compliance
  private static manpowerData: ManpowerComplianceItem[] = [
    {
      id: "MP-01",
      category: "LOKAL_RING_1",
      headcount: 385,
      targetRatioPercent: 40.0,
      actualRatioPercent: 44.2,
      trainingHoursDelivered: 4620,
    },
    {
      id: "MP-02",
      category: "LOKAL_PROVINSI",
      headcount: 270,
      targetRatioPercent: 30.0,
      actualRatioPercent: 31.0,
      trainingHoursDelivered: 3240,
    },
    {
      id: "MP-03",
      category: "NASIONAL",
      headcount: 212,
      targetRatioPercent: 30.0,
      actualRatioPercent: 24.3,
      trainingHoursDelivered: 2968,
    },
    {
      id: "MP-04",
      category: "TKA",
      headcount: 4,
      targetRatioPercent: 0.5,
      actualRatioPercent: 0.5,
      trainingHoursDelivered: 80,
    },
  ];

  // 6. Mandatory Certified Mining Personnel (KTT, POP, POM, POU, Juru Ledak, Juru Ukur)
  private static certifiedPersonnel: MandatoryCertificationPersonnel[] = [
    {
      id: "CERT-01",
      name: "Ir. Hendro Wicaksono, ST., MT., IPU",
      role: "Kepala Teknik Tambang (KTT)",
      certificateType: "KTT",
      certificateNumber: "KTT/DJB/ESDM/2024/0981",
      issuingBody: "Direktorat Jenderal Mineral dan Batubara ESDM",
      validUntil: "2027-11-20",
      status: "VALID",
    },
    {
      id: "CERT-02",
      name: "Bambang Triatmojo, ST",
      role: "Mine Operation Superintendent",
      certificateType: "POM",
      certificateNumber: "POM-MINERBA-2023-1102",
      issuingBody: "LSP ESDM / BNSP",
      validUntil: "2026-12-15",
      status: "VALID",
    },
    {
      id: "CERT-03",
      name: "Agus Prasetyo",
      role: "Pit Supervisor Pit 1",
      certificateType: "POP",
      certificateNumber: "POP-MINERBA-2024-4412",
      issuingBody: "LSP ESDM / BNSP",
      validUntil: "2027-04-10",
      status: "VALID",
    },
    {
      id: "CERT-04",
      name: "Dimas Anggoro, ST",
      role: "Senior Blasting Engineer",
      certificateType: "JURU_LEDAK_KIM",
      certificateNumber: "KIM-HANDAK-POLRI-2025-08",
      issuingBody: "Polda Kaltim & Ditjen Minerba ESDM",
      validUntil: "2026-09-30",
      status: "EXPIRING_SOON",
    },
    {
      id: "CERT-05",
      name: "Rizky Ramadhan, ST",
      role: "Head of Mine Survey & GIS",
      certificateType: "JURU_UKUR",
      certificateNumber: "JU-MINERBA-2023-0491",
      issuingBody: "Direktorat Jenderal Mineral dan Batubara ESDM",
      validUntil: "2028-02-18",
      status: "VALID",
    },
    {
      id: "CERT-06",
      name: "Wahyu Hidayat, SKM",
      role: "HSE Specialist & SMKP Auditor",
      certificateType: "AHLI_K3_MINERBA",
      certificateNumber: "K3M-ESDM-2025-1029",
      issuingBody: "Pusdiklat Minerba ESDM",
      validUntil: "2028-06-25",
      status: "VALID",
    },
    {
      id: "CERT-07",
      name: "Surya Dharma, ST",
      role: "General Manager Mining Operations",
      certificateType: "POU",
      certificateNumber: "POU-MINERBA-2022-0312",
      issuingBody: "LSP ESDM / BNSP",
      validUntil: "2026-11-05",
      status: "VALID",
    },
  ];

  // 7. Safety & Keselamatan Operasi (SMKP Audit Metrics)
  private static safetyMetrics: MiningSafetyKOAuditMetric[] = [
    {
      id: "SM-01",
      metricName: "Pencapaian Audit Internal SMKP Minerba (Kepmen 1827/2018)",
      targetValue: 85.0,
      actualValue: 92.4,
      unit: "% Nilai",
      status: "SAFE",
      benchmarkESDM: "Min. 70% untuk kategori Baik",
    },
    {
      id: "SM-02",
      metricName: "Jumlah Kasus Fatalitas (Fatality Incident)",
      targetValue: 0,
      actualValue: 0,
      unit: "Kasus",
      status: "SAFE",
      benchmarkESDM: "Zero Fatality (Wajib)",
    },
    {
      id: "SM-03",
      metricName: "Lost Time Injury (LTI) Rate",
      targetValue: 0,
      actualValue: 0,
      unit: "Insiden",
      status: "SAFE",
      benchmarkESDM: "Target 0 LTI per 1.000.000 Jam Kerja",
    },
    {
      id: "SM-04",
      metricName: "Total Jam Kerja Selamat Kumulatif (Safe Work Hours)",
      targetValue: 3000000,
      actualValue: 4280500,
      unit: "Man-hours",
      status: "SAFE",
      benchmarkESDM: "Berjalan tanpa kecelakaan berat sejak 2024",
    },
    {
      id: "SM-05",
      metricName: "Tingkat Kepatuhan Kelayakan Alat Berat (Kelaikan SPIP/SILO)",
      targetValue: 95.0,
      actualValue: 98.2,
      unit: "% Armada",
      status: "SAFE",
      benchmarkESDM: "Pemeriksaan berkala kelaikan operasi (KO)",
    },
  ];

  // Public Methods
  public static async getProductionData(): Promise<ProductionTargetItem[]> {
    return [...this.productionData];
  }

  public static async getWorkPlans(): Promise<WorkPlanMatrixItem[]> {
    return [...this.workPlans];
  }

  public static async getInvestmentBudgets(): Promise<InvestmentBudgetItem[]> {
    return [...this.investmentBudgets];
  }

  public static async getReclamationData(): Promise<ReclamationComplianceItem[]> {
    return [...this.reclamationData];
  }

  public static async getManpowerData(): Promise<ManpowerComplianceItem[]> {
    return [...this.manpowerData];
  }

  public static async getCertifiedPersonnel(): Promise<MandatoryCertificationPersonnel[]> {
    return [...this.certifiedPersonnel];
  }

  public static async getSafetyMetrics(): Promise<MiningSafetyKOAuditMetric[]> {
    return [...this.safetyMetrics];
  }

  public static async addWorkPlan(item: Omit<WorkPlanMatrixItem, "id">): Promise<WorkPlanMatrixItem> {
    const newId = `WP-${String(this.workPlans.length + 1).padStart(2, "0")}`;
    const created: WorkPlanMatrixItem = { id: newId, ...item };
    this.workPlans.unshift(created);
    return created;
  }

  public static async updateProductionMonth(
    id: string,
    updates: Partial<ProductionTargetItem>
  ): Promise<ProductionTargetItem | null> {
    const idx = this.productionData.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.productionData[idx] = { ...this.productionData[idx], ...updates };
      return this.productionData[idx];
    }
    return null;
  }

  // Pre-Validation Checker for MinerbaOne / ESDM Compliance
  public static async generateMinerbaOnePayload(): Promise<MinerbaOneBridgePayload> {
    const totalTargetCoal = this.productionData.reduce((acc, curr) => acc + curr.coalTargetMT, 0);
    const totalActualCoal = this.productionData.reduce((acc, curr) => acc + curr.coalActualMT, 0);
    const totalTargetOB = this.productionData.reduce((acc, curr) => acc + curr.obTargetBCM, 0);
    const totalActualOB = this.productionData.reduce((acc, curr) => acc + curr.obActualBCM, 0);
    const totalDmoActual = this.productionData.reduce((acc, curr) => acc + curr.dmoActualMT, 0);

    const dmoPercent = totalActualCoal > 0 ? (totalDmoActual / totalActualCoal) * 100 : 0;
    const achievementPercent = totalTargetCoal > 0 ? (totalActualCoal / totalTargetCoal) * 100 : 0;

    // Check Pre-validation warnings
    const preValidationErrors: Array<{
      code: string;
      severity: "ERROR" | "WARNING" | "INFO";
      message: string;
      remedy: string;
    }> = [];

    // 1. DMO Check: Must be >= 25%
    if (dmoPercent < 25.0) {
      preValidationErrors.push({
        code: "VAL-DMO-001",
        severity: "ERROR",
        message: `Realisasi DMO (${dmoPercent.toFixed(1)}%) masih di bawah ambang batas wajib 25.0% dari total produksi.`,
        remedy: "Alokasikan kuota penjualan domestik tambahan ke PLN atau industri semen sebelum mengajukan laporan triwulanan.",
      });
    } else {
      preValidationErrors.push({
        code: "VAL-DMO-PASS",
        severity: "INFO",
        message: `Pemenuhan DMO Batubara (${dmoPercent.toFixed(1)}%) telah melampaui batas minimal 25% sesuai Kepmen ESDM No 267.K/2022.`,
        remedy: "Siap disinkronkan ke SIMBARA & MinerbaOne.",
      });
    }

    // 2. Production Deviation Check: If actual exceeds target by >10%
    if (achievementPercent > 110.0) {
      preValidationErrors.push({
        code: "VAL-PROD-EXCEED",
        severity: "WARNING",
        message: `Total produksi melampaui kuota persetujuan RKAB lebih dari 10% (${achievementPercent.toFixed(1)}%).`,
        remedy: "Perusahaan wajib mengajukan Perubahan / Revisi RKAB Tahun Berjalan melalui portal MinerbaOne sebelum kapasitas terlampaui.",
      });
    }

    // 3. Certified Personnel Expiry Check
    const expiringCerts = this.certifiedPersonnel.filter((c) => c.status === "EXPIRING_SOON");
    if (expiringCerts.length > 0) {
      preValidationErrors.push({
        code: "VAL-CERT-EXP",
        severity: "WARNING",
        message: `Terdapat ${expiringCerts.length} personel kunci tambang dengan sertifikasi yang akan kadaluarsa (${expiringCerts.map((c) => c.role + " - " + c.name).join(", ")}).`,
        remedy: "Lakukan perpanjangan sertifikat kompetensi (KIM/POP/POM) ke Ditjen Minerba ESDM.",
      });
    }

    // 4. Jamrek Check
    const latestRec = this.reclamationData[0];
    if (latestRec && latestRec.jamrekStatus !== "DEPOSITED") {
      preValidationErrors.push({
        code: "VAL-JAMREK-ERR",
        severity: "ERROR",
        message: "Status Jaminan Reklamasi (Jamrek) belum terverifikasi DEPOSITED.",
        remedy: "Setorkan Bank Garansi jaminan reklamasi ke rekening penampungan ESDM.",
      });
    } else {
      preValidationErrors.push({
        code: "VAL-JAMREK-PASS",
        severity: "INFO",
        message: `Jaminan Reklamasi sebesar Rp ${(latestRec.jamrekGuaranteeAmountIDR / 1e9).toFixed(1)} Miliar telah terdeposit di Bank Persepsi ESDM.`,
        remedy: "Kepatuhan Jamrek valid 100%.",
      });
    }

    return {
      companyProfile: {
        companyName: "PT NUSANTARA MINING RESOURCES Tbk",
        nib: "9120004810291",
        iupNumber: "540/32/IUP-OP/ESDM/2020",
        kttName: "Ir. Hendro Wicaksono, ST., MT., IPU",
        kttApprovalNo: "KTT/DJB/ESDM/2024/0981",
        location: "Kutai Barat, Kalimantan Timur",
        concessionAreaHa: 2450.0,
        commodity: "Batubara (GAR 4800 - 5200 kcal/kg)",
      },
      rkabApprovalSK: "142.K/MB.04/DJB/2026",
      year: "2026",
      productionSummary: {
        targetCoalMT: totalTargetCoal,
        realizedCoalMT: totalActualCoal,
        achievementPercent: parseFloat(achievementPercent.toFixed(1)),
        targetOBBCM: totalTargetOB,
        realizedOBBCM: totalActualOB,
        dmoRealizedMT: totalDmoActual,
        dmoPercent: parseFloat(dmoPercent.toFixed(1)),
      },
      reclamationSummary: {
        reclamationHa: latestRec ? latestRec.reclamationActualHa : 29.5,
        revegetationHa: latestRec ? latestRec.revegetationActualHa : 26.8,
        jamrekDepositedIDR: latestRec ? latestRec.jamrekGuaranteeAmountIDR : 48500000000,
      },
      safetySummary: {
        fatalityCount: 0,
        ltiCount: 0,
        smkpAuditScore: 92.4,
      },
      manpowerSummary: {
        totalEmployees: 871,
        localWorkerPercent: 75.2, // Lokal Ring 1 + Lokal Provinsi
        certifiedKTTPOPCount: this.certifiedPersonnel.length,
      },
      preValidationErrors,
    };
  }
}
