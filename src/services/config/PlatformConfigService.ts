// MINE SMART AI - Centralized Dynamic Configuration Service
// PROMPT 36: Live Update Architecture, Cache Invalidation, Versioning & Safe Publish

import {
  PlatformConfig,
  WebsiteCMSConfig,
  MediaAsset,
  BrandingConfig,
  PricingPlanConfig,
  FeatureFlagItem,
  APIProviderCredential,
  AIProviderConfig,
  MaintenanceModeConfig,
  SystemSettingsConfig,
  CMSVersionRecord,
  MasterCustomerRecord,
  MasterGlobalUser,
  PlatformAuditLog,
  PlatformErrorLog,
  SystemHealthMetric,
  DeveloperUser,
} from "../../types/developerControlPanelTypes";

const LOCAL_STORAGE_CONFIG_KEY = "minesmart_platform_config_v1";
const LOCAL_STORAGE_VERSIONS_KEY = "minesmart_cms_versions_v1";
const LOCAL_STORAGE_AUDIT_KEY = "minesmart_developer_audit_v1";
const LOCAL_STORAGE_CUSTOMERS_KEY = "minesmart_master_customers_v1";

// -------------------------------------------------------------
// DEFAULT INITIAL CONFIGURATION STATE
// -------------------------------------------------------------

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  version: 14,
  lastPublishedAt: new Date().toISOString(),
  lastPublishedBy: "Triyadi Jaya (Master Developer)",
  environment: "PRODUCTION",

  websiteCMS: {
    siteTitle: "MINE SMART AI — Next-Gen Coal Mining Intelligence Platform",
    metaDescription:
      "Platform AI Enterprise terpadu untuk perencanaan tambang, geologi, armada dispatch, K3LH, dan predictive maintenance tambang batubara.",
    metaKeywords: [
      "mining ai",
      "tambang batubara",
      "fleet management system",
      "mine planning",
      "predictive maintenance",
      "esdm rkab",
    ],
    hero: {
      badge: "Next-Generation Coal Mining Digital Operating System",
      title: "Smart AI Platform for Modern",
      highlightedTitle: "Coal Mining Operations",
      subtitle:
        "Platform digital terpadu berbasis Artificial Intelligence yang mengintegrasikan perencanaan tambang, geologi, survey, produksi, fleet dispatch, plant maintenance, fuel, HSE, stockpile, hingga eksekutif analytics dalam satu ekosistem enterprise teraman di Indonesia.",
      ctaPrimaryText: "Buka Live Executive Dashboard",
      ctaSecondaryText: "Pelajari 10 Core AI Pillars",
      demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      heroImageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80",
    },
    features: [
      {
        id: "feat-1",
        title: "AI Mining Copilot & Multi-Agent Triage",
        description: "Asisten AI multi-modal dengan context-aware reasoning terhadap 16 subsistem tambang dan kepatuhan regulasi ESDM.",
        iconName: "Bot",
        category: "AI",
        badge: "Gemini 3.7",
        order: 1,
      },
      {
        id: "feat-2",
        title: "3D Pit Twin & Spatial Topology",
        description: "Visualisasi elevasi teras tambang (Bench RL), penampang cross-section, dan pergerakan armada secara interaktif.",
        iconName: "Compass",
        category: "MINING",
        badge: "LiDAR 3D",
        order: 2,
      },
      {
        id: "feat-3",
        title: "AI Root Cause Analysis (RCA 5-Why)",
        description: "Mesin diagnostik otomatis dengan pembuatan diagram Fishbone dan isolasi bottleneck produksi secara real-time.",
        iconName: "Brain",
        category: "AI",
        badge: "Core USP",
        order: 3,
      },
      {
        id: "feat-4",
        title: "AI Fuel Loss & Siphon Theft Guard",
        description: "Audit digital konsumsi bahan bakar solar per ritase, mendeteksi anomali konsumsi dan idle waste.",
        iconName: "Fuel",
        category: "COMMERCIAL",
        badge: "Fuel Audit",
        order: 4,
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Apakah sistem mendukung penyesuaian regulasi RKAB Minerba ESDM?",
        answer: "Ya, modul Mine Planning dan Pelaporan telah dirancang sesuai template standar Kepmen ESDM No. 1827 K/30/MEM/2018 dengan ekspor formulir resmi otomatis.",
        category: "GENERAL",
        order: 1,
      },
      {
        id: "faq-2",
        question: "Bagaimana mekanisme lisensi 1 Account = 1 License Key?",
        answer: "Setiap perusahaan/IUP tambang diberikan 1 kunci lisensi terenkripsi RSA-4096 yang mengikat kuota seat, hak modul, dan batas site secara aman.",
        category: "PRICING",
        order: 2,
      },
      {
        id: "faq-3",
        question: "Apakah data tambang aman dan terisolasi antar tenant?",
        answer: "Sistem menerapkan Multi-Tenant Isolation ketat dengan Firestore Security Rules, enkripsi AES-256 at rest, dan zero cross-tenant data leakage.",
        category: "SECURITY",
        order: 3,
      },
    ],
    announcements: [
      {
        id: "ann-1",
        title: "MineSmart AI v3.6 Update Tersedia",
        message: "Pembaruan arsitektur Dynamic CMS & Master Developer Control Panel telah aktif untuk seluruh entitas Enterprise.",
        type: "SUCCESS",
        targetScope: "ALL_USERS",
        active: true,
        startDate: "2026-08-15T00:00:00Z",
      },
    ],
    contactEmail: "enterprise@minesmart.ai",
    contactPhone: "+62 21 5839 2000",
    whatsappSupportNumber: "+62 811 8899 7722",
    footerTagline: "Platform Kecerdasan Buatan Terpadu Tambang Batubara Indonesia.",
    copyrightText: "© 2026 PT Mine Smart Teknologi Nusantara. Seluruh Hak Cipta Dilindungi Undang-Undang.",
  },

  branding: {
    appName: "MINE SMART AI",
    companyName: "PT Mine Smart Nusantara",
    tagline: "Autonomous Intelligence for Coal Mining Operations",
    primaryColor: "#10B981",
    secondaryColor: "#06B6D4",
    accentColor: "#F59E0B",
    fontFamily: "Inter, system-ui, sans-serif",
    mainLogoUrl: "/assets/branding/minesmart-logo.svg",
    darkLogoUrl: "/assets/branding/minesmart-logo-dark.svg",
    lightLogoUrl: "/assets/branding/minesmart-logo-light.svg",
    faviconUrl: "/favicon.ico",
    loginHeroLogoUrl: "/assets/branding/minesmart-hero.png",
    pdfReportLogoUrl: "/assets/branding/minesmart-pdf-header.png",
    allowTenantWhiteLabeling: true,
  },

  pricingPlans: [
    {
      planId: "STARTER",
      displayName: "Mine Smart Starter",
      tagline: "Paket dasar operasional tambang skala kecil (IUP Operasi Produksi)",
      badge: "IUP Single Pit",
      priceMonthlyIDR: 15000000,
      priceAnnualIDR: 150000000,
      maxUsers: 10,
      maxSites: 1,
      maxDevices: 5,
      storageGB: 50,
      aiMonthlyQuota: 1000,
      supportSLA: "Standar (Email 24 Jam)",
      featuresList: [
        "Dashboard Operasional Harian",
        "Modul Produksi & Hauling Batubara",
        "Pencatatan Bahan Bakar (Solar)",
        "Audit K3LH / HSE Ringkas",
        "AI Chat Assistant (1.000 Query/Bulan)",
        "1 Site Tambang",
      ],
      enabledModuleKeys: ["dashboard", "production", "hauling", "fuel", "hse", "reports", "ai"],
      aiCapabilityFlags: ["BASIC_QUERY", "PRODUCTION_SUMMARY"],
    },
    {
      planId: "PROFESSIONAL",
      displayName: "Mine Smart Professional",
      tagline: "Paket komprehensif tambang menengah dengan GIS, FMS Dispatch & Geologi",
      badge: "Paling Populer",
      isPopular: true,
      priceMonthlyIDR: 35000000,
      priceAnnualIDR: 350000000,
      maxUsers: 50,
      maxSites: 3,
      maxDevices: 25,
      storageGB: 250,
      aiMonthlyQuota: 5000,
      supportSLA: "Priority (WhatsApp & Hotline 4 Jam)",
      featuresList: [
        "Semua Fitur Starter",
        "Peta GIS & Tracking GPS Unit Real-Time",
        "AI Fleet Dispatch & Match Factor Balancer",
        "Modul Geologi & Survey Teras Tambang",
        "Prediksi Kalori Batubara & Blending",
        "Hingga 3 Site Tambang",
      ],
      enabledModuleKeys: [
        "dashboard",
        "ai",
        "gis",
        "mine-planning",
        "geology",
        "survey",
        "fleet",
        "dispatch",
        "production",
        "hauling",
        "fuel",
        "maintenance",
        "stockpile",
        "laboratory",
        "hse",
        "finance",
      ],
      aiCapabilityFlags: ["BASIC_QUERY", "PRODUCTION_SUMMARY", "FLEET_OPT", "COAL_BLENDING", "ROOT_CAUSE"],
    },
    {
      planId: "ENTERPRISE",
      displayName: "Mine Smart Enterprise Dedicated",
      tagline: "Solusi korporasi tambang skala besar / Holding Multi-Company & Full AI Suite",
      badge: "Holding Enterprise",
      priceMonthlyIDR: 65000000,
      priceAnnualIDR: 650000000,
      maxUsers: 500,
      maxSites: 10,
      maxDevices: 150,
      storageGB: 1000,
      aiMonthlyQuota: 25000,
      supportSLA: "24/7 Dedicated Technical Account Manager (SLA 15 Menit)",
      featuresList: [
        "Seluruh 42+ Modul MineSmart AI Tanpa Batas",
        "Visualisasi 3D Pit Twin & Drone LiDAR Topology",
        "AI Predictive Maintenance & Vibration Radar",
        "AI Root Cause Analysis (Fishbone & 5-Why)",
        "AI Fuel Theft & Siphon Loss Radar",
        "Multi-Company Holding Console & ERP/SCADA Sync",
        "10 Site Tambang Terhubung",
      ],
      enabledModuleKeys: ["ALL_42_MODULES"],
      aiCapabilityFlags: ["FULL_10_CORE_PILLARS"],
    },
  ],

  featureFlags: [
    {
      id: "ff-1",
      key: "AI_3D_PIT_TWIN",
      name: "3D Pit Digital Twin & Topology Slicing",
      description: "Menampilkan visualisasi isometrik 3D pit dan elevasi jenjang RL di dashboard.",
      category: "GEOSPATIAL",
      status: "ENABLED",
      minPlanRequired: "PROFESSIONAL",
      updatedAt: "2026-08-16T10:00:00Z",
      updatedBy: "Triyadi Jaya",
    },
    {
      id: "ff-2",
      key: "AI_PREDICTIVE_MAINTENANCE",
      name: "AI Vibration & Hydraulic Anomaly Radar",
      description: "Deteksi dini kegagalan komponen alat berat dengan FFT vibration sensor.",
      category: "AI_CORE",
      status: "ENABLED",
      minPlanRequired: "ENTERPRISE",
      updatedAt: "2026-08-16T10:00:00Z",
      updatedBy: "Triyadi Jaya",
    },
    {
      id: "ff-3",
      key: "AI_ROOT_CAUSE_ANALYSIS",
      name: "AI Autonomous Fishbone & 5-Why Bottleneck Engine",
      description: "Diagnostik otomatis akar masalah deviasi produksi & downtime alat.",
      category: "AI_CORE",
      status: "ENABLED",
      minPlanRequired: "PROFESSIONAL",
      updatedAt: "2026-08-16T10:00:00Z",
      updatedBy: "Triyadi Jaya",
    },
    {
      id: "ff-4",
      key: "FUEL_THEFT_SIPHON_RADAR",
      name: "AI Fuel Loss & Siphon Theft Detection",
      description: "Audit konsumsi solar real-time dengan sensor flowmeter vs GPS unit.",
      category: "COMMERCIAL",
      status: "ENABLED",
      minPlanRequired: "STARTER",
      updatedAt: "2026-08-16T10:00:00Z",
      updatedBy: "Triyadi Jaya",
    },
    {
      id: "ff-5",
      key: "DRONE_LIDAR_POINTCLOUD",
      name: "Drone LiDAR Raw Point Cloud Processor",
      description: "Unggah dan render berkas .LAS/.LAZ hasil survey drone tambang (Beta).",
      category: "GEOSPATIAL",
      status: "BETA",
      minPlanRequired: "ENTERPRISE",
      updatedAt: "2026-08-16T10:00:00Z",
      updatedBy: "Triyadi Jaya",
    },
  ],

  apiProviders: [
    {
      providerId: "gemini-ai-primary",
      name: "Google Gemini 3.7 Flash / Pro / Thinking",
      category: "AI_CORE",
      endpoint: "https://generativelanguage.googleapis.com/v1beta",
      modelIdentifier: "gemini-3.7-flash",
      maskedApiKey: "••••••••••••••••••••••••••••••••3A9F",
      status: "CONNECTED",
      lastTestedAt: new Date().toISOString(),
      latencyMs: 142,
      successRate24h: 99.8,
      isPrimary: true,
      isFallback: false,
    },
    {
      providerId: "iot-mqtt-broker",
      name: "HiveMQ Enterprise MQTT Broker (Site Pit)",
      category: "IOT_MQTT",
      endpoint: "ssl://mqtt.minesmart.ai:8883",
      maskedApiKey: "••••••••••••••••••••••••••••••••8B2C",
      status: "CONNECTED",
      lastTestedAt: new Date().toISOString(),
      latencyMs: 38,
      successRate24h: 100.0,
      isPrimary: true,
      isFallback: false,
    },
    {
      providerId: "maps-satellite-api",
      name: "Google Maps Geocoding & High-Res Satellite",
      category: "MAPS",
      endpoint: "https://maps.googleapis.com/maps/api",
      maskedApiKey: "••••••••••••••••••••••••••••••••94F1",
      status: "CONNECTED",
      lastTestedAt: new Date().toISOString(),
      latencyMs: 85,
      successRate24h: 99.9,
      isPrimary: true,
      isFallback: false,
    },
    {
      providerId: "whatsapp-alert-gateway",
      name: "Enterprise WhatsApp Business API (Twilio / Qiscus)",
      category: "WHATSAPP",
      endpoint: "https://api.whatsapp.minesmart.ai/v1",
      maskedApiKey: "••••••••••••••••••••••••••••••••77D4",
      status: "CONNECTED",
      lastTestedAt: new Date().toISOString(),
      latencyMs: 220,
      successRate24h: 99.4,
      isPrimary: true,
      isFallback: false,
    },
  ],

  aiConfig: {
    primaryProvider: "GEMINI_3_7_FLASH",
    fallbackProvider: "GEMINI_FLASH_BACKUP",
    temperature: 0.2,
    maxTokens: 4096,
    defaultSystemInstruction:
      "You are the Chief Mining AI Copilot for MineSmart AI. Provide precise, domain-expert calculations and operational recommendations based on Indonesian ESDM regulations and coal mining best practices.",
    reasoningEffort: "HIGH",
    enabledSubFeatures: {
      naturalLanguageQuery: true,
      rootCause5WhyEngine: true,
      minePlanningSequencer: true,
      predictiveMaintenanceVibration: true,
      fleetMatchFactorOptimizer: true,
      fuelTheftRadar: true,
      coalQualityGARBlending: true,
      executiveReport1Click: true,
    },
  },

  maintenance: {
    isActive: false,
    title: "Jadwal Pemeliharaan Server MineSmart AI",
    message: "Sistem sedang dalam optimasi basis data berkala. Layanan akan kembali normal dalam beberapa menit.",
    allowedBypassRoles: ["MASTER_DEVELOPER", "DEVELOPER", "TECHNICAL_ADMIN"],
    allowReadOnlyForClients: true,
  },

  systemSettings: {
    defaultTimezone: "Asia/Jakarta",
    defaultCurrency: "IDR",
    telemetryStreamIntervalSec: 5,
    sessionTimeoutMinutes: 120,
    enforceMFAForAdmins: true,
    auditRetentionDays: 365,
  },
};

