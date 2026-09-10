// MINE SMART AI - Integration Hub Service (PROMPT 34)

import {
  IntegrationConnector,
  APIKeyRecord,
  WebhookSubscription,
  WebhookDeliveryLog,
  UniversalImportRecord,
  UniversalExportJob,
  IntegrationAuditLogRecord,
} from "../../types/reportingIntegrationTypes";

export class IntegrationHub {
  private static connectors: IntegrationConnector[] = [
    {
      integrationId: "conn-fms-01",
      providerName: "Hexagon FMS / Modular Dispatch Adapter",
      type: "FMS",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date().toISOString(),
      syncFrequency: "Real-time (5s)",
      healthScore: 98,
      latencyMs: 142,
      errorRatePct: 0.02,
      dataFreshnessMinutes: 1,
      credentialsReference: "ENC_VAULT_FMS_KEY_9921",
      config: { endpoint: "https://fms-gateway.hexagondispatch.com/api/v2", autoSyncPayload: true },
    },
    {
      integrationId: "conn-gps-02",
      providerName: "Caterpillar MineStar GPS & Telematics Adapter",
      type: "GPS",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date().toISOString(),
      syncFrequency: "10s Stream",
      healthScore: 95,
      latencyMs: 210,
      errorRatePct: 0.1,
      dataFreshnessMinutes: 1,
      credentialsReference: "ENC_VAULT_CAT_GPS_SECRET",
      config: { telemetryIntervalSec: 10, geoFenceAlerts: true },
    },
    {
      integrationId: "conn-erp-03",
      providerName: "SAP S/4HANA Enterprise ERP Connector",
      type: "ERP",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date(Date.now() - 3600000).toISOString(),
      syncFrequency: "Every 1 Hour",
      healthScore: 100,
      latencyMs: 340,
      errorRatePct: 0.0,
      dataFreshnessMinutes: 60,
      credentialsReference: "ENC_VAULT_SAP_OAUTH_TOKEN",
      config: { syncLedger: true, syncPO: true, syncPayroll: true },
    },
    {
      integrationId: "conn-iot-04",
      providerName: "IoT Telematics Edge Gateway (Engine Sensors)",
      type: "IOT",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date().toISOString(),
      syncFrequency: "Real-time MQTT (1s)",
      healthScore: 92,
      latencyMs: 85,
      errorRatePct: 0.5,
      dataFreshnessMinutes: 0.5,
      credentialsReference: "ENC_VAULT_MQTT_TLS_CERT",
      config: { broker: "mqtts://iot.minesmart.id:8883", topic: "telemetry/fleet/#" },
    },
    {
      integrationId: "conn-drone-05",
      providerName: "DJI Terra Drone Survey & Point Cloud Importer",
      type: "DRONE",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: "2026-08-12T14:30:00Z",
      syncFrequency: "Manual / Post-Flight Upload",
      healthScore: 100,
      latencyMs: 1200,
      errorRatePct: 0.0,
      dataFreshnessMinutes: 2880,
      credentialsReference: "ENC_VAULT_DRONE_API_KEY",
      config: { crsFormat: "UTM_ZONE_48S", autoVolumeCalc: true },
    },
    {
      integrationId: "conn-lab-06",
      providerName: "SGS / Sucofindo Laboratory Assay Gateway",
      type: "LABORATORY",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date(Date.now() - 7200000).toISOString(),
      syncFrequency: "Shift Batch",
      healthScore: 96,
      latencyMs: 450,
      errorRatePct: 0.0,
      dataFreshnessMinutes: 120,
      credentialsReference: "ENC_VAULT_LAB_ASSAY_KEY",
      config: { autoQualMatch: true, GAR_Threshold: 4200 },
    },
    {
      integrationId: "conn-wb-07",
      providerName: "Mettler Toledo Automated Weighbridge Adapter",
      type: "WEIGHBRIDGE",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date().toISOString(),
      syncFrequency: "On Truck Scale",
      healthScore: 99,
      latencyMs: 95,
      errorRatePct: 0.01,
      dataFreshnessMinutes: 2,
      credentialsReference: "ENC_VAULT_WB_COM_PORT",
      config: { duplicateTicketCheck: true, autoGrossTare: true },
    },
    {
      integrationId: "conn-att-08",
      providerName: "Biometric & Mobile GPS Attendance Gateway",
      type: "ATTENDANCE",
      companyId: "comp-1",
      siteId: "site-1",
      status: "CONNECTED",
      lastSyncAt: new Date().toISOString(),
      syncFrequency: "Clock In/Out Event",
      healthScore: 94,
      latencyMs: 180,
      errorRatePct: 0.08,
      dataFreshnessMinutes: 5,
      credentialsReference: "ENC_VAULT_BIOMETRIC_API",
      config: { geofenceRadiusMeter: 500, autoShiftDetect: true },
    },
  ];

