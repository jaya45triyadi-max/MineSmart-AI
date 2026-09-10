import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Briefcase,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Customer, CustomerType, CustomerStatus, SalesContract } from "../../../types/salesTypes";

interface CustomersTabProps {
  customers: Customer[];
  contracts: SalesContract[];
  onAddCustomer: (customer: Partial<Customer>) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  contracts,
  onAddCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newCustName, setNewCustName] = useState("");
  const [newCustCode, setNewCustCode] = useState("");
  const [newCustType, setNewCustType] = useState<CustomerType>("POWER_PLANT");
  const [newCountry, setNewCountry] = useState("Indonesia");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCreditLimit, setNewCreditLimit] = useState(10000000);
  const [newPaymentTerms, setNewPaymentTerms] = useState("L/C 30 Days");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || c.customerType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustCode) return;

    onAddCustomer({
      customerCode: newCustCode,
      customerName: newCustName,
      customerType: newCustType,
      country: newCountry,
      address: "Headquarters",
      contactPerson: newContact || "Key Account Manager",
      email: newEmail || "procurement@customer.com",
      phone: "+62 21 0000 0000",
      taxId: "01.000.000.0-000.000",
      paymentTerms: newPaymentTerms,
      creditLimit: newCreditLimit,
      currency: "USD",
      status: "ACTIVE",
    });

    setIsAddModalOpen(false);
    setNewCustName("");
    setNewCustCode("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Customer Directory & 360° Commercial Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage international utility buyers, trading houses, power plant contractors, and credit exposure.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, code, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Customer Types</option>
            <option value="POWER_PLANT">Power Plant</option>
            <option value="TRADER">Trader</option>
            <option value="INDUSTRIAL">Industrial</option>
            <option value="END_USER">End User</option>
          </select>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const custContracts = contracts.filter((c) => c.customerId === cust.customerId);
          const totalContractedMT = custContracts.reduce((sum, c) => sum + c.contractQuantity, 0);

          return (
            <div
              key={cust.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {cust.customerCode}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                      {cust.customerName}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      cust.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {cust.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Type: <strong className="text-slate-800 dark:text-slate-200">{cust.customerType.replace("_", " ")}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Country: <strong className="text-slate-800 dark:text-slate-200">{cust.country}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Credit Limit: <strong className="text-emerald-600 dark:text-emerald-400">${(cust.creditLimit / 1000000).toFixed(1)}M USD</strong> ({cust.paymentTerms})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500">Active Contracts: </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{custContracts.length}</span>
                </div>
                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  360° Profile <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer 360 Modal Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto shadow-2xl space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {selectedCustomer.customerCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{selectedCustomer.customerType}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedCustomer.customerName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credit & Terms */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Approved Credit Limit</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  USD ${(selectedCustomer.creditLimit / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Payment Standard</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {selectedCustomer.paymentTerms}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact & Corporate Tax</h3>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <p><strong>Primary Officer:</strong> {selectedCustomer.contactPerson}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Tax ID (NPWP):</strong> {selectedCustomer.taxId}</p>
                <p><strong>Headquarters:</strong> {selectedCustomer.address}, {selectedCustomer.country}</p>
              </div>
            </div>

            {/* Associated Contracts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Active Contracts ({contracts.filter((c) => c.customerId === selectedCustomer.customerId).length})
              </h3>

              {contracts
                .filter((c) => c.customerId === selectedCustomer.customerId)
                .map((ctr) => (
                  <div
                    key={ctr.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{ctr.contractNumber}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ctr.contractQuantity.toLocaleString("id-ID")} MT</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${ctr.fulfillmentPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Incoterm: {ctr.incoterm} ({ctr.loadingPort})</span>
                      <span>Fulfillment: {ctr.fulfillmentPercent}%</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Key Customer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CUST-PLN-01"
                    value={newCustCode}
                    onChange={(e) => setNewCustCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Type</label>
                  <select
                    value={newCustType}
                    onChange={(e) => setNewCustType(e.target.value as CustomerType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="POWER_PLANT">Power Plant</option>
                    <option value="TRADER">Trader</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="END_USER">End User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT PLN Nusantara Power"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Approved Credit Limit (USD)</label>
                  <input
                    type="number"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
