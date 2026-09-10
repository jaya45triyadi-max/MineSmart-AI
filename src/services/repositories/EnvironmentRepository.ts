// MINE SMART AI - Environmental Repository Service

import {
  MonitoringPoint,
  WaterSample,
  WaterQualityResult,
  WaterDischargeRecord,
  WaterBalanceSummary,
  AirMonitoringStation,
  AirQualityReading,
  DustMonitoringRecord,
  WaterTruckDustControl,
  EnvironmentalWasteRecord,
  DrainagePoint,
  DrainageInspection,
  SedimentPond,
  SedimentPondInspection,
  EnvironmentalStandard,
  EnvironmentalComplianceRequirement,
  EnvironmentalPermit,
  EnvironmentalIncident,
  EnvironmentalCAPA,
  EnvironmentalAIInsight,
  EnvironmentalKPISummary,
  EnvironmentalOfflineDraft,
} from "../../types/environmentTypes";

export class EnvironmentRepository {
  private monitoringPoints: MonitoringPoint[] = [
    {
      id: "mp-1",
      monitoringPointId: "MP-WAT-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      code: "SW-01",
      name: "Outfall Sediment Pond Alpha 1",
      type: "WATER",
      locationName: "Pit Alpha Outfall Stream",
      latitude: -3.4215,
      longitude: 115.2341,
      elevation: 45,
      coordinateSystem: "UTM Zone 50S",
      status: "ACTIVE",
      samplingFrequency: "DAILY",
      responsiblePerson: "Ahmad Dahlan (Env Engineer)",
      lastSampleDate: "2026-08-12",
      createdAt: "2026-01-10",
      updatedAt: "2026-08-12",
    },
    {
      id: "mp-2",
      monitoringPointId: "MP-WAT-002",
      companyId: "COMP-01",
      siteId: "SITE-01",
      code: "SW-02",
      name: "Sungai Barito Station Inlet",
      type: "WATER",
      locationName: "Barito River Upstream Boundary",
      latitude: -3.4312,
      longitude: 115.2415,
      elevation: 32,
      coordinateSystem: "UTM Zone 50S",
      status: "ACTIVE",
      samplingFrequency: "WEEKLY",
      responsiblePerson: "Siti Rahma (Env Officer)",
      lastSampleDate: "2026-08-11",
      createdAt: "2026-01-10",
      updatedAt: "2026-08-11",
    },
    {
      id: "mp-3",
      monitoringPointId: "MP-AIR-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      code: "AQ-01",
      name: "Crusher & ROM Stockpile Ambient Station",
      type: "AIR",
      locationName: "ROM Station North Boundary",
      latitude: -3.4189,
      longitude: 115.2288,
      elevation: 60,
      coordinateSystem: "UTM Zone 50S",
      status: "ACTIVE",
      samplingFrequency: "DAILY",
      responsiblePerson: "Budi Santoso (Instrument Tech)",
      lastSampleDate: "2026-08-13",
      createdAt: "2026-01-15",
      updatedAt: "2026-08-13",
    },
    {
      id: "mp-4",
      monitoringPointId: "MP-DST-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      code: "DUST-01",
      name: "Haul Road KM 12 Junction",
      type: "DUST",
      locationName: "Main Haul Road KM 12",
      latitude: -3.4255,
      longitude: 115.2311,
      elevation: 50,
      coordinateSystem: "UTM Zone 50S",
      status: "ACTIVE",
      samplingFrequency: "DAILY",
      responsiblePerson: "Eko Prasetyo (Env Tech)",
      lastSampleDate: "2026-08-13",
      createdAt: "2026-02-01",
      updatedAt: "2026-08-13",
    },
    {
      id: "mp-5",
      monitoringPointId: "MP-SED-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      code: "POND-A",
      name: "Sedimentation Pond Alpha",
      type: "SEDIMENT_POND",
      locationName: "Pit Alpha South Perimeter",
      latitude: -3.4220,
      longitude: 115.2350,
      elevation: 40,
      coordinateSystem: "UTM Zone 50S",
      status: "ACTIVE",
      samplingFrequency: "DAILY",
      responsiblePerson: "Ahmad Dahlan (Env Engineer)",
      lastSampleDate: "2026-08-13",
      createdAt: "2026-01-10",
      updatedAt: "2026-08-13",
    },
  ];

