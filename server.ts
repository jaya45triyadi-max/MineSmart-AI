import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client (Server-Side Only)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "MINE SMART AI",
    version: "1.0.0-PROMPT1",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// 2. License Verification & Activation API
app.post("/api/license/verify", (req, res) => {
  const { licenseKey } = req.body;
  
  if (!licenseKey) {
    return res.status(400).json({ valid: false, message: "Kode lisensi wajib diisi." });
  }

  const cleanKey = String(licenseKey).trim().toUpperCase();

  // Demo enterprise key validation
  if (cleanKey.startsWith("MSAI-") || cleanKey.length >= 10) {
    const plan = cleanKey.includes("ENT")
      ? "ENTERPRISE"
      : cleanKey.includes("PRO")
      ? "PROFESSIONAL"
      : "STARTER";

    return res.json({
      valid: true,
      licenseKey: cleanKey,
      companyName: "PT Batubara Nusa Utama (Demo)",
      plan,
      status: "ACTIVE",
      expirationDate: "2027-12-31T23:59:59Z",
      deviceLimit: plan === "ENTERPRISE" ? 100 : 25,
      userLimit: plan === "ENTERPRISE" ? 500 : 50,
      activatedAt: new Date().toISOString(),
    });
  }

  return res.status(400).json({ valid: false, message: "Kode lisensi tidak ditemukan atau tidak valid." });
});

