// MINE SMART AI - GIS & Spatial Data Service
// Menyediakan data spasial 17 Layer Pertambangan, Map Tools, dan Pelacakan Live Equipment

import {
  SpatialEntity,
  GISLayer,
  LatLng,
  GISFilterState,
  MeasurementResult,
  MeasurementMode,
  GeoFenceAlert,
  GISSpatialAnalysisResult,
  SpatialObjectType,
  EquipmentCategory,
} from "../../modules/gis/types/gisTypes";

// 17 Complete Mining GIS Layers as requested
export const INITIAL_GIS_LAYERS: GISLayer[] = [
  {
    id: "layer-pits",
    name: "Pit (Batas Galian Tambang)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.85,
    color: "#10B981", // Emerald
    iconName: "Pickaxe",
    count: 3,
    description: "Batas aktif Pit North, Pit Central, Pit South, bench crest & toe",
  },
  {
    id: "layer-blocks",
    name: "Block (Blok Penambangan)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.7,
    color: "#3B82F6", // Blue
    iconName: "Grid",
    count: 4,
    description: "Sektor blok penambangan bulanan dan tahunan (Block 01A - 03C)",
  },
  {
    id: "layer-seams",
    name: "Seam (Lapisan Batubara)",
    group: "GEOLOGY",
    visible: true,
    opacity: 0.8,
    color: "#F59E0B", // Amber
    iconName: "Layers",
    count: 4,
    description: "Outcrop dan kontur perlapisan Seam 30, Seam 28, Seam 24, Seam 18",
  },
  {
    id: "layer-roads",
    name: "Hauling Road (Jalan Angkut)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.9,
    color: "#EAB308", // Yellow
    iconName: "Route",
    count: 3,
    description: "Jalan angkut tambang utama, rute hauling batubara & overburden",
  },
  {
    id: "layer-disposal",
    name: "Disposal (Area Penimbunan OB)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.75,
    color: "#14B8A6", // Teal
    iconName: "Mountain",
    count: 2,
    description: "Area penimbunan overburden (Out-Pit Waste Dump & In-Pit Dump)",
  },
  {
    id: "layer-stockpile",
    name: "Stockpile (Stok ROM & Port)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.85,
    color: "#8B5CF6", // Purple
    iconName: "Boxes",
    count: 3,
    description: "Stockpile ROM utama, intermediate stockpile, dan jetty port",
  },
  {
    id: "layer-rom",
    name: "ROM (Run-of-Mine Pad)",
    group: "OPERATIONAL",
    visible: true,
    opacity: 0.8,
    color: "#D946EF", // Fuchsia
    iconName: "Flame",
    count: 3,
    description: "ROM Pad penumpukan batubara per grade kalori & moisture",
  },
  {
    id: "layer-crusher",
    name: "Crusher (Crushing Plant)",
    group: "INFRASTRUCTURE",
    visible: true,
    opacity: 0.9,
    color: "#EF4444", // Red
    iconName: "Cpu",
    count: 2,
    description: "Crushing Plant 1 (800 TPH), Crusher 2 (1200 TPH), Hopper & Conveyor",
  },
  {
    id: "layer-workshop",
    name: "Workshop (Bengkel Alat Berat)",
    group: "INFRASTRUCTURE",
    visible: true,
    opacity: 0.9,
    color: "#6366F1", // Indigo
    iconName: "Wrench",
    count: 3,
    description: "Main Workshop, Heavy Equipment Repair Bay, Tyre Shop, Lube Station",
  },
  {
    id: "layer-fuel-station",
    name: "Fuel Station (Stasiun Solar)",
    group: "INFRASTRUCTURE",
    visible: true,
    opacity: 0.9,
    color: "#F97316", // Orange
    iconName: "Fuel",
    count: 2,
    description: "Fuel Storage Tank 500kL, Fuel Station Pit North & Port Dispenser",
  },
  {
    id: "layer-office",
    name: "Office (Kantor & Dispatch)",
    group: "INFRASTRUCTURE",
    visible: true,
    opacity: 0.85,
    color: "#0EA5E9", // Sky
    iconName: "Building2",
    count: 2,
    description: "Main Site Office, Engineering & Survey Office, Dispatch Control Room",
  },
  {
    id: "layer-camp",
    name: "Camp (Mess & Fasilitas Karyawan)",
    group: "INFRASTRUCTURE",
    visible: true,
    opacity: 0.8,
    color: "#A855F7", // Purple light
    iconName: "Home",
    count: 2,
    description: "Camp Alpha Mess Karyawan, Camp Beta, Kantin & Klinik Kesehatan Tambang",
  },
  {
    id: "layer-drainage",
    name: "Drainage (Saluran Air & Sump)",
    group: "ENVIRONMENT",
    visible: true,
    opacity: 0.85,
    color: "#0284C7", // Blue dark
    iconName: "Waves",
    count: 3,
    description: "Saluran drainase tambang, sump pump pit S-01, dan paritan runoff",
  },
  {
    id: "layer-settling-pond",
    name: "Settling Pond (Kolam Pengendapan)",
    group: "ENVIRONMENT",
    visible: true,
    opacity: 0.85,
    color: "#059669", // Emerald dark
    iconName: "Droplets",
    count: 2,
    description: "Kolam pengendapan sedimentasi KPL-01, KPL-02, dan Safety Weir pH",
  },
  {
    id: "layer-equipment",
    name: "Equipment (Live Fleet GPS Map)",
    group: "FLEET",
    visible: true,
    opacity: 1.0,
    color: "#EC4899", // Pink
    iconName: "Truck",
    count: 14,
    description: "GPS Live Tracking Excavator, Dump Truck, Dozer, Grader, Water Truck, LV",
  },
  {
    id: "layer-survey-point",
    name: "Survey Point (Benchmark & GCP)",
    group: "SURVEY",
    visible: true,
    opacity: 0.95,
    color: "#06B6D4", // Cyan
    iconName: "Crosshair",
    count: 4,
    description: "Titik Benchmark BM-01, BM-02, Patok Batas IUP, Drone LiDAR GCP",
  },
  {
    id: "layer-borehole",
    name: "Borehole (Titik Bor Eksplorasi)",
    group: "GEOLOGY",
    visible: true,
    opacity: 0.9,
    color: "#84CC16", // Lime
    iconName: "Target",
    count: 4,
    description: "Titik bor eksplorasi BH-101 s/d BH-108, data seam depth & core logging",
  },
];

