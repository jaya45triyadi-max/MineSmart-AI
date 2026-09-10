// MINE SMART AI - Equipment Metrics & Calculation Engine

import { Equipment, EquipmentEngineHourReading, DowntimeCategory } from "../../types/equipmentTypes";

export class EquipmentCalculationService {
  /**
   * Calculate Physical Availability (PA %)
   * PA = (Operating Hours + Standby Hours) / Total Hours * 100
   */
  public static calculatePhysicalAvailability(operatingHours: number, standbyHours: number, totalHours: number): number {
    if (totalHours <= 0) return 100;
    const pa = ((operatingHours + standbyHours) / totalHours) * 100;
    return Math.min(100, Math.max(0, Number(pa.toFixed(1))));
  }

  /**
   * Calculate Mechanical Availability (MA %)
   * MA = Operating Hours / (Operating Hours + Breakdown Hours) * 100
   */
  public static calculateMechanicalAvailability(operatingHours: number, breakdownHours: number): number {
    const denom = operatingHours + breakdownHours;
    if (denom <= 0) return 100;
    const ma = (operatingHours / denom) * 100;
    return Math.min(100, Math.max(0, Number(ma.toFixed(1))));
  }

  /**
   * Calculate Use of Availability (UA %)
   * UA = Operating Hours / (Operating Hours + Standby Hours) * 100
   */
  public static calculateUtilizationOfAvailability(operatingHours: number, standbyHours: number): number {
    const denom = operatingHours + standbyHours;
    if (denom <= 0) return 0;
    const ua = (operatingHours / denom) * 100;
    return Math.min(100, Math.max(0, Number(ua.toFixed(1))));
  }

  /**
   * Calculate Mean Time Between Failures (MTBF) in Hours
   * MTBF = Total Operating Hours / Breakdown Count
   */
  public static calculateMTBF(operatingHours: number, breakdownCount: number): number {
    if (breakdownCount <= 0) return operatingHours;
    return Number((operatingHours / breakdownCount).toFixed(1));
  }

  /**
   * Calculate Mean Time To Repair (MTTR) in Hours
   * MTTR = Total Breakdown Hours / Repair Count
   */
  public static calculateMTTR(totalBreakdownHours: number, repairCount: number): number {
    if (repairCount <= 0) return 0;
    return Number((totalBreakdownHours / repairCount).toFixed(1));
  }

  /**
   * Calculate Total Hauling Cycle Time (Minutes)
   */
  public static calculateCycleTime(
    loadingTimeMin: number,
    travelLoadedMin: number,
    queueAtDumpMin: number,
    dumpingTimeMin: number,
    travelEmptyMin: number,
    queueAtExcavatorMin: number
  ): number {
    return Number(
      (
        loadingTimeMin +
        travelLoadedMin +
        queueAtDumpMin +
        dumpingTimeMin +
        travelEmptyMin +
        queueAtExcavatorMin
      ).toFixed(2)
    );
  }

  /**
   * Validate Engine Hour Entry
   * Prevents currentHour < previousHour
   */
  public static validateEngineHour(
    previousHour: number,
    currentHour: number
  ): { isValid: boolean; isAnomaly: boolean; errorReason?: string } {
    if (currentHour < previousHour) {
      return {
        isValid: false,
        isAnomaly: true,
        errorReason: `Engine Hour Anomaly: Current hour (${currentHour} h) cannot be less than previous recorded hour (${previousHour} h). Requires supervisor review.`,
      };
    }
    if (currentHour - previousHour > 24) {
      return {
        isValid: true,
        isAnomaly: true,
        errorReason: `Engine Hour Anomaly: Incremental reading (+${currentHour - previousHour} h) exceeds 24 hours in a single shift log. Flagged for review.`,
      };
    }
    return { isValid: true, isAnomaly: false };
  }

  /**
   * Calculate Equipment Health Score (0 - 100)
   */
  public static calculateHealthScore(eq: Equipment): { score: number; status: "Healthy" | "Attention" | "Critical" } {
    let score = 100;

    // Deduct for low PA
    if (eq.physicalAvailabilityPA < 70) score -= 30;
    else if (eq.physicalAvailabilityPA < 85) score -= 15;

    // Deduct for status
    if (eq.status === "Breakdown" || eq.status === "Down") score -= 40;
    else if (eq.status === "Maintenance" || eq.status === "Inspection") score -= 20;

    // Deduct for high engine hours without recent overhaul
    if (eq.engineHour > 20000) score -= 15;
    else if (eq.engineHour > 15000) score -= 10;

    // Deduct for GPS offline
    if (eq.isGpsOffline) score -= 10;

    const finalScore = Math.max(0, score);
    let status: "Healthy" | "Attention" | "Critical" = "Healthy";
    if (finalScore < 50) status = "Critical";
    else if (finalScore < 80) status = "Attention";

    return { score: finalScore, status };
  }
}