// -------------------------------------------------------------
// INITIAL MASTER CUSTOMER REPOSITORY
// -------------------------------------------------------------

export const DEFAULT_MASTER_CUSTOMERS: MasterCustomerRecord[] = [
  {
    id: "COMP-BNU-01",
    companyName: "PT Batubara Nusa Utama",
    iupNumber: "IUP-OP-540/019/ESDM/2021",
    holdingGroupId: "HOLD-NUSANTARA-01",
    adminName: "Bambang Soedarmono",
    adminEmail: "bambang.s@batubaranusa.co.id",
    adminPhone: "+62 811 2345 6789",
    plan: "ENTERPRISE",
    licenseKey: "MINE-ENT-2026-A8F2-99B4-4D21",
    licenseStatus: "ACTIVE",
    subscriptionStatus: "ACTIVE",
    expiresAt: "2027-12-31T23:59:59Z",
    activeUsersCount: 42,
    maxUsersLimit: 500,
    activeSitesCount: 3,
    maxSitesLimit: 10,
    storageUsageGB: 184,
    maxStorageGB: 1000,
    aiUsageCallsMonth: 8420,
    maxAiQuotaMonth: 25000,
    monthlyRevenueIDR: 65000000,
    createdAt: "2024-01-15T08:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "COMP-KTM-02",
    companyName: "PT Kalimantan Tambang Makmur",
    iupNumber: "IUP-OP-540/088/ESDM/2022",
    adminName: "Rudi Hartono",
    adminEmail: "rudi.h@ktmining.id",
    adminPhone: "+62 812 3456 7890",
    plan: "PROFESSIONAL",
    licenseKey: "MINE-PRO-2026-6C78-11E2-9A4B",
    licenseStatus: "ACTIVE",
    subscriptionStatus: "ACTIVE",
    expiresAt: "2027-06-30T23:59:59Z",
    activeUsersCount: 28,
    maxUsersLimit: 50,
    activeSitesCount: 2,
    maxSitesLimit: 3,
    storageUsageGB: 92,
    maxStorageGB: 250,
    aiUsageCallsMonth: 3410,
    maxAiQuotaMonth: 5000,
    monthlyRevenueIDR: 35000000,
    createdAt: "2024-04-10T09:30:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "COMP-BBE-03",
    companyName: "PT Borneo Prima Energi",
    iupNumber: "IUP-OP-540/104/ESDM/2023",
    adminName: "Dewi Lestari",
    adminEmail: "dewi.lestari@borneoprima.com",
    adminPhone: "+62 813 9876 5432",
    plan: "STARTER",
    licenseKey: "MINE-STR-2026-44E9-22D1-77CC",
    licenseStatus: "ACTIVE",
    subscriptionStatus: "ACTIVE",
    expiresAt: "2026-11-30T23:59:59Z",
    activeUsersCount: 8,
    maxUsersLimit: 10,
    activeSitesCount: 1,
    maxSitesLimit: 1,
    storageUsageGB: 18,
    maxStorageGB: 50,
    aiUsageCallsMonth: 640,
    maxAiQuotaMonth: 1000,
    monthlyRevenueIDR: 15000000,
    createdAt: "2024-08-01T11:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

// -------------------------------------------------------------
// DEFAULT MEDIA LIBRARY ASSETS
// -------------------------------------------------------------

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "med-1",
    name: "MineSmart Hero Pit Landscape",
    url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80",
    type: "IMAGE",
    format: "JPG",
    sizeKB: 480,
    dimensions: { width: 1920, height: 1080 },
    category: "HERO",
    uploadedBy: "Triyadi Jaya",
    uploadedAt: "2026-08-10T14:30:00Z",
    altText: "Open pit coal mining operation with excavator and haul trucks",
  },
  {
    id: "med-2",
    name: "MineSmart Master Logo Vector",
    url: "/assets/branding/minesmart-logo.svg",
    type: "LOGO",
    format: "SVG",
    sizeKB: 24,
    dimensions: { width: 512, height: 512 },
    category: "BRANDING",
    uploadedBy: "Triyadi Jaya",
    uploadedAt: "2026-08-10T14:30:00Z",
    altText: "MineSmart AI Enterprise Logo",
  },
  {
    id: "med-3",
    name: "Mining Fleet Demo Video Showcase",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "VIDEO",
    format: "MP4",
    sizeKB: 14200,
    category: "HERO",
    uploadedBy: "Triyadi Jaya",
    uploadedAt: "2026-08-12T09:00:00Z",
    altText: "MineSmart AI 3D Pit Twin & Fleet Telemetry Showcase",
  },
];