  private static apiKeys: APIKeyRecord[] = [
    {
      keyId: "key-001",
      keyName: "ERP SAP Read-Only Production Key",
      apiKeyHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      rawKeyPrefix: "ms_live_7a9f...",
      scopes: ["production.read", "fleet.read", "weighbridge.read", "inventory.read"],
      createdAt: "2026-06-01T00:00:00Z",
      expiresAt: "2027-06-01T00:00:00Z",
      lastUsedAt: new Date().toISOString(),
      status: "ACTIVE",
    },
    {
      keyId: "key-002",
      keyName: "FMS Real-Time Ingest Partner Key",
      apiKeyHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      rawKeyPrefix: "ms_live_4b2c...",
      scopes: ["production.write", "fleet.write", "fuel.write", "weighbridge.write"],
      createdAt: "2026-07-15T00:00:00Z",
      expiresAt: "2027-07-15T00:00:00Z",
      lastUsedAt: new Date().toISOString(),
      status: "ACTIVE",
    },
  ];

  private static webhooks: WebhookSubscription[] = [
    {
      webhookId: "wh-001",
      name: "SAP ERP Financial Billing Sync Webhook",
      targetUrl: "https://erp.minesmart.co.id/api/v1/webhooks/shipment-created",
      events: ["shipment.created", "weighbridge.ticket.created"],
      secretKey: "whsec_9941a82bc1784910",
      retryPolicy: "EXPONENTIAL_BACKOFF_3X",
      status: "ACTIVE",
      lastTriggeredAt: new Date().toISOString(),
      deliverySuccessPct: 99.4,
    },
    {
      webhookId: "wh-002",
      name: "Safety Emergency HSE Alert Webhook",
      targetUrl: "https://alert.minesmart.co.id/hooks/hse-emergency",
      events: ["hse.incident.created", "equipment.breakdown", "ai.alert.created"],
      secretKey: "whsec_7781b994cc218843",
      retryPolicy: "EXPONENTIAL_BACKOFF_3X",
      status: "ACTIVE",
      lastTriggeredAt: "2026-08-14T10:15:00Z",
      deliverySuccessPct: 100.0,
    },
  ];

  private static webhookLogs: WebhookDeliveryLog[] = [
    {
      logId: "whlog-101",
      webhookId: "wh-001",
      event: "shipment.created",
      payloadSummary: "Shipment Ticket #SHP-20260814-04 (5,200 MT Coal to Vessel MV Nusantara)",
      httpStatus: 200,
      durationMs: 145,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    },
    {
      logId: "whlog-102",
      webhookId: "wh-002",
      event: "equipment.breakdown",
      payloadSummary: "Breakdown Alert EX-204 (Hydraulic Hose Leak at Pit 2 North)",
      httpStatus: 200,
      durationMs: 88,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "SUCCESS",
    },
  ];

  private static imports: UniversalImportRecord[] = [
    {
      importId: "imp-001",
      fileName: "Daily_Production_Logs_20260814.csv",
      fileType: "CSV",
      targetModule: "Production Management",
      totalRows: 240,
      validRows: 238,
      warningRows: 2,
      errorRows: 0,
      importedAt: new Date().toISOString(),
      importedBy: "Ir. Bambang (Dispatch Lead)",
      status: "IMPORTED",
    },
    {
      importId: "imp-002",
      fileName: "Drone_Stockpile_Survey_3D_Volume.geojson",
      fileType: "GEOJSON",
      targetModule: "GIS & Survey",
      totalRows: 12,
      validRows: 12,
      warningRows: 0,
      errorRows: 0,
      importedAt: "2026-08-13T16:00:00Z",
      importedBy: "Hendra (Chief Surveyor)",
      status: "IMPORTED",
    },
  ];

