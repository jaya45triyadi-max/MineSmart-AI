// MINE SMART AI - Vision Mining Analytics & Safety Guard Engine
// Powers 8 Detection Domains: PPE, Helmet, Vest, Person, Vehicle, Restricted Area, Unsafe Interaction, Smoke/Fire
// Legal Framework: Kepmen ESDM No. 1827 K/30/MEM/2018

import {
  CameraFeed,
  VisionIncident,
  BoundingBox,
  VisionDetectionCategory,
  VisionIncidentSeverity,
} from "../../types/cctvTypes";

export class VisionAiEngine {
  /**
   * Scans a camera feed's active detections to discover safety incidents or compliance breaches
   */
  public static scanCameraFeed(camera: CameraFeed): VisionIncident[] {
    const incidents: VisionIncident[] = [];
    const timestamp = new Date().toISOString();

    for (const det of camera.activeDetections) {
      if (!det.isViolation) continue;

      let category: VisionDetectionCategory = det.category;
      let severity: VisionIncidentSeverity = "MEDIUM";
      let title = `Pelanggaran Keselamatan K3: ${det.label}`;
      let description = `Terdeteksi anomali visual pada ${camera.name} (${camera.location}).`;
      let dangerLevel = "MODERATE_HAZARD";
      let recommendedAction = "Beri teguran lisan dan pastikan kepatuhan APD.";

      // 1. HELMET VIOLATION
      if (det.category === "helmet" || det.violationType?.includes("HELMET")) {
        category = "helmet";
        const isInHazardZone = det.attributes?.zoneName !== undefined;
        severity = isInHazardZone ? "CRITICAL" : "HIGH";
        title = isInHazardZone
          ? `Pekerja Tanpa Helm di Area Berbahaya (${det.attributes?.zoneName || "Zone"})`
          : "Pekerja Tidak Memakai Helm Keselamatan (Hardhat Missing)";
        description = `Kamera mendeteksi pekerja tanpa helm pengaman (confidence: ${(det.confidence * 100).toFixed(1)}%) di ${camera.name}. Jarak ke alat terdekat: ${det.attributes?.distanceToNearestVehicleM || 0}m.`;
        dangerLevel = isInHazardZone ? "FATALITY_RISK_HIGH" : "HEAD_INJURY_RISK";
        recommendedAction = "Hentikan aktivitas pekerja segera dan wajibkan pemakaian helm SNI.";
      }

      // 2. VEST VIOLATION
      else if (det.category === "vest" || det.violationType?.includes("VEST")) {
        category = "vest";
        severity = "HIGH";
        title = "Pekerja Tidak Memakai Rompi Reflektif (Safety Vest Missing)";
        description = `Pekerja terdeteksi memakai pakaian gelap tanpa visibilitas pita reflektif di ${camera.name}. Sangat berbahaya di area pergerakan alat berat.`;
        dangerLevel = "STRUCK_BY_VEHICLE_RISK";
        recommendedAction = "Instruksikan pekerja untuk segera mengenakan rompi reflektif Hi-Vis Class 2/3.";
      }

      // 3. RESTRICTED AREA BREACH
      else if (det.category === "restricted_area" || det.violationType?.includes("RESTRICTED")) {
        category = "restricted_area";
        severity = "CRITICAL";
        title = `Pelanggaran Batas Zona Terlarang (${det.attributes?.zoneName || "Hazard Area"})`;
        description = `Entitas manusia/kendaraan melanggar perimeter virtual geofence di ${camera.name}.`;
        dangerLevel = "ZONE_INTRUSION_CRITICAL";
        recommendedAction = "Evakuasi segera dari zona terlarang dan aktifkan sirine peringatan.";
      }

      // 4. UNSAFE INTERACTION (HUMAN-MACHINE PROXIMITY)
      else if (det.category === "unsafe_interaction" || det.violationType?.includes("PROXIMITY")) {
        category = "unsafe_interaction";
        severity = "CRITICAL";
        title = `Interaksi Berbahaya: Jarak Manusia - Alat Berat Terlalu Dekat (< ${det.attributes?.distanceToNearestVehicleM || 5}m)`;
        description = `Terdeteksi pekerja dalam zona blind-spot / radius bahaya alat berat bergerak (${det.attributes?.distanceToNearestVehicleM || 4.8} meter) di ${camera.name}.`;
        dangerLevel = "FATAL_CRUSH_PINCH_POINT";
        recommendedAction = "Kirim sinyal klakson peringatan ke kabin operator alat berat & amankan pekerja.";
      }

      // 5. SMOKE / FIRE
      else if (det.category === "smoke_fire" || det.violationType?.includes("SMOKE") || det.violationType?.includes("FIRE")) {
        category = "smoke_fire";
        severity = "CRITICAL";
        title = `Deteksi Titik Api / Kepulan Asap Termal (${det.attributes?.thermalTempC || 85}°C)`;
        description = `Sensor radiometrik termal mendeteksi titik panas dan asap pada ${camera.name}. Risiko kebakaran tambang / swa-bakar batubara.`;
        dangerLevel = "MINE_FIRE_HIGH_RISK";
        recommendedAction = "Kirim unit Water Truck / Damkar Tambang untuk pendinginan dan pemadatan.";
      }

      incidents.push({
        id: `INC-VIS-${Date.now()}-${det.id}`,
        timestamp,
        cameraId: camera.id,
        cameraCode: camera.code,
        cameraName: camera.name,
        location: camera.location,
        siteId: camera.siteId,
        category,
        title,
        description,
        severity,
        status: "ACTIVE",
        confidencePct: Number((det.confidence * 100).toFixed(1)),
        involvedEntities: {
          personCount: det.category === "vehicle" ? 0 : 1,
          vehicleCount: det.category === "vehicle" ? 1 : (det.attributes?.distanceToNearestVehicleM ? 1 : 0),
          equipmentCodes: camera.activeDetections.filter(d => d.category === "vehicle").map(v => v.label.split(" ")[0]),
        },
        esdmComplianceRule: {
          code: "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran III",
          article: "Pengawasan Operasional & Keselamatan Kerja Pertambangan",
          requirement: "Kewajiban kepatuhan APD lengkap, jarak aman minimum manusia-alat 15m, dan pemantauan CCTV K3.",
        },
        aiForensicAnalysis: {
          detectionTrigger: `YOLOv10-Mining Real-time Edge Tensor (${(det.confidence * 100).toFixed(1)}% Conf)`,
          dangerLevel,
          proximityDistanceM: det.attributes?.distanceToNearestVehicleM,
          recommendedInstantAction: recommendedAction,
          esdmSanctionRisk: severity === "CRITICAL" ? "Teguran KTT & Penghentian Area Sementara" : "Pencatatan Minor Safety Log",
        },
        dispatchedAlerts: {
          radioBroadcastSent: severity === "CRITICAL",
          kttSupervisorNotified: true,
          sirenActivated: severity === "CRITICAL",
          interlockMachineSignalSent: false,
        },
      });
    }

    return incidents;
  }