  private waterSamples: WaterSample[] = [
    {
      id: "ws-1",
      sampleId: "SAMP-WAT-2026-0812-01",
      sampleNumber: "SPL-20260812-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      monitoringPointId: "mp-1",
      monitoringPointName: "Outfall Sediment Pond Alpha 1",
      sampleDate: "2026-08-12",
      sampleTime: "08:30",
      sampleType: "DISCHARGE_WATER",
      weatherCondition: "Cerah, Hujan Ringan Semalam",
      collectorName: "Ahmad Dahlan",
      laboratoryName: "PT Sucofindo Lab Banjarmasin",
      chainOfCustodyNumber: "COC-SUCO-88912",
      status: "APPROVED",
      notes: "Sample diambil pasca discharge pompa pit 150 L/s",
      createdAt: "2026-08-12T08:30:00Z",
      updatedAt: "2026-08-12T16:00:00Z",
    },
    {
      id: "ws-2",
      sampleId: "SAMP-WAT-2026-0812-02",
      sampleNumber: "SPL-20260812-002",
      companyId: "COMP-01",
      siteId: "SITE-01",
      monitoringPointId: "mp-2",
      monitoringPointName: "Sungai Barito Station Inlet",
      sampleDate: "2026-08-12",
      sampleTime: "09:15",
      sampleType: "SURFACE_WATER",
      weatherCondition: "Cerah Berawan",
      collectorName: "Siti Rahma",
      laboratoryName: "Internal Site Water Quality Lab",
      chainOfCustodyNumber: "COC-INT-20260812",
      status: "TESTED",
      notes: "Pemantauan rutin sungai penerima dampak",
      createdAt: "2026-08-12T09:15:00Z",
      updatedAt: "2026-08-12T11:45:00Z",
    },
    {
      id: "ws-3",
      sampleId: "SAMP-WAT-2026-0813-01",
      sampleNumber: "SPL-20260813-001",
      companyId: "COMP-01",
      siteId: "SITE-01",
      monitoringPointId: "mp-1",
      monitoringPointName: "Outfall Sediment Pond Alpha 1",
      sampleDate: "2026-08-13",
      sampleTime: "08:00",
      sampleType: "DISCHARGE_WATER",
      weatherCondition: "Cerah",
      collectorName: "Ahmad Dahlan",
      laboratoryName: "PT Sucofindo Lab Banjarmasin",
      chainOfCustodyNumber: "COC-SUCO-88945",
      status: "IN_LAB",
      notes: "Pengujian rutin baku mutu air limbah harian",
      createdAt: "2026-08-13T08:00:00Z",
      updatedAt: "2026-08-13T08:30:00Z",
    },
  ];

  private waterQualityResults: WaterQualityResult[] = [
    {
      id: "wqr-1",
      sampleId: "ws-1",
      parameter: "pH",
      value: 6.8,
      unit: "pH Unit",
      detectionLimit: 0.1,
      method: "SNI 06-6989.11-2004",
      standardLimitMin: 6.0,
      standardLimitMax: 9.0,
      standardId: "STD-PERMEN-113-2003",
      complianceStatus: "COMPLIANT",
      testedBy: "Dedi Setiawan (Lab Tech)",
      testedAt: "2026-08-12T11:00:00Z",
    },
    {
      id: "wqr-2",
      sampleId: "ws-1",
      parameter: "TSS (Total Suspended Solids)",
      value: 180,
      unit: "mg/L",
      detectionLimit: 1.0,
      method: "SNI 06-6989.3-2004 Gravimetri",
      standardLimitMin: 0,
      standardLimitMax: 300,
      standardId: "STD-PERMEN-113-2003",
      complianceStatus: "COMPLIANT",
      testedBy: "Dedi Setiawan (Lab Tech)",
      testedAt: "2026-08-12T11:30:00Z",
    },
    {
      id: "wqr-3",
      sampleId: "ws-1",
      parameter: "Fe (Besi Terlarut)",
      value: 3.4,
      unit: "mg/L",
      detectionLimit: 0.05,
      method: "SNI 6989.4:2009 AAS",
      standardLimitMin: 0,
      standardLimitMax: 7.0,
      standardId: "STD-PERMEN-113-2003",
      complianceStatus: "COMPLIANT",
      testedBy: "Dedi Setiawan (Lab Tech)",
      testedAt: "2026-08-12T14:00:00Z",
    },
    {
      id: "wqr-4",
      sampleId: "ws-1",
      parameter: "Mn (Mangan Terlarut)",
      value: 2.8,
      unit: "mg/L",
      detectionLimit: 0.02,
      method: "SNI 6989.5:2009 AAS",
      standardLimitMin: 0,
      standardLimitMax: 4.0,
      standardId: "STD-PERMEN-113-2003",
      complianceStatus: "COMPLIANT",
      testedBy: "Dedi Setiawan (Lab Tech)",
      testedAt: "2026-08-12T14:20:00Z",
    },
    {
      id: "wqr-5",
      sampleId: "ws-2",
      parameter: "pH",
      value: 7.2,
      unit: "pH Unit",
      detectionLimit: 0.1,
      method: "SNI 06-6989.11-2004",
      standardLimitMin: 6.0,
      standardLimitMax: 9.0,
      standardId: "STD-PERMEN-22-2021",
      complianceStatus: "COMPLIANT",
      testedBy: "Siti Rahma",
      testedAt: "2026-08-12T10:30:00Z",
    },
    {
      id: "wqr-6",
      sampleId: "ws-2",
      parameter: "TSS",
      value: 45,
      unit: "mg/L",
      detectionLimit: 1.0,
      method: "SNI 06-6989.3-2004",
      standardLimitMin: 0,
      standardLimitMax: 50,
      standardId: "STD-PERMEN-22-2021",
      complianceStatus: "COMPLIANT",
      testedBy: "Siti Rahma",
      testedAt: "2026-08-12T10:45:00Z",
    },
  ];