// Rich Mock Spatial Data for All 17 Layers and All Equipment Categories
export const MOCK_SPATIAL_ENTITIES: SpatialEntity[] = [
  // ================= 1. PITS =================
  {
    id: "sp-pit-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Pit 1 South - Main Production Face",
    code: "PIT-01-S",
    type: "PIT",
    layerId: "layer-pits",
    status: "OPERATING",
    rlElevation: "RL +45.0m s/d RL -15.0m",
    centerCoordinates: { lat: -0.4921, lng: 117.142 },
    polygonCoordinates: [
      { lat: -0.488, lng: 117.135 },
      { lat: -0.485, lng: 117.146 },
      { lat: -0.493, lng: 117.151 },
      { lat: -0.498, lng: 117.142 },
      { lat: -0.494, lng: 117.134 },
    ],
    utmString: "50S 515820 m E 9945620 m N",
    areaHa: 142.5,
    volumeM3: 4500000,
    description: "Pit utama penambangan batubara Seam 30 High Grade. Dilengkapi 2 Excavator CAT 6020B & 12 Haul Truck HD785.",
    properties: [
      { label: "Target Produksi", value: "350,000 MT/Bulan", badgeColor: "emerald" },
      { label: "Actual Strip Ratio", value: "5.2 : 1 BCM/Ton" },
      { label: "Total Equipment Active", value: "14 Unit" },
      { label: "Dewatering Sump Level", value: "RL -18.5m (Safe)" },
      { label: "Slope Stability Index", value: "1.38 (FK Aman)" },
    ],
  },
  {
    id: "sp-pit-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Pit 2 North - Overburden Stripping",
    code: "PIT-02-N",
    type: "PIT",
    layerId: "layer-pits",
    status: "OPERATING",
    rlElevation: "RL +85.0m s/d RL +20.0m",
    centerCoordinates: { lat: -0.478, lng: 117.155 },
    polygonCoordinates: [
      { lat: -0.474, lng: 117.148 },
      { lat: -0.472, lng: 117.161 },
      { lat: -0.482, lng: 117.164 },
      { lat: -0.484, lng: 117.151 },
    ],
    utmString: "50S 517260 m E 9947180 m N",
    areaHa: 98.2,
    volumeM3: 3100000,
    description: "Pit pengembangan sisi utara fokus pengupasan overburden interburden Seam 28.",
    properties: [
      { label: "Target OB Removal", value: "650,000 BCM/Bulan", badgeColor: "emerald" },
      { label: "Fleet Loading", value: "Komatsu PC2000 (EX-01)" },
      { label: "Slope Face Angle", value: "42 Derajat (Stabil)" },
    ],
  },
  {
    id: "sp-pit-03",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Pit 3 Central - Coal Getting",
    code: "PIT-03-C",
    type: "PIT",
    layerId: "layer-pits",
    status: "OPERATING",
    rlElevation: "RL +30.0m s/d RL -5.0m",
    centerCoordinates: { lat: -0.485, lng: 117.139 },
    polygonCoordinates: [
      { lat: -0.482, lng: 117.134 },
      { lat: -0.481, lng: 117.143 },
      { lat: -0.488, lng: 117.145 },
      { lat: -0.489, lng: 117.136 },
    ],
    utmString: "50S 515480 m E 9946400 m N",
    areaHa: 64.0,
    volumeM3: 1800000,
    description: "Pit transisi tengah dengan cadangan batubara Seam 24 kalori tinggi.",
    properties: [
      { label: "Target Produksi", value: "180,000 MT/Bulan", badgeColor: "emerald" },
      { label: "Quality Forecast", value: "GAR 4,350 kcal/kg" },
    ],
  },

  // ================= 2. BLOCKS =================
  {
    id: "sp-block-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Mining Block 01A - Seam 30 South",
    code: "BLK-01A",
    type: "BLOCK",
    layerId: "layer-blocks",
    status: "ACTIVE",
    rlElevation: "RL +25.0m s/d RL +10.0m",
    centerCoordinates: { lat: -0.4905, lng: 117.139 },
    polygonCoordinates: [
      { lat: -0.489, lng: 117.136 },
      { lat: -0.487, lng: 117.142 },
      { lat: -0.492, lng: 117.144 },
      { lat: -0.493, lng: 117.138 },
    ],
    utmString: "50S 515480 m E 9945800 m N",
    areaHa: 28.4,
    volumeM3: 890000,
    description: "Blok penambangan aktif kuartal berjalan. Rencana kemajuan tambang ke arah Timur.",
    properties: [
      { label: "Rencana Penambangan", value: "RKAB Q3 2026", badgeColor: "blue" },
      { label: "Cadangan Tersedia", value: "245,000 Ton Batubara" },
    ],
  },
  {
    id: "sp-block-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Mining Block 02B - Overburden Push",
    code: "BLK-02B",
    type: "BLOCK",
    layerId: "layer-blocks",
    status: "ACTIVE",
    rlElevation: "RL +60.0m s/d RL +40.0m",
    centerCoordinates: { lat: -0.476, lng: 117.157 },
    polygonCoordinates: [
      { lat: -0.474, lng: 117.153 },
      { lat: -0.473, lng: 117.162 },
      { lat: -0.478, lng: 117.163 },
      { lat: -0.479, lng: 117.155 },
    ],
    utmString: "50S 517480 m E 9947400 m N",
    areaHa: 34.1,
    volumeM3: 1150000,
    description: "Blok pengupasan batuan penutup pit utara.",
    properties: [
      { label: "Target Stripping", value: "320,000 BCM" },
      { label: "Alat Aktif", value: "EX-01 + 4 Dump Trucks" },
    ],
  },

  // ================= 3. SEAMS =================
  {
    id: "sp-seam-30",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Coal Seam 30 Outcrop (High Grade GAR 4200)",
    code: "SEAM-30",
    type: "SEAM",
    layerId: "layer-seams",
    status: "ACTIVE",
    rlElevation: "RL +18.0m (Dip 12° SE)",
    centerCoordinates: { lat: -0.493, lng: 117.145 },
    polygonCoordinates: [
      { lat: -0.49, lng: 117.141 },
      { lat: -0.488, lng: 117.148 },
      { lat: -0.495, lng: 117.153 },
      { lat: -0.497, lng: 117.145 },
    ],
    utmString: "50S 516150 m E 9945520 m N",
    areaHa: 45.8,
    qualityGar: 4210,
    description: "Lapisan seam batubara utama dengan ketebalan rata-rata 6.8 meter, kemiringan 12 derajat ke arah Tenggara.",
    properties: [
      { label: "Kalori Rata-rata", value: "4,210 kcal/kg GAR", badgeColor: "amber" },
      { label: "Ketebalan Seam", value: "6.8 Meter (True Thickness)" },
      { label: "Total Moisture", value: "34.2 %" },
      { label: "Ash Content", value: "5.4 % (Low Ash)" },
      { label: "Total Sulfur", value: "0.48 % (Low Sulfur Eco-Coal)" },
    ],
  },
  {
    id: "sp-seam-28",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Coal Seam 28 Interburden Zone",
    code: "SEAM-28",
    type: "SEAM",
    layerId: "layer-seams",
    status: "ACTIVE",
    rlElevation: "RL +42.0m (Dip 10° SE)",
    centerCoordinates: { lat: -0.481, lng: 117.158 },
    polygonCoordinates: [
      { lat: -0.478, lng: 117.152 },
      { lat: -0.477, lng: 117.163 },
      { lat: -0.484, lng: 117.165 },
      { lat: -0.485, lng: 117.154 },
    ],
    utmString: "50S 517590 m E 9946850 m N",
    areaHa: 38.0,
    qualityGar: 4050,
    description: "Lapisan seam batubara sekunder dengan ketebalan 4.2 meter.",
    properties: [
      { label: "Kalori Rata-rata", value: "4,050 kcal/kg GAR" },
      { label: "Ketebalan Seam", value: "4.2 Meter" },
      { label: "Ash Content", value: "6.2 %" },
    ],
  },

  // ================= 4. HAULING ROADS =================
  {
    id: "sp-road-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main Haul Road 01 (Pit 1 to Crusher & ROM)",
    code: "HR-MAIN-01",
    type: "ROAD",
    layerId: "layer-roads",
    status: "OPERATING",
    rlElevation: "RL +40.0m s/d RL +12.0m",
    centerCoordinates: { lat: -0.493, lng: 117.135 },
    pathCoordinates: [
      { lat: -0.495, lng: 117.143 },
      { lat: -0.493, lng: 117.137 },
      { lat: -0.496, lng: 117.13 },
      { lat: -0.501, lng: 117.126 },
      { lat: -0.504, lng: 117.121 },
    ],
    utmString: "50S 515050 m E 9945520 m N",
    lengthKm: 4.85,
    description: "Jalan angkut batubara 2-lane selebar 28 meter dengan crossfall 3% dan drainase beton di kedua sisi.",
    properties: [
      { label: "Panjang Jalur", value: "4.85 KM", badgeColor: "yellow" },
      { label: "Lebar Jalan Angkut", value: "28.0 Meter (3.5x Lebar HD785)" },
      { label: "Grade Maksimum", value: "7.8 % (Standar Aman K3)" },
      { label: "Batas Kecepatan", value: "Maks. 40 km/jam" },
      { label: "Trafik Aktif", value: "18 Ritase / Jam" },
    ],
  },
  {
    id: "sp-road-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Overburden Haul Road to Disposal North",
    code: "HR-OB-02",
    type: "ROAD",
    layerId: "layer-roads",
    status: "OPERATING",
    rlElevation: "RL +65.0m s/d RL +95.0m",
    centerCoordinates: { lat: -0.472, lng: 117.148 },
    pathCoordinates: [
      { lat: -0.478, lng: 117.155 },
      { lat: -0.474, lng: 117.151 },
      { lat: -0.469, lng: 117.145 },
      { lat: -0.465, lng: 117.142 },
    ],
    utmString: "50S 516480 m E 9947840 m N",
    lengthKm: 3.2,
    description: "Jalan angkut batuan overburden menuju waste dump utara.",
    properties: [
      { label: "Panjang Jalur", value: "3.2 KM" },
      { label: "Lebar Jalan", value: "32.0 Meter (Heavy Duty)" },
      { label: "Grade Rata-rata", value: "6.2 %" },
    ],
  },

  // ================= 5. DISPOSAL =================
  {
    id: "sp-disp-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Out-Pit Disposal North Waste Dump",
    code: "DSP-NORTH-01",
    type: "DISPOSAL",
    layerId: "layer-disposal",
    status: "ACTIVE",
    rlElevation: "RL +60.0m s/d RL +110.0m (Lift 4)",
    centerCoordinates: { lat: -0.463, lng: 117.138 },
    polygonCoordinates: [
      { lat: -0.46, lng: 117.132 },
      { lat: -0.458, lng: 117.144 },
      { lat: -0.466, lng: 117.147 },
      { lat: -0.468, lng: 117.135 },
    ],
    utmString: "50S 515380 m E 9948830 m N",
    areaHa: 112.0,
    volumeM3: 12500000,
    description: "Area penimbunan overburden utama dengan sistem multi-lift terracing, slope angle 28° dan drainase berundak.",
    properties: [
      { label: "Kapasitas Desain", value: "18,000,000 BCM", badgeColor: "teal" },
      { label: "Volume Terisi", value: "12,500,000 BCM (69.4%)" },
      { label: "Jumlah Dozer Aktif", value: "2 Unit CAT D10T" },
      { label: "Stabilitas Lereng", value: "FK = 1.45 (Stabil Aman)" },
    ],
  },

  // ================= 6. STOCKPILE =================
  {
    id: "sp-stock-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main ROM Stockpile Area Sangatta",
    code: "STK-MAIN-01",
    type: "STOCKPILE",
    layerId: "layer-stockpile",
    status: "ACTIVE",
    rlElevation: "RL +15.0m (Flat Hardstand)",
    centerCoordinates: { lat: -0.506, lng: 117.118 },
    polygonCoordinates: [
      { lat: -0.503, lng: 117.114 },
      { lat: -0.502, lng: 117.123 },
      { lat: -0.509, lng: 117.124 },
      { lat: -0.51, lng: 117.115 },
    ],
    utmString: "50S 513170 m E 9944080 m N",
    areaHa: 38.6,
    capacityMT: 220000,
    currentTonnageMT: 184500,
    qualityGar: 4210,
    description: "Stockpile utama ROM batubara terbagi 6 dome berdasarkan spesifikasi kalori. Dilengkapi sprinkler anti debu.",
    properties: [
      { label: "Stok Saat Ini", value: "184,500 Ton", badgeColor: "purple" },
      { label: "Kapasitas Maksimal", value: "220,000 Ton (Okupansi 83.9%)" },
      { label: "Uji Lab Kualitas", value: "GAR 4,210 kcal, TS 0.48%, Ash 5.4%" },
      { label: "Suhu Batubara", value: "38.2°C (Aman dari Self-Combustion)" },
      { label: "Target Barging", value: "12,500 Ton (2 Tongkang Hari Ini)" },
    ],
  },

  // ================= 7. ROM =================
  {
    id: "sp-rom-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "ROM Pad Pit North - High CV Zone",
    code: "ROM-PAD-01",
    type: "ROM",
    layerId: "layer-rom",
    status: "ACTIVE",
    rlElevation: "RL +22.0m",
    centerCoordinates: { lat: -0.483, lng: 117.147 },
    polygonCoordinates: [
      { lat: -0.481, lng: 117.144 },
      { lat: -0.48, lng: 117.15 },
      { lat: -0.485, lng: 117.151 },
      { lat: -0.486, lng: 117.145 },
    ],
    utmString: "50S 516360 m E 9946620 m N",
    areaHa: 14.5,
    capacityMT: 80000,
    currentTonnageMT: 58200,
    description: "ROM Pad perantara penumpukan batubara bersih sebelum ditransportasikan ke Crushing Plant.",
    properties: [
      { label: "Tonnage Aktif", value: "58,200 MT", badgeColor: "purple" },
      { label: "Spesifikasi", value: "Seam 30 Premium Clean Coal" },
      { label: "Kalori", value: "GAR 4,320 kcal/kg" },
    ],
  },

  // ================= 8. CRUSHER =================
  {
    id: "sp-crusher-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Crushing Plant 01 & Sizing Screen (800 TPH)",
    code: "CRUSH-01",
    type: "CRUSHER",
    layerId: "layer-crusher",
    status: "OPERATING",
    rlElevation: "RL +16.0m",
    centerCoordinates: { lat: -0.5045, lng: 117.1205 },
    polygonCoordinates: [
      { lat: -0.5035, lng: 117.1185 },
      { lat: -0.503, lng: 117.1225 },
      { lat: -0.506, lng: 117.123 },
      { lat: -0.5065, lng: 117.119 },
    ],
    utmString: "50S 513450 m E 9944250 m N",
    areaHa: 6.2,
    description: "Fasilitas peremukan batubara ganda dengan kapasitas 800 Ton/Jam, dilengkapi metal detector & dust collector.",
    properties: [
      { label: "Kapasitas Desain", value: "800 TPH (Running at 740 TPH)", badgeColor: "emerald" },
      { label: "Throughput Hari Ini", value: "11,840 Ton Batubara" },
      { label: "Produk Output", value: "Crushed Coal Size 0 - 50 mm" },
      { label: "Status Hopper", value: "Operasional Normal (Dump Queue: 2 DT)" },
    ],
  },

  // ================= 9. WORKSHOP =================
  {
    id: "sp-ws-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main Heavy Equipment Workshop & Tyre Bay",
    code: "WS-MAIN-01",
    type: "WORKSHOP",
    layerId: "layer-workshop",
    status: "ACTIVE",
    rlElevation: "RL +18.0m",
    centerCoordinates: { lat: -0.501, lng: 117.114 },
    polygonCoordinates: [
      { lat: -0.499, lng: 117.111 },
      { lat: -0.498, lng: 117.117 },
      { lat: -0.503, lng: 117.118 },
      { lat: -0.504, lng: 117.112 },
    ],
    utmString: "50S 512720 m E 9944640 m N",
    areaHa: 12.0,
    description: "Bengkel pemeliharaan alat berat terpadu dengan 8 maintenance bays, overhead crane 25T, dan fasilitas oil sampling.",
    properties: [
      { label: "Unit Under Repair", value: "5 Unit (2 Scheduled, 3 Breakdown)", badgeColor: "indigo" },
      { label: "Mechanical Availability (MA)", value: "91.2 %" },
      { label: "Fasilitas", value: "Tyre Shop, Lube Station, Component Rebuild" },
      { label: "Emergency Response Bay", value: "Ready 24/7" },
    ],
  },

  // ================= 10. FUEL STATION =================
  {
    id: "sp-fuel-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main Fuel Storage & High-Speed Dispenser (500 kL)",
    code: "FS-MAIN-01",
    type: "FUEL_STATION",
    layerId: "layer-fuel-station",
    status: "ACTIVE",
    rlElevation: "RL +19.0m",
    centerCoordinates: { lat: -0.498, lng: 117.119 },
    polygonCoordinates: [
      { lat: -0.4965, lng: 117.1175 },
      { lat: -0.496, lng: 117.121 },
      { lat: -0.4995, lng: 117.1215 },
      { lat: -0.5, lng: 117.118 },
    ],
    utmString: "50S 513280 m E 9944970 m N",
    areaHa: 4.5,
    description: "Stasiun pengisian solar industri B35 dengan 4 tangki timbun vertikal 500.000 Liter dan sistem ATG digital.",
    properties: [
      { label: "Stok Solar Saat Ini", value: "382,400 Liter (76.5%)", badgeColor: "orange" },
      { label: "Konsumsi 24 Jam", value: "48,500 Liter" },
      { label: "Fuel Dispenser Speed", value: "Fast Fueling 300 LPM (Wiggins)" },
      { label: "Kualitas Solar", value: "B35 Biosolar Filtered (ISO 4406)" },
    ],
  },

  // ================= 11. OFFICE =================
  {
    id: "sp-off-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main Site Office & Dispatch Command Center",
    code: "OFF-MAIN-01",
    type: "OFFICE",
    layerId: "layer-office",
    status: "ACTIVE",
    rlElevation: "RL +24.0m",
    centerCoordinates: { lat: -0.494, lng: 117.115 },
    polygonCoordinates: [
      { lat: -0.4925, lng: 117.113 },
      { lat: -0.492, lng: 117.117 },
      { lat: -0.4955, lng: 117.1175 },
      { lat: -0.496, lng: 117.1135 },
    ],
    utmString: "50S 512830 m E 9945410 m N",
    areaHa: 3.8,
    description: "Pusat komando operasional tambang, ruang kerja KTT, Engineering, Geology, Survey, dan Ruang Dispatch FMS.",
    properties: [
      { label: "Fasilitas", value: "FMS Control Room, AI Server, Meeting Hall", badgeColor: "sky" },
      { label: "Konektivitas", value: "Starlink High-Speed + Private LTE Mesh" },
      { label: "Personel On-Duty", value: "48 Staff & Engineers" },
    ],
  },

  // ================= 12. CAMP =================
  {
    id: "sp-camp-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Camp Alpha Employee Residence & Clinic",
    code: "CAMP-ALPHA-01",
    type: "CAMP",
    layerId: "layer-camp",
    status: "ACTIVE",
    rlElevation: "RL +26.0m",
    centerCoordinates: { lat: -0.488, lng: 117.112 },
    polygonCoordinates: [
      { lat: -0.485, lng: 117.108 },
      { lat: -0.484, lng: 117.116 },
      { lat: -0.491, lng: 117.117 },
      { lat: -0.492, lng: 117.109 },
    ],
    utmString: "50S 512500 m E 9946080 m N",
    areaHa: 16.2,
    description: "Kompleks perumahan mess karyawan dengan kapasitas 450 bed, kantin 24 jam, sarana olahraga, dan klinik K3.",
    properties: [
      { label: "Okupansi Mess", value: "364 / 450 Tempat Tidur (80.9%)", badgeColor: "purple" },
      { label: "Klinik Tambang", value: "Dokter Hiperkes & Paramedis Standby 24/7" },
      { label: "Ambulans Siaga", value: "2 Unit 4x4 Emergency Rescue" },
    ],
  },

  // ================= 13. DRAINAGE =================
  {
    id: "sp-drain-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Main Pit Drainage & Dewatering Sump S-01",
    code: "DRN-SUMP-01",
    type: "DRAINAGE",
    layerId: "layer-drainage",
    status: "ACTIVE",
    rlElevation: "RL -18.5m",
    centerCoordinates: { lat: -0.496, lng: 117.146 },
    polygonCoordinates: [
      { lat: -0.494, lng: 117.143 },
      { lat: -0.493, lng: 117.149 },
      { lat: -0.498, lng: 117.15 },
      { lat: -0.499, lng: 117.144 },
    ],
    utmString: "50S 516260 m E 9945190 m N",
    areaHa: 8.5,
    volumeM3: 450000,
    description: "Sump penampungan air tambang terendah Pit South. Dilengkapi 3 unit pompa dewatering Multiflo 420.",
    properties: [
      { label: "Kapasitas Tampung Sump", value: "450,000 m³ Air", badgeColor: "blue" },
      { label: "Water Level", value: "RL -18.5m (Kapasitas Aman 64%)" },
      { label: "Debit Pemompaan", value: "1,200 m³/Jam menuju Settling Pond" },
      { label: "Status Pompa", value: "2 Running, 1 Standby" },
    ],
  },

  // ================= 14. SETTLING POND =================
  {
    id: "sp-pond-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Sedimentation Settling Pond KPL-01 & Safety Weir",
    code: "KPL-01",
    type: "SETTLING_POND",
    layerId: "layer-settling-pond",
    status: "ACTIVE",
    rlElevation: "RL +8.0m",
    centerCoordinates: { lat: -0.512, lng: 117.128 },
    polygonCoordinates: [
      { lat: -0.508, lng: 117.124 },
      { lat: -0.507, lng: 117.133 },
      { lat: -0.516, lng: 117.134 },
      { lat: -0.517, lng: 117.125 },
    ],
    utmString: "50S 514280 m E 9943420 m N",
    areaHa: 24.0,
    volumeM3: 320000,
    description: "Kolam pengendapan lumpur 4 kompartemen dengan dosing kapur otomatis & pengukur TSS baku mutu lingkungan.",
    properties: [
      { label: "Kadar TSS Effluent", value: "42 mg/L (Baku Mutu < 300 mg/L)", badgeColor: "emerald" },
      { label: "Tingkat Keasaman (pH)", value: "pH 7.15 (Netral Aman Baku Mutu 6-9)" },
      { label: "Kapasitas Kompartemen", value: "Kompartemen 1 s/d 4 Normal" },
      { label: "Monitoring Sensor", value: "Online Telemetry KLHK Terhubung" },
    ],
  },

  // ================= 15. EQUIPMENT (LIVE FLEET GPS) =================
  // --- EXCAVATORS ---
  {
    id: "sp-eq-ex-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Excavator CAT 6020B (EX-01) - Pit North",
    code: "EX-01",
    type: "EQUIPMENT",
    equipmentCategory: "EXCAVATOR",
    layerId: "layer-equipment",
    status: "LOADING",
    rlElevation: "RL +24.0m",
    centerCoordinates: { lat: -0.4782, lng: 117.1565 },
    utmString: "50S 517420 m E 9947150 m N",
    speedKmh: 0,
    fuelLevelPercent: 78,
    operatorName: "Agus Pratama",
    payloadTon: 24.5,
    shiftCycleCount: 68,
    description: "Heavy Excavator 220-ton loading batuan overburden ke Dump Truck HD785.",
    properties: [
      { label: "Kategori Alat", value: "Heavy Excavator", badgeColor: "pink" },
      { label: "Status Operasi", value: "Loading Haul Truck", badgeColor: "emerald" },
      { label: "Produktivitas", value: "720 BCM / Jam" },
      { label: "Fuel Consumption", value: "88.5 L/Jam" },
      { label: "Operator", value: "Agus Pratama (Shift 1)" },
    ],
  },
  {
    id: "sp-eq-ex-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Excavator Komatsu PC2000-8 (EX-02) - Pit South",
    code: "EX-02",
    type: "EQUIPMENT",
    equipmentCategory: "EXCAVATOR",
    layerId: "layer-equipment",
    status: "LOADING",
    rlElevation: "RL +14.0m",
    centerCoordinates: { lat: -0.4915, lng: 117.1425 },
    utmString: "50S 515880 m E 9945680 m N",
    speedKmh: 0,
    fuelLevelPercent: 82,
    operatorName: "Bambang Sudiro",
    payloadTon: 28.0,
    shiftCycleCount: 74,
    description: "Excavator 200-ton memuat batubara bersih Seam 30 langsung ke Dump Truck.",
    properties: [
      { label: "Kategori Alat", value: "Excavator Batubara", badgeColor: "pink" },
      { label: "Status", value: "Coal Getting Active" },
      { label: "Produktivitas", value: "580 MT / Jam" },
    ],
  },
  {
    id: "sp-eq-ex-03",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Excavator Hitachi EX1200-6 (EX-03) - Pit Central",
    code: "EX-03",
    type: "EQUIPMENT",
    equipmentCategory: "EXCAVATOR",
    layerId: "layer-equipment",
    status: "IDLING",
    rlElevation: "RL +28.0m",
    centerCoordinates: { lat: -0.4855, lng: 117.1395 },
    utmString: "50S 515540 m E 9946340 m N",
    speedKmh: 0,
    fuelLevelPercent: 65,
    operatorName: "Hendra Wijaya",
    payloadTon: 0,
    shiftCycleCount: 42,
    description: "Excavator 120-ton standby menunggu antrean truk pengangkut.",
    properties: [
      { label: "Status", value: "Idling (Queue Wait 4 Menit)", badgeColor: "amber" },
      { label: "Operator", value: "Hendra Wijaya" },
    ],
  },

  // --- DUMP TRUCKS ---
  {
    id: "sp-eq-dt-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Dump Truck Komatsu HD785-7 (DT-101)",
    code: "DT-101",
    type: "EQUIPMENT",
    equipmentCategory: "DUMP_TRUCK",
    layerId: "layer-equipment",
    status: "HAULING",
    rlElevation: "RL +32.0m",
    centerCoordinates: { lat: -0.4952, lng: 117.1345 },
    utmString: "50S 514980 m E 9945280 m N",
    speedKmh: 28.5,
    headingDeg: 240,
    fuelLevelPercent: 62,
    operatorName: "Dedi Supriadi",
    payloadTon: 91.5,
    shiftCycleCount: 12,
    targetDestination: "Crushing Plant 01",
    description: "Rigid Dump Truck 91-ton kapasitas membawa muatan batubara Seam 30 menuju Crusher.",
    properties: [
      { label: "Kategori Alat", value: "Rigid Dump Truck", badgeColor: "pink" },
      { label: "Kecepatan GPS", value: "28.5 km/jam (Aman)" },
      { label: "Muatan Terpasang", value: "91.5 Ton Batubara" },
      { label: "Tujuan Rute", value: "Crushing Plant 01" },
      { label: "Siklus Hari Ini", value: "12 Ritase" },
    ],
  },
  {
    id: "sp-eq-dt-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Dump Truck CAT 777D (DT-102)",
    code: "DT-102",
    type: "EQUIPMENT",
    equipmentCategory: "DUMP_TRUCK",
    layerId: "layer-equipment",
    status: "HAULING",
    rlElevation: "RL +68.0m",
    centerCoordinates: { lat: -0.4725, lng: 117.1495 },
    utmString: "50S 516640 m E 9947780 m N",
    speedKmh: 32.0,
    headingDeg: 315,
    fuelLevelPercent: 74,
    operatorName: "Rudi Hartono",
    payloadTon: 88.0,
    shiftCycleCount: 14,
    targetDestination: "Out-Pit Disposal North",
    description: "Dump truck 100-ton membawa batuan penutup OB menuju Waste Dump North.",
    properties: [
      { label: "Status", value: "Hauling OB to Disposal" },
      { label: "Kecepatan", value: "32.0 km/jam" },
      { label: "Muatan", value: "88.0 Ton Overburden" },
    ],
  },
  {
    id: "sp-eq-dt-03",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Dump Truck Scania P410 (DT-108)",
    code: "DT-108",
    type: "EQUIPMENT",
    equipmentCategory: "DUMP_TRUCK",
    layerId: "layer-equipment",
    status: "DUMPING",
    rlElevation: "RL +16.0m",
    centerCoordinates: { lat: -0.5042, lng: 117.1208 },
    utmString: "50S 513480 m E 9944280 m N",
    speedKmh: 0,
    fuelLevelPercent: 54,
    operatorName: "Arif Kurniawan",
    payloadTon: 38.0,
    shiftCycleCount: 16,
    targetDestination: "Hopper Crusher 01",
    description: "Dump truck membuang batubara ke Hopper Crusher 01.",
    properties: [
      { label: "Status", value: "Dumping into Hopper", badgeColor: "emerald" },
      { label: "Operator", value: "Arif Kurniawan" },
    ],
  },

  // --- DOZERS ---
  {
    id: "sp-eq-dz-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Bulldozer CAT D10T (DZ-01) - Disposal North",
    code: "DZ-01",
    type: "EQUIPMENT",
    equipmentCategory: "DOZER",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +98.0m",
    centerCoordinates: { lat: -0.4635, lng: 117.1395 },
    utmString: "50S 515540 m E 9948780 m N",
    speedKmh: 4.2,
    fuelLevelPercent: 71,
    operatorName: "Suryanto",
    description: "Track-type Bulldozer 66-ton meratakan dan memadatkan material buangan overburden di Disposal.",
    properties: [
      { label: "Kategori Alat", value: "Heavy Track Dozer", badgeColor: "pink" },
      { label: "Aktivitas", value: "Spreading & Compacting OB" },
      { label: "Efisiensi Pendorongan", value: "480 BCM / Jam" },
      { label: "Operator", value: "Suryanto" },
    ],
  },
  {
    id: "sp-eq-dz-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Bulldozer Komatsu D375A-6 (DZ-02) - Pit South",
    code: "DZ-02",
    type: "EQUIPMENT",
    equipmentCategory: "DOZER",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +38.0m",
    centerCoordinates: { lat: -0.4902, lng: 117.1448 },
    utmString: "50S 516130 m E 9945830 m N",
    speedKmh: 3.8,
    fuelLevelPercent: 68,
    operatorName: "Eko Prasetyo",
    description: "Bulldozer melakukan ripping batuan keras interburden di bench atas Pit South.",
    properties: [
      { label: "Aktivitas", value: "Ripping Interburden Rock", badgeColor: "emerald" },
      { label: "Operator", value: "Eko Prasetyo" },
    ],
  },

  // --- GRADERS ---
  {
    id: "sp-eq-gr-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Motor Grader CAT 16M (MG-01) - Haul Road Main",
    code: "MG-01",
    type: "EQUIPMENT",
    equipmentCategory: "GRADER",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +28.0m",
    centerCoordinates: { lat: -0.4985, lng: 117.1295 },
    utmString: "50S 514430 m E 9944910 m N",
    speedKmh: 9.4,
    headingDeg: 60,
    fuelLevelPercent: 77,
    operatorName: "Iwan Setiawan",
    description: "Motor Grader meratakan permukaan jalan hauling utama dan memperbaiki crossfall drainase jalan.",
    properties: [
      { label: "Kategori Alat", value: "Motor Grader 16-Foot", badgeColor: "pink" },
      { label: "Aktivitas", value: "Road Grading & Camber Profiling" },
      { label: "Kecepatan Perataan", value: "9.4 km/jam" },
      { label: "Operator", value: "Iwan Setiawan" },
    ],
  },
  {
    id: "sp-eq-gr-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Motor Grader Komatsu GD825A-2 (MG-02)",
    code: "MG-02",
    type: "EQUIPMENT",
    equipmentCategory: "GRADER",
    layerId: "layer-equipment",
    status: "STANDBY",
    rlElevation: "RL +18.0m",
    centerCoordinates: { lat: -0.5015, lng: 117.1155 },
    utmString: "50S 512880 m E 9944580 m N",
    speedKmh: 0,
    fuelLevelPercent: 88,
    operatorName: "Teguh Santoso",
    description: "Motor Grader standby di Workshop area siap penugasan Shift 2.",
    properties: [
      { label: "Status", value: "Standby Workshop Bay", badgeColor: "blue" },
    ],
  },

  // --- WATER TRUCKS ---
  {
    id: "sp-eq-wt-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Water Truck Nissan CWB 20,000L (WT-01)",
    code: "WT-01",
    type: "EQUIPMENT",
    equipmentCategory: "WATER_TRUCK",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +36.0m",
    centerCoordinates: { lat: -0.4945, lng: 117.1382 },
    utmString: "50S 515390 m E 9945350 m N",
    speedKmh: 18.0,
    headingDeg: 220,
    fuelLevelPercent: 81,
    operatorName: "Fajar Nugraha",
    description: "Truk tangki air kapasitas 20.000 Liter melakukan penyiraman debu jalan hauling utama secara periodik.",
    properties: [
      { label: "Kategori Alat", value: "Water Tank Truck 20 kL", badgeColor: "pink" },
      { label: "Aktivitas", value: "Dust Suppression Spraying (Aktif)" },
      { label: "Kapasitas Tangki", value: "20,000 Liter (Sisa 14,200 L)" },
      { label: "Operator", value: "Fajar Nugraha" },
    ],
  },

  // --- LIGHT VEHICLES ---
  {
    id: "sp-eq-lv-01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Safety Patrol Hilux 4x4 (LV-HSE-01)",
    code: "LV-01",
    type: "EQUIPMENT",
    equipmentCategory: "LIGHT_VEHICLE",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +44.0m",
    centerCoordinates: { lat: -0.4875, lng: 117.1462 },
    utmString: "50S 516280 m E 9946120 m N",
    speedKmh: 34.0,
    headingDeg: 135,
    fuelLevelPercent: 92,
    operatorName: "HSE Inspector Doni",
    description: "Kendaraan patroli K3LH inspeksi rambu tambang, kecepatan armada hauling, dan housekeeping pit.",
    properties: [
      { label: "Kategori Alat", value: "Safety Inspection LV 4x4", badgeColor: "pink" },
      { label: "Aktivitas", value: "Pit Safety Patrol & Speed Gun Check" },
      { label: "Personel On-Board", value: "Doni (HSE Officer) + Pengawas K3" },
    ],
  },
  {
    id: "sp-eq-lv-02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Survey & Drone Crew Hilux (LV-SRV-02)",
    code: "LV-02",
    type: "EQUIPMENT",
    equipmentCategory: "LIGHT_VEHICLE",
    layerId: "layer-equipment",
    status: "OPERATING",
    rlElevation: "RL +52.0m",
    centerCoordinates: { lat: -0.4795, lng: 117.1512 },
    utmString: "50S 516840 m E 9947010 m N",
    speedKmh: 12.0,
    fuelLevelPercent: 86,
    operatorName: "Chief Surveyor Ilham",
    description: "Kendaraan tim pengukuran survey progress tambang dan base pilot drone LiDAR.",
    properties: [
      { label: "Kategori Alat", value: "Mine Survey Team LV", badgeColor: "cyan" },
      { label: "Tugas", value: "Monthly End-of-Month Topo Pickup" },
    ],
  },

  // ================= 16. SURVEY POINTS =================
  {
    id: "sp-srv-bm01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Benchmark Utama BM-01 (Orde-0 Geodesi)",
    code: "BM-01",
    type: "SURVEY_POINT",
    layerId: "layer-survey-point",
    status: "ACTIVE",
    rlElevation: "RL +78.452m (Fixed Geodetic)",
    centerCoordinates: { lat: -0.4852, lng: 117.1265 },
    utmString: "50S 514090.25 m E 9946380.12 m N",
    description: "Titik Benchmark BM Orde-0 pilar beton monumen geodetik berakurasi sub-centimeter untuk kontrol drone dan GNSS RTK.",
    properties: [
      { label: "Koordinat Easting (X)", value: "514,090.250 m E", badgeColor: "cyan" },
      { label: "Koordinat Northing (Y)", value: "9,946,380.120 m N" },
      { label: "Elevasi Orthometrik (Z)", value: "RL +78.452 m" },
      { label: "Datum Referensi", value: "WGS84 Ellipsoid / DGN95" },
      { label: "Status Monument", value: "Verified & Good Condition" },
    ],
  },
  {
    id: "sp-srv-bm02",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Benchmark Sektor BM-02 Pit North",
    code: "BM-02",
    type: "SURVEY_POINT",
    layerId: "layer-survey-point",
    status: "ACTIVE",
    rlElevation: "RL +92.115m",
    centerCoordinates: { lat: -0.4718, lng: 117.1585 },
    utmString: "50S 517640.80 m E 9947860.40 m N",
    description: "Titik Benchmark lokal untuk pematokan batas galian bench Pit North.",
    properties: [
      { label: "Koordinat X, Y", value: "517640.80 E, 9947860.40 N" },
      { label: "Elevasi RL", value: "RL +92.115 m" },
    ],
  },
  {
    id: "sp-srv-prism01",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "RTS Prism Highwall Slope Monitoring PR-04",
    code: "PRISM-04",
    type: "SURVEY_POINT",
    layerId: "layer-survey-point",
    status: "ACTIVE",
    rlElevation: "RL +62.300m",
    centerCoordinates: { lat: -0.4868, lng: 117.1482 },
    utmString: "50S 516500.00 m E 9946200.00 m N",
    description: "Prisma pemantauan stabilitas lereng otomatis terhubung ke Robotic Total Station 24/7.",
    properties: [
      { label: "Pergeseran 24 Jam", value: "0.2 mm (Stabil)", badgeColor: "emerald" },
      { label: "Alarm Threshold", value: "> 5.0 mm / Hari" },
    ],
  },

  // ================= 17. BOREHOLES =================
  {
    id: "sp-bh-101",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Borehole Core Drill BH-101 (Seam 30 Intersection)",
    code: "BH-101",
    type: "BOREHOLE",
    layerId: "layer-borehole",
    status: "ACTIVE",
    rlElevation: "RL +48.2m (Collar RL)",
    centerCoordinates: { lat: -0.4892, lng: 117.1418 },
    utmString: "50S 515790.00 m E 9945940.00 m N",
    qualityGar: 4240,
    description: "Titik bor eksplorasi inti (HQ Core) menembus Seam 30 pada kedalaman 32.4m - 39.2m dengan recovery 98%.",
    properties: [
      { label: "Total Kedalaman Bor", value: "85.0 Meter (HQ Core)", badgeColor: "lime" },
      { label: "Seam Terpotong", value: "Seam 30 (Tebal 6.8m)" },
      { label: "Kedalaman Roof", value: "32.4 m (RL +15.8m)" },
      { label: "Kedalaman Floor", value: "39.2 m (RL +9.0m)" },
      { label: "Kualitas Uji Lab", value: "GAR 4,240 kcal/kg, TS 0.45%, Ash 5.1%" },
    ],
  },
  {
    id: "sp-bh-102",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Borehole Stratigraphy BH-102 (Seam 28)",
    code: "BH-102",
    type: "BOREHOLE",
    layerId: "layer-borehole",
    status: "ACTIVE",
    rlElevation: "RL +72.0m (Collar RL)",
    centerCoordinates: { lat: -0.4765, lng: 117.1542 },
    utmString: "50S 517170.00 m E 9947340.00 m N",
    qualityGar: 4080,
    description: "Titik bor stratigrafi penentuan boundary geologi pit utara.",
    properties: [
      { label: "Total Kedalaman", value: "110.0 Meter" },
      { label: "Seam Roof", value: "48.5 m (Seam 28 Tebal 4.1m)" },
      { label: "Kalori", value: "GAR 4,080 kcal/kg" },
    ],
  },
  {
    id: "sp-bh-108",
    companyId: "comp-01",
    siteId: "site-01",
    siteName: "Sangatta Coal Mine Site A",
    name: "Geotechnical Borehole BH-108 (Highwall Stability)",
    code: "BH-108",
    type: "BOREHOLE",
    layerId: "layer-borehole",
    status: "ACTIVE",
    rlElevation: "RL +58.5m",
    centerCoordinates: { lat: -0.4842, lng: 117.1472 },
    utmString: "50S 516390.00 m E 9946490.00 m N",
    description: "Titik bor geoteknik dilengkapi inclinometer pipe untuk memonitor bidang gelincir batuan lempung.",
    properties: [
      { label: "Jenis Pengeboran", value: "Geotechnical Testing & RQD Analysis" },
      { label: "Nilai RQD Batuan", value: "78% (Fair to Good Sandstone)" },
    ],
  },
];

