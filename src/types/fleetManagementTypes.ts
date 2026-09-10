// MINE SMART AI - Fleet Management & Real-Time Telemetry Types

import { BaseEntity } from "./index";

export type FleetUnitStatus = "RUNNING" | "IDLE" | "BREAKDOWN" | "MAINTENANCE";

export type FleetCategory =
  | "DUMP_TRUCK"
  | "EXCAVATOR"
  | "DOZER"
  | "MOTOR_GRADER"
  | "WATER_TRUCK"
  | "WHEEL_LOADER"
  | "DRILL_RIG"
  | "COMPACTOR"
  | "SUPPORT";

export interface FleetUnitOperator {
  operatorId: string;
  name: string;
  nik: string;
  badgeNumber: string;
  simperNumber: string;
  simperExpiry: string;
  shift: "SHIFT_1_DAY" | "SHIFT_2_NIGHT";
  fatigueScore: number; // 0-100 (e.g. <30 Low Risk, 30-70 Moderate, >70 High Risk)
  fatigueStatus: "FIT_TO_WORK" | "MONITOR_FATIGUE" | "UNFIT_REST_REQUIRED";
  assignedSince: string;
  operatorRating: number; // 1-5
  phone: string;
}

export interface FleetUnitMaintenance {
  lastServiceDate: string;
  lastServiceSMU: number;
  lastServiceType: "PM_250" | "PM_500" | "PM_1000" | "PM_2000" | "OVERHAUL" | "UNSCHEDULED_REPAIR";
  nextServiceSMU: number;
  remainingHoursToService: number;
  serviceStatus: "GOOD" | "DUE_SOON" | "OVERDUE" | "IN_WORKSHOP";
  assignedMechanic?: string;
  currentWorkOrderId?: string;
  workOrderDescription?: string;
  breakdownReason?: string;
  estimatedReturnToService?: string;
  componentHealth: {
    engine: number; // % 0-100
    transmission: number;
    hydraulic: number;
    finalDrive: number;
    tiresOrTracks: number;
    brakeSystem: number;
  };
}

export interface FleetCycleTimeBreakdown {
  queueAtLoaderMin: number;
  spotAtLoaderMin: number;
  loadingTimeMin: number;
  haulLoadedMin: number;
  queueAtDumpMin: number;
  dumpingTimeMin: number;
  returnEmptyMin: number;
  totalCycleTimeMin: number;
  haulDistanceKm: number;
  avgSpeedLoadedKmh: number;
  avgSpeedEmptyKmh: number;
}

export interface FleetUnitProfile extends BaseEntity {
  unitId: string; // e.g. DT-785-01, EX-3600-01
  brand: string; // e.g. Komatsu, Caterpillar, Hitachi, Volvo
  model: string; // e.g. HD785-7, 777E, EX3600-6, PC2000-8
  category: FleetCategory;
  capacity: string; // e.g. 91.0 Ton / 60 m³, 22.0 m³ Bucket
  capacityValue: number; // Numeric payload or bucket capacity (Ton or m³)
  capacityUnit: "Ton" | "m³" | "Liter";
  
  // Engine Hour (SMU)
  engineHour: number; // Total Lifetime SMU (hrs)
  shiftStartEngineHour: number;
  shiftDeltaEngineHour: number;
  engineRpm: number;
  engineTemperatureC: number;
  oilPressureKpa: number;

  // Fuel System
  fuelLevelPercent: number; // % (0-100)
  fuelTankCapacityLiters: number;
  fuelCurrentLiters: number;
  fuelBurnRateLitersPerHour: number;
  fuelSpecificConsumption: number; // Liters / BCM or Liters / Ton
  shiftTotalFuelConsumedLiters: number;
  fuelCostTodayUsd: number;

  // Location & Spatial
  location: string; // e.g. Pit 1 South - Bench 10 (RL 45m), Disposal North West
  pitArea: "Pit 1 South" | "Pit 2 North" | "Disposal North" | "Stockpile ROM A" | "Workshop Bay" | "Haul Road";
  latitude: number;
  longitude: number;
  elevationRl: number;
  lastGpsUpdate: string;

  // Real-Time Operational Status
  status: FleetUnitStatus;
  statusChangeTimestamp: string;
  statusReason?: string;

  // Operator
  operator: FleetUnitOperator;

  // Maintenance
  maintenance: FleetUnitMaintenance;

  // Key Performance Indicators (Unit Specific)
  availability: {
    physicalAvailabilityPA: number; // %
    mechanicalAvailabilityMA: number; // %
  };
  utilization: {
    utilizationOfAvailabilityUA: number; // %
    effectiveUtilizationEU: number; // %
  };
  productivity: {
    bcmPerHour: number;
    tonPerHour: number;
    tripsCountToday: number;
    totalTonsHauledToday: number;
    totalBcmExcavatedToday: number;
    payloadCompliancePercent: number; // % (Overload >110%, Underload <90%, Optimal 90-110%)
    actualAvgPayloadTons: number;
    targetPayloadTons: number;
  };
  idleTime: {
    totalIdleHoursToday: number;
    idlePercentageOfShift: number; // %
    idleFuelBurnLiters: number;
    idleCostImpactUsd: number;
    primaryIdleReason: "Shovel Queue" | "Dump Queue" | "Operator Rest" | "Weather / Rain" | "Blasting Delay" | "Refueling" | "None";
  };
  cycleTime: FleetCycleTimeBreakdown;

  // Telemetry & Sensor
  speedKmh: number;
  payloadTonActual: number;
  isGpsOnline: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetKPIOverview {
  totalFleetCount: number;
  statusDistribution: {
    runningCount: number;
    idleCount: number;
    breakdownCount: number;
    maintenanceCount: number;
    runningPercentage: number;
    idlePercentage: number;
    breakdownPercentage: number;
    maintenancePercentage: number;
  };

  // The 7 Core KPIs
  availability: {
    fleetPhysicalAvailabilityPA: number; // % (e.g. 89.4%)
    fleetMechanicalAvailabilityMA: number; // % (e.g. 92.1%)
    targetPA: number;
  };
  utilization: {
    fleetUtilizationOfAvailabilityUA: number; // % (e.g. 84.6%)
    fleetEffectiveUtilizationEU: number; // % (e.g. 75.6%)
    targetUA: number;
  };
  productivity: {
    totalBcmToday: number;
    totalTonToday: number;
    avgBcmPerHour: number;
    avgTonPerHour: number;
    targetBcmShift: number;
    achievementPercentage: number;
  };
  fuelConsumption: {
    totalFuelConsumedLitersToday: number;
    avgFleetBurnRateLitersPerHour: number;
    fuelConsumptionPerBcm: number; // Liters / BCM
    totalFuelCostUsd: number;
    anomalyUnitsCount: number;
  };
  idleTime: {
    totalFleetIdleHoursToday: number;
    avgIdleHoursPerUnit: number;
    totalIdleFuelWastedLiters: number;
    totalIdleCostWastedUsd: number;
    topBottleneckLocation: string;
  };
  cycleTime: {
    avgTotalCycleTimeMin: number;
    avgQueueLoaderMin: number;
    avgSpotLoaderMin: number;
    avgLoadingMin: number;
    avgHaulLoadedMin: number;
    avgQueueDumpMin: number;
    avgDumpingMin: number;
    avgReturnEmptyMin: number;
    avgSpeedKmh: number;
  };
  engineHour: {
    totalFleetOperatingHoursToday: number;
    avgOperatingHoursPerUnit: number;
    unitsDueForMaintenanceWithin24h: number;
  };
}
