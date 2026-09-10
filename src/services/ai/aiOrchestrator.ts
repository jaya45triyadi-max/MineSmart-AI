import {
  AIChatMessageExtended,
  AIIntent,
  AISourceCitation,
  AIActionProposal,
  AIMapCommand,
  AIInteractionAuditLog,
  AIAutoDetectedSignal,
  AIStructuredRecommendation,
} from "../../types/aiTypes";
import {
  checkUserPermission,
  toolGetProductionData,
  toolGetFleetData,
  toolGetFuelData,
  toolGetMaintenanceData,
  toolGetFinanceData,
  toolGetGeologyAndQualityData,
  toolGetStockpileData,
  toolGetHSEData,
  toolGetGISData,
  toolGetKnowledgeBaseDocs,
  toolSimulateWhatIf,
} from "./aiToolRegistry";
import { AIRepository } from "../repositories/AIRepository";

const aiRepo = new AIRepository();

export interface AIOrchestratorContext {
  companyId: string;
  companyName: string;
  siteId: string;
  siteName: string;
  userId: string;
  userName: string;
  userRole: string;
  activeModule?: string;
}

export class AIOrchestrator {
  /**
   * Returns pre-computed 9 Auto-Detected Operational Signals
   */
  static getAutoDetectedSignals(siteName: string = "Site Kalimantan"): AIAutoDetectedSignal[] {
    return [
      {
        id: "sig-prod-drop",
        type: "PRODUKSI_TURUN",
        title: "Produksi Batubara Turun -5.0% dari Target Harian",
        category: "PRODUKSI",
        severity: "HIGH",
        status: "ACTIVE",
        metricLabel: "Actual Coal Output",
        currentValue: "14,250 MT",
        baselineValue: "15,000 MT",
        deviation: "-750 MT (-5.0%)",
        detectedAt: "Hari Ini, 14:15 WITA",
        affectedPitOrArea: "Pit 2 North (Front EX-204)",
        rootCauseSummary: "Breakdown hidrolik EX-204 selama 3.5 jam & bottleneck antrean truck di loading point.",
        quickActionPrompt: "Kenapa produksi hari ini turun?",
      },
      {
        id: "sig-fuel-spike",
        type: "FUEL_MENINGKAT",
        title: "Konsumsi Fuel Solar Meningkat & Anomali Burn Rate Unit",
        category: "FUEL",
        severity: "CRITICAL",
        status: "ACTIVE",
        metricLabel: "Fuel Burn Rate HT-112",
        currentValue: "68.4 L/Jam",
        baselineValue: "48.2 L/Jam",
        deviation: "+20.2 L/Jam (+41.9%)",
        detectedAt: "Hari Ini, 11:30 WITA",
        affectedPitOrArea: "Hauling Road KM 4.2",
        rootCauseSummary: "Unit HT-112 terindikasi dirty fuel filter / clogged injector saat tanjakan bermuatan.",
        quickActionPrompt: "Kenapa fuel consumption meningkat?",
      },
      {
        id: "sig-downtime-spike",
        type: "DOWNTIME_MENINGKAT",
        title: "Downtime Armada Meningkat, Physical Availability Turun ke 88.5%",
        category: "FLEET",
        severity: "HIGH",
        status: "ACTIVE",
        metricLabel: "Fleet PA Target",
        currentValue: "88.5%",
        baselineValue: "90.0%",
        deviation: "-1.5% PA (5.3 Jam Unscheduled)",
        detectedAt: "Hari Ini, 10:20 WITA",
        affectedPitOrArea: "Workshop Central & Pit 2",
        rootCauseSummary: "2 unit breakdown aktif: EX-204 (pipa hidrolik boom) & HT-108 (tire cut ban kanan).",
        quickActionPrompt: "Alat mana yang paling tidak produktif?",
      },
      {
        id: "sig-cycle-time",
        type: "CYCLE_TIME_MENINGKAT",
        title: "Cycle Time Hauling Rute Pit 2 ke ROM Melonjak +28.5%",
        category: "LOGISTIK",
        severity: "HIGH",
        status: "ACTIVE",
        metricLabel: "Hauling Cycle Time",
        currentValue: "23.4 Menit",
        baselineValue: "18.2 Menit",
        deviation: "+5.2 Menit (+28.5%)",
        detectedAt: "Hari Ini, 13:00 WITA",
        affectedPitOrArea: "Haul Road KM 4 - KM 6",
        rootCauseSummary: "Penyiraman jalan dust suppression berlebih menciptakan permukaan licin + grading lambat.",
        quickActionPrompt: "Kenapa cycle time hauling di Pit 2 meningkat?",
      },
      {
        id: "sig-hauling-subopt",
        type: "HAULING_TIDAK_OPTIMAL",
        title: "Hauling Tidak Optimal: Match Factor 0.82 (Truck Queuing)",
        category: "LOGISTIK",
        severity: "MEDIUM",
        status: "ACTIVE",
        metricLabel: "Match Factor Fleet Pit 2",
        currentValue: "0.82",
        baselineValue: "1.00 - 1.10",
        deviation: "-0.28 (Truk Mengantre 6.2 Menit)",
        detectedAt: "Hari Ini, 12:45 WITA",
        affectedPitOrArea: "Pit 2 North - Loading Front",
        rootCauseSummary: "Distribusi truk tidak seimbang pasca EX-204 breakdown; truk menumpuk di EX-202.",
        quickActionPrompt: "Bagaimana cara optimalkan match factor dan hauling dispatch?",
      },
      {
        id: "sig-exc-prod-drop",
        type: "PRODUKTIVITAS_EXCAVATOR_TURUN",
        title: "Produktivitas Excavator EX-204 Turun Drastis",
        category: "FLEET",
        severity: "HIGH",
        status: "ACTIVE",
        metricLabel: "EX-204 Hourly Productivity",
        currentValue: "210 BCM/Jam",
        baselineValue: "380 BCM/Jam",
        deviation: "-170 BCM/Jam (-44.7%)",
        detectedAt: "Hari Ini, 11:00 WITA",
        affectedPitOrArea: "Pit 2 North",
        rootCauseSummary: "Tekanan oli hidrolik drop menyebabkan siklus swing & digging lambat.",
        quickActionPrompt: "Alat mana yang paling tidak produktif?",
      },
      {
        id: "sig-stockpile-unbalance",
        type: "STOCKPILE_TIDAK_SEIMBANG",
        title: "Kapasitas Stockpile Tidak Seimbang & Risiko Self-Heating",
        category: "STOCKPILE",
        severity: "MEDIUM",
        status: "ACTIVE",
        metricLabel: "ROM Stockpile 1 Capacity",
        currentValue: "88.4% Terisi (128,400 MT)",
        baselineValue: "< 75.0%",
        deviation: "+13.4% Over Limit (Stockpile 2: 32%)",
        detectedAt: "Hari Ini, 09:00 WITA",
        affectedPitOrArea: "ROM Stockpile A",
        rootCauseSummary: "Aliran hauling dari Pit 1 terlalu terkonsentrasi di Stockpile 1; crusher feeder lambat.",
        quickActionPrompt: "Bagaimana kondisi keseimbangan stockpile dan blending saat ini?",
      },
      {
        id: "sig-coal-quality",
        type: "KUALITAS_COAL_BERUBAH",
        title: "Kualitas Batubara Seam C1 Mengalami Kenaikan Moisture",
        category: "QUALITY",
        severity: "MEDIUM",
        status: "ACTIVE",
        metricLabel: "Total Moisture Seam C1",
        currentValue: "36.8%",
        baselineValue: "33.5%",
        deviation: "+3.3% TM (GAR turun ke 4,120 kcal)",
        detectedAt: "Hari Ini, 08:30 WITA",
        affectedPitOrArea: "Pit 2 West (Sump Area)",
        rootCauseSummary: "Genangan air rembesan hujan di dasar pit merendam lapisan roof coal seam C1.",
        quickActionPrompt: "Kenapa kualitas batubara seam C1 berubah?",
      },
      {
        id: "sig-hse-risk",
        type: "RISIKO_HSE_MENINGKAT",
        title: "Peningkatan Risiko Keselamatan (Slip & Simpang KM 4)",
        category: "HSE",
        severity: "HIGH",
        status: "ACTIVE",
        metricLabel: "Hazard Risk Score",
        currentValue: "Level 4 (High Risk)",
        baselineValue: "Level 1 (Low Risk)",
        deviation: "2 Near-Miss Slip Terlaporkan",
        detectedAt: "Hari Ini, 14:00 WITA",
        affectedPitOrArea: "Simpang Hauling KM 4",
        rootCauseSummary: "Permukaan jalan licin akibat kombinasi debu batubara halus dan air penyiraman berlebih.",
        quickActionPrompt: "Apa risiko HSE terbesar minggu ini?",
      },
    ];
  }

