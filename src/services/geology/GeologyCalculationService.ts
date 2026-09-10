// MINE SMART AI - Geology Calculation & Coal Quality Formulation Service

import { CoalQualityProfile, CoalRank } from "../../types/geologyTypes";

export class GeologyCalculationService {
  /**
   * Calculates interval thickness from depth ranges with depth sanity checks
   */
  public static calculateThickness(fromDepth: number, toDepth: number): {
    thickness: number;
    isValid: boolean;
    errorReason?: string;
  } {
    if (fromDepth < 0) {
      return { thickness: 0, isValid: false, errorReason: "Kedalaman From Depth tidak boleh < 0" };
    }
    if (toDepth <= fromDepth) {
      return { thickness: 0, isValid: false, errorReason: "Kedalaman To Depth harus lebih besar dari From Depth" };
    }
    const thickness = Math.round((toDepth - fromDepth) * 100) / 100;
    return { thickness, isValid: true };
  }

  /**
   * Calculates roof and floor elevation for seam or lithology interval
   */
  public static calculateSeamElevations(
    collarElevation: number,
    fromDepth: number,
    toDepth: number,
    dipAngleDeg: number = 0
  ): {
    roofElevation: number;
    floorElevation: number;
    trueThickness: number;
    apparentThickness: number;
  } {
    const apparentThickness = Math.max(0, toDepth - fromDepth);
    const roofElevation = Math.round((collarElevation - fromDepth) * 100) / 100;
    const floorElevation = Math.round((collarElevation - toDepth) * 100) / 100;

    // True Thickness = Apparent Thickness * cos(dip)
    const dipRad = (dipAngleDeg * Math.PI) / 180;
    const trueThickness = Math.round((apparentThickness * Math.cos(dipRad)) * 100) / 100;

    return {
      roofElevation,
      floorElevation,
      trueThickness,
      apparentThickness: Math.round(apparentThickness * 100) / 100,
    };
  }

  /**
   * Standard Coal Quality Basis Conversion formulas (ISO 1170 / ASTM D3180)
   */
  public static convertCoalQualityBasis(params: {
    gcvAdbKcalKg: number;
    totalMoistureAr: number;
    inherentMoistureAdb: number;
    ashContentAdb: number;
    totalSulfurAdb: number;
    volatileMatterAdb: number;
    fixedCarbonAdb: number;
  }) {
    const {
      gcvAdbKcalKg,
      totalMoistureAr,
      inherentMoistureAdb,
      ashContentAdb,
      totalSulfurAdb,
      volatileMatterAdb,
      fixedCarbonAdb,
    } = params;

    const denominator = Math.max(1, 100 - inherentMoistureAdb);

    // GAR (Gross As Received)
    const garKcalKg = Math.round(gcvAdbKcalKg * ((100 - totalMoistureAr) / denominator));

    // Dry Basis (db)
    const gcvDbKcalKg = Math.round(gcvAdbKcalKg * (100 / denominator));
    const ashDb = Math.round((ashContentAdb * (100 / denominator)) * 100) / 100;
    const sulfurDb = Math.round((totalSulfurAdb * (100 / denominator)) * 100) / 100;

    // Dry Ash Free Basis (daf)
    const dafDenominator = Math.max(1, 100 - inherentMoistureAdb - ashContentAdb);
    const gcvDafKcalKg = Math.round(gcvAdbKcalKg * (100 / dafDenominator));
    const vmDaf = Math.round((volatileMatterAdb * (100 / dafDenominator)) * 100) / 100;
    const fcDaf = Math.round((fixedCarbonAdb * (100 / dafDenominator)) * 100) / 100;

    // As Received Basis (ar)
    const ashAr = Math.round((ashContentAdb * ((100 - totalMoistureAr) / denominator)) * 100) / 100;
    const sulfurAr = Math.round((totalSulfurAdb * ((100 - totalMoistureAr) / denominator)) * 100) / 100;
    const vmAr = Math.round((volatileMatterAdb * ((100 - totalMoistureAr) / denominator)) * 100) / 100;
    const fcAr = Math.round((fixedCarbonAdb * ((100 - totalMoistureAr) / denominator)) * 100) / 100;

    // NAR (Net As Received) estimation: NAR ≈ GAR - (50.6 * H_ar) - (5.85 * TM)
    // Approximate with standard hydrogen in low-rank coal ~ 5.2%
    const narKcalKg = Math.max(0, Math.round(garKcalKg - (50.6 * 5.2) - (5.85 * totalMoistureAr)));

    // Proximate Closure (IM + Ash + VM + FC)
    const proximateSum = Math.round((inherentMoistureAdb + ashContentAdb + volatileMatterAdb + fixedCarbonAdb) * 100) / 100;

    return {
      garKcalKg,
      narKcalKg,
      gcvDbKcalKg,
      gcvDafKcalKg,
      ashAr,
      ashDb,
      sulfurAr,
      sulfurDb,
      vmAr,
      vmDaf,
      fcAr,
      fcDaf,
      proximateSum,
      isProximateBalanced: Math.abs(proximateSum - 100) <= 0.15,
    };
  }