// GIS Analytical & Spatial Calculations Service
export class GISService {
  /**
   * Filter Spatial Entities by Search, Layers, Equipment Category, Radius, etc.
   */
  public static filterEntities(
    entities: SpatialEntity[],
    filter: GISFilterState
  ): SpatialEntity[] {
    return entities.filter((entity) => {
      // 1. Layer Visibility Filter
      if (
        filter.selectedLayerIds.length > 0 &&
        !filter.selectedLayerIds.includes(entity.layerId)
      ) {
        return false;
      }

      // 2. Equipment Category Filter (Excavator, Dump Truck, Dozer, Grader, Water Truck, LV)
      if (
        filter.selectedEquipmentType &&
        filter.selectedEquipmentType !== "ALL"
      ) {
        if (entity.type === "EQUIPMENT") {
          if (entity.equipmentCategory !== filter.selectedEquipmentType) {
            return false;
          }
        }
      }

      // 3. Search Query Filter
      if (filter.searchQuery && filter.searchQuery.trim() !== "") {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchName = entity.name.toLowerCase().includes(query);
        const matchCode = entity.code.toLowerCase().includes(query);
        const matchType = entity.type.toLowerCase().includes(query);
        const matchCategory = entity.equipmentCategory?.toLowerCase().includes(query);
        const matchUtm = entity.utmString.toLowerCase().includes(query);
        const matchDesc = entity.description.toLowerCase().includes(query);
        const matchProps = entity.properties.some((p) =>
          p.label.toLowerCase().includes(query) ||
          String(p.value).toLowerCase().includes(query)
        );

        if (!matchName && !matchCode && !matchType && !matchCategory && !matchUtm && !matchDesc && !matchProps) {
          return false;
        }
      }

      // 4. Radius Filter
      if (filter.radiusFilter) {
        const dist = this.calculateHaversineDistance(
          entity.centerCoordinates,
          filter.radiusFilter.center
        );
        if (dist > filter.radiusFilter.radiusMeters) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Haversine Great-Circle Distance Calculation (in Meters)
   */
  public static calculateHaversineDistance(p1: LatLng, p2: LatLng): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRadians(p2.lat - p1.lat);
    const dLng = this.toRadians(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(p1.lat)) *
        Math.cos(this.toRadians(p2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Polygon Area Calculation (Shoelace Algorithm in m² and Hectares)
   */
  public static calculatePolygonArea(points: LatLng[]): {
    areaM2: number;
    areaHa: number;
    perimeterM: number;
  } {
    if (points.length < 3) {
      return { areaM2: 0, areaHa: 0, perimeterM: 0 };
    }

    let area = 0;
    let perimeter = 0;
    const R = 6371000; // meters

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];

      // Perimeter
      perimeter += this.calculateHaversineDistance(p1, p2);

      // Spherical excess / planar approximation
      const x1 = this.toRadians(p1.lng) * R * Math.cos(this.toRadians((p1.lat + p2.lat) / 2));
      const y1 = this.toRadians(p1.lat) * R;
      const x2 = this.toRadians(p2.lng) * R * Math.cos(this.toRadians((p1.lat + p2.lat) / 2));
      const y2 = this.toRadians(p2.lat) * R;

      area += x1 * y2 - x2 * y1;
    }

    const areaM2 = Math.abs(area / 2);
    const areaHa = Number((areaM2 / 10000).toFixed(2));

    return {
      areaM2: Math.round(areaM2),
      areaHa,
      perimeterM: Math.round(perimeter),
    };
  }

  /**
   * Elevation Profile & Grade Calculation between Points
   */
  public static calculateElevationProfile(p1: LatLng, p2: LatLng): {
    startRL: number;
    endRL: number;
    deltaRL: number;
    horizontalDistM: number;
    slopePercent: number;
  } {
    const dist = Math.max(1, this.calculateHaversineDistance(p1, p2));
    const startRL = p1.elevation ?? (30 + Math.abs(p1.lat * 100) % 50);
    const endRL = p2.elevation ?? (15 + Math.abs(p2.lng * 100) % 40);
    const deltaRL = Number((endRL - startRL).toFixed(1));
    const slopePercent = Number(((deltaRL / dist) * 100).toFixed(1));

    return {
      startRL: Number(startRL.toFixed(1)),
      endRL: Number(endRL.toFixed(1)),
      deltaRL,
      horizontalDistM: Math.round(dist),
      slopePercent,
    };
  }

  /**
   * Volume Estimation (Cut & Fill BCM / MT) from Polygon + Bench Height
   */
  public static calculateVolumeEstimate(
    points: LatLng[],
    benchDepthM: number = 10
  ): {
    cutVolumeBCM: number;
    fillVolumeBCM: number;
    netVolumeBCM: number;
    coalEstimatedTon: number;
  } {
    const areaRes = this.calculatePolygonArea(points);
    const baseVolume = areaRes.areaM2 * benchDepthM;
    const cutVolumeBCM = Math.round(baseVolume * 0.85);
    const fillVolumeBCM = Math.round(baseVolume * 0.15);
    const netVolumeBCM = cutVolumeBCM - fillVolumeBCM;
    const coalEstimatedTon = Math.round(netVolumeBCM * 1.3); // 1.3 SG

    return {
      cutVolumeBCM,
      fillVolumeBCM,
      netVolumeBCM,
      coalEstimatedTon,
    };
  }

  /**
   * Generate Buffer Polygon Circle Vertices (e.g. 50m, 100m, 300m, 500m blasting safety zone)
   */
  public static generateBufferCircle(center: LatLng, radiusMeters: number, numPoints: number = 32): LatLng[] {
    const points: LatLng[] = [];
    const earthRadius = 6371000;
    const dByR = radiusMeters / earthRadius;
    const centerLatRad = this.toRadians(center.lat);
    const centerLngRad = this.toRadians(center.lng);

    for (let i = 0; i < numPoints; i++) {
      const bearing = (i * 2 * Math.PI) / numPoints;
      const pointLatRad = Math.asin(
        Math.sin(centerLatRad) * Math.cos(dByR) +
        Math.cos(centerLatRad) * Math.sin(dByR) * Math.cos(bearing)
      );
      const pointLngRad = centerLngRad + Math.atan2(
        Math.sin(bearing) * Math.sin(dByR) * Math.cos(centerLatRad),
        Math.cos(dByR) - Math.sin(centerLatRad) * Math.sin(pointLatRad)
      );

      points.push({
        lat: this.toDegrees(pointLatRad),
        lng: this.toDegrees(pointLngRad),
      });
    }

    return points;
  }

  /**
   * Convert Lat/Lng to Synthetic UTM Zone 50S Easting/Northing Representation
   */
  public static convertToUTM(lat: number, lng: number, elevationRL: number = 35): string {
    const baseEasting = 515000 + (lng - 117.14) * 111320;
    const baseNorthing = 9945000 + (lat + 0.49) * 110574;
    return `50S ${Math.round(baseEasting)} m E ${Math.round(baseNorthing)} m N (RL +${elevationRL.toFixed(1)}m)`;
  }

  /**
   * Find nearby spatial entities within a given radius
   */
  public static findNearbyObjects(
    entities: SpatialEntity[],
    center: LatLng,
    radiusMeters: number
  ): SpatialEntity[] {
    return entities.filter((entity) => {
      const dist = this.calculateHaversineDistance(entity.centerCoordinates, center);
      return dist <= radiusMeters;
    });
  }

  /**
   * Perform detailed radius spatial analysis
   */
  public static performRadiusSpatialAnalysis(
    entities: SpatialEntity[],
    center: LatLng,
    radiusMeters: number
  ): GISSpatialAnalysisResult {
    const nearby = this.findNearbyObjects(entities, center, radiusMeters);
    const totalAreaHa = Number(((Math.PI * Math.pow(radiusMeters, 2)) / 10000).toFixed(2));
    const activeEquipmentCount = nearby.filter((e) => e.type === "EQUIPMENT").length;
    const stockpiles = nearby.filter((e) => e.type === "STOCKPILE" || e.type === "ROM");
    const totalStockpileCoalMT = stockpiles.reduce(
      (sum, s) => sum + (s.currentTonnageMT || 0),
      0
    );

    return {
      summary: `Ditemukan ${nearby.length} objek spasial dalam radius ${radiusMeters} meter (${activeEquipmentCount} unit alat berat aktif).`,
      totalAreaHa,
      activeEquipmentCount,
      totalStockpileCoalMT,
      hazardRiskLevel: activeEquipmentCount > 6 ? "MODERATE" : "LOW",
      recommendations: [
        `Pertahankan batas kecepatan kendaraan 40 km/jam di dalam zona ${radiusMeters}m.`,
        "Pastikan komunikasi radio kanal 2 aktif untuk seluruh pergerakan fleet.",
        "Pantau drainase dan settling pond terdekat pasca hujan lebat.",
      ],
      affectedObjects: nearby,
    };
  }

  /**
   * Export entities to GeoJSON string
   */
  public static exportToGeoJSON(entities: SpatialEntity[]): string {
    const featureCollection = {
      type: "FeatureCollection",
      name: "MineSmartAI_GIS_Export",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: entities.map((entity) => {
        let geometry: any;
        if (entity.polygonCoordinates && entity.polygonCoordinates.length > 0) {
          geometry = {
            type: "Polygon",
            coordinates: [
              entity.polygonCoordinates.map((p) => [p.lng, p.lat]),
            ],
          };
        } else if (entity.pathCoordinates && entity.pathCoordinates.length > 0) {
          geometry = {
            type: "LineString",
            coordinates: entity.pathCoordinates.map((p) => [p.lng, p.lat]),
          };
        } else {
          geometry = {
            type: "Point",
            coordinates: [entity.centerCoordinates.lng, entity.centerCoordinates.lat],
          };
        }

        return {
          type: "Feature",
          properties: {
            id: entity.id,
            name: entity.name,
            code: entity.code,
            type: entity.type,
            equipmentCategory: entity.equipmentCategory,
            status: entity.status,
            rlElevation: entity.rlElevation,
            utmString: entity.utmString,
            speedKmh: entity.speedKmh,
            operatorName: entity.operatorName,
            fuelLevelPercent: entity.fuelLevelPercent,
            description: entity.description,
          },
          geometry,
        };
      }),
    };

    return JSON.stringify(featureCollection, null, 2);
  }

  /**
   * Export entities to CSV string
   */
  public static exportToCSV(entities: SpatialEntity[]): string {
    const headers = [
      "Code",
      "Name",
      "Type",
      "Category",
      "Status",
      "RL_Elevation",
      "Latitude",
      "Longitude",
      "UTM_Coordinate",
      "Speed_kmh",
      "Fuel_pct",
      "Operator",
      "Description",
    ];

    const rows = entities.map((e) => [
      `"${e.code}"`,
      `"${e.name}"`,
      `"${e.type}"`,
      `"${e.equipmentCategory || ""}"`,
      `"${e.status}"`,
      `"${e.rlElevation}"`,
      e.centerCoordinates.lat.toFixed(6),
      e.centerCoordinates.lng.toFixed(6),
      `"${e.utmString}"`,
      e.speedKmh || 0,
      e.fuelLevelPercent || 0,
      `"${e.operatorName || ""}"`,
      `"${e.description.replace(/"/g, '""')}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  private static toRadians(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private static toDegrees(rad: number): number {
    return (rad * 180) / Math.PI;
  }
}
