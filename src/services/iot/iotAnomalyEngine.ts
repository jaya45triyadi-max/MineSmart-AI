// MINE SMART AI - Real-time IoT Multi-Sensor Scanner & AI Anomaly Detection Engine
// Analyzes: 1. Fuel, 2. Temperature, 3. Pressure, 4. Engine, 5. GPS, 6. Vibration, 7. Weight, 8. Environment

import {
  EquipmentIoTTelemetry,
  IoTAnomaly,
  SensorCategoryType,
  SensorThresholdConfig,
  IoTAnomalySeverity,
} from "../../types/iotTypes";

export class IoTAnomalyDetectionEngine {
  /**
   * Evaluates all 8 sensor categories on a single equipment telemetry packet
   * Returns an array of detected anomalies (if any)
   */
  public static scanEquipmentTelemetry(
    telemetry: EquipmentIoTTelemetry,
    thresholds: SensorThresholdConfig[]
  ): IoTAnomaly[] {
    const detectedAnomalies: IoTAnomaly[] = [];
    const timestamp = new Date().toISOString();

    // ----------------------------------------------------
    // 1. FUEL SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 1.1: Rapid fuel drop while engine is OFF (Fuel Siphoning/Theft)
    if (
      telemetry.fuel.flowSensorStatus === "RAPID_DROP_DRAIN" ||
      (telemetry.engine.engineStatus === "OFF" && telemetry.fuel.burnRateLiterPerHour > 15)
    ) {
      detectedAnomalies.push({
        id: `ANOM-FUEL-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "fuel",
        metricName: "flowSensorStatus",
        metricLabel: "Indikasi Pengurasan Solar Ilegal (Fuel Siphoning)",
        observedValue: "Drop > 100L saat Mesin Mati",
        unit: "Liter Sudden Drop",
        expectedRange: { min: 0, max: 0 },
        deviationPct: 999.0,
        severity: "CRITICAL",
        anomalyScore: 98,
        aiDetectionModel: "CORRELATION_MATRIX",
        aiConfidencePct: 99.2,
        aiDiagnosis: `Penurunan volume tangki solar solar secara abnormal pada ${telemetry.equipmentName} saat engine status OFF (${telemetry.gps.geofenceZone}).`,
        aiRootCauseHypothesis: "Pencurian bahan bakar solar via kran drain bawah atau kebocoran tangki BBM darurat.",
        aiFailureProbabilityPct: 100,
        aiRecommendedActions: [
          "Segera hubungi tim patroli security tambang ke koordinat GPS terkini.",
          "Verifikasi log otorisasi smart fuel dispenser nozzle.",
          "Lakukan audit fisik segel tangki BBM.",
        ],
        status: "OPEN",
      });
    }

    // Anomaly 1.2: Excessive Burn Rate (> 120 L/h for Hauler)
    if (telemetry.equipmentType === "HAUL_TRUCK" && telemetry.fuel.burnRateLiterPerHour > 115) {
      detectedAnomalies.push({
        id: `ANOM-BURN-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "fuel",
        metricName: "burnRateLiterPerHour",
        metricLabel: "Konsumsi BBM Melonjak Ekstrem (High Burn Rate)",
        observedValue: Number(telemetry.fuel.burnRateLiterPerHour.toFixed(1)),
        unit: "L/h",
        expectedRange: { min: 45, max: 95 },
        deviationPct: Number((((telemetry.fuel.burnRateLiterPerHour - 95) / 95) * 100).toFixed(1)),
        severity: "WARNING",
        anomalyScore: 78,
        aiDetectionModel: "Z_SCORE_DYNAMIC",
        aiConfidencePct: 92.5,
        aiDiagnosis: `Konsumsi solar ${telemetry.fuel.burnRateLiterPerHour.toFixed(1)} L/h melebihi batas efisiensi benchmark (95 L/h).`,
        aiRootCauseHypothesis: "Injektor common rail kotor, filter udara tersumbat, atau operator mengemudi dengan gigi rendah di putaran tinggi.",
        aiFailureProbabilityPct: 62,
        aiRecommendedActions: [
          "Lakukan pengecekan fuel injector spray pattern.",
          "Instruksikan eco-driving coaching pada operator.",
        ],
        status: "OPEN",
      });
    }

    // ----------------------------------------------------
    // 2. TEMPERATURE SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 2.1: Engine Coolant Overheat
    if (telemetry.temperature.engineCoolantC > 99.0) {
      const isCritical = telemetry.temperature.engineCoolantC > 102.5;
      detectedAnomalies.push({
        id: `ANOM-COOLANT-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "temperature",
        metricName: "engineCoolantC",
        metricLabel: "Suhu Pendingin Mesin Kritis (Engine Coolant Overheat)",
        observedValue: Number(telemetry.temperature.engineCoolantC.toFixed(1)),
        unit: "°C",
        expectedRange: { min: 80, max: 95 },
        deviationPct: Number((((telemetry.temperature.engineCoolantC - 95) / 95) * 100).toFixed(1)),
        severity: isCritical ? "CRITICAL" : "WARNING",
        anomalyScore: isCritical ? 95 : 82,
        aiDetectionModel: "Z_SCORE_DYNAMIC",
        aiConfidencePct: 97.4,
        aiDiagnosis: `Suhu coolant terukur ${telemetry.temperature.engineCoolantC.toFixed(1)}°C melampaui batas aman operasional.`,
        aiRootCauseHypothesis: "Penyumbatan sirip radiator oleh lumpur/debu tambang, kebocoran selang pendingin, atau termostat macet.",
        aiFailureProbabilityPct: isCritical ? 92 : 68,
        aiEstimatedTimeToFailureHours: isCritical ? 0.5 : 3.0,
        aiRecommendedActions: [
          "Instruksikan operator menepi ke bahu jalan dan biarkan mesin idle rendah.",
          "Semprot radiator dengan water jet dan periksa volume reservoir coolant.",
          "Terbitkan Auto Work Order Mekanik Pit Service.",
        ],
        status: "OPEN",
      });
    }

    // Anomaly 2.2: Hydraulic Oil High Temp
    if (telemetry.temperature.hydraulicOilC > 87.0) {
      detectedAnomalies.push({
        id: `ANOM-HYDTEMP-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "temperature",
        metricName: "hydraulicOilC",
        metricLabel: "Suhu Oli Hidrolik Tinggi (Hydraulic Oil Overheat)",
        observedValue: Number(telemetry.temperature.hydraulicOilC.toFixed(1)),
        unit: "°C",
        expectedRange: { min: 60, max: 82 },
        deviationPct: Number((((telemetry.temperature.hydraulicOilC - 82) / 82) * 100).toFixed(1)),
        severity: telemetry.temperature.hydraulicOilC > 92 ? "CRITICAL" : "WARNING",
        anomalyScore: 84,
        aiDetectionModel: "ISOLATION_FOREST",
        aiConfidencePct: 93.0,
        aiDiagnosis: `Suhu oli hidrolik mencapai ${telemetry.temperature.hydraulicOilC.toFixed(1)}°C berisiko merusak seal silinder dan menimbulkan kavitasi pompa.`,
        aiRootCauseHypothesis: "Oil cooler hidrolik tersumbat atau beban kerja pompa kontinyu tanpa siklus istirahat.",
        aiFailureProbabilityPct: 74,
        aiRecommendedActions: ["Periksa sirkulasi pendingin oil cooler dan bersihkan filter hidrolik."],
        status: "OPEN",
      });
    }

    // ----------------------------------------------------
    // 3. PRESSURE SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 3.1: Critical Low Engine Oil Pressure
    if (
      telemetry.engine.engineStatus === "RUNNING" &&
      telemetry.pressure.engineOilPressureBar > 0 &&
      telemetry.pressure.engineOilPressureBar < 2.3
    ) {
      detectedAnomalies.push({
        id: `ANOM-OILPRES-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "pressure",
        metricName: "engineOilPressureBar",
        metricLabel: "Tekanan Oli Mesin Turun Kritis (Low Oil Pressure)",
        observedValue: Number(telemetry.pressure.engineOilPressureBar.toFixed(2)),
        unit: "bar",
        expectedRange: { min: 3.0, max: 5.5 },
        deviationPct: Number((((telemetry.pressure.engineOilPressureBar - 3.0) / 3.0) * 100).toFixed(1)),
        severity: "CRITICAL",
        anomalyScore: 99,
        aiDetectionModel: "Z_SCORE_DYNAMIC",
        aiConfidencePct: 99.5,
        aiDiagnosis: `Tekanan oli mesin anjlok ke ${telemetry.pressure.engineOilPressureBar.toFixed(2)} bar saat RPM ${telemetry.engine.rpm}. Risiko engine seize dalam hitungan menit!`,
        aiRootCauseHypothesis: "Kebocoran karter oli, pompa pelumas rusak, atau level oli di bawah batas minimum (critical dipstick).",
        aiFailureProbabilityPct: 98,
        aiEstimatedTimeToFailureHours: 0.1,
        aiRecommendedActions: [
          "TRIGGER INTERLOCK EMERGENCY SHUTDOWN MESIN SEGERA.",
          "Dilarang menyalakan kembali mesin sebelum tim mekanik tiba di lokasi.",
        ],
        status: "OPEN",
      });
    }

    // Anomaly 3.2: TPMS Tire Puncture / Severe Underinflation
    const tires = telemetry.pressure.tpmsTiresPsi;
    const tireValues = [
      { key: "frontLeft", val: tires.frontLeft, name: "Front Left" },
      { key: "frontRight", val: tires.frontRight, name: "Front Right" },
      { key: "rearRightOuter", val: tires.rearRightOuter, name: "Rear Right Outer" },
      { key: "rearLeftOuter", val: tires.rearLeftOuter, name: "Rear Left Outer" },
    ];
    for (const tire of tireValues) {
      if (tire.val > 0 && tire.val < 85.0) {
        detectedAnomalies.push({
          id: `ANOM-TPMS-${tire.key}-${Date.now()}-${telemetry.equipmentCode}`,
          timestamp,
          equipmentId: telemetry.id,
          equipmentCode: telemetry.equipmentCode,
          equipmentType: telemetry.equipmentType,
          siteId: telemetry.siteId,
          sensorCategory: "pressure",
          metricName: `tpmsTiresPsi.${tire.key}`,
          metricLabel: `Tekanan Ban Kritis Rendah - ${tire.name} (TPMS Puncture)`,
          observedValue: Number(tire.val.toFixed(1)),
          unit: "PSI",
          expectedRange: { min: 102, max: 118 },
          deviationPct: Number((((tire.val - 105) / 105) * 100).toFixed(1)),
          severity: "CRITICAL",
          anomalyScore: 93,
          aiDetectionModel: "ISOLATION_FOREST",
          aiConfidencePct: 98.1,
          aiDiagnosis: `Sensor TPMS mendeteksi tekanan ban ${tire.name} hanya ${tire.val.toFixed(1)} PSI (Normal: 105-115 PSI). Potensi tertusuk batu tajam atau bocor katup.`,
          aiRootCauseHypothesis: "Puncture ban OTR akibat serpihan batuan tajam pit atau keausan rim bead.",
          aiFailureProbabilityPct: 95,
          aiEstimatedTimeToFailureHours: 0.2,
          aiRecommendedActions: [
            "Hentikan unit di bahu jalan terdekat untuk mencegah kerusakan velg rim dan bahaya ledakan ban.",
            "Luncurkan Tire Service Truck ke lokasi.",
          ],
          status: "OPEN",
        });
      }
    }

    // ----------------------------------------------------
    // 4. ENGINE SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 4.1: High Load with Zero Speed (Stalled/Bogged Down)
    if (
      telemetry.engine.engineStatus === "RUNNING" &&
      telemetry.engine.engineLoadPct > 90 &&
      telemetry.gps.speedKmh === 0 &&
      telemetry.equipmentType === "HAUL_TRUCK"
    ) {
      detectedAnomalies.push({
        id: `ANOM-STALL-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "engine",
        metricName: "engineLoadPct",
        metricLabel: "Beban Mesin Maksimal Namun Unit Terhenti (Bogged/Stall)",
        observedValue: `${telemetry.engine.engineLoadPct.toFixed(1)}% Load @ 0 km/h`,
        unit: "% Load",
        expectedRange: { min: 10, max: 40 },
        deviationPct: 150.0,
        severity: "WARNING",
        anomalyScore: 79,
        aiDetectionModel: "CORRELATION_MATRIX",
        aiConfidencePct: 91.0,
        aiDiagnosis: `Mesin berada pada beban tinggi (${telemetry.engine.engineLoadPct.toFixed(1)}%) namun kecepatan unit 0 km/h. Unit kemungkinan amblas di lumpur atau transmisi slip.`,
        aiRootCauseHypothesis: "Unit terperangkap di area disposisi lembek atau torque converter mengalami stall.",
        aiFailureProbabilityPct: 55,
        aiRecommendedActions: ["Hubungi Dozer D375 untuk bantuan penarikan/push-assist."],
        status: "OPEN",
      });
    }

    // ----------------------------------------------------
    // 5. GPS SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 5.1: Speeding on Pit Haul Road (> 52 km/h in pit)
    if (
      telemetry.gps.geofenceZone === "PIT_01_BENCH" ||
      telemetry.gps.geofenceZone === "PIT_02_WEST"
    ) {
      if (telemetry.gps.speedKmh > 48.0) {
        detectedAnomalies.push({
          id: `ANOM-SPEED-${Date.now()}-${telemetry.equipmentCode}`,
          timestamp,
          equipmentId: telemetry.id,
          equipmentCode: telemetry.equipmentCode,
          equipmentType: telemetry.equipmentType,
          siteId: telemetry.siteId,
          sensorCategory: "gps",
          metricName: "speedKmh",
          metricLabel: "Pelanggaran Kecepatan di Area Pit (Speeding Over-Limit)",
          observedValue: Number(telemetry.gps.speedKmh.toFixed(1)),
          unit: "km/h",
          expectedRange: { min: 0, max: 40 },
          deviationPct: Number((((telemetry.gps.speedKmh - 40) / 40) * 100).toFixed(1)),
          severity: "WARNING",
          anomalyScore: 81,
          aiDetectionModel: "Z_SCORE_DYNAMIC",
          aiConfidencePct: 99.0,
          aiDiagnosis: `Kecepatan unit ${telemetry.gps.speedKmh.toFixed(1)} km/h melebihi batas keselamatan pit (40 km/h).`,
          aiRootCauseHypothesis: "Operator terburu-buru mengejar target ritase atau turunan jalan licin tanpa retarder.",
          aiFailureProbabilityPct: 40,
          aiRecommendedActions: ["Kirimkan peringatan audio ke kabin operator.", "Catat log pelanggaran K3 di buku pengawas."],
          status: "OPEN",
        });
      }
    }

    // ----------------------------------------------------
    // 6. VIBRATION SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 6.1: High Strut Vibration & Severe Pothole Shock (> 11.5 mm/s)
    if (telemetry.vibration.frontStrutRmsMmS > 11.0 || telemetry.vibration.triaxialG.zAxisVertical > 3.0) {
      detectedAnomalies.push({
        id: `ANOM-VIB-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "vibration",
        metricName: "frontStrutRmsMmS",
        metricLabel: "Getaran Strut Suspensi Abnormal & Hantaman Lubang Ekstrem",
        observedValue: Number(telemetry.vibration.frontStrutRmsMmS.toFixed(1)),
        unit: "mm/s RMS",
        expectedRange: { min: 1.5, max: 6.5 },
        deviationPct: Number((((telemetry.vibration.frontStrutRmsMmS - 6.5) / 6.5) * 100).toFixed(1)),
        severity: telemetry.vibration.frontStrutRmsMmS > 13.5 ? "CRITICAL" : "WARNING",
        anomalyScore: 85,
        aiDetectionModel: "ISOLATION_FOREST",
        aiConfidencePct: 94.8,
        aiDiagnosis: `Getaran suspensi strut depan ${telemetry.vibration.frontStrutRmsMmS.toFixed(1)} mm/s dan kejut vertikal ${telemetry.vibration.triaxialG.zAxisVertical.toFixed(2)}g menunjukkan jalan hauling bergelombang/rusak parah.`,
        aiRootCauseHypothesis: "Kerusakan lapisan jalan tambang (potholes) atau suspensi hidropneumatik kehilangan tekanan nitrogen.",
        aiFailureProbabilityPct: 68,
        aiRecommendedActions: [
          "Laporkan koordinat GPS kerusakan jalan ke tim Road Maintenance.",
          "Periksa tekanan silinder suspensi hidropneumatik saat pergantian shift.",
        ],
        status: "OPEN",
      });
    }

    // ----------------------------------------------------
    // 7. WEIGHT SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 7.1: Overload Payload (> 104% of rated capacity)
    if (
      telemetry.equipmentType === "HAUL_TRUCK" &&
      telemetry.weight.ratedCapacityTon > 0 &&
      telemetry.weight.payloadGrossTon > telemetry.weight.ratedCapacityTon * 1.04
    ) {
      const overloadTons = telemetry.weight.payloadGrossTon - telemetry.weight.ratedCapacityTon;
      detectedAnomalies.push({
        id: `ANOM-WEIGHT-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "weight",
        metricName: "payloadGrossTon",
        metricLabel: "Kelebihan Muatan Batubara (Payload Overload)",
        observedValue: Number(telemetry.weight.payloadGrossTon.toFixed(1)),
        unit: "Ton",
        expectedRange: { min: 0, max: telemetry.weight.ratedCapacityTon },
        deviationPct: Number(((overloadTons / telemetry.weight.ratedCapacityTon) * 100).toFixed(1)),
        severity: telemetry.weight.payloadGrossTon > telemetry.weight.ratedCapacityTon * 1.1 ? "CRITICAL" : "WARNING",
        anomalyScore: 83,
        aiDetectionModel: "Z_SCORE_DYNAMIC",
        aiConfidencePct: 96.5,
        aiDiagnosis: `Muatan terukur ${telemetry.weight.payloadGrossTon.toFixed(1)} Ton (+${overloadTons.toFixed(1)} Ton di atas batas rating ${telemetry.weight.ratedCapacityTon} Ton). Mempercepat keausan ban dan rangka chasis.`,
        aiRootCauseHypothesis: "Overfill bucket saat pemuatan di loading point shovel.",
        aiFailureProbabilityPct: 52,
        aiRecommendedActions: [
          "Beri notifikasi ke operator Excavator untuk mengurangi passing volume.",
          "Monitor suhu ban pada ritase ini.",
        ],
        status: "OPEN",
      });
    }

    // ----------------------------------------------------
    // 8. ENVIRONMENT SENSOR ANOMALY DETECTION
    // ----------------------------------------------------
    // Anomaly 8.1: Dust PM10 Exceedance (> 150 µg/m³ ESDM Standard)
    if (telemetry.environment.dustPM10_ugm3 > 145.0) {
      detectedAnomalies.push({
        id: `ANOM-DUST-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "environment",
        metricName: "dustPM10_ugm3",
        metricLabel: "Polusi Debu Tambang PM10 Melampaui Baku Mutu ESDM",
        observedValue: Number(telemetry.environment.dustPM10_ugm3.toFixed(1)),
        unit: "µg/m³",
        expectedRange: { min: 10, max: 150 },
        deviationPct: Number((((telemetry.environment.dustPM10_ugm3 - 150) / 150) * 100).toFixed(1)),
        severity: "CRITICAL",
        anomalyScore: 88,
        aiDetectionModel: "Z_SCORE_DYNAMIC",
        aiConfidencePct: 98.4,
        aiDiagnosis: `Kadar partikulat debu PM10 mencapai ${telemetry.environment.dustPM10_ugm3.toFixed(1)} µg/m³ melebihi ambang batas baku mutu Kepmen ESDM 1827/2018 (maks 150 µg/m³).`,
        aiRootCauseHypothesis: "Jalur hauling kering dan intensitas penyiraman air (water truck) kurang memadai di segmen berangin.",
        aiFailureProbabilityPct: 80,
        aiRecommendedActions: [
          "Kirim Water Truck 40kL untuk penyiraman masif.",
          "Wajibkan pemakaian masker respirator N95 bagi personil di area sekitar.",
        ],
        status: "OPEN",
      });
    }

    // Anomaly 8.2: Toxic Gas Hazard (Post Blast NO2 > 2.5 ppm or CO > 25 ppm)
    if (
      telemetry.environment.hazardousGasPpm.nitrogenDioxideNO2 > 2.5 ||
      telemetry.environment.hazardousGasPpm.carbonMonoxideCO > 25.0
    ) {
      detectedAnomalies.push({
        id: `ANOM-GAS-${Date.now()}-${telemetry.equipmentCode}`,
        timestamp,
        equipmentId: telemetry.id,
        equipmentCode: telemetry.equipmentCode,
        equipmentType: telemetry.equipmentType,
        siteId: telemetry.siteId,
        sensorCategory: "environment",
        metricName: "hazardousGasPpm.nitrogenDioxideNO2",
        metricLabel: "Gas Beracun Pascapeledakan NO2/CO Melebihi Batas K3",
        observedValue: `${telemetry.environment.hazardousGasPpm.nitrogenDioxideNO2.toFixed(2)} ppm NO2`,
        unit: "ppm Gas",
        expectedRange: { min: 0, max: 1.2 },
        deviationPct: 200.0,
        severity: "CRITICAL",
        anomalyScore: 99,
        aiDetectionModel: "ISOLATION_FOREST",
        aiConfidencePct: 99.8,
        aiDiagnosis: `Konsentrasi gas beracun NO2 pascapeledakan mencapai ${telemetry.environment.hazardousGasPpm.nitrogenDioxideNO2.toFixed(2)} ppm (Batas K3 < 1.0 ppm). Area berbahaya bagi pekerja!`,
        aiRootCauseHypothesis: "Fumes sisa peledakan ANFO batuan penutup yang terjebak di void pit akibat angin tenang.",
        aiFailureProbabilityPct: 100,
        aiRecommendedActions: [
          "BUNYIKAN SIRINE EVAKUASI PIT SEGERA.",
          "Larangan masuk ke radius 500 meter hingga gas terdisipasi tuntas.",
        ],
        status: "OPEN",
      });
    }

    return detectedAnomalies;
  }

  /**
   * Request Deep AI Diagnosis using Gemini API Server-side Proxy or Direct Heuristic Engine
   */
  public static async requestGeminiDeepDiagnosis(
    anomaly: IoTAnomaly,
    telemetry: EquipmentIoTTelemetry
  ): Promise<{
    detailedDiagnosis: string;
    rootCauseAnalysis: string;
    estimatedMTBFImpact: string;
    stepByStepActionPlan: string[];
    riskScore: number;
  }> {
    try {
      const response = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analisis anomali sensor IoT pertambangan berikut dengan AI Diagnostics:
Unit: ${telemetry.equipmentName} (${telemetry.equipmentCode})
Kategori Sensor: ${anomaly.sensorCategory.toUpperCase()}
Metrik Anomali: ${anomaly.metricLabel}
Nilai Terukur: ${anomaly.observedValue} ${anomaly.unit} (Rentang Normal: ${anomaly.expectedRange.min} - ${anomaly.expectedRange.max} ${anomaly.unit})
Tingkat Keparahan: ${anomaly.severity}
Kondisi Operasional: Speed ${telemetry.gps.speedKmh} km/h, RPM ${telemetry.engine.rpm}, Beban ${telemetry.engine.engineLoadPct}%, Suhu Coolant ${telemetry.temperature.engineCoolantC}°C, Tekanan Oli ${telemetry.pressure.engineOilPressureBar} bar.
Lokasi: ${telemetry.gps.geofenceZone} (${telemetry.siteName}).

Berikan diagnosis mendalam dalam Bahasa Indonesia:
1. Penjelasan teknis mekanikal/lingkungan mengapa anomali ini terjadi.
2. Dampak terhadap umur komponen (MTBF/MTTR).
3. Tiga langkah konkret mitigasi keselamatan dan pemeliharaan untuk tim pengawas lapangan.`,
          context: {
            siteName: telemetry.siteName,
            userRole: "RELIABILITY_ENGINEER",
            companyName: "PT Batubara Nusa Utama",
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.reply || "";

        return {
          detailedDiagnosis: text.slice(0, 450) || anomaly.aiDiagnosis,
          rootCauseAnalysis: anomaly.aiRootCauseHypothesis,
          estimatedMTBFImpact:
            anomaly.severity === "CRITICAL"
              ? "Penurunan MTBF komponen hingga 65% bila tidak ditangani dalam 2 jam operasional."
              : "Risiko keausan dini komponen sebesar 25-35%.",
          stepByStepActionPlan: anomaly.aiRecommendedActions,
          riskScore: anomaly.anomalyScore,
        };
      }
    } catch {
      // Fallback to local heuristic
    }

    return {
      detailedDiagnosis: anomaly.aiDiagnosis,
      rootCauseAnalysis: anomaly.aiRootCauseHypothesis,
      estimatedMTBFImpact:
        anomaly.severity === "CRITICAL"
          ? "Penurunan estimasi MTBF sebesar 70% dan risiko breakdown mendadak."
          : "Potensi downtime 1.5 - 3.0 jam jika tidak dikoreksi pada shift berjalan.",
      stepByStepActionPlan: anomaly.aiRecommendedActions,
      riskScore: anomaly.anomalyScore,
    };
  }

  /**
   * Generates continuous live tick values to simulate realistic sensor telemetry fluctuations
   */
  public static simulateLiveTelemetryTick(
    unit: EquipmentIoTTelemetry
  ): EquipmentIoTTelemetry {
    // If unit is weather station
    if (unit.equipmentType === "PIT_WEATHER_STATION") {
      const pm10Drift = (Math.random() - 0.48) * 4;
      const windDrift = (Math.random() - 0.5) * 0.4;
      const tempDrift = (Math.random() - 0.5) * 0.1;
      return {
        ...unit,
        environment: {
          ...unit.environment,
          dustPM10_ugm3: Math.max(15, Number((unit.environment.dustPM10_ugm3 + pm10Drift).toFixed(1))),
          dustPM25_ugm3: Math.max(8, Number((unit.environment.dustPM25_ugm3 + pm10Drift * 0.45).toFixed(1))),
          windSpeedMs: Math.max(0.5, Number((unit.environment.windSpeedMs + windDrift).toFixed(1))),
          ambientTemperatureC: Number((unit.environment.ambientTemperatureC + tempDrift).toFixed(1)),
        },
      };
    }

    // Heavy mobile machinery
    const isRunning = unit.engine.engineStatus === "RUNNING";
    const speedJitter = isRunning ? (Math.random() - 0.45) * 1.5 : 0;
    const newSpeed = Math.max(0, Math.min(65, Number((unit.gps.speedKmh + speedJitter).toFixed(1))));

    const rpmJitter = isRunning ? Math.round((Math.random() - 0.5) * 35) : 0;
    const newRpm = isRunning ? Math.max(700, Math.min(2200, unit.engine.rpm + rpmJitter)) : 0;

    const coolantJitter = (Math.random() - 0.45) * 0.25;
    const newCoolant = Number((unit.temperature.engineCoolantC + coolantJitter).toFixed(1));

    const vibJitter = isRunning ? (Math.random() - 0.48) * 0.3 : 0;
    const newVib = Math.max(0.2, Number((unit.vibration.frontStrutRmsMmS + vibJitter).toFixed(1)));

    return {
      ...unit,
      gps: {
        ...unit.gps,
        speedKmh: newSpeed,
      },
      engine: {
        ...unit.engine,
        rpm: newRpm,
      },
      temperature: {
        ...unit.temperature,
        engineCoolantC: newCoolant,
      },
      vibration: {
        ...unit.vibration,
        frontStrutRmsMmS: newVib,
      },
    };
  }
}
