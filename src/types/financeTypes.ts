// MINE SMART AI - Finance & Accounting Management Types

export type AccountCategoryType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export type NormalBalanceType = "DEBIT" | "CREDIT";

export interface ChartOfAccount {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountCategoryType;
  parentAccountId?: string;
  level: number;
  normalBalance: NormalBalanceType;
  isActive: boolean;
  companyId?: string;
  siteId?: string;
  description?: string;
}

export interface CostCenter {
  id: string;
  costCenterId: string;
  code: string;
  name: string;
  companyId: string;
  siteId: string;
  departmentId: string;
  departmentName?: string;
  managerId: string;
  managerName: string;
  status: "ACTIVE" | "INACTIVE";
}

export type CostCategory =
  | "Fuel"
  | "Lubricant"
  | "Maintenance"
  | "Spare Parts"
  | "Labor"
  | "Contractor"
  | "Hauling"
  | "Equipment"
  | "Plant"
  | "Power"
  | "Water"
  | "HSE"
  | "Environment"
  | "Reclamation"
  | "Overhead"
  | "Logistics"
  | "Port"
  | "Shipping"
  | "Other";

export type JournalStatus = "DRAFT" | "REVIEW" | "APPROVED" | "POSTED";

export interface JournalLine {
  lineId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debitIDR: number;
  creditIDR: number;
  costCenterId?: string;
  costCenterName?: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  journalId: string;
  journalNumber: string;
  transactionDate: string;
  postingDate?: string;
  referenceType: "SALES" | "PROCUREMENT" | "INVENTORY" | "PAYROLL" | "ASSET" | "MANUAL" | "ADJUSTMENT";
  referenceId?: string;
  description: string;
  fiscalPeriod: string; // e.g., "2026-08"
  status: JournalStatus;
  lines: JournalLine[];
  totalDebitIDR: number;
  totalCreditIDR: number;
  isBalanced: boolean;
  createdBy: string;
  approvedBy?: string;
  companyId: string;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueRecord {
  id: string;
  revenueId: string;
  revenueNumber: string;
  customerId: string;
  customerName: string;
  contractId: string;
  shipmentId: string;
  shipmentNumber?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  product: string; // e.g. "Coal GAR 6100"
  quantityMT: number;
  unitPriceUSD: number;
  exchangeRate: number; // IDR per USD
  unitPriceIDR: number;
  grossRevenueIDR: number;
  deductionIDR: number; // Quality penalty, moisture adjustment
  netRevenueIDR: number;
  recognitionDate: string;
  status: "DRAFT" | "RECOGNIZED" | "INVOICED" | "PAID";
  companyId: string;
  siteId: string;
}

export type ARStatus = "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";

export interface AccountsReceivable {
  id: string;
  arId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  contractCode: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmountIDR: number;
  paidAmountIDR: number;
  outstandingAmountIDR: number;
  daysOutstanding: number;
  agingBucket: "CURRENT" | "1-30_DAYS" | "31-60_DAYS" | "61-90_DAYS" | "91-180_DAYS" | ">180_DAYS";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: ARStatus;
  companyId: string;
  siteId: string;
}

export type APMatchingStatus = "MATCHED" | "PARTIAL_MATCH" | "MISMATCH" | "PENDING_REVIEW";
export type APStatus = "DRAFT" | "VERIFIED" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export interface AccountsPayable {
  id: string;
  apId: string;
  vendorId: string;
  vendorName: string;
  poNumber: string;
  goodsReceiptNumber: string;
  supplierInvoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmountIDR: number;
  poAmountIDR: number;
  grAmountIDR: number;
  paidAmountIDR: number;
  outstandingAmountIDR: number;
  daysOutstanding: number;
  matchingStatus: APMatchingStatus;
  matchingNotes?: string;
  status: APStatus;
  companyId: string;
  siteId: string;
}

export interface OpexRecord {
  id: string;
  expenseId: string;
  date: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  costCenterId: string;
  costCenterName: string;
  category: CostCategory;
  siteId: string;
  vendorName?: string;
  description: string;
  amountIDR: number;
  referenceType?: string;
  referenceId?: string;
  status: "DRAFT" | "APPROVED" | "PAID";
  companyId: string;
}

export type CapexCategory =
  | "Mining Equipment"
  | "Heavy Equipment"
  | "Processing Plant"
  | "Infrastructure"
  | "Road"
  | "Workshop"
  | "Warehouse"
  | "IT"
  | "Land"
  | "Other";

export interface CapexRequest {
  id: string;
  capexId: string;
  capexNumber: string;
  title: string;
  category: CapexCategory;
  siteId: string;
  costCenterId: string;
  proposedAmountIDR: number;
  approvedAmountIDR: number;
  usefulLifeYears: number;
  justification: string;
  approvalStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CAPITALIZED";
  requestorName: string;
  approvedBy?: string;
  companyId: string;
  createdAt: string;
}

export interface FixedAsset {
  id: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  category: CapexCategory;
  serialNumber?: string;
  equipmentId?: string; // Linked equipment code e.g., "EQ-EX201"
  purchaseDate: string;
  purchaseCostIDR: number;
  capitalizedDate: string;
  usefulLifeYears: number;
  salvageValueIDR: number;
  location: string;
  departmentId: string;
  costCenterId: string;
  accumulatedDepreciationIDR: number;
  currentBookValueIDR: number;
  depreciationMethod: "STRAIGHT_LINE";
  annualDepreciationIDR: number;
  status: "ACTIVE" | "DISPOSED" | "FULLY_DEPRECIATED";
  companyId: string;
  siteId: string;
}

export type BudgetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "LOCKED" | "REVISED" | "CLOSED";
export type BudgetControlStatus = "WITHIN_BUDGET" | "NEAR_LIMIT" | "OVER_BUDGET";

export interface BudgetRecord {
  id: string;
  budgetId: string;
  fiscalYear: number;
  period: "MONTHLY" | "QUARTERLY" | "YEARLY";
  periodName: string; // e.g. "2026-Q3" or "2026-08"
  companyId: string;
  siteId: string;
  departmentId: string;
  departmentName?: string;
  costCenterId: string;
  costCenterName?: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  budgetAmountIDR: number;
  actualAmountIDR: number;
  varianceIDR: number; // Actual - Budget
  variancePct: number; // (Actual - Budget) / Budget * 100
  controlStatus: BudgetControlStatus;
  status: BudgetStatus;
}

export interface CashFlowRecord {
  id: string;
  cashId: string;
  date: string;
  type: "OPERATING" | "INVESTING" | "FINANCING";
  direction: "INFLOW" | "OUTFLOW";
  category: string;
  description: string;
  amountIDR: number;
  sourceModule: "SALES" | "PROCUREMENT" | "PAYROLL" | "ASSET" | "FINANCE";
  referenceId?: string;
  companyId: string;
  siteId: string;
}

export interface MiningCostModel {
  siteId: string;
  siteName: string;
  pitId: string;
  pitName: string;
  period: string;
  coalProductionMT: number;
  obVolumeBCM: number;
  drillingCostIDR: number;
  blastingCostIDR: number;
  excavationCostIDR: number;
  loadingCostIDR: number;
  haulingCostIDR: number;
  dumpingCostIDR: number;
  dozingCostIDR: number;
  gradingCostIDR: number;
  dewateringCostIDR: number;
  roadMaintenanceCostIDR: number;
  fuelCostIDR?: number;
  maintenanceCostIDR?: number;
  laborCostIDR?: number;
  otherCostIDR: number;
  totalMiningCostIDR: number;
  costPerTonIDR: number;
  costPerBCMIDR: number;
  costPerTonBaselineIDR?: number;
  costPerBCMBaselineIDR?: number;
}

export interface EquipmentCostDetail {
  equipmentCode: string;
  equipmentName: string;
  category: string;
  workingHours: number;
  fuelCostIDR: number;
  maintenanceCostIDR: number;
  laborCostIDR: number;
  depreciationCostIDR: number;
  totalCostIDR: number;
  costPerHourIDR: number;
}

export interface FinancialPeriod {
  id: string;
  periodId: string;
  periodName: string; // "2026-08"
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: "OPEN" | "CLOSING" | "CLOSED" | "LOCKED";
}

export interface FinanceKPISummary {
  totalRevenueIDR: number;
  grossProfitIDR: number;
  grossMarginPct: number;
  operatingProfitIDR: number;
  operatingMarginPct: number;
  netProfitIDR: number;
  totalCostIDR: number;
  totalOpexIDR: number;
  totalCapexIDR: number;
  cashBalanceIDR: number;
  cashInflowIDR?: number;
  cashOutflowIDR?: number;
  accountsReceivableIDR: number;
  accountsPayableIDR: number;
  totalBudgetIDR: number;
  totalActualIDR: number;
  budgetVarianceIDR: number;
  budgetVariancePct: number;
  costPerTonIDR: number;
  costPerBCMIDR: number;
  costPerTonBaselineIDR?: number;
  costPerBCMBaselineIDR?: number;
  fuelCostTotalIDR: number;
  maintenanceCostTotalIDR: number;
  haulingCostTotalIDR: number;
  laborCostTotalIDR: number;
  ebitdaIDR: number;
  ebitdaMarginPct: number;
  coalProductionMT: number;
  obVolumeBCM: number;
}

export interface MiningCostRootCauseFactor {
  factor: string;
  category: "FUEL" | "MAINTENANCE" | "HAULING" | "LABOR" | "WEATHER" | "STRIP_RATIO";
  impactIDR: number;
  percentageContribution: number;
  description: string;
  evidenceData: string;
  recommendedAction: string;
  estimatedSavingsIDR: number;
}

export interface MiningCostAnomalyReport {
  period: string;
  previousMonthCostPerTonIDR: number;
  currentMonthCostPerTonIDR: number;
  costPerTonIncreasePct: number;
  previousMonthCostPerBCMIDR: number;
  currentMonthCostPerBCMIDR: number;
  costPerBCMIncreasePct: number;
  totalCostIncreaseIDR: number;
  executiveSummary: string;
  factors: MiningCostRootCauseFactor[];
  quickActions: string[];
}

export interface AIFinanceInsight {
  id: string;
  title: string;
  category: "COST" | "BUDGET" | "CASH_FLOW" | "PROFIT" | "ANOMALY";
  severity: "INFO" | "WARNING" | "CRITICAL";
  finding: string;
  evidence: string;
  rootCauseInference: string;
  impact: string;
  recommendation: string;
  expectedImpact: string;
  confidencePct: number;
  scope: string;
  isAnomaly: boolean;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface FinanceTaxCode {
  code: string;
  name: string;
  ratePct: number;
  type: "VAT" | "WITHHOLDING" | "CIT" | "ROYALTY";
  description: string;
}

export interface CurrencyRate {
  currencyCode: string;
  currencyName: string;
  exchangeRateToIDR: number;
  effectiveDate: string;
}
