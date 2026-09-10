// MINE SMART AI - AI Report Generator Master Dataset (8 Key Reports)
// Comprehensive realistic operational data for 1-Click Generation & Export

import {
  GeneratedAIReport,
  ReportCategoryConfig,
  AIReportType,
} from "../types/aiReportTypes";

export const REPORT_CONFIGS: ReportCategoryConfig[] = [
  {
    type: "DAILY_MINING",
    title: "Daily Mining Report",
    shortDesc: "Laporan komprehensif harian operasi pit, cuaca, delay & ketersediaan front",
    category: "DAILY",
    iconName: "Pickaxe",
    badge: "Operational",
    defaultTimeframe: "Hari Ini (2 Shift)",
    primaryMetric: "24,850 BCM OB & 5,420 Ton Coal",
  },
  {
    type: "DAILY_PRODUCTION",
    title: "Daily Production Report",
    shortDesc: "Laporan harian ritase, volume overburden, perolehan batubara & stripping ratio",
    category: "DAILY",
    iconName: "TrendingUp",
    badge: "Production",
    defaultTimeframe: "Shift 1 & 2 Kemarin",
    primaryMetric: "Pencapaian 101.4% Target Harian",
  },
  {
    type: "WEEKLY_REPORT",
    title: "Weekly Report",
    shortDesc: "Laporan mingguan progress penambangan, advance bench, grade recovery & stockpile",
    category: "PERIODIC",
    iconName: "Calendar",
    badge: "Weekly W-33",
    defaultTimeframe: "Minggu ke-33 (10 - 16 Ags 2026)",
    primaryMetric: "172,400 BCM OB (SR 4.62)",
  },
  {
    type: "MONTHLY_REPORT",
    title: "Monthly Report",
    shortDesc: "Laporan bulanan kemajuan tambang, rekonsiliasi survey & kepatuhan RKAB ESDM",
    category: "PERIODIC",
    iconName: "FileSpreadsheet",
    badge: "Monthly / RKAB",
    defaultTimeframe: "Agustus 2026 (Month-to-Date)",
    primaryMetric: "740,200 BCM OB vs Target 725,000 BCM",
  },
  {
    type: "HSE_REPORT",
    title: "HSE Report",
    shortDesc: "Laporan K3 & Lingkungan Hidup, jam kerja selamat (LTI Free), inspeksi APD & AMDAL",
    category: "SAFETY_MAINTENANCE",
    iconName: "ShieldCheck",
    badge: "HSE & K3",
    defaultTimeframe: "3,450,000 Safe LTI Hours",
    primaryMetric: "Zero Fatalities • 98.4% PPE Compliance",
  },
  {
    type: "MAINTENANCE_REPORT",
    title: "Maintenance Report",
    shortDesc: "Kesiapan alat berat, Physical Availability (PA/MA), MTBF, MTTR & status backlog",
    category: "SAFETY_MAINTENANCE",
    iconName: "Wrench",
    badge: "Plant & Asset",
    defaultTimeframe: "Fleet Availability",
    primaryMetric: "PA Shovel 91.2% • Hauler 89.5%",
  },
  {
    type: "FLEET_REPORT",
    title: "Fleet Report",
    shortDesc: "Kinerja armada angkut & muat, match factor, cycle time, kecepatan & konsumsi solar",
    category: "OPERATIONAL",
    iconName: "Truck",
    badge: "Fleet FMS",
    defaultTimeframe: "Active Fleet Telemetry",
    primaryMetric: "Avg Cycle Time 23.4 min • MF 0.94",
  },
  {
    type: "MANAGEMENT_REPORT",
    title: "Management Report",
    shortDesc: "Laporan eksekutif direksi & C-Level, unit cash cost ($/BCM), EBITDA margin & roadmap",
    category: "EXECUTIVE",
    iconName: "Building2",
    badge: "Executive C-Level",
    defaultTimeframe: "Executive Briefing",
    primaryMetric: "Cash Cost $1.42/BCM • EBITDA 34.2%",
  },
];