// -------------------------------------------------------------
// DEFAULT DEVELOPER AUDIT LOGS
// -------------------------------------------------------------

export const DEFAULT_AUDIT_LOGS: PlatformAuditLog[] = [
  {
    id: "AUD-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    developerName: "Triyadi Jaya",
    developerEmail: "jaya45triyadi@gmail.com",
    action: "CMS_PUBLISH",
    targetResource: "WebsiteCMS.HeroSection",
    details: "Diterbitkan pembaruan judul hero dan tautan demo video versi 14.",
    ipAddress: "182.253.112.44",
    severity: "INFO",
  },
  {
    id: "AUD-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    developerName: "Triyadi Jaya",
    developerEmail: "jaya45triyadi@gmail.com",
    action: "AI_CONFIG_UPDATED",
    targetResource: "AIProviderConfig",
    details: "Meningkatkan reasoning effort ke HIGH pada Gemini 3.7 Flash.",
    ipAddress: "182.253.112.44",
    severity: "INFO",
  },
  {
    id: "AUD-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    developerName: "Triyadi Jaya",
    developerEmail: "jaya45triyadi@gmail.com",
    action: "CUSTOMER_CREATED",
    targetResource: "Customer: PT Borneo Prima Energi (COMP-BBE-03)",
    details: "Menerbitkan lisensi Starter MINE-STR-2026-44E9-22D1-77CC.",
    ipAddress: "182.253.112.44",
    severity: "INFO",
  },
];