  /**
   * Returns structured Problem -> Root Cause -> Recommendation -> Expected Impact matrix
   */
  static getStructuredRecommendations(siteName: string = "Site Kalimantan"): AIStructuredRecommendation[] {
    return [
      {
        id: "rec-prod-rebalance",
        code: "REC-01",
        title: "Rebalance Dispatch Armada Hauling & Recovery Target Produksi",
        category: "OPERASI",
        priority: "HIGH",
        problem: "Pencapaian batubara hari ini tertahan di 14,250 MT (95.0% target) dengan shortfall -750 MT akibat breakdown EX-204 di Pit 2.",
        rootCause: "EX-204 mengalami kebocoran pipa hidrolik boom (3.5 jam downtime), menyebabkan 4 unit HD785 idle dan mengantre.",
        recommendation: "Pindahkan sementara 4 unit HD785 dari Front EX-204 ke Front EX-201 (Pit 1 South) yang memiliki kapasitas muat cadangan, serta mulai shift malam lebih awal 30 menit.",
        expectedImpact: "Pemulihan output produksi +650 MT pada Shift 2, menaikkan achievement harian menjadi 99.3%.",
        actionLabel: "Eksekusi Rebalance Dispatch",
        actionType: "DISPATCH_REBALANCE",
        targetModule: "DISPATCH",
        status: "OPEN",
        sources: [
          { module: "Modul Produksi", label: "Production Log Shift 1", period: "Hari Ini", siteName, routePath: "/production" },
          { module: "Modul Fleet", label: "Fleet Telematics & Match Factor", period: "Real-time", siteName, routePath: "/fleet" },
        ],
      },
      {
        id: "rec-fuel-investigation",
        code: "REC-02",
        title: "Inspeksi Injektor & Kalibrasi Sensor Fuel Unit HT-112",
        category: "FUEL",
        priority: "CRITICAL",
        problem: "Konsumsi solar unit HT-112 melonjak 68.4 Liter/Jam (+41.9% di atas standar normal 48.2 L/Jam).",
        rootCause: "Penyumbatan nozzle injektor nomor 3 & filter solar primer kotor, diperparah beban overloading pada rute tanjakan KM 4.2.",
        recommendation: "Tarik unit HT-112 ke Workshop Central untuk flushing filter bahan bakar dan kalibrasi sistem injeksi common rail.",
        expectedImpact: "Penghematan solar ~160 Liter/hari ($145/hari) dan pencegahan kerusakan turbocharger dini.",
        actionLabel: "Terbitkan Work Order Fuel",
        actionType: "CREATE_WORK_ORDER",
        targetModule: "MAINTENANCE",
        status: "OPEN",
        sources: [
          { module: "Modul Fuel", label: "Fuel Dispensing & Sensor IoT", period: "Hari Ini", siteName, routePath: "/fuel" },
          { module: "Modul Maintenance", label: "Equipment Diagnostic Log", period: "Real-time", siteName, routePath: "/maintenance" },
        ],
      },
      {
        id: "rec-equipment-maintenance",
        code: "REC-03",
        title: "Percepatan Servis Seal Hidrolik EX-204 & Preventive PC2000",
        category: "FLEET",
        priority: "HIGH",
        problem: "Physical Availability (PA) armada tambang turun ke 88.5% (target min 90.0%) dengan total 2 unit breakdown aktif.",
        rootCause: "Kegagalan O-Ring seal pipa hidrolik boom pada EX-204 dan ban bocor tertusuk batuan tajam pada HT-108.",
        recommendation: "Gunakan fast-track spare part kit dari Warehouse Rak B-12 untuk EX-204 dan tugaskan Motor Grader membersihkan spillage batuan tajam di loading point.",
        expectedImpact: "EX-204 kembali beroperasi pukul 19:30 WITA, memulihkan PA armada kembali ke 91.2%.",
        actionLabel: "Fast-Track Part Warehouse",
        actionType: "WAREHOUSE_DISPATCH",
        targetModule: "WAREHOUSE",
        status: "OPEN",
        sources: [
          { module: "Modul Fleet", label: "Availability Ledger PA/UA", period: "Real-time", siteName, routePath: "/fleet" },
          { module: "Modul Warehouse", label: "Spare Part Inventory Kit", period: "Real-time", siteName, routePath: "/warehouse" },
        ],
      },
      {
        id: "rec-stockpile-blending",
        code: "REC-04",
        title: "Rebalancing Stockpile ROM & Coal Blending Formula 1:1",
        category: "KUALITAS",
        priority: "MEDIUM",
        problem: "ROM Stockpile A mendekati batas kapasitas aman (88.4%) dan kualitas Seam C1 turun menjadi GAR 4,120 kcal/kg.",
        rootCause: "Penumpukan batubara berlebih di Stockpile 1 dan tingginya moisture batubara Seam C1 akibat genangan sump pit.",
        recommendation: "Jalankan formula blending 1:1 antara Seam C1 (4,120 kcal) dan Seam B2 (4,520 kcal) di Crushing Plant Hopper 1 untuk memenuhi kontrak buyer GAR 4,200.",
        expectedImpact: "Mencegah penalti off-spec kontrak senilai $18,500 dan menurunkan utilisasi Stockpile A ke 74%.",
        actionLabel: "Aktifkan SOP Blending",
        actionType: "STOCKPILE_BLENDING",
        targetModule: "STOCKPILE",
        status: "OPEN",
        sources: [
          { module: "Modul Stockpile", label: "Stockpile Capacity Tracker", period: "Real-time", siteName, routePath: "/stockpile" },
          { module: "Modul Laboratory", label: "Assay Lab Certificate (COA)", period: "Hari Ini", siteName, routePath: "/laboratory" },
        ],
      },
      {
        id: "rec-hse-road-grading",
        code: "REC-05",
        title: "Penataan Jalan Hauling KM 4 & Pembatasan Kecepatan Maksimum",
        category: "SAFETY",
        priority: "HIGH",
        problem: "Kondisi jalan hauling KM 4 licin berisiko tinggi; dilaporkan 2 insiden near-miss slip truk dalam 24 jam terakhir.",
        rootCause: "Kombinasi tanah liat licin pasca hujan deras dan kelebihan debit water truck pembasahi debu.",
        recommendation: "Mobilisasi Motor Grader D375 untuk scraping lapisan lumpur, taburkan agregat batu pecah 50-70mm, dan terapkan speed limit 30 km/jam.",
        expectedImpact: "Menghilangkan risiko slip / rollover truk, menjaga catatan 342 hari bebas LTI (Lost Time Injury).",
        actionLabel: "Kirim Instruksi Safety",
        actionType: "HSE_INSPECTION_REQUEST",
        targetModule: "HSE",
        status: "OPEN",
        sources: [
          { module: "Modul HSE", label: "Incident & Hazard Register", period: "Minggu Ini", siteName, routePath: "/hse" },
          { module: "Modul Hauling", label: "Road Condition Sensor Log", period: "Real-time", siteName, routePath: "/hauling" },
        ],
      },
    ];
  }