export const INITIAL_AI_REPORTS: Record<AIReportType, GeneratedAIReport> = {
  // 1. DAILY MINING REPORT
  DAILY_MINING: {
    metadata: {
      id: "REP-DMR-20260816",
      type: "DAILY_MINING",
      title: "Daily Mining Operations Report",
      subtitle: "Laporan Harian Penambangan, Kondisi Pit, Pengupasan OB & Penggalian Batubara",
      periodLabel: "Minggu, 16 Agustus 2026 (Shift 1: 07:00-19:00 & Shift 2: 19:00-07:00)",
      generatedAt: "2026-08-16 18:30 WITA",
      generatedBy: "MINE SMART AI Engine v4.2",
      siteName: "Pit 01 Sangatta & Pit 02 Tutupan",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0 - Official Final",
      documentNumber: "DMR/KPC/SGT/2026/08/16-01",
    },
    aiExecutiveSummary: {
      highlights: [
        "Total pemindahan material hari ini mencapai 24,850 BCM OB dan 5,420 Ton Batubara (Pencapaian 101.4% target harian).",
        "Stripping Ratio (SR) aktual berada pada 4.58 : 1 (sesuai target RKAB batas 4.60).",
        "Waktu kerja efektif (Effective Working Hours) mencapai 21.2 jam dengan efisiensi kerja (EU) 88.3%.",
        "Kondisi jalan angkut dan front loading prima setelah perawatan grading rutin pada jam 12:30 WITA.",
      ],
      criticalAnomalies: [
        "Terjadi hujan lokal 14 mm pada Shift 1 (14:15 - 15:05 WITA), menyebabkan slippery road stoppage selama 50 menit di Ramp KM 3.2.",
      ],
      actionItems: [
        "Tingkatkan alokasi 2 unit Dozer D375 di West Dump Disposal untuk mengoptimalkan spreading rate.",
        "Pastikan penimbunan batubara Seam 40 Low Ash dipisahkan di Stockpile Dome A.",
      ],
      geminiInsight:
        "Operasi penambangan berjalan sangat efisien. Prediksi cuaca malam hari cerah berawan dengan potensi peningkatan ritase Shift 2 sebesar +6.5%.",
      confidenceScore: 98.6,
    },
    kpis: [
      {
        label: "Overburden (OB) Removed",
        actual: "24,850",
        target: "24,500",
        unit: "BCM",
        variancePct: 1.4,
        status: "OPTIMAL",
      },
      {
        label: "Coal Mined",
        actual: "5,420",
        target: "5,300",
        unit: "Ton",
        variancePct: 2.3,
        status: "OPTIMAL",
      },
      {
        label: "Stripping Ratio (SR)",
        actual: "4.58",
        target: "4.62",
        unit: "BCM/Ton",
        variancePct: -0.9,
        status: "OPTIMAL",
      },
      {
        label: "Fleet Physical Availability (PA)",
        actual: "91.4",
        target: "90.0",
        unit: "%",
        variancePct: 1.4,
        status: "OPTIMAL",
      },
    ],
    tables: [
      {
        title: "Tabel 1: Rincian Produksi per Pit & Seam",
        columns: [
          { key: "pit", label: "Pit / Location" },
          { key: "material", label: "Material Type" },
          { key: "target", label: "Plan Target", align: "right" },
          { key: "actual", label: "Actual Output", align: "right" },
          { key: "achievement", label: "Achv (%)", align: "right" },
          { key: "status", label: "Status", align: "center" },
        ],
        rows: [
          { pit: "Pit 01 West Bench 40", material: "Overburden (Hard Sandstone)", target: "14,000 BCM", actual: "14,350 BCM", achievement: "102.5%", status: "SURPASS" },
          { pit: "Pit 01 East Bench 32", material: "Coal Seam 40 Medium Ash", target: "3,200 Ton", actual: "3,280 Ton", achievement: "102.5%", status: "SURPASS" },
          { pit: "Pit 02 North Cut", material: "Overburden (Mudstone)", target: "10,500 BCM", actual: "10,500 BCM", achievement: "100.0%", status: "ON TARGET" },
          { pit: "Pit 02 Seam 35", material: "Coal Seam 35 Premium", target: "2,100 Ton", actual: "2,140 Ton", achievement: "101.9%", status: "SURPASS" },
        ],
        totals: { pit: "TOTAL HARIAN", material: "-", target: "24,500 BCM / 5,300 T", actual: "24,850 BCM / 5,420 T", achievement: "101.4%", status: "VERIFIED" },
      },
      {
        title: "Tabel 2: Distribusi Jam Kerja & Analisis Delay (Loss Time)",
        columns: [
          { key: "category", label: "Category" },
          { key: "hours", label: "Duration (Jam)", align: "right" },
          { key: "pct", label: "Percentage (%)", align: "right" },
          { key: "notes", label: "Operational Remarks" },
        ],
        rows: [
          { category: "Effective Working Time (W)", hours: "21.2", pct: "88.3%", notes: "Operasi produktif pemuatan & pengangkutan" },
          { category: "Scheduled Delay (D)", hours: "1.2", pct: "5.0%", notes: "P5M, Safety Talk, Refueling, Shift Change" },
          { category: "Weather Stoppage (Rain/Slippery)", hours: "0.8", pct: "3.3%", notes: "Hujan lokal Shift 1 & pengeringan jalan" },
          { category: "Unscheduled Breakdown (R)", hours: "0.8", pct: "3.4%", notes: "Pergantian selang hidrolik EX-03" },
        ],
        totals: { category: "TOTAL WAKTU KALENDER", hours: "24.0", pct: "100.0%", notes: "24 Jam Penuh (2 Shift)" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Hendri Kusuma, ST (Mine Superintendent)",
      safetyOfficerSignature: "Ahmad Rizky, SKM (K3 Officer)",
      date: "16 Agustus 2026",
      qrHash: "MS-DMR-8F42A-20260816",
    },
  },

  // 2. DAILY PRODUCTION REPORT
  DAILY_PRODUCTION: {
    metadata: {
      id: "REP-DPR-20260816",
      type: "DAILY_PRODUCTION",
      title: "Daily Production & Hauling Report",
      subtitle: "Laporan Ritase Armada, Efisiensi Pemuatan Shovel & Rekonsiliasi Timbangan",
      periodLabel: "16 Agustus 2026 (Shift 1 & Shift 2)",
      generatedAt: "2026-08-16 18:32 WITA",
      generatedBy: "MINE SMART Dispatch Engine",
      siteName: "Site Sangatta Utama",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0",
      documentNumber: "DPR/PROD/SGT/2026/08/16",
    },
    aiExecutiveSummary: {
      highlights: [
        "Pencapaian ritase armada mencapai 486 rit OB (rata-rata payload 51.1 BCM/rit) dan 112 rit Coal (rata-rata payload 48.4 ton/rit).",
        "Loading rate rata-rata excavator PC2000 mencapai 1,180 BCM/jam operasi murni.",
        "Waktu siklus hauling stabil pada 22.8 menit per ritase pada jarak angkut rata-rata 3.4 km.",
      ],
      criticalAnomalies: [],
      actionItems: [
        "Pertahankan alokasi 5 unit HD785 per shovel PC2000 pada rute Haul Road 01 untuk menjaga Match Factor 0.95.",
      ],
      geminiInsight:
        "Produksi batubara harian melampaui target +2.3%. Payload distribution merata tanpa ada indikasi overloading di atas 105%.",
      confidenceScore: 99.1,
    },
    kpis: [
      { label: "Total Ritase OB", actual: "486", target: "480", unit: "Rit", variancePct: 1.25, status: "OPTIMAL" },
      { label: "Total Ritase Batubara", actual: "112", target: "110", unit: "Rit", variancePct: 1.82, status: "OPTIMAL" },
      { label: "Avg Truck Payload (OB)", actual: "51.1", target: "50.0", unit: "BCM/Rit", variancePct: 2.2, status: "OPTIMAL" },
      { label: "Avg Haul Distance", actual: "3.42", target: "3.50", unit: "KM", variancePct: -2.3, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel 1: Rekapitulasi Ritase per Loading Unit (Shovel/Excavator)",
        columns: [
          { key: "fleet", label: "Fleet / Shovel" },
          { key: "model", label: "Excavator Model" },
          { key: "haulerCount", label: "Hauler Assigned", align: "center" },
          { key: "trips", label: "Total Ritase", align: "right" },
          { key: "volume", label: "Total Output", align: "right" },
          { key: "prodRate", label: "Prod Rate (BCM/hr)", align: "right" },
        ],
        rows: [
          { fleet: "Fleet A (Pit 01)", model: "Komatsu PC2000-8 #01", haulerCount: "5 HD785", trips: "162 Rit", volume: "8,280 BCM", prodRate: "414 BCM/h" },
          { fleet: "Fleet B (Pit 01)", model: "Komatsu PC2000-8 #02", haulerCount: "5 HD785", trips: "168 Rit", volume: "8,580 BCM", prodRate: "429 BCM/h" },
          { fleet: "Fleet C (Pit 02)", model: "Hitachi EX1900-6 #01", haulerCount: "5 HD785", trips: "156 Rit", volume: "7,990 BCM", prodRate: "399 BCM/h" },
          { fleet: "Coal Fleet (Pit 01)", model: "CAT 390D Coal Shovel", haulerCount: "4 Scania P460", trips: "112 Rit", volume: "5,420 Ton", prodRate: "271 T/h" },
        ],
        totals: { fleet: "TOTAL PRODUKSI", model: "-", haulerCount: "19 Trucks", trips: "598 Rit", volume: "24,850 BCM / 5,420 T", prodRate: "1,513 BCM/h" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Dedi Supriyadi (Dispatch Lead)",
      date: "16 Agustus 2026",
      qrHash: "MS-DPR-9B11C-20260816",
    },
  },

  // 3. WEEKLY REPORT
  WEEKLY_REPORT: {
    metadata: {
      id: "REP-WKR-2026W33",
      type: "WEEKLY_REPORT",
      title: "Weekly Mining Progress & Reconciliation",
      subtitle: "Evaluasi Mingguan Kemajuan Tambang Minggu ke-33 (10 - 16 Agustus 2026)",
      periodLabel: "Week 33 (10/08/2026 - 16/08/2026)",
      generatedAt: "2026-08-16 18:35 WITA",
      generatedBy: "MINE SMART BI Engine",
      siteName: "Site Sangatta & Bengalon",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0",
      documentNumber: "WKR/KPC/2026/W33",
    },
    aiExecutiveSummary: {
      highlights: [
        "Pencapaian mingguan W-33 membukukan 172,400 BCM Overburden (102.1% dari target 168,800 BCM).",
        "Total pengapalan batubara ke Pelabuhan Tanjung Bara mencapai 36,800 Ton (100.8% target mingguan).",
        "Stripping Ratio rata-rata mingguan terkendali di 4.68 (Target RKAB 4.70).",
        "Reclamation & revegetasi minggu ini menyelesaikan 2.4 Hektar di Disposal South Dump.",
      ],
      criticalAnomalies: [
        "Curah hujan kumulatif mingguan tercatat 38 mm dengan total rain downtime 4.2 jam.",
      ],
      actionItems: [
        "Lakukan blasting cut lanjutan pada Block 12 untuk membuka Coal Seam 38 sebelum minggu ke-34.",
      ],
      geminiInsight:
        "Kinerja penambangan mingguan berada pada performa puncak. Level inventory stockpile ROM aman untuk supply 12 hari ke depan.",
      confidenceScore: 98.9,
    },
    kpis: [
      { label: "Weekly OB Mined", actual: "172,400", target: "168,800", unit: "BCM", variancePct: 2.13, status: "OPTIMAL" },
      { label: "Weekly Coal Output", actual: "36,800", target: "36,500", unit: "Ton", variancePct: 0.82, status: "OPTIMAL" },
      { label: "Average Fuel Ratio", actual: "1.84", target: "1.85", unit: "L/BCM", variancePct: -0.54, status: "OPTIMAL" },
      { label: "Reclaimed Land Area", actual: "2.40", target: "2.00", unit: "Ha", variancePct: 20.0, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel: Progress Produksi Harian Selama Minggu ke-33 (Senin - Minggu)",
        columns: [
          { key: "day", label: "Hari / Tanggal" },
          { key: "ob", label: "OB (BCM)", align: "right" },
          { key: "coal", label: "Coal (Ton)", align: "right" },
          { key: "sr", label: "Actual SR", align: "center" },
          { key: "rainLoss", label: "Rain Delay (Jam)", align: "center" },
        ],
        rows: [
          { day: "Senin, 10 Ags 2026", ob: "24,100", coal: "5,150", sr: "4.68", rainLoss: "0.0" },
          { day: "Selasa, 11 Ags 2026", ob: "24,650", coal: "5,280", sr: "4.67", rainLoss: "0.5" },
          { day: "Rabu, 12 Ags 2026", ob: "25,100", coal: "5,340", sr: "4.70", rainLoss: "0.0" },
          { day: "Kamis, 13 Ags 2026", ob: "23,900", coal: "5,090", sr: "4.70", rainLoss: "1.8" },
          { day: "Jumat, 14 Ags 2026", ob: "24,800", coal: "5,220", sr: "4.75", rainLoss: "0.0" },
          { day: "Sabtu, 15 Ags 2026", ob: "25,000", coal: "5,300", sr: "4.72", rainLoss: "1.1" },
          { day: "Minggu, 16 Ags 2026", ob: "24,850", coal: "5,420", sr: "4.58", rainLoss: "0.8" },
        ],
        totals: { day: "TOTAL MINGGU W-33", ob: "172,400 BCM", coal: "36,800 Ton", sr: "4.68", rainLoss: "4.2 Jam" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Hendri Kusuma, ST (Planning Supt)",
      date: "16 Agustus 2026",
      qrHash: "MS-WKR-33A7E-20260816",
    },
  },

  // 4. MONTHLY REPORT
  MONTHLY_REPORT: {
    metadata: {
      id: "REP-MTR-202608",
      type: "MONTHLY_REPORT",
      title: "Monthly Mining & RKAB ESDM Compliance Report",
      subtitle: "Laporan Kemajuan Bulanan, Kepatuhan Perizinan & Rekonsiliasi Neraca Sumberdaya",
      periodLabel: "Agustus 2026 (Month-to-Date per 16 Agustus 2026)",
      generatedAt: "2026-08-16 18:36 WITA",
      generatedBy: "MINE SMART Regulatory Compliance Engine",
      siteName: "IUP Operasi Produksi No. 503/ESDM/2019",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "2.1 - ESDM Standard",
      documentNumber: "MTR/RKAB/KPC/2026/08",
    },
    aiExecutiveSummary: {
      highlights: [
        "Pencapaian MTD Agustus 2026: 740,200 BCM OB (102.1% dari budget MTD 725,000 BCM).",
        "Produksi batubara MTD mencapai 161,200 Ton (101.4% dari budget 159,000 Ton).",
        "Penyaluran DMO (Domestic Market Obligation) PLN mencapai 28.4% (melampaui syarat minimal ESDM 25.0%).",
        "Dana Jaminan Reklamasi dan Pascatambang teralokasi 100% pada Bank Mandiri Escrow Account.",
      ],
      criticalAnomalies: [],
      actionItems: [
        "Finalisasi pelaporan triwulan Minerba One Data Indonesia (MODI) sebelum tanggal 20 Agustus.",
      ],
      geminiInsight:
        "Proyeksi pencapaian target tahunan RKAB 2026 diprediksi mencapai 104.2% dengan efisiensi stripping ratio yang terjaga ketat.",
      confidenceScore: 99.4,
    },
    kpis: [
      { label: "OB Volume MTD", actual: "740,200", target: "725,000", unit: "BCM", variancePct: 2.1, status: "OPTIMAL" },
      { label: "Coal Production MTD", actual: "161,200", target: "159,000", unit: "Ton", variancePct: 1.38, status: "OPTIMAL" },
      { label: "DMO PLN Fulfillment", actual: "28.4", target: "25.0", unit: "%", variancePct: 13.6, status: "OPTIMAL" },
      { label: "RKAB Budget Burn", actual: "98.2", target: "100.0", unit: "%", variancePct: -1.8, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel: Neraca Produksi Batubara & Kepatuhan DMO (ESDM Standard)",
        columns: [
          { key: "item", label: "Uraian Parameter" },
          { key: "targetRkab", label: "Target RKAB 2026", align: "right" },
          { key: "realisasiMtd", label: "Realisasi MTD (Ags)", align: "right" },
          { key: "realisasiYtd", label: "Realisasi YTD 2026", align: "right" },
          { key: "progress", label: "Progress YTD (%)", align: "center" },
        ],
        rows: [
          { item: "Pengupasan Overburden (OB)", targetRkab: "5,800,000 BCM", realisasiMtd: "740,200 BCM", realisasiYtd: "3,820,000 BCM", progress: "65.86%" },
          { item: "Penggalian Batubara", targetRkab: "1,250,000 Ton", realisasiMtd: "161,200 Ton", realisasiYtd: "824,000 Ton", progress: "65.92%" },
          { item: "Pasokan DMO Dalam Negeri", targetRkab: "312,500 Ton", realisasiMtd: "45,800 Ton", realisasiYtd: "234,000 Ton", progress: "74.88%" },
          { item: "Penjualan Ekspor", targetRkab: "937,500 Ton", realisasiMtd: "115,400 Ton", realisasiYtd: "590,000 Ton", progress: "62.93%" },
          { item: "Rehabilitasi Reklamasi", targetRkab: "35.0 Hektar", realisasiMtd: "4.8 Hektar", realisasiYtd: "23.4 Hektar", progress: "66.85%" },
        ],
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Rian Hidayat, ST (Government Relations)",
      date: "16 Agustus 2026",
      qrHash: "MS-MTR-ESDM-20260816",
    },
  },

  // 5. HSE REPORT
  HSE_REPORT: {
    metadata: {
      id: "REP-HSE-20260816",
      type: "HSE_REPORT",
      title: "HSE & Mining Safety Performance Report",
      subtitle: "Kaidah Keselamatan Pertambangan & Pengelolaan Lingkungan Hidup (Kepmen ESDM 1827/2018)",
      periodLabel: "Kumulatif YTD per 16 Agustus 2026",
      generatedAt: "2026-08-16 18:38 WITA",
      generatedBy: "MINE SMART Safety AI Guard",
      siteName: "All Operational Areas Site Sangatta",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0 - Statutory Safety Record",
      documentNumber: "HSE/K3LH/KPC/2026/08/16",
    },
    aiExecutiveSummary: {
      highlights: [
        "Mencapai rekor 3,450,210 Safe Man-Hours LTI Free (Bebas Kecelakaan Tambang Berakibat Mati & Berat).",
        "Loss Time Injury Frequency Rate (LTIFR) = 0.00 & Severity Rate (SR) = 0.00.",
        "Tingkat kepatuhan APD (PPE Compliance) berdasarkan AI CCTV Vision Guard mencapai 98.4%.",
        "Kualitas air limbah Settling Pond SP-04 netral pH 7.2 dan TSS 42 mg/L (Baku Mutu PermenLH < 300 mg/L).",
      ],
      criticalAnomalies: [
        "1 kejadian Near Miss dilaporkan pada 12 Agustus: Truk HD-09 menyenggol safety berm setinggi 1.8m saat dumping malam hari (Tidak ada luka atau kerusakan alat).",
      ],
      actionItems: [
        "Tingkatkan penerangan tower lamp di Disposal West Dump untuk manuver dumping malam.",
        "Lakukan refresher training Fatigue Management bagi operator Shift 2.",
      ],
      geminiInsight:
        "Indeks keselamatan tambang berada pada kuadran Gold Safety Class. Zero finding mayor pada audit K3 terakhir.",
      confidenceScore: 99.8,
    },
    kpis: [
      { label: "Safe LTI Free Hours", actual: "3,450,210", target: "3,000,000", unit: "Hours", variancePct: 15.0, status: "OPTIMAL" },
      { label: "Lost Time Injury (LTI)", actual: "0", target: "0", unit: "Cases", variancePct: 0.0, status: "OPTIMAL" },
      { label: "PPE Vision Compliance", actual: "98.4", target: "95.0", unit: "%", variancePct: 3.58, status: "OPTIMAL" },
      { label: "Settling Pond Water pH", actual: "7.2", target: "6.0 - 9.0", unit: "pH", variancePct: 0.0, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel 1: Statistik Insiden K3 & Leading Indicators (Kepmen 1827 K/30/MEM/2018)",
        columns: [
          { key: "metric", label: "Parameter Keselamatan K3" },
          { key: "thisMonth", label: "Bulan Ini", align: "center" },
          { key: "ytd", label: "Kumulatif YTD 2026", align: "center" },
          { key: "target", label: "Target / Standar", align: "center" },
          { key: "status", label: "Status", align: "center" },
        ],
        rows: [
          { metric: "Fatal Accident (Meninggal Dunia)", thisMonth: "0", ytd: "0", target: "0 (Zero Fatal)", status: "COMPLIANT" },
          { metric: "Lost Time Injury (LTI - Cedera Berat)", thisMonth: "0", ytd: "0", target: "0", status: "COMPLIANT" },
          { metric: "Medical Treatment Case (Cedera Ringan)", thisMonth: "1", ytd: "3", target: "< 5", status: "COMPLIANT" },
          { metric: "Near Miss (Hampir Celaka)", thisMonth: "1", ytd: "6", target: "Report All", status: "RECORDED" },
          { metric: "Safety Hazard Card Submitted", thisMonth: "142", ytd: "1,120", target: "> 100/mo", status: "PROACTIVE" },
          { metric: "Inspeksi K3 & Fatality Prevention", thisMonth: "24", ytd: "184", target: "Weekly", status: "COMPLIANT" },
        ],
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Ahmad Rizky, SKM (K3LH Department Head)",
      date: "16 Agustus 2026",
      qrHash: "MS-HSE-SAFETY-20260816",
    },
  },

  // 6. MAINTENANCE REPORT
  MAINTENANCE_REPORT: {
    metadata: {
      id: "REP-MNT-20260816",
      type: "MAINTENANCE_REPORT",
      title: "Plant & Equipment Maintenance Performance",
      subtitle: "Ketersediaan Fisik Alat Berat (PA/MA/UA), MTBF, MTTR & Manajemen Suku Cadang",
      periodLabel: "Per 16 Agustus 2026 (Plant Department)",
      generatedAt: "2026-08-16 18:40 WITA",
      generatedBy: "MINE SMART Predictive Maintenance Engine",
      siteName: "Central Workshop Site Sangatta",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0",
      documentNumber: "MNT/PLANT/KPC/2026/08/16",
    },
    aiExecutiveSummary: {
      highlights: [
        "Physical Availability (PA) armada Shovel Excavator mencapai 91.2% (Target KPI 90.0%).",
        "Physical Availability (PA) armada Haul Truck HD785 mencapai 89.5% (Target KPI 88.0%).",
        "Mean Time Between Failures (MTBF) meningkat menjadi 124 jam (Perbaikan +14% dibanding bulan lalu).",
        "Mean Time to Repair (MTTR) berhasil ditekan ke 2.4 jam per breakdown.",
      ],
      criticalAnomalies: [
        "Excavator EX-03 menjalani perbaikan selang hidrolik darurat selama 35 menit di loading face (Sudah kembali beroperasi penuh).",
      ],
      actionItems: [
        "Jadwalkan PM 1000 Hours untuk Shovel EX-05 pada hari Selasa jam 08:00 WITA.",
        "Restock 4 set brake disc pad HD785 di Gudang Sentral.",
      ],
      geminiInsight:
        "Program Predictive Maintenance berbasis IoT sensor getaran berhasil mencegah 3 potensi breakdown fatal pada transmisi haul truck bulan ini.",
      confidenceScore: 98.4,
    },
    kpis: [
      { label: "Shovel Fleet PA", actual: "91.2", target: "90.0", unit: "%", variancePct: 1.33, status: "OPTIMAL" },
      { label: "Haul Truck Fleet PA", actual: "89.5", target: "88.0", unit: "%", variancePct: 1.70, status: "OPTIMAL" },
      { label: "Mean Time Between Failures (MTBF)", actual: "124.0", target: "110.0", unit: "Hours", variancePct: 12.7, status: "OPTIMAL" },
      { label: "Mean Time to Repair (MTTR)", actual: "2.40", target: "3.00", unit: "Hours", variancePct: -20.0, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel: Status Kesiapan Alat Berat Utama (Heavy Equipment Availability Ledger)",
        columns: [
          { key: "unitClass", label: "Equipment Class" },
          { key: "pop", label: "Populasi Unit", align: "center" },
          { key: "pa", label: "PA (%)", align: "center" },
          { key: "ma", label: "MA (%)", align: "center" },
          { key: "ua", label: "UA (%)", align: "center" },
          { key: "status", label: "Health Status", align: "center" },
        ],
        rows: [
          { unitClass: "Excavator Shovel (PC2000 / EX1900)", pop: "4 Unit", pa: "91.2%", ma: "94.5%", ua: "88.1%", status: "HEALTHY" },
          { unitClass: "Off-Highway Truck (HD785-7)", pop: "20 Unit", pa: "89.5%", ma: "92.8%", ua: "86.4%", status: "HEALTHY" },
          { unitClass: "Bulldozer Heavy (D375A / D275A)", pop: "8 Unit", pa: "92.4%", ma: "95.1%", ua: "84.2%", status: "OPTIMAL" },
          { unitClass: "Motor Grader (GD825A)", pop: "3 Unit", pa: "90.0%", ma: "93.0%", ua: "79.5%", status: "HEALTHY" },
          { unitClass: "Water Truck & Fuel Bowser", pop: "4 Unit", pa: "94.0%", ma: "96.5%", ua: "82.0%", status: "OPTIMAL" },
        ],
        totals: { unitClass: "TOTAL ARMADA UTAMA", pop: "39 Unit", pa: "90.8%", ma: "93.9%", ua: "85.8%", status: "OVERALL HEALTHY" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Agus Pratama, ST (Plant & Asset Manager)",
      date: "16 Agustus 2026",
      qrHash: "MS-MNT-PLANT-20260816",
    },
  },

  // 7. FLEET REPORT
  FLEET_REPORT: {
    metadata: {
      id: "REP-FLT-20260816",
      type: "FLEET_REPORT",
      title: "Fleet Performance & Dispatch Logistics Report",
      subtitle: "Analisis Match Factor, Cycle Time Hauling, Kecepatan Armada & Rasio Bahan Bakar",
      periodLabel: "16 Agustus 2026 (Live FMS Analytics)",
      generatedAt: "2026-08-16 18:42 WITA",
      generatedBy: "MINE SMART FMS Fleet Intelligence",
      siteName: "Site Sangatta Haul Roads & Pits",
      companyName: "PT KALIMANTAN PRIMA COAL MINING",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0",
      documentNumber: "FLT/FMS/KPC/2026/08/16",
    },
    aiExecutiveSummary: {
      highlights: [
        "Match Factor rata-rata armada muat-angkut berada di 0.94 (Keseimbangan optimal shovel-truck).",
        "Waktu siklus hauling rata-rata 23.4 menit (Target 24.0 menit), efisiensi ritase meningkat +2.5%.",
        "Kecepatan rata-rata bermuatan (loaded speed) di jalan datar 28.5 km/jam dan di tanjakan 14.2 km/jam.",
        "Konsumsi bahan bakar spesifik berada pada 1.82 Liter/BCM (Di bawah batas target 1.85 L/BCM).",
      ],
      criticalAnomalies: [],
      actionItems: [
        "Optimalisasi dynamic dispatching otomatis untuk membagi truk ke Crusher ROM saat terjadi antrean di West Dump.",
      ],
      geminiInsight:
        "Efisiensi rute hauling meningkat 4.2% berkat perawatan jalan dan pencegahan bottle-neck di simpang KM 4.",
      confidenceScore: 98.7,
    },
    kpis: [
      { label: "Fleet Match Factor", actual: "0.94", target: "0.95", unit: "Ratio", variancePct: -1.05, status: "OPTIMAL" },
      { label: "Avg Total Cycle Time", actual: "23.4", target: "24.0", unit: "Menit", variancePct: -2.5, status: "OPTIMAL" },
      { label: "Specific Fuel Ratio", actual: "1.82", target: "1.85", unit: "L/BCM", variancePct: -1.62, status: "OPTIMAL" },
      { label: "Dispatch Optimization Gain", actual: "+8.4", target: "+5.0", unit: "%", variancePct: 68.0, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel: Breakdown Komponen Waktu Siklus Haul Truck (Cycle Time Analysis)",
        columns: [
          { key: "phase", label: "Siklus Hauling Phase" },
          { key: "actualMin", label: "Actual (Menit)", align: "center" },
          { key: "targetMin", label: "Target (Menit)", align: "center" },
          { key: "variance", label: "Variance", align: "center" },
          { key: "efficiency", label: "Efficiency Rating", align: "center" },
        ],
        rows: [
          { phase: "1. Spot & Queue at Shovel", actualMin: "1.2 min", targetMin: "1.5 min", variance: "-0.3 min", efficiency: "EXCELLENT" },
          { phase: "2. Loading Time (PC2000 4-pass)", actualMin: "2.8 min", targetMin: "3.0 min", variance: "-0.2 min", efficiency: "EXCELLENT" },
          { phase: "3. Hauling Full (Pit to Dump 3.4km)", actualMin: "9.6 min", targetMin: "9.8 min", variance: "-0.2 min", efficiency: "OPTIMAL" },
          { phase: "4. Spot & Dump at Disposal", actualMin: "1.6 min", targetMin: "1.8 min", variance: "-0.2 min", efficiency: "OPTIMAL" },
          { phase: "5. Return Empty (Dump to Pit)", actualMin: "8.2 min", targetMin: "7.9 min", variance: "+0.3 min", efficiency: "ACCEPTABLE" },
        ],
        totals: { phase: "TOTAL HAULING CYCLE TIME", actualMin: "23.4 Menit", targetMin: "24.0 Menit", variance: "-0.6 Menit", efficiency: "102.5% TARGET" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Farhan Maulana (FMS Operations Lead)",
      date: "16 Agustus 2026",
      qrHash: "MS-FLT-FMS-20260816",
    },
  },

  // 8. MANAGEMENT REPORT
  MANAGEMENT_REPORT: {
    metadata: {
      id: "REP-MGT-20260816",
      type: "MANAGEMENT_REPORT",
      title: "Executive Management & C-Level Mining Dashboard",
      subtitle: "Ikhtisar Finansial Operasi, Cash Cost Unit ($/BCM), Margin EBITDA & Kinerja Strategis",
      periodLabel: "Agustus 2026 (Executive C-Level Edition)",
      generatedAt: "2026-08-16 18:45 WITA",
      generatedBy: "MINE SMART Strategic AI Advisor",
      siteName: "All Mining Concessions & Ports",
      companyName: "PT KALIMANTAN PRIMA COAL MINING GROUP",
      kttName: "Ir. Bambang Trihatmojo, IPM, CPI",
      approvalStatus: "APPROVED",
      version: "1.0 - Confidential Executive",
      documentNumber: "MGT/EXEC/KPC/2026/08/16",
    },
    aiExecutiveSummary: {
      highlights: [
        "Mining Unit Cash Cost tercatat $1.42 / BCM (Target $1.48 / BCM), menghasilkan efisiensi biaya sebesar $44,400 per hari.",
        "Total pendapatan kotor MTD Agustus mencapai $18.4 Juta USD dengan Margin EBITDA 34.2%.",
        "Kepatuhan kontrak pasokan batubara (Supply Agreement) ke PLTU Jawa-Bali tercapai 100% On-Time In-Full (OTIF).",
        "Rasio bahan bakar terendah dalam 3 kuartal terakhir berkat optimasi AI Dispatching dan pemantauan idle engine.",
      ],
      criticalAnomalies: [],
      actionItems: [
        "Lanjutkan program hedging harga solar industri untuk mengunci batas atas $0.88/Liter hingga Q4 2026.",
        "Review rencana pembukaan Pit 03 Expansion bersama Direksi Operasi pada rapat bulanan 25 Agustus.",
      ],
      geminiInsight:
        "Posisi keuangan dan operasional perusahaan sangat solid. Margin operasional melampaui rata-rata industri sebesar +4.8%.",
      confidenceScore: 99.6,
    },
    kpis: [
      { label: "Mining Cash Cost", actual: "$1.42", target: "$1.48", unit: "/BCM", variancePct: -4.05, status: "OPTIMAL" },
      { label: "EBITDA Margin", actual: "34.2", target: "32.0", unit: "%", variancePct: 6.87, status: "OPTIMAL" },
      { label: "Coal FOB Barging Cost", actual: "$38.50", target: "$41.00", unit: "/Ton", variancePct: -6.1, status: "OPTIMAL" },
      { label: "Customer Delivery OTIF", actual: "100.0", target: "98.0", unit: "%", variancePct: 2.04, status: "OPTIMAL" },
    ],
    tables: [
      {
        title: "Tabel: Ringkasan Finansial & Biaya Operasional Tambang (Executive Cost Breakdown)",
        columns: [
          { key: "costComponent", label: "Cost Component" },
          { key: "budget", label: "Budget ($/BCM)", align: "right" },
          { key: "actual", label: "Actual ($/BCM)", align: "right" },
          { key: "variance", label: "Variance", align: "center" },
          { key: "monthlyTotal", label: "Total MTD (USD)", align: "right" },
        ],
        rows: [
          { costComponent: "1. Drilling & Blasting", budget: "$0.22", actual: "$0.20", variance: "-$0.02 (Save)", monthlyTotal: "$148,040" },
          { costComponent: "2. Loading & Digging (Excavators)", budget: "$0.34", actual: "$0.32", variance: "-$0.02 (Save)", monthlyTotal: "$236,864" },
          { costComponent: "3. Hauling & Logistics (Trucks)", budget: "$0.52", actual: "$0.51", variance: "-$0.01 (Save)", monthlyTotal: "$377,502" },
          { costComponent: "4. Fuel & Lubricants", budget: "$0.28", actual: "$0.27", variance: "-$0.01 (Save)", monthlyTotal: "$199,854" },
          { costComponent: "5. Road, Pit Support & Drainage", budget: "$0.12", actual: "$0.12", variance: "$0.00", monthlyTotal: "$88,824" },
        ],
        totals: { costComponent: "TOTAL DIRECT MINING COST", budget: "$1.48 / BCM", actual: "$1.42 / BCM", variance: "-$0.06 / BCM", monthlyTotal: "$1,051,084 USD" },
      },
    ],
    complianceSignoff: {
      kttSignature: "Ir. Bambang Trihatmojo, IPM, CPI",
      mineSuperintendentSignature: "Drs. Hendra Gunawan, MBA (Chief Financial Officer)",
      date: "16 Agustus 2026",
      qrHash: "MS-MGT-EXEC-20260816",
    },
  },
};
