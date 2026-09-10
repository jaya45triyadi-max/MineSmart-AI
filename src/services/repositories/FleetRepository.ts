// MINE SMART AI - Fleet Repository & KPI Real-Time Analytics Service

import { BaseRepository } from "./BaseRepository";
import { FleetUnitProfile, FleetKPIOverview, FleetUnitStatus } from "../../types/fleetManagementTypes";
import { INITIAL_FLEET_UNITS, INITIAL_FLEET_KPI_OVERVIEW } from "../../data/fleetData";

export class FleetRepository extends BaseRepository<FleetUnitProfile> {
  private static instance: FleetRepository;
  private units: FleetUnitProfile[] = [...INITIAL_FLEET_UNITS];

  constructor() {
    super("fleet_units", INITIAL_FLEET_UNITS);
  }

  public static getInstance(): FleetRepository {
    if (!FleetRepository.instance) {
      FleetRepository.instance = new FleetRepository();
    }
    return FleetRepository.instance;
  }

  public getAllFleetUnits(): FleetUnitProfile[] {
    return this.units;
  }

  public getUnitById(id: string): FleetUnitProfile | undefined {
    return this.units.find((u) => u.id === id || u.unitId === id);
  }

  public addUnit(unit: FleetUnitProfile): FleetUnitProfile {
    this.units.unshift(unit);
    return unit;
  }

