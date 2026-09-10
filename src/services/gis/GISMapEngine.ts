// MINE SMART AI - GIS Map Engine Abstraction Layer
// Mendukung render 17 layer pertambangan, visualisasi live equipment, dan 8 tools analisis spasial

import L from "leaflet";
import {
  BasemapType,
  SpatialEntity,
  LatLng,
  MeasurementMode,
  MeasurementResult,
  GISLayer,
  EquipmentCategory,
} from "../../modules/gis/types/gisTypes";
import { GISService } from "./GISService";

export interface MapProviderConfig {
  containerId: string;
  initialCenter: LatLng;
  initialZoom: number;
  basemap: BasemapType;
  onMapClick?: (latLng: LatLng) => void;
  onObjectClick?: (entity: SpatialEntity) => void;
  onMouseMove?: (latLng: LatLng) => void;
}

export class GISMapEngine {
  private map: L.Map | null = null;
  private tileLayer: L.TileLayer | null = null;
  private layerGroups: Map<string, L.LayerGroup> = new Map();
  private markerMap: Map<string, L.Layer> = new Map();
  private measurementPoints: LatLng[] = [];
  private measurementLayer: L.LayerGroup | null = null;
  private currentMode: MeasurementMode = "NONE";
  private bufferRadiusMeters: number = 300;
  private volumeBenchDepthM: number = 10;
  private config: MapProviderConfig;

  constructor(config: MapProviderConfig) {
    this.config = config;
  }

  public setBufferRadius(radiusMeters: number): void {
    this.bufferRadiusMeters = radiusMeters;
  }

  public setVolumeBenchDepth(depthM: number): void {
    this.volumeBenchDepthM = depthM;
  }

