import React, { useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { TextInput, CurrencyInput, NumberInput, Textarea, Switch } from "../../components/ui/Input";
import { Select, SearchSelect } from "../../components/ui/Select";
import { Card, MetricCard, AlertCard } from "../../components/ui/Card";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/ToastProvider";
import { MiningChart } from "../../components/charts/MiningChart";
import { AIInsightCard } from "../../components/ai/AIInsightCard";
import { useTheme } from "../../providers/ThemeProvider";
import {
  Sparkles,
  Sun,
  Moon,
  Pickaxe,
  Truck,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SampleRow {
  id: string;
  code: string;
  unit: string;
  operator: string;
  tonnage: number;
  revenue: number;
  status: string;
}

export const DesignSystemPage: React.FC = () => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currencyVal, setCurrencyVal] = useState(2500000);
  const [numberVal, setNumberVal] = useState(12840);
  const [switchVal, setSwitchVal] = useState(true);
  const [selectVal, setSelectVal] = useState("PIT_1");

  const sampleData: SampleRow[] = [
    { id: "1", code: "EX-201", unit: "Komatsu PC2000", operator: "Budi Santoso", tonnage: 12840, revenue: 1284000000, status: "RUNNING" },
    { id: "2", code: "EX-202", unit: "CAT 6020B", operator: "Ahmad Dahlan", tonnage: 10450, revenue: 1045000000, status: "MAINTENANCE" },
    { id: "3", code: "DT-105", unit: "Volvo FMX 440", operator: "Rudi Hermawan", tonnage: 8900, revenue: 890000000, status: "RUNNING" },
    { id: "4", code: "EX-204", unit: "Hitachi EX1200", operator: "Joko Widodo", tonnage: 0, revenue: 0, status: "BREAKDOWN" },
  ];

  const columns: Column<SampleRow>[] = [
    { key: "code", header: "Kode Alat", accessor: (r) => <span className="font-bold">{r.code}</span>, sortable: true },
    { key: "unit", header: "Model / Tipe Unit", accessor: (r) => r.unit, sortable: true },
    { key: "operator", header: "Operator Shift", accessor: (r) => r.operator },
    {
      key: "tonnage",
      header: "Produksi Today",
      accessor: (r) => `${r.tonnage.toLocaleString("id-ID")} Ton`,
      sortable: true,
      searchValue: (r) => String(r.tonnage),
    },
    {
      key: "revenue",
      header: "Nilai Operasional",
      accessor: (r) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
          r.revenue
        ),
      sortable: true,
    },
    { key: "status", header: "Status Operational", accessor: (r) => <StatusBadge status={r.status} /> },
  ];

  const chartData = [
    { name: "Shift 1 - Pit A", target: 12000, actual: 12840, fuel: 4200 },
    { name: "Shift 2 - Pit A", target: 12000, actual: 11900, fuel: 4100 },
    { name: "Shift 1 - Pit B", target: 15000, actual: 16200, fuel: 5100 },
    { name: "Shift 2 - Pit B", target: 15000, actual: 14800, fuel: 4900 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        breadcrumb={["MINE SMART AI", "System", "Design System"]}
        title="Luxury Enterprise Design System & UI Tokens"
        description="Pusat token visual, komponen UI terintegrasi, dan panduan antarmuka platform MINE SMART AI."
        primaryAction={
          <Button variant="gold" leftIcon={<Sparkles className="h-4 w-4" />} onClick={toggleTheme}>
            Toggle Theme ({effectiveTheme.toUpperCase()})
          </Button>
        }
      />

      {/* 1. Centralized Theme & Color Tokens */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Centralized Color Palette & Tokens
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
          <div className="rounded-xl border border-slate-700 bg-[#0B1220] p-3 text-white">
            <p className="text-[10px] text-slate-400 uppercase">Deep Charcoal</p>
            <p className="mt-2 font-mono">#0B1220</p>
            <span className="text-[10px] text-slate-500">Page Background</span>
          </div>
          <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 text-white">
            <p className="text-[10px] text-slate-400 uppercase">Graphite Surface</p>
            <p className="mt-2 font-mono">#0F172A</p>
            <span className="text-[10px] text-slate-500">Surface / Panels</span>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-[#1E293B] p-3 text-amber-400">
            <p className="text-[10px] text-amber-500 uppercase">Premium Gold</p>
            <p className="mt-2 font-mono">#E5C158</p>
            <span className="text-[10px] text-amber-500/80">Brand Accent</span>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-emerald-400">
            <p className="text-[10px] text-emerald-500 uppercase">Emerald Green</p>
            <p className="mt-2 font-mono">#10B981</p>
            <span className="text-[10px] text-emerald-500/80">Success / Active</span>
          </div>
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-red-400">
            <p className="text-[10px] text-red-500 uppercase">Alert Red</p>
            <p className="mt-2 font-mono">#EF4444</p>
            <span className="text-[10px] text-red-500/80">Danger / Breakdown</span>
          </div>
          <div className="rounded-xl border border-sky-500/40 bg-sky-950/40 p-3 text-sky-400">
            <p className="text-[10px] text-sky-500 uppercase">Steel Blue</p>
            <p className="mt-2 font-mono">#38BDF8</p>
            <span className="text-[10px] text-sky-500/80">Info / Telemetry</span>
          </div>
        </div>
      </section>

      {/* 2. Typography & Indonesian Locale Numbers */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Typography & Indonesian Locale Data Format
        </h3>

        <Card className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Format Angka Tonase</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              12.840 TON
            </p>
            <p className="text-[11px] text-slate-500">Locale id-ID dengan pemisah ribuan titik</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Format Finansial Rupiah</p>
            <p className="text-2xl font-black text-emerald-500 mt-1">
              Rp 2.500.000.000
            </p>
            <p className="text-[11px] text-slate-500">Nilai Kontrak BBNU / Revenue</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Format Persentase & Rasio</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              98,4% PA / SR 4,2
            </p>
            <p className="text-[11px] text-slate-500">Physical Availability & Stripping Ratio</p>
          </div>
        </Card>
      </section>

      {/* 3. Reusable Buttons & Badges */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Button & Badge Component System
        </h3>

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">Primary Emerald</Button>
            <Button variant="gold">Gold Premium</Button>
            <Button variant="secondary">Secondary Slate</Button>
            <Button variant="outline">Outline Border</Button>
            <Button variant="danger">Danger Red</Button>
            <Button variant="success">Success Teal</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" isLoading>Loading State</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <StatusBadge status="ACTIVE" />
            <StatusBadge status="RUNNING" />
            <StatusBadge status="MAINTENANCE" />
            <StatusBadge status="BREAKDOWN" />
            <StatusBadge status="ENTERPRISE" />
            <Badge variant="purple" dot>AI OPTIMIZED</Badge>
            <Badge variant="gold">PRO PLAN</Badge>
          </div>
        </Card>
      </section>

      {/* 4. Form Controls & Interactive Triggers */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Enterprise Form System & Toast Triggers
        </h3>

        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextInput label="Nama Operator" defaultValue="Budi Santoso" required />
          <NumberInput label="Target Tonase (Ton)" value={numberVal} onChange={(v) => setNumberVal(v)} suffix="TON" />
          <CurrencyInput label="Biaya Operasional (IDR)" value={currencyVal} onChange={(v) => setCurrencyVal(v)} />
          <Select
            label="Pilih Lokasi Pit"
            value={selectVal}
            onChange={(v) => setSelectVal(v)}
            options={[
              { value: "PIT_1", label: "Pit 1 North Block" },
              { value: "PIT_2", label: "Pit 2 West Block" },
            ]}
          />
          <div className="sm:col-span-2">
            <Textarea label="Catatan Inspeksi HSE" defaultValue="Area haul road basah pasca hujan. Disarankan grading jalan." />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Switch checked={switchVal} onChange={(c) => setSwitchVal(c)} label="Auto Sync FMS" />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <Button size="sm" variant="success" onClick={() => showToast("success", "Berhasil Disimpan", "Data operasional telah disinkronkan.")}>
              Test Toast Success
            </Button>
            <Button size="sm" variant="danger" onClick={() => showToast("error", "Gagal Terhubung", "Koneksi GPS telemetry terputus.")}>
              Test Toast Error
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
              Buka Modal Test
            </Button>
          </div>
        </Card>
      </section>

      {/* 5. Reusable KPI Metric Cards */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          KPI Metric Cards & Operational Trends
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Produksi Today"
            value="12.840"
            unit="TON"
            trend={8.4}
            trendText="vs kemari"
            icon={<Pickaxe className="h-5 w-5" />}
          />
          <MetricCard
            title="Ketersediaan Unit (PA)"
            value="92,4%"
            trend={1.2}
            trendText="vs target 90%"
            icon={<Truck className="h-5 w-5" />}
          />
          <MetricCard
            title="Konsumsi Solar B35"
            value="4.250"
            unit="LITER"
            trend={-3.1}
            trendText="vs estimasi"
            icon={<Fuel className="h-5 w-5" />}
          />
          <MetricCard
            title="Safety Incident Rate"
            value="0"
            unit="INCIDENT"
            subtitle="142 Hari Tanpa LTI"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          />
        </div>
      </section>

      {/* 6. AI Insight Card & Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Tren Produksi & Konsumsi Solar (Chart System)
            </h4>
            <MiningChart
              type="bar"
              data={chartData}
              series={[
                { dataKey: "target", name: "Target (Ton)", color: "#94A3B8" },
                { dataKey: "actual", name: "Aktual (Ton)", color: "#10B981" },
                { dataKey: "fuel", name: "Solar (Liter)", color: "#E5C158" },
              ]}
              xAxisKey="name"
            />
          </Card>
        </div>

        <div>
          <AIInsightCard
            title="Optimasi Alokasi Fleet Pit 2"
            insight="Terdapat bottleneck penumpukan 4 unit Dump Truck di Excavator EX-202 akibat kelambatan cycle time hauling road."
            recommendation="Realokasikan 2 unit DT ke Excavator EX-201 di Pit 1 North untuk menaikkan efisiensi ritase sebesar +6.8%."
            confidenceScore={96}
            onApplyRecommendation={() => showToast("success", "Rekomendasi AI Diterapkan", "Fleet dispatch otomatis disesuaikan.")}
          />
        </div>
      </section>

      {/* 7. Enterprise Data Table */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Enterprise Data Table Component
        </h3>
        <DataTable
          title="Status Operasional Fleet & Alat Berat Today"
          description="Monitoring real-time ritase, operator, dan status kesiapan alat tambang."
          data={sampleData}
          columns={columns}
          keyExtractor={(r) => r.id}
        />
      </section>

      {/* Reusable Modal Preview */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Konfirmasi Tindakan Operasional"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Konfirmasi
            </Button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin memperbarui data konfigurasi site lokasi tambang ini?</p>
      </Modal>
    </div>
  );
};