  public updateUnit(id: string, updates: Partial<FleetUnitProfile>): FleetUnitProfile | null {
    const index = this.units.findIndex((u) => u.id === id || u.unitId === id);
    if (index !== -1) {
      this.units[index] = {
        ...this.units[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return this.units[index];
    }
    return null;
  }

  public setUnitStatus(id: string, newStatus: FleetUnitStatus, reason?: string): FleetUnitProfile | null {
    const index = this.units.findIndex((u) => u.id === id || u.unitId === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      this.units[index] = {
        ...this.units[index],
        status: newStatus,
        statusChangeTimestamp: now,
        statusReason: reason || `Status diubah ke ${newStatus}`,
        updatedAt: now,
      };
      return this.units[index];
    }
    return null;
  }

  public deleteUnit(id: string): boolean {
    const beforeCount = this.units.length;
    this.units = this.units.filter((u) => u.id !== id && u.unitId !== id);
    return this.units.length < beforeCount;
  }

  public calculateKPIOverview(): FleetKPIOverview {
    const total = this.units.length;
    if (total === 0) return INITIAL_FLEET_KPI_OVERVIEW;

    const running = this.units.filter((u) => u.status === "RUNNING").length;
    const idle = this.units.filter((u) => u.status === "IDLE").length;
    const breakdown = this.units.filter((u) => u.status === "BREAKDOWN").length;
    const maintenance = this.units.filter((u) => u.status === "MAINTENANCE").length;

    // Availability
    const avgPA =
      this.units.reduce((sum, u) => sum + (u.availability?.physicalAvailabilityPA || 85), 0) / total;
    const avgMA =
      this.units.reduce((sum, u) => sum + (u.availability?.mechanicalAvailabilityMA || 90), 0) / total;

    // Utilization
    const avgUA =
      this.units.reduce((sum, u) => sum + (u.utilization?.utilizationOfAvailabilityUA || 80), 0) / total;
    const avgEU =
      this.units.reduce((sum, u) => sum + (u.utilization?.effectiveUtilizationEU || 75), 0) / total;

    // Productivity
    const totalBcmToday = this.units.reduce(
      (sum, u) => sum + (u.productivity?.totalBcmExcavatedToday || 0),
      0
    );
    const totalTonToday = this.units.reduce(
      (sum, u) => sum + (u.productivity?.totalTonsHauledToday || 0),
      0
    );
    const avgBcmPerHour =
      this.units.reduce((sum, u) => sum + (u.productivity?.bcmPerHour || 0), 0);
    const avgTonPerHour =
      this.units.reduce((sum, u) => sum + (u.productivity?.tonPerHour || 0), 0);

    // Fuel
    const totalFuelConsumed = this.units.reduce(
      (sum, u) => sum + (u.shiftTotalFuelConsumedLiters || 0),
      0
    );
    const avgBurnRate =
      this.units.reduce((sum, u) => sum + (u.fuelBurnRateLitersPerHour || 0), 0) / total;

    // Idle
    const totalIdleHours = this.units.reduce(
      (sum, u) => sum + (u.idleTime?.totalIdleHoursToday || 0),
      0
    );
    const totalIdleFuel = this.units.reduce(
      (sum, u) => sum + (u.idleTime?.idleFuelBurnLiters || 0),
      0
    );
    const totalIdleCost = this.units.reduce(
      (sum, u) => sum + (u.idleTime?.idleCostImpactUsd || 0),
      0
    );

    // Cycle Time for Trucks
    const trucks = this.units.filter((u) => u.category === "DUMP_TRUCK");
    const truckCount = trucks.length || 1;
    const avgCycleTime =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.totalCycleTimeMin || 25), 0) / truckCount;
    const avgQueueLoader =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.queueAtLoaderMin || 2), 0) / truckCount;
    const avgSpotLoader =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.spotAtLoaderMin || 0.8), 0) / truckCount;
    const avgLoading =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.loadingTimeMin || 3), 0) / truckCount;
    const avgHaulLoaded =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.haulLoadedMin || 9.5), 0) / truckCount;
    const avgQueueDump =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.queueAtDumpMin || 1.2), 0) / truckCount;
    const avgDumping =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.dumpingTimeMin || 1.2), 0) / truckCount;
    const avgReturnEmpty =
      trucks.reduce((sum, u) => sum + (u.cycleTime?.returnEmptyMin || 7.2), 0) / truckCount;

    // Engine Hours
    const totalOperatingHours = this.units.reduce(
      (sum, u) => sum + (u.shiftDeltaEngineHour || 0),
      0
    );
    const dueWithin24h = this.units.filter(
      (u) =>
        u.maintenance?.remainingHoursToService <= 30 ||
        u.maintenance?.serviceStatus === "DUE_SOON" ||
        u.maintenance?.serviceStatus === "OVERDUE"
    ).length;

    return {
      totalFleetCount: total,
      statusDistribution: {
        runningCount: running,
        idleCount: idle,
        breakdownCount: breakdown,
        maintenanceCount: maintenance,
        runningPercentage: Number(((running / total) * 100).toFixed(1)),
        idlePercentage: Number(((idle / total) * 100).toFixed(1)),
        breakdownPercentage: Number(((breakdown / total) * 100).toFixed(1)),
        maintenancePercentage: Number(((maintenance / total) * 100).toFixed(1)),
      },
      availability: {
        fleetPhysicalAvailabilityPA: Number(avgPA.toFixed(1)),
        fleetMechanicalAvailabilityMA: Number(avgMA.toFixed(1)),
        targetPA: 90.0,
      },
      utilization: {
        fleetUtilizationOfAvailabilityUA: Number(avgUA.toFixed(1)),
        fleetEffectiveUtilizationEU: Number(avgEU.toFixed(1)),
        targetUA: 85.0,
      },
      productivity: {
        totalBcmToday: Number(totalBcmToday.toFixed(1)),
        totalTonToday: Number(totalTonToday.toFixed(1)),
        avgBcmPerHour: Number(avgBcmPerHour.toFixed(1)),
        avgTonPerHour: Number(avgTonPerHour.toFixed(1)),
        targetBcmShift: 10000.0,
        achievementPercentage: Number(((totalBcmToday / 10000.0) * 100).toFixed(1)),
      },
      fuelConsumption: {
        totalFuelConsumedLitersToday: Number(totalFuelConsumed.toFixed(1)),
        avgFleetBurnRateLitersPerHour: Number(avgBurnRate.toFixed(1)),
        fuelConsumptionPerBcm: 0.21,
        totalFuelCostUsd: Number((totalFuelConsumed * 1.1).toFixed(1)),
        anomalyUnitsCount: this.units.filter((u) => u.status === "BREAKDOWN" || u.fuelLevelPercent < 20).length,
      },
      idleTime: {
        totalFleetIdleHoursToday: Number(totalIdleHours.toFixed(1)),
        avgIdleHoursPerUnit: Number((totalIdleHours / total).toFixed(2)),
        totalIdleFuelWastedLiters: Number(totalIdleFuel.toFixed(1)),
        totalIdleCostWastedUsd: Number(totalIdleCost.toFixed(1)),
        topBottleneckLocation: "Loading Pocket EX-3600-01 (Pit 1)",
      },
      cycleTime: {
        avgTotalCycleTimeMin: Number(avgCycleTime.toFixed(1)),
        avgQueueLoaderMin: Number(avgQueueLoader.toFixed(1)),
        avgSpotLoaderMin: Number(avgSpotLoader.toFixed(1)),
        avgLoadingMin: Number(avgLoading.toFixed(1)),
        avgHaulLoadedMin: Number(avgHaulLoaded.toFixed(1)),
        avgQueueDumpMin: Number(avgQueueDump.toFixed(1)),
        avgDumpingMin: Number(avgDumping.toFixed(1)),
        avgReturnEmptyMin: Number(avgReturnEmpty.toFixed(1)),
        avgSpeedKmh: 26.8,
      },
      engineHour: {
        totalFleetOperatingHoursToday: Number(totalOperatingHours.toFixed(1)),
        avgOperatingHoursPerUnit: Number((totalOperatingHours / total).toFixed(1)),
        unitsDueForMaintenanceWithin24h: dueWithin24h,
      },
    };
  }
}

export const fleetRepository = FleetRepository.getInstance();
