// MINE SMART AI - Enterprise Integration & API Center Repository Service
// Live simulator for all 13 Mining Connector Categories

import {
  IntegrationConnector,
  WebhookSubscription,
  ApiEndpointSpec,
  IntegrationTransactionLog,
  LiveHardwareFeedItem,
  IntegrationSummaryKPIs,
  ConnectorCategory,
} from "../../types/integrationTypes";
import {
  INITIAL_CONNECTORS_DATA,
  INITIAL_WEBHOOK_SUBSCRIPTIONS,
  INITIAL_API_ENDPOINTS_SPEC,
  INITIAL_TRANSACTION_LOGS,
  INITIAL_LIVE_HARDWARE_FEEDS,
  INITIAL_INTEGRATION_KPIS,
} from "../../data/integrationData";

class IntegrationRepository {
  private connectors: IntegrationConnector[] = [...INITIAL_CONNECTORS_DATA];
  private webhooks: WebhookSubscription[] = [...INITIAL_WEBHOOK_SUBSCRIPTIONS];
  private apiEndpoints: ApiEndpointSpec[] = [...INITIAL_API_ENDPOINTS_SPEC];
  private transactionLogs: IntegrationTransactionLog[] = [...INITIAL_TRANSACTION_LOGS];
  private liveFeeds: LiveHardwareFeedItem[] = [...INITIAL_LIVE_HARDWARE_FEEDS];
  private kpis: IntegrationSummaryKPIs = { ...INITIAL_INTEGRATION_KPIS };

  // Get Summary KPIs
  async getKPIs(): Promise<IntegrationSummaryKPIs> {
    const active = this.connectors.filter((c) => c.status === "CONNECTED").length;
    const failed = this.connectors.filter((c) => c.status === "ERROR" || c.status === "DISCONNECTED").length;
    return {
      ...this.kpis,
      totalConnectors: this.connectors.length,
      activeConnectors: active,
      failedConnectors: failed,
      activeWebhooks: this.webhooks.filter((w) => w.status === "ACTIVE").length,
    };
  }

  // Get Connectors
  async getAllConnectors(categoryFilter?: ConnectorCategory): Promise<IntegrationConnector[]> {
    if (categoryFilter) {
      return this.connectors.filter((c) => c.category === categoryFilter);
    }
    return [...this.connectors];
  }

  async getConnectorById(id: string): Promise<IntegrationConnector | undefined> {
    return this.connectors.find((c) => c.id === id);
  }

