import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Box,
  Ship,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  X,
  Scale,
  Award,
} from "lucide-react";
import { SalesContract, ContractStatus, ContractType, PricingBasis } from "../../../types/salesTypes";

interface ContractsTabProps {
  contracts: SalesContract[];
  onAddContract: (contract: Partial<SalesContract>) => void;
}

export const ContractsTab: React.FC<ContractsTabProps> = ({
  contracts,
  onAddContract,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedContract, setSelectedContract] = useState<SalesContract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [contractNumber, setContractNumber] = useState("");
  const [customerName, setCustomerName] = useState("PT PLN Nusantara Power");
  const [contractType, setContractType] = useState<ContractType>("LONG_TERM");
  const [productName, setProductName] = useState("BNU Premium GAR 5800 Coal");
  const [contractQuantity, setContractQuantity] = useState(250000);
  const [price, setPrice] = useState(88.5);
  const [pricingBasis, setPricingBasis] = useState<PricingBasis>("FORMULA_BASED");
  const [incoterm, setIncoterm] = useState<"FOB" | "CIF" | "CFR">("FOB");
  const [loadingPort, setLoadingPort] = useState("Sangatta Coal Terminal");
  const [destination, setDestination] = useState("Port of Rembang");

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractNumber) return;

    onAddContract({
      contractNumber,
      customerName,
      contractType,
      productId: "PRD-COAL-5800",
      productName,
      coalSpecificationId: "SPEC-GAR5800-PREMIUM",
      specName: "Premium GAR 5800 Export Grade",
      contractQuantity,
      quantityUnit: "MT",
      price,
      priceUnit: "USD/MT",
      currency: "USD",
      pricingBasis,
      incoterm,
      loadingPort,
      destination,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      paymentTerms: "L/C 30 Days",
      qualityTerms: "GAR 5800 kcal/kg, TM max 24%",
      penaltyTerms: "USD 1.50/MT per 100 kcal deficit",
      status: "ACTIVE",
      allocatedQuantity: 0,
      scheduledQuantity: 0,
      shippedQuantity: 0,
      deliveredQuantity: 0,
      remainingQuantity: contractQuantity,
      fulfillmentPercent: 0,
      createdBy: "Commercial Manager",
    });

    setIsModalOpen(false);
    setContractNumber("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Long-Term & Spot Sales Contracts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track contract quantities, fulfillment gauges, pricing basis formulas, and commercial commitments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Sales Contract
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by contract number, customer, coal product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                    {contract.contractNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {contract.contractType}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                      contract.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {contract.customerName}
                </h3>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Unit Contract Price</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    ${contract.price.toFixed(2)} {contract.priceUnit}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Pricing Engine</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {contract.pricingBasis.replace("_", " ")}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedContract(contract)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1"
                >
                  Details <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quantity Fulfillment Multi-Segment Progress Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  Contract Fulfillment: {contract.fulfillmentPercent}% ({(contract.deliveredQuantity / 1000).toLocaleString("id-ID")}k / {(contract.contractQuantity / 1000).toLocaleString("id-ID")}k MT)
                </span>
                <span className="text-slate-500">
                  Remaining: {(contract.remainingQuantity / 1000).toLocaleString("id-ID")}k MT
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  title={`Delivered: ${contract.deliveredQuantity} MT`}
                  style={{ width: `${(contract.deliveredQuantity / contract.contractQuantity) * 100}%` }}
                ></div>
                <div
                  className="bg-amber-400 h-full"
                  title={`In Transit: ${contract.shippedQuantity - contract.deliveredQuantity} MT`}
                  style={{
                    width: `${
                      ((contract.shippedQuantity - contract.deliveredQuantity) / contract.contractQuantity) * 100
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-blue-400 h-full"
                  title={`Scheduled / Allocated: ${contract.allocatedQuantity - contract.shippedQuantity} MT`}
                  style={{
                    width: `${
                      ((contract.allocatedQuantity - contract.shippedQuantity) / contract.contractQuantity) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Delivered: {contract.deliveredQuantity.toLocaleString("id-ID")} MT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  In-Transit: {(contract.shippedQuantity - contract.deliveredQuantity).toLocaleString("id-ID")} MT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>
                  Allocated: {(contract.allocatedQuantity - contract.shippedQuantity).toLocaleString("id-ID")} MT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block"></span>
                  Unallocated: {contract.remainingQuantity.toLocaleString("id-ID")} MT
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span>Product: <strong className="text-slate-800 dark:text-slate-200">{contract.productName}</strong></span>
                <span>Incoterm: <strong className="text-slate-800 dark:text-slate-200">{contract.incoterm}</strong> ({contract.loadingPort})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Validity: {contract.startDate} to {contract.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {selectedContract.contractNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedContract.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Total Contract Qty</span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedContract.contractQuantity.toLocaleString("id-ID")} MT
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Unit Price</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ${selectedContract.price.toFixed(2)} USD/MT
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Incoterm</span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedContract.incoterm}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Quality Specification & Penalty Terms</h4>
              <p className="text-slate-600 dark:text-slate-300"><strong>Guaranteed Spec:</strong> {selectedContract.qualityTerms}</p>
              <p className="text-slate-600 dark:text-slate-300"><strong>Penalty Rule:</strong> {selectedContract.penaltyTerms}</p>
              <p className="text-slate-600 dark:text-slate-300"><strong>Payment Terms:</strong> {selectedContract.paymentTerms}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create Sales Contract</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contract Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CTR-2026-PLN-099"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contract Type</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as ContractType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="LONG_TERM">Long Term</option>
                    <option value="SPOT">Spot Purchase</option>
                    <option value="FRAMEWORK">Framework Agreement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contract Quantity (MT)</label>
                  <input
                    type="number"
                    value={contractQuantity}
                    onChange={(e) => setContractQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Price (USD/MT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
