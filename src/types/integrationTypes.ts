// MINE SMART AI - Enterprise Integration Hub & API Center Types
// Multi-Category Connectors: REST API, Webhook, GPS, IoT, FMS, ERP, Weighbridge, Lab, Drone, CCTV, RFID, Attendance, Accounting

import { BaseEntity } from "./index";

export type ConnectorCategory =
  | "rest_api"
  | "webhook"
  | "gps"
  | "iot"
  | "fms"
  | "erp"
  | "weighbridge"
  | "laboratory"
  | "drone"
  | "cctv"
  | "rfid"
  | "attendance"
  | "accounting";

export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR" | "TESTING" | "SYNCING";

export type AuthProtocolType =
  | "API_KEY"
  | "BEARER_OAUTH2"
  | "BASIC_AUTH"
  | "MUTUAL_TLS"
  | "HMAC_SHA256"
  | "MQTT_CERT"
  | "SERIAL_PORT"
  | "NONE";

export type NetworkProtocol =
  | "HTTPS_REST"
  | "WEBHOOK"
  | "MQTT"
  | "WSS"
  | "TCP_IP"
  | "SERIAL_RS232"
  | "RTSP_ONVIF"
  | "ODATA_RFC"
  | "OPC_UA"
  | "SFTP";

export interface IntegrationConnector extends BaseEntity {
  companyId: string;
  siteId?: string;
  category: ConnectorCategory;
  categoryLabel: string;
  name: string;
  provider: string;
  iconName: string;
  description: string;
  status: IntegrationStatus;
  protocol: NetworkProtocol;
  authType: AuthProtocolType;
  endpointUrl: string;
  port?: number;
  apiKeyMasked?: string;
  authTokenExpiry?: string;
  syncFrequency: "REALTIME_STREAM" | "EVERY_1_MIN" | "EVERY_5_MIN" | "HOURLY" | "DAILY_BATCH" | "ON_DEMAND";
  lastSyncAt: string;
  nextSyncAt?: string;
  latencyMs: number;
  uptimePct: number;
  totalRequestsToday: number;
  failedRequestsToday: number;
  successRatePct: number;
  ipAddress?: string;
  deviceModel?: string;
  firmwareVersion?: string;
  configParameters: Record<string, any>;
  dataMappingSchema: Record<string, string>;
  isMockSimulated?: boolean;
}

export interface WebhookSubscription extends BaseEntity {
  companyId: string;
  name: string;
  targetUrl: string;
  subscribedEvents: string[];
  secretTokenMasked: string;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    timeoutSeconds: number;
  };
  headers: Record<string, string>;
  lastDeliveredAt?: string;
  lastResponseStatus?: number;
  successCount: number;
  failureCount: number;
  description: string;
}

export interface ApiEndpointSpec {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  category: ConnectorCategory;
  summary: string;
  description: string;
  rateLimitPerMinute: number;
  headers: { key: string; required: boolean; description: string }[];
  queryParams?: { key: string; type: string; required: boolean; description: string }[];
  requestBodySample?: Record<string, any>;
  responseSuccessSample: Record<string, any>;
  responseErrorSample: Record<string, any>;
  requiresOAuth: boolean;
  requiredScope: string;
}

export interface IntegrationTransactionLog {
  id: string;
  timestamp: string;
  connectorId: string;
  connectorName: string;
  category: ConnectorCategory;
  direction: "INBOUND" | "OUTBOUND";
  methodOrAction: string;
  endpointOrTopic: string;
  requestPayloadSummary: string;
  responsePayloadSummary: string;
  httpStatusCode?: number;
  status: "SUCCESS" | "WARNING" | "FAILED";
  latencyMs: number;
  errorMessage?: string;
  retryAttempt?: number;
  ipSource?: string;
}

export interface LiveHardwareFeedItem {
  id: string;
  category: ConnectorCategory;
  deviceName: string;
  location: string;
  timestamp: string;
  metricLabel: string;
  metricValue: string | number;
  unit: string;
  quality: "GOOD" | "WARNING" | "ALARM";
  rawPacketHex?: string;
  parsedPayload: Record<string, any>;
}

export interface IntegrationSummaryKPIs {
  totalConnectors: number;
  activeConnectors: number;
  failedConnectors: number;
  totalApiRequests24h: number;
  averageLatencyMs: number;
  globalUptimePct: number;
  activeWebhooks: number;
  syncedIoTFleets: number;
  queuedRetries: number;
}