  private waterDischarges: WaterDischargeRecord[] = [
    {
      id: "wd-1",
      dischargeId: "DIS-20260812-01",
      siteId: "SITE-01",
      pointName: "Outfall Sediment Pond Alpha 1",
      date: "2026-08-12",
      volumeM3: 12500,
      flowRateLps: 145,
      pH: 6.8,
      tssMgL: 180,
      permitNumber: "SK-IPLC-2025/ENV-099",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "wd-2",
      dischargeId: "DIS-20260811-01",
      siteId: "SITE-01",
      pointName: "Outfall Sediment Pond Alpha 1",
      date: "2026-08-11",
      volumeM3: 13200,
      flowRateLps: 153,
      pH: 6.7,
      tssMgL: 210,
      permitNumber: "SK-IPLC-2025/ENV-099",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "wd-3",
      dischargeId: "DIS-20260810-01",
      siteId: "SITE-01",
      pointName: "Outfall Sediment Pond Beta 2",
      date: "2026-08-10",
      volumeM3: 9800,
      flowRateLps: 112,
      pH: 6.9,
      tssMgL: 165,
      permitNumber: "SK-IPLC-2025/ENV-099",
      complianceStatus: "COMPLIANT",
    },
  ];

  private waterBalance: WaterBalanceSummary = {
    date: "2026-08-12",
    openingStorageM3: 145000,
    inflowRainfallM3: 18500,
    inflowPitWaterM3: 24000,
    usageCrusherM3: 3500,
    usageRoadWateringM3: 4200,
    dischargeVolumeM3: 22300,
    lossesEvaporationM3: 1500,
    closingStorageM3: 156000,
  };

  private airStations: AirMonitoringStation[] = [
    {
      id: "ast-1",
      stationId: "AQM-STAT-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      name: "Station 1 - ROM & Crusher Boundary",
      locationName: "ROM North Barrier",
      latitude: -3.4189,
      longitude: 115.2288,
      parametersMonitored: ["PM10", "PM2.5", "TSP", "SO2", "NO2", "CO"],
      deviceId: "SENS-AIR-992",
      status: "ONLINE",
      lastReadingAt: "2026-08-13T10:00:00Z",
      calibrationStatus: "VALID",
    },
    {
      id: "ast-2",
      stationId: "AQM-STAT-02",
      companyId: "COMP-01",
      siteId: "SITE-01",
      name: "Station 2 - Mess Camp & Office Area",
      locationName: "Main Camp South",
      latitude: -3.4050,
      longitude: 115.2210,
      parametersMonitored: ["PM10", "PM2.5", "TSP"],
      deviceId: "SENS-AIR-881",
      status: "ONLINE",
      lastReadingAt: "2026-08-13T10:00:00Z",
      calibrationStatus: "VALID",
    },
    {
      id: "ast-3",
      stationId: "AQM-STAT-03",
      companyId: "COMP-01",
      siteId: "SITE-01",
      name: "Station 3 - Pit Alpha Highwall Boundary",
      locationName: "Pit Alpha East Ridge",
      latitude: -3.4210,
      longitude: 115.2390,
      parametersMonitored: ["PM10", "PM2.5", "TSP", "SO2"],
      deviceId: "SENS-AIR-774",
      status: "ONLINE",
      lastReadingAt: "2026-08-13T09:45:00Z",
      calibrationStatus: "DUE_SOON",
    },
  ];

  private airReadings: AirQualityReading[] = [
    {
      id: "ar-1",
      readingId: "RDG-AIR-20260813-01",
      stationId: "ast-1",
      stationName: "Station 1 - ROM & Crusher Boundary",
      timestamp: "2026-08-13T10:00:00Z",
      parameter: "PM10",
      value: 58.4,
      unit: "µg/Nm³",
      standardLimit: 75.0,
      source: "SENSOR",
      qualityFlag: "GOOD",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "ar-2",
      readingId: "RDG-AIR-20260813-02",
      stationId: "ast-1",
      stationName: "Station 1 - ROM & Crusher Boundary",
      timestamp: "2026-08-13T10:00:00Z",
      parameter: "PM2.5",
      value: 28.2,
      unit: "µg/Nm³",
      standardLimit: 55.0,
      source: "SENSOR",
      qualityFlag: "GOOD",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "ar-3",
      readingId: "RDG-AIR-20260813-03",
      stationId: "ast-1",
      stationName: "Station 1 - ROM & Crusher Boundary",
      timestamp: "2026-08-13T10:00:00Z",
      parameter: "TSP",
      value: 142.0,
      unit: "µg/Nm³",
      standardLimit: 230.0,
      source: "SENSOR",
      qualityFlag: "GOOD",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "ar-4",
      readingId: "RDG-AIR-20260813-04",
      stationId: "ast-2",
      stationName: "Station 2 - Mess Camp & Office Area",
      timestamp: "2026-08-13T10:00:00Z",
      parameter: "PM10",
      value: 34.1,
      unit: "µg/Nm³",
      standardLimit: 75.0,
      source: "SENSOR",
      qualityFlag: "GOOD",
      complianceStatus: "COMPLIANT",
    },
    {
      id: "ar-5",
      readingId: "RDG-AIR-20260813-05",
      stationId: "ast-3",
      stationName: "Station 3 - Pit Alpha Highwall Boundary",
      timestamp: "2026-08-13T09:45:00Z",
      parameter: "PM10",
      value: 68.9,
      unit: "µg/Nm³",
      standardLimit: 75.0,
      source: "SENSOR",
      qualityFlag: "GOOD",
      complianceStatus: "WARNING",
    },
  ];

