// MINE SMART AI - IoT Center & 8-Sensor Anomaly Engine Types

export type SensorCategoryType =
  | "fuel"
  | "temperature"
  | "pressure"
  | "engine"
  | "gps"
  | "vibration"
  | "weight"
  | "environment";

export type IoTAnomalySeverity = "CRITICAL" | "WARNING" | "NOTICE" | "NORMAL";
export type AnomalyStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "AUTO_SUPPRESSED";

export interface FuelSensorData {
  tankLevelPct: number; // 0 - 100%
  currentVolumeLiter: number; // e.g. 850 L
  tankCapacityLiter: number; // e.g. 1300 L
  burnRateLiterPerHour: number; // e.g. 68.4 L/h
  estimatedRemainingHours: number;
  flowSensorStatus: "NORMAL" | "RAPID_DROP_DRAIN" | "REFUELING" | "DISCONNECTED";
  fuelQualityWaterContentPpm: number;
  lastRefuelTimestamp?: string;
  lastDrainAlertTimestamp?: string;
}

export interface TemperatureSensorData {
  engineCoolantC: number; // normal 82-95 °C, warning >98, critical >105
  hydraulicOilC: number; // normal 65-80 °C, warning >85, critical >92
  exhaustManifoldC: number; // normal 450-620 °C, warning >650, critical >700
  transmissionOilC: number; // normal 70-85 °C
  frontBrakeDiscC: number; // normal 120-220 °C
  rearBrakeDiscC: number; // normal 130-240 °C
  ambientC: number; // normal 28-36 °C
  differentialBearingC: number; // normal 50-75 °C
}

export interface PressureSensorData {
  engineOilPressureBar: number; // normal 3.2 - 5.5 bar, warning <2.5, critical <1.8
  hydraulicSystemBar: number; // normal 210 - 280 bar, warning >310, critical >340
  turboBoostPressureBar: number; // normal 1.8 - 2.6 bar
  brakeCircuitPressureBar: number; // normal 140 - 180 bar
  tpmsTiresPsi: {
    frontLeft: number; // normal 105-115 PSI
    frontRight: number;
    rearLeftOuter: number;
    rearLeftInner: number;
    rearRightInner: number;
    rearRightOuter: number;
  };
  filterDifferentialPressureKpa: number; // normal 15-40 kPa
}

export interface EngineSensorData {
  rpm: number; // 0 - 2400 RPM
  engineLoadPct: number; // 0 - 100%
  throttlePositionPct: number; // 0 - 100%
  engineTorqueNm: number; // e.g. 3200 Nm
  batteryVoltageV: number; // normal 24.2 - 28.4 V, critical <22.5 V
  alternatorCurrentAmp: number;
  totalEngineHours: number;
  idleTimeRatioPct: number;
  dtcActiveFaultCodes: Array<{
    code: string; // e.g. "SPN 110 FMI 0"
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
  }>;
  engineStatus: "RUNNING" | "IDLE" | "OFF" | "CRANKING" | "EMERGENCY_SHUTDOWN";
}

export interface GpsSensorData {
  latitude: number;
  longitude: number;
  speedKmh: number; // 0 - 75 km/h
  headingDeg: number; // 0 - 360°
  altitudeM: number; // e.g. 142 m
  geofenceZone: "PIT_01_BENCH" | "PIT_02_WEST" | "HAUL_ROAD_KM4" | "ROM_STOCKPILE" | "WORKSHOP_MAIN" | "BLAST_DANGER_ZONE" | "OFF_PERIMETER";
  satelliteCount: number;
  hdopAcuracy: number; // < 1.0 is sub-meter RTK
  isGeofenceBreached: boolean;
  isInRestrictedArea: boolean;
}

export interface VibrationSensorData {
  frontStrutRmsMmS: number; // normal 2.0 - 6.5 mm/s, warning >9.0, critical >14.0
  rearStrutRmsMmS: number;
  triaxialG: {
    xAxisLateral: number; // lateral roll force (g)
    yAxisLongitudinal: number; // braking/accel pitch force (g)
    zAxisVertical: number; // vertical shock impact (g)
  };
  shockPotholeCount1h: number;
  bearingVibrationFrequencyHz: number; // FFT peak
  roadRoughnessIndexIRI: number; // International Roughness Index (m/km)
}

export interface WeightSensorData {
  payloadGrossTon: number; // e.g. 94.5 Ton
  payloadNetCoalTon: number; // e.g. 32.8 Ton
  emptyTareWeightTon: number; // e.g. 61.7 Ton
  ratedCapacityTon: number; // e.g. 91.0 Ton
  payloadStatus: "EMPTY" | "LOADING" | "OPTIMAL" | "OVERLOAD" | "EXTREME_OVERLOAD";
  overloadPct: number; // e.g. +3.8%
  suspensionStrutPressureBar: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  axleBalanceLeftRightRatio: number; // normal 0.95 - 1.05
}

