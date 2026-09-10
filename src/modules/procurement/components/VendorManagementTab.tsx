// MINE SMART AI - Comprehensive Vendor Management Suite
// Modules: Vendor Database, Vendor Rating, Price History, Delivery Performance, Contracts

import React, { useState, useEffect } from "react";
import {
  Building2,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Truck,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Filter,
  BarChart3,
  Star,
  CheckSquare,
  Sparkles,
  Info,
  RefreshCw,
  Sliders
} from "lucide-react";
import {
  Vendor,
  VendorCategory,
  VendorHSEStatus,
  PriceHistoryRecord,
  DeliveryPerformanceRecord,
  ProcurementContract
} from "../../../types/procurementTypes";
import { procurementRepository } from "../../../services/repositories/ProcurementRepository";

interface VendorManagementTabProps {
  vendors: Vendor[];
  onSaveVendor: (vendor: Vendor) => void;
  contracts?: ProcurementContract[];
}

export type VendorSubTab =
  | "DATABASE"
  | "RATING"
  | "PRICE_HISTORY"
  | "DELIVERY_PERFORMANCE"
  | "CONTRACTS";

export const VendorManagementTab: React.FC<VendorManagementTabProps> = ({
  vendors,
  onSaveVendor,
  contracts: passedContracts,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<VendorSubTab>("DATABASE");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedVendorModal, setSelectedVendorModal] = useState<Vendor | null>(null);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  // Price History State
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<string>("ALL");
  const [selectedVendorForHistory, setSelectedVendorForHistory] = useState<string>("ALL");

  // Delivery Performance State
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryPerformanceRecord[]>([]);
  const [selectedVendorForDelivery, setSelectedVendorForDelivery] = useState<string>("ALL");

  // Contracts State
  const [contracts, setContracts] = useState<ProcurementContract[]>([]);

  // Add Vendor Form State
  const [newLegalName, setNewLegalName] = useState("");
  const [newTradeName, setNewTradeName] = useState("");
  const [newVendorType, setNewVendorType] = useState("Distributor Resmi OEM");
  const [newCategory, setNewCategory] = useState<VendorCategory>("Heavy Equipment Parts");
  const [newCity, setNewCity] = useState("Balikpapan");
  const [newProvince, setNewProvince] = useState("Kalimantan Timur");
  const [newPhone, setNewPhone] = useState("+62 542 ");
  const [newEmail, setNewEmail] = useState("");
  const [newTaxInfo, setNewTaxInfo] = useState("NPWP 01.xxx.xxx.x-xxx.000 (PKP Verified)");
  const [newBankInfo, setNewBankInfo] = useState("Bank Mandiri A/C ***** (Verified)");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Load Data for Price History, Delivery Performance, and Contracts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ph, dp, ctr] = await Promise.all([
          procurementRepository.getPriceHistory(),
          procurementRepository.getDeliveryPerformance(),
          procurementRepository.getContracts(),
        ]);
        setPriceHistory(ph);
        setDeliveryRecords(dp);
        setContracts(passedContracts && passedContracts.length > 0 ? passedContracts : ctr);
      } catch (err) {
        console.error("Error fetching vendor management sub-data:", err);
      }
    };
    fetchData();
  }, [passedContracts]);

  const formatIDR = (val: number) => {
    if (!val) return "Rp 0";
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    }
    if (val >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.tradeName && v.tradeName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === "ALL" || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredPriceHistory = priceHistory.filter((p) => {
    const matchItem = selectedItemForHistory === "ALL" || p.itemCode === selectedItemForHistory;
    const matchVendor = selectedVendorForHistory === "ALL" || p.vendorId === selectedVendorForHistory;
    return matchItem && matchVendor;
  });

  const filteredDelivery = deliveryRecords.filter((d) => {
    return selectedVendorForDelivery === "ALL" || d.vendorId === selectedVendorForDelivery;
  });

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLegalName.trim()) {
      alert("Nama legal PT/CV vendor wajib diisi!");
      return;
    }
    const codeNum = Math.floor(100 + Math.random() * 900);
    const newVendor: Vendor = {
      id: `vnd-${Date.now()}`,
      companyId: "comp-001",
      siteId: "site-001",
      vendorId: `vnd-${Date.now()}`,
      vendorCode: `VND-NEW-${codeNum}`,
      legalName: newLegalName,
      tradeName: newTradeName || newLegalName,
      vendorType: newVendorType,
      category: newCategory,
      address: `Kawasan Industri Kariangau KM 13, ${newCity}`,
      city: newCity,
      province: newProvince,
      country: "Indonesia",
      phone: newPhone,
      email: newEmail,
      taxInformation: newTaxInfo,
      bankInformationReference: newBankInfo,
      contactPersons: [
        {
          name: newContactName || "PIC Vendor",
          position: "Mining Account Lead",
          email: newEmail,
          phone: newContactPhone || newPhone,
          isPrimary: true,
        },
      ],
      status: "APPROVED",
      rating: 4.5,
      riskLevel: "LOW",
      hseComplianceStatus: "COMPLIANT",
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          documentType: "Business License",
          documentNumber: `NIB-2026-${codeNum}88`,
          issueDate: "2025-01-01",
          expiryDate: "2030-01-01",
          issuer: "OSS BKPM",
          verificationStatus: "VERIFIED",
        },
        {
          id: `doc-${Date.now()}-2`,
          documentType: "HSE Document",
          documentNumber: `CSMS-MINING-2026-${codeNum}`,
          issueDate: "2026-01-01",
          expiryDate: "2028-01-01",
          issuer: "HSE Dept Minerba",
          verificationStatus: "VERIFIED",
        },
      ],
      performanceMetrics: {
        onTimeDeliveryRate: 95.0,
        qualityAcceptanceRate: 99.0,
        averageLeadTimeDays: 7,
        priceCompetitivenessScore: 90.0,
      },
      tags: ["New Onboarded", "Verified PKP"],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    onSaveVendor(newVendor);
    setIsAddVendorOpen(false);
    setNewLegalName("");
    setNewTradeName("");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab("DATABASE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "DATABASE"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" /> Vendor Database ({vendors.length})
          </button>

          <button
            onClick={() => setActiveSubTab("RATING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "RATING"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" /> Vendor Rating & Scorecard
          </button>

          <button
            onClick={() => setActiveSubTab("PRICE_HISTORY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "PRICE_HISTORY"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Price History & Trends
          </button>

          <button
            onClick={() => setActiveSubTab("DELIVERY_PERFORMANCE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "DELIVERY_PERFORMANCE"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4" /> Delivery Performance
          </button>

          <button
            onClick={() => setActiveSubTab("CONTRACTS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "CONTRACTS"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" /> Contracts & LTA ({contracts.length})
          </button>
        </div>

        {activeSubTab === "DATABASE" && (
          <button
            onClick={() => setIsAddVendorOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Rekanan Vendor
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. VENDOR DATABASE SUB-TAB */}
      {/* ========================================================= */}
      {activeSubTab === "DATABASE" && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Rekanan Vendor (Nama PT, Kode Vendor, NPWP, Kota)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none font-medium"
            >
              <option value="ALL">Semua Kategori Suplai</option>
              <option value="Heavy Equipment Parts">Heavy Equipment Parts</option>
              <option value="Fuel">Fuel / BBM Industri</option>
              <option value="Tyres">OTR Tyres</option>
              <option value="Mining Supplies">Mining Supplies & Fab</option>
              <option value="Lubricants">Lubricants & Grease</option>
              <option value="PPE">PPE / HSE Safety</option>
            </select>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => {
              const metrics = vendor.performanceMetrics || {
                onTimeDeliveryRate: 94.0,
                qualityAcceptanceRate: 98.0,
                averageLeadTimeDays: 7,
                priceCompetitivenessScore: 88.0,
              };

              return (
                <div
                  key={vendor.vendorId}
                  className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 space-y-3 hover:border-amber-500/50 transition shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header Info */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {vendor.vendorCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            vendor.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-0.5 line-clamp-1">
                      {vendor.legalName}
                    </h3>
                    <div className="text-xs text-slate-400 mb-3">
                      {vendor.tradeName && vendor.tradeName !== vendor.legalName
                        ? `${vendor.tradeName} • `
                        : ""}
                      <span className="text-amber-300 font-medium">{vendor.category}</span>
                    </div>

                    {/* Contact & Location snippet */}
                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {vendor.city}, {vendor.province}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{vendor.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="pt-3 border-t border-slate-700/60 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Overall Rating</span>
                        <div className="font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendor.rating.toFixed(1)} / 5.0
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">OTD Delivery</span>
                        <div className="font-black text-emerald-400 mt-0.5">
                          {metrics.onTimeDeliveryRate}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">CSMS HSE Compliance:</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> {vendor.hseComplianceStatus}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedVendorModal(vendor)}
                      className="w-full mt-2 py-2 bg-slate-700/80 hover:bg-slate-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-400" /> Profil Lengkap & Dokumen CSMS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VENDOR RATING & SCORECARD SUB-TAB */}
      {/* ========================================================= */}
      {activeSubTab === "RATING" && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Vendor Performance Rating & Scorecard Framework
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluasi kinerja multi-dimensi (Kualitas 35%, On-Time Delivery 30%, Kompetitif Harga 20%, K3/CSMS 15%)
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
                Evaluation Cycle Q3 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Tier 1 Strategic Partners</span>
                <div className="text-2xl font-black text-amber-400">
                  {vendors.filter((v) => v.rating >= 4.7).length} Rekanan
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Rating &gt;= 4.7 ★</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Preferred Suppliers</span>
                <div className="text-2xl font-black text-blue-400">
                  {vendors.filter((v) => v.rating >= 4.3 && v.rating < 4.7).length} Rekanan
                </div>
                <span className="text-[11px] text-blue-300 font-medium">Rating 4.3 - 4.6 ★</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Rerata Nilai OTD</span>
                <div className="text-2xl font-black text-emerald-400">95.2%</div>
                <span className="text-[11px] text-slate-400 font-medium">Target Min: 90%</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Tingkat Penerimaan QC</span>
                <div className="text-2xl font-black text-purple-400">98.8%</div>
                <span className="text-[11px] text-purple-300 font-medium">Rejection Rate &lt; 1.2%</span>
              </div>
            </div>

            {/* Scorecard Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Vendor Partner</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5 text-center">Quality Score (35%)</th>
                    <th className="p-3.5 text-center">OTD Score (30%)</th>
                    <th className="p-3.5 text-center">Price Index (20%)</th>
                    <th className="p-3.5 text-center">HSE CSMS (15%)</th>
                    <th className="p-3.5 text-center">Final Score</th>
                    <th className="p-3.5 text-center">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {vendors.map((v) => {
                    const metrics = v.performanceMetrics || {
                      onTimeDeliveryRate: 94.0,
                      qualityAcceptanceRate: 98.0,
                      averageLeadTimeDays: 7,
                      priceCompetitivenessScore: 88.0,
                    };
                    const qualityScore = metrics.qualityAcceptanceRate;
                    const otdScore = metrics.onTimeDeliveryRate;
                    const priceScore = metrics.priceCompetitivenessScore;
                    const hseScore = v.hseComplianceStatus === "COMPLIANT" ? 100 : 70;
                    const composite =
                      qualityScore * 0.35 +
                      otdScore * 0.3 +
                      priceScore * 0.2 +
                      hseScore * 0.15;

                    return (
                      <tr key={v.vendorId} className="hover:bg-slate-700/30 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{v.legalName}</div>
                          <div className="text-[11px] text-amber-400 font-mono">{v.vendorCode}</div>
                        </td>
                        <td className="p-3.5 text-slate-300">{v.category}</td>
                        <td className="p-3.5 text-center font-bold text-purple-300">
                          {qualityScore.toFixed(1)}%
                        </td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">
                          {otdScore.toFixed(1)}%
                        </td>
                        <td className="p-3.5 text-center font-bold text-blue-300">
                          {priceScore.toFixed(1)} / 100
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {hseScore}% Compliant
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="text-sm font-black text-amber-400">
                            ★ {v.rating.toFixed(1)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {composite.toFixed(1)} Pts
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          {v.rating >= 4.7 ? (
                            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-black tracking-wide">
                              TIER 1 STRATEGIC
                            </span>
                          ) : v.rating >= 4.3 ? (
                            <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold">
                              PREFERRED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium">
                              STANDARD
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PRICE HISTORY & BENCHMARKING SUB-TAB */}
      {/* ========================================================= */}
      {activeSubTab === "PRICE_HISTORY" && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Historical Price Tracking & Item Price History
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit fluktuasi harga beli suku cadang, pelumas & komoditas antar vendor dan siklus PO
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedItemForHistory}
                  onChange={(e) => setSelectedItemForHistory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-300 px-3 py-1.5 focus:outline-none font-medium"
                >
                  <option value="ALL">Semua Item Suku Cadang</option>
                  <option value="FLT-HYD-EX1250">Hydraulic Filter PC1250</option>
                  <option value="KIT-OVH-CUMMINS">Overhaul Kit QSK19</option>
                  <option value="TYR-OTR-27R49">OTR Tyre 27.00R49</option>
                  <option value="FUL-SOL-B35">Bio Solar B35</option>
                  <option value="OIL-15W40-DRUM">Engine Oil 15W-40</option>
                </select>

                <select
                  value={selectedVendorForHistory}
                  onChange={(e) => setSelectedVendorForHistory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none font-medium"
                >
                  <option value="ALL">Semua Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.vendorId} value={v.vendorId}>
                      {v.legalName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Historical Price Records Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Kode & Nama Item</th>
                    <th className="p-3.5">Vendor Pemasok</th>
                    <th className="p-3.5">No. PO & Tanggal</th>
                    <th className="p-3.5 text-center">Kuantitas</th>
                    <th className="p-3.5 text-right">Harga Satuan (IDR)</th>
                    <th className="p-3.5 text-center">Variansi vs Baseline</th>
                    <th className="p-3.5">Catatan Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {filteredPriceHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{rec.itemName}</div>
                        <div className="text-[11px] text-amber-400 font-mono">{rec.itemCode}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-200">{rec.vendorName}</td>
                      <td className="p-3.5">
                        <div className="font-mono text-slate-200">{rec.poNumber}</div>
                        <div className="text-[11px] text-slate-400">{rec.poDate}</div>
                      </td>
                      <td className="p-3.5 text-center font-bold">
                        {rec.quantity.toLocaleString("id-ID")} {rec.unit}
                      </td>
                      <td className="p-3.5 text-right font-black text-amber-300">
                        {formatIDR(rec.unitPrice)}
                      </td>
                      <td className="p-3.5 text-center">
                        {rec.priceVariancePct !== undefined && rec.priceVariancePct < 0 ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold">
                            {rec.priceVariancePct}% (Diskon)
                          </span>
                        ) : rec.priceVariancePct !== undefined && rec.priceVariancePct > 0 ? (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-bold">
                            +{rec.priceVariancePct}% (Kenaikan)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px]">
                            0.0% (Stabil)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px] italic">
                        {rec.notes || "Standard procurement batch"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Stability Summary Callout */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">
                  Total penghematan kumulatif melalui negosiasi harga dan LTA kontrak:{" "}
                  <strong className="text-emerald-400">Rp 44.000.000 (Savings Rate 3.3%)</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Index MOPS & OEM Terverifikasi</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DELIVERY PERFORMANCE SUB-TAB */}
      {/* ========================================================= */}
      {activeSubTab === "DELIVERY_PERFORMANCE" && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" /> Vendor Delivery Performance & Lead Time SLA
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pelacakan ketepatan waktu pengiriman (Promised vs Actual Lead Time) dan audit kecacatan fisik
                </p>
              </div>

              <select
                value={selectedVendorForDelivery}
                onChange={(e) => setSelectedVendorForDelivery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none font-medium"
              >
                <option value="ALL">Semua Vendor</option>
                {vendors.map((v) => (
                  <option key={v.vendorId} value={v.vendorId}>
                    {v.legalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Performance Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Vendor Pemasok</th>
                    <th className="p-3.5">PO & Goods Receipt</th>
                    <th className="p-3.5 text-center">Jadwal Estimasi</th>
                    <th className="p-3.5 text-center">Realisasi Tiba</th>
                    <th className="p-3.5 text-center">Lead Time (Janji vs Aktual)</th>
                    <th className="p-3.5 text-center">Status On-Time</th>
                    <th className="p-3.5 text-center">QC Accepted / Rejected</th>
                    <th className="p-3.5">Catatan Logistik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {filteredDelivery.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3.5 font-bold text-white">{item.vendorName}</td>
                      <td className="p-3.5">
                        <div className="font-mono text-amber-400 font-semibold">{item.poNumber}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.receiptNumber}</div>
                      </td>
                      <td className="p-3.5 text-center text-slate-300">{item.expectedDate}</td>
                      <td className="p-3.5 text-center font-semibold text-white">{item.actualDate}</td>
                      <td className="p-3.5 text-center">
                        <div className="font-bold text-slate-200">
                          {item.leadTimeDaysActual} Hari
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Target: {item.leadTimeDaysPromised} Hari
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        {item.onTimeStatus === "EARLY" ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            LEBIH CEPAT ({Math.abs(item.varianceDays)} HARI)
                          </span>
                        ) : item.onTimeStatus === "ON_TIME" ? (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">
                            ON-TIME
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold">
                            TERLAMBAT (+{item.varianceDays} HARI)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="text-emerald-400 font-bold">
                          {item.acceptedQty.toLocaleString("id-ID")} OK
                        </span>
                        {item.rejectedQty > 0 && (
                          <span className="text-rose-400 font-bold ml-1">
                            / {item.rejectedQty} Reject
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-400">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CONTRACTS & AGREEMENTS SUB-TAB */}
      {/* ========================================================= */}
      {activeSubTab === "CONTRACTS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((contract) => {
              const utilized = contract.utilizedValue || 0;
              const remaining = Math.max(0, contract.value - utilized);
              const percentageUtilized = Math.min(100, Math.round((utilized / contract.value) * 100));

              return (
                <div
                  key={contract.contractId}
                  className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-400">
                          {contract.contractNumber}
                        </span>
                        {contract.contractType && (
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 rounded text-[10px] font-semibold">
                            {contract.contractType.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          contract.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : contract.status === "EXPIRING_SOON"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {contract.status === "EXPIRING_SOON" ? "SEGERA BERAKHIR" : contract.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{contract.vendorName}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{contract.scope}</p>

                    {/* Spend Burn-down Progress */}
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Pagu Nilai Kontrak:</span>
                        <span className="font-bold text-amber-300">{formatIDR(contract.value)}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentageUtilized > 85
                              ? "bg-rose-500"
                              : percentageUtilized > 60
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${percentageUtilized}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Terealisasi: <strong className="text-slate-200">{formatIDR(utilized)}</strong> ({percentageUtilized}%)
                        </span>
                        <span className="text-slate-400">
                          Sisa: <strong className="text-emerald-400">{formatIDR(remaining)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Periode Berlaku:</span>
                      <span className="font-semibold text-slate-200">
                        {contract.startDate} s/d {contract.endDate}
                      </span>
                    </div>
                    {contract.paymentTerms && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Termin Pembayaran:</span>
                        <span className="text-slate-300 font-medium">{contract.paymentTerms}</span>
                      </div>
                    )}
                    {contract.slaTerms && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        <strong className="text-amber-400">SLA:</strong> {contract.slaTerms}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VENDOR DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedVendorModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {selectedVendorModal.vendorCode}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedVendorModal.legalName}</h3>
                <div className="text-xs text-slate-400">
                  {selectedVendorModal.vendorType} • {selectedVendorModal.category}
                </div>
              </div>
              <button
                onClick={() => setSelectedVendorModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Legal & Banking Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div>
                <span className="text-slate-400 block mb-0.5">NPWP & Status Pajak:</span>
                <strong className="text-white">{selectedVendorModal.taxInformation || "Verified PKP"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Rekening Bank Terdaftar:</span>
                <strong className="text-white">{selectedVendorModal.bankInformationReference || "Verified Mandiri"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Alamat Kantor / Depot:</span>
                <span className="text-slate-200">{selectedVendorModal.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Kontak Person (PIC):</span>
                <span className="text-slate-200">
                  {selectedVendorModal.contactPersons[0]?.name} (
                  {selectedVendorModal.contactPersons[0]?.phone})
                </span>
              </div>
            </div>

            {/* Documents Vault */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dokumen Legal, Perizinan Minerba & CSMS
              </h4>
              <div className="space-y-2">
                {selectedVendorModal.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{doc.documentType}</div>
                      <div className="text-[11px] text-slate-400">
                        No: {doc.documentNumber} | Penerbit: {doc.issuer}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/30">
                        {doc.verificationStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Berlaku s/d: {doc.expiryDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedVendorModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD NEW VENDOR MODAL */}
      {/* ========================================================= */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Registrasi & Onboarding Vendor Baru
              </h3>
              <button
                onClick={() => setIsAddVendorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Legal PT / CV Vendor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT United Tractors Tbk"
                  value={newLegalName}
                  onChange={(e) => setNewLegalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Suplai</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Heavy Equipment Parts">Heavy Equipment Parts</option>
                    <option value="Fuel">Fuel / BBM Industri</option>
                    <option value="Tyres">OTR Tyres</option>
                    <option value="Mining Supplies">Mining Supplies & Fab</option>
                    <option value="Lubricants">Lubricants & Grease</option>
                    <option value="PPE">PPE / Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Rekanan</label>
                  <input
                    type="text"
                    value={newVendorType}
                    onChange={(e) => setNewVendorType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kota Depot / Warehouse</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Telepon Kantor</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Resmi</label>
                  <input
                    type="email"
                    placeholder="sales.mining@vendor.co.id"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama PIC Vendor</label>
                  <input
                    type="text"
                    placeholder="Nama PIC Sales / Support"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. HP / WA PIC</label>
                  <input
                    type="text"
                    placeholder="+62 812 xxxx xxxx"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl shadow transition cursor-pointer"
                >
                  Simpan & Daftarkan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
