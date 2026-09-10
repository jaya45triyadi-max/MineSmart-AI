// MINE SMART AI - Central Document Repository Mock Data
import { DocumentItem, DocumentStats } from "../types/documentTypes";

export const mockDocuments: DocumentItem[] = [
  // ================= 1. SOP (Standard Operating Procedures) =================
  {
    id: "doc-sop-001",
    documentNumber: "SOP-MNT-EX-001",
    title: "SOP Preventive Maintenance & Periodic Service Excavator Komatsu PC1250 / PC2000",
    category: "SOP",
    department: "Plant Maintenance",
    version: "v2.3",
    status: "ACTIVE",
    effectiveDate: "2026-01-10",
    expiryDate: "2027-01-10",
    author: "Bambang Sudiro (Plant Maintenance Supt.)",
    reviewer: "Ir. Hendra Kusuma (Senior Reliability Eng.)",
    approvedBy: "Rahmat Hidayat (KTT - Kepala Teknik Tambang)",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 4.8,
    tags: ["SOP", "Excavator", "PC1250", "PC2000", "Komatsu", "Preventive Maintenance", "Hydraulic", "Oil Sampling"],
    equipmentTags: ["EX-204", "EX-205", "EX-206", "PC1250", "PC2000"],
    locationScope: "Central Mining Workshop & Pit In-field",
    complianceStandard: "Kepmen ESDM 1827 K/30/MEM/2018 Lampiran II (Keselamatan Operasi Pertambangan)",
    summary:
      "Standar operasional prosedur pelaksanaan servis berkala (Periodic Service PS-250, PS-500, PS-1000, PS-2000 SMU) untuk armada Excavator Loading Komatsu PC1250 dan PC2000. Mencakup prosedur isolasi LOTO, pergantian pelumas engine & hidrolik, inspeksi kebocoran seal boom/arm, penggantian filter, serta protokol analisis kontaminasi oli (SOS).",
    fullTextContent: `STANDAR OPERASIONAL PROSEDUR (SOP)
Nomor Dokumen : SOP-MNT-EX-001 (Rev. 2.3)
Judul         : PREVENTIVE MAINTENANCE & PERIODIC SERVICE EXCAVATOR PC1250/PC2000
Klasifikasi   : Internal Plant Maintenance • Status: Active

1. TUJUAN
Memastikan seluruh tahapan pemeliharaan berkala (Periodic Service) pada Excavator Komatsu PC1250 dan PC2000 dilaksanakan sesuai standar pabrikan (OEM Manual) dan kaidah Keselamatan Pertambangan guna menjamin Physical Availability (PA) ≥ 90% dan mencegah unplanned breakdown.

2. RUANG LINGKUP
Berlaku untuk seluruh mekanik, auto-electrician, dan helper di Central Workshop serta pit maintenance bay yang menangani armada loading excavator EX-204 s/d EX-209.

3. APD & ALAT KESELAMATAN WAJIB
• Safety Helmet, Safety Shoes Steel Toe, Kacamata Safety, Sarung Tangan Nitril Tahan Oli.
• Padlock LOTO (Lock Out Tag Out) terdaftar.
• Spill kit penampung ceceran hidrokarbon & safety harness jika bekerja pada ketinggian di atas catwalk (>1.8 m).

4. PROSEDUR UTAMA
4.1 Persiapan & Isolasi Mesin (LOTO)
- Parkir unit di lantai workshop yang rata, turunkan bucket ke tanah hingga posisi rileks (grounded).
- Matikan engine, buang sisa tekanan hidrolik akumulator dengan menggerakkan joystick kontrol ke segala arah 5-6 kali.
- Putar Battery Disconnect Switch ke posisi OFF dan pasang gembok LOTO mekanik.

4.2 Pelaksanaan Service Sesuai Interval SMU:
- PS 250 SMU: Ganti Engine Oil (15W-40 CI-4), ganti Fuel Filter Element & Water Separator, ambil sampel oli SOS.
- PS 500 SMU: Ganti Hydraulic Return Filter, Final Drive Oil check, periksa kekencangan baut track shoe & sprocket.
- PS 1000 SMU: Ganti Swing Machinery Oil, ganti Hydraulic Pilot Filter, bersihkan radiator & oil cooler core.
- PS 2000 SMU: Flushing & pergantian penuh oli hidrolik (ISO VG 46/68), kalibrasi relief valve pressure (320 bar).

4.3 Pengujian Pasca Servis (Post-Service Check)
- Lepas LOTO, start engine pada idle rendah selama 3 menit, periksa apakah ada warning alarm di monitor cab.
- Operasikan seluruh silinder silinder hidrolik boom, arm, dan bucket secara perlahan untuk bleeding udara.

5. DOKUMENTASI & CLOSED WORK ORDER
Mekanik wajib mengisi Checklist Inspeksi Form PS-EX-01 dan mengunggah hasil oil sampling ke modul CMMS/MINE SMART AI sebelum merilis unit ke Operasional Tambang.`,
    keyProcedures: [
      "Isolasi Sumber Energi & Pemasangan LOTO Battery Disconnect",
      "Pelepasan Tekanan Hidrolik Akumulator Boom/Arm/Bucket",
      "Penggantian Filter Oli Mesin, Bahan Bakar & Hydraulic Return Filter",
      "Pengambilan Sampel Oli SOS (Wear Metals Fe, Cu, Cr, Al)",
      "Pemeriksaan Torsi Baut Track Shoe & Roller Undercarriage",
      "Running Test & Verifikasi Kebocoran Tekanan 320 Bar",
    ],
    revisionHistory: [
      { version: "v1.0", date: "2024-02-15", author: "Bambang Sudiro", changes: "Rilis perdana dokumen SOP Workshop", approvedBy: "Rahmat Hidayat" },
      { version: "v2.0", date: "2025-05-18", author: "Hendra Kusuma", changes: "Penambahan klausul Oil Sampling SOS 250 SMU & LOTO Golden Rule", approvedBy: "Rahmat Hidayat" },
      { version: "v2.3", date: "2026-01-10", author: "Bambang Sudiro", changes: "Penyesuaian spesifikasi pelumas sintetis B35 biofuel compatibility", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 142,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-08-01T11:20:00Z",
  },
  {
    id: "doc-sop-002",
    documentNumber: "SOP-OPS-BLAST-003",
    title: "SOP Prosedur Pengeboran dan Peledakan (Drilling & Blasting) Pit 1 South",
    category: "SOP",
    department: "Mining",
    version: "v3.0",
    status: "ACTIVE",
    effectiveDate: "2026-02-01",
    expiryDate: "2027-02-01",
    author: "Fajar Pratama (Blasting Engineer)",
    reviewer: "Wahyu Nugroho (Mining Operation Manager)",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 6.2,
    tags: ["SOP", "Blasting", "Drilling", "Peledakan", "Pit 1", "ANFO", "Emulsi", "Handak", "K3 Peledakan"],
    equipmentTags: ["DR-101", "DR-102", "Sandvik DP1500i"],
    locationScope: "Pit 1 South Bench RL +50 s/d RL +10",
    complianceStandard: "Permen ESDM No. 26 Tahun 2018 & Perkap POLRI No. 17 Tahun 2017 tentang Handak",
    summary:
      "Standar operasional prosedur pelaksanaan pengeboran lubang ledak, pengisian bahan peledak (ANFO & Bulk Emulsion), perangkaian non-electric detonator, sterilisasi area radius 500m (alat) / 1000m (manusia), hingga penembakan dan pemeriksaan pasca ledak (misfire inspection).",
    fullTextContent: `STANDAR OPERASIONAL PROSEDUR (SOP)
Nomor Dokumen : SOP-OPS-BLAST-003 (Rev. 3.0)
Judul         : PROSEDUR PENGEBORAN DAN PELEDAKAN (DRILLING & BLASTING)
Klasifikasi   : Restricted Mining Ops • Status: Active

1. TUJUAN
Menjamin kegiatan drilling dan peledakan batuan penutup (overburden) berjalan aman, efisien, menghasilkan fragmentasi optimal (<40 cm) dengan getaran tanah (PPV < 2.0 mm/s) dan flyrock terkendali.

2. KETENTUAN KARTU IZIN MELEDAKKAN (KIM)
Hanya Juru Ledak yang memiliki Kartu Izin Meledakkan (KIM) kelas II/I aktif dari KaIT/KTT yang berwenang merangkai dan menembakkan bahan peledak.

3. RADIUS AMAN PELEDAKAN
• Radius aman peralatan & armada bergerak: Minimal 500 meter dari batas terluar pola lubang ledak.
• Radius aman manusia / pekerja: Minimal 1.000 meter (1 KM) di perimeter tertutup.
• Penjagaan pos blokade di seluruh akses jalan masuk pit (Pos 1 s/d Pos 6).

4. TAHAPAN PELAKSANAAN
4.1 Pengeboran (Drilling Pattern)
- Terapkan pola staggered burden 7.0 m x spacing 8.0 m kedalaman rata-rata 12.0 m dengan subdrill 1.0 m.
4.2 Priming & Charging Bahan Peledak
- Gunakan Booster Cast Primer 400g diikatkan pada Nonel Surface Trunkline / In-hole Delay.
- Isi Bulk Emulsion Matrix 70:30 dengan density 1.15 g/cc atau ANFO pada kondisi lubang kering.
- Stemming menggunakan batu split macadam 10-20 mm setinggi minimal 4.5 meter untuk mengunci gas ledak.
4.3 Sterilisasi & Peringatan Sirine Ledak
- Sirine 1 (30 menit sebelum ledak): 1 kali panjang (1 menit) - Seluruh unit keluar dari radius 500m.
- Sirine 2 (5 menit sebelum ledak): Bunyi putus-putus cepat - Blokade jalan ditutup total, Radio Channel 1 Mining hening.
- Sirine 3 (Saat tembak): 1 kali panjang 10 detik diikuti aba-aba hitung mundur 5.. 4.. 3.. 2.. 1.. FIRE!
4.4 Pemeriksaan Pasca Peledakan (Misfire Check)
- Juru Ledak bersama Pengawas Blasting melakukan inspeksi setelah asap dan debu hilang (minimal 15 menit).
- Jika ditemukan mangkir (misfire), segera pasang barikade dan lapor KTT.

5. PENCATATAN & PELAPORAN
Juru ledak wajib mengisi Laporan Pemakaian Handak Form L-03 dan menyerahkan rekaman seismograf getaran Blasting Seismograph kepada Tim Geoteknik.`,
    keyProcedures: [
      "Verifikasi Kelayakan Pola Pengeboran & Kedalaman Lubang Ledak",
      "Penerimaan & Pengawalan Bahan Peledak dari Gudang Handak P2",
      "Priming, Charging Emulsi & Stemming dengan Agregat Bersih",
      "Penutupan Akses Pos Blokade & Sterilisasi Radius 1000m",
      "Pemberian Aba-aba Sirine Standar & Radio Clearance Channel",
      "Inspeksi Misfire Pasca Ledak & Pembacaan Seismograf Getaran Tanah",
    ],
    revisionHistory: [
      { version: "v1.0", date: "2023-08-01", author: "Fajar Pratama", changes: "Rilis awal operasional Pit 1", approvedBy: "Rahmat Hidayat" },
      { version: "v3.0", date: "2026-02-01", author: "Fajar Pratama", changes: "Penambahan radius getaran seismograf digital & emulsi tahan air", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 88,
    createdAt: "2026-02-01T09:15:00Z",
    updatedAt: "2026-07-20T14:30:00Z",
  },
  {
    id: "doc-sop-003",
    documentNumber: "SOP-LOG-HAUL-012",
    title: "SOP Pengoperasian Hauling Dump Truck CAT 777G pada Kondisi Hujan & Jalan Basah",
    category: "SOP",
    department: "Mining",
    version: "v2.1",
    status: "ACTIVE",
    effectiveDate: "2026-03-15",
    expiryDate: "2027-03-15",
    author: "Agus Triyono (Hauling Dispatch Supt.)",
    reviewer: "Wahyu Nugroho (Mining Ops Manager)",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 3.9,
    tags: ["SOP", "Hauling", "Dump Truck", "CAT 777G", "Jalan Tambang", "Hujan", "Slippery Road", "K3"],
    equipmentTags: ["DT-301", "DT-302", "CAT-777G", "GD-825"],
    locationScope: "Main Haul Road KM 00 s/d KM 18",
    complianceStandard: "Kepmen ESDM 1827/2018 - Standar Jalan Tambang",
    summary:
      "Prosedur operasional dump truck off-highway CAT 777G saat menghadapi cuaca hujan, jalan licin, dan protokol rain stoppage untuk mencegah insiden rollover, skid, atau tabrakan armada tambang.",
    fullTextContent: `STANDAR OPERASIONAL PROSEDUR (SOP)
Nomor Dokumen : SOP-LOG-HAUL-012 (Rev. 2.1)
Judul         : PENGOPERASIAN HAULING DUMP TRUCK CAT 777G SAAT HUJAN & JALAN BASAH

1. ATURAN KECEPATAN MAXIMUM
• Kondisi Kering: Max 40 km/jam di jalur lurus, Max 20 km/jam di tikungan/turunan.
• Kondisi Basah / Pasca Hujan: Max 20 km/jam di jalur datar, Max 10 km/jam di turunan dengan Retarder ON.
• Jarak Konvoi Minimum: 50 meter (kering) / 100 meter (basah).

2. PROTOKOL RAIN STOPPAGE
Jika intensitas curah hujan mencapai ≥ 5 mm dalam 15 menit atau kondisi jalan mengalami slipping:
- Dispatcher mengeluarkan aba-aba radio 'RAIN STOPPAGE ALL HAULING'.
- Seluruh DT wajib mengurangi kecepatan, menghidupkan hazard lamp, dan parkir aman di rest bay.
- Larangan keras parkir di bahu jalan atau di bawah crest lereng berpotensi longsor.`,
    keyProcedures: [
      "Pemeriksaan Pre-Shift Ban & Retarder Brake Sistem CAT 777G",
      "Penerapan Batas Kecepatan 10-20 km/jam pada Kondisi Licin",
      "Protokol Radio Dispatch Rain Stoppage & Safe Parking Area",
      "Inspeksi Jalan oleh Foreman & Road Maintenance Grader sebelum Re-start",
    ],
    revisionHistory: [
      { version: "v1.0", date: "2024-06-10", author: "Agus Triyono", changes: "Rilis dokumen hauling", approvedBy: "Rahmat Hidayat" },
      { version: "v2.1", date: "2026-03-15", author: "Agus Triyono", changes: "Penambahan retarder protocol CAT 777G", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 95,
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-07-28T09:10:00Z",
  },

  // ================= 2. WORK INSTRUCTION (WI) =================
  {
    id: "doc-wi-001",
    documentNumber: "WI-PLT-HYD-014",
    title: "WI Penggantian Filter Hidrolik & Sampling Oli Excavator EX-204 Komatsu PC1250",
    category: "WORK_INSTRUCTION",
    department: "Plant Maintenance",
    version: "v1.4",
    status: "ACTIVE",
    effectiveDate: "2026-02-10",
    expiryDate: "2027-02-10",
    author: "Suryono (Lead Hydraulic Specialist)",
    reviewer: "Bambang Sudiro (Plant Supt.)",
    approvedBy: "Ir. Hendra Kusuma",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 2.7,
    tags: ["Work Instruction", "Hydraulic Filter", "Oil Sampling", "PC1250", "EX-204", "Komatsu"],
    equipmentTags: ["EX-204", "PC1250"],
    locationScope: "Main Workshop Bay 2 & Field Lube Truck",
    complianceStandard: "Komatsu Shop Manual PC1250-8R Section 30 (Hydraulic System Maintenance)",
    summary:
      "Instruksi kerja langkah demi langkah untuk teknisi hidrolik dalam melakukan pelepasan, inspeksi gram serpihan logam, penggantian filter hidrolik return/pilot, dan tata cara pengambilan sampel oli SOS pada Excavator EX-204.",
    fullTextContent: `PETUNJUK KERJA / WORK INSTRUCTION (WI)
Nomor Dokumen : WI-PLT-HYD-014 (Rev. 1.4)
Judul         : PENGGANTIAN FILTER HIDROLIK & OIL SAMPLING EXCAVATOR EX-204

LANGKAH KERJA:
1. Pastikan LOTO terpasang dan tekanan akumulator dibuang habis.
2. Siapkan wadah penampung tetesan oli bersih (oil drain pan 20 L).
3. Buka penutup filter hidrolik samping tanki dengan kunci hex 19mm.
4. Angkat elemen filter lama secara perlahan, potong lipatan filter untuk memeriksa adanya serpihan gram logam kuningan (indikasi keausan pompa piston) atau serpihan baja.
5. Bersihkan dudukan rumah filter dengan kain lap bebas serat (lint-free cloth).
6. Pasang filter baru OEM Komatsu No. 07063-51210, oleskan oli bersih pada O-ring seal.
7. Ambil sampel oli hidrolik melalui sampling port dengan vacuum pump sampling bottle pada suhu operasi (50-60°C).
8. Kencangkan baut cover sesuai torsi standar (65 Nm).
9. Buang filter bekas ke TPS Limbah B3 berizin.`,
    keyProcedures: [
      "Pemeriksaan gram serpihan logam pada lipatan kertas filter lama",
      "Pemasangan O-ring seal baru dan pengencangan cover torsi 65 Nm",
      "Pengambilan sampel botol SOS oli hidrolik untuk uji partikel ISO 4406",
      "Penyerahan limbah filter oli ke penampungan B3",
    ],
    revisionHistory: [
      { version: "v1.4", date: "2026-02-10", author: "Suryono", changes: "Penambahan instruksi pengecekan gram kuningan piston pump", approvedBy: "Hendra Kusuma" },
    ],
    downloadCount: 74,
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-08-05T08:45:00Z",
  },
  {
    id: "doc-wi-002",
    documentNumber: "WI-MNT-TYRE-009",
    title: "WI Prosedur Penggantian & Pemasangan Ban OTR 27.00R49 Dump Truck CAT 777G",
    category: "WORK_INSTRUCTION",
    department: "Plant Maintenance",
    version: "v2.0",
    status: "ACTIVE",
    effectiveDate: "2026-01-25",
    expiryDate: "2027-01-25",
    author: "Dodi Hartanto (Tyre Specialist)",
    reviewer: "Bambang Sudiro",
    approvedBy: "Hendra Kusuma",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 3.1,
    tags: ["Work Instruction", "Tyre", "OTR", "CAT 777G", "Bridgestone", "Michelin", "Torque"],
    equipmentTags: ["CAT-777G", "TH-01 Tyre Handler"],
    locationScope: "Tyre Bay Workshop",
    summary:
      "Instruksi teknis pelepasan, pengempesan udara (deflation), pemakaian tyre handler, inspeksi rim wheel, dan pengencangan torsi baut roda ban OTR ukuran 27.00R49 menggunakan hydraulic torque wrench.",
    fullTextContent: `WORK INSTRUCTION (WI) - TYRE SHOP
1. Selalu pasang tire cage / deflator tool dan buang seluruh tekanan angin ban sebelum membuka lock ring.
2. Gunakan Tyre Handler TH-01 untuk menahan bobot ban saat baut roda dibuka.
3. Kencangkan baut roda secara menyilang (star pattern) menggunakan torque wrench hingga torsi 1.150 Nm.
4. Lakukan re-torque setelah unit beroperasi 50 km pertama.`,
    revisionHistory: [
      { version: "v2.0", date: "2026-01-25", author: "Dodi Hartanto", changes: "Re-torque mandatory interval update", approvedBy: "Hendra Kusuma" },
    ],
    downloadCount: 52,
    createdAt: "2026-01-25T13:30:00Z",
    updatedAt: "2026-06-12T10:00:00Z",
  },

  // ================= 3. CONTRACT =================
  {
    id: "doc-ctr-001",
    documentNumber: "CTR-COM-2026-089",
    title: "Kontrak Pasokan Bahan Bakar Solar Industri B35 PT Pertamina Patra Niaga",
    category: "CONTRACT",
    department: "Commercial & Finance",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-01-01",
    expiryDate: "2026-12-31",
    author: "Mega Wulandari (Legal & Contract Supt.)",
    reviewer: "Siti Rahmawati (Finance Director)",
    approvedBy: "Direktur Utama",
    confidentiality: "CONFIDENTIAL",
    fileType: "PDF",
    fileSizeMB: 7.4,
    tags: ["Contract", "Fuel", "Solar B35", "Pertamina", "Patra Niaga", "Komitmen Pasokan", "Harga MOPS"],
    locationScope: "Fuel Storage Tank Sangatta Site (Kapasitas 1.500.000 Liter)",
    summary:
      "Perjanjian jual beli bahan bakar minyak (BBM) solar industri Biosolar B35 volume alokasi 1.200.000 Liter per bulan dengan formula harga patokan MOPS Singapura + Alpha, termin pembayaran Net 30 hari, dan klausul jaminan kualitas spesifikasi Ditjen Migas (FAME 35%).",
    fullTextContent: `PERJANJIAN JUAL BELI BAHAN BAKAR MINYAK (BBM) INDUSTRI BIOSOLAR B35
Nomor Kontrak: CTR-COM-2026-089 / PTPN-JBB-2026-0112

ANTARA:
PT MINE SMART NUSANTARA (SEBAGAI PEMBELI)
DAN
PT PERTAMINA PATRA NIAGA (SEBAGAI PENJUAL)

PASAL 1: KETENTUAN DAN SPESIFIKASI PRODUK
1. Jenis Produk: Biosolar B35 (Campuran Solar Murni 65% dan Fatty Acid Methyl Ester 35%).
2. Spesifikasi: Sesuai Keputusan Dirjen Migas No. 115.K/MG.01/DJM/2023. Kadar air max 300 ppm, flash point min 52°C.
3. Estimasi Volume Bulanan: 1.200.000 Liter (+/- 10% toleransi operasional).

PASAL 2: FORMULA HARGA DAN PEMBAYARAN
1. Harga Jual: Mengacu pada publikasi MOPS Gasoil 0.001% S + Alpha Distribusi + PPN 11% + PBBKB 7.5%.
2. Pembayaran: Dilakukan via Transfer Bank Mandiri dengan termin Net 30 (tiga puluh) hari kalender sejak faktur pajak dan Berita Acara Serah Terima (BAST) diterima lengkap.

PASAL 3: PENYERAHAN & TERA VOLUME
Penyerahan dilakukan secara Delivered at Place (DAP) di Fuel Storage Main Tank Sangatta. Pengukuran volume wajib ditera bersama menggunakan automatic tank gauge bersertifikat Metrologi.`,
    clauses: [
      { clauseNumber: "Pasal 1", title: "Spesifikasi Solar B35", content: "Kadar air max 300 ppm, FAME 35%, density 815-860 kg/m3." },
      { clauseNumber: "Pasal 2", title: "Harga & Termin Net 30", content: "Formula MOPS Gasoil + Alpha, termin pembayaran 30 hari." },
      { clauseNumber: "Pasal 5", title: "Jaminan Kontinuitas Pasokan", content: "Penjual menjamin ketersediaan buffer stock minimal 7 hari." },
    ],
    revisionHistory: [
      { version: "v1.0", date: "2026-01-01", author: "Mega Wulandari", changes: "Kontrak ditandatangani kedua belah pihak", approvedBy: "Direktur Utama" },
    ],
    downloadCount: 63,
    createdAt: "2026-01-02T08:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "doc-ctr-002",
    documentNumber: "CTR-MIN-2025-012",
    title: "Master Service Agreement Jasa Penambangan Overburden PT Saptaindra Sejati (SIS)",
    category: "CONTRACT",
    department: "Mining",
    version: "v1.2",
    status: "ACTIVE",
    effectiveDate: "2025-01-01",
    expiryDate: "2027-12-31",
    author: "Mega Wulandari",
    reviewer: "Wahyu Nugroho",
    approvedBy: "Direktur Operasional",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 12.1,
    tags: ["Contract", "Mining Contractor", "PT SIS", "Overburden", "Rate BCM", "Target Produksi"],
    locationScope: "Pit 1 South & West Disposal",
    summary:
      "Kontrak jangka panjang penyedia jasa penambangan (mining contractor) pemindahan overburden dan hauling batubara target 8.500.000 BCM/tahun dengan skema tarif BCM berbasis jarak hauling dan denda deviasi target (liquidated damages).",
    fullTextContent: `MASTER SERVICE AGREEMENT (MSA) MINING CONTRACTOR PT SAPTAINDRA SEJATI
• Target Overburden: 8.500.000 BCM per tahun.
• Rate Dasar Overburden: Rp 21.500 per BCM (Jarak hauling dasar 3.0 KM).
• Incremental Distance Rate: Rp 1.200 per BCM per kilometer tambahan.`,
    revisionHistory: [
      { version: "v1.2", date: "2025-06-20", author: "Mega Wulandari", changes: "Amandemen penyesuaian jarak hauling West Dump", approvedBy: "Direktur Operasional" },
    ],
    downloadCount: 45,
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2026-07-15T11:00:00Z",
  },

  // ================= 4. PERMIT =================
  {
    id: "doc-pmt-001",
    documentNumber: "PMT-KLHK-2024-IPPKH",
    title: "Izin Pinjam Pakai Kawasan Hutan (IPPKH) Operasi Produksi Pit 1 & Pit 2 KLHK",
    category: "PERMIT",
    department: "Legal & Compliance",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2024-04-12",
    expiryDate: "2029-04-12",
    author: "Kementerian Lingkungan Hidup dan Kehutanan RI",
    reviewer: "Mega Wulandari",
    approvedBy: "Menteri LHK RI",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 8.9,
    tags: ["Permit", "IPPKH", "KLHK", "Izin Kehutanan", "Kawasan Hutan Produksi", "Rehabilitasi DAS", "Batas IUP"],
    locationScope: "Area Konsesi Blok Sangatta 2.450 Hektar",
    complianceStandard: "UU No. 41 Tahun 1999 tentang Kehutanan & PP No. 24 Tahun 2021",
    summary:
      "Surat Keputusan Menteri LHK tentang Penetapan Izin Pinjam Pakai Kawasan Hutan untuk kegiatan operasi produksi penambangan batubara dan sarana penunjang seluas 1.820 Hektar pada Kawasan Hutan Produksi Tetap (HP) dengan kewajiban pembayaran PNBP Penggunaan Kawasan Hutan dan Penanaman Rehabilitasi DAS rasio 1:1.",
    fullTextContent: `KEPUTUSAN MENTERI LINGKUNGAN HIDUP DAN KEHUTANAN REPUBLIK INDONESIA
Nomor: SK.342/MENLHK/SETJEN/PLA.0/4/2024
TENTANG
IZIN PINJAM PAKAI KAWASAN HUTAN UNTUK OPERASI PRODUKSI BATUBARA ATAS NAMA PT MINE SMART NUSANTARA

MEMUTUSKAN:
1. Memberikan Izin Pinjam Pakai Kawasan Hutan (IPPKH) seluas 1.820,45 Ha (Seribu Delapan Ratus Dua Puluh Koma Empat Puluh Lima Hektar) di Kabupaten Kutai Timur.
2. Jangka waktu izin berlaku selama 5 (lima) tahun terhitung sejak tanggal penetapan sampai 12 April 2029.
3. Kewajiban Pemegang IPPKH:
   a. Membayar PNBP Penggunaan Kawasan Hutan setiap tahun sesuai PP Tarif.
   b. Melaksanakan penanaman dalam rangka Rehabilitasi Daerah Aliran Sungai (DAS) seluas 1.820,45 Ha pada lokasi yang ditetapkan BPDAS.
   c. Melakukan penataan batas batas areal kerja IPPKH dalam jangka waktu paling lama 1 tahun.
   d. Melaksanakan reklamasi hutan dan revegetasi pada areal bekas tambang.`,
    clauses: [
      { clauseNumber: "Diktum Kedua", title: "Masa Berlaku Izin", content: "Berlaku 5 tahun sampai 12 April 2029 dan dapat diperpanjang." },
      { clauseNumber: "Diktum Ketiga", title: "Kewajiban Rehabilitasi DAS", content: "Melakukan penanaman DAS rasio 1:1 seluas 1.820 Ha." },
    ],
    revisionHistory: [
      { version: "v1.0", date: "2024-04-12", author: "KLHK", changes: "Penerbitan SK Menteri Definitif", approvedBy: "Menteri LHK" },
    ],
    downloadCount: 110,
    createdAt: "2024-04-15T08:00:00Z",
    updatedAt: "2026-04-12T09:00:00Z",
  },
  {
    id: "doc-pmt-002",
    documentNumber: "PMT-ESDM-2026-RKAB",
    title: "Surat Persetujuan Rencana Kerja dan Anggaran Biaya (RKAB) Tahun 2026 Ditjen Minerba ESDM",
    category: "PERMIT",
    department: "Legal & Compliance",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-01-01",
    expiryDate: "2026-12-31",
    author: "Direktorat Jenderal Mineral dan Batubara - Kementerian ESDM",
    reviewer: "Rahmat Hidayat (KTT)",
    approvedBy: "Dirjen Minerba",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 5.5,
    tags: ["Permit", "RKAB", "ESDM", "Minerba", "Kuota Batubara", "Target Produksi 2026", "Royalti"],
    locationScope: "Seluruh Wilayah IUP Operasi Produksi",
    complianceStandard: "Permen ESDM No. 10 Tahun 2023 tentang Tata Cara Penyusunan, Penyampaian, dan Persetujuan RKAB",
    summary:
      "Surat Keputusan Persetujuan RKAB Tahunan IUP Operasi Produksi Batubara Tahun 2026 dengan kuota produksi batubara resmi sebesar 2.500.000 Metric Ton (MT), pemindahan overburden 9.200.000 BCM, alokasi DMO (Domestic Market Obligation) 25% untuk PLN, dan anggaran keselamatan pertambangan & lingkungan hidup.",
    fullTextContent: `SURAT PERSETUJUAN RKAB TAHUN 2026 DITJEN MINERBA ESDM
Nomor: T-104/MB.04/DJB.M/2026
• Kuota Produksi Batubara: 2.500.000 Ton.
• Kuota Overburden: 9.200.000 BCM.
• Alokasi DMO Batubara: Minimal 625.000 Ton (25%).
• Rencana Anggaran K3 & Lingkungan: Rp 14.800.000.000.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-01-01", author: "ESDM", changes: "Persetujuan RKAB 2026 Disahkan", approvedBy: "Dirjen Minerba" },
    ],
    downloadCount: 135,
    createdAt: "2026-01-03T10:00:00Z",
    updatedAt: "2026-06-30T14:00:00Z",
  },
  {
    id: "doc-pmt-003",
    documentNumber: "PMT-POL-2026-P2",
    title: "Izin Pemilikan, Penguasaan dan Penggunaan Bahan Peledak (P2) & Gudang Handak POLRI",
    category: "PERMIT",
    department: "HSE & Environment",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-03-01",
    expiryDate: "2027-03-01",
    author: "Kepolisian Negara Republik Indonesia (BAINTELKAM POLRI)",
    reviewer: "Fajar Pratama",
    approvedBy: "KABAIN TELKAM POLRI",
    confidentiality: "SECRET",
    fileType: "PDF",
    fileSizeMB: 3.2,
    tags: ["Permit", "Handak", "P2", "Gudang Bahan Peledak", "Polri", "ANFO", "Detonator"],
    locationScope: "Gudang Handak Utama KM 08",
    summary:
      "Izin resmi P2 Kepolisian RI untuk penyimpanan dan pemakaian Amonium Nitrat 500 Ton, Dinamit/Emulsi Matrix 100 Ton, dan Detonator 50.000 pcs pada Gudang Bahan Peledak Bawah Tanah & Permukaan.",
    fullTextContent: `SURAT IZIN P2 BAHAN PELEDAK BAINTELKAM POLRI No. SI/P2/III/2026/YANMIN
Memberikan izin kepada PT MINE SMART NUSANTARA untuk memiliki, menyimpan, dan menggunakan bahan peledak komersial pada kegiatan penambangan Pit 1 & Pit 2.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-03-01", author: "POLRI", changes: "Perpanjangan Izin P2 Tahunan", approvedBy: "KABAIN TELKAM" },
    ],
    downloadCount: 38,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-01T08:00:00Z",
  },

  // ================= 5. DRAWING =================
  {
    id: "doc-dwg-001",
    documentNumber: "DWG-ENG-PIT1-S-09",
    title: "Engineering CAD Pit Design & Bench Sequence Pit 1 South RL -50",
    category: "DRAWING",
    department: "Mining",
    version: "v4.2",
    status: "ACTIVE",
    effectiveDate: "2026-05-10",
    author: "Rizky Firmansyah (Senior Mine Planning Engineer)",
    reviewer: "Wahyu Nugroho",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "INTERNAL",
    fileType: "DWG",
    fileSizeMB: 28.4,
    tags: ["Drawing", "CAD", "Pit Design", "Mine Plan", "Bench RL -50", "Ramp 10%", "Safety Berm"],
    locationScope: "Pit 1 South Elevation RL +60 down to RL -50",
    complianceStandard: "SNI 7121:2018 (Rancangan Geometri Lereng Penambangan Terbuka)",
    summary:
      "Desain tambang 3D AutoCAD/Minescape final untuk Pit 1 South dengan geometri jenjang single bench height 10 meter, bench width 5 meter, overall slope angle 38 derajat, lebar jalan angkut main ramp 28 meter (3.5x lebar CAT 777G), dan kemiringan grade 8-10%.",
    fullTextContent: `TECHNICAL DRAWING SPECIFICATION
Nomor Gambar: DWG-ENG-PIT1-S-09 (Rev. 4.2)
Skala       : 1:2.500 • Proyeksi Koordinat: UTM WGS84 Zone 50S

GEOMETRI JENJANG:
• Tinggi Jenjang Tunggal (Bench Height): 10.0 Meter
• Sudut Lereng Tunggal (Single Slope Angle): 65 Derajat
• Lebar Berm Penahan (Safety Berm Width): 5.5 Meter
• Sudut Lereng Keseluruhan (Overall Slope Angle): 38 Derajat
• Lebar Jalan Haul Road: 28.0 Meter (2-Lane CAT 777G) + Tanggul Pengaman (Safety Berm) tinggi 1.8 Meter (3/4 diameter roda).
• Elevasi Dasar Pit Terendah (Pit Bottom): RL -50.0 m MSL`,
    revisionHistory: [
      { version: "v1.0", date: "2024-01-15", author: "Rizky Firmansyah", changes: "Desain awal Pit 1", approvedBy: "Wahyu Nugroho" },
      { version: "v4.2", date: "2026-05-10", author: "Rizky Firmansyah", changes: "Penambahan ramp bypass ke Disposal Barat", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 189,
    createdAt: "2026-05-10T14:00:00Z",
    updatedAt: "2026-07-20T16:00:00Z",
  },
  {
    id: "doc-dwg-002",
    documentNumber: "DWG-GEO-SEAM-A1",
    title: "Penampang Geologi Isopach & Cross-Section Batubara Seam A1-A2",
    category: "DRAWING",
    department: "Geology & Survey",
    version: "v2.0",
    status: "ACTIVE",
    effectiveDate: "2026-04-18",
    author: "Dimas Anggoro (Senior Exploration Geologist)",
    reviewer: "Dr. Irfan Maulana",
    approvedBy: "Wahyu Nugroho",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 15.6,
    tags: ["Drawing", "Geologi", "Cross-Section", "Seam A1", "Seam A2", "Ketebalan Batubara", "Sesar"],
    locationScope: "Blok Barat - Sesar Normal KM 14",
    summary:
      "Peta profil penampang melintang geologi (Section A-A' & B-B') memperlihatkan perlapisan batubara Seam A1 (tebal rata-rata 4.8 m, kemiringan dip 12°) dan Seam A2 (tebal 2.1 m) serta struktur geologi sesar minor turun (normal fault throw 3.5 m).",
    fullTextContent: `GEOLOGICAL CROSS SECTION SHEET 01
• Model: Interpolasi 48 Titik Bor Eksplorasi Spacing 100m.
• Batubara: Formasi Balikpapan (Miosen Tengah), Rank Sub-Bituminous B, Nilai Kalori 5.800 kcal/kg GAR.`,
    revisionHistory: [
      { version: "v2.0", date: "2026-04-18", author: "Dimas Anggoro", changes: "Update data 8 lubang bor infill drilling", approvedBy: "Wahyu Nugroho" },
    ],
    downloadCount: 92,
    createdAt: "2026-04-18T09:00:00Z",
    updatedAt: "2026-06-15T11:00:00Z",
  },

  // ================= 6. REPORT =================
  {
    id: "doc-rep-001",
    documentNumber: "REP-GEO-SLOPE-104",
    title: "Laporan Analisis Geoteknik & Kestabilan Lereng (FK Slope Stability) Q2 2026",
    category: "REPORT",
    department: "Geology & Survey",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-07-05",
    author: "Tim Geoteknik Site (PT Geotech Minerals Consult)",
    reviewer: "Dimas Anggoro",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 11.2,
    tags: ["Report", "Geoteknik", "Kestabilan Lereng", "Faktor Keamanan", "FK", "Pit 1 South", "Disposal"],
    locationScope: "Highwall Pit 1 South & West Disposal Dump",
    complianceStandard: "Kepmen ESDM 1827/2018 - Standar Faktor Keamanan (FK Dinamis ≥ 1.1, Statis ≥ 1.3)",
    summary:
      "Laporan evaluasi kestabilan lereng triwulanan menggunakan metode kesetimbangan batas (Limit Equilibrium Method) dan radar pergerakan tanah SSR. Hasil: Highwall Pit 1 South stabil dengan Faktor Keamanan (FK) = 1.42 (Statis) dan 1.21 (Pseudo-Statis Gempa), sedangkan Waste Dump Area Barat memerlukan dewatering drainase horizontal pada RL +40.",
    fullTextContent: `LAPORAN STUDI GEOTEKNIK KESTABILAN LERENG TAMBANG TRIWULAN II TAHUN 2026
Site: Sangatta Kalimantan Timur

1. KESIMPULAN FAKTOR KEAMANAN (FK):
- Lereng Highwall Pit 1 South: FK Statis = 1.42, FK Dinamis (koef gempa 0.08g) = 1.21 → KRITERIA AMAN (Memenuhi standar ESDM > 1.30).
- Lereng Lowwall Seam A1: FK Statis = 1.35 → AMAN (Potensi planar slip di bidang sentuh lempung telah termitigasi dewatering).
- West Waste Disposal Dump: FK Statis = 1.28 → PERHATIAN (Perlu dipasang sub-surface drain dan penataan counterweight toe).

2. REKOMENDASI GEOTEKNIK:
- Lanjutkan pemantauan pergerakan lereng dengan Slope Stability Radar (SSR) 24/7.
- Pertahankan jarak crest-dump minimal 30 meter saat penimbunan OB.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-07-05", author: "Geotech Minerals", changes: "Laporan final Q2 2026 disahkan", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 120,
    createdAt: "2026-07-05T10:00:00Z",
    updatedAt: "2026-07-10T15:00:00Z",
  },
  {
    id: "doc-rep-002",
    documentNumber: "REP-ENV-TRI-2026",
    title: "Laporan Pemantauan Lingkungan Hidup Triwulan II (RKL-RPL Air, Udara & Reklamasi)",
    category: "REPORT",
    department: "HSE & Environment",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-07-15",
    author: "Doni Prasetyo (Environmental Supervisor)",
    reviewer: "Ir. Hendra Kusuma",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 9.8,
    tags: ["Report", "Lingkungan", "RKL-RPL", "Kualitas Air", "Baku Mutu", "Settling Pond", "KLHK", "Dinas LH"],
    locationScope: "Titik Penaatan Point 1 (Settling Pond 3) & Ambience Pit",
    complianceStandard: "Permen LH No. 113 Tahun 2003 tentang Baku Mutu Air Limbah Batubara",
    summary:
      "Laporan resmi triwulanan pemantauan baku mutu air limbah tambang pada Titik Penaatan (Point of Compliance) Settling Pond 3. Parameter pH rata-rata 7.2 (Baku mutu 6-9), TSS rata-rata 85 mg/L (Baku mutu <300 mg/L), Fe <2.0 mg/L, Mn <1.5 mg/L. Seluruh parameter 100% patuh.",
    fullTextContent: `LAPORAN IMPLEMENTASI RKL-RPL TRIWULAN II 2026
• Titik Penaatan SP-3 Outflow: pH = 7.2 (Memenuhi Syarat).
• TSS Air Larian: 85 mg/L (Baku mutu maks 300 mg/L).
• Revegetasi Reklamasi Lahan: Telah tertanam 14.500 pohon Sengon & Johar pada luasan 22 Hektar.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-07-15", author: "Doni Prasetyo", changes: "Diserahkan ke Dinas LH & ESDM Provinsi", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 78,
    createdAt: "2026-07-15T11:00:00Z",
    updatedAt: "2026-07-18T10:00:00Z",
  },

  // ================= 7. CERTIFICATE =================
  {
    id: "doc-crt-001",
    documentNumber: "CRT-K3-POP-2026-44",
    title: "Sertifikat Pengawas Operasional Pertama (POP) Minerba - Kepala Teknik Tambang",
    category: "CERTIFICATE",
    department: "HSE & Environment",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2024-08-20",
    expiryDate: "2029-08-20",
    author: "Badan Nasional Sertifikasi Profesi (BNSP) & Ditjen Minerba ESDM",
    reviewer: "HR Division",
    approvedBy: "Ketua BNSP",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 1.8,
    tags: ["Certificate", "POP", "K3 Minerba", "Sertifikasi Kompetensi", "Pengawas Tambang", "BNSP", "ESDM"],
    locationScope: "Site Management",
    complianceStandard: "SKKNI No. 248 Tahun 2014 & Kepmen ESDM 1827/2018",
    summary:
      "Sertifikat Kompetensi Kerja Pengawas Operasional Pertama (POP) Bidang Pertambangan Mineral dan Batubara yang diterbitkan oleh LSP Pertambangan / BNSP atas nama Rahmat Hidayat, S.T. Masa berlaku 5 tahun.",
    fullTextContent: `SERTIFIKAT KOMPETENSI PENGAWAS OPERASIONAL PERTAMA (POP) MINERBA
Nomor Registrasi: POP-MIN-2024-008912
Menyatakan bahwa:
Nama       : Rahmat Hidayat, S.T.
No. KTP    : 6404012005820003
Telah Dinyatakan KOMPETEN dalam mengawasi pelaksanaan K3 dan Lingkungan Pertambangan sesuai standar ESDM.`,
    revisionHistory: [
      { version: "v1.0", date: "2024-08-20", author: "BNSP", changes: "Sertifikat diterbitkan", approvedBy: "Ketua BNSP" },
    ],
    downloadCount: 60,
    createdAt: "2024-08-20T08:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "doc-crt-002",
    documentNumber: "CRT-MET-WEIGH-2026",
    title: "Surat Keterangan Hasil Pengujian & Kalibrasi Tera Jembatan Timbang Metrologi Legal",
    category: "CERTIFICATE",
    department: "Processing & Coal",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-02-15",
    expiryDate: "2027-02-15",
    author: "Unit Pelaksana Teknis Daerah (UPTD) Metrologi Legal Disperindag",
    reviewer: "Weighbridge Incharge",
    approvedBy: "Kepala UPTD Metrologi",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 2.1,
    tags: ["Certificate", "Tera", "Kalibrasi", "Jembatan Timbang", "Weighbridge", "Metrologi Legal", "100 Ton"],
    equipmentTags: ["WB-01 Jembatan Timbang Port", "WB-02 Pit"],
    locationScope: "Main Weighbridge Station Jetty Sangatta (Kapasitas 100 Ton)",
    complianceStandard: "UU No. 2 Tahun 1981 tentang Metrologi Legal",
    summary:
      "Sertifikat Tera Sah Timbangan Jembatan Elektronik (Kapasitas Max 100.000 kg, ketelitian 10 kg). Dinyatakan SAH dan memenuhi standar toleransi batas kesalahan yang diizinkan (BKD) untuk transaksi komersial penjualan batubara.",
    fullTextContent: `SURAT KETERANGAN PENGUJIAN TERA METROLOGI LEGAL
Nomor: 510.4/048/METRO-TERA/II/2026
Alat Ukur: Timbangan Jembatan Truk Avery Weigh-Tronix Kapasitas 100 Ton.
Hasil Uji Beban Bertahap:
• Beban 20.000 kg -> Penunjukan 20.000 kg (Error: 0 kg)
• Beban 60.000 kg -> Penunjukan 60.000 kg (Error: 0 kg)
• Beban 100.000 kg -> Penunjukan 99.990 kg (Error: -10 kg / Toleransi aman).
Cap Tanda Tera Sah Tahun 2026 telah dibubuhkan.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-02-15", author: "Metrologi Legal", changes: "Penerbitan tera sah tahun 2026", approvedBy: "Kepala UPTD" },
    ],
    downloadCount: 41,
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },

  // ================= 8. INVOICE =================
  {
    id: "doc-inv-001",
    documentNumber: "INV-UT-2026-9041",
    title: "Faktur Tagihan & Spare Parts Emergency Silinder Hidrolik United Tractors",
    category: "INVOICE",
    department: "Commercial & Finance",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-08-04",
    author: "PT United Tractors Tbk (Branch Balikpapan)",
    reviewer: "Finance AP Staff",
    approvedBy: "Procurement Manager",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 1.4,
    tags: ["Invoice", "United Tractors", "Komatsu", "Spare Parts", "Hydraulic Cylinder", "EX-204", "Faktur Pajak"],
    equipmentTags: ["EX-204", "PC1250"],
    locationScope: "Sangatta Central Workshop",
    summary:
      "Faktur tagihan pengadaan darurat (Emergency PO) suku cadang Hydraulic Boom & Arm Seal Kit serta Cylinder Rebuild untuk unit Excavator Komatsu PC1250 EX-204 sebesar Rp 385.000.000 (Termasuk PPN 11% dan Air Freight Balikpapan - Sangatta).",
    fullTextContent: `COMMERCIAL INVOICE & TAX INVOICE
Invoice No: INV-UT-2026-9041
Customer  : PT MINE SMART NUSANTARA
PO Ref    : PO-MNT-EMERGENCY-2026-0804

RINCIAN BARANG:
1. Cylinder Hydraulic Boom Ass'y (Part No. 707-01-0V210): 1 Unit = Rp 290.000.000
2. Seal Kit Complete High-Pressure: 2 Set @ Rp 28.000.000 = Rp 56.000.000
3. Expedited Charter Air Freight Balikpapan to Sangatta Airstrip: Rp 39.000.000
Total Tagihan Netto: Rp 385.000.000 (Three Hundred Eighty-Five Million Rupiah).
Termin: Net 14 Days.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-08-04", author: "United Tractors", changes: "Invoice diterbitkan", approvedBy: "Procurement Mgr" },
    ],
    downloadCount: 30,
    createdAt: "2026-08-04T10:00:00Z",
    updatedAt: "2026-08-05T09:00:00Z",
  },
  {
    id: "doc-inv-002",
    documentNumber: "INV-PTPN-2026-8812",
    title: "Tagihan Delivery BBM Solar B35 (42.000 Liter) PT Pertamina Patra Niaga",
    category: "INVOICE",
    department: "Commercial & Finance",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-08-02",
    author: "PT Pertamina Patra Niaga",
    reviewer: "Fuel Logistics Officer",
    approvedBy: "Finance Manager",
    confidentiality: "RESTRICTED",
    fileType: "PDF",
    fileSizeMB: 1.6,
    tags: ["Invoice", "Fuel", "Solar B35", "Pertamina", "Tagihan BBM", "Faktur Pajak"],
    locationScope: "Main Fuel Storage Tank",
    summary:
      "Invoice penyerahan bahan bakar solar B35 sebanyak 42.000 Liter dengan mobil tangki bridger 2 x 21.000 L nilai total Rp 632.250.000 (Harga MOPS index formula terlampir).",
    fullTextContent: `INVOICE PERTAMINA PATRA NIAGA No. 8812/PTPN/VIII/2026
Volume: 42.000 Liter BioSolar B35 • Nilai Total: Rp 632.250.000 Termasuk PPN & PBBKB. Status: Approved for Payment.`,
    revisionHistory: [
      { version: "v1.0", date: "2026-08-02", author: "Pertamina", changes: "Invoice terverifikasi", approvedBy: "Finance Mgr" },
    ],
    downloadCount: 22,
    createdAt: "2026-08-02T13:00:00Z",
    updatedAt: "2026-08-03T11:00:00Z",
  },

  // ================= 9. INSPECTION =================
  {
    id: "doc-ins-001",
    documentNumber: "INS-HSE-SED-023",
    title: "Laporan Inspeksi Keselamatan Kolam Pengendap Sedimen (Settling Pond 3 & Sump)",
    category: "INSPECTION",
    department: "HSE & Environment",
    version: "v1.0",
    status: "ACTIVE",
    effectiveDate: "2026-08-10",
    author: "Rian Firmansyah (HSE Inspector)",
    reviewer: "Doni Prasetyo",
    approvedBy: "Rahmat Hidayat (KTT)",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 4.1,
    tags: ["Inspection", "Settling Pond", "Kolam Sedimen", "HSE", "K3", "Dewatering", "Dike Stability"],
    locationScope: "Settling Pond 3 Pit 1 South Outfall",
    complianceStandard: "Petunjuk Teknis Pengelolaan Air Asam Tambang & Dam K3 ESDM",
    summary:
      "Hasil inspeksi rutin mingguan integritas tanggul penahan kolam endapan (Sediment Pond SP-3). Kondisi tanggul luar bebas dari rembesan/piping, freeboard tanggul aman 1.8 meter, kapasitas pengendapan sedimen masih tersisa 42%, unit dosing kapur tohor (lime treatment) berfungsi optimal.",
    fullTextContent: `FORM LAPORAN INSPEKSI DAM & SETTLING POND
Tanggal Inspeksi : 10 Agustus 2026
Lokasi           : Settling Pond 3 (SP-3) Outflow Pit 1 South

CHECKLIST INSPEKSI:
[PASS] 1. Integritas Fisik Tanggul Penahan (Tidak ada retakan / piping)
[PASS] 2. Ketinggian Jagaan Air (Freeboard = 1.80 meter / Standar min 1.0 m)
[PASS] 3. Saluran Pelimpah (Spillway) Bebas dari sumbatan vegetasi
[PASS] 4. Sistem Pengapuran Otomatis (pH buffer 7.0 - 7.5)
[PASS] 5. Tanda Peringatan Kedalaman Air & Pelampung Life Buoy terpasang lengkap
Catatan: Jadwalkan pengerukan lumpur (desilting) dengan Excavator Long Arm pada minggu ke-4 Agustus.`,
    checklistItems: [
      { item: "Integritas Tanggul (Dam Crest Stability)", standard: "Bebas retakan >2cm", status: "PASS" },
      { item: "Freeboard Ketinggian Jagaan", standard: "Minimal 1.0 meter", status: "PASS" },
      { item: "Sirkulasi Dosing Neutralizer pH", standard: "pH 6.0 - 9.0", status: "PASS" },
      { item: "Ketersediaan Life Ring & Pelampung Darurat", standard: "Terpasang di 4 sisi", status: "PASS" },
    ],
    revisionHistory: [
      { version: "v1.0", date: "2026-08-10", author: "Rian Firmansyah", changes: "Inspeksi mingguan selesai", approvedBy: "Rahmat Hidayat" },
    ],
    downloadCount: 48,
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-10T09:00:00Z",
  },
  {
    id: "doc-ins-002",
    documentNumber: "INS-MNT-PREUSE-EX",
    title: "Daily Pre-Use Safety & Mechanical Checklist Excavator Komatsu PC1250 EX-204",
    category: "INSPECTION",
    department: "Plant Maintenance",
    version: "v1.1",
    status: "ACTIVE",
    effectiveDate: "2026-08-14",
    author: "Ahmad Zaini (Operator Shift 1)",
    reviewer: "Foreman Pit 1",
    approvedBy: "Bambang Sudiro",
    confidentiality: "INTERNAL",
    fileType: "PDF",
    fileSizeMB: 1.2,
    tags: ["Inspection", "Pre-Use Checklist", "P2H", "Excavator", "PC1250", "EX-204", "Safety"],
    equipmentTags: ["EX-204", "PC1250"],
    locationScope: "Pit 1 South Loading Bay A",
    summary:
      "Formulir P2H (Pemeriksaan Harian Kendaraan/Alat) harian operator shift 1 unit EX-204. Level oli mesin normal, level cairan hidrolik normal, indikator suhu temperatur pendingin 85°C aman, APAR terisi penuh.",
    fullTextContent: `LEMBAR PEMERIKSAAN HARIAN (P2H) EXCAVATOR EX-204
Tanggal: 14 Agustus 2026 • Shift: 1 (07:00 - 19:00)
• Level Engine Oil: OK (Level H)
• Level Hydraulic Oil: OK
• Radiator Coolant: OK
• APAR Tekanan: Hijau / Ready
• Emergency Stop Button: Functional Test PASSED.`,
    checklistItems: [
      { item: "Level Oli Mesin & Oli Hidrolik", standard: "Antara tanda L dan H", status: "PASS" },
      { item: "Emergency Stop Button & Klakson", standard: "Berfungsi saat ditekan", status: "PASS" },
      { item: "Lampu Kerja & Rotary Lamp", standard: "Menyala terang", status: "PASS" },
      { item: "Kondisi Tooth Bucket & Pin Lock", standard: "Tidak longgar/hilang", status: "PASS" },
    ],
    revisionHistory: [
      { version: "v1.1", date: "2026-08-14", author: "Ahmad Zaini", changes: "P2H Harian Shift 1 Lengkap", approvedBy: "Bambang Sudiro" },
    ],
    downloadCount: 19,
    createdAt: "2026-08-14T07:15:00Z",
    updatedAt: "2026-08-14T07:15:00Z",
  },
];

export const getInitialDocumentStats = (docs: DocumentItem[]): DocumentStats => {
  return {
    totalDocuments: docs.length,
    sopCount: docs.filter((d) => d.category === "SOP").length,
    workInstructionCount: docs.filter((d) => d.category === "WORK_INSTRUCTION").length,
    contractCount: docs.filter((d) => d.category === "CONTRACT").length,
    permitCount: docs.filter((d) => d.category === "PERMIT").length,
    drawingCount: docs.filter((d) => d.category === "DRAWING").length,
    reportCount: docs.filter((d) => d.category === "REPORT").length,
    certificateCount: docs.filter((d) => d.category === "CERTIFICATE").length,
    invoiceCount: docs.filter((d) => d.category === "INVOICE").length,
    inspectionCount: docs.filter((d) => d.category === "INSPECTION").length,
    activeCount: docs.filter((d) => d.status === "ACTIVE").length,
    underReviewCount: docs.filter((d) => d.status === "UNDER_REVIEW").length,
    expiringSoonCount: 2, // e.g. Permits/Contracts expiring in <60 days
    expiredCount: docs.filter((d) => d.status === "EXPIRED").length,
  };
};