  /**
   * Initialize Leaflet Map Instance
   */
  public initialize(): void {
    const container = document.getElementById(this.config.containerId);
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map(this.config.containerId, {
      center: [this.config.initialCenter.lat, this.config.initialCenter.lng],
      zoom: this.config.initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    this.setBasemap(this.config.basemap);

    // Click handler
    this.map.on("click", (e: L.LeafletMouseEvent) => {
      const latLng: LatLng = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        elevation: 35 + (Math.abs(e.latlng.lat * 100) % 40),
      };
      if (this.config.onMapClick) {
        this.config.onMapClick(latLng);
      }
    });

    // Mouse move handler for HUD coordinates
    this.map.on("mousemove", (e: L.LeafletMouseEvent) => {
      if (this.config.onMouseMove) {
        this.config.onMouseMove({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          elevation: 35 + (Math.abs(e.latlng.lat * 100) % 40),
        });
      }
    });

    // Measurement layer initialization
    this.measurementLayer = L.layerGroup().addTo(this.map);
  }

  /**
   * Change Basemap Tile Provider
   */
  public setBasemap(type: BasemapType): void {
    if (!this.map) return;

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let subdomains = ["a", "b", "c"];

    switch (type) {
      case "SATELLITE":
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        subdomains = [];
        break;
      case "TERRAIN":
        tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
        subdomains = ["a", "b", "c"];
        break;
      case "DARK":
        tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        subdomains = ["a", "b", "c", "d"];
        break;
      case "STREET":
      default:
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        subdomains = ["a", "b", "c"];
        break;
    }

    this.tileLayer = L.tileLayer(tileUrl, {
      subdomains,
      maxZoom: 19,
    }).addTo(this.map);
  }

  public addLayerGroup(layerId: string): void {
    if (!this.map || this.layerGroups.has(layerId)) return;
    const group = L.layerGroup().addTo(this.map);
    this.layerGroups.set(layerId, group);
  }

  public setLayerVisibility(layerId: string, visible: boolean): void {
    const group = this.layerGroups.get(layerId);
    if (!group || !this.map) return;

    if (visible) {
      if (!this.map.hasLayer(group)) {
        this.map.addLayer(group);
      }
    } else {
      if (this.map.hasLayer(group)) {
        this.map.removeLayer(group);
      }
    }
  }

  public setLayerOpacity(layerId: string, opacity: number): void {
    const group = this.layerGroups.get(layerId);
    if (!group) return;

    group.eachLayer((layer: any) => {
      if (layer.setOpacity) {
        layer.setOpacity(opacity);
      } else if (layer.setStyle) {
        layer.setStyle({ fillOpacity: opacity * 0.5, opacity });
      }
    });
  }

  /**
   * Render spatial entities into their respective layer groups with specialized equipment icons & polygons
   */
  public renderEntities(entities: SpatialEntity[], layerConfigs: GISLayer[]): void {
    if (!this.map) return;

    // Ensure layer groups exist
    layerConfigs.forEach((layer) => {
      if (!this.layerGroups.has(layer.id)) {
        this.addLayerGroup(layer.id);
      }
      this.setLayerVisibility(layer.id, layer.visible);
    });

    // Clear existing rendered objects
    this.layerGroups.forEach((group) => group.clearLayers());
    this.markerMap.clear();

    entities.forEach((entity) => {
      const group = this.layerGroups.get(entity.layerId);
      if (!group) return;

      const layerConfig = layerConfigs.find((l) => l.id === entity.layerId);
      const color = layerConfig ? layerConfig.color : "#10B981";

      // 1. Polygon Render (Pit, Block, Seam, Disposal, Stockpile, ROM, Crusher, Workshop, Fuel Station, Office, Camp, Settling Pond)
      if (entity.polygonCoordinates && entity.polygonCoordinates.length > 0) {
        const latLngs: L.LatLngExpression[] = entity.polygonCoordinates.map((p) => [p.lat, p.lng]);
        const polygon = L.polygon(latLngs, {
          color: color,
          weight: 2.5,
          fillColor: color,
          fillOpacity: entity.type === "PIT" ? 0.35 : entity.type === "SEAM" ? 0.45 : 0.3,
          dashArray: entity.type === "BLOCK" ? "4, 4" : undefined,
        });

        polygon.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          if (this.config.onObjectClick) {
            this.config.onObjectClick(entity);
          }
        });

        polygon.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <strong class="text-emerald-400">${entity.code}</strong>: ${entity.name}<br/>
            <span class="text-slate-300">Elevasi: ${entity.rlElevation}</span>
          </div>`,
          { permanent: false, direction: "top", className: "custom-map-tooltip" }
        );

        polygon.addTo(group);
        this.markerMap.set(entity.id, polygon);
      }
      // 2. Polyline Render (Hauling Road, Drainage Runoff)
      else if (entity.pathCoordinates && entity.pathCoordinates.length > 0) {
        const latLngs: L.LatLngExpression[] = entity.pathCoordinates.map((p) => [p.lat, p.lng]);
        const polyline = L.polyline(latLngs, {
          color: color,
          weight: entity.type === "ROAD" ? 5 : 3,
          opacity: 0.9,
          dashArray: entity.type === "DRAINAGE" ? "6, 4" : undefined,
        });

        polyline.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          if (this.config.onObjectClick) {
            this.config.onObjectClick(entity);
          }
        });

        polyline.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <strong class="text-amber-400">${entity.code}</strong>: ${entity.name}<br/>
            <span class="text-slate-300">Panjang: ${entity.lengthKm || 0} km</span>
          </div>`,
          { permanent: false, className: "custom-map-tooltip" }
        );

        polyline.addTo(group);
        this.markerMap.set(entity.id, polyline);
      }
      // 3. Point / Marker Render (Equipment, Survey Point, Borehole)
      else {
        let markerHtml = "";
        let iconSize: [number, number] = [18, 18];

        if (entity.type === "EQUIPMENT") {
          // Distinctive Live Equipment Marker with Category Badge & Pulsing Radar
          const cat = entity.equipmentCategory || "EXCAVATOR";
          let badgeText = "EX";
          let badgeBg = "#10B981"; // Emerald

          if (cat === "EXCAVATOR") {
            badgeText = "🚜 EX";
            badgeBg = "#EC4899";
          } else if (cat === "DUMP_TRUCK") {
            badgeText = "🚚 DT";
            badgeBg = "#F59E0B";
          } else if (cat === "DOZER") {
            badgeText = "🚜 DZ";
            badgeBg = "#EAB308";
          } else if (cat === "GRADER") {
            badgeText = "🚜 MG";
            badgeBg = "#06B6D4";
          } else if (cat === "WATER_TRUCK") {
            badgeText = "💦 WT";
            badgeBg = "#3B82F6";
          } else if (cat === "LIGHT_VEHICLE") {
            badgeText = "🚙 LV";
            badgeBg = "#10B981";
          }

          const isMoving = (entity.speedKmh || 0) > 0;

          markerHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              ${isMoving ? `<div style="position: absolute; top: -4px; left: -4px; width: 34px; height: 34px; border-radius: 50%; background: ${badgeBg}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ""}
              <div style="
                background: ${badgeBg};
                color: #030712;
                font-weight: 900;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 12px;
                border: 2px solid #FFFFFF;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 2px;
                z-index: 10;
              ">
                ${entity.code}
              </div>
              <div style="
                font-size: 8px;
                font-weight: 800;
                background: rgba(15, 23, 42, 0.85);
                color: #F8FAFC;
                padding: 1px 4px;
                border-radius: 4px;
                margin-top: 1px;
                border: 1px solid rgba(255,255,255,0.2);
              ">
                ${entity.speedKmh ? `${entity.speedKmh} km/h` : entity.status}
              </div>
            </div>
          `;
          iconSize = [40, 36];
        } else if (entity.type === "SURVEY_POINT") {
          markerHtml = `
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #06B6D4;
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 10px #06B6D4;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 9px;
              font-weight: bold;
            ">✦</div>
          `;
          iconSize = [16, 16];
        } else if (entity.type === "BOREHOLE") {
          markerHtml = `
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 3px;
              background-color: #84CC16;
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 10px #84CC16;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #030712;
              font-size: 9px;
              font-weight: 900;
            ">B</div>
          `;
          iconSize = [16, 16];
        } else {
          markerHtml = `
            <div style="
              background-color: ${color};
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 10px ${color};
            "></div>
          `;
          iconSize = [14, 14];
        }

        const customIcon = L.divIcon({
          className: "custom-gis-marker",
          html: markerHtml,
          iconSize,
          iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
        });

        const marker = L.marker(
          [entity.centerCoordinates.lat, entity.centerCoordinates.lng],
          { icon: customIcon }
        );

        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          if (this.config.onObjectClick) {
            this.config.onObjectClick(entity);
          }
        });

        marker.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <strong class="text-white">${entity.name} (${entity.code})</strong><br/>
            <span class="text-slate-300">Elevasi: ${entity.rlElevation}</span><br/>
            ${entity.operatorName ? `<span class="text-emerald-400">Operator: ${entity.operatorName}</span>` : ""}
          </div>`,
          { permanent: false, direction: "top" }
        );

        marker.addTo(group);
        this.markerMap.set(entity.id, marker);
      }
    });
  }

  public flyTo(latLng: LatLng, zoom: number = 16): void {
    if (this.map) {
      this.map.flyTo([latLng.lat, latLng.lng], zoom, { duration: 1.2 });
    }
  }

  public fitBounds(entities: SpatialEntity[]): void {
    if (!this.map || entities.length === 0) return;

    const bounds = L.latLngBounds(
      entities.map((e) => [e.centerCoordinates.lat, e.centerCoordinates.lng])
    );
    this.map.fitBounds(bounds, { padding: [40, 40] });
  }

  /**
   * Measurement Provider Implementation for All 8 Spatial Tools:
   * 1. DISTANCE
   * 2. AREA
   * 3. ELEVATION
   * 4. COORDINATE
   * 5. VOLUME
   * 6. POLYGON
   * 7. BUFFER
   * 8. MEASUREMENT (Inspector)
   */
  public setMeasurementMode(mode: MeasurementMode): void {
    this.currentMode = mode;
    this.clearMeasurement();
  }

  public addMeasurementPoint(point: LatLng): MeasurementResult {
    this.measurementPoints.push(point);

    if (!this.measurementLayer || !this.map) {
      return { mode: this.currentMode, points: this.measurementPoints };
    }

    this.measurementLayer.clearLayers();

    // 1. Render interactive point markers with labels
    this.measurementPoints.forEach((p, idx) => {
      const m = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        color: "#06B6D4",
        fillColor: "#FFFFFF",
        fillOpacity: 1,
        weight: 2,
      });
      m.bindTooltip(`Titik ${idx + 1} (RL +${(p.elevation || 35).toFixed(1)}m)`, {
        permanent: true,
        direction: "top",
      });
      m.addTo(this.measurementLayer!);
    });

    // 2. Handle DISTANCE Tool
    if (this.currentMode === "DISTANCE" && this.measurementPoints.length >= 2) {
      const latLngs: L.LatLngExpression[] = this.measurementPoints.map((p) => [p.lat, p.lng]);
      const line = L.polyline(latLngs, { color: "#06B6D4", weight: 3.5, dashArray: "6,6" });
      line.addTo(this.measurementLayer);

      let totalDist = 0;
      for (let i = 0; i < this.measurementPoints.length - 1; i++) {
        totalDist += GISService.calculateHaversineDistance(
          this.measurementPoints[i],
          this.measurementPoints[i + 1]
        );
      }

      return {
        mode: "DISTANCE",
        points: this.measurementPoints,
        distanceMeters: Math.round(totalDist),
      };
    }

    // 3. Handle AREA & POLYGON Tool
    if ((this.currentMode === "AREA" || this.currentMode === "POLYGON") && this.measurementPoints.length >= 3) {
      const latLngs: L.LatLngExpression[] = this.measurementPoints.map((p) => [p.lat, p.lng]);
      const poly = L.polygon(latLngs, { color: "#10B981", fillColor: "#10B981", fillOpacity: 0.25, weight: 2.5 });
      poly.addTo(this.measurementLayer);

      const areaRes = GISService.calculatePolygonArea(this.measurementPoints);

      return {
        mode: this.currentMode,
        points: this.measurementPoints,
        areaSquareMeters: areaRes.areaM2,
        areaHectares: areaRes.areaHa,
        perimeterMeters: areaRes.perimeterM,
      };
    }

    // 4. Handle ELEVATION Tool
    if (this.currentMode === "ELEVATION" && this.measurementPoints.length >= 2) {
      const p1 = this.measurementPoints[0];
      const p2 = this.measurementPoints[this.measurementPoints.length - 1];
      const latLngs: L.LatLngExpression[] = this.measurementPoints.map((p) => [p.lat, p.lng]);
      const line = L.polyline(latLngs, { color: "#F59E0B", weight: 3.5 });
      line.addTo(this.measurementLayer);

      const prof = GISService.calculateElevationProfile(p1, p2);

      return {
        mode: "ELEVATION",
        points: this.measurementPoints,
        distanceMeters: prof.horizontalDistM,
        elevationProfile: {
          startElevationRL: prof.startRL,
          endElevationRL: prof.endRL,
          elevationDelta: prof.deltaRL,
          slopePercent: prof.slopePercent,
        },
      };
    }

    // 5. Handle COORDINATE Tool
    if (this.currentMode === "COORDINATE" && this.measurementPoints.length >= 1) {
      const p = this.measurementPoints[this.measurementPoints.length - 1];
      const utmStr = GISService.convertToUTM(p.lat, p.lng, p.elevation || 35);

      return {
        mode: "COORDINATE",
        points: this.measurementPoints,
        coordinateDetail: {
          wgs84: { lat: p.lat, lng: p.lng },
          utmZone: "50S",
          eastingNorthing: utmStr,
          elevationRL: p.elevation || 35,
        },
      };
    }

    // 6. Handle VOLUME Tool (Polygon + Bench Depth)
    if (this.currentMode === "VOLUME" && this.measurementPoints.length >= 3) {
      const latLngs: L.LatLngExpression[] = this.measurementPoints.map((p) => [p.lat, p.lng]);
      const poly = L.polygon(latLngs, { color: "#8B5CF6", fillColor: "#8B5CF6", fillOpacity: 0.35, weight: 2.5 });
      poly.addTo(this.measurementLayer);

      const areaRes = GISService.calculatePolygonArea(this.measurementPoints);
      const volRes = GISService.calculateVolumeEstimate(this.measurementPoints, this.volumeBenchDepthM);

      return {
        mode: "VOLUME",
        points: this.measurementPoints,
        areaSquareMeters: areaRes.areaM2,
        areaHectares: areaRes.areaHa,
        volumeEstimate: {
          cutVolumeBCM: volRes.cutVolumeBCM,
          fillVolumeBCM: volRes.fillVolumeBCM,
          netVolumeBCM: volRes.netVolumeBCM,
          benchDepthM: this.volumeBenchDepthM,
        },
      };
    }

    // 7. Handle BUFFER Tool (Radius Safety Circle)
    if (this.currentMode === "BUFFER" && this.measurementPoints.length >= 1) {
      const center = this.measurementPoints[this.measurementPoints.length - 1];
      const bufferCirclePoints = GISService.generateBufferCircle(center, this.bufferRadiusMeters);
      const latLngs: L.LatLngExpression[] = bufferCirclePoints.map((p) => [p.lat, p.lng]);

      const circlePoly = L.polygon(latLngs, {
        color: "#EF4444",
        fillColor: "#EF4444",
        fillOpacity: 0.2,
        weight: 2,
        dashArray: "4, 4",
      });
      circlePoly.bindTooltip(`Radius Aman: ${this.bufferRadiusMeters} Meter`, { permanent: true, direction: "center" });
      circlePoly.addTo(this.measurementLayer);

      return {
        mode: "BUFFER",
        points: [center],
        radiusMeters: this.bufferRadiusMeters,
      };
    }

    // 8. MEASUREMENT Generic
    return {
      mode: this.currentMode,
      points: this.measurementPoints,
    };
  }

  public clearMeasurement(): void {
    this.measurementPoints = [];
    if (this.measurementLayer) {
      this.measurementLayer.clearLayers();
    }
  }

  public destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
