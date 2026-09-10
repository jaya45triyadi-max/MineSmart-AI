// MINE SMART AI - Purchase Requests Tab

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Trash2,
  Building2,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Send
} from "lucide-react";
import { PurchaseRequest, PurchaseRequestItem, PRPriority, PRStatus, VendorCategory } from "../../../types/procurementTypes";

interface PurchaseRequestsTabProps {
  prs: PurchaseRequest[];
  onCreatePR: (pr: PurchaseRequest) => void;
  onApprovePR: (prId: string, comment?: string) => void;
}

export const PurchaseRequestsTab: React.FC<PurchaseRequestsTabProps> = ({
  prs,
  onCreatePR,
  onApprovePR,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPRModal, setSelectedPRModal] = useState<PurchaseRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New PR Form State
  const [prNumber] = useState(`PR-2026-0814-${Math.floor(10 + Math.random() * 90)}`);
  const [purpose, setPurpose] = useState("");
  const [priority, setPriority] = useState<PRPriority>("NORMAL");
  const [category, setCategory] = useState<VendorCategory>("Heavy Equipment Parts");
  const [requiredDate, setRequiredDate] = useState("2026-08-30");
  const [budgetCode, setBudgetCode] = useState("OPEX-MAINT-2026-Q3");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<Array<Partial<PurchaseRequestItem>>>([
    {
      itemId: "item-new-1",
      itemCode: "FLT-AIR-EX2000",
      itemName: "Air Outer Filter Element Excavator EX2000",
      description: "Air filter outer heavy duty mining spec",
      category: "Heavy Equipment Parts",
      quantity: 6,
      unit: "PCS",
      estimatedUnitPrice: 8500000,
      estimatedTotal: 51000000,
      requiredDate: "2026-08-30"
    }
  ]);

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + ((curr.quantity || 0) * (curr.estimatedUnitPrice || 0)), 0);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        itemId: `item-new-${items.length + 1}`,
        itemCode: "",
        itemName: "",
        description: "",
        category,
        quantity: 1,
        unit: "PCS",
        estimatedUnitPrice: 0,
        estimatedTotal: 0,
        requiredDate
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...items];
    const target = { ...updated[index], [field]: val };
    if (field === "quantity" || field === "estimatedUnitPrice") {
      const q = field === "quantity" ? Number(val) : Number(target.quantity || 0);
      const p = field === "estimatedUnitPrice" ? Number(val) : Number(target.estimatedUnitPrice || 0);
      target.estimatedTotal = q * p;
    }
    updated[index] = target;
    setItems(updated);
  };

  const handleSubmitNewPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      alert("Harap isi tujuan pengadaan PR!");
      return;
    }

    const estimatedValue = calculateTotal();
    const newPR: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      prId: `pr-${Date.now()}`,
      prNumber,
      companyId: "comp-001",
      siteId: "site-001",
      departmentId: "dept-maint",
      departmentName: "Plant Maintenance Site Lati",
      requesterId: "user-curr",
      requesterName: "Jaya Triyadi (Mining Engineer)",
      requestDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      requiredDate,
      priority,
      purpose,
      category,
      budgetId: "bg-2026-01",
      budgetCode,
      status: "SUBMITTED",
      approvalStatus: "PENDING_SUPERVISOR",
      estimatedValue,
      currency: "IDR",
      notes,
      items: items.map((it, idx) => ({
        itemId: it.itemId || `item-${idx}`,
        prId: `pr-${Date.now()}`,
        itemCode: it.itemCode || `ITEM-${idx}`,
        itemName: it.itemName || "Item Name",
        description: it.description || "",
        category: it.category || category,
        quantity: Number(it.quantity) || 1,
        unit: it.unit || "PCS",
        estimatedUnitPrice: Number(it.estimatedUnitPrice) || 0,
        estimatedTotal: (Number(it.quantity) || 1) * (Number(it.estimatedUnitPrice) || 0),
        requiredDate
      })),
      approvalChain: [
        { step: 1, role: "Supervisor", name: "Agus Pratama", status: "PENDING" },
        { step: 2, role: "Department Manager", name: "Ir. Hendra Wijaya", status: "PENDING" },
        { step: 3, role: "Finance Manager", name: "Rina Kusuma", status: "PENDING" }
      ],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    onCreatePR(newPR);
    setIsCreateOpen(false);
  };

  const filteredPRs = prs.filter((p) => {
    const matchesSearch =
      p.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === "ALL" || p.priority === selectedPriority;
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Management Purchase Request (PR)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengajuan kebutuhan barang/jasa tambang, verifikasi budget & alur persetujuan
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 text-sm"
        >
          <Plus className="w-4 h-4" /> Buat PR Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari PR No, Tujuan, Pemohon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* PR Table / List */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3.5">PR Number & Date</th>
                <th className="p-3.5">Departemen & Pemohon</th>
                <th className="p-3.5">Tujuan & Kategori</th>
                <th className="p-3.5">Prioritas</th>
                <th className="p-3.5 text-right">Estimasi Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredPRs.map((pr) => (
                <tr key={pr.prId} className="hover:bg-slate-700/30 transition">
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-amber-400">{pr.prNumber}</div>
                    <div className="text-[10px] text-slate-400">{pr.requestDate.substring(0, 10)}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-white">{pr.departmentName}</div>
                    <div className="text-[11px] text-slate-400">{pr.requesterName}</div>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-medium text-slate-200 truncate">{pr.purpose}</div>
                    <div className="text-[10px] text-slate-400">{pr.category} • Budget: {pr.budgetCode || "N/A"}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pr.priority === "URGENT" || pr.priority === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : pr.priority === "HIGH"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300"
                    }`}>
                      {pr.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-amber-300">
                    {formatIDR(pr.estimatedValue)}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      pr.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : pr.status === "REJECTED"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {pr.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedPRModal(pr)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-[11px] transition"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail PR Modal */}
      {selectedPRModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">{selectedPRModal.prNumber}</span>
                <h3 className="text-lg font-bold text-white">Purchase Request Detail</h3>
              </div>
              <button onClick={() => setSelectedPRModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div>
                <span className="text-slate-400">Pemohon:</span> <span className="font-semibold text-white">{selectedPRModal.requesterName}</span>
              </div>
              <div>
                <span className="text-slate-400">Departemen:</span> <span className="font-semibold text-white">{selectedPRModal.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400">Target Required:</span> <span className="font-semibold text-white">{selectedPRModal.requiredDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Prioritas:</span> <span className="font-semibold text-amber-400">{selectedPRModal.priority}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Tujuan Pengadaan:</span> <p className="font-medium text-slate-200 mt-0.5">{selectedPRModal.purpose}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Item Kebutuhan PR</h4>
              <div className="bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-2.5">Item Code & Name</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {selectedPRModal.items.map((it) => (
                      <tr key={it.itemId}>
                        <td className="p-2.5">
                          <div className="font-mono font-bold text-amber-400">{it.itemCode}</div>
                          <div>{it.itemName}</div>
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.quantity} {it.unit}</td>
                        <td className="p-2.5 text-right">{formatIDR(it.estimatedUnitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-amber-300">{formatIDR(it.estimatedTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs font-bold px-2">
                <span className="text-slate-400">Total Estimasi PR:</span>
                <span className="text-lg text-amber-400">{formatIDR(selectedPRModal.estimatedValue)}</span>
              </div>
            </div>

            {/* Approval Chain */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Status Persetujuan Workflow</h4>
              <div className="space-y-2">
                {selectedPRModal.approvalChain?.map((app, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-800/40 rounded-lg">
                    <span className="text-slate-300 font-medium">{app.role}: <strong className="text-white">{app.name || "Pending"}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedPRModal.status === "SUBMITTED" || selectedPRModal.status === "UNDER_REVIEW" ? (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    onApprovePR(selectedPRModal.prId, "Approved via PR Detail View");
                    setSelectedPRModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Approve PR
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Create PR Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitNewPR} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Form Buat Purchase Request Baru
              </h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">PR Number (Auto)</label>
                <input type="text" readOnly value={prNumber} className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-amber-400" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Prioritas Pengadaan</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as PRPriority)} className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200">
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Target Tanggal Dibutuhkan</label>
                <input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Tujuan / Justifikasi Pengadaan *</label>
              <textarea required rows={2} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Contoh: Pengadaan filter oli & hydraulic overhaul Excavator EX-01..." className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>

            {/* Item Builder */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Detail Item Barang / Jasa</h4>
                <button type="button" onClick={handleAddItem} className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Tambah Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Kode Item</label>
                        <input type="text" value={it.itemCode} onChange={(e) => handleItemChange(idx, "itemCode", e.target.value)} placeholder="FLT-001" className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] text-slate-400">Nama Barang / Deskripsi Spec</label>
                        <input type="text" value={it.itemName} onChange={(e) => handleItemChange(idx, "itemName", e.target.value)} placeholder="Hydraulic Filter Element" className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200" />
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="w-20">
                          <label className="text-[10px] text-slate-400">Satuan</label>
                          <input type="text" value={it.unit} onChange={(e) => handleItemChange(idx, "unit", e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200" />
                        </div>
                        {items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(idx)} className="p-1.5 text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Jumlah (Qty)</label>
                        <input type="number" min={1} value={it.quantity} onChange={(e) => handleItemChange(idx, "quantity", e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Estimasi Harga Satuan (IDR)</label>
                        <input type="number" min={0} value={it.estimatedUnitPrice} onChange={(e) => handleItemChange(idx, "estimatedUnitPrice", e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-amber-300 font-semibold" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] text-slate-400">Total Subtotal</label>
                        <div className="p-1.5 bg-slate-950 rounded text-xs font-bold text-amber-400 text-right">
                          {formatIDR((it.quantity || 0) * (it.estimatedUnitPrice || 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Total Estimasi Nilai PR:</span>
              <span className="text-xl font-bold text-amber-400">{formatIDR(calculateTotal())}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20">
                Submit PR untuk Approval
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
