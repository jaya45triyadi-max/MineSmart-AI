import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Building2,
  Ship,
  X,
  XCircle,
} from "lucide-react";
import { SalesOrder, SalesOrderStatus, SalesContract } from "../../../types/salesTypes";

interface SalesOrdersTabProps {
  salesOrders: SalesOrder[];
  contracts: SalesContract[];
  onAddSalesOrder: (order: Partial<SalesOrder>) => void;
  onUpdateOrderStatus: (orderId: string, status: SalesOrderStatus) => void;
}

export const SalesOrdersTab: React.FC<SalesOrdersTabProps> = ({
  salesOrders,
  contracts,
  onAddSalesOrder,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || "");
  const [quantity, setQuantity] = useState(8500);
  const [requestedDate, setRequestedDate] = useState("2026-08-20");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("HIGH");

  const filteredOrders = salesOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const contract = contracts.find((c) => c.id === selectedContractId) || contracts[0];
    if (!contract) return;

    onAddSalesOrder({
      orderNumber: `SO-2026-0815-${Math.floor(Math.random() * 90 + 10)}`,
      customerId: contract.customerId,
      customerName: contract.customerName,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      productId: contract.productId,
      productName: contract.productName,
      quantity,
      unit: "MT",
      price: contract.price,
      currency: contract.currency,
      qualitySpecificationId: contract.coalSpecificationId,
      requestedShipmentDate: requestedDate,
      destinationId: "DEST-GUANGZHOU",
      destinationName: contract.destination,
      priority,
      status: "CONFIRMED",
      createdBy: "Sales Dispatch Officer",
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            Commercial Sales Orders (SO Workflow)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full end-to-end commercial order processing: Customer Contract → Sales Order → Stock Allocation → Dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Issue Sales Order
        </button>
      </div>

      {/* Commercial Workflow Stepper Visual */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 hidden md:flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-bold">1</span>
          <span>Customer Contract</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600" />
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-bold">2</span>
          <span>Sales Order (SO)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600" />
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center font-bold">3</span>
          <span>Stock Allocation</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600" />
        <div className="flex items-center gap-2 text-blue-400">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center font-bold">4</span>
          <span>Vessel Shipment</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600" />
        <div className="flex items-center gap-2 text-purple-400">
          <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center font-bold">5</span>
          <span>Proof of Delivery & Revenue</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SO number, customer, product..."
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
            <option value="ALL">All Order Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">SO Number & Date</th>
                <th className="p-3.5">Customer & Contract</th>
                <th className="p-3.5">Coal Grade</th>
                <th className="p-3.5">Order Quantity</th>
                <th className="p-3.5">Target Shipment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((so) => (
                <tr key={so.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                      {so.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Created {new Date(so.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{so.customerName}</span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{so.contractNumber}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{so.productName}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {so.quantity.toLocaleString("id-ID")} MT
                    </span>
                    <span className="text-[10px] text-slate-500 block">${so.price.toFixed(2)}/MT</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{so.requestedShipmentDate}</span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        so.status === "SHIPPED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : so.status === "ALLOCATED"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {so.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    {so.status === "CONFIRMED" && (
                      <button
                        onClick={() => onUpdateOrderStatus(so.id, "ALLOCATED")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px]"
                      >
                        Allocate Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Issue Sales Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Sales Contract</label>
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contractNumber} - {c.customerName} ({c.remainingQuantity.toLocaleString()} MT remaining)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Order Quantity (MT)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Shipment Date</label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
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
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
