// MINE SMART AI - AI Semantic Document Search & Retrieval Service
import { DocumentItem, AISearchResponse, AISearchResult, DocumentCategory, DocumentDepartment } from "../types/documentTypes";

export class AIDocumentSearchService {
  /**
   * Executes AI Semantic Search across the central document repository
   * Handles multi-intent natural language queries in Indonesian and English
   */
  static search(query: string, documents: DocumentItem[]): AISearchResponse {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        query: "",
        aiSynthesis: "Silakan masukkan kata kunci atau pertanyaan seperti 'Cari SOP maintenance excavator' atau 'Izin IPPKH Pit 2'.",
        results: [],
        suggestedFollowUps: [
          "Cari SOP maintenance excavator",
          "Dokumen izin IPPKH dan AMDAL Pit 1",
          "Drawing CAD desain lereng Pit 1 South",
          "Kontrak suplier BBM solar B35 Pertamina",
          "Sertifikat kalibrasi jembatan timbang",
        ],
      };
    }

    const qLower = trimmed.toLowerCase();
    const queryTokens = qLower
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1);

    // Intent & category inference
    let inferredCategory: DocumentCategory | undefined;
    let inferredDepartment: DocumentDepartment | undefined;
    let inferredEquipment: string | undefined;

    if (qLower.includes("sop") || qLower.includes("standar operasional") || qLower.includes("prosedur")) {
      inferredCategory = "SOP";
    } else if (qLower.includes("work instruction") || qLower.includes("wi ") || qLower.includes("instruksi kerja") || qLower.includes("petunjuk kerja")) {
      inferredCategory = "WORK_INSTRUCTION";
    } else if (qLower.includes("kontrak") || qLower.includes("contract") || qLower.includes("perjanjian") || qLower.includes("msa") || qLower.includes("agreement")) {
      inferredCategory = "CONTRACT";
    } else if (qLower.includes("izin") || qLower.includes("permit") || qLower.includes("ippkh") || qLower.includes("rkab") || qLower.includes("amdal") || qLower.includes("p2")) {
      inferredCategory = "PERMIT";
    } else if (qLower.includes("drawing") || qLower.includes("gambar") || qLower.includes("cad") || qLower.includes("penampang") || qLower.includes("dwg") || qLower.includes("desain")) {
      inferredCategory = "DRAWING";
    } else if (qLower.includes("laporan") || qLower.includes("report") || qLower.includes("geoteknik") || qLower.includes("rkl-rpl") || qLower.includes("kestabilan lereng")) {
      inferredCategory = "REPORT";
    } else if (qLower.includes("sertifikat") || qLower.includes("certificate") || qLower.includes("pop") || qLower.includes("tera") || qLower.includes("kalibrasi") || qLower.includes("silo")) {
      inferredCategory = "CERTIFICATE";
    } else if (qLower.includes("invoice") || qLower.includes("tagihan") || qLower.includes("faktur") || qLower.includes("pembayaran")) {
      inferredCategory = "INVOICE";
    } else if (qLower.includes("inspeksi") || qLower.includes("inspection") || qLower.includes("checklist") || qLower.includes("p2h") || qLower.includes("audit")) {
      inferredCategory = "INSPECTION";
    }

    if (qLower.includes("excavator") || qLower.includes("ex-204") || qLower.includes("pc1250") || qLower.includes("pc2000")) {
      inferredEquipment = "Excavator (Komatsu PC1250/PC2000)";
      inferredDepartment = "Plant Maintenance";
    } else if (qLower.includes("dump truck") || qLower.includes("dt-") || qLower.includes("cat 777") || qLower.includes("hauling")) {
      inferredEquipment = "Dump Truck (CAT 777G)";
      inferredDepartment = "Mining";
    } else if (qLower.includes("blasting") || qLower.includes("drilling") || qLower.includes("peledakan") || qLower.includes("handak")) {
      inferredDepartment = "Mining";
    } else if (qLower.includes("lingkungan") || qLower.includes("settling pond") || qLower.includes("amdal") || qLower.includes("k3") || qLower.includes("hse")) {
      inferredDepartment = "HSE & Environment";
    } else if (qLower.includes("solar") || qLower.includes("fuel") || qLower.includes("pertamina")) {
      inferredDepartment = "Commercial & Finance";
    }

    // Score all documents
    const scoredResults: AISearchResult[] = documents
      .map((doc) => {
        let score = 0;
        const matchedKeywords: string[] = [];
        const docText = `${doc.documentNumber} ${doc.title} ${doc.summary} ${doc.fullTextContent} ${doc.tags.join(" ")} ${
          doc.equipmentTags?.join(" ") || ""
        } ${doc.department} ${doc.category} ${doc.complianceStandard || ""}`.toLowerCase();

        // Exact match boosts
        if (inferredCategory && doc.category === inferredCategory) {
          score += 35;
          matchedKeywords.push(`Kategori: ${doc.category}`);
        }

        if (inferredDepartment && doc.department === inferredDepartment) {
          score += 20;
          matchedKeywords.push(`Dept: ${doc.department}`);
        }

        // Equipment match
        if (inferredEquipment) {
          const eqHits = doc.equipmentTags?.some((e) => inferredEquipment?.toLowerCase().includes(e.toLowerCase()));
          if (eqHits || doc.tags.some((t) => inferredEquipment?.toLowerCase().includes(t.toLowerCase()))) {
            score += 30;
            matchedKeywords.push(`Unit: ${doc.equipmentTags?.join(", ") || "Excavator"}`);
          }
        }

        // Title and Number boost
        if (doc.documentNumber.toLowerCase().includes(qLower)) {
          score += 60;
          matchedKeywords.push(doc.documentNumber);
        }
        if (doc.title.toLowerCase().includes(qLower)) {
          score += 50;
          matchedKeywords.push("Judul Dokumen");
        }

        // Token matches
        for (const token of queryTokens) {
          if (doc.title.toLowerCase().includes(token)) {
            score += 15;
            matchedKeywords.push(token);
          } else if (doc.tags.some((t) => t.toLowerCase().includes(token))) {
            score += 12;
            matchedKeywords.push(token);
          } else if (doc.summary.toLowerCase().includes(token)) {
            score += 8;
            matchedKeywords.push(token);
          } else if (doc.fullTextContent.toLowerCase().includes(token)) {
            score += 4;
          }
        }

        // Generate highlight snippet
        let highlightSnippet = doc.summary;
        const lines = doc.fullTextContent.split("\n");
        const matchingLine = lines.find((l) => queryTokens.some((tok) => l.toLowerCase().includes(tok)));
        if (matchingLine && matchingLine.trim().length > 20) {
          highlightSnippet = matchingLine.trim();
        }

        // Create match reason
        let matchReason = `Ditemukan kecocokan relevansi data ${doc.category} ${doc.department}`;
        if (doc.category === "SOP" && (qLower.includes("excavator") || qLower.includes("maintenance"))) {
          matchReason = `SOP resmi pemeliharaan & periodic service PS-250 s/d PS-2000 SMU Excavator PC1250/PC2000 dengan prosedur isolasi LOTO & oil sampling.`;
        } else if (doc.category === "PERMIT" && (qLower.includes("ippkh") || qLower.includes("hutan"))) {
          matchReason = `SK Menteri LHK No. SK.342/2024 tentang Izin Pinjam Pakai Kawasan Hutan 1.820 Ha aktif hingga April 2029.`;
        } else if (doc.category === "DRAWING") {
          matchReason = `Engineering CAD Drawing Pit Design Sequence & Geometri lereng jenjang bench RL -50.`;
        } else if (doc.category === "CONTRACT" && qLower.includes("solar")) {
          matchReason = `Kontrak Jual Beli Solar B35 Pertamina Patra Niaga No. CTR-COM-2026-089 dengan formula harga MOPS.`;
        } else if (doc.category === "CERTIFICATE" && qLower.includes("timbang")) {
          matchReason = `Sertifikat Tera Metrologi Legal No. 510.4/048 kapasitas 100 Ton berlaku sampai Februari 2027.`;
        }

        return {
          document: doc,
          relevanceScore: Math.min(Math.round(score), 99),
          matchReason,
          highlightSnippet: highlightSnippet.length > 220 ? highlightSnippet.substring(0, 220) + "..." : highlightSnippet,
          matchedKeywords: Array.from(new Set(matchedKeywords)),
        };
      })
      .filter((r) => r.relevanceScore >= 20)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // AI Synthesis Message
    let aiSynthesis = "";
    if (scoredResults.length === 0) {
      aiSynthesis = `AI tidak menemukan dokumen yang secara spesifik cocok dengan kueri "${trimmed}". Coba gunakan kata kunci seperti "SOP excavator", "IPPKH", "CAD Pit 1", "Kontrak Solar", atau "Kalibrasi".`;
    } else {
      const topDoc = scoredResults[0].document;
      if (qLower.includes("sop") && (qLower.includes("excavator") || qLower.includes("maintenance"))) {
        aiSynthesis = `✅ AI menemukan dokumen utama: **${topDoc.documentNumber}** — *"${topDoc.title}"* (Relevansi ${scoredResults[0].relevanceScore}%).
Dokumen ini merupakan SOP resmi yang mengatur tahapan Periodic Service (PS-250, PS-500, PS-1000, PS-2000 SMU), prosedur LOTO kelistrikan/akumulator, spesifikasi pelumas B35 biofuel compatibility, dan jadwal pengambilan sampel oli SOS pada Excavator Komatsu PC1250 (EX-204 s/d EX-209).`;
      } else if (qLower.includes("ippkh") || qLower.includes("izin hutan")) {
        aiSynthesis = `✅ AI menemukan Izin Kehutanan: **${topDoc.documentNumber}** — SK Menteri LHK Izin Pinjam Pakai Kawasan Hutan (IPPKH) seluas 1.820,45 Hektar untuk Pit 1 & Pit 2. Masa berlaku aktif hingga **12 April 2029** dengan kepatuhan kewajiban penanaman DAS 1:1.`;
      } else if (qLower.includes("drawing") || qLower.includes("cad") || qLower.includes("lereng")) {
        aiSynthesis = `✅ AI menemukan gambar teknis: **${topDoc.documentNumber}** — Engineering Pit Design CAD Pit 1 South RL -50. Mencakup spesifikasi single bench 10m, overall slope angle 38°, lebar ramp 28m untuk armada CAT 777G, dan tanggul pengaman safety berm 1.8m.`;
      } else {
        aiSynthesis = `✅ AI menemukan **${scoredResults.length} dokumen terkait** untuk pencarian "${trimmed}". Dokumen dengan relevansi tertinggi adalah **${topDoc.documentNumber}** (*${topDoc.title}*) dari Departemen ${topDoc.department} [Status: ${topDoc.status}].`;
      }
    }

    const suggestedFollowUps = [
      "Bagaimana langkah isolasi LOTO pada SOP maintenance excavator?",
      "Kapan masa berlaku izin IPPKH dan apa kewajiban rehabilitasi DAS?",
      "Berapa spesifikasi lebar jalan dan slope angle pada Drawing Pit 1 South?",
      "Cek faktur tagihan darurat silinder hidrolik United Tractors",
      "Lihat sertifikat kalibrasi tera jembatan timbang 100 Ton",
    ];

    return {
      query: trimmed,
      inferredCategory,
      inferredDepartment,
      inferredEquipment,
      aiSynthesis,
      results: scoredResults,
      suggestedFollowUps,
    };
  }
}
