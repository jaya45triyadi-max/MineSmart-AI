// MINE SMART AI - Mining Scenario & What-If Analysis Service

import { MiningScenario, MinePlan } from "../../types/minePlanningTypes";
import { MinePlanningCalculationService } from "./MinePlanningCalculationService";

export class MiningScenarioService {
  /**
   * Creates a cloned scenario from an existing Mine Plan for What-If analysis
   */
  public static createScenarioFromPlan(
    basePlan: MinePlan,
    scenarioName: string,
    description: string,
    targetMultiplier: number = 1.0,
    fuelPriceImpactPercent: number = 0,
    fleetAvailabilityPercent: number = 90
  ): MiningScenario {
    const coalMt = Math.round(basePlan.coalTargetMt * targetMultiplier * 100) / 100;
    const wasteMbc = Math.round(basePlan.wasteTargetMbc * targetMultiplier * 100) / 100;
    const stripRatio = MinePlanningCalculationService.calculateStripRatio(wasteMbc, coalMt);

    // Calculate cost impact ($45 base mining cost / ton coal + fuel adjustments)
    const baseCostIdrBillion = (coalMt * 0.45 + wasteMbc * 0.25) * (1 + fuelPriceImpactPercent / 100);
    const npvEstIdrBillion = (coalMt * 0.95 - baseCostIdrBillion * 0.6) * 10;

    return {
      id: `scen-${Date.now()}`,
      companyId: basePlan.companyId,
      siteId: basePlan.siteId,
      scenarioId: `SCEN-${Date.now().toString().slice(-4)}`,
      scenarioCode: "SCENARIO_A",
      name: scenarioName,
      subtitle: `What-If: ${targetMultiplier}x Mult, Fuel ${fuelPriceImpactPercent}%`,
      description,
      strategyFocus: "HIGH_VOLUME_AGGRESSIVE",
      riskRating: "MODERATE",
      aiScore: 85,
      isRecommendedByAI: false,
      basePlanId: basePlan.planId,
      targetMultiplier,
      fuelPriceImpactPercent,
      fleetAvailabilityPercent,
      metrics: {
        coalProductionMt: coalMt,
        obRemovalMbc: wasteMbc,
        cleanCoalMt: Math.round(coalMt * 0.96 * 100) / 100,
        averageGarKcal: 4200,
        strippingCostPerBcmUSD: 2.15 * (1 + fuelPriceImpactPercent / 100),
        coalMiningCostPerTonUSD: 5.30,
        haulingCostPerTonUSD: 3.40 * (1 + fuelPriceImpactPercent / 100),
        totalOpexUSD: Math.round(baseCostIdrBillion * 65000),
        revenueEstUSD: Math.round(coalMt * 70 * 1000000),
        profitMarginPerTonUSD: Math.round((70 - 24.5) * 10) / 10,
        npvUSDMillion: Math.round(npvEstIdrBillion * 0.065 * 10) / 10,
        actualStripRatio: stripRatio,
        economicBreakEvenSR: 7.8,
        averageHaulDistanceKm: 3.8,
        cycleTimeMinutes: 20.0,
        fuelBurnRatioLPerBcm: 1.25,
        totalFuelLitersPerDay: 75000,
        fleetExcavatorCount: 4,
        fleetDumpTruckCount: 22,
        equipmentUtilizationPercent: fleetAvailabilityPercent,
        carbonEmissionTonPerMonth: 6200,
      },
      results: {
        coalMt,
        wasteMbc,
        stripRatio,
        totalCostIdrBillion: Math.round(baseCostIdrBillion * 10) / 10,
        npvEstIdrBillion: Math.round(npvEstIdrBillion * 10) / 10,
      },
      pros: ["Simulasi What-If dinamis", "Target kapasitas terkalibrasi"],
      cons: ["Sensitif terhadap fluktuasi harga bahan bakar solar"],
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Runs What-If analysis question and calculates output metrics
   */
  public static runWhatIfAnalysis(
    scenario: MiningScenario,
    parameterUpdates: {
      targetMultiplier?: number;
      fuelPriceImpactPercent?: number;
      fleetAvailabilityPercent?: number;
    }
  ): MiningScenario {
    const multiplier = parameterUpdates.targetMultiplier ?? scenario.targetMultiplier ?? 1.0;
    const fuelImpact = parameterUpdates.fuelPriceImpactPercent ?? scenario.fuelPriceImpactPercent ?? 0;
    const fleetAvail = parameterUpdates.fleetAvailabilityPercent ?? scenario.fleetAvailabilityPercent ?? 90;

    const baseCoal = (scenario.results?.coalMt || scenario.metrics.coalProductionMt) / (scenario.targetMultiplier || 1);
    const baseWaste = (scenario.results?.wasteMbc || scenario.metrics.obRemovalMbc) / (scenario.targetMultiplier || 1);

    const coalMt = Math.round(baseCoal * multiplier * (fleetAvail / 90) * 100) / 100;
    const wasteMbc = Math.round(baseWaste * multiplier * (fleetAvail / 90) * 100) / 100;
    const stripRatio = MinePlanningCalculationService.calculateStripRatio(wasteMbc, coalMt);

    const costBillion = (coalMt * 0.45 + wasteMbc * 0.25) * (1 + fuelImpact / 100);
    const npvBillion = (coalMt * 0.95 - costBillion * 0.6) * 10;

    return {
      ...scenario,
      targetMultiplier: multiplier,
      fuelPriceImpactPercent: fuelImpact,
      fleetAvailabilityPercent: fleetAvail,
      metrics: {
        ...scenario.metrics,
        coalProductionMt: coalMt,
        obRemovalMbc: wasteMbc,
        actualStripRatio: stripRatio,
        npvUSDMillion: Math.round(npvBillion * 0.065 * 10) / 10,
      },
      results: {
        coalMt,
        wasteMbc,
        stripRatio,
        totalCostIdrBillion: Math.round(costBillion * 10) / 10,
        npvEstIdrBillion: Math.round(npvBillion * 10) / 10,
      },
      updatedAt: new Date().toISOString(),
    };
  }
}
