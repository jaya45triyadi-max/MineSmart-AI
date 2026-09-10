// MINE SMART AI - Upload & Register Document Modal
import React, { useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  Shield,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileUp,
} from "lucide-react";
import {
  DocumentItem,
  DocumentCategory,
  DocumentDepartment,
  ConfidentialityLevel,
  FileType,
} from "../../../types/documentTypes";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: Omit<DocumentItem, "id" | "createdAt" | "updatedAt" | "downloadCount">) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(3.2);
  const [documentNumber, setDocumentNumber] = useState<string>("SOP-MNT-GEN-042");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<DocumentCategory>("SOP");
  const [department, setDepartment] = useState<DocumentDepartment>("Plant Maintenance");
  const [version, setVersion] = useState<string>("v1.0");
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>("INTERNAL");
  const [author, setAuthor] = useState<string>("Eng. Tim Maintenance");
  const [reviewer, setReviewer] = useState<string>("Plant Supt.");
  const [approvedBy, setApprovedBy] = useState<string>("Rahmat Hidayat (KTT)");
  const [tagsInput, setTagsInput] = useState<string>("Excavator, Maintenance, Safety, SOP");
  const [equipmentInput, setEquipmentInput] = useState<string>("EX-204, PC1250");
  const [summary, setSummary] = useState<string>("");
  const [fullTextContent, setFullTextContent] = useState<string>("");
  const [isAiClassifying, setIsAiClassifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateAiClassify = () => {
    setIsAiClassifying(true);
    setTimeout(() => {
      if (title.toLowerCase().includes("excavator") || title.toLowerCase().includes("service")) {
        setCategory("SOP");
        setDepartment("Plant Maintenance");
        setTagsInput("Excavator, Hydraulic, Komatsu, LOTO, Maintenance");
        setEquipmentInput("EX-204, PC1250");
        setSummary("Standar operasional prosedur pemeliharaan dan inspeksi unit excavator mining fleet.");
      } else if (title.toLowerCase().includes("izin") || title.toLowerCase().includes("amdal") || title.toLowerCase().includes("ippkh")) {
        setCategory("PERMIT");
        setDepartment("Legal & Compliance");
        setTagsInput("Izin, Legal, KLHK, ESDM, Lingkungan");
        setSummary("Dokumen legalitas izin resmi operasional pertambangan batubara.");
      } else if (title.toLowerCase().includes("kontrak") || title.toLowerCase().includes("agreement")) {
        setCategory("CONTRACT");
        setDepartment("Commercial & Finance");
        setTagsInput("Contract, Vendor, Agreement, Commercial");
        setSummary("Perjanjian kerja sama pengadaan dan suplai operasional tambang.");
      }
      setIsAiClassifying(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !documentNumber.trim()) return;

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const equipmentTags = equipmentInput.split(",").map((t) => t.trim()).filter(Boolean);

    onUploadSuccess({
      documentNumber,
      title,
      category,
      department,
      version,
      status: "ACTIVE",
      effectiveDate,
      expiryDate: expiryDate || undefined,
      author,
      reviewer,
      approvedBy,
      confidentiality,
      fileType: "PDF",
      fileSizeMB: fileSize,
      tags: tags.length > 0 ? tags : ["Dokumen", "Mining"],
      equipmentTags: equipmentTags.length > 0 ? equipmentTags : undefined,
      summary: summary || `Dokumen resmi ${title} yang terdaftar dalam Central Document Repository.`,
      fullTextContent:
        fullTextContent ||
        `DOKUMEN RESMI MINE SMART AI\nNomor: ${documentNumber}\nJudul: ${title}\nDepartemen: ${department}\nTanggal Efektif: ${effectiveDate}\n\nDokumen telah disahkan dan memenuhi standar SMKP Minerba.`,
      revisionHistory: [
        {
          version,
          date: effectiveDate,
          author,
          changes: "Registrasi dan upload perdana dokumen",
          approvedBy,
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Unggah & Registrasi Dokumen Baru</h3>
              <p className="text-xs text-slate-400">
                Otomatisasi Ekstraksi Metadata, Klasifikasi AI & Pengindeksan Pencarian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {/* File Dropzone Area */}
          <div
            onClick={() => {
              setFileSelected("SOP-MNT-PVE-EX1250-2026.pdf");
              if (!title) setTitle("SOP Pemeliharaan Komponen Elektrikal & Sensor Excavator");
            }}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
              fileSelected
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-slate-700 hover:border-amber-400 bg-slate-950"
            }`}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 ${fileSelected ? "text-emerald-400" : "text-slate-400"}`} />
            {fileSelected ? (
              <div className="space-y-1">
                <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {fileSelected} ({fileSize} MB)
                </span>
                <p className="text-[11px] text-slate-400">Klik untuk mengganti file dokumen digital</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-white">Tarik & Lepas File di sini atau Klik untuk Memilih</p>
                <p className="text-[11px] text-slate-400">Mendukung PDF, DWG, DOCX, XLSX, atau Hasil Scan (Max 50MB)</p>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Nomor Registrasi Dokumen *</label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Contoh: SOP-MNT-EX-005"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Kategori Dokumen *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="SOP">SOP (Standard Operating Procedure)</option>
                <option value="WORK_INSTRUCTION">Work Instruction (WI / Petunjuk Kerja)</option>
                <option value="CONTRACT">Contract (Perjanjian / Kontrak)</option>
                <option value="PERMIT">Permit (Izin Tambang / IPPKH / RKAB / P2)</option>
                <option value="DRAWING">Drawing (CAD / Gambar Teknik / Geologi)</option>
                <option value="REPORT">Report (Laporan Teknis / RKL-RPL / Geoteknik)</option>
                <option value="CERTIFICATE">Certificate (Sertifikat POP / Kalibrasi / SILO)</option>
                <option value="INVOICE">Invoice (Faktur Tagihan Komersial)</option>
                <option value="INSPECTION">Inspection (Checklist K3 / P2H Alat)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300">Judul Lengkap Dokumen *</label>
                <button
                  type="button"
                  onClick={handleSimulateAiClassify}
                  className="text-amber-400 text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiClassifying ? "Menganalisis..." : "AI Auto-Fill Metadata"}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: SOP Pemeliharaan Berkala Excavator Komatsu PC1250"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Departemen Pemilik *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Mining">Mining Operation</option>
                <option value="Geology & Survey">Geology & Survey</option>
                <option value="Plant Maintenance">Plant Maintenance</option>
                <option value="Processing & Coal">Processing & Coal</option>
                <option value="HSE & Environment">HSE & Environment</option>
                <option value="Commercial & Finance">Commercial & Finance</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
                <option value="Supply Chain">Supply Chain / Logistics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Tingkat Kerahasiaan</label>
              <select
                value={confidentiality}
                onChange={(e) => setConfidentiality(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="INTERNAL">INTERNAL (Seluruh Karyawan Site)</option>
                <option value="RESTRICTED">RESTRICTED (Supervisor & Ke Atas)</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL (Manajemen & Legal)</option>
                <option value="SECRET">SECRET (KTT & Direksi)</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Tanggal Berlaku Efektif</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Tanggal Kadaluarsa (Opsional)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Penyusun / Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Pengesah / Approver</label>
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300">Tags & Label (Pisahkan Koma)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Contoh: Excavator, Maintenance, LOTO, Hidrolik"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300">Unit Alat Berat Terkait (Opsional)</label>
              <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="Contoh: EX-204, EX-205, PC1250, CAT-777G"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300">Ringkasan Eksekutif Dokumen</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Deskripsi singkat isi dokumen..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Simpan & Indeks Dokumen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