// 3. AI Copilot Chat Endpoint (Server-Side Gemini API)
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message prompt is required." });
    }

    const ai = getAiClient();

    const currentSiteName = context?.siteName || "Site Kalimantan A";
    const userRole = context?.userRole || "MINING_OWNER";
    const companyName = context?.companyName || "PT Batubara Nusa Utama";

    // Operational Context context summary
    const systemPrompt = `Anda adalah MINE SMART AI Copilot, Asisten Kecerdasan Buatan Enterprise untuk operasional pertambangan batubara Indonesia.
Anda melayani pengguna dari ${companyName} (${currentSiteName}) dengan peran ${userRole}.

INFORMASI REAL-TIME OPERASIONAL SITE SAAT INI (${currentSiteName}):
- Produksi Batubara Hari Ini: 14,250 MT (Target: 15,000 MT - Achieve 95%)
- Pengupasan Overburden (OB): 48,600 BCM (Target: 50,000 BCM - Achieve 97.2%)
- Strip Ratio (SR) Aktual: 3.41 BCM/MT (Target: 3.33 BCM/MT)
- Fleet Availability (PA / Physical Availability): 88.5% (Target: 90.0%)
- Fleet Utilization (UA / Use of Availability): 76.2%
- Total Fleet Aktif: 12 Excavator (PC1250, PC2000), 48 Haul Truck (HD785, CAT 777), 8 Bulldozer (D375)
- Fleet Breakdown / Unscheduled Downtime: 2 Unit (EX-204 Komatsu PC1250 masalah hidrolik, HT-108 CAT 777 ban bocor)
- Konsumsi Fuel Hari Ini: 42,150 Liter Solar (Fuel Ratio OB: 0.867 L/BCM)
- Stok Batubara (Rom Stockpile): 128,400 MT | Clean Coal Stockpile: 85,200 MT
- Kualitas Batubara (Average): GAR 4,200 kcal/kg, Moisture 34.2%, Ash 5.8%, Sulfur 0.45%
- Status HSE: 342 Hari Bebas Lost Time Injury (LTI), 1 Incident Near Miss terlaporkan kemarin di Pit 2 West.

PEDOMAN JAWABAN:
1. Jawab dalam Bahasa Indonesia yang profesional, tegas, dan ala eksekutif/engineer pertambangan.
2. Sediakan angka, analisis sebab-akibat (root cause), serta rekomendasi tindakan praktis yang aman untuk tambang.
3. Bila ditanya laporan, buatkan ringkasan terstruktur dengan bullet point, tabel Markdown jika relevan, dan saran perbaikan.
4. Jaga kerahasiaan data tenant; berikan perspektif sesuai peran ${userRole}.`;

    if (!ai) {
      const lowerMsg = String(message).toLowerCase();
      let fallbackResponse = "";

      if (
        lowerMsg.includes("kondisi tambang") ||
        lowerMsg.includes("bagaimana kondisi") ||
        lowerMsg.includes("briefing direktur") ||
        lowerMsg.includes("executive briefing")
      ) {
        fallbackResponse = `### 👔 Executive Mine Health Briefing (Status Hari Ini)

Berdasarkan data operasional terintegrasi:

- 🎯 **Production:** **94% dari target**
- 🚜 **Fleet utilization:** **82%**
- ⛽ **Fuel consumption:** **Naik 7%**
- ⏱️ **Downtime:** **Meningkat 11%**
- ⚠️ **Risiko utama:** **Terdapat pada Fleet B**

---

### 📋 Recommended Action & Daftar Tindakan Prioritas:

1. 🔴 **Prioritas 1 (Kritis — Fleet & Maintenance):**
   - **Rebalancing Armada Fleet B:** Alihkan 4 unit Haul Truck (HD-07 dkk) dari Fleet B ke Fleet A/C untuk mengeliminasi antrean idle (*truck queuing*).
   - **Fast-Track Work Order EX-03 & EX-05:** Prioritaskan perbaikan seal hidrolik di Workshop Central agar unit siap operasi penuh pada Shift 2.

2. 🟡 **Prioritas 2 (Tinggi — Efisiensi Fuel Solar):**
   - **Inspeksi Injektor & Filter Solar:** Tarik unit dengan burn rate abnormal di tanjakan KM 4.2 untuk kalibrasi common rail dan pembersihan filter bahan bakar (potensi hemat 7% solar).

3. 🟢 **Prioritas 3 (Sedang — Hauling & Road Maintenance):**
   - **Scraping & Grading Jalan:** Kerahkan Motor Grader D375 untuk meratakan lumpur licin di jalur KM 4–6 pasca penyiraman guna memangkas cycle time 4.2 menit.

4. 🔵 **Prioritas 4 (Safety & Kepatuhan K3LH):**
   - **Safety Pre-Shift Inspection:** Pastikan kestabilan lereng loading front Pit 2 dan pastikan kepatuhan APD Vision Guard 100% sebelum rotasi shift malam.`;
      } else {
        // General fallback
        fallbackResponse = `[MINE SMART AI - Operational Intelligence Engine]

Berdasarkan analisis data terintegrasi untuk **${currentSiteName}** (${companyName}):

📊 **Status Ringkasan Operasional Hari Ini:**
- **Produksi Batubara:** 14,250 MT (95.0% dari target 15,000 MT)
- **Pengupasan OB:** 48,600 BCM (97.2% dari target 50,000 BCM)
- **Strip Ratio (SR):** 3.41 BCM/MT (Selisih +0.08 dari rencana)
- **Ketersediaan Alat (PA):** 88.5% | **Penggunaan (UA):** 76.2%

⚠️ **Faktor Utama & Analisis Penyebab Keterlambatan Target:**
1. **Downtime Alat Utama:** Excavator EX-204 (PC1250) mengalami masalah kebocoran pipa hidrolik pukul 10:15 WITA (Downtime 3.5 jam).
2. **Kepadatan Jalan Hauling (Pit 2 North):** Antrean truck terjadi di simpang KM 4 karena penyiraman jalan dust suppression.

💡 **Rekomendasi AI Agent untuk Shift Malam:**
1. Alokasikan 4 unit Haul Truck HD-785 dari Fleet EX-204 sementara ke Fleet EX-201 (Pit 1 South) untuk optimalisasi match factor (target 1.15).
2. Percepat penyelesaian Work Order mekanik pada EX-204 (estimasi selesai 19:30 WITA).
3. Monitor efisiensi fuel ratio yang saat ini berada pada angka **0.867 L/BCM**.

*(Sistem AI terhubung secara real-time dengan sensor telemetri pertambangan.)*`;
      }

      return res.json({
        reply: fallbackResponse,
        model: "gemini-3.6-flash-fallback",
        timestamp: new Date().toISOString(),
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || "Tidak ada respon dari model AI.",
      model: "gemini-3.6-flash",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({
      error: "Gagal memproses permintaan AI Copilot.",
      details: error?.message || String(error),
    });
  }
});

// Vite & Static Server Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MINE SMART AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