  private dustMonitoringRecords: DustMonitoringRecord[] = [
    {
      id: "dmr-1",
      dustMonitoringId: "DST-20260813-01",
      monitoringPointId: "mp-4",
      monitoringPointName: "Haul Road KM 12 Junction",
      date: "2026-08-13",
      time: "09:00",
      dustSource: "Haul Road",
      valueUgM3: 165.5,
      weatherCondition: "Cerah, Angin 14 km/jam",
      windSpeedKmh: 14,
      windDirection: "Tenggara",
      status: "ELEVATED",
      remarks: "Trafik HD785 padat, dijadwalkan tambahan penyiraman Water Truck WT-04",
    },
    {
      id: "dmr-2",
      dustMonitoringId: "DST-20260813-02",
      monitoringPointId: "mp-3",
      monitoringPointName: "Crusher & ROM Stockpile Ambient Station",
      date: "2026-08-13",
      time: "09:30",
      dustSource: "Crusher",
      valueUgM3: 112.0,
      weatherCondition: "Cerah",
      windSpeedKmh: 10,
      windDirection: "Timur",
      status: "NORMAL",
      remarks: "Water mist spray crusher aktif",
    },
  ];

  private waterTruckActivities: WaterTruckDustControl[] = [
    {
      id: "wt-1",
      truckUnitId: "WT-01 (Scania P360 20kL)",
      driverName: "Slamet Riyadi",
      routeSector: "Haul Road KM 00 - KM 08",
      waterVolumeLiters: 120000,
      tripCount: 6,
      durationMinutes: 360,
      areaCoveredKm: 48,
      date: "2026-08-13",
      status: "ACTIVE",
    },
    {
      id: "wt-2",
      truckUnitId: "WT-02 (Volvo FMX 20kL)",
      driverName: "Bambang Supeno",
      routeSector: "Haul Road KM 08 - KM 16",
      waterVolumeLiters: 100000,
      tripCount: 5,
      durationMinutes: 300,
      areaCoveredKm: 40,
      date: "2026-08-13",
      status: "ACTIVE",
    },
    {
      id: "wt-3",
      truckUnitId: "WT-04 (Hino 500 15kL)",
      driverName: "Agus Wijaya",
      routeSector: "Pit Alpha Ramp & ROM Area",
      waterVolumeLiters: 75000,
      tripCount: 5,
      durationMinutes: 280,
      areaCoveredKm: 25,
      date: "2026-08-13",
      status: "ACTIVE",
    },
  ];

  private wasteRecords: EnvironmentalWasteRecord[] = [
    {
      id: "wst-1",
      wasteId: "WST-20260812-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      wasteType: "Pelumas Bekas / Oli Bekas (B105d)",
      category: "HAZARDOUS_B3",
      sourceLocation: "Central Heavy Equipment Workshop",
      generationDate: "2026-08-12",
      quantity: 12,
      unit: "DRUM",
      temporaryStorageLocation: "TPS B3 Workshop Central (Izin No. 440/TPS-B3/2024)",
      destinationHandler: "PT Wastec International (Transporter/Pengolah Resmi)",
      transportMethod: "Truk Tangki Khusus B3",
      manifestNumber: "MNF-B3-2026-08819",
      status: "STORED",
      createdAt: "2026-08-12T14:00:00Z",
      updatedAt: "2026-08-12T14:00:00Z",
    },
    {
      id: "wst-2",
      wasteId: "WST-20260811-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      wasteType: "Filter Oli & Majun Terkontaminasi (B110d)",
      category: "HAZARDOUS_B3",
      sourceLocation: "Central Workshop & Field Service",
      generationDate: "2026-08-11",
      quantity: 450,
      unit: "KG",
      temporaryStorageLocation: "TPS B3 Workshop Central",
      destinationHandler: "PT Prasadha Pamunah Limbah Industri (PPLI)",
      transportMethod: "Box Truck B3 Sealed",
      manifestNumber: "MNF-B3-2026-08790",
      status: "STORED",
      createdAt: "2026-08-11T16:30:00Z",
      updatedAt: "2026-08-11T16:30:00Z",
    },
    {
      id: "wst-3",
      wasteId: "WST-20260810-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      wasteType: "Besi Tua & Scrap Metal Non-B3",
      category: "SCRAP_METAL",
      sourceLocation: "Fab Shop & Pit Scrap Yard",
      generationDate: "2026-08-10",
      quantity: 8.5,
      unit: "TON",
      temporaryStorageLocation: "Non-B3 Scrap Yard Bay 2",
      destinationHandler: "PT Borneo Metal Recycle",
      transportMethod: "Flatbed Trailer",
      manifestNumber: "MNF-SCRAP-2026-012",
      status: "DISPOSED",
      createdAt: "2026-08-10T10:00:00Z",
      updatedAt: "2026-08-10T15:00:00Z",
    },
    {
      id: "wst-4",
      wasteId: "WST-20260809-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      wasteType: "Sampah Domestik Organik & Anorganik Campuran",
      category: "DOMESTIC",
      sourceLocation: "Main Mess Camp & Canteen",
      generationDate: "2026-08-09",
      quantity: 1.2,
      unit: "TON",
      temporaryStorageLocation: "TPS Domestik Camp",
      destinationHandler: "TPA Landfill Pemda Tapin",
      transportMethod: "Compactor Truck",
      manifestNumber: "MNF-DOM-2026-210",
      status: "DISPOSED",
      createdAt: "2026-08-09T07:00:00Z",
      updatedAt: "2026-08-09T11:00:00Z",
    },
  ];

