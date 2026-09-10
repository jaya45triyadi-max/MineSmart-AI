// MINE SMART AI - Mining Schedule Service

import {
  MinePlan,
  WeeklyPlan,
  DailyPlan,
  MiningSequence,
  PlanningConstraint,
  PlanVsActualPerformance,
} from "../../types/minePlanningTypes";
import { MinePlanningCalculationService } from "./MinePlanningCalculationService";

export interface ScheduleConflict {
  id: string;
  type: "DEPENDENCY_MISSING" | "OVERLAPPING_BENCH" | "FLEET_SHORTAGE" | "ROAD_BLOCKED" | "CONSTRAINT_VIOLATION";
  severity: "HIGH" | "MEDIUM" | "CRITICAL";
  title: string;
  description: string;
  affectedItems: string[];
}

export class MiningScheduleService {
  /**
   * Validates schedule hierarchy consistency across Daily -> Weekly -> MTP -> LTP
   */
  public static validateScheduleHierarchy(
    dailyPlans: DailyPlan[],
    weeklyPlans: WeeklyPlan[],
    mtpCoalTarget: number,
    mtpWasteTarget: number
  ): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Sum weekly targets
    const totalWeeklyCoal = weeklyPlans.reduce((sum, w) => sum + w.coalTargetMt, 0);
    const totalWeeklyWaste = weeklyPlans.reduce((sum, w) => sum + w.wasteTargetMbc, 0);

    if (totalWeeklyCoal > mtpCoalTarget * 1.15) {
      warnings.push(`Konsistensi Perencanaan: Total target mingguan (${totalWeeklyCoal} Mt) melebihi alokasi MTP (${mtpCoalTarget} Mt) sebesar >15%.`);
    }

    if (totalWeeklyWaste > mtpWasteTarget * 1.15) {
      warnings.push(`Konsistensi Perencanaan: Total OB mingguan (${totalWeeklyWaste} Mbc) melebihi alokasi MTP (${mtpWasteTarget} Mbc).`);
    }

    // Check daily vs weekly sum
    const totalDailyCoal = dailyPlans.reduce((sum, d) => sum + d.coalTargetMt, 0);
    if (weeklyPlans.length > 0 && totalDailyCoal > weeklyPlans[0].coalTargetMt * 1.2) {
      warnings.push(`Konsistensi Harian: Total alokasi harian melampaui target mingguan aktif.`);
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  /**
   * Detects scheduling & sequence conflicts
   */
  public static detectConflicts(
    sequences: MiningSequence[],
    constraints: PlanningConstraint[],
    dailyPlans: DailyPlan[]
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    // Check active constraints vs active daily plans
    constraints.forEach((c) => {
      if (c.status === "Open" && (c.severity === "HIGH" || c.severity === "CRITICAL")) {
        const affected = dailyPlans.filter((dp) => dp.pitName.toLowerCase().includes(c.affectedArea.toLowerCase()) || c.affectedArea.includes("All"));
        if (affected.length > 0) {
          conflicts.push({
            id: `conf-${Date.now()}-${c.constraintId}`,
            type: "CONSTRAINT_VIOLATION",
            severity: c.severity === "CRITICAL" ? "CRITICAL" : "HIGH",
            title: `Kendala Lapangan: ${c.type} (${c.affectedArea})`,
            description: `Aktivitas penambangan harian berpotensi terganggu oleh kendala "${c.description}".`,
            affectedItems: affected.map((a) => a.dailyId),
          });
        }
      }
    });

    // Check sequence dependencies
    sequences.forEach((seq) => {
      if (seq.predecessorSequenceIds && seq.predecessorSequenceIds.length > 0) {
        const missingPredecessors = seq.predecessorSequenceIds.filter((predId) => {
          const pred = sequences.find((s) => s.sequenceId === predId);
          return !pred || pred.status !== "COMPLETED";
        });

        if (missingPredecessors.length > 0 && seq.status === "IN_PROGRESS") {
          conflicts.push({
            id: `conf-seq-${seq.sequenceId}`,
            type: "DEPENDENCY_MISSING",
            severity: "HIGH",
            title: `Urutan Penambangan Saling Terkunci: ${seq.benchCode}`,
            description: `Sekuens penambangan Bench ${seq.benchCode} dijalankan sebelum sekuens pendahulu selesai.`,
            affectedItems: [seq.sequenceId, ...missingPredecessors],
          });
        }
      }
    });

    return conflicts;
  }

  /**
   * Calculates Plan vs Actual performance summary
   */
  public static calculatePlanVsActualPerformance(dailyPlans: DailyPlan[]): PlanVsActualPerformance[] {
    const perfList: PlanVsActualPerformance[] = [];

    // Group by Pit
    const pitMap: { [pitName: string]: { coalPlan: number; coalActual: number; wastePlan: number; wasteActual: number } } = {};

    dailyPlans.forEach((dp) => {
      if (!pitMap[dp.pitName]) {
        pitMap[dp.pitName] = { coalPlan: 0, coalActual: 0, wastePlan: 0, wasteActual: 0 };
      }
      pitMap[dp.pitName].coalPlan += dp.coalTargetMt;
      pitMap[dp.pitName].coalActual += dp.actualCoalMt || 0;
      pitMap[dp.pitName].wastePlan += dp.wasteTargetMbc;
      pitMap[dp.pitName].wasteActual += dp.actualWasteMbc || 0;
    });

    Object.keys(pitMap).forEach((pit) => {
      const data = pitMap[pit];
      const movePlan = MinePlanningCalculationService.calculateMovement(data.coalPlan, data.wastePlan);
      const moveActual = MinePlanningCalculationService.calculateMovement(data.coalActual, data.wasteActual);
      const srPlan = MinePlanningCalculationService.calculateStripRatio(data.wastePlan, data.coalPlan);
      const srActual = MinePlanningCalculationService.calculateStripRatio(data.wasteActual, data.coalActual);

      const { status, variancePercent } = MinePlanningCalculationService.calculatePlanVariance(movePlan, moveActual);

      perfList.push({
        periodLabel: pit,
        coalPlanMt: Math.round(data.coalPlan * 10) / 10,
        coalActualMt: Math.round(data.coalActual * 10) / 10,
        wastePlanMbc: Math.round(data.wastePlan * 10) / 10,
        wasteActualMbc: Math.round(data.wasteActual * 10) / 10,
        movementPlanMbc: movePlan,
        movementActualMbc: moveActual,
        srPlan,
        srActual,
        status,
        variancePercent,
      });
    });

    return perfList;
  }
}
