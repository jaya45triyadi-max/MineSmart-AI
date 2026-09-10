// MINE SMART AI - Hauling Management Repository

import { BaseRepository } from "./BaseRepository";
import {
  HaulingTrip,
  HaulingRoute,
  HaulingRouteVersion,
  HaulingRouteSegment,
  HaulingQueueItem,
  RoadConditionItem,
  RoadInspectionRecord,
  HaulingFuelRecord,
  HaulingBottleneckItem,
  HaulingAlertItem,
  HaulingDataQualityCheck,
  TruckProductivityMetrics,
  HaulingScenario,
  AIDailyHaulingReport,
} from "../../types/haulingTypes";
import {
  MOCK_HAULING_ROUTES,
  MOCK_ROUTE_VERSIONS,
  MOCK_ROUTE_SEGMENTS,
  MOCK_HAULING_TRIPS,
  MOCK_HAULING_QUEUES,
  MOCK_ROAD_CONDITIONS,
  MOCK_ROAD_INSPECTIONS,
  MOCK_HAULING_FUELS,
  MOCK_HAULING_BOTTLENECKS,
  MOCK_HAULING_ALERTS,
  MOCK_TRUCK_PRODUCTIVITY,
  MOCK_DATA_QUALITY_CHECKS,
} from "../../data/haulingData";

export class HaulingRepository extends BaseRepository<HaulingTrip> {
  private routesData: HaulingRoute[] = [...MOCK_HAULING_ROUTES];
  private routeVersionsData: HaulingRouteVersion[] = [...MOCK_ROUTE_VERSIONS];
  private routeSegmentsData: HaulingRouteSegment[] = [...MOCK_ROUTE_SEGMENTS];
  private queuesData: HaulingQueueItem[] = [...MOCK_HAULING_QUEUES];
  private roadConditionsData: RoadConditionItem[] = [...MOCK_ROAD_CONDITIONS];
  private roadInspectionsData: RoadInspectionRecord[] = [...MOCK_ROAD_INSPECTIONS];
  private fuelRecordsData: HaulingFuelRecord[] = [...MOCK_HAULING_FUELS];
  private bottlenecksData: HaulingBottleneckItem[] = [...MOCK_HAULING_BOTTLENECKS];
  private alertsData: HaulingAlertItem[] = [...MOCK_HAULING_ALERTS];
  private truckProductivityData: TruckProductivityMetrics[] = [...MOCK_TRUCK_PRODUCTIVITY];
  private dataQualityChecksData: HaulingDataQualityCheck[] = [...MOCK_DATA_QUALITY_CHECKS];

  constructor() {
    super("hauling_trips", MOCK_HAULING_TRIPS);
  }

  async getAllTrips(companyId?: string, siteId?: string): Promise<HaulingTrip[]> {
    return this.getAll(companyId, siteId, 200);
  }

  async getRoutes(companyId?: string, siteId?: string): Promise<HaulingRoute[]> {
    let filtered = this.routesData;
    if (companyId) filtered = filtered.filter((r) => r.companyId === companyId);
    if (siteId) filtered = filtered.filter((r) => r.siteId === siteId);
    return filtered;
  }

  async getRouteVersions(companyId?: string, siteId?: string, routeId?: string): Promise<HaulingRouteVersion[]> {
    let filtered = this.routeVersionsData;
    if (routeId) filtered = filtered.filter((v) => v.routeId === routeId);
    return filtered;
  }

  async getRouteSegments(companyId?: string, siteId?: string, routeId?: string): Promise<HaulingRouteSegment[]> {
    let filtered = this.routeSegmentsData;
    if (routeId) filtered = filtered.filter((s) => s.routeId === routeId);
    return filtered;
  }

  async getQueues(companyId?: string, siteId?: string): Promise<HaulingQueueItem[]> {
    return this.queuesData;
  }

  async getRoadConditions(companyId?: string, siteId?: string): Promise<RoadConditionItem[]> {
    return this.roadConditionsData;
  }

  async getRoadInspections(companyId?: string, siteId?: string): Promise<RoadInspectionRecord[]> {
    return this.roadInspectionsData;
  }

  async getFuelRecords(companyId?: string, siteId?: string): Promise<HaulingFuelRecord[]> {
    return this.fuelRecordsData;
  }

  async getBottlenecks(companyId?: string, siteId?: string): Promise<HaulingBottleneckItem[]> {
    return this.bottlenecksData;
  }

  async getAlerts(companyId?: string, siteId?: string): Promise<HaulingAlertItem[]> {
    return this.alertsData;
  }

  async getTruckProductivity(companyId?: string, siteId?: string): Promise<TruckProductivityMetrics[]> {
    return this.truckProductivityData;
  }

  async getDataQualityChecks(companyId?: string, siteId?: string): Promise<HaulingDataQualityCheck[]> {
    return this.dataQualityChecksData;
  }

  async createTrip(trip: Omit<HaulingTrip, "id" | "createdAt" | "updatedAt">): Promise<HaulingTrip> {
    const created = await this.create(trip);
    return created;
  }

  async createRoute(route: Omit<HaulingRoute, "id" | "createdAt" | "updatedAt">): Promise<HaulingRoute> {
    const newRoute: HaulingRoute = {
      ...route,
      id: `ROUTE-${Date.now()}`,
      createdAt: this.nowIso(),
      updatedAt: this.nowIso(),
    };
    this.routesData.unshift(newRoute);
    return newRoute;
  }