  private drainagePoints: DrainagePoint[] = [
    {
      id: "dp-1",
      drainageId: "DRN-CHN-01",
      siteId: "SITE-01",
      name: "Saluran Drainase Perimeter Pit Alpha",
      type: "CHANNEL",
      locationName: "Pit Alpha North Wall Outer Contour",
      capacityM3s: 15.5,
      status: "NORMAL",
      inspectionFrequency: "DAILY",
      lastInspectionDate: "2026-08-12",
      nextInspectionDate: "2026-08-13",
      responsiblePerson: "Hendra Wijaya (Civil Engineer)",
    },
    {
      id: "dp-2",
      drainageId: "DRN-CUL-04",
      siteId: "SITE-01",
      name: "Culvert Haul Road Crossing KM 08",
      type: "CULVERT",
      locationName: "Haul Road KM 08 Creek Crossing",
      capacityM3s: 8.0,
      status: "WARNING",
      inspectionFrequency: "DAILY",
      lastInspectionDate: "2026-08-13",
      nextInspectionDate: "2026-08-14",
      responsiblePerson: "Hendra Wijaya (Civil Engineer)",
    },
    {
      id: "dp-3",
      drainageId: "DRN-SMP-02",
      siteId: "SITE-01",
      name: "Sump Main Pit Alpha Floor",
      type: "SUMP",
      locationName: "Pit Alpha Level -45m RL",
      capacityM3s: 45000,
      status: "NORMAL",
      inspectionFrequency: "DAILY",
      lastInspectionDate: "2026-08-13",
      nextInspectionDate: "2026-08-14",
      responsiblePerson: "Rudi Hartono (Pumping Supv)",
    },
  ];

  private drainageInspections: DrainageInspection[] = [
    {
      id: "di-1",
      inspectionId: "INSP-DRN-20260813-01",
      drainageId: "dp-2",
      drainageName: "Culvert Haul Road Crossing KM 08",
      inspectionDate: "2026-08-13",
      inspectorName: "Eko Prasetyo",
      hasBlockage: true,
      hasErosion: false,
      hasSedimentation: true,
      hasOverflow: false,
      structuralDamage: false,
      overallCondition: "WARNING",
      notes: "Terdapat tumpukan kayu lapuk dan endapan lumpur menyumbat 30% mulut culvert",
      correctiveActionRequired: true,
      capaId: "CAPA-ENV-2026-041",
    },
    {
      id: "di-2",
      inspectionId: "INSP-DRN-20260812-01",
      drainageId: "dp-1",
      drainageName: "Saluran Drainase Perimeter Pit Alpha",
      inspectionDate: "2026-08-12",
      inspectorName: "Hendra Wijaya",
      hasBlockage: false,
      hasErosion: false,
      hasSedimentation: false,
      hasOverflow: false,
      structuralDamage: false,
      overallCondition: "NORMAL",
      notes: "Saluran bersih, trapesium profil utuh",
      correctiveActionRequired: false,
    },
  ];

  private sedimentPonds: SedimentPond[] = [
    {
      id: "sp-1",
      pondId: "POND-ALPHA-01",
      siteId: "SITE-01",
      name: "Sedimentation Pond Alpha 1 (4 Kompartemen)",
      locationName: "Pit Alpha Outlet Perimeter",
      designCapacityM3: 65000,
      currentWaterVolumeM3: 38000,
      currentSedimentVolumeM3: 14500,
      waterLevelMeter: 3.2,
      sedimentLevelMeter: 1.4,
      freeboardMeter: 1.8,
      capacityOccupiedPercent: 80.7,
      status: "WARNING",
      lastInspectionDate: "2026-08-13",
      nextInspectionDate: "2026-08-14",
    },
    {
      id: "sp-2",
      pondId: "POND-BETA-02",
      siteId: "SITE-01",
      name: "Sedimentation Pond Beta 2",
      locationName: "Disposal Dump South Outer Boundary",
      designCapacityM3: 45000,
      currentWaterVolumeM3: 21000,
      currentSedimentVolumeM3: 6500,
      waterLevelMeter: 2.1,
      sedimentLevelMeter: 0.7,
      freeboardMeter: 2.5,
      capacityOccupiedPercent: 61.1,
      status: "NORMAL",
      lastInspectionDate: "2026-08-12",
      nextInspectionDate: "2026-08-13",
    },
  ];

  private sedimentPondInspections: SedimentPondInspection[] = [
    {
      id: "spi-1",
      inspectionId: "INSP-POND-20260813-01",
      pondId: "sp-1",
      pondName: "Sedimentation Pond Alpha 1 (4 Kompartemen)",
      date: "2026-08-13",
      inspectorName: "Ahmad Dahlan",
      waterLevel: 3.2,
      sedimentLevel: 1.4,
      freeboard: 1.8,
      phValue: 6.8,
      tssValue: 180,
      status: "WARNING",
      dredgingRequired: true,
      remarks: "Kompartemen 1 & 2 telah terisi sediment 60%. Perlu pengerukan (dredging) excavator amphibi minggu ini.",
    },
  ];

