// MINE SMART AI - Digital Approval Engine Service
// 4-Stage Enterprise Workflow: Request → Approval → Execution → Verification
// Across 8 Core Mining Categories: Purchase | Maintenance | Overtime | Leave | Fuel | Work Order | Permit | Document

import {
  DigitalApprovalRequest,
  ApprovalCategory,
  ApprovalStage,
  ApprovalStatus,
  ApprovalUrgency,
  ApprovalSummaryMetrics,
  ApprovalStepApprover,
  ExecutionLog,
  VerificationDetails,
} from "../../types/approvalTypes";

const LOCAL_STORAGE_APPROVALS_KEY = "minesmart_digital_approvals_v2";

const INITIAL_APPROVAL_REQUESTS: DigitalApprovalRequest[] = [
  // 1. PURCHASE (Stage: APPROVAL - Tier 2 Pending)
  {
    id: "REQ-PUR-2026-0891",
    requestCode: "PR/MINING/2026/0891",
    category: "PURCHASE",
    title: "Pengadaan Main Hydraulic Cylinder Komatsu HD785-7 (Spare Critical)",
    description: "Pengadaan 2 set main hydraulic cylinder untuk perbaikan darurat unit HD-08 & HD-12 guna mencegah downtime hauling Pit 02 yang berpotensi menurunkan target produksi 8,000 MT/hari.",
    urgency: "HIGH",
    currentStage: "APPROVAL",
    status: "PENDING_APPROVAL",
    requesterId: "USR-MTC-042",
    requesterName: "Agus Pratama, S.T.",
    requesterRole: "Maintenance Planner Lead",
    requesterDept: "Plant & Heavy Equipment Maintenance",
    requestedAt: "Hari ini, 08:30 WIB",
    targetLocation: "Workshop Central Pit 02",
    relatedUnitId: "HD-08 & HD-12",
    costEstimateIdr: 485000000,
    costCenterCode: "CC-PLANT-5021",
    itemDetails: [
      { label: "Part Number", value: "707-01-0E420", highlight: true },
      { label: "Item Description", value: "Hydraulic Hoist Cylinder Assy" },
      { label: "Quantity", value: 2, unit: "Set" },
      { label: "Supplier Rekomendasi", value: "PT United Tractors Tbk" },
      { label: "Estimasi Biaya", value: "Rp 485.000.000", highlight: true },
      { label: "Sisa Budget CC", value: "Rp 1.420.000.000 (Cukup)" },
    ],
    slaHoursRemaining: 18,
    dueDate: "Besok, 12:00 WIB",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Plant Superintendent",
        assignedToName: "Bambang Sudibyo",
        assignedToEmail: "bambang.s@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Hari ini, 09:15 WIB",
        comments: "Disetujui. Part kritis untuk menjaga availability unit >88%.",
        digitalSignatureHash: "SIGN-SHA256-7FA89B0112CC984",
      },
      {
        tier: 2,
        roleTitle: "General Manager Mining Ops",
        assignedToName: "Ir. Hendra Gunawan, M.T.",
        assignedToEmail: "hendra.g@minesmart.id",
        status: "PENDING",
        comments: "Sedang dalam review ketersediaan Opex Q3.",
      },
      {
        tier: 3,
        roleTitle: "Finance & Procurement Director",
        assignedToName: "Dra. Siti Rahmawati, M.B.A.",
        assignedToEmail: "siti.r@minesmart.id",
        status: "PENDING",
      },
    ],
    currentPendingTier: 2,
    executionLogs: [],
    executionProgressPct: 0,
    assignedExecutor: "Procurement Supply Team (Aditya R.)",
    verification: {
      verificationStatus: "PENDING",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 98,
      budgetImpactSummary: "Sesuai alokasi Capex/Opex Plant Maintenance Q3. Price variance -3.2% vs baseline katalog.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Tidak ditemukan duplikasi PR 60 hari terakhir. Stok di warehouse saat ini 0 unit (Out of stock).",
    },
    digitalSignatureId: "DSIG-2026-PUR-8819A",
    tamperProofHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    auditTrail: [
      {
        timestamp: "Hari ini, 08:30 WIB",
        actor: "Agus Pratama",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan PR senilai Rp 485.000.000 dengan lampiran 3 penawaran vendor.",
      },
      {
        timestamp: "Hari ini, 09:15 WIB",
        actor: "Bambang Sudibyo (Plant Supt)",
        action: "TIER_1_APPROVED",
        stage: "APPROVAL",
        details: "Tanda tangan digital dibubuhkan via mobile app.",
      },
    ],
  },

  // 2. MAINTENANCE (Stage: EXECUTION - In Progress 75%)
  {
    id: "REQ-MTC-2026-0412",
    requestCode: "WO/HE/2026/0412",
    category: "MAINTENANCE",
    title: "Major Overhaul & Undercarriage Replacement Excavator EX-301",
    description: "Pekerjaan Overhaul 5.000 jam dan penggantian shoe link track undercarriage pada unit Hitachi EX1200-6 Pit 01 Seam A pasca inspeksi NDT menunjukkan keausan 82%.",
    urgency: "HIGH",
    currentStage: "EXECUTION",
    status: "IN_EXECUTION",
    requesterId: "USR-MTC-011",
    requesterName: "Rian Hidayat",
    requesterRole: "Mechanical Workshop Supervisor",
    requesterDept: "Plant Department",
    requestedAt: "Kemarin, 14:00 WIB",
    targetLocation: "Bay 03 Main Workshop",
    relatedUnitId: "EX-301",
    costEstimateIdr: 320000000,
    costCenterCode: "CC-MTC-301",
    itemDetails: [
      { label: "Tipe Alat", value: "Hitachi EX1200-6", highlight: true },
      { label: "HM Saat Ini", value: "14,892.4 Hours" },
      { label: "Job Scope", value: "Undercarriage & Final Drive Rebuild" },
      { label: "Target Selesai", value: "Hari ini, 18:00 WIB" },
      { label: "Work Order Ref", value: "WO-2026-0412-EX301", highlight: true },
    ],
    slaHoursRemaining: 4,
    dueDate: "Hari ini, 18:00 WIB",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Workshop Section Head",
        assignedToName: "Rudi Hartono",
        assignedToEmail: "rudi.h@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Kemarin, 14:30 WIB",
        comments: "Disetujui. Part sudah disiapkan di Bay 3.",
        digitalSignatureHash: "SIGN-SHA256-42901AFB",
      },
      {
        tier: 2,
        roleTitle: "KTT / Mine Head of Engineering",
        assignedToName: "Ir. Dedi Kusnadi, IPM",
        assignedToEmail: "dedi.k@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Kemarin, 15:10 WIB",
        comments: "Authorized. Prioritaskan uji kompresi pasca pasang.",
        digitalSignatureHash: "SIGN-SHA256-88301BDC",
      },
    ],
    currentPendingTier: 3,
    executionLogs: [
      {
        id: "LOG-01",
        timestamp: "Kemarin, 16:00 WIB",
        executorName: "Tim Mekanik A (5 Teknisi)",
        executorRole: "Heavy Equipment Mechanics",
        action: "Dismantle Track & Idler",
        notes: "Pelepasan track shoe lama dan pembersihan area sprocket.",
        progressPercentage: 35,
        referenceNumber: "WO-2026-0412",
      },
      {
        id: "LOG-02",
        timestamp: "Hari ini, 10:30 WIB",
        executorName: "Tim Mekanik A (5 Teknisi)",
        executorRole: "Heavy Equipment Mechanics",
        action: "Instalasi New Track Link & Roller",
        notes: "Pemasangan link baru selesai dengan torsi baut sesuai standar manual 850 Nm.",
        progressPercentage: 75,
        referenceNumber: "WO-2026-0412",
      },
    ],
    executionProgressPct: 75,
    assignedExecutor: "Team Mechanical Lead (Surya Danu)",
    verification: {
      verificationStatus: "PENDING",
      inspectorName: "Quality Inspector (Yudi K.)",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 95,
      budgetImpactSummary: "Komponen diambil dari buffer inventory gudang.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Estimasi waktu pengerjaan 16 jam sesuai standar OEM.",
    },
    digitalSignatureId: "DSIG-2026-MTC-0412B",
    tamperProofHash: "9f83c6833b707413a681816e0b745fc8e3089e6e83bed5ef0e19a14950544e23",
    auditTrail: [
      {
        timestamp: "Kemarin, 14:00 WIB",
        actor: "Rian Hidayat",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan WO maintenance terencana 5000 HM.",
      },
      {
        timestamp: "Kemarin, 15:10 WIB",
        actor: "Ir. Dedi Kusnadi",
        action: "APPROVAL_COMPLETED",
        stage: "APPROVAL",
        details: "Persetujuan final lengkap, diteruskan ke status EXECUTION.",
      },
      {
        timestamp: "Hari ini, 10:30 WIB",
        actor: "Surya Danu",
        action: "EXECUTION_UPDATE",
        stage: "EXECUTION",
        details: "Progress pengerjaan mencapai 75%.",
      },
    ],
  },

  // 3. OVERTIME (Stage: VERIFICATION - Close-out Sign Off)
  {
    id: "REQ-OVT-2026-0319",
    requestCode: "SPL/MINE-OPS/2026/0319",
    category: "OVERTIME",
    title: "Surat Perintah Lembur (SPL) Hauling Shift Malam Pit 02 Seam B",
    description: "Lembur 3 jam (20:00 - 23:00 WIB) untuk 12 operator hauler dan 2 checker guna mengejar ketertinggalan pengupasan overburden pasca hujan deras 4 jam siang hari.",
    urgency: "HIGH",
    currentStage: "VERIFICATION",
    status: "EXECUTION_COMPLETED",
    requesterId: "USR-OPS-088",
    requesterName: "Joko Susilo",
    requesterRole: "Pit Mining Supervisor",
    requesterDept: "Mining Operation",
    requestedAt: "Kemarin, 18:00 WIB",
    targetLocation: "Pit 02 Seam B & Disposal Area 01",
    relatedUnitId: "Fleet HD 1-12",
    costEstimateIdr: 18500000,
    costCenterCode: "CC-OPS-LEM-02",
    itemDetails: [
      { label: "Jumlah Personil", value: "14 Karyawan (12 Operator + 2 Checker)", highlight: true },
      { label: "Durasi Lembur", value: "3 Jam per orang (Total 42 Jam)" },
      { label: "Target Ritase", value: "68 Ritase Overburden (2,200 BCM)" },
      { label: "Catering Extra", value: "14 Porsi Snack & Suplemen Fit", highlight: true },
      { label: "Fatigue Check", value: "100% Fit to Work (Score < 3)" },
    ],
    slaHoursRemaining: 12,
    dueDate: "Hari ini, 12:00 WIB",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Pit Superintendent",
        assignedToName: "Gunawan Wicaksono",
        assignedToEmail: "gunawan.w@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Kemarin, 18:40 WIB",
        comments: "Disetujui. Pastikan fatigue monitoring per 1.5 jam.",
        digitalSignatureHash: "SIGN-SHA256-OVT-11A",
      },
      {
        tier: 2,
        roleTitle: "HR & Industrial Relations Head",
        assignedToName: "Sri Wahyuni, S.Psi.",
        assignedToEmail: "sri.w@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Kemarin, 19:15 WIB",
        comments: "Sesuai ketentuan Kepmen ESDM 1827/2018 (Max 4 jam lembur/hari).",
        digitalSignatureHash: "SIGN-SHA256-OVT-22B",
      },
    ],
    currentPendingTier: 3,
    executionLogs: [
      {
        id: "LOG-OVT-01",
        timestamp: "Kemarin, 20:00 WIB",
        executorName: "Joko Susilo",
        executorRole: "Pit Supervisor",
        action: "Commence Overtime Shift",
        notes: "14 personil hadir, safety briefing dan cek tekanan darah selesai.",
        progressPercentage: 20,
      },
      {
        id: "LOG-OVT-02",
        timestamp: "Kemarin, 23:15 WIB",
        executorName: "Joko Susilo",
        executorRole: "Pit Supervisor",
        action: "Finish Overtime Execution",
        notes: "Lembur selesai jam 23:00 WIB. Realisasi 72 ritase (Melebihi target 68 ritase). Zero incident.",
        progressPercentage: 100,
        referenceNumber: "SPL-DONE-0319",
      },
    ],
    executionProgressPct: 100,
    assignedExecutor: "Pit 02 Shift Night Ops",
    verification: {
      verificationStatus: "PASSED",
      inspectorName: "HSE Safety Officer (Bayu S.) & HR Payroll (Fanny L.)",
      inspectorRole: "Safety & Payroll Verification",
      inspectionTimestamp: "Hari ini, 07:30 WIB",
      checklistScorePct: 100,
      findings: "Absensi sidik jari lengkap, jam lembur valid, tidak ada temuan pelanggaran K3.",
      digitalSignCertHash: "CERT-VERIF-OVT-9921AA",
      qrVerificationCode: "QR-MSMART-OVT-2026-0319-VERIFIED",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 100,
      budgetImpactSummary: "Total premi lembur Rp 18.500.000 dalam budget bulanan.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Rasio produktivitas ritase lembur 105.8% dari target.",
    },
    digitalSignatureId: "DSIG-2026-OVT-0319C",
    tamperProofHash: "5d41402abc4b2a76b9719d911017c592b027170a498083818610582845c4794e",
    auditTrail: [
      {
        timestamp: "Kemarin, 18:00 WIB",
        actor: "Joko Susilo",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan SPL untuk 14 personil Pit 02.",
      },
      {
        timestamp: "Kemarin, 19:15 WIB",
        actor: "Sri Wahyuni",
        action: "APPROVAL_COMPLETED",
        stage: "APPROVAL",
        details: "Persetujuan HR lengkap, eksekusi lembur dimulai.",
      },
      {
        timestamp: "Hari ini, 07:30 WIB",
        actor: "Bayu S. & Fanny L.",
        action: "VERIFIED_COMPLETED",
        stage: "VERIFICATION",
        details: "Verifikasi payroll & safety K3 berhasil diverifikasi 100%.",
      },
    ],
  },

  // 4. LEAVE (Stage: REQUEST - Fresh Draft / Pending Submission Review)
  {
    id: "REQ-LEV-2026-0155",
    requestCode: "CUTI/ROSTER/2026/0155",
    category: "LEAVE",
    title: "Permohonan Cuti Roster Periodik (6 Minggu Kerja : 2 Minggu Libur)",
    description: "Permohonan cuti roster periodik untuk Periode 24 Agustus - 07 September 2026. Handover pekerjaan shift hauling telah ditugaskan kepada Operator Cadangan (Eko Prasetyo).",
    urgency: "NORMAL",
    currentStage: "REQUEST",
    status: "PENDING_APPROVAL",
    requesterId: "USR-OPR-912",
    requesterName: "Hendra Setiawan",
    requesterRole: "Senior Heavy Hauler Operator (SIMPER HD-785)",
    requesterDept: "Mining Production - Hauling Fleet",
    requestedAt: "Hari ini, 06:45 WIB",
    targetLocation: "Mess Karyawan Site A",
    costEstimateIdr: 3500000, // Travel allowance ticket
    costCenterCode: "CC-HR-TRAVEL-SITE",
    itemDetails: [
      { label: "Tipe Cuti", value: "Cuti Roster Lapangan (6:2)", highlight: true },
      { label: "Tanggal Mulai", value: "24 Agustus 2026" },
      { label: "Tanggal Selesai", value: "07 September 2026 (14 Hari Kalender)" },
      { label: "Tunjangan Tiket", value: "Balikpapan (BPN) ⇄ Surabaya (SUB)", highlight: true },
      { label: "Handover Pengganti", value: "Eko Prasetyo (NIK: 881920) - Fit", highlight: true },
      { label: "Sisa Hak Cuti", value: "14 Hari Roster + 6 Hari Cuti Tahunan" },
    ],
    slaHoursRemaining: 48,
    dueDate: "20 Agustus 2026",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Hauling Foreman / Supervisor",
        assignedToName: "Darmawan Santoso",
        assignedToEmail: "darmawan.s@minesmart.id",
        status: "PENDING",
        comments: "Menunggu konfirmasi shift roster pengganti.",
      },
      {
        tier: 2,
        roleTitle: "HR Site Superintendent",
        assignedToName: "Sri Wahyuni, S.Psi.",
        assignedToEmail: "sri.w@minesmart.id",
        status: "PENDING",
      },
    ],
    currentPendingTier: 1,
    executionLogs: [],
    executionProgressPct: 0,
    assignedExecutor: "HR Ticketing & Camp Admin",
    verification: {
      verificationStatus: "PENDING",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 100,
      budgetImpactSummary: "Tiket pesawat dalam batas standar plafon perusahaan.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Karyawan telah memenuhi masa kerja 6 minggu non-stop (42 hari on-site). Roster valid.",
    },
    digitalSignatureId: "DSIG-2026-LEV-0155A",
    tamperProofHash: "6a894a8f9d0c2e3f1b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
    auditTrail: [
      {
        timestamp: "Hari ini, 06:45 WIB",
        actor: "Hendra Setiawan",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Form permohonan cuti roster 6:2 diajukan via Mobile App.",
      },
    ],
  },

  // 5. FUEL (Stage: APPROVAL - Tier 1 Approved, Tier 2 Pending)
  {
    id: "REQ-FUL-2026-0504",
    requestCode: "FUEL/REQ/2026/0504",
    category: "FUEL",
    title: "Otorisasi Extra Fuel Quota 4,500 Liter Genset & Crusher Unit 02",
    description: "Permintaan penambahan alokasi solar HSD B35 industri sebesar 4,500 Liter untuk operasional 24 jam primary coal crusher 02 pasca peningkatan target *blending & barging schedule* tongkang MV Coal Star.",
    urgency: "HIGH",
    currentStage: "APPROVAL",
    status: "PENDING_APPROVAL",
    requesterId: "USR-CRU-007",
    requesterName: "Budi Santoso, S.T.",
    requesterRole: "Coal Processing Plant Supervisor",
    requesterDept: "Processing Plant & Stockpile",
    requestedAt: "Hari ini, 09:00 WIB",
    targetLocation: "ROM Stockpile Crusher Plant 02",
    costEstimateIdr: 72000000,
    costCenterCode: "CC-FUEL-CPP-02",
    itemDetails: [
      { label: "Jenis Bahan Bakar", value: "HSD Solar B35 Industri", highlight: true },
      { label: "Volume Diminta", value: "4,500 Liter", highlight: true },
      { label: "Target Konsumsi", value: "Genset Cummins 1500 kVA & Crusher Motor" },
      { label: "Bowser Delivery", value: "Fuel Bowser FT-03 (Driver: Suparman)" },
      { label: "Sisa Kuota Harian", value: "1,200 Liter (Diperlukan Penambahan)" },
    ],
    slaHoursRemaining: 6,
    dueDate: "Hari ini, 15:00 WIB",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Fuel & Logistic Section Head",
        assignedToName: "Kurniawan Putra",
        assignedToEmail: "kurniawan.p@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Hari ini, 09:40 WIB",
        comments: "Disetujui. Stok di Main Fuel Tank 01 mencukupi (420.000 L).",
        digitalSignatureHash: "SIGN-SHA256-FUL-01A",
      },
      {
        tier: 2,
        roleTitle: "Mine Operational Manager",
        assignedToName: "Ir. Hendra Gunawan, M.T.",
        assignedToEmail: "hendra.g@minesmart.id",
        status: "PENDING",
        comments: "Menunggu verifikasi target tonase crusher hari ini.",
      },
    ],
    currentPendingTier: 2,
    executionLogs: [],
    executionProgressPct: 0,
    assignedExecutor: "Fuel Bowser FT-03 Operator",
    verification: {
      verificationStatus: "PENDING",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 96,
      budgetImpactSummary: "Konsumsi spesifik solar crusher: 0.72 L/ton batubara (Benchmark normal: 0.68 - 0.78 L/ton).",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Peningkatan permintaan sejalan dengan order barging 35.000 MT batubara seam B.",
    },
    digitalSignatureId: "DSIG-2026-FUL-0504A",
    tamperProofHash: "1b4e28ba4e41e7b670000d1b068ecd9a94ec3736492e29e939386b51307a4417",
    auditTrail: [
      {
        timestamp: "Hari ini, 09:00 WIB",
        actor: "Budi Santoso",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan extra fuel 4,500 L untuk crusher unit 02.",
      },
      {
        timestamp: "Hari ini, 09:40 WIB",
        actor: "Kurniawan Putra",
        action: "TIER_1_APPROVED",
        stage: "APPROVAL",
        details: "Verifikasi stok tangki induk lolos.",
      },
    ],
  },

  // 6. WORK ORDER (Stage: EXECUTION - Blasting Preparation 50%)
  {
    id: "REQ-WO-2026-0771",
    requestCode: "WO/BLAST/2026/0771",
    category: "WORK_ORDER",
    title: "Surat Perintah Kerja (SPK) Peledakan Overburden Pit 01 Seam A",
    description: "Eksekusi peledakan 120 lubang ledak (Pattern 7x8m, kedalaman 9m) menggunakan ANFO 4.8 Ton dan Booster Pentolite untuk fragmentasi batuan penutup 42,000 BCM.",
    urgency: "URGENT_EMERGENCY",
    currentStage: "EXECUTION",
    status: "IN_EXECUTION",
    requesterId: "USR-BLS-003",
    requesterName: "Fajar Nugroho, S.T. (KJL II)",
    requesterRole: "Blasting Engineer / Juru Ledak Kelas II",
    requesterDept: "Drill & Blast Engineering",
    requestedAt: "Hari ini, 06:00 WIB",
    targetLocation: "Pit 01 Bench 45 Seam A",
    costEstimateIdr: 145000000,
    costCenterCode: "CC-DNB-PIT01",
    itemDetails: [
      { label: "Jumlah Lubang Ledak", value: "120 Holes (Depth 9.0m)", highlight: true },
      { label: "Bahan Peledak (ANFO)", value: "4,800 kg (4.8 Ton)" },
      { label: "Inisiasi Delay", value: "Nonel Dual Delay (25ms surface / 500ms in-hole)" },
      { label: "Waktu Ledak Rencana", value: "Hari ini, 12:30 WIB (Break Shift)" },
      { label: "Radius Evakuasi", value: "500 Meter Clear Area (Wajib)", highlight: true },
    ],
    slaHoursRemaining: 2,
    dueDate: "Hari ini, 13:00 WIB",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "HSE & Mining Safety Superintendent",
        assignedToName: "Kapt. (Purn) Wahyu Pratama",
        assignedToEmail: "wahyu.p@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Hari ini, 07:00 WIB",
        comments: "Approved. Sirene peringatan wajib 3x tiupan sesuai SOP.",
        digitalSignatureHash: "SIGN-SHA256-BLS-HSE",
      },
      {
        tier: 2,
        roleTitle: "Kepala Teknik Tambang (KTT)",
        assignedToName: "Ir. Dedi Kusnadi, IPM",
        assignedToEmail: "dedi.k@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Hari ini, 07:45 WIB",
        comments: "Izin peledakan resmi diterbitkan. Lakukan sweeping radius 500m.",
        digitalSignatureHash: "SIGN-SHA256-BLS-KTT",
      },
    ],
    currentPendingTier: 3,
    executionLogs: [
      {
        id: "LOG-BLS-01",
        timestamp: "Hari ini, 08:30 WIB",
        executorName: "Crew Blasting (8 Juru Ledak)",
        executorRole: "Certified Blasting Crew",
        action: "Stemming & Priming Lubang",
        notes: "Pengisian ANFO 4.8 ton selesai, pemasangan detonator nonel 120 titik.",
        progressPercentage: 50,
        referenceNumber: "BLAST-PERMIT-0771",
      },
    ],
    executionProgressPct: 50,
    assignedExecutor: "Chief Blaster Fajar Nugroho (KJL II)",
    verification: {
      verificationStatus: "PENDING",
      inspectorName: "Inspektur Tambang & K3",
    },
    aiEvaluation: {
      riskLevel: "HIGH",
      complianceScorePct: 100,
      budgetImpactSummary: "Bahan peledak diambil dari Gudang Handak Resmi Site A.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Simulasi getaran tanah (Ground Vibration Peak Particle Velocity < 2.0 mm/s) aman untuk infrastruktur terdekat.",
    },
    digitalSignatureId: "DSIG-2026-WO-0771A",
    tamperProofHash: "2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9bb95b73e5db70c945",
    auditTrail: [
      {
        timestamp: "Hari ini, 06:00 WIB",
        actor: "Fajar Nugroho",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan izin peledakan 120 lubang Pit 01.",
      },
      {
        timestamp: "Hari ini, 07:45 WIB",
        actor: "Ir. Dedi Kusnadi (KTT)",
        action: "APPROVAL_COMPLETED",
        stage: "APPROVAL",
        details: "Persetujuan KTT diterbitkan, blasting crew memulai charging.",
      },
    ],
  },

  // 7. PERMIT (Stage: VERIFICATION - Verified Passed)
  {
    id: "REQ-PER-2026-0912",
    requestCode: "SIMPER/HE/2026/0912",
    category: "PERMIT",
    title: "Penerbitan Surat Izin Mengemudi Perusahaan (SIMPER) Alat Berat HD & Dozer",
    description: "Permohonan SIMPER Baru untuk Karyawan Operator: Ahmad Fauzi (NIK: 2026-0491) untuk unit Haul Truck Komatsu HD785-7 dan Bulldozer Komatsu D375A pasca kelulusan Uji Praktik Simulator & Medex.",
    urgency: "NORMAL",
    currentStage: "VERIFICATION",
    status: "VERIFIED_COMPLETED",
    requesterId: "USR-TRN-005",
    requesterName: "Doni Kurnia",
    requesterRole: "Trainer & Driving Assessor",
    requesterDept: "Learning & Development - Training Center",
    requestedAt: "3 hari yang lalu",
    targetLocation: "Safety Training Center & Pit Driving Test Ground",
    costEstimateIdr: 0,
    itemDetails: [
      { label: "Nama Operator", value: "Ahmad Fauzi (NIK: 2026-0491)", highlight: true },
      { label: "Jenis Alat Berlisensi", value: "HD785-7 (Hauler) & D375A (Dozer)" },
      { label: "Hasil Uji Teori K3", value: "Score: 94 / 100 (Lulus)" },
      { label: "Hasil Uji Praktik", value: "Score: 92 / 100 (Competent)" },
      { label: "Medical Checkup", value: "Fit to Work (Class 1 - No Restriction)", highlight: true },
      { label: "Masa Berlaku", value: "1 Tahun (Hingga 16 Agustus 2027)" },
    ],
    slaHoursRemaining: 0,
    dueDate: "Kemarin",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Senior Driving Assessor",
        assignedToName: "Doni Kurnia",
        assignedToEmail: "doni.k@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "2 hari yang lalu",
        comments: "Lulus uji reaksi refleks dan driving ramp maneuver.",
        digitalSignatureHash: "SIGN-SHA256-PER-01",
      },
      {
        tier: 2,
        roleTitle: "KTT / Mine Head of Safety",
        assignedToName: "Ir. Dedi Kusnadi, IPM",
        assignedToEmail: "dedi.k@minesmart.id",
        status: "APPROVED",
        actionTimestamp: "Kemarin, 10:00 WIB",
        comments: "SIMPER Resmi Disahkan sesuai Kepmen ESDM 1827/2018.",
        digitalSignatureHash: "SIGN-SHA256-PER-02",
      },
    ],
    currentPendingTier: 3,
    executionLogs: [
      {
        id: "LOG-PER-01",
        timestamp: "Kemarin, 14:00 WIB",
        executorName: "HSE Admin ID Card",
        executorRole: "Safety Badge Issuer",
        action: "Cetak Fisik & Aktivasi NFC RFID SIMPER",
        notes: "Kartu SIMPER fisik dengan chip RFID NFC telah dicetak dan diprogram akses barrier gate Pit 01 & Pit 02.",
        progressPercentage: 100,
        referenceNumber: "SIMPER-CARD-0912",
      },
    ],
    executionProgressPct: 100,
    assignedExecutor: "HSE Safety Administration",
    verification: {
      verificationStatus: "PASSED",
      inspectorName: "Kapt. (Purn) Wahyu Pratama",
      inspectorRole: "Mine Safety Superintendent",
      inspectionTimestamp: "Kemarin, 16:30 WIB",
      checklistScorePct: 100,
      findings: "Pemeriksaan NFC reader gerbang pit dan validasi barcode SIMPER berhasil.",
      digitalSignCertHash: "CERT-SIMPER-LEGAL-2026-0912",
      qrVerificationCode: "QR-SIMPER-2026-AHMAD-FAUZI-HD785",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 100,
      budgetImpactSummary: "Biaya internal L&D training center.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Data sertifikat kompetensi BNSP Operator Alat Berat terverifikasi valid.",
    },
    digitalSignatureId: "DSIG-2026-PER-0912A",
    tamperProofHash: "4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2",
    auditTrail: [
      {
        timestamp: "3 hari yang lalu",
        actor: "Doni Kurnia",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Pengajuan SIMPER baru pasca kelulusan training.",
      },
      {
        timestamp: "Kemarin, 10:00 WIB",
        actor: "Ir. Dedi Kusnadi (KTT)",
        action: "APPROVAL_COMPLETED",
        stage: "APPROVAL",
        details: "Pengesahan resmi izin mengemudi alat berat tambang.",
      },
      {
        timestamp: "Kemarin, 16:30 WIB",
        actor: "Wahyu Pratama (HSE)",
        action: "VERIFIED_COMPLETED",
        stage: "VERIFICATION",
        details: "Kartu SIMPER aktif dan terdaftar di database CAN-Bus dispatch.",
      },
    ],
  },

  // 8. DOCUMENT (Stage: APPROVAL - Tier 1 Pending)
  {
    id: "REQ-DOC-2026-0103",
    requestCode: "SOP/ENG/2026/0103",
    category: "DOCUMENT",
    title: "Pembaruan Standar Operasional Prosedur (SOP) Penambangan Lereng Highwall Curam",
    description: "Revisi SOP-MINE-042 rev 4.0 terkait batas toleransi slope stability prism sensor radar (SSR) dan zona aman manuver excavator saat penggalian dekat lereng batuan tinggi (>45 meter).",
    urgency: "HIGH",
    currentStage: "APPROVAL",
    status: "PENDING_APPROVAL",
    requesterId: "USR-GEO-002",
    requesterName: "Dr. Tri Nugroho, S.T., M.Eng.",
    requesterRole: "Senior Geotechnical Engineer",
    requesterDept: "Geology & Geotechnical Engineering",
    requestedAt: "Hari ini, 10:15 WIB",
    targetLocation: "Pit 01 & Pit 02 Slope Area",
    costEstimateIdr: 0,
    itemDetails: [
      { label: "Kode Dokumen", value: "SOP-MINE-042-REV-04", highlight: true },
      { label: "Tipe Dokumen", value: "Mandatory Operational Safety SOP" },
      { label: "Batas Displacement", value: "Radar Alarm Trigger: > 5.0 mm/jam", highlight: true },
      { label: "Zona Aman Alat", value: "Minimum 1.5x Tinggi Jenjang (Safety Berm 6m)" },
      { label: "Target Distribusi", value: "Seluruh Pengawas Pit, Juru Ukur & KTT" },
    ],
    slaHoursRemaining: 72,
    dueDate: "19 Agustus 2026",
    isSlaBreached: false,
    approvalMatrix: [
      {
        tier: 1,
        roleTitle: "Engineering & Technical Services Manager",
        assignedToName: "Ir. Bagus Setyawan, M.T.",
        assignedToEmail: "bagus.s@minesmart.id",
        status: "PENDING",
        comments: "Sedang me-review kalkulasi Factor of Safety (FoS > 1.30).",
      },
      {
        tier: 2,
        roleTitle: "Kepala Teknik Tambang (KTT)",
        assignedToName: "Ir. Dedi Kusnadi, IPM",
        assignedToEmail: "dedi.k@minesmart.id",
        status: "PENDING",
      },
    ],
    currentPendingTier: 1,
    executionLogs: [],
    executionProgressPct: 0,
    assignedExecutor: "Document Control & Engineering",
    verification: {
      verificationStatus: "PENDING",
    },
    aiEvaluation: {
      riskLevel: "LOW",
      complianceScorePct: 100,
      budgetImpactSummary: "Tidak memerlukan anggaran langsung.",
      anomalyDetected: false,
      recommendation: "AUTO_RECOMMEND_APPROVE",
      aiNote: "Revisi selaras dengan edaran Ditjen Minerba ESDM terkait mitigasi longsor tambang terbuka.",
    },
    digitalSignatureId: "DSIG-2026-DOC-0103A",
    tamperProofHash: "3f79bb7b435b05321651daefd374cd681b49172d3fc5d631fa514e7b773603f9",
    auditTrail: [
      {
        timestamp: "Hari ini, 10:15 WIB",
        actor: "Dr. Tri Nugroho",
        action: "REQUEST_SUBMITTED",
        stage: "REQUEST",
        details: "Draft SOP Slope Stability diajukan ke document control.",
      },
    ],
  },
];