  async createRouteVersion(version: Omit<HaulingRouteVersion, "id" | "createdAt" | "updatedAt">): Promise<HaulingRouteVersion> {
    const newVersion: HaulingRouteVersion = {
      ...version,
      id: `VER-${Date.now()}`,
      createdAt: this.nowIso(),
      updatedAt: this.nowIso(),
    };
    this.routeVersionsData.unshift(newVersion);

    // Update corresponding route version number and distance
    const routeIndex = this.routesData.findIndex((r) => r.routeId === version.routeId);
    if (routeIndex !== -1) {
      this.routesData[routeIndex].currentVersion = version.versionNumber;
      this.routesData[routeIndex].distanceKm = version.distanceKm;
      this.routesData[routeIndex].loadedDistanceKm = version.loadedDistanceKm;
      this.routesData[routeIndex].emptyDistanceKm = version.emptyDistanceKm;
      this.routesData[routeIndex].updatedAt = this.nowIso();
    }

    return newVersion;
  }

  async createRoadInspection(inspection: Omit<RoadInspectionRecord, "id" | "createdAt" | "updatedAt">): Promise<RoadInspectionRecord> {
    const newInspection: RoadInspectionRecord = {
      ...inspection,
      id: `INSP-${Date.now()}`,
      createdAt: this.nowIso(),
      updatedAt: this.nowIso(),
    };
    this.roadInspectionsData.unshift(newInspection);
    return newInspection;
  }

  async updateTripStatus(haulingId: string, status: HaulingTrip["tripStatus"]): Promise<boolean> {
    const trips = await this.getAllTrips();
    const target = trips.find((t) => t.haulingId === haulingId || t.id === haulingId);
    if (target) {
      await this.update(target.id, { tripStatus: status, updatedAt: this.nowIso() });
      return true;
    }
    return false;
  }

  async runScenarioSimulation(input: {
    selectedRoutes: string[];
    trucksAdjustment: number;
    roadConditionImprovement: boolean;
    queueReductionMin: number;
  }): Promise<HaulingScenario> {
    const baseProduction = 18500;
    const baseCycle = 32.5;

    const truckFactor = 1 + input.trucksAdjustment * 0.03;
    const roadFactor = input.roadConditionImprovement ? 0.92 : 1.0;
    const queueFactor = Math.max(0, input.queueReductionMin);

    const expCycle = Number((baseCycle * roadFactor - queueFactor * 0.5).toFixed(1));
    const expProduction = Math.round(baseProduction * truckFactor * (baseCycle / expCycle));
    const expFuel = Math.round(expProduction * 0.092);

    return {
      scenarioId: `SCEN-${Date.now()}`,
      scenarioName: `Scenario Optimization (${input.selectedRoutes.length} Routes, ${input.trucksAdjustment > 0 ? "+" : ""}${input.trucksAdjustment} Trucks)`,
      routeSelection: input.selectedRoutes,
      truckCountAdjustment: input.trucksAdjustment,
      roadConditionFactor: roadFactor,
      reducedQueueMin: queueFactor,
      expectedProductionTon: expProduction,
      expectedCycleTimeMin: expCycle,
      expectedDistanceKm: 4.8,
      expectedFuelLiters: expFuel,
      expectedFuelPerTon: Number((expFuel / expProduction).toFixed(3)),
      riskAssessment: input.trucksAdjustment > 5 ? "Medium risk of queue congestion at ROM hopper" : "Low risk - Optimal fleet ratio",
      status: "SIMULATED",
    };
  }

  async generateAIDailyReport(date: string, shift: string): Promise<AIDailyHaulingReport> {
    const trips = await this.getAllTrips();
    const totalTrips = trips.length;
    const totalTon = trips.reduce((sum, t) => sum + t.payload, 0);

    return {
      reportDate: date,
      shift: shift,
      executiveSummary: `Laporan Operasional Hauling Site Kalimantan A tanggal ${date} (${shift}): Total ${totalTrips} trip berhasil diselesaikan dengan total tonase ${totalTon.toLocaleString("id-ID")} Ton. Rata-rata cycle time tercatat 34.2 menit.`,
      tripsTotal: totalTrips,
      productionTon: totalTon,
      avgDistanceKm: 4.8,
      avgTravelTimeMin: 22.5,
      avgCycleTimeMin: 34.2,
      avgQueueTimeMin: 5.4,
      truckProductivityTonHr: 68.5,
      roadConditionSummary: "85% rute hauling dalam kondisi Baik. Ramp 03 West mengalami penurunan kondisi akibat hujan ringan dan butuh grading.",
      fuelEfficiencyLPerTon: 0.098,
      majorDelays: [
        "Antrian di Pit 2 North EX-202 akibat pengerukan material keras (delay avg 18 min)",
        "Soft spots di ROM 01 Access Ramp Km 3.8 menyebabkan perlambatan armada DT",
      ],
      bottlenecks: [
        "Laju perjalanan di ROM 01 Ramp akibat jalan licin & berlubang",
        "Penumpukan truk di Hopper ROM 01 saat jam sibuk shift 1",
      ],
      aiInsight: "Pengalihan 2 unit DT dari Pit 2 North ke Pit 1 South berpotensi mengurangi antrian sebesar 65% dan menaikkan total tonase harian hingga +480 Ton.",
      recommendations: [
        "Lakukan pemadatan jalan & penaburan batu belah pada Km 3.8 ROM 01 Ramp",
        "Optimalkan jadwal water truck untuk menekan debu di Ramp 03 West",
        "Rebalance armada DT sesuai rekomendasi FMS AI Dispatch Center",
      ],
      dataQualityStatus: "VALID (Data integrity score: 98.4%)",
      generatedAt: this.nowIso(),
    };
  }
}

export const haulingRepository = new HaulingRepository();
