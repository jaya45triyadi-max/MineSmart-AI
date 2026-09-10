import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Flame,
  ShoppingBag,
  Boxes,
  Ship,
  Anchor,
  Globe,
  FileCheck,
  DollarSign,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Bot,
  LayoutDashboard,
  Scale,
} from "lucide-react";

import { OverviewTab } from "./components/OverviewTab";
import { CustomersTab } from "./components/CustomersTab";
import { ContractsTab } from "./components/ContractsTab";
import { CoalProductsTab } from "./components/CoalProductsTab";
import { SalesOrdersTab } from "./components/SalesOrdersTab";
import { StockAllocationsTab } from "./components/StockAllocationsTab";
import { ShipmentsTab } from "./components/ShipmentsTab";
import { VesselsTab } from "./components/VesselsTab";
import { DestinationsTab } from "./components/DestinationsTab";
import { DeliveryTab } from "./components/DeliveryTab";
import { RevenueTab } from "./components/RevenueTab";
import { QualityComplianceTab } from "./components/QualityComplianceTab";
import { SalesForecastTab } from "./components/SalesForecastTab";
import { AlertsCenterTab } from "./components/AlertsCenterTab";
import { CommercialReportsTab } from "./components/CommercialReportsTab";
import { AISalesInsightTab } from "./components/AISalesInsightTab";
import { QuantityMonitoringTab } from "./components/QuantityMonitoringTab";

import {
  MOCK_CUSTOMERS,
  MOCK_SALES_CONTRACTS,
  MOCK_COAL_PRODUCTS,
  MOCK_SALES_ORDERS,
  MOCK_SALES_ALLOCATIONS,
  MOCK_SHIPMENTS,
  MOCK_VESSELS,
  MOCK_DESTINATIONS,
  MOCK_DELIVERIES,
  MOCK_SALES_REVENUE,
  MOCK_SALES_FORECAST,
  MOCK_AI_SALES_INSIGHTS,
  MOCK_SALES_REPORTS,
  MOCK_QUANTITY_MASS_BALANCES,
} from "../../data/salesData";

import {
  Customer,
  SalesContract,
  SalesOrder,
  SalesAllocation,
  Shipment,
  DeliveryRecord,
  SalesOrderStatus,
  ShipmentStatus,
} from "../../types/salesTypes";