export class DigitalApprovalService {
  public static getRequests(): DigitalApprovalRequest[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_APPROVALS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load digital approvals from storage:", e);
    }
    return INITIAL_APPROVAL_REQUESTS;
  }

  public static saveRequests(requests: DigitalApprovalRequest[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_APPROVALS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.warn("Failed to save digital approvals:", e);
    }
  }

  public static getSummaryMetrics(requests: DigitalApprovalRequest[]): ApprovalSummaryMetrics {
    const categoryCounts: Record<ApprovalCategory, number> = {
      PURCHASE: 0,
      MAINTENANCE: 0,
      OVERTIME: 0,
      LEAVE: 0,
      FUEL: 0,
      WORK_ORDER: 0,
      PERMIT: 0,
      DOCUMENT: 0,
    };

    const stageCounts: Record<ApprovalStage, number> = {
      REQUEST: 0,
      APPROVAL: 0,
      EXECUTION: 0,
      VERIFICATION: 0,
    };

    let pendingMyApprovalCount = 0;
    let inExecutionCount = 0;
    let inVerificationCount = 0;
    let completedThisMonth = 0;

    requests.forEach((req) => {
      if (categoryCounts[req.category] !== undefined) {
        categoryCounts[req.category]++;
      }
      if (stageCounts[req.currentStage] !== undefined) {
        stageCounts[req.currentStage]++;
      }

      if (req.currentStage === "APPROVAL" && req.status === "PENDING_APPROVAL") {
        pendingMyApprovalCount++;
      }
      if (req.currentStage === "EXECUTION") {
        inExecutionCount++;
      }
      if (req.currentStage === "VERIFICATION" && req.status !== "VERIFIED_COMPLETED") {
        inVerificationCount++;
      }
      if (req.status === "VERIFIED_COMPLETED") {
        completedThisMonth++;
      }
    });

    return {
      totalRequests: requests.length,
      pendingMyApprovalCount,
      inExecutionCount,
      inVerificationCount,
      completedThisMonth,
      slaComplianceRatePct: 98.4,
      categoryCounts,
      stageCounts,
    };
  }

  // Submit New Request (Stage 1: REQUEST -> Stage 2: APPROVAL)
  public static submitNewRequest(
    newReq: Omit<DigitalApprovalRequest, "id" | "requestCode" | "tamperProofHash" | "auditTrail" | "currentStage" | "status" | "executionLogs" | "executionProgressPct" | "verification">
  ): DigitalApprovalRequest {
    const list = this.getRequests();
    const id = `REQ-${newReq.category.substring(0, 3)}-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const code = `${newReq.category.substring(0, 3)}/SITE/2026/${String(Math.floor(1000 + Math.random() * 9000))}`;

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    const request: DigitalApprovalRequest = {
      ...newReq,
      id,
      requestCode: code,
      currentStage: "APPROVAL",
      status: "PENDING_APPROVAL",
      executionLogs: [],
      executionProgressPct: 0,
      verification: {
        verificationStatus: "PENDING",
      },
      tamperProofHash: `hash-${Math.random().toString(36).substring(2)}${Date.now()}`,
      auditTrail: [
        {
          timestamp: `Hari ini, ${timestamp}`,
          actor: newReq.requesterName,
          action: "REQUEST_CREATED",
          stage: "REQUEST",
          details: `Permohonan baru '${newReq.title}' diajukan ke Approval Matrix.`,
        },
      ],
    };

    const updated = [request, ...list];
    this.saveRequests(updated);
    return request;
  }

  // Approve a Tier in Matrix
  public static approveTier(
    requestId: string,
    tierIndex: number,
    approverName: string,
    comments?: string
  ): { success: boolean; request?: DigitalApprovalRequest; message: string } {
    const list = this.getRequests();
    const target = list.find((r) => r.id === requestId);
    if (!target) return { success: false, message: "Request tidak ditemukan" };

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const sigHash = `SIGN-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const updatedMatrix = target.approvalMatrix.map((step, idx) => {
      if (idx === tierIndex) {
        return {
          ...step,
          status: "APPROVED" as const,
          actionTimestamp: `Hari ini, ${timestamp}`,
          comments: comments || "Disetujui melalui Portal Digital Approval.",
          digitalSignatureHash: sigHash,
        };
      }
      return step;
    });

    const isAllApproved = updatedMatrix.every((s) => s.status === "APPROVED");
    const nextPendingTier = updatedMatrix.findIndex((s) => s.status === "PENDING") + 1;

    let nextStage: ApprovalStage = target.currentStage;
    let nextStatus: ApprovalStatus = target.status;
    let auditNote = `Tier ${tierIndex + 1} (${target.approvalMatrix[tierIndex]?.roleTitle}) disetujui oleh ${approverName}.`;

    if (isAllApproved) {
      nextStage = "EXECUTION";
      nextStatus = "IN_EXECUTION";
      auditNote = `Seluruh Tier (${updatedMatrix.length} level) telah disetujui. Workflow berpindah ke tahap EXECUTION.`;
    }

    const updatedRequest: DigitalApprovalRequest = {
      ...target,
      approvalMatrix: updatedMatrix,
      currentPendingTier: nextPendingTier > 0 ? nextPendingTier : target.approvalMatrix.length + 1,
      currentStage: nextStage,
      status: nextStatus,
      auditTrail: [
        {
          timestamp: `Hari ini, ${timestamp}`,
          actor: approverName,
          action: isAllApproved ? "ALL_APPROVALS_COMPLETED" : `TIER_${tierIndex + 1}_APPROVED`,
          stage: isAllApproved ? "EXECUTION" : "APPROVAL",
          details: auditNote,
          where: target.targetLocation || "Central Operations Office",
          before: `Stage: ${target.currentStage} (Tier ${tierIndex + 1} Pending)`,
          after: isAllApproved ? "Stage: EXECUTION (Approved)" : `Stage: APPROVAL (Tier ${nextPendingTier} Pending)`,
          diffDelta: isAllApproved ? "PENDING → APPROVED (All Tiers)" : `TIER ${tierIndex + 1} APPROVED`,
        },
        ...target.auditTrail,
      ],
    };

    const final = list.map((r) => (r.id === requestId ? updatedRequest : r));
    this.saveRequests(final);
    return {
      success: true,
      request: updatedRequest,
      message: isAllApproved
        ? `✅ Persetujuan tuntas! Permohonan ${target.requestCode} kini memasuki tahap EKSEKUSI.`
        : `✅ Berhasil menandatangani Tier ${tierIndex + 1} (${target.requestCode}).`,
    };
  }

  // Reject / Revision Request
  public static rejectRequest(
    requestId: string,
    tierIndex: number,
    approverName: string,
    reason: string
  ): DigitalApprovalRequest | null {
    const list = this.getRequests();
    const target = list.find((r) => r.id === requestId);
    if (!target) return null;

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    const updatedMatrix = target.approvalMatrix.map((step, idx) => {
      if (idx === tierIndex) {
        return {
          ...step,
          status: "REJECTED" as const,
          actionTimestamp: `Hari ini, ${timestamp}`,
          comments: reason || "Ditolak oleh approver.",
        };
      }
      return step;
    });

    const updatedRequest: DigitalApprovalRequest = {
      ...target,
      approvalMatrix: updatedMatrix,
      status: "REJECTED",
      auditTrail: [
        {
          timestamp: `Hari ini, ${timestamp}`,
          actor: approverName,
          action: `TIER_${tierIndex + 1}_REJECTED`,
          stage: "APPROVAL",
          details: `Permohonan ditolak pada Tier ${tierIndex + 1}. Alasan: ${reason}`,
          where: target.targetLocation || "Operations Review Hub",
          before: `Status: ${target.status}`,
          after: "Status: REJECTED",
          diffDelta: "PENDING → REJECTED",
        },
        ...target.auditTrail,
      ],
    };

    const final = list.map((r) => (r.id === requestId ? updatedRequest : r));
    this.saveRequests(final);
    return updatedRequest;
  }

  // Add Execution Log & Progress
  public static logExecutionProgress(
    requestId: string,
    log: Omit<ExecutionLog, "id" | "timestamp">
  ): DigitalApprovalRequest | null {
    const list = this.getRequests();
    const target = list.find((r) => r.id === requestId);
    if (!target) return null;

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const newLog: ExecutionLog = {
      ...log,
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: `Hari ini, ${timestamp}`,
    };

    const isFinished = log.progressPercentage >= 100;
    const nextStage: ApprovalStage = isFinished ? "VERIFICATION" : "EXECUTION";
    const nextStatus: ApprovalStatus = isFinished ? "EXECUTION_COMPLETED" : "IN_EXECUTION";

    const updated: DigitalApprovalRequest = {
      ...target,
      currentStage: nextStage,
      status: nextStatus,
      executionProgressPct: log.progressPercentage,
      executionLogs: [newLog, ...target.executionLogs],
      auditTrail: [
        {
          timestamp: `Hari ini, ${timestamp}`,
          actor: log.executorName,
          action: isFinished ? "EXECUTION_COMPLETED" : "EXECUTION_LOGGED",
          stage: nextStage,
          details: `Eksekusi: ${log.action} (${log.progressPercentage}%). ${isFinished ? "Memasuki tahap VERIFIKASI." : ""}`,
          where: target.targetLocation || "Site Work Area",
          before: `Progress: ${target.executionProgressPct}%`,
          after: `Progress: ${log.progressPercentage}% (${isFinished ? "Completed" : "In Progress"})`,
          diffDelta: `+${log.progressPercentage - target.executionProgressPct}% Progress`,
        },
        ...target.auditTrail,
      ],
    };

    const final = list.map((r) => (r.id === requestId ? updated : r));
    this.saveRequests(final);
    return updated;
  }

  // Complete Stage 4: Verification
  public static verifyAndClose(
    requestId: string,
    verification: {
      inspectorName: string;
      inspectorRole: string;
      checklistScorePct: number;
      findings: string;
      status: "PASSED" | "PASSED_WITH_NOTE" | "FAILED";
    }
  ): DigitalApprovalRequest | null {
    const list = this.getRequests();
    const target = list.find((r) => r.id === requestId);
    if (!target) return null;

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const certHash = `CERT-VERIF-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now()}`;
    const qrCode = `QR-MSMART-${target.requestCode.replace(/\//g, "-")}-VERIFIED`;

    const nextStatus: ApprovalStatus =
      verification.status === "FAILED" ? "VERIFICATION_FAILED" : "VERIFIED_COMPLETED";

    const verifDetails: VerificationDetails = {
      inspectorName: verification.inspectorName,
      inspectorRole: verification.inspectorRole,
      inspectionTimestamp: `Hari ini, ${timestamp}`,
      verificationStatus: verification.status,
      checklistScorePct: verification.checklistScorePct,
      findings: verification.findings,
      digitalSignCertHash: certHash,
      qrVerificationCode: qrCode,
    };

    const updated: DigitalApprovalRequest = {
      ...target,
      status: nextStatus,
      verification: verifDetails,
      auditTrail: [
        {
          timestamp: `Hari ini, ${timestamp}`,
          actor: verification.inspectorName,
          action: "VERIFICATION_SIGNED_OFF",
          stage: "VERIFICATION",
          details: `Inspeksi verifikasi final: ${verification.status} (${verification.checklistScorePct}%). Temuan: ${verification.findings}`,
          where: target.targetLocation || "QC Inspection Station",
          before: `Status: ${target.status} (Pending Verification)`,
          after: `Status: ${nextStatus} (Inspected)`,
          diffDelta: `${target.status} → ${nextStatus}`,
        },
        ...target.auditTrail,
      ],
    };

    const final = list.map((r) => (r.id === requestId ? updated : r));
    this.saveRequests(final);
    return updated;
  }

  // 1-Click Batch Approve Pending
  public static quickBatchApproveAll(approverName: string): number {
    const list = this.getRequests();
    let count = 0;
    const updated = list.map((req) => {
      if (req.currentStage === "APPROVAL" && req.status === "PENDING_APPROVAL") {
        const pendingTierIdx = req.approvalMatrix.findIndex((s) => s.status === "PENDING");
        if (pendingTierIdx !== -1) {
          count++;
          const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
          const sigHash = `SIGN-SHA256-BATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          const newMatrix = req.approvalMatrix.map((step, idx) => {
            if (idx === pendingTierIdx) {
              return {
                ...step,
                status: "APPROVED" as const,
                actionTimestamp: `Hari ini, ${timestamp}`,
                comments: "Batch Quick Approval disetujui secara digital.",
                digitalSignatureHash: sigHash,
              };
            }
            return step;
          });

          const isAllApproved = newMatrix.every((s) => s.status === "APPROVED");
          return {
            ...req,
            approvalMatrix: newMatrix,
            currentStage: (isAllApproved ? "EXECUTION" : "APPROVAL") as ApprovalStage,
            status: (isAllApproved ? "IN_EXECUTION" : "PENDING_APPROVAL") as ApprovalStatus,
            auditTrail: [
              {
                timestamp: `Hari ini, ${timestamp}`,
                actor: approverName,
                action: "BATCH_APPROVED",
                stage: (isAllApproved ? "EXECUTION" : "APPROVAL") as ApprovalStage,
                details: `Disetujui melalui Batch 1-Click Sign. ${isAllApproved ? "Memasuki tahap EKSEKUSI." : ""}`,
              },
              ...req.auditTrail,
            ],
          };
        }
      }
      return req;
    });

    this.saveRequests(updated);
    return count;
  }
}