  private standards: EnvironmentalStandard[] = [
    {
      id: "std-1",
      standardId: "STD-PERMEN-113-2003",
      name: "Baku Mutu Air Limbah Kegiatan Penambangan Batubara (Permen LHK No. 113/2003)",
      version: "2003 Rev 1",
      jurisdiction: "Nasional (Kementerian LHK)",
      parameter: "pH",
      minLimit: 6.0,
      maxLimit: 9.0,
      unit: "pH Unit",
      effectiveDate: "2003-07-15",
      status: "ACTIVE",
    },
    {
      id: "std-2",
      standardId: "STD-PERMEN-113-TSS",
      name: "Baku Mutu Air Limbah Tambang Batubara - TSS",
      version: "2003 Rev 1",
      jurisdiction: "Nasional (Kementerian LHK)",
      parameter: "TSS",
      minLimit: 0,
      maxLimit: 400,
      unit: "mg/L",
      effectiveDate: "2003-07-15",
      status: "ACTIVE",
    },
    {
      id: "std-3",
      standardId: "STD-PERMEN-22-2021-PM10",
      name: "Baku Mutu Udara Ambien PP No. 22/2021 - PM10 (24 Jam)",
      version: "PP 22/2021",
      jurisdiction: "Nasional",
      parameter: "PM10",
      minLimit: 0,
      maxLimit: 75,
      unit: "µg/Nm³",
      effectiveDate: "2021-02-02",
      status: "ACTIVE",
    },
  ];

  private complianceRequirements: EnvironmentalComplianceRequirement[] = [
    {
      id: "cr-1",
      requirementId: "REQ-ENV-WAT-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      category: "WATER",
      title: "Pemantauan Kualitas Air Outlet Settling Pond Harian",
      description: "Memastikan pH (6-9) dan TSS (<400 mg/L) air limbah yang dibuang ke badan air penerima sesuai Kepmen LHK 113/2003.",
      referenceDoc: "Permen LHK No. 113 Tahun 2003 & IPLC No. 440/ENV/2025",
      parameter: "pH, TSS, Fe, Mn",
      limitText: "pH: 6.0-9.0, TSS: <400 mg/L, Fe: <7 mg/L, Mn: <4 mg/L",
      monitoringFrequency: "Harian (Internal) / Bulanan (Lab Terakreditasi)",
      reportingFrequency: "Triwulanan ke DLH & ESDM",
      responsiblePerson: "Ahmad Dahlan",
      dueDate: "2026-08-31",
      complianceStatus: "COMPLIANT",
      createdAt: "2026-01-01",
    },
    {
      id: "cr-2",
      requirementId: "REQ-ENV-B3-02",
      companyId: "COMP-01",
      siteId: "SITE-01",
      category: "WASTE",
      title: "Pencatatan Logbook TPS Limbah B3 & Festronik (MoLHK)",
      description: "Pencatatan harian masuk/keluar Limbah B3 dan pelaporan elektronik Festronik KLHK.",
      referenceDoc: "Permen LHK No. 6 Tahun 2021",
      parameter: "Oli Bekas, Filter Bekas, Aki Bekas",
      limitText: "Maksimal penyimpanan 90 hari di TPS B3",
      monitoringFrequency: "Harian",
      reportingFrequency: "Triwulanan",
      responsiblePerson: "Siti Rahma",
      dueDate: "2026-09-10",
      complianceStatus: "COMPLIANT",
      createdAt: "2026-01-01",
    },
  ];

  private permits: EnvironmentalPermit[] = [
    {
      id: "pm-1",
      permitId: "PRM-AMDAL-001",
      permitNumber: "SK.512/MENLHK/SETJEN/PLA.1/8/2021",
      permitType: "AMDAL",
      issuerAuthority: "Kementerian Lingkungan Hidup dan Kehutanan (KLHK)",
      effectiveDate: "2021-08-15",
      expiryDate: "2036-08-15",
      daysToExpiry: 3650,
      status: "ACTIVE",
    },
    {
      id: "pm-2",
      permitId: "PRM-IPLC-002",
      permitNumber: "SK-IPLC-2025/ENV-099",
      permitType: "IPLC_WATER_DISCHARGE",
      issuerAuthority: "Dinas Lingkungan Hidup Kabupaten Tapin",
      effectiveDate: "2025-03-10",
      expiryDate: "2026-09-10",
      daysToExpiry: 28,
      status: "EXPIRING",
    },
    {
      id: "pm-3",
      permitId: "PRM-TPSB3-003",
      permitNumber: "SK-TPSB3-440/12/2024",
      permitType: "TPS_LB3_HAZARDOUS",
      issuerAuthority: "Dinas Penanaman Modal & Pelayanan Terpadu Tapin",
      effectiveDate: "2024-05-20",
      expiryDate: "2027-05-20",
      daysToExpiry: 280,
      status: "ACTIVE",
    },
  ];