  // Update Connector Configuration
  async updateConnector(
    id: string,
    updates: Partial<IntegrationConnector>,
    userEmail: string
  ): Promise<IntegrationConnector> {
    const idx = this.connectors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Connector not found");

    const updated: IntegrationConnector = {
      ...this.connectors[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.connectors[idx] = updated;

    // Log the configuration change
    this.addTransactionLog({
      id: `LOG-CFG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      connectorId: updated.id,
      connectorName: updated.name,
      category: updated.category,
      direction: "INBOUND",
      methodOrAction: "UPDATE_CONFIG",
      endpointOrTopic: updated.endpointUrl,
      requestPayloadSummary: `Updated by ${userEmail}: ${Object.keys(updates).join(", ")}`,
      responsePayloadSummary: "Configuration saved and synced to edge gateway",
      httpStatusCode: 200,
      status: "SUCCESS",
      latencyMs: 15,
      ipSource: "10.14.10.1",
    });

    return updated;
  }

  // Test Live Connector Ping / Handshake
  async testConnectorConnection(id: string): Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
    handshakeResponse: Record<string, any>;
  }> {
    const connector = this.connectors.find((c) => c.id === id);
    if (!connector) throw new Error("Connector not found");

    // Simulate realistic hardware latency based on protocol
    let simLatency = 12;
    if (connector.protocol === "TCP_IP" || connector.protocol === "SERIAL_RS232") simLatency = 5 + Math.floor(Math.random() * 5);
    else if (connector.protocol === "ODATA_RFC") simLatency = 70 + Math.floor(Math.random() * 30);
    else if (connector.protocol === "RTSP_ONVIF") simLatency = 20 + Math.floor(Math.random() * 15);
    else simLatency = 15 + Math.floor(Math.random() * 20);

    const isSuccess = Math.random() > 0.05; // 95% success rate

    const handshakeResponse: Record<string, any> = {
      protocolVersion: connector.protocol,
      authValidation: "PASSED",
      edgeGatewayTime: new Date().toISOString(),
      deviceUptime: "14 days, 6 hours",
      bufferHealth: "100%",
      portStatus: connector.port ? `PORT_${connector.port}_OPEN` : "HTTP_200_OK",
    };

    // Update connector stats
    const idx = this.connectors.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.connectors[idx] = {
        ...this.connectors[idx],
        lastSyncAt: new Date().toISOString(),
        latencyMs: simLatency,
        status: isSuccess ? "CONNECTED" : "ERROR",
      };
    }

    // Log the transaction
    this.addTransactionLog({
      id: `LOG-PING-${Date.now()}`,
      timestamp: new Date().toISOString(),
      connectorId: connector.id,
      connectorName: connector.name,
      category: connector.category,
      direction: "OUTBOUND",
      methodOrAction: "PING_HANDSHAKE",
      endpointOrTopic: connector.endpointUrl,
      requestPayloadSummary: `SYN/ACK Handshake Test to ${connector.endpointUrl}:${connector.port || "default"}`,
      responsePayloadSummary: isSuccess
        ? `Handshake OK in ${simLatency}ms. Status: CONNECTED`
        : `Handshake Failed: Connection Timeout`,
      httpStatusCode: isSuccess ? 200 : 504,
      status: isSuccess ? "SUCCESS" : "FAILED",
      latencyMs: simLatency,
      ipSource: "10.14.10.1",
    });

    return {
      success: isSuccess,
      latencyMs: simLatency,
      message: isSuccess
        ? `Koneksi berhasil terhubung ke ${connector.provider} dalam ${simLatency}ms.`
        : `Gagal terhubung ke endpoint ${connector.endpointUrl}. Periksa firewall dan gateway.`,
      handshakeResponse,
    };
  }

  // Webhooks
  async getAllWebhooks(): Promise<WebhookSubscription[]> {
    return [...this.webhooks];
  }

  async createWebhook(
    wh: Omit<WebhookSubscription, "id" | "createdAt" | "updatedAt" | "isDeleted" | "successCount" | "failureCount">,
    userEmail: string
  ): Promise<WebhookSubscription> {
    const newWh: WebhookSubscription = {
      ...wh,
      id: `WH-SUB-${Date.now().toString().slice(-4)}`,
      successCount: 0,
      failureCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    this.webhooks.unshift(newWh);
    return newWh;
  }

  async triggerTestWebhook(
    webhookId: string,
    sampleEvent: string,
    sampleData: Record<string, any>
  ): Promise<{
    delivered: boolean;
    statusCode: number;
    hmacSignature: string;
    deliveryTimeMs: number;
    responseBody: string;
  }> {
    const wh = this.webhooks.find((w) => w.id === webhookId);
    if (!wh) throw new Error("Webhook not found");

    const deliveryTimeMs = 18 + Math.floor(Math.random() * 25);
    const mockHmac = "sha256=" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const payloadString = JSON.stringify({
      event: sampleEvent,
      timestamp: new Date().toISOString(),
      companyId: wh.companyId,
      data: sampleData,
    });

    // Update webhook
    const idx = this.webhooks.findIndex((w) => w.id === webhookId);
    if (idx !== -1) {
      this.webhooks[idx] = {
        ...this.webhooks[idx],
        lastDeliveredAt: new Date().toISOString(),
        lastResponseStatus: 200,
        successCount: this.webhooks[idx].successCount + 1,
      };
    }

    this.addTransactionLog({
      id: `LOG-WH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      connectorId: "CONN-WHK-02",
      connectorName: wh.name,
      category: "webhook",
      direction: "OUTBOUND",
      methodOrAction: "POST_WEBHOOK",
      endpointOrTopic: wh.targetUrl,
      requestPayloadSummary: `Dispatched event: ${sampleEvent} to ${wh.targetUrl}`,
      responsePayloadSummary: `HTTP 200 OK | Signature: ${mockHmac.slice(0, 16)}...`,
      httpStatusCode: 200,
      status: "SUCCESS",
      latencyMs: deliveryTimeMs,
      ipSource: "10.14.10.1",
    });

    return {
      delivered: true,
      statusCode: 200,
      hmacSignature: mockHmac,
      deliveryTimeMs,
      responseBody: '{"received": true, "acknowledged_at": "' + new Date().toISOString() + '"}',
    };
  }

  // API Endpoints Spec & Interactive Execution
  async getApiEndpoints(): Promise<ApiEndpointSpec[]> {
    return [...this.apiEndpoints];
  }

  async executeApiSandbox(
    endpointId: string,
    headers: Record<string, string>,
    queryParams: Record<string, string>,
    bodyPayload?: Record<string, any>
  ): Promise<{
    statusCode: number;
    latencyMs: number;
    headers: Record<string, string>;
    responseBody: Record<string, any>;
  }> {
    const ep = this.apiEndpoints.find((e) => e.id === endpointId);
    if (!ep) throw new Error("Endpoint not found");

    const latencyMs = 10 + Math.floor(Math.random() * 20);

    const responseBody = {
      ...ep.responseSuccessSample,
      _executionMetadata: {
        serverNode: "ap-southeast-3-jakarta-edge-01",
        timestamp: new Date().toISOString(),
        latencyMs,
        rateLimitRemaining: ep.rateLimitPerMinute - 1,
      },
    };

    this.addTransactionLog({
      id: `LOG-SANDBOX-${Date.now()}`,
      timestamp: new Date().toISOString(),
      connectorId: "CONN-REST-01",
      connectorName: "API Sandbox Explorer",
      category: ep.category,
      direction: "INBOUND",
      methodOrAction: ep.method,
      endpointOrTopic: ep.path,
      requestPayloadSummary: `Params: ${JSON.stringify(queryParams)} | Body: ${JSON.stringify(bodyPayload || {})}`,
      responsePayloadSummary: `HTTP 200 OK: ${JSON.stringify(responseBody).slice(0, 120)}...`,
      httpStatusCode: 200,
      status: "SUCCESS",
      latencyMs,
      ipSource: "127.0.0.1",
    });

    return {
      statusCode: 200,
      latencyMs,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-ratelimit-limit": ep.rateLimitPerMinute.toString(),
        "x-ratelimit-remaining": (ep.rateLimitPerMinute - 1).toString(),
        "x-request-id": `req_${Date.now()}`,
      },
      responseBody,
    };
  }

  // Transaction Logs
  async getTransactionLogs(filterStatus?: string): Promise<IntegrationTransactionLog[]> {
    if (filterStatus && filterStatus !== "ALL") {
      return this.transactionLogs.filter((l) => l.status === filterStatus);
    }
    return [...this.transactionLogs];
  }

  private addTransactionLog(log: IntegrationTransactionLog) {
    this.transactionLogs.unshift(log);
    if (this.transactionLogs.length > 200) {
      this.transactionLogs.pop();
    }
  }

  // Live Hardware Telemetry Feeds
  async getLiveFeeds(): Promise<LiveHardwareFeedItem[]> {
    return [...this.liveFeeds];
  }

  // Simulate incoming live packet from hardware (e.g. Weighbridge load cell trigger, GPS ping, RFID tag pass)
  simulateIncomingHardwarePacket(
    category: ConnectorCategory,
    deviceName: string,
    metricLabel: string,
    metricValue: string | number,
    unit: string,
    parsedPayload: Record<string, any>
  ): LiveHardwareFeedItem {
    const newFeed: LiveHardwareFeedItem = {
      id: `FEED-${Date.now()}`,
      category,
      deviceName,
      location: "Active Pit Operation",
      timestamp: new Date().toISOString(),
      metricLabel,
      metricValue,
      unit,
      quality: "GOOD",
      parsedPayload,
    };

    this.liveFeeds.unshift(newFeed);
    if (this.liveFeeds.length > 50) this.liveFeeds.pop();

    this.addTransactionLog({
      id: `LOG-STREAM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      connectorId: `CONN-${category.toUpperCase()}`,
      connectorName: deviceName,
      category,
      direction: "INBOUND",
      methodOrAction: "LIVE_PACKET_STREAM",
      endpointOrTopic: `stream://${category}`,
      requestPayloadSummary: `${metricLabel}: ${metricValue} ${unit}`,
      responsePayloadSummary: "Packet verified and pushed to operational telemetry bus",
      httpStatusCode: 200,
      status: "SUCCESS",
      latencyMs: 4,
      ipSource: "10.14.20.10",
    });

    return newFeed;
  }
}

export const integrationRepository = new IntegrationRepository();