  /**
   * Classifies Coal Rank according to ASTM D388 standards
   */
  public static classifyCoalRank(gcvAdbKcalKg: number, vmDaf: number): CoalRank {
    if (gcvAdbKcalKg >= 7000) {
      if (vmDaf < 14) return "ANTHRACITE";
      if (vmDaf < 31) return "BITUMINOUS_MEDIUM_VOLATILE";
      return "BITUMINOUS_HIGH_VOLATILE";
    }
    if (gcvAdbKcalKg >= 5800) return "SUB_BITUMINOUS_A";
    if (gcvAdbKcalKg >= 5000) return "SUB_BITUMINOUS_B";
    if (gcvAdbKcalKg >= 4200) return "SUB_BITUMINOUS_C";
    return "LIGNITE";
  }

  /**
   * Simulates multi-coal blend quality (Weighted Averages)
   */
  public static simulateCoalBlend(
    coals: {
      name: string;
      weightTon: number;
      gar: number;
      gcvAdb: number;
      tm: number;
      im: number;
      ash: number;
      sulfur: number;
    }[]
  ) {
    const totalWeight = coals.reduce((acc, c) => acc + c.weightTon, 0);
    if (totalWeight <= 0) {
      return {
        totalWeightTon: 0,
        blendGAR: 0,
        blendGCVAdb: 0,
        blendTM: 0,
        blendIM: 0,
        blendAsh: 0,
        blendSulfur: 0,
      };
    }

    const blendGAR = Math.round(coals.reduce((acc, c) => acc + c.gar * c.weightTon, 0) / totalWeight);
    const blendGCVAdb = Math.round(coals.reduce((acc, c) => acc + c.gcvAdb * c.weightTon, 0) / totalWeight);
    const blendTM = Math.round((coals.reduce((acc, c) => acc + c.tm * c.weightTon, 0) / totalWeight) * 100) / 100;
    const blendIM = Math.round((coals.reduce((acc, c) => acc + c.im * c.weightTon, 0) / totalWeight) * 100) / 100;
    const blendAsh = Math.round((coals.reduce((acc, c) => acc + c.ash * c.weightTon, 0) / totalWeight) * 100) / 100;
    const blendSulfur = Math.round((coals.reduce((acc, c) => acc + c.sulfur * c.weightTon, 0) / totalWeight) * 100) / 100;

    return {
      totalWeightTon: totalWeight,
      blendGAR,
      blendGCVAdb,
      blendTM,
      blendIM,
      blendAsh,
      blendSulfur,
    };
  }

  /**
   * Calculates Geological Resource Tonnage (Area * Thickness * Density * (1 - Loss%))
   */
  public static calculateResourceTonnage(
    areaM2: number,
    trueThicknessM: number,
    densityTonneM3: number = 1.32,
    geologicalLossPercent: number = 5.0
  ): {
    grossVolumeM3: number;
    grossTonnageMt: number;
    netTonnageMt: number;
  } {
    const grossVolumeM3 = areaM2 * trueThicknessM;
    const grossTonnageTon = grossVolumeM3 * densityTonneM3;
    const netTonnageTon = grossTonnageTon * (1 - geologicalLossPercent / 100);

    return {
      grossVolumeM3: Math.round(grossVolumeM3),
      grossTonnageMt: Math.round((grossTonnageTon / 1000000) * 100) / 100,
      netTonnageMt: Math.round((netTonnageTon / 1000000) * 100) / 100,
    };
  }

  /**
   * Calculates Statistical Range (Min, Max, Avg, Median, StdDev) for a Coal Quality parameter
   */
  public static calculateQualityStatistics(
    profiles: CoalQualityProfile[],
    parameterName: keyof CoalQualityProfile
  ): {
    count: number;
    min: number;
    max: number;
    avg: number;
    median: number;
    stdDev: number;
  } {
    const validValues = profiles
      .filter((p) => p.validationStatus === "VALID" && typeof p[parameterName] === "number")
      .map((p) => p[parameterName] as number)
      .sort((a, b) => a - b);

    if (validValues.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, median: 0, stdDev: 0 };
    }

    const count = validValues.length;
    const min = validValues[0];
    const max = validValues[count - 1];
    const sum = validValues.reduce((acc, v) => acc + v, 0);
    const avg = Math.round((sum / count) * 100) / 100;

    // Median
    const mid = Math.floor(count / 2);
    const median =
      count % 2 !== 0
        ? Math.round(validValues[mid] * 100) / 100
        : Math.round(((validValues[mid - 1] + validValues[mid]) / 2) * 100) / 100;

    // StdDev
    const variance =
      validValues.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / count;
    const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

    return {
      count,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      avg,
      median,
      stdDev,
    };
  }
}