export interface EnvironmentSensorData {
  dustPM25_ugm3: number; // normal <35, warning >55, critical >150
  dustPM10_ugm3: number; // normal <75, warning >120, critical >150 (ESDM)
  ambientHumidityPct: number; // 40 - 95%
  ambientTemperatureC: number; // 26 - 38 °C
  rainRateMmPerHour: number; // 0 - 60 mm/h
  windSpeedMs: number; // 0 - 25 m/s
  windDirectionDeg: number;
  airQualityIndexAQI: number; // 0 - 500
  hazardousGasPpm: {
    carbonMonoxideCO: number; // normal <15 ppm, critical >25
    nitrogenDioxideNO2: number; // normal <1.0 ppm, critical >3.0
    hydrogenSulfideH2S: number; // normal <1.0 ppm, critical >10.0
    methaneCH4_LEL_Pct: number; // normal 0%, critical >1.0%
  };
  solarRadiationWm2: number;
}

export interface EquipmentIoTTelemetry {
  id: string; // e.g. "IOT-HD-785-04"
  equipmentCode: string; // e.g. "HD-785-04"
  equipmentName: string; // e.g. "Komatsu HD785-7 Haul Truck #04"
  equipmentType: "HAUL_TRUCK" | "EXCAVATOR" | "BULLDOZER" | "MOTOR_GRADER" | "FUEL_BOWSER" | "PIT_WEATHER_STATION" | "PIT_SUMP_PUMP";
  siteId: string;
  siteName: string;
  assignedOperator: string;
  hardwareGateway: {
    deviceId: string;
    model: string;
    firmware: string;
    ipAddress: string;
    protocol: "MQTT" | "CAN_J1939" | "TCP_SOCKET" | "MODBUS_RTU" | "REST_POLL";
    signalStrengthDbm: number;
    batteryBackupPct: number;
    lastPingTimestamp: string;
    status: "ONLINE" | "DEGRADED" | "OFFLINE";
  };
  // The 8 Core Sensors:
  fuel: FuelSensorData;
  temperature: TemperatureSensorData;
  pressure: PressureSensorData;
  engine: EngineSensorData;
  gps: GpsSensorData;
  vibration: VibrationSensorData;
  weight: WeightSensorData;
  environment: EnvironmentSensorData;

  // Real-time Health & Anomaly Index
  overallHealthScorePct: number; // 0 - 100%
  activeAnomaliesCount: number;
  highestSeverity: IoTAnomalySeverity;
  historicalTelemetryBuffer?: Array<{
    timestamp: string;
    fuelLevel: number;
    coolantTemp: number;
    oilPressure: number;
    engineRpm: number;
    speed: number;
    vibrationRms: number;
    payloadTon: number;
    dustPM10: number;
  }>;
}

export interface IoTAnomaly {
  id: string;
  timestamp: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName?: string;
  equipmentType: string;
  siteId: string;
  sensorCategory: SensorCategoryType;
  metricName: string;
  metricLabel: string;
  observedValue: number | string;
  unit: string;
  expectedRange: {
    min: number;
    max: number;
  };
  deviationPct: number;
  severity: IoTAnomalySeverity;
  anomalyScore: number; // 0 - 100
  aiDetectionModel: "ISOLATION_FOREST" | "Z_SCORE_DYNAMIC" | "GEMINI_NEURAL_REASONER" | "CORRELATION_MATRIX";
  aiConfidencePct: number;
  aiDiagnosis: string;
  aiRootCauseHypothesis: string;
  aiFailureProbabilityPct: number;
  aiEstimatedTimeToFailureHours?: number;
  aiRecommendedActions: string[];
  status: AnomalyStatus;
  workOrderId?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface SensorThresholdConfig {
  sensorCategory: SensorCategoryType;
  metricKey: string;
  metricLabel: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  rateOfChangeLimitPerMinute?: number;
  autoTriggerWorkOrder: boolean;
  autoNotifyDispatcher: boolean;
  autoInterlockShutdown: boolean;
}

export interface IoTAnalyticsSummary {
  totalSensorsMonitored: number;
  onlineGatewaysCount: number;
  totalTelemetryPacketsToday: number;
  ingestionRatePerSec: number;
  averageFleetHealthScorePct: number;
  criticalAnomaliesCount: number;
  warningAnomaliesCount: number;
  noticeAnomaliesCount: number;
  anomaliesByCategory: Record<SensorCategoryType, number>;
  fuelTheftAlertsToday: number;
  overloadIncidentsToday: number;
  overheatingRisksToday: number;
  highVibrationPotholesToday: number;
  aiDetectionAccuracyPct: number;
}