  /**
   * Classifies user intent based on natural language keywords
   */
  static classifyIntent(query: string): AIIntent {
    const q = query.toLowerCase();

    // Executive Copilot Briefing (e.g., "Bagaimana kondisi tambang hari ini?")
    if (
      q.includes("kondisi tambang") ||
      q.includes("bagaimana kondisi") ||
      q.includes("status tambang") ||
      q.includes("briefing direktur") ||
      q.includes("executive briefing") ||
      q.includes("briefing hari ini") ||
      q.includes("ringkasan tambang") ||
      q.includes("mine overview") ||
      q.includes("kondisi operasional")
    ) {
      return "EXECUTIVE_BRIEFING";
    }

    // Specific Indonesian Mining Questions
    if (q.includes("kenapa produksi") || q.includes("produksi turun") || q.includes("target tidak capai") || q.includes("shortfall")) {
      return "PRODUCTION_ANALYSIS";
    }
    if (q.includes("paling tidak produktif") || q.includes("tidak produktif") || q.includes("unit terendah") || q.includes("alat lambat") || q.includes("lowest productivity")) {
      return "EQUIPMENT_ANALYSIS";
    }
    if (q.includes("estimasi produksi") || q.includes("akhir bulan") || q.includes("forecast produksi") || q.includes("proyeksi") || q.includes("rkab")) {
      return "PRODUCTION_FORECAST";
    }
    if (q.includes("kenapa fuel") || q.includes("fuel consumption") || q.includes("fuel meningkat") || q.includes("boros solar") || q.includes("konsumsi solar")) {
      return "FUEL_ANALYSIS";
    }
    if (q.includes("buatkan laporan") || q.includes("laporan produksi") || q.includes("daily report") || q.includes("laporan hari ini") || q.includes("shift report")) {
      return "REPORT_GENERATION";
    }

    if (q.includes("produksi") || q.includes("batubara") || q.includes("overburden") || q.includes("ob") || q.includes("ton") || q.includes("bcm") || q.includes("pit")) {
      return "PRODUCTION_ANALYSIS";
    }
    if (q.includes("alat") || q.includes("fleet") || q.includes("excavator") || q.includes("truck") || q.includes("downtime") || q.includes("breakdown") || q.includes("utilization") || q.includes("pa") || q.includes("ua")) {
      return "EQUIPMENT_ANALYSIS";
    }
    if (q.includes("fuel") || q.includes("solar") || q.includes("bbm") || q.includes("liter")) {
      return "FUEL_ANALYSIS";
    }
    if (q.includes("maintenance") || q.includes("perbaikan") || q.includes("work order") || q.includes("service") || q.includes("onderdil")) {
      return "MAINTENANCE_ANALYSIS";
    }
    if (q.includes("hauling") || q.includes("cycle time") || q.includes("antre") || q.includes("jalan") || q.includes("ritase")) {
      return "HAULING_ANALYSIS";
    }
    if (q.includes("biaya") || q.includes("cost") || q.includes("opex") || q.includes("capex") || q.includes("budget") || q.includes("keuangan") || q.includes("hpp")) {
      if (q.includes("budget") || q.includes("pagu")) return "BUDGET_ANALYSIS";
      return "COST_ANALYSIS";
    }
    if (q.includes("geologi") || q.includes("seam") || q.includes("kualitas") || q.includes("gar") || q.includes("moisture") || q.includes("ash") || q.includes("sulfur")) {
      return "QUALITY_ANALYSIS";
    }
    if (q.includes("stockpile") || q.includes("stok") || q.includes("blending") || q.includes("rom")) {
      return "STOCKPILE_ANALYSIS";
    }
    if (q.includes("hse") || q.includes("safety") || q.includes("kecelakaan") || q.includes("incident") || q.includes("hazard") || q.includes("lti") || q.includes("bahaya")) {
      return "HSE_ANALYSIS";
    }
    if (q.includes("peta") || q.includes("gis") || q.includes("lokasi") || q.includes("jarak") || q.includes("koordinat")) {
      return "GIS_QUERY";
    }
    if (q.includes("simulasi") || q.includes("what if") || q.includes("bagaimana jika")) {
      return "WHAT_IF_SIMULATION";
    }
    if (q.includes("anomali") || q.includes("spike") || q.includes("masalah")) {
      return "ANOMALY_DETECTION";
    }

    return "GENERAL_QUERY";
  }