interface SalesModuleProps {
  onOpenAICopilot?: () => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({ onOpenAICopilot }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Local State
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [contracts, setContracts] = useState<SalesContract[]>(MOCK_SALES_CONTRACTS);
  const [coalProducts] = useState(MOCK_COAL_PRODUCTS);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(MOCK_SALES_ORDERS);
  const [allocations, setAllocations] = useState<SalesAllocation[]>(MOCK_SALES_ALLOCATIONS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [vessels] = useState(MOCK_VESSELS);
  const [destinations] = useState(MOCK_DESTINATIONS);
  const [deliveries] = useState<DeliveryRecord[]>(MOCK_DELIVERIES);
  const [revenues] = useState(MOCK_SALES_REVENUE);
  const [forecast] = useState(MOCK_SALES_FORECAST);
  const [aiInsights] = useState(MOCK_AI_SALES_INSIGHTS);
  const [reports] = useState(MOCK_SALES_REPORTS);

  // Handlers
  const handleAddCustomer = (newCust: Partial<Customer>) => {
    const created: Customer = {
      id: `CUST-${Math.floor(Math.random() * 900 + 100)}`,
      customerId: `CUST-${Math.floor(Math.random() * 900 + 100)}`,
      companyId: "BBNU-01",
      customerCode: newCust.customerCode || "CUST-NEW",
      customerName: newCust.customerName || "New Customer",
      customerType: newCust.customerType || "POWER_PLANT",
      country: newCust.country || "Indonesia",
      address: newCust.address || "Headquarters",
      contactPerson: newCust.contactPerson || "Manager",
      email: newCust.email || "info@customer.com",
      phone: newCust.phone || "+62 21 0000 0000",
      taxId: newCust.taxId || "01.000.000.0-000.000",
      paymentTerms: newCust.paymentTerms || "L/C 30 Days",
      creditLimit: newCust.creditLimit || 10000000,
      currency: "USD",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomers([created, ...customers]);
  };

  const handleAddContract = (newCtr: Partial<SalesContract>) => {
    const created: SalesContract = {
      id: `CTR-${Math.floor(Math.random() * 900 + 100)}`,
      contractId: `CTR-${Math.floor(Math.random() * 900 + 100)}`,
      companyId: "BBNU-01",
      customerId: "CUST-001",
      customerName: newCtr.customerName || "PT PLN Nusantara Power",
      contractNumber: newCtr.contractNumber || `CTR-2026-${Math.floor(Math.random() * 900 + 100)}`,
      contractType: newCtr.contractType || "LONG_TERM",
      productId: "PRD-COAL-5800",
      productName: newCtr.productName || "BNU Premium GAR 5800 Coal",
      coalSpecificationId: "SPEC-GAR5800-PREMIUM",
      specName: "Premium GAR 5800 Export Grade",
      contractQuantity: newCtr.contractQuantity || 100000,
      quantityUnit: "MT",
      price: newCtr.price || 88.5,
      priceUnit: "USD/MT",
      currency: "USD",
      pricingBasis: newCtr.pricingBasis || "FORMULA_BASED",
      incoterm: newCtr.incoterm || "FOB",
      loadingPort: newCtr.loadingPort || "Sangatta Coal Terminal",
      destination: newCtr.destination || "Port of Rembang",
      startDate: newCtr.startDate || "2026-01-01",
      endDate: newCtr.endDate || "2026-12-31",
      paymentTerms: newCtr.paymentTerms || "L/C 30 Days",
      qualityTerms: newCtr.qualityTerms || "GAR 5800 kcal/kg min 5700",
      penaltyTerms: newCtr.penaltyTerms || "USD 1.50/MT per 100 kcal deficit",
      status: "ACTIVE",
      allocatedQuantity: 0,
      scheduledQuantity: 0,
      shippedQuantity: 0,
      deliveredQuantity: 0,
      remainingQuantity: newCtr.contractQuantity || 100000,
      fulfillmentPercent: 0,
      createdBy: "Commercial Manager",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContracts([created, ...contracts]);
  };

  const handleAddSalesOrder = (newOrder: Partial<SalesOrder>) => {
    const created: SalesOrder = {
      id: `SO-${Math.floor(Math.random() * 900 + 100)}`,
      salesOrderId: `SO-${Math.floor(Math.random() * 900 + 100)}`,
      companyId: "BBNU-01",
      orderNumber: newOrder.orderNumber || `SO-2026-0815-${Math.floor(Math.random() * 90 + 10)}`,
      customerId: newOrder.customerId || "CUST-001",
      customerName: newOrder.customerName || "PT PLN Nusantara Power",
      contractId: newOrder.contractId || "CTR-001",
      contractNumber: newOrder.contractNumber || "CTR-2026-PLN-088",
      productId: newOrder.productId || "PRD-COAL-5800",
      productName: newOrder.productName || "BNU Premium GAR 5800 Coal",
      quantity: newOrder.quantity || 8500,
      unit: "MT",
      price: newOrder.price || 88.5,
      currency: "USD",
      qualitySpecificationId: "SPEC-GAR5800-PREMIUM",
      requestedShipmentDate: newOrder.requestedShipmentDate || "2026-08-20",
      destinationId: "DEST-REMBANG",
      destinationName: newOrder.destinationName || "Port of Rembang",
      priority: newOrder.priority || "HIGH",
      status: "CONFIRMED",
      createdBy: "Sales Officer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSalesOrders([created, ...salesOrders]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: SalesOrderStatus) => {
    setSalesOrders(
      salesOrders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const handleConfirmAllocation = (allocationId: string) => {
    setAllocations(
      allocations.map((a) =>
        a.id === allocationId ? { ...a, status: "CONFIRMED", updatedAt: new Date().toISOString() } : a
      )
    );
  };

  const handleUpdateShipmentStatus = (shipmentId: string, status: ShipmentStatus) => {
    setShipments(
      shipments.map((s) => (s.id === shipmentId ? { ...s, status, updatedAt: new Date().toISOString() } : s))
    );
  };

  const handleToggleQualityHold = (shipmentId: string, hold: boolean, reason?: string) => {
    setShipments(
      shipments.map((s) =>
        s.id === shipmentId
          ? {
              ...s,
              isQualityHold: hold,
              holdReason: reason,
              qualityStatus: hold ? "NON_COMPLIANT" : "COMPLIANT",
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  };

  const subNavTabs = [
    { key: "overview", label: "Overview & Pipeline", icon: LayoutDashboard },
    { key: "customers", label: "1. Customer", icon: Users },
    { key: "contracts", label: "2. Contract", icon: FileText },
    { key: "products", label: "3. Coal Specification", icon: Flame },
    { key: "quantity", label: "4. Quantity (Mass Balance)", icon: Scale },
    { key: "shipments", label: "5. Shipment", icon: Ship },
    { key: "vessels", label: "6. Vessel", icon: Anchor },
    { key: "destinations", label: "7. Destination", icon: Globe },
    { key: "revenue", label: "8. Price & Revenue", icon: DollarSign },
    { key: "orders", label: "Sales Orders", icon: ShoppingBag },
    { key: "allocations", label: "Stock Allocations", icon: Boxes },
    { key: "delivery", label: "Delivery & POD", icon: FileCheck },
    { key: "quality-compliance", label: "Quality Compliance", icon: ShieldAlert },
    { key: "forecast", label: "Sales Forecast", icon: TrendingUp },
    { key: "alerts", label: "Alerts Center", icon: AlertTriangle },
    { key: "reports", label: "Commercial Reports", icon: FileSpreadsheet },
    { key: "ai-insight", label: "AI Commercial Engine", icon: Sparkles, badge: "AI" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Module Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {subNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-emerald-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-slate-950 text-emerald-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Render */}
      {activeTab === "overview" && (
        <OverviewTab
          customers={customers}
          contracts={contracts}
          salesOrders={salesOrders}
          shipments={shipments}
          revenues={revenues}
          aiInsights={aiInsights}
          onSelectSubTab={(tabKey) => setActiveTab(tabKey)}
        />
      )}

      {activeTab === "customers" && (
        <CustomersTab
          customers={customers}
          contracts={contracts}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {activeTab === "contracts" && (
        <ContractsTab
          contracts={contracts}
          onAddContract={handleAddContract}
        />
      )}

      {activeTab === "products" && <CoalProductsTab products={coalProducts} />}

      {activeTab === "quantity" && <QuantityMonitoringTab records={MOCK_QUANTITY_MASS_BALANCES} />}

      {activeTab === "orders" && (
        <SalesOrdersTab
          salesOrders={salesOrders}
          contracts={contracts}
          onAddSalesOrder={handleAddSalesOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {activeTab === "allocations" && (
        <StockAllocationsTab
          allocations={allocations}
          onConfirmAllocation={handleConfirmAllocation}
        />
      )}

      {activeTab === "shipments" && (
        <ShipmentsTab
          shipments={shipments}
          onAddShipment={() => {}}
          onUpdateShipmentStatus={handleUpdateShipmentStatus}
        />
      )}

      {activeTab === "vessels" && <VesselsTab vessels={vessels} />}

      {activeTab === "destinations" && <DestinationsTab destinations={destinations} />}

      {activeTab === "delivery" && <DeliveryTab deliveries={deliveries} />}

      {activeTab === "revenue" && <RevenueTab revenues={revenues} />}

      {activeTab === "quality-compliance" && (
        <QualityComplianceTab
          shipments={shipments}
          onToggleQualityHold={handleToggleQualityHold}
        />
      )}

      {activeTab === "forecast" && <SalesForecastTab forecast={forecast} />}

      {activeTab === "alerts" && <AlertsCenterTab />}

      {activeTab === "reports" && <CommercialReportsTab reports={reports} />}

      {activeTab === "ai-insight" && <AISalesInsightTab insights={aiInsights} />}
    </div>
  );
};

export default SalesModule;
