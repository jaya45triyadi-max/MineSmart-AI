// MINE SMART AI - Central Document Management System (DMS) Module
import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  Search,
  Sparkles,
  Layers,
  BookOpen,
  FileText,
  Briefcase,
  FileCheck2,
  Image,
  FileSpreadsheet,
  Award,
  Receipt,
  ClipboardCheck,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { DocumentItem, DocumentCategory, DocumentStats } from "../../types/documentTypes";
import { DocumentRepository } from "../../services/repositories/DocumentRepository";
import { AIDocumentSearchTab } from "./components/AIDocumentSearchTab";
import { RepositoryBrowserTab } from "./components/RepositoryBrowserTab";
import { DocumentCategoriesOverviewTab } from "./components/DocumentCategoriesOverviewTab";
import { ExpiringPermitsAuditTab } from "./components/ExpiringPermitsAuditTab";
import { DocumentDetailModal } from "./components/DocumentDetailModal";
import { UploadDocumentModal } from "./components/UploadDocumentModal";

export const DocumentManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ai-search" | "repository" | "categories" | "expiring">("ai-search");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    const docs = await DocumentRepository.getAllDocuments();
    const st = await DocumentRepository.getDocumentStats();
    setDocuments(docs);
    setStats(st);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = async (docId: string) => {
    await DocumentRepository.incrementDownloadCount(docId);
    const target = documents.find((d) => d.id === docId);
    setToastMessage(`Berhasil mengunduh berkas digital: ${target?.title || "Dokumen"}`);
    setTimeout(() => setToastMessage(null), 3000);
    loadData();
  };

  const handleUploadSuccess = async (
    newDocData: Omit<DocumentItem, "id" | "createdAt" | "updatedAt" | "downloadCount">
  ) => {
    const created = await DocumentRepository.createDocument(newDocData);
    setToastMessage(`Dokumen berhasil didaftarkan: ${created.documentNumber} (${created.title})`);
    setTimeout(() => setToastMessage(null), 4000);
    loadData();
    setSelectedDocument(created);
  };

  const handleCategorySelectFromOverview = (cat: DocumentCategory) => {
    setActiveTab("repository");
  };

  return (
    <div className="min-h-screen bg-[#070E20] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Executive Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black">
            <FolderGit2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Central Document Repository & AI Knowledge
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/30">
                SMKP & K3 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Repositori Dokumen Terpusat: SOP, Work Instruction, Kontrak, Izin, Drawing CAD, Laporan, Sertifikat, Invoice & Checklist Inspeksi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("ai-search")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "ai-search"
                ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Document Search</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Registrasi Dokumen</span>
          </button>
        </div>
      </div>

      {/* 9 Category Quick Counters Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {[
            { label: "SOP", count: stats.sopCount, icon: BookOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { label: "Work Instruction", count: stats.workInstructionCount, icon: FileText, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
            { label: "Contract", count: stats.contractCount, icon: Briefcase, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
            { label: "Permit", count: stats.permitCount, icon: FileCheck2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { label: "Drawing CAD", count: stats.drawingCount, icon: Image, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { label: "Report", count: stats.reportCount, icon: FileSpreadsheet, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
            { label: "Certificate", count: stats.certificateCount, icon: Award, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
            { label: "Invoice", count: stats.invoiceCount, icon: Receipt, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
            { label: "Inspection", count: stats.inspectionCount, icon: ClipboardCheck, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab("repository")}
                className={`p-3 rounded-xl border ${item.color} flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4" />
                  <span className="font-mono text-base font-black text-white">{item.count}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-300 mt-2 truncate">{item.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { key: "ai-search", label: "AI Document Search & Q&A", icon: Sparkles, badge: "AI Powered" },
          { key: "repository", label: "Central Document Repository", icon: FolderGit2, count: documents.length },
          { key: "categories", label: "9 Klasifikasi Dokumen", icon: Layers },
          { key: "expiring", label: "Audit Kepatuhan & Kadaluarsa Izin", icon: Clock, badge: "Renewal Alert" },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      {activeTab === "ai-search" && (
        <AIDocumentSearchTab
          documents={documents}
          onOpenDocument={(doc) => setSelectedDocument(doc)}
          onDownloadDocument={handleDownload}
        />
      )}

      {activeTab === "repository" && (
        <RepositoryBrowserTab
          documents={documents}
          onOpenDocument={(doc) => setSelectedDocument(doc)}
          onDownloadDocument={handleDownload}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
      )}

      {activeTab === "categories" && (
        <DocumentCategoriesOverviewTab
          documents={documents}
          onSelectCategory={handleCategorySelectFromOverview}
          onOpenDocument={(doc) => setSelectedDocument(doc)}
        />
      )}

      {activeTab === "expiring" && (
        <ExpiringPermitsAuditTab
          documents={documents}
          onOpenDocument={(doc) => setSelectedDocument(doc)}
          onDownloadDocument={handleDownload}
        />
      )}

      {/* Modals */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownload}
        />
      )}

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};