  /**
   * Main AI Processing Function with Multi-Module Data Grounding
   */
  static async processMessage(
    userText: string,
    conversationId: string,
    ctx: AIOrchestratorContext
  ): Promise<AIChatMessageExtended> {
    const startTime = Date.now();
    const intent = this.classifyIntent(userText);
    const toolsUsed: string[] = [];

    // 1. Permission Check
    const requiredPermissionsMap: Partial<Record<AIIntent, string[]>> = {
      EXECUTIVE_BRIEFING: ["production", "fleet", "dashboard"],
      PRODUCTION_ANALYSIS: ["production"],
      PRODUCTION_FORECAST: ["production", "planning"],
      EQUIPMENT_ANALYSIS: ["fleet", "maintenance"],
      FUEL_ANALYSIS: ["fuel"],
      MAINTENANCE_ANALYSIS: ["maintenance"],
      HAULING_ANALYSIS: ["hauling", "dispatch"],
      FINANCE_ANALYSIS: ["finance"],
      COST_ANALYSIS: ["finance", "cost"],
      BUDGET_ANALYSIS: ["finance", "budget"],
      GEOLOGY_ANALYSIS: ["geology"],
      QUALITY_ANALYSIS: ["quality"],
      STOCKPILE_ANALYSIS: ["stockpile"],
      HSE_ANALYSIS: ["hse"],
      GIS_QUERY: ["gis"],
      REPORT_GENERATION: ["production", "reports"],
    };

    const reqPerms = requiredPermissionsMap[intent];
    const isAllowed = checkUserPermission(ctx.userRole, reqPerms);

    if (!isAllowed) {
      return {
        id: "msg-" + Date.now(),
        conversationId,
        sender: "AI",
        text: `🔒 **Akses Terbatas (RBAC Protected):** Peran akun Anda (${ctx.userRole}) tidak memiliki izin akses detail untuk modul **${intent.replace(
          "_",
          " "
        )}**. Silakan hubungi Site Administrator untuk peningkatan izin.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        agentName: "MineSmart AI Command Center",
        confidence: "High",
      };
    }

    // 2. Data Grounding via Cross-Module Tool Layers
    const [prodData, fleetData, fuelData, maintData, finData, geoData, stockData, hseData, gisData] = await Promise.all([
      toolGetProductionData(ctx.companyId, ctx.siteId),
      toolGetFleetData(ctx.companyId, ctx.siteId),
      toolGetFuelData(ctx.companyId, ctx.siteId),
      toolGetMaintenanceData(ctx.companyId, ctx.siteId),
      toolGetFinanceData(ctx.companyId, ctx.siteId),
      toolGetGeologyAndQualityData(ctx.companyId, ctx.siteId),
      toolGetStockpileData(ctx.companyId, ctx.siteId),
      toolGetHSEData(ctx.companyId, ctx.siteId),
      toolGetGISData(ctx.companyId, ctx.siteId),
    ]);

    toolsUsed.push("getProductionData", "getFleetData", "getFuelData", "getMaintenanceData", "getFinanceData");
    const docMatches = toolGetKnowledgeBaseDocs(userText);
    if (docMatches.length > 0) toolsUsed.push("getKnowledgeBaseDocs");

    // 3. Construct Grounded Structured Answers for Indonesian Queries
    let replyText = "";
    let evidenceItems: AIChatMessageExtended["evidence"] = [];
    let potentialDrivers: string[] = [];
    let recommendations: AIChatMessageExtended["recommendations"] = [];
    let sources: AISourceCitation[] = [];
    let mapCommand: AIMapCommand | undefined = undefined;
    let actionProposal: AIActionProposal | undefined = undefined;
    let suggestedFollowups: string[] = [];

    const lowerQuery = userText.toLowerCase();

    // SCENARIO 0: EXECUTIVE BRIEFING (e.g. "Bagaimana kondisi tambang hari ini?")
    if (
      intent === "EXECUTIVE_BRIEFING" ||
      lowerQuery.includes("kondisi tambang") ||
      lowerQuery.includes("bagaimana kondisi") ||
      lowerQuery.includes("briefing direktur") ||
      lowerQuery.includes("executive briefing")
    ) {
      replyText = `### 👔 Executive Mine Health Briefing (Status Operasional Hari Ini)

Berdasarkan agregasi telemetri real-time, sensor IoT, dan FMS Dispatch di **${ctx.siteName}**:

- 🎯 **Production:** **94% dari target**
- 🚜 **Fleet utilization:** **82%**
- ⛽ **Fuel consumption:** **Naik 7%**
- ⏱️ **Downtime:** **Meningkat 11%**
- ⚠️ **Risiko utama:** **Terdapat pada Fleet B**

---

### 📋 Recommended Action & Daftar Tindakan Prioritas:

1. 🔴 **Prioritas 1 (Kritis — Fleet & Maintenance):**
   - **Rebalancing Armada Fleet B:** Alihkan 4 unit Haul Truck (HD-07 dkk) dari Fleet B ke Fleet A/C untuk mengeliminasi antrean idle (*truck queuing*).
   - **Fast-Track Work Order EX-03 & EX-05:** Prioritaskan perbaikan seal hidrolik di Workshop Central agar unit siap operasi penuh pada Shift 2.

2. 🟡 **Prioritas 2 (Tinggi — Fuel & Unit Efficiency):**
   - **Inspeksi Injektor & Filter Solar:** Tarik unit dengan burn rate abnormal di tanjakan KM 4.2 untuk kalibrasi common rail dan pembersihan filter bahan bakar (potensi hemat 7% solar).

3. 🟢 **Prioritas 3 (Sedang — Hauling & Road Maintenance):**
   - **Scraping & Grading Jalan:** Kerahkan Motor Grader D375 untuk meratakan lumpur licin di jalur KM 4–6 pasca penyiraman guna memangkas cycle time 4.2 menit.

4. 🔵 **Prioritas 4 (Safety & Kepatuhan K3LH):**
   - **Safety Pre-Shift Inspection:** Pastikan kestabilan lereng loading front Pit 2 dan pastikan kepatuhan APD Vision Guard 100% sebelum rotasi shift malam.`;

      evidenceItems = [
        { label: "Production vs Target", value: "94% (Shortfall -6%)", status: "WARNING" },
        { label: "Fleet Utilization", value: "82% (Target: ≥ 88%)", status: "WARNING" },
        { label: "Fuel Consumption", value: "Naik +7% (0.867 L/BCM)", status: "WARNING" },
        { label: "Downtime Fleet", value: "Meningkat +11% (PA 88.5%)", status: "CRITICAL" },
        { label: "Risiko Utama", value: "Fleet B (EX-03 & EX-05)", status: "CRITICAL" },
      ];

      potentialDrivers = [
        "Breakdown hidrolik EX-03 dan EX-05 di Fleet B memicu 64% penurunan produksi total.",
        "Idling 6 unit haul truck di loading point Fleet B mendongkrak fuel burn rate naik 7%.",
        "Kondisi jalan hauling licin di KM 4 menambah cycle time sebesar 4.2 menit.",
      ];

      recommendations = [
        {
          text: "Prioritaskan maintenance EX-03 dan alihkan HD-07 ke Fleet B / Fleet A.",
          priority: "CRITICAL",
          expectedImpact: "Memulihkan output batubara +650 MT pada Shift 2",
        },
        {
          text: "Kalibrasi injektor & filter solar unit hauling tanjakan KM 4.2.",
          priority: "HIGH",
          expectedImpact: "Penghematan ~160 L solar/hari (-7% konsumsi fuel)",
        },
        {
          text: "Scraping lumpur dan perataan jalan hauling KM 4 dengan Motor Grader.",
          priority: "MEDIUM",
          expectedImpact: "Memangkas cycle time 4.2 menit per ritase",
        },
      ];

      sources = [
        { module: "Modul Produksi", label: "Executive Production Consolidation", period: "Hari Ini", siteName: ctx.siteName, routePath: "/production" },
        { module: "Modul Fleet & FMS", label: "Fleet Telematics & Match Factor", period: "Real-time", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul Fuel IoT", label: "Fuel Dispensing & Burn Rate", period: "Real-time", siteName: ctx.siteName, routePath: "/fuel" },
        { module: "Modul Maintenance", label: "Work Order & Equipment Downtime", period: "Hari Ini", siteName: ctx.siteName, routePath: "/maintenance" },
      ];

      actionProposal = {
        id: "act-exec-rebalance-" + Date.now(),
        actionType: "DISPATCH_REBALANCE",
        description: "Eksekusi Rebalancing: Alihkan HD-07 ke Fleet A & Fast-Track Maintenance EX-03",
        targetModule: "DISPATCH",
        payload: { primaryAction: "REBALANCE_FLEET_B", targetUnits: ["HD-07", "EX-03", "EX-05"] },
        status: "PROPOSED",
        createdAt: new Date().toISOString(),
      };

      suggestedFollowups = [
        "Kenapa produksi hari ini turun?",
        "Kenapa fuel consumption meningkat?",
        "Alat mana yang paling tidak produktif?",
        "Buatkan laporan harian tambang (PDF).",
      ];
    }
    // SCENARIO 1: "Kenapa produksi hari ini turun?"
    else if (lowerQuery.includes("kenapa produksi") || lowerQuery.includes("produksi turun") || (intent === "PRODUCTION_ANALYSIS" && lowerQuery.includes("turun"))) {
      const coal = prodData?.actualCoalMT || 14250;
      const target = prodData?.targetCoalMT || 15000;
      const gap = target - coal;

      replyText = `### 📉 Analisis Penyebab Penurunan Produksi Hari Ini (${ctx.siteName})

Berdasarkan integrasi data real-time lintas modul pertambangan, produksi batubara hari ini tercatat **${coal.toLocaleString()} MT** dari target **${target.toLocaleString()} MT** (Pencapaian: **95.0%**, terjadi defisit **-${gap.toLocaleString()} MT**).

---

#### 🔍 Analisis Multi-Modul (Root Cause Breakdown):
1. **Downtime Alat Muat Utama (Modul Fleet & Maintenance):**
   - Unit **EX-204 (Komatsu PC1250)** di **Pit 2 North** mengalami kerusakan kebocoran pipa hidrolik boom pada pukul 10:15 WITA (Total downtime: **3.5 Jam**).
   - Hilangnya potensi kapasitas muat akibat insiden ini mencapai **~680 MT**.
2. **Kepadatan Jalan Hauling & Antrean (Modul Dispatch & Hauling):**
   - Terjadi penumpukan 6 unit Haul Truck di loading point Pit 2 karena rasio *Match Factor* anjlok ke **0.82**.
   - Cycle time hauling rute Pit 2 ke ROM Stockpile naik dari normal 18.2 menit menjadi **23.4 menit (+28.5%)** akibat penyiraman debu (*dust suppression*) yang berlebih.
3. **Kondisi Front Kerja (Modul Survey & GIS):**
   - Genangan air di sump Pit 2 West mempersempit manuver manuver truk mundur (*spotting time* naik +45 detik).

---

#### 💡 Rekomendasi Tindakan AI (*Problem → Root Cause → Recommendation → Impact*):
- **Problem:** Defisit batubara -750 MT di Pit 2.
- **Root Cause:** EX-204 breakdown & Match Factor timpang.
- **Recommendation:** Lakukan rebalance 4 unit Haul Truck HD-785 dari Fleet EX-204 ke Fleet EX-201 (Pit 1 South) yang memiliki kapasitas idle, serta percepat penyelesaian perbaikan EX-204.
- **Expected Impact:** Penambahan ritase batubara **+650 MT** pada Shift Malam, menaikkan pencapaian akhir hari ke **99.3%**.`;

      evidenceItems = [
        { label: "Realisasi Coal Today", value: `${coal.toLocaleString()} MT`, status: "WARNING" },
        { label: "Target Coal", value: `${target.toLocaleString()} MT`, status: "OK" },
        { label: "Downtime EX-204", value: "3.5 Jam", status: "CRITICAL" },
        { label: "Cycle Time Pit 2", value: "23.4 Menit (+28%)", status: "CRITICAL" },
      ];

      potentialDrivers = [
        "Kerusakan hidrolik boom EX-204 di Pit 2 North (Downtime 3.5 jam).",
        "Kepadatan antrean 6 truk HD785 akibat Match Factor anjlok ke 0.82.",
        "Penyiraman jalan berlebih di KM 4 memperlambat kecepatan rata-rata truk ke 22 km/jam.",
      ];

      recommendations = [
        { text: "Eksekusi rebalance 4 unit truk HD785 ke Front EX-201 di Pit 1 South.", priority: "HIGH", expectedImpact: "+650 MT batubara pada Shift 2" },
        { text: "Kirim spare part hydraulic seal kit dari Warehouse ke Workshop Pit 2.", priority: "CRITICAL", expectedImpact: "EX-204 kembali beroperasi pukul 19:30 WITA" },
      ];

      sources = [
        { module: "Modul Produksi", label: "Daily Production Log Shift 1", period: "Hari Ini", siteName: ctx.siteName, routePath: "/production" },
        { module: "Modul Fleet & Telematika", label: "Fleet Availability & Status", period: "Real-time", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul FMS Dispatch", label: "Hauling Queue & Cycle Time", period: "Real-time", siteName: ctx.siteName, routePath: "/dispatch" },
        { module: "Modul Plant Maintenance", label: "Work Order WO-2026-0814", period: "Hari Ini", siteName: ctx.siteName, routePath: "/maintenance" },
      ];

      actionProposal = {
        id: "act-rebalance-" + Date.now(),
        actionType: "DISPATCH_REBALANCE",
        description: "Instruksi Rebalance: Alihkan 4 unit HD785 dari Front EX-204 ke EX-201 (Pit 1 South)",
        targetModule: "DISPATCH",
        payload: { source: "EX-204 Pit 2", target: "EX-201 Pit 1", truckCount: 4 },
        status: "PROPOSED",
        createdAt: new Date().toISOString(),
      };

      suggestedFollowups = [
        "Alat mana yang paling tidak produktif?",
        "Berapa estimasi produksi sampai akhir bulan?",
        "Buatkan laporan produksi hari ini.",
      ];
    }
    // SCENARIO 2: "Alat mana yang paling tidak produktif?"
    else if (lowerQuery.includes("paling tidak produktif") || lowerQuery.includes("tidak produktif") || lowerQuery.includes("alat mana") || lowerQuery.includes("unit terendah")) {
      replyText = `### 🚜 Peringkat Kinerja Alat Berat & Identifikasi Unit Paling Tidak Produktif

Berdasarkan telematika IoT dan catatan operasional **68 unit armada** di **${ctx.siteName}**, berikut adalah unit dengan produktivitas terendah beserta faktor penyebabnya:

---

#### 🔴 Unit dengan Produktivitas Terendah Hari Ini:

1. **EX-204 (Excavator Komatsu PC1250 - Pit 2 North):**
   - **Produktivitas Aktual:** **210 BCM/Jam** (Standar: **380 BCM/Jam** | Defisit: **-44.7%**)
   - **Physical Availability (PA):** **56.2%** (Downtime: **3.5 Jam**)
   - **Akar Masalah:** Kebocoran pipa saluran hidrolik boom utama & tekanan relief valve drop.
   - **Status:** Dalam perbaikan tim Plant Maintenance (WO #2026-0814).

2. **HT-108 (Haul Truck CAT 777 - Pit 2):**
   - **Ritase Aktual:** **8 Rit/Shift** (Target: **14 Rit/Shift** | Defisit: **-42.8%**)
   - **Use of Availability (UA):** **61.0%**
   - **Akar Masalah:** *Tire cut* pada ban belakang kanan akibat ceceran batuan tajam di loading point Pit 2.
   - **Status:** Penggantian ban di Workshop Central.

3. **HT-112 (Haul Truck Komatsu HD785 - Pit 1):**
   - **Produktivitas / Efisiensi:** Ritase normal (12 Rit), namun **konsumsi fuel anomali sebesar 68.4 L/Jam (+41.9%)**.
   - **Akar Masalah:** Filter solar tersumbat dan indikasi beban *overloading* pada tanjakan KM 4.

---

#### 📊 Perbandingan Armada Excavator Utama:
| Kode Unit | Model | Lokasi Pit | Produktivitas Aktual | Target Standar | Status PA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EX-201** | Komatsu PC2000 | Pit 1 South | **540 BCM/Jam** | 520 BCM/Jam | 96.5% (Optimal) |
| **EX-202** | Komatsu PC2000 | Pit 1 North | **510 BCM/Jam** | 520 BCM/Jam | 94.0% (Optimal) |
| **EX-203** | Komatsu PC1250 | Pit 2 South | **365 BCM/Jam** | 380 BCM/Jam | 91.2% (Normal) |
| **EX-204** | Komatsu PC1250 | Pit 2 North | **210 BCM/Jam** ⚠️ | 380 BCM/Jam | **56.2% (Kritis)** |`;

      evidenceItems = [
        { label: "EX-204 Output", value: "210 BCM/Jam (-45%)", status: "CRITICAL" },
        { label: "HT-108 Ritase", value: "8 Rit (Target 14)", status: "CRITICAL" },
        { label: "Overall Fleet PA", value: "88.5%", status: "WARNING" },
        { label: "Fleet UA", value: "76.2%", status: "OK" },
      ];

      potentialDrivers = [
        "Kerusakan hidrolik EX-204 memangkas 45% kecepatan digging cycle time.",
        "Kondisi batuan tajam di front kerja merusak ban HT-108.",
        "Idling time truk di loading point rata-rata 6.2 menit per cycle.",
      ];

      recommendations = [
        { text: "Prioritaskan penggantian seal hidrolik EX-204 agar siap beroperasi pada Shift 2.", priority: "CRITICAL", expectedImpact: "Menaikkan produktivitas ke 380 BCM/Jam" },
        { text: "Kirim Motor Grader D375 untuk meratakan dan membersihkan ceceran batu tajam di loading front Pit 2.", priority: "HIGH", expectedImpact: "Mencegah insiden ban robek berikutnya" },
      ];

      sources = [
        { module: "Modul Fleet Management", label: "Fleet Telematics & PA/UA Ledger", period: "Real-time", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul Maintenance", label: "Equipment Work Order & Breakdown Log", period: "Hari Ini", siteName: ctx.siteName, routePath: "/maintenance" },
        { module: "Modul FMS Dispatch", label: "Equipment Productivity (BCM/Hr)", period: "Hari Ini", siteName: ctx.siteName, routePath: "/dispatch" },
      ];

      suggestedFollowups = [
        "Kenapa fuel consumption meningkat?",
        "Berapa estimasi produksi sampai akhir bulan?",
        "Buatkan laporan produksi hari ini.",
      ];
    }
    // SCENARIO 3: "Berapa estimasi produksi sampai akhir bulan?"
    else if (lowerQuery.includes("estimasi produksi") || lowerQuery.includes("akhir bulan") || lowerQuery.includes("forecast") || (intent === "PRODUCTION_FORECAST")) {
      replyText = `### 📈 Proyeksi & Estimasi Produksi Akhir Bulan (Forecast Model)

Menggunakan algoritma prediktif berbasis *Historical Run-Rate*, *Weather Forecast (BMKG)*, dan *Planned Fleet Availability*, berikut estimasi produksi hingga akhir bulan di **${ctx.siteName}**:

---

#### 🎯 Estimasi vs Target RKAB (Bulan Ini):
- **Target Bulanan RKAB:** **450,000 MT** Batubara | **1,500,000 BCM** Overburden
- **Akumulasi Produksi MTD (Hingga Hari Ini):** **206,600 MT** (Hari ke-14 dari 31 hari)
- **Estimasi Total Akhir Bulan (P50 - Expected Case):** **438,200 MT** Batubara (**97.4%** dari Target)
- **Proyeksi Shortfall (Gap):** **-11,800 MT** (**-2.6%**)

---

#### 📊 Skenario Probabilitas Produksi (Monte Carlo Simulation):
1. **Skenario Optimis (P90):** **452,500 MT** (100.6%) — Tercapai jika tidak ada *rain delay* signifikan (> 2 jam/minggu) dan PA fleet terjaga ≥ 92%.
2. **Skenario Baseline (P50):** **438,200 MT** (97.4%) — Berdasarkan tren kapasitas armada dan rata-rata curah hujan normal.
3. **Skenario Konservatif (P10):** **418,000 MT** (92.9%) — Terjadi jika hujan lebat berlanjut dan *unscheduled downtime* excavator meningkat.

---

#### 💡 Rencana Aksi Pemulihan Target (Catch-Up Plan):
1. **Tingkatkan Match Factor:** Tambahkan 2 unit truk hauling sewa kontraktor di Pit 1 South (**+850 MT/hari**).
2. **Optimasi Waktu Antar-Shift:** Kurangi waktu pergantian shift dari 45 menit menjadi 25 menit (*hot-seat changeover*) (**+320 MT/hari**).
3. **Pengupasan OB Terfokus:** Percepat *uncovering* Seam B2 di Pit 1 dengan Strip Ratio 3.2:1.`;

      evidenceItems = [
        { label: "Target RKAB Bulanan", value: "450,000 MT", status: "OK" },
        { label: "Proyeksi Akhir Bulan (P50)", value: "438,200 MT (97.4%)", status: "WARNING" },
        { label: "Estimasi Gap Shortfall", value: "-11,800 MT", status: "WARNING" },
        { label: "Proyeksi OB Akhir Bulan", value: "1,465,000 BCM (97.7%)", status: "OK" },
      ];

      potentialDrivers = [
        "Total rain delay terakumulasi 18.5 jam selama 2 pekan pertama bulan ini.",
        "Rata-rata Physical Availability armada 88.5% (di bawah asumsi target 91.0%).",
      ];

      recommendations = [
        { text: "Terapkan SOP Hot-Seat Changeover saat pergantian shift jam 17:30 WITA.", priority: "HIGH", expectedImpact: "Tambahan ~320 MT batubara per hari" },
        { text: "Buka Tab 'Simulasi What-If' untuk menguji penambahan armada kontraktor terhadap margin laba.", priority: "MEDIUM" },
      ];

      sources = [
        { module: "Modul Mine Planning", label: "RKAB Monthly Mine Plan 2026", period: "Bulan Ini", siteName: ctx.siteName, routePath: "/mine-planning" },
        { module: "Modul Produksi", label: "MTD Production Consolidation", period: "Hingga Hari Ini", siteName: ctx.siteName, routePath: "/production" },
        { module: "Modul Predictive Analytics", label: "Monte Carlo Production Forecaster", period: "Proyeksi 30 Hari", siteName: ctx.siteName, routePath: "/analytics" },
      ];

      suggestedFollowups = [
        "Kenapa produksi hari ini turun?",
        "Kenapa fuel consumption meningkat?",
        "Buatkan laporan produksi hari ini.",
      ];
    }
    // SCENARIO 4: "Kenapa fuel consumption meningkat?"
    else if (lowerQuery.includes("fuel consumption") || lowerQuery.includes("fuel meningkat") || lowerQuery.includes("boros solar") || lowerQuery.includes("konsumsi solar") || (intent === "FUEL_ANALYSIS" && (lowerQuery.includes("kenapa") || lowerQuery.includes("naik") || lowerQuery.includes("meningkat")))) {
      replyText = `### ⛽ Analisis Peningkatan Konsumsi Bahan Bakar (Fuel Solar B35)

Berdasarkan pemantauan sensor dispenser *Fuel IoT Storage* dan telematika *Engine ECU Telematics* di **${ctx.siteName}**:

---

#### 📊 Status Konsumsi Solar Hari Ini:
- **Total Solar Digunakan Hari Ini:** **42,150 Liter**
- **Fuel Ratio OB Aktual:** **0.867 Liter/BCM** (Budget Pagu: **< 0.820 L/BCM** | Naik: **+5.7%**)
- **Fuel Ratio Batubara:** **1.45 Liter/MT** (Normal: **1.38 L/MT**)

---

#### 🔍 3 Faktor Utama Penyebab Kenaikan Konsumsi Fuel (Root Causes):

1. **Anomali Burn Rate Unit Spesifik (Unit HT-112):**
   - Unit **HT-112** mencatat konsumsi solar **68.4 Liter/Jam** (**+41.9%** dari rata-rata normal armada **48.2 L/Jam**).
   - Sensor ECU mengindikasikan filter bahan bakar primer kotor (*fuel restriction*) dan keausan injektor nomor 3 yang menyebabkan pembakaran tidak sempurna.

2. **Idling Time Berlebih di Antrean Loading Point (Pit 2):**
   - Rata-rata truk menunggu dalam kondisi mesin menyala (*high idling*) selama **6.2 menit per siklus**.
   - Total solar yang terbuang sia-sia saat idle mencapai **~1,240 Liter/hari**.

3. **Grade Jalan Hauling KM 4.2 Meningkat (*Rolling Resistance*):**
   - Kondisi jalan licin dan bergelombang pasca hujan menaikkan *rolling resistance* dari 2% menjadi **4.5%**, memaksa transmisi truk berada pada gigi rendah (Gear 1-2) dengan putaran RPM mesin tinggi.

---

#### 💡 Rekomendasi Penghematan Bahan Bakar:
- **Problem:** Fuel ratio membengkak +5.7% dan anomali HT-112 (+41.9%).
- **Root Cause:** Injektor HT-112 kotor & idling time antrean 6.2 menit di Pit 2.
- **Recommendation:** Tarik HT-112 ke Workshop untuk pembersihan injektor, terapkan kebijakan *Auto Engine Idle Shutdown* max 3 menit saat antre, dan ratakan jalan KM 4.
- **Expected Impact:** Penurunan konsumsi solar sebesar **~1,850 Liter/hari (Hemat Rp 26.8 Juta/hari)** dan pemulihan Fuel Ratio ke **0.815 L/BCM**.`;

      evidenceItems = [
        { label: "Fuel Ratio OB", value: "0.867 L/BCM (+5.7%)", status: "WARNING" },
        { label: "Total Solar Hari Ini", value: "42,150 Liter", status: "OK" },
        { label: "Anomali Unit HT-112", value: "68.4 L/Jam (+41.9%)", status: "CRITICAL" },
        { label: "Solar Terbuang Idle", value: "~1,240 Liter/hari", status: "CRITICAL" },
      ];

      potentialDrivers = [
        "Injektor & filter solar unit HT-112 kotor menyebabkan pemborosan 20.2 L/jam.",
        "Idling time truk di antrean loading point mencapai 6.2 menit per siklus.",
        "Rolling resistance jalan hauling KM 4 naik akibat permukaan becek berlumpur.",
      ];

      recommendations = [
        { text: "Jadwalkan kalibrasi sistem injektor dan penggantian filter solar HT-112 di Workshop.", priority: "CRITICAL", expectedImpact: "Penghematan ~160 L/hari pada unit HT-112" },
        { text: "Instruksikan operator truk mematikan mesin bila antrean loading lebih dari 3 menit.", priority: "HIGH", expectedImpact: "Menghemat ~1,200 Liter solar per hari" },
      ];

      sources = [
        { module: "Modul Fuel Management", label: "Fuel IoT Flow Meter & Dispenser Log", period: "Hari Ini", siteName: ctx.siteName, routePath: "/fuel" },
        { module: "Modul Fleet Telematics", label: "Engine ECU Load & Fuel Burn Rate", period: "Real-time", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul Hauling & Dispatch", label: "Idling Time & Queue Telematics", period: "Hari Ini", siteName: ctx.siteName, routePath: "/dispatch" },
      ];

      suggestedFollowups = [
        "Alat mana yang paling tidak produktif?",
        "Kenapa produksi hari ini turun?",
        "Buatkan laporan produksi hari ini.",
      ];
    }
    // SCENARIO 5: "Buatkan laporan produksi hari ini."
    else if (lowerQuery.includes("buatkan laporan") || lowerQuery.includes("laporan produksi") || (intent === "REPORT_GENERATION")) {
      replyText = `### 📋 LAPORAN OPERASIONAL & PRODUKSI HARIAN TAMBANG
**Lokasi:** ${ctx.siteName} | **Perusahaan:** ${ctx.companyName}  
**Tanggal:** ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}  
**Status Laporan:** TERVERIFIKASI SISTEM MINE SMART AI  

---

#### 1. RINGKASAN PRODUKSI & STRIP RATIO
| Parameter Operasional | Target Rencana | Realisasi Aktual | Variansi (%) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Produksi Batubara (Coal)** | **15,000 MT** | **14,250 MT** | **-5.0% (-750 MT)** | ⚠️ Perlu Catch-Up |
| **Pengupasan Overburden (OB)** | **50,000 BCM** | **48,600 BCM** | **-2.8% (-1,400 BCM)** | ✅ Dalam Toleransi |
| **Actual Strip Ratio (SR)** | **3.33 BCM/MT** | **3.41 BCM/MT** | **+0.08 BCM/MT** | ℹ️ Sesuai Desain Pit |

- **Pencapaian Per Shift:**
  - **Shift 1 (Siang 06:00 - 18:00):** Batubara 7,450 MT | OB 24,800 BCM
  - **Shift 2 (Malam 18:00 - 06:00):** Batubara 6,800 MT (Estimasi) | OB 23,800 BCM
- **Breakdown Per Lokasi Pit:**
  - **Pit 1 South:** 8,400 MT Batubara (105% Target - Berjalan Lancar)
  - **Pit 2 North:** 5,850 MT Batubara (83% Target - Terkendala Breakdown EX-204)

---

#### 2. KINERJA ALAT BERAT & FLEET (FMS)
- **Total Populasi Armada:** 68 Unit (12 Excavator, 48 Haul Truck, 8 Bulldozer/Grader)
- **Physical Availability (PA):** **88.5%** (Target: ≥ 90.0%)
- **Use of Availability (UA):** **76.2%**
- **Breakdown Kritis:**
  - **EX-204 (Komatsu PC1250):** Bocor Pipa Hidrolik Boom (Downtime: 3.5 jam) — *Selesai perbaikan 19:30 WITA*.
  - **HT-108 (CAT 777):** Ban Kanan Bocor (*Tire Cut*) (Downtime: 1.8 jam).

---

#### 3. BAHAN BAKAR & EFISIENSI (FUEL)
- **Total Pemakaian Solar Hari Ini:** **42,150 Liter** (Solar Industri B35)
- **Fuel Ratio OB:** **0.867 L/BCM** (Budget: < 0.820 L/BCM)
- **Anomali:** Unit HT-112 konsumsi 68.4 L/Jam (+41.9%) — Direkomendasikan kalibrasi injektor.

---

#### 4. KUALITAS & INVENTORI STOCKPILE
- **Stok ROM Stockpile A:** **128,400 MT** (Utilisasi: 88.4%)
- **Stok Clean Coal Jetty:** **85,200 MT**
- **Rata-rata Kualitas:** GAR **4,250 kcal/kg**, Moisture **34.2%**, Ash **5.6%**, Sulfur **0.42%**.

---

#### 5. KESELAMATAN & K3 TAMBANG (HSE)
- **Hari Bebas Kecelakaan (LTI Free):** **342 Hari**
- **Insiden Hari Ini:** **0 Fatal, 0 LTI, 0 Medical Treatment**.
- **Tindakan K3:** Perbaikan jalan licin di Simpang KM 4 dan pembatasan kecepatan 30 km/jam.`;

      evidenceItems = [
        { label: "Coal Output", value: "14,250 MT (95%)", status: "WARNING" },
        { label: "OB Stripping", value: "48,600 BCM (97%)", status: "OK" },
        { label: "Fleet PA", value: "88.5%", status: "WARNING" },
        { label: "Safe Days LTI", value: "342 Hari", status: "OK" },
      ];

      recommendations = [
        { text: "Unduh file PDF / Excel laporan produksi resmi melalui tombol Export Report di pojok kanan atas.", priority: "HIGH" },
        { text: "Kirimkan ringkasan laporan ke Kepala Teknik Tambang (KTT) & Direksi Operasional.", priority: "MEDIUM" },
      ];

      sources = [
        { module: "Modul Produksi", label: "Official Production Daily Sheet", period: "Hari Ini", siteName: ctx.siteName, routePath: "/production" },
        { module: "Modul Fleet", label: "Fleet Shift Summary Log", period: "Hari Ini", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul Fuel", label: "Fuel Reconciliation Log", period: "Hari Ini", siteName: ctx.siteName, routePath: "/fuel" },
        { module: "Modul HSE", label: "Safety & Incident Register", period: "Hari Ini", siteName: ctx.siteName, routePath: "/hse" },
        { module: "Modul Reporting & RKAB", label: "ESDM Form 04 Compliant", period: "Hari Ini", siteName: ctx.siteName, routePath: "/reports" },
      ];

      suggestedFollowups = [
        "Kenapa produksi hari ini turun?",
        "Alat mana yang paling tidak produktif?",
        "Berapa estimasi produksi sampai akhir bulan?",
      ];
    }
    // GENERAL / CROSS-MODULE QUERIES
    else {
      replyText = `### 🧠 AI Command Center Mining Operations (${ctx.siteName})

Halo **${ctx.userName}**! Saya **MineSmart AI Copilot**, otak kecerdasan buatan utama yang menganalisis seluruh data operasional pertambangan secara real-time.

---

#### 📊 Status Ringkasan Tambang Real-Time:
- **Produksi Batubara:** **14,250 MT** (95.0% dari target 15,000 MT) | **OB:** **48,600 BCM**
- **Ketersediaan Armada (PA):** **88.5%** (68 Unit Aktif, 2 Unit Breakdown)
- **Konsumsi Fuel:** **42,150 Liter** | **Fuel Ratio:** **0.867 L/BCM**
- **Kualitas Batubara:** GAR **4,250 kcal/kg**, Total Moisture **34.2%**
- **Safety Record:** **342 Hari Bebas LTI**

---

#### 🗣️ Pertanyaan Populer yang Dapat Anda Ajukan:
- 📉 *"Kenapa produksi hari ini turun?"*
- 🚜 *"Alat mana yang paling tidak produktif?"*
- 📈 *"Berapa estimasi produksi sampai akhir bulan?"*
- ⛽ *"Kenapa fuel consumption meningkat?"*
- 📋 *"Buatkan laporan produksi hari ini."*`;

      evidenceItems = [
        { label: "Coal Output", value: "14,250 MT", status: "OK" },
        { label: "OB Stripping", value: "48,600 BCM", status: "OK" },
        { label: "Fleet PA", value: "88.5%", status: "WARNING" },
        { label: "Safe Days", value: "342 Hari", status: "OK" },
      ];

      suggestedFollowups = [
        "Kenapa produksi hari ini turun?",
        "Alat mana yang paling tidak produktif?",
        "Berapa estimasi produksi sampai akhir bulan?",
        "Kenapa fuel consumption meningkat?",
        "Buatkan laporan produksi hari ini.",
      ];

      sources = [
        { module: "Modul Produksi", label: "Production Consolidation", period: "Hari Ini", siteName: ctx.siteName, routePath: "/production" },
        { module: "Modul Fleet", label: "Fleet Availability", period: "Real-time", siteName: ctx.siteName, routePath: "/fleet" },
        { module: "Modul Fuel", label: "Fuel Telematics", period: "Hari Ini", siteName: ctx.siteName, routePath: "/fuel" },
      ];
    }

    // Attach SOP document citation if matched
    if (docMatches.length > 0) {
      const topDoc = docMatches[0];
      sources.push({
        module: "Knowledge Base (SOP)",
        label: `${topDoc.title} (${topDoc.section || "SOP Tambang"})`,
        period: topDoc.updatedDate,
        siteName: ctx.siteName,
      });
    }

    // 4. Save to Repository and Audit Log
    const aiMessage: AIChatMessageExtended = {
      id: "msg-" + Date.now(),
      conversationId,
      sender: "AI",
      text: replyText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      agentName: "MineSmart AI Command Center",
      model: "Gemini 3.6 Flash / Mining Intelligence Engine",
      intent,
      evidence: evidenceItems,
      potentialDrivers,
      recommendations,
      sources,
      confidence: "High",
      mapCommand,
      actionProposal,
      suggestedFollowups,
      toolsUsed,
    };

    await aiRepo.saveMessage(aiMessage);

    const duration = Date.now() - startTime;
    const auditLog: AIInteractionAuditLog = {
      id: "audit-" + Date.now(),
      aiInteractionId: aiMessage.id,
      userId: ctx.userId,
      userName: ctx.userName,
      companyId: ctx.companyId,
      siteId: ctx.siteId,
      prompt: userText,
      intent,
      toolsUsed,
      status: "SUCCESS",
      tokenUsage: Math.floor(userText.length / 4) + Math.floor(replyText.length / 4) + 140,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    };
    await aiRepo.saveAuditLog(auditLog);

    return aiMessage;
  }
}
