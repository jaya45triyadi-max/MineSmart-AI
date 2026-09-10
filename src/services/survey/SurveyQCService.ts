// MINE SMART AI - Survey Quality Control (QC) & Outlier Audit Engine

import {
  SurveyPoint,
  SurveySurface,
  SurveyEquipment,
  SurveyQCIssue,
} from "../../types/surveyTypes";

export class SurveyQCService {
  /**
   * Scans all survey points, surfaces, and equipment for quality issues
   */
  public static runSurveyQCScan(
    points: SurveyPoint[],
    surfaces: SurveySurface[],
    equipment: SurveyEquipment[]
  ): SurveyQCIssue[] {
    const issues: SurveyQCIssue[] = [];

    // 1. Check Points for Elevation Spikes / Drops / Missing Data
    const pointCodesSeen = new Set<string>();

    points.forEach((pt) => {
      // Check Duplicate Code
      if (pointCodesSeen.has(pt.pointCode)) {
        issues.push({
          id: `qc-dup-${pt.id}`,
          issueId: `QC-DUP-${pt.pointCode}`,
          pointCode: pt.pointCode,
          entityCode: pt.pointCode,
          issueType: "Duplicate Point",
          severity: "WARNING",
          description: `Point Code '${pt.pointCode}' terdeteksi ganda di database survey.`,
          suggestedAction: "Ganti nomor point atau gabungkan record survey.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }
      pointCodesSeen.add(pt.pointCode);

      // Check Missing or Suspicious Elevation
      if (pt.elevation === undefined || pt.elevation === null || pt.elevation === 0) {
        issues.push({
          id: `qc-misselev-${pt.id}`,
          issueId: `QC-NOELEV-${pt.pointCode}`,
          pointCode: pt.pointCode,
          entityCode: pt.pointCode,
          issueType: "Missing Elevation",
          severity: "CRITICAL",
          description: `Point '${pt.pointCode}' tidak memiliki data elevasi Z (0 atau null).`,
          suggestedAction: "Lakukan verifikasi ulang file mentah RTK / Total Station.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }

      // Check Elevation Spike Outliers (> 180m for Pit 1)
      if (pt.elevation > 180 || pt.elevation < -10) {
        issues.push({
          id: `qc-spike-${pt.id}`,
          issueId: `QC-SPIKE-${pt.pointCode}`,
          pointCode: pt.pointCode,
          entityCode: pt.pointCode,
          issueType: "Elevation Outlier",
          severity: "CRITICAL",
          description: `Spike elevasi tidak wajar terdeteksi di Point '${pt.pointCode}' (Z = ${pt.elevation}m RL).`,
          suggestedAction: "Periksa tinggi antropometer rod / instrumen survey saat ditembak.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }

      // Check Boundary Coordinates Bounds
      if (pt.easting < 500000 || pt.northing < 9800000) {
        issues.push({
          id: `qc-bound-${pt.id}`,
          issueId: `QC-BOUND-${pt.pointCode}`,
          pointCode: pt.pointCode,
          entityCode: pt.pointCode,
          issueType: "Boundary Violation",
          severity: "CRITICAL",
          description: `Koordinat Easting/Northing point '${pt.pointCode}' berada di luar konsesi IUP site.`,
          suggestedAction: "Pastikan zona WGS84 UTM Zone 50S telah dikonfigurasi dengan benar.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }
    });

    // 2. Check Equipment Calibration
    equipment.forEach((eq) => {
      const today = new Date();
      const nextCalib = new Date(eq.nextCalibrationDate);
      if (nextCalib < today) {
        issues.push({
          id: `qc-eq-${eq.id}`,
          issueId: `QC-CALIB-${eq.equipmentId}`,
          entityCode: eq.equipmentId,
          issueType: "Calibration Overdue",
          severity: "CRITICAL",
          description: `Instrumen alat '${eq.model}' (${eq.serialNumber}) telah MELEWATI masa sertifikasi kalibrasi!`,
          suggestedAction: "Kirim instrumen ke laboratorium kalibrasi resmi sebelum digunakan kembali.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      } else if ((nextCalib.getTime() - today.getTime()) / (1000 * 3600 * 24) < 14) {
        issues.push({
          id: `qc-eq-warn-${eq.id}`,
          issueId: `QC-CALIB-DUE-${eq.equipmentId}`,
          entityCode: eq.equipmentId,
          issueType: "Calibration Overdue",
          severity: "WARNING",
          description: `Masa kalibrasi alat '${eq.model}' akan berakhir dalam kurun waktu kurang dari 14 hari (${eq.nextCalibrationDate}).`,
          suggestedAction: "Jadwalkan kalibrasi berkala agar tidak mengganggu operasional survei.",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }
    });

    return issues;
  }
}