  private incidents: EnvironmentalIncident[] = [
    {
      id: "ei-1",
      incidentId: "INC-ENV-2026-004",
      incidentNumber: "ENV-INC-20260810-01",
      companyId: "COMP-01",
      siteId: "SITE-01",
      incidentType: "SPILL",
      severity: "MINOR",
      locationName: "Workshop Central Bay 4",
      incidentDate: "2026-08-10 14:15",
      reportedBy: "Tomi Setiawan (Mechanic)",
      description: "Kebocoran selang hidrolik Excavator PC1250 tumpah sekitar 25 Liter oli hidrolik ke permukaan semen workshop.",
      immediateAction: "Pemasangan Oil Boom / Spill Kit, penaburan serbuk gergaji/absorbent pad, dikumpulkan ke drum limbah B3.",
      containmentStatus: "CONTAINED",
      status: "CLOSED",
    },
    {
      id: "ei-2",
      incidentId: "INC-ENV-2026-005",
      incidentNumber: "ENV-INC-20260812-02",
      companyId: "COMP-01",
      siteId: "SITE-01",
      incidentType: "DRAINAGE_OVERFLOW",
      severity: "MODERATE",
      locationName: "Culvert Haul Road KM 08",
      incidentDate: "2026-08-12 17:30",
      reportedBy: "Eko Prasetyo (Env Tech)",
      description: "Air limpasan hujan deras meluap melewati bahu jalan akibat culvert tersumbat material kayu.",
      immediateAction: "Pembersihan material kayu secara manual dan pembuat tanggul darurat dengan excavator.",
      containmentStatus: "CONTAINED",
      status: "ACTION_REQUIRED",
    },
  ];

  private capas: EnvironmentalCAPA[] = [
    {
      id: "capa-1",
      actionId: "CAPA-ENV-2026-041",
      actionNumber: "CAPA-ENV-041",
      sourceType: "INSPECTION",
      sourceId: "di-1",
      findingDescription: "Culvert Haul Road KM 08 tersumbat kayu dan endapan lumpur 30% sehingga rawan overflow saat hujan deras.",
      correctiveAction: "Pengerukan lumpur culvert menggunakan backhoe loader dan pemasangan trash rack pembatas kayu.",
      priority: "HIGH",
      assignedTo: "Hendra Wijaya",
      department: "Civil & Infrastructure",
      dueDate: "2026-08-16",
      status: "IN_PROGRESS",
    },
    {
      id: "capa-2",
      actionId: "CAPA-ENV-2026-038",
      actionNumber: "CAPA-ENV-038",
      sourceType: "INCIDENT",
      sourceId: "ei-1",
      findingDescription: "Tumpahan oli hidrolik 25 Liter di Workshop akibat inspek selang tidak terjadwal.",
      correctiveAction: "Revisi PM checklist selang hidrolik per 250 jam dan penggantian absorbent pad stok di workshop.",
      priority: "MEDIUM",
      assignedTo: "Budi Santoso",
      department: "Plant Maintenance",
      dueDate: "2026-08-14",
      status: "VERIFIED",
      verificationNotes: "Checklist telah diperbarui di sistem FMS & FMS Maintenance",
      verifiedBy: "Ahmad Dahlan",
    },
  ];

  private aiInsights: EnvironmentalAIInsight[] = [
    {
      id: "aii-1",
      title: "Anomali Peningkatan Sedimen Pond Alpha 1 & Prediksi Overtopping",
      category: "SEDIMENT",
      finding: "Kapasitas Sediment Pond Alpha 1 telah mencapai 80.7% terisi air & sedimen.",
      evidence: "Hasil inspeksi 13 Ags 2026 menunjukkan tinggi sedimen 1.4m dan sisa freeboard tinggal 1.8m.",
      trend: "Akumulasi sedimen meningkat +3.2% per minggu akibat erosi lereng dump timur pasca hujan.",
      possibleCauses: [
        "Erosi permukaan disposal dump timur yang belum ter-revegetasi sempurna",
        "Saluran sudetan perimeter belum dilengkapi check dam batuan",
      ],
      environmentalRisk: "HIGH",
      recommendation: "Mobilisasi Excavator Amphibi Long Arm untuk pengerukan kompartemen 1 dalam 3 hari ke depan sebelum puncak curah hujan.",
      expectedImpact: "Menurunkan risiko meluapnya air keruh (TSS > 400 mg/L) ke Sungai Barito dan menjaga compliance IPLC.",
      confidence: "94% Confidence",
      createdAt: "2026-08-13T07:00:00Z",
    },
    {
      id: "aii-2",
      title: "Optimasi Rute Water Truck Berdasar Sensor Debu KM 12",
      category: "DUST",
      finding: "Konsentrasi debu di KM 12 Haul Road sempat menyentuh 165.5 µg/m³ (Status ELEVATED).",
      evidence: "Data sensor DUST-01 & frekuensi melintas HD785 naik 18% di jam 08:00 - 10:00.",
      trend: "Kecepatan angin 14 km/jam memicu sebaran debu ke arah jalan akses warga desa terdekat.",
      possibleCauses: [
        "Jeda waktu penyiraman Water Truck WT-02 terlalu lama (>45 menit antar trip)",
        "Penggunaan air murni tanpa agen pengikat debu (dust suppressant) pada cuaca terik",
      ],
      environmentalRisk: "MEDIUM",
      recommendation: "Tambahkan agen eco-dust suppressant pada tanki WT-01 & perpendek interval penyiraman KM 08-16 menjadi 25 menit.",
      expectedImpact: "Menurunkan PM10 hingga <50 µg/m³ dan menghemat konsumsi air penyiraman hingga 30%.",
      confidence: "89% Confidence",
      createdAt: "2026-08-13T09:30:00Z",
    },
  ];

