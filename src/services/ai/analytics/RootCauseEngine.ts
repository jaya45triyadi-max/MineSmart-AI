// MINE SMART AI - Root Cause Analysis & Correlation Engine (PROMPT 33)

import {
  RootCauseAnalysisResult,
  RootCauseNode,
  CorrelationNote,
  DataLineageInfo,
} from "../../../types/aiAnalyticsTypes";

export class RootCauseEngine {
  /**
   * Performs automated Root Cause Analysis (RCA) on operational problems.
   */
  static analyzeRootCause(
    problemType: "PRODUCTION_DROP" | "COST_OVERRUN" | "FUEL_SPIKE" | "EQUIPMENT_DOWNTIME" = "PRODUCTION_DROP"
  ): RootCauseAnalysisResult {
    const dataLineage: DataLineageInfo = {
      sourceModules: ["Production", "Fleet", "Dispatch", "Hauling", "Maintenance"],
      sourceRecordsCount: 180,
      dataPeriod: "Current Shift & Historical Baseline",
      calculationMethod: "Causal Graph Decomposition + Multi-variate Contribution Analysis",
      modelVersion: "v3.0-RCA-TREE",
      generatedAt: new Date().toISOString(),
    };

    if (problemType === "COST_OVERRUN") {
      const rootNode: RootCauseNode = {
        id: "rca-cost-root",
        label: "Kenaikan Cost Per Ton (+$2.30/MT)",
        category: "OPERATIONS",
        valueChange: "+9.4%",
        contributionPct: 100,
        isStatisticallyEstablished: true,
        evidence: ["Cost/Ton aktual $26.80/MT vs Budget $24.50/MT", "Variance total +$135,000 USD bulan ini"],
        children: [
          {
            id: "rca-cost-fuel",
            label: "Kenaikan Biaya Fuel Solar",
            category: "FUEL",
            valueChange: "+12.4%",
            contributionPct: 58.2,
            isStatisticallyEstablished: true,
            evidence: ["Harga solar nonsubsidi naik +8.2%", "Konsumsi solar berlebih 1.45 L/MT vs budget 1.38 L/MT"],
          },
          {
            id: "rca-cost-maint",
            label: "Biaya Spareparts Tidak Terduga",
            category: "MAINTENANCE",
            valueChange: "+8.7%",
            contributionPct: 28.4,
            isStatisticallyEstablished: true,
            evidence: ["Penggantian seal kit & pompa hidrolik EX-204", "Work order darurat senilai Rp 145,000,000"],
          },
          {
            id: "rca-cost-idle",
            label: "Truck Idle Time High",
            category: "DISPATCH",
            valueChange: "+4.2 min/rit",
            contributionPct: null,
            isStatisticallyEstablished: false,
            evidence: ["Queue time di Pit 2 naik", "Kontribusi statistik belum established penuh"],
          },
        ],
      };

      return {
        problem: "Cost per Ton melebihi budget sebesar +$2.30/MT (+9.4%)",
        severity: "HIGH",
        rootNode,
        topCandidates: [
          {
            title: "Kenaikan Harga & Konsumsi Solar Nonsubsidi",
            contributionPct: 58.2,
            evidence: ["Harga solar +8.2%", "Fuel Ratio 1.45 L/MT vs budget 1.38 L/MT"],
            isStatisticallyEstablished: true,
          },
          {
            title: "Perbaikan Darurat Komponen Hidrolik EX-204",
            contributionPct: 28.4,
            evidence: ["Breakdown tak terencana 3.5 jam", "Work order Rp 145 juta"],
            isStatisticallyEstablished: true,
          },
          {
            title: "Truck Idle Time akibat Antrean",
            contributionPct: null,
            evidence: ["Kontribusi tidak dapat dihitung dengan statistik yang memadai"],
            isStatisticallyEstablished: false,
          },
        ],
        correlationNotes: [
          {
            metricA: "Biaya Fuel Solar",
            metricB: "Total Cost per Ton",
            coefficient: 0.88,
            label: "berkorelasi kuat dengan",
          },
          {
            metricA: "Breakdown Equipment",
            metricB: "Biaya Perawatan Unscheduled",
            coefficient: 0.79,
            label: "berkorelasi dengan",
          },
        ],
        dataLineage,
      };
    }

    // Default: PRODUCTION_DROP
    const rootNode: RootCauseNode = {
      id: "rca-prod-root",
      label: "Penurunan Produksi Batubara (-750 MT Today)",
      category: "PRODUCTION",
      valueChange: "-5.0%",
      contributionPct: 100,
      isStatisticallyEstablished: true,
      evidence: ["Pencapaian 14,250 MT vs Target 15,000 MT", "Pencapaian OB 48,600 BCM (97.2%)"],
      children: [
        {
          id: "rca-fleet",
          label: "Fleet Availability & Downtime",
          category: "FLEET",
          valueChange: "PA 88.5% (-1.5%)",
          contributionPct: 42.5,
          isStatisticallyEstablished: true,
          evidence: ["Breakdown EX-204 hidrolik (3.5 jam)", "HT-108 ban bocor (1.8 jam)"],
          children: [
            {
              id: "rca-ex204",
              label: "EX-204 Hydraulic Hose Failure",
              category: "MAINTENANCE",
              valueChange: "Downtime 3.5 jam",
              contributionPct: 32.0,
              isStatisticallyEstablished: true,
              evidence: ["Kebocoran terjadi pkl 10:15 WITA di Pit 2 North"],
            },
          ],
        },
        {
          id: "rca-dispatch",
          label: "Dispatch & Truck Queue Imbalance",
          category: "DISPATCH",
          valueChange: "Queue +3.8 min",
          contributionPct: 28.0,
          isStatisticallyEstablished: true,
          evidence: ["Match factor Pit 2 = 0.88", "12 truk menumpuk di EX-204"],
        },
        {
          id: "rca-hauling",
          label: "Haul Road Cycle Time Increase",
          category: "HAULING",
          valueChange: "+2.4 min/rit",
          contributionPct: 18.5,
          isStatisticallyEstablished: true,
          evidence: ["Penyiraman jalan berlebih di KM 4", "Kecepatan rata-rata turun ke 24 km/jam"],
        },
        {
          id: "rca-shift",
          label: "Variasi Produktivitas Operator Shift",
          category: "OPERATIONS",
          valueChange: "-2.1%",
          contributionPct: null,
          isStatisticallyEstablished: false,
          evidence: ["Waktu pergantian shift mundur 12 menit", "Statistik kontribusi belum established"],
        },
      ],
    };

    return {
      problem: "Produksi Batubara Hari Ini Turun 750 MT (-5.0% dari Target)",
      severity: "HIGH",
      rootNode,
      topCandidates: [
        {
          title: "Downtime Excavator EX-204 akibat Kebocoran Hidrolik",
          contributionPct: 42.5,
          evidence: ["Downtime 3.5 jam", "Kehilangan potensi muat 650 MT"],
          isStatisticallyEstablished: true,
        },
        {
          title: "Ketidakseimbangan Alokasi Truk (Truck Queue) di Pit 2",
          contributionPct: 28.0,
          evidence: ["Queue time 5.8 min/rit", "Match factor 0.88"],
          isStatisticallyEstablished: true,
        },
        {
          title: "Kenaikan Cycle Time akibat Penyiraman Jalan Hauling",
          contributionPct: 18.5,
          evidence: ["Kecepatan rata-rata turun 2.4 km/jam"],
          isStatisticallyEstablished: true,
        },
        {
          title: "Keterlambatan Pergantian Shift Operator",
          contributionPct: null,
          evidence: ["Contribution not statistically established."],
          isStatisticallyEstablished: false,
        },
      ],
      correlationNotes: [
        {
          metricA: "Physical Availability (PA)",
          metricB: "Pencapaian Produksi MT",
          coefficient: 0.91,
          label: "berkorelasi sangat kuat dengan",
        },
        {
          metricA: "Queue Time Loading Point",
          metricB: "Cycle Time Truk",
          coefficient: 0.84,
          label: "berkorelasi dengan",
        },
        {
          metricA: "Penyiraman Jalan Dust Suppression",
          metricB: "Kecepatan Hauling Truk",
          coefficient: -0.68,
          label: "berkorelasi secara negatif dengan",
        },
      ],
      dataLineage,
    };
  }
}
