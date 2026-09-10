// MINE SMART AI - Media Library & Asset Manager
// PROMPT 36: Image, Video, Logo, Favicon & Document Assets Management

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Layers,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MediaAsset } from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface MediaLibraryManagerViewProps {
  mediaAssets: MediaAsset[];
  onRefresh: () => void;
}

export const MediaLibraryManagerView: React.FC<MediaLibraryManagerViewProps> = ({
  mediaAssets,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // New Asset Form State
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetType, setNewAssetType] = useState<"IMAGE" | "VIDEO" | "LOGO" | "FAVICON" | "DOCUMENT">("IMAGE");
  const [newAssetFormat, setNewAssetFormat] = useState<"PNG" | "JPG" | "WEBP" | "SVG" | "MP4" | "PDF">("JPG");
  const [newAssetCategory, setNewAssetCategory] = useState<"HERO" | "BRANDING" | "FEATURES" | "BLOG" | "DOCS">("HERO");

  const filteredAssets = mediaAssets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === "ALL" || a.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateAsset = async () => {
    if (!newAssetName || !newAssetUrl) return;

    await platformConfigService.addMediaAsset(
      {
        name: newAssetName,
        url: newAssetUrl,
        type: newAssetType,
        format: newAssetFormat,
        sizeKB: Math.floor(50 + Math.random() * 500),
        category: newAssetCategory,
        uploadedBy: "Triyadi Jaya",
      },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );

    setShowUploadModal(false);
    setNewAssetName("");
    setNewAssetUrl("");
    setActionSuccessMessage(`✅ Aset baru [${newAssetName}] berhasil ditambahkan ke CDN Media Library!`);
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleDeleteAsset = async (assetId: string) => {
    await platformConfigService.deleteMediaAsset(assetId);
    setActionSuccessMessage("Aset media berhasil dihapus.");
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleApplyToHero = async (asset: MediaAsset) => {
    const isVid = asset.type === "VIDEO";
    await platformConfigService.updateHeroSection(
      isVid ? { demoVideoUrl: asset.url } : { heroImageUrl: asset.url },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );
    setActionSuccessMessage(
      `✅ Aset "${asset.name}" berhasil diterapkan ke ${isVid ? "Video Demo Hero" : "Hero Cover Image"} website secara live!`
    );
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <span>Media Library & CDN Asset Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kelola berkas gambar hero, vektor logo, rekaman video 3D pit, dan dokumen PDF resmi.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload / Register Media Asset</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari aset media berdasarkan nama atau tag..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
        >
          <option value="ALL">Semua Tipe Media</option>
          <option value="IMAGE">Gambar (Image)</option>
          <option value="VIDEO">Video Embed</option>
          <option value="LOGO">Logo & Vektor</option>
          <option value="DOCUMENT">Dokumen PDF</option>
        </select>
      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            {/* Visual Thumbnail */}
            <div className="h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden">
              {asset.type === "IMAGE" ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : asset.type === "VIDEO" ? (
                <div className="text-center space-y-2">
                  <Video className="w-10 h-10 text-cyan-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-mono">Video Stream</span>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <FileText className="w-10 h-10 text-amber-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-mono">{asset.type}</span>
                </div>
              )}

              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-black bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                {asset.format} &bull; {asset.sizeKB} KB
              </span>
            </div>

            {/* Asset Info Body */}
            <div className="p-4 space-y-2">
              <h4 className="font-bold text-xs text-white line-clamp-1">
                {asset.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono truncate">{asset.url}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyUrl(asset)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  {(asset.type === "IMAGE" || asset.type === "VIDEO") && (
                    <button
                      onClick={() => handleApplyToHero(asset)}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title={asset.type === "IMAGE" ? "Pasang sebagai Cover Hero" : "Pasang sebagai Demo Video"}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{asset.type === "IMAGE" ? "Set Hero Img" : "Set Hero Video"}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Aset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload / Register Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Upload / Register Media Asset</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nama Aset
                </label>
                <input
                  type="text"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="Contoh: Mining Pit Landscape HD"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  CDN Direct URL / Image URL
                </label>
                <input
                  type="text"
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Tipe Media
                  </label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="LOGO">Logo</option>
                    <option value="FAVICON">Favicon</option>
                    <option value="DOCUMENT">Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Format
                  </label>
                  <select
                    value={newAssetFormat}
                    onChange={(e) => setNewAssetFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                    <option value="WEBP">WEBP</option>
                    <option value="SVG">SVG</option>
                    <option value="MP4">MP4</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreateAsset}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl shadow-lg cursor-pointer"
              >
                Simpan ke Media Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