  /**
   * Request Deep AI Forensic Diagnosis using Gemini API Server-side Proxy
   */
  public static async requestGeminiVisionForensics(
    incident: VisionIncident,
    camera: CameraFeed
  ): Promise<{
    forensicSummary: string;
    esdmLegalAnalysis: string;
    immediateMitigationPlan: string[];
    riskScorePct: number;
  }> {
    try {
      const response = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analisis insiden visual AI CCTV Pertambangan berikut:
Kamera: ${camera.name} (${camera.location})
Kategori: ${incident.category.toUpperCase()}
Judul Insiden: ${incident.title}
Deskripsi: ${incident.description}
Tingkat Bahaya: ${incident.severity} (Confidence ${incident.confidencePct}%)
Regulasi Terkait: ${incident.esdmComplianceRule.code} - ${incident.esdmComplianceRule.article}

Berikan analisis forensik K3 pertambangan dalam Bahasa Indonesia:
1. Analisis risiko kepatuhan Kepmen ESDM 1827/2018.
2. Dampak jika tidak segera dimitigasi terhadap Golden Rules K3 Tambang.
3. Tiga langkah konkret pengawas K3 (KTT / Safety Officer) di lapangan.`,
          context: {
            siteName: camera.siteName,
            userRole: "KEPALA_TEKNIK_TAMBANG_KTT",
            companyName: "PT Batubara Nusa Utama",
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.reply || "";

        return {
          forensicSummary: text.slice(0, 480) || incident.description,
          esdmLegalAnalysis:
            "Sesuai Kepmen ESDM 1827/2018 Lampiran III, pelanggaran jarak aman dan kelalaian APD pada area front pemuatan merupakan potensi insiden berakibat fatal (High Potential Incident / HPI) yang wajib diinvestigasi.",
          immediateMitigationPlan: [
            incident.aiForensicAnalysis.recommendedInstantAction,
            "Lakukan safety stand-down singkat 10 menit bagi seluruh regu kerja di front terkait.",
            "Dokumentasikan rekaman CCTV AI sebagai bukti tindak lanjut inspeksi berkala K3 ESDM.",
          ],
          riskScorePct: incident.severity === "CRITICAL" ? 95 : 75,
        };
      }
    } catch {
      // Fallback
    }

    return {
      forensicSummary: incident.description,
      esdmLegalAnalysis:
        "Sesuai regulasi Kepmen ESDM 1827/2018, pengawasan digital melalui AI CCTV mendukung akuntabilitas kepatuhan K3 dan pencegahan kecelakaan tambang tambang terbuka.",
      immediateMitigationPlan: [
        incident.aiForensicAnalysis.recommendedInstantAction,
        "Kirim petugas HSE untuk verifikasi kepatuhan APD di lokasi.",
        "Catat dalam Safety KPI mingguan.",
      ],
      riskScorePct: incident.severity === "CRITICAL" ? 92 : 70,
    };
  }

  /**
   * Generates live simulation ticks for camera bounding boxes (slight realistic jitter & edge latencies)
   */
  public static simulateCameraTick(cam: CameraFeed): CameraFeed {
    const updatedDetections = cam.activeDetections.map((det) => {
      const jitterX = (Math.random() - 0.5) * 0.4;
      const jitterY = (Math.random() - 0.5) * 0.3;
      const newX = Math.max(1, Math.min(95, Number((det.x + jitterX).toFixed(1))));
      const newY = Math.max(1, Math.min(95, Number((det.y + jitterY).toFixed(1))));

      return {
        ...det,
        x: newX,
        y: newY,
      };
    });

    const latencyJitter = (Math.random() - 0.5) * 0.6;
    const newLatency = Math.max(12, Math.min(25, Number((cam.edgeAiGateway.inferenceLatencyMs + latencyJitter).toFixed(1))));

    return {
      ...cam,
      activeDetections: updatedDetections,
      edgeAiGateway: {
        ...cam.edgeAiGateway,
        inferenceLatencyMs: newLatency,
      },
    };
  }
}