  private offlineDrafts: EnvironmentalOfflineDraft[] = [];

  // --- METHODS ---
  async getKPISummary(): Promise<EnvironmentalKPISummary> {
    return {
      environmentalScore: 94.2,
      waterComplianceRate: 98.5,
      airQualityIndex: "BAIK (Good)",
      dustControlCoveragePercent: 91.0,
      totalWasteGeneratedTons: 11.4,
      hazardousWasteStoredTons: 2.8,
      sedimentPondAvgCapacityPercent: 70.9,
      openEnvironmentalIncidents: 1,
      openCAPA: 1,
      overdueCAPA: 0,
      activePermitsCount: 3,
      expiringPermitsCount: 1,
    };
  }

  async getMonitoringPoints(): Promise<MonitoringPoint[]> {
    return [...this.monitoringPoints];
  }

  async getWaterSamples(): Promise<WaterSample[]> {
    return [...this.waterSamples];
  }

  async addWaterSample(sample: Omit<WaterSample, "id" | "createdAt" | "updatedAt">): Promise<WaterSample> {
    const newSample: WaterSample = {
      ...sample,
      id: `ws-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.waterSamples.unshift(newSample);
    return newSample;
  }

  async getWaterQualityResults(sampleId?: string): Promise<WaterQualityResult[]> {
    if (sampleId) {
      return this.waterQualityResults.filter((r) => r.sampleId === sampleId);
    }
    return [...this.waterQualityResults];
  }

  async getWaterDischarges(): Promise<WaterDischargeRecord[]> {
    return [...this.waterDischarges];
  }

  async getWaterBalance(): Promise<WaterBalanceSummary> {
    return { ...this.waterBalance };
  }

  async getAirStations(): Promise<AirMonitoringStation[]> {
    return [...this.airStations];
  }

  async getAirReadings(): Promise<AirQualityReading[]> {
    return [...this.airReadings];
  }

  async getDustRecords(): Promise<DustMonitoringRecord[]> {
    return [...this.dustMonitoringRecords];
  }

  async getWaterTruckActivities(): Promise<WaterTruckDustControl[]> {
    return [...this.waterTruckActivities];
  }

  async getWasteRecords(): Promise<EnvironmentalWasteRecord[]> {
    return [...this.wasteRecords];
  }

  async addWasteRecord(record: Omit<EnvironmentalWasteRecord, "id" | "createdAt" | "updatedAt">): Promise<EnvironmentalWasteRecord> {
    const newRecord: EnvironmentalWasteRecord = {
      ...record,
      id: `wst-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.wasteRecords.unshift(newRecord);
    return newRecord;
  }

  async getDrainagePoints(): Promise<DrainagePoint[]> {
    return [...this.drainagePoints];
  }

  async getDrainageInspections(): Promise<DrainageInspection[]> {
    return [...this.drainageInspections];
  }

  async getSedimentPonds(): Promise<SedimentPond[]> {
    return [...this.sedimentPonds];
  }

  async getSedimentPondInspections(): Promise<SedimentPondInspection[]> {
    return [...this.sedimentPondInspections];
  }

  async getStandards(): Promise<EnvironmentalStandard[]> {
    return [...this.standards];
  }

  async getComplianceRequirements(): Promise<EnvironmentalComplianceRequirement[]> {
    return [...this.complianceRequirements];
  }

  async getPermits(): Promise<EnvironmentalPermit[]> {
    return [...this.permits];
  }

  async getIncidents(): Promise<EnvironmentalIncident[]> {
    return [...this.incidents];
  }

  async getCAPAs(): Promise<EnvironmentalCAPA[]> {
    return [...this.capas];
  }

  async getAIInsights(): Promise<EnvironmentalAIInsight[]> {
    return [...this.aiInsights];
  }

  // --- OFFLINE MANAGEMENT ---
  async saveOfflineDraft(draft: Omit<EnvironmentalOfflineDraft, "id" | "createdAt" | "syncStatus">): Promise<EnvironmentalOfflineDraft> {
    const newDraft: EnvironmentalOfflineDraft = {
      ...draft,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
      syncStatus: "PENDING_SYNC",
    };
    this.offlineDrafts.push(newDraft);
    return newDraft;
  }

  async getOfflineDrafts(): Promise<EnvironmentalOfflineDraft[]> {
    return [...this.offlineDrafts];
  }

  async syncOfflineDrafts(): Promise<{ syncedCount: number }> {
    const pending = this.offlineDrafts.filter((d) => d.syncStatus === "PENDING_SYNC");
    pending.forEach((d) => {
      d.syncStatus = "SYNCED";
    });
    return { syncedCount: pending.length };
  }
}

export const environmentRepository = new EnvironmentRepository();