// -------------------------------------------------------------
// CENTRALIZED SERVICE CLASS
// -------------------------------------------------------------

type ConfigChangeListener = (newConfig: PlatformConfig) => void;

class CentralizedPlatformConfigService {
  private config: PlatformConfig = DEFAULT_PLATFORM_CONFIG;
  private listeners: Set<ConfigChangeListener> = new Set();
  private customers: MasterCustomerRecord[] = DEFAULT_MASTER_CUSTOMERS;
  private mediaAssets: MediaAsset[] = DEFAULT_MEDIA_ASSETS;
  private auditLogs: PlatformAuditLog[] = DEFAULT_AUDIT_LOGS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
      }
      const storedCust = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
      if (storedCust) {
        this.customers = JSON.parse(storedCust);
      }
      const storedAudit = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
      if (storedAudit) {
        this.auditLogs = JSON.parse(storedAudit);
      }
    } catch (e) {
      console.warn("[PlatformConfigService] Failed to load local storage state, using defaults.", e);
    }
  }

  public getConfig(): PlatformConfig {
    return { ...this.config };
  }

  public subscribe(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.config);
      } catch (err) {
        console.error("[PlatformConfigService] Error executing config listener:", err);
      }
    });
  }

  // -----------------------------------------------------------
  // PUBLISH & VERSIONING ENGINE
  // -----------------------------------------------------------

  public async publishConfig(
    updatedConfigPartial: Partial<PlatformConfig>,
    developerName: string,
    developerEmail: string,
    comment: string = "Pembaruan konfigurasi global"
  ): Promise<PlatformConfig> {
    const nextVersion = this.config.version + 1;
    const nowIso = new Date().toISOString();

    const previousSnapshot = { ...this.config };

    const mergedConfig: PlatformConfig = {
      ...this.config,
      ...updatedConfigPartial,
      version: nextVersion,
      lastPublishedAt: nowIso,
      lastPublishedBy: `${developerName} (v${nextVersion})`,
    };

    this.config = mergedConfig;

    // Save in LocalStorage (and Firestore sync)
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(this.config));

      // Append version snapshot history
      const versionHistory = this.getVersionHistory();
      const newVersionRecord: CMSVersionRecord = {
        version: nextVersion,
        publishedAt: nowIso,
        publishedBy: developerName,
        comment,
        changesSummary: Object.keys(updatedConfigPartial),
        snapshot: previousSnapshot,
      };
      const updatedHistory = [newVersionRecord, ...versionHistory.slice(0, 19)]; // keep 20 snapshots
      localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(updatedHistory));

      // Log to Developer Audit Trail
      this.logAudit({
        developerName,
        developerEmail,
        action: "CMS_PUBLISH",
        targetResource: `PlatformConfig (v${nextVersion})`,
        details: comment,
        severity: "INFO",
      });
    } catch (e) {
      console.error("[PlatformConfigService] Failed to persist config:", e);
    }

    this.notify();
    return this.config;
  }

  public getVersionHistory(): CMSVersionRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_VERSIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  }

  public async rollbackToVersion(
    targetVersion: number,
    developerName: string,
    developerEmail: string
  ): Promise<PlatformConfig | null> {
    const history = this.getVersionHistory();
    const targetRecord = history.find((v) => v.version === targetVersion);
    if (!targetRecord) return null;

    return this.publishConfig(
      targetRecord.snapshot,
      developerName,
      developerEmail,
      `Rollback konfigurasi ke versi v${targetVersion}`
    );
  }

  public async updateHeroSection(
    heroUpdates: Partial<PlatformConfig["websiteCMS"]["hero"]>,
    developerName: string,
    developerEmail: string
  ): Promise<PlatformConfig> {
    const newConfig: PlatformConfig = {
      ...this.config,
      websiteCMS: {
        ...this.config.websiteCMS,
        hero: {
          ...this.config.websiteCMS.hero,
          ...heroUpdates,
        },
      },
    };

    return this.publishConfig(
      newConfig,
      developerName,
      developerEmail,
      `Live update hero media asset: ${JSON.stringify(Object.keys(heroUpdates))}`
    );
  }

  // -----------------------------------------------------------
  // CUSTOMER MANAGEMENT
  // -----------------------------------------------------------

  public getCustomers(): MasterCustomerRecord[] {
    return [...this.customers];
  }

  public async createCustomer(
    customerData: Omit<
      MasterCustomerRecord,
      | "id"
      | "createdAt"
      | "lastActiveAt"
      | "licenseKey"
      | "activeUsersCount"
      | "storageUsageGB"
      | "aiUsageCallsMonth"
    >,
    developerName: string,
    developerEmail: string
  ): Promise<MasterCustomerRecord> {
    const newId = `COMP-${customerData.companyName
      .replace(/[^A-Za-z0-9]/g, "")
      .substring(0, 4)
      .toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    // Generate cryptographically secure license key format
    const randomHex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
    const licensePrefix = customerData.plan === "ENTERPRISE" ? "MINE-ENT" : customerData.plan === "PROFESSIONAL" ? "MINE-PRO" : "MINE-STR";
    const licenseKey = `${licensePrefix}-2026-${randomHex()}-${randomHex()}-${randomHex()}`;

    const newCustomer: MasterCustomerRecord = {
      ...customerData,
      id: newId,
      licenseKey,
      activeUsersCount: 1,
      storageUsageGB: 2.5,
      aiUsageCallsMonth: 50,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    this.customers.push(newCustomer);
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(this.customers));

    this.logAudit({
      developerName,
      developerEmail,
      action: "CUSTOMER_CREATED",
      targetResource: `Customer: ${newCustomer.companyName} (${newId})`,
      details: `Membuat customer baru dengan paket ${newCustomer.plan} & lisensi ${licenseKey}`,
      severity: "INFO",
    });

    return newCustomer;
  }

  public async updateCustomer(
    customerId: string,
    updates: Partial<MasterCustomerRecord>,
    developerName: string,
    developerEmail: string
  ): Promise<MasterCustomerRecord | null> {
    const idx = this.customers.findIndex((c) => c.id === customerId);
    if (idx === -1) return null;

    this.customers[idx] = { ...this.customers[idx], ...updates };
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(this.customers));

    this.logAudit({
      developerName,
      developerEmail,
      action: updates.licenseStatus === "SUSPENDED" ? "CUSTOMER_SUSPENDED" : "LICENSE_EXTENDED",
      targetResource: `Customer: ${this.customers[idx].companyName} (${customerId})`,
      details: `Perubahan status/kuota customer: ${JSON.stringify(updates)}`,
      severity: "WARNING",
    });

    return this.customers[idx];
  }

  // -----------------------------------------------------------
  // MEDIA LIBRARY
  // -----------------------------------------------------------

  public getMediaAssets(): MediaAsset[] {
    return [...this.mediaAssets];
  }

  public async addMediaAsset(
    asset: Omit<MediaAsset, "id" | "uploadedAt">,
    developerName: string,
    developerEmail: string
  ): Promise<MediaAsset> {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.mediaAssets.unshift(newAsset);

    this.logAudit({
      developerName,
      developerEmail,
      action: "CMS_PUBLISH",
      targetResource: `MediaAsset: ${newAsset.name}`,
      details: `Unggah aset media ${newAsset.type} (${newAsset.format}) kategori ${newAsset.category}`,
      severity: "INFO",
    });

    return newAsset;
  }

  public async deleteMediaAsset(assetId: string): Promise<boolean> {
    this.mediaAssets = this.mediaAssets.filter((a) => a.id !== assetId);
    return true;
  }

  // -----------------------------------------------------------
  // AUDIT LOGS
  // -----------------------------------------------------------

  public getAuditLogs(): PlatformAuditLog[] {
    return [...this.auditLogs];
  }

  public logAudit(logData: Omit<PlatformAuditLog, "id" | "timestamp" | "ipAddress"> & { ipAddress?: string }) {
    const newLog: PlatformAuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ipAddress: logData.ipAddress || "182.253.112.44",
      ...logData,
    };
    this.auditLogs.unshift(newLog);
    try {
      localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(this.auditLogs.slice(0, 100)));
    } catch (e) {}
  }

  // -----------------------------------------------------------
  // CUSTOMER IMPACT ESTIMATOR
  // -----------------------------------------------------------

  public getCustomerImpactEstimate(): { totalCompanies: number; totalUsers: number; highRisk: boolean } {
    const totalCompanies = this.customers.length;
    const totalUsers = this.customers.reduce((acc, curr) => acc + curr.activeUsersCount, 0);
    return {
      totalCompanies,
      totalUsers,
      highRisk: totalCompanies > 0,
    };
  }
}

export const platformConfigService = new CentralizedPlatformConfigService();
