// MINE SMART AI - Document Management System (DMS) Types
export type DocumentCategory =
  | "SOP"
  | "WORK_INSTRUCTION"
  | "CONTRACT"
  | "PERMIT"
  | "DRAWING"
  | "REPORT"
  | "CERTIFICATE"
  | "INVOICE"
  | "INSPECTION";

export type DocumentStatus =
  | "ACTIVE"
  | "UNDER_REVIEW"
  | "DRAFT"
  | "EXPIRED"
  | "ARCHIVED";

export type DocumentDepartment =
  | "Mining"
  | "Geology & Survey"
  | "Plant Maintenance"
  | "Processing & Coal"
  | "HSE & Environment"
  | "Commercial & Finance"
  | "Legal & Compliance"
  | "Supply Chain"
  | "HR & GA";

export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "RESTRICTED"
  | "CONFIDENTIAL"
  | "SECRET";

export type FileType =
  | "PDF"
  | "DWG"
  | "DOCX"
  | "XLSX"
  | "SCAN_IMG"
  | "ZIP";

export interface RevisionHistoryItem {
  version: string;
  date: string;
  author: string;
  changes: string;
  approvedBy: string;
}

export interface DocumentItem {
  id: string;
  documentNumber: string;
  title: string;
  category: DocumentCategory;
  department: DocumentDepartment;
  version: string;
  status: DocumentStatus;
  effectiveDate: string;
  expiryDate?: string;
  author: string;
  reviewer: string;
  approvedBy: string;
  confidentiality: ConfidentialityLevel;
  fileType: FileType;
  fileSizeMB: number;
  tags: string[];
  equipmentTags?: string[];
  locationScope?: string;
  summary: string;
  fullTextContent: string;
  keyProcedures?: string[];
  checklistItems?: Array<{ item: string; standard: string; status?: "PASS" | "FAIL" | "N/A" }>;
  clauses?: Array<{ clauseNumber: string; title: string; content: string }>;
  revisionHistory: RevisionHistoryItem[];
  relatedDocumentIds?: string[];
  complianceStandard?: string; // e.g. "Kepmen ESDM 1827 K/30/MEM/2018", "ISO 45001", "SMKP Minerba"
  downloadCount: number;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentStats {
  totalDocuments: number;
  sopCount: number;
  workInstructionCount: number;
  contractCount: number;
  permitCount: number;
  drawingCount: number;
  reportCount: number;
  certificateCount: number;
  invoiceCount: number;
  inspectionCount: number;
  activeCount: number;
  underReviewCount: number;
  expiringSoonCount: number; // Expiring in next 60 days
  expiredCount: number;
}

export interface AISearchResult {
  document: DocumentItem;
  relevanceScore: number; // 0 to 100
  matchReason: string;
  highlightSnippet: string;
  matchedKeywords: string[];
}

export interface AISearchResponse {
  query: string;
  inferredCategory?: DocumentCategory;
  inferredDepartment?: DocumentDepartment;
  inferredEquipment?: string;
  aiSynthesis: string;
  results: AISearchResult[];
  suggestedFollowUps: string[];
}

export interface DocumentFilterOptions {
  category?: DocumentCategory | "ALL";
  department?: DocumentDepartment | "ALL";
  status?: DocumentStatus | "ALL";
  confidentiality?: ConfidentialityLevel | "ALL";
  searchQuery?: string;
  equipmentTag?: string;
  expiringOnly?: boolean;
}
