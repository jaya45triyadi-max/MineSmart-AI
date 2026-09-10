// MINE SMART AI - Mine Planning Calculation Service

export class MinePlanningCalculationService {
  /**
   * Calculates Strip Ratio: Waste Volume (bcm) / Coal Tonnage (MT)
   */
  public static calculateStripRatio(wasteMbc: number, coalMt: number): number {
    if (!coalMt || coalMt <= 0) return 0;
    const ratio = wasteMbc / coalMt;
    return Math.round(ratio * 100) / 100;
  }

  /**
   * Calculates Total Movement (BCM or Equivalent Weight)
   */
  public static calculateMovement(coalMt: number, wasteMbc: number, coalSpecificGravity: number = 1.3): number {
    // Total Volume = Waste BCM + Coal Volume (Mt / SG)
    const coalM3 = coalMt / coalSpecificGravity;
    const totalMovementMbc = wasteMbc + coalM3;
    return Math.round(totalMovementMbc * 100) / 100;
  }

  /**
   * Calculates Life of Mine (LOM) projection details
   */
  public static calculateLOM(
    initialReserveMt: number,
    annualCoalMt: number,
    annualWasteMbc: number
  ) {
    if (!annualCoalMt || annualCoalMt <= 0) {
      return { years: 0, overallStripRatio: 0, yearlyDepletion: [] };
    }

    const years = Math.ceil(initialReserveMt / annualCoalMt);
    const overallStripRatio = this.calculateStripRatio(annualWasteMbc, annualCoalMt);

    let remaining = initialReserveMt;
    const yearlyDepletion = [];

    for (let i = 1; i <= years; i++) {
      const minedThisYear = Math.min(remaining, annualCoalMt);
      remaining -= minedThisYear;
      yearlyDepletion.push({
        year: i,
        coalTargetMt: Math.round(minedThisYear * 100) / 100,
        wasteTargetMbc: Math.round((annualWasteMbc * (minedThisYear / annualCoalMt)) * 100) / 100,
        stripRatio: overallStripRatio,
        remainingReserveMt: Math.max(0, Math.round(remaining * 100) / 100),
        revenueEstMUSD: Math.round(minedThisYear * 65 * 10) / 10, // $65/ton avg coal price
      });
    }

    return {
      years,
      overallStripRatio,
      yearlyDepletion,
    };
  }

  /**
   * Calculates Plan Variance percentage
   */
  public static calculatePlanVariance(planned: number, actual: number): {
    variance: number;
    variancePercent: number;
    status: "Above Plan" | "On Plan" | "Below Plan" | "Critical";
  } {
    const variance = actual - planned;
    const variancePercent = planned > 0 ? Math.round(((actual - planned) / planned) * 100) : 0;

    let status: "Above Plan" | "On Plan" | "Below Plan" | "Critical" = "On Plan";
    if (variancePercent >= 5) status = "Above Plan";
    else if (variancePercent >= -5) status = "On Plan";
    else if (variancePercent >= -15) status = "Below Plan";
    else status = "Critical";

    return { variance, variancePercent, status };
  }

  /**
   * Calculates required Fleet Excavator & Hauler units to reach movement target
   */
  public static calculateEquipmentRequirement(
    monthlyMovementMbc: number,
    excavatorProdBcmHr: number = 350,
    operatingHoursPerMonth: number = 550
  ): {
    excavatorUnitsNeeded: number;
    truckUnitsNeeded: number;
    dozerUnitsNeeded: number;
  } {
    const totalRequiredBcm = monthlyMovementMbc * 1_000_000;
    const prodPerExcavatorPerMonth = excavatorProdBcmHr * operatingHoursPerMonth;
    const excavatorUnitsNeeded = Math.ceil(totalRequiredBcm / prodPerExcavatorPerMonth);
    const truckUnitsNeeded = Math.ceil(excavatorUnitsNeeded * 4.5); // 4-5 trucks per loader
    const dozerUnitsNeeded = Math.ceil(excavatorUnitsNeeded * 0.8);

    return {
      excavatorUnitsNeeded,
      truckUnitsNeeded,
      dozerUnitsNeeded,
    };
  }
}
