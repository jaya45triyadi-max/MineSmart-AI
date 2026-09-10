// MINE SMART AI - Operational Health Score Service

export interface HealthScoreComponent {
  name: string;
  weight: number; // percentage, e.g. 30 for 30%
  score: number;  // 0 - 100
  weightedScore: number;
  status: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR" | "CRITICAL";
  detail: string;
}

export interface OperationalHealthScore {
  totalScore: number; // 0 - 100
  rating: "EXCELLENT" | "GOOD" | "MODERATE" | "NEEDS_ATTENTION" | "CRITICAL";
  statusColor: string;
  summary: string;
  components: {
    production: HealthScoreComponent;
    fleet: HealthScoreComponent;
    cost: HealthScoreComponent;
    hse: HealthScoreComponent;
    fuel: HealthScoreComponent;
    stockpile: HealthScoreComponent;
  };
  calculatedAt: string;
}

export class OperationalHealthScoreService {
  /**
   * Calculates overall mining operational health score based on weighted multi-domain KPIs
   */
  public static calculateHealthScore(data: {
    coalActual: number;
    coalTarget: number;
    obActual: number;
    obTarget: number;
    fleetPA: number;
    fleetUA: number;
    actualCostRatio: number; // actual vs budget cost ratio (e.g., 0.98 = 98% of budget)
    incidentsCount: number;
    daysWithoutLTI: number;
    fuelEfficiencyRatio: number; // actual L/ton vs target L/ton (e.g., 1.02 = 2% over target)
    stockpileUtilizationPct: number;
  }): OperationalHealthScore {
    // 1. Production Component (Weight 30%)
    const coalAchievement = data.coalTarget > 0 ? (data.coalActual / data.coalTarget) * 100 : 100;
    const obAchievement = data.obTarget > 0 ? (data.obActual / data.obTarget) * 100 : 100;
    const prodScore = Math.min(100, Math.max(0, (coalAchievement * 0.6 + obAchievement * 0.4)));
    const prodWeighted = (prodScore * 30) / 100;

    // 2. Fleet Component (Weight 20%)
    // Benchmark: PA target ~ 85%, UA target ~ 75%
    const paScore = Math.min(100, (data.fleetPA / 85) * 100);
    const uaScore = Math.min(100, (data.fleetUA / 75) * 100);
    const fleetScore = Math.min(100, Math.max(0, paScore * 0.5 + uaScore * 0.5));
    const fleetWeighted = (fleetScore * 20) / 100;

    // 3. Cost Component (Weight 20%)
    // Cost ratio <= 1.0 is good, > 1.1 is poor
    let costScore = 100;
    if (data.actualCostRatio > 1.0) {
      costScore = Math.max(0, 100 - (data.actualCostRatio - 1.0) * 300);
    }
    const costWeighted = (costScore * 20) / 100;

    // 4. HSE Component (Weight 15%)
    let hseScore = 100;
    if (data.incidentsCount > 0) {
      hseScore -= data.incidentsCount * 25;
    }
    if (data.daysWithoutLTI < 30) {
      hseScore -= 15;
    }
    hseScore = Math.min(100, Math.max(0, hseScore));
    const hseWeighted = (hseScore * 15) / 100;

    // 5. Fuel Component (Weight 10%)
    // fuel ratio <= 1.0 is 100%, > 1.0 drops
    let fuelScore = 100;
    if (data.fuelEfficiencyRatio > 1.0) {
      fuelScore = Math.max(0, 100 - (data.fuelEfficiencyRatio - 1.0) * 250);
    }
    const fuelWeighted = (fuelScore * 10) / 100;

    // 6. Stockpile Component (Weight 5%)
    // Optimal stockpile utilization is 40% - 85%
    let stockpileScore = 100;
    if (data.stockpileUtilizationPct > 90) {
      stockpileScore = 60; // Near capacity
    } else if (data.stockpileUtilizationPct < 20) {
      stockpileScore = 70; // Low buffer
    }
    const stockpileWeighted = (stockpileScore * 5) / 100;

    // Total Score calculation
    const totalScore = Math.round(prodWeighted + fleetWeighted + costWeighted + hseWeighted + fuelWeighted + stockpileWeighted);

    let rating: OperationalHealthScore["rating"] = "GOOD";
    let statusColor = "emerald";
    let summary = "Operasi tambang berjalan dengan performa optimal secara keseluruhan.";

    if (totalScore >= 90) {
      rating = "EXCELLENT";
      statusColor = "emerald";
      summary = "Kinerja operasional tambang berada pada level tertinggi melebihi target bulanan.";
    } else if (totalScore >= 75) {
      rating = "GOOD";
      statusColor = "emerald";
      summary = "Operasi tambang stabil dengan pencapaian target produksi dan fleet yang kuat.";
    } else if (totalScore >= 60) {
      rating = "MODERATE";
      statusColor = "amber";
      summary = "Kinerja tambang berada pada level moderat, perlu optimasi cycle time dan biaya operasional.";
    } else if (totalScore >= 45) {
      rating = "NEEDS_ATTENTION";
      statusColor = "amber";
      summary = "Perhatian diperlukan! Terjadi deviasi produksi dan peningkatan downtime peralatan.";
    } else {
      rating = "CRITICAL";
      statusColor = "rose";
      summary = "PERINGATAN KRITIS: Operasi tambang memerlukan tindakan darurat pada fleet dan ketaatan HSE.";
    }

    return {
      totalScore,
      rating,
      statusColor,
      summary,
      components: {
        production: {
          name: "Pencapaian Produksi",
          weight: 30,
          score: Math.round(prodScore),
          weightedScore: Number(prodWeighted.toFixed(1)),
          status: prodScore >= 90 ? "EXCELLENT" : prodScore >= 75 ? "GOOD" : prodScore >= 60 ? "MODERATE" : "POOR",
          detail: `Batu bara ${coalAchievement.toFixed(1)}% & OB ${obAchievement.toFixed(1)}% dari target.`,
        },
        fleet: {
          name: "Performa Fleet & Alat",
          weight: 20,
          score: Math.round(fleetScore),
          weightedScore: Number(fleetWeighted.toFixed(1)),
          status: fleetScore >= 85 ? "EXCELLENT" : fleetScore >= 70 ? "GOOD" : "MODERATE",
          detail: `Physical Availability (PA) ${data.fleetPA.toFixed(1)}% & Utilization (UA) ${data.fleetUA.toFixed(1)}%.`,
        },
        cost: {
          name: "Efisiensi Biaya (Cost Control)",
          weight: 20,
          score: Math.round(costScore),
          weightedScore: Number(costWeighted.toFixed(1)),
          status: costScore >= 85 ? "EXCELLENT" : costScore >= 70 ? "GOOD" : "MODERATE",
          detail: `Realisasi biaya ${((data.actualCostRatio - 1) * 100 > 0 ? '+' : '') + ((data.actualCostRatio - 1) * 100).toFixed(1)}% vs anggaran.`,
        },
        hse: {
          name: "Keselamatan & Kesehatan Kerja (HSE)",
          weight: 15,
          score: Math.round(hseScore),
          weightedScore: Number(hseWeighted.toFixed(1)),
          status: hseScore >= 90 ? "EXCELLENT" : hseScore >= 75 ? "GOOD" : "CRITICAL",
          detail: `${data.daysWithoutLTI} hari tanpa LTI, ${data.incidentsCount} incident aktif.`,
        },
        fuel: {
          name: "Efisiensi Konsumsi BBM",
          weight: 10,
          score: Math.round(fuelScore),
          weightedScore: Number(fuelWeighted.toFixed(1)),
          status: fuelScore >= 85 ? "EXCELLENT" : fuelScore >= 70 ? "GOOD" : "MODERATE",
          detail: `Konsumsi bahan bakar ${((data.fuelEfficiencyRatio - 1) * 100 > 0 ? '+' : '') + ((data.fuelEfficiencyRatio - 1) * 100).toFixed(1)}% dari standar baseline.`,
        },
        stockpile: {
          name: "Kapasitas & Manajemen Stockpile",
          weight: 5,
          score: Math.round(stockpileScore),
          weightedScore: Number(stockpileWeighted.toFixed(1)),
          status: stockpileScore >= 85 ? "EXCELLENT" : stockpileScore >= 70 ? "GOOD" : "MODERATE",
          detail: `Okupansi stockpile berada di tingkat ${data.stockpileUtilizationPct.toFixed(1)}%.`,
        },
      },
      calculatedAt: new Date().toISOString(),
    };
  }
}