  private static exports: UniversalExportJob[] = [
    {
      exportId: "exp-001",
      exportType: "REPORT_PDF",
      requestedBy: "Budi Santoso (KTT)",
      requestedAt: new Date().toISOString(),
      fileSizeMb: 2.4,
      status: "COMPLETED",
      downloadUrl: "/exports/rep-daily-20260814.pdf",
      expiresAt: "2026-08-21T00:00:00Z",
    },
    {
      exportId: "exp-002",
      exportType: "DATA_CSV",
      requestedBy: "Finance Manager",
      requestedAt: new Date(Date.now() - 7200000).toISOString(),
      fileSizeMb: 1.1,
      status: "COMPLETED",
      downloadUrl: "/exports/fleet-telematics-dump.csv",
      expiresAt: "2026-08-21T00:00:00Z",
    },
  ];

  private static auditLogs: IntegrationAuditLogRecord[] = [
    {
      auditId: "aud-001",
      action: "API_KEY_CREATED",
      performedBy: "Super Admin",
      integrationId: "key-002",
      details: "Created new API Key 'FMS Real-Time Ingest Partner Key' with scopes ['production.write', 'fleet.write']",
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    },
    {
      auditId: "aud-002",
      action: "DATA_IMPORTED",
      performedBy: "Dispatch Lead",
      details: "Successfully imported 238 records from Daily_Production_Logs_20260814.csv",
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    },
  ];

  public static getConnectors(): IntegrationConnector[] {
    return this.connectors;
  }

  public static getAPIKeys(): APIKeyRecord[] {
    return this.apiKeys;
  }

  public static getWebhooks(): WebhookSubscription[] {
    return this.webhooks;
  }

  public static getWebhookLogs(): WebhookDeliveryLog[] {
    return this.webhookLogs;
  }

  public static getImports(): UniversalImportRecord[] {
    return this.imports;
  }

  public static getExports(): UniversalExportJob[] {
    return this.exports;
  }

  public static getAuditLogs(): IntegrationAuditLogRecord[] {
    return this.auditLogs;
  }

  /**
   * Generates a new API Key record.
   */
  public static createAPIKey(name: string, scopes: string[]): APIKeyRecord {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const newKey: APIKeyRecord = {
      keyId: `key-${Date.now()}`,
      keyName: name,
      apiKeyHash: `hash_${randomHex}_${Date.now()}`,
      rawKeyPrefix: `ms_live_${randomHex}...`,
      scopes,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      status: "ACTIVE",
    };
    this.apiKeys.unshift(newKey);
    this.auditLogs.unshift({
      auditId: `aud-${Date.now()}`,
      action: "API_KEY_CREATED",
      performedBy: "Logged In User",
      details: `Created API Key '${name}' with scopes [${scopes.join(", ")}]`,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    });
    return newKey;
  }

  /**
   * Universal CSV / Text Parser with Field Mapping and Data Quality Validation.
   */
  public static parseCSVData(rawText: string, targetModule: string) {
    const lines = rawText.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      throw new Error("CSV file is empty.");
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"/, "").replace(/"$/, ""));
    const rows = lines.slice(1).map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^"/, "").replace(/"$/, ""));
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = parts[idx] || "";
      });
      return obj;
    });

    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    rows.forEach((row) => {
      const hasEmptyVal = Object.values(row).some((v) => v === "");
      if (hasEmptyVal) warningCount++;
      else validCount++;
    });

    const newImport: UniversalImportRecord = {
      importId: `imp-${Date.now()}`,
      fileName: `Import_${targetModule.replace(/\s+/g, "_")}_${new Date().toISOString().substring(0, 10)}.csv`,
      fileType: "CSV",
      targetModule,
      totalRows: rows.length,
      validRows: validCount,
      warningRows: warningCount,
      errorRows: errorCount,
      importedAt: new Date().toISOString(),
      importedBy: "User Operator",
      status: "IMPORTED",
    };

    this.imports.unshift(newImport);

    return {
      importRecord: newImport,
      headers,
      sampleRows: rows.slice(0, 5),
    };
  }
}
