// MINE SMART AI - Mine Planning AI Assistant & Optimization Service

import { MinePlan, WeeklyPlan, DailyPlan, MiningScenario } from "../../types/minePlanningTypes";

export interface AIPlanningResponse {
  problem: string;
  dataEvidence: string;
  rootCause: string;
  impact: string;
  recommendation: string;
  expectedImpact: string;
  generatedDraftPlan?: Partial<WeeklyPlan | DailyPlan | MinePlan>;
  isActionBlockedByGuardrail?: boolean;
}

export class MinePlanningAIService {
  /**
   * Processes user AI planning query with safety guardrails
   */
  public static processAIQuery(query: string, activePlan?: MinePlan): AIPlanningResponse {
    const q = query.toLowerCase();

    // Check Safety Guardrail violations
    if (
      q.includes("activate plan") ||
      q.includes("setujui plan") ||
      q.includes("hapus geometri") ||
      q.includes("delete pit") ||
      q.includes("ubah cadangan resmi")
    ) {
      return {
        problem: "Gagal Meng-eksekusi Perintah Kritis",
        dataEvidence: "Aksi yang diminta melibatkan aktivasi plan / penghapusan geometri / pengubahan cadangan resmi.",
        rootCause: "AI Safety Guardrail Enforcement (Prompt 9 Requirement #55).",
        impact: "Operasi terblokir otomatis demi perlindungan integritas data tambang.",
        recommendation: "Lakukan perubahan secara manual melalui alur approval resmi Planner -> Reviewer -> Manager.",
        expectedImpact: "Kepatuhan audit trail & integritas data teknik tambang terjaga.",
        isActionBlockedByGuardrail: true,
      };
    }

    if (q.includes("breakdown") || q.includes("ex-05") || q.includes("alat berat")) {
      return {
        problem: "Risiko Shortfall Produksi Akibat Breakdown Fleet EX-05 (PC1250)",
        dataEvidence: "EX-05 mengalami breakdown 2 hari di Pit 1 South Bench RL +20m.",
        rootCause: "Kerusakan hidrolik boom cylinder utama pada unit loader loader primer.",
        impact: "Potensi kehilangan penggalian OB sebesar 18,500 BCM (-12% dari target mingguan).",
        recommendation: "Alihkan 2 unit Haul Truck Komatsu HD785 ke Fleet EX-02 (Pit 2 North) yang memiliki surplus kapasitas loader +18%. Adjust shift plan harian.",
        expectedImpact: "Defisit penggalian OB dapat ditekan hingga tinggal -2.5% tanpa mengganggu target coal getting.",
      };
    }

    if (q.includes("sequence") || q.includes("pushback") || q.includes("terbaik")) {
      return {
        problem: "Optimalisasi Urutan (Sequence) Penambangan Pushback",
        dataEvidence: "Pushback 1 (PB01) berada di Strip Ratio rendah 3.2:1 sedangkan Pushback 2 (PB02) mencapai 5.8:1.",
        rootCause: "Elevasi galian PB01 sudah mendekati bottom pit floor RL -10m.",
        impact: "Kemajuan galian ke PB02 membutuhkan pembersihan ramp & stripping OB lebih awal.",
        recommendation: "Prioritaskan penggalian OB di PB02 Bench RL +80m secara paralel dengan coal getting PB01 akhir bulan ini.",
        expectedImpact: "Strip Ratio rata-rata operasional tetap stabil di 4.1:1 dan tidak terjadi bottleneck pasokan ROM.",
      };
    }

    if (q.includes("fleet") || q.includes("kebutuhan") || q.includes("target")) {
      return {
        problem: "Kebutuhan Tambahan Fleet Alokasi MTP Q3 2026",
        dataEvidence: "Target movement Q3 naik menjadi 2.8 Juta BCM/bulan (Strip Ratio 4.2:1).",
        rootCause: "Peningkatan rasio pemindahan overburden pada tahap pushback PB03.",
        impact: "Kapasitas fleet eksisting hanya mampu melayani 2.45 Juta BCM/bulan (gap -350,000 BCM).",
        recommendation: "Sewa/alokasikan tambahan 2 unit Excavator Class 120 Ton (PC1250) dan 8 unit Rigid Truck 90 Ton (HD785).",
        expectedImpact: "Pencapaian target MTP terjamin 100% tanpa potensi keterlambatan jadwal delivery coal.",
      };
    }

    // Default general response
    return {
      problem: "Evaluasi Rencana & Efisiensi Operasional Mine Planning",
      dataEvidence: `Rencana aktif: ${activePlan?.title || "LTP 2026 v1.0"} (Target Coal: ${activePlan?.coalTargetMt || 1.2} Mt, Strip Ratio: ${activePlan?.targetStripRatio || 4.2}:1).`,
      rootCause: "Variasi produktivitas harian dan fluktuasi jarak hauling ke disposal.",
      impact: "Variansi produksi berada dalam rentang wajar (+2.4% di atas target harian).",
      recommendation: "Pertahankan jadwal pengupasan OB di Bench RL +30m dan pantau potensi bahaya longsor di dinding lereng utara.",
      expectedImpact: "Operasi berjalan lancar dengan indeks keselamatan (HSE) nol insiden.",
    };
  }

  /**
   * Generates a Draft Weekly Plan using AI
   */
  public static generateDraftWeeklyPlan(weekNumber: number, pitName: string): WeeklyPlan {
    return {
      id: `plan-draft-wk${weekNumber}-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      weekId: `WK-${weekNumber}`,
      weekNumber,
      dateRange: `Minggu Ke-${weekNumber} (Awal Bulan)`,
      pitId: "pit-01",
      pushbackId: "pb-01",
      benchCode: "RL +20.0m",
      coalTargetMt: 35000,
      wasteTargetMbc: 145000,
      movementTargetMbc: 172000,
      equipmentTargetUnits: 14,
      dailyAllocations: [
        { dayName: "Mon", dateStr: "Day 1", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Tue", dateStr: "Day 2", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Wed", dateStr: "Day 3", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Thu", dateStr: "Day 4", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Fri", dateStr: "Day 5", coalTargetMt: 5000, wasteTargetMbc: 20000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Sat", dateStr: "Day 6", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
        { dayName: "Sun", dateStr: "Day 7", coalTargetMt: 5000, wasteTargetMbc: 21000, equipmentAssigned: "EX-01, EX-02", status: "SCHEDULED" },
      ],
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
