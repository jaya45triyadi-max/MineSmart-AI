// MINE SMART AI - Geology Quality Control & Validation Engine

import {
  Borehole,
  Collar,
  LithologyRecord,
  SeamIntersection,
  SampleRecord,
  AssayRecord,
  CoalQualityProfile,
  GeologicalQCIssue,
} from "../../types/geologyTypes";
import { GeologyCalculationService } from "./GeologyCalculationService";

export class GeologyQCService {
  /**
   * Runs comprehensive QC scan across all geological records
   */
  public static runGeologyQCScan(
    boreholes: Borehole[],
    collars: Collar[],
    lithologies: LithologyRecord[],
    seams: SeamIntersection[],
    samples: SampleRecord[],
    assays: AssayRecord[],
    qualities: CoalQualityProfile[]
  ): GeologicalQCIssue[] {
    const issues: GeologicalQCIssue[] = [];

    // 1. Check Collars for missing or invalid coordinates
    collars.forEach((col) => {
      if (!col.latitude || !col.longitude || col.latitude === 0 || col.longitude === 0) {
        issues.push({
          id: `qc-col-coord-${col.id}`,
          entityType: "COLLAR",
          entityCode: col.boreholeCode,
          severity: "CRITICAL",
          ruleName: "MISSING_COORDINATES",
          description: `Borehole ${col.boreholeCode} tidak memiliki koordinat Latitude / Longitude yang valid.`,
          suggestedAction: "Lakukan survei ulang koordinat atau update lokasi collar di Collar Management.",
          isResolved: false,
        });
      }

      if (col.elevation < -100 || col.elevation > 1500) {
        issues.push({
          id: `qc-col-elev-${col.id}`,
          entityType: "COLLAR",
          entityCode: col.boreholeCode,
          severity: "WARNING",
          ruleName: "SUSPICIOUS_ELEVATION",
          description: `Elevasi collar ${col.elevation}m di luar batas wajar topografi site (-100m s/d 1500m).`,
          suggestedAction: "Verifikasi elevasi dengan data survei Total Station / LiDAR.",
          isResolved: false,
        });
      }
    });

    // 2. Check Depth Overlap or Depth Gaps in Lithology
    const boreholeLithMap: { [code: string]: LithologyRecord[] } = {};
    lithologies.forEach((l) => {
      if (!boreholeLithMap[l.boreholeCode]) boreholeLithMap[l.boreholeCode] = [];
      boreholeLithMap[l.boreholeCode].push(l);
    });

    Object.keys(boreholeLithMap).forEach((bhCode) => {
      const logs = boreholeLithMap[bhCode].sort((a, b) => a.fromDepth - b.fromDepth);
      for (let i = 0; i < logs.length - 1; i++) {
        const current = logs[i];
        const next = logs[i + 1];

        if (current.toDepth > next.fromDepth) {
          issues.push({
            id: `qc-lith-overlap-${current.id}`,
            entityType: "LITHOLOGY",
            entityCode: bhCode,
            severity: "CRITICAL",
            ruleName: "DEPTH_OVERLAP",
            description: `Terdapat tumpang tindih kedalaman lithology di ${bhCode}: (${current.fromDepth}-${current.toDepth}m) vs (${next.fromDepth}-${next.toDepth}m).`,
            suggestedAction: "Koreksi interval kedalaman pada log lithology.",
            isResolved: false,
          });
        }
      }
    });

    // 3. Outlier Detection in Coal Quality (CV, Ash, TS)
    const statsCV = GeologyCalculationService.calculateQualityStatistics(qualities, "gcvAdbKcalKg");
    const statsAsh = GeologyCalculationService.calculateQualityStatistics(qualities, "ashContentAdb");

    qualities.forEach((q) => {
      const cvVal = q.gcvAdbKcalKg || q.calorificValueAdbKcal || 0;
      // CV outlier if > 3 stdDev from avg
      if (statsCV.stdDev > 0 && Math.abs(cvVal - statsCV.avg) > 3 * statsCV.stdDev) {
        issues.push({
          id: `qc-outlier-cv-${q.id}`,
          entityType: "ASSAY",
          entityCode: q.sampleCode,
          severity: "WARNING",
          ruleName: "OUTLIER_CALORIFIC_VALUE",
          description: `Sampel ${q.sampleCode} memicu outlier nilai CV (${cvVal} kcal/kg vs rata-rata ${statsCV.avg} kcal/kg).`,
          suggestedAction: "Lakukan re-test laboratorium atau re-check validasi sertifikat lab.",
          isResolved: false,
        });
      }

      if (q.totalSulfurAdb > 5.0) {
        issues.push({
          id: `qc-high-sulfur-${q.id}`,
          entityType: "ASSAY",
          entityCode: q.sampleCode,
          severity: "WARNING",
          ruleName: "HIGH_SULFUR_ALERT",
          description: `Sampel ${q.sampleCode} memiliki kadar Total Sulfur sangat tinggi (${q.totalSulfurAdb}%).`,
          suggestedAction: "Tandai zona sulfur tinggi untuk pencampuran (blending) saat penambangan.",
          isResolved: false,
        });
      }
    });

    return issues;
  }
}
