// MINE SMART AI - Dashboard Main Service Layer

import {
  DashboardAnalyticsService,
  DashboardFilterContext,
  DashboardPayload,
  ProductionKPIData,
  FleetKPIData,
  FuelCostKPIData,
  HSEKPIData,
  StockpileKPIData,
  AIInsightItem,
  ExecutiveSummaryData,
} from "./DashboardAnalyticsService";
import { DashboardAlertItem } from "./AlertRuleEngine";

export class DashboardService {
  /**
   * Fetches the complete aggregated dashboard dataset for the given context filter and user RBAC
   */
  public static async getDashboardData(filterContext: DashboardFilterContext): Promise<DashboardPayload> {
    // In production environment with Firestore, this reads aggregated metrics or falls back to live service
    return DashboardAnalyticsService.getDashboardPayload(filterContext);
  }

  /**
   * Fetches executive summary & health score
   */
  public static async getExecutiveSummary(filterContext: DashboardFilterContext): Promise<ExecutiveSummaryData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.executiveSummary;
  }

  /**
   * Fetches production KPIs
   */
  public static async getProductionKPIs(filterContext: DashboardFilterContext): Promise<ProductionKPIData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.production;
  }

  /**
   * Fetches fleet KPIs
   */
  public static async getFleetKPIs(filterContext: DashboardFilterContext): Promise<FleetKPIData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.fleet;
  }

  /**
   * Fetches fuel and cost KPIs
   */
  public static async getFuelAndCostKPIs(filterContext: DashboardFilterContext): Promise<FuelCostKPIData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.fuelCost;
  }

  /**
   * Fetches HSE KPIs
   */
  public static async getHSEKPIs(filterContext: DashboardFilterContext): Promise<HSEKPIData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.hse;
  }

  /**
   * Fetches stockpile KPIs
   */
  public static async getStockpileKPIs(filterContext: DashboardFilterContext): Promise<StockpileKPIData> {
    const payload = await this.getDashboardData(filterContext);
    return payload.stockpile;
  }

  /**
   * Fetches active AI insights
   */
  public static async getAIInsights(filterContext: DashboardFilterContext): Promise<AIInsightItem[]> {
    const payload = await this.getDashboardData(filterContext);
    return payload.aiInsights;
  }

  /**
   * Fetches real-time alert feed
   */
  public static async getRealTimeAlerts(filterContext: DashboardFilterContext): Promise<DashboardAlertItem[]> {
    const payload = await this.getDashboardData(filterContext);
    return payload.alerts;
  }

  /**
   * Acknowledges a specific alert by ID
   */
  public static async acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
    console.log(`[DashboardService] Alert ${alertId} acknowledged by user ${userId}`);
    return true;
  }
}
