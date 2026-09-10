// MINE SMART AI - GIS Spatial AI Service Engine

import { SpatialEntity, SpatialObjectType, LatLng } from "../../modules/gis/types/gisTypes";
import { GISService, MOCK_SPATIAL_ENTITIES } from "./GISService";

export interface SpatialAIQueryRequest {
  userPrompt: string;
  siteId: string;
  userRole: string;
}

export interface SpatialAIActionResponse {
  answerText: string;
  suggestedAction?: "ZOOM_TO_OBJECT" | "HIGHLIGHT_LAYER" | "MEASURE_DISTANCE" | "FILTER_EQUIPMENT";
  targetObjectId?: string;
  targetCoordinates?: LatLng;
  affectedEntities?: SpatialEntity[];
}

export class GISAIService {
  private static entities: SpatialEntity[] = MOCK_SPATIAL_ENTITIES;

  /**
   * Spatial Tool: gis.findObjects
   */
  public static findObjects(params: {
    query?: string;
    type?: SpatialObjectType;
    status?: string;
  }): SpatialEntity[] {
    return this.entities.filter((e) => {
      if (params.type && e.type !== params.type) return false;
      if (params.status && e.status !== params.status) return false;
      if (params.query) {
        const q = params.query.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  /**
   * Spatial Tool: gis.getObject
   */
  public static getObject(objectId: string): SpatialEntity | undefined {
    return this.entities.find((e) => e.id === objectId || e.code.toLowerCase() === objectId.toLowerCase());
  }

  /**
   * Spatial Tool: gis.calculateDistance
   */
  public static calculateDistance(pointA: LatLng, pointB: LatLng): { distanceMeters: number; distanceKm: number } {
    const distM = GISService.calculateHaversineDistance(pointA, pointB);
    return {
      distanceMeters: Math.round(distM),
      distanceKm: Math.round((distM / 1000) * 100) / 100,
    };
  }

  /**
   * Spatial Tool: gis.calculateArea
   */
  public static calculateArea(points: LatLng[]): { areaHectares: number; areaM2: number; perimeterMeters: number } {
    const res = GISService.calculatePolygonArea(points);
    return {
      areaHectares: res.areaHa,
      areaM2: res.areaM2,
      perimeterMeters: res.perimeterM,
    };
  }

  /**
   * Spatial Tool: gis.findNearby
   */
  public static findNearby(lat: number, lng: number, radiusMeters: number): SpatialEntity[] {
    return GISService.findNearbyObjects(this.entities, { lat, lng }, radiusMeters);
  }

  /**
   * Spatial Tool: gis.getEquipmentInArea
   */
  public static getEquipmentInArea(center: LatLng, radiusMeters: number): SpatialEntity[] {
    const nearby = this.findNearby(center.lat, center.lng, radiusMeters);
    return nearby.filter((e) => e.type === "EQUIPMENT");
  }

  /**
   * Spatial Tool: gis.getObjectsInPit
   */
  public static getObjectsInPit(pitCode: string): SpatialEntity[] {
    const pit = this.entities.find((e) => e.type === "PIT" && e.code.toLowerCase().includes(pitCode.toLowerCase()));
    if (!pit) return [];

    return this.findNearby(pit.centerCoordinates.lat, pit.centerCoordinates.lng, 1500);
  }

  /**
   * AI Natural Language Processor for GIS Queries
   */
  public static processAIQuery(request: SpatialAIQueryRequest): SpatialAIActionResponse {
    const prompt = request.userPrompt.toLowerCase();

    // 1. Equipment or Fleet query
    if (prompt.includes("excavator") || prompt.includes("truck") || prompt.includes("fleet") || prompt.includes("peralatan")) {
      const eqList = this.findObjects({ type: "EQUIPMENT" });
      const activeCount = eqList.filter((e) => e.status === "OPERATING").length;

      const firstEq = eqList[0];

      return {
        answerText: `Ditemukan **${eqList.length} unit peralatan tambang** di peta spasial site. Terdiri dari **${activeCount} unit aktif beroperasi** dan 1 unit breakdown maintenance (EX-204). Posisi GPS unit paling aktif berada di Pit 1 South (EX-201).`,
        suggestedAction: "ZOOM_TO_OBJECT",
        targetObjectId: firstEq?.id,
        targetCoordinates: firstEq?.centerCoordinates,
        affectedEntities: eqList,
      };
    }

    // 2. Pit query
    if (prompt.includes("pit") || prompt.includes("tambang") || prompt.includes("galian")) {
      const pits = this.findObjects({ type: "PIT" });
      const firstPit = pits[0];

      return {
        answerText: `Sistem mencatat **${pits.length} area pit aktif**: **Pit 1 South** (RL +45m s/d RL -15m) dan **Pit 2 North** (RL +65m s/d RL +20m). Total luas area pit galian terpetakan mencapai **230.7 Hektar**.`,
        suggestedAction: "ZOOM_TO_OBJECT",
        targetObjectId: firstPit?.id,
        targetCoordinates: firstPit?.centerCoordinates,
        affectedEntities: pits,
      };
    }

    // 3. Stockpile query
    if (prompt.includes("stockpile") || prompt.includes("stok") || prompt.includes("rom")) {
      const stockpiles = this.findObjects({ type: "STOCKPILE" });
      const totalCoal = stockpiles.reduce((acc, curr) => acc + (curr.currentTonnageMT || 0), 0);

      return {
        answerText: `Total stok batubara di **ROM Stockpile A** mencapai **${totalCoal.toLocaleString()} MT** (GAR 4,320 kcal/kg). Pengiriman ke Hopper Crusher Plant 1 berjalan normal dengan rata-rata feed 650 TPH.`,
        suggestedAction: "ZOOM_TO_OBJECT",
        targetObjectId: stockpiles[0]?.id,
        targetCoordinates: stockpiles[0]?.centerCoordinates,
        affectedEntities: stockpiles,
      };
    }

    // 4. Blasting or GeoFence query
    if (prompt.includes("blasting") || prompt.includes("peledakan") || prompt.includes("hazard") || prompt.includes("bahaya")) {
      const gf = this.findObjects({ type: "GEOFENCE" });

      return {
        answerText: `⚠️ **Peringatan Zona Bahaya Peledakan (Blasting Hazard)**: Terdeteksi zona peledakan aktif GF-BLAST-01 pada Pit 1 South dengan radius steril 500 Meter. Jadwal peledakan pukul 12:30 WITA.`,
        suggestedAction: "HIGHLIGHT_LAYER",
        targetObjectId: gf[0]?.id,
        targetCoordinates: gf[0]?.centerCoordinates,
        affectedEntities: gf,
      };
    }

    // Default Fallback
    const allEntities = this.entities.slice(0, 5);
    return {
      answerText: `Tentu! Saya telah menganalisis data GIS spasial site ${request.siteId}. Sistem memetakan 3 Active Pits, Seam 30/28/24, Jalan Hauling 12.4 km, Waste Dump Disposal, ROM Stockpile, dan 12 armada fleet terhubung GPS telemetri real-time.`,
      affectedEntities: allEntities,
    };
  }
}
