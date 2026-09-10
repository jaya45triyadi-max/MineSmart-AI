import { InvoiceRecord, LicensePlanId } from "../../types/license";
import { BaseRepository } from "../repositories/BaseRepository";

class InvoiceRepository extends BaseRepository<InvoiceRecord> {
  constructor() {
    super("invoices", []);
  }

  async getInvoicesByCompanyId(companyId: string): Promise<InvoiceRecord[]> {
    const all = await this.getAll();
    return all.filter((inv) => inv.companyId === companyId).sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  }
}

export const invoiceRepository = new InvoiceRepository();

export interface PaymentProvider {
  createInvoice(params: {
    companyId: string;
    companyName: string;
    subscriptionId: string;
    planId: LicensePlanId;
    amountIDR: number;
  }): Promise<InvoiceRecord>;

  verifyAndMarkPaid(invoiceId: string, paymentMethod: InvoiceRecord["paymentMethod"]): Promise<InvoiceRecord>;
}

export class InvoiceService implements PaymentProvider {
  /**
   * Bank Transfer Account Details for Indonesia Mining Enterprise Commercial Billing
   */
  static readonly BANK_TRANSFER_DETAILS = {
    bankName: "PT BANK MANDIRI (PERSERO) TBK",
    accountNumber: "137-00-2026888-9",
    accountName: "PT MINE SMART AI INDONESIA",
  };

  /**
   * Generates a new invoice for subscription renewal or plan upgrade
   */
  async createInvoice(params: {
    companyId: string;
    companyName: string;
    subscriptionId: string;
    planId: LicensePlanId;
    amountIDR: number;
  }): Promise<InvoiceRecord> {
    const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
    const invCount = (await invoiceRepository.getAll()).length + 1;
    const invNumber = `INV-${dateStr}-${invCount.toString().padStart(4, "0")}`;

    const issuedAt = new Date();
    const dueAt = new Date(issuedAt.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days payment terms

    const newInvoice: InvoiceRecord = {
      id: "INV-ID-" + Date.now(),
      invoiceNumber: invNumber,
      companyId: params.companyId,
      companyName: params.companyName,
      subscriptionId: params.subscriptionId,
      planId: params.planId,
      amountIDR: Math.round(params.amountIDR), // Ensure integer minor-unit / integer IDR
      currency: "IDR",
      status: "UNPAID",
      issuedAt: issuedAt.toISOString(),
      dueAt: dueAt.toISOString(),
      bankTransferDetails: InvoiceService.BANK_TRANSFER_DETAILS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await invoiceRepository.create(newInvoice);
    return newInvoice;
  }

  /**
   * Verifies and marks invoice as PAID (used by Super Admin or Webhook callback)
   */
  static async verifyAndMarkPaid(
    invoiceId: string,
    paymentMethod: InvoiceRecord["paymentMethod"] = "BANK_TRANSFER"
  ): Promise<InvoiceRecord> {
    const instance = new InvoiceService();
    return instance.verifyAndMarkPaid(invoiceId, paymentMethod);
  }

  async verifyAndMarkPaid(
    invoiceId: string,
    paymentMethod: InvoiceRecord["paymentMethod"] = "BANK_TRANSFER"
  ): Promise<InvoiceRecord> {
    const existing = await invoiceRepository.getById(invoiceId);
    if (!existing) {
      throw new Error(`Invoice #${invoiceId} tidak ditemukan.`);
    }

    if (existing.status === "PAID") {
      return existing; // Idempotent check
    }

    const updated: Partial<InvoiceRecord> = {
      status: "PAID",
      paidAt: new Date().toISOString(),
      paymentMethod,
      updatedAt: new Date().toISOString(),
    };

    await invoiceRepository.update(invoiceId, updated);
    return { ...existing, ...updated };
  }

  /**
   * Gets list of invoices for a company
   */
  static async getInvoicesForCompany(companyId: string): Promise<InvoiceRecord[]> {
    return invoiceRepository.getInvoicesByCompanyId(companyId);
  }

  /**
   * Gets all invoices for Super Admin management
   */
  static async getAllInvoices(): Promise<InvoiceRecord[]> {
    const all = await invoiceRepository.getAll();
    return all.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  }
}

export const paymentService = new InvoiceService();
