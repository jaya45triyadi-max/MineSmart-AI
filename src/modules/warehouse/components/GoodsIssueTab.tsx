// MINE SMART AI - Goods Issue (GI) Tab
import React, { useState } from "react";
import { ArrowDownLeft, CheckSquare, Wrench, ShieldCheck, Clock, Plus, X } from "lucide-react";
import { GoodsIssueRequest, StockBalance, Warehouse } from "../../../types/warehouseTypes";

interface GoodsIssueTabProps {
  issueRequests: GoodsIssueRequest[];
  stocks: StockBalance[];
  warehouses: Warehouse[];
  onApproveRequest: (id: string, approver: string) => void;
  onFulfillRequest: (id: string, issuer: string) => void;
  onSaveRequest: (req: GoodsIssueRequest) => void;
}

export const GoodsIssueTab: React.FC<GoodsIssueTabProps> = ({
  issueRequests,
  stocks,
  warehouses,
  onApproveRequest,
  onFulfillRequest,
  onSaveRequest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<GoodsIssueRequest>>({
    requesterName: "Agus Rahmat (Plant Maintenance Tech)",
    departmentName: "Plant & Equipment Maintenance",
    purpose: "Pengantian Filter Hidrolik Excavator PC1250 EX-015",
    equipmentCode: "EX-015",
    workOrderId: "WO-PM-2026-119",
    priority: "HIGH",
    warehouseId: warehouses[0]?.warehouseId || "wh-002",
  });

  const [selectedItemId, setSelectedItemId] = useState("itm-001");
  const [reqQty, setReqQty] = useState(2);

  const handleCreateIssueRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = stocks.find((s) => s.itemId === selectedItemId);
    const wh = warehouses.find((w) => w.warehouseId === newIssue.warehouseId);

    const created: GoodsIssueRequest = {
      id: `gi-${Date.now()}`,
      issueRequestId: `gi-${Date.now()}`,
      issueNumber: `GI-REQ-${new Date().toISOString().substring(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      requesterId: "USR-MNT-02",
      requesterName: newIssue.requesterName || "Maint Staff",
      departmentId: "DEPT-MAINT",
      departmentName: newIssue.departmentName || "Maintenance",
      siteId: "site-001",
      warehouseId: newIssue.warehouseId || "wh-002",
      warehouseName: wh?.warehouseName || "Workshop Warehouse",
      purpose: newIssue.purpose || "Perbaikan Unit",
      equipmentCode: newIssue.equipmentCode,
      workOrderId: newIssue.workOrderId,
      priority: newIssue.priority || "HIGH",
      status: "SUBMITTED",
      items: [
        {
          itemId: selectedItemId,
          itemCode: stock?.itemCode || "ITM-001",
          itemName: stock?.itemName || "Sparepart Item",
          requestedQty: Number(reqQty),
          issuedQty: 0,
          unit: stock?.unit || "PCS",
          unitCostIDR: stock?.unitCostIDR || 1000000,
          totalCostIDR: Number(reqQty) * (stock?.unitCostIDR || 1000000),
          locationCode: stock?.locationCode || "WH2-ZB-R04-S01-B05",
        },
      ],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    onSaveRequest(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Request Button */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-blue-400" />
            Pengeluaran Barang Gudang (Goods Issue Request & Work Order Integration)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengeluaran suku cadang dan consumable untuk Work Order Maintenance, Operasional Tambang, dan HSE.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Buat Request GI Baru
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No Request & Pemohon</th>
                <th className="py-3 px-4">WO / Unit Alat Berat</th>
                <th className="py-3 px-4">Tujuan / Keperluan</th>
                <th className="py-3 px-4">Gudang & Item</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {issueRequests.map((req) => (
                <tr key={req.issueRequestId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-blue-400 font-mono">{req.issueNumber}</div>
                    <div className="text-[11px] text-slate-300">{req.requesterName}</div>
                    <div className="text-[10px] text-slate-500">{req.departmentName}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-mono">
                    {req.workOrderId ? (
                      <div>
                        <span className="font-bold text-amber-300">{req.workOrderId}</span>
                        <div className="text-[10px] text-slate-400">Unit: {req.equipmentCode || "-"}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Non-WO Direct Issue</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-200">{req.purpose}</td>

                  <td className="py-3 px-4 text-slate-300">
                    <div className="font-bold text-slate-200">{req.warehouseName}</div>
                    {req.items.map((it, idx) => (
                      <div key={idx} className="text-[11px] text-amber-400">
                        {it.itemName} ({it.requestedQty} {it.unit})
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        req.status === "ISSUED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : req.status === "APPROVED"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {req.status === "SUBMITTED" && (
                      <button
                        onClick={() => onApproveRequest(req.issueRequestId, "Hendra Gunawan (Warehouse Mgr)")}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg shadow transition"
                      >
                        Setujui GI
                      </button>
                    )}

                    {req.status === "APPROVED" && (
                      <button
                        onClick={() => onFulfillRequest(req.issueRequestId, "Budi Santoso (Warehouse Supervisor)")}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg shadow transition"
                      >
                        Keluarkan Barang (Fulfill)
                      </button>
                    )}

                    {req.status === "ISSUED" && (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5" /> Stok Terpotong
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Issue Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" /> Permintaan Pengeluaran Barang (Goods Issue)
            </h2>

            <form onSubmit={handleCreateIssueRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Pemohon & Departemen *</label>
                <input
                  type="text"
                  required
                  value={newIssue.requesterName}
                  onChange={(e) => setNewIssue({ ...newIssue, requesterName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tujuan / Keperluan *</label>
                <input
                  type="text"
                  required
                  value={newIssue.purpose}
                  onChange={(e) => setNewIssue({ ...newIssue, purpose: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Work Order ID (opsional)</label>
                  <input
                    type="text"
                    placeholder="WO-PM-2026-119"
                    value={newIssue.workOrderId}
                    onChange={(e) => setNewIssue({ ...newIssue, workOrderId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Kode Unit Alat Berat</label>
                  <input
                    type="text"
                    placeholder="EX-015 / HT-05"
                    value={newIssue.equipmentCode}
                    onChange={(e) => setNewIssue({ ...newIssue, equipmentCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-slate-200">Pilih Barang dari Gudang:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      {stocks.map((s) => (
                        <option key={s.itemId} value={s.itemId}>
                          {s.itemName} (Avail: {s.available})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={reqQty}
                      onChange={(e) => setReqQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl"
                >
                  Kirim Request GI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
